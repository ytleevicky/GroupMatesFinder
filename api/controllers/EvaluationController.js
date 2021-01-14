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
            var myEval = await Evaluation.find(eval.createEvaluation.map(v => v.id)).populate('contain').populate('creator');

            // Display all evaluation
            var evaluation = await Evaluation.find({ where: { availability: 'public' } }).populate('creator').populate('contain');

            console.log(evaluation);

            return res.view('evaluation/evaluation', { evaluationInfo: evaluation, myEvaluationInfo: myEval });

        }

    },

    addEvaluation: async function (req, res) {

        if (req.method == 'GET') {

            var question = await Question.find();

            return res.view('evaluation/addEvaluation', { allQuestions: question });

        }


        var evaluation = await Evaluation.create(req.body.Evaluation).fetch();

        var user = await User.findOne({ where: { id: req.session.userid } });

        await Evaluation.addToCollection(evaluation.id, 'creator').members(user.id);

        var quest = req.body.c;

        for (var i = 0; i < quest.length; i++) {

            await Evaluation.addToCollection(evaluation.id, 'contain').members(parseInt(quest[i]));

        }

        return res.redirect('/teacher/evaluation');

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

            var evaluation = await Evaluation.findOne(req.params.eid).populate('contain').populate('creator');

            return res.view('evaluation/viewEvaluation', { evaluationInfo: evaluation });

        }

    },

    // createEvaluation: async function (req, res) {

    //     if (req.method == 'GET') {

    //         var section = await Section.findOne({ where: { id: req.params.sid } }).populate('in').populate('haveProject', { where: { id: req.params.pid } });

    //         var project = await Project.findOne(req.params.pid).populate('haveGroup');

    //         var question = await Question.find();

    //         return res.view('teacher/createEvaluation', { sectioninfo: section, projectinfo: project, allQuestions: question });

    //     }

    //     console.log("req.body.c :");

    //     console.log(req.body.c);

    //     var evaluation = await Evaluation.create(req.body.Evaluation).fetch();

    //     var user = await User.findOne({ where: { id: req.session.userid } });

    //     await Evaluation.addToCollection(evaluation.id, 'creator').members(user.id);

    //     console.log("Created Evaluation");

    //     console.log(evaluation);

    //     return res.redirect('/teacher/viewSection/' + req.params.sid + '/project/' + req.params.pid + '/peerEvaluation');
    // },


    // Evaluation creator User 
    populate: async function (req, res) {

        var model = await Evaluation.findOne(req.params.id).populate("creator");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // Evaluation contain Question 
    populate: async function (req, res) {

        var model = await Evaluation.findOne(req.params.id).populate("contain");

        if (!model) return res.notFound();

        return res.json(model);

    },


};

