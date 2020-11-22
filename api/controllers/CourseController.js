/**
 * CourseController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {

    homepage: async function (req, res) {

        var courses = await Course.find();

        var courseInfo = await Course.find(courses.map(c => c.id)).populate('teachBy');

       return res.view('user/homepage', { allCourses: courseInfo });

    },

    // Course teachBy Teacher
    populate: async function (req, res) {

        var model = await Course.findOne(req.params.id).populate("teachBy");
    
        if (!model) return res.notFound();
    
        return res.json(model);
    
    },
  

};

