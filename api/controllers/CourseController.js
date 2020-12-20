/**
 * CourseController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */




module.exports = {

    homepage: async function (req, res) {

        var userID = req.params.id;

        var d = await User.findOne(userID).populate('enrollSection');

        var courseInfo = await Section.find(d.enrollSection.map(c => c.id)).populate('in').populate('haveTeacher');

        return res.view('user/homepage', { allCourses: courseInfo, userid: userID });

    },

    teacherHomepage: async function (req, res) {

        var userID = req.params.id;

        var courses = await User.findOne(userID).populate('instruct', { sort: 'courseTerm DESC' });

        return res.view('teacher/homepage', { allCourses: courses, userid: userID });

    },

    createCourse: async function (req, res) {

        var userID = req.params.id;

        if (req.method == 'GET') {

            return res.view('teacher/createCourse', { userid: userID });

        } else {

            if (!req.body.Course) { return res.badRequest('Form-data not received.'); }

            var createCourse = await Course.create(req.body.Course).fetch();

            var assignSectionNum = 1;

            for (i = 0; i < createCourse.numOfSection; i++) {

                var section = await Section.create(req.body.Section).fetch();

                await Section.update(section.id).set({
                    sectionNum: assignSectionNum
                }).fetch();

                var uid = parseInt(req.params.id);

                var thisUser = await User.findOne({ where: { id: uid, role: 'teacher' } });

                await Course.addToCollection(createCourse.id, 'haveSection').members(section.id);
                await User.addToCollection(thisUser.id, 'instructSection').members(section.id);

                assignSectionNum++;

            }

            await User.addToCollection(thisUser.id, 'instruct').members(createCourse.id);

            if (req.wantsJSON) {
                return res.json({ message: 'Course has been successfully created.', url: '/teacher/homepage/' + thisUser.id });    // for ajax request
            }

        }

    },

    viewCourse: async function (req, res) {

        if (req.method == 'GET') {

            var viewSelectedCourse = await Course.findOne({ id: req.params.id }).populate('haveSection');

            return res.view('teacher/viewCourse', { userid: req.params.fk, courseinfo: viewSelectedCourse });

        }

    },

    viewSection: async function (req, res) {

        if (req.method == 'GET') {

            var viewSelectedSection = await Section.findOne({ id: req.params.id }).populate('in').populate('haveStudent').populate('haveProject');

            return res.view('teacher/viewSection', { userid: req.params.fk, sectioninfo: viewSelectedSection });

        }

    },

    import_student: async function (req, res) {

        if (req.method == 'GET') { return res.view('teacher/viewSection'); }

        req.file('file').upload({ maxBytes: 10000000 }, async function whenDone(err, uploadedFiles) {
            if (err) { return res.serverError(err); }
            if (uploadedFiles.length === 0) { return res.badRequest('No file was uploaded'); }

            var XLSX = require('xlsx');
            var workbook = XLSX.readFile(uploadedFiles[0].fd);
            var ws = workbook.Sheets[workbook.SheetNames[0]];
            var data = XLSX.utils.sheet_to_json(ws);

            var findStudent = await User.find({ where: { givenId: data.map(v => v.givenId) } });

            await Section.addToCollection(req.params.id, 'haveStudent').members(findStudent.map(d => d.id));

            return res.redirect('/teacher/' + req.params.fk + '/viewSection/' + req.params.id);


        });
    },

    // Course teachBy Teacher
    populate: async function (req, res) {

        var model = await Course.findOne(req.params.id).populate("teachBy");

        if (!model) return res.notFound();

        return res.json(model);

    },

    // Course contain User
    populate: async function (req, res) {

        var model = await Course.findOne(req.params.id).populate("contain");

        if (!model) return res.notFound();

        return res.json(model);

    },

    populate: async function (req, res) {

        var model = await Course.findOne(req.params.id).populate("haveSection");

        if (!model) return res.notFound();

        return res.json(model);

    },


};

