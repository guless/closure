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
import SHA512 from "./SHA512";
    
const H1_0 = 0x22312194;
const H1_1 = 0xFC2BF72C;
const H2_0 = 0x9F555FA3;
const H2_1 = 0xC84C64C2;
const H3_0 = 0x2393B86B;
const H3_1 = 0x6F53B151;
const H4_0 = 0x96387719;
const H4_1 = 0x5940EABD;
const H5_0 = 0x96283EE2;
const H5_1 = 0xA88EFFE3;
const H6_0 = 0xBE5E1E25;
const H6_1 = 0x53863992;
const H7_0 = 0x2B0199FC;
const H7_1 = 0x2C85B8AA;
const H8_0 = 0x0EB72DDC;
const H8_1 = 0x81C52CA2;

export default class SHA512t256 extends SHA512 {
    constructor() {
        super();
        this._resetDigest();
    }
    
    _resetDigest() {
        this._digest[ 0] = H1_0;
        this._digest[ 1] = H1_1;
        this._digest[ 2] = H2_0;
        this._digest[ 3] = H2_1;
        this._digest[ 4] = H3_0;
        this._digest[ 5] = H3_1;
        this._digest[ 6] = H4_0;
        this._digest[ 7] = H4_1;
        this._digest[ 8] = H5_0;
        this._digest[ 9] = H5_1;
        this._digest[10] = H6_0;
        this._digest[11] = H6_1;
        this._digest[12] = H7_0;
        this._digest[13] = H7_1;
        this._digest[14] = H8_0;
        this._digest[15] = H8_1;
    }
    
    reset() {
        super.reset();
        this._resetDigest();
    }
    
    final() {
        return super.final().subarray(0, 8);
    }
}