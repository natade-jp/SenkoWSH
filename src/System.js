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

const System = {

	out : {
		
		/**
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
	 * @returns {string}
	 */
	readLine : function() {
		return WScript.StdIn.ReadLine();
	},
	
	/**
	 * @returns {number}
	 */
	currentTimeMillis : function() {
		const date = new Date();
		return date.getTime();
	},

	/**
	 * @param {number} time
	 */
	sleep : function(time) {
		WScript.Sleep(time);
	},
	
	stop : function() {
		while(true) {
			WScript.Sleep(1000);
		}
	},
	
	executeOnCScript : function() {
		if(is_wscript) {
			// CScript で起動しなおす
			const shell = WScript.CreateObject("WScript.Shell");
			const run = [];
			const args = WScript.Arguments; // 引数
			run.push("\"C:\\Windows\\System32\\cscript.exe\"");
			run.push("//NoLogo");
			run.push("//E:{16d51579-a30b-4c8b-a276-0ff4dc41e755}");
			run.push("\"" + WSH.ScriptFullName + "\"");
			for(let i = 0; i < args.length; i++) {
				run.push("\"" + args(i) + "\"");
			}
			shell.Run( run.join(" ") );
			WSH.Quit();
		}
	},
	
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
	 * @param {string} filename
	 */
	setCurrentDirectory : function(filename) {
		const shell = new ActiveXObject("WScript.Shell");
		shell.CurrentDirectory = filename.toString();
	},
	
	/**
	 * @returns {string}
	 */
	getCurrentDirectory : function() {
		const shell = new ActiveXObject("WScript.Shell");
		return shell.CurrentDirectory;
	},

	/**
	 * @returns {string}
	 */
	getScriptDirectory : function() {
		const x = WSH.ScriptFullName.match(/.*\\/)[0];
		return(x.substring(0 ,x.length - 1));
	},
	
	initializeCurrentDirectory : function() {
		const shell = new ActiveXObject("WScript.Shell");
		shell.CurrentDirectory = System.getScriptDirectory();
	}
};

export default System;
