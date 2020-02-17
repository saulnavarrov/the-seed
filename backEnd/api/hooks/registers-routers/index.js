

module.exports = function registersRouter(sails) {
  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: async function (done) {

      sails.log.info('Initializing hook... (`api/hooks/registers-routers`)');

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
        '/*': {
          skipAssets: true,
          fn: async function (req, res, next) {

            // Usar en caso de que no encuentre el supuesto sesion
            // let ss = typeof (req.session) === 'undefined' ? true : false; // control de sesion
            // let guser = typeof (req.query.guser) === 'undefined' ? 'Guest' : req.query.guser; // Identifica el usuario que hace la solicitud con la url full
            let userId = typeof (req.session.userId) === 'undefined' ? 'Guest' : req.session.userId;

            let ip = req.headers['x-real-ip'] || req.ip;

            let datosReg = {
              'protocol': req.protocol,
              'xforwardedproto': req.headers['x-forwarded-proto'],
              'xrequeststart': req.headers['x-request-start'],
              'host': typeof (req.headers['host']) === 'undefined' ? req.headers['origin'] : `${req.protocol}://${req.headers['host']}`,
              'url': req.url || sails.config.custom.baseUrl[0],
              'isSocket': req.isSocket || false,
              'method': req.method,
              'complete': req.complete,
              'opController': req.options['controller'],
              'opAction': req.options.action,
              'xnginxproxy': req.headers['x-nginx-proxy'],
              'connection': req.headers['connection'],
              'cacheControl': req.headers['cache-control'],
              'upgradeInsecureRequests': req.headers['upgrade-insecure-requests'],
              'userAgent': req.headers['user-agent'],
              'acceptEncodings': req.headers['accept-encoding'],
              'acceptLanguages': req.headers['accept-lenguage'] || req.i18n.locale,
              'locale': req.i18n.locale,
              'cookie': req.headers['cookie'],
              'dnt': req.headers['dnt'],
              'ifNoneMatch': req.headers['if-none-match'],
              'user': userId,
            };

            // Pega datos en caso de que sea enviados por socket
            if (req.isSocket) {
              datosReg.xnginxproxy = req.socket.handshake.headers['x-nginx-proxy'];
              datosReg.connection = req.socket.handshake.headers['connection'];
              datosReg.cacheControl = req.socket.handshake.headers['cache-control'];
              datosReg.upgradeInsecureRequests = req.socket.handshake.headers['upgrade-insecure-requests'];
              datosReg.userAgent = req.socket.handshake.headers['user-agent'];
              datosReg.acceptEncodings = req.socket.handshake.headers['accept-encoding'];
              datosReg.acceptLanguages = req.socket.handshake.headers['accept-lenguage'];
            }

            // Guarda la ip
            datosReg.ipsl = ip;

            // Ip de petición
            sails.log.verbose(`Nueva peticion desde la Ip: '${datosReg.method}' ${datosReg.ipsl}`);

            // Envia los datos para ser guardados
            // await saveDataLogsNavigations(datosReg);
            await TxRegNavigations.create(datosReg);

            return next();
          }
        }
      }
    }
  };
};
