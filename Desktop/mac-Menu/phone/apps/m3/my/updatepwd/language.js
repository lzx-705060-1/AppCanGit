/**
 * @description 获取页面语言文字信息
 * @author ybjuejue
 * @createDate 2018/9/28/028
 */

;(function (win) {
    var pageLanguage = {
        cn: {
            com: {
                back: '返回',
                invalidCharacter: '你输入的数据中了非法字符',
                emailAvailableFail: '系统邮箱不可用，请通知管理员设置邮箱地址',
                checkingSystemEmail: '正在校验系统邮箱是否已设置',
                availableCode: '请输入正确的验证码!',
                alert: {
                    title: '提示',
                    sure: '确定'
                },
                confirm: {
                    title: '你确定要放弃找回密码吗？',
                    sure: '确定',
                    cancel: '取消'
                }
            },
            ajax: {
                defaultError: '接口异常',
                noConnectServer: '当前网络不可用 请检查您的网络设置！',
                timeout: '请求超时!',
                getUserEmail: {
                    s0: '邮箱校验成功',
                    s1001: '请输入当前服务器的账号!',
                    s1002: '未设置有效邮箱!',
                    s1003: '未绑定有效邮箱!',
                    s1101: '邮件发送频率过高!',
                    s1102: '邮件发送失败!',
                    s1103: '系统邮箱不可用，请通知管理员设置邮箱地址'
                },
                getVerificationCode: {
                    s0: '验证码发送成功',
                    s1001: '请输入当前服务器的账号!',
                    s1002: '未设置有效邮箱!',
                    s1003: '未绑定有效邮箱!',
                    s1101: '邮件发送频率过高!',
                    s1102: '邮件发送失败!',
                    s2001: '会话已失效!',
                    s1103: '系统邮箱不可用，请通知管理员设置邮箱地址'
                },
                checkVerificationCode: {
                    s0: '验证码验证成功!',
                    s1001: '请输入当前服务器的账号!',
                    s1002: '未设置有效邮箱!',
                    s1003: '未绑定有效邮箱!',
                    s1201: '未接收到验证码!',
                    s1202: '验证码已失效!',
                    s1203: '验证码超过最大验证次数!',
                    s1204: '请输入正确的验证码!',
                    s2001: '会话已失效!'
                },
                submitUpdatePassword: {
                    s0: '密码重置成功!',
                    s1301: '请输入当前服务器的账号!',
                    s1302: '非法操作!',
                    s1303: '验证码丢失，无法进行密码重置!',
                    s1304: '验证码已经失效，无法进行密码重置!',
                    s1305: '密码重置失败!',
                    s2001: '会话已失效!',
                    s1103: '系统邮箱不可用，请通知管理员设置邮箱地址'
                }
            },
            page1: {
                title: '忘记密码',
                placeholder: '企业账号',
                nextButton: '下一步'
            },
            page2: {
                title: '忘记密码',
                headTip: '当前绑定邮箱：',
                headSentTip: '验证码已发送到邮箱：',
                placeholder: '验证码',
                codeButton: '获取验证码',
                resendCode: '重新发送',
                nextButton: '下一步'
            },
            page3: {
                title: '重置密码',
                nextButton: '提交',
                zoneTitle: '新密码',
                level1: '弱',
                level2: '中',
                level3: '强',
                level4: '最强',
                newPassword: '输入新密码 6-16个字符、数字、字母',
                secondPassword: '再次输入新密码',
                updateSuccess: '修改成功!'
            }
        },
        en: {
            com: {
                back: 'Back',
                emailAvailableFail: 'The system mailbox is not available. Please notify the administrator to set up the e-mail address',
                invalidCharacter: 'Illegal characters are entered in the data you entered',
                checkingSystemEmail: 'Checking whether the system mailbox is set up',
                availableCode: 'Please input the correct verification code!',
                alert: {
                    title: 'Tips',
                    sure: 'Sure'
                },
                confirm: {
                    title: 'Are you sure you want to give up your password?',
                    sure: 'Sure',
                    cancel: 'Cancel'
                }
            },
            ajax: {
                defaultError: 'Interface exception',
                noConnectServer: 'The current network is not available. Please check your network settings！',
                timeout: 'Request timeout!',
                getUserEmail: {
                    s0: 'Mailbox check success!',
                    s1001: 'Please input the account number of the current serve!',
                    s1002: 'No valid mailbox is set!',
                    s1003: 'Unbound valid mailbox!',
                    s1101: 'sending mail is too high!',
                    s1102: 'Mail delivery failed!',
                    s1103: 'The system mailbox is not available. Please notify the administrator to set up the e-mail address'
                },
                getVerificationCode: {
                    s0: 'Authentication code sent successfully!',
                    s1001: 'Please input the account number of the current serve!',
                    s1002: 'No valid mailbox is set!',
                    s1003: 'Unbound valid mailbox!',
                    s1101: 'sending mail is too high!',
                    s1102: 'Mail delivery failed!',
                    s2001: 'The session has expired!',
                    s1103: 'The system mailbox is not available. Please notify the administrator to set up the e-mail address'
                },
                checkVerificationCode: {
                    s0: 'Verification code verification successfully!',
                    s1001: 'Please input the account number of the current serve!',
                    s1002: 'No valid mailbox is set!',
                    s1003: 'Unbound valid mailbox!',
                    s1201: 'No authentication code was received!',
                    s1202: 'The verification code is invalid!',
                    s1203: 'The verification code exceeds the maximum number of authentication times!',
                    s1204: 'Please input the correct verification code!',
                    s2001: 'The session has expired!'
                },
                submitUpdatePassword: {
                    s0: 'Password reset successfully!',
                    s1301: 'Please input the account number of the current serve!',
                    s1302: 'Illegal operation!',
                    s1303: 'The authentication code is lost and no password reset is allowed!',
                    s1304: 'The verification code is invalid and cannot reset the password!',
                    s1305: 'Password reset failed!',
                    s2001: 'The session has expired!',
                    s1103: 'The system mailbox is not available. Please notify the administrator to set up the e-mail address'
                }
            },
            page1: {
                title: 'Forget Password',
                placeholder: 'Enterprise Account',
                nextButton: 'Next'
            },
            page2: {
                title: 'Forget Password',
                headTip: 'Bound mailbox：',
                headSentTip: 'Verification code sent to the mailbox：',
                placeholder: 'Verification Code',
                codeButton: 'Get Code',
                resendCode: 'Resend',
                nextButton: 'Next'
            },
            page3: {
                title: 'Reset Password',
                nextButton: 'Submit',
                zoneTitle: 'new password',
                level1: 'weak',
                level2: 'middle',
                level3: 'strong',
                level4: 'strongest',
                newPassword: 'New password 6-16 characters, numbers, letters',
                secondPassword: 'Enter the new password again',
                updateSuccess: 'Password modified successfully!'
            }
        }
    }, languageKeys = [];

    function languageClass() {
        for (var key in pageLanguage) {
            languageKeys.push(key);
        }
        this.setLanguage = function (type) {
            /**
             * @function name setLanguage
             * @description 初始化类的信息or设置语言
             * @author ybjuejue
             * @createDate 2018/9/28/028
             * @params x
             */
            this.type = dealLanguageType(type ? {lang: type} : stringParamsToJson(win.location.search));
            this.language = pageLanguage[this.type];
        };
        this.setLanguage();

        function stringParamsToJson(str) {
            /**
             * @function name stringParamsToJson
             * @description 用于将url的query 处理成对象
             * @author ybjuejue
             * @createDate 2018/9/28/028
             * @params str 传入的序列化的字符串
             */
            var stringInfo = str.replace(/\?|\s/g, ''), jsonInfo = {};
            if (stringInfo.length) {
                stringInfo.split('&').forEach(function (item, eq) {
                    var keyValue = item.split('=');
                    jsonInfo[keyValue[0]] = keyValue[1] || ''
                })
            }
            return jsonInfo;
        }

        function dealLanguageType(queryObj) {
            /**
             * @function name dealLanguageType
             * @description 处理语言类型 同时处理默认值cn
             * @author ybjuejue
             * @createDate 2018/9/28/028
             * @params queryObj url上得到的值
             */
            var queryType = (queryObj || {}).lang
            queryType = languageKeys.indexOf(queryType) >= 0 ? queryType : 'cn';
            return queryType
        }
    }

    win.language = new languageClass()
})(window);