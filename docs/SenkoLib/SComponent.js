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
SComponent.CLASS_PANEL		= "SCOMPONENT_Panel";
SComponent.CLASS_BUTTON		= "SCOMPONENT_Button";

var SComponentPutType = {
	IN		: 0,
	LEFT	: 1,
	NEWLINE	: 2
};
SComponent.prototype._initComponent = function() {
	this.id				= "SComponent_" + (SComponent._id++).toString(16);
	this.space_id		= "SComponent_" + (SComponent._id++).toString(16);
	this.isshow			= false;
	this.element		= null;
	this.space			= null;
	
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
			component.remove();
			if(type === SComponentPutType.IN) {
				component.getSpace().style.display = "inline-block";
				component.getElement().style.display = "inline-block";
				node.appendChild(component.getSpace());
				node.appendChild(component.getElement());
			}
			else {
				if(!node.parentNode) {
					throw "not A.parentNode";
				}
				if(node.nextSibling) {
					node.parentNode.insertBefore(component.getElement(), node.nextSibling);
					node.parentNode.insertBefore(component.getSpace(), component.getElement());
				}
				else {
					node.parentNode.appendChild(component.getSpace());
					node.parentNode.appendChild(component.getElement());
				}
				if(type === SComponentPutType.LEFT) {
					node.style.display = "inline-block";
					component.getSpace().style.display = "inline-block";
					component.getElement().style.display = "inline-block";
				}
				else if(type === SComponentPutType.NEWLINE) {
					node.style.display = "inline-block";
					component.getSpace().style.display = "block";
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

SComponent.prototype.getSpace = function() {
	if(this.space !== null) {
		return this.space;
	}
	var space = document.createElement("span");
	space.setAttribute("id", this.space_id);
	space.setAttribute("class", SComponent.CLASS_COMPONENT);
	space.style.display = "inline-block";
	this.space = space;
	return space;
};

SComponent.prototype.getElement = function() {
	if(this.element !== null) {
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
	if(!targetComponent.getSpace || !targetComponent.getElement) {
		throw "IllegalArgumentException";
	}
	if(	(type !== SComponentPutType.IN) &&
		(type !== SComponentPutType.LEFT) &&
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
		(type !== SComponentPutType.LEFT) &&
		(type !== SComponentPutType.NEWLINE) ) {
		throw "IllegalArgumentException";
	}
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
