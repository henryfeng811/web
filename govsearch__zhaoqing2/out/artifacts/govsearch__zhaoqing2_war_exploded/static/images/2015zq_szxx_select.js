// JavaScript Document
window.onload=function(){
	//select框
		$(".td-link dt").click(function(e){
		$(".td-link dd").hide();
		$(this).next("dd").slideDown("600");
		$(this).addClass("active");
		e.stopPropagation();
	});
	$(".td-link dd li").hover(function(e){
		$(this).toggleClass('cur');
		e.stopPropagation();
	});
	$(".td-link dd li").click(function(e){
		var val = $(this).text();
		var dataVal = $(this).attr("data-value");
		$(this).parents("dd").prev("dt").html(val);
		$(".td-link dd").hide();
		$(this).parents("dd").prev("dt").removeClass("active");
		e.stopPropagation();
	});
	$(document).click(function(){
		$(".td-link dd").hide();
		$(".td-link dt").removeClass("active");
	});
	
}	