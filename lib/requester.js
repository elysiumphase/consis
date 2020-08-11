/**
 * Requester.
 *
 *    - requester(options) -> Promise({ statusCode, headers, body })
 *
 * options:
 *  - url
 *  - method
 *  - headers
 *  - data
 *  - format
 *  - encoding
 *  - agent
 *  - auth
 *  - createConnection
 *  - defaultPort
 *  - family
 *  - localAddress
 *  - lookup
 *  - maxHeaderSize
 *  - timeout
 */
const http = require('http');
const https = require('https');
const dns = require('dns');
const { parse: parseUrl } = require('url');
const querystring = require('querystring');
const { debuglog } = require('util');
const encodings = require('./encodings');
const {
  is,
  clone,
  exists,
  hasOwn,
} = require('./object');

const debug = debuglog('requester');
const formats = ['json', 'string', 'buffer', 'stream'];
const defaults = {
  // func options
  format: 'stream',
  encoding: encodings.utf8,
  data: {},

  // request options
  agent: undefined,
  auth: undefined,
  createConnection: undefined,
  defaultPort: undefined,
  family: undefined,
  headers: {},
  localAddress: undefined,
  lookup: dns.lookup,
  maxHeaderSize: 8192,
  method: 'GET',
  timeout: 60000,
};

/**
 * @func requester
 *
 * @param  {Object} options
 * @return {Promise} resolve Object { statusCode, headers, body }
 */
const requester = function requester(options) {
  /* eslint consistent-return: "off" */
  return new Promise((resolve, reject) => {
    if (!exists(options)) {
      const error = new Error('missing options');
      error.name = 'RequesterError';
      error.code = 'MISSING_OPTIONS';
      return reject(error);
    }

    debug('options parameter', options);

    const requestOptions = {};
    const data = exists(options.data) ? options.data : defaults.data;
    let protocol;
    let body;
    let stringify;
    let encoding;
    let format;

    // parse url, get protocol, hostname, port and path
    try {
      const {
        protocol: protocolUrl,
        hostname,
        port,
        path,
      } = parseUrl(options.url);

      // set protocol to http or https according to url
      if (protocolUrl === 'https:') {
        protocol = https;
      } else if (protocolUrl === 'http:') {
        protocol = http;
      } else {
        const error = new Error(`bad protocol in url, expected http/https and found ${protocolUrl}`);
        error.name = 'RequesterError';
        error.code = 'BAD_URL_PROTOCOL';
        return reject(error);
      }

      requestOptions.protocol = protocolUrl;
      requestOptions.hostname = hostname;
      requestOptions.port = port;
      requestOptions.path = path;
    } catch (e) {
      const error = new Error(`bad url, ${e.message}`);
      error.name = 'RequesterError';
      error.code = 'BAD_URL';
      return reject(error);
    }

    // format
    if (!exists(options.format)) {
      ({ format } = defaults);
    } else {
      if (formats.indexOf(options.format) === -1) {
        const error = new Error(`bad format ${options.format}`);
        error.name = 'RequesterError';
        error.code = 'BAD_FORMAT';
        return reject(error);
      }

      format = options.format;
    }

    // encoding
    if (!exists(options.encoding)) {
      ({ encoding } = defaults);
    } else {
      if (!hasOwn(encodings, options.encoding)) {
        const error = new Error(`bad encoding ${options.encoding}`);
        error.name = 'RequesterError';
        error.code = 'BAD_ENCODING';
        return reject(error);
      }

      encoding = options.encoding;
    }

    // let http.request manage bad options
    requestOptions.agent = exists(options.agent) ? options.agent : defaults.agent;
    requestOptions.auth = exists(options.auth) ? options.auth : defaults.auth;
    requestOptions.createConnection = exists(options.createConnection)
      ? options.createConnection
      : defaults.createConnection;
    requestOptions.defaultPort = exists(options.defaultPort)
      ? options.defaultPort
      : defaults.defaultPort;
    requestOptions.family = exists(options.family) ? options.family : defaults.family;
    requestOptions.headers = exists(options.headers) ? clone(options.headers) : defaults.headers;
    requestOptions.localAddress = exists(options.localAddress)
      ? options.localAddress
      : defaults.localAddress;
    requestOptions.lookup = exists(options.lookup) ? options.lookup : defaults.lookup;
    requestOptions.maxHeaderSize = exists(options.maxHeaderSize)
      ? options.maxHeaderSize
      : defaults.maxHeaderSize;
    requestOptions.method = is(String, options.method)
      ? options.method.toUpperCase()
      : defaults.method;
    requestOptions.timeout = exists(options.timeout) ? options.timeout : defaults.timeout;

    // manage request headers and body
    if (requestOptions.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      ({ stringify } = querystring);
    } else if (is(String, requestOptions.headers['Content-Type'])
      && requestOptions.headers['Content-Type'].includes('application/json')) {
      ({ stringify } = JSON);
    }

    // stringify request data
    if (is(Function, stringify)) {
      try {
        body = stringify(data);
        requestOptions.headers['Content-Length'] = Buffer.byteLength(body);
      } catch (e) {
        const error = new Error(`unable to stringify data, ${e.message}`);
        error.name = 'RequesterError';
        error.code = 'STRINGIFY_BODY_ERROR';
        return reject(error);
      }
    } else {
      // fix some issues
      body = '{}';
    }

    debug('options', { format, encoding, body });
    debug('request options', requestOptions);

    // request
    const req = protocol.request(requestOptions, (res) => {
      const { statusCode, headers = {} } = res;

      if (format === 'stream') {
        resolve({ statusCode, headers, body: res });
      } else {
        const buffers = [];
        let finalBufferLength = 0;

        res.setEncoding(encoding);

        res.on('error', (err) => {
          const error = new Error(err.message);
          error.name = 'RequesterError';
          error.code = 'RESPONSE_ERROR';
          return reject(error);
        });

        res.on('data', (chunk) => {
          const buff = Buffer.from(chunk, encoding);
          buffers.push(buff);
          finalBufferLength += buff.length;
        });

        res.on('end', () => {
          let resBody = null;
          let finalBuffer = null;

          if (finalBufferLength > 0) {
            finalBuffer = Buffer.concat(buffers, finalBufferLength);
          }

          try {
            if (exists(finalBuffer)) {
              debug('response data', finalBuffer.toString(encoding));

              switch (format) {
                case 'json':
                  resBody = JSON.parse(finalBuffer.toString(encoding));
                  break;
                case 'string':
                  resBody = finalBuffer.toString(encoding);
                  break;
                default:
                  resBody = finalBuffer;
              }
            }

            resolve({ statusCode, headers, body: resBody });
          } catch (e) {
            const error = new Error(`unable to format response in ${format}: ${finalBuffer.toString('utf8')}`);
            error.name = 'RequesterError';
            error.code = 'RESPONSE_FORMAT_ERROR';
            return reject(error);
          }
        });
      }
    });

    // request error
    req.on('error', (err) => {
      const error = new Error(`request error, ${err.message}`);
      error.name = 'RequesterError';
      error.code = 'REQUEST_ERROR';
      return reject(error);
    });

    // request timeout
    req.on('timeout', () => {
      req.abort();
      const error = new Error('request timed out');
      error.name = 'RequesterError';
      error.code = 'REQUEST_TIMEOUT';
      return reject(error);
    });

    // write data to request
    req.write(body);

    req.end();
  });
};

module.exports = requester;
