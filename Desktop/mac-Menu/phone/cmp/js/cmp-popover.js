/**
 * Created by Administrator on 2017/1/17 0017.
 */

//======================================================================================新增弹出菜单组件 start====================//
//这个是弹出列表选择组件,并不是很多地方用,是可以放这里的.
(function(_){
    
    var PopHtml =
        '    <div class="cmp-popover-arrow"></div> ' +
        '    <div id="listView_popover"  class="cmp-scroll-wrapper listView_popover">' +
        '         <div class="cmp-scroll">' +
        '             <ul class="cmp-table-view">' +
        '             <% for(var i=0,lens=this.items.length ; i < lens ; i++)  { %>'+
        '                 <li class="cmp-table-view-cell cmp-after-line">' +
        '                      <span class="items-value"><%= this.items[i].value %></span>' +
        '                      <% if(this.items[i].setting == 1 ){ %>' +
        '                      <div class="popover-switch cmp-pull-right">' +
        '                          <div class="cmp-switch cmp-switch-blue cmp-switch-mini" >' +
        '                              <div class="cmp-switch-handle"></div>' +
        '                          </div>' +
        '                      </div>' +
        '                      <% }%>' +
        '                  </li>' +
        '             <% } %>'+
        '             </ul>' +
        '        </div>' +
        '    </div>';

    _.popover = {};

    var PopSelectList=function(options){
        var self = this;
        self.opts = options || _.extend({
                container:"#middlePopover",
                listView:false,
                items: '',
                callback:null
            });
        self.wrapper = (typeof self.opts.container == 'object') ? self.opts.container : document.querySelector(self.opts.container) ;
        self.init(self.opts);
    };
    PopSelectList.prototype.init=function(opts){
        var self = this;
        self.wrapper.innerHTML = _.tpl(PopHtml,opts);
        document.body.appendChild(self.wrapper);
        self.wrapper.style.height = opts.items.length * 45 +"px";
        self.wrapper.style.maxHeight = "350px";
        self.wrapper.style.marginLeft = "5px";
        if(opts.listView){
            var listId=self.wrapper.querySelector('#listView_popover');
            _.listView('#listView_popover');
        }
        self.event();
    };
    PopSelectList.prototype.event=function(){
        var self =this;
        var lists = self.wrapper.querySelectorAll('.cmp-table-view-cell');
        var i= 0,len=lists.length;

        for(;i<len;i++){
            (function(index){
                var InitSwitch = lists[index].querySelector('.cmp-switch');
                if(InitSwitch){
                    _(InitSwitch).switch();
                    if(self.opts.items[index].mark == "1"){
                        InitSwitch.classList.add('cmp-active');
                    }
                }
                lists[index].addEventListener('click',function(){
                    var popoverSwitch = this.querySelector('.popover-switch');
                    var switchValue= this.querySelector('.items-value').innerHTML;
                    var switchBtn=null;
                    var markObj;
                    if(!popoverSwitch){
                        cmp(self.wrapper).popover("toggle");
                    }else{
                        switchBtn = popoverSwitch.querySelector('.cmp-switch');
                        _(switchBtn).switch().toggle();
                        markObj = switchBtn.classList.contains('cmp-active') ? 1 : 0;
                    }
                    var value = {
                        condition:self.opts.items[index].condition,
                        value :switchValue,
                        mark: markObj
                    };
                    self.opts.callback && self.opts.callback(value);

                },false);

            })(i);
        }

    };

    _.popover.init=function(options){
        new PopSelectList(options);
    };


})(cmp);

//======================================================================================新增弹出菜单组件 end====================//

