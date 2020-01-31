/**
 * generate-user-token.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/helpers/auth/generate-user-token.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/11/08
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Generate user token',

  description: `Crea y genera el Token que usuara el usuario para mantener conectado con
  el servidor api de Sails`,


  inputs: {
    user: {
      type: 'ref',
      example: '[{name: "Saul", lastname:"Navarrov"...}]',
      whereToGet: {
        description: `recibiremos todos los datos del usuario con el cual vamos a crearle el
        token de seguridad.`
      },
      required: true,
    },
    remoteAddress: {
      type: 'string',
      example: '127.0.0.1',
      whereToGet: {
        description: `Dirección ip con que el usuario se esta conectando`
      }
    }
  },


  exits: {

    success: {
      description: 'El token se genero de manera exitosa',
    },

    incorrect: {
      description: `Se presento un problema al tratar de crear el token, revisar
      y volver a intentarlo.`
    }

  },


  fn: async function (inputs, exits) {
    // VARIABLES
    const jwt = require('jwt-simple');
    const moment = require('moment');
    var uuid = require('node-uuid');
    let jwtSecret = sails.config.custom.jwtSecret;
    let expiryUnit = jwtSecret.expiry.unit || 'days';
    let expiryLength = jwtSecret.expiry.length || 7;
    let expires = moment().add(expiryLength, expiryUnit).valueOf();
    let issued = moment().utc().format();
    let encodedToken = null;

    // Contructor del payload token
    let configToken = {
      iss: `${inputs.user.id}|${inputs.remoteAddress}`, // Usuario
      sub: jwtSecret.subject,
      aud: jwtSecret.audience,
      exp: expires,
      nbf: issued,
      iat: issued,
      jti: uuid.v1()
    };

    // Creando token
    encodedToken = jwt.encode(configToken, jwtSecret.secret);

    // registranto token al usuario correspondiente
    let createToken = await Jwt.create({
      token: encodedToken,
      expires: expires,
      owner: inputs.user.id,
    }).fetch();

    // Devolviendo el Token al usuario.
    return exits.success({
      idToken: createToken.id,
      token: encodedToken,
      expires: expires
    });

  }
};

