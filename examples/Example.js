//@ts-check
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

// 5秒後にクリックする
System.sleep(5.0);
console.log("click start");
Robot.setMouseEvent("click");
console.log("click stop");

// 5秒後にエンターを3回押す
System.sleep(5.0);
console.log("enter start");
Robot.setKeyEvent(Robot.VK.VK_RETURN, { count_max : 3});
console.log("enter stop");

// ビープ音を鳴らす
System.beep(440, 0.5);

console.log("自動的に終了します。");
System.sleep(60.0);
