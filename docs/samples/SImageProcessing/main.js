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
		canvas.setImage(file[0], true, SCanvas.drawtype.LETTER_BOX,
		function() {
			System.out.println("ロード完了");
		});
	});
	
	var savebutton = new SButton("IMG要素化");
	loadbutton.put(savebutton, SComponent.putype.RIGHT);
	savebutton.addListener(function() {
		imagepanel.setImage(canvas);
	});
	
	// SImagePanel
	var imagepanel = new SImagePanel();
	savebutton.put(imagepanel, SComponent.putype.NEWLINE);
	
};

function test2(panel) {
	
	panel.clearChildNodes();
	
	// Canvas
	var canvas = new SCanvas();
	canvas.setPixelSize(256, 256);
	canvas.setUnit(SComponent.unittype.PX);
	canvas.setSize(256, 256);
	canvas.getContext().fillStyle = "rgb(0, 0, 0)";
	var size = canvas.getSize();
	canvas.getContext().fillRect(0, 0, size.width, size.height);
	
	panel.put(canvas, SComponent.putype.IN);
	
	// ボタン1
	var button1 = new SButton("RGBA");
	canvas.put(button1, SComponent.putype.NEWLINE);
	button1.addListener(function() {
		var data = new SIPDataRGBA();
		data.putImageData(canvas.getImageData());
		var i = 0;
		for(i = 0; i < 100; i++) {
			var x = Math.floor(Math.random() * data.width);
			var y = Math.floor(Math.random() * data.height);
			data.setColor(x, y, new SIPColorRGBA([255, 255, 255, 255]));
		}
		canvas.setImageData(data.getImageData());
	});
	
	// ボタン2
	var button2 = new SButton("Scaler");
	button1.put(button2, SComponent.putype.RIGHT);
	button2.addListener(function() {
		var data = new SIPDataScalar();
		data.putImageData(canvas.getImageData());
		var i = 0;
		for(i = 0; i < 100; i++) {
			var x = Math.floor(Math.random() * data.width);
			var y = Math.floor(Math.random() * data.height);
			data.setColor(x, y, new SIPColorScalar(255));
		}
		canvas.setImageData(data.getImageData());
	});
	
};


﻿function main(args) {
	
	System.out.println("SImageProcessing クラスのサンプル");
	
	// パネルを作って、指定した ID の要素内に入れる。
	var mainpanel = new SPanel();
	mainpanel.putMe("scomponent", SComponent.putype.IN);
	
	var label = new SLabel("SImageProcessing のテストです");
	mainpanel.put(label, SComponent.putype.IN);
	
	var combobox_type = [
		"画像ファイルの読み込み", "データの読み書き"
	];
	var combobox = new SComboBox(combobox_type);
	combobox.setWidth(20);
	label.put(combobox, SComponent.putype.NEWLINE);
	
	combobox.addListener(function () {
		var item = combobox.getSelectedItem();
		if(item === combobox_type[0]) {
			testFileLoad(testpanel);
		}
		else if(item === combobox_type[1]) {
			test2(testpanel);
		}
	});
	
	var testpanel = new SPanel();
	mainpanel.put(testpanel, SComponent.putype.NEWLINE);
	
	combobox.setSelectedItem(combobox_type[1]);
	test2(testpanel);
}

