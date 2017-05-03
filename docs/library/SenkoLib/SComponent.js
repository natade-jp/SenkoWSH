/* global System, Text, Blob, File, Element, ImageData */

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
SComponent.CLASS_IMAGEPANEL	= "SCOMPONENT_ImagePanel";
SComponent.CLASS_LABEL		= "SCOMPONENT_Label";
SComponent.CLASS_SELECT		= "SCOMPONENT_Select";
SComponent.CLASS_COMBOBOX	= "SCOMPONENT_ComboBox";
SComponent.CLASS_CHECKBOX	= "SCOMPONENT_CheckBox";
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
			option_node.text = title[i];
			option_node.value = title[i];
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
	if((element.tagName !== "INPUT") && (element.tagName !== "SELECT")){
		throw "not support";
	}
	var checked = element.getAttribute(attribute);
	if(checked === null) {
		if(!isset) {
			element.setAttribute(attribute, attribute);
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
	if((element.tagName !== "INPUT") && (element.tagName !== "SELECT")){
		throw "not support";
	}
	return (element.getAttribute(attribute) === null);
};

SComponent.prototype.setEnabled = function(isenabled) {
	if(isenabled) {
		this.removeClass(SComponent.CLASS_DISABLED);
	}
	else {
		this.addClass(SComponent.CLASS_DISABLED);
	}
	var element = this.getElement();
	// input要素ではないなら中の要素を使用する
	if((element.tagName !== "INPUT") && (element.tagName !== "SELECT")){
		element = this.getElementNode();
	}
	this._setBooleanAttribute(element, "disabled", isenabled);
};
SComponent.prototype.isEnabled = function() {
	var element = this.getElement();
	// input要素ではないなら中の要素を使用する
	if((element.tagName !== "INPUT") && (element.tagName !== "SELECT")){
		element = this.getElementNode();
	}
	return this._isBooleanAttribute(element, "disabled");
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
		wall.className = SComponent.CLASS_SPACE;
	}
	else if(type === SComponent.putype.NEWLINE) {
		wall.className = SComponent.CLASS_NEWLINE;
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
	element.id = this.id;
	element.className = SComponent.CLASS_COMPONENT;
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

/**
 * /////////////////////////////////////////////////////////
 * 以下、SComponent から継承した部品群
 * /////////////////////////////////////////////////////////
 */

var SPanel = function() {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "div");
	this.super.addClass.call(this,  SComponent.CLASS_PANEL);
};
SPanel.prototype = new SComponent();

var SLabel = function(title) {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "div", title);
	this.super.addClass.call(this,  SComponent.CLASS_LABEL);
};
SLabel.prototype = new SComponent();

var SComboBox = function(item) {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "select", item);
	this.super.addClass.call(this, SComponent.CLASS_SELECT);
	this.super.addClass.call(this, SComponent.CLASS_COMBOBOX);
};
SComboBox.prototype = new SComponent();
SComboBox.prototype.addListener = function(func) {
	this.getElement().addEventListener("change", func, false);
};
SComboBox.prototype.setSelectedItem = function(text) {
	var child = this.getElement().children;
	var i = 0, j = 0;
	for(i = 0; i < child.length; i++) {
		if(child[i].tagName === "OPTION") {
			if(child[i].value === text) {
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
	this.super.addClass.call(this, SComponent.CLASS_CHECKBOX);
	var checkbox = document.createElement("input");
	checkbox.setAttribute("type", "checkbox");
	checkbox.id = this.id + "_checkbox";
	this.checkbox = checkbox;
	var element   = this.super.getElement.call(this);
	element.appendChild(checkbox);
	this.super.setLabelPosition.call(this, SComponent.labelposition.RIGHT);
};
SCheckBox.prototype = new SComponent();
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
	this.super.addClass.call(this, SComponent.CLASS_BUTTON);
	var element   = this.super.getElement.call(this);
	element.setAttribute("type", "button");
};
SButton.prototype = new SComponent();
SButton.prototype.addListener = function(func) {
	this.getElement().addEventListener("click", func, false);
};

var SFileButton = function(title) {
	// CSS有効化のために、label 内に input(file) を入れる
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "label", title);
	this.super.addClass.call(this, SComponent.CLASS_BUTTON);
	this.super.addClass.call(this, SComponent.CLASS_FILE);
	var element   = this.super.getElement.call(this);
	var file = document.createElement("input");
	file.setAttribute("type", "file");
	file.id = this.id + "_file";
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
SFileButton.prototype.addListener = function(func) {
	this.file.addEventListener("change",
		function(event){
			func(event.target.files);
		}, false );
};

var SCanvas = function() {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "canvas");
	this.super.addClass.call(this,  SComponent.CLASS_CANVAS);
	this.canvas = this.super.getElement.call(this);
	this.setPixelSize(300, 150);	// canvas のデフォルト値を設定する
	this.context = null;
};
SCanvas.prototype = new SComponent();
SCanvas.prototype.getPixelSize = function() {
	return {width: this.canvas.width, height: this.canvas.height};
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
	if(this.context) {
		return this.context;
	}
	this.context = this.canvas.getContext("2d");
	return this.context;
};
SCanvas.drawtype = {
	ORIGINAL					: 0,
	ASPECT_RATIO				: 1,
	FILL						: 2,
	LETTER_BOX					: 3
};
SCanvas.prototype.clear = function() {
	var pixelsize = this.getPixelSize();
	this.canvas.clearRect(0, 0,  pixelsize.width, pixelsize.height);
};
SCanvas.prototype.getImageData = function() {
	var pixelsize = this.getPixelSize();
	return this.canvas.getImageData(0, 0, pixelsize.width, pixelsize.height);
};
SCanvas.prototype.setImageData = function(imagedata) {
	this.canvas.putImageData(imagedata, 0, 0);
};
SCanvas.prototype._setImage = function(image, isresizecanvas, drawsize) {
	var pixelsize = this.getPixelSize();
	var dx = 0, dy = 0;
	var width  = pixelsize.width;
	var height = pixelsize.height;
	if(SCanvas.drawtype.ORIGINAL === drawsize) {
		width  = image.width;
		height = image.height;
	}
	else if(SCanvas.drawtype.FILL === drawsize) {
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
	this.canvas.fillStyle = "rgb(0, 0, 0)";
	this.canvas.fillRect(0, 0,  pixelsize.width, pixelsize.height);
	
	if(image instanceof Image) {
		this.canvas.drawImage(
			image,
			0, 0, image.width, image.height,
			dx, dy, width, height
		);
	}
	else if(image instanceof ImageData) {
		this.canvas.putImageData(
			image,
			0, 0,
			dx, dy, width, height
		);
	}
};
SCanvas.prototype.setImage = function(data, isresizecanvas, drawsize, drawcallback) {
	if((data instanceof Image) || (data instanceof ImageData)) {
		// Image -> canvas, ImageData -> canvas
		this._setImage(data, isresizecanvas, drawsize);
		if(typeof drawcallback === "function") {
			drawcallback();
		}
	}
	else if(typeof data === "string") {
		var _this = this;
		var image = new Image();
		// URL(string) -> Image
		image.onload = function() {
			_this.setImage(image, isresizecanvas, drawsize, drawcallback);
		};
		image.src = data;
	}
	else if(data instanceof SCanvas) {
		// SCanvas -> canvas
		_this.setImage(data.getElement(), isresizecanvas, drawsize, drawcallback);
	}
	else if((data instanceof Element) && (data.tagName === "CANVAS")){
		// canvas -> URL(string)
		_this.setImage(data.toDataURL(), isresizecanvas, drawsize, drawcallback);
	}
	else if((data instanceof Blob) || (data instanceof File)) {
		var _this = this;
		var reader = new FileReader();
		// Blob, File -> URL(string)
		reader.onload = function() {
			_this.setImage(reader.result, isresizecanvas, drawsize, drawcallback);
		};
		reader.readAsDataURL(data);
	}
	else {
		throw "IllegalArgumentException";
	}
};

var SImagePanel = function() {
	this.super = SComponent.prototype;
	this.super._initComponent.call(this, "div");
	this.super.addClass.call(this,  SComponent.CLASS_IMAGEPANEL);
	var image = document.createElement("img");
	image.id = this.id + "_img";
	this.image = image;
	this.getElement.call(this).appendChild(this.image);
};
SImagePanel.prototype = new SComponent();
SImagePanel.prototype.clear = function() {
	this.clearChildNodes();
};
SImagePanel.prototype.setImage = function(data) {
	if(typeof data === "string") {
		// URL(string) -> IMG
		this.image.src = data;
	}
	else if(data instanceof SCanvas) {
		// SCanvas -> canvas
		this.setImage(data.getElement());
	}
	else if((data instanceof Element) && (data.tagName === "CANVAS")){
		// canvas -> URL(string)
		try {
			this.setImage(data.toDataURL("image/png"));
		} catch(e) {
		}
		try {
			this.setImage(data.toDataURL("image/jpeg"));;
		} catch(e) {
		}
	}
	else if((data instanceof Blob) || (data instanceof File)) {
		var _this = this;
		var reader = new FileReader();
		// Blob, File -> URL(string)
		reader.onload = function() {
			_this.setImage(reader.result);
		};
		reader.readAsDataURL(data);
	}
	else {
		throw "IllegalArgumentException";
	}
};


