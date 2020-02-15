/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  '*': true,

  // // Auth
  // 'dashboard/auth/*': true,
  // // dashboard
  // // 'dashboard/*': ['AuthenticatedUser']

  // 'dashboard/index': (req,res,next)=>{
  //   let userId = req.session.userId;
  //   sails.log('police')

  //   if(userId) {
  //     return next();
  //   }

  //   return res.redirect('/-_-/login')
  // },

  // Auth
  'dashboard/auth/*': true,
  'dashboard/view-login' : ['AuthLogoutRoots'],
  'dashboard/view-singup': ['AuthLogoutRoots'],
  'dashboard/view-forgot': ['AuthLogoutRoots'],
  'dashboard/view-logout': ['AuthLoginRoots'],

  // dashboard
  'dashboard/index': ['AuthLoginRoots'],
  'dashboard/view-blank-page': ['AuthLoginRoots'],

};
