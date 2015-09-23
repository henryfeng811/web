<%@page import="java.util.*"%>
<%@ page import="java.net.URLDecoder"%>

<%
//1.public 
	
	Map map = new HashMap();
    Enumeration paramNames = request.getParameterNames();
    boolean isDebug=false;//调试开关
    
   while (paramNames.hasMoreElements()) {
     String paramName = (String) paramNames.nextElement();
	
     String[] paramValues = request.getParameterValues(paramName);
     if (paramValues.length == 1) {
       String paramValue = paramValues[0];
       paramValue = URLDecoder.decode(paramValue, "utf-8");
       if(isDebug){
       	System.out.println("@@参数：" + paramName + "=" + paramValue);
       }

       map.put(paramName, paramValue);
     }else{
   	  out.println("传参出现问题，处理失败。");
   	  return;
     }
   }

%>


