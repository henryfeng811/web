$package('com.trs.util');

$import('com.trs.util.XML');

com.trs.util.JSON = {
	transform : function(_oJson,_xPath,_sParam,_sType,_aValues){
		if(!_sParam||!_aValues){
			return;
		}
		if(!_xPath){
			var vPattern=_oJson;
		}
		else{
			try{
				var vCmd=_xPath.toUpperCase().trim();
				var vPattern=eval(('_oJson.'+vCmd));
			}catch(err){
				return;
			}
		}
		_sParam=_sParam.toUpperCase().trim();
		var vOp=_sType;
		switch(_sType){
			case '=':
			case null:
			case '':
				vOp='==';
				break;
			default:
				vOp=_sType;
				break;
		}
		if(Array.isArray(vPattern)){
			var vArray=[];
			for(var i=0;i<vPattern.length;i++){
				var match=true;
				for(var j=0;j<_aValues.length;j++){
					var value=_aValues[j];
					if(value){
						match=eval(('vPattern['+i+'].'+_sParam+'.NODEVALUE'+vOp+value+';'));
						if(!match)match=eval(('vPattern['+i+'].'+_sParam+vOp+value+';'));
						if(match)break;
					}
				}
				if(match){
					vArray.push(vPattern[i]);
				}
			}
			eval(('_oJson.'+vCmd+'=vArray;'))
		}
		else{
			var match=true;
			for(var j=0;j<_aValues.length;j++){
				var value=_aValues[j];
				if(value){
					match=eval(('vPattern.'+_sParam+'.NODEVALUE'+vOp+value+';'));
					if(!match)match=eval(('vPattern.'+_sParam+vOp+value+';'));
					if(match)break;
				}
			}
			if(!match){
				eval(('delete _oJson.'+vCmd+';'))
			}
		}
	},
	insert : function(_oJson,_xPath,_oNew){
		if(!_xPath){
			var vPattern=_oJson;
		}
		else{
			try{
				var vCmd=_xPath.toUpperCase().trim();
				var vPattern=eval(('_oJson.'+vCmd));
			}catch(err){
				return;
			}
		}
		if(Array.isArray(vPattern)){
			vPattern._insertAt(0,_oNew);
		}
		else{
			var vArray=[];
			vArray.push(_oNew);
			vArray.push(vPattern);
			eval(('_oJson.'+vCmd+'=vArray;'));
		}
		return 1;
	},
	update : function(_oJson,_xPath,_oPostData,_sKey,_sValue){
		if(!_sKey||!_sValue){
			return;
		}
		if(!_xPath){
			var vPattern=_oJson;
		}
		else{
			try{
				var vCmd=_xPath.toUpperCase().trim();
				var vPattern=eval(('_oJson.'+vCmd));
			}catch(err){
				return;
			}
		}
		_sKey=_sKey.toUpperCase().trim();
		if(Array.isArray(vPattern)){
			var vArray=[];
			for(var i=0;i<vPattern.length;i++){
				var match=((vPattern[i][_sKey].NODEVALUE||vPattern[i][_sKey])==_sValue);
				if(match){
					Object.extend(vPattern[i],_oPostData);
				}
			}
		}
		else{
			var match=((vPattern[_sKey].NODEVALUE||vPattern[_sKey])==_sValue);
			if(match){
				Object.extend(vPattern,_oPostData);
			}
		}
	},
	without : function(_oJson,_xPath,_sParam,_sType,_aValues){
		if(!_sParam||!_aValues){
			return;
		}
		if(!_xPath){
			var vPattern=_oJson;
		}
		else{
			try{
				var vCmd=_xPath.toUpperCase().trim();
				var vPattern=eval(('_oJson.'+vCmd));
			}catch(err){
				return;
			}
		}
		_sParam=_sParam.toUpperCase().trim();
		var vOp=_sType;
		switch(_sType){
			case '=':
			case null:
			case '':
				vOp='==';
				break;
			default:
				vOp=_sType;
				break;
		}
		var iNum=0;
		if(Array.isArray(vPattern)){
			var vArray=[];
			for(var i=0;i<vPattern.length;i++){
				var match=true;
				for(var j=0;j<_aValues.length;j++){
					var value=_aValues[j];
					if(value){
						match=eval(('vPattern['+i+'].'+_sParam+'.NODEVALUE'+vOp+value+';'));
						if(!match)match=eval(('vPattern['+i+'].'+_sParam+vOp+value+';'));
						if(match)break;
					}
				}
				if(!match){
					vArray.push(vPattern[i]);
				}
				else{
					iNum++;
				}
			}
			eval(('_oJson.'+vCmd+'=vArray;'))
		}
		else{
			var match=true;
			for(var j=0;j<_aValues.length;j++){
				var value=_aValues[j];
				if(value){
					match=eval(('vPattern.'+_sParam+'.NODEVALUE'+vOp+value+';'));
					if(!match)match=eval(('vPattern.'+_sParam+vOp+value+';'));
					if(match)break;
				}
			}
			if(match){
				iNum++;
				eval(('delete _oJson.'+vCmd+';'))
			}
		}
		return iNum;
	},
	value : function(_oJson,_sXPath,bCaseSensitive){
		if(!_sXPath){
			var vPattern=_oJson;
		}
		else{
			try{
				var vCmd = _sXPath.trim();
				if(bCaseSensitive!=true){
					vCmd = vCmd.toUpperCase();
				}
				var vPattern = eval(com.trs.util.JSON.getCommandFromXPath(vCmd));;
				if(!vPattern)return null;
			}catch(err){
				return false;
			}
		}
		var sReturn	= null;
		if(typeof vPattern == "object"){
			sReturn	= vPattern.NODEVALUE;
		}
		if(sReturn==null||typeof sReturn=="undefined"){
			sReturn	= vPattern;
		}
		return sReturn;
	},
	array : function(_oJson,_sXPath,bCaseSensitive){
		var oArray = null;
		if(!_sXPath){
			oArray=_oJson;
		}
		else{
			try{
				var vCmd = _sXPath.trim();
				if(bCaseSensitive!=true){
					vCmd = vCmd.toUpperCase();
				}
				oArray = eval(com.trs.util.JSON.getCommandFromXPath(vCmd));
			}catch(err){
			}
		}
		if(oArray && typeof oArray != 'object'){
			return [oArray];
		}
		return ( !oArray || Array.isArray(oArray) ) ? oArray : [oArray];
	},
	getCommandFromXPath : function(_sXPath){
		var vCmd = _sXPath;
		if(vCmd.indexOf('-') != -1) {
			var arParts = vCmd.split('.');
			if(arParts.length == 1) {
				vCmd = ('_oJson[\'' + vCmd + '\']');
			}else{
				var str = '';
				for (var i = 0; i < arParts.length; i++){
					str += '[\'' + arParts[i] + '\']';
				}
				vCmd = ('_oJson' + str);
			}
		}else{
			vCmd = ('_oJson.' + vCmd);
		}
		return vCmd;
	},
	increase : function(_oJson,_sXPath,_iStep){
		if(!_sXPath){
			throw new Error('未指定自增节点.');
		}
		try{
			var vCmd=_sXPath.toUpperCase().trim();
			var vPattern=eval(('_oJson.'+vCmd));
		}catch(err){
			return false;
		}
		if(typeof(vPattern)=='object'){
			var iNow=parseInt(vPattern.NODEVALUE)+parseInt(_iStep);
			eval(('_oJson.'+vCmd+'.NODEVALUE=iNow;'));
		}
		else{
			var iNow=parseInt(vPattern)+parseInt(_iStep);
			eval(('_oJson.'+vCmd+'=iNow;'));
		}
	},
	decrease : function(_oJson,_sXPath,_iStep){
		this.increase(_oJson,_sXPath,-parseInt(_iStep));
	},
	max : function(_oJson,_sXPath,_sKey){
		if(!_sXPath||!_sKey){
			throw new Error('没有指定max取值节点.');
		}
		if(!_sXPath){
			var vPattern=_oJson;
		}
		else{
			try{
				var vCmd=_sXPath.toUpperCase().trim();
				var vPattern=eval(('_oJson.'+vCmd));
			}catch(err){
				return false;
			}
		}
		_sKey=_sKey.toUpperCase().trim();
		if(!vPattern){
			return 1;
		}
		else if(Array.isArray(vPattern)){
			var iMax=-1;
			for(var i=0;i<vPattern.length;i++){
				var iNow=parseInt(vPattern[i][_sKey]['NODEVALUE']||vPattern[i][_sKey]);
				if(iNow>iMax){
					iMax=iNow;
				}
			}
			return iMax;
		}
		else{
			return parseInt(vPattern[_sKey]['NODEVALUE']||vPattern[_sKey]);
		}
	},
	parseXml : function(xml){
		var root=xml.documentElement;
		if(root == null) {
			return {};
		}
		var json=com.trs.util.JSON.parseElement(root);
		var vReturn={};
		vReturn[root.nodeName.toUpperCase()]=json;
		return vReturn;
	},
	parseElement : function(ele){
		var json={
		};
		
		if(ele == null || ele.attributes == null) {
			return json;
		}
		var attrs=ele.attributes;
		for(var i=0;i<attrs.length;i++)
		{
			json[attrs[i].nodeName.toUpperCase()]=attrs[i].nodeValue.trim();
		}
		var childs=ele.childNodes;
		var hasNodeChild=false;
		for(var i=0;i<childs.length;i++){
			var tmpNodeName=childs[i].nodeName.toUpperCase();
			switch(tmpNodeName){
				case '#TEXT':
					var tmpNodeValue = childs[i].nodeValue;//.trim();
					if(tmpNodeValue!=''){
						json['NODEVALUE']=tmpNodeValue;
					}
					break;
				case '#COMMENT':
					break;
				case '#CDATA-SECTION':
					var tmpNodeValue=childs[i].nodeValue;//.trim();
					json['NODEVALUE']=tmpNodeValue;
					break;
				default:
					hasNodeChild=true;
					var a=json[tmpNodeName];
					var b=this.parseElement(childs[i]);
					if(a){
						if(Array.isArray(a)){
							a.push(b);
						}
						else{
							json[tmpNodeName]=[a,b];
//							json[tmpNodeName].push(a);
//							json[tmpNodeName].push(b);
						}
						/*
						try
						{

							a.push(b);
						}catch(err)
						{
							json[tmpNodeName]=[];
							json[tmpNodeName].push(a);
							json[tmpNodeName].push(b);
						}*/
					}
					else{
						json[tmpNodeName]=b;
					}
					break;
			}
		}
		if(!hasNodeChild&&!json['NODEVALUE']){
			json['NODEVALUE']='';
		}
		return json;
	},
	parseJson2Xml : function(tag,jsonObject,_bAllwaysNode){
		var myDoc = com.trs.util.XML.loadXML('<'+tag+'></'+tag+'>');
		var eRoot = myDoc.documentElement;
		this.parseJson2Element(myDoc,eRoot,jsonObject,null,null,_bAllwaysNode);
		return myDoc;
	},
	parseJson2Element : function(xmlDoc,_eParentNode,_object,_currProp,_bLeafNode,_bAllwaysNode){
		//alert(xmlDoc.xml);
		//return null;
		var oValue = _object;
		var eParent = _eParentNode;
		if(String.isString(oValue)||Number.isNumber(oValue)||Boolean.isBoolean(oValue)){//Attribute or leaf Node
			if(!_bLeafNode && _bAllwaysNode != true){
				//TODO gfc 需要修改
				if(_currProp != null) {
					eParent.setAttribute(_currProp,oValue.toString());
				}
			}
			else{//leftNode
				var hasCDATA = false;
				var sValue = oValue.toString();
				if(sValue.match(/<!\[CDATA\[|\]\]>/img)){
					hasCDATA = true;
				}
				var eValue = null;
				if(hasCDATA){
					eValue = xmlDoc.createTextNode(sValue);
				}
				else{
					eValue = xmlDoc.createCDATASection(sValue);
				}
				if(_bAllwaysNode == true) {
					var	element = xmlDoc.createElement(_currProp);
					element.appendChild(eValue);
					eParent.appendChild(element);
				}else{
					eParent.appendChild(eValue);
				}
			}
		}
		else if(Array.isArray(oValue)){//Array
			var func = arguments.callee;
			var element = eParent;
			if(_currProp!=null){
				if(_currProp==''){
					_currProp = "TRS_BLANK_ELEMENT";
				}
				element = xmlDoc.createElement(_currProp);
				eParent.appendChild(element);
			}
			oValue.each(function(_object){
				func(xmlDoc,element,_object,null,null,_bAllwaysNode);
			});
		}
		else if(typeof oValue == 'object'){//Object
			var func = arguments.callee;
			var element = eParent;
			if(_currProp!=null){
				if(_currProp==''){
					_currProp = "TRS_BLANK_ELEMENT";
				}
				element = xmlDoc.createElement(_currProp);
				eParent.appendChild(element);
			}
			try{
			for(var prop in oValue){
				func(xmlDoc,element,oValue[prop],prop,(prop.toUpperCase()=='NODEVALUE'),_bAllwaysNode);
			}				
			}catch(err){
				//TODO
				alert(err.message + '\n' + oValue + '\n' + func)
			}

		}
	},
	parseJsonToXML : function(tag,jsonObject,tab){
		tab=(tab)?tab:'';
		var sonTab=tab+'\t';
		if(!tag)sonTab=tab;
		var attr='';
		var inner=[];
		var isLeafNode=false;
		for(var i in jsonObject)
		{
			if(i.toUpperCase()=='NODEVALUE')//leaf inner
			{
				isLeafNode=true;
				inner.push('<![CDATA['+jsonObject[i]+']]>');
			}
			else if(typeof jsonObject[i]!='object')//Attribute
			{
				attr+=' '+i+'="'+jsonObject[i]+'"';
			}
			else if(Array.isArray(jsonObject[i]))
			{
				var tmp=[];
				for(var j=0;j<jsonObject[i].length;j++)
				{
					tmp.push(this.parseJsonToXML(i,jsonObject[i][j],sonTab));
				}
				inner.push(tmp.join('\n'));
			}
			else
			{
				inner.push(this.parseJsonToXML(i,jsonObject[i],sonTab));
			}
		}
		if(tag&&isLeafNode){
			return tab+'<'+tag+attr+'>'+inner.join('')+'</'+tag+'>';
		}
		else if(tag&&!isLeafNode){
			return tab+'<'+tag+attr+'>'+'\n'+inner.join('\n')+'\n'+tab+'</'+tag+'>';
		}
		else return inner.join('\n');
	},
	parseJsonToParams : function(jsonObject){
		var vReturn=[];
		for(var vTmp in jsonObject)
		{
			vReturn.push(vTmp+'='+encodeURIComponent(jsonObject[vTmp]['NODEVALUE']));
		}
		return vReturn.join('&');
	},
	"toUpperCase" : function(_simpleJson){
		if(_simpleJson==null||typeof _simpleJson=='function'){
			return "";
		}
		if(String.isString(_simpleJson)||Number.isNumber(_simpleJson)||Boolean.isBoolean(_simpleJson)){
			return _simpleJson;
		}
		if(Array.isArray(_simpleJson)) {
			var aTmp = [];
			for(var i=0;i<_simpleJson.length;i++){
				aTmp.push(arguments.callee(_simpleJson[i]));
			}
			return aTmp;
		}
		var retJson = {};
		for(var name in _simpleJson){
			retJson[name.toUpperCase()] = arguments.callee(_simpleJson[name]);
		}
		return retJson;
	},
	"eval" : function(_sJson){
		try{
			eval("var json="+_sJson);
			return com.trs.util.JSON.toUpperCase(json);
		}catch(err){
			alert("error in com.trs.util.JSON.eval:"+err.message+'\n'+err.stack||'');
		}
	}
};
ClassName(com.trs.util.JSON,'util.JSON');

$v = com.trs.util.JSON.value;
$a = com.trs.util.JSON.array;