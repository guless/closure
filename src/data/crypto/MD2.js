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
import Streamable from "../core/Streamable";
import { MD2_PI_TABLE } from "../tables/MD2PITable";

export default class MD2 extends Streamable {
    constructor() {
        super(new Uint8Array(16));
        
        this._digest   = new Uint8Array(48);
        this._checksum = new Uint8Array(16);
    }
    
    reset() {
        super.reset();
        
        this._digest   = new Uint8Array(48);
        this._checksum = new Uint8Array(16);
    }
    
    update( bytes ) {
        super.update(bytes);
    }
    
    final() {
        var buffer = this._buffer.buffer;
        var offset = this._buffer.offset;
        
        for ( var i = offset; i < buffer.length; ++i ) {
            buffer[i] = buffer.length - offset;
        }
        
        this._transfrom(buffer, 0);
        this._transfrom(this._checksum, 0);
        
        return this._digest.subarray(0, 16);
    }
    
    _transfrom( bytes ) {
        for ( var start = 0; start + 16 <= bytes.length; start += 16 ) {
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
}