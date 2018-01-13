/* global System */

﻿﻿function main(args) {
	
	System.out.println("S3DMath のサンプル");
	
	var m4 = new S3Matrix(
		3, -2, -6, 4,
		-7, -6, 8, 21,
		-4, -7, 9, 11,
		2, -3, -5, 8
	);
	
	System.out.println("行列を作成");
	System.out.println(m4);
	
	System.out.println("4x4行列の行列式");
	System.out.println(m4.det4());
	
	System.out.println("4x4行列の逆行列");
	System.out.println(m4.inverse4());
	
	System.out.println("行列の掛け算");
	System.out.println(m4.mul(m4));
	
	var m3 = new S3Matrix(
		1, 2, 1,
		2, 1, 0,
		1, 1, 2
	);
	
	System.out.println("3x3行列の行列式");
	System.out.println(m3.det3());
	
	System.out.println("3x3行列の逆行列");
	System.out.println(m3.inverse3());
	
	System.stop();
	
}