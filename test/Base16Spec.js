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
import assert        from "../src/core/assert";
import Base16Encoder from "../src/data/codec/Base16Encoder";
import Base16Decoder from "../src/data/codec/Base16Decoder";
import ascii         from "../src/data/utils/ascii";
import strof         from "../src/data/utils/strof";
import passlog       from "./helper/passlog";
import errorlog      from "./helper/errorlog";
import arrayEqual    from "./helper/arrayEqual";
import catchError    from "./helper/catchError";

const encoder = new Base16Encoder();
const decoder = new Base16Decoder();

const A1 = new Uint8Array(0);
const B1 = "";

const A2 = new Uint8Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
const B2 = "000102030405060708090a0b0c0d0e0f";

export default function () {
    console.log("[Start Base16 Test Suite]:");
    
    test_encode_base16(A1, B1);
    test_encode_base16(A2, B2);
    
    test_decode_base16(B1, A1);
    test_decode_base16(B2, A2);
    
    /// decode error:
    test_decode_error("XYZ");
    test_decode_error("abc");
}

function test_encode_base16( input, expect ) {
    var result = strof(encoder.update(input));
    
    assert(result == expect, "base16 encode does not match." + ` { input=[${input}], expect="${expect}", result="${result}" }`);
    passlog(`[${input}]`, `"${expect}"`);
}

function test_decode_base16( input, expect ) {
    decoder.reset();
    var result = decoder.update(ascii(input));
    decoder.final();
    
    assert(arrayEqual(result, expect), "base16 encode does not match." + ` { input="${input}", expect=[${expect}], result=[${result}] }`);
    passlog(`"${input}"`, `[${expect}]`);
}

function test_decode_error( input ) {
    var message = catchError(function() {
        decoder.reset();
        decoder.update(ascii(input));
        decoder.final();
    });
    
    assert(message !== null, "base16 decode does not throw error." + ` { input="${input}" }`);
    errorlog(`"${input}"`, `"${message}"`);
}