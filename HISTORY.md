# History

## SenkoWSH v3.7.0b
### 更新点
- `SFile` にハッシュ値を取得する `getHashCode` を追加

## SenkoWSH v3.6.0
### 更新点
- `konpeito` で利用していた `polyfill` をベースにいくつか互換性用の機能を追加

## SenkoWSH v3.5.0
### 更新点
- 文字列表示用命令に `null`, `undefined` を入力した場合にエラーで落ちないように修正
- `popupOpen` を廃止し、`popupOpenFile`, `popupOpenDirectory` を追加
- `Dialog` 系の戻り値を `SFile` オブジェクトに変更
- `Robot` にウィンドウ名とクラス名を両方してできるメソッドの対応が不十分だったのを修正
- `setKeyEvent` に何回押すかを追加、また押下時間の変数名を変更
- `setMouseEvent` を追加

## SenkoWSH v3.4.1
### 更新点
- `Robot` に `ウィンドウ名`, `クラス名` 両方指定できるメソッドを追加
- `SFile.lastModified` が `VT_DATE値` を返してしまっていたのを修正

## SenkoWSH v3.4.0
### 更新点
- `System` に `exit`, `exec` を追加

## SenkoWSH v3.3.0
### 更新点
- `SFile` の `remove` に読み取り専用でも削除する方法のアルゴリズムを変更
- `Dialog` に `ファイルを開くダイアログ` を追加
- `Dialog` に `名前を付けて保存するダイアログ` を追加

## SenkoWSH v3.2.0
### 更新点
- ウィンドウやマウスなどを自動操作するための `Robot` クラスを追加

## SenkoWSH v3.1.0
### 更新点
- `SFile` の `mkdirs` が正しく動作していなかったのを修正
- `SFile` の `remove` に読み取り専用でも削除できる引数を追加
- `SFile` に `setBinaryFile` や `remove` の実行が失敗した場合のエラー処理を追加
- `SFile` に `setReadOnly`, `isReadOnly`, `setHidden`, `each` 関数を追加
- `Format` に`日付専用のフォーマット関数`を追加
- `System` に`クリップボード操作`、`コマンドを実行`、`ビープ音`、`WindowsAPI関数`を追加

## SenkoWSH v3.0.1
### 更新点
- `Object` への拡張方法が誤っていたのを修正
- サンプルファイル（`ChangeFileName`）を追加

## SenkoWSH v3.0.0
### 更新点
- 自己学習用に作っていた使用頻度が低いメソッドを削除
- いくつかのメソッドを `Array` と `Object` に対して直接拡張させるように変更（例えば、`Array.prototype.sort()` が安定ソートになります）
- `Random` のアルゴリズムを `M系列乱数` から `xorshift` に変更しリファクタリング
- `MojiJS` から自然順ソートなどを利用できるように機能を追加
- `"System.out"` 内のメソッドを `"System"` 直下に移動

## 2019/10/14 SenkoWSH v2.0.0
### 更新点
- `Visual Studio Code` で `JScript` 開発を意識した作りに構成を変更
- `JScript` 開発で不要なライブラリを除去して軽量化
- 文字列用のライブラリは、[MojiJS](https://github.com/natade-jp/MojiJS) を利用してください
- 数学用のライブラリは、[konpeito](https://github.com/natade-jp/konpeito) を利用してください
- 正しくバージョン管理するように変更

## 2018/5/25 SenkoWSH v1.0.0
### 更新点
- 3DCGや画像処理など `JScript` 外の動作が増えてきたので、これらの処理を「[SenkoJS](https://github.com/natade-jp/SenkoJS)」として分離
- 本ライブラリのWSHで利用できるコード部分を「`SenkoLib`」から「`SenkoWSH`」として分離

## 2017/05/25 SenkoLib
### 更新点
- GitHub で管理するように変更
- Webブラウザでも同様に動作させることを目標に変更
- ライブラリ名を「`SenkoLib`」に変更

## 2013/04/29 JScriptバッチ処理用ライブラリ
### 更新点
- 機能アップのため「`JScriptバッチ処理用ライブラリ`」に名前を変更

## 2013/04/07 バッチ処理のサンプル
### 更新点
- `Java` の関数を `JScript` で動作させたいという願望元にライブラリを公開