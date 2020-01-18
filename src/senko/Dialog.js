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


/**
 * ポップアップ用のオプション
 * @typedef {Object} PopupOption
 * @property {number} [secondstowait=0] タイムアウト時間(0で無効)
 * @property {string} [caption=""] タイトルバー
 * @property {number} [type=0] Dialog.MB_YESNOCANCEL | Dialog.MB_DEFBUTTON3 など
 */

/**
 * 「開く」ダイアログ用のオプション
 * @typedef {Object} OpenOption
 * @property {string} [initial_directory] 初期ディレクトリ("C:\"など)
 * @property {string} [filter="All files(*.*)|*.*"] ファイル形式（"画像ファイル(*.png;*.bmp)|*.png;*.bmp"など）
 * @property {string} [title] タイトル(「ファイルを選択してください」など)
 */

/**
 * 「名前を付けて保存する」ダイアログ用のオプション
 * @typedef {Object} SaveAsOption
 * @property {string} [initial_directory] 初期ディレクトリ("C:\"など)
 * @property {string} [default_ext] 拡張子を省略した場合の値(".txt"など)
 * @property {string} [file_name] ファイル名の初期値("新しいファイル.txt"など)
 * @property {string} [filter="All files(*.*)|*.*"] ファイル形式（"画像ファイル(*.png;*.bmp)|*.png;*.bmp"など）
 * @property {string} [title] タイトル(「保存するファイル名を設定してください」など)
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
	 * 開くダイアログを表示する
	 * @param {OpenOption} [option]
	 * @returns {string}
	 */
	static popupOpen(option) {
		/*
		以下の行を1行で実行する
		Add-Type -AssemblyName System.Windows.Forms;
		$dialog = New-Object System.Windows.Forms.OpenFileDialog;
		...
		if($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK){
			$dialog.FileName;
		}
		*/
		let command = "Add-Type -AssemblyName System.Windows.Forms;$dialog = New-Object System.Windows.Forms.OpenFileDialog;";
		command += "$dialog.Filter = \"" + ((option && option.filter) ? option.filter.replace(/"/g, "\\\"") : "All files(*.*)|*.*") + "\";";
		command += (option && option.initial_directory) ? ("$dialog.InitialDirectory = \"" + option.initial_directory.replace(/"/g, "\\\"") + "\";"): "";
		command += (option && option.title) ? ("$dialog.Title = \"" + option.title.replace(/"/g, "\\\"") + "\";"): "";
		command += "if($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK){$dialog.FileName;}";
		return System.PowerShell(command);
	}

	/**
	 * 名前を付けて保存ダイアログを表示する
	 * @param {SaveAsOption} [option]
	 * @returns {string}
	 */
	static popupSaveAs(option) {
		/*
		以下の行を1行で実行する
		Add-Type -AssemblyName System.Windows.Forms;
		$dialog = New-Object System.Windows.Forms.SaveFileDialog;
		...
		if($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK){
			$dialog.FileName;
		}
		*/
		let command = "Add-Type -AssemblyName System.Windows.Forms;$dialog = New-Object System.Windows.Forms.SaveFileDialog;";
		command += (option && option.default_ext) ? ("$dialog.DefaultExt = \"" + option.default_ext.replace(/"/g, "\\\"") + "\";"): "";
		command += (option && option.file_name) ? ("$dialog.FileName = \"" + option.file_name.replace(/"/g, "\\\"") + "\";"): "";
		command += (option && option.filter) ? ("$dialog.Filter = \"" + option.file_name.replace(/"/g, "\\\"") + "\";"): "";
		command += (option && option.initial_directory) ? ("$dialog.InitialDirectory = \"" + option.initial_directory.replace(/"/g, "\\\"") + "\";"): "";
		command += (option && option.title) ? ("$dialog.Title = \"" + option.title.replace(/"/g, "\\\"") + "\";"): "";
		command += "$dialog.ShowHelp = true;";
		command += "$dialog.OverwritePrompt = true;";
		command += "if($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK){$dialog.FileName;}";
		return System.PowerShell(command);
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
