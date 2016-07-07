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
import hexof from "../../src/data/utils/hexof";

var assert = require("assert");
var inputs = [
    /// B(1)
    new Uint8Array ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
    /// B(2)
    new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
    /// B(3)
    (function(){ var a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; a.BYTES_PER_ELEMENT = 3; return a; }()),
    /// B(4)
    new Uint32Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
    /// B(5)
    (function() { var a = new Uint8Array(256); for ( var i = 0; i < 256; ++i ) { a[i] = i; }; return a; }())
];
var expect = [
    "000102030405060708090a0b0c0d0e0f",
    "0000000100020003000400050006000700080009000a000b000c000d000e000f",
    "00000000000100000200000300000400000500000600000700000800000900000a00000b00000c00000d00000e00000f",
    "000000000000000100000002000000030000000400000005000000060000000700000008000000090000000a0000000b0000000c0000000d0000000e0000000f",
    (function() { var s = ""; for ( var i = 0; i < 256; ++i ) { s += ("0" + (i).toString(16)).slice(-2); }; return s; }())
];

describe("[ hexof() ] Test Suite:", function() {
    for ( var i = 0; i < inputs.length; ++i ) {
        it(`[${inputs[i].slice(0,5).join(",")}...${inputs[i].slice(-2).join(",")}] => "${expect[i].slice(0,10 * inputs[i].BYTES_PER_ELEMENT)}...${expect[i].slice(-4*inputs[i].BYTES_PER_ELEMENT)}"`, function() {
            assert.equal(hexof(inputs[this.i]), expect[this.i]);
        }.bind({i:i}));
    }
    
    it("should consider bytes as 8bits word.", function() {
        assert.equal(hexof([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]), "000102030405060708090a0b0c0d0e0f");
    });
    
    it("should allow change to 16bits word.", function() {
        assert.equal(hexof([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 2), "0000000100020003000400050006000700080009000a000b000c000d000e000f");
    });
});