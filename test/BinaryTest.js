
/// <reference path="../build/SenkoWSH.d.ts" />
System.executeOnCScript();
System.initializeCurrentDirectory();

var a = [];
var i = 0;

for(i = 0; i < (1024 * 32); i++) {
	a[i] = i & 0xff;
}

(new SFile("./bintest.bin")).setBinaryFile(a);
var b = (new SFile("./bintest.bin")).getBinaryFile();
var c = false;

for(i = 0; i < (1024 * 32); i++) {
	c = c || ((i & 0xff) !== b[i]);
}

if(c) {
	console.log("NG");
	System.stop();
}

var time = System.currentTimeMillis();

console.log("load");
var d = (new SFile("./bintest.bin")).getBinaryFile();
console.log((System.currentTimeMillis() - time) + "ms");

console.log("save");
time = System.currentTimeMillis();
(new SFile("./bintest.bin")).setBinaryFile(d);
console.log((System.currentTimeMillis() - time) + "ms");

System.stop();
