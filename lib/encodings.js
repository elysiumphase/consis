/**
 * Node supported encodings.
 *
 *    - ascii: for 7-bit ASCII data only. This encoding is fast
 *             and will strip the high bit if set.
 *    - utf8: multibyte encoded Unicode characters.
 *    - utf16le: 2 or 4 bytes, little-endian encoded Unicode characters
 *               Surrogate pairs (U+10000 to U+10FFFF) are supported.
 *    - ucs2: alias for 'utf16le'.
 *    - base64: when creating a Buffer from a string, this encoding
 *              will also correctly accept "URL and Filename Safe Alphabet"
 *              as specified in RFC4648, Section 5.
 *    - latin1: a way of encoding the Buffer into a one-byte encoded string (as defined by the IANA
 *              in RFC1345, page 63, to be the Latin-1 supplement block and C0/C1 control codes).
 *    - binary: alias for 'latin1'.
 *    - hex: encode each byte as two hexadecimal characters.
 */

const encodings = {
  ascii: 'ascii',
  utf8: 'utf8',
  utf16le: 'utf16le',
  ucs2: 'ucs2',
  base64: 'base64',
  latin1: 'latin1',
  binary: 'binary',
  hex: 'hex',
};

module.exports = Object.freeze(encodings);
