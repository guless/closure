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
import Streamable from "../core/Streamable";
import copy       from "../utils/copy";

const H1 = 0x67452301;
const H2 = 0xEFCDAB89;
const H3 = 0x98BADCFE;
const H4 = 0x10325476;
const H5 = 0xC3D2E1F0;
const H6 = 0x76543210;
const H7 = 0xFEDCBA98;
const H8 = 0x89ABCDEF;
const H9 = 0x01234567;
const H0 = 0x3C2D1E0F;

const PADDING = new Uint8Array([
    0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]);

const APPENDIX = new Uint8Array([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]);

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

function ADDTOLENGTH( R, H, L ) { R[0] += L; R[1] += H + (R[0] < L); }

export default class RIPEMD320 extends Streamable {
    constructor() {
        super(new Uint8Array(64));
        
        this._length = new Uint32Array(2);
        this._digest = new Uint32Array([ H1, H2, H3, H4, H5, H6, H7, H8, H9, H0 ]);
    }
    
    reset() {
        super.reset();
        
        this._length[0] = this._length[1] = 0;
        this._digest[0] = H1;
        this._digest[1] = H2;
        this._digest[2] = H3;
        this._digest[3] = H4;
        this._digest[4] = H5;
        this._digest[5] = H6;
        this._digest[6] = H7;
        this._digest[7] = H8;
        this._digest[8] = H9;
        this._digest[9] = H0;
    }
    
    update( bytes ) {
        ADDTOLENGTH(this._length, bytes.length >>> 29, bytes.length << 3 >>> 0);
        super.update(bytes);
    }
    
    final() {
        var buffer = this._buffer.buffer;
        var offset = this._buffer.offset;

        copy(PADDING, buffer, offset);
        
        if ( offset < 56 ) {
            copy(new Uint8Array(this._length.buffer), buffer, 56);
            
            this._transfrom(buffer);
        }
        
        else {
            copy(new Uint8Array(this._length.buffer), APPENDIX, 56);

            this._transfrom(buffer);
            this._transfrom(APPENDIX);
        }

        return this._digest;
    }
    
    _transfrom( bytes ) {
        for ( var start = 0, dataview = new DataView(bytes.buffer, bytes.byteOffset); start + 64 <= bytes.length; start += 64 ) {
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
            
            /* round 1 */
            aa = FF(aa, bb, cc, dd, ee, dataview.getUint32( 0, true), 11); cc = ((cc << 10) | (cc >>> 22));
            ee = FF(ee, aa, bb, cc, dd, dataview.getUint32( 4, true), 14); bb = ((bb << 10) | (bb >>> 22));
            dd = FF(dd, ee, aa, bb, cc, dataview.getUint32( 8, true), 15); aa = ((aa << 10) | (aa >>> 22));
            cc = FF(cc, dd, ee, aa, bb, dataview.getUint32(12, true), 12); ee = ((ee << 10) | (ee >>> 22));
            bb = FF(bb, cc, dd, ee, aa, dataview.getUint32(16, true),  5); dd = ((dd << 10) | (dd >>> 22));
            aa = FF(aa, bb, cc, dd, ee, dataview.getUint32(20, true),  8); cc = ((cc << 10) | (cc >>> 22));
            ee = FF(ee, aa, bb, cc, dd, dataview.getUint32(24, true),  7); bb = ((bb << 10) | (bb >>> 22));
            dd = FF(dd, ee, aa, bb, cc, dataview.getUint32(28, true),  9); aa = ((aa << 10) | (aa >>> 22));
            cc = FF(cc, dd, ee, aa, bb, dataview.getUint32(32, true), 11); ee = ((ee << 10) | (ee >>> 22));
            bb = FF(bb, cc, dd, ee, aa, dataview.getUint32(36, true), 13); dd = ((dd << 10) | (dd >>> 22));
            aa = FF(aa, bb, cc, dd, ee, dataview.getUint32(40, true), 14); cc = ((cc << 10) | (cc >>> 22));
            ee = FF(ee, aa, bb, cc, dd, dataview.getUint32(44, true), 15); bb = ((bb << 10) | (bb >>> 22));
            dd = FF(dd, ee, aa, bb, cc, dataview.getUint32(48, true),  6); aa = ((aa << 10) | (aa >>> 22));
            cc = FF(cc, dd, ee, aa, bb, dataview.getUint32(52, true),  7); ee = ((ee << 10) | (ee >>> 22));
            bb = FF(bb, cc, dd, ee, aa, dataview.getUint32(56, true),  9); dd = ((dd << 10) | (dd >>> 22));
            aa = FF(aa, bb, cc, dd, ee, dataview.getUint32(60, true),  8); cc = ((cc << 10) | (cc >>> 22));
            
            /* parallel round 1 */
            aaa = JJJ(aaa, bbb, ccc, ddd, eee, dataview.getUint32(20, true),  8); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = JJJ(eee, aaa, bbb, ccc, ddd, dataview.getUint32(56, true),  9); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = JJJ(ddd, eee, aaa, bbb, ccc, dataview.getUint32(28, true),  9); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = JJJ(ccc, ddd, eee, aaa, bbb, dataview.getUint32( 0, true), 11); eee = ((eee << 10) | (eee >>> 22));
            bbb = JJJ(bbb, ccc, ddd, eee, aaa, dataview.getUint32(36, true), 13); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = JJJ(aaa, bbb, ccc, ddd, eee, dataview.getUint32( 8, true), 15); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = JJJ(eee, aaa, bbb, ccc, ddd, dataview.getUint32(44, true), 15); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = JJJ(ddd, eee, aaa, bbb, ccc, dataview.getUint32(16, true),  5); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = JJJ(ccc, ddd, eee, aaa, bbb, dataview.getUint32(52, true),  7); eee = ((eee << 10) | (eee >>> 22));
            bbb = JJJ(bbb, ccc, ddd, eee, aaa, dataview.getUint32(24, true),  7); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = JJJ(aaa, bbb, ccc, ddd, eee, dataview.getUint32(60, true),  8); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = JJJ(eee, aaa, bbb, ccc, ddd, dataview.getUint32(32, true), 11); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = JJJ(ddd, eee, aaa, bbb, ccc, dataview.getUint32( 4, true), 14); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = JJJ(ccc, ddd, eee, aaa, bbb, dataview.getUint32(40, true), 14); eee = ((eee << 10) | (eee >>> 22));
            bbb = JJJ(bbb, ccc, ddd, eee, aaa, dataview.getUint32(12, true), 12); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = JJJ(aaa, bbb, ccc, ddd, eee, dataview.getUint32(48, true),  6); ccc = ((ccc << 10) | (ccc >>> 22));
            
            aa ^= aaa; aaa ^= aa; aa ^= aaa;
            /* round 2 */
            ee = GG(ee, aa, bb, cc, dd, dataview.getUint32(28, true),  7); bb = ((bb << 10) | (bb >>> 22));
            dd = GG(dd, ee, aa, bb, cc, dataview.getUint32(16, true),  6); aa = ((aa << 10) | (aa >>> 22));
            cc = GG(cc, dd, ee, aa, bb, dataview.getUint32(52, true),  8); ee = ((ee << 10) | (ee >>> 22));
            bb = GG(bb, cc, dd, ee, aa, dataview.getUint32( 4, true), 13); dd = ((dd << 10) | (dd >>> 22));
            aa = GG(aa, bb, cc, dd, ee, dataview.getUint32(40, true), 11); cc = ((cc << 10) | (cc >>> 22));
            ee = GG(ee, aa, bb, cc, dd, dataview.getUint32(24, true),  9); bb = ((bb << 10) | (bb >>> 22));
            dd = GG(dd, ee, aa, bb, cc, dataview.getUint32(60, true),  7); aa = ((aa << 10) | (aa >>> 22));
            cc = GG(cc, dd, ee, aa, bb, dataview.getUint32(12, true), 15); ee = ((ee << 10) | (ee >>> 22));
            bb = GG(bb, cc, dd, ee, aa, dataview.getUint32(48, true),  7); dd = ((dd << 10) | (dd >>> 22));
            aa = GG(aa, bb, cc, dd, ee, dataview.getUint32( 0, true), 12); cc = ((cc << 10) | (cc >>> 22));
            ee = GG(ee, aa, bb, cc, dd, dataview.getUint32(36, true), 15); bb = ((bb << 10) | (bb >>> 22));
            dd = GG(dd, ee, aa, bb, cc, dataview.getUint32(20, true),  9); aa = ((aa << 10) | (aa >>> 22));
            cc = GG(cc, dd, ee, aa, bb, dataview.getUint32( 8, true), 11); ee = ((ee << 10) | (ee >>> 22));
            bb = GG(bb, cc, dd, ee, aa, dataview.getUint32(56, true),  7); dd = ((dd << 10) | (dd >>> 22));
            aa = GG(aa, bb, cc, dd, ee, dataview.getUint32(44, true), 13); cc = ((cc << 10) | (cc >>> 22));
            ee = GG(ee, aa, bb, cc, dd, dataview.getUint32(32, true), 12); bb = ((bb << 10) | (bb >>> 22));
            
            /* parallel round 2 */
            eee = III(eee, aaa, bbb, ccc, ddd, dataview.getUint32(24, true),  9); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = III(ddd, eee, aaa, bbb, ccc, dataview.getUint32(44, true), 13); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = III(ccc, ddd, eee, aaa, bbb, dataview.getUint32(12, true), 15); eee = ((eee << 10) | (eee >>> 22));
            bbb = III(bbb, ccc, ddd, eee, aaa, dataview.getUint32(28, true),  7); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = III(aaa, bbb, ccc, ddd, eee, dataview.getUint32( 0, true), 12); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = III(eee, aaa, bbb, ccc, ddd, dataview.getUint32(52, true),  8); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = III(ddd, eee, aaa, bbb, ccc, dataview.getUint32(20, true),  9); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = III(ccc, ddd, eee, aaa, bbb, dataview.getUint32(40, true), 11); eee = ((eee << 10) | (eee >>> 22));
            bbb = III(bbb, ccc, ddd, eee, aaa, dataview.getUint32(56, true),  7); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = III(aaa, bbb, ccc, ddd, eee, dataview.getUint32(60, true),  7); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = III(eee, aaa, bbb, ccc, ddd, dataview.getUint32(32, true), 12); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = III(ddd, eee, aaa, bbb, ccc, dataview.getUint32(48, true),  7); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = III(ccc, ddd, eee, aaa, bbb, dataview.getUint32(16, true),  6); eee = ((eee << 10) | (eee >>> 22));
            bbb = III(bbb, ccc, ddd, eee, aaa, dataview.getUint32(36, true), 15); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = III(aaa, bbb, ccc, ddd, eee, dataview.getUint32( 4, true), 13); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = III(eee, aaa, bbb, ccc, ddd, dataview.getUint32( 8, true), 11); bbb = ((bbb << 10) | (bbb >>> 22));
            
            bb ^= bbb; bbb ^= bb; bb ^= bbb;
            /* round 3 */
            dd = HH(dd, ee, aa, bb, cc, dataview.getUint32(12, true), 11); aa = ((aa << 10) | (aa >>> 22));
            cc = HH(cc, dd, ee, aa, bb, dataview.getUint32(40, true), 13); ee = ((ee << 10) | (ee >>> 22));
            bb = HH(bb, cc, dd, ee, aa, dataview.getUint32(56, true),  6); dd = ((dd << 10) | (dd >>> 22));
            aa = HH(aa, bb, cc, dd, ee, dataview.getUint32(16, true),  7); cc = ((cc << 10) | (cc >>> 22));
            ee = HH(ee, aa, bb, cc, dd, dataview.getUint32(36, true), 14); bb = ((bb << 10) | (bb >>> 22));
            dd = HH(dd, ee, aa, bb, cc, dataview.getUint32(60, true),  9); aa = ((aa << 10) | (aa >>> 22));
            cc = HH(cc, dd, ee, aa, bb, dataview.getUint32(32, true), 13); ee = ((ee << 10) | (ee >>> 22));
            bb = HH(bb, cc, dd, ee, aa, dataview.getUint32( 4, true), 15); dd = ((dd << 10) | (dd >>> 22));
            aa = HH(aa, bb, cc, dd, ee, dataview.getUint32( 8, true), 14); cc = ((cc << 10) | (cc >>> 22));
            ee = HH(ee, aa, bb, cc, dd, dataview.getUint32(28, true),  8); bb = ((bb << 10) | (bb >>> 22));
            dd = HH(dd, ee, aa, bb, cc, dataview.getUint32( 0, true), 13); aa = ((aa << 10) | (aa >>> 22));
            cc = HH(cc, dd, ee, aa, bb, dataview.getUint32(24, true),  6); ee = ((ee << 10) | (ee >>> 22));
            bb = HH(bb, cc, dd, ee, aa, dataview.getUint32(52, true),  5); dd = ((dd << 10) | (dd >>> 22));
            aa = HH(aa, bb, cc, dd, ee, dataview.getUint32(44, true), 12); cc = ((cc << 10) | (cc >>> 22));
            ee = HH(ee, aa, bb, cc, dd, dataview.getUint32(20, true),  7); bb = ((bb << 10) | (bb >>> 22));
            dd = HH(dd, ee, aa, bb, cc, dataview.getUint32(48, true),  5); aa = ((aa << 10) | (aa >>> 22));
            
            /* parallel round 3 */
            ddd = HHH(ddd, eee, aaa, bbb, ccc, dataview.getUint32(60, true),  9); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = HHH(ccc, ddd, eee, aaa, bbb, dataview.getUint32(20, true),  7); eee = ((eee << 10) | (eee >>> 22));
            bbb = HHH(bbb, ccc, ddd, eee, aaa, dataview.getUint32( 4, true), 15); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = HHH(aaa, bbb, ccc, ddd, eee, dataview.getUint32(12, true), 11); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = HHH(eee, aaa, bbb, ccc, ddd, dataview.getUint32(28, true),  8); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = HHH(ddd, eee, aaa, bbb, ccc, dataview.getUint32(56, true),  6); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = HHH(ccc, ddd, eee, aaa, bbb, dataview.getUint32(24, true),  6); eee = ((eee << 10) | (eee >>> 22));
            bbb = HHH(bbb, ccc, ddd, eee, aaa, dataview.getUint32(36, true), 14); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = HHH(aaa, bbb, ccc, ddd, eee, dataview.getUint32(44, true), 12); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = HHH(eee, aaa, bbb, ccc, ddd, dataview.getUint32(32, true), 13); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = HHH(ddd, eee, aaa, bbb, ccc, dataview.getUint32(48, true),  5); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = HHH(ccc, ddd, eee, aaa, bbb, dataview.getUint32( 8, true), 14); eee = ((eee << 10) | (eee >>> 22));
            bbb = HHH(bbb, ccc, ddd, eee, aaa, dataview.getUint32(40, true), 13); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = HHH(aaa, bbb, ccc, ddd, eee, dataview.getUint32( 0, true), 13); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = HHH(eee, aaa, bbb, ccc, ddd, dataview.getUint32(16, true),  7); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = HHH(ddd, eee, aaa, bbb, ccc, dataview.getUint32(52, true),  5); aaa = ((aaa << 10) | (aaa >>> 22));
            
            cc ^= ccc; ccc ^= cc; cc ^= ccc;
            /* round 4 */
            cc = II(cc, dd, ee, aa, bb, dataview.getUint32( 4, true), 11); ee = ((ee << 10) | (ee >>> 22));
            bb = II(bb, cc, dd, ee, aa, dataview.getUint32(36, true), 12); dd = ((dd << 10) | (dd >>> 22));
            aa = II(aa, bb, cc, dd, ee, dataview.getUint32(44, true), 14); cc = ((cc << 10) | (cc >>> 22));
            ee = II(ee, aa, bb, cc, dd, dataview.getUint32(40, true), 15); bb = ((bb << 10) | (bb >>> 22));
            dd = II(dd, ee, aa, bb, cc, dataview.getUint32( 0, true), 14); aa = ((aa << 10) | (aa >>> 22));
            cc = II(cc, dd, ee, aa, bb, dataview.getUint32(32, true), 15); ee = ((ee << 10) | (ee >>> 22));
            bb = II(bb, cc, dd, ee, aa, dataview.getUint32(48, true),  9); dd = ((dd << 10) | (dd >>> 22));
            aa = II(aa, bb, cc, dd, ee, dataview.getUint32(16, true),  8); cc = ((cc << 10) | (cc >>> 22));
            ee = II(ee, aa, bb, cc, dd, dataview.getUint32(52, true),  9); bb = ((bb << 10) | (bb >>> 22));
            dd = II(dd, ee, aa, bb, cc, dataview.getUint32(12, true), 14); aa = ((aa << 10) | (aa >>> 22));
            cc = II(cc, dd, ee, aa, bb, dataview.getUint32(28, true),  5); ee = ((ee << 10) | (ee >>> 22));
            bb = II(bb, cc, dd, ee, aa, dataview.getUint32(60, true),  6); dd = ((dd << 10) | (dd >>> 22));
            aa = II(aa, bb, cc, dd, ee, dataview.getUint32(56, true),  8); cc = ((cc << 10) | (cc >>> 22));
            ee = II(ee, aa, bb, cc, dd, dataview.getUint32(20, true),  6); bb = ((bb << 10) | (bb >>> 22));
            dd = II(dd, ee, aa, bb, cc, dataview.getUint32(24, true),  5); aa = ((aa << 10) | (aa >>> 22));
            cc = II(cc, dd, ee, aa, bb, dataview.getUint32( 8, true), 12); ee = ((ee << 10) | (ee >>> 22));
            
            /* parallel round 4 */   
            ccc = GGG(ccc, ddd, eee, aaa, bbb, dataview.getUint32(32, true), 15); eee = ((eee << 10) | (eee >>> 22));
            bbb = GGG(bbb, ccc, ddd, eee, aaa, dataview.getUint32(24, true),  5); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = GGG(aaa, bbb, ccc, ddd, eee, dataview.getUint32(16, true),  8); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = GGG(eee, aaa, bbb, ccc, ddd, dataview.getUint32( 4, true), 11); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = GGG(ddd, eee, aaa, bbb, ccc, dataview.getUint32(12, true), 14); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = GGG(ccc, ddd, eee, aaa, bbb, dataview.getUint32(44, true), 14); eee = ((eee << 10) | (eee >>> 22));
            bbb = GGG(bbb, ccc, ddd, eee, aaa, dataview.getUint32(60, true),  6); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = GGG(aaa, bbb, ccc, ddd, eee, dataview.getUint32( 0, true), 14); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = GGG(eee, aaa, bbb, ccc, ddd, dataview.getUint32(20, true),  6); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = GGG(ddd, eee, aaa, bbb, ccc, dataview.getUint32(48, true),  9); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = GGG(ccc, ddd, eee, aaa, bbb, dataview.getUint32( 8, true), 12); eee = ((eee << 10) | (eee >>> 22));
            bbb = GGG(bbb, ccc, ddd, eee, aaa, dataview.getUint32(52, true),  9); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = GGG(aaa, bbb, ccc, ddd, eee, dataview.getUint32(36, true), 12); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = GGG(eee, aaa, bbb, ccc, ddd, dataview.getUint32(28, true),  5); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = GGG(ddd, eee, aaa, bbb, ccc, dataview.getUint32(40, true), 15); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = GGG(ccc, ddd, eee, aaa, bbb, dataview.getUint32(56, true),  8); eee = ((eee << 10) | (eee >>> 22));
            
            dd ^= ddd; ddd ^= dd; dd ^= ddd;
            /* round 5 */
            bb = JJ(bb, cc, dd, ee, aa, dataview.getUint32(16, true),  9); dd = ((dd << 10) | (dd >>> 22));
            aa = JJ(aa, bb, cc, dd, ee, dataview.getUint32( 0, true), 15); cc = ((cc << 10) | (cc >>> 22));
            ee = JJ(ee, aa, bb, cc, dd, dataview.getUint32(20, true),  5); bb = ((bb << 10) | (bb >>> 22));
            dd = JJ(dd, ee, aa, bb, cc, dataview.getUint32(36, true), 11); aa = ((aa << 10) | (aa >>> 22));
            cc = JJ(cc, dd, ee, aa, bb, dataview.getUint32(28, true),  6); ee = ((ee << 10) | (ee >>> 22));
            bb = JJ(bb, cc, dd, ee, aa, dataview.getUint32(48, true),  8); dd = ((dd << 10) | (dd >>> 22));
            aa = JJ(aa, bb, cc, dd, ee, dataview.getUint32( 8, true), 13); cc = ((cc << 10) | (cc >>> 22));
            ee = JJ(ee, aa, bb, cc, dd, dataview.getUint32(40, true), 12); bb = ((bb << 10) | (bb >>> 22));
            dd = JJ(dd, ee, aa, bb, cc, dataview.getUint32(56, true),  5); aa = ((aa << 10) | (aa >>> 22));
            cc = JJ(cc, dd, ee, aa, bb, dataview.getUint32( 4, true), 12); ee = ((ee << 10) | (ee >>> 22));
            bb = JJ(bb, cc, dd, ee, aa, dataview.getUint32(12, true), 13); dd = ((dd << 10) | (dd >>> 22));
            aa = JJ(aa, bb, cc, dd, ee, dataview.getUint32(32, true), 14); cc = ((cc << 10) | (cc >>> 22));
            ee = JJ(ee, aa, bb, cc, dd, dataview.getUint32(44, true), 11); bb = ((bb << 10) | (bb >>> 22));
            dd = JJ(dd, ee, aa, bb, cc, dataview.getUint32(24, true),  8); aa = ((aa << 10) | (aa >>> 22));
            cc = JJ(cc, dd, ee, aa, bb, dataview.getUint32(60, true),  5); ee = ((ee << 10) | (ee >>> 22));
            bb = JJ(bb, cc, dd, ee, aa, dataview.getUint32(52, true),  6); dd = ((dd << 10) | (dd >>> 22));
            
            /* parallel round 5 */
            bbb = FFF(bbb, ccc, ddd, eee, aaa, dataview.getUint32(48, true),  8); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = FFF(aaa, bbb, ccc, ddd, eee, dataview.getUint32(60, true),  5); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = FFF(eee, aaa, bbb, ccc, ddd, dataview.getUint32(40, true), 12); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = FFF(ddd, eee, aaa, bbb, ccc, dataview.getUint32(16, true),  9); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = FFF(ccc, ddd, eee, aaa, bbb, dataview.getUint32( 4, true), 12); eee = ((eee << 10) | (eee >>> 22));
            bbb = FFF(bbb, ccc, ddd, eee, aaa, dataview.getUint32(20, true),  5); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = FFF(aaa, bbb, ccc, ddd, eee, dataview.getUint32(32, true), 14); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = FFF(eee, aaa, bbb, ccc, ddd, dataview.getUint32(28, true),  6); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = FFF(ddd, eee, aaa, bbb, ccc, dataview.getUint32(24, true),  8); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = FFF(ccc, ddd, eee, aaa, bbb, dataview.getUint32( 8, true), 13); eee = ((eee << 10) | (eee >>> 22));
            bbb = FFF(bbb, ccc, ddd, eee, aaa, dataview.getUint32(52, true),  6); ddd = ((ddd << 10) | (ddd >>> 22));
            aaa = FFF(aaa, bbb, ccc, ddd, eee, dataview.getUint32(56, true),  5); ccc = ((ccc << 10) | (ccc >>> 22));
            eee = FFF(eee, aaa, bbb, ccc, ddd, dataview.getUint32( 0, true), 15); bbb = ((bbb << 10) | (bbb >>> 22));
            ddd = FFF(ddd, eee, aaa, bbb, ccc, dataview.getUint32(12, true), 13); aaa = ((aaa << 10) | (aaa >>> 22));
            ccc = FFF(ccc, ddd, eee, aaa, bbb, dataview.getUint32(36, true), 11); eee = ((eee << 10) | (eee >>> 22));
            bbb = FFF(bbb, ccc, ddd, eee, aaa, dataview.getUint32(44, true), 11); ddd = ((ddd << 10) | (ddd >>> 22));
            
            ee ^= eee; eee ^= ee; ee ^= eee;
            /* combine results */
            this._digest[0] +=  aa;
            this._digest[1] +=  bb;
            this._digest[2] +=  cc;
            this._digest[3] +=  dd;
            this._digest[4] +=  ee;
            this._digest[5] += aaa;
            this._digest[6] += bbb;
            this._digest[7] += ccc;
            this._digest[8] += ddd;
            this._digest[9] += eee;
        }
    }
}