(function(_){
    if(typeof CMP_SELECTORG_I18N_LOADED  == "undefined") {
        _.i18n.load(cmpBASEPATH+'/i18n/', 'cmp-selectOrg',function(){
            CMP_SELECTORG_I18N_LOADED = true;
            _.event.trigger("cmp-selectOrg-init",document);
        },cmpBuildversion);
    }//如果页面没有加载国际化资源，此处才加载
    var memberH = _.origin + "/rest/orgMember/avatar";
    var departmentH = _.origin +"/rest/orgMember/groupavatar";
    var selectOrgConstant = {//常量
        C_iFlowSelect:1,//选人组件类型---流程选人
        C_iLightFormSelect:2,//选人组件类型---轻表单选人

        /*以下三种场景是流程选人重现的时候，不需要回填数据的情况*/
        C_iFlowSelect_replace:1,//流程选人替换场景
        C_iFlowSelect_increase:2,//流程选人增加场景
        C_iFlowSelect_default:3,//流程选人默认模式

        C_sSelectType_member:'member',//选择类型---人员
        C_sSelectType_department:'department',//选择类型---部门
        C_sSelectType_post:'post',//选择类型---岗位
        C_sSelectType_account:'account',//选择类型---单位
        C_sSelectType_level:'level',//选择类型---职务级别
        C_sSelectType_department_vj1:"department_vj1",//选择类型---外部机构
        C_sSelectType_department_account:"department_vj2",//选择类型---外部单位

        C_sSelectType_light_member:"light_member",//选择类型----轻表单选人（需要与流程选人进行区分）
        C_sSelectType_light_department_member:"light_department_member",//轻表单选人，部门点击【下一级】请求选人数据时，无职务级别控制

        C_sSelectType_account_switch:'account_switch',//选择类型，私有的---单位切换
        C_sSelectType_all:'all',
        C_sSelectType_post_member:'post_member',  //流程选人的根据岗位获取人员
        C_sSelectType_selfDept_member:'selfDept_member', //流程选人的根据职务级别获取人员
        C_sSelectType_department_member:'department_member',//流程选人的根据部门获取人员（可能有人员和子部门一起返回）
        C_sSelectType_team_member:"team_member",//流程中组类型
        C_sSelectType_extAccount_member:"extAccount_member",//流程中外单位人员
        C_sSelectType_vjDepartment_member:"vjDeparment_member",//流程中的vj外部机构人员
        C_sSelectType_light_vjDepartment_member:"light_vjDeparment_member",//无流程中vj外部机构人员

        C_sSelectType_light_department:'light_department',
        C_sSelectType_light_department_subvjunits:'light_department_subvjunits',
        C_sSelectType_flowSearch:"flow_search",//流程搜索接口
        C_sSelectType_lightSearch:"light_search",//轻表单搜索接口（不受工作范围限制）

        C_sSelectType_getCurrentUser:"get_currentUser",//获取当前登录人员信息
        C_sSelectType_saveRecentContacts:"save_recent_contacts",//保存最近联系人
        C_sSelectType_memberType:"memberType",//判断登陆人员类型0，内部人员 1 编外人员  2 vjoin人员

        C_iType_Account: 1,//组织机构数据类型---单位
        C_iType_Department : 2,//组织机构数据类型---部门
        C_iType_Group : 3,//组织机构数据类型---集团（暂未用）
        C_iType_Level : 4,//组织机构数据类型---职务级别
        C_iType_Member : 5,//组织机构数据类型---人员
        C_iType_Post: 7,//组织机构数据类型---岗位
        C_iType_Role : 8,//组织机构数据类型---角色（暂未用）
        C_iType_Team : 9,//组织机构数据类型---组（暂未用）
        C_iType_All:10,//流程选人首页
        C_iType_vjUnit:11,//流程选人，vjoin外部机构
        C_iType_vjAccount:12,//流程选人，vjoin外部单位
        C_iType_vjPost:13,//流程选人，vjoin外部岗位
        C_iType_vjDepartment:14,

        C_iTeamType_personal:"1",//个人组
        C_iTeamType_system:"2",//系统组
        C_iTeamType_project:"3",//项目组
        C_iTeamType_discuss:"4",//讨论组

        C_iTeamMember_member:0,//组成员---成员
        C_iTeamMember_director:1,//组成员---主管
        C_iTeamMember_leader:2,//组成员---领导
        C_iTeamMember_related:3,//组成员---关联人员

        C_iSearchType_account:1,//单位搜索
        C_iSearchType_department:2,//部门搜索
        C_iSearchType_post:3,//岗位搜索
        C_iSearchType_level:4,//职务级别搜索
        C_iSearchType_member:5,//人员搜索，
        C_iSearchType_department_vj1:11,//外部机构控件搜索（vj）
        C_iSearchType_department_vj2:12,//外部单位控件搜索（vj）
        C_iSearchType_post_vj:13,//外部岗位控件搜索（vj）
        C_iSearchType_member_vj:14,//外部人员控件搜索（vj）
        C_iSearchType_member_homepage:19,//首页可以搜索内部人员+vj人员（后台自动判断是否有vj插件，以及登录人员的权限问题）

        C_iDepartmentHasChildren_yes:1,//包含子部门
        C_iDepartmentHasChildren_no:0,//不包含子部门

        C_iWholeChoose_can:"1",//可整体选部门
        C_iWholeChoose_cant:"0",//不可整体选部门，有不可见的人员


        C_iAccountRenderType_switch:1,//单位切换的单位操作
        C_iAccountRenderType_Content:2,//主区域单位的切换操作

        C_sOrgResult_light:'light',//组织机构返回数据类型---轻表单
        C_sOrgResult_concurrent:'concurrent',//组织机构返回数据类型---流程并联
        C_sOrgResult_concurrent_next:'concurrentNext',//组织机构返回数据类型---流程与下一节点并联
        C_sOrgResult_sequence:'sequence',//组织机构返回数据类型---流程串联
        C_sOrgResult_flowChange:'flowChange',//组织机构返回数据类型----流程单选

        C_oFlowHome:{
            parentPath:"-12345678987654321",
            id:"-9999"
        },
        C_iScrollDirection_verical:1,//滚动条方向---垂直
        C_iScrollDirection_tranceve:2,//滚动条方向---横向
        C_iLoadListData_pageSize:20,//分页数
        C_iHomePage_total:1,//默认首页的total值置为1，避免进行分页
        C_sJumpPagePath:cmpBASEPATH + "/page/cmp-common-page.html?ctrl=selectOrg",//跳转方式时，页面地址

        C_sCrumbChange_choose:"choose",
        C_sCrumbChange_increase:"increase",
        C_sCrumbChange_reduce:"reduce",
        C_sCrumbChange_insert:"insert"
    };

    var selectOrg = function(id,opts) {
        var self = this;
        self.opts = _.extend({
            title:'',//组件标题(开发者自定义，如果没有定义，则取当前单位的名称作为标题)
            type:selectOrgConstant.C_iFlowSelect,//类型：1，流程选人；2，轻表单选人
            flowType:null,//流程选人，条件改变参数1：改变成单选（及进行替换操作）2：多选模式（多选操作）3：默认模式；其他：（默认可以不传该值）
            selectType:selectOrgConstant.C_sSelectType_member,//选择类型：'member':选人；'department':选部门；'post':选岗位；'account':选单位；'level':选职务级别
            choosableType:["department","account","member","post","team","level","vjoin_1","vjoin_2"],//流程选人中，可选数据类型组合，默认是可以选人员、部门、单位、岗位、组、职务级别、vjoin_1外部机构，vjoin_2外部单位
            maxSize:-1,//最多选择数，若为1则为单选，其他都是多选(如果是流程选人，会忽略此参数，一概认定是多选)
            minSize:-1,//最少选人数，若为-1则不进行控制,如果选人数少于该值则进行提示
            fillBackData:null,//回填值格式：人数据[{id:181818,name:"杨海",type:"member"}]、部门数据[{id:"-155555",name:"天龙八部",type:"department"}]、单位(account)、职务(level)、岗位(post)只是type不一样
            excludeData:null,//被排除的不能选择的数据，格式同fillBackData一样默认是被排除的人员是被选中的，如果想要被排除的数据不被默认选中，需要在数据上传属性disable:true 如:[{id:181818,name:"杨海",type:"member",disable:true}]
            callback:null,//回调函数（根据组件类型返回的值有数据类型标识：1、light:轻表单；2、concurrent：流程并联；3、sequence：流程串联）
            jump:false,//是否用跳转到新页面的方式(该参数只针对轻表单选人有用)
            multitype:false,//是否进行多类型选择（用于轻表单选人中可进行部门选择，如果还有其他情况以后再进行扩展，默认是可以进行多类型选择的）
            pageKey:null,//页面跳转开发者自定义取选人数据的key
            label:["dept","org","post","team","extP"],//按需导入首页页签，默认有:dep----本部门，org-----本单位 ,post----岗位，team----组 extP----编外人员,level------职务级别 vjOrg------外部机构
            closeCallback:null,//关闭组件的回调方法
            directDepartment:false,//流程选人中是否直选部门（即不进行是否包含子部门的提示）
            permission:true,//流程选人时，整体选部门，选岗位、选组、选本单位是否受当前登录人员权限控制(默认流程选人要受权限控制),如果不受权限控制那么人员就显示也不受权限控制了
            seeExtAccount:true,//是否能查看外单位，即是否能进行外单位切换
            server:null,//对于跨域请求rest接口的时候，需要开发者自定义服务器地址
            cancelRadio:true,
            notSelectAccount:false,//所有的【本单位】都不能选择
            notSelectSelfDepartment:false,//【本部门】不能被选
            moreOptions:null,//更多按钮的回调函数，定义的话就会在右下角显示三个蓝色的点点
            lightMemberPermission:false,//轻表单选人是否受权限控制,默认false，不受控制
            vj:false,//是否是有vjoin的选人权限
            _transed:false,//用于新页面的标识(开发者不能设置该值)
            debug:false,//是否开启debug模式 true：开启，false：不开启
            _targetServer:null,//debug模式下取数据的服务器地址
            _proxyServer:null,//debug模式下取数据的代理服务器地址
            _sessionId:null,//debug模式下取数据sessionId
            wheader:false,//在M3中openwebview的方式打开组件，ios不需要将header  top64
            h5header:false,//是否使用原来的H5头部,有适配ios的高度的情况
            hiddenCancelbtn:false,//是否隐藏取消按钮
            nextConcurrent:false //增加许强威哪儿的与下一节点并发按钮参数

        },opts);
        self.id = id;
        if(typeof CMP_SELECTORG_I18N_LOADED == "undefined"){
            document.addEventListener("cmp-selectOrg-init",function(){
                self._setOptsTitle();
                self._initData();
                self._initOperation();
            });
        }else {
            self._setOptsTitle();
            self._initData();
            self._initOperation();
        }
    };
    selectOrg.prototype._setOptsTitle = function(){
        var self = this;
        var title = self.opts.title;
        var prefix = self.opts.maxSize == 1?"rc":"mc";
        if(title == null||  title == "" || title.trim().length == 0 ){
            if(self.opts.type == selectOrgConstant.C_iLightFormSelect) {
                var suffix = self.opts.selectType;
                if(self.opts.vj) suffix += "_vj";
                title = _.i18n("cmp.selectOrg." + prefix+"_" + suffix);
            }
        }
        self.opts.title = title;
    };
    selectOrg.prototype._initData = function(){
        var self = this;
        self.ip = _.serverIp;
        self.baseUrl = self.opts.server?self.opts.server + '/seeyon/rest':_.origin + '/rest';
        self.scrollerCache={};//缓存滚动对象，避免重复创建
        self.rankCache = {};//缓存切换单位的级数内容，避免重复创建
        self.rankParentIDCache = {};//缓存父级单位ID
        self._transeFillbackData();//将开发者传的简单回传值进行渲染转换
        self.selectDataCache = (self.opts.fillBackData == null)?[]:self.opts.fillBackData;//选择的数据缓存(用于返回结果)
        self.preSelectDataCache = [];//缓存上一次选择的数据
        self.selectDataIDCache = [];//缓存被选数据的ID
        self._cachePreSelectedData();//处理上一次选择的数据
        self.widget = null;//组件div，用于全局
        self.initShowMark = true;//当组件出现一次后，其值就会被置为false
        self.runOKEevent = true;//是否进行了ok操作，true：点击了ok按钮，false：点击的是组件关闭按钮
        self._handleJumpPageData();//处理跳转页面的数据
        self.uuID = _.buildUUID();//创建uuID(对同一页面有多个地方调用选人组件的情况进行区分)
        self.orgDataUrl = '';//组织机构数据请求地址(请求参数时用，异步更改的)
        self.orgSearchUrl = '';
        self.initLoad = true;//是否初次加载数据（避免加载更多的时候，重复渲染被选中区）
        self.initFocus = true;//搜索输入域是否初次获取焦点(避免重复渲染)
        self.initRenderContent = true;//用于内容区是“重新渲染”还是“加载更多”渲染(当切换单位和面包屑选择部门时需要将此参数置为true)
        self.initRenderCrumbs = true;//用于标识面包屑是否是初次渲染
        self.initBindEvent = true;//避免重复绑定事件
        self.switchAccount = false;//单位切换按钮和回退按钮设置单位属性的防护，只在初始的时候需要设置，后面单位切换的时候都是设置前倾，避免返回空数组，什么都没有
        self.crumbAccount = {id:"",name:""};
        self.doSearch = false;//用于判断是在进行搜索界面的操作
        self.initHash = window.location.hash;//记录组件未显示出来之前的页面hash

        self.path = {  //父路径和当前路径的转换，用于回退按钮和面包屑按钮使用
            parent:selectOrgConstant.C_oFlowHome.parentPath,
            self:selectOrgConstant.C_oFlowHome.id
        };
        self.parentParent = {};
        self.parentParent[selectOrgConstant.C_oFlowHome.id] = selectOrgConstant.C_oFlowHome.id;//初始化将父地址设为常量最高级


        if(self.opts.selectType == selectOrgConstant.C_sSelectType_account){//如果是选单位，则将设置的组织机构ID置为""
            self.opts.orgID = "";
        }
        self.searchKeyword = [];//缓存根据关键字搜索出来的对象
        self.keyWord = '';//用于搜索时关键字值的改变
        self.searchType = self._setSearchType();//获取搜索类型
        self._getSearchHistory();
        self.currentAccount = -1;//当前的单位id,搜索时用
        self.account = {};//返回单位信息
        self.account["id"] = -1;
        self.account["name"]="";
        self.account["shortname"] = "";

        self.deptChain = {};//部门链，用于选人时，选择的是整个部门的情况
        self.orgChain = [];//组织机构链，流程选人，整体选组、岗位的情况

        self.flowType  = (self.opts.type == selectOrgConstant.C_iFlowSelect)?self.opts.flowType:null;//流程单选开关（一般不用管，应用场景：流程图替换流程节点的时候选人）
        self.initLM = true;//轻表单选人组件首次标记
        self.excludeData = self._transExcludeData();//缓存被排除不能被选中的数据的id
        self.excludeUrlParams = self._transExcludeUrlParams();//缓存被排除的不能被选中的人员的url请求参数，适配OA-152386类似的bug
        self.userAccount = null;//缓存登陆人员的单位,第一次取数据的时候，单位ID一定是当前登陆人员的单位id,用于轻表单选部门、岗位、职务级别需要加单位简称
        self.isExtAccount = false;//是否是外单，当单位切换后的单位id不等于self.userAccount就是外单位了，此时，选中的部门、岗位、职务级别。需要带外单位简称
        self.extAccountSan = null;//切换成外单位后的，标识一个外单位的简称，用于人员后面跟一个
        self.cancelRadio = self.opts.cancelRadio;
        self.SpecialCharacter = /[@#\$%\^&\*\?#\!\.\:;"'\/|\[\]\{\}\+]/;//非法字符集(注：括号不算)
        self.accountChoosed = 0;//【本单位】页签被选中的标识，如果被选中，那么所有的都置为
        self.vjNext = false;//是否点击了vj的下一级
        self.choosableType = self._transeChoosableType();
        self.checkLevelScope = (self.opts.type == 2 && self.opts.selectType == "member" && self.opts.vj ==true);//表单控件选【外部人员】才进行首页接口的参数
        self.requestSelfDeparmentData = 0;//控制【本部门】数据刷新时，ap的设置有问题的情况
        self.teamMemberData = false;//标识是否进入到了【组】页签的下一级数据（因为组可以包含人，组，部门，单位，岗位，职务级别的数据，显示要单独处理）
        self.otherTitle = document.title;
    };
    selectOrg.prototype._getSearchHistory = function(){
        var self = this;
        var url = self._getOrgUrl("get_currentUser");
        self._sendAjax("GET",url,"",function(result){
            var id = result.id,name = result.name;
            self.userID = id;
            self.userName = name + "_" + id;
            self.searchHistory = {};//缓存搜索历史对象
            self.searchHistory["children"] = [];
            var localSearchHistory = _.storage.get("selectOrg_" + self.opts.selectType+"_" +self.searchType+"_"+ self.userName);
            if(localSearchHistory && localSearchHistory.length > 0) {
                self.searchHistory["children"] = _.parseJSON(localSearchHistory);
            }
        });
    };
    selectOrg.prototype._transeFillbackData = function(){
        var self = this;
        var fillbackData = (self.opts.fillBackData == null)?[]:self.opts.fillBackData;
        var i = 0,len = fillbackData.length;
        var temp = [];
        for(;i<len;i++){
            var data = fillbackData[i];
            var item = {
                id:data.id,
                n:data.name
            };
            switch (data.type.toLocaleLowerCase()){
                case "member":
                    item.type = selectOrgConstant.C_iType_Member;
                    item.p = data.post;
                    item.accountID = data.account;
                    item.et = "Member";
                    item.head = memberH + "/" + data.id;
                    break;
                case "department":
                    item.type = selectOrgConstant.C_iType_Department;
                    item.et = "Department";
                    self._setFirstWord(i,item);
                    break;
                case "post":
                    item.type = selectOrgConstant.C_iType_Post;
                    item.et = "Post";
                    self._setFirstWord(i,item);
                    break;
                case "account":
                    item.type = selectOrgConstant.C_iType_Account;
                    item.et = "Account";
                    self._setFirstWord(i,item);
                    break;
                case "level":
                    item.type = selectOrgConstant.C_iType_Level;
                    item.et = "Level";
                    self._setFirstWord(i,item);
                    break;
                case "team":
                    item.type = selectOrgConstant.C_iType_Team;
                    item.et = "Team";
                    break;
            }

            temp.push(_.toJSON(item));
        }
        self.opts.fillBackData = temp;
    };
    selectOrg.prototype._transExcludeData = function(){
        var self = this;
        var excludeData = {};
        var optsExcludeData = self.opts.excludeData;
        if(optsExcludeData && optsExcludeData.length > 0) {
            var i = 0,len = optsExcludeData.length;
            for(;i<len;i++){
                var id = optsExcludeData[i].id;
                excludeData[id] = optsExcludeData[i];
            }
        }
        return excludeData;
    };
    selectOrg.prototype._transExcludeUrlParams = function () {
        var self = this;
        var excludeParams = "";
        var optsExcludeData = self.opts.excludeData;
        if(optsExcludeData && optsExcludeData.length > 0) {
            var i = 0,len = optsExcludeData.length;
            for(;i<len;i++){
                var id = optsExcludeData[i].id;
                var type = optsExcludeData[i].type;
                type =  type.substring(0,1).toUpperCase()+type.substring(1);
                excludeParams += type + "|" +id;
                if(i <= (len-2)){
                    excludeParams += ",";
                }
            }
        }
        if(excludeParams){
            // excludeParams = "extParam="+encodeURIComponent("{\"excludeElements\":\""+excludeParams+"\"}");
            excludeParams = {"extParam":{"excludeElements":excludeParams}};
        }
        return excludeParams;
    };
    selectOrg.prototype._transeChoosableType = function(){
        var self = this;
        var choosable = [],choosableType=self.opts.choosableType,i=0,len=choosableType.length;
        for(;i<len;i++){
            choosable.push(self._convertVOType({et:choosableType[i]}));
        }
        choosable.push(selectOrgConstant.C_iType_All);
        return choosable;
    };
    selectOrg.prototype._initOperation = function(){
        var self = this;
        var ctrl;
        if(self.opts._transed == false) {
            if(!self.id || self.id.length == 0 ) {
                throw "you should defined tab container id";
            }
            ctrl = document.getElementById(self.id);
        }else {
            self._show();
        }
        if(ctrl) {
            _.dialog.loading(false);
            ctrl.addEventListener('tap',function(){
                if((self.opts.jump == true || self.opts.jump == 'true') && self.opts.type == selectOrgConstant.C_iLightFormSelect) {
                    self.opts.id = self.id;
                    _.storage.save("cmp-selectOrg-opts", _.toJSON(self.opts),true);
                    var tempPath = selectOrgConstant.C_sJumpPagePath + "&options=cmp-selectOrg-opts";
                    _.href.next(tempPath);
                }else {
                    _.dialog.loading();
                    self._show();
                }
            },false);
        }else {  //组件没有绑定按钮事件的情况
            if(self.opts._transed == false){
                self._show();
            }
        }
    };
    selectOrg.prototype._show = function(){
        var self = this;
        if(self.initShowMark == true) {
            self._initShow();
        }else {
            self._reShow();
        }
    };
    selectOrg.prototype._initShow = function(){
        var self = this;
        if(!self.opts._transed && !self.opts.jump){
            _.backbutton.push(_.selectOrgClose);
        }
        self._cacheSelectedDataID(self.selectDataCache);
        var basicDiv = self._assemble();
        self.basicDiv = basicDiv;
        self._setContentHeight(basicDiv);
        self._closeEvent(basicDiv);
        self._bindH5BackBtnEvent(basicDiv,basicDiv);
        self._render(basicDiv);
        self.orientationChange(true);
    };
    selectOrg.prototype._reShow = function(){
        var self = this;
        _.backbutton.push(_.selectOrgClose);
        self.keyWord = "";
        var dataCacheArr = (self.runOKEevent == true)?self.selectDataCache:self.preSelectDataCache;
        var footer = self.widget.querySelector("#select_footer");
        self._cacheSelectedDataID(dataCacheArr);
        self._renderFillback(self.widget,"select_listContent");
        if(self.widget.querySelector("#select_selectedList")) self._renderSelectedData4SelectArea(self.widget);
        var selectedNum = self.widget.querySelector("#select_selectedNum");
        if(selectedNum) selectedNum.innerHTML = dataCacheArr.length;
        if(self.opts.maxSize == 1){
            if(!self.cancelRadio){
                if(dataCacheArr.length > 0) {
                    footer.classList.remove("cmp-hidden");
                    footer.querySelector("#select_okBtn").innerHTML = _.i18n("cmp.selectOrg.cancel");
                }else {
                    if(!footer.classList.contains("cmp-hidden")){
                        footer.classList.add("cmp-hidden");
                    }
                }
            }


        }
        if(self.widget != null) {
            self.widget.style.display = "block";
            setTimeout(function(){
                _.dialog.loading(false);
                self.widget.classList.remove("cmp-select-basicDiv-close");
                self.widget.classList.add("cmp-select-basicDiv-show");
                if(self.opts.maxSize != 1){
                    self._changeScrollWrapperH(self.widget,"content");
                }
            },0);
        }
    };
    selectOrg.prototype._assemble = function(){
        var self = this;
        var opts = self.opts;
        opts.title = self._getTitle();
        if(opts._transed){
            document.title = opts.title;
        }
        var header = _.tpl(selectHeader(),opts);
        var content;
        switch(opts.selectType){
            case "account":
                content = selectL_UContent();
                break;
            case "post":
            case "level":
                content = selectL_PLContent();
                break;
            default:
                content = selectMDContent();
                break;
        }
        var contentParam = {uuID:self.uuID,opts:self.opts};
        content = _.tpl(content,contentParam);
        var btnArea = '';
        if(opts.type == selectOrgConstant.C_iFlowSelect && opts.selectType == selectOrgConstant.C_sSelectType_member) {//如果又是流程，又是选人才使用流程选人的按钮
            btnArea = _.tpl(selectM4Flow(),{uuid:self.uuID,flowType:opts.flowType,more:(opts.moreOptions != null)});
        }else {
            var btnData = {
                maxSize:opts.maxSize,
                fillBackData:self.selectDataCache,
                selectedNum:(self.selectDataCache.length == 0)?0 : self.selectDataCache.length,
                selectType:opts.selectType,
                uuID:self.uuID,
                cancelRadio:self.cancelRadio,
                _transed:opts._transed
            };
            btnArea = _.tpl(selectM4Light(),btnData);
        }
        var basicHtml = header + content + btnArea;
        var basicDiv = document.createElement('div');
        basicDiv.setAttribute("id","select_widget_"+self.uuID);
        basicDiv.setAttribute("uid",self.id);
        basicDiv.classList.add("cmp-select-basicDiv");
        if((self.opts.jump != true && self.opts.jump != 'true') || self.opts.type == selectOrgConstant.C_iFlowSelect) {//如果是在本页弹出
            basicDiv.classList.add("cmp-select-basicDiv-thisPage");
        }
        basicDiv.innerHTML = basicHtml;
        if(self.opts.nextConcurrent){
            basicDiv.querySelector("#select_next_concurrent").classList.remove("cmp-hidden");
        }
        if(self.opts.hiddenCancelbtn){
            basicDiv.querySelector('#select_closeBack').classList.add('cmp-hidden');
        }
        if((self.opts.jump != true && self.opts.jump != 'true') || self.opts.type == selectOrgConstant.C_iFlowSelect){//如果是在本页弹出
            document.getElementsByTagName('body')[0].appendChild(basicDiv);
            self._changeSelectedArea(basicDiv);
            setTimeout(function(){
                basicDiv.classList.add("cmp-select-basicDiv-show");
            },0);

        }else {
            document.getElementsByTagName('body')[0].appendChild(basicDiv);
        }
        _.dialog.loading(false);
        return basicDiv;
    };
    selectOrg.prototype._changeSelectedArea = function(basicDiv,isSearch){
        var self = this;
        var selectedArea = basicDiv.querySelector("#select_selectedList_scroll_" + self.uuID);
        var scrollerKey = isSearch?"search":"content";
        var searchContent = isSearch?basicDiv.querySelector("#select_searchPage"):null;
        if(selectedArea && self.scrollerCache['selected']){
            var selectedHeight,contentHeight,searchContentHeight;
            if(!self.scrollerCache[scrollerKey]){
                scrollerKey = "searchHistory";
                searchContentHeight = searchContent.offsetHeight;
            }
            if(self.scrollerCache[scrollerKey]){
                contentHeight = self.scrollerCache[scrollerKey].wrapper.offsetHeight;
                if(self.selectDataIDCache.length == 0){
                    selectedHeight = selectedArea.offsetHeight;
                    if(selectedArea.classList.contains("cmp-active")) selectedArea.classList.remove("cmp-active");
                    selectedArea.classList.add("cmp-hidden");
                    self.scrollerCache[scrollerKey].wrapper.style.height = (contentHeight + selectedHeight ) + "px";
                    self.scrollerCache[scrollerKey].refresh();
                    if(isSearch){
                        var listContentH = self.scrollerCache["content"].wrapper.offsetHeight;
                        self.scrollerCache["content"].wrapper.style.height = (listContentH + selectedHeight ) + "px";
                        self.scrollerCache["content"].refresh();
                    }
                    if(searchContent){
                        basicDiv.querySelector('#select_footer').style.zIndex = 1;
                        searchContentHeight = searchContent.offsetHeight;
                        searchContent.style.height = (searchContentHeight + selectedHeight ) + "px";
                    }
                }else {
                    if(self.opts.maxSize !=1){
                        if(selectedArea.classList.contains("cmp-hidden")) selectedArea.classList.remove("cmp-hidden");
                        if(!selectedArea.classList.contains("cmp-active")){
                            selectedArea.classList.add("cmp-active");
                            selectedHeight = selectedArea.offsetHeight;
                            self.scrollerCache[scrollerKey].wrapper.style.height = (contentHeight - selectedHeight) + "px";
                            self.scrollerCache[scrollerKey].refresh();
                            if(isSearch){
                                var listContentH = self.scrollerCache["content"].wrapper.offsetHeight;
                                self.scrollerCache["content"].wrapper.style.height = (listContentH - selectedHeight ) + "px";
                                self.scrollerCache["content"].refresh();
                            }
                            if(searchContent){
                                basicDiv.querySelector('#select_footer').style.zIndex = 120;
                                searchContentHeight = searchContent.offsetHeight;
                                searchContent.style.height = (searchContentHeight - selectedHeight ) + "px";
                            }
                        }
                    }
                }
            }
        }else {
            if(self.selectDataIDCache.length == 0) {
                if(selectedArea)selectedArea.classList.add("cmp-hidden");
            }else {
                if(selectedArea)selectedArea.classList.add("cmp-active");
            }
        }

    };
    selectOrg.prototype._changeScrollWrapperH = function(basicDiv,scrollerKey){
        var self = this;
        var selected = basicDiv.querySelector("#select_selectedList_scroll_" + self.uuID);
        if(!selected) return;
        var contentHeight = basicDiv.querySelector("#select_content").offsetHeight;
        var contentTitleHeight = basicDiv.querySelector("#select_content_title").offsetHeight;
        var newSize = contentHeight-contentTitleHeight;
        self.scrollerCache[scrollerKey].wrapper.style.height = newSize + "px";
        self.scrollerCache[scrollerKey].refresh();
    };
    //======================================================================渲染部分============================================//
    // 为了适配横竖屏，额外新增的横竖屏切换方法
    selectOrg.prototype.orientationChange = function(){
        var self = this;
        var headerH = self.basicDiv.querySelector('.cmp-select-header').offsetHeight;//主界面头部高度（不变）
        var crubmsContainer = self.basicDiv.querySelector("#select_crumbs_scroll_"+self.uuID);//主界面面包屑
        function _refreshMainScroll(currentWH){//主界面的list滚动、面包屑、选中人员数据区
            self._setContentHeight(self.basicDiv,currentWH);
            cmp.listView('#select_listContent_scroll_'+self.uuID).refresh();
            if(crubmsContainer){
                self._updateWidth(crubmsContainer,self.scrollerCache["crumbs"]);//更新面包屑
            }
            self._updateWidth(self.scrollerCache['selected'].wrapper,self.scrollerCache['selected']);//更新已选区域
        }
        function _refreshAccountScroll(currentWH){
            var accountPage = self.basicDiv.querySelector("#select_accountSwitchPage");
            if(accountPage){
                cmp.listView('#select_accountList_scroll_'+self.uuID).refreshHeight(currentWH-headerH);
            }
        }
        function _refreshSearchScroll(currentWH){
            var searchPage = self.basicDiv.querySelector("#select_searchPage");
            if(searchPage){
                cmp.listView('#select_searchList_scroll_'+self.searchUUID).refreshHeight(currentWH-headerH);
            }
        }
        function _refreshNoContent(currentWH){
            var noContents = self.basicDiv.querySelectorAll(".cmp-selectOrg-list-center");
            if(noContents.length){
                for(var i = 0;i<noContents.length;i++){
                    noContents[i].style.height = currentWH - headerH +"px";
                }
                self.scrollerCache['content'].scrollTo(0,0);
            }
        }

        _.event.orientationChange(function(){
            var focusDom = document.querySelector("input:focus");
            if(focusDom) focusDom.blur();
            setTimeout(function(){
                var currentWH = window.innerHeight;//旋转后当前window高度
                _refreshMainScroll(currentWH);
                _refreshAccountScroll(currentWH);
                _refreshSearchScroll(currentWH);
                _refreshNoContent(currentWH);
            },focusDom?300:0);
        });
    };
    selectOrg.prototype._render = function(basicDiv){
        var self = this;
        var selectType = self.opts.selectType;
        var url = self._getOrgUrl(selectOrgConstant.C_sSelectType_memberType);//获取登录人员的类型  0 ：内部人员登录  1：编外人员登录  2：vj人员登录
        var _url = self._getOrgUrl('accounTisGroup');
        self._sendAjax("GET",_url + '?option.n_a_s=1',"",function(res){

            self._sendAjax("GET",url,"",function(type){
                self.memberType = type;
                if(type == 2 || self.opts.vj || type == 1){//如果是vj人员登陆或者是vj控件或者是编外人员，则不需要显示切换单位的按钮；
                    var accountBtn = basicDiv.querySelector("#select_accountSwitchBtn");
                    if(accountBtn){
                        accountBtn.classList.remove("cmp-select-accountBtn");
                        accountBtn.classList.add("cmp-hidden");
                    }
                }
                switch (selectType){
                    case "member": //选择类型是选人
                        var urlType = selectOrgConstant.C_sSelectType_all;//流程选人的情况
                        if(self.opts.type == 2){//表单控件的情况
                            if(type != 2){//内部人员/编外人员登录
                                if(self.opts.vj){//外部人员控件
                                    urlType = selectOrgConstant.C_sSelectType_all;
                                }else {//内部人员控件
                                    urlType = selectOrgConstant.C_sSelectType_light_member;
                                }
                            }else {//vj人员登录
                                if(self.opts.vj){//vj人员登录 + 外部人员控件
                                    urlType = selectOrgConstant.C_sSelectType_light_member;
                                }else {//vj人员登录 + 内部人员控件
                                    urlType = selectOrgConstant.C_sSelectType_all;
                                }

                            }
                        }
                        if(self.opts.vj && self.opts.type == 2){//如果是vj，则页签只有【外部机构】
                            self.label = "7"
                        }else {
                            self.label = self._convertLabel(self.opts.label);//获取首页显示页
                        }
                        self.orgDataUrl = self._getOrgUrl(urlType);
                        self._doRenderScroller(basicDiv);
                        break;
                    default :
                        self.orgDataUrl = self._getOrgUrl(self.opts.selectType);
                        self._doRenderScroller(basicDiv);
                        break;
                }
            });
            if (res !== 'sys_isGroupVer') {
                var accountBtn = basicDiv.querySelector("#select_accountSwitchBtn");
                if (accountBtn) {
                    accountBtn.classList.remove("cmp-select-accountBtn");
                    accountBtn.classList.add("cmp-hidden");
                }
            }
        });
        
    };
    selectOrg.prototype._doRenderScroller = function(basicDiv){
        var self = this;
        var contentListScroller = basicDiv.querySelector('#select_listContent_scroll_'+self.uuID);
        var crumbsListScroller = basicDiv.querySelector('#select_crumbs_scroll_'+self.uuID);
        var selectedListScroller = basicDiv.querySelector('#select_selectedList_scroll_'+self.uuID);
        self.scrollerCache['content'] = self._createScroller(contentListScroller,true,null,self._getOrgData,self._renderContent,self);
        if(crumbsListScroller){
            self.scrollerCache['crumbs'] = self._createScroller(crumbsListScroller,false,selectOrgConstant.C_iScrollDirection_tranceve);
        }
        if(selectedListScroller){
            self.scrollerCache['selected'] = self._createScroller(selectedListScroller,false,selectOrgConstant.C_iScrollDirection_tranceve);
        }
    };
    selectOrg.prototype._addPostClass = function(listContainer){
        var self = this;
        var opts = self.opts;
        if(opts.selectType == "post"
            || opts.selectType == "account"
            || opts.selectType == "level"
            || opts.selectType=="department_vj2") {
            listContainer.classList.add('cmp-select-toggle-accounts-ul');//选岗位需要添加此class
        }
    };
    selectOrg.prototype._extraRenderHome = function(basicDiv,listContainer,result){
        var self = this;
        if(result.home == true && !self.checkLevelScope){ //表单控件，选外部人员，不显示最近联系人
            var orgLis = listContainer.querySelectorAll(".home");
            var vjList = listContainer.querySelectorAll(".vj");
            var recentPersonMarkLi = document.createElement("li");
            recentPersonMarkLi.innerHTML = _.i18n("cmp.selectOrg.recentContactPerson");
            recentPersonMarkLi.classList.add("cmp-select-list-subtitle");

            var vjMarkLi = null;
            if(vjList.length > 0){
                vjMarkLi = document.createElement("li");
                vjMarkLi.innerHTML = result.vjname;
                vjMarkLi.classList.add("cmp-select-list-subtitle");
            }
            if(orgLis.length>0){
                if(vjMarkLi){
                    listContainer.insertBefore(vjMarkLi,vjList[0].previousSibling);
                    listContainer.insertBefore(recentPersonMarkLi,vjList.item(vjList.length-1).nextSibling);
                }else {
                    listContainer.insertBefore(recentPersonMarkLi,orgLis.item(orgLis.length-1).nextSibling);
                }
            }else {
                if(vjMarkLi){
                    listContainer.insertBefore(vjMarkLi,listContainer.firstChild);
                    listContainer.insertBefore(recentPersonMarkLi,vjList.item(vjList.length-1).nextSibling);
                }else {
                    listContainer.insertBefore(recentPersonMarkLi,listContainer.firstChild);
                }
            }
        }
    };
    selectOrg.prototype._renderFillback = function(basicDiv,id,lightOptChangeMultitype){
        var self = this;
        var items = basicDiv.querySelector('#'+id).children;
        if(self.selectDataIDCache.length > 0) {
            var idNo = self.selectDataIDCache.length;
            var i = 0,len = items.length;
            for(; i < len ; i ++) {
                if(!idNo) break;
                var checkbox = items[i].querySelector('input');
                if(checkbox) {
                    var id = checkbox.getAttribute("id");
                    id = self._handleDepartmentID(id);
                    for(var j = 0; j < self.selectDataIDCache.length > 0; j ++) {
                        if(id == self.selectDataIDCache[j]) {
                            checkbox.checked = true;
                            idNo --
                            break;
                        }
                    }
                }
            }
        }
        var deptChainEmpty = _.isEmptyObject(self.deptChain);//增加回填值渲染部门被整体选中后，但是操作者还停留在下一级页面的情况（恶心）
        var orgChainEmpty = self.orgChain.length == 0;
        for(var j = 0;j<items.length;j++) {
            var checkbox = items[j].querySelector('input');
            var type = items[j].getAttribute("type");
            if(checkbox) {
                if(typeof lightOptChangeMultitype != "undefined" && lightOptChangeMultitype == false){
                    if(type && type.toLocaleLowerCase() == "department"){
                        var placeholderDiv = document.createElement("div");
                        placeholderDiv.className = "cmp-select-placeholder-div";
                        checkbox.parentNode.replaceChild(placeholderDiv,checkbox);
                        continue;
                    }
                }
                if(checkbox.classList.contains("choosed")) {
                    if(!deptChainEmpty || !orgChainEmpty) {
                        checkbox.checked = true;
                        checkbox.style.opacity = 0.3;
                    }else {
                        checkbox.classList.remove("choosed");
                        checkbox.style.opacity = 1;
                    }
                }
            }
        }
    };
    selectOrg.prototype._renderListFillback = function(basicDiv,id){
        var self = this;
        var items = basicDiv.querySelector('#'+id).children;
        if(self.selectDataIDCache.length > 0) {
            var idArr = self.selectDataIDCache;
            var i = 0,len = items.length;
            for(; i < len ; i ++) {
                if(idArr.length  == 0) break;
                var checkbox = items[i].querySelector('input');
                if(checkbox) {
                    var id = checkbox.getAttribute("id");
                    for(var j = 0; j < idArr.length > 0; j ++) {
                        if(id == idArr[j]) {
                            checkbox.checked = true;
                            break;
                        }
                    }
                }
            }
        }
    }
    //动态设置内容区高度
    selectOrg.prototype._setContentHeight = function(basicDiv,currentWH) {
        var self= this;
        var height = currentWH || CMPFULLSREENHEIGHT;
        var content = basicDiv.querySelector(".cmp-content");
        var contentTitle = content.querySelector("#select_content_title");
        var contentList = content.querySelector("#select_listContent_scroll_"+self.uuID);
        var headerHeight = basicDiv.querySelector("header").offsetHeight;
        var btnAreaHeight = (basicDiv.querySelector(".cmp-candidate-bottom"))?basicDiv.querySelector(".cmp-candidate-bottom").offsetHeight:0;
        var contentTitleHeight = contentTitle?contentTitle.offsetHeight:0;
        content.style.height = (height-headerHeight - btnAreaHeight)+"px";
        contentList.style.height = (content.offsetHeight - contentTitleHeight) + "px";
    };
    selectOrg.prototype._renderContent = function(result,isRefresh){//xinpei
        var self = result.opts;
        var basicDiv = document.getElementById("select_widget_"+self.uuID);
        var listContainer = basicDiv.querySelector('#select_listContent');
        var backBtn = basicDiv.querySelector("#select_btnBack");
        var selectedContainer = basicDiv.querySelector("#select_selectedList");
        var crumbsContainer = basicDiv.querySelector("#select_crumbs_list");
        var accountBtn = basicDiv.querySelector("#select_accountSwitchBtn");
        self._updateTitle(basicDiv);
        if(result.children && result.children.length > 0) {
            result = self._convertToVO(result); //point2

            var itemsHtml = '';
            itemsHtml += self._renderOrgTemp(result);
            if(!itemsHtml.trim() && Object.keys(self.excludeData).length > 0){//如果html为空字符串，并且又有排除的数据存在的情况下，显示无数据状态
                self._doRenderCrumbs(crumbsContainer,result);
                self._renderNothing(listContainer);
                self._event(basicDiv);
                _.dialog.loading(false);
                return;
            }
            if(isRefresh){
                listContainer.innerHTML = itemsHtml;
                if(result.ap) {
                    if(result.ap && self.opts.selectType.indexOf("department") == -1&& (self.opts.type == selectOrgConstant.C_iLightFormSelect || result.allSelfDepartment)){
                        if(result.allSelfDepartment)self.initRenderCrumbs = true;
                        self._setPathByAp(result.ap,result.allSelfDepartment);
                    }
                }
                self._doRenderCrumbs(crumbsContainer,result);
                self.initRenderContent = false;

            }else {
                _.append(listContainer,itemsHtml);
            }
            self._addPostClass(listContainer);
            if(!self.switchAccount) {
                if(accountBtn)self._setAccount(accountBtn,backBtn,result);//xinpei
                if(result.ap && result.ap.length > 0){
                    self.currentAccount = result.aID;
                }else {
                    self.currentAccount = result.id;
                }
                self.switchAccount = true;
            }

            if(self.opts.type == selectOrgConstant.C_iLightFormSelect && self.opts.selectType == selectOrgConstant.C_sSelectType_account) {
                backBtn.setAttribute("parentPath",result.parentPath);
                backBtn.setAttribute("path",result.path);
            }
            self._extraRenderHome(basicDiv,listContainer,result);

            self._renderFillback(basicDiv,"select_listContent");
            if(self.initLoad) {
                if(selectedContainer){
                    self._renderSelectedData4SelectArea(basicDiv);
                    if(self.scrollerCache['selected']){
                        self.scrollerCache['selected'].refresh();
                    }
                }
                self.initLoad = false;

            }
            self._event(basicDiv);
        }else {
            if(result.ap && self.opts.selectType.indexOf("department") == -1&& (self.opts.type == selectOrgConstant.C_iLightFormSelect || result.allSelfDepartment)){ //轻表单选人返回有该值（不排除以后其他接口也有这样的可能）
                if(result.allSelfDepartment)self.initRenderCrumbs = true;
                self._setPathByAp(result.ap,result.allSelfDepartment);
            }
            self._doRenderCrumbs(crumbsContainer,result);
            self._renderNothing(listContainer);
            self._event(basicDiv);
        }
        _.dialog.loading(false);

    };
    //专门为了弄轻表单选人的ap搞的
    selectOrg.prototype._setPathByAp = function(ap,allSelfDepartment){
        var self = this;
        if(self.memberType == 2 && self.opts.type == 2 && self.opts.selectType == "member" && !self.opts.vj) return;//由于vj人员登陆选内部人员控件的入口是首页，所以不进行子父路径的控制
        if(self.initLM || allSelfDepartment){//如果是【本部门】的数据请求或者是轻表单选人初始数据请求，需要处理ap
            ap[0].et = "top";
            var topID = "top_" + ap[0].id;
            var firstLevelID = "allOrg_"+ap[0].id;
            ap[0].id = topID;
            var n = _.i18n("cmp.selectOrg.home_orgName_Org");//内部控件 叫本单位
            if(self.opts.vj && self.opts.type ==2 && self.opts.selectType == "member" && self.memberType == 2){//外部控件 + 外部人员登录 叫组织机构
                n = _.i18n("cmp.selectOrg.home_orgName_vjUnit");
            }
            var allOrgAp = {id:firstLevelID,et:"allOrg",n:n};
            ap.splice(1,0,allOrgAp);
            self.initLM = false;
            if(self.requestSelfDeparmentData > 1) return;
            var i = 1,len = ap.length;
            for(;i<len;i++){
                var parent = self.path.self;
                self.parentParent[parent] = self.path.parent;
                self.path = {parent:parent,self:ap[i].id};

            }

        }
    };
    selectOrg.prototype._doRenderCrumbs = function(crumbsContainer,data){
        var self = this;
        if(self.opts.selectType != selectOrgConstant.C_sSelectType_account && crumbsContainer) {//选单位不需要渲染面包屑
            if(self.initRenderCrumbs) {
                self._renderCrumbs(crumbsContainer,data);
                self.initRenderCrumbs = false;
            }
            if(self.scrollerCache['crumbs']){
                self.scrollerCache['crumbs'].refresh();
                self._updateWidth(crumbsContainer.parentNode,self.scrollerCache["crumbs"]);
            }
        }
    };
    var splitMark = 30;
    selectOrg.prototype._renderSelectedData4SelectArea = function(basicDiv){
        var self = this;
        var listContainer = basicDiv.querySelector('#select_selectedList');
        var infos = self.selectDataCache;
        var len = infos.length;
        if(len > 0) {
            var i = 0;
            if(len > splitMark){//如果回填数据大于首屏设置值，那么需要进行异步分段渲染，避免影响整体性能
                var tempData = self._getTempFillbackData(len);
                var renderTempDataFun = function(tempDataIndex){
                    var tempDataArr = tempData["index" + tempDataIndex];
                    if(tempDataArr){
                        setTimeout(function(){
                            for(var j = 0; j < tempDataArr.length ; j ++) {
                                var info = tempDataArr[j];
                                if((self.opts.type == selectOrgConstant.C_iLightFormSelect && self.opts.maxSize != 1)
                                    ||self.opts.type == selectOrgConstant.C_iFlowSelect){
                                    self._renderSelectArea(basicDiv,listContainer,info);
                                }
                            }
                            delete tempDataArr;
                            if(tempDataIndex == 0) { //首屏的数据还是要先显示出来
                                self._updateSelectedAreaAfterSelectedItemRenderComplate(basicDiv);
                            }
                            tempDataIndex ++;
                            renderTempDataFun(tempDataIndex);
                        },300);
                    }else {
                        self._updateSelectedAreaAfterSelectedItemRenderComplate(basicDiv);
                    }
                };
                renderTempDataFun(0);
            }else {
                for(; i < len ; i ++) {
                    var info = infos[i];
                    if((self.opts.type == selectOrgConstant.C_iLightFormSelect && self.opts.maxSize != 1)
                        ||self.opts.type == selectOrgConstant.C_iFlowSelect){
                        self._renderSelectArea(basicDiv,listContainer,info);
                    }
                }
                if(listContainer.childNodes.length > 0){
                    self._updateSelectedAreaAfterSelectedItemRenderComplate(basicDiv);
                }
            }
            if(self.initLoad){
                self._setContentHeight(basicDiv);
            }
        }
    };

    selectOrg.prototype._getTempFillbackData = function(len){
        var self = this;
        var splitContainer = {};
        for(var i = 0;i<Math.ceil(len/splitMark);i++){
                splitContainer[("index"+i)] = self.selectDataCache.slice(i*splitMark,((i+1)*splitMark));
        }
        return splitContainer;
    };
    selectOrg.prototype._getTitle = function(){
        var self = this;
        var title = self.opts.title;
        var prefix = self.opts.maxSize == 1?"rc":"mc";
        if(!title|| title.trim().length == 0){
            if(self.opts.type == selectOrgConstant.C_iLightFormSelect) {
                var suffix = self.opts.selectType;
                title = _.i18n("cmp.selectOrg."+prefix+"_" + suffix);
            }else {
                title = self.account["name"];
            }
        }
        return title;
    };
    selectOrg.prototype._updateTitle = function(basicDiv,otherTitle){
        var self = this;
        var title = self._getTitle();
        var h5Title = basicDiv.querySelector("#select_title");
        if(h5Title){
            h5Title.innerHTML = title;
        }
        var newTitle = otherTitle?self.otherTitle:title;
        if(!self.initLoad && self._transed){
            document.title = newTitle;
        }

        var h5header = basicDiv.querySelectorAll(".cmp-h5-header");
        for(var i = 0;i<h5header.length;i++){
            var titleDiv = h5header[i].querySelector(".cmp-title");
            titleDiv.innerHTML = self.otherTitle;
        }
    };
    selectOrg.prototype._renderCrumbs = function(container,orgData){
        var self = this;
        var crumbs = "";
        var aps = orgData.ap;
        if(aps && aps.length > 1){
            var i = 0,len = aps.length;
            for(;i<len;i++){
                var ap = aps[i];
                if(ap.et == "Account" && self.opts.selectType != "department_vj1"){
                    ap.id  = "allOrg_" + ap.id;
                }
                crumbs += '<span id="crumb'+ap.id+'" class="transverse-mark on-text crumbs-text">';
                if(i < (len -1)){
                    crumbs += '<a href="javascript:void(0)" class="on-text">'+ ap.n+'</a></span><span class="transverse-mark cmp-icon cmp-icon-arrowright right-icon"></span>';
                }else {
                    crumbs += '<a href="javascript:void(0)" class="no-text">'+ ap.n+'</a></span>';
                }
            }
        }else {
            crumbs = '<span id="crumb'+orgData.aID+'" class="transverse-mark on-text crumbs-text"><a href="javascript:void(0)" class="no-text">'+ orgData.aN+'</a></span>';
        }

        container.innerHTML = crumbs;
        self._updateWidth(container.parentNode);

    };
    selectOrg.prototype._updateCrumbs = function(container,info,crumbChange,scrollKey){
        var self = this;
        var name = info.n,id = info.id, a,preCrumb;
        var arrowRight = '<span class="transverse-mark cmp-icon cmp-icon-arrowright right-icon"></span>';
        switch (crumbChange){
            case selectOrgConstant.C_sCrumbChange_increase:

                var crumbItem = arrowRight + '<span id="crumb'+id+'" class="transverse-mark on-text crumbs-text"><a href="javascript:void(0)"';
                var oldCrumbItem = container.innerHTML;
                crumbItem += 'class="no-text">' + name + '</a></span>';
                container.innerHTML = oldCrumbItem + crumbItem;
                preCrumb = container.querySelector("#crumb" + id).previousSibling.previousSibling;
                a = preCrumb.getElementsByTagName("a")[0];
                a.classList.remove("no-text");
                a.classList.add("on-text");
                if(info.vj){
                    a.setAttribute("accountName",a.innerHTML);
                    a.innerHTML = info.dn;
                }
                break;
            case selectOrgConstant.C_sCrumbChange_reduce:
                var currentCrumb = container.querySelector("#crumb" + id);
                var arrow = currentCrumb.previousSibling;
                preCrumb = arrow.previousSibling;
                a = preCrumb.getElementsByTagName("a")[0];
                a.classList.add("no-text");
                var accountName = a.getAttribute("accountName");
                if(accountName){
                    a.innerHTML = accountName;
                    a.removeAttribute("accountName");
                }
                arrow.remove();
                currentCrumb.remove();
                break;
            case selectOrgConstant.C_sCrumbChange_choose:
                var currentCrumb = container.querySelector("#crumb" + id);
                var crumbs = container.getElementsByTagName("span");
                var len = crumbs.length;
                for(var i = len-1; i >=0;i--) {
                    var crumb = crumbs[i],crumbID = crumb.getAttribute("id");
                    if(crumbID != "crumb"+id){
                        crumb.remove();
                    }else {
                        break;
                    }

                }
                a = currentCrumb.getElementsByTagName("a")[0];
                a.classList.add("no-text");
                var accountName = a.getAttribute("accountName")
                if(accountName){
                    a.innerHTML = accountName;
                    a.removeAttribute("accountName");
                }
                break;
            case selectOrgConstant.C_sCrumbChange_insert:
                var flowHomeCrumb = container.querySelector("#crumb"+selectOrgConstant.C_oFlowHome.id);
                flowHomeCrumb.getElementsByTagName("a")[0].classList.remove("no-text");
                flowHomeCrumb.getElementsByTagName("a")[0].classList.add("on-text");
                var crumbs = container.getElementsByTagName("span");
                var len = crumbs.length;
                for(var i = len-1; i >=1;i--) {
                    crumbs[i].remove();
                }
                var html = container.innerHTML + arrowRight;
                html += '<span id="crumb'+id+'" class="transverse-mark on-text crumbs-text"><a href="javascript:void(0)"';
                html += 'class="no-text">' + name + '</a></span>';
                container.innerHTML = html;

        }
        self._updateWidth(container.parentNode,self.scrollerCache[scrollKey]);
    };
    var departmentTypeHeader = [1,2,4,7,9,11,12,14];
    selectOrg.prototype._renderSelectArea = function(basicDiv,listContainer,selectedData,del,isSearch){
        var self = this;
        var data = _.parseJSON(selectedData);
        var id = self._handleDepartmentID(data.id);
        id = 'item' + id;
        var type = data.type;
        var itemLi;
        if(typeof type == "string"){//如果是开发者简单传的值(传过来是这样的{id:12333,type:"Member",n:"杨海"})
            switch (type.toLocaleLowerCase()){
                case selectOrgConstant.C_sSelectType_member:
                    data.type = selectOrgConstant.C_iType_Member;
                    data.head = memberH + "/" + id + "?maxWidth=200";
                    break;
                case selectOrgConstant.C_sSelectType_department:
                    data.type = selectOrgConstant.C_iType_Department;
                    break;
                case selectOrgConstant.C_sSelectType_post:
                    data.type = selectOrgConstant.C_iType_Post;
                    break;
                case selectOrgConstant.C_sSelectType_level:
                    data.type = selectOrgConstant.C_iType_Level;
                    break;
            }
        }
        if(del && (del == true || del == 'true')) { //如果是删除
            var delLi = listContainer.querySelector("#"+id);
            if(delLi)listContainer.removeChild(delLi);
        } else {
            if(self.flowType && self.flowType != null){
                if(self.flowType == selectOrgConstant.C_iFlowSelect_replace || self.opts.maxSize == 1){
                    var oldLi = listContainer.getElementsByTagName("li")[0];
                    if(oldLi) listContainer.removeChild(oldLi);
                }
            }
            itemLi = document.createElement("li");
            itemLi.setAttribute("id",id);
            itemLi.setAttribute("info",selectedData);
            itemLi.classList.add("transverse-mark");
            itemLi.classList.add("cmp-list-cell");
            var errorHead = cmpIMGPath+ "/ic_load_failed.png";
            if(departmentTypeHeader.indexOf(type) != -1){
                var srcId = data.topLevel?data.idd:data.id;
                var src = departmentH + "?groupId=" + srcId + "&groupName=" +data.firstWord + "&maxWidth=200";
                src += cmp.token?"&token=" + cmp.token:"";
                data.head = encodeURI(encodeURI(src ));
            }
            var item = _.tpl(itemDisplay,data);
            itemLi.innerHTML = item;
            var img = itemLi.querySelector("img");
            if(img){
                img.onerror = function(){
                    this.src = errorHead;
                    this.style.cssText = "border:1px solid #E0E0E0;border-radius:50%;width:40px;height:40px;"
                }
            }

            listContainer.appendChild(itemLi);
        }
        if(!del){
            self._selectedItemEvent(basicDiv,listContainer,itemLi);//为item绑定拖动事件
        }
    };
    selectOrg.prototype._updateSelectedAreaAfterSelectedItemRenderComplate = function(basicDiv,isSearch){
        var self = this;
        var time = 0;
        if(self.initLoad){
            time = 100;
        }
        setTimeout(function(){
            self._updateWidth(self.scrollerCache['selected'].wrapper,self.scrollerCache['selected']);//更新选择滚动区的宽度
        },time);
        self._changeSelectedArea(basicDiv,isSearch);
    };
    selectOrg.prototype._renderSearchArea = function(basicDiv,change){
        var self = this;
        if(change == true || change == "true") {
            var ios7 = (_.os.ios && _.os.version.match("7") != null)?true:false;//是否是ios7
            var windowHeight = ios7?document.body.clientHeight:CMPFULLSREENHEIGHT;//兼容ios7的高度计算
            var footer = basicDiv.querySelector('#select_footer');
            var footerHeight = footer?footer.offsetHeight:0;
            var searchPageDiv = document.createElement("div");
            searchPageDiv.setAttribute("id","select_searchPage");
            searchPageDiv.classList.add("cmp-search-content");
            searchPageDiv.style.height = (windowHeight - footerHeight) + 'px';
            var searchContent = searchMDPPage();
            self.searchUUID = _.buildUUID();
            searchContent = _.tpl(searchContent,self);
            searchPageDiv.innerHTML = searchContent;
            basicDiv.appendChild(searchPageDiv);
            var searchListContent = searchPageDiv.querySelector("#select_searchList_scroll_"+self.searchUUID);
            var searchPageDivHeight = searchPageDiv.offsetHeight;
            var searchHeaderHeight = searchPageDiv.querySelector("#select_search_title").offsetHeight;
            searchListContent.style.height = (searchPageDivHeight - searchHeaderHeight)+'px';
            if(self.searchHistory.children.length == 0) {
                searchPageDiv.classList.add("cmp-search-noHistory");
            }else {
                var historyObj = self._convertToVO(self.searchHistory);
                var listContainer = searchPageDiv.querySelector("#select_searchList");
                var historyTemp = self._renderOrgTemp(historyObj);
                listContainer.innerHTML = historyTemp;
                self._chooseEvent(self.basicDiv,"select_searchList",true);
                self._addPostClass(listContainer);
                self._renderListFillback(basicDiv,"select_searchList");
                self.scrollerCache["searchHistory"] = self._createScroller(searchListContent,true,selectOrgConstant.C_iScrollDirection_verical);
            }
            self._bindH5BackBtnEvent(basicDiv,searchPageDiv);
            self._updateTitle(basicDiv,true);

        }else {
            self._closeSearchPage();
        }
    };
    selectOrg.prototype._bindH5BackBtnEvent = function(basicDiv,pageDiv){
        var self = this;
        var h5BackBtn = pageDiv.querySelector(".select_btnBack");
        if(h5BackBtn && !h5BackBtn.classList.contains("binded")){
            _.event.click(h5BackBtn,function(){
                self._doClose(basicDiv);
            });
            h5BackBtn.classList.add("binded");
        }
    };
    selectOrg.prototype._renderSearchData = function(result,isRefresh){
        var self = result.opts;
        var content = self.basicDiv.querySelector("#select_searchPage");
        if(!content) {//防护数据还没有加载完就点击取消按钮，导致请求回来的数据不能渲染的报错
            _.dialog.loading(false);
            return;
        }
        if(result.children && result.children.length > 0){  //新老搜索接口数据格式都是result.children,不要result.items
            self.searchKeyword = result;
            if(content.classList.contains("cmp-search-noHistory")) content.classList.remove("cmp-search-noHistory");
            if(!content.classList.contains("cmp-search-haveHistory")) content.classList.add("cmp-search-haveHistory");
            var listContainer = content.querySelector("#select_searchList");
            self._addPostClass(listContainer);
            result = self._convertToVO(result); //point2
            var keywordTemp = self._renderOrgTemp(self.searchKeyword,self.keyWord);
            if(isRefresh){
                listContainer.innerHTML = keywordTemp;
            }else {
                _.append(listContainer,keywordTemp);
            }
            self._renderFillback(self.basicDiv,"select_searchList");
            self._chooseEvent(self.basicDiv,"select_searchList",true);

        }else {
            self._renderNothing(self.basicDiv.querySelector("#select_searchList"));
            content.classList.add("cmp-search-haveHistory");
        }
        _.dialog.loading(false);

    };
    selectOrg.prototype._closeSearchPage = function(){
        var self = this;
        var searchContent = self.basicDiv.querySelector("#select_searchPage");
        if(searchContent) {
            setTimeout(function(){
                self.basicDiv.removeChild(searchContent);
            },50);

            if(self.scrollerCache['search']){
                self.scrollerCache['search'].destroy();
                self.scrollerCache['search'] = undefined;
            }
        }
    };
    selectOrg.prototype._createAccountPage = function(basicDiv){
        var self = this;
        var accountContentDiv = document.createElement("div");
        self.accountWidget = accountContentDiv;
        accountContentDiv.setAttribute("id","select_accountSwitchPage");
        accountContentDiv.classList.add("cmp-select-basicDiv");
        accountContentDiv.classList.add("cmp-select-basicDiv-thisPage");
        self.setTop(basicDiv,accountContentDiv);
        accountContentDiv.style.left = "100%";
        var accountPage = _.tpl(accountSwitchPageHtml(),self);
        accountContentDiv.innerHTML = accountPage;
        basicDiv.appendChild(accountContentDiv);
        var accountContentHeight = accountContentDiv.offsetHeight;
        var listScroller = accountContentDiv.querySelector("#select_accountList_scroll_"+self.uuID);
        var h = accountContentDiv.querySelector("header");
        var hHeight = h?(h.offsetHeight+40):36;
        listScroller.style.cssText = "height:"+(accountContentHeight - hHeight-50)+"px;width:100%;";
        setTimeout(function(){
            accountContentDiv.classList.add("cmp-select-basicDiv-rightShow");
            self._accountPageCloseEvent(basicDiv,accountContentDiv);
        },300);
    };
    selectOrg.prototype._renderAccountArea = function(basicDiv,result){
        var self = this;
        var listContainer = basicDiv.querySelector("#select_accountSwitchList");
        var accountContentDiv = basicDiv.querySelector("#select_accountSwitchPage");
        var listScroller = accountContentDiv.querySelector("#select_accountList_scroll_"+self.uuID);
        var accountList = _.tpl(switchUItem(),result);
        listContainer.innerHTML = accountList;
        self.scrollerCache["account"] = self._createScroller(listScroller,false,selectOrgConstant.C_iScrollDirection_verical);
        var crumbScroller = accountContentDiv.querySelector("#select_crumbs_scroll_account_" + self.uuID);
        self.scrollerCache['crumbsAccount'] = self._createScroller(crumbScroller,false,selectOrgConstant.C_iScrollDirection_tranceve);
        // var closeBtn = accountContentDiv.querySelector("#select_accountCloseBtn");

        self._accountChooseEvent(basicDiv,accountContentDiv);
        var crumbData = { aN:result.n,aID:"groupId"};//转换成和主页面包屑的数据格式一致
        var crumbsContainer = basicDiv.querySelector("#select_crumbs_list_account");
        self._renderCrumbs(crumbsContainer,crumbData);
        var crumbsBtn = crumbsContainer.querySelector(".crumbs-text");
        self._setRank(crumbsBtn,result);
    };
    selectOrg.prototype._accountCrumbsEvent = function(accountWidget,container){
        var self = this;
        var crumbTexts = container.querySelectorAll(".crumbs-text");
        for(var i = 0;i<(crumbTexts.length-1);i++){
            (function(i){
                var crumb = crumbTexts[i];
                if(!crumb.classList.contains("binded")){
                     _.event.click(crumb,function(){
                         crumb.classList.remove("binded");
                         var id = crumb.getAttribute("id");
                         id = id.replace("crumb","");
                         self._updateCrumbs(container,{id:id},selectOrgConstant.C_sCrumbChange_choose,"crumbsAccount");
                         self._toChooseLevelAccount(accountWidget,crumb,selectOrgConstant.C_iAccountRenderType_switch);
                         self._accountChooseEvent(self.basicDiv,accountWidget);
                     });
                    crumb.classList.add("binded");
                }
            })(i)
        }
    };
    selectOrg.prototype._toNextLevelAccount = function(accountWidget,result,accountType){
        var self = this;
        var preLevel,nextLevel,listContainer,scroller,ui;

        var nextLevelData = _.parseJSON(result);
        var crumbTexts = accountWidget.querySelectorAll(".crumbs-text");
        preLevel = crumbTexts[crumbTexts.length-2];//上一级面包屑
        nextLevel = crumbTexts[crumbTexts.length-1];//下一级面包屑
        switch(accountType) {
            case selectOrgConstant.C_iAccountRenderType_switch:
                listContainer = accountWidget.querySelector("#select_accountSwitchList");
                ui = switchUItem();
                var basicDiv = accountWidget.parentNode;
                var account = basicDiv.querySelector("#select_accountSwitchBtn").getAttribute("account");
                self._removeGou(listContainer);
                break;
            case selectOrgConstant.C_iAccountRenderType_Content:
                listContainer = accountWidget.querySelector("#select_listContent");
                ui = selectAPLItem;
        }
        scroller = self.scrollerCache["content"];
        self._toNextRank(listContainer,preLevel,nextLevelData,ui,scroller,nextLevel);
    };
    selectOrg.prototype._toChooseLevelAccount = function(accountWidget,crumb,accountType){
        var self = this;
        var listContainer,scroll;
        switch (accountType) {
            case selectOrgConstant.C_iAccountRenderType_Content:
                listContainer = accountWidget.querySelector("#select_listContent");
                scroll = self.scrollerCache["content"];
                break;
            case selectOrgConstant.C_iAccountRenderType_switch:
                listContainer = accountWidget.querySelector("#select_accountSwitchList");
                scroll = self.scrollerCache["account"];
                break;
        }
        self._selectRank(listContainer,crumb,scroll);
        if(accountType == selectOrgConstant.C_iAccountRenderType_switch){
            var basicDiv = accountWidget.parentNode;
            var account = basicDiv.querySelector("#select_accountSwitchBtn").getAttribute("account");
            self._removeGou(listContainer);
            self._addGou(listContainer,account);
        }
    };
    // selectOrg.prototype._toUpperLevelAccount = function(accountWidget,accountType){
    //     var self=  this;
    //     var mark = false,backBtn,listContainer,scroll;
    //     switch (accountType) {
    //         case selectOrgConstant.C_iAccountRenderType_Content:
    //             backBtn = accountWidget.querySelector("#select_btnBack");
    //             listContainer = accountWidget.querySelector("#select_listContent");
    //             scroll = self.scrollerCache["content"];
    //             break;
    //         case selectOrgConstant.C_iAccountRenderType_switch:
    //             backBtn = accountWidget.querySelector("#select_accountCloseBtn");
    //             listContainer = accountWidget.querySelector("#select_accountSwitchList");
    //             scroll = self.scrollerCache["account"];
    //             break;
    //     }
    //     if(self._toUpperRank(listContainer,backBtn,scroll) == true){
    //         if(accountType == selectOrgConstant.C_iAccountRenderType_switch){
    //             var basicDiv = accountWidget.parentNode;
    //             var account = basicDiv.querySelector("#select_accountSwitchBtn").getAttribute("account");
    //             self._removeGou(listContainer);
    //             self._addGou(listContainer,account);
    //         }
    //         mark = true;
    //     }
    //     return mark;
    // };
    selectOrg.prototype._renderOrgTemp = function(result,keyWord) {
        var self = this;
        var selectType = result.selectType;
        var widgetType = result.widgetType;
        var tempType = result.tempType;
        var children = result.children;
        var parentType = result.type?result.type.toLocaleLowerCase():null;
        //****数据类型 = 人员/部门/首页/  或 组件为流程选人  或  轻表单选人&数据类型是岗位---使用部门/人员模板 或vj单位人员（vjoin_1,vjoin_2）
        //****其余类型使用岗位/单位/职务级别模板
        var itemTemp = (tempType == selectOrgConstant.C_iType_Member
            || tempType == selectOrgConstant.C_iType_Department
            || tempType == selectOrgConstant.C_iType_All
            || tempType == selectOrgConstant.C_iType_vjUnit
            || (tempType == selectOrgConstant.C_iType_vjDepartment && selectType!="account")
            || (tempType == selectOrgConstant.C_iType_vjAccount && selectType == "member")
            || widgetType == selectOrgConstant.C_iFlowSelect

            || (widgetType == selectOrgConstant.C_iLightFormSelect
                && tempType == selectOrgConstant.C_iType_Team)
            || (widgetType == selectOrgConstant.C_iLightFormSelect && selectType == selectOrgConstant.C_sSelectType_member && tempType == selectOrgConstant.C_iType_Post))
            ? selectMDItem() : selectAPLItem();

        var i = 0,len = children.length;
        for(; i <len; i ++) {
            var head = '',name = '',subName = '',type = self._convertVOType(children[i]);
            switch (type){
                case selectOrgConstant.C_iType_Department:
                case selectOrgConstant.C_iType_vjUnit:
                case selectOrgConstant.C_iType_vjAccount:
                    self._setFirstWord(i,children[i]);
                    if(type == selectOrgConstant.C_iType_vjUnit){ //OA-128827
                        if(self.opts.type == 2 && self.opts.selectType == "member"  && children[i].amn == "0"){
                            children[i].displayNone = true;//此条数据不显示
                            continue;
                        }
                    }
                    children[i].n = children[i].n.escapeHTML();
                    if(!self.isExtAccount){
                        children[i].san = null;//无简称
                    }
                    subName =  children[i].amn?'('+children[i].amn+')':'(0)';
                    if(self.opts.type == selectOrgConstant.C_iFlowSelect) {
                        children[i].accountID = self.account["id"];
                        children[i].accountName = self.account["name"];
                        children[i].accountShortname = self.account["shortname"];
                    }
                    children[i].multitype = self.opts.multitype;
                    if(widgetType == 2){
                        if(selectType == "member" && !self.opts.multitype){
                            children[i].light_memDept_cs_no = true;//判断轻表单选人中部门是否【不】能被整体选中，如果为true不显示复选框按钮
                        }
                    }
                    if(self.opts.type != selectOrgConstant.C_iLightFormSelect){ //如果不是轻表单选人，需要进行权限控制
                        children[i].allDept_cs_no = children[i].cs == selectOrgConstant.C_iWholeChoose_cant || children[i].acs == selectOrgConstant.C_iWholeChoose_cant?true:false;//判断部门是否【不】能被整体选中，如果为true不显示复选框按钮
                        if(!self.opts.permission && parentType != "extaccount"){//不受当前登录人员的权限控制，部门、岗位、组可整体选中
                            children[i].allDept_cs_no = false;//要显示复选框按钮
                        }
                    }

                    children[i].allDept_Mem_choosed = result.allDChoose;  //判断是否选中部门时，已经被包含了子部门
                    if(!keyWord && !children[i].searchHistoryData){//如果不是搜索操作
                        children[i].nextLevel = true;
                        if((children[i].hs == 0 && self.opts.selectType.indexOf("department") != -1) || self.teamMemberData){//OA-128029
                            children[i].nextLevel = false;
                        }
                    }
                    if(parentType == "extaccount"){
                        children[i].extAccount = true;
                    }
                    if(parentType == "extaccount" || self.opts.selectType.indexOf("department") != -1 || self.teamMemberData){//外单位和轻表单选部门(包括vj单位，vj部门)不需要统计人员数量
                        children[i].noSubName =true;
                        subName = "";
                    }
                    var hs = parseInt(children[i].hs);
                    if(children[i].amn && parseInt(children[i].amn ) > 0){ //如果包括子部门的总人数是大于0的则不是空部门（流程选人逻辑太复杂，只能这样判断了）
                        children[i].emptyDepartment = false;
                    }else {  //如果包括子部门的总人数等于0，则要判断是否有子部门
                        if(hs == 0) { //如果没有子部门则完完全全是空部门
                            children[i].emptyDepartment = true;//空部门  选中时要给提示
                        }else { //如果有子部门的话需要判断是否是流程选人
                            if(self.opts.type == selectOrgConstant.C_iFlowSelect){  //流程选人的话即使有子部门，但是总人数是0也是空部门
                                children[i].emptyDepartment = true;
                            }else {  //其他情况，只要有子部门，无论总人数是否为0，都认为不是空部门
                                children[i].emptyDepartment = false;
                            }
                        }
                    }
                    children[i].subDepartmentHasMember = (children[i].mN && parseInt(children[i].mN ) > 0)?true:false;//判断下一级子部门是否存在人员（用于整体选中部门后，但是该部门下只有子部门而没有人员，当点击【不包含子部门】时，意思是选中的是子部门的人员，但是子部门没有人员，那么就不应该被选中）
                    break;
                case selectOrgConstant.C_iType_Member:
                    head = memberH + "/" + children[i].id + "?maxWidth=200";
                    subName = children[i].p;
                    children[i].accountID = self.account["id"];
                    children[i].accountName = self.account["name"];
                    children[i].accountShortname = self.account["shortname"];
                    if(result.allMChoose){
                        if(!children[i].recentPerson){
                            children[i].allDept_Mem_choosed = result.allMChoose;
                        }
                    }
                     //判断是否选中部门时，人员已经被全选
                    if(children[i].tmt){ //组成员的相关人员不能被选
                        if(children[i].tmt == selectOrgConstant.C_iTeamMember_leader
                            || children[i].tmt == selectOrgConstant.C_iTeamMember_related){
                            children[i].relevant = true;
                        }
                    }
                    if(parentType == "team" || parentType == "post"){
                        if(self.orgChain.inArray(result.id)){
                            if(parentType == "team" && !children[i].relevant){ //如果是组成员，如果既不是相关人员，但是该组以被整体选中的情况时，设置该项默认是被选的
                                children[i].allOrg_Mem_choosed = true;//复选框显示被选中状态
                            }else if(parentType == "post"){                    //岗位被整体选，其下人员也被全部选中
                                children[i].allOrg_Mem_choosed = true;
                            }
                        }
                    }
                    children[i].head =head;
                    if(self.isExtAccount && self.extAccountSan){ //如果是外单位人员，需要带上外单位的简称
                        children[i].san = self.extAccountSan;
                    }
                    break;
                case selectOrgConstant.C_iType_Post:
                    if(widgetType == selectOrgConstant.C_iFlowSelect || (widgetType == selectOrgConstant.C_iLightFormSelect && selectType == selectOrgConstant.C_sSelectType_member)){//如果是流程选人，所有的部门都是这样（因为和人员信息一起返回的）||或者是轻表单选人（注意是选人）的话
                        children[i].noSubName = true;
                        children[i].n = children[i].n.escapeHTML();
                        if(!keyWord && !children[i].searchHistoryData){
                            children[i].nextLevel = true;
                            if(self.teamMemberData){
                                children[i].nextLevel = false;
                            }
                        }
                        if(self.opts.type != selectOrgConstant.C_iLightFormSelect){
                            children[i].allDept_cs_no = children[i].cs == selectOrgConstant.C_iWholeChoose_cant?true:false;//如果为true则不显示复选框按钮
                            if(!self.opts.permission){//不受当前登录人员的权限控制，部门、岗位、组可整体选中
                                children[i].allDept_cs_no = false;
                            }
                        }
                    }
                    self._setFirstWord(i,children[i]);
                    if(self.opts.type == selectOrgConstant.C_iLightFormSelect && self.opts.selectType == "member" && !self.opts.multitype){ //轻表单选人如果不是多类型选择的话，不能被整体选中
                        children[i].light_memDept_cs_no = true;//不显示复选框按钮
                    }
                    if(!self.isExtAccount){
                        children[i].san = null;
                    }
                    if(self.opts.type == selectOrgConstant.C_iLightFormSelect){
                        children[i].cs = "1";
                    }else {
                        if(children[i].amn && parseInt(children[i].amn ) > 0){//需要过滤空岗位
                            children[i].emptyPost = false;
                        }else {
                            children[i].emptyPost = true;
                        }
                    }

                    break;
                case selectOrgConstant.C_iType_Team://组
                    switch (children[i].tt){
                        case selectOrgConstant.C_iTeamType_personal:
                            subName = _.i18n("cmp.selectOrg.team_person");
                            break;
                        case selectOrgConstant.C_iTeamType_discuss:
                            subName = _.i18n("cmp.selectOrg.team_discuss");
                            break;
                        case selectOrgConstant.C_iTeamType_project:
                            subName = _.i18n("cmp.selectOrg.team_project");
                            break;
                        case selectOrgConstant.C_iTeamType_system:
                            subName = _.i18n("cmp.selectOrg.team_system");
                            break;
                    }
                    children[i].n = children[i].n.escapeHTML();
                    self._setFirstWord(i,children[i]);
                    if(!keyWord && !children[i].searchHistoryData){
                        children[i].nextLevel = true;
                        if(self.teamMemberData){
                            children[i].nextLevel = false;
                            children[i].noSubName =true;
                            subName = "";
                        }
                    }
                    if(self.opts.type == selectOrgConstant.C_iLightFormSelect && !self.opts.multitype){ //轻表单选人如果不是多类型选择的话，不能被整体选中，
                        children[i].light_memDept_cs_no = true;//不显示复选框按钮
                    }
                    break;
                case selectOrgConstant.C_iType_Level://职务级别
                    //TODO 职务级别数据转换
                    if(!self.isExtAccount){
                        children[i].san = null;
                    }
                    self._setFirstWord(i,children[i]);
                    children[i].n = children[i].n.escapeHTML();
                    children[i].noSubName =true;
                    break;
                case selectOrgConstant.C_iType_All:
                    if(children[i].et == "member") {
                        head = self.ip + children[i].icon;
                        subName = children[i].p;
                        type = selectOrgConstant.C_iType_Member;
                        children[i].head =head;
                    }else {
                        subName = "";
                        children[i].n = children[i].n.escapeHTML();
                        type = selectOrgConstant.C_iType_Department;
                        children[i].topLevel = result.home?true:false;
                        children[i].topLevelType = children[i].type;
                        self._setFirstWord(i,children[i]);
                        if(!keyWord && !children[i].searchHistoryData){
                            children[i].nextLevel = true;
                            if(self.teamMemberData){
                                children[i].nextLevel = false;
                                children[i].noSubName =true;
                                subName = "";
                            }
                        }
                        if(!self.opts.permission){//不受当前登录人员的权限控制，部门、岗位、组、本单位、本部门可整体选中
                            children[i].allDept_cs_no = false;
                        }
                        if(self.memberType == 1 && children[i].topLevelType == "org"){//如果是编外人员登陆，则不能选择【本单位】
                            children[i].allDept_cs_no = true;
                        }
                    }
                    break;
                case selectOrgConstant.C_iType_vjDepartment://外部单位类型
                    children[i].noSubName =true;
                    if(self.opts.selectType == selectOrgConstant.C_sSelectType_department_vj1) {
                        children[i].displayNone = true;
                        continue;
                    }
                    self._setFirstWord(i,children[i]);
                    break;
                default :
                    self._setFirstWord(i,children[i]);
                    break;
            }
            var idKey = children[i].id,iddKey = children[i].idd;
            if(self.excludeData[idKey]||self.excludeData[iddKey]){
                children[i].excluded = true;
                if(children[i].topLevel){
                    children[i].chooseable = false;
                }
                if((self.excludeData[idKey]&&self.excludeData[idKey].disable) || (self.excludeData[iddKey]&&self.excludeData[iddKey].disable)){
                    children[i].disable = true;
                }
                if((self.excludeData[idKey]&& self.excludeData[idKey].display == "none") || (self.excludeData[iddKey]&& self.excludeData[iddKey].display == "none")){
                    children[i].displayNone = true;
                }
            }
            children[i].type = type;
            children[i].subName = subName;
            if(self.opts.type == 1){
                children[i].flow_et_choosable_no = self.choosableType.indexOf(type) == -1;//流程选人，判断对应的数据类型是否【不】能被整体选中，如果开发者配置了choosableType,那么只能选择符合choosableType的数据，如果数据不符合，则不显示复选框按钮
            }
        }
        if(keyWord) result.keyWord = keyWord;
        return _.tpl(itemTemp,result);//point
    };
    //部门、流程--部门、流程--岗位、流程--组设置firstword
    selectOrg.prototype._setFirstWord = function(i,child){
        child.firstWord = child.n.substring(0,1);
        var idd = child.idd?child.idd:child.id;
        child.head =idd + "|" + child.firstWord;
        child.showFirstWord = true;
    };
    selectOrg.prototype._renderNothing = function(content){
        var self = this;
        setTimeout(function(){
			//主动给无数据内容外层容器计算一个高，让无内容提示始终居中显示
            content.innerHTML = noThingItem();
            content.parentElement.parentElement.classList.add("select-selected-scroll");
            var headerH = self.basicDiv.querySelector('header.cmp-select-header').offsetHeight;
            var noContents = self.basicDiv.querySelectorAll(".cmp-selectOrg-list-center");
            if(noContents.length){
                for(var i = 0;i<noContents.length;i++){
                    noContents[i].style.height = window.innerHeight - headerH +"px";
                }
                self.scrollerCache['content'].scrollTo(0,0);
            }

        },0);
        var pullBottomPocket =  content.parentNode.querySelector(".cmp-pull-bottom-pocket");
        var pullTopPocket = content.parentNode.parentNode.querySelector(".cmp-pull-top-pocket");
        if(pullBottomPocket){
            setTimeout(function(){
                pullBottomPocket.style.opacity= 0;
            },0);
        }
        if(pullTopPocket){
            setTimeout(function(){
                pullTopPocket.style.opacity = 0;
            },0);

        }
    }
    selectOrg.prototype._allWidgetPartReset = function(basicDiv){
        var self = this;
        self._renderSearchArea(basicDiv,false);
        self.initFocus = true;
        self.doSearch = false;
        var contentTitleSearch = basicDiv.querySelector("#select_contentTitleSearch");
        if(contentTitleSearch) contentTitleSearch.style.display = "block";
        var selectedScroll = basicDiv.querySelector("#select_selectedList_scroll_" + self.uuID);
        if(selectedScroll){
            if(self.preSelectDataCache.length == 0){
                if(selectedScroll.classList.contains("cmp-active")){
                    selectedScroll.classList.remove("cmp-active");
                    selectedScroll.classList.add("cmp-hidden");
                    self._changeScrollWrapperH(basicDiv,"content");
                }
            }
        }
        var flowRadios = basicDiv.querySelectorAll("input[name=radio1]");
        if(flowRadios && flowRadios.length > 0){
            flowRadios[0].checked = false;
            flowRadios[1].checked = true;
        }
    };
    selectOrg.prototype._setAccount = function(accountBtn,backBtn,data){
        var self  = this;
        var account = data.aID.replace("top_","");
        accountBtn.setAttribute("account",account); //xinpei
        backBtn.setAttribute("account",account);
    };
    selectOrg.prototype._setRank = function(backBtn,orgData){
        var parentPath = orgData.pph;
        var path = orgData.ph;
        backBtn.setAttribute("parentPath",parentPath);
        backBtn.setAttribute("path",path);
    };
    selectOrg.prototype._toNextRank = function(listContainer,preLevel,orgData,tpl,scroller,nextLevel){
        var self = this;
        var upperRankPath = preLevel.getAttribute("path");
        var upperRankParentPath = preLevel.getAttribute("parentPath");
        var upperRankHtml = listContainer.innerHTML;
        if(!self.rankCache[upperRankPath]){
            self.rankCache[upperRankPath] = upperRankHtml;//将父级html缓存
            self.rankParentIDCache[upperRankPath] = upperRankParentPath;//将父级的父级单位ID缓存
        }
        var path = orgData.ph;
        var nextRankList = '';
        if(self.rankCache[path]) {
            nextRankList = self.rankCache[path];
        }else {
            nextRankList = _.tpl(tpl,orgData);
        }
        listContainer.innerHTML = nextRankList;
        nextLevel.setAttribute("path",path);
        nextLevel.setAttribute("parentPath",upperRankPath);
        scroller.refresh();
        var account = self.basicDiv.querySelector("#select_accountSwitchBtn").getAttribute("account");
        self._removeGou(listContainer);
        self._addGou(listContainer,account);
    };
    selectOrg.prototype._toUpperRank = function(listContainer,backBtn,scroller){
        var self=  this;
        var upperRankPath = backBtn.getAttribute("parentPath");
        if(upperRankPath == "" || upperRankPath.length == 0) return false;
        if(!self.rankCache[upperRankPath]) return false;
        var childRankPath = backBtn.getAttribute("path");
        var childRankHtml = listContainer.innerHTML;
        if(!self.rankCache[childRankPath]){
            self.rankCache[childRankPath] = childRankHtml;
        }
        listContainer.innerHTML = self.rankCache[upperRankPath];
        backBtn.setAttribute("path",upperRankPath);
        backBtn.setAttribute("parentPath",self.rankParentIDCache[upperRankPath]);
        scroller.refresh();
        return true;
    };
    selectOrg.prototype._selectRank = function(listContainer,selectBtn,scroller){//可能只有面包屑才能用上
        var self = this;
        var path = selectBtn.getAttribute("path");
        var parentPath = selectBtn.getAttribute("parentPath");
        listContainer.innerHTML = self.rankCache[path];
        scroller.refresh();
    };


    //================================================================事件部分===========================================================//
    selectOrg.prototype._event = function(basicDiv) {
        var self = this;
        self._chooseEvent(basicDiv,"select_listContent");
        if(self.initBindEvent == true){
            self._forbidTouchMoveEvent(basicDiv);
            self._backEvent(basicDiv);
            self._searchEvent(basicDiv);
        }
        if(self.opts.selectType != selectOrgConstant.C_sSelectType_account && self.initBindEvent == true) {
            self._accountSwitchEvent(basicDiv);
        }
        if(self.opts.type == selectOrgConstant.C_iFlowSelect && self.initBindEvent == true) {
            self._flowSelectEvent(basicDiv);
        }else if(self.opts.type == selectOrgConstant.C_iLightFormSelect && self.initBindEvent == true){
            self._lightSelectEvent(basicDiv);
        }
        self._crumbsEvent(basicDiv);
        self._moreEvent(basicDiv);
        self.initBindEvent = false;//避免ok事件被重复绑定
    };
    selectOrg.prototype._forbidTouchMoveEvent = function(basicDiv) {
        basicDiv.addEventListener("touchmove",function(e){
            e.preventDefault();
        },false);
    };
    selectOrg.prototype._closeEvent = function(basicDiv) {
        var self = this;
        var closeBtn = basicDiv.querySelector("#select_closeBack");
        if(closeBtn){
            _.event.click(closeBtn,function(){
                self._doClose(basicDiv);
            });
        }
    };
    selectOrg.prototype._doClose = function(basicDiv){
        var self = this;
        if(self.opts._transed == true || self.opts._transed == 'true') {
            self.opts.fillBackData = self.preSelectDataCache;
            self._handleJumpPageOrgResult(null);
        }else {
            self._close(basicDiv);
            self._cacheSelectedData();
            self.runOKEevent = false;
            self.deptChain = {};
            var closeCallback = self.opts.closeCallback;
            if(closeCallback && typeof closeCallback == "function"){
                closeCallback();
            }
        }
    };
    selectOrg.prototype._backEvent = function(basicDiv) {
        var self=  this;
        // var backBtn = basicDiv.querySelector('#select_btnBack');
        // _.event.click(backBtn,function(){
        //     if(self.opts.type == selectOrgConstant.C_iLightFormSelect && self.opts.selectType == selectOrgConstant.C_sSelectType_account) {
        //         self._close(basicDiv);
        //         var closeCallback = self.opts.closeCallback;
        //         if(closeCallback && typeof closeCallback == "function"){
        //             closeCallback();
        //         }
        //     }else {
        //         self._contentBlockChange("backBtn",basicDiv);
        //     }
        // })
    };
    selectOrg.prototype._noDataBackEvent = function(){
        var self = this;
        // var backBtn = self.basicDiv.querySelector('#select_btnBack');
        // _.event.click(backBtn,function(){
        //     self._close(self.basicDiv);
        // })
    };
    selectOrg.prototype._contentBlockChange = function(type,basicDiv,id) {
        var self = this;
        if(type == "backBtn") {
            var parent = self.path.parent+"";
            var child = self.path.self+"";
            var backBtnAccount = basicDiv.querySelector("#select_btnBack").getAttribute("account");
            if(self._flowContentRequestParam(parent,backBtnAccount) != -1){
                var parentParent = self.parentParent[parent];
                self.path = {parent:parentParent,self:parent};
                self._updateCrumbs(basicDiv.querySelector("#select_crumbs_list"),{id:child},selectOrgConstant.C_sCrumbChange_reduce,"crumbs");
                self.scrollerCache['content'].loading = false;
                self.scrollerCache['content'].pullupLoading(1);
            }else {   //修改，回到首页时再点击返回按钮就关闭组件
                if(self.opts._transed == true || self.opts._transed == "true") {
                    self._handleJumpPageOrgResult(null);
                }else {
                    self._close(basicDiv);
                    self._cacheSelectedData();
                    self.runOKEevent = false;
                    self.deptChain = {};
                    var closeCallback = self.opts.closeCallback;
                    if(closeCallback && typeof closeCallback == "function"){
                        closeCallback();
                    }
                }
            }
        }else if(type == "crumbBtn") {
            if(id) {
                self._flowContentRequestParam(id);
                var parentParent = self.parentParent[id];
                self.path = {parent:parentParent,self:id};
                self._updateCrumbs(basicDiv.querySelector("#select_crumbs_list"),{id:id},selectOrgConstant.C_sCrumbChange_choose,"crumbs");
            }
        }
    };
    selectOrg.prototype._flowContentRequestParam = function(id,account){
        var self = this;
        if(id.indexOf(selectOrgConstant.C_oFlowHome.parentPath) > -1) return -1;
        if(id == "undefined") return -1;
        var orgDataUrl;
        if(id.indexOf("all") > -1) { //到首页的下一页
            orgDataUrl = self._getOrgUrl(selectOrgConstant.C_sSelectType_all,id);
        }else if(id.indexOf(selectOrgConstant.C_oFlowHome.id) > -1 || id.indexOf("top") > -1) {//到首页
            if(self.opts.type == selectOrgConstant.C_iLightFormSelect) {
                switch (self.opts.selectType){
                    case "department":
                        orgDataUrl = self._getOrgUrl(selectOrgConstant.C_sSelectType_department,self.currentAccount);
                        break;
                    case "department_vj1":
                        orgDataUrl = self._getOrgUrl(selectOrgConstant.C_sSelectType_department_vj1,self.currentAccount);
                        break;
                    case "member":
//                        return -1;
                        orgDataUrl = self._getOrgUrl(selectOrgConstant.C_sSelectType_all,self.currentAccount);
                        break;
                }
            }else {
                orgDataUrl = self._getOrgUrl(selectOrgConstant.C_sSelectType_all,self.currentAccount);
            }
        }else{
            if(self.opts.type == selectOrgConstant.C_iFlowSelect) { //如果是流程表单
                var urlType = self.vjNext ? selectOrgConstant.C_sSelectType_vjDepartment_member:selectOrgConstant.C_sSelectType_department_member;//根据vj插件权限来判断
                orgDataUrl = self._getOrgUrl(urlType,id);
            }else if(self.opts.type == selectOrgConstant.C_iLightFormSelect) { //如果是轻表单
                if(id == self.currentAccount) {   //如果是轻表单选部门或者轻表单选人到了首页
                    switch(self.opts.selectType){
                        case "department":
                            orgDataUrl = self._getOrgUrl(selectOrgConstant.C_sSelectType_department,id);
                            break;
                        case "member":
                            orgDataUrl = self._getOrgUrl(selectOrgConstant.C_sSelectType_light_member,id);
                            break;
                    }
                }else {
                    switch (self.opts.selectType){
                        case "member"://如果是轻表单选人不受职务级别控制
                            var urlType = selectOrgConstant.C_sSelectType_light_department_member;
                            if(self.vjNext || (self.opts.type ==2 && self.opts.vj)) {
                                urlType = selectOrgConstant.C_sSelectType_light_vjDepartment_member
                            }
                            orgDataUrl = self._getOrgUrl(urlType,id);
                            break;
                        case "department_vj1"://选vj组织机构
                            orgDataUrl = self._getOrgUrl(selectOrgConstant.C_sSelectType_light_department_subvjunits,id);
                            break;
                        default:
                            orgDataUrl = self._getOrgUrl(selectOrgConstant.C_sSelectType_light_department,id);//如果是轻表单部门
                            break;
                    }
                }
            }
        }
        self.initRenderContent = true;
        self.orgDataUrl = orgDataUrl;
    };

    selectOrg.prototype._chooseEvent = function(basicDiv,id,isSearch){
        var self = this;
        var items = basicDiv.querySelector("#"+id).children;
        var listContentCheckboxs = basicDiv.querySelector("#" + id).getElementsByTagName("input");
        var listContainer = basicDiv.querySelector('#select_selectedList');
        var listNum = basicDiv.querySelector('#select_selectedNum');
        var crubmsContainer = basicDiv.querySelector("#select_crumbs_list");
        var i = 0,len = items.length;
        for(; i < len; i ++) {
            (function(i){
                var item = items[i];
                var rightArrow = item.querySelector(".select_accountHref");
                var isBinded = item.classList.contains("binded");
                if(!isBinded){
                    item.addEventListener("tap",function(){
                        var isRadio = (self.opts.maxSize == 1)?true:false;
                        var tipDepaetmentChain = false;//由于选人组件的复杂逻辑，只能有这个标识来判断是否已经弹框提示了
                        var checkbox = this.querySelector("input");
                        if(checkbox){
                            if(checkbox.classList.contains("choosed") || checkbox.classList.contains("excluded")) return;  //部门链中已被选人员或者(组人员的相关人员不能再被选中  || checkbox.classList.contains("relevant")----2017.04.25杨玉凯发现相关人员是可以被选中的)
                            var info = checkbox.getAttribute("info");
                            var infoObj = _.parseJSON(info);
                            var name = infoObj.n;
                            //======================流程选人，选整体岗位时有超过职务级别的人员不能访问的过滤和提示 start===========//
                            if(infoObj.et && ("post" == infoObj.et.toLocaleLowerCase()) && self.opts.type == selectOrgConstant.C_iFlowSelect){
                                if(infoObj.cs == selectOrgConstant.C_iWholeChoose_cant && self.opts.permission) {//岗位数据如果是流程选人并且permission设置成true才受权限控制
                                    _.notification.alert(_.i18n("cmp.selectOrg.beyondLevel",[name]),null,_.i18n("cmp.selectOrg.tip"),_.i18n("cmp.selectOrg.confirm"));
                                    return;
                                }
                            }
                            //======================流程选人，选整体岗位时有超过职务级别的人员不能访问的过滤和提示  end=========//

                            //======================进行空部门过滤和提示 start(轻表单部门不过滤)=========================//
                            if(self.opts.selectType != "department" && self.opts.selectType != "post"){
                                if(infoObj.et && ("department" == infoObj.et.toLocaleLowerCase() || "post" == infoObj.et.toLocaleLowerCase())){
                                    if((infoObj.emptyDepartment && !self.opts.directDepartment) || infoObj.emptyPost) {//空部门并且受权限控制时才弹框 || 流程选人空岗位要提示
                                        _.notification.alert(_.i18n("cmp.selectOrg.noMember",[name]),null,_.i18n("cmp.selectOrg.tip"),_.i18n("cmp.selectOrg.confirm"));
                                        return;
                                    }
                                }
                            }

                            //======================进行空部门过滤和提示  end=======================//
                            var id = checkbox.getAttribute("id"); var isDelete = false;
                            if(self.flowType && self.flowType != null && self.flowType == selectOrgConstant.C_iFlowSelect_replace){
                                var checked = checkbox.checked;
                                self._resetCheckBox(listContentCheckboxs);
                                if(checked) {
                                    checkbox.checked = false;
                                }else {
                                    checkbox.checked = true;
                                }
                            }else {
                                var checked = checkbox.checked;
                                if(isRadio){
                                    self._resetCheckBox(listContentCheckboxs);
                                }
                                if(self.cancelRadio) {//即可以取消单选的情况
                                    if(checked) {
                                        checkbox.checked = false;
                                    }else {
                                        checkbox.checked = true;
                                    }
                                }else {
                                    self._selectBtnSwitch(checkbox);
                                }
                            }
                            if(checkbox.checked == true) {
                                checkbox.style.opacity = 1;
                                var preSelectData = self.selectDataCache[0];//流程替换操作时，需要将前一个已选数据取出，（可能这个数据是部门，做替换操作时，需要将部门链也进行替换）
                                if(!isSearch) {
                                    if(self.opts.selectType != "department" || infoObj.topLevel){   //轻表单选部门不设置部门链或选【本单位】、【本部门】要设置部门链
                                        var replaceMark = (self.flowType && self.flowType == selectOrgConstant.C_iFlowSelect_replace)?true:null;
                                        self._setDeptChain(info,basicDiv,null,true,replaceMark,preSelectData,checkbox);
                                        self._setOrgChain(info,true);
                                        tipDepaetmentChain = true;
                                    }
                                }
                                if(isRadio || (self.flowType && self.flowType != null && self.flowType == selectOrgConstant.C_iFlowSelect_replace)){
                                    self.selectDataCache = [];
                                    self.selectDataIDCache = [];
                                }
                                self.selectDataCache.push(info);

                                self.selectDataIDCache.push(self._handleDepartmentID(id));
                                if(isSearch){
                                    //self._updateSearchHistory(infoObj);//注释掉搜索历史更新  OA-149584  
                                }
                                if(self.flowType && self.flowType == selectOrgConstant.C_iFlowSelect_replace) { //如果是替换，则需要将部门链进行替换
                                    if(!tipDepaetmentChain){ //如果弹框了就不再重复提示了
                                        self._setDeptChain(info,basicDiv,null,true,true,preSelectData,checkbox);
                                    }
                                }
                                if(infoObj.topLevel && infoObj.topLevelType == "org"){//如果选中的是【本单位】
                                    self.accountChoosed = infoObj.idd;
                                }
                            }else {
                                self._setDeptChain(info,basicDiv,null,false,null,null,checkbox);
                                self._setOrgChain(info,false);
                                self._delSelectedDataById(info);
                                self.selectDataIDCache.delItem(self._handleDepartmentID(id));
                                isDelete = true;
                                if(infoObj.topLevel && infoObj.topLevelType == "org"){//如果取消的是本单位
                                    self.accountChoosed = 0;
                                }
                            }
                            if(self.opts.type == selectOrgConstant.C_iLightFormSelect) {
                                if(isRadio){
                                    if(self.opts._transed == true){
                                        var orgResult = new orgResultObj(selectOrgConstant.C_sOrgResult_light,self.selectDataCache);
                                        self._handleJumpPageOrgResult(orgResult);
                                    }else {
                                        if(!self.cancelRadio) {//如果是不可以单选取消的话
                                            try{  //做单选的错误防护，如果开发者的回调函数是错的，那么也会关闭组件
                                                if(self.opts.callback != null && typeof self.opts.callback == 'function') {
                                                    var callback = self.opts.callback;
                                                    var orgResult = new orgResultObj(selectOrgConstant.C_sOrgResult_light,self.selectDataCache);
                                                    callback(_.toJSON(orgResult));
                                                }
                                                self._close(basicDiv);
                                                self._cachePreSelectedData();
                                                self.runOKEevent = true;
                                            }catch (e){
                                                self._close(basicDiv);
                                                self._cachePreSelectedData();
                                                self.runOKEevent = true;
                                            }
                                        }else {
                                            if(listNum) {
                                                listNum.innerHTML = self.selectDataCache.length;
                                                if((self.opts.selectType == selectOrgConstant.C_sSelectType_member || self.opts.selectType == selectOrgConstant.C_sSelectType_department) && self.opts.maxSize != 1){
                                                    self._renderSelectArea(basicDiv,listContainer,info,isDelete,isSearch);
                                                    self._updateSelectedAreaAfterSelectedItemRenderComplate(basicDiv,isSearch);
                                                }
                                            }
                                        }
                                    }
                                }else {
                                    if(listNum) {
                                        listNum.innerHTML = self.selectDataCache.length;
                                        if(self.opts.maxSize != 1){
                                            self._renderSelectArea(basicDiv,listContainer,info,isDelete,isSearch);
                                            self._updateSelectedAreaAfterSelectedItemRenderComplate(basicDiv,isSearch);
                                        }
                                    }
                                }
                            }else {
                                self._renderSelectArea(basicDiv,listContainer,info,isDelete,isSearch,isRadio);
                                self._updateSelectedAreaAfterSelectedItemRenderComplate(basicDiv,isSearch);
                            }
                        }
                    },false);
                    if(rightArrow) {
                        rightArrow.addEventListener("tap",function(event){
                            event.stopPropagation();
                            self.vjNext = false;
                            var info = this.getAttribute("info");
                            if(self.opts.type == selectOrgConstant.C_iLightFormSelect && self.opts.selectType == selectOrgConstant.C_sSelectType_account) {
                                self._toNextLevelAccount(basicDiv,info,selectOrgConstant.C_iAccountRenderType_Content);
                                self._renderFillback(basicDiv,"select_listContent");
                                self._event(basicDiv);
                            }else {
                                var info = _.parseJSON(info);
                                if(info.topLevel){
                                    self.orgDataUrl = self._getOrgUrl(selectOrgConstant.C_sSelectType_all,info.id);
                                    self.initRenderContent = true;
                                }else {
                                    var et = info.et.toLocaleLowerCase();
                                    switch(self.opts.selectType){
                                        case "member":
                                            if(info.extAccount){//如果是外单位标签
                                                self.orgDataUrl = self._getOrgUrl(selectOrgConstant.C_sSelectType_extAccount_member,info.id);
                                            }else {
                                                if(self.opts.type == 1) {
                                                    if(et.indexOf("vjoin") != -1) {
                                                        et = "vjDeparment";
                                                        self.vjNext = true;
                                                    }
                                                    self.orgDataUrl = self._getOrgUrl(et + "_member", info.id);
                                                }else {
                                                    var urlType;
                                                    switch(et){
                                                        case "post"://轻表单首页岗位页签的下一级
                                                            urlType = selectOrgConstant.C_sSelectType_post_member;
                                                            break;
                                                        case "team"://轻表单首页组页签的下一级
                                                            urlType = selectOrgConstant.C_sSelectType_team_member;
                                                            break;
                                                        case "extaccount"://轻表单首页外部人员页签的下一级人员
                                                            urlType = selectOrgConstant.C_sSelectType_extAccount_member;
                                                            break;
                                                        case "vjoin_1":
                                                        case "vjoin_2":
                                                            self.vjNext = true;
                                                            urlType = selectOrgConstant.C_sSelectType_light_vjDepartment_member;
                                                            break;
                                                        default:
                                                            urlType = selectOrgConstant.C_sSelectType_light_department_member;
                                                            break;
                                                    }
                                                    self.orgDataUrl = self._getOrgUrl(urlType,info.id);
                                                }
                                            }
                                            break;
                                        case "department":
                                            self.orgDataUrl = self._getOrgUrl(selectOrgConstant.C_sSelectType_light_department,info.id);
                                            break;
                                        case "department_vj1":
                                            self.orgDataUrl = self._getOrgUrl(selectOrgConstant.C_sSelectType_light_department_subvjunits,info.id);
                                            break;
                                        default :
                                            self.orgDataUrl = self._getOrgUrl(et,info.id);
                                            break;
                                    }
                                    self.initRenderContent = true;
                                }
                                if(info.id.indexOf("allSelfDepartment") == -1){//点击本部门的时候需要处理ap
                                    self._updateCrumbs(crubmsContainer,info,selectOrgConstant.C_sCrumbChange_increase,"crumbs");
                                    var parent = self.path.self;
                                    self.parentParent[parent] = self.path.parent;
                                    self.path = {parent:parent,self:info.id};
                                    var deptChainParent = parent.indexOf("_")!=-1?parent.substring(parent.indexOf("_")+1):parent;
                                    if(!info.extAccount){//编外人员的下一级按钮  不进行部门链，避免点击选中【本单位】时，编外人员下的部门和人员全部被选中 OA-142281
                                        self._updateDeptChain(info,deptChainParent);
                                    }

                                }
                                self.scrollerCache['content'].loading = false;
                                self.scrollerCache['content'].pullupLoading(1);
                            }

                        },false);
                    }
                    item.classList.add("binded");
                }

            })(i);
        }
    };
    /**
     * 设置部门链，实现当选择整体部门的时候，下一级的元素不被选
     * @param data  当前选中的数据
     * @param basicDiv  组件ui
     * @param parent   部门链的父部门id
     * @param isAdd   是否增加部门链true：增加；false：清除该id下的部门链
     * @param isReplace  是否是部门链替换操作
     * @param preSelectData  将要被替换的部门链
     * @private
     */
    selectOrg.prototype._setDeptChain = function(data,basicDiv,parent,isAdd,isReplace,preSelectData,checkbox){
        var self = this;
        var dataObj = _.parseJSON(data);
        var dataObjID = dataObj.topLevel?dataObj.idd:dataObj.id;
        if(dataObj.et && (dataObj.et.toLocaleLowerCase() == selectOrgConstant.C_sSelectType_department || dataObj.et == "all")){//只对数据类型是部门或者是首页的【本部门】、【本单位】数据才进行操作
            if(isAdd) {//如果是增加
                if(isReplace && isReplace == true && preSelectData) { //是替换操作
                    preSelectData = _.parseJSON(preSelectData);
                    var preSelectDataID = preSelectData.topLevel?preSelectData.idd:preSelectData.id;
                    if(self.deptChain[preSelectDataID]) self.deptChain[preSelectDataID] = null;
                }

                self.deptChain[dataObjID] = {
                    parent:parent?parent:"",
                    id:dataObjID
                };
                if(dataObj.topLevel && !self.opts.directDepartment){
                    self.deptChain[dataObjID].containSub = true;
                }
                if(dataObj.hs && dataObj.hs == selectOrgConstant.C_iDepartmentHasChildren_yes){  //如果部门下包含有子部门
                    if(self.opts.directDepartment){//如果设置了不弹是否包含子部门的提示，则只设置部门链
                        self.deptChain[dataObjID].containSub = false;
                        dataObj.containSub = 0;
                    }else {//默认是需要弹是否包含子部门的提示
                        _.notification.confirm(_.i18n("cmp.selectOrg.isContainSub"), function (index) {  //提示是否包含子部门
                            var containSub = "";
                            var subDeptTitle = document.createElement("span");
                            if(index == 1) {  //选的是【是】-----包含子部门
                                if(dataObj.acs && parseInt(dataObj.acs) == 0 && self.opts.permission){ //包含子部门要判断是否有超过职务级别的人
                                    var name = dataObj.n;
                                    _.notification.alert(_.i18n("cmp.selectOrg.beyondLevel",[name]),null,_.i18n("cmp.selectOrg.tip"),_.i18n("cmp.selectOrg.confirm"));
                                    self.selectDataIDCache.delItem(dataObjID);
                                    self._delSelectedDataById(data);
                                    var selectedContainer = basicDiv.querySelector('#select_selectedList');
                                    self._renderSelectArea(basicDiv,selectedContainer,data,true);
                                    self._updateSelectedAreaAfterSelectedItemRenderComplate(basicDiv);
                                    checkbox.checked = false;
                                    return;
                                }else {  //如果没有超过职务级别的人，才能选择成功
                                    self.deptChain[dataObjID].containSub = true;
                                    containSub = _.i18n("cmp.selectOrg.containSub");
                                    dataObj.containSub = 1;
                                }

                            }else { //选的是【否】------不包含子部门
                                if(!dataObj.subDepartmentHasMember){  //如果部门下没有人员的话，要给出提示
                                    var name = dataObj.n;
                                    _.notification.alert(_.i18n("cmp.selectOrg.noMember",[name]),null,_.i18n("cmp.selectOrg.tip"),_.i18n("cmp.selectOrg.confirm"));
                                    self.selectDataIDCache.delItem(dataObjID);
                                    self._delSelectedDataById(data);
                                    var selectedContainer = basicDiv.querySelector('#select_selectedList');
                                    self._renderSelectArea(basicDiv,selectedContainer,data,true);
                                    self._updateSelectedAreaAfterSelectedItemRenderComplate(basicDiv);
                                    checkbox.checked = false;
                                    return;
                                }else {  //如果部门下有人员的话，不给提示，才能选择成功
                                    containSub = _.i18n("cmp.selectOrg.noContainSub");
                                    self.deptChain[dataObjID].containSub = false;
                                    dataObj.containSub = 0;
                                }

                            }
                            self._delSelectedDataById(data);
                            self.selectDataCache.push(_.toJSON(dataObj));
                            subDeptTitle.innerHTML = containSub;
                            basicDiv.querySelector("#item" + dataObjID).querySelector(".selected_text").appendChild(subDeptTitle);
                        },"",[_.i18n("cmp.selectOrg.no"),_.i18n("cmp.selectOrg.yes")]);
                    }

                }
            }else {//如果是减少
                if(self.deptChain[dataObjID]){
                    self.deptChain[dataObjID]= null;
                }
                var tempObj = dataObj;
                tempObj.containSub = 1;
                self._delSelectedDataById(_.toJSON(tempObj));
                tempObj.containSub = 0;
                self._delSelectedDataById(_.toJSON(tempObj));
            }

        }
    };
    selectOrg.prototype._updateDeptChain = function(data,parent) {
        var self = this;
        if(data.et && (data.et == "Department" || data.et == "vjoin_1") ){
            if(self.deptChain[parent]) {
                if(self.deptChain[parent].containSub){//如果父包含了子部门，那么按照流转下去，子子都会包含，如果不包含，则不进行部门链流转(2016-09-03)
                    self.deptChain[data.id] = {
                        parent:parent,
                        id:data.id,
                        containSub:true
                    }
                }

            }
        }
    };
    selectOrg.prototype._setOrgChain = function(data,isAdd){
        var self = this;
        data = _.parseJSON(data);
        if(self.opts.type == selectOrgConstant.C_iFlowSelect){
            var et = data.et.toLocaleLowerCase();
            if(et == "team" || et == "post"){
                if(isAdd){
                    if(self.flowType == selectOrgConstant.C_iFlowSelect_replace) { //是替换操作
                        self.orgChain = [];
                    }
                    self.orgChain.push(data.id);
                }else {
                    self.orgChain.delItem(data.id);
                }
            }
        }
    };

    selectOrg.prototype._updateOrgDataUrl = function(url,pageNo){
        if(url.indexOf("\&pageNo=") > -1) {
            url = url.substring(0,url.indexOf("\&pageNo=")) + "&pageNo=" + pageNo;
        }
        return url;
    };
    selectOrg.prototype._flowSelectEvent = function(basicDiv){
        var self = this;
        var concurrentBtn = basicDiv.querySelector("#select_concurrent"); //并发按钮
        var sequenceBtn = basicDiv.querySelector("#select_sequence");    //串发按钮
        var nextConcurrentBtn = basicDiv.querySelector("#select_next_concurrent");//新增的与下一节点并发
        var selectConfrim = basicDiv.querySelector("#select-btn-ok");    //新确定按钮

        var concurrentInput = concurrentBtn.querySelector('input');
        var sequenceInput = sequenceBtn.querySelector('input');
        var nextConcurrentInput = nextConcurrentBtn.querySelector('input');
        function doFlowSelect(e){
            if(/cmp-flow-type-[12]/.test(selectConfrim.className)){
                self._doSelect(selectOrgConstant.C_sOrgResult_flowChange);
            }else {
                if(concurrentInput.checked){
                    self._doSelect(selectOrgConstant.C_sOrgResult_concurrent,e.data); //执行并发
                }else if(sequenceInput.checked){
                    self._doSelect(selectOrgConstant.C_sOrgResult_sequence,e.data);  //执行串发
                }else if(nextConcurrentInput.checked){
                    self._doSelect(selectOrgConstant.C_sOrgResult_concurrent_next,e.data); //执行并发
                }
            }

        }
        _.event.click(selectConfrim,doFlowSelect);
        selectConfrim.addEventListener("moreBtnTapTrigger",doFlowSelect);//给更多按钮监听一个触发事件
    };
    selectOrg.prototype._lightSelectEvent = function(basicDiv) {
        var self = this;
        var okBtn = basicDiv.querySelector('#select_okBtn');
        if(okBtn) {
            _.event.click(okBtn,function(){
                self._doSelect(selectOrgConstant.C_sOrgResult_light);
            });
        }
    };
    selectOrg.prototype._doSelect = function(resultType,doSelectType){
        var self = this;
        if(self.selectDataIDCache.length < self.opts.minSize){
            var msg = _.i18n("cmp.selectOrg.minNum",[self.opts.minSize,_.i18n("cmp.selectOrg." + self.opts.selectType)]);
            _.notification.alert(msg,null,_.i18n("cmp.selectOrg.tip"),_.i18n("cmp.selectOrg.confirm"));
        }else if(self.opts.maxSize != -1 && self.selectDataIDCache.length > self.opts.maxSize){
            var msg = _.i18n("cmp.selectOrg.maxNum",[self.opts.maxSize,_.i18n("cmp.selectOrg." + self.opts.selectType)]);
            _.notification.alert(msg,null,_.i18n("cmp.selectOrg.tip"),_.i18n("cmp.selectOrg.confirm"));
        }else {
            if (self.opts.maxSize == 1 && resultType == "light" && !self.cancelRadio && self.opts._transed) {//此时是【取消选择】按钮,如果是取消按钮，则返回的数据是空数组
//                if(self.selectDataIDCache.length <= self.opts.minSize){//如果是取消按钮，则代表是轻表单单选，此时点击取消的话会将所有已选清空，此时应该给出提示，不能取消
//                    var msg = fI18nData.selectOrgI18n[lang].minNum.replace("$",self.opts.minSize);
//                    msg = msg.replace("%",fI18nData.selectOrgI18n[lang][self.opts.selectType]);
//                    _.notification.alert(msg,null,fI18nData.selectOrgI18n[lang].tip,fI18nData.selectOrgI18n[lang].confirm);
//                    return;
//                }
                self.selectDataCache = [];
                self.selectDataIDCache = [];
//                self._close(self.basicDiv);//取消就直接关闭收拾
//                return;
            }
            var orgResult = new orgResultObj(resultType,self.selectDataCache);
            if(self.opts._transed == true || self.opts._transed == "true"){
                self._handleJumpPageOrgResult(orgResult);
            }else {
                self._cachePreSelectedData();
                self.runOKEevent = true;
                self._saveRecentContacts(orgResult,function(){
                    if(self.opts.callback != null && typeof self.opts.callback == 'function') {
                        var callback = self.opts.callback;
                        if(self.searchHistory.children.length > 0) {
                            var searchHistory = _.toJSON(self.searchHistory.children);
                            _.storage.save("selectOrg_" + self.opts.selectType+"_"  +self.searchType+"_"+ self.userName,searchHistory);
                        }
                        self._close(self.basicDiv);
                        callback(_.toJSON(orgResult),doSelectType);

                    }
                });
            }

        }
    };
    selectOrg.prototype._handleJumpPageOrgResult = function(orgResult){
        var self = this;
        var dataKey, queryParams;
        if(self.opts.pageKey != null){
            var historyPageKey = _.storage.get("cmp-selectOrg-jump-pageKey",true);
            dataKey = self.opts.pageKey;
            if(!historyPageKey){
                _.storage.save("cmp-selectOrg-jump-pageKey",dataKey,true);
                queryParams = "pageKey=" + self.opts.pageKey;
            }else {
                if(historyPageKey != dataKey){
                    _.storage.save("cmp-selectOrg-jump-pageKey",dataKey,true);
                    queryParams = "pageKey=" + self.opts.pageKey;
                }
            }
        }else {
            dataKey = "selected-data_"+self.id;
            self.opts.fillBackData = self.selectDataCache;
            if(self.opts.pageKey == null){  //兼容开发者主动调跳转模式的情况
                _.storage.save("cmp-selectOrg-opts", _.toJSON(self.opts),true);
            }
        }
        _.storage.save(dataKey, _.toJSON({metadata:self.opts.metadata, data:orgResult}),true);//todo 修改回传值格式
        if(self.searchHistory && self.searchHistory.children.length > 0) {
            var searchHistory = _.toJSON(self.searchHistory.children);
            _.storage.save("selectOrg_" + self.opts.selectType+"_" +self.searchType +"_"+self.userName,searchHistory);
        }
        if(orgResult){
            self._saveRecentContacts(orgResult);
        }
        if(typeof self.opts.jumpCallback == "function"){
            self.opts.jumpCallback();
        }
        setTimeout(function(){
            _.href.back(1,queryParams);
        },400);

    };
    selectOrg.prototype._saveRecentContacts = function(orgResultObj,callback){
        var self = this;
        var orgResult = orgResultObj.orgResult;
        if(orgResult && orgResult.length >0){
            var i = 0,len = orgResult.length;
            var members = [];
            for(;i<len;i++){
                if(orgResult[i].type == "Member"){
                    members.push("Member|" + orgResult[i].id);
                }
            }
            if(members.length > 0) {
                members = members.join(",");
                var url = self._getOrgUrl(selectOrgConstant.C_sSelectType_saveRecentContacts);
                var data = {
                    memberId:self.userID,
                    orgDataStr:members
                };
                data = _.toJSON(data);
                self._sendAjax("POST",url,data,callback,callback);
            }else {
                if(callback && typeof callback == "function"){
                    callback();
                }
            }
        }else {
            if(callback && typeof callback == "function"){
                callback();
            }
        }
    };
    selectOrg.prototype._searchEvent = function(basicDiv){
        var self = this;
        var btn = basicDiv.querySelector("#select_searchBtn");
        btn.removeAttribute("disabled");
        var btnArea = basicDiv.querySelector('#select_contentTitleSearch');
        btn.addEventListener('tap',function(){
            self.doSearch = true;
            if(self.initFocus == true) {
                btnArea.style.display = "none";
                self._renderSearchArea(basicDiv,true);
                self.initFocus = false;
            }
            // btn.blur();
            var cancelBtn = basicDiv.querySelector("#select_searchCancel");
            var clearBtn = basicDiv.querySelector("#select_searchClear");
            var input = basicDiv.querySelector("#select_searchInput");
            input.focus();
            

            input.removeEventListener("keyup",_doSearch,false);
            input.addEventListener("keyup",_doSearch,false);
            input.addEventListener("input",function(){
                self._clearBtnSwitch(input,clearBtn);
            },false);

            function _doSearch(e){
                if(e.keyCode == 13) {
                    var keyWord = input.value;
                    if(keyWord != "" && keyWord.replace(/(^\s*)|(\s*$)|(\n)|(\s+)/g,"").length > 0) {
                        if(self.SpecialCharacter.test(keyWord)){
                            _.notification.toast(_.i18n("cmp.selectOrg.special_character_tips"), "center", 2000);
                            return;
                        }
                        keyWord = keyWord.replace(/(^\s*)|(\s*$)|(\n)|(\s+)/g,"");
                        if(self.keyWord != keyWord) {
                            self.keyWord = keyWord;
                            var searchCondition = self.opts.type == selectOrgConstant.C_iFlowSelect?"flow_search":"light_search";
                            self.orgSearchUrl = self._getOrgUrl(searchCondition,self.currentAccount);
                            if(self.scrollerCache["searchHistory"]){
                                self.scrollerCache["searchHistory"].destroy();
                                self.scrollerCache["searchHistory"] = undefined;
                            }
                            if(!self.scrollerCache['search']){
                                var searchListScroller = self.basicDiv.querySelector("#select_searchList_scroll_"+self.searchUUID);
                                self.scrollerCache['search'] =  self._createScroller(searchListScroller,true,"search",self._getOrgData,self._renderSearchData,self);
                            }else {
                                self.scrollerCache['search'].pullupLoading(1);
                            }
                        }
                        input.blur(); //点击搜索完,要求去掉键盘
                    }
                }
            }
            _.event.click(cancelBtn,function(){
                btnArea.style.display = "block";
                self._renderSearchArea(basicDiv,false);
                self.initFocus = true;
                self.keyWord = '';
                self._renderFillback(basicDiv,"select_listContent");
                self._changeSelectedArea(basicDiv,true);
                self.doSearch = false;
            });
			setTimeout(function(){
				self._clearBtnSwitch(input,clearBtn);
				clearBtn.addEventListener("tap",function(){
                  input.value = "";
                self._clearBtnSwitch(input,clearBtn);
              },false);
			},0);
            
        },false);

    };


    selectOrg.prototype._crumbsEvent = function(basicDiv,isRefresh){
        var self = this;
        var crumbsList = basicDiv.querySelector("#select_crumbs_list");
        if(crumbsList){
            var crumbs = crumbsList.getElementsByClassName("crumbs-text");
            var i = 0;
            var len = (crumbs.length -1);
            for(; i < len ; i ++) {//最后一个面包屑不绑定事件
                (function(i){
                    var crumb = crumbs[i];
                    crumb.addEventListener('tap',function(){
                        var a = crumb.querySelector('a');
                        var id = crumb.getAttribute("id");
                        id = id.replace("crumb","");
                        self._contentBlockChange("crumbBtn",basicDiv,id);
                        self.scrollerCache['content'].loading = false;
                        self.scrollerCache['content'].pullupLoading(1);
                    },false);
                })(i);
            }
        }

    };
    selectOrg.prototype._moreEvent = function(basicDiv){
        var self = this;
        var moreOptions = self.opts.moreOptions;
        if(moreOptions){
            var moreBtn = basicDiv.querySelector("#select-btn-more");
            if(!moreBtn.classList.contains("binded")){
                moreBtn.addEventListener("tap",function(){
                    moreOptions.callback && moreOptions.callback();
                });
                moreBtn.classList.add("binded")
            }
        }
    };
    selectOrg.prototype._accountSwitchEvent = function(basicDiv){
        var self = this;
        var accountSwitchBtn = basicDiv.querySelector("#select_accountSwitchBtn");
        if(accountSwitchBtn){
            accountSwitchBtn.addEventListener("tap",function(){
                accountSwitchBtn.blur();
                var accountID = accountSwitchBtn.getAttribute("account");
                var accountSwitchPage = basicDiv.querySelector("#select_accountSwitchPage");
                if(accountSwitchPage){
                    var container = accountSwitchPage.querySelector("#select_accountSwitchList");
                    accountSwitchPage.style.display = "block";
                    accountSwitchPage.classList.remove("cmp-select-basicDiv-rightClose");
                    setTimeout(function(){
                        self._removeGou(container);
                        self._addGou(container,accountID);
                        accountSwitchPage.classList.add("cmp-select-basicDiv-rightShow");
                        self.scrollerCache["account"].refresh();
                    },300);
                }else {
                    _.dialog.loading();
                    self._createAccountPage(basicDiv);
                    var url = self._getOrgUrl(selectOrgConstant.C_sSelectType_account_switch);
                    self._sendAjax("GET",url,"",function(result){
                        var aN = result.n;
                        result = self._convertAccountVO(result);
                        result.accountID = accountID;
                        result.n = aN;
                        self._renderAccountArea(basicDiv,result);
                        _.dialog.loading(false);
                    });
                }

            },false);
        }
    };
    selectOrg.prototype._accountChooseEvent = function(basicDiv,accountWidget){ //xinpei
        var self = this;
        var items = accountWidget.querySelector("#select_accountSwitchList").children;
        var accountBtn = basicDiv.querySelector("#select_accountSwitchBtn");
        var backBtn = basicDiv.querySelector("#select_btnBack");
        var crumbsContainer = basicDiv.querySelector("#select_crumbs_list_account");
        var i = 0,len = items.length;
        for(; i < len; i ++){
            (function(i){
                var account = items[i];
                var toNextLevel = account.querySelector(".cmp-select-account-toNextLevel");
                account.addEventListener("tap",function(e){
                    e.stopPropagation();
                    var accountID = account.getAttribute("id");
                    var preSelectAccountID = accountBtn.getAttribute("account");
                    if(accountID != self.userAccount) {
                        self.isExtAccount = true;
                    }else {
                        self.isExtAccount = false;
                    }
                    if(preSelectAccountID == accountID){
                        self._accountCloseEvent(accountWidget);
                    }else {
                        if(self.opts.selectType == selectOrgConstant.C_sSelectType_member){//无论是流程还是轻表单只要是选人，单位切换完后显示的都是第一个部门人员
                            self._radioGouSwitch(accountWidget,account);
                            self.orgDataUrl = self._getOrgUrl(selectOrgConstant.C_sSelectType_all,accountID);//xinpei
                            self.initRenderContent = true;
                            self.path = {
                                parent:selectOrgConstant.C_oFlowHome.id,
                                self:"allOrg_" + accountID
                            };
                            accountBtn.setAttribute("account",accountID);
                            backBtn.setAttribute("account","allOrg_"+accountID);
                            var info = account.getAttribute("info");
                            info = _.parseJSON(info);
                            self.crumbAccount = {id:"allOrg_"+accountID,name:info.name};
                            self.initRenderCrumbs = true;
                            self.path = {  //父路径和当前路径的转换，用于回退按钮和面包屑按钮使用
                                parent:selectOrgConstant.C_oFlowHome.parentPath,
                                self:selectOrgConstant.C_oFlowHome.id
                            };
                            self.scrollerCache['content'].pullupLoading(1);
                            self._accountCloseEvent(accountWidget);
                        }else {
                            if(!toNextLevel){
                                self._radioGouSwitch(accountWidget,account);
                            }
                            accountBtn.setAttribute("account",accountID);
                            self.initRenderContent = true;
                            self.orgDataUrl = self._getOrgUrl(self.opts.selectType,accountID);
                            self.currentAccount = accountID;
                            self.initRenderCrumbs = true;
                            self.scrollerCache['content'].pullupLoading(1);
                            self._accountCloseEvent(accountWidget);
                        }

                    }
                },false);
                if(toNextLevel){//如果存在下级单位标签
                    toNextLevel.addEventListener("tap",function(e){
                        e.stopPropagation();
                        var info = toNextLevel.getAttribute("info");
                        self._updateCrumbs(crumbsContainer,_.parseJSON(info),selectOrgConstant.C_sCrumbChange_increase,"crumbsAccount");
                        self._toNextLevelAccount(accountWidget,info,selectOrgConstant.C_iAccountRenderType_switch);
                        self._accountChooseEvent(basicDiv,accountWidget);
                        self._accountCrumbsEvent(accountWidget,crumbsContainer);
                    },false);
                }
            })(i)
        }
    };
    selectOrg.prototype._accountPageCloseEvent = function(basicDiv,accountWidget){
        var self = this;
        var cancelBtn = accountWidget.querySelector("#select_accountCancelBtn");
        cancelBtn.addEventListener("tap",function(event){
            event.stopPropagation();
            self._accountCloseEvent(accountWidget);
        });
        self._updateTitle(basicDiv,true);
        self._bindH5BackBtnEvent(basicDiv,accountWidget);
    };
    selectOrg.prototype._accountCloseEvent = function(){
        var self = this;
        self.accountWidget.classList.remove("cmp-select-basicDiv-rightShow");
        self.accountWidget.classList.add("cmp-select-basicDiv-rightClose");
        setTimeout(function(){
            self.accountWidget.style.display = "none";
        },300);
    }
    selectOrg.prototype._close = function(basicDiv){
        var self = this;
        self._allWidgetPartReset(basicDiv);
        basicDiv.classList.add("cmp-select-basicDiv-close");
        basicDiv.classList.remove("cmp-select-basicDiv-show");
        if(self.opts._transed) {
            self._handleJumpPageOrgResult(null);
            return;
        }
        _.backbutton.pop();
        self._updateTitle(basicDiv,true);
        self.widget = basicDiv;
        setTimeout(function(){
            basicDiv.style.display = "none";
            var checkboxs = basicDiv.querySelectorAll("input[name=select_checkbox]");
            var selectedList = basicDiv.querySelector("#select_selectedList");
            self._resetCheckBox(checkboxs);
            if(selectedList) selectedList.innerHTML = '';
            self.initShowMark = false;
        },300);

    };
    selectOrg.prototype._selectedItemEvent = function(basicDiv,container,item){
        var self = this;
        var drag = false;//是否可以拖动的标识（true才能拖动）
        var exchange = false;//是否进行位置交换的标识（true才能交换）
        var tipX = -3,tipY = -3;//一个长按成功的一个视觉距离
        var sX = 0,sY = 0;
        var delRang = container.offsetHeight;
        var itemWidth = 75*1.5;  //作为移动用(75是图片宽度css定好了的)
        _.event.click(item,function(){
            self.delByDrag(basicDiv,item);
        });
        _.event.touchHold(item,function(e){
            drag = true;
            sX = self.getCoordinate(e, "pageX"); //获取移动坐标
            sY = self.getCoordinate(e, "pageY");
            self.move(item,tipX,tipY,0.5,"ease-in-out");
        });
        item.addEventListener("touchmove",function(e){
            if(drag){
                self.scrollerCache["selected"].disable();
                var x =  self.getCoordinate(e, "pageX"),
                    y =  self.getCoordinate(e, "pageY");
                var mx = x - sX - tipX;
                var my = y - sY - tipY;
                self.move(item,mx,my,0.5,"ease-in-out");
            }

        },false);
        item.addEventListener("touchend",function(e){
            drag = false;
            var x = self.getCoordinate(e, "pageX"),
                y =  self.getCoordinate(e, "pageY");
            var endY = y-sY;
            var endX = x -sX;
            var moveItemNum = 0;
            if(endX < 0){
                moveItemNum = Math.floor(endX/itemWidth);
            }else {
                moveItemNum = Math.round(endX/itemWidth);
            }
            exchange = container.childNodes.length > 1;
            if(endY < 0 && Math.abs(endY) >= delRang){
                self.delByDrag(basicDiv,item);
            }else {
                if(Math.abs(endY) <= item.offsetHeight/2){
                    if(exchange){
                        var index = self.getItemIndex(container,item);
                        if((moveItemNum < 0 && index >0 && (Math.abs(endX) >= itemWidth/2)) || (moveItemNum >= 0 && (Math.abs(endX) >= itemWidth/2)) ){
                            var preIndex = index + moveItemNum;
                            var preItem = self.getItemByIndex(container,preIndex);
                            var direction = 0;
                            if(moveItemNum < 0){
                                container.insertBefore(item,preItem);
                                direction = -1;
                            }else {
                                var nextDom;
                                if(!preItem.nextSibling) {
                                    nextDom = document.createElement("li");
                                    container.appendChild(nextDom);
                                }
                                container.insertBefore(item,preItem.nextSibling);
                                if(nextDom) nextDom.remove();
                                direction = 1;
                            }
                            var data = item.getAttribute("info");
                            var newIndex = preIndex + direction;
                            self._adjustSelectedData(preIndex,index,data,direction);//调整数据的顺序
                        }
                    }
                }
                self.move(item,0,0,0.5,"ease-in-out");
            }
            self.scrollerCache["selected"].enable();
            drag = false;
        },false)
    };
    selectOrg.prototype.delByDrag = function(basicDiv,item){
        var self = this;
        var id = item.getAttribute("id").replace("item","");
        if(self.excludeData[id]){
            self.move(item,0,0,0.5,"ease-in-out");
            return;//如果被排除的数据出现在已选框（说明既是回填数据又是不能操作的数据），则不能被删除
        }
        var info = item.getAttribute("info");
        var infoObj = _.parseJSON(info);
        if(infoObj.topLevel && infoObj.topLevelType == "org" && infoObj.idd == self.accountChoosed){//【本单位被删除后，需要置0】
            self.accountChoosed = 0;
        }
        self._setDeptChain(info,basicDiv,null,false);
        self._setOrgChain(info,false);
        self._delSelectedDataById(info);
        self.selectDataIDCache.delItem(id);
        item.remove();
        self.scrollerCache["selected"].refresh();
        var checkboxs = basicDiv.querySelectorAll("input[name=select_checkbox]");
        self._resetCheckBox(checkboxs);
        var contentID = self.doSearch?"select_searchList":"select_listContent";
        self._renderFillback(basicDiv,contentID);
        self._updateWidth(self.scrollerCache['selected'].wrapper,self.scrollerCache['selected']);
        self._changeSelectedArea(basicDiv,self.doSearch);
        var listNum = basicDiv.querySelector('#select_selectedNum');
        if(listNum){
            listNum.innerHTML = self.selectDataCache.length;
        }
    };
    selectOrg.prototype.getItemIndex = function(container,item){
        var index = 0;
        var children = container.childNodes;
        var i = 0,len = children.length;
        for(;i<len;i++){
            if(children[i] == item){
                index = i;
                break;
            }
        }
        return index;
    };
    selectOrg.prototype.getItemByIndex = function(container,index){
        return container.childNodes[index];
    };
    selectOrg.prototype._adjustSelectedData = function(preIndex,index,data,direction){
        var self = this;
        if(direction > 0){
            preIndex += direction;
        }else {
            index += 1;
        }
        self.selectDataCache.splice(preIndex,0,data);  //先向原数组添加指定元素
        self.selectDataCache.splice(index,1);
    };
    //=====================================================数据操作部分============================================================//
    selectOrg.prototype._getOrgData = function(self, options) {//xinpei
        var success = options.success;
        var error = options.error;
        if(self.initRenderContent && !self.initLoad) {
            _.dialog.loading();
        }
        var requestUrl = self.doSearch?self.orgSearchUrl: self.orgDataUrl;
        var requestType = self.doSearch?"POST":"GET";
		var requestParams = self.doSearch?_.toJSON(self.searchParams):"";
		//----------------------------------------------------------------
		if(requestParams.accountId&&self.doSearch){
			requestParams.accountId='-1730833917365171641'

		}
		//----------------------------------------------------------------

        var pageNo = self.pageNo;
        requestUrl = self._updateOrgDataUrl(requestUrl,pageNo);
        if(requestUrl.indexOf("allSelfDepartment") != -1){
            self.requestSelfDeparmentData ++;
        }else {
            self.requestSelfDeparmentData = 0;
        }
        if(requestUrl.indexOf("excludeUrlParams") != -1){
            requestType = "POST";
            if(self.excludeUrlParams){
                requestParams = JSON.stringify(self.excludeUrlParams);
            }else if(self.excludeUrlParams == ""){
                requestParams = JSON.stringify({"extParam":{"excludeElements":""}});
            }
        }
        self._sendAjax(requestType,requestUrl,requestParams,function(result){
           self._handleOrgDataAndDoRender(result,requestUrl,success);
        });
    };

    selectOrg.prototype._handleOrgDataAndDoRender = function(result,requestUrl,successCallback){
        var self = this;
        var data = {};
        if(result.children == null){
            successCallback({total:"0",data:[]});
            self._noDataBackEvent();
            return;
        }
        if(result.type) { //流程选人数据
            switch(result.type.toLocaleLowerCase()) {
                case "top":
                    self._transeHomeData(result);
                    self.currentAccount = result.aID.replace("top_","");
                    self.account["id"] = result.aID.replace("top_","");
                    self.account["name"] = result.n;
                    self.account["shortname"] =  result.san;
                    break;
                case "account":
                    self._transeFirstLevel(result);
                    if(self.opts.selectType.indexOf("department") != -1){
                        result.aID = "top_" + result.id;
                    }
                    break;
                case "orgDepartment":
                    break;
                case "orgPost":
                    break;
                case "orgExtMember":
                    break;
            }
        }else if(result.et) {
            if(self.opts.type == selectOrgConstant.C_iLightFormSelect){
                self._transeFirstLevel(result);
                switch (result.et.toLocaleLowerCase()){
                    case "account":
                        self.currentAccount = result.id;
                        break;
                }
            }

        }else {  //什么都没有，代表的是清表单
            result = self._transeAccount(result);
        }
        self._parsonDeptChain(result);

        self._setUserAccount4DPL(result);//设置当前登陆人员的单位缓存
        if(requestUrl.indexOf("allSelfDepartment") != -1){
            result.allSelfDepartment = true;
        }
        if(self.accountChoosed&&result.ap && result.ap[0].id == self.accountChoosed){
            result.allMChoose = true;
            result.allDChoose = true;
        }
        result.opts = self;//将selectOrg对象传入
        data.data = result;
        data.total = result.totle ? result.totle:0;
        successCallback(data);
    };

    selectOrg.prototype._transeHomeData = function(data) {
        var self = this;
        var children = data.children,i = 0,len = children.length;
        var dataChildren = [];
        var recentPersonChildren = [];
        var vjChildren = [];
        if(null == self.userAccount){
            self.userAccount = data.id;
        }
        var whatCache = {};
        for(;i <len; i ++) {
            var child = children[i].obj,type = children[i].type,j = 0,length = child.length;
            for(;j<length;j ++) {
                if(type == "account"){
                    if(child[j].isshow == "0" && self.label.indexOf("4") == -1) continue;
                    var idd = child[j].id;
                    switch(child[j].type) {
                        case "org":
                            child[j].topLevel = "allOrg";
                            child[j].id = "allOrg_" + child[j].id;
                            child[j].n = _.i18n("cmp.selectOrg.home_orgName_Org");
                            if(self.opts.type == 1){//流程选人才开启选中
                                child[j].chooseable = true;
                                if(self.memberType == 2){
                                    child[j].n = _.i18n("cmp.selectOrg.home_orgName_Org_4vjExtmember");
                                }
                            }
                            if(self.opts.notSelectAccount){//配置参数中不能选择单位
                                child[j].chooseable = false;
                            }
                            var num = child[j].org.num;
                            if(!num|| parseInt(num) <=0){//空单位也不可以选
                                child[j].chooseable = false;
                            }
                            child[j].dn = data.n;
                            whatCache["org"]  = child[j].chooseable;
                            break;
                        case "post":
                            child[j].topLevel = "allPost";
                            child[j].id = "allPost_" + child[j].id;
                            child[j].n = _.i18n("cmp.selectOrg.home_orgName_Post");
                            break;
                        case "extM":
                            child[j].topLevel = "allExtMember";
                            child[j].id = "allExtMember_" + child[j].id;
                            child[j].n = _.i18n("cmp.selectOrg.home_orgName_extMember");
                            break;
                        case "depM":
                            child[j].topLevel = "allSelfDepartment";
                            child[j].id = "allSelfDepartment_" + child[j].id;
                            child[j].n = _.i18n("cmp.selectOrg.home_orgName_SelfDepartment");
                            if(self.opts.type == 1){
                                child[j].chooseable = true;
                            }
                            if(self.opts.notSelectSelfDepartment){//为了兼容只能这样了
                                child[j].chooseable = false;
                            }
                            if(data.id != self.userAccount){
                                child[j].displayNone = true;
                            }
                            whatCache["depM"]  = child[j].chooseable;
                            break;
                        case "teamM":
                            child[j].topLevel = "allTeam";
                            child[j].id = "allTeam_" + child[j].id;
                            child[j].n = _.i18n("cmp.selectOrg.home_orgName_Team");
                            break;
                        case "levelM":
                            child[j].topLevel = "allLevel";
                            child[j].id = "allLevel_" + child[j].id;
                            child[j].n = _.i18n("cmp.selectOrg.home_orgName_Level");
                            break;
                    }
                    if(self.opts.type == 1){
                        child[j].placeholder = true;
                    }
                    child[j].mN = "";   //-------首页数据不显示数量统计
                    child[j].et = "all";
                    child[j].idd = idd;
                    child[j].allDept_cs_no = child[j].acs == selectOrgConstant.C_iWholeChoose_cant?true:false;//判断部门是否【不】能被整体选中
                    dataChildren.push(child[j]);
                }else if(type == "recentPersion") {
                    if(self.checkLevelScope) continue;//vj  首页数据不显示最近联系人
                    child[j].et = "Member";
                    child[j].n = child[j].name;
                    child[j].p = child[j].post;
                    child[j].recentPerson = true;
                    recentPersonChildren.push(child[j]);
                }else if(type == "vjoin"){  //vj泛组织
                    if(child[j].isshow == "0") continue;
                    var id = child[j].id;
                    child[j].idd = id;
                    switch(child[j].type){
                        case "vjoinUnit":
                            child[j].topLevel = "allVjUnit";
                            child[j].id = "allVjUnit_" + id;
                            child[j].n = _.i18n("cmp.selectOrg.home_orgName_vjUnit");
                            break;
                    }
                    child[j].dn = children[i].name;
                    child[j].mN = "";   //-------首页数据不显示数量统计
                    child[j].et = "all";
                    child[j].vj = true;
                    data.vjname = children[i].name;
                    if(whatCache["org"] || whatCache["depM"]){
                        child[j].placeholder = true;//页签是否现在占位符是根据【本单位】，【本部门】页签能否是可选决定的
                    }
                    vjChildren.push(child[j]);
                }
            }
        }
        dataChildren = dataChildren.concat(vjChildren).concat(recentPersonChildren);
        data.children = dataChildren;
        data.totle = selectOrgConstant.C_iHomePage_total;//只有首页设置为1
        data.home = true;
        data.aN = data.n;
        data.aID = "top_"+data.id;
        if(self.isExtAccount){
            self.extAccountSan = data.san;
        }else {
            self.extAccountSan = null;
        }

    };
    selectOrg.prototype._transeFirstLevel = function(data) {
        var self = this;
        var accoutName,accountID;
        if(data.ap && data.ap.length) { //轻表单选人将单位单独进行处理
            accoutName = data.ap[0].n;
            accountID = data.ap[0].id;
            if(null == self.userAccount){
                self.userAccount = accountID;
            }
        }else {
            accoutName = data.n;
            accountID = data.id;

        }
        data.aN = accoutName;
        data.aID = accountID;
    };
    selectOrg.prototype._parsonDeptChain = function(data){
        var self = this;
        var id = data.id;
        if(data.type != "extAccount"){//编外人员的下一级按钮  不进行部门链，避免点击选中【本单位】时，编外人员下的部门和人员全部被选中 OA-142281
            if(self.deptChain[id]) {
                var parent = self.deptChain[id].parent;
                if(parent != "" && parent.length > 0) {
                    if(!self.deptChain[parent]) {
                        self.deptChain[id] = null;
                        return;
                    }
                }

                data.allMChoose = true;
                var parson = function(deptChain){
                    if(deptChain.parent != "") {
                        parson(self.deptChain[deptChain.parent]);
                    }else {
                        if(deptChain.containSub == true){
                            data.allDChoose = true;
                        }else {
                            data.allDChoose = false;
                        }
                    }
                }
                parson(self.deptChain[id]);
            }
        }
    };

    selectOrg.prototype._transeAccount = function(data) {
        var self =  this;
        var i = 0,len = data.length;
        for(;i<len; i ++) {
            data[i].n = data[i].name;
            data[i].et = data[i].entityType;
            data[i].cs = selectOrgConstant.C_iWholeChoose_can;
        }
        var result =  new selectOrg_accountData(data);
        result.aN = result.name;
        result.aID = result.id;
        result.totle = result.children.length;
        return result;
    };
    selectOrg.prototype._setUserAccount4DPL = function(data){
        var self = this;
        if(self.opts.selectType == "department"
            || self.opts.selectType == "post"
            || self.opts.selectType == "level"
            || self.opts.selectType == "department_vj1"){
            var userAccount = self.userAccount;
            if(null  == userAccount){
                var type = data.type || data.et;
                switch (type.toLocaleLowerCase()){
                    case "account":
                    case "level":
                    case "post":
                        self.userAccount = data.id;
                        break;
                    default :
                        break;
                }
            }
        }
    };
    selectOrg.prototype._getOrgUrl = function(selectType,id){
        var self = this;
        var stringParam = "?option.n_a_s=1",pagingParam = "&pageSize="+selectOrgConstant.C_iLoadListData_pageSize,pageNo = "&pageNo=";
        var url = '';
        self.teamMemberData = false;

        switch (selectType) {
            case 'accounTisGroup':
                url = '/cmporgnization4M3/sysflag';
                break;
            //=====================首页接口  start===========================================//
            case selectOrgConstant.C_sSelectType_all:
                self.searchType =selectOrgConstant.C_iSearchType_member;//进入外部机构页签，那么搜索的人员类型变成vj人员类型
                if(id){
                    if(id.indexOf("_")>-1){
                        var type = id.substring(0,id.indexOf("_")), account = id.substring(id.indexOf("_")+1);//流程选人首页各标签的进入下一级
                        switch (type){
                            case "allOrg"://【本单位】
                                var interfaceStr = self.opts.permission?"/firstleveldepts":"/firstleveldeptsWithoutlevelscope";
                                if(self.opts.type == 2 && self.opts.selectType == "member" && !self.opts.lightMemberPermission){//默认表单控件不受权限控制
                                    if(self.opts.vj){//如果是vj控件
                                        if(self.memberType == 2) { //如果是vj人员登录，要受权限控制
                                            interfaceStr = "/firstlevelVjoinUnits"
                                        }else {  //内部人员/编外人员登录不受全控制
                                            interfaceStr = "/firstlevelVjoinUnitsWithoutlevelscope"
                                        }
                                        self.searchType =selectOrgConstant.C_iSearchType_member_vj;
                                    }else {//如果不是vj控件
                                        if(self.memberType == 2){//只要是vj人员登录就要受权限控制
                                            interfaceStr = "/firstleveldepts";
                                        }else {
                                            interfaceStr = "/firstleveldeptsWithoutlevelscope";
                                        }
                                    }
                                }
                                url = '/cmporgnization4M3'+interfaceStr + stringParam + pagingParam + "&accountId=" + account + "&excludeUrlParams=true" +pageNo;
                                break;
                            case "allPost"://【岗位】
                                url =  '/cmpposts4M3' + stringParam + pagingParam + "&accountId="+ account + pageNo;
                                break;
                            case "allExtMember"://【编外人员】
                                url = "/cmporgnization4M3/extAccounts" + stringParam + pagingParam +"&accountId="+ account + pageNo;//先有外单位列表
                                break;
                            case "allSelfDepartment"://【本部门】
                                url = "/cmpsubdepartments4M3/subentities/" + account + stringParam +"&excludeUrlParams=true&allSelfDepartment"+ pagingParam + pageNo;
                                break;
                            case "allTeam"://【组】
                                url = "/cmpteams4M3" + stringParam  + pagingParam +"&accountId=" + account + pageNo;
                                break;
                            case "allLevel"://【职务级别】
                                url =  '/cmplevels4M3' + stringParam + pagingParam+"&accountId="+account+ pageNo;//使用的是轻表单的职务级别的rest接口
                                break;
                            case "allVjUnit"://【vj外部机构】
                                var interfaceStr = "/firstlevelVjoinUnits";//默认是要受权限控制的（无论是流程还是表单控件都要受权限控制）
                                if(self.opts.type == 2 && self.opts.selectType == "member" && !self.opts.lightMemberPermission && self.memberType != 2){//如果是表单控件+选人+不受轻表单权限控制+不是vj人员登录
                                    interfaceStr = "/firstlevelVjoinUnitsWithoutlevelscope";
                                }
                                url = '/cmporgnization4M3'+interfaceStr + stringParam + pagingParam + "&accountId=" + account + pageNo;
                                self.searchType =selectOrgConstant.C_iSearchType_member_vj;//进入外部机构页签，那么搜索的人员类型变成vj人员类型
                                break;
                        }
                    }else {
                        url = '/cmporgnization4M3'+ stringParam +"&accountId=" + id +"&showlist=" + self.label;//流程首页
                        if(self.checkLevelScope) url += "&checkLevelScope=0";
                        if(self.label.indexOf("7") != -1){//流程或选人控件 只要有【外部机构】页签的情况
                            if(self.opts.type == 2 && self.opts.selectType == selectOrgConstant.C_sSelectType_member && self.opts.vj){
                                self.searchType =selectOrgConstant.C_iSearchType_member_vj;//轻表单vj选人控件，只能搜索外部人员
                            }else {
                                self.searchType =selectOrgConstant.C_iSearchType_member_homepage;//首页默认是内部人员搜索类型
                            }
                        }
                    }
                }else {
                    url = '/cmporgnization4M3' + stringParam +"&showlist=" + self.label;//流程首页单位切换后，接口中带单位ID
                    if(self.checkLevelScope) url += "&checkLevelScope=0";
                    if(self.label.indexOf("7") != -1){//流程或选人控件 只要有【外部机构】页签的情况
                        if(self.opts.type == 2 && self.opts.selectType == selectOrgConstant.C_sSelectType_member && self.opts.vj){
                            self.searchType =selectOrgConstant.C_iSearchType_member_vj;//轻表单vj选人控件，只能搜索外部人员
                        }else {
                            self.searchType =selectOrgConstant.C_iSearchType_member_homepage;//首页默认是内部人员搜索类型
                        }
                    }
                }
                break;
            //==============================首页接口   end==============================================//


            //=============================流程+表单选人员数据相关接口  start=========================================//
            case selectOrgConstant.C_sSelectType_member://【本单位】的下级--->下级---->下级。。。。
                id = id.replace("allOrg_","");
                if(!self.opts.permission){ //当流程选人不需要权限控制时，接口调用无需权限控制的接口
                    url =  '/cmpsubdepartments4M3/subentitieswithoutlevelscope'+stringParam +"&parentId="+id + pagingParam;
                }else {
                    url = '/cmpsubdepartments4M3/subentities/'+id + stringParam + pagingParam;
                }
                url += "&excludeUrlParams=true" + pageNo;
                break;
            case selectOrgConstant.C_sSelectType_department_member://【本部门】的下级--->返回---->返回。。。。
                id = id.replace("allOrg_","");
                if(!self.opts.permission){//当流程选人不需要权限控制时，接口调用无需权限控制的接口
                    url =  '/cmpsubdepartments4M3/subentitieswithoutlevelscope'+stringParam +"&parentId="+id + pagingParam;
                }else {
                    url = '/cmpsubdepartments4M3/subentities/' + id + stringParam + pagingParam ;
                }
                url += "&excludeUrlParams=true"+ pageNo;
                break;
            case selectOrgConstant.C_sSelectType_post_member://【岗位】的下级----->下级（流程+表单人员控件）
                url = "/cmpposts4M3/postmembers/" + id + stringParam + pagingParam + pageNo;
                break;
            case selectOrgConstant.C_sSelectType_team_member:  //【组】的下级----->下级（流程+表单人员控件）
                url = "/cmpteams4M3/teammembers/" + id + stringParam + pagingParam + pageNo;
                self.teamMemberData = true;
                break;
            case selectOrgConstant.C_sSelectType_extAccount_member://【编外人员】的下级----->下级（流程+表单人员控件）
                url = "/cmpmembers4M3/extmembers/" + id + stringParam + pagingParam + pageNo;
                break;
            case selectOrgConstant.C_sSelectType_vjDepartment_member://流程----------vj的【外部机构】下一级的下一级人员
                if(self.opts.permission){
                    url = "/cmpsubdepartments4M3/subVjoinEntities/" +id + stringParam + pagingParam + pageNo;
                }else {
                    url = "/cmpsubdepartments4M3/subVjoinEntitieswithoutlevelscope"  + stringParam + "&parentId="+id+pagingParam + pageNo;
                }
                break;
            //=============================流程+表单选人员数据相关接口  end=========================================//

            //============================单位切换相关接口   start=================================================//
            case selectOrgConstant.C_sSelectType_department://切换单位后获取该单位下的所有子部门的第一个部门时用(流程 + 表单选人控件 + 表单选部门控件)
                url = "/cmporgnization4M3/firstleveldepts";
                if(self.opts.type == 2 && self.opts.selectType == "department") url = "/cmporgnization4M3/firstleveldeptsWithoutlevelscope";
                if(id){
                    url += stringParam + pagingParam +"&accountId="+id;
                }else {
                    url += stringParam + pagingParam;
                }
                url += "&excludeUrlParams=true" + pageNo;
                break;
            case selectOrgConstant.C_sSelectType_account_switch://点击切换单位按钮(一次请求所有数据)
                url = '/cmporgnization4M3/getAllAccounts' + stringParam + "&showAll=1";
                break;
            //============================单位切换相关接口   end=================================================//

            //============================表单控件相关     start================================================//
            case selectOrgConstant.C_sSelectType_department_vj1://轻表单-------------------选vj2控件（初始接口）
                url = "/cmporgnization4M3/firstlevelVjoinUnitsWithoutlevelscope";
                if(id){
                    url += stringParam + pagingParam +"&accountId="+id + pageNo;
                }else {
                    url += stringParam + pagingParam + pageNo;
                }
                break;
            case selectOrgConstant.C_sSelectType_light_department_subvjunits://轻表单------------选vj1控件（初始接口）
                url = '/cmpsubdepartments4M3/subVjoinUnits/'+ id + stringParam + pagingParam + pageNo;
                break;
            case selectOrgConstant.C_sSelectType_light_department://轻表单-------------------选内部部门控件
                url = '/cmpsubdepartments4M3/subdepartments/'+id + stringParam ;
                url += "&excludeUrlParams=true"+pagingParam + pageNo;
                break;
            case selectOrgConstant.C_sSelectType_light_member: //轻表单--------------------------选人员控件
                var interfaceStr = self.opts.vj?"subVjoinEntitieswithoutlevelscope":"subentitieswithoutlevelscope";
                url =  '/cmpsubdepartments4M3/'+interfaceStr+stringParam;
                if(!self.opts.vj){
                    url += "&excludeUrlParams=true";
                }
                url += pagingParam + pageNo;
                break;
            case selectOrgConstant.C_sSelectType_light_department_member://轻表单------------------部门人员（内部控件）
                url =  '/cmpsubdepartments4M3/subentitieswithoutlevelscope'+stringParam +"&excludeUrlParams=true&parentId="+id + pagingParam + pageNo;
                if(self.opts.lightMemberPermission || self.memberType == 2){//如果是轻表单设置了权限或者是登录人员是vj人员
                    url = '/cmpsubdepartments4M3/subentities/'+id + stringParam +"&excludeUrlParams=true"+ pagingParam + pageNo;
                }
                break;
            case selectOrgConstant.C_sSelectType_light_vjDepartment_member://轻表单----------------vj部门人员
                url = "/cmpsubdepartments4M3/subVjoinEntitieswithoutlevelscope/"+ stringParam + "&parentId=" + id;
                if(self.opts.lightMemberPermission){
                    url = "/cmpsubdepartments4M3/subVjoinEntities/" + id + stringParam;
                }
                url += pagingParam + pageNo;
                break;
            case selectOrgConstant.C_sSelectType_account://轻表单----------------------------选内部单位控件时候用
                url = '/cmporgnization4M3/getAllAccounts'+ stringParam + pagingParam + pageNo;
                break;
            case selectOrgConstant.C_sSelectType_department_account://轻表单--------------选vj2控件用
                url = "/cmpsubdepartments4M3/vjoinAccount"+stringParam + pagingParam + pageNo;
                break;
            case selectOrgConstant.C_sSelectType_post://轻表单---------------------------选本单位的岗位控件用 /vj岗位
                url  = self.opts.vj?'/cmpposts4M3/vjoin': '/cmpposts4M3';
                if(id){
                    url += stringParam + pagingParam +"&accountId="+id+ pageNo; //切换单位时，带有单位id
                }else {
                    url += stringParam + pagingParam + pageNo;//默认取的是本单位
                }
                break;
            case selectOrgConstant.C_sSelectType_level://轻表单----------------------------选职务级别控件
                if(id){
                    url =  '/cmplevels4M3' + stringParam + pagingParam+"&accountId="+id+ pageNo;//切换单位时，带有单位id
                }else {
                    url =  '/cmplevels4M3' + stringParam + pagingParam + pageNo;
                }
                break;
            //============================表单控件相关     end================================================//

            //===========================搜索接口相关  start==================================================//
            case selectOrgConstant.C_sSelectType_flowSearch:
                var onlyInternal = self.label.indexOf("4") == -1?"1":"0";//搜索权限控制，搜索不包含编外人员(如果页签就没有编外人员，则搜索也不应该把编外人员搜索出来)
                self.searchParams = {
                    accountId:id,
                    searchType:self.searchType,
                    keyword:self.keyWord,
                    onlyInternal:onlyInternal
                };
                url = "/cmporgnization4M3/searchentities"+stringParam+ pagingParam + pageNo;
                break;
            case selectOrgConstant.C_sSelectType_lightSearch:
                self.searchParams = {
                    accountId:id,
                    searchType:self.searchType,
                    keyword:self.keyWord
                };
                url = "/cmporgnization4M3/searchentitieswithoutlevelscope"+ stringParam + pagingParam + pageNo;
                break;
            //===========================搜索接口相关  end==================================================//

            case selectOrgConstant.C_sSelectType_getCurrentUser://获取当前登陆人员信息
                url = "/cmporgnization4M3/currentUser" + stringParam;
                break;
            case selectOrgConstant.C_sSelectType_saveRecentContacts://保存最近联系人
                url = "/cmporgnization4M3/saveCustomOrgRecent";
                break;
            case selectOrgConstant.C_sSelectType_memberType://判断登陆人员类型
                url = "/cmpmembers4M3/type"+stringParam;
                break;
            default :
                break;
        }
        var targetUrl;
        if(self.opts.debug == true || self.opts.debug == "true"){
            var targetUrl = self.opts._targetServer +  '/seeyon/rest' + url;
            var proxyUrl = self.opts._proxyServer + '/ajaxProxy?targetUrl=' + encodeURIComponent(targetUrl)  + '&sessionId=' +  self.opts._sessionId;
            return proxyUrl;
        }else {
            targetUrl = self.baseUrl +  url;
        };
        return targetUrl;
    };
    selectOrg.prototype._sendAjax = function(type,url,body,success,error){
        console.log(url);
        _.ajax({
            url:url,
            type:type,
            dataType:'json',
            headers : {
                "Content-Type" : "application/json; charset=utf-8",
                "Accept":"application/json",
                'token' : _.token
            },
            data:body,
            success:success,
            error:function(e){
                console.log(e);
                _.dialog.loading(false);
                if(typeof error == "function"){
                    error(e);
                }else {
                    _.errorHandler(e);
                }
            }
        });
    }
    selectOrg.prototype._cacheSelectedDataID = function(dataArr){
        var self=  this;
        self.selectDataIDCache = [];
        var len = dataArr.length;
        if(len > 0) {
            var i = 0;
            for(; i < len; i ++) {
                var obj = _.parseJSON(dataArr[i]);
                var id = self._handleDepartmentID(obj.id);
                self.selectDataIDCache.push(id);
            }
        }
    };
    selectOrg.prototype._cachePreSelectedData = function(){
        var self = this;
        self.preSelectDataCache = [];
        var i = 0,len = self.selectDataCache.length;
        for(; i < len ; i ++) {
            self.preSelectDataCache.push(self.selectDataCache[i]);
        }
    };
    selectOrg.prototype._cacheSelectedData = function(){
        var self = this;
        self.selectDataCache = [];
        var i = 0,len = self.preSelectDataCache.length;
        for(; i < len ; i ++){
            self.selectDataCache.push(self.preSelectDataCache[i]);
        }
    };
    selectOrg.prototype._delSelectedDataById = function(info){
        var self = this;
        info = _.parseJSON(info);
        var i = 0,len = self.selectDataCache.length,index = -1;
        for(;i<len;i++){
            var selectedData = _.parseJSON(self.selectDataCache[i]);
            var id = info.id;
            if(self._handleDepartmentID(id) == self._handleDepartmentID(selectedData.id)){
                index = i;
                break;
            }
        }
        if (index > -1) {
            self.selectDataCache.splice(index, 1);
        }
    };
    selectOrg.prototype._updateSearchHistory = function(itemObj){
        var self = this;
        var i = 0,len =  self.searchHistory.children.length,contains = false;
        itemObj.searchHistoryData = true;
        if(len >0) {
            for(;i<len;i++){
                if(self.searchHistory.children[i].id == itemObj.id){
                    contains = true;
                    break;
                }
            }
        }
        if(!contains){
            self.searchHistory.children.push(itemObj);
        }
    };
    selectOrg.prototype._handleJumpPageData = function(){
        var self = this;
        var transedBackVal = _.storage.get("selected-data_"+self.id,true);
        var jumpOptsJSON = _.storage.get("cmp-selectOrg-opts",true);
        if(jumpOptsJSON && typeof jumpOptsJSON != "undefined") {
            var fillBackData = _.parseJSON(jumpOptsJSON).fillBackData;
            self.opts.fillBackData = fillBackData;
        }
        if(transedBackVal && typeof transedBackVal != "undefined") {//处理选择值
            transedBackVal = _.parseJSON('['+transedBackVal+']');
            var callback = self.opts.callback;
            if(callback) {
                var orgResult = new orgResultObj(selectOrgConstant.C_sOrgResult_light,transedBackVal);
                callback(_.toJSON(orgResult));
            }
            _.storage.delete("selected-data_"+self.id,true);
            _.storage.delete("cmp-selectOrg-opts",true);
        }
    };
    selectOrg.prototype._setSearchType = function(){
        var self = this;
        var searchType = 0;
        if(self.opts.type == selectOrgConstant.C_iFlowSelect){
            searchType = selectOrgConstant.C_iSearchType_member_homepage;//流程选人初始设置搜索类型是内部人员和外部人员都能搜索到的类型
        }else {
            switch(self.opts.selectType){
                case "account":
                    searchType = selectOrgConstant.C_iSearchType_account;
                    break;
                case "department":
                    searchType = selectOrgConstant.C_iSearchType_department;
                    break;
                case "post":
                    searchType = selectOrgConstant.C_iSearchType_post;
                    if(self.opts.vj) searchType = selectOrgConstant.C_iSearchType_post_vj;
                    break;
                case "level":
                    searchType = selectOrgConstant.C_iSearchType_level;
                    break;
                case "member":
                    searchType = selectOrgConstant.C_iSearchType_member;
                    if(self.opts.vj) searchType = selectOrgConstant.C_iSearchType_member_vj;
                    break;
                case "department_vj1":
                    searchType = selectOrgConstant.C_iSearchType_department_vj1;
                    break;
                case "department_vj2":
                    searchType = selectOrgConstant.C_iSearchType_department_vj2;
                    break;
            }
        }
        return searchType;
    };

    selectOrg.prototype._convertToVO = function(result) {
        var self = this;
        result.widgetType = self.opts.type;
        result.selectType = self.opts.selectType;
        result.tempType = self._convertVOType(result.children[0]);
        return result;
    };
    selectOrg.prototype._convertVOType = function(result){
        var self = this;
        var voType = "",dataType = "";
        dataType = result.et.toLocaleLowerCase();
        switch (dataType){
            case 'member':
                voType = selectOrgConstant.C_iType_Member;
                break;
            case 'department':
                voType = selectOrgConstant.C_iType_Department;
                break;
            case 'post':
                voType = selectOrgConstant.C_iType_Post;
                break;
            case 'level':
                voType = selectOrgConstant.C_iType_Level;
                break;
            case 'account':
                voType = selectOrgConstant.C_iType_Account;
                break;
            case 'all':
                voType = selectOrgConstant.C_iType_All;
                break;
            case 'team':
                voType = selectOrgConstant.C_iType_Team;
                break;
            case 'vjoin_1':
                voType = selectOrgConstant.C_iType_vjUnit;
                break;
            case 'vjoin_2':
                voType = self.opts.selectType == "department_vj1"?selectOrgConstant.C_iType_vjDepartment:selectOrgConstant.C_iType_vjAccount;
                break;
        }
        return voType;
    };
    selectOrg.prototype._convertAccountVO = function(accountDatas){
        var self = this;
        var topAccountData = new selectOrg_accountData(accountDatas);
        return topAccountData;
    };
    selectOrg.prototype._convertLabel = function(labels){
        var self = this;
        var i = 0,len = labels.length,label = "";
        for(;i<len;i++){
            switch (labels[i]){
                case "dept":
                    label += "5";
                    break;
                case "org":
                    label += "1";
                    break;
                case "post":
                    if(self.memberType == 1) continue;//如果是编外人员，则不要岗位页签
                    label += "2";
                    break;
                case "team":
                    label += "3";
                    break;
                case "extP":
                    label += "4";
                    break;
                case "level":
                    label += "6";
                    break;
                case "vjOrg":
                    label += "7";
                    break;
            }
        }
        return label;
    };
    var orgResultObj = function(orgResultType,orgResult){
        this.orgResultType = orgResultType;
        this.orgResult = transeRusult(orgResult);
        return this;
    };

    var transeRusult = function(orgResult){
        var result = [];
        var i = 0,len = orgResult.length;
        for(;i<len;i++){
            var orgData = _.parseJSON(orgResult[i]);
            var item = {};
            item.name = orgData.topLevel?orgData.dn||orgData.n:orgData.n;//【本单位】、【本部门】取名字和其他的不一样
            if(orgData.san && !orgData.recentPerson){//最近联系人不带单位简称
                item.name = item.name + "("+orgData.san+")";
            }
            if(orgData.et == "vjoin_1" || orgData.et == "vjoin_2"){
                orgData.et = "Department";
            }
            item.id = orgData.id;
            switch(orgData.et){
                case "Member":
                    item.account = orgData.accountID;
                    item.accountName = orgData.accountName;
                    item.accountShortname = orgData.accountShortname;
                    item.post = orgData.p;
                    item.icon = orgData.icon;
                    item.telphone = orgData.tnm;
                    break;
                case "Department":
                    if(orgData.containSub){
                        item.containSubDepartment = (orgData.containSub == 1)?true:false;
                    }
                    if(orgData.accountID){
                        item.account = orgData.accountID;
                        item.accountName = orgData.accountName;
                        item.accountShortname = orgData.accountShortname;
                    }
                    break;
                case "Account":
                    break;
                case "Post":
                    break;
                case "Level":
                    break;
                case "Team":
                    item.teamType = orgData.subName;
                    break;
            }
            item.type = orgData.et;
            if(orgData.topLevel){
                item.id = orgData.idd;
                if(orgData.topLevelType == "depM"){
                    item.type = "Department";
                }else {
                    item.type = "Account";
                }
                item.containSubDepartment = true;
            }
            result.push(item);
        }
        return result;
    };
    selectOrg.prototype._handleDepartmentID = function(id){
        if(id.indexOf("|") != -1){
            id = id.substring(0,id.indexOf("|"));
        }
        if(id.indexOf("_") != -1){
            id = id.substring(id.indexOf("_")+1);
        }
        return id;
    };
    //======================================================工具类================================================================//

    //选择按钮切换
    selectOrg.prototype._selectBtnSwitch = function(btn){
        if(btn.checked == true) {
            btn.checked = false;
        }else {
            btn.checked = true;
        }
    };
    //重置checkbox
    selectOrg.prototype._resetCheckBox = function(checkboxs){
        var i = 0,len = checkboxs.length;
        for(; i < len ; i ++) {
            if(checkboxs[i].classList.contains("excluded")) continue;//被排除的数据不重置
            checkboxs[i].checked = false;
        }
    };

    //钩钩
    selectOrg.prototype._radioGouSwitch = function(container,item){
        var gou = container.querySelector(".gougou");
        if(gou) {
            gou.parentNode.removeChild(gou);
        }
        var gougou = document.createElement("div");
        gougou.setAttribute("class","gougou");
        gougou.innerHTML = gouUI;
        item.appendChild(gougou);
    };
    //删除钩钩
    selectOrg.prototype._removeGou = function(container){
        var gou = container.querySelector(".gougou");
        if(gou){
            gou.parentNode.removeChild(gou);
        }
    };
    //增加钩钩
    selectOrg.prototype._addGou = function(container,id){
        var items = container.children;
        var i = 0;
        var len = items.length;
        for(;i < len; i++){
            var itemID = items[i].id;
            if(itemID == id) {
                if(!items[i].querySelector(".cmp-select-account-toNextLevel")){
                    var gougou = document.createElement("div");
                    gougou.setAttribute("class","gougou");
                    gougou.innerHTML = gouUI;
                    items[i].appendChild(gougou);
                    break;
                }
            }
        }
    };
    selectOrg.prototype._clearBtnSwitch = function(input,clearBtn){
        var value = input.value;
        if(value == "" || value.length == 0) {
            clearBtn.style.display = "none";
        }else {
            clearBtn.style.display = "inline-block";
        }
    };

    //指定的dom创建iscroll
    selectOrg.prototype._createScroller  = function(dom,isPP,direction,getListDataFun,renderDataFun,getListDataParams) {
        var self = this;
        var id = dom.getAttribute("id");
        var scroller;
        var fullScreenHeight = CMPFULLSREENHEIGHT < window.innerHeight? window.innerHeight:CMPFULLSREENHEIGHT;
        var imgCacheYCheckVal = self.opts.jump?0:fullScreenHeight;
        if(isPP) {
            // var down;
            // if("search" != direction){
            //     down = {
            //         contentdown:_.i18n("cmp.selectOrg.pullDownToRefresh"),
            //         contentrefresh: _.i18n("cmp.selectOrg.loading"),
            //         contentover:_.i18n("cmp.selectOrg.releaseToLoad")
            //     };
            // }
            scroller =  _.listView("#"+id,{
                imgCache:true,
//                imgCacheType:1,
                offset:{
                    x:0,
                    y:imgCacheYCheckVal
                },
                config: {
                    pageSize: selectOrgConstant.C_iLoadListData_pageSize,
                    params: getListDataParams,
                    dataFunc: getListDataFun,
                    renderFunc: renderDataFun
                },
                // down:down ,
                up: {
                    contentdown:_.i18n("cmp.selectOrg.pullUpToloadMore"),
                    contentrefresh: _.i18n("cmp.selectOrg.loading"),
                    contentnomore:_.i18n("cmp.selectOrg.noMoreData")
                }
            });
        }else {
            var vScroll = (direction == selectOrgConstant.C_iScrollDirection_verical)?true: false;
            var hScroll = (vScroll == true)?false : true;
            var imgCache = cmp.imgCache("#"+id,{scroll:true,type:2,offset:{x:0,y:window.innerHeight}});
            var scrollerOpt = {}
            var special = (id.indexOf("select_selectedList_scroll") != -1)?true:false;//已选区的滚动需要做特殊处理，因为需要对图片进行拖动
            scroller = new _.iScroll("#"+id,{
                vScroll:vScroll,
                hScroll:hScroll,
                x: 0,
                y: 0,
                bounce: true,
                bounceLock: false,
                momentum: true,
                lockDirection: true,
                useTransform: true,
                useTransition: false,
                handleClick: true,
                special:special,
                onScrollEnd:(imgCache != null)?function(){
                    imgCache.inspect(this.x,this.y)
                }:null,
                onRefresh:(imgCache != null)?function(){
                    imgCache.inspect(this.x,this.y)
                }:null
            });
        }
        return scroller;
    };
    selectOrg.prototype._updateWidth = function(dom,scroller) {
        var items = dom.getElementsByClassName("transverse-mark");
        var page = dom.querySelector(".scroller");
        var windowWid = _.os.android?document.body.clientWidth : window.innerWidth;
        var itemsWid = 0;
        for(var i = 0;i < items.length; i ++) {
            itemsWid += items[i].clientWidth;
        }
        if(itemsWid > windowWid) {
            page.style.width = itemsWid + 'px';
        }else {
            page.style.width = windowWid + 'px';
        }
        if(scroller && typeof scroller != "undefined") {
            scroller.refresh();
            var scrollerW = scroller.scrollerW,wrapperW = scroller.wrapperW,winW = window.innerWidth;
            if(scrollerW > wrapperW && scrollerW > winW){  //todo 优化选人组件横向滚动的增加元素后滚动到指定元素上
                scroller.scrollTo((wrapperW-scrollerW),0);
            }else if(scrollerW = winW){
                scroller.scrollTo(0,0);
            }

        }
    };
    selectOrg.prototype.setTop = function(target,dom,height){
        var targetScrollTop = target.scrollTop;
        height = (height && !height.isNaN)?height:0;
        var top = targetScrollTop + height + 'px';
        dom.style.top = top;
    };

    selectOrg.prototype.getCoordinate = function(event, page){
        return ("ontouchstart" in window) ? event.changedTouches[0][page] : event[page];
    };
    selectOrg.prototype.getTranslate = function(x,y){
        var distX = x, distY = y;
        return ("WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix()) ? "translate3d("+ distX +"px, "+ distY +"px, 0)" : "translate("+ distX +"px, "+ distY +"px)";
    };
    selectOrg.prototype.move = function(dom,x, y, timer, type){
        var self = this;
        dom.style.webkitTransitionProperty = "-webkit-transform";
        dom.style.webkitTransitionDuration = timer;
        dom.style.webkitTransitionTimingFunction = type;
        dom.style.webkitTransform = self.getTranslate(x, y);
    };
    //=============================专门处理单位层级关系的类（处理后，可用于直接展示）================//
    var selectOrg_accountData = function(accountDatas){
        var self = this;
        self.parentPath = [];
        self.onlyOneLevel = false;
        var accountMap = self.toMap(accountDatas);
        self.parentPath = self.uniqueArray(self.parentPath);
        self.parentPath = self.sortArray(self.parentPath);
        return self.convertToVoObj(accountMap);
    };
    selectOrg_accountData.prototype.toMap = function(accountData){
        var self = this;
        var map = new _.map();
        var accounts = accountData.children;
        var i = 0,len = accounts.length,onlyone = len == 1;
        for(; i < len; i ++) {
            var parentPath = accounts[i].pph;
            if(onlyone){
                self.parentPath.push(parentPath);
                map.put(parentPath,accountData);
                break;
            }else {
                var key = accounts[i].ph;
                if(parentPath != "" && parentPath.length > 0) {
                    self.parentPath.push(parentPath);
                }
                map.put(key,accounts[i]);
            }


        }
        if(!map.get("0000"))self.onlyOneLevel = true;
        return map;
    };
    selectOrg_accountData.prototype.convertToVoObj = function(map){
        var self = this;
        var len = self.parentPath.length- 1,onlyone = len == 0,getpphIndex = self.parentPath.length;
        var dataObj = map.container;
        for(var i = len;i >=0 ; i --) {
            if(onlyone && map.size() ==1) break;
            if(!dataObj[self.parentPath[i]]) continue;
            dataObj[self.parentPath[i]].children = [];
            for(var j in dataObj) {
                if(dataObj[j].pph == self.parentPath[i]){
                    dataObj[self.parentPath[i]].children.push(dataObj[j]);
                    map.remove(j);
                }
            }
            getpphIndex--;
        }
        if(onlyone) getpphIndex = 0;
        var result = {};
        if(self.onlyOneLevel){
            var firstLevelChild = map.get(self.parentPath[getpphIndex]);
            if(firstLevelChild && !firstLevelChild.hasOwnProperty("ph")
                && !firstLevelChild.hasOwnProperty("pph") && firstLevelChild.children.length >0){
                result.children = firstLevelChild.children;
            }else {
                result.children = map.values();
            }

        }else {
            result = map.get(self.parentPath[getpphIndex]);
        }
        return result;
    };
    selectOrg_accountData.prototype.uniqueArray = function(array){
        array = array || [];
        var a = {};
        for (var i=0; i<array.length; i++) {
            var v = array[i];
            if (typeof(a[v]) == 'undefined'){
                a[v] = 1;
            }
        };
        array.length=0;
        for (var i in a){
            array[array.length] = i;
        }
        return array;
    };
    selectOrg_accountData.prototype.sortArray = function(array){
        var i = 0;
        var j = array.length - 1;
        var Sort = function(i, j) {
            if (i == j) {
                return
            };
            var key = array[i].length;
            var cha = array[i];
            var stepi = i; // 记录开始位置
            var stepj = j; // 记录结束位置
            while (j > i) {
                if (array[j].length >= key) {
                    j--;
                } else {
                    array[i] = array[j];
                    while (j > ++i) {
                        if (array[i].length > key) {
                            array[j] = array[i];
                            break;
                        }
                    }
                }
            }
            if (stepi == i) {
                Sort(++i, stepj);
                return;
            }
            array[i] = cha;
            Sort(stepi, i);
            Sort(j, stepj);
        }
        Sort(i, j);
        return array;
    }

    //====================================================================================UI模板部分=========================//
    //选人头部区
    var selectHeader = function() {
        var selectHeader =
        '<header class="cmp-bar cmp-bar-nav cmp-select-header cmp-bar-select cmp-after-line <% if(this.h5header){ %>cmp-h5-header<% }else{ %> hiddenTag<% } %>">' +
        '    <div id="select_btnBack" class="cmp-pull-left select_btnBack"> ' +
        '        <span  class="see-icon-v5-common-arrow-back "></span>' +
        '        <span class="back_text cmp-btn-link">' + _.i18n("cmp.selectOrg.back") + '</span>' +
        '    </div>' +
        '    <h1 class="cmp-title">' +
        '    </h1>' +
        '</header>';
        return selectHeader;
    };
    //选人+选部门内容区
    var selectMDContent = function() {
        var selectMDContent =
        '<div class="cmp-content" id="select_content">' +
        '   <div id="select_content_title">' +
        '       <div class="cmp-content-title-search-select" id="select_contentTitleSearch">' +
        '          <h1 class="cmp-title background_fff <% if(this.opts.selectType!="' + selectOrgConstant.C_sSelectType_account + '"){ %> cmp-thinker-title-action <% } %>"">' +
        '              <span class="cmp-ellipsis cmp-selectOrg-title" id="select_title"><%=this.opts.title %></span>' +
        '              <% if(this.opts.selectType != "' + selectOrgConstant.C_sSelectType_account + '"){ %>' +
        '              <span class="cmp-icon cmp-icon-arrowdown <% if(this.opts.seeExtAccount){ %>cmp-select-accountBtn<% }else{ %>cmp-hidden<% } %>" id="select_accountSwitchBtn" account></span>' +
        '             <% } %>' +
        '         </h1>' +
        '         <span class="cmp-icon  cmp-icon-search search-btn" id="select_searchBtn"></span>' +
        '       </div>' +
        '       <div class="select-crumbs-container cmp-after-line">' +
        '           <div id="select_crumbs_scroll_<%=this.uuID %>" class="cmp-crumbs-content-select">' +
        '               <div id="select_crumbs_list" class="scroller"></div>' +
        '           </div>' +
        '       </div>' +
        '   </div>' +
        '   <div id="select_listContent_scroll_<%=this.uuID %>" class="select-selected-scroll">' +
        '       <div class="scroller">' +
        '           <ul id="select_listContent" class="cmp-selectOrg-list-content"></ul>' +
        '       </div>' +
        '   </div>' +
        '</div>';
        return selectMDContent;
    };

    //切换单位内容区
    var selectUContent =
        '<div class="cmp-content selectOrg <% if(this.selectType != "'+selectOrgConstant.C_sSelectType_account+'" && this.selectType != "'+selectOrgConstant.C_sSelectType_level+'"){ %> cmp-selectOrg-content"<% }else{ %>cmp-selectOrg-content2<% } %> <% if(cmp.os.ios){ %> ios <% } %>" id="select_content">' +
        '   <div id="select_listContent_scroll_<%=this.uuID %>" class="cmp-content">' +
        '       <div class="scroller">'+
        '           <ul id="select_listContent" class="cmp-selectOrg-list-content cmp-select-toggle-accounts-ul"></ul>' +
        '       </div>'+
        '   </div>'+
        '</div>';

    //轻表单选单位、选岗位、选职务级别内容区（增加搜索框）
    var selectL_PLContent = function () {
        var selectL_PLContent =
        '<div class="cmp-content selectOrg" id="select_content">' +
        '   <div id="select_content_title">' +
        '       <div class="cmp-content-title-search-select search-tag" id="select_contentTitleSearch">' +
        '           <input disabled id="select_searchBtn" class="cmp-select-input" type="search" name="search" form="cmp-selectOrg-input" placeholder="' + _.i18n("cmp.selectOrg.search") + '">' +
        '           <span class="cmp-icon  cmp-icon-search active search-icon2"></span>' +
        '       </div>' +
        '       <div class="select-crumbs-container  cmp-after-line">' +
        '           <div id="select_crumbs_scroll_<%=this.uuID %>" class="cmp-crumbs-content-select">' +
        '               <div id="select_crumbs_list" class="scroller"></div>' +
        '           </div>' +
        '       </div>' +
        '   </div>' +
        '   <div id="select_listContent_scroll_<%=this.uuID %>" class="cmp-scroll-wrapper" style="position: relative;">' +
        '       <div class="scroller">' +
        '           <ul id="select_listContent" class="cmp-selectOrg-list-content cmp-select-toggle-accounts-ul"></ul>' +
        '       </div>' +
        '   </div>' +
        '</div>';
        return selectL_PLContent;
    };
    var selectL_UContent = function() {
        var selectL_UContent =
        '<div class="cmp-content selectOrg" id="select_content">' +
        '   <div id="select_content_title">' +
        '       <div class="cmp-content-title-search-select search-tag" id="select_contentTitleSearch">' +
        '           <input disabled id="select_searchBtn" class="cmp-select-input" type="search" name="search" form="cmp-selectOrg-input" placeholder="' + _.i18n("cmp.selectOrg.search") + '">' +
        '           <span class="cmp-icon  cmp-icon-search active search-icon2"></span>' +
        '       </div>' +
        '   </div>' +
        '   <div id="select_listContent_scroll_<%=this.uuID %>" class="cmp-scroll-wrapper" style="position: relative;">' +
        '       <div class="scroller">' +
        '           <ul id="select_listContent" class="cmp-selectOrg-list-content cmp-select-toggle-accounts-ul"></ul>' +
        '       </div>' +
        '   </div>' +
        '</div>';
        return selectL_UContent;
    };

    //搜索页面(选人、选部门、选岗位用)
    var searchMDPPage = function() {
        var searchMDPPage =
        '<div id="select_search_title" style="width: 100%;">' +
        '    <% if(this.opts.h5header){ %>' +
        '    <header class="cmp-bar cmp-bar-nav cmp-select-header cmp-bar-select cmp-after-line cmp-h5-header">' +
        '        <div  class="cmp-pull-left select_btnBack"> ' +
        '            <span  class="see-icon-v5-common-arrow-back "></span>' +
        '            <span class="back_text cmp-btn-link">' + _.i18n("cmp.selectOrg.back") + '</span>' +
        '        </div>' +
        '        <h1 class="cmp-title">' +
        '        </h1>' +
        '    </header>' +
        '    <% } %>' +
        '   <header class="cmp-content-title-search-select  cmp-select-header" style="width: 100%;">' +
        '       <div class="cmp-input-row cmp-search">' +
        '           <form id="cmp-selectOrg-input"  onsubmit="return false;" action>' +
        '               <input id="select_searchInput" class="cmp-input-clear cmp-select-search-input" type="search" name="search" form="cmp-selectOrg-input" placeholder="' + _.i18n("cmp.selectOrg.search") + '">' +
        '           </form>' +
        '           <span id="select_searchClear" class="cmp-icon cmp-icon-clear" style="display:inline-block;left: 76%;"></span>' +
        '           <span class="cmp-icon  cmp-icon-search active search-icon"></span>' +
        '           <span id="select_searchCancel"  class="cmp-cancel-text cmp-select-search-cancelBtn">' + _.i18n("cmp.selectOrg.abolish") + '</span>' +
        '       </div>' +
        '   </header>' +
        '</div>' +
        '<div class="select_search_scroll" id="select_searchList_scroll_<%=this.searchUUID %>">' +
        '   <div class="scroller">' +
        '           <ul id="select_searchList" class="cmp-selectOrg-list-content"></ul>' +
        '   </div>' +
        '</div>';
        return searchMDPPage;
    };
    //单位切换页面
    var accountSwitchPageHtml = function() {
        var accountSwitchPageHtml =
            '    <% if(this.opts.h5header){ %>' +
            '    <header class="cmp-bar cmp-bar-nav cmp-select-header cmp-bar-select cmp-after-line cmp-h5-header">' +
            '        <div  class="cmp-pull-left select_btnBack"> ' +
            '            <span  class="see-icon-v5-common-arrow-back "></span>' +
            '            <span class="back_text cmp-btn-link">' + _.i18n("cmp.selectOrg.back") + '</span>' +
            '        </div>' +
            '        <h1 class="cmp-title">' +
            '        </h1>' +
            '    </header>' +
            '    <% } %>' +
        '<div class="select-crumbs-container  cmp-after-line">' +
        '    <div id="select_crumbs_scroll_account_<%=this.uuID %>" class="cmp-crumbs-content-select">' +
        '        <div id="select_crumbs_list_account" class="scroller"></div>' +
        '    </div>' +
        '</div>' +
        '<div id="select_accountList_scroll_<%=this.uuID %>" class="cmp-selectOrg-content-account-switch" style="margin-top: 0px;">' +
        '   <div class="scroller cmp-selectOrg-list-content">' +
        '       <ul id="select_accountSwitchList" class="cmp-select-toggle-accounts-ul"></ul>' +
        '   </div>' +
        '</div>' +
        '<div class="cmp-bar cmp-bar-tab cmp-candidate-bottom cmp-bar-select">' +
        '    <div class="select-bottom-btn">' +
        '        <div class="cmp-bottom-btn-group down top-line">' +
        '            <button id="select_accountCancelBtn"  class="cmp-btn cmp-btn-primary2 cmp-btn-outlined cmp-btn-width40 gap" >' +
        '                <span>' + _.i18n("cmp.selectOrg.abolish") + '</span>' +
        '            </button>' +
        '        </div>'+
        '    </div>'+
        '</div>';


        return accountSwitchPageHtml;
    };
    //流程选人按钮区
    var selectM4Flow = function() {
        var selectM4Flow =
        '<div class="cmp-bar cmp-bar-tab cmp-candidate-bottom cmp-bar-select <% if(this.more){ %>cmp-select-more<% } %>" id="select_footer">' +
        '   <div id="select_selectedList_scroll_<%=this.uuid %>" class="select-selected-scroll selected ">' +
        '       <div class="scroller">' +
        '           <ul id="select_selectedList" class="mui-table-view"></ul>' +
        '       </div>' +
        '   </div>' +
        '   <div id="select_bottomBtn" class="select-bottom-btn">' +
        '        <div class="cmp-bottom-btn-group top <% if(this.flowType != null && this.flowType != '+selectOrgConstant.C_iFlowSelect_default+') { %>cmp-hidden<% } %>">' +
        '            <div id="select_sequence" class="cmp-input-row cmp-radio cmp-left cmp-select-btn" >' +
        '                <label>' + _.i18n("cmp.selectOrg.sequence") + '</label><input name="radio1" type="radio">' +
        '            </div> ' +
        '            <div id="select_concurrent" class="cmp-input-row cmp-radio cmp-left cmp-select-btn" >' +
        '                 <label>' + _.i18n("cmp.selectOrg.concurrent") + '</label><input name="radio1" type="radio" checked>' +
        '            </div> ' +
        '            <div id="select_next_concurrent" class="cmp-input-row cmp-radio cmp-left cmp-select-btn cmp-ellipsis cmp-hidden " >' +
        '                 <label>' + _.i18n("cmp.selectOrg.nextConcurrent") + '</label><input name="radio1" type="radio">' +
        '            </div> ' +
        '        </div>' +
        '        <div class="cmp-bottom-btn-group down">' +
        '             <button id="select_closeBack" type="button"  class="cmp-btn cmp-btn-primary2 cmp-btn-outlined cmp-btn-width40">' +
        '                  <span> ' + _.i18n("cmp.selectOrg.abolish") + '</span>' +
        '             </button>' +
        '            <button id="select-btn-ok"  class="cmp-btn cmp-btn-primary select-btn-ok cmp-flow-type-<%=this.flowType %>" >' +
        '                  <span>' + _.i18n("cmp.selectOrg.confirm") + '</span>' +
        '             </button>' +
        '             <div id="select-btn-more" class="cmp-icon see-icon-more" ></div>' +
        '        </div>' +
        '</div>';
        return selectM4Flow;
    };
    //轻表单选人确定按钮区
    var selectM4Light = function() {
        var selectM4Light =
        '<div class="cmp-bar cmp-bar-tab cmp-candidate-bottom cmp-bar-select  <% if(this.maxSize == 1 && (this.fillBackData && this.fillBackData.length == 0)&&this._transed){ %>cmp-hidden<% } %>" id="select_footer">' +
        '   <div id="select_selectedList_scroll_<%=this.uuID %>" class="select-selected-scroll selected cmp-hidden">' +
        '       <div class="scroller">' +
        '           <ul id="select_selectedList" class="mui-table-view"></ul>' +
        '       </div>' +
        '   </div>' +
        '   <div id="select_bottomBtn" class="select-bottom-btn">' +
        '        <div class="cmp-bottom-btn-group down top-line">' +
        '            <button id="select_okBtn" class="cmp-btn cmp-btn-primary gap light">' +
        '                <span class="text vertical-top <% if(this.maxSize == 1 && !this.cancelRadio&&this._transed){ %> cmp-hidden<% } %>" >' +
        '                    <span class="ok vertical-top">' + _.i18n("cmp.selectOrg.confirm") + '</span>' +
        '                    <span class="vertical-top">(</span><span id="select_selectedNum" class="vertical-top"><%=this.selectedNum %></span><span class="vertical-top">)</span>' +
        '                </span>' +
        '               <% if(this.maxSize == 1 && this.fillBackData && this.fillBackData.length >0 && !this.cancelRadio&&this._transed){ %>' +
        '               <span></span>' +
        '           ' + _.i18n("cmp.selectOrg.cancel") + '' +
        '           <% } %>' +
        '           </button>' +
        '        </div>' +
        '    </div>' +
        '</div>';
        return selectM4Light;
    }
    var defaultMHead = cmpIMGPath+ "/def_member.png";
    var defaultADUPLHead = cmpIMGPath + "/def_adupl.png";    //列表item样式(选人+选部门)
    var selectMDItem = function() {
        var selectMDItem =
        '<% var children = this.children,i = 0,len = children.length; %>' +
        '<% var android4 = cmp.os.android && parseInt(cmp.os.version.substring(0,1)) < 5?true:false;  %>' +      //判断是否是android4                                                       //判断是否流程选人首页
        '   <% for(;i < len; i ++){ %>' +
        '   <% if(children[i].displayNone)  continue; %>' +
        '   <li type="<%=children[i].et %>" class="cmp-after-line cmp-list-cell cmp-selectOrg-list-cell <% if(children[i].topLevel){ %> home <% }else{ %>select-height-63<% } %> <% if(children[i].noSubName){ %>noSubName<% } %> <% if(children[i].vj){ %> vj<% } %>">' +
        '       <div class="cmp-list-cell-img cmp-selectOrg-checkbox cmp-left select-pt-6">' +
        '         <% if(children[i].light_memDept_cs_no){ %>' +
        '           <div class="cmp-select-placeholder-div"></div>' +
        '         <% }else if(children[i].topLevel){ %>' +
        '             <% if(children[i].chooseable && !children[i].allDept_cs_no){ %>' +
        '                 <input type="checkbox" name="select_checkbox" disabled id="<%=children[i].id %>" info=\'<%=cmp.toJSON(children[i]).escapeHTML() %>\'' +
        '                      class="cmp-select-input-disable select-put topLevel <%=children[i].topLevelType %>"> ' +
        '             <% }else if(children[i].placeholder){ %>' +
        '                 <div class="cmp-select-placeholder-div"></div>' +
        '             <% } %>' +
        '         <% }else if(children[i].allDept_cs_no || children[i].flow_et_choosable_no){ %>' +
        '           <div class="cmp-select-placeholder-div"></div>' +
        '         <% }else{ %>' +
        '           <input style="opacity:<% if(children[i].disable){ %>0<% }else{ %> 1<% } %>" type="checkbox" name="select_checkbox" disabled id="<%=children[i].id %>" info=\'<%=cmp.toJSON(children[i]).escapeHTML() %>\' ' +
        '             class="cmp-select-input-disable select-put <% if(children[i].allDept_Mem_choosed || children[i].allOrg_Mem_choosed){ %>choosed <% } %> ' +
        '             <% if(children[i].excluded){ %>excluded <% } %>' +
        '             <% if(children[i].relevant){ %>relevant <% } %>"' +
        '             <% if(children[i].allDept_Mem_choosed || children[i].allOrg_Mem_choosed || children[i].excluded){ %>checked style="opacity:0.3;" <% } %>' +
        '             <% if(children[i].relevant){ %> style="opacity:0.3;" <% } %>>' +
        '         <% } %>' +
        '         <% if(children[i].showFirstWord){ %>' +
        '           <img src="' + defaultADUPLHead + '" alt="<%=children[i].firstWord %>" cmp-data="<%=children[i].head %>" class="cmp-img-cache <% if(children[i].topLevel){ %>home_tal<% }else{ %> tal<% } %> <% if(android4){ %>tal-android4<% } %>"></img>' +
        '         <% }else if(children[i].type==' + selectOrgConstant.C_iType_Member + '){ %>' +
        '           <img  class="<% if(android4){ %>select-head-img-android4<% } %> cmp-pull-left img_setting cmp-img-cache select-head-img no-save" cmp-data="<%=children[i].id %>" src="' + defaultMHead + '">' +
        '         <% } %>' +
        '       </div>' +
        '       <div class="cmp-list-cell-info select-pt-6 cell-android4">' +
        '           <span class="cmp-ellipsis cmp-pull-left list_title_name">' +
        '         <%=children[i].n %>' +
        '           </span>' +
        '         <% if(!children[i].topLevel){ %><h6 class="cmp-ellipsis list_cont_info"><%=children[i].subName.escapeHTML() %></h6><% } %>' +
        '       </div>' +
        '      <% if(children[i].nextLevel){ %>' +
        '       <div class="select_accountHref cmp-list-navigate selectOrg " info=\'<%=cmp.toJSON(children[i]).escapeHTML() %>\'>' +
        '           <span class="cmp-icon   see-icon-tree-level"></span><span>' + _.i18n("cmp.selectOrg.next") + '</span>' +
        '       </div>' +
        '   <% } %>' +
        '</li>' +
        '<% } %>';
        return selectMDItem;
    };
    //列表item样式（选单位+选岗位+选职务级别）
    var selectAPLItem = function() {
        var selectAPLItem =
        '<% var children = this.children,i = 0,len = children.length; %>' +
        '<% for(; i < len; i ++){ %>' +
        '   <% if(children[i].displayNone || children[i]["ph"] == "0000")  continue; %>' +
        '   <li class="cmp-list-cell cmp-selectOrg-list-cell cmp-after-line">' +
        '      <div class="cmp-list-cell-img cmp-selectOrg-checkbox cmp-left">' +
        '     <% if(children[i].cs && children[i].cs == "' + selectOrgConstant.C_iWholeChoose_can + '"){ %>' +
        '         <input disabled style="opacity: 1;" id="<%=children[i].id %>" info=\'<%=cmp.toJSON(children[i]) %>\' class="select-put cmp-select-input-disable" type="checkbox" name="select_checkbox">' +
        '     <% } %>' +
        '      </div>' +
        '      <div class="cmp-list-cell-info">' +
        '         <span class="cmp-ellipsis cmp-pull-left list_title_name">' +
        '        <% if(this.keyWord){ %>' +
        '           <%=children[i].n %>' +
        '        <% }else { %>' +
        '           <%=children[i].n %>' +
        '        <% } %>' +
        '        </span>' +
        '     </div>' +
        '     <% if(children[i].children && children[i].children.length > 0){ %>' +
        '     <div class="select_accountHref cmp-list-navigate cmp-select-account-toNextLevel" info=\'<%=cmp.toJSON(children[i]) %>\'>' +
        '        <span class="cmp-icon   see-icon-tree-level"></span><span>' + _.i18n("cmp.selectOrg.next") + '</span>' +
        '     </div>' +
        '     <% } %>' +
        '  </li>' +
        '<% } %>';
        return selectAPLItem;
    }
    //无内容item样式
    var noThingItem = function() {
        var noThingItem =
        '<li class="cmp-selectOrg-list-no-content">' +
        '    <div class="cmp-selectOrg-list-center"><div class="StatusContainer"><div class="nocontent"></div><span class="text nocontent_text">' + _.i18n("cmp.selectOrg.noData") + '</span></div></div>' +
        '</li>';
        return noThingItem;
    }
    var gouUI =
        '<div class="cmp-list-navigate select_Kou select_gou">' +
        '   <span class="cmp-icon cmp-icon-checkmarkempty Kou"></span>' +
        '</div>';
    //切换单位item样式
    var switchUItem = function() {
        var switchUItem =
        '<% var children = this.children; %>' +
        '<% if(children && children.length > 0){ %>' +
        '   <% for(var i = 0; i < children.length; i ++){ %>' +
        '   <li id="<%=children[i].id %>" class="cmp-list-cell no_select cmp-selectOrg-list-cell cmp-after-line" info=\'<%=cmp.toJSON(children[i]) %>\'>' +
        '       <div class="cmp-list-cell-info2">' +
        '           <span class="cmp-ellipsis cmp-pull-left list_title_name"><%=children[i].n %></span>' +
        '       </div>' +
        '      <% if(children[i].children && children[i].children.length > 0){ %>' +
        '       <div class="cmp-select-account-toNextLevel cmp-list-navigate selectOrg" info=\'<%=cmp.toJSON(children[i]) %>\'>' +
        '           <span class="cmp-icon   see-icon-tree-level"></span><span class="text">' + _.i18n("cmp.selectOrg.next") + '</span>' +
        '       </div>' +
        '      <% }else if(this.accountID == children[i].id){ %>' +
        '       <div class="gougou">' + gouUI + '</div>' +
        '      <% } %>' +
        '   </li>' +
        '   <% } %>' +
        '<% } %>';
        return switchUItem;
    };

    //选择后的item展示模板
    var itemDisplay =
        '<% var name = this.dn?this.dn:this.n; %>'+
        '<div class="branch_select selectOrg-list-org cmp-list-cell-img">' +
        '   <img class="mui-media-object no-save" src="<%=this.head %>">'+
        '   <h6 class="mui-ellipsis selected_text">' +
        '       <span><%=name.escapeHTML() %></span>' +
        '   </h6>'+
        '</div>';
    //提供一个可以异步填回填值的方法
    selectOrg.prototype.fillBack = function(orgData) {
        var self = this;
        self.opts.fillBackData = orgData;
        self._transeFillbackData();
        self.selectDataCache = self.opts.fillBackData;
    };
    selectOrg.prototype.asyncShow = function(flowType){  //组件每次异步重现的时候，需要清空回填值(应用场景在流程图选人的时候，其他场景下不需要调该方法)
        var self = this;
        if(!self.opts._transed){
            _.backbutton.push(_.selectOrgClose);
        }
        if((!self.opts.fillBackData || self.opts.fillBackData.length == 0)){
            self.selectDataCache = [];
            self.preSelectDataCache = [];
            self.selectDataIDCache = [];
            self.deptChain = {};
            self.orgChain = [];
            self.switchAccount = false;
            self.accountChoosed = 0;
        }else {
            self._transeFillbackData();//将开发者传的简单回传值进行渲染转换
            self.selectDataCache = self.opts.fillBackData;
            self._cacheSelectedDataID(self.opts.fillBackData);
            self._cachePreSelectedData();
        }
        self.keyWord = "";
        self.choosableType = self._transeChoosableType();
        var accountSwitchPage = self.basicDiv.querySelector("#select_accountSwitchPage");
        var footer = self.basicDiv.querySelector("#select_footer");
        var content = self.basicDiv.querySelector("#select_content");
        var title = self.basicDiv.querySelector("#select_content_title");
        var selectBottomBtn = footer.querySelector("#select_bottomBtn"),
            selectOk = footer.querySelector("#select-btn-ok"),
            moreBtn = footer.querySelector("#select-btn-more"),
            flowCheckboxDiv = footer.querySelector(".select-bottom-btn>.top");
        if(flowType && flowType != null) {
            if((flowType == selectOrgConstant.C_iFlowSelect_increase || flowType == selectOrgConstant.C_iFlowSelect_replace)){
                flowCheckboxDiv.classList.add("cmp-hidden");
                self.flowType = flowType;
            }else {

                flowCheckboxDiv.classList.remove("cmp-hidden");
                self.flowType = null;
            }
            footer.classList.remove("cmp-hidden");

        }else {
            flowCheckboxDiv.classList.remove("cmp-hidden");
            self.flowType = null;
        }
        selectOk.className = selectOk.className.replace(/cmp-flow-type-[123]/,"cmp-flow-type-"+flowType);
        if(self.opts.moreOptions){//是否显示更多按钮的
            footer.classList.add("cmp-select-more");
        }else {
            footer.classList.remove("cmp-select-more");
        }
        if(self.opts.flowOptsChange){
            if(self.opts.vj && self.opts.type == 2){//如果是vj，则页签只有【外部机构】
                self.label = "7"
            }else {
                self.label = self._convertLabel(self.opts.label);//获取首页显示页
            }
            self.orgDataUrl = self._getOrgUrl(selectOrgConstant.C_sSelectType_all);
            self.initRenderCrumbs = true;
            self.path = {  //父路径和当前路径的转换，用于回退按钮和面包屑按钮使用
                parent:selectOrgConstant.C_oFlowHome.parentPath,
                self:selectOrgConstant.C_oFlowHome.id
            };
            self.parentParent = {};
            self.parentParent[selectOrgConstant.C_oFlowHome.id] = selectOrgConstant.C_oFlowHome.id;//初始化将父地址设为常量最高级
            _.dialog.loading();
            self.excludeData = self._transExcludeData();
            self.excludeUrlParams = self._transExcludeUrlParams();
            self.scrollerCache['content'].pullupLoading(1);
        }else {
            self._renderFillback(self.widget,"select_listContent");
        }
        var accountBtn = self.widget.querySelector("#select_accountSwitchBtn");
        if(accountBtn){
            if(self.opts.seeExtAccount && self.memberType != 1 && self.memberType != 2 && !self.opts.vj){
                accountBtn.classList.remove("cmp-hidden");
                accountBtn.classList.add("cmp-select-accountBtn");
            }else {
                accountBtn.classList.remove("cmp-select-accountBtn");
                accountBtn.classList.add("cmp-hidden");
            }
        };
        self.cancelRadio = self.opts.cancelRadio;
        if(self.widget != null) {
            self.widget.style.display = "block";
            if(self.scrollerCache['selected']){
                var selectedArea = self.widget.querySelector("#select_selectedList_scroll_" + self.uuID);
                if(selectedArea.classList.contains("cmp-active")){
                    selectedArea.classList.remove("cmp-active");
                    selectedArea.classList.add("cmp-hidden");
                }
                self._setContentHeight(self.basicDiv);
                self.scrollerCache['content'].refresh();


            }
            setTimeout(function(){
                _.dialog.loading(false);
                self.widget.classList.remove("cmp-select-basicDiv-close");
                self.widget.classList.add("cmp-select-basicDiv-show");
                if((!self.opts.fillBackData || self.opts.fillBackData.length == 0)){
                }else {
                    self._renderSelectedData4SelectArea(self.widget);
                }
            },0);
        }
        if(accountSwitchPage){
            accountSwitchPage.remove();
        }
    };
    selectOrg.prototype._changeContentUI = function(radio,isSearch){
        var self = this;
        if(!self.opts._transed){
            _.backbutton.push(_.selectOrgClose);
        }
        self._updateTitle(self.basicDiv);
        var scrollerKey = isSearch?"search":"content";
        var selectFooter = self.widget.querySelector("#select_footer");
        var numSpan = selectFooter.querySelector("#select_selectedNum");
        var contentH = self.scrollerCache[scrollerKey].wrapper.offsetHeight;
        var selectedAreaH ;
        if(self.scrollerCache['selected']){
            var selectedArea = self.widget.querySelector("#select_selectedList_scroll_" + self.uuID);
            if(radio){
                selectedAreaH = selectedArea.offsetHeight;
                selectedArea.classList.remove("cmp-active");
                selectedArea.classList.add("cmp-hidden");
                self.scrollerCache[scrollerKey].wrapper.style.height = (contentH + selectedAreaH) + "px";
                self.scrollerCache[scrollerKey].refresh();
            }else {
                if(self.selectDataCache.length == 0) {
                    if(selectedArea.classList.contains("cmp-active")){
                        selectedAreaH = selectedArea.offsetHeight;
                        selectedArea.classList.remove("cmp-active");
                        selectedArea.classList.add("cmp-hidden");
                        self.scrollerCache[scrollerKey].wrapper.style.height = (contentH + selectedAreaH) + "px";
                        self.scrollerCache[scrollerKey].refresh();
                    }
                }
            }
        }

        if(numSpan) {
            numSpan.innerText = self.selectDataCache.length;
        }
        self.scrollerCache[scrollerKey].refresh();

    };
    selectOrg.prototype.changeOptsShow = function(){  //组件每次异步重现的时候，需要清空回填值(应用场景在流程图选人的时候，其他场景下不需要调该方法)
        var self = this;
        if(self.opts.fillBackData == null){
            self.selectDataCache = [];
            self.preSelectDataCache = [];
            self.selectDataIDCache = [];
            self.deptChain = {};
        }else {
            self._transeFillbackData();
            self.selectDataCache = self.opts.fillBackData;
            self._cacheSelectedDataID(self.selectDataCache);
        }
        self.keyWord = "";
        self.cancelRadio = self.opts.cancelRadio;
        self._renderFillback(self.widget,"select_listContent",self.opts.multitype);
        if(self.widget != null) {
            self.widget.style.display = "block";
            setTimeout(function(){
                _.dialog.loading(false);
                self.widget.classList.remove("cmp-select-basicDiv-close");
                self.widget.classList.add("cmp-select-basicDiv-show");
                if(self.opts.fillBackData && self.opts.fillBackData.length){
                    self._renderSelectedData4SelectArea(self.basicDiv);
                }
                self._changeContentUI(self.opts.maxSize == 1,self.doSearch);
            },0);
        }
    };
    selectOrg.prototype.doSelect = function(){
        var self = this;
        var selectConfrim = self.basicDiv.querySelector("#select-btn-ok");
        _.event.trigger("moreBtnTapTrigger",selectConfrim,"customSelect");//触发更多按钮点击时，流程按钮的点击
    };
    var selectOrgWidget = {};
    _.selectOrg = function(ctrl,opts) {
        _.dialog.loading();
        if(!selectOrgWidget[ctrl]) {
            selectOrgWidget[ctrl] = new selectOrg(ctrl,opts);
        }else {
            if(document.getElementById(ctrl)) { //如果是绑定的页面按钮，则一个按钮只能对应一个组件
                throw "one SelectOrg widget one ctrl！！！";
            }else {                              //此场景是开发者自己绑定了按钮的情况
                if(opts.type == selectOrgConstant.C_iFlowSelect) {  //流程选人的各种复杂逻辑
                    var flowType = opts.flowType;
                    if(flowType) {
                        selectOrgWidget[ctrl].opts = _.extend({
                            title:'',//组件标题(开发者自定义，如果没有定义，则取当前单位的名称作为标题)
                            type:selectOrgConstant.C_iFlowSelect,//类型：1，流程选人；2，轻表单选人
                            flowType:null,//流程选人，条件改变参数1：改变成单选（及进行替换操作）2：多选模式（多选操作）3：默认模式；其他：（默认可以不传该值）
                            selectType:selectOrgConstant.C_sSelectType_member,//选择类型：'member':选人；'department':选部门；'post':选岗位；'account':选单位；'level':选职务级别
                            choosableType:["department","account","member","post","team","level","vjoin_1","vjoin_2"],//流程选人中，可选数据类型组合，默认是可以选人员、部门、单位、岗位、组、职务级别,vjoin_1外部机构，vjoin_2外部单位
                            maxSize:-1,//最多选择数，若为1则为单选，其他都是多选(如果是流程选人，会忽略此参数，一概认定是多选)
                            minSize:-1,//最少选人数，若为-1则不进行控制,如果选人数少于该值则进行提示
                            fillBackData:null,//回填值格式：[{id:181818,name:杨海,type:"member"}]
                            excludeData:null,//被排除的不能选择的数据，格式同fillBackData一样默认是被排除的人员是被选中的，如果想要被排除的数据不被默认选中，需要在数据上传属性disable:true 如:[{id:181818,name:"杨海",type:"member",disable:true}]
                            callback:null,//回调函数（根据组件类型返回的值有数据类型标识：1、light:轻表单；2、concurrent：流程并联；3、sequence：流程串联）
                            multitype:false,//是否进行多类型选择（用于轻表单选人中可进行部门选择，如果还有其他情况以后再进行扩展，默认是可以进行多类型选择的）
                            closeCallback:null,//关闭组件的回调函数
                            directDepartment:false,//流程选人时，是否直选部门（不弹是否包含子部门的提示）
                            label:["dept","org","post","team","extP"],
                            flowOptsChange:false,//是否进行流程选人配置参数的重置
                            permission:true,//流程选人时，整体选部门，选岗位、选组、选本单位是否受当前登录人员权限控制(默认流程选人要受权限控制)
                            server:null,//对于跨域请求rest接口的时候，需要开发者自定义服务器地址
                            seeExtAccount:true,//是否能查看外单位，即是否能进行外单位切换
                            cancelRadio:true,
                            notSelectAccount:false,//所有的【本单位】都不能选择
                            notSelectSelfDepartment:false,//【本部门】不能被选
                            vj:false,//是否是有vjoin的选人权限
                            moreOptions:null,//更多按钮的回调函数，定义的话就会在右下角显示三个蓝色的点点
                            h5header:false,//是否使用原来的H5头部
                            hiddenCancelbtn:false,//是否隐藏取消按钮
                            nextConcurrent:false //增加许强威哪儿的与下一节点并发按钮参数
                        },opts);
                        selectOrgWidget[ctrl].asyncShow(flowType);
                    }else {
                        selectOrgWidget[ctrl]._reShow();
                    }
                }else {
                    var lightOptsChange = opts.lightOptsChange;//是否进行同类型轻表单配置参数的重置
                    if(lightOptsChange){
                        selectOrgWidget[ctrl].opts = _.extend({
                            title:"",
                            maxSize:-1,
                            minSize:-1,
                            fillBackData:null,
                            callback:null,
                            multitype:false,
                            cancelRadio:true,
                            closeCallback:null
                        },opts);
                        selectOrgWidget[ctrl].changeOptsShow(); //轻表单选人使用reShow
                    }else {
                        selectOrgWidget[ctrl]._reShow();
                    }

                }
            }
        }
        return selectOrgWidget[ctrl];
    };

    //销毁选人组件
    _.selectOrgDestory = function(ctrl){
        if(typeof selectOrgWidget[ctrl] != "undefined" && selectOrgWidget[ctrl] != null){
            if(selectOrgWidget[ctrl].basicDiv){
                selectOrgWidget[ctrl].basicDiv.remove();
            }
            for(var key in selectOrgWidget[ctrl] ){
                delete selectOrgWidget[ctrl][key];
            }
            selectOrgWidget[ctrl] = undefined;
        }
    };


    //关闭选人组件
    _.selectOrgClose = function(){
        var currentSelectOrg = document.querySelector(".cmp-select-basicDiv-show");
        if(currentSelectOrg){
            var uid = currentSelectOrg.getAttribute("uid");
            if(typeof selectOrgWidget[uid] != "undefined" && selectOrgWidget[uid] != null){
                selectOrgWidget[uid]._close(selectOrgWidget[uid].basicDiv);
                var closeCallback = selectOrgWidget[uid].opts.closeCallback;
                if(closeCallback && typeof closeCallback == "function"){
                    closeCallback();
                }
            }
        }
    };
    var tapJumpNum = 0;
    _.selectOrgJump = function(ctrl,options){
        tapJumpNum ++;
        if(tapJumpNum > 1) return;
        var _options = _.extend({
            title:'',//组件标题(开发者自定义，如果没有定义，则取当前单位的名称作为标题)
            type:selectOrgConstant.C_iFlowSelect,//类型：1，流程选人；2，轻表单选人
            flowType:null,//流程选人，条件改变参数1：改变成单选（及进行替换操作）2：多选模式（多选操作）3：默认模式；其他：（默认可以不传该值）
            selectType:selectOrgConstant.C_sSelectType_member,//选择类型：'member':选人；'department':选部门；'post':选岗位；'account':选单位；'level':选职务级别
            maxSize:-1,//最多选择数，若为1则为单选，其他都是多选(如果是流程选人，会忽略此参数，一概认定是多选)
            minSize:-1,//最少选人数，若为-1则不进行控制,如果选人数少于该值则进行提示
            fillBackData:null,//回填值格式：[{id:181818,name:杨海}]
            multitype:false,//是否进行多类型选择（用于轻表单选人中可进行部门选择，如果还有其他情况以后再进行扩展，默认是可以进行多类型选择的）
            pageKey:"",
            metadata: {},
            h5header:false//是否使用原来的H5头部
        },options);
        var currentSearch = window.location.search;
        if(currentSearch != "" && currentSearch.length >0){
            if(currentSearch.indexOf("?") != -1){
                currentSearch= currentSearch.replace("?","");
            }
            if(currentSearch.indexOf("pageKey") != -1){
                var searchArr=[];
                if(currentSearch.indexOf("&") != -1){
                    searchArr = currentSearch.split("&");
                }
                if(searchArr.length >0) {
                    for(var i = 0;i<searchArr.length;i++){
                        if(searchArr[i].indexOf("pageKey") != -1){
                            var pageKeyVal = searchArr[i].split("=")[1];
                            if(pageKeyVal != _options.pageKey){
                                _.storage.delete("cmp-selectOrg-jump-pageKey",true);
                            }
                            break;
                        }
                    }
                }else {
                    var pageKeyVal = currentSearch.split("=")[1];
                    if(pageKeyVal != _options.pageKey){
                        _.storage.delete("cmp-selectOrg-jump-pageKey",true);
                    }
                }
            }

        }else {
            var historyPageKey = _.storage.get("cmp-selectOrg-jump-pageKey",true);
            if(historyPageKey){
                _.storage.delete("cmp-selectOrg-jump-pageKey",true);
            }
        }
        _.storage.save("cmp-selectOrg-opts", _.toJSON(_options),true);
        var tempPath = selectOrgConstant.C_sJumpPagePath +"&options=cmp-selectOrg-opts&pageKey=" + _options.pageKey;
        _.event.trigger("beforepageredirect",document);
        _.href.next(tempPath);
    };

})(cmp);





