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

export default class UTF8Decoder extends Converter {
    constructor() {
        super(new Uint8Array(4), false);
    }
    
    sizeof( bytes ) {
        var length = this.offset + bytes.length
        var total  = 0;
        
        for ( var start = 0; start < length; ++start ) {
            var charcode = (start >= this.offset ? bytes[start - this.offset] : this.buffer[start]);
            
            total += (charcode <= 0x7F ? 1 : 
                     (charcode & 0xF0) == 0xF0 ? ((start += 3) >= length ? 0 : 2) :
                     (charcode & 0xE0) == 0xE0 ? ((start += 2) >= length ? 0 : 1) :
                     (charcode & 0xC0) == 0xC0 ? ((start += 1) >= length ? 0 : 1) : 0);
        }
        
        return total;
    }
    
    final() {
        if ( this.offset > 0 ) {
            throw new Error(`Wrong size of utf-8 decoder's final chunk. [offset=${this.offset}]`);
        }
        
        return new Uint16Array(0);
    }
    
    _createOutput( bytes ) {
        return new Uint16Array(this.sizeof(bytes));
    }
    
    _transfrom( bytes, output, offset ) {
        var position = 0;
        var total    = 0;
        var length   = this.offset + bytes.length;
        
        for ( var start = 0; start < length; ++start ) {
            var charcode = (start >= this.offset ? bytes[start - this.offset] : this.buffer[start]);
            
            if ( charcode >= 0x80 ) {
                if ( (charcode < 0xC2) || (charcode > 0xF4) ) { 
                    throw new Error(`Invaild utf-8 character. [offset=${start}, charcode="${charcode}"]`);
                }
                
                if ( (charcode & 0xF0) == 0xF0 ) {
                    total = start + 3;
                    charcode = charcode & 0x07;
                }
                
                else if ( (charcode & 0xE0) == 0xE0 ) {
                    total = start + 2;
                    charcode = charcode & 0x0F;
                }
                
                else if ( (charcode & 0xC0) == 0xC0 ) {
                    total = start + 1;
                    charcode = charcode & 0x1F;
                }
                
                else {
                    throw new Error(`Invaild utf-8 character. [offset=${start}, charcode="${charcode}"]`);
                }
                
                if ( total >= length ) {
                    while ( start < length ) { 
                        this.buffer[position++] = (start >= this.offset ? bytes[start++ - this.offset] : this.buffer[start++]); 
                    }
                    break;
                }
                
                while ( (start + 1) <= total ) {
                    var tailcode = (++start >= this.offset ? bytes[start - this.offset] : this.buffer[start]);
                    
                    if ( (tailcode < 0x80) || (tailcode > 0xBF) ) {
                        throw new Error(`Invaild utf-8 trialing character. [offset=${start}, charcode="${tailcode}"]`);
                    }
                    
                    charcode = ((charcode << 6) | (tailcode & 0x3F));
                }
            }
            
            if ( (charcode >= 0xD800) && (charcode <= 0xDFFF) ) {
                throw new Error(`Encounter an unpaired surrogate. [charcode="${charcode}"]`);
            }
            
            if ( charcode >= 0x10000 ) {
                output[offset++] = (charcode >> 10) + 0xD7C0;
                output[offset++] = (charcode & 0x3FF) + 0xDC00;
            }
            
            else {
                output[offset++] = charcode;
            }
        };
        
        this._offset = position;
        return offset;
    }
}