function main(args) {

	System.out.println("Random クラスのサンプル(使い方はJavaと同じ)");
	
	System.out.println("int型の乱数を 10個出力する");
	for(var i = 0;i < 10; i++) {
		System.out.println((new Random()).nextInt());
	}
	
	var r = new Random();

	System.out.println("乱数 [0, 1) 10個出力する");
	for(var i = 0;i < 10; i++) {
		System.out.println(i + "\t" +r.nextDouble());
	}

	System.out.println("乱数 [0, 10) を10個出力する");
	for(var i = 0;i < 10; i++) {
		System.out.println(i + "\t" +r.nextInt(10));
	}
	
	var loop = 1 << 18;
	var sum = 0;
	for(var j = 0;j < loop; j++) {
		sum += r.nextDouble();
	}
	var average = sum / loop;
	System.out.println(loop+"回ランダム→平均値\t"+average);

	System.out.println("初期化後の1つ目の乱数について");
	var min = 1;
	var max = -1;
	for(var i = 0; i < 1000; ++i){
		r.setSeed(i);
		var x = r.nextDouble();
		if(x > max) max = x;
		if(x < min) min = x;
	}

	System.out.println("最小値 = " + min + ", 最大値 = " + max);

	System.stop();
}
