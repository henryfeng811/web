(function($){
	$.fn.scrollPic=function(option){
		var defaults={
		    dir:"top",	//默认左右方向，可选是top向上方向，top的方向没有无缝滚动效果
			index:0,//默认显示第几张
			number:true,//是否显示数字
			dirbtn:true//是否有左右切换按钮
		}
	  var option=$.extend({},defaults,option);
	  var $this=$(this);
	  var h=$this.find("li").outerHeight(),time,l=$this.find("li").length,flag=true,ul=$this.find("ul"),w;	 
	  
	 //是否显示数字
	 
	  if(option.number){
		  var html="";
		  $this.append("<div class='number'></div>");
		  for(var i=0;i<l;i++){
			 html=html+'<a href="#">'+i+'</a>'; 
		  }
		 $this.find("div.number").append(html);
		 $this.find("div.number").find("a").eq(0).addClass("cur");
		 //事件开始
		 $("div.number").find("a").click(function(){
			window.clearInterval(time);
			if(option.dir=='left'){
			   option.index=$(this).index();
			   comcur();
			   ul.stop(true,true).animate({left:-w*option.index}); 
			   autotime();	
			}else{
			   option.index=$(this).index();
			   comcur(); 
			   ul.stop(true,true).animate({top:-h*option.index}); 
			   autotime();		
			}
		 });
		 //事件结束
	  }
	 //方向
	 if(option.dir=='left'){
		 $this.find("li").css({float:"left",height:h,overflow:"hidden",width:w}); 
		  w=$this.find("li").outerWidth();
		  dirtion();
		  ul.stop(true,true).animate({left:-w*option.index}); 
		  comcur(); 
		  autotime();
	 }else{
		
		$this.find("li").css({height:h,overflow:"hidden",width:w});
		dirtion();
		ul.stop(true,true).animate({top:-h*option.index});
		comcur();   
		autotime();  
	 }
	 function dirtion(){
		  if(option.dir=='left'){
			 $this.css({width:w,height:h,position:"relative",overflow:"hidden"});
		     ul.css({width:"99999px",position:"absolute",left:"0",right:"0"});   
		  }else{
			  $this.css({width:w,height:h,position:"relative",overflow:"hidden"});
		      ul.css({height:"99999px",position:"absolute",left:"0"}); 
		  }
	 }
	//是否有左右按钮
	 if(option.dirbtn){
	    var html="<div class='left'><a href='#'>left</a></div><div class='right'><a href='#'>right</a></div>";
		$this.append(html); 
		//点击左边按钮事件
		$("div.left").find("a").click(function(){
			 window.clearInterval(time);
			 flag=true;
		   	 common();
			 autotime();
		});
		//点击右边按钮事件
		$("div.right").find("a").click(function(){
			 window.clearInterval(time);
			 flag=false;
		   	 common();
			 autotime();
			 //停止点击1500后，ul向左移动
			 window.setTimeout(function(){
				  flag=true;
			 },1500)
		})
	 }
	 
	  //定时器操作
	  function autotime(){
  		  time=window.setInterval(function(){
			   common(); 
		  },2000)
	  }
	  //公共方法
	  function comcur(){
			    $this.find("div.number").find("a").removeClass("cur")
				$this.find("div.number").find("a").eq(option.index).addClass("cur");  
			  }
	  function common(){
		  //左右滚动
		   if(option.dir=='left'){
			       if(flag){
					   if(option.index<l-1){
						   option.index++; 
						   ul.stop(true,true).animate({left:-w*option.index});  
						   comcur();
				       }else if(option.index=l-1){
						   ul.append(ul.children("li:first").clone()); 
						   ul.stop(true,true).animate({left:-w*l},function(){
						   ul.children("li:last").remove();
						   ul.css({left:0});
						   option.index=0; 
						   comcur();
					  }); 
				   }
				   
				  }else{
					 if(option.index>0){
						   option.index--;  
						   ul.stop(true,true).animate({left:-w*option.index});  
						   comcur();
				       }else if(option.index=l-1){
						   ul.prepend(ul.children("li:last").clone()); 
						   ul.css({left:-w});
						   ul.stop(true,true).animate({left:0},function(){
						   ul.children("li:first").remove();
						   ul.css({left:-w*(l-1)});
						   option.index=l-1;   
					  }); 
				   }  
				  }	
				  //上下滚动	 
			  }else{
				 
				  if(option.index<l-1){
					option.index++;  
				  }else{
					option.index=0;  
				  }   
			      ul.stop(true,true).animate({top:-h*option.index});  
				   //console.log(option.index)
			  }
		   if(option.number){
			   comcur();
		  }			    
	  }
	  /*公共方法结束*/
	}
})(jQuery)