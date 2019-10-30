/*
 * 显示聊天工具内容
 * 聊天工具类型：语音、照相、相册、离线文档、表情、更多
 * 依赖 ucChatCommonUtil-debug.js

 */
var $ucChatToolsTpl = {
    // 语音
    voiceHtml: function () {
        return "<div class=\"uc-icon-voice-wrap\"><div class=\"uc-icon-voice-text\">按住说话</div><div class=\"uc-icon-voice\"><i class=\"iconfont icon-voice\"></i></div></div>";
    },
    // 点击语音时，出现录音秒数样式
    voicingHtml: function () {
        return "<img src=\"../img/voice@1x.png\" style=\"vertical-align:middle;\" /><span class=\"uc-voice-time\">0:00</span>";
    },
    // 点击录音时，屏幕中央出现录音动画样式
    fingerSlideStyleHtml: function (h) {
        var str = "<div class=\"mask-wrap\" style=\"height:" + h + "\">"
            + "<div class=\"uc-finger-slide\">"
            + "<div class=\"uc-finger-slide-icon\">"
            + "<i class=\"iconfont icon-voicing\"></i>";
        var s = "";
        for (var i = 1; i < 10; i++) {
            s += "<span class=\"uc-voice-volume section" + i + "\"></span>";
        }
        str = str + s + "</div>"
            + "<span class=\"uc-finger-slide-text\">手指上滑，取消发送</span>"
            + "</div>"
            + "</div>";
        return str;
    },
    // 点击录音时，手指向上滑动，改变样式
    cancelSendVoiceStyleHtml: function (h) {
        return "<div class=\"mask-wrap\" style=\"height:" + h + "\">"
            + "<div class=\"uc-cancel-send\">"
            + "<div class=\"uc-cancel-send-icon\">"
            + "<i class=\"iconfont icon-cancel-voice\"></i>"
            + "</div>"
            + "<span class=\"uc-cancel-send-text\">松开手指，取消发送</span>"
            + "</div>"
            + "</div>";
    },
    // 语音时间过短时，提示录制时间太短
    promptVoiceStyleHtml: function (h) {
        return "<div class=\"mask-wrap\" style=\"height:" + h + "\">"
            + "<div class=\"uc-cancel-send\">"
            + "<div class=\"uc-cancel-send-icon\">"
            + "<i class=\"iconfont icon-warning\"></i>"
            + "</div>"
            + "<span class=\"uc-prompt-send-text\">说话时间太短</span>"
            + "</div>"
            + "</div>";
    },
    // 相册
    photoHtml: function () {
        return "<div id=\"listView\" class=\"cmp-scroll-wrapper\">"
            + "<div class=\"cmp-scroll\" style=\"width:800px;\">"
            + "<div id=\"scrollBox\">"
            + "<ul class=\"group-img-scroll uc-pic-list\">"
            + "<li class=\"group-img-cell uc-pic-li\">"
            + "<img src=\"../img/img1.png\" />"
            + "<i class=\"uc-no-check\"></i>"
            + "</li>"
            + "<li class=\"group-img-cell uc-pic-li\">"
            + "<img src=\"../img/img2.png\" />"
            + "<i class=\"uc-no-check\"></i>"
            + "</li>"
            + "<li class=\"group-img-cell uc-pic-li\">"
            + "<img src=\"../img/img3.png\" />"
            + "<i class=\"uc-no-check\"></i>"
            + "</li>"
            + "</ul>"
            + "</div>"
            + "</div>"
            + "</div>"
            + "<div class=\"uc-pic-btn\">"
            + "<span class=\"uc-album\">相册</span>"
            + "<span class=\"see-icon-success-circle-fill\">原图</span>"
            + "<span class=\"uc-send\">发送</span>"
            + "</div>";
    },
    // 更多
    moreHtml: function () {
        return "<div id=\"slider\" class=\"cmp-slider more\">"
            + "<div class=\"cmp-slider-group\" data-slider=\"2\">"
            + "<div class=\"cmp-slider-item\">"
            + "<ul class=\"cmp-table-view cmp-grid-view cmp-grid-9\">"
            + "<li class=\"cmp-table-view-cell cmp-media cmp-col-xs-4 cmp-col-sm-3 uc-voice-module\">"
            + "<a href=\"#\">"
            + "<div class=\"uc-icon-bg uc-icon-bg-blue\">"
            + "<span class=\"iconfont icon-voice\"></span>"
            + "</div>"
            + "<div class=\"cmp-media-body\">语音</div>"
            + "</a>"
            + "</li>"
            + "<li class=\"cmp-table-view-cell cmp-media cmp-col-xs-4 cmp-col-sm-3 uc-photo-module\">"
            + "<a href=\"#\">"
            + "<div class=\"uc-icon-bg uc-icon-bg-red\">"
            + "<span class=\"iconfont icon-uc-icon-photograph\"></span>"
            + "</div>"
            + "<div class=\"cmp-media-body\">拍照</div>"
            + "</a>"
            + "</li>"
            + "<li class=\"cmp-table-view-cell cmp-media cmp-col-xs-4 cmp-col-sm-3 uc-pic-module\">"
            + "<a href=\"#\">"
            + "<div class=\"uc-icon-bg uc-icon-bg-yellow\">"
            + "<span class=\"iconfont icon-uc-icon-picture\"></span>"
            + "</div>"
            + "<div class=\"cmp-media-body\">图片</div>"
            + "</a>"
            + "</li>"
            // + "<li class=\"cmp-table-view-cell cmp-media cmp-col-xs-4 cmp-col-sm-3 uc-card-module\">"
            // + "<a href=\"#\">"
            // + "<div class=\"uc-icon-bg uc-icon-bg-green\">"
            // + "<span class=\"iconfont icon-address\"></span>"
            // + "</div>"
            // + "<div class=\"cmp-media-body\">人员名片</div>"
            // + "</a>"
            // + "</li>"
            + "<li class=\"cmp-table-view-cell cmp-media cmp-col-xs-4 cmp-col-sm-3 uc-file-module\">"
            + "<a href=\"#\">"
            + "<div class=\"uc-icon-bg uc-icon-bg-blue\">"
            + "<span class=\"iconfont icon-uc-icon-file\"></span>"
            + "</div>"
            + "<div class=\"cmp-media-body\">离线文件</div>"
            + "</a>"
            + "</li>"
            // + "<li class=\"cmp-table-view-cell cmp-media cmp-col-xs-4 cmp-col-sm-3 uc-doc-module\">"
            // + "<a href=\"#\">"
            // + "<div class=\"uc-icon-bg uc-icon-bg-red\">"
            // + "<span class=\"iconfont icon-icon-related-document\"></span>"
            // + "</div>"
            // + "<div class=\"cmp-media-body\">关联文档</div>"
            // + "</a>"
            // + "</li>"
            + "</ul>"
            + "</div>"
            + "</div>"
            // + "<div class=\"cmp-slider-indicator\">"
            // + "<div class=\"cmp-indicator cmp-active\"></div>"
            // + "<div class=\"cmp-indicator\"></div>"
            // + "</div>"
            + "</div>";
    }
};

var $ucChatToolsFunction = {
    /**
     * 点击聊天工具栏事件
     */
    clickChatTools: function () {
        if (chat.tools.length > 0) {
            for (var i = 0; i < chat.tools.length; i++) {
                chat.tools[i].addEventListener("tap", function (arg) {
                    return function () {
                        // 隐藏面板
                        if (this.className != null && this.className.indexOf(" icon-blue") > -1) {
                            this.className = this.className.replace(" icon-blue", "");
                            chat.panel.style.display = "none";
                            chat.panel.innerHTML = "";
                            chat.refreshPage("#all_chat", "#cmp-control", 200);
                            return;
                        }
                        // 首先将所有图标的颜色去掉，变成灰色图标
                        for (var i = 0; i < chat.tools.length; i++) {
                            var e = chat.tools[i];
                            if (e.className != null && e.className.indexOf(" icon-blue") > -1) {
                                e.className = e.className.replace(" icon-blue", "");
                            }
                        }
                        this.className = this.className + " icon-blue";
                        var selfTarget = this;
                        // 语音
                        if (this.className.indexOf("uc-voice") > -1) {
                            cmp.audio.checkPermission({
                                success:function(src){
                                    //成功后直接调用开发者的成功回调
                                    chat.input_text.blur();
                                    chat.panel.style.display = "block";
                                    chat.refreshPage("#all_chat", "#cmp-control", 200);
                                    chat.panel.innerHTML = $ucChatToolsTpl.voiceHtml();
                                    // 长按进行语音录音
                                    $ucChatToolsFunction.record.longPressVoice();
                                    // 手指滑屏时，隐藏工具栏
                                    chat.figerHideTools();
                                },
                                cancel:function(e){
                                    selfTarget.className = selfTarget.className.replace(" icon-blue", "");
                                    //会弹出去设置权限的提示
                                },
                                setFun:function () {
                                    selfTarget.className = selfTarget.className.replace(" icon-blue", "");
                                }
                            });

                        }

                        // 照相机
                        else if (this.className.indexOf("uc-photo") > -1) {
                            chat.panel.style.display = "none";
                            chat.refreshPage("#all_chat", "#cmp-control", 200);
                            chat.panel.innerHTML = "";
                            _$(".uc-photo").className = _$(".uc-photo").className.replace(" icon-blue", "");
                            $ucChatToolsFunction.picture.addPictureControl(1, $ucChatToolsFunction.picture.getPicSuccess, 1);
                        }

                        // 相册
                        else if (this.className.indexOf("uc-pic") > -1) {
                            chat.panel.style.display = "none";
                            chat.refreshPage("#all_chat", "#cmp-control", 200);
                            // 暂时注释，本期不做快捷选择图片
                            // chat.panel.innerHTML = $ucChatToolsTpl.photoHtml();
                            // chat.picDivWidth(".uc-pic-li img",".uc-pic-list");
                            // chat.addPicCurrent(".uc-pic-li");
                            chat.panel.innerHTML = "";
                            _$(".uc-pic").className = _$(".uc-pic").className.replace(" icon-blue", "");
                            $ucChatToolsFunction.picture.addPictureControl(0, function (rv) {
                                $ucChatToolsFunction.picture.sendPic(rv);
                            }, 2);
                        }

                        // 离线文档
                        else if (this.className.indexOf("uc-file") > -1) {
                            _$(".uc-file").className = _$(".uc-file").className.replace(" icon-blue", "");
                            $ucChatToolsFunction.doc.sendDoc();
                        }

                        // 表情
                        else if (this.className.indexOf("uc-look") > -1) {
                            chat.input_text.blur();
                            chat.panel.style.display = "block";
                            chat.refreshPage("#all_chat", "#cmp-control", 200);
                            chat.panel.innerHTML = "<div class=\"emoji_ontainer HelloKittyContainer kitty_container\" id=\"emoji_ontainer\">";
                            // chat.initSendBtn();
                            chat.initEmoji();
                            // 手指滑屏时，隐藏工具栏
                            chat.figerHideTools();
                        }

                        // 更多
                        else if (this.className.indexOf("uc-more") > -1) {
                            chat.panel.style.display = "block";
                            chat.refreshPage("#all_chat", "#cmp-control", 200);
                            chat.panel.innerHTML = $ucChatToolsTpl.moreHtml();
                            if(cmp.os.ios){
                                _$(".uc-file-module").style.display="none";
                                var lis = document.querySelectorAll(".uc-chat-tool-panel .cmp-grid-view.cmp-grid-9 .cmp-col-xs-4");
                                for (var i=0;i<lis.length;i++) {lis[i].style.width = "33%";}
                            }
                            // 点击语音，切换到语音状态
                            if (_$(".uc-voice-module")) {
                                _$(".uc-voice-module").addEventListener("tap", function () {
                                    cmp.audio.checkPermission({
                                        success:function(src){
                                            //成功后直接调用开发者的成功回调
                                            $ucChatToolsFunction.toggleClassname(".uc-more", ".uc-voice");
                                            chat.panel.innerHTML = $ucChatToolsTpl.voiceHtml();
                                            $ucChatToolsFunction.record.longPressVoice();
                                            chat.refreshPage("#all_chat", "#cmp-control", 200);
                                        },
                                        cancel:function(e){
                                            //会弹出去设置权限的提示
                                            chat.panel.style.display = "none";
                                        },
                                        setFun:function () {
                                            chat.panel.style.display = "none";
                                        }
                                    });

                                });
                            }
                            // 点击拍照，切换到拍照状态
                            if (_$(".uc-photo-module")) {
                                _$(".uc-photo-module").addEventListener("tap", function () {
                                    chat.panel.style.display = "none";
                                    chat.panel.innerHTML = "";
                                    _$(".uc-more").className = _$(".uc-more").className.replace(" icon-blue", "");
                                    chat.refreshPage("#all_chat", "#cmp-control", 200);
                                    $ucChatToolsFunction.picture.addPictureControl(1, $ucChatToolsFunction.picture.getPicSuccess, 1);
                                });
                            }
                            // 点击图片，切换到图片状态
                            if (_$(".uc-pic-module")) {
                                _$(".uc-pic-module").addEventListener("tap", function () {
                                    chat.panel.style.display = "none";
                                    _$(".uc-more").className = _$(".uc-more").className.replace(" icon-blue", "");
                                    chat.panel.innerHTML = "";
                                    chat.refreshPage("#all_chat", "#cmp-control", 200);
                                    // 暂时注释，本期不做快捷选择图片
                                    // chat.panel.innerHTML = $ucChatToolsTpl.photoHtml();
                                    // chat.addPicCurrent(".uc-pic-li");
                                    $ucChatToolsFunction.picture.addPictureControl(0, function (rv) {
                                        $ucChatToolsFunction.picture.sendPic(rv);
                                    }, 2);
                                });
                            }
                            // 点击离线文档，切换到离线文档状态
                            if (_$(".uc-file-module")) {
                                _$(".uc-file-module").addEventListener("tap", function () {
                                    chat.panel.style.display = "none";
                                    _$(".uc-more").className = _$(".uc-more").className.replace(" icon-blue", "");
                                    chat.panel.innerHTML = "";
                                    chat.refreshPage("#all_chat", "#cmp-control", 200);
                                    $ucChatToolsFunction.doc.sendDoc();
                                });
                            }
                            // 点击关联文档，切换到关联文档状态
                            // if (_$(".uc-doc-module")) {
                            //     _$(".uc-doc-module").addEventListener("tap", function () {
                            //         chat.panel.style.display = "none";
                            //         chat.panel.innerHTML = "";
                            //         cmp.accDoc("form-document", {
                            //             fillbackData: null,
                            //             callback: function (data) {
                            //                 console.log(data);
                            //             }
                            //         });
                            //     });
                            // }
                            // 手指滑屏时，隐藏工具栏
                            chat.figerHideTools();
                        }
                    }
                }(i));
            }
        }
    },
    /**
     * 输聊天工具栏点击切换样式
     * @param currEle
     * @param ele
     */
    toggleClassname: function (currEle, ele) {
        _$(currEle).className = _$(currEle).className.replace(" icon-blue", "");
        if (ele) {
            _$(ele).className = _$(ele).className + " icon-blue";
        }
    },

    // 文档工具
    doc : {
        isComplete : "true",
        // 发送离线文档
        sendDoc : function(){
            //调用打开本地离线文档组件
            chat.openOfflineFiles({
                success : function(r){
                    if(r.success){
                        var info = r.files[0];
                        var src = "file://" + info.filepath;
                        var s = Math.round(info.fileSize / 1024);
                        var size = bytesToSize(s);
                        var fname = info.filepath.substring(info.filepath.lastIndexOf("/") + 1,info.filepath.length).toLowerCase();
                        var ftype = info.type;
                        var fileId = chat.uuid();
                        var icon = showDocIcon(ftype);
                        var data = {
                            chatId : fileId,
                            memberId:chat.userId,
                            from:chat.userId,
                            chatType: $chatView.states.chatType,
                            msgType : "filetrans",
                            fname : fname,
                            size : size,
                            fileSize : info.fileSize,
                            path : src,
                            icon : icon,
                            timestamp : new Date().format("yyyy-MM-ddThh:mm:ss.000000+08:00")
                        };
                        if($chatView.states.chatType == "chat"){
                            data.readStateClass = "uc-chat-unread";
                            data.readState = "未读";
                        }
                        if($chatView.states.chatType == "groupchat"){
                            data.name = cmp.member.name;
                        }
                        $ucChatToolsFunction.doc.succStyle(data);
                        $ucChatToolsFunction.doc.sendDocToserver(fname,s,fileId,src);
                    }
                },
                error : function(e){
                    // code: 23003
                    // message: "{"fileId":"94287253-5C78-4FE4-81BB-7F94427EEE0F","error":{"msg":"上传文件失败"},"response":{"message":"xxxx","time":"2017-03-02 11:42:27","version":"1.0","code":"500"}}"
                    if(e.code == "23003"){
                        cmp.notification.toast(JSON.parse(JSON.parse(e.message).error).msg);
                    }
                }
            });
        },
        // 发送成功样式展现
        succStyle : function(data){
            var _html = "";
            _html += chat.showSendMsgTime(_html);
            // 先显示发送消息样式
            _html += msgType(data);
            $chatView.chatList.innerHTML += _html;
            chat.refreshPage("#all_chat","#cmp-control",0);
            $chatView.timestamp = new Date().getTime();
        },
        sendDocToserver : function(fname,fileSize,fileId,src){
            chatFileUploadUrl.uploadImg(
                cmp.member.id,
                $chatView.states.toId,
                fname,
                fileSize,
                $chatView.states.chatType,
                true,
                function(data){
                    var obj = getIqXml(data);
                    var fileName = obj.xmlDoc.getElementsByTagName("name")[0].innerHTML;
                    var fId = obj.xmlDoc.getElementsByTagName("id")[0].innerHTML;
                    var fUrl = getImgDownLoadPath(obj.xmlDoc,fId,$chatView.uc_url);
                    var uploadState = document.getElementById(fileId).querySelector(".uc-doc-s");
                    var opts = {
                        url : fUrl,
                        fileList : [{
                            filepath : src,
                            fileId : fileId
                        }],
                        imgIndex : null ,
                        progress:function(data){
                            uploadState.innerHTML = "上传中";
                            $ucChatToolsFunction.doc.isComplete = "false";
                        },
                        success : function(data){
                            if(data.pos == 1){
                                uploadState.innerHTML = "已上传";
                                // 向后台发送文档
                                chatForFile($chatView.states.toId,$chatView.states.toName,$chatView.states.chatType,fId,fileName,fileSize,fileId,function(data){
                                    // 发送失败样式
                                    chat.sendFailStyle(fileId);
                                });
                                $chatView.sendMsgId = fileId;
                            }
                            $ucChatToolsFunction.doc.isComplete = "true";
                        },
                        error : function(data){
                            var id = data.fileId;
                            if(id){
                                chat.sendFailStyle(id);
                            }
                        }
                    };
                    chat.upLoad(opts);
                },
                function(data){
                    chat.sendFailStyle(fileId);
                    // if(data.code == 36005){
                    //     cmp.notification.toast(data.message);
                    // }
                }
            );
        },
        // 读附件内容
        openFile : function(){
            var e = this;
            if(e.querySelector(".uc-doc")){
                // 读取本地文件
                var fn = e.querySelector(".uc-doc-name").innerHTML;
                if(e.querySelector(".uc-doc").getAttribute("data-path") != "undefined"){
                    var path = e.querySelector(".uc-doc").getAttribute("data-path");
                    $ucChatToolsFunction.doc.readFileParams(path,fn,e.getAttribute("id"));
                }
                // 读取服务器文件
                else {
                    // 获取文档url
                    // data-fid  属性有值时表示是远程文件，并不是本地文件
                    var fid = e.querySelector(".uc-doc").getAttribute("data-fid");
                    chatFileDownload.getDownloadUrl(cmp.member.id, fid, "filetrans", function (d) {
                        var obj = getIqXml(d);
                        if (obj.xmlIq.getAttribute("type") == "result") {
                            var furl = getImgPath(obj.xmlDoc,$chatView.uc_url);
                            // 下载到本地
                            var options = {
                                url:furl, 
                                title:fn,
                                extData : {
                                    fileId : fid,
                                    lastModified : new Date().getTime(),
                                    origin : cmp.serverIp
                                },
                                success:function(result1){ 
                                    if(result1.pos == 1){
                                        // TODO：android手机的存储目录，也许ios的会不一样
                                        var src = "file://" + result1.target;
                                        $ucChatToolsFunction.doc.readFileParams(src,fn,fid);
                                    }
                                },
                                error:function(result2){
                                    var msg = eval('(' + result2.message + ')');
                                    cmp.notification.toast(msg.message);
                                }
                            };
                            chat.download(options);
                        }
                    },function(data){
                        if(data.code == "36005"){
                            cmp.notification.alert(data.message,function(){
                                cmp.href.closePage();
                            },"","确定");
                        }
                    });
                }
            }
        },
        // 调用读取附件组件
        readFileParams : function(path,n,id){
            chat.readFile({
                path : path,  
                filename : n,
                edit : false,  
                extData : {
                    fileId : id,
                    lastModified : new Date().getTime(),
                    origin : cmp.serverIp
                },
                success : function(result){
                    console.log(result);
                },
                error : function(error){
                    if(error.code == "17004"){
                        if(error.message){
                            cmp.notification.toast(error.message);
                        }
                    }
                }
            });
        }
    },

    //----- 语音 -----//
    record : {
        recordAudioObj: null,
        playAudioObj: null,
        RecordAudio: function (options) {
            var self = this;
            options = options ? options : {};
            var chatId = chat.uuid();
            var filename = "uc_recording_" + chatId + ".wav";
            var src = cmp.os.android ? filename : (cordova.file.tempDirectory + filename);
            var media = new Media(src, function (a) {
                if (options.success) {
                    options.success();
                }
                console.log("record mediaSuccess:" + a);
            }, function (error) {
                if (options.error) {
                    options.error(error);
                }
                self.error = true;
                console.log("record mediaError:" + error);
            }, function (c) {
                if (c == 2 && options.running) {
                    options.running();
                }
                console.log("record mediaStatus:" + c);
            });
            self.src = src;
            self.media = media;
            self.fileId = chatId;
            self.filename = filename;
        },
        // 初始化录音对象
        initRecordAudio: function () {
            $ucChatToolsFunction.record.RecordAudio.prototype.start = function (callback) {
                var self = this;
                if (self.media) {
                    self.media.startRecord();
                    self.times = 0;
                    self.interval = setInterval(function () {
                        self.times++;
                        console.log(self.times);
                        if (callback) {
                            callback(self.times);
                        }
                    }, 1000);
                }
            };
            $ucChatToolsFunction.record.RecordAudio.prototype.stop = function () {
                var self = this;
                if (self.media && self.error != true) {
                    self.media.stopRecord();
                    clearInterval(self.interval);
                    self.src = cmp.os.android ? cordova.file.externalRootDirectory + self.src : self.src;
                    return { "src": self.src, "times": self.times, "filename": self.filename,"fileId": self.fileId };
                }else{
                    return null;
                }
            };
            $ucChatToolsFunction.record.recordAudioObj = new $ucChatToolsFunction.record.RecordAudio();
        },
        touchstart: function () {//开始录音
            $ucChatToolsFunction.record.initRecordAudio();
            $ucChatToolsFunction.record.recordAudioObj.start();
        },
        touchend: function (isSend) {//录音结束
            var result = $ucChatToolsFunction.record.recordAudioObj.stop();
            if (result == null) {
                cmp.notification.toast("录音失败！", "center");
                return;
            }
            if (isSend) {
                $ucChatToolsFunction.record.sendRecord(result);
            }
        },
        /**
         * 放音接口
         * src : 录音文件路径
         * options : {
         *     success : function(){}    //录音结束时触发
         *     error : function(error){} //异常信息
         * }
         */
        PlayAudio: function (src, options) {
            options = options ? options : {};
            var media = new Media(src, function () {
                if (options.success) {
                    options.success();
                }
                console.log("play finish!");
            }, function (error) {
                if (options.error) {
                    options.error(error);
                }
                console.log("play error!");
            }, function (c) {
                console.log("mediaStatus:" + c);
            });
            this.src = src;
            this.media = media;
        },
        // 初始化播放录音对象
        initPlayAudio: function (src, options) {
            $ucChatToolsFunction.record.PlayAudio.prototype.start = function (callback) {
                var self = this;
                if (self.media) {
                    self.media.play();
                    if (callback) {
                        callback();
                    }
                    console.log("播放语音");
                }
            };
            $ucChatToolsFunction.record.PlayAudio.prototype.stop = function (callback) {
                var self = this;
                if (self.media) {
                    self.media.stop();
                    self.media.release();
                    if (callback) {
                        callback();
                    }
                }
            };
            $ucChatToolsFunction.record.playAudioObj = new $ucChatToolsFunction.record.PlayAudio(src, options);
        },
        /**
         *语音播放宽度
         *1-10秒一个进度
         *11-20秒一个进度
         *21-30秒一个进度
         *31-40秒一个进度
         *41-50秒一个进度
         *51-60秒一个进度
         *@params
         *ele : 显示语音的div元素
         */
        voiceProgressWidth : function(data){
            var t = Number(data.body.times);
            var ele = document.getElementById(data.chatId).querySelector(".voice");
            var w = document.defaultView.getComputedStyle(ele, null);
            var maxWidth = parseInt(w.maxWidth);
            var section = maxWidth / 6;
            var index = 10;
            var dum = Math.ceil(t / index);
            if(t){
                if(dum == 1){
                    return "auto";
                }else {
                    if(dum == 2){
                        return dum * section + 20 + "px";
                    }else{
                        return dum * section + "px";
                    }
                }
            }
        },

        /**
         *语音播放动画效果
         *ele：当前播放语音的元素
         *classNamz：标识是接收语音还是发送语音的classname
         */
        voicePlayAnimation : function(ele,classNamz){
            var timer = setInterval(function(){
                var classname = ele.getElementsByTagName("i")[0].className;
                var arr = classname.split(" ");
                for(var i = 0; i < arr.length;i++){
                    if(arr[i].indexOf(classNamz) >= 0) {
                        var index = parseInt(arr[i].substring(arr[i].length-1,arr[i].length));
                        if(index == 3){
                            index = 1;
                        }else{
                            index ++;
                        }
                        var c = classname.replace(arr[i],classNamz + index);
                        ele.getElementsByTagName("i")[0].className = c;
                        i = arr.length;
                    }
                }
                var unreadDot = ele.querySelector(".uc-chat-unread-dot");
                if(unreadDot){
                    ele.removeChild(unreadDot);
                }
            }, 400);
            return timer;
        },

        /**
         *停止播放动画效果
         *ele：当前播放语音的元素
         *classNamz：标识是接收语音还是发送语音的classname
         */
        voiceStopAnimation : function(ele,classNamz,timer){
            clearInterval(timer);
            timer = null;
            var classname = ele.getElementsByTagName("i")[0].className;
            var arr = classname.split(" ");
            for(var i = 0; i < arr.length;i++){
                if(arr[i].indexOf(classNamz) >= 0) {
                    var c = classname.replace(arr[i],classNamz + 3);
                    ele.getElementsByTagName("i")[0].className = c;
                    i = arr.length;
                }
            }
        },
        /**
         * 长按语音，开始录音，以及改变一些前端样式
         */
        longPressVoice: function () {
            var h = (chat.screenH - chat.headerH - chat.panel.clientHeight - chat.ucInputH - chat.toolbarH) + "px";
            var recordingTimer = null;
            var ele = _$(".uc-icon-voice");
            var timeout = null;
            var isSend = true;
            var t = 0;
            ele.addEventListener("touchstart", function (event) {
                event.preventDefault();
                timeout = setTimeout(function () {
                    _$(".uc-icon-voice").style.backgroundColor = "#2caeda";
                    _$(".uc-icon-voice-text").innerHTML = $ucChatToolsTpl.voicingHtml();
                    recordingTimer = setInterval(function () {
                        t ++;
                        if (t < 10) {
                            _$(".uc-voice-time").innerHTML = "0:0" + t;
                        } else if (t >= 10 && t < 60) {
                            _$(".uc-voice-time").innerHTML = "0:" + t;
                        } else if (t = 60) {
                            $ucChatToolsFunction.record.cancelVoicing(recordingTimer);
                            $ucChatToolsFunction.record.touchend(true);
                        }
                    }, 1000);
                    _$(".mask").style.display = "block";
                    _$(".mask").style.height = (chat.screenH - chat.headerH - chat.panel.clientHeight) + "px";
                    _$(".mask").innerHTML = $ucChatToolsTpl.fingerSlideStyleHtml(h);
                    $ucChatToolsFunction.record.touchstart();
                }, 100);
            }, false);
            ele.addEventListener("touchmove", function (event) {
                var e = _$(".uc-icon-voice");
                var r = parseInt(e.clientWidth) / 2;
                var pageY = chat.ucInputH + chat.toolbarH + _$("#cmp-control").clientHeight + chat.headerH;
                pageY = e.offsetTop + pageY + r + parseInt(_$("header").style.paddingTop);
                var pageX = e.offsetLeft + r;
                var y = event.targetTouches[0].pageY;
                var x = event.targetTouches[0].pageX;
                var z = (y - pageY) * (y - pageY) + (x - pageX) * (x - pageX);
                if (z > (r * r)) {//手指滑出录音圆圈后，显示松开手指，取消发送样式
                    _$(".mask").innerHTML = $ucChatToolsTpl.cancelSendVoiceStyleHtml(h);
                    isSend = false;
                } else if (z <= (r * r)) {// 手指在录音圆圈内，显示手指上滑样式，取消发送样式
                    _$(".mask").innerHTML = $ucChatToolsTpl.fingerSlideStyleHtml(h);
                    isSend = true;
                }
            }, false);
            ele.addEventListener("touchend", function (event) {
                $ucChatToolsFunction.record.cancelVoicing(recordingTimer);
                clearTimeout(timeout);
                if (t > 0 && t != 60) {
                    $ucChatToolsFunction.record.touchend(isSend);
                }else{
                    $ucChatToolsFunction.record.recordAudioObj.stop();
                    _$(".mask").innerHTML = $ucChatToolsTpl.promptVoiceStyleHtml(h);
                    _$(".mask").style.display = "block";
                    setTimeout(function(){
                        _$(".mask").innerHTML = "";
                    },1000);
                }
            }, false);
        },
        /**
         * 取消发送语音后触发方法
         * @param t
         */
        cancelVoicing: function (t) {
            _$(".uc-icon-voice").style.backgroundColor = "#3aadfb";
            chat.panel.innerHTML = $ucChatToolsTpl.voiceHtml();
            _$(".mask").innerHTML = "";
            _$(".mask").style.display = "none";
            clearInterval(t);
            // 再重新给录制语音按钮赋事件
            $ucChatToolsFunction.record.longPressVoice();
        },
        /**
         * 往聊天面板里追加语音消息
         * @param result
         * @param isoverride
         */
        sendRecord: function (result, isoverride) {
            console.log("进入发送语音方法")
            // 向页面中展现样式
            $ucChatToolsFunction.record.showSuccessVoiceStyle(result);
            // 向后台发送数据
            $ucChatToolsFunction.record.sendRecordToServer(result);
        },
        // 向后台发送语音
        sendRecordToServer : function(result){
            chatFileUploadUrl.uploadVoice(
                $chatView.userId,
                $chatView.states.toId,
                result.filename,
                function(data){
                    var obj = getIqXml(data);
                    var uploadurl = uc.getElementsByTagName(obj.xmlDoc,"uploadurl");
                    var id =uc.getElementsByTagName( obj.xmlDoc,"id");
                    var uploadurl = getImgDownLoadPath(obj.xmlDoc,id,$chatView.uc_url);
                    var options = {
                        url : uploadurl,
                        fileList : [{
                            filepath : result.src,
                            fileId : result.fileId
                        }],
                        imgIndex : null ,
                        // 上传附件成功方法
                        success : function(data){
                            // 文件保存到UC服务器之后的文件名
                            chatForVoice(
                                $chatView.states.toId,
                                $chatView.states.toName,
                                $chatView.states.chatType,
                                id,
                                result.times,
                                result.fileId,
                                function(data){
                                    // 上传失败样式
                                    chat.sendFailStyle(result.fileId);
                                }
                            );
                            $chatView.sendMsgId = result.fileId;
                        },
                        // 上传附件失败方法
                        error : function(data){
                            cmp.notification.toast(data);
                        }
                    };
                    chat.upLoad(options);
                },
                function(data){
                    chat.sendFailStyle(result.fileId);
                    // if(data.code == 36005){
                    //     cmp.notification.toast(data.message);
                    // }
                }
            );
        },
        // 点击语音播放语音
        openRecord: function () {
            var self = this;
            var fileId = self.getAttribute("id");
            var isNativeVoice = self.getAttribute("data-tmp");//标识是否是本地语音
            if(isNativeVoice == "true"){
                $ucChatToolsFunction.record.playVoice(self,self.getAttribute("src"));
            }else{
                chatFileDownload.getDownloadUrl(cmp.member.id, fileId, "microtalk",function(data){
                    var obj = getIqXml(data);
                    if(obj.xmlIq.getAttribute("type") == "result"){
                        var downloadurl = getImgPath(obj.xmlDoc,$chatView.uc_url);
                        var options = {
                            url:downloadurl,  //下载地址
                            title:"uc_recording_" + fileId + ".wav",
                            extData : {
                                fileId : fileId,
                                lastModified : new Date().getTime(),
                                origin : cmp.serverIp,
                                isVoice : true
                            },
                            success:function(result1){  //服务器端返回的相应数据
                                // {target: "/storage/sdcard0/Seeyon/download/uc_recording_3099775971.wav", pos: 1}
                                if(result1.pos == 1){
                                    // TODO：android手机的存储目录，也许ios的会不一样
                                    // file:///storage/sdcard0/uc_recording_36523209-3C0E-4797-9E1B-446FD45053FE.wav
                                    var src = "file://" + result1.target;
                                    $ucChatToolsFunction.record.playVoice(self,src);
                                }
                            },
                            error:function(result2){
                                // {message: "{"message":"服务器出小差了，请稍后重试","detail":"com.google.gs…was STRING at line 1 column 1 path $","code":401}", code: 22004}
                                // var msg = eval('(' + result2.message + ')');
                                var msg = JSON.parse(result2);
                                cmp.notification.toast(msg.message);
                            }
                        };
                        chat.download(options);
                    }
                }, function(data){
                    if(data.code == "36005"){
                        cmp.notification.alert(data.message,function(){
                            cmp.href.closePage();
                        },"","确定");
                    }
                });
            }
            
        },
        // 播放语音
        playVoice : function(self,src){
            if ($ucChatToolsFunction.record.playAudioObj) {
                //这一句是防止连点时出现两段语音都在播放的情况
                $ucChatToolsFunction.record.playAudioObj.stop(function () {
                    if(self.getAttribute("data-from") == $chatView.userId){
                        self.querySelector(".uc-record").src = "../img/voice/me-voice3@2x.png";
                    }else{
                        self.querySelector(".uc-record").src = "../img/voice/o-voice3@2x.png";
                    }
                });
                return;
            }
            $ucChatToolsFunction.record.initPlayAudio(src, {
                success : function () {
                    $ucChatToolsFunction.record.playAudioObj = null;
                    if(self.getAttribute("data-from") == $chatView.userId){
                        self.querySelector(".uc-record").src = "../img/voice/me-voice3@2x.png";
                    }else{
                        self.querySelector(".uc-record").src = "../img/voice/o-voice3@2x.png";
                        var unreadState = self.querySelector(".uc-chat-unread-dot");
                        if (unreadState) {
                            unreadState.setAttribute("class","uc-chat-unread-dot-over");
                            var msgInfo = {
                                messageId : self.getAttribute("id"),
                                userId : $chatView.userId,
                                fromJid : self.getAttribute("data-from"),
                                fromName : "",
                                toJid : self.getAttribute("data-to"),
                                toName : "",
                                type : "microtalk",
                                body : "",
                                state : "",
                                msgFileState : 1
                            }
                            uc.db.insertUcMessageMsg($chatView.userId,msgInfo,function(){
                                console.log("成功");
                            });
                        }
                    }
                }
            });
            $ucChatToolsFunction.record.playAudioObj.start(function () {
                if(self.getAttribute("data-from") == $chatView.userId){
                    self.querySelector(".uc-record").src = "../img/voice/voice-me.gif";
                }else{
                    self.querySelector(".uc-record").src = "../img/voice/voice-other.gif";
                }
            });
        },
        showSuccessVoiceStyle : function(result){
            console.log("进入发送语音展现样式方法")
            var _html = "";
            // 显示发送时间
            _html += chat.showSendMsgTime(_html);
            var data = {
                memberId: chat.userId,
                from: chat.userId,
                chatType: $chatView.states.chatType,
                msgType: "voice",
                body: result,
                chatId: result.fileId,
                isNative : "true",
                timestamp : new Date().format("yyyy-MM-ddThh:mm:ss.000000+08:00")
            };
            if($chatView.states.chatType == "chat"){
                data.readStateClass = "uc-chat-unread";
                data.readState = "未读";
            }
            if($chatView.states.chatType == "groupchat"){
                data.name = cmp.member.name;
            }
            _html += msgType(data);
            $chatView.chatList.innerHTML = $chatView.chatList.innerHTML + _html;
            var w = $ucChatToolsFunction.record.voiceProgressWidth(data);
            var pn = document.getElementById(result.fileId);
            var voice = pn.querySelector(".voice");
            voice.style.width = w;
            pn.querySelector(".uc-chat-base").style.display = "block";
            $chatView.timestamp = new Date().getTime();
            chat.refreshPage("#all_chat","#cmp-control",0);
        }
    },

    //----- 图片-----//
    picture : {
        imgDomList : [],
        doneCount : 0,
        returnCount : null,
        imgFileList : {},
        /**
         * 通过相机和相册中添加图片的控件
         * 
         * @param 操作参数
         */
        addPictureControl : function(pictureNum, successCallBack,type) {
        	cmp.camera.getPictures({
                allowEdit: false,
                sourceType: type,
                destinationType: cmp.camera.DestinationType.FILE_URI,
                quality:60,
                pictureNum: pictureNum,
                success:successCallBack,
                error: function (e) {
                }
            });
        },
        /**
         * 初始化聊天信息中的图片展现大小
         */
        initPic: function (ele) {
            var obj = querySelectorAll(ele);
            if (obj.length > 0) {
                $ucChatToolsFunction.picture.picSize(obj, 117, 280);
            }
        },
        /**
         * 计算快速选择照片的宽度（本期不加该功能）
         * @param ele1
         * @param ele2
         * 暂时没用
         */
        picDivWidth: function (ele1, ele2) {
            var ele = querySelectorAll(ele1);
            var w = 0;
            for (var i = 0; i < ele.length; i++) {
                w = w + parseInt(ele[i].width) + 10;
            }
            _$(ele2).parentNode.style.width = w + 4 + "px";
        },
        /**
         * 给快速选择照片添加样式(本期不需要加该功能)
         * @param ele
         */
        addPicCurrent: function (ele) {
            var els = querySelectorAll(ele);
            for (var i = 0; i < els.length; i++) {
                els[i].addEventListener("tap", function (arg) {
                    var flag = true;
                    return function () {
                        if (flag) {
                            this.className = this.className + " uc-pic-current";
                            this.querySelector("i").className = this.querySelector("i").className.replace("uc-no-check", "see-icon-success-circle-fill");
                            flag = false;
                        } else {
                            this.className = this.className.replace(" uc-pic-current", "");
                            this.querySelector("i").className = this.querySelector("i").className.replace("see-icon-success-circle-fill", "uc-no-check");
                            flag = true;
                        }
                    }
                }(i));
            }
        },
        /**
        *
        *图片操作方法
        *
        *最大宽度117，最大高度280
        *大图：横图，按照最大高度显示，宽度等比缩放，超过部分切掉
        *大图：竖图，按照最大宽度显示，高度等比缩放，超过部分切掉
        *小图：横图，按照最大高度显示，宽度等比缩放，超过部分切掉
        *小图：竖图，按照最大宽度显示，高度等比缩放，超过部分切掉
        *正方图：等比缩放
        */
        picSize : function(img,maxWidth, maxHeight){
            if(img && img.length > 0){
                for (var i = 0; i < img.length; i++) {
                    var w = img[i].width;
                    var h = img[i].height;
                    if(w < maxWidth && h < maxHeight){
                        if(maxWidth / w > maxHeight / h){
                            img[i].setAttribute("height",maxHeight + "px");
                        }
                        else{
                            img[i].setAttribute("width",maxWidth + "px");           
                        }
                    }
                    else if(w > maxWidth && h > maxHeight){
                        if(w / maxWidth > h / maxHeight){
                            img[i].setAttribute("width",maxWidth + "px");
                        }
                        else {
                            img[i].setAttribute("height",maxHeight + "px");
                        }
                    }
                    else if(w > maxWidth || h > maxHeight){
                        if(w > maxWidth){
                            img[i].setAttribute("width",maxWidth + "px");
                        }else{
                            img[i].setAttribute("height",maxHeight + "px");
                        }
                    }
                    else if(w == maxWidth || h == maxHeight){
                        if(w == maxWidth && h <= maxHeight){
                            img[i].setAttribute("width",maxWidth + "px");
                        }else{
                            img[i].setAttribute("height",maxHeight + "px");
                        }
                        if(h == maxHeight && w <= maxWidth){
                            img[i].setAttribute("height",maxHeight + "px"); 
                        }else{
                            img[i].setAttribute("width",maxWidth + "px");
                        }
                    }
                }
            }
        },
        // 从拍照中获取图片成功后执行的事件
        getPicSuccess : function(pictures){
            if (pictures != undefined) {
                if (!pictures.success) {
                    cmp.notification.toast(pictures.msg);
                    return;
                }
                if(pictures.files && pictures.files.length > 0){
                    $ucChatToolsFunction.picture.sendPic(pictures);
                }
            }
        },
        // 发送图片
        sendPic : function(pic){
            // 清空
            $ucChatToolsFunction.picture.imgDomList = [];
            $ucChatToolsFunction.picture.returnCount = pic.files.length;
            $ucChatToolsFunction.picture.doneCount = 0;
            $ucChatToolsFunction.picture.imgFileList = {};
            for(var i = 0; i < pic.files.length; i++){
                var fileId = chat.uuid();
                var file = pic.files[i];
                var fsize = Math.round(file.fileSize/1024);
                if(fsize < 1){
                    fsize=1;
                }
                var fpath = file.filepath;
                var str = fpath.split("/");
                var fname = str[str.length-1];
                $ucChatToolsFunction.picture.sendPicSuccStyle(fileId,fpath,fname);
                $ucChatToolsFunction.picture.imgDomList.push(fileId);
                $ucChatToolsFunction.picture.imgFileList[fileId] = {
                    fileSize : fsize,
                    fileTitle : fname,
                    filePath : fpath
                }
            }
            $ucChatToolsFunction.picture.uploadSendImg(fileId);
        },
        uploadSendImg : function(fileId){
            var i = $ucChatToolsFunction.picture.doneCount;
            var id = $ucChatToolsFunction.picture.imgDomList[i];
            if($ucChatToolsFunction.picture.imgDomList.length == i){
                return;
            }
            var imgDom = document.getElementById(id);
            imgDom.setAttribute("imgLoad","true");
            var file = $ucChatToolsFunction.picture.imgFileList[id];
            chatFileUploadUrl.uploadImg(
                cmp.member.id,
                $chatView.states.toId,
                file.fileTitle,
                file.fileSize,
                $chatView.states.chatType,
                false,
                function(data){
                    var obj = getIqXml(data);
                    var imgName = uc.getElementsByTagName(obj.xmlDoc,"name");
                    var imgId = uc.getElementsByTagName(obj.xmlDoc,"id");
                    var imgUrl = getImgDownLoadPath(obj.xmlDoc,imgId,$chatView.uc_url);
                    var opts = {
                        url : imgUrl,
                        fileList : [{
                            filepath : file.filePath,
                            fileId : id
                        }],
                        imgIndex : null ,
                        progress:function(data){
                            var fid = data.fileId;
                            var pos = parseInt(data.pos * 100);
                            if(pos > 0){
                                var imgMask = document.getElementById(fid).querySelector(".imgMask");
                                var nowImg = document.getElementById(fid).querySelector(".uc-chat-img");
                                imgMask.style.height = nowImg.height + "px";
                                imgMask.style.lineHeight = nowImg.height + "px";
                                imgMask.style.display = "block";
                                imgMask.innerHTML = pos + "%";
                            }
                            chat.refreshPage("#all_chat","#cmp-control",0);
                        },
                        success : function(data){
                            if(data.pos == 1){
                                var liId = data.fileId;
                                var img = document.getElementById(liId).querySelector(".uc-chat-img");
                                img.setAttribute("imgload","false");
                                var imgMask = document.getElementById(liId).querySelector(".imgMask");
                                imgMask.style.display = "none";
                                imgMask.innerHTML = "";
                                var time = new Date().format("yyyy-MM-ddThh:mm:ss.000000+08:00");
                                // 向后台发送图片
                                chatForImage($chatView.states.toId,$chatView.states.toName,$chatView.states.chatType,imgId,imgName,fileId,time,file.fileSize,function(data){
                                    // 发送失败样式
                                    chat.sendFailStyle(liId);
                                });
                                $ucChatToolsFunction.picture.doneCount ++;
                                $ucChatToolsFunction.picture.returnCount --;
                                $ucChatToolsFunction.picture.uploadSendImg();
                                $chatView.sendMsgId = liId;
                            }
                        },
                        error : function(data){
                            var errId = data.fileId;
                            if(errId){
                                chat.sendFailStyle(errId);
                            }
                        }
                    };
                    chat.upLoad(opts);// 上传原图
                },
                function(data){
                    chat.sendFailStyle(fileId);
                    // if(data.code == 36005){
                    //     cmp.notification.toast(data.message);
                    // }
                }
            );
        },
        // 发送图片成功样式
        sendPicSuccStyle : function(fileId,imgPath,fname){
            var _html = "";
            _html += chat.showSendMsgTime(_html);
            var data = {
                memberId:chat.userId,
                from:chat.userId,
                chatType: $chatView.states.chatType,
                msgType : "image",
                src:imgPath,
                chatId:fileId,
                name : cmp.member.name,
                mId : cmp.buildUUID(),
                mTitle : fname,
                timestamp : new Date().format("yyyy-MM-ddThh:mm:ss.000000+08:00")
            };
            if($chatView.states.chatType == "chat"){
                data.readStateClass = "uc-chat-unread";
                data.readState = "未读";
            }
            // 先显示发送消息样式
            _html += msgType(data);
            $chatView.chatList.innerHTML += _html;
            document.getElementById(fileId).querySelector(".uc-chat-img").setAttribute("src",imgPath);
            setTimeout(function(){$ucChatToolsFunction.picture.initPic(".uc-chat-img");},10);
            chat.refreshPage("#all_chat","#cmp-control",0);
            $chatView.timestamp = new Date().getTime();
        },
        // 点击聊天窗口中的图片，进行查看大图
        imgUrlList : [],
        lookBigPic : function(){
            $ucChatToolsFunction.picture.imgUrlList = [];
            var allImgs = document.querySelector("#chat_list").querySelectorAll(".uc-chat-img");
            for(var i = 0,len = allImgs.length;i < len; i ++) {
                allImgs[i].setAttribute("img-index", i);
            }
            // 查看本地图片
            if(this.getAttribute("imgload") == "false"){
                var now = this;
                cmp.sliders.addNew(now.getAttribute("src"));
                cmp.sliders.detect(0);
            }else{
                var mid = this.getAttribute("imgid");
                mid = mid.indexOf("_1") != -1 ? mid.split("_")[0] : mid; 
//                $ucChatToolsFunction.picture.getImgUrl(mid);
                var url = uc.getImgPath(mid);
                $ucChatToolsFunction.picture.imgUrlList.push(url);
                // TODO  
                setTimeout(function(){
                    cmp.sliders.addNew($ucChatToolsFunction.picture.imgUrlList);
                    cmp.sliders.detect(0);
                },500);
            }
        },
        // 根据图片id获取图片的路径
        getImgUrl : function(imgId){
            chatFileDownload.getDownloadUrl(cmp.member.id, imgId, "image", function (result) {
                var obj = getIqXml(result);
                if (obj.xmlIq.getAttribute("type") == "result") {
                    var url = getImgPath(obj.xmlDoc,$chatView.uc_url);
                    $ucChatToolsFunction.picture.imgUrlList.push(url);
                }
            },function(data){
                if(data.code == "36005"){
                    cmp.notification.alert(data.message,function(){
                        cmp.href.closePage();
                    },"","确定");
                }
            });
        }
    }
};