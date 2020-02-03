

module.exports = function registersRouter(sails) {
  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: async function (done) {

      sails.log.info('Initializing hook... (`api/hooks/dashboard`)');

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
        '/-_-/*': {
          skipAssets: true,
          fn: async function (req, res, next) {

            // Configuración solo para los links de la api v2
            sails.log.info('se intenta acceder a la /-_-/');


            return next();
          }
        }
      }
    }
  };
};
