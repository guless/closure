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

export default class UTF8Encoder extends Converter {
    constructor() {
        super(new Uint16Array(2), false);
    }
    
    sizeof( bytes ) {
        var length = this.offset + bytes.length;
        var total  = 0
    
        for ( var start = 0; start < length; ++start ) { 
            var charcode = (start >= this.offset ? bytes[start - this.offset] : this.buffer[start]);
            
            total += (charcode >= 0xD800)  && (charcode <= 0xDBFF) ? (++start >= length ? 0 : 4) : 
                     (charcode <= 0x7F) ? 1 : (charcode <= 0x7FF ? 2 : 3);
        }
        
        return total;
    }
    
    final() {
        if ( this.offset > 0 ) {
            throw new Error(`Wrong size of utf-8 encoder's final chunk. [offset=${this.offset}]`);
        }
        
        return new Uint8Array(0);
    }
    
    _createOutput( bytes ) {
        return new Uint8Array(this.sizeof(bytes));
    }
    
    _transfrom( bytes, output, offset ) {
        var position = 0;
        var length   = this.offset + bytes.length;
        
        for ( var start = 0; start < length; ++start ) {
            var charcode = (start >= this.offset ? bytes[start - this.offset] : this.buffer[start]);
            
            if ( (charcode >= 0xDC00) && (charcode <= 0xDFFF) ) {
                throw new Error(`Encounter an unpaired surrogate. [charcode="${charcode}"]`);
            }
            
            if ( (charcode >= 0xD800) && (charcode <= 0xDBFF) ) {
                if ( ++start >= length ) {
                    this._buffer[position++] = charcode;
                    break;
                }
                
                var tailcode = (start >= this.offset ? bytes[start - this.offset] : this.buffer[start]);
                
                if ( (tailcode < 0xDC00) || (tailcode > 0xDFFF) ) {
                    throw new Error(`Encounter an unpaired surrogate. [charcode="${charcode}", tailcode="${tailcode}"]`);
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
        
        this._offset = position;
        return offset;
    }
}