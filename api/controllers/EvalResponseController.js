/**
 * ResponseController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    viewEvaluationResult: async function (req, res) {

        var section = await Section.findOne({ where: { id: req.params.sid } }).populate('in').populate('haveProject', { where: { id: req.params.pid } });

        var event = await Project.findOne({ where: { id: req.params.pid } }).populate('haveGroup', { where: { formationStatus: 'completed' } });

        var group = await Group.find(event.haveGroup.map(v => v.id)).populate("createdBy").populate("haveResponse", { where: { eventid: req.params.eid } });

        console.log(group);

        return res.view('event/viewEvaluationResult', { userid: req.session.userid, sectioninfo: section, eventInfo: event, groupInfo: group, eventid: req.params.eid });
    },

    viewGroupEvaluationResult: async function (req, res) {

        var section = await Section.findOne({ where: { id: req.params.sid } }).populate('in').populate('haveProject', { where: { id: req.params.pid } });

        var group = await Group.findOne(req.params.gid).populate("createdBy").populate("haveResponse", { where: { groupid: req.params.gid, eventid: req.params.eid } })
        console.log("group");
        console.log(group);

        return res.view('event/viewGroupEvaluationResult', { userid: req.session.userid, sectioninfo: section, eventid: req.params.eid, groupInfo: group });
    },


    viewStudentEvaluationForm: async function (req, res) {

        var section = await Section.findOne({ where: { id: req.params.sid } }).populate('in').populate('haveProject', { where: { id: req.params.pid } });

        var group = await Group.findOne(req.params.gid).populate("createdBy");

        var form = await EvalResponse.findOne(req.params.fid);

        console.log("form");
        console.log(form.formResponse);

        var evaluator = await User.findOne(form.evaluator);

        return res.view('event/viewStudentEvaluationForm', { userid: req.session.userid, sectioninfo: section, eventid: req.params.eid, formInfo: form, evaluatorInfo: evaluator, groupInfo: group });
    },

    evalOverview: async function (req, res) {

        var section = await Section.findOne({ where: { id: req.params.sid } }).populate('in').populate('haveProject', { where: { id: req.params.pid } });

        var evalForm = await EvalEvent.findOne(req.params.eid).populate('completedResponse', { where: { groupid: req.params.gid } });

        console.log("evalForm")
        console.log(evalForm)

        var groupMember = await Group.findOne(req.params.gid).populate('createdBy');

        console.log("groupMember")
        console.log(groupMember)



        return res.view('event/evalOverview', { userid: req.session.userid, sectioninfo: section, evalFormInfo: evalForm, members: groupMember, eventid: req.params.eid });
    },






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

