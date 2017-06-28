function main(args) {
	var map, x;
	
	System.out.println("StringTools クラスのサンプル");
	
	System.out.println(StringTools.deleteStartCharacter("1234567890", 2));
	
	System.out.println(StringTools.deleteEndCharacter("1234567890", 2));
	
	System.out.println(StringTools.getStartCharacter("1234567890", 2));
	
	System.out.println(StringTools.getEndCharacter("1234567890", 2));
	
	System.out.println(StringTools.rightFirstString("1*2*3", "*"));
	System.out.println(StringTools.rightLastString("1*2*3", "*"));
	System.out.println(StringTools.leftFirstString("1*2*3", "*"));
	System.out.println(StringTools.leftLastString("1*2*3", "*"));
	
	var x;
	
	x = StringTools.getMatchWords("test1c1test2c2test3", /c.{2}/);
	for(var i = 0; i < x.length; i++) {
		System.out.println("["+ i + "] " + x[i].offset + "\t" + x[i].word + "\t" + x[i].length);
	}
	
	x = StringTools.getStringsBetweenWords("test1c1test2c2test3", /c.{2}/);
	for(var i = 0; i < x.length; i++) {
		System.out.println("["+ i + "] " + x[i]);
	}
	
	System.stop();
}
