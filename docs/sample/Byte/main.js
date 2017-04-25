function main(args) {

	System.out.println("Byte クラスのサンプル");

	var x = new Byte();

	System.out.println("32ビットを記録");
	for(var i = 0;i < 32;i++) {
		if((i % 2) === 0) {
			x.setBit(0, i, 1);
		}
	}
	System.out.println(x.getLength() + "byte");
	System.out.println(x.getBitLength() + "ビット");
	for(var i = 0;i < 32;i++) {
		System.out.print(x.getBit(0, i));
	}
	System.out.println("");
	
	System.out.println("64ビットを記録");
	for(var i = 0;i < 64;i++) {
		x.setBit(0, i, ((i % 3) === 0) ? 1 : 0);
	}
	System.out.println(x.getLength() + "byte");
	System.out.println(x.getBitLength() + "ビット");
	for(var i = 0;i < 64;i++) {
		System.out.print(x.getBit(0, i));
	}
	System.out.println("");
	
	System.out.println("初期化");
	x.setLength(0);
	System.out.println(x.getLength() + "byte");
	System.out.println(x.getBitLength() + "ビット");
	
	System.out.println("8ビットの非負値");
	x.setUint8(0, parseInt("10100100", 2));
	for(var i = 0;i < 8;i++) {
		System.out.print(x.getBit(0, 7 - i));
	}
	System.out.println("");
	System.out.println(x.getLength() + "byte");
	
	System.out.println("8ビットの整数値");
	x.setInt8(0, 127);
	System.out.println(x.getInt8(0));
	x.setInt8(1, -128);
	System.out.println(x.getInt8(1));

	System.out.println("16ビットの非負値と整数値（ビッグエンディアン）");
	x.setUint16(2, 65535);
	System.out.println(x.getUint16(2));
	x.setInt16(3, -32768);
	System.out.println(x.getInt16(3));
	
	System.out.println("16ビットの非負値と整数値（リトルエンディアン）");
	x.setUint16(4, 65535, true);
	System.out.println(x.getUint16(4, true));
	x.setInt16(5, -32768, true);
	System.out.println(x.getInt16(5, true));

	System.out.println("32ビットの非負値と整数値（ビッグエンディアン）");
	x.setUint32(6, 4294967295);
	System.out.println(x.getUint32(6));
	System.out.println(x.getInt32(6));
	x.setInt32(7, -2147483648);
	System.out.println(x.getUint32(7));
	System.out.println(x.getInt32(7));

	System.out.println("32ビットの非負値と整数値（リトルエンディアン）");
	x.setUint32(8, 4294967295, true);
	System.out.println(x.getUint32(8, true));
	System.out.println(x.getInt32(8, true));
	x.setInt32(9, -2147483648, true);
	System.out.println(x.getUint32(9, true));
	System.out.println(x.getInt32(9, true));

	System.out.println("クローン1");
	var y = x.clone();
	System.out.println(y.getInt32(9));
	System.out.println(y.getInt32(9));

	System.out.println("クローン2");
	var y2 = new Byte(y);
	System.out.println(y2.getInt32(9));
	System.out.println(y2.getInt32(9));
	
	System.out.println("256バイトの書き込み");
	for(var i = 0;i < 256;i++) {
		x.setByte(i, i);
	}
	System.out.println(x.getLength() + "byte");
	
	if(System.isJScript()) {
		System.out.println("256バイトの保存");
		x.setFile("test.bin");

		System.out.println("256バイトの読み込み");
		y = new Byte();
		y.getFile("test.bin");
		for(var i = 0;i < 256;i++) {
			System.out.print(y.getByte(i) + " ");
		}		
		System.out.println("");
	}
	
	System.out.println("何ビットあれば表現できるか");
	// 1ビットがどこに立っているか
	// 最大の位置を調べる
	x = new Byte();
	x.setUint32(0, parseInt("1000000000", 2), true);
	System.out.println(x.getBitLength() + " ビット");
	
	System.out.println("16進数で指定");
	x.setLength(0);
	x.setByte(0, "FFFFFFFF12340001");
	System.out.println(x.getUint32(0).toString(16) + " " + x.getUint32(4).toString(16));
	
	System.out.println("最低限必要な配列で指定");
	for(var i = 0;i < 32;i++) {
		x.setLength(i);
		System.out.println(i + " " + x.element.length + " " + x.getLength());
	}

	System.stop();

}

System.setShowHtmlConsole(true);
System.startHtmlMain();