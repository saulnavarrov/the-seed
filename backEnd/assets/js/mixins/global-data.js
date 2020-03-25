/**
 * global-data.js
 *
 * @description :: Mixins de datos de manera global y que se use
 *  en todos los modulos maestros.
 * @src {{proyect}}/assets/js/mixins/global-data.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/04/20
 * @version 1.1
 */

// ╔╦╗╦╔╗ ╔╗╦╔╗ ╦╔═╗  ╔═╗╦  ╔═╗╔═╗╔╦╗╔═╗
// ║║║║ ╠═╣ ║║╚╗║╚═╗  ║  ║  ╠═ ╠═╣ ║ ╠═
// ╩ ╩╩╚╝ ╚╝╩╩ ╚╝╚═╝  ╚═╝╚═╝╚═╝╩ ╩ ╩ ╚═╝
var globalData = {

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ╠═
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function data() {
    return {
      globalData: '> Init Datos Globales',

      // URL API
      urlApi: 'http://api.the-seed.io/api',

      listData: {}, // Listado de datos
      listCount: 0, // cantidad de resultados en pantalla
      listFullCount: 0, // Total de resultados

      limit: 10, // Limite por reques
      skip: 0, // Omision de datos * limit
      allSelect: false, // selecionar todos
      searchsText: '', // Palabras de busquedas
      searching: false, // Buscando o visualizando todos los datos

      // control de paginación
      pagination: {
        a: 0,
        c: 0,
        v: 5,
        list: [],
        pre: false,
        prev: 'disabled',
        nex: false,
        next: 'disabled'
      },

      // Config display
      progressBar: {
        active: true,
        animated: ''
      },

      // Configuraciones de la vista de tablas
      tableData: false,
      footerTable: false,
      search: false,
      countData: false,
      navegationsData: false,
      numResult: false,

      // Config Alert Display
      alert: {
        active: false,
        icon: 'ion-ios-information-outline',
        title: 'Titulo de la alerta',
        message: 'Mensaje de la alerta content',
        type: 'alert-info',
        animated: '',
      },

      // Modales
      modal: {
        activeP: false,
        activeS: false,
        activeT: false,
        cerrar: 'Cerrar Ventana',
        title: ''
      },

      // Datos del nuevo usuario
      formNewUser: {
        role: '',
        status: 'N',
        identification: '',
        name: '',
        lastName: '',
        isSuperAdmin: false,
        emailAddress: '',
        emailStatus: '',
        phone: '+57',
        password: '',
        passwordPower: 'bg-danger', // Stados = bg-warning bg-danger bg-success
        passwordPowerStyle: {
          width: 5,
          password: false,
        }
      },
      // Datos del nuevo usuario
      newUserCreate: {},

      valForm: { // Validación del formulario
        password: { valid: '', min: false, mayus: false, minus: false, numb: false, },
        identification: { valid: '', message: 'Ingrese Numero de Identificación.' },
        emailAddress: { valid: '', message: 'Ingrese Email' },
        name: { valid: '', message: 'Ingrese el nombre del usuario' },
        lastName: { valid: '', message: 'Ingrese el apellido del usuario.' },
        phone: { valid: '', message: 'Ingrese Numero Telefonico' },
        role: { valid: '', message: 'Dato Incompleto.' },
        isSuperAdmin: { valid: '', message: 'Dato Incompleto.' },
        emailStatus: { valid: '', message: 'Dato Incompleto.' },
        status: { valid: '', message: 'Dato Incompleto.' },
      },
    };
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠═ ╠═ ║  ╚╦╝║  ║  ╠═
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  created: function () {
    //…
  },
  beforeMount: function() {
    //…
  },
  mounted: async function(){
    //…
  },
  beforeDestroy: function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ╠═ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

  }
};
