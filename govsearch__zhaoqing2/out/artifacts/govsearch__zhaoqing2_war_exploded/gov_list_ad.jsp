<%@ page contentType="text/html;charset=UTF-8" pageEncoding="GBK"%>                    
<%@page import="com.eprobiti.trs.*,java.util.StringTokenizer,java.text.SimpleDateFormat"%>
<%@ include file="head.jsp" %>
<%
	response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
	response.setHeader("Pragma","no-cache"); //HTTP 1.0 
	response.setDateHeader ("Expires", -1);
	//prevents caching at the proxy server
	response.setDateHeader("max-age", 0);  
%> 
<%!
	public String dateFormat(String birthdayString)
    {
    	   java.util.Date birthday = new java.util.Date();
    	   try{
	           java.text.SimpleDateFormat sdf=new java.text.SimpleDateFormat("yyyy.MM.dd");
	           birthday = sdf.parse(birthdayString);
	       }
		   catch(Exception e)
	       {
	          System.out.println("String to Date error");
	       }
           String strDate = "";
           SimpleDateFormat format = new SimpleDateFormat();
           format.applyPattern("yyyy'年'MM'月'dd'日'");
           strDate = format.format(birthday);
           return (String)strDate; 
	}
%>
<%
	com.eprobiti.trs.TRSResultSet trsrs = null;
	TRSConnection conn = null;
	String searchword = "";

	String strTemp = "";
	String sWhere = "",searchWordView="";
	String SType="",sInfo="";
	String wdatepS="1",wdate="",wenzS="1",wenz="";
	String dc1="",dc2="",order="",preSWord="",preSWord2="";
	String swordtemp = "";
	String FileType = "";
	String FileYear = "";
	String idxId="",Title="",description="",content="",FileNo="";
	
	String fileNum="",SearchClassInfoId="",dispatchUnit="";
	
	SType = getNullStringAndEncoding(request.getParameter("SType")).trim();
	String[] array = null;
	String SearchOfContent = getNullStringAndEncoding(request.getParameter("SearchOfContent")) ;
	String PubDateSel = getNullStringAndEncoding(request.getParameter("PubDateSel")) ;
	idxId = getNullStringAndEncoding(request.getParameter("idxId"));
	Title = getNullStringAndEncoding(request.getParameter("Title")) ; 
	
	String AllSearchWords = getNullStringAndEncoding(request.getParameter("AllSearchWords")) ;
	String OneOfSearchWords = getNullStringAndEncoding(request.getParameter("OneOfSearchWords")) ;
	String NotSearchWords = getNullStringAndEncoding(request.getParameter("NotSearchWords")) ;
	String keyWords = getNullStringAndEncoding(request.getParameter("keyWords")) ;
	String pubURL = getNullStringAndEncoding(request.getParameter("pubURL")) ;
	dispatchUnit = getNullStringAndEncoding(request.getParameter("dispatchUnit")) ;
	
	//发文机构 added by snow den Date:2013-11-04
	String sPublisher = getNullStringAndEncoding(request.getParameter("publisher")) ;
	
	if(SType.equals("3"))
	{ 
		order =  "-PubDate,-fileNum"; 
		 
		//处理正文输入框空格
		content = dealKeywords(SearchOfContent,"content","and")[0];
		
		if(!content.equals(""))
		{
			searchword="content=("+content+")"; 
			searchWordView+="+"+content;
		}
		else
		{
			searchword = "" ;
		}
		
		fileNum = getNullStringAndEncoding(request.getParameter("fileNum")).trim();
		SearchClassInfoId = getNullStringAndEncoding(request.getParameter("SearchClassInfoId")).trim(); 
		dc1 = getNullStringAndEncoding(request.getParameter("dc1")).trim();
		dc2 = getNullStringAndEncoding(request.getParameter("dc2")).trim();
		if(!PubDateSel.equals("")&&!PubDateSel.equals("0")&&!PubDateSel.equals("10"))
		{
			searchword+="PubDate=("+PubDateSel+")";
		}
		else if((!dc1.equals(""))&&(!dc2.equals("")))
		{
			if(searchword.equals(""))
			{
				searchword+="PubDate=("+dc1+" to "+dc2+")";
			}
			else
			{
				searchword+=" and PubDate=("+dc1+" to "+dc2+")";
			}
			searchWordView+="+"+dc1+"+"+dc2;
		}
		else if(!dc1.equals(""))
		{
			if(searchword.equals(""))
			{
				searchword+="PubDate>("+dc1+")";
			}
			else
			{
				searchword+=" and PubDate>("+dc1+")";
			}
			searchWordView+=">"+dc1;
		}
		else if(!dc2.equals(""))
		{
			if(searchword.equals(""))
			{
				searchword+="PubDate<("+dc2+")";
			}
			else
			{
				searchword+=" and PubDate<("+dc2+")";
			}
			searchWordView+="<"+dc2;
		}
		if(!idxId.equals(""))
		{
			//处理正文输入框空格
			String sIdxId = dealKeywords(idxId,"wenhao","or")[0]; 
			if(searchword.equals(""))
			{
				searchword+="idxID=("+sIdxId+")";
			}
			else
			{
				searchword+=" and idxID=("+sIdxId+")";
			}
			searchWordView+="+"+sIdxId;
		}
		if(!Title.equals(""))
		{
			//处理输入框名称空格 
			array = dealKeywords(Title,"Title","and");
			String sTitle = array[0]; 
			if(searchword.equals(""))
			{
				searchword+="title=("+sTitle+")";
			}
			else
			{
				searchword+=" and title=("+sTitle+")";
			}
			searchWordView+="+"+sTitle;
		}
		
		if(!SearchClassInfoId.equals("0")&&!SearchClassInfoId.equals(""))
		{
			int nClassInfoId = Integer.parseInt(SearchClassInfoId);
			String sClassInfoIds = ClassInfosContext.getInstance().getClassInfoIds(nClassInfoId);
			if(!searchword.equals(""))
			{
				searchword+=" and subcat=("+sClassInfoIds+")";
			}
			else
			{
				searchword+="subcat=("+sClassInfoIds+")";
			}
		} 
		
		
		if(!dispatchUnit.equals("0")&&!dispatchUnit.equals(""))
		{
			if(!searchword.equals(""))
			{
				searchword+=" and ChannelId=("+dispatchUnit+")";
			}
			else
			{
				searchword+="ChannelId=("+dispatchUnit+")";
			}
		}

		String sKeyWords = dealKeywords(keyWords,"title","or")[0]; 
		if(!sKeyWords.equals(""))
		{
			if(!searchword.equals(""))
			{
				searchword+=" and keyWords=("+sKeyWords+")";
			}
			else
			{
				searchword+="keyWords=("+sKeyWords+")";
			}
		}  
		if(!fileNum.equals(""))
		{
			if(!searchword.equals(""))
			{
				searchword+=" and fileNum=('%"+fileNum+"%')";
			}
			else
			{
				searchword+="fileNum=('%"+fileNum+"%')";
			}
		}
		//增加发文机构
		if(!sPublisher.equals(""))
		{
			if(!searchword.equals(""))
			{
				searchword+=" and publisher=('%"+sPublisher+"%')";
			}
			else
			{
				searchword+="publisher=('%"+sPublisher+"%')";
			}
		}
		
		
		if(!searchword.equals(""))
		{
			sWhere = searchword;
		}
	}
	else if(SType.equals("2"))
	{	
		String sAllSearchWords = dealKeywords(AllSearchWords,"content","and")[0];
		String sOneOfSearchWords = dealKeywords(OneOfSearchWords,"content","or")[0];
		String sNotSearchWords = dealKeywords(NotSearchWords,"content","or")[0];
		
		if(!sAllSearchWords.equals("")&&!sOneOfSearchWords.equals("")&&!sNotSearchWords.equals(""))
		{
			searchword = "content=(("+sAllSearchWords+") and ("+sOneOfSearchWords+") -("+sNotSearchWords+"))";
		}
		else if(!sAllSearchWords.equals("")&&!sOneOfSearchWords.equals(""))
		{
			searchword = "content=(("+sAllSearchWords+") and ("+sOneOfSearchWords+"))";
		}
		else if(!sAllSearchWords.equals("")&&!sNotSearchWords.equals(""))
		{
			searchword = "content=(("+sAllSearchWords+")  -("+sNotSearchWords+"))";
		}
		else if(!sAllSearchWords.equals(""))
		{
			searchword = "content=("+sAllSearchWords+")";
		}
		else if(!sOneOfSearchWords.equals("")&&!sNotSearchWords.equals(""))
		{
			searchword = "content=(("+sOneOfSearchWords+") -("+sNotSearchWords+"))";
		}
		else if(!sOneOfSearchWords.equals(""))
		{
			searchword = "content=("+sOneOfSearchWords+")";
		}
		else if(!sNotSearchWords.equals(""))
		{
			searchword = "content=("+sNotSearchWords+")";
		}
		if(!searchword.equals(""))
		{
			sWhere = searchword;
		}
	}
	else
	{
		searchword = "";
		strTemp = "";
	}

	
	if (searchword==null)
	{
		searchword = "";
	}
	if(database==null)
	{
		database = "";
	}
	 
	 
	 
	//快速分类切换
	
	String sPage = "";
	sPage = request.getParameter("page");
	if (sPage == null)
	{
		sPage = "1";
	}
	int nPage 		= Integer.parseInt(sPage);  // 当前页面
	int nPageCount 	= 0;						// 总页数
	long num 		= 0;						// 检索结果总数
	int nPageSize 	= 20;	
try
{
	conn = new TRSConnection();
	//建立数据库连接
	conn.connect(serverName,serverPort,userName,userPass);
						// 每页结果数
	trsrs = new TRSResultSet(conn); 
	//out.println(sWhere);
	String sWhere2 = sWhere;
	if(!pubURL.equals(""))
	{
		if(!sWhere2.equals(""))
		{
			//e.g.pubURL = http://gkml.csrc.gov.cn/pub/;
			//e.g.sWhere2 += " and docpuburl=('http://gkml.csrc.gov.cn/pub/zjhpublicofjl/%')";  
			sWhere2 += " and docpuburl=('" + pubURL + "%')";  
		}
		else
		{
			sWhere2 = "docpuburl=('" + pubURL + "%')";  
		}
	}
	trsrs.executeSelect(database, sWhere2, order, "", "", 0, TRSConstant.TCE_OFFSET|TRSConstant.TCM_LIFOSPARE, false); 
	trsrs.setReadOptions(TRSConstant.TCE_OFFSET,"MetaDataId;DOCPUBURL;subcat;title;PubDate;fileNum;idxID;publisher;keywords","");
	trsrs.setBufferSize(nPageSize,nPageSize);
	num = trsrs.getRecordCount(); 
	nPageCount = (int)num/nPageSize + 1;
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>政府公开目录</title>

<script src="./js/com.trs.util/Common.js"></script>

<link href="./css/outlinetable.css" rel="stylesheet" type="text/css" />
<link href="./css/page.css" rel="stylesheet" type="text/css">
<SCRIPT LANGUAGE="JavaScript" src="./js/page.js"></SCRIPT>

<script language="javascript" src="./js/search.js" type="text/javascript"></script>
<!--新增加的-->
<script language="javascript" src="./js/search-new.js" type="text/javascript"></script>
<script language="javascript" src="./js/search-color.js" type="text/javascript"></script>
<link href="./css/outlineTable_new.css" rel="stylesheet" type="text/css">
<style type="text/css">
.no_object_found{
	color:black;
	font-style:italic;
	font-size:14px;
	margin:4px;
}    
</style>
<SCRIPT LANGUAGE="JavaScript">
<!--
var m_oPreTip = null;
function displayTip(_sId, _bNotDisplay){
    var event = Event.findEvent();
	if(m_oPreTip != null && !_bNotDisplay){
		m_oPreTip.style.display = "none";
	}
	var oCurrTip = $("Tip"+_sId);
    document.body.appendChild(oCurrTip);
	if(_bNotDisplay){
//		oCurrTip.style.visibility = "hidden";
		oCurrTip.style.display = "none";
		oCurrTip = null;
		return;
	}

	//oCurrTip.style.display = "";
	//oCurrTip.style.visibility = "hidden";
	
	m_oPreTip = oCurrTip;
    if(!event.pageX){
        var x = event.x;// + document.body.scrollLeft;
        var y = event.y;// + document.body.scrollTop;
        var	nOffsetHeight  = Element.getDimensions(oCurrTip).height;
        //var	nOffsetHeight  = 150;
        oCurrTip.style.left = x + 30 ;//+ 365;	
        if(document.body.offsetHeight <= (y + 90 + nOffsetHeight)){
            oCurrTip.style.top = Math.max(y + 90 - nOffsetHeight, 0);
        }else{
            oCurrTip.style.top = y + 90;
        }
    }else{
        var x = event.pageX + 8;// + document.body.scrollLeft;
        var y = event.pageY + 8;// + document.body.scrollTop;
        oCurrTip.style.left = x;//+ 365;	
        oCurrTip.style.top = y;
        oCurrTip.style.border = '1px solid black';
    }
	oCurrTip.style.display = "";
}
//-->
</SCRIPT>
<style>
.Tip {
	width:500;
	z-index:999;
	position:absolute; 
	font-size:12px;
	border:1px solid inner; 
	padding:5px;
	background-color:white; 
	filter:progid:DXImageTransform.Microsoft.dropshadow(OffX=4, OffY=4, Color='gray', Positive=true);
}
.Tip table{
	width:100%;
	font-size:12px;	
}

</style>
<style type="text/css">
.headOfTable{
    border:1px solid #ECC197;
    border-right:0px;
}
.headOfTable li.mc{
    width:435px;
	*width:460px;
}
.row{
    border-left:1px solid #ECC197;
}
.row li{
    float:left;
}
</style>
<style type="text/css" id="columnStyle">
.row{
}
.row li.xh{
    width:32px;
}
.row li.mc{    
    width:437px;
	*width:460px;
}
.row li.fbrq{
	width:100px;
}
.row li.wh{
	width:150px;
    border-right:0px;
}
.row li.nngs{
	width:100px;
    border-right:0px;
}    
</style>
<style type="text/css">
    #advanceSearchContainer table{
        font-size:12px;
    }
    #advanceSearchContainer td{
        height:30px;
    }
    #dateContainer *{
        height:auto;
    }
</style>
<SCRIPT LANGUAGE="JavaScript">
<!--
/*
 * 列表上可以拖动列的修改
 */

window.dragInfo = {
	START_DRAG	: false,
	startX		: 0,
	oSource		: null,
	oColumn		: null,
	oldMoveSepX : 0
};
Event.observe(window, 'load', function(){
	Event.observe('headOfTable', 'mousedown', function(event){
		event = window.event || event;
		var srcElement = Event.element(event);
		if(!Element.hasClassName(srcElement, "sep")){
			return;
		}
		window.dragInfo.oSource = srcElement;
		window.dragInfo.oColumn = getPreviousHTMLSibling(srcElement);
		window.dragInfo.START_DRAG = true;
		srcElement.setCapture(true);
		window.dragInfo.startX = parseInt(Event.pointerX(event));
		var moveSep = $('moveSep');
		Position.clone(window.dragInfo.oSource, moveSep, {setWidth:false, setHeight:false, offsetLeft:3});
		moveSep.style.height = $('documentContainer').offsetHeight + $('headOfTable').offsetHeight;
		window.dragInfo.oldMoveSepX = parseInt(moveSep.style.left);
		Element.show('moveSep');
	});
	Event.observe('headOfTable', 'mousemove', function(event){
		if(!window.dragInfo.START_DRAG){
			return;
		}
		event = window.event || event;
		var x = parseInt(Event.pointerX(event));
		var dx = x - window.dragInfo.startX;
		var oldWidth = parseInt(window.dragInfo.oColumn.offsetWidth);
		var width = oldWidth + dx;		
		var minWidth = 30;
		if(width < minWidth){
			width = minWidth;
			dx = width - oldWidth;
		}
		var moveSep = $('moveSep');
		moveSep.style.left = window.dragInfo.oldMoveSepX + dx;
	});
	Event.observe('headOfTable', 'mouseup', function(event){
		if(!window.dragInfo.START_DRAG){
			return;
		}
		Element.hide('moveSep');
		window.dragInfo.START_DRAG = false;
		event = window.event || event;
		var x = parseInt(Event.pointerX(event));
		var dx = x - window.dragInfo.startX;
		var oldWidth = parseInt(window.dragInfo.oColumn.offsetWidth);
		var width = oldWidth + dx;		
		var minWidth = 30;
		if(width < minWidth){
			width = minWidth;
			dx = width - oldWidth;
		}
		window.dragInfo.oColumn.style.width = width
		$('headOfTable').style.width = $('headOfTable').offsetWidth + dx;	
		setStyle(window.dragInfo.oColumn, width, $('headOfTable').style.width);
		window.dragInfo.oSource.releaseCapture();
	});
});

function setStyle(oColumn, nWidth, _rowWidth){
	var sSelectorText = ".row li." + oColumn.className;
	var sSelectorText2 = ".row";
	var columnStyle = $('columnStyle').styleSheet;
	var rules = columnStyle.rules;
	for (var i = 0; i < rules.length; i++){
		if(rules[i].selectorText.toLowerCase() == sSelectorText){
			rules[i].style.width = nWidth;
		}
		else if(rules[i].selectorText.toLowerCase() == sSelectorText2){
			rules[i].style.width = _rowWidth;
		}
	}
}

//-->
</SCRIPT>

<SCRIPT LANGUAGE="JavaScript">
 <!--
	//var m_sPageName = "${PAGE_NAME}";
	//var m_sPageExt = "${PAGE_EXT}";
 
	// 覆写点击分页代码的响应函数
	PageContext.PageNav.go =  function(_iPage,_maxPage)
	{
		if(_iPage>_maxPage){
			_iPage = _maxPage;
		}
		PageContext.params = {"CurrPage":_iPage};
		var aPageForm = document.getElementsByName('pageform');
		var pagefrom = aPageForm[aPageForm.length - 1];
		pagefrom.page.value = _iPage;
		pagefrom.submit();
	};

//-->
</SCRIPT>

<style type="text/css">
.no_object_found{
	color:black;
	font-style:italic;
	font-size:14px;
	margin:4px;
}    
</style>
<STYLE type=text/css>
.no_object_found {
	FONT-SIZE: 14px; MARGIN: 4px; COLOR: black; FONT-STYLE: italic
}
.STYLE1 {
	font-family: "宋体", Arial;
	font-size: 12px;
	line-height: 20px;
	color: #000000;
}
a.STYLE1:link {
	color: #000000;
	text-decoration: none;
}
a.STYLE1:visited {
	color: #000000;
	text-decoration: none;
}
a.STYLE1:hover {
	color: #FF0000;
	text-decoration: underline;
}
a.STYLE1:active {
	color: #FF0000;
	text-decoration: underline;
}
.STYLE2 {
	font-family: "宋体", Arial;
	font-size: 12px;
	line-height: 20px;
	color: #666666;
}
.STYLE3 {
	font-family: "宋体", Arial;
	font-size: 12px;
	line-height: 20px;
	color: #000000;
	padding-left:20px;
}
a.STYLE3:link {
	color: #000000;
	text-decoration: none;
}
a.STYLE3:visited {
	color: #000000;
	text-decoration: none;
}
a.STYLE3:hover {
	color: #FF0000;
	text-decoration: underline;
}

.STYLE4 {
	font-family: "宋体", Arial;
	font-size: 12px;
	line-height: 20px;
	color: #5F5F5F;
	padding-left:5px;
	font-weight: bold;
}
</STYLE>
<SCRIPT LANGUAGE="JavaScript">
<!--
// 画分页代码以及自动调整窗口大小
var m_nRecordCount = <%= num %>;

if(m_nRecordCount.length == 0){
	m_nRecordCount = 0;
}
var m_nCurrPage = <%= nPage-1 %>;
var m_nPageSize = 20;

window.onload = function(){
    PageContext["RecordNum"] = m_nRecordCount;
	PageContext.params["CurrPage"] = m_nCurrPage + 1;
	PageContext["PageSize"] = m_nPageSize;
	PageContext.drawNavigator();
	
	if(m_nRecordCount == 0){
		document.getElementById("documentContainer").innerHTML = document.getElementById("divNoObjectFound").innerHTML;
	}

	if(m_nCurrPage>0){
		document.getElementById("documentContainer").start = m_nCurrPage*m_nPageSize+1;
	}

	adjustDimension();
};
function adjustDimension(){
	var minHeight = 650;
	var realHeight = parseInt(document.body.scrollHeight);
	if(window.frameElement)
		window.frameElement.style.height = Math.max(minHeight, realHeight);
}
	
//-->
</SCRIPT>

<script language="JavaScript">
function executeSearch()
{  
	document.trssearchform.method = 'post'; 
	if(document.trssearchform.searchAgain.checked)
	{	
		document.trssearchform.preSWord.value = "<%= sWhere %>";
	}
	document.trssearchform.submit();
}
function cancelSearch()
{  
    //去掉链接参数中的searchType，searchValue参数
    var oParams = top.location.search.toQueryParams() || {};
    delete oParams["searchType"];
    delete oParams["searchValue"];
    var sUrl = top.location.href;
    var match = /^([^\?]+).*$/.exec(sUrl);
    if(match){
        sUrl = match[1];
        var sParams = $toQueryStr(oParams);
        if(sParams && sParams.length > 0){
            sUrl += "?" + sParams
        }
    }
	window.top.location.href = sUrl;
}
</script>
</head>

<body style="overflow:hidden">
<div class="main" id="DefaultMain">	
<form action="simp_gov_list.jsp" method="post" name="trssearchform" >
	<input type="hidden" name="preSWord" value="">
	<input type="hidden" name="searchYear" value="all">
	<input type="hidden" name="pubURL" value="<%= pubURL %>"> 
	<div class="rowOfSearchNew">
		<span class="searchTipNew">&nbsp;&nbsp;信息搜索：</span>
		<input type="text" name="sword" class="SearchOfInput" id="sword" size="45">
		<select name="searchColumn" id="select">
		  <option value="all">全部</option>
		  <option value="zhengwen">正文</option>
		  <option value="biaoti">名称</option>
		  <option value="wenhao">文号</option>
		  <option value="fwdw">发文单位</option>
	    </select>
		<input type="hidden" name="SType" value="1">
		<SPAN id=searchBtn onclick="return executeSearch();" tabIndex=2 style="padding:4px 20px;"></SPAN>
		<a class="advanceSearch" href="advsearch.jsp">高级搜索</a>
		<SPAN class=advanceSearch onclick=cancelSearch();>返回首页</SPAN>
		<INPUT id=searchAgain type=checkbox value="1" name=searchAgain>在结果中搜索
	</div> 
</form>
<form action="gov_list_ad.jsp" method="post" name="Adtrssrchform" >  	
		<input type="hidden" name="SType" value="<%= SType %>">
		<input type="hidden" name="idxId" value="<%= idxId %>">
		<input type="hidden" name="Title" value="<%= Title %>">
		<input type="hidden" name="dc1" value="<%= dc1 %>"> 
		<INPUT type="hidden" name="dc2" value="<%= dc2 %>">
		<input type="hidden" name="fileNum" value="<%= fileNum %>"> 
		<input type="hidden" name="FileNo" value="<%= FileNo %>">
		<input type="hidden" name="SearchClassInfoId" value="<%= SearchClassInfoId %>">
		<input type="hidden" name="SearchOfContent" value="<%= SearchOfContent %>">
		<input type="hidden" name="FileType" value="<%= FileType %>">
		<input type="hidden" name="FileYear" value="<%= FileYear %>"> 
		<input type="hidden" name="pubURL" value="<%= pubURL %>"> 
</form>

<%
	//处理反显的数据
	String views = SearchOfContent;
	if(!Title.equals(""))
	{
		views+="+"+Title;
	}
	views = views.replace(' ','+');
	
	if(searchWordView.equals(""))
	{
		searchWordView="全部信息";
	}
	%>
	<div class="rowOfCurrentPosition">搜索结果如下：<span id="currentPosition"><%=views %></span></div>
	<div class="content" id="content" style="overflow:auto;width:100%;">
		<div class="headOfTable" unselectable="on" id="headOfTable">
			<li class="xh" unselectable="on">序号</li>
			<li class="mc" orderBy="TITLE" unselectable="on">名称</li>
			<li class="sep" unselectable="on"></li>
			<li class="fbrq" orderBy="PubDate" unselectable="on">发文日期</li>
			<li class="sep" unselectable="on"></li>
			<li class="wh" unselectable="on">文号</li>
			<li class="sep" unselectable="on"></li>
		</div>
	
		<div id="documentContainer">

			<%
				if (num>0)
				{
					int i = 1;
						
					trsrs.moveTo(0,(nPage-1)*nPageSize);
					do 
					{
			%>

			<div class="row">
				<li class="xh"><%= (nPage-1)*nPageSize+i %></li>
				<%
					String puburl="";
					try
						{
							puburl=trsrs.getString("DOCPUBURL");
						}catch(Exception e)
						{
							puburl="#";
						}
				%>
				<li class="mc">
					<div>                       
						<a href="<%= puburl %>?keywords=<%=views%>" target="_blank" onMouseOver="displayTip(<%= trsrs.getString("MetaDataId") %>);" onMouseOut="displayTip(<%= trsrs.getString("MetaDataId") %>, true);"><%= trsrs.getString("title","blue") %></a>
					</div>			
				</li>						
				<li class="sep" unselectable="on"></li>
				<%
					String dates="";

					dates=trsrs.getString("PubDate");
					if(dates!=null&&dates.length()>1) 
					{
						dates=dateFormat(dates);
					}
				%>
				<li class="fbrq"><%= dates %></li>						
				<li class="sep" unselectable="on"></li>

				<li class="wh"><%= trsrs.getString("fileNum") %></li>						
				<li class="sep" unselectable="on"></li>

			</div>
			

			<div id="Tip<%= trsrs.getString("MetaDataId") %>" class="Tip"  style="display:none;">
				<table border=0 cellspacing=0 cellpadding=0 style="width:100%;">
				<tbody>
					<tr>
						<td colspan="2">
							<table border=0 cellspacing=0 cellpadding=0>
								<tr>
									<td width="50%"><B>索 引 号:</B> <%= trsrs.getString("idxID") %></td>
									<td><B>主题分类:</B><%= getClassInfoName(trsrs.getString("subcat")) %></td>
								</tr>
							</table>				
						</td>
					</tr>
					<tr>
						<td colspan="2">&nbsp;</td>
					</tr>
					<tr>
						<td colspan="2">
							<table border=0 cellspacing=0 cellpadding=0>
								<tr>
									<td width="50%"><B>发布机构:</B> <%= trsrs.getString("publisher") %></td>
									<td><B>发文日期:</B><%= dates %></td>
								</tr>
							</table>				
						</td>
					</tr>
					<tr>
						<td colspan="2">
						<B>名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称:</B><%= trsrs.getString("title") %>
						</td>
					</tr>
					<tr>
						<td colspan="2">
							<table border=0 cellspacing=0 cellpadding=0>
								<tr>
									<td width="50%"><B>文&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号:</B> <%= trsrs.getString("filenum") %></td>
									<td><B>主 题 词:</B> <%= trsrs.getString("keywords") %></td>
								</tr>
							</table>				
						</td>
					</tr>
				</tbody>
				</table>

			</div>
			<%
						i++;
					}
					while(trsrs.moveNext()&&i<=nPageSize);
				}
			%>
		</div>
	</div>
	<div class="pageInfo list_navigator" id="list_navigator"></div>
</div>
<div id="moveSep" style="display:'none';"></div>
<div id="divNoObjectFound" style="display:none;">
    <div class="no_object_found">没有找到符合条件的记录</div>
</div>
<%
	if(SType.equals("2"))
	{
%>
<form name="pageform" action="gov_list_ad.jsp" method=post >
	<input type="hidden" name="AllSearchWords" value="<%= AllSearchWords %>">
	<input type="hidden" name="OneOfSearchWords" value="<%= OneOfSearchWords %>">
	<input type="hidden" name="NotSearchWordse" value="<%= NotSearchWords %>">
	<input type="hidden" name="page" value="<%= nPage %>">
	<input type="hidden" name="SType" value="<%= SType %>">
	<input type="hidden" name="pubURL" value="<%= pubURL %>"> 
</form>
<%
	}
	else
	{
%>
<form name="pageform" action="gov_list_ad.jsp" method=post >
	<input type="hidden" name="SType" value="<%= SType %>">
	<input type="hidden" name="idxId" value="<%= idxId %>">
	<input type="hidden" name="Title" value="<%= Title %>">
	<input type="hidden" name="dc1" value="<%= dc1 %>"> 
	<INPUT type="hidden" name="dc2" value="<%= dc2 %>"> 
	<input type="hidden" name="FileNo" value="<%= FileNo %>">
	<input type="hidden" name="FileType" value="<%= FileType %>">
	<input type="hidden" name="FileYear" value="<%= FileYear %>">
	<input type="hidden" name="SearchClassInfoId" value="<%= SearchClassInfoId %>">
	<input type="hidden" name="SearchOfContent" value="<%= SearchOfContent %>">
	<input type="hidden" name="page" value="<%= nPage %>">
	<input type="hidden" name="keyWords" value="<%= keyWords %>"> 
	<input type="hidden" name="pubURL" value="<%= pubURL %>"> 
	<input type="hidden" name="dispatchUnit" value="<%= dispatchUnit %>">
</form>
<%
	}
%>
<script>
	var sHitKeyword = "<%=views%>" || "";
	if(sHitKeyword){
		daubElementAll($('documentContainer'), sHitKeyword.split("+"));
	}
</script>
</body>
</html>
<%	
}
catch(Exception ex)
{
	out.println(ex);
}
finally
{
	if (trsrs!=null)
	{
		trsrs.close();
		trsrs = null;
	}
	if (conn!=null)
	{
		conn.close(); 
		conn = null;
	}
}
%>
