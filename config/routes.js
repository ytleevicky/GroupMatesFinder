/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // '/': { view: 'pages/homepage' },

  '/': 'UserController.login',

  '/homepage/:id': 'CourseController.homepage',
  '/teacher/homepage/:id': 'CourseController.teacherHomepage',

  'GET /user/login': 'UserController.login',
  'POST /user/login': 'UserController.login',
  'GET /user/logout': 'UserController.logout',
  'GET /user/profile': 'UserController.profile',
  'GET /user/editProfile/:id': 'UserController.editProfile',
  'PATCH /user/:id': 'UserController.editProfile',

  '/createCourse': 'CourseController.createCourse',
  'POST /createCourse': 'CourseController.createCourse',
  '/teacher/viewCourse/:id': 'CourseController.viewCourse',
  '/teacher/viewSection/:id': 'CourseController.viewSection',

  '/import_student/:id': 'CourseController.import_student',

  // '/createProject': 'ProjectController.createProject',
  'POST /createProject/:id': 'ProjectController.createProject',


  '/viewProject/:id': 'ProjectController.viewProject',


  // Associations

  'GET /teacher/:id/instruct': 'TeacherController.populate',
  'GET /course/:id/teachBy': 'CourseController.populate',
  // 'POST /user/:id/supervises/add/:fk': 'UserController.add',
  // 'POST /user/:id/supervises/remove/:fk': 'UserController.remove',

  'GET /user/:id/enroll': 'UserController.populate',
  'GET /course/:id/contain': 'CourseController.populate',

  'GET /course/:id/haveSection': 'CourseController.populate',
  'GET /section/:id/in': 'SectionController.populate',

  'GET /user/:id/enrollSection': 'UserController.populate',
  'GET /section/:id/haveStudent': 'SectionController.populate',

  'GET /teacher/:id/instructSection': 'TeacherController.populate',
  'GET /section/:id/haveTeacher': 'SectionController.populate',

  'GET /project/:id/inSection': 'ProjectController.populate',
  'GET /section/:id/haveProject': 'SectionController.populate',


  // 'GET /user/:id/enrollAt': 'UserController.populate',
  // 'GET /academicYear/:id/haveStudent': 'AcademicYear.populate',

  // 'GET /course/:id/belongTo': 'CourseController.populate',
  // 'GET /academicYear/:id/have': 'AcademicYear.populate',


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
