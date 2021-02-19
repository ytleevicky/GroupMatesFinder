/**
 * EvaluationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */




module.exports = {

    evaluation: async function (req, res) {

        if (req.method == 'GET') {

            // Display my created evaluation
            var eval = await User.findOne(req.session.userid).populate('createEvaluation');
            var myEval = await Evaluation.find(eval.createEvaluation.map(v => v.id)).populate('creator');

            return res.view('evaluation/evaluation', { myEvaluationInfo: myEval });

        }

    },

    addEvaluation: async function (req, res) {

        if (req.method == 'GET') {


            return res.view('evaluation/addEvaluation');

        }


        var evaluation = await Evaluation.create(req.body.Evaluation).fetch();

        var user = await User.findOne({ where: { id: req.session.userid } });

        await Evaluation.addToCollection(evaluation.id, 'creator').members(user.id);

        return res.json({ url: '/teacher/evaluation' });

    },

    peerEvaluation: async function (req, res) {

        if (req.method == 'GET') {

            var section = await Section.findOne({ where: { id: req.params.sid } }).populate('in').populate('haveProject', { where: { id: req.params.pid } });

            var project = await Project.findOne(req.params.pid).populate('haveGroup');

            var group = await Group.find(project.haveGroup.map(v => v.id)).populate('createdBy');

            var evaluation = await User.findOne(req.session.userid).populate('createEvaluation')

            return res.view('teacher/peerEvaluation', { groupInfo: group, userid: req.session.userid, sectioninfo: section, projectinfo: project, evaluationinfo: evaluation });

        }

    },

    viewEvaluation: async function (req, res) {

        if (req.method == 'GET') {

            var evaluation = await Evaluation.findOne(req.params.eid).populate('creator');

            return res.view('evaluation/viewEvaluation', { evaluationInfo: evaluation });

        }

    },

    removeEvalTemplate: async function (req, res) {

        if (req.method == 'GET') { return res.forbidden(); }

        var models = await Evaluation.destroy(req.params.tid).fetch();

        if (models.length == 0) return res.notFound();

        if (req.wantsJSON) {
            return res.json({ url: '/teacher/evaluation' });    // for ajax request
        }

    },



    // Evaluation creator User 
    populate: async function (req, res) {

        var model = await Evaluation.findOne(req.params.id).populate("creator");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // Evaluation usedBy EvalEvent 
    populate: async function (req, res) {

        var model = await Evaluation.findOne(req.params.id).populate("useBy");

        if (!model) return res.notFound();

        return res.json(model);

    },


};

