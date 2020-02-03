/**
 * create.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/create.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/02
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Create',

  description: `Creación de usuarios de trabajo.`,

  extendedDescription: `Formulario y control de nuevos usuarios agregados por el administrador o simplemente
  supervisados dependiendo de donde venga la solicitud`,


  inputs: {
    identification: {
      type:'string',
      example: 'CC1028004969',
      description: `Numero de identificacion de las personas sea cedula entre otras`,
      defaultsTo: undefined
    },
    emailAddress: {
      type: 'string',
      isEmail: true,
      example: 'usuarios@example.com',
      description: 'Correo electronico adjunto de la persona para que inicie sesion',
      defaultsTo: undefined
    },
    password: {
      type: 'string',
      maxLength: 64,
      minLength: 6,
      example: 'passwordLOL',
      description: 'Contraseña de usuario',
      defaultsTo: undefined
    },
    name: {
      type: 'string',
      example: 'Salvador Peranito',
      description: 'Nombres de la persona',
      defaultsTo: undefined
    },
    lastName: {
      type: 'string',
      example: 'Piedras del Rio',
      description: 'Apellidos de la persona',
      defaultsTo: undefined
    },
    phone: {
      type: 'string',
      example: '+573147267478',
      description: 'Telefono del la persona con indicador y todo',
      defaultsTo: undefined
    },
    role: {
      type: 'number',
      example: 0,
      description: 'Rol de la persona en Numero',
      defaultsTo: 9
    },
    isSuperAdmin: {
      type: 'boolean',
      example: false,
      description: 'Super Administrador',
      defaultsTo: false
    },
    emailStatus: {
      type: 'string',
      example: 'confirmed',
      description: `Confirmacion del usuario con el email. si vienen vacio se pondra "unconfirmed,"
      el cual obliga a la persona a confirmar la cuenta de email por seguridad esta puede ser cambiada
      por el usuario administrador con privilegio de super admin`,
      defaultsTo: undefined
    },
    status: {
      type: 'string',
      isIn: ['E', 'I', 'B', 'N', 'ID'],
      example: 'N',
      description: `Estado del usuario al momento luego de crear una nueva`,
      defaultsTo: 'ID'
    },
  },


  exits: {
    success: {
      statusCode: 200
    },

    noAuthorize: {
      responseType: 'unauthorized',
      description: 'No autorizado para hacer esta acción'
    },
  },


  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    const rq = this.req;
    const _ = require('lodash');
    const moment = require('moment');
    const userId = rq.session.userId || rq.me.id;
    let dateForm = {};





    /***************************************************************************************
     * BLOQUE DE SEGURIDAD SOCKET
     ***************************************************************************************/
    // Solo se aceptan solicitudes atravez de socket.io
    // if (!rq.isSocket) {
    //   return exits.noAuthorize({
    //     error: true,
    //     message: `Solicitud Rechazada.`
    //   });
    // }



    /***************************************************************************************
     * BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS
     ***************************************************************************************/



    /***************************************************************************************
     * BLOQUE DE DATOS OBLIGATORIOS Y REVISION DE DATA.
     ***************************************************************************************/



    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/

    // All done.
    return;
  }
};
