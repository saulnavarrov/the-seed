/**
 * blank-page.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/dashboard/blank-page.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/05
 * @version 1.0
 */

module.exports = {

  friendlyName: 'View blank page',

  description: 'Display "Blank" page.',

  inputs: {  },

  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/blank-page'
    }
  },


  fn: async function (inputs,exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    let rq = this.req; // Request Cliente Page
    let TitlePage = 'Blank-page'; // sails.i18n('Login.title');
    let menu = {
      'l1': 'blank-page',
      'l2': null,
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
