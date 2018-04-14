﻿/* global System, SComponent, SCanvas, SFile, SFileButton, SIData, SFileLoadButton */

var imagedata_readrgba	= new SIDataRGBA(32, 32);
imagedata_readrgba.setWrapMode(SIData.wrapmode.REPEAT);
imagedata_readrgba.setFilterMode(SIData.filtermode.BICUBIC_SOFT);
var imagedata_readgray	= new SIDataY(32, 32);
imagedata_readgray.setWrapMode(SIData.wrapmode.REPEAT);
imagedata_readgray.setFilterMode(SIData.filtermode.BICUBIC_SOFT);
var imagedata_resized	= new SIDataY(32, 32);
imagedata_resized.setWrapMode(SIData.wrapmode.REPEAT);
imagedata_resized.setFilterMode(SIData.filtermode.BICUBIC_SOFT);
var setting_width	= 0;
var setting_height	= 0;
var setting_denoise	= 0;
var setting_boyake	= 0;
var setting_surudosa = 0;
var setting_outotsu = 0;

var fileloadbtn = new SFileLoadButton("読み込む");
var filesavebtn = new SFileSaveButton("保存する");

var img_readsample = new SImagePanel();
img_readsample.setUnit(SComponent.unittype.PX);

var img_normalsample = new SImagePanel();
img_normalsample.setUnit(SComponent.unittype.PX);


var c_denoise = new SSlider(0, 3);
c_denoise.setMinorTickSpacing(1);
c_denoise.setMajorTickSpacing(1);
var c_boyake = new SSlider(0, 3);
c_boyake.setMinorTickSpacing(1);
c_boyake.setMajorTickSpacing(1);
var c_outotsu = new SSlider(-1, 1);
c_outotsu.setMinorTickSpacing(0.001);
c_outotsu.setValue(0.5);
var c_surudosa = new SSlider(0, 0.5);
c_surudosa.setMinorTickSpacing(0.001);

var filterDenoise = function(imagedata, setting_denoise) {
	if(setting_denoise > 0) {
		var i = 0;
		for(i = 0;i < setting_denoise;i++) {
			imagedata.filterBilateral(
				3,
				1.0
			);
		}
	}
};

var filterBoyake = function(imagedata, setting_boyake) {
	if(setting_boyake > 0) {
		var i = 0;
		for(i = 0;i < setting_boyake;i++) {
			imagedata.filterGaussian(
				3
			);
		}
	}
};

var filterSurudosa = function(imagedata, surudosa) {
	if(surudosa !== 0) {
		imagedata.filterSharp(surudosa);
	}
};

var filterOutotsu = function(imagedata, outotsu) {
	var power = outotsu >= 0 ? Math.pow(outotsu, 1.8) : - Math.pow(-outotsu, 1.8 );
	imagedata.forEach(function(color, x, y) {
		imagedata.setPixelInside(x, y, color.mul(power));
	});
};


var redrawReadSample = function() {
	var src_size = imagedata_readgray.width * imagedata_readgray.height;
	var dst_size = imagedata_readgray.width * imagedata_readgray.height;
	imagedata_resized.setSize(setting_width, setting_height);
	setting_denoise	= parseFloat(c_denoise.getValue());
	setting_boyake	= parseFloat(c_boyake.getValue());

	// 入力画像が小さいのであれば、入力画像にデノイズ処理
	if(src_size < dst_size) {
		var imagedata_denoised = new SIDataY(imagedata_readgray);
		imagedata_denoised.setWrapMode(SIData.wrapmode.REPEAT);
		imagedata_denoised.setFilterMode(SIData.filtermode.BICUBIC_SOFT);
		filterDenoise(imagedata_denoised, setting_denoise);
		filterBoyake(imagedata_denoised, setting_boyake);
		imagedata_resized.drawSIData(imagedata_denoised, 0, 0, setting_width, setting_height);
	}
	// 出力画像が小さいのであれば、出力画像にデノイズ処理
	else {
		imagedata_resized.drawSIData(imagedata_readgray, 0, 0, setting_width, setting_height);
		filterDenoise(imagedata_resized, setting_denoise);
		filterBoyake(imagedata_resized, setting_boyake);
	}
	
	img_readsample.setSize(setting_width, setting_height);
	img_readsample.putImageData(imagedata_resized.getImageData());
	setTimeout(redrawNormalMap, 10);
};

var redrawNormalMap = function() {
	
	var imagedata_filter = new SIDataY(imagedata_resized);
	imagedata_filter.setWrapMode(SIData.wrapmode.REPEAT);
	imagedata_filter.setFilterMode(SIData.filtermode.BICUBIC_SOFT);
	
	setting_outotsu		= parseFloat(c_outotsu.getValue());
	setting_surudosa	= parseFloat(c_surudosa.getValue());
	filterOutotsu(imagedata_filter, setting_outotsu);
	filterSurudosa(imagedata_filter, setting_surudosa);
	
	img_normalsample.setSize(setting_width, setting_height);
	img_normalsample.putImageData(imagedata_filter.getNormalMap().getImageData());
	
};

	
function makeInputPanel() {
	
	var panel = new SPanel("入力画像");
	panel.putMe("scomponent_input", SComponent.putype.IN);
	
	var sizelist = [8, 16, 32, 64, 128, 256, 512];
	var c_width  = new SComboBox(sizelist);
	c_width.setSelectedItem(512);
	var c_height = new SComboBox(sizelist);
	c_height.setSelectedItem(512);
	
	var redrawReadSampleResized = function() {
		setting_width	= parseFloat(c_width.getSelectedItem());
		setting_height	= parseFloat(c_height.getSelectedItem());
		redrawReadSample();
	};
	c_width.addListener(redrawReadSampleResized);
	c_height.addListener(redrawReadSampleResized);
	c_denoise.addListener(redrawReadSampleResized);
	c_boyake.addListener(redrawReadSampleResized);
	
	var l_width  = new SLabel("よこ[px]");
	l_width.putMe (panel, SComponent.putype.IN);
	c_width.putMe (l_width, SComponent.putype.RIGHT);
	var l_height = new SLabel("たて[px]");
	l_height.putMe(c_width, SComponent.putype.RIGHT);
	c_height.putMe(l_height, SComponent.putype.RIGHT);
	
	var l_denoise = new SLabel("きれいさ");
	l_denoise.putMe(c_height, SComponent.putype.NEWLINE);
	c_denoise.putMe(l_denoise, SComponent.putype.RIGHT);
	var l_boyake = new SLabel("ぼやけ");
	l_boyake.putMe(c_denoise, SComponent.putype.NEWLINE);
	c_boyake.putMe(l_boyake, SComponent.putype.RIGHT);
	
	panel.setUnit(SComponent.unittype.PX);
	panel.setWidth(520);
	l_denoise.setWidth(5);
	l_boyake.setWidth(5);
	
	c_denoise.setUnit(SComponent.unittype.PERCENT);
	c_denoise.setWidth(70);
	c_boyake.setUnit(SComponent.unittype.PERCENT);
	c_boyake.setWidth(70);
	
	// FileLoad
	fileloadbtn.setFileAccept(SFileLoadButton.fileaccept.image);
	fileloadbtn.addListener(function(file) {
		var canvas_read = new SCanvas();
		canvas_read.putImage(
			file[0],
			function() {
				imagedata_readrgba.putImageData(canvas_read.getImageData());
				imagedata_readrgba.grayscale();
				imagedata_readgray.putImageData(imagedata_readrgba);
				var w	= imagedata_readrgba.width;
				var h	= imagedata_readrgba.height;
				w	= Math.round(Math.pow(2, Math.ceil(Math.log(w) / Math.log(2))));
				h	= Math.round(Math.pow(2, Math.ceil(Math.log(h) / Math.log(2))));
				w	= w < 8 ? 8 : w > 512 ? 512 : w;
				h	= h < 8 ? 8 : h > 512 ? 512 : h;
				c_width.setSelectedItem(w);
				c_height.setSelectedItem(h);
				redrawReadSampleResized();
			},
			SCanvas.drawtype.ORIGINAL,
			true
		);
	});
	
	// Canvas
	img_readsample.putMe(c_boyake, SComponent.putype.NEWLINE);
	fileloadbtn.putMe(img_readsample, SComponent.putype.NEWLINE);
	
}

function makeEditPanel() {
	
	var panel = new SPanel("ノーマルマップ調整");
	panel.putMe("scomponent_edit", SComponent.putype.IN);
	
	var redraw= function() {
		redrawNormalMap();
	};
	
	c_outotsu.addListener(redraw);
	
	var l_outotsu = new SLabel("でこぼこ");
	l_outotsu.putMe(panel, SComponent.putype.IN);
	c_outotsu.putMe(l_outotsu, SComponent.putype.RIGHT);
	
	c_surudosa.addListener(redraw);
	
	var l_surudosa = new SLabel("とがり");
	l_surudosa.putMe(c_outotsu, SComponent.putype.NEWLINE);
	c_surudosa.putMe(l_surudosa, SComponent.putype.RIGHT);
	
	panel.setUnit(SComponent.unittype.PX);
	panel.setWidth(520);
	l_outotsu.setWidth(5);
	l_surudosa.setWidth(5);
	
	c_outotsu.setUnit(SComponent.unittype.PERCENT);
	c_outotsu.setWidth(70);
	c_surudosa.setUnit(SComponent.unittype.PERCENT);
	c_surudosa.setWidth(70);
	
	// Canvas
	img_normalsample.putMe(c_surudosa, SComponent.putype.NEWLINE);
	
}




﻿function main(args) {
	
	makeInputPanel();
	makeEditPanel();
	
}

