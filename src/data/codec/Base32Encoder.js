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
import { BASE32_DEFAULT_ENCODE_TABLE } from "../tables/Base32DefaultTable";

export default class Base32Encoder extends Converter {
    constructor( table = BASE32_DEFAULT_ENCODE_TABLE, padchar = 61/* character(=) */, omitPad = false ) {
        super(new Uint8Array(5), true);
        this._table = table;
        this._padchar = padchar;
        this._omitPad = omitPad;
    }
    
    get padchar() {
        return this._padchar;
    }
    
    set padchar( value ) {
        this._padchar = value;
    }
    
    get omitPad() {
        return this._omitPad;
    }
    
    set omitPad( value ) {
        this._omitPad = value;
    }
    
    final() {
        if ( this.offset == 0 ) {
            return new Uint8Array(0);
        }
        
        var output = new Uint8Array(8);
        var offset = 0;
        
        for ( var i = 0; i < output.length; ++i ) {
            output[i] = this._padchar;
        }
        
        switch( this.offset ) {
            
            case (1):
                output[offset++] = this._table[(this.buffer[0] >>> 3) & 0x1F];
                output[offset++] = this._table[(this.buffer[0] & 0x07) << 2];
                break;
                
            case (2):
                output[offset++] = this._table[(this.buffer[0] >>> 3) & 0x1F];
                output[offset++] = this._table[((this.buffer[0] & 0x07) << 2) | ((this.buffer[1] >>> 6) & 0x03)];
                output[offset++] = this._table[(this.buffer[1] >>> 1) & 0x1F];
                output[offset++] = this._table[(this.buffer[1] & 0x01) << 4];
                break;
                
            case (3):
                output[offset++] = this._table[(this.buffer[0] >>> 3) & 0x1F];
                output[offset++] = this._table[((this.buffer[0] & 0x07) << 2) | ((this.buffer[1] >>> 6) & 0x03)];
                output[offset++] = this._table[(this.buffer[1] >>> 1) & 0x1F];
                output[offset++] = this._table[((this.buffer[1] & 0x01) << 4) | ((this.buffer[2] >>> 4) & 0x0F)];
                output[offset++] = this._table[(this.buffer[2] & 0x0F) << 1];
                break;
                
            case (4):
                output[offset++] = this._table[(this.buffer[0] >>> 3) & 0x1F];
                output[offset++] = this._table[((this.buffer[0] & 0x07) << 2) | ((this.buffer[1] >>> 6) & 0x03)];
                output[offset++] = this._table[(this.buffer[1] >>> 1) & 0x1F];
                output[offset++] = this._table[((this.buffer[1] & 0x01) << 4) | ((this.buffer[2] >>> 4) & 0x0F)];
                output[offset++] = this._table[((this.buffer[2] & 0x0F) << 1) | ((this.buffer[3] >>> 7) & 0x01)];
                output[offset++] = this._table[(this.buffer[3] >>> 2) & 0x1F];
                output[offset++] = this._table[(this.buffer[3] & 0x03) << 3];
                break;
                
            default:
                throw new Error(`Wrong size of base32 encoder's final chunk. [offset=${this.offset}]`);
        }
        
        return (this.omitPad ? output.subarray(0, offset) : output);
    }
    
    sizeof( bytes ) {
        return ((this.offset + bytes.length) / 5 << 3) >>> 0;
    }
    
    _createOutput( bytes ) {
        return new Uint8Array(this.sizeof(bytes));
    }
    
    _transfrom( bytes, output, offset ) {
        for ( var start = 0; start + 5 <= bytes.length; start += 5 ) {
            var a = bytes[start    ];
            var b = bytes[start + 1];
            var c = bytes[start + 2];
            var d = bytes[start + 3];
            var e = bytes[start + 4];
            
            output[offset++] = this._table[(a >>> 3) & 0x1F];
            output[offset++] = this._table[((a & 0x07) << 2) | ((b >>> 6) & 0x03)];
            output[offset++] = this._table[(b >>> 1) & 0x1F];
            output[offset++] = this._table[((b & 0x01) << 4) | ((c >>> 4) & 0x0F)];
            
            output[offset++] = this._table[((c & 0x0F) << 1) | ((d >>> 7) & 0x01)];
            output[offset++] = this._table[(d >>> 2) & 0x1F];
            output[offset++] = this._table[((d & 0x03) << 3) | ((e >>> 5) & 0x07)];
            output[offset++] = this._table[e & 0x1F];
        }

        return offset;
    }
}