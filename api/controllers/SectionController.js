/**
 * SectionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // Section in Course
    populate: async function (req, res) {

        var model = await Section.findOne(req.params.id).populate("in");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // Section haveStudent User
    populate: async function (req, res) {

        var model = await Section.findOne(req.params.id).populate("haveStudent");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // Section haveTeacher Teacher
    populate: async function (req, res) {

        var model = await Section.findOne(req.params.id).populate("haveTeacher");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // Section haveProject Project
    populate: async function (req, res) {

        var model = await Section.findOne(req.params.id).populate("haveProject");

        if (!model) return res.notFound();

        return res.json(model);

    },


};

