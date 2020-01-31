/**
 * unauthorized.js
 *
 * A custom response that content-negotiates the current request to either:
 *  • log out the current user and redirect them to the login page
 *  • or send back 401 (Unauthorized) with no response body.
 *
 * Example usage:
 * ```
 *     return res.unauthorized();
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       badCombo: {
 *         description: 'That email address and password combination is not recognized.',
 *         responseType: 'unauthorized'
 *       }
 *     }
 * ```
 */
module.exports = function unauthorized(data) {

  var req = this.req;
  var res = this.res;

  sails.log.verbose('Ran custom response: res.unauthorized()');

  // Set Status Code
  res.status(401);

  // Verifico que tenga dato, y enviar el status code
  if(_.isUndefined(data)){
    return res.sendStatus(401);
  }

  if (req.wantsJSON) {
    return res.sendStatus(401);
  }

  // Or log them out (if necessary) and then redirect to the login page.
  if (_.isError(data)) {
    if (!_.isFunction(data.toJSON)) {
      if (process.env.NODE_ENV === 'production') {
        return res.sendStatus(400);
      }
      // No need to JSON stringify (this is already a string).
      return res.send(util.inspect(data));
    }
  }


  // Set data json + 403
  return res.json(data);

};
