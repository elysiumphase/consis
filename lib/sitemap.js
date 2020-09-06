/**
 * Sitemap helper.
 *
 *
 */
const { parse: parseUrl } = require('url');
const { is } = require('./object');

const entities = {
  '&': '&amp;',
  '\'': '&apos;',
  '"': '&quot;',
  '>': '&gt;',
  '<': '&lt;',
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

  let urlencoded;

  if (is(String, uri)) {
    // parse uri and check scheme, authority and path
    const {
      protocol,
      host,
      pathname,
    } = parseUrl(uri);

    // scheme (http/https) is required
    if (!(is(String, protocol) && (protocol === 'http:' || protocol === 'https:'))) {
      throw new Error('bad scheme');
    }

    // authority
    // path

    // test characters are not valid ones
    // according to RFC-3986 https://tools.ietf.org/html/rfc3986#section-2
    if (/[^a-z0-9:/?#[\]@!$&'()*+,;=.-_~]/i.test(uri)) {
      throw new Error('uri has invalid character, should only be one of ...');
    }

    // encode non ASCII characters
    urlencoded = encodeURI(uri);

    // escape entities
    urlencoded.forEach((char) => {

    });
  }

  return urlencoded;
};

module.exports = Object.freeze({
  encodeWebURI,
});
