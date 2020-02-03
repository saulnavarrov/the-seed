/**
 * TxUsersRolsPermits.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  schema: true,
  tableName: 'TxUsersRolsPermits',
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    Tipo: {
      type: 'String',
      isIn: ['V', 'M', 'F'],
      defaultsTo: '',
      description: `Defino el tipo de permisos, esta va a corresponder si es un modelo o una pagina (Vista)
      Ejemplo Pagina:
      acceso a la dashboard
      tipo: pagina              "Tipo de la pagina"
      acceso: $host/dashboard   "Dirección de la pagina"
      accion: view              "Vista de la pagina"
      permiso: O                "Permitido"

      Ejemplo: informacion
      datos de la dashboard
      tipo: modelos
      acceso: $host/api/v2/dashbaord/
      accion: post
      permiso: O

      (2) Ejemplo Ver usuario concreto
      abrir el html para verlo
      tipo: pagina
      acceso: $host/users
      action: find-one
      permiso: O

      traer los datos de la base de datos
      tipo: model
      acceso: $host/api/v2/users/find-one
      accion: post
      permiso: O

      permiso denegado
      tipo: model
      acceso: $host/api/v2/users/find-one
      accion: post
      permiso: X
      `,
    },

    Acceso: {
      type: 'string',
      unique: true,
      description: `Pagina a la que esta permitida, esta es del modelo o la pagina esta accediendo la persona`
    },

    Accion: {
      type: 'string',
      defaultsTo: '',
      description: `tipo de accion que puede hacer la persona, editar, ver, guardar cambios, crear entre otros`
    },

    Permiso: {
      type: 'string',
      maxLength: 1,
      isIn: ['X','O',''],
      defaultsTo: 'X',
      description: `Aqui defino si la persona tiene el permiso de acceso
      para realizar la accion que esta haciendo.
      X: No tiene permisos
      O: Tiene permisos`
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    usersrols: {
      model: 'txusersrols'
    }
  },

};

