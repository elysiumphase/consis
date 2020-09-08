/**
 * URI helper.
 *
 * ip and domain regexp are credited. All other work is from myself.
 *
 * - parseURI(uri) -> Object
 * - isValidSitemapChar(char) -> Boolean
 * - isValidURIChar(char) -> Boolean
 * - isSchemeChar(char, start) -> Boolean
 * - isPercentEncodingChar(char) -> Boolean
 * - isDomain(name) -> Boolean
 * - isIP(ip) -> Boolean
 * - isIPv4(ip) -> Boolean
 * - isIPv6(ip) -> Boolean
 * - checkURISyntax(uri) -> Object throws URIError
 * - checkURI(uri, { sitemap } = {}) -> Object throws URIError
 * - checkHttpURI(uri, { https, web, sitemap } = {}) -> Object throws URIError
 * - checkHttpsURI(uri) -> Object throws URIError
 * - checkHttpSitemapURI(uri) -> Object throws URIError
 * - checkHttpsSitemapURI(uri) -> Object throws URIError
 * - checkWebURI(uri) -> Object throws URIError
 * - checkSitemapURI(uri) -> Object throws URIError
 * - encodeSitemapURI(uri, { web } = {}) -> String throws URIError
 * - encodeWebURI(uri) -> String throws URIError
 * - decodeSitemapURI(uri, { web } = {}) -> String throws URIError
 * - decodeWebURI(uri, { web } = {}) -> String throws URIError
 */
const { domainToASCII } = require('url');
const { exists, is } = require('./object');
const { int } = require('./cast');

// regexp parsing uri from RFC-3986 https://tools.ietf.org/html/rfc3986#appendix-B
// adding ?: to disable capturing some groups
const uriRegexp = /^(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/;

// ip regexp
// credits: https://github.com/sindresorhus/ip-regex/blob/master/index.js
const v4 = '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}';
const v6seg = '[a-fA-F\\d]{1,4}';
const v6 = `
(
(?:${v6seg}:){7}(?:${v6seg}|:)|                                // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                         // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4}|(:${v6seg}){1,2}|:)|                 // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(:${v6seg}){0,1}:${v4}|(:${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(:${v6seg}){0,2}:${v4}|(:${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(:${v6seg}){0,3}:${v4}|(:${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(:${v6seg}){0,4}:${v4}|(:${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::((?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))           // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(%[0-9a-zA-Z]{1,})?                                           // %eth0            %1
`.replace(/\s*\/\/.*$/gm, '').replace(/\n/g, '').trim();

// sitemap entities
const entities = {
  '&': '&amp;',
  '\'': '&apos;',
  '"': '&quot;',
  '>': '&gt;',
  '<': '&lt;',
};

// inversed entities keys (escaped values)
const entitiesKeys = Object.keys(entities);
const escapedEntities = {};
entitiesKeys.forEach((entity) => {
  escapedEntities[entities[entity]] = entity;
});
const escaped = Object.keys(escapedEntities);
const escapedLen = escaped.length;

/**
 * @func parseURI
 *
 * Parse a string to get uri components.
 *
 * Regexp from RFC-3986 https://tools.ietf.org/html/rfc3986#appendix-B
 * adding ?: to disable capturing some groups.
 *
 * @param  {String} uri
 * @return {Object}
 */
const parseURI = function parseURI(uri) {
  if (is(String, uri)) {
    const [,
      scheme = null,
      authority = null,
      path = null,
      query = null,
      fragment = null,
    ] = uri.match(uriRegexp);
    let userinfo = null;
    let hostAndPort = null;

    if (is(String, authority)) {
      [userinfo = null, hostAndPort = null] = authority.split('@');

      // authority had no '@' and no userinfo can be extracted
      if (!exists(hostAndPort) && exists(userinfo)) {
        hostAndPort = userinfo;
        userinfo = null;
      }
    }

    const [
      host = null,
      port = null,
    ] = is(String, hostAndPort) ? hostAndPort.split(':') : [null, null];

    return {
      scheme,
      authority,
      userinfo,
      host,
      port,
      path,
      query,
      fragment,
    };
  }

  return {
    scheme: null,
    authority: null,
    userinfo: null,
    host: null,
    port: null,
    path: null,
    query: null,
    fragment: null,
  };
};

/**
 * @func isValidSitemapChar
 *
 * Check sitemap legal ascii codes according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-2
 * - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 *
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

  const code = char.charCodeAt();

  return (code >= 33 && code <= 57)
    || (code >= 58 && code <= 70)
    || (code >= 97 && code <= 122)
    || code === 91
    || code === 93
    || code === 95
    || code === 126;
};

/**
 * @func isValidURIChar
 *
 * Check uri legal ascii codes according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-2
 * - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 *
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

  const code = char.charCodeAt();

  return (code >= 33 && code <= 57)
    || (code >= 58 && code <= 59)
    || (code >= 63 && code <= 70)
    || (code >= 97 && code <= 122)
    || code === 61
    || code === 91
    || code === 93
    || code === 95
    || code === 126;
};

/**
 * @func isSchemeChar
 *
 * Check scheme legal ascii codes according to RFC-3986 https://tools.ietf.org/html/rfc3986#section-3.1.
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

  const code = char.charCodeAt();

  if (start) {
    return code >= 97 && code <= 122;
  }

  return (code >= 48 && code <= 57)
    || (code >= 97 && code <= 122)
    || code === 43
    || code === 45
    || code === 46;
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

  const code = char.charCodeAt();

  return (code >= 48 && code <= 57)
    || (code >= 65 && code <= 70);
};

/**
 * @func isDomain
 *
 * Test a name is a valid domain.
 *
 * @param  {String} name
 * @return {Boolean}
 */
const isDomain = function isDomain(name) {
  // credits: based on https://regexr.com/3au3g
  return /^(?:^localhost$)|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/.test(name);
};

/**
 * @func isIP
 *
 * Test a string is a valid IP.
 *
 * @param  {String} ip
 * @return {Boolean}
 */
const isIP = function isIP(ip) {
  if (!is(String, ip)) {
    return false;
  }

  return new RegExp(`(?:^${v4}$)|(?:^${v6}$)`).test(ip);
};

/**
 * @func isIPv4
 *
 * Test a string is a valid IPv4.
 *
 * @param  {String} ip
 * @return {Boolean}
 */
const isIPv4 = function isIPv4(ip) {
  if (!is(String, ip)) {
    return false;
  }

  return new RegExp(`^${v4}$`).test(ip);
};

/**
 * @func isIPv6
 *
 * Test a string is a valid IPv6.
 *
 * @param  {String} ip
 * @return {Boolean}
 */
const isIPv6 = function isIPv6(ip) {
  if (!is(String, ip)) {
    return false;
  }

  return new RegExp(`^${v6}$`).test(ip);
};

/**
 * @func checkURISyntax
 *
 * Check an uri syntax is valid according to RFC-3986 https://tools.ietf.org/html/rfc3986#section-3.
 *
 * @param  {String} uri
 * @return {Object}
 * @throws {URIError}
 */
const checkURISyntax = function checkURISyntax(uri) {
  if (!is(String, uri)) {
    const error = new URIError('uri must be a string');
    error.code = 'URI_INVALID_TYPE';
    throw error;
  }

  // parse uri and check scheme, authority, pathname and slashes
  // NOTE: url.parse automatically convert hostname to punycode and port to number
  // example:
  const {
    scheme,
    authority,
    userinfo,
    host,
    port,
    path,
    query,
    fragment,
  } = parseURI(uri);

  const schemeLen = scheme.length;

  // scheme (required)
  if (!is(String, scheme)) {
    const error = new URIError('uri scheme is required');
    error.code = 'URI_MISSING_SCHEME';
    throw error;
  } else if (schemeLen <= 0) {
    const error = new URIError('uri scheme must not be empty');
    error.code = 'URI_EMPTY_SCHEME';
    throw error;
  }

  // path (required), can be an empty string
  if (!is(String, path)) {
    const error = new URIError('uri path is required');
    error.code = 'URI_MISSING_PATH';
    throw error;
  }

  // check scheme characters
  for (let i = 0; i < schemeLen; i += 1) {
    if (!isSchemeChar(scheme[i], i === 0)) {
      const error = new URIError(`bad scheme char '${scheme[i]}' at index ${i}`);
      error.code = 'URI_INVALID_SCHEME_CHAR';
      throw error;
    }
  }

  // authority

  // check host is a valid ip first (RFC-3986) or a domain name
  if (!isIP(host)) {
    // convert to punycode to check host is a valid domain name
    const punycode = domainToASCII(host);

    if (!isDomain(punycode)) {
      const error = new URIError(`host must be a valid ip or domain name, got ${host}`);
      error.code = 'URI_INVALID_HOST';
      throw error;
    }
  }

  // check port is a number
  if (int(port) === undefined) {
    const error = new URIError(`port must be a number, got ${port}`);
    error.code = 'URI_INVALID_PORT';
    throw error;
  }

  // path: if authority is present path must be empty or start with /
  if (is(String, authority) && authority.length > 0) {
    if (!(path === '' || path.startsWith('/'))) {
      const error = new URIError('path must be empty or start with \'/\' when authority is present');
      error.code = 'URI_INVALID_PATH';
      throw error;
    }
  } else if (path.startsWith('//')) {
    // if authority is not present path must not start with //
    const error = new URIError('path must not start with \'//\' when authority is not present');
    error.code = 'URI_INVALID_PATH';
    throw error;
  }

  return {
    scheme,
    authority,
    userinfo,
    host,
    port,
    path,
    query,
    fragment,
    schemeLen,
    valid: true,
  };
};

/**
 * @func checkURI
 *
 * Check an uri is valid according to RFC-3986 https://tools.ietf.org/html/rfc3986.
 * Optional, check a sitemap uri is valid according to:
 * - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 *
 * @param  {String} uri
 * @param  {Boolean} sitemap
 * @return {Object}
 * @throws {URIError}
 */
const checkURI = function checkURI(uri, { sitemap } = {}) {
  // check uri type and syntax
  const {
    scheme,
    authority,
    userinfo,
    host,
    port,
    path,
    query,
    fragment,
    schemeLen,
  } = checkURISyntax(uri);
  const len = uri.length;
  const checkSitemap = sitemap === true;

  // check each character
  // scheme syntax and characters are validated in checkURISyntax we can escape them
  for (let i = schemeLen; i < len; i += 1) {
    // check character is valid
    if (!isValidURIChar(uri[i])) {
      const error = new URIError(`bad uri char '${uri[i]}' at index ${i}`);
      error.code = 'URI_INVALID_CHAR';
      throw error;
    }

    // check percent encodings
    if (uri[i] === '%') {
      // should be %[a-f0-9]{2}(%[a-f0-9]{2}){0,1}
      // example: %20 or %C3%BC
      if (i + 2 <= len) {
        if (!(isPercentEncodingChar(uri[i + 1]) && isPercentEncodingChar(uri[i + 2]))) {
          const error = new URIError(`bad percent encoding char '${uri[i]}${uri[i] + 1}${uri[i + 2]}' at index ${i}`);
          error.code = 'URI_INVALID_PERCENT_ENCODING_CHAR';
          throw error;
        } else {
          i += 2;
        }
      } else {
        const error = new URIError(`incomplete percent encoding at index ${i}`);
        error.code = 'URI_INVALID_PERCENT_ENCODING';
        throw error;
      }
    }

    // check sitemap entities are escaped if option is true
    if (checkSitemap) {
      // only escaped characters should be present
      // NOTE: test '&' first, order is important for else statement
      if (uri[i] === '&') {
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
          const error = new URIError(`entity '${uri[i]}' must be escaped at index ${i}`);
          error.code = 'URI_INVALID_SITEMAP_CHAR';
          throw error;
        } else {
          i += escapeOffset - 1;
        }
      } else if (entitiesKeys.contains(uri[i])) {
        const error = new URIError(`entity '${uri[i]}' must be escaped at index ${i}`);
        error.code = 'URI_INVALID_SITEMAP_CHAR';
        throw error;
      }
    }
  }

  return {
    scheme,
    authority,
    userinfo,
    host,
    port,
    path,
    query,
    fragment,
    valid: true,
  };
};

/**
 * @func checkHttpURI
 *
 * Check a http/https uri or a http/https sitemap uri is valid according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986
 * - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 *
 * @param  {String} uri
 * @param  {Boolean} https
 * @param {Boolean} web whether to check both http and https
 * @param  {Boolean} sitemap
 * @return {Object}
 * @throws {URIError}
 */
const checkHttpURI = function checkHttpURI(uri, { https, web, sitemap } = {}) {
  const schemesToCheck = [];

  if (https === true) {
    schemesToCheck.push('https');
  } else if (web === true) {
    schemesToCheck.push('http', 'https');
  } else {
    schemesToCheck.push('http');
  }

  const {
    scheme,
    authority,
    userinfo,
    host,
    port,
    path,
    query,
    fragment,
  } = checkURI(uri, { sitemap });

  if (!schemesToCheck.contains(scheme)) {
    const error = new URIError(`scheme must be ${schemesToCheck.join(' or ')}, got ${scheme}`);
    error.code = 'URI_INVALID_SCHEME';
    throw error;
  }

  if (!is(String, authority)) {
    const error = new URIError('authority is required and must be a valid host');
    error.code = 'URI_INVALID_AUTHORITY';
    throw error;
  }

  return {
    scheme,
    authority,
    userinfo,
    host,
    port,
    path,
    query,
    fragment,
    valid: true,
  };
};

/**
 * @func checkHttpsURI
 *
 * Alias to check https uri according to RFC-3986 https://tools.ietf.org/html/rfc3986.
 *
 * @param  {String} uri
 * @return {Object}
 * @throws {URIError}
 */
const checkHttpsURI = function checkHttpsURI(uri) {
  return checkHttpURI(uri, { https: true });
};

/**
 * @func checkHttpSitemapURI
 *
 * Alias to check a http sitemap uri is valid according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986
 * - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 *
 * @param  {String} uri
 * @return {Object}
 * @throws {URIError}
 */
const checkHttpSitemapURI = function checkHttpSitemapURI(uri) {
  return checkHttpURI(uri, { sitemap: true });
};


/**
 * @func checkHttpsSitemapURI
 *
 * Alias to check a https sitemap uri is valid according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986
 * - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 *
 * @param  {String} uri
 * @return {Object}
 * @throws {URIError}
 */
const checkHttpsSitemapURI = function checkHttpsSitemapURI(uri) {
  return checkHttpURI(uri, { https: true, sitemap: true });
};

/**
 * @func checkWebURI
 *
 * Check a http or https uri is valid according to RFC-3986 https://tools.ietf.org/html/rfc3986.
 *
 * @param  {String} uri
 * @return {Object}
 * @throws {URIError}
 */
const checkWebURI = function checkWebURI(uri) {
  return checkHttpURI(uri, { web: true });
};

/**
 * @func checkSitemapURI
 *
 * Check a sitemap uri is valid according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986
 * - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 *
 * @param  {String} uri
 * @return {Object}
 * @throws {URIError}
 */
const checkSitemapURI = function checkSitemapURI(uri) {
  return checkHttpURI(uri, { web: true, sitemap: true });
};

/**
 * @func encodeSitemapURI
 *
 * Encode an uri with checking based on RFC-3986 standard applied to http and https uris and
 * sitemap requirements regarding special entities to escape.
 *
 * Based on:
 * - RFC-3986 https://tools.ietf.org/html/rfc3986
 * - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 *
 * @param {String} uri
 * @param {Boolean} web whether to decode http or https uri
 * @return {String}
 * @throws {URIError}
 */
const encodeSitemapURI = function encodeSitemapURI(uri, { web } = {}) {
  // check uri type and syntax
  // scheme is already fully checked in checkURISyntax and can be skipped then
  const { scheme, schemeLen, authority } = checkURISyntax(uri);
  let uriencoded = scheme;

  // scheme must be http or https
  if (scheme !== 'http' && scheme !== 'https') {
    const error = new URIError(`scheme must be http or https, got ${scheme}`);
    error.code = 'URI_INVALID_SCHEME';
    throw error;
  }

  // authority is required and must be a valid host
  if (!is(String, authority)) {
    const error = new URIError('authority is required and must be a valid host');
    error.code = 'URI_INVALID_AUTHORITY';
    throw error;
  }

  // encode non ASCII characters by lowering case first
  const encodedURI = encodeURI(uri.toLowerCase());
  const len = encodedURI.length;

  // check each character and escape entities if any
  for (let i = schemeLen; i < len; i += 1) {
    // check web uri character is valid
    if (web === true) {
      if (!isValidURIChar(encodedURI[i])) {
        const error = new URIError(`bad uri char '${encodedURI[i]}' at index ${i}`);
        error.code = 'URI_INVALID_CHAR';
        throw error;
      }
    } else {
      // check sitemap character is valid
      if (!isValidSitemapChar(encodedURI[i])) {
        const error = new URIError(`bad sitemap char '${encodedURI[i]}' at index ${i}`);
        error.code = 'URI_INVALID_SITEMAP_CHAR';
        throw error;
      }

      // escape entity if any
      if (exists(entities[encodedURI[i]])) {
        uriencoded += entities[encodedURI[i]];
      } else {
        uriencoded += encodedURI[i];
      }
    }
  }

  return uriencoded;
};

/**
 * @func encodeWebURI
 *
 * Encode an uri with checking based on RFC-3986 standard applied to http and https uris.
 *
 * Based on:
 * - RFC-3986 https://tools.ietf.org/html/rfc3986.
 *
 * @param  {String} uri
 * @return {String}
 * @throws {URIError}
 */
const encodeWebURI = function encodeWebURI(uri) {
  return encodeSitemapURI(uri, { web: true });
};

/**
 * @func decodeSitemapURI
 *
 * Decode a sitemap uri.
 *
 * Based on:
 * - RFC-3986 https://tools.ietf.org/html/rfc3986
 * - https://support.google.com/webmasters/answer/183668?hl=fr&ref_topic=4581190.
 *
 * @param  {String} uri
 * @return {String}
 * @throws {URIError}
 */
const decodeSitemapURI = function decodeSitemapURI(uri, { web } = {}) {
  if (!is(String, uri)) {
    const error = new URIError('uri must be a string');
    error.code = 'URI_INVALID_TYPE';
    throw error;
  }

  if (web !== true) {
    const regexp = new RegExp(Object.keys(escapedEntities).join('|'), 'g');
    const uridecoded = uri.replace(regexp, (match) => escapedEntities[match]);
    return decodeURI(uridecoded);
  }

  return decodeURI(uri);
};

/**
 * @func decodeWebURI
 *
 * Decode a sitemap uri.
 *
 * @param  {String} uri
 * @return {String}
 * @throws {URIError}
 */
const decodeWebURI = function decodeWebURI(uri) {
  return decodeSitemapURI(uri, { web: true });
};

module.exports = Object.freeze({
  parseURI,
  isValidSitemapChar,
  isValidURIChar,
  isSchemeChar,
  isPercentEncodingChar,
  isDomain,
  isIP,
  isIPv4,
  isIPv6,
  checkURISyntax,
  checkURI,
  checkHttpURI,
  checkHttpsURI,
  checkHttpSitemapURI,
  checkHttpsSitemapURI,
  checkWebURI,
  checkSitemapURI,
  encodeSitemapURI,
  encodeWebURI,
  decodeSitemapURI,
  decodeWebURI,
});
