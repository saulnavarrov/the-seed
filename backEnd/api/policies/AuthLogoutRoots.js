/**
 * AuthLogoutRoots
 * @module Police
 * @description Verificara que el usuario este autenticado.
 * @author SaulNavarrov <Sinavarrov@gmail.com>
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 * @created 2019/02/03
 * @version 1.0
 */
module.exports = async function (req, res, next) {

  // Traigo el id del usuario.
  let userId = req.session.userId;

  // Por si el usuario esta tiene login
  if (!userId) {
    return next();
  }

  // Redireccionando si no existe una sesión abierta
  return res.redirect('/-_-/');
};
