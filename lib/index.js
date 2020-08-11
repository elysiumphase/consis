/**
 * Consis
 *
 * A small Node.js library for type casting, http/s requests, object cloning,
 * and other object, string, image, time and uuid helpers.
 *
 * Author: Adrien Valcke <adrienvalcke@icloud.com>
 */
const cast = require('./cast');
const encodings = require('./encodings');
const image = require('./image');
const math = require('./math');
const object = require('./object');
const requester = require('./requester');
const string = require('./string');
const time = require('./time');
const uuid = require('./uuid');

module.exports = Object.freeze({
  cast,
  encodings,
  image,
  math,
  object,
  requester,
  string,
  time,
  uuid,
});
