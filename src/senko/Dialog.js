/**
 * The script is part of SenkoWSH.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import System from "./System";
import SFile from "./SFile";


/**
 * ポップアップ用のオプション
 * @typedef {Object} PopupOption
 * @property {number} [secondstowait=0] タイムアウト時間(`0`で無効)
 * @property {string} [caption=""] タイトルバー
 * @property {number} [type=0] `Dialog.MB_YESNOCANCEL | Dialog.MB_DEFBUTTON3` など
 */

/**
 * 「ファイルを開く」ダイアログ用のオプション
 * @typedef {Object} OpenFileOption
 * @property {string} [initial_directory] 初期ディレクトリ(`"C:\"`など)
 * @property {string} [filter="All files(*.*)|*.*"] ファイル形式（`"画像ファイル(*.png;*.bmp)|*.png;*.bmp"`など）
 * @property {string} [title] タイトル(「`ファイルを選択してください`」など)
 */

/**
 * 「フォルダを開く」ダイアログ用のオプション
 * @typedef {Object} OpenDirectoryOption
 * @property {string} [initial_directory] 初期ディレクトリ(`"C:\"`など)
 * @property {string} [title] タイトル(「`フォルダを選択してください`」など)
 */

/**
 * 「名前を付けて保存する」ダイアログ用のオプション
 * @typedef {Object} SaveAsOption
 * @property {string} [initial_directory] 初期ディレクトリ(`"C:\"`など)
 * @property {string} [default_ext] 拡張子を省略した場合の値(`".txt"`など)
 * @property {string} [file_name] ファイル名の初期値(`"新しいファイル.txt"`など)
 * @property {string} [filter="All files(*.*)|*.*"] ファイル形式（`"画像ファイル(*.png;*.bmp)|*.png;*.bmp"`など）
 * @property {string} [title] タイトル(「`保存するファイル名を設定してください`」など)
 */

/**
 * ダイアログを扱うクラス
 */
export default class Dialog {
	
	/**
	 * ダイアログを表示する
	 * @param {string} text 
	 * @param {PopupOption} [option]
	 * @returns {number}
	 */
	static popupMessage(text, option) {
		const secondstowait = option && option.secondstowait ? option.secondstowait : 0;
		const caption = option && option.caption ? option.caption : "";
		const type = option && option.type ? option.type : 0;
		return WScript.CreateObject("WScript.Shell").Popup( text, secondstowait, caption, type );
	}

	/**
	 * ファイルを開くダイアログを表示する
	 * @param {OpenFileOption} [option]
	 * @returns {SFile|null}
	 */
	static popupOpenFile(option) {
		let command = "Add-Type -AssemblyName System.Windows.Forms;$dialog = New-Object System.Windows.Forms.OpenFileDialog;";
		command += "$dialog.Filter = \"" + ((option && option.filter) ? option.filter.replace(/"/g, "\\\"") : "All files(*.*)|*.*") + "\";";
		command += (option && option.initial_directory) ? ("$dialog.InitialDirectory = \"" + option.initial_directory.toString().replace(/"/g, "\\\"") + "\";"): "";
		command += (option && option.title) ? ("$dialog.Title = \"" + option.title.replace(/"/g, "\\\"") + "\";"): "";
		command += "if($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK){$dialog.FileName;}";
		/*
			Add-Type -AssemblyName System.Windows.Forms;
			$dialog = New-Object System.Windows.Forms.OpenFileDialog;
			...
			if($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK){
				$dialog.FileName;
			}
		*/
		const select_text = System.PowerShell(command).trim();
		if(select_text !== "") {
			return new SFile(select_text);
		}
		else {
			return null;
		}
	}

	/**
	 * フォルダを開くダイアログを表示する
	 * @param {OpenDirectoryOption} [option]
	 * @returns {SFile|null}
	 */
	static popupOpenDirectory(option) {
		const shell = new ActiveXObject("Shell.Application");
		const caption = option && option.title ? option.title : "";
		let folder;
		if(option && option.initial_directory) {
			folder = shell.BrowseForFolder(0, caption, 0, option.initial_directory);
		}
		else {
			folder = shell.BrowseForFolder(0, caption, 0);
		}
		if(folder !== null) {
			return new SFile(folder.Self.Path);
		}
		else {
			return null;
		}
	}

	/**
	 * 名前を付けて保存ダイアログを表示する
	 * @param {SaveAsOption} [option]
	 * @returns {SFile|null}
	 */
	static popupSaveAs(option) {
		let command = "Add-Type -AssemblyName System.Windows.Forms;$dialog = New-Object System.Windows.Forms.SaveFileDialog;";
		command += (option && option.default_ext) ? ("$dialog.DefaultExt = \"" + option.default_ext.replace(/"/g, "\\\"") + "\";"): "";
		command += (option && option.file_name) ? ("$dialog.FileName = \"" + option.file_name.replace(/"/g, "\\\"") + "\";"): "";
		command += (option && option.filter) ? ("$dialog.Filter = \"" + option.file_name.replace(/"/g, "\\\"") + "\";"): "";
		command += (option && option.initial_directory) ? ("$dialog.InitialDirectory = \"" + option.initial_directory.toString().replace(/"/g, "\\\"") + "\";"): "";
		command += (option && option.title) ? ("$dialog.Title = \"" + option.title.replace(/"/g, "\\\"") + "\";"): "";
		command += "$dialog.ShowHelp = $FALSE;";
		command += "$dialog.OverwritePrompt = $TRUE;";
		command += "if($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK){$dialog.FileName;}";
		/*
			Add-Type -AssemblyName System.Windows.Forms;
			$dialog = New-Object System.Windows.Forms.SaveFileDialog;
			$dialog.Title = "ファイルを指定して下さい。";
			$dialog.ShowHelp = $FALSE;
			$dialog.OverwritePrompt = $TRUE;
			if($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK){
				$dialog.FileName;
			}
		*/
		const select_text = System.PowerShell(command).trim();
		if(select_text !== "") {
			return new SFile(select_text);
		}
		else {
			return null;
		}
	}

}

/**
 * 「OK」のボタン配置
 * @type {number}
 */
Dialog.MB_OK				=  0;

/**
 * 「OK」、「キャンセル」のボタン配置
 * @type {number}
 */
Dialog.MB_OKCANCEL			=  1;

/**
 * 「中止」、「再試行」、「無視」のボタン配置
 * @type {number}
 */
Dialog.MB_ABORTRETRYIGNORE	=  2;

/**
 * 「はい」、「いいえ」、「キャンセル」のボタン配置
 * @type {number}
 */
Dialog.MB_YESNOCANCEL		=  3;

/**
 * 「はい」、「いいえ」のボタン配置
 * @type {number}
 */
Dialog.MB_YESNO				=  4;

/**
 * 「再試行」、「キャンセル」のボタン配置
 * @type {number}
 */
Dialog.MB_RETRYCANCEL		=  5;

/**
 * 中止「Stop」のアイコンのダイアログ
 * @type {number}
 */
Dialog.MB_ICONSTOP			= 16;

/**
 * 質問「?」のアイコンのダイアログ
 * @type {number}
 */
Dialog.MB_ICONQUESTION		= 32;

/**
 * 警告「!」のアイコンのダイアログ
 * @type {number}
 */
Dialog.MB_ICONWARNING		= 48;

/**
 * 情報「i」のアイコンのダイアログ
 * @type {number}
 */
Dialog.MB_ICONINFORMATION	= 64;

/**
 * 「ボタン1」を選択
 * @type {number}
 */
Dialog.MB_DEFBUTTON1	= 0x0000;

/**
 * 「ボタン2」を選択
 * @type {number}
 */
Dialog.MB_DEFBUTTON2	= 0x0100;

/**
 * 「ボタン3」を選択
 * @type {number}
 */
Dialog.MB_DEFBUTTON3	= 0x0200;

/**
 * 「ボタン4」を選択
 * @type {number}
 */
Dialog.MB_DEFBUTTON4	= 0x0300;

/**
 * タイムアウトが発生
 * @type {number}
 */
Dialog.IDTIMEOUT		= -1;

/**
 * 「OK」を選択
 * @type {number}
 */
Dialog.IDOK				= 1;

/**
 * 「キャンセル」を選択
 * @type {number}
 */
Dialog.IDCANCEL			= 2;

/**
 * 「中止」を選択
 * @type {number}
 */
Dialog.IDABORT			= 3;

/**
 * 「再試行」を選択
 * @type {number}
 */
Dialog.IDRETRY			= 4;

/**
 * 「無視」を選択
 * @type {number}
 */
Dialog.IDIGNORE			= 5;

/**
 * 「はい」を選択
 * @type {number}
 */
Dialog.IDYES			= 6;

/**
 * 「いいえ」を選択
 * @type {number}
 */
Dialog.IDNO				= 7;
