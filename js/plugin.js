//    侧栏固定
var Affix=function(element,offset){
    this.elem=$(element);
    this.offset=parseInt(offset);
    this.pos=this.elem.offset();
    this.$win  = $( window ).on('scroll', $.proxy( this.posCheck, this ));
};
Affix.prototype={
    constructor :Affix,
    posCheck:function(){
        var scrollTop=this.$win.scrollTop();

        if(this.pos.top -scrollTop <=this.offset){
            this.elem.addClass('fixed')
        }else{
            this.elem.removeClass('fixed')
        }

    }

};


//    页面滚动侧栏效果
var scrollSpy = function( element,offset ) {
    this.$node = $( element );
    this.$anchor = this.$node.find('a');
    this.offset=parseInt(offset);
    this.$win = $(window).on("scroll", $.proxy(this.spy, this));
}

scrollSpy.prototype = {
    constructor : scrollSpy,
    nodeTop : function ( elem ) {
        var id = elem.attr("href");
        return $(id).offset().top - this.offset;
    },
    click : function(e) {
        e.preventDefault();
        e.stopPropagation();
        var _this = this;
        if (e.target.nodeName == "A") {
            $('html, body').stop().animate({
                scrollTop : _this.nodeTop($(e.target))
            },400);
        }

    },
    spy : function () {
        var _this = this;
        var scrollTop = this.$win.scrollTop();
        for ( var i=0, len = this.$anchor.length; i < len; i++) {
            var sect = $(this.$anchor[i]);
            var top  = _this.nodeTop(sect);
            if ( scrollTop > top - _this.offset||scrollTop == $(document).height() - this.$win.height()) {
                this.$anchor.parent().removeClass("cur");
                sect.parent().addClass("cur");
            }

        }
    }
}


