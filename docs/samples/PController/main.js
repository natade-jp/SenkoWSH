/* global System, SComponent */

﻿function main(args) {
	
	System.out.println("PhysicalInput クラスのサンプル");
	
	var scanvas;
	scanvas = new SCanvas();
	scanvas.putMe("scomponent", SComponent.putype.IN);
	scanvas.setUnit(SComponent.unittype.PX);
	scanvas.setPixelSize(640, 480);
	scanvas.setSize(640, 480);
	var canvas = scanvas.getCanvas();
	
	canvas.style.borderStyle		= "solid";
	canvas.style.borderColor		= "silver";
	canvas.style.borderWidth		= "5px";
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
			ctx.fillStyle = "rgba(240, 240, 255, 0.5)";
			var x = data.position.x / canvas.clientWidth  * canvas.width;
			var y = data.position.y / canvas.clientHeight * canvas.height;
			ctx.arc( x, y, 50, 0, 2 * Math.PI, true);
			ctx.fill();
		}
	};
	
	setInterval(checkMouse, 250);
}

