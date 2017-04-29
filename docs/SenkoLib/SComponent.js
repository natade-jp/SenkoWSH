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
	this._initComponent();
};

SComponent._id				= 0;
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
SComponent.prototype._initComponent = function() {
	this.id				= "SComponent_" + (SComponent._id++).toString(16);
	this.wallid			= "SComponent_" + (SComponent._id++).toString(16);
	this.isshow			= false;
	this.element		= null;
	this.wall			= null;
	
	this.tool			= {
		remove : function(id) {
			var element = document.getElementById(id);
			if(element) {
				if (element.parentNode) {
					element.parentNode.removeChild(element);
				}
			}
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
				type = SComponentPutType.NEWLINE;
				if(node.lastChild !== null) {
					component.getWall(type).style.display = "block";
					node.appendChild(component.getWall());
				}
				component.getElement().style.display = "inline-block";
				node.appendChild(component.getElement());
			}
			else {
				if(!node.parentNode) {
					throw "not A.parentNode";
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
			component.getElement().innerText = "ok";
			node.style.backgroundColor	= "red";
			component.getElement().style.backgroundColor	= "blue";
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
	if(this.wall) {
		return this.wall;
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
	this.wall = wall;
	return wall;
};

SComponent.prototype.getElement = function() {
	if(this.element) {
		return this.element;
	}
	var element = document.createElement("span");
	element.setAttribute("id", this.id);
	element.setAttribute("class", SComponent.CLASS_COMPONENT);
	element.style.display = "inline-block";
	this.element = element;
	return element;
};

SComponent.prototype.put = function(targetComponent, type) {
	if(targetComponent === null) {
		throw "IllegalArgumentException";
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
	if((typeof target === "string")||(target instanceof String)) {
		target_element = document.getElementById(target);
	}
	else if(target.getElement) {
		target_element = target.getElement();
	}
	if(	(!!target_element) &&
		(type !== SComponentPutType.IN) &&
		(type !== SComponentPutType.RIGHT) &&
		(type !== SComponentPutType.NEWLINE) ) {
		throw "IllegalArgumentException";
	}
				console.log(this.getWall(type));
	this.tool.AputB(target_element, this, type);
	return;
};

SComponent.prototype.setShow = function(isshow) {
	if(isshow) {
		this.getElement().style.visibility	= "visible";
		this.getSpace().style.visibility	= "visible";
	}
	else {
		this.getElement().style.visibility	= "hidden";
		this.getSpace().style.visibility	= "hidden";
	}
	return;
};

var SPanel = function() {
	this.super = SComponent.prototype;
};
SPanel.prototype = new SComponent();
