# SenkoWSH

[![ESDoc coverage badge](https://natade-jp.github.io/SenkoWSH/badge.svg)](https://natade-jp.github.io/SenkoWSH/)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)

## 概要

以下の3つを目的としたライブラリです。

- Windows 上で動作する WSH JScript 用汎用ライブラリ
- Visual Studio Code で JScript での開発を目的とする
- ES3相当の機能しかなかった JScript を強化

本ライブラリを用いることで、`JScript` によるバッチ処理で以下のような機能が利用できます。

1. `SFile`クラスを用いてディレクトリ／テキスト／バイナリファイルの操作、圧縮展開
2. `CSV`クラスを用いてCSV形式の利用
3. `System.sleep(1)`で1秒停止、`System.stop()`で処理を停止
4. `Format.textf`で`sprintf` のような文字列のフォーマット変換
5. `StringComparator.DEFAULT` で自然順ソート
6. `String.prototype.trim()` や `JSON` など ES3 になかった機能の追加
7. `Robot`クラスを用いて外部アプリケーションを操作

まずは、`examples`の`Example.wsf`を実行してみれば、雰囲気はつかめるかと思います。
詳しい関数の説明は、[ヘルプファイル](https://natade-jp.github.io/SenkoWSH/)を参照したり、
[ライブラリについて記載したブログの記事](https://blog.natade.net/2020/01/19/wsh-jscript-javascript-windows-bat/)を参照すること。

## 注意

- 動作環境は、Windows 7 以降（一部`PowerShell`を利用しているため）とします。

- 本ライブラリは、`Polyfill`系のコードを含んでいますが、全機能は含んでおりませんので注意してください。
各変数やメソッドは未定義の場合に設定されるようになっているため、自分のコードを使用したい場合は本ライブラリより先に`include`して下さい。
詳細は、`/src/polyfill` 配下のファイルを確認してください。

- `Format`や`CSV`などが既に定義されている場合は、定義の上書きを行いません。
上書きされて使用できない場合は、`SenkoWSH.Format` のように `SenkoWSH` の内部に定義されたオブジェクトをご利用ください。

## フォルダ構成

- `build` - `JScirpt` で動作するようにコンパイルしたライブラリ及び、Visual Studio Code 用の型定義ファイル
- `src` - コンパイル前のソースコードフォルダ
- `docs` - 自動生成したヘルプファイル
- `scripts` - `Node.js` で実行するスクリプトファイル（`package.json`の`scripts`を参照）
- `test` - 本ライブラリのテスト

## 開発環境構築

1. プロジェクトフォルダ全体をダウンロードして、`package.json`があるディレクトリをカレントディレクトリとする
2. [Node.js / npm](https://nodejs.org/ja/) をインストールして`npm install`を実行する。
3. [Visual Studio Code](https://code.visualstudio.com/) をインストール
4. VSCode上で、拡張機能の [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) をインストール
5. `examples`の中身をいじって作りたいマクロを作る。

次のような操作が行えます。

- ビルドは、`npm run build`
- 型定義ファイル(`d.ts`)の作成は、`npm run dts`
- ヘルプファイルの作成は、`npm run doc`
- サンプルファイルの実行は、`npm run start` (`JScript`でサンプルファイルが実行される)

## Author

- [natade-jp](https://github.com/natade-jp/)
