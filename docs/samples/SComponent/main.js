/* global System, SComponent, SFile, SFileButton */

﻿function main(args) {
	var pushed = 10;
	
	System.out.println("SComponent クラスのサンプル");
	
	System.out.println("HTML での部品用のクラスです。");
	
	var label1, label2, label3;
	
	// パネルを作って、指定した ID の要素内に入れる。
	label1 = new SLabel("SComponentPutType.IN");
	label1.putMe("id_test_block", SComponent.putype.IN);
	
	// obj2 は、 obj1 の右に配置する
	label2 = new SLabel("SComponentPutType.RIGHT");
	label1.put(label2, SComponent.putype.RIGHT);
	
	// obj3 は、 obj2 の下に配置する
	label3 = new SLabel("SComponentPutType.NEWLINE");
	label2.put(label3, SComponent.putype.NEWLINE);
	
	// obj3 のサイズを指定する
	label3.setUnit(SComponent.unittype.EM);
	label3.setSize(30, 2);
	System.out.println("width " + label3.getWidth() + label3.getUnit());
	System.out.println("height " + label3.getHeight() + label3.getUnit());
	
	// obj1 の内容を変更する
	label1.setText("【" + label1.getText() + "】");
	
	var button1, button2;
	var filebutton1;
	
	button1 = new SButton("button1");
	label3.put(button1, SComponent.putype.NEWLINE);
	button2 = new SButton("button2");
	button1.put(button2, SComponent.putype.RIGHT);
	
	// クリックすると内部の関数が呼ばれる
	button1.addOnClickFunction(function () {
		pushed--;
		System.out.println("pushed !");
		button1.setText("残り " + pushed);
		
		// 押すたびに有効化／無効化の変更
		button2.setEnabled(!button2.isEnabled());
		filebutton1.setEnabled(!filebutton1.isEnabled());
		
		// 何回か押したら非表示にする
		if(pushed === 0) {
			filebutton1.setVisible(false);
		}
	});
	
	// File
	filebutton1 = new SFileButton("file");
	filebutton1.setFileAccept(SFileButton.fileaccept.image);
	button2.put(filebutton1, SComponent.putype.NEWLINE);
	filebutton1.addOnClickFunction(function(file) {
		var i = 0;
		for(;i < file.length; i++) {
			System.out.println(file[i].name + " " + file[i].size + "byte");
		}
	});
	
	// Canvas
	var canvas = new SCanvas();
	canvas.setPixelSize(200, 20);
	canvas.setUnit(SComponent.unittype.PX);
	canvas.setSize(200, 20);
	filebutton1.put(canvas, SComponent.putype.RIGHT);
	canvas.getContext().fillText("canvas", 0, 20);
	canvas.getContext().strokeText("canvas", 100, 20);
	
}
