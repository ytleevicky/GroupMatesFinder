/**
 * EventController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */



module.exports = {

    evaluationEvent: async function (req, res) {


        var section = await Section.findOne({ where: { id: req.params.sid } }).populate('in').populate('haveProject', { where: { id: req.params.pid } });

        var event = await Project.findOne({ where: { id: req.params.pid } }).populate('haveEvent');

        return res.view('evaluation/evaluationEvent', { userid: req.session.userid, sectioninfo: section, eventInfo: event });
    },

    addEvaluationEvent: async function (req, res) {

        if (req.method == "GET") {

            var section = await Section.findOne({ where: { id: req.params.sid } }).populate('in').populate('haveProject', { where: { id: req.params.pid } });

            var evaluation = await User.findOne(req.session.userid).populate('createEvaluation');

            return res.view('evaluation/addEvaluationEvent', { userid: req.session.userid, sectioninfo: section, createdEvaluation: evaluation });

        } else {

            var event = await EvalEvent.create(req.body.EvalEvent).fetch();

            var evalTemp = await Evaluation.findOne({ id: req.body.chooseTempID });

            var copyTemp = evalTemp.createdQuestion;    // Get a copy of the evaluation question

            // Convert the date & time to a timestamp
            var date = new Date(req.body.dueDate);
            var timestamp = date.getTime();

            await EvalEvent.update(event.id).set({
                evaluationTemp: copyTemp,
                dueDate: timestamp,
            }).fetch();

            await Project.addToCollection(req.params.pid, 'haveEvent').members(event.id);

            res.json({ message: 'Evaluation Event has been created. ', url: '/teacher/viewSection/' + req.params.sid + '/project/' + req.params.pid + '/evaluation' });

        }

    },

    viewEvaluationEvent: async function (req, res) {

        var section = await Section.findOne({ where: { id: req.params.sid } }).populate('in').populate('haveProject', { where: { id: req.params.pid } });

        var event = await Project.findOne({ where: { id: req.params.pid } }).populate('haveEvent').populate('haveGroup');

        var p = await Project.findOne(req.params.pid).populate('haveGroup');

        var user = await User.findOne(req.session.userid).populate('create', { where: { id: p.haveGroup.map(a => a.id), formationStatus: 'completed' } });

        return res.view('project/evaluationEvent', { userid: req.session.userid, sectioninfo: section, eventInfo: event, inGroup: user.create });
    },

    completeEvaluation: async function (req, res) {

        var event = await EvalEvent.findOne(req.params.eid);

        console.log(event);

        var groupMember = await Group.findOne(req.params.gid).populate('createdBy', { where: { id: { '!=': req.session.userid } } });

        console.log(groupMember);

        return res.view('event/evaluationForm', { eventInfo: event, groupMemberInfo: groupMember });
    },



    // EvalEvent belongTo Project
    populate: async function (req, res) {

        var model = await EvalEvent.findOne(req.params.id).populate("belongTo");

        if (!model) return res.notFound();

        return res.json(model);

    },


};

