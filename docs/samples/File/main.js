/* global System, File */

﻿function main(args) {
	var text, binary, filename, file, buff;

	System.out.println("File クラスのサンプル");
	
	System.out.println("setText メソッドでテキストを保存します。");
	text = "1234";
	filename = "test.txt";
	file = new File(filename);
	file.setText(text, "shift-jis");
	
	
	System.out.println("getText メソッドでテキストを読み込みます。");
	buff = file.getText();
	System.out.println(buff);
	
	
	System.out.println("getText メソッドでネット上のデータも読み込めます。");
	file = new File("http://www.yahoo.co.jp/");
	text = file.getText();
	if(text === null) {
		System.out.println("ダウンロードに失敗しました。");
	}
	else {
		file = new File("test.html");
		file.setText(text, "utf-8", "\r\n", true);
	}
	
	
	System.out.println("writeLine メソッドで1行ずつ書き込めます。");
	filename = "test.log";
	file = new File(filename);
	for(var i = 0;i < 100;i++) {
		file.writeLine(i);
	}
	
	
	System.out.println("setByte メソッドでバイナリを保存します。（すごい時間かかります）");
	binary = [];
	for(var i = 0;i < 0x100;i++) {
		binary[i] = i;
	}
	filename = "test.bin";
	file = new File(filename);
	file.setByte(binary);
	
	
	System.out.println("getByte メソッドでバイナリを読み込みます。");
	file = new File(filename);
	buff = file.getByte();
	for(var i = 0;i < buff.length;i++) {
		System.out.print(buff[i] + " ");
	}
	System.out.print("\n");
	
	
	System.out.println("setCSV メソッドでcsvを保存します。");
	text = [
		["\"test\"", "1234"],
		["行A\n行B", 1234]
	];
	filename = "test.csv";
	file = new File(filename);
	file.setCSV(text);
	
	
	System.out.println("getCSV メソッドでcsvを読み込みます。");
	file = new File(filename);
	buff = file.getCSV();
	for(var i = 0;i < buff.length;i++) {
		for(var j = 0;j < buff[i].length;j++) {
			System.out.println(i + "," + j + " -> " + buff[i][j]);
		}
	}
	
	//カレントディレクトリを移動
	System.setCurrentDirectory("..");
	
	
	System.out.println("File.searchFile で名前が一致しているファイルを選択します。");
	filename = "String.js";
	file = File.searchFile(filename);
	if(file === null) {
		System.out.println("ファイルが見つかりませんでした。");
		System.stop();
	}
	else {
		System.out.println(file.getAbsolutePath());
	}
	
	
	System.out.println("関数を引数に入れれば、部分一致でも探せます。");
	filename = function(name) {
		return(/.*Str.*/i.test(name));
	};
	file = File.searchFile(filename);
	if(file === null) {
		System.out.println("ファイルが見つかりませんでした。");
		System.stop();
	}
	else {
		System.out.println(file.getAbsolutePath());
	}
	
	System.out.println("exists メソッド");
	System.out.println(file.exists());
	System.out.println("isFile メソッド");
	System.out.println(file.isFile());
	System.out.println("isDirectory メソッド");
	System.out.println(file.isDirectory());
	System.out.println("length メソッド");
	System.out.println(file.length() + "byte");
	System.out.println("getName メソッド");
	System.out.println(file.getName());
	System.out.println("getParent メソッド");
	System.out.println(file.getParent());
	System.out.println("getExtensionName メソッド");
	System.out.println(file.getExtensionName());
	System.out.println("getAbsolutePath メソッド");
	System.out.println(file.getAbsolutePath());
	System.out.println("lastModified メソッド（最終更新日）");
	System.out.println(file.lastModified().toLocaleString());
	
	
	System.out.println("list メソッドで同ディレクトリにあるファイルとフォルダを列挙");
	file = new File(".");
	buff = file.list();
	for(var i = 0;i < buff.length;i++) {
		System.out.println(buff[i]);
	}
	
	
	System.out.println("getAllFiles メソッドで同ディレクトリ以下にあるファイルを列挙");
	buff = file.getAllFiles();
	for(var i = 0;i < buff.length;i++) {
		System.out.println(buff[i]);
	}
	
	
	System.out.println("File.createTempFile で一時ファイルを取得");
	file = File.createTempFile();
	System.out.println(file.getAbsolutePath());
	
	//位置を戻す
	System.initializeCurrentDirectory();

	System.out.println("mkdirs メソッドでフォルダを作成");
	file = new File("test\\test");
	file.mkdirs();
	
	System.out.println("delete_ メソッドで削除");
	System.out.println("copy メソッドでコピー");
	System.out.println("move メソッドで移動");
	
	System.stop();
}
