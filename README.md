[![Build Status](https://travis-ci.org/guless/closure.svg?branch=dev)](https://travis-ci.org/guless/closure) [![Coverage Status](https://coveralls.io/repos/github/guless/closure/badge.svg?branch=dev)](https://coveralls.io/github/guless/closure?branch=dev) [![Dependency Status](https://www.versioneye.com/user/projects/577df14391aab50027c6ca56/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/577df14391aab50027c6ca56)


## 概览 ##
> closure 是一个基于 ES6 语法实现的通用的底层 Javascript 库。该库主要为其它项目提供底层的类型、函数、接口支持。
> 提供统一的使用方式，并最大程度的减少由于代码依赖导致的冗余问题。

**相关资源**：
- [使用指南](http://docs.guless.com/tutorial/)
- [参考文档](http://docs.guless.com/)
- [问题反馈](https://github.com/guless/closure/issues)

## 下载&安装 ##
```shell
git clone https://github.com/guless/closure.git
cd closure && npm install
```

## 编译&测试 ##
```shell
npm run build #- 用于编译 src/guless.js 至 dist/guless.js。
npm run start #- 用于编译 src/guless.js 并直接在环境(node)下执行编译后的文件。
npm run docs  #- 生成本地 API 参考文档。
npm run test  #- 运行所有的测试用例。
```

## 示例代码 ##
`@file: src/guless.js`
```javascript
/// 下面这段代码简单展示了如何使用类库提供的 MD5 函数计算字符串的哈希值。
/// 通过在命令行输入 `npm start` 并回车以查看代码执行结果。
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
```

`@file: html/require.html`
```html
<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width" />
    <title>How to use bundle's definition in other scripts</title>
</head>
<body>
    <script src="../dist/guless.js"></script>
    <script>
        /* 1) 这里使用与(guless)源文件所在位置相同的路径查找依赖项。*/
        /* 2) 这里语句末尾的 `default` 属性是由于 ES6 中 export default 的原因。*/
        var MD5   = require("./data/crypto/MD5" ).default;
        var utf8  = require("./data/utils/utf8" ).default;
        var hexof = require("./data/utils/hexof").default;
        var ascii = require("./data/utils/ascii").default;
        
        var MD5API = new MD5();
        
        MD5API.reset();
        MD5API.update(ascii("abc"));
        
        console.log("MD5(\"abc\") => \"" + hexof(MD5API.final()) + "\" (html script)"); 
        /// output: "900150983cd24fb0d6963f7d28e17f72"
        
        MD5API.reset();
        MD5API.update(utf8("中国"));

        console.log("MD5(\"中国\") => \"" + hexof(MD5API.final()) + "\" (html script)"); 
        /// output: "c13dceabcb143acd6c9298265d618a9f"
    </script>
</body>
</html>
```
