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
 * @param {Number} x 任意
 * @param {Number} y 任意
 * @returns {IDPosition}
 */
var IDPosition = function(x, y) {
	this.init();
	if(x instanceof IDPosition) {
		var position = x;
		this.set(position);
	}
	else if(arguments.length === 2) {
		this.set(x, y);
	}
};
IDPosition.prototype.set = function(x, y) {
	if(x instanceof IDPosition) {
		var position = x;
		this.x = position.x; this.y = position.y;
	}
	else {
		this.x = x; this.y = y;
	}
};
IDPosition.prototype.add = function(x, y) {
	if(x instanceof IDPosition) {
		var position = x;
		this.x += position.x; this.y += position.y;
	}
	else {
		this.x += x; this.y += y;
	}
};
IDPosition.prototype.sub = function(x, y) {
	if(x instanceof IDPosition) {
		var position = x;
		this.x -= position.x; this.y -= position.y;
	}
	else {
		this.x -= x; this.y -= y;
	}
};
IDPosition.prototype.init = function() {
	this.x = 0; this.y = 0;
};
IDPosition.prototype.clone = function() {
	var ret = new IDPosition(this);
	return ret;
};
IDPosition.norm = function(p1, p2) {
	var x = p1.x - p2.x;
	var y = p1.y - p2.y;
	return Math.sqrt(x * x + y * y);
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

IDSwitch.prototype.clone = function() {
	var ret = new IDSwitch();
	ret.istyped			= this.istyped;
	ret.ispressed		= this.ispressed;
	ret.isreleased		= this.isreleased;
	ret.pressed_time	= this.pressed_time;
	return ret;
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

IDDraggableSwitch.prototype.clone = function() {
	var ret = new IDDraggableSwitch();
	ret.mask			= this.mask;
	ret.switch			= this.switch.clone();
	ret.client			= this.client.clone();
	ret.deltaBase		= this.deltaBase.clone();
	ret.dragged			= this.dragged.clone();
	return ret;
};

IDDraggableSwitch.prototype.correctionForDOM = function(event) {
	// イベントが発生したノードの取得
	var node = event.target;
	if(!node) {
		// IE?
		node = event.currentTarget;
	}
	if(node === undefined) {
		return new IDPosition(
			event.clientX,
			event.clientY
		);
	}
	else {
		// ノードのサイズが変更されていることを考慮する
		// width / height が内部のサイズ
		// clientWidth / clientHeight が表示上のサイズ
		return new IDPosition(
			(event.clientX / node.clientWidth)  * node.width,
			(event.clientY / node.clientHeight) * node.height
		);
	}
};

IDDraggableSwitch.prototype.setPosition = function(event) {
	// 強制的にその位置に全ての値をセットする
	var position = this.correctionForDOM(event);
	this.client.set(position);
	this.deltaBase.set(position);
	this.dragged.init();
};

IDDraggableSwitch.prototype.mousePressed = function(event) {
	var position = this.correctionForDOM(event);
	var state	= event.button;
	if(state === this.mask) {
		if(!this.switch.ispressed) {
			this.dragged.init();
		}
		this.switch.keyPressed();
		this.client.set(position);
		this.deltaBase.set(position);
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
	var position = this.correctionForDOM(event);
	if(this.switch.ispressed) {
		var delta = new IDPosition(position);
		delta.sub(this.deltaBase);
		this.dragged.add(delta);
	}
	this.client.set(position.x ,position.y);
	this.deltaBase.set(position.x ,position.y);
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
	c.client.set(this.client);
	c.dragged.set(this.dragged);
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

IDMouse.prototype.clone = function() {
	var ret = new IDMouse();
	ret.left		= this.left.clone();
	ret.center		= this.center.clone();
	ret.right		= this.right.clone();
	ret.position	= this.position.clone();
	ret.wheelrotation = this.wheelrotation;
	return ret;
};

IDMouse.prototype.mousePressed = function(mouseevent) {
	this.left.mousePressed(mouseevent);
	this.center.mousePressed(mouseevent);
	this.right.mousePressed(mouseevent);
};

IDMouse.prototype.mouseReleased = function(mouseevent) {
	this.left.mouseReleased(mouseevent);
	this.center.mouseReleased(mouseevent);
	this.right.mouseReleased(mouseevent);
};

IDMouse.prototype.mouseMoved = function(mouseevent) {
	this.left.mouseMoved(mouseevent);
	this.center.mouseMoved(mouseevent);
	this.right.mouseMoved(mouseevent);
	this.position.x = this.left.client.x;
	this.position.y = this.left.client.y;
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
	c.position.set(this.position);
	c.wheelrotation = this.wheelrotation;
	this.wheelrotation = 0;
};

IDMouse.prototype.setListenerOnElement = function(element) {
	var that = this;
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
	
	element.addEventListener("mousedown",	mousePressed, false );
	element.addEventListener("mouseup",		mouseReleased, false );
	element.addEventListener("mousemove",	mouseMoved, false );
	element.addEventListener("mouseout",	focusLost, false );
	element.addEventListener("wheel",		mouseWheelMoved, false );
	element.addEventListener("contextmenu",	contextMenu, false );
};

/**
 * 指3本まで対応するタッチデバイス
 * 1本目は左クリックに相当
 * 2本目は右クリックに相当
 * 3本目は中央クリックに相当
 * @returns {IDTouch}
 */
var IDTouch = function() {
	this.super = IDMouse.prototype;
	this.super.init.call(this);
	this.init();
};
IDTouch.prototype = new IDMouse();
IDTouch.prototype.init = function() {
	this.touchcount_to_mask = {
		1 : IDMouseEvent.BUTTON1_MASK,
		2 : IDMouseEvent.BUTTON3_MASK,
		3 : IDMouseEvent.BUTTON2_MASK
	};
	var that = this;
	this._mousePressed = function(e) {
		that.mousePressed(e);
	};
	this._mouseReleased = function(e) {
		that.mouseReleased(e);
	};
	this._mouseMoved = function(e) {
		that.mouseMoved(e);
	};
	this.isdoubletouch	= false;
};

IDTouch.prototype._initPosition = function(mouseevent) {
	this.left.setPosition(mouseevent);
	this.right.setPosition(mouseevent);
	this.center.setPosition(mouseevent);
};

IDTouch.prototype._MultiTouchToMouse = function(touchevent) {
	var x = 0, y = 0;
	// 座標はすべて平均値の位置とします。
	// identifier を使用すれば、1本目、2本目と管理できますが、実装は未対応となっています。
	for(var i = 0;i < touchevent.touches.length; i++) {
		x += touchevent.touches[i].clientX;
		y += touchevent.touches[i].clientY;
	}
	var event = {};
	if(touchevent.touches.length > 0) {
		event.clientX = x / touchevent.touches.length;
		event.clientY = y / touchevent.touches.length;
		event.button  = this.touchcount_to_mask[touchevent.touches.length];
		var touch = touchevent.touches[0];
		event.target  = touch.target ? touch.target : touch.currentTarget;
	}
	else {
		event.clientX = 0;
		event.clientY = 0;
		event.button  = 0;
	}
	event.touchcount = touchevent.touches.length;
	return event;
};

IDTouch.prototype._MoveMultiTouch = function(touchevent) {
	if(touchevent.touches.length === 2) {
		var p1 = touchevent.touches[0];
		var p2 = touchevent.touches[1];
		if(this.isdoubletouch === false) {
			this.isdoubletouch = true;
			this.doubleposition = [];
			this.doubleposition[0] = new IDPosition(p1.clientX, p1.clientY);
			this.doubleposition[1] = new IDPosition(p2.clientX, p2.clientY);
		}
		else {
			// 前回との2点間の距離の増加幅を調べる
			// これによりピンチイン／ピンチアウト操作がわかる。
			var newp1 = new IDPosition(p1.clientX, p1.clientY);
			var newp2 = new IDPosition(p2.clientX, p2.clientY);
			var x = IDPosition.norm(this.doubleposition[0], this.doubleposition[1]) - IDPosition.norm(newp1, newp2);
			this.doubleposition[0] = newp1;
			this.doubleposition[1] = newp2;
			this.wheelrotation += (x < 0 ? -1 : 1) * 0.5;
		}
	}
	else {
		this.isdoubletouch === false;
	}
	
};

IDTouch.prototype._actFuncMask = function(mouseevent, funcOn, funcOff, target) {
	for(var key in IDMouseEvent) {
		mouseevent.button = IDMouseEvent[key];
		if(IDMouseEvent[key] === target) {
			funcOn(mouseevent);
		}
		else {
			funcOff(mouseevent);
		}
	}
};

IDTouch.prototype.touchStart = function(touchevent) {
	var mouseevent = this._MultiTouchToMouse(touchevent);
	// タッチした時点ですべての座標を初期化する
	this._initPosition(mouseevent);
	this._actFuncMask(
		mouseevent,
		this._mousePressed,
		this._mouseReleased,
		mouseevent.button
	);
};
IDTouch.prototype.touchEnd = function(touchevent) {
	var mouseevent = this._MultiTouchToMouse(touchevent);
	this._actFuncMask(
		mouseevent,
		this._mouseReleased,
		this._mouseReleased,
		mouseevent.button
	);
};
IDTouch.prototype.touchMove = function(touchevent) {
	this._MoveMultiTouch(touchevent);
	var mouseevent = this._MultiTouchToMouse(touchevent);
	this._actFuncMask(
		mouseevent,
		this._mouseMoved,
		this._mouseMoved,
		mouseevent.button
	);
};

IDTouch.prototype.setListenerOnElement = function(element) {
	this.super.setListenerOnElement.call(this, element);
	
	var that = this;
	var touchStart = function(touchevent) {
		that.touchStart(touchevent);
	};
	var touchEnd = function(touchevent) {
		that.touchEnd(touchevent);
	};
	var touchMove = function(touchevent) {
		that.touchMove(touchevent);
		// スクロール禁止
		touchevent.preventDefault();
	};
	
	element.addEventListener("touchstart",	touchStart, false );
	element.addEventListener("touchend",	touchEnd, false );
	element.addEventListener("touchmove",	touchMove, false );
	element.addEventListener("touchcancel",	touchEnd, false );
};





var IDTools = {
	
	noScroll : function() {
		// 縦のスクロールバーを削除
		var main = function() {
			// body
			document.body.style.height			= "100%";
			document.body.style.overflow		= "hidden";
			// html
			document.documentElement.height		= "100%";
			document.documentElement.overflow	= "hidden";
		};
		window.addEventListener("load", main, false);
	}
	
};