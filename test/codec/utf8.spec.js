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
import UTF8Encoder   from "../../src/data/codec/UTF8Encoder";
import UTF8Decoder   from "../../src/data/codec/UTF8Decoder";
import Base16Decoder from "../../src/data/codec/Base16Decoder";
import strof         from "../../src/data/utils/strof";
import hexof         from "../../src/data/utils/hexof";
import ascii         from "../../src/data/utils/ascii";
import ucs2          from "../../src/data/utils/ucs2";
import concat        from "../../src/data/utils/concat";

var assert = require("assert");
var apiEncoder = new UTF8Encoder();
var apiDecoder = new UTF8Decoder();
var apiBase16  = new Base16Decoder();

function fakeString( a ) {
    return a;
}

function hexfo( s ) {
    apiBase16.reset();
    
    return apiBase16.update(ascii(s));
}

function utf8( s ) {
    apiEncoder.reset();
    
    var a = [
        apiEncoder.update(typeof s == "string" ? ucs2(s) : new Uint16Array(s)),
        apiEncoder.final()
    ];
        
    return concat(a);
}

function utf8_decode( s ) {
    apiDecoder.reset();
    
    var result  = strof( apiDecoder.update(hexfo(s)) );
        result += strof( apiDecoder.final() );
        
    return result;
}

describe("[ UTF-8(codec) ] Test Suite:", function() {
    it(`"中国" => "e4b8ade59bbd"`, function() {
        assert.equal(hexof(utf8("中国")), "e4b8ade59bbd");
    });
    
    it(`"e4b8ade59bbd" => "中国"`, function() {
        assert.equal(utf8_decode("e4b8ade59bbd"), "中国");
    });
    
    it(`"λβγ" => "cebbceb2ceb3"`, function() {
        assert.equal(hexof(utf8("λβγ")), "cebbceb2ceb3");
    });
    
    it(`"cebbceb2ceb3" => "λβγ"`, function() {
        assert.equal(utf8_decode("cebbceb2ceb3"), "λβγ");
    });
    
    it(`"abcdefghijklmnopqrstuvwxyz0123456789" => "6162636465666768696a6b6c6d6e6f707172737475767778797a30313233343536373839"`, function() {
        assert.equal(hexof(utf8("abcdefghijklmnopqrstuvwxyz0123456789")), "6162636465666768696a6b6c6d6e6f707172737475767778797a30313233343536373839");
    });
    
    it(`"6162636465666768696a6b6c6d6e6f707172737475767778797a30313233343536373839" => "abcdefghijklmnopqrstuvwxyz0123456789"`, function() {
        assert.equal(utf8_decode("6162636465666768696a6b6c6d6e6f707172737475767778797a30313233343536373839"), "abcdefghijklmnopqrstuvwxyz0123456789");
    });
    
    it(`"\ud83d\ude00\ud83d\ude01\ud83d\ude02" => "f09f9880f09f9881f09f9882"`, function() {
        assert.equal(hexof(utf8("\ud83d\ude00\ud83d\ude01\ud83d\ude02")), "f09f9880f09f9881f09f9882");
    });
    
    it(`"f09f9880f09f9881f09f9882" => "\ud83d\ude00\ud83d\ude01\ud83d\ude02"`, function() {
        assert.equal(utf8_decode("f09f9880f09f9881f09f9882"), "\ud83d\ude00\ud83d\ude01\ud83d\ude02");
    });
    
    it("should throws encounter an unpaired surrogate.", function() {
        assert.throws(function() { utf8(fakeString([ 0xDC00 ])); }, /Encounter an unpaired surrogate./)
    });
    
    it("should throws wrong size error.", function() {
        assert.throws(function() { utf8(fakeString([ 0xD800 ])); }, /Wrong size of utf-8 encoder's final chunk./)
    });
    
    it("should throws encounter an unpaired surrogate.", function() {
        assert.throws(function() { utf8(fakeString([ 0xD800, 0x0000 ])); }, /Encounter an unpaired surrogate./)
    });
    
    it(`(encode) update one by one chunks. => "e4b8ade59bbd".repeat(10)`, function() {
        apiEncoder.reset();
        
        var result = [];
        for ( var i = 0; i < 10; ++i ) {
            result.push( apiEncoder.update(ucs2("中国")) );
        }
        
        result.push( apiEncoder.final() );
        assert.equal( hexof(concat(result)), "e4b8ade59bbd".repeat(10) );
    });
    
    it(`(decode) update one by one chunks. => "中国".repeat(10)`, function() {
        var result = "";
        
        apiDecoder.reset();
        
        for ( var i = 0; i < 10; ++i ) {
            result += strof(apiDecoder.update(hexfo("e4b8ade59bbd")));
        }
        
        assert.equal(result, "中国".repeat(10));
    });
    
    it(`(encode) update one by one bytes. => "中国".repeat(10)`, function() {
        apiEncoder.reset();
        
        var result = [];
        var bytes  = ucs2("中国".repeat(10));
        
        for ( var i = 0; i < bytes.length; ++i ) {
            result.push( apiEncoder.update(bytes.subarray(i, i + 1)) );
        }
        
        assert.equal( hexof(concat(result)), "e4b8ade59bbd".repeat(10) );
    });
    
    it(`(decode) update one by one bytes. => "中国".repeat(10)`, function() {
        var bytes = hexfo("e4b8ade59bbd".repeat(10));
        var result = "";
        
        apiDecoder.reset();
        
        for ( var i = 0; i < bytes.length; ++i ) {
            result += strof(apiDecoder.update(bytes.subarray(i, i + 1)));
        }
        
        assert.equal(result, "中国".repeat(10));
    });
});