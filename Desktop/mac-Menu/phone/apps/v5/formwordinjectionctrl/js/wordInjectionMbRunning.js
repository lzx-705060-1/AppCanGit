(function () {
    var nameSpace = 'feild_1872888230778916558';
    var self = {};

    self.adaptation = {};
    self.formMessage = {};
    self.att = [];
    self.aId = '';
    self.getData = {};
    self.privateId='';
    self.dynamicLoading = {
        css: function (path) {
            if (!path || path.length === 0) {
                throw new Error('argument "path" is required !');
            }
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.href = path;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.appendChild(link);
        },
        js: function (path) {
            if (!path || path.length === 0) {
                throw new Error('argument "path" is required !');
            }
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.src = path;
            script.type = 'text/javascript';
            head.appendChild(script);
        }
    }

    self.init = function (res) {
        var adaptation = res.adaptation;
        var url_prefix = res.url_prefix;
        var privateId = res.privateId;
        self.privateId=privateId;
        self.formMessage = res.formMessage;
        self.getData = res.getData;
        var dataObj = adaptation.childrenGetPrivateMessage(privateId);
        self.messageObj = adaptation.childrenGetData(privateId);
        self.appendChildDom(adaptation, self.messageObj, privateId, res.getData);

        // 监听是否数据刷新
        adaptation.ObserverEvent.listen('Event' + privateId, function(data) {
            self.getData=data;
            self.messageObj = adaptation.childrenGetData(privateId);
            self.appendChildDom(adaptation, self.messageObj, privateId,data);
        });
    };

    self.appendChildDom = function (adaptation, messageObj, privateId, getData) {
        switch ('button') {
            case 'button':
                self.customButton(adaptation, messageObj, privateId, getData);
                break;
            default:
        }
    };
    self.customButton = function (adaptation, messageObj, privateId, getData) {

        if (adaptation) {
            self.adaptation = adaptation;
        }
        //----------创建DOM---------
        var domStructure = '';
        domStructure = '<section class="cap4-text is-one " style="background: '+(messageObj.extra.fieldBg || '')+'">';
        if(messageObj.isNotNull=='1' && messageObj.formdata.rawData.viewInfo.viewContent.skin){//轻表单必填加*号
            domStructure+='<div class="cap4-text__star" style="display: block;margin-top: -3px;"><i class="icon CAP cap-icon-bitian"></i></div>';
        }

        domStructure +='<div class="cap4-text__content" style="border-bottom: '+(messageObj.extra.fieldLine || 'none')+'"><div class="cap4-text__left"  style="padding-top:4px;color:'+(messageObj.extra.fieldTitleDefaultColor || '')+'">'+messageObj.display+'</div><div class="cap4-text__right" style="height: 30px;"><div class="cap4-text__cnt" style="width: 100%;"><div class="button" style="position: absolute;right: 5px;width:80px;line-height: 30px;color: #1f85ec;text-align: center;cursor: pointer;">点击生成</div><div class="displayText" readonly  style="color: #1f85ec;cursor: pointer;width: 100%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;' + (getData.auth!='browse'?'padding-right: 80px;':'') + '" type="text" placeholder="" maxlength="85"></div></div></div></div></section>';
        var box = document.querySelector('#' + privateId);
        if(!box) {
            console.warn('未找到控件dom');
            return;
        }
        box.innerHTML = domStructure;
        if(!messageObj.formdata.rawData.viewInfo.viewContent.skin){
            box.querySelector(".cap4-text__left").style.display="none";
            box.querySelector(".cap4-text__right").style.marginLeft="0";
        }

        if (self.getData.attachmentInfo.attachmentInfos && self.getData.attachmentInfo.attachmentInfos.length > 0) {
            self.att = self.getData.attachmentInfo.attachmentInfos;
            box.querySelector(".displayText").innerText=self.att[0].filename;
        }else{
            box.querySelector(".cap4-text__cnt").style.background=(messageObj.isNotNull=='1'?messageObj.extra.isNotNullBg || '#fef0d0':'none');
        }

        //点击附件名查看
        box.querySelector('.displayText').addEventListener('tap', function () {
            if (self.att[0] && self.att[0].fileUrl){
                if(typeof(cmp.platform.CMPShell) != 'undefined' && cmp.platform.CMPShell){
                    var items = [
                        {
                            key:"download",
                            name:"下载"
                        }
                    ];
                    cmp.dialog.actionSheet(items, "取消", function (item) {
                        self.downloadFile(item.key);
                    }, function () {

                    });
                }else{
                    cmp.notification.alert("微协同不支持附件查看！", function () {
                    }, " ", "确定");
                }
            }

        });
        if (getData.auth === 'browse') {
            box.querySelector('.button').style.display = "none";
        }else if(getData.auth ==="hide"){
            box.style.display = "none";
        }else{
            box.querySelector('.button').addEventListener('tap', function () {
            	         cmp.notification.alert("移动端表单不能转文档，请到电脑端操作！", function () {
                            }, " ", "确定");
            });

        }

    }
    
    self.downloadFile=function(key){
        cmp.dialog.loading(true);
        if(key=="open"){
            cmp.att.read({
                path:cmp.seeyonbasepath + "/rest/attachment/file/"+self.att[0].fileUrl,//文件的服务器地址
                filename:self.att[0].filename,//附件名称
                edit:false,  //是否可以进行修改编辑
                extData:{
                    fileId:self.att[0].reference,//必须是字符串
                    lastModified:self.att[0].createdate,//必须是字符串
                    origin: cmp.origin
                },
                success:function(result){
                    cmp.dialog.loading(false);
                },
                error:function(error){
                    cmp.dialog.loading(false);
                }
            });
        }else{
            cmp.att.download({
                url:cmp.seeyonbasepath + "/rest/attachment/file/"+self.att[0].fileUrl,
                title:self.att[0].filename,
                extData:{
                    fileId:self.att[0].reference,//必须是字符串
                    lastModified:self.att[0].createdate,//必须是字符串
                    origin: cmp.origin
                },
                isSaveToLocal:true,
                success:function(result){
                    cmp.notification.alert("下载成功！文件位置：" + result.target, function () {
                        cmp.dialog.loading(false);
                    }, " ", "确定");
                },
                error:function(error){
                    cmp.dialog.loading(false);
                }
            });
        }

    }
    
    self.removal = function (arr) {
        var res = [];
        var json = {};
        for (var i = 0; i < arr.length; i++) {
            if (!json[arr[i]]) {
                res.push(arr[i]);
                json[arr[i]] = 1;
            }
        }
        return res;
    }

    self.countProperties = function (obj) {
        var count = 0;
        for (var property in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, property)) {
                count++;
            }
        }
        return count;
    }


    window[nameSpace] = self;
})();
