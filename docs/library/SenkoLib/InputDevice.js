"use strict";

/**
 * SenkoLib InputDevice.js
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
 * @returns {IDPosition}
 */
var IDPosition = function() {
	this.init();
};
IDPosition.prototype.set = function(x, y) {
	this.x = x; this.y = y;
};
IDPosition.prototype.add = function(x, y) {
	this.x += x; this.y += y;
};
IDPosition.prototype.init = function() {
	this.x = 0; this.y = 0;
};

/**
 * 押す、離すが可能なボタン
 * @returns {IDSwitch}
 */
var IDSwitch = function() {
	this.init();
};

IDSwitch.prototype.init = function() {
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
IDSwitch.prototype.keyPressed = function() {
	if(!this.ispressed) {
		this.istyped = true;
	}
	this.ispressed = true;
	this.pressed_time++;
};

/**
 * キーを離した情報
 */
IDSwitch.prototype.keyReleased = function() {
	this.ispressed  = false;
	this.isreleased = true;
	this.pressed_time = 0;
};

/**
 * フォーカスが消えたとき
 */
IDSwitch.prototype.focusLost = function() {
	this.keyReleased();
};

/**
 * 情報をうけとる。
 * トリガータイプなど1回目の情報と2回の情報で異なる場合がある。
 * @param {InputSwitch} c 取得用クラス
 */
IDSwitch.prototype.pickInput = function(c) {
	if(!(c instanceof IDSwitch)) {
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
 * @returns {IDDraggableSwitch}
 */
var IDDraggableSwitch = function(mask) {
	this.init(mask);
};

IDDraggableSwitch.prototype.init = function(mask) {
	this.mask			= mask;
	this.switch			= new IDSwitch();
	this.client			= new IDPosition();
	this.deltaBase		= new IDPosition();
	this.dragged		= new IDPosition();
};

IDDraggableSwitch.prototype.mousePressed = function(event) {
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

IDDraggableSwitch.prototype.mouseReleased = function(event) {
	var state	= event.button;
	if(state === this.mask) {
		if(this.switch.ispressed) {
			this.switch.keyReleased();
		}
	}
};

IDDraggableSwitch.prototype.mouseMoved = function(event) {
	var clientX	= event.clientX;
	var clientY	= event.clientY;
	if(this.switch.ispressed) {
		var deltaX = clientX - this.deltaBase.x;
		var deltaY = clientY - this.deltaBase.y;
		this.dragged.add(deltaX, deltaY);
	}
	this.client.set(clientX ,clientY);
	this.deltaBase.set(clientX ,clientY);
};

IDDraggableSwitch.prototype.focusLost = function() {
	this.switch.focusLost();
};

/**
 * 情報をうけとる。
 * トリガータイプなど1回目の情報と2回の情報で異なる場合がある。
 * @param {InputSwitch} c 取得用クラス
 */
IDDraggableSwitch.prototype.pickInput = function(c) {
	if(!(c instanceof IDDraggableSwitch)) {
		throw "IllegalArgumentException";
	}
	this.switch.pickInput(c.switch);
	c.client.set(this.client.x, this.client.y);
	c.dragged.set(this.dragged.x, this.dragged.y);
	this.dragged.init();
};

var IDMouseEvent = {
	BUTTON1_MASK : 0,
	BUTTON2_MASK : 1,
	BUTTON3_MASK : 2
};

var IDMouse = function() {
	this.init();
};

IDMouse.prototype.init = function() {
	this.left   = new IDDraggableSwitch(IDMouseEvent.BUTTON1_MASK);
	this.center = new IDDraggableSwitch(IDMouseEvent.BUTTON2_MASK);
	this.right  = new IDDraggableSwitch(IDMouseEvent.BUTTON3_MASK);
	this.position = new IDPosition();
	this.wheelrotation = 0;
};

IDMouse.prototype.mousePressed = function(event) {
	this.left.mousePressed(event);
	this.center.mousePressed(event);
	this.right.mousePressed(event);
};

IDMouse.prototype.mouseReleased = function(event) {
	this.left.mouseReleased(event);
	this.center.mouseReleased(event);
	this.right.mouseReleased(event);
};

IDMouse.prototype.mouseMoved = function(event) {
	this.position.x = event.clientX;
	this.position.y = event.clientY;
	this.left.mouseMoved(event);
	this.center.mouseMoved(event);
	this.right.mouseMoved(event);
};

IDMouse.prototype.mouseWheelMoved = function(event) {
	this.wheelrotation += event.wheelDelta < 0 ? -1 : 1;
};

IDMouse.prototype.focusLost = function() {
	this.left.focusLost();
	this.center.focusLost();
	this.right.focusLost();
};

IDMouse.prototype.pickInput = function(c) {
	if(!(c instanceof IDMouse)) {
		throw "IllegalArgumentException";
	}
	this.left.pickInput(c.left);
	this.center.pickInput(c.center);
	this.right.pickInput(c.right);
	c.position.set(this.position.x, this.position.y);
	c.wheelrotation = this.wheelrotation;
	this.wheelrotation = 0;
};

IDMouse.prototype.setListenerOnElement = function(element) {
	var that = this;
	var node = element;
	var iscanvas = element.tagName === "CANVAS";
	var correction = function(event) {
		if(!iscanvas) {
			return event;
		}
		else {
			var e = {
				clientX	: event.clientX / node.clientWidth  * node.width,
				clientY	: event.clientY / node.clientHeight * node.height,
				button	: event.button
			};
			return e;
		}
	};
	
	var touchStart = function(event) {
		var e = {
			clientX : event.changedTouches[0].clientX,
			clientY : event.changedTouches[0].clientY,
			button : IDMouseEvent.BUTTON1_MASK
		};
		that.mousePressed(correction(e));
	};
	var touchEnd = function(event) {
		var e = {
			clientX : event.changedTouches[0].clientX,
			clientY : event.changedTouches[0].clientY,
			button : IDMouseEvent.BUTTON1_MASK
		};
		that.mouseReleased(correction(e));
	};
	var touchMove = function(event) {
		var e = {
			clientX : event.changedTouches[0].clientX,
			clientY : event.changedTouches[0].clientY,
			button : IDMouseEvent.BUTTON1_MASK
		};
		that.mouseMoved(correction(e));
		e.preventDefault();
	};
	var mousePressed = function(e) {
		that.mousePressed(correction(e));
	};
	var mouseReleased = function(e) {
		that.mouseReleased(correction(e));
	};
	var mouseMoved = function(e) {
		that.mouseMoved(correction(e));
	};
	var focusLost = function(e) {
		that.focusLost();
	};
	var mouseWheelMoved = function(e) {
		that.mouseWheelMoved(e);
		e.preventDefault();
	};
	var contextMenu  = function(e) {
		e.preventDefault();
	};
	element.style.cursor = "crosshair";
	// 非選択化
	element.style.mozUserSelect			= "none";
	element.style.webkitUserSelect		= "none";
	element.style.msUserSelect			= "none";
	// メニュー非表示化
	element.style.webkitTouchCallout	= "none";
	// タップのハイライトカラーを消す
	element.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
	
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