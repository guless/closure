/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2016 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 1.0.0 | http://apidev.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
///                                              }|
///                                              }|
///                                              }|     　 へ　　　 ／|    
///      _______     _______         ______      }|      /　│　　 ／ ／
///     /  ___  |   |_   __       .' ____ '.    }|     │　Z ＿,＜　／　　 /`ヽ
///    |  (__ _|     | |__) |     | (____) |    }|     │　　　　　ヽ　　 /　　〉
///     '.___`-.      |  __ /      '_.____. |    }|      Y　　　　　`　 /　　/
///    |`____) |    _| |   _    | ____| |    }|    ｲ●　､　●　　⊂⊃〈　　/
///    |_______.'   |____| |___|    ______,'    }|    ()　 v　　　　|　＼〈
///    |=========================================|    　>ｰ ､_　 ィ　 │ ／／
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

function FF ( a, b, c, d, x, s ) { a += (b ^ c ^ d) + x; return (a << s) | (a >>> 32 - s); }
function GG ( a, b, c, d, x, s ) { a += ((b & c) | (~b & d)) + x + 0x5a827999; return (a << s) | (a >>> 32 - s); }
function HH ( a, b, c, d, x, s ) { a += ((b | ~c) ^ d) + x + 0x6ed9eba1; return (a << s) | (a >>> 32 - s); }
function II ( a, b, c, d, x, s ) { a += ((b & d) | (c & ~d)) + x + 0x8f1bbcdc; return (a << s) | (a >>> 32 - s); }
function FFF( a, b, c, d, x, s ) { a += (b ^ c ^ d) + x; return (a << s) | (a >>> 32 - s); }
function GGG( a, b, c, d, x, s ) { a += ((b & c) | (~b & d)) + x + 0x6d703ef3; return (a << s) | (a >>> 32 - s); }
function HHH( a, b, c, d, x, s ) { a += ((b | ~c) ^ d) + x + 0x5c4dd124; return (a << s) | (a >>> 32 - s); }
function III( a, b, c, d, x, s ) { a += ((b & d) | (c & ~d)) + x + 0x50a28be6; return (a << s) | (a >>> 32 - s); }

function ADDTOLENGTH( R, H, L ) { R[0] += L; R[1] += H + (R[0] < L); }

export default class RIPEMD128 extends Streamable {
    constructor() {
        super(new Uint8Array(64));
        
        this._length = new Uint32Array(2);
        this._digest = new Uint32Array([ H1, H2, H3, H4 ]);
    }
    
    reset() {
        super.reset();
        
        this._length[0] = this._length[1] = 0;
        this._digest[0] = H1;
        this._digest[1] = H2;
        this._digest[2] = H3;
        this._digest[3] = H4;
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
            
            var aaa = aa;
            var bbb = bb;
            var ccc = cc;
            var ddd = dd;
            
            /* round 1 */
            aa = FF(aa, bb, cc, dd, dataview.getUint32( 0, true), 11);
            dd = FF(dd, aa, bb, cc, dataview.getUint32( 4, true), 14);
            cc = FF(cc, dd, aa, bb, dataview.getUint32( 8, true), 15);
            bb = FF(bb, cc, dd, aa, dataview.getUint32(12, true), 12);
            aa = FF(aa, bb, cc, dd, dataview.getUint32(16, true),  5);
            dd = FF(dd, aa, bb, cc, dataview.getUint32(20, true),  8);
            cc = FF(cc, dd, aa, bb, dataview.getUint32(24, true),  7);
            bb = FF(bb, cc, dd, aa, dataview.getUint32(28, true),  9);
            aa = FF(aa, bb, cc, dd, dataview.getUint32(32, true), 11);
            dd = FF(dd, aa, bb, cc, dataview.getUint32(36, true), 13);
            cc = FF(cc, dd, aa, bb, dataview.getUint32(40, true), 14);
            bb = FF(bb, cc, dd, aa, dataview.getUint32(44, true), 15);
            aa = FF(aa, bb, cc, dd, dataview.getUint32(48, true),  6);
            dd = FF(dd, aa, bb, cc, dataview.getUint32(52, true),  7);
            cc = FF(cc, dd, aa, bb, dataview.getUint32(56, true),  9);
            bb = FF(bb, cc, dd, aa, dataview.getUint32(60, true),  8);
            
            /* round 2 */
            aa = GG(aa, bb, cc, dd, dataview.getUint32(28, true),  7);
            dd = GG(dd, aa, bb, cc, dataview.getUint32(16, true),  6);
            cc = GG(cc, dd, aa, bb, dataview.getUint32(52, true),  8);
            bb = GG(bb, cc, dd, aa, dataview.getUint32( 4, true), 13);
            aa = GG(aa, bb, cc, dd, dataview.getUint32(40, true), 11);
            dd = GG(dd, aa, bb, cc, dataview.getUint32(24, true),  9);
            cc = GG(cc, dd, aa, bb, dataview.getUint32(60, true),  7);
            bb = GG(bb, cc, dd, aa, dataview.getUint32(12, true), 15);
            aa = GG(aa, bb, cc, dd, dataview.getUint32(48, true),  7);
            dd = GG(dd, aa, bb, cc, dataview.getUint32( 0, true), 12);
            cc = GG(cc, dd, aa, bb, dataview.getUint32(36, true), 15);
            bb = GG(bb, cc, dd, aa, dataview.getUint32(20, true),  9);
            aa = GG(aa, bb, cc, dd, dataview.getUint32( 8, true), 11);
            dd = GG(dd, aa, bb, cc, dataview.getUint32(56, true),  7);
            cc = GG(cc, dd, aa, bb, dataview.getUint32(44, true), 13);
            bb = GG(bb, cc, dd, aa, dataview.getUint32(32, true), 12);
            
            /* round 3 */
            aa = HH(aa, bb, cc, dd, dataview.getUint32(12, true), 11);
            dd = HH(dd, aa, bb, cc, dataview.getUint32(40, true), 13);
            cc = HH(cc, dd, aa, bb, dataview.getUint32(56, true),  6);
            bb = HH(bb, cc, dd, aa, dataview.getUint32(16, true),  7);
            aa = HH(aa, bb, cc, dd, dataview.getUint32(36, true), 14);
            dd = HH(dd, aa, bb, cc, dataview.getUint32(60, true),  9);
            cc = HH(cc, dd, aa, bb, dataview.getUint32(32, true), 13);
            bb = HH(bb, cc, dd, aa, dataview.getUint32( 4, true), 15);
            aa = HH(aa, bb, cc, dd, dataview.getUint32( 8, true), 14);
            dd = HH(dd, aa, bb, cc, dataview.getUint32(28, true),  8);
            cc = HH(cc, dd, aa, bb, dataview.getUint32( 0, true), 13);
            bb = HH(bb, cc, dd, aa, dataview.getUint32(24, true),  6);
            aa = HH(aa, bb, cc, dd, dataview.getUint32(52, true),  5);
            dd = HH(dd, aa, bb, cc, dataview.getUint32(44, true), 12);
            cc = HH(cc, dd, aa, bb, dataview.getUint32(20, true),  7);
            bb = HH(bb, cc, dd, aa, dataview.getUint32(48, true),  5);
            
            /* round 4 */
            aa = II(aa, bb, cc, dd, dataview.getUint32( 4, true), 11);
            dd = II(dd, aa, bb, cc, dataview.getUint32(36, true), 12);
            cc = II(cc, dd, aa, bb, dataview.getUint32(44, true), 14);
            bb = II(bb, cc, dd, aa, dataview.getUint32(40, true), 15);
            aa = II(aa, bb, cc, dd, dataview.getUint32( 0, true), 14);
            dd = II(dd, aa, bb, cc, dataview.getUint32(32, true), 15);
            cc = II(cc, dd, aa, bb, dataview.getUint32(48, true),  9);
            bb = II(bb, cc, dd, aa, dataview.getUint32(16, true),  8);
            aa = II(aa, bb, cc, dd, dataview.getUint32(52, true),  9);
            dd = II(dd, aa, bb, cc, dataview.getUint32(12, true), 14);
            cc = II(cc, dd, aa, bb, dataview.getUint32(28, true),  5);
            bb = II(bb, cc, dd, aa, dataview.getUint32(60, true),  6);
            aa = II(aa, bb, cc, dd, dataview.getUint32(56, true),  8);
            dd = II(dd, aa, bb, cc, dataview.getUint32(20, true),  6);
            cc = II(cc, dd, aa, bb, dataview.getUint32(24, true),  5);
            bb = II(bb, cc, dd, aa, dataview.getUint32( 8, true), 12);
            
            /* parallel round 1 */
            aaa = III(aaa, bbb, ccc, ddd, dataview.getUint32(20, true),  8); 
            ddd = III(ddd, aaa, bbb, ccc, dataview.getUint32(56, true),  9);
            ccc = III(ccc, ddd, aaa, bbb, dataview.getUint32(28, true),  9);
            bbb = III(bbb, ccc, ddd, aaa, dataview.getUint32( 0, true), 11);
            aaa = III(aaa, bbb, ccc, ddd, dataview.getUint32(36, true), 13);
            ddd = III(ddd, aaa, bbb, ccc, dataview.getUint32( 8, true), 15);
            ccc = III(ccc, ddd, aaa, bbb, dataview.getUint32(44, true), 15);
            bbb = III(bbb, ccc, ddd, aaa, dataview.getUint32(16, true),  5);
            aaa = III(aaa, bbb, ccc, ddd, dataview.getUint32(52, true),  7);
            ddd = III(ddd, aaa, bbb, ccc, dataview.getUint32(24, true),  7);
            ccc = III(ccc, ddd, aaa, bbb, dataview.getUint32(60, true),  8);
            bbb = III(bbb, ccc, ddd, aaa, dataview.getUint32(32, true), 11);
            aaa = III(aaa, bbb, ccc, ddd, dataview.getUint32( 4, true), 14);
            ddd = III(ddd, aaa, bbb, ccc, dataview.getUint32(40, true), 14);
            ccc = III(ccc, ddd, aaa, bbb, dataview.getUint32(12, true), 12);
            bbb = III(bbb, ccc, ddd, aaa, dataview.getUint32(48, true),  6);
            
            /* parallel round 2 */
            aaa = HHH(aaa, bbb, ccc, ddd, dataview.getUint32(24, true),  9);
            ddd = HHH(ddd, aaa, bbb, ccc, dataview.getUint32(44, true), 13);
            ccc = HHH(ccc, ddd, aaa, bbb, dataview.getUint32(12, true), 15);
            bbb = HHH(bbb, ccc, ddd, aaa, dataview.getUint32(28, true),  7);
            aaa = HHH(aaa, bbb, ccc, ddd, dataview.getUint32( 0, true), 12);
            ddd = HHH(ddd, aaa, bbb, ccc, dataview.getUint32(52, true),  8);
            ccc = HHH(ccc, ddd, aaa, bbb, dataview.getUint32(20, true),  9);
            bbb = HHH(bbb, ccc, ddd, aaa, dataview.getUint32(40, true), 11);
            aaa = HHH(aaa, bbb, ccc, ddd, dataview.getUint32(56, true),  7);
            ddd = HHH(ddd, aaa, bbb, ccc, dataview.getUint32(60, true),  7);
            ccc = HHH(ccc, ddd, aaa, bbb, dataview.getUint32(32, true), 12);
            bbb = HHH(bbb, ccc, ddd, aaa, dataview.getUint32(48, true),  7);
            aaa = HHH(aaa, bbb, ccc, ddd, dataview.getUint32(16, true),  6);
            ddd = HHH(ddd, aaa, bbb, ccc, dataview.getUint32(36, true), 15);
            ccc = HHH(ccc, ddd, aaa, bbb, dataview.getUint32( 4, true), 13);
            bbb = HHH(bbb, ccc, ddd, aaa, dataview.getUint32( 8, true), 11);
            
            /* parallel round 3 */   
            aaa = GGG(aaa, bbb, ccc, ddd, dataview.getUint32(60, true),  9);
            ddd = GGG(ddd, aaa, bbb, ccc, dataview.getUint32(20, true),  7);
            ccc = GGG(ccc, ddd, aaa, bbb, dataview.getUint32( 4, true), 15);
            bbb = GGG(bbb, ccc, ddd, aaa, dataview.getUint32(12, true), 11);
            aaa = GGG(aaa, bbb, ccc, ddd, dataview.getUint32(28, true),  8);
            ddd = GGG(ddd, aaa, bbb, ccc, dataview.getUint32(56, true),  6);
            ccc = GGG(ccc, ddd, aaa, bbb, dataview.getUint32(24, true),  6);
            bbb = GGG(bbb, ccc, ddd, aaa, dataview.getUint32(36, true), 14);
            aaa = GGG(aaa, bbb, ccc, ddd, dataview.getUint32(44, true), 12);
            ddd = GGG(ddd, aaa, bbb, ccc, dataview.getUint32(32, true), 13);
            ccc = GGG(ccc, ddd, aaa, bbb, dataview.getUint32(48, true),  5);
            bbb = GGG(bbb, ccc, ddd, aaa, dataview.getUint32( 8, true), 14);
            aaa = GGG(aaa, bbb, ccc, ddd, dataview.getUint32(40, true), 13);
            ddd = GGG(ddd, aaa, bbb, ccc, dataview.getUint32( 0, true), 13);
            ccc = GGG(ccc, ddd, aaa, bbb, dataview.getUint32(16, true),  7);
            bbb = GGG(bbb, ccc, ddd, aaa, dataview.getUint32(52, true),  5);
            
            /* parallel round 4 */
            aaa = FFF(aaa, bbb, ccc, ddd, dataview.getUint32(32, true), 15);
            ddd = FFF(ddd, aaa, bbb, ccc, dataview.getUint32(24, true),  5);
            ccc = FFF(ccc, ddd, aaa, bbb, dataview.getUint32(16, true),  8);
            bbb = FFF(bbb, ccc, ddd, aaa, dataview.getUint32( 4, true), 11);
            aaa = FFF(aaa, bbb, ccc, ddd, dataview.getUint32(12, true), 14);
            ddd = FFF(ddd, aaa, bbb, ccc, dataview.getUint32(44, true), 14);
            ccc = FFF(ccc, ddd, aaa, bbb, dataview.getUint32(60, true),  6);
            bbb = FFF(bbb, ccc, ddd, aaa, dataview.getUint32( 0, true), 14);
            aaa = FFF(aaa, bbb, ccc, ddd, dataview.getUint32(20, true),  6);
            ddd = FFF(ddd, aaa, bbb, ccc, dataview.getUint32(48, true),  9);
            ccc = FFF(ccc, ddd, aaa, bbb, dataview.getUint32( 8, true), 12);
            bbb = FFF(bbb, ccc, ddd, aaa, dataview.getUint32(52, true),  9);
            aaa = FFF(aaa, bbb, ccc, ddd, dataview.getUint32(36, true), 12);
            ddd = FFF(ddd, aaa, bbb, ccc, dataview.getUint32(28, true),  5);
            ccc = FFF(ccc, ddd, aaa, bbb, dataview.getUint32(40, true), 15);
            bbb = FFF(bbb, ccc, ddd, aaa, dataview.getUint32(56, true),  8);
            
            /* combine results */
            ddd += cc + this._digest[1];
            this._digest[1] = this._digest[2] + dd + aaa;
            this._digest[2] = this._digest[3] + aa + bbb;
            this._digest[3] = this._digest[0] + bb + ccc;
            this._digest[0] = ddd;
        }
    }
}