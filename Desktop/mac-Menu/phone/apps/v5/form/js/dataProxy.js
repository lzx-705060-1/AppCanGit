/**
 * Created by yangchao on 2016/6/27.
 */

'use strict';

(function ($, doc) {

    $.sui = $.sui || {};

    var _proxyServer = 'http://10.5.5.251:3000';
    //var _sessionId = '5F66F283D6852F1346723FBDCE0CA724';
    //var _targetServer = 'http://10.5.5.240:88';

    var _sessionId = 'ced673a5-8f9f-4b2c-8f76-6a74a4292535';
    var _targetServer = 'http://10.5.5.251:8888';

    //代毅机器
    //var _sessionId = '68A11BE8F10E28EFA2C77A5F178C360A';
    //var _targetServer = 'http://10.5.5.233:8080';

    //曾乐环境
    //var _sessionId = 'hLhuKw4KCeilfjohO6IZfi6BA7b_ettCVmZk_akHDjCvpuannFRG';
    //var _targetServer = 'http://10.3.4.236:8080';

    var _rest = {
        token: '',
            jsessionid: '',
        post: function (url, params, body, options, callback) {
            this.service(url, params, body, $.extend({method: 'POST'}, options), callback);
        },
        get: function (url, params, body, options, callback) {
            this.service(url, params, body, $.extend({method: 'GET'}, options), callback);
        },
        put: function (url, params, body, options, callback) {
            this.service(url, params, body, $.extend({method: 'PUT'}, options), callback);
        },
        del: function (url, params, body, options, callback) {
            this.service(url, params, body, $.extend({method: 'DELETE'}, options), callback);
        },
        service: function (url, params, body, options, callback) {
            var result;
            var u = Object.keys(params || {}).length == 0 ? url : url + '?' + $.param(params);
            u = u.indexOf('?') > -1 ? u + '&' : u + '?';
            u = u + 'option.n_a_s=1';
            var lang = navigator.language;
            if (typeof lang == 'undefind') lang = 'zh-CN';
            var settings = $.extend({'Accept': 'application/json; charset=utf-8', 'AcceptLanguage': lang}, options);
            var dataType = 'json';
            if (settings.Accept.indexOf('application/xml') > -1) {
                dataType = 'xml';
            }
            var tk = $.token;
            tk = tk != undefined ? tk : '';
            var header = {
                'Accept': settings.Accept,
                'Accept-Language': settings.AcceptLanguage,
                'Content-Type': 'application/json; charset=utf-8',
                //'token': tk,
                //'Cookie': 'JSESSIONID=' + _sessionId
            };

            //发送数据到代理服务器
            var targetUrl = _targetServer + '/seeyon/rest/' + u;
            var url = _proxyServer + '/ajaxProxy?targetUrl=' + encodeURIComponent(targetUrl)  + '&sessionId=' + _sessionId;;
            $.ajax({
                type: settings.method,
                data: JSON.stringify(body),
                url: url,
                headers: header,
                dataType: dataType,
                native: false,
                success: function (res, textStatus, jqXHR) {
                    if (typeof res == 'string') {
                        try {
                            callback && callback(null, JSON.parse(res) || {});
                        } catch (ex) {
                            callback && callback({message: '解析JSON出错'}, res || {});
                        }

                    } else {
                        callback && callback(null, res);
                    }
                },
                error: function (err) {
                    //我自己封装一层，本来应该在cmp里面做的，处理一下response中返回的message数据\
                    //判断一下401，如果是401，不callback
                    if (['401', '1001', '1002', '1003', '1004', '-1001'].indexOf(err.status.toString()) != -1) return;
                    try {
                        var o = JSON.parse(err.responseText);
                        if (o && o.message) {
                            err.message = o.message;
                        }
                    } catch (e) {}
                    callback && callback(err);
                }
            });
        },
        authentication: function (userName, password) {
            //this.token = SeeyonApi.Token.getTokenByQueryParam('', {userName: userName, password: password}).id;
            //return this.token;
        },
        setSession: function (sessionId) {
            this.jsessionid = sessionId;
        }
    };

    $.sui.dataService = {
        proxyServer: _proxyServer,
        targetServer: _targetServer,
        sessionId: _sessionId,
        debug: true,
        capForm: {
            apply: function (data, callback) {
                _rest.options('capForm/getQueryList4Tree', {} , data, $.extend({'Accept': '*/*'}, {}), callback)
            },
            dealMultiEnumRelation: function (data, callback) {
                _rest.post('capForm/dealMultiEnumRelation', {}, data, $.extend({}, {}), callback)
            },
            showFormData: function (data, callback) {
                _rest.post('capForm/showFormData', {}, data, $.extend({}, {}), callback)
            },
            showMore: function (data, callback) {
                _rest.post('capForm/showMore', {}, data, $.extend({}, {}), callback)
            },
            showFormRelationRecord: function (data, callback) {
                _rest.post('capForm/showFormRelationRecord', {}, data, $.extend({}, {}), callback)
            },
            dealProjectFieldRelation: function (data, callback) {
                _rest.post('capForm/dealProjectFieldRelation', {}, data, $.extend({}, {}), callback)
            },
            getQueryResult: function (data, callback) {
                _rest.post('capForm/getQueryResult', {}, data, $.extend({}, {}), callback)
            },
            getQueryList4Tree: function (data, callback) {
                _rest.post('capForm/getQueryList4Tree', {}, data, $.extend({}, {}), callback)
            },
            dealFormRelation: function (data, callback) {
                _rest.post('capForm/dealFormRelation', {}, data, $.extend({}, {}), callback)
            },
            form: function (data, callback) {
                _rest.post('capForm/form', {}, data, $.extend({}, {}), callback)
            },
            generateSubData: function (data, callback) {
                _rest.post('capForm/generateSubData', {}, data, $.extend({}, {}), callback)
            },
            dealOrgFieldRelation: function (data, callback) {
                _rest.post('capForm/dealOrgFieldRelation', {}, data, $.extend({}, {}), callback)
            },
            dealLbsFieldRelation: function (data, callback) {
                _rest.post('capForm/dealLbsFieldRelation', {}, data, $.extend({}, {}), callback)
            },
            calculate: function (data, callback) {
                _rest.post('capForm/calculate', {}, data, $.extend({}, {}), callback)
            },
            addOrDelDataSubBean: function (data, callback) {
                _rest.post('capForm/addOrDelDataSubBean', {}, data, $.extend({}, {}), callback)
            },
            delAllRepeat: function (data, callback) {
                _rest.post('capForm/delAllRepeat', {}, data, $.extend({}, {}), callback)
            },
            queryExc: function (data, callback) {
                _rest.post('capForm/queryExc', {}, data, $.extend({}, {}), callback)
            },
            checkSessionMasterDataExists: function (params, callback) {
                _rest.get('capForm/checkSessionMasterDataExists', params, '', $.extend({}, {}), callback)
            },
            generateBarCode: function (data, callback) {
                _rest.post('capForm/generateBarCode', {}, data, $.extend({}, {}), callback)
            },
            decodeBarCode: function (data, callback) {
                _rest.post('capForm/decodeBarCode', {}, data, $.extend({}, {}), callback)
            },
            dealDeeRelation: function (data, callback) {
                _rest.post('capForm/dealDeeRelation', {}, data, $.extend({}, {}), callback)
            },
            mergeFormData: function (data, callback) {
                _rest.post('capForm/mergeFormData', {}, data, $.extend({}, {}), callback)
            },
            saveOrUpdate: function (data, callback) {
                _rest.post('capForm/saveOrUpdate', {}, data, $.extend({}, {}), callback)
            },
            loadTemplate: function (data, callback) {
                _rest.post('capForm/loadTemplate', {}, data, $.extend({}, {}), callback)
            },
        },
        cmplbs: {
            save: function (data, callback) {
                _rest.post('cmplbs/save', {}, data, $.extend({}, {}), callback)
            }
        },
        signet: {
            saveSignets: function (data, callback) {
                _rest.post('signet/saveSignets', {}, data, $.extend({}, {}), callback)
            }
        }
    }

})(cmp, document);