import Format from "./Format.js";

/**
 * The script is part of SenkoWSH.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

/**
 * ファイル／フォルダ／URLを扱うクラス
 */
export default class SFile {

	/**
	 * 初期化
	 * @param {string|SFile} pathname ファイル名／フォルダ名／URLアドレス
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
	 * ファイルの削除（ゴミ箱には入りません）
	 * @param {boolean} is_force - 読み取り専用でも削除する
	 * @returns {boolean}
	 */
	remove(is_force) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		try {
			if(is_force) {
				// 読み取り専用をオフにする
				this.setReadOnly(false, true);
			}
			if(this.isFile()) {
				return this.fso.DeleteFile(this.pathname);
			}
			else if(this.isDirectory()) {
				return this.fso.DeleteFolder(this.pathname);
			}
		}
		catch (e) {
			console.log(e);
			return false;
		}
	}

	/**
	 * ファイルが存在するか
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
	 * ファイルのコピー
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
	 * ファイルの移動
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
	 * ファイル名を変更
	 * @param {string|SFile} file_obj
	 * @returns {boolean}
	 */
	renameTo(file_obj) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(!this.isFile() && !this.isDirectory()) {
			return false;
		}
		const file = this.isFile() ? this.fso.getFile(this.pathname) : this.fso.getFolder(this.pathname);
		const name = new SFile(file_obj);
		// 例えばファイル名を大文字から小文字に変換といった場合、
		// Scripting.FileSystemObject の仕様によりエラーが発生するため、
		// 別のファイル名を経由する
		const key = ((Math.random() * 0x7FFFFFFF) & 0x7FFFFFFF).toString(16);
		file.Name = name.getName() + key;
		file.Name = name.getName();
		this.pathname = name.getAbsolutePath();
		return true;
	}

	/**
	 * 文字列化
	 * @returns {string}
	 */
	toString() {
		return this.getAbsolutePath();
	}

	/**
	 * 名前を取得
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
	 * 親フォルダの絶対パス
	 * @returns {string}
	 */
	getParent() {
		const x = this.getAbsolutePath().match(/.*[/\\]/)[0];
		return x.substring(0 ,x.length - 1);
	}

	/**
	 * 親フォルダ
	 * @returns {SFile}
	 */
	getParentFile() {
		return new SFile(this.getParent());
	}

	/**
	 * 拡張子（ドットを含まない）
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
	 * 絶対パスかどうか
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
	 * フォルダかどうか
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
	 * ファイルかどうか
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
	 * 読み取り専用ファイルかどうか
	 * @returns {boolean}
	 */
	isReadOnly() {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(!this.isFile() && !this.isDirectory()) {
			return false;
		}
		const ATTRIBUTES_READONLY = 1;
		const file = this.isFile() ? this.fso.getFile(this.pathname) : this.fso.getFolder(this.pathname);
		return (file.Attributes & ATTRIBUTES_READONLY) !== 0;
	}
	
	/**
	 * 読み取り専用ファイルかどうかを設定する
	 * @param {boolean} is_readonly
	 * @param {boolean} [is_allfiles=false]
	 * @returns {boolean}
	 */
	setReadOnly(is_readonly, is_allfiles) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(!this.isFile() && !this.isDirectory()) {
			return false;
		}
		try {
			const ATTRIBUTES_READONLY = 1;
			const file = this.isFile() ? this.fso.getFile(this.pathname) : this.fso.getFolder(this.pathname);
			if(is_readonly) {
				file.Attributes = file.Attributes | ATTRIBUTES_READONLY;
			}
			else {
				file.Attributes = file.Attributes & ~ATTRIBUTES_READONLY;
			}
		}
		catch (e) {
			console.log(e);
			return false;
		}
		if(this.isFile() || !is_allfiles) {
			return true;
		}
		let ret = true;
		/**
		 * @type {function(SFile): boolean}
		 */
		const func = function(file) {
			ret = ret && file.setReadOnly(is_readonly, false);
			return true;
		};
		this.each(func);
		return ret;
	}

	/**
	 * 隠しファイルかどうか
	 * @returns {boolean}
	 */
	isHidden() {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(!this.isFile() && !this.isDirectory()) {
			return false;
		}
		const ATTRIBUTES_HIDDEN = 2;
		const file = this.isFile() ? this.fso.getFile(this.pathname) : this.fso.getFolder(this.pathname);
		return (file.Attributes & ATTRIBUTES_HIDDEN) !== 0;
	}
	
	/**
	 *隠しファイルかどうかを設定する
	 * @param {boolean} is_hidden
	 * @param {boolean} [is_allfiles=false]
	 * @returns {boolean}
	 */
	setHidden(is_hidden, is_allfiles) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(!this.isFile() && !this.isDirectory()) {
			return false;
		}
		try {
			const ATTRIBUTES_HIDDEN = 2;
			const file = this.isFile() ? this.fso.getFile(this.pathname) : this.fso.getFolder(this.pathname);
			if(is_hidden) {
				file.Attributes = file.Attributes | ATTRIBUTES_HIDDEN;
			}
			else {
				file.Attributes = file.Attributes & ~ATTRIBUTES_HIDDEN;
			}
		}
		catch (e) {
			console.log(e);
			return false;
		}
		if(this.isFile() || !is_allfiles) {
			return true;
		}
		let ret = true;
		/**
		 * @type {function(SFile): boolean}
		 */
		const func = function(file) {
			ret = ret && file.setHidden(is_hidden, false);
			return true;
		};
		this.each(func);
		return ret;
	}

	/**
	 * 更新日を取得
	 * @returns {Date}
	 */
	lastModified() {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(!this.isFile() && !this.isDirectory()) {
			return null;
		}
		const file = this.isFile() ? this.fso.getFile(this.pathname) : this.fso.getFolder(this.pathname);
		return file.DateLastModified;
	}

	/**
	 * 更新日を設定（ファイルのみ対応）
	 * @param {Date} date
	 * @returns {boolean}
	 */
	setLastModified(date) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(!this.isFile()) {
			return false;
		}
		try {
			const shell = new ActiveXObject("Shell.Application");
			const folder = shell.NameSpace(this.getParent());
			const file = folder.ParseName(this.getName());
			const date_string = Format.datef("YYYY/MM/DD hh:mm:ss", date);
			file.ModifyDate = date_string;
			return true;
		}
		catch (e) {
			console.log(e);
			return false;
		}
	}

	/**
	 * ファイルサイズ
	 * @returns {number}
	 */
	length() {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(!this.isFile() && !this.isDirectory()) {
			return -1;
		}
		const file = this.isFile() ? this.fso.getFile(this.pathname) : this.fso.getFolder(this.pathname);
		return file.Size;
	}

	/**
	 * 配下のファイル名の一覧を取得
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
	 * 配下のサブフォルダ名の一覧を取得
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
	 * 区切り文字と終端を正規化した文字列を取得
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
	 * 配下のファイル名とフォルダ名を取得
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
	 * 絶対パスを取得
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
	 * フォルダを作成
	 * - フォルダは1つのみ指定可能
	 * - すでにフォルダがある場合はエラーを返す。
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
	 * フォルダを作成
	 * - 作成したいフォルダを続けて記載が可能
	 * - フォルダがない場合はフォルダを作成していく
	 * @returns {boolean}
	 */
	mkdirs() {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		const name = this.pathname.replace(/\//g, "\\").split("\\");
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
	 * 実行ファイルを起動する
	 * @param {number} [style=1] - 起動オプション
	 * @param {boolean} [is_wait=false] - プロセスが終了するまで待つ
	 * @returns {void}
	 */
	run(style, is_wait) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		const NormalFocus = 1;
		const intWindowStyle = style !== undefined ? style : NormalFocus;
		const bWaitOnReturn = is_wait !== undefined ? is_wait : false;
		const objWShell = new ActiveXObject("WScript.Shell");
		// @ts-ignore
		objWShell.Run(this.getAbsolutePath(), intWindowStyle, bWaitOnReturn);
	}

	/**
	 * 1行書き加える
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
	 * テキストファイルを開く
	 * @param {string} [charset="_autodetect_all"] - 文字コード
	 * @returns {string}
	 */
	getTextFile(charset) {
		const icharset = charset !== undefined ? charset : "_autodetect_all";
		const inewline = "\n"; //javascript上での改行
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
				console.log(e);
				text = "error";
			}
		}
		else {
			if(/shift_jis|sjis|ascii|unicode|utf-16le/i.test(icharset)) {
				// Scripting.FileSystemObject で開く
				const forreading = 1;
				let tristate = 0;
				if(/ascii/i.test(icharset)) {
					// ASCII
					tristate = 0;
				}
				else if(/shift_jis|sjis/i.test(icharset)) {
					// システムのデフォルト(日本語のOSだと仮定)
					tristate = -2;
				}
				else {
					// utf-16le
					tristate = -1;
				}
				const open_file = this.fso.OpenTextFile(this.pathname, forreading, true, tristate );
				text = open_file.ReadAll();
				open_file.Close();
			}
			else {
				// より自由なコードで開く（速度は遅い）
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
		}
		if(text !== null) {
			return text.replace(/\r\n?|\n/g, inewline); //改行コードを統一
		}
		else {
			return null;
		}
	}

	/**
	 * テキストファイルを保存
	 * @param {string} text
	 * @param {string} [charset="utf-8"] - 文字コード
	 * @param {string} [newline="\n"] - 改行コード
	 * @param {boolean} [issetBOM=true] - BOMの有無(utf-8のみ有効 )
	 * @returns {boolean}
	 */
	setTextFile(text, charset, newline, issetBOM) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		const icharset = charset !== undefined ? charset : "utf-8";
		const inewline = newline !== undefined ? newline : "\n";
		const iissetBOM = issetBOM !== undefined ? issetBOM : true; //utf-8のみ有効 BOMありかなし
		if(/shift_jis|sjis|ascii|unicode|utf-16le/i.test(icharset)) {
			// Scripting.FileSystemObject で書き込む
			const forwriting = 2;
			let tristate = 0;
			if(/ascii/i.test(icharset)) {
				// ASCII
				tristate = 0;
			}
			else if(/shift_jis|sjis/i.test(icharset)) {
				// システムのデフォルト(日本語のOSだと仮定)
				tristate = -2;
			}
			else {
				// utf-16le
				tristate = -1;
			}
			const open_file = this.fso.OpenTextFile(this.pathname, forwriting, true, tristate );
			open_file.Write(text.replace(/\r\n?|\n/g, inewline));
			open_file.Close();
		}
		else {
			// ADODB.Streamで書き込む
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
		}
		return true;
	}

	/**
	 * バイナリファイルを開く（激重）
	 * @returns {number[]}
	 */
	getBinaryFile() {
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
		try {
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
		catch (e) {
			console.log(e);
			return [];
		}
	}

	/**
	 * バイナリファイルを保存（激重）
	 * @param {number[]} array_
	 * @returns {boolean}
	 */
	setBinaryFile(array_) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		let is_write = true;
		const adTypeText = 2;
		const adSaveCreateOverWrite = 2;
		const charset = "iso-8859-1";
		const buffersize = 512;
		try {
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
		catch (e) {
			console.log(e);
			is_write = false;
		}
		return is_write;
	}

	/**
	 * XMLHttpRequestを作成
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
	 * テンポラリフォルダ内の適当なファイル名を取得
	 * @returns {SFile}
	 */
	static createTempFile() {
		const TemporaryFolder = 2;
		const fso = new ActiveXObject("Scripting.FileSystemObject");
		// テンポラリフォルダ内の適当なファイル名を取得します
		return new SFile(fso.GetSpecialFolder(TemporaryFolder) + "\\" + fso.GetTempName());
	}

	/**
	 * カレントディレクトリを取得
	 * @returns {SFile}
	 */
	static getCurrentDirectory() {
		const shell = new ActiveXObject("WScript.Shell");
		return new SFile(shell.CurrentDirectory);
	}

	/**
	 * カレントディレクトリを設定
	 * @param {string|SFile} file_obj
	 */
	static setCurrentDirectory(file_obj) {
		const file = new SFile(file_obj);
		const shell = WScript.CreateObject ("WScript.Shell");
		const fso = new ActiveXObject("Scripting.FileSystemObject");
		shell.CurrentDirectory = fso.getFolder(file.getAbsolutePath()).Name;
	}

	/**
	 * フォルダの中のフォルダとファイルに対して指定した関数を実行する
	 * @param {function(SFile): boolean} func 戻り値がfalseで処理を終了。
	 * @returns {boolean} result
	 */
	each(func) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(!this.isDirectory) {
			return func.call(func, this);
		}
		const path = [];
		const collection = [];
		let file;
		let pointer = 0;
		let list;
		let targetfolder;
		path[pointer] = this.getNormalizedPathName();

		// 1階層目を処理する
		targetfolder = this.fso.getFolder(path[pointer]);
		list = new Enumerator(this.fso.getFolder(targetfolder).Files);
		for(; !list.atEnd(); list.moveNext()) {
			file = new SFile(path[pointer] + list.item().Name);
			if(!func.call(func, file)) {
				return false;
			}
		}

		// 2階層目以降を処理する
		if(targetfolder.SubFolders.Count === 0) {
			return false;
		}
		collection[pointer] = new Enumerator(targetfolder.SubFolders);
		pointer++;
		while(true) {
			path[pointer] = path[pointer - 1] + collection[pointer - 1].item().Name;
			file = new SFile(path[pointer]);
			if(!func.call(func, file)) {
				return false;
			}
			path[pointer] += "\\";
			targetfolder = this.fso.getFolder(path[pointer]);
			list = new Enumerator(targetfolder.Files);
			for(; !list.atEnd(); list.moveNext()) {
				file = new SFile(path[pointer] + list.item().Name);
				if(!func.call(func, file)) {
					return false;
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
		return true;
	}

	/**
	 * サブフォルダの中まで探索して全てのファイルとフォルダを取得
	 * @returns {SFile[]}
	 */
	getAllFiles() {
		/**
		 * @type {SFile[]}
		 */
		const out = [];
		/**
		 * @type {function(SFile): boolean}
		 */
		const func = function(file) {
			out.push(file);
			return true;
		};
		this.each(func);
		return out;
	}

	/**
	 * 指定した条件にあうファイルを探す
	 * 関数を指定する場合は、ファイル名とフルパスが引数に渡されます
	 * @param {string|SFile|function(string, string): boolean} file_obj
	 * @returns {SFile|null}
	 */
	searchFile(file_obj) {
		let target_file = null;
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
		/**
		 * @type {function(SFile): boolean}
		 */
		const func = function(file) {
			if(isTarget(file.getName(), file.getAbsolutePath())) {
				target_file = file;
				return false;
			}
			return true;
		};
		this.each(func);
		return target_file;
	}

}
