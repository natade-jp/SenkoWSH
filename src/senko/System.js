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
		const output = text.toString();
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
		const output = text.toString();
		if(is_cscript) {
			WSH.StdOut.Write(output + "\n");
		}
		else {
			WScript.Echo(output);
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
				x[i] = x[i].toString();
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
}


