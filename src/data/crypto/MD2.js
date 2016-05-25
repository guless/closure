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
import { MD2_PI_TABLE       } from "./MD2PITable";

export default class MD2 {
    constructor() {
        this._init();
    }
    
    _init() {
        this._status   = UPDATING;
        this._offset   = 0;
        this._buffer   = new Uint8Array(16);
        this._digest   = new Uint8Array(48);
        this._checksum = new Uint8Array(16);
    }
    
    _transform( bytes, start ) {
        for ( var length = bytes.length; start + 16 <= length; start += 16 ) {
            var t = 0;
            
            for ( var i = 0; i < 16; ++i ) {
                this._digest[i + 16] = bytes[start + i];
                this._digest[i + 32] = bytes[start + i] ^ this._digest[i];
            }
            
            for ( var j = 0; j < 18; ++j ) {
                for ( var m = 0; m < 48; ++m ) {
                    t = (this._digest[m] ^= MD2_PI_TABLE[t]);
                }
                t = (t + j) & 0xFF;
            }
            
            t = this._checksum[15];
            
            for ( var k = 0; k < 16; ++k ) {
                t = (this._checksum[k] ^= MD2_PI_TABLE[bytes[start + k] ^ t]);
            }
        }
    }
    
    update( bytes ) {
        if ( this._status == DIGESTED ) {
            this._init();
        }
        
        var length = bytes.length;
        var remain = 16 - this._offset;
        
        if ( length >= remain ) {
            if ( remain != 16 ) {
                this._buffer.set(bytes.subarray(0, remain), this._offset);
                this._transform(this._buffer, 0);
            }
            
            else {
                remain = 0;
            }
            
            this._transform(bytes, remain);
            this._offset = (length - remain) % 16;
            
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
        
        var padchar = 16 - this._offset;
        
        if ( this._buffer.fill ) {
            this._buffer.fill(padchar, this._offset);
        }
        
        else {
            for ( var i = this._offset; i < 16; ++i ) {
                this._buffer[i] = padchar;
            }
        }
        
        this._transform(this._buffer, 0);
        this._transform(this._checksum, 0);
        
        return this._digest.subarray(0, 16);
    }
}