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
import Base16Encoder from "../../src/data/codec/Base16Encoder";
import Bsae16Decoder from "../../src/data/codec/Base16Decoder";
import strof         from "../../src/data/utils/strof";
import ascii         from "../../src/data/utils/ascii";
import concat        from "../../src/data/utils/concat";

var assert = require("assert");
var apiEncoder = new Base16Encoder();
var apiDecoder = new Bsae16Decoder();

var inputs = [
    new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
];

var expect = [
    "000102030405060708090a0b0c0d0e0f"
];

function equal( a, b ) {
    if ( a.length != b.length ) {
        return false;
    }
    
    for ( var i = 0; i < a.length; ++i ) {
        if ( a[i] != b[i] ) return false;
    }
    
    return true;
}

describe("[ Base16-Encode ] Test Suite:", function() {
    it(`[${inputs[0].slice(0,5).join(",")}...${inputs[0].slice(-2).join(",")}] => "${expect[0]}"`, function() {
        apiEncoder.reset();
        
        var result  = strof(apiEncoder.update(inputs[0]));
            result += strof(apiEncoder.final());
        
        assert.equal(result, expect[0]);
    });
    
    it(`"${expect[0]}" => [${inputs[0].slice(0,5).join(",")}...${inputs[0].slice(-2).join(",")}]`, function() {
        apiDecoder.reset();
        
        var result = [
            apiDecoder.update(ascii(expect[0])),
            apiDecoder.final()
        ];
        
        assert(equal(concat(result), inputs[0]));
    });
    
    it(`update one by one bytes. => "000102030405060708090a0b0c0d0e0f"`, function() {
        apiEncoder.reset();
        
        var bytes = inputs[0];
        var result = "";
        
        for ( var i = 0; i < bytes.length; ++i ) {
            result += strof(apiEncoder.update(bytes.subarray(i, i + 1)));
        }
        
        assert.equal(result, expect[0]);
    });
    
    it(`update one by one chunks. => "000102030405060708090a0b0c0d0e0f".repeat(10)`, function() {
        apiEncoder.reset();
        
        var bytes  = inputs[0];
        var result = "";
        
        for ( var i = 0; i < 10; ++i ) {
            result += strof(apiEncoder.update(bytes));
        }
        
        assert.equal(result, expect[0].repeat(10));
    });
});