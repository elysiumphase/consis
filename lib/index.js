/**
 * Consis
 *
 * A small Node.js library for type casting, http/s requests, object cloning,
 * and other object, image, time and uuid helpers.
 *
 * Author: Adrien Valcke <adrienvalcke@icloud.com>
 */
const cast = require('./cast');
const encodings = require('./encodings');
const image = require('./image');
const object = require('./object');
const requester = require('./requester');
const time = require('./time');
const uuid = require('./uuid');

module.exports = Object.freeze({
  cast,
  encodings,
  image,
  object,
  requester,
  time,
  uuid,
});
