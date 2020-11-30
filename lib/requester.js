/**
 * Requester.
 *
 *    - requester(options) -> Promise({ statusCode, headers, body })
 *
 * options:
 *  - url
 *  - data
 *  - format
 *  - encoding
 *
 * - https://nodejs.org/api/http.html#http_http_request_url_options_callback
 */
const http = require('http');
const https = require('https');
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
  data: null,
  body: '{}',

  // request options
  headers: {},
  method: 'GET',
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

    debug('options parameter: ', options);

    // opts will be used for request
    const opts = clone(options) || {};
    const data = is(Object, opts.data)
      || is(String, opts.data)
      || is(Buffer, opts.data) ? opts.data : defaults.data;
    let format;
    let encoding;
    let protocol;
    let query;
    let pathname;
    let body;

    // parse url, get protocol, hostname, port and path
    try {
      const {
        protocol: protocolUrl,
        hostname,
        port,
        path,
        query: queryUrl,
        pathname: pathnameUrl,
      } = parseUrl(opts.url);
      query = queryUrl;
      pathname = pathnameUrl;

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

      opts.protocol = protocolUrl;
      opts.hostname = hostname;
      opts.port = port;
      opts.path = path;
    } catch (e) {
      const error = new Error(`bad url, ${e.message}`);
      error.name = 'RequesterError';
      error.code = 'BAD_URL';
      return reject(error);
    }

    // method
    if (!is(String, opts.method)) {
      opts.method = defaults.method;
    }

    // headers
    if (!is(Object, opts.headers)) {
      opts.headers = defaults.headers;
    }

    // format
    if (!exists(opts.format)) {
      ({ format } = defaults);
    } else {
      if (formats.indexOf(opts.format) === -1) {
        const error = new Error(`bad format ${opts.format}`);
        error.name = 'RequesterError';
        error.code = 'BAD_FORMAT';
        return reject(error);
      }

      ({ format } = opts);
    }

    // encoding
    if (!exists(opts.encoding)) {
      ({ encoding } = defaults);
    } else {
      if (!hasOwn(encodings, opts.encoding)) {
        const error = new Error(`bad encoding ${opts.encoding}`);
        error.name = 'RequesterError';
        error.code = 'BAD_ENCODING';
        return reject(error);
      }

      ({ encoding } = opts);
    }

    // manage query data and body
    if (exists(data)) {
      // if Content-Type is application/x-www-form-urlencoded
      if (opts.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        // if method is GET recompose request path by adding both query and data query at the end
        if (opts.method === 'GET') {
          let queryData = querystring.stringify(data);

          if (is(String, query)) {
            queryData += `&${query}`;
          }

          opts.path = `${pathname}?${queryData}`;
          body = defaults.body;
        } else {
          body = querystring.stringify(data);
        }
      } else if (opts.headers['Content-Type'] === 'application/json') {
        try {
          body = JSON.stringify(data);
        } catch (e) {
          const error = new Error(`unable to stringify data, ${e.message}`);
          error.name = 'RequesterError';
          error.code = 'STRINGIFY_BODY_ERROR';
          return reject(error);
        }
      } else {
        body = data;
      }
    } else {
      body = defaults.body;
    }

    // let http(s).request manage bad options
    // clean up request opts from wrapper options
    delete opts.data;
    delete opts.url;
    delete opts.format;
    delete opts.encoding;

    debug('module options: ', { format, encoding });
    debug('request options: ', { ...opts, body });

    // request
    const req = protocol.request(opts, (res) => {
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
              debug('response data: ', finalBuffer.toString(encoding));

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
