/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

const locals = require('./local');

module.exports.custom = {

  nameApp: locals.nameApp,

  baseUrl: locals.baseUrl,

  contacto: locals.contacto,

  attemptsLogin: locals.attemptsLogin,

  attemptsTime: locals.attemptsTime,

  localeMoment: locals.localeMoment,

  https: locals.https,

  trustProxy: locals.trustProxy,

  internalEmailAddress: locals.internalEmailAddress,

  rememberMeCookieMaxAge: locals.rememberMeCookieMaxAge,

  rememberMeCookieMinAge: locals.rememberMeCookieMinAge,

  passwordResetTokenTTL: locals.passwordResetTokenTTL,

  emailProofTokenTTL: locals.emailProofTokenTTL,

  httpCache: locals.httpCache,

  enableBillingFeatures: locals.enableBillingFeatures,

  stripePublishableKey: locals.stripePublishableKey,

  stripeSecret: locals.stripeSecret,

  registerView: locals.registerView,

  verifyEmailAddresses: locals.verifyEmailAddresses,

  mailgunSecret: locals.mailgunSecret,

  mailgunDomain: locals.mailgunDomain,

  fromEmailAddress: locals.fromEmailAddress,

  fromName: locals.fromName,

  sendEmailtestMode: locals.sendEmailtestMode,

  sinch: locals.sinch,

  dataEncryptionKeys: locals.dataEncryptionKeys,

  secretSession: locals.secretSession,

  jwtSecret: locals.jwtSecret,

  database: locals.db,

  connect: locals.connect,

};
