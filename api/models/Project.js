/**
 * Project.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    // projectID: {
    //   type: 'string',
    //   required: true,
    // },

    projectName: {
      type: 'string',
      required: true,
    },

    numOfStudentMin: {
      type: 'number',
      required: true,
    },

    numOfStudentMax: {
      type: 'number',
      required: true,
    },

    groupFormationDate: {
      type: 'number',
    },

    projectSubmitDate: {
      type: 'number',
    },

    projectDescription: {
      type: 'string',
    },

    courseName: {
      type: 'string',
    },

    courseID: {
      type: 'string'
    },



    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    inSection: {
      collection: 'Section',
      via: 'haveProject'
    },

    haveGroup: {
      collection: 'Group',
      via: 'inProject'
    },

    haveEvent: {
      collection: 'EvalEvent',
      via: 'belongTo'
    },

    haveForm: {
      collection: 'SavedForm',
      via: 'formBelongTo'
    },

  },

};

