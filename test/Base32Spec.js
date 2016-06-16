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
import Base32Encoder from "../src/data/codec/Base32Encoder";
import Base32Decoder from "../src/data/codec/Base32Decoder";
import Base32HexEncoder from "../src/data/codec/Base32HexEncoder";
import Base32HexDecoder from "../src/data/codec/Base32HexDecoder";
import ascii from "../src/data/utils/ascii";
import strof from "../src/data/utils/strof";
import passlog from "./helper/passlog";
import errorlog from "./helper/errorlog";
import catchError from "./helper/catchError";

const b32Encoder = new Base32Encoder();
const b32Decoder = new Base32Decoder();
const b32HexEncoder = new Base32HexEncoder();
const b32HexDecoder = new Base32HexDecoder();

export default function () {
    console.log("[Start Base32 Test Suite]:");
    
    test_base32_encode("", "");
    test_base32_encode("f", "MY======");
    test_base32_encode("fo", "MZXQ====");
    test_base32_encode("foo", "MZXW6===");
    test_base32_encode("foob", "MZXW6YQ=");
    test_base32_encode("fooba", "MZXW6YTB");
    test_base32_encode("foobar", "MZXW6YTBOI======");
    
    test_base32_hex_encode("", "");
    test_base32_hex_encode("f", "CO======");
    test_base32_hex_encode("fo", "CPNG====");
    test_base32_hex_encode("foo", "CPNMU===");
    test_base32_hex_encode("foob", "CPNMUOG=");
    test_base32_hex_encode("fooba", "CPNMUOJ1");
    test_base32_hex_encode("foobar", "CPNMUOJ1E8======");
    
    test_base32_decode("", "");
    test_base32_decode("MY======", "f");
    test_base32_decode("MY", "f");
    test_base32_decode("MZXQ====", "fo");
    test_base32_decode("MZXQ", "fo");
    test_base32_decode("MZXW6===", "foo");
    test_base32_decode("MZXW6", "foo");
    test_base32_decode("MZXW6YQ=", "foob");
    test_base32_decode("MZXW6YQ", "foob");
    test_base32_decode("MZXW6YTB", "fooba");
    test_base32_decode("MZXW6YTBOI======", "foobar");
    test_base32_decode("MZXW6YTBOI", "foobar");
    
    // errors;
    test_decode_error("0");
    test_decode_error("00");
    test_decode_error("MZXW6YTB00000000");
}

function test_base32_encode( input, expect ) {
    b32Encoder.reset();
    
    var result = strof(b32Encoder.update( ascii(input) ));
        result += strof(b32Encoder.final());
    
    assert(result == expect, "base32 encode does not match." + ` { input="${input}", expect="${expect}", result="${result}" }`);
    passlog(`"${input}"`, `"${result}"`);
}

function test_base32_decode( input, expect ) {
    b32Decoder.reset();
    
    var result = strof(b32Decoder.update( ascii(input) ));
        result += strof(b32Decoder.final());
    
    assert(result == expect, "base32 decode does not match." + ` { input="${input}", expect="${expect}", result="${result}" }`);
    passlog(`"${input}"`, `"${result}"`);
}

function test_base32_hex_encode( input, expect ) {
    b32HexEncoder.reset();
    
    var result = strof(b32HexEncoder.update( ascii(input) ));
        result += strof(b32HexEncoder.final());
    
    assert(result == expect, "base32-hex encode does not match." + ` { input="${input}", expect="${expect}", result="${result}" }`);
    passlog(`"${input}"`, `"${result}" [extended-hex]`);
}

function test_base32_hex_decode( input, expect ) {
    b32HexDecoder.reset();
    
    var result = strof(b32HexDecoder.update( ascii(input) ));
        result += strof(b32HexDecoder.final());
    
    assert(result == expect, "base32-hex decode does not match." + ` { input="${input}", expect="${expect}", result="${result}" }`);
    passlog(`"${input}"`, `"${result}" [extended-hex]`);
}

function test_decode_error( input ) {
    var message = catchError(function() {
        b32Decoder.reset();
        b32Decoder.update(ascii(input));
        b32Decoder.final();
    });
    
    assert(message !== null, "base32 decode does not throw error." + ` { input="${input}" }`);
    errorlog(`"${input}"`, `"${message}"`);
}