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
 * 出力関数
 * @typedef {Object} _OUTPUT_
 * @property {function(any): void} print 文字列を表示（最終行で自動で改行されない）
 * @property {function(any): void} println 文字列を表示（最終行で自動で改行される）
 * @property {function(string, ...any): void} printf 指定したフォーマットで整形した文字列を表示
 */

/**
 * システム関数
 * @typedef {Object} _SYSTEM_
 * @property {_OUTPUT_} out
 * @property {function(): string} readLine キーボードのテキスト入力を取得
 * @property {function(): number} currentTimeMillis UNIX時間をミリ秒で取得
 * @property {function(number): void} sleep 処理を一時停止
 * @property {function(): void} stop 処理を停止
 * @property {function(boolean): void} executeOnCScript CUIで起動しなおす
 * @property {function(): void} executeOnWScript GUIで起動しなおす
 * @property {function(): string[]} getArguments スクリプトファイルへの引数を取得
 * @property {function(string): void} setCurrentDirectory カレントディレクトリを設定
 * @property {function(): string} getCurrentDirectory カレントディレクトリを取得
 * @property {function(): string} getScriptDirectory 実行中のスクリプトがあるカレントディレクトリを取得
 * @property {function(string): void} initializeCurrentDirectory 実行中のスクリプトがあるディレクトリをカレントディレクトリに設定
 */

/**
 * システム関数
 * @type {_SYSTEM_}
 */
const System = {

	/**
	 * 出力用途
	 */
	out : {
		
		/**
		 * 文字列を表示（最終行で自動で改行されない）
		 * @param {any} text
		 */
		print : function(text) {
			const output = text.toString();
			if(is_cscript) {
				WSH.StdOut.Write(output);
			}
			else {
				WScript.Echo(output);
			}
		},

		/**
		 * 文字列を表示（最終行で自動で改行される）
		 * @param {any} text
		 */
		println : function(text) {
			const output = text.toString();
			if(is_cscript) {
				WSH.StdOut.Write(output + "\n");
			}
			else {
				WScript.Echo(output);
			}
		},

		/**
		 * 指定したフォーマットで整形した文字列を表示
		 * @param {any} text 
		 * @param {...any} parm パラメータは可変引数
		 */
		printf : function() {
			const x = [];
			for(let i = 0 ; i < arguments.length ; i++) {
				x[i] = arguments[i];
				if(i === 0) {
					x[i] = x[i].toString();
				}
			}
			System.out.println(Format.textf.apply(this, x));
		}

	},

	/**
	 * キーボードのテキスト入力を取得
	 * @returns {string}
	 */
	readLine : function() {
		return WScript.StdIn.ReadLine();
	},
	
	/**
	 * UNIX時間をミリ秒で取得
	 * @returns {number}
	 */
	currentTimeMillis : function() {
		const date = new Date();
		return date.getTime();
	},

	/**
	 * 処理を一時停止
	 * @param {number} time_sec
	 */
	sleep : function(time_sec) {
		WScript.Sleep((time_sec * 1000) | 0);
	},
	
	/**
	 * 処理を停止
	 */
	stop : function() {
		while(true) {
			WScript.Sleep(1000);
		}
	},
	
	/**
	 * CUIで起動しなおす
	 * @param {boolean} is_use_chakra - 高速なChakraエンジンを利用する（wsfが開けなくなる）
	 */
	executeOnCScript : function(is_use_chakra) {
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
	},
	
	/**
	 * GUIで起動しなおす
	 */
	executeOnWScript : function() {
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
	},
	
	/**
	 * スクリプトファイルへの引数を取得
	 * @returns {string[]}
	 */
	getArguments : function() {
		const args = [];
		for(let i = 0; i < WScript.Arguments.length; i++) {
			args[i] = WScript.Arguments(i);
		}
		return args;
	},
	
	/**
	 * カレントディレクトリを設定
	 * @param {string} filename
	 */
	setCurrentDirectory : function(filename) {
		const shell = new ActiveXObject("WScript.Shell");
		shell.CurrentDirectory = filename.toString();
	},
	
	/**
	 * カレントディレクトリを取得
	 * @returns {string}
	 */
	getCurrentDirectory : function() {
		const shell = new ActiveXObject("WScript.Shell");
		return shell.CurrentDirectory;
	},

	/**
	 * 実行中のスクリプトがあるカレントディレクトリを取得
	 * @returns {string}
	 */
	getScriptDirectory : function() {
		const x = WSH.ScriptFullName.match(/.*\\/)[0];
		return(x.substring(0 ,x.length - 1));
	},
	
	/**
	 * 実行中のスクリプトがあるディレクトリをカレントディレクトリに設定
	 */
	initializeCurrentDirectory : function() {
		const shell = new ActiveXObject("WScript.Shell");
		shell.CurrentDirectory = System.getScriptDirectory();
	}
};

export default System;
