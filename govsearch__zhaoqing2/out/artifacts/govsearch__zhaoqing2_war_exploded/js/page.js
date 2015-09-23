var PageContext = {
	params : {}
};

/*--------------------------------------Page Navigator------------------------------------*/
PageContext.getPageNavHtml = function(iCurrPage, iPages){
	var sHtml = '';
	//output first
	if(iCurrPage!=1){
		sHtml += '<span class="nav_page" title="首页"><a href="#" onclick="PageContext.PageNav.goFirst();return false;">1</a></span>';
	}else{
		sHtml += '<span class="nav_page nav_currpage" title="首页">1</span>';
	}
	var i,j;
	if(iPages-iCurrPage<=1){
		i = iPages-3;
	}
	else if(iCurrPage<=2){
		i = 2;
	}
	else{
		i = iCurrPage-1;
	}
	var sCenterHtml = '';
	var nFirstIndex = 0;
	var nLastIndex = 0;
	//output 3 maybe
	for(j=0;j<3&&i<iPages;i++){
		if(i<=1)continue;
		j++;
		if(j==1)nFirstIndex = i;
		if(j==3)nLastIndex = i;
		if(iCurrPage!=i){
			sCenterHtml += '<span class="nav_page"><a href="#" onclick="PageContext.PageNav.go('+i+','+iPages+');return false;">'+i+'</a></span>';
		}else{
			sCenterHtml += '<span class="nav_page nav_currpage">'+i+'</span>';
		}
	}
	//not just after the first page
	if(nFirstIndex!=0&&nFirstIndex!=2){
		sHtml += '<span class="nav_morepage" title="更多">...</span>';
	}
	sHtml += sCenterHtml;
	//not just before the last page
	if(nLastIndex!=0&&nLastIndex!=iPages-1){
		sHtml += '<span class="nav_morepage" title="更多">...</span>';
	}
	//output last
	if(iCurrPage!=iPages){
		sHtml += '<span class="nav_page" title="尾页"><a href="#" onclick="PageContext.PageNav.goLast();return false;">'+iPages+'</a></span>';
	}else{
		sHtml += '<span class="nav_page nav_currpage" title="尾页">'+iPages+'</span>';
	}
	return sHtml;
}
PageContext.getNavigatorHtml = function(){
	var iRecordNum = parseInt(PageContext["RecordNum"]);
	if(iRecordNum==0)return '';
	var iCurrPage = parseInt(PageContext.params["CurrPage"]||1);
	var iPageSize = parseInt(PageContext["PageSize"]);
    PageContext["PageCount"] = Math.ceil(iRecordNum / iPageSize);
	var iPages = parseInt(PageContext["PageCount"]);
	var sHtml = '';
	var sTypeDesc = PageContext.PageNav["UnitName"]+PageContext.PageNav["TypeName"];
	sHtml += '<span class="nav_page_detail">共<span class="nav_pagenum">'+iPages+'</span>页'
				+'<span class="nav_recordnum">'+iRecordNum+'</span>'
				+sTypeDesc+',每页<span class="nav_pagesize">'+iPageSize+'</span>'+sTypeDesc
				+'.</span>';
	var go_pre_cls = "nav_go_pre"
	if(iPages<1 || iCurrPage==1){
		go_pre_cls += " disabled_go";
	}
	var go_next_cls = "nav_go_next"
	if(iPages<1 || iCurrPage==iPages){
		go_next_cls += " disabled_go";
	}
	sHtml += '<span class="wcm_pointer ' + go_pre_cls + '"><a href="#" onclick="PageContext.PageNav.goPre();return false;">上一页</a></span>'
	sHtml += '<span class="wcm_pointer ' + go_next_cls + '"><a href="#" onclick="PageContext.PageNav.goNext();return false;">下一页</a></span>'
	if(iPages>1){
		sHtml += PageContext.getPageNavHtml(iCurrPage,iPages);
		sHtml += '&nbsp;&nbsp;&nbsp;&nbsp;跳转至第&nbsp;<span class="wcm_pointer"><input name="pageSea" type="text" size="1">&nbsp;页&nbsp;&nbsp;<a href="#" onclick="PageContext.PageNav.goSearch();return false;">>></a></span>'
	}
	return sHtml;
	//
	if(iPages>1){
		sHtml += '<span class="nav_specpage_go">';
		if(iCurrPage!=1){
			sHtml += '<span class="wcm_pointer nav_go_first" title="首页" onclick="PageContext.PageNav.goFirst();"></span>';
			sHtml += '<span class="wcm_pointer nav_go_pre" title="上一页" onclick="PageContext.PageNav.goPre();"></span>';
		}else{
			sHtml += '<span class="nav_go_first_disabled"></span>';
			sHtml += '<span class="nav_go_pre_disabled"></span>';
		}
		if(iCurrPage!=iPages){
			sHtml += '<span class="wcm_pointer nav_go_next" title="下一页" onclick="PageContext.PageNav.goNext();"></span>';
			sHtml += '<span class="wcm_pointer nav_go_last" title="尾页" onclick="PageContext.PageNav.goLast();"></span>';
		}else{
			sHtml += '<span class="nav_go_next_disabled"></span>';
			sHtml += '<span class="nav_go_last_disabled"></span>';
		}

		sHtml += '</span>';
	}
	return sHtml;
}
PageContext.drawNavigator = function(){
	var eNavigator = document.getElementById(PageContext.PageNav.NavId);
	if(!eNavigator)return;
	var sHtml = PageContext.getNavigatorHtml();
	eNavigator.innerHTML = sHtml;
}
PageContext.PageNav = {
	UnitName : '条',
	TypeName : '记录',
	NavId : 'list_navigator',
	go : function(_iPage,_iPageNum){
		alert('must implements');
	},
	goFirst : function(){
		PageContext.PageNav.go(1,PageContext["PageCount"]);
	},
	goPre : function(){
		if(PageContext.params["CurrPage"]>1){
			PageContext.PageNav.go(PageContext.params["CurrPage"]-1,PageContext["PageCount"]);
		}
	},
	goNext : function(){
		if((PageContext.params["CurrPage"]||1)<PageContext["PageCount"]){
			PageContext.PageNav.go((PageContext.params["CurrPage"]||1)+1,PageContext["PageCount"]);
		}
	},
	goLast : function(){
		PageContext.PageNav.go(PageContext["PageCount"],PageContext["PageCount"]);
	},
	goSearch : function(){
		var ssra=parseInt(document.getElementById("pageSea").value);
		if(ssra>=1)
		{
			if(ssra<=PageContext["PageCount"]){
				PageContext.PageNav.go(ssra,PageContext["PageCount"]);
			}
			else
			{
				alert('输入的页码超过总页码范围');
			}
		}
		else
		{
			alert('输入的页码太小，不能进行翻页');
		}
	}
}
PageContext.PageNav.go =  function(_iPage,_maxPage){
		if(_iPage>_maxPage){
			_iPage = _maxPage;
		}
		PageContext.params = {"CurrPage":_iPage};
        alert("to: " + _iPage);
};

