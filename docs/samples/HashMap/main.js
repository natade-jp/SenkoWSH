function main(args) {
	var map, x;
	
	map = new HashMap();
	
	System.out.println("HashMap クラスのサンプル(多分Javaと大体同じだと思う)");
	
	System.out.println("データを追加");
	map.put("test", 3);
	
	System.out.println("一覧を表示");
	System.out.println(map);
	System.out.println("データ数");
	System.out.println(map.size());
		
	System.out.println("データを3つ追加（重複あり）");
	map.put("test",  300);
	map.put("test1", 4);
	map.put("test2", 5);
	
	System.out.println("一覧を表示");
	System.out.println(map);
	System.out.println("データ数");
	System.out.println(map.size());

	System.out.println("データを取得");
	System.out.println(map.get("test"));
	
	System.out.println("データを2つ削除（存在しないのもあり）");
	map.remove("test1");
	map.remove("test42");
	
	System.out.println("データ数");
	System.out.println(map.size());
	
	System.out.println("クローン1");
	x = map.clone();
	System.out.println(x);
	
	System.out.println("クローン2");
	var x2 = new HashMap(x);
	System.out.println(x2);
	
	System.out.println("キーとして含まれるか");
	System.out.println(x.containsKey("test"));
	System.out.println(x.containsKey("test1"));
	
	System.out.println("値として含まれるか");
	System.out.println(x.containsValue(200));
	System.out.println(x.containsValue(300));
	
	System.out.println("それぞれに処理");
	x.each(function(key, value) {
		System.out.println("[" + key + "] = " + value);
	});
	
	System.stop();
}

System.setShowHtmlConsole(true);
System.startHtmlMain();