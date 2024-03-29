//@ts-check
/// <reference path="../build/SenkoWSH.d.ts" />
System.executeOnCScript();
System.initializeCurrentDirectory();

console.log("JSONの読み書きテストです");
System.sleep(3.0);

var data = {
	"data" : {
		"a" : 1,
		"b" : 2,
		"c" : 3
	},
	"array" : [
		1,
		2,
		3
	],
	"text" : "abc"
};

console.log(JSON.stringify(data));
var parse_data = JSON.parse(JSON.stringify(data));
console.log(JSON.stringify(parse_data));

console.log("自動的に終了します。");
System.sleep(60.0);
