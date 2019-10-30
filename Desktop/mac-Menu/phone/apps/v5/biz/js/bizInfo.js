var params = {};
var isMobile=true;
var isFromM3NavBar;
cmp.ready(function() {

  cmp.backbutton();
  MBusiness.bindEvent();
  MBusiness.init();
});


var MBusiness = (function(cmp,window){
    function MBusiness(){};
    var sourceType = {
        C_iCreate:1,//新建流程
        C_iFlowList:21,//流程列表
        C_iInfoMgrAppBind:2,  //信息管理应用绑定
        C_iBaseData:3,//基础数据
        C_iQueryID:4,  //查询ID
        C_iStatisticsID:5, //统计ID
        C_iArchiveID:6, //文档文档中心ID
        C_iPublicInfoID:7,//公共信息ID
        C_iNewsID:8,//新闻ID
        C_iMenuItem:15, //表示是菜单项
        C_iFanruan:16 //凡软报表
    };
    MBusiness.init = function(){
        params = cmp.href.getParam();
        if(params==undefined){
            params={};
        }

        if(params.menuId){
            window.sessionStorage.setItem("biz_params",JSON.stringify(params));
        }else{
            params=cmp.parseJSON(window.sessionStorage.getItem("biz_params"));
        }

        if(params==null){
            cmp.notification.alert("未获取到页面参数信息！", function () {
                cmp.href.back();
            }," ",cmp.i18n("biz.page.dialog.OK"));
        }

        isFromM3NavBar=params.fromUrl == 'NavBar'?true:false;
        if (isFromM3NavBar) {
            //移除返回UI
//            document.getElementById("backBtn").style.visibility="hidden";
            //处理安卓物理返回事件
            cmp.backbutton.push(cmp.closeM3App);
        }


           // var data = $s.Biz.getBusinessMenu({},params);
        var data;
        if(cmp.storage.get("biz_info_list_type",true)!=null){
            isMobile=eval(cmp.storage.get("biz_info_list_type",true));
        }
        cmp.dialog.loading(true);
        $s.Biz.getBusinessMenu(params.menuId,isMobile,{}, {
            repeat:true,   //当网络掉线时是否自动重新连接
            success : function(ret) {
                cmp.dialog.loading(false);
                data=ret;
                data.menuId=params.menuId;
                data.fromUrl=params.fromUrl;
                params=data;
                isMobile=data.mobileConfig;
                if(data.mobileConfig){
                    var head_Btn = document.getElementById("head_Btn");
                    head_Btn.style.display="";
                    if(cmp.storage.get("biz_info_list_type",true)!=null){
                        isMobile=eval(cmp.storage.get("biz_info_list_type",true));
                        if(!isMobile){
                            head_Btn.classList.add("see-icon-v5-common-switch-grid");
                            head_Btn.classList.remove("see-icon-v5-common-switch-list");
                        }
                    }
                 }

                MBusiness.renderHeader(data);
                MBusiness.renderChildrenMenu(data);
                MBusiness.renderIndicator(data);
                MBusiness.renderADImg(data);
                MBusiness.bindPenetrateEvent(data);
            },
            error : function(e){
                cmp.dialog.loading(false);
                var cmpHandled = cmp.errorHandler(e);
                if(cmpHandled) {
                }else {
                    var msg;
                    if (e.message) {
                        msg = e.message;
                    } else if (e.responseText) {
                        msg = e.responseText;
                    } else {
                        return;
                    }

                    cmp.notification.alert(msg, function () {
                        cmp.href.back();
                    }," ",cmp.i18n("biz.page.dialog.OK"));
                }
            }
        });



    };
    MBusiness.renderHeader = function(data){
        var menuName = params.name;
        var menuId = params.menuId;
        var listContent = document.getElementById("listContent");
        if(!isMobile){
            document.body.classList.add("CRM2");
            listContent.classList.remove("list-content");
            listContent.classList.add("list-content-vertical");
        }else{
            document.body.classList.remove("CRM2");
            listContent.className = "list-content";
        }

    };
    MBusiness.renderIndicator = function(data){
        document.getElementById("indicatorContainer").innerHTML="";
        var extras = data.indicatorList;
        cmp.each(extras, function(i, obj) {
           if(obj.data==null || obj.data==""){
               obj.data="&nbsp;";
           }
        });
        if(extras && extras.length>0 && isMobile) {
            var indicator = extras;
            if(indicator && indicator.length > 0) {
                var indicatorContainer = document.getElementById("indicatorContainer");
                indicatorContainer.style.display = "";
                var indicatorTpl = document.getElementById("tpl_indicator").innerHTML;
                if(data.bizDashboardId && indicator.length>=3 &&  cmp.platform.CMPShell){//有看板只显示两个指标
                    indicator=indicator.slice(0,2);
                }
                var html = cmp.tpl(indicatorTpl, indicator);
                cmp.append(indicatorContainer, html);
                var indicator_item=indicatorContainer.querySelectorAll(".indicator-item");
                [].forEach.call(indicator_item,function(i){
                    i.addEventListener("tap",function(){
                        var data=cmp.parseJSON(this.getAttribute("info"));
                        var formqueryreportArgs={itemType:"dosearch",listType:1,id:data.queryId};
                        formqApi.jumpToFormqueryreport(formqueryreportArgs,"biz",data.queryId);
                    });
                })
                if (data.subMenus.length > 0) {  //Indicator下面第一个分类去掉边框和边距
                    var type = data.subMenus[0].sourceType;
                    if(type == sourceType.C_iMenuItem){
                        indicatorContainer.style.borderBottom="none"
                        document.querySelector(".first-level").style.marginTop="0px";
                    }
                }

            }

        }else{
            if (data.subMenus.length > 0) {  //没Indicator时，第一个分类去掉上边距，与广告图片连接
                var type = data.subMenus[0].sourceType;
                if(type == sourceType.C_iMenuItem){
                    document.querySelector(".first-level").style.marginTop="-2px";
                }
            }
        }

        if(data.bizDashboardId && isMobile && cmp.platform.CMPShell){
            var indicatorContainer = document.getElementById("indicatorContainer");
            indicatorContainer.style.display = "";
            cmp.append(indicatorContainer, '<div class="indicator-item" id="btn_kanban"><div  class="box"><i class="icon-see-icon-cap-kanbantubiao"></i>'+cmp.i18n("biz.menu.bizdashboard")+'</div></div>');
            var allowClick=true;
            document.querySelector("#btn_kanban").addEventListener("tap",function(){
                if(allowClick){
                    allowClick=false;
                    $s.CapForm.checkBizDashboardAuth(data.bizDashboardId,{}, {
                        repeat:true,   //当网络掉线时是否自动重新连接
                        success: function (ret) {
                            allowClick=true;
                            if(ret.success){
                                var platformStr="wechat_commondata";
                                if(typeof(cmp.platform.CMPShell) != 'undefined' && cmp.platform.CMPShell){
                                    platformStr="cmp_commondata";
                                    cmp.href.next(cmp.serverIp+"/seeyon/form/bizDashboard.do?method=getBizDashBoardHtmlStr&bizDashBoardId="+data.bizDashboardId+"&commonDataType="+platformStr+"&date="+(new Date().getTime()), null,{openWebViewCatch:1});
                                }else{
                                    cmp.href.next("/seeyon/form/bizDashboard.do?method=getBizDashBoardHtmlStr&bizDashBoardId="+data.bizDashboardId+"&commonDataType="+platformStr+"&date="+(new Date().getTime()));
                                }
                            }else{
                                cmp.notification.alert(ret.msg,
                                    null, cmp.i18n("biz.page.dialog.note"), cmp.i18n("biz.page.dialog.OK"));
                            }
                        },
                        error:function(e){
                            var cmpHandled = cmp.errorHandler(e);
                            if(cmpHandled) {
                            }else{
                                cmp.notification.alert(e.message, function () {
                                });
                            }
                        }
                    });
                }
            });
        }
    };
    MBusiness.renderChildrenMenu = function(data){
        var childrenMenu = data.subMenus;
        var menuContent = document.getElementById("menu_content");
        //清除菜单
        var childs = menuContent.childNodes;
        for(var i = childs.length - 1; i >= 0; i--) {
          menuContent.removeChild(childs[i]);
        }
        if(childrenMenu && childrenMenu.length > 0) {
            childrenMenu = MBusiness.convertChildrenMenu(childrenMenu);
            childrenMenu.mobileConfig = isMobile;
            var scrollerContainer = document.getElementById("scrollerContainer");
            var headerHeight =0;
//            if(document.body.classList.contains("CRM2")) headerHeight = 0;
            var headerContentHeight = document.querySelector('.head-content ').offsetHeight;
            var windowHeight = window.innerHeight || document.body.clientHeight;
            if(!isMobile) {
                scrollerContainer.style.height = (windowHeight - headerHeight - headerContentHeight) + "px";
            }else{
                scrollerContainer.style.height = windowHeight + "px";
            }
            var tempChildrenMenu = childrenMenu;
            var optimization = false;
            if(childrenMenu.length > 200) {  //优化渲染首屏，只先渲染前200条
                optimization = true;
                tempChildrenMenu = childrenMenu.slice(0,200);
                childrenMenu = childrenMenu.slice(200,childrenMenu.length);
                tempChildrenMenu.mobileConfig =isMobile;
                childrenMenu.mobileConfig = isMobile;
            }
            var menuChildrenTpl = document.getElementById("tpl_menu_content_config").innerHTML;
            var html = cmp.tpl(menuChildrenTpl,tempChildrenMenu);
            while(menuContent.hasChildNodes())
            {
                menuContent.removeChild(menuContent.firstChild);
            }
            cmp.append(menuContent,html);
            var imgCache;
            var scroller;
            setTimeout(function(){
                imgCache = cmp.imgCache(menuContent);
                scroller = new cmp.iScroll(scrollerContainer, {
                    hScroll: false,
                    vScroll: true,
                    bounce: false,
                    bounceLock: false,
                    lockDirection: false,
                    onScrollEnd:function(){
                        imgCache.inspect(this.x,this.y);
                    },
                    onRefresh:function(){
                        imgCache.inspect(this.x,this.y);
                    }
                });
            },1000);
            if(optimization){
                setTimeout(function(){
                    var restChildrenMenuHtml = cmp.tpl(menuChildrenTpl,childrenMenu);
                    cmp.append(menuContent,restChildrenMenuHtml);
                    imgCache.inspect();
                    scroller.refresh();
                    MBusiness.bindPenetrateEvent(data);
                },1500);
            }
        }else{
            cmp.notification.alert(cmp.i18n("biz.menu.nodata"),
                null, cmp.i18n("biz.page.dialog.note"), cmp.i18n("biz.page.dialog.OK"));
        }
    };
    MBusiness.convertChildrenMenu = function(childrenMenu){
        var i = 0,len = childrenMenu.length;
        var newChildrenMenu=new Array();

        for(;i<len;i++){
            var type = childrenMenu[i].sourceType;
            if(type == sourceType.C_iMenuItem) {
                newChildrenMenu.push(childrenMenu[i]);
                var j = 0,subMenu = childrenMenu[i].subMenus,sublen = childrenMenu[i].subMenus.length;
                for(;j<sublen;j++){
                    var iconId = subMenu[j].icon;
                    if(iconId != null && ( iconId.indexOf("infomanage") != -1 || iconId.indexOf("newflow") != -1
                        || iconId.indexOf("culture") != -1|| iconId.indexOf("docCenter") != -1
                        || iconId.indexOf("formQuery") != -1|| iconId.indexOf("formstat") != -1
                        || iconId.indexOf("flowlist") != -1|| iconId.indexOf("basedata") != -1
                        || iconId.indexOf("seeyonReport") != -1 )) {
                        iconId = MBusiness.convertDefaultIconId(iconId);
                    }else {
                        iconId = MBusiness.convertUploadIconId(iconId);
                    }
                    subMenu[j].iconId = iconId;
                    newChildrenMenu.push(subMenu[j]);
                }
            }else{
                var iconId = childrenMenu[i].icon;
                if(iconId != null && ( iconId.indexOf("infomanage") != -1 || iconId.indexOf("newflow") != -1
                    || iconId.indexOf("culture") != -1|| iconId.indexOf("docCenter") != -1
                    || iconId.indexOf("formQuery") != -1|| iconId.indexOf("formstat") != -1
                    || iconId.indexOf("flowlist") != -1|| iconId.indexOf("basedata") != -1
                    || iconId.indexOf("seeyonReport") != -1 )) {
                    iconId = MBusiness.convertDefaultIconId(iconId);
                }else {
                    iconId = MBusiness.convertUploadIconId(iconId);
                }
                childrenMenu[i].iconId = iconId;
                newChildrenMenu.push(childrenMenu[i]);
            }

        }

        return newChildrenMenu;
    };
    MBusiness.renderADImg = function(data){
        var background = document.getElementById('imgArea');
        if(isMobile) {
            background.style.display="block";
            var aDImg = data.adImageId;
            var ip = cmp.origin;
            var baseUrl =_bizPath+ "/img/";
            var adImgId = baseUrl + aDImg;
            if (data.adCustom == "2") {
                var h = background.offsetHeight;
                var w = background.offsetWidth;
                adImgId = ip + "/commonimage.do?method=showImage&size=custom&q=0.8&w=" + w + "&h=" + h + "&id=" + aDImg;
            }
            MBusiness.carveBackGround(adImgId);
        }else{
            background.style.display="none";
        }
    };
    MBusiness.carveBackGround = function(imgPath){
        var background=document.getElementById('imgArea');
        var backContentH=background.offsetHeight;
        var backContentW=background.offsetWidth;
        var image=new Image();
        image.src=imgPath;
        image.onload = function(){
            var imageW=image.naturalWidth;
            var imageH=image.naturalHeight;
            if(imgPath.indexOf("adImage") == -1){
                if(backContentW > imageW && backContentH > imageH){ //如果背景长宽都比图片大，那么可以直接拉伸显示
                    if(backContentW > imageW){
                        imageW = backContentW;
                    }
                    if(backContentH > imageH ){
                        imageH = backContentH;
                    }
//                image.classList.add("ground");
//                background.querySelector(".img-placeholder").remove();
//                background.appendChild(image);
                    var imgHtml = '<img src="'+imgPath+'" class="ground" style="height:'+imageH+'px;width:'+imageW+'px;">';
                    background.innerHTML = imgHtml;
                }else {
                    background.style.background='url('+imgPath+')';
                    background.style.backgroundRepeat="no-repeat";
                }
            }else {
                background.style.background='url('+imgPath+')';
                background.style.backgroundRepeat="no-repeat";
                background.style.backgroundPosition = "50% 70%";
                background.style.backgroundSize = "100%";
            }

        };

        image.onerror = function(){
            var failDiv = '<div style="width: '+backContentW+'px;height:'+backContentH+'px;line-height:'+backContentH+'px;" class="failed"></div>';
            background.innerHTML = failDiv;
        }

    };
    MBusiness.bindEvent = function(){
        cmp.backbutton.push(function(){
            cmp.storage.delete("biz_info_list_type",true);
            cmp.href.back();
        });

        var head_botton= document.getElementById("head_Btn");
        var indicatorContainer = document.getElementById("indicatorContainer");
        head_botton.addEventListener("tap",function() {
            if(isMobile){
                head_botton.classList.remove("see-icon-v5-common-switch-list");
                head_botton.classList.add("see-icon-v5-common-switch-grid");
                indicatorContainer.style.display = "none";
            }else{
                head_botton.classList.remove("see-icon-v5-common-switch-grid");
                head_botton.classList.add("see-icon-v5-common-switch-list");
               // indicatorContainer.style.display = "";
            }
            isMobile=!isMobile;
            cmp.storage.save("biz_info_list_type",isMobile,true);
            MBusiness.init();
        });

        head_botton.addEventListener("touchstart",function(e){
            var p,f1,f2;
            if(e.touches.length == 1){
              e.preventDefault();
            };
            //由于触屏的坐标是个数组，所以取出这个数组的第一个元素
            e=e.targetTouches[0];
            //保存head_botton和开始触屏时的坐标差
            p={
              x:head_botton.offsetLeft-e.clientX,
              y:head_botton.offsetTop-e.clientY
            };
            //添加触屏移动事件
            document.addEventListener("touchmove",f2=function(e){
              //获取保触屏坐标的对象
              var t=t=e.targetTouches[0];
              //把head_botton移动到初始计算的位置加上当前触屏位置
              var xx=p.x+t.clientX;
              if(xx<0){
                xx=0;
              }else if(xx+head_botton.offsetWidth>document.body.clientWidth){
                xx=document.body.clientWidth-head_botton.offsetWidth;
              }
              var yy=p.y+t.clientY;
              if(yy<0){
                yy=0;
              }else if(yy+head_botton.offsetHeight>document.body.clientHeight){
                yy=document.body.clientHeight-head_botton.offsetHeight;
              }

              head_botton.style.left=xx+"px";
              head_botton.style.top=yy+"px";
            },false);
            //添加触屏结束事件
            document.addEventListener("touchend",f1=function(e){
              //移除在document上添加的两个事件
              document.removeEventListener("touchend",f1);
              document.removeEventListener("touchmove",f2);
            },false);
        },false);

    };
    MBusiness.bindPenetrateEvent = function (data){
        var menuContent = document.getElementById("menu_content");
        var businessList = menuContent.childNodes;
        var ip =cmp.origin;
        var baseUrl = "/m3/apps/v5/";

        var _unflowformPath = "/seeyon/m3/apps/v5/unflowform";
        var _collaborationPath = "/seeyon/m3/apps/v5/collaboration";
        var _docPath = "/seeyon/m3/apps/v5/doc";
        var _formqueryreportPath = "/seeyon/m3/apps/v5/formqueryreport";
        var _bulletin="/seeyon/m3/apps/v5/bulletin/";
        var _news="/seeyon/m3/apps/v5/news/";
        var _bbs="/seeyon/m3/apps/v5/bbs/";
        var _inquiry="/seeyon/m3/apps/v5/inquiry/";
        if(typeof(cmp.platform.CMPShell) != 'undefined' && cmp.platform.CMPShell){
            _unflowformPath = "http://unflowform.v5.cmp/v";
            _collaborationPath = "http://collaboration.v5.cmp/v";
            _docPath = "http://doc.v5.cmp/v";
            _formqueryreportPath = "http://formqueryreport.v5.cmp/v";
            _bulletin = "http://bulletin.v5.cmp/v";
            _news = "http://news.v5.cmp/v";
            _bbs = "http://bbs.v5.cmp/v";
            _inquiry = "http://inquiry.v5.cmp/v";
        }

        if(businessList && businessList.length > 0) {
            var i = 0,len = businessList.length;
            for(;i<len;i++) {
                (function(i){
                    if(!businessList[i].classList.contains("first-level") && !businessList[i].classList.contains("binded")){
                        businessList[i].classList.add("binded");
                        businessList[i].addEventListener("tap",function(){
                            cmp.storage.save("biz_info_list_type",isMobile,true);
                            var info = businessList[i].getAttribute("info");
                            var MBGMenu = {
                                menuId:data.id,
                                name:data.name
                            };
                            var MBGChildMenu = cmp.parseJSON(info);
                            MBGChildMenu.iconId = "";//将图片路径干掉
                            var menuType = MBGChildMenu.sourceType;
                            if(menuType == sourceType.C_iQueryID || menuType == sourceType.C_iStatisticsID){//查询统计
                                var formqueryreportArgs={itemType:"dosearch",listType:(menuType == sourceType.C_iQueryID?1:2),id:MBGChildMenu.sourceId};

                                formqApi.jumpToFormqueryreport(formqueryreportArgs,"biz",MBGChildMenu.sourceId);
                            }else if(menuType==sourceType.C_iCreate ){//新建流程
                                //if(MBGChildMenu.hasRedTemplate){//该表单暂不支持在移动端使用， 请在电脑端使用
                                //    cmp.notification.alert(cmp.i18n("biz.template.alert.hasRedTpl"),
                                //        null, cmp.i18n("biz.page.dialog.note"), cmp.i18n("biz.page.dialog.OK"));
                                //    return;
                                //}
                                //var backPageInfo={url:_bizPath + "/html/bizInfo.html?date="+(new Date().getTime()),data:params}
                                collApi.jumpToNewtemplateIndex(MBGChildMenu.sourceId);
                            }else if(menuType==sourceType.C_iFlowList){//流程列表
                                var param={'templeteIds':MBGChildMenu.sourceId,'_listTitle':MBGChildMenu.name,'openFrom':true};

                                if(MBGChildMenu.sourceId=="0"){  //合并后的流程
                                     var para={"menuId":MBGChildMenu.id,"templeteId":MBGChildMenu.sourceId};
                                    $s.Biz.listBizColList({}, para, {
                                        repeat:true,   //当网络掉线时是否自动重新连接
                                        success : function(ret) {
                                            param.templeteIds=ret.templateIds;
                                            collApi.jumpToColList(ret.templateIds,MBGChildMenu.name,"listPending");
                                        },
                                        error:function(e){
                                            var cmpHandled = cmp.errorHandler(e);
                                            if(cmpHandled) {
                                            }else{
                                                cmp.notification.alert(e.message, function () {
                                                });
                                            }
                                        }
                                    });
                                }else{
                                    collApi.jumpToColList(MBGChildMenu.sourceId,MBGChildMenu.name,"listPending");
                                }
                            }else if(menuType==sourceType.C_iInfoMgrAppBind || menuType==sourceType.C_iBaseData){ //基础数据信息管理
                              MBusiness.openMenu(_unflowformPath + "/html/index.html?date="+(new Date().getTime()), MBGChildMenu);

                            }else if(menuType==sourceType.C_iArchiveID){//文档中心
                                var param={'id':MBGChildMenu.sourceId,'isForm':true,'fromBiz':true};
                              MBusiness.openMenu(_docPath+ "/html/docList.html?date="+(new Date().getTime()), param);

                            } else  if(menuType==7 || menuType==11){//公告：7、11
                              MBusiness.openMenu(_bulletin+ "/html/bulIndex.html"+"?r="+Math.random(), {'typeId': MBGChildMenu.sourceId});

                            }else  if(menuType==8 || menuType==12){//新闻：8、12
                              MBusiness.openMenu(_news+ "/html/newsIndex.html"+"?r="+Math.random(), {'typeId': MBGChildMenu.sourceId});

                            }else  if(menuType==9 || menuType==13){//讨论：9、13
                              MBusiness.openMenu(_bbs+ "/html/bbsIndex.html"+"?r="+Math.random(), {'typeId': MBGChildMenu.sourceId});

                            }else  if(menuType==10 || menuType==14){//调查：10、14
                              MBusiness.openMenu(_inquiry+ "/html/inquiryIndex.html"+"?r="+Math.random(), {'typeId': MBGChildMenu.sourceId});

                            } else if(menuType == sourceType.C_iFanruan){//凡软报表
                                var url = cmp.seeyonbasepath + "/seeyonReport/seeyonReportController.do?method=redirectSeeyonReportH5&templateId=" + MBGChildMenu.sourceId;
                                cmp.href.open(url, MBGChildMenu.name);
                            }
                            
                        });
                    }
                })(i);
            }
        }
    };

    MBusiness.openMenu=function (url,param) {
      if(isFromM3NavBar) {
        cmp.href.next(url, param,{openWebViewCatch:1});
      }else{
        cmp.href.next(url, param);
      }
    };

    MBusiness.parseUrl = function(){
        var ip =  window.location.origin,
        search = window.location.search;
        search = search.replace("?","");
        var params = search.split("&");
        var i = 0,len = params.length;
        var jsessionid = "";
        if(params.length > 0) {
            for(;i<len;i++){
                if(params[i].indexOf("jsessionid") != -1){
                    jsessionid = params[i];
                    break;
                }
            }
        }
        return {
            ip :ip ,  //测试IP
            jsessionid:jsessionid
        }
    };
    MBusiness.getQSLink = function(menuObj){
        var os = (cmp.os.android || cmp.os.iPhone)?"phone" : (cmp.os.iPad)?"phone":"phone";//暂时都在phone端，如果以后需要支持pad版再改
        return cmp.origin + "/cmp/apps/m1mobileform/"+os+"/index.html#dosearch/"+menuObj.extra.aListType+"/" + menuObj.extra.aId + "\/\/business";
    };
    MBusiness.isDebug = function(){
        return (cmp.os.mobile && navigator.platform != "Win32" && navigator.platform != "Windows")?false:true;
    };
    MBusiness.convertDefaultIconId = function(iconId){
        var defaultImgBasePath = "/common/form/bizconfig/images/";
        return  cmp.origin + defaultImgBasePath + iconId;
    };
    MBusiness.convertUploadIconId = function(iconId){
        var a8UploadImgPath = "/commonimage.do?method=showImage&q=0.5&size=custom&w=50&h=54&id="+iconId;
        return cmp.origin + a8UploadImgPath;
    };
    return MBusiness;
})(cmp,window);
