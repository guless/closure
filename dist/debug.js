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
"use strict";function ascii(e){return Uint8Array.from(e,function(e){return e.charCodeAt(0)})}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=ascii;

},{}],2:[function(require,module,exports){
"use strict";function copy(e){var t=arguments.length<=1||void 0===arguments[1]?null:arguments[1],r=arguments.length<=2||void 0===arguments[2]?0:arguments[2];if(!t)return new e.constructor(e);var n=t.length-r;return n>0&&(e.length>n&&(e=e.subarray(0,n)),t.set(e,r)),t}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=copy;

},{}],3:[function(require,module,exports){
"use strict";function strof(e){return String.fromCharCode.apply(null,e)}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=strof;

},{}],4:[function(require,module,exports){
"use strict";function utf16(t){return Uint16Array.from(t,function(t){return t.charCodeAt(0)})}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=utf16;

},{}],5:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}var _ascii=require("./data/utils/ascii"),_ascii2=_interopRequireDefault(_ascii),_utf=require("./data/utils/utf16"),_utf2=_interopRequireDefault(_utf),_strof=require("./data/utils/strof"),_strof2=_interopRequireDefault(_strof),_copy=require("./data/utils/copy"),_copy2=_interopRequireDefault(_copy);console.log((0,_ascii2["default"])("abc")),console.log((0,_utf2["default"])("abc")),console.log((0,_strof2["default"])(new Uint8Array([97,98,99])));var a=new Uint8Array([97,98,99]),b=(0,_copy2["default"])(a,new Uint8Array(a.length));a[0]=100,console.log(a),console.log(b);var a=new Uint8Array([97,98,99,100,101,102]),b=new Uint8Array(a.buffer).subarray(1,4);a.set(b,0),console.log(a);

},{"./data/utils/ascii":1,"./data/utils/copy":2,"./data/utils/strof":3,"./data/utils/utf16":4}]},{},[5])
//# sourceMappingURL=debug.js.map
