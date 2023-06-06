/**
 * Type casting helper.
 */
const { is, exists } = require('./object');

/**
 * @func str
 *
 * cast to primitive string if possible or returns undefined
 * because String(undefined|null|NaN) returns a string 'undefined'|'null'|'NaN'
 * NOTE: String() calls method toString
 *
 * @param  {Any} thing a value to cast to primitive string
 * @return {String|undefined}
 */
const str = function str(thing) {
  if (is(String, thing)) {
    return String(thing);
  }

  if (exists(thing)) {
    const castStr = String(thing);

    return /^\[object\s\w{1,}\]$/.test(castStr) ? undefined : castStr;
  }

  return undefined;
};

/**
 * @func number
 *
 * cast to primitive number if possible or returns undefined
 * because Number(null) returns 0 and Number(undefined|NaN) returns NaN
 * beware to call Number.isFinite only on number values
 * NOTE: only finite values
 *
 * @param  {Any} thing a value to cast to primitive number
 * @return {Number|undefined}
 */
const number = function number(thing) {
  let castNum;

  if (exists(thing)) {
    const value = thing.valueOf();

    if (is(Number, value)) {
      if (Number.isFinite(value) && value <= Number.MAX_SAFE_INTEGER) {
        castNum = value;
      }
    } else if (is(String, value) || is(Boolean, value)) {
      const cast = Number(value);

      if (Number.isFinite(cast) && value <= Number.MAX_SAFE_INTEGER) {
        castNum = cast;
      }
    }
  }

  return castNum;
};

/**
 * @func num
 *
 * cast to primitive number, with 'less or equal than'
 * or 'greater or equal than' options, or returns undefined
 * NOTE: based on "number" function
 *
 * @param  {Any} thing a value to cast to primitive number
 * @return {Number|undefined}
 */
const num = function num(thing, { ge, le } = {}) {
  let castNum = number(thing);

  if (castNum !== undefined) {
    const lessThan = number(le);
    const greaterThan = number(ge);

    if (lessThan !== undefined && greaterThan !== undefined) {
      if (castNum < greaterThan || castNum > lessThan) {
        castNum = undefined;
      }
    } else if (lessThan !== undefined && castNum > lessThan) {
      castNum = undefined;
    } else if (greaterThan !== undefined && castNum < greaterThan) {
      castNum = undefined;
    }
  }

  return castNum;
};

/**
 * @func integer
 *
 * cast to primitive integer number if possible or returns undefined
 * NOTE: based on "number" function, in base 10 only
 *
 * @param  {Any} thing a value to cast to primitive integer number
 * @return {Integer Number|undefined}
 */
const integer = function integer(thing) {
  // first cast to number to avoid some inconsistencies with hexa
  const castNum = number(thing);
  let castInt;

  if (castNum !== undefined) {
    const int = parseInt(castNum, 10);

    if (!Number.isNaN(int)) {
      castInt = int;
    }
  }

  return castInt;
};

/**
 * @func int
 *
 * cast to primitive integer number, with 'less or equal than'
 * or 'greater or equal than' options, or returns undefined
 * NOTE: based on "integer" function, in base 10 only
 *
 * @param  {Any} thing a value to cast to primitive integer number
 * @return {Integer Number|undefined}
 */
const int = function int(thing, { le, ge } = {}) {
  let castInt = integer(thing);

  if (castInt !== undefined) {
    const lessThan = integer(le);
    const greaterThan = integer(ge);

    if (lessThan !== undefined && greaterThan !== undefined) {
      if (castInt < greaterThan || castInt > lessThan) {
        castInt = undefined;
      }
    } else if (lessThan !== undefined && castInt > lessThan) {
      castInt = undefined;
    } else if (greaterThan !== undefined && castInt < greaterThan) {
      castInt = undefined;
    }
  }

  return castInt;
};

/**
 * @func toFloat
 *
 * cast to primitive float number if possible or returns undefined
 * NOTE: based on "number" function, in base 10 only
 *
 * @param  {Any} thing a value to cast to primitive float number
 * @return {Float Number|undefined}
 */
const toFloat = function toFloat(thing) {
  // first cast to number to avoid some inconsistencies with hexa
  const castNum = number(thing);
  let castFloat;

  if (exists(castNum)) {
    const float = parseFloat(castNum, 10);

    if (!Number.isNaN(float)) {
      castFloat = float;
    }
  }

  return castFloat;
};

/**
 * @func float
 *
 * cast to primitive float number, with 'less or equal than'
 * or 'greater or equal than' options, or returns undefined
 * NOTE: based on "toFloat" function, in base 10 only
 *
 * @param  {Any} thing a value to cast to primitive float number
 * @return {Float Number|undefined}
 */
const float = function float(thing, { le, ge } = {}) {
  let castFloat = toFloat(thing);

  if (castFloat !== undefined) {
    const lessThan = toFloat(le);
    const greaterThan = toFloat(ge);

    if (lessThan !== undefined && greaterThan !== undefined) {
      if (castFloat < greaterThan || castFloat > lessThan) {
        castFloat = undefined;
      }
    } else if (lessThan !== undefined && castFloat > lessThan) {
      castFloat = undefined;
    } else if (greaterThan !== undefined && castFloat < greaterThan) {
      castFloat = undefined;
    }
  }

  return castFloat;
};

/**
 * @func bool
 *
 * cast to primitive boolean if thing exists or returns undefined
 * because Boolean('false'|'0') returns true
 * because Boolean(new Boolean(0)) returns true
 * and string value as 'false', 'true', '0', '1' can come from db
 *
 * @param  {Any} thing a value to cast to primitive boolean
 * @return {Boolean|undefined}
 */
const bool = function bool(thing) {
  let castBool;

  if (exists(thing)) {
    const value = thing.valueOf();

    if (is(Boolean, value)) {
      castBool = value;
    } else if (value === 'false' || value === '0' || value === 0) {
      castBool = false;
    } else if (value === 'true' || value === '1' || value === 1) {
      castBool = true;
    }
  }

  return castBool;
};

/**
 * @func arr
 *
 * cast to primitive array if thing exists, could be an array or returns undefined
 * if allowEmpty=false and thing is an empty array it returns undefined
 *
 * @param  {Any} thing a value to cast to primitive array
 * @param  {Boolean} allowEmpty whether the array could be empty (optional, true by default)
 * @return {Array|undefined}
 */
const arr = function arr(thing, allowEmpty) {
  const canBeEmpty = allowEmpty === false ? allowEmpty : true;
  let castArr;

  if (exists(thing)) {
    const value = thing.valueOf();

    if (Array.isArray(value)) {
      castArr = [...value];
    } else if (is(String, value)) {
      try {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
          castArr = [...parsed];
        }
      } catch (e) {
        // do nothing
      }
    }
  }

  if (!canBeEmpty && Array.isArray(castArr) && castArr.length < 1) {
    castArr = undefined;
  }

  return castArr;
};

/**
 * @func date
 *
 * cast to a Date object or undefined if thing is an invalid date
 * beware of a bad behavior with arrays in parameter
 * because new Date(null) returns 1970-01-01T00:00:00.000Z
 * but new Date(undefined|NaN) returns Invalid Date
 *
 * @param  {Any} thing a value to cast to a Date object
 * @return {Date|undefined}
 */
const date = function date(thing) {
  let castDate;

  if (is(Date, thing) || is(Number, thing) || is(String, thing)) {
    const d = new Date(thing.valueOf());

    if (d.toString() !== 'Invalid Date') {
      castDate = d;
    }
  }

  return castDate;
};

/**
 * @func round
 *
 * round a number with an optional number of decimals
 * NOTE: based on "num" function
 *
 * @param  {Number} n the number to get the rounded value
 * @param  {Number} nbDecimals the number of decimals (optional, min 0 max 100)
 * @return {String|undefined} number rounded with nbDecimals decimals,
 *                            or the rounded integer if nbDecimals is not defined
 */
const round = function round(n, nbDecimals) {
  const nb = num(n);
  let roundedNumStr;

  if (nb !== undefined) {
    const decimals = num(nbDecimals, { ge: 0, le: 100 }) || 0;
    roundedNumStr = nb.toFixed(decimals);
  }

  return roundedNumStr;
};

/**
 * @func precision
 *
 * format a number with a specified number of decimals
 * NOTE: based on "num" and "str" functions
 *
 * @param  {Number} n the number to format
 * @param  {Number} nbDecimals the number of decimals (optional, min 1)
 * @return {String|undefined} number with nbDecimals decimals, undefined by default
 */
const precision = function precision(n, nbDecimals) {
  const nb = num(n);
  const d = num(nbDecimals, { ge: 1 }) || 1;
  let precisionNumStr;

  if (nb !== undefined) {
    const [base, dec] = str(nb).split('.');
    let decimals;

    if (dec !== undefined) {
      decimals = str(dec).substr(0, d);

      if (decimals.length < n) {
        decimals = `${decimals}${'0'.repeat(d - decimals.length)}`;
      }
    } else {
      decimals = '0'.repeat(d);
    }

    precisionNumStr = `${base}.${decimals}`;
  }

  return precisionNumStr;
};

// exports
module.exports = Object.freeze({
  str,
  number,
  num,
  int,
  integer,
  toFloat,
  float,
  bool,
  arr,
  date,
  round,
  precision,
});
