webpackJsonp([1],{"9n10":function(t,s){},CFcU:function(t,s){},K7kg:function(t,s,e){"use strict";var a={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"container"},[e("div",{staticClass:"popup"},[e("header",{staticClass:"popup-header"},[t._t("header",[t._v("\n          提示\n        ")])],2),t._v(" "),e("section",{staticClass:"popup-body"},[t._t("body",[t._v("\n          人员只能选择一个\n        ")])],2),t._v(" "),e("footer",{staticClass:"popup-footer"},[t._t("footer",[e("button",{staticClass:"btn-green",attrs:{type:"button"},on:{click:t.close}},[t._v("确定\n          ")])])],2)])])},staticRenderFns:[]};var i=e("VU/8")({name:"popup",methods:{close:function(){this.$emit("close")}}},a,!1,function(t){e("gdWg")},null,null);s.a=i.exports},M6Sr:function(t,s){},NHnr:function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var a=e("7+uW"),i={render:function(){var t=this.$createElement,s=this._self._c||t;return s("div",{attrs:{id:"app"}},[s("keep-alive",[s("router-view")],1)],1)},staticRenderFns:[]};var n=e("VU/8")({name:"App"},i,!1,function(t){e("Un8f")},null,null).exports,c=e("/ocq"),o=e("nbxm"),r={render:function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"content"},[a("div",{staticClass:"bigsearch"},[a("div",{staticClass:"search"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.keyword,expression:"keyword"}],staticClass:"search-input",attrs:{type:"text",placeholder:"搜索"},domProps:{value:t.keyword},on:{input:function(s){s.target.composing||(t.keyword=s.target.value)}}}),t._v(" "),a("button",{on:{click:function(s){return t.getNameInfo()}}},[t._v("确定")])])]),t._v(" "),a("div",{staticClass:"scroller"},[a("ul",{attrs:{id:"select_listContent"}},t._l(t.memberList,function(s){return a("li",{key:s.id,staticClass:"Recent"},[a("div",{staticClass:"avatar"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.radvalue,expression:"radvalue"}],staticClass:"radio_type",attrs:{type:"checkbox"},domProps:{value:s,checked:Array.isArray(t.radvalue)?t._i(t.radvalue,s)>-1:t.radvalue},on:{change:function(e){var a=t.radvalue,i=e.target,n=!!i.checked;if(Array.isArray(a)){var c=s,o=t._i(a,c);i.checked?o<0&&(t.radvalue=a.concat([c])):o>-1&&(t.radvalue=a.slice(0,o).concat(a.slice(o+1)))}else t.radvalue=n}}}),t._v(" "),a("img",{attrs:{src:e("qELt"),alt:""}})]),t._v(" "),a("div",{staticClass:"information"},[a("span",[t._v(t._s(s.name))]),t._v(" "),a("h6",[t._v(t._s(s.code))])])])}),0)]),t._v(" "),a("footer",[a("button",{attrs:{type:"submit"},on:{click:function(s){return t.handlebtnclick()}}},[t._v("确认")])]),t._v(" "),a("popup",{directives:[{name:"show",rawName:"v-show",value:t.isPopupVisible,expression:"isPopupVisible"}],on:{close:t.closePopup}})],1)},staticRenderFns:[]};var l=function(t){e("CFcU")},_=e("VU/8")(o.a,r,!1,l,"data-v-5df5970e",null).exports,v={name:"Danwei",methods:{bgbutton:function(){console.log(321)}}},d={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"content"},[e("header",[e("div",{attrs:{id:"select_contentTitleSearch"}},[e("div",{staticClass:"Choose"},[e("span",{staticClass:"select_title"},[t._v("单选人员")]),t._v(" "),e("router-link",{staticClass:"Down",attrs:{to:"/jituan"}},[e("i",{staticClass:"iconfont icon-arrow_right"})])],1),t._v(" "),t._m(0)])]),t._v(" "),e("div",{staticClass:"select_crumbs_list"},[e("div",{staticClass:"select"},[e("router-link",{attrs:{to:"/"}},[e("a",[t._v("雅居乐集团控股公司")])]),t._v(" "),t._m(1)],1)]),t._v(" "),t._m(2),t._v(" "),e("footer",[e("button",{on:{click:t.bgbutton}},[t._v("确定")])])])},staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"Find"},[s("i",{staticClass:"iconfont icon-fangdajing"})])},function(){var t=this.$createElement,s=this._self._c||t;return s("span",[s("i",{staticClass:"iconfont icon-arrow-left"}),this._v("本单位")])},function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"scroller"},[a("ul",{attrs:{id:"select_listContent"}},[a("li",{staticClass:"binded"},[a("div",{staticClass:"avatar"},[a("img",{attrs:{src:e("sq4+"),alt:""}})]),t._v(" "),a("div",{staticClass:"Unit"},[a("span",[t._v("总裁办公室")]),t._v(" "),a("h6",[t._v("(10)")])]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"binded"},[a("div",{staticClass:"avatar"},[a("img",{attrs:{src:e("sq4+"),alt:""}})]),t._v(" "),a("div",{staticClass:"Unit"},[a("span",[t._v("总裁办公室")]),t._v(" "),a("h6",[t._v("(10)")])]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"binded"},[a("div",{staticClass:"avatar"},[a("img",{attrs:{src:e("sq4+"),alt:""}})]),t._v(" "),a("div",{staticClass:"Unit"},[a("span",[t._v("总裁办公室")]),t._v(" "),a("h6",[t._v("(10)")])]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"binded"},[a("div",{staticClass:"avatar"},[a("img",{attrs:{src:e("sq4+"),alt:""}})]),t._v(" "),a("div",{staticClass:"Unit"},[a("span",[t._v("总裁办公室")]),t._v(" "),a("h6",[t._v("(10)")])]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"binded"},[a("div",{staticClass:"avatar"},[a("img",{attrs:{src:e("sq4+"),alt:""}})]),t._v(" "),a("div",{staticClass:"Unit"},[a("span",[t._v("总裁办公室")]),t._v(" "),a("h6",[t._v("(10)")])]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"binded"},[a("div",{staticClass:"avatar"},[a("img",{attrs:{src:e("sq4+"),alt:""}})]),t._v(" "),a("div",{staticClass:"Unit"},[a("span",[t._v("总裁办公室")]),t._v(" "),a("h6",[t._v("(10)")])]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"binded"},[a("div",{staticClass:"avatar"},[a("img",{attrs:{src:e("sq4+"),alt:""}})]),t._v(" "),a("div",{staticClass:"Unit"},[a("span",[t._v("总裁办公室")]),t._v(" "),a("h6",[t._v("(10)")])]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"binded"},[a("div",{staticClass:"avatar"},[a("img",{attrs:{src:e("sq4+"),alt:""}})]),t._v(" "),a("div",{staticClass:"Unit"},[a("span",[t._v("总裁办公室")]),t._v(" "),a("h6",[t._v("(10)")])]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"binded"},[a("div",{staticClass:"avatar"},[a("img",{attrs:{src:e("sq4+"),alt:""}})]),t._v(" "),a("div",{staticClass:"Unit"},[a("span",[t._v("总裁办公室")]),t._v(" "),a("h6",[t._v("(10)")])]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"binded"},[a("div",{staticClass:"avatar"},[a("img",{attrs:{src:e("sq4+"),alt:""}})]),t._v(" "),a("div",{staticClass:"Unit"},[a("span",[t._v("总裁办公室")]),t._v(" "),a("h6",[t._v("(10)")])]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"binded"},[a("div",{staticClass:"avatar"},[a("img",{attrs:{src:e("sq4+"),alt:""}})]),t._v(" "),a("div",{staticClass:"Unit"},[a("span",[t._v("总裁办公室")]),t._v(" "),a("h6",[t._v("(10)")])]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"binded"},[a("div",{staticClass:"avatar"},[a("img",{attrs:{src:e("sq4+"),alt:""}})]),t._v(" "),a("div",{staticClass:"Unit"},[a("span",[t._v("总裁办公室")]),t._v(" "),a("h6",[t._v("(10)")])]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"binded"},[a("div",{staticClass:"avatar"},[a("img",{attrs:{src:e("sq4+"),alt:""}})]),t._v(" "),a("div",{staticClass:"Unit"},[a("span",[t._v("总裁办公室")]),t._v(" "),a("h6",[t._v("(10)")])]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])])])])}]};var u=e("VU/8")(v,d,!1,function(t){e("YU/U")},"data-v-58cfe634",null).exports,p={render:function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"content"},[this._m(0),this._v(" "),this._m(1),this._v(" "),s("footer",[s("button",{on:{click:this.btnnext}},[this._v("取消")])])])},staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"select_crumbs_list"},[s("div",{staticClass:"select"},[this._v("\n            雅居乐集团\n        ")])])},function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"scroller"},[e("ul",{staticClass:"select_listContent"},[e("li",{staticClass:"homebinded"},[e("div",{staticClass:"group"},[t._v("集团")])]),t._v(" "),e("li",{staticClass:"homebinded"},[e("div",{staticClass:"group"},[t._v("雅居乐集团控股公司")]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"homebinded"},[e("div",{staticClass:"group"},[t._v("地产集团")]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"homebinded"},[e("div",{staticClass:"group"},[t._v("建设集团")]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"homebinded"},[e("div",{staticClass:"group"},[t._v("环保集团")]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"homebinded"},[e("div",{staticClass:"group"},[t._v("教育集团")]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"homebinded"},[e("div",{staticClass:"group"},[t._v("商业集团")]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"homebinded"},[e("div",{staticClass:"group"},[t._v("房管集团")]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"homebinded"},[e("div",{staticClass:"group"},[t._v("资本集团")]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])])])])}]};var g=e("VU/8")({name:"Jituan",methods:{btnnext:function(){this.$router.go(-1)}}},p,!1,function(t){e("PKAp")},"data-v-973920ba",null).exports;a.a.use(c.a);var C=new c.a({routes:[{path:"/",name:"Common",component:_},{path:"/danwei",name:"Danwei",component:u},{path:"/jituan",name:"Jituan",component:g}]}),f=e("Muz9"),m=e.n(f);e("9n10"),e("M6Sr"),e("TzC8"),e("qqHy");a.a.prototype.$axios=m.a,a.a.config.productionTip=!1,new a.a({el:"#app",router:C,components:{App:n},template:"<App/>"})},PKAp:function(t,s){},TzC8:function(t,s){},Un8f:function(t,s){},"YU/U":function(t,s){},gdWg:function(t,s){},nbxm:function(module,__webpack_exports__,__webpack_require__){"use strict";(function($){var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__=__webpack_require__("mvHQ"),__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__),__WEBPACK_IMPORTED_MODULE_1__components_popup__=__webpack_require__("K7kg");__webpack_exports__.a={name:"Common",components:{popup:__WEBPACK_IMPORTED_MODULE_1__components_popup__.a},data:function(){return{memberList:null,list:null,keyword:null,radvalue:[],isPopupVisible:!1}},mounted:function(){this.initpage()},methods:{showPopup:function(){this.isPopupVisible=!0},closePopup:function(){this.isPopupVisible=!1},getNameInfo:function getNameInfo(){if(""==this.keyword)this.initpage();else{var getname=encodeURI(this.keyword),getname2=this.keyword;console.log(getname);var token=this.getToken("rest","123456"),url="http://10.1.19.170";this.memberList=new Array;var _this=this;$.ajax({url:url+"/seeyon/rest/orgMembers/name/"+getname+"?token="+token,type:"GET",dataType:"text",async:!1,processData:!1,success:function success(data){if("[ ]"!=data){var orgLogin=data.replace(/(\".*?\"\s*\:\s*)(\-{0,1}\d+)/g,'$1"$2"'),dateLogin=eval("("+orgLogin+")");_this.memberList=dateLogin,console.log(_this.memberList)}},error:function(t,s,e){console.log("获取名称失败！")}}),$.ajax({url:url+"/seeyon/rest/orgMember/code/"+getname2+"?token="+token,type:"GET",dataType:"text",async:!1,processData:!1,success:function success(data){if("[ ]"!=data){var orgLogin=data.replace(/(\".*?\"\s*\:\s*)(\-{0,1}\d+)/g,'$1"$2"'),dateLogin=eval("("+orgLogin+")");_this.memberList=dateLogin}},error:function(t,s,e){console.log("获取工号失败！")}})}},handlebtnclick:function(){var t;t=this.radvalue;var s=localStorage.getItem("Cache");if("applyName"==s){if(t.length>1)return void this.showPopup();localStorage.setItem("applyName",__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(t))}else if("texture"==s){if(t.length>1)return void this.showPopup();localStorage.setItem("texture",__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(t))}else if("direct"==s){if(t.length>1)return void this.showPopup();localStorage.setItem("direct",__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(t))}else if("jilu"==s){if(t.length>1)return void this.showPopup();localStorage.setItem("jilu",__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(t))}else if("shenKe"==s){if(t.length>1)return void this.showPopup();localStorage.setItem("shenKe",__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(t))}else if("renyuan"==s)localStorage.setItem("renyuan",__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(t));else if(null==s)return void this.showPopup();window.location.href="/seeyon/m3/apps/v5/meetings/html/meeting_apply.html"},initpage:function(){var t=this.getToken("rest","123456");this.memberList=this.getUserListByDepartmentId("-2936870727963884205",t),console.log(this.memberList)},getToken:function(t,s){var e=null;return $.ajax({url:"http://10.1.19.170/seeyon/rest/token/"+t+"/"+s,type:"get",dataType:"json",async:!1,processData:!1,headers:{Accept:"application/json","Content-Type":"application/json"},success:function(t){e=t.id,console.log("getToken:",t)},error:function(t,s,e){console.log("获取 TOKEN 失败！")}}),e},getUserByCode:function(t,s){var e={};return $.ajax({url:"http://10.1.19.170/seeyon/rest/orgMember/code/"+t+"?token="+s,type:"get",dataType:"json",async:!1,headers:{Accept:"application/json; charset=utf-8","Accept-Language":"zh-CN","Content-Type":"application/json; charset=utf-8"},processData:!1,success:function(t){e=t},error:function(t,s,e){console.log("获取 TOKEN 失败！")}}),e},getUserListByDepartmentId:function getUserListByDepartmentId(departmentId,tk){var url="http://10.1.19.170",memberList=new Array,header={Accept:"application/json; charset=utf-8","Accept-Language":"zh-CN","Content-Type":"application/json; charset=utf-8"};return $.ajax({url:url+"/seeyon/rest/orgMembers/department/"+departmentId+"?token="+tk,type:"get",dataType:"text",async:!1,headers:header,processData:!1,success:function success(data){var orgLogin=data.replace(/(\".*?\"\s*\:\s*)(\-{0,1}\d+)/g,'$1"$2"'),dateLogin=eval("("+orgLogin+")");memberList=dateLogin},error:function(t,s,e){console.log("获取 TOKEN 失败！")}}),memberList},getSubDepartmentByParent:function(t,s){var e=new Array;return $.ajax({url:"http://10.1.19.170/seeyon/rest/orgDepartments/children/"+t+"?token="+s,type:"get",dataType:"json",async:!1,headers:{Accept:"application/json; charset=utf-8","Accept-Language":"zh-CN","Content-Type":"application/json; charset=utf-8"},processData:!1,success:function(t){e=t},error:function(t,s,e){console.log("获取 TOKEN 失败！")}}),e},getParentDepartmentByChild:function(t,s){var e=new Array;return $.ajax({url:"http://10.1.19.170/seeyon/rest/orgDepartments/parent/"+t+"?token="+s,type:"get",dataType:"json",async:!1,headers:{Accept:"application/json; charset=utf-8","Accept-Language":"zh-CN","Content-Type":"application/json; charset=utf-8"},processData:!1,success:function(t){e=t},error:function(t,s,e){console.log("获取 TOKEN 失败！")}}),e}}}}).call(__webpack_exports__,__webpack_require__("qqHy"))},qELt:function(t,s,e){t.exports=e.p+"static/img/Avatar.c5e1558.jpg"},"sq4+":function(t,s,e){t.exports=e.p+"static/img/main-yyfx.6be1d54.png"}},["NHnr"]);
//# sourceMappingURL=app.cd168f6cb13aecf76828.js.map