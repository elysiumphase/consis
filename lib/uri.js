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
const escaped = Object.values(entities);
const escapedLen = escaped.length;
const escapedEntities = {};
Object.keys(entities).forEach((entity) => {
  escapedEntities[entities[entity]] = entity;
});

/**
 * @func isValidSitemapChar
 *
 * Check legal ascii codes once a string is encoded according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-2
 * - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 * 33 to 57       !"#$%&'()*+,-./0-9
 * 58 to 70       :;<=>?@A-F
 * 97 to 122      a-z
 * 91             [
 * 93             ]
 * 95             _
 * 126            ~
 *
 * @param  {String} char
 * @return {Boolean}
 */
const isValidSitemapChar = function isValidSitemapChar(char) {
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
 * @func isValidURIChar
 *
 * Check legal ascii codes once a string is encoded according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-2
 * - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 * 33 to 57       !"#$%&'()*+,-./0-9
 * 58 to 59       :;
 * 61             =
 * 63 to 70       ?@A-F
 * 97 to 122      a-z
 * 91             [
 * 93             ]
 * 95             _
 * 126            ~
 *
 * @param  {String} char
 * @return {Boolean}
 */
const isValidURIChar = function isValidURIChar(char) {
  if (!is(String, char)) {
    return false;
  }

  return (char.charCodeAt() >= 33 && char.charCodeAt() <= 57)
    || (char.charCodeAt() >= 58 && char.charCodeAt() <= 59)
    || (char.charCodeAt() >= 63 && char.charCodeAt() <= 70)
    || (char.charCodeAt() >= 97 && char.charCodeAt() <= 122)
    || char.charCodeAt() === 61
    || char.charCodeAt() === 91
    || char.charCodeAt() === 93
    || char.charCodeAt() === 95
    || char.charCodeAt() === 126;
};

/**
 * @func isSchemeChar
 *
 * Check scheme char according to RFC-3986 https://tools.ietf.org/html/rfc3986#section-3.1.
 *
 * Scheme must start with a letter and be followed by any combination of
 * letters, digits, plus ("+"), period ("."), or hyphen ("-").
 *
 * Letters must be in lowercase.
 *
 * 43             +
 * 45             -
 * 46             .
 * 48 to 57       0-9
 * 97 to 122      a-z
 *
 * @param  {String} char
 * @return {Boolean}
 */
const isSchemeChar = function isSchemeChar(char, start) {
  if (!is(String, char)) {
    return false;
  }

  if (start) {
    return char.charCodeAt() >= 97 && char.charCodeAt() <= 122;
  }

  return (char.charCodeAt() >= 48 && char.charCodeAt() <= 57)
    || (char.charCodeAt() >= 97 && char.charCodeAt() <= 122)
    || char.charCodeAt() === 43
    || char.charCodeAt() === 45
    || char.charCodeAt() === 46;
};

/**
 * @func checkURISyntax
 *
 * Check an uri syntax is valid according to RFC-3986 https://tools.ietf.org/html/rfc3986#section-3.
 *
 * @param  {String} uri
 * @return {Boolean}
 * @throws
 */
const checkURISyntax = function checkURISyntax(uri) {
  if (!is(String, uri)) {
    throw new Error('must be a string');
  }

  // parse uri and check scheme, authority, pathname and slashes
  const {
    protocol,
    host,
    pathname,
    query,
    hash,
    slashes,
  } = parseUrl(uri);

  // slashes only
  if (!slashes) {
    throw new Error('slashes only');
  }

  let schemeLen;

  // scheme (required)
  if (!is(String, protocol)) {
    throw new Error('scheme is required');
  } else {
    schemeLen = protocol.length - 1;

    if (schemeLen <= 0) {
      throw new Error('scheme must not be empty');
    }
  }

  // path (required), path can be empty
  if (!is(String, pathname)) {
    throw new Error('bad pathname');
  }

  // check scheme characters
  let scheme = '';

  for (let i = 0; i < schemeLen; i += 1) {
    if (!isSchemeChar(protocol[i], i === 0)) {
      throw new Error(`bad scheme char at index ${i}, scheme must start with a letter and be one of a-z0-9+-.`);
    } else {
      scheme += protocol[i];
    }
  }

  // authority = host(hostname[:port])
  // if authority is present path must be empty or start with /
  if (is(String, host) && host.length > 0) {
    if (!(pathname === '' || pathname.startsWith('/'))) {
      throw new Error('path must be empty or start with / when authority is present');
    }
  } else if (pathname.startsWith('//')) {
    // if authority is not present path must not start with //
    throw new Error('path must not start with // when authority is not present');
  }

  // fragment
  const fragment = is(String, hash) ? hash.replace('#', '') : null;

  return {
    query,
    scheme,
    schemeLen,
    fragment,
    authority: host,
    path: pathname,
  };
};

/**
 * @func isPercentEncodingChar
 *
 * Check percent encoding char according to RFC-3986 https://tools.ietf.org/html/rfc3986#section-2.1.
 *
 * 48 to 57       0-9
 * 65 to 70       A-F
 *
 * @param  {String} char
 * @return {Boolean}
 */
const isPercentEncodingChar = function isPercentEncodingChar(char) {
  if (!is(String, char)) {
    return false;
  }

  return (char.charCodeAt() >= 48 && char.charCodeAt() <= 57)
    || (char.charCodeAt() >= 65 && char.charCodeAt() <= 70);
};

/**
 * @func checkURI
 *
 * Check an uri is valid according to RFC-3986 https://tools.ietf.org/html/rfc3986.
 *
 * @param  {String} char
 * @return {Boolean}
 */
const checkURI = function checkURI(uri, { sitemap } = {}) {
  if (!is(String, uri)) {
    throw new Error('uri must be a string');
  }

  // check uri syntax
  const {
    query,
    scheme,
    schemeLen,
    fragment,
    authority,
    path,
  } = checkURISyntax(uri);
  const len = uri.length;
  const checkSitemap = sitemap === true;

  // check each character
  // scheme syntax and characters are validated in checkURISyntax we can escape it
  for (let i = schemeLen; i < len; i += 1) {
    // check character is valid
    if (!isValidURIChar(uri[i])) {
      throw new Error('bad uri char, should be an alphanumeric value, only in lower case or one of :/?#[]@!$&\'"()*+,;=.-_~%');
    }

    // check percent encodings
    if (uri[i] === '%') {
      // should be %[a-f0-9]{2}(%[a-f0-9]{2}){0,1}
      // example: %20 or %C3%BC
      if (i + 2 <= len) {
        if (!(isPercentEncodingChar(uri[i + 1]) && isPercentEncodingChar(uri[i + 2]))) {
          throw new Error(`bad percent encoding at index ${i}`);
        } else {
          i += 2;
        }
      } else {
        throw new Error(`incomplete percent encoding at index ${i}`);
      }
    }

    // check sitemap entities are escaped
    if (checkSitemap) {
      // only escaped characters should be present
      if (uri[i] === '\''
        || uri[i] === '"'
        || uri[i] === '>'
        || uri[i] === '<') {
        throw new Error(`entity ${uri[i]} must be escaped`);
      } else if (uri[i] === '&') {
        let escapeOffset;

        for (let index = 0; index < escapedLen; index += 1) {
          const escape = escaped[index];
          const escapeLen = escape.length;

          if (i + escapeLen <= len && escape === uri.substring(i, i + escapeLen)) {
            escapeOffset = escapeLen;
            break;
          }
        }

        if (!exists(escapeOffset)) {
          throw new Error(`entity ${uri[i]} must be escaped`);
        } else {
          i += escapeOffset - 1;
        }
      }
    }
  }

  return {
    query,
    scheme,
    schemeLen,
    fragment,
    authority,
    path,
    valid: true,
  };
};

/**
 * @func checkHttpURI
 *
 * Check an uri is a valid sitemap url according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-2
 * - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 *
 * @param  {String} char
 * @return {Boolean}
 */
const checkHttpURI = function checkHttpURI(uri, { https, sitemap } = {}) {
  const schemeToCheck = https === true ? 'https' : 'http';
  const {
    query,
    scheme,
    schemeLen,
    fragment,
    authority,
    path,
  } = checkURI(uri, { sitemap });

  if (scheme !== schemeToCheck) {
    throw new Error(`scheme must be ${schemeToCheck}`);
  }

  if (!is(String, authority)) {
    throw new Error('authority is required and must be a valid host');
  }

  return {
    query,
    scheme,
    schemeLen,
    fragment,
    authority,
    path,
    valid: true,
  };
};

/**
 * @func checkHttpsURI
 *
 * Check an uri is a valid sitemap url according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-2
 * - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 *
 * @param  {String} char
 * @return {Boolean}
 */
const checkHttpsURI = function checkHttpsURI(uri) {
  return checkHttpURI(uri, { https: true });
};

/**
 * @func checkHttpSitemapURI
 *
 * Check an uri is a valid sitemap url according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-2
 * - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 *
 * @param  {String} char
 * @return {Boolean}
 */
const checkHttpSitemapURI = function checkHttpSitemapURI(uri) {
  return checkHttpURI(uri, { sitemap: true });
};


/**
 * @func checkHttpsSitemapURI
 *
 * Check an uri is a valid sitemap url according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-2
 * - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 *
 * @param  {String} char
 * @return {Boolean}
 */
const checkHttpsSitemapURI = function checkHttpsSitemapURI(uri) {
  return checkHttpURI(uri, { https: true, sitemap: true });
};

/**
 * @func checkWebURI
 *
 * Check an uri is a valid sitemap url according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-2
 * - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 *
 * @param  {String} char
 * @return {Boolean}
 */
const checkWebURI = function checkWebURI(uri) {
  return checkHttpURI(uri) || checkHttpsURI(uri);
};

/**
 * @func checkSitemapURI
 *
 * Check an uri is a valid sitemap url according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-2
 * - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 *
 * @param  {String} char
 * @return {Boolean}
 */
const checkSitemapURI = function checkSitemapURI(uri) {
  return checkHttpSitemapURI(uri) || checkHttpsSitemapURI(uri);
};

/**
 * @func encodeSitemapURI
 *
 * Encode an uri based on RFC-3986 standard applied to http and https uris and
 * sitemap requirements regarding special entities to escape.
 *
 * Based on:
 *  - https://tools.ietf.org/html/rfc3986
 *  - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 * @param  {String} uri
 * @return {String}
 * @throws
 */
const encodeSitemapURI = function encodeSitemapURI(uri) {
  // check uri syntax
  // scheme is already fully checked in checkURISyntax and can be skipped then
  const { scheme, schemeLen, authority } = checkURISyntax(uri);
  let uriencoded = scheme;

  // shceme must be http or https
  if (scheme !== 'http' && scheme !== 'https') {
    throw new Error('scheme must be http or https');
  }

  // authority is required and must be a valid host name
  if (!is(String, authority)) {
    throw new Error('authority is required and must be a valid host');
  }

  // encode non ASCII characters by lowering case first
  const encodedURI = encodeURI(uri.toLowerCase());
  const len = encodedURI.length;

  // check each character and escape entities if any
  for (let i = schemeLen; i < len; i += 1) {
    // check character is valid
    if (!isValidSitemapChar(encodedURI[i])) {
      throw new Error('bad char, should be an alphanumeric value, only in lower case or one of :/?#[]@!$&\'"()*+,;=.-_~%<>');
    }

    // escape entity if any
    if (exists(entities[encodedURI[i]])) {
      uriencoded += entities[encodedURI[i]];
    } else {
      uriencoded += encodedURI[i];
    }
  }

  return uriencoded;
};

/**
 * @func decodeSitemapURI
 *
 * Encode an uri based on RFC-3986 standard applied to http and https uris and
 * sitemap requirements regarding special entities to escape.
 *
 * Based on:
 *  - https://tools.ietf.org/html/rfc3986
 *  - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 * @param  {String} uri
 * @return {String}
 * @throws
 */
const decodeSitemapURI = function decodeSitemapURI(uri) {
  if (!is(String, uri)) {
    throw new Error('not a string');
  }

  const regexp = new RegExp(Object.keys(escapedEntities).join('|'), 'g');
  const uridecoded = uri.replace(regexp, (match) => escapedEntities[match]);

  return decodeURI(uridecoded);
};

const uri = 'http://www.thousand.xyz/héllo.html&q=5';
const encoded = encodeSitemapURI(uri);
console.log('encoding:');
console.log(uri);
console.log(encoded);
console.log(decodeSitemapURI(encoded));

console.log('checking uri');
console.log('is http sitemap uri: ' + checkHttpSitemapURI(encoded).valid);
console.log('is sitemap uri: ' + checkSitemapURI(encoded).valid);
console.log('is web uri: ' + checkWebURI(encoded).valid);

module.exports = Object.freeze({
  encodeSitemapURI,
});
