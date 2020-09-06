/**
 * Sitemap helper.
 *
 *
 */
const { parse: parseUrl } = require('url');
const { exists, is } = require('./object');

const entities = {
  '&': '&amp;',
  '\'': '&apos;',
  '"': '&quot;',
  '>': '&gt;',
  '<': '&lt;',
};

/**
 * @func isValidChar
 *
 * Check legal ascii codes once a string is encoded according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-2
 * - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 * 33 to 57
 * 58 to 70
 * 97 to 122
 * 91
 * 93
 * 9
 * 126
 *
 * @param  {[type]}  char [description]
 * @return {Boolean}      [description]
 */
const isValidChar = function isValidChar(char) {
  if (!is(String, char)) {
    return false;
  }

  return (char.charCodeAt() >= 33 && char.charCodeAt() <= 57)
    || (char.charCodeAt() >= 58 && char.charCodeAt() <= 70)
    || (char.charCodeAt() >= 97 && char.charCodeAt() <= 122)
    || char.charCodeAt() === 91
    || char.charCodeAt() === 93
    || char.charCodeAt() === 95
    || char.charCodeAt() === 126;
};

/**
 * @func encodeWebURI
 *
 * Encode an uri based on RFC-3986 standard applied to http and https urls and
 * sitemap requirements regarding special entities to escape.
 *
 * Based on:
 *  - https://tools.ietf.org/html/rfc3986
 *  - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 * @param  {String} uri
 * @return {String}
 * @throws
 */
const encodeWebURI = function encodeWebURI(uri) {
  if (!is(String, uri)) {
    throw new Error('uri not string');
  }

  let urlencoded = '';

  if (is(String, uri)) {
    // parse uri and check scheme, authority, pathname and slashes
    const {
      protocol,
      host,
      pathname,
      slashes,
    } = parseUrl(uri);

    // scheme: http/https (required)
    if (!(is(String, protocol) && (protocol === 'http:' || protocol === 'https:'))) {
      throw new Error('bad scheme');
    }

    // authority: hostname[:port] (required)
    if (!is(String, host)) {
      throw new Error('bad host');
    }

    // path (required)
    if (!is(String, pathname)) {
      throw new Error('bad pathname');
    }

    // slashes only
    if (!slashes) {
      throw new Error('slashes');
    }

    // encode non ASCII characters by lowering case first
    const encodedURI = encodeURI(uri.toLowerCase());
    const len = encodedURI.length;

    // check each character and escape entities if any
    for (let i = 0; i < len; i += 1) {
      // check character is valid
      if (!isValidChar(encodedURI[i])) {
        throw new Error('bad char, should be an alphanumeric value, only in lower case or one of :/?#[]@!$&\'"()*+,;=.-_~%');
      }

      // escape entity if any
      if (exists(entities[encodedURI[i]])) {
        urlencoded += entities[encodedURI[i]];
      } else {
        urlencoded += encodedURI[i];
      }
    }
  }

  return urlencoded;
};

module.exports = Object.freeze({
  encodeWebURI,
});
