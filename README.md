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
//...
}
```