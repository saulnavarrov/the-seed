/**
 * logout.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/dashboard/auth/logout.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/03
 * @version 1.0
 */
module.exports = {


  friendlyName: 'Logout',


  description: 'Logout auth.',


  inputs: {

  },


  exits: {
    success: {
      description: 'Logout OK'
    }
  },


  fn: async function (inputs,exits) {

    delete this.req.sesion.userId;

    // All done.
    return exits.success();

  }


};
