/**
 * AcademicYearController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {

     // AcademicYear haveStudent User
     populate: async function (req, res) {

        var model = await AcademicYear.findOne(req.params.id).populate("haveStudent");
    
        if (!model) return res.notFound();
    
        return res.json(model);
    
    },

    // AcademicYear have Course
    populate: async function (req, res) {

        var model = await AcademicYear.findOne(req.params.id).populate("have");
    
        if (!model) return res.notFound();
    
        return res.json(model);
    
    },
  

};

