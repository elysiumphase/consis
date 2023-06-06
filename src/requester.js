/* eslint-disable no-promise-executor-return */
/**
 * Requester helper.
 *
 * - https://nodejs.org/api/http.html#http_http_request_url_options_callback
 */
const http = require('http');
const https = require('https');
const querystring = require('querystring');
const { debuglog } = require('util');
const encodings = require('./encodings');
const { str } = require('./cast');
const {
  clone,
  is,
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

  // request options
  request: {
    body: '{}',
    headers: {},
    method: 'GET',
  },
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

    debug('Options passed: ', options);

    // request options
    const requestOptions = clone(options);
    let protocol;
    let requestBody = defaults.request.body;
    let search = '';
    let searchData;
    let hash = '';

    // format (module opts)
    const format = formats.includes(options.format) ? options.format : defaults.format;

    // encoding (module opts)
    const encoding = hasOwn(encodings, options.encoding) ? options.encoding : defaults.encoding;

    // data (module opts)
    const data = is(Object, options.data)
      || is(String, options.data)
      || is(Buffer, options.data) ? options.data : defaults.data;

    // parse url
    try {
      const {
        protocol: protocolUrl,
        username,
        password,
        hostname,
        port,
        pathname,
        search: searchUrl,
        hash: hashUrl,
      } = new URL(options.url);
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

      // protocol as in request options
      requestOptions.protocol = protocolUrl;

      // auth
      if (exists(username) && exists(password) && username !== '' && password !== '') {
        requestOptions.auth = `${username}:${password}`;
      } else if (is(String, options.auth)) {
        requestOptions.auth = options.auth;
      }

      // hostname, port and path
      requestOptions.hostname = hostname;
      requestOptions.port = port;
      requestOptions.path = pathname;

      // search and hash
      search = searchUrl;
      hash = hashUrl;
    } catch (e) {
      const error = new Error(`bad url, ${e.message}`);
      error.name = 'RequesterError';
      error.code = 'BAD_URL';
      return reject(error);
    }

    // method
    requestOptions.method = is(String, options.method)
      ? options.method
      : defaults.request.method;

    // headers
    requestOptions.headers = is(Object, options.headers)
      ? { ...options.headers }
      : defaults.request.headers;

    // manage query data and body
    if (exists(data)) {
      // if Content-Type is application/x-www-form-urlencoded
      if (options.headers
        && (options.headers['Content-Type'] === 'application/x-www-form-urlencoded'
          || options.headers['content-type'] === 'application/x-www-form-urlencoded')) {
        // if method is GET recompose request path by adding both search and data search at the end
        searchData = querystring.stringify(data);
        requestBody = defaults.request.body;
      } else if (options.headers
          && (/application\/(vnd.api\+){0,1}json/.test(options.headers['Content-Type'])
            || /application\/(vnd.api\+){0,1}json/.test(options.headers['content-type']))) {
        try {
          requestBody = JSON.stringify(data);
        } catch (e) {
          const error = new Error(`unable to stringify data, ${e.message}`);
          error.name = 'RequesterError';
          error.code = 'STRINGIFY_BODY_ERROR';
          return reject(error);
        }
      } else {
        requestBody = is(String, data) ? data : str(data) || defaults.request.body;
      }
    }

    // search
    if (is(String, search) && search !== '') {
      if (is(String, searchData) && searchData !== '') {
        search += `&${searchData}`;
      }
    } else if (is(String, searchData) && searchData !== '') {
      search = `?${searchData}`;
    }

    requestOptions.path += search;

    // hash
    requestOptions.path += hash;

    // clean request options from user options
    delete requestOptions.url;
    delete requestOptions.data;
    delete requestOptions.format;
    delete requestOptions.encoding;

    debug('Module options: ', { data, format, encoding });
    debug('Request options: ', { ...requestOptions, body: requestBody });

    // request
    const req = protocol.request(requestOptions, (res) => {
      const { statusCode, headers = {} } = res;

      if (format === 'stream') {
        debug('Response: ', { statusCode, headers, body: res });
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
              debug('Response data: ', finalBuffer.toString(encoding));

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

            debug('Response: ', { statusCode, headers, body: resBody });
            resolve({ statusCode, headers, body: resBody });
          } catch (e) {
            debug('response: ', { statusCode, headers, body: finalBuffer.toString(encoding) });
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
      req.destroy();
      const error = new Error('request timed out');
      error.name = 'RequesterError';
      error.code = 'REQUEST_TIMEOUT';
      return reject(error);
    });

    // write data to request
    req.write(requestBody);

    req.end();
  });
};

module.exports = requester;
