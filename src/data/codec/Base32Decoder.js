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
import { BASE32_DEFAULT_DECODE_TABLE } from "../tables/Base32DefaultTable";

const MAX_PAD_LEN = 6;

export default class Base32Decoder extends TableBasedEncoding {
    constructor( table = BASE32_DEFAULT_DECODE_TABLE ) {
        super(table, new Uint8Array(8));
    }
    
    update( bytes ) {
        return super.update(this.dropPadchar(bytes, MAX_PAD_LEN));
    }
    
    _initTransOutput( bytes ) {
        return new Uint8Array((this._buffer.offset + bytes.length >>> 3) * 5);
    }
    
    _initFinalOutput() {
        return new Uint8Array(5);
    }
    
    _transchunk( bytes, output, offset ) {
        for ( var start = 0; start + 8 <= bytes.length; start += 8) {
            var c0 = this._table[bytes[start    ] & 0x7F];
            var c1 = this._table[bytes[start + 1] & 0x7F];
            var c2 = this._table[bytes[start + 2] & 0x7F];
            var c3 = this._table[bytes[start + 3] & 0x7F];
            var c4 = this._table[bytes[start + 4] & 0x7F];
            var c5 = this._table[bytes[start + 5] & 0x7F];
            var c6 = this._table[bytes[start + 6] & 0x7F];
            var c7 = this._table[bytes[start + 7] & 0x7F];
            
            if ( c0 < 0 || c1 < 0 || c2 < 0 || c3 < 0 || c4 < 0 || c5 < 0 || c6 < 0 || c7 < 0 ) {
                var chars = [c0, c1, c2, c3, c4, c5, c6, c7];
                
                throw new Error(`outof base32 character range. { offset=[${start}...${start+7}], character=[${chars}] }`); 
            }
            
            output[offset++] = (c0 << 3) | (c1 >>> 2);
            output[offset++] = ((c1 & 0x03) << 6) | (c2 << 1) | (c3 >>> 4);
            output[offset++] = ((c3 & 0x0F) << 4) | (c4 >>> 1);
            output[offset++] = ((c4 & 0x01) << 7) | (c5 << 2) | (c6 >>> 3);
            output[offset++] = ((c6 & 0x07) << 5) | c7;
        }
        
        return offset;
    }
    
    _finalchunk( output, offset ) {
        var buffer = this._buffer.buffer;
        var remain = this._buffer.offset;
        
        if ( remain == 1 || remain == 3 || remain == 6 ) {
            throw new Error(`wrong size of base32 final chunk. { buffer=[${buffer}], offset=${remain} }`);
        }
        
        var c0 = 0;
        var c1 = 0;
        var c2 = 0;
        var c3 = 0;
        var c4 = 0;
        var c5 = 0;
        var c6 = 0;
        
        if ( remain == 2 ) {
            c0 = this._table[buffer[0] & 0x7F];
            c1 = this._table[buffer[1] & 0x7F];
            
            if ( c0 < 0 || c1 < 0 ) {
                var chars = [c0, c1];
                
                throw new Error(`outof base32 character range. { offset=[0...1], character=[${chars}], buffer=[${buffer}] }`);
            }
            
            output[offset++] = (c0 << 3) | (c1 >>> 2);;
        }
        
        else if ( remain == 4 ) {
            c0 = this._table[buffer[0] & 0x7F];
            c1 = this._table[buffer[1] & 0x7F];
            c2 = this._table[buffer[2] & 0x7F];
            c3 = this._table[buffer[3] & 0x7F];
            
            if ( c0 < 0 || c1 < 0 || c2 < 0 || c3 < 0 ) {
                var chars = [c0, c1, c2, c3];
                
                throw new Error(`outof base32 character range. { offset=[0...3], character=[${chars}], buffer=[${buffer}] }`);
            }
            
            output[offset++] = (c0 << 3) | (c1 >>> 2);;
            output[offset++] = ((c1 & 0x03) << 6) | (c2 << 1) | (c3 >>> 4);
        }
        
        else if ( remain == 5 ) {
            c0 = this._table[buffer[0] & 0x7F];
            c1 = this._table[buffer[1] & 0x7F];
            c2 = this._table[buffer[2] & 0x7F];
            c3 = this._table[buffer[3] & 0x7F];
            c4 = this._table[buffer[4] & 0x7F];
            
            if ( c0 < 0 || c1 < 0 || c2 < 0 || c3 < 0 || c4 < 0 ) {
                var chars = [c0, c1, c2, c3, c4];
                
                throw new Error(`outof base32 character range. { offset=[0...4], character=[${chars}], buffer=[${buffer}] }`);
            }
            
            output[offset++] = (c0 << 3) | (c1 >>> 2);;
            output[offset++] = ((c1 & 0x03) << 6) | (c2 << 1) | (c3 >>> 4);
            output[offset++] = ((c3 & 0x0F) << 4) | (c4 >>> 1);
        }
        
        else if ( remain == 7 ) {
            c0 = this._table[buffer[0] & 0x7F];
            c1 = this._table[buffer[1] & 0x7F];
            c2 = this._table[buffer[2] & 0x7F];
            c3 = this._table[buffer[3] & 0x7F];
            c4 = this._table[buffer[4] & 0x7F];
            c5 = this._table[buffer[5] & 0x7F];
            c6 = this._table[buffer[6] & 0x7F];
            
            if ( c0 < 0 || c1 < 0 || c2 < 0 || c3 < 0 || c4 < 0 || c5 < 0 || c6 < 0 ) {
                var chars = [c0, c1, c2, c3, c4, c5, c6];
                
                throw new Error(`outof base32 character range. { offset=[0...6], character=[${chars}], buffer=[${buffer}] }`);
            }
            
            output[offset++] = (c0 << 3) | (c1 >>> 2);;
            output[offset++] = ((c1 & 0x03) << 6) | (c2 << 1) | (c3 >>> 4);
            output[offset++] = ((c3 & 0x0F) << 4) | (c4 >>> 1);
            output[offset++] = ((c4 & 0x01) << 7) | (c5 << 2) | (c6 >>> 3);
        }
        
        return offset;
    }
}