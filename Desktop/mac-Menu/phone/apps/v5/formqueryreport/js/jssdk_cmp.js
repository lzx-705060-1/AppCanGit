var SeeyonApi = {
    CapForm : {           
             getFormQueryTree :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/getFormQueryTree',_params,_body,cmp.extend({},options))},        
             searchForm :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/searchForm',_params,_body,cmp.extend({},options))},                       
             getFormQueryViewParams :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/getFormQueryViewParams',_params,_body,cmp.extend({},options))}, 
    },
	Projects : {
           
             findProjectList :  function(_params,_body,options){return SeeyonApi.Rest.post('projects/list',_params,_body,cmp.extend({},options))} 
        
        
    }
}
SeeyonApi.Rest ={
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
                'token' : tk 
        }
        
        var dataBody = JSON.stringify(body);

        cmp.ajax({
            type: settings.method , 
            data: dataBody,
            url : cmp.seeyonbasepath + '/rest/' + u ,
            async : true,
            headers: header,
            timeout :20000,
            dataType : dataType,
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
            error : function (err){
                if(err.code=="-1001"){
                    cmp.notification.alert(err.message, function () {
                        cmp.href.closePage();
                    }, " ", $.i18n.prop("string_Btn_OK"));
                    return;
                }
                var cmpHandled = cmp.errorHandler(err);
                if(cmpHandled){
                    //cmp处理了这个错误
                    $(document).on("tap", ".header_back", function (e) {
                        cmp.href.closePage();
                    });
                }else {
                    //settings.error(err) ;//走自己的处理错误的逻辑
                    if(typeof(settings.error) !== 'undefined'){
                        settings.error(err);
                    }
                }
            }
        });    
        return result;
    },
    authentication : function(userName,password){
        this.token = SeeyonApi.Token.getTokenByQueryParam('',{userName:userName,password:password}).id;
        return this.token;
    },
    setSession : function(sessionId){
        this.jsessionid = sessionId;
    }    
}
var $s = SeeyonApi;
 var jssdktagloaded = 'jssdktagloaded'; 