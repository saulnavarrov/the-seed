/**
 * AuthenticatedJWT
 * @module Police
 * @description Verificara si la petición trae el token generado durante el inicio de sesión.
 * @author SaulNavarrov <Sinavarrov@gmail.com>
 * @created 2019/11/09
 * @version 1.0
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
module.exports = async function (req, res, next) {

  // Revisando consulta
  let validateToken = await sails.helpers.auth.validateTokenRequest(req);

  // Si la validación sale mal responda a los sucesos al usuario
  // corrrespondiente
  if (!validateToken.success) {
    return res.forbiddenJSON(validateToken);
  }

  // Validando id
  if (_.isUndefined(req.me)) {
    return res.forbiddenJSON();
  }
  else if (_.isUndefined(req.me.id)){
    return res.forbiddenJSON();
  }

  // Validando que el token le pertenesca al usuario que lo envio
  // En caso de que no hay ningun problema
  if ( validateToken.success && validateToken.user.id === req.me.id ) {
    // Continue
    return next();
  }

  // Respondiendo a la validacion de token y su usuario que valido
  return res.forbiddenJSON({
    success: false,
    type: 'ERROR_VALIDATE_TOKEN'
  });

};
