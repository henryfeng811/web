$package('com.trs.tree');


//$import("com.trs.web2frame.AjaxRequest");
//$import("com.trs.logger.Logger");
$importCSS("com.trs.tree.resource.TreeNav");



com.trs.tree.TreeNav = new Object();

com.trs.tree.TreeNav.TYPE_NORM		= 0;
com.trs.tree.TreeNav.TYPE_CHECKBOX	= 1;
com.trs.tree.TreeNav.TYPE_RADIO		= 2;

com.trs.tree.TreeNav.Trees = [];
com.trs.tree.TreeNav.Listeners = {};
Object.extend(com.trs.tree.TreeNav, {
	//记录是否初始化完成
	loaded : false,

	//记录上一次点击的A元素
	oPreSrcElementA : null,
	//记录一下ID
	oPreFocusNodeId : null,
	//本地XML地址
	sLocalNodesInfoFile : null,

	//本地存放XML的路径
	sLocalNodesInfoPath : null,
	
	//树的类型
	nTreeType : com.trs.tree.TreeNav.TYPE_NORM,

	//设置树的类型
	setType : function(_nType){
		com.trs.tree.TreeNav.nTreeType = _nType;
	},

	_getTopChildElement : function(_elElement){
		//var lStartTime = (new Date()).getTime();
		
		//var pULChildern = _elElement.getElementsByTagName("UL");		
		var pULChildern = _elElement.nextSibling;
		for(var i=0; pULChildern != null; i++){
			if(pULChildern.tagName)break;
			pULChildern = pULChildern.nextSibling;
		}

		if(pULChildern == null || pULChildern.nodeName.toUpperCase() != "UL") pULChildern = null;
		return pULChildern;
	},

	_hasSibling : function(_elElement){		
		//1.判断在指定结点之后是否存在兄弟结点
		var oNextSibling = _elElement.nextSibling;
		for(var i=0; oNextSibling != null; i++){
			if(oNextSibling.tagName && oNextSibling.nodeName.toUpperCase() == "DIV")
				return true;

			oNextSibling = oNextSibling.nextSibling;
		}
		
		//2.判断在指定结点之前是否存在兄弟结点
		var oPreSibling = _elElement.previousSibling;
		for(var i=0; oPreSibling != null; i++){
			if(oPreSibling.tagName && oPreSibling.nodeName.toUpperCase() == "DIV")
				return true;

			oPreSibling = oPreSibling.previousSibling;
		}
		
		//3.没有兄弟结点
		return false;
	},

	_getParentElement : function(_element){
		var currNode = $(_element);
		//var lStartTime = (new Date()).getTime();
		
		var oParentElement = currNode.parentNode.previousSibling ;
		for(var i=0; oParentElement != null; i++){
			if(oParentElement.tagName)break;
			oParentElement = oParentElement.previousSibling ;
		}

		if(oParentElement == null || oParentElement.nodeName.toUpperCase() != "DIV") oParentElement = null;
		return oParentElement;
	},

	_getNextNode : function(_element, _sTagName){
		var currNode = $(_element);
		//var lStartTime = (new Date()).getTime();
		
		var oParentElement = currNode.nextSibling ;
		for(var i=0; oParentElement != null; i++){
			if(oParentElement.tagName)break;
			oParentElement = oParentElement.nextSibling ;
		}
		
		if(oParentElement == null || oParentElement.nodeName.toUpperCase() != "DIV") oParentElement = null;
		return oParentElement;
	},

	_getNextElement : function(_element, _sTagName){
		var currNode = $(_element);
		//var lStartTime = (new Date()).getTime();
		
		var oParentElement = currNode.nextSibling ;
		for(var i=0; oParentElement != null; i++){
			if(oParentElement.tagName && oParentElement.tagName == _sTagName)break;
			oParentElement = oParentElement.nextSibling ;
		}
		
		if(oParentElement == null || oParentElement.nodeName.toUpperCase() != _sTagName) oParentElement = null;
		return oParentElement;
	},

	_updateTopChildContent : function(_oOriginRequest){
		Element.update(this, _oOriginRequest.responseText);
		com.trs.tree.TreeNav._initChildrenNodes(this);
	},	

	_onLoadError : function(_trans, _json, _request){
		var isNotLogin = _request.header('TRSNotLogin');
		if(isNotLogin=='true' && window.top.DoNotLogin){
			window.top.DoNotLogin();
			return;
		}
		//prompt("和服务器出现异常！Status=" + _trans.status, _trans.responseText);		
	},	
	observe : function(_sEvent,_fListener){
		if(!com.trs.tree.TreeNav.Listeners[_sEvent]){
			com.trs.tree.TreeNav.Listeners[_sEvent] = [];
		}
		com.trs.tree.TreeNav.Listeners[_sEvent].push(_fListener);
	},
	_onClickFolder : function(_elElement, callBack){
		var lTempStartTime, lTempEndTime;

		var oTopChildElement = com.trs.tree.TreeNav._getTopChildElement(_elElement);
		if(oTopChildElement == null)return false;
		
		//将子区域隐藏或者显示
		Element.toggle(oTopChildElement);	
		
		//lTempStartTime = (new Date()).getTime ();
		//$log().debug("判断是否需要动态载入....");	
		var isNoRequest = true;
		if(oTopChildElement.getElementsByTagName("DIV").length<=0){
			var sAction = com.trs.tree.TreeNav.makeGetChildrenHTMLAction(_elElement);
			if(sAction){
				isNoRequest = false;
				//需要动态载入
				Element.update(oTopChildElement, "loading...");			

				var localAjaxRequest = new Ajax.Request(
						sAction,
						{method: 'get', parameters: "", 
						onSuccess: function(){
							com.trs.tree.TreeNav._updateTopChildContent.apply(oTopChildElement, arguments);
							(callBack || Prototype.emptyFunction)();
						},
						onFailure: com.trs.tree.TreeNav._onLoadError}
						);
			}
		}
		//lTempEndTime = (new Date()).getTime ();		
		//$log().debug("判断是否需要动态载入-耗时["+(lTempEndTime-lTempStartTime)+"]毫秒！");



		//更改点击的节点的样式
		var sClassNamePre = "Folder";
		if(_elElement.isRoot)sClassNamePre = "Root";
		if(_elElement.getAttribute("ClassPre")){
			sClassNamePre = _elElement.getAttribute("ClassPre") + sClassNamePre;
		}

		var bOpened = Element.hasClassName(_elElement, sClassNamePre + "Opened");			

		var sOldClassName = sClassNamePre + ( bOpened ? "Opened":"");
		var sNewClassName = sClassNamePre + ( bOpened ? "":"Opened");		
		Element.removeClassName(_elElement,  sOldClassName);	
		Element.addClassName(_elElement, sNewClassName );		
		
		if(isNoRequest){
			(callBack || Prototype.emptyFunction)();
		}
	},

	_initChildrenNodes : function(_oParentEl, _oRootEl, _sSelectName){
			var sSelectName = _sSelectName || "selTreeNav";
			var TreeNav = com.trs.tree.TreeNav; 

			//先把所有的节点找出来
			var nodes = _oParentEl.getElementsByTagName('DIV');
			//判断各个节点是否有子节点
			for(var j=0; j<nodes.length; j++){	
				var sClassNamePre = nodes[j].getAttribute("ClassPre");
				if(!sClassNamePre){
					sClassNamePre = "";
				}

				var sClassName = "Page";
				var oTopChildelement = com.trs.tree.TreeNav._getTopChildElement(nodes[j]);
				if(_oRootEl != null && nodes[j].parentNode == _oRootEl){
					nodes[j].isRoot = true;
					if(oTopChildelement != null){
						sClassName = ((oTopChildelement.style.display=="none") ? "Root":"RootOpened");
						if(oTopChildelement.getElementsByTagName("DIV").length == 0){
							sClassName = "Root";
							Element.hide(oTopChildelement);
						}
					}
				}
				else if(oTopChildelement != null){
					sClassName = ((oTopChildelement.style.display=="none") ? "Folder":"FolderOpened");
					if(oTopChildelement.getElementsByTagName("DIV").length == 0){
						sClassName = "Folder";
						Element.hide(oTopChildelement);
					}
				}

				Element.addClassName(nodes[j], sClassNamePre + sClassName);

				if(com.trs.tree.TreeNav.nTreeType == com.trs.tree.TreeNav.TYPE_NORM)continue;
				
				//是否为OnlyNode
				var sOnlyNode = nodes[j].getAttribute("OnlyNode");
				if(sOnlyNode != null && sOnlyNode.toLowerCase()=="true")continue;

				//处理其它类型的树
				var sDisalbedAttr = nodes[j].getAttribute("SDisabled");
				if(sDisalbedAttr != null)sDisalbedAttr = sDisalbedAttr.toLowerCase();
				var bDisabled =  (sDisalbedAttr == "true");
				var sValue = bDisabled ? "0" : com.trs.tree.TreeNav.__getSelectValue( nodes[j] );
				
				var sHTML = "";
				switch(com.trs.tree.TreeNav.nTreeType){
					case com.trs.tree.TreeNav.TYPE_CHECKBOX:
						sHTML = '<input type=checkbox name=' + sSelectName
								+ TreeNav._getCheckedHTML(sValue)
								+ TreeNav._getDisabledHTML(bDisabled)
								+ ' id="c'+nodes[j].id+'" '//ID的追加是否影响性能？？
								+' value="'+sValue+'"/>';
						//this.__createLableElement(nodes[j]);
						break;
					case com.trs.tree.TreeNav.TYPE_RADIO:
						sHTML = '<input type=radio name=' + sSelectName
								+ TreeNav._getCheckedHTML(sValue)
								+ TreeNav._getDisabledHTML(bDisabled)
								+ ' id="c'+nodes[j].id+'" '//ID的追加是否影响性能？？
								+' value="'+sValue+'"/>';
						//this.__createLableElement(nodes[j]);
						break;
					default:
						continue;
				}
				

				new Insertion.Top(nodes[j], sHTML);
			}
	},

	__createLableElement: function(_oNodeElementDiv){
		var oElementA = _oNodeElementDiv.getElementsByTagName("A")[0];;
		var oElementLable = document.createElement('LABEL');
		_oNodeElementDiv.insertBefore(oElementLable, oElementA);
		oElementLable.appendChild(oElementA);
		oElementLable.htmlFor = "c" + _oNodeElementDiv.id;
	},

	__getSelectValue : function(_oNodeElementDiv){
		return _oNodeElementDiv.getAttribute(com.trs.tree.TreeNav._sAttrNameRealtedValue);
	},
	
	initTree : function(){
		//校验参数有效性
		if(com.trs.tree.TreeNav.nTreeType != com.trs.tree.TreeNav.TYPE_NORM){
			var sAttrNameRealtedValue = com.trs.tree.TreeNav._sAttrNameRealtedValue;
			if(sAttrNameRealtedValue == null || sAttrNameRealtedValue.length<=0){
				alert("没有设置属性[AttrNameRealtedValue]！\n "
						+ "请通过TreeNav.setAttrNameRelatedValue设置与Checkbox Value相关的属性名称！");
				return;
			}
		}

		try{
			var trees	= document.getElementsByClassName('TreeView');
			for(var i=0; i<trees.length; i++){
				Event.observe(trees[i], 'click', com.trs.tree.TreeNav.onClickNode, false);
				Event.observe(trees[i], 'mouseover', com.trs.tree.TreeNav.onMouseOver, false);
				Event.observe(trees[i], 'mouseout', com.trs.tree.TreeNav.onMouseOut, false);
				
				com.trs.tree.TreeNav._initChildrenNodes(trees[i], trees[i], trees[i].getAttribute("SName"));
			}
			com.trs.tree.TreeNav.Trees = trees;
		}catch(error){} //just skip it

		//记录状态
		com.trs.tree.TreeNav.loaded = true;
		var arrOnLoadListeners = com.trs.tree.TreeNav.Listeners["onload"]||[];
		for(var i=0,n=arrOnLoadListeners.length;i<n;i++){
			(arrOnLoadListeners[i])();
		}
		//expandTree();
		
	},
	

	focus : function(_element){
		var oElement = $(_element);
		if(oElement == null){
			//alert("没有找到指定ID["+_element+"]的Div![focus]");
			return false;			
		}
		
		//设置A元素为Selected
		var oElementA = oElement.getElementsByTagName("A")[0];
		if(com.trs.tree.TreeNav.oPreSrcElementA != null){
			Element.removeClassName(com.trs.tree.TreeNav.oPreSrcElementA, "Selected");
		}
		Element.addClassName(oElementA, "Selected");
		com.trs.tree.TreeNav.oPreSrcElementA = oElementA;		

		//将父元素设置为显示
		var oParentNade = oElement.parentNode;
		var nCountinueCountNotUL = 0;
		while( oParentNade != null && nCountinueCountNotUL < 5){
			if(oParentNade.tagName == 'UL'){
				nCountinueCountNotUL = 0;
				if(oParentNade.style.display == 'none'){
					var oNodeElement = oParentNade.previousSibling ;
					while(oNodeElement != null){
						if(oNodeElement.tagName && oNodeElement.tagName == "DIV")break;
						oNodeElement = oNodeElement.previousSibling ;
					}
					com.trs.tree.TreeNav._onClickFolder(oNodeElement);
				}				
			}else{
				nCountinueCountNotUL++;
			}
			oParentNade = oParentNade.parentNode;
		}
		oElementA.scrollIntoView(false);
		try{
			oElementA.focus();
		}catch(error){
			//just skip hidden state.
		}
		//锚定位
//		window.location.href = window.location.href + "#" + oElementA.name;
	},

	reloadChildren : function(_sId, _bNotFocus, callBack, argus){
		var oTreeNodeDiv = $(_sId);
		//判断节点是否存在
		if(oTreeNodeDiv == null){
			alert("没有找到指定ID["+_sId+"]的Div!");
			return;
		}
		
		//判断是否有子节点
		var oTopChildElement = com.trs.tree.TreeNav._getTopChildElement(oTreeNodeDiv);
		if(oTopChildElement == null){
			com.trs.tree.TreeNav.ensureTopChildElementExist(oTreeNodeDiv);
			//重新设置样式
			com.trs.tree.TreeNav._reverseNodeClass(oTreeNodeDiv, false);
		}else{		
			//删除原有的内容
			$removeChilds(oTopChildElement);
		}

		//重新刷新内容
		com.trs.tree.TreeNav.updateNodeChildrenHTML(oTreeNodeDiv, null, callBack, argus);

		//聚焦
		if(_bNotFocus == true) {
			return;
		}
		com.trs.tree.TreeNav.focus(oTreeNodeDiv);
	},

	removeNode : function(_sId, _bNotFocus){
		var oTreeNodeDiv = $(_sId);
		//判断节点是否存在
		if(oTreeNodeDiv == null){
			return;
		}		

		//删除节点及子
		var oTopChildElement = com.trs.tree.TreeNav._getTopChildElement(oTreeNodeDiv);
		if(oTopChildElement != null){
			$removeNode(oTopChildElement);		
		}		

		// TODO 获取父节点??聚焦到下一个节点还是父结点？？？？
		/*var oNewFocusNode = com.trs.tree.TreeNav._getNextNode(oTreeNodeDiv);
		if(oNewFocusNode == null){
			oNewFocusNode = com.trs.tree.TreeNav._getParentElement(oTreeNodeDiv);			
		}*/
		var oParentNode = com.trs.tree.TreeNav._getParentElement(oTreeNodeDiv);		
		var oNewFocusNode = 	oParentNode;		
		
		var bHasSibling = com.trs.tree.TreeNav._hasSibling(oTreeNodeDiv);
		
		//删除自己
		$removeNode(oTreeNodeDiv);				
		
		//TODO 聚焦到父节点上
		if(_bNotFocus != true) {
			com.trs.tree.TreeNav.focus(oNewFocusNode);;
		}

		//需要判断当前的结点是否还有子结点，如果没有，需要修改样式
		if(!bHasSibling){
			com.trs.tree.TreeNav._reverseNodeClass(oParentNode, true);
			//删除子结点容器
			oTopChildElement = com.trs.tree.TreeNav._getTopChildElement(oParentNode);
			if(oTopChildElement != null){
				$removeNode(oTopChildElement);		
			}
		}
		
	},

	_reverseNodeClass : function(oParentNode, _bToPage){
		//有子、没有子、当前的Class Flag
		var sFolderOrRootClassFlag	= oParentNode.isRoot?"Root" : "Folder" ;
		var sPageClassFlag			= oParentNode.isRoot?"Root" : "Page" ;
		var sOldClassFlag			= _bToPage ? sFolderOrRootClassFlag : sPageClassFlag;
		var sNewClassFlag			= _bToPage ? sPageClassFlag : sFolderOrRootClassFlag;

		//获取自定义的样式前缀
		var sClassPre = oParentNode.getAttribute("ClassPre");
		if(!sClassPre){
			sClassPre = "";
		}

		//尝试删除不同状态的样式
		var sOldClassName = sClassPre + sOldClassFlag + "Opened";
		if(Element.hasClassName(oParentNode, sOldClassName))
			Element.removeClassName(oParentNode,  sOldClassName);	
		else
			Element.removeClassName(oParentNode,  sClassPre + sOldClassFlag);	
		
		//设置新样式
		Element.addClassName(oParentNode, sClassPre + sNewClassFlag);
	},

	updateNodeChildrenHTML : function(_element, _sGetHTMLURL, _onUpdateComplete, _onUCArgs){
		var oNodeElement = $(_element);		
		
		var oTopChildElement = com.trs.tree.TreeNav._getTopChildElement(oNodeElement);
		if(oTopChildElement == null)return false;

		//强行显示
		Element.show(oTopChildElement);	
		
		//需要动态载入
		Element.update(oTopChildElement, "loading...");
		

		
		var sAction = _sGetHTMLURL;
		if(sAction == null || sAction.length<=0){
			sAction = com.trs.tree.TreeNav.makeGetChildrenHTMLAction(oNodeElement);
		}		
		var localAjaxRequest = new Ajax.Request(
				sAction,
					{	
						method: 'get', 
						parameters: "", 
						onSuccess: function(_transport){
							//执行内容的更新
							com.trs.tree.TreeNav._updateTopChildContent.apply(this[0], [_transport]);
							//执行自定义的函数
							if(this[2] != null){
								this[2](this[3]);
							}
							//销毁资源
							$destroy(this);						
						}.bind([oTopChildElement, oNodeElement, _onUpdateComplete, _onUCArgs]),
						onFailure : com.trs.tree.TreeNav._onLoadError
					}
				);
		
		//更改点击的节点的样式
		var sClassNamePre = "Folder";
		if(oNodeElement.isRoot)sClassNamePre = "Root";
		var sPageClassName = "Page";
		if(oNodeElement.getAttribute("ClassPre")){
			sClassNamePre = oNodeElement.getAttribute("ClassPre") + sClassNamePre;
			sPageClassName = oNodeElement.getAttribute("ClassPre") + sPageClassName;
		}

		
		var bOpened = false;
		var bHasPageBefore = Element.hasClassName(oNodeElement, sPageClassName);
		//如果指定节点以前没有子，但是发出了强制刷新子区域的请求，需要特殊处理
		if(bHasPageBefore){
			Element.removeClassName(oNodeElement,  sPageClassName);	
		}
		//指定节点以前本身有子
		else{
			var bOpened = Element.hasClassName(oNodeElement, sClassNamePre + "Opened");	
			if(bOpened)return;
		}

		var sOldClassName = sClassNamePre + ( bOpened ? "Opened":"");
		var sNewClassName = sClassNamePre + ( bOpened ? "":"Opened");		
		Element.removeClassName(oNodeElement,  sOldClassName);	
		Element.addClassName(oNodeElement, sNewClassName );			
	},

	onClickNode : function(_event){
		var event = window.event || _event;
		var oSrcElement = Event.element(event);

		var sOnclick = null;
		if((sOnclick = oSrcElement.getAttribute('onclick', 2)) != null
			&& (sOnclick != '')) {
			try{
				eval(sOnclick);
				return false;
			}catch(err){
				//just skip over
			}
		}
		switch(oSrcElement.tagName){
			case "DIV":				
				com.trs.tree.TreeNav._onClickFolder(oSrcElement);
				break;
			case "A":
				if(com.trs.tree.TreeNav.oPreSrcElementA != null){
					Element.removeClassName(com.trs.tree.TreeNav.oPreSrcElementA, "Selected");
				}
				Element.addClassName(oSrcElement, "Selected");
				com.trs.tree.TreeNav.lastSecondSrcElementA = com.trs.tree.TreeNav.oPreSrcElementA;//modified by hxj
				com.trs.tree.TreeNav.oPreSrcElementA = oSrcElement;
				var bReturn = com.trs.tree.TreeNav.doActionOnClickA(event,oSrcElement);
				if(bReturn==false)return false;
				break;
			default:
				break;
		}		
		

		return true;
	},
	onMouseOver : function(_event){
		var event = window.event || _event;
		var oSrcElement = Event.element(event);
		switch(oSrcElement.tagName){
			case "DIV":				
				break;
			case "A":
				if(window.isCanDrop){
					var bCanDrop = isCanDrop(oSrcElement);
					if(bCanDrop){
						Element.addClassName(oSrcElement, "MouseOver");
						var bReturn = com.trs.tree.TreeNav.doActionOnMouseA(event,oSrcElement,true);
						if(bReturn==false)return false;
					}
				}
				break;
			default:
				break;
		}
		return true;
	},
	onMouseOut : function(_event){
		var event = window.event || _event;
		var oSrcElement = Event.element(event);
		switch(oSrcElement.tagName){
			case "DIV":				
				break;
			case "A":
				if(window.isCanDrop){
					Element.removeClassName(oSrcElement, "MouseOver");
					var bReturn = com.trs.tree.TreeNav.doActionOnMouseA(event,oSrcElement,false);
					if(bReturn==false)return false;
				}
				break;
			default:
				break;
		}
		return true;
	},

	clearChildren : function(_element){
		//获取当前节点
		var oDivElement = $(_element);
		if(oDivElement == null){
			alert("没有找到指定的节点元素![Id="+_element+"]");
			return null;
		}
		
		//获取子元素
		var oChildrenRegionElement = $(oDivElement.id + "_children");
		if(oChildrenRegionElement != null){
			oChildrenRegionElement.innerHTML = "";
			oChildrenRegionElement.style.display = "none";
		}

		//更改点击的节点的样式
		var sClassNamePre = "Folder";
		if(oDivElement.isRoot)sClassNamePre = "Root";
		if(oDivElement.getAttribute("ClassPre")){
			sClassNamePre = oDivElement.getAttribute("ClassPre") + sClassNamePre;
		}
		//判断是否为已经打开的状态
		var bOpened = Element.hasClassName(oDivElement, sClassNamePre + "Opened");	
		if(!bOpened)return;
		
		
		var sOldClassName = sClassNamePre + "Opened";
		var sNewClassName = sClassNamePre ;		
		Element.removeClassName(oDivElement,  sOldClassName);	
		Element.addClassName(oDivElement, sNewClassName );			
	},

	ensureTopChildElementExist : function(_parent){
		//判断当前元素是否存在
		var oParentElement = $(_parent);
		if(oParentElement == null)
			return;
		
		//获取当前的子结点
		var oTopChildElement = com.trs.tree.TreeNav._getTopChildElement(oParentElement);
		if(oTopChildElement != null)return true;


		//不存在需要自动产生一个子结点
		oParentElement.insertAdjacentElement("afterEnd", document.createElement("UL"));
	},
	
		
//================================================================================================
//====选择交互的相关接口
	_sAttrNameRealtedValue : "SValue",
	
	setAttrNameRelatedValue : function(_sAttrName){
		com.trs.tree.TreeNav._sAttrNameRealtedValue = _sAttrName;
	},

	_arCheckedValues : null,

	setCheckedValues : function(_arCheckedValues){
		if( _arCheckedValues && !Array.isArray(_arCheckedValues)){
			alert("预设的选中的值类型不对，不是数组！是["+ _arCheckedValues.constructor +"]");
			return;
		}

		com.trs.tree.TreeNav._arCheckedValues = _arCheckedValues;
	},

	_getCheckedHTML : function(_sValue){
		if( com.trs.tree.TreeNav._arCheckedValues == null)return "";

		for(var i=0; i<com.trs.tree.TreeNav._arCheckedValues.length; i++){
			if(com.trs.tree.TreeNav._arCheckedValues[i] == _sValue){
				return " checked ";
			}
		}

		return "";
	},

	_getDisabledHTML : function(_bDisabled){
		return _bDisabled ? " Disabled " : "";
		
	},

	/**
	*@param	oULRoot			要处理的input的父节点
	*@param excludeDisabled	true表示返回值中排除disabled为true的input
	*						否则返回值中包含disabled为true的input
	*@return				返回选中的input的Id,同时设置this["SelectedNames"];
	*/
	getCheckValues : function(_oULRoot, excludeDisabled){
		if(_oULRoot == null){
			alert("没有指定获取那棵树的值!");
			return null;
		}
		var oULRoot = $(_oULRoot);
		if(!Element.hasClassName(oULRoot, "TreeView")){
			alert("传入的节点不是有效的UL节点！");
			return;
		}
		
		var arInitSelectedValues = [];

		var sSelectElName = oULRoot.getAttribute("SName") || "selTreeNav";
		var arValues = [], arNames = [];
		var arElements = oULRoot.getElementsByTagName("input");
		var nSize = arElements.length;
		for(var i=0; i<nSize; i++){
			if( arElements[i].name != sSelectElName )continue;
			if(!arElements[i].checked || (excludeDisabled && arElements[i].disabled)){
				continue;
			}
			var oElTemp = this._getNextElement(arElements[i], "LABEL");
			if(oElTemp == null){
				oElTemp = this._getNextElement(arElements[i], "A");
			}
			if(oElTemp == null){
				alert("数据有误？\n" + arElements[i].innerHTML);
				return null;
			}
			arNames.push(oElTemp.innerText);

			//for(var j=0; j<com.trs.tree.TreeNav._arCheckedValues.length; j++)

			arValues.push(arElements[i].value);
		}
		this["SelectedNames"] = arNames;
		return arValues;
	}

});

com.trs.tree.TreeNav.makeGetChildrenHTMLAction = function(_elElementLi){
	var sCurrentPath  = getCurrentPath();
	//return com.trs.util.Common.BASE + "com.trs.tree/resource/TreeNav_NodesInfo.html";
	var sChildHTMLInfo = "TreeNav_NodesInfo.html";
	if(_elElementLi.id && _elElementLi.id.length>0){
		sChildHTMLInfo = _elElementLi.id + ".html";
	}
	return sCurrentPath + sChildHTMLInfo;
}

com.trs.tree.TreeNav.doActionOnClickA = function(_event,_elElementA){	
	return false;
}

Object.extend(Element, {
	findParentElementByClassName : function(_element, _sClassName){
		var oParentNade = _element.parentNode();
		if( oParentNade == null 
			|| (oParentNade.tagName != null && oParentNade.tagName == 'BODY') ) return null;

		if(Element.hasClassName(oParentNade, _sClassName))return _element;

		return Element.findParentElementByClassName(oParentNade, _sClassName);
	}
});

function getCurrentPath(){
	var sHref = document.location.href;
	var nPos = 0;
	if(sHref.indexOf("/")>=0){
		nPos = sHref.lastIndexOf("/");
	}else if(sHref.indexOf("\\")>=0){
		nPos = sHref.lastIndexOf("\\");
	}
	return sHref.substring(0, nPos+1) + "data/";
}



//Event.observe(window, 'load', com.trs.tree.TreeNav.initTree, false);
//Event.onDOMReady(com.trs.tree.TreeNav.initTree);
Event.observe(window, 'load', function(){
	if(com.trs.tree.TreeNav.initTreeBySelf){
		return;
	}
	com.trs.tree.TreeNav.initTree();
}, false);