<%@ page contentType="text/html;charset=UTF-8" pageEncoding="utf-8"%>

<%@page import="com.eprobiti.trs.*"%>
<%@page import="java.util.StringTokenizer"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@ page import="org.apache.log4j.Logger"%>
<%@ include file="head.jsp"%>
<%
	response.setHeader("Cache-Control", "no-cache"); //HTTP 1.1
	response.setHeader("Pragma", "no-cache"); //HTTP 1.0
	response.setDateHeader("Expires", -1);
	//prevents caching at the proxy server
	response.setDateHeader("max-age", 0);
	Logger _logger = Logger.getLogger("GOV_SEARCH");
%>
<%!public String dateFormat(String birthdayString) {
		java.util.Date birthday = new java.util.Date();
		try {
			java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat(
					"yyyy.MM.dd");
			birthday = sdf.parse(birthdayString);
		} catch (Exception e) {
			System.out.println("String to Date error");
		}
		String strDate = "";
		SimpleDateFormat format = new SimpleDateFormat();
		format.applyPattern("yyyy'年'MM'月'dd'日'");
		strDate = format.format(birthday);
		return (String) strDate;
	}

	public boolean isEmpty(String str) {
		return str == null || str.trim().length() == 0;
	}%>
<%
	com.eprobiti.trs.TRSResultSet trsrs = null;
	TRSConnection conn = null;
	String searchword = "";

	String sWhere = "", searchWordView = "";
	String dc1 = "", dc2 = "", order = "";
	String idxId = "", Title = "", publisher = "",content="";

	String[] array = null;

	idxId = request.getParameter("idxId");
	Title = request.getParameter("Title");
	dc1 = request.getParameter("dc1");
	dc2 = request.getParameter("dc2");
	publisher = request.getParameter("publisher");
	
	//String SearchOfContent = request.getParameter("SearchOfContent") ;
	
	_logger.debug("@Title=" + Title + " @publisher=" + publisher+ " @idx=" + idxId);

	order = "-PubDate,-fileNum";

	if (!isEmpty(idxId)) {
		//处理输入框空格

		String sIdxId = dealKeywords(idxId, "wenhao", "or")[0];

		if (searchword.equals("")) {
			searchword += "idxID=(" + sIdxId + ")";
		} else {
			searchword += " and idxID=(" + sIdxId + ")";
		}
		searchWordView += "+" + sIdxId;
	}

	if ((!isEmpty(dc1)) && (!isEmpty(dc2))) {
		if (searchword.equals("")) {
			searchword += "PubDate=('" + dc1 + "' to '" + dc2 + "')";
		} else {
			searchword += " and PubDate=('" + dc1 + "' to '" + dc2
					+ "')";
		}
		searchWordView += "+" + dc1 + "+" + dc2;
	} else if (!isEmpty(dc1)) {
		if (searchword.equals("")) {
			searchword += "PubDate>('" + dc1 + "')";
		} else {
			searchword += " and PubDate>('" + dc1 + "')";
		}
		searchWordView += ">" + dc1;
	} else if (!isEmpty(dc2)) {
		if (searchword.equals("")) {
			searchword += "PubDate<('" + dc2 + "')";
		} else {
			searchword += " and PubDate<('" + dc2 + "')";
		}
		searchWordView += "<" + dc2;
	}

	if (!isEmpty(Title)) {
		//处理输入框名称空格
		array = dealKeywords(Title, "Title", "and");
		String sTitle = array[0];
		if (searchword.equals("")) {
			searchword += "title=(" + sTitle + ")";
		} else {
			searchword += " and title=(" + sTitle + ")";
		}
		searchWordView += "+" + sTitle;
	}

	if (!isEmpty(publisher)) {
		String sPublisher = dealKeywords(publisher, "Publisher", "or")[0];
		if (!searchword.equals("")) {
			searchword += " and Publisher=(" + sPublisher + ")";
		} else {
			searchword += "Publisher=(" + sPublisher + ")";
		}
	}
	
	
	/*
	if(!isEmpty(SearchOfContent)){
		//处理正文输入框空格
		content = dealKeywords(SearchOfContent,"content","and")[0];
		//_logger.info("begin searchword===== "+searchword);
		if(!content.equals("") ){
			if (!searchword.equals("")) {
				searchword+=" and content=("+content+")"; 
				searchWordView+="+"+content;
			} else {
				searchword += "content=(" + content + ")";
			}
				
			
		}
	}*/
	
	//_logger.info("after searchword===== "+searchword);
		

	if (!searchword.equals("")) {
		sWhere = searchword;
	}

	if (searchword == null) {
		searchword = "";
	}
	if (database == null) {
		database = "";
	}

	//快速分类切换

	String sPage = "";
	sPage = request.getParameter("page");
	if (sPage == null) {
		sPage = "1";
	}
	int nPage = Integer.parseInt(sPage); // 当前页面
	int nPageCount = 0; // 总页数
	long num = 0; // 检索结果总数
	int nPageSize = 20;

	if (!isEmpty(sWhere)) {

		try {
			conn = new TRSConnection();
			//建立数据库连接
			conn.connect(serverName, serverPort, userName, userPass);
			trsrs = new TRSResultSet(conn);

			_logger.info("@SQL-where=" + sWhere);

			String sWhere2 = sWhere;
			trsrs.executeSelect(database, sWhere2, order, "", "", 0,
					TRSConstant.TCE_OFFSET | TRSConstant.TCM_LIFOSPARE,
					false);
			trsrs.setReadOptions(
					TRSConstant.TCE_OFFSET,
					"MetaDataId;DOCPUBURL;title;PubDate;fileNum;idxID;publisher;keywords",
					"");
			trsrs.setBufferSize(nPageSize, nPageSize);
			num = trsrs.getRecordCount();
			nPageCount = (int) num / nPageSize + 1;

			String views = "";
			if (!Title.equals("")) {
				views += Title;
			}
			views = views.replace(' ', '+');

			out.clear();

			if (num > 0) {
				int i = 1;
				trsrs.moveTo(0, (nPage - 1) * nPageSize);
%>
<table border="0" cellspacing="0" cellpadding="0">
	<tr>
		<th scope="col" width="6%" style="border-left: none;">序号</th>
		<th scope="col">信息名称</th>
		<th scope="col" width="15%">发文时间</th>
		<th scope="col" width="20%">文号</th>
	</tr>
	<%
		do {
						String puburl = "";
						try {
							puburl = trsrs.getString("DOCPUBURL");
						} catch (Exception e) {
							puburl = "#";
						}
						String dates = "";
						dates = trsrs.getString("PubDate");
						if (dates != null && dates.length() > 1) {
							dates = dateFormat(dates);
						}
	%>
	<tr>
		<td style="border-left: none;"><%=(nPage - 1) * nPageSize + i%> &nbsp;</td>
		<td class="td01"><a href="<%=puburl%>?keywords=<%=views%>"
			target="_blank" data-tip><%=trsrs.getStringWithCutsize("title", 64,
									"red")%></a>
			<div class="tooltip" style="display: none;">
				<table border=0 cellspacing=0 cellpadding=0 style="width: 100%;">
					<tbody>
						<tr>
							<td width="50%"><B>索引号:</B> <%=trsrs.getString("idxID")%></td>
							<td><B>分类:</B></td>
						</tr>
						<tr>
							<td width="50%"><B>发布机构:</B> <%=trsrs.getString("publisher")%></td>
							<td><B>发文日期:</B> <%=dates%></td>
						</tr>
						<tr>
							<td colspan="2"><B>名称:</B> <%=trsrs.getString("title")%></td>
						</tr>
					</tbody>
				</table>
			</div></td>
		<td><%=dates%></td>
		<td><%=trsrs.getString("fileNum")%></td>
	</tr>
	<%
		i++;
					} while (trsrs.moveNext() && i <= nPageSize);
	%>
</table>
<p class="page01" id="list_navigator"></p>
<script language="javascript">
	var m_nRecordCount =
<%=num%>
	;

	if (m_nRecordCount.length == 0) {
		m_nRecordCount = 0;
	}
	var m_nCurrPage =
<%=nPage - 1%>
	;
	var m_nPageSize = 20;

	PageContext["RecordNum"] = m_nRecordCount;
	PageContext.params["CurrPage"] = m_nCurrPage + 1;
	PageContext["PageSize"] = m_nPageSize;
	PageContext.drawNavigator();

	// 覆写点击分页代码的响应函数
	PageContext.PageNav.go = function(_iPage, _maxPage) {
		if (_iPage > _maxPage) {
			_iPage = _maxPage;
		}
		PageContext.params = {
			"CurrPage" : _iPage
		};
		var sURL = GovSearchURL + "gov_search.jsp";
		ajaxSearchList(sURL, _iPage);
	};
</script>
<%
	} else {
%>
<table border="0" cellspacing="0" cellpadding="0">
	<tr>
		<th scope="col" width="6%" style="border-left: none;">序号</th>
		<th scope="col">信息名称</th>
		<th scope="col" width="15%">发文时间</th>
		<th scope="col" width="20%">文号</th>
	</tr>
	<tr>
		<td colspan="3" style="border: none;">没有找到符合条件的记录</td>
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
<table border="0" cellspacing="0" cellpadding="0">
	<tr>
		<th scope="col" width="6%" style="border-left: none;">序号</th>
		<th scope="col">信息名称</th>
		<th scope="col" width="15%">发文时间</th>
		<th scope="col" width="20%">文号</th>
	</tr>
	<tr>
		<td colspan="3" style="border: none;">没有找到符合条件的记录</td>
	</tr>
</table>

<%
	}
%>