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
import RIPEMD160 from "../../src/data/crypto/RIPEMD160";
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
    "9c1185a5c5e9fc54612808977ee8f548b2258d31",
    "0bdc9d2d256b3ee9daae347be6f4dc835a467ffe",
    "8eb208f7e05d987a9b044a8e98c6b087f15a0bfc",
    "5d0689ef49d2fae572b881b123a85ffa21595f36",
    "f71c27109c692c1b56bbdceb5b9d2865b3708dbc",
    "b0e20b6e3116640286ed3a87a5713079b21f5189",
    "9b752e45573d4b39f4dbd3323cab82bf63326bfb"
];
var RIPEMD160API = new RIPEMD160();
// test_repimd160("", "9c1185a5c5e9fc54612808977ee8f548b2258d31");
// test_repimd160("a", "0bdc9d2d256b3ee9daae347be6f4dc835a467ffe");
// test_repimd160("abc", "8eb208f7e05d987a9b044a8e98c6b087f15a0bfc");
// test_repimd160("message digest", "5d0689ef49d2fae572b881b123a85ffa21595f36");
// test_repimd160("abcdefghijklmnopqrstuvwxyz", "f71c27109c692c1b56bbdceb5b9d2865b3708dbc");
// test_repimd160("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "b0e20b6e3116640286ed3a87a5713079b21f5189");
// test_repimd160("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "9b752e45573d4b39f4dbd3323cab82bf63326bfb");

describe("[ RIPEMD160 ] Test Suite:", function() {
    it(`"${inputs[0]}"(empty string) => "${expect[0]}"`, function() {
        RIPEMD160API.reset();
        RIPEMD160API.update(ascii(inputs[0]));
        
        assert.equal(hexof(RIPEMD160API.final()), expect[0]);
    });
    
    it(`"${inputs[1]}" => "${expect[1]}"`, function() {
        RIPEMD160API.reset();
        RIPEMD160API.update(ascii(inputs[1]));
        
        assert.equal(hexof(RIPEMD160API.final()), expect[1]);
    });
    
    it(`"${inputs[2]}" => "${expect[2]}"`, function() {
        RIPEMD160API.reset();
        RIPEMD160API.update(ascii(inputs[2]));
        
        assert.equal(hexof(RIPEMD160API.final()), expect[2]);
    });
    
    it(`"${inputs[3]}" => "${expect[3]}"`, function() {
        RIPEMD160API.reset();
        RIPEMD160API.update(ascii(inputs[3]));
        
        assert.equal(hexof(RIPEMD160API.final()), expect[3]);
    });
    
    it(`"${inputs[4]}" => "${expect[4]}"`, function() {
        RIPEMD160API.reset();
        RIPEMD160API.update(ascii(inputs[4]));
        
        assert.equal(hexof(RIPEMD160API.final()), expect[4]);
    });
    
    it(`"${inputs[5]}" => "${expect[5]}"`, function() {
        RIPEMD160API.reset();
        RIPEMD160API.update(ascii(inputs[5]));
        
        assert.equal(hexof(RIPEMD160API.final()), expect[5]);
    });
    
    it(`"${inputs[6]}" => "${expect[0]}"`, function() {
        RIPEMD160API.reset();
        RIPEMD160API.update(ascii(inputs[6]));
        
        assert.equal(hexof(RIPEMD160API.final()), expect[6]);
    });
});