/**
 * Module dependencies
 */

// n/a



/**
 * 403 (Forbidden) Handler
 *
 * Usage:
 * return res.forbidden();
 *
 * e.g.:
 * ```
 * return res.forbidden();
 * ```
 */

module.exports = function forbidden (data) {

  // Get access to `res`
  var res = this.res;
  var req = this.req;

  // Get access to `sails`
  var sails = req._sails;

  // Log error to console
  if (!_.isUndefined(data)) {
    sails.log.verbose('Sending 403 ("forbidden") response: \n', data);
  }

  // Set Status Code
  res.status(403);

  // Con esto me envito la entrega de datos erroneos que vienen del sistema
  // cuando este en modo producción.
  if (process.env.NODE_ENV === 'production') {
    // Send status code and "Forbidden" message
    return res.sendStatus(403);
  }

  // si no hay datos en la variable, se usa res.sendStatus().
  if(_.isUndefined(data)){
    return res.sendStatus(403);
  }

  return res.json(data);

};
