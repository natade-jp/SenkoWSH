/* global System, SComponentPutType */

﻿function main(args) {
	var i = 0;
	
	System.out.println("Component クラスのサンプル");
	
	System.out.println("HTML での部品用のクラス。");
	
	var x = new SComponent();
	x.putMe("test1", SComponentPutType.IN);
	
	System.stop();
}
