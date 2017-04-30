/* global System, SComponent, SFile */

﻿function main(args) {
	var pushed = 50;
	
	System.out.println("SComponent クラスのサンプル");
	
	System.out.println("HTML での部品用のクラスです。");
	
	var obj1, obj2, obj3, obj4, obj5;
	
	// パネルを作って、指定した ID の要素内に入れる。
	obj1 = new SLabel("SComponentPutType.IN");
	obj1.putMe("id_test_block", SComponent.putype.IN);
	
	// obj2 は、 obj1 の右に配置する
	obj2 = new SLabel("SComponentPutType.RIGHT");
	obj1.put(obj2, SComponent.putype.RIGHT);
	
	// obj3 は、 obj2 の下に配置する
	obj3 = new SLabel("SComponentPutType.NEWLINE");
	obj2.put(obj3, SComponent.putype.NEWLINE);
	
	// obj1 の内容を変更する
	obj1.setText("aaaa");
	
	obj4 = new SButton("button1");
	obj3.put(obj4, SComponent.putype.NEWLINE);
	
	// クリックすると内部の関数が呼ばれる
	obj4.addOnClickFunction(function () {
		pushed--;
		System.out.println("pushed !");
		obj4.setText("残り " + pushed);
		
		// 押すたびに有効化／無効化の変更
		obj5.setEnabled(!obj5.isEnabled());
		
		// 何回か押したら非表示にする
		if(pushed === 0) {
			obj4.setShow(false);
		}
	});
	
	obj5 = new SFile("file");
	obj5.setFileAccept(SFile.fileaccept.image);
	obj4.put(obj5, SComponent.putype.NEWLINE);
	obj5.addOnClickFunction(function(file) {
		var i = 0;
		for(;i < file.length; i++) {
			System.out.println(file[i].name + " " + file[i].size + "byte");
		}
	});
	
	
	
}
