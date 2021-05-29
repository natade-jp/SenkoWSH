/**
 * The script is part of SenkoWSH.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import Polyfill from "./polyfill/Polyfill.js";
import SFile from "./SFile.js";
import Format from "./Format.js";

/**
 * @type {boolean}
 * @private
 */
const is_wscript = /wscript\.exe$/i.test(WSH.FullName);

/**
 * @type {boolean}
 * @private
 */
const is_cscript = /cscript\.exe$/i.test(WSH.FullName);

/**
 * 文字列へ変換します
 * - 配列やオブジェクトの場合は、中身も展開する
 * 
 * @param {any} data 
 * @private
 */
const toString = function(data) {
	if(data === null) {
		return "[null]";
	}
	else if(data === undefined) {
		return "[undefined]";
	}
	const type = System.typeOf(data);
	if(type === "error") {
		const e = data;
		const error_name	= e.name ? e.name : "Error";
		const error_number	= e.number ? Format.textf("0x%08X", e.number) : "0x00000000";
		const error_message	= e.message ? e.message : "エラーが発生しました。";
		return Format.textf("%s(%s) %s", error_name, error_number, error_message);
	}
	else if(type === "array") {
		return JSON.stringify(data);
	}
	else if(type === "object") {
		if(data.toString && System.isNativeCode(data.toString)) {
			return JSON.stringify(data);
		}
	}
	return data.toString();
};

/**
 * 実行結果
 * @typedef {Object} SystemExecResult
 * @property {string} out
 * @property {string} error
 * @property {number} exit_code
 */

/**
 * システム用のクラス
 * - 文字列の入出力
 * - スリープ、停止
 * - GUIモード、CUIモードの切り替え
 * - バッチファイルへの引数の情報
 * - カレントディレクトリ情報
 */
export default class System {

	/**
	 * 文字列を表示（最終行で自動で改行されない）
	 * @param {any} text
	 */
	static print(text) {
		const output = toString(text);
		if(is_cscript) {
			WSH.StdOut.Write(output);
		}
		else {
			WScript.Echo(output);
		}
	}

	/**
	 * 文字列を表示（最終行で自動で改行される）
	 * @param {any} text
	 */
	static println(text) {
		const output = toString(text);
		if(is_cscript) {
			System.print(output + "\n");
		}
		else {
			System.print(output);
		}
	}

	/**
	 * 指定したフォーマットで整形した文字列を表示
	 * @param {any} text 
	 * @param {...any} parm パラメータは可変引数
	 */
	static printf() {
		const x = [];
		for(let i = 0 ; i < arguments.length ; i++) {
			x[i] = arguments[i];
			if(i === 0) {
				x[i] = toString(x[i]);
			}
		}
		System.println(Format.textf.apply(this, x));
	}

	/**
	 * キーボードのテキスト入力を取得
	 * @returns {string}
	 */
	static readLine() {
		return WScript.StdIn.ReadLine();
	}
	
	/**
	 * UNIX時間をミリ秒で取得
	 * @returns {number}
	 */
	static currentTimeMillis() {
		const date = new Date();
		return date.getTime();
	}

	/**
	 * 処理を一時停止
	 * @param {number} time_sec 停止する秒数
	 */
	static sleep(time_sec) {
		WScript.Sleep((time_sec * 1000) | 0);
	}
	
	/**
	 * 処理を停止
	 */
	static stop() {
		while(true) {
			WScript.Sleep(1000);
		}
	}
	
	/**
	 * ビープ音を鳴らす
	 * @param {number} frequency_hz - 周波数
	 * @param {number} time_sec - 鳴らす秒数
	 */
	static beep(frequency_hz, time_sec) {
		System.callWindowsAPI(
			"kernel32.dll",
			"bool Beep(uint dwFreq, uint dwDuration)",
			"$api::Beep(" + (frequency_hz | 0) + ", " + ((time_sec * 1000) | 0) + ");"
		);
	}

	/**
	 * 指定したコマンドを別プロセスとして非同期／同期実行する
	 * - 第3引数で `true` を指定しないと、非同期コマンドとなります
	 * - 例外発生時の戻り値は `1` となります
	 * 
	 * @param {string} command - コマンド
	 * @param {number} [style=1] - 起動オプション (`System.AppWinStype` 内の値)
	 * @param {boolean} [is_wait=false] - プロセスが終了するまで待つ
	 * @return {number} 通常 `0` で正常終了
	 * 
	 */
	static run(command, style, is_wait) {
		const intWindowStyle = style !== undefined ? style : System.AppWinStype.NormalFocus;
		const bWaitOnReturn = is_wait !== undefined ? is_wait : false;
		const shell = WScript.CreateObject("WScript.Shell");
		var ret = 0;
		try {
			// @ts-ignore
			ret = shell.Run(command, intWindowStyle, bWaitOnReturn);
		}
		catch(e) {
			console.log(e);
			return 1;
		}
		return ret;
	}

	/**
	 * 指定したコマンドを子プロセスとして実行する
	 * - 例外発生時の戻り値は `exit_code = 1` となります
	 * 
	 * @param {string} command 
	 * @returns {SystemExecResult}
	 */
	static exec(command) {
		const shell = WScript.CreateObject("WScript.Shell");
		let exec = null;
		try {
			exec = shell.Exec(command);
		}
		catch(e) {
			console.log(e);
			return {
				exit_code : 1,
				out : e.toString(),
				error : e.toString()
			};
		}
		const stdin = exec.StdIn;
		const stdout = exec.StdOut;
		const stderr = exec.StdErr;
		while(exec.Status === 0) {
			WScript.Sleep(10);
		}
		const exit_code = exec.ExitCode;
		stdin.Close();
		// @ts-ignore
		const out = stdout.ReadAll().replace(/\r?\n$/, "");
		stdout.Close();
		// @ts-ignore
		const error = stderr.ReadAll().replace(/\r?\n$/, "");
		stderr.Close();
		return {
			exit_code : exit_code,
			out : out,
			error : error
		};
	}
	
	/**
	 * 指定した変数が定義されているか調べる
	 * @param {string} variable_name
	 * @returns {boolean}
	 */
	 static isDefined(variable_name) {
		return variable_name in globalThis;
	}
	
	/**
	 * プログラムを終了させます。
	 * @param {number} [exit_code=0] 
	 */
	static exit(exit_code) {
		WScript.Quit(exit_code ? exit_code : 0);
	}
	
	/**
	 * CUIで起動しなおす
	 * @param {boolean} [is_use_chakra] - 高速なChakraエンジンを利用する（wsfが開けなくなる）
	 */
	static executeOnCScript(is_use_chakra) {
		const iis_use_chakra = is_use_chakra !== undefined ? is_use_chakra : false;
		if(is_wscript) {
			// CScript で起動しなおす
			const code = [];
			const args = System.getArguments();
			code.push("\"C:\\Windows\\System32\\cscript.exe\"");
			code.push("//NoLogo");
			if(iis_use_chakra) {
				code.push("//E:{16d51579-a30b-4c8b-a276-0ff4dc41e755}");
			}
			code.push("\"" + WScript.ScriptFullName + "\"");
			for(let i = 0; i < args.length; i++) {
				code.push("\"" + args[i] + "\"");
			}
			System.run(code.join(" "));
			System.exit();
		}
	}
	
	/**
	 * GUIで起動しなおす
	 */
	static executeOnWScript() {
		// cscriptで起動しているか
		if(is_cscript) {
			// WScript で起動しなおす
			const code = [];
			const args = System.getArguments();
			code.push("\"C:\\Windows\\System32\\wscript.exe\"");
			code.push("\"" + WScript.ScriptFullName + "\"");
			for(let i = 0; i < args.length; i++) {
				code.push("\"" + args[i] + "\"");
			}
			System.run(code.join(" "));
			System.exit();
		}
	}
	
	/**
	 * 指定した環境変数の値を取得する
	 * @param {string} env_name 環境変数（%は省略可能）
	 * @returns {string}
	 */
	 static getEnvironmentString(env_name) {
		const shell = new ActiveXObject("WScript.Shell");
		const env_param = "%" + env_name.replace(/%/g, "") + "%";
		const env_value = shell.ExpandEnvironmentStrings(env_param);
		return env_param === env_value ? "" : env_value;
	}

	/**
	 * スクリプトファイルへの引数を取得
	 * @returns {string[]}
	 */
	static getArguments() {
		const args = [];
		for(let i = 0; i < WScript.Arguments.length; i++) {
			args[i] = WScript.Arguments(i);
		}
		return args;
	}

	/**
	 * カレントディレクトリを設定
	 * @param {string} filename
	 */
	static setCurrentDirectory(filename) {
		const shell = new ActiveXObject("WScript.Shell");
		shell.CurrentDirectory = filename.toString();
	}
	
	/**
	 * カレントディレクトリを取得
	 * @returns {string}
	 */
	static getCurrentDirectory() {
		const shell = new ActiveXObject("WScript.Shell");
		return shell.CurrentDirectory;
	}

	/**
	 * 実行中のスクリプトがあるカレントディレクトリを取得
	 * @returns {string}
	 */
	static getScriptDirectory() {
		const x = WSH.ScriptFullName.match(/.*\\/)[0];
		return(x.substring(0 ,x.length - 1));
	}
	
	/**
	 * 実行中のスクリプトがあるディレクトリをカレントディレクトリに設定
	 */
	static initializeCurrentDirectory() {
		const shell = WScript.CreateObject("WScript.Shell");
		shell.CurrentDirectory = System.getScriptDirectory();
	}

	/**
	 * BatchScript を実行する
	 * - 実行結果の最終行が空白の場合は除去されます
	 * - 実行時にスクリプトの最後が改行で終わっていない場合は自動で改行を付けます
	 * - `Unicode`, `UTF-16LE` は未対応となります
	 * 
	 * @param {string} source
	 * @param {string} [charset="shift_jis"] - 文字コード (`shift_jis`, `utf-8` など)
	 * @returns {string|null} 実行結果
	 */
	static execBatchScript(source, charset) {
		const icharset = charset !== undefined ? charset.toLowerCase().trim() : "shift_jis";
		const is_ansi = /^(shift_jis|sjis|ascii|ansi)$/.test(icharset);
		const is_utf8 = /^utf-8$/.test(icharset);

		/**
		 * @types {number}
		 */
		let chcp = 0;
		if(is_ansi) {
			chcp = 932;
		}
		else if(is_utf8) {
			chcp = 65001;
		}
		else {
			console.log("error : charset " + charset);
			return null;
		}

		// 実行時にスクリプトの最後が改行で終わっていない場合は自動で改行を付ける
		const soure_text = /\r\n?$/.test(source) ? source : source + "\n";

		const temp_folder = SFile.createTempFile();
		temp_folder.mkdirs();

		// UTF-8 や Shift_JIS は直接実行できないので chcp 用のスクリプトを挟ませる
		const temp_starter = new SFile(temp_folder.getAbsolutePath() + "//" + "start.bat");
		const temp_script  = new SFile(temp_folder.getAbsolutePath() + "//" + "script.bat");
		const output_txt  = new SFile(temp_folder.getAbsolutePath() + "//" + "output.txt");

		/**
		 * chcp 変更用のスクリプト
		 * @type {string[]}
		 */
		const starter_scrpt = [];
		starter_scrpt.push("chcp " + chcp);
		starter_scrpt.push("@echo off");
		starter_scrpt.push("call \"" + temp_script + "\" > \"" + output_txt + "\"");
		starter_scrpt.push("");
		
		// 途中から文字コードが変わることを想定するため BOM を付けない
		temp_starter.writeString(starter_scrpt.join("\n"), icharset, "\r\n", false);
		// コードポイント変更後のため BOM を付ける
		temp_script.writeString(soure_text, icharset, "\r\n", true);

		// UTF-16LE かどうかで実行時のコマンドが変わる
		const cmd_base = "cmd /q /d /c";
		const command = cmd_base + " \"" + temp_starter + "\"";

		// 実行
		const ret = System.run(command, System.AppWinStype.Hide, true);
		if(ret) {
			console.log("System.run " + command);
			temp_folder.remove();
			return null;
		}

		const return_txt = output_txt.readString(icharset);
		temp_folder.remove();
		return return_txt.replace(/\r?\n$/, "");
	}

	/**
	 * PowerShell を実行する
	 * - 実行結果の最終行が空白の場合は除去されます
	 * 
	 * @param {string} source
	 * @returns {string} 実行結果
	 */
	static execPowerShell(source) {
		// 改行がない場合はコマンドモードで実行する
		if(!/\n/.test(source)) {
			// スレッドセーフモードでコマンドモードで実行する
			const powershell_base = "powershell -sta -Command";
			// コマンドモードで実行するため、特定の文字をエスケープさせる
			const command = (powershell_base + " " + source).replace(/([\\"])/g, "\\$1");
			const exec = System.exec(command);
			if(exec.exit_code !== 0) {
				console.log(exec.exit_code);
			}
			return exec.out.replace(/\r?\n$/, "");
		}
		else {
			const file = new SFile(SFile.createTempFile().getAbsolutePath() + ".ps1");
			file.writeString(source, "utf-16le", "\r\n");
			// 本システムでスクリプトの実行が無効になっている可能性があるため一時的に実行ポリシーを変更して実行する
			// ※変更しないと「ParentContainsErrorRecordException」が発生する場合がある
			const powershell_base = "powershell -NoProfile -ExecutionPolicy Unrestricted";
			const command = powershell_base + " \"" + file + "\"";
			const exec = System.exec(command);
			file.remove();
			if(exec.exit_code !== 0) {
				console.log(exec.exit_code);
			}
			return exec.out.replace(/\r?\n$/, "");
		}
	}

	/**
	 * WindowsAPI を実行する
	 * 
	 * 例
	 * - `dll_name` : `"user32.dll"`
	 * - `function_text` : `"int MessageBox(IntPtr hWnd, string lpText, string lpCaption, UInt32 uType)""`
	 * - `exec_text` : `"$api::MessageBox(0, \"テキスト\", \"キャプション\", 0);"`
	 * @param {string} dll_name - 利用するdll
	 * @param {string} function_text - 関数の定義データ(`$api`に代入されます。)
	 * @param {string} exec_text - 実行コマンド
	 * @returns {string}
	 */
	static callWindowsAPI(dll_name, function_text, exec_text) {
		// 利用例
		// System.callWindowsAPI(
		// 	"user32.dll",
		// 	"int MessageBox(IntPtr hWnd, string lpText, string lpCaption, UInt32 uType)",
		// 	"$api::MessageBox(0, \"テキスト\", \"キャプション\", 0);"
		// );
		//

		/*
			PowerShell 2.0 の Add-Type を使用している
			$api = Add-Type -Name "api" -MemberDefinition '
				[DllImport("user32.dll")] public extern static int MessageBox(IntPtr hWnd, string lpText, string lpCaption, UInt32 uType);
			' -PassThru;
			$api::MessageBox(0, \"テキスト\", \"キャプション\", 0);
		*/

		// ダブルクォーテーションだとエスケープが面倒なので、ここはシングルクォーテーションを使用する
		// eslint-disable-next-line quotes
		const api_base = `$api = Add-Type -Name "api" -MemberDefinition "[DllImport(""` + dll_name + `"")] public extern static ` + function_text + `;" -PassThru;`;
		const command = api_base + " " + exec_text;
		return System.execPowerShell(command);
	}

	/**
	 * クリップボードからテキストを取得する
	 * @returns {string}
	 */
	static getClipBoardText() {
		/*
			Add-Type -Assembly System.Windows.Forms;
			[System.Windows.Forms.Clipboard]::GetText();
		*/
		const command = "Add-Type -Assembly System.Windows.Forms; [System.Windows.Forms.Clipboard]::GetText();";
		return System.execPowerShell(command);
	}

	/**
	 * クリップボードへテキストを設定する
	 * @param {string} text
	 */
	static setClipBoardText(text) {
		/*
			Add-Type -Assembly System.Windows.Forms;
			[System.Windows.Forms.Clipboard]::SetText(\"" + text + "\", 1);
		*/
		const command = "Add-Type -Assembly System.Windows.Forms; [System.Windows.Forms.Clipboard]::SetText(\"" + text + "\", 1);";
		// PowerShell 5.0以降
		// command = "Set-Clipboard \"これでもコピー可能\"";
		System.execPowerShell(command);
	}

	/**
	 * `XMLHttpRequest` を作成
	 * - 取得できない場合は `null`
	 * 
	 * @returns {XMLHttpRequest}
	 */
	 static createXMLHttpRequest() {
		try {
			return new XMLHttpRequest();
		}
		catch (e) {
			const MSXMLHTTP = [
				"WinHttp.WinHttpRequest.5.1",
				"WinHttp.WinHttpRequest.5",
				"WinHttp.WinHttpRequest",
				"Msxml2.ServerXMLHTTP.6.0",
				"Msxml2.ServerXMLHTTP.5.0",
				"Msxml2.ServerXMLHTTP.4.0",
				"Msxml2.ServerXMLHTTP.3.0",
				"Msxml2.ServerXMLHTTP",
				"Microsoft.ServerXMLHTTP",
				"Msxml2.XMLHTTP.6.0",
				"Msxml2.XMLHTTP.5.0",
				"Msxml2.XMLHTTP.4.0",
				"Msxml2.XMLHTTP.3.0",
				"Msxml2.XMLHTTP",
				"Microsoft.XMLHTTP"
			];
			// ※ WinHttp.WinHttpRequest は onreadystatechange の書き換えができない
			for(let i = 0; i < MSXMLHTTP.length; i++) {
				try {
					return new ActiveXObject(MSXMLHTTP[i]);
				}
				catch (e) {
					continue;
				}
			}
			return null;
		}
	}

	/**
	 * `MSXML2.DOMDocument` を作成
	 * - 取得できない場合は `null`
	 * 
	 * @returns {any}
	 */
	 static createMSXMLDOMDocument() {
		const MSXMLDOM = [
			"Msxml2.DOMDocument.6.0",
			"Msxml2.DOMDocument.3.0",
			"Msxml2.DOMDocument",
			"Microsoft.XMLDOM"
		];
		for(let i = 0; i < MSXMLDOM.length; i++) {
			try {
				return new ActiveXObject(MSXMLDOM[i]);
			}
			catch (e) {
				continue;
			}
		}
		return null;
	}

	/**
	 * `Byte 配列` から数値配列を作成する
	 * - `ADODB.Stream` などを用いて取得したバイナリ配列を `JavaScript` でも扱える型へ変更する
	 * 
	 * @param {any} byte_array
	 * @returns {number[]}
	 */
	static createNumberArrayFromByteArray(byte_array) {
		const dom = System.createMSXMLDOMDocument();
		if(dom === null) {
			console.log("createMSXMLDOMDocument")
			return [];
		}

		// バイト配列から16進数テキストへ変換
		// 参考
		// https://qiita.com/tnakagawa/items/9bcc26b501f5b995d896
		const element = dom.createElement("hex");
		element.dataType = "bin.hex";
		element.nodeTypedValue = byte_array;
		/**
		 * @type {string}
		 */
		const hex_text = element.text;
		const out = new Array(hex_text.length / 2);
		// バイト文字列から配列へ変更
		for(let i = 0; i < out.length; i++) {
			out[i] = Number.parseInt(hex_text.substr(i * 2, 2), 16);
		}
		return out;
	}

	/**
	 * 数値配列から`Byte 配列`を作成する
	 * - `ADODB.Stream` などを用いて取得したバイナリ配列を `JavaScript` でも扱える型へ変更する
	 * - `offset` を指定した場合は、出力したバイト配列はその位置までは `NUL` で埋まった配列となる
	 * 
	 * @param {number[]} number_array
	 * @param {number} [offset = 0]
	 * @returns {any}
	 */
	 static createByteArrayFromNumberArray(number_array, offset) {
		const dom = System.createMSXMLDOMDocument();
		if(dom === null) {
			console.log("createMSXMLDOMDocument")
			return null;
		}
		let max_size = offset !== undefined ? offset : 0;
		let hex_string = [];
		// offsetが設定されている場合は、オフセット位置まで00で埋める
		let p;
		for(p = 0; p < max_size; p++) {
			hex_string[p] = "00";
		}
		max_size += number_array.length;
		// 16進数の文字列を作成する
		for(let i = 0; p < max_size; i++, p++) {
			if(number_array[i] < 16) {
				hex_string[p] = "0" + number_array[i].toString(16);
			}
			else {
				hex_string[p] = number_array[i].toString(16);
			}
		}
		// バイト配列から16進数テキストへ変換
		// 参考
		// https://qiita.com/tnakagawa/items/9bcc26b501f5b995d896
		const element = dom.createElement("hex");
		element.dataType = "bin.hex";
		element.text = hex_string.join("");
		const byte_array = element.nodeTypedValue;
		return byte_array;
	}

	/**
	 * データの型を小文字の英字で返す
	 * - 配列 : `array`
	 * - 正規表現 : `regexp`
	 * - 例外エラー : `error`
	 * - 関数 : `function`
	 * - クラス : `object`
	 * - undefined : `undefined`
	 * - null : `null` など
	 * 
	 * @param {any} x
	 * @returns {string}
	 */
	static typeOf(x) {
		// null, undefined は ES3 だと [object Object] になり、
		// "[object Null]", "[object Undefined]" とならないため、個別に確認する
		if(x === null) {
			return "null";
		}
		if(x === undefined) {
			return "undefined";
		}
		return Object.prototype.toString.call(x).slice(8, -1).toLowerCase();
	}

	/**
	 * 指定した値が `NativeCode` かを判定します
	 * - JavaScript エンジンが用意している関数など : `true`
	 * - その他 : `false`
	 * 
	 * @param {any} x
	 * @returns {boolean}
	 */
	static isNativeCode(x) {
		// 以下のような形式化を調べる
		// function xxxxx() {
    	//		[native code]
		// }
		return /^[^{]+{\s*\[native code\]\s*}\s*$/.test(x.toString());
	}


}

/**
 * `System.run` の起動オプション用のコード
 * @typedef {Object} typeAppWinStyle
 * @property {number} Hide
 * @property {number} NormalFocus
 * @property {number} MinimizedFocus
 * @property {number} MaximizedFocus
 * @property {number} NormalNoFocus
 * @property {number} MinimizedNoFocus
 */

/**
 * `System.run` の起動オプション用のコード一覧
 * @type {typeAppWinStyle}
 */
System.AppWinStype = {
	Hide				:0,
	NormalFocus			:1,
	MinimizedFocus		:2,
	MaximizedFocus		:3,
	NormalNoFocus		:4,
	MinimizedNoFocus	:6
};
