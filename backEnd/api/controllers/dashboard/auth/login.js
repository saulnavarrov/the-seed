/**
 * login.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/dashboard/auth/login.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/03
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Login',

  description: 'POST Login auth.',

  extendedDescription: `This action attempts to look up the user record in the database with the
specified email address.  Then, if such a user exists, it uses
bcrypt to compare the hashed password from the database with the provided
password attempt.`,

  inputs: {
    emailAddress: {
      type: 'string',
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      example: 'irl@example.com'
    },

    password: {
      type: 'string',
      description: 'The unencrypted password to try in this attempt, e.g. "passwordlol".',
      example: 'PasswordLoL123'
    },

    rememberMe: {
      type: 'boolean',
      defaultsTo: false,
      description: 'Whether to extend the lifetime of the user\'s session.',
      extendedDescription:
`Note that this is NOT SUPPORTED when using virtual requests (e.g. sending
requests over WebSockets instead of HTTP).`,
    }
  },

  exits: {
    success: {
      description: 'The requesting user agent has been successfully logged in.',
    },

    badCombo: {
      responseType: 'unauthorized',
      description: `The provided email and password combination does not
      match any user in the database.`,
    },

    blocked: {
      responseType: 'userBlocked',
      description: `Devuelve una respuesta de un usuario que esta siendo bloqueado,
      por intentos fallidos al iniciar la sesion`
    }
  },

  fn: async function (inputs,exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    const rq = this.req;
    const rs = this.res;
    const _ = require('lodash');
    let userId = rq.session.userId;
    let emailAddress = inputs.emailAddress;
    let rememberMe = inputs.rememberMe;
    let password = inputs.password;
    let updatedAt = Date.now();
    let attemptsLogin = sails.config.custom.attemptsLogin;
    let attemptsTime = sails.config.custom.attemptsTime;
    let ipAddress = rq.headers['xforwardedfor'] || rq.headers['xrealip'];
    let emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;



    /***************************************************************************************
     * BLOQUE DE SEGURIDAD SOCKET (Desctivado) Usando Ajax
     ***************************************************************************************/
    // Solo se aceptan solicitudes atravez de socket.io
    // Reescrito para aceptar solicitudes con Ajax (Axios)
    if (rq.isSocket) {
      return exits.noAuthorize({
        error: true,
        message: `Socket.io no soportado.`
      });
    }


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS
     ***************************************************************************************/
    // Soportado por el police y el hook
    // Verifico si hay una session iniciada, si no es asi
    // redirija al login
    if (userId) {
      return this.res.forbidden({
        type: 'SESSION_INIT',
        message: 'No se permitido reiniciar la sesión abierta'
      });
    }




    /***************************************************************************************
     * BLOQUE DE DATOS OBLIGATORIOS Y REVISION DE DATA.
     ***************************************************************************************/
    // Evaluando Email
    let email = _.isUndefined(inputs.emailAddress) ? false : true;
    email = _.isNull(inputs.emailAddress) ? false : true;
    email = !emailRegex.test(inputs.emailAddress) ? false : true;

    // Evaluando Password
    let pass = _.isUndefined(inputs.password) ? false : true;
    pass = _.isNull(inputs.password) ? false : true;
    pass = inputs.password === '' ? false : true;

    // evaluando Email y respondiendo
    if (!email || !pass) {
      let em = {
        email: !email ? 'is-invalid' : '',
        pass: !pass ? 'is-invalid' : ''
      };

      // reponse
      rs.status(400);
      return rs.json({
        status: 400,
        error: true,
        message: 'Revise sus Credenciales y vulevalo a intentar',
        form: em
      });
    }



    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    // buscamos el usuario en la base de datos
    let userRecord = await TxUsers.findOne({
      emailAddress: emailAddress.toLowerCase(),
    });

    // Si no existe el correo Electronico devuelve que no existe
    if (!userRecord) {
      // Intento fallido o de ataque
      await attemptsLoginFailSee({
        em: emailAddress.toLowerCase(),
        id: 1,
        s: false,
        ip: ipAddress,
        port: rq.protocol,
        type: 'attempt'
      });

      rs.status(401);
      return rs.json({
        error: true,
        success: false,
        type: 'E-Sr-Ps-NF',
        text: 'Error de usuario y contraseña.',
      });
    }


    // Solo se le dara un inicio de session a las personas que este habilitadas,
    // y con el correo electronico confirmado, sino se les devolvera un error.
    if (userRecord.status === 'B' ||
        userRecord.status === 'I' ||
        userRecord.status === 'N' ||
        userRecord.status === 'ID' ||
        userRecord.emailStatus === 'unconfirmed' ||
        userRecord.emailStatus === 'changeRequested') {
      await attemptsLoginFailSee({
        em: emailAddress.toLowerCase(),
        id: userRecord.id,
        s: false,
        ip: ipAddress,
        port: rq.protocol,
        type: 'attempt'
      });

      this.res.status(401);
      return this.res.json({
        error: true,
        success: false,
        type: 'E-Sr-Blck-N-Confir',
        text: {
          Inactive: userRecord.status === 'I' ? 'Este usuario se encuntra suspendido o bloqueado, por favor comuniquese con soporte para tener mas información. ' : '',
          block: userRecord.status === 'B' ? 'El usuario se bloqueo por seguridad, lo invitamos a cambiar su contraseña y volverlo a intentar. ' : '',
          confirmed: userRecord.emailStatus !== 'confirmed' ? 'Confirme su Email para porder acceder. ' : ''
        }
      });
      // throw 'badCombo';
    }


    // Verificación de la contraseña si coincide con la que esta guardada
    let ckeckPass = await sails.helpers.passwords.checkingPassword(
      password,
      userRecord.password
    );

    // Respondiendo en caso de que no coincida la contraseña
    if (ckeckPass.success === 'INCORRECT') {
      // Reportar intentos en la base de datos
      // si supera los 5 intentos en menos de 1 hora
      // se bloqueara la cuenta y tendra que cambiar de contraseña
      // para poder desbloquear la cuenta.
      // se llevar el registro en attemptsLogin
      // tanto los intentos como el login
      // attemptsTime = sails.config.custom.attemptsTime;

      // Guardo el intento fallido
      await attemptsLoginFailSee({
        em: emailAddress.toLowerCase(),
        id: userRecord.id,
        s: false,
        ip: ipAddress,
        port: rq.protocol,
        type: 'attempt'
      });

      // Restando el tiempo de 1 hora cuando intento ingresar.
      let tampsTime = (Date.now() - attemptsTime);

      // Criterio de busqueda de datos de las fallas de los usuarios
      let criterioFinds = {
        'user': userRecord.id,
        'created': {
          '>=': tampsTime
        },
      };

      // Evaluo cuantos intetos tiene en la ultima hora.
      let failsSession = await TxAttemptsLogins.find(criterioFinds).sort('id DESC');

      // evaluación de la cuentas para bloquearlas por maximos intentos
      let intentos = -1 ; // Cuenta los intentos fallidos para iniciar session

      // Recopila los intentos fallidos hasta la ultima vez que inicio sesión
      // es como si se reiniciara el contador
      for (let lo = 0; lo < failsSession.length; lo++) {
        let fails = failsSession[lo];
        intentos++;
        if (fails.success === true || fails.successType === 'blockade') {
          lo = failsSession.length + 99;
        }
      }
      sails.log(failsSession)
      sails.log(`Intentos = ${intentos}`)
      // Evaluacion para bloquear la cuenta
      if (intentos >= attemptsLogin) {
        sails.log.warn(`Se ha bloqueado el usario '${userRecord.names}' por superar el numero de intentos permitidos`);

        // Generando token
        let emailProofToken = await sails.helpers.strings.random('url-friendly');

        // User Attemps Bloqueado
        await attemptsLoginFailSee({
          em: emailAddress.toLowerCase(),
          id: userRecord.id,
          s: false,
          ip: ipAddress,
          port: rq.protocol,
          type: 'blockade'
        });

        // Bloqueando usuario por intentos fallidos
        await TxUsers.update({
          id: userRecord.id
        })
        .set({
          status: 'B',
          emailProofToken: emailProofToken,
          emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
          updatedAt: updatedAt
        });

        // Enviando correo de que el usuario se ha bloqueado
        await sails.helpers.sendTemplateEmail.with({
          to: userRecord.emailAddress,
          subject: 'Tu acceso ha sido bloqueado',
          template: 'email-notificacion-usuario-bloqueado',
          templateData: {
            fullName: `${userRecord.names}`,
            Email: `${userRecord.emailAddress}`,
            token: emailProofToken
          }
        });

        // retorno que la cuenta fue bloqueada
        return exits.blocked();
      }

      // Retorno del error
      return exits.badCombo();
    }

    // Si "Recordarme" estaba habilitado, entonces mantén viva la sesión para
    // una mayor cantidad de tiempo. (Esto provoca una actualización de "Establecer cookie"
    // encabezado de respuesta que se enviará como resultado de esta solicitud, por lo tanto
    // debemos tratar con una solicitud HTTP tradicional para
    // esto para trabajar.)
    if (rememberMe) {
      if (rq.isSocket) {
        sails.log.warn(
          'Se recibió `rememberMe: true` de una solicitud virtual, pero se ignoró \ n ' +
          'porque la cookie de sesión de un navegador no se puede restablecer a través de sockets. \ n' +
          'Por favor, use una solicitud HTTP tradicional en su lugar.'
        );
      } else {
        rq.session.cookie.maxAge = sails.config.custom.rememberMeCookieMaxAge;
      }
    } else {
      rq.session.cookie.maxAge = sails.config.custom.rememberMeCookieMinAge;
    }


    // Guardo cuando ha iniciado sesión
    await attemptsLoginFailSee({
      em: emailAddress.toLowerCase(),
      id: userRecord.id,
      s: true,
      ip: ipAddress,
      port: rq.protocol,
      type: 'login'
    });

    // Modify the active session instance.
    rq.session.userId = userRecord.id;

    // Generando token del usuario autenticado
    let tokenizacion = await sails.helpers.auth.generateUserToken(userRecord, ipAddress);

    // Adjuntando Ip de inicio de sesion
    await TxUsers.update({
      id: userRecord.id
    })
    .set({
      tosAcceptedByIp: rq.headers['x-real-ip'] || rq.ip,
    });

    // Borrando contraseña y otros datos
    delete userRecord.password;
    !userRecord.isSuperAdmin && delete userRecord.isSuperAdmin;
    delete userRecord.passwordResetToken;
    delete userRecord.passwordResetTokenExpiresAt;
    delete userRecord.emailProofToken;
    delete userRecord.emailProofTokenExpiresAt;
    delete userRecord.emailStatus;
    delete userRecord.emailChangeCandidate;

    // Encoded token
    let tokenEncode = await sails.helpers.utilities.btoaBase64(`${userRecord.emailAddress}|Bearer ${tokenizacion.token}`);

    // All done.
    // Respond with view.
    return exits.success({
      login: 'success',
      user: userRecord,
      token: tokenEncode
    });

  }
};


// Guarda los registros de intentos de sessión
async function attemptsLoginFailSee(dat) {
  // sails.log('Guardando datos de session');
  await TxAttemptsLogins.create({
    email: dat.em,
    successType: dat.type,
    user: dat.id,
    success: dat.s,
    ip: dat.ip,
    port: dat.port
  });
}

