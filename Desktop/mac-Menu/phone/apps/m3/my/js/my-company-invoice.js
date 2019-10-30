/**
 * @description 我的模块——我的企业-发票抬头
 * @author Ms
 * @createDate 2017-07-25
 */
;(function() {
    var m3,m3Cache;
    define(function(require, exports, module){
        require('zepto');
        m3 = require('m3');
        require('commons');
        m3Cache = require('nativeCache');
        initPage();
    });
    

    //入口函数
    function initPage() {
        cmp.ready(function() {
            initEvent();
            m3Cache.getCache("my_company_invoice_data",function(res){
                if(res.length > 0){
                    loadData(res);
                }else{
                    cmp.dialog.loading({status:"nocontent"});
                }
            },function(){
                cmp.dialog.loading({status:"nocontent"});
            });
            
        });
    }

    //事件初始化
    function initEvent() {
        $("#backBtn").on("tap", function() {
            cmp.href.back();
        });
        //安卓自带返回键
        document.addEventListener("backbutton", function() {
            cmp.href.back();
        });
        document.querySelector('.invoiceData').style.height = window.innerHeight - $('header').height() +"px";
        // cmp.listView("#listView");
    }

    function loadData(data){
        var html = '';
        data.sort(function (a, b) {
          return b.createDate - a.createDate
        });
        var i=0,len=data.length;
        var mark = 0;
        for(i;i<len;i++){
            var datas = data[i];
            mark++;
            html += '<div class="title-invoice">'+fI18nData["my.m3.h5.invoicetil"]+''+ mark +'</div><ul class="cmp-table-view new_list company-list">';
            if(datas.orgName){  //企业名称
                html += '<li class="cmp-table-view-cell" >'+
                '<div class="cmp-pull-left company-text">'+
                    '<p class="datainfo invoice-text" readonly="auto">'+ datas.orgName.escapeHTML() +'</p>'+
                    // '<div class="datainfo">'+ datas.orgName.escapeHTML() +'</div>'+
                    '<div class="text">'+ fI18nData["my.m3.h5.enterpriseName"] +'</div>'+
                '</div></li>';
            }
            if(datas.identificationNumber){  //纳税人识别号
                html += '<li class="cmp-table-view-cell" >'+
                '<div class="cmp-pull-left company-text">'+
                    '<p class="datainfo invoice-text" readonly="auto">'+ datas.identificationNumber.escapeHTML() +'</p>'+
                    '<div class="text">'+ fI18nData["my.m3.h5.identificationNumber"] +'</div>'+
                '</div></li>';
            }
            if(datas.address){  //地址
                html += '<li class="cmp-table-view-cell" >'+
                '<div class="cmp-pull-left company-text">'+
                '<p class="datainfo invoice-text" readonly="auto">'+ datas.address.escapeHTML() +'</p>'+
                    '<div class="text">'+ fI18nData["my.m3.h5.address"] +'</div>'+
                '</div></li>';
            }
            if(datas.depositBank){  //开户银行
                html += '<li class="cmp-table-view-cell" >'+
                '<div class="cmp-pull-left company-text">'+
                '<p class="datainfo invoice-text" readonly="auto">'+ datas.depositBank.escapeHTML() +'</p>'+
                    '<div class="text">'+ fI18nData["my.m3.h5.depositBank"] +'</div>'+
                '</div></li>';
            }
            if(datas.account){  //银行账号
                html += '<li class="cmp-table-view-cell" >'+
                '<div class="cmp-pull-left company-text">'+
                '<p class="datainfo invoice-text" readonly="auto">'+ datas.account.escapeHTML() +'</p>'+
                    '<div class="text">'+ fI18nData["my.m3.h5.account"] +'</div>'+
                '</div></li>';
            }
            if(datas.contactNumber){  //联系电话
                html += '<li class="cmp-table-view-cell" >'+
                '<div class="cmp-pull-left company-text">'+
                '<p class="datainfo invoice-text" readonly="auto">'+ datas.contactNumber.escapeHTML() +'</p>'+
                    '<div class="text">'+ fI18nData["my.m3.h5.contactNumber"] +'</div>'+
                '</div></li>'; 
            }
            if(datas.postcode){  //邮政编码
                html += '<li class="cmp-table-view-cell" >'+
                '<div class="cmp-pull-left company-text">'+
                '<p class="datainfo invoice-text" readonly="auto">'+ datas.postcode.escapeHTML() +'</p>'+
                    '<div class="text">'+ fI18nData["my.m3.h5.PostalCode"] +'</div>'+
                '</div></li>';
            }
            html += '</ul>';
            $('#invoiceData').append(html);
            html = "";
        }
        // var datainfos = document.querySelectorAll('.datainfo');
        // for(var k=0;k<datainfos.length;k++){
        //     var scrollH = datainfos[k].scrollHeight;
        //     datainfos[k].style.height = scrollH +"px";
        // }
        // cmp.listView("#listView").refresh();
    }


})();
