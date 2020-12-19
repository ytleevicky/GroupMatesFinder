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

  // if (await AcademicYear.count() == 0) {

  //   await AcademicYear.createEach([
  //     { termID: '2019-S1' },
  //     { termID: '2019-S2' },

  //   ]);

  // }


  if (await User.count() == 0) {

    const hash = await sails.bcrypt.hash('123456', saltRounds);

    await User.createEach([

      { givenId: '17228336', password: hash, role: 'student', preferred_name: 'Vicky Lee', fullName: 'LEE Yui Tung', gender: 'Female', contact_mobile: '9430 2848', contact_mail: '17228336@life.hkbu.edu.hk', study_year: 4, study_programme: "Bachelor of Computer Science", imgURL: "/images/user1.png" },
      { givenId: '18222333', password: hash, role: 'student', preferred_name: 'Rachel Yu', fullName: 'Yu Wing San', gender: 'Female', contact_mobile: '9981 2244', contact_mail: '18222333@life.hkbu.edu.hk', study_year: 3, study_programme: "Bachelor of Business", imgURL: "/images/user2.png" },
      { givenId: '19333444', password: hash, role: 'student', preferred_name: 'Tina Cheung', fullName: 'Cheung Hoi Ting', gender: 'Female', contact_mobile: '9772 2286', contact_mail: '19333444@life.hkbu.edu.hk', study_year: 2, study_programme: "Bachelor of Music", imgURL: "/images/user3.png" },
      { givenId: '17227337', password: hash, role: 'student', preferred_name: 'Jonas Wong', fullName: 'WONG Ming Hong', gender: 'Male', contact_mobile: '9930 2338', contact_mail: '17227337@life.hkbu.edu.hk', study_year: 3, study_programme: "Bachelor of Computer Science", imgURL: "/images/user4.png" },
      { givenId: '17555666', password: hash, role: 'student', preferred_name: 'Isaac Lee', fullName: 'Lee Chi Ming', gender: 'Male', contact_mobile: '9877 2900', contact_mail: '17555666@life.hkbu.edu.hk', study_year: 4, study_programme: "Bachelor of Architecture", imgURL: "/images/user5.png" },
      { givenId: '20331441', password: hash, role: 'student', preferred_name: 'Barry Lam', fullName: 'Lam Pui Kin', gender: 'Male', contact_mobile: '9933 2277', contact_mail: '20331441@life.hkbu.edu.hk', study_year: 1, study_programme: "Bachelor of Accountancy", imgURL: "/images/user6.png" },

      // etc.
    ]);

  }

  if (await Teacher.count() == 0) {

    const hash = await sails.bcrypt.hash('123456', saltRounds);

    await Teacher.createEach([
      { givenId: 'chrislee', password: hash, role: 'teacher', preferred_name: 'Dr. Chris Lee', fullName: 'Lee Sum Wing' },
      { givenId: 'alexwong', password: hash, role: 'teacher', preferred_name: 'Dr. Alex Wong', fullName: 'Wong Siu Ming' },
      { givenId: 'kennethma', password: hash, role: 'teacher', preferred_name: 'Dr. Kenneth Ma', fullName: 'Ma Kok Ming' },

    ]);

  }

  if (await Course.count() == 0) {

    await Course.createEach([
      { courseID: 'COMP4115', courseName: 'Data Visualization', courseTerm: '2019-2020 Semester 1', numOfSection: 1 },
      { courseID: 'COMP4116', courseName: 'Information System', courseTerm: '2019-2020 Semester 1', numOfSection: 1 },
      { courseID: 'COMP4117', courseName: 'Software Developement and Testing', courseTerm: '2019-2020 Semester 1', numOfSection: 1 },

    ]);

  }

  // const Yr2019S1 = await AcademicYear.findOne({termID: '2019-S1'});
  // const Yr2019S2 = await AcademicYear.findOne({termID: '2019-S2'});

  const student1 = await User.findOne({ givenId: '17228336' });
  const student2 = await User.findOne({ givenId: '17227337' });

  const course1 = await Course.findOne({ courseID: 'COMP4115' });
  const course2 = await Course.findOne({ courseID: 'COMP4116' });
  const course3 = await Course.findOne({ courseID: 'COMP4117' });

  const teacher1 = await Teacher.findOne({ givenId: 'chrislee' });
  const teacher2 = await Teacher.findOne({ givenId: 'alexwong' });
  const teacher3 = await Teacher.findOne({ givenId: 'kennethma' });

  // await User.addToCollection(student1.id, 'enrollAt').members(Yr2019S1.id);
  // await User.addToCollection(student1.id, 'enrollAt').members(Yr2019S2.id);
  // await User.addToCollection(student2.id, 'enrollAt').members(Yr2019S1.id);
  // await User.addToCollection(student2.id, 'enrollAt').members(Yr2019S2.id);

  await Teacher.addToCollection(teacher1.id, 'instruct').members([course1.id, course3.id]);
  await Teacher.addToCollection(teacher2.id, 'instruct').members(course2.id);
  await Teacher.addToCollection(teacher3.id, 'instruct').members(course3.id);

  // await AcademicYear.addToCollection(Yr2019S1.id, 'have').members([course1.id, course2.id, course3.id]);
  // await AcademicYear.addToCollection(Yr2019S2.id, 'have').members([course4.id]);


  // await User.addToCollection(student1.id, 'enroll').members([course1.id, course2.id, course3.id]);
  // await User.addToCollection(student2.id, 'enroll').members([course2.id]);




  return;

};
