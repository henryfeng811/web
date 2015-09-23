$package('com.trs.util');

var _IE = (navigator.appName.toUpperCase().indexOf('MICROSOFT')!=-1);
var _IE6 = (navigator.userAgent.toUpperCase().indexOf('MSIE 6.0')!=-1);
var _IE7 = (navigator.userAgent.toUpperCase().indexOf('MSIE 7.0')!=-1);
var _OPERA = (window.opera!=null);
var _MOZILLA = !_IE&&!_OPERA&&(navigator.userAgent.indexOf("Mozilla")>=0);
var _GECKO = (navigator.product == "Gecko")?true:false;
var _SAFARI = navigator.userAgent.toLowerCase().indexOf("safari")>=0;
var _GECKOLIKE = _GECKO||_SAFARI||_OPERA;
var _BrowserVersion = parseFloat(window.navigator.appVersion);
var _LoadedClass = {};
$define('com.trs.util.Common');
com.trs.util.Common.BASE = $base(); 
//com.trs.util.Common.BASE = '/wcm/WCMV6/js/';
$import('opensource.prototype');
$import('com.trs.util.Other');

function $package( _sPackage ){
    var nps = _sPackage.split('.'); 
    var nowScope = window; 
    for(var i=0 ; i<nps.length ; i++){
		if(!nowScope[nps[i]]){
		    nowScope[nps[i]] = {}; 
		}
        nowScope = nowScope[nps[i]];
    }
}

function $define( _sClaz ){
	if (typeof eval(_sClaz) == "undefined") {
		eval(_sClaz+"=new Object();"); 
	}
}

function $base( _sClaz ){
	var scripts		= document.getElementsByTagName("script");
	var base		= false;
	for(var i=0 ; i<scripts.length ; i++){
		var src = scripts[i].getAttribute("src",2);
		if(src&&src.indexOf('com.trs.util/Common.js')!=-1){
			base	= src.replace(/com\.trs\.util\/Common\.js/g,'');
			break;
		}
		else if(src&&src.indexOf('com.trs.compress/')!=-1){
			base	= src.replace(/com\.trs\.compress\/.*/g,'');
			break;
		}
	}
	if (_sClaz){
		var index	= _sClaz.indexOf('com.trs.');
		if (index == 0){
			_sClaz	= _sClaz.substring('com.trs.'.length);
			_sClaz	= 'com.trs.' + _sClaz.replace(/\./g,'/');
		}
		else {
			_sClaz	= _sClaz.replace(/\./g,'/');
		}
		index		= _sClaz.lastIndexOf('/');
		if(index != -1){
			_sClaz	= _sClaz.substring(0,index);
		}
		else{
			_sClaz	= '';
		}
		base		= base + _sClaz;
	}
	return base;
}

function $import( _sClaz ){
	//表明已加载
	if(_LoadedClass[_sClaz]){
		return false;
	}
	else{
		_LoadedClass[_sClaz]	= true;
	}
	var index		= _sClaz.indexOf('com.trs.');
	var sPath		= '';
	if( index == 0 ){
		sPath		= 'com.trs.'+ _sClaz.substring('com.trs.'.length).replace(/\./g,'/')+'.js';
	}
	else{
		sPath		= _sClaz.replace(/\./g,'/')+'.js';
	}
	sPath			= com.trs.util.Common.BASE + sPath;
	var scripts		= document.getElementsByTagName("SCRIPT");
	for( var i=0 ; i<scripts.length ; i++)
	{
		if(scripts[i].getAttribute("src",2) == sPath){
			return false;
		}
	}
	document.write("<" + "script src='" + sPath + "'></" + "script>");
}

function $importCSS( _sHref ){
	var index		= _sHref.indexOf('com.trs.');
	var base		= com.trs.util.Common.BASE;
	if ( index == 0 ){
		_sHref		= _sHref.substring('com.trs.'.length);
		_sHref		= 'com.trs.' + _sHref.replace(/\./g,'/') + '.css';
	}
	else {
		_sHref		= _sHref.replace(/\./g,'/') + '.css';
	}
	document.write("<" + "link href='" + base + _sHref + "' type=text/css rel=stylesheet></" + "link>");
}

function $importCSS2( _sHref ){
	document.write('<' + 'link href='+ _sHref +' type=text/css rel=stylesheet></' + 'link>');
}