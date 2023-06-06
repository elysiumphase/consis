const { execSync } = require('child_process');
const { expect } = require('./Common');
const { uuid: { getUUIDVersion, isValidUUID } } = require('../src');
const {
  v1: uuidv1,
  v3: uuidv3,
  v4: uuidv4,
  v5: uuidv5,
} = require('uuid');

describe('#uuid', function() {
  context('when using getUUIDVersion', function() {
    it('should return 1 when using an uuid version 1', function () {
      expect(getUUIDVersion(uuidv1())).to.be.a('number').and.to.equals(1);
      expect(getUUIDVersion(uuidv1())).to.be.a('number').and.to.equals(1);
      expect(getUUIDVersion(uuidv1())).to.be.a('number').and.to.equals(1);
      expect(getUUIDVersion(uuidv1())).to.be.a('number').and.to.equals(1);
      expect(getUUIDVersion(uuidv1())).to.be.a('number').and.to.equals(1);
    });

    it('should return 3 when using an uuid version 3', function () {
      expect(getUUIDVersion(uuidv3('test.example.com', uuidv3.DNS))).to.be.a('number').and.to.equals(3);
      expect(getUUIDVersion(uuidv3('http://example.com/test', uuidv3.URL))).to.be.a('number').and.to.equals(3);
      expect(getUUIDVersion(uuidv3('test.example.com', uuidv3.DNS))).to.be.a('number').and.to.equals(3);
      expect(getUUIDVersion(uuidv3('http://example.com/test', uuidv3.URL))).to.be.a('number').and.to.equals(3);
    });

    it('should return 4 when using an uuid version 4', function () {
      expect(getUUIDVersion(uuidv4())).to.be.a('number').and.to.equals(4);
      expect(getUUIDVersion(uuidv4())).to.be.a('number').and.to.equals(4);
      expect(getUUIDVersion(uuidv4())).to.be.a('number').and.to.equals(4);
      expect(getUUIDVersion(uuidv4())).to.be.a('number').and.to.equals(4);
      expect(getUUIDVersion(uuidv4())).to.be.a('number').and.to.equals(4);
    });

    it('should return 5 when using an uuid version 5', function () {
      expect(getUUIDVersion(uuidv5('test.example.com', uuidv5.DNS))).to.be.a('number').and.to.equals(5);
      expect(getUUIDVersion(uuidv5('http://example.com/test', uuidv5.URL))).to.be.a('number').and.to.equals(5);
      expect(getUUIDVersion(uuidv5('test.example.com', uuidv5.DNS))).to.be.a('number').and.to.equals(5);
      expect(getUUIDVersion(uuidv5('http://example.com/test', uuidv5.URL))).to.be.a('number').and.to.equals(5);
    });

    it('should return -1 when using an unknown uuid string', function () {
      expect(getUUIDVersion('')).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion('  ')).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion('test')).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(new String(''))).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(new String('  '))).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(new String('test'))).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(String(''))).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(String('  '))).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(String('test'))).to.be.a('number').and.to.equals(-1);
    });

    it('should return -1 when using a number', function() {
      expect(getUUIDVersion(0)).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(1)).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(5)).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(new Number(0))).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(new Number(1))).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(new Number(5))).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(Number(0))).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(Number(1))).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(Number(5))).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(5.5)).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(Infinity)).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(0xFF)).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(0b111110111)).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(0o767)).to.be.a('number').and.to.equals(-1);
    });

    it('should return -1 when using a boolean', function() {
      expect(getUUIDVersion(true)).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(false)).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(new Boolean(true))).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(new Boolean(false))).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(Boolean(1))).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(Boolean(0))).to.be.a('number').and.to.equals(-1);
    });

    it('should return -1 when using a symbol', function() {
      expect(getUUIDVersion(Symbol('s'))).to.be.a('number').and.to.equals(-1);
    });

    it('should return -1 when using a function', function() {
      expect(getUUIDVersion(function f() {})).to.be.a('number').and.to.equals(-1);
    });

    it('should return -1 when using a class', function() {
      expect(getUUIDVersion(class c {})).to.be.a('number').and.to.equals(-1);
    });

    it('should return -1 when using an error', function() {
      expect(getUUIDVersion(new Error('error'))).to.be.a('number').and.to.equals(-1);
    });

    it('should return -1 when using an array', function() {
      expect(getUUIDVersion([])).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion([1, 2, 3])).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion([[1, 2], [3, 4, 5]])).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(Array(5))).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(new Array(1, 2, 3))).to.be.a('number').and.to.equals(-1);
    });

    it('should return -1 when using an object', function() {
      expect(getUUIDVersion({})).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion({ x: 5 })).to.be.a('number').and.to.equals(-1);
      expect(getUUIDVersion(new function() {})).to.be.a('number').and.to.equals(-1);
    });

    it('should return -1 when using a map', function() {
      expect(getUUIDVersion(new Map())).to.be.a('number').and.to.equals(-1);
    });

    it('should return -1 when using a set', function() {
      expect(getUUIDVersion(new Set())).to.be.a('number').and.to.equals(-1);
    });

    it('should return -1 when using a weakmap', function() {
      expect(getUUIDVersion(new WeakMap())).to.be.a('number').and.to.equals(-1);
    });

    it('should return -1 when using a weakset', function() {
      expect(getUUIDVersion(new WeakSet())).to.be.a('number').and.to.equals(-1);
    });

    it('should return -1 when using undefined', function() {
      expect(getUUIDVersion(undefined)).to.be.a('number').and.to.equals(-1);
    });

    it('should return -1 when using null', function() {
      expect(getUUIDVersion(null)).to.be.a('number').and.to.equals(-1);
    });

    it('should return -1 when using NaN', function() {
      expect(getUUIDVersion(NaN)).to.be.a('number').and.to.equals(-1);
    });
  });

  context('when using isValidUUID', function() {
    it('should return true when testing an uuid version 1', function () {
      expect(isValidUUID(uuidv1(), 1)).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv1(), 1)).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv1(), 1)).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv1(), 1)).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv1(), 1)).to.be.a('boolean').and.to.be.true;

      expect(isValidUUID(uuidv1(), new Number(1))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv1(), new Number(1))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv1(), new Number(1))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv1(), new Number(1))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv1(), new Number(1))).to.be.a('boolean').and.to.be.true;

      expect(isValidUUID(uuidv1(), Number(1))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv1(), Number(1))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv1(), Number(1))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv1(), Number(1))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv1(), Number(1))).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing an uuid version 3', function () {
      expect(isValidUUID(uuidv3('test.example.com', uuidv3.DNS), 3)).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv3('http://example.com/test', uuidv3.URL), 3)).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv3('test.example.com', uuidv3.DNS), 3)).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv3('http://example.com/test', uuidv3.URL), 3)).to.be.a('boolean').and.to.be.true;

      expect(isValidUUID(uuidv3('test.example.com', uuidv3.DNS),  new Number(3))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv3('http://example.com/test', uuidv3.URL),  new Number(3))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv3('test.example.com', uuidv3.DNS), new Number(3))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv3('http://example.com/test', uuidv3.URL), new Number(3))).to.be.a('boolean').and.to.be.true;

      expect(isValidUUID(uuidv3('test.example.com', uuidv3.DNS), Number(3))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv3('http://example.com/test', uuidv3.URL), Number(3))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv3('test.example.com', uuidv3.DNS), Number(3))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv3('http://example.com/test', uuidv3.URL), Number(3))).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing an uuid version 4', function () {
      expect(isValidUUID(uuidv4(), 4)).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv4(), 4)).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv4(), 4)).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv4(), 4)).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv4(), 4)).to.be.a('boolean').and.to.be.true;

      expect(isValidUUID(uuidv4(), new Number(4))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv4(), new Number(4))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv4(), new Number(4))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv4(), new Number(4))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv4(), new Number(4))).to.be.a('boolean').and.to.be.true;

      expect(isValidUUID(uuidv4(), Number(4))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv4(), Number(4))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv4(), Number(4))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv4(), Number(4))).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv4(), Number(4))).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when the version number specified can be converted to a number', function () {
      expect(isValidUUID(uuidv1(), '1')).to.be.a('boolean').and.to.be.true;

      expect(isValidUUID(uuidv3('test.example.com', uuidv3.DNS), '3')).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv3('http://example.com/test', uuidv3.URL), '3')).to.be.a('boolean').and.to.be.true;

      expect(isValidUUID(uuidv4(), '4')).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing an uuid version 4 and not specifiying a correct version number', function () {
      expect(isValidUUID(uuidv4())).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv4(), -1)).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv4(), 55)).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv4(), 'test')).to.be.a('boolean').and.to.be.true;
      expect(isValidUUID(uuidv4(), '')).to.be.a('boolean').and.to.be.true;
    });

    it('should return false when testing an uuid version 1 and not specifiying a correct version number', function () {
      expect(isValidUUID(uuidv1())).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(uuidv1(), -1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(uuidv1(), 55)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(uuidv1(), 'test')).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(uuidv1(), '')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing an uuid version 3 and not specifiying a correct version number', function () {
      expect(isValidUUID(uuidv3('test.example.com', uuidv3.DNS))).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(uuidv3('test.example.com', uuidv3.DNS), -1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(uuidv3('test.example.com', uuidv3.DNS), 55)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(uuidv3('test.example.com', uuidv3.DNS), 'test')).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(uuidv3('test.example.com', uuidv3.DNS), '')).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(uuidv3('http://example.com/test', uuidv3.URL))).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(uuidv3('http://example.com/test', uuidv3.URL), -1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(uuidv3('http://example.com/test', uuidv3.URL), 55)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(uuidv3('http://example.com/test', uuidv3.URL), 'test')).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(uuidv3('http://example.com/test', uuidv3.URL), '')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when a string in not a valid uuid version 1', function () {
      expect(isValidUUID('', 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID('  ', 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID('111111111111111', 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID('111111111111111', 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new String(''), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new String('  '), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new String('111111111111111'), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new String('111111111111111'), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(String(''), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(String('  '), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(String('111111111111111'), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(String('111111111111111'), 1)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when a string in not a valid uuid version 3', function () {
      expect(isValidUUID('', 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID('  ', 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID('333333333333333', 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID('333333333333333', 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new String(''), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new String('  '), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new String('333333333333333'), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new String('333333333333333'), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(String(''), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(String('  '), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(String('333333333333333'), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(String('333333333333333'), 3)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when a string in not a valid uuid version 4', function () {
      expect(isValidUUID('', 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID('  ', 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID('444444444444444', 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID('444444444444444', 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new String(''), 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new String('  '), 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new String('444444444444444'), 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new String('444444444444444'), 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(String(''), 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(String('  '), 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(String('444444444444444'), 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(String('444444444444444'), 4)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a number', function() {
      expect(isValidUUID(0)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(5)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Number(0))).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Number(1))).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Number(5))).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Number(0))).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Number(1))).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Number(5))).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(5.5)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Infinity)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(0xFF)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(0b111110111)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(0o767)).to.be.a('boolean').and.to.be.false;

      expect(isValidUUID(0, 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(1, 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(5, 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Number(0), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Number(1), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Number(5), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Number(0), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Number(1), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Number(5), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(5.5, 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Infinity, 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(0xFF, 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(0b111110111, 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(0o767, 1)).to.be.a('boolean').and.to.be.false;

      expect(isValidUUID(0, 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(1, 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(5, 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Number(0), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Number(1), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Number(5), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Number(0), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Number(1), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Number(5), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(5.5, 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Infinity, 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(0xFF, 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(0b111110111, 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(0o767, 3)).to.be.a('boolean').and.to.be.false;

      expect(isValidUUID(0, 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(1, 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(5, 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Number(0), 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Number(1), 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Number(5), 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Number(0), 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Number(1), 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Number(5), 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(5.5, 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Infinity, 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(0xFF, 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(0b111110111, 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(0o767, 4)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a boolean', function() {
      expect(isValidUUID(true)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(false)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Boolean(true))).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Boolean(false))).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Boolean(1))).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Boolean(0))).to.be.a('boolean').and.to.be.false;

      expect(isValidUUID(true, 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(false, 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Boolean(true), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Boolean(false), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Boolean(1), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Boolean(0), 1)).to.be.a('boolean').and.to.be.false;

      expect(isValidUUID(true, 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(false, 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Boolean(true), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Boolean(false), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Boolean(1), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Boolean(0), 3)).to.be.a('boolean').and.to.be.false;

      expect(isValidUUID(true, 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(false, 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Boolean(true), 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Boolean(false), 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Boolean(1), 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Boolean(0), 4)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a symbol', function() {
      expect(isValidUUID(Symbol('s'))).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Symbol('s'), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Symbol('s'), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Symbol('s'), 4)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a function', function() {
      expect(isValidUUID(function f() {})).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(function f() {}, 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(function f() {}, 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(function f() {}, 4)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a class', function() {
      expect(isValidUUID(class c {})).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(class c {}, 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(class c {}, 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(class c {}, 4)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing an error', function() {
      expect(isValidUUID(new Error('error'))).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Error('error'), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Error('error'), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Error('error'), 4)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing an array', function() {
      expect(isValidUUID([])).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID([1, 2, 3])).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID([[1, 2], [3, 4, 5]])).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Array(5))).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Array(1, 2, 3))).to.be.a('boolean').and.to.be.false;

      expect(isValidUUID([], 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID([1, 2, 3], 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID([[1, 2], [3, 4, 5]], 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Array(5), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Array(1, 2, 3), 1)).to.be.a('boolean').and.to.be.false;

      expect(isValidUUID([], 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID([1, 2, 3], 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID([[1, 2], [3, 4, 5]], 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Array(5), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Array(1, 2, 3), 3)).to.be.a('boolean').and.to.be.false;

      expect(isValidUUID([], 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID([1, 2, 3], 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID([[1, 2], [3, 4, 5]], 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(Array(5), 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Array(1, 2, 3), 4)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing an object', function() {
      expect(isValidUUID({})).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID({ x: 5 })).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new function() {})).to.be.a('boolean').and.to.be.false;

      expect(isValidUUID({}, 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID({ x: 5 }, 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new function() {}, 1)).to.be.a('boolean').and.to.be.false;

      expect(isValidUUID({}, 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID({ x: 5 }, 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new function() {}, 3)).to.be.a('boolean').and.to.be.false;

      expect(isValidUUID({}, 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID({ x: 5 }, 4)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new function() {}, 4)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a map', function() {
      expect(isValidUUID(new Map())).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Map(), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Map(), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Map(), 4)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a set', function() {
      expect(isValidUUID(new Set())).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Set(), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Set(), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new Set(), 4)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a weakmap', function() {
      expect(isValidUUID(new WeakMap())).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new WeakMap(), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new WeakMap(), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new WeakMap(), 4)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a weakset', function() {
      expect(isValidUUID(new WeakSet())).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new WeakSet(), 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new WeakSet(), 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(new WeakSet(), 4)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing undefined', function() {
      expect(isValidUUID(undefined)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(undefined, 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(undefined, 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(undefined, 4)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing null', function() {
      expect(isValidUUID(null)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(null, 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(null, 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(null, 4)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing NaN', function() {
      expect(isValidUUID(NaN)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(NaN, 1)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(NaN, 3)).to.be.a('boolean').and.to.be.false;
      expect(isValidUUID(NaN, 4)).to.be.a('boolean').and.to.be.false;
    });
  });
});
