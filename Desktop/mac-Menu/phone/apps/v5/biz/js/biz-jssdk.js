;(function( global ) {
    var api = {
      CapForm : {
        dealDeeRelation :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/dealDeeRelation',_params,_body,cmp.extend({},options))},

        showFormRelationRecord :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/showFormRelationRecord',_params,_body,cmp.extend({},options))},

        getDeeSubData :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/getDeeSubData',_params,_body,cmp.extend({},options))},

        dealMultiEnumRelation :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/dealMultiEnumRelation',_params,_body,cmp.extend({},options))},

        showFormData :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/showFormData',_params,_body,cmp.extend({},options))},

        dealProjectFieldRelation :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/dealProjectFieldRelation',_params,_body,cmp.extend({},options))},

        getDeeDataList :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/getDeeDataList',_params,_body,cmp.extend({},options))},

        decodeUnflowURLBarCode :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/decodeUnflowURL',_params,_body,cmp.extend({},options))},

        checkBizDashboardAuth :  function(bizDashboardId,_params,options){return SeeyonApi.Rest.get('capForm/checkBizDashboardAuth/'+bizDashboardId+'',_params,'',cmp.extend({},options))},

        findSourceInfo4Index :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/findSourceInfo4Index',_params,_body,cmp.extend({},options))},

        removeSessionMasterDataBean :  function(masterId,_params,options){return SeeyonApi.Rest.get('capForm/removeSessionMasterDataBean/'+masterId+'',_params,'',cmp.extend({},options))},

        dealFormRelation :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/dealFormRelation',_params,_body,cmp.extend({},options))},

        generateSubData :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/generateSubData',_params,_body,cmp.extend({},options))},

        dealOrgFieldRelation :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/dealOrgFieldRelation',_params,_body,cmp.extend({},options))},

        dealLbsFieldRelation :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/dealLbsFieldRelation',_params,_body,cmp.extend({},options))},

        calculate :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/calculate',_params,_body,cmp.extend({},options))},

        addOrDelDataSubBean :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/addOrDelDataSubBean',_params,_body,cmp.extend({},options))},

        getFormQueryTree :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/getFormQueryTree',_params,_body,cmp.extend({},options))},

        getDeeInfo :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/getDeeInfo',_params,_body,cmp.extend({},options))},

        generateBarCode :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/generateBarCode',_params,_body,cmp.extend({},options))},

        delAllRepeat :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/delAllRepeat',_params,_body,cmp.extend({},options))},

        saveOrUpdate :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/saveOrUpdate',_params,_body,cmp.extend({},options))},

        checkSessionMasterDataExists :  function(_params,options){return SeeyonApi.Rest.get('capForm/checkSessionMasterDataExists',_params,'',cmp.extend({},options))},

        getDeeFieldInitData :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/dee/field/initData',_params,_body,cmp.extend({},options))},

        searchDashboardData4Section :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/searchDashboardData4QuerySection',_params,_body,cmp.extend({},options))},


        relationFlowFormList :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/flowFormList',_params,_body,cmp.extend({},options))},

        searchForm :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/searchForm',_params,_body,cmp.extend({},options))},

        getOperationById :  function(_params,options){return SeeyonApi.Rest.get('capForm/getOperationById',_params,'',cmp.extend({},options))},

        mergeFormData :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/mergeFormData',_params,_body,cmp.extend({},options))},

        getFormQueryViewParams :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/getFormQueryViewParams',_params,_body,cmp.extend({},options))},

        form :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/form',_params,_body,cmp.extend({},options))},

        decodeBarCode :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/decodeBarCode',_params,_body,cmp.extend({},options))},

        selectDataBySummaryIdOrAffairId :  function(_params,options){return SeeyonApi.Rest.get('capForm/selectDataBySummaryIdOrAffairId',_params,'',cmp.extend({},options))},

        showMore :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/showMore',_params,_body,cmp.extend({},options))},

        loadTemplate :  function(_params,_body,options){return SeeyonApi.Rest.post('capForm/loadTemplate',_params,_body,cmp.extend({},options))}


      },
      Biz : {
        getBusinessMenu :  function(menuId,isMobile,_params,options){return SeeyonApi.Rest.get('biz/getBusinessMenu/'+menuId+'/'+isMobile+'',_params,'',cmp.extend({},options))},


        listBizColList :  function(_params,_body,options){return SeeyonApi.Rest.post('biz/listBizColList',_params,_body,cmp.extend({},options))},

        list :  function(_params,options){return SeeyonApi.Rest.get('biz/list',_params,'',cmp.extend({},options))}


      }

    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);