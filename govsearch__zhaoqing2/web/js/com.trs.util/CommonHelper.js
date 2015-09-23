$package('com.trs.util');

com.trs.util.CommonHelper={
	returnColor:function(_oObj){
		return _oObj.currentStyle ? _oObj.currentStyle['backgroundColor'] : window.getComputedStyle(_oObj, "")['backgroundColor'];
	},
	rgb2Color:function(_sColor){
		if(_sColor.indexOf('rgb') > -1){
			aColor = _sColor.replace("(","").replace(")","").replace("rgb","").split(", ");
			aColor[0] = (Math.abs(aColor[0])).toString(16);
			aColor[0] += aColor[0].length == 1 ? "0" : "";
			aColor[1] = (Math.abs(aColor[1])).toString(16);
			aColor[1] += aColor[1].length == 1 ? "1" : "";
			aColor[2] = (Math.abs(aColor[2])).toString(16);
			aColor[2] += aColor[2].length == 1 ? "2" : "";
			return "#" + aColor.join('');
		}else{
			return _sColor;
		}
	},
	copy:function(_sTxt){
		if(_IE){
			clipboardData.setData('Text',_sTxt);
		}
		else if(_GECKO){
			try{
				netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
				var clipboard = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
				if (!clipboard) return;
				var transferable = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
				if (!transferable) return;
				transferable.addDataFlavor('text/unicode');
				var supportsString 	= Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
				supportsString.data	= _sTxt;
				transferable.setTransferData("text/unicode",supportsString,_sTxt.length*2);
				clipboard.setData(transferable,null,Components.interfaces.nsIClipboard.kGlobalClipboard);
			}catch(err){}
		}
	},
	loadIMG:function(nSrc,options)
	{
		var img=document.createElement("IMG");
		img.border=0;
		var _width=parseInt(options.width);
		var _height=parseInt(options.height);
		var scale=options.scale;
		try
		{
			delete options.width;
			delete options.height;
			delete options.scale;
		}catch(err){}
		Object.extend(img,options);
		img.onerror=function(e)
		{
			(options.onerror||Prototype.emptyFunction).apply(this,[e]);
			this.error=true;
		}
		img.style.visibility='hidden';
		img.onload=function(e)
		{
			if(scale)
			{
				var width=this.width;
				var height=this.height;
				if(width>_width||height>_height)
				{
					if(_width/width<=_height/height)
					{
						height=_width*height/width;
						width=_width;
					}
					else
					{
						width=_height*width/height;
						height=_height;
					}
				}
				this.width=width;
				this.height=height;
				this.style.visibility='';
			}
		};
		img.src=nSrc;
		return img;
	}
}