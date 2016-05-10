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
import Event from "./Event";
import EventListener from "./EventListener";
import * as EventPhase from "./EventPhase";
import * as EventPropagation from "./EventPropagation";

export default class EventDispatcher {
    constructor( target ) {
        this._eventTarget = target || this;
        this._eventListeners = {};
    }
    
    addEventListener( type, listener, useCapture = false, priority = 0 ) {
        if ( !this._eventListeners.hasOwnProperty(type) ) {
            this._eventListeners[type] = [new EventListener(listener, useCapture, priority)];
        }
        
        else {
            this._dropListener(this._eventListeners[type], listener, useCapture);
            this._pushListener(this._eventListeners[type], listener, useCapture, priority);
        }
    }
    
    removeEventListener( type, listener, useCapture = false ) {
        if ( !this._eventListeners.hasOwnProperty(type) ) {
            return;
        }
        
        this._dropListener(this._eventListeners[type], listener, useCapture);
    }
    
    hasEventListener( type ) {
        return ((this._eventListeners.hasOwnProperty(type) && this._eventListeners[type].length >= 1));
    }
    
    willTrigger( type ) {
        var node = this;
        
        do {
            if ( node.hasEventListener(type) ) {
                return true;
            }
            
            if ( !node.parent || node === node.parent ) {
                break;
            }
        }
        
        while ( node = node.parent )
        
        return false;
    }
    
    _pushListener( typeListeners, listener, useCapture = false, priority = 0) {
        if ( ! (typeListeners.length >= 1)
            || (priority <= typeListeners[typeListeners.length - 1].priority) ) {
            
            typeListeners.push(new EventListener(listener, useCapture, priority));
            return;
        }
        
        for ( var i = 0; i < typeListeners.length; ++i ) {
            if ( priority > typeListeners[i].priority ) {
                typeListeners.splice(i, 0, new EventListener(listener, useCapture, priority));
                break;
            }
        }
    }
    
    _dropListener( typeListeners, listener, useCapture = false ) {
        for ( var i = 0; i < typeListeners.length; ++i ) {
            if ( typeListeners[i].listener === listener && typeListeners[i].useCapture === useCapture ) {
                typeListeners.splice(i, 1);
                break;
            }
        }
    }
    
    dispatchEvent( event ) {
        if ( event.eventPhase != EventPhase.NONE ) {
            throw new Error("the event has been dispatch before.");
        }
        
        /// 当前对象没有冒泡链或者当前事件不参与冒泡行为。
        if ( !event.bubbles || !this.parent || this === this.parent ) {
            event._target = this._eventTarget;
            event._currentTarget = this._eventTarget;
            event._eventPhase = EventPhase.AT_TARGET;
            
            this._dispatchEvent(event);
            return !event.defaultPrevented;
        }
        
        /// 获取事件传递链。
        var node = this.parent;
        var chain = [];
        
        do {
            chain.push(node);
            
            if ( !node.parent || node === node.parent ) {
                break;
            }
        }
        
        while ( node = node.parent );
        /// 捕获阶段。
        for ( var i = chain.length - 1; i >= 0 && event._eventPropagation == EventPropagation.ALWAYS; --i ) {
            event._target = this._eventTarget;
            event._currentTarget = chain[i]._eventTarget;
            event._eventPhase = EventPhase.CAPTURING_PHASE;
            
            chain[i]._dispatchEvent(event);
        }
        /// 目标阶段
        if ( event._eventPropagation == EventPropagation.ALWAYS ) {
            event._target = this._eventTarget;
            event._currentTarget = this._eventTarget;
            event._eventPhase = EventPhase.AT_TARGET;
            
            this._dispatchEvent(event);
        }
        /// 冒泡阶段。
        if ( event._eventPropagation == EventPropagation.ALWAYS ) {
            for ( var i = 0; i < chain.length && event._eventPropagation == EventPropagation.ALWAYS; ++i ) {
                event._target = this._eventTarget;
                event._currentTarget = chain[i]._eventTarget;
                event._eventPhase = EventPhase.BUBBLING_PHASE;
                
                chain[i]._dispatchEvent(event);
            }
        }
        
        return !event.defaultPrevented;
    }
    
    _dispatchEvent( event ) {
        if ( !this.hasEventListener(event.type) ) {
            return;
        }
        
        var listeners = this._eventListeners[event.type].slice(0);
        var target = null;
        var handler = null;
        
        for ( var i = 0; i < listeners.length && event._eventPropagation != EventPropagation.STOP_AT_TARGET; ++i ) {
            if ( typeof listeners[i].listener.handleEvent == "function" ) {
                target = listeners[i].listener;
                handler = listeners[i].listener.handleEvent;
            }
            
            else {
                target = this._eventTarget;
                handler = listeners[i].listener;
            }
            
            if ( EventPhase.CAPTURING_PHASE == event.eventPhase && listeners[i].useCapture
                || EventPhase.BUBBLING_PHASE == event.eventPhase && !listeners[i].useCapture
                || EventPhase.AT_TARGET == event.eventPhase ) {
                  
                handler.call(target, event);
            }
        }
    }
}