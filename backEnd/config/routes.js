/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': async (req, res) => {
    return res.send(`<center><h1>Server Ok <span style="color: #009d3a;">✔</span></h1></center>`);
  },

  // Esqueleto del dashboard
  'GET /-_-/blank-page': { action: 'dashboard/view-blank-page' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/

  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝
  'GET /-_-/':        { action: 'dashboard/index',      locals:{layout:'layouts/dashboard'} },
  'GET /-_-/login':   { action: 'dashboard/view-login', locals:{layout:'layouts/login'} },
  'GET /-_-/logout':  { action: 'dashboard/view-logout', locals:{layout:'layouts/login'} },
  'GET /-_-/forgot':  { action: 'dashboard/view-forgot', locals:{layout:'layouts/login'} },
  'GET /-_-/singup':  { action: 'dashboard/view-singup', locals:{layout:'layouts/login'} },


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // AUTHS
  'POST /api/v2/auth/login':                          { action: 'dashboard/auth/login' },
  'POST /api/v2/auth/logout':                         { action: 'dashboard/auth/logout' },
  'POST /api/v2/auth/forgot':                         { action: 'dashboard/auth/forgot' },
  'POST /api/v2/auth/singup':                         { action: 'dashboard/auth/singup' },

  // USERS
  'POST /api/v2/users':                               { action: 'users/list' },
  'POST /api/v2/users/create':                        { action: 'users/create' },


  //  ╔═╗╔═╗╦  ╔═╗╦ ╦ ╔═╗ ╔═╗
  //  ╠═╣╠═╝║  ╠╣ ║ ║ ╠╣  ╚═╗
  //  ╩ ╩╩  ╩  ╩  ╩ ╚═╚═╝ ╚═╝


  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
