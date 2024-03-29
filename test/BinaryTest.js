//@ts-check
/// <reference path="../build/SenkoWSH.d.ts" />
System.executeOnCScript();
System.initializeCurrentDirectory();

console.log("バイナリ操作をするテストです");
System.sleep(3.0);

console.log("32キロバイトのデータの読み書きテスト開始");
var a = [];
var i = 0;
for(i = 0; i < (1024 * 32); i++) {
	a[i] = i & 0xff;
}
(new SFile("./bintest.bin")).writeBinary(a);
var b = (new SFile("./bintest.bin")).readBinary();
var c = false;
for(i = 0; i < (1024 * 32); i++) {
	c = c || ((i & 0xff) !== b[i]);
}
if(c) {
	console.log("NG");
	System.stop();
}
else {
	console.log("OK");
}

console.log("32キロバイトのデータの読み書き速度の測定");

var time = System.currentTimeMillis();

console.log("load");
var d = (new SFile("./bintest.bin")).readBinary();
console.log((System.currentTimeMillis() - time) + "ms");

console.log("save");
time = System.currentTimeMillis();
(new SFile("./bintest.bin")).writeBinary(d);
console.log((System.currentTimeMillis() - time) + "ms");

console.log("処理は終了しました");
System.stop();
