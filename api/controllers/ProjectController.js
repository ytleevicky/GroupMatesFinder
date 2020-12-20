/**
 * ProjectController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // Project inSection Section
    populate: async function (req, res) {

        var model = await Project.findOne(req.params.id).populate("inSection");

        if (!model) return res.notFound();

        return res.json(model);

    },

    createProject: async function (req, res) {

        if (req.method == 'GET') {

            console.log("GET");

        } else {

            console.log(req.params.id);

            if (!req.body.Project) { return res.badRequest('Form-data not received.'); }

            var createProject = await Project.create(req.body.Project).fetch();

            console.log(createProject);

            await Project.addToCollection(createProject.id, 'inSection').members(req.params.id);

            if (req.wantsJSON) {
                return res.json({ message: 'Project has been successfully initialized.', url: '/teacher/' + req.params.fk + '/viewSection/' + req.params.id });    // for ajax request
            }

        }

    },

    viewProject: async function (req, res) {

        if (req.method == 'GET') {

            var section = await Section.findOne(req.params.id).populate("haveProject").populate('in');

            return res.view('project/viewProject', { sectionInfo: section, userid: req.params.fk });

        }



    },




};

