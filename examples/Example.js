
/// <reference path="../build/SenkoWSH.d.ts" />
System.executeOnCScript();
System.initializeCurrentDirectory();

console.log("こんにちは！");
console.log("["+"   test    ".trim()+"]");
console.log([30,1,300].sort());
console.log(["１２３","２０","３"].sort(StringComparator.DEFAULT));
console.log(["１２３","２０","３"].sort(StringComparator.NATURAL));

console.log("自動的に終了します。");
System.sleep(60.0);
