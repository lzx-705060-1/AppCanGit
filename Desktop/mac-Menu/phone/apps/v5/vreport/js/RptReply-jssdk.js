/**
 * sdk cap4的原因，引进了factory
 */
;(function( factory, global ) {
	var Reportreply = 
	{
		getReplyCount : function(_params, _body, options) {
			return SeeyonApi.Rest.post('report/reply/replys/count', _params, _body, cmp.extend({}, options))
		},
		cancelReply : function(_params, _body, options) {
			return SeeyonApi.Rest.post('report/reply/reply/cancel', _params, _body, cmp.extend({}, options))
		},
		findReply : function(_params, _body, options) {
			return SeeyonApi.Rest.post('report/reply/replys', _params, _body, cmp.extend({}, options))
		},
		cancelPraise : function(_params, _body, options) {
			return SeeyonApi.Rest.post('report/reply/praise/cancel', _params, _body, cmp.extend({}, options))
		},
		reply : function(_params, _body, options) {
			return SeeyonApi.Rest.post('report/reply/reply', _params, _body, cmp.extend({}, options))
		},
		praise : function(_params, _body, options) {
			return SeeyonApi.Rest.post('report/reply/praise', _params, _body, cmp.extend({}, options))
		}
	}
	//有顺序不好
	global.SeeyonApi = global.SeeyonApi || {};
	if ( global.SeeyonApi.Rest === undefined ) {
    	global.SeeyonApi.Rest = factory();
    }
	global.SeeyonApi.Reportreply = Reportreply;
})(function() {
    return {
        token : '',
        jsessionid : '',
        post : function( url, params, body, options ) {
            return this.service(url, params, body, cmp.extend({method:'POST'}, options));
        },
        get : function(url,params,body,options){
            return this.service(url,params,body,cmp.extend({method:'GET'},options));
        }, 
        put : function(url,params,body,options){
            return this.service(url,params,body,cmp.extend({method:'PUT'},options));
        },       
        del : function(url,params,body,options){
            return this.service(url,params,body,cmp.extend({method:'DELETE'},options));
        },     
        service : function(url,params,body,options){
            var result;
            var u = (typeof params === 'undefined')||params == '' ? url : url + '?' +cmp.param(params);
            u = u.indexOf('?')>-1 ? u + '&' :  u+ '?';
            u = u + 'option.n_a_s=1';
            var lang = navigator.language;        
            if(typeof(lang) == 'undefind')lang = 'zh-CN';
            var settings = cmp.extend({'Accept' : 'application/json; charset=utf-8','AcceptLanguage' : lang},options);
            var dataType = 'json';
            if(settings.Accept.indexOf('application/xml')>-1){
                dataType = 'xml';
            }
            var tk = window.localStorage.CMP_V5_TOKEN;        
            tk = tk!=undefined ? tk : ''  ;        
            var header = {
                    'Accept' : settings.Accept,
                    'Accept-Language' : settings.AcceptLanguage,
                    'Content-Type': 'application/json; charset=utf-8',
                    'token' : tk, 
                    'Cookie' : 'JSESSIONID='+this.jsessionid ,
                    'option.n_a_s' : '1'
            }

            if ( this.jsessionid ) {
                header.Cookie = 'JSESSIONID='+this.jsessionid;
            }
            var dataBody;
            if ( settings.method == 'GET' ) {
                if(body == ''){
                    dataBody = '';
                }else{
                    dataBody = JSON.stringify(body);
                }

            } else {
                dataBody = JSON.stringify(body);
            }
            cmp.ajax({
                type: settings.method , 
                data: dataBody,
                url : '/seeyon/rest/' + u ,
                async : false,
                headers: header,
                dataType : dataType,
                success : function ( r, textStatus, jqXHR ){
                    if ( dataType === 'xml' ) {
                        result = jqXHR.responseText;
                    } else {
                        result = r;
                    }
                    if( typeof(settings.success) !== 'undefined' ){
                        settings.success(result,textStatus,jqXHR);
                    }
                },
                error: settings.error
            });    
            return result;
        },
        authentication: function( userName, password ){
            this.token = this.getTokenByQueryParam('', {userName:userName, password:password}).id;
            return this.token;
        },
        setSession: function( sessionId ){
            this.jsessionid = sessionId;
        },
        getTokenByQueryParam :  function(_params,_body,options){return SeeyonApi.Rest.post('token',_params,_body,$.extend({},options))}
    };
}, this);
