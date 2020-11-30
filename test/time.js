const { execSync } = require('child_process');
const { expect } = require('./Common');
const { time: { isISOStringDate, sleep, toLocaleISOString, timeout } } = require('../lib');

describe('#time', function() {
  context('when using isISOStringDate', function() {
    it('should return true when a date is a string in ISO format', function () {
      expect(isISOStringDate('2018-04-19T13:20:03.896Z')).to.be.a('boolean').and.to.be.true;
      expect(isISOStringDate('1970-01-01T00:00:00.000Z')).to.be.a('boolean').and.to.be.true;
      expect(isISOStringDate(new String('2018-04-19T13:20:03.896Z'))).to.be.a('boolean').and.to.be.true;
      expect(isISOStringDate(new String('1970-01-01T00:00:00.000Z'))).to.be.a('boolean').and.to.be.true;
      expect(isISOStringDate(String('2018-04-19T13:20:03.896Z'))).to.be.a('boolean').and.to.be.true;
      expect(isISOStringDate(String('1970-01-01T00:00:00.000Z'))).to.be.a('boolean').and.to.be.true;
    });

    it('should return false when a string in not in ISO format', function () {
      expect(isISOStringDate('')).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate('  ')).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate('2018-04-19T13:20:03.896')).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate('1970-01-01')).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(new String(''))).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(new String('  '))).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(new String('2018-04-19T13:20:03.896'))).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(new String('1970-01-01'))).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(String(''))).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(String('  '))).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(String('2018-04-19T13:20:03.896'))).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(String('1970-01-01'))).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a number', function() {
      expect(isISOStringDate(0)).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(1)).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(5)).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(new Number(0))).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(new Number(1))).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(new Number(5))).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(Number(0))).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(Number(1))).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(Number(5))).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(5.5)).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(Infinity)).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(0xFF)).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(0b111110111)).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(0o767)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a boolean', function() {
      expect(isISOStringDate(true)).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(false)).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(new Boolean(true))).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(new Boolean(false))).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(Boolean(1))).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(Boolean(0))).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a symbol', function() {
      expect(isISOStringDate(Symbol('s'))).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a function', function() {
      expect(isISOStringDate(function f() {})).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a class', function() {
      expect(isISOStringDate(class c {})).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing an error', function() {
      expect(isISOStringDate(new Error('error'))).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing an array', function() {
      expect(isISOStringDate([])).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate([1, 2, 3])).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate([[1, 2], [3, 4, 5]])).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(Array(5))).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(new Array(1, 2, 3))).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing an object', function() {
      expect(isISOStringDate({})).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate({ x: 5 })).to.be.a('boolean').and.to.be.false;
      expect(isISOStringDate(new function() {})).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a map', function() {
      expect(isISOStringDate(new Map())).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a set', function() {
      expect(isISOStringDate(new Set())).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a weakmap', function() {
      expect(isISOStringDate(new WeakMap())).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing a weakset', function() {
      expect(isISOStringDate(new WeakSet())).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing undefined', function() {
      expect(isISOStringDate(undefined)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing null', function() {
      expect(isISOStringDate(null)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing NaN', function() {
      expect(isISOStringDate(NaN)).to.be.a('boolean').and.to.be.false;
    });
  });

  context('when using sleep', function() {
    it('should always be fulfilled immediately if the ms parameter is a string', async function () {
      const parameter = 'x';
      expect(sleep(parameter)).to.be.fulfilled;
      const start = Date.now();
      await sleep(parameter);
      expect(Date.now() - start).to.be.at.least(0).and.at.most(10);
    });

    it('should always be fulfilled immediately if the ms parameter is a boolean', async function () {
      const parameter = true;
      expect(sleep(parameter)).to.be.fulfilled;
      const start = Date.now();
      await sleep(parameter);
      expect(Date.now() - start).to.be.at.least(0).and.at.most(10);
    });

    it('should always be fulfilled immediately if the ms parameter is a date', async function () {
      const parameter = new Date();
      expect(sleep(parameter)).to.be.fulfilled;
      const start = Date.now();
      await sleep(parameter);
      expect(Date.now() - start).to.be.at.least(0).and.at.most(10);
    });

    it('should always be fulfilled immediately if the ms parameter is a function', async function () {
      const parameter = () => {};
      expect(sleep(parameter)).to.be.fulfilled;
      const start = Date.now();
      await sleep(parameter);
      expect(Date.now() - start).to.be.at.least(0).and.at.most(10);
    });

    it('should always be fulfilled immediately if the ms parameter is an error', async function () {
      const parameter = new Error('error');
      expect(sleep(parameter)).to.be.fulfilled;
      const start = Date.now();
      await sleep(parameter);
      expect(Date.now() - start).to.be.at.least(0).and.at.most(10);
    });

    it('should always be fulfilled immediately if the ms parameter is a symbol', async function () {
      const parameter = Symbol('s');
      expect(sleep(parameter)).to.be.fulfilled;
      const start = Date.now();
      await sleep(parameter);
      expect(Date.now() - start).to.be.at.least(0).and.at.most(10);
    });

    it('should always be fulfilled immediately if the ms parameter is a class', async function () {
      const parameter = class c {};
      expect(sleep(parameter)).to.be.fulfilled;
      const start = Date.now();
      await sleep(parameter);
      expect(Date.now() - start).to.be.at.least(0).and.at.most(10);
    });

    it('should always be fulfilled immediately if the ms parameter is an array', async function () {
      const parameter = [3000];
      expect(sleep(parameter)).to.be.fulfilled;
      const start = Date.now();
      await sleep(parameter);
      expect(Date.now() - start).to.be.at.least(0).and.at.most(10);
    });

    it('should always be fulfilled immediately if the ms parameter is an object', async function () {
      const parameter = { ms: 5000 };
      expect(sleep(parameter)).to.be.fulfilled;
      const start = Date.now();
      await sleep(parameter);
      expect(Date.now() - start).to.be.at.least(0).and.at.most(10);
    });

    it('should always be fulfilled immediately if the ms parameter is a map', async function () {
      const parameter = new Map();
      expect(sleep(parameter)).to.be.fulfilled;
      const start = Date.now();
      await sleep(parameter);
      expect(Date.now() - start).to.be.at.least(0).and.at.most(10);
    });

    it('should always be fulfilled immediately if the ms parameter is a weakmap', async function () {
      const parameter = new WeakMap();
      expect(sleep(parameter)).to.be.fulfilled;
      const start = Date.now();
      await sleep(parameter);
      expect(Date.now() - start).to.be.at.least(0).and.at.most(10);
    });

    it('should always be fulfilled immediately if the ms parameter is a set', async function () {
      const parameter = new Set();
      expect(sleep(parameter)).to.be.fulfilled;
      const start = Date.now();
      await sleep(parameter);
      expect(Date.now() - start).to.be.at.least(0).and.at.most(10);
    });

    it('should always be fulfilled immediately if the ms parameter is a weakset', async function () {
      const parameter = new WeakSet();
      expect(sleep(parameter)).to.be.fulfilled;
      const start = Date.now();
      await sleep(parameter);
      expect(Date.now() - start).to.be.at.least(0).and.at.most(10);
    });

    it('should always be fulfilled immediately if the ms parameter is undefined', async function () {
      const parameter = undefined;
      expect(sleep(parameter)).to.be.fulfilled;
      const start = Date.now();
      await sleep(parameter);
      expect(Date.now() - start).to.be.at.least(0).and.at.most(10);
    });

    it('should always be fulfilled immediately if the ms parameter is null', async function () {
      const parameter = null;
      expect(sleep(parameter)).to.be.fulfilled;
      const start = Date.now();
      await sleep(parameter);
      expect(Date.now() - start).to.be.at.least(0).and.at.most(10);
    });

    it('should always be fulfilled immediately if the ms parameter is NaN', async function () {
      const parameter = NaN;
      expect(sleep(parameter)).to.be.fulfilled;
      const start = Date.now();
      await sleep(parameter);
      expect(Date.now() - start).to.be.at.least(0).and.at.most(10);
    });

    it('should always be fulfilled immediately if the ms parameter is a negative number', async function () {
      const parameter = -1;
      expect(sleep(parameter)).to.be.fulfilled;
      const start = Date.now();
      await sleep(parameter);
      expect(Date.now() - start).to.be.at.least(0).and.at.most(10);
    });

    it('should be fulfilled in an expected amount of time', async function () {
      this.timeout(5000);
      const ms = 3000;
      const start = Date.now();
      await sleep(ms);
      expect(Date.now() - start).to.be.at.least(ms).and.at.most(ms + 15);
    });
  });

  context('when using toLocaleISOString', function() {
    it('should return undefined if the parameter is a string', function () {
      const parameter = 'x';
      expect(toLocaleISOString(parameter)).to.be.undefined;
    });

    it('should return undefined if the parameter is a boolean', function () {
      const parameter = true;
      expect(toLocaleISOString(parameter)).to.be.undefined;
    });

    it('should return undefined if the parameter is a function', function () {
      const parameter = () => {};
      expect(toLocaleISOString(parameter)).to.be.undefined;
    });

    it('should return undefined if the parameter is an error', function () {
      const parameter = new Error('error');
      expect(toLocaleISOString(parameter)).to.be.undefined;
    });

    it('should return undefined if the parameter is a symbol', function () {
      const parameter = Symbol('s');
    expect(toLocaleISOString(parameter)).to.be.undefined;
    });

    it('should return undefined if the parameter is a class', function () {
      const parameter = class c {};
      expect(toLocaleISOString(parameter)).to.be.undefined;
    });

    it('should return undefined if the parameter is an array', function () {
      const parameter = [3000];
      expect(toLocaleISOString(parameter)).to.be.undefined;
    });

    it('should return undefined if the parameter is an object', function () {
      const parameter = { ms: 5000 };
      expect(toLocaleISOString(parameter)).to.be.undefined;
    });

    it('should return undefined if the parameter is a map', function () {
      const parameter = new Map();
      expect(toLocaleISOString(parameter)).to.be.undefined;
    });

    it('should return undefined if the parameter is a weakmap', function () {
      const parameter = new WeakMap();
      expect(toLocaleISOString(parameter)).to.be.undefined;
    });

    it('should return undefined if the parameter is a set', function () {
      const parameter = new Set();
      expect(toLocaleISOString(parameter)).to.be.undefined;
    });

    it('should return undefined if the parameter is a weakset', function () {
      const parameter = new WeakSet();
      expect(toLocaleISOString(parameter)).to.be.undefined;
    });

    it('should return undefined if the parameter is undefined', function () {
      const parameter = undefined;
      expect(toLocaleISOString(parameter)).to.be.undefined;
    });

    it('should return undefined if the parameter is null', function () {
      const parameter = null;
      expect(toLocaleISOString(parameter)).to.be.undefined;
    });

    it('should return undefined if the parameter is NaN', function () {
      const parameter = NaN;
      expect(toLocaleISOString(parameter)).to.be.undefined;
    });

    it('should return a valid ISO date with the offset', function () {
      const date = new Date();
      const isoLocaleDateString = toLocaleISOString(date);
      const isoLocalDate = new Date(isoLocaleDateString);
      expect(date.toISOString()).to.equal(isoLocalDate.toISOString());
      expect(date.getTimezoneOffset()).to.equal(isoLocalDate.getTimezoneOffset());
      expect(isoLocaleDateString).to.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}[\+-][0-9]{2}:[0-9]{2}$/);
    });
  });

  context('when using timeout', function() {
    it('should always throw a timeout error if the ms parameter is 0', async function () {
      let error;

      try {
        await timeout(0, sleep(1000));
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an('error');
      expect(error.name).to.equal('PromiseTimeoutError');
      expect(error.code).to.equal('PROMISE_TIMEOUT');
    });

    it('should always throw a timeout error if the ms parameter is not a number', async function () {
      let error;

      try {
        await timeout('x', sleep(1000));
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an('error');
      expect(error.name).to.equal('PromiseTimeoutError');
      expect(error.code).to.equal('PROMISE_TIMEOUT');
    });

    it('should throw a timeout error if the promise execution lasts longer than the timeout set up', async function () {
      let error;

      try {
        await timeout(1000, sleep(2000));
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an('error');
      expect(error.name).to.equal('PromiseTimeoutError');
      expect(error.code).to.equal('PROMISE_TIMEOUT');
    });

    it('should not throw a timeout error the promise execution lasts shorter than the timeout set up', async function () {
      let error;

      try {
        await timeout(2000, sleep(1000));
      } catch (e) {
        error = e;
      }

      expect(error).to.not.exist;
    });

    it('should resolve the promise if not timed out', async function () {
      const promise = async () => {
        await sleep(1000);
        return 'promise resolved';
      };
      let res;
      let error;

      try {
        res = await timeout(2000, promise());
      } catch (e) {
        error = e;
      }

      expect(error).to.not.exist;
      expect(res).to.equal('promise resolved');
    });
  });
});
