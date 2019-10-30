var SeeyonApi = {

    
    Projects : {
           
             findProjectList :  function(_params,_body,options){return SeeyonApi.Rest.post('projects/list',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Didicar : {
           
             getCloudUrl :  function(_params,options){return SeeyonApi.Rest.get('/didicar',_params,'',cmp.extend({},options))}, 
        
             getAuthByMemberId :  function(memberId,_params,options){return SeeyonApi.Rest.get('/didicar/auth/memberId/'+memberId+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Dee : {
             excFlow :  function(flowNo,_params,options){return SeeyonApi.Rest.get('dee/task/'+flowNo+'',_params,'',cmp.extend({},options))}, 
        
             excFlowParameters :  function(flowNo,_params,_body,options){return SeeyonApi.Rest.post('dee/task/'+flowNo+'',_params,_body,cmp.extend({},options))}, 
        
             valiateFormDeeDev :  function(_params,_body,options){return SeeyonApi.Rest.post('dee/valiateFormDeeDev',_params,_body,cmp.extend({},options))}, 
        
             updateUnFlowFormData :  function(_params,_body,options){return SeeyonApi.Rest.post('dee/unflow/update',_params,_body,cmp.extend({},options))}, 
        
           
             preExtHandler :  function(_params,_body,options){return SeeyonApi.Rest.post('dee/preExtHandler',_params,_body,cmp.extend({},options))}, 
        
             achieveTaskType :  function(_params,_body,options){return SeeyonApi.Rest.post('dee/achieveTaskType',_params,_body,cmp.extend({},options))}, 
        
             preDeeHandler :  function(_params,_body,options){return SeeyonApi.Rest.post('dee/preDeeHandler',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    JoinPortal : {
           
             getFormChart :  function(_params,options){return SeeyonApi.Rest.get('joinPortal/getFormChart',_params,'',cmp.extend({},options))}, 
        
             loadLoginSetting :  function(entityId,_params,_body,options){return SeeyonApi.Rest.post('joinPortal/loadLoginSetting/'+entityId+'',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    OrgPartTimeJob : {
             getConcurrentPostList :  function(_params,options){return SeeyonApi.Rest.get('orgPartTimeJob/list',_params,'',cmp.extend({},options))}, 
        
             getConcurrentInsideList :  function(_params,options){return SeeyonApi.Rest.get('orgPartTimeJob/insidelist',_params,'',cmp.extend({},options))}, 
        
           
             getMenuByLoginName :  function(memberId,_params,options){return SeeyonApi.Rest.get('orgPartTimeJob/partTimeJob/'+memberId+'',_params,'',cmp.extend({},options))}, 
        
             updateoncurrentPost :  function(_params,_body,options){return SeeyonApi.Rest.put('orgPartTimeJob',_params,_body,cmp.extend({},options))}, 
        
             getConcurrentForeignList :  function(_params,options){return SeeyonApi.Rest.get('orgPartTimeJob/foreignlist',_params,'',cmp.extend({},options))}, 
        
             addConcurrentPost :  function(_params,_body,options){return SeeyonApi.Rest.post('orgPartTimeJob',_params,_body,cmp.extend({},options))}, 
        
             getConcurrentPostById :  function(id,_params,options){return SeeyonApi.Rest.get('orgPartTimeJob/'+id+'',_params,'',cmp.extend({},options))}, 
        
             deleteConcurrentPostById :  function(id,_params,_body,options){return SeeyonApi.Rest.del('orgPartTimeJob/delete/'+id+'',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Ucorg : {
             getSubDeptInfo :  function(dId,_params,options){return SeeyonApi.Rest.get('ucorg/subDeptInfo/'+dId+'',_params,'',cmp.extend({},options))}, 
        
             getShortcutMenu :  function(codes,_params,options){return SeeyonApi.Rest.get('ucorg/getShortcutMenu/'+codes+'',_params,'',cmp.extend({},options))}, 
        
           
             subDepts :  function(pId,_params,options){return SeeyonApi.Rest.get('ucorg/subDepts/'+pId+'',_params,'',cmp.extend({},options))}, 
        
             getProductLine :  function(_params,options){return SeeyonApi.Rest.get('ucorg/getproductline',_params,'',cmp.extend({},options))}, 
        
             getUnitInfo :  function(id,_params,options){return SeeyonApi.Rest.get('ucorg/getunitinfo/'+id+'',_params,'',cmp.extend({},options))}, 
        
             getaddressBookSet :  function(updatetime,page,_params,options){return SeeyonApi.Rest.get('ucorg/'+updatetime+'/getaddrpriv/'+page+'',_params,'',cmp.extend({},options))}, 
        
             getSubDeptOfAccount :  function(accId,_params,options){return SeeyonApi.Rest.get('ucorg/firstDepts/'+accId+'',_params,'',cmp.extend({},options))}, 
        
             getAccountLogo :  function(id,_params,options){return SeeyonApi.Rest.get('ucorg/accountlogo/'+id+'',_params,'',cmp.extend({},options))}, 
        
             getLevel :  function(updatetime,page,_params,options){return SeeyonApi.Rest.get('ucorg/'+updatetime+'/getlevel/'+page+'',_params,'',cmp.extend({},options))}, 
        
             getPost :  function(updatetime,page,_params,options){return SeeyonApi.Rest.get('ucorg/'+updatetime+'/getpost/'+page+'',_params,'',cmp.extend({},options))}, 
        
             getAllSubDeptOfAccount :  function(accId,_params,options){return SeeyonApi.Rest.get('ucorg/allDepts/'+accId+'',_params,'',cmp.extend({},options))}, 
        
             getDeptMembers :  function(dId,_params,options){return SeeyonApi.Rest.get('ucorg/deptMembers/'+dId+'',_params,'',cmp.extend({},options))}, 
        
             getUnits :  function(updatetime,page,_params,options){return SeeyonApi.Rest.get('ucorg/'+updatetime+'/getunits/'+page+'',_params,'',cmp.extend({},options))}, 
        
             getUnitAuthority :  function(updatetime,page,_params,options){return SeeyonApi.Rest.get('ucorg/'+updatetime+'/getunitpriv/'+page+'',_params,'',cmp.extend({},options))}, 
        
             getMyself :  function(_params,options){return SeeyonApi.Rest.get('ucorg/getmyself',_params,'',cmp.extend({},options))}, 
        
             searchMemberOfGroupByName :  function(_params,_body,options){return SeeyonApi.Rest.post('ucorg/searchMemberOfGroupByName',_params,_body,cmp.extend({},options))}, 
        
             getPeopleCardInfo :  function(mId,_params,options){return SeeyonApi.Rest.get('ucorg/peopleCard/'+mId+'',_params,'',cmp.extend({},options))}, 
        
             searchMember :  function(_params,_body,options){return SeeyonApi.Rest.post('ucorg/searchMember',_params,_body,cmp.extend({},options))}, 
        
             accounts :  function(supId,_params,options){return SeeyonApi.Rest.get('ucorg/accounts/'+supId+'',_params,'',cmp.extend({},options))}, 
        
             getMembers :  function(updatetime,accountId,_params,options){return SeeyonApi.Rest.get('ucorg/'+updatetime+'/getmembers/'+accountId+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Hr : {
           
             wagestrip :  function(_params,_body,options){return SeeyonApi.Rest.post('hr/wagestrip',_params,_body,cmp.extend({},options))}, 
        
             findSalaryByDate :  function(_params,_body,options){return SeeyonApi.Rest.post('hr/salary',_params,_body,cmp.extend({},options))}, 
        
             createPwd :  function(_params,options){return SeeyonApi.Rest.get('hr/createPwd',_params,'',cmp.extend({},options))}, 
        
             isHasPwd :  function(_params,options){return SeeyonApi.Rest.get('hr/isHasPassword',_params,'',cmp.extend({},options))}, 
        
             checkPwd :  function(_params,_body,options){return SeeyonApi.Rest.post('hr/checkPassword',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    MobilePortal : {
           
             doProjection :  function(_params,_body,options){return SeeyonApi.Rest.post('mobilePortal/projection',_params,_body,cmp.extend({},options))}, 
        
             getSpaces :  function(portalId,_params,options){return SeeyonApi.Rest.get('mobilePortal/spaces/'+portalId+'',_params,'',cmp.extend({},options))}, 
        
             getSelectedSection :  function(_params,_body,options){return SeeyonApi.Rest.post('mobilePortal/getSelectedSection',_params,_body,cmp.extend({},options))}, 
        
             saveUserSpaceCustomize :  function(_params,_body,options){return SeeyonApi.Rest.post('mobilePortal/saveSpaceCustomize',_params,_body,cmp.extend({},options))}, 
        
             getSpace :  function(_params,_body,options){return SeeyonApi.Rest.post('mobilePortal/space',_params,_body,cmp.extend({},options))}, 
        
             getPortalId :  function(spaceId,_params,options){return SeeyonApi.Rest.get('mobilePortal/getPortalId/'+spaceId+'',_params,'',cmp.extend({},options))}, 
        
             saveCustomSpace :  function(_params,_body,options){return SeeyonApi.Rest.post('mobilePortal/saveCustomSpace',_params,_body,cmp.extend({},options))}, 
        
             getVPortalFrameInfo :  function(_params,options){return SeeyonApi.Rest.get('mobilePortal/getVPortalFrameInfo',_params,'',cmp.extend({},options))}, 
        
             getAllCustomSection :  function(_params,options){return SeeyonApi.Rest.get('mobilePortal/getAllCustomSection',_params,'',cmp.extend({},options))}, 
        
             getPortals :  function(spaceCategory,_params,options){return SeeyonApi.Rest.get('mobilePortal/portals/'+spaceCategory+'',_params,'',cmp.extend({},options))}, 
        
             getAlternativeSpace :  function(_params,_body,options){return SeeyonApi.Rest.post('mobilePortal/getAlternativeSpace',_params,_body,cmp.extend({},options))}, 
        
             getSlide :  function(_params,options){return SeeyonApi.Rest.get('mobilePortal/slide',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Ucrong : {
             getRongToken :  function(_params,options){return SeeyonApi.Rest.get('uc/rong/getToken',_params,'',cmp.extend({},options))}, 
        
             searchGroupMember :  function(_params,_body,options){return SeeyonApi.Rest.post('uc/rong/groups/searchGroupMember',_params,_body,cmp.extend({},options))}, 
        
             createGroup :  function(_params,_body,options){return SeeyonApi.Rest.post('uc/rong/groups/create',_params,_body,cmp.extend({},options))}, 
        
             dismissGroup :  function(_params,_body,options){return SeeyonApi.Rest.post('uc/rong/groups/dismiss',_params,_body,cmp.extend({},options))}, 
        
           
             getGroupMember :  function(groupId,_params,options){return SeeyonApi.Rest.get('uc/rong/groups/memberbygid/'+groupId+'',_params,'',cmp.extend({},options))}, 
        
             searchGroups :  function(_params,_body,options){return SeeyonApi.Rest.post('uc/rong/groups/searchgroup',_params,_body,cmp.extend({},options))}, 
        
             updateGroup :  function(_params,_body,options){return SeeyonApi.Rest.post('uc/rong/groups/update',_params,_body,cmp.extend({},options))}, 
        
             quitGroup :  function(_params,_body,options){return SeeyonApi.Rest.post('uc/rong/groups/quit',_params,_body,cmp.extend({},options))}, 
        
             joinGroup :  function(_params,_body,options){return SeeyonApi.Rest.post('uc/rong/groups/join',_params,_body,cmp.extend({},options))}, 
        
             joinGroupForQR :  function(_params,_body,options){return SeeyonApi.Rest.post('uc/rong/groups/joinforqr',_params,_body,cmp.extend({},options))}, 
        
             removeFile :  function(fileIds,_params,options){return SeeyonApi.Rest.get('uc/rong/groups/removeFile/'+fileIds+'',_params,'',cmp.extend({},options))}, 
        
             removeGroup :  function(_params,_body,options){return SeeyonApi.Rest.post('uc/rong/groups/remove',_params,_body,cmp.extend({},options))}, 
        
             getGroup :  function(groupId,_params,options){return SeeyonApi.Rest.get('uc/rong/groups/bygid/'+groupId+'',_params,'',cmp.extend({},options))}, 
        
             getMyGroups :  function(_params,options){return SeeyonApi.Rest.get('uc/rong/groups/mygroups',_params,'',cmp.extend({},options))}, 
        
             getGroups :  function(memberId,_params,options){return SeeyonApi.Rest.get('uc/rong/groups/bymid/'+memberId+'',_params,'',cmp.extend({},options))}, 
        
             checkFile :  function(fileIds,_params,options){return SeeyonApi.Rest.get('uc/rong/groups/checkFile/'+fileIds+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    M3message : {
             penetrateUrl :  function(app_id,messageId,_params,options){return SeeyonApi.Rest.get('m3/message/penetrateUrl/'+app_id+'/'+messageId+'',_params,'',cmp.extend({},options))}, 
        
             getMessageById :  function(msgId,_params,options){return SeeyonApi.Rest.get('m3/message/find/'+msgId+'',_params,'',cmp.extend({},options))}, 
        
             updateMessageByAppId :  function(appId,increment,_params,_body,options){return SeeyonApi.Rest.post('m3/message/update/'+appId+'/'+increment+'',_params,_body,cmp.extend({},options))}, 
        
             receive :  function(appId,_params,options){return SeeyonApi.Rest.get('m3/message/receive/'+appId+'',_params,'',cmp.extend({},options))}, 
        
             deleteMessageByAppId :  function(appId,increment,_params,_body,options){return SeeyonApi.Rest.post('m3/message/remove/'+appId+'/'+increment+'',_params,_body,cmp.extend({},options))}, 
        
             updateIntelligentStatus :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/message/intelligent/status',_params,_body,cmp.extend({},options))}, 
        
           
             history :  function(appId,_params,options){return SeeyonApi.Rest.get('m3/message/history/'+appId+'',_params,'',cmp.extend({},options))}, 
        
             canShowMember :  function(memberId,_params,options){return SeeyonApi.Rest.get('m3/message/canShowMember/'+memberId+'',_params,'',cmp.extend({},options))}, 
        
             notReadCount :  function(_params,options){return SeeyonApi.Rest.get('m3/message/notReadCount',_params,'',cmp.extend({},options))}, 
        
             classification :  function(_params,options){return SeeyonApi.Rest.get('m3/message/classification',_params,'',cmp.extend({},options))}, 
        
             testPnsService :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/message/pns/test',_params,_body,cmp.extend({},options))}, 
        
             saveUserMsgSetting :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/message/saveUserMsgSwitchSettings',_params,_body,cmp.extend({},options))}, 
        
             getUserMsgSetting :  function(_params,options){return SeeyonApi.Rest.get('m3/message/getUserMsgSwitchSettings',_params,'',cmp.extend({},options))}, 
        
             updateMessagesById :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/message/update/messages',_params,_body,cmp.extend({},options))}, 
        
             deleteUserMsgSetting :  function(_params,options){return SeeyonApi.Rest.get('m3/message/deleteUserMsgSwitchSettings',_params,'',cmp.extend({},options))}, 
        
             deleteMessagesById :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/message/remove/messages',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    M3individual : {
             exit :  function(device,_params,options){return SeeyonApi.Rest.get('m3/individual/exit/'+device+'',_params,'',cmp.extend({},options))}, 
        
             xiaozhiBind :  function(device,_params,options){return SeeyonApi.Rest.get('m3/individual/xiaozhi/bind/'+device+'',_params,'',cmp.extend({},options))}, 
        
             modifypwd :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/individual/modifypwd',_params,_body,cmp.extend({},options))}, 
        
           
             getOnlineRecord :  function(_params,options){return SeeyonApi.Rest.get('m3/individual/onlinerecord',_params,'',cmp.extend({},options))}, 
        
             updateOnlineState :  function(_params,options){return SeeyonApi.Rest.get('m3/individual/updateOnlineState',_params,'',cmp.extend({},options))}, 
        
             get :  function(_params,options){return SeeyonApi.Rest.get('m3/individual/pwdmodify/config',_params,'',cmp.extend({},options))}, 
        
             xiaozhiPermission :  function(device,_params,options){return SeeyonApi.Rest.get('m3/individual/xiaozhi/permission/'+device+'',_params,'',cmp.extend({},options))}, 
        
             modifyPortrait :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/individual/modifyportrait',_params,_body,cmp.extend({},options))}, 
        
             getOnlineDevice :  function(_params,options){return SeeyonApi.Rest.get('m3/individual/onlinedevice',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Biz : {
             getBusinessMenu :  function(menuId,isMobile,_params,options){return SeeyonApi.Rest.get('biz/getBusinessMenu/'+menuId+'/'+isMobile+'',_params,'',cmp.extend({},options))}, 
        
           
             listBizColList :  function(_params,_body,options){return SeeyonApi.Rest.post('biz/listBizColList',_params,_body,cmp.extend({},options))}, 
        
             list :  function(_params,options){return SeeyonApi.Rest.get('biz/list',_params,'',cmp.extend({},options))} 
        
        
    },
    
    WeixinPersonCenter : {
           
             unbindUser :  function(_params,options){return SeeyonApi.Rest.get('weixinPersonCenter/unbind',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Docs : {
             uploadDocFile :  function(_params,_body,options){return SeeyonApi.Rest.post('docs/uploadDocFile',_params,_body,cmp.extend({},options))}, 
        
           
             pigeonholeFolder :  function(_params,options){return SeeyonApi.Rest.get('docs/pigeonholeFolder',_params,'',cmp.extend({},options))}, 
        
             archiveLibraries :  function(_params,options){return SeeyonApi.Rest.get('docs/archive',_params,'',cmp.extend({},options))}, 
        
             archiveList :  function(_params,_body,options){return SeeyonApi.Rest.post('docs/search',_params,_body,cmp.extend({},options))}, 
        
             myFavorityList :  function(_params,options){return SeeyonApi.Rest.get('docs/myFavorityList',_params,'',cmp.extend({},options))}, 
        
             pigeonholeList :  function(_params,options){return SeeyonApi.Rest.get('docs/pigeonholeList',_params,'',cmp.extend({},options))}, 
        
             docs :  function(_params,options){return SeeyonApi.Rest.get('docs/files',_params,'',cmp.extend({},options))}, 
        
             hasAcl :  function(_params,options){return SeeyonApi.Rest.get('docs/hasAcl',_params,'',cmp.extend({},options))}, 
        
             getDosBySourceId :  function(sourceId,_params,options){return SeeyonApi.Rest.get('docs/getDosBySourceId/'+sourceId+'',_params,'',cmp.extend({},options))}, 
        
             doclibs :  function(_params,options){return SeeyonApi.Rest.get('docs/libs',_params,'',cmp.extend({},options))}, 
        
             getPath :  function(drId,isShareAndBorrowRoot,frType,isPigeonhole,_params,options){return SeeyonApi.Rest.get('docs/getPath/'+drId+'/'+isShareAndBorrowRoot+'/'+frType+'/'+isPigeonhole+'',_params,'',cmp.extend({},options))}, 
        
             archiveList4XZ :  function(_params,_body,options){return SeeyonApi.Rest.post('docs/archiveList4XZ',_params,_body,cmp.extend({},options))}, 
        
             createFoleder :  function(_params,_body,options){return SeeyonApi.Rest.post('docs/createFoleder',_params,_body,cmp.extend({},options))}, 
        
             getMyDoc4XZ :  function(_params,_body,options){return SeeyonApi.Rest.post('docs/myDoc',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    OrgDepartment : {
             addDepartments :  function(_params,_body,options){return SeeyonApi.Rest.post('orgDepartment/addDepartments',_params,_body,cmp.extend({},options))}, 
        
             enabledDepartmentByCode :  function(code,enabled,_params,_body,options){return SeeyonApi.Rest.put('orgDepartment/code/'+code+'/enabled/'+enabled+'',_params,_body,cmp.extend({},options))}, 
        
             move :  function(deptId,superId,_params,_body,options){return SeeyonApi.Rest.post('orgDepartment/move/'+deptId+'/'+superId+'',_params,_body,cmp.extend({},options))}, 
        
           
             deleteDepartmentById :  function(id,_params,_body,options){return SeeyonApi.Rest.del('orgDepartment/'+id+'',_params,_body,cmp.extend({},options))}, 
        
             updateDepartmentManagerInfo :  function(_params,_body,options){return SeeyonApi.Rest.put('orgDepartment/departmentmanagerinfo',_params,_body,cmp.extend({},options))}, 
        
             updateDepartment :  function(_params,_body,options){return SeeyonApi.Rest.put('orgDepartment',_params,_body,cmp.extend({},options))}, 
        
             deleteDepartmentByCode :  function(code,_params,_body,options){return SeeyonApi.Rest.del('orgDepartment/code/'+code+'',_params,_body,cmp.extend({},options))}, 
        
             updateDepartmentPost :  function(_params,_body,options){return SeeyonApi.Rest.put('orgDepartment/departmentpost',_params,_body,cmp.extend({},options))}, 
        
             addDepartment :  function(_params,_body,options){return SeeyonApi.Rest.post('orgDepartment',_params,_body,cmp.extend({},options))}, 
        
             updateDepartments :  function(_params,_body,options){return SeeyonApi.Rest.post('orgDepartment/updateDepartments',_params,_body,cmp.extend({},options))}, 
        
             getEntityByCode :  function(code,_params,options){return SeeyonApi.Rest.get('orgDepartment/code/'+code+'',_params,'',cmp.extend({},options))}, 
        
             get :  function(id,_params,options){return SeeyonApi.Rest.get('orgDepartment/'+id+'',_params,'',cmp.extend({},options))}, 
        
             getDepartmentManagerInfo :  function(departmentid,accountid,_params,options){return SeeyonApi.Rest.get('orgDepartment/departmentmanagerinfo/'+departmentid+'/'+accountid+'',_params,'',cmp.extend({},options))}, 
        
             enabledDepartment :  function(id,enabled,_params,_body,options){return SeeyonApi.Rest.put('orgDepartment/'+id+'/enabled/'+enabled+'',_params,_body,cmp.extend({},options))}, 
        
             getDepartmentPost :  function(departmentid,_params,options){return SeeyonApi.Rest.get('orgDepartment/departmentpost/'+departmentid+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Signet : {
           
             saveSignets :  function(_params,_body,options){return SeeyonApi.Rest.post('signet/saveSignets',_params,_body,cmp.extend({},options))}, 
        
             getIsignatureKeysn :  function(_params,options){return SeeyonApi.Rest.get('signet/getIsignatureKeysn',_params,'',cmp.extend({},options))}, 
        
             signetPic :  function(_params,_body,options){return SeeyonApi.Rest.post('signet/signetPic',_params,_body,cmp.extend({},options))}, 
        
             updateIsignatureDocumentId :  function(_params,_body,options){return SeeyonApi.Rest.post('signet/updateIsignatureDocumentId',_params,_body,cmp.extend({},options))}, 
        
             signets :  function(affairId,_params,options){return SeeyonApi.Rest.get('signet/signets/'+affairId+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Cap4form : {
             checkTakeBack :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/checkTakeBack',_params,_body,cmp.extend({},options))}, 
        
             transSendColl :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/transSendColl',_params,_body,cmp.extend({},options))}, 
        
             updateBatchRefreshData :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/updateBatchRefreshData',_params,_body,cmp.extend({},options))}, 
        
             importFormExcelDatas :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/importFormExcelDatas',_params,_body,cmp.extend({},options))}, 
        
             updateBatchOperationData :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/updateBatchOperationData',_params,_body,cmp.extend({},options))}, 
        
             takeBack :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/takeBack',_params,_body,cmp.extend({},options))}, 
        
             delFormData :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/delFormData',_params,_body,cmp.extend({},options))}, 
        
             validUnflowOperation :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/validUnflowOperation',_params,_body,cmp.extend({},options))}, 
        
             finishWorkItem :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/finishWorkItem',_params,_body,cmp.extend({},options))}, 
        
             save :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/saveOrUpdate',_params,_body,cmp.extend({},options))}, 
        
             subDataIsEmpty :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/subDataIsEmpty',_params,_body,cmp.extend({},options))}, 
        
             transFormExcelDatas :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/transFormExcelDatas',_params,_body,cmp.extend({},options))}, 
        
             getRelationThroughParams :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/getRelationThroughParams',_params,_body,cmp.extend({},options))}, 
        
             removeSessionFormCache :  function(contentDataId,_params,options){return SeeyonApi.Rest.get('cap4/form/removeSessionFormCache/'+contentDataId+'',_params,'',cmp.extend({},options))}, 
        
             exportUnflowExcel :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/exportUnflowExcel',_params,_body,cmp.extend({},options))}, 
        
             sendFromWait :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/sendFromWait',_params,_body,cmp.extend({},options))}, 
        
             calculate :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/calculate',_params,_body,cmp.extend({},options))}, 
        
             addOrDelDataSubBean :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/addOrDelDataSubBean',_params,_body,cmp.extend({},options))}, 
        
             transBatchDoTrigger :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/transBatchDoTrigger',_params,_body,cmp.extend({},options))}, 
        
             getExcelSheets :  function(fileId,_params,options){return SeeyonApi.Rest.get('cap4/form/getExcelSheets/'+fileId+'',_params,'',cmp.extend({},options))}, 
        
             transDoForward :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/transDoForward',_params,_body,cmp.extend({},options))}, 
        
             deleteAffair :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/deleteAffair',_params,_body,cmp.extend({},options))}, 
        
           
             getFormRelationDatas :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/getFormRelationDatas',_params,_body,cmp.extend({},options))}, 
        
             updateFormExcelDatas :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/updateFormExcelDatas',_params,_body,cmp.extend({},options))}, 
        
             checkForwardPermission :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/checkForwardPermission',_params,_body,cmp.extend({},options))}, 
        
             checkLock :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/checkLock',_params,_body,cmp.extend({},options))}, 
        
             getFormExcelDatas :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/getFormExcelDatas',_params,_body,cmp.extend({},options))}, 
        
             createOrEdit :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/createOrEdit',_params,_body,cmp.extend({},options))}, 
        
             dealSelectedRelationData :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/dealSelectedRelationData',_params,_body,cmp.extend({},options))}, 
        
             setLockOrUnlock :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/setLockOrUnlock',_params,_body,cmp.extend({},options))}, 
        
             addOrDelAttachment :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/addOrDelAttachment',_params,_body,cmp.extend({},options))}, 
        
             deleteBatchOperationData :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/deleteBatchOperationData',_params,_body,cmp.extend({},options))}, 
        
             checkTransRepeal :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/checkTransRepeal',_params,_body,cmp.extend({},options))}, 
        
             getCapBizConfigs :  function(_params,options){return SeeyonApi.Rest.get('cap4/form/getCapBizConfigs',_params,'',cmp.extend({},options))}, 
        
             transRepeal :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/transRepeal',_params,_body,cmp.extend({},options))}, 
        
             transStepBack :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/transStepBack',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Plan : {
             savePlanReply :  function(_params,_body,options){return SeeyonApi.Rest.post('plan/reply',_params,_body,cmp.extend({},options))}, 
        
             getPlanById :  function(planId,_params,options){return SeeyonApi.Rest.get('plan/'+planId+'',_params,'',cmp.extend({},options))}, 
        
           
             savePlanSummary :  function(_params,_body,options){return SeeyonApi.Rest.post('plan/summary',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Meeting : {
             findPendingMeetings :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/findPendingMeetings',_params,_body,cmp.extend({},options))}, 
        
             videoMeetingParams :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/videoMeetingParams',_params,_body,cmp.extend({},options))}, 
        
             getWaitsendMeetings :  function(personid,_params,_body,options){return SeeyonApi.Rest.post('meeting/waitsends/'+personid+'',_params,_body,cmp.extend({},options))}, 
        
             getMeetingRoomApp :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/getMeetingRoomApp',_params,_body,cmp.extend({},options))}, 
        
             execApp :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/execApp',_params,_body,cmp.extend({},options))}, 
        
             getPendingMeetingCount :  function(_params,options){return SeeyonApi.Rest.get('meeting/pendingCount',_params,'',cmp.extend({},options))}, 
        
             getMeetingComments :  function(meetingid,_params,_body,options){return SeeyonApi.Rest.post('meeting/comments/'+meetingid+'',_params,_body,cmp.extend({},options))}, 
        
             cancelMeetRoomApp :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/cancelMeetRoomApp',_params,_body,cmp.extend({},options))}, 
        
             meetingUserPeivMenu :  function(_params,options){return SeeyonApi.Rest.get('meeting/meeting/user/privMenu',_params,'',cmp.extend({},options))}, 
        
             checkMeetingRoomConflict :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/checkMeetingRoomConflict',_params,_body,cmp.extend({},options))}, 
        
             findSentMeetings :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/findSentMeetings',_params,_body,cmp.extend({},options))}, 
        
             showMeetingSummaryMembers :  function(_params,options){return SeeyonApi.Rest.get('meeting/showMeetingSummaryMembers',_params,'',cmp.extend({},options))}, 
        
             transInviteConferees :  function(_params,options){return SeeyonApi.Rest.get('meeting/transInviteConferees',_params,'',cmp.extend({},options))}, 
        
             getMeetingRoomAppDetail :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/getMeetingRoomAppDetail',_params,_body,cmp.extend({},options))}, 
        
             create :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/create',_params,_body,cmp.extend({},options))}, 
        
             reply :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/reply',_params,_body,cmp.extend({},options))}, 
        
             checkConfereesConflict :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/checkConfereesConflict',_params,_body,cmp.extend({},options))}, 
        
             finishAuditMeetingRoom :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/finishAuditMeetingRoom',_params,_body,cmp.extend({},options))}, 
        
             getMeetingRooms :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/getMeetingRooms',_params,_body,cmp.extend({},options))}, 
        
             getMeetingModifyElement :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/getMeetingModifyElement',_params,_body,cmp.extend({},options))}, 
        
             advanceMeeting :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/advanceMeeting',_params,_body,cmp.extend({},options))}, 
        
           
             cancelMeeting :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/cancelMeeting',_params,_body,cmp.extend({},options))}, 
        
             finishMeetingRoom :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/finishMeetingRoom',_params,_body,cmp.extend({},options))}, 
        
             getOrderDate :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/getOrderDate',_params,_body,cmp.extend({},options))}, 
        
             sendRemindersMeetingReceiptMessage :  function(_params,options){return SeeyonApi.Rest.get('meeting/detail/sendMessage',_params,'',cmp.extend({},options))}, 
        
             findWaitSentMeetings :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/findWaitSentMeetings',_params,_body,cmp.extend({},options))}, 
        
             getPendingMeetings :  function(_params,options){return SeeyonApi.Rest.get('meeting/pendings',_params,'',cmp.extend({},options))}, 
        
             getMeetingRoom :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/getMeetingRoom',_params,_body,cmp.extend({},options))}, 
        
             findDoneMeetings :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/findDoneMeetings',_params,_body,cmp.extend({},options))}, 
        
             getMeetingSummary :  function(recordId,_params,options){return SeeyonApi.Rest.get('meeting/summary/'+recordId+'',_params,'',cmp.extend({},options))}, 
        
             getMeetingRoomApps :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/getMeetingRoomApps',_params,_body,cmp.extend({},options))}, 
        
             showMeetingMembers :  function(_params,options){return SeeyonApi.Rest.get('meeting/meetingMembers',_params,'',cmp.extend({},options))}, 
        
             getMeeting :  function(id,_params,options){return SeeyonApi.Rest.get('meeting/'+id+'',_params,'',cmp.extend({},options))}, 
        
             getSendMeetings :  function(personid,_params,_body,options){return SeeyonApi.Rest.post('meeting/sends/'+personid+'',_params,_body,cmp.extend({},options))}, 
        
             getMeetingRoomAudits :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/getMeetingRoomAudits',_params,_body,cmp.extend({},options))}, 
        
             comment :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/comment',_params,_body,cmp.extend({},options))}, 
        
             detail :  function(_params,options){return SeeyonApi.Rest.get('meeting/detail',_params,'',cmp.extend({},options))}, 
        
             removeInvitePer :  function(_params,options){return SeeyonApi.Rest.get('meeting/removeInvitePer',_params,'',cmp.extend({},options))}, 
        
             getApplyMeemtingRooms :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/getApplyMeemtingRooms',_params,_body,cmp.extend({},options))}, 
        
             send :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/send',_params,_body,cmp.extend({},options))}, 
        
             removeMeeting :  function(_params,_body,options){return SeeyonApi.Rest.post('meeting/removeMeeting',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Flow : {
             getFlowData :  function(flowId,_params,options){return SeeyonApi.Rest.get('/flow/data/'+flowId+'',_params,'',cmp.extend({},options))}, 
        
           
             launchCollabrationByCIP :  function(templateCode,_params,_body,options){return SeeyonApi.Rest.post('/flow/launchcollabrationbyCIP/'+templateCode+'',_params,_body,cmp.extend({},options))}, 
        
             sendNotification :  function(flowToken,_params,_body,options){return SeeyonApi.Rest.post('/flow/notification/'+flowToken+'',_params,_body,cmp.extend({},options))}, 
        
             launchCollaboration :  function(templateCode,_params,_body,options){return SeeyonApi.Rest.post('/flow/'+templateCode+'',_params,_body,cmp.extend({},options))}, 
        
             getFinishFrom :  function(templateCode,startTime,endTime,_params,options){return SeeyonApi.Rest.get('/flow/FromFinish/'+templateCode+'/'+startTime+'/'+endTime+'',_params,'',cmp.extend({},options))}, 
        
             getFlowState :  function(flowId,_params,options){return SeeyonApi.Rest.get('/flow/state/'+flowId+'',_params,'',cmp.extend({},options))}, 
        
             getedocopinions :  function(summaryId,_params,options){return SeeyonApi.Rest.get('/flow/getedocopinions/'+summaryId+'',_params,'',cmp.extend({},options))}, 
        
             getFlowDoStaff :  function(summaryId,_params,options){return SeeyonApi.Rest.get('/flow/dostaff/'+summaryId+'',_params,'',cmp.extend({},options))}, 
        
             getFromTemplateXml :  function(templateCode,_params,options){return SeeyonApi.Rest.get('/flow/fromtemplatexml/'+templateCode+'',_params,'',cmp.extend({},options))}, 
        
             getcollopinions :  function(summaryId,_params,options){return SeeyonApi.Rest.get('/flow/getcollopinions/'+summaryId+'',_params,'',cmp.extend({},options))}, 
        
             getFromTemplate :  function(templateCode,_params,options){return SeeyonApi.Rest.get('/flow/FromTemplate/'+templateCode+'',_params,'',cmp.extend({},options))}, 
        
             batchlaunchCollaboration :  function(templateCode,_params,_body,options){return SeeyonApi.Rest.post('/flow/batchlaunch/'+templateCode+'',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Events : {
             getShareCaleventById :  function(_params,options){return SeeyonApi.Rest.get('events/share',_params,'',cmp.extend({},options))}, 
        
             getScheduleByUserId :  function(userId,dateStr,_params,options){return SeeyonApi.Rest.get('events/schedule/'+userId+'/'+dateStr+'',_params,'',cmp.extend({},options))}, 
        
             getPersonalCaleventById :  function(_params,options){return SeeyonApi.Rest.get('events',_params,'',cmp.extend({},options))}, 
        
           
             findOtherCalendarByPortal :  function(_params,_body,options){return SeeyonApi.Rest.post('events/portal/otherCalendar',_params,_body,cmp.extend({},options))}, 
        
             findArrangeAuths :  function(_params,options){return SeeyonApi.Rest.get('events/auths',_params,'',cmp.extend({},options))}, 
        
             findTimeArrange :  function(_params,_body,options){return SeeyonApi.Rest.post('events/arrangetimes',_params,_body,cmp.extend({},options))}, 
        
             findPlugins :  function(_params,options){return SeeyonApi.Rest.get('events/plugins',_params,'',cmp.extend({},options))}, 
        
             syncTimeArrange :  function(_params,_body,options){return SeeyonApi.Rest.post('events/sync/arrangetimes',_params,_body,cmp.extend({},options))}, 
        
             findMyCalendarByPortal :  function(_params,_body,options){return SeeyonApi.Rest.post('events/portal/myCalendar',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Tasks : {
             getPendingTaskNum :  function(userId,_params,options){return SeeyonApi.Rest.get('tasks/'+userId+'',_params,'',cmp.extend({},options))}, 
        
             getProjectTasks :  function(projectId,_params,options){return SeeyonApi.Rest.get('tasks/project/'+projectId+'',_params,'',cmp.extend({},options))}, 
        
           
             taskHastenMembers :  function(taskId,_params,options){return SeeyonApi.Rest.get('tasks/'+taskId+'/hastenMembers',_params,'',cmp.extend({},options))}, 
        
             countTasks :  function(_params,_body,options){return SeeyonApi.Rest.post('tasks/count',_params,_body,cmp.extend({},options))}, 
        
             taskComments :  function(taskId,_params,options){return SeeyonApi.Rest.get('tasks/'+taskId+'/comments',_params,'',cmp.extend({},options))}, 
        
             findTasks :  function(_params,_body,options){return SeeyonApi.Rest.post('tasks',_params,_body,cmp.extend({},options))}, 
        
             taskPraise :  function(commentId,_params,options){return SeeyonApi.Rest.get('tasks/'+commentId+'/praise',_params,'',cmp.extend({},options))}, 
        
             taskLogs :  function(taskId,_params,options){return SeeyonApi.Rest.get('tasks/'+taskId+'/tasklogs',_params,'',cmp.extend({},options))}, 
        
             taskFeedbacks :  function(taskId,_params,options){return SeeyonApi.Rest.get('tasks/'+taskId+'/feedbacks',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Xiaozhi : {
             getXiaozhiMessage :  function(_params,options){return SeeyonApi.Rest.get('xiaozhi/getXiaozhiMessage',_params,'',cmp.extend({},options))}, 
        
           
             sendLeave :  function(_params,_body,options){return SeeyonApi.Rest.post('xiaozhi/send/leave',_params,_body,cmp.extend({},options))}, 
        
             caclDays :  function(_params,options){return SeeyonApi.Rest.get('xiaozhi/cacldays',_params,'',cmp.extend({},options))} 
        
        
    },
    
    OrgMembers : {
             getMemberByName :  function(name,_params,options){return SeeyonApi.Rest.get('orgMembers/name/'+name+'',_params,'',cmp.extend({},options))}, 
        
             getAllMembersByDepartment :  function(departmentId,_params,options){return SeeyonApi.Rest.get('orgMembers/department/count/'+departmentId+'',_params,'',cmp.extend({},options))}, 
        
             addAndUpdateMember :  function(_params,_body,options){return SeeyonApi.Rest.put('orgMembers',_params,_body,cmp.extend({},options))}, 
        
             getEntitiesCount :  function(accountId,_params,options){return SeeyonApi.Rest.get('orgMembers/count/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             getMembersByPost :  function(postId,_params,options){return SeeyonApi.Rest.get('orgMembers/post/'+postId+'',_params,'',cmp.extend({},options))}, 
        
           
             getMembersByDepartment :  function(departmentId,_params,options){return SeeyonApi.Rest.get('orgMembers/department/'+departmentId+'',_params,'',cmp.extend({},options))}, 
        
             getAllEntities :  function(accountId,_params,options){return SeeyonApi.Rest.get('orgMembers/all/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             getMemberCardByName :  function(name,_params,options){return SeeyonApi.Rest.get('orgMembers/contacts/'+name+'',_params,'',cmp.extend({},options))}, 
        
             getAllEntitiesCount :  function(accountId,_params,options){return SeeyonApi.Rest.get('orgMembers/all/count/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             getEntities :  function(accountId,_params,options){return SeeyonApi.Rest.get('orgMembers/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             deleteMember :  function(_params,_body,options){return SeeyonApi.Rest.put('orgMembers/batchdelete',_params,_body,cmp.extend({},options))}, 
        
             getMemberByCode :  function(code,_params,options){return SeeyonApi.Rest.get('orgMembers/code/'+code+'',_params,'',cmp.extend({},options))}, 
        
             getMembersByLevel :  function(levelId,_params,options){return SeeyonApi.Rest.get('orgMembers/level/'+levelId+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    OrgMember : {
             addMember :  function(_params,_body,options){return SeeyonApi.Rest.post('orgMember',_params,_body,cmp.extend({},options))}, 
        
             updateMember :  function(_params,_body,options){return SeeyonApi.Rest.put('orgMember',_params,_body,cmp.extend({},options))}, 
        
             validateRequiredEncodedPassword :  function(_params,options){return SeeyonApi.Rest.get('orgMember/effective/password/encoded',_params,'',cmp.extend({},options))}, 
        
             getGroupAvatarForGet :  function(_params,options){return SeeyonApi.Rest.get('orgMember/groupavatar',_params,'',cmp.extend({'Accept' : 'image/*'},options))}, 
        
           
             removeMembers :  function(_params,_body,options){return SeeyonApi.Rest.post('orgMember/removeMembers',_params,_body,cmp.extend({},options))}, 
        
             getAvatar :  function(memberId,_params,options){return SeeyonApi.Rest.get('orgMember/avatar/'+memberId+'',_params,'',cmp.extend({'Accept' : 'image/*'},options))}, 
        
             getMemberByTel :  function(telephoneNumber,_params,options){return SeeyonApi.Rest.get('orgMember/telephone/'+telephoneNumber+'',_params,'',cmp.extend({},options))}, 
        
             memberPasswordByCode :  function(code,password,_params,_body,options){return SeeyonApi.Rest.put('orgMember/code/'+code+'/password/'+password+'',_params,_body,cmp.extend({},options))}, 
        
             enabledMember :  function(id,enabled,_params,_body,options){return SeeyonApi.Rest.put('orgMember/'+id+'/enabled/'+enabled+'',_params,_body,cmp.extend({},options))}, 
        
             changePassword :  function(id,password,_params,_body,options){return SeeyonApi.Rest.put('orgMember/'+id+'/password/'+password+'',_params,_body,cmp.extend({},options))}, 
        
             validateUser :  function(loginName,_params,options){return SeeyonApi.Rest.get('orgMember/effective/loginName/'+loginName+'',_params,'',cmp.extend({},options))}, 
        
             deleteMemberByLoginName :  function(_params,_body,options){return SeeyonApi.Rest.del('orgMember',_params,_body,cmp.extend({},options))}, 
        
             updateMembers :  function(_params,_body,options){return SeeyonApi.Rest.post('orgMember/updateMembers',_params,_body,cmp.extend({},options))}, 
        
             getEntityByCode :  function(code,_params,options){return SeeyonApi.Rest.get('orgMember/code/'+code+'',_params,'',cmp.extend({},options))}, 
        
             addMembers :  function(_params,_body,options){return SeeyonApi.Rest.post('orgMember/addMembers',_params,_body,cmp.extend({},options))}, 
        
             leave :  function(memberId,agentMemberId,_params,_body,options){return SeeyonApi.Rest.post('orgMember/leave/'+memberId+'/'+agentMemberId+'',_params,_body,cmp.extend({},options))}, 
        
             get :  function(id,_params,options){return SeeyonApi.Rest.get('orgMember/'+id+'',_params,'',cmp.extend({},options))}, 
        
             getGroupAvatar :  function(_params,_body,options){return SeeyonApi.Rest.post('orgMember/groupavatar',_params,_body,cmp.extend({},options))}, 
        
             deleteMember :  function(id,_params,_body,options){return SeeyonApi.Rest.del('orgMember/'+id+'',_params,_body,cmp.extend({},options))}, 
        
             deleteMemberByCode :  function(code,_params,_body,options){return SeeyonApi.Rest.del('orgMember/code/'+code+'',_params,_body,cmp.extend({},options))}, 
        
             getMemberByLoginName :  function(_params,options){return SeeyonApi.Rest.get('orgMember',_params,'',cmp.extend({},options))}, 
        
             enabledMemberByCode :  function(code,enabled,_params,_body,options){return SeeyonApi.Rest.put('orgMember/code/'+code+'/enabled/'+enabled+'',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Index : {
             clearSearchHis :  function(memberId,_params,options){return SeeyonApi.Rest.get('index/clearSearchHis/'+memberId+'',_params,'',cmp.extend({},options))}, 
        
             search :  function(pageSize,pageNo,_params,_body,options){return SeeyonApi.Rest.post('index/search/'+pageSize+'/'+pageNo+'',_params,_body,cmp.extend({},options))}, 
        
           
             searchHis :  function(_params,options){return SeeyonApi.Rest.get('index/searchHis',_params,'',cmp.extend({},options))}, 
        
             indexHome :  function(_params,_body,options){return SeeyonApi.Rest.post('index',_params,_body,cmp.extend({},options))}, 
        
             hotKeys :  function(_params,options){return SeeyonApi.Rest.get('index/hotKeys',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Cmpsubdepartments4M3 : {
           
             getCmpSubEntities :  function(parentId,_params,options){return SeeyonApi.Rest.get('cmpsubdepartments4M3/subVjoinEntities/'+parentId+'',_params,'',cmp.extend({},options))}, 
        
             getCmpSubEntitieswithoutlevelscope4Vjoin :  function(_params,options){return SeeyonApi.Rest.get('cmpsubdepartments4M3/subVjoinEntitieswithoutlevelscope',_params,'',cmp.extend({},options))}, 
        
             getCmpVjoinAccount :  function(_params,options){return SeeyonApi.Rest.get('cmpsubdepartments4M3/vjoinAccount',_params,'',cmp.extend({},options))}, 
        
             getCmpSubEntitieswithoutlevelscope :  function(_params,options){return SeeyonApi.Rest.get('cmpsubdepartments4M3/subentitieswithoutlevelscope',_params,'',cmp.extend({},options))}, 
        
             getCmpSubDepartments :  function(parentId,_params,options){return SeeyonApi.Rest.get('cmpsubdepartments4M3/subdepartments/'+parentId+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    M3common : {
           
             avatarConfig :  function(_params,options){return SeeyonApi.Rest.get('m3/common/avatarConfig',_params,'',cmp.extend({},options))}, 
        
             hasPendingAndMessage :  function(_params,options){return SeeyonApi.Rest.get('m3/common/hasPendingAndMessage',_params,'',cmp.extend({},options))}, 
        
             checkPasswordStrong :  function(_params,options){return SeeyonApi.Rest.get('m3/common/checkPasswordStrong',_params,'',cmp.extend({},options))}, 
        
             getConfigInfo :  function(_params,options){return SeeyonApi.Rest.get('m3/common/getConfigInfo',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Enum : {
           
             exportEnumData :  function(isAllPublic,_params,options){return SeeyonApi.Rest.get('/enum/export/'+isAllPublic+'',_params,'',cmp.extend({},options))}, 
        
             importEnumData :  function(enumId,_params,_body,options){return SeeyonApi.Rest.post('/enum/import/'+enumId+'',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Bbs : {
             getBbsDetail :  function(bbsId,from,_params,options){return SeeyonApi.Rest.get('bbs/detail/'+bbsId+'/'+from+'',_params,'',cmp.extend({},options))}, 
        
             removeBbs :  function(bbsId,_params,options){return SeeyonApi.Rest.get('bbs/remove/'+bbsId+'',_params,'',cmp.extend({},options))}, 
        
             bbsReplyPraise :  function(replyId,_params,_body,options){return SeeyonApi.Rest.post('bbs/reply/praise/'+replyId+'',_params,_body,cmp.extend({},options))}, 
        
             getBbsTypeByBoardId :  function(boardId,loginName,_params,options){return SeeyonApi.Rest.get('bbs/bbsType/'+boardId+'/'+loginName+'',_params,'',cmp.extend({},options))}, 
        
             removeReply :  function(_params,_body,options){return SeeyonApi.Rest.post('bbs/reply/remove',_params,_body,cmp.extend({},options))}, 
        
           
             bbsPraise :  function(bbsId,_params,_body,options){return SeeyonApi.Rest.post('bbs/'+bbsId+'/praise',_params,_body,cmp.extend({},options))}, 
        
             bbsNewCreate :  function(_params,options){return SeeyonApi.Rest.get('bbs/create',_params,'',cmp.extend({},options))}, 
        
             bbsSave :  function(_params,_body,options){return SeeyonApi.Rest.post('bbs/save',_params,_body,cmp.extend({},options))}, 
        
             addReply :  function(_params,_body,options){return SeeyonApi.Rest.post('bbs/reply/add',_params,_body,cmp.extend({},options))}, 
        
             bbsCreate :  function(_params,_body,options){return SeeyonApi.Rest.post('bbs',_params,_body,cmp.extend({},options))}, 
        
             getBbsByUnitId :  function(unitId,loginName,_params,options){return SeeyonApi.Rest.get('bbs/unit/'+unitId+'/'+loginName+'',_params,'',cmp.extend({},options))}, 
        
             getGroupBbsType :  function(_params,options){return SeeyonApi.Rest.get('bbs/bbsType/group',_params,'',cmp.extend({},options))}, 
        
             bbsReplys :  function(bbsId,_params,options){return SeeyonApi.Rest.get('bbs/'+bbsId+'/replys',_params,'',cmp.extend({},options))}, 
        
             getBbsTypeByUnitId :  function(unitId,_params,options){return SeeyonApi.Rest.get('bbs/bbsType/unit/'+unitId+'',_params,'',cmp.extend({},options))}, 
        
             getBbsThreeList :  function(_params,_body,options){return SeeyonApi.Rest.post('bbs/getBbsThreeList',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Addressbook : {
             getSubDeptInfo :  function(dId,_params,options){return SeeyonApi.Rest.get('addressbook/subDeptInfo/'+dId+'',_params,'',cmp.extend({},options))}, 
        
           
             getTeamMember :  function(tId,_params,options){return SeeyonApi.Rest.get('addressbook/teamMembers/'+tId+'',_params,'',cmp.extend({},options))}, 
        
             getAvatarImage :  function(_params,_body,options){return SeeyonApi.Rest.post('addressbook/avatarImages',_params,_body,cmp.extend({},options))}, 
        
             subDepts :  function(pId,_params,options){return SeeyonApi.Rest.get('addressbook/subDepts/'+pId+'',_params,'',cmp.extend({},options))}, 
        
             canShowPeopleCard :  function(memberId,_params,options){return SeeyonApi.Rest.get('addressbook/canShowPeopleCard/'+memberId+'',_params,'',cmp.extend({},options))}, 
        
             getDeptPath :  function(dId,_params,options){return SeeyonApi.Rest.get('addressbook/depPath/'+dId+'',_params,'',cmp.extend({},options))}, 
        
             getRecentData :  function(mId,_params,options){return SeeyonApi.Rest.get('addressbook/recentMember/'+mId+'',_params,'',cmp.extend({},options))}, 
        
             getSubDeptOfAccount :  function(accId,_params,options){return SeeyonApi.Rest.get('addressbook/firstDepts/'+accId+'',_params,'',cmp.extend({},options))}, 
        
             childAccounts :  function(supId,_params,options){return SeeyonApi.Rest.get('addressbook/childAccounts/'+supId+'',_params,'',cmp.extend({},options))}, 
        
             currentUser :  function(_params,options){return SeeyonApi.Rest.get('addressbook/currentUser',_params,'',cmp.extend({},options))}, 
        
             getAccountInfo :  function(accId,_params,options){return SeeyonApi.Rest.get('addressbook/accountInfo/'+accId+'',_params,'',cmp.extend({},options))}, 
        
             accountMembers :  function(accountId,lastM,pageSize,pageNo,_params,options){return SeeyonApi.Rest.get('addressbook/accountMembers/'+accountId+'/'+lastM+'/'+pageSize+'/'+pageNo+'',_params,'',cmp.extend({},options))}, 
        
             getAllSubDeptOfAccount :  function(accId,_params,options){return SeeyonApi.Rest.get('addressbook/allDepts/'+accId+'',_params,'',cmp.extend({},options))}, 
        
             getTeam :  function(type,_params,options){return SeeyonApi.Rest.get('addressbook/team/'+type+'',_params,'',cmp.extend({},options))}, 
        
             currentDepartment :  function(_params,options){return SeeyonApi.Rest.get('addressbook/currentDepartment',_params,'',cmp.extend({},options))}, 
        
             members :  function(accountId,lastM,pageSize,pageNo,letter,_params,options){return SeeyonApi.Rest.get('addressbook/members/'+accountId+'/'+lastM+'/'+pageSize+'/'+pageNo+'/'+letter+'',_params,'',cmp.extend({},options))}, 
        
             getDeptMembers :  function(dId,_params,options){return SeeyonApi.Rest.get('addressbook/deptMembers/'+dId+'',_params,'',cmp.extend({},options))}, 
        
             searchMemberOfGroupByName :  function(_params,_body,options){return SeeyonApi.Rest.post('addressbook/searchMemberOfGroupByName',_params,_body,cmp.extend({},options))}, 
        
             getPeopleCardInfo :  function(mId,_params,options){return SeeyonApi.Rest.get('addressbook/peopleCard/'+mId+'',_params,'',cmp.extend({},options))}, 
        
             searchMember :  function(_params,_body,options){return SeeyonApi.Rest.post('addressbook/searchMember',_params,_body,cmp.extend({},options))}, 
        
             accounts :  function(supId,_params,options){return SeeyonApi.Rest.get('addressbook/accounts/'+supId+'',_params,'',cmp.extend({},options))}, 
        
             currentAccount :  function(_params,options){return SeeyonApi.Rest.get('addressbook/currentAccount',_params,'',cmp.extend({},options))}, 
        
             peopleRelateManager :  function(memberId,_params,options){return SeeyonApi.Rest.get('addressbook/peopleRelate/'+memberId+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    OrgAccounts : {
             getAllAccounts :  function(_params,options){return SeeyonApi.Rest.get('orgAccounts',_params,'',cmp.extend({},options))}, 
        
             getParentAccount :  function(id,_params,options){return SeeyonApi.Rest.get('orgAccounts/parent/'+id+'',_params,'',cmp.extend({},options))}, 
        
           
             getChildAccount :  function(id,_params,options){return SeeyonApi.Rest.get('orgAccounts/'+id+'',_params,'',cmp.extend({},options))}, 
        
             getAllAccountsNoPage :  function(id,_params,options){return SeeyonApi.Rest.get('orgAccounts/all/'+id+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    JoinOrgRole : {
             addUnitRole :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgRole/addUnitRole',_params,_body,cmp.extend({},options))}, 
        
             updateRoleResource :  function(accountId,_params,_body,options){return SeeyonApi.Rest.post('joinOrgRole/updateRoleResource/'+accountId+'',_params,_body,cmp.extend({},options))}, 
        
             getRoleResource :  function(accountId,_params,options){return SeeyonApi.Rest.get('joinOrgRole/roleResource/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
           
             getAccountList :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgRole/accountRoles',_params,_body,cmp.extend({},options))}, 
        
             addAccountRole :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgRole/addAccountRole',_params,_body,cmp.extend({},options))}, 
        
             updateUnitRole :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgRole/updateUnitRole',_params,_body,cmp.extend({},options))}, 
        
             updateAccountRole :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgRole/updateAccountRole',_params,_body,cmp.extend({},options))}, 
        
             getRoleInfo :  function(roleid,_params,options){return SeeyonApi.Rest.get('joinOrgRole/info/'+roleid+'',_params,'',cmp.extend({},options))}, 
        
             getUnitList :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgRole/unitRoles',_params,_body,cmp.extend({},options))}, 
        
             deleteRole :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgRole/remove',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Plans : {
           
             getPlanList :  function(userId,planType,userType,_params,options){return SeeyonApi.Rest.get('plans/'+userId+'/'+planType+'/'+userType+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    M3search : {
             search :  function(pageNo,pageSize,_params,_body,options){return SeeyonApi.Rest.post('m3/search/'+pageNo+'/'+pageSize+'',_params,_body,cmp.extend({},options))}, 
        
           
             getHotAndHistory :  function(_params,options){return SeeyonApi.Rest.get('m3/search/hotAndHis',_params,'',cmp.extend({},options))}, 
        
             removeAllHistory :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/search/clearHistory',_params,_body,cmp.extend({},options))}, 
        
             classification :  function(_params,options){return SeeyonApi.Rest.get('m3/search/classification',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Doc : {
             hasOpenPermissionByArgs :  function(_params,options){return SeeyonApi.Rest.get('doc/hasOpenPermission',_params,'',cmp.extend({},options))}, 
        
             exitsDocLib :  function(_params,options){return SeeyonApi.Rest.get('doc/exitsDocLib',_params,'',cmp.extend({},options))}, 
        
             removeReply :  function(replyId,_params,options){return SeeyonApi.Rest.get('doc/replay/remove/'+replyId+'',_params,'',cmp.extend({},options))}, 
        
           
             replys :  function(_params,_body,options){return SeeyonApi.Rest.post('doc/replys',_params,_body,cmp.extend({},options))}, 
        
             docView :  function(_params,options){return SeeyonApi.Rest.get('doc/docView',_params,'',cmp.extend({},options))}, 
        
             insertOpLog4Doc :  function(_params,options){return SeeyonApi.Rest.get('doc/insertOpLog4Doc',_params,'',cmp.extend({},options))}, 
        
             getCtpFileById :  function(ctpFileId,_params,options){return SeeyonApi.Rest.get('doc/getctpfile/'+ctpFileId+'',_params,'',cmp.extend({},options))}, 
        
             getMySpace :  function(_params,options){return SeeyonApi.Rest.get('doc/getMySpace',_params,'',cmp.extend({},options))}, 
        
             getDocResource :  function(docResourceId,_params,options){return SeeyonApi.Rest.get('doc/'+docResourceId+'',_params,'',cmp.extend({},options))}, 
        
             cancelFavorite :  function(_params,options){return SeeyonApi.Rest.get('doc/favorite/cancel',_params,'',cmp.extend({},options))}, 
        
             getContentAndAtt :  function(_params,options){return SeeyonApi.Rest.get('doc/getContentAndAtt',_params,'',cmp.extend({},options))}, 
        
             saveReply :  function(_params,_body,options){return SeeyonApi.Rest.post('doc/replay/save',_params,_body,cmp.extend({},options))}, 
        
             canOppen :  function(_params,options){return SeeyonApi.Rest.get('doc/canOppen',_params,'',cmp.extend({},options))}, 
        
             favorite :  function(_params,options){return SeeyonApi.Rest.get('doc/favorite',_params,'',cmp.extend({},options))}, 
        
             isExist :  function(_params,options){return SeeyonApi.Rest.get('doc/isExist',_params,'',cmp.extend({},options))} 
        
        
    },
    
    M3pending : {
             getPendingClassification :  function(_params,options){return SeeyonApi.Rest.get('m3/pending/classificationAll',_params,'',cmp.extend({},options))}, 
        
             searchThirdByCondition :  function(pageNo,pageSize,_params,_body,options){return SeeyonApi.Rest.post('m3/pending/searchThirdByCondition/'+pageNo+'/'+pageSize+'',_params,_body,cmp.extend({},options))}, 
        
           
             getThirdPending :  function(_params,options){return SeeyonApi.Rest.get('m3/pending/thirdPending',_params,'',cmp.extend({},options))}, 
        
             searchPending :  function(searchType,pageNo,pageSize,_params,_body,options){return SeeyonApi.Rest.post('m3/pending/search/'+searchType+'/'+pageNo+'/'+pageSize+'',_params,_body,cmp.extend({},options))}, 
        
             searchThirdPending :  function(pageNo,pageSize,_params,_body,options){return SeeyonApi.Rest.post('m3/pending/searchThird/'+pageNo+'/'+pageSize+'',_params,_body,cmp.extend({},options))}, 
        
             hasPending :  function(_params,options){return SeeyonApi.Rest.get('m3/pending/hasPending',_params,'',cmp.extend({},options))}, 
        
             getLatestPending :  function(_params,options){return SeeyonApi.Rest.get('m3/pending/latest',_params,'',cmp.extend({},options))}, 
        
             getPending :  function(_params,options){return SeeyonApi.Rest.get('m3/pending',_params,'',cmp.extend({},options))}, 
        
             portletPending :  function(pageNo,pageSize,_params,_body,options){return SeeyonApi.Rest.post('m3/pending/portlet/'+pageNo+'/'+pageSize+'',_params,_body,cmp.extend({},options))}, 
        
             getClassification :  function(_params,options){return SeeyonApi.Rest.get('m3/pending/classification',_params,'',cmp.extend({},options))} 
        
        
    },
    
    M3usersettings : {
           
             save :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/user/settings/save',_params,_body,cmp.extend({},options))}, 
        
             getUserSettings :  function(memberId,_params,options){return SeeyonApi.Rest.get('m3/user/settings/get/'+memberId+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Template : {
           
             rencentTemplates :  function(_params,options){return SeeyonApi.Rest.get('template/rencentTemplates',_params,'',cmp.extend({},options))}, 
        
             templates :  function(loginName,moduleType,_params,options){return SeeyonApi.Rest.get('template/templateidlist/'+loginName+'/'+moduleType+'',_params,'',cmp.extend({},options))}, 
        
             searchTemplates :  function(_params,_body,options){return SeeyonApi.Rest.post('template/searchTemplates',_params,_body,cmp.extend({},options))}, 
        
             formTemplates :  function(_params,options){return SeeyonApi.Rest.get('template/formTemplates',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Vreport : {
           
             fileReport :  function(id,_params,options){return SeeyonApi.Rest.get('vreport/fileReport/'+id+'',_params,'',cmp.extend({},options))}, 
        
             saveReportRecordRead :  function(id,_params,options){return SeeyonApi.Rest.get('vreport/saveReportRecordRead/'+id+'',_params,'',cmp.extend({},options))}, 
        
             favour :  function(_params,_body,options){return SeeyonApi.Rest.post('vreport/favour',_params,_body,cmp.extend({},options))}, 
        
             getMyFavour :  function(_params,options){return SeeyonApi.Rest.get('vreport/myFavour',_params,'',cmp.extend({},options))}, 
        
             getCap4ReportTreeAndData :  function(_params,options){return SeeyonApi.Rest.get('vreport/cap4TreeAndData',_params,'',cmp.extend({},options))}, 
        
             getReportTreeAndData :  function(_params,options){return SeeyonApi.Rest.get('vreport/treeAndData',_params,'',cmp.extend({},options))}, 
        
             getReportViewtip :  function(_params,options){return SeeyonApi.Rest.get('vreport/reportViewtip',_params,'',cmp.extend({},options))}, 
        
             hideReportViewtip :  function(_params,options){return SeeyonApi.Rest.get('vreport/hideReportViewtip',_params,'',cmp.extend({},options))} 
        
        
    },
    
    UnflowForm : {
             checkDelete :  function(_params,_body,options){return SeeyonApi.Rest.post('unflowForm/checkDelete',_params,_body,cmp.extend({},options))}, 
        
             getUnFlowDataList :  function(_params,_body,options){return SeeyonApi.Rest.post('unflowForm/getUnFlowDataList',_params,_body,cmp.extend({},options))}, 
        
           
             viewUnflowFormData :  function(_params,_body,options){return SeeyonApi.Rest.post('unflowForm/viewUnflowFormData',_params,_body,cmp.extend({},options))}, 
        
             newUnflowFormData :  function(_params,_body,options){return SeeyonApi.Rest.post('unflowForm/newUnflowFormData',_params,_body,cmp.extend({},options))}, 
        
             lock :  function(_params,_body,options){return SeeyonApi.Rest.post('unflowForm/lock',_params,_body,cmp.extend({},options))}, 
        
             doHideRefresh :  function(_params,_body,options){return SeeyonApi.Rest.post('unflowForm/doHideRefresh',_params,_body,cmp.extend({},options))}, 
        
             checkLock :  function(_params,_body,options){return SeeyonApi.Rest.post('unflowForm/checkLock',_params,_body,cmp.extend({},options))}, 
        
             checkDataLockForEdit :  function(_params,_body,options){return SeeyonApi.Rest.post('unflowForm/checkDataLockForEdit',_params,_body,cmp.extend({},options))}, 
        
             unLock :  function(_params,_body,options){return SeeyonApi.Rest.post('unflowForm/unLock',_params,_body,cmp.extend({},options))}, 
        
             getFormMasterDataListByFormId :  function(_params,_body,options){return SeeyonApi.Rest.post('unflowForm/getFormMasterDataListByFormId',_params,_body,cmp.extend({},options))}, 
        
             deleteFormData :  function(_params,_body,options){return SeeyonApi.Rest.post('unflowForm/deleteFormData',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    ThirdpartyUserMapper : {
           
             receiveThirdpartyUserBinding :  function(_params,_body,options){return SeeyonApi.Rest.post('thirdpartyUserMapper/binding',_params,_body,cmp.extend({},options))}, 
        
             receiveUserSingleBinding :  function(_params,_body,options){return SeeyonApi.Rest.post('thirdpartyUserMapper/binding/singleUser',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Role : {
             updateDepartmentRoleMember :  function(_params,_body,options){return SeeyonApi.Rest.post('role/updateDepartmentRoleMember',_params,_body,cmp.extend({},options))}, 
        
             addDepartMentRole :  function(_params,_body,options){return SeeyonApi.Rest.post('role/addDepartMentRole',_params,_body,cmp.extend({},options))}, 
        
           
             departmentRoleMembers :  function(departmentId,roleId,_params,options){return SeeyonApi.Rest.get('role/departmentRoleMembers/'+departmentId+'/'+roleId+'',_params,'',cmp.extend({},options))}, 
        
             departmentRole :  function(departmentId,_params,options){return SeeyonApi.Rest.get('role/departmentRole/'+departmentId+'',_params,'',cmp.extend({},options))}, 
        
             getRoleList :  function(accountid,_params,options){return SeeyonApi.Rest.get('role/accountrole/'+accountid+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    JoinOrgMember : {
             addMember :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgMember/add',_params,_body,cmp.extend({},options))}, 
        
             updateMember :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgMember/update',_params,_body,cmp.extend({},options))}, 
        
             getMemberList :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgMember/members',_params,_body,cmp.extend({},options))}, 
        
             importMembers :  function(type,_params,_body,options){return SeeyonApi.Rest.post('joinOrgMember/import/'+type+'',_params,_body,cmp.extend({},options))}, 
        
             modifyPwd :  function(memberId,nowPassword,oldPassword,_params,_body,options){return SeeyonApi.Rest.post('joinOrgMember/modifyPwd/'+memberId+'/'+nowPassword+'/'+oldPassword+'',_params,_body,cmp.extend({},options))}, 
        
           
             getMemberInfo :  function(memberid,_params,options){return SeeyonApi.Rest.get('joinOrgMember/info/'+memberid+'',_params,'',cmp.extend({},options))}, 
        
             delete :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgMember/remove',_params,_body,cmp.extend({},options))}, 
        
             batchDealAccess :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgMember/batchDealAccess',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    OrgLevel : {
             updateOrgLevel :  function(_params,_body,options){return SeeyonApi.Rest.put('orgLevel',_params,_body,cmp.extend({},options))}, 
        
             enabledOrgLevelByCode :  function(code,enabled,_params,_body,options){return SeeyonApi.Rest.put('orgLevel/code/'+code+'/enabled/'+enabled+'',_params,_body,cmp.extend({},options))}, 
        
             getEntityByCode :  function(code,_params,options){return SeeyonApi.Rest.get('orgLevel/code/'+code+'',_params,'',cmp.extend({},options))}, 
        
           
             deleteOrgLevel :  function(id,_params,_body,options){return SeeyonApi.Rest.del('orgLevel/'+id+'',_params,_body,cmp.extend({},options))}, 
        
             get :  function(id,_params,options){return SeeyonApi.Rest.get('orgLevel/'+id+'',_params,'',cmp.extend({},options))}, 
        
             deleteOrgLevelByCode :  function(code,_params,_body,options){return SeeyonApi.Rest.del('orgLevel/code/'+code+'',_params,_body,cmp.extend({},options))}, 
        
             enabledOrgLevel :  function(id,enabled,_params,_body,options){return SeeyonApi.Rest.put('orgLevel/'+id+'/enabled/'+enabled+'',_params,_body,cmp.extend({},options))}, 
        
             addOrgLevel :  function(_params,_body,options){return SeeyonApi.Rest.post('orgLevel',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Login : {
           
             loginForWechat :  function(_params,options){return SeeyonApi.Rest.get('login/wechat',_params,'',cmp.extend({},options))} 
        
        
    },
    
    M3appManager : {
             download :  function(appId,_params,options){return SeeyonApi.Rest.get('m3/appManager/download/'+appId+'',_params,'',cmp.extend({},options))}, 
        
             checkShellVersion :  function(_params,options){return SeeyonApi.Rest.get('m3/appManager/checkShellVersion',_params,'',cmp.extend({},options))}, 
        
           
             getCurrentUserAppList :  function(_params,options){return SeeyonApi.Rest.get('m3/appManager/getCurrentUserAppList',_params,'',cmp.extend({},options))}, 
        
             getThirdpartyPortal :  function(_params,options){return SeeyonApi.Rest.get('m3/appManager/thirdpartyPortal',_params,'',cmp.extend({},options))}, 
        
             saveUserSettings :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/appManager/save/user/settings',_params,_body,cmp.extend({},options))}, 
        
             hasResourceCode :  function(code,_params,options){return SeeyonApi.Rest.get('m3/appManager/hasResourceCode/'+code+'',_params,'',cmp.extend({},options))}, 
        
             checkAppVersionHasUpdate :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/appManager/check/version',_params,_body,cmp.extend({},options))}, 
        
             refreshAppList :  function(_params,options){return SeeyonApi.Rest.get('m3/appManager/applist/refresh',_params,'',cmp.extend({},options))}, 
        
             checkMd5 :  function(appId,md5,_params,options){return SeeyonApi.Rest.get('m3/appManager/checkMd5/'+appId+'/'+md5+'',_params,'',cmp.extend({},options))}, 
        
             getConfigInfo :  function(_params,options){return SeeyonApi.Rest.get('m3/appManager/getConfigInfo',_params,'',cmp.extend({},options))}, 
        
             getAppList :  function(cmpShellVersion,os,_params,_body,options){return SeeyonApi.Rest.post('m3/appManager/getAppList/'+cmpShellVersion+'/'+os+'',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Inquiry : {
             getInquiriesTypeByUnitId :  function(unitId,_params,options){return SeeyonApi.Rest.get('inquiry/inquiriesType/unit/'+unitId+'',_params,'',cmp.extend({},options))}, 
        
           
             getGroupInquiriesType :  function(_params,options){return SeeyonApi.Rest.get('inquiry/inquiriesType/group',_params,'',cmp.extend({},options))}, 
        
             delInquiry :  function(inquiryId,_params,options){return SeeyonApi.Rest.get('inquiry/delInquiry/'+inquiryId+'',_params,'',cmp.extend({},options))}, 
        
             inqAudit :  function(_params,_body,options){return SeeyonApi.Rest.post('inquiry/audit',_params,_body,cmp.extend({},options))}, 
        
             inquiryCreate :  function(_params,_body,options){return SeeyonApi.Rest.post('inquiry',_params,_body,cmp.extend({},options))}, 
        
             unlockInquiry :  function(inquiryId,_params,options){return SeeyonApi.Rest.get('inquiry/audit/unlock/'+inquiryId+'',_params,'',cmp.extend({},options))}, 
        
             getInquiriesByUnitId :  function(unitId,loginName,_params,options){return SeeyonApi.Rest.get('inquiry/unit/'+unitId+'/'+loginName+'',_params,'',cmp.extend({},options))}, 
        
             submitInquiry :  function(_params,_body,options){return SeeyonApi.Rest.post('inquiry/save',_params,_body,cmp.extend({},options))}, 
        
             publishInquiry :  function(inquiryId,_params,options){return SeeyonApi.Rest.get('inquiry/publishInquiry/'+inquiryId+'',_params,'',cmp.extend({},options))}, 
        
             getInquiriesTypeByBoardId :  function(boardId,loginName,_params,options){return SeeyonApi.Rest.get('inquiry/inquiriesType/'+boardId+'/'+loginName+'',_params,'',cmp.extend({},options))}, 
        
             inquiryDetails :  function(inquiryId,affairId,comeFrom,affairState,_params,options){return SeeyonApi.Rest.get('inquiry/'+inquiryId+'/'+affairId+'/'+comeFrom+'/'+affairState+'',_params,'',cmp.extend({},options))}, 
        
             inquiryNewCreate :  function(_params,_body,options){return SeeyonApi.Rest.post('inquiry/create',_params,_body,cmp.extend({},options))}, 
        
             checkInquiryState :  function(inquiryId,_params,options){return SeeyonApi.Rest.get('inquiry/state/'+inquiryId+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    CmpBulletin : {
             bulAudit :  function(_params,_body,options){return SeeyonApi.Rest.post('cmpBulletin/audit',_params,_body,cmp.extend({},options))}, 
        
             bulletinDetails :  function(bulId,comeFrom,affairId,_params,options){return SeeyonApi.Rest.get('cmpBulletin/'+bulId+'/'+comeFrom+'/'+affairId+'',_params,'',cmp.extend({},options))}, 
        
             unlockBulletin :  function(bulId,_params,options){return SeeyonApi.Rest.get('cmpBulletin/audit/unlock/'+bulId+'',_params,'',cmp.extend({},options))}, 
        
           
             bulState :  function(bulId,_params,options){return SeeyonApi.Rest.get('cmpBulletin/state/'+bulId+'',_params,'',cmp.extend({},options))}, 
        
             publishBulletin :  function(bulId,_params,options){return SeeyonApi.Rest.get('cmpBulletin/publish/'+bulId+'',_params,'',cmp.extend({},options))}, 
        
             issueBulletin :  function(_params,_body,options){return SeeyonApi.Rest.post('cmpBulletin/issue',_params,_body,cmp.extend({},options))}, 
        
             preIssueBulletin :  function(bodyType,_params,options){return SeeyonApi.Rest.get('cmpBulletin/issue/prepare/'+bodyType+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    ShareRecord : {
             delShareRecord :  function(_params,_body,options){return SeeyonApi.Rest.post('shareRecord/del',_params,_body,cmp.extend({},options))}, 
        
             saveShareRecord :  function(_params,_body,options){return SeeyonApi.Rest.post('shareRecord/save',_params,_body,cmp.extend({},options))}, 
        
           
        
    },
    
    M3office : {
           
             getOfficeAuth :  function(_params,options){return SeeyonApi.Rest.get('m3/office/auth',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Jssdk : {
             getStub :  function(_params,options){return SeeyonApi.Rest.get('/jssdk',_params,'',cmp.extend({'Accept' : 'text/javascript'},options))}, 
        
           
        
    },
    
    Event : {
             delCalEventById :  function(eventId,_params,_body,options){return SeeyonApi.Rest.post('event/remove/'+eventId+'',_params,_body,cmp.extend({},options))}, 
        
             getCurrentUser :  function(_params,_body,options){return SeeyonApi.Rest.post('event/currentUser',_params,_body,cmp.extend({},options))}, 
        
             getCaleventById :  function(eventId,_params,options){return SeeyonApi.Rest.get('event/'+eventId+'',_params,'',cmp.extend({},options))}, 
        
           
             newCalevent :  function(_params,_body,options){return SeeyonApi.Rest.post('event/add',_params,_body,cmp.extend({},options))}, 
        
             updateCalEvent :  function(_params,_body,options){return SeeyonApi.Rest.post('event/update',_params,_body,cmp.extend({},options))}, 
        
             getCalEventDetailById :  function(id,_params,options){return SeeyonApi.Rest.get('event/'+id+'/detail',_params,'',cmp.extend({},options))} 
        
        
    },
    
    JoinURL : {
           
             addAccount :  function(_params,_body,options){return SeeyonApi.Rest.post('joinURL/save',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    OrgAccount : {
             updateUnit :  function(_params,_body,options){return SeeyonApi.Rest.put('orgAccount',_params,_body,cmp.extend({},options))}, 
        
             getEntityByCode :  function(code,_params,options){return SeeyonApi.Rest.get('orgAccount/code/'+code+'',_params,'',cmp.extend({},options))}, 
        
           
             get :  function(id,_params,options){return SeeyonApi.Rest.get('orgAccount/'+id+'',_params,'',cmp.extend({},options))}, 
        
             deleteUnitById :  function(id,_params,_body,options){return SeeyonApi.Rest.del('orgAccount/'+id+'',_params,_body,cmp.extend({},options))}, 
        
             getUnitIdByName :  function(name,_params,options){return SeeyonApi.Rest.get('orgAccount/name/'+name+'',_params,'',cmp.extend({},options))}, 
        
             addAccount :  function(_params,_body,options){return SeeyonApi.Rest.post('orgAccount',_params,_body,cmp.extend({},options))}, 
        
             getAdministratoById :  function(id,_params,options){return SeeyonApi.Rest.get('orgAccount/administrator/'+id+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    CmpNews : {
             replays :  function(_params,_body,options){return SeeyonApi.Rest.post('cmpNews/replays',_params,_body,cmp.extend({},options))}, 
        
             removeReplyById :  function(replyId,replyType,_params,options){return SeeyonApi.Rest.get('cmpNews/replays/remove/'+replyId+'/'+replyType+'',_params,'',cmp.extend({},options))}, 
        
             newsAudit :  function(_params,_body,options){return SeeyonApi.Rest.post('cmpNews/audit',_params,_body,cmp.extend({},options))}, 
        
             unlockNews :  function(newsId,_params,options){return SeeyonApi.Rest.get('cmpNews/audit/unlock/'+newsId+'',_params,'',cmp.extend({},options))}, 
        
           
             preIssueNews :  function(bodyType,_params,options){return SeeyonApi.Rest.get('cmpNews/issue/prepare/'+bodyType+'',_params,'',cmp.extend({},options))}, 
        
             addPraiseForComment :  function(commentId,newsId,_params,options){return SeeyonApi.Rest.get('cmpNews/replay/like/'+commentId+'/'+newsId+'',_params,'',cmp.extend({},options))}, 
        
             newsState :  function(newsId,_params,options){return SeeyonApi.Rest.get('cmpNews/state/'+newsId+'',_params,'',cmp.extend({},options))}, 
        
             newsDetails :  function(newsId,comeFrom,affairId,_params,options){return SeeyonApi.Rest.get('cmpNews/'+newsId+'/'+comeFrom+'/'+affairId+'',_params,'',cmp.extend({},options))}, 
        
             addReplay :  function(_params,_body,options){return SeeyonApi.Rest.post('cmpNews/replay',_params,_body,cmp.extend({},options))}, 
        
             issueNews :  function(_params,_body,options){return SeeyonApi.Rest.post('cmpNews/issue',_params,_body,cmp.extend({},options))}, 
        
             addPraiseForNews :  function(newsId,_params,options){return SeeyonApi.Rest.get('cmpNews/like/'+newsId+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Product : {
           
             hasPlugin :  function(pluginName,_params,options){return SeeyonApi.Rest.get('product/hasPlugin/'+pluginName+'',_params,'',cmp.extend({},options))}, 
        
             getAllProductInfo :  function(_params,options){return SeeyonApi.Rest.get('product',_params,'',cmp.extend({},options))}, 
        
             getProductPatchForWechat :  function(_params,options){return SeeyonApi.Rest.get('product/patch',_params,'',cmp.extend({},options))}, 
        
             getConnectionInfo :  function(_params,options){return SeeyonApi.Rest.get('product/configure',_params,'',cmp.extend({},options))}, 
        
             getProductType :  function(_params,options){return SeeyonApi.Rest.get('product/orgType',_params,'',cmp.extend({},options))}, 
        
             getProductInfo :  function(_params,options){return SeeyonApi.Rest.get('product/version',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Applog : {
           
             insertApplog :  function(_params,_body,options){return SeeyonApi.Rest.post('applog',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    WeixinMessage : {
           
             getMenu :  function(_params,options){return SeeyonApi.Rest.get('weixinMessage/menu',_params,'',cmp.extend({},options))}, 
        
             saveMessageConfig :  function(_params,options){return SeeyonApi.Rest.get('weixinMessage/saveConfig',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Menu : {
             getMenuByCurrUser :  function(_params,options){return SeeyonApi.Rest.get('menu/getCurrUserMenu',_params,'',cmp.extend({},options))}, 
        
             verifyMenuPath :  function(pathIndex,level,_params,options){return SeeyonApi.Rest.get('menu/'+pathIndex+'/verifymenupath/'+level+'',_params,'',cmp.extend({},options))}, 
        
           
             getMenuByLoginName :  function(level,_params,options){return SeeyonApi.Rest.get('menu/getmenumaxpath/'+level+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
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
    
    Cmpsubdepartments : {
           
             getCmpSubEntities :  function(parentId,_params,options){return SeeyonApi.Rest.get('cmpsubdepartments/subentities/'+parentId+'',_params,'',cmp.extend({},options))}, 
        
             getCmpSubDepartments :  function(parentId,_params,options){return SeeyonApi.Rest.get('cmpsubdepartments/subdepartments/'+parentId+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Token : {
           
             removeToken :  function(token,_params,_body,options){return SeeyonApi.Rest.del('token/'+token+'',_params,_body,cmp.extend({},options))}, 
        
             getToken :  function(userName,password,_params,options){return SeeyonApi.Rest.get('token/'+userName+'/'+password+'',_params,'',cmp.extend({},options))}, 
        
             bindUser :  function(_params,_body,options){return SeeyonApi.Rest.put('token',_params,_body,cmp.extend({},options))}, 
        
             getTokenByQueryParam :  function(_params,_body,options){return SeeyonApi.Rest.post('token',_params,_body,cmp.extend({},options))}, 
        
             getTokenString :  function(userName,password,_params,options){return SeeyonApi.Rest.get('token/'+userName+'/'+password+'',_params,'',cmp.extend({'Accept' : 'text/plain'},options))} 
        
        
    },
    
    Pnssetting : {
             checkM3Server :  function(_params,_body,options){return SeeyonApi.Rest.post('pns/setting/checkM3Server',_params,_body,cmp.extend({},options))}, 
        
             getCIPMessageType :  function(_params,options){return SeeyonApi.Rest.get('pns/setting/cip/offline',_params,'',cmp.extend({},options))}, 
        
           
             getSettings :  function(userId,_params,options){return SeeyonApi.Rest.get('pns/setting/get/'+userId+'',_params,'',cmp.extend({},options))}, 
        
             checkPushServer :  function(_params,_body,options){return SeeyonApi.Rest.post('pns/setting/checkPushServer',_params,_body,cmp.extend({},options))}, 
        
             saveSettings :  function(_params,_body,options){return SeeyonApi.Rest.post('pns/setting/save',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Report : {
             getSeeyonreportTree :  function(_params,options){return SeeyonApi.Rest.get('report/seeyonreport/tree',_params,'',cmp.extend({},options))}, 
        
           
             getSeeyonreportList :  function(_params,options){return SeeyonApi.Rest.get('report/seeyonreport/list',_params,'',cmp.extend({},options))}, 
        
             getReportTemplates :  function(categoryId,_params,_body,options){return SeeyonApi.Rest.post('report/reportShow/'+categoryId+'',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    OrgLevels : {
             getEntitiesCount :  function(accountId,_params,options){return SeeyonApi.Rest.get('orgLevels/count/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
           
             getAllEntitiesCount :  function(accountId,_params,options){return SeeyonApi.Rest.get('orgLevels/all/count/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             getEntities :  function(accountId,_params,options){return SeeyonApi.Rest.get('orgLevels/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             getAllEntities :  function(accountId,_params,options){return SeeyonApi.Rest.get('orgLevels/all/'+accountId+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Asset : {
           
             assetAuditInfo :  function(_params,_body,options){return SeeyonApi.Rest.post('asset/auditInfo',_params,_body,cmp.extend({},options))}, 
        
             assetAuditCheck :  function(_params,_body,options){return SeeyonApi.Rest.post('asset/asset/auditCheck',_params,_body,cmp.extend({},options))}, 
        
             assetAuditSubmit :  function(_params,_body,options){return SeeyonApi.Rest.post('asset/auditSubmit',_params,_body,cmp.extend({},options))}, 
        
             findAssetAudits :  function(_params,_body,options){return SeeyonApi.Rest.post('asset/audits',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    OrgDepartments : {
             getDepartmentVisorByCode :  function(code,_params,options){return SeeyonApi.Rest.get('orgDepartments/visor/code/'+code+'',_params,'',cmp.extend({},options))}, 
        
             getConcurrentPostByDepartmentCode :  function(code,_params,options){return SeeyonApi.Rest.get('orgDepartments/concurrentpost/code/'+code+'',_params,'',cmp.extend({},options))}, 
        
             getEntitiesCount :  function(accountId,_params,options){return SeeyonApi.Rest.get('orgDepartments/count/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
           
             getChildAccount :  function(parentId,_params,options){return SeeyonApi.Rest.get('orgDepartments/children/'+parentId+'',_params,'',cmp.extend({},options))}, 
        
             getAllEntitiesCount :  function(accountId,_params,options){return SeeyonApi.Rest.get('orgDepartments/all/count/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             getEntities :  function(accountId,_params,options){return SeeyonApi.Rest.get('orgDepartments/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             getParentDepartment :  function(departmentId,_params,options){return SeeyonApi.Rest.get('orgDepartments/parent/'+departmentId+'',_params,'',cmp.extend({},options))}, 
        
             getAllEntities :  function(accountId,_params,options){return SeeyonApi.Rest.get('orgDepartments/all/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             getChildAccountByCode :  function(parentCode,_params,options){return SeeyonApi.Rest.get('orgDepartments/children/code/'+parentCode+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    M3startPage : {
           
             getStartPageByAccontId :  function(phoneType,_params,options){return SeeyonApi.Rest.get('m3/startPage/getCustom/'+phoneType+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Bulletin : {
             getGroupBulTypes :  function(_params,options){return SeeyonApi.Rest.get('bulletin/bulType/group',_params,'',cmp.extend({},options))}, 
        
             getBulletinsByUnitId :  function(unitId,_params,options){return SeeyonApi.Rest.get('bulletin/unit/'+unitId+'',_params,'',cmp.extend({},options))}, 
        
             getBulTypesByUnitId :  function(unitId,_params,options){return SeeyonApi.Rest.get('bulletin/bulType/unit/'+unitId+'',_params,'',cmp.extend({},options))}, 
        
             getBulletinsByUserId :  function(loginName,_params,options){return SeeyonApi.Rest.get('bulletin/user/loginName/'+loginName+'',_params,'',cmp.extend({},options))}, 
        
             getBulletinsByTypeId :  function(typeId,_params,options){return SeeyonApi.Rest.get('bulletin/bulType/'+typeId+'',_params,'',cmp.extend({},options))}, 
        
           
             getBulletinById :  function(bulletinId,_params,options){return SeeyonApi.Rest.get('bulletin/'+bulletinId+'',_params,'',cmp.extend({},options))}, 
        
             getBulletinsCountByUserId :  function(loginName,_params,options){return SeeyonApi.Rest.get('bulletin/count/loginName/'+loginName+'',_params,'',cmp.extend({},options))}, 
        
             addBulletin :  function(_params,_body,options){return SeeyonApi.Rest.post('bulletin',_params,_body,cmp.extend({},options))}, 
        
             readNews :  function(userId,bulDataId,_params,options){return SeeyonApi.Rest.get('bulletin/read/'+userId+'/'+bulDataId+'',_params,'',cmp.extend({},options))}, 
        
             getCountByReadState :  function(readState,userId,_params,options){return SeeyonApi.Rest.get('bulletin/count/'+readState+'/'+userId+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Cap4malloauth : {
             checkBindMall :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/mall/oauth/checkBindMall',_params,_body,cmp.extend({},options))}, 
        
             checkImgCode :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/mall/oauth/checkImgCode',_params,_body,cmp.extend({},options))}, 
        
             getAuthState :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/mall/oauth/getAuthState',_params,_body,cmp.extend({},options))}, 
        
           
             certificated :  function(_params,options){return SeeyonApi.Rest.get('cap4/mall/oauth/certificated',_params,'',cmp.extend({},options))}, 
        
             sendCode :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/mall/oauth/sendCode',_params,_body,cmp.extend({},options))}, 
        
             bindMallUser :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/mall/oauth/bindMallUser',_params,_body,cmp.extend({},options))}, 
        
             randomImg :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/mall/oauth/randomImg',_params,_body,cmp.extend({},options))}, 
        
             authorize :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/mall/oauth/authorize',_params,_body,cmp.extend({},options))}, 
        
             checkCode :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/mall/oauth/checkCode',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    ThirdpartyPending : {
             receiveThirdPartyPending :  function(_params,_body,options){return SeeyonApi.Rest.post('thirdpartyPending/receive',_params,_body,cmp.extend({},options))}, 
        
             receiveThirdPartyPendings :  function(_params,_body,options){return SeeyonApi.Rest.post('thirdpartyPending/receive/pendings',_params,_body,cmp.extend({},options))}, 
        
           
             updatePendingState :  function(_params,_body,options){return SeeyonApi.Rest.post('thirdpartyPending/updatePendingState',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Cap4template : {
             saveElementConfigType :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/saveElementConfigType',_params,_body,cmp.extend({},options))}, 
        
             multiDeleteTemplate :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/multiDeleteTemplate',_params,_body,cmp.extend({},options))}, 
        
             getElementConfigTypes :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/getElementConfigTypes',_params,_body,cmp.extend({},options))}, 
        
             getTemplateOrgAuth :  function(templateId,_params,options){return SeeyonApi.Rest.get('cap4/template/getTemplateOrgAuth/'+templateId+'',_params,'',cmp.extend({},options))}, 
        
             saveFlowFieldConfig :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/saveFlowFieldConfig',_params,_body,cmp.extend({},options))}, 
        
             show :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/show',_params,_body,cmp.extend({},options))}, 
        
             autoMatchElementData :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/autoMatchElementData',_params,_body,cmp.extend({},options))}, 
        
             saveElementName :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/saveElementName',_params,_body,cmp.extend({},options))}, 
        
             buildMobileCAPAppPackage :  function(_params,options){return SeeyonApi.Rest.get('cap4/template/buildMobileCAPAppPackage',_params,'',cmp.extend({},options))}, 
        
             getElementsListByBizId :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/getElementsListByBizId',_params,_body,cmp.extend({},options))}, 
        
             getMobileTemplatesByMenuId :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/getMobileTemplatesByMenuId',_params,_body,cmp.extend({},options))}, 
        
             downloadTemplate :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/downloadTemplate',_params,_body,cmp.extend({},options))}, 
        
             getUnflowAndFlowTemplates :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/getUnflowAndFlowTemplates',_params,_body,cmp.extend({},options))}, 
        
             getMobileTemplatesByBizId :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/getMobileTemplatesByBizId',_params,_body,cmp.extend({},options))}, 
        
             multiUpdateTemplate :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/multiUpdateTemplate',_params,_body,cmp.extend({},options))}, 
        
           
             getFlowFieldConfig :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/getFlowFieldConfig',_params,_body,cmp.extend({},options))}, 
        
             downloadColumn :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/downloadColumn',_params,_body,cmp.extend({},options))}, 
        
             getDataByTemplateId :  function(templateId,_params,options){return SeeyonApi.Rest.get('cap4/template/getDataByTemplateId/'+templateId+'',_params,'',cmp.extend({},options))}, 
        
             saveTemplateOrgAuth :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/saveTemplateOrgAuth',_params,_body,cmp.extend({},options))}, 
        
             downloadCustomCtrl :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/downloadCustomCtrl',_params,_body,cmp.extend({},options))}, 
        
             getDataByColumnIds :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/getDataByColumnIds',_params,_body,cmp.extend({},options))}, 
        
             clearElementDataConfig :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/clearElementDataConfig',_params,_body,cmp.extend({},options))}, 
        
             list :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/list',_params,_body,cmp.extend({},options))}, 
        
             multiUpdateColumn :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/multiUpdateColumn',_params,_body,cmp.extend({},options))}, 
        
             getTemplatesByCurrentUser :  function(menuId,_params,options){return SeeyonApi.Rest.get('cap4/template/getBussIdByMenuId/'+menuId+'',_params,'',cmp.extend({},options))}, 
        
             getDefaultTemplateDataById :  function(bussId,_params,options){return SeeyonApi.Rest.get('cap4/template/getDefaultTemplateDataById/'+bussId+'',_params,'',cmp.extend({},options))}, 
        
             getCurrentUserInfo :  function(_params,options){return SeeyonApi.Rest.get('cap4/template/getCurrentUserInfo',_params,'',cmp.extend({},options))}, 
        
             getDataByRealParams :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/getDataByRealParams',_params,_body,cmp.extend({},options))}, 
        
             getDataByElementIds :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/getDataByElementIds',_params,_body,cmp.extend({},options))}, 
        
             getColumnsByTemplateIds :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/getColumnsByTemplateIds',_params,_body,cmp.extend({},options))}, 
        
             getElements :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/getElements',_params,_body,cmp.extend({},options))}, 
        
             getMenusByBussId :  function(bussId,_params,options){return SeeyonApi.Rest.get('cap4/template/getMenusByBussId/'+bussId+'',_params,'',cmp.extend({},options))}, 
        
             listCustomCtrl :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/listCustomCtrl',_params,_body,cmp.extend({},options))}, 
        
             getCAPBusinessTemplates :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/getCAPBusinessTemplates',_params,_body,cmp.extend({},options))}, 
        
             getElementsList :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/getElementsList',_params,_body,cmp.extend({},options))}, 
        
             reportTemplateSaveAsNew :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/reportTemplateSaveAsNew',_params,_body,cmp.extend({},options))}, 
        
             listColumn :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/template/listColumn',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Auto : {
             autoAuditInfo :  function(_params,_body,options){return SeeyonApi.Rest.post('auto/auditInfo',_params,_body,cmp.extend({},options))}, 
        
           
             autoAuditSubmit :  function(_params,_body,options){return SeeyonApi.Rest.post('auto/auditSubmit',_params,_body,cmp.extend({},options))}, 
        
             findAutoAudits :  function(_params,_body,options){return SeeyonApi.Rest.post('auto/audits',_params,_body,cmp.extend({},options))}, 
        
             autoAuditCheck :  function(_params,_body,options){return SeeyonApi.Rest.post('auto/auditCheck',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    JoinOrgDepartment : {
             getEnumItem :  function(enumId,_params,options){return SeeyonApi.Rest.get('joinOrgDepartment/enumItems/'+enumId+'',_params,'',cmp.extend({},options))}, 
        
             getDepartmentInfo :  function(departmentid,_params,options){return SeeyonApi.Rest.get('joinOrgDepartment/info/'+departmentid+'',_params,'',cmp.extend({},options))}, 
        
           
             getAccountList :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgDepartment/accounts',_params,_body,cmp.extend({},options))}, 
        
             exportAccounts :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgDepartment/exportAccounts',_params,_body,cmp.extend({},options))}, 
        
             deleteDepartmentById :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgDepartment/remove',_params,_body,cmp.extend({},options))}, 
        
             updateAccount :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgDepartment/updateAccount',_params,_body,cmp.extend({},options))}, 
        
             getAccountRoleList :  function(orgAccountId,_params,options){return SeeyonApi.Rest.get('joinOrgDepartment/accountRoles/'+orgAccountId+'',_params,'',cmp.extend({},options))}, 
        
             addUnit :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgDepartment/addUnit',_params,_body,cmp.extend({},options))}, 
        
             exportUnits :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgDepartment/exportUnits',_params,_body,cmp.extend({},options))}, 
        
             getUnitTree :  function(unitId,_params,options){return SeeyonApi.Rest.get('joinOrgDepartment/unitTree/'+unitId+'',_params,'',cmp.extend({},options))}, 
        
             updateUnit :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgDepartment/updateUnit',_params,_body,cmp.extend({},options))}, 
        
             getUnitRoleList :  function(orgAccountId,_params,options){return SeeyonApi.Rest.get('joinOrgDepartment/unitRoles/'+orgAccountId+'',_params,'',cmp.extend({},options))}, 
        
             getFullTree :  function(unitId,_params,options){return SeeyonApi.Rest.get('joinOrgDepartment/fullTree/'+unitId+'',_params,'',cmp.extend({},options))}, 
        
             importUnits :  function(accountId,_params,_body,options){return SeeyonApi.Rest.post('joinOrgDepartment/importUnits/'+accountId+'',_params,_body,cmp.extend({},options))}, 
        
             importAccounts :  function(accountId,_params,_body,options){return SeeyonApi.Rest.post('joinOrgDepartment/importAccounts/'+accountId+'',_params,_body,cmp.extend({},options))}, 
        
             getCustomerProperties :  function(orgAccountId,_params,options){return SeeyonApi.Rest.get('joinOrgDepartment/customerProperties/'+orgAccountId+'',_params,'',cmp.extend({},options))}, 
        
             getUnitList :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgDepartment/units',_params,_body,cmp.extend({},options))}, 
        
             addAccount :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgDepartment/addAccount',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Data : {
             exportByAccountId :  function(accountId,_params,options){return SeeyonApi.Rest.get('data/organization/accountId/'+accountId+'',_params,'',cmp.extend({'Accept' : 'application/xml'},options))}, 
        
             exportLevelsByAccountName :  function(accountName,_params,options){return SeeyonApi.Rest.get('data/orgLevels/'+accountName+'',_params,'',cmp.extend({},options))}, 
        
             exportPostsByAccountId :  function(accountId,_params,options){return SeeyonApi.Rest.get('data/posts/accountId/'+accountId+'',_params,'',cmp.extend({'Accept' : 'application/xml'},options))}, 
        
           
             exportDepartmentsByAccountName :  function(accountName,_params,options){return SeeyonApi.Rest.get('data/departments/'+accountName+'',_params,'',cmp.extend({},options))}, 
        
             exportByAccountName :  function(accountName,_params,options){return SeeyonApi.Rest.get('data/organization/accountName/'+accountName+'',_params,'',cmp.extend({},options))}, 
        
             exportPostsByAccountName :  function(accountName,_params,options){return SeeyonApi.Rest.get('data/posts/'+accountName+'',_params,'',cmp.extend({},options))}, 
        
             exportLevelsByAccountId :  function(accountId,_params,options){return SeeyonApi.Rest.get('data/orgLevels/accountId/'+accountId+'',_params,'',cmp.extend({'Accept' : 'application/xml'},options))}, 
        
             exportDepartmentsByAccountId :  function(accountId,_params,options){return SeeyonApi.Rest.get('data/departments/accountId/'+accountId+'',_params,'',cmp.extend({'Accept' : 'application/xml'},options))}, 
        
             exportAddressbook :  function(accountId,_params,options){return SeeyonApi.Rest.get('data/addressbook/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             importByAccountName :  function(accountName,_params,_body,options){return SeeyonApi.Rest.post('data/organization/accountName/'+accountName+'',_params,_body,cmp.extend({},options))}, 
        
             exportMembersByAccountId :  function(accountId,_params,options){return SeeyonApi.Rest.get('data/members/accountId/'+accountId+'',_params,'',cmp.extend({'Accept' : 'application/xml'},options))}, 
        
             exportMembersByAccountName :  function(accountName,_params,options){return SeeyonApi.Rest.get('data/members/'+accountName+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    M3statistics : {
             saveM3AppBehavior :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/statistics/appClick',_params,_body,cmp.extend({},options))}, 
        
             getAppClickNumberStatistic :  function(accountId,_params,options){return SeeyonApi.Rest.get('m3/statistics/appClick/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             getDepartmentActiveStatistic :  function(accountId,_params,options){return SeeyonApi.Rest.get('m3/statistics/departActive/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             m3PlugIsUsed :  function(_params,options){return SeeyonApi.Rest.get('m3/statistics/plugUsed',_params,'',cmp.extend({},options))}, 
        
           
             getClientTypeStatistic :  function(accountId,_params,options){return SeeyonApi.Rest.get('m3/statistics/clientType/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             firstLogin :  function(fromClientType,_params,_body,options){return SeeyonApi.Rest.post('m3/statistics/login/'+fromClientType+'',_params,_body,cmp.extend({},options))}, 
        
             getWholeDescriptionStatistic :  function(accountId,_params,options){return SeeyonApi.Rest.get('m3/statistics/whole/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             m3Hide :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/statistics/hide',_params,_body,cmp.extend({},options))}, 
        
             m3WakeUp :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/statistics/wakeUp',_params,_body,cmp.extend({},options))}, 
        
             getRealTimeStatistic :  function(accountId,_params,options){return SeeyonApi.Rest.get('m3/statistics/realTime/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             currentAccountIsGroup :  function(_params,options){return SeeyonApi.Rest.get('m3/statistics/isGroup',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Project : {
           
             getProject :  function(id,_params,options){return SeeyonApi.Rest.get('project/'+id+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    OrgPost : {
             deletePost :  function(id,_params,_body,options){return SeeyonApi.Rest.del('orgPost/'+id+'',_params,_body,cmp.extend({},options))}, 
        
             updatePost :  function(_params,_body,options){return SeeyonApi.Rest.put('orgPost',_params,_body,cmp.extend({},options))}, 
        
             addPosts :  function(_params,_body,options){return SeeyonApi.Rest.post('orgPost/addPosts',_params,_body,cmp.extend({},options))}, 
        
             enablePostByCode :  function(code,enabled,_params,_body,options){return SeeyonApi.Rest.put('orgPost/code/'+code+'/enabled/'+enabled+'',_params,_body,cmp.extend({},options))}, 
        
             getEntityByCode :  function(code,_params,options){return SeeyonApi.Rest.get('orgPost/code/'+code+'',_params,'',cmp.extend({},options))}, 
        
           
             enablePost :  function(id,enabled,_params,_body,options){return SeeyonApi.Rest.put('orgPost/'+id+'/enabled/'+enabled+'',_params,_body,cmp.extend({},options))}, 
        
             deletePostByCode :  function(code,_params,_body,options){return SeeyonApi.Rest.del('orgPost/code/'+code+'',_params,_body,cmp.extend({},options))}, 
        
             updatePosts :  function(_params,_body,options){return SeeyonApi.Rest.post('orgPost/updatePosts',_params,_body,cmp.extend({},options))}, 
        
             get :  function(id,_params,options){return SeeyonApi.Rest.get('orgPost/'+id+'',_params,'',cmp.extend({},options))}, 
        
             addPost :  function(_params,_body,options){return SeeyonApi.Rest.post('orgPost',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Cap4formquerybtn : {
             getQueryDefinitions :  function(_params,options){return SeeyonApi.Rest.get('cap4/formquerybtn/getQueryDefinitions',_params,'',cmp.extend({},options))}, 
        
           
        
    },
    
    Cmporgnization : {
             getDeptByAccountId :  function(accountid,_params,options){return SeeyonApi.Rest.get('cmporgnization/firstleveldepts/'+accountid+'',_params,'',cmp.extend({},options))}, 
        
           
             getAccounts :  function(_params,options){return SeeyonApi.Rest.get('cmporgnization/firstlevelaccount',_params,'',cmp.extend({},options))}, 
        
             getCmpOrganization :  function(_params,options){return SeeyonApi.Rest.get('cmporgnization',_params,'',cmp.extend({},options))}, 
        
             searchEntity :  function(accountid,searchtype,keyword,_params,options){return SeeyonApi.Rest.get('cmporgnization/searchentities/'+accountid+'/'+searchtype+'/'+keyword+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Uc : {
           
             heartbeat :  function(_params,options){return SeeyonApi.Rest.get('uc/heartbeat',_params,'',cmp.extend({},options))}, 
        
             getAllProductInfo :  function(memberId,_params,options){return SeeyonApi.Rest.get('uc/token/'+memberId+'',_params,'',cmp.extend({},options))}, 
        
             getCurrentUserSecretKey :  function(_params,options){return SeeyonApi.Rest.get('uc/currentUserSecretKey',_params,'',cmp.extend({},options))}, 
        
             systemConfig :  function(_params,options){return SeeyonApi.Rest.get('uc/systemConfig',_params,'',cmp.extend({},options))}, 
        
             getUpdateOnlineState :  function(_params,options){return SeeyonApi.Rest.get('uc/updateOnlineState',_params,'',cmp.extend({},options))}, 
        
             getPollingMessage :  function(_params,options){return SeeyonApi.Rest.get('uc/getmessage',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Cmpmembers : {
             getCmpExtMembers :  function(accountid,_params,options){return SeeyonApi.Rest.get('cmpmembers/extmembers/'+accountid+'',_params,'',cmp.extend({},options))}, 
        
           
        
    },
    
    Cap4appsetup : {
             cancelSetup :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/appsetup/cancelSetup',_params,_body,cmp.extend({},options))}, 
        
             verifyApp :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/appsetup/verifyApp',_params,_body,cmp.extend({},options))}, 
        
             completeSetup :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/appsetup/completeSetup',_params,_body,cmp.extend({},options))}, 
        
             redirectSingleOrg :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/appsetup/redirectSingleOrg',_params,_body,cmp.extend({},options))}, 
        
           
             officialImport :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/appsetup/officialImport',_params,_body,cmp.extend({},options))}, 
        
             intelligentMatch :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/appsetup/intelligentMatch',_params,_body,cmp.extend({},options))}, 
        
             systemDetection :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/appsetup/systemDetection',_params,_body,cmp.extend({},options))}, 
        
             mergeNodePolicy :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/appsetup/mergeNodePolicy',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    JoinMetadataDepartment : {
             addColumn :  function(_params,_body,options){return SeeyonApi.Rest.post('joinMetadataDepartment/add',_params,_body,cmp.extend({},options))}, 
        
             updateColumn :  function(_params,_body,options){return SeeyonApi.Rest.post('joinMetadataDepartment/update',_params,_body,cmp.extend({},options))}, 
        
             getColumnList :  function(_params,_body,options){return SeeyonApi.Rest.post('joinMetadataDepartment/columns',_params,_body,cmp.extend({},options))}, 
        
           
             getColumnInfo :  function(id,_params,options){return SeeyonApi.Rest.get('joinMetadataDepartment/info/'+id+'',_params,'',cmp.extend({},options))}, 
        
             delete :  function(_params,_body,options){return SeeyonApi.Rest.post('joinMetadataDepartment/remove',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Shows : {
           
             getShowpostList :  function(_params,options){return SeeyonApi.Rest.get('shows/showpost',_params,'',cmp.extend({},options))}, 
        
             findComments :  function(_params,options){return SeeyonApi.Rest.get('shows/showpost/comment',_params,'',cmp.extend({},options))}, 
        
             getShowbarList :  function(_params,_body,options){return SeeyonApi.Rest.post('shows/showbar',_params,_body,cmp.extend({},options))}, 
        
             getDefaultCover :  function(_params,options){return SeeyonApi.Rest.get('shows/showbar/defaultCover',_params,'',cmp.extend({},options))}, 
        
             latestShowposts :  function(page,_params,options){return SeeyonApi.Rest.get('shows/showpost/'+page+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Cmplbs : {
             getServerDate :  function(_params,options){return SeeyonApi.Rest.get('cmplbs/servertime',_params,'',cmp.extend({},options))}, 
        
           
             getAttendanceInfoById :  function(id,_params,options){return SeeyonApi.Rest.get('cmplbs/'+id+'',_params,'',cmp.extend({},options))}, 
        
             saveAttendence :  function(_params,_body,options){return SeeyonApi.Rest.post('cmplbs/save',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Affair : {
             getAffairById :  function(affairId,_params,options){return SeeyonApi.Rest.get('/affair/'+affairId+'',_params,'',cmp.extend({},options))}, 
        
           
             exportPendingList :  function(ticketId,firstNum,pageSize,_params,options){return SeeyonApi.Rest.get('/affair/pending/'+ticketId+'/'+firstNum+'/'+pageSize+'',_params,'',cmp.extend({},options))}, 
        
             exportAgentPendingList :  function(ticketId,firstNum,pageSize,_params,options){return SeeyonApi.Rest.get('/affair/agent/'+ticketId+'/'+firstNum+'/'+pageSize+'',_params,'',cmp.extend({},options))}, 
        
             countPendingAffairs :  function(_params,_body,options){return SeeyonApi.Rest.post('/affair/pending/count',_params,_body,cmp.extend({},options))}, 
        
             canDealWithForm :  function(_params,options){return SeeyonApi.Rest.get('/affair/form/canEdit',_params,'',cmp.extend({},options))}, 
        
             exportTrackList :  function(ticketId,firstNum,pageSize,_params,options){return SeeyonApi.Rest.get('/affair/track/'+ticketId+'/'+firstNum+'/'+pageSize+'',_params,'',cmp.extend({},options))}, 
        
             finishaffair :  function(_params,_body,options){return SeeyonApi.Rest.post('/affair/finishaffair',_params,_body,cmp.extend({},options))}, 
        
             ctptransStepStop :  function(_params,_body,options){return SeeyonApi.Rest.post('/affair/stop',_params,_body,cmp.extend({},options))}, 
        
             dealweithForm :  function(_params,_body,options){return SeeyonApi.Rest.post('/affair/form/finish',_params,_body,cmp.extend({},options))}, 
        
             ctptransRepalBackground :  function(_params,_body,options){return SeeyonApi.Rest.post('/affair/cancel',_params,_body,cmp.extend({},options))},
             
             getPendingMore :  function(_params,_body,options){return SeeyonApi.Rest.post('affair/getPendingMore',_params,_body,cmp.extend({},options))}, 
             
             userPeivMenu :  function(_params,_body,options){return SeeyonApi.Rest.post('affair/userPeivMenu',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Stock : {
           
             stockAuditInfo :  function(_params,_body,options){return SeeyonApi.Rest.post('stock/auditInfo',_params,_body,cmp.extend({},options))}, 
        
             stockAuditSubmit :  function(_params,_body,options){return SeeyonApi.Rest.post('stock/auditSubmit',_params,_body,cmp.extend({},options))}, 
        
             findStockAudits :  function(_params,_body,options){return SeeyonApi.Rest.post('stock/audits',_params,_body,cmp.extend({},options))}, 
        
             stockAuditCheck :  function(_params,_body,options){return SeeyonApi.Rest.post('stock/auditCheck',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Edoc : {
             getRecZcdbList :  function(_params,options){return SeeyonApi.Rest.get('/edoc/dispatch/running',_params,'',cmp.extend({},options))}, 
        
             getRecSentList :  function(_params,options){return SeeyonApi.Rest.get('/edoc/dispatch/sent',_params,'',cmp.extend({},options))}, 
        
             exportEdocBySummaryId :  function(_params,_body,options){return SeeyonApi.Rest.post('/edoc/export',_params,_body,cmp.extend({},options))}, 
        
             getSendSentList :  function(_params,options){return SeeyonApi.Rest.get('/edoc/receipt/sent',_params,'',cmp.extend({},options))}, 
        
           
             getSendZcdbList :  function(_params,options){return SeeyonApi.Rest.get('/edoc/receipt/running',_params,'',cmp.extend({},options))}, 
        
             sendByTemplete :  function(ticket,templeteId,_params,_body,options){return SeeyonApi.Rest.post('/edoc/sendByTemplete/'+ticket+'/'+templeteId+'',_params,_body,cmp.extend({},options))}, 
        
             getSendDraftList :  function(_params,options){return SeeyonApi.Rest.get('/edoc/receipt/draft',_params,'',cmp.extend({},options))}, 
        
             getSendDoneList :  function(_params,options){return SeeyonApi.Rest.get('/edoc/receipt/done',_params,'',cmp.extend({},options))}, 
        
             getEdocSummaryById :  function(id,_params,options){return SeeyonApi.Rest.get('/edoc/'+id+'',_params,'',cmp.extend({},options))}, 
        
             getRecDoneList :  function(_params,options){return SeeyonApi.Rest.get('/edoc/dispatch/done',_params,'',cmp.extend({},options))}, 
        
             getSendPendingList :  function(_params,options){return SeeyonApi.Rest.get('/edoc/receipt/pending',_params,'',cmp.extend({},options))}, 
        
             getRecDraftList :  function(_params,options){return SeeyonApi.Rest.get('/edoc/dispatch/draft',_params,'',cmp.extend({},options))}, 
        
             exportEdocBySummaryIdMht :  function(_params,_body,options){return SeeyonApi.Rest.post('/edoc/id/exportmht',_params,_body,cmp.extend({},options))}, 
        
             signEdoc :  function(_params,_body,options){return SeeyonApi.Rest.post('/edoc/signedoc',_params,_body,cmp.extend({},options))}, 
        
             getSignZcdbList :  function(_params,options){return SeeyonApi.Rest.get('/edoc/sign/running',_params,'',cmp.extend({},options))}, 
        
             getRecPendingList :  function(_params,options){return SeeyonApi.Rest.get('/edoc/dispatch/pending',_params,'',cmp.extend({},options))}, 
        
             getSignPendingList :  function(_params,options){return SeeyonApi.Rest.get('/edoc/sign/pending',_params,'',cmp.extend({},options))}, 
        
             getSignDraftList :  function(_params,options){return SeeyonApi.Rest.get('/edoc/sign/draft',_params,'',cmp.extend({},options))}, 
        
             getSignSentList :  function(_params,options){return SeeyonApi.Rest.get('/edoc/sign/sent',_params,'',cmp.extend({},options))}, 
        
             importEdoc :  function(_params,_body,options){return SeeyonApi.Rest.post('/edoc/import',_params,_body,cmp.extend({},options))}, 
        
             getSignDoneList :  function(_params,options){return SeeyonApi.Rest.get('/edoc/sign/done',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Barcode : {
             decodeUrl :  function(_params,_body,options){return SeeyonApi.Rest.post('barcode/decodeUrl',_params,_body,cmp.extend({},options))}, 
        
           
        
    },
    
    Cmpposts4M3 : {
             getCmpPosts :  function(_params,options){return SeeyonApi.Rest.get('cmpposts4M3',_params,'',cmp.extend({},options))}, 
        
             getCmpVjoinPosts :  function(_params,options){return SeeyonApi.Rest.get('cmpposts4M3/vjoin',_params,'',cmp.extend({},options))}, 
        
           
             getCmpPostMembers :  function(postid,_params,options){return SeeyonApi.Rest.get('cmpposts4M3/postmembers/'+postid+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    EdocResource : {
             checkTakeBack :  function(_params,options){return SeeyonApi.Rest.get('edocResource/checkTakeBack',_params,'',cmp.extend({},options))}, 
        
             cancel :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/cancel',_params,_body,cmp.extend({},options))}, 
        
             exportEdocFile :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/exportFile',_params,_body,cmp.extend({},options))}, 
        
             getSummaryListByEdocTypeAndListType :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/getSummaryListByEdocTypeAndListType',_params,_body,cmp.extend({},options))}, 
        
             takeBack :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/takeBack',_params,_body,cmp.extend({},options))}, 
        
             submit :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/submit',_params,_body,cmp.extend({},options))}, 
        
             checkAffairValid :  function(_params,options){return SeeyonApi.Rest.get('edocResource/checkAffairValid',_params,'',cmp.extend({},options))}, 
        
             registered :  function(_params,options){return SeeyonApi.Rest.get('edocResource/registered',_params,'',cmp.extend({},options))}, 
        
             setTrack :  function(_params,options){return SeeyonApi.Rest.get('edocResource/setTrack',_params,'',cmp.extend({},options))}, 
        
             stepStop :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/stepStop',_params,_body,cmp.extend({},options))}, 
        
             getPhrase :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/phrase',_params,_body,cmp.extend({},options))}, 
        
             qianpiLock :  function(_params,options){return SeeyonApi.Rest.get('edocResource/qianpiLock',_params,'',cmp.extend({},options))}, 
        
             unlockEdocAll :  function(_params,options){return SeeyonApi.Rest.get('edocResource/unlockEdocAll',_params,'',cmp.extend({},options))}, 
        
             permissions :  function(_params,options){return SeeyonApi.Rest.get('edocResource/permissions',_params,'',cmp.extend({},options))}, 
        
             getAllPending :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/getAllPending',_params,_body,cmp.extend({},options))}, 
        
             stepback :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/stepback',_params,_body,cmp.extend({},options))}, 
        
             checkIsExchanged :  function(_params,options){return SeeyonApi.Rest.get('edocResource/checkCanTakeBack',_params,'',cmp.extend({},options))}, 
        
             edocSummary :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/edocSummary',_params,_body,cmp.extend({},options))}, 
        
             edocUserPeivMenu :  function(_params,options){return SeeyonApi.Rest.get('edocResource/edoc/user/privMenu',_params,'',cmp.extend({},options))}, 
        
             zcdb :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/zcdb',_params,_body,cmp.extend({},options))}, 
        
             checkEdocMarkIsUsed :  function(_params,options){return SeeyonApi.Rest.get('edocResource/checkEdocMarkIsUsed',_params,'',cmp.extend({},options))}, 
        
           
             getListSizeByEdocType :  function(_params,options){return SeeyonApi.Rest.get('edocResource/getListSizeByEdocType',_params,'',cmp.extend({},options))}, 
        
             canStepBack :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/canStepBack',_params,_body,cmp.extend({},options))}, 
        
             signed :  function(_params,options){return SeeyonApi.Rest.get('edocResource/signed',_params,'',cmp.extend({},options))}, 
        
             transfer :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/transfer',_params,_body,cmp.extend({},options))}, 
        
             trackValue :  function(_params,options){return SeeyonApi.Rest.get('edocResource/trackValue',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Workflow : {
             getWorkflowXMLData :  function(_params,options){return SeeyonApi.Rest.get('workflow/processXml',_params,'',cmp.extend({},options))}, 
        
             lockH5Workflow :  function(_params,options){return SeeyonApi.Rest.get('workflow/lockH5Workflow',_params,'',cmp.extend({},options))}, 
        
             addNode :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/addNode',_params,_body,cmp.extend({},options))}, 
        
           
             transBeforeInvokeWorkFlow :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/transBeforeInvokeWorkFlow',_params,_body,cmp.extend({},options))}, 
        
             canWorkflowCurrentNodeSubmit :  function(_params,options){return SeeyonApi.Rest.get('workflow/canWorkflowCurrentNodeSubmit',_params,'',cmp.extend({},options))}, 
        
             canBatchDelete :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/canBatchDelete',_params,_body,cmp.extend({},options))}, 
        
             deleteNode :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/deleteNode',_params,_body,cmp.extend({},options))}, 
        
             freeReplaceNode :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/freeReplaceNode',_params,_body,cmp.extend({},options))}, 
        
             getAcountExcludeElements :  function(_params,options){return SeeyonApi.Rest.get('workflow/accountExcludeElements',_params,'',cmp.extend({},options))}, 
        
             canTakeBack :  function(_params,options){return SeeyonApi.Rest.get('workflow/canTakeBack',_params,'',cmp.extend({},options))}, 
        
             executeWorkflowBeforeEvent :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/executeWorkflowBeforeEvent',_params,_body,cmp.extend({},options))}, 
        
             getProcessXmlandJson :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/processXmlandJson',_params,_body,cmp.extend({},options))}, 
        
             freeChangeNodeProperty :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/freeChangeNodeProperty',_params,_body,cmp.extend({},options))}, 
        
             getWorkflowDiagramData :  function(_params,options){return SeeyonApi.Rest.get('workflow/diagramdata',_params,'',cmp.extend({},options))}, 
        
             preDeleteNodeFromDiagram :  function(_params,options){return SeeyonApi.Rest.get('workflow/preDeleteNodeFromDiagram',_params,'',cmp.extend({},options))}, 
        
             unLockH5Workflow :  function(_params,options){return SeeyonApi.Rest.get('workflow/unLockH5Workflow',_params,'',cmp.extend({},options))}, 
        
             freeDeleteNode :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/freeDeleteNode',_params,_body,cmp.extend({},options))}, 
        
             canChangeNode :  function(_params,options){return SeeyonApi.Rest.get('workflow/canChangeNode',_params,'',cmp.extend({},options))}, 
        
             multiSignDeptMembers :  function(_params,options){return SeeyonApi.Rest.get('workflow/multiSignDeptMembers',_params,'',cmp.extend({},options))}, 
        
             validateCurrentSelectedNode :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/validateCurrentSelectedNode',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    BbsList : {
           
             getBbsList :  function(_params,_body,options){return SeeyonApi.Rest.post('bbsList',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    M3contacts : {
             showPeopleCard :  function(memberId,_params,options){return SeeyonApi.Rest.get('m3/contacts/showPeopleCard/'+memberId+'',_params,'',cmp.extend({},options))}, 
        
             getAllAccounts :  function(_params,options){return SeeyonApi.Rest.get('m3/contacts/accounts',_params,'',cmp.extend({},options))}, 
        
             isConcernedMember :  function(memberId,_params,options){return SeeyonApi.Rest.get('m3/contacts/concern/isconcerned/'+memberId+'',_params,'',cmp.extend({},options))}, 
        
           
             getDepartmentsByAccountId :  function(accountId,_params,options){return SeeyonApi.Rest.get('m3/contacts/account/departments/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             getWaterMark :  function(_params,options){return SeeyonApi.Rest.get('m3/contacts/offline/waterMark',_params,'',cmp.extend({},options))}, 
        
             getMember :  function(memberId,_params,options){return SeeyonApi.Rest.get('m3/contacts/member/'+memberId+'',_params,'',cmp.extend({},options))}, 
        
             getChildrenByDepartmentId :  function(departmentId,pageNo,pageSize,_params,options){return SeeyonApi.Rest.get('m3/contacts/department/children/'+departmentId+'/'+pageNo+'/'+pageSize+'',_params,'',cmp.extend({},options))}, 
        
             cancelConcernMember :  function(memberId,_params,options){return SeeyonApi.Rest.get('m3/contacts/concern/cancelConcernMember/'+memberId+'',_params,'',cmp.extend({},options))}, 
        
             getAddressBookSetting :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/contacts/offline/accountSet',_params,_body,cmp.extend({},options))}, 
        
             offline :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/contacts/offline/prepare',_params,_body,cmp.extend({},options))}, 
        
             saveConcernMember :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/contacts/concern/saveConcernMember',_params,_body,cmp.extend({},options))}, 
        
             searchMembers :  function(accountId,pageNo,pageSize,_params,_body,options){return SeeyonApi.Rest.post('m3/contacts/account/search/'+accountId+'/'+pageNo+'/'+pageSize+'',_params,_body,cmp.extend({},options))}, 
        
             getAccount :  function(accountId,_params,options){return SeeyonApi.Rest.get('m3/contacts/account/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             getMembersMapByAccountId :  function(accountId,_params,options){return SeeyonApi.Rest.get('m3/contacts/memberMaps/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             getAllConcernMember :  function(_params,options){return SeeyonApi.Rest.get('m3/contacts/concern/getAllConcernMember',_params,'',cmp.extend({},options))}, 
        
             checkOk :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/contacts/offline/check',_params,_body,cmp.extend({},options))}, 
        
             getConcernMember :  function(pageNo,pageSize,_params,options){return SeeyonApi.Rest.get('m3/contacts/concern/getConcernMember/'+pageNo+'/'+pageSize+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Pojo : {
           
             updatePojo :  function(id,_params,_body,options){return SeeyonApi.Rest.put('pojo/'+id+'',_params,_body,cmp.extend({},options))}, 
        
             getPojo :  function(id,_params,options){return SeeyonApi.Rest.get('pojo/'+id+'',_params,'',cmp.extend({},options))}, 
        
             createPojo :  function(_params,_body,options){return SeeyonApi.Rest.post('pojo',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Inquiries : {
           
             inquiriesList :  function(_params,_body,options){return SeeyonApi.Rest.post('inquiries',_params,_body,cmp.extend({},options))}, 
        
             startInquiryList :  function(_params,_body,options){return SeeyonApi.Rest.post('inquiries/iStarted',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Task : {
             getCurrentUser :  function(_params,_body,options){return SeeyonApi.Rest.post('task/currentUser',_params,_body,cmp.extend({},options))}, 
        
           
             taskFeedback :  function(taskId,_params,_body,options){return SeeyonApi.Rest.post('task/'+taskId+'/feedback',_params,_body,cmp.extend({},options))}, 
        
             updateTaskStatus :  function(_params,_body,options){return SeeyonApi.Rest.post('task/updateTaskStatus',_params,_body,cmp.extend({},options))}, 
        
             removeTaskById :  function(taskId,_params,options){return SeeyonApi.Rest.get('task/remove/'+taskId+'',_params,'',cmp.extend({},options))}, 
        
             taskHasten :  function(taskId,_params,_body,options){return SeeyonApi.Rest.post('task/'+taskId+'/hasten',_params,_body,cmp.extend({},options))}, 
        
             initCondition :  function(_params,options){return SeeyonApi.Rest.get('task/initCondition',_params,'',cmp.extend({},options))}, 
        
             getTaskDetail :  function(taskId,_params,options){return SeeyonApi.Rest.get('task/'+taskId+'/detail',_params,'',cmp.extend({},options))}, 
        
             updateTask :  function(_params,_body,options){return SeeyonApi.Rest.post('task/update',_params,_body,cmp.extend({},options))}, 
        
             getTaskById :  function(taskId,_params,options){return SeeyonApi.Rest.get('task/'+taskId+'',_params,'',cmp.extend({},options))}, 
        
             saveFeedBack :  function(_params,_body,options){return SeeyonApi.Rest.post('task/saveFeedBack',_params,_body,cmp.extend({},options))}, 
        
             taskComment :  function(taskId,_params,_body,options){return SeeyonApi.Rest.post('task/'+taskId+'/comment',_params,_body,cmp.extend({},options))}, 
        
             audit :  function(_params,_body,options){return SeeyonApi.Rest.post('task/audit',_params,_body,cmp.extend({},options))}, 
        
             updateTask4M3 :  function(taskId,_params,_body,options){return SeeyonApi.Rest.post('task/'+taskId+'/update',_params,_body,cmp.extend({},options))}, 
        
             createTask :  function(_params,_body,options){return SeeyonApi.Rest.post('task/add',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Cmpteams4M3 : {
             getCmpTeamMembers :  function(teamid,_params,options){return SeeyonApi.Rest.get('cmpteams4M3/teammembers/'+teamid+'',_params,'',cmp.extend({},options))}, 
        
             getCmpTeams :  function(_params,options){return SeeyonApi.Rest.get('cmpteams4M3',_params,'',cmp.extend({},options))}, 
        
           
        
    },
    
    Lbs : {
             getlbsinfo :  function(_params,_body,options){return SeeyonApi.Rest.post('lbs/getlbs',_params,_body,cmp.extend({},options))}, 
        
           
             savelbsinfo :  function(_params,_body,options){return SeeyonApi.Rest.post('lbs/savelbs',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Cmpmembers4M3 : {
             getCmpExtMembers :  function(deptId,_params,options){return SeeyonApi.Rest.get('cmpmembers4M3/extmembers/'+deptId+'',_params,'',cmp.extend({},options))}, 
        
           
             getCurrentUserMemberType :  function(_params,options){return SeeyonApi.Rest.get('cmpmembers4M3/type',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Coll : {
             findWaitSentAffairs :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/waitSentAffairs',_params,_body,cmp.extend({},options))}, 
        
             takeBack :  function(_params,options){return SeeyonApi.Rest.get('coll/takeBack',_params,'',cmp.extend({},options))}, 
        
             finishWorkItem :  function(affairId,_params,_body,options){return SeeyonApi.Rest.post('coll/finishWorkItem/'+affairId+'',_params,_body,cmp.extend({},options))}, 
        
             findPendingAffairs :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/pendingAffairs',_params,_body,cmp.extend({},options))}, 
        
             logJs :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/logJs',_params,_body,cmp.extend({},options))}, 
        
             getSenderAffairId :  function(objectId,_params,options){return SeeyonApi.Rest.get('coll/getSenderAffairId/'+objectId+'',_params,'',cmp.extend({},options))}, 
        
             checkCollTemplate :  function(_params,options){return SeeyonApi.Rest.get('coll/checkCollTemplate',_params,'',cmp.extend({},options))}, 
        
             getTrackInfo :  function(affairId,_params,options){return SeeyonApi.Rest.get('coll/trackInfo/'+affairId+'',_params,'',cmp.extend({},options))}, 
        
             getColQuoteCounts :  function(_params,options){return SeeyonApi.Rest.get('coll/colQuoteCounts',_params,'',cmp.extend({},options))}, 
        
             sendByRobot :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/sendByRobot',_params,_body,cmp.extend({},options))}, 
        
             showNodeMembers :  function(_params,options){return SeeyonApi.Rest.get('coll/node/members',_params,'',cmp.extend({},options))}, 
        
             getSelfCollConfig :  function(_params,options){return SeeyonApi.Rest.get('coll/getSelfCollConfig',_params,'',cmp.extend({},options))}, 
        
             permissions :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/permissions',_params,_body,cmp.extend({},options))}, 
        
             doZCDB :  function(affairId,_params,_body,options){return SeeyonApi.Rest.post('coll/doZCDB/'+affairId+'',_params,_body,cmp.extend({},options))}, 
        
             doBatchStepbackColl :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/batch/doBatchStepbackColl',_params,_body,cmp.extend({},options))}, 
        
             saveOrUpdate :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/saveOrUpdate',_params,_body,cmp.extend({},options))}, 
        
             pushMessageToMembersList :  function(_params,options){return SeeyonApi.Rest.get('coll/pushMsgMembers',_params,'',cmp.extend({},options))}, 
        
             selfCollMore :  function(_params,options){return SeeyonApi.Rest.get('coll/selfCollMore',_params,'',cmp.extend({},options))}, 
        
             likeComment :  function(commentId,_params,options){return SeeyonApi.Rest.get('coll/comment/like/'+commentId+'',_params,'',cmp.extend({},options))}, 
        
             lockCollForm :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/lockCollForm',_params,_body,cmp.extend({},options))}, 
        
             collUserPrivMenuAndQuoteCounts :  function(_params,options){return SeeyonApi.Rest.get('coll/collaboration/user/privMenuAndQuoteCounts',_params,'',cmp.extend({},options))}, 
        
             updateLockTime :  function(_params,options){return SeeyonApi.Rest.get('coll/updateLockTime',_params,'',cmp.extend({},options))}, 
        
             multiCall :  function(_params,options){return SeeyonApi.Rest.get('coll/multiCall',_params,'',cmp.extend({},options))}, 
        
             transRepal :  function(affairId,_params,_body,options){return SeeyonApi.Rest.post('coll/transRepeal/'+affairId+'',_params,_body,cmp.extend({},options))}, 
        
             transfer :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/transfer',_params,_body,cmp.extend({},options))}, 
        
             getDataRelationByDR :  function(_params,options){return SeeyonApi.Rest.get('coll/getDataRelationByDR',_params,'',cmp.extend({},options))}, 
        
             doBatchColl :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/batch/doBatchColl',_params,_body,cmp.extend({},options))}, 
        
             collaborationUserPeivMenu :  function(_params,options){return SeeyonApi.Rest.get('coll/collaboration/user/privMenu',_params,'',cmp.extend({},options))}, 
        
             transPigeonhole :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/transPigeonhole',_params,_body,cmp.extend({},options))}, 
        
             send :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/send',_params,_body,cmp.extend({},options))}, 
        
             doBatchTerminateColl :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/batch/doBatchTerminateColl',_params,_body,cmp.extend({},options))}, 
        
             forwardParams :  function(_params,options){return SeeyonApi.Rest.get('coll/forwardParams',_params,'',cmp.extend({},options))}, 
        
             attachments :  function(summaryId,attType,_params,options){return SeeyonApi.Rest.get('coll/attachments/'+summaryId+'/'+attType+'',_params,'',cmp.extend({},options))}, 
        
             checkTemplateCanUse :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/checkTemplateCanUse',_params,_body,cmp.extend({},options))}, 
        
             hasten :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/hasten',_params,_body,cmp.extend({},options))}, 
        
             checkAffairValid :  function(_params,options){return SeeyonApi.Rest.get('coll/checkAffairValid',_params,'',cmp.extend({},options))}, 
        
             doBatchRepealColl :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/batch/doBatchRepealColl',_params,_body,cmp.extend({},options))}, 
        
             isTemplateDeleted :  function(_params,options){return SeeyonApi.Rest.get('coll/forward/check/template',_params,'',cmp.extend({},options))}, 
        
             stepStop :  function(affairId,_params,_body,options){return SeeyonApi.Rest.post('coll/stepStop/'+affairId+'',_params,_body,cmp.extend({},options))}, 
        
             cancelFavoriteAffair :  function(_params,options){return SeeyonApi.Rest.get('coll/cancelFavoriteAffair',_params,'',cmp.extend({},options))}, 
        
             transColForward :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/transColForward',_params,_body,cmp.extend({},options))}, 
        
             stepBack :  function(affairId,_params,_body,options){return SeeyonApi.Rest.post('coll/stepBack/'+affairId+'',_params,_body,cmp.extend({},options))}, 
        
             findDoneAffairs :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/doneAffairs',_params,_body,cmp.extend({},options))}, 
        
             updateAppointStepBack :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/updateAppointStepBack',_params,_body,cmp.extend({},options))}, 
        
             sendImmediate :  function(affairId,_params,_body,options){return SeeyonApi.Rest.post('coll/sendImmediate/'+affairId+'',_params,_body,cmp.extend({},options))}, 
        
             saveDraft :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/saveDraft',_params,_body,cmp.extend({},options))}, 
        
             checkCanDelete :  function(_params,options){return SeeyonApi.Rest.get('coll/checkCanDelete',_params,'',cmp.extend({},options))}, 
        
             repeal :  function(affairId,_params,_body,options){return SeeyonApi.Rest.post('coll/repeal/'+affairId+'',_params,_body,cmp.extend({},options))}, 
        
             newColl :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/new',_params,_body,cmp.extend({},options))}, 
        
             unlockCollAll :  function(_params,options){return SeeyonApi.Rest.get('coll/unlockCollAll',_params,'',cmp.extend({},options))}, 
        
             checkPreBatch :  function(_params,options){return SeeyonApi.Rest.get('coll/batch/checkPreBatch',_params,'',cmp.extend({},options))}, 
        
             summary :  function(openFrom,affairId,summaryId,_params,options){return SeeyonApi.Rest.get('coll/summary/'+openFrom+'/'+affairId+'/'+summaryId+'',_params,'',cmp.extend({},options))}, 
        
             transStepBackValid :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/transStepBackValid',_params,_body,cmp.extend({},options))}, 
        
             getColQuotes :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/colQuotes',_params,_body,cmp.extend({},options))}, 
        
           
             getCollListByRobot :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/getCollListByRobot',_params,_body,cmp.extend({},options))}, 
        
             findSentAffairs :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/sentAffairs',_params,_body,cmp.extend({},options))}, 
        
             templateSendMore :  function(_params,options){return SeeyonApi.Rest.get('coll/templateSendMore',_params,'',cmp.extend({},options))}, 
        
             checkForwardPermission :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/check/forward',_params,_body,cmp.extend({},options))}, 
        
             getPigeonholeRight :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/getPigeonholeRight',_params,_body,cmp.extend({},options))}, 
        
             getByDataRelationIds :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/getByDataRelationIds',_params,_body,cmp.extend({},options))}, 
        
             favoriteAffair :  function(_params,options){return SeeyonApi.Rest.get('coll/favoriteAffair',_params,'',cmp.extend({},options))}, 
        
             commentsCount :  function(summaryId,_params,options){return SeeyonApi.Rest.get('coll/commentsCount/'+summaryId+'',_params,'',cmp.extend({},options))}, 
        
             templateDealMore :  function(_params,options){return SeeyonApi.Rest.get('coll/templateDealMore',_params,'',cmp.extend({},options))}, 
        
             handlers :  function(type,summaryId,_params,options){return SeeyonApi.Rest.get('coll/handlers/'+type+'/'+summaryId+'',_params,'',cmp.extend({},options))}, 
        
             summaryComment :  function(type,summaryId,_params,options){return SeeyonApi.Rest.get('coll/comments/'+type+'/'+summaryId+'',_params,'',cmp.extend({},options))}, 
        
             getIsSamePigeonhole :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/getIsSamePigeonhole',_params,_body,cmp.extend({},options))}, 
        
             newCollaborationPolicy :  function(_params,options){return SeeyonApi.Rest.get('coll/newCollaborationPolicy',_params,'',cmp.extend({},options))}, 
        
             checkOperation :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/batch/checkOperation',_params,_body,cmp.extend({},options))}, 
        
             projectMore :  function(_params,options){return SeeyonApi.Rest.get('coll/projectMore',_params,'',cmp.extend({},options))}, 
        
             getCollProcessXmlandJson :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/getCollProcessXmlandJson',_params,_body,cmp.extend({},options))}, 
        
             comment :  function(summaryId,_params,_body,options){return SeeyonApi.Rest.post('coll/comment/'+summaryId+'',_params,_body,cmp.extend({},options))}, 
        
             checkAffairAndLock4NewCol :  function(_params,options){return SeeyonApi.Rest.get('coll/check/send',_params,'',cmp.extend({},options))}, 
        
             transRepalValid :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/transRepalValid',_params,_body,cmp.extend({},options))}, 
        
             deleteAffairs :  function(from,affairIds,_params,options){return SeeyonApi.Rest.get('coll/deleteAffairs/'+from+'/'+affairIds+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    CommonPhrase : {
           
             phrases :  function(_params,options){return SeeyonApi.Rest.get('commonPhrase/phrases',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Book : {
             findBookAudits :  function(_params,_body,options){return SeeyonApi.Rest.post('book/audits',_params,_body,cmp.extend({},options))}, 
        
             bookAuditCheck :  function(_params,_body,options){return SeeyonApi.Rest.post('book/auditCheck',_params,_body,cmp.extend({},options))}, 
        
           
             bookAuditInfo :  function(_params,_body,options){return SeeyonApi.Rest.post('book/auditInfo',_params,_body,cmp.extend({},options))}, 
        
             bookAuditSubmit :  function(_params,_body,options){return SeeyonApi.Rest.post('book/auditSubmit',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Show : {
             getAvatarImageUrl :  function(memberId,_params,options){return SeeyonApi.Rest.get('show/avatar/url/'+memberId+'',_params,'',cmp.extend({},options))}, 
        
             setShowpostTop :  function(showbarId,showpostId,_params,_body,options){return SeeyonApi.Rest.post('show/showpost/top/'+showbarId+'/'+showpostId+'',_params,_body,cmp.extend({},options))}, 
        
           
             getCommentNum :  function(showpostId,_params,options){return SeeyonApi.Rest.get('show/showpost/comment/num/'+showpostId+'',_params,'',cmp.extend({},options))}, 
        
             addViewTimes :  function(showbarId,_params,_body,options){return SeeyonApi.Rest.post('show/showbar/viewtimes/add/'+showbarId+'',_params,_body,cmp.extend({},options))}, 
        
             removeShowbar :  function(showbarId,_params,_body,options){return SeeyonApi.Rest.post('show/showbar/remove/'+showbarId+'',_params,_body,cmp.extend({},options))}, 
        
             getFirstCreateShowbar :  function(_params,options){return SeeyonApi.Rest.get('show/showbar/firstCreateShowbar',_params,'',cmp.extend({},options))}, 
        
             showpostLike :  function(showpostId,_params,options){return SeeyonApi.Rest.get('show/showpost/like/'+showpostId+'',_params,'',cmp.extend({},options))}, 
        
             removeShowpost :  function(showpostId,_params,_body,options){return SeeyonApi.Rest.post('show/showpost/remove/'+showpostId+'',_params,_body,cmp.extend({},options))}, 
        
             saveShowpostInfo :  function(_params,_body,options){return SeeyonApi.Rest.post('show/showpost/save',_params,_body,cmp.extend({},options))}, 
        
             saveComment :  function(_params,_body,options){return SeeyonApi.Rest.post('show/showpost/comment',_params,_body,cmp.extend({},options))}, 
        
             hasShowBarExist :  function(showbarId,_params,options){return SeeyonApi.Rest.get('show/showbar/check/exist/'+showbarId+'',_params,'',cmp.extend({},options))}, 
        
             transferShow :  function(showpostId,showbarId,_params,_body,options){return SeeyonApi.Rest.post('show/showpost/transfer/'+showpostId+'/'+showbarId+'',_params,_body,cmp.extend({},options))}, 
        
             checkRepeatName :  function(_params,_body,options){return SeeyonApi.Rest.post('show/showbar/check/repeatName',_params,_body,cmp.extend({},options))}, 
        
             getShowauth :  function(_params,options){return SeeyonApi.Rest.get('show/show/showauth',_params,'',cmp.extend({},options))}, 
        
             cancelShowpostTop :  function(showbarId,showpostId,_params,_body,options){return SeeyonApi.Rest.post('show/showpost/top/cancel/'+showbarId+'/'+showpostId+'',_params,_body,cmp.extend({},options))}, 
        
             hasGroupAuth :  function(_params,options){return SeeyonApi.Rest.get('show/hasGroupAuth',_params,'',cmp.extend({},options))}, 
        
             cancelShowbarTop :  function(showbarId,_params,_body,options){return SeeyonApi.Rest.post('show/showbar/top/cancel/'+showbarId+'',_params,_body,cmp.extend({},options))}, 
        
             getShowbarDetail :  function(showbarId,_params,options){return SeeyonApi.Rest.get('show/showbar/'+showbarId+'',_params,'',cmp.extend({},options))}, 
        
             saveShowbarInfo :  function(_params,_body,options){return SeeyonApi.Rest.post('show/showbar/save',_params,_body,cmp.extend({},options))}, 
        
             removeComment :  function(showpostId,replyId,_params,_body,options){return SeeyonApi.Rest.post('show/showpost/comment/remove/'+showpostId+'/'+replyId+'',_params,_body,cmp.extend({},options))}, 
        
             getShowThreeList :  function(_params,_body,options){return SeeyonApi.Rest.post('show/getShowThreeList',_params,_body,cmp.extend({},options))}, 
        
             uploadImages :  function(_params,_body,options){return SeeyonApi.Rest.post('show/uploadImages',_params,_body,cmp.extend({},options))}, 
        
             setShowbarTop :  function(showbarId,_params,_body,options){return SeeyonApi.Rest.post('show/showbar/top/'+showbarId+'',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    OrgPosts : {
             getEntitiesCount :  function(accountId,_params,options){return SeeyonApi.Rest.get('orgPosts/count/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
           
             getAllEntitiesCount :  function(accountId,_params,options){return SeeyonApi.Rest.get('orgPosts/all/count/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             getEntities :  function(accountId,_params,options){return SeeyonApi.Rest.get('orgPosts/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             getAllEntities :  function(accountId,_params,options){return SeeyonApi.Rest.get('orgPosts/all/'+accountId+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    M3RegisterResource : {
           
             getRegister :  function(registerId,_params,options){return SeeyonApi.Rest.get('m3RegisterResource/getRegister/'+registerId+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Excelreport : {
           
             detail :  function(_params,_body,options){return SeeyonApi.Rest.post('excelreport/detail',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Cip : {
             receiveGetAdmin :  function(ticket,_params,options){return SeeyonApi.Rest.get('cip/getAdmin/'+ticket+'',_params,'',cmp.extend({},options))}, 
        
           
        
    },
    
    Cmporgnization4M3 : {
             getAllAccounts :  function(_params,options){return SeeyonApi.Rest.get('cmporgnization4M3/getAllAccounts',_params,'',cmp.extend({},options))}, 
        
             getCurrentUser :  function(_params,options){return SeeyonApi.Rest.get('cmporgnization4M3/currentUser',_params,'',cmp.extend({},options))}, 
        
           
             getVjoinUnitsByAccountIdWithoutlevelscope :  function(_params,options){return SeeyonApi.Rest.get('cmporgnization4M3/firstlevelVjoinUnitsWithoutlevelscope',_params,'',cmp.extend({},options))}, 
        
             searchentitieswithoutlevelscope :  function(_params,_body,options){return SeeyonApi.Rest.post('cmporgnization4M3/searchentitieswithoutlevelscope',_params,_body,cmp.extend({},options))}, 
        
             getChildAccount :  function(id,_params,options){return SeeyonApi.Rest.get('cmporgnization4M3/getChildAccount/'+id+'',_params,'',cmp.extend({},options))}, 
        
             getAccounts :  function(_params,options){return SeeyonApi.Rest.get('cmporgnization4M3/firstlevelaccount',_params,'',cmp.extend({},options))}, 
        
             getCmpOrganization :  function(_params,options){return SeeyonApi.Rest.get('cmporgnization4M3',_params,'',cmp.extend({},options))}, 
        
             checkLevelScope :  function(memberId,_params,options){return SeeyonApi.Rest.get('cmporgnization4M3/checkLevelScope/'+memberId+'',_params,'',cmp.extend({},options))}, 
        
             getDeptByAccountIdWithoutlevelscope :  function(_params,options){return SeeyonApi.Rest.get('cmporgnization4M3/firstleveldeptsWithoutlevelscope',_params,'',cmp.extend({},options))}, 
        
             getDeptByAccountId :  function(_params,options){return SeeyonApi.Rest.get('cmporgnization4M3/firstleveldepts',_params,'',cmp.extend({},options))}, 
        
             getVjoinUnitsByAccountId :  function(_params,options){return SeeyonApi.Rest.get('cmporgnization4M3/firstlevelVjoinUnits',_params,'',cmp.extend({},options))}, 
        
             getPeopleCardInfo :  function(mId,_params,options){return SeeyonApi.Rest.get('cmporgnization4M3/peopleCard/'+mId+'',_params,'',cmp.extend({},options))}, 
        
             getCmpExtAccounts :  function(_params,options){return SeeyonApi.Rest.get('cmporgnization4M3/extAccounts',_params,'',cmp.extend({},options))}, 
        
             saveCustomOrgRecent :  function(_params,_body,options){return SeeyonApi.Rest.post('cmporgnization4M3/saveCustomOrgRecent',_params,_body,cmp.extend({},options))}, 
        
             searchEntity :  function(_params,_body,options){return SeeyonApi.Rest.post('cmporgnization4M3/searchentities',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Security : {
           
             getCsrfToken :  function(_params,_body,options){return SeeyonApi.Rest.post('security/csrf/token',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Shortcut : {
           
             getPortletTipNumber :  function(_params,_body,options){return SeeyonApi.Rest.post('shortcut/tipNumber',_params,_body,cmp.extend({},options))}, 
        
             getShortCutByEntityId :  function(sourceValue,_params,options){return SeeyonApi.Rest.get('shortcut/portlets/'+sourceValue+'',_params,'',cmp.extend({},options))}, 
        
             saveShortCut :  function(_params,_body,options){return SeeyonApi.Rest.post('shortcut/saveShortCut',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Attachment : {
             download :  function(fileId,_params,options){return SeeyonApi.Rest.get('attachment/file/'+fileId+'',_params,'',cmp.extend({'Accept' : 'application/octet-stream'},options))}, 
        
             listAttachments :  function(reference,_params,options){return SeeyonApi.Rest.get('attachment/reference/'+reference+'',_params,'',cmp.extend({},options))}, 
        
             upload :  function(_params,_body,options){return SeeyonApi.Rest.post('attachment',_params,_body,cmp.extend({},options))}, 
        
           
             deleteFileForUc :  function(fileId,_params,options){return SeeyonApi.Rest.get('attachment/removeFile/'+fileId+'',_params,'',cmp.extend({},options))}, 
        
             getAttachmentById :  function(attachmentId,_params,options){return SeeyonApi.Rest.get('attachment/'+attachmentId+'',_params,'',cmp.extend({},options))}, 
        
             downloadForUc :  function(fileId,_params,options){return SeeyonApi.Rest.get('attachment/fileforuc/'+fileId+'',_params,'',cmp.extend({'Accept' : 'application/octet-stream'},options))} 
        
        
    },
    
    M3config : {
             getUcCofing :  function(_params,options){return SeeyonApi.Rest.get('m3/config/uc',_params,'',cmp.extend({},options))}, 
        
             getConnectMode :  function(_params,options){return SeeyonApi.Rest.get('m3/config/connectmode',_params,'',cmp.extend({},options))}, 
        
             saveUserMessageSetting :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/config/user/message/setting',_params,_body,cmp.extend({},options))}, 
        
           
             getUserMessageSettingList :  function(_params,options){return SeeyonApi.Rest.get('m3/config/user/message/setting/list',_params,'',cmp.extend({},options))}, 
        
             getUserNewMessageSetting :  function(_params,options){return SeeyonApi.Rest.get('m3/config/user/new/message/settings',_params,'',cmp.extend({},options))}, 
        
             saveUserNewMessageSetting :  function(_params,_body,options){return SeeyonApi.Rest.post('m3/config/user/new/message/setting',_params,_body,cmp.extend({},options))}, 
        
             getUserMessageSetting :  function(appId,_params,options){return SeeyonApi.Rest.get('m3/config/user/message/setting/'+appId+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Cmpposts : {
             getCmpPosts :  function(accountid,_params,options){return SeeyonApi.Rest.get('cmpposts/'+accountid+'',_params,'',cmp.extend({},options))}, 
        
           
             getCmpPostMembers :  function(postid,_params,options){return SeeyonApi.Rest.get('cmpposts/postmembers/'+postid+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    CmpNewsList : {
             newsList :  function(_params,_body,options){return SeeyonApi.Rest.post('cmpNewsList',_params,_body,cmp.extend({},options))}, 
        
           
             getCountByReadState :  function(readState,_params,options){return SeeyonApi.Rest.get('cmpNewsList/count/'+readState+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    JoinOrgPost : {
             deletePost :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgPost/remove',_params,_body,cmp.extend({},options))}, 
        
             getPostInfo :  function(postid,_params,options){return SeeyonApi.Rest.get('joinOrgPost/info/'+postid+'',_params,'',cmp.extend({},options))}, 
        
             updatePost :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgPost/update',_params,_body,cmp.extend({},options))}, 
        
           
             getAccountList :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgPost/posts',_params,_body,cmp.extend({},options))}, 
        
             addPost :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgPost/add',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    ExternalMembers : {
             getExternalAccountMembers :  function(externalAccountId,_params,options){return SeeyonApi.Rest.get('externalMembers/externalAccountId/'+externalAccountId+'',_params,'',cmp.extend({},options))}, 
        
             getAccountExternalMembers :  function(accountId,_params,options){return SeeyonApi.Rest.get('externalMembers/accountId/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
             deleteExternalMembers :  function(externalMemberId,_params,_body,options){return SeeyonApi.Rest.del('externalMembers/'+externalMemberId+'',_params,_body,cmp.extend({},options))}, 
        
           
             creatExternalMembers :  function(_params,_body,options){return SeeyonApi.Rest.post('externalMembers',_params,_body,cmp.extend({},options))}, 
        
             getExternalMembersByLoginName :  function(loginName,_params,options){return SeeyonApi.Rest.get('externalMembers/loginName/'+loginName+'',_params,'',cmp.extend({},options))}, 
        
             getExternalMembersById :  function(externalMemberId,_params,options){return SeeyonApi.Rest.get('externalMembers/externalMemberId/'+externalMemberId+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Bpm : {
             takeBack :  function(_params,_body,options){return SeeyonApi.Rest.post('bpm/workitem/takeback',_params,_body,cmp.extend({},options))}, 
        
             addNode :  function(_params,_body,options){return SeeyonApi.Rest.post('bpm/process/addNode',_params,_body,cmp.extend({},options))}, 
        
             startProcess :  function(_params,_body,options){return SeeyonApi.Rest.post('bpm/process/start',_params,_body,cmp.extend({},options))}, 
        
           
             deleteNode :  function(_params,_body,options){return SeeyonApi.Rest.post('bpm/process/deleteNode',_params,_body,cmp.extend({},options))}, 
        
             freeReplaceNode :  function(_params,_body,options){return SeeyonApi.Rest.post('bpm/process/freeReplaceNode',_params,_body,cmp.extend({},options))}, 
        
             diagramImg2 :  function(_params,_body,options){return SeeyonApi.Rest.post('bpm/process/diagramImg2',_params,_body,cmp.extend({},options))}, 
        
             stepBack :  function(_params,_body,options){return SeeyonApi.Rest.post('bpm/workitem/stepBack',_params,_body,cmp.extend({},options))}, 
        
             getProcessStatus :  function(_params,_body,options){return SeeyonApi.Rest.post('bpm/process/status',_params,_body,cmp.extend({},options))}, 
        
             diagram :  function(_params,_body,options){return SeeyonApi.Rest.post('bpm/process/diagram',_params,_body,cmp.extend({},options))}, 
        
             getProcessDefinition :  function(_params,options){return SeeyonApi.Rest.get('bpm/template/definition',_params,'',cmp.extend({},options))}, 
        
             stop :  function(_params,_body,options){return SeeyonApi.Rest.post('bpm/process/stop',_params,_body,cmp.extend({},options))}, 
        
             finishWorkitem :  function(_params,_body,options){return SeeyonApi.Rest.post('bpm/workitem/finish',_params,_body,cmp.extend({},options))}, 
        
             diagramImg :  function(_params,options){return SeeyonApi.Rest.get('bpm/process/diagramImg',_params,'',cmp.extend({'Accept' : 'application/octet-stream'},options))}, 
        
             replaceItem :  function(_params,_body,options){return SeeyonApi.Rest.post('bpm/process/replaceItem',_params,_body,cmp.extend({},options))}, 
        
             repeal :  function(_params,_body,options){return SeeyonApi.Rest.post('bpm/process/repeal',_params,_body,cmp.extend({},options))}, 
        
             specifyBack :  function(_params,_body,options){return SeeyonApi.Rest.post('bpm/workitem/specifyback',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    M3AppResource : {
           
             getNeedUpdateInfo :  function(appId,version,_params,options){return SeeyonApi.Rest.get('m3AppResource/needUpdate/'+appId+'/'+version+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Authentication : {
             sendSms :  function(loginName,_params,_body,options){return SeeyonApi.Rest.post('authentication/sms/'+loginName+'',_params,_body,cmp.extend({},options))}, 
        
           
             captcha :  function(_params,options){return SeeyonApi.Rest.get('authentication/captcha',_params,'',cmp.extend({'Accept' : 'image/jpeg'},options))}, 
        
             loginnamCconversion :  function(loginName,_params,options){return SeeyonApi.Rest.get('authentication/loginName/conversion/'+loginName+'',_params,'',cmp.extend({},options))}, 
        
             ldapAuthentication :  function(_params,_body,options){return SeeyonApi.Rest.post('authentication/ldap',_params,_body,cmp.extend({},options))}, 
        
             isSmsLoginEnabled :  function(loginName,_params,options){return SeeyonApi.Rest.get('authentication/sms/required/'+loginName+'',_params,'',cmp.extend({},options))}, 
        
             check :  function(_params,_body,options){return SeeyonApi.Rest.post('authentication',_params,_body,cmp.extend({},options))}, 
        
             ucpcLogin :  function(_params,_body,options){return SeeyonApi.Rest.post('authentication/ucpcLogin',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Affairs : {
             getTrackListByMemberCode :  function(memberCode,_params,options){return SeeyonApi.Rest.get('affairs/track/code/'+memberCode+'',_params,'',cmp.extend({},options))}, 
        
             getSentListByMemberCode :  function(meberCode,_params,options){return SeeyonApi.Rest.get('affairs/sent/code/'+meberCode+'',_params,'',cmp.extend({},options))}, 
        
             getPendingListByApp :  function(_params,options){return SeeyonApi.Rest.get('affairs/pendingbyapp',_params,'',cmp.extend({},options))}, 
        
           
             getDraftList :  function(_params,options){return SeeyonApi.Rest.get('affairs/draft',_params,'',cmp.extend({},options))}, 
        
             getPendingListCountByApp :  function(_params,options){return SeeyonApi.Rest.get('affairs/pendingCountbyapp',_params,'',cmp.extend({},options))}, 
        
             getDoneListByApp :  function(_params,options){return SeeyonApi.Rest.get('affairs/donebyapp',_params,'',cmp.extend({},options))}, 
        
             getPendingList :  function(_params,options){return SeeyonApi.Rest.get('affairs/pending',_params,'',cmp.extend({},options))}, 
        
             getDoneListByMemberCode :  function(memberCode,_params,options){return SeeyonApi.Rest.get('affairs/done/code/'+memberCode+'',_params,'',cmp.extend({},options))}, 
        
             getTrackList :  function(_params,options){return SeeyonApi.Rest.get('affairs/track',_params,'',cmp.extend({},options))}, 
        
             getDoneList :  function(_params,options){return SeeyonApi.Rest.get('affairs/done',_params,'',cmp.extend({},options))}, 
        
             getSentList :  function(_params,options){return SeeyonApi.Rest.get('affairs/sent',_params,'',cmp.extend({},options))}, 
        
             getSuperviseList :  function(_params,options){return SeeyonApi.Rest.get('affairs/supervise',_params,'',cmp.extend({},options))} 
        
        
    },
    
    News : {
             getNewsByTypeId :  function(typeId,_params,options){return SeeyonApi.Rest.get('news/newsType/'+typeId+'',_params,'',cmp.extend({},options))}, 
        
             getNewsTypeByUnitId :  function(unitId,_params,options){return SeeyonApi.Rest.get('news/newsType/unit/'+unitId+'',_params,'',cmp.extend({},options))}, 
        
           
             readNews :  function(userId,newsId,_params,options){return SeeyonApi.Rest.get('news/read/'+userId+'/'+newsId+'',_params,'',cmp.extend({},options))}, 
        
             getNewsById :  function(newsId,_params,options){return SeeyonApi.Rest.get('news/'+newsId+'',_params,'',cmp.extend({},options))}, 
        
             getCountByReadState :  function(readState,userId,_params,options){return SeeyonApi.Rest.get('news/count/'+readState+'/'+userId+'',_params,'',cmp.extend({},options))}, 
        
             getNewsByUnitId :  function(unitId,_params,options){return SeeyonApi.Rest.get('news/unit/'+unitId+'',_params,'',cmp.extend({},options))}, 
        
             addNews :  function(_params,_body,options){return SeeyonApi.Rest.post('news',_params,_body,cmp.extend({},options))}, 
        
             getNewsByUserId :  function(userId,_params,options){return SeeyonApi.Rest.get('news/user/'+userId+'',_params,'',cmp.extend({},options))}, 
        
             getNewsByUserName :  function(loginName,_params,options){return SeeyonApi.Rest.get('news/user/loginName/'+loginName+'',_params,'',cmp.extend({},options))}, 
        
             getNewsCountByUserId :  function(loginName,_params,options){return SeeyonApi.Rest.get('news/count/loginName/'+loginName+'',_params,'',cmp.extend({},options))}, 
        
             getGroupNewsTypes :  function(_params,options){return SeeyonApi.Rest.get('news/newsType/group',_params,'',cmp.extend({},options))}, 
        
             getNewsByUnitCode :  function(unitCode,_params,options){return SeeyonApi.Rest.get('news/unitcode/'+unitCode+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    
    Message : {
             sendMessageByUserId :  function(_params,_body,options){return SeeyonApi.Rest.post('message/userId',_params,_body,cmp.extend({},options))}, 
        
             modifyMessagesIsRead :  function(_params,_body,options){return SeeyonApi.Rest.post('message/isread',_params,_body,cmp.extend({},options))}, 
        
           
             sendMessageByLoginName :  function(_params,_body,options){return SeeyonApi.Rest.post('message/loginName',_params,_body,cmp.extend({},options))}, 
        
             sendMessage :  function(_params,_body,options){return SeeyonApi.Rest.post('message',_params,_body,cmp.extend({},options))}, 
        
             getMessagesById :  function(userId,_params,options){return SeeyonApi.Rest.get('message/all/'+userId+'',_params,'',cmp.extend({},options))}, 
        
             getUnreadMessagesById :  function(userId,_params,options){return SeeyonApi.Rest.get('message/unread/'+userId+'',_params,'',cmp.extend({},options))}, 
        
             getMessagesLinkUrl :  function(linkinfo,_params,options){return SeeyonApi.Rest.get('message/linkurl/'+linkinfo+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Cmplevels4M3 : {
           
             getCmpLevels :  function(_params,options){return SeeyonApi.Rest.get('cmplevels4M3',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Vportal : {
             uploadpackage :  function(_params,_body,options){return SeeyonApi.Rest.post('vportal/uploadpackage',_params,_body,cmp.extend({},options))}, 
        
           
        
    },
    
    CmpBulletins : {
           
             searchByRobot :  function(_params,_body,options){return SeeyonApi.Rest.post('cmpBulletins/searchByRobot',_params,_body,cmp.extend({},options))}, 
        
             bulletinsList :  function(_params,_body,options){return SeeyonApi.Rest.post('cmpBulletins',_params,_body,cmp.extend({},options))}, 
        
             getCountByReadState :  function(readState,_params,options){return SeeyonApi.Rest.get('cmpBulletins/count/'+readState+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    ExternalAccounts : {
             getAllAccounts :  function(accountId,_params,options){return SeeyonApi.Rest.get('externalAccounts/'+accountId+'',_params,'',cmp.extend({},options))}, 
        
           
        
    },
    
    Footprint : {
           
             getCanSearchDateList :  function(_params,_body,options){return SeeyonApi.Rest.post('footprint/canSearchDateList',_params,_body,cmp.extend({},options))}, 
        
             getFootPrintData :  function(item,dateType,_params,_body,options){return SeeyonApi.Rest.post('footprint/footPrintData/'+item+'/'+dateType+'',_params,_body,cmp.extend({},options))}, 
        
             getUseDays :  function(_params,_body,options){return SeeyonApi.Rest.post('footprint/useDays',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    Form : {
             importBusinessFormData :  function(templateCode,_params,_body,options){return SeeyonApi.Rest.post('form/import/'+templateCode+'',_params,_body,cmp.extend({},options))}, 
        
           
             getformdata :  function(summaryIdOrAffairId,_params,options){return SeeyonApi.Rest.get('form/getformdata/'+summaryIdOrAffairId+'',_params,'',cmp.extend({},options))}, 
        
             exportCoordination :  function(affairId,memId,_params,options){return SeeyonApi.Rest.get('form/export/'+affairId+'/'+memId+'',_params,'',cmp.extend({},options))}, 
        
             updateBusinessFormData :  function(_params,_body,options){return SeeyonApi.Rest.put('form/update',_params,_body,cmp.extend({},options))}, 
        
             exportBusinessFormData :  function(templateCode,_params,options){return SeeyonApi.Rest.get('form/export/'+templateCode+'',_params,'',cmp.extend({},options))} 
        
        
    },
    
    M3navbar : {
             getNavBarList :  function(_params,options){return SeeyonApi.Rest.get('m3/navbar/getNavBarList',_params,'',cmp.extend({},options))}, 
        
           
        
    },
    
    EditContent : {
           
             getOfficeAuthKey :  function(_params,_body,options){return SeeyonApi.Rest.post('editContent/getOfficeAuthKey',_params,_body,cmp.extend({},options))}, 
        
             saveFile :  function(_params,_body,options){return SeeyonApi.Rest.post('editContent/saveFile',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    ThirdpartyMessage : {
             receiveListMessage :  function(_params,_body,options){return SeeyonApi.Rest.post('thirdpartyMessage/receive/messageList',_params,_body,cmp.extend({},options))}, 
        
           
             receiveSingleMessage :  function(_params,_body,options){return SeeyonApi.Rest.post('thirdpartyMessage/receive/singleMessage',_params,_body,cmp.extend({},options))} 
        
        
    },
    
    WeixinProduct : {
             saveUserApps :  function(_params,_body,options){return SeeyonApi.Rest.post('weixinProduct/saveUserApps',_params,_body,cmp.extend({},options))}, 
        
           
             getBanners :  function(_params,options){return SeeyonApi.Rest.get('weixinProduct/banners',_params,'',cmp.extend({},options))}, 
        
             getCustomizeApps :  function(_params,options){return SeeyonApi.Rest.get('weixinProduct/customizeApps',_params,'',cmp.extend({},options))}, 
        
             getProductPatchForWechat :  function(_params,options){return SeeyonApi.Rest.get('weixinProduct',_params,'',cmp.extend({},options))}, 
        
             getAppList :  function(_params,options){return SeeyonApi.Rest.get('weixinProduct/appList',_params,'',cmp.extend({},options))} 
        
        
    },
    
    JoinOrgAccount : {
           
             addAccount :  function(_params,_body,options){return SeeyonApi.Rest.post('joinOrgAccount/add',_params,_body,cmp.extend({},options))}, 
        
             updateAccount :  function(accountId,accountName,accountShortName,loginName,nowPassword,oldPassword,_params,_body,options){return SeeyonApi.Rest.post('joinOrgAccount/update/'+accountId+'/'+accountName+'/'+accountShortName+'/'+loginName+'/'+nowPassword+'/'+oldPassword+'',_params,_body,cmp.extend({},options))}, 
        
             getProductInfo :  function(_params,options){return SeeyonApi.Rest.get('joinOrgAccount/productInfo',_params,'',cmp.extend({},options))} 
        
        
    },
    
    User : {
             getResource :  function(_params,options){return SeeyonApi.Rest.get('user/resources',_params,'',cmp.extend({},options))}, 
        
           
             getLoginName :  function(_params,options){return SeeyonApi.Rest.get('user/loginName',_params,'',cmp.extend({},options))}, 
        
             getUserId :  function(_params,options){return SeeyonApi.Rest.get('user/userId',_params,'',cmp.extend({},options))} 
        
        
    },
    
    Attendance : {
             findSettings :  function(id,_params,options){return SeeyonApi.Rest.get('attendance/setting/'+id+'',_params,'',cmp.extend({},options))}, 
        
             availableSettings :  function(_params,options){return SeeyonApi.Rest.get('attendance/setting/available',_params,'',cmp.extend({},options))}, 
        
           
             updateAttendance :  function(_params,_body,options){return SeeyonApi.Rest.post('attendance/update',_params,_body,cmp.extend({},options))}, 
        
             currentAttendance :  function(_params,options){return SeeyonApi.Rest.get('attendance/currentAttendance',_params,'',cmp.extend({},options))}, 
        
             mentionedAttendance :  function(_params,_body,options){return SeeyonApi.Rest.post('attendance/mentionedAttendance',_params,_body,cmp.extend({},options))}, 
        
             importAttendanceSettings :  function(_params,_body,options){return SeeyonApi.Rest.post('attendance/importSettings',_params,_body,cmp.extend({},options))}, 
        
             checkAuthScope :  function(_params,options){return SeeyonApi.Rest.get('attendance/checkAuthScope',_params,'',cmp.extend({},options))}, 
        
             findAttendanceHistory :  function(_params,_body,options){return SeeyonApi.Rest.post('attendance/findAttendanceHistory',_params,_body,cmp.extend({},options))}, 
        
             saveAttendance :  function(_params,_body,options){return SeeyonApi.Rest.post('attendance/save',_params,_body,cmp.extend({},options))}, 
        
             removeSetting :  function(id,_params,options){return SeeyonApi.Rest.get('attendance/removeSetting/'+id+'',_params,'',cmp.extend({},options))}, 
        
             myAttendance :  function(_params,_body,options){return SeeyonApi.Rest.post('attendance/myAttendance',_params,_body,cmp.extend({},options))}, 
        
             getAttendanceById :  function(attendanceId,_params,options){return SeeyonApi.Rest.get('attendance/'+attendanceId+'',_params,'',cmp.extend({},options))}, 
        
             getAuthorize :  function(_params,_body,options){return SeeyonApi.Rest.post('attendance/authorize',_params,_body,cmp.extend({},options))}, 
        
             systemData4Attendance :  function(_params,options){return SeeyonApi.Rest.get('attendance/sysData',_params,'',cmp.extend({},options))}, 
        
             saveSetting :  function(_params,_body,options){return SeeyonApi.Rest.post('attendance/saveSetting',_params,_body,cmp.extend({},options))}, 
        
             checkAttendanceAtByUser :  function(attendanceId,_params,options){return SeeyonApi.Rest.get('attendance/checkAttendanceAtByUser/'+attendanceId+'',_params,'',cmp.extend({},options))}, 
        
             checkAuthForAttendance :  function(_params,options){return SeeyonApi.Rest.get('attendance/checkAuthForAttendance',_params,'',cmp.extend({},options))} 
        
        
    },
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
                'token' : tk, 
                'Cookie' : 'JSESSIONID='+this.jsessionid ,
                'option.n_a_s' : '1'
        }
        
        if(this.jsessionid){
            header.Cookie = 'JSESSIONID='+this.jsessionid;
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
        this.token = SeeyonApi.Token.getTokenByQueryParam('',{userName:userName,password:password}).id;
        return this.token;
    },
    setSession : function(sessionId){
        this.jsessionid = sessionId;
    }    
}
var $s = SeeyonApi;
 var jssdktagloaded = 'jssdktagloaded'; 