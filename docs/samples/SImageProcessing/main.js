/* global System, SComponent, SCanvas, SFile, SFileButton, SIPData */

function testFileLoad(panel) {
	
	panel.clearChildNodes();
	
	// Canvas
	var canvas = new SCanvas();
	canvas.setUnit(SComponent.unittype.PX);
	canvas.setPixelSize(256, 256);
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

function testWritePixel(panel) {
	
	panel.clearChildNodes();
	
	// Canvas
	var canvas = new SCanvas();
	canvas.setUnit(SComponent.unittype.PX);
	canvas.setPixelSize(256, 256);
	canvas.setSize(256, 256);
	var size = canvas.getPixelSize();
	canvas.getContext().fillStyle = "rgb(0, 0, 0)";
	canvas.getContext().fillRect(0, 0, size.width, size.height);
	
	panel.put(canvas, SComponent.putype.IN);
	
	// ボタン1
	var button1 = new SButton("RGBA でピクセルに書き込み");
	canvas.put(button1, SComponent.putype.NEWLINE);
	button1.addListener(function() {
		var data = new SIPDataRGBA();
		data.putImageData(canvas.getImageData());
		var i = 0;
		for(i = 0; i < 100; i++) {
			var x = Math.floor(Math.random() * data.width);
			var y = Math.floor(Math.random() * data.height);
			data.setPixelInside(x, y, new SIPColorRGBA([255, 255, 255, 255]));
		}
		canvas.setImageData(data.getImageData());
	});
	
	// ボタン2
	var button2 = new SButton("Scaler でピクセルに書き込み");
	button1.put(button2, SComponent.putype.RIGHT);
	button2.addListener(function() {
		var data = new SIPDataScalar();
		data.putImageData(canvas.getImageData());
		var i = 0;
		for(i = 0; i < 100; i++) {
			var x = Math.floor(Math.random() * data.width);
			var y = Math.floor(Math.random() * data.height);
			data.setPixelInside(x, y, new SIPColorScalar(255));
		}
		canvas.setImageData(data.getImageData());
	});
	
};

function testInterpolation(panel) {
	
	panel.clearChildNodes();
	
	var srcWidth  = 16;
	var srcHeight = 16;
	var dstWidth  = 256;
	var dstHeight = 256;
	
	// Button
	var gene = new SButton("画像作成");
	var genefunc = function() {
		var data = new SIPDataScalar();
		data.putImageData(inputcanvas.getImageData());
		data.each(function() {
			return new SIPColorScalar(Math.random() * 256);
		});
		inputcanvas.setImageData(data.getImageData());
	};
	gene.addListener(genefunc);
	panel.put(gene, SComponent.putype.IN);
	
	// Canvas
	var inputcanvas = new SCanvas();
	var outputcanvas = new SCanvas();
	
	inputcanvas.setPixelSize(srcWidth, srcHeight);
	inputcanvas.setUnit(SComponent.unittype.PX);
	inputcanvas.setSize(srcWidth, srcHeight);
	genefunc();
	gene.put(inputcanvas, SComponent.putype.NEWLINE);
	
	
	var selectertype = [
		SIPData.selectertype.REPEAT,
		SIPData.selectertype.FILL
	];
	var interpolationtype = [
		SIPData.interpolationtype.NEAREST_NEIGHBOR,
		SIPData.interpolationtype.BILINEAR,
		SIPData.interpolationtype.COSINE,
		SIPData.interpolationtype.HERMITE4_3,
		SIPData.interpolationtype.HERMITE4_5,
		SIPData.interpolationtype.HERMITE16,
		SIPData.interpolationtype.BICUBIC,
		SIPData.interpolationtype.BICUBIC_SOFT,
		SIPData.interpolationtype.BICUBIC_NORMAL,
		SIPData.interpolationtype.BICUBIC_SHARP
	];
	
	var cb_selectertype = new SComboBox(selectertype);
	inputcanvas.put(cb_selectertype, SComponent.putype.NEWLINE);
	cb_selectertype.setWidth(16);
	
	var cb_interpolationtype = new SComboBox(interpolationtype);
	cb_selectertype.put(cb_interpolationtype, SComponent.putype.NEWLINE);
	cb_interpolationtype.setWidth(16);
	
	// Button
	var button = new SButton("拡大");
	cb_interpolationtype.put(button, SComponent.putype.NEWLINE);
	button.addListener(function() {
		var srcdata = new SIPDataScalar();
		srcdata.putImageData(inputcanvas.getImageData());
		srcdata.setSelecter(cb_selectertype.getSelectedItem());
		srcdata.setInterPolation(cb_interpolationtype.getSelectedItem());
		var dstdata = new SIPDataScalar();
		dstdata.putImageData(outputcanvas.getImageData());
		var x = 0, y = 0;
		var src_x = 0, src_y = 0;
		var delta_x = srcWidth / dstWidth;
		var delta_y = srcHeight / dstHeight;
		for(y = 0; y < dstHeight; y++) {
			src_x = 0;
			for(x = 0; x < dstWidth; x++) {
				dstdata.setColor(x, y, srcdata.getColor(src_x, src_y));
				src_x += delta_x;
			}
			src_y += delta_y;
		}
		outputcanvas.setImageData(dstdata.getImageData());
	});
	
	outputcanvas.setUnit(SComponent.unittype.PX);
	outputcanvas.setPixelSize(dstWidth, dstHeight);
	outputcanvas.setSize(dstWidth, dstHeight);
	button.put(outputcanvas, SComponent.putype.NEWLINE);
	outputcanvas.getContext().fillStyle = "rgb(0, 0, 0)";
	var size = outputcanvas.getPixelSize();
	outputcanvas.getContext().fillRect(0, 0, size.width, size.height);
	
};
	

﻿function main(args) {
	
	System.out.println("SImageProcessing クラスのサンプル");
	
	// パネルを作って、指定した ID の要素内に入れる。
	var mainpanel = new SPanel();
	mainpanel.putMe("scomponent", SComponent.putype.IN);
	
	var label = new SLabel("SImageProcessing のテストです");
	mainpanel.put(label, SComponent.putype.IN);
	
	var combobox_type = [
		"画像ファイルの読み込み", "データの読み書き", "画像補間"
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
			testWritePixel(testpanel);
		}
		else if(item === combobox_type[2]) {
			testInterpolation(testpanel);
		}
	});
	
	var testpanel = new SPanel();
	mainpanel.put(testpanel, SComponent.putype.NEWLINE);
	
	combobox.setSelectedItem(combobox_type[2]);
	testInterpolation(testpanel);
}

