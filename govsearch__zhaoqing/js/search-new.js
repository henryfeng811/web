/*---------------------------------------------final search----------*/
/*--第二个检索--*/

function ADsearch()
{
	var as1 = document.AdvSearchContainerOfContent.AllSearchWords.value;
	var as2 = document.AdvSearchContainerOfContent.OneOfSearchWords.value;	
	var as3 = document.AdvSearchContainerOfContent.NotSearchWords.value;	
	
	if ((as1.trim() != "")||(as2.trim() != "")||(as3.trim() != ""))
	{ 
		document.AdvSearchContainerOfContent.method = 'post';
		return true;
	}
	else
	{
		alert("请在三个框中，任意输入检索词！");
		return false;
	}
}

/*--第三个检索--*/



/*--判断提示--*/

function changs(pareters,str)
{
	var bb = pareters.value;
	if(bb==str)
	{
	pareters.value="";
	}
}
function nd(pareters,str)
{
	var bb = pareters.value;
	if(bb=="")
	{
	var bb = pareters.value=str;
	}
}

//复选框选择

function swapWenz(object)
{	
	var s=document.getElementById("guanjianzi");
	if(object.checked==true)
	{
		for(i=0;i<s.wenz.length;i++)
		{
			s.wenz[i].checked=true;
			s.wenz[i].disabled=true;
		}
		document.guanjianzi.wenzS.value="1";
		//alert("目前 文种 是全选");
	}
	else
	{
		for(i=0;i<s.wenz.length;i++)
		{
			s.wenz[i].checked=false;
			s.wenz[i].disabled=false;
		}
		document.guanjianzi.wenzS.value="2";
		//alert("目前 文种  不是全选");
	}
	
}

function swapWdate(object)
{	
	var s=document.getElementById("guanjianzi");
	if(object.checked==true)
	{
		for(i=0;i<s.wdate.length;i++)
		{
			s.wdate[i].checked=true;
			s.wdate[i].disabled=true;
		}
		document.guanjianzi.wdatepS.value="1";
		//alert("目前 发文日期 是全选");
	}
	else
	{
		for(i=0;i<s.wdate.length;i++)
		{
			s.wdate[i].checked=false;
			s.wdate[i].disabled=false;
		}
		document.guanjianzi.wdatepS.value="2";
		//alert("目前 发文日期 不是全选");
	}
}

//高级检索里的日期多选
function AdSwapWdate(object)
{	
	var s=document.getElementById("AdvSMe");
	if(object.checked==true)
	{
		for(i=0;i<s.AdWdate.length;i++)
		{
			s.AdWdate[i].checked=true;
			s.AdWdate[i].disabled=true;
		}
		document.AdvSMe.AdWdatepS.value="1";
		//alert("目前 发文日期 是全选");
	}
	else
	{
		for(i=0;i<s.AdWdate.length;i++)
		{
			s.AdWdate[i].checked=false;
			s.AdWdate[i].disabled=false;
		}
		document.AdvSMe.AdWdatepS.value="2";
		//alert("目前 发文日期 不是全选");
	}
}

/*-------------------高级检索里的时间选择--------------------*/

function pubDateSelChangeNew(sel)
{
 	//alert(sel.value);
	if(parseInt(sel.value)==10)
	{
		document.getElementById('time1').style.display = 'block';
	}
	else
	{
		document.getElementById('time1').style.display = 'none';
	}
}

function pickDate(objOb)
{
	var	strURL	= "./js/datepicker.html";
	var	strIni	= objOb.value;
		
	var	strFtr	= "dialogHeight: 240px; dialogWidth: 320px; ";
	strFtr	= strFtr + "dialogLeft: " + window.event.screenX + "px; ";
	strFtr	= strFtr + "dialogTop: " + window.event.screenY + "px; ";
	strFtr	= strFtr + "edge: Sunken; center: no; help: No; resizable: No; scroll: No; status: No;"

	var	strVal	= window.showModalDialog (strURL, strIni,strFtr);		
	if (strVal != "")
	{
		objOb.value	= strVal;
	}
}
 
	function selectKwd()
	{  	 
    	var url = "./selectkeywords.jsp";  //新窗口的url 
		
     	var AtWnd = window.open ( url,"choose_unit","width=360,height=205,resizable=yes,scrollbars=yes,menubar=no,status=0");
        //show the window
      	if ( !AtWnd.opener )    
      	AtWnd.opener = window;  //attached window
      	AtWnd.focus();
		 
	}  