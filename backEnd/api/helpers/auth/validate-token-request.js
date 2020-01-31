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
  },


  exits: {
    success: {
      description: 'Funciona correctamente.',
    },
  },


  fn: async function (inputs, exits) {
    let rq = inputs.req;
    let _token = null;
    let ipAddress = rq.headers['xforwardedfor'] || rq.headers['xrealip'];

    // Buscando token dentro de todos los parametros
    _token = await sails.helpers.auth.getAccessToken(rq, rq.allParams());

    // comenzando validadción
    if (_token.success) {
      // validando token
      let valToken = await validateToken(_token.token);

      // Guardando token usado
      await saveJwtUse(_token.token, ipAddress);

      // Devolviendo consulta
      return exits.success(valToken);
    }

    // el token no existe en la solicitud asi que se deniega
    return exits.success(_token);
  }
};



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
async function saveJwtUse (token, ipAddress) {
  let _token = token;
  let _ipAddress = ipAddress;

  // Configuración de guardado
  if (sails.config.custom.jwtSecret.trackUsage) {
    // pido la copia a la base de datos.
    let findTokenDb = await findToken(_token);

    // Existencia del token creado.
    if (findTokenDb.success === 'not built') {
      // Guardando token y que Ip lo esta usando.
      await JwtUse.create({
        remoteAddress: _ipAddress,
        token: _token
      });
    } else {
      // Guardando token y que Ip lo esta usando.
      await JwtUse.create({
        remoteAddress: _ipAddress,
        token: _token,
        tokenReside: true,
        jsonWebToken: findTokenDb.token.id,
      });
    }

  }
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
    sails.log.error({
      location: 'validate-token-request',
      message: err
    });
    return {
      error: 'error',
      message: err
    };
  }

  return _tok;
}



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
  if (findTokenDb.success === 'not built') {
    sails.log.debug('access token rejected, reason: NOT BUILT');
    return {
      success: false,
      token: 0,
      message: 'The token does not exist or is broken.'
    };
  }

  // Verificando si el token no ha sido revocado.
  else if (findTokenDb.token.revoked) {
    sails.log.debug('access token rejected, reason: REVOKED');
    return {
      success: false,
      token: 0,
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
      success: false,
      token: 0,
      message: 'The token does not exist or is broken.'
    };
  }

  // Si el token ya caduco?
  if (_token.exp <= _reqTime) {
    sails.log.debug('access token rejected, reason: EXPIRED');
    return {
      success: false,
      token: 0,
      message: 'Your token is expired.'
    };
  }

  // Si el token esta vigente
  if (_reqTime <= _token.nbf) {
    sails.log.debug('access token rejected, reason: TOKEN EARLY');
    return {
      success: false,
      token: 0,
      message: 'This token is early.'
    };
  }

  // Si no coincide con la audiencia
  if (jsonWebToken.audience !== _token.aud) {
    sails.log.debug('access token rejected, reason: AUDIENCE');
    return {
      success: false,
      token: 0,
      message: 'This token cannot be accepted for this domain.'
    };
  }

  // Buscando al usuario perteneciente del token
  let findUserToken = await findUserFromToken(_token);

  // retornando resultados
  return findUserToken;
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
  let findToken = await Jwt.findOne({token: _tok});

  // Verificando existencia
  if (_.isUndefined(findToken)) {
    return {
      success: 'not built',
      message: 'El token que intenta usar no existe.'
    };
  }

  // Retorno exitoso de que lo ha encontrado.
  return {
    success: 'success',
    token: findToken
  };
}



/**
 * findUserFromToken
 *
 * @description Busca la firma del usuario que genero el token
 * @param {json} token Data Object
 * @created 2019/11/09
 * @version 1.0
 **********************************************************************************/
async function findUserFromToken (token) {
  let _iss = token.iss.split('|');

  // Buscanso usuario
  let userFind = await Users.findOne({id: _iss[0]})
                            .select(['id', 'identification', 'name', 'lastName']);

  // Verificando si el usuario existe o no.
  if (_.isUndefined(userFind)) {
    sails.log.debug('access token rejected, reason: USER NO FIND');
    return {
      success: false,
      message: 'Usuario no encontrado'
    };
  }

  // Borrando contraseña
  delete userFind.password;

  // Devolviendo datos del usuario
  return {
    success: true,
    user: userFind,
    message: 'Usuario encontrado exitosamente'
  };
}
