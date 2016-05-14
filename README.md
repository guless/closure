### API 概览 ###
| 包／类型 | 说明描述 
|-----------------------------------------------|-------------
| **:small_red_triangle_down:[core][_core]** | 包说明
| [assign][_assign] |
| [derive][_derive] |
| **:small_red_triangle_down:[data][_data]** | 包说明
| [sizedef][_sizedef] |
| [tobytes][_tobytes] |
| [tochars][_tochars] |
| **:small_red_triangle_down:[data/codec][_data_codec]** | 包说明
| [Base16][_base16] | 
| [Base16LowerTable][_base16lowertable] | 
| [Base16UpperTable][_base16uppertable] |
| [Base32][_base32] |
| [Base32DefaultTable][_base32defaulttable] |
| [Base32ExtendedHexTable][_base32extendedhextable] |
| [Base64][_base64] |
| [Base64DefaultTable][_base64defaulttable] |
| [Base64URLSafeTable][_base64urlsafetable] |
| **:small_red_triangle_down:[events][_events]** | 包说明
| [Event][_event] | 
| [EventDispatcher][_eventdispatcher] | 
| [EventListener][_eventlistener] |
| [EventPhase][_eventphase] | 
| [EventPropagation][_eventpropagation] | 

[_core]: https://github.com/guless/closure/blob/dev/src/core/
[_assign]: https://github.com/guless/closure/blob/dev/src/core/assign.js
[_derive]: https://github.com/guless/closure/blob/dev/src/core/derive.js

[_data]: https://github.com/guless/closure/blob/dev/src/data/
[_sizedef]: https://github.com/guless/closure/blob/dev/src/data/sizedef.js
[_tobytes]: https://github.com/guless/closure/blob/dev/src/data/tobytes.js
[_tochars]: https://github.com/guless/closure/blob/dev/src/data/tochars.js

[_data_codec]: https://github.com/guless/closure/blob/dev/src/data/codec/
[_base16]: https://github.com/guless/closure/blob/dev/src/data/codec/Base16.js
[_base16lowertable]: https://github.com/guless/closure/blob/dev/src/data/codec/Base16LowerTable.js
[_base16uppertable]: https://github.com/guless/closure/blob/dev/src/data/codec/Base16UpperTable.js
[_base32]: https://github.com/guless/closure/blob/dev/src/data/codec/Base32.js
[_base32defaulttable]: https://github.com/guless/closure/blob/dev/src/data/codec/Base32DefaultTable.js
[_base32extendedhextable]: https://github.com/guless/closure/blob/dev/src/data/codec/Base32ExtendedHexTable.js
[_base64]: https://github.com/guless/closure/blob/dev/src/data/codec/Base64.js
[_base64defaulttable]: https://github.com/guless/closure/blob/dev/src/data/codec/Base64DefaultTable.js
[_base64urlsafetable]: https://github.com/guless/closure/blob/dev/src/data/codec/Base64URLSafeTable.js

[_events]: https://github.com/guless/closure/blob/dev/src/events/
[_event]: https://github.com/guless/closure/blob/dev/src/events/Event.js
[_eventdispatcher]: https://github.com/guless/closure/blob/dev/src/events/EventDispatcher.js
[_eventlistener]: https://github.com/guless/closure/blob/dev/src/events/EventListener.js
[_eventphase]: https://github.com/guless/closure/blob/dev/src/events/EventPhase.js
[_eventpropagation]: https://github.com/guless/closure/blob/dev/src/events/EventPropagation.js


### 如何编译？###
>通过在 `src/import.js` 引入你项目需要的模块，然后在命令行输入 `npm run build` 并回车执行编译命令。
编译结果会输出至 `dist/bundle.js` 中，然后你可以执行 `npm run start` 命令运行 `dist/bundle.js`
查看编译结果。
```shell
npm run clean # 用于清空输出目录 `dist/*`。
npm run build # 编译 `src/import.js`。
npm run start # 执行 `dist/bundle.js`。
npm run server # 启动一个简单的静态文件服务器。
```

#### 从 Github 将仓库克隆至本地。####
```shell
git clone https://github.com/guless/closure.git
cd closure

# 如果是使用正在开发中的类型请切换至 dev 分支：
git checkout dev
```

#### 找到 `src/import.js` 文件，并导入项目所需的类型。如：Base64 模块。####
```javascript
/// src/import.js
import Base16 from "./data/codec/Base16";
import Base64 from "./data/codec/Base64";

/// 如果需要在其他的 `script` 中使用模块，则可以这样注册全局的 `require()`。
/// 具体原理请参考：https://github.com/substack/node-browserify
if ( typeof window != "undefined" ) {
    window.require = require;
}

/// 可以直接在下面使用 ES6 的语法写具体的项目代码：
// var base16 = new Base16();
// var result = base16.encode([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
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
    var Base16 = require("./data/codec/Base16").default; // default 是由于 ES6 语法的 `export default`。
    var Base64 = require("./data/codec/Base64").default;
    
    var input = "Man is distinguished, not only by his reason, but by this singular passion from " + 
                "other animals, which is a lust of the mind, that by a perseverance of delight " + 
                "in the continued and indefatigable generation of knowledge, exceeds the short " +
                "vehemence of any carnal pleasure.";
                
    /// 这里需要将 ASCII 转换成 codePoints 数组。
    var bytes = new Uint8Array(input.length);
    
    for ( var i = 0; i < input.length; ++i ) {
        bytes[i] = input.charCodeAt(i);
    }
    
    /// 生成 base64 结果。
    var b64 = new Base64();
    var result = b64.encode(bytes);
    
    /// 显示 base64 结果，因为编码结果也是一个字节数组。
    console.log( String.fromCharCode.apply(String, result) );
</script>
```

完整 DEMO 源码: [beginner.html](https://github.com/guless/closure/tree/dev/html/beginner.html)