<%@ page import="com.eprobiti.trs.TRSConnection" %>
<%@ page import="com.eprobiti.trs.TRSResultSet" %>
<%@ page import="com.trs.client.TRSConstant" %>
<%@ page import="java.text.MessageFormat" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ include file="include/head.jsp"%>
<%@ include file="include/public_deal.jsp"%>
<%--
  Created by IntelliJ IDEA.
  User: fsr
  Date: 2015/9/22
  Time: 15:44
  To change this template use File | Settings | File Templates.
  return JSon {"PageCount": "[NUM]","Class" : "[News]}"
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%
  response.setHeader("Cache-Control", "no-cache"); //HTTP 1.1
  response.setHeader("Pragma", "no-cache"); //HTTP 1.0
  response.setDateHeader("Expires", -1);
//prevents caching at the proxy server
  response.setDateHeader("max-age", 0);
  //Logger _logger = Logger.getLogger("PUBLIC_SEARCH");

  out.clear();
%>
<%
  String sRetJSon = "{\"PageCount\": \"[NUM]\",\"results\" : [News]}";
  String sOrderBy = "DocRelTime";
  String sWhere = "";
  String sPageSize = (String)map.get("PageSize");
  String sPageIndex = (String)map.get("PageIndex");
  int iPageCount = 0;
  StringBuilder eJsNews = new StringBuilder();
  int iPageSize = 0;
  int iPageIndex = 0;
  int iCurrent = 0;
  long num = 0;
  if (sPageSize != null) {
    try {
      iPageSize = Integer.parseInt(sPageSize);
    }
    catch (Exception ex) {
    }
  }
  if (sPageIndex != null) {
    try {
      iPageIndex = Integer.parseInt(sPageIndex);
    }
    catch (Exception ex) {
    }
  }
  String json = "";

  TRSResultSet trsRs = null;
  TRSConnection trsConn = new TRSConnection();
  try {
    trsConn.connect(serverName, serverPort, userName, userPass);
    trsRs = new TRSResultSet(trsConn);
//    trsRs.executeSelect(database, "", false);
    trsRs.executeSelect(database, sWhere, sOrderBy, "", "", 0,
            TRSConstant.TCE_OFFSET | TRSConstant.TCM_LIFOSPARE,
            false);
    trsRs.setReadOptions(TRSConstant.TCE_OFFSET, SQL, "");
    trsRs.setBufferSize(14, 5);
    num = trsRs.getRecordCount();
  }
  catch (Exception ex){
    response.sendRedirect(request.getContextPath() + "404.jsp?ex=" + ex.toString());
  }

    if (num > 0) {
      int i = 1;
      iPageCount = (int) num / iPageSize + 1;
      iCurrent = iPageIndex * iPageSize;
      trsRs.moveTo(0, iCurrent);
      sRetJSon = sRetJSon.replace("[NUM]", Integer.toString(iPageCount));
      eJsNews.append("[");
      try {
        do {
          eJsNews.append("{");
          //DocId2
          eJsNews.append("\"id2\":\"").append(trsRs.getString("DocId2")).append("\",");
          //DocTitle
          String content = trsRs.getString("DOCTITLE");
          content = content.replaceAll("\"", "%22");
          content = content.replaceAll("'", "%27");
          eJsNews.append("\"title\":\"").append(content).append("\",");
          //ChnlDesc
          content = trsRs.getString("ChnlDesc");
          content = content.replaceAll("\"", "%22");
          content = content.replaceAll("'", "%27");
          eJsNews.append("\"description\":\"").append(content).append("\",");
          //DocAuthor
          eJsNews.append("\"author\":\"").append(trsRs.getString("DocAuthor")).append("\",");
          //DocRelTime
          com.eprobiti.trs.Date relTime = trsRs.getDate("DocRelTime");
          eJsNews.append("\"relTime\":\"").append(relTime.getYear()).append("-").append(relTime.getMonth()).append("-").append(relTime.getDate()).append("\",");
          //DocStatus
          eJsNews.append("\"status\":\"").append(trsRs.getString("DocStatus")).append("\",");
          //Total
          eJsNews.append("\"total\":\"").append(trsRs.getString("Total")).append("\",");
          //Type
          eJsNews.append("\"type\":\"").append(trsRs.getString("Type")).append("\",");
          //DOCPUBURL
          content = trsRs.getString("DOCPUBURL");
          content = content.replaceAll("\"", "%22");
          content = content.replaceAll("'", "%27");
          eJsNews.append("\"Url\":\"").append(content).append("\"");
          eJsNews.append("},");
          i++;
        } while (trsRs.moveNext() && i <= iPageSize);
        json = eJsNews.substring(0, eJsNews.length() - 1) + "]";
      } catch (Exception e) {
        response.sendRedirect(request.getContextPath() + "404.jsp?ex=" + e.toString());
      }
    }
  sRetJSon =sRetJSon.replace("[News]", json );
          out.print(sRetJSon);
%>
