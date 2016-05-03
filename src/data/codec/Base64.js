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
import { BASE64_DEFAULT_ENCODE_TABLE } from "./Base64DefaultTable";
import { BASE64_DEFAULT_DECODE_TABLE } from "./Base64DefaultTable";


const PADCHAR = 61; // Equals(=)


export default class Base64 {
    constructor( withPadchar = true, encodeTable = BASE64_DEFAULT_ENCODE_TABLE, decodeTable = BASE64_DEFAULT_DECODE_TABLE ) {
        this._withPadchar = withPadchar;
        this._encodeTable = encodeTable;
        this._decodeTable = decodeTable;
        
        this._bytesBuffer  = new Uint8Array(3);
        this._bytesOffset  = 0;
        
        this._base64Buffer = new Uint8Array(4);
        this._base64Offset = 0;
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
        var remain = 3 - this._bytesOffset;
        var offset = 0;
        var buffer = shared || this._createEncodeBuffer(length + this._bytesOffset, finals);
        
        if ( length >= remain ) {
            if ( remain != 3 ) {
                this._bytesBuffer.set(bytes.subarray(0, remain), this._bytesOffset);
                offset = this._updateEncode(this._bytesBuffer, 0, buffer, 0);
            }
            
            else {
                remain = 0;
            }
            
            offset = this._updateEncode(bytes, remain, buffer, offset);
            
            this._bytesOffset = (length - remain) % 3;
            
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
    
    decode( base64, finals = true, shared = null ) {
        if ( finals ) {
            var bytesTotal = base64.length + this._base64Offset;
            
            if ( bytesTotal % 4 == 1 ) {
                throw new Error("Invalid base64 data.");
            }
            
            if ( bytesTotal % 4 == 0 && bytesTotal > 0 ) {
                var lastIndex = bytesTotal - 1;
                
                if ( this._base64Offset > lastIndex ) {
                    if ( this._base64Buffer[lastIndex] == PADCHAR ) {
                        if ( this._base64Buffer[lastIndex - 1] == PADCHAR ) {
                            this._base64Offset -= 2;
                        }
                        
                        else {
                            --this._base64Offset;
                        }
                    }
                }
                
                else {
                    lastIndex -= this._base64Offset;
                    
                    if ( base64[lastIndex] == PADCHAR ) {
                        if ( base64.length >= 2 ) {
                            if ( base64[lastIndex - 1] == PADCHAR ) {
                                base64 = base64.subarray(0, base64.length - 2);
                            }
                            
                            else {
                                base64 = base64.subarray(0, base64.length - 1);   
                            }
                        }
                        
                        else {
                            base64 = base64.subarray(0, base64.length - 1);
                            
                            if ( this._base64Buffer[this._base64Offset - 1] == PADCHAR ) {
                                --this._base64Offset;
                            }
                        }
                    }
                }
            }
        }
        
        var length = base64.length;
        var remain = 4 - this._base64Offset;
        var offset = 0;
        var buffer = shared || this._createDecodeBuffer(length + this._base64Offset, finals);
        
        if ( length >= remain ) {
            if ( remain != 4 ) {
                this._base64Buffer.set(base64.subarray(0, remain), this._base64Offset);
                offset = this._updateDecode(this._base64Buffer, 0, buffer, 0);
            }
            
            else {
                remain = 0;
            }
            
            offset = this._updateDecode(base64, remain, buffer, offset);
            
            this._base64Offset = (length - remain) % 4;
            
            if ( this._base64Offset > 0 ) {
                this._base64Buffer.set(base64.subarray(length - this._base64Offset), 0);
            }
        }
        
        else if ( length > 0 ) {
            this._base64Buffer.set(base64, this._base64Offset);
            this._base64Offset += length;
        }
        
        if ( finals ) {
            offset = this._finalsDecode(buffer, offset);
            this._base64Offset = 0;
        }
        
        return shared ? shared.subarray(0, offset) : buffer;
    }
    
    _createEncodeBuffer( bytesTotal, finals ) {
        var remain = bytesTotal % 3;
        var length = Math.floor(bytesTotal / 3) * 4;
        
        if ( finals && remain ) {
            length += this._withPadchar ? 4 : remain == 2 ? 3 : 2;
        }
        
        return new Uint8Array(length);
    }
    
    _createDecodeBuffer( bytesTotal, finals ) {
        var remain = bytesTotal % 4;
        var length = Math.floor(bytesTotal / 4) * 3;
        
        if ( finals && remain ) {
            length += remain == 3 ? 2 : 1;
        }
        
        return new Uint8Array(length);
    }
    
    _updateEncode( bytes, start, buffer, offset ) {
        var b0 = 0;
        var b1 = 0;
        var b2 = 0;
        
        for ( var length = bytes.length; start + 3 <= length; start += 3, offset += 4 ) {
            b0 = bytes[start    ];
            b1 = bytes[start + 1];
            b2 = bytes[start + 2];
            
            buffer[offset    ] = this._encodeTable[(b0 >>> 2) & 0x3F];
            buffer[offset + 1] = this._encodeTable[((b0 & 0x03) << 4) | ((b1 >>> 4) & 0x0F)];
            buffer[offset + 2] = this._encodeTable[((b1 & 0x0F) << 2) | ((b2 >>> 6) & 0x03)];
            buffer[offset + 3] = this._encodeTable[b2 & 0x3F];
        }
        
        return offset;
    }
    
    _updateDecode( base64, start, buffer, offset ) {
        var c0 = 0;
        var c1 = 0;
        var c2 = 0;
        var c3 = 0;
        
        for ( var length = base64.length; start + 4 <= length; start += 4, offset += 3 ) {
            c0 = this._decodeTable[base64[start    ] & 0x7F];
            c1 = this._decodeTable[base64[start + 1] & 0x7F];
            c2 = this._decodeTable[base64[start + 2] & 0x7F];
            c3 = this._decodeTable[base64[start + 3] & 0x7F];
            
            if ( c0 < 0 || c1 < 0 || c2 < 0 || c3 < 0 ) {
                throw new Error("Invalid base64 data."); 
            }
            
            buffer[offset    ] = (c0 << 2) | (c1 >>> 4);
            buffer[offset + 1] = ((c1 & 0x0F) << 4) | (c2 >>> 2);
            buffer[offset + 2] = ((c2 & 0x03) << 6) | c3;
        }
        
        return offset;
    }
    
    _finalsEncode( buffer, offset ) {
        var b0 = 0;
        var b1 = 0;
        
        if ( this._bytesOffset == 1 ) {
            b0 = this._bytesBuffer[0];
            
            buffer[offset++] = this._encodeTable[(b0 >>> 2) & 0x3F];
            buffer[offset++] = this._encodeTable[(b0 & 0x03) << 4];
            
            if ( this._withPadchar ) {
                buffer[offset++] = PADCHAR;
                buffer[offset++] = PADCHAR;
            }
        }
        
        if ( this._bytesOffset == 2 ) {
            b0 = this._bytesBuffer[0];
            b1 = this._bytesBuffer[1];
            
            buffer[offset++] = this._encodeTable[((b0 >>> 2) & 0x3F)];
            buffer[offset++] = this._encodeTable[((b0 & 0x03) << 4) | ((b1 >>> 4) & 0x0F)];
            buffer[offset++] = this._encodeTable[((b1 & 0x0F) << 2)];
            
            if ( this._withPadchar ) {
                buffer[offset++] = PADCHAR;
            }
        }
        
        return offset;
    }
    
    _finalsDecode( buffer, offset ) {
        var c0 = 0;
        var c1 = 0;
        var c2 = 0;
        
        if ( this._base64Offset == 2 ) {
            c0 = this._decodeTable[this._base64Buffer[0] & 0x7F];
            c1 = this._decodeTable[this._base64Buffer[1] & 0x7F];
            
            if ( c0 < 0 || c1 < 1 ) {
                throw new Error("Invalid base64 data.");   
            }
            
            buffer[offset++] = (c0 << 2) | (c1 >>> 4);
        }
        
        if ( this._base64Offset == 3 ) {
            c0 = this._decodeTable[this._base64Buffer[0] & 0x7F];
            c1 = this._decodeTable[this._base64Buffer[1] & 0x7F];
            c2 = this._decodeTable[this._base64Buffer[2] & 0x7F];
            
            if ( c0 < 0 || c1 < 0 || c2 < 0 ) {
                throw new Error("Invalid base64 data.");   
            }
            
            buffer[offset++] = (c0 << 2) | (c1 >>> 4);
            buffer[offset++] = ((c1 & 0x0F) << 4) | (c2 >>> 2);
        }
        
        return offset;
    }
}
