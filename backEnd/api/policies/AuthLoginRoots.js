/**
 * AuthLoginRoots
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
  let userAccess = {};

  // Por si el usuario esta tiene login
  if (userId) {
    sails.log.error('Restablecer la funcion que existe en este Police y revisarla de nuevo')
    return next();

    // Este solo dejara ingresar a los usuario que son de nivel 0 y 1 y que tambien sean superAdmins
    // ya que aqui se manejara el resto de usuarios y se podra ver otras cosas de la base de datos
    /*
    userAccess = await TxUsers.findOne({id: userId}).populate('rols');

    // Verificando Rol del usuario Solo se permiten el ingreso
    // a usuarios rol 0 y 1 y Super admins=true
    if (( userAccess.rols.ident === 0 || userAccess.isSuperAdmin ) &&
    ( userAccess.rols.ident === 1 || userAccess.isSuperAdmin )) {
      return next();
    }

    // Usuario no authenticado para respuestas ajax & sockect.io
    if (req.wantsJSON || !res.view) {
      return res.forbiddenJSON({
        type: 'FORBIDDEN',
        message: `No está permitido realizar esta acción`
      });
    }

      */
  }

  // Redireccionando si no existe una sesión abierta
  return res.redirect('/-_-/login');
};
