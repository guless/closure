### API 概览 ###
请移步： 
- [API 列表](https://github.com/guless/closure/blob/dev/API.md)
- [API 参考文档](http://guless.github.io/closure/docs/)

### 如何编译？###
>通过在 `src/import.js` 引入你项目需要的模块，然后在命令行输入 `npm run build` 并回车执行编译命令。
编译结果会输出至 `dist/bundle.js` 中，然后你可以执行 `npm run start` 命令运行 `dist/bundle.js`
查看编译结果。
```shell
npm run test # 运行所有的测试用例。
npm run clean # 用于清空输出目录 `dist/*`。
npm run build # 编译 `src/import.js`。
npm run start # 执行 `dist/bundle.js`。
npm run server # 启动一个简单的静态文件服务器。
npm run apidocs # 重新生成 API.md。
```

#### 从 Github 将仓库克隆至本地。####
```shell
git clone https://github.com/guless/closure.git
cd closure

# 如果是使用正在开发中的类型请切换至 dev 分支：
git checkout dev
```

#### 找到 `src/import.js` 文件，并导入项目所需的类型。如：MD5 模块。####
```javascript
/// src/import.js
import ascii from "./data/utils/ascii";
import hexof from "./data/utils/hexof";
import MD5   from "./data/crypto/MD5";

/// 如果需要在其他的 `script` 中使用模块，则可以这样注册全局的 `require()`。
/// 具体原理请参考：https://github.com/substack/node-browserify
if ( typeof window != "undefined" ) {
    window.require = require;
}

/// 可以直接在下面使用 ES6 的语法写具体的项目代码：
// var MD5API = new MD5();
// function md5( string ) {
//     MD5API.reset();
//     MD5API.update( ascii(string) );
    
//     return hexof(MD5API.final());
// }
// console.log(md5("abcdefghijklmnopqrstuvwxyz")=="c3fcd3d76192e4007dfb496cca67e13b", md5("abcdefghijklmnopqrstuvwxyz"));
```

#### 运行编译命令 `npm run build`，然后在页面中引用 `dist/bundle.js`。####
```shell
# 首次运行编译命令之前，需要先安装依赖项。
npm install

# 编译命令会将 `src/import.js` 中导入的模块输出至 `dist/bundle.js` 中。
npm run build
```
在页面中引入 `dist/bundle.js`。
```html
<script type="text/javascript" src="../dist/bundle.js"></script>
```

#### 如何在其他的 `script` 标签中使用导出的类型？####
```html
<script type="text/javascript" src="../dist/bundle.js"></script>
<script type="text/javascript">
    /// 这里的路径使用相对于 `src/import.js` 文件的位置。
    var MD5   = require("./data/crypto/MD5" ).default; // default 是由于 ES6 语法的 `export default`。
    var ascii = require("./data/utils/ascii").default;
    var hexof = require("./data/utils/hexof").default;
    
    var MD5API = new MD5();
    
    function md5( string ) {
        MD5API.reset();
        MD5API.update( ascii(string) );
        
        return hexof(MD5API.final());
    }
    
    console.log(md5("abcdefghijklmnopqrstuvwxyz")=="c3fcd3d76192e4007dfb496cca67e13b", md5("abcdefghijklmnopqrstuvwxyz"));
</script>
```

完整 DEMO 源码: [beginner.html](https://github.com/guless/closure/tree/dev/html/beginner.html)