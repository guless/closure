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
import utf8  from "../../src/data/utils/utf8";
import hexof from "../../src/data/utils/hexof";

var assert = require("assert");

function fakeString( a ) {
    a.charCodeAt = function( i ) { return this[i]; }
    return a;
}

describe("[ utf-8(utils) ] Test Suite:", function() {
    it(`"中国" => "e4b8ade59bbd"`, function() {
        assert.equal(hexof(utf8("中国")), "e4b8ade59bbd");
    });
    
    it(`"λβγ" => "cebbceb2ceb3"`, function() {
        assert.equal(hexof(utf8("λβγ")), "cebbceb2ceb3");
    });
    
    it(`"abcdefghijklmnopqrstuvwxyz0123456789" => "6162636465666768696a6b6c6d6e6f707172737475767778797a30313233343536373839"`, function() {
        assert.equal(hexof(utf8("abcdefghijklmnopqrstuvwxyz0123456789")), "6162636465666768696a6b6c6d6e6f707172737475767778797a30313233343536373839");
    });
    
    it(`"\ud83d\ude00\ud83d\ude01\ud83d\ude02" => "f09f9880f09f9881f09f9882"`, function() {
        assert.equal(hexof(utf8("\ud83d\ude00\ud83d\ude01\ud83d\ude02")), "f09f9880f09f9881f09f9882");
    });
    
    it("should throws encounter an unpaired surrogate.", function() {
        assert.throws(function() { utf8(fakeString([ 0xDC00 ])); }, /Encounter an unpaired surrogate./)
    });
    
    it("should throws encounter an unpaired surrogate.", function() {
        assert.throws(function() { utf8(fakeString([ 0xD800 ])); }, /Encounter an unpaired surrogate./)
    });
    
    it("should throws encounter an unpaired surrogate.", function() {
        assert.throws(function() { utf8(fakeString([ 0xD800, 0x0000 ])); }, /Encounter an unpaired surrogate./)
    });
});