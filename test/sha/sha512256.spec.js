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
import SHA512256 from "../../src/data/crypto/SHA512256";
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
    "c672b8d1ef56ed28ab87c3622c5114069bdd3ad7b8f9737498d0c01ecef0967a",
    "455e518824bc0601f9fb858ff5c37d417d67c2f8e0df2babe4808858aea830f8",
    "53048e2681941ef99b2e29b76b4c7dabe4c2d0c634fc6d46e0e2f13107e7af23",
    "6417327cde3816c39bed385cf7d3f54d730dd31a938c117a9f6315197a5735e2",
    "fc3189443f9c268f626aea08a756abe7b726b05f701cb08222312ccfd6710a26",
    "cdf1cc0effe26ecc0c13758f7b4a48e000615df241284185c39eb05d355bb9c8",
    "2c9fdbc0c90bdd87612ee8455474f9044850241dc105b1e8b94b8ddf5fac9148"
];
var SHA512256API = new SHA512256();
// test_SHA512t256("", "c672b8d1ef56ed28ab87c3622c5114069bdd3ad7b8f9737498d0c01ecef0967a");
// test_SHA512t256("a", "455e518824bc0601f9fb858ff5c37d417d67c2f8e0df2babe4808858aea830f8");
// test_SHA512t256("abc", "53048e2681941ef99b2e29b76b4c7dabe4c2d0c634fc6d46e0e2f13107e7af23");
// test_SHA512t256("Secure Hash Algorithm", "6417327cde3816c39bed385cf7d3f54d730dd31a938c117a9f6315197a5735e2");
// test_SHA512t256("abcdefghijklmnopqrstuvwxyz", "fc3189443f9c268f626aea08a756abe7b726b05f701cb08222312ccfd6710a26");
// test_SHA512t256("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "cdf1cc0effe26ecc0c13758f7b4a48e000615df241284185c39eb05d355bb9c8");
// test_SHA512t256("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "2c9fdbc0c90bdd87612ee8455474f9044850241dc105b1e8b94b8ddf5fac9148");

describe("[ SHA512-256 ] Test Suite:", function() {
    it(`"${inputs[0]}"(empty string) => "${expect[0]}"`, function() {
        SHA512256API.reset();
        SHA512256API.update(ascii(inputs[0]));
        
        assert.equal(hexof(SHA512256API.final()), expect[0]);
    });
    
    it(`"${inputs[1]}" => "${expect[1]}"`, function() {
        SHA512256API.reset();
        SHA512256API.update(ascii(inputs[1]));
        
        assert.equal(hexof(SHA512256API.final()), expect[1]);
    });
    
    it(`"${inputs[2]}" => "${expect[2]}"`, function() {
        SHA512256API.reset();
        SHA512256API.update(ascii(inputs[2]));
        
        assert.equal(hexof(SHA512256API.final()), expect[2]);
    });
    
    it(`"${inputs[3]}" => "${expect[3]}"`, function() {
        SHA512256API.reset();
        SHA512256API.update(ascii(inputs[3]));
        
        assert.equal(hexof(SHA512256API.final()), expect[3]);
    });
    
    it(`"${inputs[4]}" => "${expect[4]}"`, function() {
        SHA512256API.reset();
        SHA512256API.update(ascii(inputs[4]));
        
        assert.equal(hexof(SHA512256API.final()), expect[4]);
    });
    
    it(`"${inputs[5]}" => "${expect[5]}"`, function() {
        SHA512256API.reset();
        SHA512256API.update(ascii(inputs[5]));
        
        assert.equal(hexof(SHA512256API.final()), expect[5]);
    });
    
    it(`"${inputs[6]}" => "${expect[0]}"`, function() {
        SHA512256API.reset();
        SHA512256API.update(ascii(inputs[6]));
        
        assert.equal(hexof(SHA512256API.final()), expect[6]);
    });
});