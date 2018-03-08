;(function($){
    var app = window.app = {
        //批量扩展app的方法或属性
        extend : function(){
            var options = arguments[0];
            for(var i in options){
                this[i] = options[i];
            }
        }
    };

//    页面流程与功能
    app.extend({
        init:function(){
           this.eventInit();
           this.backToTopInit();
        },
        pageInit:function(pageId){
           var thisAffix = new Affix('#'+pageId+' .aside',10);
           var thisScrollSpy = new scrollSpy('#'+pageId+' .aside',30);
        },
        eventInit:function(){
            //触摸/点击事件
            var touch = {};
            //触摸/点击事件
            $("body").on(NW.event.start, "a,.touch", function(event){
                event.preventDefault();
                var originalEvent = event.originalEvent;
                touch.x1 = originalEvent.touches && originalEvent.touches[0] ? originalEvent.touches[0].pageX : event.pageX;
                touch.y1 = originalEvent.touches && originalEvent.touches[0] ? originalEvent.touches[0].pageY : event.pageY;
                $(this).addClass("active")
            }).on(NW.event.move, "a,.touch", function(event){
                    event.preventDefault();
                    var originalEvent = event.originalEvent;
                    touch.x2 = originalEvent.touches && originalEvent.touches[0] ? originalEvent.touches[0].pageX : event.pageX;
                    touch.y2 = originalEvent.touches && originalEvent.touches[0] ? originalEvent.touches[0].pageY : event.pageY;
                    event.preventDefault();
                   $(this).removeClass("active")
                }).on(NW.event.end, "a,.touch", function(event){
                    event.preventDefault();
                    var originalEvent = event.originalEvent;
                    event.preventDefault();
                    $(this).removeClass("active")
                    if(originalEvent.touches && originalEvent.touches.length > 0) return;//多指触摸时不执行
                    //滑动的横向距离或纵向距离大于30时不做处理
                    if((touch.x2 && Math.abs(touch.x1 - touch.x2) > 10) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 10)){
                    } else {
                        if(!app.isAnimating){//如果没有页面在执行动画切换
                            var el = $(this),
                                to = el.attr("goto"),
                                call = el.attr("call");
                            if(call && $.trim(call)!=""){//执行标签的call属性里的方法,此方法的执行优先于app.goTo方法
                                eval(call);
                            } else {
                                if(to && to.match("#")){
                                    app.goTo(to.substring(1));//切换到某个页面
                                }
                            }
                        }
                    }
                    touch = {};
                });

        },

        //goto page
        goTo : function(toId){
            var cur = $("#pages .page:not(.hidden)"),
                fromId = cur.attr("id");
            if(fromId==toId){
                return
            }
            if($("#toggleBtn").hasClass("on")){
                $("#toggleBtn").removeClass("on")
                $("#toggleNav").addClass("hidden")
            }
            //执行动画切换
            this.pageAnimation("inTypeTwo",fromId,toId);
        },
        pageAnimation : function(inType,fromId,toId){
            var _this = this,
                domFrom = $("#" + fromId),//current page
                domTo = $("#" + toId);//target page

            this.isAnimating = true;
            domFrom.addClass("hidden");
            domTo.removeClass("hidden").addClass(inType);
            domTo.bind(NW.event.animationEnd, function(){
                domTo.unbind(NW.event.animationEnd);
                domTo.removeClass(inType);
                _this.isAnimating = false;
                if(toId!="home"){
                    _this.pageInit(toId)
                }

            });
        },
//        nav toggle
        toggle:function(el,idDom){
            var $el=$(el),$tarDom=$("#"+idDom),eventPre=NW.client.verify;
            if(!$el.hasClass("on")){
                $el.addClass("on");
                $tarDom.removeClass("hidden").addClass("onIng");
                $tarDom.bind(eventPre.animation.end,function(e){
                    $tarDom.removeClass("onIng")
                    $tarDom.unbind(eventPre.animation.end);

                })
            }else{
                $el.removeClass("on");
                $tarDom.addClass("hidden")
            }


        },
        backToTopInit:function(){
            $(window).on("scroll",function(){
                if($(this).scrollTop()!=0&&$("#home").hasClass("hidden")){
                    $("#backToTop").removeClass("hidden")
                }else{
                    $("#backToTop").addClass("hidden")
                }
            });
        },
        toTop:function(){
            $('html, body').stop().animate({
                scrollTop : 0
            },800)

        },
        pause:function(el){
            var $el=$(el),eventPre=NW.client.verify;

            if(!$el.hasClass("play")){
                $el.addClass("play");
                $("#eventPulse").bind(eventPre.animation.end,function(e){
                    $el.removeClass("play")
                    $("#eventPulse").unbind(eventPre.animation.end)
                })

                return
            }
            if($el.hasClass("play")&&$el.hasClass("changed")){
                $el.removeClass("changed");
                return
            }
            $el.addClass("changed");

        },
        play:function(el){
            var $el=$(el),eventPre=NW.client.verify,$tarDom=$("#animBox");
            $el.addClass("changed");
            $el.attr("call","");
            $('#animationEvent .cont-text').html("");
            $tarDom.bind(eventPre.animation.start,function(e){
                $('#animationEvent .cont-text').append('<p>动画开始了，当前经历的时间:' + e.originalEvent.elapsedTime + 's （经历时间不包括延迟时间）</p>');

            })
            $tarDom.bind(eventPre.animation.iteration,function(e){
                $('#animationEvent .cont-text').append('<p>动画重复了一次，当前经历的时间:' + e.originalEvent.elapsedTime + 's</p>');
            })
            $tarDom.bind(eventPre.animation.end,function(e){
                $('#animationEvent .cont-text').append('<p>动画结束了当前经历的时间:' + e.originalEvent.elapsedTime + 's</p>');
                $el.attr("call","app.play(this)");
                $el.removeClass("changed");
                $tarDom.unbind(eventPre.animation.start);
                $tarDom.unbind(eventPre.animation.iteration);
                $tarDom.unbind(eventPre.animation.end);
            })

        }

    })


})(window.jQuery);
