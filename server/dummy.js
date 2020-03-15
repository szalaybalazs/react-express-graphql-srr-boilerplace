const mongoose = require('mongoose');
const moment = require('moment');
const path = require('path');

// Config
require('./config')();
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const schedule = require('../scheduleDummy');

const database = require('./database');
//models
const {
  School,
  SchoolSettings,
  User,
  Group,
  Room,
  SchoolYear,
  Subject,
  Assessment,
  Evaluation,
  TimetableEvent,
  ScheduleEvent,
  SchedulePreset,
  Lesson,
  LessonAttachment,
  Ticket,
  Sign,
  Module,
  Category,
} = database;

process.env.PRODUCTION = false;



//mongoose.connect('mongodb://szalay:Almacsutka2001@ds115193.mlab.com:15193/elektronikus-iskolai-alaprendszer')
// mongoose.connect(process.env.DB_URI);

mongoose.connection.on('open', () => {
  (async () => {
    const startingTime = moment();

    await Promise.all([
      Assessment.deleteMany(),
      School.deleteMany(),
      SchoolSettings.deleteMany(),
      SchoolYear.deleteMany(),
      User.deleteMany(),
      Group.deleteMany(),
      Room.deleteMany(),
      Subject.deleteMany(),
      TimetableEvent.deleteMany(),
      ScheduleEvent.deleteMany(),
      SchedulePreset.deleteMany(),
      Lesson.deleteMany(),
      LessonAttachment.deleteMany(),
      Sign.deleteMany(),
      Ticket.deleteMany(),
      Module.deleteMany(),
      Category.deleteMany(),
    ]).catch(console.log);

    const categories = await Promise.all([
      Category.create({ name: { en: 'School management', hu: 'Iskola kezelés' } }),
      Category.create({ name: { en: 'Grading', hu: 'Osztályozás' } }),
    ]);

    await Module.create({
      name: {
        hu: 'Teszt modul'
      },
      categories: categories.map(_ => _._id),
      description: {
        hu: 'Alma',
        en: 'Apple',
        de: 'Apfel'
      }
    });

    const piarSettings = await SchoolSettings.create({
      login: {
        title: 'Piarista Gimnázium, BP',
        address: 'Piarista köz 1.',
        webpage: 'budapest.piarista.hu',
        email: 'budapest@piarista.hu',
        phone: '+36(40)1231234',
      }
    })
    const vpgsettings = await SchoolSettings.create({
      login: {
        title: 'Verespálné Gimnázium',
      }
    })

    await School.create({
      name: 'Piarista Gimnázium',
      shortname: 'piaristabudapest',
      om: '035259',
      settings: piarSettings._id,
    })
    
    const school = await School.create({
      name: 'Verespálné Gimnázium',
      shortname: 'vpg',
      om: '035231',
      studentFields: [
        {
          label: 'Parental information',
          subsegments: [
            {
              label: 'Mother',
              fields: [
                {
                  type: 'text',
                  label: 'Name',
                  key: 'name_mother',
                },
                {
                  type: 'location',
                  label: 'Residence',
                  key: 'residence_mother'
                },
                {
                  type: 'phone',
                  label: 'Phone number',
                  key: 'phone_mother'
                },
              ]
            },
            {
              label: 'Father',
              fields: [
                {
                  type: 'text',
                  label: 'Name',
                  key: 'name_father',
                },
                {
                  type: 'location',
                  label: 'Residence',
                  key: 'residence_father',
                },
                {
                  type: 'phone',
                  label: 'Phone number',
                  key: 'phone_father'
                },
              ]
            }
          ]
        },
        {
          label: 'Kinderkarten information',
          fields: [
            {
              type: 'textarea',
              label: 'Data',
              key: 'kindergarten'
            }
          ]
        },
        {
          label: 'Relationship datas',
          fields: [
            {
              type: 'textarea',
              label: 'Admission data',
              key: 'admission'
            }
          ]
        },
      ],
      settings: vpgsettings._id,
    });

    const schoolYear = await SchoolYear.create({
      name: 'Current year',
      starting: new Date('2019-9-1'),
      ending: new Date('2020-06-16'),
      school: school._id,
    });


    // await Promise.all(schedule.map(schedule => ScheduleEvent.create(schedule)));

    const preset = await SchedulePreset.create({ schedule, name: 'Default' });

    for(let i = 0; i < 7; i++) await ScheduleEvent.create({ 
      school: school._id, 
      preset: preset._id, 
      date: `2019-09-0${2 + i}`, 
      recurringInterval: 'WEEKLY'
    })

    await SchoolYear.create({
      name: 'Teszt Year',
      starting: new Date('2018-9-1'),
      ending: new Date('2019-06-16'),
      school: school._id,
    });

    await Room.create({
      name: 'Infó',
      school: school._id,
    });

    // await Promise.all(new Array(500).fill(null).map((_, i) => User.create({
    //     email: 'student@boilerplace.hu',
    //     firstName: 'Student',
    //     lastName: 'User',
    //     middleName: i,
    //     password: 'hello',
    //     school: school._id,
    //     uniqueId: 'alma',
    //     passwordChangeRequired: true,
    //     meta: {
    //       name_mother: 'Prób Anna',
    //       name_father: 'Teszt Elek',
    //     }
    //   })));
    const student = await User.create({
      email: 'student@boilerplace.hu',
      firstName: 'Student',
      lastName: 'User',
      password: 'hello',
      school: school._id,
      uniqueId: 'alma',
      passwordChangeRequired: true,
      meta: {
        name_mother: 'Prób Anna',
        name_father: 'Teszt Elek',
      }
    });


    await User.create({
      email: 'admin@boilerplace.hu',
      firstName: 'Admin',
      lastName: 'User',
      password: 'admin',
      school: school._id,
      superadmin: true,
      passwordChangeRequired: true,
      permissions: {
        USER_ACTION: false,
        USER_CREATE: true,
        USER_EDIT: true,
        USER_REMOVE: false,
        GROUP_ACTION: false,
        GROUP_CREATE: true,
        GROUP_EDIT: true,
        GROUP_REMOVE: false,
        SCHOOL_ACTION: false,
        SCHOOL_CREATE: true,
        SCHOOL_EDIT: true,
        SCHOOL_REMOVE: false,
      },
      type: 'ADMIN',
    })
    
    // const emma = await User.create({
    //   email: 'emma@boilerplace.hu',
    //   firstName: 'Molnár-Szabó',
    //   lastName: 'Emma',
    //   password: 'rombusz',
    //   school: school._id,
    //   uniqueId: 'm-sz-e-2002',
    //   passwordChangeRequired: false,
    //   birthday: new Date('2002-08-15'),
    //   birthplace: 'Budapest',
    //   nationality: 'Hungarian',
    //   residence: 'Budapest 1028, Kisgazda utca 8.',
    //   phonenumber: '+36-30-654-5277',
    // })

    const test = await User.create({
      email: 'test@boilerplace.hu',
      firstName: 'Teszt',
      lastName: 'Elek',
      password: 'rombusz',
      school: school._id,
      uniqueId: 't-e-2002',
      passwordChangeRequired: false,
      birthday: new Date('2002-08-15'),
      birthplace: 'Budapest',
      nationality: 'Hungarian',
      residence: 'Budapest 1028, Kisgazda utca 8.',
      phonenumber: '+36-30-654-5277',
    })

    const teacher = await User.create({
      email: 'teacher@boilerplace.hu',
      firstName: 'Teacher',
      lastName: 'User',
      password: 'hello',
      school: school._id,
      type: 'TEACHER'
    })

    const group = await Group.create({
      type: 'CLASS',
      name: 'Test class',
      users: [student._id],
      leader: teacher._id,
      schoolYear: schoolYear._id,
    });

    const subgroup = await Group.create({
      name: 'Test group',
      users: [test._id],
      leader: teacher._id,
      schoolYear: schoolYear._id,
      parent: group._id,
    });

    const subject = await Subject.create({
      name: 'Test subject',
      teacher: teacher._id,
      group: group._id,
      schoolYear: schoolYear._id,
    })

    await TimetableEvent.create({
      index: 0,
      date: new Date('2019-09-02'),
      recurring: true,
      recurringInterval: 'WEEKLY',
      subject: subject._id,
      schoolYear: schoolYear._id,
    });

    const overWritten = await TimetableEvent.create({
      index: 1,
      date: new Date('2019-09-02'),
      recurring: true,
      recurringInterval: 'WEEKLY',
      subject: subject._id,
      schoolYear: schoolYear._id,
    });

    await TimetableEvent.create({
      index: 1,
      date: new Date('2019-11-11').toISOString(),
      subject: subject._id,
      schoolYear: schoolYear._id,
      overwrites: overWritten._id,
      modifiers: [
        {
          type: 'CANCEL'
        }
      ]
    });

    const testAttachment = await LessonAttachment.create({
      title: 'Témazáró dolgozat',
      notes: 'Mindent, amit eddig vettünk 😉',
      type: 'TEST',
    })

    await Lesson.create({
      date: new Date('2019-09-02'),
      start: new Date('2019. Sept 2 9:15'),
      end: new Date('2019. Sept 2 10:00'),
      event: overWritten._id,
      notes: 'Nem csináltunk semmit 🐳',
      teacher: teacher._id,
      subject: subject._id,
      schoolYear: schoolYear._id,
      attachments: [testAttachment._id],
    })

    const assessment = await Assessment.create({
      subject: subject._id,
      name: 'Test assesment',
      date: '2019. 10. 12.',
      test: testAttachment._id
    })
    const assessment2 = await Assessment.create({
      subject: subject._id,
      name: 'Test assesment 2',
      date: '2019. 09. 28.',
    })
    const assessment3 = await Assessment.create({
      subject: subject._id,
      name: 'Test assesment 3',
      date: '2019. 08. 16.',
    })

    await Evaluation.create({
      assessment: assessment._id,
      value: 5,
      student: student._id,
    })
    await Evaluation.create({
      assessment: assessment2._id,
      value: 1,
      student: student._id,
    })
    await Evaluation.create({
      assessment: assessment3._id,
      value: 3,
      student: student._id,
    })

    console.log(`Created dummy database 🐴  it took: ${moment().diff(startingTime) / 1000}s`);
    return process.exit(0);
  })();
});