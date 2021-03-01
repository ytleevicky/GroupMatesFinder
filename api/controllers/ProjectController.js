/**
 * ProjectController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { google } = require("calendar-link");
let nodemailer = require('nodemailer');

var cron = require('node-cron');

var schedule = require('node-schedule');

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

        var earlyDate = new Date(timestamp - (24 * 60 * 60 * 1000) * 3);

        var j = schedule.scheduleJob(earlyDate, async function () {

            var currentP = await Project.findOne(createProject.id);

            if (timestamp == currentP.groupFormationDate) {

                console.log('job is running');

                var project123 = await Project.findOne(createProject.id).populate('haveGroup', { where: { formationStatus: 'completed' } });

                var grp = await Group.find(project123.haveGroup.map(v => v.id)).populate('createdBy');

                var s = await Section.findOne(req.params.id).populate('haveStudent');

                var studentList = [];

                for (var y = 0; y < s.haveStudent.length; y++) {
                    studentList.push(s.haveStudent[y].givenId);
                }

                var studentHaveGroup = [];

                for (var i = 0; i < grp.length; i++) {
                    for (var a = 0; a < grp[i].createdBy.length; a++) {
                        studentHaveGroup.push(grp[i].createdBy[a].givenId)
                    }
                }

                var filteredList = studentList.filter((word) => !studentHaveGroup.includes(word));

                var emailList = [];     // Obtain all the email address of student who do not have Group.

                for (var t = 0; t < filteredList.length; t++) {
                    var findUser = await User.findOne({ where: { givenId: filteredList[t] } });
                    emailList.push(findUser.contact_mail);
                }

                console.log("Email List:");     // Send email to those who haven't form group yet
                console.log(emailList);

                var deadline = new Intl.DateTimeFormat('en-GB', {
                    dateStyle: 'medium',
                    timeStyle: 'short', hour12: 'true'
                }).format(timestamp);

                // Send Email

                let mailOptions = {
                    from: 'noreply.GroupMatesFinder@gmail.com',
                    to: emailList,
                    subject: 'GroupMatesFinder',
                    text: '*** This is an automatically generated email, please do not reply. ***\n\nDear students,\n\nA friendly reminder that you have not yet completed the group formation for the group project.\n\n' + 'The group formation deadline for the group project - ' + createProject.projectName + ' is on ' + deadline + '.\nYou still have 3 days left for submitting the group formation. \n\nPlease log in to GroupMatesFinder System to form a group as soon as possible.\n\nThank you,\n\nGroupMatesFinder System'
                };

                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'noreply.GroupMatesFinder@gmail.com',
                        pass: 'GroupMatesFinder2021'
                    }
                });

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

            } else {
                j.cancel();
                console.log("Cancel email sending.");
            }


        });

        if (req.wantsJSON) {
            return res.json({ message: 'Project has been successfully initialized.', url: '/teacher/viewSection/' + req.params.id });    // for ajax request
        }

    },

    viewProject: async function (req, res) {

        if (req.method == 'GET') {

            var section = await Section.findOne(req.params.id).populate("haveProject").populate('in');

            return res.view('project/viewProject', { sectionInfo: section, userid: req.session.userid });

        }

    },

    calendarSubmitDate: async function (req, res) {

        var project = await Project.findOne(req.params.pid);

        // Set event as an object
        const event = {
            title: project.courseID + '-Project Due Date',
            description: project.courseID + ': ' + project.projectName + ' - Project Due Date',
            start: project.projectSubmitDate,
            end: project.projectSubmitDate,
        };

        // Then fetch the link
        var link = google(event); // https://calendar.google.com/calendar/render...

        return res.redirect(link);

    },

    calendarFormDate: async function (req, res) {

        var project = await Project.findOne(req.params.pid);

        // Set event as an object
        const event = {
            title: project.courseID + '-Group Formation Due Date',
            description: project.courseID + ': ' + project.projectName + ' - Group Formation Due Date',
            start: project.groupFormationDate,
            end: project.groupFormationDate,
        };

        // Then fetch the link
        var link = google(event); // https://calendar.google.com/calendar/render...

        return res.redirect(link);

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

            return res.view('project/groupFormation', { sectionInfo: section, userid: req.session.userid, projectid: req.params.pid, groupInfo: groups, projectInfo: project, completedGroup: groups2, availableGroup: avaGroup, listInfo: list });

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

            return res.view('teacher/viewProgress', { groupInfo: group, completedGroupNum: completed.haveGroup.length, inCompletedGroupNum: inCompleted.haveGroup.length, haveGroup: cnt, noGroup: noGroupNum, studentInfo: list, userid: req.session.userid, sectioninfo: section, projectid: req.params.pid });

        }

    },

    formGroupReminder: async function (req, res) {

        if (req.method == 'GET') { return res.forbidden(); }

        var data = typeof req.body.remindStudent === 'string' ? [req.body.remindStudent] : req.body.remindStudent;

        var projectInfo = await Project.findOne(req.params.pid);

        var deadline = new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'medium',
            timeStyle: 'short', hour12: 'true'
        }).format(projectInfo.groupFormationDate);

        let mailOptions = {
            from: 'noreply.GroupMatesFinder@gmail.com',
            to: data,
            subject: 'GroupMatesFinder',
            text: '*** This is an automatically generated email, please do not reply. ***\n\nDear students,\n\nThe group formation deadline for the group project - ' + projectInfo.projectName + ' is on ' + deadline + '. \n\nPlease log in to GroupMatesFinder System to form a group as soon as possible.\n\nThank you,\n\nGroupMatesFinder System'
        };

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'noreply.GroupMatesFinder@gmail.com',
                pass: 'GroupMatesFinder2021'
            }
        });

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.json({ message: 'Reminder(s) have been sent.', url: '/teacher/viewSection/' + req.params.sid + '/project/' + req.params.pid + '/viewProgress' });

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

            var newProjectName = req.body.Project.projectName;


            var beforeUpdate = await Project.findOne(req.params.pid);   // Project info (Before update)

            if (beforeUpdate.groupFormationDate != timestamp) {

                console.log("Start Modify the schedule");

                // Modify the scheduling 

                var earlyDate = new Date(timestamp - (24 * 60 * 60 * 1000) * 3);

                var j = schedule.scheduleJob(earlyDate, async function () {

                    var currentP = await Project.findOne(req.params.pid);

                    if (timestamp == currentP.groupFormationDate) {

                        console.log('job is running');

                        var project123 = await Project.findOne(req.params.pid).populate('haveGroup', { where: { formationStatus: 'completed' } });

                        var grp = await Group.find(project123.haveGroup.map(v => v.id)).populate('createdBy');

                        var s = await Section.findOne(req.params.sid).populate('haveStudent');

                        var studentList = [];

                        for (var y = 0; y < s.haveStudent.length; y++) {
                            studentList.push(s.haveStudent[y].givenId);
                        }

                        var studentHaveGroup = [];

                        for (var i = 0; i < grp.length; i++) {
                            for (var a = 0; a < grp[i].createdBy.length; a++) {
                                studentHaveGroup.push(grp[i].createdBy[a].givenId)
                            }
                        }

                        var filteredList = studentList.filter((word) => !studentHaveGroup.includes(word));

                        var emailList = [];     // Obtain all the email address of student who do not have Group.

                        for (var t = 0; t < filteredList.length; t++) {
                            var findUser = await User.findOne({ where: { givenId: filteredList[t] } });
                            emailList.push(findUser.contact_mail);
                        }

                        console.log("Email List:");     // Send email to those who haven't form group yet
                        console.log(emailList);

                        var deadline = new Intl.DateTimeFormat('en-GB', {
                            dateStyle: 'medium',
                            timeStyle: 'short', hour12: 'true'
                        }).format(timestamp);

                        // Send Email

                        let mailOptions = {
                            from: 'noreply.GroupMatesFinder@gmail.com',
                            to: emailList,
                            subject: 'GroupMatesFinder',
                            text: '*** This is an automatically generated email, please do not reply. ***\n\nDear students,\n\nA friendly reminder that you have not yet completed the group formation for the group project.\n\n' + 'The group formation deadline for the group project - ' + newProjectName + ' is on ' + deadline + '.\nYou still have 3 days left for submitting the group formation. \n\nPlease log in to GroupMatesFinder System to form a group as soon as possible.\n\nThank you,\n\nGroupMatesFinder System'
                        };

                        let transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'noreply.GroupMatesFinder@gmail.com',
                                pass: 'GroupMatesFinder2021'
                            }
                        });

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });

                    } else {
                        j.cancel();
                        console.log("Cancel email sending.");
                    }


                });


            }


            // Update Project 
            await Project.update(req.params.pid).set({
                projectName: req.body.Project.projectName,
                numOfStudentMin: req.body.Project.numOfStudentMin,
                numOfStudentMax: req.body.Project.numOfStudentMax,
                groupFormationDate: timestamp,
                projectSubmitDate: timestamp2,
                projectDescription: req.body.Project.projectDescription,

            }).fetch();

            return res.json({ message: 'Project has been updated.', url: '/teacher/viewSection/' + req.params.sid });

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

