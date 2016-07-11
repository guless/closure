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
    0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0,
    0x76543210, 0xFEDCBA98, 0x89ABCDEF, 0x01234567, 0x3C2D1E0F,
]);

const P = new Uint32Array(64); P[0] = 0x80;
const A = new Uint32Array(64);
const W = new Uint32Array(16);
const L = new Uint32Array(2);

function AC ( w, s ) { var t = s << 3 >>> 0; w[0] += t; w[1] += (s >>> 29) + (w[0] < t); }
function FF ( a, b, c, d, e, x, s ) { a += (b ^ c ^ d) + x; a = (a << s) | (a >>> 32 - s); return a + e; }
function GG ( a, b, c, d, e, x, s ) { a += ((b & c) | (~b & d)) + x + 0x5a827999; a = (a << s) | (a >>> 32 - s); return a + e; }
function HH ( a, b, c, d, e, x, s ) { a += ((b | ~c) ^ d) + x + 0x6ed9eba1; a = (a << s) | (a >>> 32 - s); return a + e; }
function II ( a, b, c, d, e, x, s ) { a += ((b & d) | (c & ~d)) + x + 0x8f1bbcdc; a = (a << s) | (a >>> 32 - s); return a + e; }
function JJ ( a, b, c, d, e, x, s ) { a += (b ^ (c | ~d)) + x + 0xa953fd4e; a = (a << s) | (a >>> 32 - s); return a + e; }
function FFF( a, b, c, d, e, x, s ) { a += (b ^ c ^ d) + x; a = (a << s) | (a >>> 32 - s); return a + e; }
function GGG( a, b, c, d, e, x, s ) { a += ((b & c) | (~b & d)) + x + 0x7a6d76e9; a = (a << s) | (a >>> 32 - s); return a + e; }
function HHH( a, b, c, d, e, x, s ) { a += ((b | ~c) ^ d) + x + 0x6d703ef3; a = (a << s) | (a >>> 32 - s); return a + e; }
function III( a, b, c, d, e, x, s ) { a += ((b & d) | (c & ~d)) + x + 0x5c4dd124; a = (a << s) | (a >>> 32 - s); return a + e; }
function JJJ( a, b, c, d, e, x, s ) { a += (b ^ (c | ~d)) + x + 0x50a28be6; a = (a << s) | (a >>> 32 - s); return a + e; }

export default class RIPEMD320 extends Hash {
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
            var aa = this._digest[0];
            var bb = this._digest[1];
            var cc = this._digest[2];
            var dd = this._digest[3];
            var ee = this._digest[4];
            
            var aaa = this._digest[5];
            var bbb = this._digest[6];
            var ccc = this._digest[7];
            var ddd = this._digest[8];
            var eee = this._digest[9];
            
            for ( var t = 0, k = start; t < 16; ++t, k += 4 ) {
                W[t] = (bytes[k]) | (bytes[k + 1] << 8) | (bytes[k + 2] << 16) | (bytes[k + 3] << 24);
            }
            
            /* round 1 */
            aa = FF(aa, bb, cc, dd, ee, W[ 0], 11); cc = ((cc << 10) | (cc >>> 22));
            ee = FF(ee, aa, bb, cc, dd, W[ 1], 14); bb = ((bb << 10) | (bb >>> 22));
            dd = FF(dd, ee, aa, bb, cc, W[ 2], 15); aa = ((aa << 10) | (aa >>> 22));
            cc = FF(cc, dd, ee, aa, bb, W[ 3], 12); ee = ((ee << 10) | (ee >>> 22));
            bb = FF(bb, cc, dd, ee, aa, W[ 4],  5); dd = ((dd << 10) | (dd >>> 22));
            aa = FF(aa, bb, cc, dd, ee, W[ 5],  8); cc = ((cc << 10) | (cc >>> 22));
            ee = FF(ee, aa, bb, cc, dd, W[ 6],  7); bb = ((bb << 10) | (bb >>> 22));
            dd = FF(dd, ee, aa, bb, cc, W[ 7],  9); aa = ((aa << 10) | (aa >>> 22));
            cc = FF(cc, dd, ee, aa, bb, W[ 8], 11); ee = ((ee << 10) | (ee >>> 22));
            bb = FF(bb, cc, dd, ee, aa, W[ 9], 13); dd = ((dd << 10) | (dd >>> 22));
            aa = FF(aa, bb, cc, dd, ee, W[10], 14); cc = ((cc << 10) | (cc >>> 22));
            ee = FF(ee, aa, bb, cc, dd, W[11], 15); bb = ((bb << 10) | (bb >>> 22));
            dd = FF(dd, ee, aa, bb, cc, W[12],  6); aa = ((aa << 10) | (aa >>> 22));
            cc = FF(cc, dd, ee, aa, bb, W[13],  7); ee = ((ee << 10) | (ee >>> 22));
            bb = FF(bb, cc, dd, ee, aa, W[14],  9); dd = ((dd << 10) | (dd >>> 22));
            aa = FF(aa, bb, cc, dd, ee, W[15],  8); cc = ((cc << 10) | (cc >>> 22));
            
            /* parallel round 1 */
            aaa = JJJ(aaa, bbb, ccc, ddd, eee, W[ 5],  8); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = JJJ(eee, aaa, bbb, ccc, ddd, W[14],  9); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = JJJ(ddd, eee, aaa, bbb, ccc, W[ 7],  9); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = JJJ(ccc, ddd, eee, aaa, bbb, W[ 0], 11); eee = ((eee << 10) | (eee >>> 22));
            bbb = JJJ(bbb, ccc, ddd, eee, aaa, W[ 9], 13); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = JJJ(aaa, bbb, ccc, ddd, eee, W[ 2], 15); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = JJJ(eee, aaa, bbb, ccc, ddd, W[11], 15); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = JJJ(ddd, eee, aaa, bbb, ccc, W[ 4],  5); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = JJJ(ccc, ddd, eee, aaa, bbb, W[13],  7); eee = ((eee << 10) | (eee >>> 22));
            bbb = JJJ(bbb, ccc, ddd, eee, aaa, W[ 6],  7); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = JJJ(aaa, bbb, ccc, ddd, eee, W[15],  8); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = JJJ(eee, aaa, bbb, ccc, ddd, W[ 8], 11); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = JJJ(ddd, eee, aaa, bbb, ccc, W[ 1], 14); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = JJJ(ccc, ddd, eee, aaa, bbb, W[10], 14); eee = ((eee << 10) | (eee >>> 22));
            bbb = JJJ(bbb, ccc, ddd, eee, aaa, W[ 3], 12); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = JJJ(aaa, bbb, ccc, ddd, eee, W[12],  6); ccc = ((ccc << 10) | (ccc >>> 22));
            
            aa ^= aaa; aaa ^= aa; aa ^= aaa;
            
            /* round 2 */
            ee = GG(ee, aa, bb, cc, dd, W[ 7],  7); bb = ((bb << 10) | (bb >>> 22));
            dd = GG(dd, ee, aa, bb, cc, W[ 4],  6); aa = ((aa << 10) | (aa >>> 22));
            cc = GG(cc, dd, ee, aa, bb, W[13],  8); ee = ((ee << 10) | (ee >>> 22));
            bb = GG(bb, cc, dd, ee, aa, W[ 1], 13); dd = ((dd << 10) | (dd >>> 22));
            aa = GG(aa, bb, cc, dd, ee, W[10], 11); cc = ((cc << 10) | (cc >>> 22));
            ee = GG(ee, aa, bb, cc, dd, W[ 6],  9); bb = ((bb << 10) | (bb >>> 22));
            dd = GG(dd, ee, aa, bb, cc, W[15],  7); aa = ((aa << 10) | (aa >>> 22));
            cc = GG(cc, dd, ee, aa, bb, W[ 3], 15); ee = ((ee << 10) | (ee >>> 22));
            bb = GG(bb, cc, dd, ee, aa, W[12],  7); dd = ((dd << 10) | (dd >>> 22));
            aa = GG(aa, bb, cc, dd, ee, W[ 0], 12); cc = ((cc << 10) | (cc >>> 22));
            ee = GG(ee, aa, bb, cc, dd, W[ 9], 15); bb = ((bb << 10) | (bb >>> 22));
            dd = GG(dd, ee, aa, bb, cc, W[ 5],  9); aa = ((aa << 10) | (aa >>> 22));
            cc = GG(cc, dd, ee, aa, bb, W[ 2], 11); ee = ((ee << 10) | (ee >>> 22));
            bb = GG(bb, cc, dd, ee, aa, W[14],  7); dd = ((dd << 10) | (dd >>> 22));
            aa = GG(aa, bb, cc, dd, ee, W[11], 13); cc = ((cc << 10) | (cc >>> 22));
            ee = GG(ee, aa, bb, cc, dd, W[ 8], 12); bb = ((bb << 10) | (bb >>> 22));
            
            /* parallel round 2 */
            eee = III(eee, aaa, bbb, ccc, ddd, W[ 6],  9); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = III(ddd, eee, aaa, bbb, ccc, W[11], 13); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = III(ccc, ddd, eee, aaa, bbb, W[ 3], 15); eee = ((eee << 10) | (eee >>> 22));
            bbb = III(bbb, ccc, ddd, eee, aaa, W[ 7],  7); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = III(aaa, bbb, ccc, ddd, eee, W[ 0], 12); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = III(eee, aaa, bbb, ccc, ddd, W[13],  8); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = III(ddd, eee, aaa, bbb, ccc, W[ 5],  9); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = III(ccc, ddd, eee, aaa, bbb, W[10], 11); eee = ((eee << 10) | (eee >>> 22));
            bbb = III(bbb, ccc, ddd, eee, aaa, W[14],  7); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = III(aaa, bbb, ccc, ddd, eee, W[15],  7); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = III(eee, aaa, bbb, ccc, ddd, W[ 8], 12); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = III(ddd, eee, aaa, bbb, ccc, W[12],  7); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = III(ccc, ddd, eee, aaa, bbb, W[ 4],  6); eee = ((eee << 10) | (eee >>> 22));
            bbb = III(bbb, ccc, ddd, eee, aaa, W[ 9], 15); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = III(aaa, bbb, ccc, ddd, eee, W[ 1], 13); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = III(eee, aaa, bbb, ccc, ddd, W[ 2], 11); bbb = ((bbb << 10) | (bbb >>> 22));
            
            bb ^= bbb; bbb ^= bb; bb ^= bbb;
            
            /* round 3 */
            dd = HH(dd, ee, aa, bb, cc, W[ 3], 11); aa = ((aa << 10) | (aa >>> 22));
            cc = HH(cc, dd, ee, aa, bb, W[10], 13); ee = ((ee << 10) | (ee >>> 22));
            bb = HH(bb, cc, dd, ee, aa, W[14],  6); dd = ((dd << 10) | (dd >>> 22));
            aa = HH(aa, bb, cc, dd, ee, W[ 4],  7); cc = ((cc << 10) | (cc >>> 22));
            ee = HH(ee, aa, bb, cc, dd, W[ 9], 14); bb = ((bb << 10) | (bb >>> 22));
            dd = HH(dd, ee, aa, bb, cc, W[15],  9); aa = ((aa << 10) | (aa >>> 22));
            cc = HH(cc, dd, ee, aa, bb, W[ 8], 13); ee = ((ee << 10) | (ee >>> 22));
            bb = HH(bb, cc, dd, ee, aa, W[ 1], 15); dd = ((dd << 10) | (dd >>> 22));
            aa = HH(aa, bb, cc, dd, ee, W[ 2], 14); cc = ((cc << 10) | (cc >>> 22));
            ee = HH(ee, aa, bb, cc, dd, W[ 7],  8); bb = ((bb << 10) | (bb >>> 22));
            dd = HH(dd, ee, aa, bb, cc, W[ 0], 13); aa = ((aa << 10) | (aa >>> 22));
            cc = HH(cc, dd, ee, aa, bb, W[ 6],  6); ee = ((ee << 10) | (ee >>> 22));
            bb = HH(bb, cc, dd, ee, aa, W[13],  5); dd = ((dd << 10) | (dd >>> 22));
            aa = HH(aa, bb, cc, dd, ee, W[11], 12); cc = ((cc << 10) | (cc >>> 22));
            ee = HH(ee, aa, bb, cc, dd, W[ 5],  7); bb = ((bb << 10) | (bb >>> 22));
            dd = HH(dd, ee, aa, bb, cc, W[12],  5); aa = ((aa << 10) | (aa >>> 22));
            
            /* parallel round 3 */
            ddd = HHH(ddd, eee, aaa, bbb, ccc, W[15],  9); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = HHH(ccc, ddd, eee, aaa, bbb, W[ 5],  7); eee = ((eee << 10) | (eee >>> 22));
            bbb = HHH(bbb, ccc, ddd, eee, aaa, W[ 1], 15); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = HHH(aaa, bbb, ccc, ddd, eee, W[ 3], 11); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = HHH(eee, aaa, bbb, ccc, ddd, W[ 7],  8); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = HHH(ddd, eee, aaa, bbb, ccc, W[14],  6); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = HHH(ccc, ddd, eee, aaa, bbb, W[ 6],  6); eee = ((eee << 10) | (eee >>> 22));
            bbb = HHH(bbb, ccc, ddd, eee, aaa, W[ 9], 14); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = HHH(aaa, bbb, ccc, ddd, eee, W[11], 12); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = HHH(eee, aaa, bbb, ccc, ddd, W[ 8], 13); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = HHH(ddd, eee, aaa, bbb, ccc, W[12],  5); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = HHH(ccc, ddd, eee, aaa, bbb, W[ 2], 14); eee = ((eee << 10) | (eee >>> 22));
            bbb = HHH(bbb, ccc, ddd, eee, aaa, W[10], 13); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = HHH(aaa, bbb, ccc, ddd, eee, W[ 0], 13); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = HHH(eee, aaa, bbb, ccc, ddd, W[ 4],  7); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = HHH(ddd, eee, aaa, bbb, ccc, W[13],  5); aaa = ((aaa << 10) | (aaa >>> 22));
            
            cc ^= ccc; ccc ^= cc; cc ^= ccc;
            
            /* round 4 */
            cc = II(cc, dd, ee, aa, bb, W[ 1], 11); ee = ((ee << 10) | (ee >>> 22));
            bb = II(bb, cc, dd, ee, aa, W[ 9], 12); dd = ((dd << 10) | (dd >>> 22));
            aa = II(aa, bb, cc, dd, ee, W[11], 14); cc = ((cc << 10) | (cc >>> 22));
            ee = II(ee, aa, bb, cc, dd, W[10], 15); bb = ((bb << 10) | (bb >>> 22));
            dd = II(dd, ee, aa, bb, cc, W[ 0], 14); aa = ((aa << 10) | (aa >>> 22));
            cc = II(cc, dd, ee, aa, bb, W[ 8], 15); ee = ((ee << 10) | (ee >>> 22));
            bb = II(bb, cc, dd, ee, aa, W[12],  9); dd = ((dd << 10) | (dd >>> 22));
            aa = II(aa, bb, cc, dd, ee, W[ 4],  8); cc = ((cc << 10) | (cc >>> 22));
            ee = II(ee, aa, bb, cc, dd, W[13],  9); bb = ((bb << 10) | (bb >>> 22));
            dd = II(dd, ee, aa, bb, cc, W[ 3], 14); aa = ((aa << 10) | (aa >>> 22));
            cc = II(cc, dd, ee, aa, bb, W[ 7],  5); ee = ((ee << 10) | (ee >>> 22));
            bb = II(bb, cc, dd, ee, aa, W[15],  6); dd = ((dd << 10) | (dd >>> 22));
            aa = II(aa, bb, cc, dd, ee, W[14],  8); cc = ((cc << 10) | (cc >>> 22));
            ee = II(ee, aa, bb, cc, dd, W[ 5],  6); bb = ((bb << 10) | (bb >>> 22));
            dd = II(dd, ee, aa, bb, cc, W[ 6],  5); aa = ((aa << 10) | (aa >>> 22));
            cc = II(cc, dd, ee, aa, bb, W[ 2], 12); ee = ((ee << 10) | (ee >>> 22));
            
            /* parallel round 4 */   
            ccc = GGG(ccc, ddd, eee, aaa, bbb, W[ 8], 15); eee = ((eee << 10) | (eee >>> 22));
            bbb = GGG(bbb, ccc, ddd, eee, aaa, W[ 6],  5); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = GGG(aaa, bbb, ccc, ddd, eee, W[ 4],  8); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = GGG(eee, aaa, bbb, ccc, ddd, W[ 1], 11); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = GGG(ddd, eee, aaa, bbb, ccc, W[ 3], 14); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = GGG(ccc, ddd, eee, aaa, bbb, W[11], 14); eee = ((eee << 10) | (eee >>> 22));
            bbb = GGG(bbb, ccc, ddd, eee, aaa, W[15],  6); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = GGG(aaa, bbb, ccc, ddd, eee, W[ 0], 14); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = GGG(eee, aaa, bbb, ccc, ddd, W[ 5],  6); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = GGG(ddd, eee, aaa, bbb, ccc, W[12],  9); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = GGG(ccc, ddd, eee, aaa, bbb, W[ 2], 12); eee = ((eee << 10) | (eee >>> 22));
            bbb = GGG(bbb, ccc, ddd, eee, aaa, W[13],  9); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = GGG(aaa, bbb, ccc, ddd, eee, W[ 9], 12); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = GGG(eee, aaa, bbb, ccc, ddd, W[ 7],  5); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = GGG(ddd, eee, aaa, bbb, ccc, W[10], 15); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = GGG(ccc, ddd, eee, aaa, bbb, W[14],  8); eee = ((eee << 10) | (eee >>> 22));
            
            dd ^= ddd; ddd ^= dd; dd ^= ddd;
            
            /* round 5 */
            bb = JJ(bb, cc, dd, ee, aa, W[ 4],  9); dd = ((dd << 10) | (dd >>> 22));
            aa = JJ(aa, bb, cc, dd, ee, W[ 0], 15); cc = ((cc << 10) | (cc >>> 22));
            ee = JJ(ee, aa, bb, cc, dd, W[ 5],  5); bb = ((bb << 10) | (bb >>> 22));
            dd = JJ(dd, ee, aa, bb, cc, W[ 9], 11); aa = ((aa << 10) | (aa >>> 22));
            cc = JJ(cc, dd, ee, aa, bb, W[ 7],  6); ee = ((ee << 10) | (ee >>> 22));
            bb = JJ(bb, cc, dd, ee, aa, W[12],  8); dd = ((dd << 10) | (dd >>> 22));
            aa = JJ(aa, bb, cc, dd, ee, W[ 2], 13); cc = ((cc << 10) | (cc >>> 22));
            ee = JJ(ee, aa, bb, cc, dd, W[10], 12); bb = ((bb << 10) | (bb >>> 22));
            dd = JJ(dd, ee, aa, bb, cc, W[14],  5); aa = ((aa << 10) | (aa >>> 22));
            cc = JJ(cc, dd, ee, aa, bb, W[ 1], 12); ee = ((ee << 10) | (ee >>> 22));
            bb = JJ(bb, cc, dd, ee, aa, W[ 3], 13); dd = ((dd << 10) | (dd >>> 22));
            aa = JJ(aa, bb, cc, dd, ee, W[ 8], 14); cc = ((cc << 10) | (cc >>> 22));
            ee = JJ(ee, aa, bb, cc, dd, W[11], 11); bb = ((bb << 10) | (bb >>> 22));
            dd = JJ(dd, ee, aa, bb, cc, W[ 6],  8); aa = ((aa << 10) | (aa >>> 22));
            cc = JJ(cc, dd, ee, aa, bb, W[15],  5); ee = ((ee << 10) | (ee >>> 22));
            bb = JJ(bb, cc, dd, ee, aa, W[13],  6); dd = ((dd << 10) | (dd >>> 22));
            
            /* parallel round 5 */
            bbb = FFF(bbb, ccc, ddd, eee, aaa, W[12],  8); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = FFF(aaa, bbb, ccc, ddd, eee, W[15],  5); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = FFF(eee, aaa, bbb, ccc, ddd, W[10], 12); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = FFF(ddd, eee, aaa, bbb, ccc, W[ 4],  9); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = FFF(ccc, ddd, eee, aaa, bbb, W[ 1], 12); eee = ((eee << 10) | (eee >>> 22));
            bbb = FFF(bbb, ccc, ddd, eee, aaa, W[ 5],  5); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = FFF(aaa, bbb, ccc, ddd, eee, W[ 8], 14); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = FFF(eee, aaa, bbb, ccc, ddd, W[ 7],  6); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = FFF(ddd, eee, aaa, bbb, ccc, W[ 6],  8); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = FFF(ccc, ddd, eee, aaa, bbb, W[ 2], 13); eee = ((eee << 10) | (eee >>> 22));
            bbb = FFF(bbb, ccc, ddd, eee, aaa, W[13],  6); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = FFF(aaa, bbb, ccc, ddd, eee, W[14],  5); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = FFF(eee, aaa, bbb, ccc, ddd, W[ 0], 15); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = FFF(ddd, eee, aaa, bbb, ccc, W[ 3], 13); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = FFF(ccc, ddd, eee, aaa, bbb, W[ 9], 11); eee = ((eee << 10) | (eee >>> 22));
            bbb = FFF(bbb, ccc, ddd, eee, aaa, W[11], 11); ddd = ((ddd << 10) | (ddd >>> 22));
            
            ee ^= eee; eee ^= ee; ee ^= eee;
            
            /* combine results */
            this._digest[0] += aa;
            this._digest[1] += bb;
            this._digest[2] += cc;
            this._digest[3] += dd;
            this._digest[4] += ee;
            this._digest[5] += aaa;
            this._digest[6] += bbb;
            this._digest[7] += ccc;
            this._digest[8] += ddd;
            this._digest[9] += eee;
        }
    }
}