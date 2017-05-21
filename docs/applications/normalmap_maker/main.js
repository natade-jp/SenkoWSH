/* global System, SComponent, SCanvas, SFile, SFileButton, SIData, SIMatrix, SFileLoadButton */

var read_image = new SCanvas();
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
		var data	= new SIDataRGBA(read_image.getImageData());
		data.setSelecter(SIData.selectertype.REPEAT);
		data.setInterPolation(SIData.interpolationtype.BICUBIC_SOFT);
		var newdata	= new SIDataRGBA(setting_width, setting_height);
		newdata.drawSIData(data, 0, 0, setting_width, setting_height);
		canvas.setPixelSize(setting_width, setting_height);
		canvas.setSize(setting_width, setting_height);
		canvas.setImageData(newdata.getImageData());
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
		read_image.setImage(
			file[0],
			function() {
				redraw();
			},
			SCanvas.drawtype.ORIGINAL,
			true
		);
	});
	
	// Canvas
	var canvas = new SCanvas();
	canvas.setUnit(SComponent.unittype.PX);
	canvas.putMe(fileloadbtn, SComponent.putype.NEWLINE);
	
}


﻿function main(args) {
	
	makeInputPanel();
	
}

