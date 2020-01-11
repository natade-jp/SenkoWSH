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
 * Robotを扱うクラス
 */
export default class Robot {

	/**
	 * 指定したクラス名のハンドルを取得する
	 * @param {string} classname 
	 * @returns {number}
	 */
	static getHandleOfClassName(classname) {
		return parseFloat(System.WindowsAPI(
			"user32.dll",
			"IntPtr FindWindow(string lpClassName, IntPtr lpWindowName)",
			"FindWindow(\"" + classname + "\", 0)"
		));
	}

	/**
	 * 指定したウィンドウ名のハンドルを取得する
	 * @param {string} windowname 
	 * @returns {number}
	 */
	static getHandleOfWindowName(windowname) {
		return parseFloat(System.WindowsAPI(
			"user32.dll",
			"IntPtr FindWindow(IntPtr lpClassName, string lpWindowName)",
			"FindWindow(0 , \"" + windowname + "\")"
		));
	}

	// TODO マウスを移動させたり、キーボードを入力する操作を追加する予定

}

