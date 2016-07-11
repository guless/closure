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
import RIPEMD128 from "../../src/data/crypto/RIPEMD128";
import hexof     from "../../src/data/utils/hexof";
import ascii     from "../../src/data/utils/ascii";
import swap32    from "../../src/data/utils/swap32";

var assert = require("assert");
var inputs = [
    "",
    "a",
    "abc",
    "message digest",
    "abcdefghijklmnopqrstuvwxyz",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    "12345678901234567890123456789012345678901234567890123456789012345678901234567890"
];
var expect = [
    "cdf26213a150dc3ecb610f18f6b38b46",
    "86be7afa339d0fc7cfc785e72f578d33",
    "c14a12199c66e4ba84636b0f69144c77",
    "9e327b3d6e523062afc1132d7df9d1b8",
    "fd2aa607f71dc8f510714922b371834e",
    "d1e959eb179c911faea4624c60c5c702",
    "3f45ef194732c2dbb2c4a2c769795fa3"
];
var RIPEMD128API = new RIPEMD128();
// test_repimd128("", "cdf26213a150dc3ecb610f18f6b38b46");
// test_repimd128("a", "86be7afa339d0fc7cfc785e72f578d33");
// test_repimd128("abc", "c14a12199c66e4ba84636b0f69144c77");
// test_repimd128("message digest", "9e327b3d6e523062afc1132d7df9d1b8");
// test_repimd128("abcdefghijklmnopqrstuvwxyz", "fd2aa607f71dc8f510714922b371834e");
// test_repimd128("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "d1e959eb179c911faea4624c60c5c702");
// test_repimd128("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "3f45ef194732c2dbb2c4a2c769795fa3");

describe("[ RIPEMD128 ] Test Suite:", function() {
    it(`"${inputs[0]}"(empty string) => "${expect[0]}"`, function() {
        RIPEMD128API.reset();
        RIPEMD128API.update(ascii(inputs[0]));
        
        assert.equal(hexof(RIPEMD128API.final()), expect[0]);
    });
    
    it(`"${inputs[1]}" => "${expect[1]}"`, function() {
        RIPEMD128API.reset();
        RIPEMD128API.update(ascii(inputs[1]));
        
        assert.equal(hexof(RIPEMD128API.final()), expect[1]);
    });
    
    it(`"${inputs[2]}" => "${expect[2]}"`, function() {
        RIPEMD128API.reset();
        RIPEMD128API.update(ascii(inputs[2]));
        
        assert.equal(hexof(RIPEMD128API.final()), expect[2]);
    });
    
    it(`"${inputs[3]}" => "${expect[3]}"`, function() {
        RIPEMD128API.reset();
        RIPEMD128API.update(ascii(inputs[3]));
        
        assert.equal(hexof(RIPEMD128API.final()), expect[3]);
    });
    
    it(`"${inputs[4]}" => "${expect[4]}"`, function() {
        RIPEMD128API.reset();
        RIPEMD128API.update(ascii(inputs[4]));
        
        assert.equal(hexof(RIPEMD128API.final()), expect[4]);
    });
    
    it(`"${inputs[5]}" => "${expect[5]}"`, function() {
        RIPEMD128API.reset();
        RIPEMD128API.update(ascii(inputs[5]));
        
        assert.equal(hexof(RIPEMD128API.final()), expect[5]);
    });
    
    it(`"${inputs[6]}" => "${expect[0]}"`, function() {
        RIPEMD128API.reset();
        RIPEMD128API.update(ascii(inputs[6]));
        
        assert.equal(hexof(RIPEMD128API.final()), expect[6]);
    });
});