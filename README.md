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