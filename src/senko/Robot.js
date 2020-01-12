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
 * 型のみの情報
 * @typedef {Object} WSHRobotRect
 * @property {number} x 左上の座標x
 * @property {number} y 左上の座標y
 * @property {number} width 横幅
 * @property {number} height 縦幅
 */

/**
 * ウィンドウやマウスなどを自動操作するためのクラス
 */
export default class Robot {

	/**
	 * 指定したクラス名のハンドルを取得する
	 * @param {string} classname 
	 * @returns {number}
	 */
	static getHandleOfClassName(classname) {
		// console.log(Robot.getHandleOfClassName("無題 - メモ帳");
		return parseFloat(System.WindowsAPI(
			"user32.dll",
			"IntPtr FindWindow(string lpClassName, IntPtr lpWindowName)",
			"$api::FindWindow(\"" + classname + "\", 0);"
		));
	}

	/**
	 * 指定したハンドルのクラス名を取得する
	 * @param {number} handle 
	 * @returns {string}
	 */
	static getClassName(handle) {
		return System.WindowsAPI(
			"user32.dll",
			"IntPtr GetClassName(IntPtr hWnd, System.Text.StringBuilder text, int count)",
			"$buff = New-Object System.Text.StringBuilder 256;$null = $api::GetClassName(" + handle + ", $buff, 256);$($buff.ToString());"
		);
	}

	/**
	 * 指定したウィンドウ名のハンドルを取得する
	 * @param {string} windowtext 
	 * @returns {number}
	 */
	static getHandleOfWindowText(windowtext) {
		// console.log(Robot.getHandleOfWindowName("Notepad"));
		return parseFloat(System.WindowsAPI(
			"user32.dll",
			"IntPtr FindWindow(IntPtr lpClassName, string lpWindowName)",
			"$api::FindWindow(0 , \"" + windowtext + "\");"
		));
	}

	/**
	 * 指定したハンドルのウィンドウ名を取得する
	 * @param {number} handle 
	 * @returns {string}
	 */
	static getWindowText(handle) {
		return System.WindowsAPI(
			"user32.dll",
			"IntPtr GetWindowText(IntPtr hWnd, System.Text.StringBuilder text, int count)",
			"$buff = New-Object System.Text.StringBuilder 256;$null = $api::GetWindowText(" + handle + ", $buff, 256);$($buff.ToString());"
		);
	}

	/**
	 * 指定したハンドルの位置とサイズを取得する
	 * @param {number} handle 
	 * @returns {WSHRobotRect}
	 */
	static getWindowRect(handle) {
		/*
		以下の行を1行で実行する
		Add-Type -TypeDefinition @"
		using System;
		using System.Runtime.InteropServices;
		public struct RECT { public int Left; public int Top; public int Right; public int Bottom; }
		public class API {
			[DllImport("user32.dll")] public extern static bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
			public static RECT getrect(IntPtr hwnd) { RECT rect = new RECT(); GetWindowRect(hwnd, out rect); return rect; }
		}
		"@
		$rect = [API]::getrect(x);
		"$($rect.Left),$($rect.Top),$($rect.Right),$($rect.Bottom)"
		*/
		// eslint-disable-next-line quotes
		const command = `Add-Type -TypeDefinition "using System; using System.Runtime.InteropServices; public struct RECT { public int Left; public int Top; public int Right; public int Bottom; } public class API { [DllImport(""user32.dll"")] public extern static bool GetWindowRect(IntPtr hWnd, out RECT lpRect); public static RECT getrect(IntPtr hwnd) { RECT rect = new RECT(); GetWindowRect(hwnd, out rect); return rect; } }";  $rect = [API]::getrect(` + handle + `); "$($rect.Left),$($rect.Top),$($rect.Right),$($rect.Bottom)"`;
		const rect = System.PowerShell(command);
		const rect_data = rect.split(",");
		if(rect_data.length !== 4) {
			return null;
		}
		const left   = parseFloat(rect_data[0]) | 0;
		const top    = parseFloat(rect_data[1]) | 0;
		const right  = parseFloat(rect_data[2]) | 0;
		const bottom = parseFloat(rect_data[3]) | 0;
		return {
			x		:left,
			y		:top,
			width	:right - left,
			height	:bottom - top
		};
	}

	/**
	 * 指定したハンドルの位置とサイズを設定する
	 * @param {number} handle 
	 * @param {WSHRobotRect} rect 
	 * @returns {void}
	 */
	static setWindowRect(handle, rect) {
		System.WindowsAPI(
			"user32.dll",
			"bool MoveWindow(IntPtr hWnd, int x, int y, int nWidth, int nHeight, int bRepaint)",
			"$api::MoveWindow(" + handle + " , " + (rect.x|0) + ", " + (rect.y|0) + ", " + (rect.width|0) + ", " + (rect.height|0) + ", 1 );"
		);
	}

	/**
	 * アクティブなウィンドウのハンドルを取得する
	 * @returns {number}
	 */
	static getActiveWindow() {
		return parseFloat(System.WindowsAPI(
			"user32.dll",
			"IntPtr GetForegroundWindow()",
			"$api::GetForegroundWindow();"
		));
	}

	/**
	 * アクティブなウィンドウを設定する
	 * @param {number} handle 
	 * @returns {void}
	 */
	static setActiveWindow(handle) {
		System.WindowsAPI(
			"user32.dll",
			"bool SetForegroundWindow(IntPtr hWnd)",
			"$api::SetForegroundWindow(" + handle + ");"
		);
	}

	/**
	 * 指定したハンドルのプロセスIDを取得する
	 * @param {number} handle 
	 * @returns {number}
	 */
	static getPID(handle) {
		return parseFloat(System.WindowsAPI(
			"user32.dll",
			"IntPtr GetWindowThreadProcessId(IntPtr hWnd, out int ProcessId)",
			"$getpid = 0;$null = $api::GetWindowThreadProcessId(" + handle + ", [ref] $getpid);$getpid;"
		));
	}

	/**
	 * 指定したプロセスIDを修了させる
	 * @param {number} pid 
	 */
	static terminateProcess(pid) {
		return System.run("taskkill /PID " + pid, 0, true);
	}


	// TODO マウスを移動させたり、キーボードを入力する操作を追加する予定

}

