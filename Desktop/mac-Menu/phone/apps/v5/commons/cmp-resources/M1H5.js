/**
 * Created by 马山 on 2016/5/9 0009.
 */

/**
 * 底部输入框
*/
(function(_){

    var footerAuto=function(object){
        var self=this;
        //点击表情容器
        self.buttom_items = document.getElementById('buttom_items');  //底部评论遮盖
        self.footer_kitty = document.querySelector('.footer_kitty');  //表情按钮
        self.textArea = document.querySelector('.input_comment');   //input文本框
        self.footer = document.querySelector('.footer_comment_container');    //footer
        self.input_title=null;
        self.object=object;
        self.init();
    };

    footerAuto.prototype.init=function(){
        var self=this;
        var header ;
        header= document.querySelectorAll('header')[0];   //header
        var headerAll=document.querySelectorAll('header');
        var headerLen=headerAll.length;
        if(headerLen>1){
            header=headerAll[1];
        }
        cmp.HeaderFixed(header,self.textArea);
        cmp.footerAuto('.footer_comment_container');
        self.event();
    };
    footerAuto.prototype.event=function(){
        var self=this,footerStyle;
        var emoji_ontainer = document.querySelector('.kitty_container');  //存放表情的容器��
        var comment=document.querySelector('.comment');   //点击进行评论�
        if(self.footer){
            footerStyle=self.footer.style;
        }
        if(comment){
            comment.addEventListener('click', function() {
                self.textArea.focus();
            }, false);
        }
        self.textArea.addEventListener('click', function () {
            self.textArea.focus();
            if(self.input_title && self.textArea.value.length>15){
                self.input_title.style.display="block";
            }
            if(emoji_ontainer){
                emoji_ontainer.classList.add('display_none');//点击文本框的时候,隐藏表情容器�����
            }
        }, false);
        self.textArea.addEventListener("input",function(){
            var title;

            title=self.createTitle();
            if(title.length>1){
                title.remove();
            }
            var but_custom=document.querySelector('.but_custom.matter');
            but_custom.appendChild(title);
            self.input_title=document.querySelector('.input_title');
            var value=this.value;
            var valueLen=value.length;
            if(valueLen>15){ //中文
                self.input_title.style.display="block";
                self.input_title.innerHTML=value;
            }else{
                self.input_title.style.display="none";
                self.input_title.innerHTML=value;
            }
        },false);
        //点击表情容器按钮
        self.footer_kitty.addEventListener('click',function(){
            emoji_ontainer.classList.remove('display_none');
        },false);
        if(self.object){
            document.getElementById(self.object).addEventListener('touchmove', function () {
                self.textArea.blur();
                if(self.input_title){
                    self.input_title.style.display="none";
                }
                if (self.textArea.value == '' && self.buttom_items? self.buttom_items.style.display == "none" : "") {
                    footerStyle.display = 'none';  //footer
                    if(self.buttom_items){
                        self.buttom_items.style.display = 'block'; //评论
                    }
                    if(self.footer_kitty){
                        if (self.footer_kitty.classList.contains('see-icon-v5-common-keyboard')) {
                            self.footer_kitty.classList.remove('see-icon-v5-common-keyboard');
                            self.footer_kitty.classList.add('icon-biaoqing');
                        }
                    }
                    if(emoji_ontainer){
                        emoji_ontainer.classList.add('display_none');
                    }

                }
            }, false);

        }
    };

    footerAuto.prototype.createTitle=function(){
        var self=this;
        var title=document.createElement("div");
        title.className="input_title";
        title.style.width=self.textArea.offsetWidth+"px";
        title.style.display="none";

        return title;
    };
    footerAuto.prototype.listener=function(){
        var self=this;
        var title=self.createTitle();
        var valueLen=self.textArea.value.length;
        var textValue=self.textArea.value;
        var but_custom=document.querySelector('.but_custom.matter');
        but_custom.appendChild(title);
        self.input_title=document.querySelector('.input_title');
        if(valueLen>15){ //中文
            self.input_title.style.display="block";
            self.input_title.innerHTML=textValue;
        }else{
            self.input_title.style.display="none";
            self.input_title.innerHTML=textValue;
            title.remove();
        }



    };
    footerAuto.prototype.reset=function(){

        var self=this;
        self.textArea.value="";
        self.textArea.placeholder=cmp.i18n("commons.placeholder.saySomething");
        if(self.buttom_items){
            self.buttom_items.style.display="block";
            self.footer.style.display="none";
        }
        if(self.footer_kitty){
            self.footer_kitty.classList.add('icon-biaoqing');
        }

        if(self.textArea.value==null || self.textArea.value==""){
            self.input_title=document.querySelector('.input_title');
            if(self.input_title){
                self.input_title.innerHTML="";
                self.input_title.style.display='none';
            }
        }

    };
    _.footerAnimate=function(MoveHide){
        return new footerAuto(MoveHide);
    };
})(cmp);

