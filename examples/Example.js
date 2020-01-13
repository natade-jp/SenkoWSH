
/// <reference path="../build/SenkoWSH.d.ts" />
System.executeOnCScript();
System.initializeCurrentDirectory();

console.log("こんにちは！");
console.log("["+"   test    ".trim()+"]");
console.log([30,1,300].sort());
console.log(["１２３","２０","３"].sort(StringComparator.DEFAULT));
console.log(["１２３","２０","３"].sort(StringComparator.NATURAL));
console.log(Format.datef("YYYY/MM/DD hh:mm:ss", new Date("2000/1/2 2:3:4")));
console.log("[" + System.getClipBoardText() + "]");

var m = Robot.getCursorPosition();
console.log(m.x + ", " + m.y);


// 10秒後にエンターを押す
// System.sleep(10.0);
// Robot.setKeyEvent(Robot.getVK().VK_RETURN, {time_sec : 1.0});

// メモ帳のハンドルを取得する
//var handle = Robot.getHandleOfClassName("Notepad");
//console.log(handle);
//console.log(Robot.getPID(handle));
//console.log(Robot.getClassName(handle));
//console.log(Robot.getWindowText(handle));

// Robot.setActiveWindow(handle);
// console.log(Robot.terminateProcess(Robot.getPID(handle)));
// var handle = Robot.getHandleOfWindowText("無題 - メモ帳");
// var rect = Robot.getWindowRect(handle);
// rect.width += 10;
// rect.height += 10;
// Robot.setWindowRect(handle, rect);

System.beep(440, 0.5);

//1050664

console.log("自動的に終了します。");
System.sleep(60.0);
