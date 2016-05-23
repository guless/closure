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
"use strict";function _classCallCheck(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,a){for(var t=0;t<a.length;t++){var r=a[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(a,t,r){return t&&e(a.prototype,t),r&&e(a,r),a}}(),_Base16LowerTable=require("./Base16LowerTable"),Base16=function(){function e(){var a=arguments.length<=0||void 0===arguments[0]?_Base16LowerTable.BASE16_LOWER_ENCODE_TABLE:arguments[0],t=arguments.length<=1||void 0===arguments[1]?_Base16LowerTable.BASE16_LOWER_DECODE_TABLE:arguments[1];_classCallCheck(this,e),this._base16Offset=0,this._base16Buffer=0,this._encodeTable=a,this._decodeTable=t}return _createClass(e,[{key:"encode",value:function(e){for(var a=(arguments.length<=1||void 0===arguments[1]?!0:arguments[1],arguments.length<=2||void 0===arguments[2]?null:arguments[2]),t=e.length,r=0,n=a||new Uint8Array(2*t),s=0;t>s;++s,r+=2)n[r]=this._encodeTable[e[s]>>>4&15],n[r+1]=this._encodeTable[15&e[s]];return a?a.subarray(0,r):n}},{key:"decode",value:function(e){var a=arguments.length<=1||void 0===arguments[1]?!0:arguments[1],t=arguments.length<=2||void 0===arguments[2]?null:arguments[2];if(a&&this._base16Offset+e.length&1)throw new Error("Invalid base16 data.");var r=e.length,n=t||new Uint8Array(Math.floor((this._base16Offset+r)/2)),s=0;if(r>0){var o=0,i=0;if(this._base16Offset>0){if(o=this._decodeTable[127&this._base16Buffer],i=this._decodeTable[127&e[0]],0>o||0>i)throw new Error("Invalid base16 data.");n[s++]=o<<4|i}for(var l=this._base16Offset>0?1:0;r>=l+2;l+=2){if(o=this._decodeTable[127&e[l]],i=this._decodeTable[127&e[l+1]],0>o||0>i)throw new Error("Invalid base16 data.");n[s++]=o<<4|i}this._base16Offset=r-l,this._base16Offset>0&&(this._base16Buffer=e[r-1])}return t?t.subarray(0,s):n}},{key:"encodeTable",get:function(){return this._encodeTable}},{key:"decodeTable",get:function(){return this._decodeTable}}]),e}();exports["default"]=Base16;

},{"./Base16LowerTable":2}],2:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var BASE16_LOWER_ENCODE_TABLE=exports.BASE16_LOWER_ENCODE_TABLE=new Int8Array([48,49,50,51,52,53,54,55,56,57,97,98,99,100,101,102]),BASE16_LOWER_DECODE_TABLE=exports.BASE16_LOWER_DECODE_TABLE=new Int8Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,11,12,13,14,15,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);

},{}],3:[function(require,module,exports){
"use strict";function _classCallCheck(f,t){if(!(f instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function f(f,t){for(var e=0;e<t.length;e++){var r=t[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(f,r.key,r)}}return function(t,e,r){return e&&f(t.prototype,e),r&&f(t,r),t}}(),UTF8=function(){function f(){_classCallCheck(this,f),this._utf16Buffer=new Uint16Array(2),this._utf16Offset=0,this._utf8Buffer=new Uint8Array(4),this._utf8Offset=0}return _createClass(f,[{key:"encode",value:function(f){for(var t=arguments.length<=1||void 0===arguments[1]?!0:arguments[1],e=arguments.length<=2||void 0===arguments[2]?null:arguments[2],r=e||new Uint8Array(this._sizeOfUtf16Encode(f)),i=f.length+this._utf16Offset,s=0,u=0,n=0,a=0;i>u;){var h=u>=this._utf16Offset?f[u-this._utf16Offset]:this._utf16Buffer[u];if(h>=56320&&57343>=h)throw new Error("Invaild UTF-16 character. offset="+u);if(h>=55296&&56319>=h){if(++u,u>=i){if(t)throw new Error("Invaild UTF-16 character. offset="+(u-1));this._utf16Buffer[a++]=h;break}var o=u>=this._utf16Offset?f[u-this._utf16Offset]:this._utf16Buffer[u];if(56320>o||o>57343)throw new Error("Invaild UTF-16 character. offset="+u);s=((1023&h)<<10|1023&o)+65536}else s=h;127>=s?r[n++]=s:2047>=s?(r[n++]=(s>>>6)+192,r[n++]=(63&s)+128):65535>=s?(r[n++]=(s>>>12)+224,r[n++]=(s>>>6&63)+128,r[n++]=(63&s)+128):(r[n++]=(s>>>18)+240,r[n++]=(s>>>12&63)+128,r[n++]=(s>>>6&63)+128,r[n++]=(63&s)+128),++u}return this._utf16Offset=a,e?e.subarray(0,n):r}},{key:"decode",value:function(f){for(var t=arguments.length<=1||void 0===arguments[1]?!0:arguments[1],e=arguments.length<=2||void 0===arguments[2]?null:arguments[2],r=e||new Uint16Array(this._sizeOfUtf8Decode(f)),i=f.length+this._utf8Offset,s=0,u=0,n=0,a=0,h=0;i>n;){var o=n>=this._utf8Offset?f[n-this._utf8Offset]:this._utf8Buffer[n];if(o>=128){if(194>o||o>244)throw new Error("Invaild UTF-8 character. offset="+n);if(240==(240&o))s=7&o,u=n+3;else if(224==(224&o))s=15&o,u=n+2;else{if(192!=(192&o))throw new Error("Invaild UTF-8 character. offset="+n);s=31&o,u=n+1}if(u>=i){if(t)throw new Error("Invaild UTF-8 character. offset="+n);for(this._utf8Buffer[h++]=o;i>n+1;)++n,o=n>=this._utf8Offset?f[n-this._utf8Offset]:this._utf8Buffer[n],this._utf8Buffer[h++]=o;break}for(;u>=n+1;){if(++n,o=n>=this._utf8Offset?f[n-this._utf8Offset]:this._utf8Buffer[n],128>o||o>191)throw new Error("Invaild UTF-8 character. offset="+n);s=s<<6|63&o}}else s=o;if(s>=55296&&57343>=s)throw new Error("Invaild UTF-16 character. codePoint="+s);s>=65536?(r[a++]=(s>>10)+55232,r[a++]=(1023&s)+56320):r[a++]=s,++n}return this._utf8Offset=h,e?e.subarray(0,a):r}},{key:"_sizeOfUtf16Encode",value:function(f){for(var t=0,e=0,r=f.length+this._utf16Offset;r>e;){var i=e>=this._utf16Offset?f[e-this._utf16Offset]:this._utf16Buffer[e];if(i>=55296&&56319>=i){if(++e,e>=r){--t;break}t+=2}else i>127&&(2047>=i?++t:65535>=i&&(t+=2));++e}return t+=r}},{key:"_sizeOfUtf8Decode",value:function(f){for(var t=0,e=0,r=f.length+this._utf8Offset;r>e;){var i=e>=this._utf8Offset?f[e-this._utf8Offset]:this._utf8Buffer[e];if(127>=i)++t;else if(240==(240&i)){if(e+=3,e>=r)break;t+=2}else if(224==(224&i)){if(e+=2,e>=r)break;++t}else if(192==(192&i)){if(++e,e>=r)break;++t}++e}return t}}]),f}();exports["default"]=UTF8;

},{}],4:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var CHAR=exports.CHAR=1,SHORT=exports.SHORT=2,INT=exports.INT=4,LONG=exports.LONG=8,UCHAR=exports.UCHAR=1,USHORT=exports.USHORT=2,UINT=exports.UINT=4,ULONG=exports.ULONG=8;

},{}],5:[function(require,module,exports){
"use strict";function tobytes(e){var t=arguments.length<=1||void 0===arguments[1]?_sizedef.USHORT:arguments[1],r=null;if(t==_sizedef.USHORT)r=new Uint16Array(e.length);else if(t==_sizedef.UCHAR)r=new Uint8Array(e.length);else{if(t!=_sizedef.UINT)throw new Error("the byte size of elements does not support.");r=new Uint32Array(e.length)}for(var n=0,s=e.length;s>n;++n)r[n]=e.charCodeAt(n);return r}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=tobytes;var _sizedef=require("./sizedef");

},{"./sizedef":4}],6:[function(require,module,exports){
"use strict";function tochars(e){return String.fromCharCode.apply(String,e)}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=tochars;

},{}],7:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function uri(e){return encodeURIComponent(e).replace(/(%[0-9A-F]{2}|.)/g,function(e){if(1==e.length){var t=e.charCodeAt(0).toString(16).toUpperCase();return 1==t.length?"0"+t:t}return e.slice(1)})}function utf(e){return(0,_tochars2["default"])((new _Base2["default"]).encode((new _UTF2["default"]).encode((0,_tobytes2["default"])(e)))).toUpperCase()}function test(e){var t=uri(e),o=utf(e);console.log("URI:",t),console.log("UTF:",o),console.log("Equals:",t==o,"\n")}for(var _UTF=require("./data/codec/UTF8"),_UTF2=_interopRequireDefault(_UTF),_Base=require("./data/codec/Base16"),_Base2=_interopRequireDefault(_Base),_tobytes=require("./data/tobytes"),_tobytes2=_interopRequireDefault(_tobytes),_tochars=require("./data/tochars"),_tochars2=_interopRequireDefault(_tochars),ascii=new Uint8Array(128),i=0;i<ascii.length;++i)ascii[i]=i;test((0,_tochars2["default"])(ascii,1)),test("中国"),test("🀀"),console.log("[decode]-------------------------------------------------------------->");var b16=new _Base2["default"],bytes=b16.decode((0,_tobytes2["default"])("E4B8ADE59BBDF09F8080".toLowerCase(),1));console.log(bytes),bytes=(new _UTF2["default"]).decode(bytes),console.log((0,_tochars2["default"])(bytes));

},{"./data/codec/Base16":1,"./data/codec/UTF8":3,"./data/tobytes":5,"./data/tochars":6}]},{},[7])
//# sourceMappingURL=debug.js.map
