/// #!/usr/bin/env ./node_modules/.bin/babel-node
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
import MD5   from "./data/crypto/MD5";
import utf8  from "./data/utils/utf8";
import ascii from "./data/utils/ascii";
import hexof from "./data/utils/hexof";

/// 如果需要在其它的脚本中使用编译后的模块，则可以公开内部的 `require()` 函数给其它的脚本使用。
/// 外部使用使用与该文件所在位置相同的路径查找依赖项，如：
/// <example>
///   /* 这里语句末尾的 `default` 属性是由于 ES6 中 export default 的原因。*/
///   var MD5   = require("./data/crypto/MD5" ).default;
///   var utf8  = require("./data/utils/utf8" ).default;
///   var hexof = require("./data/utils/hexof").default;
///   var ascii = require("./data/utils/ascii").default;
/// </example>
if ( typeof window != "undefined" ) {
    window.require = require;
}

const MD5API = new MD5();
/// 1) =========================================================================
MD5API.reset();
MD5API.update(ascii("abc"));

console.log(`MD5("abc") => "${ hexof(MD5API.final()) }"`); 
/// output: "900150983cd24fb0d6963f7d28e17f72"

/// 2) =========================================================================
MD5API.reset();
MD5API.update(utf8("中国")); // 中文需要编码成 utf-8 格式的字符串。

console.log(`MD5("中国") => "${ hexof(MD5API.final()) }"`);
/// output: "c13dceabcb143acd6c9298265d618a9f"