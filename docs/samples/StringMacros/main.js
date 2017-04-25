function main(args) {
	var map, x;
	
	System.out.println("StringMacros クラスのサンプル");
	
	System.out.println(StringMacros.deleteStartCharacter("1234567890", 2));
	
	System.out.println(StringMacros.deleteEndCharacter("1234567890", 2));
	
	System.out.println(StringMacros.getStartCharacter("1234567890", 2));
	
	System.out.println(StringMacros.getEndCharacter("1234567890", 2));
	
	System.out.println(StringMacros.rightFirstString("1*2*3", "*"));
	System.out.println(StringMacros.rightLastString("1*2*3", "*"));
	System.out.println(StringMacros.leftFirstString("1*2*3", "*"));
	System.out.println(StringMacros.leftLastString("1*2*3", "*"));
	
	var x;
	
	x = StringMacros.getMatchWords("test1c1test2c2test3", /c.{2}/);
	for(var i = 0; i < x.length; i++) {
		System.out.println("["+ i + "] " + x[i].offset + "\t" + x[i].word + "\t" + x[i].length);
	}
	
	x = StringMacros.getStringsBetweenWords("test1c1test2c2test3", /c.{2}/);
	for(var i = 0; i < x.length; i++) {
		System.out.println("["+ i + "] " + x[i]);
	}
	
	System.stop();
}

System.setShowHtmlConsole(true);
System.startHtmlMain();