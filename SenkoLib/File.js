/**
 * File.js
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
 *  2013/04/07 - v0.01 - natade - first release
 *  2013/04/15 - v0.02 - natade - bug fix
 *  2013/04/22 - v0.03 - natade - support  csv
 *  2013/04/22 - v0.04 - natade - support  http
 *  2013/04/30 - v0.05 - natade - support  binary
 *  2013/08/24 - v0.06 - natade - change   NYSL Version 0.9982 -> TRIPLE LICENSE
 *  2013/11/07 - v0.07 - natade - JavaScript Lint による修正
 *  2013/11/10 - v0.08 - natade - 将来性を考えて、csvの解析部分をCSVToolに分離しました。
 *  2014/06/03 - v0.09 - natade - toStringにbugがあったのを修正
 *
 * DEPENDENT LIBRARIES:
 *  なし
 */

var CSVTool = {
	
	parseCSV: function(text, separator, newline) {
		if(arguments.length < 1) {
			separator = ",";
		}
		if(arguments.length < 2) {
			newline = "\n";
		}
		text = text.replace(/\r\n?|\n/g, newline);
		var CODE_SEPARATOR = separator.charCodeAt(0);
		var CODE_CR    = 0x0D;
		var CODE_LF    = 0x0A;
		var CODE_DOUBLEQUOTES = 0x22;
		var out = [];
		var length = text.length;
		var element = "";
		var count_rows    = 0;
		var count_columns = 0;
		var isnextelement = false;
		var isnextline    = false;
		for(var i = 0;i < length;i++) {
			var code = text.charCodeAt(i);
			// 複数行なら一気に全て読み込んでしまう(1文字目がダブルクォーテーションかどうか)
			if((code === CODE_DOUBLEQUOTES)&&(element.length === 0)) {
				i++;
				for(;i < length;i++) {
					code = text.charCodeAt(i);
					if(code === CODE_DOUBLEQUOTES) {
						// フィールドの終了か？　文字としてのダブルクォーテーションなのか
						if((i + 1) !== (length - 1)) {
							if(text.charCodeAt(i + 1) === CODE_DOUBLEQUOTES) {
								i++;
								element += "\""; 
							}
							else {
								break;
							}
						}
						else {
							break;
						}
					}
					else {
						element += text.charAt(i);
					}
				}
			}
			// 複数行以外なら1文字ずつ解析
			else {
				switch(code) {
					case(CODE_SEPARATOR):
						isnextelement = true;
						break;
					case(CODE_CR):
					case(CODE_LF):
						isnextline = true;
						break;
					default:
						break;
				}
				if(isnextelement) {
					isnextelement = false;
					if(out[count_rows] === undefined) {
						out[count_rows] = [];
					}
					out[count_rows][count_columns] = element;
					element = "";
					count_columns += 1;
				}
				else if(isnextline) {
					isnextline = false;
					//文字があったり、改行がある場合は処理
					//例えば CR+LF や 最後のフィールド で改行しているだけなどは無視できる
					if((element !== "")||(count_columns !== 0)) {
						if(out[count_rows] === undefined) {
							out[count_rows] = [];
						}
						out[count_rows][count_columns] = element;
						element = "";
						count_rows    += 1;
						count_columns  = 0;
					}
				}
				else {
					element += text.charAt(i);
				}
			}
		}
		return(out);
	},
	
	makeCSV: function(text, separator, newline) {
		if(arguments.length < 2) {
			separator = ",";
		}
		if(arguments.length < 3) {
			newline = "\r\n";
		}
		var out = "";
		var escape = /[\"\r\n\,\t]/;
		if(text !== undefined) {
			for(var i = 0;i < text.length;i++) {
				if(text[i] !== undefined) {
					for(var j = 0;j < text[i].length;j++) {
						var element = text[i][j].toString();
						if(escape.test(element)) {
							element = element.replace(/\"/g, "\"\"");
							element = "\"" + element + "\"";
						}
						out += element;
						if(j !== text[i].length - 1) {
							out += separator;
						}
					}
				}
				out += newline;
			}
		}
		return(out);
	}
	
};

var File = function(pathname) {
	if(arguments.length !== 1) {
		throw "IllegalArgumentException";
	}
	else if(typeof pathname === "string") {
		this.pathname = pathname;
	}
	else if(pathname instanceof File) {
		this.pathname = pathname.toString();
	}
	else {
		throw "IllegalArgumentException";
	}
	this.fso = new ActiveXObject('Scripting.FileSystemObject');
};

File.prototype.delete_ = function() {
	if(this.isFile()) {
		return(this.fso.DeleteFile(this.pathname));
	}
	else if(this.isDirectory()) {
		return(this.fso.DeleteFolder(this.pathname));
	}
	else {
		return(false);
	}
};
File.prototype.exists = function() {
	var out = this.isFile();
	if(out === false) {
		out = this.isDirectory();
	}
	return(out);
};
File.prototype.copy = function(file) {
	if(this.isFile()) {
		return(this.fso.CopyFile(this.pathname, file, true));
	}
	else if(this.isDirectory()) {
		return(this.fso.CopyFolder(this.pathname, file, true));
	}
	else {
		return(false);
	}
};
File.prototype.move = function(file) {
	if(this.isFile()) {
		this.fso.MoveFile(this.pathname, file);
		this.pathname = file.toString();
		return(true);
	}
	else if(this.isDirectory()) {
		this.fso.MoveFolder(this.pathname, file);
		this.pathname = file.toString();
		return(true);
	}
	else {
		return(false);
	}
};
File.prototype.toString = function() {
	return(this.getAbsolutePath());
};
File.prototype.getName = function() {
	return(this.fso.GetFileName(this.pathname));
};
// 親フォルダの絶対パス名
File.prototype.getParent = function() {
	var x = this.getAbsolutePath().match(/.*\\/)[0];
	return(x.substring(0 ,x.length - 1));
};
File.prototype.getParentFile = function() {
	return(new File(this.getParent()));
};
File.prototype.getExtensionName = function() {
	return(this.fso.GetExtensionName(this.pathname));
};
File.prototype.isAbsolute = function() {
	var name = this.pathname.replace("/", "\\");
	return(this.fso.GetAbsolutePathName(this.pathname) === name);
};
File.prototype.isDirectory = function() {
	return(this.fso.FolderExists(this.pathname));
};
File.prototype.isFile = function() {
	return(this.fso.FileExists(this.pathname));
};
File.prototype.isHidden = function() {
	if(this.isFile()) {
		var file = this.fso.getFile(this.pathname);
		return((file.Attributes & 2) !== 0);
	}
	else if(this.isDirectory()) {
		var folder = this.fso.getFolder(this.pathname);
		return((folder.Attributes & 2) !== 0);
	}
	else {
		return(false);
	}
};
File.prototype.lastModified = function() {
	if(this.isFile()) {
		return(new Date(this.fso.getFile(this.pathname).DateLastAccessed));
	}
	else if(this.isDirectory()) {
		return(new Date(this.fso.getFolder(this.pathname).DateLastAccessed));
	}
	else {
		return(false);
	}
};
File.prototype.length = function() {
	if(this.isFile()) {
		return(this.fso.getFile(this.pathname).Size);
	}
	else if(this.isDirectory()) {
		return(this.fso.getFolder(this.pathname).Size);
	}
	else {
		return(-1);
	}
};
File.prototype.getFiles = function() {
	if(!this.isDirectory) {
		return(null);
	}
	var out = [];
	var list = new Enumerator(this.fso.getFolder(this.pathname).Files);
	for(var i = 0; !list.atEnd(); list.moveNext()) {
		out[i++] = list.item().Name;
	}
	return(out);
};
File.prototype.getSubFolders = function() {
	if(!this.isDirectory) {
		return(null);
	}
	var out = [];
	var list = new Enumerator(this.fso.getFolder(this.pathname).SubFolders);
	for(var i = 0; !list.atEnd(); list.moveNext()) {
		out[i++] = list.item().Name;
	}
	return(out);
};
File.prototype.getNormalizedPathName = function() {
	if(this.pathname === "") {
		return(".\\");
	}
	var name = this.pathname.replace("/", "\\");
	if(name.slice(-1) !== "\\") {
		name += "\\";
	}
	return(name);
};
File.prototype.getAllFiles = function() {
	if(!this.isDirectory) {
		return(null);
	}
	var out = [];
	var path = [];
	var collection = [];
	var pointer = 0;
	var list;
	var i;
	var targetfolder;
	path[pointer] = this.getNormalizedPathName();
	targetfolder = this.fso.getFolder(path[pointer]);
	list = new Enumerator(this.fso.getFolder(targetfolder).Files);
	for(var i = 0; !list.atEnd(); list.moveNext()) {
		out[i++] = path[pointer] + list.item().Name;
	}
	if(targetfolder.SubFolders.Count === 0) {
		return(out);
	}
	collection[pointer] = new Enumerator(targetfolder.SubFolders);
	pointer++;
	while(true) {
		path[pointer] = path[pointer - 1] + collection[pointer - 1].item().Name;
		out[i++] = path[pointer];
		path[pointer] += "\\";
		targetfolder = this.fso.getFolder(path[pointer]);
		list = new Enumerator(targetfolder.Files);
		for(; !list.atEnd(); list.moveNext()) {
			out[i++] = path[pointer] + list.item().Name;
		}
		if(targetfolder.SubFolders.Count === 0) {
			while(true) {
				if(pointer === 0) {
					break;
				}
				collection[pointer - 1].moveNext();
				if(collection[pointer - 1].atEnd()) {
					pointer--;
					continue;
				}
				else {
					break;
				}
			}
			if(pointer === 0) {
				break;
			}
		}
		else {
			collection[pointer] = new Enumerator(targetfolder.SubFolders);
			pointer++;
		}
	}
	return(out);
};
File.prototype.list = function() {
	if(!this.isDirectory) {
		return(null);
	}
	var files = this.getFiles();
	var subfolders = this.getSubFolders();
	var out = [], i = 0;
	for(var j = 0; j < subfolders.length;) {
		out[i++] = subfolders[j++];
	}
	for(var j = 0; j < files.length;) {
		out[i++] = files[j++];
	}
	return(out);
};
File.prototype.getAbsolutePath = function() {
	return(this.fso.GetAbsolutePathName(this.pathname));
};
File.prototype.mkdir = function() {
	if(this.exists()) {
		return(false);
	}
	else {
		this.fso.CreateFolder(this.pathname);
		return(true);
	}
};
File.prototype.mkdirs = function() {
	var name = this.pathname.replace("/", "\\").split("\\");
	var dir  = "";
	var out  = true;
	for(var i = 0; i < name.length; i++) {
		dir += name[i];
		if(this.fso.FileExists(dir)) {
			return(false);
		}
		else if(!this.fso.FolderExists(dir)) {
			this.fso.CreateFolder(dir);
		}
		dir += "\\";
	}
	return(out);
};
File.prototype.renameTo = function(name) {
	if(this.isFile()) {
		this.fso.getFile(this.pathname).Name = name;
		this.pathname = name.toString();
		return(true);
	}
	else if(this.isDirectory()) {
		this.fso.getFolder(this.pathname).Name = name;
		this.pathname = name.toString();
		return(true);
	}
	else {
		return(false);
	}
};
File.prototype.run = function() {
	var objWShell = new ActiveXObject("WScript.Shell");
	var NormalFocus = 1;
	objWShell.Run(this.getAbsolutePath(), NormalFocus, false);
};
File.prototype.writeLine = function(text) {
	var file;
	if(this.isFile()) {
		var ForAppending = 8;
		file = this.fso.OpenTextFile(this.pathname, ForAppending);
	}
	else if(this.isDirectory()) {
		return(false);
	}
	else {
		file = this.fso.CreateTextFile(this.pathname, true);
	}
	file.WriteLine(text);
	file.Close();
	return(true);
};
File.prototype.getText = function(charset, newline) {
	if(arguments.length < 1) {
		charset = "_autodetect_all";
	}
	if(arguments.length < 2) {
		newline = "\n"; //javascript上での改行
	}
	var text = null;
	if(/^htt/.test(this.pathname)) {
		var createXmlHttpForCheckLink = function() {
			try {
				return(new XMLHttpRequest());
			}
			catch (e) {
				try {
					return(new ActiveXObject("MSXML2.XMLHTTP.6.0"));
				}
				catch (e) {
					try {
						return(new ActiveXObject("MSXML2.XMLHTTP.3.0"));
					}
					catch (e) {
						try {
							return(new ActiveXObject("MSXML2.XMLHTTP"));
						}
						catch (e) {
							try {
								return(new ActiveXObject("Microsoft.XMLHTTP"));
							}
							catch (e) {
								return(null);
							}
						}
					}
				}
			}
			return(null);
		};
		var xmlhttp = createXmlHttpForCheckLink();
		if(xmlhttp === null) {
			return(null);
		}
		var isdone = false;
		var handleHttpResponse = function (){
		//	if(xmlhttp.readyState === 0) { // UNSENT
		//	}
		//	if(xmlhttp.readyState === 1) { // OPENED
		//	}
		//	if(xmlhttp.readyState === 2) { // HEADERS_RECEIVED
		//	}
		//	if(xmlhttp.readyState === 3) { // LOADING
		//	}
			if(xmlhttp.readyState === 4) { // DONE
				isdone = true;
			}
		};
		xmlhttp.onreadystatechange = handleHttpResponse;
		xmlhttp.open("GET", this.pathname, true);
		xmlhttp.send(null);
		var TIMEOUT = 100; //timeout 10sec
		for(var i = 0;(i < TIMEOUT) && (!isdone);i++) {
			WScript.Sleep(100);
		}
		if(xmlhttp.status !== 200) {
			return(null);
		}
		text = xmlhttp.responseText;
	}
	else {
		// 使用可能な charset については下記を参照
		// HKEY_CLASSES_ROOT\MIME\Database\Charset
		var adTypeText = 2;
		var adReadAll = -1;
		var stream;
		stream = new ActiveXObject("ADODB.Stream");
		stream.type = adTypeText;
		stream.charset = charset;
		stream.open();
		stream.loadFromFile(this.pathname);
		text = stream.readText(adReadAll);
		stream.close();
		// 文字コードが自動取得の場合、BOMまで読み込んでしまうのを防止する
		if((charset === "_autodetect_all")||(charset === "_autodetect")) {
			var newcharset = "";
			// 1文字以上のとき
			if(text.length > 1) {
				// utf-16le
				if(text.charCodeAt(0) === 0xfeff) {
					// 通常は、このルートはBOM付きutf-16leのときに通るが、
					// BOM付きutf-8でも通る場合がなぜかある。（後述）
					newcharset = "unicode";
				}
				// utf-16be
				else if(text.charCodeAt(0) === 0xfffe) {
					newcharset = "unicodeFFFE";
				}
			}
			// 2文字以上のとき
			if(text.length > 2) {
				// BOM付きutf-8でなぜかこの文字がくっつく場合がある。
				if(	(text.charCodeAt(0) === 0x30fb) &&
					(text.charCodeAt(1) === 0xff7f)) {
					newcharset = "utf-8";
				}
			}
			// 3文字以上のとき
			if(text.length > 3) {
				// utf-8
				if(	(text.charCodeAt(0) === 0xef) &&
					(text.charCodeAt(1) === 0xbb) &&
					(text.charCodeAt(2) === 0xbf)) {
					newcharset = "utf-8";
				}
			}
			// 上判定でBOM付きが分かった場合、正しい文字コードで取得する
			if(newcharset !== "") {
				stream = new ActiveXObject("ADODB.Stream");
				stream.type = adTypeText;
				stream.charset = newcharset;
				stream.open();
				stream.loadFromFile(this.pathname);
				text = stream.readText(adReadAll);
				stream.close();
			}
			// BOM付きutf-8 でも BOM付きutf-16le と判定した場合の対処
			if((text.length > 1) && (text.charCodeAt(0) === 0xbbef)) {
				stream = new ActiveXObject("ADODB.Stream");
				stream.type = adTypeText;
				stream.charset = "utf-8";
				stream.open();
				stream.loadFromFile(this.pathname);
				text = stream.readText(adReadAll);
				stream.close();
			}
		}
	}
	if(text !== null) {
		return(text.replace(/\r\n?|\n/g, newline)); //改行コードを統一
	}
	else {
		return(null);
	}
};
File.prototype.setText = function(text, charset, newline, issetBOM) {
	if(arguments.length < 2) {
		charset = "utf-8";
	}
	if(arguments.length < 3) {
		newline = "\r\n";
	}
	if(arguments.length < 4) {
		issetBOM = false; //utf-8のみ有効 BOMありかなし
	}
	var adTypeBinary = 1;
	var adTypeText = 2;
	var adSaveCreateOverWrite = 2;
	var stream;
	// 使用可能な charset については下記を参照
	// HKEY_CLASSES_ROOT\MIME\Database\Charset
	stream = new ActiveXObject("ADODB.Stream");
	stream.type = adTypeText;
	stream.charset = charset;
	stream.open();
	stream.writeText(text.replace(/\r\n?|\n/g, newline)); //改行コードを統一
	if(/utf\-8/.test(charset.toLowerCase()) && (!issetBOM)) {
		stream.position = 0;
		stream.type = adTypeBinary;
		stream.position = 3;
		var binary = stream.read();
		stream.close();
		stream = new ActiveXObject("ADODB.Stream");
		stream.type = adTypeBinary;
		stream.open();
		stream.write(binary);
	}
	stream.saveToFile(this.pathname, adSaveCreateOverWrite);
	stream.close();
	return(true);
};
File.prototype.getCSV = function(separator, charset, newline) {
	if(arguments.length < 1) {
		separator = ",";
	}
	if(arguments.length < 2) {
		charset = "shift-jis";
	}
	if(arguments.length < 3) {
		newline = "\n";
	}
	var text = this.getText(charset);
	return(CSVTool.parseCSV(text, separator, newline));
};

File.prototype.setCSV = function(text, separator, charset, newline) {
	if(arguments.length < 2) {
		separator = ",";
	}
	if(arguments.length < 3) {
		charset = "shift-jis";
	}
	if(arguments.length < 4) {
		newline = "\r\n";
	}
	var out = CSVTool.makeCSV(text, separator, newline);
	return(this.setText(out, charset, newline));
};

File.prototype.getByte = function() {
	var stream;
	var text;
	var adTypeText = 2;
	var adReadAll = -1;
	var charset = "iso-8859-1";
	var binary;
	var map = {
		0x20AC	:	0x80	,	//	8364	128
		0x201A	:	0x82	,	//	8218	130
		0x0192	:	0x83	,	//	402	131
		0x201E	:	0x84	,	//	8222	132
		0x2026	:	0x85	,	//	8230	133
		0x2020	:	0x86	,	//	8224	134
		0x2021	:	0x87	,	//	8225	135
		0x02C6	:	0x88	,	//	710	136
		0x2030	:	0x89	,	//	8240	137
		0x0160	:	0x8A	,	//	352	138
		0x2039	:	0x8B	,	//	8249	139
		0x0152	:	0x8C	,	//	338	140
		0x017D	:	0x8E	,	//	381	142
		0x2018	:	0x91	,	//	8216	145
		0x2019	:	0x92	,	//	8217	146
		0x201C	:	0x93	,	//	8220	147
		0x201D	:	0x94	,	//	8221	148
		0x2022	:	0x95	,	//	8226	149
		0x2013	:	0x96	,	//	8211	150
		0x2014	:	0x97	,	//	8212	151
		0x02DC	:	0x98	,	//	732	152
		0x2122	:	0x99	,	//	8482	153
		0x0161	:	0x9A	,	//	353	154
		0x203A	:	0x9B	,	//	8250	155
		0x0153	:	0x9C	,	//	339	156
		0x017E	:	0x9E	,	//	382	158
		0x0178	:	0x9F		//	376	159
	};
	stream = new ActiveXObject("ADODB.Stream");
	stream.type = adTypeText;
	stream.charset = charset;
	stream.open();
	stream.loadFromFile(this.pathname);
	text = stream.readText(adReadAll);
	stream.close();
	var out = new Array(text.length);
	for(var i = 0;i < text.length;i++) {
		var x = text.charCodeAt(i);
		if(0xFF < x) {
			out[i] = map[x];
		}
		else {
			out[i] = x;
		}
	}
	return(out);
};

// 時間すごいかかります
File.prototype.setByte = function(array_) {
	var stream;
	var text = "";
	var adTypeText = 2;
	var adSaveCreateOverWrite = 2;
	var charset = "iso-8859-1";
	var buffersize = 512;
	stream = new ActiveXObject("ADODB.Stream");
	stream.type = adTypeText;
	stream.charset = charset;
	stream.open();
	for(var i = 0;i < array_.length;) {
		text = [];
		for(var j = 0;(j < buffersize) && (i < array_.length);j++, i++) {
			text[j] = String.fromCharCode(array_[i]);
		}
		stream.writeText(text.join(""));
	}
	stream.saveToFile(this.pathname, adSaveCreateOverWrite);
	stream.close();
};

//static
File.createTempFile = function(){
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	return(new File(fso.GetTempName()));
};
File.getCurrentDirectory = function(){
	var shell = new ActiveXObject("WScript.Shell");
	return(new File(shell.CurrentDirectory));
};
File.setCurrentDirectory = function(file) {
	var shell = WScript.CreateObject ("WScript.Shell");
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	shell.CurrentDirectory = fso.getFolder(file.toString()).Name;
};
File.searchFile = function(file){
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var path = [];
	var collection = [];
	var pointer = 0;
	var list;
	var targetfolder;
	var buffer = null;
	var isTarget;
	if(typeof file !== "function") {
		buffer = file.toString();
		isTarget = function(name, fullpath) {
			return(name === buffer);
		};
	}
	else {
		isTarget = file;
	}	
	path[pointer] = File.getCurrentDirectory().getNormalizedPathName();
	targetfolder = fso.getFolder(path[pointer]);
	list = new Enumerator(fso.getFolder(targetfolder).Files);
	for(var i = 0; !list.atEnd(); list.moveNext()) {
		if(isTarget(list.item().Name, path[pointer] + list.item().Name)) {
			return(new File(path[pointer] + list.item().Name));
		}
	}
	if(targetfolder.SubFolders.Count === 0) {
		return(null);
	}
	collection[pointer] = new Enumerator(targetfolder.SubFolders);
	pointer++;
	while(true) {
		path[pointer] = path[pointer - 1] + collection[pointer - 1].item().Name + "\\";
		targetfolder = fso.getFolder(path[pointer]);
		list = new Enumerator(targetfolder.Files);
		for(; !list.atEnd(); list.moveNext()) {
			if(isTarget(list.item().Name, path[pointer] + list.item().Name)) {
				return(new File(path[pointer] + list.item().Name));
			}
		}
		if(targetfolder.SubFolders.Count === 0) {
			while(true) {
				if(pointer === 0) {
					break;
				}
				collection[pointer - 1].moveNext();
				if(collection[pointer - 1].atEnd()) {
					pointer--;
					continue;
				}
				else {
					break;
				}
			}
			if(pointer === 0) {
				break;
			}
		}
		else {
			collection[pointer] = new Enumerator(targetfolder.SubFolders);
			pointer++;
		}
	}
	return(null);
};
