/**
 * ArrayList.js
 * 
 * VERSION:
 *  0.04
 *
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  CC0					(http://sciencecommons.jp/cc0/about)
 *
 * HISTORY:
 *  2013/04/15 - v0.01 - natade - first release
 *  2013/04/22 - v0.02 - natade - support  sort, each
 *  2013/08/24 - v0.03 - natade - change   NYSL Version 0.9982 -> TRIPLE LICENSE
 *  2013/09/15 - v0.04 - natade - コンストラクタ追加
 *
 * DEPENDENT LIBRARIES:
 *  なし
 */

var ArrayList = function() {
	this.element = [];
	if(arguments.length === 1) {
		for(var i = 0; i < arguments[0].element.length; i++) {
			this.element[i] = arguments[0].element[i];
		}
	}
};

ArrayList.prototype.each = function(func) {
	var out = true;
	for(var i = 0; i < this.element.length; i++) {
		var x = this.element[i];
		if(func.call(x, i, x) === false) {
			out = false;
			break;
		}
	}
	return(out);
};
ArrayList.prototype.toString = function() {
	return(this.join(", "));
};
ArrayList.prototype.isEmpty = function() {
	return(this.element.length === 0);
};
ArrayList.prototype.contains = function(object) {
	return(this.element.contains(object));
};
ArrayList.prototype.size = function() {
	return(this.element.length);
};
ArrayList.prototype.clear = function() {
	this.element.length = 0;
};
ArrayList.prototype.join = function(separator) {
	if(arguments.length === 0) {
		separator = ",";
	}
	return(this.element.join(separator));
};
ArrayList.prototype.clone = function() {
	var out = new ArrayList();
	for(var i = 0; i < this.element.length; i++) {
		out.element[i] = this.element[i];
	}
	return(out);
};
ArrayList.prototype.indexOf = function(object) {
	for(var i = 0; i < this.element.length; i++) {
		if(this.element[i] === object) {
			return(i);
		}
	}
	return(-1);
};
ArrayList.prototype.lastIndexOf = function(object) {
	for(var i = this.element.length - 1; i !== -1; i--) {
		if(this.element[i] === object) {
			return(i);
		}
	}
	return(-1);
};
ArrayList.prototype.get = function(index) {
	return(this.element[index]);
};
ArrayList.prototype.add = function() {
	if(arguments.length === 1) {
		var object = arguments[0];
		this.element.push(object);
	}
	else if(arguments.length === 2) {
		var index = arguments[0];
		var object = arguments[1];
		this.element.splice(index, 0, object);
	}
};
ArrayList.prototype.addAll = function() {
	if(arguments.length === 1) {
		var list  = arguments[0];
		var j = this.element.length;
		for(var i = 0; i < list.length; i++) {
			this.element[j++] = list.element[i];
		}
	}
	else if(arguments.length === 2) {
		var index = arguments[0];
		var list  = arguments[1].element;
		if(list === this.element) {
			list = this.element.slice(0);
		}
		var size = this.element.length - index;
		var target_i = this.element.length + list.length - 1;
		var source_i = this.element.length - 1;
		for(var i = 0; i < size ; i++ ) {
			this.element[target_i--] = this.element[source_i--];
		}
		size = list.length;
		for(var i = 0; i < size; i++) {
			this.element[index++] = list[i];
		}
	}
};
ArrayList.prototype.set = function(index, object) {
	this.element[index] = object;
};
ArrayList.prototype.remove = function(index) {
	this.element.splice(index, 1);
};
ArrayList.prototype.removeRange = function(fromIndex, toIndex) {
	this.element.splice(fromIndex, toIndex - fromIndex);
};
ArrayList.prototype.sort = function(compareFunction) {
	var compare;
	if(arguments.length === 0) {
		// 比較関数
		compare = function(a, b) {
			if(a === b) {
				return(0);
			}
			if(typeof a === typeof b) {
				return(a < b ? -1 : 1);
			}
			return((typeof a < typeof b) ? -1 : 1);
		};
	}
	else {
		compare = compareFunction;
	}
	var temp = [];
	// ソート関数（安定マージソート）
	var sort = function(element, first, last, cmp_function) { 
		if(first < last) {
			var middle = Math.floor((first + last) / 2);
			sort(element, first, middle, cmp_function);
			sort(element, middle + 1, last, cmp_function);
			var p = 0, i, j, k;
			for(i = first; i <= middle; i++) {
				temp[p++] = element[i];
			}
			i = middle + 1;
			j = 0;
			k = first;
			while((i <= last) && (j < p)) {
				if(cmp_function(element[i], temp[j]) >= 0) {
					element[k++] = temp[j++];
				}
				else {
					element[k++] = element[i++];
				}
			}
			while(j < p) {
				element[k++] = temp[j++];
			}
		}
		return(true);
	};
	sort(this.element, 0, this.element.length - 1, compare);
};