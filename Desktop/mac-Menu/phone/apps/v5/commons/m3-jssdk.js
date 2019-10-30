/**
 * @description JSSDK for CMP
 * @Author Clyne
 * @createDate 2017-12-28
 */
;(function( factory, global ) {
    
    //有顺序不好
    global.SeeyonApi = global.SeeyonApi || {};
    
    if ( global.SeeyonApi === undefined ) {
        throw new Error('缺少API接口文件, 接口注册失败');
        return;
    }
    global.SeeyonApi.Rest = factory();
    global.$s = global.SeeyonApi;
    global.jssdktagloaded = 'jssdktagloaded';
})(function() {
    return {
        token : '',
        jsessionid : '',
        post : function(url,params,body,options){
            return SeeyonApi.Rest.service(url,params,body,cmp.extend({method:'POST'},options));
        },
        get : function(url,params,body,options){
            return SeeyonApi.Rest.service(url,params,body,cmp.extend({method:'GET'},options));
        }, 
        put : function(url,params,body,options){
            return SeeyonApi.Rest.service(url,params,body,cmp.extend({method:'PUT'},options));
        },       
        del : function(url,params,body,options){
            return SeeyonApi.Rest.service(url,params,body,cmp.extend({method:'DELETE'},options));
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
            var tk = cmp.token;        
            tk = tk!=undefined ? tk : ''  ;        
            var header = {
                    'Accept' : settings.Accept,
                    'Accept-Language' : settings.AcceptLanguage,
                    'Content-Type': 'application/json; charset=utf-8',
                    'token' : tk,
                    'option.n_a_s' : '1'
            }


            var dataBody;
            if(settings.method == 'GET'){
                if(body == ''){
                    dataBody = '';
                }else{
                    dataBody = JSON.stringify(body);
                }

            }else{
                dataBody = JSON.stringify(body);
            }
            cmp.ajax({
                type: settings.method , 
                data: dataBody,
                url : cmp.seeyonbasepath + '/rest/' + u ,
                async : true,
                headers: header,
                dataType : dataType,
                repeat: typeof(settings.repeat) !== 'undefined' ? settings.repeat : 'GET'===settings.method,
                success : function (r,textStatus,jqXHR){
                    if(dataType === 'xml'){
                        result = jqXHR.responseText;
                    }else{
                        result = r;
                    }
                    if(typeof(settings.success) !== 'undefined'){
                        settings.success(result,textStatus,jqXHR);
                    }
                },
                error : settings.error
            });    
            return result;
        },
        authentication : function(userName,password){
            this.token = this.getTokenByQueryParam('',{userName:userName,password:password}).id;
            return this.token;
        },
        setSession : function(sessionId){
            this.jsessionid = sessionId;
        },
        getTokenByQueryParam :  function(_params,_body,options){return SeeyonApi.Rest.post('token',_params,_body,$.extend({},options))}
    }
}, this);