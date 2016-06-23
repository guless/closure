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
import swap32     from "../utils/swap32";

const H1 = 0x67452301;
const H2 = 0xEFCDAB89;
const H3 = 0x98BADCFE;
const H4 = 0x10325476;
const H5 = 0xC3D2E1F0;

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

const W = new Uint32Array(80);

function ADDTOLENGTH( R, H, L ) { R[1] += L; R[0] += H + (R[1] < L); }

export default class SHA1 extends Streamable {
    constructor() {
        super(new Uint8Array(64));
        
        this._length = new Uint32Array(2);
        this._digest = new Uint32Array([ H1, H2, H3, H4, H5 ]);
    }
    
    reset() {
        super.reset();
        
        this._length[0] = this._length[1] = 0;
        this._digest[0] = H1;
        this._digest[1] = H2;
        this._digest[2] = H3;
        this._digest[3] = H4;
        this._digest[4] = H5;
    }
    
    update( bytes ) {
        ADDTOLENGTH(this._length, bytes.length >>> 29, bytes.length << 3 >>> 0);
        super.update(bytes);
    }
    
    final() {
        var buffer = this._buffer.buffer;
        var offset = this._buffer.offset;

        copy(PADDING, buffer, offset);
        
        this._length[0] = swap32(this._length[0]);
        this._length[1] = swap32(this._length[1]);
        
        if ( offset < 56 ) {
            copy(new Uint8Array(this._length.buffer), buffer, 56);
            
            this._transfrom(buffer);
        }
        
        else {
            copy(new Uint8Array(this._length.buffer), APPENDIX, 56);

            this._transfrom(buffer);
            this._transfrom(APPENDIX);
        }
        
        for ( var i = 0; i < this._digest.length; ++i ) {
            this._digest[i] = swap32(this._digest[i]);
        }

        return this._digest;
    }
    
    _transfrom( bytes ) {
        var dataview = new DataView(bytes.buffer, bytes.byteOffset);
        
        for ( var start = 0; start + 64 <= bytes.length; start += 64 ) {
            for ( var t = 0; t < 16; ++t ) {
                W[t] = dataview.getUint32(start + 4 * t, false);
            }
            
            for ( var t = 16; t < 80; ++t ) {
                W[t] = W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16];
                W[t] = ((W[t] << 1) | (W[t] >>> 31));
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