/* global System */

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
SComponent.CLASS_COMPONENT	= "SCOMPONENT_Component";
SComponent.CLASS_NEWLINE	= "SCOMPONENT_Newline";
SComponent.CLASS_SPACE		= "SCOMPONENT_Space";
SComponent.CLASS_PANEL		= "SCOMPONENT_Panel";
SComponent.CLASS_BUTTON		= "SCOMPONENT_Button";

var SComponentPutType = {
	IN		: 0,
	LEFT	: 1,
	NEWLINE	: 2
};
SComponent.prototype.setText = function(title) {
	if(title) {
		this.getElement().innerText = title;
	}
};
SComponent.prototype.getText = function() {
	return this.getElement().innerText;
};
SComponent.prototype._initComponent = function(elementtype, title) {
	this.id				= "SComponent_" + (SComponent._counter++).toString(16);
	this.wallid			= "SComponent_" + (SComponent._counter++).toString(16);
	this.isshow			= false;
	this._element		= null;
	this._wall			= null;
	this.elementtype	= elementtype;
	this.setText(title);
	
	this.tool			= {
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
			if(type === SComponentPutType.IN) {
				// 最後の行があるならば次の行へ
				type = SComponentPutType.NEWLINE;
				if(node.lastChild !== null) {
					component.getWall(type).style.display = "block";
					node.appendChild(component.getWall());
				}
				component.getElement().style.display = "inline-block";
				node.appendChild(component.getElement());
			}
			else {
				if(node.parentNode === null) {
					throw "not found element on the html";
				}
				insertNext(component.getWall(type), node);
				insertNext(component.getElement(), component.getWall(type));
				if(type === SComponentPutType.RIGHT) {
					node.style.display = "inline-block";
					component.getWall(type).style.display = "inline-block";
					component.getElement().style.display = "inline-block";
				}
				else if(type === SComponentPutType.NEWLINE) {
					node.style.display = "inline-block";
					component.getWall(type).style.display = "block";
					component.getElement().style.display = "inline-block";
				}
			}
		}
	};
};

SComponent.prototype._setSize = function(width, height) {
	width  = ~~Math.floor(width);
	height = ~~Math.floor(height);
	if(	(arguments.length !== 2) || 
		((typeof width !== "number") || (typeof height !== "number")) ||
		((width < 0) || (height < 0))) {
		throw "IllegalArgumentException";
	}
	this.width	= width;
	this.height	= height;
};

SComponent.prototype.remove = function() {
	this.tool.remove(this.id);
	this.tool.remove(this.space_id);
};

SComponent.prototype.getWall = function(type) {
	// すでに作成済みならそれを返して、作っていないければ作る
	if(this._wall) {
		return this._wall;
	}
	var wall = document.createElement("span");
	wall.setAttribute("id", this.wallid);
	if(type === SComponentPutType.RIGHT) {
		wall.setAttribute("class", SComponent.CLASS_SPACE);
	}
	else if(type === SComponentPutType.NEWLINE) {
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
	if(	(type !== SComponentPutType.IN) &&
		(type !== SComponentPutType.RIGHT) &&
		(type !== SComponentPutType.NEWLINE) ) {
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
		(	(type !== SComponentPutType.IN) &&
			(type !== SComponentPutType.RIGHT) &&
			(type !== SComponentPutType.NEWLINE) )
	) {
		throw "IllegalArgumentException";
	}
	this.tool.AputB(target_element, this, type);
	return;
};

SComponent.prototype.setShow = function(isshow) {
	if(isshow) {
		this.getElement().style.visibility	= "visible";
		this.getWall().style.visibility	= "visible";
	}
	else {
		this.getElement().style.visibility	= "hidden";
		this.getWall().style.visibility	= "hidden";
	}
	return;
};

SComponent.prototype.toString = function() {
	return this._elementtype + "(" + this.id + ")";
};

var SPanel = function(title) {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "div", title);
	var element   = this.super.getElement.call(this);
	element.setAttribute("class",
		element.getAttribute("class") + " " + SComponent.CLASS_PANEL);
};
SPanel.prototype = new SComponent();

var SButton = function(title) {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "input", title);
	var element   = this.super.getElement.call(this);
	element.setAttribute("class",
		element.getAttribute("class") + " " + SComponent.CLASS_BUTTON);
	element.setAttribute("type", "button");
};
SButton.prototype = new SComponent();

SButton.prototype.setText = function(title) {
	if(title) {
		this.getElement().setAttribute("value", title);
	}
};
SComponent.prototype.getText = function() {
	var text = this.getElement().getAttribute("value");
	return (text === null) ? "" : text;
};

SButton.prototype.addOnClickFunction = function(func) {
	this.getElement().addEventListener("click", func, false);
};

