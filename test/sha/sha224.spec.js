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
import SHA224 from "../../src/data/crypto/SHA224";
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
    "d14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f",
    "abd37534c7d9a2efb9465de931cd7055ffdb8879563ae98078d6d6d5",
    "23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7",
    "78f121a4b578b9420fa00f6d4505eb1d878c34bedc360826b752febd",
    "45a5f72c39c5cff2522eb3429799e49e5f44b356ef926bcf390dccc2",
    "bff72b4fcb7d75e5632900ac5f90d219e05e97a7bde72e740db393d9",
    "b50aecbe4e9bb0b57bc5f3ae760a8e01db24f203fb3cdcd13148046e"
];
var SHA224API = new SHA224();
// test_sha224("", "d14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f");
// test_sha224("a", "abd37534c7d9a2efb9465de931cd7055ffdb8879563ae98078d6d6d5");
// test_sha224("abc", "23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7");
// test_sha224("Secure Hash Algorithm", "78f121a4b578b9420fa00f6d4505eb1d878c34bedc360826b752febd");
// test_sha224("abcdefghijklmnopqrstuvwxyz", "45a5f72c39c5cff2522eb3429799e49e5f44b356ef926bcf390dccc2");
// test_sha224("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "bff72b4fcb7d75e5632900ac5f90d219e05e97a7bde72e740db393d9");
// test_sha224("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "b50aecbe4e9bb0b57bc5f3ae760a8e01db24f203fb3cdcd13148046e");

describe("[ SHA224 ] Test Suite:", function() {
    it(`"${inputs[0]}"(empty string) => "${expect[0]}"`, function() {
        SHA224API.reset();
        SHA224API.update(ascii(inputs[0]));
        
        assert.equal(hexof(SHA224API.final()), expect[0]);
    });
    
    it(`"${inputs[1]}" => "${expect[1]}"`, function() {
        SHA224API.reset();
        SHA224API.update(ascii(inputs[1]));
        
        assert.equal(hexof(SHA224API.final()), expect[1]);
    });
    
    it(`"${inputs[2]}" => "${expect[2]}"`, function() {
        SHA224API.reset();
        SHA224API.update(ascii(inputs[2]));
        
        assert.equal(hexof(SHA224API.final()), expect[2]);
    });
    
    it(`"${inputs[3]}" => "${expect[3]}"`, function() {
        SHA224API.reset();
        SHA224API.update(ascii(inputs[3]));
        
        assert.equal(hexof(SHA224API.final()), expect[3]);
    });
    
    it(`"${inputs[4]}" => "${expect[4]}"`, function() {
        SHA224API.reset();
        SHA224API.update(ascii(inputs[4]));
        
        assert.equal(hexof(SHA224API.final()), expect[4]);
    });
    
    it(`"${inputs[5]}" => "${expect[5]}"`, function() {
        SHA224API.reset();
        SHA224API.update(ascii(inputs[5]));
        
        assert.equal(hexof(SHA224API.final()), expect[5]);
    });
    
    it(`"${inputs[6]}" => "${expect[0]}"`, function() {
        SHA224API.reset();
        SHA224API.update(ascii(inputs[6]));
        
        assert.equal(hexof(SHA224API.final()), expect[6]);
    });
});