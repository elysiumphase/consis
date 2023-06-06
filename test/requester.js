const fs = require('fs');
const path = require('path');
const url = require('url');
const { Readable } = require('stream');
const expect = require('chai').expect;
const requester = require('../src/requester');

const urlJson = 'https://api.coinpaprika.com/v1/global';
const urlImage = 'https://bitcoin.org/img/home/bitcoin-img.svg';
const urlHttps = 'https://nodejs.org/api/stream.html';
const urlHttp = 'https://photos.tf1info.fr/images/1280/360/affiche-course-vendee-globe-a9e1f6-0@1x.gif';
const urlBigImage = 'https://upload.wikimedia.org/wikipedia/commons/2/23/Hong_Kong_Skyline_Restitch_-_Dec_2007.jpg';

describe('#requester', function() {

  context('when there is no options', function() {
    it('should throw a RequesterError error', async function() {
      let response;
      let error;

      try {
        response = await requester();
      } catch (e) {
        error = e;
      };

      expect(response).to.not.exist;
      expect(error).to.exist.and.to.be.an('error');
      expect(error.name).to.equal('RequesterError');
      expect(error.code).to.equal('MISSING_OPTIONS');
    });
  });

  context('when the url has an invalid protocol', function() {
    it('should throw a RequesterError error', async function() {
      let response;
      let error;

      try {
        response = await requester({ url: 'amqp://localhost' });
      } catch (e) {
        error = e;
      };

      expect(response).to.not.exist;
      expect(error).to.exist.and.to.be.an('error');
      expect(error.name).to.equal('RequesterError');
      expect(error.code).to.equal('BAD_URL_PROTOCOL');
    });
  });

  context('when the url cannot be parsed', function() {
    it('should throw a RequesterError error', async function() {
      let response;
      let error;

      try {
        response = await requester({ url: null });
      } catch (e) {
        error = e;
      };

      expect(response).to.not.exist;
      expect(error).to.exist.and.to.be.an('error');
      expect(error.name).to.equal('RequesterError');
      expect(error.code).to.equal('BAD_URL');
    });
  });

  context('when the format option exists but is invalid', function() {
    it('should not throw a RequesterError error', async function() {
      let response;
      let error;

      try {
        response = await requester({ url: urlJson, format: 'unknown' });
      } catch (e) {
        error = e;
      };

      expect(response).to.exist;
      expect(error).to.not.exist;
    });
  });

  context('when the encoding option exists but is invalid', function() {
    it('should not throw a RequesterError error', async function() {
      let response;
      let error;

      try {
        response = await requester({ url: urlJson, encoding: 'unknown' });
      } catch (e) {
        error = e;
      };

      expect(response).to.exist;
      expect(error).to.not.exist;
    });
  });

  context('when the response is not of an expected format', function() {
    it('should throw a RequesterError error', async function() {
      let response;
      let error;

      try {
        response = await requester({
          url: urlHttps, // html page but expected json
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          format: 'json',
          encoding: 'utf8',
        });
      } catch (e) {
        error = e;
      };

      expect(response).to.not.exist;
      expect(error).to.exist.and.to.be.an('error');
      expect(error.name).to.equal('RequesterError');
      expect(error.code).to.equal('RESPONSE_FORMAT_ERROR');
    });
  });

  // only works since Node >= 10.7.0
  context('when the request times out', function() {
    it('should throw a RequesterError error', async function() {
      let response;
      let error;

      try {
        response = await requester({
          url: urlBigImage,
          method: 'GET',
          headers: {
            Accept: 'image/*',
            'Content-Type': 'image/*',
          },
          format: 'buffer',
          encoding: 'utf8',
          timeout: 1,
        });
      } catch (e) {
        error = e;
      };

      expect(response).to.not.exist;
      expect(error).to.exist.and.to.be.an('error');
      expect(error.name).to.equal('RequesterError');
      expect(error.code).to.equal('REQUEST_TIMEOUT');
    });
  });

  context('when options are valid', function() {
    context('when requesting json data', function() {
      it('should resolve a status code, headers and body', async function() {
        let response;
        let error;

        try {
          response = await requester({
            url: urlJson,
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
            format: 'json',
            encoding: 'utf8',
          });
        } catch (e) {
          error = e;
        };

        expect(error).to.not.exist;
        expect(response).to.exist.and.to.be.an('object');
        expect(response.statusCode).to.exist.and.to.equal(200);
        expect(response.headers).to.exist.and.to.be.an('object');
        expect(response.body).to.exist.and.to.be.an('object');
      });
    });

    context('when requesting an image stream', function() {
      it('should resolve a status code, headers and body', async function() {
        let response;
        let error;

        try {
          response = await requester({
            url: urlImage,
            method: 'GET',
            headers: {
              Accept: 'image/*',
              'Content-Type': 'image/*',
            },
            format: 'stream',
            encoding: 'binary',
          });
        } catch (e) {
          error = e;
        };

        expect(error).to.not.exist;
        expect(response).to.exist.and.to.be.an('object');
        expect(response.statusCode).to.exist.and.to.equal(200);
        expect(response.headers).to.exist.and.to.be.an('object');
        expect(response.body instanceof Readable).to.be.true;
      });
    });

    context('when requesting data in string format', function() {
      it('should resolve a status code, headers and body', async function() {
        let response;
        let error;

        try {
          response = await requester({
            url: urlHttp,
            method: 'GET',
            headers: {
              Accept: 'image/*',
              'Content-Type': 'image/*',
            },
            format: 'string',
            encoding: 'binary',
          });
        } catch (e) {
          error = e;
        };

        expect(error).to.not.exist;
        expect(response).to.exist.and.to.be.an('object');
        expect(response.statusCode).to.exist.and.to.equal(200);
        expect(response.headers).to.exist.and.to.be.an('object');
        expect(response.body).to.be.a('string');
      });
    });

    context('when requesting data in buffer format', function() {
      it('should resolve a status code, headers and body', async function() {
        let response;
        let error;

        try {
          response = await requester({
            url: urlHttp,
            method: 'GET',
            headers: {
              Accept: 'image/*',
              'Content-Type': 'image/*',
            },
            format: 'buffer',
            encoding: 'binary',
          });
        } catch (e) {
          error = e;
        };

        expect(error).to.not.exist;
        expect(response).to.exist.and.to.be.an('object');
        expect(response.statusCode).to.exist.and.to.equal(200);
        expect(response.headers).to.exist.and.to.be.an('object');
        expect(response.body.constructor === Buffer).to.be.true;
      }).timeout(5000);
    });

    context('when requesting url with header application/x-www-form-urlencoded and data filled or not', function() {
      it('should resolve a status code, headers and body', async function() {
        const req1 = {
          url: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=true&price_change_percentage=24h%2C7d',
          format: 'json',
          headers: {
            'User-Agent': 'PostmanRuntime/7.29.2',
          },
        };

        // vs_currency is mandatory and added to the query
        // all other data in query should be added to the url so res should be
        // the same for req1 and req2
        const req2 = {
          url: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd',
          method: 'GET',
          encoding: 'utf8',
          format: 'json',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
            'User-Agent': 'PostmanRuntime/7.29.2',
          },
          data: {
            page: 1,
            order: 'market_cap_desc',
            per_page: 5,
            sparkline: true,
            price_change_percentage: '24h,7d',
          },
        };
        let res1;
        let res2;
        let error;

        try {
          ([res1, res2] = await Promise.all([requester(req1), requester(req2)]));
        } catch (e) {
          error = e;
        };

        expect(error).to.not.exist;

        expect(res1).to.exist.and.to.be.an('object');
        expect(res1.statusCode).to.exist.and.to.equal(200);
        expect(res1.headers).to.exist.and.to.be.an('object');
        expect(res1.body).to.exist.and.to.be.an('array');

        expect(res2).to.exist.and.to.be.an('object');
        expect(res2.statusCode).to.exist.and.to.equal(200);
        expect(res2.headers).to.exist.and.to.be.an('object');
        expect(res2.body).to.exist.and.to.be.an('array');

        expect(res1.body.id).to.equal(res2.body.id);
      });
    });
  });
});
