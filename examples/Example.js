
/// <reference path="../build/SenkoWSH.d.ts" />
System.executeOnCScript();
System.initializeCurrentDirectory();

// 練習用のスクリプトです。
// コメントアウトを外したりして、色々試してみてください。

console.log("こんにちは！");
console.log("["+"   test    ".trim()+"]");
console.log([30,1,300].sort());
console.log(["１２３","２０","３"].sort(StringComparator.DEFAULT));
console.log(["１２３","２０","３"].sort(StringComparator.NATURAL));
console.log(Format.datef("YYYY/MM/DD hh:mm:ss", new Date("2000/1/2 2:3:4")));
console.log("クリップボード:[" + System.getClipBoardText() + "]");
var m = Robot.getCursorPosition();
console.log("マウスカーソル:" + m.x + ", " + m.y);

/*
console.log(Dialog.popupOpenFile({
	title : "ファイルを選択してください"
}));
console.log(Dialog.popupOpenDirectory({
	title : "フォルダを選択してください"
}));
console.log(Dialog.popupSaveAs({
	title : "ファイルを指定して下さい。"
}));
*/

// 5秒後にクリックする
System.sleep(5.0);
console.log("click start");
Robot.setMouseEvent("click");
console.log("click stop");

// 5秒後にエンターを3回押す
System.sleep(5.0);
console.log("enter start");
Robot.setKeyEvent(Robot.getVK().VK_RETURN, { count_max : 3});
console.log("enter stop");


/*
// メモ帳のハンドルを取得する
System.run("Notepad");
var handle = Robot.getHandleOfClassName("Notepad");
console.log("Handle:" + handle);
console.log("PID:" + Robot.getPID(handle));
console.log("ClassName:" + Robot.getClassName(handle));
console.log("WindowText:" + Robot.getWindowText(handle));
var handle2 = Robot.getHandleOfWindowText(Robot.getWindowText(handle));
console.log("Handle2:" + handle2);
var rect = Robot.getWindowRect(handle);
rect.width += 50;
rect.height += 50;
Robot.setWindowRect(handle, rect);
System.sleep(2.0);
Robot.terminateProcess(Robot.getPID(handle));
*/

// ビープ音を鳴らす
System.beep(440, 0.5);

console.log("自動的に終了します。");
System.sleep(60.0);
