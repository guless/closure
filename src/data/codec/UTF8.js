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

export default class UTF8 {
    constructor() {
        this._utf16Buffer = new Uint16Array(2);
        this._utf16Offset = 0;

        this._utf8Buffer  = new Uint8Array(4);
        this._utf8Offset  = 0;
    }

    encode( utf16, final = true, shared = null ) {
        var buffer = shared || new Uint8Array(this._sizeOfUtf16Encode(utf16));
        var length = utf16.length + this._utf16Offset;
        var point  = 0;
        var start  = 0;
        var offset = 0;
        var remain = 0;

        while( start < length ) {
            var charcode = (start >= this._utf16Offset ? utf16[start - this._utf16Offset] : this._utf16Buffer[start]);

            if ( (charcode >= 0xDC00) && (charcode <= 0xDFFF) ) {
                /// 遇到 UTF-16 代理对的“后尾代理”。
                throw new Error(`Invaild UTF-16 character. offset=${start}`);
            }

            if ( (charcode >= 0xD800) && (charcode <= 0xDBFF) ) {
                /// 遇到 UTF-16 代理对的“前导代理”。
                ++start;

                if ( start >= length ) {
                    if ( final ) {
                        throw new Error(`Invaild UTF-16 character. offset=${start - 1}`);
                    }

                    this._utf16Buffer[remain++] = charcode;
                    break;
                }

                var tailcode = (start >= this._utf16Offset ? utf16[start - this._utf16Offset] : this._utf16Buffer[start]);

                if ( (tailcode < 0xDC00) || (tailcode > 0xDFFF) ) {
                    throw new Error(`Invaild UTF-16 character. offset=${start}`);
                }

                point = ((charcode & 0x3FF) << 10 | (tailcode & 0x3FF)) + 0x10000;
            }

            else {
                point = charcode
            }
            
            if ( point <= 0x7F ) {
                buffer[offset++] = (point);
            }

            else if ( point <= 0x7FF ) {
                buffer[offset++] = ((point >>>  6) + 0xC0);
                buffer[offset++] = ((point & 0x3F) + 0x80);
            }

            else if ( point <= 0xFFFF ) {
                buffer[offset++] = ((point  >>> 12) + 0xE0);
                buffer[offset++] = (((point >>>  6) & 0x3F) + 0x80);
                buffer[offset++] = ((point  & 0x3F) + 0x80);
            }

            else {
                buffer[offset++] = ((point  >>> 18) + 0xF0);
                buffer[offset++] = (((point >>> 12) & 0x3F) + 0x80);
                buffer[offset++] = (((point >>>  6) & 0x3F) + 0x80);
                buffer[offset++] = ((point  & 0x3F) + 0x80);
            }

            ++start;
        }

        this._utf16Offset = remain;
        return shared ? shared.subarray(0, offset) : buffer;
    }

    decode( utf8, final = true, shared = null ) {
        var buffer = shared || new Uint16Array(this._sizeOfUtf8Decode(utf8));
        var length = utf8.length + this._utf8Offset;
        var point  = 0;
        var total  = 0;
        var start  = 0;
        var offset = 0;
        var remain = 0;
        
        while( start < length ) {
            var bytecode = (start >= this._utf8Offset ? utf8[start - this._utf8Offset] : this._utf8Buffer[start]);
            
            if ( bytecode >= 0x80 ) {
                if ( (bytecode < 0xC2) || (bytecode > 0xF4) ) { 
                    throw new Error(`Invaild UTF-8 character. offset=${start}`);
                }
                
                if ( (bytecode & 0xF0) == 0xF0 ) {
                    point = (bytecode & 0x07);
                    total = start + 3;
                }
                
                else if ( (bytecode & 0xE0) == 0xE0 ) {
                    point = (bytecode & 0x0F);
                    total = start + 2;
                }
                
                else if ( (bytecode & 0xC0) == 0xC0 ) {
                    point = (bytecode & 0x1F);
                    total = start + 1;
                }
                
                else {
                    throw new Error(`Invaild UTF-8 character. offset=${start}`);
                }
                
                if ( total >= length ) {
                    if ( final ) {
                        throw new Error(`Invaild UTF-8 character. offset=${start}`);
                    }
                    
                    this._utf8Buffer[remain++] = bytecode;
                    
                    while( (start + 1) < length ) {
                        ++start;
                        bytecode = (start >= this._utf8Offset ? utf8[start - this._utf8Offset] : this._utf8Buffer[start]);
                        this._utf8Buffer[remain++] = bytecode;
                    }
                    
                    break;
                }

                while( (start + 1 <= total) ) {
                    ++start;
                    bytecode = (start >= this._utf8Offset ? utf8[start - this._utf8Offset] : this._utf8Buffer[start]);
                    
                    if ( (bytecode < 0x80) || (bytecode > 0xBF) ) {
                        throw new Error(`Invaild UTF-8 character. offset=${start}`);
                    }
                    
                    point = ((point << 6) | (bytecode & 0x3F));
                }
            }
            
            else {
                point = bytecode;
            }
            
            if ( (point >= 0xD800) && (point <= 0xDFFF) ) {
                throw new Error(`Invaild UTF-16 character. codePoint=${point}`);
            }
            
            if ( point >= 0x10000 ) {
                buffer[offset++] = (point >> 10) + 0xD7C0;
                buffer[offset++] = (point & 0x3FF) + 0xDC00;
            }
            
            else {
                buffer[offset++] = point;
            }
            
            ++start;
        }
        
        this._utf8Offset = remain;
        return shared ? shared.subarray(0, offset) : buffer;
    }

    _sizeOfUtf16Encode( utf16 ) {
        var count  = 0;
        var start  = 0;
        var length = utf16.length + this._utf16Offset;

        while( start < length ) {
            var charcode = (start >= this._utf16Offset ? utf16[start - this._utf16Offset] : this._utf16Buffer[start]);

            if ( (charcode >= 0xD800) && (charcode <= 0xDBFF) ) {
                ++start;

                if ( start >= length ) {
                    --count;
                    break;
                }

                count += 2;
            }

            else if ( charcode > 0x7F ) {
                if ( charcode <= 0x7FF ) {
                    ++count;
                }

                else if ( charcode <= 0xFFFF ) {
                    count += 2;
                }
            }

            ++start;
        }

        count += length;

        return count;
    }

    _sizeOfUtf8Decode( utf8 ) {
        var count  = 0;
        var start  = 0;
        var length = utf8.length + this._utf8Offset;

        while( start < length ) {
            var bytecode = (start >= this._utf8Offset ? utf8[start - this._utf8Offset] : this._utf8Buffer[start]);

            if ( bytecode <= 0x7F ) {
                ++count;
            }

            else if ( (bytecode & 0xF0) == 0xF0 ) {
                start += 3;

                if ( start >= length ) {
                    break;
                }

                count += 2;
            }

            else if ( (bytecode & 0xE0) == 0xE0 ) {
                start += 2;

                if ( start >= length ) {
                    break;
                }

                ++count;
            }

            else if ( (bytecode & 0xC0) == 0xC0 ) {
                ++start;

                if ( start >= length ) {
                    break;
                }

                ++count;
            }

            ++start;
        }

        return count;
    }
}
