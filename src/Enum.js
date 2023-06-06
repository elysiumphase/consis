/**
 * Enum helper.
 */

/**
 * @func Enum
 * Enumeration polyfill.
 *
 * @param {Array} enums - list of enumeration arguments
 * @return {Object}
 */
const Enum = function Enum(...enums) {
  if (!Array.isArray(enums) || enums.length <= 0) {
    return {};
  }

  const enumeration = {};

  enums.forEach((key) => {
    enumeration[key] = key;
  });

  return Object.freeze(enumeration);
};

module.exports = Enum;
