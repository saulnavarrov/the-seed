module.exports = {


  friendlyName: 'Login',


  description: 'Login auth.',


  inputs: {

  },


  exits: {
    success: {
      description: 'The requesting user agent has been successfully logged in.',
    },
  },


  fn: async function (inputs,exits) {

    this.req.session.userId = 1;

    // All done.
    return exits.success();

  }


};
