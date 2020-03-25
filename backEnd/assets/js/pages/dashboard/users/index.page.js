parasails.registerPage('users-index', {

  //  ╔╗ ╔╗╦╔╗ ╔╗╦╔╗ ╦╔═╗
  //  ║╚╦╝║║ ╠═╣ ║║╚╗║╚═╗
  //  ╩   ╩╩╚╝ ╚╝╩╩ ╚╝╚═╝
  mixins: [globalData, globalFunctions],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    userData: {}, // Usuarios individuales
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: async function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);

    // trae toda la base de datos de usuarios
    await this.getListDb();
  },
  mounted: async function() {
    //…
    if (SAILS_LOCALS['_environment'] === 'development') {
      console.log('> Init Module Users list.page');
      console.log(this.globalData);
      console.log(this.globalFunctions);
    }
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…

    /**
     * getListDb()
     * @description :: Esta funcion llama a la base de datos y trae 10 primeros
     * resultados, el usuario puede tambien cambiar la cantidad de resultados
     * y la paginacion que desea ver.
     * Cuenta con la opcion de buscador integrado.
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    getListDb: async function () {
      const csrfToken = window.SAILS_LOCALS._csrf;
      const getToken = await this.getToken();
      let urls = this.urlApi+'/v2/users';

      // Activa el ProgressBar de cargando usuarios
      !this.progressBar.active ? this.progressBarD(true, 'fadeInRight faster') : '';

      // Data enviada a la API
      let data = {
        lim: this.limit,
        sk: this.skip,
      };

      // Control de urls find or findOne
      if (this.searching) {
        urls = '/v2/users/search';
        data.finds = this.searchsText;
      }

      // Request list users
      await io.socket.request({
        url: urls,
        method: 'post',
        data: data,
        headers: {
          'content-type': 'application/json',
          'Authorization': getToken,
          'x-csrf-token': csrfToken
        }
      }, async (rsData, jwRs) => {

        // Borrar alerta en caso de estar activa warning
        if (this.alert.active === true && this.alert.animated === 'zoomIn') {
          this.alert.animated = 'zoomOut faster';
          setTimeout(() => {
            this.alert.active = false;
            this.alert.animated = '';
          }, 505);
        }

        // En caso de error
        if (jwRs.error) {
          this.jwRsError(jwRs);
        }

        console.log('Respuesta del backend')
        console.log(jwRs)



        // Success
        if (jwRs.statusCode === 200) {
          this.progressBarD(false);
          this.tableData = this.search = this.footerTable = this.countData = true;
          this.listCount = rsData.list.length;
          this.listData = rsData.list;
          this.listFullCount = rsData.count;
          if (rsData.count > this.listCount) {
            this.navegationsData = this.numResult = true;
          }
          // Method Pagination()
          //   this.paginationCount();

          // cuando se realiza la busqueda
          if (this.searching && (this.listCount === 0)) {
            this.tableData = this.footerTable = false;
            this.alert.title = 'No hay Resultados';
            this.alert.message = `No se encontraron resultados para la busqueda: "${this.searchsText}"`;
            // Animación de entrada
            this.searchAnimated(true, 'bounceIn');
          } else {
            // Animación de salida.
            this.searchAnimated(false);
          }
        }
      });

    },

  }
});
