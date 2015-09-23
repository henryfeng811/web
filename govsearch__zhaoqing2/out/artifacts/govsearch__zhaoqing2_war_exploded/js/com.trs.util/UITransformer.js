$package('com.trs.util');

$import('com.trs.wcm.BubblePanel');
com.trs.util._UITransformElements = [];
var UITransformer = com.trs.util.UITransformer = {
	nameSpace : 'TRS_UI',
	tagName : '*',
	imgPath : com.trs.util.Common.BASE + 'com.trs.util/imgs/ui/',
	destroy : function(){
		for(var i=0;i<com.trs.util._UITransformElements.length;i++){
			var oElement = com.trs.util._UITransformElements[i];
			Event.stopAllObserving(oElement);
		}
		com.trs.util._UITransformElements = [];
	},
	transformAll : function(_sContainer,_sRight,_arrEventObserving,_arrObjsRecycle){
		UITransformer.destroy();
		_arrEventObserving = _arrEventObserving||com.trs.util._UITransformElements;
		var uiElements = document.getAnyElementByTagName(this.nameSpace,this.tagName,$(_sContainer)||document.body);
		for(var i=0;uiElements && i<uiElements.length;i++){
			var currUiElement = uiElements[i];
			var sCurrUiTagName = document.tagName(currUiElement);
			if(sCurrUiTagName=='editpanel'){
				UIEditPanel.replace(currUiElement,_sRight,_arrEventObserving,_arrObjsRecycle);
			}
			else if(sCurrUiTagName=='select'){
				UISelect.replace(currUiElement,_sRight,_arrEventObserving,_arrObjsRecycle);
			}
			else if(sCurrUiTagName=='simpleeditpanel'){
				UISimpleEditPanel.replace(currUiElement,_sRight,_arrEventObserving,_arrObjsRecycle);
			}
			else if(sCurrUiTagName=='filterselect'){//FilterSelect
				UIFilterSelect.replace(currUiElement,_sRight,_arrEventObserving,_arrObjsRecycle);
			}
			else if(sCurrUiTagName=='simpleselect'){//SimpleSelect
				UISimpleSelect.replace(currUiElement,_sRight,_arrEventObserving,_arrObjsRecycle);
			}
			else if(sCurrUiTagName=='editableselect'){//EditableSelect
				UIEditableSelect.replace(currUiElement,_sRight,_arrEventObserving,_arrObjsRecycle);
			}
		}
	},
	transformAll2 : function(_sContainer,_sRightAttrName,_arrEventObserving){
		UITransformer.destroy();
		_arrEventObserving = _arrEventObserving||com.trs.util._UITransformElements;
		var uiElements = document.getAnyElementByTagName(this.nameSpace,this.tagName,$(_sContainer)||document.body);
		for(var i=0;uiElements && i<uiElements.length;i++){
			var currUiElement = uiElements[i];
			var sRight = currUiElement.getAttribute(_sRightAttrName,2);
			var sCurrUiTagName = document.tagName(currUiElement);
			if(sCurrUiTagName=='editpanel'){
				UIEditPanel.replace(currUiElement,sRight,_arrEventObserving);
			}
			else if(sCurrUiTagName=='select'){
				UISelect.replace(currUiElement,sRight,_arrEventObserving);
			}
			else if(sCurrUiTagName=='simpleeditpanel'){
				UISimpleEditPanel.replace(currUiElement,sRight,_arrEventObserving);
			}
			else if(sCurrUiTagName=='filterselect'){//FilterSelect
				UIFilterSelect.replace(currUiElement,sRight,_arrEventObserving);
			}
			else if(sCurrUiTagName=='simpleselect'){//SimpleSelect
				UISimpleSelect.replace(currUiElement,sRight,_arrEventObserving);
			}
			else if(sCurrUiTagName=='editableselect'){//EditableSelect
				UIEditableSelect.replace(currUiElement,sRight,_arrEventObserving);
			}
		}
	}
};
Event.observe(window,'unload',UITransformer.destroy);
var UIEditPanel = com.trs.util.UITransformer.editPanel = {};
Object.extend(UIEditPanel,UITransformer);
Object.extend(UIEditPanel,{
	tagName : 'EditPanel',
	bAppend : true,
	sOverClass : '',
	sInputClass : '',
	sClass : '',
	sOnUpdate : '',
	directFireSecondClick : false,
	replace : function(_sUiElement,_sRight,_arrEventObserving){
		var _iRightIndex = _sUiElement.getAttribute("rightIndex",2);
		if(_iRightIndex!=null&&!isAccessable4WcmObject(_sRight,_iRightIndex)){
			var sHtml ='<div '+
			document.getAttributes(_sUiElement)+
			'title="'+_sUiElement.getAttribute('value')+'">'+
			_sUiElement.getAttribute('value')+
			'</div>';
			_sUiElement.innerHTML = sHtml;
			var ePanel = _sUiElement.childNodes[0];
			_sUiElement.parentNode.insertBefore(ePanel,_sUiElement);
			_sUiElement.parentNode.removeChild(_sUiElement);
			ePanel.HasRight = false;
			return;
		}
		if(this.bAppend){
			if(this.sInputClass){
				_sUiElement.setAttribute("inputClass",(_sUiElement.getAttribute("inputClass")||'')+' '+this.sInputClass);
			}
			if(this.sClass){
				_sUiElement.className = (_sUiElement.className||'')+' '+this.sClass;
			}
		}
		else{
			if(this.sInputClass&&!_sUiElement.getAttribute("inputClass")){
				_sUiElement.setAttribute("inputClass",this.sInputClass);
			}
			if(this.sClass&&!_sUiElement.className){
				_sUiElement.className = this.sClass;
			}
		}
		if(this.sOverClass&&!_sUiElement.getAttribute("overClass")){
			_sUiElement.setAttribute("overClass",this.sOverClass);
		}
		if(this.sOnUpdate&&!_sUiElement.getAttribute("onUpdate")){
			_sUiElement.setAttribute("onUpdate",this.sOnUpdate);
		}
		var sCurrValue = _sUiElement.getAttribute('value');
		var sHtml ='<div '+
		document.getAttributes(_sUiElement)+'">'+
		'</div><div style="display:none"><input type="text" class="'+
		_sUiElement.getAttribute('inputClass')+'" style="width:100%;height:100%;" value=""></div>';
		_sUiElement.innerHTML = sHtml;
		var ePanel = _sUiElement.childNodes[0];
		if(sCurrValue==null||sCurrValue==''){
			Element.addClassName(ePanel,"ui_editpanel_text_blank");
		}
		else{
			ePanel.setAttribute('title',sCurrValue);
			ePanel.appendChild(document.createTextNode(sCurrValue));
		}
		var eInputDiv = _sUiElement.childNodes[1];
		var eInput = _sUiElement.childNodes[1].childNodes[0];
		Event.observe(ePanel,'click',function(event){
			event = event || window.event;
			var eInput = this.input;
			var ePanel = this.panel;
			var eInputDiv = this.inputDiv;
			if(this.directFireSecondClick||ePanel.selected){
				eInputDiv.className = ePanel.className;
				eInput.value = ePanel.getAttribute("title");
				Element.show(eInputDiv);
				Element.hide(ePanel);
				eInput.focus();
				eInput.select();
				if(UIEditPanel.disableSecondClick){
					Event.stop(event);
				}
			}
			else{
				if(!UIEditPanel.disableFirstClick){
					UIEditPanel.select(ePanel);
					var _hiding_ = function(event){
						event = event || window.event;
						if(Event.element(event)!=ePanel){
							UIEditPanel.unselect(ePanel);
						}
						Event.stopObserving(document,'click',arguments.callee);
					}
					Event.observe(document,'click',_hiding_);
					Event.stop(event);
				}
			}
		}.bind({panel:ePanel,input:eInput,inputDiv:eInputDiv,directFireSecondClick:this.directFireSecondClick}));
		Event.observe(ePanel,'mouseover',function(_bDirectFireSecondClick){
			if(_bDirectFireSecondClick||this.selected){
				Element.addClassName(this,this.getAttribute('overClass'));
			}
		}.bind(ePanel,this.directFireSecondClick));
		Event.observe(ePanel,'mouseout',function(_bDirectFireSecondClick){
			if(_bDirectFireSecondClick||this.selected){
				Element.removeClassName(this,this.getAttribute('overClass'));
			}
		}.bind(ePanel,this.directFireSecondClick));
		Event.observe(eInput,'click',function(event){
			event = event || window.event;
			if(UIEditPanel.disableSecondClick){
				Event.stop(event);
			}
		});
		Event.observe(eInput,'blur',function(){
			var eInput = this.input;
			var ePanel = this.panel;
			var eInputDiv = this.inputDiv;
			var sValidation = ePanel.getAttribute("validation");
			var isValid = true;
			if(sValidation){
				eInput.setAttribute("validation",sValidation);
				var validInfo = ValidatorHelper.valid(eInput);
				var warning = validInfo.getWarning();
				isValid = validInfo.isValid();
			}
			if(isValid){
				var sOldValue = ePanel.getAttribute("title");
				if(sOldValue!=eInput.value){
					ePanel.setAttribute('title',eInput.value);
					if(ePanel.selected){
						UIEditPanel.select(ePanel);
					}
					else{
						$removeChilds(ePanel);
						ePanel.appendChild(document.createTextNode(eInput.value));
//						ePanel.innerHTML = eInput.value;
					}
						if(eInput.value){
							Element.removeClassName(ePanel,"ui_editpanel_text_blank");
						}
						else{
							Element.addClassName(ePanel,"ui_editpanel_text_blank");
						}
					var sOnUpdate = ePanel.getAttribute('onUpdate');
					ePanel['$postdata'] = {};
					ePanel['$postdata'][ePanel.getAttribute('_fieldName')] = eInput.value;
					setTimeout(function(sOnUpdate){
						eval("(function(){"+sOnUpdate+"}.bind(this))();");
					}.bind(ePanel,sOnUpdate),1);
				}
			}
			else{
				$alert(warning,function(){
					try{
						eInput.setAttribute("value", ePanel.getAttribute("title"));
						eInput.focus();
						eInput.select();
					}catch(err){}
					$dialog().hide();
				});
				return;
			}
			Element.show(ePanel);
			Element.hide(eInputDiv);
		}.bind({panel:ePanel,input:eInput,inputDiv:eInputDiv}));
		Event.observe(eInput,'keypress',function(event){
			event = event || window.event;
			if(event.keyCode==13){
				var eInput = this.input;
				var ePanel = this.panel;
				var eInputDiv = this.inputDiv;
				var sValidation = ePanel.getAttribute("validation");
				var isValid = true;
				if(sValidation){
					eInput.setAttribute("validation",sValidation);
					var validInfo = ValidatorHelper.valid(eInput);
					var warning = validInfo.getWarning();
					isValid = validInfo.isValid();
				}
				if(isValid){
					var sOldValue = ePanel.getAttribute("title");
					if(sOldValue!=eInput.value){
						ePanel.setAttribute('title',eInput.value);
						if(ePanel.selected){
							UIEditPanel.select(ePanel);
						}
						else{
							$removeChilds(ePanel);
							ePanel.appendChild(document.createTextNode(eInput.value));
//							ePanel.innerHTML = eInput.value;
						}
						if(eInput.value){
							Element.removeClassName(ePanel,"ui_editpanel_text_blank");
						}
						else{
							Element.addClassName(ePanel,"ui_editpanel_text_blank");
						}
						var sOnUpdate = ePanel.getAttribute('onUpdate');
						ePanel['$postdata'] = {};
						ePanel['$postdata'][ePanel.getAttribute('_fieldName')] = eInput.value;
						setTimeout(function(sOnUpdate){
							eval("(function(){"+sOnUpdate+"}.bind(this))();");
						}.bind(ePanel,sOnUpdate),1);
					}
				}
				else{
					Event.stop(event);
					$alert(warning,function(){
						try{
							eInput.focus();
						}catch(err){}
						$dialog().hide();
					});
					return;
				}
				Element.show(ePanel);
				Element.hide(eInputDiv);
			}
		}.bind({panel:ePanel,input:eInput,inputDiv:eInputDiv}));
		_sUiElement.parentNode.insertBefore(ePanel,_sUiElement);
		_sUiElement.parentNode.insertBefore(eInputDiv,_sUiElement);
		_sUiElement.parentNode.removeChild(_sUiElement);
		if(_arrEventObserving){
			_arrEventObserving.push(ePanel);
			_arrEventObserving.push(eInput);
		}
		delete _sUiElement;
	},
	select : function(_sId){
		var ePanel = $(_sId);
		if(ePanel.HasRight===false)return;
		ePanel.selected = true;
		ePanel.innerHTML = '<span class="sp_edit_panel_cusion" style="float:left;">'+$transHtml(ePanel.getAttribute('title'))+'</span>';
	},
	unselect : function(_sId){
		var ePanel = $(_sId);
		if(ePanel.HasRight===false)return;
		ePanel.selected = false;
		//ePanel.appendChild(document.createTextNode(ePanel.getAttribute('title')));
		ePanel.innerHTML = $transHtml(ePanel.getAttribute('title'));
	},
	edit :function(_sId){
		var ePanel = $(_sId);
		if(ePanel.HasRight===false)return;
		Element.addClassName(ePanel, ePanel.getAttribute('overClass'));
		if(ePanel.fireEvent){
			ePanel.fireEvent("onclick");
		}
		else{
			var clickevent=document.createEvent("MouseEvents")
			clickevent.initEvent("click", true, true);
			ePanel.dispatchEvent(clickevent);
		}
	},	
	setValue : function(_sId, _sVal){
		var ePanel = $(_sId);
		if(_sVal == null) {
			return;
		}
		//else
		ePanel.title = _sVal;
		ePanel.value = _sVal;
		var eInnerElms = document.getElementsByClassName('sp_edit_panel_cusion', ePanel);
		if(eInnerElms.length != 0) {
			//eInnerElms[0].appendChild(document.createTextNode(_sVal));
			eInnerElms[0].innerHTML = $transHtml(_sVal);
		}else{
			//ePanel.appendChild(document.createTextNode(_sVal));
			ePanel.innerHTML = $transHtml(_sVal);
		}
	}
});

var SelectRecycler = Class.create();
SelectRecycler.prototype = {
	initialize : function(_eOptionsDiv, _oBubbleMore){
		this.eOptionsDiv = _eOptionsDiv;
		this.bubbleMore = _oBubbleMore;
	},
	destroy : function(){
		if(this.eOptionsDiv){
			Event.stopAllObserving(this.eOptionsDiv);
			this.eOptionsDiv.parentNode.removeChild(this.eOptionsDiv);
			this.eOptionsDiv = null;
		}
		if(this.bubbleMore){
			this.bubbleMore.destroy();
			this.bubbleMore = null;
		}
	}
};
var UISelect = com.trs.util.UITransformer.select = {};
Object.extend(UISelect,UITransformer);
Object.extend(UISelect,{
	tagName : 'Select',
	bAppend : true,
	sOverClass : '',
	sSelectedClass : '',
	sOptionsClass : '',
	sOptionClass : '',
	sOptionSelectedClass : '',
	sOptionOverClass : '',
	sClass : '',
	sOptions : '',
	sOnChange : '',
	replace : function(_sUiElement,_sRight,_arrEventObserving,_arrObjsRecycle){
		var _iRightIndex = _sUiElement.getAttribute("rightIndex",2);
		if(_iRightIndex!=null&&!isAccessable4WcmObject(_sRight,_iRightIndex)){
			var options = _sUiElement.getAttribute("options");
			var iType = _sUiElement.getAttribute("type")||'1';
			var sCurrValue = _sUiElement.getAttribute("value",2);
			var sCurrLable = _sUiElement.getAttribute("label",2)||'';
			if(iType=='1'){
				options = eval('['+options+']');
			}
			else if(iType=='2'){
				options = eval(options);
			}
			for(var i=0;i<options.length;i++){
				if(options[i]['value']==sCurrValue){
					sCurrLable = options[i]['label'];
				}
			}
			var sHtml ='<div '+
			document.getAttributes(_sUiElement)+
			'title="'+sCurrLable+'">'+
			sCurrLable+
			'</div>';
			_sUiElement.innerHTML = sHtml;
			return;
		}
		if(this.bAppend){
			if(this.sOptionsClass){
				_sUiElement.setAttribute("optionsClass",(_sUiElement.getAttribute("optionsClass")||'')+' '+this.sOptionsClass);
			}
			if(this.sOptionClass){
				_sUiElement.setAttribute("optionClass",(_sUiElement.getAttribute("optionClass")||'')+' '+this.sOptionClass);
			}
			if(this.sOptionSelectedClass){
				_sUiElement.setAttribute("optionSelectedClass",(_sUiElement.getAttribute("optionSelectedClass")||'')+' '+this.sOptionSelectedClass);
			}
			if(this.sOptionOverClass){
				_sUiElement.setAttribute("optionOverClass",(_sUiElement.getAttribute("optionOverClass")||'')+' '+this.sOptionOverClass);
			}
			if(this.sClass){
				_sUiElement.className = (_sUiElement.className||'')+' '+this.sClass;
			}
		}
		else{
			if(this.sOptionsClass&&!_sUiElement.getAttribute("optionsClass")){
				_sUiElement.setAttribute("optionsClass",this.sOptionsClass);
			}
			if(this.sOptionClass&&!_sUiElement.getAttribute("optionClass")){
				_sUiElement.setAttribute("optionClass",this.sOptionClass);
			}
			if(this.sOptionSelectedClass&&!_sUiElement.getAttribute("optionSelectedClass")){
				_sUiElement.setAttribute("optionSelectedClass",this.sOptionSelectedClass);
			}
			if(this.sOptionOverClass&&!_sUiElement.getAttribute("optionOverClass")){
				_sUiElement.setAttribute("optionOverClass",this.sOptionOverClass);
			}
			if(this.sClass&&!_sUiElement.className){
				_sUiElement.className = this.sClass;
			}
		}
		if(this.sOverClass&&!_sUiElement.getAttribute("overClass")){
			_sUiElement.setAttribute("overClass",this.sOverClass);
		}
		if(this.sSelectedClass&&!_sUiElement.getAttribute("selectedClass")){
			_sUiElement.setAttribute("selectedClass",this.sSelectedClass);
		}
		if(this.sOnChange&&!_sUiElement.getAttribute("onChange")){
			_sUiElement.setAttribute("onChange",this.sOnChange);
		}
		if(this.sOptions&&!_sUiElement.getAttribute("options")){
			_sUiElement.setAttribute("options",this.sOptions);
		}
		var options = _sUiElement.getAttribute("options");
		var iType = _sUiElement.getAttribute("type")||'1';
		var sCurrValue = _sUiElement.getAttribute("value");
		var sCurrLable = _sUiElement.getAttribute("label")||'';
		if(iType=='1'){
			options = eval('['+options+']');
		}
		else if(iType=='2'){
			options = eval(options);
		}
		else if(iType=='3'){
			options = eval(options)(_sRight);
		}
		var sOptions = '';
		var sTmpOption = '';
		var currIndex = -1;
		for(var i=0;i<options.length;i++){
			sTmpOption = '<div style="width:100%;" class="';
			if(options[i]['value']==sCurrValue){
				sCurrLable = options[i]['label'];
				currIndex = i;
				sTmpOption += _sUiElement.getAttribute("optionSelectedClass");
			}
			else{
				sTmpOption += _sUiElement.getAttribute("optionClass");
			}
			sTmpOption += '"title="'+options[i]['label']+'" value="'+options[i]['value']+'">'+options[i]['label']+'</div>';
			sOptions += sTmpOption;
		}
		var sHtml ='<div '+
		document.getAttributes(_sUiElement)+
		' value="'+sCurrValue+'">'+
		'<span style="float:left;height:100%;">'+sCurrLable+'</span>'+
		'<span class="ui_select_dropdown"></span>'+
		'</div><div style="display:none" class="'+_sUiElement.getAttribute("optionsClass")+'">'+sOptions+'</div>';
		_sUiElement.innerHTML = sHtml;
		var ePanel = _sUiElement.childNodes[0];
		ePanel.setAttribute("label",sCurrLable);
		var oRecycler = new SelectRecycler();
		var eOptionsDiv = oRecycler.eOptionsDiv = _sUiElement.childNodes[1];
		var eOptions = _sUiElement.childNodes[1].childNodes;
		document.body.appendChild(eOptionsDiv);
		Position.clone(ePanel,eOptionsDiv,{setHeight:false,offsetTop:ePanel.offsetHeight});
		var bubbleMore = oRecycler.bubbleMore = new com.trs.wcm.BubblePanel(eOptionsDiv);
		bubbleMore.doAfterHide = function(){
			Element.removeClassName(ePanel,ePanel.getAttribute("selectedClass"));
		}
		if(_arrObjsRecycle)_arrObjsRecycle.push(oRecycler);
		Event.observe(ePanel,'click',function(){
			if(!Element.visible(eOptionsDiv)){
				document.body.appendChild(eOptionsDiv);//调整z-index
				Position.clone(ePanel,eOptionsDiv,{setHeight:false,offsetTop:ePanel.offsetHeight});
				Element.addClassName(ePanel,ePanel.getAttribute("selectedClass"));
				bubbleMore.bubble();
			}
		});
		Event.observe(ePanel,'mouseover',function(){
			Element.addClassName(ePanel,ePanel.getAttribute('overClass').trim());
		});
		Event.observe(ePanel,'mouseout',function(){
			Element.removeClassName(ePanel,ePanel.getAttribute('overClass').trim());
		});
		function _ui_select_option_click_(){
			var eSelectedOption = ePanel.lastSelected;
			var eOption = this;
			if(eOption!=eSelectedOption){
				ePanel.setAttribute("value",eOption.getAttribute("value"));
				ePanel.childNodes[0].innerHTML = eOption.innerHTML;
				var sOnChange = ePanel.getAttribute('onChange');
				ePanel.setAttribute("label",eOption.innerHTML);
				ePanel['$postdata'] = {};
				ePanel['$postdata'][ePanel.getAttribute('_fieldName')] = eOption.getAttribute("value");
				setTimeout(function(sOnChange){
					eval("(function(){"+sOnChange+"}.bind(this))();");
				}.bind(ePanel,sOnChange),1);
				if(eSelectedOption){
					eSelectedOption.className = ePanel.getAttribute("optionClass");
				}
				eOption.className = ePanel.getAttribute("optionSelectedClass");
				ePanel.lastSelected = eOption;
			}
		};
		function _ui_select_option_mouseover_(){
			Element.addClassName(this,this.getAttribute('overClass'));
		}
		function _ui_select_option_mouseout_(){
			Element.removeClassName(this,this.getAttribute('overClass').trim());
		}
		ePanel.lastSelected = (currIndex>=0)?eOptions[currIndex]:null;
		for(var i=0;i<eOptions.length;i++){
			eOptions[i].setAttribute('overClass',ePanel.getAttribute('optionOverClass'));
			Event.observe(eOptions[i],'click',_ui_select_option_click_.bind(eOptions[i]));
			Event.observe(eOptions[i],'mouseover',
				_ui_select_option_mouseover_.bind(eOptions[i]));
			Event.observe(eOptions[i],'mouseout',
				_ui_select_option_mouseout_.bind(eOptions[i]));
			if(_arrEventObserving){
				_arrEventObserving.push(eOptions[i]);
			}
		}
		_sUiElement.parentNode.insertBefore(ePanel,_sUiElement);
		_sUiElement.parentNode.insertBefore(eOptionsDiv,_sUiElement);
		_sUiElement.parentNode.removeChild(_sUiElement);
		if(_arrEventObserving){
			_arrEventObserving.push(ePanel);
			_arrEventObserving.push(eOptionsDiv);
		}
		delete _sUiElement;
	}
});
Object.extend(UIEditPanel,{
	bAppend : true,
	sOverClass : 'ui_editpanel_text_hover',
	sInputClass : 'ui_editpanel_input',
	sClass : 'wcm_pointer ui_editpanel_text'
});
Object.extend(UISelect,{
	bAppend : true,
	sOverClass : 'ui_select_hover',
	sSelectedClass : 'ui_select_selected',
	sOptionsClass : 'ui_select_options',
	sOptionClass : 'ui_select_option',
	sOptionSelectedClass : 'ui_select_option_selected',
	sOptionOverClass : 'ui_select_option_hover',
	sClass : 'wcm_pointer ui_select'
});


var UISimpleEditPanel = com.trs.util.UITransformer.SimpleEditPanel = {};
Object.extend(UISimpleEditPanel,UITransformer);
Object.extend(UISimpleEditPanel,{
	tagName : 'SimpleEditPanel',
	onUpdate : '',
	replace : function(_sUiElement,_sRight,_arrEventObserving,_arrObjsRecycle){
		var sCurrValue = _sUiElement.getAttribute('value');
		var sHtml ='<div '+
		document.getAttributes(_sUiElement)+
		'title="'+_sUiElement.getAttribute('value')+'">'+
		'</div><div style="display:none"><input type="text" class="ui_editpanel_input" style="width:100%;height:100%;" value=""></div>';
		_sUiElement.innerHTML = sHtml;
		var ePanel = _sUiElement.childNodes[0];
		ePanel.appendChild(document.createTextNode(sCurrValue));
		var sClassName = ePanel.className;
		ePanel.className = 'wcm_pointer ui_editpanel_text '+sClassName;
		if(!_sUiElement.getAttribute('value')){
			Element.addClassName(ePanel,"ui_editpanel_text_blank");
		}
		var eInputDiv = _sUiElement.childNodes[1];
		var eInput = _sUiElement.childNodes[1].childNodes[0];
		Event.observe(ePanel,'click',function(event){
			eInputDiv.className = ePanel.className;
			eInput.value = ePanel.getAttribute("title");
			Element.show(eInputDiv);
			Element.hide(ePanel);
			eInput.focus();
			eInput.select();
		});
		Event.observe(ePanel,'mouseover',function(_bDirectFireSecondClick){
			Element.addClassName(ePanel,"ui_editpanel_text_hover");
		});
		Event.observe(ePanel,'mouseout',function(_bDirectFireSecondClick){
			Element.removeClassName(ePanel,"ui_editpanel_text_hover");
		});
		var caller = this;
		Event.observe(eInput,'blur',function(){
			var sValidation = ePanel.getAttribute("validation");
			var isValid = true;
			if(sValidation){
				eInput.setAttribute("validation",sValidation);
				var validInfo = ValidatorHelper.valid(eInput);
				var warning = validInfo.getWarning();
				isValid = validInfo.isValid();
			}
			if(isValid){
				var sOldValue = ePanel.getAttribute("title");
				if(sOldValue!=eInput.value){
					ePanel.setAttribute('title',eInput.value);
					$removeChilds(ePanel);
					ePanel.appendChild(document.createTextNode(eInput.value));
//					ePanel.innerHTML = eInput.value;
					if(eInput.value){
						Element.removeClassName(ePanel,"ui_editpanel_text_blank");
					}
					else{
						Element.addClassName(ePanel,"ui_editpanel_text_blank");
					}
					var sOnUpdate = ePanel.getAttribute('onUpdate')||caller.onUpdate;
					ePanel['$postdata'] = {};
					ePanel['$postdata'][ePanel.getAttribute('_fieldName')] = eInput.value;
					setTimeout(function(sOnUpdate){
						eval("(function(){"+sOnUpdate+"}.bind(this))();");
					}.bind(ePanel,sOnUpdate),1);
				}
			}
			else{
				$alert(warning,function(){
					try{
						if(eInput.value==''){
							eInput.setAttribute("value", ePanel.getAttribute("title"));
						}
						eInput.focus();
						eInput.select();
					}catch(err){}
					$dialog().hide();
				});
				return;
			}
			Element.show(ePanel);
			Element.hide(eInputDiv);
		}.bind({panel:ePanel,input:eInput,inputDiv:eInputDiv}));
		Event.observe(eInput,'keypress',function(event){
			event = event || window.event;
			if(event.keyCode==13){
				eInput.blur();
			}
		});
		_sUiElement.parentNode.insertBefore(ePanel,_sUiElement);
		_sUiElement.parentNode.insertBefore(eInputDiv,_sUiElement);
		if(_arrEventObserving){
			_arrEventObserving.push(ePanel);
			_arrEventObserving.push(eInput);
		}
		_sUiElement.parentNode.removeChild(_sUiElement);
		delete _sUiElement;
	}
});

var UIFilterSelect = com.trs.util.UITransformer.FilterSelect = {};
Object.extend(UIFilterSelect,UITransformer);
Object.extend(UIFilterSelect,{
	tagName : 'FilterSelect',
	rid : 0,
	generateId : function(){
		UIFilterSelect.rid = UIFilterSelect.rid%100000+1;
		return UIFilterSelect.rid;
	},
	replace : function(_sUiElement,_sRight,_arrEventObserving,_arrObjsRecycle){
		var nCurrId = _sUiElement.id || UIFilterSelect.generateId();
		var sCurrLabel = _sUiElement.getAttribute("label",2)||'请选择...';
		var sCurrValue = _sUiElement.getAttribute("value",2);
		var sOptions = _sUiElement.getAttribute("options",2);
		var sAjaxFunction = _sUiElement.getAttribute("ajaxFunction",2);
		var sOnChange = _sUiElement.getAttribute("onChange",2);
		var iType = _sUiElement.getAttribute("type",2)||1;
		var ajaxFunction = null;
		var onChangeListener = null;
		if(sAjaxFunction!=null){
			eval("ajaxFunction="+sAjaxFunction);
		}else{
			ajaxFunction = UIFilterSelect.ajaxFunction;
		}
		if(sOnChange!=null){
			onChangeListener=new Function(sOnChange);
		}
		else{
			onChangeListener = UIFilterSelect.onChange||Prototype.emptyFunction;
		}
		var pOptions = null;
		if(iType=='1'){
			pOptions = eval('['+sOptions+']');
		}
		else if(iType=='2'){
			pOptions = eval(sOptions);
		}
		else if(iType=='3'){
			pOptions = eval(sOptions)(_sRight);
		}
		var sOptionsHtml = '';
		for(var i=0;pOptions&&i<pOptions.length;i++){
			var sValue = pOptions[i]['value'];
			var sLabel = pOptions[i]['label'];
			var sTmpOption = '<div style="width:100%;" class="';
			if(sValue==sCurrValue){
				sCurrLabel = sLabel;
				sTmpOption += 'ui_select_option_selected';
			}
			else{
				sTmpOption += 'ui_select_option';
			}
			sTmpOption += '" value="'+sValue+'">'+sLabel+'</div>';
			sOptionsHtml += sTmpOption;
		}
		var sHtml = 
		'<div '+document.getAttributes(_sUiElement)+' class="wcm_pointer ui_select">'
		+ '<span style="float:left;height:100%;">'+sCurrLabel+'</span>'
		+ '<span class="ui_select_dropdown"></span>'
		+ '</div>'//
		+ '<div style="display:none" class="ui_select_options">'+sOptionsHtml+'</div>';
		_sUiElement.innerHTML = sHtml;
		var ePanel = _sUiElement.childNodes[0];
		var sPanelId = ePanel.id = 'ui_filterselect_'+nCurrId;
		ePanel.setAttribute("value",sCurrValue);
		var eOptionsContainer = _sUiElement.childNodes[1];
		var sOptionsContainerId = eOptionsContainer.id = 'ui_filterselectoptions_'+nCurrId;
		var bubbleMore = new com.trs.wcm.BubblePanel(eOptionsContainer);
		bubbleMore.doAfterHide = function(){
			Element.removeClassName($(sPanelId),'ui_select_selected');
		}
		var oRecycler = new SelectRecycler(eOptionsContainer,bubbleMore);
		if(_arrObjsRecycle)_arrObjsRecycle.push(oRecycler);
		var onOptionsUpdated = function(_arrOptionalIds){
			var eOptions = $(sOptionsContainerId);
			var ePanel = $(sPanelId);
			var sOptionalIds = ','+_arrOptionalIds.join(',')+',';
			document.body.appendChild(eOptions);//调整z-index
			Position.clone(ePanel,eOptions,{setHeight:false,offsetTop:ePanel.offsetHeight});
			var childs = eOptions.childNodes;
			for(var i=0;i<childs.length;i++){
				var child = childs[i];
				if(child.nodeType==3)continue;
				if(sOptionalIds.indexOf(','+child.getAttribute("value",2)+',')!=-1){
					child.style.display = '';
				}
				else{
					child.style.display = 'none';
				}
			}
			Element.addClassName(ePanel,'ui_select_selected');
			bubbleMore.bubble();
		};
		Event.observe(ePanel,'click',function(){
			ajaxFunction(onOptionsUpdated);
		});
		Event.observe(ePanel,'mouseover',function(){
			Element.addClassName($(sPanelId),'ui_select_hover');
		});
		Event.observe(ePanel,'mouseout',function(){
			Element.removeClassName($(sPanelId),'ui_select_hover');
		});
		function _ui_select_option_click_(){
			var ePanel = $(sPanelId);
			var eLastValue = ePanel.getAttribute("value",2);
			var eCurrValue = this.getAttribute("value",2);
			var eCurrLabel = this.innerHTML;
			if(eLastValue!=eCurrValue){
				ePanel.setAttribute("value",eCurrValue);
				ePanel.childNodes[0].innerHTML = eCurrLabel;
				ePanel.setAttribute("label",eCurrLabel);
				ePanel['$postdata'] = {};
				ePanel['$postdata'][ePanel.getAttribute('_fieldName')] = eCurrValue;
				onChangeListener.apply(ePanel);
				if(ePanel.lastSelectedOptionId){
					var tmp = $(ePanel.lastSelectedOptionId);
					tmp.className = 'ui_select_option';
				}
				this.className = 'ui_select_option_selected';
				ePanel.lastSelectedOptionId = this.id;
			}
		};
		function _ui_select_option_mouseover_(){
			Element.addClassName(this,'ui_select_option_hover');
		}
		function _ui_select_option_mouseout_(){
			Element.removeClassName(this,'ui_select_option_hover');
		}
		var eOptions = eOptionsContainer.childNodes;
		for(var i=0;i<eOptions.length;i++){
			var eOption = eOptions[i];
			if(eOption.nodeType==3)continue;
			eOption.id = 'ui_filterselectoption_'+nCurrId+'_'+i;
			if(sCurrValue==eOption.getAttribute("value",2)){
				ePanel.lastSelectedOptionId = eOption.id;
			}
			Event.observe(eOption,'click',_ui_select_option_click_.bind(eOption));
			Event.observe(eOption,'mouseover',_ui_select_option_mouseover_.bind(eOption));
			Event.observe(eOption,'mouseout',_ui_select_option_mouseout_.bind(eOption));
			if(_arrEventObserving){
				_arrEventObserving.push(eOption);
			}
		}
		_sUiElement.parentNode.insertBefore(ePanel,_sUiElement);
		_sUiElement.parentNode.insertBefore(eOptionsContainer,_sUiElement);
		_sUiElement.parentNode.removeChild(_sUiElement);
		if(_arrEventObserving){
			_arrEventObserving.push(ePanel);
			_arrEventObserving.push(eOptionsContainer);
		}
	},
	setValue : function(_selId, _val){
		var eOptionsContainer = $('ui_filterselectoptions_' + _selId);
		if(eOptionsContainer == null) {
			return;
		}
		var eOptions = eOptionsContainer.childNodes;
		for(var i=0; i< eOptions.length; i++){
			var eOption = eOptions[i];
			if(_val == eOption.getAttribute("value", 2)){
				var sPanelId = 'ui_filterselect_' + _selId;
				var ePanel = $(sPanelId);
				var eLastValue = ePanel.getAttribute("value",2);
				var eCurrValue = eOption.getAttribute("value",2);
				var eCurrLabel = eOption.innerHTML;
				if(eLastValue != eCurrValue){
					ePanel.setAttribute("value",eCurrValue);
					ePanel.childNodes[0].innerHTML = eCurrLabel;
					ePanel.setAttribute("label",eCurrLabel);
					if(ePanel.lastSelectedOptionId){
						var tmp = $(ePanel.lastSelectedOptionId);
						tmp.className = 'ui_select_option';
					}
					this.className = 'ui_select_option_selected';
					ePanel.lastSelectedOptionId = this.id;
				}
				break;
			}
		}
	},
	getValue : function(_selId){
		var ePanel = $('ui_filterselect_' + _selId);
		if(ePanel == null) {
			return;
		}
		//else
		return ePanel.getAttribute('value', 2);
	}
});

var UISimpleSelect = com.trs.util.UITransformer.SimpleSelect = {};
Object.extend(UISimpleSelect,UITransformer);
Object.extend(UISimpleSelect,{
	tagName : 'SimpleSelect',
	replace : function(_sUiElement,_sRight,_arrEventObserving,_arrObjsRecycle){
		var sCurrLabel = _sUiElement.getAttribute("label",2)||'请选择...';
		var sCurrValue = _sUiElement.getAttribute("value",2);
		var sOptions = _sUiElement.getAttribute("options",2);
		var sOnChange = _sUiElement.getAttribute("onChange",2);
		var iType = _sUiElement.getAttribute("type",2)||1;
		var ajaxFunction = null;
		var onChangeListener = null;
		if(sOnChange!=null){
			onChangeListener=new Function(sOnChange);
		}
		else{
			onChangeListener = UISimpleSelect.onChange||Prototype.emptyFunction;
		}
		var pOptions = null;
		if(iType=='1'){
			pOptions = eval('['+sOptions+']');
		}
		else if(iType=='2'){
			pOptions = eval(sOptions);
		}
		else if(iType=='3'){
			pOptions = eval(sOptions)(_sRight);
		}
		var sOptionsHtml = '';
		for(var i=0;pOptions&&i<pOptions.length;i++){
			var sValue = pOptions[i]['value'];
			var sLabel = pOptions[i]['label'];
			var sTmpOption = '<div style="width:100%;" class="';
			if(sValue==sCurrValue){
				sCurrLabel = sLabel;
				sTmpOption += 'ui_select_option_selected';
			}
			else{
				sTmpOption += 'ui_select_option';
			}
			sTmpOption += '" value="'+sValue+'">'+sLabel+'</div>';
			sOptionsHtml += sTmpOption;
		}
		var sHtml = 
		'<div '+document.getAttributes(_sUiElement)+' class="wcm_pointer ui_select">'
		+ '<span style="float:left;height:100%;">'+sCurrLabel+'</span>'
		+ '<span class="ui_select_dropdown"></span>'
		+ '</div>'//
		+ '<div style="display:none" class="ui_select_options">'+sOptionsHtml+'</div>';
		_sUiElement.innerHTML = sHtml;
		var ePanel = _sUiElement.childNodes[0];
		var sPanelId = ePanel.id;
		ePanel.setAttribute("value",sCurrValue);
		var eOptionsContainer = _sUiElement.childNodes[1];
		var sOptionsContainerId = eOptionsContainer.id = sPanelId+'_options';
		var bubbleMore = new com.trs.wcm.BubblePanel(eOptionsContainer);
		bubbleMore.doAfterHide = function(){
			Element.removeClassName($(sPanelId),'ui_select_selected');
		}
		var oRecycler = new SelectRecycler(eOptionsContainer,bubbleMore);
		if(_arrObjsRecycle)_arrObjsRecycle.push(oRecycler);
		Event.observe(ePanel,'click',function(){
			var eOptions = $(sOptionsContainerId);
			var ePanel = $(sPanelId);
			document.body.appendChild(eOptions);//调整z-index
			Position.clone(ePanel,eOptions,{setHeight:false,offsetTop:ePanel.offsetHeight});
			Element.addClassName(ePanel,'ui_select_selected');
			bubbleMore.bubble();
		});
		Event.observe(ePanel,'mouseover',function(){
			Element.addClassName($(sPanelId),'ui_select_hover');
		});
		Event.observe(ePanel,'mouseout',function(){
			Element.removeClassName($(sPanelId),'ui_select_hover');
		});
		function _ui_select_option_click_(){
			var ePanel = $(sPanelId);
			var eLastValue = ePanel.getAttribute("value",2);
			var eCurrValue = this.getAttribute("value",2);
			var eCurrLabel = this.innerHTML;
			if(eLastValue!=eCurrValue){
				ePanel.setAttribute("value",eCurrValue);
				ePanel.childNodes[0].innerHTML = eCurrLabel;
				ePanel.setAttribute("label",eOption.innerHTML);
				ePanel['$postdata'] = {};
				ePanel['$postdata'][ePanel.getAttribute('_fieldName')] = eCurrValue;
				onChangeListener.apply(ePanel);
				if(ePanel.lastSelectedOptionId){
					var tmp = $(ePanel.lastSelectedOptionId);
					tmp.className = 'ui_select_option';
				}
				this.className = 'ui_select_option_selected';
				ePanel.lastSelectedOptionId = this.id;
			}
		};
		function _ui_select_option_mouseover_(){
			Element.addClassName(this,'ui_select_option_hover');
		}
		function _ui_select_option_mouseout_(){
			Element.removeClassName(this,'ui_select_option_hover');
		}
		var eOptions = eOptionsContainer.childNodes;
		for(var i=0;i<eOptions.length;i++){
			var eOption = eOptions[i];
			if(eOption.nodeType==3)continue;
			eOption.id = sPanelId+'_'+i;
			if(sCurrValue==eOption.getAttribute("value",2)){
				ePanel.lastSelectedOptionId = eOption.id;
			}
			Event.observe(eOption,'click',_ui_select_option_click_.bind(eOption));
			Event.observe(eOption,'mouseover',_ui_select_option_mouseover_.bind(eOption));
			Event.observe(eOption,'mouseout',_ui_select_option_mouseout_.bind(eOption));
			if(_arrEventObserving){
				_arrEventObserving.push(eOption);
			}
		}
		_sUiElement.parentNode.insertBefore(ePanel,_sUiElement);
		_sUiElement.parentNode.insertBefore(eOptionsContainer,_sUiElement);
		_sUiElement.parentNode.removeChild(_sUiElement);
		if(_arrEventObserving){
			_arrEventObserving.push(ePanel);
			_arrEventObserving.push(eOptionsContainer);
		}
	}
});

var UIEditableSelect = com.trs.util.UITransformer.EditableSelect = {};
Object.extend(UIEditableSelect,UITransformer);
Object.extend(UIEditableSelect,{
	tagName : 'EditableSelect',
	replace : function(_sUiElement,_sRight,_arrEventObserving,_arrObjsRecycle){
		var sCurrLabel = _sUiElement.getAttribute("label",2)||'请选择或者输入...';
		var sCurrValue = _sUiElement.getAttribute("value",2);
		var sOptions = _sUiElement.getAttribute("options",2);
		var sOnChange = _sUiElement.getAttribute("onChange",2);
		var iType = _sUiElement.getAttribute("type",2)||1;
		var sInputName = _sUiElement.getAttribute("fieldName",2);
		var sValidation = _sUiElement.getAttribute("validation");
		var bAutoValid = _sUiElement.getAttribute("autovalid",2)!='false';
		var sNewFilledValue = _sUiElement.getAttribute("newvalue",2);
		var onChangeListener = null;
		if(sOnChange!=null){
			onChangeListener=new Function(sOnChange);
		}
		else{
			onChangeListener = UIEditableSelect.onChange||Prototype.emptyFunction;
		}
		var pOptions = null;
		if(iType=='1'){
			pOptions = eval('['+sOptions+']');
		}
		else if(iType=='2'){
			pOptions = eval(sOptions);
		}
		else if(iType=='3'){
			pOptions = eval(sOptions)(_sRight);
		}
		var sOptionsHtml = '';
		var pValues = {};
		for(var i=0;pOptions&&i<pOptions.length;i++){
			var sValue = pOptions[i]['value'];
			var sLabel = pOptions[i]['label'];
			pValues[sLabel] = sValue;
			var sTmpOption = '<div style="width:100%;" class="';
			if(sValue==sCurrValue){
				sCurrLabel = sLabel;
				sTmpOption += 'ui_select_option_selected';
			}
			else{
				sTmpOption += 'ui_select_option';
			}
			sTmpOption += '" value="'+sValue+'">'+sLabel+'</div>';
			sOptionsHtml += sTmpOption;
		}
		var sHtml = 
		'<div '+document.getAttributes(_sUiElement)+' class="wcm_pointer ui_select">'
		+ '<span style="float:left;height:100%;"><input class="ui_editableselect_input" id="input_'+sInputName+'" name="'+sInputName+'" value="'+sCurrLabel+'"></span>'
		+ '<span class="ui_select_dropdown"></span>'
		+ '</div>'//
		+ '<div style="display:none" class="ui_select_options">'+sOptionsHtml+'</div>';
		_sUiElement.innerHTML = sHtml;
		var ePanel = _sUiElement.childNodes[0];
		var sPanelId = ePanel.id;
		ePanel.setAttribute("value",sCurrValue);
		ePanel.setAttribute("label",sCurrLabel);
		var eInput = ePanel.childNodes[0].childNodes[0];
		if(sValidation){
			eInput.setAttribute("validation",sValidation);
		}
		var eOptionsContainer = _sUiElement.childNodes[1];
		var sOptionsContainerId = eOptionsContainer.id = sPanelId+'_options';
		var bubbleMore = new com.trs.wcm.BubblePanel(eOptionsContainer);
		bubbleMore.doAfterHide = function(){
			Element.removeClassName($(sPanelId),'ui_select_selected');
		}
		var oRecycler = new SelectRecycler(eOptionsContainer,bubbleMore);
		if(_arrObjsRecycle)_arrObjsRecycle.push(oRecycler);
		Event.observe(ePanel,'click',function(){
			var eOptions = $(sOptionsContainerId);
			var ePanel = $(sPanelId);
			document.body.appendChild(eOptions);//调整z-index
			Position.clone(ePanel,eOptions,{setHeight:false,offsetTop:ePanel.offsetHeight});
			Element.addClassName(ePanel,'ui_select_selected');
			bubbleMore.bubble();
		});
		Event.observe(eInput,'click',function(event){
			Event.stop(event||window.event);
		});
		Event.observe(ePanel,'mouseover',function(){
			Element.addClassName($(sPanelId),'ui_select_hover');
		});
		Event.observe(ePanel,'mouseout',function(){
			Element.removeClassName($(sPanelId),'ui_select_hover');
		});
		var caller = this;
		Event.observe(eInput,'blur',function(){
			var ePanel = $(sPanelId);
			var eInput = ePanel.childNodes[0].childNodes[0];
			var isValid = true;
			if(bAutoValid&&sValidation){
				var validInfo = ValidatorHelper.valid(eInput);
				var warning = validInfo.getWarning();
				isValid = validInfo.isValid();
			}
			if(isValid){
				var sOldLabel = ePanel.getAttribute("label");
				var sNewLabel = eInput.value;
				var sValue = pValues[sNewLabel];
				if(sOldLabel!=sNewLabel){
					ePanel.setAttribute('label',sNewLabel);
					if(sValue!=null){
						ePanel.setAttribute('value',sValue);
					}
					else{
						ePanel.setAttribute('value',sNewFilledValue);
					}
					onChangeListener.apply(ePanel);
				}
			}
			else{
				$alert(warning,function(){
					try{
						eInput.focus();
						eInput.select();
					}catch(err){}
					$dialog().hide();
				});
			}
		});
		Event.observe(eInput,'keypress',function(event){
			event = event || window.event;
			var ePanel = $(sPanelId);
			var eInput = ePanel.childNodes[0].childNodes[0];
			if(event.keyCode==13){
				eInput.blur();
			}
		});
		function _ui_select_option_click_(){
			var ePanel = $(sPanelId);
			var eLastValue = ePanel.getAttribute("value",2);
			var eCurrValue = this.getAttribute("value",2);
			var eCurrLabel = this.innerHTML;
			if(eLastValue!=eCurrValue){
				ePanel.setAttribute("value",eCurrValue);
				ePanel.setAttribute("label",eCurrLabel);
				ePanel.childNodes[0].childNodes[0].value = eCurrLabel;
				onChangeListener.apply(ePanel);
				if(ePanel.lastSelectedOptionId){
					var tmp = $(ePanel.lastSelectedOptionId);
					tmp.className = 'ui_select_option';
				}
				this.className = 'ui_select_option_selected';
				ePanel.lastSelectedOptionId = this.id;
			}
		};
		function _ui_select_option_mouseover_(){
			Element.addClassName(this,'ui_select_option_hover');
		}
		function _ui_select_option_mouseout_(){
			Element.removeClassName(this,'ui_select_option_hover');
		}
		function getOptionByChar(_c){
			var eOptions = eOptionsContainer.childNodes;
			var ePanel = $(sPanelId);
			var bStart = false;
			var esMatched = [];
			for(var i=0;i<eOptions.length;i++){
				var eOption = eOptions[i];
				if(eOption.nodeType==3)continue;
				if(ePanel.lastSelectedOptionId==eOption.id){
					bStart = true;
					continue;
				}
				var sValue = eOption.innerHTML;
				if(sValue.length>0&&sValue.charAt(0).toUpperCase()==_c){
					if(bStart)return eOption;
					else{
						esMatched.push(eOption);
					}
				}
			}
			if(esMatched.length>0)return esMatched[0];
		}
		var eOptions = eOptionsContainer.childNodes;
		Event.observe(eOptionsContainer,'keyup',function(event){
			event = event || window.event;
			var c = String.fromCharCode(event.keyCode);
			var eOption = getOptionByChar(c);
			if(eOption){
				eOptionsContainer.scrollTop = eOption.offsetTop;
				_ui_select_option_click_.apply(eOption);
			}
		});
		for(var i=0;i<eOptions.length;i++){
			var eOption = eOptions[i];
			if(eOption.nodeType==3)continue;
			eOption.id = sPanelId+'_'+i;
			if(sCurrValue==eOption.getAttribute("value",2)){
				ePanel.lastSelectedOptionId = eOption.id;
			}
			Event.observe(eOption,'click',_ui_select_option_click_.bind(eOption));
			Event.observe(eOption,'mouseover',_ui_select_option_mouseover_.bind(eOption));
			Event.observe(eOption,'mouseout',_ui_select_option_mouseout_.bind(eOption));
			if(_arrEventObserving){
				_arrEventObserving.push(eOption);
			}
		}
		_sUiElement.parentNode.insertBefore(ePanel,_sUiElement);
		_sUiElement.parentNode.insertBefore(eOptionsContainer,_sUiElement);
		_sUiElement.parentNode.removeChild(_sUiElement);
		if(_arrEventObserving){
			_arrEventObserving.push(ePanel);
			_arrEventObserving.push(eOptionsContainer);
		}
	}
});
