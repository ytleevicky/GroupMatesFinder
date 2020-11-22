/**
 * TeacherController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

       // Teacher instruct Course
       populate: async function (req, res) {

        var model = await Teacher.findOne(req.params.id).populate("instruct");
    
        if (!model) return res.notFound();
    
        return res.json(model);
    
    },
  

};

