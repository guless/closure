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
import { BASE64_DEFAULT_DECODE_TABLE } from "../tables/Base64DefaultTable";

const MAX_PAD_LEN = 2;

export default class Base64Decoder extends TableBasedEncoding {
    constructor( table = BASE64_DEFAULT_DECODE_TABLE ) {
        super(table, new Uint8Array(4));
    }

    update( bytes ) {
        return super.update(this.dropPadchar(bytes, MAX_PAD_LEN));
    }

    _initTransOutput( bytes ) {
        return new Uint8Array((this._buffer.offset + bytes.length >>> 2) * 3);
    }
    
    _initFinalOutput() {
        return new Uint8Array(3);
    }

    _transchunk( bytes, output, offset ) {
        for ( var start = 0; start + 4 <= bytes.length; start += 4 ) {
            var c0 = this._table[bytes[start    ] & 0x7F];
            var c1 = this._table[bytes[start + 1] & 0x7F];
            var c2 = this._table[bytes[start + 2] & 0x7F];
            var c3 = this._table[bytes[start + 3] & 0x7F];
            
            if ( c0 < 0 || c1 < 0 || c2 < 0 || c3 < 0 ) {
                var chars = [c0, c1, c2, c3];
                
                throw new Error(`outof base64 character range. { offset=[${start}...${start+3}], character=[${chars}] }`); 
            }
            
            output[offset++] = (c0 << 2) | (c1 >>> 4);
            output[offset++] = ((c1 & 0x0F) << 4) | (c2 >>> 2);
            output[offset++] = ((c2 & 0x03) << 6) | c3;
        }
        
        return offset;
    }

    _finalchunk( output, offset ) {
        var buffer = this._buffer.buffer;
        var remain = this._buffer.offset;

        if ( remain == 1 ) {
            throw new Error(`wrong size of base64 final chunk. { buffer=[${buffer}], offset=${remain} }`);
        }

        var c0 = 0;
        var c1 = 0;
        var c2 = 0;

        if ( remain == 2 ) {
            c0 = this._table[buffer[0] & 0x7F];
            c1 = this._table[buffer[1] & 0x7F];
            
            if ( c0 < 0 || c1 < 1 ) {
                var chars = [c0, c1];
                
                throw new Error(`outof base64 character range. { offset=[0...1], character=[${chars}], buffer=[${buffer}] }`); 
            }
            
            output[offset++] = (c0 << 2) | (c1 >>> 4);
        }
        
        else if ( remain == 3 ) {
            c0 = this._table[buffer[0] & 0x7F];
            c1 = this._table[buffer[1] & 0x7F];
            c2 = this._table[buffer[2] & 0x7F];
            
            if ( c0 < 0 || c1 < 0 || c2 < 0 ) {
                var chars = [c0, c1, c2];
                
                throw new Error(`outof base64 character range. { offset=[0...2], character=[${chars}], buffer=[${buffer}] }`); 
            }
            
            output[offset++] = (c0 << 2) | (c1 >>> 4);
            output[offset++] = ((c1 & 0x0F) << 4) | (c2 >>> 2);
        }

        return offset;
    }
}