var isMozilla = /Mozilla\/5\.0/.test(navigator.userAgent);
if (isMozilla)
   document.write('<script type="text/javascript" src="../js/mozillaForIE.js"></sc' + 'ript>');

//HTML Outline对象
var m_objSrcContent = null;
//HTML Column对象
var m_arSingleRec = null;
//获取分页参数
var m_nPageSize   = 8; //常量每页条数
var m_nRecSize   = 1; //常量每行条数


//设定XML的检索方式
//DocumentsDataSrc.XMLDocument.setProperty("SelectionLanguage", "XPath"); 
//检索所有的节点
var m_arNodes = null;

//记录数
var m_nRecCount   = 0;
//总页数
var m_nPageCount = 0; 


//页码文字输出区
var CP = null; //document.getElementById("CP"); 

var DocumentsDataSrc = null;

function initDocumentsDataSrc(){
	if (window.ActiveXObject)
	{
		DocumentsDataSrc = new ActiveXObject("Microsoft.XMLDOM");
		DocumentsDataSrc.setProperty("SelectionLanguage", "XPath"); 
		DocumentsDataSrc.async=false;
		DocumentsDataSrc.load("data.xml");
		initPage()
	}
	// code for Mozilla, etc.
	else if (document.implementation &&document.implementation.createDocument)
	{
		DocumentsDataSrc= document.implementation.createDocument("","",null);
		DocumentsDataSrc.load("data.xml");
		//DocumentsDataSrc.setProperty("SelectionLanguage", "XPath"); 
		DocumentsDataSrc.onload=initPage;
	}
	else
	{
		alert('您的系统不支持XML浏览！');
	}
}
var m_sXMLPath = "//D";
//初始化各种分页变量
function initPage(){
	CP = document.getElementById("CP"); 

	if(DocumentsDataSrc == null){
		initDocumentsDataSrc();
		return;
	}

	m_objSrcContent = document.getElementById("OutlineContent");
	if(m_objSrcContent == null){
		alert( "没有定义Outline区域！分页代码发生异常！" );
		return false;
	}

	m_arSingleRec = document.getElementsByName("ColumnContent");
	if(m_arSingleRec == null){
		alert( "没有定义Column区域！分页代码发生异常！" );
		//return false;
	}
	//获取分页参数
	var nPageSize   = 8; //常量每页条数
	var sPageSize = m_objSrcContent.getAttribute("PageSize");
	if(sPageSize && !isNaN(sPageSize)){
		nPageSize = parseInt(sPageSize);
	}
	m_nRecSize   = 1; //常量每行条数
	if(m_arSingleRec != null && m_arSingleRec.length)m_nRecSize = m_arSingleRec.length;

	loadXMLData(m_sXMLPath, nPageSize);
}

function loadXMLData(_sPath, _nPageSize){
	m_nPageSize = _nPageSize;
	var sPath = _sPath;
	//提取数据	
	m_arNodes = DocumentsDataSrc.selectNodes(sPath);	
	m_nRecCount   = m_arNodes.length;
	
	
	m_nPageCount = 0; //计算总页数
	if(m_nRecCount%m_nPageSize>0)
	{
		m_nPageCount = (m_nRecCount - (m_nRecCount%m_nPageSize))/m_nPageSize +1;
	}
	else
	{
		m_nPageCount = m_nRecCount/m_nPageSize; //取得当前页对象并
	}

	//默认定位到第一页
	toPage(1);

	//将标志位设回
	m_bFirst  = false;
}

//===========getCurrPage(_currentPage)规范跳转页码函数;_currentPage 跳转页码输入值===
function getCurrPage(_currentPage){
	var cPage =1;
	if( _currentPage<=0 || _currentPage=="")
		cPage =1;
	else if(_currentPage>m_nPageCount)
		cPage = m_nPageCount;
	else
		cPage = _currentPage;
	return cPage;
}

//===============goto()直接跳转函数=============================================
function goto(){
	toPage(CP.value);
}

//===============toPage(_pageNo)跳转函数;_pageNo要跳转的页号====================
function toPage(_pageNo){
	
	if(m_nRecCount <= 0)return false;
	//删除原有代码
	//removeAllOldNodes();
	
	var cP = getCurrPage(_pageNo);
	var startPos = cP*m_nPageSize - m_nPageSize;
	var endPos = 0;
	if(cP*m_nPageSize>m_nRecCount)
		endPos=m_nRecCount;
	else
		endPos = cP*m_nPageSize;

	var nOutlineCount = 0;
	alert(endPos);
	for(var i=startPos; i<endPos; i++){
		var nTemp = createItemHTML(i, endPos, nOutlineCount);
		if(nTemp <= 0)break;
		i = i + nTemp;		
		i--;
		nOutlineCount++;
	}

	//异常剩下的元素
	var nMaxCount = Math.max(m_arOutLine.length, m_nPageSize);
	for( ;!m_bFirst && nOutlineCount<nMaxCount; nOutlineCount++)
	{
		if(m_arOutLine.length <= nOutlineCount)break;
		m_arOutLine[nOutlineCount].style.display = "none";
	}
	CP.value = cP;
	showPageLineNum();
	
	//设置为已经有模板
	m_bFirst  = false;
}

//===========showPageLineNum()页面显示状态条函数==================
function showPageLineNum(){
	var pL = "";
	if(CP.value!=1){
		pL+="<a href=# onclick=\"toPage(1)\">首页</a>&nbsp;";
		pL+="<a href=# onclick=\"toPage("+(CP.value-1)+")\">上一页</a>&nbsp;";
	}
	else{
		pL+="首页&nbsp;";
		pL+="上一页&nbsp;";
	}
	for(var pageN=1;pageN<=m_nPageCount;pageN++){
		if(pageN==CP.value){
		pL+="<font color=red><b>"+pageN+"</b></font>&nbsp;";
		}
		else
		pL += "<a href=# onclick=\"toPage("+pageN+")\">"+pageN+"</a>&nbsp;";
	}
	if(CP.value<m_nPageCount){
		pL+="<a href=# onclick=\"toPage("+((CP.value)*1+1)+")\">下一页</a>&nbsp;";
		pL+="<a href=# onclick=\"toPage("+m_nPageCount+")\">尾页</a>&nbsp;";
	}
	else{
		pL+="下一页&nbsp;";
		pL+="尾页&nbsp;";
	}
	pL += "共 "+m_nPageCount+" 页&nbsp;共"+m_nRecCount+"条记录";
	var showPageLine = document.getElementsByName("pl");
	for(var pls=0;pls<showPageLine.length;pls++){
	showPageLine[pls].innerHTML = pL;}
}

//删除原有的节点
function removeAllOldNodes(){
	var arTemp = document.getElementsByName("OutlineClone");
	if(!arTemp)return false;

	if(arTemp.length){
		for(var i=arTemp.length-1; i>=0; i--){
			arTemp[i].removeNode(true);
		}
	}else{
		arTemp.removeNode(true);
	}
	return true;
}

var m_bFirst    = true;
var m_arOutLine = new Array();

function getChildXMLNodeByTagName(_xmlNode, _sTagName){
	var sTagName = _sTagName.toUpperCase();
	var arChildren = _xmlNode.childNodes;
	var nCount = arChildren.length;
	for(var i=0; i<nCount; i++){
		var node = arChildren[i];
		if(node.nodeName.toUpperCase() == sTagName){
			return node;		
		}
	}
}

function getNodeText(_node){
	if(_node.childNodes.length==0){
		return _node.nodeValue;
	}

	return getNodeText(_node.childNodes[0]);
}

/**
  * 复制分页节点
  *	
**/
function createItemHTML(_nCurrIndex, _nEndIndex, _nOutlineIndex){
	if(m_arNodes.length < _nCurrIndex)return 0;
	
	var objContent = null;
	if(m_bFirst){//创建节点
		//复制Outline节点
		objContent = m_objSrcContent.cloneNode(true);
		//设置Name及ID
		objContent.name = "OutlineClone";	
		objContent.id	= "OutlineClone_"+_nOutlineIndex;	
		m_arOutLine[m_arOutLine.length] = objContent;
	}
	else
	{
		if(_nOutlineIndex >= m_arOutLine.length)
		{//需要重新复制节点
			//复制Outline节点
			objContent = m_objSrcContent.cloneNode(true);
			//设置Name及ID
			objContent.name = "OutlineClone";	
			objContent.id	= "OutlineClone_"+_nOutlineIndex;	
			m_arOutLine[m_arOutLine.length] = objContent;
			m_bFirst = true;
		}else
			objContent = m_arOutLine[_nOutlineIndex];
	}
	
	//设置Display
	objContent.style.display = "";

	
	
	var arSingleRec = objContent.all["ColumnContent"];
	if(arSingleRec==null)arSingleRec = objContent;
	var recCount = 1;
	if(arSingleRec.length)recCount = arSingleRec.length;

	var i = 0;
	for(i=0; i<recCount; i++){		
		//判断当前索引是否有效
		if(m_arNodes.length <= (_nCurrIndex+i) || _nCurrIndex+i >= _nEndIndex)break;		


		//获取当前的XML节点
		var xmlNode = null;
		if(isMozilla){
			xmlNode = m_arNodes.array[_nCurrIndex+i];			
		}else{
			xmlNode = m_arNodes[_nCurrIndex+i];
		}
		if(xmlNode == null)break;

		//遍历所有属性子节点，从XML中提取数据
		var objSingleRec = null;
		if(arSingleRec.length)
			objSingleRec = arSingleRec[i];
		else
			objSingleRec = arSingleRec;
		
		var arAllField = objSingleRec.all;
		objSingleRec.style.display = "";
		for(var j=0; j<arAllField.length; j++){		
			var sFieldName = arAllField[j].getAttribute("FieldName");
			var sTagName = arAllField[j].tagName;
			
			
			if(sFieldName){
				var sValue = "";
				//获取属性节点
				var xmlNodeTemp = getChildXMLNodeByTagName(xmlNode, sFieldName);//xmlNode.selectSingleNode(sFieldName);
				if(xmlNodeTemp)sValue = getNodeText(xmlNodeTemp);
				
				switch(sTagName.toUpperCase()){//暂时只支持四种HTML置标定义数据源
					case "A":
						arAllField[j].href = sValue;
						break;
					case "SPAN":
					case "TD":
						arAllField[j].innerHTML = sValue;
						break;
					case "IMG":
						arAllField[j].src = sValue;
						break;
					default:
						break;
				}
			}
		}
	}
	//将没有填充内容的Column隐藏
	for(; arSingleRec.length && i<arSingleRec.length; i++)arSingleRec[i].style.display = "none";

	
	if(m_bFirst){
		var all = m_objSrcContent.all;
		m_objSrcContent.parentNode.insertBefore(objContent, m_objSrcContent);		
	}
	
	return i;
}

window.onload = initPage;