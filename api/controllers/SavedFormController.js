/**
 * SavedFormController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    updateForm: async function (req, res) {

        if (req.method == 'GET') {

        } else {

            var f = req.body.Form;

            for (var i = 0; i < f.length; i++) {

                var formid = parseInt(f[i].num);

                await SavedForm.update(formid).set({
                    availability: f[i].ava
                }).fetch();

            }

            return res.json({ message: 'Updated Evaluation Visibility.', url: '/user/profile' });

        }

    },

    // SavedForm saveTo User-S 
    populate: async function (req, res) {

        var model = await SavedForm.findOne(req.params.id).populate("saveTo");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // SavedForm getFrom Group
    populate: async function (req, res) {

        var model = await SavedForm.findOne(req.params.id).populate("getFrom");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // SavedForm formBelongTo Project
    populate: async function (req, res) {

        var model = await SavedForm.findOne(req.params.id).populate("formBelongTo");

        if (!model) return res.notFound();

        return res.json(model);

    },


};

