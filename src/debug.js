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
import tobytes from "./data/tobytes";
import tochars from "./data/tochars";
import MD5 from "./data/crypto/MD5";
import MD4 from "./data/crypto/MD4";
import Base16 from "./data/codec/Base16";


function test( str, dat ) {
    var b16 = new Base16();
    var md5 = tochars(b16.encode((new MD5()).update(tobytes(str,1)).digest()));
    
    console.log("str:", str);
    console.log("dat:", dat);
    console.log("md5:", md5);
    console.log("equal:", md5 == dat);
}

function test_md4( str, dat ) {
    var b16 = new Base16();
    var md4 = tochars(b16.encode((new MD4()).update(tobytes(str,1)).digest()));
    
    console.log("str:", str);
    console.log("dat:", dat);
    console.log("md4:", md4);
    console.log("equal:", md4 == dat);
}

// MD5 test suite:
// MD5 ("") = d41d8cd98f00b204e9800998ecf8427e
// MD5 ("a") = 0cc175b9c0f1b6a831c399e269772661
// MD5 ("abc") = 900150983cd24fb0d6963f7d28e17f72
// MD5 ("message digest") = f96b697d7cb7938d525a2f31aaf161d0
// MD5 ("abcdefghijklmnopqrstuvwxyz") = c3fcd3d76192e4007dfb496cca67e13b
// MD5 ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") =
// d174ab98d277d9f5a5611c2c9f419d9f
// MD5 ("12345678901234567890123456789012345678901234567890123456789012345678901234567890") = 57edf4a22be3c955ac49da2e2107b67a

test("", "d41d8cd98f00b204e9800998ecf8427e");
test("a", "0cc175b9c0f1b6a831c399e269772661");
test("abc", "900150983cd24fb0d6963f7d28e17f72");
test("message digest", "f96b697d7cb7938d525a2f31aaf161d0");
test("abcdefghijklmnopqrstuvwxyz", "c3fcd3d76192e4007dfb496cca67e13b");
test("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "d174ab98d277d9f5a5611c2c9f419d9f");
test("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "57edf4a22be3c955ac49da2e2107b67a");

console.log("Test-MD4:-------------------->");

// MD4 test suite:
// MD4 ("") = 31d6cfe0d16ae931b73c59d7e0c089c0
// MD4 ("a") = bde52cb31de33e46245e05fbdbd6fb24
// MD4 ("abc") = a448017aaf21d8525fc10ae87aa6729d
// MD4 ("message digest") = d9130a8164549fe818874806e1c7014b
// MD4 ("abcdefghijklmnopqrstuvwxyz") = d79e1c308aa5bbcdeea8ed63df412da9
// MD4 ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") =
// 043f8582f241db351ce627e153e7f0e4
// MD4 ("12345678901234567890123456789012345678901234567890123456789012345678901234567890") = e33b4ddc9c38f2199c3e7b164fcc0536

test_md4("", "31d6cfe0d16ae931b73c59d7e0c089c0");
test_md4("a", "bde52cb31de33e46245e05fbdbd6fb24");
test_md4("abc", "a448017aaf21d8525fc10ae87aa6729d");
test_md4("message digest", "d9130a8164549fe818874806e1c7014b");
test_md4("abcdefghijklmnopqrstuvwxyz", "d79e1c308aa5bbcdeea8ed63df412da9");
test_md4("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "043f8582f241db351ce627e153e7f0e4");
test_md4("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "e33b4ddc9c38f2199c3e7b164fcc0536");