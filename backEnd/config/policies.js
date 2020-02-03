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

  'dashboard/index': (req,res,next)=>{
    let userId = req.session.userId;
    sails.log('police')

    if(userId) {
      return next();
    }

    return res.redirect('/-_-/login')
  },

};
