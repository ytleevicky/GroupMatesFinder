/**
 * EventController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */



module.exports = {

    evaluationEvent: async function (req, res) {

        var section = await Section.findOne({ where: { id: req.params.sid } }).populate('in').populate('haveProject', { where: { id: req.params.pid } });

        var event = await Project.findOne({ where: { id: req.params.pid } }).populate('haveEvent').populate('haveGroup', { where: { formationStatus: 'completed' } });

        return res.view('evaluation/evaluationEvent', { userid: req.session.userid, sectioninfo: section, eventInfo: event });
    },

    addEvaluationEvent: async function (req, res) {

        if (req.method == "GET") {

            var section = await Section.findOne({ where: { id: req.params.sid } }).populate('in').populate('haveProject', { where: { id: req.params.pid } });

            var evaluation = await User.findOne(req.session.userid).populate('createEvaluation');

            return res.view('evaluation/addEvaluationEvent', { userid: req.session.userid, sectioninfo: section, createdEvaluation: evaluation });

        } else {

            var r = req.body.autoRelease;
            var result;

            for (var i = 0; i < r.length; i++) {
                if (r[i] == "Enabled") {
                    result = "Enabled";
                    break;
                } else if (r[i] == "Disabled") {
                    result = "Disabled";
                    break;
                }
            }

            var event = await EvalEvent.create(req.body.EvalEvent).fetch();

            var evalTemp = await Evaluation.findOne({ id: req.body.chooseTempID });

            var copyTemp = evalTemp.createdQuestion;    // Get a copy of the evaluation question

            // Convert the date & time to a timestamp
            var date = new Date(req.body.dueDate);
            var timestamp = date.getTime();

            var date2 = new Date(req.body.releaseDate);
            var timestamp2 = date2.getTime();

            await EvalEvent.update(event.id).set({
                evaluationTemp: copyTemp,
                dueDate: timestamp,
                releaseDate: timestamp2,
                autoRelease: result,
            }).fetch();

            await Project.addToCollection(req.params.pid, 'haveEvent').members(event.id);
            await EvalEvent.addToCollection(event.id, 'use').members(evalTemp.id);

            res.json({ message: 'Evaluation Event has been created. ', url: '/teacher/viewSection/' + req.params.sid + '/project/' + req.params.pid + '/evaluation' });

        }

    },

    viewEvaluationEvent: async function (req, res) {

        var section = await Section.findOne({ where: { id: req.params.sid } }).populate('in').populate('haveProject', { where: { id: req.params.pid } });

        var event = await Project.findOne({ where: { id: req.params.pid } }).populate('haveEvent');

        var response = await EvalEvent.find(event.haveEvent.map(v => v.id)).populate('completedResponse');

        var p = await Project.findOne(req.params.pid).populate('haveGroup');

        var user = await User.findOne(req.session.userid).populate('create', { where: { id: p.haveGroup.map(a => a.id), formationStatus: 'completed' } });

        return res.view('project/evaluationEvent', { userid: req.session.userid, sectioninfo: section, eventInfo: event, inGroup: user.create, responseInfo: response });
    },

    viewEventDetails: async function (req, res) {

        var section = await Section.findOne({ where: { id: req.params.sid } }).populate('in').populate('haveProject', { where: { id: req.params.pid } });

        var event = await EvalEvent.findOne(req.params.eid).populate('use');

        return res.view('event/viewEventDetails', { userid: req.session.userid, sectioninfo: section, eventInfo: event });
    },

    editEventDetails: async function (req, res) {

        if (req.method == "GET") {

            var section = await Section.findOne({ where: { id: req.params.sid } }).populate('in').populate('haveProject', { where: { id: req.params.pid } });

            var event = await EvalEvent.findOne(req.params.eid).populate('use').populate('completedResponse');

            var eTemplate = await User.findOne(req.session.userid).populate('createEvaluation');

            return res.view('event/editEventDetails', { userid: req.session.userid, sectioninfo: section, eventInfo: event, eTemplateInfo: eTemplate });

        } else {

            if (!req.body.EvalEvent) { return res.badRequest('Form-data not received.'); }

            var r = req.body.autoRelease;
            var result;

            for (var i = 0; i < r.length; i++) {
                if (r[i] == "Enabled") {
                    result = "Enabled";
                    break;
                } else if (r[i] == "Disabled") {
                    result = "Disabled";
                    break;
                }
            }

            var date = new Date(req.body.dueDate);
            var timestamp = date.getTime();

            var date2 = new Date(req.body.releaseDate);
            var timestamp2 = date2.getTime();

            var evalTemp = await Evaluation.findOne(req.body.chooseTempID);
            var copyTemp = evalTemp.createdQuestion;    // Get a copy of the evaluation question

            var evaluations = await User.findOne(req.session.userid).populate('createEvaluation');

            await EvalEvent.removeFromCollection(req.params.eid, 'use').members(evaluations.createEvaluation.map(v => v.id));

            await EvalEvent.update(req.params.eid).set({
                eventName: req.body.EvalEvent.eventName,
                eventDes: req.body.EvalEvent.eventDes,
                dueDate: timestamp,
                releaseDate: timestamp2,
                evaluationTemp: copyTemp,
                autoRelease: result,
            }).fetch();

            await EvalEvent.addToCollection(req.params.eid, 'use').members(evalTemp.id);

            return res.json({ message: 'Event has been updated.', url: '/teacher/viewSection/' + req.params.sid + '/project/' + req.params.pid + '/event/' + req.params.eid });

        }
    },


    completeEvaluation: async function (req, res) {

        if (req.method == "GET") {

            var event = await EvalEvent.findOne(req.params.eid);

            var groupMember = await Group.findOne(req.params.gid).populate('createdBy', { where: { id: { '!=': req.session.userid } } });

            return res.view('event/evaluationForm', { eventInfo: event, groupMemberInfo: groupMember, userid: req.session.userid, projectid: req.params.pid, groupid: req.params.gid, sectionid: req.params.sid });

        } else {

            var response = await EvalResponse.create(req.body.EvalResponse).fetch();

            var userObject = await User.findOne(response.evaluator);

            await EvalResponse.update(response.id).set({
                evaluatorInfo: userObject,
            }).fetch();

            await EvalResponse.addToCollection(response.id, 'inGroup').members(response.groupid);
            await EvalResponse.addToCollection(response.id, 'inEvent').members(response.eventid);

            return res.json({ message: 'Evaluation has been submitted', url: '/student/section/' + req.params.sid + '/project/' + req.params.pid + '/evaluationEvent' });    // for ajax request

        }

    },

    viewCompletedEvaluation: async function (req, res) {

        if (req.method == "GET") {

            var event = await EvalEvent.findOne(req.params.eid);

            var response = await EvalResponse.findOne({ where: { groupid: req.params.gid, eventid: req.params.eid, evaluator: req.session.userid } });

            var groupMember = await Group.findOne(req.params.gid).populate('createdBy', { where: { id: { '!=': req.session.userid } } });

            return res.view('event/viewCompletedEval', { eventInfo: event, responseInfo: response.formResponse, groupMemberInfo: groupMember, userid: req.session.userid, projectid: req.params.pid, groupid: req.params.gid, sectionid: req.params.sid, formid: response.id });

        } else {

            if (!req.body.EvalResponse) { return res.badRequest('Form-data not received.'); }

            await EvalResponse.update(req.params.fid).set({
                formResponse: req.body.EvalResponse.formResponse,
            }).fetch();

            return res.json({ message: 'Evaluation has been updated', url: '/student/section/' + req.params.sid + '/project/' + req.params.pid + '/evaluationEvent' });

        }

    },



    // EvalEvent belongTo Project
    populate: async function (req, res) {

        var model = await EvalEvent.findOne(req.params.id).populate("belongTo");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // EvalEvent completedResponse EvalResponse
    populate: async function (req, res) {

        var model = await EvalEvent.findOne(req.params.id).populate("completedResponse");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // EvalEvent use Evaluation
    populate: async function (req, res) {

        var model = await EvalEvent.findOne(req.params.id).populate("use");

        if (!model) return res.notFound();

        return res.json(model);

    },


};

