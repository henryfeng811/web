// JavaScript Document
$(function(){
	//图片滚动	
	 var index=0;
	  var picLi=$('div.img-list').find("li").width();
	  var liNum=$('div.img-list').find("li").length;
	  var time=null
	  timeRight();
		function timeScroll(){
			time=window.setInterval(function(){
				common();
			},3000);
		}
		function timeRight(){
			time=window.setInterval(function(){
				commonRight();
			},3000);
		}
		 $("span.prev").click(function(){
		  window.clearInterval(time);
		  common();
		  timeScroll();
		  
	  });
	  $("span.next").click(function(){
		   window.clearInterval(time);
		   commonRight();
		   timeRight();
	  });
	  function common(){
		 $("div.img-list").find("ul").stop().animate({left:-(picLi+26)*2},function(){
					$(this).css({left:-(picLi+26)}); 
		 });	
		 $('div.img-list').find("li:first").appendTo("div.img-list ul"); 
	  }
	  function commonRight(){
		   $("div.img-list").find("ul").stop().animate({left:0},function(){
					$(this).css({left:-(picLi+26)});
		   $("div.img-list ul").prepend($('div.img-list').find("li:last"));  
		 });	
	  }
	})