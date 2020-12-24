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

  '/createCourse/:id': 'CourseController.createCourse',
  'POST /createCourse/:id': 'CourseController.createCourse',
  '/teacher/:fk/viewCourse/:id': 'CourseController.viewCourse',
  '/teacher/:fk/viewSection/:id': 'CourseController.viewSection',

  '/import_student/:id/:fk': 'CourseController.import_student',

  'POST /createProject/:id/:fk': 'ProjectController.createProject',
  'POST /student/:uid/section/:sid/project/:pid/createGroup': 'GroupController.createGroup',
  '/student/:uid/section/:sid/project/:pid/viewCreatedGroup/:gid': 'GroupController.viewCreatedGroup',


  '/student/:sid/viewProject/:id': 'ProjectController.viewProject',
  '/student/:sid/section/:id/project/:pid': 'ProjectController.groupFormation',
  '/teacher/:id/section/:fk/participants': 'CourseController.addParticipants',
  '/student/:sid/section/:fk/project/:pid/viewStudentProfile/:id': 'ProjectController.viewStudentProfile',
  'POST /addParticipant/:id/:fk': 'CourseController.addParticipants',
  'POST /participant/:id/:fk/:uid': 'CourseController.removeParticipants',
  'POST /student/:uid/section/:sid/project/:pid/group/:gid/inviteMember': 'GroupController.inviteMember',



  // Invitation
  '/invitation/:id': 'GroupController.invitation',
  'POST /student/:uid/acceptInvitation/:gid': 'GroupController.acceptInvitation',
  '/student/:uid/section/:sid/project/:pid/viewGroup/:gid': 'GroupController.viewGroup',
  'POST /student/:uid/section/:sid/project/:pid/applyToGroup/:gid': 'GroupController.viewGroup',  // User apply to Group 
  'POST /student/:uid/section/:sid/project/:pid/:tid/acceptToGroup/:gid': 'GroupController.acceptToGroup', // Group accept User request



  // Associations

  'GET /teacher/:id/instruct': 'UserController.populate',
  'GET /course/:id/teachBy': 'CourseController.populate',
  // 'POST /user/:id/supervises/add/:fk': 'UserController.add',
  // 'POST /user/:id/supervises/remove/:fk': 'UserController.remove',

  'GET /user/:id/enroll': 'UserController.populate',
  'GET /course/:id/contain': 'CourseController.populate',

  'GET /course/:id/haveSection': 'CourseController.populate',
  'GET /section/:id/in': 'SectionController.populate',

  'GET /user/:id/enrollSection': 'UserController.populate',
  'GET /section/:id/haveStudent': 'SectionController.populate',

  'GET /teacher/:id/instructSection': 'UserController.populate',
  'GET /section/:id/haveTeacher': 'SectionController.populate',

  'GET /project/:id/inSection': 'ProjectController.populate',
  'GET /section/:id/haveProject': 'SectionController.populate',

  'GET /project/:id/haveGroup': 'ProjectController.populate',
  'GET /group/:id/inProject': 'GroupController.populate',

  'GET /user/:id/create': 'UserController.populate',
  'GET /group/:id/createdBy': 'GroupController.populate',

  'GET /user/:id/apply': 'UserController.populate',
  'GET /group/:id/invite': 'GroupController.populate',

  'GET /user/:id/applyGroup': 'UserController.populate',
  'GET /group/:id/consider': 'GroupController.populate',



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
