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

  if (await AcademicYear.count() == 0) {

    await AcademicYear.createEach([
      { termID: '2019-S1' },
      { termID: '2019-S2' },
    
    ]);

  }


  if (await User.count() == 0) {

    const hash = await sails.bcrypt.hash('123456', saltRounds);

    await User.createEach([

      { givenId: '17228336', password: hash, role: 'student', preferred_name: 'Vicky Lee', fullName: 'LEE Yui Tung', gender: 'Female', contact_mobile: '9430 2848', contact_mail: '17228336@life.hkbu.edu.hk', study_year: 4, study_programme: "BSC COMPUTER SCI ISA", imgURL: "/images/user1.png" },
      { givenId: '17227337', password: hash, role: 'student', preferred_name: 'Jonas Wong', fullName: 'WONG Ming Hong', gender: 'Male', contact_mobile: '9930 2338', contact_mail: '17227337@life.hkbu.edu.hk', study_year: 3, study_programme: "BSC COMPUTER SCI CST", imgURL: "/images/user4.png" },

      // etc.
    ]);

  }

  if (await Teacher.count() == 0) {

    const hash = await sails.bcrypt.hash('123456', saltRounds);

    await Teacher.createEach([
      { givenId: 'chrislee', password: hash, role: 'teacher', preferred_name: 'Dr. Chris Lee', fullName: 'Lee Sum Wing'},
      { givenId: 'alexwong', password: hash, role: 'teacher', preferred_name: 'Dr. Alex Wong', fullName: 'Wong Siu Ming'},
      { givenId: 'kennethma', password: hash, role: 'teacher', preferred_name: 'Dr. Kenneth Ma', fullName: 'Ma Kok Ming'},
    
    ]);

  }

  if (await Course.count() == 0) {

    await Course.createEach([
      { courseID: 'COMP4115', courseName: 'Data Visualization', courseTerm: '2019-S1' },
      { courseID: 'COMP4116', courseName: 'Information System', courseTerm: '2019-S1' },
      { courseID: 'COMP4117', courseName: 'Software Developement and Testing', courseTerm: '2019-S1' },
      { courseID: 'GDIT1016', courseName: 'Big Data Analysis', courseTerm: '2019-S2' },
    
    ]);

  }

  const Yr2019S1 = await AcademicYear.findOne({termID: '2019-S1'});
  const Yr2019S2 = await AcademicYear.findOne({termID: '2019-S2'});

  const student1 = await User.findOne({givenId: '17228336'});
  const student2 = await User.findOne({givenId: '17227337'});

  const course1 = await Course.findOne({courseID: 'COMP4115'});
  const course2 = await Course.findOne({courseID: 'COMP4116'});
  const course3 = await Course.findOne({courseID: 'COMP4117'});
  const course4 = await Course.findOne({courseID: 'GDIT1016'});

  const teacher1 = await Teacher.findOne({givenId: 'chrislee'});
  const teacher2 = await Teacher.findOne({givenId: 'alexwong'});
  const teacher3 = await Teacher.findOne({givenId: 'kennethma'});

  await User.addToCollection(student1.id, 'enrollAt').members(Yr2019S1.id);
  await User.addToCollection(student1.id, 'enrollAt').members(Yr2019S2.id);
  await User.addToCollection(student2.id, 'enrollAt').members(Yr2019S1.id);
  await User.addToCollection(student2.id, 'enrollAt').members(Yr2019S2.id);

  await Teacher.addToCollection(teacher1.id, 'instruct').members(course1.id);
  await Teacher.addToCollection(teacher1.id, 'instruct').members(course4.id);
  await Teacher.addToCollection(teacher2.id, 'instruct').members(course2.id);
  await Teacher.addToCollection(teacher3.id, 'instruct').members(course3.id);
  await Teacher.addToCollection(teacher1.id, 'instruct').members(course3.id);

  await AcademicYear.addToCollection(Yr2019S1.id, 'have').members([course1.id, course2.id, course3.id]);
  await AcademicYear.addToCollection(Yr2019S2.id, 'have').members([course4.id]);


  await User.addToCollection(student1.id, 'enroll').members([course1.id, course2.id, course3.id, course4.id]);
  

  await User.addToCollection(student2.id, 'enroll').members([course2.id, course4.id]);
 



  return;

};
