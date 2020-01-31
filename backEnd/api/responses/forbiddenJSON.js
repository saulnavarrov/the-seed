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

module.exports = function forbiddenJSON (data) {

  // Get access to `res`
  var res = this.res;
  var req = this.req;

  // Get access to `sails`
  var sails = req._sails;

  sails.log.verbose('Ran custom response: res.forbidden()');

  // Set Status Code
  res.status(403);

  // Verifico que tenga dato, y enviar el status code
  if(_.isUndefined(data)){
    return res.sendStatus(403);
  }

  // En caso de que sea una Request y necesite explicaciones JSON
  if (req.watsJSON) {
    return res.sendStatus(403).send('Prohibido el Acceso');
  }

  // Evito la entrega de errores poducidos en el Backend
  // en modo producción, solo si son errores criticos
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
