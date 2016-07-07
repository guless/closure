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
import MD5    from "../../src/data/crypto/MD5";
import hexof  from "../../src/data/utils/hexof";
import ascii  from "../../src/data/utils/ascii";
import swap32 from "../../src/data/utils/swap32";

import MD5_2  from "../../.backup/src/data/crypto/MD5";

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
    "d41d8cd98f00b204e9800998ecf8427e",
    "0cc175b9c0f1b6a831c399e269772661",
    "900150983cd24fb0d6963f7d28e17f72",
    "f96b697d7cb7938d525a2f31aaf161d0",
    "c3fcd3d76192e4007dfb496cca67e13b",
    "d174ab98d277d9f5a5611c2c9f419d9f",
    "57edf4a22be3c955ac49da2e2107b67a"
];
var MD5API = new MD5();
// test_md5("", "d41d8cd98f00b204e9800998ecf8427e");
// test_md5("a", "0cc175b9c0f1b6a831c399e269772661");
// test_md5("abc", "900150983cd24fb0d6963f7d28e17f72");
// test_md5("message digest", "f96b697d7cb7938d525a2f31aaf161d0");
// test_md5("abcdefghijklmnopqrstuvwxyz", "c3fcd3d76192e4007dfb496cca67e13b");
// test_md5("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "d174ab98d277d9f5a5611c2c9f419d9f");
// test_md5("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "57edf4a22be3c955ac49da2e2107b67a");

describe("[ MD5 ] Test Suite:", function() {
    it(`"${inputs[0]}"(empty string) => "${expect[0]}"`, function() {
        MD5API.reset();
        MD5API.update(ascii(inputs[0]));
        
        assert.equal(hexof(MD5API.final()), expect[0]);
    });
    
    it(`"${inputs[1]}" => "${expect[1]}"`, function() {
        MD5API.reset();
        MD5API.update(ascii(inputs[1]));
        
        assert.equal(hexof(MD5API.final()), expect[1]);
    });
    
    it(`"${inputs[2]}" => "${expect[2]}"`, function() {
        MD5API.reset();
        MD5API.update(ascii(inputs[2]));
        
        assert.equal(hexof(MD5API.final()), expect[2]);
    });
    
    it(`"${inputs[3]}" => "${expect[3]}"`, function() {
        MD5API.reset();
        MD5API.update(ascii(inputs[3]));
        
        assert.equal(hexof(MD5API.final()), expect[3]);
    });
    
    it(`"${inputs[4]}" => "${expect[4]}"`, function() {
        MD5API.reset();
        MD5API.update(ascii(inputs[4]));
        
        assert.equal(hexof(MD5API.final()), expect[4]);
    });
    
    it(`"${inputs[5]}" => "${expect[5]}"`, function() {
        MD5API.reset();
        MD5API.update(ascii(inputs[5]));
        
        assert.equal(hexof(MD5API.final()), expect[5]);
    });
    
    it(`"${inputs[6]}" => "${expect[0]}"`, function() {
        MD5API.reset();
        MD5API.update(ascii(inputs[6]));
        
        assert.equal(hexof(MD5API.final()), expect[6]);
    });
    
    // it(`one million times 'a' => "7707d6ae4e027c70eea2a935c2296f21"`, function() {
    //     MD5API.reset();
        
    //     for ( var i = 0, a = new Uint8Array(1000000).fill(97); i < a.length; i += 1024 ) {
    //         MD5API.update(a.subarray(i, i + 1024));
    //     }
        
    //     assert.equal(hexof(MD5API.final()), "7707d6ae4e027c70eea2a935c2296f21");
    // });
});