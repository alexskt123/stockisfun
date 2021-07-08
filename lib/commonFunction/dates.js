import Holidays from 'date-holidays'
import moment from 'moment-business-days'
const DATE_FORMAT = 'DD-MM-YYYY'

const getFormattedFromToDate = async (days, isBus) => {
  const options = { days, isBus }
  const { from, to } = getFromToDay(options)

  return {
    formattedFromDate: parseInt(from.valueOf() / 1000),
    formattedToDate: parseInt(to.valueOf() / 1000)
  }
}

const subtractDays = (isBus, refDate, days) => {
  const newDate = moment(refDate, DATE_FORMAT)
  if (isBus) return newDate.businessSubtract(days)
  newDate.subtract(days, 'days')
  return newDate
}

const getFromToDay = options => {
  const { loc, year, date, days, isBus } = {
    loc: 'US',
    year: moment().year(),
    date: moment().format(DATE_FORMAT),
    days: 15,
    ...options
  }

  if (isBus) {
    const hd = new Holidays(loc)
    const holidays = [
      ...hd.getHolidays(year - 1),
      ...hd.getHolidays(year),
      ...hd.getHolidays(year + 1)
    ].map(x => moment(x.date).format(DATE_FORMAT))

    moment.updateLocale('en', {
      workingWeekdays: [1, 2, 3, 4, 5],
      holidays,
      holidayFormat: DATE_FORMAT
    })
  }

  //const toDate = moment(date, DATE_FORMAT).nextBusinessDay().prevBusinessDay()
  // use today is ok, yahoo will return last available date
  const toDate = moment(date, DATE_FORMAT)
  const fromDate = subtractDays(isBus, date, days)

  return {
    from: fromDate,
    to: toDate
  }
}

module.exports = {
  getFormattedFromToDate
}
