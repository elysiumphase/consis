const { expect } = require('./Common');
const {
  uri: {
    isValidSitemapChar,
    isValidURIChar,
    isSchemeChar,
    isPercentEncodingChar,
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
  },
} = require('../lib');

const azChars = 'abcdefghijklmnopqrstuvwxyz';
const AZChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const GZChars = 'GHIJKLMNOPQRSTUVWXYZ';
const hexdigChars = 'ABCDEF';
const digits = '0123456789';
const allowed = '!"#$%&\'()*+,-./:;=?@[]_~';
const uriAllowedChars = `${azChars}${hexdigChars}${digits}${allowed}`;
const sitemapAllowedChars = `${uriAllowedChars}<>`;
const schemeAllowedChars = `${azChars}${digits}+-.`;
const percentEncodingAllowedChars = `${digits}${hexdigChars}`;
const disallowedSitemapChars = '\\^`{|}';
const disallowedURIChars = `${disallowedSitemapChars}<>`;
const otherDisallowedChars = '€°éùèàç';

describe('#uri', function() {
  context('when using isValidSitemapChar', function() {
    it('should return true if a char is valid', function() {
      for (let i = 0; i < sitemapAllowedChars.length; i += 1) {
        expect(isValidSitemapChar(sitemapAllowedChars[i])).to.be.a('boolean').and.to.be.true;
      }
    });

    it('should return false if a char does not exist', function() {
      expect(isValidSitemapChar()).to.be.a('boolean').and.to.be.false;
      expect(isValidSitemapChar(undefined)).to.be.a('boolean').and.to.be.false;
      expect(isValidSitemapChar(null)).to.be.a('boolean').and.to.be.false;
      expect(isValidSitemapChar(NaN)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is empty', function() {
      expect(isValidSitemapChar('')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not a string', function() {
      expect(isValidSitemapChar([])).to.be.a('boolean').and.to.be.false;
      expect(isValidSitemapChar({})).to.be.a('boolean').and.to.be.false;
      expect(isValidSitemapChar(new Error('error'))).to.be.a('boolean').and.to.be.false;
      expect(isValidSitemapChar(5)).to.be.a('boolean').and.to.be.false;
      expect(isValidSitemapChar(true)).to.be.a('boolean').and.to.be.false;
      expect(isValidSitemapChar(false)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not allowed', function() {
      for (let i = 0; i < disallowedSitemapChars.length; i += 1) {
        expect(isValidSitemapChar(disallowedSitemapChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < GZChars.length; i += 1) {
        expect(isValidSitemapChar(GZChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < otherDisallowedChars.length; i += 1) {
        expect(isValidSitemapChar(otherDisallowedChars[i])).to.be.a('boolean').and.to.be.false;
      }
    });
  });

  context('when using isValidURIChar', function() {
    it('should return true if a char is valid', function() {
      for (let i = 0; i < uriAllowedChars.length; i += 1) {
        expect(isValidURIChar(uriAllowedChars[i])).to.be.a('boolean').and.to.be.true;
      }
    });

    it('should return false if a char does not exist', function() {
      expect(isValidURIChar()).to.be.a('boolean').and.to.be.false;
      expect(isValidURIChar(undefined)).to.be.a('boolean').and.to.be.false;
      expect(isValidURIChar(null)).to.be.a('boolean').and.to.be.false;
      expect(isValidURIChar(NaN)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is empty', function() {
      expect(isValidURIChar('')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not a string', function() {
      expect(isValidURIChar([])).to.be.a('boolean').and.to.be.false;
      expect(isValidURIChar({})).to.be.a('boolean').and.to.be.false;
      expect(isValidURIChar(new Error('error'))).to.be.a('boolean').and.to.be.false;
      expect(isValidURIChar(5)).to.be.a('boolean').and.to.be.false;
      expect(isValidURIChar(true)).to.be.a('boolean').and.to.be.false;
      expect(isValidURIChar(false)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not allowed', function() {
      for (let i = 0; i < disallowedURIChars.length; i += 1) {
        expect(isValidURIChar(disallowedURIChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < GZChars.length; i += 1) {
        expect(isValidURIChar(GZChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < otherDisallowedChars.length; i += 1) {
        expect(isValidURIChar(otherDisallowedChars[i])).to.be.a('boolean').and.to.be.false;
      }
    });
  });

  context('when using isSchemeChar', function() {
    it('should return true if a char is valid', function() {
      for (let i = 0; i < schemeAllowedChars.length; i += 1) {
        expect(isSchemeChar(schemeAllowedChars[i])).to.be.a('boolean').and.to.be.true;
      }
    });

    it('should return false if a char does not exist', function() {
      expect(isSchemeChar()).to.be.a('boolean').and.to.be.false;
      expect(isSchemeChar(undefined)).to.be.a('boolean').and.to.be.false;
      expect(isSchemeChar(null)).to.be.a('boolean').and.to.be.false;
      expect(isSchemeChar(NaN)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is empty', function() {
      expect(isSchemeChar('')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not a string', function() {
      expect(isSchemeChar([])).to.be.a('boolean').and.to.be.false;
      expect(isSchemeChar({})).to.be.a('boolean').and.to.be.false;
      expect(isSchemeChar(new Error('error'))).to.be.a('boolean').and.to.be.false;
      expect(isSchemeChar(5)).to.be.a('boolean').and.to.be.false;
      expect(isSchemeChar(true)).to.be.a('boolean').and.to.be.false;
      expect(isSchemeChar(false)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not allowed', function() {
      for (let i = 0; i < disallowedURIChars.length; i += 1) {
        expect(isSchemeChar(disallowedURIChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < AZChars.length; i += 1) {
        expect(isSchemeChar(AZChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < otherDisallowedChars.length; i += 1) {
        expect(isSchemeChar(otherDisallowedChars[i])).to.be.a('boolean').and.to.be.false;
      }
    });
  });

  context('when using isPercentEncodingChar', function() {
    it('should return true if a char is valid', function() {
      for (let i = 0; i < percentEncodingAllowedChars.length; i += 1) {
        expect(isPercentEncodingChar(percentEncodingAllowedChars[i])).to.be.a('boolean').and.to.be.true;
      }
    });

    it('should return false if a char does not exist', function() {
      expect(isPercentEncodingChar()).to.be.a('boolean').and.to.be.false;
      expect(isPercentEncodingChar(undefined)).to.be.a('boolean').and.to.be.false;
      expect(isPercentEncodingChar(null)).to.be.a('boolean').and.to.be.false;
      expect(isPercentEncodingChar(NaN)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is empty', function() {
      expect(isPercentEncodingChar('')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not a string', function() {
      expect(isPercentEncodingChar([])).to.be.a('boolean').and.to.be.false;
      expect(isPercentEncodingChar({})).to.be.a('boolean').and.to.be.false;
      expect(isPercentEncodingChar(new Error('error'))).to.be.a('boolean').and.to.be.false;
      expect(isPercentEncodingChar(5)).to.be.a('boolean').and.to.be.false;
      expect(isPercentEncodingChar(true)).to.be.a('boolean').and.to.be.false;
      expect(isPercentEncodingChar(false)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not allowed', function() {
      for (let i = 0; i < azChars.length; i += 1) {
        expect(isPercentEncodingChar(azChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < GZChars.length; i += 1) {
        expect(isPercentEncodingChar(GZChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < allowed.length; i += 1) {
        expect(isPercentEncodingChar(allowed[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < disallowedURIChars.length; i += 1) {
        expect(isPercentEncodingChar(disallowedURIChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < otherDisallowedChars.length; i += 1) {
        expect(isPercentEncodingChar(otherDisallowedChars[i])).to.be.a('boolean').and.to.be.false;
      }
    });
  });

  context('when using checkURISyntax', function() {
    it('should throw an uri error when uri is not a string', function() {
      expect(() => checkURISyntax()).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkURISyntax(undefined)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkURISyntax(null)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkURISyntax(NaN)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkURISyntax([])).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkURISyntax(new Error('error'))).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkURISyntax(5)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkURISyntax(true)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkURISyntax(false)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkURISyntax({})).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
    });

    it('should throw an uri error when uri has no scheme', function() {
      expect(() => checkURISyntax('/Users/dir/file.js')).to.throw(URIError).with.property('code', 'URI_MISSING_SCHEME');
      // url.parse could never return an empty scheme so URI_EMPTY_SCHEME error cannot be thrown
    });

    it('should throw an uri error when uri has no path', function() {
      expect(() => checkURISyntax('http:')).to.throw(URIError).with.property('code', 'URI_MISSING_PATH');
    });

    it('should throw an uri error when uri has no path', function() {
      expect(() => checkURISyntax('http:')).to.throw(URIError).with.property('code', 'URI_MISSING_PATH');
    });
  });
});
