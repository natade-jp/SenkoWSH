/* global System, BigDecimal, MathContext */

﻿
function testPlainStringAndEngineeringString(x) {
	var decimal = new BigDecimal(x);
	System.out.println(
			decimal.toString() + "\t" + decimal.toPlainString() + "\t" + decimal.toEngineeringString()
			+ "\t( " + decimal.unscaledValue() + " e" + -1 * decimal.scale() + " )");
}

function getDecimalData(x) {
	return x.toString() + " ( " + x.unscaledValue() + " e" + -1 * x.scale() + " )";
};
	
function testDivideAndRemainder(x, y) {
	x = new BigDecimal(x);
	y = new BigDecimal(y);
	var z = x.divideAndRemainder(y);
	System.out.println( x + "\t/\t" + y + "\t\t= " + getDecimalData(z[0]) + "\t... " + getDecimalData(z[1]) );
};

function main(args) {

	System.out.println("BigDecimal クラスのサンプル");

	var x, y, z;
	
	System.out.println("");
	
	System.out.println("test toString, toPlainString, toEngineeringString");
	testPlainStringAndEngineeringString("0");
	testPlainStringAndEngineeringString("0.00");
	testPlainStringAndEngineeringString("123");
	testPlainStringAndEngineeringString("-123");
	testPlainStringAndEngineeringString("1.23E3");
	testPlainStringAndEngineeringString("1.23E+3");
	testPlainStringAndEngineeringString("12.3E+7");
	testPlainStringAndEngineeringString("12.0");
	testPlainStringAndEngineeringString("12.3");
	testPlainStringAndEngineeringString("0.00123");
	testPlainStringAndEngineeringString("1234.5E-4");
	testPlainStringAndEngineeringString("0E+7");
	testPlainStringAndEngineeringString("-0");
	testPlainStringAndEngineeringString("123e0");
	testPlainStringAndEngineeringString("-123e0");
	testPlainStringAndEngineeringString("123e+1");
	testPlainStringAndEngineeringString("123e+3");
	testPlainStringAndEngineeringString("123e-1");
	testPlainStringAndEngineeringString("123e-5");
	testPlainStringAndEngineeringString("123e-10");
	testPlainStringAndEngineeringString("-123e-12");
	
	System.out.println("");
	
	System.out.println("test ulp");
	x = new BigDecimal("0.0000001234");
	System.out.println(x + "\t" + x.ulp());
	
	System.out.println("");
	
	System.out.println("test scale, precision");
	x = new BigDecimal("0.0013540");
	y = x.setScale(5, RoundingMode.HALF_EVEN);
	System.out.println(getDecimalData(x) + " 精度 = " + x.precision());
	System.out.println(getDecimalData(y) + " 精度 = " + y.precision());
	
	System.out.println("");
	
	System.out.println("setScale による四捨五入のテスト");
	x = new BigDecimal("0.5925");
	System.out.println(x);
	System.out.println("小数第一位で四捨五入:" + x.setScale(0, BigDecimal.ROUND_HALF_UP));
	System.out.println("小数第二位で四捨五入:" + x.setScale(1, BigDecimal.ROUND_HALF_UP));
	System.out.println("小数第三位で四捨五入:" + x.setScale(2, BigDecimal.ROUND_HALF_UP));
	System.out.println("小数第四位で四捨五入:" + x.setScale(3, BigDecimal.ROUND_HALF_UP));

	System.out.println("");
	
	System.out.println("round による精度の変換");
	x = new BigDecimal("999");
	var mc = new MathContext(2, RoundingMode.UP);
	y = x.round(mc);
	System.out.println(x + " 精度 = " + x.precision());
	System.out.println(y + " 精度 = " + y.precision());
	 
	System.out.println("");
	
	System.out.println("割り算を除く四則演算");
	x = new BigDecimal("3333.3333");
	y = new BigDecimal("-123.45");
	System.out.println(x + " + " + y + " = " + x.add(y));
	System.out.println(x + " - " + y + " = " + x.subtract(y));
	System.out.println(x + " * " + y + " = " + x.multiply(y));
	
	System.out.println("");
	
	System.out.println("test max, min");
	x = new BigDecimal("100");
	y = new BigDecimal("-234434");
	System.out.println("max(" + x + ", " + y + ") = " + x.max(y));
	System.out.println("min(" + x + ", " + y + ") = " + y.min(x));
	
	System.out.println("");
	
	System.out.println("test compare");
	x = new BigDecimal("110");
	y = new BigDecimal("1.1e2");
	System.out.println("x = " + x + " = " + x.toPlainString());
	System.out.println("y = " + y + " = " + y.toPlainString());
	System.out.println("x === y => " + x.compareTo(y));
	
	System.out.println("");
	
	System.out.println("divideAndRemainder の計算後の scale テスト");
	// 1000e0		/	1e2				=	1000e-2	... 0e0
	testDivideAndRemainder("1000e0", "1e2");
	// 1000e0		/	10e1			=	100e-1	... 0e0
	// 1000e0		/	100e0			=	10e0	... 0e0
	testDivideAndRemainder("1000e0", "100e0");
	// 1000e0		/	1000e-1			=	1e1		... 0e0
	// 1000e0		/	10000e-2		=	1e1		... 0e-1
	testDivideAndRemainder("1000e0", "10000e-2");
	// 1000e0		/	100000e-3		=	1e1		... 0e-2
	testDivideAndRemainder("1000e0", "100000e-3");
	// 10e2			/	100e0			=	1e1		... 0e1
	testDivideAndRemainder("10e2", "100e0");
	// 100e1		/	100e0			=	1e1		... 0e1
	// 1000e0		/	100e0			=	10e0	... 0e0
	// 10000e-1		/	100e0			=	100e-1	... 0e-1
	// 100000e-2	/	100e0			=	1000e-2	... 0e-2
	testDivideAndRemainder("100000e-2", "100e0");

	System.out.println("");
	
	System.out.println("test movePointRight, movePointLeft");
	x = new BigDecimal("10");
	System.out.println(getDecimalData(x.movePointRight(1)));
	System.out.println(getDecimalData(x.movePointLeft(1)));

	System.out.println("");
	
	System.out.println("割り算のテスト");
	x = new BigDecimal("4.36");
	y = new BigDecimal("3.4");
	z = x.divide(y, MathContext.DECIMAL128);
	System.out.println( x + " / " + y + " = " + z);
	
	System.out.println("");
	
	System.out.println("割り算のテスト（循環小数）");
	x = new BigDecimal("1");
	y = new BigDecimal("7");
	try {
		z = x.divide(y);
	}
	catch(e) {
		System.out.println( x + " / " + y + " = " + e);
	}
	
	System.out.println("");
	
	System.out.println("test stripTrailingZeros, intValueExact");
	x = new BigDecimal("-1123.00000");
	System.out.println(getDecimalData(x));
	System.out.println("0を削除 -> " + getDecimalData(x.stripTrailingZeros()));
	System.out.println("整数化 -> " + x.intValueExact());
	
	System.out.println("");
	
	System.out.println("乗算");
	x = new BigDecimal("123.456");
	System.out.println(x.pow(30));
	
	// 丸め用のクラスの試験用
	// 入力値の 1 の位に対して、丸め後の数値へ、いくつ足せばいいかがかえる
	/*
	System.out.println(RoundingMode.UP(11));
	System.out.println(RoundingMode.UP(-11));
	System.out.println(RoundingMode.DOWN(11));
	System.out.println(RoundingMode.DOWN(-11));
	System.out.println(RoundingMode.CEILING(11));
	System.out.println(RoundingMode.CEILING(-11));
	System.out.println(RoundingMode.FLOOR(11));
	System.out.println(RoundingMode.FLOOR(-11));
	System.out.println(RoundingMode.HALF_UP(11));
	System.out.println(RoundingMode.HALF_UP(15));
	System.out.println(RoundingMode.HALF_UP(18));
	System.out.println(RoundingMode.HALF_UP(-11));
	System.out.println(RoundingMode.HALF_UP(-15));
	System.out.println(RoundingMode.HALF_UP(-18));
	System.out.println(RoundingMode.HALF_DOWN(11));
	System.out.println(RoundingMode.HALF_DOWN(15));
	System.out.println(RoundingMode.HALF_DOWN(18));
	System.out.println(RoundingMode.HALF_DOWN(-11));
	System.out.println(RoundingMode.HALF_DOWN(-15));
	System.out.println(RoundingMode.HALF_DOWN(-18));
	*/

	System.stop();
}

System.setShowHtmlConsole(true);
System.startHtmlMain();
