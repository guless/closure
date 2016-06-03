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
import { CRC16_TYPE_DEFAULT } from "./CRC16Type";
import { CRC16_TYPE_CCITT   } from "./CRC16Type";
import { CRC16_TYPE_KERMIT  } from "./CRC16Type";
import { CRC16_TYPE_MODBUS  } from "./CRC16Type";
import { CRC16_TYPE_XMODEM  } from "./CRC16Type";

import { CRC16_DEFAULT_TABLE } from "./CRC16DefaultTable";
import { CRC16_CCITT_TABLE   } from "./CRC16CCITTTable";
import { CRC16_KERMIT_TABLE  } from "./CRC16KermitTable";
import { CRC16_MODBUS_TABLE  } from "./CRC16ModBusTable";

import { UPDATING, DIGESTED } from "./Status";

export default class CRC16 {
    /// https://github.com/alexgorbatchev/node-crc
    constructor( type = CRC16_TYPE_DEFAULT ) {
        this._table = null;
        this._initValue = 0;
        
        switch( type ) {
            case CRC16_TYPE_CCITT  : this._table = CRC16_CCITT_TABLE;
                this._initValue = 0xFFFF;
                this.update = this._updateByCCITT;
                break;
                
            case CRC16_TYPE_KERMIT : this._table = CRC16_KERMIT_TABLE;
                break;
                
            case CRC16_TYPE_MODBUS : this._table = CRC16_MODBUS_TABLE;
                this._initValue = 0xFFFF;
                break;
                
            case CRC16_TYPE_XMODEM : this._table = null;
                this.update = this._updateByXModem;
                break;
                
            default: this._table = CRC16_DEFAULT_TABLE;
                break;
        }
        
        this._init();
    }
    
    _init() {
        this._status = UPDATING;
        this._digest = this._initValue;
    }
    
    update( bytes ) {
        if ( this._status == DIGESTED ) {
            this._init();
        }
        
        for ( var i = 0; i < bytes.length; ++i ) {
            this._digest = ((this._table[(this._digest ^ bytes[i]) & 0xFF] ^ (this._digest >> 8)) & 0xFFFF);
        }
        
        return this;
    }
    
    _updateByCCITT( bytes ) {
        if ( this._status == DIGESTED ) {
            this._init();
        }
        
        for ( var i = 0; i < bytes.length; ++i ) {
            this._digest = (this._table[((this._digest >> 8) ^ bytes[i]) & 0xFF] ^ (this._digest << 8)) & 0xFFFF;
        }
        
        return this;
    }
    
    _updateByXModem( bytes ) {
        if ( this._status == DIGESTED ) {
            this._init();
        }
        
        for ( var i = 0; i < bytes.length; ++i ) {
            var code = this._digest >>> 8 & 0xFF;

            code ^= bytes[i] & 0xFF;
            code ^= code >>> 4;
            this._digest = this._digest << 8 & 0xFFFF;
            this._digest ^= code;
            
            code = code << 5 & 0xFFFF;
            this._digest ^= code;
            
            code = code << 7 & 0xFFFF;
            this._digest ^= code;
        }
        
        return this;
    }
    
    digest() {
        if ( this._status == DIGESTED ) {
            this._init();
        }
        
        this._status = DIGESTED;
        return this._digest >>> 0;
    }
}