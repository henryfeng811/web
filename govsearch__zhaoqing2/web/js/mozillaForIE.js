HTMLElement.prototype.innerHTML setter = function (str) {
	var r = this.ownerDocument.createRange();
	r.selectNodeContents(this);
	r.deleteContents();
	var df = r.createContextualFragment(str);
	this.appendChild(df);
	
	return str;
}
  
HTMLElement.prototype.outerHTML setter = function (str) {
	var r = this.ownerDocument.createRange();
	r.setStartBefore(this);
	var df = r.createContextualFragment(str);
	this.parentNode.replaceChild(df, this);
	return str;
}


HTMLElement.prototype.innerHTML getter = function () {
	return getInnerHTML(this);
}

function getInnerHTML(node) {
	var str = "";
	for (var i=0; i<node.childNodes.length; i++)
		str += getOuterHTML(node.childNodes.item(i));
	return str;
}

HTMLElement.prototype.outerHTML getter = function () {
	return getOuterHTML(this)
}

function getOuterHTML(node) {
	var str = "";
	
	switch (node.nodeType) {
		case 1: // ELEMENT_NODE
			str += "<" + node.nodeName;
			for (var i=0; i<node.attributes.length; i++) {
				if (node.attributes.item(i).nodeValue != null) {
					str += " "
					str += node.attributes.item(i).nodeName;
					str += "=\"";
					str += node.attributes.item(i).nodeValue;
					str += "\"";
				}
			}

			if (node.childNodes.length == 0 && leafElems[node.nodeName])
				str += ">";
			else {
				str += ">";
				str += getInnerHTML(node);
				str += "<" + node.nodeName + ">"
			}
			break;
				
		case 3:	//TEXT_NODE
			str += node.nodeValue;
			break;
			
		case 4: // CDATA_SECTION_NODE
			str += "<![CDATA[" + node.nodeValue + "]]>";
			break;
					
		case 5: // ENTITY_REFERENCE_NODE
			str += "&" + node.nodeName + ";"
			break;

		case 8: // COMMENT_NODE
			str += "<!--" + node.nodeValue + "-->"
			break;
	}

	return str;
}


var _leafElems = ["IMG", "HR", "BR", "INPUT"];
var leafElems = {};
for (var i=0; i<_leafElems.length; i++)
	leafElems[_leafElems[i]] = true;

var allGetter = function () {
   var a = this.getElementsByTagName("*");
   var node = this;
   a.tags = function (sTagName) {
	  return node.getElementsByTagName(sTagName);
   };
   return a;
};

HTMLDocument.prototype.__defineGetter__("all", allGetter);
HTMLElement.prototype.__defineGetter__("all", allGetter);


XMLDocument.prototype.selectSingleNode = function(tagname) { 
	var result = this.evaluate(tagname, this, null, 0, null); 
	return result.iterateNext(); 
}; 

function XMLNodes(result) { 
	this.length = 0; 
	this.pointer = 0; 
	this.array = new Array(); 
	var i = 0; 
	while((this.array[i]=result.iterateNext())!=null) 
		i++; 
	//Not know why, but need -1
	this.length = this.array.length-1; 
};

XMLNodes.prototype.nextNode = function() { 
	this.pointer++; 
	return this.array[this.pointer-1]; 
};

XMLNodes.prototype.reset = function() { 
	this.pointer = 0; 
};

XMLDocument.prototype.selectNodes = function(tagname) { 
	var result = this.evaluate(tagname, this, null, 0, null); 
	var xns = new XMLNodes(result); 
	return xns; 
};
