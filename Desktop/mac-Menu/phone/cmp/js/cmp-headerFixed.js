/**
 * header导航固定
 * varstion 1.0.0
 * by Mashan
 * mashan@DCloud.io
 */

(function(_){
    var iphonex = /(iphonex)/i.test(navigator.userAgent);//判断是否是iphoneX流海
    var scrollThreshold = iphonex?90:70;//滚动阈值
    var header=function(header,textInput){
        var self=this;
        if(_.os.ios){
            self.init(header,textInput);
        }
    };

    header.prototype.init=function(header,textInput){
        var self=this;
        self.wrapper = typeof header == "string" ? document.querySelector(header) : header;  //header元素
        self.position(self.wrapper,textInput);
        self.windowHeight = CMPFULLSREENHEIGHT;
        self.textInputArea = null;
    };
    header.prototype.position=function(dom,textInput){
        var self=this,
            curFocusObj,
            timer;
        var domStyle=dom.style;
        var inputText;
        var ontimer;
        if(textInput && textInput.length > 1){
            inputText = typeof textInput == "string" ? document.querySelectorAll(textInput) : textInput;
        }else{
            inputText = typeof textInput == "string" ? document.querySelector(textInput) : textInput;
        }
        self.textInputArea = inputText;
        self.wrapper.style.position="absolute";
        if(inputText && (inputText != "" || inputText != "undefined" || inputText != null )){
            if(inputText.length > 1){
                document.body.addEventListener("click", function(e){
                    var Input;
                    e = e || window.event;
                    Input = e.target;
                    if ((Input.nodeName === "INPUT" && self.needHandleInputType(Input)) ||  Input.nodeName === "TEXTAREA" ) {
                        if(Input.focus){
                            self.textFocus(dom,Input,260,e);
                            setRanger(Input);
                            curFocusObj = Input;
                        }
                        Input.addEventListener('blur',function(){
                            var scrollTop=document.querySelector('body').scrollTop;
                            var currentWiH=window.innerHeight || document.body.clientHeight;
                            if((scrollTop == 0) && (currentWiH == self.windowHeight)){
                                self.textBlur(dom);
                            }
                        },false);
                    }
                    window.onscroll = function() {
                        clearTimeout(timer);
                        timer = setTimeout(function() {
                            self.textFocus(dom,Input,1);
                            setRanger(Input);
                        },200);
                    };
                },false);
                document.body.addEventListener('touchmove',function(e){
                    var scrollTop=document.querySelector('body').scrollTop;
                    dom.style.top = scrollTop + "px";
                },false);
                document.body.addEventListener('touchend',function(){
                    window.onscroll=function(){
                        if(ontimer)
                        clearTimeout(ontimer)
                        ontimer = setTimeout(function(){
                            var scrollTop=document.querySelector('body').scrollTop;
                            dom.style.top = scrollTop + "px";
                        },0)
                    };
                },false);
                _.each(inputText,function(i,input){
                    input.addEventListener('blur',function(){
                        self.textBlur(dom);
                        window.onscroll = null;
                    },false);
                    input.addEventListener('focus',function(){
                        self.textFocus(dom,input);
                    },false);
                });

            }else{
                self.eventList(dom,inputText);
            }
        }
        
    };
    var inputTypeArr = ["text","number","tel","url","password","email"];
    header.prototype.needHandleInputType = function(input){
        var inputType = input.type;
        if(inputTypeArr.indexOf(inputType) != -1) return true;
        return false;
    };
    header.prototype.textFocus=function(dom,textInput,time,event){
        var self=this;
        var domStyle=dom.style;
        var setTime  = time != undefined ? time : 200;
        setTimeout(function(){
            var scrollTop=document.querySelector('body').scrollTop;
            var currentWiH=window.innerHeight || document.body.clientHeight;
            var PageY;
            if(currentWiH < self.windowHeight){
                self.wrapper.style.position="fixed";
                domStyle.top= scrollTop +"px";
                if(event){
                    PageY = event.target.getBoundingClientRect().top;
                    if(PageY < 64){
                        //document.body.style.webkitTransform= "translate3d(0,"+scrollThreshold+"px,0) ";
                        document.querySelector('body').scrollTop = scrollTop - scrollThreshold;
                        domStyle.top =(scrollTop-scrollThreshold) +"px";
                    } else {
                        //document.body.style.webkitTransform= "translate3d(0,0,0) ";
                    }
                } else {
                    //document.body.style.webkitTransform= "translate3d(0,0,0)";
                }
            }else{
                self.wrapper.style.position="absolute";
                domStyle.top=0;
            }
        },setTime);
    };
    header.prototype.textBlur=function(dom){
        var self=this;
        var domStyle=dom.style;
        if(self.wrapper){
            self.wrapper.style.position="absolute";
        }
        domStyle.top=0;
        //document.body.style.webkitTransform= "translate3d(0,0,0) ";
        document.querySelector('body').scrollTop = 0;
        var footerThat=document.querySelector('footer.cmp-comment-footer');
        if(footerThat){
            footerThat.style.bottom = 0;
        }
    };
    header.prototype.eventList=function(dom,obj){   //header,obj   如果传递的只有一个对象input走
        var self=this;
        var domStyle=dom.style,
            timer;
        self.textInputArea = obj;
        obj.addEventListener('focus',function(e){
            self.textFocus(dom,obj,260,e);
            setRanger(obj);
            window.onscroll = function() {
                clearTimeout(timer);
                timer = setTimeout(function() {
                    self.textFocus(dom,obj,1);
                    setRanger(obj);
                },200);
            };
        },false);

        obj.addEventListener('blur',function(){
            self.textBlur(dom);
            window.onscroll = null;
        },false);
        obj.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        })
    };
    header.prototype.refresh = function(){
        var self =this;
        var domStyle =self.wrapper.style;
        var scrollTop=document.querySelector('body').scrollTop;
        var currentWiH=window.innerHeight || document.body.clientHeight;
        if(currentWiH < self.windowHeight){
            self.wrapper.style.position="fixed";
            domStyle.top= scrollTop +"px";
            if(self.textInputArea && self.textInputArea.offsetHeight > 250){
                domStyle.top=0;
                document.body.style.webkitTransform= "translate3d(0,"+scrollTop+"px,0) ";
                document.body.style.webkitTransition=  "-webkit-transform 100ms";
            }
        }else{
            self.wrapper.style.position="absolute";
            domStyle.top=0;
        }

    };

    _.HeaderFixed=function(dom,textInput){
        return new header(dom,textInput);
    };

    function setRanger(el) {
        if(el.selectionStart !== el.selectionEnd)return;
        if(!el.setSelectionRange)return;
        setTimeout(function() {
            //若el的value为空
            if(el.value === '') {
                //赋值空格
                el.value = ' ';
                //移动光标
                //el.setSelectionRange(1, 0);
                //还原
                el.value = '';
            } else {
                //获取当前元素光标的位置
                var start = el.selectionStart,
                    hisStart = el.selectionStart,
                    end;
                if(start === 0) {
                    start++;
                    end = start;
                } else {
                    end = start - 1;
                }
                el.setSelectionRange(start, end);
                //还原光标位置
                if(hisStart === 0)
                    el.setSelectionRange(0, 0);
                else
                    el.setSelectionRange(hisStart, end + 1);
            }
        }, 400);
    }
})(cmp);