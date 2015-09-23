Object.extend(Array.prototype, {
	_find:function(pattern,param){
		param=(param)?'.'+param:'';
		for(var i=0;i<this.length;i++)
		{
			if(pattern==eval('this[i]'+param))return i;
		}
		return -1;
	},
	_contains:function(pattern,param){
		param=(param)?'.'+param:'';
		for(var i=0;i<this.length;i++)
		{
			if(pattern==eval('this[i]'+param))return true;
		}
		return false;
	},
	_insertAt:function(ind,value){
		this[this.length] = null;
		for(var i=this.length-1;i>=ind;i--)
		{
			this[i] = this[i-1];
		}
		this[ind] = value;
	},
	_without : function(){
		var arr = this.without.apply(this,arguments).compact();
		for(var i=0;i<arr.length;i++){
			this[i] = arr[i];
		}
		this.length = arr.length;
	},
	_remove:function(ind){
		for(var i=ind;i<this.length;i++)
		{
			this[i] = this[i+1]
		}
		this.length--;
	},
	_removes:function(inds){
		for(var i=0;i<inds.length;i++)
		{
			try{
				this[inds[i]] = null;
			}catch(err){}
		}
		var arr = this.compact();
		for(var i=0;i<arr.length;i++){
			this[i] = arr[i];
		}
		this.length = arr.length;
	},
	_swapItems:function(ind1,ind2){
		var tmp = this[ind1];
		this[ind1] = this[ind2]
		this[ind2] = tmp;
	},
	_sort:function(up,param){
		param=(param)?'.'+param:'';
		for(var i=0;i<this.length;i++)
		{
			var m=eval('this[i]'+param);
			var index=i;
			for(var j=i+1;j<this.length;j++)
			{
				tmp=eval('this[j]'+param);
				if(up&&m>tmp){
					m=tmp;
					index=j;
				}
				if(!up&&m<tmp){
					m=tmp;
					index=j;
				}
			}
			if(i<index)this._swapItems(i,index);
		}
	}
});

Element.insertHTML=function(oEdit,_sStr,hideDiv){
	oEdit=oEdit.contentWindow;
	if (_IE) {
		try
		{
			oEdit.focus();
			var selection=oEdit.document.selection;
			$log().debug("selection="+selection);
			var selectedRange;
			if(selection)
			{
				selectedRange = selection.createRange();
				selectedRange = hideDiv.range;
			}
			$log().debug("hideDiv.type="+hideDiv.type);
			$log().debug("selection.type="+selection.type);
			if(hideDiv.type.toLowerCase()=='control'||selection.type.toLowerCase()=='control')
			{
				var node=selectedRange.item(0);
				$log().debug("node="+node);
				var parent=node.parentNode;
				if(node.tagName.toLowerCase()=='img'&&parent.tagName.toLowerCase()=='a')
				{
					node=parent;
					parent=parent.parentNode;
				}
				$log().debug("parent="+parent);
				$log().debug("node="+node);
				node.insertAdjacentHTML('beforeBegin',_sStr);
				parent.removeChild(node);
				oEdit.focus();
			}
			else
			{
				$log().debug("selectedRange.text="+selectedRange.text);
				selectedRange.pasteHTML(_sStr);
				selectedRange.collapse(false);
				selectedRange.select();
				oEdit.focus();
			}
		}catch(err)
		{
			$log().error(err.message);
			$alert(err.message);
		}
	}
	else
	{
	 	oEdit.focus();
		oEdit.document.execCommand('insertHTML', false, _sStr);
	}
	delete hideDiv;
	delete oEdit;
}

if(!_IE)
{
	HTMLElement.prototype.__defineGetter__("innerText",function()
	{
		var text=null;
		text = this.ownerDocument.createRange();
		text.selectNodeContents(this);

		text = text.toString();
		return text;
	});
	HTMLElement.prototype.__defineSetter__("innerText", function (sText) {
		this.innerHTML = sText.replace(/\&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g,'<br>');
	});
	var _emptyTags = {
	   "IMG":   true,
	   "BR":    true,
	   "INPUT": true,
	   "META":  true,
	   "LINK":  true,
	   "PARAM": true,
	   "HR":    true
	};
	HTMLElement.prototype.__defineGetter__("outerHTML", function () {
	   var attrs = this.attributes;
	   var str = "<" + this.tagName;
	   for (var i = 0; i < attrs.length; i++)
	      str += " " + attrs[i].name + "=\"" + attrs[i].value + "\"";
	
	   if (_emptyTags[this.tagName])
	      return str + ">";
	
	   return str + ">" + this.innerHTML + "</" + this.tagName + ">";
	});
	HTMLElement.prototype.__defineSetter__("outerHTML", function (sHTML) {
	   var r = this.ownerDocument.createRange();
	   r.setStartBefore(this);
	   var df = r.createContextualFragment(sHTML);
	   this.parentNode.replaceChild(df, this);
	});
	HTMLElement.prototype.__defineGetter__("outerText", function () {
	   var r = this.ownerDocument.createRange();
	   r.selectNodeContents(this);
	   return r.toString();
	});
	HTMLElement.prototype.__defineSetter__("outerText", function (sText) {
	   this.outerHTML = sText.replace(/\&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g,'<br>');
	});
	HTMLElement.prototype.__defineGetter__("uniqueID", function(){
		if(!arguments.callee.count)arguments.callee.count=0;
		var u = "moz_id" + arguments.callee.count++;
//		window[u] = this;
		this.__defineGetter__("uniqueID",function(){return u});
		return u;
	});
};

// Create the loadXML method and xml getter for Mozilla
if ( window.DOMParser &&
	  window.XMLSerializer &&
	  window.Node && Node.prototype && Node.prototype.__defineGetter__ ) {

   if (!Document.prototype.loadXML) {
      Document.prototype.loadXML = function (s) {
         var doc2 = (new DOMParser()).parseFromString(s, "text/xml");
         while (this.hasChildNodes())
            this.removeChild(this.lastChild);

         for (var i = 0; i < doc2.childNodes.length; i++) {
            this.appendChild(this.importNode(doc2.childNodes[i], true));
         }
      };
	}

	Document.prototype.__defineGetter__( "xml",
	   function () {
		   return (new XMLSerializer()).serializeToString(this);
	   }
	 );
}

Object.extend(Form,{
	$ : function(name){
		var v = document.getElementsByName(name);
		if(v.length == 1)return v[0];
		return v;
	},
	$value : function(name){
		var v = document.getElementsByName(name);
		var a = [];
		for ( var i=0 ; i<v.length ; i++ ) {
			var sTmp = Form.Element.getValue(v[i]);
			if ( sTmp!=null && sTmp!=undefined ) {
				a.push(sTmp);
			}
		}
		return (a.length==1) ? a[0] : a;
	}
});

Object.extend(String.prototype, {
	lTrim : function () {
		return this.replace(/^\s*/, "");
	},
	rTrim : function () {
		return this.replace(/\s*$/, "");
	},
	trim : function () {
		return this.rTrim().lTrim();
	},
	endsWith : function(sEnd) {
		return (this.substr(this.length-sEnd.length)==sEnd);
	},
	startsWith : function(sStart) {
		return (this.substr(0,sStart.length)==sStart);
	},
	format : function(){
		var s = this; for (var i=0; i < arguments.length; i++)
		{
			s = s.replace("{" + (i) + "}", arguments[i]);
		}
		return(s);
	},
	encodeAjaxParams : function(){
		return this.replace(/&/g,'__').replace(/=/g,'_').replace(/\./g,'_');
	},
	extractJsScripts:function(){
		var sf='<script\\s+.*src\\s*=\\s*([\'"]?)\\s*([^\\s\'"]+)\\s*\\1.*?>(\n|\r|.)*?<\/script>';
		var matchAll = new RegExp(sf, 'img');
		var matchOne = new RegExp(sf, 'im');
		return (this.match(matchAll) || []).map(function(scriptTag) {
			return (scriptTag.match(matchOne) || ['', '',''])[2];
		});
	},
	extractHrefLinks	: function(){
		var sf='<link\\s+[^>]*href\\s*=\\s*([\'"]?)\\s*([^\\s\'"]+)\\s*\\1[^>]*?/?>';
		var matchAll = new RegExp(sf, 'img');
		var matchOne = new RegExp(sf, 'im');
		return (this.match(matchAll) || []).map(function(linkTag) {
			return (linkTag.match(matchOne) || ['', '',''])[2];
		});
	},
	textScripts : function(){
		return this.extractScripts().map(function(script){
			var eScript=document.createElement('SCRIPT');
			eScript.type='text/javascript';
			eScript.text=script;
			return eScript;
		});
	},
	srcScripts	: function(){
		return this.extractJsScripts().map(function(script){
			var eScript=document.createElement('SCRIPT');
			eScript.type='text/javascript';
			eScript.src=script;
			return eScript;
		});
	},
	evalJsScripts: function() {
		return this.extractJsScripts().map(function(script){
			var eScript=document.createElement('SCRIPT');
			eScript.src=script;
			eScript.type='javascript';
			return eScript;
		});
	},
	byteLength:function(){
		var length = 0;
		this.replace(/[^\x00-\xff]/g,function(){length++;});
		return this.length+length;
	}
});
Object.extend(Element, {
  update: function(element, html) {
	var ele=$(element);
	$removeChilds(ele);
	html = html || '';
    ele.innerHTML = html.stripScripts();
    setTimeout(function() {
		html.srcScripts().each(function(value,index){
			ele.appendChild(value);
		});
		html.textScripts().each(function(value,index){
			void(ele.appendChild(value));
		});
	}, 1);
  },
  removeOuter: function(element) {
	for(;element.childNodes.length>0;){
		var child=element.childNodes[0];
		element.parentNode.insertBefore(child,element);
	}
	element.parentNode.removeChild(element);
  },
  cloneNode : function(element) {
  	if(false){
	  	var eContainer=document.createElement('DIV');
 		eContainer.innerHTML=element.outerHTML;
  		var eReturn=eContainer.childNodes[0];
  		eContainer.removeChild(eReturn);
  		delete eContainer;
  		return eReturn;
  	}
  	else{
  		return element.cloneNode(true);
  	}
  },
  removeIframe : function(eIframe){
	var c = eIframe;
	c.parentNode.removeNode(c);
	c.contentWindow.opener = null;
	c.contentWindow.close();
	c = null;
  }
});
Object.clone = function(_o,_bDeep){
	if(typeof _o!='object'){
		return _o;
	}
	if(!_bDeep){
		if(Array.isArray(_o)){
			return Array.apply(null,_o);
		}
		return Object.extend({},_o);
	}
	else{
		var oReturn = null;
		if(Array.isArray(_o)){
			oReturn = [];
			for(var i=0;i<_o.length;i++){
				oReturn.push(Object.clone(_o[i],true));
			}
		}
		else{
			oReturn = {};
			for(var prop in _o){
				oReturn[prop] = Object.clone(_o[prop],true);
			}
		}
		return oReturn;
	}
};
Array.isArray = function(_object){
	return (_object!=null)&&(_object.constructor!=null)&&(_object.constructor==Array||_object.constructor.toString().trim().indexOf('function Array()')==0);
}
String.isString = function(_object){
	return (typeof _object=="string")||
		((_object!=null)&&(_object.constructor!=null)&&(_object.constructor==String||_object.constructor.toString().trim().indexOf('function String()')==0));
}
Object.isObject = function(_object){
	return (_object!=null)&&(_object.constructor!=null)&&(_object.constructor==Object||_object.constructor.toString().trim().indexOf('function Object()')==0);
}
Boolean.isBoolean = function(_object){
	return (typeof _object=="boolean")||
		((_object!=null)&&(_object.constructor!=null)&&(_object.constructor==Boolean||_object.constructor.toString().trim().indexOf('function Boolean()')==0));
}
Number.isNumber = function(_object){
	return (typeof _object=="number")||
		((_object!=null)&&(_object.constructor!=null)&&(_object.constructor==Number||_object.constructor.toString().trim().indexOf('function Number()')==0));
}
Function.isFunction = function(_object){
	return (typeof _object=="function")||
		((_object!=null)&&(_object.constructor!=null)&&(_object.constructor==Function||_object.constructor.toString().trim().indexOf('function Function()')==0));
}
Object.parseString=function(s){
	if(s==null){
		s='null';
	}
	else if(s==undefined){
		s='undefined';
	}
	else if(typeof s!='string'){
		s=s.toString();
	}
	return s;
};
Object._parseSource=function(e){
	var ss='';
	if(typeof e == 'function'){
		return '[function]';
	}
	else if(e&&Array.isArray(e)){
		var tmp=e.map(function(f){
			return Object._parseSource(f);
		});
		ss='['+tmp.join(',')+']';
	}
	else if(typeof e=='object'){
		ss=Object.parseSource(e);
	}
	else{
		ss=Object.parseString(e);
	}
	return ss;
};
Object.parseSource=function(o){
	try{
		var a=o.toSource();
		return a;
	}catch(err){
		if(typeof o=='function'){
			return '[function]';
		}
		else if(typeof o=='object'){
			var t=[];
			for(var i in o){
				t.push('\n' + i+':'+Object._parseSource(o[i]));
			}
			return '{'+t.join(',')+'\n}';
		}
		else{
			return Object._parseSource(o);
		}
	}
};
function getAllParameters(){
	var query = location.search;
	return query.replace(/\?/,'').parseQuery();
}
var getParameter=function urlParameter(_sName,_sQuery){
	if(_sName ==null ||_sName=='undefined') 
		return '';
	var query = _sQuery ||location.search;
	var aParams=query.replace(/^.*?\?/,'').parseQuery();
	
	for(var sParam in aParams){
		if(_sName.toUpperCase()==sParam.toUpperCase()){
			return aParams[sParam];
		}
	}
	return '';
}
var getWebURL = function(){
	var url = window.location.protocol;
	url += "//" + window.location.host;
	var matchs = window.location.pathname.match(/^(\/[^\/]+\/).*$/);
	if(matchs && matchs[1]){
		url += matchs[1];
	}
	return url;
}

function encodeParams(_sParams){
	var oParams		= _sParams || {};
	if(typeof _sParams=='string'){
		oParams		= _sParams.parseQuery();
	}
	var aParams		= [];
	for(var sParam in oParams){
		aParams.push(sParam+'='+encodeURIComponent(oParams[sParam]));
	}
	return aParams.join('&');
}
var TrsCached = [];
Class = {
  create: function(_sClassName) {
	_sClassName	= _sClassName || '';
    return function() {
	  for(var sName in this){
		  if(typeof this[sName] == 'function'){
			  if(_sClassName==''){
				  this[sName]._functionName = sName;
			  }
			  else{
				  this[sName]._functionName = _sClassName + '.' + sName;
			  }
		  }
	  }
      this.initialize.apply(this, arguments);
	  TrsCached.push(this);
    }
  }
}
function ClassName(_oObject , _sClassName) {
	_sClassName	= _sClassName || '';
	for(var sName in _oObject){
		if(typeof this[sName] == 'function'){
			if(_sClassName==''){
				this[sName]._functionName = sName;
			}
			else{
				this[sName]._functionName = _sClassName + '.' + sName;
			}
		}
	}
}

Object.extend = function(destination, source) {
	for (property in source) {
		if(typeof destination[property]=='function'){
			destination[property+'0'] = destination[property];
		}
		destination[property] = source[property];
	}
	return destination;
}
// ge gfc add @ 2006-07-04
String.Empty = '';
Object.extend(String.prototype, {
		trim : function(){
			return this.replace( /^\s*/, String.Empty).replace( /\s*$/, String.Empty);
		},
		isEmpty : function(){
			if (this == String.Empty || this.trim() == String.Empty)
				return true;

			//else
			return false;
		}, 
		getLength : function(){
			var nTotalLen = 0;
			for (var i=0; i < this.length;i++){
				var nCharCode = this.charCodeAt(i);
				if (nCharCode == 38){
					var sPart = this.substring(i, i + 4);
					var nSkip = 0;
					if (sPart == '&lt;' || sPart == '&gt;') {
						nSkip = 4;
					}else if((sPart = this.substring(i, i + 6)) == '&quot;'){
						nSkip = 6;
					}
					if (nSkip != 0){
						nTotalLen++;
						i += (nSkip - 1);
						continue;
					}
				}
				if (nCharCode >= 0 && nCharCode <= 128) {
					nTotalLen++;
				}else {
					nTotalLen+= 2;
				}
			} 
			return nTotalLen;	
		}
	}
);
var $GS = function(_field, _sAttrName){
	var field = $(_field);	
	if (field == null || field.getAttribute == 'undefined') return null;

	var sAttr = field.getAttribute(_sAttrName);
	if(sAttr != null && sAttr != 'undefined') return sAttr;
	delete _field;
	return null;
};
var $GN = function(_field, _sAttrName, _nDefaultVal){
	var sAttr = $GS(_field, _sAttrName);
	if(sAttr != null && sAttr != String.Empty) 
		return parseInt(sAttr, 10);
	delete _field;
	return _nDefaultVal;
};

function $trunc(_string, _maxLength, _sExt){
	if (_string == null) {
		return null;
	}

	if (_sExt == null) {
		_sExt = '..';
	}

	_maxLength = parseInt(_maxLength, 10);
	if (isNaN(_maxLength) ||_maxLength == 0)
		_maxLength = 50;
	var nSrcLen = _string.getLength();
	if (nSrcLen <= _maxLength) {
		// 源字符串太短，不需要截断
		return _string;
	}

	var nExtLen = _sExt.getLength();
	if (nExtLen >= _maxLength) {
		// 目标长度太短（小于了附加字符串的长度），无法截断。
		return _string;
	}
	var iLength = nSrcLen;
	var iRemain = (_maxLength - nExtLen);
	var result = '';
	for (var i = 0; i < iLength; i++) {
		var aChar = _string.charAt(i);
		var iNeed = aChar.getLength();
		if (iNeed > iRemain) {
			result += _sExt;
			break;
		}
		result += aChar;
		iRemain = iRemain - iNeed;
	}
	return result;
}
function $transHtml(_sContent) {
	if (_sContent == null)
		return '';

	var nLen = _sContent.length;
	if (nLen == 0)
		return '';

	var result = '';
	for (var i = 0; i < nLen; i++) {
		var cTemp = _sContent.charAt(i);
		switch (cTemp) {
		case '<': // 转化：< --> &lt;
			result += '&lt;';
			break;
		case '>': // 转化：> --> &gt;
			result += '&gt;';
			break;
		case '"': // 转化：" --> &quot;
			result += '&quot;';
			break;
		default:
			result += cTemp;
		}// case
	}// end for
	return result;
}
function $trans2Html(_sContent, _bChangeBlank) {
	if (_sContent == null)
		return '';

	var nLen = _sContent.length;
	if (nLen == 0)
		return '';

	var result = '';
	for (var i = 0; i < nLen; i++) {
		var cTemp = _sContent.charAt(i);
		switch (cTemp) {
		case ' ':
			result += _bChangeBlank ? '&nbsp;' : ' ';
			break;
		case '<':
			result += '&lt;';
			break;
		case '>':
			result += '&gt;';
			break;
		case '\n':
			result += '<br>';
			break;
		case '"':
			result += '&quot;';
			break;
		case '&': 
			// 处理unicode代码
			var bUnicode = false;
			for (var j = (i + 1); j < nLen && !bUnicode; j++) {
				cTemp = _sContent.charAt(i);
				if (cTemp == '#' || cTemp == ';') {
					result += '&';
					bUnicode = true;
				}
			}
			if (!bUnicode)
				result += '&amp;';
			break;
		case 9: // Tab
			result += _bChangeBlank ? '&nbsp;&nbsp;&nbsp;&nbsp;'
					: '    ';
			break;

		default:
			result += cTemp;
		}
	}
	return result;
}
function $transJs(_sContent) {
	if (_sContent == null)
		return '';

	var nLen = _sContent.length;
	if (nLen == 0)
		return '';

	var result = '';
	for (var i = 0; i < nLen; i++) {
		var cTemp = _sContent.charAt(i);
		switch (cTemp) {
			case '"': // 转化：" --> \"
				result += '\\\"';
				break;
			case '\'': // 转化：" --> \"
				result += '\\\'';
				break;
			case '\\': // 转化：\ --> \\
				result += '\\\\';
				break;
			case '\n':
				result += '\\n';
				break;
			case '\r':
				result += '\\r';
				break;
			case '\f':
				result += '\\f';
				break;
			case '\t':
				result += '\\t';
				break;
			case '/':
				result += '\\/';
				break;
		default:
			result += cTemp;
		}// case
	}// end for
	return result;
}

function $linkPre(_string){
	if(_string == '') return '';

	return '<a href="' + _string + '" target="_blank">';
}
function $linkExt(_string){
	if(_string == '') return '';

	return '</a>';
}

function $checkSearchWordLen(_field, _sName){
	var sName = _sName == null ? '检索字段' : _sName;
	var nMaxLen = 64;
	var nLen = 0;
	if((nLen = _field.value.trim().length) > nMaxLen) {
		$alert('<span style="font-family:Courier New;font-size:13px;">[<b>' + sName + '</b>]长度为[<b>' + nLen + '</b>], 超过最大允许长度[<b>' + nMaxLen + '</b>]！</span>', function(){
			_field.select();
			_field.focus();
			$dialog().hide();
		});
		return false;
	}
	return true;
}

function $checkHttpUrl(_sUrl){
	//站点HTTP格式检验
	var ptnRootDomain = /^(http:\/\/|https:\/\/)./;
	var strRootDomain = _sUrl || '';
	strRootDomain = strRootDomain.toLowerCase();
	if(strRootDomain!='' && !strRootDomain.match(ptnRootDomain)) {
		return '不合法的url！正确格式为：http(s)://[站点](:[端口])/(子目录)！';
	}
	
	return null;
}
if(!window.Dom){
	Dom = {};
}
Dom.isDom = function(_obj){
	return (typeof _obj == 'object')&&((_IE&&_obj.constructor===window.undefined)||
		(!_IE&&_obj.constructor.toString().endsWith('Element')));
}
function $destroy(_obj){
	if(_obj==null)return;
	try{
		if(_obj.destroy&&Function.isFunction(_obj.destroy)){
			var fDestroy = _obj.destroy;
			_obj.destroy = null;
			fDestroy.call(_obj);
		}
		else if(Dom.isDom(_obj)){
			try{
				Event.stopAllObserving(_obj);
				for(var name in _obj){
//					try{
						_obj[name] = null;
//					}catch(err){
						//alert("Inner:Dom.isDom:" + name + ":" + err.message);
//					}
				}
			}catch(err){
				//alert("Outer:Dom.isDom:" + name + ":" + err.message);
			}
		}
		else if(Object.isObject(_obj)){
			try{
				for(var name in _obj){
					$destroy(_obj[name]);
					delete _obj[name];
				}
			}catch(err){
				//alert("Dom.isObject:" + name + ":" + err.message);
			}
		}
		else if(Array.isArray(_obj)){
			for(var i=0;i<_obj.length;i++){
				$destroy(_obj[i]);
				delete _obj[i];
			}
			_obj = null;
		}
		else{
			delete _obj;
		}
	}catch(err){
		alert('when destroy some objects,error occours:'+_obj.destroy);
	}
}
document.getAnyElementByTagName = function(_sNameSpace,_sTagName,_eRoot){
	var d = document;
	if(_eRoot){
		_eRoot = d;
	}
	var elList = [];
	var tmpFn = document.getAnyElementByTagName;
	if(!_sNameSpace){
		return _eRoot.getElementsByTagName(_sTagName);
	}
	if(tmpFn._scanMode){
		if(tmpFn._ns[_sNameSpace]==null){
			if(_sNameSpace !=""&&d.namespaces&&!d.namespaces[_sNameSpace]){
				alert("IE Requirement - Add xmlns:"+_sNameSpace+" to the HTML tag.")
			}
			else{
				tmpFn._ns[_sNameSpace] = true;
			}
		}
		if(!_sTagName){
			_sTagName = '*';
		}
		var elTemp = _eRoot.getElementsByTagName(_sTagName);
		var iCount = elTemp.length;
		for(var i=0;i<iCount;i++){
			var objItem = elTemp[i];
			var strProp = objItem[tmpFn._propName];
			if(strProp&&strProp.toLowerCase()==_sNameSpace.toLowerCase()){
				elList.push(objItem);
			}
		}
	}
	else{
		if(!_sTagName||_sTagName=='*'){
			var elTemp = _eRoot.getElementsByTagName("*");
			var iCount=elTemp.length;
			for(var i=0;i<iCount;i++){
				var objItem = elTemp[i];
				var tagNameTemp = objItem.tagName;
				if(tagNameTemp&&tagNameTemp.match(new RegExp('^'+_sNameSpace+':','ig'))){
					elList.push(objItem);
				}
			}
		}
		else{
			elList = _eRoot.getElementsByTagName(_sTagName);
		}
	}
	return elList;
}
document.getAnyElementByTagName._scanMode=(_IE||(_OPERA&&_BrowserVersion<9));
document.getAnyElementByTagName._propName=_IE?"scopeName":"prefix";
document.getAnyElementByTagName._ns=[];
document.resolveTagName=function(_el){
	var sTagName=_el.tagName;
	if(sTagName&&_IE&&_el.scopeName&&_el.scopeName.toLowerCase()!="html"){
		sTagName=_el.scopeName+":"+sTagName;
	}
	else if(sTagName&&_OPERA&&_el.prefix&&_el.prefix.toLowerCase()!="html"){
		sTagName=_el.prefix+":"+sTagName;
	}
	if(sTagName){
		sTagName = sTagName.toLowerCase();
	}
	delete _el;
	return sTagName;
}
document.tagName = function(_el){
	var sTagName = _el.tagName;
	if(sTagName&&_MOZILLA){
		var idx = sTagName.indexOf(':');
		if(idx!=-1){
			sTagName = sTagName.substring(idx+1).toLowerCase();
		}
	}
	else if(sTagName){
		sTagName = sTagName.toLowerCase();
	}
	delete _el;
	return sTagName;
}
document.getAttributes=function(_eElement){
	var sJudgeAttrs = _eElement.getAttribute("_attrs_",2);
	var tmpAttrs = {};
	if(sJudgeAttrs!=null){
		sJudgeAttrs.split(',').each(function(s){
			tmpAttrs[s] = _eElement.getAttribute(s,2);
		});
	}
	else{
		var attributes = _eElement.attributes;
		for(var j=0;j<attributes.length;j++){
			var sAttrName	= attributes[j].name;
			if(!_IE||attributes[j].specified){
				var sValue	= '';
				if('href'==sAttrName.toLowerCase()){
					sValue	= _eElement.getAttribute('href',2);
				}
				else if('value'==sAttrName.toLowerCase()){
					sValue	= _eElement.value;
				}
				else{
					sValue	= attributes[j].value;
				}
				tmpAttrs[sAttrName]	= sValue;
			}
		}
	}
	var aReturn			= [];
	for(var sName in tmpAttrs){
		if(sName.toLowerCase()=='style'){
			aReturn.push(sName+'="'+_eElement.style.cssText+'"');
		}
		else if(sName.toLowerCase()=='class'){
			aReturn.push(sName+'="'+Element.classNames(_eElement)+'"');
		}
		else if(typeof tmpAttrs[sName]!='string'){
		}
		else{
			aReturn.push(sName+'="'+tmpAttrs[sName].replace(/\"/g,'\'')+'"');
		}
	}
	return aReturn.join(' ');
}

function validDate(sDate,sSep){
	sSep = sSep || '-';
	var isValid = true;
	try{
		var d=new Date();
		var tmp = sDate.split(sSep);
		d.setYear(parseInt(tmp[0], 10));
		d.setMonth(parseInt(tmp[1], 10)-1);
		d.setDate(parseInt(tmp[2], 10));
		if(d.getDate()!=tmp[2]){
			isValid = false;
		}
	}catch(err){
		isValid = false;
	}
	return isValid;
}

function $removeNode(_node){
	if(_node){
		var childs = _node.childNodes;
		for(var i=childs.length-1;i>=0;i--){
			$removeNode(childs[i]);
		}
		childs = [];
		if(_node.parentNode){
			_node.parentNode.removeChild(_node);
		}
//		Event.stopAllObserving(_node);
		delete _node;
	}
}
function $removeChilds(_node){
	if(_node){
		var childs = _node.childNodes;
		for(var i=childs.length-1;i>=0;i--){
			$removeNode(childs[i]);
		}
		childs = [];
		delete _node;
	}
}
Function.prototype.bindAsEventListener = function() {
  var __method = this, args = $A(arguments), object = args.shift();
  return function(event) {
    return __method.apply(object, [event || window.event].concat(args).concat(arguments));
  }
}
function $toQueryStr(_oParams){
	if(_oParams == null) {
		return '';
	}
	var arrParams = _oParams;
	var arrParamsSAparts = new Array();
	for (var param in arrParams){
		var elm = arrParams[param];
		if(typeof(elm) == 'function' || (typeof(elm) == 'object' && !Array.isArray(elm))) {
			continue;
		}
		arrParamsSAparts.push(param + '=' + arrParams[param]);
	}
	if(arrParamsSAparts.length == 0) {
		return '';
	}
	return arrParamsSAparts.join('&');
}
function $style(_sCssText){
	var eStyle=document.createElement('STYLE');
	eStyle.setAttribute("type", "text/css");
	if(eStyle.styleSheet){// IE
		eStyle.styleSheet.cssText = _sCssText;
	} else {// w3c
		var cssText = document.createTextNode(_sCssText);
		eStyle.appendChild(cssText);
	}
	return eStyle;
}
Object.extend(Event, {
  _domReady : function() {
    if (arguments.callee.done) return;
    arguments.callee.done = true;

    if (this._timer)  clearInterval(this._timer);
    
    this._readyCallbacks.each(function(f) { f() });
    this._readyCallbacks = null;
},
  onDOMReady : function(f) {
    if (!this._readyCallbacks) {
      var domReady = this._domReady.bind(this);
      
      if (document.addEventListener)
        document.addEventListener("DOMContentLoaded", domReady, false);
        
        /*@cc_on @*/
        /*@if (@_win32)
            document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
            document.getElementById("__ie_onload").onreadystatechange = function() {
                if (this.readyState == "complete") domReady(); 
            };
        /*@end @*/
        
        if (/WebKit/i.test(navigator.userAgent)) { 
          this._timer = setInterval(function() {
            if (/loaded|complete/.test(document.readyState)) domReady(); 
          }, 10);
        }
        
        Event.observe(window, 'load', domReady);
        Event._readyCallbacks =  [];
    }
    Event._readyCallbacks.push(f);
  },
	stopAllObserving: function(_element,_sEvent) {
		if (!Event.observers) return;
		var _element = $(_element);
		if(_element==null)return;
		for (var i = 0; i < Event.observers.length; i++) {
			if(Event.observers[i][0] == _element){
				if(_sEvent==null||_sEvent==Event.observers[i][1]){
					Event.stopObserving.apply(Event, Event.observers[i]);
					Event.observers[i][0] = null;
					delete Event.observers[i];
				}
			}
		}
		Event.observers = Event.observers.compact();
	},
	findAllObserving : function(_element,_sEvent) {
		if (!Event.observers) return [];
		var _element = $(_element);
		if(_element==null)return [];
		var pRetVal = [];
		for (var i = 0; i < Event.observers.length; i++) {
			if(Event.observers[i][0] == _element){
				if(_sEvent==null||_sEvent==Event.observers[i][1]){
//					Event.stopObserving.apply(this, Event.observers[i]);
					pRetVal.push(Event.observers[i][2]);
//					pRetVal.push((_sEvent||Event.observers[i][1])+":"+Event.observers[i][2].toString());
				}
			}
		}
		return pRetVal;
	}
});
/*
document.getElementsByClassName = function(className, parentElement) {
	var children = ($(parentElement) || document.body).getElementsByTagName('*');
	if(parentElement)delete parentElement;
	var elements = [];
	$A(children).each(function(child){
		if (child.className.match(new RegExp("(^|\\s)" + className + "(\\s|$)")))
			elements.push(child);
		delete child;
	});
	return elements;
}
*/
// ge gfc @ 2006-11-22 16:01
function getWinClientDim(){
	if (document.all && typeof document.body.scrollTop != "undefined") {	// IE model
		var ieBox = document.compatMode != "CSS1Compat";
		var cont = ieBox ? document.body : document.documentElement;
		return {
			left:	cont.scrollLeft,
			top:	cont.scrollTop,
			width:	cont.clientWidth,
			height:	cont.clientHeight
		};
	}
	else {
		return {
			left:	window.pageXOffset,
			top:	window.pageYOffset,
			width:	window.innerWidth,
			height:	window.innerHeight
		};
	}
	
}
var $dim = getWinClientDim;

// Init object storage.
if (!window.__objs){
	window.__objs = [];
	window.__funs = [];
}

Function.prototype.closure = function(obj){

  // For symmetry and clarity.
  var fun = this;

  // Make sure the object has an id and is stored in the object store.
  var objId = obj.__objId;
  if (!objId)
    __objs[objId = obj.__objId = __objs.length] = obj;

  // Make sure the function has an id and is stored in the function store.
  var funId = fun.__funId;
  if (!funId)
    __funs[funId = fun.__funId = __funs.length] = fun;

  // Init closure storage.
  if (!obj.__closures)
    obj.__closures = [];

  // See if we previously created a closure for this object/function pair.
  var closure = obj.__closures[funId];
  if (closure)
    return closure;

  var isEventListener = fun.isEventListener;
	
  // Clear references to keep them out of the closure scope.
  obj = null;
  fun = null;

  // Create the closure, store in cache and return result.
  if(isEventListener){
	  return __objs[objId].__closures[funId] = function (event){
		var object = __objs[objId];
		if(object['_bind2closure_']){
			__funs[funId].apply(object['object'], [event||window.event].concat(object['args']).concat(arguments));
		}
		else{
			return __funs[funId].apply(object, arguments);
		}
	  };
  }
  return __objs[objId].__closures[funId] = function (){
	var object = __objs[objId];
	if(object['_bind2closure_']){
		__funs[funId].apply(object['object'], object['args'].concat(arguments));
	}
	else{
	    return __funs[funId].apply(object, arguments);
	}
  };
};

Object.extend(Object,{
	clearClosure : function(_object){
		delete window.__objs[_object.__objId];
	}
});
Object.extend(Function,{
	clearClosure : function(_fn){
		delete window.__funs[_fn.__funId];
	}
});
/*
Event.observe(window,'unload',function(){
	for(var objectId in window.__objs){
		Object.clearClosure(window.__objs[objectId]);
	}
	for(var functionId in window.__funs){
		Function.clearClosure(window.__funs[functionId]);
	}
	delete window.__objs;
	delete window.__funs;
});
Function.prototype.bind = function() {
	var fun = this, args = $A(arguments), object = args.shift();
	if(args.length==0){
		return fun.closure(object);
	}
	return fun.closure({"_bind2closure_":true,"object":object,"args":args});
}
Function.prototype.bindAsEventListener = function() {
	this.isEventListener = true;
	return this.bind.apply(this,arguments);
}
*/

function $openMaxWin(_sUrl, _sName, _bReplace, _bResizable){
	var nWidth	= window.screen.width - 12;//document.body.clientWidth;
	var nHeight = window.screen.height - 60;//document.body.clientHeight;
	var nLeft	= 0;//(window.screen.availWidth - nWidth) / 2;
	var nTop	= 0;//(window.screen.availHeight - nHeight) / 2;
	var sName	= _sName || "";
//	var aHref = document.createElement('A');
//	aHref.href = _sUrl;
//	aHref.target = '_blank';
//	aHref.style.display = 'none';
//	document.body.appendChild(aHref);
//	aHref.click();
//	document.body.removeChild(aHref);
	sName = sName.replace(/[^0-9a-zA-Z_]/g,'_');
	var oWin = window.open(_sUrl, sName, "resizable=" + (_bResizable == true ? "yes" : "no") + ",top=" + nTop + ",left=" + nLeft + ",menubar =no,toolbar =no,width=" + nWidth + ",height=" + nHeight + ",scrollbars=yes,location =no,titlebar=no", _bReplace);
	if(oWin)oWin.focus();
	return oWin;
}
function $openCentralWin(_sUrl, _sName){
	var _WIN_WIDTH = window.screen.availWidth;
	var _WIN_HEIGHT = window.screen.availHeight;
	var y = _WIN_HEIGHT * 0.12;
	var x = _WIN_HEIGHT * 0.17;
	var w = _WIN_WIDTH - 2 * x;
	var h = w * 0.618;

	//alert('(' + x + ', ' + y + ')' + '\n(' + w + ', ' + h + ')');
	var sFeature = 'resizable=yes,top=' + y + ',left='
			+ x + ',menubar =no,toolbar =no,width=' + w + ',height='
			+ h + ',scrollbars=yes,location =no,status=no,titlebar=no';
	
	var sName	= _sName || "";
	sName = sName.replace(/[^0-9a-zA-Z_]/g,'_');
	var oWin = window.open(_sUrl, sName, sFeature);
	if(oWin) oWin.focus();
}
function $openCenterWin(_sUrl, _sName, _width, _height, _sFeature){
	if(!_width || !_height){
		$openCentralWin(_sUrl, _sName);
		return;
	}
	var _WIN_WIDTH = window.screen.availWidth;
	var _WIN_HEIGHT = window.screen.availHeight;
	var l = (_WIN_WIDTH - _width) / 2;
	var t = (_WIN_HEIGHT - _height) / 2;
	sFeature = "left="+l + ",top=" + t +",width=" + _width + ",height=" + _height + "," + _sFeature;
	var sName	= _sName || "";
	sName = sName.replace(/[^0-9a-zA-Z_]/g,'_');
	var oWin = window.open(_sUrl, sName, sFeature);
	if(oWin) oWin.focus();
}

Form.Element.Serializers.inputSelector=function(element) {
	if(element.type=='checkbox'&&element.getAttribute('isBoolean')!=null){
		var values = element.value.split('|');
		if(element.checked){
			return [element.name, values[0]];
		}
		else{
			return [element.name, values[1]];
		}
	}
	if (element.checked)
	  return [element.name, element.value];
};

Object.extend(Position, {
	getAbsolutePositionInTop : function(element){
        var valueT = 0, valueL = 0;
        var currWindow = window;
        var currElement = $(element);
        do{
            positions = Position.cumulativeOffset(currElement)
            valueL += positions[0];
            valueT += positions[1];
            currElement = currWindow.frameElement;
            currWindow = currWindow.parent;
        }while(currElement);
        return [valueL, valueT]
	},
	getPageInTop : function(element){
        var valueT = 0, valueL = 0;
        var currWindow = window;
        var currElement = $(element);
        do{
            positions = Position.page(currElement)
            valueL += positions[0];
            valueT += positions[1];
            currElement = currWindow.frameElement;
            currWindow = currWindow.parent;
        }while(currElement);
        return [valueL, valueT]
	}
});
if(!window.$MOZ){
	window.$MOZ = function(){
		return (window.pageXOffset != null);
	};
}
Object.extend(Event, {
	findEvent : function(){
		var evt = window.event;
		if($MOZ() && (!evt || evt == 'undefined')){
			evt = Event.findEvent.caller;
			while(evt){
				var arg0=evt.arguments[0];
				if(arg0){
					if(arg0 instanceof Event){ // event 
						evt = arg0;
						break;
					}
				}
				evt = evt.caller;
			}
		}
		return evt;		
	}
});
function CaseSensitiveWith(_sQuery,_arrSensitives){
	var query = _sQuery||'';
	var aParams = query.replace(/\?/,'').parseQuery();
	
	for(var i=0;_arrSensitives&&i<_arrSensitives.length;i++){
		var sName = _arrSensitives[i];
		for(var sParam in aParams){
			if(sName!=sParam&&sName.toUpperCase()==sParam.toUpperCase()){
				aParams[sName] = aParams[sParam];
				delete aParams[sParam];
			}
		}
	}
	var pairs = [];
	for(var sParam in aParams){
		pairs.push(sParam+'='+aParams[sParam]);
	}
	return pairs.join('&');
}


// ge gfc add @ 2007-1-12 15:07 获取符合显示的日期时间
function getPrettyTime(_sDateTime, _bShortYear, _bShortTime){
	if(_sDateTime.trim() == '') return _sDateTime;

	var result = '';
	try{
		var arrPart1 = _sDateTime.split('-');
		var arrPart2 = arrPart1[2].split(' ');
		var dt = {fullYear: arrPart1[0], month: arrPart1[1], date: arrPart2[0], time: arrPart2[1]};
		if(_bShortYear != false && dt.fullYear.length > 2) {
			var temp = dt.fullYear.substr(2);
			if(parseInt(temp) != 0) {
				dt.year = temp;
			}else{
				dt.year = dt.fullYear;
			}
		}else{
			dt.year = dt.fullYear;
		}
		if(_bShortTime != false && dt.time.length > 5) {
			dt.time = dt.time.substr(0, 5);
		}
		// diff the date 
		var dtNow = new Date();
		if(dtNow.getFullYear() == parseInt(dt.fullYear)) {
			if(dtNow.getMonth() == parseInt(dt.month) - 1) {
				if(dtNow.getDate() == parseInt(dt.date)) {
					return dt.time;
				}
			}
			return dt.month + '-' + dt.date + ' ' + dt.time;
		}
		
		return dt.year + '-' + dt.month + '-' + dt.date + ' ' + dt.time;
	}catch(err){
		//TODO
		alert('[' + _sDateTime + ']不符合[yyyy-MM-dd hh:mm:ss]格式的日期时间！\n' + '@' + err.message);
		return null;
	}
	return result;
}

String.prototype.escape4Xml = function(){
	return this.replace(/[<\'\">&]/g,function(c){
		switch(c){
			case '<':
				return '&lt;';
			case '>':
				return '&gt;';
			case '\'':
				return '&apos;';
			case '"':
				return '&quot;';
			case '&':
				return '&amp;';
		}
	});
}

function getNextHTMLSibling(domNode){
	if(domNode == null) return null;
	var tempNode = domNode.nextSibling;
	while(tempNode && tempNode.nodeType != 1){
		tempNode = tempNode.nextSibling;
	}
	//fix <p>ab<b>sf</p>ddsf</b>sd<div>dsf</div>d
	return ((tempNode == null)||(tempNode.parentNode != domNode.parentNode)) ? null : tempNode;
}
function getPreviousHTMLSibling(domNode){
	if(domNode == null) return null;
	var tempNode = domNode.previousSibling;
	while(tempNode && tempNode.nodeType != 1){
		tempNode = tempNode.previousSibling;
	}
	return tempNode;
}
function getFirstHTMLChild(domNode){
	if(domNode == null) return null;
	for (var i = 0; i < domNode.childNodes.length; i++){
		if(domNode.childNodes[i].nodeType == 1){
			return domNode.childNodes[i];
		}
	}
	return null;
}
function getLastHTMLChild(domNode){
	if(domNode == null) return null;
	for (var i = domNode.childNodes.length-1; i >= 0; i--){
		if(domNode.childNodes[i].nodeType == 1){
			return domNode.childNodes[i];
		}
	}
	return null;
}

if(window.Element){
	Object.extend(Element, {
		eachChild : function(element, fIterator, nodeType){
			if(!(element = $(element))) return;
			nodeType = nodeType || 1;
			var index = 0;
			for (var i = 0, length = element.childNodes.length; i < length; i++){
				if(element.childNodes[i].nodeType == nodeType){
					try{
						fIterator(element.childNodes[i], index);
					}catch(error){
						if(error == $break) return;
						if(error != $continue) throw error;
					}
					index++;
				}
			}
		}
	});
}

function getErrorStack(_Error){
	if(_IE){
		var oCaller = arguments.caller;			
		var tmpStack = [];
		while(oCaller&&oCaller.callee){
			tmpStack.push(oCaller.callee);
			oCaller = oCaller.caller;
			if (!oCaller||tmpStack.include(oCaller.callee)) {
				break;
			}
		}
		return _Error.message + '\n' + tmpStack.join('\n------------------------\n');
	}
	else{
		return _Error.message + '\n' + _Error.stack;
	}
}

function $$F(_sName){
    var elements = document.getElementsByName(_sName);
	var values = [];
	for(var i=0;i<elements.length;i++){
		var element = elements[i];
		var method = element.tagName.toLowerCase();
		var parameter = Form.Element.Serializers[method](element);
		if (parameter)
		  values.push(parameter[1]);
	}
	return values.join(',');
}

String.prototype.equals = function(_sc){
	return this==_sc;
}
String.prototype.equalsI = function(_sc){
	return this.toLowerCase()==_sc.toLowerCase();
}
Array.prototype.includeI = function(_object){
	if(String.isString(_object)){
		var matched = false;
		this.each(function(_element){
			if(!String.isString(_element))throw $continue;
			matched = _element.toLowerCase()==_object.toLowerCase();
			if(matched)throw $break;
		});
		return matched;
	}
	return this.include(_object);
}
if(Date.prototype.toString0 == null){
	Date.prototype.toString0 = Date.prototype.toString;
	Date.prototype.toString = function(_sFormat){
		if(_sFormat==null)return this.toString0();
		_sFormat = _sFormat || '%yyyy-%mm-%dd %H24:%M:%s';
		var m = this.getMonth();
		var d = this.getDate();
		var y = this.getFullYear();
		var w = this.getDay();
		var s = {};
		var hr = this.getHours();
		var pm = (hr >= 12);
		var ir = (pm) ? (hr - 12) : hr;
		if (ir == 0)
			ir = 12;
		var min = this.getMinutes();
		var sec = this.getSeconds();
		s["%yy"] = ('' + y).substr(2, 2); // year without the century (range 00 to 99)
		s["%yyyy"] = y;		// year with the century
		s["%mm"] = (m < 9) ? ("0" + (1+m)) : (1+m); // month, range 01 to 12
		s["%m"] = 1+m; // month, range 01 to 12
		s["%dd"] = (d < 10) ? ("0" + d) : d; // the day of the month (range 01 to 31)
		s["%d"] = d; // the day of the month (range 1 to 31)
		s["%H24"] = (hr < 10) ? ("0" + hr) : hr; // hour, range 00 to 23 (24h format)
		s["%H12"] = (ir < 10) ? ("0" + ir) : ir; // hour, range 01 to 12 (12h format)
		s["%M"] = (min < 10) ? ("0" + min) : min; // minute, range 00 to 59
		s["%P"] = pm ? "PM" : "AM";
		s["%p"] = pm ? "pm" : "am";
		s["%S"] = this.getTime()%1000;
		s["%s"] = (sec < 10) ? ("0" + sec) : sec; // seconds, range 00 to 59

		var re = /%(yyyy|yy|mm|m|dd|d|H24|H12|M|P|p|S|s)/g;
		return _sFormat.replace(re, function (par) { return s[par] || par; });
	}
	String.prototype.toDate = function(){
		var _sFormat = 'yyyy-mm-dd HH:MM:ss';
		var re = /(yyyy|mm|dd|HH|MM|ss)/g;
		var arr = null;
		var s = {};
		while(arr=re.exec(_sFormat)){
			var sPattern = arr[0];
			var nIndex = arr.index;
			s[sPattern] = parseInt(this.substring(nIndex,nIndex+sPattern.length),10)||0;
		}
		var oDate = new Date();
		oDate.setSeconds(s["ss"]);
		oDate.setMinutes(s["MM"]);
		oDate.setHours(s["HH"]);
		oDate.setDate(s["dd"]);
		oDate.setMonth(s["mm"]-1);
		oDate.setFullYear(s["yyyy"]);
		return oDate;
	}
}
var DomTools = {
	GetElementDocument : function ( element ){
		if(element==null)return null;
		if(element===document)return element;
		var oDoc = element.ownerDocument || element.document ;
		//TODO
		if(oDoc==null)oDoc = element;
		return oDoc;
	},

	// Get the window object where the element is placed in.
	GetElementWindow : function( element ){
		if(element==null)return null;
		return this.GetDocumentWindow( this.GetElementDocument( element ) ) ;
	},
	GetDocumentWindow : function( document ){
		if(document==null)return null;
		// With Safari, there is not way to retrieve the window from the document, so we must fix it.
		if ( _SAFARI && !document.parentWindow )
			this.FixDocumentParentWindow( window.top ) ;

		return document.parentWindow || document.defaultView ;
	},

	/*
		This is a Safari specific function that fix the reference to the parent
		window from the document object.
	*/
	FixDocumentParentWindow : function( targetWindow ){
		targetWindow.document.parentWindow = targetWindow ;

		for ( var i = 0 ; i < targetWindow.frames.length ; i++ )
			this.FixDocumentParentWindow( targetWindow.frames[i] ) ;
	}
};
Object.extend(Event, {
  _domReady : function() {
	if (arguments.callee.done) return;
	arguments.callee.done = true;

	if (this._timer)  clearInterval(this._timer);
	
	this._readyCallbacks.each(function(f) { f() });
	this._readyCallbacks = null;
},
  onDOMReady : function(f) {
    if (!this._readyCallbacks) {
      var domReady = this._domReady.bind(this);
      
      if (document.addEventListener)
        document.addEventListener("DOMContentLoaded", domReady, false);
        
        /*@cc_on @*/
        /*@if (@_win32)
            document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
            document.getElementById("__ie_onload").onreadystatechange = function() {
                if (this.readyState == "complete") domReady(); 
            };
        /*@end @*/
        
        if (/WebKit/i.test(navigator.userAgent)) { 
          this._timer = setInterval(function() {
            if (/loaded|complete/.test(document.readyState)) domReady(); 
          }, 10);
        }
        
        Event.observe(window, 'load', domReady);
        Event._readyCallbacks =  [];
    }
    Event._readyCallbacks.push(f);
  },
	stopAllObserving: function(_element,_sEvent) {
		if (!Event.myObservers) return;
		var element = $(_element);
		if(element==null)return;
		var uniqueId = Event.__getUniqueId(element);
		var currBucket = Event.myObservers[uniqueId];
		var nSize = currBucket == null?0:currBucket.length;
		for (var i = 0; i < nSize; i++) {
			if(_sEvent==null||_sEvent==currBucket[i][1]){
				Event.stopObserving.apply(Event, currBucket[i]);
				currBucket[i][0] = null;
			}
		}
		delete Event.myObservers[uniqueId];
	},
	findAllObserving : function(_element,_sEvent) {
		if (!Event.myObservers) return [];
		var element = $(_element);
		if(element==null)return [];
		var uniqueId = Event.__getUniqueId(element);
		var currBucket = Event.myObservers[uniqueId];
		var pRetVal = [];
		var nSize = currBucket == null?0:currBucket.length;
		for (var i = 0; i < nSize; i++) {
			if(_sEvent==null||_sEvent==currBucket[i][1]){
				pRetVal.push(currBucket[i][2]);
			}
		}
		return pRetVal;
	},
	__getUniqueId : function(_oElement){
		if (!Event.__currCount) Event.__currCount = 1;
		var tmpUniqueId = _oElement.__myUniqueID;
		if(tmpUniqueId==null){
			tmpUniqueId = _oElement.__myUniqueID = "__uid_"+(Event.__currCount++);
		}
		return tmpUniqueId;
	},
  _observeAndCache: function(element, name, observer, useCapture) {
//	var oWindow = DomTools.GetElementWindow(element);
//	if(oWindow!=window)return;
    if (!Event.myObservers) Event.myObservers = {};
	if(Array.isArray(Event.observers)){
		var tmp = {};
		for (var i = 0; i < Event.observers.length; i++){
			var tmpBucket = Event.observers[i];
			var tmpElement = tmpBucket[0];
			if(tmpElement==null)continue;
			var tmpUniqueId = Event.__getUniqueId(tmpElement);
			if(tmp[tmpUniqueId]==null){
				tmp[tmpUniqueId] = [tmpBucket];
			}
			else{
				tmp[tmpUniqueId].push(tmpBucket);
			}
		}
		Event.observers = false;
		Event.myObservers = tmp;
	}
	if(element==null)return;
	var uniqueId = Event.__getUniqueId(element);
	var currBucket = Event.myObservers[uniqueId];
	if(!currBucket){
		currBucket = Event.myObservers[uniqueId] = [];
	}
    if (element.addEventListener) {
      currBucket.push([element, name, observer, useCapture]);
      element.addEventListener(name, observer, useCapture);
    } else if (element.attachEvent) {
      currBucket.push([element, name, observer, useCapture]);
      element.attachEvent('on' + name, observer);
    }
  },

  unloadCache: function() {
    if (!Event.myObservers) return;
	for(var element in Event.myObservers){
		var oBucket = Event.myObservers[element];
		for (var i = 0, length = (oBucket==null)?0:oBucket.length; i < length; i++) {
	//		alert(oBucket[i][1]+":"+oBucket[i][2]);
			try{
				Event.stopObserving.apply(Event, oBucket[i]);
			}catch(err){
	//			Just Skip it.
	//			alert(oBucket[i][1]+oBucket[i][2]+oBucket[i][3]);
			}
			oBucket[i][0] = null;
		}
		oBucket = null;
		delete Event.myObservers[element];
	}
    Event.myObservers = false;
	if ( window.CollectGarbage )
		window.CollectGarbage() ;
  },
	/**
	*获得要执行的目标信息
	*/
	getExecuteTarget : function(event, element, _sRootId){
		event = window.event || event;
		var eventType = event.type.toLowerCase();
		var tempNode = element ? element : Event.element(event);
		while(tempNode && tempNode.id != _sRootId 
				&& tempNode.tagName.toLowerCase() != 'body'){
			if(tempNode.getAttribute(eventType + "_fun",2) != null){
				return {
					observer : tempNode.getAttribute(eventType + "_fun",2),
					element : tempNode};
			}
			tempNode = tempNode.parentNode;
		}
		return null;
	},
	/**
	*事件分发处理器
	*/
	dispatchEvent : function(event, element, _sRootId, _oScope){
		var target = this.getExecuteTarget(event, element, _sRootId);
		event = window.event || event;
		if(!target || !target.observer)	return;
		try{
			if(!_oScope[target.observer]
				|| _oScope[target.observer](target.element, event)){
				this.dispatchEvent(event, target.element.parentNode, _sRootId, _oScope);
			}
		}catch(error){
			//Just Skip it, and Cancel Bubble.
		}
	},
//		Event.dispatch(eDaton,['dblclick','click','mousemove','mousedown'],_sRootId,_oScope);
	dispatch : function(element, arrEvents, _sRootId, _oScope){
		var fDispatch = function(event){
			Event.dispatchEvent(event, null, _sRootId, _oScope);
		}
		for(var i=0;i<arrEvents.length;i++){
			Event.observe(element, arrEvents[i], fDispatch, false);
		}
	}
});
Event.observe(window, 'unload', Event.unloadCache, false);

Element.addClassName = function(_element,_sClass){
	_element = $(_element);
	if(!_element)return;
	var sCurrClass = ' '+_element.className+' ';
	if(sCurrClass.indexOf(' '+_sClass+' ')==-1){
		_element.className = _element.className + ' ' + _sClass;
	}
}
Element.hasClassName = function(_element,_sClass){
	_element = $(_element);
	if(!_element)return false;
	var sCurrClass = ' '+_element.className+' ';
	return sCurrClass.indexOf(' '+_sClass+' ')!=-1;
}
Element.removeClassName = function(_element,_sClass){
	_element = $(_element);
	if(!_element)return;
	var sCurrClass = ' '+_element.className+' ';
	sCurrClass = sCurrClass.replace(new RegExp('\\s*'+_sClass+'\\s*','ig'),' ');
	_element.className = sCurrClass;
}
//Cal Current cursor psn
function GetCursorPsn(_elInpt,_bUnicodeDouble){ 
    var slct = document.selection; 
    var rng = slct.createRange();
	if(!rng.text||rng.text.length==0){
		_elInpt.select(); 
		rng.setEndPoint("StartToStart", slct.createRange()); 
		var psn = (_bUnicodeDouble)?rng.text.byteLength():rng.text.length; 
		rng.collapse(false); 
		rng.select(); 
		return psn;
	}
	return -1;
} 

if(!_IE){
	HTMLElement.prototype.contains = function(oElement){
		while(oElement){
			if(oElement == this) return true;
			oElement = oElement.parentNode;
		}
		return false;
	};
	Event.prototype.__defineGetter__("fromElement",function(){// 返回鼠标移出的源节点
		var node;
		if(this.type=="mouseover")
			node=this.relatedTarget;
		else if(this.type=="mouseout")
			node=this.target;
		if(!node)return;
		while(node.nodeType!=1)node=node.parentNode;
		return node;
	});
	Event.prototype.__defineGetter__("toElement",function(){// 返回鼠标移入的源节点
		var node;
		if(this.type=="mouseout")
			node=this.relatedTarget;
		else if(this.type=="mouseover")
			node=this.target;
		if(!node)return;
		while(node.nodeType!=1)node=node.parentNode;
		return node;
	});
}

Object.extend(Element, {
	realVisible : function(element){
		element = $(element);
		while(element && element.nodeType != 9){
			if(element.style.display == 'none'){
				return false;
			}
			element = element.parentNode;
		}
		return true;
	},
	realVisible : function(element){
		element = $(element);
		if(element.offsetWidth > 0 || element.offsetHeight > 0){
			return true;
		}
		return false;
	}
});