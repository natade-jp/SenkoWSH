﻿/* global System, SComponent, SCanvas, SFile, SIData, SFileLoadButton */

function testFileLoad(panel) {
	
	panel.clearChildNodes();
	
	// Canvas
	var canvas = new SCanvas();
	canvas.setUnit(SComponent.unittype.PX);
	canvas.setPixelSize(256, 256);
	canvas.setSize(256, 256);
	panel.put(canvas, SComponent.putype.IN);
	
	// ボタン1
	var loadbutton = new SFileLoadButton("読み込み");
	loadbutton.setFileAccept(SFileLoadButton.fileaccept.image);
	canvas.put(loadbutton, SComponent.putype.NEWLINE);
	loadbutton.addListener(function(file) {
		canvas.putImage(file[0],
		function() {
			System.out.println("ロード完了");
		});
	});
	
	var savebutton = new SButton("IMG要素化");
	loadbutton.put(savebutton, SComponent.putype.RIGHT);
	savebutton.addListener(function() {
		imagepanel.putImage(canvas,
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
		var data = new SIDataRGBA(canvas.getImageData());
		var i = 0;
		for(i = 0; i < 100; i++) {
			var x = Math.floor(Math.random() * data.width);
			var y = Math.floor(Math.random() * data.height);
			data.setPixelInside(x, y, new SIColorRGBA([255, 255, 255, 255]));
		}
		canvas.putImageData(data.getImageData());
	});
	
	// ボタン2
	var button2 = new SButton("輝度値 でピクセルに書き込み");
	button1.put(button2, SComponent.putype.RIGHT);
	button2.addListener(function() {
		var data = new SIDataY(canvas.getImageData());
		var i = 0;
		for(i = 0; i < 100; i++) {
			var x = Math.floor(Math.random() * data.width);
			var y = Math.floor(Math.random() * data.height);
			data.setPixelInside(x, y, new SIColorY(255));
		}
		canvas.putImageData(data.getImageData());
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
		var data = new SIDataY();
		data.putImageData(inputcanvas.getImageData());
		data.forEach(function(color, x, y) {
			data.setPixelInside(x, y, color.random());
		});
		inputcanvas.putImageData(data.getImageData());
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
	
	
	var wrapmode = [
		SIData.wrapmode.REPEAT,
		SIData.wrapmode.CLAMP
	];
	var filtermode = [
		SIData.filtermode.NEAREST_NEIGHBOR,
		SIData.filtermode.BILINEAR,
		SIData.filtermode.COSINE,
		SIData.filtermode.HERMITE4_3,
		SIData.filtermode.HERMITE4_5,
		SIData.filtermode.HERMITE16,
		SIData.filtermode.BICUBIC,
		SIData.filtermode.BICUBIC_SOFT,
		SIData.filtermode.BICUBIC_NORMAL,
		SIData.filtermode.BICUBIC_SHARP
	];
	
	var cb_selectertype = new SComboBox(wrapmode);
	inputcanvas.put(cb_selectertype, SComponent.putype.NEWLINE);
	cb_selectertype.setWidth(16);
	
	var cb_interpolationtype = new SComboBox(filtermode);
	cb_selectertype.put(cb_interpolationtype, SComponent.putype.NEWLINE);
	cb_interpolationtype.setWidth(16);
	
	// Button
	var button = new SButton("拡大");
	cb_interpolationtype.put(button, SComponent.putype.NEWLINE);
	button.addListener(function() {
		var srcdata = new SIDataY(inputcanvas.getImageData());
		srcdata.setWrapMode(cb_selectertype.getSelectedItem());
		srcdata.setFilterMode(cb_interpolationtype.getSelectedItem());
		var dstdata = new SIDataY(dstWidth, dstHeight);
		dstdata.drawSIData(srcdata, 0, 0, dstWidth, dstHeight);
		outputcanvas.putImageData(dstdata.getImageData());
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
	canvas_src1.putImage("../resource/image_x.png");
	canvas_src2.setPixelSize(canvasWidth, canvasHeight);
	canvas_src2.setUnit(SComponent.unittype.PX);
	canvas_src2.setSize(canvasWidth, canvasHeight);
	canvas_src2.putImage("../resource/image_y.png");
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
		SIData.brendtype.NONE,
		SIData.brendtype.ALPHA,
		SIData.brendtype.ADD,
		SIData.brendtype.SUB,
		SIData.brendtype.REVSUB,
		SIData.brendtype.MUL
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
		var src1 = new SIDataRGBA(canvas_src1.getImageData());
		var src2 = new SIDataRGBA(canvas_src2.getImageData());
		src1.setBlendType(cb_brendtype.getSelectedItem());
		src1.globalAlpha = parseFloat(cb_globalalpha.getSelectedItem());
		src1.drawSIData(src2, 0, 0);
		canvas_dst.putImageData(src1.getImageData());
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
		"../resource/image_parrots.png",
		"../resource/image_mandrill.png",
		"../resource/image_girl.png",
		"../resource/image_lenna.png",
		"../resource/image_wg.png"
	];
	var cb_picturetype = new SComboBox(picturetype);
	cb_picturetype.setWidth(32);
	label1.put(cb_picturetype, SComponent.putype.RIGHT);
	cb_picturetype.addListener(function () {
		canvas_src.putImage(cb_picturetype.getSelectedItem());
	});
	canvas_src.putImage(picturetype[0]);
	
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
		"ガウシアンフィルタ",
		"バイラテラルフィルタ",
		"レンズフィルタ",
		"アンシャープ",
		"単純減色",
		"組織的ディザ法による減色",
		"誤差拡散法による減色"
	];
	var cb_filtertype = new SComboBox(filtertype);
	cb_filtertype.setWidth(32);
	label3.put(cb_filtertype, SComponent.putype.RIGHT);
	
	//-------------------------
	
	var button = new SButton("実行");
	cb_filtertype.put(button, SComponent.putype.RIGHT);
	button.addListener(function() {
		var src = new SIDataRGBA(canvas_src.getImageData());
		var m;
		if(cb_filtertype.getSelectedItem() === filtertype[0]) {
			src.setWrapMode(SIData.wrapmode.CLAMP);
			src.filterBlur(7);
			canvas_dst.putImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[1]) {
			src.setWrapMode(SIData.wrapmode.CLAMP);
			src.filterSharp(0.5);
			canvas_dst.putImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[2]) {
			src.grayscale();
			canvas_dst.putImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[3]) {
			src.grayscale();
			var height = new SIDataY(src);
			height.setWrapMode(SIData.wrapmode.REPEAT);
			height.filterGaussian(5);
			canvas_dst.putImageData(height.getNormalMap().getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[4]) {
			src.setWrapMode(SIData.wrapmode.CLAMP);
			src.filterGaussian(7);
			canvas_dst.putImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[5]) {
			src.setWrapMode(SIData.wrapmode.CLAMP);
			src.filterBilateral(5, 0.8);
			canvas_dst.putImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[6]) {
			src.setWrapMode(SIData.wrapmode.CLAMP);
			src.filterSoftLens(5, 1.2);
			canvas_dst.putImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[7]) {
			src.setWrapMode(SIData.wrapmode.CLAMP);
			src.filterUnSharp(7, 1);
			canvas_dst.putImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[8]) {
			src.filterQuantizationSimple(64);
			canvas_dst.putImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[9]) {
			src.filterQuantizationOrdered(64);
			canvas_dst.putImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[10]) {
			src.filterQuantizationDiffusion(64);
			canvas_dst.putImageData(src.getImageData());
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

