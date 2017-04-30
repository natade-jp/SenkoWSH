﻿/* global System, SComponentPutType */

﻿function main(args) {
	var i = 0;
	
	System.out.println("Component クラスのサンプル");
	
	System.out.println("HTML での部品用のクラス。");
	
	var obj1, obj2, obj3, obj4;
	
	obj1 = new SPanel("SComponentPutType.IN");
	obj1.putMe("id_test_block", SComponentPutType.IN);
	
	obj2 = new SPanel("SComponentPutType.RIGHT");
	obj1.put(obj2, SComponentPutType.RIGHT);
	
	obj3 = new SPanel("SComponentPutType.NEWLINE");
	obj2.put(obj3, SComponentPutType.NEWLINE);
	
	obj1.setText("aaaa");
	
	obj4 = new SButton("button1");
	obj3.put(obj4, SComponentPutType.NEWLINE);
	
	obj4.addOnClickFunction(function () {
		System.out.println("pushed !");
		obj4.setText("push " + i++);
		if(i === 10) {
			obj4.setShow(false);
		}
	});
	
	
}
