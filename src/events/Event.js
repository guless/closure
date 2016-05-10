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
import * as EventPhase from "./EventPhase";
import * as EventPropagation from "./EventPropagation";


export default class Event {
    constructor( type, bubbles = false, cancelable = false ) {
        this._type = type;
        this._bubbles = bubbles;
        this._cancelable = cancelable;
        
        this._target = null;
        this._currentTarget = null;
        this._eventPhase = EventPhase.NONE;
        
        this._defaultPrevented = false;
        this._eventPropagation = EventPropagation.ALWAYS;
    }
    
    get type() {
        return this._type;
    }
    
    get bubbles() {
        return this._bubbles;
    }
    
    get cancelable() {
        return this._cancelable;
    }
    
    get eventPhase() {
        return this._eventPhase;
    }
    
    get target() {
        return this._target;
    }
    
    get currentTarget() {
        return this._currentTarget;
    }
    
    get defaultPrevented() {
        return this._defaultPrevented;
    }
    
    get eventPropagation() {
        return this._eventPropagation;
    }
    
    preventDefault() {
        this._defaultPrevented = this._cancelable;
    }
    
    stopPropagation() {
        this._eventPropagation = EventPropagation.STOP_AT_PARENT;
    }
    
    stopImmediatePropagation() {
        this._eventPropagation = EventPropagation.STOP_AT_TARGET;
    }
    
    toString() {
        return `[Event type="${this._type}", bubbles=${this._bubbles}, cancelable=${this._cancelable}]`;
    }
}