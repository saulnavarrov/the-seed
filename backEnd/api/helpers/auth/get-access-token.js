/**
 * get-access-token.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/helpers/auth/get-access-token.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/11/08
 * @version 1.0
 */

module.exports = {

  friendlyName: 'Get Access Token',

  description: `Devolver token de acceso de solicitud.
  Trabaja para sacar el token que viene desde la api y podelo
  tratar en su area funcional.`,

  inputs: {
    req: {
      type: 'ref',
      description: 'The current incoming request (req).',
      required: true
    },
    allParams: {
      type: 'ref',
      description: 'Todos los parametros que se envian, body, params mesclados',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Token encontrado.'
    },

    incorrect: {
      description: 'No se ha encontrado el token o no corresponde a lo buscado'
    }
  },

  fn: async function (inputs, exits) {
    let rq = inputs.req;
    let allPars = inputs.allParams;
    let token = null;

    // Busca el parametro en caso de que sea una solicitud Post mediante
    // Ajax o Socket
    if (rq.headers && rq.headers.authorization) {
      let parts = rq.headers.authorization.split(' ');

      if (parts.length === 2) {
        let scheme = parts[0];
        let credentials = parts[1];

        if (/^Bearer$/i.test(scheme)){
          token = credentials;
        }
      }
    } else {
      token = await allParams(allPars);
    }

    // Formateando salida del token
    if (_.isUndefined(token) ||  token === null) {
      return exits.success({
        success: false,
        token: 0,
        message: 'Token no encontrado en la solicitud.'
      });
    }
    // retorna null en caso de no tener ninguna propiedad
    return exits.success({
      success: true,
      token: token,
      message: 'Token encontrado en la solicitud.'
    });
  }

};


/**
   * gathers all params for this request
   *
   * @param  {Object} req the express request object
   * @return {Object}     all params
   * @api public
   */
async function allParams (allPars) {
  let token = allPars.access_token;

  if (_.isUndefined(token) ||  token === '') {
    return null;
  }

  return token;
}
