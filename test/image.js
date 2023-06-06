const fs = require('fs');
const crypto = require('crypto');
const { expect } = require('./Common');
const { image: { isPng } } = require('../src');

describe('#image', function() {
  context('when using isPng', function() {
    it('should return true when testing a png image', function() {
      const buffer1 = fs.readFileSync(`${__dirname}/fixtures/image/1.png`);
      const buffer2 = fs.readFileSync(`${__dirname}/fixtures/image/2.png`);
      const buffer3 = fs.readFileSync(`${__dirname}/fixtures/image/3.png`);

      expect(isPng(buffer1)).to.be.a('boolean').and.to.be.true;
      expect(isPng(buffer2)).to.be.a('boolean').and.to.be.true;
      expect(isPng(buffer3)).to.be.a('boolean').and.to.be.true;
    });

    it('should return false when testing a jpg/jpeg image', function() {
      const buffer1 = fs.readFileSync(`${__dirname}/fixtures/image/1.jpeg`);
      const buffer2 = fs.readFileSync(`${__dirname}/fixtures/image/2.jpg`);
      const buffer3 = fs.readFileSync(`${__dirname}/fixtures/image/3.jpg`);

      expect(isPng(buffer1)).to.be.a('boolean').and.to.be.false;
      expect(isPng(buffer2)).to.be.a('boolean').and.to.be.false;
      expect(isPng(buffer3)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a gif image', function() {
      const buffer1 = fs.readFileSync(`${__dirname}/fixtures/image/1.gif`);

      expect(isPng(buffer1)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a svg image', function() {
      const buffer1 = fs.readFileSync(`${__dirname}/fixtures/image/1.svg`);

      expect(isPng(buffer1)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a random buffer', function() {
      const buffer1 = crypto.randomBytes(256);
      const buffer2 = crypto.randomBytes(128);
      const buffer3 = crypto.randomBytes(64);

      expect(isPng(buffer1)).to.be.a('boolean').and.to.be.false;
      expect(isPng(buffer2)).to.be.a('boolean').and.to.be.false;
      expect(isPng(buffer3)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a string', function() {
      expect(isPng('')).to.be.a('boolean').and.to.be.false;
      expect(isPng('  ')).to.be.a('boolean').and.to.be.false;
      expect(isPng('s')).to.be.a('boolean').and.to.be.false;
      expect(isPng("")).to.be.a('boolean').and.to.be.false;
      expect(isPng("  ")).to.be.a('boolean').and.to.be.false;
      expect(isPng("s")).to.be.a('boolean').and.to.be.false;
      expect(isPng(new String(''))).to.be.a('boolean').and.to.be.false;
      expect(isPng(new String('  '))).to.be.a('boolean').and.to.be.false;
      expect(isPng(new String('s'))).to.be.a('boolean').and.to.be.false;
      expect(isPng(new String(""))).to.be.a('boolean').and.to.be.false;
      expect(isPng(new String("  "))).to.be.a('boolean').and.to.be.false;
      expect(isPng(new String("s"))).to.be.a('boolean').and.to.be.false;
      expect(isPng(String(''))).to.be.a('boolean').and.to.be.false;
      expect(isPng(String('  '))).to.be.a('boolean').and.to.be.false;
      expect(isPng(String('s'))).to.be.a('boolean').and.to.be.false;
      expect(isPng(String(""))).to.be.a('boolean').and.to.be.false;
      expect(isPng(String("  "))).to.be.a('boolean').and.to.be.false;
      expect(isPng(String("s"))).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a number', function() {
      expect(isPng(0)).to.be.a('boolean').and.to.be.false;
      expect(isPng(1)).to.be.a('boolean').and.to.be.false;
      expect(isPng(5)).to.be.a('boolean').and.to.be.false;
      expect(isPng(new Number(0))).to.be.a('boolean').and.to.be.false;
      expect(isPng(new Number(1))).to.be.a('boolean').and.to.be.false;
      expect(isPng(new Number(5))).to.be.a('boolean').and.to.be.false;
      expect(isPng(Number(0))).to.be.a('boolean').and.to.be.false;
      expect(isPng(Number(1))).to.be.a('boolean').and.to.be.false;
      expect(isPng(Number(5))).to.be.a('boolean').and.to.be.false;
      expect(isPng(5.5)).to.be.a('boolean').and.to.be.false;
      expect(isPng(Infinity)).to.be.a('boolean').and.to.be.false;
      expect(isPng(0xFF)).to.be.a('boolean').and.to.be.false;
      expect(isPng(0b111110111)).to.be.a('boolean').and.to.be.false;
      expect(isPng(0o767)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a boolean', function() {
      expect(isPng(true)).to.be.a('boolean').and.to.be.false;
      expect(isPng(false)).to.be.a('boolean').and.to.be.false;
      expect(isPng(new Boolean(true))).to.be.a('boolean').and.to.be.false;
      expect(isPng(new Boolean(false))).to.be.a('boolean').and.to.be.false;
      expect(isPng(Boolean(1))).to.be.a('boolean').and.to.be.false;
      expect(isPng(Boolean(0))).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a symbol', function() {
      expect(isPng(Symbol('s'))).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a function', function() {
      expect(isPng(function f() {})).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a class', function() {
      expect(isPng(class c {})).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing an error', function() {
      expect(isPng(new Error('error'))).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing an array', function() {
      expect(isPng([])).to.be.a('boolean').and.to.be.false;
      expect(isPng([1, 2, 3])).to.be.a('boolean').and.to.be.false;
      expect(isPng([[1, 2], [3, 4, 5]])).to.be.a('boolean').and.to.be.false;
      expect(isPng(Array(5))).to.be.a('boolean').and.to.be.false;
      expect(isPng(new Array(1, 2, 3))).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing an object', function() {
      expect(isPng({})).to.be.a('boolean').and.to.be.false;
      expect(isPng({ x: 5 })).to.be.a('boolean').and.to.be.false;
      expect(isPng(new function() {})).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a map', function() {
      expect(isPng(new Map())).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a set', function() {
      expect(isPng(new Set())).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a weakmap', function() {
      expect(isPng(new WeakMap())).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a weakset', function() {
      expect(isPng(new WeakSet())).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing undefined', function() {
      expect(isPng(undefined)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing null', function() {
      expect(isPng(null)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing NaN', function() {
      expect(isPng(NaN)).to.be.a('boolean').and.to.be.false;
    });
  });
});
