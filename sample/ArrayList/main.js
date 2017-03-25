function main(args) {
	var list, list2, compare;
	
	System.out.println("ArrayList クラスのサンプル(多分Javaと大体同じだと思う)");
	
	list = new ArrayList();

	System.out.println("データを追加");
	for(var i = 0;i < 10; i++) {
		list.add(Math.random());
	}

	System.out.println("一覧を表示");
	System.out.println(list);
	
	System.out.println("データ数");
	System.out.println(list.size());
	
	System.out.println("昇順ソート(内部は安定ソート使ってます)");
	list.sort();
	System.out.println(list);
	
	compare = function(a, b) {
		if(a === b) {
			return(0);
		}
		if(typeof a === typeof b) {
			return(a < b ? 1 : -1);
		}
		return((typeof a < typeof b) ? 1 : -1);
	};
	
	System.out.println("比較関数を用意すれば降順にもできます");
	list.sort(compare);
	System.out.println(list);
	
	System.out.println("5つ追加して");
	list2 = new ArrayList();
	for(var i = 100;i < 104; i++) {
		list2.add(i);
	}
	System.out.println(list2);
	
	System.out.println("1から2を削除");
	list2.removeRange(1, 3);
	System.out.println(list2);
	
	System.out.println("結合");
	list.addAll(0, list2);
	System.out.println(list);
	
	System.out.println("クローン1");
	var list3 = list.clone();
	System.out.println(list3);
	
	System.out.println("クローン2");
	var list4 = new ArrayList(list);
	System.out.println(list4);
	
	System.out.println("それぞれに処理");
	list.each(function(index, value) {
		System.out.println(index + " -> " + value);
	});
	
	System.stop();
}

System.startHtmlMain();