/* global System */

﻿
﻿function main(args) {
	
	System.out.println("S3D クラスのサンプル");
	
	var m = new S3Matrix(
		3, -2, -6, 4,
		-7, -6, 8, 21,
		-4, -7, 9, 11,
		2, -3, -5, 8
	);
	
	System.out.println("行列を作成");
	System.out.println(m);
	
	System.out.println("行列の行列式");
	System.out.println(m.det());
	
	System.out.println("行列の逆行列");
	System.out.println(m.inverse());
	
	System.out.println("行列の掛け算");
	System.out.println(m.mul(m));
	
	
	
}

