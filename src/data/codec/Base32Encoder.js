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
import TableBasedEncoding from "./TableBasedEncoding";
import { BASE32_DEFAULT_ENCODE_TABLE } from "../tables/Base32DefaultTable";

export default class Base32Encoder extends TableBasedEncoding {
    constructor( table = BASE32_DEFAULT_ENCODE_TABLE ) {
        super(table, new Uint8Array(5));
    }
    
    _initTransOutput( bytes ) {
        return new Uint8Array((this._buffer.offset + bytes.length) / 5 << 3 >>> 0);
    }
    
    _initFinalOutput() {
        return new Uint8Array(8);
    }
    
    _transchunk( bytes, output, offset ) {
        for ( var start = 0; start + 5 <= bytes.length; start += 5 ) {
            var b0 = bytes[start    ];
            var b1 = bytes[start + 1];
            var b2 = bytes[start + 2];
            var b3 = bytes[start + 3];
            var b4 = bytes[start + 4];
            
            output[offset++] = this._table[(b0 >>> 3) & 0x1F];
            output[offset++] = this._table[((b0 & 0x07) << 2) | ((b1 >>> 6) & 0x03)];
            output[offset++] = this._table[(b1 >>> 1) & 0x1F];
            output[offset++] = this._table[((b1 & 0x01) << 4) | ((b2 >>> 4) & 0x0F)];
            
            output[offset++] = this._table[((b2 & 0x0F) << 1) | ((b3 >>> 7) & 0x01)];
            output[offset++] = this._table[(b3 >>> 2) & 0x1F];
            output[offset++] = this._table[((b3 & 0x03) << 3) | ((b4 >>> 5) & 0x07)];
            output[offset++] = this._table[b4 & 0x1F];
        }

        return offset;
    }
    
    _finalchunk( output, offset ) {
        var buffer = this._buffer.buffer;
        var remain = this._buffer.offset;
        
        var b0 = 0;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        
        if ( remain == 1 ) {
            b0 = buffer[0];
            
            output[offset++] = this._table[(b0 >>> 3) & 0x1F];
            output[offset++] = this._table[(b0 & 0x07) << 2];
            
            if ( !this.omitpad ) {
                output[offset++] = this.padchar;
                output[offset++] = this.padchar;
                output[offset++] = this.padchar;
                output[offset++] = this.padchar;
                output[offset++] = this.padchar;
                output[offset++] = this.padchar;
            }
        }
        
        else if ( remain == 2 ) {
            b0 = buffer[0];
            b1 = buffer[1];
            
            output[offset++] = this._table[(b0 >>> 3) & 0x1F];
            output[offset++] = this._table[((b0 & 0x07) << 2) | ((b1 >>> 6) & 0x03)];
            output[offset++] = this._table[(b1 >>> 1) & 0x1F];
            output[offset++] = this._table[(b1 & 0x01) << 4];
            
            if ( !this.omitpad ) {
                output[offset++] = this.padchar;
                output[offset++] = this.padchar;
                output[offset++] = this.padchar;
                output[offset++] = this.padchar;
            }
        }
        
        else if ( remain == 3 ) {
            b0 = buffer[0];
            b1 = buffer[1];
            b2 = buffer[2];
            
            output[offset++] = this._table[(b0 >>> 3) & 0x1F];
            output[offset++] = this._table[((b0 & 0x07) << 2) | ((b1 >>> 6) & 0x03)];
            output[offset++] = this._table[(b1 >>> 1) & 0x1F];
            output[offset++] = this._table[((b1 & 0x01) << 4) | ((b2 >>> 4) & 0x0F)];
            output[offset++] = this._table[(b2 & 0x0F) << 1];
            
            if ( !this.omitpad ) {
                output[offset++] = this.padchar;
                output[offset++] = this.padchar;
                output[offset++] = this.padchar;
            }
        }
        
        else if ( remain == 4 ) {
            b0 = buffer[0];
            b1 = buffer[1];
            b2 = buffer[2];
            b3 = buffer[3];
            
            output[offset++] = this._table[(b0 >>> 3) & 0x1F];
            output[offset++] = this._table[((b0 & 0x07) << 2) | ((b1 >>> 6) & 0x03)];
            output[offset++] = this._table[(b1 >>> 1) & 0x1F];
            output[offset++] = this._table[((b1 & 0x01) << 4) | ((b2 >>> 4) & 0x0F)];
            output[offset++] = this._table[((b2 & 0x0F) << 1) | ((b3 >>> 7) & 0x01)];
            output[offset++] = this._table[(b3 >>> 2) & 0x1F];
            output[offset++] = this._table[(b3 & 0x03) << 3];
            
            if ( !this.omitpad ) {
                output[offset++] = this.padchar;
            }
        }
        
        return offset;
    }
}