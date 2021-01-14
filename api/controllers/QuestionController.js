/**
 * QuestionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // Question inEvaluation Evaluation 
    populate: async function (req, res) {

        var model = await Question.findOne(req.params.id).populate("inEvaluation");

        if (!model) return res.notFound();

        return res.json(model);

    },

};

