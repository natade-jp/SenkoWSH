# History

## SenkoWSH v3.3.0
### 更新点
- SFileの「remove」に読み取り専用でも削除する方法のアルゴリズムを変更
- Dialogに「ファイルを開くダイアログ」を追加
- Dialogに「名前を付けて保存するダイアログ」を追加

## SenkoWSH v3.2.0
### 更新点
- ウィンドウやマウスなどを自動操作するためのクラスRobotを追加

## SenkoWSH v3.1.0
### 更新点
- SFileの「mkdirs」が正しく動作していなかったのを修正
- SFileの「remove」に読み取り専用でも削除できる引数を追加
- SFileに「setBinaryFile」や「remove」の実行が失敗した場合のエラー処理を追加
- SFileに「setReadOnly」「isReadOnly」「setHidden」「each」関数を追加
- Formatに、日付専用のフォーマット関数を追加
- Systemに、クリップボード操作、コマンドを実行、ビープ音、WindowsAPI関数を追加

## SenkoWSH v3.0.1
### 更新点
- Objectへの拡張方法が誤っていたのを修正
- サンプルファイル（ChangeFileName）を追加

## SenkoWSH v3.0.0
### 更新点
- 自己学習用に作っていた使用頻度が低いメソッドを削除
- いくつかのメソッドをArrayとObjectへ拡張させるように変更（例えば、Array.prototype.sort()が安定ソートになります）
- RandomのアルゴリズムをM系列乱数からxorshiftに変更しリファクタリング
- MojiJSから自然順ソートなどを利用できるように機能を追加
- "System.out"内のメソッドを"System"直下に移動

## 2019/10/14 SenkoWSH v2.0.0
### 更新点
- Visual Studio Code で JScript 開発を意識した作りに構成を変更
- JScript 開発で不要なライブラリを除去して軽量化
- 文字列用のライブラリは、[MojiJS](https://github.com/natade-jp/MojiJS) を利用してください
- 数学用のライブラリは、[konpeito](https://github.com/natade-jp/konpeito) を利用してください
- 正しくバージョン管理するように変更

## 2018/5/25 SenkoWSH v1.0.0
### 更新点
- 3DCGや画像処理などJScript外の動作が増えてきたのでこれらを[SenkoJS](https://github.com/natade-jp/SenkoJS)として分離
- 本ライブラリをSenkoLibからSenkoWSHに変更

## 2017/05/25 SenkoLib
### 更新点
- GitHub で管理するように変更
- Webブラウザでも同様に動作させることを目標に変更
- SenkoLib に変更

## 2013/04/29 JScriptバッチ処理用ライブラリ
### 更新点
- 機能アップのため「JScriptバッチ処理用ライブラリ」に名前を変更

## 2013/04/07 バッチ処理のサンプル
### 更新点
- Javaの関数をJScriptで動作させたいという願望元にライブラリを公開