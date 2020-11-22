/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    login: async function (req, res) {

        if (req.method == "GET") return res.view('user/login');

        if (!req.body.givenId || !req.body.password) return res.badRequest();

        var user = await User.findOne({ givenId: req.body.givenId });

        if (!user) return res.status(401).send("User not found");

        const match = await sails.bcrypt.compare(req.body.password, user.password);

        if (!match) return res.status(401).send("Wrong Password");

        req.session.regenerate(function (err) {

            if (err) return res.serverError(err);

            req.session.userid = user.id;
            // req.session.username = req.body.username;
            req.session.givenId = user.givenId;
            req.session.password = user.password;
            req.session.role = user.role;
            req.session.name = user.fullName;

            sails.log("[Session] ", req.session);

            if(req.wantsJSON){
                return res.redirect('/homepage');
            }


        });

    },

    logout: async function (req, res) {

        console.log("Logout");

        req.session.destroy(function (err) {

            if (err) return res.serverError(err);

            return res.redirect('/');

        });
    },

    homepage: async function (req, res) {

       return res.view('user/homepage');

    },

    profile: async function (req, res) {

        console.log(req.session.userid);

        var user = await User.findOne(req.session.userid);

        if (!user) { return res.notFound(); }

        console.log(user);
        // console.log(user.name);

       return res.view('user/profile', { userinfo: user });

    },



};

