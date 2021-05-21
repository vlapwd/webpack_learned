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

### Babel
jsのコンパイラ。主にES5に変換する。ブラウザ差異の吸収するためのもの？  
JSX, TypeScriptの変換にも使われるらしい

必要なもののインストール

`npm install @babel/core @babel/cli @babel/preset-env --save-dev`

設定を書く
```json
//.babelrc
{
  　"presets": ["@babel/preset-env"]
}
{
    //複数設定したときは後ろから実行される(react -> env)
    //presetごとの設定は配列で渡す
  　"presets": [
      ["@babel/preset-env", {<@babel/preset-envの設定値>}],
    　"@babel/preset-react"  
    ]
}

```
ファイルを用意して実行する
```
$ npx babel [変換するjs] --out-file [変換後の出力先]
```


### Loader
webpackはentryからimportを辿ってファイルをまとめていくが、jsとjsonしかまとめられないため、
[Loader](https://webpack.js.org/concepts/#loaders)を使ってまとめる
```js
module.exports = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};
//やあ！webpackコンパイラ、君がimportかrequire文で'.txt'に該当するファイルに遭遇したら、
//バンドる前にraw-loaderを使ってそのファイルを変換してくれないかな。
```

### webpack + babel
balelでjsをコンパイルした後、webpackでバンドルする

`npm install babel-loader --save-dev`

webpack.config.jsに設定を追加
```js
module: {
    rules: [
      { 
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',   //loader名
          options: {                //Babelの設定
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
```

Promiseとかの機能はbabelで変換されないのでpolyfillを別で設定する必要がある  
https://qiita.com/koedamon/items/6cf2201be78c3d79516d#%E8%A8%AD%E5%AE%9A%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%81%AE%E7%B5%B1%E5%90%88%E3%81%A8polyfill%E3%81%AE%E8%A8%AD%E5%AE%9A
https://engineer.recruit-lifestyle.co.jp/techblog/2019-12-08-babel-approach/

> クライアントサイドの JavaScript 開発する場合 Ecma International が策定する ECMAScript と
 WHATWG / W3C が策定する Web API を扱うことになりますが、 
 Babel の Polyfill 対象となるのは JavaScript コア言語と一部の Web API で、大部分の Web API は対象ではありません。
 ```js
 //webpack.config.js
 use: {
  loader: 'babel-loader',
  options: {
    presets: [
      [
        '@babel/preset-env', {
          'useBuiltIns': 'usage' // これだとエラーになるので設定は.babelrcかpackage.jsonに書く必要がある
        }
      ]
    ]
  }
}
```
修正後
```js
//webpack.config.js
use: {
 loader: 'babel-loader',
 options: {
   presets: [
     [
       '@babel/preset-env'// これはこれで必要
     ]
   ]
 }
}
```
```json
// .babelrc
{
    "presets": [
        [
            "@babel/preset-env",
            // こっちで設定を追加する
            {
                "useBuiltIns": "usage"
            }
        ]
    ]
}
```

### React

Reactで書いたアプリをBabelで変換してwebpackでバンドルする

必要なもののインストール

`npm install react react-dom @babel/preset-react --save-dev`

webpack.config.jsに設定を追加する
```js
module: {
    rules: [
      {
        test: /\.js[x]?$/,  // .jsxも対象に含む
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react' //ReactのPresetを追加
            ],
            plugins: ['@babel/plugin-syntax-jsx'] //JSXパース用
          }
        }
      }
    ]
  },
  // https://webpack.js.org/configuration/resolve/
  resolve: {
    extensions: ['.js', '.jsx', '.json']  // .jsxも省略可能対象にする
  }
  ```
  pluginのコレクションがpresetで、  
  最初から有効になっていないオプションのプラグインを利用する場合に指定する必要がある

  https://babeljs.io/docs/en/babel-preset-react#options


### Sass
Sassをバンドルしたい

必要なもののインストール
` npm install sass style-loader css-loader sass-loader node-sass --save-dev`
- style-loader: CSSを<style>タグでHTMLに埋め込む
- css-loader: CSSファイルをJS用モジュールに変換する
- sass-loader: SassファイルをCSSに変換する
- node-sass: Sassをコンパイルする

webpack.config.jsに設定を追加する
```js
 module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/, // .sass or .scss or .css
        exclude: /node_modules/,
        use: [
          'style-loader',
          //optionを足す場合は配列にしてまとめる
          {
            loader: 'css-loader',
            options: { url: false }//url()の画像ファイルをバンドルに含めるかどうか
          },
          'sass-loader'
        ]
      }
    ]
  }
```

webpackが辿れるようにするためにentryのjsでimportする
Loaderが`<head>`に埋め込むので、importして辿れるようにするだけでよい
```js
//index.js
import 'file.scss';
```

