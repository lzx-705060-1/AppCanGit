var newsIssue = {};
(function(_){
    cmp.i18n.load(_newsPath + "/i18n/", "News",function(){
        _.issue = {};
        _.issue.init = function (selector, params, callBack) {
            return new Issue(selector, params, callBack);
        };
        function Issue(selector, params, callBack) {
            _.self=this;
            _.self.typeId = "";
            _.self.imageId = "";
            _.self.imgNews = "0";
            _.self.showPub = "0";
            _.self.toPdf = "";
            _.self.filename = "";
            _.self.filesize = "";
            _.self.selector = selector;
            _.self.wrapper = document.getElementById(selector);
            _.self.wrapper.innerHTML = cmp.tpl(issueUI,{});
            document.getElementById(selector).style.zIndex = "80";
            _.self.typeListData= _.self._getTypeListData(params, selector, callBack);
        }
        Issue.prototype._getTypeListData = function (params, selector, callback) {
            _.self=this;
            $s.CmpNews.preIssueNews(params.bodyType,"", {
                repeat:true,   //当网络掉线时是否自动重新连接
                success: function(result) {
                  cmp.dialog.loading(false);
                    if(!result.issueFlag || result.typeList.length == 0){
                        cmp.notification.alert(cmp.i18n("news.h5.noPublishPower"), function() {
                          if(callback && typeof callback == "function"){
                                callback(false);
                            }
                        }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
                    } else {
                        document.getElementById(_.self.selector).classList.add('cmp-active');
                        _.self.TypeListData = result;
                        _.self._initDom(result);
                        _.self.cancelObject(selector, callback);
                        _.self.sureObject(params, callback);
                    }
                },
                error:function(error){
                    var cmpHandled = cmp.errorHandler(error);
                    if(cmpHandled){
                        //cmp处理了这个错误
                    }else {
                        //customHandle(error) ;//走自己的处理错误的逻辑
                    }
                }
            });
    
        }
        Issue.prototype._initDom = function (data) {
            _.self=this;
            document.getElementById("news-type").innerHTML=cmp.tpl(issueLi, data.typeList);
            _.self._bindEvent(data.typeList.length);
            if(data.typeList.length > 0){
                var farDom = document.getElementById("news-type");
                farDom.firstElementChild.firstElementChild.classList.remove("see-icon-radio-unchecked");
                farDom.firstElementChild.firstElementChild.classList.add("see-icon-success-circle-fill");
                farDom.firstElementChild.firstElementChild.style.color = "#3aadfb";
                farDom.children[1].style.display = "block";
                _.self.typeId = farDom.firstElementChild.getAttribute("typeId");
            }
            cmp.i18n.detect();
        }
        /**
         * 绑定事件
         * @private
         */
        Issue.prototype._bindEvent = function (length) {
            _.self=this;
            for(var i= 0;i<length;i++){
                //版块绑定事件
                cmp("#news-type").on('tap', ".news-exe-" + i, function(e) {
                    var listI = this.getAttribute("list");
                    var thisExe = _$(".news-exe-" + listI,true)[0];
                    var thisExeDetail = document.getElementsByClassName("news-exe-detail-" + listI)[0];
                    for(var j= 0;j<length;j++){
                        _$(".news-exe-detail-" + j,true)[0].style.display = "none";
                        _$(".news-exe-" + j,true)[0].firstElementChild.classList.add("see-icon-radio-unchecked");
                        _$(".news-exe-" + j,true)[0].firstElementChild.classList.remove("see-icon-success-circle-fill");
                        _$(".news-exe-" + j,true)[0].firstElementChild.style.color = "";
                        _$(".news-exe-detail-" + j,true)[0].firstElementChild.firstElementChild.firstElementChild.lastElementChild.classList.add("see-icon-checked");
                        _$(".news-exe-detail-" + j,true)[0].firstElementChild.firstElementChild.firstElementChild.lastElementChild.classList.remove("see-icon-checked-fill");
                        _$(".news-exe-detail-" + j,true)[0].firstElementChild.firstElementChild.firstElementChild.lastElementChild.style.color = "";
                        _$(".news-exe-detail-" + j,true)[0].firstElementChild.firstElementChild.lastElementChild.lastElementChild.classList.add("see-icon-checked");
                        _$(".news-exe-detail-" + j,true)[0].firstElementChild.firstElementChild.lastElementChild.lastElementChild.classList.remove("see-icon-checked-fill");
                        _$(".news-exe-detail-" + j,true)[0].firstElementChild.firstElementChild.lastElementChild.lastElementChild.style.color = "";
                        _$(".news-exe-detail-" + j,true)[0].firstElementChild.lastElementChild.style.display = "none";
                        if(_$(".line2-" + j,true)[0] && _$(".line2-" + j,true)[0].childElementCount > 2){
                            _$(".line2-" + j,true)[0].removeChild(_$(".line2-" + j,true)[0].children[0]);
                            _$(".line2-" + j,true)[0].children[0].style.display = "block";
                            _$(".line2-" + j,true)[0].lastElementChild.style.display = "none";
                        }
                    }
                    thisExeDetail.style.display = "block";
                    thisExe.firstElementChild.classList.remove("see-icon-radio-unchecked");
                    thisExe.firstElementChild.classList.add("see-icon-success-circle-fill");
                    thisExe.firstElementChild.style.color = "#3aadfb";
                    thisExeDetail.firstElementChild.firstElementChild.firstElementChild.lastElementChild.classList.add("see-icon-checked");
                    thisExeDetail.firstElementChild.firstElementChild.firstElementChild.lastElementChild.classList.remove("see-icon-checked-fill");
                    thisExeDetail.firstElementChild.firstElementChild.firstElementChild.lastElementChild.style.color = "";
                    thisExeDetail.firstElementChild.firstElementChild.lastElementChild.lastElementChild.classList.add("see-icon-checked");
                    thisExeDetail.firstElementChild.firstElementChild.lastElementChild.lastElementChild.classList.remove("see-icon-checked-fill");
                    thisExeDetail.firstElementChild.firstElementChild.lastElementChild.lastElementChild.style.color = "";
                    _.self.typeId = this.getAttribute("typeId");
                    _.self.imgNews = "0";
                    _.self.showPub = "0";
                    _.self.imageId = "";
                    _.self.filename = "";
                    _.self.filesize = "";
                    if(imgUpUtil.self.fileUrl){
                        imgUpUtil.self.fileUrl = null;
                    }
                });
                //图片新闻绑定事件
                cmp(".news-exe-detail").on('tap', ".new-exe-detail-pic-" + i, function(e) {
                    var picI = this.getAttribute("picI");
                    var thisPic = _$(".new-exe-detail-pic-" + picI,true)[0];
                    if(thisPic.lastElementChild.classList.contains("see-icon-checked")){
                        if(!cmp.platform.CMPShell){
                            cmp.notification.toast(cmp.i18n("news.h5.noPicture"),"center");
                            return;
                        }
                        _$(".line2-" + picI,true)[0].style.display = "block";
                        _$(".line1-" + picI,true)[0].style.width = "100%";
                        _$(".line1-" + picI,true)[0].style.marginLeft = "0";
                        _$(".line1-" + picI,true)[0].style.paddingLeft = "0";
    
                        thisPic.lastElementChild.classList.remove("see-icon-checked");
                        thisPic.lastElementChild.classList.add("see-icon-checked-fill");
                        thisPic.lastElementChild.style.color = "#3aadfb";
                        _.self.imgNews = "1";
                    } else {
                        _$(".line2-" + picI,true)[0].style.display = "none";
                        _$(".line1-" + picI,true)[0].style.width = "auto";
                        _$(".line1-" + picI,true)[0].style.marginLeft = "-16px";
                        _$(".line1-" + picI,true)[0].style.paddingLeft = "16px";
    
                        thisPic.lastElementChild.classList.add("see-icon-checked");
                        thisPic.lastElementChild.classList.remove("see-icon-checked-fill");
                        thisPic.lastElementChild.style.color = "";
                        _.self.imgNews = "0";
                    }
                });
                //显示发布人绑定事件
                cmp(".news-exe-detail").on('tap', ".new-exe-detail-person-" + i, function(e) {
                    var personI = this.getAttribute("personI");
                    var thisPerson = _$(".new-exe-detail-person-" + personI,true)[0];
                    if(thisPerson.lastElementChild.classList.contains("see-icon-checked")){
                        thisPerson.lastElementChild.classList.remove("see-icon-checked");
                        thisPerson.lastElementChild.classList.add("see-icon-checked-fill");
                        thisPerson.lastElementChild.style.color = "#3aadfb";
                        _.self.showPub = "1";
                    }else{
                        thisPerson.lastElementChild.classList.add("see-icon-checked");
                        thisPerson.lastElementChild.classList.remove("see-icon-checked-fill");
                        thisPerson.lastElementChild.style.color = "";
                        _.self.showPub = "0";
                    }
                });
                //上传图片绑定事件
                cmp(".news-exe-detail-line2").on('tap', ".see-icon-v5-common-add-" + i, function(e) {
                    var imgI = this.getAttribute("imgI");
                    imgUpUtil.upload.init("line2-" + imgI, "1", "successCallBack");
                });
            }
            function _$(selector, queryAll, pEl) {
                var p = pEl ? pEl : document;
                if (queryAll) {
                    return p.querySelectorAll(selector);
                } else {
                    return p.querySelector(selector);
                }
            }
        }
        Issue.prototype.cancelObject=function(selector,callback){
            _.self=this;
            cmp("#news-choose").on('tap', ".news-choose-btn1", function(e) {
                if(callback && typeof callback == "function"){
                    callback(false);
                }
                document.getElementById(selector).classList.remove('cmp-active');
            });
            /*cmp("#news_header").on('tap', "#prev", function(e) {
                document.getElementById(selector).classList.remove('cmp-active');
                if(callback && typeof callback == "function"){
                    callback(false);
                }
            });*/
            cmp.backbutton();
            cmp.backbutton.push(function(){
              cmp.backbutton.pop();
                document.getElementById(selector).classList.remove('cmp-active');
                if(callback && typeof callback == "function"){
                    callback(false);
                }
            });
        }
        Issue.prototype.sureObject=function(params,callback){
            _.self=this;
            var clickFlag = false;
            cmp("#news-choose").on('tap', ".news-choose-btn2", function(e) {
                if (clickFlag) {
                    return;
                }
                clickFlag = true;
                if(_.self.imgNews == "1"){
                    if(!imgUpUtil.self || !imgUpUtil.self.fileUrl){
                        clickFlag = false;
                        cmp.notification.toast(cmp.i18n("news.h5.uploadPicturePlease"),"center");
                        return;
                    }
                    _.self.imageId = imgUpUtil.self.fileUrl;
                    splitFilename = imgUpUtil.self.imgList[0].filepath.split("/");
                    _.self.filename = splitFilename[splitFilename.length-1];
                    _.self.filesize = imgUpUtil.self.imgList[0].filesize;
                }
                var issueParam = {
                    "summaryId": params.summaryId,
                    "affairId": params.affairId,
                    "typeId": _.self.typeId,
                    "imageId": _.self.imageId,
                    "imageNews": _.self.imgNews,
                    "toPdf": "0",
                    "filename": _.self.filename,
                    "filesize": _.self.filesize,
                    "rightId": params.rightId ? params.rightId : "",
                    "showPublishUserFlag":_.self.showPub
                };
                if(issueParam.typeId){
                    cmp.dialog.loading();
                    $s.CmpNews.issueNews("", issueParam,{
                        repeat:false,   //当网络掉线时是否自动重新连接
                        error:function(error){
                            var cmpHandled = cmp.errorHandler(error);
                            if(cmpHandled){
                                //cmp处理了这个错误
                            }else {
                                //customHandle(error) ;//走自己的处理错误的逻辑
                                if(callback && typeof callback == "function"){
                                    callback(true);
                                }
                            }
                        },
                        success:function(e){
                           if(callback && typeof callback == "function"){
                               callback(true);
                           }
                        }
                    });
                } else {
                    clickFlag = false;
                    cmp.notification.toast(cmp.i18n("news.h5.chooseTypePlease"),"center");
                }
            });
        }
        var issueUI =
            /*'<header id="news_header" class="cmp-bar cmp-bar-nav head-style">'+
            '   <a class="cmp-action-back cmp-icon see-icon-v5-common-arrow-back cmp-pull-left cmpCommonPageBackBtn" id="prev" style="padding-top: 0;padding-bottom: 0"><i18n key="news.h5.back"></i18n></a>'+
            '   <h1 class="cmp-title"><span><i18n key="news.h5.chooseType"></i18n></span></h1>'+
            '</header>'+*/
            '<div id="news-type" class="cmp-content cmp-content-none position_relative">'+
            '</div>'+
            '<footer id="news-choose">'+
            '<div class="footer_block"></div>'+
            '    <div class="news-div-btn">'+
            '        <div class="news-choose-btn news-choose-btn1">'+
            '            <span class="news-choose-publish"><i18n key="news.h5.cancel"></i18n></span>'+
            '        </div>'+
            '        <div class="news-choose-btn news-choose-btn2">'+
            '            <span class="news-choose-approval"><i18n key="news.h5.OK"></i18n></span>'+
            '        </div>'+
            '        <div style="clear: both;"></div>'+
            '    </div>'+
            '</footer>';
        var issueLi =
            '<% for(var i = 0,len = this.length;i < len; i++){ %>'+
            '<% var obj = this[i]; %>'+
            '   <div class="cmp-ellipsis news-exe news-exe-<%=i%>" list="<%=i%>" typeId = "<%=obj.id%>">'+
            '        <span class="news-radio see-icon-radio-unchecked"></span>'+
            '        <span class="news-exe-name"><%=escapeStringToHTML(obj.typeName) %></span>'+
            '    </div>'+
            '    <div class="news-exe-detail news-exe-detail-<%=i%>">'+
            '      <div class="news-exe-detail-block">'+
            '        <div class="news-exe-detail-line1 line1-<%=i%>">'+
            '            <div class="new-exe-detail-pic new-exe-detail-pic-<%=i%>" picI="<%=i%>" style="display: inline-block;text-align: left;">'+
            '                <span class="news-name"><i18n key="news.h5.pictureNews"></i18n></span>'+
            '                <span class="news-icon see-icon-checked"></span>'+
            '            </div>'+
            '            <div class="new-exe-detail-person new-exe-detail-person-<%=i%>" personI="<%=i%>" style="display: inline-block;text-align: left;margin-left: 54px;">'+
            '                <span class="news-name"><i18n key="news.h5.showPublishUser"></i18n></span>'+
            '                <span class="news-icon see-icon-checked see-icon-checked-<%=i%>"></span>'+
            '            </div>'+
            '        </div>'+
            '        <div class="news-exe-detail-line2 line2-<%=i%>">'+
            '            <div style="width: 50px;height: 50px;border: 1px solid #d4d4d4;text-align: center;">'+
            '                <span class="see-icon-v5-common-add see-icon-v5-common-add-<%=i%>" imgI="<%=i%>" style="font-size: 45px;color: #d4d4d4;"></span>'+
            '            </div>'+
            '            <div class="icon cmp-icon see-icon-close-circle-fill img-clear-<%=i%>" style="font-size:20px;color:red;position:absolute;top: 6px;left: 53px;z-index: 81;display:none;"></div>'+
            '        </div>'+
            '      </div>'+
            '    </div>'+
            '<% } %>';
    });
})(newsIssue);
var imgUpUtil = {};
(function(_){
    cmp.i18n.load(_newsPath + "/i18n/", "News",function(){
        _.upload = {};
        _.upload.init = function (selector, pictureNum, successCallBack) {
            return new upload(selector, pictureNum, successCallBack);
        };
        function upload(selector, pictureNum, successCallBack) {
            _.self=this;
            _.self.selector = selector;
            _.self.pictureNum = pictureNum;
            _.self.successCallBack = successCallBack;
            _.self.getPicture();
            cmp.i18n.detect();
    
        }
        upload.prototype.getPicture = function () {
            _.self=this;
            var _takePhoto = cmp.i18n("news.h5.takePhoto");
            var _chooseFromMobile = cmp.i18n("news.h5.chooseFromMobile");
            var _cancel = cmp.i18n("news.h5.cancel");
            var items = [ {
                key : "1",
                name : _takePhoto
            }, {
                key : "2",
                name : _chooseFromMobile
            } ];
            cmp.dialog.actionSheet(items, _cancel, function(item) {
                if(item.key == "1" || item.key == "2"){
                    var type = item.key == "2" ? 0 : 1;
                        cmp.camera.getPictures({
                            compress:false,  //是否生成缩略图
                            sourceType: parseInt(type),
                            quality: 60,
                            destinationType: 1,
                            url:cmp.seeyonbasepath + "/rest/attachment?option.n_a_s=1",
                            pictureNum: parseInt(_.self.pictureNum),
                            success: _.self.uploadPicture,
                            error:function(res){
                                //TODO 取消拍照走的error路线，这个后续一定要让他们改
                                //if(res){
                                //    cmp.notification.alert("error:"+cmp.toJSON(res));
                                //}
                            }
                        });
    
                }
            }, function() {
                console.log("您点击了取消按钮!");
            });
        }
        upload.prototype.uploadPicture = function (imgObj) {
            cmp.dialog.loading(cmp.i18n("news.h5.uploadingPicture"));
            _.self.imgObj = imgObj;
            var imgList = [];
            imgList[0] = {
                filepath : imgObj.files[0].filepath,
                filename : "",
                filesize : imgObj.files[0].fileSize,
                fileId : cmp.buildUUID(19,10)
            };
            _.self.imgList = imgList;
            var urlLast = "/rest/attachment?extensions=jpeg,jpg,png,gif&type=5&applicationCategory=8&maxSize=4194304&firstSave=true&option.n_a_s=1";
            cmp.att.upload({
                url: cmp.seeyonbasepath + urlLast,
                fileList: imgList,
                imgIndex:"sortNum",
                title: "",
                extData: "",
                success: function (result) {
                    console.log("upload success↓");
                    var atts = JSON.parse(result.response).atts;
                    _.self.fileUrl = atts[0].fileUrl;
                    _.self.showPicture();
                },
                progress:function(result){
                    console.log("progress↓");
                    //console.log(result.pos);  //0~1的小数，即上传进度的百分比
                },
                error: function (res) {
                    console.log("upload error↓");
                    console.log(res);
                }
            });
    
        }
        upload.prototype.showPicture = function () {
            _.self=this;
            var imgContainer = document.querySelector("." + _.self.selector);
            var imgAdd = imgContainer.firstElementChild;
            //base64用于显示
            var divDom = document.createElement("div");
            divDom.classList.add("img");
            divDom.style.overflow = "hidden";
            var imgDom = document.createElement("img");
            imgDom.src =  _.self.imgObj.files[0].base64;
            imgDom.setAttribute("filepath",_.self.imgObj.files[0].filepath);
            imgContainer.insertBefore(divDom,imgAdd);
            imgDom.onload = function(){
                imgDom.style.width = "50px";
                imgDom.style.height = "50px";
                //绑定点击大图事件
                imgDom.addEventListener("tap", function(){
                    var imgArray = [];
                    imgArray.push(imgDom.src);
                    //调度大图查看
                    cmp.sliders.addNew(imgArray);
                    cmp.sliders.detect("0");
                });
                imgAdd.style.display = "none";
                divDom.appendChild(imgDom);
                imgContainer.lastElementChild.style.display = "block";
                //绑定删除图片事件
                imgContainer.lastElementChild.addEventListener("tap", function(){
                    cmp.notification.confirm(cmp.i18n("news.h5.sureToDelete"), function(e) {
                      if (e == 1) {
                        imgContainer.children[2].style.display = "none";
                          imgContainer.children[1].style.display = "block";
                          imgContainer.removeChild(imgContainer.children[0]);
                          _.self.fileUrl = null;
                          imgContainer.lastElementChild.removeEventListener("tap",function(){});
                      }
                    }, null, [cmp.i18n("news.h5.cancel"), cmp.i18n("news.h5.OK")]);
                });
            }
            cmp.dialog.loading(false);
    
        }
    });
})(imgUpUtil);