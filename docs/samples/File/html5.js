/* global System, File, SComponent */

﻿function main(args) {
	
	System.out.println("File クラスのサンプル");
	
	var panel = new SPanel();
	panel.putMe("test_space", SComponent.putype.IN);
	var slLabel = new SLabel("テキスト");
	slLabel.putMe(panel, SComponent.putype.IN);
	var slCanvas = new SCanvas();
	slCanvas.putMe(slLabel, SComponent.putype.NEWLINE);
	
	System.out.println("ファイルの情報");
	var file = new File("../resource/sampletext.txt");
	System.out.println(file.getAbsolutePath());
	System.out.println(file.getName());
	System.out.println(file.getParent());
	System.out.println(file.getExtensionName());
	System.out.println("ファイルをロードする");
	file.download(function(file) {
		System.out.println("[" + file.getName() + "] ダウンロード完了");
		System.out.println(file.getText());
	});
	
	var fText = new File("../resource/sampletext.txt");
	var fImage = new File("../resource/sampleimage.png");
	File.downloadFileList([fText, fImage], function() {
		System.out.println("[" + fText.getName() + "] ダウンロード完了");
		System.out.println("[" + fImage.getName() + "] ダウンロード完了");
		System.out.println("テキストと画像を同時に書き換えます！");
		slLabel.setText(fText.getText());
		slCanvas.putImage(fImage.getImage());
	});
	
	System.stop();
}
