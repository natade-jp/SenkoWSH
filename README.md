# SenkoWSH 2 #

## 概要 ##
- Windows の JScript用汎用ライブラリ
- Visual Studio Code で JScript での開発を目的とするため型定義ファイルを完備

以下のことが行えます
- ファイルのテキストの読み書きやファイル操作
- `sprintf` のような文字列のフォーマット変換
- ArrayList、HashTable

## 使い方 ##
- とりあえず`examples`の`Example.wsf`を実行してみればわかります
- ビルドは、`npm run build`
- 型定義ファイル(`d.ts`)の作成は、`npm run dts`
- サンプルファイルの実行は、`npm run start` (`JScript`でサンプルファイルが実行される)

## フォルダ構成 ##
- build - `JScirpt` で動作するようにコンパイルしたライブラリ及び、Visual Studio Code 用の型定義ファイル
- src - コンパイル前のソースコードフォルダ
- scripts - `Node.js` で実行するスクリプトファイル（`package.json`の`scripts`を参照）

## Author ##
- [natade-jp](https://github.com/natade-jp/)
