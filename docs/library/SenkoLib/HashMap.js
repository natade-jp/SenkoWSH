/**
 * HashMap.js
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

var HashMap = function() {
	this.map = [];
	this.size_ = 0;
	if(arguments.length === 1) {
		for(var key in arguments[0].map) {
			this.map[key] =arguments[0].map[key];
		}
		this.size_ = arguments[0].size_;
	}
};

HashMap.prototype.each = function(func) {
	var out = true;
	for(var key in this.map) {
		var x = this.map[key];
		if(func.call(x, key, x) === false) {
			out = false;
			break;
		}
	}
	return(out);
};
HashMap.prototype.toString = function() {
	var output = "";
	var i = 0;
	for(var key in this.map) {
		output += key + "=>" + this.map[key];
		i++;
		if(i !== this.size_) {
			output += "\n";
		}
	}
	return(output);
};
HashMap.prototype.containsKey = function(key) {
	return(typeof this.map[key] !== "undefined");
};
HashMap.prototype.containsValue = function(value) {
	for(var key in this.map) {
		if(this.map[key] === value) {
			return(true);
		}
	}
	return(false);
};
HashMap.prototype.isEmpty = function() {
	return(this.size_ === 0);
};
HashMap.prototype.clear = function() {
	this.map   = [];
	this.size_ = 0;
};
HashMap.prototype.clone = function() {
	var out = new HashMap();
	for(var key in this.map) {
		out.map[key] = this.map[key];
	}
	out.size_ = this.size_;
	return(out);
};
HashMap.prototype.size = function() {
	return(this.size_);
};
HashMap.prototype.get = function(key) {
	return(this.map[key]);
};
HashMap.prototype.put = function(key, value) {
	if(this.containsKey(key) === false) {
		this.map[key] = value;
		this.size_ = this.size_ + 1;
		return(null);
	}
	else {
		var output = this.map[key];
		this.map[key] = value;
		return(output);
	}
};
HashMap.prototype.putAll = function(hashmap) {
	for(var key in hashmap.map) {
		if(typeof this.map[key] === "undefined") {
			this.map[key] = hashmap.map[key];
			this.size_ = this.size_ + 1;
		}
	}
};
HashMap.prototype.remove = function(key) {
	if(this.containsKey(key) === false) {
		return(null);
	}
	else {
		var output = this.map[key];
		delete this.map[key];
		this.size_ = this.size_ - 1;
		return(output);
	}
};