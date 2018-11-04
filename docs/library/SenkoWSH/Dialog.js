"use strict";

/* global WScript */

﻿/**
 * SenkoWSH Dialog.js
 *
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 *
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 *
 * DEPENDENT LIBRARIES:
 *  なし
 */

var Dialog =  {
	
	popup: function(text) {
		var secondstowait = 0;
		var caption = "";
		var type = 0;
		var istype = false;
		for(var j = 1;j < arguments.length;j++) {
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
		if(typeof WScript !== "undefined") {
			return(WScript.CreateObject("WScript.Shell").popup( text, secondstowait, caption, type ));
		}
		if((type & 0xFF) === Dialog.MB_OK) {
			if((typeof window !== "undefined")&&(typeof window.alert !== "undefined")) {
				window.alert(text);
				return(Dialog.IDOK);
			}
		}
		if((type & 0xFF) === Dialog.MB_OKCANCEL) {
			if((typeof window !== "undefined")&&(typeof window.confirm !== "undefined")) {
				if(window.confirm(text)) {
					return(Dialog.IDOK);
				}
				else {
					return(Dialog.IDCANCEL);
				}
			}
		}
		return(0);
	}
	
};

// 下記を参考に実装
// http://msdn.microsoft.com/ja-jp/library/cc410914.aspx

Dialog.MB_OK				=  0; // [OK]
Dialog.MB_OKCANCEL			=  1; // [OK], [キャンセル]
Dialog.MB_ABORTRETRYIGNORE	=  2; // [中止], [再試行], [無視]
Dialog.MB_YESNOCANCEL		=  3; // [はい], [いいえ], [キャンセル]
Dialog.MB_YESNO				=  4; // [はい], [いいえ]
Dialog.MB_RETRYCANCEL		=  5; // [再試行], [キャンセル]

Dialog.MB_ICONSTOP			= 16; // [Stop] 
Dialog.MB_ICONQUESTION		= 32; // [?]
Dialog.MB_ICONWARNING		= 48; // [!]
Dialog.MB_ICONINFORMATION	= 64; // [i] 

Dialog.MB_DEFBUTTON1	= 0x0000;
Dialog.MB_DEFBUTTON2	= 0x0100;
Dialog.MB_DEFBUTTON3	= 0x0200;
Dialog.MB_DEFBUTTON4	= 0x0300;

Dialog.IDTIMEOUT		= -1;
Dialog.IDOK				= 1;
Dialog.IDCANCEL			= 2;
Dialog.IDABORT			= 3;
Dialog.IDRETRY			= 4;
Dialog.IDIGNORE			= 5;
Dialog.IDYES			= 6;
Dialog.IDNO				= 7;


//Dialog.popup("test", 0, "tset", Dialog.MB_YESNOCANCEL | Dialog.MB_DEFBUTTON3);

