/**
 * view-index.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/dashboard/users/view-index.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/15
 * @version 1.0
 */

module.exports = {

  friendlyName: 'View index',

  description: 'Display "Index" page.',

  inputs: {},

  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/users/index'
    }
  },


  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    let rq = this.req; // Request Cliente Page
    let TitlePage = 'Users' || sails.i18n('Users');
    let menu = {
      'l1': 'users',
      'l2': 'users-list',
      'l3': null
    };


    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    // Respond with view.
    return exits.success({
      'titlePage': TitlePage,
      'menu': menu
    });
  }
};
