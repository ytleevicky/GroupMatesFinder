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

        await Project.update(createProject.id).set({
            courseName: section.in[0].courseName,
            courseID: section.in[0].courseID
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

            var section = await Section.findOne(req.params.id).populate("haveProject", { where: { id: req.params.pid } }).populate('in').populate('haveStudent');

            var project = await Project.findOne(req.params.pid).populate('haveGroup');

            var groups = await Group.find(project.haveGroup.map(v => v.id)).populate('createdBy');

            console.log("here");
            console.log(groups);

            return res.view('project/groupFormation', { sectionInfo: section, userid: req.params.sid, projectid: req.params.pid, groupInfo: groups, projectInfo: project });

        }

    },

    viewStudentProfile: async function (req, res) {

        if (req.method == 'GET') {

            var student = await User.findOne({ where: { givenId: req.params.id } });

            var section = await Section.findOne({ where: { id: req.params.fk } }).populate('in').populate('haveProject', { where: { id: req.params.pid } });

            return res.view('user/viewStudentProfile', { studentInfo: student, userid: req.params.sid, sectionInfo: section, projectid: req.params.pid });

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

};

