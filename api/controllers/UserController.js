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

        var student = await User.findOne({ where: { givenId: req.body.givenId, role: 'student'} });

        var teacher = await Teacher.findOne({ where: { givenId: req.body.givenId, role: 'teacher'} });

        if (!student && !teacher) return res.status(401).send("User not found");

        if (student){
            var user = student;
        } else {
            var user = teacher;
        }

        const match = await sails.bcrypt.compare(req.body.password, user.password);

        if (!match) return res.status(401).send("Wrong Password");

        req.session.regenerate(function (err) {

            if (err) return res.serverError(err);

            req.session.userid = user.id;
            req.session.givenId = user.givenId;
            req.session.password = user.password;
            req.session.role = user.role;
            req.session.name = user.preferred_name;

            sails.log("[Session] ", req.session);

            if(req.wantsJSON){

                if(req.session.role == 'student') {

                    return res.redirect('/homepage/' + req.session.userid);

                } else {

                    return res.redirect('/teacher/homepage/' + req.session.userid);

                }

              
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


    profile: async function (req, res) {

        console.log(req.session.userid);

        var user = await User.findOne(req.session.userid);

        if (!user) { return res.notFound(); }

        console.log(user);
        // console.log(user.name);

       return res.view('user/profile', { userinfo: user });

    },


       // User enroll Course
       populate: async function (req, res) {

        var model = await User.findOne(req.params.id).populate("enroll");
    
        if (!model) return res.notFound();
    
        return res.json(model);
    
    },



};

