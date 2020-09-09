const { expect } = require('./Common');
const {
  uri: {
    punycode,
    punydecode,
    parseURI,
    isDomainChar,
    isSitemapChar,
    isURIChar,
    isSchemeChar,
    isPercentEncodingChar,
    isUserinfoChar,
    isDomainLabel,
    isDomain,
    isIP,
    isIPv4,
    isIPv6,
    checkPercentEncoding,
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

// console.log(checkURI('http://das-küchengeflüster.de./feed'));

describe('#uri', function() {
  context('when using punycode', function() {
    it('should return an empty string if no domain is provided', function() {
      expect(punycode()).to.be.a('string').and.to.equals('');
      expect(punycode(null)).to.be.a('string').and.to.equals('');
      expect(punycode(undefined)).to.be.a('string').and.to.equals('');
      expect(punycode(NaN)).to.be.a('string').and.to.equals('');
      expect(punycode('')).to.be.a('string').and.to.equals('');
    });

    it('should return an empty string if domain is not a string', function() {
      expect(punycode({})).to.be.a('string').and.to.equals('');
      expect(punycode([])).to.be.a('string').and.to.equals('');
      expect(punycode(new Error('error'))).to.be.a('string').and.to.equals('');
      expect(punycode(255)).to.be.a('string').and.to.equals('');
      expect(punycode(true)).to.be.a('string').and.to.equals('');
    });

    it('should return an empty string if domain is not valid', function() {
      expect(punycode('xn--iñvalid.com')).to.be.a('string').and.to.equals('');
      expect(punycode('http://www.host.com')).to.be.a('string').and.to.equals('');
      expect(punycode('http://www')).to.be.a('string').and.to.equals('');
      expect(punycode(':-')).to.be.a('string').and.to.equals('');
      expect(punycode('::')).to.be.a('string').and.to.equals('');
    });

    it('should return a punycode ASCII serialization of the domain if domain is a valid IDN', function() {
      expect(punycode('español.com')).to.be.a('string').and.to.equals('xn--espaol-zwa.com');
      expect(punycode('中文.com')).to.be.a('string').and.to.equals('xn--fiq228c.com');
    });

    it('should return a punycode ASCII serialization of the domain if domain is a valid ASCII FQDN', function() {
      expect(punycode('google.com.')).to.be.a('string').and.to.equals('google.com.');
      expect(punycode('a.b.c.d.e.fg')).to.be.a('string').and.to.equals('a.b.c.d.e.fg');
    });
  });

  context('when using punydecode', function() {
    it('should return an empty string if no domain is provided', function() {
      expect(punydecode()).to.be.a('string').and.to.equals('');
      expect(punydecode(null)).to.be.a('string').and.to.equals('');
      expect(punydecode(undefined)).to.be.a('string').and.to.equals('');
      expect(punydecode(NaN)).to.be.a('string').and.to.equals('');
      expect(punydecode('')).to.be.a('string').and.to.equals('');
    });

    it('should return an empty string if domain is not a string', function() {
      expect(punydecode({})).to.be.a('string').and.to.equals('');
      expect(punydecode([])).to.be.a('string').and.to.equals('');
      expect(punydecode(new Error('error'))).to.be.a('string').and.to.equals('');
      expect(punydecode(255)).to.be.a('string').and.to.equals('');
      expect(punydecode(true)).to.be.a('string').and.to.equals('');
    });

    it('should return an empty string if domain is not valid', function() {
      expect(punydecode('xn--iñvalid.com')).to.be.a('string').and.to.equals('');
      expect(punydecode('http://www.host.com')).to.be.a('string').and.to.equals('');
      expect(punydecode('http://www')).to.be.a('string').and.to.equals('');
      expect(punydecode(':-')).to.be.a('string').and.to.equals('');
      expect(punydecode('::')).to.be.a('string').and.to.equals('');
    });

    it('should return a Unicode serialization of the domain if domain is a valid IDN serialized', function() {
      expect(punydecode('xn--espaol-zwa.com')).to.be.a('string').and.to.equals('español.com');
      expect(punydecode('xn--fiq228c.com')).to.be.a('string').and.to.equals('中文.com');
    });

    it('should return a Unicode serialization of the domain if domain is a valid ASCII FQDN', function() {
      expect(punydecode('google.com.')).to.be.a('string').and.to.equals('google.com.');
      expect(punydecode('a.b.c.d.e.fg')).to.be.a('string').and.to.equals('a.b.c.d.e.fg');
    });
  });

  context('when using parseURI', function() {
    const parsed = {
      scheme: null,
      authority: null,
      authorityPunydecoded: null,
      userinfo: null,
      host: null,
      hostPunydecoded: null,
      port: null,
      path: null,
      query: null,
      fragment: null,
    };

    it('should return an object with null attributes if no uri is provided', function() {
      expect(parseURI()).to.be.an('object').and.to.eql(parsed);
      expect(parseURI(null)).to.be.an('object').and.to.eql(parsed);
      expect(parseURI(undefined)).to.be.an('object').and.to.eql(parsed);
      expect(parseURI(NaN)).to.be.an('object').and.to.eql(parsed);
      expect(parseURI('')).to.be.an('object').and.to.eql(parsed);
    });

    it('should return an object with null attributes if uri is not a string', function() {
      expect(parseURI({})).to.be.an('object').and.to.eql(parsed);
      expect(parseURI([])).to.be.an('object').and.to.eql(parsed);
      expect(parseURI(new Error('error'))).to.be.an('object').and.to.eql(parsed);
      expect(parseURI(255)).to.be.an('object').and.to.eql(parsed);
      expect(parseURI(true)).to.be.an('object').and.to.eql(parsed);
    });

    it('should return an object with all attributes at null except path if uri has no scheme', function() {
      let parsedURI = parseURI('http');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', 'http');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', null);

      parsedURI = parseURI('httpwwwgoogle5com');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', 'httpwwwgoogle5com');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', null);

      parsedURI = parseURI('google.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', 'google.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', null);

      parsedURI = parseURI('google.com/index.html');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', 'google.com/index.html');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', null);

      parsedURI = parseURI('/google.com/index.html');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', '/google.com/index.html');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', null);
    });

    it('should return an object with missing attributes at null if uri is not valid', function() {
      let parsedURI = parseURI('http:///path');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', 'http');
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', '/path');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', null);

      parsedURI = parseURI('http::path');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', 'http');
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', ':path');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', null);

      parsedURI = parseURI('http:\\path');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', 'http');
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', '\\path');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', null);

      parsedURI = parseURI('http://');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', 'http');
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', '');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', null);
    });

    it('should return an object with appropriate attributes if uri is valid', function() {
      let parsedURI = parseURI('foo://example.com:8042/over/there?name=ferret#nose');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', 'foo');
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', 'example.com:8042');
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', 'example.com:8042');
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', 'example.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', 'example.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('port', 8042);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', '/over/there');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', 'name=ferret');
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', 'nose');

      parsedURI = parseURI('foo://user:pass@example.com:8042/over/there?name=ferret#nose');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', 'foo');
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', 'user:pass@example.com:8042');
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', 'user:pass@example.com:8042');
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', 'user:pass');
      expect(parsedURI).to.be.an('object').and.to.have.property('host', 'example.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', 'example.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('port', 8042);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', '/over/there');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', 'name=ferret');
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', 'nose');

      parsedURI = parseURI('foo://example.com/over/there?name=ferret#nose');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', 'foo');
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', 'example.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', 'example.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', 'example.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', 'example.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', '/over/there');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', 'name=ferret');
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', 'nose');
    });

    it('should return an object with the original port value if port is not an integer', function() {
      let parsedURI = parseURI('foo://example.com:80g42/over/there?name=ferret#nose');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', 'foo');
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', 'example.com:80g42');
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', 'example.com:80g42');
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', 'example.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', 'example.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('port', '80g42');
      expect(parsedURI).to.be.an('object').and.to.have.property('path', '/over/there');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', 'name=ferret');
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', 'nose');
    });

    it('should return an object and the authority and host attributes with the Punycode ASCII serialization value + authorityPunydecoded and hostPunydecoded with the original Unicode serialization value', function() {
      let parsedURI = parseURI('foo://中文.com:8042/over/there?name=ferret#nose');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', 'foo');
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', 'xn--fiq228c.com:8042');
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', '中文.com:8042');
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', 'xn--fiq228c.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', '中文.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('port', 8042);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', '/over/there');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', 'name=ferret');
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', 'nose');
    });
  });

  context('when using isSitemapChar', function() {
    it('should return true if a char is valid', function() {
      for (let i = 0; i < sitemapAllowedChars.length; i += 1) {
        expect(isSitemapChar(sitemapAllowedChars[i])).to.be.a('boolean').and.to.be.true;
      }
    });

    it('should return false if a char does not exist', function() {
      expect(isSitemapChar()).to.be.a('boolean').and.to.be.false;
      expect(isSitemapChar(undefined)).to.be.a('boolean').and.to.be.false;
      expect(isSitemapChar(null)).to.be.a('boolean').and.to.be.false;
      expect(isSitemapChar(NaN)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is empty', function() {
      expect(isSitemapChar('')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not a string', function() {
      expect(isSitemapChar([])).to.be.a('boolean').and.to.be.false;
      expect(isSitemapChar({})).to.be.a('boolean').and.to.be.false;
      expect(isSitemapChar(new Error('error'))).to.be.a('boolean').and.to.be.false;
      expect(isSitemapChar(5)).to.be.a('boolean').and.to.be.false;
      expect(isSitemapChar(true)).to.be.a('boolean').and.to.be.false;
      expect(isSitemapChar(false)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not allowed', function() {
      for (let i = 0; i < disallowedSitemapChars.length; i += 1) {
        expect(isSitemapChar(disallowedSitemapChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < GZChars.length; i += 1) {
        expect(isSitemapChar(GZChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < otherDisallowedChars.length; i += 1) {
        expect(isSitemapChar(otherDisallowedChars[i])).to.be.a('boolean').and.to.be.false;
      }
    });
  });

  context('when using isURIChar', function() {
    it('should return true if a char is valid', function() {
      for (let i = 0; i < uriAllowedChars.length; i += 1) {
        expect(isURIChar(uriAllowedChars[i])).to.be.a('boolean').and.to.be.true;
      }
    });

    it('should return false if a char does not exist', function() {
      expect(isURIChar()).to.be.a('boolean').and.to.be.false;
      expect(isURIChar(undefined)).to.be.a('boolean').and.to.be.false;
      expect(isURIChar(null)).to.be.a('boolean').and.to.be.false;
      expect(isURIChar(NaN)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is empty', function() {
      expect(isURIChar('')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not a string', function() {
      expect(isURIChar([])).to.be.a('boolean').and.to.be.false;
      expect(isURIChar({})).to.be.a('boolean').and.to.be.false;
      expect(isURIChar(new Error('error'))).to.be.a('boolean').and.to.be.false;
      expect(isURIChar(5)).to.be.a('boolean').and.to.be.false;
      expect(isURIChar(true)).to.be.a('boolean').and.to.be.false;
      expect(isURIChar(false)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not allowed', function() {
      for (let i = 0; i < disallowedURIChars.length; i += 1) {
        expect(isURIChar(disallowedURIChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < GZChars.length; i += 1) {
        expect(isURIChar(GZChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < otherDisallowedChars.length; i += 1) {
        expect(isURIChar(otherDisallowedChars[i])).to.be.a('boolean').and.to.be.false;
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

  // context('when using checkURISyntax', function() {
  //   it('should throw an uri error when uri is not a string', function() {
  //     expect(() => checkURISyntax()).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
  //     expect(() => checkURISyntax(undefined)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
  //     expect(() => checkURISyntax(null)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
  //     expect(() => checkURISyntax(NaN)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
  //     expect(() => checkURISyntax([])).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
  //     expect(() => checkURISyntax(new Error('error'))).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
  //     expect(() => checkURISyntax(5)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
  //     expect(() => checkURISyntax(true)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
  //     expect(() => checkURISyntax(false)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
  //     expect(() => checkURISyntax({})).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
  //   });
  //
  //   it('should throw an uri error when uri has no scheme', function() {
  //     expect(() => checkURISyntax('/Users/dir/file.js')).to.throw(URIError).with.property('code', 'URI_MISSING_SCHEME');
  //     // url.parse could never return an empty scheme so URI_EMPTY_SCHEME error cannot be thrown
  //   });
  //
  //   it('should throw an uri error when uri has no path', function() {
  //     expect(() => checkURISyntax('http:')).to.throw(URIError).with.property('code', 'URI_MISSING_PATH');
  //   });
  //
  //   it('should throw an uri error when uri has no path', function() {
  //     expect(() => checkURISyntax('http:')).to.throw(URIError).with.property('code', 'URI_MISSING_PATH');
  //   });
  // });
});
