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

/**
 * Transfer 定义具备数据传输能力的类型的基础类型。
 */
export default class Transfer {
    /**
     * 创建一个缓冲器对象。
     * 
     * @param {Uint8Array|Uint16Array|Uint32Array} [buffer=null] - 提供用于缓冲数据的 TypedArray 对象。
     * @param {Boolean} [enabled=true] - 指示数据经过缓冲器时，是否对数据进行缓冲并分块。
     */
    constructor( buffer = null, enabled = true ) {
        /** @private */
        this._offset = 0;
        
        /** @private */
        this._totalChunks = 0;
        
        /** @private */
        this._chunkList = buffer ? new Array(2) : null;
        
        /** @private */
        this._buffer = buffer;
        
        /** @private */
        this._enabled = enabled;
    }
    
    /**
     * 获取缓冲区中的数据。
     * @type {Uint8Array|Uint16Array|Uint32Array}
     */
    get buffer() {
        return this._buffer;
    }
    
    /**
     * 获取缓冲区中的当前数据长度。
     * @type {Number}
     */
    get offset() {
        return this._offset;
    }
    
    /**
     * 获取缓冲区中的剩余空间。
     * @type {Number}
     */
    get remain() {
        return this._buffer ? this._buffer.length - this._offset : 0;
    }
    
    /**
     * 获取数据经过缓冲(update)后的数据分块列表。
     * @type {Uint8Array[]|Uint16Array[]|Uint32Array[]}
     */
    get chunkList() {
        return this._chunkList;
    }
    
    /**
     * 获取数据经过缓冲(update)后的数据块的总个数。
     * @type {Number}
     */
    get totalChunks() {
        return this._totalChunks;
    }
    
    /**
     * 指示数据经过缓冲器时，是否对数据进行缓冲并分块。
     * @type {Boolean}
     */
    get enabled() {
        return this._enabled;
    }
    
    /**
     * 将数据块传入缓冲器进行缓冲并分块。
     * 
     * @param {Uint8Array|Uint16Array|Uint32Array} bytes - 指定被传输的字节数据。
     */
    update( bytes ) {
        this._totalChunks = 0;
        
        if ( !this._buffer || !this._enabled ) {
            /// 当没有为数据传输建立缓冲区或者是禁用了数据缓冲功能时，则直接将原始数据传输出去。
            this._chunkList[this._totalChunks++] = bytes;
            return;
        }
        
        if ( bytes.length >= this.remain ) {
            /// 如果缓冲区中没有之前的数据，那么可以直接传输整个数据块。从而避免数据被拷贝一份
            /// 至缓冲区中。
            if ( this._offset == 0 /* || this._buffer.length == this.remain */ ) {
                /// 需要确保所建立的缓冲区的大小不为 0。
                if ( this._buffer.length > 0 ) { 
                    this._offset = bytes.length % this._buffer.length;
                    this._offset && this._buffer.set(bytes.subarray(-this._offset), 0);
                }
                
                this._chunkList[this._totalChunks++] = bytes;
            }
            
            else if ( bytes.length == this.remain ) {
                this._buffer.set(bytes, this._offset);
                this._offset = 0;
                
                this._chunkList[this._totalChunks++] = this._buffer;
            }
            
            else {
                this._buffer.set(bytes.subarray(0, this.remain), this._offset);
                
                this._chunkList[this._totalChunks++] = this._buffer;
                this._chunkList[this._totalChunks++] = bytes.subarray(this.remain);
                
                this._offset = (this._offset + bytes.length) % this._buffer.length;
                this._offset && this._buffer.set(bytes.subarray(-this._offset), 0);
            }
        }
        
        else {
            this._buffer.set(bytes, this._offset);
            this._offset = this._offset + bytes.length;
        }
    }
    
    /**
     * 重置缓冲器的缓冲区。
     */
    reset() {
        this._offset = 0;
        this._totalChunks = 0;
    }
    
    /**
     * 传输缓冲区中的数据(子类必须覆盖实现)。
     * @abstract
     */
    final() {
        throw new Error("Method must be implements by sub classes.");
    }
}
