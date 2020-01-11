
/// <reference path="../build/SenkoWSH.d.ts" />
System.executeOnCScript();
System.initializeCurrentDirectory();

console.log("こんにちは！");
console.log("["+"   test    ".trim()+"]");
console.log([30,1,300].sort());
console.log(["１２３","２０","３"].sort(StringComparator.DEFAULT));
console.log(["１２３","２０","３"].sort(StringComparator.NATURAL));
console.log(Format.datef("YYYY/MM/DD hh:mm:ss", new Date("2000/1/2 2:3:4")));

// メモ帳のハンドルを取得する
// console.log(Robot.getHandleOfClassName("Notepad"));
// console.log(Robot.getHandleOfWindowName("無題 - メモ帳"));
// System.beep(440, 1);

console.log("自動的に終了します。");
System.sleep(60.0);
