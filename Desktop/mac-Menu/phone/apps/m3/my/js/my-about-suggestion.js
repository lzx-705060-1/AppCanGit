/**
 * description: 我的模块——意见反馈
 * author: hbh
 * createDate: 2017-01-07
 */
(function() {
    var sliderGroup = $(".cmp-slider-group");
    var sliderIndicator = $(".cmp-slider-indicator");
    var imgArr = [];
    //入口函数
    function initPage() {
        cmp.ready(function() {
            initStyle();
            initEvent();
        });
    }
    initPage();

    //样式初始化
    function initStyle() {
        //placeholder国际化
        //意见文本框
        var textPlaceholderStr = cmp.i18n("my.m3.h5.suggestionTip");
        var textarea = document.querySelector("#question");
        textarea.setAttribute('placeholder', textPlaceholderStr);
        //联系方式
        var contactPlaceholderStr = cmp.i18n("my.m3.h5.contactTip");
        var contact = document.querySelector("#phone");
        contact.setAttribute('placeholder', contactPlaceholderStr);
    }

    //事件初始化
    function initEvent() {
        //获取设备信息
        var device = cmp.device.info();

        //获取网络类型
        var getNetworkType = "";
        cmp.connection.getNetworkType({
            success: function(res) {
                getNetworkType = res;
            }
        });

        var imgSrc = "";
        var data = m3.userInfo.getCurrentMember();
        var imageIDList = "";
        var questionStr = "";
        var phoneStr = "";
        var canClick = true;

        //添加图片
        $(".add").on("tap", function() {
            var getPicSuccess = function(res) {
                imgSrc = res.files[0].filepath;
                if ((res.files[0].type == "jpeg" || res.files[0].type == "png" || res.files[0].type == "gif" || res.files[0].type == "jpg") && parseInt(res.files[0].fileSize) < 5242880) {
                    //图片上传到服务器
                    cmp.att.upload({ //附件上传接口
                        url: "http://m1.seeyon.com:80/feedback/feedUploadManager.do?t=t",
                        fileList: [{
                            filepath: imgSrc //单个文件路径
                        }],
                        imgIndex: "sortNum",
                        progress: function(result) {
                            var fileId = result.fileId;
                            var pos = result.pos;
                        },
                        success: function(res) {
                            if (res.response != -1) {
                                imageIDList += res.response + "|";
                                //console.log(imageIDList);
                            }
                        },
                        error: function(error) {
                            //console.log(error);
                        }
                    });
                    if (imgArr.length < 10) {
                        imgArr.push(imgSrc);
                        $(".add").before('<li class="img"><img src="' + imgSrc + '"></li>');
                        reset_order();
                    }
                    imgArr.length >= 10 ? $(".add").addClass("display_none") : $(".add").removeClass("display_none");
                } else {
                    cmp.notification.toast(m3.i18n[cmp.language].uploadPicTip, "center");
                }
            };
            cmp.camera.getPictures({
                compress: true,
                destinationType: 1,
                sourceType: 2,
                quality: 100,
                pictureNum: 1,
                success: getPicSuccess,
                error: function(res) {}
            });
        });

        //点击图片，显示预览界面
        $(".question-img").on("tap", "li.img", function() {
            $(".delete-pic").removeClass("display_none");
            var param = $(this).attr("data-i");
            var headerHeight = $(".delete-pic").find("header").height();
            $(".cmp-slider").css({ "top": headerHeight, "height": "calc( 100% -" + " " + headerHeight + "px" + ")" });
            picturePreview(param);
        });

        //返回,关闭预览界面
        $("#close").on("tap", function(e) {
            e.preventDefault();
            setTimeout(function() {
                $(".delete-pic").addClass("display_none");
            }, 500);
        });

        //删除图片
        $("#delete").on("tap", function() {
            var imgIndex = parseInt($(".cmp-slider-indicator").find(".cmp-active").attr("data-i"));
            imgArr.splice(imgIndex, 1);
            var imageIDListArr = imageIDList.slice(0, imageIDList.length - 1).split('|');
            imageIDListArr.splice(imgIndex, 1);
            imageIDList = imageIDListArr.toString().replace(/,/g, "|");

            $(".cmp-slider-item")[imgIndex].remove();
            $(".question-img").find("li")[imgIndex].remove();
            $(".cmp-indicator")[imgIndex].remove();
            reset_order();
            imgArr.length < 10 ? $(".add").removeClass("display_none") : $(".add").addClass("display_none");
            if (imgIndex == $(".cmp-slider-item").length) {
                picturePreview(imgIndex - 1);
            } else {
                picturePreview(imgIndex);
            }
            if ($("#total").html() == "0") {
                $(".delete-pic").addClass("display_none");
            }
        });

        //监听变化，显示第几张
        document.querySelector('.cmp-slider').addEventListener('slide', function(event) {
            //注意slideNumber是从0开始的；
            document.getElementById("current").innerText = event.detail.slideNumber + 1;
            var img = $("#slider").find("img")[event.detail.slideNumber];
            var imgHeight = img.height;
            var sliderHeight = $("#slider").height();
            if (sliderHeight > imgHeight) {
                var marginTop = ((sliderHeight - imgHeight) / 2) + "px";
                $(".cmp-slider").css("margin-top", marginTop);
            } else {
                $(".cmp-slider").css("margin-top", "0");
            }
        });

        //发送
        $("#send").on("tap", function() {
            if (canClick) {
                canClick = false;
                var emoji = cmp.Emoji(); //建立emoji入口
                questionStr = $("#question").val();
                phoneStr = $("#phone").val();
                if (emoji.isEmojiCharacter(questionStr)) { //判断是否是emoji表情
                    questionStr = emoji.EmojiToString(questionStr); //将你输入的表情值转换成字符串
                }
                if (emoji.isEmojiCharacter(phoneStr)) {
                    phoneStr = emoji.EmojiToString(phoneStr);
                }

                if ($("#question").val() == "") {
                    cmp.notification.toast(m3.i18n[cmp.language].noSuggestionTip, "center");
                    canClick = true;
                } else {
                    var suggestion = {
                        "name": data.name,
                        "m1Module": "m3",
                        "imageIDList": imageIDList,
                        "content": questionStr,
                        "contentType": "",
                        "clientType": "3",
                        "email": "",
                        "tel": phoneStr,
                        "deviceModel": device.model,
                        "osVersion": device.version,
                        "network": getNetworkType,
                        "m1Version": "",
                        "userCompany": data.accName,
                        "occupation": data.postName,
                        "jobLevel": data.levelName,
                        "ip": m3.curServerInfo.ip,
                        "oaVersion": ""
                    };
                    var sendUrl = "http://m1.seeyon.com:80/feedback/feedback/feedbackManager.xhtml";
                    m3.ajax({
                        custom: true,
                        type: 'POST',
                        dataType: 'multipart/form-data',
                        url: sendUrl,
                        data: JSON.stringify(suggestion),
                        native: false,
                        timeout: 30000,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        success: function(msg) {
                            //console.log(msg);
                            if (msg == "SUCCESS") {
                                cmp.notification.toast(m3.i18n[cmp.language].submitSuccess, "center");
                                $("#question").val("");
                                $("li.img").remove();
                                $("#phone").val("");
                                setTimeout(function() {
                                    cmp.href.back();
                                }, 500);
                            }
                        },
                        error: function(msg) {
                            cmp.href.back();
                        }
                    });
                }
            }
        });

        //处理弹起键盘的时候可以滚动页面的问题
        document.body.addEventListener('touchmove', function() {
            var question = document.querySelector("#question");
            if (question) {
                question.blur();
            }
        }, false);

        //处理ios键盘弹出后页面和状态栏重叠问题
        var header = document.getElementsByTagName("header")[0];
        var textarea = document.getElementsByTagName("textarea");
        cmp.HeaderFixed(header, textarea);

        //安卓自带返回键
        document.addEventListener("backbutton", function() {
            cmp.href.back();
        });

        //左上角返回按钮
        backBtn();
    }

    //图片预览
    function picturePreview(param) {
        var item = "";
        var indicator = "";
        var current = parseInt(param);
        $("#current").html(current + 1);
        $("#total").html(imgArr.length);
        if ($("#total").html() == "0") {
            $(".delete-pic").addClass("display_none");
        } else {
            //循环数组，生成轮播
            $.each(imgArr, function(i, n) {
                item += '<div class="cmp-slider-item"><a href="#"><img src="' + n + '" data-i="' + i + '" /></a></div>';
                indicator += '<div class="cmp-indicator" data-i="' + i + '"></div>';
            });
            sliderGroup.html(item);
            sliderIndicator.html(indicator);
            cmp('#slider').slider().gotoItem(current);

            var img = $("#slider").find("img")[current];
            var imgHeight = img.height;
            var sliderHeight = $("#slider").height();
            if (sliderHeight > imgHeight) {
                var marginTop = ((sliderHeight - imgHeight) / 2) + "px";
                $(".cmp-slider").css("margin-top", marginTop);
            } else {
                $(".cmp-slider").css("margin-top", "0");
            }
        }
    }

    //重新进行排序
    function reset_order() {
        [].forEach.call(document.querySelectorAll(".question-img li"), function(item, index) {
            var li = item;
            li.setAttribute('data-i', index);
        });
    }

    //左上角返回按钮
    function backBtn() {
        $("#backBtn").on("tap", function() {
            cmp.href.back();
        });
    }
})();
