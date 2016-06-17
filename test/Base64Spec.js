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
import Base64Encoder from "../src/data/codec/Base64Encoder";
import Base64Decoder from "../src/data/codec/Base64Decoder";
import Base64URLSafeEncoder from "../src/data/codec/Base64URLSafeEncoder";
import Base64URLSafeDecoder from "../src/data/codec/Base64URLSafeDecoder";
import ascii from "../src/data/utils/ascii";
import strof from "../src/data/utils/strof";
import passlog from "./helper/passlog";
import errorlog from "./helper/errorlog";
import catchError from "./helper/catchError";

const b64Encoder = new Base64Encoder();
const b64Decoder = new Base64Decoder();
const b64UrlEncoder = new Base64URLSafeEncoder();
const b64UrlDecoder = new Base64URLSafeDecoder();

export default function () {
    console.log("[Start Base64 Test Suite]:");
    
    test_base64_encode("", "");
    test_base64_encode("f", "Zg==");
    test_base64_encode("fo", "Zm8=");
    test_base64_encode("foo", "Zm9v");
    test_base64_encode("foob", "Zm9vYg==");
    test_base64_encode("fooba", "Zm9vYmE=");
    test_base64_encode("foobar", "Zm9vYmFy");
    test_base64_encode("fo>br?", "Zm8+YnI/");

    test_base64_url_encode("", "");
    test_base64_url_encode("fo>br?", "Zm8-YnI_");

    test_base64_decode("", "");
    test_base64_decode("Zg==", "f");
    test_base64_decode("Zg", "f");
    test_base64_decode("Zm8=", "fo");
    test_base64_decode("Zm8", "fo");
    test_base64_decode("Zm9v", "foo");
    test_base64_decode("Zm9vYg==", "foob");
    test_base64_decode("Zm9vYg", "foob");
    test_base64_decode("Zm9vYmE=", "fooba");
    test_base64_decode("Zm9vYmE", "fooba");
    test_base64_decode("Zm9vYmFy", "foobar");

    test_base64_url_decode("", "");
    test_base64_url_decode("Zm8-YnI_", "fo>br?");

    // errors;
    test_decode_error("$");
    test_decode_error("$$");
    test_decode_error("Zm9v$$$$");
}

function test_base64_encode( input, expect ) {
    b64Encoder.reset();
    
    var result = strof(b64Encoder.update( ascii(input) ));
        result += strof(b64Encoder.final());
    
    assert(result == expect, "base64 encode does not match." + ` { input="${input}", expect="${expect}", result="${result}" }`);
    passlog(`"${input}"`, `"${result}"`);
}

function test_base64_decode( input, expect ) {
    b64Decoder.reset();
    
    var result = strof(b64Decoder.update( ascii(input) ));
        result += strof(b64Decoder.final());
    
    assert(result == expect, "base64 decode does not match." + ` { input="${input}", expect="${expect}", result="${result}" }`);
    passlog(`"${input}"`, `"${result}"`);
}

function test_base64_url_encode( input, expect ) {
    b64UrlEncoder.reset();
    
    var result = strof(b64UrlEncoder.update( ascii(input) ));
        result += strof(b64UrlEncoder.final());
    
    assert(result == expect, "base64-url-safe encode does not match." + ` { input="${input}", expect="${expect}", result="${result}" }`);
    passlog(`"${input}"`, `"${result}" [url-safe]`);
}

function test_base64_url_decode( input, expect ) {
    b64UrlDecoder.reset();
    
    var result = strof(b64UrlDecoder.update( ascii(input) ));
        result += strof(b64UrlDecoder.final());
    
    assert(result == expect, "base64-url-safe decode does not match." + ` { input="${input}", expect="${expect}", result="${result}" }`);
    passlog(`"${input}"`, `"${result}" [url-safe]`);
}

function test_decode_error( input ) {
    var message = catchError(function() {
        b64Decoder.reset();
        b64Decoder.update(ascii(input));
        b64Decoder.final();
    });
    
    assert(message !== null, "base64 decode does not throw error." + ` { input="${input}" }`);
    errorlog(`"${input}"`, `"${message}"`);
}