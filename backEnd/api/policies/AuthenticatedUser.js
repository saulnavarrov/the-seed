/**
 * authenticatedUser
 * @module Police
 * @description Verificara que el usuario este autenticado.
 * @author SaulNavarrov <Sinavarrov@gmail.com>
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
module.exports = async function (req, res, next) {

  // Var Authenticated
  let authUser = req.session.userId;

  // Verificando
  if (authUser) {
    return next();
  }

  // Usuario no authenticado
  return res.forbiddenJSON({
    type: 'FORBIDDEN',
    message: `No está permitido realizar esta acción`
  });

}
