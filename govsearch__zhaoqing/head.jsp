<%@page import="com.trs.classinfo.search.ClassInfosContext"%>  
<%@page import="com.trs.classinfo.search.ClassInfoNode"%>  
<%!
	String serverName	= "172.23.100.106";
	String serverPort	= "8888";
	String userName		= "system";
	String userPass		= "manager";
	String database		= "gkml";
	int classInfoRoot	= 1203; //需要进行分类法检索的分类法树根Id，如：主题分类的ID
	
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

	/**
	*根据分类的Id序列获取分类的描述序列
	*/
	private String getClassInfoName(String sClassInfoIds){
		if(sClassInfoIds == null || "".equals(sClassInfoIds.trim())){
			return "";
		}
		ClassInfosContext oClassInfosContext = ClassInfosContext.getInstance();
		String[] aClassInfoId = sClassInfoIds.split(";");
		StringBuffer sbClassInfoDesc = new StringBuffer(aClassInfoId.length * 10);
		for(int i = 0; i < aClassInfoId.length; i++){
			int nClassInfoId = Integer.parseInt(aClassInfoId[i]);
			ClassInfoNode oClassInfoNode = oClassInfosContext.getClassInfo(nClassInfoId);
			if(oClassInfoNode != null){
				sbClassInfoDesc.append(oClassInfoNode.getName());
				sbClassInfoDesc.append(";");
			}			
		}
		if(sbClassInfoDesc.length() > 0){
			sbClassInfoDesc.setLength(sbClassInfoDesc.length() - 1);
		}
		return sbClassInfoDesc.toString();
	}
	
%>
<%
	//request.setCharacterEncoding("UTF-8"); 
%>