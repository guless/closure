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

function ADDTOLENGTH( R, H, L ) { R[0] += L; R[1] += H + (R[0] < L); }

function FF( a, b, c, d, x, s ) { a += ((b & c) | ((~b) & d)) + x; return ((a << s) | (a >>> (32 - s))); }
function GG( a, b, c, d, x, s ) { a += ((b & c) | (b & d) | (c & d)) + x + 0x5a827999; return ((a << s) | (a >>> (32 - s))); }
function HH( a, b, c, d, x, s ) { a += (b ^ c ^ d) + x + 0x6ed9eba1; return ((a << s) | (a >>> (32 - s))); }

export default class MD4 extends Streamable {
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
            var a = this._digest[0];
            var b = this._digest[1];
            var c = this._digest[2];
            var d = this._digest[3];
            
            /* Round 1 */
            a = FF(a, b, c, d, dataview.getUint32(start +  0, true),  3); /* 1 */
            d = FF(d, a, b, c, dataview.getUint32(start +  4, true),  7); /* 2 */
            c = FF(c, d, a, b, dataview.getUint32(start +  8, true), 11); /* 3 */
            b = FF(b, c, d, a, dataview.getUint32(start + 12, true), 19); /* 4 */
            a = FF(a, b, c, d, dataview.getUint32(start + 16, true),  3); /* 5 */
            d = FF(d, a, b, c, dataview.getUint32(start + 20, true),  7); /* 6 */
            c = FF(c, d, a, b, dataview.getUint32(start + 24, true), 11); /* 7 */
            b = FF(b, c, d, a, dataview.getUint32(start + 28, true), 19); /* 8 */
            a = FF(a, b, c, d, dataview.getUint32(start + 32, true),  3); /* 9 */
            d = FF(d, a, b, c, dataview.getUint32(start + 36, true),  7); /* 10 */
            c = FF(c, d, a, b, dataview.getUint32(start + 40, true), 11); /* 11 */
            b = FF(b, c, d, a, dataview.getUint32(start + 44, true), 19); /* 12 */
            a = FF(a, b, c, d, dataview.getUint32(start + 48, true),  3); /* 13 */
            d = FF(d, a, b, c, dataview.getUint32(start + 52, true),  7); /* 14 */
            c = FF(c, d, a, b, dataview.getUint32(start + 56, true), 11); /* 15 */
            b = FF(b, c, d, a, dataview.getUint32(start + 60, true), 19); /* 16 */

            /* Round 2 */
            a = GG(a, b, c, d, dataview.getUint32(start +  0, true),  3); /* 17 */
            d = GG(d, a, b, c, dataview.getUint32(start + 16, true),  5); /* 18 */
            c = GG(c, d, a, b, dataview.getUint32(start + 32, true),  9); /* 19 */
            b = GG(b, c, d, a, dataview.getUint32(start + 48, true), 13); /* 20 */
            a = GG(a, b, c, d, dataview.getUint32(start +  4, true),  3); /* 21 */
            d = GG(d, a, b, c, dataview.getUint32(start + 20, true),  5); /* 22 */
            c = GG(c, d, a, b, dataview.getUint32(start + 36, true),  9); /* 23 */
            b = GG(b, c, d, a, dataview.getUint32(start + 52, true), 13); /* 24 */
            a = GG(a, b, c, d, dataview.getUint32(start +  8, true),  3); /* 25 */
            d = GG(d, a, b, c, dataview.getUint32(start + 24, true),  5); /* 26 */
            c = GG(c, d, a, b, dataview.getUint32(start + 40, true),  9); /* 27 */
            b = GG(b, c, d, a, dataview.getUint32(start + 56, true), 13); /* 28 */
            a = GG(a, b, c, d, dataview.getUint32(start + 12, true),  3); /* 29 */
            d = GG(d, a, b, c, dataview.getUint32(start + 28, true),  5); /* 30 */
            c = GG(c, d, a, b, dataview.getUint32(start + 44, true),  9); /* 31 */
            b = GG(b, c, d, a, dataview.getUint32(start + 60, true), 13); /* 32 */
            
            /* Round 3 */
            a = HH(a, b, c, d, dataview.getUint32(start +  0, true),  3); /* 33 */
            d = HH(d, a, b, c, dataview.getUint32(start + 32, true),  9); /* 34 */
            c = HH(c, d, a, b, dataview.getUint32(start + 16, true), 11); /* 35 */
            b = HH(b, c, d, a, dataview.getUint32(start + 48, true), 15); /* 36 */
            a = HH(a, b, c, d, dataview.getUint32(start +  8, true),  3); /* 37 */
            d = HH(d, a, b, c, dataview.getUint32(start + 40, true),  9); /* 38 */
            c = HH(c, d, a, b, dataview.getUint32(start + 24, true), 11); /* 39 */
            b = HH(b, c, d, a, dataview.getUint32(start + 56, true), 15); /* 40 */
            a = HH(a, b, c, d, dataview.getUint32(start +  4, true),  3); /* 41 */
            d = HH(d, a, b, c, dataview.getUint32(start + 36, true),  9); /* 42 */
            c = HH(c, d, a, b, dataview.getUint32(start + 20, true), 11); /* 43 */
            b = HH(b, c, d, a, dataview.getUint32(start + 52, true), 15); /* 44 */
            a = HH(a, b, c, d, dataview.getUint32(start + 12, true),  3); /* 45 */
            d = HH(d, a, b, c, dataview.getUint32(start + 44, true),  9); /* 46 */
            c = HH(c, d, a, b, dataview.getUint32(start + 28, true), 11); /* 47 */
            b = HH(b, c, d, a, dataview.getUint32(start + 60, true), 15); /* 48 */
            
            this._digest[0] += a;
            this._digest[1] += b;
            this._digest[2] += c;
            this._digest[3] += d;
        }
    }
}