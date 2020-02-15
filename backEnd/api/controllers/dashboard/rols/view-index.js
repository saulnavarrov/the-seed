/**
 * view-index.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/dashboard/rols/view-index.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/15
 * @version 1.0
 */

module.exports = {

  friendlyName: 'View index',

  description: 'Display "Index" page.',

  inputs: { },

  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/rols/index'
    }
  },

  fn: async function (inputs,exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    let rq = this.req; // Request Cliente Page
    let TitlePage = sails.i18n('Rols.Title');
    let menu = {
      'l1': 'users',
      'l2': 'rols',
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
