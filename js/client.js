if(!window.NW) NW = {};
NW.support = {
    //Windows Phone（IE10）
    isIE10 : window.navigator.msPointerEnabled,
    //mobile
    isMobile : 'ontouchstart' in window || 'MSPointerDown' in window,
    //transform3d
    transform3d : 'WebKitCSSMatrix' in window
};
NW.event = (function(){
    return {
        start : 'MSPointerDown' in window ? 'MSPointerDown' : NW.support.isMobile ? 'touchstart' : 'mouseover',
        move : 'MSPointerDown' in window ? 'MSPointerMove' : NW.support.isMobile ? 'touchmove' : 'mousemove',
        end : 'MSPointerDown' in window ? 'MSPointerUp' : NW.support.isMobile ? 'touchend' : 'mouseup',
        animationEnd : NW.support.isIE10 ? 'animationend' : 'webkitAnimationEnd'
    }
})();
NW.client = {
    recognize:(function(){
        var engine=[], browser=[];
        //detect rendering engines/browsers
        var ua = navigator.userAgent;
        if (/AppleWebKit\/(\S+)/.test(ua)){
            engine.push('webkit',RegExp["$1"] ) ;
            var engineVer=parseFloat(RegExp["$1"]) ;

            //figure out if it's Chrome or Safari
            if (/Chrome\/(\S+)/.test(ua)){
                browser.push('chrome',RegExp["$1"])
            } else if (/Version\/(\S+)/.test(ua)){
                browser.push('safari',RegExp["$1"] )
            } else {
                //approximate version
                var safariVersion = 1;
                if (engineVer < 100){
                    safariVersion = 1;
                } else if (engineVer< 312){
                    safariVersion = 1.2;
                } else if (engineVer < 412){
                    safariVersion = 1.3;
                } else {
                    safariVersion = 2;
                }
                browser.push('safari',safariVersion )
            }
        } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)){
            browser.push('konq',RegExp["$1"]) ;
            engine.push('khtml',RegExp["$1"])
        } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)){
            engine.push('gecko',RegExp["$1"] )

            //determine if it's Firefox
            if (/Firefox\/(\S+)/.test(ua)){
                browser.push('firefox',RegExp["$1"])
            }
        } else if (/MSIE ([^;]+)/.test(ua)){
            engine.push('ie',RegExp["$1"]);
            browser.push('ie',RegExp["$1"])
        }

        //return it
        return {
            engine:     engine,
            browser:    browser
        };
      })(),
    verify:(function(){
        var node = document.body ,
            anim,
            tran;

        if(node.style.webkitAnimation!=undefined){
            anim={
                start:'webkitAnimationStart',
                end:'webkitAnimationEnd',
                iteration:'webkitAnimationIteration'
            }
        }else if(node.style.animation!=undefined){
            anim={
                start:'animationstart',
                end:'animationend',
                iteration:'animationiteration'
            }
        }else{
            return false
        }

        if(node.style.webkitTransition!=undefined){
            tran={end:'webkitTransitionEnd' }
        }else if(node.style.transition!=undefined){
            tran={end:'transition' }
        }else{
            return false
        }

        return {
            animation:anim,
            transition:tran
        }
    })()
}
