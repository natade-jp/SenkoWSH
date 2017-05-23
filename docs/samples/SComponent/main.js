/* global System, SComponent, SFile, SFileButton, SFileLoadButton */

﻿function main(args) {
	
	System.out.println("SComponent クラスのサンプル");
	
	System.out.println("HTML での部品用のクラスです。");
	
	var panel;
	// パネルを作って、指定した ID の要素内に入れる。
	panel = new SPanel();
	panel.putMe("component_test", SComponent.putype.IN);
	
	var label1, label2, label3;
	// ラベルを作って、パネルの中に入れる。
	label1 = new SLabel("SComponentPutType.IN");
	panel.put(label1, SComponent.putype.IN);
	
	// obj2 は、 obj1 の右に配置する
	label2 = new SLabel("SComponentPutType.RIGHT");
	label1.put(label2, SComponent.putype.RIGHT);
	
	// obj3 は、 obj2 の下に配置する
	label3 = new SLabel("SComponentPutType.NEWLINE");
	label2.put(label3, SComponent.putype.NEWLINE);
	
	// obj3 のサイズを指定する
	label3.setUnit(SComponent.unittype.EM);
	label3.setSize(30, 2);
	System.out.println("width " + label3.getWidth() + label3.getUnit());
	System.out.println("height " + label3.getHeight() + label3.getUnit());
	
	// obj1 の内容を変更する
	label1.setText("【" + label1.getText() + "】");
	
	var button1 = new SButton("10回押す");
	label3.put(button1, SComponent.putype.NEWLINE);
	var pushed1 = 10;
	// クリックすると内部の関数が呼ばれる
	button1.addListener(function () {
		if(pushed1 > 0) {
			pushed1--;
		}
		progressbar.setValue(pushed1);
		if(pushed1 === 0) {
			fileloadbtn.setVisible(false);
			filesavebtn.setVisible(false);
			combobox.setVisible(false);
			checkbox.setVisible(false);
			label1.setVisible(false);
			label2.setVisible(false);
			label3.setVisible(false);
			canvas.setVisible(false);
			slider.setVisible(false);
			imagepanel.setVisible(false);
		}
		button1.setText("残り " + pushed1);
	});
	
	var progressbar = new SProgressBar(10, 0);
	button1.put(progressbar, SComponent.putype.RIGHT);
	
	var button2 = new SButton("無効化");
	progressbar.put(button2, SComponent.putype.NEWLINE);
	var pushed2 = 0;
	button2.addListener(function () {
		pushed2++;
		button2.setText((pushed2 % 2 === 1) ? "有効化" : "無効化");
		
		// 押すたびに有効化／無効化の変更
		progressbar.setIndeterminate(!progressbar.isIndeterminate());
		button1.setEnabled(!button1.isEnabled());
		fileloadbtn.setEnabled(!fileloadbtn.isEnabled());
		filesavebtn.setEnabled(!filesavebtn.isEnabled());
		combobox.setEnabled(!combobox.isEnabled());
		checkbox.setEnabled(!checkbox.isEnabled());
		label1.setEnabled(!label1.isEnabled());
		label2.setEnabled(!label2.isEnabled());
		label3.setEnabled(!label3.isEnabled());
		canvas.setEnabled(!canvas.isEnabled());
		slider.setEnabled(!slider.isEnabled());
		imagepanel.setEnabled(!imagepanel.isEnabled());
	});
	
	// FileLoad
	var fileloadbtn = new SFileLoadButton("load");
	fileloadbtn.setFileAccept(SFileLoadButton.fileaccept.image);
	button2.put(fileloadbtn, SComponent.putype.NEWLINE);
	fileloadbtn.addListener(function(file) {
		var i = 0;
		for(;i < file.length; i++) {
			System.out.println(file[i].name + " " + file[i].size + "byte");
		}
	});
	
	
	// FileSave
	var filesavebtn = new SFileSaveButton("save");
	fileloadbtn.put(filesavebtn, SComponent.putype.RIGHT);
	
	// Canvas
	var canvas = new SCanvas();
	canvas.setPixelSize(200, 20);
	canvas.setUnit(SComponent.unittype.PX);
	canvas.setSize(200, 20);
	filesavebtn.put(canvas, SComponent.putype.NEWLINE);
	canvas.getContext().fillText("canvas", 0, 20);
	canvas.getContext().strokeText("canvas", 100, 20);
	
	filesavebtn.setURL(canvas.toDataURL());
	
	
	// ComboBox
	// 配列で内部を初期化できる
	var combobox = new SComboBox(["test1", "test2"]);
	canvas.put(combobox, SComponent.putype.NEWLINE);
	combobox.setWidth(12);
	// getText は配列で取得ができる
	var selectitem = combobox.getText();
	System.out.println(selectitem[0]);
	System.out.println(selectitem[1]);
	// 2番目を選択する
	combobox.setSelectedItem("test2");
	combobox.addListener(function () {
		System.out.println("ComboBox " + combobox.getSelectedItem());
	});
	
	// CheckBox
	var checkbox = new SCheckBox("チェックボックス");
	combobox.put(checkbox, SComponent.putype.NEWLINE);
	checkbox.addListener(function () {
		System.out.println("CheckBox " + checkbox.isChecked());
	});
	
	// Slider
	var slider = new SSlider(0, 100);
	combobox.put(slider, SComponent.putype.NEWLINE);
	slider.setMinorTickSpacing(10);
	slider.setMajorTickSpacing(50);
	slider.addListener(function () {
		System.out.println("" + slider.getValue());
	});
	
	var imagepanel = new SImagePanel();
	slider.put(imagepanel, SComponent.putype.NEWLINE);
	imagepanel.putImage("./img/image_test1.jpg");
	
}
