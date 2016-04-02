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
var argv       = require("yargs").boolean("sourceMaps").argv;
var browserify = require("browserify");
var babelify   = require("babelify");
var uglifyify  = require("uglifyify");
var exorcist   = require("exorcist");
var fs         = require("fs");
var path       = require("path");
var util       = require("util");
var Transform  = require("stream").Transform;

/// 版权声明文件。
const __COPYRIGHT__ = fs.readFileSync("./COPYRIGHT.txt");
/// 文件分隔符号。
const __DELIMITER__ = new Buffer("\n");

/// 用于在指定的流前面添加版权声明。
function CopyrightWriter( options ) {
    /// <summary>
    /// CopyrightWriter 类定义用于写入版本声明的双向流对象。</summary>
    /// <param name='options' type='Object'>
    /// 可选，默认值：null，指定流的配置参数。</param>
    if ( !(this instanceof CopyrightWriter) )
        return new CopyrightWriter(options);
        
    /// 调用父类构造函数。
    Transform.call(this, options);
}

/// CopyrightWriter 设置继承。
util.inherits(CopyrightWriter, Transform);

CopyrightWriter.prototype._transform = function transform( chunk, encoding, callback ) {
    /// <summary>
    /// 实现在管道中传输数据块方法。</summary>
    this.push(Buffer.concat([__COPYRIGHT__, __DELIMITER__, chunk]));
    callback();
}

/// 执行 `browserify` 编译过程。
browserify(argv.input, { "debug": argv.sourceMaps })
    /// 如果需要输出 `sourcemap`，在命令行加入参数 `--sourceMaps`。
    .transform(babelify, { 
        "sourceMaps": argv.sourceMaps, 
        "presets"   : [ "es2015" ], 
        "plugins"   : [ "transform-class-properties" ] 
    })
    /// 压缩 JS 文件。
    .transform(uglifyify, { "compress": { "drop_console": false } })
    /// 将所有依赖项合并成一个单独的文件。
    .bundle()
    /// 将 `sourcemap` 从输出流中分离出来。
    .pipe(exorcist(argv.output + ".map"))
    /// 追加版权声明。
    .pipe(new CopyrightWriter())
    /// 写入输出文件流。
    .pipe(fs.createWriteStream(argv.output));