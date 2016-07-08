## [![Build Status](https://travis-ci.org/guless/closure.svg?branch=dev)](https://travis-ci.org/guless/closure) [![Coverage Status](https://coveralls.io/repos/github/guless/closure/badge.svg?branch=dev)](https://coveralls.io/github/guless/closure?branch=dev) [![Dependency Status](https://www.versioneye.com/user/projects/577df14391aab50027c6ca56/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/577df14391aab50027c6ca56) ##


### 概览 ###
- [API 参考文档](http://docs.guless.com/)

### 下载&安装 ###
```shell
git clone https://github.com/guless/closure.git
cd closure && npm install
```

### 编译&测试 ###
```shell
npm run build #- 用于编译 src/guless.js 至 dist/guless.js。
npm run start #- 用于编译 src/guless.js 并直接在环境(node)下执行编译后的文件。
npm run docs  #- 生成本地 API 参考文档。
npm run test  #- 运行所有的测试用例。
```

### 示例代码 ###
```javascript
/// @file: src/guless.js
/// 下面这段代码简单展示了如何使用类库提供的 MD5 函数计算字符串的哈希值。
/// 通过在命令行输入 `npm start` 并回车以查看代码执行结果。
import MD5   from "./data/crypto/MD5";
import utf8  from "./data/utils/utf8";
import ascii from "./data/utils/ascii";
import hexof from "./data/utils/hexof";

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

