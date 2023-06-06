const { expect } = require('./Common');
const { cast: { str, num, number, int, integer, toFloat, float, bool, arr, date, round, precision } } = require('../src');

describe('#cast', function() {
  context('when using str', function() {
    it('should return the primitive string value of a string', function() {
      expect(str('')).to.be.a('string').and.to.equals('').and.to.not.be.an('object');
      expect(str('  ')).to.be.a('string').and.to.equals('  ').and.to.not.be.an('object');
      expect(str('s')).to.be.a('string').and.to.equals('s').and.to.not.be.an('object');
      expect(str("")).to.be.a('string').and.to.equals("").and.to.not.be.an('object');
      expect(str("  ")).to.be.a('string').and.to.equals("  ").and.to.not.be.an('object');
      expect(str("s")).to.be.a('string').and.to.equals("s").and.to.not.be.an('object');
      expect(str(new String(''))).to.be.a('string').and.to.equals('').and.to.not.be.an('object');
      expect(str(new String('  '))).to.be.a('string').and.to.equals('  ').and.to.not.be.an('object');
      expect(str(new String('s'))).to.be.a('string').and.to.equals('s').and.to.not.be.an('object');
      expect(str(new String(""))).to.be.a('string').and.to.equals("").and.to.not.be.an('object');
      expect(str(new String("  "))).to.be.a('string').and.to.equals("  ").and.to.not.be.an('object');
      expect(str(new String("s"))).to.be.a('string').and.to.equals("s").and.to.not.be.an('object');
      expect(str(String(''))).to.be.a('string').and.to.equals('').and.to.not.be.an('object');
      expect(str(String('  '))).to.be.a('string').and.to.equals('  ').and.to.not.be.an('object');
      expect(str(String('s'))).to.be.a('string').and.to.equals('s').and.to.not.be.an('object');
      expect(str(String(""))).to.be.a('string').and.to.equals("").and.to.not.be.an('object');
      expect(str(String("  "))).to.be.a('string').and.to.equals("  ").and.to.not.be.an('object');
      expect(str(String("s"))).to.be.a('string').and.to.equals("s").and.to.not.be.an('object');
    });

    it('should return the primitive string representation of a number', function() {
      expect(str(0)).to.be.a('string').and.to.equals('0').and.to.not.be.an('object');
      expect(str(1)).to.be.a('string').and.to.equals('1').and.to.not.be.an('object');
      expect(str(5)).to.be.a('string').and.to.equals('5').and.to.not.be.an('object');
      expect(str(new Number(0))).to.be.a('string').and.to.equals('0').and.to.not.be.an('object');
      expect(str(new Number(1))).to.be.a('string').and.to.equals('1').and.to.not.be.an('object');
      expect(str(new Number(5))).to.be.a('string').and.to.equals('5').and.to.not.be.an('object');
      expect(str(Number(0))).to.be.a('string').and.to.equals('0').and.to.not.be.an('object');
      expect(str(Number(1))).to.be.a('string').and.to.equals('1').and.to.not.be.an('object');
      expect(str(Number(5))).to.be.a('string').and.to.equals('5').and.to.not.be.an('object');
      expect(str(5.5)).to.be.a('string').and.to.equals('5.5').and.to.not.be.an('object');
      expect(str(Infinity)).to.be.a('string').and.to.equals('Infinity').and.to.not.be.an('object');
      expect(str(0xFF)).to.be.a('string').and.to.equals('255').and.to.not.be.an('object');
      expect(str(0b111110111)).to.be.a('string').and.to.equals('503').and.to.not.be.an('object');
      expect(str(0o767)).to.be.a('string').and.to.equals('503').and.to.not.be.an('object');
    });

    it('should return the primitive string representation of a boolean', function() {
      expect(str(true)).to.be.a('string').and.to.equals('true').and.to.not.be.an('object');
      expect(str(false)).to.be.a('string').and.to.equals('false').and.to.not.be.an('object');
      expect(str(new Boolean(true))).to.be.a('string').and.to.equals('true').and.to.not.be.an('object');
      expect(str(new Boolean(false))).to.be.a('string').and.to.equals('false').and.to.not.be.an('object');
      expect(str(Boolean(1))).to.be.a('string').and.to.equals('true').and.to.not.be.an('object');
      expect(str(Boolean(0))).to.be.a('string').and.to.equals('false').and.to.not.be.an('object');
    });

    it('should return the primitive string representation of a symbol', function() {
      expect(str(Symbol('s'))).to.be.a('string').and.to.equals('Symbol(s)').and.to.not.be.an('object');
    });

    it('should return the primitive string representation of a function', function() {
      expect(str(function f() {})).to.be.a('string').and.to.equals('function f() {}').and.to.not.be.an('object');
    });

    it('should return the primitive string representation of a class', function() {
      expect(str(class c {})).to.be.a('string').and.to.equals('class c {}').and.to.not.be.an('object');
    });

    it('should return the primitive string representation of an error', function() {
      expect(str(new Error('error'))).to.be.a('string').and.to.equals('Error: error').and.to.not.be.an('object');
    });

    it('should return the primitive string representation of an array', function() {
      expect(str([])).to.be.a('string').and.to.equals('').and.to.not.be.an('object');
      expect(str([1, 2, 3])).to.be.a('string').and.to.equals('1,2,3').and.to.not.be.an('object');
      expect(str([[1, 2], [3, 4, 5]])).to.be.a('string').and.to.equals('1,2,3,4,5').and.to.not.be.an('object');
      expect(str(Array(5))).to.be.a('string').and.to.equals(',,,,').and.to.not.be.an('object');
      expect(str(new Array(1, 2, 3))).to.be.a('string').and.to.equals('1,2,3').and.to.not.be.an('object');
    });

    it('should return undefined when casting an object', function() {
      expect(str({})).to.be.undefined;
      expect(str({ x: 5 })).to.be.undefined;
      expect(str(new function() {})).to.be.undefined;
    });

    it('should return undefined when casting a map', function() {
      expect(str(new Map())).to.be.undefined;
    });

    it('should return undefined when casting a set', function() {
      expect(str(new Set())).to.be.undefined;
    });

    it('should return undefined when casting a weakmap', function() {
      expect(str(new WeakMap())).to.be.undefined;
    });

    it('should return undefined when casting a weakset', function() {
      expect(str(new WeakSet())).to.be.undefined;
    });

    it('should return undefined when casting undefined', function() {
      expect(str(undefined)).to.be.undefined;
    });

    it('should return undefined when casting null', function() {
      expect(str(null)).to.be.undefined;
    });

    it('should return undefined when casting NaN', function() {
      expect(str(NaN)).to.be.undefined;
    });
  });

  context('when using number', function() {
    it('should return undefined if the number is > than the max safe integer', function() {
      expect(number(5**152)).to.be.undefined;
      expect(number('1.7516230804060214e+106')).to.be.undefined;
    });

    it('should return the primitive number value of a number', function() {
      expect(number(0)).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(number(1)).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(number(new Number(0))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(number(new Number(1))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(number(new Number(5))).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(number(Number(0))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(number(Number(1))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(number(Number(5))).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(number(5.5)).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');
      expect(number(0xFF)).to.be.a('number').and.to.equals(255).and.to.not.be.an('object');
      expect(number(0b111110111)).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
      expect(number(0o767)).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
    });

    it('should return the primitive number value of a string representing a number', function() {
      expect(number('0')).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(number('1')).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(number('5')).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(number('5.5')).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');
      expect(number('0xFF')).to.be.a('number').and.to.equals(255).and.to.not.be.an('object');
      expect(number('0b111110111')).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
      expect(number('0o767')).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
    });

    it('should return the primitive number value of a boolean', function() {
      expect(number(true)).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(number(false)).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(number(new Boolean(true))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(number(new Boolean(false))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(number(Boolean(1))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(number(Boolean(0))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
    });

    it('should return undefined when casting an infinite number', function() {
      expect(number(Infinity)).to.be.undefined;
      expect(number(-Infinity)).to.be.undefined;
      expect(number('Infinity')).to.be.undefined;
      expect(number('-Infinity')).to.be.undefined;
    });

    it('should return undefined when casting a symbol', function() {
      expect(number(Symbol('s'))).to.be.undefined;
    });

    it('should return undefined when casting a function', function() {
      expect(number(function f() {})).to.be.undefined;
    });

    it('should return undefined when casting a class', function() {
      expect(number(class c {})).to.be.undefined;
    });

    it('should return undefined when casting an error', function() {
      expect(number(new Error('error'))).to.be.undefined;
    });

    it('should return undefined when casting an array', function() {
      expect(number([])).to.be.undefined;
      expect(number([1, 2, 3])).to.be.undefined;
      expect(number([[1, 2], [3, 4, 5]])).to.be.undefined;
      expect(number(Array(5))).to.be.undefined;
      expect(number(new Array(1, 2, 3))).to.be.undefined;
    });

    it('should return undefined when casting an object', function() {
      expect(number({})).to.be.undefined;
      expect(number({ x: 5 })).to.be.undefined;
      expect(number(new function() {})).to.be.undefined;
    });

    it('should return undefined when casting a map', function() {
      expect(number(new Map())).to.be.undefined;
    });

    it('should return undefined when casting a set', function() {
      expect(number(new Set())).to.be.undefined;
    });

    it('should return undefined when casting a weakmap', function() {
      expect(number(new WeakMap())).to.be.undefined;
    });

    it('should return undefined when casting a weakset', function() {
      expect(number(new WeakSet())).to.be.undefined;
    });

    it('should return undefined when casting undefined', function() {
      expect(number(undefined)).to.be.undefined;
    });

    it('should return undefined when casting null', function() {
      expect(number(null)).to.be.undefined;
    });

    it('should return undefined when casting NaN', function() {
      expect(number(NaN)).to.be.undefined;
    });
  });

  context('when using num (that uses number function)', function() {
    it('should return the primitive number value of a number', function() {
      expect(num(0)).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(num(1)).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(num(new Number(0))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(num(new Number(1))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(num(new Number(5))).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(num(Number(0))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(num(Number(1))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(num(Number(5))).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(num(5.5)).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');
      expect(num(0xFF)).to.be.a('number').and.to.equals(255).and.to.not.be.an('object');
      expect(num(0b111110111)).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
      expect(num(0o767)).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
    });

    it('should return the primitive number value of a string representing a number', function() {
      expect(num('0')).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(num('1')).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(num('5')).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(num('5.5')).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');
      expect(num('0xFF')).to.be.a('number').and.to.equals(255).and.to.not.be.an('object');
      expect(num('0b111110111')).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
      expect(num('0o767')).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
    });

    it('should return the primitive number value of a boolean', function() {
      expect(num(true)).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(num(false)).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(num(new Boolean(true))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(num(new Boolean(false))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(num(Boolean(1))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(num(Boolean(0))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
    });

    it('should return undefined when casting an infinite number', function() {
      expect(num(Infinity)).to.be.undefined;
      expect(num(-Infinity)).to.be.undefined;
      expect(num('Infinity')).to.be.undefined;
      expect(num('-Infinity')).to.be.undefined;
    });

    it('should return undefined when casting a symbol', function() {
      expect(num(Symbol('s'))).to.be.undefined;
    });

    it('should return undefined when casting a function', function() {
      expect(num(function f() {})).to.be.undefined;
    });

    it('should return undefined when casting a class', function() {
      expect(num(class c {})).to.be.undefined;
    });

    it('should return undefined when casting an error', function() {
      expect(num(new Error('error'))).to.be.undefined;
    });

    it('should return undefined when casting an array', function() {
      expect(num([])).to.be.undefined;
      expect(num([1, 2, 3])).to.be.undefined;
      expect(num([[1, 2], [3, 4, 5]])).to.be.undefined;
      expect(num(Array(5))).to.be.undefined;
      expect(num(new Array(1, 2, 3))).to.be.undefined;
    });

    it('should return undefined when casting an object', function() {
      expect(num({})).to.be.undefined;
      expect(num({ x: 5 })).to.be.undefined;
      expect(num(new function() {})).to.be.undefined;
    });

    it('should return undefined when casting a map', function() {
      expect(num(new Map())).to.be.undefined;
    });

    it('should return undefined when casting a set', function() {
      expect(num(new Set())).to.be.undefined;
    });

    it('should return undefined when casting a weakmap', function() {
      expect(num(new WeakMap())).to.be.undefined;
    });

    it('should return undefined when casting a weakset', function() {
      expect(num(new WeakSet())).to.be.undefined;
    });

    it('should return undefined when casting undefined', function() {
      expect(num(undefined)).to.be.undefined;
    });

    it('should return undefined when casting null', function() {
      expect(num(null)).to.be.undefined;
    });

    it('should return undefined when casting NaN', function() {
      expect(num(NaN)).to.be.undefined;
    });

    it('should return the specified number value when casting a number that is in the specified range', function() {
      expect(num(5, { ge: 4, le: 9 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(num(5, { ge: 0 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(num(5, { le: 100 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(num(5, { le: 5 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(num(5, { ge: 5 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');

      expect(num('5', { ge: 4, le: 9 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(num('5', { ge: 0 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(num('5', { le: 100 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(num('5', { le: 5 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(num('5', { ge: 5 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
    });

    it('should return undefined when casting a number that is out of the specified range', function() {
      expect(num(5, { ge: 6, le: 9 })).to.be.undefined;
      expect(num(5, { ge: 6 })).to.be.undefined;
      expect(num(5, { le: 4 })).to.be.undefined;

      expect(num('5', { ge: 6, le: 9 })).to.be.undefined;
      expect(num('5', { ge: 6 })).to.be.undefined;
      expect(num('5', { le: 4 })).to.be.undefined;
    });

    it('should return undefined when casting a number whose specified range is not valid', function() {
      expect(num(5, { ge: 4, le: 2 })).to.be.undefined;
    });
  });

  context('when using integer', function() {
    it('should return the primitive integer value of a number', function() {
      expect(integer(0)).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(integer(1)).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(integer(new Number(0))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(integer(new Number(1))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(integer(new Number(5))).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(integer(Number(0))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(integer(Number(1))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(integer(Number(5))).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(integer(5.5)).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(integer(0xFF)).to.be.a('number').and.to.equals(255).and.to.not.be.an('object');
      expect(integer(0b111110111)).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
      expect(integer(0o767)).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
    });

    it('should return the primitive integer value of a string representing a number', function() {
      expect(integer('0')).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(integer('1')).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(integer('5')).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(integer('5.5')).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(integer('0xFF')).to.be.a('number').and.to.equals(255).and.to.not.be.an('object');
      expect(integer('0b111110111')).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
      expect(integer('0o767')).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
    });

    it('should return the primitive integer value of a boolean', function() {
      expect(integer(true)).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(integer(false)).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(integer(new Boolean(true))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(integer(new Boolean(false))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(integer(Boolean(1))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(integer(Boolean(0))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
    });

    it('should return undefined when casting an infinite number', function() {
      expect(integer(Infinity)).to.be.undefined;
      expect(integer(-Infinity)).to.be.undefined;
      expect(integer('Infinity')).to.be.undefined;
      expect(integer('-Infinity')).to.be.undefined;
    });

    it('should return undefined when casting a symbol', function() {
      expect(integer(Symbol('s'))).to.be.undefined;
    });

    it('should return undefined when casting a function', function() {
      expect(integer(function f() {})).to.be.undefined;
    });

    it('should return undefined when casting a class', function() {
      expect(integer(class c {})).to.be.undefined;
    });

    it('should return undefined when casting an error', function() {
      expect(integer(new Error('error'))).to.be.undefined;
    });

    it('should return undefined when casting an array', function() {
      expect(integer([])).to.be.undefined;
      expect(integer([1, 2, 3])).to.be.undefined;
      expect(integer([[1, 2], [3, 4, 5]])).to.be.undefined;
      expect(integer(Array(5))).to.be.undefined;
      expect(integer(new Array(1, 2, 3))).to.be.undefined;
    });

    it('should return undefined when casting an object', function() {
      expect(integer({})).to.be.undefined;
      expect(integer({ x: 5 })).to.be.undefined;
      expect(integer(new function() {})).to.be.undefined;
    });

    it('should return undefined when casting a map', function() {
      expect(integer(new Map())).to.be.undefined;
    });

    it('should return undefined when casting a set', function() {
      expect(integer(new Set())).to.be.undefined;
    });

    it('should return undefined when casting a weakmap', function() {
      expect(integer(new WeakMap())).to.be.undefined;
    });

    it('should return undefined when casting a weakset', function() {
      expect(integer(new WeakSet())).to.be.undefined;
    });

    it('should return undefined when casting undefined', function() {
      expect(integer(undefined)).to.be.undefined;
    });

    it('should return undefined when casting null', function() {
      expect(integer(null)).to.be.undefined;
    });

    it('should return undefined when casting NaN', function() {
      expect(integer(NaN)).to.be.undefined;
    });
  });

  context('when using int (that uses integer function)', function() {
    it('should return the primitive integer value of a number', function() {
      expect(int(0)).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(int(1)).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(int(new Number(0))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(int(new Number(1))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(int(new Number(5))).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(int(Number(0))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(int(Number(1))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(int(Number(5))).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(int(5.5)).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(int(0xFF)).to.be.a('number').and.to.equals(255).and.to.not.be.an('object');
      expect(int(0b111110111)).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
      expect(int(0o767)).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
    });

    it('should return the primitive integer value of a string representing a number', function() {
      expect(int('0')).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(int('1')).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(int('5')).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(int('5.5')).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(int('0xFF')).to.be.a('number').and.to.equals(255).and.to.not.be.an('object');
      expect(int('0b111110111')).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
      expect(int('0o767')).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
    });

    it('should return the primitive integer value of a boolean', function() {
      expect(int(true)).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(int(false)).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(int(new Boolean(true))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(int(new Boolean(false))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(int(Boolean(1))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(int(Boolean(0))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
    });

    it('should return undefined when casting an infinite number', function() {
      expect(int(Infinity)).to.be.undefined;
      expect(int(-Infinity)).to.be.undefined;
      expect(int('Infinity')).to.be.undefined;
      expect(int('-Infinity')).to.be.undefined;
    });

    it('should return undefined when casting a symbol', function() {
      expect(int(Symbol('s'))).to.be.undefined;
    });

    it('should return undefined when casting a function', function() {
      expect(int(function f() {})).to.be.undefined;
    });

    it('should return undefined when casting a class', function() {
      expect(int(class c {})).to.be.undefined;
    });

    it('should return undefined when casting an error', function() {
      expect(int(new Error('error'))).to.be.undefined;
    });

    it('should return undefined when casting an array', function() {
      expect(int([])).to.be.undefined;
      expect(int([1, 2, 3])).to.be.undefined;
      expect(int([[1, 2], [3, 4, 5]])).to.be.undefined;
      expect(int(Array(5))).to.be.undefined;
      expect(int(new Array(1, 2, 3))).to.be.undefined;
    });

    it('should return undefined when casting an object', function() {
      expect(int({})).to.be.undefined;
      expect(int({ x: 5 })).to.be.undefined;
      expect(int(new function() {})).to.be.undefined;
    });

    it('should return undefined when casting a map', function() {
      expect(int(new Map())).to.be.undefined;
    });

    it('should return undefined when casting a set', function() {
      expect(int(new Set())).to.be.undefined;
    });

    it('should return undefined when casting a weakmap', function() {
      expect(int(new WeakMap())).to.be.undefined;
    });

    it('should return undefined when casting a weakset', function() {
      expect(int(new WeakSet())).to.be.undefined;
    });

    it('should return undefined when casting undefined', function() {
      expect(int(undefined)).to.be.undefined;
    });

    it('should return undefined when casting null', function() {
      expect(int(null)).to.be.undefined;
    });

    it('should return undefined when casting NaN', function() {
      expect(int(NaN)).to.be.undefined;
    });

    it('should return the specified integer value when casting a number that is in the specified range', function() {
      expect(int(5, { ge: 4, le: 9 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(int(5, { ge: 0 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(int(5, { le: 100 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(int(5, { le: 5 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(int(5, { ge: 5 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(int(5.5, { ge: 5, le: 5 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');

      expect(int('5', { ge: 4, le: 9 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(int('5', { ge: 0 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(int('5', { le: 100 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(int('5', { le: 5 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(int('5', { ge: 5 })).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
    });

    it('should return undefined when casting a number that is out of the specified range', function() {
      expect(int(5, { ge: 6, le: 9 })).to.be.undefined;
      expect(int(5, { ge: 6 })).to.be.undefined;
      expect(int(5, { le: 4 })).to.be.undefined;

      expect(int('5', { ge: 6, le: 9 })).to.be.undefined;
      expect(int('5', { ge: 6 })).to.be.undefined;
      expect(int('5', { le: 4 })).to.be.undefined;
    });

    it('should return undefined when casting a number whose specified range is not valid', function() {
      expect(int(5, { ge: 4, le: 2 })).to.be.undefined;
    });
  });

  context('when using toFloat', function() {
    it('should return the primitive float value of a number', function() {
      expect(toFloat(0)).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(toFloat(1)).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(toFloat(new Number(0))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(toFloat(new Number(1))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(toFloat(new Number(5))).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(toFloat(Number(0))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(toFloat(Number(1))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(toFloat(Number(5))).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(toFloat(5.5)).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');
      expect(toFloat(5.555)).to.be.a('number').and.to.equals(5.555).and.to.not.be.an('object');
      expect(toFloat(0.10)).to.be.a('number').and.to.equals(0.1).and.to.not.be.an('object');
      expect(toFloat(0xFF)).to.be.a('number').and.to.equals(255).and.to.not.be.an('object');
      expect(toFloat(0b111110111)).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
      expect(toFloat(0o767)).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
    });

    it('should return the primitive float value of a string representing a number', function() {
      expect(toFloat('0')).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(toFloat('1')).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(toFloat('5')).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(toFloat('5.5')).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');
      expect(toFloat('5.555')).to.be.a('number').and.to.equals(5.555).and.to.not.be.an('object');
      expect(toFloat('0.10')).to.be.a('number').and.to.equals(0.1).and.to.not.be.an('object');
      expect(toFloat('0xFF')).to.be.a('number').and.to.equals(255).and.to.not.be.an('object');
      expect(toFloat('0b111110111')).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
      expect(toFloat('0o767')).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
    });

    it('should return the primitive float value of a boolean', function() {
      expect(toFloat(true)).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(toFloat(false)).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(toFloat(new Boolean(true))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(toFloat(new Boolean(false))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(toFloat(Boolean(1))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(toFloat(Boolean(0))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
    });

    it('should return undefined when casting an infinite number', function() {
      expect(toFloat(Infinity)).to.be.undefined;
      expect(toFloat(-Infinity)).to.be.undefined;
      expect(toFloat('Infinity')).to.be.undefined;
      expect(toFloat('-Infinity')).to.be.undefined;
    });

    it('should return undefined when casting a symbol', function() {
      expect(toFloat(Symbol('s'))).to.be.undefined;
    });

    it('should return undefined when casting a function', function() {
      expect(toFloat(function f() {})).to.be.undefined;
    });

    it('should return undefined when casting a class', function() {
      expect(toFloat(class c {})).to.be.undefined;
    });

    it('should return undefined when casting an error', function() {
      expect(toFloat(new Error('error'))).to.be.undefined;
    });

    it('should return undefined when casting an array', function() {
      expect(toFloat([])).to.be.undefined;
      expect(toFloat([1, 2, 3])).to.be.undefined;
      expect(toFloat([[1, 2], [3, 4, 5]])).to.be.undefined;
      expect(toFloat(Array(5))).to.be.undefined;
      expect(toFloat(new Array(1, 2, 3))).to.be.undefined;
    });

    it('should return undefined when casting an object', function() {
      expect(toFloat({})).to.be.undefined;
      expect(toFloat({ x: 5 })).to.be.undefined;
      expect(toFloat(new function() {})).to.be.undefined;
    });

    it('should return undefined when casting a map', function() {
      expect(toFloat(new Map())).to.be.undefined;
    });

    it('should return undefined when casting a set', function() {
      expect(toFloat(new Set())).to.be.undefined;
    });

    it('should return undefined when casting a weakmap', function() {
      expect(toFloat(new WeakMap())).to.be.undefined;
    });

    it('should return undefined when casting a weakset', function() {
      expect(toFloat(new WeakSet())).to.be.undefined;
    });

    it('should return undefined when casting undefined', function() {
      expect(toFloat(undefined)).to.be.undefined;
    });

    it('should return undefined when casting null', function() {
      expect(toFloat(null)).to.be.undefined;
    });

    it('should return undefined when casting NaN', function() {
      expect(toFloat(NaN)).to.be.undefined;
    });
  });

  context('when using float (that uses toFloat function)', function() {
    it('should return the primitive float value of a number', function() {
      expect(float(0)).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(float(1)).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(float(new Number(0))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(float(new Number(1))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(float(new Number(5))).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(float(Number(0))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(float(Number(1))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(float(Number(5))).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(float(5.5)).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');
      expect(float(5.555)).to.be.a('number').and.to.equals(5.555).and.to.not.be.an('object');
      expect(float(0.10)).to.be.a('number').and.to.equals(0.1).and.to.not.be.an('object');
      expect(float(0xFF)).to.be.a('number').and.to.equals(255).and.to.not.be.an('object');
      expect(float(0b111110111)).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
      expect(float(0o767)).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
    });

    it('should return the primitive float value of a string representing a number', function() {
      expect(float('0')).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(float('1')).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(float('5')).to.be.a('number').and.to.equals(5).and.to.not.be.an('object');
      expect(float('5.5')).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');
      expect(float('5.555')).to.be.a('number').and.to.equals(5.555).and.to.not.be.an('object');
      expect(float('0.10')).to.be.a('number').and.to.equals(0.1).and.to.not.be.an('object');
      expect(float('0xFF')).to.be.a('number').and.to.equals(255).and.to.not.be.an('object');
      expect(float('0b111110111')).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
      expect(float('0o767')).to.be.a('number').and.to.equals(503).and.to.not.be.an('object');
    });

    it('should return the primitive float value of a boolean', function() {
      expect(float(true)).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(float(false)).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(float(new Boolean(true))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(float(new Boolean(false))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
      expect(float(Boolean(1))).to.be.a('number').and.to.equals(1).and.to.not.be.an('object');
      expect(float(Boolean(0))).to.be.a('number').and.to.equals(0).and.to.not.be.an('object');
    });

    it('should return undefined when casting an infinite number', function() {
      expect(float(Infinity)).to.be.undefined;
      expect(float(-Infinity)).to.be.undefined;
      expect(float('Infinity')).to.be.undefined;
      expect(float('-Infinity')).to.be.undefined;
    });

    it('should return undefined when casting a symbol', function() {
      expect(float(Symbol('s'))).to.be.undefined;
    });

    it('should return undefined when casting a function', function() {
      expect(float(function f() {})).to.be.undefined;
    });

    it('should return undefined when casting a class', function() {
      expect(float(class c {})).to.be.undefined;
    });

    it('should return undefined when casting an error', function() {
      expect(float(new Error('error'))).to.be.undefined;
    });

    it('should return undefined when casting an array', function() {
      expect(float([])).to.be.undefined;
      expect(float([1, 2, 3])).to.be.undefined;
      expect(float([[1, 2], [3, 4, 5]])).to.be.undefined;
      expect(float(Array(5))).to.be.undefined;
      expect(float(new Array(1, 2, 3))).to.be.undefined;
    });

    it('should return undefined when casting an object', function() {
      expect(float({})).to.be.undefined;
      expect(float({ x: 5 })).to.be.undefined;
      expect(float(new function() {})).to.be.undefined;
    });

    it('should return undefined when casting a map', function() {
      expect(float(new Map())).to.be.undefined;
    });

    it('should return undefined when casting a set', function() {
      expect(float(new Set())).to.be.undefined;
    });

    it('should return undefined when casting a weakmap', function() {
      expect(float(new WeakMap())).to.be.undefined;
    });

    it('should return undefined when casting a weakset', function() {
      expect(float(new WeakSet())).to.be.undefined;
    });

    it('should return undefined when casting undefined', function() {
      expect(float(undefined)).to.be.undefined;
    });

    it('should return undefined when casting null', function() {
      expect(float(null)).to.be.undefined;
    });

    it('should return undefined when casting NaN', function() {
      expect(float(NaN)).to.be.undefined;
    });

    it('should return the specified float value when casting a number that is in the specified range', function() {
      expect(float(5.5, { ge: 4, le: 9 })).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');
      expect(float(5.5, { ge: 0 })).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');
      expect(float(5.5, { le: 100 })).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');
      expect(float(5.5, { le: 5.5 })).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');
      expect(float(5.5, { ge: 5.5 })).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');
      expect(float(5.5, { ge: 5.5, le: 5.5 })).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');

      expect(float('5.5', { ge: 4, le: 9 })).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');
      expect(float('5.5', { ge: 0 })).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');
      expect(float('5.5', { le: 100 })).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');
      expect(float('5.5', { le: 5.5 })).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');
      expect(float('5.5', { ge: 5.5 })).to.be.a('number').and.to.equals(5.5).and.to.not.be.an('object');
    });

    it('should return undefined when casting a number that is out of the specified range', function() {
      expect(float(5.5, { ge: 6, le: 9 })).to.be.undefined;
      expect(float(5.5, { ge: 6 })).to.be.undefined;
      expect(float(5.5, { le: 4 })).to.be.undefined;

      expect(float('5.5', { ge: 6, le: 9 })).to.be.undefined;
      expect(float('5.5', { ge: 6 })).to.be.undefined;
      expect(float('5.5', { le: 4 })).to.be.undefined;
    });

    it('should return undefined when casting a number whose specified range is not valid', function() {
      expect(float(5.5, { ge: 4, le: 2 })).to.be.undefined;
    });
  });

  context('when using bool', function() {
    it('should return the primitive boolean value of a boolean', function() {
      expect(bool(true)).to.be.a('boolean').and.to.be.true.and.to.not.be.an('object');
      expect(bool(false)).to.be.a('boolean').and.to.be.false.and.to.not.be.an('object');
      expect(bool(new Boolean(true))).to.be.a('boolean').and.to.be.true.and.to.not.be.an('object');
      expect(bool(new Boolean(false))).to.be.a('boolean').and.to.be.false.and.to.not.be.an('object');
      expect(bool(new Boolean(1))).to.be.a('boolean').and.to.be.true.and.to.not.be.an('object');
      expect(bool(new Boolean(0))).to.be.a('boolean').and.to.be.false.and.to.not.be.an('object');
      expect(bool(Boolean(1))).to.be.a('boolean').and.to.be.true.and.to.not.be.an('object');
      expect(bool(Boolean(0))).to.be.a('boolean').and.to.be.false.and.to.not.be.an('object');
    });

    it('should return the primitive boolean value of a string if can be inferred', function() {
      expect(bool('true')).to.be.a('boolean').and.to.be.true.and.to.not.be.an('object');
      expect(bool('false')).to.be.a('boolean').and.to.be.false.and.to.not.be.an('object');
      expect(bool('1')).to.be.a('boolean').and.to.be.true.and.to.not.be.an('object');
      expect(bool('0')).to.be.a('boolean').and.to.be.false.and.to.not.be.an('object');
      expect(bool(new String('true'))).to.be.a('boolean').and.to.be.true.and.to.not.be.an('object');
      expect(bool(new String('false'))).to.be.a('boolean').and.to.be.false.and.to.not.be.an('object');
      expect(bool(new String('1'))).to.be.a('boolean').and.to.be.true.and.to.not.be.an('object');
      expect(bool(new String('0'))).to.be.a('boolean').and.to.be.false.and.to.not.be.an('object');
      expect(bool(String('true'))).to.be.a('boolean').and.to.be.true.and.to.not.be.an('object');
      expect(bool(String('false'))).to.be.a('boolean').and.to.be.false.and.to.not.be.an('object');
      expect(bool(String('1'))).to.be.a('boolean').and.to.be.true.and.to.not.be.an('object');
      expect(bool(String('0'))).to.be.a('boolean').and.to.be.false.and.to.not.be.an('object');
    });

    it('should return the primitive boolean representation of a number for 0 and 1', function() {
      expect(bool(1)).to.be.a('boolean').and.to.be.true.and.to.not.be.an('object');
      expect(bool(0)).to.be.a('boolean').and.to.be.false.and.to.not.be.an('object');
      expect(bool(new Number(1))).to.be.a('boolean').and.to.be.true.and.to.not.be.an('object');
      expect(bool(new Number(0))).to.be.a('boolean').and.to.be.false.and.to.not.be.an('object');
      expect(bool(Number(1))).to.be.a('boolean').and.to.be.true.and.to.not.be.an('object');
      expect(bool(Number(0))).to.be.a('boolean').and.to.be.false.and.to.not.be.an('object');
    });

    it('should return undefined when casting a string that does not represent a boolean', function() {
      expect(bool('')).to.be.undefined;
      expect(bool('  ')).to.be.undefined;
      expect(bool('bool')).to.be.undefined;
      expect(bool('TRUE')).to.be.undefined;
      expect(bool('FALSE')).to.be.undefined;
      expect(bool('00')).to.be.undefined;
      expect(bool('11')).to.be.undefined;
      expect(bool(new String(''))).to.be.undefined;
      expect(bool(new String('  '))).to.be.undefined;
      expect(bool(new String('bool'))).to.be.undefined;
      expect(bool(new String('TRUE'))).to.be.undefined;
      expect(bool(new String('FALSE'))).to.be.undefined;
      expect(bool(new String('00'))).to.be.undefined;
      expect(bool(new String('11'))).to.be.undefined;
      expect(bool(String(''))).to.be.undefined;
      expect(bool(String('  '))).to.be.undefined;
      expect(bool(String('bool'))).to.be.undefined;
      expect(bool(String('TRUE'))).to.be.undefined;
      expect(bool(String('FALSE'))).to.be.undefined;
      expect(bool(String('00'))).to.be.undefined;
      expect(bool(String('11'))).to.be.undefined;
    });

    it('should return undefined when casting a number different from 0 or 1', function() {
      expect(bool(10)).to.be.undefined;
      expect(bool(0.1)).to.be.undefined;
      expect(bool(5555)).to.be.undefined;
      expect(bool(new Number(10))).to.be.undefined;
      expect(bool(new Number(0.1))).to.be.undefined;
      expect(bool(new Number(5555))).to.be.undefined;
      expect(bool(Number(10))).to.be.undefined;
      expect(bool(Number(0.1))).to.be.undefined;
      expect(bool(Number(5555))).to.be.undefined;
    });

    it('should return undefined when casting a symbol', function() {
      expect(bool(Symbol('s'))).to.be.undefined;
    });

    it('should return undefined when casting a function', function() {
      expect(bool(function f() {})).to.be.undefined;
    });

    it('should return undefined when casting a class', function() {
      expect(bool(class c {})).to.be.undefined;
    });

    it('should return undefined when casting an error', function() {
      expect(bool(new Error('error'))).to.be.undefined;
    });

    it('should return undefined when casting an array', function() {
      expect(bool([])).to.be.undefined;
      expect(bool([1, 2, 3])).to.be.undefined;
      expect(bool([[1, 2], [3, 4, 5]])).to.be.undefined;
      expect(bool(Array(5))).to.be.undefined;
      expect(bool(new Array(1, 2, 3))).to.be.undefined;
    });

    it('should return undefined when casting an object', function() {
      expect(bool({})).to.be.undefined;
      expect(bool({ x: 5 })).to.be.undefined;
      expect(bool(new function() {})).to.be.undefined;
    });

    it('should return undefined when casting a map', function() {
      expect(bool(new Map())).to.be.undefined;
    });

    it('should return undefined when casting a set', function() {
      expect(bool(new Set())).to.be.undefined;
    });

    it('should return undefined when casting a weakmap', function() {
      expect(bool(new WeakMap())).to.be.undefined;
    });

    it('should return undefined when casting a weakset', function() {
      expect(bool(new WeakSet())).to.be.undefined;
    });

    it('should return undefined when casting undefined', function() {
      expect(bool(undefined)).to.be.undefined;
    });

    it('should return undefined when casting null', function() {
      expect(bool(null)).to.be.undefined;
    });

    it('should return undefined when casting NaN', function() {
      expect(bool(NaN)).to.be.undefined;
    });
  });

  context('when using arr', function() {
    it('should return an array when casting an array with no mutation', function() {
      const a = [];
      const b = [5];
      const c = new Array(1, 2, 3);
      const d = Array(5);
      const castA = arr(a);
      const castB = arr(b);
      const castC = arr(c);
      const castD = arr(d);
      const base = [1, 2];
      const mutation = base;

      expect(castA).to.be.an('array').and.to.have.length(0);
      expect(castB).to.be.an('array').and.to.have.length(1);
      expect(castC).to.be.an('array').and.to.have.length(3);
      expect(castD).to.be.an('array').and.to.have.length(5);
      expect(arr([[1, 2], [3, 4, 5]])).to.be.an('array').and.to.have.length(2);
      expect(mutation).to.be.an('array').and.to.have.length(2);

      castA[0] = 1000;
      castB[0] = 1000;
      castC[0] = 1000;
      castD[0] = 1000;
      mutation[0] = 1000;

      expect(base[0]).to.equals(1000);
      expect(a[0]).to.be.undefined;
      expect(b[0]).to.equals(5);
      expect(c[0]).to.equals(1);
      expect(d[0]).to.be.undefined;
    });

    it('should return an array when casting a string if can be inferred', function() {
      expect(arr('[]')).to.be.an('array').and.to.have.length(0);
      expect(arr('[1, 2, 3]')).to.be.an('array').and.to.have.length(3);
      expect(arr('[5]')).to.be.an('array').and.to.have.length(1);
      expect(arr('[[1, 2], [3, 4, 5]]')).to.be.an('array').and.to.have.length(2);
      expect(arr(new String('[]'))).to.be.an('array').and.to.have.length(0);
      expect(arr(new String('[1, 2, 3]'))).to.be.an('array').and.to.have.length(3);
      expect(arr(new String('[5]'))).to.be.an('array').and.to.have.length(1);
      expect(arr(new String('[[1, 2], [3, 4, 5]]'))).to.be.an('array').and.to.have.length(2);
      expect(arr(String('[]'))).to.be.an('array').and.to.have.length(0);
      expect(arr(String('[1, 2, 3]'))).to.be.an('array').and.to.have.length(3);
      expect(arr(String('[5]'))).to.be.an('array').and.to.have.length(1);
      expect(arr(String('[[1, 2], [3, 4, 5]]'))).to.be.an('array').and.to.have.length(2);

      const a = arr('[1, 2, 3]');
      expect(a[0]).to.equals(1);
      expect(a[1]).to.equals(2);
      expect(a[2]).to.equals(3);
      expect(a[3]).to.be.undefined;

      const b = arr(new String('[1, 2, 3]'));
      expect(b[0]).to.equals(1);
      expect(b[1]).to.equals(2);
      expect(b[2]).to.equals(3);
      expect(b[3]).to.be.undefined;

      const c = arr(String('[1, 2, 3]'));
      expect(c[0]).to.equals(1);
      expect(c[1]).to.equals(2);
      expect(c[2]).to.equals(3);
      expect(c[3]).to.be.undefined;
    });

    it('should return an array when casting an empty array with allowEmpty option explicitly set to true', function() {
      expect(arr([], true)).to.be.an('array').and.to.have.length(0);
      expect(arr(new Array(), true)).to.be.an('array').and.to.have.length(0);
      expect(arr(Array(), true)).to.be.an('array').and.to.have.length(0);
      expect(arr('[]', true)).to.be.an('array').and.to.have.length(0);
    });

    it('should return undefined when casting an empty array with allowEmpty option set to false', function() {
      expect(arr([], false)).to.be.undefined;
      expect(arr(new Array(), false)).to.be.undefined;
      expect(arr(Array(), false)).to.be.undefined;
      expect(arr('[]', false)).to.be.undefined;
    });

    it('should return undefined when casting a string that does not represent an array', function() {
      expect(arr('')).to.be.undefined;
      expect(arr('  ')).to.be.undefined;
      expect(arr('[')).to.be.undefined;
      expect(arr(']')).to.be.undefined;
      expect(arr('{}')).to.be.undefined;
      expect(arr('[1, 2]]')).to.be.undefined;
      expect(arr(new String(''))).to.be.undefined;
      expect(arr(new String('  '))).to.be.undefined;
      expect(arr(new String('['))).to.be.undefined;
      expect(arr(new String(']'))).to.be.undefined;
      expect(arr(new String('{}'))).to.be.undefined;
      expect(arr(new String('[1, 2]]'))).to.be.undefined;
      expect(arr(String(''))).to.be.undefined;
      expect(arr(String('  '))).to.be.undefined;
      expect(arr(String('['))).to.be.undefined;
      expect(arr(String(']'))).to.be.undefined;
      expect(arr(String('{}'))).to.be.undefined;
      expect(arr(String('[1, 2]]'))).to.be.undefined;
    });

    it('should return undefined when casting a boolean', function() {
      expect(arr(true)).to.be.undefined;
      expect(arr(false)).to.be.undefined;
      expect(arr(new Boolean(true))).to.be.undefined;
      expect(arr(new Boolean(false))).to.be.undefined;
      expect(arr(new Boolean(1))).to.be.undefined;
      expect(arr(new Boolean(0))).to.be.undefined;
      expect(arr(Boolean(1))).to.be.undefined;
      expect(arr(Boolean(0))).to.be.undefined;
    });

    it('should return undefined when casting a number', function() {
      expect(arr(0)).to.be.undefined;
      expect(arr(1)).to.be.undefined;
      expect(arr(5555)).to.be.undefined;
      expect(arr(new Number(0))).to.be.undefined;
      expect(arr(new Number(1))).to.be.undefined;
      expect(arr(new Number(5555))).to.be.undefined;
      expect(arr(Number(0))).to.be.undefined;
      expect(arr(Number(1))).to.be.undefined;
      expect(arr(Number(5555))).to.be.undefined;
    });

    it('should return undefined when casting a symbol', function() {
      expect(arr(Symbol('s'))).to.be.undefined;
    });

    it('should return undefined when casting a function', function() {
      expect(arr(function f() {})).to.be.undefined;
    });

    it('should return undefined when casting a class', function() {
      expect(arr(class c {})).to.be.undefined;
    });

    it('should return undefined when casting an error', function() {
      expect(arr(new Error('error'))).to.be.undefined;
    });

    it('should return undefined when casting an object', function() {
      expect(arr({})).to.be.undefined;
      expect(arr({ x: 5 })).to.be.undefined;
      expect(arr(new function() {})).to.be.undefined;
    });

    it('should return undefined when casting a map', function() {
      expect(arr(new Map())).to.be.undefined;
    });

    it('should return undefined when casting a set', function() {
      expect(arr(new Set())).to.be.undefined;
    });

    it('should return undefined when casting a weakmap', function() {
      expect(arr(new WeakMap())).to.be.undefined;
    });

    it('should return undefined when casting a weakset', function() {
      expect(arr(new WeakSet())).to.be.undefined;
    });

    it('should return undefined when casting undefined', function() {
      expect(arr(undefined)).to.be.undefined;
    });

    it('should return undefined when casting null', function() {
      expect(arr(null)).to.be.undefined;
    });

    it('should return undefined when casting NaN', function() {
      expect(arr(NaN)).to.be.undefined;
    });
  });

  context('when using date', function() {
    it('should return a date when casting a date with no mutation', function() {
      const a = new Date();
      const b = new Date();
      const castA = date(a);
      const castB = date(b);
      const base = new Date();
      const mutation = base;

      expect(castA).to.be.a('date');
      expect(castB).to.be.a('date');
      expect(castA.toDateString()).to.be.equals(a.toDateString());
      expect(castB.toDateString()).to.be.equals(b.toDateString());
      expect(base.toDateString()).to.be.equals(mutation.toDateString());

      castA.setFullYear(2000);
      castB.setFullYear(2000);
      mutation.setFullYear(2000);

      expect(castA.toDateString()).to.not.equals(a.toDateString());
      expect(castA.getFullYear()).to.equals(2000);
      expect(a.getFullYear()).to.not.equals(2000);
      expect(castB.toDateString()).to.not.equals(b.toDateString());
      expect(castB.getFullYear()).to.equals(2000);
      expect(a.getFullYear()).to.not.equals(2000);
      expect(mutation.toDateString()).to.equals(base.toDateString());
      expect(mutation.getFullYear()).to.equals(2000);
      expect(base.getFullYear()).to.equals(2000);
    });

    it('should return a date when casting a string if can be inferred', function() {
      expect(date('Mon Apr 16 2018')).to.be.a('date');
      expect(date('2018-04-16T12:56:14.642Z')).to.be.a('date');
      expect(date('2018')).to.be.a('date');
      expect(date('2018').getFullYear()).to.equals(2018);

      expect(date(new String('Mon Apr 16 2018'))).to.be.a('date');
      expect(date(new String('2018-04-16T12:56:14.642Z'))).to.be.a('date');
      expect(date(new String('2018'))).to.be.a('date');
      expect(date(new String('2018')).getFullYear()).to.equals(2018);

      expect(date(String('Mon Apr 16 2018'))).to.be.a('date');
      expect(date(String('2018-04-16T12:56:14.642Z'))).to.be.a('date');
      expect(date(String('2018'))).to.be.a('date');
      expect(date(String('2018')).getFullYear()).to.equals(2018);
    });

    it('should return a date when casting a number', function() {
      expect(date(-2018)).to.be.a('date');
      expect(date(2018)).to.be.a('date');
      expect(date(1523883374642)).to.be.a('date');
      expect(date(1523883374642).toDateString()).to.equals('Mon Apr 16 2018');
      expect(date(1523883374642).toISOString()).to.equals('2018-04-16T12:56:14.642Z');

      expect(date(new Number(2018))).to.be.a('date');
      expect(date(new Number(1523883374642))).to.be.a('date');
      expect(date(new Number(1523883374642)).toDateString()).to.equals('Mon Apr 16 2018');
      expect(date(new Number(1523883374642)).toISOString()).to.equals('2018-04-16T12:56:14.642Z');

      expect(date(Number(2018))).to.be.a('date');
      expect(date(Number(1523883374642))).to.be.a('date');
      expect(date(Number(1523883374642)).toDateString()).to.equals('Mon Apr 16 2018');
      expect(date(Number(1523883374642)).toISOString()).to.equals('2018-04-16T12:56:14.642Z');
    });

    it('should return undefined when casting a string that does not represent a date', function() {
      expect(date('')).to.be.undefined;
      expect(date('  ')).to.be.undefined;
      expect(date('date')).to.be.undefined;
      expect(date('1523883374642')).to.be.undefined;

      expect(date(new String(''))).to.be.undefined;
      expect(date(new String('  '))).to.be.undefined;
      expect(date(new String('date'))).to.be.undefined;
      expect(date(new String('1523883374642'))).to.be.undefined;

      expect(date(String(''))).to.be.undefined;
      expect(date(String('  '))).to.be.undefined;
      expect(date(String('date'))).to.be.undefined;
      expect(date(String('1523883374642'))).to.be.undefined;
    });

    it('should return undefined when casting an array ', function() {
      expect(date([])).to.be.undefined;
      expect(date([1, 2, 3])).to.be.undefined;
      expect(date(new Array())).to.be.undefined;
      expect(date(Array())).to.be.undefined;
    });

    it('should return undefined when casting a boolean', function() {
      expect(date(true)).to.be.undefined;
      expect(date(false)).to.be.undefined;
      expect(date(new Boolean(true))).to.be.undefined;
      expect(date(new Boolean(false))).to.be.undefined;
      expect(date(new Boolean(1))).to.be.undefined;
      expect(date(new Boolean(0))).to.be.undefined;
      expect(date(Boolean(1))).to.be.undefined;
      expect(date(Boolean(0))).to.be.undefined;
    });

    it('should return undefined when casting a symbol', function() {
      expect(date(Symbol('s'))).to.be.undefined;
    });

    it('should return undefined when casting a function', function() {
      expect(date(function f() {})).to.be.undefined;
    });

    it('should return undefined when casting a class', function() {
      expect(date(class c {})).to.be.undefined;
    });

    it('should return undefined when casting an error', function() {
      expect(date(new Error('error'))).to.be.undefined;
    });

    it('should return undefined when casting an object', function() {
      expect(date({})).to.be.undefined;
      expect(date({ x: 5 })).to.be.undefined;
      expect(date(new function() {})).to.be.undefined;
    });

    it('should return undefined when casting a map', function() {
      expect(date(new Map())).to.be.undefined;
    });

    it('should return undefined when casting a set', function() {
      expect(date(new Set())).to.be.undefined;
    });

    it('should return undefined when casting a weakmap', function() {
      expect(date(new WeakMap())).to.be.undefined;
    });

    it('should return undefined when casting a weakset', function() {
      expect(date(new WeakSet())).to.be.undefined;
    });

    it('should return undefined when casting undefined', function() {
      expect(date(undefined)).to.be.undefined;
    });

    it('should return undefined when casting null', function() {
      expect(date(null)).to.be.undefined;
    });

    it('should return undefined when casting NaN', function() {
      expect(date(NaN)).to.be.undefined;
    });
  });

  context('when using round', function() {
    it('should return undefined when not a number', function () {
      expect(round(undefined)).to.be.undefined;
      expect(round(null)).to.be.undefined;
      expect(round(NaN)).to.be.undefined;
      expect(round('number')).to.be.undefined;
    });

    it('should return a rounded value with specified decimals', function () {
      expect(round(5.7999, 3)).to.be.a('string').and.to.equals('5.800');
      expect(round('5.7999', 3)).to.be.a('string').and.to.equals('5.800');
    });

    it('should return a value with specified decimals', function () {
      expect(round(5.7523, 2)).to.be.a('string').and.to.equals('5.75');
      expect(round('5.7523', 2)).to.be.a('string').and.to.equals('5.75');
    });

    it('should return a rounded value with no decimals by default or if nbDecimals is out of range', function () {
      expect(round(5.7523)).to.be.a('string').and.to.equals('6');
      expect(round(5.7523, -1)).to.be.a('string').and.to.equals('6');
      expect(round(5.7523, 101)).to.be.a('string').and.to.equals('6');
    });
  });

  context('when using precision', function() {
    it('should return undefined when not a number', function () {
      expect(precision(undefined)).to.be.undefined;
      expect(precision(null)).to.be.undefined;
      expect(precision(NaN)).to.be.undefined;
      expect(precision('number')).to.be.undefined;
    });

    it('should return a value with specified decimals', function () {
      expect(precision(5.7998, 3)).to.be.a('string').and.to.equals('5.799');
      expect(precision('5.7998', 3)).to.be.a('string').and.to.equals('5.799');
    });

    it('should return a value with 1 default decimals if not specified or out of range', function () {
      expect(precision(5.7523)).to.be.a('string').and.to.equals('5.7');
      expect(precision(5.7523, 0)).to.be.a('string').and.to.equals('5.7');
      expect(precision(5.7523, -1)).to.be.a('string').and.to.equals('5.7');
    });
  });
});
