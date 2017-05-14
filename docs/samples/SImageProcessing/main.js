/* global System, SComponent, SCanvas, SFile, SFileButton, SIPData, SIPMatrix */

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
		canvas.setImage(file[0],
		function() {
			System.out.println("ロード完了");
		});
	});
	
	var savebutton = new SButton("IMG要素化");
	loadbutton.put(savebutton, SComponent.putype.RIGHT);
	savebutton.addListener(function() {
		imagepanel.setImage(canvas,
		function() {
			System.out.println("描写完了");
		});
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
		var data = new SIPDataRGBA(canvas.getImageData());
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
		var data = new SIPDataS(canvas.getImageData());
		var i = 0;
		for(i = 0; i < 100; i++) {
			var x = Math.floor(Math.random() * data.width);
			var y = Math.floor(Math.random() * data.height);
			data.setPixelInside(x, y, new SIPColorS(255));
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
		var data = new SIPDataS();
		data.putImageData(inputcanvas.getImageData());
		data.each(function() {
			return new SIPColorS(Math.random() * 256);
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
		var srcdata = new SIPDataS(inputcanvas.getImageData());
		srcdata.setSelecter(cb_selectertype.getSelectedItem());
		srcdata.setInterPolation(cb_interpolationtype.getSelectedItem());
		var dstdata = new SIPDataS(dstWidth, dstHeight);
		dstdata.drawSIPData(srcdata, 0, 0, dstWidth, dstHeight);
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


function testBlending(panel) {
	
	panel.clearChildNodes();
	
	var canvasWidth  = 128;
	var canvasHeight = 128;
	
	// Canvas
	var canvas_src1	= new SCanvas();
	var canvas_src2	= new SCanvas();
	var canvas_dst	= new SCanvas();
	
	canvas_src1.setPixelSize(canvasWidth, canvasHeight);
	canvas_src1.setUnit(SComponent.unittype.PX);
	canvas_src1.setSize(canvasWidth, canvasHeight);
	canvas_src1.setImage("./img/image_x.png");
	canvas_src2.setPixelSize(canvasWidth, canvasHeight);
	canvas_src2.setUnit(SComponent.unittype.PX);
	canvas_src2.setSize(canvasWidth, canvasHeight);
	canvas_src2.setImage("./img/image_y.png");
	canvas_dst.setPixelSize(canvasWidth, canvasHeight);
	canvas_dst.setUnit(SComponent.unittype.PX);
	canvas_dst.setSize(canvasWidth, canvasHeight);
	
	var label1 = new SLabel("ベース画像");
	panel.put(label1, SComponent.putype.IN);
	label1.put(canvas_src1, SComponent.putype.RIGHT);
	
	var label2 = new SLabel("上書き画像");
	canvas_src1.put(label2, SComponent.putype.NEWLINE);
	label2.put(canvas_src2, SComponent.putype.RIGHT);
	
	var brendtype = [
		SIPData.brendtype.NONE,
		SIPData.brendtype.ALPHA,
		SIPData.brendtype.ADD,
		SIPData.brendtype.SUB,
		SIPData.brendtype.REVSUB,
		SIPData.brendtype.MUL
	];
	var cb_brendtype = new SComboBox(brendtype);
	cb_brendtype.setWidth(8);
	canvas_src2.put(cb_brendtype, SComponent.putype.NEWLINE);
	
	var globalalpha = [
		"1.0",
		"0.8",
		"0.5"
	];
	var cb_globalalpha = new SComboBox(globalalpha);
	cb_globalalpha.setWidth(8);
	cb_brendtype.put(cb_globalalpha, SComponent.putype.RIGHT);
	
	var button = new SButton("blend");
	cb_globalalpha.put(button, SComponent.putype.RIGHT);
	button.addListener(function() {
		var src1 = new SIPDataRGBA(canvas_src1.getImageData());
		var src2 = new SIPDataRGBA(canvas_src2.getImageData());
		src1.setBlendType(cb_brendtype.getSelectedItem());
		src1.globalAlpha = parseFloat(cb_globalalpha.getSelectedItem());
		src1.drawSIPData(src2, 0, 0);
		canvas_dst.setImageData(src1.getImageData());
	});
	
	var label3 = new SLabel("結果画像");
	button.put(label3, SComponent.putype.NEWLINE);
	label3.put(canvas_dst, SComponent.putype.RIGHT);
	
};


function testEtc(panel) {
	
	panel.clearChildNodes();
	
	var canvasWidth  = 320;
	var canvasHeight = 240;
	
	// Canvas
	var canvas_src	= new SCanvas();
	var canvas_dst	= new SCanvas();
	
	canvas_src.setPixelSize(canvasWidth, canvasHeight);
	canvas_src.setUnit(SComponent.unittype.PX);
	canvas_src.setSize(canvasWidth, canvasHeight);
	canvas_dst.setPixelSize(canvasWidth, canvasHeight);
	canvas_dst.setUnit(SComponent.unittype.PX);
	canvas_dst.setSize(canvasWidth, canvasHeight);
	
	//-------------------------
	
	var label1 = new SLabel("使用画像");
	panel.put(label1, SComponent.putype.IN);
	var picturetype = [
		"./img/image_test1.jpg",
		"./img/image_test2.png",
		"./img/image_wg.png"
	];
	var cb_picturetype = new SComboBox(picturetype);
	cb_picturetype.setWidth(32);
	label1.put(cb_picturetype, SComponent.putype.RIGHT);
	cb_picturetype.addListener(function () {
		canvas_src.setImage(cb_picturetype.getSelectedItem());
	});
	canvas_src.setImage(picturetype[0]);
	
	//-------------------------
	
	var label2 = new SLabel("入力画像");
	cb_picturetype.put(label2, SComponent.putype.NEWLINE);
	label2.put(canvas_src, SComponent.putype.RIGHT);
	
	//-------------------------
	
	var label3 = new SLabel("処理の種類");
	canvas_src.put(label3, SComponent.putype.NEWLINE);
	var filtertype = [
		"ソフト",
		"シャープ",
		"グレースケール",
		"ノーマルマップ",
		"ガウシアンフィルタ"
	];
	var cb_filtertype = new SComboBox(filtertype);
	cb_filtertype.setWidth(32);
	label3.put(cb_filtertype, SComponent.putype.RIGHT);
	
	//-------------------------
	
	var button = new SButton("実行");
	cb_filtertype.put(button, SComponent.putype.RIGHT);
	button.addListener(function() {
		var src = new SIPDataRGBA(canvas_src.getImageData());
		var m;
		if(cb_filtertype.getSelectedItem() === filtertype[0]) {
			src.setSelecter(SIPData.selectertype.FILL);
			m = SIPMatrix.makeBlur(7, 1);
			src.convolution(m);
			m = SIPMatrix.makeBlur(1, 7);
			src.convolution(m);
			canvas_dst.setImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[1]) {
			src.setSelecter(SIPData.selectertype.FILL);
			m = SIPMatrix.makeSharpenFilter(0.5);
			src.convolution(m);
			canvas_dst.setImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[2]) {
			src.grayscale();
			canvas_dst.setImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[3]) {
			src.grayscale();
			var height = new SIPDataS(src);
			m = SIPMatrix.makeGaussianFilter(5, 5);
			height.setSelecter(SIPData.selectertype.REPEAT);
			height.convolution(m);
			canvas_dst.setImageData(height.getNormalMap().getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[4]) {
			src.setSelecter(SIPData.selectertype.FILL);
			m = SIPMatrix.makeGaussianFilter(5, 5);
			src.convolution(m);
			canvas_dst.setImageData(src.getImageData());
		}
	});
	
	//-------------------------
	
	var label3 = new SLabel("結果画像");
	button.put(label3, SComponent.putype.NEWLINE);
	label3.put(canvas_dst, SComponent.putype.RIGHT);
	
};


﻿function main(args) {
	
	System.out.println("SImageProcessing クラスのサンプル");
	
	// パネルを作って、指定した ID の要素内に入れる。
	var mainpanel = new SPanel();
	mainpanel.putMe("scomponent", SComponent.putype.IN);
	
	var label = new SLabel("SImageProcessing のテストです");
	mainpanel.put(label, SComponent.putype.IN);
	
	var combobox_type = [
		"画像ファイルの読み込み",
		"データの読み書き",
		"画像補間",
		"ブレンド",
		"そのほかいろいろ"
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
		else if(item === combobox_type[3]) {
			testBlending(testpanel);
		}
		else if(item === combobox_type[4]) {
			testEtc(testpanel);
		}
	});
	
	var testpanel = new SPanel();
	mainpanel.put(testpanel, SComponent.putype.NEWLINE);
	
	combobox.setSelectedItem(combobox_type[4]);
	testEtc(testpanel);
}

