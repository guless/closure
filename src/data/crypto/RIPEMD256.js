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

const H = new Uint32Array([
    0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476,
    0x76543210, 0xFEDCBA98, 0x89ABCDEF, 0x01234567 
]);

const P = new Uint32Array(64); P[0] = 0x80;
const A = new Uint32Array(64);
const W = new Uint32Array(16);
const L = new Uint32Array(2);

function AC ( w, s ) { var t = s << 3 >>> 0; w[0] += t; w[1] += (s >>> 29) + (w[0] < t); }
function FF ( a, b, c, d, x, s ) { a += (b ^ c ^ d) + x; return (a << s) | (a >>> 32 - s); }
function GG ( a, b, c, d, x, s ) { a += ((b & c) | (~b & d)) + x + 0x5a827999; return (a << s) | (a >>> 32 - s); }
function HH ( a, b, c, d, x, s ) { a += ((b | ~c) ^ d) + x + 0x6ed9eba1; return (a << s) | (a >>> 32 - s); }
function II ( a, b, c, d, x, s ) { a += ((b & d) | (c & ~d)) + x + 0x8f1bbcdc; return (a << s) | (a >>> 32 - s); }
function FFF( a, b, c, d, x, s ) { a += (b ^ c ^ d) + x; return (a << s) | (a >>> 32 - s); }
function GGG( a, b, c, d, x, s ) { a += ((b & c) | (~b & d)) + x + 0x6d703ef3; return (a << s) | (a >>> 32 - s); }
function HHH( a, b, c, d, x, s ) { a += ((b | ~c) ^ d) + x + 0x5c4dd124; return (a << s) | (a >>> 32 - s); }
function III( a, b, c, d, x, s ) { a += ((b & d) | (c & ~d)) + x + 0x50a28be6; return (a << s) | (a >>> 32 - s); }

export default class RIPEMD256 extends Hash {
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
            var aa  = this._digest[0];
            var bb  = this._digest[1];
            var cc  = this._digest[2];
            var dd  = this._digest[3];
            var aaa = this._digest[4];
            var bbb = this._digest[5];
            var ccc = this._digest[6];
            var ddd = this._digest[7];
            
            for ( var t = 0, k = start; t < 16; ++t, k += 4 ) {
                W[t] = (bytes[k]) | (bytes[k + 1] << 8) | (bytes[k + 2] << 16) | (bytes[k + 3] << 24);
            }
            
            /* round 1 */
            aa = FF(aa, bb, cc, dd, W[ 0], 11);
            dd = FF(dd, aa, bb, cc, W[ 1], 14);
            cc = FF(cc, dd, aa, bb, W[ 2], 15);
            bb = FF(bb, cc, dd, aa, W[ 3], 12);
            aa = FF(aa, bb, cc, dd, W[ 4],  5);
            dd = FF(dd, aa, bb, cc, W[ 5],  8);
            cc = FF(cc, dd, aa, bb, W[ 6],  7);
            bb = FF(bb, cc, dd, aa, W[ 7],  9);
            aa = FF(aa, bb, cc, dd, W[ 8], 11);
            dd = FF(dd, aa, bb, cc, W[ 9], 13);
            cc = FF(cc, dd, aa, bb, W[10], 14);
            bb = FF(bb, cc, dd, aa, W[11], 15);
            aa = FF(aa, bb, cc, dd, W[12],  6);
            dd = FF(dd, aa, bb, cc, W[13],  7);
            cc = FF(cc, dd, aa, bb, W[14],  9);
            bb = FF(bb, cc, dd, aa, W[15],  8);
            
            /* parallel round 1 */
            aaa = III(aaa, bbb, ccc, ddd, W[ 5],  8); 
            ddd = III(ddd, aaa, bbb, ccc, W[14],  9);
            ccc = III(ccc, ddd, aaa, bbb, W[ 7],  9);
            bbb = III(bbb, ccc, ddd, aaa, W[ 0], 11);
            aaa = III(aaa, bbb, ccc, ddd, W[ 9], 13);
            ddd = III(ddd, aaa, bbb, ccc, W[ 2], 15);
            ccc = III(ccc, ddd, aaa, bbb, W[11], 15);
            bbb = III(bbb, ccc, ddd, aaa, W[ 4],  5);
            aaa = III(aaa, bbb, ccc, ddd, W[13],  7);
            ddd = III(ddd, aaa, bbb, ccc, W[ 6],  7);
            ccc = III(ccc, ddd, aaa, bbb, W[15],  8);
            bbb = III(bbb, ccc, ddd, aaa, W[ 8], 11);
            aaa = III(aaa, bbb, ccc, ddd, W[ 1], 14);
            ddd = III(ddd, aaa, bbb, ccc, W[10], 14);
            ccc = III(ccc, ddd, aaa, bbb, W[ 3], 12);
            bbb = III(bbb, ccc, ddd, aaa, W[12],  6);
            
            aa ^= aaa; aaa ^= aa; aa ^= aaa;
            
            /* round 2 */
            aa = GG(aa, bb, cc, dd, W[ 7],  7);
            dd = GG(dd, aa, bb, cc, W[ 4],  6);
            cc = GG(cc, dd, aa, bb, W[13],  8);
            bb = GG(bb, cc, dd, aa, W[ 1], 13);
            aa = GG(aa, bb, cc, dd, W[10], 11);
            dd = GG(dd, aa, bb, cc, W[ 6],  9);
            cc = GG(cc, dd, aa, bb, W[15],  7);
            bb = GG(bb, cc, dd, aa, W[ 3], 15);
            aa = GG(aa, bb, cc, dd, W[12],  7);
            dd = GG(dd, aa, bb, cc, W[ 0], 12);
            cc = GG(cc, dd, aa, bb, W[ 9], 15);
            bb = GG(bb, cc, dd, aa, W[ 5],  9);
            aa = GG(aa, bb, cc, dd, W[ 2], 11);
            dd = GG(dd, aa, bb, cc, W[14],  7);
            cc = GG(cc, dd, aa, bb, W[11], 13);
            bb = GG(bb, cc, dd, aa, W[ 8], 12);
            
            /* parallel round 2 */
            aaa = HHH(aaa, bbb, ccc, ddd, W[ 6],  9);
            ddd = HHH(ddd, aaa, bbb, ccc, W[11], 13);
            ccc = HHH(ccc, ddd, aaa, bbb, W[ 3], 15);
            bbb = HHH(bbb, ccc, ddd, aaa, W[ 7],  7);
            aaa = HHH(aaa, bbb, ccc, ddd, W[ 0], 12);
            ddd = HHH(ddd, aaa, bbb, ccc, W[13],  8);
            ccc = HHH(ccc, ddd, aaa, bbb, W[ 5],  9);
            bbb = HHH(bbb, ccc, ddd, aaa, W[10], 11);
            aaa = HHH(aaa, bbb, ccc, ddd, W[14],  7);
            ddd = HHH(ddd, aaa, bbb, ccc, W[15],  7);
            ccc = HHH(ccc, ddd, aaa, bbb, W[ 8], 12);
            bbb = HHH(bbb, ccc, ddd, aaa, W[12],  7);
            aaa = HHH(aaa, bbb, ccc, ddd, W[ 4],  6);
            ddd = HHH(ddd, aaa, bbb, ccc, W[ 9], 15);
            ccc = HHH(ccc, ddd, aaa, bbb, W[ 1], 13);
            bbb = HHH(bbb, ccc, ddd, aaa, W[ 2], 11);
            
            bb ^= bbb; bbb ^= bb; bb ^= bbb;
            
            /* round 3 */
            aa = HH(aa, bb, cc, dd, W[ 3], 11);
            dd = HH(dd, aa, bb, cc, W[10], 13);
            cc = HH(cc, dd, aa, bb, W[14],  6);
            bb = HH(bb, cc, dd, aa, W[ 4],  7);
            aa = HH(aa, bb, cc, dd, W[ 9], 14);
            dd = HH(dd, aa, bb, cc, W[15],  9);
            cc = HH(cc, dd, aa, bb, W[ 8], 13);
            bb = HH(bb, cc, dd, aa, W[ 1], 15);
            aa = HH(aa, bb, cc, dd, W[ 2], 14);
            dd = HH(dd, aa, bb, cc, W[ 7],  8);
            cc = HH(cc, dd, aa, bb, W[ 0], 13);
            bb = HH(bb, cc, dd, aa, W[ 6],  6);
            aa = HH(aa, bb, cc, dd, W[13],  5);
            dd = HH(dd, aa, bb, cc, W[11], 12);
            cc = HH(cc, dd, aa, bb, W[ 5],  7);
            bb = HH(bb, cc, dd, aa, W[12],  5);
            
            /* parallel round 3 */   
            aaa = GGG(aaa, bbb, ccc, ddd, W[15],  9);
            ddd = GGG(ddd, aaa, bbb, ccc, W[ 5],  7);
            ccc = GGG(ccc, ddd, aaa, bbb, W[ 1], 15);
            bbb = GGG(bbb, ccc, ddd, aaa, W[ 3], 11);
            aaa = GGG(aaa, bbb, ccc, ddd, W[ 7],  8);
            ddd = GGG(ddd, aaa, bbb, ccc, W[14],  6);
            ccc = GGG(ccc, ddd, aaa, bbb, W[ 6],  6);
            bbb = GGG(bbb, ccc, ddd, aaa, W[ 9], 14);
            aaa = GGG(aaa, bbb, ccc, ddd, W[11], 12);
            ddd = GGG(ddd, aaa, bbb, ccc, W[ 8], 13);
            ccc = GGG(ccc, ddd, aaa, bbb, W[12],  5);
            bbb = GGG(bbb, ccc, ddd, aaa, W[ 2], 14);
            aaa = GGG(aaa, bbb, ccc, ddd, W[10], 13);
            ddd = GGG(ddd, aaa, bbb, ccc, W[ 0], 13);
            ccc = GGG(ccc, ddd, aaa, bbb, W[ 4],  7);
            bbb = GGG(bbb, ccc, ddd, aaa, W[13],  5);
            
            cc ^= ccc; ccc ^= cc; cc ^= ccc;
            
            /* round 4 */
            aa = II(aa, bb, cc, dd, W[ 1], 11);
            dd = II(dd, aa, bb, cc, W[ 9], 12);
            cc = II(cc, dd, aa, bb, W[11], 14);
            bb = II(bb, cc, dd, aa, W[10], 15);
            aa = II(aa, bb, cc, dd, W[ 0], 14);
            dd = II(dd, aa, bb, cc, W[ 8], 15);
            cc = II(cc, dd, aa, bb, W[12],  9);
            bb = II(bb, cc, dd, aa, W[ 4],  8);
            aa = II(aa, bb, cc, dd, W[13],  9);
            dd = II(dd, aa, bb, cc, W[ 3], 14);
            cc = II(cc, dd, aa, bb, W[ 7],  5);
            bb = II(bb, cc, dd, aa, W[15],  6);
            aa = II(aa, bb, cc, dd, W[14],  8);
            dd = II(dd, aa, bb, cc, W[ 5],  6);
            cc = II(cc, dd, aa, bb, W[ 6],  5);
            bb = II(bb, cc, dd, aa, W[ 2], 12);
            
            /* parallel round 4 */
            aaa = FFF(aaa, bbb, ccc, ddd, W[ 8], 15);
            ddd = FFF(ddd, aaa, bbb, ccc, W[ 6],  5);
            ccc = FFF(ccc, ddd, aaa, bbb, W[ 4],  8);
            bbb = FFF(bbb, ccc, ddd, aaa, W[ 1], 11);
            aaa = FFF(aaa, bbb, ccc, ddd, W[ 3], 14);
            ddd = FFF(ddd, aaa, bbb, ccc, W[11], 14);
            ccc = FFF(ccc, ddd, aaa, bbb, W[15],  6);
            bbb = FFF(bbb, ccc, ddd, aaa, W[ 0], 14);
            aaa = FFF(aaa, bbb, ccc, ddd, W[ 5],  6);
            ddd = FFF(ddd, aaa, bbb, ccc, W[12],  9);
            ccc = FFF(ccc, ddd, aaa, bbb, W[ 2], 12);
            bbb = FFF(bbb, ccc, ddd, aaa, W[13],  9);
            aaa = FFF(aaa, bbb, ccc, ddd, W[ 9], 12);
            ddd = FFF(ddd, aaa, bbb, ccc, W[ 7],  5);
            ccc = FFF(ccc, ddd, aaa, bbb, W[10], 15);
            bbb = FFF(bbb, ccc, ddd, aaa, W[14],  8);
            
            dd ^= ddd; ddd ^= dd; dd ^= ddd;
            
            /* combine results */
            this._digest[0] += aa;
            this._digest[1] += bb;
            this._digest[2] += cc;
            this._digest[3] += dd;
            this._digest[4] += aaa;
            this._digest[5] += bbb;
            this._digest[6] += ccc;
            this._digest[7] += ddd;
        }
    }
}