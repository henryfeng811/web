//运行高亮显示检索词的逻辑
function runDaubLogic() {

	//以下一块为从refer中获取searchWord的逻辑
	//***********************************************
	//检索结果页面的url
	//var refer = document.referrer.toLowerCase();

	//if (isNull(refer)) {
	//	return;
	//}
	//var searchWord = getSearchWord(refer);
	//***********************************************
	var finalUrl=window.location.href;
	var re=/keywords=/;
		re.exec(finalUrl);
	var sTitle=RegExp.rightContext;

	var searchWord = sTitle;
	if (isNull(searchWord)) {
		return;
	}
	var array = transStr2Array(searchWord);
	if (array.length == 0) {
		return;
	}
	var element = getElementToDaub();
	if (element == null || typeof (element) == "undefined") {
		return;
	}
	daubElementAll(element, array);
}


//array为检索词的数组，ele为存储正文内容的元素
function daubElementAll(ele, array) {
	if (array == null || array.length == 0) {
		return;
	}
	var colors = getColorArray();
	for (var i = 0; i < array.length; i++) {
		daubElement(ele, array[i], colors[i % 5]);
	}
	ele.innerHTML = replaceAll(replaceAll(ele.innerHTML, "<tianjige>", ""), "</tianjige>", "");
}


//获取存放文章正文的元素
function getElementToDaub() {
	var elements = document.getElementsByTagName("*");
	if (elements == null || elements.length == 0) {
		return null;
	}
	for (var i = 0; i < elements.length; i++) {
		if (elements[i] == null || typeof (elements[i]) != "object") {
			continue;
		}
		if (isNull(elements[i].className)) {
			continue;
		}
		if (elements[i].className.indexOf("content") != -1) {
			return elements[i];
		}
	}
	return null;
}


//获取高亮显示的颜色数组。检索词可能有多个，用不同颜色进行高亮显示。如：第一个词语全部用red颜色，第二个词语显示为orange……
function getColorArray() {
	return ["red", "orange", "pink", "grey", "blue"];
}


//将文章正文中包含的某词语进行高亮显示。ele为存储正文内容的元素，word为要高亮显示的词语，color为高亮显示的颜色
function daubElement(ele, word, color) {
	if (word == null || word == "") {
		return;
	}
	var colorWord = "<font color=\"" + color + "\">" + word + "</font>";
	var eles = ele.childNodes;
	for (var i = 0; i < eles.length; i++) {
		e = eles[i];
		if (e.nodeType == 3) {
			if (e.data.indexOf(word) == -1) {
				continue;
			}
			var reg = new RegExp("(" + word + ")", "gi");
			var objResult = document.createElement("tianjige");
			objResult.innerHTML = e.data.replace(reg, "<font color='" + color + "'>$1</font>");
			if (e.data == objResult.childNodes[0].innerHTML) {
				continue;
			}
			ele.replaceChild(objResult, e);
		} else {
			if (e.nodeType == 1) {
				daubElement(e, word, color);
			}
		}
	}
}


//获取检索词
function getSearchWord(refer) {
	domain = getDomainName(refer);
	var searchWord = "";
	if (domain.indexOf("google") > 0) {
		refer = decodeURI(refer);
		return getParameter(refer, "g");
	} else {
		if (domain.indexOf("baidu") > 0) {
			searchWord = getParameter(refer, "word");
			if (isNull(searchWord)) {
				searchWord = getParameter(refer, "wd");
			}
			if (isNull(searchWord)) {
				searchWord = getParameter(refer, "kw");
			}
			return searchWord;
		} else {
			if (domain.indexOf("home.news.cn") > 0 || domain.indexOf("xinhuanet.com")) {
				if (domain.indexOf("forum") != -1 || domain.indexOf("view") != -1) {
				} else {
					refer = decodeURI(refer);
					searchWord = getParameter(refer, "sw");
					select = getParameter(refer, "select");
					if (select == null || (select != "2" && select != "1" && select != "3")) {
						searchWord = "";
					}
					if (isNull(searchWord)) {
						searchWord = getParameter(refer, "content");
					}
				}
				return searchWord;
			}
		}
	}
}

//判断字符串是否为空
function isNull(str) {
	if (str == null) {
		return true;
	}
	if (str == "") {
		return true;
	}
	return false;
}		

//定义获取元素的简易方法
if(!$) {
	var $ = function(id){
		return document.getElementById(id);
	}
}


//将字符串变为数组
function transStr2Array(str) {
	if (str == null || str == "") {
		return [];
	}
	str = replaceAll(str, "++", "+");
	while (str.indexOf(0) == "+") {
		str = str.substring(1);
	}
	while (str.indexOf(str.length) == "+") {
		str = str.substr(0, str.length - 1);
	}
	return str.split("+");
}

//获取URL上的参数,get方法
function getParameter(requestURL, parameterName) {
	var index = requestURL.indexOf(parameterName + "=");
	if (index <= 0) {
		return "";
	}
	var begin = index + parameterName.length + 1;
	var end = requestURL.indexOf("&", begin);
	if (end < begin) {
		return requestURL.substring(begin);
	}
	return requestURL.substr(begin, end - begin);
}

//获取引用此js的域名
function getDomainName(requestURL) {
	if (requestURL.indexOf("http://") == 0) {
		var end = requestURL.indexOf("/", 7);
		return requestURL.substr(7, end - 7);
	}
	return "";
}

//获取引用该js的页面名
function getUriName(requestURL) {
	var index = requestURL.lastIndexOf("/");
	if (index > 0) {
		var end = requestURL.indexOf("?", index);
		if (end > index) {
			return requestURL.substr(index + 1, end - index - 1);
		}
		return requestURL.substring(index + 1);
	}
	return "";
}

//将字符串中的s1字串全部换成s2
function replaceAll(str, s1, s2) {
	if (s1.length > 0 && str.indexOf(s1) != -1) {
		if (s1.length == 1) {
			return str.replace(new RegExp(s1, "g"), s2);
		}
		return str.replace(new RegExp(s1, "gm"), s2);
	}
	return str;
}

//去掉字符串量边的空格
function trim(str) {
	while (str.charAt(0) == " ") {
		str = str.substring(1);
	}
	while (str.charAt(str.length - 1) == " ") {
		str = str.substring(0, str.length - 1);
	}
	return str;
}


function chardouble(s) {

	var searchWord = s;
	if (isNull(searchWord)) {
		return;
	}
	var array = transStr2Array(searchWord);
	if (array.length == 0) {
		return;
	}
	var element = getElementToDaub();
	if (element == null || typeof (element) == "undefined") {
		return;
	}
	daubElementAllstr(element, array);
}


//array为检索词的数组，ele为存储正文内容的元素
function daubElementAllstr(ele, array) {
	if (array == null || array.length == 0) {
		return;
	}
	var colors = getColorArray();
	for (var i = 0; i < array.length; i++) {
		daubElementstr(ele, array[i], colors[i % 5]);
	}
	ele.innerHTML = replaceAll(replaceAll(ele.innerHTML, "<tianjige>", ""), "</tianjige>", "");
}

//将文章正文中包含的某词语进行高亮显示。ele为存储正文内容的元素，word为要高亮显示的词语，color为高亮显示的颜色
function daubElementstr(ele, word, color) {
	if (word == null || word == "") {
		return;
	}
	var colorWord = "<font color=\"" + color + "\">" + word + "</font>";
	var eles = ele.childNodes;
	for (var i = 0; i < eles.length; i++) {
		e = eles[i];
		if (e.nodeType == 3) {
			var reg = new RegExp("(" + word + ")", "gi");
			var objResult = document.createElement("tianjige");
			objResult.innerHTML = e.data.replace(reg, "<font style='display:none'>$1</font>");

			ele.replaceChild(objResult, e);
		} else {
			if ((e.nodeType == 1)||(e.nodeType == 2)) {
				daubElementstr(e, word, color);
			}
		}
		
	}
}
