const File = require("./File.js");

// npx jsdoc -c "./scripts/.dts.json" -r "./src/"
try {
	File.exec("npx jsdoc -c \"./scripts/.dts.json\" -r \"./src/\" -d \"./tmp/\"");
}
catch (error) {
	// {typeof XXX} という型で不正エラーが発生するが、
	// d.ts作成が目的のため影響がないと思われる。
}

// 自動生成したdtsファイルを取得
const dts_auto = File.loadTextFile("./tmp/types.d.ts");

// 結合用のdtsファイルを取得
const dts_manual = File.loadTextFile("./src/Typedef.d.ts");

// データを結合
let dts_text = dts_auto + "\n" + dts_manual;

// 不要なデータを削除
{
	// 以下のようなコードが原因不明で入り込む場合があるので削除する
	// declare var default: any;
	dts_text = dts_text.replace(/\ndeclare var default: any;\n/g, "\n");
}

// 保存
File.saveTextFileWithBOM("./build/SenkoWSH.d.ts", dts_text);

// 作成用ディレクトリを削除
File.deleteDirectory("./tmp");
