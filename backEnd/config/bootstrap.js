/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

const loc = require('./local');

module.exports.bootstrap = async function(done) {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  // Users
  if (await TxUsers.count() === 0) {
    await TxUsers.createEach([{
      id: 1,
      emailAddress: 'intento-de-login-fallido@intentoemail.com',
      names: 'Intento',
      lastNames: 'Fallido Desconocido',
      isSuperAdmin: false,
      role: 0,
      identification: '1000000002',
      emailStatus: 'confirmed',
      status: 'I',
      password: await sails.helpers.passwords.hashPassword('Abcd123456'),
      rols: 4
    },{
      id: 2,
      emailAddress: 'sinavarrov@example.com',
      names: 'Saul',
      lastNames: 'Navarrov',
      isSuperAdmin: true,
      role: 0,
      identification: '1028004969',
      emailStatus: 'confirmed',
      status: 'E',
      password: await sails.helpers.passwords.hashPassword('Abcd123456'),
      rols: 1
    },
    {
      id: 3,
      emailAddress: 'pruebas2@example.com',
      names: 'Pruebas',
      lastNames: 'Twoo',
      isSuperAdmin: false,
      role: 1,
      identification: '1028004960',
      emailStatus: 'confirmed',
      status: 'E',
      password: await sails.helpers.passwords.hashPassword('Abcd123456'),
      rols: 2
    }]);
  }

  // Rols
  if (await TxUsersRols.count() === 0) {
    await TxUsersRols.createEach(loc.startDB.TxRols);
  }

  // RolsPermits
  if (await TxUsersRolsPermits.count() === 0) {
    await TxUsersRolsPermits.createEach(loc.startDB.TxRolsPermits);
  }


  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};
