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
import { BASE16_LOWER_ENCODE_TABLE } from "./Base16LowerTable";
import { BASE16_LOWER_DECODE_TABLE } from "./Base16LowerTable";


export default class Base16 {
    constructor( encodeTable = BASE16_LOWER_ENCODE_TABLE, decodeTable = BASE16_LOWER_DECODE_TABLE ) {
        this._base16Offset = 0;
        this._base16Buffer = 0;
        this._encodeTable  = encodeTable;
        this._decodeTable  = decodeTable;
    }
    
    get encodeTable() {
        return this._encodeTable;   
    }
    
    get decodeTable() {
        return this._decodeTable;   
    }
    
    encode( bytes, finals = true, shared = null ) {
        var length = bytes.length;
        var offset = 0;
        var buffer = shared || new Uint8Array(length * 2);
        
        for ( var i = 0; i < length; ++i, offset += 2 ) {
            buffer[offset    ] = this._encodeTable[(bytes[i] >>> 4) & 0x0F];
            buffer[offset + 1] = this._encodeTable[(bytes[i] & 0x0F)];
        }
        
        return shared ? shared.subarray(0, offset) : buffer;
    }
    
    decode( base16, finals = true, shared = null ) {
        if ( finals && ((this._base16Offset + base16.length) & 1) ) {
            throw new Error("Invalid base16 data.");
        }

        var length = base16.length;
        var buffer = shared || new Uint8Array(Math.floor((this._base16Offset + length) / 2));
        var offset = 0;
        
        if ( length > 0 ) {
            var c0 = 0;
            var c1 = 0;
            
            if ( this._base16Offset > 0 ) {
                c0 = this._decodeTable[this._base16Buffer & 0x7F];
                c1 = this._decodeTable[base16[0] & 0x7F];
                
                if ( c0 < 0 || c1 < 0 ) {
                    throw new Error("Invalid base16 data.");
                }
                
                buffer[offset++] = c0 << 4 | c1;
            }
            
            for ( var start = this._base16Offset > 0 ? 1 : 0; start + 2 <= length; start += 2 ) {
                c0 = this._decodeTable[base16[start    ] & 0x7F];
                c1 = this._decodeTable[base16[start + 1] & 0x7F];
                
                if ( c0 < 0 || c1 < 0 ) {
                    throw new Error("Invalid base16 data.");
                }
                
                buffer[offset++] = c0 << 4 | c1;
            }
            
            this._base16Offset = length - start;
            
            if ( this._base16Offset > 0 ) {
                this._base16Buffer = base16[length - 1];
            }
        }
        
        return shared ? shared.subarray(0, offset) : buffer;
    }
}