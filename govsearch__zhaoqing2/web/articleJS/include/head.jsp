<%@page import="com.trs.classinfo.search.ClassInfosContext"%>  
<%@page import="com.trs.classinfo.search.ClassInfoNode"%>
<%@ page import="java.util.*" %>
<%!
	String serverName	= "localhost";
	String serverPort	= "8888";
	String userName		= "system";
	String userPass		= "manager";
	String database		= "zqgov2015_survey";
	
	public static final String SQL="DOCID2;DOCPUBURL;DOCCHANNEL;DocTitle;DocAuthor;DocRelTime;DocStatus;Total;Type;";
	
	public String getNullStringAndEncoding(String sIn)
	{
		String sTemp = sIn;
		if(sTemp == null)
		{
			sTemp = "";
		}
		else
		{
			try
			{
				sTemp = new String(sTemp.getBytes("iso8859_1"),"UTF-8");
			}
			catch(Exception ex){}
		}
		return sTemp;
	}
	
	public String[] dealKeywords(String sword,String searchColumn,String relation)
	{	
		String[] array = new String[2];
		String sTemp = "";
		String sHitKeyword = "";
		String swordtemp = ""; 
		if(sword.indexOf("*")<0&&sword.indexOf("+")<0&&sword.indexOf(")")<0&&sword.indexOf("(")<0&&sword.indexOf("-")<0)
		{
			StringTokenizer st = new StringTokenizer(sword," ");
			while (st.hasMoreTokens()) 
			{
				sTemp = st.nextToken(); 
				if(sTemp!=null&&!sTemp.trim().equals(""))
				{
					if(searchColumn.equals("wenhao"))
					{
						swordtemp += "'%"+ sTemp + "%' "+relation+" "; 
					}
					else
					{
						swordtemp += "'%"+ sTemp + "%' "+relation+" ";
					} 
					sHitKeyword += "+" + sTemp;
				}
			} 
			if(swordtemp.endsWith(" "+relation+" "))//以or结尾需要去掉
			{
				swordtemp = swordtemp.substring(0,swordtemp.length()-relation.length()-2);
				sHitKeyword = sHitKeyword.substring(1);
			} 
		}
		else
		{
			if(searchColumn.equals("fwdw")||searchColumn.equals("wenhao"))
			{
				swordtemp = "'%"+sword+"%'";
				sHitKeyword = sword;
			}
			else
			{
				swordtemp = "'%"+sword+"%'";
				sHitKeyword = sword;
			}
		}
		array[0] = swordtemp;
		array[1] = sHitKeyword;
		return array;
	} 

	public boolean isEmpty(String str) {
		return str == null || str.trim().length() == 0;
	}
	
	public String getLct(String _sUrl,String _lct)
	{
		String sTemp = _sUrl;
		if(sTemp == null)
		{
			sTemp = "";
		}
		else
		{
			try
			{
				int pos = sTemp.lastIndexOf("/");
				String sPrefix = sTemp.substring(0, pos + 1);
				sTemp = sPrefix + _lct;
			}
			catch(Exception ex){}
		}
		return sTemp;
	}
	
%>
