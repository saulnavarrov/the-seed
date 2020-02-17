/**
 * global-functions.js
 *
 * @description :: Mixins de datos de manera global y que se use
 *  en todos los modulos maestros.
 * @src {{proyect}}/assets/js/mixins/global-functions.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/04/20
 * @version 1.0
 */

//  ╔╗ ╔╗╦╔╗ ╔╗╦╔╗ ╦╔═╗  ╔═╗╦  ╔═╗╔═╗╔╦╗╔═╗
//  ║╚╦╝║║ ╠═╣ ║║╚╗║╚═╗  ║  ║  ╠═ ╠═╣ ║ ╠═
//  ╩   ╩╩╚╝ ╚╝╩╩ ╚╝╚═╝  ╚═╝╚═╝╚═╝╩ ╩ ╩ ╚═╝
var globalFunctions = {

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ╠═
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function data() {
    return {
      globalFunctions: '> Init Funciones Globales',

      modalProgress: {
        act: false,
        h1: ''
      }
    };
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠═ ╠═ ║  ╚╦╝║  ║  ╠═
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  created: function () {
    //…
  },
  beforeMount: function () {
    //…
  },
  mounted: async function () {
    //…

  },
  beforeDestroy: function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ╠═ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    /**
     * progressBarD
     * @description :: Control de la barra de carga en pantalla, la cual
     * tendra un efecto y un control de entrada y salida.
     * @param {Boolean} act :: Activar o desactivar
     * @param {String} ani :: Animación que se vera en pantalla
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    progressBarD: async function (act,ani) {
      // Activar
      if (act) {
        this.progressBar.active = true;
        this.progressBar.animated = ani;
      } else {
        this.progressBar.animated = 'fadeOut faster';
        setTimeout(() => {
          this.progressBar.active = false;
          this.progressBar.animated = '';
        }, 505);
      }
    },


    /**
     * searchAnimated
     * @description :: Crea una animación para la alerta cuando no hay
     * resultados esperados, puede cerrar o abrir la alerta con la animación
     * @param {Boolean} act :: Activa o desactiva la animación
     * @param {String} ani :: Animación que se ejecutara
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    searchAnimated: async function (act,ani) {
      if (act) {
        this.alert.type = 'alert-info';
        this.alert.active = act;
        this.alert.animated = ani;
      } else {
        // Animación Salida
        this.alert.animated = 'fadeOut faster';
        setTimeout(() => {
          this.alert.active = act;
          this.alert.animated = '';
        }, 505);
      }
    },



    /**
     * jwRsError
     * @description :: alertas en pantalla en caso de haber un error
     * @param {json} jwRs Datos del error
     * @param {Boolean} display :: Usado solo para el Error 404 en caso de
     * querer ver el error 'NotFound' en ventana emergente. y no como una alerta
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    jwRsError: async function (jwRs, display) {
      this.progressBarD(false);
      if (jwRs.statusCode >= 500 && jwRs.statusCode <= 502) {
        this.alert = {
          active: true,
          animated: 'zoomIn',
          type: 'alert-danger',
          icon: 'ion-ios-close-outline',
          title: `Error: ${jwRs.statusCode} - ${jwRs.body}`,
          message: jwRs.error.message
        };
      } else if (jwRs.statusCode >= 400 && jwRs.statusCode <= 403) {
        if (display) {
          swal({
            type: 'warning',
            title: `${jwRs.statusCode} - ${jwRs.body.title}`,
            text: `${jwRs.body.code} - ${jwRs.body.message}`,
            showCancelButton: false,
            confirmButtonColor: '#616161',
            confirmButtonText: 'Aceptar'
          });
        } else {
          this.alert = {
            active: true,
            animated: 'zoomIn',
            type: 'alert-warning',
            icon: 'ion-ios-close-outline',
            title: `Error: ${jwRs.statusCode} - ${jwRs.body.code}`,
            message: jwRs.body.message
          };
        }
      } else if (jwRs.statusCode === 404) {
        if(display) {
          swal({
            type: 'warning',
            title: `${jwRs.statusCode} - ${jwRs.body.title}`,
            text: `${jwRs.body.message}`,
            showCancelButton: false,
            confirmButtonColor: '#616161',
            confirmButtonText: 'Aceptar'
          });
        } else {
          this.alert = {
            active: true,
            animated: 'zoomIn',
            type: 'alert-warning',
            icon: 'ion-ios-close-outline',
            title: `Error: ${jwRs.statusCode} - ${jwRs.body}`,
            message: jwRs.body.data
          };
        }
      } else if (jwRs.statusCode === 406) {
        this.alert = {
          active: true,
          type: 'alert-warning',
          animated: 'zoomIn',
          icon: 'ion-ios-close-outline',
          title: `Error: ${jwRs.statusCode} - ${jwRs.body.type}`,
          message: jwRs.body.data
        };
      }
    },




    /**
     * OpensModals
     * @description Abrira los modales en pantalla
     * @param {string} modal Nombre del modal que se va abrir en pantalla
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    OpensModals: async function (modal, title) {
      // Busca el modal con la Id enviada
      let modalFind = this.$find(`[id="pm-${modal}"]`);

      // Validando Title
      if (!_.isUndefined(title)) {
        this.modal.title = title;
      }

      // Abriendo modal
      modalFind.modal('show');
    },

    /**
     * CloseModals
     * @description Funcion para cerrar modales y resetear data
     * @param {string} modal Nombre del modal para cerrar
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    CloseModals: async function (modal) {
      // Busca el modal con la Id enviada
      if (!_.isUndefined(modal)){
        let modalFind = this.$find(`[id="pm-${modal}"]`);

        // Cerrando modal abierto
        modalFind.modal('hide');
      }

      // Cambiando variables
      this.modal.cerrar = 'Cerrar Ventana';
      this.modal.title = '';
      // Rest data
      this.resetDataMix();
    },


    /**
     *
     * @param {string} act actividad a desempeñar
     *  (show: para abrir | hide: para cerrar)
     * @param {string} h1 Titulo que tendra en pantalla
     */
    openCloseProgressData: async function (act, h1) {
      // Modo de uso
      if (!act) { throw new Error(`El argumento (act) es de uso ogligatorio`); }
      if (act !== 'show' && act !== 'hide') {throw new Error(`Solo se permiten pasar opciones (show & hide)`); }
      if (!h1) { throw new Error(`El argumento (h1) es de uso obligatorio.`); }

      // Poniendo titulo
      h1 !== 'clear' ? this.modalProgress.h1 = h1 : this.modalProgress.h1 = '';

      // Abiendo Modal de Progreso
      if (act === 'show') {
        console.log('Abiendo modal progress');
        this.modalProgress.act = true;
      }
      // Cerrando Modal de Progreso
      if (act === 'hide') {
        console.log('Cerrando modal progress');
        this.modalProgress.act = false;
      }
    },


    validateForms: async function (form, rules) {

      // Uso
      if (!form) { throw new Error(`El argumento (form) es obligatorio, necesario para que funcione`); }
      if (typeof form !== 'object') { throw new Error(`El argumento (form), solo se admiten valore de typo 'object'`); }
      if (!rules) { throw new Error(`El argumento (rules) es obligatorio, necesario para que funcione`); }
      if (typeof rules !== 'object') { throw new Error(`El argumento (rules), solo se admiten valore de typo 'object'`); }

      // Vaiables
      let formData = form;
      let formRules = rules;
      let formErrors = {};

      // Reglas Soportadas
      var SUPPORTED_RULES = [
        'required', 'isEmail', 'isIn', 'is', 'minLength', 'maxLength',
        'sameAs', 'isHalfwayDecentPassword', 'isNumber', 'isBoolean',
        'isString'
      ];

      for (let fieldName in formRules) {
        // Guardando Valores del formulario a validar
        let fieldValue = formData[fieldName];

        for (let ruleName in formRules[fieldName]) {


          let ruleRhs = formRules[fieldName][ruleName];
          let violation;
          let message;

          // Verificando el valor de la regla
          // > (require: true) Bueno
          // > (require: undefined) Malo
          let isFieldValuePresent = (
            fieldValue !== undefined &&
            fieldValue !== '' &&
            !_.isNull(fieldValue)
          );

          // Required: true
          // Se require para continuar
          if (ruleName === 'required' && ruleRhs === true) {
            // ® Debe estar definido, no es nulo y no la cadena vacía
            violation = (
              !isFieldValuePresent
            );
            // ® Mensaje en pantalla
            message = violation ? '* Este campo es Obligatorio' : '';
          }

          // Campos Opcionales
          else if (!isFieldValuePresent) {
            // No hacer nada.
            // -------------------------------
            // Nota:
            // Para permitir el uso con campos opcionales, todas las reglas excepto
            // `required: true` solo se verifican cuando el valor del campo
            // es "present" - es decir, algún valor distinto de `null`,` undefined`,
            // o `''` (cadena vacía).
            // -------------------------------
          }

          // isNumber: true
          // Validando que sea numero
          else if (ruleName === 'isNumber' && ruleRhs === true) {
            // ® Debe ser un numero
            violation = (
              _.isNaN(Number(fieldValue)) ||
              !_.isNumber(fieldValue)
            );
            // ® Mensaje en pantalla
            message = violation ? `Solo se permiten Numeros` : '';
          }

          // minLength: (numero a evaluar)
          // Evaluando que el numero no sea menor a la regla
          else if (ruleName === 'minLength' && _.isNumber(ruleRhs)) {
            // ® Debe constar de al menos esta cantidad de caracteres.
            violation = (
              !_.isString(fieldValue) ||
              fieldValue.length < ruleRhs
            );
            // ® Mensaje en pantalla
            message = violation ? `Require un minimo de caracteres` : '';
          }


          // maxLength: (numero a evaluar)
          // Evaluando que el numero no sea mayor a la regla
          else if (ruleName === 'maxLength' && _.isNumber(ruleRhs)) {
            // ® Must consist of no more than this many characters
            violation = (
              !_.isString(fieldValue) ||
              fieldValue.length > ruleRhs
            );
            // ® Mensaje en pantalla
            message = violation ? `Require un maximo de caracteres` : '';
          }

          // isString: true
          // Validando Strings
          else if (ruleName === 'isString' && ruleRhs === true) {
            // ® Debe ser una cadena string
            violation = (
              !_.isNaN(Number(fieldValue)) ||
              !_.isString(fieldValue)
            );
            // ® Mensaje en pantalla
            message = violation ? 'Solo se permiten carapteres alfanumericos' : '';
          }

          // isEmail: true
          // Validando Email
          else if (ruleName === 'isEmail' && ruleRhs === true) {
            // ® Debe ser una dirección de correo electrónico (a menos que sea falsa)
            violation = (
              !parasails.util.isValidEmailAddress(fieldValue)
            );
            // ® Mensaje en pantalla
            message = violation ? 'Este Correo Electrónico no es valido' : '';
          }

          // isIn: true
          // Validando Array
          else if (ruleName === 'isIn' && _.isArray(ruleRhs)) {
            // ® Debe ser un valor dentro del array.
            violation = (
              !_.contains(ruleRhs, fieldValue)
            );
            // ® Mensaje en pantalla
            message = violation ? 'No coincide con las opciones' : '';
          }

          // is: true
          // Validando Checkboxes
          else if (ruleName === 'is') {
            // ® Debe ser exactamente esto (útil para requerir checkboxes)
            violation = (
              ruleRhs !== fieldValue
            );
            // ® Mensaje en pantalla
            message = violation ? 'Campo no seleccionado' : '';
          }

          // sameAs: 'campo segundario'
          // Tienen que ser 2 campos iguales
          else if (ruleName === 'sameAs' && ruleRhs !== '' && _.isString(ruleRhs)) {
            // ®  Must match the value in another field
            let otherFieldName = ruleRhs;
            let otherFieldValue = formData[otherFieldName];
            violation = (
              otherFieldValue !== fieldValue
            );
            // ® Mensaje en pantalla
            message = violation ? 'Los campos deben ser iguales' : '';
          }

          // Por si no se reconoce ninguna de las anteriores
          else {
            throw new Error('No se puede interpretar client-side la regla de validación de: (`' + ruleName + '`) Porque la configuración provista para ello no es reconocida por validateForms().');
          }

          // Saliendo del bucle
          // If a rule violation was detected, then set it as a form error
          // and break out of the `for` loop to continue on to the next field.
          // (We only track one form error per field.)
          if (violation) {
            // armando
            formErrors[fieldName] = {
              rule: ruleName,
              isValid: 'is-invalid',
              message: message
            };
            break;
          } //˚
        } //∞
      } //∞

      // Ya sea que haya errores o no, actualice la propiedad "formErrors" de la
      // zona de usuario para que el marcado refleje la nueva realidad (es decir,
      // los errores de validación en línea se procesen o desaparezcan).
      this.formErrors = formErrors;

      // Si hubiera errores de forma, avast. (No se intentará la presentación.)
      return (Object.keys(formErrors).length > 0);
    },


    /**
     * getToken
     * @description :: Enviara el token de regreso formateado
     * para ser enviado.
     */
    getToken: async function() {
      // Busco el token
      let token = localStorage.getItem('userToken');

      // Verfiico que existe
      if (token === null) {
        Swal({
          type: 'error',
          title: 'Error Token',
          text: 'No se encontro el Token del usuario. Cierre la sesión y vuelva a intentarlo, se el error perciste, comuniquese con el Soporte',
          showConfirmButton: false,
          timer: 1500+100
        });
        throw new Error('Token Vacio, por favor cierre la sesión y volva a intentarlo, si el error perciste comuniquese con el administrador');
      }

      return `Bearer ${String(token)}`;
    }
  }
};
