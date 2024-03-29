//@ts-check
/// <reference path="../build/SenkoWSH.d.ts" />
System.executeOnCScript();
System.initializeCurrentDirectory();

console.log("バッチ実行のテストです");
System.sleep(3.0);

var src;
var output;

src = "echo ok";
output = System.execBatchScript(src);
console.log(output);

src = "@echo off\necho Shift_JIS で出力します。";
output = System.execBatchScript(src, "Shift_JIS");
console.log(output);

src = "@echo off\necho UTF-8 で出力します。";
output = System.execBatchScript(src, "UTF-8");
console.log(output);

src = "@echo off\n"
src += "set /a A=3*4\n"
src += "echo %A%"
output = System.execBatchScript(src);
console.log(output);

console.log("自動的に終了します。");
System.sleep(60.0);
