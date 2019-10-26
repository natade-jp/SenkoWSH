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
 * ダイアログを扱うクラス
 */
export default class Dialog {
	
	/**
	 * ダイアログを表示する
	 * 
	 * 利用例
	 * - Dialog.popup("test", 0, "test", Dialog.MB_YESNOCANCEL | Dialog.MB_DEFBUTTON3);
	 * @param {string} text 
	 * @param {number} [secondstowait=0]
	 * @param {string} [caption=""]
	 * @param {number} [type=0]
	 * @returns {number}
	 */
	static popup(text) {
		let secondstowait = 0;
		let caption = "";
		let type = 0;
		let istype = false;
		for(let j = 1; j < arguments.length; j++) {
			if(typeof arguments[j] === "string") {
				caption = arguments[j];
			}
			else {
				if(istype) {
					secondstowait = type;
					type = arguments[j];
				}
				else {
					type = arguments[j];
					istype = true;
				}
			}
		}
		return WScript.CreateObject("WScript.Shell").Popup( text, secondstowait, caption, type );
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
