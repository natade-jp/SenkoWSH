# SenkoWSH
[![ESDoc coverage badge](https://natade-jp.github.io/SenkoWSH/badge.svg)](https://natade-jp.github.io/SenkoWSH/)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)

## 概要
- Windows 上で動作する WSH JScript 用汎用ライブラリ
- Visual Studio Code で JScript での開発を目的とする
- ES3相当の機能しかなかった JScript を強化

本ライブラリを用いることで、`JScript` によるバッチ処理で以下のような機能が利用できます。
動作環境は、Windows 7以上（一部powershellを利用しているため）とします。

1. `SFile`クラスを用いてファイルのテキストの読み書きやファイル操作
2. `CSV`クラスを用いてCSV形式を扱う
3. `System.sleep(1)`で1秒停止や、`System.stop()`で処理を停止
4. `Format.textf`で`sprintf` のような文字列のフォーマット変換
5. `StringComparator.DEFAULT` で自然準ソート
6. `String.prototype.trim()` などES3になかった機能の追加
7. `Robot`クラスを用いて外部アプリケーションを操作する

とりあえず`examples`の`Example.wsf`を実行してみればわかります。
詳しい関数の説明は、[ヘルプファイル](https://natade-jp.github.io/SenkoWSH/)を参照すること

## フォルダ構成
- build - `JScirpt` で動作するようにコンパイルしたライブラリ及び、Visual Studio Code 用の型定義ファイル
- src - コンパイル前のソースコードフォルダ
- docs - 自動生成したヘルプファイル
- scripts - `Node.js` で実行するスクリプトファイル（`package.json`の`scripts`を参照）

## 開発環境構築方法
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
