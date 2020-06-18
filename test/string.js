const { expect } = require('./Common');
const { string: { split, capitalize, camelCase } } = require('../lib');

describe('#string', function() {
  context('when using split', function() {
    it('should return an array with splitted elements when separator is a string', function() {
      const string1 = 'string to split';
      const string2 = 'stringtosplit';
      const string3 = 'string;to;split';
      const string4 = 'string?to?split';
      const string5 = 'string/to/split';

      expect(split({ string: string1, separator: ' ' })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
      expect(split({ string: string2, separator: 'to' })).to.be.an('array').and.to.eql(['string', 'split']);
      expect(split({ string: string3, separator: ';' })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
      expect(split({ string: string4, separator: '?' })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
      expect(split({ string: string5, separator: '/' })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
    });

    it('should return an array with splitted elements when separator is a regexp', function() {
      const string1 = 'string to split';
      const string2 = 'stringtosplit';
      const string3 = 'string;to;split';
      const string4 = 'string?to?split';
      const string5 = 'string/to/split';

      expect(split({ string: string1, separator: / / })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
      expect(split({ string: string2, separator: /to/ })).to.be.an('array').and.to.eql(['string', 'split']);
      expect(split({ string: string3, separator: /;/ })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
      expect(split({ string: string4, separator: /\?/ })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
      expect(split({ string: string5, separator: /\// })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
    });

    it('should return an array with splitted elements when separator is a string and max is set', function() {
      const string1 = 'string to split';
      const string2 = 'stringtosplit';
      const string3 = 'string;to;split';
      const string4 = 'string?to?split';
      const string5 = 'string/to/split';

      expect(split({ string: string1, separator: ' ', max: 0 })).to.be.an('array').and.to.eql([]);
      expect(split({ string: string2, separator: 'to', max: 1 })).to.be.an('array').and.to.eql(['string']);
      expect(split({ string: string3, separator: ';', max: 2 })).to.be.an('array').and.to.eql(['string', 'to']);
      expect(split({ string: string4, separator: '?', max: 3 })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
      expect(split({ string: string5, separator: '/', max: 3 })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
    });

    it('should return an array with splitted elements when separator is a regexp and max is set', function() {
      const string1 = 'string to split';
      const string2 = 'stringtosplit';
      const string3 = 'string;to;split';
      const string4 = 'string?to?split';
      const string5 = 'string/to/split';

      expect(split({ string: string1, separator: / /, max: 3 })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
      expect(split({ string: string2, separator: /to/, max: 2 })).to.be.an('array').and.to.eql(['string', 'split']);
      expect(split({ string: string3, separator: /;/, max: 2 })).to.be.an('array').and.to.eql(['string', 'to']);
      expect(split({ string: string4, separator: /\?/, max: 1 })).to.be.an('array').and.to.eql(['string']);
      expect(split({ string: string5, separator: /\//, max: 0 })).to.be.an('array').and.to.eql([]);
    });

    it('should return an array with splitted elements when separator is a string and max is invalid', function() {
      const string1 = 'string to split';
      const string2 = 'stringtosplit';
      const string3 = 'string;to;split';
      const string4 = 'string?to?split';
      const string5 = 'string/to/split';

      expect(split({ string: string1, separator: ' ', max: -5 })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
      expect(split({ string: string2, separator: 'to', max: 25 })).to.be.an('array').and.to.eql(['string', 'split']);
      expect(split({ string: string3, separator: ';', max: undefined })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
      expect(split({ string: string4, separator: '?', max: NaN })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
      expect(split({ string: string5, separator: '/', max: null })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
    });

    it('should return an array with splitted elements when separator is a regexp and max is invalid', function() {
      const string1 = 'string to split';
      const string2 = 'stringtosplit';
      const string3 = 'string;to;split';
      const string4 = 'string?to?split';
      const string5 = 'string/to/split';

      expect(split({ string: string1, separator: / /, max: 1000 })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
      expect(split({ string: string2, separator: /to/, max: -25 })).to.be.an('array').and.to.eql(['string', 'split']);
      expect(split({ string: string3, separator: /;/, max: NaN })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
      expect(split({ string: string4, separator: /\?/, max:  null })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
      expect(split({ string: string5, separator: /\//, max: undefined })).to.be.an('array').and.to.eql(['string', 'to', 'split']);
    });

    it('should return an empty array when string is undefined', function() {
      expect(split({ string: undefined, separator: ' ' })).to.be.an('array').and.to.be.empty;
    });

    it('should return an empty array when string is NaN', function() {
      expect(split({ string: NaN, separator: ' ' })).to.be.an('array').and.to.be.empty;
    });

    it('should return an empty array when string is null', function() {
      expect(split({ string: null, separator: ' ' })).to.be.an('array').and.to.be.empty;
    });

    it('should return an empty array when separator is undefined', function() {
      expect(split({ string: 'string', separator: undefined })).to.be.an('array').and.to.be.empty;
    });

    it('should return an empty array when separator is NaN', function() {
      expect(split({ string: 'string', separator: NaN })).to.be.an('array').and.to.be.empty;
    });

    it('should return an empty array when separator is null', function() {
      expect(split({ string: 'string', separator: null })).to.be.an('array').and.to.be.empty;
    });

    it('should return an empty array when string and separator are undefined', function() {
      expect(split({ string: undefined, separator: undefined })).to.be.an('array').and.to.be.empty;
    });

    it('should return an empty array when string and separator are NaN', function() {
      expect(split({ string: NaN, separator: NaN })).to.be.an('array').and.to.be.empty;
    });

    it('should return an empty array when string and separator are null', function() {
      expect(split({ string: null, separator: null })).to.be.an('array').and.to.be.empty;
    });

    it('should return an empty array when string is undefined and separator is NaN', function() {
      expect(split({ string: undefined, separator: NaN })).to.be.an('array').and.to.be.empty;
    });

    it('should return an empty array when string is undefined and separator is null', function() {
      expect(split({ string: undefined, separator: null })).to.be.an('array').and.to.be.empty;
    });

    it('should return an empty array when string is NaN and separator is undefined', function() {
      expect(split({ string: NaN, separator: undefined })).to.be.an('array').and.to.be.empty;
    });

    it('should return an empty array when string is null and separator is undefined', function() {
      expect(split({ string: null, separator: undefined })).to.be.an('array').and.to.be.empty;
    });
  });

  context('when using capitalize', function() {
    it('should return a string with the first letter in upper case when testing a string', function() {
      expect(capitalize({ string: 'abc' })).to.be.a('string').and.to.equal('Abc');
      expect(capitalize({ string: ' abc' })).to.be.a('string').and.to.equal(' abc');
      expect(capitalize({ string: 'a b c' })).to.be.a('string').and.to.equal('A b c');
    });

    it('should return a string with only the first letter in upper case when first is true', function() {
      expect(capitalize({ string: 'aBC', first: true })).to.be.a('string').and.to.equal('Abc');
      expect(capitalize({ string: ' ABC', first: true })).to.be.a('string').and.to.equal(' abc');
      expect(capitalize({ string: 'a B c', first: true })).to.be.a('string').and.to.equal('A b c');
    });

    it('should return a string with not only the first letter in upper case when first is false or missing', function() {
      expect(capitalize({ string: 'aBC', first: false })).to.be.a('string').and.to.equal('ABC');
      expect(capitalize({ string: ' ABC', first: false })).to.be.a('string').and.to.equal(' ABC');
      expect(capitalize({ string: 'a B c', first: undefined })).to.be.a('string').and.to.equal('A B c');
      expect(capitalize({ string: 'a B c', first: null })).to.be.a('string').and.to.equal('A B c');
      expect(capitalize({ string: 'a B c', first: NaN })).to.be.a('string').and.to.equal('A B c');
      expect(capitalize({ string: 'a B c' })).to.be.a('string').and.to.equal('A B c');
    });

    it('should return an empty string when testing on anything other than a string', function() {
      expect(capitalize({ string: undefined })).to.be.a('string').and.to.equal('');
      expect(capitalize({ string: null })).to.be.a('string').and.to.equal('');
      expect(capitalize({ string: NaN })).to.be.a('string').and.to.equal('');
      expect(capitalize()).to.be.a('string').and.to.equal('');
      expect(capitalize({ string: 5 })).to.be.a('string').and.to.equal('');
      expect(capitalize({ string: new Error('error') })).to.be.a('string').and.to.equal('');
      expect(capitalize({ string: true })).to.be.a('string').and.to.equal('');
      expect(capitalize({ string: Symbol('s') })).to.be.a('string').and.to.equal('');
      expect(capitalize({ string: function f() {} })).to.be.a('string').and.to.equal('');
      expect(capitalize({ string: {} })).to.be.a('string').and.to.equal('');
      expect(capitalize({ string: [] })).to.be.a('string').and.to.equal('');
      expect(capitalize({ string: new Date() })).to.be.a('string').and.to.equal('');
      expect(capitalize({ string: new Map() })).to.be.a('string').and.to.equal('');
      expect(capitalize({ string: new Set() })).to.be.a('string').and.to.equal('');
      expect(capitalize({ string: new WeakMap() })).to.be.a('string').and.to.equal('');
      expect(capitalize({ string: new WeakSet() })).to.be.a('string').and.to.equal('');
    });
  });

  context('when using camelCase', function() {
    it('should return a string in camel case when testing a string with a string or pattern as words separator', function() {
      expect(camelCase({ string: 'camel-case-string', separator: '-' })).to.be.a('string').and.to.equal('camelCaseString');
      expect(camelCase({ string: 'camel*case*string', separator: '*' })).to.be.a('string').and.to.equal('camelCaseString');
      expect(camelCase({ string: 'camel/case/string', separator: '/' })).to.be.a('string').and.to.equal('camelCaseString');
      expect(camelCase({ string: 'camel case string', separator: ' ' })).to.be.a('string').and.to.equal('camelCaseString');
      expect(camelCase({ string: 'camel<case<string', separator: '<' })).to.be.a('string').and.to.equal('camelCaseString');
      expect(camelCase({ string: 'camel  case   string', separator: /\s+/ })).to.be.a('string').and.to.equal('camelCaseString');
      expect(camelCase({ string: 'camel1case5string', separator: /[0-9]/ })).to.be.a('string').and.to.equal('camelCaseString');
    });

    it('should return an empty string when separator is missing', function() {
      expect(camelCase({ string: 'aBC' })).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: ' ABC' })).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: 'a B c' })).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: 'a B c', separator: undefined })).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: 'a B c', separator: null })).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: 'a B c', separator: NaN })).to.be.a('string').and.to.equal('');
    });

    it('should return an empty string when testing on anything other than a string', function() {
      expect(camelCase({ string: undefined })).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: null })).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: NaN })).to.be.a('string').and.to.equal('');
      expect(camelCase()).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: 5 })).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: new Error('error') })).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: true })).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: Symbol('s') })).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: function f() {} })).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: {} })).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: [] })).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: new Date() })).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: new Map() })).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: new Set() })).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: new WeakMap() })).to.be.a('string').and.to.equal('');
      expect(camelCase({ string: new WeakSet() })).to.be.a('string').and.to.equal('');
    });
  });
});
