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
import SHA1   from "../../src/data/crypto/SHA1";
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
    "da39a3ee5e6b4b0d3255bfef95601890afd80709",
    "86f7e437faa5a7fce15d1ddcb9eaeaea377667b8",
    "a9993e364706816aba3e25717850c26c9cd0d89d",
    "d3517cbe39e304a3988dc773fa6f1e71f6ff965e",
    "32d10c7b8cf96570ca04ce37f2a19d84240d3a89",
    "761c457bf73b14d27e9e9265c46f4b4dda11f940",
    "50abf5706a150990a08b2c5ea40fa0e585554732"
];
var SHA1API = new SHA1();
// test_sha1("", "da39a3ee5e6b4b0d3255bfef95601890afd80709");
// test_sha1("a", "86f7e437faa5a7fce15d1ddcb9eaeaea377667b8");
// test_sha1("abc", "a9993e364706816aba3e25717850c26c9cd0d89d");
// test_sha1("Secure Hash Algorithm", "d3517cbe39e304a3988dc773fa6f1e71f6ff965e");
// test_sha1("abcdefghijklmnopqrstuvwxyz", "32d10c7b8cf96570ca04ce37f2a19d84240d3a89");
// test_sha1("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "761c457bf73b14d27e9e9265c46f4b4dda11f940");
// test_sha1("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "50abf5706a150990a08b2c5ea40fa0e585554732");

describe("[ SHA1 ] Test Suite:", function() {
    it(`"${inputs[0]}"(empty string) => "${expect[0]}"`, function() {
        SHA1API.reset();
        SHA1API.update(ascii(inputs[0]));
        
        assert.equal(hexof(SHA1API.final()), expect[0]);
    });
    
    it(`"${inputs[1]}" => "${expect[1]}"`, function() {
        SHA1API.reset();
        SHA1API.update(ascii(inputs[1]));
        
        assert.equal(hexof(SHA1API.final()), expect[1]);
    });
    
    it(`"${inputs[2]}" => "${expect[2]}"`, function() {
        SHA1API.reset();
        SHA1API.update(ascii(inputs[2]));
        
        assert.equal(hexof(SHA1API.final()), expect[2]);
    });
    
    it(`"${inputs[3]}" => "${expect[3]}"`, function() {
        SHA1API.reset();
        SHA1API.update(ascii(inputs[3]));
        
        assert.equal(hexof(SHA1API.final()), expect[3]);
    });
    
    it(`"${inputs[4]}" => "${expect[4]}"`, function() {
        SHA1API.reset();
        SHA1API.update(ascii(inputs[4]));
        
        assert.equal(hexof(SHA1API.final()), expect[4]);
    });
    
    it(`"${inputs[5]}" => "${expect[5]}"`, function() {
        SHA1API.reset();
        SHA1API.update(ascii(inputs[5]));
        
        assert.equal(hexof(SHA1API.final()), expect[5]);
    });
    
    it(`"${inputs[6]}" => "${expect[0]}"`, function() {
        SHA1API.reset();
        SHA1API.update(ascii(inputs[6]));
        
        assert.equal(hexof(SHA1API.final()), expect[6]);
    });
});