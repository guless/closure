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
"use strict";function assert(e){var r=arguments.length<=1||void 0===arguments[1]?"predicate failure.":arguments[1];if(!e){var t=new Error(""+r);throw t.name="Assertion Exception",t}}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=assert;

},{}],2:[function(require,module,exports){
"use strict";function _classCallCheck(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,a){for(var t=0;t<a.length;t++){var r=a[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(a,t,r){return t&&e(a.prototype,t),r&&e(a,r),a}}(),_Base16LowerTable=require("./Base16LowerTable"),Base16=function(){function e(){var a=arguments.length<=0||void 0===arguments[0]?_Base16LowerTable.BASE16_LOWER_ENCODE_TABLE:arguments[0],t=arguments.length<=1||void 0===arguments[1]?_Base16LowerTable.BASE16_LOWER_DECODE_TABLE:arguments[1];_classCallCheck(this,e),this._base16Offset=0,this._base16Buffer=0,this._encodeTable=a,this._decodeTable=t}return _createClass(e,[{key:"encode",value:function(e){for(var a=(arguments.length<=1||void 0===arguments[1]?!0:arguments[1],arguments.length<=2||void 0===arguments[2]?null:arguments[2]),t=e.length,r=0,n=a||new Uint8Array(2*t),s=0;t>s;++s,r+=2)n[r]=this._encodeTable[e[s]>>>4&15],n[r+1]=this._encodeTable[15&e[s]];return a?a.subarray(0,r):n}},{key:"decode",value:function(e){var a=arguments.length<=1||void 0===arguments[1]?!0:arguments[1],t=arguments.length<=2||void 0===arguments[2]?null:arguments[2];if(a&&this._base16Offset+e.length&1)throw new Error("Invalid base16 data.");var r=e.length,n=t||new Uint8Array(Math.floor((this._base16Offset+r)/2)),s=0;if(r>0){var o=0,i=0;if(this._base16Offset>0){if(o=this._decodeTable[127&this._base16Buffer],i=this._decodeTable[127&e[0]],0>o||0>i)throw new Error("Invalid base16 data.");n[s++]=o<<4|i}for(var l=this._base16Offset>0?1:0;r>=l+2;l+=2){if(o=this._decodeTable[127&e[l]],i=this._decodeTable[127&e[l+1]],0>o||0>i)throw new Error("Invalid base16 data.");n[s++]=o<<4|i}this._base16Offset=r-l,this._base16Offset>0&&(this._base16Buffer=e[r-1])}return t?t.subarray(0,s):n}},{key:"encodeTable",get:function(){return this._encodeTable}},{key:"decodeTable",get:function(){return this._decodeTable}}]),e}();exports["default"]=Base16;

},{"./Base16LowerTable":3}],3:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var BASE16_LOWER_ENCODE_TABLE=exports.BASE16_LOWER_ENCODE_TABLE=new Int8Array([48,49,50,51,52,53,54,55,56,57,97,98,99,100,101,102]),BASE16_LOWER_DECODE_TABLE=exports.BASE16_LOWER_DECODE_TABLE=new Int8Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,11,12,13,14,15,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);

},{}],4:[function(require,module,exports){
"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function FF(t,e,i,n,s,r){return t+=(e&i|~e&n)+s,t<<r|t>>>32-r}function GG(t,e,i,n,s,r){return t+=(e&i|e&n|i&n)+s+1518500249,t<<r|t>>>32-r}function HH(t,e,i,n,s,r){return t+=(e^i^n)+s+1859775393,t<<r|t>>>32-r}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),_Status=require("./Status"),H1=1732584193,H2=4023233417,H3=2562383102,H4=271733878,MD4=function(){function t(){_classCallCheck(this,t),this._init()}return _createClass(t,[{key:"_init",value:function(){this._status=_Status.UPDATING,this._offset=0,this._length=new Uint32Array(2),this._buffer=new Uint8Array(64),this._digest=new Uint32Array([H1,H2,H3,H4])}},{key:"_transform",value:function(t,e){var i=this._digest[0],n=this._digest[1],s=this._digest[2],r=this._digest[3];i=FF(i,n,s,r,t.getUint32(e+0,!0),3),r=FF(r,i,n,s,t.getUint32(e+4,!0),7),s=FF(s,r,i,n,t.getUint32(e+8,!0),11),n=FF(n,s,r,i,t.getUint32(e+12,!0),19),i=FF(i,n,s,r,t.getUint32(e+16,!0),3),r=FF(r,i,n,s,t.getUint32(e+20,!0),7),s=FF(s,r,i,n,t.getUint32(e+24,!0),11),n=FF(n,s,r,i,t.getUint32(e+28,!0),19),i=FF(i,n,s,r,t.getUint32(e+32,!0),3),r=FF(r,i,n,s,t.getUint32(e+36,!0),7),s=FF(s,r,i,n,t.getUint32(e+40,!0),11),n=FF(n,s,r,i,t.getUint32(e+44,!0),19),i=FF(i,n,s,r,t.getUint32(e+48,!0),3),r=FF(r,i,n,s,t.getUint32(e+52,!0),7),s=FF(s,r,i,n,t.getUint32(e+56,!0),11),n=FF(n,s,r,i,t.getUint32(e+60,!0),19),i=GG(i,n,s,r,t.getUint32(e+0,!0),3),r=GG(r,i,n,s,t.getUint32(e+16,!0),5),s=GG(s,r,i,n,t.getUint32(e+32,!0),9),n=GG(n,s,r,i,t.getUint32(e+48,!0),13),i=GG(i,n,s,r,t.getUint32(e+4,!0),3),r=GG(r,i,n,s,t.getUint32(e+20,!0),5),s=GG(s,r,i,n,t.getUint32(e+36,!0),9),n=GG(n,s,r,i,t.getUint32(e+52,!0),13),i=GG(i,n,s,r,t.getUint32(e+8,!0),3),r=GG(r,i,n,s,t.getUint32(e+24,!0),5),s=GG(s,r,i,n,t.getUint32(e+40,!0),9),n=GG(n,s,r,i,t.getUint32(e+56,!0),13),i=GG(i,n,s,r,t.getUint32(e+12,!0),3),r=GG(r,i,n,s,t.getUint32(e+28,!0),5),s=GG(s,r,i,n,t.getUint32(e+44,!0),9),n=GG(n,s,r,i,t.getUint32(e+60,!0),13),i=HH(i,n,s,r,t.getUint32(e+0,!0),3),r=HH(r,i,n,s,t.getUint32(e+32,!0),9),s=HH(s,r,i,n,t.getUint32(e+16,!0),11),n=HH(n,s,r,i,t.getUint32(e+48,!0),15),i=HH(i,n,s,r,t.getUint32(e+8,!0),3),r=HH(r,i,n,s,t.getUint32(e+40,!0),9),s=HH(s,r,i,n,t.getUint32(e+24,!0),11),n=HH(n,s,r,i,t.getUint32(e+56,!0),15),i=HH(i,n,s,r,t.getUint32(e+4,!0),3),r=HH(r,i,n,s,t.getUint32(e+36,!0),9),s=HH(s,r,i,n,t.getUint32(e+20,!0),11),n=HH(n,s,r,i,t.getUint32(e+52,!0),15),i=HH(i,n,s,r,t.getUint32(e+12,!0),3),r=HH(r,i,n,s,t.getUint32(e+44,!0),9),s=HH(s,r,i,n,t.getUint32(e+28,!0),11),n=HH(n,s,r,i,t.getUint32(e+60,!0),15),this._digest[0]+=i,this._digest[1]+=n,this._digest[2]+=s,this._digest[3]+=r}},{key:"update",value:function(t){this._status==_Status.DIGESTED&&this._init();var e=8*t.length,i=e/4294967296>>>0,n=e>>>0;this._length[0]+=n,this._length[1]+=this._length[0]<n?1+i:i;var s=t.length,r=64-this._offset;if(s>=r){64!=r?(this._buffer.set(t.subarray(0,r),this._offset),this._transform(new DataView(this._buffer),0)):r=0;for(var f=new DataView(t.buffer,t.byteOffset),g=r;s>=g+64;g+=64)this._transform(f,g);this._offset=(s-r)%64,this._offset>0&&this._buffer.set(t.subarray(s-this._offset),0)}else s>0&&(this._buffer.set(t,this._offset),this._offset+=s);return this}},{key:"digest",value:function(){this._status==_Status.DIGESTED&&this._init(),this._status=_Status.DIGESTED,this._buffer.fill?this._buffer.fill(0,this._offset):this._buffer.set(new Uint8Array(64-this._offset),this._offset);var t=new DataView(this._buffer.buffer);return t.setUint8(this._offset,128),this._offset<56?(t.setUint32(56,this._length[0],!0),t.setUint32(60,this._length[1],!0)):(this._transform(t,0),t=new DataView(new ArrayBuffer(64)),t.setUint32(56,this._length[0],!0),t.setUint32(60,this._length[1],!0)),this._transform(t,0),new Uint8Array(this._digest.buffer)}}]),t}();exports["default"]=MD4;

},{"./Status":5}],5:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var UPDATING=exports.UPDATING=0,DIGESTED=exports.DIGESTED=1;

},{}],6:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var CHAR=exports.CHAR=1,SHORT=exports.SHORT=2,INT=exports.INT=4,LONG=exports.LONG=8,UCHAR=exports.UCHAR=1,USHORT=exports.USHORT=2,UINT=exports.UINT=4,ULONG=exports.ULONG=8;

},{}],7:[function(require,module,exports){
"use strict";function tobytes(e){var t=arguments.length<=1||void 0===arguments[1]?_sizedef.USHORT:arguments[1],r=null;if(t==_sizedef.USHORT)r=new Uint16Array(e.length);else if(t==_sizedef.UCHAR)r=new Uint8Array(e.length);else{if(t!=_sizedef.UINT)throw new Error("the byte size of elements does not support.");r=new Uint32Array(e.length)}for(var n=0,s=e.length;s>n;++n)r[n]=e.charCodeAt(n);return r}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=tobytes;var _sizedef=require("./sizedef");

},{"./sizedef":6}],8:[function(require,module,exports){
"use strict";function tochars(e){return String.fromCharCode.apply(String,e)}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=tochars;

},{}],9:[function(require,module,exports){
"use strict";require("../test/MD4.js");

},{"../test/MD4.js":10}],10:[function(require,module,exports){
"use strict";function _interopRequireWildcard(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t["default"]=e,t}function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function test_md4(e,t){var r=(0,_tochars2["default"])((new _Base2["default"]).encode((new _MD2["default"]).update((0,_tobytes2["default"])(e,1)).digest()));(0,_assert2["default"])(r===t,'MD4 hash does not match. \n{\n    expect: "'+t+'", \n    result: "'+r+'", \n    input : "'+e+'"\n}')}var _assert=require("../src/core/assert"),_assert2=_interopRequireDefault(_assert),_groups=require("./groups"),groups=_interopRequireWildcard(_groups),_tochars=require("../src/data/tochars"),_tochars2=_interopRequireDefault(_tochars),_tobytes=require("../src/data/tobytes"),_tobytes2=_interopRequireDefault(_tobytes),_Base=require("../src/data/codec/Base16"),_Base2=_interopRequireDefault(_Base),_MD=require("../src/data/crypto/MD4"),_MD2=_interopRequireDefault(_MD),filedesc="MD4 Test Suite";groups.start(filedesc),test_md4("","31d6cfe0d16ae931b73c59d7e0c089c0"),test_md4("a","bde52cb31de33e46245e05fbdbd6fb24"),test_md4("abc","a448017aaf21d8525fc10ae87aa6729d"),test_md4("message digest","d9130a8164549fe818874806e1c7014b"),test_md4("abcdefghijklmnopqrstuvwxyz","d79e1c308aa5bbcdeea8ed63df412da9"),test_md4("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789","043f8582f241db351ce627e153e7f0e4"),test_md4("12345678901234567890123456789012345678901234567890123456789012345678901234567890","e33b4ddc9c38f2199c3e7b164fcc0536"),groups.end(filedesc);

},{"../src/core/assert":1,"../src/data/codec/Base16":2,"../src/data/crypto/MD4":4,"../src/data/tobytes":7,"../src/data/tochars":8,"./groups":11}],11:[function(require,module,exports){
"use strict";function end(e){}function start(e){console.log("["+e+"] -------------------------------------------------------------------------------->>\n")}Object.defineProperty(exports,"__esModule",{value:!0}),exports.end=end,exports.start=start;

},{}]},{},[9])
//# sourceMappingURL=debug.js.map
