$package('com.trs.tree');

$importCSS("com.trs.tree.resource.TreeManager");

com.trs.tree.TreeManager = Class.create();
com.trs.tree.TreeManager.INSTANCES = [];

var $TreeNav = com.trs.tree.TreeNav;

Object.extend(com.trs.tree.TreeManager.prototype, {
	params : {
		_treeView_ : null, //当前邦定到的TreeView对象
		_currentTreeNode_ : null,//当前正在操作的对象	
		isChange : false, //标识是否对树进行过修改
		servicesName : '',
		loadURL : '',
		addURL : '',
		deleteURL : '',
		modifyURL : '',
		identityAttribute : 'id',
		operatorContainerId : ''
	},
	/**
	*@param oParams	TreeManager需要保存的一些参数信息,如：_treeView_等
	*/
	initialize : function(treeView){
		Object.extend(this.params, {_treeView_ : treeView});
		com.trs.tree.TreeManager.INSTANCES.push(this);
	},
	/**
	*@param oParams	包含loadURL,addURL,deleteURL,modifyURL等对象
	*/
	setParams : function(oParams){
		Object.extend(this.params, oParams);
	},
	/**
	*overrid the method, if you want to set the default params.
	*/
	_initParams : function(){
		//override the method, and call setParams method to init params. 
	},
	clickOperator : function(event){
		event = window.event || event;
		var srcElement = Event.element(event);
		var oprType = srcElement.getAttribute("type");
		if(!oprType){
			return;
		}
		this.hideOperator();
		try{
			this[oprType]();
		}catch(error){
			//just skip it.
			alert(error.message);
		}
	},
	showOperator : function(element){
		if(this.isShowInput || (element.parentNode 
				&& (element.parentNode.getAttribute("isNoOperator") == "true"))){
			this.hideOperator();
			return;
		}
		this._currentTreeNode_ = element;
		if(!this.params["operatorContainerId"]){
			var index = com.trs.tree.TreeManager.INSTANCES.length;
			var operatorContainer = document.createElement("div");
			operatorContainer.style.display = 'none';
			operatorContainer.style.position = 'absolute';
			/*
			var sHTML = '<div class="TreeViewManager">\
							<div class="insertAsChild" type="insertAsChild" title="添加子节点"></div>\
							<div class="insertAsLastChild" type="insertAsLastChild" title="添加子节点"></div>\
							<div class="insert" type="insert" title="添加兄弟节点"></div>\
							<div class="insertAsLastSibling" type="insertAsLastSibling" title="添加兄弟节点"></div>\
							<div class="modify" type="modify" title="修改"></div>\
							<div class="delete" type="delete" title="删除"></div>\
						</div>';
			*/
			var sHTML = '<div class="TreeViewManager">\
							<div class="insertAsLastChild" type="insertAsLastChild" title="添加子节点"></div>\
							<div class="delete" type="delete" title="删除"></div>\
						</div>';

			operatorContainer.innerHTML = sHTML;
			operatorContainer.id = 'operatorContainerId_' + index;
			document.body.appendChild(operatorContainer);
			Event.observe(operatorContainer, 'click', this.clickOperator.bind(this));
			this.params["operatorContainerId"] = operatorContainer.id;
		}		
		Position.clone(element, this.params["operatorContainerId"], {
			setWidth:false,
			setHeight:false,
			offsetLeft:element.offsetWidth + 10
		});	
		var tempNodes = $(this.params["operatorContainerId"]).getElementsByTagName("*");
		for (var i = 0, length = tempNodes.length; i < length; i++){
			var type = tempNodes[i].getAttribute("type");
			if(!type) continue;
			var method = this.canOperate(type) ? 'show' : 'hide';
			Element[method](tempNodes[i]);
		}		
		Element.show(this.params["operatorContainerId"]);
	},
	hideOperator : function(){
		if($(this.params["operatorContainerId"])){
			Element.hide(this.params["operatorContainerId"]);
		}
	},
	clickEvent : function(event){
		event = window.event || event;
		var srcElement = Event.element(event);
		if(srcElement.tagName.toUpperCase() != "A"){
			return;
		}
		if($TreeNav.hasFocus(srcElement)){
			this._currentTreeNode_ = srcElement;
			this.modify();
		}
	},
	mouseOverEvent : function(event){
		event = window.event || event;
		var srcElement = Event.element(event);
		var tagName = srcElement.tagName.toUpperCase();
		if(tagName == "DIV" && srcElement != this.params["_treeView_"]){
			var srcElement = srcElement.getElementsByTagName("A");
			if(srcElement.length <= 0) return;
			srcElement = srcElement[0];
		}else if(tagName != "A"){
			return;
		}
		this.showOperator(srcElement);
	},
	mouseOutEvent : function(event){
		event = window.event || event;
		var srcElement = Event.element(event);
		if(this.params["_treeView_"].contains(event.toElement) 
				&& this.params["_treeView_"] != event.toElement){ 
			return;
		}
		var operatorContainer = $(this.params["operatorContainerId"]);
		if(operatorContainer && operatorContainer.contains(event.toElement)){
			return;
		}
		this.hideOperator();
	},
	keyDownEvent : function(event){
		try{
			event = window.event || event;
			if(!this.params["_treeView_"] || !$TreeNav.oPreSrcElementA){
				return;
			}
			switch(event.keyCode){
				//case 69 : //E
				case 113 : //F2
					this._currentTreeNode_ = $TreeNav.oPreSrcElementA;
					this.modify();
					break;
				case Event.KEY_RETURN://Enter
					this._currentTreeNode_ = $TreeNav.oPreSrcElementA;
					this.insert();
					break;
				//case 68://D
				case Event.KEY_DELETE://Delete
					this._currentTreeNode_ = $TreeNav.oPreSrcElementA;
					this["delete"]();
					break;
				//case 67://C
				case 45://Insert
					this._currentTreeNode_ = $TreeNav.oPreSrcElementA;
					this.insertAsLastChild();
					break;
				case Event.KEY_UP:
					this.keyUp();
					break;
				case Event.KEY_DOWN:
					this.keyDown();
					break;
				case Event.KEY_LEFT:
					this.keyLeft();
					break;
				case Event.KEY_RIGHT:
					this.keyRight();
					break;
				default:
					break;
			}
		}catch(error){
			//just skip it.
		}
		Event.stop(event);
	},
	keyLeft : function(event){
		if(!$TreeNav.oPreSrcElementA) return;
		var divNode = $TreeNav.oPreSrcElementA.parentNode;
		var topChild = $TreeNav._getTopChildElement(divNode);
		if(topChild && Element.visible(topChild)){
			divNode.click();
			return;
		}
		if(divNode){
			divNode = $TreeNav._getParentElement(divNode);
			if(divNode){
				$TreeNav.focus(divNode);
			}
		}
	},
	keyRight : function(event){
		if(!$TreeNav.oPreSrcElementA) return;
		var divNode = $TreeNav.oPreSrcElementA.parentNode;
		var topChild = $TreeNav._getTopChildElement(divNode);
		if(topChild && !Element.visible(topChild)){
			divNode.click();
			return;
		}
		this.keyDown(event);
	},
	keyUp : function(event){
		try{
			var tempNode = this.getUpTarget();
		}catch(error){
		}
		if(!tempNode){
			return;
		}
		$TreeNav.focus(tempNode);
	},
	getUpTarget : function(){
		if(!$TreeNav.oPreSrcElementA) return;
		var divNode = $TreeNav.oPreSrcElementA.parentNode;
		var tempNode = getPreviousHTMLSibling(divNode);
		while(tempNode){
			if(tempNode.tagName.toUpperCase() == "UL"
					&& Element.visible(tempNode)){
				divNode = getLastHTMLChild(tempNode);
				if(divNode){
					tempNode = divNode;
					continue;
				}
			}else if(tempNode.tagName.toUpperCase() == "DIV"
					&& Element.visible(tempNode)){
				return tempNode;
			}
			tempNode = getPreviousHTMLSibling(tempNode);
		}
		return $TreeNav._getParentElement(divNode);
	},
	keyDown : function(event){
		try{
			var tempNode = this.getDownTarget();
		}catch(error){
		}
		if(!tempNode){
			return;
		}
		$TreeNav.focus(tempNode);
	},
	getDownTarget : function(){
		if(!$TreeNav.oPreSrcElementA) return;
		var divNode = $TreeNav.oPreSrcElementA.parentNode;
		var tempNode = getNextHTMLSibling(divNode);
		while(tempNode){
			if(tempNode.tagName.toUpperCase() == "UL"
					&& Element.visible(tempNode)){
				divNode = getFirstHTMLChild(tempNode);
				if(divNode){
					tempNode = divNode;
					continue;
				}
			}else if(tempNode.tagName.toUpperCase() == "DIV"
					&& Element.visible(tempNode)){
				return tempNode;
			}
			tempNode = getNextHTMLSibling(tempNode);
		}
		tempNode = $TreeNav["_getNextElement"]($TreeNav._getParentElement(divNode), "DIV");
		while(!tempNode){
			divNode = $TreeNav._getParentElement(divNode);
			if(!divNode || divNode.isRoot 
					|| divNode.tagName.toUpperCase() == "BODY"){
				return;
			}
			tempNode = $TreeNav["_getNextElement"]($TreeNav._getParentElement(divNode), "DIV");
		}
		return tempNode;
	},
	_validInput : function(oInputElement, sOldValue){
		if(oInputElement.value.trim() == ''){
			alert("不能为空！");
			oInputElement.value = sOldValue;
			oInputElement.focus();
			oInputElement.select();
			return false;
		}
		return true;
	},
	cancelInput : function(oInputElement, sURL, fCallBack, sMsg, event){
		var parentElement = oInputElement.parentNode;
		if(sURL == "modifyURL" || parentElement.getAttribute(this.params["identityAttribute"])){//modify
			var aElement = getPreviousHTMLSibling(oInputElement);
			oInputElement.value = aElement.innerHTML.unescapeHTML();
			oInputElement.blur();
		}else{//add
			var tempNode = $TreeNav._getPreviousElement(parentElement, "DIV");
			if(tempNode){//has previous sibling.
				Element.remove(parentElement);
				setTimeout(function(){
					try{
						$TreeNav.focus(tempNode);
					}catch(error){
					}
				}, 10);
			}else{//no previous sibling.
				tempNode = $TreeNav._getParentElement(parentElement);
				if(tempNode){
					if($TreeNav._getNextElement(parentElement)){//has next sibling.
						Element.remove(parentElement);
						setTimeout(function(){
							try{
								$TreeNav.focus(tempNode);
							}catch(error){
							}
						}, 10);
					}else{//no sibling.
						Element.remove(parentElement.parentNode);
						$TreeNav.reloadNodeStyle(tempNode);					
						setTimeout(function(){
							try{
								$TreeNav.focus(tempNode);
							}catch(error){
							}
						}, 10);
					}
				}
			}
		}
	},
	inputKeyDownEvent : function(oInputElement, sURL, fCallBack, sMsg, event){
		event = window.event || event;
		switch(event.keyCode){
			case Event.KEY_RETURN :
				this.inputBlurEvent.apply(this, arguments);
				break;
			case Event.KEY_ESC:
				this.cancelInput.apply(this, arguments);
				break;
			default:
				break;
		}
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event.cancelBubble = true;
		}
	},
	inputBlurEvent : function(oInputElement, sURL, fCallBack, sMsg, event){
		// TODO check the valid.
		var aElement = getPreviousHTMLSibling(oInputElement);
		if(!this._validInput(oInputElement, aElement.innerHTML.unescapeHTML())){
			return;
		}
		this.isShowInput = false;
		oInputElement.onkeydown = null;
		oInputElement.onblur = null;
		aElement.style.display = '';
		this.params["isChanged"] = oInputElement.value.escapeHTML() == aElement.innerHTML ? false : true;
		aElement.innerHTML = oInputElement.value.escapeHTML();
		Element.remove(oInputElement);	
		setTimeout(function(){
			try{
				$TreeNav.focus(aElement.parentNode);
			}catch(error){
			}
		}, 10);
		if(!this.params[sURL] || !this.params["isChanged"]) return;
		if(this.params["servicesName"]){
			var oHelper = new com.trs.web2frame.BasicDataHelper();
			oHelper.Call(this.params["servicesName"], this.params[sURL], 
					this._getSaveParams(aElement), true, this[fCallBack].bind(this), 
					this.failureCallBack.bind(this, sMsg));
		}else{
			new Ajax.Request(this.params[sURL], {
				method : 'get',
				parameters : $toQueryStr(this._getSaveParams(aElement)),
				onSuccess : this[fCallBack].bind(this),
				onFailure : this.failureCallBack.bind(this, sMsg)
			});		
		}
	},	
	getRequestResult : function(response, json){
		/*
		 *返回的内容
			{
				objectId : '',
				isSuccess : '',
				detailMsg : ''
			};
		*/
		eval("json = " + responseText);
		com.trs.util.JSON.toUpperCase(json);
		return json;
	},
	getInsertContent : function(){
		var sHTML = '';
		var inputClass = 'inputClass';
		switch($TreeNav.nTreeType){
			case $TreeNav.TYPE_CHECKBOX:
				sHTML = '<input type=checkbox name=""/>';
				break;
			case $TreeNav.TYPE_RADIO:
				sHTML = '<input type=radio name=""/>';
				break;
			default:
				inputClass = "inputClassNormal";
				break;
		}
		return "<div>"+sHTML+"<a href='' style='display:none' id='_nodeA_'></a><input type='text' class='"+inputClass+"' id='_nodeInput_'></div>";
	},
	canOperate : function(operType){
		var parentElement = this._currentTreeNode_.parentNode;
		if(parentElement.getAttribute("isNoOperator") == 'true'){
			return false;
		}
		var noOperators = parentElement.getAttribute("noOperators");
		if(noOperators){
			operType = "," + operType.toLowerCase() + ",";
			noOperators = noOperators.replace(/\s/, "").toLowerCase();
			noOperators = "," + noOperators + ",";
			if(noOperators.indexOf(operType) >= 0){
				return false;
			}
		}
		return true;
	},
	/**
	*@param	aElement the current click link node.
	*override the method, if you want the default params
	*/
	_getSaveParams : function(aElement){
		var parentElement = aElement.parentNode;
		var objectId = parentElement.getAttribute(this.params["identityAttribute"]) || 0;
		var _parentElement = $TreeNav._getParentElement(parentElement);
		var parentId = _parentElement ? _parentElement.getAttribute(this.params["identityAttribute"]) : 0;
		var previousElement = $TreeNav._getPreviousElement(parentElement, "DIV");
		var	PreviousId = previousElement ? previousElement.getAttribute(this.params["identityAttribute"]) : -1;
		var name = aElement.innerHTML.unescapeHTML();
		return {
			objectId	: objectId,
			parentId	: parentId,
			PreviousId	: PreviousId,
			Name		: name
		};
	},
	insertAsChild : function(){
		if(!this.canOperate('insertAsChild')) return;
		var parentElement = this._currentTreeNode_.parentNode;
		var topChildElement = $TreeNav._getTopChildElement(parentElement);
		if(!topChildElement){
			new Insertion.After(parentElement, "<ul>" + this.getInsertContent() + "</ul>");
			this.doAdd();
		}else{
			if(!Element.visible(topChildElement)){
				$TreeNav._onClickFolder(parentElement, function(){
					new Insertion.Top(topChildElement, this.getInsertContent());
					this.doAdd();
				}.bind(this));
			}else{
				new Insertion.Top(topChildElement, this.getInsertContent());
				this.doAdd();
			}
		}
	},
	insertAsLastChild : function(){
		if(!this.canOperate('insertAsLastChild')) return;
		var topChildElement = $TreeNav._getTopChildElement(this._currentTreeNode_.parentNode);
		if(!topChildElement){
			new Insertion.After(this._currentTreeNode_.parentNode, "<ul>" + this.getInsertContent() + "</ul>");
			this.doAdd();
		}else{
			if(!Element.visible(topChildElement)){
				$TreeNav._onClickFolder(this._currentTreeNode_.parentNode, function(){
					new Insertion.Bottom(topChildElement, this.getInsertContent());
					this.doAdd();
				}.bind(this));
			}else{
				new Insertion.Bottom(topChildElement, this.getInsertContent());
				this.doAdd();
			}
		}
	},
	insert : function(){
		if(!this.canOperate('insert')) return;
		var nextElement = $TreeNav._getNextElement(this._currentTreeNode_.parentNode, "DIV");
		if(!nextElement){
			var parentElement = $TreeNav._getParentElement(this._currentTreeNode_.parentNode);
			var topChild = $TreeNav._getTopChildElement(parentElement);
			new Insertion.Bottom(topChild, this.getInsertContent());
		}else{		
			new Insertion.Before(nextElement, this.getInsertContent());
		}
		this.doAdd();
	},
	insertAsLastSibling : function(){
		if(!this.canOperate('insertAsLastSibling')) return;
		var parentElement = $TreeNav._getParentElement(this._currentTreeNode_.parentNode);
		var topChild = $TreeNav._getTopChildElement(parentElement);
		new Insertion.After(getLastHTMLChild(topChild), this.getInsertContent());
		this.doAdd();
	},
	doAdd : function(oParams){
		this.hideOperator();
		$TreeNav.blur();
		with($TreeNav){
			var parentElement = $('_nodeA_').parentNode;
			reloadNodeStyle(parentElement);
			reloadNodeStyle(_getParentElement(parentElement));
		}
		this.isShowInput = true;
		var nodeInput = $('_nodeInput_');
		nodeInput.focus();
		nodeInput.onkeydown = this.inputKeyDownEvent.bind(this, nodeInput, "addURL", 'doAddAfter', "添加树节点失败！");
		nodeInput.onblur = this.inputBlurEvent.bind(this, nodeInput, "addURL", 'doAddAfter', "添加树节点失败！");
		if(!this.params["addURL"]){//兼容不发请求的情况
			$('_nodeA_').removeAttribute("id");
		}
	},
	doAddAfter : function(response, json){
		var resultJson = this.getRequestResult(response, json);
		var parentElement = $('_nodeA_').parentNode;
		if(resultJson["ISSUCCESS"]){
			$('_nodeA_').removeAttribute("id");
			this._insertSuccessCallBack(parentElement, response, json, resultJson);
		}else{
			with($TreeNav){
				var _parentElement = _getParentElement(parentElement);
				removeNode(parentElement);
				reloadNodeStyle(_parentElement);
			}
		}		
	},
	_insertSuccessCallBack : function(divElement, response, json, resultJson){
		divElement.setAttribute(this.params["identityAttribute"], resultJson["OBJECTID"]);		
	},
	/**
	*@param	aElement the current click link node.
	*override the method, if you want the default params
	*/
	_getDeleteParams : function(aElement){
		return  {
			objectId : aElement.parentNode.getAttribute(this.params["identityAttribute"]) || 0
		};
	},
	'delete' : function(){
		if(!this.canOperate('delete')) return;
		this.hideOperator();
		if(!confirm("确认删除这个树节点[" + this._currentTreeNode_.innerHTML.unescapeHTML() +"]吗？")){
			return;
		}
		this.params["isChanged"] = true;
		if(!this.params["deleteURL"]){//兼容不发请求的情况
			with($TreeNav){
				var parentElement = _getParentElement(this._currentTreeNode_.parentNode);
				try{
					removeNode(this._currentTreeNode_.parentNode);
				}catch(error){
				}
				reloadNodeStyle(parentElement);
			}
			return;
		}
		this._currentTreeNode_.parentNode.style.display = 'none';
		var topChild = $TreeNav._getTopChildElement(this._currentTreeNode_.parentNode);
		if(topChild){
			topChild.style.display = 'none';
		}
		if(this.params["servicesName"]){
			var oHelper = new com.trs.web2frame.BasicDataHelper();
			oHelper.Call(this.params["servicesName"], this.params["deleteURL"], 
					this._getDeleteParams(this._currentTreeNode_), true, this.deleteAfter.bind(this), 
					this.failureCallBack.bind(this, "删除节点失败!"));
		}else{
			new Ajax.Request(this.params["deleteURL"], {
				method : 'get',
				parameters : $toQueryStr(this._getDeleteParams(this._currentTreeNode_)),
				onSuccess : this.deleteAfter.bind(this),
				onFailure : this.failureCallBack.bind(this, "删除节点失败!")
			});		
		}
	},
	deleteAfter : function(response, json){
		var resultJson = this.getRequestResult(response, json);
		if(resultJson["ISSUCCESS"]){
			with($TreeNav){
				var parentElement = _getParentElement(this._currentTreeNode_.parentNode);
				try{
					removeNode(this._currentTreeNode_.parentNode);
				}catch(error){
				}
				reloadNodeStyle(parentElement);
				this._deleteSuccessCallBack(parentElement, response, json, resultJson);
			}
		}else{
			this._currentTreeNode_.parentNode.style.display = '';
			var topChild = $TreeNav._getTopChildElement(this._currentTreeNode_.parentNode);
			if(topChild){
				topChild.style.display = '';
			}			
		}
	},
	_deleteSuccessCallBack : function(divElement, response, json, resultJson){
	},
	modify : function(){
		if(!this.canOperate('modify')) return;
		this.hideOperator();
		var aElement = this._currentTreeNode_;
		if(!aElement){
			return;
		}
		aElement.style.display = 'none';
		var inputClass = "inputClass";
		if($TreeNav.TYPE_NORM == $TreeNav.nTreeType){
			inputClass = "inputClassNormal";
		}
		new Insertion.After(aElement, "<input type='text' class='"+inputClass+"' id='_nodeInput_'>");
		$TreeNav.blur();
		this.isShowInput = true;
		var nodeInput = $('_nodeInput_');
		aElement.oldValue = aElement.innerHTML;
		nodeInput.value = aElement.innerHTML.unescapeHTML();
		nodeInput.focus();
		nodeInput.select();
		nodeInput.onkeydown = this.inputKeyDownEvent.bind(this, nodeInput, "modifyURL", 'modifyAfter', "修改树节点失败！");
		nodeInput.onblur = this.inputBlurEvent.bind(this, nodeInput, "modifyURL", 'modifyAfter', "修改树节点失败！");
	},
	modifyAfter : function(response, json){
		var resultJson = this.getRequestResult(response, json);
		if(!resultJson["ISSUCCESS"]){
			this._currentTreeNode_.innerHTML = aElement.oldValue;
		}
	},
	failureCallBack : function(msg, response, json){
		alert(msg);
	},
	destroy : function(){
		delete this._treeView_;
		delete this._currentTreeNode_;
	}
});

Object.extend($TreeNav, {
	rootPre : null,
	folderPre : null,
	pagePre : null,
	blur : function(){
		if(this.oPreSrcElementA){
			Element.removeClassName(this.oPreSrcElementA, "Selected");
		}
	},
	hasFocus : function(oTreeANode){
		return Element.hasClassName(oTreeANode, "Selected");
	},
	_getPreviousElement : function(_element, _sTagName){
		var currNode = $(_element);
		//var lStartTime = (new Date()).getTime();
		
		var oParentElement = currNode.previousSibling ;
		for(var i=0; oParentElement != null; i++){
			if(oParentElement.tagName && oParentElement.tagName == _sTagName)break;
			oParentElement = oParentElement.previousSibling ;
		}
		
		if(oParentElement == null || oParentElement.nodeName.toUpperCase() != _sTagName) oParentElement = null;
		return oParentElement;
	},
	getTreeContainer : function(oTreeDivNode){
		try{
			var tempNode = this._getParentElement(oTreeDivNode);
			while(tempNode && tempNode.tagName &&
					tempNode.tagName.toUpperCase() != "BODY"){
				if(Element.hasClassName(tempNode, "TreeView")){
					return tempNode;
				}
				tempNode = this._getParentElement(tempNode);
			}
		}catch(error){
			//just skip it.
		}
		return null;
	},
	reloadNodeStyle : function(oTreeDivNode){
		if(!oTreeDivNode){
			return;
		}
		if(this.rootPre == null || this.folderPre == null || this.pagePre == null){
			var rootNode = this.getTreeContainer(oTreeDivNode);
			if(rootNode){
				Object.extend(this, {
					rootPre : rootNode.getAttribute("rootPre") || "",
					folderPre : rootNode.getAttribute("folderPre") || "",
					pagePre : rootNode.getAttribute("pagePre") || ""
				});
			}else{
				Object.extend(this, {
					rootPre : "",
					folderPre : "",
					pagePre : ""
				});
			}
		}
		var topChild = this._getTopChildElement(oTreeDivNode);
		if(oTreeDivNode.isRoot){
			var prefix = this.rootPre + "Root";
		}else if(topChild){
			var prefix = this.folderPre + "Folder";
		}else{
			var prefix = this.pagePre + "Page";		
		}
		if(topChild){
			var suffix = Element.visible(topChild) ? 'Opened' : '';
		}else{
			var suffix = '';
		}
		oTreeDivNode.className = oTreeDivNode.className.replace(/\b(Root|Folder|Page)\b/, ' ');
		Element.addClassName(oTreeDivNode, prefix + suffix);
	}
});

$TreeNav.observe('onload', function(){
	var treeViews = $TreeNav.Trees;
	for (var i = 0, length = treeViews.length; i < length; i++){
		var oManager = new com.trs.tree.TreeManager( treeViews[i]);
		oManager._initParams();
		Event.observe(treeViews[i], 'mousemove', oManager.mouseOverEvent.bind(oManager));
		Event.observe(treeViews[i], 'mouseout', oManager.mouseOutEvent.bind(oManager));
		Event.observe(treeViews[i], 'keydown', oManager.keyDownEvent.bind(oManager));
		Event.observe(treeViews[i], 'click', oManager.clickEvent.bind(oManager));
		var rootNode = getFirstHTMLChild(treeViews[i]);
		if(rootNode){
			rootNode.setAttribute("noOperators", "insert,insertAsLastSibling,delete");
		}
	}
});

Event.observe(window, 'unload', function(){
	var instances = com.trs.tree.TreeManager.INSTANCES;
	for (var i = 0, length = instances.length; i < length; i++){
		instances[i].destroy();
	}
	$destroy($TreeNav);
	$destroy(com.trs.tree.TreeManager);
});