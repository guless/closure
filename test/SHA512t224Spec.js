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
import SHA512t224 from "../src/data/crypto/SHA512t224";
import hexof from "../src/data/utils/hexof";
import ascii from "../src/data/utils/ascii";
import passlog from "./helper/passlog";

var SHA512t224API = new SHA512t224();

export default function () {
    console.log("[Start SHA512t224 Test Suite]:");
    
    test_SHA512t224("", "6ed0dd02806fa89e25de060c19d3ac86cabb87d6a0ddd05c333b84f4");
    test_SHA512t224("a", "d5cdb9ccc769a5121d4175f2bfdd13d6310e0d3d361ea75d82108327");
    test_SHA512t224("abc", "4634270f707b6a54daae7530460842e20e37ed265ceee9a43e8924aa");
    test_SHA512t224("Secure Hash Algorithm", "4a2eab100da5b86c9e88f94bc5b009d7e4edcd1ebad3b571016cae8e");
    test_SHA512t224("abcdefghijklmnopqrstuvwxyz", "ff83148aa07ec30655c1b40aff86141c0215fe2a54f767d3f38743d8");
    test_SHA512t224("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "a8b4b9174b99ffc67d6f49be9981587b96441051e16e6dd036b140d3");
    test_SHA512t224("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "ae988faaa47e401a45f704d1272d99702458fea2ddc6582827556dd2");
}

function test_SHA512t224( input, expect ) {
    SHA512t224API = new SHA512t224();
    SHA512t224API.update( ascii(input) );
    
    var result = hexof(SHA512t224API.final());
    assert(result == expect, "SHA512t224 does not match." + ` { input="${input}", expect="${expect}", result="${result}" }`);
    passlog(`"${input}"`, `"${result}"`);
}