//@ts-check
/// <reference path="../build/SenkoWSH.d.ts" />
System.executeOnCScript();
System.initializeCurrentDirectory();

console.log("メモ帳を開くテストです");
System.sleep(3.0);

console.log("メモ帳を開きます。");
System.run("Notepad");

console.log("各種情報を表示します。");
var handle = Robot.getHandleOfClassName("Notepad");
console.log("Handle:" + handle);
console.log("PID:" + Robot.getPID(handle));
console.log("ClassName:" + Robot.getClassName(handle));
console.log("WindowText:" + Robot.getWindowText(handle));

console.log("2秒後にメモ帳の大きさを変更します。");
System.sleep(2.0);
var handle2 = Robot.getHandleOfWindowText(Robot.getWindowText(handle));
console.log("Handle2:" + handle2);
var rect = Robot.getWindowRect(handle);
rect.width += 50;
rect.height += 50;
Robot.setWindowRect(handle, rect);

console.log("2秒後にメモ帳を終了させます。");
System.sleep(2.0);
Robot.terminateProcess(Robot.getPID(handle));

console.log("自動的に終了します。");
System.sleep(60.0);
