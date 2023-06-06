/**
 * Node supported encodings.
 */

const Enum = require('./Enum');

const encodings = Enum(
  'ascii',
  'utf8',
  'utf16le',
  'ucs2',
  'base64',
  'latin1',
  'binary',
  'hex',
);

module.exports = Object.freeze(encodings);
