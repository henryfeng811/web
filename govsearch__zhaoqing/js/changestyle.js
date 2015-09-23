Event.observe(window, 'load', function(){
	var type = getParameter("type");
	if(!type) return;
	for (var i = 0; i < items.length; i++){
		if(type == items[i].oprKey){
			if(getParameter("isLoaded") == 1){
				Element.update("styleTip", items[i]["desc"]);
			}
			items[i].cmd();
			break;
		}
	}
});

function getQueryStr(oHandler){
	return "?" + $toQueryStr({
			type	: oHandler.oprKey,
			isLoaded : 1,
			showAll	: getParameter("showAll") || 0
	});
}

var items = [
	{
		oprKey : 'blue_normal_abstract',
		desc : '蓝色传统导航摘要风格',
		cmd : function(){
			if(window.listType == "abstractlist"){
				$('indexStyle').href = "blue/index.css";
				$('treeStyle').href = "../tree/normal/tree.css";
				return;
			}
			window.location.href = "../abstractlist/index.html" + getQueryStr(this);
		}
	},
	{
		oprKey : 'blue_tab_abstract',
		desc : '蓝色标签导航摘要风格',
		cmd : function(){
			if(window.listType == "abstractlist"){
				$('indexStyle').href = "blue/index.css";
				$('treeStyle').href = "../tree/blue/tree.css";
				return;
			}
			window.location.href = "../abstractlist/index.html" + getQueryStr(this);
		}
	},
	'/',
	{
		oprKey : 'red_normal_abstract',
		desc : '红色传统导航摘要风格',
		cmd : function(){
			if(window.listType == "abstractlist"){
				$('indexStyle').href = "red/index.css";
				$('treeStyle').href = "../tree/normal/tree.css";
				return;
			}
			window.location.href = "../abstractlist/index.html" + getQueryStr(this);
		}
	},
	{
		oprKey : 'red_tab_abstract',
		desc : '红色标签导航摘要风格',
		cmd : function(){
			if(window.listType == "abstractlist"){
				$('indexStyle').href = "red/index.css";
				$('treeStyle').href = "../tree/red/tree.css";
				return;
			}
			window.location.href = "../abstractlist/index.html" + getQueryStr(this);
		}
	},
	'/',
	{
		oprKey : 'middle_normal_abstract',
		desc : '传统摘要',
		cmd : function(){
			if(window.listType == "abstractlist"){
				$('indexStyle').href = "middle/index.css";
				$('treeStyle').href = "../tree/normal/tree.css";
				return;
			}
			window.location.href = "../abstractlist/index.html" + getQueryStr(this);
		}
	},
	{
		oprKey : 'middle_tab_abstract',
		desc : '标签摘要',
		cmd : function(){
			if(window.listType == "abstractlist"){
				$('indexStyle').href = "middle/index.css";
				$('treeStyle').href = "../tree/red/tree.css";
				return;
			}
			window.location.href = "../abstractlist/index.html" + getQueryStr(this);
		}
	},
	'/',
	'/',
	'/',
	/*{
		oprKey : 'blue_normal_normal',
		desc : '蓝色传统导航列表风格',
		cmd : function(){
			if(window.listType == "normallist"){
				$('indexStyle').href = "blue/index.css";
				$('treeStyle').href = "../tree/normal/tree.css";
				return;
			}
			window.location.href = "../normallist/index.html" + getQueryStr(this);
		}
	},
	{
		oprKey : 'blue_tab_normal',
		desc : '蓝色标签导航列表风格',
		cmd : function(){
			if(window.listType == "normallist"){
				$('indexStyle').href = "blue/index.css";
				$('treeStyle').href = "../tree/blue/tree.css";
				return;
			}
			window.location.href = "../normallist/index.html" + getQueryStr(this);
		}
	},
	'/',
	{
		oprKey : 'red_normal_normal',
		desc : '红色传统导航列表风格',
		cmd : function(){
			if(window.listType == "normallist"){
				$('indexStyle').href = "red/index.css";
				$('treeStyle').href = "../tree/normal/tree.css";
				return;
			}
			window.location.href = "../normallist/index.html" + getQueryStr(this);
		}
	},
	{
		oprKey : 'red_tab_normal',
		desc : '红色标签导航列表风格',
		cmd : function(){
			if(window.listType == "normallist"){
				$('indexStyle').href = "red/index.css";
				$('treeStyle').href = "../tree/red/tree.css";
				return;
			}
			window.location.href = "../normallist/index.html" + getQueryStr(this);
		}
	},
	'/',
	{
		oprKey : 'middle_normal_normal',
		desc : '橙色传统导航列表风格',
		cmd : function(){
			if(window.listType == "normallist"){
				$('indexStyle').href = "middle/index.css";
				$('treeStyle').href = "../tree/normal/tree.css";
				return;
			}
			window.location.href = "../normallist/index.html" + getQueryStr(this);
		}
	},
	{
		oprKey : 'middle_tab_normal',
		desc : '橙色标签导航列表风格',
		cmd : function(){
			if(window.listType == "normallist"){
				$('indexStyle').href = "middle/index.css";
				$('treeStyle').href = "../tree/red/tree.css";
				return;
			}
			window.location.href = "../normallist/index.html" + getQueryStr(this);
		}
	},
	'/',
	'/',
	'/',*/
	{
		oprKey : 'middle_normal_table',
		desc : '传统表格',
		cmd : function(){
			if(window.listType == "tablelist"){
				$('indexStyle').href = "middle/index.css";
				$('treeStyle').href = "../tree/normal/tree.css";
				return;
			}
			window.location.href = "../tablelist/index.html" + getQueryStr(this);
		}
	},
	{
		oprKey : 'middle_tab_table',
		desc : '标签表格',
		cmd : function(){
			if(window.listType == "tablelist"){
				$('indexStyle').href = "middle/index.css";
				$('treeStyle').href = "../tree/red/tree.css";
				return;
			}
			window.location.href = "../tablelist/index.html" + getQueryStr(this);
		}
	}
];   





function hideMenu(){
	Element.hide("styleItems");
	Element.hide("btnRightUp");
	Element.show("btnRightDown");
}   
function showMenu(){
	Element.show("styleItems");
	Element.show("btnRightUp");
	Element.hide("btnRightDown");
	$("styleItems").focus();
}
var IS_MOUSE_OVER = false;
Event.observe(window, 'load', function(){
	Event.observe("styleItems", "mouseover", function(event){
		IS_MOUSE_OVER = true;
	});
	Event.observe("styleItems", "mouseout", function(event){
		IS_MOUSE_OVER = false;
	});
	Event.observe("styleItems", "blur", function(event){
		if(!IS_MOUSE_OVER) hideMenu();
	});
	Event.observe("styleItems", "click", function(event){
		hideMenu();
		var srcElement = Event.element(window.event || event);
		var oprKey = srcElement.getAttribute("oprKey");
		for (var i = 0; i < items.length; i++){
			if(oprKey == items[i].oprKey){
				Element.update("styleTip", items[i]["desc"]);
				items[i].cmd();
				break;
			}
		}
	});
}, false);