/**
 * list.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/list.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/02
 * @version 1.0
 */

module.exports = {

  friendlyName: 'List',

  description: 'funcion find: entrega todos los datos encontrados de los usuarios.',

  extendedDescription: `Esta funcion recopila los datos de todos los usuarios en la DB
  los depocita al usuario autorizado para verlos, cuenta con:
  count: numero de resultados completo
  limit: limita la cantidad de datos a entregar
  skip: funciona para omisor de datos junto con el limit
  find: no funciona en esta accion`,

  inputs: {
    count: {
      type:'boolean',
      defaultsTo: false,
      description: `Permitira hacer el conteo de todos los usuarios
      este funcionara si esta activo y devolvera el numero de datos
      encontrados`
    },
    lim: {
      type: 'number',
      defaultsTo: 10,
      description: `Cantidad de resultados que entregara por cada
      llamada que se realize al listado`
    },
    sk: {
      type: 'number',
      defaultsTo: 0,
      description: `Omitira una cantidad de listados y visualizara en
      en cantidades por limites, usado para paginar la cantidad de resultados
      que se entregan en la vista`
    }
  },

  exits: {
    success: {
      description: 'Entrega de usuarios Exitosa.'
    },
    notFound: {
      responseType: 'notFoundData',
      description: 'Datos no encontrados de los usuario o no existe ninguno'
    },
    unauthorized: {
      statusCode: 401,
      responseType: 'unauthorized',
      description: 'No autorizado para ver los resultados de la pagina'
    }
  },


  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    const rq = this.req;
    let users = []; // array de usuario nuevo
    let userId = rq.session.userId;
    let isSocket = rq.isSocket;
    let count = 0;

    /***************************************************************************************
     * BLOQUE DE SEGURIDAD SOCKET Y LOGIN
     ***************************************************************************************/
    // Verificacion de usuario
    // if (!isSocket && (/^api$/i.test(rq.url)) && (/^v2$/i.test(rq.url))) {
    //   return exits.unauthorized({
    //     error: true,
    //     message: 'Unauthorized'
    //   });
    // }



    users = await TxUsers.find({});

    // All done.
    return exits.success({
      success: true,
      message: 'Lista de usuarios',
      list: users
    });

  }
};
