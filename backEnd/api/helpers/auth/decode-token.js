/**
 * decode-token.js
 *
 * @description :: Todas las funciones de la pagina.
 *
 * @src {{proyect}}/api/helpers/auth/decode-token.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2020/02/16
 * @version 1.0
 *
 * @usage
 *
 * sails.helpers.utilities.decodeToken('base64 a string');
 *
 * // Response
 * json: {
 *   type: 'code',
 *   messaje: 'txt'
 * }
 */


module.exports = {

  friendlyName: 'DecodeToken',

  description: 'Decodifica el token que viene en base 64 y devuelve datos.',

  inputs: {
    token: {
      type: 'string',
      defaultsTo: '',
      description: 'Texto en base64 que hay que decodificar'
    }
  },

  exits: {
    success: {
      description: 'Return Decode Token.',
    },
  },

  fn: async function (inputs,exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    // let rq = inputs.req;
    let txtBase64 = inputs.token;
    let txtBase = '';
    let tokenJson = {};
    let txtToken = '';
    let dataReturn = {};


    /***************************************************************************************
     * VALIDANDO DATOS DE SI EXISTEN
     ***************************************************************************************/
    // Modo de uso
    if (txtBase64 === '') {
      sails.log.error(new Error(`El Argumento (token) es de uso obligatorio`));
      return exits.success({
        type: 'ERROR_TOKEN',
        message: 'No se encontro texto en base 64'
      });
    }


    /***************************************************************************************
     * BUSCANDO EL TOKEN DENTRO DE LA SOLICITUD
     ***************************************************************************************/
    // Decodificando Base 64 a Texto
    txtBase = await sails.helpers.utilities.atobBase64.with({
      text: txtBase64,
    });

    /***************************************************************************
     * Envio para formatear el texto y me lo devuelvan en JSON
     * el email y el texto del token
     */
    tokenJson = await formatTokenEmail(txtBase);

    // Verificando Posibles Errores y cerrando la respuesta del servidor.
    if (tokenJson.type === 'ERROR_BASE64') {
      // Respondo lo mismo que me envie la funcion
      return exits.success(tokenJson);
    }


    /***************************************************************************
     * Verifico que el token viene como debe ser
     * Tambien Extraigo el token del Beaer y lo dejo en pleno texto.
     * Desarticularndo el Token para dejar solo el mero Texto
     */
    txtToken = await extraerToken(tokenJson.json.token);

    // Verificando posibles Errores en la cadena
    if (txtToken.type === 'ERROR_TOKEN') {
      // respondo lo mismo del token
      return exits.success(txtToken);
    }

    // Formateo la respuesta
    dataReturn = {
      type: 'SUCCESS',
      data: {
        email: tokenJson.json.email,
        token: txtToken.token
      }
    };

    // Return success
    return exits.success(dataReturn);

  }
};

/**
 * formatTokenEmail
 * @description Formateara el token para que se devuelva, tambien
 * verificara si el base64 trae bien el texto o es solo texto suelto
 * @param {String} txtBase
 * @returns JSON
 */
async function formatTokenEmail(txtBase) {
  // Variables
  let txtArray = txtBase.split('|');
  let txtDecode = {};

  // Verificación array vacio
  if (txtArray.length !== 2) {
    sails.log.error(new Error('Error en el formato del Array: Parametros incorrecto, se espera "Email|Token"'));
    return {
      type: 'ERROR_BASE64',
      message: 'Error en el formato del Array: Parametros incorrecto, se espera "Email|Token'
    };
  }

  // Configuración Correcta
  // Extrajendo textos
  txtDecode = {
    email: txtArray[0],
    token: txtArray[1]
  };

  // Devolviendo datos
  return {
    type: 'SUCCESS',
    json: txtDecode
  };
}



/**
 * extraerToken
 * @description extrae el token del bearer y lo devuelve solo como
 * un texto para que sea validado mas luego
 * @param {string} token
 */
async function extraerToken(token) {
  // Variables
  let txtEncodeParts = token || '';
  let tokenDecode = '';

  // Validando Variable Null Token
  if (txtEncodeParts === '') {
    sails.log.error(new Error('Falta el texto del token para hacerlo funcionar'));
    return {
      type: 'ERROR_TOKEN',
      message: 'Falta el texto del token para hacerlo funcionar'
    };
  }

  // Convirtiendo el Texto en Array para verificarlos posteriormente
  txtEncodeParts = token.split(' ');

  // Valido la cadena del token
  if (txtEncodeParts.length === 2) {
    let scheme = txtEncodeParts[0];
    let credentials = txtEncodeParts[1];

    // Validando el "Bearer" content
    if (/^Bearer$/i.test(scheme)){
      tokenDecode = credentials;
      return {
        type: 'SUCCESS',
        token: tokenDecode
      };
    }
    else {
      sails.log.error(new Error(`No se encontro el formato correcto del token a Validad`));
      return {
        type: 'ERROR_TOKEN',
        message: 'No se encontro el formato correcto del token a Validad'
      };
    }
  }
  else {
    sails.log.error(new Error(`No se encontro el formato correcto del token a Validad`));
    return {
      type: 'ERROR_TOKEN',
      message: 'No se encontro el formato correcto del token a Validad'
    };
  }
}
