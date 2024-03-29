//@ts-check
/// <reference path="../build/SenkoWSH.d.ts" />
System.executeOnCScript();
System.initializeCurrentDirectory();

console.log("ダイアログ表示をするテストです");
System.sleep(3.0);

Dialog.popupMessage("こんにちは！",
	{
		caption : "たいとるばー",
		type : Dialog.POPUP_OPTION_TYPE.ICON.MB_ICONQUESTION | Dialog.POPUP_OPTION_TYPE.BUTTON.MB_OKCANCEL
	}
);

console.log(Dialog.popupOpenFile({
	title : "ファイルを選択してください"
}));
console.log(Dialog.popupOpenDirectory({
	title : "フォルダを選択してください"
}));
console.log(Dialog.popupSaveAs({
	title : "ファイルを指定して下さい。"
}));

console.log("自動的に終了します。");
System.sleep(60.0);
