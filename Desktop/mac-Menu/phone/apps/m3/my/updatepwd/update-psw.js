/**
 * @description 修改密码功能 2018-09-12
 * @author Clyne
 */
;(function () {
    //页面对象
    var updatePsw = {
        isUpdated: false,
        curIndex: 0,
        userEmail: '',
        isClickNext: false,
        inputTimer: null, codeTimer: null,
        isGotCode: false,
        systemEmailAvailable: null,

        //页面入口，初始化函数
        initPage: function () {
            new RegExp
            var _this = this;
            window.onload = function () {
                _this.initPageLanguage();
                _this.setNewViewInput();
                _this.initStyle();
                _this.initEvent();
                _this.initData();
            };
        },
        initStyle: function () {
            var iphone = /(iphonex)/i;
            var iphonex = iphone.test(navigator.userAgent);
            var isIOS = navigator.userAgent.indexOf('iPhone') > -1;
            var isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1;
            if (isIOS) {
                document.body.classList.add('ios');
                if (iphonex) {
                    document.body.classList.add('ios-x');
                } else {
                    document.body.classList.add('ios-c');
                }
            } else if (isAndroid) {
                document.body.classList.add('android');
            } else {
                document.body.classList.add('android');
            }

        },
        //事件初始化
        initEvent: function () {
            var _this = this,
                timer;

            //返回
            $('.m3-back').on('tap', function () {
                confirmCloseWebview();
            });

            //下一步
            $('.next').on('tap', function () {
                var $this = $(this);
                //函数节流
                clearTimeout(timer);
                var preCurIndex = _this.curIndex;
                timer = setTimeout(function () {
                    $('.slider-box input').blur();

                    if ($this.hasClass('disable-btn')) return;
                    //校验第一个接口是否返回
                    if (!_this.firstRequestIsBack()) return;
                    if (preCurIndex !== _this.curIndex) return;
                    if (_this.isClickNext === true) return;
                    var methodArr = ['validateUserEmailSubmit', 'validateCodeSubmit', 'updatePswSubmit'];
                    if (_this.curIndex !== 1) {
                        _this.cleanTimer();
                    }
                    _this[methodArr[_this.curIndex]]();
                    timer = undefined;
                }, 300);
            });

            //企业账号输入
            $('.user-acount').on('input', function () {
                _this.validateInputEmpty($(this));
            });

            //验证码输入
            $('.code-value').on('input', function () {
                _this.validatePageTwoNextButton($(this));
            });

            $('.get-code').on('tap', function () {
                if (!$(this).hasClass('disable')) {
                    $(this).addClass('disable');
                    _this.timerStart(60);
                    _this.isGotCode = true;
                    _this.validatePageTwoNextButton($('.code-value'));
                    request.getValidateCode(function () {
                        // $('.bind-email').text(language.language.page2.headSentTip + _this.userEmail);
                    }, function (e, s) {
                        _this.getFailMessageLanguage('getVerificationCode', [e, s]);

                        _this.cleanTimer();
                    })
                }
            });

            $('.psw-value').on('input', function () {
                _this.validatePswIsSame();
            });

            $('.psw-confirm').on('input', function () {
                _this.validatePswIsSame();
            });
        },
        //初始化页面语言文字
        initPageLanguage: function () {
            $('.language-tag').each(function (i) {
                var keys = $(this).attr('data-language-key') || '';
                var attr = $(this).attr('data-language-attr') || 'innerText';
                keys = keys.split('.');
                var s = language.language;
                if (keys.length) {
                    keys.forEach(function (key, eq) {
                        if (key in s) {
                            s = s[key]
                        } else {
                            s = ''
                        }
                    })
                }
                this[attr] = s;
            })
        },
        // 设置当前显示可以操作的输入框
        setNewViewInput: function () {
            var pageClass = 'page' + (this.curIndex + 1);
            $('input').each(function (i) {
                if ($(this).parents('.flex-1').hasClass(pageClass)) {
                    this.disabled = false
                } else {
                    this.disabled = true
                }
            })
        },
        initData: function () {
            var _this = this;
            request.validateSystemEmailAvailable(function () {
                console.log('validateSystemEmailAvailable success');
                _this.systemEmailAvailable = true;
            }, function (e, status) {
                _this.systemEmailAvailable = false;
                if (status === 'timeout') {
                    toast(language.language.ajax.noConnectServer, closeWebview);
                } else if (status === 'abort') {
                    toast(language.language.ajax.noConnectServer, closeWebview);
                } else {
                    toast(language.language.com.emailAvailableFail, closeWebview);
                }
            })
        },

        //提交验证用户邮箱，page 1
        validateUserEmailSubmit: function () {
            var _this = this,
                acount = $('.user-acount').val();
            request.validateUserEmailAvailable(acount, function (response) {
                _this.submitBtnUnActive();
                _this.curIndex++;
                request.token = response.data.token;
                _this.userEmail = response.data.email || '';
                $('.bind-email').text(language.language.page2.headTip + _this.userEmail);
                _this.translate();
            }, function (response, status) {
                //TODO 失败提示
                _this.getFailMessageLanguage('getUserEmail', [response, status]);
            })
        },

        //提交验证码，page 2
        validateCodeSubmit: function () {
            var _this = this,
                code = $('.code-value').val(), reg = /^[0-9a-z-A-Z]+$/;
            if (!reg.test(code)) {
                toast(language.language.com.availableCode);
                return
            }
            request.validateCode(code, function () {
                _this.curIndex++;
                _this.translate();
                $('.next').text(language.language.page3.nextButton);
                $('#page-title').text(language.language.page3.title);
                _this.submitBtnUnActive();
            }, function (response, status) {
                _this.getFailMessageLanguage('checkVerificationCode', [response, status]);
            })
        },

        firstRequestIsBack: function (cb) {
            if (this.systemEmailAvailable === null) {
                toast(language.language.com.checkingSystemEmail);
                return false;
            } else if (this.systemEmailAvailable === true) {
                return true;
            }
        },

        //更新密码 page 3
        updatePswSubmit: function () {
            var psw = $('.psw-value').val();
            var _this = this;
            _this.isClickNext = true;
            if (_this.invalidCharacterFn(psw)) {
                request.updatePsw(psw, function () {
                    _this.isClickNext = false;
                    _this.isUpdated = true;
                    window.tipsModal(language.language.page3.updateSuccess, function () {
                        closeWebview();
                    });
                }, function (response, status) {
                    _this.isClickNext = false;
                    _this.getFailMessageLanguage('submitUpdatePassword', [response, status]);
                });
            }
        },
        invalidCharacterFn(value) {
            for (var i = 0; i < value.length; i++) {
                if (!value[i].match(/[0-9a-zA-Z\!\@\#\$\%\^\&\*\(\)\_\+\-\=\'\"\;\:\{\}\|\.\>\,\<\\\/\]\[\?\`\~]+/)) {
                    toast(language.language.com.invalidCharacter);
                    return false;
                }
            }
            return true
        },
        validatePswLevel: function (value) {
            var RegExpArr = [
                //数字
                /\d+/,
                //小写字母
                /[a-z]+/,
                //大写字母
                /[A-Z]+/,
                //键盘的特殊字符
                /[\!\@\#\$\%\^\&\*\(\)\_\+\-\=\'\"\;\:\{\}\|\.\>\,\<\\\/\]\[\?\`\~]+/
            ], level = 0;
            if (value.length < 6) {
                $('.psw-level').removeClass('level-1 level-2 level-3 level-4');
                return false;
            }
            for (var i = 0; i < RegExpArr.length; i++) {
                if (value.match(RegExpArr[i])) {
                    if (level === 3 && value.length <= 14) {
                        break;
                    }
                    level++;
                }
            }
            //显示密码强度
            $('.psw-level').removeClass('level-1 level-2 level-3 level-4');
            $('.psw-level').addClass('level-' + level);
            return true;
        },

        translate: function () {
            var index = this.curIndex,
                _winW = document.body.offsetWidth,
                boxNode = $('.slider-box'),
                x = -1 * index * _winW + 'px';
            this.setNewViewInput();
            boxNode.css({
                'transform': 'translate3d(' + x + ', 0, 0)',
                '-webkit-transform': 'translate3d(' + x + ', 0, 0)',
                'transitionDuration': '400ms',
                '-webkit-transitionDuration': '400ms'
            });
        },

        cleanPageByIndex: function (index) {
            //清除党页所有input框
            $('.slider-box').find('section').eq(index).find('input').val('');
            $('.psw-level').removeClass('level-1 level-2 level-3 level-4');
            this.cleanTimer();
        },

        cleanTimer: function () {
            clearTimeout(this.codeTimer);
            $('.get-code').text(language.language.page2.codeButton).removeClass('disable');
        },

        validatePswIsSame() {
            var _this = this;
            //函数节流
            clearTimeout(this.inputTimer);
            this.inputTimer = setTimeout(function () {
                var psw = $('.psw-value').val(),
                    confirmPsw = $('.psw-confirm').val();
                if (_this.validatePswLevel(psw) && psw !== '' && confirmPsw !== '' && confirmPsw === psw) {
                    _this.submitBtnActive();
                } else {
                    _this.submitBtnUnActive();
                }
            }, 100);
        },

        timerStart: function (time) {
            var node = $('.get-code'),
                _this = this;
            if (time < 0) {
                node.text(language.language.page2.resendCode).removeClass('disable');
                return;
            }
            this.codeTimer = setTimeout(function () {
                node.text(time + 's');
                _this.timerStart(--time);
            }, 1000);
        },

        validateInputEmpty: function ($this) {
            var _this = this;
            //函数节流
            clearTimeout(this.inputTimer);
            this.inputTimer = setTimeout(function () {
                if ($this.val() !== '') {
                    _this.submitBtnActive();
                } else {
                    _this.submitBtnUnActive();
                }
            }, 100);
        },

        validatePageTwoNextButton($this) {
            if (this.isGotCode) {
                this.validateInputEmpty($this);
            } else {
                this.submitBtnUnActive();
            }
        },
        submitBtnActive: function () {
            $('.next').removeClass('disable-btn');
        },

        submitBtnUnActive: function () {
            $('.next').addClass('disable-btn');
        },
        getFailMessageLanguage(key, resList) {
            var response = resList[0];
            var statusText = resList[1];
            var msg = language.language.ajax[key]['s' + response.code];
            if (statusText === 'timeout') {
                toast(msg || language.language.ajax.noConnectServer);
            } else if (statusText === 'abort') {
                toast(language.language.ajax.noConnectServer);
            } else {
                toast(msg || language.language.ajax.defaultError);
            }

        }
    };

    //数据接口
    var request = {

        headers: {
            "Accept": "application/json; charset=UTF-8",
            "Content-Type": "application/json; charset=UTF-8",
        },
        timeout: 60000,
        baseUrl: window.location.origin + "/mobile_portal",
        userName: "",
        token: "",

        /**
         * @method ajax
         * @description XHR请求器
         * @param {string} url 请求地址
         * @param {any} params 参数
         * @param {function} success 成功回调
         * @param {function} fail 失败回调
         * @param {string} type 请求类型 默认为POST
         * @param {} 请求头
         */
        ajax: function (url, params, success, fail, type, headers) {
            $.ajax({
                url: url || '',
                headers: headers || '',
                dataType: 'JSON',
                type: type || 'POST',
                timeout: this.timeout,
                data: params || '',
                success: function (response) {
                    var result = JSON.parse(response);
                    if (result.code === 0) {
                        success && success(result);
                    } else {
                        fail && fail(result);
                    }
                },
                error: function (e, status) {
                    console.error('Ajax Error: url:' + params.url + 'Request fail');
                    fail && fail(e, status);
                }
            });
        },

        /**validateSystemEmailAvailable
         * @method validateSystemEmailAvailable
         * @description 验证系统邮箱是否可用
         * @param {function} success 成功回调
         * @param {function} fail 失败回调
         */
        validateSystemEmailAvailable: function (success, fail) {
            var url = this.baseUrl + "/seeyon/rest/password/retrieve/canUseEmail";
            this.ajax(url, '', success, fail, "GET");
        },

        /**
         * @method validateUserEmailAvailable
         * @description 根据账号验证用户账号的邮箱是否可用
         * @param {string} acount 账号
         * @param {function} success 成功回调
         * @param {function} fail 失败回调
         */
        validateUserEmailAvailable: function (acount, success, fail) {
            this.userName = acount;
            var url = this.baseUrl + "/seeyon/rest/password/retrieve/getEmailByLoginName/" + acount;
            this.ajax(url, '', success, fail, "GET");
        },

        /**
         * @method getValidateCode
         * @description 获取用户校验码
         * @param {function} success 成功回调
         * @param {function} fail 失败回调
         */
        getValidateCode: function (success, fail) {
            var url = this.baseUrl + "/seeyon/rest/password/retrieve/send/" + this.userName + "?token=" + this.token;
            this.ajax(url, '', success, fail, "GET");
        },
        /**
         * @method validateCode
         * @description 检验用户输入的验证码
         * @param {string} code 账号
         * @param {function} success 成功回调
         * @param {function} fail 失败回调
         */
        validateCode: function (code, success, fail) {
            var url = this.baseUrl + "/seeyon/rest/password/retrieve/checkVerificationCode/" + this.userName + "/" + code + "?token=" + this.token;
            this.ajax(url, '', success, fail, "GET");
        },

        /**
         * @method updatePsw
         * @description 修改密码
         * @param {string} code 账号
         * @param {function} success 成功回调
         * @param {function} fail 失败回调
         */
        updatePsw: function (psw, success, fail) {
            var url = this.baseUrl + "/seeyon/rest/password/retrieve/resetPassword?token=" + this.token;
            var param = JSON.stringify({
                loginName: this.userName,
                password: psw
            });
            this.ajax(url, param, success, fail, "POST", this.headers);
        }
    };

    //提示框
    function toast(msg, fn) {
        $('.slider-box input').blur();
        var buttonInfo = language.language.com.alert;
        buttonInfo.fn = fn;
        msg && window.alertModal(msg, buttonInfo);
        // msg && window.tipsModal(msg, buttonInfo);
    }

    function closeWebview() {
        window.location.href = "jsbridge://cmp?isSync=true&bridge='CoreBridge'&action='back'";
    }

    function confirmCloseWebview() {
        clearTimeout(updatePsw.timer);
        if (screen.height - 200 < window.innerHeight) {
            setConfirmModal();
        } else {
            updatePsw.timer = setTimeout(function () {
                setConfirmModal();
            }, 300);
        }
        $('.slider-box input').blur();

        function setConfirmModal() {
            updatePsw.timer = null;
            window.confirmModal(language.language.com.confirm.title, [
                {
                    text: language.language.com.confirm.cancel
                },
                {
                    text: language.language.com.confirm.sure,
                    fn: closeWebview
                }
            ]);
        }
    }

    window.closeWebviewFn = function () {
        if (updatePsw.isUpdated) return;
        if ($('.notice-component').length) {
            $('.notice-component').remove();
            return;
        }
        confirmCloseWebview();
    }
    var isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1;

    if (isAndroid && CMPBridge && CMPBridge.execute) {
        CMPBridge.execute('','CoreBridge','overrideBack', 'closeWebviewFn()','','');
    }
    updatePsw.initPage();
})();