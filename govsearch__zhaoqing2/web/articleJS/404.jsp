<%--
  Created by IntelliJ IDEA.
  User: fsr
  Date: 2015/9/23
  Time: 10:11
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title></title>
</head>
<body>
<h1>页面出错</h1>
<%
  out.println(request.getParameter("ex"));
%>
</body>
</html>
