
/// <reference path="../build/SenkoWSH.d.ts" />
System.executeOnCScript();
System.initializeCurrentDirectory();

console.log("こんにちは！");
console.log("5秒後に自動的に終了します。");
console.log("["+"   test    ".trim()+"]");

console.log([30,1,300].sort());

System.sleep(60.0);
