/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2016 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 1.0.0 | http://apidev.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
///                                              }|
///                                              }|
///                                              }|     　 へ　　　 ／|    
///      _______     _______         ______      }|      /　│　　 ／ ／
///     /  ___  |   |_   __ \      .' ____ '.    }|     │　Z ＿,＜　／　　 /`ヽ
///    |  (__ \_|     | |__) |     | (____) |    }|     │　　　　　ヽ　　 /　　〉
///     '.___`-.      |  __ /      '_.____. |    }|      Y　　　　　`　 /　　/
///    |`\____) |    _| |  \ \_    | \____| |    }|    ｲ●　､　●　　⊂⊃〈　　/
///    |_______.'   |____| |___|    \______,'    }|    ()　 v　　　　|　＼〈
///    |=========================================\|    　>ｰ ､_　 ィ　 │ ／／
///    |> LESS IS MORE                           ||     / へ　　 /　ﾉ＜|＼＼
///    `=========================================/|    ヽ_ﾉ　　(_／　 │／／
///                                              }|     7　　　　　　  |／
///                                              }|     ＞―r￣￣`ｰ―＿`
///                                              }|
///                                              }|
/// Permission is hereby granted, free of charge, to any person obtaining a copy
/// of this software and associated documentation files (the "Software"), to deal
/// in the Software without restriction, including without limitation the rights
/// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
/// copies of the Software, and to permit persons to whom the Software is
/// furnished to do so, subject to the following conditions:
///
/// The above copyright notice and this permission notice shall be included in all
/// copies or substantial portions of the Software.
///
/// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
/// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
/// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
/// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
/// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
/// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
/// THE SOFTWARE.
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
};

},{}],2:[function(require,module,exports){
'use strict'

exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

function init () {
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
}

init()

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],3:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; i++) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  that.write(string, encoding)
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

function arrayIndexOf (arr, val, byteOffset, encoding) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var foundIndex = -1
  for (var i = 0; byteOffset + i < arrLength; i++) {
    if (read(arr, byteOffset + i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
      if (foundIndex === -1) foundIndex = i
      if (i - foundIndex + 1 === valLength) return (byteOffset + foundIndex) * indexSize
    } else {
      if (foundIndex !== -1) i -= i - foundIndex
      foundIndex = -1
    }
  }
  return -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  if (Buffer.isBuffer(val)) {
    // special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(this, val, byteOffset, encoding)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset, encoding)
  }

  throw new TypeError('val must be string, number or Buffer')
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; i++) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; i++) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"base64-js":2,"ieee754":106,"isarray":107}],4:[function(require,module,exports){
'use strict';

var object        = require('es5-ext/object/valid-object')
  , stringifiable = require('es5-ext/object/validate-stringifiable-value')
  , forOf         = require('es6-iterator/for-of');

module.exports = function (text, style) {
	var result = '';
	text = stringifiable(text);
	object(style);
	forOf(text, function (char) { result += style[char] || char; });
	return result;
};

},{"es5-ext/object/valid-object":81,"es5-ext/object/validate-stringifiable-value":83,"es6-iterator/for-of":94}],5:[function(require,module,exports){
(function (process){
'use strict';

var d              = require('d')
  , assign         = require('es5-ext/object/assign')
  , forEach        = require('es5-ext/object/for-each')
  , map            = require('es5-ext/object/map')
  , primitiveSet   = require('es5-ext/object/primitive-set')
  , setPrototypeOf = require('es5-ext/object/set-prototype-of')
  , memoize        = require('memoizee')
  , memoizeMethods = require('memoizee/methods')

  , sgr = require('./lib/sgr')
  , mods = sgr.mods

  , join = Array.prototype.join, defineProperty = Object.defineProperty
  , max = Math.max, min = Math.min
  , variantModes = primitiveSet('_fg', '_bg')
  , xtermMatch, getFn;

// Some use cli-color as: console.log(clc.red('Error!'));
// Which is inefficient as on each call it configures new clc object
// with memoization we reuse once created object
var memoized = memoize(function (scope, mod) {
	return defineProperty(getFn(), '_cliColorData', d(assign({}, scope._cliColorData, mod)));
});

var proto = Object.create(Function.prototype, assign(map(mods, function (mod) {
	return d.gs(function () { return memoized(this, mod); });
}), memoizeMethods({
	// xterm (255) color
	xterm: d(function (code) {
		code = isNaN(code) ? 255 : min(max(code, 0), 255);
		return defineProperty(getFn(), '_cliColorData',
			d(assign({}, this._cliColorData, {
				_fg: [xtermMatch ? xtermMatch[code] : ('38;5;' + code), 39]
			})));
	}),
	bgXterm: d(function (code) {
		code = isNaN(code) ? 255 : min(max(code, 0), 255);
		return defineProperty(getFn(), '_cliColorData',
			d(assign({}, this._cliColorData, {
				_bg: [xtermMatch ? (xtermMatch[code] + 10) : ('48;5;' + code), 49]
			})));
	})
})));

var getEndRe = memoize(function (code) {
	return new RegExp('\x1b\\[' + code + 'm', 'g');
}, { primitive: true });

if (process.platform === 'win32') xtermMatch = require('./lib/xterm-match');

getFn = function () {
	return setPrototypeOf(function self(/*…msg*/) {
		var start = '', end = '', msg = join.call(arguments, ' '), conf = self._cliColorData
		  , hasAnsi = sgr.hasCSI(msg);
		forEach(conf, function (mod, key) {
			end    = sgr(mod[1]) + end;
			start += sgr(mod[0]);
			if (hasAnsi) {
				msg = msg.replace(getEndRe(mod[1]), variantModes[key] ? sgr(mod[0]) : '');
			}
		}, null, true);
		return start + msg + end;
	}, proto);
};

module.exports = Object.defineProperties(getFn(), {
	xtermSupported: d(!xtermMatch),
	_cliColorData: d('', {})
});

}).call(this,require('_process'))

},{"./lib/sgr":11,"./lib/xterm-match":13,"_process":129,"d":33,"es5-ext/object/assign":60,"es5-ext/object/for-each":66,"es5-ext/object/map":73,"es5-ext/object/primitive-set":76,"es5-ext/object/set-prototype-of":77,"memoizee":114,"memoizee/methods":121}],6:[function(require,module,exports){
'use strict';

module.exports = '\x07';

},{}],7:[function(require,module,exports){
'use strict';

var from          = require('es5-ext/array/from')
  , iterable      = require('es5-ext/iterable/validate-object')
  , stringifiable = require('es5-ext/object/validate-stringifiable')
  , pad           = require('es5-ext/string/#/pad');

module.exports = function (rows/*, options*/) {
	var options = Object(arguments[1]), cols = [];
	return from(iterable(rows), function (row, index) {
		return from(iterable(row), function (str, index) {
			var col = cols[index];
			if (!col) col = cols[index] = { width: 0 };
			str = stringifiable(str);
			if (str.length > col.width) col.width = str.length;
			return str;
		});
	}).map(function (row) {
		return row.map(function (item, index) {
			return pad.call(item, ' ', -cols[index].width);
		}).join((options.sep == null) ? ' | ' : options.sep);
	}).join('\n') + '\n';
};

},{"es5-ext/array/from":39,"es5-ext/iterable/validate-object":50,"es5-ext/object/validate-stringifiable":84,"es5-ext/string/#/pad":88}],8:[function(require,module,exports){
'use strict';

module.exports = {
	screen: '\x1b[2J',
	screenLeft: '\x1b[1J',
	screenRight: '\x1b[J',
	line: '\x1b[2K',
	lineLeft: '\x1b[1K',
	lineRight: '\x1b[K'
};

},{}],9:[function(require,module,exports){
'use strict';
/*
 * get actual length of ANSI-formatted string
 */

var strip = require('./strip');

module.exports = function (str) {
	return strip(str).length;
};

},{"./strip":17}],10:[function(require,module,exports){
'use strict';

var d = require('d');

module.exports = Object.defineProperties(require('./bare'), {
	windowSize: d(require('./window-size')),
	erase: d(require('./erase')),
	move: d(require('./move')),
	beep: d(require('./beep')),
	columns: d(require('./columns')),
	strip: d(require('./strip')),
	getStrippedLength: d(require('./get-stripped-length')),
	slice: d(require('./slice')),
	throbber: d(require('./throbber')),
	reset: d(require('./reset')),
	art: d(require('./art'))
});

},{"./art":4,"./bare":5,"./beep":6,"./columns":7,"./erase":8,"./get-stripped-length":9,"./move":14,"./reset":15,"./slice":16,"./strip":17,"./throbber":18,"./window-size":19,"d":33}],11:[function(require,module,exports){
'use strict';
/* CSI - control sequence introducer */
/* SGR - set graphic rendition */

var assign   = require('es5-ext/object/assign')
  , includes = require('es5-ext/string/#/contains')
  , forOwn   = require('es5-ext/object/for-each')
  , onlyKey  = require('es5-ext/object/first-key')
  , forEachRight = require('es5-ext/array/#/for-each-right')
  , uniq = require('es5-ext/array/#/uniq.js');

var CSI = '\x1b[';

var sgr = function (code) {
	return CSI + code + 'm';
};

sgr.CSI = CSI;

var mods = assign({
	// Style
	bold:      { _bold: [1, 22] },
	italic:    { _italic: [3, 23] },
	underline: { _underline: [4, 24] },
	blink:     { _blink: [5, 25] },
	inverse:   { _inverse: [7, 27] },
	strike:    { _strike: [9, 29] }

	// Color
}, ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
	.reduce(function (obj, color, index) {
		// foreground
		obj[color] = { _fg: [30 + index, 39] };
		obj[color + 'Bright'] = { _fg: [90 + index, 39] };

		// background
		obj['bg' + color[0].toUpperCase() + color.slice(1)] = { _bg: [40 + index, 49] };
		obj['bg' + color[0].toUpperCase() + color.slice(1) + 'Bright'] = { _bg: [100 + index, 49] };

		return obj;
	}, {}));

sgr.mods = mods;

sgr.openers = {};
sgr.closers = {};

forOwn(mods, function (mod) {
	var modPair = mod[onlyKey(mod)];

	sgr.openers[modPair[0]] = modPair;
	sgr.closers[modPair[1]] = modPair;
});

sgr.openStyle = function (mods, code) {
	mods.push(sgr.openers[code]);
};

sgr.closeStyle = function (mods, code) {
	forEachRight.call(mods, function (modPair, index) {
		if (modPair[1] === code) {
			mods.splice(index, 1);
		}
	});
};

/* prepend openers */
sgr.prepend = function (mods) {
	return mods.map(function (modPair, key) {
		return sgr(modPair[0]);
	});
};

/* complete non-closed openers with corresponding closers */
sgr.complete = function (mods, closerCodes) {
	closerCodes.forEach(function (code) {
		sgr.closeStyle(mods, code);
	});

	// mods must be closed from the last opened to first opened
	mods = mods.reverse();

	mods = mods.map(function (modPair, key) {
		return modPair[1];
	});

	// one closer can close many openers (31, 32 -> 39)
	mods = uniq.call(mods);

	return mods.map(sgr);
};

var hasCSI = function (str) {
	return includes.call(str, CSI);
};

sgr.hasCSI = hasCSI;

var extractCode = function (csi) {
	var code = csi.slice(2, -1);
	code = Number(code);
	return code;
};

sgr.extractCode = extractCode;

module.exports = sgr;

},{"es5-ext/array/#/for-each-right":37,"es5-ext/array/#/uniq.js":38,"es5-ext/object/assign":60,"es5-ext/object/first-key":65,"es5-ext/object/for-each":66,"es5-ext/string/#/contains":85}],12:[function(require,module,exports){
'use strict';

module.exports = [
	"000000", "800000", "008000", "808000", "000080", "800080", "008080", "c0c0c0",
	"808080", "ff0000", "00ff00", "ffff00", "0000ff", "ff00ff", "00ffff", "ffffff",

	"000000", "00005f", "000087", "0000af", "0000d7", "0000ff",
	"005f00", "005f5f", "005f87", "005faf", "005fd7", "005fff",
	"008700", "00875f", "008787", "0087af", "0087d7", "0087ff",
	"00af00", "00af5f", "00af87", "00afaf", "00afd7", "00afff",
	"00d700", "00d75f", "00d787", "00d7af", "00d7d7", "00d7ff",
	"00ff00", "00ff5f", "00ff87", "00ffaf", "00ffd7", "00ffff",

	"5f0000", "5f005f", "5f0087", "5f00af", "5f00d7", "5f00ff",
	"5f5f00", "5f5f5f", "5f5f87", "5f5faf", "5f5fd7", "5f5fff",
	"5f8700", "5f875f", "5f8787", "5f87af", "5f87d7", "5f87ff",
	"5faf00", "5faf5f", "5faf87", "5fafaf", "5fafd7", "5fafff",
	"5fd700", "5fd75f", "5fd787", "5fd7af", "5fd7d7", "5fd7ff",
	"5fff00", "5fff5f", "5fff87", "5fffaf", "5fffd7", "5fffff",

	"870000", "87005f", "870087", "8700af", "8700d7", "8700ff",
	"875f00", "875f5f", "875f87", "875faf", "875fd7", "875fff",
	"878700", "87875f", "878787", "8787af", "8787d7", "8787ff",
	"87af00", "87af5f", "87af87", "87afaf", "87afd7", "87afff",
	"87d700", "87d75f", "87d787", "87d7af", "87d7d7", "87d7ff",
	"87ff00", "87ff5f", "87ff87", "87ffaf", "87ffd7", "87ffff",

	"af0000", "af005f", "af0087", "af00af", "af00d7", "af00ff",
	"af5f00", "af5f5f", "af5f87", "af5faf", "af5fd7", "af5fff",
	"af8700", "af875f", "af8787", "af87af", "af87d7", "af87ff",
	"afaf00", "afaf5f", "afaf87", "afafaf", "afafd7", "afafff",
	"afd700", "afd75f", "afd787", "afd7af", "afd7d7", "afd7ff",
	"afff00", "afff5f", "afff87", "afffaf", "afffd7", "afffff",

	"d70000", "d7005f", "d70087", "d700af", "d700d7", "d700ff",
	"d75f00", "d75f5f", "d75f87", "d75faf", "d75fd7", "d75fff",
	"d78700", "d7875f", "d78787", "d787af", "d787d7", "d787ff",
	"d7af00", "d7af5f", "d7af87", "d7afaf", "d7afd7", "d7afff",
	"d7d700", "d7d75f", "d7d787", "d7d7af", "d7d7d7", "d7d7ff",
	"d7ff00", "d7ff5f", "d7ff87", "d7ffaf", "d7ffd7", "d7ffff",

	"ff0000", "ff005f", "ff0087", "ff00af", "ff00d7", "ff00ff",
	"ff5f00", "ff5f5f", "ff5f87", "ff5faf", "ff5fd7", "ff5fff",
	"ff8700", "ff875f", "ff8787", "ff87af", "ff87d7", "ff87ff",
	"ffaf00", "ffaf5f", "ffaf87", "ffafaf", "ffafd7", "ffafff",
	"ffd700", "ffd75f", "ffd787", "ffd7af", "ffd7d7", "ffd7ff",
	"ffff00", "ffff5f", "ffff87", "ffffaf", "ffffd7", "ffffff",

	"080808", "121212", "1c1c1c", "262626", "303030", "3a3a3a",
	"444444", "4e4e4e", "585858", "626262", "6c6c6c", "767676",
	"808080", "8a8a8a", "949494", "9e9e9e", "a8a8a8", "b2b2b2",
	"bcbcbc", "c6c6c6", "d0d0d0", "dadada", "e4e4e4", "eeeeee"
];

},{}],13:[function(require,module,exports){
'use strict';

var push = Array.prototype.push, reduce = Array.prototype.reduce, abs = Math.abs
  , colors, match, result, i;

colors = require('./xterm-colors').map(function (color) {
	return {
		r: parseInt(color.slice(0, 2), 16),
		g: parseInt(color.slice(2, 4), 16),
		b: parseInt(color.slice(4), 16)
	};
});

match = colors.slice(0, 16);

module.exports = result = [];

i = 0;
while (i < 8) {
	result.push(30 + i++);
}
i = 0;
while (i < 8) {
	result.push(90 + i++);
}
push.apply(result, colors.slice(16).map(function (data) {
	var index, diff = Infinity;
	match.every(function (match, i) {
		var ndiff = reduce.call('rgb', function (diff, channel) {
			diff += abs(match[channel] - data[channel]);
			return diff;
		}, 0);
		if (ndiff < diff) {
			index = i;
			diff = ndiff;
		}
		return ndiff;
	});
	return result[index];
}));

},{"./xterm-colors":12}],14:[function(require,module,exports){
'use strict';

var d     = require('d')
  , trunc = require('es5-ext/math/trunc')

  , up, down, right, left
  , abs = Math.abs, floor = Math.floor, max = Math.max;

var getMove = function (control) {
	return function (num) {
		num = isNaN(num) ? 0 : max(floor(num), 0);
		return num ? ('\x1b[' + num + control) : '';
	};
};
module.exports = Object.defineProperties(function (x, y) {
	x = isNaN(x) ? 0 : floor(x);
	y = isNaN(y) ? 0 : floor(y);
	return ((x > 0) ? right(x) : left(-x)) + ((y > 0) ? down(y) : up(-y));
}, {
	up: d(up = getMove('A')),
	down: d(down = getMove('B')),
	right: d(right = getMove('C')),
	left: d(left = getMove('D')),
	to: d(function (x, y) {
		x = isNaN(x) ? 1 : (max(floor(x), 0) + 1);
		y = isNaN(y) ? 1 : (max(floor(y), 0) + 1);
		return '\x1b[' + y + ';' + x + 'H';
	}),
	lines: d(function (n) {
		var dir;
		n = trunc(n) || 0;
		dir = (n >= 0) ? 'E' : 'F';
		n = floor(abs(n));
		return '\x1b[' + n + dir;
	})
});

},{"d":33,"es5-ext/math/trunc":54}],15:[function(require,module,exports){
'use strict';

module.exports = '\x1b[2J\x1b[0;0H';

},{}],16:[function(require,module,exports){
'use strict';

var reAnsi        = require('ansi-regex')
  , stringifiable = require('es5-ext/object/validate-stringifiable-value')
  , length        = require('./get-stripped-length')
  , sgr           = require('./lib/sgr')

  , max = Math.max;

var Token = function Token(token) {
	this.token = token;
};

var tokenize = function (str) {
	var match = reAnsi().exec(str);

	if (!match) {
		return [ str ];
	}

	var index = match.index
	  , head, prehead, tail;

	if (index === 0) {
		head = match[0];
		tail = str.slice(head.length);

		return [ new Token(head) ].concat(tokenize(tail));
	}

	prehead = str.slice(0, index);
	head = match[0];
	tail = str.slice(index + head.length);

	return [ prehead, new Token(head) ].concat(tokenize(tail));
};

var isChunkInSlice = function (chunk, index, begin, end) {
	var endIndex = chunk.length + index;

	if (begin > endIndex) return false;
	if (end < index) return false;
	return true;
};

var sliceSeq = function (seq, begin, end) {
	var sliced = seq.reduce(function (state, chunk) {
		var index = state.index;

		if (!(chunk instanceof Token)) {
			var nextChunk = '';

			if (isChunkInSlice(chunk, index, begin, end)) {
				var relBegin = Math.max(begin - index, 0)
				  , relEnd   = Math.min(end - index, chunk.length);

				nextChunk = chunk.slice(relBegin, relEnd);
			}

			state.seq.push(nextChunk);
			state.index = index + chunk.length;
		} else {
			var code = sgr.extractCode(chunk.token);

			if (index <= begin) {
				if (code in sgr.openers) {
					sgr.openStyle(state.preOpeners, code);
				}
				if (code in sgr.closers) {
					sgr.closeStyle(state.preOpeners, code);
				}
			} else if (index < end) {
				if (code in sgr.openers) {
					sgr.openStyle(state.inOpeners, code);
					state.seq.push(chunk);
				} else if (code in sgr.closers) {
					state.inClosers.push(code);
					state.seq.push(chunk);
				}
			}
		}

		return state;
	}, {
		index: 0,
		seq: [],

		// preOpeners -> [ mod ]
		// preOpeners must be prepended to the slice if they wasn't closed til the end of it
		// preOpeners must be closed if they wasn't closed til the end of the slice
		preOpeners: [],

		// inOpeners  -> [ mod ]
		// inOpeners already in the slice and must not be prepended to the slice
		// inOpeners must be closed if they wasn't closed til the end of the slice
		inOpeners:  [], // opener CSI inside slice

		// inClosers -> [ code ]
		// closer CSIs for determining which pre/in-Openers must be closed
		inClosers:  []
	});

	sliced.seq = [].concat(
		sgr.prepend(sliced.preOpeners),
		sliced.seq,
		sgr.complete([].concat(sliced.preOpeners, sliced.inOpeners), sliced.inClosers)
	);

	return sliced.seq;
};

module.exports = function (str/*, begin, end*/) {
	var seq, begin = Number(arguments[1]), end = Number(arguments[2]), len;

	str = stringifiable(str);
	len = length(str);

	if (isNaN(begin)) {
		begin = 0;
	}
	if (isNaN(end)) {
		end = len;
	}
	if (begin < 0) {
		begin = max(len + begin, 0);
	}
	if (end < 0) {
		end = max(len + end, 0);
	}

	seq = tokenize(str);
	seq = sliceSeq(seq, begin, end);
	return seq.map(function (chunk) {
		if (chunk instanceof Token) {
			return chunk.token;
		}

		return chunk;
	}).join('');
};

},{"./get-stripped-length":9,"./lib/sgr":11,"ansi-regex":1,"es5-ext/object/validate-stringifiable-value":83}],17:[function(require,module,exports){
// Strip ANSI formatting from string

'use strict';

var stringifiable = require('es5-ext/object/validate-stringifiable')
  , r             = require('ansi-regex')();

module.exports = function (str) { return stringifiable(str).replace(r, ''); };

},{"ansi-regex":1,"es5-ext/object/validate-stringifiable":84}],18:[function(require,module,exports){
'use strict';

var compose      = require('es5-ext/function/#/compose')
  , callable     = require('es5-ext/object/valid-callable')
  , d            = require('d')
  , validTimeout = require('timers-ext/valid-timeout')

  , chars = '-\\|/', l = chars.length, ThrobberIterator;

ThrobberIterator = function () {};
Object.defineProperties(ThrobberIterator.prototype, {
	index: d(-1),
	running: d(false),
	next: d(function () {
		var str = this.running ? '\u0008' : '';
		if (!this.running) this.running = true;
		return str + chars[this.index = ((this.index + 1) % l)];
	}),
	reset: d(function () {
		if (!this.running) return '';
		this.index = -1;
		this.running = false;
		return '\u0008';
	})
});

module.exports = exports = function (write, interval/*, format*/) {
	var format = arguments[2], token, iterator = new ThrobberIterator();
	callable(write);
	interval = validTimeout(interval);
	if (format !== undefined) write = compose.call(write, callable(format));
	return {
		start: function () {
			if (token) return;
			token = setInterval(function () { write(iterator.next()); }, interval);
		},
		restart: function () {
			this.stop();
			this.start();
		},
		stop: function () {
			if (!token) return;
			clearInterval(token);
			token = null;
			write(iterator.reset());
		}
	};
};

Object.defineProperty(exports, 'Iterator', d(ThrobberIterator));

},{"d":33,"es5-ext/function/#/compose":44,"es5-ext/object/valid-callable":80,"timers-ext/valid-timeout":131}],19:[function(require,module,exports){
(function (process){
'use strict';

var d = require('d');

Object.defineProperties(exports, {
	width: d.gs('ce', function () { return process.stdout.columns || 0; }),
	height: d.gs('ce', function () { return process.stdout.rows || 0; })
});

}).call(this,require('_process'))

},{"_process":129,"d":33}],20:[function(require,module,exports){
'use strict';

var _buffer = require('buffer');

var _define_crc = require('./define_crc');

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _define_crc2.default)('crc1', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);

  var crc = ~ ~previous;
  var accum = 0;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    accum += byte;
  }

  crc += accum % 256;
  return crc % 256;
});
},{"./define_crc":30,"buffer":3}],21:[function(require,module,exports){
'use strict';

var _buffer = require('buffer');

var _define_crc = require('./define_crc');

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generated by `./pycrc.py --algorithm=table-driven --model=crc-16 --generate=c`
var TABLE = [0x0000, 0xc0c1, 0xc181, 0x0140, 0xc301, 0x03c0, 0x0280, 0xc241, 0xc601, 0x06c0, 0x0780, 0xc741, 0x0500, 0xc5c1, 0xc481, 0x0440, 0xcc01, 0x0cc0, 0x0d80, 0xcd41, 0x0f00, 0xcfc1, 0xce81, 0x0e40, 0x0a00, 0xcac1, 0xcb81, 0x0b40, 0xc901, 0x09c0, 0x0880, 0xc841, 0xd801, 0x18c0, 0x1980, 0xd941, 0x1b00, 0xdbc1, 0xda81, 0x1a40, 0x1e00, 0xdec1, 0xdf81, 0x1f40, 0xdd01, 0x1dc0, 0x1c80, 0xdc41, 0x1400, 0xd4c1, 0xd581, 0x1540, 0xd701, 0x17c0, 0x1680, 0xd641, 0xd201, 0x12c0, 0x1380, 0xd341, 0x1100, 0xd1c1, 0xd081, 0x1040, 0xf001, 0x30c0, 0x3180, 0xf141, 0x3300, 0xf3c1, 0xf281, 0x3240, 0x3600, 0xf6c1, 0xf781, 0x3740, 0xf501, 0x35c0, 0x3480, 0xf441, 0x3c00, 0xfcc1, 0xfd81, 0x3d40, 0xff01, 0x3fc0, 0x3e80, 0xfe41, 0xfa01, 0x3ac0, 0x3b80, 0xfb41, 0x3900, 0xf9c1, 0xf881, 0x3840, 0x2800, 0xe8c1, 0xe981, 0x2940, 0xeb01, 0x2bc0, 0x2a80, 0xea41, 0xee01, 0x2ec0, 0x2f80, 0xef41, 0x2d00, 0xedc1, 0xec81, 0x2c40, 0xe401, 0x24c0, 0x2580, 0xe541, 0x2700, 0xe7c1, 0xe681, 0x2640, 0x2200, 0xe2c1, 0xe381, 0x2340, 0xe101, 0x21c0, 0x2080, 0xe041, 0xa001, 0x60c0, 0x6180, 0xa141, 0x6300, 0xa3c1, 0xa281, 0x6240, 0x6600, 0xa6c1, 0xa781, 0x6740, 0xa501, 0x65c0, 0x6480, 0xa441, 0x6c00, 0xacc1, 0xad81, 0x6d40, 0xaf01, 0x6fc0, 0x6e80, 0xae41, 0xaa01, 0x6ac0, 0x6b80, 0xab41, 0x6900, 0xa9c1, 0xa881, 0x6840, 0x7800, 0xb8c1, 0xb981, 0x7940, 0xbb01, 0x7bc0, 0x7a80, 0xba41, 0xbe01, 0x7ec0, 0x7f80, 0xbf41, 0x7d00, 0xbdc1, 0xbc81, 0x7c40, 0xb401, 0x74c0, 0x7580, 0xb541, 0x7700, 0xb7c1, 0xb681, 0x7640, 0x7200, 0xb2c1, 0xb381, 0x7340, 0xb101, 0x71c0, 0x7080, 0xb041, 0x5000, 0x90c1, 0x9181, 0x5140, 0x9301, 0x53c0, 0x5280, 0x9241, 0x9601, 0x56c0, 0x5780, 0x9741, 0x5500, 0x95c1, 0x9481, 0x5440, 0x9c01, 0x5cc0, 0x5d80, 0x9d41, 0x5f00, 0x9fc1, 0x9e81, 0x5e40, 0x5a00, 0x9ac1, 0x9b81, 0x5b40, 0x9901, 0x59c0, 0x5880, 0x9841, 0x8801, 0x48c0, 0x4980, 0x8941, 0x4b00, 0x8bc1, 0x8a81, 0x4a40, 0x4e00, 0x8ec1, 0x8f81, 0x4f40, 0x8d01, 0x4dc0, 0x4c80, 0x8c41, 0x4400, 0x84c1, 0x8581, 0x4540, 0x8701, 0x47c0, 0x4680, 0x8641, 0x8201, 0x42c0, 0x4380, 0x8341, 0x4100, 0x81c1, 0x8081, 0x4040];

if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

module.exports = (0, _define_crc2.default)('crc-16', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);

  var crc = ~ ~previous;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    crc = (TABLE[(crc ^ byte) & 0xff] ^ crc >> 8) & 0xffff;
  }

  return crc;
});
},{"./define_crc":30,"buffer":3}],22:[function(require,module,exports){
'use strict';

var _buffer = require('buffer');

var _define_crc = require('./define_crc');

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generated by `./pycrc.py --algorithm=table-driven --model=ccitt --generate=c`
var TABLE = [0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7, 0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef, 0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6, 0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de, 0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485, 0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d, 0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4, 0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc, 0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823, 0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b, 0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12, 0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a, 0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41, 0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49, 0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70, 0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78, 0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f, 0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067, 0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e, 0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256, 0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d, 0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405, 0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c, 0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634, 0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab, 0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3, 0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a, 0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92, 0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9, 0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1, 0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8, 0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0];

if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

module.exports = (0, _define_crc2.default)('ccitt', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);

  var crc = typeof previous !== 'undefined' ? ~ ~previous : 0xffff;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    crc = (TABLE[(crc >> 8 ^ byte) & 0xff] ^ crc << 8) & 0xffff;
  }

  return crc;
});
},{"./define_crc":30,"buffer":3}],23:[function(require,module,exports){
'use strict';

var _buffer = require('buffer');

var _define_crc = require('./define_crc');

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generated by `./pycrc.py --algorithm=table-driven --model=kermit --generate=c`
var TABLE = [0x0000, 0x1189, 0x2312, 0x329b, 0x4624, 0x57ad, 0x6536, 0x74bf, 0x8c48, 0x9dc1, 0xaf5a, 0xbed3, 0xca6c, 0xdbe5, 0xe97e, 0xf8f7, 0x1081, 0x0108, 0x3393, 0x221a, 0x56a5, 0x472c, 0x75b7, 0x643e, 0x9cc9, 0x8d40, 0xbfdb, 0xae52, 0xdaed, 0xcb64, 0xf9ff, 0xe876, 0x2102, 0x308b, 0x0210, 0x1399, 0x6726, 0x76af, 0x4434, 0x55bd, 0xad4a, 0xbcc3, 0x8e58, 0x9fd1, 0xeb6e, 0xfae7, 0xc87c, 0xd9f5, 0x3183, 0x200a, 0x1291, 0x0318, 0x77a7, 0x662e, 0x54b5, 0x453c, 0xbdcb, 0xac42, 0x9ed9, 0x8f50, 0xfbef, 0xea66, 0xd8fd, 0xc974, 0x4204, 0x538d, 0x6116, 0x709f, 0x0420, 0x15a9, 0x2732, 0x36bb, 0xce4c, 0xdfc5, 0xed5e, 0xfcd7, 0x8868, 0x99e1, 0xab7a, 0xbaf3, 0x5285, 0x430c, 0x7197, 0x601e, 0x14a1, 0x0528, 0x37b3, 0x263a, 0xdecd, 0xcf44, 0xfddf, 0xec56, 0x98e9, 0x8960, 0xbbfb, 0xaa72, 0x6306, 0x728f, 0x4014, 0x519d, 0x2522, 0x34ab, 0x0630, 0x17b9, 0xef4e, 0xfec7, 0xcc5c, 0xddd5, 0xa96a, 0xb8e3, 0x8a78, 0x9bf1, 0x7387, 0x620e, 0x5095, 0x411c, 0x35a3, 0x242a, 0x16b1, 0x0738, 0xffcf, 0xee46, 0xdcdd, 0xcd54, 0xb9eb, 0xa862, 0x9af9, 0x8b70, 0x8408, 0x9581, 0xa71a, 0xb693, 0xc22c, 0xd3a5, 0xe13e, 0xf0b7, 0x0840, 0x19c9, 0x2b52, 0x3adb, 0x4e64, 0x5fed, 0x6d76, 0x7cff, 0x9489, 0x8500, 0xb79b, 0xa612, 0xd2ad, 0xc324, 0xf1bf, 0xe036, 0x18c1, 0x0948, 0x3bd3, 0x2a5a, 0x5ee5, 0x4f6c, 0x7df7, 0x6c7e, 0xa50a, 0xb483, 0x8618, 0x9791, 0xe32e, 0xf2a7, 0xc03c, 0xd1b5, 0x2942, 0x38cb, 0x0a50, 0x1bd9, 0x6f66, 0x7eef, 0x4c74, 0x5dfd, 0xb58b, 0xa402, 0x9699, 0x8710, 0xf3af, 0xe226, 0xd0bd, 0xc134, 0x39c3, 0x284a, 0x1ad1, 0x0b58, 0x7fe7, 0x6e6e, 0x5cf5, 0x4d7c, 0xc60c, 0xd785, 0xe51e, 0xf497, 0x8028, 0x91a1, 0xa33a, 0xb2b3, 0x4a44, 0x5bcd, 0x6956, 0x78df, 0x0c60, 0x1de9, 0x2f72, 0x3efb, 0xd68d, 0xc704, 0xf59f, 0xe416, 0x90a9, 0x8120, 0xb3bb, 0xa232, 0x5ac5, 0x4b4c, 0x79d7, 0x685e, 0x1ce1, 0x0d68, 0x3ff3, 0x2e7a, 0xe70e, 0xf687, 0xc41c, 0xd595, 0xa12a, 0xb0a3, 0x8238, 0x93b1, 0x6b46, 0x7acf, 0x4854, 0x59dd, 0x2d62, 0x3ceb, 0x0e70, 0x1ff9, 0xf78f, 0xe606, 0xd49d, 0xc514, 0xb1ab, 0xa022, 0x92b9, 0x8330, 0x7bc7, 0x6a4e, 0x58d5, 0x495c, 0x3de3, 0x2c6a, 0x1ef1, 0x0f78];

if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

module.exports = (0, _define_crc2.default)('kermit', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);

  var crc = typeof previous !== 'undefined' ? ~ ~previous : 0x0000;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    crc = (TABLE[(crc ^ byte) & 0xff] ^ crc >> 8) & 0xffff;
  }

  return crc;
});
},{"./define_crc":30,"buffer":3}],24:[function(require,module,exports){
'use strict';

var _buffer = require('buffer');

var _define_crc = require('./define_crc');

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generated by `./pycrc.py --algorithm=table-driven --model=crc-16-modbus --generate=c`
var TABLE = [0x0000, 0xc0c1, 0xc181, 0x0140, 0xc301, 0x03c0, 0x0280, 0xc241, 0xc601, 0x06c0, 0x0780, 0xc741, 0x0500, 0xc5c1, 0xc481, 0x0440, 0xcc01, 0x0cc0, 0x0d80, 0xcd41, 0x0f00, 0xcfc1, 0xce81, 0x0e40, 0x0a00, 0xcac1, 0xcb81, 0x0b40, 0xc901, 0x09c0, 0x0880, 0xc841, 0xd801, 0x18c0, 0x1980, 0xd941, 0x1b00, 0xdbc1, 0xda81, 0x1a40, 0x1e00, 0xdec1, 0xdf81, 0x1f40, 0xdd01, 0x1dc0, 0x1c80, 0xdc41, 0x1400, 0xd4c1, 0xd581, 0x1540, 0xd701, 0x17c0, 0x1680, 0xd641, 0xd201, 0x12c0, 0x1380, 0xd341, 0x1100, 0xd1c1, 0xd081, 0x1040, 0xf001, 0x30c0, 0x3180, 0xf141, 0x3300, 0xf3c1, 0xf281, 0x3240, 0x3600, 0xf6c1, 0xf781, 0x3740, 0xf501, 0x35c0, 0x3480, 0xf441, 0x3c00, 0xfcc1, 0xfd81, 0x3d40, 0xff01, 0x3fc0, 0x3e80, 0xfe41, 0xfa01, 0x3ac0, 0x3b80, 0xfb41, 0x3900, 0xf9c1, 0xf881, 0x3840, 0x2800, 0xe8c1, 0xe981, 0x2940, 0xeb01, 0x2bc0, 0x2a80, 0xea41, 0xee01, 0x2ec0, 0x2f80, 0xef41, 0x2d00, 0xedc1, 0xec81, 0x2c40, 0xe401, 0x24c0, 0x2580, 0xe541, 0x2700, 0xe7c1, 0xe681, 0x2640, 0x2200, 0xe2c1, 0xe381, 0x2340, 0xe101, 0x21c0, 0x2080, 0xe041, 0xa001, 0x60c0, 0x6180, 0xa141, 0x6300, 0xa3c1, 0xa281, 0x6240, 0x6600, 0xa6c1, 0xa781, 0x6740, 0xa501, 0x65c0, 0x6480, 0xa441, 0x6c00, 0xacc1, 0xad81, 0x6d40, 0xaf01, 0x6fc0, 0x6e80, 0xae41, 0xaa01, 0x6ac0, 0x6b80, 0xab41, 0x6900, 0xa9c1, 0xa881, 0x6840, 0x7800, 0xb8c1, 0xb981, 0x7940, 0xbb01, 0x7bc0, 0x7a80, 0xba41, 0xbe01, 0x7ec0, 0x7f80, 0xbf41, 0x7d00, 0xbdc1, 0xbc81, 0x7c40, 0xb401, 0x74c0, 0x7580, 0xb541, 0x7700, 0xb7c1, 0xb681, 0x7640, 0x7200, 0xb2c1, 0xb381, 0x7340, 0xb101, 0x71c0, 0x7080, 0xb041, 0x5000, 0x90c1, 0x9181, 0x5140, 0x9301, 0x53c0, 0x5280, 0x9241, 0x9601, 0x56c0, 0x5780, 0x9741, 0x5500, 0x95c1, 0x9481, 0x5440, 0x9c01, 0x5cc0, 0x5d80, 0x9d41, 0x5f00, 0x9fc1, 0x9e81, 0x5e40, 0x5a00, 0x9ac1, 0x9b81, 0x5b40, 0x9901, 0x59c0, 0x5880, 0x9841, 0x8801, 0x48c0, 0x4980, 0x8941, 0x4b00, 0x8bc1, 0x8a81, 0x4a40, 0x4e00, 0x8ec1, 0x8f81, 0x4f40, 0x8d01, 0x4dc0, 0x4c80, 0x8c41, 0x4400, 0x84c1, 0x8581, 0x4540, 0x8701, 0x47c0, 0x4680, 0x8641, 0x8201, 0x42c0, 0x4380, 0x8341, 0x4100, 0x81c1, 0x8081, 0x4040];

if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

module.exports = (0, _define_crc2.default)('crc-16-modbus', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);

  var crc = typeof previous !== 'undefined' ? ~ ~previous : 0xffff;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    crc = (TABLE[(crc ^ byte) & 0xff] ^ crc >> 8) & 0xffff;
  }

  return crc;
});
},{"./define_crc":30,"buffer":3}],25:[function(require,module,exports){
'use strict';

var _buffer = require('buffer');

var _define_crc = require('./define_crc');

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _define_crc2.default)('xmodem', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);

  var crc = typeof previous !== 'undefined' ? ~ ~previous : 0x0;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    var code = crc >>> 8 & 0xFF;

    code ^= byte & 0xFF;
    code ^= code >>> 4;
    crc = crc << 8 & 0xFFFF;
    crc ^= code;
    code = code << 5 & 0xFFFF;
    crc ^= code;
    code = code << 7 & 0xFFFF;
    crc ^= code;
  }

  return crc;
});
},{"./define_crc":30,"buffer":3}],26:[function(require,module,exports){
'use strict';

var _buffer = require('buffer');

var _define_crc = require('./define_crc');

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generated by `./pycrc.py --algorithm=table-drive --model=crc-24 --generate=c`
var TABLE = [0x000000, 0x864cfb, 0x8ad50d, 0x0c99f6, 0x93e6e1, 0x15aa1a, 0x1933ec, 0x9f7f17, 0xa18139, 0x27cdc2, 0x2b5434, 0xad18cf, 0x3267d8, 0xb42b23, 0xb8b2d5, 0x3efe2e, 0xc54e89, 0x430272, 0x4f9b84, 0xc9d77f, 0x56a868, 0xd0e493, 0xdc7d65, 0x5a319e, 0x64cfb0, 0xe2834b, 0xee1abd, 0x685646, 0xf72951, 0x7165aa, 0x7dfc5c, 0xfbb0a7, 0x0cd1e9, 0x8a9d12, 0x8604e4, 0x00481f, 0x9f3708, 0x197bf3, 0x15e205, 0x93aefe, 0xad50d0, 0x2b1c2b, 0x2785dd, 0xa1c926, 0x3eb631, 0xb8faca, 0xb4633c, 0x322fc7, 0xc99f60, 0x4fd39b, 0x434a6d, 0xc50696, 0x5a7981, 0xdc357a, 0xd0ac8c, 0x56e077, 0x681e59, 0xee52a2, 0xe2cb54, 0x6487af, 0xfbf8b8, 0x7db443, 0x712db5, 0xf7614e, 0x19a3d2, 0x9fef29, 0x9376df, 0x153a24, 0x8a4533, 0x0c09c8, 0x00903e, 0x86dcc5, 0xb822eb, 0x3e6e10, 0x32f7e6, 0xb4bb1d, 0x2bc40a, 0xad88f1, 0xa11107, 0x275dfc, 0xdced5b, 0x5aa1a0, 0x563856, 0xd074ad, 0x4f0bba, 0xc94741, 0xc5deb7, 0x43924c, 0x7d6c62, 0xfb2099, 0xf7b96f, 0x71f594, 0xee8a83, 0x68c678, 0x645f8e, 0xe21375, 0x15723b, 0x933ec0, 0x9fa736, 0x19ebcd, 0x8694da, 0x00d821, 0x0c41d7, 0x8a0d2c, 0xb4f302, 0x32bff9, 0x3e260f, 0xb86af4, 0x2715e3, 0xa15918, 0xadc0ee, 0x2b8c15, 0xd03cb2, 0x567049, 0x5ae9bf, 0xdca544, 0x43da53, 0xc596a8, 0xc90f5e, 0x4f43a5, 0x71bd8b, 0xf7f170, 0xfb6886, 0x7d247d, 0xe25b6a, 0x641791, 0x688e67, 0xeec29c, 0x3347a4, 0xb50b5f, 0xb992a9, 0x3fde52, 0xa0a145, 0x26edbe, 0x2a7448, 0xac38b3, 0x92c69d, 0x148a66, 0x181390, 0x9e5f6b, 0x01207c, 0x876c87, 0x8bf571, 0x0db98a, 0xf6092d, 0x7045d6, 0x7cdc20, 0xfa90db, 0x65efcc, 0xe3a337, 0xef3ac1, 0x69763a, 0x578814, 0xd1c4ef, 0xdd5d19, 0x5b11e2, 0xc46ef5, 0x42220e, 0x4ebbf8, 0xc8f703, 0x3f964d, 0xb9dab6, 0xb54340, 0x330fbb, 0xac70ac, 0x2a3c57, 0x26a5a1, 0xa0e95a, 0x9e1774, 0x185b8f, 0x14c279, 0x928e82, 0x0df195, 0x8bbd6e, 0x872498, 0x016863, 0xfad8c4, 0x7c943f, 0x700dc9, 0xf64132, 0x693e25, 0xef72de, 0xe3eb28, 0x65a7d3, 0x5b59fd, 0xdd1506, 0xd18cf0, 0x57c00b, 0xc8bf1c, 0x4ef3e7, 0x426a11, 0xc426ea, 0x2ae476, 0xaca88d, 0xa0317b, 0x267d80, 0xb90297, 0x3f4e6c, 0x33d79a, 0xb59b61, 0x8b654f, 0x0d29b4, 0x01b042, 0x87fcb9, 0x1883ae, 0x9ecf55, 0x9256a3, 0x141a58, 0xefaaff, 0x69e604, 0x657ff2, 0xe33309, 0x7c4c1e, 0xfa00e5, 0xf69913, 0x70d5e8, 0x4e2bc6, 0xc8673d, 0xc4fecb, 0x42b230, 0xddcd27, 0x5b81dc, 0x57182a, 0xd154d1, 0x26359f, 0xa07964, 0xace092, 0x2aac69, 0xb5d37e, 0x339f85, 0x3f0673, 0xb94a88, 0x87b4a6, 0x01f85d, 0x0d61ab, 0x8b2d50, 0x145247, 0x921ebc, 0x9e874a, 0x18cbb1, 0xe37b16, 0x6537ed, 0x69ae1b, 0xefe2e0, 0x709df7, 0xf6d10c, 0xfa48fa, 0x7c0401, 0x42fa2f, 0xc4b6d4, 0xc82f22, 0x4e63d9, 0xd11cce, 0x575035, 0x5bc9c3, 0xdd8538];

if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

module.exports = (0, _define_crc2.default)('crc-24', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);

  var crc = typeof previous !== 'undefined' ? ~ ~previous : 0xb704ce;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    crc = (TABLE[(crc >> 16 ^ byte) & 0xff] ^ crc << 8) & 0xffffff;
  }

  return crc;
});
},{"./define_crc":30,"buffer":3}],27:[function(require,module,exports){
'use strict';

var _buffer = require('buffer');

var _define_crc = require('./define_crc');

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generated by `./pycrc.py --algorithm=table-driven --model=crc-32 --generate=c`
var TABLE = [0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419, 0x706af48f, 0xe963a535, 0x9e6495a3, 0x0edb8832, 0x79dcb8a4, 0xe0d5e91e, 0x97d2d988, 0x09b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91, 0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de, 0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7, 0x136c9856, 0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9, 0xfa0f3d63, 0x8d080df5, 0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172, 0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b, 0x35b5a8fa, 0x42b2986c, 0xdbbbc9d6, 0xacbcf940, 0x32d86ce3, 0x45df5c75, 0xdcd60dcf, 0xabd13d59, 0x26d930ac, 0x51de003a, 0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423, 0xcfba9599, 0xb8bda50f, 0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924, 0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d, 0x76dc4190, 0x01db7106, 0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f, 0x9fbfe4a5, 0xe8b8d433, 0x7807c9a2, 0x0f00f934, 0x9609a88e, 0xe10e9818, 0x7f6a0dbb, 0x086d3d2d, 0x91646c97, 0xe6635c01, 0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e, 0x6c0695ed, 0x1b01a57b, 0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950, 0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65, 0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2, 0x4adfa541, 0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a, 0x346ed9fc, 0xad678846, 0xda60b8d0, 0x44042d73, 0x33031de5, 0xaa0a4c5f, 0xdd0d7cc9, 0x5005713c, 0x270241aa, 0xbe0b1010, 0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f, 0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17, 0x2eb40d81, 0xb7bd5c3b, 0xc0ba6cad, 0xedb88320, 0x9abfb3b6, 0x03b6e20c, 0x74b1d29a, 0xead54739, 0x9dd277af, 0x04db2615, 0x73dc1683, 0xe3630b12, 0x94643b84, 0x0d6d6a3e, 0x7a6a5aa8, 0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1, 0xf00f9344, 0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb, 0x196c3671, 0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc, 0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5, 0xd6d6a3e8, 0xa1d1937e, 0x38d8c2c4, 0x4fdff252, 0xd1bb67f1, 0xa6bc5767, 0x3fb506dd, 0x48b2364b, 0xd80d2bda, 0xaf0a1b4c, 0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55, 0x316e8eef, 0x4669be79, 0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236, 0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe, 0xb2bd0b28, 0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b, 0x5bdeae1d, 0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x026d930a, 0x9c0906a9, 0xeb0e363f, 0x72076785, 0x05005713, 0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38, 0x92d28e9b, 0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21, 0x86d3d2d4, 0xf1d4e242, 0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777, 0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c, 0x8f659eff, 0xf862ae69, 0x616bffd3, 0x166ccf45, 0xa00ae278, 0xd70dd2ee, 0x4e048354, 0x3903b3c2, 0xa7672661, 0xd06016f7, 0x4969474d, 0x3e6e77db, 0xaed16a4a, 0xd9d65adc, 0x40df0b66, 0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9, 0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605, 0xcdd70693, 0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8, 0x5d681b02, 0x2a6f2b94, 0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d];

if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

module.exports = (0, _define_crc2.default)('crc-32', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);

  var crc = previous === 0 ? 0 : ~ ~previous ^ -1;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    crc = TABLE[(crc ^ byte) & 0xff] ^ crc >>> 8;
  }

  return crc ^ -1;
});
},{"./define_crc":30,"buffer":3}],28:[function(require,module,exports){
'use strict';

var _buffer = require('buffer');

var _define_crc = require('./define_crc');

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generated by `./pycrc.py --algorithm=table-driven --model=crc-8 --generate=c`
var TABLE = [0x00, 0x07, 0x0e, 0x09, 0x1c, 0x1b, 0x12, 0x15, 0x38, 0x3f, 0x36, 0x31, 0x24, 0x23, 0x2a, 0x2d, 0x70, 0x77, 0x7e, 0x79, 0x6c, 0x6b, 0x62, 0x65, 0x48, 0x4f, 0x46, 0x41, 0x54, 0x53, 0x5a, 0x5d, 0xe0, 0xe7, 0xee, 0xe9, 0xfc, 0xfb, 0xf2, 0xf5, 0xd8, 0xdf, 0xd6, 0xd1, 0xc4, 0xc3, 0xca, 0xcd, 0x90, 0x97, 0x9e, 0x99, 0x8c, 0x8b, 0x82, 0x85, 0xa8, 0xaf, 0xa6, 0xa1, 0xb4, 0xb3, 0xba, 0xbd, 0xc7, 0xc0, 0xc9, 0xce, 0xdb, 0xdc, 0xd5, 0xd2, 0xff, 0xf8, 0xf1, 0xf6, 0xe3, 0xe4, 0xed, 0xea, 0xb7, 0xb0, 0xb9, 0xbe, 0xab, 0xac, 0xa5, 0xa2, 0x8f, 0x88, 0x81, 0x86, 0x93, 0x94, 0x9d, 0x9a, 0x27, 0x20, 0x29, 0x2e, 0x3b, 0x3c, 0x35, 0x32, 0x1f, 0x18, 0x11, 0x16, 0x03, 0x04, 0x0d, 0x0a, 0x57, 0x50, 0x59, 0x5e, 0x4b, 0x4c, 0x45, 0x42, 0x6f, 0x68, 0x61, 0x66, 0x73, 0x74, 0x7d, 0x7a, 0x89, 0x8e, 0x87, 0x80, 0x95, 0x92, 0x9b, 0x9c, 0xb1, 0xb6, 0xbf, 0xb8, 0xad, 0xaa, 0xa3, 0xa4, 0xf9, 0xfe, 0xf7, 0xf0, 0xe5, 0xe2, 0xeb, 0xec, 0xc1, 0xc6, 0xcf, 0xc8, 0xdd, 0xda, 0xd3, 0xd4, 0x69, 0x6e, 0x67, 0x60, 0x75, 0x72, 0x7b, 0x7c, 0x51, 0x56, 0x5f, 0x58, 0x4d, 0x4a, 0x43, 0x44, 0x19, 0x1e, 0x17, 0x10, 0x05, 0x02, 0x0b, 0x0c, 0x21, 0x26, 0x2f, 0x28, 0x3d, 0x3a, 0x33, 0x34, 0x4e, 0x49, 0x40, 0x47, 0x52, 0x55, 0x5c, 0x5b, 0x76, 0x71, 0x78, 0x7f, 0x6a, 0x6d, 0x64, 0x63, 0x3e, 0x39, 0x30, 0x37, 0x22, 0x25, 0x2c, 0x2b, 0x06, 0x01, 0x08, 0x0f, 0x1a, 0x1d, 0x14, 0x13, 0xae, 0xa9, 0xa0, 0xa7, 0xb2, 0xb5, 0xbc, 0xbb, 0x96, 0x91, 0x98, 0x9f, 0x8a, 0x8d, 0x84, 0x83, 0xde, 0xd9, 0xd0, 0xd7, 0xc2, 0xc5, 0xcc, 0xcb, 0xe6, 0xe1, 0xe8, 0xef, 0xfa, 0xfd, 0xf4, 0xf3];

if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

module.exports = (0, _define_crc2.default)('crc-8', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);

  var crc = ~ ~previous;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    crc = TABLE[(crc ^ byte) & 0xff] & 0xff;
  }

  return crc;
});
},{"./define_crc":30,"buffer":3}],29:[function(require,module,exports){
'use strict';

var _buffer = require('buffer');

var _define_crc = require('./define_crc');

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generated by `./pycrc.py --algorithm=table-driven --model=dallas-1-wire --generate=c`
var TABLE = [0x00, 0x5e, 0xbc, 0xe2, 0x61, 0x3f, 0xdd, 0x83, 0xc2, 0x9c, 0x7e, 0x20, 0xa3, 0xfd, 0x1f, 0x41, 0x9d, 0xc3, 0x21, 0x7f, 0xfc, 0xa2, 0x40, 0x1e, 0x5f, 0x01, 0xe3, 0xbd, 0x3e, 0x60, 0x82, 0xdc, 0x23, 0x7d, 0x9f, 0xc1, 0x42, 0x1c, 0xfe, 0xa0, 0xe1, 0xbf, 0x5d, 0x03, 0x80, 0xde, 0x3c, 0x62, 0xbe, 0xe0, 0x02, 0x5c, 0xdf, 0x81, 0x63, 0x3d, 0x7c, 0x22, 0xc0, 0x9e, 0x1d, 0x43, 0xa1, 0xff, 0x46, 0x18, 0xfa, 0xa4, 0x27, 0x79, 0x9b, 0xc5, 0x84, 0xda, 0x38, 0x66, 0xe5, 0xbb, 0x59, 0x07, 0xdb, 0x85, 0x67, 0x39, 0xba, 0xe4, 0x06, 0x58, 0x19, 0x47, 0xa5, 0xfb, 0x78, 0x26, 0xc4, 0x9a, 0x65, 0x3b, 0xd9, 0x87, 0x04, 0x5a, 0xb8, 0xe6, 0xa7, 0xf9, 0x1b, 0x45, 0xc6, 0x98, 0x7a, 0x24, 0xf8, 0xa6, 0x44, 0x1a, 0x99, 0xc7, 0x25, 0x7b, 0x3a, 0x64, 0x86, 0xd8, 0x5b, 0x05, 0xe7, 0xb9, 0x8c, 0xd2, 0x30, 0x6e, 0xed, 0xb3, 0x51, 0x0f, 0x4e, 0x10, 0xf2, 0xac, 0x2f, 0x71, 0x93, 0xcd, 0x11, 0x4f, 0xad, 0xf3, 0x70, 0x2e, 0xcc, 0x92, 0xd3, 0x8d, 0x6f, 0x31, 0xb2, 0xec, 0x0e, 0x50, 0xaf, 0xf1, 0x13, 0x4d, 0xce, 0x90, 0x72, 0x2c, 0x6d, 0x33, 0xd1, 0x8f, 0x0c, 0x52, 0xb0, 0xee, 0x32, 0x6c, 0x8e, 0xd0, 0x53, 0x0d, 0xef, 0xb1, 0xf0, 0xae, 0x4c, 0x12, 0x91, 0xcf, 0x2d, 0x73, 0xca, 0x94, 0x76, 0x28, 0xab, 0xf5, 0x17, 0x49, 0x08, 0x56, 0xb4, 0xea, 0x69, 0x37, 0xd5, 0x8b, 0x57, 0x09, 0xeb, 0xb5, 0x36, 0x68, 0x8a, 0xd4, 0x95, 0xcb, 0x29, 0x77, 0xf4, 0xaa, 0x48, 0x16, 0xe9, 0xb7, 0x55, 0x0b, 0x88, 0xd6, 0x34, 0x6a, 0x2b, 0x75, 0x97, 0xc9, 0x4a, 0x14, 0xf6, 0xa8, 0x74, 0x2a, 0xc8, 0x96, 0x15, 0x4b, 0xa9, 0xf7, 0xb6, 0xe8, 0x0a, 0x54, 0xd7, 0x89, 0x6b, 0x35];

if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

module.exports = (0, _define_crc2.default)('dallas-1-wire', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);

  var crc = ~ ~previous;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    crc = TABLE[(crc ^ byte) & 0xff] & 0xff;
  }

  return crc;
});
},{"./define_crc":30,"buffer":3}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (model, calc) {
  var fn = function fn(buf, previous) {
    return calc(buf, previous) >>> 0;
  };
  fn.signed = calc;
  fn.unsigned = fn;
  fn.model = model;

  return fn;
};
},{}],31:[function(require,module,exports){
'use strict';

module.exports = {
  crc1: require('./crc1'),
  crc8: require('./crc8'),
  crc81wire: require('./crc8_1wire'),
  crc16: require('./crc16'),
  crc16ccitt: require('./crc16_ccitt'),
  crc16modbus: require('./crc16_modbus'),
  crc16xmodem: require('./crc16_xmodem'),
  crc16kermit: require('./crc16_kermit'),
  crc24: require('./crc24'),
  crc32: require('./crc32')
};
},{"./crc1":20,"./crc16":21,"./crc16_ccitt":22,"./crc16_kermit":23,"./crc16_modbus":24,"./crc16_xmodem":25,"./crc24":26,"./crc32":27,"./crc8":28,"./crc8_1wire":29}],32:[function(require,module,exports){
'use strict';

var copy       = require('es5-ext/object/copy')
  , map        = require('es5-ext/object/map')
  , callable   = require('es5-ext/object/valid-callable')
  , validValue = require('es5-ext/object/valid-value')

  , bind = Function.prototype.bind, defineProperty = Object.defineProperty
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , define;

define = function (name, desc, bindTo) {
	var value = validValue(desc) && callable(desc.value), dgs;
	dgs = copy(desc);
	delete dgs.writable;
	delete dgs.value;
	dgs.get = function () {
		if (hasOwnProperty.call(this, name)) return value;
		desc.value = bind.call(value, (bindTo == null) ? this : this[bindTo]);
		defineProperty(this, name, desc);
		return this[name];
	};
	return dgs;
};

module.exports = function (props/*, bindTo*/) {
	var bindTo = arguments[1];
	return map(props, function (desc, name) {
		return define(name, desc, bindTo);
	});
};

},{"es5-ext/object/copy":63,"es5-ext/object/map":73,"es5-ext/object/valid-callable":80,"es5-ext/object/valid-value":82}],33:[function(require,module,exports){
'use strict';

var assign        = require('es5-ext/object/assign')
  , normalizeOpts = require('es5-ext/object/normalize-options')
  , isCallable    = require('es5-ext/object/is-callable')
  , contains      = require('es5-ext/string/#/contains')

  , d;

d = module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if ((arguments.length < 2) || (typeof dscr !== 'string')) {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (dscr == null) {
		c = w = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
		w = contains.call(dscr, 'w');
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== 'string') {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (get == null) {
		get = undefined;
	} else if (!isCallable(get)) {
		options = get;
		get = set = undefined;
	} else if (set == null) {
		set = undefined;
	} else if (!isCallable(set)) {
		options = set;
		set = undefined;
	}
	if (dscr == null) {
		c = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

},{"es5-ext/object/assign":60,"es5-ext/object/is-callable":68,"es5-ext/object/normalize-options":75,"es5-ext/string/#/contains":85}],34:[function(require,module,exports){
'use strict';

var map        = require('es5-ext/object/map')
  , isCallable = require('es5-ext/object/is-callable')
  , validValue = require('es5-ext/object/valid-value')
  , contains   = require('es5-ext/string/#/contains')

  , call = Function.prototype.call
  , defineProperty = Object.defineProperty
  , getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
  , getPrototypeOf = Object.getPrototypeOf
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , cacheDesc = { configurable: false, enumerable: false, writable: false,
		value: null }
  , define;

define = function (name, options) {
	var value, dgs, cacheName, desc, writable = false, resolvable
	  , flat;
	options = Object(validValue(options));
	cacheName = options.cacheName;
	flat = options.flat;
	if (cacheName == null) cacheName = name;
	delete options.cacheName;
	value = options.value;
	resolvable = isCallable(value);
	delete options.value;
	dgs = { configurable: Boolean(options.configurable),
		enumerable: Boolean(options.enumerable) };
	if (name !== cacheName) {
		dgs.get = function () {
			if (hasOwnProperty.call(this, cacheName)) return this[cacheName];
			cacheDesc.value = resolvable ? call.call(value, this, options) : value;
			cacheDesc.writable = writable;
			defineProperty(this, cacheName, cacheDesc);
			cacheDesc.value = null;
			if (desc) defineProperty(this, name, desc);
			return this[cacheName];
		};
	} else if (!flat) {
		dgs.get = function self() {
			var ownDesc;
			if (hasOwnProperty.call(this, name)) {
				ownDesc = getOwnPropertyDescriptor(this, name);
				// It happens in Safari, that getter is still called after property
				// was defined with a value, following workarounds that
				if (ownDesc.hasOwnProperty('value')) return ownDesc.value;
				if ((typeof ownDesc.get === 'function') && (ownDesc.get !== self)) {
					return ownDesc.get.call(this);
				}
				return value;
			}
			desc.value = resolvable ? call.call(value, this, options) : value;
			defineProperty(this, name, desc);
			desc.value = null;
			return this[name];
		};
	} else {
		dgs.get = function self() {
			var base = this, ownDesc;
			if (hasOwnProperty.call(this, name)) {
				// It happens in Safari, that getter is still called after property
				// was defined with a value, following workarounds that
				ownDesc = getOwnPropertyDescriptor(this, name);
				if (ownDesc.hasOwnProperty('value')) return ownDesc.value;
				if ((typeof ownDesc.get === 'function') && (ownDesc.get !== self)) {
					return ownDesc.get.call(this);
				}
			}
			while (!hasOwnProperty.call(base, name)) base = getPrototypeOf(base);
			desc.value = resolvable ? call.call(value, base, options) : value;
			defineProperty(base, name, desc);
			desc.value = null;
			return base[name];
		};
	}
	dgs.set = function (value) {
		dgs.get.call(this);
		this[cacheName] = value;
	};
	if (options.desc) {
		desc = {
			configurable: contains.call(options.desc, 'c'),
			enumerable: contains.call(options.desc, 'e')
		};
		if (cacheName === name) {
			desc.writable = contains.call(options.desc, 'w');
			desc.value = null;
		} else {
			writable = contains.call(options.desc, 'w');
			desc.get = dgs.get;
			desc.set = dgs.set;
		}
		delete options.desc;
	} else if (cacheName === name) {
		desc = {
			configurable: Boolean(options.configurable),
			enumerable: Boolean(options.enumerable),
			writable: Boolean(options.writable),
			value: null
		};
	}
	delete options.configurable;
	delete options.enumerable;
	delete options.writable;
	return dgs;
};

module.exports = function (props) {
	return map(props, function (desc, name) { return define(name, desc); });
};

},{"es5-ext/object/is-callable":68,"es5-ext/object/map":73,"es5-ext/object/valid-value":82,"es5-ext/string/#/contains":85}],35:[function(require,module,exports){
// Inspired by Google Closure:
// http://closure-library.googlecode.com/svn/docs/
// closure_goog_array_array.js.html#goog.array.clear

'use strict';

var value = require('../../object/valid-value');

module.exports = function () {
	value(this).length = 0;
	return this;
};

},{"../../object/valid-value":82}],36:[function(require,module,exports){
'use strict';

var toPosInt = require('../../number/to-pos-integer')
  , value    = require('../../object/valid-value')

  , indexOf = Array.prototype.indexOf
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , abs = Math.abs, floor = Math.floor;

module.exports = function (searchElement/*, fromIndex*/) {
	var i, l, fromIndex, val;
	if (searchElement === searchElement) { //jslint: ignore
		return indexOf.apply(this, arguments);
	}

	l = toPosInt(value(this).length);
	fromIndex = arguments[1];
	if (isNaN(fromIndex)) fromIndex = 0;
	else if (fromIndex >= 0) fromIndex = floor(fromIndex);
	else fromIndex = toPosInt(this.length) - floor(abs(fromIndex));

	for (i = fromIndex; i < l; ++i) {
		if (hasOwnProperty.call(this, i)) {
			val = this[i];
			if (val !== val) return i; //jslint: ignore
		}
	}
	return -1;
};

},{"../../number/to-pos-integer":58,"../../object/valid-value":82}],37:[function(require,module,exports){
'use strict';

var toPosInt = require('../../number/to-pos-integer')
  , callable = require('../../object/valid-callable')
  , value    = require('../../object/valid-value')

  , hasOwnProperty = Object.prototype.hasOwnProperty
  , call = Function.prototype.call;

module.exports = function (cb/*, thisArg*/) {
	var i, self, thisArg;

	self = Object(value(this));
	callable(cb);
	thisArg = arguments[1];

	for (i = (toPosInt(self.length) - 1); i >= 0; --i) {
		if (hasOwnProperty.call(self, i)) call.call(cb, thisArg, self[i], i, self);
	}
};

},{"../../number/to-pos-integer":58,"../../object/valid-callable":80,"../../object/valid-value":82}],38:[function(require,module,exports){
'use strict';

var indexOf = require('./e-index-of')

  , filter = Array.prototype.filter

  , isFirst;

isFirst = function (value, index) {
	return indexOf.call(this, value) === index;
};

module.exports = function () { return filter.call(this, isFirst, this); };

},{"./e-index-of":36}],39:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Array.from
	: require('./shim');

},{"./is-implemented":40,"./shim":41}],40:[function(require,module,exports){
'use strict';

module.exports = function () {
	var from = Array.from, arr, result;
	if (typeof from !== 'function') return false;
	arr = ['raz', 'dwa'];
	result = from(arr);
	return Boolean(result && (result !== arr) && (result[1] === 'dwa'));
};

},{}],41:[function(require,module,exports){
'use strict';

var iteratorSymbol = require('es6-symbol').iterator
  , isArguments    = require('../../function/is-arguments')
  , isFunction     = require('../../function/is-function')
  , toPosInt       = require('../../number/to-pos-integer')
  , callable       = require('../../object/valid-callable')
  , validValue     = require('../../object/valid-value')
  , isString       = require('../../string/is-string')

  , isArray = Array.isArray, call = Function.prototype.call
  , desc = { configurable: true, enumerable: true, writable: true, value: null }
  , defineProperty = Object.defineProperty;

module.exports = function (arrayLike/*, mapFn, thisArg*/) {
	var mapFn = arguments[1], thisArg = arguments[2], Constructor, i, j, arr, l, code, iterator
	  , result, getIterator, value;

	arrayLike = Object(validValue(arrayLike));

	if (mapFn != null) callable(mapFn);
	if (!this || (this === Array) || !isFunction(this)) {
		// Result: Plain array
		if (!mapFn) {
			if (isArguments(arrayLike)) {
				// Source: Arguments
				l = arrayLike.length;
				if (l !== 1) return Array.apply(null, arrayLike);
				arr = new Array(1);
				arr[0] = arrayLike[0];
				return arr;
			}
			if (isArray(arrayLike)) {
				// Source: Array
				arr = new Array(l = arrayLike.length);
				for (i = 0; i < l; ++i) arr[i] = arrayLike[i];
				return arr;
			}
		}
		arr = [];
	} else {
		// Result: Non plain array
		Constructor = this;
	}

	if (!isArray(arrayLike)) {
		if ((getIterator = arrayLike[iteratorSymbol]) !== undefined) {
			// Source: Iterator
			iterator = callable(getIterator).call(arrayLike);
			if (Constructor) arr = new Constructor();
			result = iterator.next();
			i = 0;
			while (!result.done) {
				value = mapFn ? call.call(mapFn, thisArg, result.value, i) : result.value;
				if (!Constructor) {
					arr[i] = value;
				} else {
					desc.value = value;
					defineProperty(arr, i, desc);
				}
				result = iterator.next();
				++i;
			}
			l = i;
		} else if (isString(arrayLike)) {
			// Source: String
			l = arrayLike.length;
			if (Constructor) arr = new Constructor();
			for (i = 0, j = 0; i < l; ++i) {
				value = arrayLike[i];
				if ((i + 1) < l) {
					code = value.charCodeAt(0);
					if ((code >= 0xD800) && (code <= 0xDBFF)) value += arrayLike[++i];
				}
				value = mapFn ? call.call(mapFn, thisArg, value, j) : value;
				if (!Constructor) {
					arr[j] = value;
				} else {
					desc.value = value;
					defineProperty(arr, j, desc);
				}
				++j;
			}
			l = j;
		}
	}
	if (l === undefined) {
		// Source: array or array-like
		l = toPosInt(arrayLike.length);
		if (Constructor) arr = new Constructor(l);
		for (i = 0; i < l; ++i) {
			value = mapFn ? call.call(mapFn, thisArg, arrayLike[i], i) : arrayLike[i];
			if (!Constructor) {
				arr[i] = value;
			} else {
				desc.value = value;
				defineProperty(arr, i, desc);
			}
		}
	}
	if (Constructor) {
		desc.value = null;
		arr.length = l;
	}
	return arr;
};

},{"../../function/is-arguments":46,"../../function/is-function":47,"../../number/to-pos-integer":58,"../../object/valid-callable":80,"../../object/valid-value":82,"../../string/is-string":92,"es6-symbol":100}],42:[function(require,module,exports){
'use strict';

var from = require('./from')

  , isArray = Array.isArray;

module.exports = function (arrayLike) {
	return isArray(arrayLike) ? arrayLike : from(arrayLike);
};

},{"./from":39}],43:[function(require,module,exports){
'use strict';

var assign = require('../object/assign')

  , captureStackTrace = Error.captureStackTrace;

exports = module.exports = function (message/*, code, ext*/) {
	var err = new Error(), code = arguments[1], ext = arguments[2];
	if (ext == null) {
		if (code && (typeof code === 'object')) {
			ext = code;
			code = null;
		}
	}
	if (ext != null) assign(err, ext);
	err.message = String(message);
	if (code != null) err.code = String(code);
	if (captureStackTrace) captureStackTrace(err, exports);
	return err;
};

},{"../object/assign":60}],44:[function(require,module,exports){
'use strict';

var callable = require('../../object/valid-callable')
  , aFrom    = require('../../array/from')

  , apply = Function.prototype.apply, call = Function.prototype.call
  , callFn = function (arg, fn) { return call.call(fn, this, arg); };

module.exports = function (fn/*, …fnn*/) {
	var fns, first;
	if (!fn) callable(fn);
	fns = [this].concat(aFrom(arguments));
	fns.forEach(callable);
	fns = fns.reverse();
	first = fns[0];
	fns = fns.slice(1);
	return function (arg) {
		return fns.reduce(callFn, apply.call(first, this, arguments));
	};
};

},{"../../array/from":39,"../../object/valid-callable":80}],45:[function(require,module,exports){
'use strict';

var toPosInt = require('../number/to-pos-integer')

  , test = function (a, b) {}, desc, defineProperty
  , generate, mixin;

try {
	Object.defineProperty(test, 'length', { configurable: true, writable: false,
		enumerable: false, value: 1 });
} catch (ignore) {}

if (test.length === 1) {
	// ES6
	desc = { configurable: true, writable: false, enumerable: false };
	defineProperty = Object.defineProperty;
	module.exports = function (fn, length) {
		length = toPosInt(length);
		if (fn.length === length) return fn;
		desc.value = length;
		return defineProperty(fn, 'length', desc);
	};
} else {
	mixin = require('../object/mixin');
	generate = (function () {
		var cache = [];
		return function (l) {
			var args, i = 0;
			if (cache[l]) return cache[l];
			args = [];
			while (l--) args.push('a' + (++i).toString(36));
			return new Function('fn', 'return function (' + args.join(', ') +
				') { return fn.apply(this, arguments); };');
		};
	}());
	module.exports = function (src, length) {
		var target;
		length = toPosInt(length);
		if (src.length === length) return src;
		target = generate(length)(src);
		try { mixin(target, src); } catch (ignore) {}
		return target;
	};
}

},{"../number/to-pos-integer":58,"../object/mixin":74}],46:[function(require,module,exports){
'use strict';

var toString = Object.prototype.toString

  , id = toString.call((function () { return arguments; }()));

module.exports = function (x) { return (toString.call(x) === id); };

},{}],47:[function(require,module,exports){
'use strict';

var toString = Object.prototype.toString

  , id = toString.call(require('./noop'));

module.exports = function (f) {
	return (typeof f === "function") && (toString.call(f) === id);
};

},{"./noop":48}],48:[function(require,module,exports){
'use strict';

module.exports = function () {};

},{}],49:[function(require,module,exports){
'use strict';

var iteratorSymbol = require('es6-symbol').iterator
  , isArrayLike    = require('../object/is-array-like');

module.exports = function (x) {
	if (x == null) return false;
	if (typeof x[iteratorSymbol] === 'function') return true;
	return isArrayLike(x);
};

},{"../object/is-array-like":67,"es6-symbol":100}],50:[function(require,module,exports){
'use strict';

var isObject = require('../object/is-object')
  , is       = require('./is');

module.exports = function (x) {
	if (is(x) && isObject(x)) return x;
	throw new TypeError(x + " is not an iterable or array-like object");
};

},{"../object/is-object":69,"./is":49}],51:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Math.sign
	: require('./shim');

},{"./is-implemented":52,"./shim":53}],52:[function(require,module,exports){
'use strict';

module.exports = function () {
	var sign = Math.sign;
	if (typeof sign !== 'function') return false;
	return ((sign(10) === 1) && (sign(-20) === -1));
};

},{}],53:[function(require,module,exports){
'use strict';

module.exports = function (value) {
	value = Number(value);
	if (isNaN(value) || (value === 0)) return value;
	return (value > 0) ? 1 : -1;
};

},{}],54:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Math.trunc
	: require('./shim');

},{"./is-implemented":55,"./shim":56}],55:[function(require,module,exports){
'use strict';

module.exports = function () {
	var trunc = Math.trunc;
	if (typeof trunc !== 'function') return false;
	return (trunc(13.67) === 13) && (trunc(-13.67) === -13);
};

},{}],56:[function(require,module,exports){
'use strict';

var floor = Math.floor;

module.exports = function (x) {
	if (isNaN(x)) return NaN;
	x = Number(x);
	if (x === 0) return x;
	if (x === Infinity) return Infinity;
	if (x === -Infinity) return -Infinity;
	if (x > 0) return floor(x);
	return -floor(-x);
};

},{}],57:[function(require,module,exports){
'use strict';

var sign = require('../math/sign')

  , abs = Math.abs, floor = Math.floor;

module.exports = function (value) {
	if (isNaN(value)) return 0;
	value = Number(value);
	if ((value === 0) || !isFinite(value)) return value;
	return sign(value) * floor(abs(value));
};

},{"../math/sign":51}],58:[function(require,module,exports){
'use strict';

var toInteger = require('./to-integer')

  , max = Math.max;

module.exports = function (value) { return max(0, toInteger(value)); };

},{"./to-integer":57}],59:[function(require,module,exports){
// Internal method, used by iteration functions.
// Calls a function for each key-value pair found in object
// Optionally takes compareFn to iterate object in specific order

'use strict';

var callable = require('./valid-callable')
  , value    = require('./valid-value')

  , bind = Function.prototype.bind, call = Function.prototype.call, keys = Object.keys
  , propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

module.exports = function (method, defVal) {
	return function (obj, cb/*, thisArg, compareFn*/) {
		var list, thisArg = arguments[2], compareFn = arguments[3];
		obj = Object(value(obj));
		callable(cb);

		list = keys(obj);
		if (compareFn) {
			list.sort((typeof compareFn === 'function') ? bind.call(compareFn, obj) : undefined);
		}
		if (typeof method !== 'function') method = list[method];
		return call.call(method, list, function (key, index) {
			if (!propertyIsEnumerable.call(obj, key)) return defVal;
			return call.call(cb, thisArg, obj[key], key, obj, index);
		});
	};
};

},{"./valid-callable":80,"./valid-value":82}],60:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.assign
	: require('./shim');

},{"./is-implemented":61,"./shim":62}],61:[function(require,module,exports){
'use strict';

module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== 'function') return false;
	obj = { foo: 'raz' };
	assign(obj, { bar: 'dwa' }, { trzy: 'trzy' });
	return (obj.foo + obj.bar + obj.trzy) === 'razdwatrzy';
};

},{}],62:[function(require,module,exports){
'use strict';

var keys  = require('../keys')
  , value = require('../valid-value')

  , max = Math.max;

module.exports = function (dest, src/*, …srcn*/) {
	var error, i, l = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try { dest[key] = src[key]; } catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < l; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};

},{"../keys":70,"../valid-value":82}],63:[function(require,module,exports){
'use strict';

var assign = require('./assign')
  , value  = require('./valid-value');

module.exports = function (obj) {
	var copy = Object(value(obj));
	if (copy !== obj) return copy;
	return assign({}, obj);
};

},{"./assign":60,"./valid-value":82}],64:[function(require,module,exports){
// Workaround for http://code.google.com/p/v8/issues/detail?id=2804

'use strict';

var create = Object.create, shim;

if (!require('./set-prototype-of/is-implemented')()) {
	shim = require('./set-prototype-of/shim');
}

module.exports = (function () {
	var nullObject, props, desc;
	if (!shim) return create;
	if (shim.level !== 1) return create;

	nullObject = {};
	props = {};
	desc = { configurable: false, enumerable: false, writable: true,
		value: undefined };
	Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
		if (name === '__proto__') {
			props[name] = { configurable: true, enumerable: false, writable: true,
				value: undefined };
			return;
		}
		props[name] = desc;
	});
	Object.defineProperties(nullObject, props);

	Object.defineProperty(shim, 'nullPolyfill', { configurable: false,
		enumerable: false, writable: false, value: nullObject });

	return function (prototype, props) {
		return create((prototype === null) ? nullObject : prototype, props);
	};
}());

},{"./set-prototype-of/is-implemented":78,"./set-prototype-of/shim":79}],65:[function(require,module,exports){
'use strict';

var value = require('./valid-value')

  , propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

module.exports = function (obj) {
	var i;
	value(obj);
	for (i in obj) {
		if (propertyIsEnumerable.call(obj, i)) return i;
	}
	return null;
};

},{"./valid-value":82}],66:[function(require,module,exports){
'use strict';

module.exports = require('./_iterate')('forEach');

},{"./_iterate":59}],67:[function(require,module,exports){
'use strict';

var isFunction = require('../function/is-function')
  , isObject   = require('./is-object');

module.exports = function (x) {
	return ((x != null) && (typeof x.length === 'number') &&

		// Just checking ((typeof x === 'object') && (typeof x !== 'function'))
		// won't work right for some cases, e.g.:
		// type of instance of NodeList in Safari is a 'function'

		((isObject(x) && !isFunction(x)) || (typeof x === "string"))) || false;
};

},{"../function/is-function":47,"./is-object":69}],68:[function(require,module,exports){
// Deprecated

'use strict';

module.exports = function (obj) { return typeof obj === 'function'; };

},{}],69:[function(require,module,exports){
'use strict';

var map = { function: true, object: true };

module.exports = function (x) {
	return ((x != null) && map[typeof x]) || false;
};

},{}],70:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.keys
	: require('./shim');

},{"./is-implemented":71,"./shim":72}],71:[function(require,module,exports){
'use strict';

module.exports = function () {
	try {
		Object.keys('primitive');
		return true;
	} catch (e) { return false; }
};

},{}],72:[function(require,module,exports){
'use strict';

var keys = Object.keys;

module.exports = function (object) {
	return keys(object == null ? object : Object(object));
};

},{}],73:[function(require,module,exports){
'use strict';

var callable = require('./valid-callable')
  , forEach  = require('./for-each')

  , call = Function.prototype.call;

module.exports = function (obj, cb/*, thisArg*/) {
	var o = {}, thisArg = arguments[2];
	callable(cb);
	forEach(obj, function (value, key, obj, index) {
		o[key] = call.call(cb, thisArg, value, key, obj, index);
	});
	return o;
};

},{"./for-each":66,"./valid-callable":80}],74:[function(require,module,exports){
'use strict';

var value = require('./valid-value')

  , defineProperty = Object.defineProperty
  , getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
  , getOwnPropertyNames = Object.getOwnPropertyNames;

module.exports = function (target, source) {
	var error;
	target = Object(value(target));
	getOwnPropertyNames(Object(value(source))).forEach(function (name) {
		try {
			defineProperty(target, name, getOwnPropertyDescriptor(source, name));
		} catch (e) { error = e; }
	});
	if (error !== undefined) throw error;
	return target;
};

},{"./valid-value":82}],75:[function(require,module,exports){
'use strict';

var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

module.exports = function (options/*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (options == null) return;
		process(Object(options), result);
	});
	return result;
};

},{}],76:[function(require,module,exports){
'use strict';

var forEach = Array.prototype.forEach, create = Object.create;

module.exports = function (arg/*, …args*/) {
	var set = create(null);
	forEach.call(arguments, function (name) { set[name] = true; });
	return set;
};

},{}],77:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.setPrototypeOf
	: require('./shim');

},{"./is-implemented":78,"./shim":79}],78:[function(require,module,exports){
'use strict';

var create = Object.create, getPrototypeOf = Object.getPrototypeOf
  , x = {};

module.exports = function (/*customCreate*/) {
	var setPrototypeOf = Object.setPrototypeOf
	  , customCreate = arguments[0] || create;
	if (typeof setPrototypeOf !== 'function') return false;
	return getPrototypeOf(setPrototypeOf(customCreate(null), x)) === x;
};

},{}],79:[function(require,module,exports){
// Big thanks to @WebReflection for sorting this out
// https://gist.github.com/WebReflection/5593554

'use strict';

var isObject      = require('../is-object')
  , value         = require('../valid-value')

  , isPrototypeOf = Object.prototype.isPrototypeOf
  , defineProperty = Object.defineProperty
  , nullDesc = { configurable: true, enumerable: false, writable: true,
		value: undefined }
  , validate;

validate = function (obj, prototype) {
	value(obj);
	if ((prototype === null) || isObject(prototype)) return obj;
	throw new TypeError('Prototype must be null or an object');
};

module.exports = (function (status) {
	var fn, set;
	if (!status) return null;
	if (status.level === 2) {
		if (status.set) {
			set = status.set;
			fn = function (obj, prototype) {
				set.call(validate(obj, prototype), prototype);
				return obj;
			};
		} else {
			fn = function (obj, prototype) {
				validate(obj, prototype).__proto__ = prototype;
				return obj;
			};
		}
	} else {
		fn = function self(obj, prototype) {
			var isNullBase;
			validate(obj, prototype);
			isNullBase = isPrototypeOf.call(self.nullPolyfill, obj);
			if (isNullBase) delete self.nullPolyfill.__proto__;
			if (prototype === null) prototype = self.nullPolyfill;
			obj.__proto__ = prototype;
			if (isNullBase) defineProperty(self.nullPolyfill, '__proto__', nullDesc);
			return obj;
		};
	}
	return Object.defineProperty(fn, 'level', { configurable: false,
		enumerable: false, writable: false, value: status.level });
}((function () {
	var x = Object.create(null), y = {}, set
	  , desc = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__');

	if (desc) {
		try {
			set = desc.set; // Opera crashes at this point
			set.call(x, y);
		} catch (ignore) { }
		if (Object.getPrototypeOf(x) === y) return { set: set, level: 2 };
	}

	x.__proto__ = y;
	if (Object.getPrototypeOf(x) === y) return { level: 2 };

	x = {};
	x.__proto__ = y;
	if (Object.getPrototypeOf(x) === y) return { level: 1 };

	return false;
}())));

require('../create');

},{"../create":64,"../is-object":69,"../valid-value":82}],80:[function(require,module,exports){
'use strict';

module.exports = function (fn) {
	if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
	return fn;
};

},{}],81:[function(require,module,exports){
'use strict';

var isObject = require('./is-object');

module.exports = function (value) {
	if (!isObject(value)) throw new TypeError(value + " is not an Object");
	return value;
};

},{"./is-object":69}],82:[function(require,module,exports){
'use strict';

module.exports = function (value) {
	if (value == null) throw new TypeError("Cannot use null or undefined");
	return value;
};

},{}],83:[function(require,module,exports){
'use strict';

var value         = require('./valid-value')
  , stringifiable = require('./validate-stringifiable');

module.exports = function (x) { return stringifiable(value(x)); };

},{"./valid-value":82,"./validate-stringifiable":84}],84:[function(require,module,exports){
'use strict';

module.exports = function (stringifiable) {
	try {
		return String(stringifiable);
	} catch (e) {
		throw new TypeError("Passed argument cannot be stringifed");
	}
};

},{}],85:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? String.prototype.contains
	: require('./shim');

},{"./is-implemented":86,"./shim":87}],86:[function(require,module,exports){
'use strict';

var str = 'razdwatrzy';

module.exports = function () {
	if (typeof str.contains !== 'function') return false;
	return ((str.contains('dwa') === true) && (str.contains('foo') === false));
};

},{}],87:[function(require,module,exports){
'use strict';

var indexOf = String.prototype.indexOf;

module.exports = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

},{}],88:[function(require,module,exports){
'use strict';

var toInteger = require('../../number/to-integer')
  , value     = require('../../object/valid-value')
  , repeat    = require('./repeat')

  , abs = Math.abs, max = Math.max;

module.exports = function (fill/*, length*/) {
	var self = String(value(this))
	  , sLength = self.length
	  , length = arguments[1];

	length = isNaN(length) ? 1 : toInteger(length);
	fill = repeat.call(String(fill), abs(length));
	if (length >= 0) return fill.slice(0, max(0, length - sLength)) + self;
	return self + (((sLength + length) >= 0) ? '' : fill.slice(length + sLength));
};

},{"../../number/to-integer":57,"../../object/valid-value":82,"./repeat":89}],89:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? String.prototype.repeat
	: require('./shim');

},{"./is-implemented":90,"./shim":91}],90:[function(require,module,exports){
'use strict';

var str = 'foo';

module.exports = function () {
	if (typeof str.repeat !== 'function') return false;
	return (str.repeat(2) === 'foofoo');
};

},{}],91:[function(require,module,exports){
// Thanks: http://www.2ality.com/2014/01/efficient-string-repeat.html

'use strict';

var value     = require('../../../object/valid-value')
  , toInteger = require('../../../number/to-integer');

module.exports = function (count) {
	var str = String(value(this)), result;
	count = toInteger(count);
	if (count < 0) throw new RangeError("Count must be >= 0");
	if (!isFinite(count)) throw new RangeError("Count must be < ∞");
	result = '';
	if (!count) return result;
	while (true) {
		if (count & 1) result += str;
		count >>>= 1;
		if (count <= 0) break;
		str += str;
	}
	return result;
};

},{"../../../number/to-integer":57,"../../../object/valid-value":82}],92:[function(require,module,exports){
'use strict';

var toString = Object.prototype.toString

  , id = toString.call('');

module.exports = function (x) {
	return (typeof x === 'string') || (x && (typeof x === 'object') &&
		((x instanceof String) || (toString.call(x) === id))) || false;
};

},{}],93:[function(require,module,exports){
'use strict';

var setPrototypeOf = require('es5-ext/object/set-prototype-of')
  , contains       = require('es5-ext/string/#/contains')
  , d              = require('d')
  , Iterator       = require('./')

  , defineProperty = Object.defineProperty
  , ArrayIterator;

ArrayIterator = module.exports = function (arr, kind) {
	if (!(this instanceof ArrayIterator)) return new ArrayIterator(arr, kind);
	Iterator.call(this, arr);
	if (!kind) kind = 'value';
	else if (contains.call(kind, 'key+value')) kind = 'key+value';
	else if (contains.call(kind, 'key')) kind = 'key';
	else kind = 'value';
	defineProperty(this, '__kind__', d('', kind));
};
if (setPrototypeOf) setPrototypeOf(ArrayIterator, Iterator);

ArrayIterator.prototype = Object.create(Iterator.prototype, {
	constructor: d(ArrayIterator),
	_resolve: d(function (i) {
		if (this.__kind__ === 'value') return this.__list__[i];
		if (this.__kind__ === 'key+value') return [i, this.__list__[i]];
		return i;
	}),
	toString: d(function () { return '[object Array Iterator]'; })
});

},{"./":96,"d":33,"es5-ext/object/set-prototype-of":77,"es5-ext/string/#/contains":85}],94:[function(require,module,exports){
'use strict';

var isArguments = require('es5-ext/function/is-arguments')
  , callable    = require('es5-ext/object/valid-callable')
  , isString    = require('es5-ext/string/is-string')
  , get         = require('./get')

  , isArray = Array.isArray, call = Function.prototype.call
  , some = Array.prototype.some;

module.exports = function (iterable, cb/*, thisArg*/) {
	var mode, thisArg = arguments[2], result, doBreak, broken, i, l, char, code;
	if (isArray(iterable) || isArguments(iterable)) mode = 'array';
	else if (isString(iterable)) mode = 'string';
	else iterable = get(iterable);

	callable(cb);
	doBreak = function () { broken = true; };
	if (mode === 'array') {
		some.call(iterable, function (value) {
			call.call(cb, thisArg, value, doBreak);
			if (broken) return true;
		});
		return;
	}
	if (mode === 'string') {
		l = iterable.length;
		for (i = 0; i < l; ++i) {
			char = iterable[i];
			if ((i + 1) < l) {
				code = char.charCodeAt(0);
				if ((code >= 0xD800) && (code <= 0xDBFF)) char += iterable[++i];
			}
			call.call(cb, thisArg, char, doBreak);
			if (broken) break;
		}
		return;
	}
	result = iterable.next();

	while (!result.done) {
		call.call(cb, thisArg, result.value, doBreak);
		if (broken) return;
		result = iterable.next();
	}
};

},{"./get":95,"es5-ext/function/is-arguments":46,"es5-ext/object/valid-callable":80,"es5-ext/string/is-string":92}],95:[function(require,module,exports){
'use strict';

var isArguments    = require('es5-ext/function/is-arguments')
  , isString       = require('es5-ext/string/is-string')
  , ArrayIterator  = require('./array')
  , StringIterator = require('./string')
  , iterable       = require('./valid-iterable')
  , iteratorSymbol = require('es6-symbol').iterator;

module.exports = function (obj) {
	if (typeof iterable(obj)[iteratorSymbol] === 'function') return obj[iteratorSymbol]();
	if (isArguments(obj)) return new ArrayIterator(obj);
	if (isString(obj)) return new StringIterator(obj);
	return new ArrayIterator(obj);
};

},{"./array":93,"./string":98,"./valid-iterable":99,"es5-ext/function/is-arguments":46,"es5-ext/string/is-string":92,"es6-symbol":100}],96:[function(require,module,exports){
'use strict';

var clear    = require('es5-ext/array/#/clear')
  , assign   = require('es5-ext/object/assign')
  , callable = require('es5-ext/object/valid-callable')
  , value    = require('es5-ext/object/valid-value')
  , d        = require('d')
  , autoBind = require('d/auto-bind')
  , Symbol   = require('es6-symbol')

  , defineProperty = Object.defineProperty
  , defineProperties = Object.defineProperties
  , Iterator;

module.exports = Iterator = function (list, context) {
	if (!(this instanceof Iterator)) return new Iterator(list, context);
	defineProperties(this, {
		__list__: d('w', value(list)),
		__context__: d('w', context),
		__nextIndex__: d('w', 0)
	});
	if (!context) return;
	callable(context.on);
	context.on('_add', this._onAdd);
	context.on('_delete', this._onDelete);
	context.on('_clear', this._onClear);
};

defineProperties(Iterator.prototype, assign({
	constructor: d(Iterator),
	_next: d(function () {
		var i;
		if (!this.__list__) return;
		if (this.__redo__) {
			i = this.__redo__.shift();
			if (i !== undefined) return i;
		}
		if (this.__nextIndex__ < this.__list__.length) return this.__nextIndex__++;
		this._unBind();
	}),
	next: d(function () { return this._createResult(this._next()); }),
	_createResult: d(function (i) {
		if (i === undefined) return { done: true, value: undefined };
		return { done: false, value: this._resolve(i) };
	}),
	_resolve: d(function (i) { return this.__list__[i]; }),
	_unBind: d(function () {
		this.__list__ = null;
		delete this.__redo__;
		if (!this.__context__) return;
		this.__context__.off('_add', this._onAdd);
		this.__context__.off('_delete', this._onDelete);
		this.__context__.off('_clear', this._onClear);
		this.__context__ = null;
	}),
	toString: d(function () { return '[object Iterator]'; })
}, autoBind({
	_onAdd: d(function (index) {
		if (index >= this.__nextIndex__) return;
		++this.__nextIndex__;
		if (!this.__redo__) {
			defineProperty(this, '__redo__', d('c', [index]));
			return;
		}
		this.__redo__.forEach(function (redo, i) {
			if (redo >= index) this.__redo__[i] = ++redo;
		}, this);
		this.__redo__.push(index);
	}),
	_onDelete: d(function (index) {
		var i;
		if (index >= this.__nextIndex__) return;
		--this.__nextIndex__;
		if (!this.__redo__) return;
		i = this.__redo__.indexOf(index);
		if (i !== -1) this.__redo__.splice(i, 1);
		this.__redo__.forEach(function (redo, i) {
			if (redo > index) this.__redo__[i] = --redo;
		}, this);
	}),
	_onClear: d(function () {
		if (this.__redo__) clear.call(this.__redo__);
		this.__nextIndex__ = 0;
	})
})));

defineProperty(Iterator.prototype, Symbol.iterator, d(function () {
	return this;
}));
defineProperty(Iterator.prototype, Symbol.toStringTag, d('', 'Iterator'));

},{"d":33,"d/auto-bind":32,"es5-ext/array/#/clear":35,"es5-ext/object/assign":60,"es5-ext/object/valid-callable":80,"es5-ext/object/valid-value":82,"es6-symbol":100}],97:[function(require,module,exports){
'use strict';

var isArguments    = require('es5-ext/function/is-arguments')
  , isString       = require('es5-ext/string/is-string')
  , iteratorSymbol = require('es6-symbol').iterator

  , isArray = Array.isArray;

module.exports = function (value) {
	if (value == null) return false;
	if (isArray(value)) return true;
	if (isString(value)) return true;
	if (isArguments(value)) return true;
	return (typeof value[iteratorSymbol] === 'function');
};

},{"es5-ext/function/is-arguments":46,"es5-ext/string/is-string":92,"es6-symbol":100}],98:[function(require,module,exports){
// Thanks @mathiasbynens
// http://mathiasbynens.be/notes/javascript-unicode#iterating-over-symbols

'use strict';

var setPrototypeOf = require('es5-ext/object/set-prototype-of')
  , d              = require('d')
  , Iterator       = require('./')

  , defineProperty = Object.defineProperty
  , StringIterator;

StringIterator = module.exports = function (str) {
	if (!(this instanceof StringIterator)) return new StringIterator(str);
	str = String(str);
	Iterator.call(this, str);
	defineProperty(this, '__length__', d('', str.length));

};
if (setPrototypeOf) setPrototypeOf(StringIterator, Iterator);

StringIterator.prototype = Object.create(Iterator.prototype, {
	constructor: d(StringIterator),
	_next: d(function () {
		if (!this.__list__) return;
		if (this.__nextIndex__ < this.__length__) return this.__nextIndex__++;
		this._unBind();
	}),
	_resolve: d(function (i) {
		var char = this.__list__[i], code;
		if (this.__nextIndex__ === this.__length__) return char;
		code = char.charCodeAt(0);
		if ((code >= 0xD800) && (code <= 0xDBFF)) return char + this.__list__[this.__nextIndex__++];
		return char;
	}),
	toString: d(function () { return '[object String Iterator]'; })
});

},{"./":96,"d":33,"es5-ext/object/set-prototype-of":77}],99:[function(require,module,exports){
'use strict';

var isIterable = require('./is-iterable');

module.exports = function (value) {
	if (!isIterable(value)) throw new TypeError(value + " is not iterable");
	return value;
};

},{"./is-iterable":97}],100:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')() ? Symbol : require('./polyfill');

},{"./is-implemented":101,"./polyfill":103}],101:[function(require,module,exports){
'use strict';

module.exports = function () {
	var symbol;
	if (typeof Symbol !== 'function') return false;
	symbol = Symbol('test symbol');
	try { String(symbol); } catch (e) { return false; }
	if (typeof Symbol.iterator === 'symbol') return true;

	// Return 'true' for polyfills
	if (typeof Symbol.isConcatSpreadable !== 'object') return false;
	if (typeof Symbol.iterator !== 'object') return false;
	if (typeof Symbol.toPrimitive !== 'object') return false;
	if (typeof Symbol.toStringTag !== 'object') return false;
	if (typeof Symbol.unscopables !== 'object') return false;

	return true;
};

},{}],102:[function(require,module,exports){
'use strict';

module.exports = function (x) {
	return (x && ((typeof x === 'symbol') || (x['@@toStringTag'] === 'Symbol'))) || false;
};

},{}],103:[function(require,module,exports){
// ES2015 Symbol polyfill for environments that do not support it (or partially support it_

'use strict';

var d              = require('d')
  , validateSymbol = require('./validate-symbol')

  , create = Object.create, defineProperties = Object.defineProperties
  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null);

if (typeof Symbol === 'function') NativeSymbol = Symbol;

var generateName = (function () {
	var created = create(null);
	return function (desc) {
		var postfix = 0, name, ie11BugWorkaround;
		while (created[desc + (postfix || '')]) ++postfix;
		desc += (postfix || '');
		created[desc] = true;
		name = '@@' + desc;
		defineProperty(objPrototype, name, d.gs(null, function (value) {
			// For IE11 issue see:
			// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
			//    ie11-broken-getters-on-dom-objects
			// https://github.com/medikoo/es6-symbol/issues/12
			if (ie11BugWorkaround) return;
			ie11BugWorkaround = true;
			defineProperty(this, name, d(value));
			ie11BugWorkaround = false;
		}));
		return name;
	};
}());

// Internal constructor (not one exposed) for creating Symbol instances.
// This one is used to ensure that `someSymbol instanceof Symbol` always return false
HiddenSymbol = function Symbol(description) {
	if (this instanceof HiddenSymbol) throw new TypeError('TypeError: Symbol is not a constructor');
	return SymbolPolyfill(description);
};

// Exposed `Symbol` constructor
// (returns instances of HiddenSymbol)
module.exports = SymbolPolyfill = function Symbol(description) {
	var symbol;
	if (this instanceof Symbol) throw new TypeError('TypeError: Symbol is not a constructor');
	symbol = create(HiddenSymbol.prototype);
	description = (description === undefined ? '' : String(description));
	return defineProperties(symbol, {
		__description__: d('', description),
		__name__: d('', generateName(description))
	});
};
defineProperties(SymbolPolyfill, {
	for: d(function (key) {
		if (globalSymbols[key]) return globalSymbols[key];
		return (globalSymbols[key] = SymbolPolyfill(String(key)));
	}),
	keyFor: d(function (s) {
		var key;
		validateSymbol(s);
		for (key in globalSymbols) if (globalSymbols[key] === s) return key;
	}),

	// If there's native implementation of given symbol, let's fallback to it
	// to ensure proper interoperability with other native functions e.g. Array.from
	hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
	isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
		SymbolPolyfill('isConcatSpreadable')),
	iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
	match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
	replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
	search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
	species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
	split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
	toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
	toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
	unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
});

// Internal tweaks for real symbol producer
defineProperties(HiddenSymbol.prototype, {
	constructor: d(SymbolPolyfill),
	toString: d('', function () { return this.__name__; })
});

// Proper implementation of methods exposed on Symbol.prototype
// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
defineProperties(SymbolPolyfill.prototype, {
	toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
	valueOf: d(function () { return validateSymbol(this); })
});
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('',
	function () { return validateSymbol(this); }));
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

// Note: It's important to define `toPrimitive` as last one, as some implementations
// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
// And that may invoke error in definition flow:
// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));

},{"./validate-symbol":104,"d":33}],104:[function(require,module,exports){
'use strict';

var isSymbol = require('./is-symbol');

module.exports = function (value) {
	if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
	return value;
};

},{"./is-symbol":102}],105:[function(require,module,exports){
'use strict';

var d        = require('d')
  , callable = require('es5-ext/object/valid-callable')

  , apply = Function.prototype.apply, call = Function.prototype.call
  , create = Object.create, defineProperty = Object.defineProperty
  , defineProperties = Object.defineProperties
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , descriptor = { configurable: true, enumerable: false, writable: true }

  , on, once, off, emit, methods, descriptors, base;

on = function (type, listener) {
	var data;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) {
		data = descriptor.value = create(null);
		defineProperty(this, '__ee__', descriptor);
		descriptor.value = null;
	} else {
		data = this.__ee__;
	}
	if (!data[type]) data[type] = listener;
	else if (typeof data[type] === 'object') data[type].push(listener);
	else data[type] = [data[type], listener];

	return this;
};

once = function (type, listener) {
	var once, self;

	callable(listener);
	self = this;
	on.call(this, type, once = function () {
		off.call(self, type, once);
		apply.call(listener, this, arguments);
	});

	once.__eeOnceListener__ = listener;
	return this;
};

off = function (type, listener) {
	var data, listeners, candidate, i;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) return this;
	data = this.__ee__;
	if (!data[type]) return this;
	listeners = data[type];

	if (typeof listeners === 'object') {
		for (i = 0; (candidate = listeners[i]); ++i) {
			if ((candidate === listener) ||
					(candidate.__eeOnceListener__ === listener)) {
				if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
				else listeners.splice(i, 1);
			}
		}
	} else {
		if ((listeners === listener) ||
				(listeners.__eeOnceListener__ === listener)) {
			delete data[type];
		}
	}

	return this;
};

emit = function (type) {
	var i, l, listener, listeners, args;

	if (!hasOwnProperty.call(this, '__ee__')) return;
	listeners = this.__ee__[type];
	if (!listeners) return;

	if (typeof listeners === 'object') {
		l = arguments.length;
		args = new Array(l - 1);
		for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

		listeners = listeners.slice();
		for (i = 0; (listener = listeners[i]); ++i) {
			apply.call(listener, this, args);
		}
	} else {
		switch (arguments.length) {
		case 1:
			call.call(listeners, this);
			break;
		case 2:
			call.call(listeners, this, arguments[1]);
			break;
		case 3:
			call.call(listeners, this, arguments[1], arguments[2]);
			break;
		default:
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) {
				args[i - 1] = arguments[i];
			}
			apply.call(listeners, this, args);
		}
	}
};

methods = {
	on: on,
	once: once,
	off: off,
	emit: emit
};

descriptors = {
	on: d(on),
	once: d(once),
	off: d(off),
	emit: d(emit)
};

base = defineProperties({}, descriptors);

module.exports = exports = function (o) {
	return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
};
exports.methods = methods;

},{"d":33,"es5-ext/object/valid-callable":80}],106:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],107:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],108:[function(require,module,exports){
'use strict';

var toPosInt = require('es5-ext/number/to-pos-integer')

  , create = Object.create, hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = function (limit) {
	var size = 0, base = 1, queue = create(null), map = create(null), index = 0, del;
	limit = toPosInt(limit);
	return {
		hit: function (id) {
			var oldIndex = map[id], nuIndex = ++index;
			queue[nuIndex] = id;
			map[id] = nuIndex;
			if (!oldIndex) {
				++size;
				if (size <= limit) return;
				id = queue[base];
				del(id);
				return id;
			}
			delete queue[oldIndex];
			if (base !== oldIndex) return;
			while (!hasOwnProperty.call(queue, ++base)) continue; //jslint: skip
		},
		delete: del = function (id) {
			var oldIndex = map[id];
			if (!oldIndex) return;
			delete queue[oldIndex];
			delete map[id];
			--size;
			if (base !== oldIndex) return;
			if (!size) {
				index = 0;
				base = 1;
				return;
			}
			while (!hasOwnProperty.call(queue, ++base)) continue; //jslint: skip
		},
		clear: function () {
			size = 0;
			base = 1;
			queue = create(null);
			map = create(null);
			index = 0;
		}
	};
};

},{"es5-ext/number/to-pos-integer":58}],109:[function(require,module,exports){
// Support for asynchronous functions

'use strict';

var aFrom        = require('es5-ext/array/from')
  , mixin        = require('es5-ext/object/mixin')
  , defineLength = require('es5-ext/function/_define-length')
  , nextTick     = require('next-tick')

  , slice = Array.prototype.slice
  , apply = Function.prototype.apply, create = Object.create
  , hasOwnProperty = Object.prototype.hasOwnProperty;

require('../lib/registered-extensions').async = function (tbi, conf) {
	var waiting = create(null), cache = create(null)
	  , base = conf.memoized, original = conf.original
	  , currentCallback, currentContext, currentArgs;

	// Initial
	conf.memoized = defineLength(function (arg) {
		var args = arguments, last = args[args.length - 1];
		if (typeof last === 'function') {
			currentCallback = last;
			args = slice.call(args, 0, -1);
		}
		return base.apply(currentContext = this, currentArgs = args);
	}, base);
	try { mixin(conf.memoized, base); } catch (ignore) {}

	// From cache (sync)
	conf.on('get', function (id) {
		var cb, context, args;
		if (!currentCallback) return;

		// Unresolved
		if (waiting[id]) {
			if (typeof waiting[id] === 'function') waiting[id] = [waiting[id], currentCallback];
			else waiting[id].push(currentCallback);
			currentCallback = null;
			return;
		}

		// Resolved, assure next tick invocation
		cb = currentCallback;
		context = currentContext;
		args = currentArgs;
		currentCallback = currentContext = currentArgs = null;
		nextTick(function () {
			var data;
			if (hasOwnProperty.call(cache, id)) {
				data = cache[id];
				conf.emit('getasync', id, args, context);
				apply.call(cb, data.context, data.args);
			} else {
				// Purged in a meantime, we shouldn't rely on cached value, recall
				currentCallback = cb;
				currentContext = context;
				currentArgs = args;
				base.apply(context, args);
			}
		});
	});

	// Not from cache
	conf.original = function () {
		var args, cb, origCb, result;
		if (!currentCallback) return apply.call(original, this, arguments);
		args = aFrom(arguments);
		cb = function self(err) {
			var cb, args, id = self.id;
			if (id == null) {
				// Shouldn't happen, means async callback was called sync way
				nextTick(apply.bind(self, this, arguments));
				return;
			}
			delete self.id;
			cb = waiting[id];
			delete waiting[id];
			if (!cb) {
				// Already processed,
				// outcome of race condition: asyncFn(1, cb), asyncFn.clear(), asyncFn(1, cb)
				return;
			}
			args = aFrom(arguments);
			if (conf.has(id)) {
				if (err) {
					conf.delete(id);
				} else {
					cache[id] = { context: this, args: args };
					conf.emit('setasync', id, (typeof cb === 'function') ? 1 : cb.length);
				}
			}
			if (typeof cb === 'function') {
				result = apply.call(cb, this, args);
			} else {
				cb.forEach(function (cb) { result = apply.call(cb, this, args); }, this);
			}
			return result;
		};
		origCb = currentCallback;
		currentCallback = currentContext = currentArgs = null;
		args.push(cb);
		result = apply.call(original, this, args);
		cb.cb = origCb;
		currentCallback = cb;
		return result;
	};

	// After not from cache call
	conf.on('set', function (id) {
		if (!currentCallback) {
			conf.delete(id);
			return;
		}
		if (waiting[id]) {
			// Race condition: asyncFn(1, cb), asyncFn.clear(), asyncFn(1, cb)
			if (typeof waiting[id] === 'function') waiting[id] = [waiting[id], currentCallback.cb];
			else waiting[id].push(currentCallback.cb);
		} else {
			waiting[id] = currentCallback.cb;
		}
		delete currentCallback.cb;
		currentCallback.id = id;
		currentCallback = null;
	});

	// On delete
	conf.on('delete', function (id) {
		var result;
		// If false, we don't have value yet, so we assume that intention is not
		// to memoize this call. After value is obtained we don't cache it but
		// gracefully pass to callback
		if (hasOwnProperty.call(waiting, id)) return;
		if (!cache[id]) return;
		result = cache[id];
		delete cache[id];
		conf.emit('deleteasync', id, result);
	});

	// On clear
	conf.on('clear', function () {
		var oldCache = cache;
		cache = create(null);
		conf.emit('clearasync', oldCache);
	});
};

},{"../lib/registered-extensions":117,"es5-ext/array/from":39,"es5-ext/function/_define-length":45,"es5-ext/object/mixin":74,"next-tick":128}],110:[function(require,module,exports){
// Call dispose callback on each cache purge

'use strict';

var callable   = require('es5-ext/object/valid-callable')
  , forEach    = require('es5-ext/object/for-each')
  , extensions = require('../lib/registered-extensions')

  , slice = Array.prototype.slice, apply = Function.prototype.apply;

extensions.dispose = function (dispose, conf, options) {
	var del;
	callable(dispose);
	if (options.async && extensions.async) {
		conf.on('deleteasync', del = function (id, result) {
			apply.call(dispose, null, slice.call(result.args, 1));
		});
		conf.on('clearasync', function (cache) {
			forEach(cache, function (result, id) { del(id, result); });
		});
		return;
	}
	conf.on('delete', del = function (id, result) { dispose(result); });
	conf.on('clear', function (cache) {
		forEach(cache, function (result, id) { del(id, result); });
	});
};

},{"../lib/registered-extensions":117,"es5-ext/object/for-each":66,"es5-ext/object/valid-callable":80}],111:[function(require,module,exports){
// Timeout cached values

'use strict';

var aFrom      = require('es5-ext/array/from')
  , noop       = require('es5-ext/function/noop')
  , forEach    = require('es5-ext/object/for-each')
  , timeout    = require('timers-ext/valid-timeout')
  , extensions = require('../lib/registered-extensions')

  , max = Math.max, min = Math.min, create = Object.create;

extensions.maxAge = function (maxAge, conf, options) {
	var timeouts, postfix, preFetchAge, preFetchTimeouts;

	maxAge = timeout(maxAge);
	if (!maxAge) return;

	timeouts = create(null);
	postfix = (options.async && extensions.async) ? 'async' : '';
	conf.on('set' + postfix, function (id) {
		timeouts[id] = setTimeout(function () { conf.delete(id); }, maxAge);
		if (!preFetchTimeouts) return;
		if (preFetchTimeouts[id]) clearTimeout(preFetchTimeouts[id]);
		preFetchTimeouts[id] = setTimeout(function () {
			delete preFetchTimeouts[id];
		}, preFetchAge);
	});
	conf.on('delete' + postfix, function (id) {
		clearTimeout(timeouts[id]);
		delete timeouts[id];
		if (!preFetchTimeouts) return;
		clearTimeout(preFetchTimeouts[id]);
		delete preFetchTimeouts[id];
	});

	if (options.preFetch) {
		if ((options.preFetch === true) || isNaN(options.preFetch)) {
			preFetchAge = 0.333;
		} else {
			preFetchAge = max(min(Number(options.preFetch), 1), 0);
		}
		if (preFetchAge) {
			preFetchTimeouts = {};
			preFetchAge = (1 - preFetchAge) * maxAge;
			conf.on('get' + postfix, function (id, args, context) {
				if (!preFetchTimeouts[id]) {
					preFetchTimeouts[id] =  setTimeout(function () {
						delete preFetchTimeouts[id];
						conf.delete(id);
						if (options.async) {
							args = aFrom(args);
							args.push(noop);
						}
						conf.memoized.apply(context, args);
					}, 0);
				}
			});
		}
	}

	conf.on('clear' + postfix, function () {
		forEach(timeouts, function (id) { clearTimeout(id); });
		timeouts = {};
		if (preFetchTimeouts) {
			forEach(preFetchTimeouts, function (id) { clearTimeout(id); });
			preFetchTimeouts = {};
		}
	});
};

},{"../lib/registered-extensions":117,"es5-ext/array/from":39,"es5-ext/function/noop":48,"es5-ext/object/for-each":66,"timers-ext/valid-timeout":131}],112:[function(require,module,exports){
// Limit cache size, LRU (least recently used) algorithm.

'use strict';

var toPosInteger = require('es5-ext/number/to-pos-integer')
  , lruQueue     = require('lru-queue')
  , extensions   = require('../lib/registered-extensions');

extensions.max = function (max, conf, options) {
	var postfix, queue, hit;

	max = toPosInteger(max);
	if (!max) return;

	queue = lruQueue(max);
	postfix = (options.async && extensions.async) ? 'async' : '';

	conf.on('set' + postfix, hit = function (id) {
		id = queue.hit(id);
		if (id === undefined) return;
		conf.delete(id);
	});
	conf.on('get' + postfix, hit);
	conf.on('delete' + postfix, queue.delete);
	conf.on('clear' + postfix, queue.clear);
};

},{"../lib/registered-extensions":117,"es5-ext/number/to-pos-integer":58,"lru-queue":108}],113:[function(require,module,exports){
// Reference counter, useful for garbage collector like functionality

'use strict';

var d          = require('d')
  , extensions = require('../lib/registered-extensions')

  , create = Object.create, defineProperties = Object.defineProperties;

extensions.refCounter = function (ignore, conf, options) {
	var cache, postfix;

	cache = create(null);
	postfix = (options.async && extensions.async) ? 'async' : '';

	conf.on('set' + postfix, function (id, length) { cache[id] = length || 1; });
	conf.on('get' + postfix, function (id) { ++cache[id]; });
	conf.on('delete' + postfix, function (id) { delete cache[id]; });
	conf.on('clear' + postfix, function () { cache = {}; });

	defineProperties(conf.memoized, {
		deleteRef: d(function () {
			var id = conf.get(arguments);
			if (id === null) return null;
			if (!cache[id]) return null;
			if (!--cache[id]) {
				conf.delete(id);
				return true;
			}
			return false;
		}),
		getRefCount: d(function () {
			var id = conf.get(arguments);
			if (id === null) return 0;
			if (!cache[id]) return 0;
			return cache[id];
		})
	});
};

},{"../lib/registered-extensions":117,"d":33}],114:[function(require,module,exports){
'use strict';

var normalizeOpts = require('es5-ext/object/normalize-options')
  , resolveLength = require('./lib/resolve-length')
  , plain         = require('./plain');

module.exports = function (fn/*, options*/) {
	var options = normalizeOpts(arguments[1]), length;

	if (!options.normalizer) {
		length = options.length = resolveLength(options.length, fn.length, options.async);
		if (length !== 0) {
			if (options.primitive) {
				if (length === false) {
					options.normalizer = require('./normalizers/primitive');
				} else if (length > 1) {
					options.normalizer = require('./normalizers/get-primitive-fixed')(length);
				}
			} else {
				if (length === false) options.normalizer = require('./normalizers/get')();
				else if (length === 1) options.normalizer = require('./normalizers/get-1')();
				else options.normalizer = require('./normalizers/get-fixed')(length);
			}
		}
	}

	// Assure extensions
	if (options.async) require('./ext/async');
	if (options.dispose) require('./ext/dispose');
	if (options.maxAge) require('./ext/max-age');
	if (options.max) require('./ext/max');
	if (options.refCounter) require('./ext/ref-counter');

	return plain(fn, options);
};

},{"./ext/async":109,"./ext/dispose":110,"./ext/max":112,"./ext/max-age":111,"./ext/ref-counter":113,"./lib/resolve-length":118,"./normalizers/get":125,"./normalizers/get-1":122,"./normalizers/get-fixed":123,"./normalizers/get-primitive-fixed":124,"./normalizers/primitive":126,"./plain":127,"es5-ext/object/normalize-options":75}],115:[function(require,module,exports){
'use strict';

var customError      = require('es5-ext/error/custom')
  , defineLength     = require('es5-ext/function/_define-length')
  , d                = require('d')
  , ee               = require('event-emitter').methods
  , resolveResolve   = require('./resolve-resolve')
  , resolveNormalize = require('./resolve-normalize')

  , apply = Function.prototype.apply, call = Function.prototype.call
  , create = Object.create, hasOwnProperty = Object.prototype.hasOwnProperty
  , defineProperties = Object.defineProperties
  , on = ee.on, emit = ee.emit;

module.exports = function (original, length, options) {
	var cache = create(null), conf, memLength, get, set, del, clear, extDel, normalizer
	  , getListeners, setListeners, deleteListeners, memoized, resolve;
	if (length !== false) memLength = length;
	else if (isNaN(original.length)) memLength = 1;
	else memLength = original.length;

	if (options.normalizer) {
		normalizer = resolveNormalize(options.normalizer);
		get = normalizer.get;
		set = normalizer.set;
		del = normalizer.delete;
		clear = normalizer.clear;
	}
	if (options.resolvers != null) resolve = resolveResolve(options.resolvers);

	if (get) {
		memoized = defineLength(function (arg) {
			var id, result, args = arguments;
			if (resolve) args = resolve(args);
			id = get(args);
			if (id !== null) {
				if (hasOwnProperty.call(cache, id)) {
					if (getListeners) conf.emit('get', id, args, this);
					return cache[id];
				}
			}
			if (args.length === 1) result = call.call(original, this, args[0]);
			else result = apply.call(original, this, args);
			if (id === null) {
				id = get(args);
				if (id !== null) throw customError("Circular invocation", 'CIRCULAR_INVOCATION');
				id = set(args);
			} else if (hasOwnProperty.call(cache, id)) {
				throw customError("Circular invocation", 'CIRCULAR_INVOCATION');
			}
			cache[id] = result;
			if (setListeners) conf.emit('set', id);
			return result;
		}, memLength);
	} else if (length === 0) {
		memoized = function () {
			var result;
			if (hasOwnProperty.call(cache, 'data')) {
				if (getListeners) conf.emit('get', 'data', arguments, this);
				return cache.data;
			}
			if (!arguments.length) result = call.call(original, this);
			else result = apply.call(original, this, arguments);
			if (hasOwnProperty.call(cache, 'data')) {
				throw customError("Circular invocation", 'CIRCULAR_INVOCATION');
			}
			cache.data = result;
			if (setListeners) conf.emit('set', 'data');
			return result;
		};
	} else {
		memoized = function (arg) {
			var result, args = arguments, id;
			if (resolve) args = resolve(arguments);
			id = String(args[0]);
			if (hasOwnProperty.call(cache, id)) {
				if (getListeners) conf.emit('get', id, args, this);
				return cache[id];
			}
			if (args.length === 1) result = call.call(original, this, args[0]);
			else result = apply.call(original, this, args);
			if (hasOwnProperty.call(cache, id)) {
				throw customError("Circular invocation", 'CIRCULAR_INVOCATION');
			}
			cache[id] = result;
			if (setListeners) conf.emit('set', id);
			return result;
		};
	}
	conf = {
		original: original,
		memoized: memoized,
		get: function (args) {
			if (resolve) args = resolve(args);
			if (get) return get(args);
			return String(args[0]);
		},
		has: function (id) { return hasOwnProperty.call(cache, id); },
		delete: function (id) {
			var result;
			if (!hasOwnProperty.call(cache, id)) return;
			if (del) del(id);
			result = cache[id];
			delete cache[id];
			if (deleteListeners) conf.emit('delete', id, result);
		},
		clear: function () {
			var oldCache = cache;
			if (clear) clear();
			cache = create(null);
			conf.emit('clear', oldCache);
		},
		on: function (type, listener) {
			if (type === 'get') getListeners = true;
			else if (type === 'set') setListeners = true;
			else if (type === 'delete') deleteListeners = true;
			return on.call(this, type, listener);
		},
		emit: emit,
		updateEnv: function () { original = conf.original; }
	};
	if (get) {
		extDel = defineLength(function (arg) {
			var id, args = arguments;
			if (resolve) args = resolve(args);
			id = get(args);
			if (id === null) return;
			conf.delete(id);
		}, memLength);
	} else if (length === 0) {
		extDel = function () { return conf.delete('data'); };
	} else {
		extDel = function (arg) {
			if (resolve) arg = resolve(arguments)[0];
			return conf.delete(arg);
		};
	}
	defineProperties(memoized, {
		__memoized__: d(true),
		delete: d(extDel),
		clear: d(conf.clear)
	});
	return conf;
};

},{"./resolve-normalize":119,"./resolve-resolve":120,"d":33,"es5-ext/error/custom":43,"es5-ext/function/_define-length":45,"event-emitter":105}],116:[function(require,module,exports){
'use strict';

var forEach       = require('es5-ext/object/for-each')
  , normalizeOpts = require('es5-ext/object/normalize-options')
  , callable      = require('es5-ext/object/valid-callable')
  , lazy          = require('d/lazy')
  , resolveLength = require('./resolve-length')
  , extensions    = require('./registered-extensions');

module.exports = function (memoize) {
	return function (props) {
		forEach(props, function (desc, name) {
			var fn = callable(desc.value), length;
			desc.value = function (options) {
				if (options.getNormalizer) {
					options = normalizeOpts(options);
					if (length === undefined) {
						length = resolveLength(options.length, fn.length, options.async && extensions.async);
					}
					options.normalizer = options.getNormalizer(length);
					delete options.getNormalizer;
				}
				return memoize(fn.bind(this), options);
			};
		});
		return lazy(props);
	};
};

},{"./registered-extensions":117,"./resolve-length":118,"d/lazy":34,"es5-ext/object/for-each":66,"es5-ext/object/normalize-options":75,"es5-ext/object/valid-callable":80}],117:[function(require,module,exports){
'use strict';

},{}],118:[function(require,module,exports){
'use strict';

var toPosInt = require('es5-ext/number/to-pos-integer');

module.exports = function (optsLength, fnLength, isAsync) {
	var length;
	if (isNaN(optsLength)) {
		length = fnLength;
		if (!(length >= 0)) return 1;
		if (isAsync && length) return length - 1;
		return length;
	}
	if (optsLength === false) return false;
	return toPosInt(optsLength);
};

},{"es5-ext/number/to-pos-integer":58}],119:[function(require,module,exports){
'use strict';

var callable = require('es5-ext/object/valid-callable');

module.exports = function (userNormalizer) {
	var normalizer;
	if (typeof userNormalizer === 'function') return { set: userNormalizer, get: userNormalizer };
	normalizer = { get: callable(userNormalizer.get) };
	if (userNormalizer.set !== undefined) {
		normalizer.set = callable(userNormalizer.set);
		normalizer.delete = callable(userNormalizer.delete);
		normalizer.clear = callable(userNormalizer.clear);
		return normalizer;
	}
	normalizer.set = normalizer.get;
	return normalizer;
};

},{"es5-ext/object/valid-callable":80}],120:[function(require,module,exports){
'use strict';

var toArray  = require('es5-ext/array/to-array')
  , callable = require('es5-ext/object/valid-callable')

  , slice = Array.prototype.slice
  , resolveArgs;

resolveArgs = function (args) {
	return this.map(function (r, i) {
		return r ? r(args[i]) : args[i];
	}).concat(slice.call(args, this.length));
};

module.exports = function (resolvers) {
	resolvers = toArray(resolvers);
	resolvers.forEach(function (r) {
		if (r != null) callable(r);
	});
	return resolveArgs.bind(resolvers);
};

},{"es5-ext/array/to-array":42,"es5-ext/object/valid-callable":80}],121:[function(require,module,exports){
'use strict';

module.exports = require('./lib/methods')(require('./'));

},{"./":114,"./lib/methods":116}],122:[function(require,module,exports){
'use strict';

var indexOf = require('es5-ext/array/#/e-index-of');

module.exports = function () {
	var lastId = 0, argsMap = [], cache = [];
	return {
		get: function (args) {
			var index = indexOf.call(argsMap, args[0]);
			return (index === -1) ? null : cache[index];
		},
		set: function (args) {
			argsMap.push(args[0]);
			cache.push(++lastId);
			return lastId;
		},
		delete: function (id) {
			var index = indexOf.call(cache, id);
			if (index !== -1) {
				argsMap.splice(index, 1);
				cache.splice(index, 1);
			}
		},
		clear: function () {
			argsMap = [];
			cache = [];
		}
	};
};

},{"es5-ext/array/#/e-index-of":36}],123:[function(require,module,exports){
'use strict';

var indexOf = require('es5-ext/array/#/e-index-of')
  , create = Object.create;

module.exports = function (length) {
	var lastId = 0, map = [[], []], cache = create(null);
	return {
		get: function (args) {
			var index = 0, set = map, i;
			while (index < (length - 1)) {
				i = indexOf.call(set[0], args[index]);
				if (i === -1) return null;
				set = set[1][i];
				++index;
			}
			i = indexOf.call(set[0], args[index]);
			if (i === -1) return null;
			return set[1][i] || null;
		},
		set: function (args) {
			var index = 0, set = map, i;
			while (index < (length - 1)) {
				i = indexOf.call(set[0], args[index]);
				if (i === -1) {
					i = set[0].push(args[index]) - 1;
					set[1].push([[], []]);
				}
				set = set[1][i];
				++index;
			}
			i = indexOf.call(set[0], args[index]);
			if (i === -1) {
				i = set[0].push(args[index]) - 1;
			}
			set[1][i] = ++lastId;
			cache[lastId] = args;
			return lastId;
		},
		delete: function (id) {
			var index = 0, set = map, i, path = [], args = cache[id];
			while (index < (length - 1)) {
				i = indexOf.call(set[0], args[index]);
				if (i === -1) {
					return;
				}
				path.push(set, i);
				set = set[1][i];
				++index;
			}
			i = indexOf.call(set[0], args[index]);
			if (i === -1) {
				return;
			}
			id = set[1][i];
			set[0].splice(i, 1);
			set[1].splice(i, 1);
			while (!set[0].length && path.length) {
				i = path.pop();
				set = path.pop();
				set[0].splice(i, 1);
				set[1].splice(i, 1);
			}
			delete cache[id];
		},
		clear: function () {
			map = [[], []];
			cache = create(null);
		}
	};
};

},{"es5-ext/array/#/e-index-of":36}],124:[function(require,module,exports){
'use strict';

module.exports = function (length) {
	if (!length) {
		return function () { return ''; };
	}
	return function (args) {
		var id = String(args[0]), i = 0, l = length;
		while (--l) { id += '\u0001' + args[++i]; }
		return id;
	};
};

},{}],125:[function(require,module,exports){
'use strict';

var indexOf = require('es5-ext/array/#/e-index-of')
  , create = Object.create;

module.exports = function () {
	var lastId = 0, map = [], cache = create(null);
	return {
		get: function (args) {
			var index = 0, set = map, i, length = args.length;
			if (length === 0) return set[length] || null;
			if ((set = set[length])) {
				while (index < (length - 1)) {
					i = indexOf.call(set[0], args[index]);
					if (i === -1) return null;
					set = set[1][i];
					++index;
				}
				i = indexOf.call(set[0], args[index]);
				if (i === -1) return null;
				return set[1][i] || null;
			}
			return null;
		},
		set: function (args) {
			var index = 0, set = map, i, length = args.length;
			if (length === 0) {
				set[length] = ++lastId;
			} else {
				if (!set[length]) {
					set[length] = [[], []];
				}
				set = set[length];
				while (index < (length - 1)) {
					i = indexOf.call(set[0], args[index]);
					if (i === -1) {
						i = set[0].push(args[index]) - 1;
						set[1].push([[], []]);
					}
					set = set[1][i];
					++index;
				}
				i = indexOf.call(set[0], args[index]);
				if (i === -1) {
					i = set[0].push(args[index]) - 1;
				}
				set[1][i] = ++lastId;
			}
			cache[lastId] = args;
			return lastId;
		},
		delete: function (id) {
			var index = 0, set = map, i, args = cache[id], length = args.length
			  , path = [];
			if (length === 0) {
				delete set[length];
			} else if ((set = set[length])) {
				while (index < (length - 1)) {
					i = indexOf.call(set[0], args[index]);
					if (i === -1) {
						return;
					}
					path.push(set, i);
					set = set[1][i];
					++index;
				}
				i = indexOf.call(set[0], args[index]);
				if (i === -1) {
					return;
				}
				id = set[1][i];
				set[0].splice(i, 1);
				set[1].splice(i, 1);
				while (!set[0].length && path.length) {
					i = path.pop();
					set = path.pop();
					set[0].splice(i, 1);
					set[1].splice(i, 1);
				}
			}
			delete cache[id];
		},
		clear: function () {
			map = [];
			cache = create(null);
		}
	};
};

},{"es5-ext/array/#/e-index-of":36}],126:[function(require,module,exports){
'use strict';

module.exports = function (args) {
	var id, i, length = args.length;
	if (!length) return '\u0002';
	id = String(args[i = 0]);
	while (--length) id += '\u0001' + args[++i];
	return id;
};

},{}],127:[function(require,module,exports){
'use strict';

var callable      = require('es5-ext/object/valid-callable')
  , forEach       = require('es5-ext/object/for-each')
  , extensions    = require('./lib/registered-extensions')
  , configure     = require('./lib/configure-map')
  , resolveLength = require('./lib/resolve-length')

  , hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = function self(fn/*, options */) {
	var options, length, conf;

	callable(fn);
	options = Object(arguments[1]);

	// Do not memoize already memoized function
	if (hasOwnProperty.call(fn, '__memoized__') && !options.force) return fn;

	// Resolve length;
	length = resolveLength(options.length, fn.length, options.async && extensions.async);

	// Configure cache map
	conf = configure(fn, length, options);

	// Bind eventual extensions
	forEach(extensions, function (fn, name) {
		if (options[name]) fn(options[name], conf, options);
	});

	if (self.__profiler__) self.__profiler__(conf);

	conf.updateEnv();
	return conf.memoized;
};

},{"./lib/configure-map":115,"./lib/registered-extensions":117,"./lib/resolve-length":118,"es5-ext/object/for-each":66,"es5-ext/object/valid-callable":80}],128:[function(require,module,exports){
(function (process){
'use strict';

var callable, byObserver;

callable = function (fn) {
	if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
	return fn;
};

byObserver = function (Observer) {
	var node = document.createTextNode(''), queue, i = 0;
	new Observer(function () {
		var data;
		if (!queue) return;
		data = queue;
		queue = null;
		if (typeof data === 'function') {
			data();
			return;
		}
		data.forEach(function (fn) { fn(); });
	}).observe(node, { characterData: true });
	return function (fn) {
		callable(fn);
		if (queue) {
			if (typeof queue === 'function') queue = [queue, fn];
			else queue.push(fn);
			return;
		}
		queue = fn;
		node.data = (i = ++i % 2);
	};
};

module.exports = (function () {
	// Node.js
	if ((typeof process !== 'undefined') && process &&
			(typeof process.nextTick === 'function')) {
		return process.nextTick;
	}

	// MutationObserver=
	if ((typeof document === 'object') && document) {
		if (typeof MutationObserver === 'function') {
			return byObserver(MutationObserver);
		}
		if (typeof WebKitMutationObserver === 'function') {
			return byObserver(WebKitMutationObserver);
		}
	}

	// W3C Draft
	// http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html
	if (typeof setImmediate === 'function') {
		return function (cb) { setImmediate(callable(cb)); };
	}

	// Wide available standard
	if (typeof setTimeout === 'function') {
		return function (cb) { setTimeout(callable(cb), 0); };
	}

	return null;
}());

}).call(this,require('_process'))

},{"_process":129}],129:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],130:[function(require,module,exports){
'use strict';

module.exports = 2147483647;

},{}],131:[function(require,module,exports){
'use strict';

var toPosInt   = require('es5-ext/number/to-pos-integer')
  , maxTimeout = require('./max-timeout');

module.exports = function (value) {
	value = toPosInt(value);
	if (value > maxTimeout) throw new TypeError(value + " exceeds maximum possible timeout");
	return value;
};

},{"./max-timeout":130,"es5-ext/number/to-pos-integer":58}],132:[function(require,module,exports){
"use strict";function assert(e){var r=arguments.length<=1||void 0===arguments[1]?"predicate failure.":arguments[1];if(!e){var t=new Error(""+r);throw t.name="Assertion Exception",t}}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=assert;

},{}],133:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),_get=function e(t,r,n){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,r);if(void 0===o){var a=Object.getPrototypeOf(t);return null===a?void 0:e(a,r,n)}if("value"in o)return o.value;var i=o.get;if(void 0!==i)return i.call(n)},_TableBasedEncoder2=require("./TableBasedEncoder"),_TableBasedEncoder3=_interopRequireDefault(_TableBasedEncoder2),_Base16LowerCaseTable=require("../tables/Base16LowerCaseTable"),Base16Decoder=function(e){function t(){var e=arguments.length<=0||void 0===arguments[0]?_Base16LowerCaseTable.BASE16_LOWER_CASE_DECODE_TABLE:arguments[0];return _classCallCheck(this,t),_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this,e,new Uint8Array(2)))}return _inherits(t,e),_createClass(t,[{key:"_initOutput",value:function(e){return new Uint8Array(e.length>>>1)}},{key:"_transchunk",value:function(e,t,r){for(var n=0;n+2<=e.length;n+=2){var o=this._table[127&e[n]],a=this._table[127&e[n+1]];if(0>o||0>a)throw new Error("outof base16 character range. { offset=["+n+","+(n+1)+"], character=["+e[n]+","+e[n+1]+"] }");t[r++]=o<<4|a}return r}},{key:"final",value:function(){if(1&this._buffer.offset)throw new Error("wrong size of base16 final chunk. { buffer=["+this._buffer.buffer+"], offset="+this._buffer.offset+" }");return _get(Object.getPrototypeOf(t.prototype),"final",this).call(this)}}]),t}(_TableBasedEncoder3["default"]);exports["default"]=Base16Decoder;

},{"../tables/Base16LowerCaseTable":150,"./TableBasedEncoder":135}],134:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),_TableBasedEncoder2=require("./TableBasedEncoder"),_TableBasedEncoder3=_interopRequireDefault(_TableBasedEncoder2),_Base16LowerCaseTable=require("../tables/Base16LowerCaseTable"),Base16Encoder=function(e){function t(){var e=arguments.length<=0||void 0===arguments[0]?_Base16LowerCaseTable.BASE16_LOWER_CASE_ENCODE_TABLE:arguments[0];return _classCallCheck(this,t),_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this,e))}return _inherits(t,e),_createClass(t,[{key:"_initOutput",value:function(e){return new Uint8Array(e.length<<1>>>0)}},{key:"_transchunk",value:function(e,t,r){for(var n=0;n<e.length;++n)t[r++]=this._table[e[n]>>>4&15],t[r++]=this._table[15&e[n]];return r}}]),t}(_TableBasedEncoder3["default"]);exports["default"]=Base16Encoder;

},{"../tables/Base16LowerCaseTable":150,"./TableBasedEncoder":135}],135:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),_Sharedable2=require("../core/Sharedable"),_Sharedable3=_interopRequireDefault(_Sharedable2),TableBasedEncoder=function(e){function t(){var e=arguments.length<=0||void 0===arguments[0]?null:arguments[0],r=arguments.length<=1||void 0===arguments[1]?null:arguments[1];_classCallCheck(this,t);var n=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this,r));return n._table=e,n}return _inherits(t,e),_createClass(t,[{key:"table",get:function(){return this._table},set:function(e){this._table=e}}]),t}(_Sharedable3["default"]);exports["default"]=TableBasedEncoder;

},{"../core/Sharedable":137}],136:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var f=0;f<t.length;f++){var n=t[f];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,f,n){return f&&e(t.prototype,f),n&&e(t,n),t}}(),_copy=require("../utils/copy"),_copy2=_interopRequireDefault(_copy),DataBuffer=function(){function e(t){_classCallCheck(this,e),this._buffer=t,this._offset=0,this._length=this._buffer.length}return _createClass(e,[{key:"reset",value:function(){this._offset=0}},{key:"restore",value:function(e){e.length>=this._length-this._offset?(this._offset=this._length>0?(this._offset+e.length)%this._length:0,this._offset&&(0,_copy2["default"])(e.subarray(-this._offset),this._buffer,0)):e.length>0&&this._length>0&&((0,_copy2["default"])(e,this._buffer,this._offset),this._offset+=e.length)}},{key:"buffer",get:function(){return this._buffer}},{key:"length",get:function(){return this._length}},{key:"offset",get:function(){return this._offset}},{key:"remain",get:function(){return this._length-this._offset}}]),e}();exports["default"]=DataBuffer;

},{"../utils/copy":160}],137:[function(require,module,exports){
"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{"default":t}}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),_get=function t(e,r,n){null===e&&(e=Function.prototype);var o=Object.getOwnPropertyDescriptor(e,r);if(void 0===o){var u=Object.getPrototypeOf(e);return null===u?void 0:t(u,r,n)}if("value"in o)return o.value;var i=o.get;if(void 0!==i)return i.call(n)},_Streamable2=require("./Streamable"),_Streamable3=_interopRequireDefault(_Streamable2),EMPTY_UINT8_ARRAY=new Uint8Array(0),Sharedable=function(t){function e(){var t=arguments.length<=0||void 0===arguments[0]?null:arguments[0],r=arguments.length<=1||void 0===arguments[1]?null:arguments[1];_classCallCheck(this,e);var n=_possibleConstructorReturn(this,Object.getPrototypeOf(e).call(this,t));return n._shared=r,n._offset=0,n._output=null,n}return _inherits(e,t),_createClass(e,[{key:"_initOutput",value:function(t){throw new Error("method does not implements.")}},{key:"_transfrom",value:function(t){this._offset=this._transchunk(t,this._output,this._offset)}},{key:"_transchunk",value:function(t,e,r){return r}},{key:"update",value:function(t){return this._output=this._shared||this._initOutput(t),this._offset=0,_get(Object.getPrototypeOf(e.prototype),"update",this).call(this,t),this._output===this._shared?this._shared.subarray(0,this._offset):this._output}},{key:"final",value:function(){return EMPTY_UINT8_ARRAY}},{key:"shared",get:function(){return this._shared},set:function(t){this._shared=t}}]),e}(_Streamable3["default"]);exports["default"]=Sharedable;

},{"./Streamable":138}],138:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var f=t[r];f.enumerable=f.enumerable||!1,f.configurable=!0,"value"in f&&(f.writable=!0),Object.defineProperty(e,f.key,f)}}return function(t,r,f){return r&&e(t.prototype,r),f&&e(t,f),t}}(),_DataBuffer=require("./DataBuffer"),_DataBuffer2=_interopRequireDefault(_DataBuffer),_copy=require("../utils/copy"),_copy2=_interopRequireDefault(_copy),Streamable=function(){function e(){var t=arguments.length<=0||void 0===arguments[0]?null:arguments[0];_classCallCheck(this,e),this._buffer=t?new _DataBuffer2["default"](t):null}return _createClass(e,[{key:"_transfrom",value:function(e){throw new Error("method does not implements.")}},{key:"final",value:function(){throw new Error("method does not implements.")}},{key:"update",value:function(e){return this._buffer&&this._buffer.length>0?(e.length>=this._buffer.remain&&(0!=this._buffer.offset?((0,_copy2["default"])(e,this._buffer.buffer,this._buffer.offset),e=e.subarray(this._buffer.remain),this._transfrom(e),this._transfrom(this._buffer.buffer)):this._transfrom(e)),void this._buffer.restore(e)):void this._transfrom(e)}},{key:"reset",value:function(){this._buffer&&this._buffer.reset()}}]),e}();exports["default"]=Streamable;

},{"../utils/copy":160,"./DataBuffer":136}],139:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),_Streamable2=require("../core/Streamable"),_Streamable3=_interopRequireDefault(_Streamable2),CRC1=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this,null));return e._digest=0,e}return _inherits(t,e),_createClass(t,[{key:"reset",value:function(){this._digest=0}},{key:"update",value:function(e){for(var t=0;t<e.length;++t)this._digest=this._digest+e[t]&255}},{key:"final",value:function(){return this._digest>>>0}}]),t}(_Streamable3["default"]);exports["default"]=CRC1;

},{"../core/Streamable":138}],140:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),_Streamable2=require("../core/Streamable"),_Streamable3=_interopRequireDefault(_Streamable2),_CRC16DefaultTable=require("../tables/CRC16DefaultTable"),CRC16=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this,null));return e._digest=0,e._table=_CRC16DefaultTable.CRC16_DEFAULT_TABLE,e}return _inherits(t,e),_createClass(t,[{key:"reset",value:function(){this._digest=0}},{key:"update",value:function(e){for(var t=0;t<e.length;++t)this._digest=65535&(this._table[255&(this._digest^e[t])]^this._digest>>8)}},{key:"final",value:function(){return this._digest>>>0}}]),t}(_Streamable3["default"]);exports["default"]=CRC16;

},{"../core/Streamable":138,"../tables/CRC16DefaultTable":152}],141:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),_Streamable2=require("../core/Streamable"),_Streamable3=_interopRequireDefault(_Streamable2),_CRC16CCITTTable=require("../tables/CRC16CCITTTable"),CRC16CCITT=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this,null));return e._digest=65535,e._table=_CRC16CCITTTable.CRC16_CCITT_TABLE,e}return _inherits(t,e),_createClass(t,[{key:"reset",value:function(){this._digest=65535}},{key:"update",value:function(e){for(var t=0;t<e.length;++t)this._digest=65535&(this._table[255&(this._digest>>8^e[t])]^this._digest<<8)}},{key:"final",value:function(){return this._digest>>>0}}]),t}(_Streamable3["default"]);exports["default"]=CRC16CCITT;

},{"../core/Streamable":138,"../tables/CRC16CCITTTable":151}],142:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),_Streamable2=require("../core/Streamable"),_Streamable3=_interopRequireDefault(_Streamable2),_CRC16KermitTable=require("../tables/CRC16KermitTable"),CRC16Kermit=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this,null));return e._digest=0,e._table=_CRC16KermitTable.CRC16_KERMIT_TABLE,e}return _inherits(t,e),_createClass(t,[{key:"reset",value:function(){this._digest=0}},{key:"update",value:function(e){for(var t=0;t<e.length;++t)this._digest=65535&(this._table[255&(this._digest^e[t])]^this._digest>>8)}},{key:"final",value:function(){return this._digest>>>0}}]),t}(_Streamable3["default"]);exports["default"]=CRC16Kermit;

},{"../core/Streamable":138,"../tables/CRC16KermitTable":153}],143:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),_Streamable2=require("../core/Streamable"),_Streamable3=_interopRequireDefault(_Streamable2),_CRC16ModBusTable=require("../tables/CRC16ModBusTable"),CRC16ModBus=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this,null));return e._digest=65535,e._table=_CRC16ModBusTable.CRC16_MODBUS_TABLE,e}return _inherits(t,e),_createClass(t,[{key:"reset",value:function(){this._digest=65535}},{key:"update",value:function(e){for(var t=0;t<e.length;++t)this._digest=65535&(this._table[255&(this._digest^e[t])]^this._digest>>8)}},{key:"final",value:function(){return this._digest>>>0}}]),t}(_Streamable3["default"]);exports["default"]=CRC16ModBus;

},{"../core/Streamable":138,"../tables/CRC16ModBusTable":154}],144:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),_Streamable2=require("../core/Streamable"),_Streamable3=_interopRequireDefault(_Streamable2),CRC16XModem=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this,null));return e._digest=0,e}return _inherits(t,e),_createClass(t,[{key:"reset",value:function(){this._digest=0}},{key:"update",value:function(e){for(var t=0;t<e.length;++t){var r=this._digest>>>8&255;r^=255&e[t],r^=r>>>4,this._digest=this._digest<<8&65535,this._digest^=r,r=r<<5&65535,this._digest^=r,r=r<<7&65535,this._digest^=r}}},{key:"final",value:function(){return this._digest>>>0}}]),t}(_Streamable3["default"]);exports["default"]=CRC16XModem;

},{"../core/Streamable":138}],145:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),_Streamable2=require("../core/Streamable"),_Streamable3=_interopRequireDefault(_Streamable2),_CRC24DefaultTable=require("../tables/CRC24DefaultTable"),CRC24=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this,null));return e._digest=11994318,e._table=_CRC24DefaultTable.CRC24_DEFAULT_TABLE,e}return _inherits(t,e),_createClass(t,[{key:"reset",value:function(){this._digest=11994318}},{key:"update",value:function(e){for(var t=0;t<e.length;++t)this._digest=16777215&(this._table[255&(this._digest>>16^e[t])]^this._digest<<8)}},{key:"final",value:function(){return this._digest>>>0}}]),t}(_Streamable3["default"]);exports["default"]=CRC24;

},{"../core/Streamable":138,"../tables/CRC24DefaultTable":155}],146:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),_Streamable2=require("../core/Streamable"),_Streamable3=_interopRequireDefault(_Streamable2),_CRC32DefaultTable=require("../tables/CRC32DefaultTable"),CRC32=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this,null));return e._digest=0,e._table=_CRC32DefaultTable.CRC32_DEFAULT_TABLE,e}return _inherits(t,e),_createClass(t,[{key:"reset",value:function(){this._digest=0}},{key:"update",value:function(e){for(var t=-1^this._digest,r=0;r<e.length;++r)t=this._table[255&(t^e[r])]^t>>>8;this._digest=-1^t}},{key:"final",value:function(){return this._digest>>>0}}]),t}(_Streamable3["default"]);exports["default"]=CRC32;

},{"../core/Streamable":138,"../tables/CRC32DefaultTable":156}],147:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),_Streamable2=require("../core/Streamable"),_Streamable3=_interopRequireDefault(_Streamable2),_CRC8DefaultTable=require("../tables/CRC8DefaultTable"),CRC8=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this,null));return e._digest=0,e._table=_CRC8DefaultTable.CRC8_DEFAULT_TABLE,e}return _inherits(t,e),_createClass(t,[{key:"reset",value:function(){this._digest=0}},{key:"update",value:function(e){for(var t=0;t<e.length;++t)this._digest=255&this._table[255&(this._digest^e[t])]}},{key:"final",value:function(){return this._digest>>>0}}]),t}(_Streamable3["default"]);exports["default"]=CRC8;

},{"../core/Streamable":138,"../tables/CRC8DefaultTable":158}],148:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),_Streamable2=require("../core/Streamable"),_Streamable3=_interopRequireDefault(_Streamable2),_CRC8Dallas1WireTable=require("../tables/CRC8Dallas1WireTable"),CRC8Dallas1Wire=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this,null));return e._digest=0,e._table=_CRC8Dallas1WireTable.CRC8_DALLAS_1_WIRE_TABLE,e}return _inherits(t,e),_createClass(t,[{key:"reset",value:function(){this._digest=0}},{key:"update",value:function(e){for(var t=0;t<e.length;++t)this._digest=255&this._table[255&(this._digest^e[t])]}},{key:"final",value:function(){return this._digest>>>0}}]),t}(_Streamable3["default"]);exports["default"]=CRC8Dallas1Wire;

},{"../core/Streamable":138,"../tables/CRC8Dallas1WireTable":157}],149:[function(require,module,exports){
"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{"default":t}}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function FF(t,e,n,i,r,o,g){return t+=(e&n|~e&i)+r+g,t=t<<o|t>>>32-o,t+e}function GG(t,e,n,i,r,o,g){return t+=(e&i|n&~i)+r+g,t=t<<o|t>>>32-o,t+e}function HH(t,e,n,i,r,o,g){return t+=(e^n^i)+r+g,t=t<<o|t>>>32-o,t+e}function II(t,e,n,i,r,o,g){return t+=(n^(e|~i))+r+g,t=t<<o|t>>>32-o,t+e}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),_get=function t(e,n,i){null===e&&(e=Function.prototype);var r=Object.getOwnPropertyDescriptor(e,n);if(void 0===r){var o=Object.getPrototypeOf(e);return null===o?void 0:t(o,n,i)}if("value"in r)return r.value;var g=r.get;if(void 0!==g)return g.call(i)},_Streamable2=require("../core/Streamable"),_Streamable3=_interopRequireDefault(_Streamable2),_copy=require("../utils/copy"),_copy2=_interopRequireDefault(_copy),H1=1732584193,H2=4023233417,H3=2562383102,H4=271733878,PADDING=new Uint8Array([128,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),APPENDIX=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),MD5=function(t){function e(){_classCallCheck(this,e);var t=_possibleConstructorReturn(this,Object.getPrototypeOf(e).call(this,new Uint8Array(64)));return t._length=new Uint32Array(2),t._digest=new Uint32Array([H1,H2,H3,H4]),t}return _inherits(e,t),_createClass(e,[{key:"reset",value:function(){_get(Object.getPrototypeOf(e.prototype),"reset",this).call(this),this._length[0]=this._length[1]=0,this._digest[0]=H1,this._digest[1]=H2,this._digest[2]=H3,this._digest[3]=H4}},{key:"update",value:function(t){var n=t.length<<3>>>0,i=t.length>>>29;return this._length[0]+=n,this._length[1]+=this._length[0]<n?1+i:i,_get(Object.getPrototypeOf(e.prototype),"update",this).call(this,t),this}},{key:"final",value:function(){var t=this._buffer.buffer,e=this._buffer.offset;return(0,_copy2["default"])(PADDING,t,e),56>e?((0,_copy2["default"])(new Uint8Array(this._length.buffer),t,56),this._transfrom(t)):((0,_copy2["default"])(new Uint8Array(this._length.buffer),APPENDIX,56),this._transfrom(t),this._transfrom(APPENDIX)),this._digest}},{key:"_transfrom",value:function(t){for(var e=new DataView(t.buffer,t.byteOffset),n=0;n+64<=t.length;n+=64){var i=this._digest[0],r=this._digest[1],o=this._digest[2],g=this._digest[3];i=FF(i,r,o,g,e.getUint32(n+0,!0),7,3614090360),g=FF(g,i,r,o,e.getUint32(n+4,!0),12,3905402710),o=FF(o,g,i,r,e.getUint32(n+8,!0),17,606105819),r=FF(r,o,g,i,e.getUint32(n+12,!0),22,3250441966),i=FF(i,r,o,g,e.getUint32(n+16,!0),7,4118548399),g=FF(g,i,r,o,e.getUint32(n+20,!0),12,1200080426),o=FF(o,g,i,r,e.getUint32(n+24,!0),17,2821735955),r=FF(r,o,g,i,e.getUint32(n+28,!0),22,4249261313),i=FF(i,r,o,g,e.getUint32(n+32,!0),7,1770035416),g=FF(g,i,r,o,e.getUint32(n+36,!0),12,2336552879),o=FF(o,g,i,r,e.getUint32(n+40,!0),17,4294925233),r=FF(r,o,g,i,e.getUint32(n+44,!0),22,2304563134),i=FF(i,r,o,g,e.getUint32(n+48,!0),7,1804603682),g=FF(g,i,r,o,e.getUint32(n+52,!0),12,4254626195),o=FF(o,g,i,r,e.getUint32(n+56,!0),17,2792965006),r=FF(r,o,g,i,e.getUint32(n+60,!0),22,1236535329),i=GG(i,r,o,g,e.getUint32(n+4,!0),5,4129170786),g=GG(g,i,r,o,e.getUint32(n+24,!0),9,3225465664),o=GG(o,g,i,r,e.getUint32(n+44,!0),14,643717713),r=GG(r,o,g,i,e.getUint32(n+0,!0),20,3921069994),i=GG(i,r,o,g,e.getUint32(n+20,!0),5,3593408605),g=GG(g,i,r,o,e.getUint32(n+40,!0),9,38016083),o=GG(o,g,i,r,e.getUint32(n+60,!0),14,3634488961),r=GG(r,o,g,i,e.getUint32(n+16,!0),20,3889429448),i=GG(i,r,o,g,e.getUint32(n+36,!0),5,568446438),g=GG(g,i,r,o,e.getUint32(n+56,!0),9,3275163606),o=GG(o,g,i,r,e.getUint32(n+12,!0),14,4107603335),r=GG(r,o,g,i,e.getUint32(n+32,!0),20,1163531501),i=GG(i,r,o,g,e.getUint32(n+52,!0),5,2850285829),g=GG(g,i,r,o,e.getUint32(n+8,!0),9,4243563512),o=GG(o,g,i,r,e.getUint32(n+28,!0),14,1735328473),r=GG(r,o,g,i,e.getUint32(n+48,!0),20,2368359562),i=HH(i,r,o,g,e.getUint32(n+20,!0),4,4294588738),g=HH(g,i,r,o,e.getUint32(n+32,!0),11,2272392833),o=HH(o,g,i,r,e.getUint32(n+44,!0),16,1839030562),r=HH(r,o,g,i,e.getUint32(n+56,!0),23,4259657740),i=HH(i,r,o,g,e.getUint32(n+4,!0),4,2763975236),g=HH(g,i,r,o,e.getUint32(n+16,!0),11,1272893353),o=HH(o,g,i,r,e.getUint32(n+28,!0),16,4139469664),r=HH(r,o,g,i,e.getUint32(n+40,!0),23,3200236656),i=HH(i,r,o,g,e.getUint32(n+52,!0),4,681279174),g=HH(g,i,r,o,e.getUint32(n+0,!0),11,3936430074),o=HH(o,g,i,r,e.getUint32(n+12,!0),16,3572445317),r=HH(r,o,g,i,e.getUint32(n+24,!0),23,76029189),i=HH(i,r,o,g,e.getUint32(n+36,!0),4,3654602809),g=HH(g,i,r,o,e.getUint32(n+48,!0),11,3873151461),o=HH(o,g,i,r,e.getUint32(n+60,!0),16,530742520),r=HH(r,o,g,i,e.getUint32(n+8,!0),23,3299628645),i=II(i,r,o,g,e.getUint32(n+0,!0),6,4096336452),g=II(g,i,r,o,e.getUint32(n+28,!0),10,1126891415),o=II(o,g,i,r,e.getUint32(n+56,!0),15,2878612391),r=II(r,o,g,i,e.getUint32(n+20,!0),21,4237533241),i=II(i,r,o,g,e.getUint32(n+48,!0),6,1700485571),g=II(g,i,r,o,e.getUint32(n+12,!0),10,2399980690),o=II(o,g,i,r,e.getUint32(n+40,!0),15,4293915773),r=II(r,o,g,i,e.getUint32(n+4,!0),21,2240044497),i=II(i,r,o,g,e.getUint32(n+32,!0),6,1873313359),g=II(g,i,r,o,e.getUint32(n+60,!0),10,4264355552),o=II(o,g,i,r,e.getUint32(n+24,!0),15,2734768916),r=II(r,o,g,i,e.getUint32(n+52,!0),21,1309151649),i=II(i,r,o,g,e.getUint32(n+16,!0),6,4149444226),g=II(g,i,r,o,e.getUint32(n+44,!0),10,3174756917),o=II(o,g,i,r,e.getUint32(n+8,!0),15,718787259),r=II(r,o,g,i,e.getUint32(n+36,!0),21,3951481745),this._digest[0]+=i,this._digest[1]+=r,this._digest[2]+=o,this._digest[3]+=g}}}]),e}(_Streamable3["default"]);exports["default"]=MD5;

},{"../core/Streamable":138,"../utils/copy":160}],150:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var BASE16_LOWER_CASE_ENCODE_TABLE=exports.BASE16_LOWER_CASE_ENCODE_TABLE=new Int8Array([48,49,50,51,52,53,54,55,56,57,97,98,99,100,101,102]),BASE16_LOWER_CASE_DECODE_TABLE=exports.BASE16_LOWER_CASE_DECODE_TABLE=new Int8Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,11,12,13,14,15,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);

},{}],151:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var CRC16_CCITT_TABLE=exports.CRC16_CCITT_TABLE=new Uint16Array([0,4129,8258,12387,16516,20645,24774,28903,33032,37161,41290,45419,49548,53677,57806,61935,4657,528,12915,8786,21173,17044,29431,25302,37689,33560,45947,41818,54205,50076,62463,58334,9314,13379,1056,5121,25830,29895,17572,21637,42346,46411,34088,38153,58862,62927,50604,54669,13907,9842,5649,1584,30423,26358,22165,18100,46939,42874,38681,34616,63455,59390,55197,51132,18628,22757,26758,30887,2112,6241,10242,14371,51660,55789,59790,63919,35144,39273,43274,47403,23285,19156,31415,27286,6769,2640,14899,10770,56317,52188,64447,60318,39801,35672,47931,43802,27814,31879,19684,23749,11298,15363,3168,7233,60846,64911,52716,56781,44330,48395,36200,40265,32407,28342,24277,20212,15891,11826,7761,3696,65439,61374,57309,53244,48923,44858,40793,36728,37256,33193,45514,41451,53516,49453,61774,57711,4224,161,12482,8419,20484,16421,28742,24679,33721,37784,41979,46042,49981,54044,58239,62302,689,4752,8947,13010,16949,21012,25207,29270,46570,42443,38312,34185,62830,58703,54572,50445,13538,9411,5280,1153,29798,25671,21540,17413,42971,47098,34713,38840,59231,63358,50973,55100,9939,14066,1681,5808,26199,30326,17941,22068,55628,51565,63758,59695,39368,35305,47498,43435,22596,18533,30726,26663,6336,2273,14466,10403,52093,56156,60223,64286,35833,39896,43963,48026,19061,23124,27191,31254,2801,6864,10931,14994,64814,60687,56684,52557,48554,44427,40424,36297,31782,27655,23652,19525,15522,11395,7392,3265,61215,65342,53085,57212,44955,49082,36825,40952,28183,32310,20053,24180,11923,16050,3793,7920]);

},{}],152:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var CRC16_DEFAULT_TABLE=exports.CRC16_DEFAULT_TABLE=new Uint16Array([0,49345,49537,320,49921,960,640,49729,50689,1728,1920,51009,1280,50625,50305,1088,52225,3264,3456,52545,3840,53185,52865,3648,2560,51905,52097,2880,51457,2496,2176,51265,55297,6336,6528,55617,6912,56257,55937,6720,7680,57025,57217,8e3,56577,7616,7296,56385,5120,54465,54657,5440,55041,6080,5760,54849,53761,4800,4992,54081,4352,53697,53377,4160,61441,12480,12672,61761,13056,62401,62081,12864,13824,63169,63361,14144,62721,13760,13440,62529,15360,64705,64897,15680,65281,16320,16e3,65089,64001,15040,15232,64321,14592,63937,63617,14400,10240,59585,59777,10560,60161,11200,10880,59969,60929,11968,12160,61249,11520,60865,60545,11328,58369,9408,9600,58689,9984,59329,59009,9792,8704,58049,58241,9024,57601,8640,8320,57409,40961,24768,24960,41281,25344,41921,41601,25152,26112,42689,42881,26432,42241,26048,25728,42049,27648,44225,44417,27968,44801,28608,28288,44609,43521,27328,27520,43841,26880,43457,43137,26688,30720,47297,47489,31040,47873,31680,31360,47681,48641,32448,32640,48961,32e3,48577,48257,31808,46081,29888,30080,46401,30464,47041,46721,30272,29184,45761,45953,29504,45313,29120,28800,45121,20480,37057,37249,20800,37633,21440,21120,37441,38401,22208,22400,38721,21760,38337,38017,21568,39937,23744,23936,40257,24320,40897,40577,24128,23040,39617,39809,23360,39169,22976,22656,38977,34817,18624,18816,35137,19200,35777,35457,19008,19968,36545,36737,20288,36097,19904,19584,35905,17408,33985,34177,17728,34561,18368,18048,34369,33281,17088,17280,33601,16640,33217,32897,16448]);

},{}],153:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var CRC16_KERMIT_TABLE=exports.CRC16_KERMIT_TABLE=new Uint16Array([0,4489,8978,12955,17956,22445,25910,29887,35912,40385,44890,48851,51820,56293,59774,63735,4225,264,13203,8730,22181,18220,30135,25662,40137,36160,49115,44626,56045,52068,63999,59510,8450,12427,528,5017,26406,30383,17460,21949,44362,48323,36440,40913,60270,64231,51324,55797,12675,8202,4753,792,30631,26158,21685,17724,48587,44098,40665,36688,64495,60006,55549,51572,16900,21389,24854,28831,1056,5545,10034,14011,52812,57285,60766,64727,34920,39393,43898,47859,21125,17164,29079,24606,5281,1320,14259,9786,57037,53060,64991,60502,39145,35168,48123,43634,25350,29327,16404,20893,9506,13483,1584,6073,61262,65223,52316,56789,43370,47331,35448,39921,29575,25102,20629,16668,13731,9258,5809,1848,65487,60998,56541,52564,47595,43106,39673,35696,33800,38273,42778,46739,49708,54181,57662,61623,2112,6601,11090,15067,20068,24557,28022,31999,38025,34048,47003,42514,53933,49956,61887,57398,6337,2376,15315,10842,24293,20332,32247,27774,42250,46211,34328,38801,58158,62119,49212,53685,10562,14539,2640,7129,28518,32495,19572,24061,46475,41986,38553,34576,62383,57894,53437,49460,14787,10314,6865,2904,32743,28270,23797,19836,50700,55173,58654,62615,32808,37281,41786,45747,19012,23501,26966,30943,3168,7657,12146,16123,54925,50948,62879,58390,37033,33056,46011,41522,23237,19276,31191,26718,7393,3432,16371,11898,59150,63111,50204,54677,41258,45219,33336,37809,27462,31439,18516,23005,11618,15595,3696,8185,63375,58886,54429,50452,45483,40994,37561,33584,31687,27214,22741,18780,15843,11370,7921,3960]);

},{}],154:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var CRC16_MODBUS_TABLE=exports.CRC16_MODBUS_TABLE=new Uint16Array([0,49345,49537,320,49921,960,640,49729,50689,1728,1920,51009,1280,50625,50305,1088,52225,3264,3456,52545,3840,53185,52865,3648,2560,51905,52097,2880,51457,2496,2176,51265,55297,6336,6528,55617,6912,56257,55937,6720,7680,57025,57217,8e3,56577,7616,7296,56385,5120,54465,54657,5440,55041,6080,5760,54849,53761,4800,4992,54081,4352,53697,53377,4160,61441,12480,12672,61761,13056,62401,62081,12864,13824,63169,63361,14144,62721,13760,13440,62529,15360,64705,64897,15680,65281,16320,16e3,65089,64001,15040,15232,64321,14592,63937,63617,14400,10240,59585,59777,10560,60161,11200,10880,59969,60929,11968,12160,61249,11520,60865,60545,11328,58369,9408,9600,58689,9984,59329,59009,9792,8704,58049,58241,9024,57601,8640,8320,57409,40961,24768,24960,41281,25344,41921,41601,25152,26112,42689,42881,26432,42241,26048,25728,42049,27648,44225,44417,27968,44801,28608,28288,44609,43521,27328,27520,43841,26880,43457,43137,26688,30720,47297,47489,31040,47873,31680,31360,47681,48641,32448,32640,48961,32e3,48577,48257,31808,46081,29888,30080,46401,30464,47041,46721,30272,29184,45761,45953,29504,45313,29120,28800,45121,20480,37057,37249,20800,37633,21440,21120,37441,38401,22208,22400,38721,21760,38337,38017,21568,39937,23744,23936,40257,24320,40897,40577,24128,23040,39617,39809,23360,39169,22976,22656,38977,34817,18624,18816,35137,19200,35777,35457,19008,19968,36545,36737,20288,36097,19904,19584,35905,17408,33985,34177,17728,34561,18368,18048,34369,33281,17088,17280,33601,16640,33217,32897,16448]);

},{}],155:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var CRC24_DEFAULT_TABLE=exports.CRC24_DEFAULT_TABLE=new Uint32Array([0,8801531,9098509,825846,9692897,1419802,1651692,10452759,10584377,2608578,2839604,11344079,3303384,11807523,12104405,4128302,12930697,4391538,5217156,13227903,5679208,13690003,14450021,5910942,6606768,14844747,15604413,6837830,16197969,7431594,8256604,16494759,840169,9084178,8783076,18463,10434312,1670131,1434117,9678590,11358416,2825259,2590173,10602790,4109873,12122826,11821884,3289031,13213536,5231515,4409965,12912278,5929345,14431610,13675660,5693559,6823513,15618722,14863188,6588335,16513208,8238147,7417269,16212302,1680338,10481449,9664223,1391140,9061683,788936,36926,8838341,12067563,4091408,3340262,11844381,2868234,11372785,10555655,2579964,14478683,5939616,5650518,13661357,5180346,13190977,12967607,4428364,8219746,16457881,16234863,7468436,15633027,6866552,6578062,14816117,1405499,9649856,10463030,1698765,8819930,55329,803287,9047340,11858690,3325945,4072975,12086004,2561507,10574104,11387118,2853909,13647026,5664841,5958079,14460228,4446803,12949160,13176670,5194661,7454091,16249200,16476294,8201341,14834538,6559633,6852199,15647388,3360676,11864927,12161705,4185682,10527045,2551230,2782280,11286707,9619101,1346150,1577872,10379115,73852,8875143,9172337,899466,16124205,7357910,8182816,16421083,6680524,14918455,15678145,6911546,5736468,13747439,14507289,5968354,12873461,4334094,5159928,13170435,4167245,12180150,11879232,3346363,11301036,2767959,2532769,10545498,10360692,1596303,1360505,9604738,913813,9157998,8856728,92259,16439492,8164415,7343561,16138546,6897189,15692510,14936872,6662099,5986813,14488838,13733104,5750795,13156124,5174247,4352529,12855018,2810998,11315341,10498427,2522496,12124823,4148844,3397530,11901793,9135439,862644,110658,8912057,1606574,10407765,9590435,1317464,15706879,6940164,6651890,14889737,8145950,16384229,16161043,7394792,5123014,13133629,12910283,4370992,14535975,5997020,5707818,13718737,2504095,10516836,11329682,2796649,11916158,3383173,4130419,12143240,8893606,129117,876971,9121104,1331783,9576124,10389322,1625009,14908182,6633453,6925851,15721184,7380471,16175372,16402682,8127489,4389423,12891860,13119266,5137369,13704398,5722165,6015427,14517560]);

},{}],156:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var CRC32_DEFAULT_TABLE=exports.CRC32_DEFAULT_TABLE=new Uint32Array([0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117]);

},{}],157:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var CRC8_DALLAS_1_WIRE_TABLE=exports.CRC8_DALLAS_1_WIRE_TABLE=new Uint8Array([0,94,188,226,97,63,221,131,194,156,126,32,163,253,31,65,157,195,33,127,252,162,64,30,95,1,227,189,62,96,130,220,35,125,159,193,66,28,254,160,225,191,93,3,128,222,60,98,190,224,2,92,223,129,99,61,124,34,192,158,29,67,161,255,70,24,250,164,39,121,155,197,132,218,56,102,229,187,89,7,219,133,103,57,186,228,6,88,25,71,165,251,120,38,196,154,101,59,217,135,4,90,184,230,167,249,27,69,198,152,122,36,248,166,68,26,153,199,37,123,58,100,134,216,91,5,231,185,140,210,48,110,237,179,81,15,78,16,242,172,47,113,147,205,17,79,173,243,112,46,204,146,211,141,111,49,178,236,14,80,175,241,19,77,206,144,114,44,109,51,209,143,12,82,176,238,50,108,142,208,83,13,239,177,240,174,76,18,145,207,45,115,202,148,118,40,171,245,23,73,8,86,180,234,105,55,213,139,87,9,235,181,54,104,138,212,149,203,41,119,244,170,72,22,233,183,85,11,136,214,52,106,43,117,151,201,74,20,246,168,116,42,200,150,21,75,169,247,182,232,10,84,215,137,107,53]);

},{}],158:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var CRC8_DEFAULT_TABLE=exports.CRC8_DEFAULT_TABLE=new Uint8Array([0,7,14,9,28,27,18,21,56,63,54,49,36,35,42,45,112,119,126,121,108,107,98,101,72,79,70,65,84,83,90,93,224,231,238,233,252,251,242,245,216,223,214,209,196,195,202,205,144,151,158,153,140,139,130,133,168,175,166,161,180,179,186,189,199,192,201,206,219,220,213,210,255,248,241,246,227,228,237,234,183,176,185,190,171,172,165,162,143,136,129,134,147,148,157,154,39,32,41,46,59,60,53,50,31,24,17,22,3,4,13,10,87,80,89,94,75,76,69,66,111,104,97,102,115,116,125,122,137,142,135,128,149,146,155,156,177,182,191,184,173,170,163,164,249,254,247,240,229,226,235,236,193,198,207,200,221,218,211,212,105,110,103,96,117,114,123,124,81,86,95,88,77,74,67,68,25,30,23,16,5,2,11,12,33,38,47,40,61,58,51,52,78,73,64,71,82,85,92,91,118,113,120,127,106,109,100,99,62,57,48,55,34,37,44,43,6,1,8,15,26,29,20,19,174,169,160,167,178,181,188,187,150,145,152,159,138,141,132,131,222,217,208,215,194,197,204,203,230,225,232,239,250,253,244,243]);

},{}],159:[function(require,module,exports){
"use strict";function ascii(e){return Uint8Array.from(e,function(e){return e.charCodeAt(0)})}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=ascii;

},{}],160:[function(require,module,exports){
"use strict";function copy(e){var t=arguments.length<=1||void 0===arguments[1]?null:arguments[1],r=arguments.length<=2||void 0===arguments[2]?0:arguments[2];if(!t)return new e.constructor(e);var n=t.length-r;return n>0&&(e.length>n&&(e=e.subarray(0,n)),t.set(e,r)),t}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=copy;

},{}],161:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function hexof(e){return e.length!=e.byteLength&&(e=new Uint8Array(e.buffer,e.byteOffset,e.byteLength)),(0,_strof2["default"])(B16API.update(e))}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=hexof;var _Base16Encoder=require("../codec/Base16Encoder"),_Base16Encoder2=_interopRequireDefault(_Base16Encoder),_strof=require("./strof"),_strof2=_interopRequireDefault(_strof),B16API=new _Base16Encoder2["default"];

},{"../codec/Base16Encoder":134,"./strof":162}],162:[function(require,module,exports){
"use strict";function strof(e){return String.fromCharCode.apply(null,e)}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=strof;

},{}],163:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}var _Base16Spec=require("../test/Base16Spec"),_Base16Spec2=_interopRequireDefault(_Base16Spec),_MD5Spec=require("../test/MD5Spec"),_MD5Spec2=_interopRequireDefault(_MD5Spec),_CRCSpec=require("../test/CRCSpec"),_CRCSpec2=_interopRequireDefault(_CRCSpec),clc=require("cli-color"),testSuite=[],errorCount=0;testSuite.push(_Base16Spec2["default"],_MD5Spec2["default"],_CRCSpec2["default"]);for(var i=0;i<testSuite.length;++i){try{testSuite[i]()}catch(e){++errorCount,console.log(clc.red("\n"+e.stack))}console.log("")}if(console.log("Total: "+clc.cyan("("+testSuite.length+")")+", Error: "+clc.red("("+errorCount+")")+", Passed: "+clc.green("("+(testSuite.length-errorCount)+")")),errorCount>0)throw new Error("One or more error occurs, See more detail from the error log above.");

},{"../test/Base16Spec":164,"../test/CRCSpec":165,"../test/MD5Spec":166,"cli-color":10}],164:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function test_encode_base16(e,r){var t=(0,_strof2["default"])(encoder.update(e));(0,_assert2["default"])(t==r,"base16 encode does not match."+(" { input=["+e+'], expect="'+r+'", result="'+t+'" }')),(0,_passlog2["default"])("["+e+"]",'"'+r+'"')}function test_decode_base16(e,r){decoder.reset();var t=decoder.update((0,_ascii2["default"])(e));decoder["final"](),(0,_assert2["default"])((0,_arrayEqual2["default"])(t,r),"base16 encode does not match."+(' { input="'+e+'", expect=['+r+"], result=["+t+"] }")),(0,_passlog2["default"])('"'+e+'"',"["+r+"]")}function test_decode_error(e){var r=(0,_catchError2["default"])(function(){decoder.reset(),decoder.update((0,_ascii2["default"])(e)),decoder["final"]()});(0,_assert2["default"])(null!==r,"base16 decode does not throw error."+(' { input="'+e+'" }')),(0,_errorlog2["default"])('"'+e+'"','"'+r+'"')}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=function(){console.log("[Start Base16 Test Suite]:"),test_encode_base16(A1,B1),test_encode_base16(A2,B2),test_decode_base16(B1,A1),test_decode_base16(B2,A2),test_decode_error("ABC"),test_decode_error("abc")};var _assert=require("../src/core/assert"),_assert2=_interopRequireDefault(_assert),_Base16Encoder=require("../src/data/codec/Base16Encoder"),_Base16Encoder2=_interopRequireDefault(_Base16Encoder),_Base16Decoder=require("../src/data/codec/Base16Decoder"),_Base16Decoder2=_interopRequireDefault(_Base16Decoder),_ascii=require("../src/data/utils/ascii"),_ascii2=_interopRequireDefault(_ascii),_strof=require("../src/data/utils/strof"),_strof2=_interopRequireDefault(_strof),_passlog=require("./helper/passlog"),_passlog2=_interopRequireDefault(_passlog),_errorlog=require("./helper/errorlog"),_errorlog2=_interopRequireDefault(_errorlog),_arrayEqual=require("./helper/arrayEqual"),_arrayEqual2=_interopRequireDefault(_arrayEqual),_catchError=require("./helper/catchError"),_catchError2=_interopRequireDefault(_catchError),encoder=new _Base16Encoder2["default"],decoder=new _Base16Decoder2["default"],A1=new Uint8Array(0),B1="",A2=new Uint8Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]),B2="000102030405060708090a0b0c0d0e0f";

},{"../src/core/assert":132,"../src/data/codec/Base16Decoder":133,"../src/data/codec/Base16Encoder":134,"../src/data/utils/ascii":159,"../src/data/utils/strof":162,"./helper/arrayEqual":167,"./helper/catchError":168,"./helper/errorlog":169,"./helper/passlog":170}],165:[function(require,module,exports){
"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{"default":t}}function test_crc1(t){var e=crc.crc1(t),r=new _CRC2["default"];r.update((0,_ascii2["default"])(t));var c=r["final"]();(0,_assert2["default"])(c===e,"CRC1 does not match."+(' { input="'+t+'", expect='+e+", result="+c+" }")),(0,_passlog2["default"])('"'+t+'"',e+"(0x"+e.toString(16)+") [crc1]")}function test_crc8(t){var e=crc.crc8(t),r=new _CRC4["default"];r.update((0,_ascii2["default"])(t));var c=r["final"]();(0,_assert2["default"])(c===e,"CRC8 does not match."+(' { input="'+t+'", expect='+e+", result="+c+" }")),(0,_passlog2["default"])('"'+t+'"',e+"(0x"+e.toString(16)+") [crc8]")}function test_crc8_dallas_1_wire(t){var e=crc.crc81wire(t),r=new _CRC8Dallas1Wire2["default"];r.update((0,_ascii2["default"])(t));var c=r["final"]();(0,_assert2["default"])(c===e,"CRC8_dallas_1_wire does not match."+(' { input="'+t+'", expect='+e+", result="+c+" }")),(0,_passlog2["default"])('"'+t+'"',e+"(0x"+e.toString(16)+") [crc8-dallas-1-wire]")}function test_crc16(t){var e=crc.crc16(t),r=new _CRC6["default"];r.update((0,_ascii2["default"])(t));var c=r["final"]();(0,_assert2["default"])(c===e,"CRC16 does not match."+(' { input="'+t+'", expect='+e+", result="+c+" }")),(0,_passlog2["default"])('"'+t+'"',e+"(0x"+e.toString(16)+") [crc16]")}function test_crc16_ccitt(t){var e=crc.crc16ccitt(t),r=new _CRC16CCITT2["default"];r.update((0,_ascii2["default"])(t));var c=r["final"]();(0,_assert2["default"])(c===e,"CRC16_ccitt does not match."+(' { input="'+t+'", expect='+e+", result="+c+" }")),(0,_passlog2["default"])('"'+t+'"',e+"(0x"+e.toString(16)+") [crc16-ccitt]")}function test_crc16_kermit(t){var e=crc.crc16kermit(t),r=new _CRC16Kermit2["default"];r.update((0,_ascii2["default"])(t));var c=r["final"]();(0,_assert2["default"])(c===e,"CRC16_kermit does not match."+(' { input="'+t+'", expect='+e+", result="+c+" }")),(0,_passlog2["default"])('"'+t+'"',e+"(0x"+e.toString(16)+") [crc16-kermit]")}function test_crc16_modbus(t){var e=crc.crc16modbus(t),r=new _CRC16ModBus2["default"];r.update((0,_ascii2["default"])(t));var c=r["final"]();(0,_assert2["default"])(c===e,"CRC16_modbus does not match."+(' { input="'+t+'", expect='+e+", result="+c+" }")),(0,_passlog2["default"])('"'+t+'"',e+"(0x"+e.toString(16)+") [crc16-modbus]")}function test_crc16_xmodem(t){var e=crc.crc16xmodem(t),r=new _CRC16XModem2["default"];r.update((0,_ascii2["default"])(t));var c=r["final"]();(0,_assert2["default"])(c===e,"CRC16_xmodem does not match."+(' { input="'+t+'", expect='+e+", result="+c+" }")),(0,_passlog2["default"])('"'+t+'"',e+"(0x"+e.toString(16)+") [crc16-xmodem]")}function test_crc24(t){var e=crc.crc24(t),r=new _CRC8["default"];r.update((0,_ascii2["default"])(t));var c=r["final"]();(0,_assert2["default"])(c===e,"CRC24 does not match."+(' { input="'+t+'", expect='+e+", result="+c+" }")),(0,_passlog2["default"])('"'+t+'"',e+"(0x"+e.toString(16)+") [crc24]")}function test_crc32(t){var e=crc.crc32(t),r=new _CRC10["default"];r.update((0,_ascii2["default"])(t));var c=r["final"]();(0,_assert2["default"])(c===e,"CRC32 does not match."+(' { input="'+t+'", expect='+e+", result="+c+" }")),(0,_passlog2["default"])('"'+t+'"',e+"(0x"+e.toString(16)+") [crc32]")}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=function(){console.log("[Start 'CRC1,CRC8,CRC16,CRC24,CRC32' Test Suite]:"),test_crc1(""),test_crc1("0123456789"),test_crc1("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"),test_crc8(""),test_crc8("0123456789"),test_crc8("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"),test_crc8_dallas_1_wire(""),test_crc8_dallas_1_wire("0123456789"),test_crc8_dallas_1_wire("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"),test_crc16(""),test_crc16("0123456789"),test_crc16("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"),test_crc16_ccitt(""),test_crc16_ccitt("0123456789"),test_crc16_ccitt("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"),test_crc16_kermit(""),test_crc16_kermit("0123456789"),test_crc16_kermit("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"),test_crc16_modbus(""),test_crc16_modbus("0123456789"),test_crc16_modbus("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"),test_crc16_xmodem(""),test_crc16_xmodem("0123456789"),test_crc16_xmodem("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"),test_crc24(""),test_crc24("0123456789"),test_crc24("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"),test_crc32(""),test_crc32("0123456789"),test_crc32("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789")};var _assert=require("../src/core/assert"),_assert2=_interopRequireDefault(_assert),_CRC=require("../src/data/crypto/CRC1"),_CRC2=_interopRequireDefault(_CRC),_CRC3=require("../src/data/crypto/CRC8"),_CRC4=_interopRequireDefault(_CRC3),_CRC8Dallas1Wire=require("../src/data/crypto/CRC8Dallas1Wire"),_CRC8Dallas1Wire2=_interopRequireDefault(_CRC8Dallas1Wire),_CRC5=require("../src/data/crypto/CRC16"),_CRC6=_interopRequireDefault(_CRC5),_CRC16CCITT=require("../src/data/crypto/CRC16CCITT"),_CRC16CCITT2=_interopRequireDefault(_CRC16CCITT),_CRC16Kermit=require("../src/data/crypto/CRC16Kermit"),_CRC16Kermit2=_interopRequireDefault(_CRC16Kermit),_CRC16ModBus=require("../src/data/crypto/CRC16ModBus"),_CRC16ModBus2=_interopRequireDefault(_CRC16ModBus),_CRC16XModem=require("../src/data/crypto/CRC16XModem"),_CRC16XModem2=_interopRequireDefault(_CRC16XModem),_CRC7=require("../src/data/crypto/CRC24"),_CRC8=_interopRequireDefault(_CRC7),_CRC9=require("../src/data/crypto/CRC32"),_CRC10=_interopRequireDefault(_CRC9),_ascii=require("../src/data/utils/ascii"),_ascii2=_interopRequireDefault(_ascii),_strof=require("../src/data/utils/strof"),_strof2=_interopRequireDefault(_strof),_passlog=require("./helper/passlog"),_passlog2=_interopRequireDefault(_passlog),crc=require("crc");

},{"../src/core/assert":132,"../src/data/crypto/CRC1":139,"../src/data/crypto/CRC16":140,"../src/data/crypto/CRC16CCITT":141,"../src/data/crypto/CRC16Kermit":142,"../src/data/crypto/CRC16ModBus":143,"../src/data/crypto/CRC16XModem":144,"../src/data/crypto/CRC24":145,"../src/data/crypto/CRC32":146,"../src/data/crypto/CRC8":147,"../src/data/crypto/CRC8Dallas1Wire":148,"../src/data/utils/ascii":159,"../src/data/utils/strof":162,"./helper/passlog":170,"crc":31}],166:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function test_md5(e,t){MD5API.reset(),MD5API.update((0,_ascii2["default"])(e));var a=(0,_hexof2["default"])(MD5API["final"]());(0,_assert2["default"])(a==t,"MD5 does not match."+(' { input="'+e+'", expect="'+t+'", result="'+a+'" }')),(0,_passlog2["default"])('"'+e+'"','"'+t+'"')}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=function(){console.log("[Start MD5 Test Suite]:"),test_md5("","d41d8cd98f00b204e9800998ecf8427e"),test_md5("a","0cc175b9c0f1b6a831c399e269772661"),test_md5("abc","900150983cd24fb0d6963f7d28e17f72"),test_md5("message digest","f96b697d7cb7938d525a2f31aaf161d0"),test_md5("abcdefghijklmnopqrstuvwxyz","c3fcd3d76192e4007dfb496cca67e13b"),test_md5("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789","d174ab98d277d9f5a5611c2c9f419d9f"),test_md5("12345678901234567890123456789012345678901234567890123456789012345678901234567890","57edf4a22be3c955ac49da2e2107b67a")};var _assert=require("../src/core/assert"),_assert2=_interopRequireDefault(_assert),_MD=require("../src/data/crypto/MD5"),_MD2=_interopRequireDefault(_MD),_hexof=require("../src/data/utils/hexof"),_hexof2=_interopRequireDefault(_hexof),_ascii=require("../src/data/utils/ascii"),_ascii2=_interopRequireDefault(_ascii),_passlog=require("./helper/passlog"),_passlog2=_interopRequireDefault(_passlog),MD5API=new _MD2["default"];

},{"../src/core/assert":132,"../src/data/crypto/MD5":149,"../src/data/utils/ascii":159,"../src/data/utils/hexof":161,"./helper/passlog":170}],167:[function(require,module,exports){
"use strict";function arrayEqual(e,t){if(e.length!=t.length||e.byteLength!=t.byteLength)return!1;for(var r=0;r<e.length;++r)if(e[r]!==t[r])return!1;return!0}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=arrayEqual;

},{}],168:[function(require,module,exports){
"use strict";function catchError(e){try{return e(),null}catch(r){return r.name+": "+r.message}}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=catchError;

},{}],169:[function(require,module,exports){
"use strict";function errorlog(e,r){console.log(clc.green("✔"),"input/message:",clc.xterm(74).underline(""+e),clc.blackBright.underline(""+r))}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=errorlog;var clc=require("cli-color");

},{"cli-color":10}],170:[function(require,module,exports){
"use strict";function passlog(e,c){console.log(clc.green("✔"),"input/expect:",clc.xterm(74).underline(""+e),"=>",clc.white.underline(""+c))}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=passlog;var clc=require("cli-color");

},{"cli-color":10}]},{},[163])
//# sourceMappingURL=debug.js.map
