function main(args) {

	System.out.println("BigInteger クラスのサンプル");

	var i;
	var s1, s2, s3, s4;
	
	
	System.out.println("四則演算");
	s1 = new BigInteger("12345678");
	s2 = new BigInteger("-1234");

	System.out.println("add");
	System.out.println(s1.add(s1));
	System.out.println(s1.add(s2));
	System.out.println(s2.add(s1));
	System.out.println(s2.add(s2));
	
	System.out.println("subtract");
	System.out.println(s1.subtract(s1));
	System.out.println(s1.subtract(s2));
	System.out.println(s2.subtract(s1));
	System.out.println(s2.subtract(s2));
	
	System.out.println("multiply");
	System.out.println(s1.multiply(s2));
	
	System.out.println("divide");
	System.out.println(s1.divide(s2));
	
	s1 = new BigInteger("-1234567890123456789012345678901234567890");
	s2 = new BigInteger("123456789012345678901");
	
	System.out.println("divideAndRemainder");
	System.out.println(s1.divideAndRemainder(s2)[0] + " ... " + s1.divideAndRemainder(s2)[1]);
	
	System.out.println("remainder");
	System.out.println(s1.divide(s2) + " ... " + s1.remainder(s2));
	
	System.out.println("mod");
	System.out.println(s1.divide(s2) + " ... " + s1.mod(s2));
	
	System.out.println("////////////////////////////////");
	
	System.out.println("ビット操作");
	
	s1 = new BigInteger("1234ffffff0000000000", 16);
	s2 = s1.negate();
	
	System.out.println(s1);
	System.out.println(s2);
	System.out.println("bitCount");
	System.out.println(s1.bitCount());
	System.out.println(s2.bitCount());
	
	System.out.println("bitLength");
	System.out.println(s1.bitLength());
	System.out.println(s2.bitLength());
	
	System.out.println("getLowestSetBit");
	System.out.println(s1.getLowestSetBit());
	System.out.println(s2.getLowestSetBit());
	
	System.out.println("shiftLeft");
	s1 = BigInteger.ONE;
	for(var i = 0;i < 18; i++) {
		s1 = s1.shiftLeft(1);
		System.out.println(i + "\t" + s1.toString(2) + "\tlen " + s1.bitLength() + "\tlsb " + s1.getLowestSetBit());
	}
	
	System.out.println("shiftRight");
	for(var i = 0;i < 18; i++) {
		s1 = s1.shiftRight(1);
		System.out.println(i + "\t" + s1.toString(2) + "\tlen " + s1.bitLength() + "\tlsb " + s1.getLowestSetBit());
	}
	
	s1 = new BigInteger("101001000100001000000", 2);
	
	System.out.println("testBit");
	System.out.println(s1.toString(2));
	s2 = s1.bitLength();
	for(i = s2 - 1; i >= 0; i--) {
		System.out.print((s1.testBit(i) ? 1 : 0));
	}
	System.out.println("");
	
	s3 = BigInteger.ZERO;
	
	System.out.println("setBit");
	for(i = 0; i < s2; i++) {
		if(s1.testBit(i)) {
			s3 = s3.setBit(i);
		}
	}
	System.out.println(s3.toString(2));
	
	System.out.println("clearBit");
	for(i = 0; i < s2; i++) {
		if(s1.testBit(i)) {
			System.out.println(s3.clearBit(i).toString(2));
		}
	}
	
	System.out.println("flipBit");
	for(i = 0; i < s2; i++) {
		s3 = s3.flipBit(i);
		System.out.println(s3.toString(2));
	}
	
	System.out.println("////////////////////////////////");
	
	System.out.println("ビット演算");
	
	s1 = new BigInteger("1234ffffff0000000000", 16);
	s2 = s1.negate();
	s3 = new BigInteger("8765ffffff0000000000", 16);
	s4 = s3.negate();
	
	System.out.println("and");
	System.out.println(s1.and(s2).toString(16));
	System.out.println(s1.and(s3).toString(16));
	System.out.println(s2.and(s4).toString(16));
	
	System.out.println("or");
	System.out.println(s1.or(s2).toString(16));
	System.out.println(s1.or(s3).toString(16));
	System.out.println(s2.or(s4).toString(16));
	
	System.out.println("xor");
	System.out.println(s1.xor(s2).toString(16));
	System.out.println(s1.xor(s3).toString(16));
	System.out.println(s2.xor(s4).toString(16));
	
	System.out.println("not");
	System.out.println(s1.not().toString(16));
	System.out.println(s2.not().toString(16));
	
	System.out.println("andNot");
	System.out.println(s1.andNot(s2).toString(16));
	System.out.println(s1.andNot(s3).toString(16));
	System.out.println(s2.andNot(s4).toString(16));
	
	System.out.println("////////////////////////////////");
	
	System.out.println("数値の変換");

	var s1 = new BigInteger("3334342423423", 16);
	
	System.out.println("toString()");
	System.out.println(s1.toString());
	
	System.out.println("toString(2)");
	System.out.println(s1.toString(2));
	
	System.out.println("toString(10)");
	System.out.println(s1.toString(10));
	
	System.out.println("toString(16)");
	System.out.println(s1.toString(16));
	
	System.out.println("intValue");
	System.out.println(s1.intValue().toString(16));
	
	System.out.println("longValue");
	System.out.println(s1.longValue().toString(16));
	
	System.out.println("floatValue");
	System.out.println(s1.floatValue());
	
	System.out.println("doubleValue");
	System.out.println(s1.doubleValue());
	
	System.out.println("////////////////////////////////");
	
	System.out.println("乱数");
	
	var random = new Random();
	
	System.out.println("new BigInteger(numBits, rnd)");
	for(i = 0; i < 3; i++) {
		System.out.printf("% 50s", (new BigInteger(50, random)).toString(2) );
	}
	
	System.out.println("nextProbablePrime");
	
	s1 = new BigInteger("100000");
	for(i = 0; i < 3; i++) {
		s1 = s1.nextProbablePrime();
		System.out.println(s1);
	}
	
	System.out.println("isProbablePrime");
	
	s1 = new BigInteger("156b14b55", 16);
	System.out.println(s1 + " は素数か？ -> " + s1.isProbablePrime(100));
	
	System.out.println("probablePrime");
	for(i = 0; i < 3; i++) {
		System.out.println(BigInteger.probablePrime(20, random));
	}
	
	System.out.println("////////////////////////////////");
	
	System.out.println("その他の演算");
	
	System.out.println("+100 remainder & mod");
	s1 = new BigInteger("100");
	for(i = -4;i < 0; i++) {
		s2 = BigInteger.valueOf(i);
		System.out.println(i + "\tremainder -> " + s1.remainder(s2));
	}
	for(i = 1;i <= 4; i++) {
		s2 = BigInteger.valueOf(i);
		System.out.println(i + "\tremainder -> " + s1.remainder(s2) + "\tmod -> " + s1.mod(s2));
	}
	System.out.println("-100 remainder & mod");
	s1 = new BigInteger("-100");
	for(i = -4;i < 0; i++) {
		s2 = BigInteger.valueOf(i);
		System.out.println(i + "\tremainder -> " + s1.remainder(s2));
	}
	for(i = 1;i <= 4; i++) {
		s2 = BigInteger.valueOf(i);
		System.out.println(i + "\tremainder -> " + s1.remainder(s2) + "\tmod -> " + s1.mod(s2));
	}
	
	System.out.println("compareTo");
	System.out.println((new BigInteger("200000")).compareTo(new BigInteger("163840")));
	System.out.println((new BigInteger("100000")).compareTo(new BigInteger("81920")));
	
	System.out.println("gcd");
	System.out.println((new BigInteger("12")).gcd(new BigInteger("18")));
	
	System.out.println("pow");
	s1 = new BigInteger("2");
	System.out.println(s1.pow(1000));
	
	System.out.println("modPow");
	System.out.println((new BigInteger("14123999253219")).modPow(new BigInteger("70276475859277"),new BigInteger("86706662670157")));
	System.out.println(BigInteger.valueOf(-324).modPow(BigInteger.valueOf(123), BigInteger.valueOf(55)));
	
	System.out.println("modInverse");
	System.out.println((BigInteger.valueOf(15)).modInverse(BigInteger.valueOf(4)));
	System.out.println((BigInteger.valueOf(19)).modInverse(BigInteger.valueOf(41)));
	
	System.out.println("////////////////////////////////");
	
	System.out.println("計算速度の測定");
	
	var time = 0;
	var x, y;

	System.out.println("2^5000 = ");
	x = new BigInteger("2");
	
	time = System.currentTimeMillis();
	x = x.pow(5000);
	System.out.println("計算時間\t" + (System.currentTimeMillis() - time) + "ms");
	
	time = System.currentTimeMillis();
	y = x.toString();
	System.out.println("10進数変換\t" + (System.currentTimeMillis() - time) + "ms");

	time = System.currentTimeMillis();
	x = new BigInteger(y);
	System.out.println("内部変数変換\t" + (System.currentTimeMillis() - time) + "ms");
	
	System.out.println("500! = ");
	x = new BigInteger("1");
	
	time = System.currentTimeMillis();
	for(i = 1;i <= 500;i++) {
		x = x.multiply(BigInteger.valueOf(i));
	}
	System.out.println("計算時間\t" + (System.currentTimeMillis() - time) + "ms");
	
	time = System.currentTimeMillis();
	y = x.toString();
	System.out.println("10進数変換\t" + (System.currentTimeMillis() - time) + "ms");

	time = System.currentTimeMillis();
	x = new BigInteger(y);
	System.out.println("内部変数変換\t" + (System.currentTimeMillis() - time) + "ms");
	
	System.stop();
	
}

System.startHtmlMain();