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
import MD2    from "../../src/data/crypto/MD2";
import hexof  from "../../src/data/utils/hexof";
import ascii  from "../../src/data/utils/ascii";
import swap32 from "../../src/data/utils/swap32";

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
    "8350e5a3e24c153df2275c9f80692773",
    "32ec01ec4a6dac72c0ab96fb34c0b5d1",
    "da853b0d3f88d99b30283a69e6ded6bb",
    "ab4f496bfb2a530b219ff33031fe06b0",
    "4e8ddff3650292ab5a4108c3aa47940b",
    "da33def2a42df13975352846c30338cd",
    "d5976f79d83d3a0dc9806c3c66f3efd8"
];
var MD2API = new MD2();
// test_md2("", "8350e5a3e24c153df2275c9f80692773");
// test_md2("a", "32ec01ec4a6dac72c0ab96fb34c0b5d1");
// test_md2("abc", "da853b0d3f88d99b30283a69e6ded6bb");
// test_md2("message digest", "ab4f496bfb2a530b219ff33031fe06b0");
// test_md2("abcdefghijklmnopqrstuvwxyz", "4e8ddff3650292ab5a4108c3aa47940b");
// test_md2("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "da33def2a42df13975352846c30338cd");
// test_md2("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "d5976f79d83d3a0dc9806c3c66f3efd8");

describe("[ MD2 ] Test Suite:", function() {
    it(`"${inputs[0]}"(empty string) => "${expect[0]}"`, function() {
        MD2API.reset();
        MD2API.update(ascii(inputs[0]));
        
        assert.equal(hexof(MD2API.final()), expect[0]);
    });
    
    it(`"${inputs[1]}" => "${expect[1]}"`, function() {
        MD2API.reset();
        MD2API.update(ascii(inputs[1]));
        
        assert.equal(hexof(MD2API.final()), expect[1]);
    });
    
    it(`"${inputs[2]}" => "${expect[2]}"`, function() {
        MD2API.reset();
        MD2API.update(ascii(inputs[2]));
        
        assert.equal(hexof(MD2API.final()), expect[2]);
    });
    
    it(`"${inputs[3]}" => "${expect[3]}"`, function() {
        MD2API.reset();
        MD2API.update(ascii(inputs[3]));
        
        assert.equal(hexof(MD2API.final()), expect[3]);
    });
    
    it(`"${inputs[4]}" => "${expect[4]}"`, function() {
        MD2API.reset();
        MD2API.update(ascii(inputs[4]));
        
        assert.equal(hexof(MD2API.final()), expect[4]);
    });
    
    it(`"${inputs[5]}" => "${expect[5]}"`, function() {
        MD2API.reset();
        MD2API.update(ascii(inputs[5]));
        
        assert.equal(hexof(MD2API.final()), expect[5]);
    });
    
    it(`"${inputs[6]}" => "${expect[0]}"`, function() {
        MD2API.reset();
        MD2API.update(ascii(inputs[6]));
        
        assert.equal(hexof(MD2API.final()), expect[6]);
    });
});