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
import Format from "./Format.js";
import System from "./System.js";
 
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
		// (pathname instanceof SFile) が反応しない場合があるので以下を利用
		else if((pathname instanceof Object) && ("getAbsolutePath" in pathname)) {
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
	 * @param {boolean} [is_force=false] - 読み取り専用でも削除する
	 * @returns {boolean}
	 */
	remove(is_force) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		try {
			if(this.isFile()) {
				return this.fso.DeleteFile(this.pathname, is_force ? is_force : false );
			}
			else if(this.isDirectory()) {
				return this.fso.DeleteFolder(this.pathname, is_force ? is_force : false );
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
	 * - 移動後の `this` は、移動後のファイルを指す
	 * - `this` がファイルの場合、ディレクトリを選択すると、ディレクトリ内へファイルを移動させます
	 * - `this` がファイルの場合、ファイルを選択すると、ディレクトリの移動かつファイル名を変更します
	 * - `this` がディレクトリの場合、指定したディレクトリへファイルを移動させるため、ディレクトリ名の変更は行えません
	 * 
	 * @param {string|SFile} file_obj - 移動先のファイル名及びディレクトリ
	 * @returns {boolean}
	 */
	move(file_obj) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		const folder = new SFile(file_obj);
		try {
			if(this.isFile()) {
				if(!folder.isDirectory()) {
					// ディレクトリを指していない場合は、移動 + ファイル名の変更
					this.fso.MoveFile(this.pathname, folder.getAbsolutePath());
					this.pathname = folder.getAbsolutePath();
				}
				else {
					// 宛先がディレクトリ内へ移動になる
					this.fso.MoveFile(this.pathname, folder.getAbsolutePath() + "\\");
					this.pathname = folder.getAbsolutePath() + "/" + this.getName();
				}
				return true;
			}
			else if(this.isDirectory()) {
				// フォルダを指定したフォルダ内へ移動
				this.fso.MoveFolder(this.getAbsolutePath(), folder.getAbsolutePath() + "/");
				this.pathname = folder.getAbsolutePath() + "/" + this.getName();
				return true;
			}
			else {
				return false;
			}
		}
		catch (e) {
			console.log(e);
			return false;
		}
	}

	/**
	 * ファイル名を変更
	 * - 変更後の `this` は、変更後のファイルを指す
	 * - 引数はフルパスを渡した場合でもファイル名のみ使用する
	 * 
	 * @param {string|SFile} file_obj 変更後のファイル名
	 * @returns {boolean}
	 */
	renameTo(file_obj) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(!this.isFile() && !this.isDirectory()) {
			return false;
		}
		// `GetFile` や `GetFolder` のプロパティ `.Name` で名前を変更した場合、
		// 例えばファイル名を大文字から小文字に変更すると
		// `Scripting.FileSystemObject` の仕様によりエラーが発生する
		// そのため `MoveFile`, `MoveFolder` を使用する
		try {
			// getAbsolutePath で取得すると同一名のファイルが正しく取得できないので
			// 直接作成する
			const dst = this.getParent() + "\\" + new SFile(file_obj).getName();
			if(this.isFile()) {
				this.fso.MoveFile(this.getAbsolutePath(), dst);
			}
			else if(this.isDirectory()) {
				this.fso.MoveFolder(this.getAbsolutePath(), dst);
			}
			this.pathname = new SFile(dst).getAbsolutePath();
			return true;
		}
		catch (e) {
			console.log(e);
			return false;
		}
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
	 * - 通常のフォルダの場合は、最後の「`/`」は除去される
	 * - URLなら最後にスラッシュをつけて返す
	 * 
	 * @returns {string} 
	 */
	getParent() {
		if(this.is_http) {
			let path = this.getAbsolutePath();
			// 最後がスラッシュの場合でホスト名のみの場合は、これ以上辿れない。
			if(/^http[^/]+\/\/[^/]+\/$/.test(path)) {
				return path
			}
			// 最後がスラッシュの場合はスラッシュを除去
			if(/\/$/.test(path)) {
				path = path.substring(0 ,path.length - 1);
			}
			// フォルダ名までを削る
			return path.match(/^.*\//)[0];
		}
		else {
			// フォルダ名までのパスを取得する
			let path = this.getAbsolutePath().match(/.*[/\\]/)[0];
			// フォルダを削る
			path = path.substring(0 ,path.length - 1);
			return path;
		}
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
		const file = this.isFile() ? this.fso.GetFile(this.pathname) : this.fso.GetFolder(this.pathname);
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
			const file = this.isFile() ? this.fso.GetFile(this.pathname) : this.fso.GetFolder(this.pathname);
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
		const file = this.isFile() ? this.fso.GetFile(this.pathname) : this.fso.GetFolder(this.pathname);
		return (file.Attributes & ATTRIBUTES_HIDDEN) !== 0;
	}
	
	/**
	 * 隠しファイルかどうかを設定する
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
			const file = this.isFile() ? this.fso.GetFile(this.pathname) : this.fso.GetFolder(this.pathname);
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
		const file = this.isFile() ? this.fso.GetFile(this.pathname) : this.fso.GetFolder(this.pathname);
		// DateLastModified は VT_DATE 値なので変換する
		return new Date(file.DateLastModified);
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
		const file = this.isFile() ? this.fso.GetFile(this.pathname) : this.fso.GetFolder(this.pathname);
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
		const list = new Enumerator(this.fso.GetFolder(this.pathname).Files);
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
		const list = new Enumerator(this.fso.GetFolder(this.pathname).SubFolders);
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
					// 階層は移動しない
					continue;
				}
				if(namelist[i] === "..") {
					// 上の階層へ移動する
					name = name.substring(0 ,name.length - 1).match(/.*\//)[0];
					continue;
				}
				// フォルダ名 + "/"
				name += namelist[i];
				if(i !== namelist.length - 1) {
					name += "/";
				}
			}
			return name;
		}
		else {
			// `*:` という2文字のパスで `C` 以外を設定した場合に正しいパスを設定できない不具合がある
			// 従って、防止用に、最後にコロンが付いている場合は"C:"とかなので"C:/"としてからパスを変換する
			if(/:$/.test(this.pathname)) {
				return this.fso.GetAbsolutePathName(this.pathname + "\\");
			}
			else {
				return this.fso.GetAbsolutePathName(this.pathname);
			}
		}
	}

	/**
	 * フォルダを作成
	 * - フォルダは1つのみ指定可能
	 * - すでにフォルダがある場合はエラーを返す
	 * 
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
	 * 
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
	 * ローカル、インターネット上のファイルをテキストとして開く
	 * - 開けない場合は `null` を返す
	 * - 改行コードは `\n` に統一される
	 * 
	 * @param {string} [charset="_autodetect_all"] - 文字コード
	 * @returns {string}
	 */
	readString(charset) {
		const icharset = charset !== undefined ? charset : "_autodetect_all";
		const inewline = "\n"; //javascript上での改行
		let text = null;
		if(/^htt/.test(this.pathname)) {
			const http = System.createXMLHttpRequest();
			if(http === null) {
				console.log("createXMLHttpRequest")
				return null;
			}
			http.open("GET", this.pathname, false);
			try {
				http.send(null);
				if(http.status === 200) {
					text = http.responseText;
				}
				else {
					console.log("HTTP status codes " + http.status);
				}
			}
			catch (e) {
				console.log(e);
			}
		}
		else {
			const is_fso = /unicode|utf-16le/i.test(icharset);
			if(is_fso) {
				// Scripting.FileSystemObject で開く
				// 入出力モード = 読取専用モード
				const ForReading = 1;
				const mode = ForReading;
				// ファイルの新規作成 = 新規作成しない
				const option = false;
				// 文字のエンコード
				const TristateTrue = -1; // Unicode(UTF-16LE)
				const tristate = TristateTrue;
				try {
					const open_file = this.fso.OpenTextFile(this.pathname, mode, option, tristate );
					text = open_file.ReadAll();
					open_file.Close();
				}
				catch (e) {
					console.log(e);
				}
			}
			else {
				// 自由な文字エンコードで開く（速度は遅い）
				// 使用可能な charset については下記を参照
				// HKEY_CLASSES_ROOT\MIME\Database\Charset
				const adTypeText = 2;
				const adReadAll = -1;
				try {
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
				catch (e) {
					console.log(e);
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
	 * - 保存できなかった場合は `false` を返す
	 * - 変換先の文字コードに存在しない文字は、`"?"`に変換される
	 * 
	 * @param {string} text
	 * @param {string} [charset="utf-8"] - 文字コード
	 * @param {string} [newline="\n"] - 改行コード
	 * @param {boolean} [issetBOM=true] - BOMの有無(`utf-8`のみ有効 )
	 * @returns {boolean}
	 */
	writeString(text, charset, newline, issetBOM) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		const icharset = charset !== undefined ? charset : "utf-8";
		const inewline = newline !== undefined ? newline : "\n";
		const iissetBOM = issetBOM !== undefined ? issetBOM : true; //utf-8のみ有効 BOMありかなし
		const is_fso = /unicode|utf-16le/i.test(icharset);
		if(is_fso) {
			// Scripting.FileSystemObject で書き込む
			// 入出力モード = 上書きモード
			const ForWriting = 2;
			const mode = ForWriting;
			// ファイルの新規作成 = 作成
			const option = true;
			// 文字のエンコード
			const TristateTrue = -1; // Unicode(UTF-16LE)
			const tristate = TristateTrue;
			try {
				const open_file = this.fso.OpenTextFile(this.pathname, mode, option, tristate );
				open_file.Write(text.replace(/\r\n?|\n/g, inewline));
				open_file.Close();
			}
			catch (e) {
				console.log(e);
				return false;
			}
		}
		else {
			// ADODB.Streamで書き込む
			const adTypeBinary = 1;
			const adTypeText = 2;
			const adSaveCreateOverWrite = 2;
			try {
				// 使用可能な charset については下記を参照
				// HKEY_CLASSES_ROOT\MIME\Database\Charset
				let stream;
				stream = new ActiveXObject("ADODB.Stream");
				stream.type = adTypeText;
				stream.charset = icharset;
				stream.open();
				stream.writeText(text.replace(/\r\n?|\n/g, inewline)); //改行コードを統一
				if(/utf-8/.test(icharset.toLowerCase()) && (!iissetBOM)) {
					// バイナリ型にして3バイト目以降をバイト型で取得
					stream.position = 0;
					stream.type = adTypeBinary;
					stream.position = 3;
					const binary = stream.read();
					stream.close();
					// 取得したバイナリデータを1バイト目から書きこむ
					stream = new ActiveXObject("ADODB.Stream");
					stream.type = adTypeBinary;
					stream.open();
					stream.write(binary);
				}
				stream.saveToFile(this.pathname, adSaveCreateOverWrite);
				stream.close();
			}
			catch (e) {
				console.log(e);
				return false;
			}
		}
		return true;
	}

	/**
	 * ローカル、インターネット上のファイルをバイナリとして開く
	 * - 開けない場合は `null` を返す
	 * - 参考速度：0.5 sec/MB
	 * - 巨大なファイルの一部を調べる場合は、位置とサイズを指定した方がよい
	 * 
	 * @param {number} [offset] - 位置（※ 指定すると速度が低下する）
	 * @param {number} [size] - サイズ（※ 指定すると速度が低下する）
	 * @returns {number[]|null}
	 */
	readBinary(offset, size) {
		if(/^htt/.test(this.pathname)) {
			const http = System.createXMLHttpRequest();
			if(http === null) {
				console.log("createXMLHttpRequest")
				return null;
			}
			http.open("GET", this.pathname, false);
			let byte_array = null;
			try {
				http.send(null);
				if(http.status === 200) {
					// @ts-ignore
					byte_array = http.responseBody;
				}
				else {
					console.log("HTTP status codes " + http.status);
					return null;
				}
			}
			catch (e) {
				console.log(e);
				return null;
			}
			return System.createNumberArrayFromByteArray(byte_array);
		}
		// 位置を無指定
		if(offset === undefined) {
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
				return null;
			}
		}
		else {
			try {
				const filesize = this.length();
				if(filesize === -1) {
					console.log("filesize error");
					return null;
				}
				// 位置を指定している場合
				if(offset < 0 || filesize <= offset) {
					console.log("offset error");
					return null;
				}
				const ioffset = offset;
				let isize = size !== undefined ? size : filesize - ioffset;
				// 長さのチェック
				if(filesize < (ioffset + isize) || isize < 0) {
					isize = filesize - ioffset;
				}
				// バイト配列を読み込む
				const adTypeBinary = 1;
				const stream = new ActiveXObject("ADODB.Stream");
				stream.Type = adTypeBinary;
				stream.open();
				stream.loadFromFile(this.pathname);
				stream.position = ioffset;
				const byte_array = stream.read(isize);
				stream.close();
				return System.createNumberArrayFromByteArray(byte_array);
			}
			catch (e) {
				console.log(e);
				return null;
			}
		}
	}

	/**
	 * バイナリファイルを保存
	 * - 保存できなかった場合は `false` を返す
	 * - 参考速度：1.0 sec/MB
	 * 
	 * @param {number[]} array_
	 * @param {number} [offset] - 位置（※ 指定すると速度が低下する）
	 * @returns {boolean}
	 */
	writeBinary(array_, offset) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		// 位置を無指定
		let is_write = true;
		if((offset === undefined) || offset === 0) {
			try {
				const adTypeText = 2;
				const adSaveCreateOverWrite = 2;
				const charset = "iso-8859-1";
				const buffersize = 1024 * 128;
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
		}
		else {
			const adTypeBinary = 1;
			const adSaveCreateOverWrite = 2;
			if(!this.isFile()) {
				const byte_array = System.createByteArrayFromNumberArray(array_, offset);
				if(byte_array === null) {
					console.log("createByteArrayFromNumberArray");
					return false;
				}
				const stream = new ActiveXObject("ADODB.Stream");
				stream.Type = adTypeBinary;
				stream.open();
				stream.write(byte_array);
				stream.saveToFile(this.pathname, adSaveCreateOverWrite);
				stream.close();
			}
			try {
				const byte_array = System.createByteArrayFromNumberArray(array_);
				if(byte_array === null) {
					console.log("createByteArrayFromNumberArray");
					return false;
				}
				const stream = new ActiveXObject("ADODB.Stream");
				stream.Type = adTypeBinary;
				stream.open();
				stream.loadFromFile(this.pathname);
				stream.position = offset;
				stream.write(byte_array);
				stream.saveToFile(this.pathname, adSaveCreateOverWrite);
				stream.close();
			}
			catch (e) {
				console.log(e);
				is_write = false;
			}
		}
		return is_write;
	}

	/**
	 * ファイルのハッシュ値を計算する
	 * @param {string} [algorithm="MD5"] - アルゴリズム
	 * @returns {string} 半角英数の16進数で表したハッシュ値、失敗時は`"0"`
	 */
	getHashCode(algorithm) {
		if(this.is_http) {
			throw "IllegalMethod";
		}
		if(!this.isFile()) {
			return "0";
		}
		const algorithm_ = algorithm !== undefined ? algorithm : "MD5";
		const message = "certutil -hashfile \"" + this.getAbsolutePath() + "\" " + algorithm_.toUpperCase();
		const output = System.exec(message);
		if(output.exit_code !== 0) {
			return "0";
		}
		// 2行目を抽出する
		const hash_lines = output.out.split(/\n/);
		if(hash_lines.length <= 1) {
			return "0";
		}
		// 2種類のタイプを検知させる
		// - dcd802e3848075716e92424cfdcb9c0d (Windows 10)
		// - dc d8 02 e3 84 80 75 71 6e 92 42 4c fd cb 9c 0d (Windows8.1)
		const hash = hash_lines[1].trim().toLowerCase().match(/^(([0-9a-f]{2}){8,})|((([0-9a-f]{2} ){7,})[0-9a-f]{2})$/);
		if(hash === null) {
			return "0";
		}
		return hash[0].replace(/ /g, "");
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
		shell.CurrentDirectory = fso.GetFolder(file.getAbsolutePath()).Name;
	}

	/**
	 * フォルダの中のフォルダとファイルに対して指定した関数を実行する
	 * @param {function(SFile): boolean} func 戻り値が`false`で処理を終了。
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
		targetfolder = this.fso.GetFolder(path[pointer]);
		list = new Enumerator(this.fso.GetFolder(targetfolder).Files);
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
			targetfolder = this.fso.GetFolder(path[pointer]);
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
	 * - `from` のディレクトリ配下で条件に合ったファイルを返します
	 * - 見つかったら探索を中止します
	 * - 見つからない場合は `null` を返します
	 * 
	 * @param {string|SFile} from
	 * @param {string|SFile|RegExp|function(SFile): boolean} target
	 * 
	 * @returns {SFile|null}
	 */
	 static findFile(from, target) {
		const from_dirctrory = new SFile(from);
		/**
		 * @type {function(SFile): boolean}
		 * @private
		 */
		let isTarget;
		if(typeof target !== "function") {
			if(System.typeOf(target) === "regexp") {
				/**
				 * @type {RegExp}
				 */
				// @ts-ignore
				const reg = target;
				isTarget = function(file) {
					const result = reg.exec(file.getAbsolutePath());
					return result !== null;
				};
			}
			else {
				// @ts-ignore
				const file = new SFile(target);
				const buffer = file.getName();
				isTarget = function(file) {
					return file.getName() === buffer;
				};
			}
		}
		else {
			isTarget = target;
		}
		/**
		 * @type {SFile}
		 */
		let target_file = null;
		/**
		 * @type {function(SFile): boolean}
		 */
		const func = function(file) {
			if(isTarget(file)) {
				target_file = file;
				return false;
			}
			return true;
		};
		from_dirctrory.each(func);
		return target_file;
	}

	/**
	 * 指定した条件にあう全ファイルを探す
	 * - `from` のディレクトリ配下で条件に合ったファイル一覧を返します
	 * 
	 * @param {string|SFile} from
	 * @param {string|SFile|RegExp|function(SFile): boolean} target
	 * @returns {SFile[]}
	 */
	static findFiles(from, target) {
		const from_dirctrory = new SFile(from);
		/**
		 * @type {function(SFile): boolean}
		 * @private
		 */
		let isTarget;
		if(typeof target !== "function") {
			if(System.typeOf(target) === "regexp") {
				/**
				 * @type {RegExp}
				 */
				// @ts-ignore
				const reg = target;
				isTarget = function(file) {
					const result = reg.exec(file.getAbsolutePath());
					return result !== null;
				};
			}
			else {
				// @ts-ignore
				const file = new SFile(target);
				const buffer = file.getName();
				isTarget = function(file) {
					return file.getName() === buffer;
				};
			}
		}
		else {
			isTarget = target;
		}
		/**
		 * @type {SFile[]}
		 */
		let target_files = [];
		/**
		 * @type {function(SFile): boolean}
		 */
		const func = function(file) {
			if(isTarget(file)) {
				target_files.push(file);
				return true;
			}
			return true;
		};
		from_dirctrory.each(func);
		return target_files;
	}

	/**
	 * 圧縮する
	 * - 圧縮後のファイル名の拡張子で圧縮したい形式を指定する
	 * - Windows標準の機能を使用して圧縮する( `zip` のみ対応)
	 * - 外部ツール `7-Zip` がインストール／設定されている場合は、それを利用して圧縮する
	 * 
	 * @param {SFile|string|SFile[]|string[]} input_file 圧縮したいファイル
	 * @param {SFile|string} output_file 圧縮後のファイル名
	 * @returns {boolean} result
	 */
	static compress(input_file, output_file) {
		const compress_file = new SFile(output_file);
		// ファイルの拡張子を調べる
		let comp_type = null;
		if(compress_file.getName().toLowerCase().endsWith(".tar.gz")) {
			comp_type = "targz"
		}
		else {
			comp_type = compress_file.getExtensionName().toLowerCase();
		}
		// 利用するツールを選択する
		const tool_path = SFile.getCompressTool();
		// 圧縮したい対象のファイル一覧を作成
		const file_list_buf = Array.isArray(input_file) ? input_file : [input_file];
		/**
		 * @type {SFile[]}
		 */
		let file_list = [];
		// ファイルチェック
		for(let i = 0;i < file_list_buf.length; i++) {
			file_list[i] = new SFile(file_list_buf[i]);
			if(!(file_list[i].exists())) {
				return false;
			}
		}
		// 入力ファイル数が1つで拡張子がtarの場合
		if(file_list.length === 1 && file_list[0].getExtensionName().toLowerCase() === "tar") {
			comp_type = compress_file.getExtensionName().toLowerCase();
		}
		if(tool_path === null) {
			if(comp_type === "zip") {
				const shell = new ActiveXObject("Shell.Application");
				const fso = new ActiveXObject("Scripting.FileSystemObject");
				// ZIPファイルを作成
				compress_file.writeBinary([0x50, 0x4B, 0x05, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
				const zip = shell.NameSpace(compress_file.getAbsolutePath());
				// 1つずつデータを入れていく
				for(let i = 0; i < file_list.length; i++) {
					const name = file_list[i].getAbsolutePath();
					zip.CopyHere(name, 4);
					// コピーが終わるまで wait
					while (true) {
						System.sleep(0.1);
						try {
							const ForAppending = 8;
							fso.OpenTextFile(compress_file.getAbsolutePath(), ForAppending).Close();
							break;
						} catch (e) {
						}
					}
				}
			}
			else {
				return false;
			}
		}
		else {
			let temp_folder = null;
			// targzの場合はtarだけ作成する
			if(comp_type === "targz") {
				temp_folder = SFile.createTempFile();
				temp_folder.mkdirs();
				const name = compress_file.getName();
				const tar_file = temp_folder + "\\" + name.substr(0, name.length - ".tar.gz".length ) + ".tar";
				for(let i = 0; i < file_list.length; i++) {
					const command = "\"" + tool_path + "\" a \"" + tar_file + "\" \"" + file_list[i] + "\"";
					const result = System.run(command, System.AppWinStype.Hide, true);
					if(result) {
						temp_folder.remove();
						return false;
					}
				}
				file_list =  [ new SFile(tar_file) ];
			}
			// 上書き保存
			compress_file.remove(true);
			for(let i = 0; i < file_list.length; i++) {
				const command = "\"" + tool_path + "\" a \"" + compress_file + "\" \"" + file_list[i] + "\"";
				const result = System.run(command, System.AppWinStype.Hide, true);
				if(result) {
					if(temp_folder) {
						temp_folder.remove();
					}
					return false;
				}
			}
			// targz の場合は、一時フォルダを削除
			if(temp_folder) {
				temp_folder.remove();
			}
		}
		return true;
	}

	/**
	 * 展開する
	 * - Windows標準の機能を使用して展開する( `zip` のみ対応)
	 * - 外部ツール `7-Zip` がインストール／設定されている場合は、それを利用して展開する
	 * 
	 * @param {SFile|string} input_file 展開したいファイル
	 * @param {SFile|string} output_file 展開先のフォルダ
	 * @returns {boolean} result
	 */
	static extract(input_file, output_file) {
		let extract_file = new SFile(input_file);
		const extract_dir = new SFile(output_file);
		if(!extract_file.isFile() || !extract_dir.mkdirs()) {
			return false;
		}
		// ファイルの拡張子を調べる
		let comp_type;
		if(extract_file.getName().toLowerCase().endsWith(".tar.gz")) {
			comp_type = "targz"
		}
		else {
			comp_type = extract_file.getExtensionName().toLowerCase();
		}
		// 利用するツールを選択する
		const tool_path = SFile.getCompressTool();
		if(tool_path === null) {
			if(comp_type === "zip") {
				const shell = new ActiveXObject("Shell.Application");
				const FOF_SILENT = 0x4;
				const FOF_NOCONFIRMATION = 0x10;
				shell.NameSpace(extract_dir.getAbsolutePath()).CopyHere(
					shell.NameSpace(extract_file.getAbsolutePath()).Items(),
					FOF_SILENT | FOF_NOCONFIRMATION
				);
			}
			else {
				return false;
			}
		}
		else {
			let temp_folder = null;
			// targzの場合はgzの部分を先に回答する
			if(comp_type === "targz") {
				temp_folder = SFile.createTempFile();
				temp_folder.mkdirs();
				const command = "\"" + tool_path + "\" x -y -o\"" + temp_folder + "\\\" \"" + extract_file + "\"";
				const result = System.run(command, System.AppWinStype.Hide, true);
				if(result) {
					return false;
				}
				// 中身は1つのtarファイルのみしか想定していない
				let allfile = temp_folder.getAllFiles();
				if(allfile.length !== 1) {
					temp_folder.remove();
					return false;
				}
				extract_file = allfile[0];
			}
			const command = "\"" + tool_path + "\" x -y -o\"" + extract_dir + "\\\" \"" + extract_file + "\"";
			const result = System.run(command, System.AppWinStype.Hide, true);
			if(result) {
				if(temp_folder) {
					temp_folder.remove();
				}
				return false;
			}
			if(temp_folder) {
				temp_folder.remove();
			}
		}
		return true;
	}

	/**
	 * 圧縮／展開用のツールを設定する
	 * - このツールを利用して `compress`, `extract` が実行されます
	 * - 未設定/未インストールの場合は、Windows標準の機能のみを利用し、`zip`のみ対応します
	 * - `7-zip` のコマンドライン版 (`7za.exe`)のみ対応
	 * @param {SFile|string} tool_path ツールのファイルパス
	 * @returns {boolean} result
	 */
	 static setCompressTool(tool_path) {
		const file = new SFile(tool_path);
		if(file.isFile() && /7za\.exe/i.test(file.getName())) {
			SFile.COMPRESS_TOOL = file;
			return true;
		}
		return false;
	 }

	/**
	 * 圧縮／展開用のツールを取得する
	 * - このツールを利用して `compress`, `extract` が実行されます
	 * - 未設定/未インストールの場合は、Windows標準の機能のみを利用し、`zip`のみ対応します
	 * - 取得できない場合は `null` を返します
	 * @returns {SFile|null} result
	 */
	 static getCompressTool() {
		if(SFile.COMPRESS_TOOL !== null) {
			return SFile.COMPRESS_TOOL;
		}
		const pgfile1 = new SFile(System.getEnvironmentString("ProgramFiles") + "\\7-Zip\\7z.exe");
		if(pgfile1.isFile()) {
			return pgfile1;
		}
		const pgfile2 = new SFile(System.getEnvironmentString("ProgramFiles(x86)") + "\\7-Zip\\7z.exe");
		if(pgfile2.isFile()) {
			return pgfile2;
		}
		return null;
	 }

}

/**
 * 圧縮に使用するツール
 * @type {SFile}
 * @private
 */
// @ts-ignore
SFile.COMPRESS_TOOL = null;

