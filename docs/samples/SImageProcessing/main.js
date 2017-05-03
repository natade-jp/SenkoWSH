/* global System, SComponent, SCanvas, SFile, SFileButton */

function testFileLoad(panel) {
	
	panel.clearChildNodes();
	
	// Canvas
	var canvas = new SCanvas();
	canvas.setPixelSize(256, 256);
	canvas.setUnit(SComponent.unittype.PX);
	canvas.setSize(256, 256);
	panel.put(canvas, SComponent.putype.IN);
	
	// ボタン1
	var loadbutton = new SFileButton("読み込み");
	loadbutton.setFileAccept(SFileButton.fileaccept.image);
	canvas.put(loadbutton, SComponent.putype.NEWLINE);
	loadbutton.addListener(function(file) {
		canvas.drawImage(file[0], true, SCanvas.drawtype.LETTER_BOX,
		function() {
			System.out.println("ロード完了");
		});
	});
	
};

function test2(panel) {
	
	panel.clearChildNodes();
	
};


﻿function main(args) {
	
	System.out.println("SImageProcessing クラスのサンプル");
	
	// パネルを作って、指定した ID の要素内に入れる。
	var mainpanel = new SPanel();
	mainpanel.putMe("scomponent", SComponent.putype.IN);
	
	var label = new SLabel("SImageProcessing のテストです");
	mainpanel.put(label, SComponent.putype.IN);
	
	var combobox = new SComboBox(["画像ファイルの読み込み", "test2"]);
	combobox.setWidth(20);
	label.put(combobox, SComponent.putype.NEWLINE);
	
	combobox.addListener(function () {
		var item = combobox.getSelectedItem();
		if(item === "画像ファイルの読み込み") {
			testFileLoad(testpanel);
		}
		else if(item === "test2") {
			test2(testpanel);
		}
	});
	
	var testpanel = new SPanel();
	mainpanel.put(testpanel, SComponent.putype.NEWLINE);
	
	testFileLoad(testpanel);
}
