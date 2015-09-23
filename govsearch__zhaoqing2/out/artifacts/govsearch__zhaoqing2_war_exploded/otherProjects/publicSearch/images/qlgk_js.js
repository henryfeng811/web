/**
 * Created by jessie on 2014/11/25.
 */
/*====友情链接tab切换====*/
$(function(){
    var mk=Number(0);
    $(".link-tab li").eq(mk).addClass("cur");
    $(".link-main").eq(mk).show();
    $(".link-tab li").each(function(obj){
        $(this).click(function(){
            $(".link-main").each(function(){
                $(this).hide();
            });
            $(".link-tab li").removeClass("cur");
            $(this).addClass("cur");
            $(".link-main").eq(obj).show();
        });
    });
});

/*====概览tab切换====*/
$(function(){
    var mk=Number(0);
    $(".gl-tab li").eq(mk).addClass("cur");
    $(".gl-main").eq(mk).show();
    $(".gl-tab li").each(function(obj){
        $(this).click(function(){
            $(".gl-main").each(function(){
                $(this).hide();
            });
            $(".gl-tab li").removeClass("cur");
            $(this).addClass("cur");
            $(".gl-main").eq(obj).show();
        });
    });
});