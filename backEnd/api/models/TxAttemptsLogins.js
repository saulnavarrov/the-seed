/**
 * TxAttempsLogins.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  schema: true,
  tableName: 'TxAttemptsLogins',
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    email: {
      type: 'string',
      required: true,
      isEmail: true,
      maxLength: 200,
      example: 'carol.reyna@microsoft.com'
    },

    successType: {
      type: 'String',
      defaultsTo: 'attempt',
      isIn: ['login', 'logout', 'attempt','blockade'],
    },

    success: {
      type: 'boolean',
      defaultsTo: false
    },

    ip: {
      type: 'string'
    },

    port: {
      type: 'string'
    },

    created: {
      type: 'number',
    },

    // Desabilitando atributo
    updatedAt: false,

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    user: {
      model: 'txusers'
    }

  },


  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗╔═╗  ╔═╗╦  ╔═╗╔═╗╔╦╗╔═╗╔═╗
  //  ║  ║╠═ ╠╣ ║  ╚╦╝║  ║  ╠╣ ╚═╗  ║  ║  ╠╣ ╠═╣ ║ ╠╣ ╚═╗
  //  ╚═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╚═╝╚═╝╚═╝  ╚═╝╚═╝╚═╝╩ ╩ ╩ ╚═╝╚═╝
  beforeCreate: async (valueToCreate, proceed) => {
    const _ = require('@sailshq/lodash');

    // creando hora de registro
    valueToCreate.created = Date.now();

    // retorno de datos
    return proceed();
  },
};

