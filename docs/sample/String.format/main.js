function main(args) {
	
	System.out.println("String.format のサンプル");
	
	var format = [
		"",
		" ",
		"+",
		"2",
		"10",
		".2",
		".10",
		"-16",
		" 16",
		"016",
		"#16",
		"#16.",
		"#-+16.",
		"#16.4"
	];
	
	System.out.println("動作例");
	for(var i = 0;i < format.length; i++) {
		var x = 10;
		// 整数10進数
		System.out.println(String.format("%%" + format[i] + "d [%" + format[i] + "d]", x));
		System.out.println(String.format("%%" + format[i] + "u [%" + format[i] + "u]", x));
		// 整数2進数
		System.out.println(String.format("%%" + format[i] + "b [%" + format[i] + "b]", x));
		System.out.println(String.format("%%" + format[i] + "B [%" + format[i] + "B]", x));
		// 整数8進数
		System.out.println(String.format("%%" + format[i] + "o [%" + format[i] + "o]", x));
		// 整数16進数
		System.out.println(String.format("%%" + format[i] + "x [%" + format[i] + "x]", x));
		System.out.println(String.format("%%" + format[i] + "X [%" + format[i] + "X]", x));
		// 小数形式浮動小数点数
		System.out.println(String.format("%%" + format[i] + "f [%" + format[i] + "f]", x));
		// 指数形式浮動小数点数
		System.out.println(String.format("%%" + format[i] + "e [%" + format[i] + "e]", x));
		System.out.println(String.format("%%" + format[i] + "E [%" + format[i] + "E]", x));
		// fかeで適した方
		System.out.println(String.format("%%" + format[i] + "g [%" + format[i] + "g]", x));
		System.out.println(String.format("%%" + format[i] + "G [%" + format[i] + "G]", x));
		// 文字
		System.out.println(String.format("%%" + format[i] + "c [%" + format[i] + "c]", "A".charCodeAt(0)));
		// 文字列
		System.out.println(String.format("%%" + format[i] + "s [%" + format[i] + "s]", "ABCDEFG"));
	}

	System.out.println("引数順指定");
	System.out.println(String.format("%%1$d %%2$d %%3$d [%1$d %2$d %3$d]" ,1 ,2 ,3 ));
	System.out.println(String.format("%%3$d %%2$d %%1$d [%3$d %2$d %1$d]" ,1 ,2 ,3 ));

	System.out.println("引数によるフィールド幅指定");
	for(var i = 1;i < 10; i++) {
		var x = 1;
		System.out.println(String.format("%%*d(" + i + ") [%*d]" ,i ,x ));
	}

	System.out.println("引数による精度指定(実数)");
	for(var i = 1;i < 10; i++) {
		var x = 1;
		System.out.println(String.format("%%.*f(" + i + ") [%.*f]" ,i ,x ));
	}

	System.out.println("引数による精度指定(文字列)");
	for(var i = 1;i < 10; i++) {
		var x = "ABCDEFGHIJKLMN";
		System.out.println(String.format("%%.*s(" + i + ") [%.*s]" ,i ,x ));
	}

	System.out.println("組合せ");
	for(var i = 1;i < 10; i++) {
		var x = 1;
		System.out.println(String.format("%%*.*f(" + i + ") [%*.*f]" ,i * 2 ,i ,x ));
	}

	System.out.println("動作例(マイナスの数字)");
	for(var i = 0;i < format.length; i++) {
		var x = -10;
		// 整数10進数
		System.out.println(String.format("%%" + format[i] + "d [%" + format[i] + "d]", x));
		System.out.println(String.format("%%" + format[i] + "u [%" + format[i] + "u]", x));
		// 整数2進数
		System.out.println(String.format("%%" + format[i] + "b [%" + format[i] + "b]", x));
		System.out.println(String.format("%%" + format[i] + "B [%" + format[i] + "B]", x));
		// 整数8進数
		System.out.println(String.format("%%" + format[i] + "o [%" + format[i] + "o]", x));
		// 整数16進数
		System.out.println(String.format("%%" + format[i] + "x [%" + format[i] + "x]", x));
		System.out.println(String.format("%%" + format[i] + "X [%" + format[i] + "X]", x));
		// 小数形式浮動小数点数
		System.out.println(String.format("%%" + format[i] + "f [%" + format[i] + "f]", x));
		// 指数形式浮動小数点数
		System.out.println(String.format("%%" + format[i] + "e [%" + format[i] + "e]", x));
		System.out.println(String.format("%%" + format[i] + "E [%" + format[i] + "E]", x));
		// fかeで適した方
		System.out.println(String.format("%%" + format[i] + "g [%" + format[i] + "g]", x));
		System.out.println(String.format("%%" + format[i] + "G [%" + format[i] + "G]", x));
	}

	System.out.printf("%05d %05d", 123, 456);
	
	System.stop();


}

System.startHtmlMain();