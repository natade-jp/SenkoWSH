"use strict";

/* global WSH, WScript, main */

﻿/**
 * SenkoWSH System.js
 *  次のようなことを使用する場合に利用する。
 * 
 * ・JScript として動作させる。
 * ・コンソールに文字を出す
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 *
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
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
				System.out.println(text, true);
			}
		},
		
		println: function(text, isNotNewLine) {
			// HTMLで表示する場合
			if((System.HtmlConsole) && (System.HtmlConsole.isShow()))  {
				if(isNotNewLine) {
					System.HtmlConsole.out(text, isNotNewLine);
				}
				else {
					System.HtmlConsole.out(text, false);
				}
			}
			// JScript 用
			else if(System.isJScript()) {
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
	
	getCurrentDirectory: function() {
		if(System.isJScript()) {
			var shell = new ActiveXObject("WScript.Shell");
			return(shell.CurrentDirectory);
		}
	},

	getScriptDirectory: function() {
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
	
	setShowHtmlConsole: function(is_show_html_console) {
		if(typeof is_show_html_console !== "boolean") {
			throw "not boolean";
		}
		if(!document) {
			return;
		}
		if(!System.HtmlConsole) {
			var Console = function() {
				this.root		= null;
				this.element	= null;
				this.isshow		= false;
				this.loglength	= 250;
				this.linelength	= 0;
			};
			Console.prototype._initHTML = function() {
				if(this.root !== null) {
					return;
				}
				var root;
				root = document.getElementById("senko_console");
				if(root) {
					var child = root.lastChild;
					while (child) {
						root.removeChild(child);
						child = root.lastChild;
					}
				}
				else {
					root = document.body;
				}
				root.style.backgroundColor = "black";
				root.style.margin = "0px";
				root.style.padding = "0px";
				root.style.overflowY = "scroll";
				var element = this._getElement();
				root.appendChild(element);
				this.root = root;
			};
			Console.prototype._getElement = function() {
				if(this.element !== null) {
					return this.element;
				}
				var element = document.createElement("div");
				element.style.backgroundColor = "black";
				element.style.color = "white";
				element.style.display = "block";
				element.style.margin = "0px";
				element.style.padding = "5px";
				element.style.fontFamily = "Consolas, Courier New, Courier, Monaco, monospace";
				element.style.whiteSpace = "pre";
				this.element = element;
				return this.element;
			};
			Console.prototype.isShow = function() {
				return this.isshow;
			};
			Console.prototype.setShow = function(isshow) {
				if(typeof isshow !== "boolean") {
					throw "not boolean";
				}
				this._initHTML();
				var element = this._getElement();
				if(this.isshow !== isshow) {
					this.isshow = isshow;
					if(element) {
						element.style.display = this.isshow ? "block" : "none";
					}
				}
			};
			Console.prototype._autoScroll = function() {
				if((this.element === null) || (this.root === null)) {
					return;
				}
				var parentheight	= this.root.clientHeight;
				var childheight		= this.element.clientHeight;
				// スクロールしないと見えない領域とマージン
				var hideheight		= childheight - parentheight;
				var margin			= parentheight * 1.0;
				// スクロールしないと見えない領域が見えている状態ならオートスクロール
				if(hideheight - margin <= this.root.scrollTop) {
					this.root.scrollTop = childheight;
				}
			};
			Console.prototype._addNewLine = function() {
				this._initHTML();
				var element = this._getElement();
				// 次の行を作成する
				var p = document.createElement("p");
				p.innerText = "> ";
				p.style.margin = "0.2em 0px 0.2em 0px";
				p.style.padding = "0px";
				element.appendChild(p);
				this.linelength++;
				this._cleaningLog();
			};
			Console.prototype._appendText = function(text) {
				this._initHTML();
				var element = this._getElement();
				var p = element.lastElementChild;
				p.innerText = p.innerText + text;
			};
			Console.prototype._cleaningLog = function() {
				if(this.element === null) {
					return;
				}
				while(this.linelength > this.loglength) {
					this.element.removeChild(this.element.firstElementChild);
					this.linelength--;
				}
			};
			Console.prototype.setLogLength = function(loglength) {
				this.loglength = loglength;
			};
			Console.prototype.print = function(text) {
				this._initHTML();
				var element = this._getElement();
				if(element) {
					// 最終行に文字を追加する
					if(!element.lastElementChild) {
						this._addNewLine();
					}
					this._appendText(text);
				}
				this._autoScroll();
			};
			Console.prototype.println = function(text) {
				this._initHTML();
				var element = this._getElement();
				if(element) {
					// 最終行に文字を追加する
					if(!element.lastElementChild) {
						this._addNewLine();
					}
					this._appendText(text);
					// 次の行を作成する
					this._addNewLine();
				}
				this._autoScroll();
			};
			Console.prototype.out = function(text, isNotNewLine) {
				var printtext = null;
				if(typeof text === "undefined") {
					printtext = typeof text;
				}
				else if(text === null) {
					printtext = "null";
				}
				else if(text.toString === null) {
					printtext = "null";
				}
				else if(typeof text.toString === "function") {
					printtext = text.toString();
				}
				if(isNotNewLine) {
					this.print(printtext);
				}
				else {
					this.println(printtext);
				}
			};
			System.HtmlConsole = new Console();
		}
		System.HtmlConsole.setShow(is_show_html_console);
	},
	
	startHtmlMain: function() {
		if(typeof window !== "undefined") {
			window.addEventListener("load", main, false);
		}
	}
};

System.CScript();
System.initializeCurrentDirectory();
