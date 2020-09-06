/**
 * String helper.
 *
 *    - split({ string, separator, max }) -> Array
 *    - capitalize({ string, first } = {}) -> String
 *    - camelCase({ string, separator } = {}) -> String
 *    - replaceAt(str, index, value) -> String
 */
const { is } = require('./object');
const { int } = require('./cast');

/**
 * @func split
 *
 * split a string with the specified separator with a possible maximum split values
 * @param  {String} string
 * @param  {String|RegExp} separator
 * @param  {Number} max maximum splitted values to be returned
 * @return {Array}
 */
const split = function split({ string, separator, max } = {}) {
  const splittedArray = [];

  if (is(String, string) && (is(String, separator) || is(RegExp, separator))) {
    const strings = string.split(separator);
    const stringsLength = strings.length;
    const maximum = is(Number, max) && max >= 0 && max < stringsLength ? max : stringsLength;

    for (let i = 0; i < maximum; i += 1) {
      if (strings[i] !== '') {
        splittedArray.push(strings[i]);
      }
    }
  }

  return splittedArray;
};

/**
 * @func capitalize
 *
 * put to upper case the first letter of a string.
 *
 * @param  {String} string a string to capitalized
 * @param  {Boolean} first whether only the first letter should be in upper case
 * @return {String}
 */
const capitalize = function capitalize({ string, first } = {}) {
  if (is(String, string)) {
    let capitalized = string.charAt(0).toUpperCase();

    if (first === true) {
      capitalized += string.slice(1).toLowerCase();
    } else {
      capitalized += string.slice(1);
    }

    return capitalized;
  }

  return '';
};

/**
 * @func camelCase
 *
 * put to camel case a string which words are separated by a specific string or pattern.
 *
 * @param  {String} string a string to put in camel case
 * @param  {String|RegExp} separator string or pattern separating words
 * @return {String}
 */
const camelCase = function camelCase({ string, separator } = {}) {
  let camelCaseStr = '';

  if (is(String, string) && (is(String, separator) || is(RegExp, separator))) {
    const splitted = string.split(separator);
    const splitLen = splitted.length;
    camelCaseStr = splitted[0].toLowerCase();

    for (let i = 1; i < splitLen; i += 1) {
      camelCaseStr += capitalize({ string: splitted[i], first: true });
    }
  }

  return camelCaseStr;
};

/**
 * support non-Basic-Multilingual-Plane (BMP) characters
 * @param  {[type]} str   [description]
 * @param  {[type]} index [description]
 * @return {[type]}       [description]
 */
const chartAt = function charAt(str, i) {
  if (!is(String, str) || int(i) === undefined) {
    return str;
  }

  const len = str.length;
  const surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  let char = '';
  let index = i;

  while (surrogatePairs.exec(str) !== null) {
    const { lastIndex } = surrogatePairs;

    if ((lastIndex - 2) < index) {
      index += 1;
    } else {
      break;
    }
  }

  if (index >= len || index < 0) {
    return '';
  }

  char += str.charAt(index);

  if (/[\uD800-\uDBFF]/.test(char) && /[\uDC00-\uDFFF]/.test(str.charAt(index + 1))) {
    char += str.charAt(index + 1);
  }

  return char;
};

/**
 * @func replaceAt
 *
 * Replace a value at a specific index of a string.
 * Support non-Basic-Multilingual-Plane (BMP) characters.
 *
 * @param  {String} str
 * @param  {Integer} index
 * @param  {String} value
 * @return {String}
 */
const replaceAt = function replaceAt(str, index, value) {
  if (!is(String, str) || int(index) === undefined || !is(String, value)) {
    return str;
  }

  const len = str.length;
  let replaced = '';

  for (let i = 0; i < len; i += 1) {
    if (index === i) {
      replaced += value;
    } else {
      replaced += chartAt(str, i);
    }
  }

  return replaced;
};

module.exports = Object.freeze({
  split,
  capitalize,
  camelCase,
  replaceAt,
});
