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

const az = 'abcdefghijklmnopqrstuvwxyz';
const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const GZ = 'GHIJKLMNOPQRSTUVWXYZ';
const hexdig = 'ABCDEF';
const digits = '0123456789';

// allowed
const allowed = '!"#$%&\'()*+,-./:;=?@[]_~';
const allowedURIChars = `${az}${digits}${allowed}`;
const allowedSitemapChars = `${allowedURIChars}<>`;
const domainAllowedChars = `${az}${digits}-`;
const allowedSchemeChars = `${az}${digits}+-.`;
const allowedPercentEncodingChars = `${digits}${hexdig}`;
const allowedUserinfoChars = `${az}${digits}!"$%&'()*+,-.:;=_~`;

// disallowed
const disallowed = '\\^`{|}';
const disallowedSitemapChars = `${AZ}${disallowed}`;
const disallowedURIChars = `${AZ}${disallowed}<>`;
const disallowedDomainChars = `${AZ}${allowed.replace('-', '')}`;
const disallowedSchemeChars = `${disallowedURIChars}${allowed.replace(/[-+.]/g, '')}`;
const disallowedPercentEncodingChars = `${az}${GZ}${allowed}${disallowed}<>`;
const disallowedUserinfoChars = '#/?@[]';
const disallowedOtherChars = '€°éùèàç §£';

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
      expect(punycode('中文.español.com')).to.be.a('string').and.to.equals('xn--fiq228c.xn--espaol-zwa.com');
    });

    it('should return a punycode ASCII serialization of the domain if domain is a valid ASCII FQDN', function() {
      expect(punycode('example.com.')).to.be.a('string').and.to.equals('example.com.');
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
      expect(punydecode('xn--fiq228c.xn--espaol-zwa.com')).to.be.a('string').and.to.equals('中文.español.com');
    });

    it('should return a Unicode serialization of the domain if domain is a valid ASCII FQDN', function() {
      expect(punydecode('example.com.')).to.be.a('string').and.to.equals('example.com.');
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

      parsedURI = parseURI('httpwwwexample5com');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', 'httpwwwexample5com');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', null);

      parsedURI = parseURI('example.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', 'example.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', null);

      parsedURI = parseURI('example.com/index.html');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', 'example.com/index.html');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', null);

      parsedURI = parseURI('/example.com/index.html');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', '/example.com/index.html');
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

    it('should return an object with authority and its components at null if uri has an invalid host', function() {
      let parsedURI = parseURI('http://user:pass@xn--iñvalid.com:8080');
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

      parsedURI = parseURI('http://user:pass@xn--iñvalid.com');
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

      parsedURI = parseURI('http://xn--iñvalid.com');
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

      parsedURI = parseURI('http://user:pass@example.fr\\');
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

      parsedURI = parseURI('http://user:pass@xn--iñvalid.com:8080/path?query=test#fragment');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', 'http');
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', '/path');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', 'query=test');
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', 'fragment');
    });
  });

  context('when using isDomainChar', function() {
    it('should return true if a char is valid', function() {
      for (let i = 0; i < domainAllowedChars.length; i += 1) {
        expect(isDomainChar(domainAllowedChars[i])).to.be.a('boolean').and.to.be.true;
      }
    });

    it('should return false if a char does not exist', function() {
      expect(isDomainChar()).to.be.a('boolean').and.to.be.false;
      expect(isDomainChar(undefined)).to.be.a('boolean').and.to.be.false;
      expect(isDomainChar(null)).to.be.a('boolean').and.to.be.false;
      expect(isDomainChar(NaN)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is empty', function() {
      expect(isDomainChar('')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not a string', function() {
      expect(isDomainChar([])).to.be.a('boolean').and.to.be.false;
      expect(isDomainChar({})).to.be.a('boolean').and.to.be.false;
      expect(isDomainChar(new Error('error'))).to.be.a('boolean').and.to.be.false;
      expect(isDomainChar(5)).to.be.a('boolean').and.to.be.false;
      expect(isDomainChar(true)).to.be.a('boolean').and.to.be.false;
      expect(isDomainChar(false)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not allowed', function() {
      for (let i = 0; i < disallowedSitemapChars.length; i += 1) {
        expect(isDomainChar(disallowedSitemapChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < disallowedURIChars.length; i += 1) {
        expect(isDomainChar(disallowedURIChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isDomainChar(disallowedOtherChars[i])).to.be.a('boolean').and.to.be.false;
      }
    });

    it('should not start or end with a hyphen', function() {
      for (let i = 0; i < az.length; i += 1) {
        expect(isDomainChar(az[i])).to.be.a('boolean').and.to.be.true;
        expect(isDomainChar(az[i], { start: true, end: true })).to.be.a('boolean').and.to.be.true;
        expect(isDomainChar(az[i], { start: false, end: true })).to.be.a('boolean').and.to.be.true;
        expect(isDomainChar(az[i], { start: true, end: false })).to.be.a('boolean').and.to.be.true;
        expect(isDomainChar(az[i], { start: false, end: false })).to.be.a('boolean').and.to.be.true;
      }
      for (let i = 0; i < digits.length; i += 1) {
        expect(isDomainChar(digits[i])).to.be.a('boolean').and.to.be.true;
        expect(isDomainChar(digits[i], { start: true, end: true })).to.be.a('boolean').and.to.be.true;
        expect(isDomainChar(digits[i], { start: false, end: true })).to.be.a('boolean').and.to.be.true;
        expect(isDomainChar(digits[i], { start: true, end: false })).to.be.a('boolean').and.to.be.true;
        expect(isDomainChar(digits[i], { start: false, end: false })).to.be.a('boolean').and.to.be.true;
      }
      expect(isDomainChar('-', { start: true, end: true })).to.be.a('boolean').and.to.be.false;
      expect(isDomainChar('-', { start: false, end: true })).to.be.a('boolean').and.to.be.false;
      expect(isDomainChar('-', { start: true, end: false })).to.be.a('boolean').and.to.be.false;
      expect(isDomainChar('-', { start: false, end: false })).to.be.a('boolean').and.to.be.true;
    });
  });

  context('when using isSitemapChar', function() {
    it('should return true if a char is valid', function() {
      for (let i = 0; i < allowedSitemapChars.length; i += 1) {
        expect(isSitemapChar(allowedSitemapChars[i])).to.be.a('boolean').and.to.be.true;
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
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isSitemapChar(disallowedOtherChars[i])).to.be.a('boolean').and.to.be.false;
      }
    });
  });

  context('when using isURIChar', function() {
    it('should return true if a char is valid', function() {
      for (let i = 0; i < allowedURIChars.length; i += 1) {
        expect(isURIChar(allowedURIChars[i])).to.be.a('boolean').and.to.be.true;
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
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isURIChar(disallowedOtherChars[i])).to.be.a('boolean').and.to.be.false;
      }
    });
  });

  context('when using isSchemeChar', function() {
    it('should return true if a char is valid', function() {
      for (let i = 0; i < allowedSchemeChars.length; i += 1) {
        expect(isSchemeChar(allowedSchemeChars[i])).to.be.a('boolean').and.to.be.true;
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
      for (let i = 0; i < disallowedSchemeChars.length; i += 1) {
        expect(isSchemeChar(disallowedSchemeChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isSchemeChar(disallowedOtherChars[i])).to.be.a('boolean').and.to.be.false;
      }
    });

    it('should start with a letter', function() {
      for (let i = 0; i < az.length; i += 1) {
        expect(isSchemeChar(az[i])).to.be.a('boolean').and.to.be.true;
        expect(isSchemeChar(az[i], { start: true })).to.be.a('boolean').and.to.be.true;
      }
      for (let i = 0; i < digits.length; i += 1) {
        expect(isSchemeChar(digits[i])).to.be.a('boolean').and.to.be.true;
        expect(isSchemeChar(digits[i], { start: true })).to.be.a('boolean').and.to.be.false;
      }
    });
  });

  context('when using isPercentEncodingChar', function() {
    it('should return true if a char is valid', function() {
      for (let i = 0; i < allowedPercentEncodingChars.length; i += 1) {
        expect(isPercentEncodingChar(allowedPercentEncodingChars[i])).to.be.a('boolean').and.to.be.true;
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
      for (let i = 0; i < disallowedPercentEncodingChars.length; i += 1) {
        expect(isPercentEncodingChar(disallowedPercentEncodingChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isPercentEncodingChar(disallowedOtherChars[i])).to.be.a('boolean').and.to.be.false;
      }
    });
  });

  context('when using isUserinfoChar', function() {
    it('should return true if a char is valid', function() {
      for (let i = 0; i < allowedUserinfoChars.length; i += 1) {
        expect(isUserinfoChar(allowedUserinfoChars[i])).to.be.a('boolean').and.to.be.true;
      }
    });

    it('should return false if a char does not exist', function() {
      expect(isUserinfoChar()).to.be.a('boolean').and.to.be.false;
      expect(isUserinfoChar(undefined)).to.be.a('boolean').and.to.be.false;
      expect(isUserinfoChar(null)).to.be.a('boolean').and.to.be.false;
      expect(isUserinfoChar(NaN)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is empty', function() {
      expect(isUserinfoChar('')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not a string', function() {
      expect(isUserinfoChar([])).to.be.a('boolean').and.to.be.false;
      expect(isUserinfoChar({})).to.be.a('boolean').and.to.be.false;
      expect(isUserinfoChar(new Error('error'))).to.be.a('boolean').and.to.be.false;
      expect(isUserinfoChar(5)).to.be.a('boolean').and.to.be.false;
      expect(isUserinfoChar(true)).to.be.a('boolean').and.to.be.false;
      expect(isUserinfoChar(false)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not allowed', function() {
      for (let i = 0; i < disallowedUserinfoChars.length; i += 1) {
        expect(isUserinfoChar(disallowedUserinfoChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < disallowedURIChars.length; i += 1) {
        expect(isUserinfoChar(disallowedURIChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isUserinfoChar(disallowedOtherChars[i])).to.be.a('boolean').and.to.be.false;
      }
    });
  });

  context('when using isDomainLabel', function() {
    it('should return true if a label is minimum 1 character and maximum 63', function() {
      expect(isDomainLabel('a')).to.be.a('boolean').and.to.be.true;
      expect(isDomainLabel('a'.repeat(63))).to.be.a('boolean').and.to.be.true;
    });

    it('should return false if a label is less than 1 character and more than 63', function() {
      expect(isDomainLabel('')).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel('a'.repeat(64))).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a label is not defined', function() {
      expect(isDomainLabel()).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel(null)).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel(undefined)).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel(NaN)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a label is not a string', function() {
      expect(isDomainLabel({})).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel([])).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel(new Error('error'))).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel(true)).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel(5)).to.be.a('boolean').and.to.be.false;
    });

    it('should return true if a label has lowercase letters, digits or hyphens, start or end with a digit', function() {
      expect(isDomainLabel('a')).to.be.a('boolean').and.to.be.true;
      expect(isDomainLabel('a2')).to.be.a('boolean').and.to.be.true;
      expect(isDomainLabel('2a2')).to.be.a('boolean').and.to.be.true;
      expect(isDomainLabel('aaaaa')).to.be.a('boolean').and.to.be.true;
      expect(isDomainLabel('1')).to.be.a('boolean').and.to.be.true;
      expect(isDomainLabel('a9999')).to.be.a('boolean').and.to.be.true;
      expect(isDomainLabel('9999a')).to.be.a('boolean').and.to.be.true;
      expect(isDomainLabel('a99-99')).to.be.a('boolean').and.to.be.true;
      expect(isDomainLabel('9-9-9-9-a')).to.be.a('boolean').and.to.be.true;
    });

    it('should return false if a label has other characters than lowercase letters, digits or hyphens', function() {
      expect(isDomainLabel('a$')).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel('a.2')).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel('2a"2')).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel('aa!aaa')).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel('11111*11111')).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel('a99.99')).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel('aùéè9')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a label start or end with a hyphen', function() {
      expect(isDomainLabel('-a')).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel('-')).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel('2a2-')).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel('-aa-aaa-')).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel('-11-111-11-111')).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel('a99-99-')).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel('-9')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a label has consecutive hyphens', function() {
      expect(isDomainLabel('a-b-c--d')).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel('--')).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel('2--a')).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel('a--a--a')).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel('11--111-11-111')).to.be.a('boolean').and.to.be.false;
      expect(isDomainLabel('a--9999')).to.be.a('boolean').and.to.be.false;
    });
  });

  context('when using isDomain', function() {
    it('should return true if a domain name is localhost', function() {
      expect(isDomain('localhost')).to.be.a('boolean').and.to.be.true;
    });

    it('should return true if a domain name has minimum 2 labels and is maximum 255 characters', function() {
      expect(isDomain('g.com')).to.be.a('boolean').and.to.be.true;
      expect(isDomain(`${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(63)}`)).to.be.a('boolean').and.to.be.true;
    });

    it('should return true if a domain name ends with . as a root label', function() {
      expect(isDomain('example.com.')).to.be.a('boolean').and.to.be.true;
      expect(isDomain('a.com.')).to.be.a('boolean').and.to.be.true;
      expect(isDomain('b.com.')).to.be.a('boolean').and.to.be.true;
      expect(isDomain('a.b.c.d.')).to.be.a('boolean').and.to.be.true;
    });

    it('should return true if a domain label starts with xn-- to support IDN', function() {
      expect(isDomain('xn--fiq228c.com')).to.be.a('boolean').and.to.be.true;
      expect(isDomain('xn--espaol-zwa.com')).to.be.a('boolean').and.to.be.true;
      expect(isDomain('xn--fiq228c.xn--espaol-zwa.com')).to.be.a('boolean').and.to.be.true;
    });

    it('should return true if a domain name has non ASCII characters to support IDN', function() {
      expect(isDomain('中文.com')).to.be.a('boolean').and.to.be.true;
      expect(isDomain('español.com')).to.be.a('boolean').and.to.be.true;
      expect(isDomain('中文.español.com')).to.be.a('boolean').and.to.be.true;
    });

    it('should return true if a domain label has already been punycoded', function() {
      expect(isDomain('xn--fiq228c.com', { punycoded: true })).to.be.a('boolean').and.to.be.true;
      expect(isDomain('xn--espaol-zwa.com', { punycoded: true })).to.be.a('boolean').and.to.be.true;
      expect(isDomain('xn--fiq228c.xn--espaol-zwa.com', { punycoded: true })).to.be.a('boolean').and.to.be.true;
    });

    it('should return true if a domain label has non ASCII characters and punycoded is false', function() {
      expect(isDomain('中文.com', { punycoded: false })).to.be.a('boolean').and.to.be.true;
      expect(isDomain('español.com', { punycoded: false })).to.be.a('boolean').and.to.be.true;
      expect(isDomain('中文.español.com', { punycoded: false })).to.be.a('boolean').and.to.be.true;
    });

    it('should return false if a domain name is not defined', function() {
      expect(isDomain()).to.be.a('boolean').and.to.be.false;
      expect(isDomain(null)).to.be.a('boolean').and.to.be.false;
      expect(isDomain(undefined)).to.be.a('boolean').and.to.be.false;
      expect(isDomain(NaN)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a domain name is not a string', function() {
      expect(isDomain({})).to.be.a('boolean').and.to.be.false;
      expect(isDomain([])).to.be.a('boolean').and.to.be.false;
      expect(isDomain(new Error('error'))).to.be.a('boolean').and.to.be.false;
      expect(isDomain(true)).to.be.a('boolean').and.to.be.false;
      expect(isDomain(5)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a domain label was supposed to be punycoded but was not', function() {
      expect(isDomain('中文.com', { punycoded: true })).to.be.a('boolean').and.to.be.false;
      expect(isDomain('español.com', { punycoded: true })).to.be.a('boolean').and.to.be.false;
      expect(isDomain('中文.español.com', { punycoded: true })).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a domain label does not start with xn--', function() {
      expect(isDomain('xnn--fiq228c.com')).to.be.a('boolean').and.to.be.false;
      expect(isDomain('an--espaol-zwa.com')).to.be.a('boolean').and.to.be.false;
      expect(isDomain('xn--fiq228c.an--espaol-zwa.com')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a domain name has no label', function() {
      expect(isDomain('')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a domain name is more than 255 characters', function() {
      expect(isDomain(`${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(63)}.com`)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a domain name has labels more than 63 characters', function() {
      expect(isDomain(`${'a'.repeat(63)}.${'b'.repeat(64)}.${'c'.repeat(62)}.${'d'.repeat(63)}`)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a domain name has only 1 label or an empty label', function() {
      expect(isDomain('g')).to.be.a('boolean').and.to.be.false;
      expect(isDomain(' ')).to.be.a('boolean').and.to.be.false;
      expect(isDomain('     ')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a domain name is less than 1 character and more than 63', function() {
      expect(isDomain('')).to.be.a('boolean').and.to.be.false;
      expect(isDomain(`${'a'.repeat(64)}.com`)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a domain name has some identical labels', function() {
      expect(isDomain('a.a.a')).to.be.a('boolean').and.to.be.false;
      expect(isDomain('a.b.b')).to.be.a('boolean').and.to.be.false;
      expect(isDomain('example.com.com')).to.be.a('boolean').and.to.be.false;
      expect(isDomain('game.develop.game')).to.be.a('boolean').and.to.be.false;
      expect(isDomain(`${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(63)}.${'a'.repeat(63)}`)).to.be.a('boolean').and.to.be.false;
      expect(isDomain(`${'a'.repeat(63)}.${'b'.repeat(63)}.${'b'.repeat(63)}.${'d'.repeat(63)}`)).to.be.a('boolean').and.to.be.false;
      expect(isDomain(`${'a'.repeat(63)}.${'a'.repeat(63)}.${'b'.repeat(63)}.${'d'.repeat(63)}`)).to.be.a('boolean').and.to.be.false;
      expect(isDomain(`${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(63)}.${'c'.repeat(63)}`)).to.be.a('boolean').and.to.be.false;
    });
  });

  context('when using checkPercentEncoding', function() {
    it('should throw an uri error when uri is not a string', function() {
      expect(() => checkPercentEncoding()).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_STRING');
      expect(() => checkPercentEncoding(undefined)).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_STRING');
      expect(() => checkPercentEncoding(null)).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_STRING');
      expect(() => checkPercentEncoding(NaN)).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_STRING');
      expect(() => checkPercentEncoding([])).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_STRING');
      expect(() => checkPercentEncoding(new Error('error'))).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_STRING');
      expect(() => checkPercentEncoding(5)).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_STRING');
      expect(() => checkPercentEncoding(true)).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_STRING');
      expect(() => checkPercentEncoding(false)).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_STRING');
      expect(() => checkPercentEncoding({})).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_STRING');
    });

    it('should return an offset at 0 if a string is empty', function() {
      expect(checkPercentEncoding('')).to.be.a('number').and.to.equals(0);
    });

    it('should return an offset at 0 if a string is not empty but index is missing', function() {
      expect(checkPercentEncoding('percent%20encoding')).to.be.a('number').and.to.equals(0);
    });

    it('should return an offset at 0 if a string is not empty but index is not a number', function() {
      expect(checkPercentEncoding('percent%20encoding', {})).to.be.a('number').and.to.equals(0);
      expect(checkPercentEncoding('percent%20encoding', [])).to.be.a('number').and.to.equals(0);
      expect(checkPercentEncoding('percent%20encoding', 5)).to.be.a('number').and.to.equals(0);
      expect(checkPercentEncoding('percent%20encoding', true)).to.be.a('number').and.to.equals(0);
      expect(checkPercentEncoding('percent%20encoding', 'index')).to.be.a('number').and.to.equals(0);
      expect(checkPercentEncoding('percent%20encoding', new Error('error'))).to.be.a('number').and.to.equals(0);
    });

    it('should return an offset at 0 if % character is at a bad index', function() {
      expect(checkPercentEncoding('percent%20encoding', 6)).to.be.a('number').and.to.equals(0);
      expect(checkPercentEncoding('percent%20encoding', 8)).to.be.a('number').and.to.equals(0);
    });

    it('should return a correct offset if % character is at the specified index when stringLen is specified', function() {
      expect(checkPercentEncoding('percent%20encoding', 7, 18)).to.be.a('number').and.to.equals(2);
      expect(checkPercentEncoding('percent%C3%BCencoding', 7, 21)).to.be.a('number').and.to.equals(2);
      expect(checkPercentEncoding('percent%C3%BCencoding', 10, 21)).to.be.a('number').and.to.equals(2);
    });

    it('should return an offset at 0 if % character is at the specified index but stringLen is less than or equal to index', function() {
      expect(checkPercentEncoding('percent%20encoding', 7, 2)).to.be.a('number').and.to.equals(0);
      expect(checkPercentEncoding('percent%20encoding', 7, 7)).to.be.a('number').and.to.equals(0);
    });

    it('should throw an uri error if % character is at the specified index but stringLen is misused (index or index + 1 length)', function() {
      expect(() => checkPercentEncoding('percent%20encoding', 7, 8)).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING');
      expect(() => checkPercentEncoding('percent%20encoding', 7, 9)).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING');
    });

    it('should return a correct offset if % character is at the specified index', function() {
      expect(checkPercentEncoding('percent%20encoding', 7)).to.be.a('number').and.to.equals(2);
      expect(checkPercentEncoding('percent%C3%BCencoding', 7)).to.be.a('number').and.to.equals(2);
      expect(checkPercentEncoding('percent%C3%BCencoding', 10)).to.be.a('number').and.to.equals(2);
    });

    it('should return a correct offset if % character is at the specified index', function() {
      expect(checkPercentEncoding('percent%20encoding', 7)).to.be.a('number').and.to.equals(2);
      expect(checkPercentEncoding('percent%C3%BCencoding', 7)).to.be.a('number').and.to.equals(2);
      expect(checkPercentEncoding('percent%C3%BCencoding', 10)).to.be.a('number').and.to.equals(2);
    });

    it('should throw an uri error when percent encoding is malformed', function() {
      expect(() => checkPercentEncoding('percent%2encoding', 7)).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkPercentEncoding('percent%2éncoding', 7)).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkPercentEncoding('percent%2%', 7)).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkPercentEncoding('percent%%%', 7)).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkPercentEncoding('percent%2-encoding', 7)).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkPercentEncoding('percent%encoding', 7)).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkPercentEncoding('percent%', 7)).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING');
      expect(() => checkPercentEncoding('percent%A', 7)).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING');
      expect(() => checkPercentEncoding('percent%9', 7)).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING');
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
      // scheme cannot be an empty string followinf parseURI behavior
      expect(() => checkURISyntax('/Users/dir/file.js')).to.throw(URIError).with.property('code', 'URI_MISSING_SCHEME');
      expect(() => checkURISyntax('://example.com')).to.throw(URIError).with.property('code', 'URI_MISSING_SCHEME');
    });

    // parseURI always returns an empty path, regexp makes it impossible to have a null path

    it('should throw an uri error when uri has no path', function() {
      expect(() => checkURISyntax('http:')).to.not.throw;
      expect(() => checkURISyntax(':')).to.not.throw;
      expect(() => checkURISyntax('s://')).to.not.throw;
    });

    // if authority is present following parseURI behavior path will always be at least empty or start with /

    it('should throw an uri error when authority is not present and path starts with //', function() {
      expect(() => checkURISyntax('http://example.fr//path')).to.not.throw;
      expect(() => checkURISyntax('http:////path')).to.throw(URIError).with.property('code', 'URI_INVALID_PATH');
    });

    it('should not throw if an uri has at least a scheme and a path', function() {
      expect(() => checkURISyntax('http://example.com')).to.not.throw;
      expect(() => checkURISyntax('http://example.com/path')).to.not.throw;
      expect(() => checkURISyntax('http://')).to.not.throw;
    });

    it('should not throw when authority is not present and path does not start with //', function() {
      expect(() => checkURISyntax('http:///path')).to.not.throw;
    });

    it('should return a specific object if no errors were thrown', function() {
      let check = checkURISyntax('foo://中文.com:8042/over/there?name=ferret#nose');
      expect(check).to.be.an('object').and.to.have.property('scheme', 'foo');
      expect(check).to.be.an('object').and.to.have.property('authority', 'xn--fiq228c.com:8042');
      expect(check).to.be.an('object').and.to.have.property('authorityPunydecoded', '中文.com:8042');
      expect(check).to.be.an('object').and.to.have.property('userinfo', null);
      expect(check).to.be.an('object').and.to.have.property('host', 'xn--fiq228c.com');
      expect(check).to.be.an('object').and.to.have.property('hostPunydecoded', '中文.com');
      expect(check).to.be.an('object').and.to.have.property('port', 8042);
      expect(check).to.be.an('object').and.to.have.property('path', '/over/there');
      expect(check).to.be.an('object').and.to.have.property('query', 'name=ferret');
      expect(check).to.be.an('object').and.to.have.property('fragment', 'nose');
      expect(check).to.be.an('object').and.to.have.property('schemeLen', 3);
      expect(check).to.be.an('object').and.to.have.property('valid', true);

      check = checkURISyntax('foo://example.com:80g42/over/there?name=ferret#nose');
      expect(check).to.be.an('object').and.to.have.property('scheme', 'foo');
      expect(check).to.be.an('object').and.to.have.property('authority', 'example.com:80g42');
      expect(check).to.be.an('object').and.to.have.property('authorityPunydecoded', 'example.com:80g42');
      expect(check).to.be.an('object').and.to.have.property('userinfo', null);
      expect(check).to.be.an('object').and.to.have.property('host', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('hostPunydecoded', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('port', '80g42');
      expect(check).to.be.an('object').and.to.have.property('path', '/over/there');
      expect(check).to.be.an('object').and.to.have.property('query', 'name=ferret');
      expect(check).to.be.an('object').and.to.have.property('fragment', 'nose');
      expect(check).to.be.an('object').and.to.have.property('schemeLen', 3);
      expect(check).to.be.an('object').and.to.have.property('valid', true);
    });
  });

  context('when using checkURI that uses checkURISyntax', function() {
  // SAME TESTS FROM checkURISyntax to check consistency
    it('should throw an uri error when uri is not a string', function() {
      expect(() => checkURI()).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkURI(undefined)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkURI(null)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkURI(NaN)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkURI([])).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkURI(new Error('error'))).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkURI(5)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkURI(true)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkURI(false)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkURI({})).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
    });

    it('should throw an uri error when uri has no scheme', function() {
      // scheme cannot be an empty string followinf parseURI behavior
      expect(() => checkURI('/Users/dir/file.js')).to.throw(URIError).with.property('code', 'URI_MISSING_SCHEME');
      expect(() => checkURI('://example.com')).to.throw(URIError).with.property('code', 'URI_MISSING_SCHEME');
    });

    // parseURI always returns an empty path, regexp makes it impossible to have a null path

    it('should throw an uri error when uri has no path', function() {
      expect(() => checkURI('http:')).to.not.throw;
      expect(() => checkURI(':')).to.not.throw;
      expect(() => checkURI('s://')).to.not.throw;
    });

    // if authority is present following parseURI behavior path will always be at least empty or start with /

    it('should throw an uri error when authority is not present and path starts with //', function() {
      expect(() => checkURI('http://example.fr//path')).to.not.throw;
      expect(() => checkURI('http:////path')).to.throw(URIError).with.property('code', 'URI_INVALID_PATH');
    });

    it('should not throw if an uri has at least a scheme and a path', function() {
      expect(() => checkURI('http://example.com')).to.not.throw;
      expect(() => checkURI('http://example.com/path')).to.not.throw;
      expect(() => checkURI('http://')).to.not.throw;
    });

    it('should not throw when authority is not present and path does not start with //', function() {
      expect(() => checkURI('http:///path')).to.not.throw;
    });

    // additional tests
    it('should throw an uri error when scheme has invalid chars', function() {
      expect(() => checkURI('htép://example.com')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME_CHAR');
      expect(() => checkURI('ht°p://example.com')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME_CHAR');
    });

    it('should throw an uri error when userinfo has invalid characters', function() {
      expect(() => checkURI('foo://usér:pass@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_USERINFO_CHAR');
      expect(() => checkURI('foo://us€r:pass@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_USERINFO_CHAR');
      expect(() => checkURI('foo://user:pa[ss@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_USERINFO_CHAR');
      expect(() => checkURI('foo://usEr:pass@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_USERINFO_CHAR');
      expect(() => checkURI('foo://usEr:pasS@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_USERINFO_CHAR');
    });

    it('should throw an uri error when userinfo has invalid percent encodings', function() {
      expect(() => checkURI('foo://user%:pass@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkURI('foo://user%20%2z:pass@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkURI('foo://user:%acpass@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkURI('foo://user:pass%@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING');
      expect(() => checkURI('foo://user:pass%a@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING');
    });

    it('should throw an uri error when host is not valid ip', function() {
      expect(() => checkURI('foo://999.999.999.999:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_HOST');
      expect(() => checkURI('foo://3ffe:b00::1::a/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_HOST');
    });

    it('should throw an uri error when host is not valid domain', function() {
      expect(() => checkURI('foo://aaaaaa:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_HOST');
      expect(() => checkURI('foo://com.com/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_HOST');
      expect(() => checkURI('foo://example..com/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_HOST');
    });

    it('should throw an uri error when port is not a number', function() {
      expect(() => checkURI('foo://example.com:80g42/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PORT');
    });

    it('should throw an uri error when invalid characters are found following scheme://authority', function() {
      expect(() => checkURI('foo://example.com:8042/over/thère?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_CHAR');
      expect(() => checkURI('foo://example.com:8042/ôver/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_CHAR');
      expect(() => checkURI('foo://example.com:8042/over\\there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_CHAR');
      expect(() => checkURI('foo://example.com:8042/\\over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_CHAR');
      expect(() => checkURI('foo://example.com:8042/over^there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_CHAR');
      expect(() => checkURI('foo://example.com:8042/{over}/the`re?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_CHAR');
      expect(() => checkURI('foo://example.com:8042/over|there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_CHAR');
      expect(() => checkURI('foo://example.com:8042/over}/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_CHAR');
      expect(() => checkURI('foo://example.com:8042/over/{there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_CHAR');
    });

    it('should throw an uri error when invalid percent encodings are found following scheme://authority', function() {
      expect(() => checkURI('foo://example.com:8042/over/there%20%20%?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkURI('foo://example.com:8042/over/there%2?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkURI('foo://example.com:8042/over/there%Aa?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkURI('foo://example.com:8042/%2cover/there%20%20?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkURI('foo://example.com:8042/%a2over/there%20%20%?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkURI('foo://example.com:8042/%gover/there%20%20%?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkURI('foo://example.com:8042/%20over/there%20%20%?name=ferret%#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkURI('foo://example.com:8042/%20over/there%20%20%?name=ferret%%#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkURI('foo://example.com:8042/over/there%20%20%?name=f%erret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret#nose%')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING');
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret#nose%A')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING');
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret#nose%ef')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret#nose%ac')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret#nose%9')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING');
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret#nose%8c')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret#nose%a9')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
    });

    it('should not throw an uri error when unescaped but allowed sitemap characters are found following scheme://authority if sitemap is false', function() {
      expect(() => checkURI('foo://example.com:8042/it\'sover/there?name=ferret#nose', { sitemap: false })).to.not.throw;
      expect(() => checkURI('foo://example.com:8042/it"s%20over/there?name=ferret#nose', { sitemap: false })).to.not.throw;
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret&pseudo=superhero#nose', { sitemap: false })).to.not.throw;
    });

    it('should throw an uri error when unescaped sitemap characters are found following scheme://authority if sitemap is true', function() {
      expect(() => checkURI('foo://example.com:8042/it\'sover/there?name=ferret#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SITEMAP_CHAR');
      expect(() => checkURI('foo://example.com:8042/it"s%20over/there?name=ferret#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SITEMAP_CHAR');
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret&pseudo=superhero#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SITEMAP_CHAR');
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret&pseudo=superhero#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SITEMAP_CHAR');
      expect(() => checkURI('foo://example.com:8042/over/&quotthere?name=ferret#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SITEMAP_CHAR');
      expect(() => checkURI('foo://example.com:8042/over&am/there?name=ferret#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SITEMAP_CHAR');
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret&apo#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SITEMAP_CHAR');
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret&g#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SITEMAP_CHAR');
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret&l;#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SITEMAP_CHAR');
    });

    it('should return a specific object if no errors were thrown', function() {
      let check = checkURI('foo://中文.com:8042/over/there?name=ferret#nose');
      expect(check).to.be.an('object').and.to.have.property('scheme', 'foo');
      expect(check).to.be.an('object').and.to.have.property('authority', 'xn--fiq228c.com:8042');
      expect(check).to.be.an('object').and.to.have.property('authorityPunydecoded', '中文.com:8042');
      expect(check).to.be.an('object').and.to.have.property('userinfo', null);
      expect(check).to.be.an('object').and.to.have.property('host', 'xn--fiq228c.com');
      expect(check).to.be.an('object').and.to.have.property('hostPunydecoded', '中文.com');
      expect(check).to.be.an('object').and.to.have.property('port', 8042);
      expect(check).to.be.an('object').and.to.have.property('path', '/over/there');
      expect(check).to.be.an('object').and.to.have.property('query', 'name=ferret');
      expect(check).to.be.an('object').and.to.have.property('fragment', 'nose');
      expect(check).to.be.an('object').and.to.have.property('valid', true);
    });
  });

  // console.log(checkURI('http://das-küchengeflüster.de./feed'));
});
