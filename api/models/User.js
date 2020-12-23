/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    password: {
      type: "string",
      required: true,
    },

    role: {
      type: "string",
      required: true,
    },

    preferred_name: {
      type: "string",
      // required: true,
    },

    fullName: {
      type: "string",
      required: true,
    },

    givenId: {
      type: "string",
      required: true,
      unique: true,
    },

    gender: {
      type: "string",
      required: true,
    },

    contact_mobile: {
      type: "string",
    },

    contact_mail: {
      type: "string",
      required: true,
    },

    study_year: {
      type: "number"
    },

    study_programme: {
      type: "string"
    },

    imgURL: {
      type: "string"
    },

    instagram: {
      type: "string"
    },

    facebook: {
      type: "string"
    },

    bio: {
      type: "string"
    },

    interest: {
      type: "string"

    },

    strength: {
      type: "string"

    },

    skills: {
      type: "string"

    },



    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    enroll: {
      collection: 'Course',
      via: 'contain'
    },

    enrollSection: {
      collection: 'Section',
      via: 'haveStudent'
    },

    instruct: {
      collection: 'Course',
      via: 'teachBy'
    },

    instructSection: {
      collection: 'Section',
      via: 'haveTeacher'
    },

    create: {
      collection: 'Group',
      via: 'createdBy'
    },

    apply: {
      collection: 'Group',
      via: 'invite'
    }

    // enrollAt: {
    //   collection: 'AcademicYear',
    //   via: 'haveStudent'
    // },

  },

};

