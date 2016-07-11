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
import Base64Encoder from "../../src/data/codec/Base64Encoder";
import Base64Decoder from "../../src/data/codec/Base64Decoder";
import strof         from "../../src/data/utils/strof";
import ascii         from "../../src/data/utils/ascii";

var assert = require("assert");
var apiEncoder = new Base64Encoder();
var apiDecoder = new Base64Decoder();
var inputs = [
    "",
    "f",
    "fo",
    "foo",
    "foob",
    "fooba",
    "foobar"
];

var expect = [
    "",
    "Zg==",
    "Zm8=",
    "Zm9v",
    "Zm9vYg==",
    "Zm9vYmE=",
    "Zm9vYmFy"
];

describe("[ Base32 ] Test Suite:", function() {    
    for ( var i = 0; i < inputs.length; ++i ) {
        it(`"${inputs[i]}"${inputs[i] == "" ? "(empty string)" : ""} => "${expect[i]}"${expect[i] == "" ? "(empty string)" : ""}`, function() {
            apiEncoder.reset();
            
            var result  = strof(apiEncoder.update(ascii(inputs[this.i])));
                result += strof(apiEncoder.final());
            
            assert.equal(result, expect[this.i]);
        }.bind({ i: i }));
        
        it(`"${expect[i]}"${expect[i] == "" ? "(empty string)" : ""} => "${inputs[i]}"${inputs[i] == "" ? "(empty string)" : ""}`, function() {
            apiDecoder.reset();
            
            var result  = strof(apiDecoder.update(ascii(expect[this.i])));
                result += strof(apiDecoder.final());
            
            assert.equal(result, inputs[this.i]);
        }.bind({ i: i }));
    };
});