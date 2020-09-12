const { expect } = require('./Common');
const {
  uri: {
    punycode,
    punydecode,
    parseURI,
    isDomainChar,
    isSitemapToEncodeChar,
    isURIChar,
    isURIToEncodeChar,
    isSchemeChar,
    isPercentEncodingChar,
    isUserinfoChar,
    isDomainLabel,
    isDomain,
    checkPercentEncoding,
    checkURISyntax,
    checkURI,
    checkHttpURL,
    checkHttpsURL,
    checkHttpSitemapURL,
    checkHttpsSitemapURL,
    checkWebURL,
    checkSitemapURL,
    encodeURIString,
    decodeURIString,
    encodeWebURL,
    encodeSitemapURL,
    decodeWebURL,
    decodeSitemapURL,
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
const allowedURIToEncodeChars = allowedURIChars.replace('%', '');;
const allowedSitemapToEncodeChars = `${allowedURIToEncodeChars}<>`;
const domainAllowedChars = `${az}${digits}-`;
const allowedSchemeChars = `${az}${digits}+-.`;
const allowedPercentEncodingChars = `${digits}${hexdig}`;
const allowedUserinfoChars = `${az}${digits}!"$%&'()*+,-.:;=_~`;

// disallowed
const disallowed = '\\^`{|}';
const disallowedURIChars = `${AZ}${disallowed}<>`;
const disallowedURIToEncodeChars = `${AZ}${disallowed}<>`;
const disallowedSitemapToEncodeChars = `${AZ}${disallowed}`;
const disallowedDomainChars = `${AZ}${allowed.replace('-', '')}`;
const disallowedSchemeChars = `${disallowedURIChars}${allowed.replace(/[-+.]/g, '')}`;
const disallowedPercentEncodingChars = `${az}${GZ}${allowed}${disallowed}<>`;
const disallowedUserinfoChars = '#/?@[]';
const disallowedOtherChars = '€°éùèàç §£';

const uri = [
  'urn:isbn',
  'ftp://example.com',
  ':',
  'f:',
  'f://',
  'f:///path',
];

const noUri = [
  {},
  [],
  255,
  true,
  new Error('error'),
  '',
  '       ',
  ' http: example.com',
  `${'a'.repeat(64)}.com`,
  `${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(63)}.com`,
  '/Users/dir/file.js',
  '://example.com',
  'http:',
  ':',
  's://',
  'éè://test:80',
  's://s.s.',
  'foo://foo.foo',
  'foo://a.b.a',
  'hép://example.com',
  '°p://example.com',
  'foo://usér:pass@example.com:8042/over/there?name=ferret#nose',
  'foo://us€r:pass@example.com:8042/over/there?name=ferret#nose',
  'foo://user:pa[ss@example.com:8042/over/there?name=ferret#nose',
  'foo://usEr:pass@example.com:8042/over/there?name=ferret#nose',
  'foo://usEr:pasS@example.com:8042/over/there?name=ferret#nose',
  'foo://user%:pass@example.com:8042/over/there?name=ferret#nose',
  'foo://user%20%2z:pass@example.com:8042/over/there?name=ferret#nose',
  'foo://user:%acpass@example.com:8042/over/there?name=ferret#nose',
  'foo://user:pass%@example.com:8042/over/there?name=ferret#nose',
  'foo://user:pass%a@example.com:8042/over/there?name=ferret#nose',
  'foo://999.999.999.999:8042/over/there?name=ferret#nose',
  'foo://3ffe:b00::1::a/over/there?name=ferret#nose',
  'foo://aaaaaa:8042/over/there?name=ferret#nose',
  'foo://com.com/over/there?name=ferret#nose',
  'foo://example..com/over/there?name=ferret#nose',
  'foo://xn--iñvalid.com',
  'foo://example.com:80g42/over/there?name=ferret#nose',
  'foo://example.com:8042/over/thère?name=ferret#nose',
  'foo://example.com:8042/ôver/there?name=ferret#nose',
  'foo://example.com:8042/over\\there?name=ferret#nose',
  'foo://example.com:8042/\\over/there?name=ferret#nose',
  'foo://example.com:8042/over^there?name=ferret#nose',
  'foo://example.com:8042/{over}/the`re?name=ferret#nose',
  'foo://example.com:8042/over|there?name=ferret#nose',
  'foo://example.com:8042/over}/there?name=ferret#nose',
  'foo://example.com:8042/over/{there?name=ferret#nose',
  'foo://example.com:8042/over/there%20%20%?name=ferret#nose',
  'foo://example.com:8042/over/there%2?name=ferret#nose',
  'foo://example.com:8042/over/there%Aa?name=ferret#nose',
  'foo://example.com:8042/%2cover/there%20%20?name=ferret#nose',
  'foo://example.com:8042/%a2over/there%20%20%?name=ferret#nose',
  'foo://example.com:8042/%gover/there%20%20%?name=ferret#nose',
  'foo://example.com:8042/%20over/there%20%20%?name=ferret%#nose',
  'foo://example.com:8042/%20over/there%20%20%?name=ferret%%#nose',
  'foo://example.com:8042/over/there%20%20%?name=f%erret#nose',
  'foo://example.com:8042/over/there?name=ferret#nose%',
  'foo://example.com:8042/over/there?name=ferret#nose%A',
  'foo://example.com:8042/over/there?name=ferret#nose%ef',
  'foo://example.com:8042/over/there?name=ferret#nose%ac',
  'foo://example.com:8042/over/there?name=ferret#nose%9',
  'foo://example.com:8042/over/there?name=ferret#nose%8c',
  'foo://example.com:8042/over/there?name=ferret#nose%a9',
];

const http = [
  'http://example.com.',
  'http://www.example.com.',
  'http://www.example.com',
  'http://a.b',
  'http://a.b.',
  'http://a.b.c.d.',
  'http://user:pass@example.com.',
  'http://user:pass@example.com./',
  'http://user:pass@example.com./over/there?page=5#coin',
  'http://中文.com',
  'http://example.com:8042/it\'sover/there?name=ferret#nose',
  'http://example.com:8042/it"s%20over/there?name=ferret#nose',
  'http://example.com:8042/over/there?name=ferret&pseudo=superhero#nose',
  'http://username:password@www.example.com:80/path/to/file.php?foo=316&bar=this+has+spaces#anchor',
];

const notHttp = [
  'foo://example.com:8042/over/there?name=ferret#nose',
  'ftp://example.com:8042/over/there?name=ferret#nose',
  'f://example.com:8042/over/there?name=ferret#nose',
  'c://example.com:8042/over/there?name=ferret#nose',
  'https://example.com:8042/over/there?name=ferret#nose',
  'http:isbn:0-486-27557-4',
  'http:///path',
];

const https = [
  'https://example.com.',
  'https://www.example.com.',
  'https://www.example.com',
  'https://a.b',
  'https://a.b.',
  'https://a.b.c.d.',
  'https://user:pass@example.com.',
  'https://user:pass@example.com./',
  'https://user:pass@example.com./over/there?page=5#coin',
  'https://中文.com',
  'https://example.com:8042/it\'sover/there?name=ferret#nose',
  'https://example.com:8042/it"s%20over/there?name=ferret#nose',
  'https://example.com:8042/over/there?name=ferret&pseudo=superhero#nose',
  'https://中文.com:8042/over/there?name=ferret&pseudo=superhero#nose',
];

const notHttps = [
  'foo://example.com:8042/over/there?name=ferret#nose',
  'ftp://example.com:8042/over/there?name=ferret#nose',
  'f://example.com:8042/over/there?name=ferret#nose',
  'c://example.com:8042/over/there?name=ferret#nose',
  'http://example.com:8042/over/there?name=ferret#nose',
  'https:isbn:0-486-27557-4',
  'https:///path',
];

const idn = [
  'http://español.com',
  'http://中文.com',
  'https://中文.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose',
];

const sitemap = [
  'http://user:pass@example.com./over/there?page=5&x=1#coin',
  'https://中文.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose',
  'http://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose',
  'http://example.com:8042/it&apos;sover/there?name=ferret#nose',
  'http://example.com:8042/it&quot;sover/there?name=ferret#nose',
  'http://example.com:8042/&lt;over&gt;/there?name=ferret#nose',
  'http://example.com:8042/&amp;sover/&gt;there&lt;?name=ferret#nose',
];

const noSitemap = [
  'http://user:pass@example.com./over/there?page=5&x=1#coin',
  'https://中文.com:8042/over/there?name=ferret&pseudo=superhero#nose',
  'http://example.com:8042/over/there%20%20%?name=ferret#nose',
  'http://example.com:8042/over/there%2?name=ferret#nose',
  'http://example.com:8042/over/there%Aa?name=ferret#nose',
  'http://example.com:8042/%2cover/there%20%20?name=ferret#nose',
  'http://example.com:8042/%a2over/there%20%20%?name=ferret#nose',
  'http://example.com:8042/%gover/there%20%20%?name=ferret#nose',
  'http://example.com:8042/%20over/there%20%20%?name=ferret%#nose',
  'http://example.com:8042/%20over/there%20%20%?name=ferret%%#nose',
  'http://example.com:8042/over/there%20%20%?name=f%erret#nose',
  'http://example.com:8042/over/there?name=ferret#nose%',
  'http://example.com:8042/over/there?name=ferret#nose%A',
  'http://example.com:8042/over/there?name=ferret#nose%ef',
  'http://example.com:8042/over/there?name=ferret#nose%ac',
  'http://example.com:8042/over/there?name=ferret#nose%9',
  'http://example.com:8042/over/there?name=ferret#nose%8c',
  'http://example.com:8042/over/there?name=ferret#nose%a9',
  'http://example.com:8042/it\'sover/there?name=ferret#nose',
  'http://example.com:8042/it"s%20over/there?name=ferret#nose',
  'http://example.com:8042/over/there?name=ferret&pseudo=superhero#nose',
  'http://example.com:8042/over/there?name=ferret&pseudo=superhero#nose',
  'http://example.com:8042/over/&quotthere?name=ferret#nose',
  'http://example.com:8042/over&am/there?name=ferret#nose',
  'http://example.com:8042/over/there?name=ferret&apo#nose',
  'http://example.com:8042/over/there?name=ferret&g#nose',
  'http://example.com:8042/over/there?name=ferret&l;#nose',
];

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

    it('should return an object with authority and its components at null except original authority components if uri has an invalid host', function() {
      let parsedURI = parseURI('http://user:pass@xn--iñvalid.com:8080');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', 'http');
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', 'user:pass@xn--iñvalid.com:8080');
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', 'xn--iñvalid.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', '');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', null);

      parsedURI = parseURI('http://user:pass@xn--iñvalid.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', 'http');
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', 'user:pass@xn--iñvalid.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', 'xn--iñvalid.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', '');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', null);

      parsedURI = parseURI('http://xn--iñvalid.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', 'http');
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', 'xn--iñvalid.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', 'xn--iñvalid.com');
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', '');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', null);

      parsedURI = parseURI('http://user:pass@example.co.jp\\');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', 'http');
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', 'user:pass@example.co.jp\\');
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', 'example.co.jp\\');
      expect(parsedURI).to.be.an('object').and.to.have.property('port', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('path', '');
      expect(parsedURI).to.be.an('object').and.to.have.property('query', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('fragment', null);

      parsedURI = parseURI('http://user:pass@xn--iñvalid.com:8080/path?query=test#fragment');
      expect(parsedURI).to.be.an('object').and.to.have.property('scheme', 'http');
      expect(parsedURI).to.be.an('object').and.to.have.property('authority', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('authorityPunydecoded', 'user:pass@xn--iñvalid.com:8080');
      expect(parsedURI).to.be.an('object').and.to.have.property('userinfo', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('host', null);
      expect(parsedURI).to.be.an('object').and.to.have.property('hostPunydecoded', 'xn--iñvalid.com');
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
      for (let i = 0; i < disallowedSitemapToEncodeChars.length; i += 1) {
        expect(isDomainChar(disallowedSitemapToEncodeChars[i])).to.be.a('boolean').and.to.be.false;
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

  context('when using isSitemapToEncodeChar', function() {
    it('should return true if a char is valid', function() {
      for (let i = 0; i < allowedSitemapToEncodeChars.length; i += 1) {
        expect(isSitemapToEncodeChar(allowedSitemapToEncodeChars[i])).to.be.a('boolean').and.to.be.true;
      }
    });

    it('should return false if a char does not exist', function() {
      expect(isSitemapToEncodeChar()).to.be.a('boolean').and.to.be.false;
      expect(isSitemapToEncodeChar(undefined)).to.be.a('boolean').and.to.be.false;
      expect(isSitemapToEncodeChar(null)).to.be.a('boolean').and.to.be.false;
      expect(isSitemapToEncodeChar(NaN)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is empty', function() {
      expect(isSitemapToEncodeChar('')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not a string', function() {
      expect(isSitemapToEncodeChar([])).to.be.a('boolean').and.to.be.false;
      expect(isSitemapToEncodeChar({})).to.be.a('boolean').and.to.be.false;
      expect(isSitemapToEncodeChar(new Error('error'))).to.be.a('boolean').and.to.be.false;
      expect(isSitemapToEncodeChar(5)).to.be.a('boolean').and.to.be.false;
      expect(isSitemapToEncodeChar(true)).to.be.a('boolean').and.to.be.false;
      expect(isSitemapToEncodeChar(false)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not allowed', function() {
      for (let i = 0; i < disallowedSitemapToEncodeChars.length; i += 1) {
        expect(isSitemapToEncodeChar(disallowedSitemapToEncodeChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isSitemapToEncodeChar(disallowedOtherChars[i])).to.be.a('boolean').and.to.be.false;
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

  context('when using isURIToEncodeChar', function() {
    it('should return true if a char is valid', function() {
      for (let i = 0; i < allowedURIToEncodeChars.length; i += 1) {
        expect(isURIToEncodeChar(allowedURIToEncodeChars[i])).to.be.a('boolean').and.to.be.true;
      }
    });

    it('should return false if a char does not exist', function() {
      expect(isURIToEncodeChar()).to.be.a('boolean').and.to.be.false;
      expect(isURIToEncodeChar(undefined)).to.be.a('boolean').and.to.be.false;
      expect(isURIToEncodeChar(null)).to.be.a('boolean').and.to.be.false;
      expect(isURIToEncodeChar(NaN)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is empty', function() {
      expect(isURIToEncodeChar('')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not a string', function() {
      expect(isURIToEncodeChar([])).to.be.a('boolean').and.to.be.false;
      expect(isURIToEncodeChar({})).to.be.a('boolean').and.to.be.false;
      expect(isURIToEncodeChar(new Error('error'))).to.be.a('boolean').and.to.be.false;
      expect(isURIToEncodeChar(5)).to.be.a('boolean').and.to.be.false;
      expect(isURIToEncodeChar(true)).to.be.a('boolean').and.to.be.false;
      expect(isURIToEncodeChar(false)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if a char is not allowed', function() {
      for (let i = 0; i < disallowedURIToEncodeChars.length; i += 1) {
        expect(isURIToEncodeChar(disallowedURIToEncodeChars[i])).to.be.a('boolean').and.to.be.false;
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isURIToEncodeChar(disallowedOtherChars[i])).to.be.a('boolean').and.to.be.false;
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
      expect(() => checkURISyntax(':')).to.throw(URIError).with.property('code', 'URI_MISSING_SCHEME');
    });

    // parseURI always returns an empty path, regexp makes it impossible to have a null path

    it('should not throw an uri error when uri has no path', function() {
      expect(() => checkURISyntax('http:')).to.not.throw();
      expect(() => checkURISyntax('s://')).to.not.throw();
    });

    // if authority is present following parseURI behavior path will always be at least empty or start with /

    it('should throw an uri error when authority is not present and path starts with //', function() {
      expect(() => checkURISyntax('http://example.co.jp//path')).to.not.throw();
      expect(() => checkURISyntax('http:////path')).to.throw(URIError).with.property('code', 'URI_INVALID_PATH');
    });

    it('should not throw if an uri has at least a scheme and a path', function() {
      expect(() => checkURISyntax('http://example.com')).to.not.throw();
      expect(() => checkURISyntax('http://example.com/path')).to.not.throw();
      expect(() => checkURISyntax('http://')).to.not.throw();
    });

    it('should not throw when authority is not present and path does not start with //', function() {
      expect(() => checkURISyntax('http:///path')).to.not.throw();
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
      expect(() => checkURI(':')).to.throw(URIError).with.property('code', 'URI_MISSING_SCHEME');
    });

    // parseURI always returns an empty path, regexp makes it impossible to have a null path

    it('should not throw an uri error when uri has no path', function() {
      expect(() => checkURI('http:')).to.not.throw();
      expect(() => checkURI('s://')).to.not.throw();
    });

    // if authority is present following parseURI behavior path will always be at least empty or start with /

    it('should throw an uri error when authority is not present and path starts with //', function() {
      expect(() => checkURI('http://example.co.jp//path')).to.not.throw();
      expect(() => checkURI('http:////path')).to.throw(URIError).with.property('code', 'URI_INVALID_PATH');
    });

    it('should not throw if an uri has at least a scheme and a path', function() {
      expect(() => checkURI('http://example.com')).to.not.throw();
      expect(() => checkURI('http://example.com/path')).to.not.throw();
      expect(() => checkURI('http://')).to.not.throw();
    });

    it('should not throw when authority is not present and path does not start with //', function() {
      expect(() => checkURI('http:///path')).to.not.throw();
    });

    // ADDITIONAL TESTS
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

    it('should throw an uri error when host is not a valid ip', function() {
      expect(() => checkURI('foo://999.999.999.999:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_HOST');
      expect(() => checkURI('foo://3ffe:b00::1::a/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_HOST');
    });

    it('should throw an uri error when host is not a valid domain', function() {
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
      expect(() => checkURI('foo://example.com:8042/it\'sover/there?name=ferret#nose', { sitemap: false })).to.not.throw();
      expect(() => checkURI('foo://example.com:8042/it"s%20over/there?name=ferret#nose', { sitemap: false })).to.not.throw();
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret&pseudo=superhero#nose', { sitemap: false })).to.not.throw();
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

    it('should not throw an uri error if an uri is valid', function() {
      expect(() => checkURI('urn:isbn:0-486-27557-4')).to.not.throw();
      expect(() => checkURI('foo://example.com')).to.not.throw();
      expect(() => checkURI('foo://example.co.jp')).to.not.throw();
      expect(() => checkURI('foo://example.co.jp.')).to.not.throw();
      expect(() => checkURI('foo://example.co.jp.')).to.not.throw();
      expect(() => checkURI('foo://example.com.:8042/over/')).to.not.throw();
      expect(() => checkURI('foo://example.com:8042/over/there')).to.not.throw();
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret')).to.not.throw();
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret#nose')).to.not.throw();
      expect(() => checkURI('foo://user:pass@example.com:8042/over/there?name=ferret#nose')).to.not.throw();
      expect(() => checkURI('f://g.h')).to.not.throw();
      expect(() => checkURI('f://g.h.')).to.not.throw();
      expect(() => checkURI('f:')).to.not.throw();
      expect(() => checkURI('urn:')).to.not.throw();
    });

    it('should not throw an uri error if a sitemap uri is valid', function() {
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose')).to.not.throw();
      expect(() => checkURI('foo://example.com:8042/it&apos;over/there?name=ferret&amp;pseudo=superhero#nose')).to.not.throw();
      expect(() => checkURI('foo://example.com:8042/it&quot;over/there?name=ferret&amp;pseudo=superhero#nose')).to.not.throw();
      expect(() => checkURI('foo://example.com:8042/&lt;over/there?name=ferret&amp;pseudo=superhero#nose')).to.not.throw();
      expect(() => checkURI('foo://example.com:8042/$gt;over/there?name=ferret&amp;pseudo=superhero#nose')).to.not.throw();
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

      check = checkURI('ftp://user:pass@example.com/');
      expect(check).to.be.an('object').and.to.have.property('scheme', 'ftp');
      expect(check).to.be.an('object').and.to.have.property('authority', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('authorityPunydecoded', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('userinfo', 'user:pass');
      expect(check).to.be.an('object').and.to.have.property('host', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('hostPunydecoded', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('port', null);
      expect(check).to.be.an('object').and.to.have.property('path', '/');
      expect(check).to.be.an('object').and.to.have.property('query', null);
      expect(check).to.be.an('object').and.to.have.property('fragment', null);
      expect(check).to.be.an('object').and.to.have.property('valid', true);
    });
  });

  context('when using checkHttpURL that uses checkURI', function() {
    // SAME TESTS FROM checkURISyntax to check consistency
    it('should throw an uri error when uri is not a string', function() {
      expect(() => checkHttpURL()).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkHttpURL(undefined)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkHttpURL(null)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkHttpURL(NaN)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkHttpURL([])).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkHttpURL(new Error('error'))).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkHttpURL(5)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkHttpURL(true)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkHttpURL(false)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => checkHttpURL({})).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
    });

    it('should throw an uri error when uri has no scheme', function() {
      // scheme cannot be an empty string followinf parseURI behavior
      expect(() => checkHttpURL('/Users/dir/file.js')).to.throw(URIError).with.property('code', 'URI_MISSING_SCHEME');
      expect(() => checkHttpURL('://example.com')).to.throw(URIError).with.property('code', 'URI_MISSING_SCHEME');
      expect(() => checkHttpURL(':')).to.throw(URIError).with.property('code', 'URI_MISSING_SCHEME');
    });

    // if authority is present following parseURI behavior path will always be at least empty or start with /

    it('should throw an uri error when authority is not present and path starts with //', function() {
      expect(() => checkHttpURL('http://example.co.jp//path')).to.not.throw();
      expect(() => checkHttpURL('http:////path')).to.throw(URIError).with.property('code', 'URI_INVALID_PATH');
    });

    it('should not throw if an uri has at least a scheme and a path', function() {
      expect(() => checkHttpURL('http://example.com')).to.not.throw();
      expect(() => checkHttpURL('http://example.com/path')).to.not.throw();
    });

    // SAME TESTS FROM checkURI to check consistency
    it('should throw an uri error when scheme has invalid chars', function() {
      expect(() => checkHttpURL('htép://example.com')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME_CHAR');
      expect(() => checkHttpURL('ht°p://example.com')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME_CHAR');
    });

    it('should throw an uri error when userinfo has invalid characters', function() {
      expect(() => checkHttpURL('http://usér:pass@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_USERINFO_CHAR');
      expect(() => checkHttpURL('http://us€r:pass@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_USERINFO_CHAR');
      expect(() => checkHttpURL('http://user:pa[ss@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_USERINFO_CHAR');
      expect(() => checkHttpURL('http://usEr:pass@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_USERINFO_CHAR');
      expect(() => checkHttpURL('http://usEr:pasS@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_USERINFO_CHAR');
    });

    it('should throw an uri error when userinfo has invalid percent encodings', function() {
      expect(() => checkHttpURL('http://user%:pass@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkHttpURL('http://user%20%2z:pass@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkHttpURL('http://user:%acpass@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkHttpURL('http://user:pass%@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING');
      expect(() => checkHttpURL('http://user:pass%a@example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING');
    });

    it('should throw an uri error when host is not a valid ip', function() {
      expect(() => checkHttpURL('http://999.999.999.999:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_HOST');
      expect(() => checkHttpURL('http://3ffe:b00::1::a/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_HOST');
    });

    it('should throw an uri error when host is not a valid domain', function() {
      expect(() => checkHttpURL('http://aaaaaa:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_HOST');
      expect(() => checkHttpURL('http://com.com/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_HOST');
      expect(() => checkHttpURL('http://example..com/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_HOST');
      expect(() => checkHttpURL('http://xn--iñvalid.com/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_HOST');
    });

    it('should throw an uri error when port is not a number', function() {
      expect(() => checkHttpURL('http://example.com:80g42/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PORT');
    });

    it('should throw an uri error when invalid characters are found following scheme://authority', function() {
      expect(() => checkHttpURL('http://example.com:8042/over/thère?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/ôver/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over\\there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/\\over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over^there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/{over}/the`re?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over|there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over}/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over/{there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_CHAR');
    });

    it('should throw an uri error when invalid percent encodings are found following scheme://authority', function() {
      expect(() => checkHttpURL('http://example.com:8042/over/there%20%20%?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over/there%2?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over/there%Aa?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/%2cover/there%20%20?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/%a2over/there%20%20%?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/%gover/there%20%20%?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/%20over/there%20%20%?name=ferret%#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/%20over/there%20%20%?name=ferret%%#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over/there%20%20%?name=f%erret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose%')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING');
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose%A')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING');
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose%ef')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose%ac')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose%9')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING');
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose%8c')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose%a9')).to.throw(URIError).with.property('code', 'URI_INVALID_PERCENT_ENCODING_CHAR');
    });

    it('should not throw an uri error when unescaped but allowed sitemap characters are found following scheme://authority if sitemap is false', function() {
      expect(() => checkHttpURL('http://example.com:8042/it\'sover/there?name=ferret#nose', { sitemap: false })).to.not.throw();
      expect(() => checkHttpURL('http://example.com:8042/it"s%20over/there?name=ferret#nose', { sitemap: false })).to.not.throw();
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret&pseudo=superhero#nose', { sitemap: false })).to.not.throw();
    });

    it('should throw an uri error when unescaped sitemap characters are found following scheme://authority if sitemap is true', function() {
      expect(() => checkHttpURL('http://example.com:8042/it\'sover/there?name=ferret#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SITEMAP_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/it"s%20over/there?name=ferret#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SITEMAP_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret&pseudo=superhero#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SITEMAP_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret&pseudo=superhero#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SITEMAP_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over/&quotthere?name=ferret#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SITEMAP_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over&am/there?name=ferret#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SITEMAP_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret&apo#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SITEMAP_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret&g#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SITEMAP_CHAR');
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret&l;#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SITEMAP_CHAR');
    });

    // ADDITIONAL TESTS
    it('should not throw an uri error if a http sitemap uri is valid and sitemap is true', function() {
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', { sitemap: true })).to.not.throw();
      expect(() => checkHttpURL('http://example.com:8042/it&apos;sover/there?name=ferret#nose', { sitemap: true })).to.not.throw();
      expect(() => checkHttpURL('http://example.com:8042/it&quot;sover/there?name=ferret#nose', { sitemap: true })).to.not.throw();
      expect(() => checkHttpURL('http://example.com:8042/&lt;over&gt;/there?name=ferret#nose', { sitemap: true })).to.not.throw();
      expect(() => checkHttpURL('http://example.com:8042/&amp;sover/&gt;there&lt;?name=ferret#nose', { sitemap: true })).to.not.throw();
    });

    it('should not throw an uri error if a http sitemap uri is valid and sitemap is false', function() {
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', { sitemap: true })).to.not.throw();
      expect(() => checkHttpURL('http://example.com:8042/it&apos;sover/there?name=ferret#nose', { sitemap: false })).to.not.throw();
      expect(() => checkHttpURL('http://example.com:8042/it&quot;sover/there?name=ferret#nose', { sitemap: false })).to.not.throw();
      expect(() => checkHttpURL('http://example.com:8042/&lt;over&gt;/there?name=ferret#nose', { sitemap: false })).to.not.throw();
      expect(() => checkHttpURL('http://example.com:8042/&amp;sover/&gt;there&lt;?name=ferret#nose', { sitemap: false })).to.not.throw();
    });

    it('should not throw an uri error if a https sitemap uri is valid when https is true and sitemap is false', function() {
      expect(() => checkHttpURL('https://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', { https: true, sitemap: true })).to.not.throw();
      expect(() => checkHttpURL('https://example.com:8042/it&apos;sover/there?name=ferret#nose', { https: true, sitemap: false })).to.not.throw();
      expect(() => checkHttpURL('https://example.com:8042/it&quot;sover/there?name=ferret#nose', { https: true, sitemap: false })).to.not.throw();
      expect(() => checkHttpURL('https://example.com:8042/&lt;over&gt;/there?name=ferret#nose', { https: true, sitemap: false })).to.not.throw();
      expect(() => checkHttpURL('https://example.com:8042/&amp;sover/&gt;there&lt;?name=ferret#nose', { https: true, sitemap: false })).to.not.throw();
    });

    it('should not throw an uri error if a https sitemap uri is valid when https and sitemap are true', function() {
      expect(() => checkHttpURL('https://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', { https: true, sitemap: true })).to.not.throw();
      expect(() => checkHttpURL('https://example.com:8042/it&apos;sover/there?name=ferret#nose', { https: true, sitemap: true })).to.not.throw();
      expect(() => checkHttpURL('https://example.com:8042/it&quot;sover/there?name=ferret#nose', { https: true, sitemap: true })).to.not.throw();
      expect(() => checkHttpURL('https://example.com:8042/&lt;over&gt;/there?name=ferret#nose', { https: true, sitemap: true })).to.not.throw();
      expect(() => checkHttpURL('https://example.com:8042/&amp;sover/&gt;there&lt;?name=ferret#nose', { https: true, sitemap: true })).to.not.throw();
    });

    it('should not throw an uri error if a http or https sitemap uri is valid when web is true', function() {
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', { web: true, sitemap: true })).to.not.throw();
      expect(() => checkHttpURL('http://example.com:8042/it&apos;sover/there?name=ferret#nose', { web: true, sitemap: true })).to.not.throw();
      expect(() => checkHttpURL('http://example.com:8042/it&quot;sover/there?name=ferret#nose', { web: true, sitemap: true })).to.not.throw();
      expect(() => checkHttpURL('http://example.com:8042/&lt;over&gt;/there?name=ferret#nose', { web: true, sitemap: true })).to.not.throw();
      expect(() => checkHttpURL('http://example.com:8042/&amp;sover/&gt;there&lt;?name=ferret#nose', { web: true, sitemap: true })).to.not.throw();

      expect(() => checkHttpURL('https://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', { web: true, sitemap: true })).to.not.throw();
      expect(() => checkHttpURL('https://example.com:8042/it&apos;sover/there?name=ferret#nose', { web: true, sitemap: true })).to.not.throw();
      expect(() => checkHttpURL('https://example.com:8042/it&quot;sover/there?name=ferret#nose', { web: true, sitemap: true })).to.not.throw();
      expect(() => checkHttpURL('https://example.com:8042/&lt;over&gt;/there?name=ferret#nose', { web: true, sitemap: true })).to.not.throw();
      expect(() => checkHttpURL('https://example.com:8042/&amp;sover/&gt;there&lt;?name=ferret#nose', { web: true, sitemap: true })).to.not.throw();
    });

    it('should throw an uri error if scheme is not http when no option is provided', function() {
      expect(() => checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('f://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('c://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('https://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
    });

    it('should throw an uri error if scheme is not http when no option is provided', function() {
      expect(() => checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('f://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('c://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('https://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');

      expect(() => checkHttpURL('foo://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('ftp://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('f://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('c://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('https://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
    });

    it('should throw an uri error if scheme is not http when https and web options are false', function() {
      expect(() => checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose', { https: false, web: false })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose', { https: false, web: false })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('f://example.com:8042/over/there?name=ferret#nose', { https: false, web: false })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('c://example.com:8042/over/there?name=ferret#nose', { https: false, web: false })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('https://example.com:8042/over/there?name=ferret#nose', { https: false, web: false })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');

      expect(() => checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose', { https: false, web: false, sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose', { https: false, web: false, sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('f://example.com:8042/over/there?name=ferret#nose', { https: false, web: false, sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('c://example.com:8042/over/there?name=ferret#nose', { https: false, web: false, sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('https://example.com:8042/over/there?name=ferret#nose', { https: false, web: false, sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
    });

    it('should throw an uri error if authority is null for http, https and sitemap urls', function() {
      expect(() => checkHttpURL('http:isbn:0-486-27557-4')).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
      expect(() => checkHttpURL('https:isbn:0-486-27557-4', { https: true, web: false })).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
      expect(() => checkHttpURL('https:isbn:0-486-27557-4', { https: true, web: true })).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
      expect(() => checkHttpURL('https:isbn:0-486-27557-4', { https: false, web: true })).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
      expect(() => checkHttpURL('https:isbn:0-486-27557-4', { web: true })).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
      expect(() => checkHttpURL('http:///path', { web: true })).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');

      expect(() => checkHttpURL('http:isbn:0-486-27557-4', { sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
      expect(() => checkHttpURL('https:isbn:0-486-27557-4', { https: true, web: false, sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
      expect(() => checkHttpURL('https:isbn:0-486-27557-4', { https: true, web: true, sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
      expect(() => checkHttpURL('https:isbn:0-486-27557-4', { https: false, web: true, sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
      expect(() => checkHttpURL('https:isbn:0-486-27557-4', { web: true, sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
    });

    it('should throw an uri error if scheme is not http when https is false and web is true', function() {
      expect(() => checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose', { https: false, web: false })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose', { https: false, web: false })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('f://example.com:8042/over/there?name=ferret#nose', { https: false, web: false })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('c://example.com:8042/over/there?name=ferret#nose', { https: false, web: false })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('https://example.com:8042/over/there?name=ferret#nose', { https: false, web: false })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');

      expect(() => checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose', { https: false, web: false, sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose', { https: false, web: false, sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('f://example.com:8042/over/there?name=ferret#nose', { https: false, web: false, sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('c://example.com:8042/over/there?name=ferret#nose', { https: false, web: false, sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('https://example.com:8042/over/there?name=ferret#nose', { https: false, web: false, sitemap: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
    });

    it('should not throw an uri error when uri is a valid http url', function() {
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose')).to.not.throw();
      expect(() => checkHttpURL('http://example.com/')).to.not.throw();
      expect(() => checkHttpURL('http://user:pass@example.com:8042/over/there?name=ferret')).to.not.throw();
      expect(() => checkHttpURL('http://user:pass@example.com')).to.not.throw();
      expect(() => checkHttpURL('http://user:pass@example.com./')).to.not.throw();
      expect(() => checkHttpURL('http://user:pass@example.com.')).to.not.throw();
      expect(() => checkHttpURL('http://user:pass@example.com:8042/over/there#nose')).to.not.throw();
    });

    it('should throw an uri error if scheme is not https when https is true and web is false', function() {
      expect(() => checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose', { https: true, web: false })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose', { https: true, web: false })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('f://example.com:8042/over/there?name=ferret#nose', { https: true, web: false })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('c://example.com:8042/over/there?name=ferret#nose', { https: true, web: false })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose', { https: true, web: false })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');

      expect(() => checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose', { https: true, web: false, sitempa: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose', { https: true, web: false, sitempa: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('f://example.com:8042/over/there?name=ferret#nose', { https: true, web: false, sitempa: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('c://example.com:8042/over/there?name=ferret#nose', { https: true, web: false, sitempa: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose', { https: true, web: false, sitempa: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
    });

    it('should throw an uri error if scheme is not https when https is true and web is true', function() {
      expect(() => checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose', { https: true, web: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose', { https: true, web: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('f://example.com:8042/over/there?name=ferret#nose', { https: true, web: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('c://example.com:8042/over/there?name=ferret#nose', { https: true, web: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose', { https: true, web: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');

      expect(() => checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose', { https: true, web: true, sitempa: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose', { https: true, web: true, sitempa: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('f://example.com:8042/over/there?name=ferret#nose', { https: true, web: true, sitempa: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('c://example.com:8042/over/there?name=ferret#nose', { https: true, web: true, sitempa: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose', { https: true, web: true, sitempa: true })).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
    });

    it('should not throw an uri error when uri is a valid https url when https is true', function() {
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose'), { https: true }).to.not.throw();
      expect(() => checkHttpURL('https://example.com/', { https: true })).to.not.throw();
      expect(() => checkHttpURL('https://user:pass@example.com:8042/over/there?name=ferret', { https: true })).to.not.throw();
      expect(() => checkHttpURL('https://user:pass@example.com', { https: true })).to.not.throw();
      expect(() => checkHttpURL('https://user:pass@example.com./', { https: true })).to.not.throw();
      expect(() => checkHttpURL('https://user:pass@example.com.', { https: true })).to.not.throw();
      expect(() => checkHttpURL('https://user:pass@example.com:8042/over/there#nose', { https: true })).to.not.throw();
    });

    it('should not throw an uri error when uri is a valid http or https url when web is true', function() {
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose', { web: true })).to.not.throw();
      expect(() => checkHttpURL('http://example.com/', { web: true })).to.not.throw();
      expect(() => checkHttpURL('http://user:pass@example.com:8042/over/there?name=ferret', { web: true })).to.not.throw();
      expect(() => checkHttpURL('http://user:pass@example.com', { web: true })).to.not.throw();
      expect(() => checkHttpURL('http://user:pass@example.com./', { web: true })).to.not.throw();
      expect(() => checkHttpURL('http://user:pass@example.com.', { web: true })).to.not.throw();
      expect(() => checkHttpURL('http://user:pass@example.com:8042/over/there#nose', { web: true })).to.not.throw();

      expect(() => checkHttpURL('https://example.com:8042/over/there?name=ferret#nose', { web: true })).to.not.throw();
      expect(() => checkHttpURL('https://example.com/', { web: true })).to.not.throw();
      expect(() => checkHttpURL('https://user:pass@example.com:8042/over/there?name=ferret', { web: true })).to.not.throw();
      expect(() => checkHttpURL('https://user:pass@example.com', { web: true })).to.not.throw();
      expect(() => checkHttpURL('https://user:pass@example.com./', { web: true })).to.not.throw();
      expect(() => checkHttpURL('https://user:pass@example.com.', { web: true })).to.not.throw();
      expect(() => checkHttpURL('https://user:pass@example.com:8042/over/there#nose', { web: true })).to.not.throw();
    });

    it('should return a specific object if no errors were thrown', function() {
      let check = checkHttpURL('http://中文.com:8042/over/there?name=ferret#nose');
      expect(check).to.be.an('object').and.to.have.property('scheme', 'http');
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

      check = checkHttpURL('https://user:pass@example.com/', { https: true });
      expect(check).to.be.an('object').and.to.have.property('scheme', 'https');
      expect(check).to.be.an('object').and.to.have.property('authority', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('authorityPunydecoded', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('userinfo', 'user:pass');
      expect(check).to.be.an('object').and.to.have.property('host', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('hostPunydecoded', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('port', null);
      expect(check).to.be.an('object').and.to.have.property('path', '/');
      expect(check).to.be.an('object').and.to.have.property('query', null);
      expect(check).to.be.an('object').and.to.have.property('fragment', null);
      expect(check).to.be.an('object').and.to.have.property('valid', true);

      check = checkHttpURL('https://user:pass@example.com/', { web: true });
      expect(check).to.be.an('object').and.to.have.property('scheme', 'https');
      expect(check).to.be.an('object').and.to.have.property('authority', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('authorityPunydecoded', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('userinfo', 'user:pass');
      expect(check).to.be.an('object').and.to.have.property('host', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('hostPunydecoded', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('port', null);
      expect(check).to.be.an('object').and.to.have.property('path', '/');
      expect(check).to.be.an('object').and.to.have.property('query', null);
      expect(check).to.be.an('object').and.to.have.property('fragment', null);
      expect(check).to.be.an('object').and.to.have.property('valid', true);

      check = checkHttpURL('https://中文.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', { https: true, sitemap: true });
      expect(check).to.be.an('object').and.to.have.property('scheme', 'https');
      expect(check).to.be.an('object').and.to.have.property('authority', 'xn--fiq228c.com:8042');
      expect(check).to.be.an('object').and.to.have.property('authorityPunydecoded', '中文.com:8042');
      expect(check).to.be.an('object').and.to.have.property('userinfo', null);
      expect(check).to.be.an('object').and.to.have.property('host', 'xn--fiq228c.com');
      expect(check).to.be.an('object').and.to.have.property('hostPunydecoded', '中文.com');
      expect(check).to.be.an('object').and.to.have.property('port', 8042);
      expect(check).to.be.an('object').and.to.have.property('path', '/over/there');
      expect(check).to.be.an('object').and.to.have.property('query', 'name=ferret&amp;pseudo=superhero');
      expect(check).to.be.an('object').and.to.have.property('fragment', 'nose');
      expect(check).to.be.an('object').and.to.have.property('valid', true);
    });
  });

  context('when using checkHttpsURL that uses checkHttpURL', function() {
    it('should throw an uri error if scheme is not https', function() {
      expect(() => checkHttpsURL('foo://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpsURL('ftp://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpsURL('f://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpsURL('c://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpsURL('http://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
    });

    it('should throw an uri error if authority is null', function() {
      expect(() => checkHttpsURL('https:isbn:0-486-27557-4')).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
    });

    it('should not throw an uri error when uri is a valid https url', function() {
      expect(() => checkHttpsURL('https://example.com:8042/over/there?name=ferret#nose')).to.not.throw();
      expect(() => checkHttpsURL('https://example.com/')).to.not.throw();
      expect(() => checkHttpsURL('https://user:pass@example.com:8042/over/there?name=ferret')).to.not.throw();
      expect(() => checkHttpsURL('https://user:pass@example.com')).to.not.throw();
      expect(() => checkHttpsURL('https://user:pass@example.com./')).to.not.throw();
      expect(() => checkHttpsURL('https://user:pass@example.com.')).to.not.throw();
      expect(() => checkHttpsURL('https://user:pass@example.com:8042/over/there#nose')).to.not.throw();
    });

    it('should return a specific object if no errors were thrown', function() {
      let check = checkHttpsURL('https://user:pass@example.com/');
      expect(check).to.be.an('object').and.to.have.property('scheme', 'https');
      expect(check).to.be.an('object').and.to.have.property('authority', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('authorityPunydecoded', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('userinfo', 'user:pass');
      expect(check).to.be.an('object').and.to.have.property('host', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('hostPunydecoded', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('port', null);
      expect(check).to.be.an('object').and.to.have.property('path', '/');
      expect(check).to.be.an('object').and.to.have.property('query', null);
      expect(check).to.be.an('object').and.to.have.property('fragment', null);
      expect(check).to.be.an('object').and.to.have.property('valid', true);

      check = checkHttpsURL('https://中文.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose');
      expect(check).to.be.an('object').and.to.have.property('scheme', 'https');
      expect(check).to.be.an('object').and.to.have.property('authority', 'xn--fiq228c.com:8042');
      expect(check).to.be.an('object').and.to.have.property('authorityPunydecoded', '中文.com:8042');
      expect(check).to.be.an('object').and.to.have.property('userinfo', null);
      expect(check).to.be.an('object').and.to.have.property('host', 'xn--fiq228c.com');
      expect(check).to.be.an('object').and.to.have.property('hostPunydecoded', '中文.com');
      expect(check).to.be.an('object').and.to.have.property('port', 8042);
      expect(check).to.be.an('object').and.to.have.property('path', '/over/there');
      expect(check).to.be.an('object').and.to.have.property('query', 'name=ferret&amp;pseudo=superhero');
      expect(check).to.be.an('object').and.to.have.property('fragment', 'nose');
      expect(check).to.be.an('object').and.to.have.property('valid', true);
    });
  });

  context('when using checkHttpSitemapURL that uses checkHttpURL', function() {
    it('should not throw an uri error if a http sitemap uri is valid', function() {
      expect(() => checkHttpSitemapURL('http://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose')).to.not.throw();
      expect(() => checkHttpSitemapURL('http://example.com:8042/it&apos;sover/there?name=ferret#nose')).to.not.throw();
      expect(() => checkHttpSitemapURL('http://example.com:8042/it&quot;sover/there?name=ferret#nose')).to.not.throw();
      expect(() => checkHttpSitemapURL('http://example.com:8042/&lt;over&gt;/there?name=ferret#nose')).to.not.throw();
      expect(() => checkHttpSitemapURL('http://example.com:8042/&amp;sover/&gt;there&lt;?name=ferret#nose')).to.not.throw();
    });

    it('should throw an uri error if scheme is not http', function() {
      expect(() => checkHttpSitemapURL('foo://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpSitemapURL('ftp://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpSitemapURL('f://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpSitemapURL('c://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpSitemapURL('https://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
    });

    it('should throw an uri error if authority is null', function() {
      expect(() => checkHttpSitemapURL('http:isbn:0-486-27557-4')).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
    });

    it('should not throw an uri error when uri is a valid http url with no characters to escape', function() {
      expect(() => checkHttpSitemapURL('http://example.com:8042/over/there?name=ferret#nose')).to.not.throw();
      expect(() => checkHttpSitemapURL('http://example.com/')).to.not.throw();
      expect(() => checkHttpSitemapURL('http://user:pass@example.com:8042/over/there?name=ferret')).to.not.throw();
      expect(() => checkHttpSitemapURL('http://user:pass@example.com')).to.not.throw();
      expect(() => checkHttpSitemapURL('http://user:pass@example.com./')).to.not.throw();
      expect(() => checkHttpSitemapURL('http://user:pass@example.com.')).to.not.throw();
      expect(() => checkHttpSitemapURL('http://user:pass@example.com:8042/over/there#nose')).to.not.throw();
    });

    it('should return a specific object if no errors were thrown', function() {
      let check = checkHttpSitemapURL('http://中文.com:8042/over/there?name=ferret#nose');
      expect(check).to.be.an('object').and.to.have.property('scheme', 'http');
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

      check = checkHttpSitemapURL('http://user:pass@example.com/there?a=5&amp;b=9');
      expect(check).to.be.an('object').and.to.have.property('scheme', 'http');
      expect(check).to.be.an('object').and.to.have.property('authority', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('authorityPunydecoded', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('userinfo', 'user:pass');
      expect(check).to.be.an('object').and.to.have.property('host', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('hostPunydecoded', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('port', null);
      expect(check).to.be.an('object').and.to.have.property('path', '/there');
      expect(check).to.be.an('object').and.to.have.property('query', 'a=5&amp;b=9');
      expect(check).to.be.an('object').and.to.have.property('fragment', null);
      expect(check).to.be.an('object').and.to.have.property('valid', true);
    });
  });

  context('when using checkHttpsSitemapURL that uses checkHttpURL', function() {
    it('should not throw an uri error if a https sitemap uri is valid', function() {
      expect(() => checkHttpsSitemapURL('https://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose')).to.not.throw();
      expect(() => checkHttpsSitemapURL('https://example.com:8042/it&apos;sover/there?name=ferret#nose')).to.not.throw();
      expect(() => checkHttpsSitemapURL('https://example.com:8042/it&quot;sover/there?name=ferret#nose')).to.not.throw();
      expect(() => checkHttpsSitemapURL('https://example.com:8042/&lt;over&gt;/there?name=ferret#nose')).to.not.throw();
      expect(() => checkHttpsSitemapURL('https://example.com:8042/&amp;sover/&gt;there&lt;?name=ferret#nose')).to.not.throw();
    });

    it('should throw an uri error if scheme is not https', function() {
      expect(() => checkHttpsSitemapURL('foo://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpsSitemapURL('ftp://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpsSitemapURL('f://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpsSitemapURL('c://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkHttpsSitemapURL('http://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
    });

    it('should throw an uri error if authority is null', function() {
      expect(() => checkHttpsSitemapURL('https:isbn:0-486-27557-4')).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
    });

    it('should not throw an uri error when uri is a valid https url with no characters to escape', function() {
      expect(() => checkHttpsSitemapURL('https://example.com:8042/over/there?name=ferret#nose')).to.not.throw();
      expect(() => checkHttpsSitemapURL('https://example.com/')).to.not.throw();
      expect(() => checkHttpsSitemapURL('https://user:pass@example.com:8042/over/there?name=ferret')).to.not.throw();
      expect(() => checkHttpsSitemapURL('https://user:pass@example.com')).to.not.throw();
      expect(() => checkHttpsSitemapURL('https://user:pass@example.com./')).to.not.throw();
      expect(() => checkHttpsSitemapURL('https://user:pass@example.com.')).to.not.throw();
      expect(() => checkHttpsSitemapURL('https://user:pass@example.com:8042/over/there#nose')).to.not.throw();
    });

    it('should return a specific object if no errors were thrown', function() {
      let check = checkHttpsSitemapURL('https://中文.com:8042/over/there?name=ferret#nose');
      expect(check).to.be.an('object').and.to.have.property('scheme', 'https');
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

      check = checkHttpsSitemapURL('https://user:pass@example.com/there?a=5&amp;b=9');
      expect(check).to.be.an('object').and.to.have.property('scheme', 'https');
      expect(check).to.be.an('object').and.to.have.property('authority', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('authorityPunydecoded', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('userinfo', 'user:pass');
      expect(check).to.be.an('object').and.to.have.property('host', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('hostPunydecoded', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('port', null);
      expect(check).to.be.an('object').and.to.have.property('path', '/there');
      expect(check).to.be.an('object').and.to.have.property('query', 'a=5&amp;b=9');
      expect(check).to.be.an('object').and.to.have.property('fragment', null);
      expect(check).to.be.an('object').and.to.have.property('valid', true);
    });
  });

  context('when using checkWebURL that uses checkHttpURL', function() {
    it('should throw an uri error if scheme is not http or https', function() {
      expect(() => checkWebURL('foo://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkWebURL('ftp://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkWebURL('f://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkWebURL('c://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
    });

    it('should throw an uri error if authority is null', function() {
      expect(() => checkWebURL('http:isbn:0-486-27557-4')).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
      expect(() => checkWebURL('http:///path', { web: true })).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
      expect(() => checkWebURL('https:isbn:0-486-27557-4')).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
      expect(() => checkWebURL('https:///path', { web: true })).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
    });

    it('should not throw an uri error when uri is a valid http url', function() {
      expect(() => checkWebURL('http://example.com:8042/over/there?name=ferret#nose')).to.not.throw();
      expect(() => checkWebURL('http://example.com/')).to.not.throw();
      expect(() => checkWebURL('http://user:pass@example.com:8042/over/there?name=ferret')).to.not.throw();
      expect(() => checkWebURL('http://user:pass@example.com')).to.not.throw();
      expect(() => checkWebURL('http://user:pass@example.com./')).to.not.throw();
      expect(() => checkWebURL('http://user:pass@example.com.')).to.not.throw();
      expect(() => checkWebURL('http://user:pass@example.com:8042/over/there#nose')).to.not.throw();
    });

    it('should not throw an uri error when uri is a valid https url', function() {
      expect(() => checkWebURL('http://example.com:8042/over/there?name=ferret#nose'), { https: true }).to.not.throw();
      expect(() => checkWebURL('https://example.com/', { https: true })).to.not.throw();
      expect(() => checkWebURL('https://user:pass@example.com:8042/over/there?name=ferret', { https: true })).to.not.throw();
      expect(() => checkWebURL('https://user:pass@example.com', { https: true })).to.not.throw();
      expect(() => checkWebURL('https://user:pass@example.com./', { https: true })).to.not.throw();
      expect(() => checkWebURL('https://user:pass@example.com.', { https: true })).to.not.throw();
      expect(() => checkWebURL('https://user:pass@example.com:8042/over/there#nose', { https: true })).to.not.throw();
    });

    it('should return a specific object if no errors were thrown', function() {
      let check = checkWebURL('http://中文.com:8042/over/there?name=ferret#nose');
      expect(check).to.be.an('object').and.to.have.property('scheme', 'http');
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

      check = checkWebURL('https://user:pass@example.com/', { https: true });
      expect(check).to.be.an('object').and.to.have.property('scheme', 'https');
      expect(check).to.be.an('object').and.to.have.property('authority', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('authorityPunydecoded', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('userinfo', 'user:pass');
      expect(check).to.be.an('object').and.to.have.property('host', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('hostPunydecoded', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('port', null);
      expect(check).to.be.an('object').and.to.have.property('path', '/');
      expect(check).to.be.an('object').and.to.have.property('query', null);
      expect(check).to.be.an('object').and.to.have.property('fragment', null);
      expect(check).to.be.an('object').and.to.have.property('valid', true);

      check = checkWebURL('https://user:pass@example.com/', { web: true });
      expect(check).to.be.an('object').and.to.have.property('scheme', 'https');
      expect(check).to.be.an('object').and.to.have.property('authority', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('authorityPunydecoded', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('userinfo', 'user:pass');
      expect(check).to.be.an('object').and.to.have.property('host', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('hostPunydecoded', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('port', null);
      expect(check).to.be.an('object').and.to.have.property('path', '/');
      expect(check).to.be.an('object').and.to.have.property('query', null);
      expect(check).to.be.an('object').and.to.have.property('fragment', null);
      expect(check).to.be.an('object').and.to.have.property('valid', true);

      check = checkWebURL('https://中文.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', { https: true, sitemap: true });
      expect(check).to.be.an('object').and.to.have.property('scheme', 'https');
      expect(check).to.be.an('object').and.to.have.property('authority', 'xn--fiq228c.com:8042');
      expect(check).to.be.an('object').and.to.have.property('authorityPunydecoded', '中文.com:8042');
      expect(check).to.be.an('object').and.to.have.property('userinfo', null);
      expect(check).to.be.an('object').and.to.have.property('host', 'xn--fiq228c.com');
      expect(check).to.be.an('object').and.to.have.property('hostPunydecoded', '中文.com');
      expect(check).to.be.an('object').and.to.have.property('port', 8042);
      expect(check).to.be.an('object').and.to.have.property('path', '/over/there');
      expect(check).to.be.an('object').and.to.have.property('query', 'name=ferret&amp;pseudo=superhero');
      expect(check).to.be.an('object').and.to.have.property('fragment', 'nose');
      expect(check).to.be.an('object').and.to.have.property('valid', true);
    });
  });

  context('when using checkSitemapURL that uses checkHttpURL', function() {
    it('should not throw an uri error if a http sitemap uri is valid', function() {
      expect(() => checkSitemapURL('http://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose')).to.not.throw();
      expect(() => checkSitemapURL('http://example.com:8042/it&apos;sover/there?name=ferret#nose')).to.not.throw();
      expect(() => checkSitemapURL('http://example.com:8042/it&quot;sover/there?name=ferret#nose')).to.not.throw();
      expect(() => checkSitemapURL('http://example.com:8042/&lt;over&gt;/there?name=ferret#nose')).to.not.throw();
      expect(() => checkSitemapURL('http://example.com:8042/&amp;sover/&gt;there&lt;?name=ferret#nose')).to.not.throw();
    });

    it('should not throw an uri error if a https sitemap uri is valid', function() {
      expect(() => checkHttpsSitemapURL('https://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose')).to.not.throw();
      expect(() => checkHttpsSitemapURL('https://example.com:8042/it&apos;sover/there?name=ferret#nose')).to.not.throw();
      expect(() => checkHttpsSitemapURL('https://example.com:8042/it&quot;sover/there?name=ferret#nose')).to.not.throw();
      expect(() => checkHttpsSitemapURL('https://example.com:8042/&lt;over&gt;/there?name=ferret#nose')).to.not.throw();
      expect(() => checkHttpsSitemapURL('https://example.com:8042/&amp;sover/&gt;there&lt;?name=ferret#nose')).to.not.throw();
    });

    it('should throw an uri error if scheme is not http or https', function() {
      expect(() => checkSitemapURL('foo://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkSitemapURL('ftp://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkSitemapURL('f://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => checkSitemapURL('c://example.com:8042/over/there?name=ferret#nose')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
    });

    it('should throw an uri error if authority is null', function() {
      expect(() => checkSitemapURL('http:isbn:0-486-27557-4')).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
      expect(() => checkSitemapURL('https:isbn:0-486-27557-4')).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
    });

    it('should not throw an uri error when uri is a valid http or https url with no characters to escape', function() {
      expect(() => checkSitemapURL('http://example.com:8042/over/there?name=ferret#nose')).to.not.throw();
      expect(() => checkSitemapURL('http://example.com/')).to.not.throw();
      expect(() => checkSitemapURL('http://user:pass@example.com:8042/over/there?name=ferret')).to.not.throw();
      expect(() => checkSitemapURL('http://user:pass@example.com')).to.not.throw();
      expect(() => checkSitemapURL('http://user:pass@example.com./')).to.not.throw();
      expect(() => checkSitemapURL('http://user:pass@example.com.')).to.not.throw();
      expect(() => checkSitemapURL('http://user:pass@example.com:8042/over/there#nose')).to.not.throw();

      expect(() => checkSitemapURL('https://example.com:8042/over/there?name=ferret#nose')).to.not.throw();
      expect(() => checkSitemapURL('https://example.com/')).to.not.throw();
      expect(() => checkSitemapURL('https://user:pass@example.com:8042/over/there?name=ferret')).to.not.throw();
      expect(() => checkSitemapURL('https://user:pass@example.com')).to.not.throw();
      expect(() => checkSitemapURL('https://user:pass@example.com./')).to.not.throw();
      expect(() => checkSitemapURL('https://user:pass@example.com.')).to.not.throw();
      expect(() => checkSitemapURL('https://user:pass@example.com:8042/over/there#nose')).to.not.throw();
    });

    it('should return a specific object if no errors were thrown', function() {
      let check = checkSitemapURL('http://中文.com:8042/over/there?name=ferret#nose');
      expect(check).to.be.an('object').and.to.have.property('scheme', 'http');
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

      check = checkSitemapURL('http://user:pass@example.com/there?a=5&amp;b=9');
      expect(check).to.be.an('object').and.to.have.property('scheme', 'http');
      expect(check).to.be.an('object').and.to.have.property('authority', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('authorityPunydecoded', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('userinfo', 'user:pass');
      expect(check).to.be.an('object').and.to.have.property('host', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('hostPunydecoded', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('port', null);
      expect(check).to.be.an('object').and.to.have.property('path', '/there');
      expect(check).to.be.an('object').and.to.have.property('query', 'a=5&amp;b=9');
      expect(check).to.be.an('object').and.to.have.property('fragment', null);
      expect(check).to.be.an('object').and.to.have.property('valid', true);

      check = checkHttpsSitemapURL('https://中文.com:8042/over/there?name=ferret#nose');
      expect(check).to.be.an('object').and.to.have.property('scheme', 'https');
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

      check = checkHttpsSitemapURL('https://user:pass@example.com/there?a=5&amp;b=9');
      expect(check).to.be.an('object').and.to.have.property('scheme', 'https');
      expect(check).to.be.an('object').and.to.have.property('authority', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('authorityPunydecoded', 'user:pass@example.com');
      expect(check).to.be.an('object').and.to.have.property('userinfo', 'user:pass');
      expect(check).to.be.an('object').and.to.have.property('host', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('hostPunydecoded', 'example.com');
      expect(check).to.be.an('object').and.to.have.property('port', null);
      expect(check).to.be.an('object').and.to.have.property('path', '/there');
      expect(check).to.be.an('object').and.to.have.property('query', 'a=5&amp;b=9');
      expect(check).to.be.an('object').and.to.have.property('fragment', null);
      expect(check).to.be.an('object').and.to.have.property('valid', true);
    });
  });

  context('when using encodeURIString', function() {
    it('should return an empty string when uri is not a string', function() {
      expect(encodeURIString()).to.be.a('string').and.to.equals('');
      expect(encodeURIString(undefined)).to.be.a('string').and.to.equals('');
      expect(encodeURIString(null)).to.be.a('string').and.to.equals('');
      expect(encodeURIString(NaN)).to.be.a('string').and.to.equals('');
      expect(encodeURIString([])).to.be.a('string').and.to.equals('');
      expect(encodeURIString(new Error('error'))).to.be.a('string').and.to.equals('');
      expect(encodeURIString(5)).to.be.a('string').and.to.equals('');
      expect(encodeURIString(true)).to.be.a('string').and.to.equals('');
      expect(encodeURIString(false)).to.be.a('string').and.to.equals('');
      expect(encodeURIString({})).to.be.a('string').and.to.equals('');
    });

    it('should return a lowercased string', function() {
      expect(encodeURIString('ABCDEF')).to.be.a('string').and.to.equals('abcdef');
      expect(encodeURIString('ABcDEF')).to.be.a('string').and.to.equals('abcdef');
      expect(encodeURIString('aBcDEF')).to.be.a('string').and.to.equals('abcdef');
      expect(encodeURIString('aBcDEf')).to.be.a('string').and.to.equals('abcdef');
      expect(encodeURIString('abcdef')).to.be.a('string').and.to.equals('abcdef');
    });

    it('should return a string with the exact same characters if allowed, by default', function() {
      expect(encodeURIString(az)).to.be.a('string').and.to.equals(az);
      expect(encodeURIString(digits)).to.be.a('string').and.to.equals(digits);
      expect(encodeURIString(allowed.replace('%', ''))).to.be.a('string').and.to.equals(allowed.replace('%', ''));

      expect(encodeURIString(az, { sitemap: false })).to.be.a('string').and.to.equals(az);
      expect(encodeURIString(digits, { sitemap: false })).to.be.a('string').and.to.equals(digits);
      expect(encodeURIString(allowed.replace('%', ''), { sitemap: false })).to.be.a('string').and.to.equals(allowed.replace('%', ''));
    });

    it('should return a string with the exact same characters if allowed and to not be escaped when sitemap is true', function() {
      const unescaped = allowed.replace(/[%&'"]/g, '');

      expect(encodeURIString(az, { sitemap: true })).to.be.a('string').and.to.equals(az);
      expect(encodeURIString(digits, { sitemap: true })).to.be.a('string').and.to.equals(digits);
      expect(encodeURIString(unescaped, { sitemap: true })).to.be.a('string').and.to.equals(unescaped);
      expect(encodeURIString('<>', { sitemap: true })).to.be.a('string').and.to.equals('&lt;&gt;');
    });

    it('should return a string with percent encoded characters if not allowed, by default', function() {
      expect(encodeURIString(AZ)).to.be.a('string').and.to.equals(az);
      expect(encodeURIString(disallowed)).to.be.a('string').and.to.equals('%5C%5E%60%7B%7C%7D');
      expect(encodeURIString('<>')).to.be.a('string').and.to.equals('%3C%3E');
      expect(encodeURIString(disallowedOtherChars)).to.be.a('string').and.to.equals('%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3');

      expect(encodeURIString(AZ, { sitemap: false })).to.be.a('string').and.to.equals(az);
      expect(encodeURIString(disallowed, { sitemap: false })).to.be.a('string').and.to.equals('%5C%5E%60%7B%7C%7D');
      expect(encodeURIString('<>', { sitemap: false })).to.be.a('string').and.to.equals('%3C%3E');
      expect(encodeURIString(disallowedOtherChars, { sitemap: false })).to.be.a('string').and.to.equals('%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3');
    });

    it('should return a string with percent encoded characters if not allowed when sitemap is true', function() {
      expect(encodeURIString(AZ, { sitemap: true })).to.be.a('string').and.to.equals(az);
      expect(encodeURIString(disallowed, { sitemap: true })).to.be.a('string').and.to.equals('%5C%5E%60%7B%7C%7D');
      expect(encodeURIString('<>', { sitemap: true })).to.be.a('string').and.to.equals('&lt;&gt;');
      expect(encodeURIString(disallowedOtherChars, { sitemap: true })).to.be.a('string').and.to.equals('%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3');
    });

    it('should return a string with escaped characters when sitemap is true', function() {
      expect(encodeURIString('&\'"<>', { sitemap: true })).to.be.a('string').and.to.equals('&amp;&apos;&quot;&lt;&gt;');
      expect(encodeURIString('&\'"', { sitemap: false })).to.be.a('string').and.to.equals('&\'"');
      expect(encodeURIString('<>', { sitemap: false })).to.be.a('string').and.to.equals('%3C%3E');
    });
  });

  context('when using decodeURIString', function() {
    it('should return an empty string when uri is not a string', function() {
      expect(decodeURIString()).to.be.a('string').and.to.equals('');
      expect(decodeURIString(undefined)).to.be.a('string').and.to.equals('');
      expect(decodeURIString(null)).to.be.a('string').and.to.equals('');
      expect(decodeURIString(NaN)).to.be.a('string').and.to.equals('');
      expect(decodeURIString([])).to.be.a('string').and.to.equals('');
      expect(decodeURIString(new Error('error'))).to.be.a('string').and.to.equals('');
      expect(decodeURIString(5)).to.be.a('string').and.to.equals('');
      expect(decodeURIString(true)).to.be.a('string').and.to.equals('');
      expect(decodeURIString(false)).to.be.a('string').and.to.equals('');
      expect(decodeURIString({})).to.be.a('string').and.to.equals('');
    });

    it('should not return a lowercased string', function() {
      expect(decodeURIString('ABCDEF')).to.be.a('string').and.to.not.equals('abcdef');
      expect(decodeURIString('ABcDEF')).to.be.a('string').and.to.not.equals('abcdef');
      expect(decodeURIString('aBcDEF')).to.be.a('string').and.to.not.equals('abcdef');
      expect(decodeURIString('aBcDEf')).to.be.a('string').and.to.not.equals('abcdef');
      expect(decodeURIString('abcdef')).to.be.a('string').and.to.equals('abcdef');
      expect(decodeURIString(AZ)).to.be.a('string').and.to.equals(AZ);
    });

    it('should return a string with the exact same characters if allowed, by default', function() {
      expect(decodeURIString(az)).to.be.a('string').and.to.equals(az);
      expect(decodeURIString(digits)).to.be.a('string').and.to.equals(digits);
      expect(decodeURIString(allowed.replace('%', ''))).to.be.a('string').and.to.equals(allowed.replace('%', ''));

      expect(decodeURIString(az, { sitemap: false })).to.be.a('string').and.to.equals(az);
      expect(decodeURIString(digits, { sitemap: false })).to.be.a('string').and.to.equals(digits);
      expect(decodeURIString(allowed.replace('%', ''), { sitemap: false })).to.be.a('string').and.to.equals(allowed.replace('%', ''));
    });

    it('should return a string with the exact same characters if allowed when sitemap is true', function() {
      const unescaped = allowed.replace(/[%&'"]/g, '');

      expect(decodeURIString(az, { sitemap: true })).to.be.a('string').and.to.equals(az);
      expect(decodeURIString(digits, { sitemap: true })).to.be.a('string').and.to.equals(digits);
      expect(decodeURIString(allowed.replace('%', ''), { sitemap: true })).to.be.a('string').and.to.equals(allowed.replace('%', ''));
      expect(decodeURIString('<>', { sitemap: true })).to.be.a('string').and.to.equals('<>');
    });

    it('should return an empty string if percent encoded characters are wrong whether sitemap option is true or false', function() {
      expect(decodeURIString('%')).to.be.a('string').and.to.equals('');
      expect(decodeURIString('%A')).to.be.a('string').and.to.equals('');
      expect(decodeURIString('%20%%A')).to.be.a('string').and.to.equals('');
      expect(decodeURIString('%20%9')).to.be.a('string').and.to.equals('');

      expect(decodeURIString('%', { sitemap: false })).to.be.a('string').and.to.equals('');
      expect(decodeURIString('%A', { sitemap: false })).to.be.a('string').and.to.equals('');
      expect(decodeURIString('%20%%At', { sitemap: false })).to.be.a('string').and.to.equals('');
      expect(decodeURIString('%20%9', { sitemap: false })).to.be.a('string').and.to.equals('');

      expect(decodeURIString('%', { sitemap: true })).to.be.a('string').and.to.equals('');
      expect(decodeURIString('%A', { sitemap: true })).to.be.a('string').and.to.equals('');
      expect(decodeURIString('%20%%Yx', { sitemap: true })).to.be.a('string').and.to.equals('');
      expect(decodeURIString('a%20%9', { sitemap: true })).to.be.a('string').and.to.equals('');
    });

    it('should return a string with percent encoded characters decoded whether sitemap option is true or false', function() {
      expect(decodeURIString('%5C%5E%60%7B%7C%7D')).to.be.a('string').and.to.equals(disallowed);
      expect(decodeURIString('%3C%3E')).to.be.a('string').and.to.equals('<>');
      expect(decodeURIString('%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3')).to.be.a('string').and.to.equals(disallowedOtherChars);

      expect(decodeURIString('%5C%5E%60%7B%7C%7D', { sitemap: false })).to.be.a('string').and.to.equals(disallowed);
      expect(decodeURIString('%3C%3E', { sitemap: false })).to.be.a('string').and.to.equals('<>');
      expect(decodeURIString('%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3', { sitemap: false })).to.be.a('string').and.to.equals(disallowedOtherChars);

      expect(decodeURIString('%5C%5E%60%7B%7C%7D', { sitemap: true })).to.be.a('string').and.to.equals(disallowed);
      expect(decodeURIString('%3C%3E', { sitemap: true })).to.be.a('string').and.to.equals('<>');
      expect(decodeURIString('%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3', { sitemap: true })).to.be.a('string').and.to.equals(disallowedOtherChars);
    });

    it('should return a string with unescaped characters when sitemap is true', function() {
      expect(decodeURIString('&amp;&apos;&quot;&lt;&gt;', { sitemap: true })).to.be.a('string').and.to.equals('&\'"<>');
      expect(decodeURIString('http://www.example.co.jp/&lt;it&apos;s%20there&gt;?name=thx&amp;pseudo=superhero#anchor', { sitemap: true })).to.be.a('string').and.to.equals('http://www.example.co.jp/<it\'s there>?name=thx&pseudo=superhero#anchor');
      expect(decodeURIString('&\'"', { sitemap: false })).to.be.a('string').and.to.equals('&\'"');
      expect(decodeURIString('%3C%3E', { sitemap: false })).to.be.a('string').and.to.equals('<>');
    });
  });

  context('when using encodeWebURL that uses checkURISyntax and encodeURIString', function() {
    it('should throw an uri error when uri is not a string', function() {
      expect(() => encodeWebURL()).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => encodeWebURL(undefined)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => encodeWebURL(null)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => encodeWebURL(NaN)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => encodeWebURL([])).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => encodeWebURL(new Error('error'))).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => encodeWebURL(5)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => encodeWebURL(true)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => encodeWebURL(false)).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
      expect(() => encodeWebURL({})).to.throw(URIError).with.property('code', 'URI_INVALID_TYPE');
    });

    it('should throw an uri error when uri has no scheme', function() {
      // scheme cannot be an empty string followinf parseURI behavior
      expect(() => encodeWebURL('/Users/dir/file.js')).to.throw(URIError).with.property('code', 'URI_MISSING_SCHEME');
      expect(() => encodeWebURL('://example.com')).to.throw(URIError).with.property('code', 'URI_MISSING_SCHEME');
      expect(() => encodeWebURL(':')).to.throw(URIError).with.property('code', 'URI_MISSING_SCHEME');
    });

    it('should throw an uri error if scheme is not http or https', function() {
      expect(() => encodeWebURL('httpp://www.example.com')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => encodeWebURL('htp://www.example.com')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
    });

    it('should throw an uri error if host to encode is not valid', function() {
      expect(() => encodeWebURL('http://xn--iñvalid.com')).to.throw(URIError).with.property('code', 'URI_INVALID_HOST');
    });

    it('should throw an uri error if port to encode is not valid', function() {
      expect(() => encodeWebURL('http://example.com:80g80')).to.throw(URIError).with.property('code', 'URI_INVALID_PORT');
    });

    it('should throw an uri error if authority is null', function() {
      expect(() => encodeWebURL('http:isbn:0-486-27557-4')).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
      expect(() => encodeWebURL('https:isbn:0-486-27557-4')).to.throw(URIError).with.property('code', 'URI_INVALID_AUTHORITY');
    });

    it('should not throw an uri error if uri to encode has letters in uppercase', function() {
      expect(() => encodeWebURL('http://example.com/OVER/there')).to.not.throw();
      expect(() => encodeWebURL('HTTP://example.com/OVER/there')).to.not.throw();
      expect(() => encodeWebURL('http://EXAMPLE.com/OVER/there')).to.not.throw();
      expect(() => encodeWebURL('http://USER:PASS@example.com/OVER/there')).to.not.throw();
      expect(() => encodeWebURL('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE')).to.not.throw();

      expect(() => encodeWebURL('http://example.com/OVER/there', { sitemap: true })).to.not.throw();
      expect(() => encodeWebURL('HTTP://example.com/OVER/there', { sitemap: true })).to.not.throw();
      expect(() => encodeWebURL('http://EXAMPLE.com/OVER/there', { sitemap: true })).to.not.throw();
      expect(() => encodeWebURL('http://USER:PASS@example.com/OVER/there', { sitemap: true })).to.not.throw();
      expect(() => encodeWebURL('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE', { sitemap: true })).to.not.throw();
    });

    it('should not throw an uri error if uri to encode has special sitemap characters', function() {
      expect(() => encodeWebURL('http://example.com/OVER/<there>')).to.not.throw();
      expect(() => encodeWebURL('HTTP://example.com/OVER/<there')).to.not.throw();
      expect(() => encodeWebURL('http://EXAMPLE.com/OVER/there>')).to.not.throw();

      expect(() => encodeWebURL('http://example.com/OVER/<there>', { sitemap: false })).to.not.throw();
      expect(() => encodeWebURL('HTTP://example.com/OVER/<there', { sitemap: false })).to.not.throw();
      expect(() => encodeWebURL('http://EXAMPLE.com/OVER/there>', { sitemap: false })).to.not.throw();
    });

    it('should not throw an uri error if uri to encode has special sitemap characters when sitemap is true', function() {
      expect(() => encodeWebURL('http://example.com/OVER/<there>', { sitemap: true })).to.not.throw();
      expect(() => encodeWebURL('HTTP://example.com/OVER/<there', { sitemap: true })).to.not.throw();
      expect(() => encodeWebURL('http://EXAMPLE.com/OVER/there>', { sitemap: true })).to.not.throw();
    });

    it('should not throw an uri error if uri to encode has no special sitemap characters', function() {
      expect(() => encodeWebURL('http://EXAMPLE.com/OVER/th"ere')).to.not.throw();
      expect(() => encodeWebURL('http://EXAMPLE.com/OVER/\'there')).to.not.throw();
      expect(() => encodeWebURL('http://EXAMPLE.com/OVER/th"ere?q=11')).to.not.throw();
      expect(() => encodeWebURL('http://EXAMPLE.com/OVER/t[here&')).to.not.throw();

      expect(() => encodeWebURL('http://EXAMPLE.com/OVER/th"ere', { sitemap: false })).to.not.throw();
      expect(() => encodeWebURL('http://EXAMPLE.com/OVER/\'there', { sitemap: false })).to.not.throw();
      expect(() => encodeWebURL('http://EXAMPLE.com/OVER/th"ere?q=11', { sitemap: false })).to.not.throw();
      expect(() => encodeWebURL('http://EXAMPLE.com/OVER/th[ere&', { sitemap: false })).to.not.throw();
    });

    it('should not throw an uri error if uri to encode has invalid sitemap characters that should be percent encoded whether sitemap is true or not', function() {
      expect(() => encodeWebURL('http://user:pass@example.com/path{')).to.not.throw();
      expect(() => encodeWebURL('http://user:pass@example.com/path{')).to.not.throw();
      expect(() => encodeWebURL('http://example.com/over/t}ere')).to.not.throw();
      expect(() => encodeWebURL('http://example.com/over|there')).to.not.throw();
      expect(() => encodeWebURL('http://example.com/over/there')).to.not.throw();
      expect(() => encodeWebURL('http://example.com/over/thère')).to.not.throw();
      expect(() => encodeWebURL('http://example.com/over/there€')).to.not.throw();
      expect(() => encodeWebURL('http://example.com/oveùr/there')).to.not.throw();

      expect(() => encodeWebURL('http://user:pass@example.com/path{', { sitemap: true })).to.not.throw();
      expect(() => encodeWebURL('http://user:pass@example.com/path{', { sitemap: true })).to.not.throw();
      expect(() => encodeWebURL('http://example.com/over/t}ere', { sitemap: true })).to.not.throw();
      expect(() => encodeWebURL('http://example.com/over|there', { sitemap: true })).to.not.throw();
      expect(() => encodeWebURL('http://example.com/over/there', { sitemap: true })).to.not.throw();
      expect(() => encodeWebURL('http://example.com/over/thère', { sitemap: true })).to.not.throw();
      expect(() => encodeWebURL('http://example.com/over/there€', { sitemap: true })).to.not.throw();
      expect(() => encodeWebURL('http://example.com/oveùr/there', { sitemap: true })).to.not.throw();
    });

    it('should return a lowercased url', function() {
      expect(encodeWebURL('HTTP://WWW.EXAMPLE.COM.')).to.be.a('string').and.to.equals('http://www.example.com.');
    });

    it('should return a string with the exact same characters if allowed, by default', function() {
      expect(encodeWebURL(`http://example.com/${az}`)).to.be.a('string').and.to.equals(`http://example.com/${az}`);
      expect(encodeWebURL(`http://example.com/${digits}`)).to.be.a('string').and.to.equals(`http://example.com/${digits}`);
      expect(encodeWebURL(`http://example.com/${allowed.replace('%', '')}`)).to.be.a('string').and.to.equals(`http://example.com/${allowed.replace('%', '')}`);

      expect(encodeWebURL(`http://example.com/${az}`, { sitemap: false })).to.be.a('string').and.to.equals(`http://example.com/${az}`);
      expect(encodeWebURL(`http://example.com/${digits}`, { sitemap: false })).to.be.a('string').and.to.equals(`http://example.com/${digits}`);
      expect(encodeWebURL(`http://example.com/${allowed.replace('%', '')}`, { sitemap: false })).to.be.a('string').and.to.equals(`http://example.com/${allowed.replace('%', '')}`);
    });

    it('should return a string with the exact same characters if allowed and to not be escaped when sitemap is true', function() {
      const unescaped = allowed.replace(/[%&'"]/g, '');

      expect(encodeWebURL(`http://example.com/${az}`, { sitemap: true })).to.be.a('string').and.to.equals(`http://example.com/${az}`);
      expect(encodeWebURL(`http://example.com/${digits}`, { sitemap: true })).to.be.a('string').and.to.equals(`http://example.com/${digits}`);
      expect(encodeWebURL(`http://example.com/${unescaped}`, { sitemap: true })).to.be.a('string').and.to.equals(`http://example.com/${unescaped}`);
      expect(encodeWebURL('http://example.com/<>', { sitemap: true })).to.be.a('string').and.to.equals('http://example.com/&lt;&gt;');
    });

    it('should return a string with percent encoded characters if not allowed, by default', function() {
      expect(encodeWebURL(`http://example.com/${AZ}`)).to.be.a('string').and.to.equals(`http://example.com/${az}`);
      expect(encodeWebURL(`http://example.com/${disallowed}`)).to.be.a('string').and.to.equals('http://example.com/%5C%5E%60%7B%7C%7D');
      expect(encodeWebURL('http://example.com/<>')).to.be.a('string').and.to.equals('http://example.com/%3C%3E');
      expect(encodeWebURL(`http://example.com/${disallowedOtherChars}`)).to.be.a('string').and.to.equals('http://example.com/%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3');

      expect(encodeWebURL(`http://example.com/${AZ}`, { sitemap: false })).to.be.a('string').and.to.equals(`http://example.com/${az}`);
      expect(encodeWebURL(`http://example.com/${disallowed}`, { sitemap: false })).to.be.a('string').and.to.equals('http://example.com/%5C%5E%60%7B%7C%7D');
      expect(encodeWebURL('http://example.com/<>', { sitemap: false })).to.be.a('string').and.to.equals('http://example.com/%3C%3E');
      expect(encodeWebURL(`http://example.com/${disallowedOtherChars}`, { sitemap: false })).to.be.a('string').and.to.equals('http://example.com/%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3');
    });

    it('should return a string with percent encoded characters if not allowed when sitemap is true', function() {
      expect(encodeWebURL(`http://example.com/${AZ}`, { sitemap: true })).to.be.a('string').and.to.equals(`http://example.com/${az}`);
      expect(encodeWebURL(`http://example.com/${disallowed}`, { sitemap: true })).to.be.a('string').and.to.equals('http://example.com/%5C%5E%60%7B%7C%7D');
      expect(encodeWebURL('http://example.com/<>', { sitemap: true })).to.be.a('string').and.to.equals('http://example.com/&lt;&gt;');
      expect(encodeWebURL(`http://example.com/${disallowedOtherChars}`, { sitemap: true })).to.be.a('string').and.to.equals('http://example.com/%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3');
    });

    it('should return a string with escaped characters when sitemap is true', function() {
      expect(encodeWebURL('http://example.com/&\'"<>', { sitemap: true })).to.be.a('string').and.to.equals('http://example.com/&amp;&apos;&quot;&lt;&gt;');
      expect(encodeWebURL('http://example.com/&\'"', { sitemap: false })).to.be.a('string').and.to.equals('http://example.com/&\'"');
      expect(encodeWebURL('http://example.com/<>', { sitemap: false })).to.be.a('string').and.to.equals('http://example.com/%3C%3E');
    });

    it('should return the expected url encoded string with the punycoded host', function() {
      expect(encodeWebURL('http://exèmple.com:8080')).to.be.a('string').and.to.equals('http://xn--exmple-4ua.com:8080');
      expect(encodeWebURL('http://exèmple.com/pâth')).to.be.a('string').and.to.equals('http://xn--exmple-4ua.com/p%C3%A2th');
      expect(encodeWebURL('http://中文.com.')).to.be.a('string').and.to.equals('http://xn--fiq228c.com.');
    });

    it('should return the expected url encoded string with the userinfo encoded', function() {
      expect(encodeWebURL('http://user:pâss@exèmple.com:8080/pâth')).to.be.a('string').and.to.equals('http://user:p%C3%A2ss@xn--exmple-4ua.com:8080/p%C3%A2th');
      expect(encodeWebURL('http://usèr:pass@example.com/')).to.be.a('string').and.to.equals('http://us%C3%A8r:pass@example.com/');
    });

    it('should return the expected url encoded string with userinfo encoded and escaped chars when sitemap is true', function() {
      expect(encodeWebURL('http://us<e>r:pâss@exèmple.com:8080/pâth', { sitemap: true })).to.be.a('string').and.to.equals('http://us&lt;e&gt;r:p%C3%A2ss@xn--exmple-4ua.com:8080/p%C3%A2th');
      expect(encodeWebURL('http://us\'r:pa"ss@example.com/', { sitemap: true })).to.be.a('string').and.to.equals('http://us&apos;r:pa&quot;ss@example.com/');
    });

    it('should not return an url with scheme or authority having invalid or escaped characters', function() {
      expect(encodeWebURL('http://exèmple.com')).to.be.a('string').and.to.equals('http://xn--exmple-4ua.com');
      expect(() => encodeWebURL('htèp://exèmple.com')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
      expect(() => encodeWebURL('http://ex%20mple.com')).to.throw(URIError).with.property('code', 'URI_INVALID_HOST');
      expect(() => encodeWebURL('ht%tp://exèmple.com')).to.throw(URIError).with.property('code', 'URI_INVALID_SCHEME');
    });

    it('should return the expected url encoded string', function() {
      expect(encodeWebURL('http://user:pâss@exèmple.com:8080/pâth')).to.be.a('string').and.to.equals('http://user:p%C3%A2ss@xn--exmple-4ua.com:8080/p%C3%A2th');
      expect(encodeWebURL('http://user:pa$$@example.com/')).to.be.a('string').and.to.equals('http://user:pa$$@example.com/');
      expect(encodeWebURL('http://usèr:pass@example.com/')).to.be.a('string').and.to.equals('http://us%C3%A8r:pass@example.com/');
      expect(encodeWebURL('http://example.com/pâth')).to.be.a('string').and.to.equals('http://example.com/p%C3%A2th');

      expect(encodeWebURL('http://example.com/there?a=5&b=11', { sitemap: true })).to.be.a('string').and.to.equals('http://example.com/there?a=5&amp;b=11');
    });

    // encodeURI will never return an invalid character that would not have been percent encoded
    //
  });
});
