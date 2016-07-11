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

const H = new Uint32Array([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476]);
const P = new Uint32Array(64); P[0] = 0x80;
const A = new Uint32Array(64);
const W = new Uint32Array(16);
const L = new Uint32Array(2);

function AC( w, s ) { var t = s << 3 >>> 0; w[0] += t; w[1] += (s >>> 29) + (w[0] < t); }
function FF( a, b, c, d, x, s ) { a += ((b & c) | ((~b) & d)) + x; return ((a << s) | (a >>> (32 - s))); }
function GG( a, b, c, d, x, s ) { a += ((b & c) | (b & d) | (c & d)) + x + 0x5a827999; return ((a << s) | (a >>> (32 - s))); }
function HH( a, b, c, d, x, s ) { a += (b ^ c ^ d) + x + 0x6ed9eba1; return ((a << s) | (a >>> (32 - s))); }

export default class MD4 extends Hash {
    constructor() {
        super(new Uint8Array(64));
        this._digest = new Uint32Array(H);
        this._length = new Uint32Array(L);
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
            this.buffer.set(new Uint8Array(this._length.buffer), 56);
            this._transfrom(this.buffer);
        }
        
        else {
            A.set(new Uint8Array(this._length.buffer), 56);
            this._transfrom(this.buffer);
            this._transfrom(A);
        }
        
        return swap32(this._digest);
    }
    
    _transfrom( bytes ) {
        for ( var start = 0; start + 64 <= bytes.length; start += 64 ) {
            var a = this._digest[0];
            var b = this._digest[1];
            var c = this._digest[2];
            var d = this._digest[3];
            
            for ( var t = 0, k = start; t < 16; ++t, k += 4 ) {
                W[t] = (bytes[k]) | (bytes[k + 1] << 8) | (bytes[k + 2] << 16) | (bytes[k + 3] << 24);
            }
            
            /* Round 1 */
            a = FF(a, b, c, d, W[ 0],  3);
            d = FF(d, a, b, c, W[ 1],  7);
            c = FF(c, d, a, b, W[ 2], 11);
            b = FF(b, c, d, a, W[ 3], 19);
            a = FF(a, b, c, d, W[ 4],  3);
            d = FF(d, a, b, c, W[ 5],  7);
            c = FF(c, d, a, b, W[ 6], 11);
            b = FF(b, c, d, a, W[ 7], 19);
            a = FF(a, b, c, d, W[ 8],  3);
            d = FF(d, a, b, c, W[ 9],  7);
            c = FF(c, d, a, b, W[10], 11);
            b = FF(b, c, d, a, W[11], 19);
            a = FF(a, b, c, d, W[12],  3);
            d = FF(d, a, b, c, W[13],  7);
            c = FF(c, d, a, b, W[14], 11);
            b = FF(b, c, d, a, W[15], 19);

            /* Round 2 */
            a = GG(a, b, c, d, W[ 0],  3);
            d = GG(d, a, b, c, W[ 4],  5);
            c = GG(c, d, a, b, W[ 8],  9);
            b = GG(b, c, d, a, W[12], 13);
            a = GG(a, b, c, d, W[ 1],  3);
            d = GG(d, a, b, c, W[ 5],  5);
            c = GG(c, d, a, b, W[ 9],  9);
            b = GG(b, c, d, a, W[13], 13);
            a = GG(a, b, c, d, W[ 2],  3);
            d = GG(d, a, b, c, W[ 6],  5);
            c = GG(c, d, a, b, W[10],  9);
            b = GG(b, c, d, a, W[14], 13);
            a = GG(a, b, c, d, W[ 3],  3);
            d = GG(d, a, b, c, W[ 7],  5);
            c = GG(c, d, a, b, W[11],  9);
            b = GG(b, c, d, a, W[15], 13);
            
            /* Round 3 */
            a = HH(a, b, c, d, W[ 0],  3);
            d = HH(d, a, b, c, W[ 8],  9);
            c = HH(c, d, a, b, W[ 4], 11);
            b = HH(b, c, d, a, W[12], 15);
            a = HH(a, b, c, d, W[ 2],  3);
            d = HH(d, a, b, c, W[10],  9);
            c = HH(c, d, a, b, W[ 6], 11);
            b = HH(b, c, d, a, W[14], 15);
            a = HH(a, b, c, d, W[ 1],  3);
            d = HH(d, a, b, c, W[ 9],  9);
            c = HH(c, d, a, b, W[ 5], 11);
            b = HH(b, c, d, a, W[13], 15);
            a = HH(a, b, c, d, W[ 3],  3);
            d = HH(d, a, b, c, W[11],  9);
            c = HH(c, d, a, b, W[ 7], 11);
            b = HH(b, c, d, a, W[15], 15);
            
            this._digest[0] += a;
            this._digest[1] += b;
            this._digest[2] += c;
            this._digest[3] += d;
        }
    }
}