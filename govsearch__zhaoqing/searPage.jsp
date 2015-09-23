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
           format.applyPattern("yyyy'��'MM'��'dd'��'");
           strDate = format.format(birthday);
           return (String)strDate; 
	}
%>
<% 
	
	com.eprobiti.trs.TRSResultSet trsrs = null;
	TRSConnection conn = null;
	String searchword = "";
	String searchAgain="",preSWord="";
	String sword="",searchColumn="",searchYear="",SType="1";
	String viewDate="";
	String sHitKeyword = "",indexPa="",schn="",curpos="",sinfo="",surl=""; 

	String pubURL = getNullStringAndEncoding(request.getParameter("pubURL"));

	String sWhere = "";
	String order = "-PubDate,-fileNum"; 
	String swordtemp = "";
	
	String sPage = "";
	sPage = request.getParameter("page");
	if (sPage == null)
	{	
		sPage = "1";
	}	
	int nPage 		= Integer.parseInt(sPage);  // ��ǰҳ��
	int nPageCount 	= 0;						// ��ҳ��
	long num 		= 0;						// �����������
	int nPageSize 	= 20;						// ÿҳ�����
	//out.println(sWhere);
try
{
	long time1 =  System.currentTimeMillis();
	conn = new TRSConnection();
	//�������ݿ����� 
	conn.connect(serverName,serverPort,userName,userPass);
	String sWhere2 = sWhere; 

	if(!pubURL.equals(""))
	{
		sWhere2 = "docpuburl=('" + pubURL + "%')";  
	}
	//out.println(sWhere2);

	indexPa = getNullStringAndEncoding(request.getParameter("indexPa"));
	schn = getNullStringAndEncoding(request.getParameter("schn"));

	sinfo = getNullStringAndEncoding(request.getParameter("sinfo"));
	surl = getNullStringAndEncoding(request.getParameter("surl"));
	//out.println(surl);
	/*
	if(sinfo.equals("832"))
	{
		if(indexPa.equals("2"))
		{
			sWhere2+=" and parentId="+schn;
		}
		else if(indexPa.equals("3"))
		{
			sWhere2+=" and subcat="+schn;
		}
		database= "zjh";
	}
	else if(sinfo.equals("3300"))
	{
		if(indexPa.equals("2"))
		{
			sWhere2+=" and parentId=('"+schn+"') or themecat="+schn;
		}
		else if(indexPa.equals("3"))
		{
			sWhere2+=" and themecat=('%,"+schn+"') or themecat="+schn;
		}

		database= "zjh_themecat";
	}
	*/

	//System.out.println(sWhere2+" database "+database);
	String strview="";

	curpos = getNullStringAndEncoding(request.getParameter("curpos"));

	strview=curpos;

	//out.println("strview="+strview);

	trsrs = new TRSResultSet(conn); 
	trsrs.executeSelect(database, sWhere2, order, "", "", 0, TRSConstant.TCE_OFFSET|TRSConstant.TCM_LIFOSPARE, false); 
	trsrs.setReadOptions(TRSConstant.TCE_OFFSET,"DOCPUBURL;MetaDataId;PubDate;fileNum;subcat;idxID;publisher;keywords","");
	trsrs.setBufferSize(nPageSize,nPageSize);
	num = trsrs.getRecordCount();  
	nPageCount = (int)num/nPageSize + 1;
	long time2 =  System.currentTimeMillis();

%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>��������Ŀ¼</title> 
<script src="./js/com.trs.util/Common.js"></script>
<link href="./css/outlinetable.css" rel="stylesheet" type="text/css" />
<link href="./css/page.css" rel="stylesheet" type="text/css">

<SCRIPT LANGUAGE="JavaScript" src="./js/page.js"></SCRIPT>
<script language="javascript" src="./js/search.js" type="text/javascript"></script>
<!--�����ӵ�-->
<script language="javascript" src="./js/search-new.js" type="text/javascript"></script>
<script language="javascript" src="./js/search-color.js" type="text/javascript"></script>
<link href="./css/outlineTable_new.css" rel="stylesheet" type="text/css">
<style>
.no_object_found {
	FONT-SIZE: 14px; MARGIN: 4px; COLOR: black; FONT-STYLE: italic
}
</STYLE>
<SCRIPT language=JavaScript>
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
<STYLE>
.Tip {
	Z-INDEX: 999; WIDTH: 500px
	position:absolute; 
	font-size:12px;
	border:1px solid inner; 
	padding:5px;
	background-color:white; 
	filter:progid:DXImageTransform.Microsoft.dropshadow(OffX=4, OffY=4, Color='gray', Positive=true);
}
.Tip TABLE {
	FONT-SIZE: 12px; WIDTH: 100%
}
</STYLE>

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
 * �б��Ͽ����϶��е��޸�
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
	//��תҳ
	PageContext.PageNav.goSearch = function(){
		var ssra=parseInt(document.getElementById("pageSea").value);
		if(ssra>=1)
		{
			if(ssra<=PageContext["PageCount"]){

				if(ssra<=10)
				{
					var surl="<%=surl%>";
					var s=surl.split("/");
					var strTemp="",str="";
					for(var i=0;i<s.length-1;i++)
					{
						str=s[i]
						strTemp+="/"+str;
					}
					strTemp = "/zjhpublic"
					if((ssra-1)==0)
					{
						str="/pub"+strTemp+"/index_810.htm";
					}
					else
					{
						str="/pub"+strTemp+"/index_810_"+(ssra-1)+".htm";
					}
					window.location.href=str;
				}
				else
				{
					PageContext.PageNav.go(ssra,PageContext["PageCount"]);
				}
			}
			else
			{
				alert('�����ҳ�볬����ҳ�뷶Χ');
			}
		}
		else
		{
			alert('�����ҳ��̫С�����ܽ��з�ҳ');
		}
	};

	// ��д�����ҳ�������Ӧ����
	PageContext.PageNav.go =  function(_iPage,_maxPage)
	{
		if(_iPage>_maxPage){
			_iPage = _maxPage;
		}
		if(_iPage<=10)
		{
			var surl="<%=surl%>";
			var s=surl.split("/");
			var strTemp="",str="";
			for(var i=0;i<s.length-1;i++)
			{
				str=s[i]
				strTemp+="/"+str;
				//alert(i);
			}
			strTemp = "/zjhpublic/832"
			if((_iPage-1)==0)
			{
				str="/pub"+strTemp+"/index.htm";
			}
			else
			{
				str="/pub"+strTemp+"/index_"+(_iPage-1)+".htm";
			}
			window.location.href=str;
		}
		else
		{
			PageContext.params = {"CurrPage":_iPage};
			var aPageForm = document.getElementsByName('pageform');
			var pagefrom = aPageForm[aPageForm.length - 1];
			pagefrom.page.value = _iPage;
			pagefrom.submit();
		}
	};

//-->
</SCRIPT>
<STYLE type=text/css>
.no_object_found {
	FONT-SIZE: 14px; MARGIN: 4px; COLOR: black; FONT-STYLE: italic
}
.STYLE1 {
	font-family: "����", Arial;
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
	font-family: "����", Arial;
	font-size: 12px;
	line-height: 20px;
	color: #666666;
}
.STYLE3 {
	font-family: "����", Arial;
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
	font-family: "����", Arial;
	font-size: 12px;
	line-height: 20px;
	color: #5F5F5F;
	padding-left:5px;
	font-weight: bold;
}
</STYLE>
<SCRIPT LANGUAGE="JavaScript">
<!--
// ����ҳ�����Լ��Զ��������ڴ�С
//var m_nRecordCount = "${RECORD_COUNT}";
var m_nRecordCount = <%= num %>;

if(m_nRecordCount.length == 0){
	m_nRecordCount = 0;
}
//var m_nCurrPage = ${PAGE_INDEX};
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
	var minHeight = 750;
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
	document.trssearchform.submit();
}

function cancelSearch()
{  
    //ȥ�����Ӳ����е�searchType��searchValue����
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

function columSearch(searchcolumn)
{  
	document.trssearchform.method = 'post'; 
	document.trssearchform.searchColumn.value=searchcolumn;
	<%
		if(searchAgain.equals("1"))
		{
	%>
	document.trssearchform.searchAgain.checked = true;
	<%
		}
	%>
	document.trssearchform.submit();
}
</script>
</head>
<body style="overflow:hidden">

<DIV class=main id=DefaultMain>
	<FORM name=trssearchform action="simp_gov_list.jsp" method=post >
	<input type="hidden" name="SType" value="<%= SType %>">  
	<input type="hidden" name="preSWord" value="<%= sWhere %>">
	<input type="hidden" name="searchYear" value="<%= searchYear %>">
	<input type="hidden" name="pubURL" value="<%= pubURL %>"> 
	<DIV class=rowOfSearchNew><SPAN class=searchTipNew>&nbsp;&nbsp;��Ϣ������</SPAN> 
	<INPUT class=SearchOfInput id=sword size=45 name=sword value="<%=sword%>">  
	<select name="searchColumn" id="select">
	  <option value="all"<%= searchColumn.equals("all")?" selected":"" %>>ȫ��</option>
	  <option value="zhengwen"<%= searchColumn.equals("zhengwen")?" selected":"" %>>����</option>
	  <option value="biaoti"<%= searchColumn.equals("biaoti")?" selected":"" %>>����</option>
	  <option value="wenhao"<%= searchColumn.equals("wenhao")?" selected":"" %>>�ĺ�</option> 
	  <option value="fwdw"<%= searchColumn.equals("fwdw")?" selected":"" %>>��������</option> 	  
	</select>
	<SPAN id=searchBtn onclick="return executeSearch();" tabIndex=2 style="padding:4px 20px;"></SPAN>
	<a class=advanceSearch href="advsearch.jsp">�߼�����</a> 
	<SPAN class=advanceSearch onclick=cancelSearch();>������ҳ</SPAN>
	<%
	if(strview==null)	
	{
		out.println(" <INPUT id=searchAgain type=checkbox value='1' name=searchAgain>�ڽ��������");
	}
	%>
	</DIV>
</FORM>	
	<%
	if(strview!=null)	
	{
		out.println("<div class='rowOfCurrentPosition'>��ǰλ�ã�<span ID='currentPosition'>"+strview+"</span></div>");
	}
	else
	{
		out.println("<div class='rowOfCurrentPosition'>����������£�<span id='currentPosition'>"+sHitKeyword+"</span></div>");
	}
	%>
	<div class="content" id="content" style="overflow:auto;width:100%;">
		<div class="headOfTable" unselectable="on" id="headOfTable">
			<li class="xh" unselectable="on">���</li>
			<li class="mc" orderBy="TITLE" unselectable="on">����</li>
			<li class="sep" unselectable="on"></li>
			<li class="fbrq" orderBy="PubDate" unselectable="on">��������</li>
			<li class="sep" unselectable="on"></li>
			<li class="wh" unselectable="on">�ĺ�</li>
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
					String puburl = "";
					try
					{
						puburl=trsrs.getString("DOCPUBURL");
					}
					catch(Exception e)
					{
							puburl="#";
					} 
				%>
				<li class="mc">
					<div>
						<a href="<%= puburl %>?keywords=<%=sHitKeyword%>" target="_blank" onMouseOver="displayTip(<%= trsrs.getString("MetaDataId") %>);" onMouseOut="displayTip(<%= trsrs.getString("MetaDataId") %>, true);"><%= trsrs.getString("title","blue") %></a>
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
									<td width="50%"><B>�� �� ��:</B> <%= trsrs.getString("idxID") %></td>
									<td><B>�������:</B><%= getClassInfoName(trsrs.getString("subcat")) %></td>
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
									<td width="50%"><B>��������:</B> <%= trsrs.getString("publisher") %></td>
									<td><B>��������:</B><%= dates %></td>
								</tr>
							</table>				
						</td>
					</tr>
					<tr>
						<td colspan="2">
						<B>��&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;��:</B><%= trsrs.getString("title") %>
						</td>
					</tr>
					<tr>
						<td colspan="2">
							<table border=0 cellspacing=0 cellpadding=0>
								<tr>
									<td width="50%"><B>��&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;��:</B> <%= trsrs.getString("filenum") %></td>
									<td><B>�� �� ��:</B> <%= trsrs.getString("keywords") %></td>
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
					while(i<=nPageSize&&trsrs.moveNext());
				}
			%>
		
		</div>
	</div> 
	<DIV class="pageInfo list_navigator" id=list_navigator></DIV>
</DIV>
<form name="pageform" action="searPage.jsp" method=post >
	<input type="hidden" name="page" value="<%= nPage %>">
	<input type="hidden" name="pubURL" value="<%= pubURL %>">
	<input type="hidden" name="indexPa" value="<%= indexPa %>">
	<input type="hidden" name="schn" value="<%= schn %>">
	<input type="hidden" name="curpos" value="<%= curpos %>">
	<input type="hidden" name="sinfo" value="<%= sinfo %>">
	<input type="hidden" name="surl" value="<%= surl %>">
</form>
<script>
	var sHitKeyword = "<%=sHitKeyword%>" || "";
	if(sHitKeyword){
		daubElementAll($('documentContainer'), sHitKeyword.split("+"));
	}
</script>
</BODY>
</HTML>
<%
}
catch(Exception ex)
{
	out.println("<p align=center><br><br>�Բ����������������ԣ���ע�����ļ�����ƴд!</p>");
	out.println(ex);
	System.out.println(ex);
	//ex.printStackTrace();
}
finally
{
	if (trsrs!=null)
	{
		try
		{
			trsrs.close();
			trsrs = null;
		}
		catch(Exception ex)
		{}
	}
	if (conn!=null)
	{
		try
		{
			conn.close(); 
			conn = null;
		}
		catch(Exception ex)
		{}
	}
}
%>