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
        //  await Group.create(req.body.Group).fetch();

        var pid = parseInt(req.params.pid);
        var project = await Project.findOne({ where: { id: pid } });

        var uid = parseInt(req.params.uid);
        var user = await User.findOne({ where: { id: uid } });

        var currentGroup = await Project.findOne(req.params.pid).populate('haveGroup');

        console.log("Num of group in this project:");
        console.log(currentGroup.haveGroup.length);

        // Intalize the first group for this project
        if (currentGroup.haveGroup.length == 0) {

            group = await Group.create(req.body.Group).fetch();

            await Group.update(group.id).set({
                groupNum: 1,
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

                    assigned = true;

                    break;

                }
            }

            console.log("End of the forloop");

            // All the existing group already have members --> Create new group
            if (assigned == false) {

                group = await Group.create(req.body.Group).fetch();

                await Group.addToCollection(group.id, 'inProject').members(project.id);
                await Group.addToCollection(group.id, 'createdBy').members(user.id);

                await Group.update(group.id).set({
                    groupNum: currentGroup.haveGroup.length + 1,
                }).fetch();

            }



        }


        if (req.wantsJSON) {
            return res.json({ url: '/student/' + req.params.uid + '/section/' + req.params.sid + '/project/' + req.params.pid + '/viewCreatedGroup/' + group.id });    // for ajax request
        }

    },

    viewCreatedGroup: async function (req, res) {

        if (req.method == 'GET') {

            var section = await Section.findOne(req.params.sid).populate("haveProject", { where: { id: req.params.pid } }).populate('in').populate('haveStudent');

            var group = await Group.findOne(req.params.gid).populate('createdBy');

            console.log(group);

            return res.view('project/viewCreatedGroup', { userid: req.params.uid, sectionInfo: section, groupInfo: group });
        }

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


};

