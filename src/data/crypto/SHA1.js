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
import strbin from "../strbin";
import * as PADCHAR from "../strbin";

const H0 = 0x67452301
const H1 = 0xEFCDAB89;
const H2 = 0x98BADCFE;
const H3 = 0x10325476;
const H4 = 0xC3D2E1F0;

export default class SHA1 {
    constructor() {
        this._init();
    }
    
    _init() {
        this._status = UPDATING;
        this._offset = 0;
        this._length = new Uint32Array(2);
        this._buffer = new Uint8Array(64);
        this._swaper = new Uint32Array(80);
        this._digest = new Uint32Array([ H0, H1, H2, H3, H4 ]);
    }
    
    _transform( dataview, offset ) {
        for ( var t = 0; t < 16; ++t ) {
            this._swaper[t] = dataview.getUint32(offset + 4 * t, false);
        }
        
        for ( var t = 16; t < 80; ++t ) {
            this._swaper[t] = this._swaper[t - 3] ^ this._swaper[t - 8] ^ this._swaper[t - 14] ^ this._swaper[t - 16]
            this._swaper[t] = ((this._swaper[t] << 1) | (this._swaper[t] >>> 31));
        }

        var T = 0;
        var W = this._swaper;
        var A = this._digest[0];
        var B = this._digest[1];
        var C = this._digest[2];
        var D = this._digest[3];
        var E = this._digest[4];
        
        // K[0]: 0x5A827999
        // K[1]: 0x6ED9EBA1
        // K[2]: 0x8F1BBCDC
        // K[3]: 0xCA62C1D6
        
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
            dataview.setUint32(60, this._length[0], false);
            dataview.setUint32(56, this._length[1], false);
        }
        
        else {
            this._transform(dataview, 0);
            
            dataview = new DataView(new ArrayBuffer(64));
            dataview.setUint32(60, this._length[0], false);
            dataview.setUint32(56, this._length[1], false);
        }
        
        this._transform(dataview, 0);

        for ( var i = 0; i < this._digest.length; ++i ) {
            this._digest[i] = (((this._digest[i] << 8 ) | (this._digest[i] >>> 24)) & 0x00FF00FF) 
                            | (((this._digest[i] << 24) | (this._digest[i] >>> 8 )) & 0xFF00FF00);
        }
            
        return new Uint8Array(this._digest.buffer);
    }
}