/**
 * atob-base-64.js
 *
 * @description :: Todas las funciones de la pagina.
 *
 * @src {{proyect}}/api/helpers/utilities/atob-base-64.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2020/02/04
 * @version 1.0
 *
 * @usage
 *
 * sails.helpers.utilities.atobBase64('base64 a string');
 *
 * // Response
 * Text base64
 */

module.exports = {
  friendlyName: 'atob-base-64',

  description: 'Convierte base64 en texto legible.',

  extendedDescription: '',

  inputs: {
    text: {
      type: 'string',
      defaultsTo: '',
      description: `Texto en base64 que se pasara a texto`
    }
  },

  exits: {
    success: {
      description: 'El texto en base64 se ha convertido en texto.',
    },
  },

  fn: function(inputs, exits) {
    // Variables
    let text64 = inputs.text;
    let atob = null;
    let string = null;

    // Verificando data
    if (text64 === '') {
      sails.log.info('No hay información de texto.');
      sails.log.error(new Error(`Texto en base64: ${text64}; no hay datos para convertir en texto`));
      return exits.success({
        type: 'ERROR-TEXT',
        message: 'No hay información de texto.'
      });
    }

    // Si no es de tipo String
    if (!_.isString(text64)) {
      sails.log.info('Solo se permite String');
      sails.log.error(new Error(`Texto en base64: ${text64}; es un ${typeof(text64)}, envielo en formato String para pasarlo a texto legible`));
      return exits.success({
        type: 'ERROR-TYPEOF-STRING',
        message: 'Solo se permite String'
      });
    }

    // Convirtiendo a buff
    atob = new Buffer.from(text64, 'base64');

    // Convirtiendo base64 a string
    string = atob.toString('ascii');

    sails.log.verbose(`Helper decode-base64: Se ha convertido un Texto Base64 a Texto`)

    // return
    return exits.success(string);

  }
};
