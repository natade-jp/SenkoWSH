/**
 * The script is part of SenkoWSH.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

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
	 * @param {number} time_sec
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
	 * CUIで起動しなおす
	 * @param {boolean} is_use_chakra - 高速なChakraエンジンを利用する（wsfが開けなくなる）
	 */
	static executeOnCScript(is_use_chakra) {
		const iis_use_chakra = is_use_chakra !== undefined ? is_use_chakra : false;
		if(is_wscript) {
			// CScript で起動しなおす
			const shell = WScript.CreateObject("WScript.Shell");
			const run = [];
			const args = WScript.Arguments; // 引数
			run.push("\"C:\\Windows\\System32\\cscript.exe\"");
			run.push("//NoLogo");
			if(iis_use_chakra) {
				run.push("//E:{16d51579-a30b-4c8b-a276-0ff4dc41e755}");
			}
			run.push("\"" + WSH.ScriptFullName + "\"");
			for(let i = 0; i < args.length; i++) {
				run.push("\"" + args(i) + "\"");
			}
			shell.Run( run.join(" ") );
			WSH.Quit();
		}
	}
	
	/**
	 * GUIで起動しなおす
	 */
	static executeOnWScript() {
		// cscriptで起動しているか
		if(is_cscript) {
			// WScript で起動しなおす
			const shell = WScript.CreateObject("WScript.Shell");
			const run = [];
			const args = WScript.Arguments; // 引数
			run.push("\"C:\\Windows\\System32\\wscript.exe\"");
			run.push("\"" + WSH.ScriptFullName + "\"");
			for(let i = 0; i < args.length; i++) {
				run.push("\"" + args(i) + "\"");
			}
			shell.Run( run.join(" ") );
			WSH.Quit();
		}
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
		const shell = new ActiveXObject("WScript.Shell");
		shell.CurrentDirectory = System.getScriptDirectory();
	}

	/**
	 * 指定したコマンドを実行する
	 * @param {string} command - コマンド
	 * @param {number} [style=1] - 起動オプション
	 * @param {boolean} [is_wait=false] - プロセスが終了するまで待つ
	 */
	static run(command, style, is_wait) {
		const NormalFocus = 1;
		const intWindowStyle = style !== undefined ? style : NormalFocus;
		const bWaitOnReturn = is_wait !== undefined ? is_wait : false;
		const objWShell = new ActiveXObject("WScript.Shell");
		// @ts-ignore
		return objWShell.Run(command, intWindowStyle, bWaitOnReturn);
	}

	/**
	 * PowerShell を実行する
	 * @param {string} source
	 * @returns {string}
	 */
	static PowerShell(source) {
		const powershell_base = "powershell -sta -Command";
		const command = powershell_base + " " + source;
		const objWShell = new ActiveXObject("WScript.Shell");
		const oe = objWShell.Exec(command.replace(/([\\"])/g, "\\$1"));
		// console.log(command.replace(/([\\"])/g, "\\$1"));
		oe.StdIn.Close();
		// @ts-ignore
		return oe.StdOut.ReadAll().replace(/\r?\n$/, "");
	}

	/**
	 * WindowsAPI を実行する
	 * 
	 * 例
	 * - dll_name : user32.dll
	 * - function_text : int MessageBox(IntPtr hWnd, string lpText, string lpCaption, UInt32 uType)
	 * - exec_text : $api::MessageBox(0, "テキスト", "キャプション", 0);
	 * @param {string} dll_name - 利用するdll
	 * @param {string} function_text - 関数の定義データ($apiに代入されます。)
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
		const command = "Add-Type -Assembly System.Windows.Forms; [System.Windows.Forms.Clipboard]::GetText();";
		return System.PowerShell(command);
	}

	/**
	 * クリップボードへテキストを設定する
	 * @param {string} text
	 */
	static setClipBoardText(text) {
		// PowerShell 5.0以降
		// command = "Set-Clipboard \"これでもコピー可能\"";
		const command = "Add-Type -Assembly System.Windows.Forms; [System.Windows.Forms.Clipboard]::SetText(\"" + text + "\", 1);";
		System.PowerShell(command);
	}

}


