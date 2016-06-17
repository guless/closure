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
import Sharedable from "../core/Sharedable";

export default class UTF8Decoder extends Sharedable {
    constructor() {
        super(new Uint8Array(4));
        /* Protected */
        this._autoRestore = false;
    }
    
    sizeof( bytes ) {
        var buffer = this._buffer.buffer;
        var offset = this._buffer.offset;
        var total  = 0;
        var length = offset + bytes.length
        
        for ( var start = 0; start < length; ++start ) {
            var charcode = (start >= offset ? bytes[start - offset] : buffer[start]);
            
            if ( charcode <= 0x7F ) {
                ++total;
            }
            
            else if ( (charcode & 0xF0) == 0xF0 ) {
                start += 3;
                total += start >= length ? 0 : 2;
            }
            
            else if ( (charcode & 0xE0) == 0xE0 ) {
                start += 2;
                total += start >= length ? 0 : 1;
            }
            
            else if ( (charcode & 0xC0) == 0xC0 ) {
                ++start;
                total += start >= length ? 0 : 1;
            }
        }
        
        return total;
    }
    
    _initTransOutput( bytes ) {
        return new Uint16Array(this.sizeof(bytes));
    }
    
    _transchunk( bytes, output, offset ) {
        var buffer = this._buffer.buffer;
        var remain = this._buffer.offset;
        var length = offset + bytes.length
        
        this._buffer.reset();
        
        for ( var start = 0, total = 0; start < length; ++start ) {
            var charcode = (start >= remain ? bytes[start - remain] : buffer[start]);
            
            if ( charcode >= 0x80 ) {
                if ( (charcode < 0xC2) || (charcode > 0xF4) ) { 
                    throw new Error(`Invaild utf-8 character. { offset=${start}, charcode=${charcode} }`);
                }
                
                if ( (charcode & 0xF0) == 0xF0 ) {
                    total = start + 3;
                    charcode = (charcode & 0x07);
                }
                
                else if ( (charcode & 0xE0) == 0xE0 ) {
                    total = start + 2;
                    charcode = (charcode & 0x0F);
                }
                
                else if ( (charcode & 0xC0) == 0xC0 ) {
                    total = start + 1;
                    charcode = (charcode & 0x1F);
                }
                
                else {
                    throw new Error(`Invaild utf-8 character. { offset=${start}, charcode=${charcode} }`);
                }
                
                /// 当前数据不足解码，将数据储存进 buffer 中。
                if ( total >= length ) {
                    this._buffer.write(start >= remain ? bytes[start - remain] : buffer[start]);
                    
                    while( (start + 1) < length ) {
                        this._buffer.write(++start >= remain ? bytes[start - remain] : buffer[start]);
                    }
                    
                    break;
                }
                
                /// 将后续的字节组合成一个 Unicode 码位。
                while( (start + 1 <= total) ) {
                    var tailcode = (++start >= remain ? bytes[start - remain] : buffer[start]);
                    
                    if ( (tailcode < 0x80) || (tailcode > 0xBF) ) {
                        throw new Error(`Invaild utf-8 trialing character. { offset=${start}, charcode=${tailcode} }`);
                    }
                    
                    charcode = ((charcode << 6) | (tailcode & 0x3F));
                }
            }
            
            if ( (charcode >= 0xD800) && (charcode <= 0xDFFF) ) {
                throw new Error(`Invaild utf-16 character. codePoint=${charcode}`);
            }
            
            if ( charcode >= 0x10000 ) {
                output[offset++] = (charcode >> 10) + 0xD7C0;
                output[offset++] = (charcode & 0x3FF) + 0xDC00;
            }
            
            else {
                output[offset++] = charcode;
            }
        };
        
        return offset;
    }
    
    final() {
        if ( this._buffer.offset > 0 ) {
            throw new Error(`wrong size of utf-8 final chunk. { buffer=[${this._buffer.buffer}], offset=${this._buffer.offset} }`);
        }
        
        return super.final();
    }
}