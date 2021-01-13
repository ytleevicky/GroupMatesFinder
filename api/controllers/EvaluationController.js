/**
 * EvaluationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    evaluation: async function (req, res) {

        if (req.method == 'GET') {



            return res.view('evaluation/evaluation');

        }

    },

    addEvaluation: async function (req, res) {

        if (req.method == 'GET') {



            return res.view('evaluation/addEvaluation');

        }

    },

    peerEvaluation: async function (req, res) {

        if (req.method == 'GET') {

            var section = await Section.findOne({ where: { id: req.params.sid } }).populate('in').populate('haveProject', { where: { id: req.params.pid } });

            var project = await Project.findOne(req.params.pid).populate('haveGroup');

            var group = await Group.find(project.haveGroup.map(v => v.id)).populate('createdBy');

            return res.view('teacher/peerEvaluation', { groupInfo: group, userid: req.session.userid, sectioninfo: section });

        }

    },


};

