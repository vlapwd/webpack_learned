## webpackがわからない

参考  
https://qiita.com/koedamon/items/3e64612d22f3473f36a4  
webpackはimportから依存を辿りjsファイルを1つにまとめる

最初に必要なもの

`npm install webpack webpack-cli --save-dev`

ファイルを用意して実行する
```js
/**
 * /src/component/test.js
 */ 
function test(){
  console.log('Hello World!!');
}

export { test };


/**
 * /src/index.js
 */
import { test } from './component/test'; //拡張子は省略可能らしい

test();
```
`npx webpack`
```js
/**
 * /dist/main.js
 */
(()=>{"use strict";console.log("Hello World!!")})();
```

### webpack.config.js
設定ファイル
```js
module.exports = {
  entry: './src/index.js',//起点になるファイル。ここからimportを辿る 
  output: {
    path: __dirname + '/dist',//出力先　__dirnameはnodeで用意されている変数
    filename: 'sample.js'// 出力するファイル名
  }
};
```
### mode
- development: 開発モード，デバッグしやすい状態にバンドルする
- production: 本番モード，なるべくファイルサイズを小さくする（初期値）
```js
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',//デバッグ用に元ファイルを参照できるようにする
//...
}
```

### watch
ホットリロードが効くようになる

```
$ webpack [--watch | -w]
```
もしくは
```js
module.exports = {
  watch: true,
  watchOptions: {
    ignored: /node_modules/ //node_modules以下は追跡しない
  },
  /* 略 */
};
```
```js
//memo
//webpack.js line135
const { compiler, watch, watchOptions } = create();
if (watch) {
    compiler.watch(watchOptions, callback);
} else {
    compiler.run((err, stats) => {
//...
```

### 本番用と開発用で設定ファイルを分けたい
```json
//package.json
{
  "scripts": {
    "start": "webpack -w --config webpack.dev.config",
    "build": "webpack --config webpack.pro.config"
  },
//...
}
```
