/**
 * TxRegNavigations.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  schema: true,
  tableName: 'TxRegNavigations',
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    'xforwarderfor' : {
      type: 'string'
    },

    'protocol' : {
      type: 'string'
    },

    'xforwardedproto' : {
      type: 'string'
    },

    'xrequeststart' : {
      type: 'string'
    },

    'host' : {
      type: 'string'
    },

    'url' : {
      type: 'string',
      columnType: 'varchar(4096) CHARACTER SET utf8mb4'
    },

    'isSocket' : {
      type: 'string'
    },

    'method' : {
      type: 'string'
    },

    'complete' : {
      type: 'string'
    },

    'opController' : {
      type: 'string'
    },

    'opAction' : {
      type: 'string'
    },

    'xnginxproxy' : {
      type: 'string'
    },

    'connection' : {
      type: 'string'
    },

    'cacheControl' : {
      type: 'string'
    },

    'upgradeInsecureRequests' : {
      type: 'string'
    },

    'userAgent' : {
      type: 'string',
      columnType: 'varchar(1024) CHARACTER SET utf8mb4'
    },

    'acceptEncodings' : {
      type: 'string'
    },

    'acceptLanguages' : {
      type: 'string'
    },

    'locale' : {
      type: 'string'
    },

    'cookie' : {
      type: 'string',
      columnType: 'varchar(1024) CHARACTER SET utf8mb4'
    },

    'dnt' : {
      type: 'string'
    },

    'ifNoneMatch' : {
      type: 'string'
    },

    'user' : {
      type: 'string'
    },

    'ipsl' : {
      type: 'string'
    },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

