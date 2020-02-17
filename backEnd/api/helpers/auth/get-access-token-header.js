/**
 * get-access-token-header.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/helpers/auth/get-access-token-header.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2020/02/16
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Get access token header',

  description: `Busca dentro del header de cada petición si viene el token
  con el nombre de "Autorization", lo revela y lo devuelve sin el "Bearer"`,

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
      description: 'Return Get Access Token Header.'
    },
  },


  fn: async function (inputs,exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    let rq = inputs.req;
    let allPars = inputs.allParams;
    let token = null;


    /***************************************************************************************
     * BUSCANDO EL TOKEN DENTRO DE LA SOLICITUD
     ***************************************************************************************/
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
        type: 'INCORRECT',
        token: null,
        message: 'Token no encontrado en la solicitud.'
      });
    }

    // retorna null en caso de no tener ninguna propiedad
    return exits.success({
      type: 'SUCCESS',
      token: token,
      message: 'Token encontrado en la solicitud.'
    });

  }
};


/**
 * allParams()
 * @description busca el token dentro de la url, en caso de que venga incrustado.
 * @return {Object}     all params
 * @api public
 */
async function allParams (allPars) {
  // Nombre del parametro a pasar "access_token"
  let token = allPars.access_token;

  // Si no existe el token
  if (_.isUndefined(token) ||  token === '') {
    return null;
  }

  // Devuelvo el token
  return token;
}
