

module.exports = function registersRouter(sails) {
  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: async function (done) {

      sails.log.info('Initializing hook... (`api/hooks/apis`)');

      return done();
    },

    routes: {
      /**
       * Runs before every matching route.
       *
       * @param {Ref} req
       * @param {Ref} res
       * @param {Function} next
       */
      before: {
        '/api/v2/*': {
          skipAssets: true,
          fn: async function (req, res, next) {
            // Configuración solo para los links de la api v2
            sails.log.info('>Se intenta acceder a la api/v2');

            /***************************************************************************************
             * VARIABLES INICIALES
             ***************************************************************************************/
            const _ = require('@sailshq/lodash');
            let isSocket = req.isSocket;
            let urlPath = req.url || '';
            let headerToken = {};
            let decodeToken = {};
            let validateToken = {};

            /***************************************************************************************
             * OMITIENDO ALGUNAS URL PARA USAR TOKENS
             ***************************************************************************************/
            if (
              urlPath === '/api/v2/auth/login' ||
              urlPath === '/api/v2/auth/forgot'
            ) {
              sails.log.verbose('>= Omitiendo Token de Url');
              return next();
            }



            /***************************************************************************************
             * TRABAJANDO CON TOKENS
             ***************************************************************************************/
            /*****************************************************************************
             * Extraemos el token de la Petición del Header
             *
             * Se encarga de buscar el token que venga incluido en la petición
             * del usuario que se encarga de adjuntarla en el HEADER bajo el
             * nombre de "Authorization"
             */
            headerToken = await sails.helpers.auth.getAccessTokenHeader(req, req.allParams());

            // Validando la existencia del token
            // > Si el token no existe o viene sin Bearer no pasara
            if (headerToken.type === 'INCORRECT') {
              return res.forbiddenJSON({
                message: 'Missing Authentication Token'
              });
            }


            /*****************************************************************************
             * Decodificando Token que esta en Base
             *
             * Aqui decodificamos el Token que viene, este me lo entrega en Strign
             * pero como es un texto en BASE64 tengo que mandarlo a decodificar porque
             * contiene 2 parametros:
             * > Email: de quien genero el token,
             * > Token: Este texto del token
             *
             * Todo esto para ser decodificado y devuelto en un JSON formado por el
             * Email y el Token nada mas (token sin Bearer), todo esto solo para ser validado
             * En el proximo Helpers
             *****************************************************************************/
            decodeToken = await sails.helpers.auth.decodeToken.with({
              token: headerToken.token
            });

            // Devuelvo error si no hay token
            if ( decodeToken.type === 'ERROR_TOKEN') {
              return res.forbiddenJSON({
                message: 'Error Authorization Token'
              });
            }

            // Verifico Errores del helper "decodeToken"
            if (decodeToken.type === 'ERROR_BASE64') {
              return res.forbiddenJSON({
                message: 'Error Authorization Token'
              });
            }


            /*****************************************************************************
             * Validamos el token que me enviaron
             *
             * aqui validare el token que me enviaron en la petición junto con el email
             * del dueño que realiza la petición
             *
             * Nota:
             * hay un gran peligro donde el token caiga en manos de otra persona
             * o pueda ser capturado en alguna transacción porque puede dañar los
             * registros.
             */
            validateToken = await sails.helpers.auth.validateTokenRequest.with({
              req,
              credential: {
                email: decodeToken.data.email,
                token: decodeToken.data.token
              }
            });

            // Validando Errores
            if (validateToken.type === 'ERROR_CREDENTIALS') {
              return res.forbiddenJSON({
                message: 'Error Autorization Token'
              });
            }

            // Validando Resto de Errores que puedan pasar
            if (validateToken.type !== 'SUCCESS') {
              return res.forbiddenJSON({
                message: validateToken.message
              });
            }


            /***************************************************************************************
             * BLOQUE DE SEGURIDAD SOCKET
             ***************************************************************************************/
            // Verificacion de usuario
            if (!isSocket) {
              return res.forbiddenJSON({
                message: 'AJAX Inadmissible Petition'
              });
            }


            // Continue return sin problema
            return next();
          }
        },

        '/api/v3/*': {
          skipAssets: true,
          fn: async function (req, res, next) {

            // Configuración solo para los links de la api v2
            sails.log.info('se intenta acceder a la api/v3');


            return next();
          }
        },
      }
    }
  };
};
