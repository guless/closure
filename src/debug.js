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
import UTF8 from "./data/codec/UTF8";
import Base16 from "./data/codec/Base16";
import tobytes from "./data/tobytes";
import tochars from "./data/tochars";


function uri( str ) {
    return encodeURIComponent(str).replace(/(%[0-9A-F]{2}|.)/g, function( match ) {
        if ( match.length == 1 ) {
            var s = match.charCodeAt(0).toString(16).toUpperCase();
            return s.length == 1 ? "0" + s : s;
        }
        
        else {
            return match.slice(1);
        }
    });
}

function utf( str ) {
    return tochars((new Base16()).encode((new UTF8()).encode(tobytes(str)))).toUpperCase();
}

function test( str ) {
    var s1 = uri(str);
    var s2 = utf(str);
    
    console.log("URI:", s1);
    console.log("UTF:", s2);
    console.log("Equals:", s1 == s2, "\n");
}

var ascii = new Uint8Array(128);
for ( var i = 0; i < ascii.length; ++i ) { ascii[i] = i; }
test(tochars(ascii, 1));
test("中国")
test("\ud83c\udc00");


console.log("[decode]-------------------------------------------------------------->");
var b16 = new Base16();
var bytes = b16.decode(tobytes("E4B8ADE59BBDF09F8080".toLowerCase(), 1));
console.log(bytes);

bytes = (new UTF8()).decode(bytes);
console.log(tochars(bytes));
