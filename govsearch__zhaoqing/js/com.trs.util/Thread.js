$package('com.trs.util');

com.trs.util.Thread=Class.create('util.Thread');
com.trs.util.Thread.prototype = {
	initialize	: function(_fRun,_lSpace,_bLoop){
		this.lSpace		= isNaN(_lSpace)?60*1000:parseInt(_lSpace);
		this.timeout	= null;
		this.loop		= (_bLoop)?true:false;
		this.run		= _fRun || Prototype.EmptyFunction;
	},
	start			: function(){
		if(this.timeout){
			clearTimeout(this.timeout);
		}
		this._run();
	},
	stop			: function(_sKey){
		if(this.timeout){
			clearTimeout(this.timeout);
			this.timeout	= null;
		}
	},
	wait		: function(){
		this.stop();
	},
	notify		: function(){
		if(!this.timeout){
			this.start();
		}
	},
	_run		: function(){
		if(this.run){
			this.run();
			if(this.loop){
				this.timeout	= setTimeout(this._run.bind(this),this.lSpace);
			}
		}
	}
}
function $Thread(_fRun,_lSpace,_bLoop){
	return new com.trs.util.Thread(_fRun,_lSpace,_bLoop);
}