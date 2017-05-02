/* global System, SComponent, SCanvas, SFile, SFileButton */

﻿function main(args) {
	var pushed = 10;
	
	System.out.println("SImageProcessing クラスのサンプル");
	
	// パネルを作って、指定した ID の要素内に入れる。
	var mainpanel = new SPanel();
	mainpanel.putMe("scomponent", SComponent.putype.IN);
	
	var label = new SLabel("SImageProcessing のテストです");
	mainpanel.put(label, SComponent.putype.IN);
	
	// Canvas
	var canvas = new SCanvas();
	canvas.setPixelSize(512, 512);
	canvas.setUnit(SComponent.unittype.PX);
	canvas.setSize(512, 512);
	label.put(canvas, SComponent.putype.NEWLINE);
	
	// ボタン1
	var loadbutton = new SFileButton("読み込み");
	loadbutton.setFileAccept(SFileButton.fileaccept.image);
	canvas.put(loadbutton, SComponent.putype.NEWLINE);
	loadbutton.addListener(function(file) {
		var i = 0;
		for(;i < file.length; i++) {
			System.out.println(file[i].name + " " + file[i].size + "byte");
		}
	});
	
	// ボタン2
	var button1 = new SButton("テスト");
	loadbutton.put(button1, SComponent.putype.RIGHT);
	loadbutton.addListener(function () {
		
	});
	
	
}
