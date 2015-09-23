<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>

<%@page import="com.eprobiti.trs.*"%>
<%@page import="java.util.StringTokenizer"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@ page import="org.apache.log4j.Logger"%>
<%@ include file="./include/head.jsp"%>
<%@ include file="./include/public_deal.jsp"%>   
<%
response.setHeader("Cache-Control", "no-cache"); //HTTP 1.1
response.setHeader("Pragma", "no-cache"); //HTTP 1.0
response.setDateHeader("Expires", -1);
//prevents caching at the proxy server
response.setDateHeader("max-age", 0);
Logger _logger = Logger.getLogger("PUBLIC_SEARCH");

out.clear();
 
 com.eprobiti.trs.TRSResultSet trsrs = null;
	TRSConnection conn = null;
	String searchword = "";
	
	//String sWhere = "",sOrder="-CRTIME,-DOCPUBTIME";
	String sWhere = "",sOrder="DOCID2";
	
	String sChannel="",sZQLB="",sXMMC="";
	sChannel=(String)map.get("channel");
	sZQLB=(String)map.get("zqlb");
	sXMMC=(String)map.get("xmmc");
	
	String sUrlParams="";
	if (!isEmpty(sXMMC)) {
		//���������ո�


		if (searchword.equals("")) {
			searchword += "doctitle=(%" + sXMMC + "%)";
			sUrlParams+="?xmmc="+sXMMC;
		} else {
			searchword += " and xmmc=(%" + sXMMC + "%)";
			sUrlParams+="&xmmc="+sXMMC;
		}
		
	}
	
	if (!isEmpty(sZQLB)) {
		//���������ո�


		if (searchword.equals("")) {
			searchword += "zqlb=(" + sZQLB + ")";
			sUrlParams+="?zqlb="+sZQLB;
		} else {
			searchword += " and zqlb=(" + sZQLB + ")";
			sUrlParams+="&zqlb="+sZQLB;
		}
		
	}
	
	if (!isEmpty(sChannel)) {
		//���������ո�
		
		if(!sChannel.equals("ALL")){
			if (searchword.equals("")) {
				searchword += "docChannel=(" + sChannel + ")";
				sUrlParams+="?channel="+sChannel;
			} else {
				searchword += " and docChannel=(" + sChannel + ")";
				sUrlParams+="&channel="+sChannel;
			}
		}
		
	}
	
	
	
	if (!searchword.equals("")) {
		sWhere = searchword;
	}

	if (searchword == null) {
		searchword = "";
	}
	if (database == null) {
		database = "";
	}
	
	String sPage = "";
	sPage = (String)map.get("page");
	
	if (sPage == null) {
		sPage = "1";
	}
	
	int nPage = Integer.parseInt(sPage); // ��ǰҳ��
	int nPageCount = 0; // ��ҳ��
	long num = 0; // �����������
	int nPageSize = 10;


 %>  
    
<!DOCTYPE html>
<html style="background: #bbe1f6;">
<head>
    <meta charset="UTF-8">
    <title>����������Ȩ������</title>
    <link rel="stylesheet" href="images/qlgk_style.css"/>
    <link rel="stylesheet" href="images/jquery-ui/jquery-ui.css"/>
    <script type="text/javascript" src="images/page.js"></script>
	<script src="images/js/libs/jquery-1.9.1.js"></script>
	<script src="images/jquery-ui/jquery-ui.js"></script>
	 <!-- Anything Slider -->
	<link rel="stylesheet" href="images/anythingslider/css/anythingslider.css">
	<script src="images/anythingslider/js/jquery.anythingslider.js"></script>
   <script type="text/javascript">
   var TAB="<%=sZQLB%>";
   var GovSearchURL = "/govsearch/";
   </script>
	<!--��ӻص�����-->
   <script type="text/javascript">
	$(document).ready(function(){
	//���Ƚ�#back-to-top����
	$("#back-to-top").hide();
	//����������λ�ô��ھඥ��100��������ʱ����ת���ӳ��֣�������ʧ
	$(function () {
		$(window).scroll(function(){
		if ($(window).scrollTop()>100){
		$("#back-to-top").fadeIn(500);
		}
		else
		{
		$("#back-to-top").fadeOut(500);
		}
		});
		//�������ת���Ӻ󣬻ص�ҳ�涥��λ��
		$("#back-to-top").click(function(){
		$('body,html').animate({scrollTop:0},100);
		return false;
		});
		});
		});
  </script>
  <style type="text/css">
  #back-to-top{
		position:fixed;
		bottom:5%;
		left:90%;
	}
	#back-to-top a{
		text-align:center;
		text-decoration:none;
		color:#d1d1d1;
		display:block;
		width:50px;
		/*ʹ��CSS3�е�transition���Ը���ת�����е�������ӽ���Ч��*/
		-moz-transition:color 1s; 
		-webkit-transition:color 1s;
		-o-transition:color 1s;
	}
	#back-to-top a:hover{
		color:#979797;
	}
	#back-to-top a span{
		display:block;
		height:50px;
		width:50px;
		background:url(images/top.png) no-repeat center center;
		margin-bottom:5px;
		-moz-transition:background 1s;
		-webkit-transition:background 1s;
		-o-transition:background 1s;
	}
	#back-to-top a:hover span{
		background:url(images/top.png) no-repeat center center;
	}
	.lct_click{
		cursor:pointer;
	}
    </style>

</head>
<body>
<div id="content">
<div class="top-tit">
            <span class="dis-in-b float-right">
                <a href="http://www.zhaoqing.gov.cn/pub/zqsyzqlgk/xzcfclq.html">�����������ɲ���Ȩ��׼</a>
                <a href="http://www.zhaoqing.gov.cn/pub/zqsyzqlgk/">������ҳ</a>
            </span>
    �������б�������ְȨ����
</div>
<div class="con-main">
<!--������ʼ-->
<div class="search">
    <form name="publicSearch" id="publicSearch" type="post" action="./search.jsp">
            <strong>����ְȨ��������</strong>
            <label>ʵʩ��λ</label>
             <select id="channel" name="channel">
                <option selected="selected" style="color:black;" value="ALL" >ȫ��</option>
                 
                  <option style="color:black;" value="12950" > �з�չ�ĸ��</option>
                 
                  <option style="color:black;" value="12951" > �о�����Ϣ����</option>
                 
                  <option style="color:black;" value="12952" > ��������Դ��ᱣ�Ͼ�</option>
                 
                  <option style="color:black;" value="12953" > �й�����Դ��</option>
                 
                  <option style="color:black;" value="12954" > �л���������</option>
                 
                  <option style="color:black;" value="12955" > ��ס�����罨���</option>
                 
                  <option style="color:black;" value="12956" > �н�ͨ�����</option>
                 
                  <option style="color:black;" value="12957" > �������</option>
                 
                  <option style="color:black;" value="12958" > ���Ĺ��¾�</option>
                 
                  <option style="color:black;" value="12959" > �а�ȫ��ܾ�</option>

                
            </select>
            <label>ְȨ���</label>
            <select id="zqlb" name="zqlb">
               <option selected="selected" style="color:black;" value="1,2" >��������</option>

				<option style="color:black;" value="3">��������</option>
				<option style="color:black;" value="4">����ǿ�� </option>
				<option style="color:black;" value="5">�������� </option>
				<option style="color:black;" value="6">��������</option>
				<option style="color:black;" value="7">�������</option>
				<option style="color:black;" value="8">����ָ�� </option>
				<option style="color:black;" value="9">����ȷ��</option>
				<option style="color:black;" value="10">����</option>  
            </select>
            <label>�ؼ�������</label>
            <input name="xmmc" id="xmmc" type="text" placeholder="�ؼ���" class="sr01"/>
            <input type="submit" id="button_submit" class="btn" value="�顡ѯ"/>
</form>
        </div>

<!--��������-->
<ul class="gl-tab mt10">

    <li class="cur" onclick="SearchType('1,2','<%=sChannel%>','<%=sXMMC%>');return false;">��������</li>
    <li onclick="SearchType('3','<%=sChannel%>','<%=sXMMC%>');return false;">��������</li>
    <li onclick="SearchType('4','<%=sChannel%>','<%=sXMMC%>');return false;">����ǿ��</li>
    <li onclick="SearchType('5','<%=sChannel%>','<%=sXMMC%>');return false;">��������</li>
    <li onclick="SearchType('6','<%=sChannel%>','<%=sXMMC%>');return false;">��������</li>
    <li onclick="SearchType('7','<%=sChannel%>','<%=sXMMC%>');return false;">�������</li>
    <li onclick="SearchType('8','<%=sChannel%>','<%=sXMMC%>');return false;">����ָ��</li>
    <li onclick="SearchType('9','<%=sChannel%>','<%=sXMMC%>');return false;">����ȷ��</li>
    <li onclick="SearchType('10','<%=sChannel%>','<%=sXMMC%>');return false;">����</li>
</ul>
<div class="gl-main">
<%
if (!isEmpty(sWhere)) {

	try {
		conn = new TRSConnection();
		//�������ݿ�����
		conn.connect(serverName, serverPort, userName, userPass);
		trsrs = new TRSResultSet(conn);

		_logger.info("@SQL-where=" + sWhere);
		//System.out.println("@SQL-where=" + sWhere);
		String sWhere2 = sWhere;
		trsrs.executeSelect(database, sWhere2, sOrder, "", "", 0,
				TRSConstant.TCE_OFFSET | TRSConstant.TCM_LIFOSPARE,
				false);
		
		
		trsrs.setReadOptions(
				TRSConstant.TCE_OFFSET,
				SQL,
				"");
		trsrs.setBufferSize(nPageSize, nPageSize);
		num = trsrs.getRecordCount();
		nPageCount = (int) num / nPageSize + 1;

		

		

		if (num > 0) {
			int i = 1;
			trsrs.moveTo(0, (nPage - 1) * nPageSize);
		String ssdw="",zqlb="",ssyj="",lct="",sAbsLct="",sAbsLct2="",sAbsLct3="",sAbsLct4="",sAbsLct5="";
		
%>
    <table>
<%
	if(sZQLB.equals("3")){
%>
	<tr>
	<th>ʵʩ��λ</th><th>ְȨ���</th><th>���账����Υ����Ϊ</th>
    <th>��������</th><th>ʵʩ����</th><th>����ͼ</th><th>��ע</th>
    </tr>
	
<%
do {
		
			    zqlb = "��������";
				
				lct=sAbsLct=sAbsLct2=sAbsLct3=sAbsLct4=sAbsLct5="";
				try {
					lct = trsrs.getString("lct");
					if(!isEmpty(lct)){
	        			sAbsLct=getLct(trsrs.getString("DOCPUBURL"),lct);
	        		}
					if(!isEmpty(trsrs.getString("lct2"))){
					sAbsLct2=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct2"));
					}
					if(!isEmpty(trsrs.getString("lct3"))){
						sAbsLct3=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct3"));
					}
					if(!isEmpty(trsrs.getString("lct4"))){
						sAbsLct4=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct4"));
					}
					if(!isEmpty(trsrs.getString("lct5"))){
						sAbsLct5=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct5"));
					}
				} catch (Exception e) {
					lct = "--";
				}
			  
%>
<tr>
    <td width="10%"><%=trsrs.getString("ssdw")%></td>
    <td width="10%"><%=zqlb %></td>
    <td width="13%"><%=trsrs.getString("kycfdwfxw") %></td>
    <td width="13%"><%=trsrs.getString("cfzl") %></td>
    <td class="ssyj" width="40%"><%=trsrs.getString("ssyj") %></td>
    <td width="4%" class="lct_tb" style="text-algin:center;">
   
    <%if(!isEmpty(lct)) {%>
	<span id="<%=i%>" class="lct_click"><img src="./images/qlgk_gl_ico01.png"></span><div class="lct_div" id="lct_<%=i%>" style="display:none" title='����ͼ'><ul id="slider_<%=i%>" class="slider01"><li><img src="<%=sAbsLct%>"/></li>
		<%if(!isEmpty(trsrs.getString("lct2"))){%>		 
				 <li><img src="<%=sAbsLct2%>"/></li>
		<%}%>	
		<%if(!isEmpty(trsrs.getString("lct3"))){%>		 
				 <li><img src="<%=sAbsLct3%>"/></li>
		<%}%>	
		<%if(!isEmpty(trsrs.getString("lct4"))){%>		 
				 <li><img src="<%=sAbsLct4%>"/></li>
		<%}%> 
		<%if(!isEmpty(trsrs.getString("lct5"))){%>		 
				 <li><img src="<%=sAbsLct5%>"/></li>
		<%}%>
				 </ul></div>
						
<%}else{ %> 
--
<%}%> 
    </td>
    <td ><%=trsrs.getString("bz")%></td>
</tr>
<%
i++;
} while (trsrs.moveNext() && i <= nPageSize);
	
	}else if(sZQLB.equals("4")){ %>
<tr>
	<th>ʵʩ��λ</th> <th>ְȨ���</th><th>����ǿ�ƶ���</th>
	<th>����ǿ�ƴ�ʩ</th><th>ʵʩ����</th><th>����ͼ</th><th>��ע</th>
</tr>
<%
do {
		zqlb = "����ǿ��";
		lct=sAbsLct=sAbsLct2=sAbsLct3=sAbsLct4=sAbsLct5="";
		try {
			lct = trsrs.getString("lct");
			if(!isEmpty(lct)){
    			sAbsLct=getLct(trsrs.getString("DOCPUBURL"),lct);
    		}
			if(!isEmpty(trsrs.getString("lct2"))){
			sAbsLct2=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct2"));
			}
			if(!isEmpty(trsrs.getString("lct3"))){
				sAbsLct3=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct3"));
			}
			if(!isEmpty(trsrs.getString("lct4"))){
				sAbsLct4=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct4"));
			}
			if(!isEmpty(trsrs.getString("lct5"))){
				sAbsLct5=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct5"));
			}
		} catch (Exception e) {
			lct = "--";
		}
	   
%>
<tr>
	<td width="10%"><%=trsrs.getString("ssdw")%></td>
    <td width="10%"><%=zqlb %></td>
    <td width="13%"><%=trsrs.getString("xzqzdx") %></td>
    <td width="13%"><%=trsrs.getString("xzqzcs") %></td>
    <td class="ssyj" width="40%"><%=trsrs.getString("ssyj") %></td>
    <td width="4%" class="lct_tb" style="text-align: center;">
   <%if(!isEmpty(lct)) {%>
	
	<span id="<%=i%>" class="lct_click"><img src="./images/qlgk_gl_ico01.png"></span><div class="lct_div" id="lct_<%=i%>" style="display:none" title='����ͼ'><ul id="slider_<%=i%>" class="slider01"><li><img src="<%=sAbsLct%>"/></li>
	<%if(!isEmpty(trsrs.getString("lct2"))){%>		 
			 <li><img src="<%=sAbsLct2%>"/></li>
	<%}%>	
	<%if(!isEmpty(trsrs.getString("lct3"))){%>		 
			 <li><img src="<%=sAbsLct3%>"/></li>
	<%}%>	
	<%if(!isEmpty(trsrs.getString("lct4"))){%>		 
			 <li><img src="<%=sAbsLct4%>"/></li>
	<%}%> 
	<%if(!isEmpty(trsrs.getString("lct5"))){%>		 
			 <li><img src="<%=sAbsLct5%>"/></li>
	<%}%>
			 </ul></div>
								
		
<%}else{ %> 
--
<%}%>  
    </td>
    <td ><%=trsrs.getString("bz")%></td>
</tr>
<%
i++;
} while (trsrs.moveNext() && i <= nPageSize);



}else if(sZQLB.equals("5")){
%>
<tr>
	<th>ʵʩ��λ</th> <th>ְȨ���</th> <th>������Ŀ</th> <th>���ձ�׼</th>
    <th>ʵʩ����</th><th>����ͼ</th><th>��ע</th>
</tr>
<%
do {
	
	   	zqlb = "��������";
		lct=sAbsLct=sAbsLct2=sAbsLct3=sAbsLct4=sAbsLct5="";
		try {
			lct = trsrs.getString("lct");
			if(!isEmpty(lct)){
    			sAbsLct=getLct(trsrs.getString("DOCPUBURL"),lct);
    		}
			if(!isEmpty(trsrs.getString("lct2"))){
				sAbsLct2=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct2"));
				
			}
			if(!isEmpty(trsrs.getString("lct3"))){
				sAbsLct3=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct3"));
			}
			if(!isEmpty(trsrs.getString("lct4"))){
				sAbsLct4=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct4"));
			}
			if(!isEmpty(trsrs.getString("lct5"))){
				sAbsLct5=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct5"));
			}
		} catch (Exception e) {
			lct = "--";
		}
	  
%>
<tr>
	<td width="10%"><%=trsrs.getString("ssdw")%></td>
    <td width="10%"><%=zqlb %></td>
    <td width="13%"><%=trsrs.getString("xmmc") %></td>
    <td width="13%"><%=trsrs.getString("zsbz")%></td>
    <td class="ssyj" width="40%"><%=trsrs.getString("ssyj") %></td>
    <td width="4%" class="lct_tb" style="text-align: center;">
    <%if(!isEmpty(lct)) {%>
		
	<span id="<%=i%>" class="lct_click"><img src="./images/qlgk_gl_ico01.png"></span><div class="lct_div" id="lct_<%=i%>" style="display:none" title='����ͼ'><ul id="slider_<%=i%>" class="slider01"><li><img src="<%=sAbsLct%>"/></li>
<%if(!isEmpty(trsrs.getString("lct2"))){%>		 
		 <li><img src="<%=sAbsLct2%>"/></li>
<%}%>	
<%if(!isEmpty(trsrs.getString("lct3"))){%>		 
		 <li><img src="<%=sAbsLct3%>"/></li>
<%}%>	
<%if(!isEmpty(trsrs.getString("lct4"))){%>		 
		 <li><img src="<%=sAbsLct4%>"/></li>
<%}%> 
<%if(!isEmpty(trsrs.getString("lct5"))){%>		 
		 <li><img src="<%=sAbsLct5%>"/></li>
<%}%>
		 </ul></div>
							
	
	
	
<%}else{ %> 
--
<%}%>  
    </td>
    <td ><%=trsrs.getString("bz")%></td>
</tr>
<%
i++;
} while (trsrs.moveNext() && i <= nPageSize);

}else if(sZQLB.equals("6")||sZQLB.equals("7")||sZQLB.equals("8")||sZQLB.equals("9")||sZQLB.equals("10")) {%>
<tr>
<th>ʵʩ��λ</th><th>ְȨ���</th><th>��Ŀ����</th>
<th>ʵʩ����</th><th>����ͼ</th><th>��ע</th>
</tr>

<%
do {
	if(sZQLB.equals("6")){
		zqlb = "��������";
	}else if(sZQLB.equals("7")){
		zqlb = "�������";
	}else if(sZQLB.equals("8")){
		zqlb = "����ָ��";
	}else if(sZQLB.equals("9")){
		zqlb = "����ȷ��";
	}else if(sZQLB.equals("10")){
		zqlb = "����";
	}
		
	lct=sAbsLct=sAbsLct2=sAbsLct3=sAbsLct4=sAbsLct5="";
	try {
		lct = trsrs.getString("lct");
		if(!isEmpty(lct)){
			sAbsLct=getLct(trsrs.getString("DOCPUBURL"),lct);
		}
		if(!isEmpty(trsrs.getString("lct2"))){
			sAbsLct2=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct2"));
		}
		if(!isEmpty(trsrs.getString("lct3"))){
			sAbsLct3=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct3"));
		}
		if(!isEmpty(trsrs.getString("lct4"))){
			sAbsLct4=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct4"));
		}
		if(!isEmpty(trsrs.getString("lct5"))){
			sAbsLct5=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct5"));
		}
	} catch (Exception e) {
		lct = "--";
	}
    
%>
<tr>
<td width="10%"><%=trsrs.getString("ssdw")%></td>
<td width="10%"><%=zqlb %></td>
<td width="20%"><%=trsrs.getString("xmmc") %></td>
<td class="ssyj" width="40%"><div style="width:370px;"><%=trsrs.getString("ssyj") %></div></td>
<td width="4%" class="lct_tb" style="text-align: center;">
<%if(!isEmpty(sAbsLct)) {%>
	<span id="<%=i%>" class="lct_click"><img src="./images/qlgk_gl_ico01.png"></span><div class="lct_div" id="lct_<%=i%>" style="display:none" title='����ͼ'><ul id="slider_<%=i%>" class="slider01"><li><img src="<%=sAbsLct%>"/></li>
<%if(!isEmpty(trsrs.getString("lct2"))){%>		 
		 <li><img src="<%=sAbsLct2%>"/></li>
<%}%>	
<%if(!isEmpty(trsrs.getString("lct3"))){%>		 
		 <li><img src="<%=sAbsLct3%>"/></li>
<%}%>	
<%if(!isEmpty(trsrs.getString("lct4"))){%>		 
		 <li><img src="<%=sAbsLct4%>"/></li>
<%}%> 
<%if(!isEmpty(trsrs.getString("lct5"))){%>		 
		 <li><img src="<%=sAbsLct5%>"/></li>
<%}%>
		 </ul></div>
							
			
<%}else{ %> 
--
<%}%>  
</td>
<td ><%=trsrs.getString("bz")%></td>
</tr>
<%
i++;
} while (trsrs.moveNext() && i <= nPageSize);


}else { %>
        <tr>
            <th>ʵʩ��λ</th><th>ְȨ���</th><th>��Ŀ����</th>
            <th>��������</th><th>ʵʩ����</th><th>����ʱ��(������)</th>
            <th>��ŵʱ��(������)</th><th>����ͼ</th> <th>��ע</th>
        </tr>

<%
        do {
        
   	
        	if(trsrs.getString("zqlb").equals("1")){
        		zqlb = "�������";
        	}else if(trsrs.getString("zqlb").equals("2")){
        		zqlb = "���������";
        	}
        	
        	lct=sAbsLct=sAbsLct2=sAbsLct3=sAbsLct4=sAbsLct5="";
        	try {
        		lct = trsrs.getString("lct");
        		if(!isEmpty(lct)){
        			sAbsLct=getLct(trsrs.getString("DOCPUBURL"),lct);
        		}
				if(!isEmpty(trsrs.getString("lct2"))){
        			sAbsLct2=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct2"));
        		}
        		if(!isEmpty(trsrs.getString("lct3"))){
        			sAbsLct3=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct3"));
        		}
				if(!isEmpty(trsrs.getString("lct4"))){
        			sAbsLct4=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct4"));
        		}
				if(!isEmpty(trsrs.getString("lct5"))){
        			sAbsLct5=getLct(trsrs.getString("DOCPUBURL"),trsrs.getString("lct5"));
        		}
        	} catch (Exception e) {
        		lct = "--";
        	}
          
%>
<tr>
<td width="8%"><%=trsrs.getString("ssdw")%></td>
<td width="8%"><%=zqlb %></td>
<td width="10%"><%=trsrs.getString("xmmc") %></td>
<td width="10%"><%=trsrs.getString("zxmc") %></td>
<td class="ssyj" width="40%"><%=trsrs.getString("ssyj") %></td>
<td width="6%"><%=trsrs.getString("FDSX") %></td>
<td width="6%"><%=trsrs.getString("CNSX") %></td>
<td width="5%" class="lct_tb" style="text-align: center;">
<%if(!isEmpty(sAbsLct)) {%>
		
		<span id="<%=i%>" class="lct_click"><img src="./images/qlgk_gl_ico01.png"></span><div class="lct_div" id="lct_<%=i%>" style="display:none" title='����ͼ'><ul id="slider_<%=i%>" class="slider01"><li><img src="<%=sAbsLct%>"/></li>
<%if(!isEmpty(trsrs.getString("lct2"))){%>		 
		 <li><img src="<%=sAbsLct2%>"/></li>
<%}%>	
<%if(!isEmpty(trsrs.getString("lct3"))){%>		 
		 <li><img src="<%=sAbsLct3%>"/></li>
<%}%>	
<%if(!isEmpty(trsrs.getString("lct4"))){%>		 
		 <li><img src="<%=sAbsLct4%>"/></li>
<%}%> 
<%if(!isEmpty(trsrs.getString("lct5"))){%>		 
		 <li><img src="<%=sAbsLct5%>"/></li>
<%}%>
		 </ul></div>
							
							

<%}else{ %> 
--
<%}%>   
</td>
<td ><%=trsrs.getString("bz")%></td>
</tr>
<%
i++;
} while (trsrs.moveNext() && i <= nPageSize);
        
        
        
}
		
%>
</table>



    <!--��ҳ������ʼ-->
    <div class="page">
        <p class="page01" id="list_navigator"></p>
<script language="javascript">
	var m_nRecordCount =
<%=num%>
	;

	if (m_nRecordCount.length == 0) {
		m_nRecordCount = 0;
	}
	var m_nCurrPage =<%=nPage - 1%>
	;
	var m_nPageSize = 10;

	PageContext["RecordNum"] = m_nRecordCount;
	PageContext.params["CurrPage"] = m_nCurrPage + 1;
	PageContext["PageSize"] = m_nPageSize;
	PageContext.drawNavigator();

	// ��д�����ҳ�������Ӧ����
	PageContext.PageNav.go = function(_iPage, _maxPage) {
		if (_iPage > _maxPage) {
			_iPage = _maxPage;
		}
		PageContext.params = {
			"CurrPage" : _iPage
		};
		
		
		var sURL =GovSearchURL + "otherProjects/publicSearch/search.jsp"+"<%=sUrlParams%>";
		SearchList(sURL, _iPage);
	};
	function SearchList(_sUrl, _iPage){
	
        window.location.href=_sUrl+"&page=" + _iPage;
    };
	$(function(){
		ajaxZQLBCount();
	});
	
	function ajaxZQLBCount(){
   var sUrl="../../../govsearch/staticsPowers.do" ;
   
   var params="";

   <%if(!isEmpty(sChannel)){%>
	params={channel:"<%=sChannel%>"};

   <%}%>
   $.ajax({
		type: "POST",
		url: sUrl,
		dataType:"html",
		data:params,
		timeout : 15000,
		success: function(datas){
		
		
		
		var dataObj=eval("("+datas+")");
		
		$.each(dataObj, function(idx, obj) {
		
			if(obj.className=="1+2"){
			$(".gl-tab li").eq(0).append("("+obj.classNum+")");
			}
			
			if(obj.className=="3"||obj.className=="4"||obj.className=="5"||obj.className=="6"||obj.className=="7"||obj.className=="8"||obj.className=="9"||obj.className=="10"){
			  $(".gl-tab li").eq(obj.className-2).append("("+obj.classNum+")");
			}
		  
			
			
		});
			$(".gl-tab").find("li").each(function(e){
				
                if($(this).text().indexOf("(")==-1){
				$(this).append("(0)");
			}
				
            });
		},
		error:function(){
			alert("�������ݳ���!");
			$(".gl-tab").find("li").each(function(){
                $(this).append("(0)");
            });
		}
		
	});
   
   
}

</script>
    </div>
    <!--��ҳ��������-->
<%
	} else {
%>
<table>
        <tr>
            <th>ʵʩ��λ</th>
            <th>ְȨ���</th>
            <th>��Ŀ����</th>
            <th>��������</th>
            <th>ʵʩ����</th>
            <th>����ͼ</th>
            <th>��ע</th>
        </tr>
       <tr>
       <td colspan="7">�������ݣ�</td>
       
       </tr>
</table>
<%
	}
		} catch (Exception ex) {
			_logger.error(ex);

		} finally {
			if (trsrs != null) {
				trsrs.close();
				trsrs = null;
			}
			if (conn != null) {
				conn.close();
				conn = null;
			}
		}
	} else {
%>
<table>
        <tr>
            <th>ʵʩ��λ</th>
            <th>ְȨ���</th>
            <th>��Ŀ����</th>
            <th>��������</th>
            <th>ʵʩ����</th>
            <th>����ͼ</th>
            <th>��ע</th>
        </tr>
       <tr>
       <td colspan="7">��������</td>
       </tr>
</table>
<%
	}
%>   
</div>
<!--������������-->
</div>
<!--�ص�������ʼ -->
<p id="back-to-top" style="display: block;"><a href="#top"><span></span>�ص�����</a></p>
<!--�ص��������� -->
</div>
<!--�ײ���ʼ-->
<div id="footer">
    <div class="main">
        <p>���죺���������������� ����֧�֣���������Ϣ����</p>
    </div>
</div>
<!--�ײ�����-->
<script type="text/javascript">
$(document).ready(function(){
	
	var _lct_span = $(".lct_click");
	_lct_span.click(function(){
		var sId = $(this).attr("id");

			$( "#lct_"+sId ).dialog({
			  resizable: true,
			  width:1000,
			  height:900,
			  modal: true});
			  
			$('#slider_'+ sId).anythingSlider();
		
	 });
	
	
	if(TAB!=="1,2"){
		var mk=parseInt(TAB);
		if(mk==1||mk==2){
			$(".gl-tab li").removeClass("cur");
			$(".gl-tab li").eq(0).addClass("cur");
		}else{
			$(".gl-tab li").removeClass("cur");
			$(".gl-tab li").eq(mk-2).addClass("cur");
		}
		
		
	}
	$("#button_submit").click(function () {
		
		if($("#xmmc").length==0){
			//alert("�ؼ��ֲ���Ϊ�գ�");
			return false;
		}
		 
			var oForm=document.getElementById("publicSearch");

			oForm.xmmc.value = encodeURIComponent(oForm.xmmc.value);
				
			$("#publicSearch").submit();

		});

			
	


});
function SearchType(_num,_channel,_xmmc){
		var urlParams="";
		if(_channel!="null"){
			urlParams+="&channel="+_channel;
		}
		if(_xmmc!="null"){
			//alert(_xmmc);
			_xmmc=encodeURI(encodeURI(_xmmc));
			urlParams+="&xmmc="+_xmmc;
		}
		window.location.href="./search.jsp?zqlb="+_num+urlParams;
	  
};


</script>
</body>
</html>