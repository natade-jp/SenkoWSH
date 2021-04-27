/**
 * The script is part of SenkoWSH.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import System from "./System.js";

/**
 * 大きさ情報
 * @typedef {Object} WSHRobotRect
 * @property {number} x 座標x
 * @property {number} y 座標y
 * @property {number} width 横幅
 * @property {number} height 縦幅
 */

/**
 * 位置情報
 * @typedef {Object} WSHRobotPosition
 * @property {number} x 座標x
 * @property {number} y 座標y
 */

/**
 * 仮想キーコード
 * @typedef {Object} VirtualKeyCode
 * @property {number} code
 */

/**
 * 仮想キーコード一覧
 * @typedef {Object} VirtualKeyCodes
 * @property {VirtualKeyCode} VK_LBUTTON
 * @property {VirtualKeyCode} VK_RBUTTON
 * @property {VirtualKeyCode} VK_CANCEL
 * @property {VirtualKeyCode} VK_MBUTTON
 * @property {VirtualKeyCode} VK_XBUTTON1
 * @property {VirtualKeyCode} VK_XBUTTON2
 * @property {VirtualKeyCode} VK_BACK
 * @property {VirtualKeyCode} VK_TAB
 * @property {VirtualKeyCode} VK_CLEAR
 * @property {VirtualKeyCode} VK_RETURN
 * @property {VirtualKeyCode} VK_SHIFT
 * @property {VirtualKeyCode} VK_CONTROL
 * @property {VirtualKeyCode} VK_MENU
 * @property {VirtualKeyCode} VK_PAUSE
 * @property {VirtualKeyCode} VK_CAPITAL
 * @property {VirtualKeyCode} VK_KANA
 * @property {VirtualKeyCode} VK_HANGEUL
 * @property {VirtualKeyCode} VK_HANGUL
 * @property {VirtualKeyCode} VK_JUNJA
 * @property {VirtualKeyCode} VK_FINAL
 * @property {VirtualKeyCode} VK_HANJA
 * @property {VirtualKeyCode} VK_KANJI
 * @property {VirtualKeyCode} VK_ESCAPE
 * @property {VirtualKeyCode} VK_CONVERT
 * @property {VirtualKeyCode} VK_NONCONVERT
 * @property {VirtualKeyCode} VK_ACCEPT
 * @property {VirtualKeyCode} VK_MODECHANGE
 * @property {VirtualKeyCode} VK_SPACE
 * @property {VirtualKeyCode} VK_PRIOR
 * @property {VirtualKeyCode} VK_NEXT
 * @property {VirtualKeyCode} VK_END
 * @property {VirtualKeyCode} VK_HOME
 * @property {VirtualKeyCode} VK_LEFT
 * @property {VirtualKeyCode} VK_UP
 * @property {VirtualKeyCode} VK_RIGHT
 * @property {VirtualKeyCode} VK_DOWN
 * @property {VirtualKeyCode} VK_SELECT
 * @property {VirtualKeyCode} VK_PRINT
 * @property {VirtualKeyCode} VK_EXECUTE
 * @property {VirtualKeyCode} VK_SNAPSHOT
 * @property {VirtualKeyCode} VK_INSERT
 * @property {VirtualKeyCode} VK_DELETE
 * @property {VirtualKeyCode} VK_HELP
 * @property {VirtualKeyCode} VK_0
 * @property {VirtualKeyCode} VK_1
 * @property {VirtualKeyCode} VK_2
 * @property {VirtualKeyCode} VK_3
 * @property {VirtualKeyCode} VK_4
 * @property {VirtualKeyCode} VK_5
 * @property {VirtualKeyCode} VK_6
 * @property {VirtualKeyCode} VK_7
 * @property {VirtualKeyCode} VK_8
 * @property {VirtualKeyCode} VK_9
 * @property {VirtualKeyCode} VK_A
 * @property {VirtualKeyCode} VK_B
 * @property {VirtualKeyCode} VK_C
 * @property {VirtualKeyCode} VK_D
 * @property {VirtualKeyCode} VK_E
 * @property {VirtualKeyCode} VK_F
 * @property {VirtualKeyCode} VK_G
 * @property {VirtualKeyCode} VK_H
 * @property {VirtualKeyCode} VK_I
 * @property {VirtualKeyCode} VK_J
 * @property {VirtualKeyCode} VK_K
 * @property {VirtualKeyCode} VK_L
 * @property {VirtualKeyCode} VK_M
 * @property {VirtualKeyCode} VK_N
 * @property {VirtualKeyCode} VK_O
 * @property {VirtualKeyCode} VK_P
 * @property {VirtualKeyCode} VK_Q
 * @property {VirtualKeyCode} VK_R
 * @property {VirtualKeyCode} VK_S
 * @property {VirtualKeyCode} VK_T
 * @property {VirtualKeyCode} VK_U
 * @property {VirtualKeyCode} VK_V
 * @property {VirtualKeyCode} VK_W
 * @property {VirtualKeyCode} VK_X
 * @property {VirtualKeyCode} VK_Y
 * @property {VirtualKeyCode} VK_Z
 * @property {VirtualKeyCode} VK_LWIN
 * @property {VirtualKeyCode} VK_RWIN
 * @property {VirtualKeyCode} VK_APPS
 * @property {VirtualKeyCode} VK_SLEEP
 * @property {VirtualKeyCode} VK_NUMPAD0
 * @property {VirtualKeyCode} VK_NUMPAD1
 * @property {VirtualKeyCode} VK_NUMPAD2
 * @property {VirtualKeyCode} VK_NUMPAD3
 * @property {VirtualKeyCode} VK_NUMPAD4
 * @property {VirtualKeyCode} VK_NUMPAD5
 * @property {VirtualKeyCode} VK_NUMPAD6
 * @property {VirtualKeyCode} VK_NUMPAD7
 * @property {VirtualKeyCode} VK_NUMPAD8
 * @property {VirtualKeyCode} VK_NUMPAD9
 * @property {VirtualKeyCode} VK_MULTIPLY
 * @property {VirtualKeyCode} VK_ADD
 * @property {VirtualKeyCode} VK_SEPARATOR
 * @property {VirtualKeyCode} VK_SUBTRACT
 * @property {VirtualKeyCode} VK_DECIMAL
 * @property {VirtualKeyCode} VK_DIVIDE
 * @property {VirtualKeyCode} VK_F1
 * @property {VirtualKeyCode} VK_F2
 * @property {VirtualKeyCode} VK_F3
 * @property {VirtualKeyCode} VK_F4
 * @property {VirtualKeyCode} VK_F5
 * @property {VirtualKeyCode} VK_F6
 * @property {VirtualKeyCode} VK_F7
 * @property {VirtualKeyCode} VK_F8
 * @property {VirtualKeyCode} VK_F9
 * @property {VirtualKeyCode} VK_F10
 * @property {VirtualKeyCode} VK_F11
 * @property {VirtualKeyCode} VK_F12
 * @property {VirtualKeyCode} VK_F13
 * @property {VirtualKeyCode} VK_F14
 * @property {VirtualKeyCode} VK_F15
 * @property {VirtualKeyCode} VK_F16
 * @property {VirtualKeyCode} VK_F17
 * @property {VirtualKeyCode} VK_F18
 * @property {VirtualKeyCode} VK_F19
 * @property {VirtualKeyCode} VK_F20
 * @property {VirtualKeyCode} VK_F21
 * @property {VirtualKeyCode} VK_F22
 * @property {VirtualKeyCode} VK_F23
 * @property {VirtualKeyCode} VK_F24
 * @property {VirtualKeyCode} VK_NUMLOCK
 * @property {VirtualKeyCode} VK_SCROLL
 * @property {VirtualKeyCode} VK_LSHIFT
 * @property {VirtualKeyCode} VK_RSHIFT
 * @property {VirtualKeyCode} VK_LCONTROL
 * @property {VirtualKeyCode} VK_RCONTROL
 * @property {VirtualKeyCode} VK_LMENU
 * @property {VirtualKeyCode} VK_RMENU
 * @property {VirtualKeyCode} VK_BROWSER_BACK
 * @property {VirtualKeyCode} VK_BROWSER_FORWARD
 * @property {VirtualKeyCode} VK_BROWSER_REFRESH
 * @property {VirtualKeyCode} VK_BROWSER_STOP
 * @property {VirtualKeyCode} VK_BROWSER_SEARCH
 * @property {VirtualKeyCode} VK_BROWSER_FAVORITES
 * @property {VirtualKeyCode} VK_BROWSER_HOME
 * @property {VirtualKeyCode} VK_VOLUME_MUTE
 * @property {VirtualKeyCode} VK_VOLUME_DOWN
 * @property {VirtualKeyCode} VK_VOLUME_UP
 * @property {VirtualKeyCode} VK_MEDIA_NEXT_TRACK
 * @property {VirtualKeyCode} VK_MEDIA_PREV_TRACK
 * @property {VirtualKeyCode} VK_MEDIA_STOP
 * @property {VirtualKeyCode} VK_MEDIA_PLAY_PAUSE
 * @property {VirtualKeyCode} VK_LAUNCH_MAIL
 * @property {VirtualKeyCode} VK_LAUNCH_MEDIA_SELECT
 * @property {VirtualKeyCode} VK_LAUNCH_APP1
 * @property {VirtualKeyCode} VK_LAUNCH_APP2
 * @property {VirtualKeyCode} VK_OEM_1
 * @property {VirtualKeyCode} VK_OEM_PLUS
 * @property {VirtualKeyCode} VK_OEM_COMMA
 * @property {VirtualKeyCode} VK_OEM_MINUS
 * @property {VirtualKeyCode} VK_OEM_PERIOD
 * @property {VirtualKeyCode} VK_OEM_2
 * @property {VirtualKeyCode} VK_OEM_3
 * @property {VirtualKeyCode} VK_OEM_4
 * @property {VirtualKeyCode} VK_OEM_5
 * @property {VirtualKeyCode} VK_OEM_6
 * @property {VirtualKeyCode} VK_OEM_7
 * @property {VirtualKeyCode} VK_OEM_8
 * @property {VirtualKeyCode} VK_PROCESSKEY
 * @property {VirtualKeyCode} VK_ATTN
 * @property {VirtualKeyCode} VK_CRSEL
 * @property {VirtualKeyCode} VK_EXSEL
 * @property {VirtualKeyCode} VK_EREOF
 * @property {VirtualKeyCode} VK_PLAY
 * @property {VirtualKeyCode} VK_ZOOM
 * @property {VirtualKeyCode} VK_NONAME
 * @property {VirtualKeyCode} VK_PA1
 * @property {VirtualKeyCode} VK_OEM_CLEAR
 */

/**
 * 仮想キーコード一覧
 * @type {VirtualKeyCodes}
 */
const VK_DATA = {
	VK_LBUTTON	:{code:0x01},
	VK_RBUTTON	:{code:0x02},
	VK_CANCEL	:{code:0x03},
	VK_MBUTTON	:{code:0x04},
	VK_XBUTTON1	:{code:0x05},
	VK_XBUTTON2	:{code:0x06},
	VK_BACK	:{code:0x08},
	VK_TAB	:{code:0x09},
	VK_CLEAR	:{code:0x0C},
	VK_RETURN	:{code:0x0D},
	VK_SHIFT	:{code:0x10},
	VK_CONTROL	:{code:0x11},
	VK_MENU	:{code:0x12},
	VK_PAUSE	:{code:0x13},
	VK_CAPITAL	:{code:0x14},
	VK_KANA	:{code:0x15},
	VK_HANGEUL	:{code:0x15},
	VK_HANGUL	:{code:0x15},
	VK_JUNJA	:{code:0x17},
	VK_FINAL	:{code:0x18},
	VK_HANJA	:{code:0x19},
	VK_KANJI	:{code:0x19},
	VK_ESCAPE	:{code:0x1B},
	VK_CONVERT	:{code:0x1C},
	VK_NONCONVERT	:{code:0x1D},
	VK_ACCEPT	:{code:0x1E},
	VK_MODECHANGE	:{code:0x1F},
	VK_SPACE	:{code:0x20},
	VK_PRIOR	:{code:0x21},
	VK_NEXT	:{code:0x22},
	VK_END	:{code:0x23},
	VK_HOME	:{code:0x24},
	VK_LEFT	:{code:0x25},
	VK_UP	:{code:0x26},
	VK_RIGHT	:{code:0x27},
	VK_DOWN	:{code:0x28},
	VK_SELECT	:{code:0x29},
	VK_PRINT	:{code:0x2A},
	VK_EXECUTE	:{code:0x2B},
	VK_SNAPSHOT	:{code:0x2C},
	VK_INSERT	:{code:0x2D},
	VK_DELETE	:{code:0x2E},
	VK_HELP	:{code:0x2F},
	VK_0	:{code:0x30},
	VK_1	:{code:0x31},
	VK_2	:{code:0x32},
	VK_3	:{code:0x33},
	VK_4	:{code:0x34},
	VK_5	:{code:0x35},
	VK_6	:{code:0x36},
	VK_7	:{code:0x37},
	VK_8	:{code:0x38},
	VK_9	:{code:0x39},
	VK_A	:{code:0x41},
	VK_B	:{code:0x42},
	VK_C	:{code:0x43},
	VK_D	:{code:0x44},
	VK_E	:{code:0x45},
	VK_F	:{code:0x46},
	VK_G	:{code:0x47},
	VK_H	:{code:0x48},
	VK_I	:{code:0x49},
	VK_J	:{code:0x4A},
	VK_K	:{code:0x4B},
	VK_L	:{code:0x4C},
	VK_M	:{code:0x4D},
	VK_N	:{code:0x4E},
	VK_O	:{code:0x4F},
	VK_P	:{code:0x50},
	VK_Q	:{code:0x51},
	VK_R	:{code:0x52},
	VK_S	:{code:0x53},
	VK_T	:{code:0x54},
	VK_U	:{code:0x55},
	VK_V	:{code:0x56},
	VK_W	:{code:0x57},
	VK_X	:{code:0x58},
	VK_Y	:{code:0x59},
	VK_Z	:{code:0x5A},
	VK_LWIN	:{code:0x5B},
	VK_RWIN	:{code:0x5C},
	VK_APPS	:{code:0x5D},
	VK_SLEEP	:{code:0x5F},
	VK_NUMPAD0	:{code:0x60},
	VK_NUMPAD1	:{code:0x61},
	VK_NUMPAD2	:{code:0x62},
	VK_NUMPAD3	:{code:0x63},
	VK_NUMPAD4	:{code:0x64},
	VK_NUMPAD5	:{code:0x65},
	VK_NUMPAD6	:{code:0x66},
	VK_NUMPAD7	:{code:0x67},
	VK_NUMPAD8	:{code:0x68},
	VK_NUMPAD9	:{code:0x69},
	VK_MULTIPLY	:{code:0x6A},
	VK_ADD	:{code:0x6B},
	VK_SEPARATOR	:{code:0x6C},
	VK_SUBTRACT	:{code:0x6D},
	VK_DECIMAL	:{code:0x6E},
	VK_DIVIDE	:{code:0x6F},
	VK_F1	:{code:0x70},
	VK_F2	:{code:0x71},
	VK_F3	:{code:0x72},
	VK_F4	:{code:0x73},
	VK_F5	:{code:0x74},
	VK_F6	:{code:0x75},
	VK_F7	:{code:0x76},
	VK_F8	:{code:0x77},
	VK_F9	:{code:0x78},
	VK_F10	:{code:0x79},
	VK_F11	:{code:0x7A},
	VK_F12	:{code:0x7B},
	VK_F13	:{code:0x7C},
	VK_F14	:{code:0x7D},
	VK_F15	:{code:0x7E},
	VK_F16	:{code:0x7F},
	VK_F17	:{code:0x80},
	VK_F18	:{code:0x81},
	VK_F19	:{code:0x82},
	VK_F20	:{code:0x83},
	VK_F21	:{code:0x84},
	VK_F22	:{code:0x85},
	VK_F23	:{code:0x86},
	VK_F24	:{code:0x87},
	VK_NUMLOCK	:{code:0x90},
	VK_SCROLL	:{code:0x91},
	VK_LSHIFT	:{code:0xA0},
	VK_RSHIFT	:{code:0xA1},
	VK_LCONTROL	:{code:0xA2},
	VK_RCONTROL	:{code:0xA3},
	VK_LMENU	:{code:0xA4},
	VK_RMENU	:{code:0xA5},
	VK_BROWSER_BACK	:{code:0xA6},
	VK_BROWSER_FORWARD	:{code:0xA7},
	VK_BROWSER_REFRESH	:{code:0xA8},
	VK_BROWSER_STOP	:{code:0xA9},
	VK_BROWSER_SEARCH	:{code:0xAA},
	VK_BROWSER_FAVORITES	:{code:0xAB},
	VK_BROWSER_HOME	:{code:0xAC},
	VK_VOLUME_MUTE	:{code:0xAD},
	VK_VOLUME_DOWN	:{code:0xAE},
	VK_VOLUME_UP	:{code:0xAF},
	VK_MEDIA_NEXT_TRACK	:{code:0xB0},
	VK_MEDIA_PREV_TRACK	:{code:0xB1},
	VK_MEDIA_STOP	:{code:0xB2},
	VK_MEDIA_PLAY_PAUSE	:{code:0xB3},
	VK_LAUNCH_MAIL	:{code:0xB4},
	VK_LAUNCH_MEDIA_SELECT	:{code:0xB5},
	VK_LAUNCH_APP1	:{code:0xB6},
	VK_LAUNCH_APP2	:{code:0xB7},
	VK_OEM_1	:{code:0xBA},
	VK_OEM_PLUS	:{code:0xBB},
	VK_OEM_COMMA	:{code:0xBC},
	VK_OEM_MINUS	:{code:0xBD},
	VK_OEM_PERIOD	:{code:0xBE},
	VK_OEM_2	:{code:0xBF},
	VK_OEM_3	:{code:0xC0},
	VK_OEM_4	:{code:0xDB},
	VK_OEM_5	:{code:0xDC},
	VK_OEM_6	:{code:0xDD},
	VK_OEM_7	:{code:0xDE},
	VK_OEM_8	:{code:0xDF},
	VK_PROCESSKEY	:{code:0xE5},
	VK_ATTN	:{code:0xF6},
	VK_CRSEL	:{code:0xF7},
	VK_EXSEL	:{code:0xF8},
	VK_EREOF	:{code:0xF9},
	VK_PLAY	:{code:0xFA},
	VK_ZOOM	:{code:0xFB},
	VK_NONAME	:{code:0xFC},
	VK_PA1	:{code:0xFD},
	VK_OEM_CLEAR	:{code:0xFE}
};

/**
 * マウスイベント用コード
 * @typedef {Object} MouseEventFCodes
 * @property {number} MOUSEEVENTF_ABSOLUTE
 * @property {number} MOUSEEVENTF_MOVE
 * @property {number} MOUSEEVENTF_LEFTDOWN
 * @property {number} MOUSEEVENTF_LEFTUP
 * @property {number} MOUSEEVENTF_RIGHTDOWN
 * @property {number} MOUSEEVENTF_RIGHTUP
 * @property {number} MOUSEEVENTF_MIDDLEDOWN
 * @property {number} MOUSEEVENTF_MIDDLEUP
 * @property {number} MOUSEEVENTF_WHEEL
 * @property {number} MOUSEEVENTF_XDOWN
 * @property {number} MOUSEEVENTF_XUP
 */

/**
 * マウスイベント用コード一覧
 * @type {MouseEventFCodes}
 */
const MOUSEEVENTF_DATA = {
	MOUSEEVENTF_ABSOLUTE	:0x8000,
	MOUSEEVENTF_MOVE		:0x0001,
	MOUSEEVENTF_LEFTDOWN	:0x0002,
	MOUSEEVENTF_LEFTUP		:0x0004,
	MOUSEEVENTF_RIGHTDOWN	:0x0008,
	MOUSEEVENTF_RIGHTUP		:0x0010,
	MOUSEEVENTF_MIDDLEDOWN	:0x0020,
	MOUSEEVENTF_MIDDLEUP	:0x0040,
	MOUSEEVENTF_WHEEL		:0x0800,
	MOUSEEVENTF_XDOWN		:0x0080,
	MOUSEEVENTF_XUP			:0x0100
};

/**
 * キーイベント発生時のオプション
 * @typedef {Object} KeyEventOption
 * @property {number} [count_max=1] 繰り返す回数
 * @property {boolean} [is_not_pushed=false] 押さない
 * @property {boolean} [is_not_released=false] 離さない
 * @property {number} [push_time_sec=0] 押下時間
 * @property {boolean} [is_pressed_shift=false]
 * @property {boolean} [is_pressed_alt=false]
 * @property {boolean} [is_pressed_ctrl=false]
 */

/**
 * マウスイベント発生時のオプション
 * @typedef {Object} MouseEventOption
 * @property {number} [count_max=1] 繰り返す回数
 * @property {boolean} [is_not_pushed=false] 押さない
 * @property {boolean} [is_not_released=false] 離さない
 * @property {number} [push_time_sec=0] 押下時間
 */

/**
 * ハンドルを取得する際に必要なデータ
 * @typedef {Object} RobotGetHandleData
 * @property {string|number} [classname=0] クラス名
 * @property {string|number} [windowtext=0] ウィンドウ名
 */

/**
 * ウィンドウやマウスなどを自動操作するためのクラス
 */
export default class Robot {
	
	/**
	 * キーを入力する
	 * @param {VirtualKeyCode} vkcode - キーコード（利用可能なコードは、Robot.getVK() で取得可能）
	 * @param {KeyEventOption} [option] - オプション
	 */
	static setKeyEvent(vkcode, option) {
		const KEYEVENTF_KEYUP = 2;
		const count_max = (option && option.count_max) ? option.count_max: 1;
		let time_ms = (option && option.push_time_sec) ? ((option.push_time_sec * 1000) | 0 ): 0;
		time_ms = Math.max(time_ms , 1); // 1以上にする
		let code = "for ($i=0; $i -lt " + count_max + "; $i++){";
		{
			if(option && option.is_pressed_shift) {
				code += "$api::keybd_event(" + VK_DATA.VK_SHIFT.code + ", 0, 0, 0);";
			}
			if(option && option.is_pressed_alt) {
				code += "$api::keybd_event(" + VK_DATA.VK_MENU.code + ", 0, 0, 0);";
			}
			if(option && option.is_pressed_ctrl) {
				code += "$api::keybd_event(" + VK_DATA.VK_CONTROL.code + ", 0, 0, 0);";
			}
			if(!option || !option.is_not_pushed) {
				code += "$api::keybd_event(" + vkcode.code + ", 0, 0, 0);";
			}
		}
		if(option && option.push_time_sec) {
			code += "Start-Sleep -m " + time_ms + ";";
		}
		{
			if(!option || !option.is_not_released) {
				code += "$api::keybd_event(" + vkcode.code + ", 0, " + KEYEVENTF_KEYUP + ", 0);";
			}
			if(option && option.is_pressed_ctrl) {
				code += "$api::keybd_event(" + VK_DATA.VK_CONTROL.code + ", 0, " + KEYEVENTF_KEYUP + ", 0);";
			}
			if(option && option.is_pressed_alt) {
				code += "$api::keybd_event(" + VK_DATA.VK_MENU.code + ", 0, " + KEYEVENTF_KEYUP + ", 0);";
			}
			if(option && option.is_pressed_shift) {
				code += "$api::keybd_event(" + VK_DATA.VK_SHIFT.code + ", 0, " + KEYEVENTF_KEYUP + ", 0);";
			}
		}
		code += "}";
		System.WindowsAPI(
			"user32.dll",
			"void keybd_event(byte bVk, byte bScan, uint dwFlags, uint dwExtraInfo)",
			code
		);
	}
	
	/**
	 * 仮想キーコードの一覧を取得します
	 * @returns {VirtualKeyCodes} 
	 */
	static getVK() {
		return VK_DATA;
	}

	/**
	 * マウスのクリックを行う
	 * @param {string} type - "LEFT", "RIGHT", "CLICK", "DOUBLE_CLICK"といった文字列
	 * @param {KeyEventOption} [option] - オプション
	 */
	static setMouseEvent(type, option) {
		let count_max = (option && option.count_max) ? option.count_max: 1;
		let time_ms = (option && option.push_time_sec) ? ((option.push_time_sec * 1000) | 0 ): 0;
		time_ms = Math.max(time_ms , 1); // 1以上にする
		let target = type.toUpperCase().trim();
		if(target === "CLICK") {
			count_max = 1;
			target = "LEFT";
		}
		else if(target === "DOUBLE_CLICK") {
			count_max = 2;
			target = "LEFT";
		}
		let pushed_code;
		let released_code;
		if(target === "LEFT") {
			pushed_code		= MOUSEEVENTF_DATA.MOUSEEVENTF_LEFTDOWN;
			released_code	= MOUSEEVENTF_DATA.MOUSEEVENTF_LEFTUP;
		}
		else if((target === "CENTER") || (target === "MIDDLE")) {
			pushed_code		= MOUSEEVENTF_DATA.MOUSEEVENTF_MIDDLEDOWN;
			released_code	= MOUSEEVENTF_DATA.MOUSEEVENTF_MIDDLEUP;
		}
		if(target === "RIGHT") {
			pushed_code		= MOUSEEVENTF_DATA.MOUSEEVENTF_RIGHTDOWN;
			released_code	= MOUSEEVENTF_DATA.MOUSEEVENTF_RIGHTUP;
		}
		let code = "for ($i=0; $i -lt " + count_max + "; $i++){";
		if(!option || !option.is_not_pushed) {
			code += "$api::mouse_event(" + pushed_code + ", 0, 0, 0, 0);";
		}
		if(option && option.push_time_sec) {
			code += "Start-Sleep -m " + time_ms + ";";
		}
		if(!option || !option.is_not_released) {
			code += "$api::mouse_event(" + released_code + ", 0, 0, 0, 0);";
		}
		code += "}";
		System.WindowsAPI(
			"user32.dll",
			"void mouse_event(long dwFlags, long dx, long dy, long cButtons, long dwExtraInfo)",
			code
		);
	}

	/**
	 * マウスの座標を調べる
	 * @returns {WSHRobotPosition}
	 */
	static getCursorPosition() {
		/*
		以下の行を1行で実行する
		[void] [System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms");
		$X = [System.Windows.Forms.Cursor]::Position.X;
		$Y = [System.Windows.Forms.Cursor]::Position.Y;
		"$X,$Y"
		*/
		// eslint-disable-next-line quotes
		const text = System.PowerShell('[void] [System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms");$X = [System.Windows.Forms.Cursor]::Position.X;$Y = [System.Windows.Forms.Cursor]::Position.Y;"$X,$Y"');
		const pos_data = text.split(",");
		const x = parseFloat(pos_data[0]) | 0;
		const y = parseFloat(pos_data[1]) | 0;
		return {
			x : x, y : y
		};
	}

	/**
	 * マウスの座標を設定する
	 * @param {WSHRobotPosition} position
	 */
	static setCursorPosition(position) {
		System.WindowsAPI(
			"user32.dll",
			"void SetCursorPos(int X, int Y)",
			"$api::SetCursorPos(" + position.x + ", " + position.y + ");"
		);
	}

	/**
	 * 指定したハンドルを取得する
	 * @param {RobotGetHandleData} get_handle_data 
	 * @returns {number}
	 */
	static getHandle(get_handle_data) {
		let function_text;
		// 省略する場合はヌルポインタを設定する必要があるため、入力引数を変更する
		if(get_handle_data.classname && get_handle_data.windowtext) {
			function_text = "IntPtr FindWindow(string lpClassName, string lpWindowName)";
		}
		else if(get_handle_data.classname) {
			function_text = "IntPtr FindWindow(string lpClassName, IntPtr lpWindowName)";
		}
		else {
			function_text = "IntPtr FindWindow(IntPtr lpClassName, string lpWindowName)";
		}
		let command = "$api::FindWindow(";
		command += (get_handle_data.classname ? "\"" + get_handle_data.classname + "\"" : "0") + ",";
		command += (get_handle_data.windowtext ? "\"" + get_handle_data.windowtext + "\"" : "0") + ");";
		return parseFloat(System.WindowsAPI( "user32.dll", function_text, command));
	}

	/**
	 * 指定したクラス名のハンドルを取得する
	 * @param {string} classname 
	 * @returns {number}
	 */
	static getHandleOfClassName(classname) {
		// console.log(Robot.getHandleOfClassName("Notepad"));
		return Robot.getHandle({classname : classname});
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
	 * @param {string} windowname 
	 * @returns {number}
	 */
	static getHandleOfWindowText(windowname) {
		// console.log(Robot.getHandleOfWindowName("無題 - メモ帳");
		return Robot.getHandle({windowtext : windowname});
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


