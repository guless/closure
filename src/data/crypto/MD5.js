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
// const RD = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
// const Ti = new Uint32Array(64);

// for ( var k = 1; k <= 64; ++k ) {
//     Ti[k - 1] = Math.abs(Math.sin(k)) * 0x100000000;
// }
function FF( a, b, c, d, x, s, ac ) { a += ((b & c) | ((~b) & d)) + x + ac; a  = ((a << s) | (a >>> (32 - s))); return a + b; }
function GG( a, b, c, d, x, s, ac ) { a += ((b & d) | (c & (~d))) + x + ac; a  = ((a << s) | (a >>> (32 - s))); return a + b; }
function HH( a, b, c, d, x, s, ac ) { a += (b ^ c ^ d) + x + ac; a  = ((a << s) | (a >>> (32 - s))); return a + b; }
function II( a, b, c, d, x, s, ac ) { a += (c ^ (b | (~d))) + x + ac; a  = ((a << s) | (a >>> (32 - s))); return a + b; }

export default class MD5 {
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
        a = FF(a, b, c, d, dataview.getUint32(offset +  0, true), 7 , 0xd76aa478); /* 01 */
        d = FF(d, a, b, c, dataview.getUint32(offset +  4, true), 12, 0xe8c7b756); /* 02 */
        c = FF(c, d, a, b, dataview.getUint32(offset +  8, true), 17, 0x242070db); /* 03 */
        b = FF(b, c, d, a, dataview.getUint32(offset + 12, true), 22, 0xc1bdceee); /* 04 */
        a = FF(a, b, c, d, dataview.getUint32(offset + 16, true), 7 , 0xf57c0faf); /* 05 */
        d = FF(d, a, b, c, dataview.getUint32(offset + 20, true), 12, 0x4787c62a); /* 06 */
        c = FF(c, d, a, b, dataview.getUint32(offset + 24, true), 17, 0xa8304613); /* 07 */
        b = FF(b, c, d, a, dataview.getUint32(offset + 28, true), 22, 0xfd469501); /* 08 */
        a = FF(a, b, c, d, dataview.getUint32(offset + 32, true), 7 , 0x698098d8); /* 09 */
        d = FF(d, a, b, c, dataview.getUint32(offset + 36, true), 12, 0x8b44f7af); /* 10 */
        c = FF(c, d, a, b, dataview.getUint32(offset + 40, true), 17, 0xffff5bb1); /* 11 */
        b = FF(b, c, d, a, dataview.getUint32(offset + 44, true), 22, 0x895cd7be); /* 12 */
        a = FF(a, b, c, d, dataview.getUint32(offset + 48, true), 7 , 0x6b901122); /* 13 */
        d = FF(d, a, b, c, dataview.getUint32(offset + 52, true), 12, 0xfd987193); /* 14 */
        c = FF(c, d, a, b, dataview.getUint32(offset + 56, true), 17, 0xa679438e); /* 15 */
        b = FF(b, c, d, a, dataview.getUint32(offset + 60, true), 22, 0x49b40821); /* 16 */

        /* Round 2 */
        a = GG(a, b, c, d, dataview.getUint32(offset +  4, true), 5 , 0xf61e2562); /* 17 */
        d = GG(d, a, b, c, dataview.getUint32(offset + 24, true), 9 , 0xc040b340); /* 18 */
        c = GG(c, d, a, b, dataview.getUint32(offset + 44, true), 14, 0x265e5a51); /* 19 */
        b = GG(b, c, d, a, dataview.getUint32(offset +  0, true), 20, 0xe9b6c7aa); /* 20 */
        a = GG(a, b, c, d, dataview.getUint32(offset + 20, true), 5 , 0xd62f105d); /* 21 */
        d = GG(d, a, b, c, dataview.getUint32(offset + 40, true), 9 ,  0x2441453); /* 22 */
        c = GG(c, d, a, b, dataview.getUint32(offset + 60, true), 14, 0xd8a1e681); /* 23 */
        b = GG(b, c, d, a, dataview.getUint32(offset + 16, true), 20, 0xe7d3fbc8); /* 24 */
        a = GG(a, b, c, d, dataview.getUint32(offset + 36, true), 5 , 0x21e1cde6); /* 25 */
        d = GG(d, a, b, c, dataview.getUint32(offset + 56, true), 9 , 0xc33707d6); /* 26 */
        c = GG(c, d, a, b, dataview.getUint32(offset + 12, true), 14, 0xf4d50d87); /* 27 */
        b = GG(b, c, d, a, dataview.getUint32(offset + 32, true), 20, 0x455a14ed); /* 28 */
        a = GG(a, b, c, d, dataview.getUint32(offset + 52, true), 5 , 0xa9e3e905); /* 29 */
        d = GG(d, a, b, c, dataview.getUint32(offset +  8, true), 9 , 0xfcefa3f8); /* 30 */
        c = GG(c, d, a, b, dataview.getUint32(offset + 28, true), 14, 0x676f02d9); /* 31 */
        b = GG(b, c, d, a, dataview.getUint32(offset + 48, true), 20, 0x8d2a4c8a); /* 32 */

        /* Round 3 */
        a = HH(a, b, c, d, dataview.getUint32(offset + 20, true), 4 , 0xfffa3942); /* 33 */
        d = HH(d, a, b, c, dataview.getUint32(offset + 32, true), 11, 0x8771f681); /* 34 */
        c = HH(c, d, a, b, dataview.getUint32(offset + 44, true), 16, 0x6d9d6122); /* 35 */
        b = HH(b, c, d, a, dataview.getUint32(offset + 56, true), 23, 0xfde5380c); /* 36 */
        a = HH(a, b, c, d, dataview.getUint32(offset +  4, true), 4 , 0xa4beea44); /* 37 */
        d = HH(d, a, b, c, dataview.getUint32(offset + 16, true), 11, 0x4bdecfa9); /* 38 */
        c = HH(c, d, a, b, dataview.getUint32(offset + 28, true), 16, 0xf6bb4b60); /* 39 */
        b = HH(b, c, d, a, dataview.getUint32(offset + 40, true), 23, 0xbebfbc70); /* 40 */
        a = HH(a, b, c, d, dataview.getUint32(offset + 52, true), 4 , 0x289b7ec6); /* 41 */
        d = HH(d, a, b, c, dataview.getUint32(offset +  0, true), 11, 0xeaa127fa); /* 42 */
        c = HH(c, d, a, b, dataview.getUint32(offset + 12, true), 16, 0xd4ef3085); /* 43 */
        b = HH(b, c, d, a, dataview.getUint32(offset + 24, true), 23,  0x4881d05); /* 44 */
        a = HH(a, b, c, d, dataview.getUint32(offset + 36, true), 4 , 0xd9d4d039); /* 45 */
        d = HH(d, a, b, c, dataview.getUint32(offset + 48, true), 11, 0xe6db99e5); /* 46 */
        c = HH(c, d, a, b, dataview.getUint32(offset + 60, true), 16, 0x1fa27cf8); /* 47 */
        b = HH(b, c, d, a, dataview.getUint32(offset +  8, true), 23, 0xc4ac5665); /* 48 */

        /* Round 4 */
        a = II(a, b, c, d, dataview.getUint32(offset +  0, true), 6 , 0xf4292244); /* 49 */
        d = II(d, a, b, c, dataview.getUint32(offset + 28, true), 10, 0x432aff97); /* 50 */
        c = II(c, d, a, b, dataview.getUint32(offset + 56, true), 15, 0xab9423a7); /* 51 */
        b = II(b, c, d, a, dataview.getUint32(offset + 20, true), 21, 0xfc93a039); /* 52 */
        a = II(a, b, c, d, dataview.getUint32(offset + 48, true), 6 , 0x655b59c3); /* 53 */
        d = II(d, a, b, c, dataview.getUint32(offset + 12, true), 10, 0x8f0ccc92); /* 54 */
        c = II(c, d, a, b, dataview.getUint32(offset + 40, true), 15, 0xffeff47d); /* 55 */
        b = II(b, c, d, a, dataview.getUint32(offset +  4, true), 21, 0x85845dd1); /* 56 */
        a = II(a, b, c, d, dataview.getUint32(offset + 32, true), 6 , 0x6fa87e4f); /* 57 */
        d = II(d, a, b, c, dataview.getUint32(offset + 60, true), 10, 0xfe2ce6e0); /* 58 */
        c = II(c, d, a, b, dataview.getUint32(offset + 24, true), 15, 0xa3014314); /* 59 */
        b = II(b, c, d, a, dataview.getUint32(offset + 52, true), 21, 0x4e0811a1); /* 60 */
        a = II(a, b, c, d, dataview.getUint32(offset + 16, true), 6 , 0xf7537e82); /* 61 */
        d = II(d, a, b, c, dataview.getUint32(offset + 44, true), 10, 0xbd3af235); /* 62 */
        c = II(c, d, a, b, dataview.getUint32(offset +  8, true), 15, 0x2ad7d2bb); /* 63 */
        b = II(b, c, d, a, dataview.getUint32(offset + 36, true), 21, 0xeb86d391); /* 64 */
        
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
        
        if ( this._offset == 0 ) {
            var dataview = new DataView(new ArrayBuffer(64));
            
            dataview.setUint8(0, 0x80);
            dataview.setUint32(56, this._length[0], true);
            dataview.setUint32(60, this._length[1], true);
                
            this._transform(dataview, 0);
        }
        
        else {
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
                
                this._transform(dataview, 0);
            }
            
            else {
                this._transform(dataview, 0);
                
                dataview = new DataView(new ArrayBuffer(64));
                dataview.setUint32(56, this._length[0], true);
                dataview.setUint32(60, this._length[1], true);
                
                this._transform(dataview, 0);
            }
        }
            
        return new Uint8Array(this._digest.buffer);
    }
}