<%@ page import="com.eprobiti.trs.TRSConnection" %>
<%@ page import="com.eprobiti.trs.TRSResultSet" %>
<%@ page import="com.trs.client.TRSConstant" %>
<%@ include file="include/head.jsp"%>
<%@ include file="include/public_deal.jsp"%>
<%--
  Created by IntelliJ IDEA.
  User: fsr
  Date: 2015/9/22
  Time: 15:44
  To change this template use File | Settings | File Templates.
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
  String sOrderBy = "DocRelTime";
  String sWhere = "";
  //String iPageSize = map.get("PageSize").toString();
  int iPageIndex = 0;
  int iPageCount = 0;
  StringBuilder sRetJson = new StringBuilder();
  TRSResultSet trsRs = null;
  TRSConnection trsConn = null;

  try {
    trsConn = new TRSConnection();
    trsConn.connect(serverName, serverPort, userName, userPass);
    trsRs = new TRSResultSet(trsConn);
    trsRs.executeSelect(database, "", false);
    trsRs.setReadOptions(TRSConstant.TCE_OFFSET, SQL, "");
    trsRs.setBufferSize(14, 5);
    trsRs.moveFirst();
    sRetJson.append("[");
    do {
      sRetJson.append("{");
      //DocId2
      sRetJson.append("\"DocId2\":\"").append(trsRs.getString("DocId2")).append("\",");
      //DocTitle
      String content = trsRs.getString("DOCTITLE");
      content = content.replaceAll("\"", "%22");
      content = content.replaceAll("\"", "%27");
      sRetJson.append("\"DocTitle\":\"").append(content).append("\"");
      //DocAuthor
      sRetJson.append("\"DocRelTime\":\"").append(trsRs.getDate("DocRelTime").getTRSFormat()).append("\",");
      //DocStatus
      sRetJson.append("\"DocStatus\":\"").append(trsRs.getString("DocStatus")).append("\",");
      //Total
      sRetJson.append("\"Total\":\"").append(trsRs.getString("Total")).append("\",");
      //Type
      sRetJson.append("\"Type\":\"").append(trsRs.getString("Type")).append("\",");
      //DOCPUBURL
      sRetJson.append("\"DocPubUrl\":\"").append(trsRs.getString("DOCPUBURL")).append("\"");
      sRetJson.append("},");
    } while (trsRs.moveNext());
    String str = sRetJson.substring(0, sRetJson.length() - 1) + "]";
    out.print(str);

  }
  catch (Exception e) {
    response.sendRedirect(request.getContextPath() + "404.jsp?ex=" + e.toString());
  }
%>