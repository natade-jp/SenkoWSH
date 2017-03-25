function main(args) {

	System.out.println("System.out.printlnで1行出力します");
	
	System.out.print("System.out.printで改行なしで出力します");
	System.out.print("System.out.printで改行なしで出力します");
	System.out.print("System.out.printで改行なしで出力します");
	
	System.out.println("System.out.printlnで1行出力します");
	
	
	System.out.println("System.currentTimeMillis で今の時間のミリ秒");
	System.out.println(System.currentTimeMillis() + "ms");
	
	System.out.println("System.sleep で指定した時間（ミリ秒）を待ちます");
	for(var i = 0; i < 10; i++) {
		System.sleep(100);
		System.out.println(System.currentTimeMillis() + "ms");
	}
	
	System.out.println("実行ファイルがあるディレクトリの表示。");
	System.out.println(System.getScriptDirectory());
	
	System.out.println("カレントディレクトリを実行ファイルがある位置にできます。");
	System.initializeCurrentDirectory();
	
	System.out.println("カレントディレクトリの表示。");
	System.out.println(System.getCurrentDirectory());
	
	System.out.println("setCurrentDirectoryでカレントディレクトリを設定できます。");
	System.setCurrentDirectory("C://");
	System.out.println(System.getCurrentDirectory());
	
	System.out.println("System.readLineで文字を入力。");
	var x = System.readLine();
	System.out.println(x);
	
	System.out.println("止める");
	System.stop();

}

System.startHtmlMain();