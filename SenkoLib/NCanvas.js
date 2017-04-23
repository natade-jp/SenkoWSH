/**
 * SenkoHTMLCanvas.js
 * 
 */

var SenkoHTMLCanvas = (function() {
	function SenkoHTMLCanvas() {
		this.width = 640;
		this.height = 480;
	}
	SenkoHTMLCanvas.prototype.setSize = function(width, height) {
		if(arguments.length !== 2) {
			throw "IllegalArgumentException";
		}
		else if((typeof width !== "number") || (typeof height !== "number")) {
			throw "IllegalArgumentException";
		}
		else if((width < 0) || (height < 0)) {
			throw "IllegalArgumentException";
		}
		this.width = width;
		this.height = height;
	};
	
	SenkoHTMLCanvas.prototype.setWidth = function(width) {
	};
	SenkoHTMLCanvas.prototype.setHeight = function(height) {
	};
	return(SenkoHTMLCanvas);
})();

