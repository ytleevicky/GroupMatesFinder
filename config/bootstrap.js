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


  sails.bcrypt = require('bcryptjs');
  const saltRounds = 10;


  if (await User.count() == 0) {

    const hash = await sails.bcrypt.hash('123456', saltRounds);

    await User.createEach([

      { givenId: '17228336', password: hash, role: 'student', preferred_name: 'Vicky Lee', fullName: 'LEE Yui Tung', gender: 'Female', contact_mobile: '9430 2848', contact_mail: '17228336@life.hkbu.edu.hk', study_year: 4, study_programme: "Bachelor of Computer Science", imgURL: "/images/user1.png" },
      { givenId: '18222333', password: hash, role: 'student', preferred_name: 'Rachel Yu', fullName: 'YU Wing San', gender: 'Female', contact_mobile: '9981 2244', contact_mail: '18222333@life.hkbu.edu.hk', study_year: 3, study_programme: "Bachelor of Business", imgURL: "/images/user2.png" },
      { givenId: '19333444', password: hash, role: 'student', preferred_name: 'Tina Cheung', fullName: 'CHEUNG Hoi Ting', gender: 'Female', contact_mobile: '9772 2286', contact_mail: '19333444@life.hkbu.edu.hk', study_year: 2, study_programme: "Bachelor of Music", imgURL: "/images/user3.png" },
      { givenId: '17227337', password: hash, role: 'student', preferred_name: 'Jonas Wong', fullName: 'WONG Ming Hong', gender: 'Male', contact_mobile: '9930 2338', contact_mail: '17227337@life.hkbu.edu.hk', study_year: 3, study_programme: "Bachelor of Computer Science", imgURL: "/images/user4.png" },
      { givenId: '17555666', password: hash, role: 'student', preferred_name: 'Isaac Lee', fullName: 'LEE Chi Ming', gender: 'Male', contact_mobile: '9877 2900', contact_mail: '17555666@life.hkbu.edu.hk', study_year: 4, study_programme: "Bachelor of Architecture", imgURL: "/images/user5.png" },
      { givenId: '20331441', password: hash, role: 'student', preferred_name: 'Barry Lam', fullName: 'LAM Pui Kin', gender: 'Male', contact_mobile: '9933 2277', contact_mail: '20331441@life.hkbu.edu.hk', study_year: 1, study_programme: "Bachelor of Accountancy", imgURL: "/images/user6.png" },

      { givenId: '17111333', password: hash, role: 'student', preferred_name: 'George Wong', fullName: 'WONG Lok Man', gender: 'Male', contact_mobile: '9811 2233', contact_mail: '17111333@life.hkbu.edu.hk', study_year: 4, study_programme: "Bachelor of Design", imgURL: "/images/user4.png" },
      { givenId: '18000111', password: hash, role: 'student', preferred_name: 'Harris Ko', fullName: 'KO Ho Yuen', gender: 'Male', contact_mobile: '9772 2388', contact_mail: '18000111@life.hkbu.edu.hk', study_year: 3, study_programme: "Bachelor of Administrative Studies", imgURL: "/images/user5.png" },
      { givenId: '19222666', password: hash, role: 'student', preferred_name: 'Louis Chan', fullName: 'CHAN Tin Ho', gender: 'Male', contact_mobile: '9654 1234', contact_mail: '19222666@life.hkbu.edu.hk', study_year: 2, study_programme: "Bachelor of Journalism", imgURL: "/images/user6.png" },
      { givenId: '17999888', password: hash, role: 'student', preferred_name: 'Howard Cheung', fullName: 'CHEUNG Yat Kin', gender: 'Male', contact_mobile: '9933 1338', contact_mail: '17999888@life.hkbu.edu.hk', study_year: 3, study_programme: "Bachelor of Computer Science", imgURL: "/images/user4.png" },
      { givenId: '20333555', password: hash, role: 'student', preferred_name: 'Bonnie Tam', fullName: 'TAM Hoi Ki', gender: 'Female', contact_mobile: '6623 2900', contact_mail: '20333555@life.hkbu.edu.hk', study_year: 1, study_programme: "Bachelor of Science in Nursing", imgURL: "/images/user1.png" },
      { givenId: '20456123', password: hash, role: 'student', preferred_name: 'Judy Wu ', fullName: 'WU Tze Tung', gender: 'Female', contact_mobile: '9866 2678', contact_mail: '20456123@life.hkbu.edu.hk', study_year: 1, study_programme: "Bachelor of Science in Nursing", imgURL: "/images/user2.png" },

      { givenId: '17228300', password: hash, role: 'student', preferred_name: 'Noah Lee', fullName: 'LEE Pui Ki', gender: 'Male', contact_mobile: '9811 2000', contact_mail: '17228300@life.hkbu.edu.hk', study_year: 4, study_programme: "Bachelor of Design", imgURL: "/images/user4.png" },
      { givenId: '17228301', password: hash, role: 'student', preferred_name: 'Ethan Chan', fullName: 'CHAN Ho Yuen', gender: 'Male', contact_mobile: '9812 2001', contact_mail: '17228301@life.hkbu.edu.hk', study_year: 4, study_programme: "Bachelor of Administrative Studies", imgURL: "/images/user5.png" },
      { givenId: '17228302', password: hash, role: 'student', preferred_name: 'Henry Ng', fullName: 'NG Chak Fung', gender: 'Male', contact_mobile: '9813 2002', contact_mail: '17228302@life.hkbu.edu.hk', study_year: 4, study_programme: "Bachelor of Journalism", imgURL: "/images/user6.png" },
      { givenId: '17228303', password: hash, role: 'student', preferred_name: 'Emma Cheung', fullName: 'CHEUNG Pui Yan', gender: 'Female', contact_mobile: '9814 2003', contact_mail: '17228303@life.hkbu.edu.hk', study_year: 4, study_programme: "Bachelor of Computer Science", imgURL: "/images/user3.png" },
      { givenId: '17228304', password: hash, role: 'student', preferred_name: 'Sophia Tam', fullName: 'TAM Hoi Shan', gender: 'Female', contact_mobile: '9815 2004', contact_mail: '17228304@life.hkbu.edu.hk', study_year: 3, study_programme: "Bachelor of Science in Nursing", imgURL: "/images/user1.png" },
      { givenId: '17228305', password: hash, role: 'student', preferred_name: 'Scarlett Wu ', fullName: 'WU Mei Ki', gender: 'Female', contact_mobile: '9816 2005', contact_mail: '17228305@life.hkbu.edu.hk', study_year: 3, study_programme: "Bachelor of Science in Nursing", imgURL: "/images/user2.png" },

      { givenId: '18220330', password: hash, role: 'student', preferred_name: 'Oliver Lee', fullName: 'LEE Chok Ho', gender: 'Male', contact_mobile: '9833 5000', contact_mail: '18220330@life.hkbu.edu.hk', study_year: 4, study_programme: "Bachelor of Commerce", imgURL: "/images/user4.png" },
      { givenId: '18220331', password: hash, role: 'student', preferred_name: 'Lucas Chan', fullName: 'CHAN Nok Ki', gender: 'Male', contact_mobile: '9833 5001', contact_mail: '18220331@life.hkbu.edu.hk', study_year: 3, study_programme: "Bachelor of Science in Information Technology", imgURL: "/images/user5.png" },
      { givenId: '18220332', password: hash, role: 'student', preferred_name: 'Adam Ng', fullName: 'NG Kin Man', gender: 'Male', contact_mobile: '9833 5002', contact_mail: '18220332@life.hkbu.edu.hk', study_year: 3, study_programme: "Bachelor of Journalism", imgURL: "/images/user6.png" },
      { givenId: '18220333', password: hash, role: 'student', preferred_name: 'Donna Cheung', fullName: 'CHEUNG Wing Yu', gender: 'Female', contact_mobile: '9833 5003', contact_mail: '18220333@life.hkbu.edu.hk', study_year: 3, study_programme: "Bachelor of Science in Psychology", imgURL: "/images/user3.png" },
      { givenId: '18220334', password: hash, role: 'student', preferred_name: 'Anne Tam', fullName: 'TAM Wai Tung', gender: 'Female', contact_mobile: '9833 5004', contact_mail: '18220334@life.hkbu.edu.hk', study_year: 3, study_programme: "Bachelor of Science in Psychology", imgURL: "/images/user1.png" },
      { givenId: '18220335', password: hash, role: 'student', preferred_name: 'Elisa Wu ', fullName: 'WU Tsz Yin', gender: 'Female', contact_mobile: '9833 5005', contact_mail: '18220335@life.hkbu.edu.hk', study_year: 3, study_programme: "Bachelor of Tourism Studies", imgURL: "/images/user2.png" },

      { givenId: 'chrislee', password: hash, role: 'teacher', preferred_name: 'Dr. Chris Lee', fullName: 'LEE Sum Wing', gender: 'Male', contact_mail: 'chriselee@life.hkbu.edu.hk' },
      { givenId: 'alexwong', password: hash, role: 'teacher', preferred_name: 'Dr. Alex Wong', fullName: 'WONG Siu Ming', gender: 'Male', contact_mail: 'alexwong@life.hkbu.edu.hk' },
      { givenId: 'kennethma', password: hash, role: 'teacher', preferred_name: 'Dr. Kenneth Ma', fullName: 'MA Kok Ming', gender: 'Male', contact_mail: 'kennethma@life.hkbu.edu.hk' },

      // etc.
    ]);

  }


  if (await Course.count() == 0) {

    await Course.createEach([
      { courseID: 'COMP4115', courseName: 'Data Visualization', courseTerm: '2019-2020 Semester 1', numOfSection: 1 },
      { courseID: 'COMP4116', courseName: 'Information System', courseTerm: '2019-2020 Semester 1', numOfSection: 1 },
      { courseID: 'COMP4117', courseName: 'Software Developement and Testing', courseTerm: '2019-2020 Semester 1', numOfSection: 1 },

    ]);

  }

  if (await Evaluation.count() == 0) {

    await Evaluation.createEach([

      {
        name: 'Evaluation Question - Template 1', description: 'This is an evaluation template.', createdQuestion: {
          peerEvaluation: [
            {
              question: "How would you rate the quality of this group member's work?",
              type: "Rating"
            },
            {
              question: "Areas of improvement for this group member",
              type: "Sentence"
            },
            {
              question: "Overall feedback and comments about this group member",
              type: "Paragraph"
            }
          ],
          selfEvaluation: [
            {
              question: "Describe your major contributions to this group project.",
              type: "Paragraph"
            },
            {
              question: "Describe what you have learnt through attempting this group project.",
              type: "Paragraph"
            }
          ]
        }
      },



    ]);


  }




  const student1 = await User.findOne({ givenId: '17228336' });
  const student2 = await User.findOne({ givenId: '17227337' });

  const course1 = await Course.findOne({ courseID: 'COMP4115' });
  const course2 = await Course.findOne({ courseID: 'COMP4116' });
  const course3 = await Course.findOne({ courseID: 'COMP4117' });

  const teacher1 = await User.findOne({ givenId: 'chrislee' });
  const teacher2 = await User.findOne({ givenId: 'alexwong' });
  const teacher3 = await User.findOne({ givenId: 'kennethma' });

  const evaluation = await Evaluation.findOne({ name: 'Evaluation Question - Template 1' });



  await User.addToCollection(teacher1.id, 'instruct').members([course1.id, course3.id]);
  await User.addToCollection(teacher2.id, 'instruct').members(course2.id);
  await User.addToCollection(teacher3.id, 'instruct').members(course3.id);

  await User.addToCollection(teacher3.id, 'createEvaluation').members(evaluation.id);


  return;

};
