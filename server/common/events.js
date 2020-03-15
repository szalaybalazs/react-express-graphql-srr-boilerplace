const moment = require('moment');

// Handle recurring events
const handleRecurring = (event, date) => {
  switch (event.recurringInterval) {
    case 'WEEKLY':
      if (moment(date).set('hour', 0).diff(moment(event.date).set('hour', 0), 'day') % 7 === 0) return true;
      break;
    case 'SECONDWEEKLY':
      if (moment(date).diff(event.date, 'week') % 2 === 0) return true;
      break;
    case 'MONTHLY':
      if (new Date(event.date).getDate() === date.getDate()) return true;
      break;
    case 'SECONDMONTHLY':
      if (new Date(event.date).getDay() === date.getDay() && Math.abs(new Date(event.date).getMonth() - date.getMonth()) === 2) return true;
    case 'THREEMONTHLY':
      if (new Date(event.date).getDay() === date.getDay() && Math.abs(new Date(event.date).getMonth() - date.getMonth()) === 3) return true;
      break;
    case 'YEARLY':
      if (new Date(event.date).getDay() === date.getDay() && new Date(event.date).getYear() === date.getYear()) return true;
      break;
  };
}

module.exports = {
  handleRecurring
}