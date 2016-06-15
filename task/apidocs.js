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
var fs   = require("fs");
var path = require("path");
var argv = require("yargs");

function travel( dir ) {
    if ( !fs.statSync(dir).isDirectory() ) {
        throw new Error("travel path must be a directory.");
    }
    
    var result = [];
    var files  = [];
    var directories = [];
    var elements = fs.readdirSync(dir);
    
    for ( var i = 0; i < elements.length; ++i ) {
        var full = path.join(dir, elements[i]);
        var stat = fs.statSync(full);
        
        if ( stat.isDirectory() ) {
            directories.push(full);
        }
        
        if ( stat.isFile() && !filter(full) ) {
            files.push(full);
        }
    }
    
    if ( files.length ) {
        result.push({ package: dir, classes: files });
    }
    
    for ( var i = 0; i < directories.length; ++i ) {
        result = result.concat(travel(directories[i]));
    }
    
    return result;
}

function filter( full ) {
    if ( path.extname(full) != ".js" ) {
        return true;
    }
    
    if ( path.basename(full) == "import.js" || path.basename(full) == "debug.js" ) {
        return true;
    }
    
    return false;
}


function getName( element ) {
    return path.basename(element, path.extname(element));
}

function getId( element ) {
    return path.join(path.dirname(element), getName(element)).toLowerCase();
}

function getPkgName( element ) {
    return element.split(path.sep).slice(1).join("/");
}

function generateAPITable( root, remote ) {
    var result = travel(root);
    var output = [ "| 包／类型 | 说明描述", "|----------|----------"];
    var urls   = [];
    
    for ( var i = 0; i < result.length; ++i ) {
        var item = result[i];
        var name = getPkgName(item.package);
        var id   = getId(item.package);
        var url  = remote + item.package;
        
        output.push("| **:small_red_triangle_down:[{name}][{id}]** | 包说明".replace("{name}", name).replace("{id}", id));
        urls.push("[{id}]: {url}".replace("{id}", id).replace("{url}", url));
        
        for ( var k = 0; k < item.classes.length; ++k ) {
            var file = item.classes[k];
            var name = getName(file);
            var id   = getId(file);
            var url  = remote + file;
            
            output.push("| [{name}][{id}] |".replace("{name}", name).replace("{id}", id));
            urls.push("[{id}]: {url}".replace("{id}", id).replace("{url}", url));
        }
    }
    
    fs.writeFileSync("API.md", output.join("\n") + "\n\n" + urls.join("\n"));
}

generateAPITable("src", "https://github.com/guless/closure/blob/dev/");
