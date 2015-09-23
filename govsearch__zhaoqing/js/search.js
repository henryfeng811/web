/*---------------------------------------------advance search----------*/
function displayContainer(sContainer, _sURL){
	switch(sContainer){
		case "introduce":
			DefaultMain.style.display = 'none';
			DefaultMain.style.visibility = 'hidden';
			advanceSearchContainer.style.display = 'none';
			advanceSearchContainer.style.visibility = 'hidden';
			introduce.style.display = '';
			introduce.style.visibility = 'visible';
			window.frames("DataList").location.href = _sURL;
			break;
		case "DefaultMain":
			introduce.style.display = 'none';
			introduce.style.visibility = 'hidden';
			advanceSearchContainer.style.display = 'none';
			advanceSearchContainer.style.visibility = 'hidden';
			DefaultMain.style.display = '';
			DefaultMain.style.visibility = 'visible';
			break;
		case "advanceSearchContainer":
			introduce.style.display = 'none';
			introduce.style.visibility = 'hidden';
			DefaultMain.style.display = 'none';
			DefaultMain.style.visibility = 'hidden';
			advanceSearchContainer.style.display = '';
			advanceSearchContainer.style.visibility = 'visible';
		   break;
	}
}
function getDateDesc(oDate){
	var sToDay = oDate.getYear() + "-" + (oDate.getMonth()+1) + "-" + oDate.getDate();
	return sToDay;
}
function pubDateSelChange(sel){
	var dateContainer = $('dateContainer');
	var today = new Date();
	var year = today.getYear();
	var month = today.getMonth();
	var date = today.getDate();
	var sToDay = getDateDesc(today);
	today.setMonth(1);
	today.setDate(1);
	switch(parseInt(sel.value)){
		case 0:
			dateContainer.style.display='none';
			document.getElementById('time1').style.display = 'none';
			$('PubDate_Start').value = "";
			$('PubDate_End').value = "";
			break;
		case 1:
			dateContainer.style.display='none';
			today.setMonth(month);
			today.setDate(date - 1);
			$('PubDate_Start').value = getDateDesc(today);
			$('PubDate_End').value = sToDay;
			break;
		case 7:
			dateContainer.style.display='none';
			today.setMonth(month);
			today.setDate(date - 7);
			$('PubDate_Start').value = getDateDesc(today);
			$('PubDate_End').value = sToDay;
			break;
		case 30:
			dateContainer.style.display='none';
			today.setMonth(month);
			today.setDate(date - 30);
			$('PubDate_Start').value = getDateDesc(today);
			$('PubDate_End').value = sToDay;
			break;
		case 360:
			dateContainer.style.display='none';
			today.setYear(year - 1);
			today.setMonth(month);
			today.setDate(date);
			$('PubDate_Start').value = getDateDesc(today);
			$('PubDate_End').value = sToDay;
			break;
		case -1:
			dateContainer.style.display='';
			break;
	}
}

function getParams(isGet, _sContainerId){
	var params = {
//		isor		:$('isOrTrue').checked,
		_QUERYTYPE_	: 2
	};
	var sContainerId = _sContainerId || "advanceSearchContainer";
	var elements = Form.getElements(sContainerId);
	for (var i = 0; i < elements.length; i++){
		var oElement = elements[i];
		if(!oElement.name || oElement.getAttribute("ignore")){
			continue;
		}
		var sName = oElement.name;
		var sValue = Form.Element.getValue(oElement);
		if(sValue == undefined) continue;
		if(isGet){
			sValue = encodeURIComponent(sValue);
		}
		if(!params[sName]){
			params[sName] = sValue;
		}else if(String.isString(params[sName])){
			params[sName] = [params[sName], sValue];
		}else if(Array.isArray(params[sName])){
			params[sName].push(sValue);
		}else{
			throw new Error("未知的变量类型");
		}
	}	
	return params;
}

function doSearch(){
	var oSearchAgain = document.getElementById("SearchAgain");
	// 二次检索
	if(oSearchAgain.checked && window.SearchParams != null){
		if(queryValue.value.length>0){
			var sBeforeContentValue = window.SearchParams["Content"];
			if(sBeforeContentValue != null && sBeforeContentValue.length>0){
				sBeforeContentValue += " ";
			}else{
				sBeforeContentValue = "";
			}
			window.SearchParams["Content"] =  sBeforeContentValue + queryValue.value;
		}else{
			alert("您没有输入检索词！");
			queryValue.focus();
			return;
		}
	}
	// 单次检索
	else{
		if(queryValue.value.length>0){
			window.Search = 1;
			window.SearchType = 1;		
			window.SearchParams = {};
			window.SearchParams["Content"] = queryValue.value;
		}else{
			window.Search = 0;
			window.SearchType = 0;	
			window.SearchParams = {};
		}
	}
	
	
	$("documentContainer").innerHTML = $("divSearchRunning").innerHTML;
	PageContext.loadData();
}

function doAdvanceSearch(_sContainerId){
	queryValue.value='';
	SearchAgain.checked=false;
	window.SearchType = 2;
	var sFileNum = $("fileNum").value;

	var sFileNo = $("FileNo").value;
	if( sFileNo>0)
		sFileNum +=  sFileNo+"号";
	
	 $("fileNum").value = sFileNum;
	window.SearchParams = Object.clone(getParams(false, _sContainerId));
	PageContext.loadData();
	$("documentContainer").innerHTML = $("divSearchRunning").innerHTML;
	displayContainer('DefaultMain');
}

function showAll(s){
	//window.SearchParams = null;
	//window.Search = 0;
	//window.SearchType = 0;		
	//queryValue.value='';
	//SearchAgain.checked=false;
	//doSearch();
	if(s=="1")
	{
		window.location.href = "/pub/govpublic/832/index.htm";
	}
	else
	{
		//window.opener.location.href = "http://www.gov.cn";
		window.open('http://www.gov.cn');
	}
}