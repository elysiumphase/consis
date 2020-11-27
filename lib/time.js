/**
 * Time helper.
 *
 *    - sleep(ms) -> Promise (resolve only)
 *    - isISOStringDate(thing) -> Boolean
 *    - toLocaleISOString(date) -> String
 */
const { date, str } = require('./cast');
const { is } = require('./object');

/**
 * @func sleep
 *
 * @param  {Number} ms milliseconds
 * @return {Promise}
 */
const sleep = function sleep(ms) {
  return new Promise((resolve) => {
    const milliseconds = is(Number, ms) && ms >= 0 ? ms : 0;
    setTimeout(resolve, milliseconds);
  });
};

/**
 * @func isISOStringDate
 *
 * whether a string respects the ISO 8601 format
 * @param  {String} thing
 * @return {Boolean}
 */
const isISOStringDate = function isISOStringDate(thing) {
  if (is(String, thing)) {
    const d = date(thing);

    return d !== undefined && d.toISOString() === String(thing);
  }

  return false;
};

/**
 * @func toLocaleISOString
 *
 * get the locale ISO 8601 formatted string for a specified date
 * @param  {Date} d
 * @return {String|undefined} ISO 8601 date format including locale timezone offset
 */
const toLocaleISOString = function toLocaleISOString(d) {
  let localeISOString;

  if (is(Date, d)) {
    const timezoneOffset = d.getTimezoneOffset();
    const timezoneOffsetMs = timezoneOffset * 60000;
    const hours = Math.abs(timezoneOffset) / 60;
    const timezoneOffsetHours = Math.floor(hours);
    const minutes = (hours - timezoneOffsetHours) * 60;
    const timezoneOffsetMinutes = Math.round(minutes);

    const timezoneOffsetHoursStr = timezoneOffsetHours >= 10 ? str(timezoneOffsetHours) : `0${timezoneOffsetHours}`;
    const timezoneOffsetMinutesStr = timezoneOffsetMinutes >= 10 ? str(timezoneOffsetMinutes) : `0${timezoneOffsetMinutes}`;

    const offsetSign = timezoneOffset <= 0 ? '+' : '-';

    const offset = `${offsetSign}${timezoneOffsetHoursStr}:${timezoneOffsetMinutesStr}`;
    localeISOString = (new Date(d.getTime() - timezoneOffsetMs)).toISOString().slice(0, -1);
    localeISOString += offset;
  }

  return localeISOString;
};

/**
 * @ func timeout
 * @param  {Number} ms
 * @param  {Promise} promise
 * @return {Promise}
 * @throws {Error}
 */
const timeout = function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    const milliseconds = is(Number, ms) && ms >= 0 ? ms : 0;
    const timer = setTimeout(() => reject(new Error('promise timed out')), milliseconds);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch(reject);
  });
};

module.exports = Object.freeze({
  isISOStringDate,
  sleep,
  toLocaleISOString,
  timeout,
});
