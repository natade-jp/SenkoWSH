//@ts-check
/// <reference path="../build/SenkoWSH.d.ts" />
System.executeOnCScript();
System.initializeCurrentDirectory();

console.log("ZIP 圧縮をするテストです");
System.sleep(3.0);

console.log("圧縮します。");
SFile.compress("./ZipTest.js", "./ZipTest.zip");
console.log("圧縮しました。");

System.sleep(2.0);

console.log("展開します。");
SFile.extract("./ZipTest.zip", "./extract");
console.log("展開しました。");

console.log("自動的に終了します。");
System.sleep(60.0);
