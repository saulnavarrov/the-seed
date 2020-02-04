module.exports = {


  friendlyName: 'Logout',


  description: 'Logout auth.',


  inputs: {

  },


  exits: {
    success: {
      description: 'Logout OK'
    }
  },


  fn: async function (inputs,exits) {

    delete this.req.sesion.userId;

    // All done.
    return exits.success();

  }


};
