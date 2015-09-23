function createPageHTML(_nPageCount, _nCurrIndex, _sPageName, _sPageExt)
{ 
//tita 翻页函数

//定义翻页的字体样式
var styleDIY = "width:50px;";
var styleDIY2 ="width:120px;"

if(_nPageCount == null || _nPageCount<=0){
return; 
} 

//tita
/*document.write("　　");*/

if(_nPageCount==1)
	
	document.write("<span>共1页，当前第1页</span><span><a href='#'>首页</a></span><span><a href='#'>上一页</a></span><span><a href='#'>刷新</a></span><span><a href='#'>下一页</a></span><span><a href='#'>尾页</a></span>");
else
{
	if(_nPageCount==2)
	{
		if (_nCurrIndex==0)
			document.write("<span style=\"" + styleDIY +"\">首页</span> <span style=\"" + styleDIY +"\">上一页</span> <span><a href=\""+_sPageName+"_" + (_nCurrIndex+1) + "."+_sPageExt+"\" style=\"" + styleDIY +"\">下一页</a></span> <span><a href=\""+_sPageName+"_" + (_nPageCount-1) + "."+_sPageExt+"\" style=\"" + styleDIY +"\">尾页</a></span>")
		else
		{
			if (_nCurrIndex==1)
				document.write("<span><a href=\""+_sPageName+"."+_sPageExt+"\" style=\"" + styleDIY +"\">首页</a></span> <span><a href=\""+_sPageName+"."+_sPageExt+"\" style=\"" + styleDIY +"\">上一页</a></span> <span style=\"" + styleDIY +"\">下一页</span> <span style=\"" + styleDIY +"\">尾页</span>")
		}
	}
	else
	{
		if (_nCurrIndex==0)
			document.write("<span style=\"" + styleDIY +"\">首页</span> <span style=\"" + styleDIY +"\">上一页</span> <a href=\""+_sPageName+"_" + (_nCurrIndex+1) + "."+_sPageExt+"\" style=\"" + styleDIY +"\">下一页</a> <a href=\""+_sPageName+"_" + (_nPageCount-1) + "."+_sPageExt+"\" style=\"" + styleDIY +"\">尾页</a>")
		else
		{
			if (_nCurrIndex==1)
				document.write("<span><a href=\""+_sPageName+"."+_sPageExt+"\" style=\"" + styleDIY +"\">首页</a></span> <span><a href=\""+_sPageName+"."+_sPageExt+"\" style=\"" + styleDIY +"\">上一页</a></span> <span><a href=\""+_sPageName+"_" + (_nCurrIndex+1) + "."+_sPageExt+"\" style=\"" + styleDIY +"\">下一页</a></span> <span><a href=\""+_sPageName+"_" + (_nPageCount-1) + "."+_sPageExt+"\" style=\"" + styleDIY +"\">尾页</a></span>")
			else
			{
				if (_nCurrIndex<_nPageCount-1)
					document.write("<span><a href=\""+_sPageName+"."+_sPageExt+"\" style=\"" + styleDIY +"\">首页</a></span> <span><a href=\""+_sPageName+"_" + (_nCurrIndex-1) + "."+_sPageExt+"\" style=\"" + styleDIY +"\">上一页</a></span> <span><a href=\""+_sPageName+"_" + (_nCurrIndex+1) + "."+_sPageExt+"\" style=\"" + styleDIY +"\">下一页</a></span> <span><a href=\""+_sPageName+"_" + (_nPageCount-1) + "."+_sPageExt+"\" style=\"" + styleDIY +"\">尾页</a></span>")
				else
				{
					if (_nCurrIndex==_nPageCount-1)
						document.write("<span><a href=\""+_sPageName+"."+_sPageExt+"\" style=\"" + styleDIY +"\">首页</a></span> <span><a href=\""+_sPageName+"_" + (_nCurrIndex-1) + "."+_sPageExt+"\" style=\"" + styleDIY +"\">上一页</a></span> <span style=\"" + styleDIY +"\">下一页</span> <span style=\"" + styleDIY +"\">尾页</span>")
				}
			}
		}
	}
}
/*document.write("<td style=\"" + styleDIY +"\">总共" + _nPageCount + "页</td>");*/
document.write("<span style=\"" + styleDIY2 +"\">当前第" + (_nCurrIndex+1) + "页/总共" + _nPageCount + "页</span>　");
document.write("<span><select name=\"select\" onchange=\"location.replace(this.value)\">");
document.write("<option selected >转到</option>");
for(var i=0; i<_nPageCount; i++)
{
	if(i==0)
		document.write("<option value=\""+_sPageName+"."+_sPageExt+"\">第1页</option>");
	else
		document.write("<option value=\""+_sPageName+"_" + i + "."+_sPageExt+"\">第"+(i+1)+"页</option>");
}
document.write("</select></span>");
//tita 
} //WCM置标