/**
 * UUID helper.
 *
 *    - getUUIDVersion(thing) -> Number
 *    - isValidUUID(thing, version) -> Boolean
 */
const { is } = require('./object');
const { int } = require('./cast');

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-4][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const versionIndex = 14;

// variant for v3 and v4
const variant = ['8', '9', 'a', 'b'];
const variantIndex = 19;

/**
 * @func getUUIDVersion
 *
 * get the uuid version of a specified uuid, -1 if not an uuid
 * @param  {String} thing
 * @return {Number} the uuid version, -1 if not an uuid
 */
const getUUIDVersion = function getUUIDVersion(thing) {
  if (is(String, thing) && thing.length >= versionIndex) {
    return int(thing.charAt(versionIndex), { ge: 1, le: 5 });
  }

  return -1;
};

/**
 * @func isValidUUID
 *
 * whether a string is a valid uuid in a specified version
 * @param  {String} thing
 * @param  {Integer Number} version
 * @return {Boolean}
 */
const isValidUUID = function isValidUUID(thing, version) {
  const v = int(version, { ge: 1, le: 4 }) || 4;
  let isValid = false;

  if (is(String, thing)) {
    if (uuidPattern.test(thing)) {
      if (v === getUUIDVersion(thing)) {
        switch (v) {
          case 1:
          case 2:
            isValid = true;
            break;

          case 3:
          case 4:
            isValid = variant.indexOf(thing.charAt(variantIndex)) !== -1;
            break;
          default:
        }
      }
    }
  }

  return isValid;
};

module.exports = Object.freeze({
  getUUIDVersion,
  isValidUUID,
});
