/**
 * Number helper.
 */
const { is, compare } = require('./object');

/**
 * @func minmax
 *
 * directly get min and max values in a specific array, works with numbers and strings
 * NOTE: for performance use.
 *
 * @param  {Array} array
 * @return {Object} { min, max }
 */
const minmax = function minmax(array) {
  if (!is(Array, array)) {
    return { min: undefined, max: undefined };
  }

  let min;
  let max;

  array.forEach((value) => {
    if (max === undefined) {
      max = value;
    } else if (compare(value, max).superior) {
      max = value;
    }

    if (min === undefined) {
      min = value;
    } else if (compare(value, min).inferior) {
      min = value;
    }
  });

  return { min, max };
};

// exports
module.exports = Object.freeze({
  minmax,
});
