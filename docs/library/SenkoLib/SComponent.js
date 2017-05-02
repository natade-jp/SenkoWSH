/* global System, Text */

﻿/**
 * SComponent.js
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  CC0					(http://sciencecommons.jp/cc0/about)
 *
 * DEPENDENT LIBRARIES:
 */

var SComponent = function() {
};

SComponent._counter			= 0;
SComponent.CLASS_MOUSEOVER	= "SCOMPONENT_MouseOver";
SComponent.CLASS_MOUSEDOWN	= "SCOMPONENT_MouseDown";
SComponent.CLASS_DISABLED	= "SCOMPONENT_Disabled";
SComponent.CLASS_COMPONENT	= "SCOMPONENT_Component";
SComponent.CLASS_NEWLINE	= "SCOMPONENT_Newline";
SComponent.CLASS_SPACE		= "SCOMPONENT_Space";
SComponent.CLASS_PANEL		= "SCOMPONENT_Panel";
SComponent.CLASS_LABEL		= "SCOMPONENT_Label";
SComponent.CLASS_BUTTON		= "SCOMPONENT_Button";
SComponent.CLASS_FILE		= "SCOMPONENT_File";
SComponent.CLASS_CANVAS		= "SCOMPONENT_Canvas";

SComponent.putype = {
	IN		: 0,
	LEFT	: 1,
	NEWLINE	: 2
};
SComponent.unittype = {
	PX		: "px",
	EM		: "em",
	PERCENT	: "%"
};
SComponent.prototype.setText = function(title) {
	if(!title) {
		return;
	}
	var element = this.getElement();
	if(element.tagName === "INPUT") {
		element.setAttribute("value", title);
	}
	else {
		//element.innerText = title;
		var childelement = element.firstChild;
		if(!(childelement instanceof Text)) {
			var text_node = document.createTextNode("");
			if(childelement === null) {
				element.appendChild(text_node);
			}
			else {
				element.insertBefore(text_node, childelement);
			}
			childelement = text_node;
		}
		childelement.nodeValue = title;
	}
};
SComponent.prototype.getText = function() {
	var element = this.getElement();
	var title = null;
	if(element.tagName === "INPUT") {
		title = this.getElement().getAttribute("value");
	}
	else {
		title = this.getElement().innerText;
	}
	return (title === null) ? "" : title;
};
SComponent.prototype._setBooleanAttribute = function(element, attribute, isset) {
	if((	!(typeof attribute === "string") &&
			!(attribute instanceof String)) ||
			(typeof isset !== "boolean")) {
		throw "IllegalArgumentException";
	}
	if(element.tagName !== "INPUT") {
		throw "not input";
	}
	var checked = element.getAttribute(attribute);
	if(checked === null) {
		if(!isset) {
			element.setAttribute(attribute, "true");
		}
	}
	else {
		if(isset) {
			element.removeAttribute(attribute);
		}
	}
};
SComponent.prototype._isBooleanAttribute = function(element, attribute) {
	if( !(typeof attribute === "string") &&
		!(attribute instanceof String)) {
		throw "IllegalArgumentException";
	}
	if(element.tagName !== "INPUT") {
		throw "not input";
	}
	return (element.getAttribute(attribute) === null);
};

SComponent.prototype.setChecked = function(ischecked) {
	this._setBooleanAttribute(this.getElement(), "checked", ischecked);
};
SComponent.prototype.isChecked = function() {
	return this._isBooleanAttribute(this.getElement(), "checked");
};
SComponent.prototype.setEnabled = function(isenabled) {
	if(isenabled) {
		this.removeClass(SComponent.CLASS_DISABLED);
	}
	else {
		this.addClass(SComponent.CLASS_DISABLED);
	}
	this._setBooleanAttribute(this.getElement(), "disabled", isenabled);
};
SComponent.prototype.isEnabled = function() {
	return this._isBooleanAttribute(this.getElement(), "disabled");
};
SComponent.prototype.getId = function() {
	return this.id;
};
SComponent.prototype.getUnit = function() {
	return this.unittype;
};
SComponent.prototype.setUnit = function(unittype) {
	this.unittype = unittype;
};
SComponent.prototype.addClass = function(classname) {
	var element = this.getElement();
	var classdata = element.getAttribute("class");
	if(classdata === null) {
		element.setAttribute("class", classname);
		return;
	}
	element.setAttribute("class", classdata + " " + classname);
};
SComponent.prototype.removeClass = function(classname) {
	var element = this.getElement();
	var classdata = element.getAttribute("class");
	if(classdata === null) {
		return;
	}
	var pattern = new RegExp( " *" + classname + " *" , "g");
	if(!pattern.test(classdata)) {
		return;
	}
	classdata = classdata.replace(pattern, "");
	element.setAttribute("class", classdata);
};
SComponent.prototype._initComponent = function(elementtype, title) {
	this.id				= "SComponent_" + (SComponent._counter++).toString(16);
	this.wallid			= "SComponent_" + (SComponent._counter++).toString(16);
	this.isshow			= false;
	this._element		= null;
	this._wall			= null;
	this.elementtype	= elementtype;
	this.unit			= SComponent.unittype.EM;
	
	this.tool			= {
		removeAttribute : function(id, attribute) {
			var element = document.getElementById(id);
			if(element) {
				if(element.getAttribute(attribute) !== null) {
					element.removeAttribute(attribute);
				}
			}
		},
		remove : function(id) {
			var element = document.getElementById(id);
			if(element) {
				if (element.parentNode) {
					element.parentNode.removeChild(element);
				}
			}
			return element;
		},
		AputB : function(node, component, type) {
			if(!(component instanceof SComponent)) {
				throw "IllegalArgumentException";
			}
			var insertNext = function(newNode, referenceNode) {
				if(referenceNode.nextSibling) {
					referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
				}
				else {
					referenceNode.parentNode.appendChild(newNode);
				}
			};
			component.remove();
			if(type === SComponent.putype.IN) {
				// 最後の行があるならば次の行へ
				component.onAdded();
				if(node.lastChild !== null) {
					component.getWall(SComponent.putype.NEWLINE).style.display = "block";
					node.appendChild(component.getWall());
				}
				component.getElement().style.display = "inline-block";
				node.appendChild(component.getElement());
			}
			else {
				if(node.parentNode === null) {
					throw "not found element on the html";
				}
				component.onAdded();
				insertNext(component.getWall(type), node);
				insertNext(component.getElement(), component.getWall(type));
				if(type === SComponent.putype.RIGHT) {
					node.style.display = "inline-block";
					component.getWall(type).style.display = "inline-block";
					component.getElement().style.display = "inline-block";
				}
				else if(type === SComponent.putype.NEWLINE) {
					node.style.display = "inline-block";
					component.getWall(type).style.display = "block";
					component.getElement().style.display = "inline-block";
				}
			}
		}
	};
	
	this.setText(title);
};

SComponent.prototype.getWidth = function() {
	var width = this.getElement().style.width;
	if(width === null) {
		return null;
	}
	width = width.match(/[\+\-]?\s*[0-9]*\.?[0-9]*/)[0];
	return parseFloat(width);
};
SComponent.prototype.getHeight = function() {
	var height = this.getElement().style.height;
	if(height === null) {
		return null;
	}
	height = height.match(/[\+\-]?\s*[0-9]*\.?[0-9]*/)[0];
	return parseFloat(height);
};
SComponent.prototype.getSize = function() {
	return { width : this.getWidth(), height : this.getHeight() };
};
SComponent.prototype.setWidth = function(width) {
	if(typeof width !== "number") {
		throw "IllegalArgumentException";
	}
	this.getElement().style.width = width.toString() + this.unit;
};
SComponent.prototype.setHeight = function(height) {
	if(typeof height !== "number") {
		throw "IllegalArgumentException";
	}
	this.getElement().style.height = height.toString() + this.unit;
};
SComponent.prototype.setSize = function(width, height) {
	this.setWidth(width);
	this.setHeight(height);
};
SComponent.prototype.remove = function() {
	this.tool.remove(this.id);
	this.tool.remove(this.space_id);
};
SComponent.prototype.onAdded = function() {
};
SComponent.prototype.getWall = function(type) {
	// すでに作成済みならそれを返して、作っていないければ作る
	if(this._wall) {
		return this._wall;
	}
	var wall = document.createElement("span");
	wall.setAttribute("id", this.wallid);
	if(type === SComponent.putype.RIGHT) {
		wall.setAttribute("class", SComponent.CLASS_SPACE);
	}
	else if(type === SComponent.putype.NEWLINE) {
		wall.setAttribute("class", SComponent.CLASS_NEWLINE);
	}
	wall.style.display = "inline-block";
	this._wall = wall;
	return wall;
};

SComponent.prototype.getElement = function() {
	// すでに作成済みならそれを返して、作っていないければ作る
	if(this._element) {
		return this._element;
	}
	var element = document.createElement(this.elementtype);
	element.setAttribute("id", this.id);
	element.setAttribute("class", SComponent.CLASS_COMPONENT);
	element.style.display = "inline-block";
	this._element = element;
	
	var x = this;
	var mouseoverfunc = function(){
		x.addClass.call(x,SComponent.CLASS_MOUSEOVER);
	};
	var mouseoutfunc = function(){
		x.removeClass.call(x,SComponent.CLASS_MOUSEOVER);
		x.removeClass.call(x,SComponent.CLASS_MOUSEDOWN);
	};
	var mousedownfunc  = function(){
		x.addClass.call(x,SComponent.CLASS_MOUSEDOWN);
	};
	var mouseupfunc  = function(){
		x.removeClass.call(x,SComponent.CLASS_MOUSEDOWN);
	};
	
	element.addEventListener("mouseover",mouseoverfunc	,false);
	element.addEventListener("mouseout"	,mouseoutfunc	,false);
	element.addEventListener("mousedown",mousedownfunc	,false);
	element.addEventListener("mouseup"	,mouseupfunc	,false);
	return element;
};

SComponent.prototype.put = function(targetComponent, type) {
	if(targetComponent === null) {
		throw "IllegalArgumentException";
	}
	if(this === targetComponent) {
		throw "it referenced me";
	}
	if(!(targetComponent instanceof SComponent)) {
		throw "IllegalArgumentException";
	}
	if(	(type !== SComponent.putype.IN) &&
		(type !== SComponent.putype.RIGHT) &&
		(type !== SComponent.putype.NEWLINE) ) {
		throw "IllegalArgumentException";
	}
	this.tool.AputB(this.getElement(), targetComponent, type);
	return;
};

SComponent.prototype.putMe = function(target, type) {
	var target_element;
	if(target === null) {
		throw "IllegalArgumentException";
	}
	if(this === target) {
		throw "it referenced me";
	}
	if((typeof target === "string")||(target instanceof String)) {
		target_element = document.getElementById(target);
	}
	else if(target.getElement) {
		target_element = target.getElement();
	}
	if( (target_element === null) ||
		(	(type !== SComponent.putype.IN) &&
			(type !== SComponent.putype.RIGHT) &&
			(type !== SComponent.putype.NEWLINE) )
	) {
		throw "IllegalArgumentException";
	}
	this.tool.AputB(target_element, this, type);
	return;
};
SComponent.prototype.isVisible = function() {
	if(this.getElement().style.visibility === null) {
		return true;
	}
	return this.getElement().style.visibility !== "hidden";
};
SComponent.prototype.setVisible = function(isvisible) {
	if(isvisible) {
		this.getElement().style.visibility	= "visible";
		this.getWall().style.visibility		= "visible";
	}
	else {
		this.getElement().style.visibility	= "hidden";
		this.getWall().style.visibility		= "hidden";
	}
	return;
};

SComponent.prototype.toString = function() {
	return this._elementtype + "(" + this.id + ")";
};

var SPanel = function(title) {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "div", title);
	this.super.addClass.call(this,  SComponent.CLASS_PANEL);
};
SPanel.prototype = new SComponent();

var SLabel = function(title) {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "div", title);
	this.super.addClass.call(this,  SComponent.CLASS_LABEL);
};
SLabel.prototype = new SComponent();

var SButton = function(title) {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "input", title);
	var element   = this.super.getElement.call(this);
	element.setAttribute("class",
		element.getAttribute("class") + " " + SComponent.CLASS_BUTTON);
	element.setAttribute("type", "button");
};
SButton.prototype = new SComponent();
SButton.prototype.addOnClickFunction = function(func) {
	this.getElement().addEventListener("click", func, false);
};

var SFileButton = function(title) {
	// CSS有効化のために、label 内に input(file) を入れる
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "label", title);
	var element   = this.super.getElement.call(this);
	element.setAttribute("class",
		element.getAttribute("class") + " " + SComponent.CLASS_BUTTON + " " + SComponent.CLASS_FILE);
	var file = document.createElement("input");
	file.setAttribute("type", "file");
	file.setAttribute("id", this.id + "_file");
	file.style.display = "none";
	this.file = file;
	element.appendChild(file);
};
SFileButton.prototype = new SComponent();
SFileButton.fileaccept = {
	default	: "",
	image	: "image/*",
	audio	: "audio/*",
	video 	: "video/*",
	text 	: "text/*",
	png 	: "image/png",
	jpeg 	: "image/jpg",
	gif 	: "image/gif"
};
SFileButton.prototype.setEnabled = function(isenabled) {
	if(isenabled) {
		this.removeClass(SComponent.CLASS_DISABLED);
	}
	else {
		this.addClass(SComponent.CLASS_DISABLED);
	}
	this._setBooleanAttribute(this.file, "disabled", isenabled);
};
SFileButton.prototype.isEnabled = function() {
	return this._isBooleanAttribute(this.file, "disabled");
};
SFileButton.prototype.getFileAccept = function() {
	var accept = this.file.getAttribute("accept");
	return (accept === null) ? "" : accept;
};
SFileButton.prototype.setFileAccept = function(filter) {
	if(filter === SFileButton.fileaccept.default) {
		if(this.file.getAttribute("accept") !== null) {
			this.file.removeAttribute("accept");
		}
	}
	else {
		this.file.setAttribute("accept", filter);
	}
};
SFileButton.prototype.addOnClickFunction = function(func) {
	this.file.addEventListener("change",
		function(event){
			func(event.target.files);
		}, false );
};

var SCanvas = function() {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "canvas");
	this.super.addClass.call(this,  SComponent.CLASS_CANVAS);
};
SCanvas.prototype = new SComponent();
SCanvas.prototype.getPixelSize = function() {
	var w = this.getElement().getAttribute("width");
	if(w === null) {
		// canvas のデフォルトサイズを返す
		return {width:300, height:150};
	}
	var h = this.getElement().getAttribute("height");
	return {width:w, height:h};
};
SCanvas.prototype.setPixelSize = function(width, height) {
	if(	(arguments.length !== 2) || 
		((typeof width !== "number") || (typeof height !== "number")) ||
		((width < 0) || (height < 0))) {
		throw "IllegalArgumentException";
	}
	width  = ~~Math.floor(width);
	height = ~~Math.floor(height);
	this.getElement().setAttribute("width", width);
	this.getElement().setAttribute("height", height);
};
SCanvas.prototype.getContext = function() {
	if(this.context) {
		return this.context;
	}
	this.context = this.getElement().getContext('2d');
	return this.context;
};


