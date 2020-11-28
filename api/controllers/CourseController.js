/**
 * CourseController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {

    homepage: async function (req, res) {

        var userID = req.params.id;

        var d = await User.findOne(userID).populate('enroll', { sort: 'courseTerm DESC'});
  
        var courseInfo = await Course.find(d.enroll.map(c => c.id)).populate('teachBy').sort('courseTerm DESC');
        console.log("Test");
        console.log(courseInfo);

       return res.view('user/homepage', { allCourses: courseInfo });

    },

    teacherHomepage: async function (req, res) {

        var userID = req.params.id;

        var courses = await Teacher.findOne(userID).populate('instruct');

        console.log("Teacher Homepage course :");
        console.log(courses);

       return res.view('teacher/homepage', { allCourses: courses });

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

    // Course belongTo AcademicYear
    populate: async function (req, res) {

        var model = await Course.findOne(req.params.id).populate("belongTo");
    
        if (!model) return res.notFound();
    
        return res.json(model);
    
    },
  

};

