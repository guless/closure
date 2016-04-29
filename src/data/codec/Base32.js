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
import { BASE32_DEFAULT_ENCODE_TABLE } from "./Base32DefaultTable";
import { BASE32_DEFAULT_DECODE_TABLE } from "./Base32DefaultTable";


const PADCHAR = 61; // Equals(=)


export default class Base32 {
    constructor( withPadchar = true, encodeTable = BASE32_DEFAULT_ENCODE_TABLE, decodeTable = BASE32_DEFAULT_DECODE_TABLE ) {
        this._withPadchar = withPadchar;
        this._encodeTable = encodeTable;
        this._decodeTable = decodeTable;
        
        this._bytesBuffer = new Uint8Array(5);
        this._bytesOffset = 0;
        
        this._base32Buffer = new Uint8Array(8);
        this._base32Offset = 0;
    }
    
    get withPadchar() {
        return this._withPadchar;   
    }
    
    get encodeTable() {
        return this._encodeTable;   
    }
    
    get decodeTable() {
        return this._decodeTable;   
    }
    
    encode( bytes, finals = true, shared = null ) {
        var length = bytes.length;
        var remain = 5 - this._bytesOffset;
        var offset = 0;
        var buffer = shared || this._createEncodeBuffer(length + this._bytesOffset, finals);
        
        if ( length >= remain ) {
            if ( remain != 5 ) {
                this._bytesBuffer.set(bytes.subarray(0, remain), this._bytesOffset);
                offset = this._updateEncode(this._bytesBuffer, 0, buffer, 0);
            }
            
            else {
                remain = 0;
            }
            
            offset = this._updateEncode(bytes, remain, buffer, offset);
            
            this._bytesOffset = (length - remain) % 5;
            
            if ( this._bytesOffset > 0 ) {
                this._bytesBuffer.set(bytes.subarray(length - this._bytesOffset), 0);
            }
        }
        
        else if ( length > 0 ) {
            this._bytesBuffer.set(bytes, this._bytesOffset);
            this._bytesOffset += length;
        }
        
        if ( finals ) {
            offset = this._finalsEncode(buffer, offset);
            this._bytesOffset = 0;
        }
        
        return shared ? shared.subarray(0, offset) : buffer;
    }
    
    decode( base32, finals = true, shared = null ) {
        
        
    }
    
    _createEncodeBuffer( bytesTotal, finals ) {
        var remain = bytesTotal % 5;
        var length = Math.floor(bytesTotal / 5) * 8;
        
        if ( finals && remain ) {
            length += this._withPadchar ? 8 : 8 - Math.ceil((remain * 8) / 5);
        }
        
        return new Uint8Array(length);
    }
    
    _updateEncode( bytes, start, buffer, offset ) {
        var b0 = 0;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        var b4 = 0;
        
        for ( var length = bytes.length; start + 5 <= length; start += 5, offset += 8 ) {
            b0 = bytes[start    ];
            b1 = bytes[start + 1];
            b2 = bytes[start + 2];
            b3 = bytes[start + 3];
            b4 = bytes[start + 4];
            
            buffer[offset    ] = this._encodeTable[(b0 >>> 3) & 0x1F];
            buffer[offset + 1] = this._encodeTable[((b0 & 0x07) << 2) | ((b1 >>> 6) & 0x03)];
            buffer[offset + 2] = this._encodeTable[(b1 >>> 1) & 0x1F];
            buffer[offset + 3] = this._encodeTable[((b1 & 0x01) << 4) | ((b2 >>> 4) & 0x0F)];
            
            buffer[offset + 4] = this._encodeTable[((b2 & 0x0F) << 1) | ((b3 >>> 7) & 0x01)];
            buffer[offset + 5] = this._encodeTable[(b3 >>> 2) & 0x1F];
            buffer[offset + 6] = this._encodeTable[((b3 & 0x03) << 3) | ((b4 >>> 5) & 0x07)];
            buffer[offset + 7] = this._encodeTable[b4 & 0x1F];
        }
        
        return offset;
    }
    
    _finalsEncode( buffer, offset ) {
        var b0 = 0;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        
        if ( this._bytesOffset == 1 ) {
            b0 = this._bytesBuffer[0];
            
            buffer[offset++] = this._encodeTable[(b0 >>> 3) & 0x1F];
            buffer[offset++] = this._encodeTable[(b0 & 0x07) << 2];
            
            if ( this._withPadchar ) {
                buffer[offset++] = PADCHAR;
                buffer[offset++] = PADCHAR;
                buffer[offset++] = PADCHAR;
                buffer[offset++] = PADCHAR;
                buffer[offset++] = PADCHAR;
                buffer[offset++] = PADCHAR;
            }
        }
        
        if ( this._bytesOffset == 2 ) {
            b0 = this._bytesBuffer[0];
            b1 = this._bytesBuffer[1];
            
            buffer[offset++] = this._encodeTable[(b0 >>> 3) & 0x1F];
            buffer[offset++] = this._encodeTable[((b0 & 0x07) << 2) | ((b1 >>> 6) & 0x03)];
            buffer[offset++] = this._encodeTable[(b1 >>> 1) & 0x1F];
            buffer[offset++] = this._encodeTable[(b1 & 0x01) << 4];
            
            if ( this._withPadchar ) {
                buffer[offset++] = PADCHAR;
                buffer[offset++] = PADCHAR;
                buffer[offset++] = PADCHAR;
                buffer[offset++] = PADCHAR;
            }
        }
        
        if ( this._bytesOffset == 3 ) {
            b0 = this._bytesBuffer[0];
            b1 = this._bytesBuffer[1];
            b2 = this._bytesBuffer[2];
            
            buffer[offset++] = this._encodeTable[(b0 >>> 3) & 0x1F];
            buffer[offset++] = this._encodeTable[((b0 & 0x07) << 2) | ((b1 >>> 6) & 0x03)];
            buffer[offset++] = this._encodeTable[(b1 >>> 1) & 0x1F];
            buffer[offset++] = this._encodeTable[((b1 & 0x01) << 4) | ((b2 >>> 4) & 0x0F)];
            
            buffer[offset++] = this._encodeTable[(b2 & 0x0F) << 1];
            
            if ( this._withPadchar ) {
                buffer[offset++] = PADCHAR;
                buffer[offset++] = PADCHAR;
                buffer[offset++] = PADCHAR;
            }
        }
        
        if ( this._bytesOffset == 4 ) {
            b0 = this._bytesBuffer[0];
            b1 = this._bytesBuffer[1];
            b2 = this._bytesBuffer[2];
            b3 = this._bytesBuffer[3];
            
            buffer[offset++] = this._encodeTable[(b0 >>> 3) & 0x1F];
            buffer[offset++] = this._encodeTable[((b0 & 0x07) << 2) | ((b1 >>> 6) & 0x03)];
            buffer[offset++] = this._encodeTable[(b1 >>> 1) & 0x1F];
            buffer[offset++] = this._encodeTable[((b1 & 0x01) << 4) | ((b2 >>> 4) & 0x0F)];
            
            buffer[offset++] = this._encodeTable[((b2 & 0x0F) << 1) | ((b3 >>> 7) & 0x01)];
            buffer[offset++] = this._encodeTable[(b3 >>> 2) & 0x1F];
            buffer[offset++] = this._encodeTable[(b3 & 0x03) << 3];
            
            if ( this._withPadchar ) {
                buffer[offset++] = PADCHAR;
            }
        }
        
        return offset;
    }
}