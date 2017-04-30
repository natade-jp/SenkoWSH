/* global System, SComponentPutType */

﻿function main(args) {
	var i = 0;
	
	System.out.println("SComponent クラスのサンプル");
	
	System.out.println("HTML での部品用のクラスです。");
	
	var obj1, obj2, obj3, obj4;
	
	// パネルを作って、指定した ID の要素内に入れる。
	obj1 = new SPanel("SComponentPutType.IN");
	obj1.putMe("id_test_block", SComponentPutType.IN);
	
	// obj2 は、 obj1 の右に配置する
	obj2 = new SPanel("SComponentPutType.RIGHT");
	obj1.put(obj2, SComponentPutType.RIGHT);
	
	// obj3 は、 obj2 の下に配置する
	obj3 = new SPanel("SComponentPutType.NEWLINE");
	obj2.put(obj3, SComponentPutType.NEWLINE);
	
	// obj1 の内容を変更する
	obj1.setText("aaaa");
	
	obj4 = new SButton("button1");
	obj3.put(obj4, SComponentPutType.NEWLINE);
	
	// クリックすると内部の関数が呼ばれる
	obj4.addOnClickFunction(function () {
		System.out.println("pushed !");
		obj4.setText("push " + i++);
		
		// 10回クリックしたら非表示にする
		if(i === 10) {
			obj4.setShow(false);
		}
	});
	
	
}
