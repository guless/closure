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
import SHA0   from "../../src/data/crypto/SHA0";
import hexof  from "../../src/data/utils/hexof";
import ascii  from "../../src/data/utils/ascii";
import swap32 from "../../src/data/utils/swap32";

var assert = require("assert");
var inputs = [
    "",
    "a",
    "abc",
    "Secure Hash Algorithm",
    "abcdefghijklmnopqrstuvwxyz",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    "12345678901234567890123456789012345678901234567890123456789012345678901234567890"
];
var expect = [
    "f96cea198ad1dd5617ac084a3d92c6107708c0ef",
    "37f297772fae4cb1ba39b6cf9cf0381180bd62f2",
    "0164b8a914cd2a5e74c4f7ff082c4d97f1edf880",
    "7437cfb9498f2cd5b4e47458125eeaa1b70f46e0",
    "b40ce07a430cfd3c033039b9fe9afec95dc1bdcd",
    "79e966f7a3a990df33e40e3d7f8f18d2caebadfa",
    "4aa29d14d171522ece47bee8957e35a41f3e9cff"
];
var SHA0API = new SHA0();
// test_sha0("", "f96cea198ad1dd5617ac084a3d92c6107708c0ef");
// test_sha0("a", "37f297772fae4cb1ba39b6cf9cf0381180bd62f2");
// test_sha0("abc", "0164b8a914cd2a5e74c4f7ff082c4d97f1edf880");
// test_sha0("Secure Hash Algorithm", "7437cfb9498f2cd5b4e47458125eeaa1b70f46e0");
// test_sha0("abcdefghijklmnopqrstuvwxyz", "b40ce07a430cfd3c033039b9fe9afec95dc1bdcd");
// test_sha0("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "79e966f7a3a990df33e40e3d7f8f18d2caebadfa");
// test_sha0("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "4aa29d14d171522ece47bee8957e35a41f3e9cff");

describe("[ SHA0 ] Test Suite:", function() {
    it(`"${inputs[0]}"(empty string) => "${expect[0]}"`, function() {
        SHA0API.reset();
        SHA0API.update(ascii(inputs[0]));
        
        assert.equal(hexof(SHA0API.final()), expect[0]);
    });
    
    it(`"${inputs[1]}" => "${expect[1]}"`, function() {
        SHA0API.reset();
        SHA0API.update(ascii(inputs[1]));
        
        assert.equal(hexof(SHA0API.final()), expect[1]);
    });
    
    it(`"${inputs[2]}" => "${expect[2]}"`, function() {
        SHA0API.reset();
        SHA0API.update(ascii(inputs[2]));
        
        assert.equal(hexof(SHA0API.final()), expect[2]);
    });
    
    it(`"${inputs[3]}" => "${expect[3]}"`, function() {
        SHA0API.reset();
        SHA0API.update(ascii(inputs[3]));
        
        assert.equal(hexof(SHA0API.final()), expect[3]);
    });
    
    it(`"${inputs[4]}" => "${expect[4]}"`, function() {
        SHA0API.reset();
        SHA0API.update(ascii(inputs[4]));
        
        assert.equal(hexof(SHA0API.final()), expect[4]);
    });
    
    it(`"${inputs[5]}" => "${expect[5]}"`, function() {
        SHA0API.reset();
        SHA0API.update(ascii(inputs[5]));
        
        assert.equal(hexof(SHA0API.final()), expect[5]);
    });
    
    it(`"${inputs[6]}" => "${expect[0]}"`, function() {
        SHA0API.reset();
        SHA0API.update(ascii(inputs[6]));
        
        assert.equal(hexof(SHA0API.final()), expect[6]);
    });
});