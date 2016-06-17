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
import assert from "../src/core/assert";
import UTF8Encoder from "../src/data/codec/UTF8Encoder";
import UTF8Decoder from "../src/data/codec/UTF8Decoder";
import Base16Decoder from "../src/data/codec/Base16Decoder";
import ascii from "../src/data/utils/ascii";
import hexof from "../src/data/utils/hexof";
import strof from "../src/data/utils/strof";
import utf8  from "../src/data/utils/utf8";
import utf16 from "../src/data/utils/utf16";
import passlog from "./helper/passlog";
import errorlog from "./helper/errorlog";
import catchError from "./helper/catchError";

const utf8Encoder = new UTF8Encoder();
const utf8Decoder = new UTF8Decoder();
const b16API = new Base16Decoder();

export default function () {
    console.log("[Start UTF-8 Test Suite]:");
    
    test_utf8_encode("中国abc123", "e4b8ade59bbd616263313233");
    test_utf8_encode("一种针对Unicode的可变长度字符编码", utf8_native("一种针对Unicode的可变长度字符编码"));
    
    test_utf8_decode("e4b8ade59bbd616263313233", "中国abc123");
    test_utf8_decode(utf8_native("一种针对Unicode的可变长度字符编码"), "一种针对Unicode的可变长度字符编码");
    
    /// errors:
    test_utf8_encode_error(new Uint16Array([ 0xDC01 ]));
    test_utf8_encode_error(new Uint16Array([ 0xD800, 0xD800 ]));
    test_utf8_encode_error(new Uint16Array([ 0xD800 ]));
    
    test_utf8_decode_error(new Uint8Array([ 0xC1 ]));
    test_utf8_decode_error(new Uint8Array([ 0xF0, 0x7f, 0x7f ]));
    test_utf8_decode_error(new Uint8Array([ 0xE0, 0x7f ]));
    test_utf8_decode_error(new Uint8Array([ 0xC3 ]));
    
    test_utf8_decode_error(new Uint8Array([ 0xF0, 0x7f, 0x7f, 0x7f ]));
    test_utf8_decode_error(new Uint8Array([ 0xC3, 0x7f ]));
}

function utf8_native( string ) {
    return encodeURIComponent(string).replace(/%[A-F0-9]{2}|[\u0000-\u00ff]/ig, function( match ) {
        if ( match.charAt(0) == "%" ) { return match.slice(1).toLowerCase(); }
        return ("00" + match.charCodeAt(0).toString(16)).slice(-2);
    });
}

function hexfrom( hexString ) {
    b16API.reset();
    
    return b16API.update(ascii(hexString));
}

function test_utf8_encode( input, expect ) {
    var result = hexof(utf8(input));
        
    assert(result == expect, "utf-8 encode does not match." + ` { input="${input}", expect="${expect}", result="${result}" }`);
    passlog(`"${input}"`, `"${result}"`);
}

function test_utf8_decode( input, expect ) {
    utf8Decoder.reset();
    
    var result  = strof(utf8Decoder.update(hexfrom(input)));
        result += strof(utf8Decoder.final());
    
    assert(result == expect, "utf-8 decode does not match." + ` { input="${input}", expect="${expect}", result="${result}" }`);
    passlog(`"${input}"`, `"${result}"`);
}

function test_utf8_encode_error( input ) {
    var message = catchError(function() {
        utf8Encoder.reset();
        utf8Encoder.update(input);
        utf8Encoder.final();
    });
    
    assert(message !== null, "utf-8 encode does not throw error." + ` { input=[${input}] }`);
    errorlog(`[${input}]`, `"${message}"`);
}

function test_utf8_decode_error( input ) {
    var message = catchError(function() {
        utf8Decoder.reset();
        utf8Decoder.update(input);
        utf8Decoder.final();
    });
    
    assert(message !== null, "utf-8 decode does not throw error." + ` { input=[${input}] }`);
    errorlog(`[${input}]`, `"${message}"`);
}

