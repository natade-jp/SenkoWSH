"use strict";

﻿/* global System, Text, Blob, File, Element, ImageData */

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
	SPACE			: "SCOMPONENT_Space",
	PANEL			: "SCOMPONENT_Panel",
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
	GROUPBOX		: "SCOMPONENT_GropuBox"
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
SComponent.prototype.removeTextNode = function() {
	var element = this.getElement();
	var textnode = this.getTextNode();
	if(textnode) {
		element.removeChild(textnode);
	}
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
SComponent.prototype.clearChildNodes = function() {
	var element = this.getElement();
	var child = element.lastChild;
	while (child) {
		element.removeChild(child);
		child = element.lastChild;
	}
};
SComponent.prototype.setLabelPosition = function(labelposition) {
	// ラベルかどうか確認
	var element = this.getElement();
	if(element.tagName !== "LABEL") {
		return;
	}
	// すでにあるテキストノードを調査する
	var textnode = this.getTextNode();
	if(textnode === null) {
		textnode = document.createTextNode("");
	}
	var elementnode = this.getElementNode();
	// 中身を一旦消去する
	this.clearChildNodes();
	// 配置を設定する
	if(labelposition === SComponent.LEFT) {
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
SComponent.prototype.setText = function(title) {
	if(!title) {
		return;
	}
	var element = this.getElement();
	// input 要素なら value を書き換える
	if(element.tagName === "INPUT") {
		element.value = title;
	}
	// select 要素なら option を書き換える
	else if(element.tagName === "SELECT") {
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
	}
	// そのほかは、中にあるテキストノードを編集する
	else {
		var textnode = this.getTextNode();
		// 見つからなかったら作成する
		if(textnode === null) {
			var textnode = document.createTextNode("");
			element.appendChild(textnode);
		}
		textnode.nodeValue = title;
	}
};
SComponent.prototype.getText = function() {
	var element = this.getElement();
	var title = null;
	// input要素なら value を書き換える
	if(element.tagName === "INPUT") {
		title = this.value;
	}
	// select要素なら option を取得する
	else if(element.tagName === "SELECT") {
		var child = element.children;
		var i = 0;
		var output = [];
		for(i = 0; i < child.length; i++) {
			if(child[i].tagName === "OPTION") {
				output[output.length] = child[i].text;
			}
		}
		return output;
	}
	else {
	// テキストノードを取得する
		title = this.getTextNode().nodeValue.trim();
	}
	return (title === null) ? "" : title;
};
SComponent.prototype._setBooleanAttribute = function(element, attribute, isset) {
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
};
SComponent.prototype._isBooleanAttribute = function(element, attribute) {
	if( !(typeof attribute === "string") &&
		!(attribute instanceof String)) {
		throw "IllegalArgumentException";
	}
	if((element.tagName !== "INPUT") && (element.tagName !== "SELECT")){
		throw "not support";
	}
	return (element.getAttribute(attribute) === null);
};
SComponent.prototype.getEnabledElement = function() {
	return null;
};
SComponent.prototype.setEnabled = function(isenabled) {
	if(isenabled) {
		this.removeClass(SComponent.cssclass.DISABLED);
	}
	else {
		this.addClass(SComponent.cssclass.DISABLED);
	}
	var element = this.getEnabledElement();
	// disabled属性が利用可能ならつける
	if(element !== null) {
		this._setBooleanAttribute(element, "disabled", isenabled);
	}
};
SComponent.prototype.isEnabled = function() {
	return !this.isSetClass(SComponent.cssclass.DISABLED);
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
SComponent.prototype.isSetClass = function(classname) {
	var element = this.getElement();
	var classdata = element.className;
	if(classdata === null) {
		return false;
	}
	var pattern = new RegExp( " *" + classname + " *" , "g");
	return pattern.test(classdata);
};
SComponent.prototype.addClass = function(classname) {
	var element = this.getElement();
	var classdata = element.className;
	if(classdata === null) {
		element.className = classname;
		return;
	}
	element.className = classdata + " " + classname;
};
SComponent.prototype.removeClass = function(classname) {
	var element = this.getElement();
	var classdata = element.className;
	if(classdata === null) {
		return;
	}
	var pattern = new RegExp( " *" + classname + " *" , "g");
	if(!pattern.test(classdata)) {
		return;
	}
	element.className = classdata.replace(pattern, "");
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
		remove : function(id) {
			var element = document.getElementById(id);
			if(element) {
				if (element.parentNode) {
					element.parentNode.removeChild(element);
				}
			}
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
	
	var x = this;
	var mouseoverfunc = function(){
		x.addClass.call(x,SComponent.cssclass.MOUSEOVER);
	};
	var mouseoutfunc = function(){
		x.removeClass.call(x,SComponent.cssclass.MOUSEOVER);
		x.removeClass.call(x,SComponent.cssclass.MOUSEDOWN);
	};
	var mousedownfunc  = function(){
		x.addClass.call(x,SComponent.cssclass.MOUSEDOWN);
	};
	var mouseupfunc  = function(){
		x.removeClass.call(x,SComponent.cssclass.MOUSEDOWN);
	};
	
	element.addEventListener("touchstart", mousedownfunc,false);
	element.addEventListener("touchend", mouseupfunc	,false);
	element.addEventListener("mouseover",mouseoverfunc	,false);
	element.addEventListener("mouseout"	,mouseoutfunc	,false);
	element.addEventListener("mousedown",mousedownfunc	,false);
	element.addEventListener("mouseup"	,mouseupfunc	,false);
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

var SPanel = function() {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "div");
	this.super.addClass.call(this,  SComponent.cssclass.PANEL);
};
SPanel.prototype = new SComponent();
SPanel.prototype.getContainerElement = function() {
	return this.getElement();
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
	this.super.addClass.call(this, SComponent.cssclass.PANEL);
	this.super.addClass.call(this, SComponent.cssclass.GROUPBOX);
	var element   = this.super.getElement.call(this);
	this.legend = document.createElement("legend");
	this.legend.className = SComponent.cssclass.LABEL;
	this.legend.id = this.id + "_legend";
	this.legend.textContent = title;
	this.body = document.createElement("div");
	this.body.id = this.id + "_body";
	element.appendChild(this.legend);
	element.appendChild(this.body);
};
SGroupBox.prototype = new SComponent();
SGroupBox.prototype.getContainerElement = function() {
	return this.body;
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
	this.super._initComponent.call(this, "label", title);
	this.super.addClass.call(this, SComponent.cssclass.LABEL);
	this.super.addClass.call(this, SComponent.cssclass.CHECKBOX);
	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.id = this.id + "_checkbox";
	checkbox.className = SComponent.cssclass.CHECKBOX_IMAGE;
	this.checkbox = checkbox;
	var element   = this.super.getElement.call(this);
	element.appendChild(checkbox);
	this.super.setLabelPosition.call(this, SComponent.labelposition.RIGHT);
};
SCheckBox.prototype = new SComponent();
SCheckBox.prototype.getEnabledElement = function() {
	return this.checkbox;
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
	this.clearChildNodes();
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