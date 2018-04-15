/* global System, Color */

﻿function main(args) {
	var i = 0;
	var color;
	
	System.out.println("Color クラスのサンプル");
	
	System.out.println("色を設定したり取得ができる。");
	
	System.out.println("正規化した値での設定と取得");
	color = Color.newColorNormalizedRGB(1.0, 1.0, 1.0).getNormalizedRGB();
	System.out.println([color.r, color.g, color.b]);
	color = Color.newColorNormalizedHSV(0.1, 0.8, 0.7).getNormalizedHSV();
	System.out.println([color.h, color.s, color.v]);
	color = Color.newColorNormalizedHSL(0.1, 0.8, 0.7).getNormalizedHSL();
	System.out.println([color.h, color.s, color.l]);
	
	System.out.println("整数での設定と取得");
	color = Color.newColorRGB(50, 100, 150).getRGB();
	System.out.println([color.r, color.g, color.b]);
	color = Color.newColorHSV(50, 100, 150).getHSV();
	System.out.println([color.h, color.s, color.v]);
	color = Color.newColorHSL(50, 100, 150).getHSL();
	System.out.println([color.h, color.s, color.l]);
	
	System.out.println("アルファチャンネルの設定も可能");
	color = Color.newColorNormalizedRGB(0.1, 0.2, 0.3, 0.4).getNormalizedRGB();
	System.out.println([color.r, color.g, color.b, color.a]);
	
	System.out.println("HSLとHLSの変換のテスト");
	for(i = 0; i < 13; i++) {
		var color1 = Color.newColorHSV(30 * i, 200, 100).getHSV();
		var color2 = Color.newColorHSL(30 * i, 200, 100).getHSL();
		System.out.println([color1.h, color1.s, color1.v, color2.h, color2.s, color2.l]);
	}
	
	System.out.println("配列で引数を渡すことも可能です");
	color = Color.newColorNormalizedRGB([0.2, 0.4, 0.6]).getNormalizedRGB();
	System.out.println([color.r, color.g, color.b]);
	
	System.out.println("オブジェクトで引数を渡すことも可能です");
	color = Color.newColorNormalizedRGB(color).getNormalizedRGB();
	System.out.println([color.r, color.g, color.b]);
	
	System.out.println("JavaのColorっぽく色を取り出せます");
	color = Color.newColorRGB(50, 100, 150);
	System.out.println([color.getRed(), color.getGreen(), color.getBlue()]);
	
	System.out.println("16進数の設定");
	color = Color.newColorRGB(0x4080B0);
	System.out.println(color);
	
	System.out.println("明るめと暗め");
	color = Color.newColorRGB(50, 100, 150).brighter();
	System.out.println(color);
	color = Color.newColorRGB(50, 100, 150).darker();
	System.out.println(color);
	
	System.out.println("色名の指定");
	System.out.println(Color.RED);
	
	
	System.stop();
}
