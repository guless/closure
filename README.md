### 如何编译？###
>通过在 `src/import.js` 引入你项目需要的模块，然后在命令行输入 `npm run build` 并回车执行编译命令。
编译结果会输出至 `dist/bundle.js` 中，然后你可以执行 `npm run start` 命令运行 `dist/bundle.js`
查看编译结果。
```shell
npm run clean # 用于清空输出目录 `dist/*`
npm run build # 编译 `src/import.js`
npm run start # 执行 `dist/bundle.js`
```