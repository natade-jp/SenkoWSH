/* global System, SComponent, SCanvas, SFile, SFileButton, SIData, SIMatrix, SFileLoadButton */

var imagedata_readrgba	= new SIDataRGBA(32, 32);
imagedata_readrgba.setSelecter(SIData.selectertype.REPEAT);
imagedata_readrgba.setInterPolation(SIData.interpolationtype.BICUBIC_SOFT);
var imagedata_readgray	= new SIDataY(32, 32);
imagedata_readgray.setSelecter(SIData.selectertype.REPEAT);
imagedata_readgray.setInterPolation(SIData.interpolationtype.BICUBIC_SOFT);
var imagedata_resized	= new SIDataY(32, 32);
imagedata_resized.setSelecter(SIData.selectertype.REPEAT);
imagedata_resized.setInterPolation(SIData.interpolationtype.BICUBIC_SOFT);
var setting_width = 0;
var setting_height = 0;
var setting_denoise = 0;

var fileloadbtn = new SFileLoadButton("読み込む");
var filesavebtn = new SFileSaveButton("保存する");

var img_readsample = new SImagePanel();
img_readsample.setUnit(SComponent.unittype.PX);

var img_normalsample = new SImagePanel();
img_normalsample.setUnit(SComponent.unittype.PX);


var filterDenoiseBilateral = function(imagedata, setting_denoise) {
	if(setting_denoise > 0) {
		var sizelist	= [0, 3, 3, 5];
		var powerlist	= [0, 0.8, 1.0, 1.0];
		imagedata.filterBilateral(
			sizelist[setting_denoise],
			powerlist[setting_denoise]
		);
	}
	
};

var redrawReadSample = function() {
	var src_size = imagedata_readgray.width * imagedata_readgray.height;
	var dst_size = imagedata_readgray.width * imagedata_readgray.height;
	imagedata_resized.setSize(setting_width, setting_height);
	
	// 入力画像が小さいのであれば、入力画像にデノイズ処理
	if(src_size < dst_size) {
		var imagedata_denoised = new SIDataY(imagedata_readgray);
		imagedata_denoised.setSelecter(SIData.selectertype.REPEAT);
		imagedata_denoised.setInterPolation(SIData.interpolationtype.BICUBIC_SOFT);
		filterDenoiseBilateral(imagedata_denoised, setting_denoise);
		imagedata_resized.drawSIData(imagedata_denoised, 0, 0, setting_width, setting_height);
	}
	// 出力画像が小さいのであれば、出力画像にデノイズ処理
	else {
		imagedata_resized.drawSIData(imagedata_readgray, 0, 0, setting_width, setting_height);
		filterDenoiseBilateral(imagedata_resized, setting_denoise);
	}
	
	img_readsample.setSize(setting_width, setting_height);
	img_readsample.setImageData(imagedata_resized.getImageData());
	setTimeout(redrawNormalMap, 10);
};

var redrawNormalMap = function() {
	
	img_normalsample.setSize(setting_width, setting_height);
	img_normalsample.setImageData(imagedata_resized.getNormalMap().getImageData());
	
	filesavebtn.setURL(img_normalsample.toDataURL());
	filesavebtn.setFileName("undefined.png");
};

	
function makeInputPanel() {
	
	var panel = new SPanel();
	panel.putMe("scomponent_input", SComponent.putype.IN);
	
	var l_disc = new SLabel("入力画像の設定");
	l_disc.putMe(panel, SComponent.putype.IN);
	
	var sizelist = [8, 16, 32, 64, 128, 256, 512];
	var c_width  = new SComboBox(sizelist);
	c_width.setSelectedItem(512);
	var c_height = new SComboBox(sizelist);
	c_height.setSelectedItem(512);
	var denoiselist = [0, 1, 2, 3];
	var c_denoise = new SComboBox(denoiselist);
	c_denoise.setSelectedItem(0);
	
	var redrawReadSampleResized = function() {
		setting_width	= parseFloat(c_width.getSelectedItem());
		setting_height	= parseFloat(c_height.getSelectedItem());
		setting_denoise	= parseFloat(c_denoise.getSelectedItem());
		redrawReadSample();
	};
	c_width.addListener(redrawReadSampleResized);
	c_height.addListener(redrawReadSampleResized);
	c_denoise.addListener(redrawReadSampleResized);
	
	var l_width  = new SLabel("よこ[px]");
	l_width.putMe (l_disc, SComponent.putype.NEWLINE);
	c_width.putMe (l_width, SComponent.putype.RIGHT);
	var l_height = new SLabel("たて[px]");
	l_height.putMe(c_width, SComponent.putype.RIGHT);
	c_height.putMe(l_height, SComponent.putype.RIGHT);
	var l_denoise = new SLabel("きれい");
	l_denoise.putMe(c_height, SComponent.putype.NEWLINE);
	c_denoise.putMe(l_denoise, SComponent.putype.RIGHT);
	
	// FileLoad
	fileloadbtn.setFileAccept(SFileLoadButton.fileaccept.image);
	fileloadbtn.putMe(c_denoise, SComponent.putype.NEWLINE);
	fileloadbtn.addListener(function(file) {
		var canvas_read = new SCanvas();
		canvas_read.setImage(
			file[0],
			function() {
				imagedata_readrgba.putImageData(canvas_read.getImageData());
				imagedata_readrgba.grayscale();
				imagedata_readgray.putImageData(imagedata_readrgba);
				redrawReadSampleResized();
			},
			SCanvas.drawtype.ORIGINAL,
			true
		);
	});
	
	// Canvas
	img_readsample.putMe(fileloadbtn, SComponent.putype.NEWLINE);
	
}

function makeEditPanel() {
	
	var panel = new SPanel();
	panel.putMe("scomponent_edit", SComponent.putype.IN);
	
	var l_disc = new SLabel("ノーマルマップの調整");
	l_disc.putMe(panel, SComponent.putype.IN);
	
	// FileSave
	filesavebtn.putMe(l_disc, SComponent.putype.NEWLINE);
	
	// Canvas
	img_normalsample.putMe(filesavebtn, SComponent.putype.NEWLINE);
	
}




﻿function main(args) {
	
	makeInputPanel();
	makeEditPanel();
	
}

