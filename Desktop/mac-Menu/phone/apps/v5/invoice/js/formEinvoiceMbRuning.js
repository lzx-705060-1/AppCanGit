(function() {
    var nameSpace = 'feild_4578843378267869145';
    var self ={};
    dynamicLoading = {
        css: function(path){
            if(!path || path.length === 0){
                throw new Error('argument "path" is required !');
            }
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.href = path;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.appendChild(link);
        },
        js: function(path){
            if(!path || path.length === 0){
                throw new Error('argument "path" is required !');
            }
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.src = path;
            script.type = 'text/javascript';
            head.appendChild(script);
        }
    }

    self.init = function(res) {
        if(!document.querySelector('#formInvoiceBtnMbCss')){
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.href = res.url_prefix+'css/formInvoiceBtnMb.css';
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.id = 'formInvoiceBtnMbCss';
            head.appendChild(link);
        }

        var resData= {
            adaptation: res.adaptation,
            privateId: res.privateId,
            formMessage: res.formMessage,
            getData: res.getData,
            messageObj: res.adaptation.childrenGetData(res.privateId),
            att:[],
            aId:''
        }
        self.appendChildDom(resData);

        // 监听是否数据刷新
        res.adaptation.ObserverEvent.listen('Event' + res.privateId, function(data) {
            //resData.messageObj = data;
            resData.getData=data;
            self.appendChildDom(resData);
        });
    };

    self.appendChildDom = function(data) {
        switch('button'){
            case 'button':
                self.customButton(data);
                break;
            default:
        }
    };
    self.customButton = function(data) {
        var  adaptation=data.adaptation;
        var  privateId=data.privateId;
        var  formMessage=data.formMessage;
        var  getData=data.getData;
        var  messageObj=data.messageObj;
        var  aId=data.aId;

        //----------创建DOM---------
        var domStructure = '<section class="cap4-text is-one form-einvoice-box"  style="background: '+(messageObj.extra.fieldBg || '') +'">';
        if(messageObj.isNotNull=='1' && messageObj.formdata.rawData.viewInfo.viewContent.skin){//轻表单必填加*号
            domStructure+='<div class="cap4-text__star" style="display: block;margin-top: -7px;"><i class="icon CAP cap-icon-bitian"></i></div>';
        }

        domStructure +='<div class="cap4-text__content" style="border-bottom: '+(messageObj.extra.fieldLine || 'none') +'"><div class="cap4-text__left form-einvoice-left"><div class="form-einvoice-title" style="color:'+(messageObj.extra.fieldTitleDefaultColor || '') +'">'+messageObj.display+'</div><div class="form-einvoice-attach " style="text-align: left;"><i class="icon iconfont pdf" style="color: rgb(248, 99, 99);"></i><span class="filename"></span></div></div><div class="cap4-text__relation"><i class="icon CAP cap-icon-e-invoice  upload"></i><i class="icon CAP cap-icon-shanchu-X delete"></i></div></div></section>';
        var box=document.querySelector('#' + privateId);
        if(!box) {
            console.warn('未找到控件dom');
            return;
        }
        box.innerHTML = domStructure;
        if(!messageObj.formdata.rawData.viewInfo.viewContent.skin){//原样表单不显示标题
            box.querySelector(".form-einvoice-title").style.display="none";
        }
        box.querySelector(".form-einvoice-attach").addEventListener('tap', function() {
            if (data.att[0] && data.att[0].fileUrl) {
                if (typeof(cmp.platform.CMPShell) != 'undefined' && cmp.platform.CMPShell) {
                    var items = [
                        {
                            key: "download",
                            name: "下载"
                        }
                    ];
                    cmp.dialog.actionSheet(items, "取消", function (item) {
                        self.downloadFile(item.key, data.att);
                    }, function () {

                    });
                }else{
                    cmp.notification.alert("微协同不支持附件查看！", function () {
                    }, " ", "确定");
                }
            }
        });

        box.querySelector('.delete').addEventListener('tap', function() {
            box.querySelector(".filename").innerText="";
            box.querySelector(".form-einvoice-attach i").style.display="none";
            box.querySelector(".form-einvoice-attach").style.background=(messageObj.isNotNull=='1'?messageObj.extra.isNotNullBg || '#fef0d0':'');
            box.querySelector('.upload').style.display="";
            box.querySelector('.delete').style.display="none";
            if (adaptation.backfillFormAttachment){
                var attachmentData = [
                    {
                        tableName : formMessage.tableName,
                        tableCategory : formMessage.tableCategory,
                        updateRecordId : getData.recordId||'',
                        handlerMode : 'delete',
                        fieldName : getData.id,
                        deleteAttchmentData : [aId]
                    }
                ];
                adaptation.backfillFormAttachment(attachmentData,privateId);
            }
            data.att=[];
        });
        box.querySelector('.upload').addEventListener('tap', function() {
            var Template = '0';
            var appId = '';
            var pagename = 'report';
            var opts = {
                type: 0,
                applicationCategory: 66,
                maxSize: '',
                isEncrypt: '',
                popupTitleKey: '',
                attachmentTrId: 'Att',
                takeOver: 'false',
                firstSave: 'true',
                quantity: 1,
                extensions: 'pdf'
            };
            //文件上传成功后
            self.uploadFile(opts, function (fileurls, atts) {
                if (atts && atts.length > 0) {
                    data.att = atts;
                    data.att[0].reference = getData.attachmentInfo.baseAttachmentInfo.reference;
                    data.att[0].subReference = getData.attachmentInfo.baseAttachmentInfo.subReference;
                    box.querySelector(".filename").innerText = atts[0].filename;
                    box.querySelector(".form-einvoice-attach i").style.display = "";
                    box.querySelector(".form-einvoice-attach").style.background = "";
                    //icon botton
                    box.querySelector('.upload').style.display = "none";
                    box.querySelector('.delete').style.display = "";
                    aId = atts[0].id;

                    //rest
                    var content = messageObj.formdata.rawData.content;
                    var params = {
                        formId: content.contentTemplateId,
                        rightId: content.rightId,
                        fieldName: getData.id,
                        fileId: atts[0].fileUrl,
                        masterId: content.contentDataId,
                        subId: getData.recordId || '0'
                    };
                    cmp.dialog.loading(true);
                    //self.parseEinvoiceFileAndFillBack(params, {
                    cmp.ajax({
                        repeat: true,   //当网络掉线时是否自动重新连接
                        type: "GET",
                        url: cmp.seeyonbasepath + '/rest/cap4/formEinvoice/parseEinvoiceFileAndFillBack?' + self.parseParam(params),//url的拼接  A8的域名 + rest + 应用模块名 + 具体接口名
                        dataType: "json",
                        cmpReady2Fire: true,
                        headers:{"Accept": "application/json; charset=utf-8", "Accept-Language": "zh-CN", "Content-Type": "application/json; charset=utf-8", "token": cmp.token},
                        dataType: "json",
                        success: function (res) {
                            cmp.dialog.loading(false);
                            if (res.success || res.code == "0") {
                                if (adaptation.backfillFormControlData) {
                                    var backfillData = [];
                                    var backfillItem = {
                                        tableName: formMessage.tableName,
                                        tableCategory: formMessage.tableCategory,
                                        updateData: {},
                                        updateRecordId: ''
                                    }
                                    if (self.countProperties(res.data) === 0) {
                                        return;
                                    } else {
                                        var key = [];
                                        for (var k in res.data) {
                                            if (k.split('_').length > 1) {
                                                key.push(k.split('_')[1]);
                                            }
                                        }

                                        if (key.length == 0) {
                                            backfillItem.updateData = res.data;
                                            backfillData.push(backfillItem);
                                        } else {
                                            if (self.removal(key).length === 1) {
                                                if (self.countProperties(res.data) === key.length) {
                                                    backfillItem.updateData = res.data;
                                                    backfillItem.updateRecordId = key[0];
                                                    backfillData.push(backfillItem);
                                                } else {
                                                    var mTable = {};
                                                    var sTable = {};
                                                    for (p in res.data) {
                                                        if (p.split('_').length === 2 && p.split('_')[1] === key[0]) {
                                                            sTable[p] = res.data[p];
                                                        } else {
                                                            mTable[p] = res.data[p];
                                                        }
                                                    }
                                                    backfillData.push({
                                                        updateData: mTable,
                                                        tableName: formMessage.tableName,
                                                        tableCategory: formMessage.tableCategory,
                                                    });
                                                    backfillData.push({
                                                        updateData: sTable,
                                                        tableName: formMessage.tableName,
                                                        tableCategory: formMessage.tableCategory,
                                                        updateRecordId: key[0]
                                                    });
                                                }
                                            } else {
                                                var len = removal(key);

                                                for (var i = 0; i <= len.length; i++) {
                                                    var tableData = {};
                                                    for (p in res.data) {
                                                        if (p.split('_').length === 2) {
                                                            if (p.split('_')[1] === len[i]) {
                                                                tableData[p] = res.data[p];
                                                            }
                                                        } else {
                                                            if (i === len.length) {
                                                                tableData[p] = res.data[p];
                                                            }
                                                        }
                                                    }
                                                    backfillData.push({
                                                        updateData: tableData,
                                                        tableName: formMessage.tableName,
                                                        tableCategory: formMessage.tableCategory,
                                                        updateRecordId: len[i] || ''
                                                    });
                                                }
                                            }
                                        }
                                    }
                                    if (backfillData && backfillData.length > 0) {
                                        for (var i = 0; i < backfillData.length; i++) {
                                            for (var k in backfillData[i].updateData) {
                                                if (k.split('_').length > 1) {
                                                    backfillData[i].updateData[k.split('_')[0]] = backfillData[i].updateData[k];
                                                    delete backfillData[i].updateData[k];
                                                } else {
                                                    backfillData[i].updateData[k] = backfillData[i].updateData[k];
                                                }
                                            }
                                        }
                                    }
                                    //backfillFormControlData（回填电子发票相关联的其它控件的值）
                                    adaptation.backfillFormControlData(backfillData, privateId);
                                }
                                if (adaptation.backfillFormAttachment) {
                                    var attachmentData = [
                                        {
                                            tableName: formMessage.tableName,
                                            tableCategory: formMessage.tableCategory,
                                            updateRecordId: getData.recordId || '',
                                            handlerMode: 'add',
                                            fieldName: getData.id,
                                            addAttchmentData: data.att
                                        }
                                    ];
                                    //backfillFormAttachment（向数据库添加新建的内容）
                                    adaptation.backfillFormAttachment(attachmentData, privateId);
                                }
                            } else {

                            }
                        },
                        error: function (e) {
                            cmp.dialog.loading(false);
                            var cmpHandled = cmp.errorHandler(e);
                            if (cmpHandled) {
                                cmp.href.back();
                            } else {
                                cmp.notification.alert(e.message, function () {
                                }, " ", "确定");
                            }
                        }

                    });
                }

            });

        });
        if(getData.attachmentInfo.attachmentInfos&&getData.attachmentInfo.attachmentInfos.length>0){
            data.att=getData.attachmentInfo.attachmentInfos;
            aId = data.att[0].id;
            box.querySelector(".filename").innerText=data.att[0].filename;
            box.querySelector(".form-einvoice-attach i").style.display="";
            box.querySelector('.upload').style.display="none";
            if(getData.auth != 'browse') {
                box.querySelector('.delete').style.display = "";
            }
        }else{
            box.querySelector(".form-einvoice-attach i").style.display="none";
            box.querySelector(".form-einvoice-attach").style.background=(messageObj.isNotNull=='1'?messageObj.extra.isNotNullBg || '#fef0d0':'');
            box.querySelector('.delete').style.display = "none";
        }
        if (getData.auth === 'browse') {
            box.querySelector('.upload').style.display = "none";
            box.querySelector('.delete').style.display = "none";
        }else if(getData.auth ==="hide"){
            box.style.display = "none";
        }
    }

    self.parseParam = function(param, key) {
        var paramStr = "";
        if (param instanceof String || param instanceof Number || param instanceof Boolean) {
            paramStr += "&" + key + "=" + encodeURIComponent(param);
        } else {
            for(var i in param) {
                paramStr += '&'+ i + "=" + param[i];
            }
        }
        return paramStr.substr(1);
    }

    self.parseEinvoiceFileAndFillBack =function(_params,options){
        return SeeyonApi.Rest.get('cap4/formEinvoice/parseEinvoiceFileAndFillBack?'+self.parseParam(_params),_params,'',cmp.extend({},options))
    }

    self.download = function(){
        console.log(111111111)
    }
    self.removal = function (arr){
        var res = [];
        var json = {};
        for(var i = 0; i < arr.length; i++){
            if(!json[arr[i]]){
                res.push(arr[i]);
                json[arr[i]] = 1;
            }
        }
        return res;
    }

    self.countProperties = function(obj){
        var count = 0;
        for(var property in obj){
            if(Object.prototype.hasOwnProperty.call(obj,property)){
                count++;
            }
        }
        return count;
    }
    //定义上传文件接口
    self.uploadFile = function (options, callback) {
        cmp.dialog.loading(true);
        cmp.att.suite({
            type:"localFile",
            pictureNum:9,
            initDocData:null, //初始关联文档数据
            maxFileSize:5*1024*1024,
            success:function(result){ //选择成功后的回调
                cmp.dialog.loading(false);
                if(result.localSource && result.localSource.toUpperCase().substring(result.localSource.lastIndexOf(".")+1)=="PDF"){
                    var atts=result.att;
                    if (atts && atts.length) {
                        callback(null, atts);
                    } else {
                        callback(null, []);
                    }
                }else{
                    cmp.notification.alert("请上传PDF文件", function () {
                    }, " ", "确定");
                }
            },
            error:function(result){ //删除数据时的回调
                cmp.dialog.loading(false);
            },
            cancel:function(result){//选图片，拍照，录音、本地文件取消选择时的回调
                cmp.dialog.loading(false);
            }
        });
    }

    self.downloadFile=function(key,att){
        cmp.dialog.loading(true);
        if(key=="open"){
            cmp.att.read({
                path:cmp.seeyonbasepath + "/rest/attachment/file/"+att[0].fileUrl,//文件的服务器地址
                filename:att[0].filename,//附件名称
                edit:false,  //是否可以进行修改编辑
                extData:{
                    fileId:att[0].reference,//必须是字符串
                    lastModified:att[0].createdate,//必须是字符串
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
                url:cmp.seeyonbasepath + "/rest/attachment/file/"+att[0].fileUrl,
                title:att[0].filename,
                extData:{
                    fileId:att[0].reference,//必须是字符串
                    lastModified:att[0].createdate,//必须是字符串
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

    self.getScriptPath=function () {
        if (document.currentScript) {
            return document.currentScript.src;
        }
        try {
            __$$$__.y();
        } catch (e) {
            var stack = e.fileName || e.sourceURL || e.stack || e.stacktrace;
            var match = stack && /(?:[a-z]+):\/{2,3}[^\/]+\/\S+?(?=\:\d+\:\d)/i.exec(stack);
            if (match) {
                return match[ 0 ];
            }
        }
        for (var scripts = document.scripts, i = scripts.length - 1; i > -1; --i) {
            if (scripts[ i ].readyState === 'interactive') {
                return scripts[ i ].getAttribute('src', 4);
            }
        }
    }

    window[nameSpace] = self;
})();
