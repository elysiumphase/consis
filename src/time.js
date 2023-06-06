/**
 * Time helper.
 */
const { date, str } = require('./cast');
const { exists, is } = require('./object');

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
 * @func timeout
 * @param  {Number} ms
 * @param  {Promise} promise
 * @return {Promise}
 * @throws {Error}
 */
const timeout = function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    const milliseconds = is(Number, ms) && ms >= 0 ? ms : 0;
    const timer = setTimeout(() => {
      const error = new Error('promise timed out');
      error.name = 'PromiseTimeoutError';
      error.code = 'PROMISE_TIMEOUT';
      reject(error);
    }, milliseconds);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch(reject);
  });
};

// time in milliseconds
const ms = {
  second: 1000,
};
ms.minute = 60 * ms.second;
ms.hour = 60 * ms.minute;
ms.day = 24 * ms.hour;
ms.week = 7 * ms.day;
ms.month = 30 * ms.day;

/**
 * @func getDate
 * @param  {Date|String} d
 * @param  {Object} add
 * @param  {Object} subtract
 * @throws {Error}
 */
const getDate = function getDate({ d, add, subtract } = {}) {
  const dateOpts = date(d) || new Date();

  if (!is(Object, subtract) && !is(Object, add)) {
    return dateOpts;
  }

  let subtractMs = 0;
  let addMs = 0;

  if (is(Object, subtract)) {
    Object.keys(subtract).forEach((key) => {
      if (is(Number, subtract[key]) && exists(ms[key])) {
        subtractMs += subtract[key] * ms[key];
      }
    });
  }

  if (is(Object, add)) {
    Object.keys(add).forEach((key) => {
      if (is(Number, add[key]) && exists(ms[key])) {
        addMs += add[key] * ms[key];
      }
    });
  }

  return new Date(dateOpts.getTime() - subtractMs + addMs);
};

module.exports = Object.freeze({
  isISOStringDate,
  sleep,
  toLocaleISOString,
  timeout,
  ms,
  getDate,
});
