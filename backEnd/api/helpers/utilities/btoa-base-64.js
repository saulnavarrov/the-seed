/**
 * btoa-base-64.js
 *
 * @description :: Todas las funciones de la pagina.
 *
 * @src {{proyect}}/api/helpers/utilities/btoa-base-64.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2020/02/04
 * @version 1.0
 *
 * @usage
 *
 * sails.helpers.utilities.btoaBase64('string a base64');
 *
 * // Response
 * Text base64
 */

module.exports = {
  friendlyName: 'btoa-base-64',

  description: 'Convierte el texto en base64.',

  extendedDescription: '',

  inputs: {
    text: {
      type: 'string',
      defaultsTo: '',
      description: `Texto que se va a pasar a base64`
    }
  },

  exits: {
    success: {
      description: 'El texto se ha pasado a base64.',
    },

  },

  fn: function(inputs, exits) {
    // Variables
    let texto = inputs.text;
    let btoa = null;
    let base64 = null;

    // Verificando data
    if (texto === '') {
      sails.log.info('No hay texto para convertir en Base64');
      sails.log.error(new Error(`Texto: ${texto}; no contiene contenido para convertir en Base64`));
      return exits.success('No hay texto para convertir en Base64');
    }

    // Si no es de tipo String
    if (!_.isString(texto)) {
      sails.log.info('Solo se permite String');
      sails.log.error(new Error(`Texto: ${texto}; es un ${typeof(texto)}, envielo en formato Strign para convertirlo en Base64`));
      return exits.success('Solo se permite String');
    }

    // Convirtiendo a buff
    btoa = new Buffer.from(texto);

    // Convirtiendo a base64
    base64 = btoa.toString('base64');

    sails.log.verbose(`Helper Encode-base64: Se ha convertido un Texto en Base64`)

    // return
    return exits.success(base64);
  }
};
