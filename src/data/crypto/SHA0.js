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
import SHA1 from "./SHA1";

const SWAPER = new Uint32Array(80);

export default class SHA0 extends SHA1 {
    constructor() {
        super();
    }
    
    _transfrom( bytes ) {
        var dataview = new DataView(bytes.buffer, bytes.byteOffset);
        
        for ( var start = 0; start + 64 <= bytes.length; start += 64 ) {
            for ( var t = 0; t < 16; ++t ) {
                SWAPER[t] = dataview.getUint32(start + 4 * t, false);
            }
            
            for ( var t = 16; t < 80; ++t ) {
                SWAPER[t] = SWAPER[t - 3] ^ SWAPER[t - 8] ^ SWAPER[t - 14] ^ SWAPER[t - 16];
                /// #NOTICE: This is only difference between SHA-0 and SHA-1 algorithm.
                /// SWAPER[t] = ((SWAPER[t] << 1) | (SWAPER[t] >>> 31));
            }

            var T = 0;
            var A = this._digest[0];
            var B = this._digest[1];
            var C = this._digest[2];
            var D = this._digest[3];
            var E = this._digest[4];
            
            for ( var t = 0; t < 20; ++t ) {
                T = ((A << 5) | (A >>> 27)) + ((B & C) | ((~B) & D)) + E + SWAPER[t] + 0x5A827999;
                E = D;
                D = C;
                C = ((B << 30) | (B >>> 2));
                B = A;
                A = T;
            }

            for ( var t = 20; t < 40; ++t ) {
                T = ((A << 5) | (A >>> 27)) + (B ^ C ^ D) + E + SWAPER[t] + 0x6ED9EBA1;
                E = D;
                D = C;
                C = ((B << 30) | (B >>> 2));
                B = A;
                A = T;
            }
            
            for ( var t = 40; t < 60; ++t ) {
                T = ((A << 5) | (A >>> 27)) + ((B & C) | (B & D) | (C & D)) + E + SWAPER[t] + 0x8F1BBCDC;
                E = D;
                D = C;
                C = ((B << 30) | (B >>> 2));
                B = A;
                A = T;
            }
            
            for ( var t = 60; t < 80; ++t ) {
                T = ((A << 5) | (A >>> 27)) + (B ^ C ^ D) + E + SWAPER[t] + 0xCA62C1D6;
                E = D;
                D = C;
                C = ((B << 30) | (B >>> 2));
                B = A;
                A = T;
            }
            
            this._digest[0] += A;
            this._digest[1] += B;
            this._digest[2] += C;
            this._digest[3] += D;
            this._digest[4] += E;
        }
    }
}
