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
 * 文字列へ変換します。
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
	const string_data = data.toString();
	if(string_data === "[object Error]") {
		const e = data;
		const error_name	= e.name ? e.name : "Error";
		const error_number	= e.number ? Format.textf("0x%08X", e.number) : "0x00000000";
		const error_message	= e.message ? e.message : "エラーが発生しました。";
		return Format.textf("%s(%s) %s", error_name, error_number, error_message);
	}
	return string_data;
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
		System.WindowsAPI(
			"kernel32.dll",
			"bool Beep(uint dwFreq, uint dwDuration)",
			"$api::Beep(" + (frequency_hz | 0) + ", " + ((time_sec * 1000) | 0) + ");"
		);
	}

	/**
	 * 指定したコマンドを別プロセスとして実行する
	 * @param {string} command - コマンド
	 * @param {number} [style=1] - 起動オプション
	 * @param {boolean} [is_wait=false] - プロセスが終了するまで待つ
	 */
	static run(command, style, is_wait) {
		const NormalFocus = 1;
		const intWindowStyle = style !== undefined ? style : NormalFocus;
		const bWaitOnReturn = is_wait !== undefined ? is_wait : false;
		const shell = WScript.CreateObject("WScript.Shell");
		// @ts-ignore
		return shell.Run(command, intWindowStyle, bWaitOnReturn);
	}

	/**
	 * 指定したコマンドを子プロセスとして実行する
	 * @param {string} command 
	 * @returns {SystemExecResult}
	 */
	static exec(command) {
		const shell = WScript.CreateObject("WScript.Shell");
		const exec = shell.Exec(command);
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
	 * 
	 * @param {string} source
	 * @param {string} [charset="ansi"] - 文字コード
	 * @returns {SystemExecResult|null}
	 */
	static BatchScript(source, charset) {
		const icharset = charset !== undefined ? charset.toLowerCase() : "ansi";
		const is_ansi = /shift_jis|sjis|ascii|ansi/i.test(icharset);
		const is_utf16 = /unicode|utf-16le/i.test(icharset);
		const is_line = !/\n/.test(source);

		// 改行がない場合はコマンドモードで実行する
		if(is_line) {
			// コマンドモードで実行する
			const cmd_base = is_utf16 ? "cmd /u /d /c" : "cmd /d /c";
			// コマンドモードで実行するため、特定の文字をエスケープさせる
			const command = cmd_base + " " + source;
			const exec = System.exec(command);
			return exec;
		}
		else {
			const file = new SFile(SFile.createTempFile().getAbsolutePath() + ".bat");
			let cs;
			cs = is_ansi ? "shift_jis" : "";
			cs = is_utf16 ? "shift_jis" : cs;
			cs = cs === "" ? icharset : cs;
			const ret = file.setTextFile(source, cs, "\r\n");
			if(ret === false) {
				console.log(cs);
				return null;
			}
			const cmd_base = is_utf16 ? "cmd /u /d /c" : "cmd /d /c";
			const command = cmd_base + " \"" + file + "\"";
			const exec = System.exec(command);
			file.remove();
			return exec;
		}
	}

	/**
	 * PowerShell を実行する
	 * 
	 * @param {string} source
	 * @returns {string}
	 */
	static PowerShell(source) {
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
			// 最終行を除去してなるべく1行で返す
			return exec.out.replace(/\r?\n$/, "");
		}
		else {
			const file = new SFile(SFile.createTempFile().getAbsolutePath() + ".ps1");
			file.setTextFile(source, "utf-16le", "\r\n");
			// 本システムでスクリプトの実行が無効になっている可能性があるため一時的に実行ポリシーを変更して実行する
			// ※変更しないと「ParentContainsErrorRecordException」が発生する場合がある
			const powershell_base = "powershell -NoProfile -ExecutionPolicy Unrestricted";
			const command = powershell_base + " \"" + file + "\"";
			const exec = System.exec(command);
			file.remove();
			if(exec.exit_code !== 0) {
				console.log(exec.exit_code);
			}
			return exec.out;
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
	static WindowsAPI(dll_name, function_text, exec_text) {
		// 利用例
		// System.WindowsAPI(
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
		return System.PowerShell(command);
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
		return System.PowerShell(command);
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
		System.PowerShell(command);
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
	 * - 配列であれば `array`、正規表現であれば `regexp` などを返します
	 * 
	 * @param {any} x
	 * @returns {string}
	 */
	static typeOf(x) {
		return Object.prototype.toString.call(x).slice(8, -1).toLowerCase();
	}

}


