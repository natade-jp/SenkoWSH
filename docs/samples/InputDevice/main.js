/* global System, SComponent, IDTools, Color */

﻿function main(args) {
	
	System.out.println("InputDevice クラスのサンプル");
	
	// 縦スクロール防止
	IDTools.noScroll();
	
	var scanvas;
	scanvas = new SCanvas();
	scanvas.putMe("scomponent", SComponent.putype.IN);
	scanvas.setUnit(SComponent.unittype.PX);
	scanvas.setPixelSize(640, 480);
	scanvas.setSize(640, 480);
	var canvas = scanvas.getCanvas();
	
	canvas.style.backgroundColor	= "black";
	var ctx = scanvas.getContext();
	
	var mouse = new IDTouch();
	mouse.setListenerOnElement(scanvas.getElement());
	var times = 0;
	
	var checkMouse = function() {
		var data = new IDTouch();
		mouse.pickInput(data);
		System.out.println("time[" + (times++) + "]");
		System.out.println("position      "		+ data.position.x + "," + data.position.y);
		System.out.println("wheelrotation "		+ data.wheelrotation);
		System.out.println("draggedL       "	+ data.left.dragged.x	+ "," + data.left.dragged.y);
		System.out.println("draggedR       "	+ data.right.dragged.x	+ "," + data.right.dragged.y);
		System.out.println("ispressed  "		+ data.left.switch.ispressed	+ "," + data.right.switch.ispressed		+ "," + data.center.switch.ispressed);
		System.out.println("isreleased "		+ data.left.switch.isreleased	+ "," + data.right.switch.isreleased	+ "," + data.center.switch.isreleased);
		System.out.println("istyped    "		+ data.left.switch.istyped		+ "," + data.right.switch.istyped		+ "," + data.center.switch.istyped);
		var color;
		var ispressed = data.left.switch.ispressed || data.right.switch.ispressed || data.center.switch.ispressed;
		if(data.left.switch.ispressed) {
			color = Color.newColorNormalizedHSV(times * 0.1, 1.0, 1.0, 0.8);
		}
		else if(data.right.switch.ispressed) {
			color = Color.newColorNormalizedHSV(times * 0.1, 0.1, 1.0, 0.8);
		}
		else if(data.center.switch.ispressed) {
			color = Color.newColorNormalizedHSV(times * 0.1, 1.0, 0.1, 0.8);
		}
		if(ispressed) {
			ctx.beginPath();
			ctx.fillStyle = color.getCSS255();
			ctx.arc( data.position.x, data.position.y, 50, 0, 2 * Math.PI, true);
			ctx.fill();
		}
	};
	
	//setTimeout(checkMouse, 250);
	setInterval(checkMouse, 250);
}

