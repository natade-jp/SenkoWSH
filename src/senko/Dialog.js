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
 * @property {number} [type=0] `Dialog.POPUP_OPTION_TYPE` を組み合わせて使用する
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
	 * - 引数の `PopupOption` の `type` には `Dialog.POPUP_OPTION_TYPE` を組み合わせて使用できます
	 * - 戻り値は `Dialog.POPUP_RETURN` のどれかの値が返ります
	 * 
	 * @param {string} text 
	 * @param {PopupOption} [option]
	 * @returns {number} `Dialog.POPUP_RETURN`
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
		const select_text = System.execPowerShell(command).trim();
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
		const select_text = System.execPowerShell(command).trim();
		if(select_text !== "") {
			return new SFile(select_text);
		}
		else {
			return null;
		}
	}

}

/**
 * メッセージボックスのボタン配置
 * @typedef {Object} typePopupMessageButton
 * @property {number} MB_OK 「OK」のボタン配置
 * @property {number} MB_OKCANCEL 「OK」、「キャンセル」のボタン配置
 * @property {number} MB_ABORTRETRYIGNORE 「中止」、「再試行」、「無視」のボタン配置
 * @property {number} MB_YESNOCANCEL 「はい」、「いいえ」、「キャンセル」のボタン配置
 * @property {number} MB_YESNO 「はい」、「いいえ」のボタン配置
 * @property {number} MB_RETRYCANCEL 「再試行」、「キャンセル」のボタン配置
 */

/**
 * メッセージボックスのアイコン
 * @typedef {Object} typePopupMessageIcon
 * @property {number} MB_ICONSTOP 中止「Stop」のアイコンのダイアログ
 * @property {number} MB_ICONQUESTION 質問「?」のアイコンのダイアログ
 * @property {number} MB_ICONWARNING 警告「!」のアイコンのダイアログ
 * @property {number} MB_ICONINFORMATION 情報「i」のアイコンのダイアログ
 */

/**
 * メッセージボックスのボタンのデフォルト
 * @typedef {Object} typePopupMessageDefaultButton
 * @property {number} MB_DEFBUTTON1 「ボタン1」を選択
 * @property {number} MB_DEFBUTTON2 「ボタン2」を選択
 * @property {number} MB_DEFBUTTON3 「ボタン3」を選択
 * @property {number} MB_DEFBUTTON4 「ボタン4」を選択
 */

/**
 * メッセージボックスのボタンのデフォルト
 * @typedef {Object} typePopupMessageOption
 * @property {typePopupMessageButton} BUTTON ボタン配置
 * @property {typePopupMessageIcon} ICON アイコン
 * @property {typePopupMessageDefaultButton} DEFAULT_BUTTON ボタンのデフォルト
 */

/**
 * `Dialog.popupMessage` 引数用の定数
 * @type {typePopupMessageOption}
 */
Dialog.POPUP_OPTION_TYPE = {
	BUTTON : {
		MB_OK				:  0,
		MB_OKCANCEL			:  1,
		MB_ABORTRETRYIGNORE	:  2,
		MB_YESNOCANCEL		:  3,
		MB_YESNO			:  4,
		MB_RETRYCANCEL		:  5
	},
	ICON : {
		MB_ICONSTOP			: 16,
		MB_ICONQUESTION		: 32,
		MB_ICONWARNING		: 48,
		MB_ICONINFORMATION	: 64
	},
	DEFAULT_BUTTON : {
		MB_DEFBUTTON1	: 0x0000,
		MB_DEFBUTTON2	: 0x0100,
		MB_DEFBUTTON3	: 0x0200,
		MB_DEFBUTTON4	: 0x0300
	}
};

/**
 * メッセージボックスの戻り値
 * @typedef {Object} typePopupMessageReturn
 * @property {number} IDTIMEOUT タイムアウトが発生
 * @property {number} IDOK 「OK」を選択
 * @property {number} IDCANCEL 「キャンセル」を選択
 * @property {number} IDABORT 「中止」を選択
 * @property {number} IDRETRY 「再試行」を選択
 * @property {number} IDIGNORE 「無視」を選択
 * @property {number} IDYES 「はい」を選択
 * @property {number} IDNO 「いいえ」を選択
 */

/**
 * `Dialog.popupMessage` の戻り値用の定数
 * @type {typePopupMessageReturn}
 */
Dialog.POPUP_RETURN = {
	IDTIMEOUT		: -1,
	IDOK			: 1,
	IDCANCEL		: 2,
	IDABORT			: 3,
	IDRETRY			: 4,
	IDIGNORE		: 5,
	IDYES			: 6,
	IDNO			: 7
};

