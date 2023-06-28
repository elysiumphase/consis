/**
 * Object helper.
 */

/**
 * @func exists
 *
 * whether the specified value is not null, undefined or NaN
 * @param  {Any} thing
 * @return {Boolean}
 */
const exists = function exists(thing) {
  return !(thing === undefined || thing === null || Number.isNaN(thing));
};

/**
 * @func is
 *
 * whether the specified value is from the specified type regarding its whole prototype
 * @param  {Function} Type a type function
 * @param  {Any} thing
 * @return {Boolean}
 */
const is = function is(Type, thing) {
  return exists(Type)
  && exists(thing)
  && (thing.constructor === Type
  || thing instanceof Type);
};

/**
 * @func hasOwn
 *
 * whether a specified object has a property in its own prototype, works with symbols
 * @param  {Any} thing
 * @param  {Any} prop
 * @return {Boolean}
 */
const hasOwn = function hasOwn(thing, prop) {
  return exists(thing) && Reflect.ownKeys(thing).indexOf(prop) !== -1;
};

/**
 * @func has
 *
 * whether a specified object has a property in its whole prototype, works with symbols
 * @param  {Any} thing
 * @param  {Any} prop
 * @return {Boolean}
 */
const has = function has(thing, prop) {
  return exists(thing)
    && (hasOwn(thing, prop)
    || hasOwn(Object.getPrototypeOf(thing), prop)
    || (exists(thing.prototype) && hasOwn(thing.prototype, prop)));
};

/**
 * @func sizeOwn
 *
 * number of own properties or length
 * @param  {Any} thing
 * @return {Number}
 */
const sizeOwn = function sizeOwn(thing) {
  if (!exists(thing)) {
    return 0;
  }

  if (is(Function, thing)) {
    return Object.keys(thing).length;
  }

  if (is(String, thing)) {
    return thing.length;
  }

  if (hasOwn(thing, 'length')) {
    return is(Number, thing.length) ? thing.length : 0;
  }

  if (has(thing, 'size')) {
    return is(Number, thing.size) ? thing.size : 0;
  }

  return Reflect.ownKeys(thing).length;
};

/**
 * @func isEmptyOwn
 *
 * whether a specified object or value is empty
 * @param  {Any} thing
 * @return {Boolean}
 */
const isEmptyOwn = function isEmptyOwn(thing) {
  return is(String, thing) ? sizeOwn(thing.trim()) === 0 : sizeOwn(thing) === 0;
};

/**
 * @func getType
 *
 * get the object's type
 * @param  {Any} thing
 * @return {Function|undefined}
 */
const getType = function getType(thing) {
  return exists(thing) ? thing.constructor : undefined;
};

/**
 * @func getTypeName
 *
 * get the object's type name
 * @param  {Any} thing
 * @return {String|undefined}
 */
const getTypeName = function getTypeName(thing) {
  const type = getType(thing);

  return type !== undefined ? type.name : undefined;
};

/**
 * @func compare
 *
 * compare two numbers or two strings (ignoring case and accents)
 * @param  {Number|String} a
 * @param  {Number|String} b
 * @return {Object} { inferior, superior, equal }
 */
const compare = function compare(a, b) {
  if (is(Number, a) && is(Number, b)) {
    return {
      inferior: a < b,
      superior: a > b,
      equal: a === b,
    };
  }

  if (is(String, a) && is(String, b)) {
    const result = a.toLowerCase().localeCompare(b.toLowerCase());
    return {
      inferior: result < 0,
      superior: result > 0,
      equal: result === 0,
    };
  }

  return {};
};

/**
 * clone
 */

// not supported objects to clone
const notSupportedObjects = [
  // AsyncFunction
  Object.getPrototypeOf(async () => {}).constructor,
  Function,
  // GeneratorFunction
  Object.getPrototypeOf(function* g() { yield 0; }).constructor,
  Intl.Collator,
  Intl.DateTimeFormat,
  Intl.NumberFormat,
  Intl.PluralRules,
  Promise,
  // Proxy,
  WeakMap,
  WeakSet,
];

// constructors which objects can be copied with descriptors
const copyWithDescriptors = [
  Error,
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,
];

// primitive objects
const primitives = [
  'boolean',
  'number',
  'string',
  'symbol',
];

// typed arrays
const typedArrays = [
  Int8Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
];

/* eslint no-new-wrappers: "off" */
/**
 * @func clone
 *
 * make a deep copy of a specified object or value
 * NOTE:
 *  - can clone custom object including its whole prototype
 *  - does not handle circular references, use with caution
 *  - Not supported:
 *    + AsyncFunction
 *    + Function
 *    + GeneratorFunction
 *    + Intl.Collator
 *    + Intl.DateTimeFormat
 *    + Intl.NumberFormat
 *    + Intl.PluralRules
 *    + Promise
 *    + Proxy (but impossible to check if an object is a proxy until Node v10)
 *    + WeakMap
 *    + WeakSet
 *    + SharedArrayBuffer (for security reasons)
 * @param  {Any} thing
 * @param  {Boolean} ignoreUndefinedProperties
 * @return {Any}
 */
const clone = function clone(thing, { ignoreUndefinedProperties: ignoreUndefinedProps } = {}) {
  const ignoreUndefinedProperties = ignoreUndefinedProps === true;

  if (!exists(thing)) {
    return thing;
  }

  const Constructor = getType(thing);
  const getDescriptors = function getDescriptors(obj) {
    const descriptors = {};

    Reflect.ownKeys(obj).forEach((key) => {
      const descriptor = Reflect.getOwnPropertyDescriptor(obj, key);

      if (!ignoreUndefinedProperties
        || (ignoreUndefinedProperties && descriptor.value !== undefined)) {
        const clonedValue = clone(descriptor.value, { ignoreUndefinedProperties });

        delete descriptor.value;
        descriptor.value = clonedValue;
        descriptors[key] = descriptor;
      }
    });

    return descriptors;
  };

  let cloned;

  if (exists(Constructor)) {
    const typeOfThing = typeof thing;
    const isPrimitive = primitives.includes(typeOfThing);

    if (!isPrimitive) {
      /**
       * first type must not be undefined or a function
       * then the constructor must not be included in unsupported objects
       */
      if (typeOfThing !== 'undefined' && typeOfThing !== 'function' && !notSupportedObjects.includes(Constructor) /* && util.types.isProxy(thing) */) {
        if (Constructor === Array) {
          // Array
          cloned = [];

          thing.forEach((value, key) => {
            if (!ignoreUndefinedProperties || (ignoreUndefinedProperties && value !== undefined)) {
              cloned[key] = clone(value, { ignoreUndefinedProperties });
            }
          });
        } else if (Constructor === Map) {
          // Map
          cloned = new Map();

          thing.forEach((value, key) => {
            if (!ignoreUndefinedProperties || (ignoreUndefinedProperties && value !== undefined)) {
              cloned.set(
                clone(key, { ignoreUndefinedProperties }),
                clone(value, { ignoreUndefinedProperties }),
              );
            }
          });
        } else if (Constructor === Set) {
          // Set
          cloned = new Set();

          thing.forEach((value) => {
            if (!ignoreUndefinedProperties || (ignoreUndefinedProperties && value !== undefined)) {
              cloned.add(clone(value, { ignoreUndefinedProperties }));
            }
          });
        } else if (Constructor === DataView) {
          // DataView
          cloned = new DataView(thing.buffer.slice(), thing.byteOffset, thing.byteLength);
        } else if (Constructor === Buffer) {
          // Buffer
          cloned = Buffer.allocUnsafe(thing.length);
          thing.copy(cloned);
        } else if (Constructor === ArrayBuffer) {
          // ArrayBuffer
          cloned = thing.slice();
        } else if (Constructor === Date) {
          // Date
          cloned = new Date(thing.valueOf());
        } else if (Constructor === RegExp) {
          // RegExp
          cloned = new RegExp(thing.source, thing.flags);
        } else if (typedArrays.includes(Constructor)) {
          // Typed Arrays
          cloned = new Constructor(thing);
        } else if (Constructor === String) {
          // String used as a constructor (bad practice)
          cloned = new String(thing.valueOf());
          const len = cloned.length;
          const descriptors = getDescriptors(thing);

          Object.keys(descriptors).forEach((key) => {
            if (key > len || key !== 'length') {
              Object.defineProperty(cloned, key, descriptors[key]);
            }
          });
        } else if (Constructor === Number || Constructor === Boolean) {
          // Number or Boolean used as a constructor (bad practice)
          const descriptors = getDescriptors(thing);

          cloned = new Constructor(thing.valueOf());
          Object.defineProperties(cloned, descriptors);
        } else if (copyWithDescriptors.includes(Constructor)) {
          // Reflect (must be at the end)
          const descriptors = getDescriptors(thing);

          cloned = new Constructor();
          Object.defineProperties(cloned, descriptors);
        } else if (typeOfThing === 'object') {
          // custom objects
          const descriptors = getDescriptors(thing);

          cloned = Object.create(Object.getPrototypeOf(thing), descriptors);
        }
      }
    } else {
      // Primitives
      cloned = thing.valueOf();
    }
  }

  return cloned;
};

/**
 * @func freeze
 *
 * Deep freeze anything except TypedArrays, DataView
 * @param  {Any} thing
 * @return {Any} thing
 */
const freeze = function freeze(thing) {
  if (!exists(thing)) {
    return Object.freeze(thing);
  }

  const Constructor = getType(thing);

  if (typedArrays.includes(Constructor)
    || Constructor === DataView) {
    return thing;
  }

  const isPrimitive = primitives.includes(typeof thing);

  if (isPrimitive) {
    return Object.freeze(thing);
  }

  Reflect.ownKeys(thing).forEach((key) => {
    const descriptor = Reflect.getOwnPropertyDescriptor(thing, key);
    freeze(descriptor.value);
  });

  return Object.freeze(thing);
};

module.exports = Object.freeze({
  exists,
  is,
  hasOwn,
  has,
  sizeOwn,
  isEmptyOwn,
  getType,
  getTypeName,
  compare,
  clone,
  freeze,
});
