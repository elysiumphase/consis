<p align="center">
  <img src="doc/consis.png" alt="c o n s i s" style="border-radius:50%"/>
<p>

<p align="center">
  A small Node.js library for type casting, http/s requests, object cloning, and other object, string, image, time and uuid helpers.
<p>

# Table of Contents
- [Presentation](#presentation)
- [Installation](#installation)
- [Technical information](#technical-information)
  - [Node.js](#node.js)
  - [Debugging](#debugging)
  - [Tests](#tests)
    - [Linting](#linting)
    - [Unit](#unit)
- [Usage](#usage)
  - [Cast](#cast)
    - [str(thing)](#strthing)
    - [num(thing\[, { ge, le } \])](#numthing--ge-le--)
    - [int(thing\[, { ge, le } \])](#intthing--ge-le--)
    - [float(thing\[, { ge, le } \])](#floatthing--ge-le--)
    - [bool(thing)](#boolthing)
    - [arr(thing\[, allowEmpty\])](#arrthing-allowempty)
    - [date(thing)](#datething)
    - [round(n\[, nbDecimals\])](#roundn-nbdecimals)
    - [precision(n\[, nbDecimals\])](#precisionn-nbdecimals)
  - [Encodings](#encodings)
  - [Image](#image)
    - [isPng(buffer)](#ispngbuffer)
  - [Math](#math)
    - [minmax(array)](#minmaxarray)
  - [Object](#object)
    - [exists(thing)](#existsthing)
    - [is(Type, thing)](#istype-thing)
    - [hasOwn(thing, prop)](#hasownthing-prop)
    - [has(thing, prop)](#hasthing-prop)
    - [sizeOwn(thing)](#sizeownthing)
    - [isEmptyOwn(thing)](#isemptyownthing)
    - [getType(thing)](#gettypething)
    - [getTypeName(thing)](#gettypenamething)
    - [compare(a, b)](#comparea-b)
    - [clone(thing)](#clonething)
  - [Requester](#requester)
    - [requester(options): AsyncFunction](#requesteroptions-asyncfunction)
  - [String](#string)
    - [split({ string, separator\[, max\] })](#split-string-separator-max-)
    - [capitalize({ string\[, first\] })](#capitalize-string-first-)
    - [camelCase({ string, separator })](#camelcase-string-separator-)
  - [Time](#time)
    - [sleep(ms)](#sleepms)
    - [isISOStringDate(thing)](#isisostringdatething)
    - [toLocaleISOString(d)](#tolocaleisostringd)
  - [Uuid](#time)
    - [isValidUUID(thing\[, version\])](#isvaliduuidthing-version)
  - [Environment variables](#environment-variables)
  - [Errors](#error)
    - [Object structure](#object-structure)
    - [Codes](#codes)
- [Development](#development)
- [Licence](#licence)

# Presentation

Many libraries exist in the Node.js sphere providing great helpers like Lodash and Ramda to name a few. This library is not intended to replace them but provide very simple, safe and lighter helpers that I personally use in a lot of my projects.

**Consistency is the key.**

ECMAScript is not always consistent and this library is mostly used to give some foundation we can rely on.

Because even if *null*, *undefined*, *NaN* have a real technical sense, it can lead to some inconsistency and be a pain sometimes to check if a value exists or not.

This whole library is based on type checking that is another pain and sometimes I personally just don't want to use TypeScript or Flow but the native language.

Type casting is another example where `Boolean('false'|'0')` returns `true` while we would want it to return `false` or because `Number(null)` returns `0` and `Number(undefined|NaN)` returns `NaN` that in the end of the day makes the code inconsistent.

Deep cloning simple objects will also save your day from inexplicable object mutations. Because:

```javascript
const obj = {
  foo: {
    bar: 5,
  },
};

const copy = Object.assign({}, obj); // or const copy = { ...obj };
copy.foo.bar = 'baz';

copy; // { foo: { bar: 'baz' } }
obj; // { foo: { bar: 'baz' } }
```

These helpers are mostly based on my own work and experimentation of the language. Only *image* helper is based on [is-png](https://github.com/sindresorhus/is-png) and *uuid* helper on [uuid-validate](https://github.com/mixer/uuid-validate).

Because I'm using these helpers in a lot of my projects doesn't mean you'll find it useful. Even if **this library has no dependency** I personally recommend to copy/paste some of the code you need in your project with its tests so you will lighten your dependency graph. Then regularly check code base and testing updates.

# Installation

`npm install consis`

`npm i -S consis`

# Technical information

## Node.js

- Language: JavaScript ES6/ES7
- VM: Node.js >= Carbon (8.17.0)

## Debugging

- Some helpers can use *util.debuglog* that writes debug messages to *stderr* based on the existence of the `NODE_DEBUG` environment variable. See [Errors](#error).

## Tests

Command to run all tests:

`npm test`

Note that requester's timeout test only works for Node >= 10.7.0.

### Linting

ESLint with Airbnb base rules. See [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).

`npm run test:lint`

### Unit

Mocha and Chai.

`npm run test:unit`

# Usage

## Cast

Type casting helper.

Cast a value to a specific primitive type. If the value is not of this type or can not be inferred from this value, undefined is returned.

*undefined* is an interesting value because when stringifying an object, an undefined property disappears that can sometimes be useful.

- `cast` **<Object\>** with the following properties:

### str(thing)
Cast *thing* to a primitive string if possible or returns *undefined*. Because `String(undefined|null|NaN)` returns a string *'undefined'*|*'null'*|*'NaN'*.
  - `thing`**<Any\>**
  - Returns: **<String\>** | **undefined**

Examples:
```javascript
str('hello'); // 'hello'
str(true); // 'true'
str(new String('string')); // 'string'
str(5.55); // '5.55'
str(undefined|null|NaN); // undefined
```

### num(thing[, { ge, le } ])
Cast *thing* to a primitive number, with *less or equal than* or *greater or equal than* options, or returns *undefined*. Because `Number(null)` returns `0` and `Number(undefined|NaN)` returns `NaN`. Only for finite values.
  - `thing`**<Any\>**
  - `options`**<Object\>** *Default*: `undefined`
    - `ge`**<Number\>** Greater or equal than
    - `le`**<Number\>** Less or equal than
  - Returns: **<Number\>** | **undefined**

Examples:
```javascript
num(5); // 5
num('5'); // 5
num(0, { ge: 0 }); // 0
num(5, { le: 9 }); // 5
num(5, { ge: 0, le: 5 }); // 5
num(5, { ge: 0, le: 4 }); // undefined
num(new Number(5)); // 5
num(undefined|null|NaN); // undefined
```

### int(thing[, { ge, le } ])
Cast *thing* to a primitive integer number, with *less or equal than* or *greater or equal than* options, or returns *undefined*. In base 10 only.
  - `thing`**<Any\>**
  - `options`**<Object\>** *Default*: `undefined`
    - `ge`**<Number\>** Greater or equal than
    - `le`**<Number\>** Less or equal than
  - Returns: **<Integer Number\>** | **undefined**

Examples:
```javascript
int(5.9); // 5
int('5.9'); // 5
int(0, { ge: 0 }); // 0
int(5.55, { le: 9 }); // 5
int(5.9, { ge: 0, le: 5 }); // 5
int(5.11, { ge: 0, le: 4 }); // undefined
int(undefined|null|NaN); // undefined
```

### float(thing[, { ge, le } ])
Cast *thing* to a primitive float number, with *less or equal than* or *greater or equal than* options, or returns *undefined*. In base 10 only.
  - `thing`**<Any\>**
  - `options`**<Object\>** *Default*: `undefined`
    - `ge`**<Number\>** Greater or equal than
    - `le`**<Number\>** Less or equal than
  - Returns: **<Float Number\>** | **undefined**

Examples:
```javascript
float(5.9); // 5.9
float(0, { ge: 0 }); // 0
float(5.55, { le: 9 }); // 5.55
float(5.9, { ge: 0, le: 5 }); // undefined
float(5.11, { ge: 0, le: 5.12 }); // 5.11
float(undefined|null|NaN); // undefined
```

### bool(thing)
Cast *thing* to a primitive boolean if possible or returns *undefined*. Because `Boolean('false'|'0')` returns `true` and `Boolean(new Boolean(0))` returns `true`. A string value as *'false'*, *'true'*, *'0'*, *'1'* and numbers *0* and *1* should be cast to a boolean.
  - `thing`**<Any\>**
  - Returns: **<Boolean\>** | **undefined**

Examples:
```javascript
bool(true); // true
bool(new Boolean(true)); // true
bool('true'); // true
bool(1); // true
bool(0); // false
bool(undefined|null|NaN); // undefined
bool('hello'); // undefined
```

### arr(thing[, allowEmpty])
Cast *thing* to a primitive array if possible or returns *undefined*. If *allowEmpty* is false and *thing* is an empty array then returns undefined. Please note that `cast.arr` doesn't make a deep copy of an array, prefer `object.clone` to do this and avoid possible mutations.
  - `thing`**<Any\>**
  - `allowEmpty`**<Boolean\>** *Default*: `true`
  - Returns: **<Array\>** | **undefined**

Examples:
```javascript
arr([5, 9]); // [5, 9]
arr([]); // []
arr([], false); // undefined
arr('[5, 9]'); // [5, 9]
arr(undefined|null|NaN); // undefined
```

### date(thing)
Cast *thing* to a Date object or undefined if thing refers to an invalid date. Because `new Date(null)` returns `1970-01-01T00:00:00.000Z` but `new Date(undefined|NaN)` returns `Invalid Date`.
  - `thing`**<Any\>**
  - Returns: **<Date\>** | **undefined**

Examples:
```javascript
date('2011-02-23T12:05:44+01:00'); // Date instance 2011-02-23T11:05:44.000Z
date([]); // undefined
date({}); // undefined
date(undefined|null|NaN); // undefined
```

### round(n[, nbDecimals])
Round *n* with an optional number of decimals.
  - `n`**<Number\>** | **<String\>**
  - `nbDecimals`**<Number\>** *Min*: `0` *Max*: `100` *Default*: `0`
  - Returns: **<String\>** | **undefined**

Examples:
```javascript
round('5.9'); // '6'
round(5.77); // '6'
round(5.77, -1); // '6'
round(5.77, 101); // '6'
round(5.77, 2); // '6.00'
round(5.22, 3); // '5.220'
round(5.22, 1); // '5.2'
round(5, 5); // '5.00000'
round(undefined|null|NaN); // undefined
```

### precision(n[, nbDecimals])
Format *n* with a specified number of decimals.
  - `n`**<Number\>** | **<String\>**
  - `nbDecimals`**<Number\>** *Min*: `1` *Default*: `1`
  - Returns: **<String\>** | **undefined**

Examples:
```javascript
precision('5.9'); // '5.9'
precision('5.99'); // '5.9'
precision(5.9); // '5.9'
precision(5.99, -1); // '5.9'
precision(5.99, 0); // '5.9'
precision(5.777, 5); // '5.77700'
precision(5.777, 2); // '5.77'
precision(undefined|null|NaN); // undefined
```

## Encodings

Enumerate available encodings.

- `encodings` **<Object\>**
  - `ascii` **<String\>** For 7-bit ASCII data only. This encoding is fast and will strip the high bit if set. *Value*: `ascii`
  - `utf8` **<String\>** Multibyte encoded Unicode characters. *Value*: `utf8`
  - `utf16le` **<String\>** 2 or 4 bytes, little-endian encoded Unicode characters. Surrogate pairs (U+10000 to U+10FFFF) are supported. *Value*: `utf16le`
  - `ucs2` **<String\>** Alias for *utf16le*. *Value*: `ucs2`
  - `base64` **<String\>** When creating a Buffer from a string, this encoding will also correctly accept "URL and Filename Safe Alphabet" as specified in RFC4648, Section 5. *Value*: `base64`
  - `latin1` **<String\>** A way of encoding the Buffer into a one-byte encoded string (as defined by the IANA in RFC1345, page 63, to be the Latin-1 supplement block and C0/C1 control codes). *Value*: `latin1`
  - `binary` **<String\>** Alias for *latin1*. *Value*: `binary`
  - `hex` **<String\>** Encode each byte as two hexadecimal characters. *Value*: `hex`

Example:
```javascript
encodings.utf8; // 'utf8'
```

## Image

Image helper.

- `image`**<Object\>** with the following property:

### isPng(buffer)
Whether a buffer is of png format.
  - `buffer`**<Buffer\>**
  - Returns: **<Boolean\>**

## Math

Math helper.

- `math`**<Object\>** with the following property:

### minmax(array)
Directly get min and max values in a specific array. Works with numbers or strings.
  - `array`**<Array\>**<Number|String\>
  - Returns: **<Object\>**
      - min: **<Number|String\>**
      - max: **<Number|String\>**

Examples:
```javascript
minmax([55, 9]); // { min: 9, max: 55 }
minmax(['a', 'b']); // { min: 'a', max: 'b' }
minmax({}); // {}
minmax(undefined|null|NaN); // {}
```

## Object
Object helper.

- `object`**<Object\>** with the following properties:

### exists(thing)
Whether the specified value is not *null*, *undefined* or *NaN*.
  - `thing`**<Any\>**
  - Returns: **<Boolean\>**

Examples:
```javascript
exists('hello'); // true
exists({}); // true
exists(undefined|null|NaN); // false
```

### is(Type, thing)
Whether the specified value is from the specified type regarding its whole prototype.
  - `Type`**<Constructor Function\>**
  - `thing`**<Any\>**
  - Returns: **<Boolean\>**

Examples:
```javascript
is(String, 'hello'); // true

class MyError extends Error {}
const err = new MyError;
is(MyError, err); // true
is(Error, err); // true

is(undefined|null|NaN, undefined|null|NaN); // false
```

### hasOwn(thing, prop)
Whether a specified object has a property in its own prototype. Works with symbols.
  - `thing`**<Any\>**
  - `prop`**<Any\>**
  - Returns: **<Boolean\>**

Examples:
```javascript
hasOwn({ x: 5 }, 'x'); // true

const s = Symbol();
const obj = { [s]: 'accessible within a symbol' };
hasOwn(obj, s); // true

const err = new Error;
hasOwn(err, 'name'); // false
hasOwn(err, 'message'); // false

hasOwn(undefined|null|NaN, undefined|null|NaN); // false
```

### has(thing, prop)
Whether a specified object has a property in its whole prototype. Works with symbols.
  - `thing`**<Any\>**
  - `prop`**<Any\>**
  - Returns: **<Boolean\>**

Examples:
```javascript
has({ x: 5 }, 'x'); // true

has([], Symbol.iterator); // true

const err = new Error;
has(err, 'name'); // true
has(err, 'message'); // true

has(undefined|null|NaN, undefined|null|NaN); // false
```

### sizeOwn(thing)
Number of own properties or length. For strings, empty characters aren't ignored.
  - `thing`**<Any\>**
  - Returns: **<Number\>**

Examples:
```javascript
sizeOwn({ x: 5 }); // 1

sizeOwn({}); // 0
sizeOwn([]); // 0
sizeOwn(''); // 0
sizeOwn('     '); // 5

sizeOwn(new Map([['key1', 'value1'], [2, 'value2']])); // 2

sizeOwn(undefined|null|NaN); // 0
```

### isEmptyOwn(thing)
Whether a specified object or value is empty. For strings, empty characters are considered empty.
  - `thing`**<Any\>**
  - Returns: **<Boolean\>**

Examples:
```javascript
isEmptyOwn({ x: 5 }); // false

isEmptyOwn({}); // true
isEmptyOwn([]); // true
isEmptyOwn('     '); // true

isEmptyOwn(new Map([['key1', 'value1'], [2, 'value2']])); // false

isEmptyOwn(undefined|null|NaN); // true
```

### getType(thing)
Get the object's type.
  - `thing`**<Any\>**
  - Returns: **<Constructor Function\>** | **undefined**

Examples:
```javascript
getType({}); // [Function: Object]
getType([]); // [Function: Array]
getType(''); // [Function: String]

class MyError extends Error {}
getType(new MyError); // [Function: MyError]

getType(undefined|null|NaN); // undefined
```

### getTypeName(thing)
Get the object's type name.
  - `thing`**<Any\>**
  - Returns: **<String\>** | **undefined**

Examples:
```javascript
getTypeName({}); // 'Object'
getTypeName([]); // 'Array'
getTypeName(''); // 'String'

class MyError extends Error {}
getTypeName(new MyError); // 'MyError'

getTypeName(undefined|null|NaN); // undefined
```

### compare(a, b)
Compare two numbers or two strings (ignoring case and accents).
  - `a`**<String|Number\>**
  - `b`**<String|Number\>**
  - Returns: **<Object\>**
      - inferior: **<Boolean\>**
      - superior: **<Boolean\>**
      - equal: **<Boolean\>**

Examples:
```javascript
compare('a', 'z'); // { inferior: true, superior: false, equal: false }
compare(55, 9); // { inferior: false, superior: true, equal: false }
compare(5, 5); // { inferior: false, superior: false, equal: true }
compare(null); // {}
compare(undefined); // {}
compare(NaN, NaN); // {}
compare(); // {}
```

### clone(thing)
Make a deep copy of a specified object. **Does not handle circular references, use with caution**.
  - `thing`**<Any\>**
  - Returns: **<Any\>**


**Supported**:
  - object literal
  - custom object including its whole prototype
  - primitives:
    - *boolean*
    - *number*
    - *string*
    - *symbol*
  - *String*
  - *Number*
  - *Boolean*
  - *Array*
  - *Map*
  - *Set*
  - *DataView*
  - *Buffer*
  - *ArrayBuffer*
  - *Date*
  - *RegExp*
  - *Error*
  - *EvalError*
  - *RangeError*
  - *ReferenceError*
  - *SyntaxError*
  - *TypeError*
  - *URIError*
  - Typed Arrays:
    - *Int8Array*
    - *Uint8Array*
    - *Uint8ClampedArray*
    - *Int16Array*
    - *Uint16Array*
    - *Int32Array*
    - *Uint32Array*
    - *Float32Array*
    - *Float64Array*


**Not supported**:
  - *AsyncFunction*
  - *Function*
  - *GeneratorFunction*
  - *Intl.Collator*
  - *Intl.DateTimeFormat*
  - *Intl.NumberFormat*
  - *Intl.PluralRules*
  - *Promise*
  - *Proxy* (but impossible to check if an object is a proxy until Node v10)
  - *WeakMap*
  - *WeakSet*
  - *SharedArrayBuffer* (for security reasons)


Examples:
```javascript
// bad
const obj = { a: { b: { c : 3 } } };
const copy = Object.assign({}, obj);

copy.a.b = 3; // { a: { b: 3 } }
obj; // { a: { b: 3 } }

// better
const obj = { a: { b: { c : 3 } } };
const copy = clone(obj);

copy.a.b = 3; // { a: { b: 3 } }
obj; // { a: { b: { c : 3 } } }

clone(undefined); // undefined
clone(null); // null
clone(NaN); // NaN
```

## Requester
Http/s request helper.

- `requester`**<AsyncFunction\>**

### requester(options): AsyncFunction
  - `options`* **<Object\>**:
    - `url`* **<String\>** The url to request.
    - `method`**<String\>** The HTTP request method. *Default*: `GET`.
    - `headers`**<Object\>** An object containing request headers. *Default*: `{}`.
    - `data`**<Any\>** Data to write to the request. *Default*: `{}`.
    - `format`**<String\>** The response format expected. One of *json*, *string*, *buffer*, *stream*. *Default*: `stream`.
    - `encoding`**<String\>** The response encoding. See [encodings](encodings). *Default*: `utf8`.
    - `agent`**<http.Agent\>** | **<Boolean\>** Controls Agent behavior. *false* means a new Agent with default values will be used. *Default*: `undefined`.
    - `auth`**<String\>** Basic authentication i.e. 'user:password' to compute an Authorization header. *Default*: `undefined`.
    - `createConnection`**<Function\>** A function that produces a socket/stream to use for the request when the agent option is not used. This can be used to avoid creating a custom Agent class just to override the default *createConnection* function. *Default*: `undefined`.
    - `defaultPort`**<Number\>** Default port for the protocol. *Default*: `agent.defaultPort` | `undefined`.
    - `family`**<Number\>** IP address family to use when resolving host or hostname. Valid values are *4* or *6*. When unspecified, both IP v4 and v6 will be used. *Default*: `undefined`.
    - `localAddress`**<String\>** Local interface to bind for network connections. *Default*: `undefined`.
    - `lookup`**<Function\>** Custom lookup function. *Default*: `dns.lookup()`.
    - `maxHeaderSize`**<Number\>** Optionally overrides the value of *--max-http-header-size* for requests received from the server, i.e. the maximum length of response headers in bytes. **For Node >= v13.3.0**. *Default*: `8192`.
    - `timeout`**<Number\>** A number specifying the socket timeout in milliseconds. This will set the timeout before the socket is connected. *Default*: `60000`.


  - Returns: **<Promise\>**
    - Resolve: **<Object\>**
      - `statusCode` **<Number\>** The http/s response status code.
      - `headers` **<Object\>** The http/s response headers.
      - `body` **<Object\>** | **<String\>** | **<Buffer\>** | **<http.ServerResponse\>** The response body.
    - Throws: **<RequesterError\>**

\* required

Examples:
```javascript
// GET to have crypto market data in json
(async () => {
  try {
    const { statusCode, headers, body } = await requester({
      url: 'https://api.coinpaprika.com/v1/global',
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      format: 'json',
      encoding: 'utf8',
    });

    // ...
  } catch (e) {
    // handle error
  }
})();
```

```javascript
// GET to have crypto market data in json and pipe the response stream into a file
const stream = require('stream');
const { createWriteStream } = require('fs');
const { promisify } = require('util');

const pipeline = promisify(stream.pipeline);

(async () => {
  try {
    const wstream = createWriteStream('crypto_market_data.json');
    const { body: rstream } = await requester({
      url: 'https://api.coinpaprika.com/v1/global',
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      format: 'stream',
      encoding: 'utf8',
    });

    await pipeline(rstream, wstream); // node >=10.0.0
  } catch (e) {
    // handle error
  }
})();
```

```javascript
// POST to get an access token
(async () => {
  try {
    const { statusCode, headers, body } = await requester({
      url: `url/to/get/token`,
      method: 'POST',
      encoding: 'utf8',
      format: 'json',
      data: {
        grant_type: 'example',
        client_id: 'example',
        username: 'example',
        password: 'example',
        broker: 'example',
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // ...
  } catch (e) {
    // handle error
  }
})();
```

```javascript
// GET to have an image data stream and pipe the response stream into a file
const stream = require('stream');
const { createWriteStream } = require('fs');
const { promisify } = require('util');

const pipeline = promisify(stream.pipeline);

(async () => {
  try {
    const wstream = createWriteStream('bitcoin.svg', 'binary');
    const { body: rstream } = await requester({
      url: `https://bitcoin.org/img/home/bitcoin-img.svg`,
      method: 'GET',
      format: 'stream',
      encoding: 'binary',
      headers: {
        Accept: 'image/*',
        'Content-Type': 'image/*',
      },
    });

    await pipeline(rstream, wstream); // node >=10.0.0
  } catch (e) {
    // handle error
  }
})();
```

## String

String helper.

- `string`**<Object\>** with the following properties:

### split({ string, separator[, max] })
Split a string with the specified separator with a possible maximum split values.
  - `options`**<Object\>**
    - `string`**<String\>**
    - `separator`**<String\>** | **<RegExp\>**
    - `max`**<Number\>** Optional maximum split values.
  - Returns: **<Array\>**

Examples:
```javascript
split({ string: 'a,b,c,d,e', separator: ',' }) // ['a', 'b', 'c', 'd', 'e']
split({ string: 'a,b,c,d,e', separator: ',', max: 2 }) // ['a', 'b']
split({ string: 'a, b,c,  d,e', separator: /,\s*/, max: 2 }) // ['a', 'b']
split() // []
split({ string: 'a, b,c,  d,e', max: 2 }) // []
split({ string: 'a, b,c,  d,e' }) // []
```

### capitalize({ string[, first] })
put to upper case the first letter of a string.
  - `options`**<Object\>**
    - `string`**<String\>**
    - `first`**<Boolean\>** Whether only the first letter should be in upper case.
    - `max`**<Number\>** Optional maximum split values.
  - Returns: **<String\>**

Examples:
```javascript
capitalize({ string: 'abcde' }) // "Abcde"
capitalize({ string: ' abcde' }) // " abcde"
capitalize({ string: 'abCDe' }) // "AbCDe"
capitalize({ string: 'abCDe', first: true }) // "Abcde"
capitalize() // ""
capitalize({ first: true }) // ""
```

### camelCase({ string, separator })
Put to camel case a string which words are separated by a specific string or pattern.
  - `options`**<Object\>**
    - `string`**<String\>**
    - `separator`**<String\>** | **<RegExp\>**
  - Returns: **<String\>**

Examples:
```javascript
camelCase({ string: 'camel-case-string', separator: '-' }) // "camelCaseString"
camelCase({ string: 'camel, case, string', separator: ', ' }) // "camelCaseString"
camelCase({ string: 'camel*case*string', separator: '*' }) // "camelCaseString"
camelCase({ string: 'camel,   case,  string', separator: /,\s+/ }) // "camelCaseString"
camelCase({ string: 'camel,   case,string', separator: /,\s*/ }) // "camelCaseString"
camelCase() // ""
camelCase({ string: 'camel,case,string' }) // ""
camelCase({ separator: ',' }) // ""
```

## Time
Time helper.

- `time`**<Object\>** with the following properties:

### sleep(ms)
Sleep during *ms* milliseconds without blocking the loop.
  - `ms`**<Number\>** Time in milliseconds. *Min*: `0` *Default*: `0`.
  - Returns: **<Promise\>**
    - Resolve: **<undefined\>**
    - Never throws

Examples:
```javascript
(async () => {
  console.log('hello');
  await sleep(2000); // sleeps 2s
  console.log('world');
})();
```

### isISOStringDate(thing)
Whether a string respects the ISO 8601 format.
  - `thing`**<String\>**
  - Returns: **<Boolean\>**

Examples:
```javascript
isISOStringDate('2020-01-25T00:00:00.000Z'); // true
isISOStringDate('2020-01-25'); // false
isISOStringDate(''|undefined|null|NaN); // false
```

### toLocaleISOString(d)
Get the locale ISO 8601 formatted string for a specified date.
  - `d`**<Date\>**
  - Returns: **<String\>** | **<undefined\>**

Examples:
```javascript
const d = new Date('2020-01-25T15:58:37.181Z');
d.toISOString(); // '2020-01-13T15:58:37.181Z'
toLocaleISOString(d); // '2020-01-13T16:58:37.181Z' (Paris time)
toLocaleISOString(undefined|null|NaN); // undefined
```

## Uuid
Uuid helper.

- `uuid`**<Object\>** with the following properties:

### isValidUUID(thing[, version])
Whether a string is a valid uuid in a specified version.
  - `thing`**<String\>**
  - `version`**<String\>** *Min*: `0` *Max*: `4` *Default*: `4`.
  - Returns: **<Boolean\>**

Examples:
```javascript
isValidUUID('ed94d970-3620-11ea-9dee-255c978dde81', 1); // true
isValidUUID('ed94d970-3620-11ea-9dee-255c978dde81', 5); // false
isValidUUID('0b5cce8d-f392-4636-a9c4-fee990d0ce5e'); // true
isValidUUID(''|undefined|null|NaN, undefined|null|NaN); // false
```

## Environment variables

- **NODE_DEBUG**: used to debug *requester* helper.

  Examples:
  - `NODE_DEBUG=requester` will debug requester helper.
  - `NODE_DEBUG=*` will debug requester helper plus other modules used in your project like fs, http, etc and using native *util.debuglog* debug function.

## Errors

### Object structure

Errors emitted by **c o n s i s** are native Error with an additional *code* property:

```javascript
{
  name,
  code,
  message,
  stack,
}
```

### Codes

<table style="text-align: center; vertical-align: center">
  <tr>
    <th style="text-align: center;">name</th>
    <th style="text-align: center;">code</th>
    <th style="text-align: center;">description</th>
    <th style="text-align: center;">module</th>
  </tr>

  <tr>
    <td rowspan="11"><i>RequesterError</i></td>
  </tr>

  <tr>
    <td>MISSING_OPTIONS</td>
    <td><i>options</i> parameter is missing</td>
    <td>lib/requester</td>
  </tr>

  <tr>
    <td>BAD_URL_PROTOCOL</td>
    <td>protocol found in <i>options.url</i> is invalid</td>
    <td>lib/requester</td>
  </tr>

  <tr>
    <td>BAD_URL</td>
    <td><i>options.url</i> is invalid</td>
    <td>lib/requester</td>
  </tr>

  <tr>
    <td>BAD_FORMAT</td>
    <td><i>options.format</i> is invalid</td>
    <td>lib/requester</td>
  </tr>

  <tr>
    <td>BAD_ENCODING</td>
    <td><i>options.encoding</i> is invalid</td>
    <td>lib/requester</td>
  </tr>

  <tr>
    <td>STRINGIFY_BODY_ERROR</td>
    <td>stringifying request body from <i>options.data</i> led to an error</td>
    <td>lib/requester</td>
  </tr>

  <tr>
    <td>RESPONSE_ERROR</td>
    <td>an error occurred on <i>http.ServerResponse</i> stream</td>
    <td>lib/requester</td>
  </tr>

  <tr>
    <td>RESPONSE_FORMAT_ERROR</td>
    <td>an error occurred when formatting response body, based on <i>options.format</i> value</td>
    <td>lib/requester</td>
  </tr>

  <tr>
    <td>REQUEST_ERROR</td>
    <td>an error occurred on <i>http.ClientRequest</i> stream</td>
    <td>lib/requester</td>
  </tr>

  <tr>
    <td>REQUEST_TIMEOUT</td>
    <td>request timed out, based on <i>options.timeout</i> value</td>
    <td>lib/requester</td>
  </tr>

</table>

# Contribution

All contributions are greatly welcomed :)

Please follow Git flow, ES6/7, ESLint Airbnb base rules.

# Licence

*consis* is released under the MIT license.

Copyright (C) 2020 Adrien Valcke

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
