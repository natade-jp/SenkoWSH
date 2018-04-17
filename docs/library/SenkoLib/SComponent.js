"use strict";

﻿/* global System, Text, Blob, File, Element, ImageData, Color */

﻿/**
 * SenkoLib SComponent.js
 *  HTML5 アプリケーションを作るための GUI パーツクラス
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
 * /////////////////////////////////////////////////////////
 * Button や Combobox の元となる継承元の部品クラス
 * Java の Swing を意識した設計としています。
 * /////////////////////////////////////////////////////////
 */
var SComponent = function() {
};

SComponent._counter			= 0;
SComponent.cssclass = {
	MOUSEOVER		: "SCOMPONENT_MouseOver",
	MOUSEDOWN		: "SCOMPONENT_MouseDown",
	DISABLED		: "SCOMPONENT_Disabled",
	COMPONENT		: "SCOMPONENT_Component",
	NEWLINE			: "SCOMPONENT_Newline",
	CLOSE			: "SCOMPONENT_Close",
	OPEN			: "SCOMPONENT_Open",
	SPACE			: "SCOMPONENT_Space",
	CONTENTSBOX		: "SCOMPONENT_ContentsBox",
	PANEL			: "SCOMPONENT_Panel",
	PANEL_LEGEND	: "SCOMPONENT_PanelLegend",
	SLIDEPANEL		: "SCOMPONENT_SlidePanel",
	SLIDEPANEL_LEGEND: "SCOMPONENT_SlidePanelLegend",
	SLIDEPANEL_SLIDE: "SCOMPONENT_SlidePanelSlide",
	GROUPBOX		: "SCOMPONENT_GroupBox",
	GROUPBOX_LEGEND	: "SCOMPONENT_GroupBoxLegend",
	IMAGEPANEL		: "SCOMPONENT_ImagePanel",
	LABEL			: "SCOMPONENT_Label",
	SELECT			: "SCOMPONENT_Select",
	COMBOBOX		: "SCOMPONENT_ComboBox",
	CHECKBOX		: "SCOMPONENT_CheckBox",
	CHECKBOX_IMAGE	: "SCOMPONENT_CheckBoxImage",
	BUTTON			: "SCOMPONENT_Button",
	FILELOAD		: "SCOMPONENT_FileLoad",
	FILESAVE		: "SCOMPONENT_FileSave",
	CANVAS			: "SCOMPONENT_Canvas",
	PROGRESSBAR		: "SCOMPONENT_ProgressBar",
	SLIDER			: "SCOMPONENT_Slider",
	COLORPICKER		: "SCOMPONENT_ColorPicker"
};
SComponent.putype = {
	IN		: 0,
	RIGHT	: 1,
	NEWLINE	: 2
};
SComponent.unittype = {
	PX		: "px",
	EM		: "em",
	PERCENT	: "%"
};
SComponent.labelposition = {
	LEFT	: 0,
	RIGHT	: 1
};
SComponent.prototype.getTextNode = function() {
	var element = this.getElement();
	// childNodes でテキストノードまで取得する
	var childnodes = element.childNodes;
	var textnode = null;
	var i = 0;
	for(i = 0; i < childnodes.length; i++) {
		if(childnodes[i] instanceof Text) {
			textnode = childnodes[i];
			break;
		}
	}
	// テキストノードがない場合は null をかえす
	return textnode;
};
SComponent.prototype.getElementNode = function() {
	var element = this.getElement();
	// children でテキストノード意外を取得する
	var childnodes = element.children;
	var node = null;
	var i = 0;
	for(i = 0; i < childnodes.length; i++) {
		if(!(childnodes[i] instanceof Text)) {
			node = childnodes[i];
			break;
		}
	}
	return node;
};
SComponent.prototype.getEditableNodeForValue = function() {
	// Value要素をもつもの
	return null;
};
SComponent.prototype.getEditableNodeForNodeValue = function() {
	// Value要素をもつなら、このメソッドは利用不可とする
	if(this.getEditableNodeForValue()) {
		return null;
	}
	// nodeValue 要素をもつもの
	var textnode = this.getTextNode();
	// 見つからなかったら作成する
	if(textnode === null) {
		var element = this.getElement();
		var textnode = document.createTextNode("");
		element.appendChild(textnode);
	}
	return textnode;
};
SComponent.prototype.setText = function(title) {
	if(!title) {
		return;
	}
	var node = null;
	node = this.getEditableNodeForValue();
	if(node) {
		node.value = title;
		return;
	}
	node = this.getEditableNodeForNodeValue();
	if(node) {
		node.nodeValue = title;
		return;
	}
};
SComponent.prototype.getText = function() {
	var title = null;
	var node = null;
	node = this.getEditableNodeForValue();
	if(node) {
		title = node.value;
	}
	node = this.getEditableNodeForNodeValue();
	if(node) {
		title = node.nodeValue.trim();
	}
	return (title === null) ? "" : title;
};
SComponent.prototype.getEnabledElement = function() {
	return null;
};
SComponent.prototype.setEnabled = function(isenabled) {
	if(isenabled) {
		this.node_tool.removeClass(this.getElement(), SComponent.cssclass.DISABLED);
	}
	else {
		this.node_tool.addClass(this.getElement(), SComponent.cssclass.DISABLED);
	}
	var element = this.getEnabledElement();
	// disabled属性が利用可能ならつける
	if(element !== null) {
		this.node_tool.setBooleanAttribute(element, "disabled", isenabled);
	}
};
SComponent.prototype.isEnabled = function() {
	return !this.node_tool.isSetClass(this.getElement(), SComponent.cssclass.DISABLED);
};
SComponent.prototype.getId = function() {
	return this.id;
};
SComponent.prototype.getUnit = function() {
	return this.unit;
};
SComponent.prototype.setUnit = function(unittype) {
	this.unit = unittype;
};
SComponent.prototype.addClass = function(classname) {
	return this.node_tool.addClass(this.getElement(), classname);
};
SComponent.prototype._initComponent = function(elementtype, title) {
	this.id				= "SComponent_" + (SComponent._counter++).toString(16);
	this.wallid			= "SComponent_" + (SComponent._counter++).toString(16);
	this.isshow			= false;
	this._element		= null;
	this._wall			= null;
	this.elementtype	= elementtype;
	this.unit			= SComponent.unittype.EM;
	
	this.node_tool		= {
		
		setBooleanAttribute : function(element, attribute, isset) {
			if((	!(typeof attribute === "string") &&
					!(attribute instanceof String)) ||
					(typeof isset !== "boolean")) {
				throw "IllegalArgumentException";
			}
			var checked = element.getAttribute(attribute);
			if((!isset) && (checked === null))  {
				// falseなので無効化させる。すでにチェック済みなら何もしなくてよい
				element.setAttribute(attribute, attribute);
			}
			else if ((isset) && (checked !== null)) {
				element.removeAttribute(attribute);
			}
		},
		
		isBooleanAttribute : function(element, attribute) {
			if( !(typeof attribute === "string") &&
				!(attribute instanceof String)) {
				throw "IllegalArgumentException";
			}
			return (element.getAttribute(attribute) === null);
		},
		
		removeNode : function(element) {
			if(element) {
				if (element.parentNode) {
					element.parentNode.removeChild(element);
				}
			}
			return element;
		},
		
		removeChildNodes : function(element) {
			var child = element.lastChild;
			while (child) {
				element.removeChild(child);
				child = element.lastChild;
			}
			return;
		},
		
		isSetClass : function(element, classname) {
			var classdata = element.className;
			if(classdata === null) {
				return false;
			}
			var pattern = new RegExp( "(^" + classname + "$)|( +" + classname + ")" , "g");
			return pattern.test(classdata);
		},
		
		addClass : function(element, classname) {
			var classdata = element.className;
			if(classdata === null) {
				element.className = classname;
				return;
			}
			var pattern = new RegExp( "(^" + classname + "$)|( +" + classname + ")" , "g");
			if(pattern.test(classdata)) {
				return;
			}
			element.className = classdata + " " + classname;
		},
		
		removeClass : function(element, classname) {
			var classdata = element.className;
			if(classdata === null) {
				return;
			}
			var pattern = new RegExp( "(^" + classname + "$)|( +" + classname + ")" , "g");
			if(!pattern.test(classdata)) {
				return;
			}
			element.className = classdata.replace(pattern, "");
		}
	};
	
	var that = this;
	var mouseevent = {
		over : function(){
			that.node_tool.addClass(that.getElement(), SComponent.cssclass.MOUSEOVER);
		},
		out : function(){
			that.node_tool.removeClass(that.getElement(), SComponent.cssclass.MOUSEOVER);
			that.node_tool.removeClass(that.getElement(), SComponent.cssclass.MOUSEDOWN);
		},
		down  : function(){
			that.node_tool.addClass(that.getElement(), SComponent.cssclass.MOUSEDOWN);
		},
		up  : function(){
			that.node_tool.removeClass(that.getElement(), SComponent.cssclass.MOUSEDOWN);
		}
	};
	
	this.tool			= {
		attachMouseEvent : function(element) {
			element.addEventListener("touchstart", mouseevent.over	,false);
			element.addEventListener("touchend", mouseevent.up		,false);
			element.addEventListener("mouseover",mouseevent.over	,false);
			element.addEventListener("mouseout"	,mouseevent.out		,false);
			element.addEventListener("mousedown",mouseevent.down	,false);
			element.addEventListener("mouseup"	,mouseevent.up		,false);
		},
		removeNodeForId : function(id) {
			var element = document.getElementById(id);
			that.node_tool.removeNode(element);
			return element;
		},
		AputB : function(target, component, type) {
			if((!target) || (!component) || (!(component instanceof SComponent))) {
				throw "IllegalArgumentException";
			}
			else if(target === component) {
				throw "it referenced me";
			}
			else if((type !== SComponent.putype.IN) &&
				(type !== SComponent.putype.RIGHT) &&
				(type !== SComponent.putype.NEWLINE) ) {
				throw "IllegalArgumentException";
			}
			var node = null;
			if((typeof target === "string")||(target instanceof String)) {
				node = document.getElementById(target);
			}
			else if(target instanceof SComponent) {
				if(type === SComponent.putype.IN) {
					if(target.isContainer()) {
						node = target.getContainerElement();
					}
					else {
						throw "not Container";
					}
				}
				else {
					node = target.getElement();
				}
			}
			if(node === null) {
				throw "IllegalArgumentException";
			}
			// この時点で
			// node は HTML要素 となる。
			// component は SComponent となる。
			
			var insertNext = function(newNode, referenceNode) {
				if(referenceNode.nextSibling) {
					referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
				}
				else {
					referenceNode.parentNode.appendChild(newNode);
				}
			};
			// 移動前に自分を消去
			component.removeMe();
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
		throw "IllegalArgumentException not number";
	}
	this.getElement().style.width = width.toString() + this.unit;
};
SComponent.prototype.setHeight = function(height) {
	if(typeof height !== "number") {
		throw "IllegalArgumentException not number";
	}
	this.getElement().style.height = height.toString() + this.unit;
};
SComponent.prototype.setSize = function(width, height) {
	this.setWidth(width);
	this.setHeight(height);
};
SComponent.prototype.removeMe = function() {
	this.tool.removeNodeForId(this.id);
	this.tool.removeNodeForId(this.space_id);
};
SComponent.prototype.onAdded = function() {
};
SComponent.prototype.getWall = function(type) {
	// すでに作成済みならそれを返して、作っていないければ作る
	if(this._wall) {
		return this._wall;
	}
	var wall = document.createElement("span");
	wall.id = this.wallid;
	if(type === SComponent.putype.RIGHT) {
		wall.className = SComponent.cssclass.SPACE;
	}
	else if(type === SComponent.putype.NEWLINE) {
		wall.className = SComponent.cssclass.NEWLINE;
	}
	wall.style.display = "inline-block";
	this._wall = wall;
	return wall;
};
SComponent.prototype.isContainer = function() {
	return this.getContainerElement() !== null;
};
SComponent.prototype.getContainerElement = function() {
	return null;
};
SComponent.prototype.getElement = function() {
	// すでに作成済みならそれを返して、作っていないければ作る
	if(this._element) {
		return this._element;
	}
	var element = document.createElement(this.elementtype);
	element.id = this.id;
	element.className = SComponent.cssclass.COMPONENT;
	element.style.display = "inline-block";
	this._element = element;
	this.tool.attachMouseEvent(element);
	return element;
};

SComponent.prototype.put = function(targetComponent, type) {
	this.tool.AputB(this, targetComponent, type);
	return;
};

SComponent.prototype.putMe = function(target, type) {
	this.tool.AputB(target, this, type);
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

/**
 * /////////////////////////////////////////////////////////
 * 以下、SComponent から継承した部品群
 * /////////////////////////////////////////////////////////
 */

var SPanel = function(title) {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "div");
	this.super.addClass.call(this, SComponent.cssclass.PANEL);
	var element   = this.super.getElement.call(this);
	this.legend = document.createElement("span");
	this.node_tool.addClass(this.legend, SComponent.cssclass.PANEL_LEGEND);
	this.legend.id = this.id + "_legend";
	this.body = document.createElement("div");
	this.node_tool.addClass(this.body, SComponent.cssclass.CONTENTSBOX);
	this.body.id = this.id + "_body";
	
	var that = this;
	this.paneltool = {
		setText :  function(title) {
			if(title) {
				that.legend.textContent = title;
				that.legend.style.display = "block";
			}
			else {
				that.legend.style.display = "none";
			}
		}
	};
	this.paneltool.setText(title);
	element.appendChild(this.legend);
	element.appendChild(this.body);
};
SPanel.prototype = new SComponent();
SPanel.prototype.setText = function(title) {
	if(this.paneltool) {
		this.paneltool.setText(title);
	}
};
SPanel.prototype.getContainerElement = function() {
	return this.body;
};
SPanel.prototype.clear = function() {
	this.node_tool.removeChildNodes(this.body);
};

var SLabel = function(title) {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "div", title);
	this.super.addClass.call(this,  SComponent.cssclass.LABEL);
};
SLabel.prototype = new SComponent();
SLabel.prototype.getContainerElement = function() {
	return this.getElement();
};

var SGroupBox = function(title) {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "fieldset");
	this.super.addClass.call(this, SComponent.cssclass.GROUPBOX);
	var element   = this.super.getElement.call(this);
	this.legend = document.createElement("legend");
	this.node_tool.addClass(this.legend, SComponent.cssclass.GROUPBOX_LEGEND);
	this.legend.id = this.id + "_legend";
	this.legend.textContent = title;
	this.body = document.createElement("div");
	this.node_tool.addClass(this.body, SComponent.cssclass.CONTENTSBOX);
	this.body.id = this.id + "_body";
	element.appendChild(this.legend);
	element.appendChild(this.body);
};
SGroupBox.prototype = new SComponent();
SGroupBox.prototype.getEnabledElement = function() {
	return this.getElement();
};
SGroupBox.prototype.getContainerElement = function() {
	return this.body;
};
SGroupBox.prototype.clear = function() {
	this.node_tool.removeChildNodes(this.body);
};

var SSlidePanel = function(title) {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "div");
	this.super.addClass.call(this, SComponent.cssclass.SLIDEPANEL);
	var element   = this.super.getElement.call(this);
	this.textnode = document.createTextNode( title ? title : "");
	this.legend = document.createElement("span");
	this.node_tool.addClass(this.legend, SComponent.cssclass.SLIDEPANEL_LEGEND);
	this.legend.id = this.id + "_legend";
	this.legend.appendChild(this.textnode);
	this.slide = document.createElement("div");
	this.node_tool.addClass(this.slide, SComponent.cssclass.SLIDEPANEL_SLIDE);
	this.slide.id = this.id + "_slide";
	this.body = document.createElement("div");
	this.node_tool.addClass(this.body, SComponent.cssclass.CONTENTSBOX);
	this.body.id = this.id + "_body";
	var that = this;
	var clickfunc = function() {
		that.setOpen(!that.isOpen());
	};
	this.legend.addEventListener("click", clickfunc);
	this.setOpen(false);
	element.appendChild(this.legend);
	this.slide.appendChild(this.body);
	element.appendChild(this.slide);
};
SSlidePanel.prototype = new SComponent();
SSlidePanel.prototype.setOpen = function(is_open) {
	this.is_open = is_open;
    if (this.is_open){
		this.slide.style.maxHeight	= this.body.scrollHeight + "px";
		this.node_tool.addClass(this.legend, SComponent.cssclass.OPEN);
		this.node_tool.removeClass(this.legend, SComponent.cssclass.CLOSE);
    } else {
		this.slide.style.maxHeight	= null;
		this.node_tool.addClass(this.legend, SComponent.cssclass.CLOSE);
		this.node_tool.removeClass(this.legend, SComponent.cssclass.OPEN);
    } 
};
SSlidePanel.prototype.isOpen = function() {
	return this.is_open;
};
SSlidePanel.prototype.getTextNode = function() {
	return this.textnode;
};
SSlidePanel.prototype.getContainerElement = function() {
	return this.body;
};
SSlidePanel.prototype.clear = function() {
	this.node_tool.removeChildNodes(this.body);
};

var SComboBox = function(item) {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "select", item);
	this.super.addClass.call(this, SComponent.cssclass.SELECT);
	this.super.addClass.call(this, SComponent.cssclass.COMBOBOX);
};
SComboBox.prototype = new SComponent();
SComboBox.prototype.getEnabledElement = function() {
	return this.getElement();
};
SComboBox.prototype.addListener = function(func) {
	this.getElement().addEventListener("change", func, false);
};
SComboBox.prototype.setText = function(title) {
	if(!title) {
		return;
	}
	var element = this.getElement();
	// 1つの文字列のみならば、配列化する
	if	((typeof title === "string") &&
		(title instanceof String)) {
		title = [title];
	}
	// 内部の要素を全部消去する
	var child = element.lastChild;
	while (child) {
		element.removeChild(child);
		child = element.lastChild;
	}
	var i = 0;
	// 追加していく
	for(i = 0; i < title.length; i++) {
		var option_node = document.createElement("option");
		option_node.text = title[i].toString();
		option_node.value = title[i].toString();
		element.appendChild(option_node);
	}
};
SComboBox.prototype.getText = function() {
	var element = this.getElement();
	// select要素なら option を取得
	var child = element.children;
	var i = 0;
	var output = [];
	for(i = 0; i < child.length; i++) {
		if(child[i].tagName === "OPTION") {
			output[output.length] = child[i].text;
		}
	}
	return output;
};
SComboBox.prototype.setSelectedItem = function(text) {
	var child = this.getElement().children;
	var i = 0, j = 0;
	for(i = 0; i < child.length; i++) {
		if(child[i].tagName === "OPTION") {
			if(child[i].value === text.toString()) {
				this.getElement().selectedIndex = j;
				break;
			}
			j++;
		}
	}
};
SComboBox.prototype.getSelectedItem = function() {
	var child = this.getElement().children;
	var selectindex = this.getElement().selectedIndex;
	var i = 0, j = 0;
	for(i = 0; i < child.length; i++) {
		if(child[i].tagName === "OPTION") {
			if(selectindex === j) {
				return child[i].value;
			}
			j++;
		}
	}
	return "";
};

var SCheckBox = function(title) {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "label");
	this.super.addClass.call(this, SComponent.cssclass.LABEL);
	this.super.addClass.call(this, SComponent.cssclass.CHECKBOX);
	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.id = this.id + "_checkbox";
	checkbox.className = SComponent.cssclass.CHECKBOX_IMAGE;
	this.checkbox = checkbox;
	this.textnode = document.createTextNode( title ? title : "");
	var element   = this.super.getElement.call(this);
	element.appendChild(this.checkbox);
	element.appendChild(this.textnode);
};
SCheckBox.prototype = new SComponent();
SCheckBox.prototype.getEnabledElement = function() {
	return this.checkbox;
};
SCheckBox.prototype.getTextNode = function() {
	return this.textnode;
};
SCheckBox.prototype.getElementNode = function() {
	return this.checkbox;
};
SCheckBox.prototype.setLabelPosition = function(labelposition) {
	// ラベルかどうか確認
	var element = this.getElement();
	var textnode = this.getTextNode();
	var elementnode = this.getElementNode();
	// 中身を一旦消去する
	this.node_tool.removeChildNodes(element);
	// 配置を設定する
	if(labelposition === SComponent.labelposition.LEFT) {
		// ラベル内のテキストは左側
		element.appendChild(textnode);
		element.appendChild(elementnode);
	}
	else {
		// ラベルのテキストは右側
		element.appendChild(elementnode);
		element.appendChild(textnode);
	}
	return;
};
SCheckBox.prototype.setCheckBoxImageSize = function(size) {
	if(typeof size !== "number") {
		throw "IllegalArgumentException not number";
	}
	this.checkbox.style.height = size.toString() + this.unit;
	this.checkbox.style.width  = size.toString() + this.unit;
};
SCheckBox.prototype.addListener = function(func) {
	this.checkbox.addEventListener("change", func, false);
};
SCheckBox.prototype.setChecked = function(ischecked) {
	this.checkbox.checked = ischecked;
};
SCheckBox.prototype.isChecked = function() {
	return this.checkbox.checked;
};

var SButton = function(title) {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "input", title);
	this.super.addClass.call(this, SComponent.cssclass.BUTTON);
	this.super.getElement.call(this).type = "button";
};
SButton.prototype = new SComponent();
SButton.prototype.getEditableNodeForValue = function() {
	return this.getElement();
};
SButton.prototype.getEnabledElement = function() {
	return this.getElement();
};
SButton.prototype.addListener = function(func) {
	this.getElement().addEventListener("click", func, false);
};

var SFileLoadButton = function(title) {
	// CSS有効化のために、label 内に input(file) を入れる
	// Edge のバグがあるので Edgeで使用できない
	// https://github.com/facebook/react/issues/7683
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "label", title);
	this.super.addClass.call(this, SComponent.cssclass.BUTTON);
	this.super.addClass.call(this, SComponent.cssclass.FILELOAD);
	var element   = this.super.getElement.call(this);
	var file = document.createElement("input");
	element.style.textAlign =  "center";  
	file.setAttribute("type", "file");
	file.id = this.id + "_file";
	file.style.display = "none";
	this.file = file;
	element.appendChild(file);
};
SFileLoadButton.prototype = new SComponent();
SFileLoadButton.fileaccept = {
	default	: "",
	image	: "image/*",
	audio	: "audio/*",
	video 	: "video/*",
	text 	: "text/*",
	png 	: "image/png",
	jpeg 	: "image/jpg",
	gif 	: "image/gif"
};
SFileLoadButton.prototype.getEnabledElement = function() {
	return this.file;
};
SFileLoadButton.prototype.getFileAccept = function() {
	var accept = this.file.getAttribute("accept");
	return (accept === null) ? "" : accept;
};
SFileLoadButton.prototype.setFileAccept = function(filter) {
	if(filter === SFileLoadButton.fileaccept.default) {
		if(this.file.getAttribute("accept") !== null) {
			this.file.removeAttribute("accept");
		}
	}
	else {
		this.file.accept = filter;
	}
};
SFileLoadButton.prototype.addListener = function(func) {
	this.file.addEventListener("change",
		function(event){
			func(event.target.files);
		}, false );
};


var SFileSaveButton = function(title) {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "a", title);
	this.super.addClass.call(this, SComponent.cssclass.BUTTON);
	this.super.addClass.call(this, SComponent.cssclass.FILESAVE);
	this.filename = "";
	this.url      = "";
	var element   = this.super.getElement.call(this);
	element.setAttribute("download", this.filename);
};
SFileSaveButton.prototype = new SComponent();
SFileSaveButton.prototype.getFileName = function() {
	return this.filename;
};
SFileSaveButton.prototype.setFileName = function(filename) {
	this.filename = filename;
	this.getElement().setAttribute("download", this.filenam);
};
SFileSaveButton.prototype.setURL = function(url) {
	this.getElement().href = url;
	this.url               = url;
};
SFileSaveButton.prototype.setEnabled = function(isenabled) {
	if(this.isEnabled() !== isenabled) {
		if(isenabled) {
			this.getElement().href = this.url;
		}
		else {
			this.getElement().removeAttribute("href");
		}
	}
	this.super.setEnabled.call(this, isenabled);
};

var SCanvas = function() {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "canvas");
	this.super.addClass.call(this,  SComponent.cssclass.CANVAS);
	this.canvas = this.super.getElement.call(this);
	this.glmode = false;
	this.setPixelSize(300, 150);	// canvas のデフォルト値を設定する
};
SCanvas.prototype = new SComponent();
SCanvas.prototype.getPixelSize = function() {
	return {width: this.canvas.width, height: this.canvas.height};
};
SCanvas.prototype.getCanvas = function() {
	return this.canvas;
};
SCanvas.prototype.setPixelSize = function(width, height) {
	if(	(arguments.length !== 2) || 
		((typeof width !== "number") || (typeof height !== "number")) ||
		((width < 0) || (height < 0))) {
		throw "IllegalArgumentException";
	}
	width  = ~~Math.floor(width);
	height = ~~Math.floor(height);
	this.canvas.width = width;
	this.canvas.height = height;
};
SCanvas.prototype.getContext = function() {
	// 一度でも GL で getContext すると使用できなくなります。
	if(this.context === undefined) {
		this.context = this.canvas.getContext("2d");
		if(this.context === null) {
			this.glmode = true;
			this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
			this.context = this.gl;
		}
	}
	return this.context;
};
SCanvas.drawtype = {
	ORIGINAL		: 0,
	ASPECT_RATIO	: 1,
	STRETCH			: 2,
	LETTER_BOX		: 3
};
SCanvas.prototype.clear = function() {
	if(this.glmode) {
		this.getContext().clear(this.gl.COLOR_BUFFER_BIT);
	}
	else {
		this.getContext().clearRect(0, 0,  this.canvas.width, this.canvas.height);
	}
};
SCanvas.prototype.getImageData = function() {
	if(this.glmode) {
		return;
	}
	return this.getContext().getImageData(0, 0, this.canvas.width, this.canvas.height);
};
SCanvas.prototype.putImageData = function(imagedata) {
	if(this.glmode) {
		return;
	}
	this.getContext().putImageData(imagedata, 0, 0);
};
SCanvas.prototype._putImage = function(image, isresizecanvas, drawsize) {
	var pixelsize = this.canvas;
	var dx = 0, dy = 0;
	var width  = pixelsize.width;
	var height = pixelsize.height;
	if(SCanvas.drawtype.ORIGINAL === drawsize) {
		width  = image.width;
		height = image.height;
	}
	else if(SCanvas.drawtype.STRETCH === drawsize) {
		width  = pixelsize.width;
		height = pixelsize.height;
		isresize = false;
	}
	else if(SCanvas.drawtype.FILL_ASPECT_RATIO === drawsize) {
		width  = pixelsize.width;
		height = pixelsize.height;
		isresize = false;
	}
	else {
		width  = image.width;
		height = image.height;
		if(SCanvas.drawtype.ASPECT_RATIO === drawsize) {
			if(width > pixelsize.width) {
				width  = pixelsize.width;
				height = Math.floor(height * (width / image.width));
			}
			if(height > pixelsize.height) {
				width  = Math.floor(width * (pixelsize.height / height));
				height = pixelsize.height;
			}
		}
		if(SCanvas.drawtype.LETTER_BOX === drawsize) {
			width  = pixelsize.width;
			height = Math.floor(height * (width / image.width));
			if(height > pixelsize.height) {
				width  = Math.floor(width * (pixelsize.height / height));
				height = pixelsize.height;
			}
			dx = Math.floor((pixelsize.width - width) / 2);
			dy = Math.floor((pixelsize.height - height) / 2);
			isresizecanvas = false;
		}
	}
	if(isresizecanvas) {
		this.setUnit(SComponent.unittype.PX);
		this.setSize(width, height);
		this.setPixelSize(width, height);
	}
	this.clear();
	
	if(image instanceof Image) {
		this.context.drawImage(
			image,
			0, 0, image.width, image.height,
			dx, dy, width, height
		);
	}
	else if(image instanceof ImageData) {
		this.context.putImageData(
			image,
			0, 0,
			dx, dy, width, height
		);
	}
};
SCanvas.prototype.putImage = function(data, drawcallback, drawsize, isresizecanvas) {
	if(!drawcallback) {
		drawcallback = null;
	}
	if(drawsize === undefined) {
		drawsize = SCanvas.drawtype.LETTER_BOX;
	}
	if(isresizecanvas === undefined) {
		isresizecanvas = false;
	}
	if((data instanceof Image) || (data instanceof ImageData)) {
		// Image -> canvas, ImageData -> canvas
		this._putImage(data, isresizecanvas, drawsize);
		if(typeof drawcallback === "function") {
			drawcallback();
		}
	}
	else if(typeof data === "string") {
		var _this = this;
		var image = new Image();
		// URL(string) -> Image
		image.onload = function() {
			_this.putImage(image, isresizecanvas, drawsize, drawcallback);
		};
		image.src = data;
	}
	else if(data instanceof SCanvas) {
		// SCanvas -> canvas
		this.putImage(data.getElement(), isresizecanvas, drawsize, drawcallback);
	}
	else if((data instanceof Element) && (data.tagName === "CANVAS")){
		// canvas -> URL(string)
		this.putImage(data.toDataURL(), isresizecanvas, drawsize, drawcallback);
	}
	else if((data instanceof Blob) || (data instanceof File)) {
		var _this = this;
		var reader = new FileReader();
		// Blob, File -> URL(string)
		reader.onload = function() {
			_this.putImage(reader.result, isresizecanvas, drawsize, drawcallback);
		};
		reader.readAsDataURL(data);
	}
	else {
		throw "IllegalArgumentException";
	}
};
SCanvas.prototype.toDataURL = function(type) {
	if(!type) {
		type = "image/png";
	}
	return this.canvas.toDataURL(type);
};

var SImagePanel = function() {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "div");
	this.super.addClass.call(this,  SComponent.cssclass.IMAGEPANEL);
	var image = document.createElement("img");
	image.id = this.id + "_img";
	this.image = image;
	this.getElement.call(this).appendChild(this.image);
};
SImagePanel.prototype = new SComponent();
SImagePanel.prototype.clear = function() {
	// 未作成
	this.node_tool.removeChildNodes(this.getElement());
};
SImagePanel.prototype.toDataURL = function() {
	return this.image.src;
};
SImagePanel.prototype.putImageData = function(imagedata) {
	this.putImage(imagedata);
};
SImagePanel.prototype.putImage = function(data, drawcallback) {
	if(!drawcallback) {
		drawcallback = null;
	}
	if(typeof data === "string") {
		// URL(string) -> IMG
		this.image.onload = function() {
			if(typeof drawcallback === "function") {
				drawcallback();
			}
		};
		this.image.src = data;
	}
	else if(data instanceof ImageData) {
		var canvas = document.createElement("canvas");
		canvas.width = data.width;
		canvas.height = data.height;
		var context = canvas.getContext("2d");
		context.putImageData(data, 0, 0);
		this.putImage(canvas, drawcallback);
	}
	else if(data instanceof Image) {
		this.image.src = data.src;
	}
	else if(data instanceof SCanvas) {
		// SCanvas -> canvas
		this.putImage(data.getElement(), drawcallback);
	}
	else if((data instanceof Element) && (data.tagName === "CANVAS")){
		// canvas -> URL(string)
		try {
			this.putImage(data.toDataURL("image/png"), drawcallback);
		} catch(e) {
			try {
				this.putImage(data.toDataURL("image/jpeg"), drawcallback);;
			} catch(e) {
			}
		}
	}
	else if((data instanceof Blob) || (data instanceof File)) {
		var _this = this;
		var reader = new FileReader();
		// Blob, File -> URL(string)
		reader.onload = function() {
			_this.putImage(reader.result, drawcallback);
		};
		reader.readAsDataURL(data);
	}
	else {
		throw "IllegalArgumentException";
	}
};


var SProgressBar = function(min, max) {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "label");
	this.super.addClass.call(this, SComponent.cssclass.LABEL);
	this.super.addClass.call(this, SComponent.cssclass.PROGRESSBAR);
	this.min	= 0.0;
	this.max	= 0.0;
	this.value	= min;
	this.is_indeterminate = false;
	if(arguments.length === 0) {
		this.min = 0.0;
		this.max = 1.0;
	}
	else if(arguments.length === 2) {
		this.min = min;
		this.max = max;
	}
	else {
		throw "IllegalArgumentException";
	}
	this.progress = document.createElement("progress");
	this.getElement.call(this).appendChild(this.progress);
	this.progress.id = this.id + "_progress";
	this.progress.className = SComponent.cssclass.PROGRESSBAR;
	// 内部の目盛りは0-1を使用する
	this.progress.value	= 0.0;
	this.progress.max	= 1.0;
};
SProgressBar.prototype = new SComponent();
SProgressBar.prototype.setMaximum = function(max) {
	this.max = max;
};
SProgressBar.prototype.setMinimum = function(min) {
	this.min = min;
};
SProgressBar.prototype.getMaximum = function() {
	return this.max;
};
SProgressBar.prototype.getMinimum = function() {
	return this.min;
};
SProgressBar.prototype.setValue = function(value) {
	this.value = value;
	this.progress.value = this.getPercentComplete();
};
SProgressBar.prototype.getValue = function() {
	return this.value;
};
SProgressBar.prototype.setIndeterminate = function(newValue) {
	this.is_indeterminate = newValue;
	if(this.is_indeterminate) {
		this.progress.removeAttribute("value");
	}
	else {
		this.setValue(this.value);
	}
};
SProgressBar.prototype.isIndeterminate = function() {
	return this.is_indeterminate;
};
SProgressBar.prototype.getPercentComplete = function() {
	var delta = this.max - this.min;
	return (this.value - this.min) / delta;
};

var SSlider = function(min, max) {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "label");
	this.super.addClass.call(this, SComponent.cssclass.LABEL);
	this.super.addClass.call(this, SComponent.cssclass.SLIDER);
	if(arguments.length === 0) {
		min = 0.0;
		max = 1.0;
	}
	else if(arguments.length === 2) {
	}
	else {
		throw "IllegalArgumentException";
	}
	this.slider = document.createElement("input");
	this.slider.id = this.id + "_slider";
	this.slider.type	= "range";
	this.slider.className = SComponent.cssclass.SLIDER;
	this.slider.value	= min;
	this.slider.min		= min;
	this.slider.max		= max;
	this.slider.step	= (max - min) / 100;
	this.datalist		= document.createElement("datalist");
	this.datalist.id	= this.id + "_datalist";
	this.slider.setAttribute("list", this.datalist.id);
	this.getElement.call(this).appendChild(this.slider);
	this.getElement.call(this).appendChild(this.datalist);
};
SSlider.prototype = new SComponent();
SSlider.prototype.getEnabledElement = function() {
	return this.slider;
};
SSlider.prototype.setMaximum = function(max) {
	this.slider.max = max;
};
SSlider.prototype.setMinimum = function(min) {
	this.slider.min = min;
};
SSlider.prototype.getMaximum = function() {
	return parseFloat(this.slider.max);
};
SSlider.prototype.getMinimum = function() {
	return parseFloat(this.slider.min);
};
SSlider.prototype.setValue = function(value) {
	this.slider.value = value;
};
SSlider.prototype.getValue = function() {
	return parseFloat(this.slider.value);
};
SSlider.prototype.setMinorTickSpacing = function(step) {
	this.slider.step = step;
};
SSlider.prototype.getMinorTickSpacing = function() {
	return parseFloat(this.slider.step);
};
SSlider.prototype.setMajorTickSpacing = function(step) {
	this.majortick = step;
	this.removeMajorTickSpacing();
	var i;
	var min = this.getMinimum();
	var max = this.getMaximum();
	for(i = min; i <= max; i+= step) {
		var option_node = document.createElement("option");
		option_node.value = i.toString();
		this.datalist.appendChild(option_node);
	}
};
SSlider.prototype.getMajorTickSpacing = function() {
	return this.majortick;
};
SSlider.prototype.removeMajorTickSpacing = function() {
	var element = this.datalist;
	var child = element.lastChild;
	while (child) {
		element.removeChild(child);
		child = element.lastChild;
	}
};
SSlider.prototype.addListener = function(func) {
	var isDown = false;
	var _this = this;
	var setDown = function() {
		isDown = true;
	};
	var setUp = function() {
		if(isDown) {
			if(_this.slider.disabled !== "disabled") {
					func();
			}
			isDown = false;
		}
	};
	this.slider.addEventListener("touchstart", setDown, false );
	this.slider.addEventListener("touchend", setUp, false );
	this.slider.addEventListener("mousedown", setDown, false );
	this.slider.addEventListener("mouseup", setUp, false );
};

SSlider.prototype.getWidth = function() {
	var width = this.slider.width;
	if(width === null) {
		return null;
	}
	width = width.match(/[\+\-]?\s*[0-9]*\.?[0-9]*/)[0];
	return parseFloat(width);
};
SSlider.prototype.getHeight = function() {
	var height = this.slider.height;
	if(height === null) {
		return null;
	}
	height = height.match(/[\+\-]?\s*[0-9]*\.?[0-9]*/)[0];
	return parseFloat(height);
};
SSlider.prototype.setWidth = function(width) {
	if(typeof width !== "number") {
		throw "IllegalArgumentException not number";
	}
	this.super.setWidth.call(this, width);
	this.slider.style.width = width.toString() + this.unit;
};
SSlider.prototype.setHeight = function(height) {
	if(typeof height !== "number") {
		throw "IllegalArgumentException not number";
	}
	this.super.setHeight.call(this, height);
	this.slider.style.height = height.toString() + this.unit;
};


var SColorPicker = function() {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "div");
	this.super.addClass.call(this, SComponent.cssclass.COLORPICKER);
	var element	= this.getElement();
	var that = this;
	var hls = {
		H : {
			div : document.createElement("div"),
			split : 6,
			value : 0.0,
			input : null,
			gauge : null,
			color_data : [],
			color_node : [],
			is_press : false
		},
		S : {
			div : document.createElement("div"),
			split : 1,
			value : 0.5,
			input : null,
			gauge : null,
			color_data	: [],
			color_node	: [],
			is_press : false
		},
		L :	{
			div : document.createElement("div"),
			split : 2,
			value : 0.5,
			input : null,
			gauge : null,
			color_data : [],
			color_node : [],
			is_press : false
		}
	};
	
	for(var i = 0; i <= hls.H.split; i++) {
		var x = 1.0 / hls.H.split * i;
		hls.H.color_data.push(Color.newColorNormalizedHSL([x, 1.0, 0.5]).getCSSHex());
	}
	
	// イベントをどこで発生させたか分かるように、
	// 関数を戻り値としてもどし、戻り値として戻した関数を
	// イベント発生時に呼び出すようにしています。
	
	// 押したときにマウスの位置を取得して更新する
	var pushevent = function(name) {
		return function(event) {
			if(event.length) event = event[0];
			if(hls[name].is_press) {
				var node = event.target;
				node = node ? node : event.currentTarget;
				hls[name].value = event.offsetX / node.clientWidth;
				that.redraw();
			}
		};
	};
	
	// 押した・離したの管理
	var pressevent = function(name, is_press) {
		return function(event) {
			if(event.length) event = event[0];
			var node = event.target;
			node = node ? node : event.currentTarget;
			hls[name].is_press = is_press;
			if(is_press) {
				pushevent(name)(event);
			}
		};
	};
	
	// インプットボックスの変更
	var inputevent = function(name) {
		return function(event) {
			// イベントが発生したノードの取得
			var node = event.target;
			node = node ? node : event.currentTarget;
			hls[name].value = node.value / 100.0;
			that.redraw();
		};
	};
	
	// 内部のカラーバーを作成
	var createSelectBar = function(target, name) {
		var element_cover	= document.createElement("div");	// クリック検出
		var element_gauge	= document.createElement("div");	// ゲージ表示用
		var element_gradient= document.createElement("div");	// グラデーション作成用
		
		// レイヤーの初期設定
		target.style.position			= "relative";
		element_cover.style.position	= "absolute";
		element_gauge.style.position	= "absolute";
		element_gradient.style.position	= "absolute";
		element_cover.style.margin		= "0px";
		element_cover.style.padding		= "0px";
		element_gauge.style.margin		= "0px";
		element_gauge.style.padding		= "0px";
		element_gradient.style.margin	= "0px";
		element_gradient.style.padding	= "0px";
		
		// 上にかぶせるカバー
		element_cover.addEventListener("mousedown"	, pressevent(name, true), false);
		element_cover.addEventListener("mouseup"	, pressevent(name, false), false);
		element_cover.addEventListener("mouseout"	, pressevent(name, false), false);
		element_cover.addEventListener("mousemove"	, pushevent(name), false);
		element_cover.addEventListener("touchstart"	, pressevent(name, true), false);
		element_cover.addEventListener("touchend"	, pressevent(name, false), false);
		element_cover.addEventListener("touchcancel", pressevent(name, false), false);
		element_cover.dataset.name	= name;
		element_cover.style.width			= "100%";
		element_cover.style.height			= "100%";
		element_cover.style.bottom			= "0px";
		
		// ゲージ（横幅で｜を表す）
		element_gauge.style.width			= "33%";
		element_gauge.style.height			= "100%";
		element_gauge.style.bottom			= "0px";
		element_gauge.style.borderStyle		= "ridge";
		element_gauge.style.borderWidth		= "0px 2px 0px 0px";
		hls[name].gauge = element_gauge;
		
		// グラデーション部分
		var split = hls[name].split;
		element_gradient.style.width			= "100%";
		element_gradient.style.height			= "100%";
		element_gradient.style.overflow		= "hidden";
		for(var i = 0; i < split; i++) {
			var element_color = document.createElement("div");
			element_color.style.display		= "inline-block";
			element_color.style.margin		= "0px";
			element_color.style.padding		= "0px";
			element_color.style.height		= "100%";
			element_color.style.width		= 100.0 / split + "%";
			element_color.style.background	= "linear-gradient(to right, #000, #FFF)";
			hls[name].color_node.push(element_color);
			element_gradient.appendChild(element_color);
		}
		
		// 3つのレイヤーを結合
		target.appendChild(element_gradient);
		target.appendChild(element_gauge);
		target.appendChild(element_cover);
	};
	
	// 1行を作成
	var createColorBar = function(name) {
		var element_text		= document.createElement("span");
		var element_colorbar	= document.createElement("div");
		var element_inputbox	= document.createElement("input");
		
		// 位置の基本設定
		element_text.style.display		= "inline-block";
		element_colorbar.style.display	= "inline-block";
		element_inputbox.style.display	= "inline-block";
		element_text.style.verticalAlign		= "top";
		element_colorbar.style.verticalAlign	= "top";
		element_inputbox.style.verticalAlign	= "top";
		element_text.style.height		= "100%";
		element_colorbar.style.height	= "100%";
		element_inputbox.style.height	= "100%";

		// 文字
		element_text.style.margin		= "0px";
		element_text.style.padding		= "0px";
		element_text.style.textAlign	= "center";
		
		// 中央のバー
		element_colorbar.style.margin	= "0px 0.5em 0px 0.5em";
		element_colorbar.style.padding	= "0px";
		element_colorbar.style.borderStyle	= "solid";
		element_colorbar.style.borderWidth	= "1px";
		
		// 入力ボックス
		element_inputbox.addEventListener("input", inputevent(name), false);
		element_inputbox.type = "number";
		element_inputbox.style.margin	= "0px";
		element_inputbox.style.padding	= "0px";
		element_inputbox.style.borderStyle	= "none";
		element_inputbox.min = 0.0;
		element_inputbox.max = 100.0;
		element_inputbox.step = 1.0;
		hls[key].input = element_inputbox;
		
		// 横幅調整
		element_text.style.width		= "1.5em";
		element_colorbar.style.width	= "calc(100% - 6.0em)";
		element_inputbox.style.width	= "3.5em";
		
		// バーの内部を作成
		createSelectBar(element_colorbar, name);
		
		// バーのサイズ調整
		var target = hls[key].div;
		target.style.height				= "1.2em";
		target.style.margin				= "0.5em 0px 0.5em 0px";
		
		element_text.appendChild(document.createTextNode(name));
		target.appendChild(element_text);
		target.appendChild(element_colorbar);
		target.appendChild(element_inputbox);
	};
	
	// HSLの3つを作成する
	for(var key in hls) {
		createColorBar(key);
	}
	
	this.hls = hls;
	this.listener = [];
	
	// Elementを更新後にくっつける
	this.redraw();
	element.appendChild(this.hls.H.div);
	element.appendChild(this.hls.S.div);
	element.appendChild(this.hls.L.div);
};
SColorPicker.prototype = new SComponent();
SColorPicker.prototype.setColor = function(color) {
	if(!(color instanceof Color)) {
		throw "ArithmeticException";
	}
	var hls = this.hls;
	var c = color.getNormalizedHSL();
	hls.H.value = c.h;
	hls.S.value = c.s; 
	hls.L.value = c.l; 
	this.redraw();
};
SColorPicker.prototype.getColor = function() {
	var hls = this.hls;
	var h = hls.H.value;
	var s = hls.S.value;
	var l = hls.L.value;
	return Color.newColorNormalizedHSL([h, s, l]);
};
SColorPicker.prototype.redraw = function() {
	var hls = this.hls;
	var h = hls.H.value;
	var s = hls.S.value;
	var l = hls.L.value;
	hls.S.color_data = [
		Color.newColorNormalizedHSL([h, 0.0, l]).getCSSHex(),
		Color.newColorNormalizedHSL([h, 1.0, l]).getCSSHex()
	];
	hls.L.color_data = [
		Color.newColorNormalizedHSL([h, s, 0.0]).getCSSHex(),
		Color.newColorNormalizedHSL([h, s, 0.5]).getCSSHex(),
		Color.newColorNormalizedHSL([h, s, 1.0]).getCSSHex()
	];
	for(var key in hls) {
		var data = hls[key].color_data;
		var node = hls[key].color_node;
		for(var i = 0; i < node.length; i++) {
			node[i].style.background = "linear-gradient(to right, " + data[i] + ", " + data[i + 1] + ")";
		}
		var value = Math.round(100.0 * hls[key].value);
		hls[key].gauge.style.width = value + "%";
		hls[key].input.value = value;
	}
	for(var i = 0;i < this.listener.length; i++) {
		this.listener[i]();
	}
};

SColorPicker.prototype.addListener = function(func) {
	this.listener.push(func);
};


