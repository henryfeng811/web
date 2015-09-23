// JavaScript Document
	//tab切换
    function tabs(tabTit,on,tabCon){
	$(tabCon).each(function(){
	  $(this).children().eq(0).show();
	  });
	$(tabTit).each(function(){
	  $(this).children().eq(0).addClass(on);
	  });
     $(tabTit).children().hover(function(){
        $(this).addClass(on).siblings().removeClass(on);
         var index = $(tabTit).children().index(this);
         $(tabCon).children().eq(index).show().siblings().hide();
    });
     }
  tabs(".tab-hd","active",".tab-bd");
  
  $(function(){

  //右侧悬浮图标
		  $(".rnav li a").mouseenter(function(){
			  $(".rnav li a").removeClass("cur");
			  $(".rnav li div").hide();
			  $(this).addClass("cur");
			  $(this).parent("li").children("div").slideDown(300);
			  })
		  $(".rnav").mouseleave(function(){
			   $(".rnav li div").hide();
			   $(".rnav li a").removeClass("cur");
			  })
  });