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
import EventDispatcher from "./events/EventDispatcher";
import Event from "./events/Event";


var event = new Event("click", true, false);
var dispatcher = new EventDispatcher();
var f4 = null;

dispatcher.addEventListener("click", f4 = function( evt ) {
    console.log("4");
});

dispatcher.addEventListener("click", function( evt ) {
    console.log("5");
});

dispatcher.addEventListener("click", function( evt ) {
    console.log("2");
}, false, 1);

dispatcher.addEventListener("click", function( evt ) {
    console.log("3:", "" + evt, "Phase:", evt.eventPhase);
}, false, 1);

dispatcher.addEventListener("click", function( evt ) {
    console.log("1");
}, false, 2);

dispatcher.addEventListener("click", function( evt ) {
    console.log("0");
}, false, 3);

dispatcher.addEventListener("click", { indenty: 10086,
    handleEvent: function( evt ) {
        console.log("6:", this);
    }
});

dispatcher.removeEventListener("click", f4);

///////////////////////////////////////////////////////////////////////////////
var parent = dispatcher.parent = new EventDispatcher();

parent.addEventListener("click", function onclick( evt ) {
    console.log("bubble phase:", event.eventPhase);
});

parent.addEventListener("click", function ongetclick(evt) {
    console.log("capture phase:", event.eventPhase);
}, true);

///////////////////////////////////////////////////////////////////////////////
dispatcher.dispatchEvent(event);