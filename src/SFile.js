/**
 * The script is part of SenkoWSH.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

export default class SFile {

	/**
	 * @param {string|SFile} pathname
	 */
	constructor(pathname) {
		if(arguments.length !== 1) {
			throw "IllegalArgumentException";
		}

		/**
		 * @type {string}
		 * @private
		 */
		this.pathname = "";

		if((typeof pathname === "string")||(pathname instanceof String)) {
			// \を/に置き換える
			this.pathname = pathname.replace(/\\/g, "/" );
		}
		else if(pathname instanceof SFile) {
			this.pathname = pathname.getAbsolutePath();
		}
		else {
			throw "IllegalArgumentException";
		}
		
		/**
		 * @type {boolean}
		 * @private
		 */
		this.is_http = /^htt/.test(this.pathname);

		/**
		 * @type {any}
		 * @private
		 */
		this.fso = new ActiveXObject("Scripting.FileSystemObject");
	}

	/**
	 * @returns {boolean}
	 */
	remove() {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(this.isFile()) {
			return this.fso.DeleteFile(this.pathname);
		}
		else if(this.isDirectory()) {
			return this.fso.DeleteFolder(this.pathname);
		}
	}

	/**
	 * @returns {boolean}
	 */
	exists() {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		let out = this.isFile();
		if(out === false) {
			out = this.isDirectory();
		}
		return out;
	}

	/**
	 * @param {string|SFile} file_obj
	 * @returns {boolean}
	 */
	copy(file_obj) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		const file = new SFile(file_obj);
		if(this.isFile()) {
			return this.fso.CopyFile(this.pathname, file.getAbsolutePath(), true);
		}
		else if(this.isDirectory()) {
			return this.fso.CopyFolder(this.pathname, file.getAbsolutePath(), true);
		}
		else {
			return false;
		}
	}

	/**
	 * @param {string|SFile} file_obj
	 * @returns {boolean}
	 */
	move(file_obj) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		const file = new SFile(file_obj);
		if(this.isFile()) {
			this.fso.MoveFile(this.pathname, file.getAbsolutePath());
			this.pathname = file.getAbsolutePath();
			return true;
		}
		else if(this.isDirectory()) {
			this.fso.MoveFolder(this.pathname, file.getAbsolutePath());
			this.pathname = file.getAbsolutePath();
			return true;
		}
		else {
			return false;
		}
	}

	/**
	 * @param {string|SFile} file_obj
	 * @returns {boolean}
	 */
	renameTo(file_obj) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		const name = new SFile(file_obj);
		if(this.isFile()) {
			// 例えばファイル名を大文字から小文字に変換といった場合、
			// Scripting.FileSystemObject の仕様によりエラーが発生するため、
			// 別のファイル名を経由する
			const file = this.fso.getFile(this.pathname);
			const key = ((Math.random() * 0x7FFFFFFF) & 0x7FFFFFFF).toString(16);
			file.Name = name.getName() + key;
			file.Name = name.getName();
			this.pathname = name.getAbsolutePath();
			return true;
		}
		else if(this.isDirectory()) {
			const file = this.fso.getFolder(this.pathname);
			const key = ((Math.random() * 0x7FFFFFFF) & 0x7FFFFFFF).toString(16);
			file.Name = name.getName() + key;
			file.Name = name.getName();
			this.pathname = name.getAbsolutePath();
			return true;
		}
		else {
			return false;
		}
	}

	/**
	 * @returns {string}
	 */
	toString() {
		return this.getAbsolutePath();
	}

	/**
	 * @returns {string}
	 */
	getName() {
		if(this.is_http) {
			// 最後がスラッシュで終えている場合は、ファイル名取得できない
			if(this.isDirectory()) {
				return "";
			}
			const slashsplit = this.pathname.split("/");
			return slashsplit[slashsplit.length - 1];
		}
		else {
			return this.fso.GetFileName(this.pathname);
		}
	}

	/**
	 * 親フォルダの絶対パス名
	 * @returns {string}
	 */
	getParent() {
		const x = this.getAbsolutePath().match(/.*[/\\]/)[0];
		return x.substring(0 ,x.length - 1);
	}

	/**
	 * @returns {SFile}
	 */
	getParentFile() {
		return new SFile(this.getParent());
	}

	/**
	 * @returns {string}
	 */
	getExtensionName() {
		if(this.is_http) {
			const dotlist = this.getName().split(".");
			return dotlist[dotlist.length - 1];
		}
		else {
			return this.fso.GetExtensionName(this.pathname);
		}
	}

	/**
	 * @returns {boolean}
	 */
	isAbsolute() {
		if(this.is_http) {
			return this.getAbsolutePath() === this.pathname;
		}
		else {
			const name = this.pathname.replace("/", "\\");
			return this.fso.GetAbsolutePathName(this.pathname) === name;
		}
	}

	/**
	 * @returns {boolean}
	 */
	isDirectory() {
		if(this.is_http) {
			// 最後がスラッシュで終えている場合はディレクトリ
			return /\/$/.test(this.pathname);
		}
		else {
			return this.fso.FolderExists(this.pathname);
		}
	}

	/**
	 * @returns {boolean}
	 */
	isFile() {
		if(this.is_http) {
			// 最後がスラッシュで終えていない場合はファイル
			return /[^/]$/.test(this.pathname);
		}
		else {
			return this.fso.FileExists(this.pathname);
		}
	}

	/**
	 * @returns {boolean}
	 */
	isHidden() {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(this.isFile()) {
			const file = this.fso.getFile(this.pathname);
			return (file.Attributes & 2) !== 0;
		}
		else if(this.isDirectory()) {
			const folder = this.fso.getFolder(this.pathname);
			return (folder.Attributes & 2) !== 0;
		}
		else {
			return false;
		}
	}

	/**
	 * @returns {Date}
	 */
	lastModified() {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(this.isFile()) {
			return new Date(this.fso.getFile(this.pathname).DateLastModified);
		}
		else if(this.isDirectory()) {
			return new Date(this.fso.getFolder(this.pathname).DateLastModified);
		}
		else {
			return null;
		}
	}

	/**
	 * @param {Date} date
	 * @returns {boolean}
	 */
	setLastModified(date) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(this.isFile()) {
			const shell = new ActiveXObject("Shell.Application");
			const folder = shell.NameSpace(this.getParent());
			const file = folder.ParseName(this.getName());
			const date_string =
				date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + (date.getDate()) + " " +
				date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
			file.ModifyDate = date_string;
			return true;
		}
		else if(this.isDirectory()) {
			return false;
		}
	}

	/**
	 * @returns {number}
	 */
	length() {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(this.isFile()) {
			return this.fso.getFile(this.pathname).Size;
		}
		else if(this.isDirectory()) {
			return this.fso.getFolder(this.pathname).Size;
		}
		else {
			return -1;
		}
	}

	/**
	 * @returns {string[]}
	 */
	getFiles() {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(!this.isDirectory) {
			return null;
		}
		const out = [];
		const list = new Enumerator(this.fso.getFolder(this.pathname).Files);
		for(let i = 0; !list.atEnd(); list.moveNext()) {
			out[i++] = list.item().Name;
		}
		return out;
	}

	/**
	 * @returns {string[]}
	 */
	getSubFolders() {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(!this.isDirectory) {
			return null;
		}
		const out = [];
		const list = new Enumerator(this.fso.getFolder(this.pathname).SubFolders);
		for(let i = 0; !list.atEnd(); list.moveNext()) {
			out[i++] = list.item().Name;
		}
		return out;
	}

	/**
	 * @returns {string}
	 */
	getNormalizedPathName() {
		if(this.pathname === "") {
			return ".\\";
		}
		let name = this.pathname.replace(/\//g, "\\");
		if(name.slice(-1) !== "\\") {
			name += "\\";
		}
		return name;
	}

	/**
	 * @returns {string[]}
	 */
	getAllFiles() {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(!this.isDirectory) {
			return null;
		}
		const out = [];
		const path = [];
		const collection = [];
		let pointer = 0;
		let list;
		let targetfolder;
		path[pointer] = this.getNormalizedPathName();
		targetfolder = this.fso.getFolder(path[pointer]);
		list = new Enumerator(this.fso.getFolder(targetfolder).Files);
		for(; !list.atEnd(); list.moveNext()) {
			out.push(path[pointer] + list.item().Name);
		}
		if(targetfolder.SubFolders.Count === 0) {
			return out;
		}
		collection[pointer] = new Enumerator(targetfolder.SubFolders);
		pointer++;
		while(true) {
			path[pointer] = path[pointer - 1] + collection[pointer - 1].item().Name;
			out.push(path[pointer]);
			path[pointer] += "\\";
			targetfolder = this.fso.getFolder(path[pointer]);
			list = new Enumerator(targetfolder.Files);
			for(; !list.atEnd(); list.moveNext()) {
				out.push(path[pointer] + list.item().Name);
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
		return out;
	}

	/**
	 * @returns {string[]}
	 */
	list() {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(!this.isDirectory) {
			return null;
		}
		const files = this.getFiles();
		const subfolders = this.getSubFolders();
		const out = [];
		for(let j = 0; j < subfolders.length;) {
			out.push(subfolders[j++]);
		}
		for(let j = 0; j < files.length;) {
			out.push(files[j++]);
		}
		return out;
	}

	/**
	 * @returns {string}
	 */
	getAbsolutePath() {
		if(this.is_http) {
			// ホストとファイルに分ける
			const hosttext = this.pathname.match(/^http[^/]+\/\/[^/]+\//)[0];
			const filetext = this.pathname.substr(hosttext.length);
			// パスを1つずつ解析しながら辿っていく
			let name = hosttext;
			const namelist = filetext.split("/");
			let i;
			for(i = 0; i < namelist.length; i++) {
				if((namelist[i] === "") || (namelist[i] === ".")) {
					continue;
				}
				if(namelist[i] === "..") {
					name = name.substring(0 ,name.length - 1).match(/.*\//)[0];
					continue;
				}
				name += namelist[i];
				if(i !== namelist.length - 1) {
					name += "/";
				}
			}
			return name;
		}
		else {
			return this.fso.GetAbsolutePathName(this.pathname);
		}
	}

	/**
	 * @returns {boolean}
	 */
	mkdir() {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		const filename = this.getAbsolutePath();
		if(this.fso.FileExists(filename)) {
			// ファイルがあるため、フォルダを作れない
			return false;
		}
		else if(this.fso.FolderExists(filename)) {
			// フォルダが既にあるため、TRUEで返す
			return true;
		}
		// フォルダがないので作成する
		this.fso.CreateFolder(filename);
		// 10秒間作られるまで待つ
		for(let i = 0; i < (20 * 10); i++) {
			if(this.fso.FolderExists(filename)) {
				return true;
			}
			WScript.Sleep(50); // 50ms
		}
		// いつまで待ってもフォルダが作られないので失敗
		return false;
	}

	/**
	 * @returns {boolean}
	 */
	mkdirs() {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		const name = this.pathname.replace("/", "\\").split("\\");
		let dir  = "";
		for(let i = 0; i < name.length; i++) {
			dir += name[i];
			if(!(new SFile(dir)).mkdir()) {
				return false;
			}
			dir += "\\";
		}
		return true;
	}

	/**
	 * @returns {void}
	 */
	run() {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		const objWShell = new ActiveXObject("WScript.Shell");
		const NormalFocus = 1;
		// @ts-ignore
		objWShell.Run(this.getAbsolutePath(), NormalFocus, false);
	}

	/**
	 * @param {string} text
	 * @returns {boolean}
	 */
	writeLine(text) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		let file;
		if(this.isFile()) {
			const ForAppending = 8;
			file = this.fso.OpenTextFile(this.pathname, ForAppending);
		}
		else if(this.isDirectory()) {
			return false;
		}
		else {
			file = this.fso.CreateTextFile(this.pathname, true);
		}
		file.WriteLine(text);
		file.Close();
		return true;
	}

	/**
	 * @param {string} [charset="_autodetect_all"]
	 * @param {string} [newline="\n"]
	 * @returns {string}
	 */
	getText(charset, newline) {
		const icharset = charset !== undefined ? charset : "_autodetect_all";
		const inewline = newline !== undefined ? newline :  "\n"; //javascript上での改行
		let text = null;
		if(/^htt/.test(this.pathname)) {
			const http = SFile.createXMLHttpRequest();
			if(http === null) {
				return null;
			}
			http.open("GET", this.pathname, false);
			try {
				http.send(null);
				text = http.responseText;
			}
			catch (e) {
				text = "error";
			}
		}
		else {
			// 使用可能な charset については下記を参照
			// HKEY_CLASSES_ROOT\MIME\Database\Charset
			const adTypeText = 2;
			const adReadAll = -1;
			const stream = new ActiveXObject("ADODB.Stream");
			stream.type = adTypeText;
			stream.charset = icharset;
			stream.open();
			stream.loadFromFile(this.pathname);
			text = stream.readText(adReadAll);
			stream.close();
			// 文字コードが自動取得の場合、BOMまで読み込んでしまうのを防止する
			if((icharset === "_autodetect_all")||(icharset === "_autodetect")) {
				let newcharset = "";
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
					const stream = new ActiveXObject("ADODB.Stream");
					stream.type = adTypeText;
					stream.charset = newcharset;
					stream.open();
					stream.loadFromFile(this.pathname);
					text = stream.readText(adReadAll);
					stream.close();
				}
				// BOM付きutf-8 でも BOM付きutf-16le と判定した場合の対処
				if((text.length > 1) && (text.charCodeAt(0) === 0xbbef)) {
					const stream = new ActiveXObject("ADODB.Stream");
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
			return text.replace(/\r\n?|\n/g, inewline); //改行コードを統一
		}
		else {
			return null;
		}
	}

	/**
	 * @param {string} text
	 * @param {string} [charset="utf-8"]
	 * @param {string} [newline="\r\n"]
	 * @param {boolean} [issetBOM=false]
	 * @returns {boolean}
	 */
	setText(text, charset, newline, issetBOM) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		const icharset = charset !== undefined ? charset : "_autodetect_all";
		const inewline = newline !== undefined ? newline : "\n";
		const iissetBOM = issetBOM !== undefined ? issetBOM : false; //utf-8のみ有効 BOMありかなし
		const adTypeBinary = 1;
		const adTypeText = 2;
		const adSaveCreateOverWrite = 2;
		// 使用可能な charset については下記を参照
		// HKEY_CLASSES_ROOT\MIME\Database\Charset
		let stream;
		stream = new ActiveXObject("ADODB.Stream");
		stream.type = adTypeText;
		stream.charset = icharset;
		stream.open();
		stream.writeText(text.replace(/\r\n?|\n/g, inewline)); //改行コードを統一
		if(/utf-8/.test(icharset.toLowerCase()) && (!iissetBOM)) {
			stream.position = 0;
			stream.type = adTypeBinary;
			stream.position = 3;
			const binary = stream.read();
			stream.close();
			stream = new ActiveXObject("ADODB.Stream");
			stream.type = adTypeBinary;
			stream.open();
			stream.write(binary);
		}
		stream.saveToFile(this.pathname, adSaveCreateOverWrite);
		stream.close();
		return true;
	}

	/**
	 * @returns {number[]}
	 */
	getByte() {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		const adTypeText = 2;
		const adReadAll = -1;
		const charset = "iso-8859-1";
		
		/**
		 * @type {Object<number, number>}
		 * @private
		 */
		const map = {
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
		const stream = new ActiveXObject("ADODB.Stream");
		stream.type = adTypeText;
		stream.charset = charset;
		stream.open();
		stream.loadFromFile(this.pathname);
		const text = stream.readText(adReadAll);
		stream.close();
		const out = new Array(text.length);
		for(let i = 0;i < text.length;i++) {
			const x = text.charCodeAt(i);
			if(0xFF < x) {
				out[i] = map[x];
			}
			else {
				out[i] = x;
			}
		}
		return out;
	}

	/**
	 * 時間すごいかかります
	 * @param {number[]} array_
	 */
	setByte(array_) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		const adTypeText = 2;
		const adSaveCreateOverWrite = 2;
		const charset = "iso-8859-1";
		const buffersize = 512;
		const stream = new ActiveXObject("ADODB.Stream");
		stream.type = adTypeText;
		stream.charset = charset;
		stream.open();
		for(let i = 0;i < array_.length;) {
			const text = [];
			for(let j = 0; (j < buffersize) && (i < array_.length); j++, i++) {
				text[j] = String.fromCharCode(array_[i]);
			}
			stream.writeText(text.join(""));
		}
		stream.saveToFile(this.pathname, adSaveCreateOverWrite);
		stream.close();
	}

	/**
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
			let i;
			for(i = 0; i < MSXMLHTTP.length; i++) {
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
	 * @returns {SFile}
	 */
	static createTempFile() {
		const TemporaryFolder = 2;
		const fso = new ActiveXObject("Scripting.FileSystemObject");
		// テンポラリフォルダ内の適当なファイル名を取得します
		return new SFile(fso.GetSpecialFolder(TemporaryFolder) + "\\" + fso.GetTempName());
	}

	/**
	 * @returns {SFile}
	 */
	static getCurrentDirectory() {
		const shell = new ActiveXObject("WScript.Shell");
		return new SFile(shell.CurrentDirectory);
	}

	/**
	 * @param {string|SFile} file_obj
	 */
	static setCurrentDirectory(file_obj) {
		const file = new SFile(file_obj);
		const shell = WScript.CreateObject ("WScript.Shell");
		const fso = new ActiveXObject("Scripting.FileSystemObject");
		shell.CurrentDirectory = fso.getFolder(file.getAbsolutePath()).Name;
	}

	/**
	 * @param {string|SFile|function(string, string): boolean} file_obj
	 */
	static searchFile(file_obj) {
		const fso = new ActiveXObject("Scripting.FileSystemObject");
		const path = [];
		const collection = [];
		let pointer = 0;
		let list;
		let targetfolder;
		/**
		 * @type {function(string, string): boolean}
		 * @private
		 */
		let isTarget;
		if(typeof file_obj !== "function") {
			const file = new SFile(file_obj);
			const buffer = file.getName();
			isTarget = function(name, fullpath) {
				return name === buffer;
			};
		}
		else {
			isTarget = file_obj;
		}
		path[pointer] = SFile.getCurrentDirectory().getNormalizedPathName();
		targetfolder = fso.getFolder(path[pointer]);
		list = new Enumerator(fso.getFolder(targetfolder).Files);
		for(let i = 0; !list.atEnd(); list.moveNext()) {
			if(isTarget(list.item().Name, path[pointer] + list.item().Name)) {
				return new SFile(path[pointer] + list.item().Name);
			}
		}
		if(targetfolder.SubFolders.Count === 0) {
			return null;
		}
		collection[pointer] = new Enumerator(targetfolder.SubFolders);
		pointer++;
		while(true) {
			path[pointer] = path[pointer - 1] + collection[pointer - 1].item().Name + "\\";
			targetfolder = fso.getFolder(path[pointer]);
			list = new Enumerator(targetfolder.Files);
			for(; !list.atEnd(); list.moveNext()) {
				if(isTarget(list.item().Name, path[pointer] + list.item().Name)) {
					return new SFile(path[pointer] + list.item().Name);
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
		return null;
	}

}
