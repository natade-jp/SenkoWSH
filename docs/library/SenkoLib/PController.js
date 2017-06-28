"use strict";

/**
 * SenkoLib PController.js
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 *
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 *
 * DEPENDENT LIBRARIES:
 *  なし
 */

/**
 * 位置情報
 * @returns {PCPosition}
 */
var PCPosition = function() {
	this.init();
};
PCPosition.prototype.set = function(x, y) {
	this.x = x; this.y = y;
};
PCPosition.prototype.add = function(x, y) {
	this.x += x; this.y += y;
};
PCPosition.prototype.init = function() {
	this.x = 0; this.y = 0;
};

/**
 * 押す、離すが可能なボタン
 * @returns {PCSwitch}
 */
var PCSwitch = function() {
	this.init();
};

PCSwitch.prototype.init = function() {
	/**
	 * 押した瞬間に反応
	 */
	this.istyped		= false;
	
	/**
	 * 押している間に反応
	 */
	this.ispressed		= false;
	
	/**
	 * 離した瞬間に反応
	 */
	this.isreleased		= false;
	
	/**
	 * 押している時間に反応
	 */
	this.pressed_time	= 0;
};

/**
 * キーを押した情報
 */
PCSwitch.prototype.keyPressed = function() {
	if(!this.ispressed) {
		this.istyped = true;
	}
	this.ispressed = true;
	this.pressed_time++;
};

/**
 * キーを離した情報
 */
PCSwitch.prototype.keyReleased = function() {
	this.ispressed  = false;
	this.isreleased = true;
	this.pressed_time = 0;
};

/**
 * フォーカスが消えたとき
 */
PCSwitch.prototype.focusLost = function() {
	this.keyReleased();
};

/**
 * 情報をうけとる。
 * トリガータイプなど1回目の情報と2回の情報で異なる場合がある。
 * @param {InputSwitch} c 取得用クラス
 */
PCSwitch.prototype.pickInput = function(c) {
	if(!(c instanceof PCSwitch)) {
		throw "IllegalArgumentException";
	}
	c.ispressed			= this.ispressed;
	c.istyped			= this.istyped;
	c.isreleased		= this.isreleased;
	c.pressed_time		= this.pressed_time;
	this.isreleased		= false;
	this.istyped		= false;
};

/**
 * 動かすことが可能なクラス
 * @param {Integer} mask
 * @returns {PCDraggableSwitch}
 */
var PCDraggableSwitch = function(mask) {
	this.init(mask);
};

PCDraggableSwitch.prototype.init = function(mask) {
	this.mask			= mask;
	this.switch			= new PCSwitch();
	this.client			= new PCPosition();
	this.deltaBase		= new PCPosition();
	this.dragged		= new PCPosition();
};

PCDraggableSwitch.prototype.mousePressed = function(event) {
	var clientX	= event.clientX;
	var clientY	= event.clientY;
	var state	= event.button;
	if(state === this.mask) {
		if(!this.switch.ispressed) {
			this.dragged.init();
		}
		this.switch.keyPressed();
		this.client.set(clientX ,clientY);
		this.deltaBase.set(clientX ,clientY);
	}
};

PCDraggableSwitch.prototype.mouseReleased = function(event) {
	var state	= event.button;
	if(state === this.mask) {
		if(this.switch.ispressed) {
			this.switch.keyReleased();
		}
	}
};

PCDraggableSwitch.prototype.mouseMoved = function(e) {
	var clientX	= e.clientX;
	var clientY	= e.clientY;
	if(this.switch.ispressed) {
		var deltaX = clientX - this.deltaBase.x;
		var deltaY = clientY - this.deltaBase.y;
		this.dragged.add(deltaX, deltaY);
	}
	this.client.set(clientX ,clientY);
	this.deltaBase.set(clientX ,clientY);
};

PCDraggableSwitch.prototype.focusLost = function() {
	this.switch.focusLost();
};

/**
 * 情報をうけとる。
 * トリガータイプなど1回目の情報と2回の情報で異なる場合がある。
 * @param {InputSwitch} c 取得用クラス
 */
PCDraggableSwitch.prototype.pickInput = function(c) {
	if(!(c instanceof PCDraggableSwitch)) {
		throw "IllegalArgumentException";
	}
	this.switch.pickInput(c.switch);
	c.client.set(this.client.x, this.client.y);
	c.dragged.set(this.dragged.x, this.dragged.y);
	this.dragged.init();
};

var PCMouseEvent = {
	BUTTON1_MASK : 0,
	BUTTON2_MASK : 1,
	BUTTON3_MASK : 2
};

var PCMouse = function() {
	this.init();
};

PCMouse.prototype.init = function() {
	this.left   = new PCDraggableSwitch(PCMouseEvent.BUTTON1_MASK);
	this.center = new PCDraggableSwitch(PCMouseEvent.BUTTON2_MASK);
	this.right  = new PCDraggableSwitch(PCMouseEvent.BUTTON3_MASK);
	this.position = new PCPosition();
	this.wheelrotation = 0;
};

PCMouse.prototype.mousePressed = function(event) {
	this.left.mousePressed(event);
	this.center.mousePressed(event);
	this.right.mousePressed(event);
};

PCMouse.prototype.mouseReleased = function(event) {
	this.left.mouseReleased(event);
	this.center.mouseReleased(event);
	this.right.mouseReleased(event);
};

PCMouse.prototype.mouseMoved = function(event) {
	this.position.x = event.clientX;
	this.position.y = event.clientY;
	this.left.mouseMoved(event);
	this.center.mouseMoved(event);
	this.right.mouseMoved(event);
};

PCMouse.prototype.mouseWheelMoved = function(event) {
	this.wheelrotation += event.wheelDelta < 0 ? -1 : 1;
};

PCMouse.prototype.focusLost = function() {
	this.left.focusLost();
	this.center.focusLost();
	this.right.focusLost();
};

PCMouse.prototype.pickInput = function(c) {
	if(!(c instanceof PCMouse)) {
		throw "IllegalArgumentException";
	}
	this.left.pickInput(c.left);
	this.center.pickInput(c.center);
	this.right.pickInput(c.right);
	c.position.set(this.position.x, this.position.y);
	c.wheelrotation = this.wheelrotation;
	this.wheelrotation = 0;
};

PCMouse.prototype.setListenerOnElement = function(element) {
	var that = this;
	var touchStart = function(event) {
		var e = {
			clientX : event.changedTouches[0].clientX,
			clientY : event.changedTouches[0].clientY,
			button : PCMouseEvent.BUTTON1_MASK
		};
		that.mousePressed(e);
	};
	var touchEnd = function(event) {
		var e = {
			clientX : event.changedTouches[0].clientX,
			clientY : event.changedTouches[0].clientY,
			button : PCMouseEvent.BUTTON1_MASK
		};
		that.mouseReleased(e);
	};
	var touchMove = function(event) {
		var e = {
			clientX : event.changedTouches[0].clientX,
			clientY : event.changedTouches[0].clientY,
			button : PCMouseEvent.BUTTON1_MASK
		};
		that.mouseMoved(e);
		e.preventDefault();
	};
	var mousePressed = function(e) {
		that.mousePressed(e);
	};
	var mouseReleased = function(e) {
		that.mouseReleased(e);
	};
	var mouseMoved = function(e) {
		that.mouseMoved(e);
	};
	var focusLost = function(e) {
		that.focusLost(e);
	};
	var mouseWheelMoved = function(e) {
		that.mouseWheelMoved(e);
		e.preventDefault();
	};
	var contextMenu  = function(e) {
		e.preventDefault();
	};
	element.style.cursor = "crosshair";
	element.style.mozUserSelect			= "none";
	element.style.webkitUserSelect		= "none";
	element.style.msUserSelect			= "none";
	element.style.webkitTouchCallout	= "none";
	element.addEventListener("touchstart",	touchStart, false );
	element.addEventListener("touchend",	touchEnd, false );
	element.addEventListener("touchmove",	touchMove, false );
	element.addEventListener("mousedown",	mousePressed, false );
	element.addEventListener("mouseup",		mouseReleased, false );
	element.addEventListener("mousemove",	mouseMoved, false );
	element.addEventListener("mouseout",	focusLost, false );
	element.addEventListener("wheel",		mouseWheelMoved, false );
	element.addEventListener("contextmenu",	contextMenu, false );
};