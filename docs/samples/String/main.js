function main(args) {
	var map, x;
	
	System.out.println("String クラスのサンプル");
	
	x = "0000\"1234//5678\"1234//5678\n123456789/*1234\n1234*/56789";
	System.out.println(x.removeComment());

	x = "0/*000\"1234//5678\"1234*/9";
	System.out.println(x.removeComment());

	x = "0/1234/5678/9";
	System.out.println(x.removeComment());

	x = "１２３456　ＡＢＣdef ";
	System.out.println(x.toFullWidthAsciiCode());
	System.out.println(x.toHalfWidthAsciiCode());
	System.out.println(x.toFullWidthAlphabet());
	System.out.println(x.toHalfWidthAlphabet());
	System.out.println(x.toFullWidthNumber());
	System.out.println(x.toHalfWidthNumber());

	x = "あおカコｶﾞｺﾞﾊﾞﾎﾞﾊﾟﾎﾟバビブベボ";
	System.out.println(x.toKatakana());
	System.out.println(x.toHiragana());
	System.out.println(x.toFullWidthKana());
	System.out.println(x.toHalfWidthKana());

	x = "0123abcABCｱｲｳ!!０１２３ａｂｃＡＢＣあいうアイウ！！";
	System.out.println(x.toFullWidth());
	System.out.println(x.toHalfWidth());


	x = String.fromCodePoint(134071, 37326, 23478 );
	System.out.println("サロゲートペア対応 " + x);

	System.out.println("前から 1");
	len = x.length;
	for(var i = 0; i < len; i = x.offsetByCodePoints(i, 1)) {
		var z = i + " " + String.fromCodePoint(x.codePointAt(i));
		if(System.isJScript()) {
			WScript.Echo(z);
		}
		else {
			System.out.println(z);
		}
	}

	System.out.println("前から 2");
	len = x.codePointCount();
	for(var i = 0; i < len; i++) {
		var z = i + " " + String.fromCodePoint(x.codePointAt(x.offsetByCodePoints(0, i)));
		if(System.isJScript()) {
			WScript.Echo(z);
		}
		else {
			System.out.println(z);
		}
	}

	System.out.println("後ろから");
	len = x.length;
	for(var i = len; i > 0; i = x.offsetByCodePoints(i, -1)) {
		var z = i + " " + String.fromCodePoint(x.codePointBefore(i));
		if(System.isJScript()) {
			WScript.Echo(z);
		}
		else {
			System.out.println(z);
		}
	}

	System.out.println("each");
	x.each(function( index, text, code ) {
		System.out.println(index + " - " + text + " - " + code);
	});
	
	System.out.println("startsWith, endsWith");
	x = "1234";
	System.out.println(x.startsWith("0"));
	System.out.println(x.endsWith("4"));

	System.out.println("trim");
	System.out.println("[" + "  abc  ".trim() + "]");
	
	System.out.println("replaceAll");
	System.out.println("ab/ca/bc".replaceAll("/", "111"));
	System.out.println("123$456$789".replaceAll("$", "$1"));
	System.out.println("[][][]".replaceAll("[]", "()"));
	System.out.println("\n\n\n".replaceAll("\n", "?\t?"));
	
	System.stop();
}
