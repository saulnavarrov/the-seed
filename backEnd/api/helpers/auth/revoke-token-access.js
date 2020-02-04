module.exports = {


  friendlyName: 'Revoke token access',


  description: '',


  inputs: {
    req: {
      type: 'ref',
      description: 'The current incoming request (req).',
      required: true
    },
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    // Variables
    let rq = inputs.req;
    let _token = null;
    // let ipAddress = rq.headers['xforwardedfor'] || rq.headers['xrealip'];

    // Buscando token para rebocarlos
    _token = await sails.helpers.auth.getAccessToken(rq, rq.allParams());

    // actualizando token
    if (_token.success === 'no built') {
      // token no encontrado
      return exits.success({
        success: false,
        type: 'TOKEN_NOT_FOUND',
        message: 'Token no Found, not reboked'
      });
    }

    // aqui fue cuando encontro el token y le actualizo la rebocacion del token
    if (_token.success === true) {
      // Actualizando el token en la base de datos.
      // Revocando el token actual con el que se estaba autenticando
      await revokedTokenDb(_token.token);

      // Revocando anteriores accesos para este usuario
      await revokedTokenUserDb(rq.session.userId);

      // devolviendo consulta
      return exits.success({
        success: true,
        type: 'TOKEN_REVOKED',
        message: 'El token ha sido revocado exitosamente'
      });
    }

    // En caso de algun problema se presente
    sails.log.error(new Error('Token no encontrado y no revocado'));
    return exits.success({
      success: false,
      type: 'ERROR_TOKEN',
      message: 'Se presento un problema con el token, hablar con el admin.'
    });
  }
};


/**
 * revokedTokenUserDb
 *
 * @description Reboca todos los Tokens abiertos del usuario
 * @param {String} userId Usuario a revocar
 * @created 2019/11/15
 * @version 1.0
 */
async function revokedTokenUserDb(userId) {
  // Revocando anteriores accesos para este usuario
  await TxJwt.update({owner: userId, revoked: false})
        .set({
          revoked: true
        });
}


/**
 * revokedTokenDb
 *
 * @description actualiza la revocacion por tokens abierto
 * @param {String} token TextSecrect
 * @created 2019/11/15
 * @version 1.0
 */
async function revokedTokenDb(token){
  let _token = token;

  await TxJwt.update({token: _token})
        .set({
          revoked: true
        });
}
