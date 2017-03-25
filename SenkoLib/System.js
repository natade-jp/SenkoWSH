/**
 * System.js
 * 
 * VERSION:
 *  0.09
 *
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 *
 * LICENSE:
 *  CC0					(http://sciencecommons.jp/cc0/about)
 * 
 * HISTORY:
 *  2013/04/15 - v0.01 - natade - first release
 *  2013/04/22 - v0.02 - natade - bug fix
 *  2013/04/24 - v0.03 - natade - support  readLine
 *  2013/08/24 - v0.04 - natade - change   NYSL Version 0.9982 -> TRIPLE LICENSE
						isJScirpt追加
						標準出力をFireFox, Chorme, IE10 を想定して動作するように変更
 *  2013/10/15 - v0.05 - natade - System.out.printfを追加
 *  2013/11/07 - v0.06 - natade - JavaScript Lint による修正
 *  2013/11/10 - v0.07 - natade - window.prompt()を追加
 *  2013/11/12 - v0.08 - natade - printlnのブラウザ対応の際に関数なのに括弧を着けていなかったのを修正
 *  2014/05/10 - v0.09 - natade - HTML用 main関数を実行する startHtmlMain を追加
 *
 * DEPENDENT LIBRARIES:
 *  System.out.printf を使用する場合は String.js が必要です
 *  ない場合は、依存した機能が動作しません。
 */

var System = {

	out: {
	
		print: function(text) {
			if(System.isJScript()) {
				if(/cscript\.exe$/i.test(WSH.FullName)) {
					WSH.StdOut.Write(text);
				}
				else {
					WScript.Echo(text);
				}
			}
			// JScript ではない場合、1行表示を試みる
			else {
				System.out.println(text);
			}
		},
		
		println: function(text) {
			// JScript 用
			if(System.isJScript()) {
				if(/cscript\.exe$/i.test(WSH.FullName)) {
					WSH.StdOut.Write(text + "\n");
				}
				else {
					WScript.Echo(text);
				}
			}
			// コンソールを持つ場合はコンソールを使用 FireFox, Chrome 用
			else if(System.isConsole()) {
				var out = System.getConsole();
				if(typeof text === "undefined") {
					out.log(typeof text);
				}
				else if(text === null) {
					out.log(text);
				}
				else if(typeof text.toString === "function") {
					out.log(text.toString());
				}
			}
			// 最終的には alert IE10用
			else if(typeof alert !== "undefined") {
				alert(text);
			}
		},
		
		printf: function() {
			if(typeof String !== "undefined") {
				var x = [];
				for(var i = 0 ; i < arguments.length ; i++) {
					x[i] = arguments[i];
				}
				System.out.println(String.format.apply(this, x));
			}
			else {
				System.out.println("String.js を include して下さい。");
			}
		}
	},
	
	readLine: function() {
		if(System.isJScript()) {
			return(WScript.StdIn.ReadLine());
		}
		if((typeof window !== "undefined")&&(typeof window.prompt !== "undefined")) {
			return(window.prompt(""));
		}
	},
	
	currentTimeMillis: function() {
		var date = new Date();
		return(date.getTime());
	},

	sleep: function(time) {
		if(System.isJScript()) {
			//http://office.microsoft.com/ja-jp/excel-help/HP010062480.aspx
			//var excel = new ActiveXObject("Excel.Application");
			//excel.ExecuteExcel4Macro("CALL(\"kernel32\", \"Sleep\", \"JJ\", " + time + ")");
			WScript.Sleep(time);
		}
		return;
	},
	
	stop: function() {
		if(System.isJScript()) {
			while(true) {
				WScript.Sleep(1000);
			}
		}
		return;
	},
	
	isJScript: function() {
		return(typeof WSH !== "undefined");
	},
	
	isConsole: function() {
		return(System.getConsole() !== null);
	},
	
	getConsole: function() {
		if(typeof WSH !== "undefined") {
			return(null);
		}
		else if(typeof console !== "undefined") {
			return(console);
		}
		else if(typeof window !== "undefined") {
			if(typeof window.console !== "undefined") {
				return(window.console);
			}
		}
		return(null);
	},
	
	CScript: function() {
		if(System.isJScript()) {
			if(/wscript\.exe$/i.test(WSH.FullName)) {
				// CScript で起動しなおす
				var shell = WScript.CreateObject("WScript.Shell");
				var run = [];
				var args = WScript.Arguments; // 引数
				run.push("cscript");
				run.push("\"" + WSH.ScriptfullName + "\"");
				for(var i = 0;i < args.length;i++) {
					run.push("\"" + args(i) + "\"");
				}
				shell.run( run.join(" ") );
				WSH.Quit();
			}
		}
	},
	
	WScript: function() {
		if(System.isJScript()) {
			// cscriptで起動しているか
			if(/cscript\.exe$/i.test(WSH.FullName)) {
				// WScript で起動しなおす
				var shell = WScript.CreateObject("WScript.Shell");
				var run = [];
				var args = WScript.Arguments; // 引数
				run.push("wscript");
				run.push("\"" + WSH.ScriptfullName + "\"");
				for(var i = 0;i < args.length;i++) {
					run.push("\"" + args(i) + "\"");
				}
				shell.run( run.join(" ") );
				WSH.Quit();
			}
		}
	},
	
	getArguments: function() {
		if(System.isJScript()) {
			var args = [];
			for(var i = 0;i < WScript.Arguments.length;i++) {
				args[i] = WScript.Arguments(i);
			}
			return(args);
		}
	},
	
	setCurrentDirectory: function(filename) {
		if(System.isJScript()) {
			var shell = new ActiveXObject("WScript.Shell");
			shell.CurrentDirectory = filename.toString();
		}
	},
	
	getCurrentDirectory: function(filename) {
		if(System.isJScript()) {
			var shell = new ActiveXObject("WScript.Shell");
			return(shell.CurrentDirectory);
		}
	},

	getScriptDirectory: function(filename) {
		if(System.isJScript()) {
			var x = WSH.ScriptFullName.match(/.*\\/)[0];
			return(x.substring(0 ,x.length - 1));
		}
	},
	
	initializeCurrentDirectory: function() {
		if(System.isJScript()) {
			var shell = new ActiveXObject("WScript.Shell");
			shell.CurrentDirectory = System.getScriptDirectory();
		}
	},
	
	startHtmlMain: function() {
		if(typeof window !== "undefined") {
			window.addEventListener("load", main, false);
		}
	}
};

System.CScript();
System.initializeCurrentDirectory();
