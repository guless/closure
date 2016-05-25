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
import { UPDATING, DIGESTED } from "./Status";

const H1 = 0x67452301;
const H2 = 0xEFCDAB89;
const H3 = 0x98BADCFE;
const H4 = 0x10325476;
// #define S11 3
// #define S12 7
// #define S13 11
// #define S14 19
// #define S21 3
// #define S22 5
// #define S23 9
// #define S24 13
// #define S31 3
// #define S32 9
// #define S33 11
// #define S34 15
// #define F(x, y, z) (((x) & (y)) | ((~x) & (z)))
// #define G(x, y, z) (((x) & (y)) | ((x) & (z)) | ((y) & (z)))
// #define H(x, y, z) ((x) ^ (y) ^ (z))
// #define FF(a, b, c, d, x, s) { \
//     (a) += F ((b), (c), (d)) + (x); \
//     (a) = ROTATE_LEFT ((a), (s)); \
//   }
// #define GG(a, b, c, d, x, s) { \
//     (a) += G ((b), (c), (d)) + (x) + (UINT4)0x5a827999; \
//     (a) = ROTATE_LEFT ((a), (s)); \
//   }
// #define HH(a, b, c, d, x, s) { \
//     (a) += H ((b), (c), (d)) + (x) + (UINT4)0x6ed9eba1; \
//     (a) = ROTATE_LEFT ((a), (s)); \
//   }
function FF( a, b, c, d, x, s ) { a += ((b & c) | ((~b) & d)) + x; return ((a << s) | (a >>> (32 - s))); }
function GG( a, b, c, d, x, s ) { a += ((b & c) | (b & d) | (c & d)) + x + 0x5a827999; return ((a << s) | (a >>> (32 - s))); }
function HH( a, b, c, d, x, s ) { a += (b ^ c ^ d) + x + 0x6ed9eba1; return ((a << s) | (a >>> (32 - s))); }

export default class MD4 {
    constructor() {
        this._init();
    }
    
    _init() {
        this._status = UPDATING;
        this._offset = 0;
        this._length = new Uint32Array(2);
        this._buffer = new Uint8Array(64);
        this._digest = new Uint32Array([ H1, H2, H3, H4 ]);
    }
    
    _transform( dataview, offset ) {
        var a = this._digest[0];
        var b = this._digest[1];
        var c = this._digest[2];
        var d = this._digest[3];
        
        /* Round 1 */
        a = FF(a, b, c, d, dataview.getUint32(offset +  0, true),  3); /* 1 */
        d = FF(d, a, b, c, dataview.getUint32(offset +  4, true),  7); /* 2 */
        c = FF(c, d, a, b, dataview.getUint32(offset +  8, true), 11); /* 3 */
        b = FF(b, c, d, a, dataview.getUint32(offset + 12, true), 19); /* 4 */
        a = FF(a, b, c, d, dataview.getUint32(offset + 16, true),  3); /* 5 */
        d = FF(d, a, b, c, dataview.getUint32(offset + 20, true),  7); /* 6 */
        c = FF(c, d, a, b, dataview.getUint32(offset + 24, true), 11); /* 7 */
        b = FF(b, c, d, a, dataview.getUint32(offset + 28, true), 19); /* 8 */
        a = FF(a, b, c, d, dataview.getUint32(offset + 32, true),  3); /* 9 */
        d = FF(d, a, b, c, dataview.getUint32(offset + 36, true),  7); /* 10 */
        c = FF(c, d, a, b, dataview.getUint32(offset + 40, true), 11); /* 11 */
        b = FF(b, c, d, a, dataview.getUint32(offset + 44, true), 19); /* 12 */
        a = FF(a, b, c, d, dataview.getUint32(offset + 48, true),  3); /* 13 */
        d = FF(d, a, b, c, dataview.getUint32(offset + 52, true),  7); /* 14 */
        c = FF(c, d, a, b, dataview.getUint32(offset + 56, true), 11); /* 15 */
        b = FF(b, c, d, a, dataview.getUint32(offset + 60, true), 19); /* 16 */

        /* Round 2 */
        a = GG(a, b, c, d, dataview.getUint32(offset +  0, true),  3); /* 17 */
        d = GG(d, a, b, c, dataview.getUint32(offset + 16, true),  5); /* 18 */
        c = GG(c, d, a, b, dataview.getUint32(offset + 32, true),  9); /* 19 */
        b = GG(b, c, d, a, dataview.getUint32(offset + 48, true), 13); /* 20 */
        a = GG(a, b, c, d, dataview.getUint32(offset +  4, true),  3); /* 21 */
        d = GG(d, a, b, c, dataview.getUint32(offset + 20, true),  5); /* 22 */
        c = GG(c, d, a, b, dataview.getUint32(offset + 36, true),  9); /* 23 */
        b = GG(b, c, d, a, dataview.getUint32(offset + 52, true), 13); /* 24 */
        a = GG(a, b, c, d, dataview.getUint32(offset +  8, true),  3); /* 25 */
        d = GG(d, a, b, c, dataview.getUint32(offset + 24, true),  5); /* 26 */
        c = GG(c, d, a, b, dataview.getUint32(offset + 40, true),  9); /* 27 */
        b = GG(b, c, d, a, dataview.getUint32(offset + 56, true), 13); /* 28 */
        a = GG(a, b, c, d, dataview.getUint32(offset + 12, true),  3); /* 29 */
        d = GG(d, a, b, c, dataview.getUint32(offset + 28, true),  5); /* 30 */
        c = GG(c, d, a, b, dataview.getUint32(offset + 44, true),  9); /* 31 */
        b = GG(b, c, d, a, dataview.getUint32(offset + 60, true), 13); /* 32 */
        
        /* Round 3 */
        a = HH(a, b, c, d, dataview.getUint32(offset +  0, true),  3); /* 33 */
        d = HH(d, a, b, c, dataview.getUint32(offset + 32, true),  9); /* 34 */
        c = HH(c, d, a, b, dataview.getUint32(offset + 16, true), 11); /* 35 */
        b = HH(b, c, d, a, dataview.getUint32(offset + 48, true), 15); /* 36 */
        a = HH(a, b, c, d, dataview.getUint32(offset +  8, true),  3); /* 37 */
        d = HH(d, a, b, c, dataview.getUint32(offset + 40, true),  9); /* 38 */
        c = HH(c, d, a, b, dataview.getUint32(offset + 24, true), 11); /* 39 */
        b = HH(b, c, d, a, dataview.getUint32(offset + 56, true), 15); /* 40 */
        a = HH(a, b, c, d, dataview.getUint32(offset +  4, true),  3); /* 41 */
        d = HH(d, a, b, c, dataview.getUint32(offset + 36, true),  9); /* 42 */
        c = HH(c, d, a, b, dataview.getUint32(offset + 20, true), 11); /* 43 */
        b = HH(b, c, d, a, dataview.getUint32(offset + 52, true), 15); /* 44 */
        a = HH(a, b, c, d, dataview.getUint32(offset + 12, true),  3); /* 45 */
        d = HH(d, a, b, c, dataview.getUint32(offset + 44, true),  9); /* 46 */
        c = HH(c, d, a, b, dataview.getUint32(offset + 28, true), 11); /* 47 */
        b = HH(b, c, d, a, dataview.getUint32(offset + 60, true), 15); /* 48 */

        this._digest[0] += a;
        this._digest[1] += b;
        this._digest[2] += c;
        this._digest[3] += d;
    }
    
    update( bytes ) {
        if ( this._status == DIGESTED ) {
            this._init();
        }
        
        var S = 8 * bytes.length;
        var H = S / 0x100000000 >>> 0;
        var L = S >>> 0;
        
        this._length[0] += L;
        this._length[1] += this._length[0] < L ? 1 + H : H;
        
        var length = bytes.length;
        var remain = 64 - this._offset;
        
        if ( length >= remain ) {
            if ( remain != 64 ) {
                this._buffer.set(bytes.subarray(0, remain), this._offset);
                this._transform(new DataView(this._buffer), 0);
            }
            
            else {
                remain = 0;
            }

            var dataview = new DataView(bytes.buffer, bytes.byteOffset);
            
            for ( var start = remain; start + 64 <= length; start += 64 ) {
                this._transform(dataview, start);
            }
            
            this._offset = (length - remain) % 64;
            
            if ( this._offset > 0 ) {
                this._buffer.set(bytes.subarray(length - this._offset), 0);
            }
        }
        
        else if ( length > 0 ) {
            this._buffer.set(bytes, this._offset);
            this._offset += length;
        }
        
        return this;
    }
    
    digest() {
        if ( this._status == DIGESTED ) {
            this._init();
        }
        
        this._status = DIGESTED;
        
        if ( this._buffer.fill ) {
            this._buffer.fill(0, this._offset);
        }
        
        else {
            this._buffer.set(new Uint8Array(64 - this._offset), this._offset);
        }
        
        var dataview = new DataView(this._buffer.buffer);
            dataview.setUint8(this._offset, 0x80);
        
        if ( this._offset < 56 ) {
            dataview.setUint32(56, this._length[0], true);
            dataview.setUint32(60, this._length[1], true);
        }
        
        else {
            this._transform(dataview, 0);
            
            dataview = new DataView(new ArrayBuffer(64));
            dataview.setUint32(56, this._length[0], true);
            dataview.setUint32(60, this._length[1], true);
        }
        
        this._transform(dataview, 0);
            
        return new Uint8Array(this._digest.buffer);
    }
}