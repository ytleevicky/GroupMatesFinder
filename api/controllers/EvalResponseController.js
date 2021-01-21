/**
 * ResponseController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // EvalResponse inGroup Group
    populate: async function (req, res) {

        var model = await EvalResponse.findOne(req.params.id).populate("inGroup");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // EvalResponse inEvent EvalEvent
    populate: async function (req, res) {

        var model = await EvalResponse.findOne(req.params.id).populate("inEvent");

        if (!model) return res.notFound();

        return res.json(model);

    },


};

