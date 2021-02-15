/**
 * ProjectController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {

    createProject: async function (req, res) {

        if (req.method == 'GET') { return res.forbidden(); }

        if (!req.body.Project) { return res.badRequest('Form-data not received.'); }

        var createProject = await Project.create(req.body.Project).fetch();

        var section = await Section.findOne(req.params.id).populate('in');

        // Convert the date & time to a timestamp
        var date = new Date(req.body.formDate);
        var timestamp = date.getTime();

        var date2 = new Date(req.body.submitDate);
        var timestamp2 = date2.getTime();

        await Project.update(createProject.id).set({
            courseName: section.in[0].courseName,
            courseID: section.in[0].courseID,
            groupFormationDate: timestamp,
            projectSubmitDate: timestamp2,
        }).fetch();

        await Project.addToCollection(createProject.id, 'inSection').members(req.params.id);

        if (req.wantsJSON) {
            return res.json({ message: 'Project has been successfully initialized.', url: '/teacher/' + req.params.fk + '/viewSection/' + req.params.id });    // for ajax request
        }

    },

    viewProject: async function (req, res) {

        if (req.method == 'GET') {

            var section = await Section.findOne(req.params.id).populate("haveProject").populate('in');

            return res.view('project/viewProject', { sectionInfo: section, userid: req.params.sid });

        }

    },

    groupFormation: async function (req, res) {

        if (req.method == 'GET') {

            var section = await Section.findOne(req.params.id).populate("haveProject", { where: { id: req.params.pid } }).populate('in').populate('haveStudent', { sort: 'givenId' });

            var project = await Project.findOne(req.params.pid).populate('haveGroup');

            var groups = await Group.find(project.haveGroup.map(v => v.id)).populate('createdBy');

            var project2 = await Project.findOne(req.params.pid).populate('haveGroup', { where: { formationStatus: 'completed' } });

            var groups2 = await Group.find(project2.haveGroup.map(v => v.id)).populate('createdBy');

            var p = await Project.findOne(req.params.pid).populate('haveGroup', { where: { formationStatus: 'inCompleted' } });

            var avaGroup = await Group.find(p.haveGroup.map(v => v.id)).populate('createdBy');

            var student = await Section.findOne(req.params.id).populate('haveStudent');

            var list = await User.find(student.haveStudent.map(v => v.id)).populate('create', { where: { id: project.haveGroup.map(a => a.id) } }).sort(['givenId']);

            return res.view('project/groupFormation', { sectionInfo: section, userid: req.params.sid, projectid: req.params.pid, groupInfo: groups, projectInfo: project, completedGroup: groups2, availableGroup: avaGroup, listInfo: list });

        }

    },

    viewStudentProfile: async function (req, res) {

        if (req.method == 'GET') {

            var student = await User.findOne({ where: { id: req.params.id } });

            var forms = await User.findOne(req.params.id).populate('haveForm');

            var form2 = await SavedForm.find(forms.haveForm.map(v => v.id)).populate('getFrom').populate('formBelongTo');

            return res.view('user/viewStudentProfile', { studentInfo: student, allForm: form2 });

        }

    },

    viewProgress: async function (req, res) {

        if (req.method == 'GET') {

            var section = await Section.findOne({ where: { id: req.params.sid } }).populate('in').populate('haveProject', { where: { id: req.params.pid } });

            var project = await Project.findOne(req.params.pid).populate('haveGroup');

            var group = await Group.find(project.haveGroup.map(v => v.id)).populate('createdBy');

            // Completed 
            var completed = await Project.findOne(req.params.pid).populate('haveGroup', { where: { formationStatus: 'completed' } });

            // Incompleted
            var inCompleted = await Project.findOne(req.params.pid).populate('haveGroup', { where: { formationStatus: 'inCompleted' } });

            // Total student num 
            var stu = await Section.findOne(req.params.sid).populate('haveStudent');

            // Total form group student num
            var p = await Project.findOne(req.params.pid).populate('haveGroup');

            var cNum = await Group.find(p.haveGroup.map(v => v.id)).populate('createdBy');

            var cnt = 0;

            for (var i = 0; i < cNum.length; i++) {
                cnt = cnt + cNum[i].createdBy.length;
            }

            var noGroupNum = stu.haveStudent.length - cnt;

            var student = await Section.findOne(req.params.sid).populate('haveStudent', { sort: 'givenId' });

            var list = await User.find(student.haveStudent.map(v => v.id)).populate('create', { where: { id: p.haveGroup.map(a => a.id) } }).sort(['givenId']);

            return res.view('teacher/viewProgress', { groupInfo: group, completedGroupNum: completed.haveGroup.length, inCompletedGroupNum: inCompleted.haveGroup.length, haveGroup: cnt, noGroup: noGroupNum, studentInfo: list, userid: req.params.uid, sectioninfo: section });

        }

    },

    editProject: async function (req, res) {

        if (req.method == 'GET') {

            var section = await Section.findOne({ where: { id: req.params.sid } }).populate('in').populate('haveProject', { where: { id: req.params.pid } });

            return res.view('project/editProject', { userid: req.session.userid, sectioninfo: section, projectinfo: section.haveProject[0] });

        } else {

            if (!req.body.Project) { return res.badRequest('Form-data not received.'); }

            var date = new Date(req.body.formDate);
            var timestamp = date.getTime();

            var date2 = new Date(req.body.submitDate);
            var timestamp2 = date2.getTime();

            await Project.update(req.params.pid).set({
                projectName: req.body.Project.projectName,
                numOfStudentMin: req.body.Project.numOfStudentMin,
                numOfStudentMax: req.body.Project.numOfStudentMax,
                groupFormationDate: timestamp,
                projectSubmitDate: timestamp2,
                projectDescription: req.body.Project.projectDescription,

            }).fetch();

            return res.json({ message: 'Project has been updated.', url: '/teacher/' + req.session.userid + '/viewSection/' + req.params.sid });

        }

    },



    // Project inSection Section
    populate: async function (req, res) {

        var model = await Project.findOne(req.params.id).populate("inSection");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // Project haveGroup Group
    populate: async function (req, res) {

        var model = await Project.findOne(req.params.id).populate("haveGroup");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // Project haveEvent EvalEvent
    populate: async function (req, res) {

        var model = await Project.findOne(req.params.id).populate("haveEvent");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // Project haveForm SavedForm
    populate: async function (req, res) {

        var model = await Project.findOne(req.params.id).populate("haveForm");

        if (!model) return res.notFound();

        return res.json(model);

    },

};

