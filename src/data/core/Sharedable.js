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
import Streamable from "./Streamable";

const EMPTY_UINT8_ARRAY = new Uint8Array(0);

export default class Sharedable extends Streamable {
    constructor( buffer = null, shared = null ) {
        super(buffer);
        
        this._shared = shared;
        this._offset = 0;
        this._output = null;
    }
    
    get shared() {
        return this._shared;
    }
    
    set shared( value ) {
        this._shared = value;
    }
    
    get output() {
        return this._output;
    }
    
    get offset() {
        return this._offset;
    }
    
    _initTransOutput( bytes ) {
        /* Protected */
        throw new Error("method does not implements.");
    }
    
    _initFinalOutput() {
        /* Protected */
        throw new Error("method does not implements.");
    }
    
    _transchunk( bytes, output, offset ) {
        /* Protected */
        return offset;
    }
    
    _finalchunk( output, offset ) {
        /* Protected */
        return offset;
    }
    
    update( bytes ) {
        this._output = this._shared || this._initTransOutput(bytes);
        this._offset = 0;
        
        super.update(bytes);
        
        if ( this._offset > this._output.length ) {
            if ( this._shared ) {
                throw new Error("no enough shared memory.");
            }
            
            else {
                throw new Error("the offset was outof output range.");
            }
        }
        
        return this._offset == this._output.length ? this._output : (this._output = this._output.subarray(0, this._offset));
    }
    
    final() {
        if ( !this._buffer || this._buffer.offset == 0 ) {
            this._output = EMPTY_UINT8_ARRAY;
            this._offset = 0;
        }
        
        else {
            this._output = this._shared || this._initFinalOutput();
            this._offset = this._finalchunk(this._output, 0);
        }
        
        if ( this._offset > this._output.length ) {
            if ( this._shared ) {
                throw new Error("no enough shared memory.");
            }
            
            else {
                throw new Error("the offset was outof output range.");
            }
        }
        
        return this._offset == this._output.length ? this._output : (this._output = this._output.subarray(0, this._offset));
    }
    
    _transfrom( bytes ) {
        /* Override */
        this._offset = this._transchunk(bytes, this._output, this._offset);
    }
}
