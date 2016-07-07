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
const X = new Uint32Array(64);
const W = new Uint32Array(16);
const L = new Uint32Array(2);

function AC( w, s ) { var t = s << 3 >>> 0; w[0] += t; w[1] += (s >>> 29) + (w[0] < t); }
function FF( a, b, c, d, x, s, ac ) { a += ((b & c) | ((~b) & d)) + x + ac; a = ((a << s) | (a >>> (32 - s))); return a + b; }
function GG( a, b, c, d, x, s, ac ) { a += ((b & d) | (c & (~d))) + x + ac; a = ((a << s) | (a >>> (32 - s))); return a + b; }
function HH( a, b, c, d, x, s, ac ) { a += (b ^ c ^ d) + x + ac; a = ((a << s) | (a >>> (32 - s))); return a + b; }
function II( a, b, c, d, x, s, ac ) { a += (c ^ (b | (~d))) + x + ac; a = ((a << s) | (a >>> (32 - s))); return a + b; }

export default class MD5 extends Hash {
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
            X.set(new Uint8Array(this._length.buffer), 56);
            this._transfrom(this.buffer);
            this._transfrom(X);
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
            a = FF(a, b, c, d, W[ 0],  7, 0xd76aa478);
            d = FF(d, a, b, c, W[ 1], 12, 0xe8c7b756);
            c = FF(c, d, a, b, W[ 2], 17, 0x242070db);
            b = FF(b, c, d, a, W[ 3], 22, 0xc1bdceee);
            a = FF(a, b, c, d, W[ 4],  7, 0xf57c0faf);
            d = FF(d, a, b, c, W[ 5], 12, 0x4787c62a);
            c = FF(c, d, a, b, W[ 6], 17, 0xa8304613);
            b = FF(b, c, d, a, W[ 7], 22, 0xfd469501);
            a = FF(a, b, c, d, W[ 8],  7, 0x698098d8);
            d = FF(d, a, b, c, W[ 9], 12, 0x8b44f7af);
            c = FF(c, d, a, b, W[10], 17, 0xffff5bb1);
            b = FF(b, c, d, a, W[11], 22, 0x895cd7be);
            a = FF(a, b, c, d, W[12],  7, 0x6b901122);
            d = FF(d, a, b, c, W[13], 12, 0xfd987193);
            c = FF(c, d, a, b, W[14], 17, 0xa679438e);
            b = FF(b, c, d, a, W[15], 22, 0x49b40821);

            /* Round 2 */
            a = GG(a, b, c, d, W[ 1],  5, 0xf61e2562);
            d = GG(d, a, b, c, W[ 6],  9, 0xc040b340);
            c = GG(c, d, a, b, W[11], 14, 0x265e5a51);
            b = GG(b, c, d, a, W[ 0], 20, 0xe9b6c7aa);
            a = GG(a, b, c, d, W[ 5],  5, 0xd62f105d);
            d = GG(d, a, b, c, W[10],  9, 0x02441453);
            c = GG(c, d, a, b, W[15], 14, 0xd8a1e681);
            b = GG(b, c, d, a, W[ 4], 20, 0xe7d3fbc8);
            a = GG(a, b, c, d, W[ 9],  5, 0x21e1cde6);
            d = GG(d, a, b, c, W[14],  9, 0xc33707d6);
            c = GG(c, d, a, b, W[ 3], 14, 0xf4d50d87);
            b = GG(b, c, d, a, W[ 8], 20, 0x455a14ed);
            a = GG(a, b, c, d, W[13],  5, 0xa9e3e905);
            d = GG(d, a, b, c, W[ 2],  9, 0xfcefa3f8);
            c = GG(c, d, a, b, W[ 7], 14, 0x676f02d9);
            b = GG(b, c, d, a, W[12], 20, 0x8d2a4c8a);

            /* Round 3 */
            a = HH(a, b, c, d, W[ 5],  4, 0xfffa3942);
            d = HH(d, a, b, c, W[ 8], 11, 0x8771f681);
            c = HH(c, d, a, b, W[11], 16, 0x6d9d6122);
            b = HH(b, c, d, a, W[14], 23, 0xfde5380c);
            a = HH(a, b, c, d, W[ 1],  4, 0xa4beea44);
            d = HH(d, a, b, c, W[ 4], 11, 0x4bdecfa9);
            c = HH(c, d, a, b, W[ 7], 16, 0xf6bb4b60);
            b = HH(b, c, d, a, W[10], 23, 0xbebfbc70);
            a = HH(a, b, c, d, W[13],  4, 0x289b7ec6);
            d = HH(d, a, b, c, W[ 0], 11, 0xeaa127fa);
            c = HH(c, d, a, b, W[ 3], 16, 0xd4ef3085);
            b = HH(b, c, d, a, W[ 6], 23, 0x04881d05);
            a = HH(a, b, c, d, W[ 9],  4, 0xd9d4d039);
            d = HH(d, a, b, c, W[12], 11, 0xe6db99e5);
            c = HH(c, d, a, b, W[15], 16, 0x1fa27cf8);
            b = HH(b, c, d, a, W[ 2], 23, 0xc4ac5665);

            /* Round 4 */
            a = II(a, b, c, d, W[ 0],  6, 0xf4292244);
            d = II(d, a, b, c, W[ 7], 10, 0x432aff97);
            c = II(c, d, a, b, W[14], 15, 0xab9423a7);
            b = II(b, c, d, a, W[ 5], 21, 0xfc93a039);
            a = II(a, b, c, d, W[12],  6, 0x655b59c3);
            d = II(d, a, b, c, W[ 3], 10, 0x8f0ccc92);
            c = II(c, d, a, b, W[10], 15, 0xffeff47d);
            b = II(b, c, d, a, W[ 1], 21, 0x85845dd1);
            a = II(a, b, c, d, W[ 8],  6, 0x6fa87e4f);
            d = II(d, a, b, c, W[15], 10, 0xfe2ce6e0);
            c = II(c, d, a, b, W[ 6], 15, 0xa3014314);
            b = II(b, c, d, a, W[13], 21, 0x4e0811a1);
            a = II(a, b, c, d, W[ 4],  6, 0xf7537e82);
            d = II(d, a, b, c, W[11], 10, 0xbd3af235);
            c = II(c, d, a, b, W[ 2], 15, 0x2ad7d2bb);
            b = II(b, c, d, a, W[ 9], 21, 0xeb86d391);
            
            this._digest[0] += a;
            this._digest[1] += b;
            this._digest[2] += c;
            this._digest[3] += d;
        }
    }
}