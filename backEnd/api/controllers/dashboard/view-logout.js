/**
 * view-logout.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/dashboard/view-logout.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/03
 * @version 1.0
 */


module.exports = {

  friendlyName: 'View logout',

  description: 'Display "Logout" page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/logout'
    }
  },

  fn: async function (inputs,exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    let rq = this.req; // Request Cliente Page
    let TitlePage = sails.i18n('Login.title');


    sails.log.error('===============================>')
    sails.log.error('Eliminar esta función mas adelante');
    // Clear the `userId` property from this session.
    delete this.req.session.userId;

    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    // Respond with view.
    return exits.success({
      'titlePage': TitlePage
    });
  }
};
