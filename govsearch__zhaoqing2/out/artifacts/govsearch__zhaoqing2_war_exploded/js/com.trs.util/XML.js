$package('com.trs.util');

com.trs.util.XML = {
	trimElements : function(elements){
		var newElements=[];
		for(var i=0;elements&&i<elements.length;i++)
		{
			if(elements[i].nodeName!='#text'&&elements[i].nodeName!='#comment')
			{
				newElements.push(elements[i]);
			}
		}
		return newElements;
	},
	loadXML : function(str){
		var xmlDoc=Try.these(
		  function() {return new ActiveXObject('Microsoft.XMLDOM');},
		  function() {return document.implementation.createDocument("","",null);}
		) || false;
		xmlDoc.loadXML(str);
		return xmlDoc;
	},
	loadXML : function(str){
		var xmlDoc=Try.these(
		  function() {return new ActiveXObject('Microsoft.XMLDOM');},
		  function() {return document.implementation.createDocument("","",null);}
		) || false;
		xmlDoc.loadXML(str);
		return xmlDoc;
	},
	writeXML : function(_file,_sXML) {
		if(_IE)
		{
			var _lo=location.href.replace(/\/[^\/]*$/,'/');
			_file=_lo+_file;
		}
		_file=_file.replace(/file:(\/)*/g,'').replace(/\//g,'\\');
		_file=unescape(_file);
		if(_IE)
		{
			try {
				var fso = new ActiveXObject("Scripting.FileSystemObject");
				var oTextFile = fso.CreateTextFile(_file,true,true);
				oTextFile.Write(_sXML);
				oTextFile.Close();
			} catch(e) {
				throw new Error("写文件'"+file+"'失败:" + e.message);
			}
		}
		else 
		{
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserWrite");
				var file = Components.classes["@mozilla.org/file/local;1"]
								.createInstance(Components.interfaces.nsILocalFile);
				file.initWithPath(_file);
				if (!file.exists())
					file.create(0, 0664);
				var outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
								.createInstance(Components.interfaces.nsIFileOutputStream);
				outputStream.init(file, 0x04|0x08|0x20, 420, 0);
				var sXML = this._convertFromUnicode("UTF8", _sXML);
				outputStream.write(sXML, sXML.length);
				outputStream.flush();
				outputStream.close();
			} catch(e) {
				throw new Error("写文件'"+_file+"'失败:" + e.message);
			}
		}
	},
	_convertFromUnicode : function(_sCharset, _sSrc){ 
		try {
			var unicodeConverter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
						.createInstance(Components.interfaces.nsIScriptableUnicodeConverter); 
			unicodeConverter.charset = _sCharset; 
			return unicodeConverter.ConvertFromUnicode( _sSrc ); 
		}catch(e){
		}
		return _sSrc; 
	}
}
ClassName(com.trs.util.XML,'util.XML');