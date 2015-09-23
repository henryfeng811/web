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
	var iTotalNum = parseInt(PageContext["TotalRecord"]);
	if(iRecordNum==0) return '';
	var iCurrPage = parseInt(PageContext.params["CurrPage"]||1);
	var iPageSize = parseInt(PageContext["PageSize"]);
    PageContext["PageCount"] = Math.ceil(iRecordNum / iPageSize);
	var iPages = parseInt(PageContext["PageCount"]);
	var sHtml = '';
	var sTypeDesc = PageContext.PageNav["UnitName"]+PageContext.PageNav["TypeName"];
	//sHtml += '共'+iPages+'页 '+iRecordNum+sTypeDesc;
	if(iTotalNum > 400 && iRecordNum == 400){
		sHtml += '共<em>'+iTotalNum+'</em>'+sTypeDesc+'，仅显示前<em>20</em>页<em>400</em>'+sTypeDesc;
	}else{
		sHtml += '当前第<em>'+iCurrPage+'</em>页&nbsp;'
		sHtml += '共<em>'+iPages+'</em>页 <em>'+iRecordNum+'</em>'+sTypeDesc;
	}
	var go_pre_cls = "nav_go_pre"
	if(iPages<1 || iCurrPage==1){
		go_pre_cls += " disabled_go";
	}
	var go_next_cls = "nav_go_next"
	if(iPages<1 || iCurrPage==iPages){
		go_next_cls += " disabled_go";
	}
	sHtml += '<a href="#" onclick="PageContext.PageNav.goFirst();return false;">首页</a> | ';
	sHtml += '<a href="#" class="'+go_pre_cls+'" onclick="PageContext.PageNav.goPre();return false;">上一页</a> | ';
	sHtml += '<a href="#" class="'+go_next_cls+'" onclick="PageContext.PageNav.goNext();return false;">下一页</a> | ';
	sHtml += '<a href="#" onclick="PageContext.PageNav.goLast();return false;">末页</a>';
	if(iPages>1){
		sHtml += ' 跳至<input class="toPage" type="text" onchange=\"PageContext.PageNav.toPage(this.value);return false;\" />/'+iPages+'页';
	}
	/*if(iPages>1){
		sHtml += PageContext.getPageNavHtml(iCurrPage,iPages);
	}
	return sHtml;*/
	
	/*if(iPages>1){
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
	}*/
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
	toPage : function(_iPage){
			if(!/^[0-9]*$/.test(_iPage)){
			alert("请输入数字!");
			return false;
		}
		if((PageContext.params["CurrPage"]||1)<PageContext["PageCount"]){
				PageContext.PageNav.go(_iPage,PageContext["PageCount"]);
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


