/**
 * SavedForm.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    projectid: {
      type: 'string',
    },

    eventid: {
      type: 'string',
    },

    groupid: {
      type: 'string'
    },

    userid: {
      type: 'string'
    },

    availability: {
      type: 'string',
      defaultsTo: 'show',
    },

    evalQuestion: {
      type: 'json'
    },

    evalResponse: {
      type: 'json'
    },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    saveTo: {
      collection: 'User',
      via: 'haveForm'
    },

    getFrom: {
      collection: 'Group',
      via: 'generateForm'
    },

    formBelongTo: {
      collection: 'Project',
      via: 'haveForm'
    },


  },

};

