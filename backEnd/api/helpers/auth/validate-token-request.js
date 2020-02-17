/**
 * validate-token-token.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/helpers/auth/validate-token-token.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/11/08
 * @version 1.0
 */

module.exports = {

  friendlyName: 'Validate token request',

  description: 'Valida si el token que me han enviado es correcto y es funcional.',


  inputs: {
    req: {
      type: 'ref',
      description: 'The current incoming request (req).',
      required: true
    },
    credential: {
      type: 'ref',
      description: 'Credenciales enviadas luego de manipular todo el token en Base64.',
      required: true
    },
  },


  exits: {
    success: {
      description: 'Funciona correctamente.',
    },
  },


  fn: async function (inputs, exits) {
    let rq = inputs.req;
    let credential = inputs.credential || '';
    let ipAddress = rq.headers['x-real-ip'] || rq.ip;
    let urlRequest = rq.url || sails.config.custom.baseUrl[0]
    let _token =  credential.token || '';
    let _email =  credential.email || '';

    // Validando entrada de datos
    if (!credential) {
      sails.log.error(new Error('El argumento (credentials) es de uso obligatorio'));
      return exits.success({
        type: 'ERROR_CREDENTIALS',
        message: 'Se esperaban datos dentro de credential'
      });
    }

    // Validando Email
    if (!_email) {
      sails.log.error(new Error('El argumento (credentials.email) es de uso obligatorio'));
      return exits.success({
        type: 'ERROR_CREDENTIALS',
        message: 'Se esperaban datos dentro de credential.email'
      });
    }
    // Validando Token
    if (!_token) {
      sails.log.error(new Error('El argumento (credentials.token) es de uso obligatorio'));
      return exits.success({
        type: 'ERROR_CREDENTIALS',
        message: 'Se esperaban datos dentro de credential.token'
      });
    }

    // Guardo el token con el que estan haciendo la petición
    await saveJwtUse(_token, ipAddress, urlRequest);


    /**********************************************************************************
     * VALIDANDO TOKEN
     *
     * Valida el token que no este corrupto, revocado o no funcional para devolver
     * un error al usuario.
     */
    let valToken = await validateToken(_token);

    // Devolviendo errores al usuario
    if (valToken.type !== 'SUCCESS') {
      return exits.success({
        type: valToken.type,
        message: valToken.message
      });
    }


    /**********************************************************************************
     * VALIDANDO DUEÑO DEL TOKEN
     *
     * Valida que el token pertenece al Email del usuario que lo envio.
     */
    // Buscando al usuario perteneciente del token
    let findUserToken = await findUserFromToken(_token);

    // Validando Error
    if (findUserToken.type === 'FIND_OWNER_TOKEN'){
      return exits.success({
        type: findUserToken.type,
        message: findUserToken.message
      });
    }

    // Validando Usuario y dueño del token si coinciden o si no coinciden.
    if (findUserToken.user.emailAddress !== _email) {
      sails.log.verbose('FIND_OWNER_TOKEN: El email adjunto del token dismath con el token del usuario creado');
      return exits.success({
        type: 'FIND_OWNER_TOKEN',
        message: 'access token rejected'
      });
    }

    // return ok Success
    return exits.success({
      type: 'SUCCESS',
      message: 'Token y email Correctos: Next()'
    });

  }
};


 /**
 * validateToken
 *
 * @description decodifica el token si es correcto o no
 * @param {String} token codigo token
 * @created 2019/11/09
 * @version 1.0
 **********************************************************************************/
async function validateToken(token) {
  let jsonWebToken = sails.config.custom.jwtSecret;

  // Verificando que el token existe en la base de datos
  let findTokenDb = await findToken(token);

  // Existencia del token creado.
  if (findTokenDb.type === 'not built') {
    sails.log.debug('access token rejected, reason: NOT BUILT');
    return {
      type: findTokenDb.type,
      message: 'The token does not exist or is broken.'
    };
  }

  // Verificando si el token no ha sido revocado.
  else if (findTokenDb.token.revoked) {
    sails.log.debug('access token rejected, reason: REVOKED');
    return {
      type: 'REVOKED',
      message: 'Access to your token has been revoked.'
    };
  }

  // decodificando el token
  let _token = await decodeTokenUser(token);

  // estableciendo la hora actual
  let _reqTime = Date.now();

  // Si esta roto y no existe el token
  if (_token.error === 'error') {
    sails.log.debug('access token rejected, reason: NOT BUILT');
    return {
      type: 'NOT_BUILT',
      message: 'The token does not exist or is broken.'
    };
  }

  // Si el token ya caduco?
  if (_token.exp <= _reqTime) {
    sails.log.debug('access token rejected, reason: EXPIRED');
    return {
      type: 'EXPIRED',
      message: 'Your token is expired.'
    };
  }

  // Si el token esta vigente
  if (_reqTime <= _token.nbf) {
    sails.log.debug('access token rejected, reason: TOKEN EARLY');
    return {
      type: 'TOKEN_EARLY',
      message: 'This token is early.'
    };
  }

  // Si no coincide con la audiencia
  if (jsonWebToken.audience !== _token.aud) {
    sails.log.debug('access token rejected, reason: AUDIENCE');
    return {
      type: 'AUDIENCE',
      message: 'This token cannot be accepted for this domain.'
    };
  }

  // Success return
  return {
    type: 'SUCCESS',
    message: 'El token que se envio es Valido.'
  };
}



/**
 * findToken
 *
 * @description Busca el token si existe en la base de datos y lo entrega
 * tambien pide que guarde el token.
 * @param {String} token
 * @created 2019/11/09
 * @version 1.0
 **********************************************************************************/
async function findToken (token) {
  let _tok = token;

  // Trajendo el token de la base de datos.
  let findToken = await TxJwt.findOne({token: _tok});

  // Verificando existencia
  if (_.isUndefined(findToken)) {
    return {
      type: 'NOT_BUILT',
      message: 'El token que intenta usar no existe.'
    };
  }

  // Retorno exitoso de que lo ha encontrado.
  return {
    type: 'SUCCESS',
    token: findToken
  };
}


/**
 * decodeTokenUser
 *
 * @description Devuelve el token o el error en caso de que no exista
 * el token
 * @param {String} tok codigo token
 * @created 2019/11/09
 * @version 1.0
 **********************************************************************************/
async function decodeTokenUser(tok) {
  const jwt = require('jwt-simple');
  let _tok = null;

  try {
    _tok = jwt.decode(tok, sails.config.custom.jwtSecret.secret);
  }
  catch (err) {
    sails.log.error(new Error(err));
    return {
      error: 'error',
      message: err
    };
  }

  return _tok;
}


/**
 * findUserFromToken
 *
 * @description Busca la firma del usuario que genero el token
 * @param {json} tok Data Object
 * @created 2019/11/09
 * @version 1.0
 **********************************************************************************/
async function findUserFromToken (tok) {
  let _iss = tok;

  // Buscamos el Dueño del token
  let ownerFindToken = await TxJwt.findOne({token: _iss}).select(['id', 'owner']);

  // Buscamos los datos del dueño
  let userFindToken = await TxUsers.findOne({id: ownerFindToken.owner}).select(['id', 'emailAddress']);

  // Verificando si el usuario existe o no.
  if (_.isUndefined(userFindToken)) {
    sails.log.debug('access token rejected, reason: USER NO FIND');
    return {
      type: 'FIND_OWNER_TOKEN',
      message: 'access token rejected, reason: USER NO FIND'
    };
  }

  // Borrando contraseña
  delete userFindToken.password;

  // Devolviendo datos del usuario
  return {
    type: 'SUCCESS',
    user: userFindToken,
    message: 'Usuario encontrado exitosamente'
  };
}


/**
 * saveJwtUse
 *
 * @description Guardara el codigo token desde donde lo usando, en caso de que
 * exista o no y verificar si estan verificando o enviando aleatorios.
 * @param {String} token Codigo Token
 * @param {String} ipAddress Ip desde la que esta haciendo la petición
 * @created 2019/11/10
 * @version 1.0
 **********************************************************************************/
async function saveJwtUse (token, ipAddress, url) {
  let _token = token;
  let _ipAddress = ipAddress;
  let _url = url;

  // Configuración de guardado
  if (sails.config.custom.jwtSecret.trackUsage) {
    // pido la copia a la base de datos.
    let findTokenDb = await findToken(_token);

    // Existencia del token creado.
    if (findTokenDb.type === 'NOT_BUILT') {
      // Guardando token y que Ip lo esta usando.
      await TxJwtUse.create({
        tokenReside: false,
        pathUrl: _url,
        remoteAddress: _ipAddress,
        token: _token,
      });
    } else {
      // Guardando token y que Ip lo esta usando.
      await TxJwtUse.create({
        remoteAddress: _ipAddress,
        token: _token,
        pathUrl: _url,
        tokenReside: true,
        jsonWebToken: findTokenDb.token.id,
      });
    }

  }
}
