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
import RIPEMD320 from "../../src/data/crypto/RIPEMD320";
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
    "22d65d5661536cdc75c1fdf5c6de7b41b9f27325ebc61e8557177d705a0ec880151c3a32a00899b8",
    "ce78850638f92658a5a585097579926dda667a5716562cfcf6fbe77f63542f99b04705d6970dff5d",
    "de4c01b3054f8930a79d09ae738e92301e5a17085beffdc1b8d116713e74f82fa942d64cdbc4682d",
    "3a8e28502ed45d422f68844f9dd316e7b98533fa3f2a91d29f84d425c88d6b4eff727df66a7c0197",
    "cabdb1810b92470a2093aa6bce05952c28348cf43ff60841975166bb40ed234004b8824463e6b009",
    "ed544940c86d67f250d232c30b7b3e5770e0c60c8cb9a4cafe3b11388af9920e1b99230b843c86a4",
    "557888af5f6d8ed62ab66945c6d2a0a47ecd5341e915eb8fea1d0524955f825dc717e4a008ab2d42"
];
var RIPEMD320API = new RIPEMD320();
// test_repimd320("", "22d65d5661536cdc75c1fdf5c6de7b41b9f27325ebc61e8557177d705a0ec880151c3a32a00899b8");
// test_repimd320("a", "ce78850638f92658a5a585097579926dda667a5716562cfcf6fbe77f63542f99b04705d6970dff5d");
// test_repimd320("abc", "de4c01b3054f8930a79d09ae738e92301e5a17085beffdc1b8d116713e74f82fa942d64cdbc4682d");
// test_repimd320("message digest", "3a8e28502ed45d422f68844f9dd316e7b98533fa3f2a91d29f84d425c88d6b4eff727df66a7c0197");
// test_repimd320("abcdefghijklmnopqrstuvwxyz", "cabdb1810b92470a2093aa6bce05952c28348cf43ff60841975166bb40ed234004b8824463e6b009");
// test_repimd320("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "ed544940c86d67f250d232c30b7b3e5770e0c60c8cb9a4cafe3b11388af9920e1b99230b843c86a4");
// test_repimd320("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "557888af5f6d8ed62ab66945c6d2a0a47ecd5341e915eb8fea1d0524955f825dc717e4a008ab2d42");

describe("[ RIPEMD320 ] Test Suite:", function() {
    it(`"${inputs[0]}"(empty string) => "${expect[0]}"`, function() {
        RIPEMD320API.reset();
        RIPEMD320API.update(ascii(inputs[0]));
        
        assert.equal(hexof(RIPEMD320API.final()), expect[0]);
    });
    
    it(`"${inputs[1]}" => "${expect[1]}"`, function() {
        RIPEMD320API.reset();
        RIPEMD320API.update(ascii(inputs[1]));
        
        assert.equal(hexof(RIPEMD320API.final()), expect[1]);
    });
    
    it(`"${inputs[2]}" => "${expect[2]}"`, function() {
        RIPEMD320API.reset();
        RIPEMD320API.update(ascii(inputs[2]));
        
        assert.equal(hexof(RIPEMD320API.final()), expect[2]);
    });
    
    it(`"${inputs[3]}" => "${expect[3]}"`, function() {
        RIPEMD320API.reset();
        RIPEMD320API.update(ascii(inputs[3]));
        
        assert.equal(hexof(RIPEMD320API.final()), expect[3]);
    });
    
    it(`"${inputs[4]}" => "${expect[4]}"`, function() {
        RIPEMD320API.reset();
        RIPEMD320API.update(ascii(inputs[4]));
        
        assert.equal(hexof(RIPEMD320API.final()), expect[4]);
    });
    
    it(`"${inputs[5]}" => "${expect[5]}"`, function() {
        RIPEMD320API.reset();
        RIPEMD320API.update(ascii(inputs[5]));
        
        assert.equal(hexof(RIPEMD320API.final()), expect[5]);
    });
    
    it(`"${inputs[6]}" => "${expect[0]}"`, function() {
        RIPEMD320API.reset();
        RIPEMD320API.update(ascii(inputs[6]));
        
        assert.equal(hexof(RIPEMD320API.final()), expect[6]);
    });
});