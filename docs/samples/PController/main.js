/* global System, SComponent */

﻿function main(args) {
	
	System.out.println("PhysicalInput クラスのサンプル");
	
	var scanvas;
	scanvas = new SCanvas();
	scanvas.putMe("scomponent", SComponent.putype.IN);
	scanvas.setUnit(SComponent.unittype.PX);
	scanvas.setPixelSize(640, 480);
	scanvas.setSize(640, 480);
	
	scanvas.getElement().style.borderStyle		= "solid";
	scanvas.getElement().style.borderWidth		= "1px";
	scanvas.getElement().style.backgroundColor	= "silver";
	var ctx = scanvas.getContext();
	
	var mouse = new PCMouse();
	mouse.setListenerOnElement(scanvas.getElement());
	
	var checkMouse = function() {
		var data = new PCMouse();
		mouse.pickInput(data);
		System.out.println("position      "		+ data.position.x + "," + data.position.y);
		System.out.println("wheelrotation "		+ data.wheelrotation);
		System.out.println("dragged       "		+ data.left.dragged.x + "," + data.left.dragged.y);
		System.out.println("ispressed  "		+ data.left.switch.ispressed);
		System.out.println("isreleased "		+ data.left.switch.isreleased);
		System.out.println("istyped    "		+ data.left.switch.istyped);
		if(data.left.switch.ispressed) {
			ctx.beginPath();
			ctx.arc( data.position.x, data.position.y, 5, 0, 2 * Math.PI, true);
			ctx.fill();
		}
	};
	
	setInterval(checkMouse, 500);
}

