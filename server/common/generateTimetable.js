const { 
  TimetableEvent, 
  ScheduleEvent, 
  SchedulePreset,
  Group, 
  Subject, 
  Lesson,
  SchoolYear,
} = require('../database');
const moment = require('moment');

const { handleRecurring } = require('./events');

const getSchedule = async ({ schoolYear, date }) => {
  const _schoolYear = await SchoolYear.findOne({ _id: schoolYear });
  if (!_schoolYear) throw new Error('No schoolyear found. #ERR:404');

  const events = await ScheduleEvent.find({ school: _schoolYear.school, $or: [{ date }, { recurring: true }]});

  const overwriting = events.find(event => event.date === date && event.overwrites);

  const event = overwriting || events.find(event => !moment(event.date).diff(date, 'day') && !event.recurring || handleRecurring(event, moment(date)));
  event.date = new Date(event.date);
  console.log(event.date)
  return event;
}

const generateTimetable = async ({ schoolYear, from = new Date(), to = new Date(), subject, user, group }) => {
  const dayNumber = Math.abs(moment(new Date(from)).diff(new Date(to), 'day')) + 1;
  const dateArray = [moment(from)];

  // Generate query
  const query = { schoolYear: schoolYear._id || schoolYear, $or: [{ date: { $gte: from, $lte: to } }, { recurring: true }] };

  // Handling subject
  if (subject) query.subject = subject._id || subject;

  // Handling user
  if (user) {
    const userId = user._id || user;
    const groups = await Group.find({ $or: [{ users: userId }, { leader: userId }] });
    const subjects = await Subject.find({ group: groups.map(group => group._id)});

    query.subject = subjects.map(subject => subject._id)
  }

  // Handling group
  if (group) {
    const _subject = await Subject.findOne({ group: group._id || group });
    query.subject = _subject && _subject._id
  }

  // Find events
  const events = await TimetableEvent.find(query);
  const lessons = await Lesson.find(query);


  // Generate date array
  for (let i = 1; i < dayNumber; i++) dateArray[i] = moment(from.toUTCString()).add(i, 'day');

  // Fill day array with events
  const dayArray = await Promise.all(dateArray.map(async (date) => {
    const localEvents = JSON.parse(JSON.stringify(events.map(event => event.toObject())));
    // Get schedule
    const schedule = await getSchedule({ schoolYear, date });

    const day = { 
      date: new Date(date), 
      events: [], 
      lessons: lessons.filter(lesson => new Date(lesson.date).getDay() === new Date(date).getDay()),
      schedule,
    };

    const dayEvents = [];
    // Filter events by weekday
    await Promise.all(localEvents.filter(event => new Date(event.date).getDay() === new Date(date).getDay()).map(async (event, index, array) => {
      event.id = event._id;
      // Get events on the date
      const preset = await SchedulePreset.findOne({ _id: (day.schedule || {}).preset });
      const schedule = preset.schedule.find(schedule => schedule.number === event.index);

      if (!schedule) return;
      event.start = new Date(`${moment(date).format('YYYY-MM-DD')} ${moment(schedule.start).format('HH:mm')}`);
      event.end = new Date(`${moment(date).format('YYYY-MM-DD')} ${moment(schedule.end).format('HH:mm')}`);

      if (!moment(event.date).diff(date, 'day') && !event.recurring) dayEvents.push(event);
      if (event.recurring && handleRecurring(event, date)) dayEvents.push(event);
    }));


    // Filtering out overwritten events
    dayEvents.sort((a, b) => a.index - b.index).forEach(event => {
      if (event.overwrites) return day.events.push(event);
      if (!dayEvents.find(({ overwrites }) => event._id === overwrites)) return day.events.push(event);
    });

    return day;
  }));

  return {
    days: dayArray
  };
}

module.exports = generateTimetable;