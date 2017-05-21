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


function makeInputPanel() {
	
	var panel = new SPanel();
	panel.putMe("scomponent_input", SComponent.putype.IN);
	
	var l_disc = new SLabel("画像ファイルを読み込んでください");
	l_disc.putMe(panel, SComponent.putype.IN);
	
	var sizelist = [8, 16, 32, 64, 128, 256, 512];
	var c_width  = new SComboBox(sizelist);
	c_width.setSelectedItem(512);
	var c_height = new SComboBox(sizelist);
	c_height.setSelectedItem(512);
	
	var redraw = function() {
		setting_width  = parseFloat(c_width.getSelectedItem());
		setting_height = parseFloat(c_height.getSelectedItem());
		imagedata_resized.setSize(setting_width, setting_height);
		imagedata_resized.drawSIData(imagedata_readgray, 0, 0, setting_width, setting_height);
		canvas_readsample.setPixelSize(setting_width, setting_height);
		canvas_readsample.setSize(setting_width, setting_height);
		canvas_readsample.setImageData(imagedata_resized.getImageData());
	};
	
	var edit_size = function() {
		redraw();
	};
	c_width.addListener(edit_size);
	c_height.addListener(edit_size);
	
	
	var l_width  = new SLabel("横幅[px]");
	var l_height = new SLabel("縦幅[px]");
	l_width.putMe (l_disc, SComponent.putype.NEWLINE);
	c_width.putMe (l_width, SComponent.putype.RIGHT);
	l_height.putMe(c_width, SComponent.putype.NEWLINE);
	c_height.putMe(l_height, SComponent.putype.RIGHT);
	
	// FileLoad
	var fileloadbtn = new SFileLoadButton("load");
	fileloadbtn.setFileAccept(SFileLoadButton.fileaccept.image);
	fileloadbtn.putMe(c_height, SComponent.putype.NEWLINE);
	fileloadbtn.addListener(function(file) {
		var canvas_read = new SCanvas();
		canvas_read.setImage(
			file[0],
			function() {
				imagedata_readrgba.putImageData(canvas_read.getImageData());
				imagedata_readrgba.grayscale();
				imagedata_readgray.putImageData(imagedata_readrgba);
				
				redraw();
			},
			SCanvas.drawtype.ORIGINAL,
			true
		);
	});
	
	// Canvas
	var canvas_readsample = new SCanvas();
	canvas_readsample.setUnit(SComponent.unittype.PX);
	canvas_readsample.putMe(fileloadbtn, SComponent.putype.NEWLINE);
	
}

function makeEditPanel() {
	
}




﻿function main(args) {
	
	makeInputPanel();
	
}

