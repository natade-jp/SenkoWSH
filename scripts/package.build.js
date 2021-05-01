const File = require("./File.js");
const MojiJS = require("MojiJS");

// パッケージ情報を取得
const package_info = JSON.parse(File.loadTextFile("./package.json"));

/**
 * @returns {string} 
 */
const getHeader = function() {
	const build_date = new Date();
	const header = [];
	header.push("/*!");
	header.push(" * SenkoWSH.js (version " + package_info["version"] + ", " + build_date.getFullYear() + "/" + (build_date.getMonth() + 1) + "/" + build_date.getDay() + ")");
	header.push(" * https://github.com/natade-jp/SenkoWSH");
	header.push(" * Copyright 2013-" + build_date.getFullYear() + " natade < https://github.com/natade-jp >");
	header.push(" *");
	header.push(" * The MIT license.");
	header.push(" * https://opensource.org/licenses/MIT");
	header.push(" */");
	header.push("");
	const header_string = header.join("\n");
	return header_string;
};

/**
 * @returns {string} 
 */
 const getFooter = function() {
	return "";
 };

// tmpフォルダを削除
if(File.isDirectory("./tmp")) {
	File.deleteDirectory("./tmp");
}

// tmpフォルダを作成
File.makeDirectory("./tmp");

// rollupでtmpに変換ファイルを生成
File.exec("npx rollup -c \"./scripts/rollup.config.js\"");

// ファイルリストを作成
const list = File.createList("./tmp");

// ファイルを結合する
const text_array = [];
for(let i = 0; i < list.length; i++) {
	const text = File.loadTextFile(list[i]);
	text_array.push(text);
}
//text_array.push("System.executeOnCScript();");
//text_array.push("System.initializeCurrentDirectory();");

// 結合したデータ
const output = getHeader() + text_array.join("") + getFooter();

// ファイルを作成する
const output_data = MojiJS.encode(output.replace(/\n/g, "\r\n"), "UTF16-LE");

// 作成
File.saveBinaryFile("./build/SenkoWSH.js", output_data);

// tmpフォルダを削除
File.deleteDirectory("./tmp");
