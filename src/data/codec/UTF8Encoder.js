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

export default class UTF8Encoder extends Sharedable {
    constructor() {
        super(new Uint16Array(2));
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
            
            if ( (charcode >= 0xD800) && (charcode <= 0xDBFF) ) {
                ++start;
                total += (start >= length ? -1 : 2);
            }
            
            else if ( charcode > 0x7F ) {
                total += (charcode <= 0x7FF ? 1 : 2);
            }
        }
        
        return length + total;
    }
    
    _initTransOutput( bytes ) {
        return new Uint8Array(this.sizeof(bytes));
    }
    
    _transchunk( bytes, output, offset ) {
        var buffer = this._buffer.buffer;
        var remain = this._buffer.offset;
        var length = offset + bytes.length;
        
        this._buffer.reset();
        
        for ( var start = 0; start < length; ++start ) {
            var charcode = (start >= remain ? bytes[start - remain] : buffer[start]);
            
            if ( (charcode >= 0xDC00) && (charcode <= 0xDFFF) ) {
                /// 遇到 UTF-16 代理对的“后尾代理”。
                throw new Error(`Invaild utf-16 character. { offset=${start}, charcode=${charcode} }`);
            }

            else if ( (charcode >= 0xD800) && (charcode <= 0xDBFF) ) {
                /// 遇到 UTF-16 代理对的“前导代理”。
                ++start;

                if ( start >= length ) {
                    /// 没有足够的字节用来读取后尾代理。
                    this._buffer.write(charcode);
                    break;
                }

                var tailcode = (start >= remain ? bytes[start - remain] : buffer[start]);

                if ( (tailcode < 0xDC00) || (tailcode > 0xDFFF) ) {
                    /// 该字符不是有效的 UTF-16 后尾代理。
                    throw new Error(`Invaild utf-16 trialing surrogate character. { offset=${start}, tailcode=${tailcode} }`);
                }

                charcode = ((charcode & 0x3FF) << 10 | (tailcode & 0x3FF)) + 0x10000;
            }
            
            if ( charcode <= 0x7F ) {
                output[offset++] = (charcode);
            }

            else if ( charcode <= 0x7FF ) {
                output[offset++] = ((charcode >>>  6) + 0xC0);
                output[offset++] = ((charcode & 0x3F) + 0x80);
            }

            else if ( charcode <= 0xFFFF ) {
                output[offset++] = ((charcode  >>> 12) + 0xE0);
                output[offset++] = (((charcode >>>  6) & 0x3F) + 0x80);
                output[offset++] = ((charcode  & 0x3F) + 0x80);
            }

            else {
                output[offset++] = ((charcode  >>> 18) + 0xF0);
                output[offset++] = (((charcode >>> 12) & 0x3F) + 0x80);
                output[offset++] = (((charcode >>>  6) & 0x3F) + 0x80);
                output[offset++] = ((charcode  & 0x3F) + 0x80);
            }
        }

        return offset;
    }
    
    final() {
        if ( this._buffer.offset > 0 ) {
            throw new Error(`wrong size of utf-8 final chunk. { buffer=[${this._buffer.buffer}], offset=${this._buffer.offset} }`);
        }
        
        return super.final();
    }
}