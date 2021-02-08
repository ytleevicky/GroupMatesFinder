/**
 * SavedFormController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // SavedForm saveTo User-S 
    populate: async function (req, res) {

        var model = await SavedForm.findOne(req.params.id).populate("saveTo");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // SavedForm getFrom Group
    populate: async function (req, res) {

        var model = await SavedForm.findOne(req.params.id).populate("getFrom");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // SavedForm formBelongTo Project
    populate: async function (req, res) {

        var model = await SavedForm.findOne(req.params.id).populate("formBelongTo");

        if (!model) return res.notFound();

        return res.json(model);

    },


};

