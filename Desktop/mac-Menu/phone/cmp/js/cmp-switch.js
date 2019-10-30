/**
 * Created by ms on 2017/8/3 0003.
 */

/**
 * 切换按钮
 * 参数：接收对象或类名
 * varstion 1.0.1
 */

(function(_){
    _.switch={};
    function Switch (dom,callback){
        var self=this;
        self.dom = (typeof dom == "object") ? dom : (document.querySelectorAll(dom).length > 1) ? document.querySelectorAll(dom):document.querySelector(dom);
        self.isActive = false;
        self.callback = callback || null;
        self.domlens = (self.dom.length > 1) ? true : false;
        self.event();
    };
    Switch.prototype.event = function(){
        var self=this;
        var DOM = self.dom;
        if(self.domlens){
            var i= 0,len=DOM.length;
            for(i;i<len;i++){
                if(DOM[i].classList.contains('cmp-disabled'))continue;
                DOM[i].addEventListener('tap',function(){
                    self.handle(this);
                },false);
            }
        }else{
            if(DOM.classList.contains('cmp-disabled'))return;
            DOM.addEventListener('tap',function(){
                self.handle(this);
            },false);
        }
    };
    Switch.prototype.handle = function(e){
        var self=this;
        if(e.classList.contains("cmp-active")){
            e.classList.remove("cmp-active");
            self.isActive = false;
        }else{
            e.classList.add("cmp-active");
            self.isActive = true;
        }
        var options = {
            target:e,
            isActive:self.isActive
        };
        self.callback && self.callback(options);
    };
    _.switch.btn = function(dom,callback){
        return new Switch(dom,callback);
    };

})(cmp);






