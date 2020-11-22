/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */



module.exports.bootstrap = async function () {

  // if (await Person.count() == 0) {

  //   await Person.createEach([
  //     { name: "Martin Choy", age: 23 },
  //     { name: "Kenny Cheng", age: 22 }
  //     // etc.
  //   ]);

  // }

  sails.bcrypt = require('bcryptjs');
  const saltRounds = 10;


  if (await User.count() == 0) {

    const hash = await sails.bcrypt.hash('123456', saltRounds);

    await User.createEach([

      { givenId: 's17228336', password: hash, role: 'student', preferred_name: 'Vicky Lee', fullName: 'LEE Yui Tung', gender: 'Female', contact_mobile: '9430 2848', contact_mail: 's17228336@life.hkbu.edu.hk', study_year: 4, study_programme: "BSC COMPUTER SCI ISA" },
      { givenId: 's17227337', password: hash, role: 'student', preferred_name: 'Jonas Wong', fullName: 'WONG Ming Hong', gender: 'Male', contact_mobile: '9930 2338', contact_mail: 's17227337@life.hkbu.edu.hk', study_year: 3, study_programme: "BSC COMPUTER SCI CST" },
      { givenId: 't18220990', password: hash, role: 'teacher', preferred_name: 'Dr. Kenneth Ko', fullName: 'Ko Pak Ho', gender: 'Male', contact_mobile: '9470 2318', contact_mail: 'T90000@life.hkbu.edu.hk' },
      { givenId: 't19338772', password: hash, role: 'teacher', preferred_name: 'Dr. Sam Tong', fullName: 'Tong Ka Ming', gender: 'Male', contact_mobile: '6623 9810', contact_mail: 'T80000@life.hkbu.edu.hk' },
      // etc.
    ]);

  }

  if (await Teacher.count() == 0) {

    const hash = await sails.bcrypt.hash('123456', saltRounds);

    await Teacher.createEach([
      { givenId: 't20201234', password: hash, role: 'teacher', preferred_name: 'Dr. Christina Lee', fullName: 'Lee Sum Wing'},
      { givenId: 't20202345', password: hash, role: 'teacher', preferred_name: 'Dr. Alex Wong', fullName: 'Wong Siu Ming'},
      { givenId: 't20203456', password: hash, role: 'teacher', preferred_name: 'Dr. Kenneth Ma', fullName: 'Ma Kok Ming'},
    
    ]);

  }

  if (await Course.count() == 0) {

    await Course.createEach([
      { courseID: 'COMP4115', courseName: 'Data Visualization' },
      { courseID: 'COMP4116', courseName: 'Information System' },
      { courseID: 'COMP4117', courseName: 'Software Developement and Testing' },
    
    ]);

  }

  const course1 = await Course.findOne({courseID: 'COMP4115'});
  const course2 = await Course.findOne({courseID: 'COMP4116'});
  const course3 = await Course.findOne({courseID: 'COMP4117'});
  const teacher1 = await Teacher.findOne({givenId: 't20201234'});
  const teacher2 = await Teacher.findOne({givenId: 't20202345'});
  const teacher3 = await Teacher.findOne({givenId: 't20203456'});

  await Teacher.addToCollection(teacher1.id, 'instruct').members(course1.id);
  await Teacher.addToCollection(teacher2.id, 'instruct').members(course2.id);
  await Teacher.addToCollection(teacher3.id, 'instruct').members(course3.id);



  const student1 = await User.findOne({givenId: 's17228336'});
  const student2 = await User.findOne({givenId: 's17227337'});

  await User.addToCollection(student1.id, 'enroll').members(course1.id);
  await User.addToCollection(student1.id, 'enroll').members(course2.id);
  await User.addToCollection(student1.id, 'enroll').members(course3.id);

  await User.addToCollection(student2.id, 'enroll').members(course1.id);
  await User.addToCollection(student2.id, 'enroll').members(course2.id);



  return;

};
