/**
 * GroupController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    createGroup: async function (req, res) {

        if (req.method == 'GET') { return res.forbidden(); }

        var group;

        var pid = parseInt(req.params.pid);
        var project = await Project.findOne({ where: { id: pid } });

        var user = await User.findOne({ where: { id: req.session.userid } });

        var currentGroup = await Project.findOne(req.params.pid).populate('haveGroup');

        // Intalize the first group for this project
        if (currentGroup.haveGroup.length == 0) {

            group = await Group.create(req.body.Group).fetch();

            await Group.update(group.id).set({
                groupNum: 1,
                formationStatus: 'inCompleted',
            }).fetch();

            await Group.addToCollection(group.id, 'inProject').members(project.id);
            await Group.addToCollection(group.id, 'createdBy').members(user.id);

        } else {

            var assigned = false;

            // Loop all the groups in this project
            for (var i = 1; i <= currentGroup.haveGroup.length; i++) {

                var findProject = await Project.findOne(req.params.pid).populate('haveGroup', { where: { groupNum: i } });

                var studentNumber = await Group.findOne(findProject.haveGroup[0].id).populate('createdBy');

                var totalStudentInThisGroup = studentNumber.createdBy.length;

                // Find the group i which has 0 group member
                if (totalStudentInThisGroup == 0) {

                    await Group.addToCollection(findProject.haveGroup[0].id, 'createdBy').members(user.id);

                    group = await Group.findOne(findProject.haveGroup[0].id);

                    assigned = true;

                    break;

                }
            }

            // All the existing group already have members --> Create new group
            if (assigned == false) {

                group = await Group.create(req.body.Group).fetch();

                await Group.addToCollection(group.id, 'inProject').members(project.id);
                await Group.addToCollection(group.id, 'createdBy').members(user.id);

                await Group.update(group.id).set({
                    groupNum: currentGroup.haveGroup.length + 1,
                    formationStatus: 'inCompleted',
                }).fetch();

            }

        }


        if (req.wantsJSON) {
            return res.json({ url: '/student/section/' + req.params.sid + '/project/' + req.params.pid + '/viewCreatedGroup/' + group.id });    // for ajax request
        }

    },

    viewCreatedGroup: async function (req, res) {

        if (req.method == 'GET') {

            var section = await Section.findOne(req.params.sid).populate("haveProject", { where: { id: req.params.pid } }).populate('in').populate('haveStudent', { sort: 'givenId' });

            var group = await Group.findOne(req.params.gid).populate('createdBy').populate('invite');

            var pplRequest = await Group.findOne(req.params.gid).populate('consider');

            var project = await Project.findOne(req.params.pid).populate('haveGroup');

            var student = await Section.findOne(req.params.sid).populate('haveStudent', { where: { id: { '!=': req.session.userid } } });

            var list = await User.find(student.haveStudent.map(v => v.id)).populate('create', { where: { id: project.haveGroup.map(a => a.id) } }).sort(['givenId']);

            return res.view('project/viewCreatedGroup', { userid: req.session.userid, sectionInfo: section, groupInfo: group, requestToJoin: pplRequest, listInfo: list });
        }

    },

    inviteMember: async function (req, res) {

        if (req.method == 'GET') { return res.forbidden(); }

        var sectionid = parseInt(req.params.sid);

        // student does not exist in this sytem.
        var studentExist = await User.findOne({ where: { givenId: req.body.studentid } });

        if (!studentExist) return res.json({ message: 'Invalid student ID', url: '/student/section/' + req.params.sid + '/project/' + req.params.pid + '/viewCreatedGroup/' + req.params.gid });

        // student does not exist in this course
        var inSection = await User.findOne(studentExist.id).populate('enrollSection', { where: { id: sectionid } });

        if (inSection.enrollSection.length == 0) {
            return res.json({ message: 'Could not find this student in this course. Please check the student ID again.', url: '/student/section/' + req.params.sid + '/project/' + req.params.pid + '/viewCreatedGroup/' + req.params.gid });
        }


        await Group.addToCollection(req.params.gid, 'invite').members(studentExist.id);

        return res.json({ message: 'Invitation has been sent. ', url: '/student/section/' + req.params.sid + '/project/' + req.params.pid + '/viewCreatedGroup/' + req.params.gid });

    },

    invitation: async function (req, res) {

        if (req.method == 'GET') {

            var user = await User.findOne(req.session.userid).populate('apply');

            // Update the invitation Num 
            req.session.invitationNum = user.apply.length;

            var project = await Group.find(user.apply.map(v => v.id)).populate('inProject').populate('createdBy');

            return res.view('project/invitation', { projectInfo: project, userid: req.session.userid, invitationNum: req.session.invitationNum });
        }

    },

    acceptInvitation: async function (req, res) {

        if (req.method == 'GET') { return res.forbidden(); }

        var project = await Group.findOne(req.params.gid).populate('inProject');

        var group = await Project.findOne(project.inProject[0].id).populate('haveGroup');

        var alreadyFormGroup = await User.findOne(req.params.uid).populate('create', { where: { id: group.haveGroup.map(v => v.id) } });

        if (alreadyFormGroup.create.length > 0) {

            return res.json({ message: 'You cannot accept the invitation. You have already formed group in this project.', url: '/invitation' })
        }

        // Check if the group is completed

        var g = await Group.findOne(req.params.gid);

        if (g.formationStatus == 'completed') {

            return res.json({ message: 'This group is completed. You cannot accept this invitation', url: '/invitation' });

        }

        // Check how many people in this group now

        var pplInGroup = await Group.findOne(req.params.gid).populate('createdBy');

        var numPPL = pplInGroup.createdBy.length;

        var maxInGroup = project.inProject[0].numOfStudentMax;


        if (maxInGroup > numPPL) {

            await User.removeFromCollection(req.params.uid, 'apply').members(req.params.gid);

            await Group.addToCollection(req.params.gid, 'createdBy').members(req.params.uid);

            // Update the invitation Num 
            var student = await User.findOne(req.params.uid).populate('apply');
            req.session.invitationNum = student.apply.length;

            return res.json({ message: 'You have accepted the invitation.', url: '/invitation' });

        } else {

            return res.json({ message: 'This group is full. You cannot accept this invitation.', url: '/invitation' });

        }



    },

    rejectInvitation: async function (req, res) {

        if (req.method == 'GET') { return res.forbidden(); }

        await Group.removeFromCollection(req.params.gid, 'invite').members(req.params.uid);

        // Update the invitation Num 
        var student = await User.findOne(req.params.uid).populate('apply');
        req.session.invitationNum = student.apply.length;

        return res.json({ message: 'You have successfully reject the invitation.', url: '/invitation' });

    },

    // Not in use
    cancelInvitation: async function (req, res) {

        if (req.method == 'GET') { return res.forbidden(); }

        var student = await User.findOne({ where: { id: req.body.cancelid } });

        await Group.removeFromCollection(req.params.gid, 'invite').members(student.id);

        return res.json({ message: 'Request has been cancelled ', url: '/student/' + req.params.uid + '/section/' + req.params.sid + '/project/' + req.params.pid + '/viewCreatedGroup/' + req.params.gid });

    },

    viewGroup: async function (req, res) {

        if (req.method == 'GET') {

            var group = await Group.findOne(req.params.gid).populate('createdBy');

            var section = await Section.findOne(req.params.sid).populate("haveProject", { where: { id: req.params.pid } }).populate('in').populate('haveStudent');

            var project = await Project.findOne(req.params.pid).populate('haveGroup');

            var ppl = await Group.find(project.haveGroup.map(v => v.id)).populate('createdBy');

            return res.view('project/viewGroup', { userid: req.session.userid, groupInfo: group, sectionInfo: section, peopleHaveGroup: ppl });


        } else {

            await User.addToCollection(req.session.userid, 'applyGroup').members(req.params.gid);

            var group = await Group.findOne(req.params.gid);

            return res.json({ message: 'You have successfully sent the request to Group ' + group.groupNum + '.', url: '/student/section/' + req.params.sid + '/project/' + req.params.pid });

        }

    },

    acceptToGroup: async function (req, res) {

        if (req.method == 'GET') { return res.forbidden(); }

        var project = await Group.findOne(req.params.gid).populate('inProject');

        var group = await Project.findOne(project.inProject[0].id).populate('haveGroup');

        var alreadyFormGroup = await User.findOne(req.params.tid).populate('create', { where: { id: group.haveGroup.map(v => v.id) } });

        if (alreadyFormGroup.create.length > 0) {

            return res.json({
                message: 'You cannot add this user to your group. This user has already formed group in this project.', url: '/student/section/' + req.params.sid + '/project/' + req.params.pid + '/viewCreatedGroup/' + req.params.gid
            });
        }

        // Check if the group is completed 

        var g = await Group.findOne(req.params.gid);

        if (g.formationStatus == 'completed') {

            return res.json({
                message: 'You cannot add this user to your group. Because the group list has been submitted.', url: '/student/section/' + req.params.sid + '/project/' + req.params.pid + '/viewCreatedGroup/' + req.params.gid
            });

        }

        // Remove all the association between others group and this user. 

        // await User.removeFromCollection(req.params.tid, 'applyGroup').members(group.haveGroup.map(g => g.id));

        // await User.removeFromCollection(req.params.tid, 'apply').members(group.haveGroup.map(g => g.id));

        //------------------------------------------------------------

        // Check how many people in this group now

        var pplInGroup = await Group.findOne(req.params.gid).populate('createdBy');

        var numPPL = pplInGroup.createdBy.length;

        var maxInGroup = project.inProject[0].numOfStudentMax;


        if (maxInGroup > numPPL) {

            await Group.removeFromCollection(req.params.gid, 'consider').members(req.params.tid);

            await Group.addToCollection(req.params.gid, 'createdBy').members(req.params.tid);

            return res.json({ message: 'You have successfully added this member to your group.', url: '/student/section/' + req.params.sid + '/project/' + req.params.pid + '/viewCreatedGroup/' + req.params.gid });

        } else {

            return res.json({ message: 'This group is full. You cannot add this student to your group', url: '/student/section/' + req.params.sid + '/project/' + req.params.pid + '/viewCreatedGroup/' + req.params.gid });

        }

    },

    rejectFromGroup: async function (req, res) {

        if (req.method == 'GET') { return res.forbidden(); }

        await Group.removeFromCollection(req.params.gid, 'consider').members(req.params.tid);

        return res.json({ url: '/student/section/' + req.params.sid + '/project/' + req.params.pid + '/viewCreatedGroup/' + req.params.gid });

    },

    completeGroupFormation: async function (req, res) {

        if (req.method == 'GET') { return res.forbidden(); }

        // Check group 
        var group = await Group.findOne(req.params.gid).populate('createdBy').populate('inProject');

        var numPPLinGroup = group.createdBy.length;

        var maxNum = group.inProject[0].numOfStudentMax;
        var minNum = group.inProject[0].numOfStudentMin;

        if (numPPLinGroup <= maxNum && numPPLinGroup >= minNum) {

            await Group.update(req.params.gid).set({
                formationStatus: 'completed',
            }).fetch();

            return res.json({ message: 'Group formation has been completed.', url: '/student/section/' + req.params.sid + '/project/' + req.params.pid });

        } else {
            return res.json({ message: 'Fail to complete the group formation. Number of students in each group should be ' + minNum + '-' + maxNum + '. Please check again.', url: '/student/section/' + req.params.sid + '/project/' + req.params.pid + '/viewCreatedGroup/' + req.params.gid });
        }

    },

    exitGroup: async function (req, res) {

        if (req.method == 'GET') { return res.forbidden(); }

        // Check if the group formation is completed.

        var exitGroup = await Group.findOne(req.params.gid);

        if (exitGroup.formationStatus == "completed") {

            return res.json({ message: 'Sorry! Since the group formation has been submitted, you cannot exit the group.', url: '/student/section/' + req.params.sid + '/project/' + req.params.pid + '/viewCreatedGroup/' + req.params.gid });

        }

        // Remove User from Group
        await User.removeFromCollection(req.session.userid, 'create').members(req.params.gid);

        var g = await Group.findOne(req.params.gid).populate('createdBy');

        if (g.createdBy.length > 0) {

            return res.json({ message: 'Successfully exit from group.', url: '/student/section/' + req.params.sid + '/project/' + req.params.pid });

        } else {

            var assUser = await Group.findOne(req.params.gid).populate('invite').populate('consider');

            await Group.update(req.params.gid).set({
                groupDescription: '',
            }).fetch();

            await Group.removeFromCollection(req.params.gid, 'invite').members(assUser.invite.map(v => v.id));

            await Group.removeFromCollection(req.params.gid, 'consider').members(assUser.consider.map(v => v.id));

            return res.json({ message: 'Successfully exit from group.', url: '/student/section/' + req.params.sid + '/project/' + req.params.pid });

        }

    },

    updateGrpDescription: async function (req, res) {

        if (req.method == 'GET') { return res.forbidden(); }

        await Group.update(req.params.gid).set({
            groupDescription: req.body.Group.groupDescription,
        }).fetch();

        return res.redirect('/student/section/' + req.params.sid + '/project/' + req.params.pid + '/viewCreatedGroup/' + req.params.gid);

    },

    // Group inProject Project
    populate: async function (req, res) {

        var model = await Group.findOne(req.params.id).populate("inProject");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // Group createdBy User
    populate: async function (req, res) {

        var model = await Group.findOne(req.params.id).populate("createdBy");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // Group invite User
    populate: async function (req, res) {

        var model = await Group.findOne(req.params.id).populate("invite");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // Group consider User
    populate: async function (req, res) {

        var model = await Group.findOne(req.params.id).populate("consider");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // Group haveResponse EvalResponse
    populate: async function (req, res) {

        var model = await Group.findOne(req.params.id).populate("haveResponse");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // Group generateForm SavedForm
    populate: async function (req, res) {

        var model = await Group.findOne(req.params.id).populate("generateForm");

        if (!model) return res.notFound();

        return res.json(model);

    },


};

