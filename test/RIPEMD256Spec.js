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
import RIPEMD256 from "../src/data/crypto/RIPEMD256";
import hexof from "../src/data/utils/hexof";
import ascii from "../src/data/utils/ascii";
import passlog from "./helper/passlog";

const RIPEMD256API = new RIPEMD256();

export default function () {
    console.log("[Start RIPEMD256 Test Suite]:");
    
    test_repimd256("", "02ba4c4e5f8ecd1877fc52d64d30e37a2d9774fb1e5d026380ae0168e3c5522d");
    test_repimd256("a", "f9333e45d857f5d90a91bab70a1eba0cfb1be4b0783c9acfcd883a9134692925");
    test_repimd256("abc", "afbd6e228b9d8cbbcef5ca2d03e6dba10ac0bc7dcbe4680e1e42d2e975459b65");
    test_repimd256("message digest", "87e971759a1ce47a514d5c914c392c9018c7c46bc14465554afcdf54a5070c0e");
    test_repimd256("abcdefghijklmnopqrstuvwxyz", "649d3034751ea216776bf9a18acc81bc7896118a5197968782dd1fd97d8d5133");
    test_repimd256("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "5740a408ac16b720b84424ae931cbb1fe363d1d0bf4017f1a89f7ea6de77a0b8");
    test_repimd256("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "06fdcc7a409548aaf91368c06a6275b553e3f099bf0ea4edfd6778df89a890dd");
}

function test_repimd256( input, expect ) {
    RIPEMD256API.reset();
    RIPEMD256API.update( ascii(input) );
    
    var result = hexof(RIPEMD256API.final());
    assert(result == expect, "RIPEMD256 does not match." + ` { input="${input}", expect="${expect}", result="${result}" }`);
    passlog(`"${input}"`, `"${result}"`);
}