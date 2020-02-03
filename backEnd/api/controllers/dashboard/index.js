/**
 * index.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/dashboard/index.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/03
 * @version 1.0
 */


module.exports = {

  friendlyName: 'Index',

  description: 'Index dashboard.',

  inputs: {  },

  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/',
    }
  },

  fn: async function (inputs,exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    let rq = this.req; // Request Cliente Page
    let TitlePage = sails.i18n('Login.title');

    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    // Respond with view.
    return exits.success({
      'titlePage': TitlePage
    });

  }
};
