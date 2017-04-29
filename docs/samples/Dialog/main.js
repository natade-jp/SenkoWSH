function main(args) {

	System.out.println("Dialog クラスのサンプル");
	
	var output;
	
	output = Dialog.popup("こんにちは。", "タイトルバー", Dialog.MB_YESNOCANCEL | Dialog.MB_DEFBUTTON3);
	
	switch(output) {
		case Dialog.IDYES:
			Dialog.popup("あっ、はい。");
			break;
		case Dialog.IDNO:
			Dialog.popup("え？いいえ？");
			break;
		case Dialog.IDCANCEL:
			Dialog.popup("「キャンセル」しました。");
			break;
	}
	
	output = Dialog.popup("3秒間時間をはかります。", 3, "タイマー", Dialog.MB_YESNO | Dialog.MB_DEFBUTTON3);
	
	switch(output) {
		case Dialog.IDTIMEOUT:
			Dialog.popup("3秒間たちました。");
			break;
	}
	
	output = Dialog.popup("ブラウザでも対応", Dialog.MB_OKCANCEL);
	
	switch(output) {
		case Dialog.IDOK:
			Dialog.popup("OKを押しましたね。", Dialog.MB_OK);
			break;
		case Dialog.IDCANCEL:
			Dialog.popup("キャンセルを押しましたね。", Dialog.MB_OK);
			break;
	}
	
	System.stop();
}
