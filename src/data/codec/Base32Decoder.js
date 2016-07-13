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
import Converter from "../Converter";
import trimRight from "../utils/trimRight";
import { BASE32_DEFAULT_DECODE_TABLE } from "../tables/Base32DefaultTable";

export default class Base32Decoder extends Converter {
    constructor( table = BASE32_DEFAULT_DECODE_TABLE, padchar = 61/* character(=) */ ) {
        super(new Uint8Array(8), true);
        this._table = table;
        this._padchar = padchar;
    }
    
    get padchar() {
        return this._padchar;
    }
    
    set padchar( value ) {
        this._padchar = value;
    }
    
    update( bytes ) {
        return super.update(trimRight(bytes, this.padchar, 6));
    }
    
    final() {
        if ( this.offset == 0 ) {
            return new Uint8Array(0);
        }
        
        var output = new Uint8Array(5);
        var offset = 0;
        
        var a = 0;
        var b = 0;
        var c = 0;
        var d = 0;
        var e = 0;
        var f = 0;
        var g = 0;
        
        switch( this.offset ) {
            
            case (2):
                a = this._table[this.buffer[0] & 0x7F];
                b = this._table[this.buffer[1] & 0x7F];
                
                if ( a < 0 || b < 0 ) {
                    throw new Error(`Out of base32 character range. [offset=${this.offset}]`);
                }
                
                output[offset++] = (a << 3) | (b >>> 2);
                break;
                
            case (4):
                a = this._table[this.buffer[0] & 0x7F];
                b = this._table[this.buffer[1] & 0x7F];
                c = this._table[this.buffer[2] & 0x7F];
                d = this._table[this.buffer[3] & 0x7F];
                
                if ( a < 0 || b < 0 || c < 0 || d < 0 ) {
                    throw new Error(`Out of base32 character range. [offset=${this.offset}]`);
                }
                
                output[offset++] = (a << 3) | (b >>> 2);;
                output[offset++] = ((b & 0x03) << 6) | (c << 1) | (d >>> 4);
                break;
                
            case (5):
                a = this._table[this.buffer[0] & 0x7F];
                b = this._table[this.buffer[1] & 0x7F];
                c = this._table[this.buffer[2] & 0x7F];
                d = this._table[this.buffer[3] & 0x7F];
                e = this._table[this.buffer[4] & 0x7F];
                
                if ( a < 0 || b < 0 || c < 0 || d < 0 || e < 0 ) {
                    throw new Error(`Out of base32 character range. [offset=${this.offset}]`);
                }
                
                output[offset++] = (a << 3) | (b >>> 2);;
                output[offset++] = ((b & 0x03) << 6) | (c << 1) | (d >>> 4);
                output[offset++] = ((d & 0x0F) << 4) | (e >>> 1);
                break;
                
            case (7):
                a = this._table[this.buffer[0] & 0x7F];
                b = this._table[this.buffer[1] & 0x7F];
                c = this._table[this.buffer[2] & 0x7F];
                d = this._table[this.buffer[3] & 0x7F];
                e = this._table[this.buffer[4] & 0x7F];
                f = this._table[this.buffer[5] & 0x7F];
                g = this._table[this.buffer[6] & 0x7F];
            
                if ( a < 0 || b < 0 || c < 0 || d < 0 || e < 0 || f < 0 || g < 0 ) {
                    throw new Error(`Out of base32 character range. [offset=${this.offset}]`);
                }
            
                output[offset++] = (a << 3) | (b >>> 2);;
                output[offset++] = ((b & 0x03) << 6) | (c << 1) | (d >>> 4);
                output[offset++] = ((d & 0x0F) << 4) | (e >>> 1);
                output[offset++] = ((e & 0x01) << 7) | (f << 2) | (g >>> 3);
                break;
                
            default:
                throw new Error(`Wrong size of base32 decoder's final chunk. [offset=${this.offset}]`);
        }
        
        return output.subarray(0, offset);
    }
    
    sizeof( bytes ) {
        return ((this.offset + bytes.length) >>> 3) * 5;
    }
    
    _createOutput( bytes ) {
        return new Uint8Array(this.sizeof(bytes));
    }
    
    _transfrom( bytes, output, offset ) {
        for ( var start = 0; start + 8 <= bytes.length; start += 8) {
            var a = this._table[bytes[start    ] & 0x7F];
            var b = this._table[bytes[start + 1] & 0x7F];
            var c = this._table[bytes[start + 2] & 0x7F];
            var d = this._table[bytes[start + 3] & 0x7F];
            var e = this._table[bytes[start + 4] & 0x7F];
            var f = this._table[bytes[start + 5] & 0x7F];
            var g = this._table[bytes[start + 6] & 0x7F];
            var h = this._table[bytes[start + 7] & 0x7F];
            
            if ( a < 0 || b < 0 || c < 0 || d < 0 || e < 0 || f < 0 || g < 0 || h < 0 ) {
                throw new Error(`Out of base32 character range. [offset=${start}]`);
            }
            
            output[offset++] = (a << 3) | (b >>> 2);
            output[offset++] = ((b & 0x03) << 6) | (c << 1) | (d >>> 4);
            output[offset++] = ((d & 0x0F) << 4) | (e >>> 1);
            output[offset++] = ((e & 0x01) << 7) | (f << 2) | (g >>> 3);
            output[offset++] = ((g & 0x07) << 5) | h;
        }
        
        return offset;
    }
}