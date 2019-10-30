(function(_){
    /**
     * 底部输入框 自适应键盘高度插件
     * varstion 1.0.0
     * by Mashan
     * mashan@DCloud.io
     */
    var footerObj=function(footer,dom){
        this.initDom(footer,dom);
    };
    footerObj.prototype.initDom=function(footer,dom){
        var self=this;
        self.footer = typeof footer == "string" ? document.querySelector(footer) : footer;  //footer
        self.dom = typeof dom == "string" ? document.querySelector(dom) : dom;  //footer
        self.input=null;
        self.windowHeight = CMPFULLSREENHEIGHT;
        if(self.footer){
            self.footerStyle=self.footer.style;
        }
        self.event();
    };
    footerObj.prototype.event=function(){
        var self=this;
        if(_.os.ios && self.footer){
            self.positionFooter(self.input);
        }
    };
    footerObj.prototype.positionFooter=function(){
        var self=this;
        if(self.dom){
            self.dom.addEventListener('focus',function(){
                setTimeout(function(){   //键盘被弹起
                    var ThisHeight=window.innerHeight;
                    var position;
                    if(ThisHeight < self.windowHeight){
                        var scrollTop=document.querySelector('body').scrollTop;
                        position=self.windowHeight - ThisHeight  - scrollTop ;
                        self.footerStyle.bottom= position + "px";
                    }
                    else{
                        self.footerStyle.bottom= 0;
                    }
                },550);
            },false);
    
            self.dom.addEventListener('blur',function(){
                self.footerStyle.bottom= 0;
            },false);
        }else{
            document.body.addEventListener('touchstart',function(e){
                var target = e.target;
                if((target.tagName === "INPUT" && target.getAttribute('type') == 'text') || target.tagName == "TEXTAREA"){
                    self.input = target;
                }
                if(self.input){
                    self.input.addEventListener("blur", function () {
                        self.footerStyle.bottom= 0;
                    }, false);
                }
            },false);
            document.body.addEventListener('touchend',function(){
                setTimeout(function(){   //键盘被弹起
                    var ThisHeight=window.innerHeight;
                    var position;
                    if(ThisHeight < self.windowHeight){
                        var scrollTop=document.querySelector('body').scrollTop;
                        position=self.windowHeight - ThisHeight  - scrollTop ;
                        self.footerStyle.bottom= position + "px";
                    }
                    else{
                        self.footerStyle.bottom= 0;
                    }
                },550);
            },false);
        }
        

       

    };
    footerObj.prototype.reset=function(){
        var self=this;
        self.input.value="";
        self.input.placeholder="说点什么...";
    };

    _.footerAuto=function(id,dom){
        return new footerObj(id,dom);
    };
})(cmp);