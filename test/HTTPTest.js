//@ts-check
/// <reference path="../build/SenkoWSH.d.ts" />
System.executeOnCScript();
System.initializeCurrentDirectory();

console.log("HTTP を使用するテストです");
System.sleep(3.0);

var url = new SFile("https://github.com/natade-jp");

console.log("テキストとして開きます。");
var text = url.readString();
console.log(text);

console.log("バイナリとして開きます。");
var binary = url.readBinary();

console.log("バイナリとして保存します。");
(new SFile("./download.bin")).writeBinary(binary);

console.log("自動的に終了します。");
System.sleep(60.0);
