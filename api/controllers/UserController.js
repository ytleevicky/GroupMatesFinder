/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {

    landing: async function (req, res) {

        return res.view('user/landing');

    },

    login: async function (req, res) {

        if (req.method == "GET") return res.view('user/login');

        if (!req.body.givenId || !req.body.password) return res.badRequest();

        var user = await User.findOne({ where: { givenId: req.body.givenId } });

        if (!user) return res.status(401).send("Invalid Username or Password");

        const match = await sails.bcrypt.compare(req.body.password, user.password);

        if (!match) return res.status(401).send("Invalid Username or Password");

        var student = await User.findOne(user.id).populate('apply');

        req.session.regenerate(function (err) {

            if (err) return res.serverError(err);

            req.session.userid = user.id;
            req.session.givenId = user.givenId;
            req.session.password = user.password;
            req.session.role = user.role;
            req.session.pName = user.preferred_name;
            req.session.fName = user.fullName;

            sails.log("[Session] ", req.session);
            sails.log("Login User:" + req.session.fName + ', ' + "Userid: " + req.session.userid);


            if (req.wantsJSON) {

                if (req.session.role == 'student') {

                    req.session.invitationNum = student.apply.length;

                    return res.redirect('/homepage');
                } else {
                    return res.redirect('/teacher/homepage');
                }

            }

        });

    },

    logout: async function (req, res) {

        sails.log("Logout User:" + req.session.fName);

        req.session.destroy(function (err) {

            if (err) return res.serverError(err);

            return res.redirect('/');

        });
    },


    profile: async function (req, res) {

        var user = await User.findOne({ id: req.session.userid });

        if (!user) { return res.notFound(); }

        var forms = await User.findOne(req.session.userid).populate('haveForm');

        var form2 = await SavedForm.find(forms.haveForm.map(v => v.id)).populate('getFrom').populate('formBelongTo').sort([{ createdAt: 'DESC' }]);

        return res.view('user/profile', { userinfo: user, userid: req.session.userid, allForm: form2 });

    },

    editProfile: async function (req, res) {

        if (req.method == 'GET') {

            var user = await User.findOne(req.session.userid);

            if (!user) { return res.notFound(); }

            return res.view('user/editProfile', { userinfo: user, userid: req.session.userid });

        } else {

            var user = await User.findOne(req.params.id);

            if (!user) { return res.notFound(); }


            var updateUser = await User.update(req.params.id).set({
                preferred_name: req.body.User.preferred_name,
                instagram: req.body.User.instagram,
                facebook: req.body.User.facebook,
                bio: req.body.User.bio,
                interest: req.body.User.interest,
                strength: req.body.User.strength,
                skills: req.body.User.skills,

            }).fetch();

            return res.json({ message: 'The profile is successfully updated.', url: '/user/profile' });

        }

    },


    // User enroll Course
    populate: async function (req, res) {

        var model = await User.findOne(req.params.id).populate("enroll");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // User enrollSection Section
    populate: async function (req, res) {

        var model = await User.findOne(req.params.id).populate("enrollSection");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // User-T instruct Course
    populate: async function (req, res) {

        var model = await User.findOne(req.params.id).populate("instruct");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // User-T instructSection Section 
    populate: async function (req, res) {

        var model = await User.findOne(req.params.id).populate("instructSection");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // User-S create Group 
    populate: async function (req, res) {

        var model = await User.findOne(req.params.id).populate("create");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // User-S apply Group 
    populate: async function (req, res) {

        var model = await User.findOne(req.params.id).populate("apply");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // User-S applyGroup Group 
    populate: async function (req, res) {

        var model = await User.findOne(req.params.id).populate("applyGroup");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // User-T createEvaluation Evaluation 
    populate: async function (req, res) {

        var model = await User.findOne(req.params.id).populate("createEvaluation");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // User-S haveForm SavedForm 
    populate: async function (req, res) {

        var model = await User.findOne(req.params.id).populate("haveForm");

        if (!model) return res.notFound();

        return res.json(model);

    },







};

