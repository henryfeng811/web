<%@ page contentType="text/html;charset=UTF-8" pageEncoding="GBK" %> 
<%@page import="com.eprobiti.trs.*,java.util.StringTokenizer,java.text.SimpleDateFormat"%>     
<%@ include file="head.jsp" %>
<%try{%>
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

	oCurrTip.style.display = "";
	oCurrTip.style.visibility = "hidden";
	
	m_oPreTip = oCurrTip;
	var x = event.x;// + document.body.scrollLeft;
    var y = event.y;// + document.body.scrollTop;
	oCurrTip.style.left = x ;//+ 365;	
	if(document.body.offsetHeight <= (y + 90 + oCurrTip.offsetHeight)){
		oCurrTip.style.top = Math.max(y + 90 - oCurrTip.offsetHeight, 0);
	}else{
		oCurrTip.style.top = y + 90;
	}

	oCurrTip.style.visibility = 'visible';    
}
//-->
</SCRIPT>
<style>
.Tip {
	width:500;
	z-index:999;
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
	width:460px;
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

<SCRIPT LANGUAGE="JavaScript" src="./js/page.js"></SCRIPT>
<SCRIPT LANGUAGE="JavaScript">
 <!--
	var m_sPageName = "index";
	var m_sPageExt = "htm";

	// ��д�����ҳ�������Ӧ����
	PageContext.PageNav.go =  function(_iPage,_maxPage){
		if(_iPage>_maxPage){
			_iPage = _maxPage;
		}
		PageContext.params = {"CurrPage":_iPage};
		var sURL = "";
		if(_iPage == 1){
			sURL = m_sPageName + "." + m_sPageExt;
		}else{
			sURL = m_sPageName + "_" + (_iPage-1) + "." + m_sPageExt;
		}
		//alert("to: " + sURL);
		window.location.href = sURL;        
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
<SCRIPT LANGUAGE="JavaScript">
<!--
// ����ҳ�����Լ��Զ��������ڴ�С
var m_nRecordCount = "1298";
if(m_nRecordCount.length == 0){
	m_nRecordCount = 0;
}
var m_nCurrPage = 0;
var m_nPageSize = 20;

window.onload = function(){
    PageContext["RecordNum"] = m_nRecordCount;
	PageContext.params["CurrPage"] = m_nCurrPage + 1;
	PageContext["PageSize"] = m_nPageSize;
	PageContext.drawNavigator();
	

	if(m_nRecordCount == 0){
		var oContent = document.getElementById("documentContainer");
		var pDivElements = oContent.getElementsByTagName("DIV");
		if(pDivElements != null && pDivElements.length<=0){
			document.getElementById("documentContainer").innerHTML = document.getElementById("divNoObjectFound").innerHTML;
		}
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

<script>
function resultPrePage(){
	window.location.href = "/wcm/govsearch/gov_list.jsp";
}
function isDate(str)
{ 
	var reg = /^((((1[6-9]|[2-9]\d)\d{2})\.(0?[13578]|1[02])\.(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})\.(0?[13456789]|1[012])\.(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})\.0?2\.(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))\.0?2-29-))$/
	if (reg.test(str)) return true;
	return false;
}
function ADsearchSE()
{
	var dxs1=document.getElementById('idStartDate').value;
	var dxs2=document.getElementById('idEndDate').value;

	if((dxs2!="")&&(dxs1==""))
	{
		alert('��ѡ��ʼ����!');
		return false; 
	}
	if(dxs1!="")
	{
		if(!isDate(dxs1))
		{
			alert("���ڸ�ʽ���ԣ��밴��2000.1.12��ʽ����");
			return false;
		} 
		var arrJHRQ = dxs1.split('.'); //ת�ɳ����飬�ֱ�Ϊ�꣬�£��գ���ͬ 
		
		var dateJHRQ=new Date(parseInt(arrJHRQ[0]),parseInt(arrJHRQ[1])-1,parseInt(arrJHRQ[2]),0,0,0); //�½����ڶ���
		var dateJHWCSJ=new Date(2008,0,1,0,0,0);
		if (dateJHRQ.getTime()<dateJHWCSJ.getTime()) 
		{                                
			alert('��ʼʱ�䲻������2008.1.1!');
			document.getElementById('idStartDate').value = '';
			return false; 
		}
	}
	if(dxs2!="")
	{
		if(!isDate(dxs2))
		{
			alert("���ڸ�ʽ���ԣ��밴��2000.1.12��ʽ����");
			return false;
		}
		var arrJHRQ = dxs2.split('.'); //ת�ɳ����飬�ֱ�Ϊ�꣬�£��գ���ͬ 
		var dateJHRQ=new Date(parseInt(arrJHRQ[0]),parseInt(arrJHRQ[1])-1,parseInt(arrJHRQ[2]),0,0,0); //�½����ڶ���
		<%
			java.util.Calendar now = java.util.Calendar.getInstance();
		%>
		var dateJHWCSJ=new Date(<%= now.get(java.util.Calendar.YEAR) %>,<%= now.get(java.util.Calendar.MONTH) %>,<%= now.get(java.util.Calendar.DAY_OF_MONTH) %>,0,0,0);
		if (dateJHRQ.getTime()>dateJHWCSJ.getTime()) 
		{                                
			alert('����ʱ�䲻�ܴ��ڵ�ǰʱ��!');
			document.getElementById('idStartDate').value = '';
			document.getElementById('idEndDate').value = '';
			return false; 
		}
	}
	if((dxs2!="")&&(dxs1!=""))
	{
		var arrJHRQ=dxs1.split('.'); //ת�ɳ����飬�ֱ�Ϊ�꣬�£��գ���ͬ
		var arrJHWCSJ=dxs2.split('.');
		var dateJHRQ=new Date(parseInt(arrJHRQ[0]),parseInt(arrJHRQ[1])-1,parseInt(arrJHRQ[2]),0,0,0); //�½����ڶ���
		var dateJHWCSJ=new Date(parseInt(arrJHWCSJ[0]),parseInt(arrJHWCSJ[1])-1,parseInt(arrJHWCSJ[2]),0,0,0);
		if (dateJHRQ.getTime()>dateJHWCSJ.getTime()) 
		{                                
			alert('��������С�ڿ�ʼ������!');
			document.getElementById('idStartDate').value = '';
			document.getElementById('idEndDate').value = '';
			return false; 
		}
	} 
	document.AdvSMe.method = 'post'; 
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
</script>

</head>

<body style="overflow:hidden">
<div class="main" id="advanceSearchContainer">		
	<form id="AdvSearchContainerOfContent" action="./gov_list_ad.jsp" name="AdvSearchContainerOfContent" onsubmit="return ADsearch();">
		<div class="rowOfCurrentPosition"><b>ȫ����ϼ���</b>(������Կո����)</div>
		<input type="hidden" name="SType" value="2">
		<input type="hidden" name="AdvSearch" value="1">
		<table width="100%" border="0" align="center" cellpadding="2" cellspacing="0">
		<tbody>
		<tr bgcolor="#CBDCED">  
		<td width="15%" rowspan="3" style="padding-left:5px;"><br><b>����ȫ����</b></td>
		<td width="25%">��������<b>ȫ��</b>�Ĺؼ���</td>
		<td width="60%">
		<input type="text" class="SearchOfInput" maxlength=100 name="AllSearchWords" size="65" >
		</td>
		</tr>

		<tr bgcolor="#CBDCED"> 
		<td width="29%">��������<b>����һ��</b>�ؼ���</td>
		<td width="56%"><input type="text" class="SearchOfInput" size="65" name="OneOfSearchWords" maxlength=100 value=""></td>
		</tr>

		<tr bgcolor="#CBDCED"> 
		<td width="29%"><b>������</b>����ȫ���ؼ���</td>
		<td width="56%"><input type="text" class="SearchOfInput" size="65" name="NotSearchWords" maxlength=100 value=""></td>
		</tr>

		
		<tr bgcolor="#ffffff">
		<td style="text-align:center;" colspan="3">
		<input value="����" type="submit" style="margin-left:30px;" >   
		<input value="���ص���һҳ" type="button" style="margin-left:10px;" onclick="cancelSearch();">   
		</td>
		</tr>
		</tbody> 
		</table>
		<input type="hidden" name="pubURL" value="">
	</form>

	<form id="AdvSMe" name="AdvSMe" onsubmit="return ADsearchSE();" action="gov_list_ad.jsp">
		<input type="hidden" name="pubURL" value="">
		<div class="rowOfCurrentPosition"><b>Ԫ�����������</b></div>
		<input type="hidden" name="SType" value="3">
		<table width="100%" border="0" align="center" cellpadding="2" cellspacing="0">
		<tbody>            

		<tr bgcolor="#ffffff"> 
		<td width="15%" style="padding-left:5px;"><b>�� �� ��</b></td>
		<td width="29%">�ĵ��������Ű���ָ������</td>
		<td width="56%"><input type="text" size="45"  class="SearchOfInput" name="idxId" maxlength=100></td>
		</tr>

		<tr bgcolor="#ffffff"> 
		<td width="15%" style="padding-left:5px;"><b>��������</b></td>
		<td width="29%">�ĵ����������а���ָ�������ɴ�</td>
		<td width="56%"><input type="text" class="SearchOfInput" size="45" name="Title" maxlength=100></td>
		</tr>

		<tr bgcolor="#ffffff"> 
		<td width="15%" style="padding-left:5px;"><b>��������</b></td>
		<td width="29%">���İ���ָ������</td>
		<td width="56%"><input type="text" class="SearchOfInput" size="45" name="SearchOfContent" maxlength=100></td>
		</tr>

		<tr> 
		<td width="15%" style="padding-left:5px;"><b>��������</b></td>
		<td width="29%">�ĵ����������޶���</td>
		<td width="56%"> 
		<select name="PubDateSel" onchange="pubDateSelChangeNew(this);">
			<option value="0" selected="selected">ȫ��ʱ��</option>
			<!--SCRIPT LANGUAGE="JavaScript">
				var now = new Date();
				for(var i=2008;i<=now.getFullYear();i++)
				{
					document.writeln("<option value="+i+">"+i+"</option>");
				}
			</SCRIPT-->
			<option value="2008">2008</option>
			<option value="10">ָ����Χ</option>
		</select> 
		<DIV id="time1" style="DISPLAY: none">��ʼ����:
			<INPUT id=idStartDate name=dc1 style="width:70px">
			<A hideFocus onClick="pickDate(idStartDate)" href="javascript:void(0)">
			<IMG height=22 alt="" src="./images/calbtn.gif" width=34 align=absMiddle border=0 name=popcal></A> 
			&nbsp;&nbsp;��������:
			<INPUT id=idEndDate size=9 name=dc2 style="width:70px">
			<A hideFocus onClick="pickDate(idEndDate)" href="javascript:void(0)">
			<IMG height=22 alt="" src="./images/calbtn.gif" width=34 align=absMiddle border=0 name=popcal></A> 
		</DIV>
		</td> 
		</tr>

		<tr bgcolor="#ffffff"> 
		<td width="15%" style="padding-left:5px;"><b>�ġ�����</b></td>
		<td width="29%">�ĵ����ĺ�Ϊ</td>
		<td width="56%">
			<span id="Type1">
			<input type="text" name="fileNum" id="fileNum">
			</span>��				
		</td>
		</tr>

		<tr bgcolor="#ffffff"> 
		<td width="15%" style="padding-left:5px;"><b>�� �� ��</b></td>
		<td width="29%">�ĵ�����ʰ���ָ���Ĵ�(���������Կո�ֿ�)</td>
		<td width="56%"><input type="text" size="45" class="SearchOfInput" name="keyWords" id="keyWords" maxlength=100 value="">&nbsp;<!--<a href="#" onclick="selectKwd();">��ѡ��</a>--></td>
		</tr>

		<tr bgcolor="#ffffff">
		<td style="padding-left:5px;"><b>�������</b></td>
		<td>�ĵ������������</td>
		<td>
		  <select name="SearchClassInfoId" style="font-size:9pt" size="1">
			<option value="0">��ѡ��</option>
		<%
			ClassInfosContext oContext = ClassInfosContext.getInstance();
			try{
				ClassInfoNode oRootNode = oContext.getClassInfo(classInfoRoot);
				java.util.List oChildNodes = oRootNode.getChild();
				for(int i = 0, length = oChildNodes.size(); i < length; i++){
					ClassInfoNode oTreeNode = (ClassInfoNode)oChildNodes.get(i);
		%>
			<option value="<%=oTreeNode.getId()%>" ><%=oTreeNode.getName()%></option>
		<%
				}
			}catch(Exception eInner){
				System.out.println("����û���ҵ���������[" + classInfoRoot + "]��Ӧ�ķ���");
				eInner.printStackTrace();
			}
		%>
		  </select>
		</td>
		</tr>
		</tbody> 
</table>
<div id="fwdw" style="DISPLAY: none">
	<table width="100%" border="0" align="center" cellpadding="2" cellspacing="0">
	<tbody>  
		<tr bgcolor="#ffffff">
		<td width="15%" style="padding-left:5px;"><b>���ĵ�λ</b></td>
		<td width="29%">�ĵ��ķ��ĵ�λ��</td>
		<td width="56%">
		  <select name="dispatchUnit" style="font-size:9pt" size="1">
			<option value="0">��ѡ��</option>
			<option value="3761">֤���</option>
			<option value="3738">�칫��</option>
			<option value="3739">���в�</option>
			<option value="3740">���ڹ�˾��	</option>
			<option value="3741">�г���</option>
			<option value="3742">������</option>
			<option value="3743">���հ�</option>
			<option value="3744">���в�</option>
			<option value="3745">����</option>
			<option value="3746">�ڻ���</option>
			<option value="3747">�����</option>
			<option value="3748">���ɲ�</option>
			<option value="3749">��������ί</option>
			<option value="3750">��Ʋ�</option>
			<option value="3751">���ʲ�</option>
			<option value="3752">�˽̲�</option>
			<option value="3753">Э������Ͷ���߽�����</option>
			<option value="3754">��ί������</option>
			<option value="3755">����</option>
			<option value="3756">���ص�ί</option>
			<option value="3757">�о�����</option>
			<option value="3758">��Ϣ����</option>
			<option value="3759">��������</option>
		  </select>
		</td>
		</tr>
	</tbody> 
</table>
</div>
<table width="100%" border="0" align="center" cellpadding="2" cellspacing="0" height=50>
	<tbody>  
		<tr bgcolor="#ffffff">
		<td style="text-align:center;" colspan="3">
		<input value="����" type="submit" style="margin-left:30px;">   
		<input value="���ص���һҳ" type="button" style="margin-left:10px;" onclick="cancelSearch();">   
		</td>
		</tr>
</tbody> 
</table>
	</form>
</div> 
</body>
</html>
<script>
	var pubURL = top.getPubURL();
	document.AdvSearchContainerOfContent.pubURL.value=pubURL;
	document.AdvSMe.pubURL.value=pubURL;
</script>
<%
	}catch(Exception e){
		e.printStackTrace();		
	}
%>