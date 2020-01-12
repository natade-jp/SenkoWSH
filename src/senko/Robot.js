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
			"FindWindow(\"" + classname + "\", 0)"
		));
	}

	/**
	 * 指定したウィンドウ名のハンドルを取得する
	 * @param {string} windowname 
	 * @returns {number}
	 */
	static getHandleOfWindowName(windowname) {
		// console.log(Robot.getHandleOfWindowName("Notepad"));
		return parseFloat(System.WindowsAPI(
			"user32.dll",
			"IntPtr FindWindow(IntPtr lpClassName, string lpWindowName)",
			"FindWindow(0 , \"" + windowname + "\")"
		));
	}

	/**
	 * 指定したハンドルの位置とサイズを取得する
	 * @param {number} handle 
	 * @returns {{x:number, y:number, width:number, height:number}}
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
	 * @param {{x:number, y:number, width:number, height:number}} rect 
	 * @returns {void}
	 */
	static setWindowRect(handle, rect) {
		System.WindowsAPI(
			"user32.dll",
			"bool MoveWindow(IntPtr hWnd, int x, int y, int nWidth, int nHeight, int bRepaint)",
			"MoveWindow(" + handle + " , " + (rect.x|0) + ", " + (rect.y|0) + ", " + (rect.width|0) + ", " + (rect.height|0) + ", 1 )"
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
			"GetForegroundWindow()"
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
			"SetForegroundWindow(" + handle + ")"
		);
	}

	/**
	 * 指定したハンドルのプロセスIDを取得する
	 * @param {number} handle 
	 * @returns {number}
	 */
	static getPID(handle) {
		/*
		以下の行を1行で実行する
		$api = Add-Type -Name "api" -MemberDefinition "[DllImport(""user32.dll"")] public extern static IntPtr GetWindowThreadProcessId(IntPtr hWnd, out int ProcessId);" -PassThru;
		$getpid = 0;
		$null = $api::GetWindowThreadProcessId(x, [ref] $getpid);
		$getpid;
		*/
		// eslint-disable-next-line quotes
		const command = `$api = Add-Type -Name "api" -MemberDefinition "[DllImport(""user32.dll"")] public extern static IntPtr GetWindowThreadProcessId(IntPtr hWnd, out int ProcessId);" -PassThru;$getpid = 0;$null = $api::GetWindowThreadProcessId(` + handle + `, [ref] $getpid);$getpid`;
		return parseFloat(System.PowerShell(command));
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

