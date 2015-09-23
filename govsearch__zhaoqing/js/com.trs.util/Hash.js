$package('com.trs.util');

com.trs.util.Hash=Class.create('util.Hash');
com.trs.util.Hash.prototype = {
	initialize	: function(){
		this.items		= {};
	},
	put			: function(_sKey , _oValue){
		this.items[_sKey]	= _oValue;
	},
	get			: function(_sKey){
		return this.items[_sKey];
	},
	remove		: function(_sKey){
		var oRet	= this.items[_sKey];
		this.items[_sKey]	= null;
		return oRet;
	},
	clear		: function(){
		for(var sKey in this.items){
			this.items[sKey]	= null;
		}
	},
	containsKey	: function(_sKey){
		for(var sKey in this.items){
			if(sKey	== _sKey) return true;
		}
		return false;
	},
	containsValue	: function(_oValue){
		for(var sKey in this.items){
			if(this.items[sKey]	== _oValue) return true;
		}
		return false;
	},
	keys		: function(){
		var aRet	= [];
		for(var sKey in this.items){
			aRet.push(sKey);
		}
		return aRet;
	},
	values		: function(){
		var aRet	= [];
		for(var sKey in this.items){
			aRet.push(this.items[sKey]);
		}
		return aRet;
	}
}
function $Hash(){
	return new com.trs.util.Hash();
}