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
import Base16 from "./data/codec/Base16";
import Base32 from "./data/codec/Base32";
import Base64 from "./data/codec/Base64";
import { BASE16_UPPER_ENCODE_TABLE } from "./data/codec/Base16UpperTable";
import { BASE16_UPPER_DECODE_TABLE } from "./data/codec/Base16UpperTable";

function toBuffer( ascii ) {
    var buffer = new Uint8Array(ascii.length);
    for ( var i = 0; i < buffer.length; ++i ) {
        buffer[i] = ascii.charCodeAt(i);
    }
    return buffer;
}

function toString( buffer ) {
    return String.fromCharCode.apply(String, buffer);
}

function join( buffer ) {
    return "[" + Array.prototype.join.call(buffer, ",") + "]";
}

var base64 = new Base64();
/// \"Base64\" Test Vectors: 
///   BASE64("") = ""
///   BASE64("f") = "Zg=="
///   BASE64("fo") = "Zm8="
///   BASE64("foo") = "Zm9v"
///   BASE64("foob") = "Zm9vYg=="
///   BASE64("fooba") = "Zm9vYmE="
///   BASE64("foobar") = "Zm9vYmFy"
console.log("Base64-1:", toString(base64.encode(toBuffer(""))) == "" );
console.log("Base64-2:", toString(base64.encode(toBuffer("f"))) == "Zg==" );
console.log("Base64-3:", toString(base64.encode(toBuffer("fo"))) == "Zm8=" );
console.log("Base64-4:", toString(base64.encode(toBuffer("foo"))) == "Zm9v" );
console.log("Base64-5:", toString(base64.encode(toBuffer("foob"))) == "Zm9vYg==" );
console.log("Base64-6:", toString(base64.encode(toBuffer("fooba"))) == "Zm9vYmE=" );
console.log("Base64-7:", toString(base64.encode(toBuffer("foobar"))) == "Zm9vYmFy" );
console.log("Base64-8:", toString(base64.decode(toBuffer("Zm9vYg=="))) );
console.log("Base64-9:", toString(base64.decode(toBuffer("Zm9vYmE="))) );
console.log("Base64-0:", toString(base64.decode(toBuffer("Zm9vYmFy"))) );


var base16 = new Base16(BASE16_UPPER_ENCODE_TABLE, BASE16_UPPER_DECODE_TABLE);
/// \"Base16\" Test Vectors:
///   BASE16([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) == "000102030405060708090A0B0C0D0E0F"
console.log( "Base16-1:", toString(base16.encode(new Uint8Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]))) == "000102030405060708090A0B0C0D0E0F" );
console.log( "Base16-2:", join(base16.decode(toBuffer("000102030405060708090A0B0C0D0E0F"))) );


var base32 = new Base32();
/// \"Base32\" Test Vectors:
///   BASE32("") = ""
///   BASE32("foo") = "MZXW6==="
///   BASE32("foob") = "MZXW6YQ="
///   BASE32("fooba") = "MZXW6YTB"
///   BASE32("foobar") = "MZXW6YTBOI======"
console.log("Base32-1:", toString(base32.encode(toBuffer(""))) == "" );
console.log("Base32-2:", toString(base32.encode(toBuffer("foo"))) == "MZXW6===" );
console.log("Base32-3:", toString(base32.encode(toBuffer("foob"))) == "MZXW6YQ=" );
console.log("Base32-4:", toString(base32.encode(toBuffer("fooba"))) == "MZXW6YTB" );
console.log("Base32-5:", toString(base32.encode(toBuffer("foobar"))) == "MZXW6YTBOI======" );
console.log("Base32-6:", toString(base32.encode(new Uint8Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]))));