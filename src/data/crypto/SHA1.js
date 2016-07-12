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
import Hash   from "./Hash";
import swap32 from "../utils/swap32";
import swap2  from "../utils/swap2";

const H = new Uint32Array([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
const P = new Uint32Array(64); P[0] = 0x80;
const A = new Uint32Array(64);
const W = new Uint32Array(80);
const L = new Uint32Array(2);

function AC( w, s ) { var t = s << 3 >>> 0; w[0] += t; w[1] += (s >>> 29) + (w[0] < t); }

export default class SHA1 extends Hash {
    constructor( isrotl = true ) {
        super(new Uint8Array(64));
        this._digest = new Uint32Array(H);
        this._length = new Uint32Array(L);
        this._isrotl = isrotl; 
    }
    
    reset() {
        super.reset();
        this._digest.set(H);
        this._length.set(L);
    }
    
    update( bytes ) {
        super.update(bytes);
        AC(this._length, bytes.length);
    }
    
    final() {
        this.buffer.set(P.subarray(0, this.remain), this.offset);
        
        if ( this.offset < 56 ) {
            this.buffer.set(new Uint8Array(swap2(swap32(this._length)).buffer), 56);
            this._transfrom(this.buffer);
        }
        
        else {
            A.set(new Uint8Array(swap2(swap32(this._length)).buffer), 56);
            this._transfrom(this.buffer);
            this._transfrom(A);
        }
        
        return this._digest;
    }
    
    _transfrom( bytes ) {
        for ( var start = 0; start + 64 <= bytes.length; start += 64 ) {
            for ( var t = 0, k = start; t < 16; ++t, k += 4 ) {
                W[t] = (bytes[k] << 24) | (bytes[k + 1] << 16) | (bytes[k + 2] << 8) | (bytes[k + 3]);
            }
            
            for ( var t = 16; t < 80; ++t ) {
                W[t] = W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16];
                
                if ( this._isrotl ) {
                    W[t] = ((W[t] << 1) | (W[t] >>> 31));
                }
            }
            
            var T = 0;
            var A = this._digest[0];
            var B = this._digest[1];
            var C = this._digest[2];
            var D = this._digest[3];
            var E = this._digest[4];
            
            for ( var t = 0; t < 20; ++t ) {
                T = ((A << 5) | (A >>> 27)) + ((B & C) | ((~B) & D)) + E + W[t] + 0x5A827999;
                E = D;
                D = C;
                C = ((B << 30) | (B >>> 2));
                B = A;
                A = T;
            }

            for ( var t = 20; t < 40; ++t ) {
                T = ((A << 5) | (A >>> 27)) + (B ^ C ^ D) + E + W[t] + 0x6ED9EBA1;
                E = D;
                D = C;
                C = ((B << 30) | (B >>> 2));
                B = A;
                A = T;
            }
            
            for ( var t = 40; t < 60; ++t ) {
                T = ((A << 5) | (A >>> 27)) + ((B & C) | (B & D) | (C & D)) + E + W[t] + 0x8F1BBCDC;
                E = D;
                D = C;
                C = ((B << 30) | (B >>> 2));
                B = A;
                A = T;
            }
            
            for ( var t = 60; t < 80; ++t ) {
                T = ((A << 5) | (A >>> 27)) + (B ^ C ^ D) + E + W[t] + 0xCA62C1D6;
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