<%@ page contentType="text/html;charset=UTF-8" pageEncoding="GBK"%>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.io.OutputStreamWriter" %>
<%@ page import="org.dom4j.Document" %>
<%@ page import="org.dom4j.DocumentHelper" %>
<%@ page import="org.dom4j.Element" %>
<%@ page import="com.trs.components.metadata.definition.ClassInfo" %>
<%@ page import="com.trs.components.metadata.definition.ClassInfos" %>
<%@ page import="com.trs.infra.persistent.WCMFilter" %>
<%@ page import="com.trs.infra.common.WCMException" %>
<%@ page import="com.trs.infra.util.CMyString" %>

<%@include file="../include/public_server.jsp"%>

<%
	out.clear();
	String sSrcFile = System.currentTimeMillis() + ".xml";
	String sObjectIds = request.getParameter("ObjectIds");
	ClassInfos oClassInfos = getClassInfos(loginUser, sObjectIds);
	Document oClassInfoDoc = getXMLDocument(oClassInfos);
	oClassInfoDoc.write(out);
%>

<%!
	/**
	*��ȡ��ǰ��Χ�ķ��෨����
	*/
	private ClassInfos getClassInfos(User oCurrUser, String sObjectIds) throws Throwable{
		// Ȩ��У��
        if (!oCurrUser.isAdministrator()) {
            throw new WCMException("�ǹ���Աû��Ȩ��ִ�з��෨�ĵ�������");
        }

        // ��ȡ��������
        WCMFilter filter = new WCMFilter();
        StringBuffer sbWhere = new StringBuffer();
        if (!CMyString.isEmpty(sObjectIds)) {
            sbWhere.append("ClassInfoId in(");
            String[] aObjectId = sObjectIds.split(",");
            for (int i = 0; i < aObjectId.length; i++) {
                sbWhere.append("?,");
                filter.addSearchValues(aObjectId[i]);
            }
            sbWhere.setCharAt(sbWhere.length() - 1, ')');
            filter.setWhere(sbWhere.toString());
        }

        return ClassInfos.openWCMObjs(oCurrUser, filter);
	}

	/**
	*�Է��෨��������xml��Document
	*/
	private Document getXMLDocument(ClassInfos oClassInfos){
        Document oClassInfoDoc = DocumentHelper.createDocument();
        Element rootElement = oClassInfoDoc.addElement("CLASSINFOS");
        for (int i = 0, nSize = oClassInfos.size(); i < nSize; i++) {
            ClassInfo oClassInfo = (ClassInfo) oClassInfos.getAt(i);
            if (oClassInfo == null)
                continue;
			rootElement.addText("\n\t");
            Element element = rootElement.addElement("CLASSINFO");
            Map properties = oClassInfo.getAllProperty();
            for (Iterator iterator = properties.entrySet().iterator(); iterator
                    .hasNext();) {
                Map.Entry entry = (Map.Entry) iterator.next();
                String sPropertyName = (String) entry.getKey();
                sPropertyName = sPropertyName.toUpperCase();
                String sPropertyValue = entry.getValue().toString();
				element.addText("\n\t\t");
                element.addElement(sPropertyName).addCDATA(sPropertyValue);
            }
			element.addText("\n\t");
        }
		return oClassInfoDoc;
	}
%>
