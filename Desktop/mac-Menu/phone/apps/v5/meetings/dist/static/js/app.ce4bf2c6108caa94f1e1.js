webpackJsonp([1],{"9n10":function(t,s){},M6Sr:function(t,s){},NHnr:function(t,s,a){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var e=a("7+uW"),i={render:function(){var t=this.$createElement,s=this._self._c||t;return s("div",{attrs:{id:"app"}},[s("keep-alive",[s("router-view")],1)],1)},staticRenderFns:[]};var n=a("VU/8")({name:"App"},i,!1,function(t){a("Un8f")},null,null).exports,c=a("/ocq"),r=a("nbxm"),o={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"content"},[e("div",{staticClass:"bigsearch"},[e("div",{staticClass:"search"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.keyword,expression:"keyword"}],staticClass:"search-input",attrs:{type:"text",placeholder:"搜索"},domProps:{value:t.keyword},on:{input:function(s){s.target.composing||(t.keyword=s.target.value)}}}),t._v(" "),e("button",{on:{click:function(s){return t.getNameInfo()}}},[t._v("确定")])])]),t._v(" "),e("div",{staticClass:"scroller"},[e("ul",{attrs:{id:"select_listContent"}},t._l(t.memberList,function(s){return e("li",{key:s.id,staticClass:"Recent"},[e("div",{staticClass:"avatar"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.radvalue,expression:"radvalue"}],staticClass:"radio_type",attrs:{type:"checkbox"},domProps:{value:s,checked:Array.isArray(t.radvalue)?t._i(t.radvalue,s)>-1:t.radvalue},on:{change:function(a){var e=t.radvalue,i=a.target,n=!!i.checked;if(Array.isArray(e)){var c=s,r=t._i(e,c);i.checked?r<0&&(t.radvalue=e.concat([c])):r>-1&&(t.radvalue=e.slice(0,r).concat(e.slice(r+1)))}else t.radvalue=n}}}),t._v(" "),e("img",{attrs:{src:a("qELt"),alt:""}})]),t._v(" "),e("div",{staticClass:"information"},[e("span",[t._v(t._s(s.name))]),t._v(" "),e("h6",[t._v(t._s(s.code))])])])}),0)]),t._v(" "),e("footer",[e("button",{attrs:{type:"submit"},on:{click:function(s){return t.handlebtnclick()}}},[t._v("确认")])])])},staticRenderFns:[]};var l=function(t){a("uCdP")},_=a("VU/8")(r.a,o,!1,l,"data-v-70977a34",null).exports,v={name:"Danwei",methods:{bgbutton:function(){console.log(321)}}},d={render:function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"content"},[a("header",[a("div",{attrs:{id:"select_contentTitleSearch"}},[a("div",{staticClass:"Choose"},[a("span",{staticClass:"select_title"},[t._v("单选人员")]),t._v(" "),a("router-link",{staticClass:"Down",attrs:{to:"/jituan"}},[a("i",{staticClass:"iconfont icon-arrow_right"})])],1),t._v(" "),t._m(0)])]),t._v(" "),a("div",{staticClass:"select_crumbs_list"},[a("div",{staticClass:"select"},[a("router-link",{attrs:{to:"/"}},[a("a",[t._v("雅居乐集团控股公司")])]),t._v(" "),t._m(1)],1)]),t._v(" "),t._m(2),t._v(" "),a("footer",[a("button",{on:{click:t.bgbutton}},[t._v("确定")])])])},staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"Find"},[s("i",{staticClass:"iconfont icon-fangdajing"})])},function(){var t=this.$createElement,s=this._self._c||t;return s("span",[s("i",{staticClass:"iconfont icon-arrow-left"}),this._v("本单位")])},function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"scroller"},[e("ul",{attrs:{id:"select_listContent"}},[e("li",{staticClass:"binded"},[e("div",{staticClass:"avatar"},[e("img",{attrs:{src:a("sq4+"),alt:""}})]),t._v(" "),e("div",{staticClass:"Unit"},[e("span",[t._v("总裁办公室")]),t._v(" "),e("h6",[t._v("(10)")])]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"binded"},[e("div",{staticClass:"avatar"},[e("img",{attrs:{src:a("sq4+"),alt:""}})]),t._v(" "),e("div",{staticClass:"Unit"},[e("span",[t._v("总裁办公室")]),t._v(" "),e("h6",[t._v("(10)")])]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"binded"},[e("div",{staticClass:"avatar"},[e("img",{attrs:{src:a("sq4+"),alt:""}})]),t._v(" "),e("div",{staticClass:"Unit"},[e("span",[t._v("总裁办公室")]),t._v(" "),e("h6",[t._v("(10)")])]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"binded"},[e("div",{staticClass:"avatar"},[e("img",{attrs:{src:a("sq4+"),alt:""}})]),t._v(" "),e("div",{staticClass:"Unit"},[e("span",[t._v("总裁办公室")]),t._v(" "),e("h6",[t._v("(10)")])]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"binded"},[e("div",{staticClass:"avatar"},[e("img",{attrs:{src:a("sq4+"),alt:""}})]),t._v(" "),e("div",{staticClass:"Unit"},[e("span",[t._v("总裁办公室")]),t._v(" "),e("h6",[t._v("(10)")])]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"binded"},[e("div",{staticClass:"avatar"},[e("img",{attrs:{src:a("sq4+"),alt:""}})]),t._v(" "),e("div",{staticClass:"Unit"},[e("span",[t._v("总裁办公室")]),t._v(" "),e("h6",[t._v("(10)")])]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"binded"},[e("div",{staticClass:"avatar"},[e("img",{attrs:{src:a("sq4+"),alt:""}})]),t._v(" "),e("div",{staticClass:"Unit"},[e("span",[t._v("总裁办公室")]),t._v(" "),e("h6",[t._v("(10)")])]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"binded"},[e("div",{staticClass:"avatar"},[e("img",{attrs:{src:a("sq4+"),alt:""}})]),t._v(" "),e("div",{staticClass:"Unit"},[e("span",[t._v("总裁办公室")]),t._v(" "),e("h6",[t._v("(10)")])]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"binded"},[e("div",{staticClass:"avatar"},[e("img",{attrs:{src:a("sq4+"),alt:""}})]),t._v(" "),e("div",{staticClass:"Unit"},[e("span",[t._v("总裁办公室")]),t._v(" "),e("h6",[t._v("(10)")])]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"binded"},[e("div",{staticClass:"avatar"},[e("img",{attrs:{src:a("sq4+"),alt:""}})]),t._v(" "),e("div",{staticClass:"Unit"},[e("span",[t._v("总裁办公室")]),t._v(" "),e("h6",[t._v("(10)")])]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"binded"},[e("div",{staticClass:"avatar"},[e("img",{attrs:{src:a("sq4+"),alt:""}})]),t._v(" "),e("div",{staticClass:"Unit"},[e("span",[t._v("总裁办公室")]),t._v(" "),e("h6",[t._v("(10)")])]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"binded"},[e("div",{staticClass:"avatar"},[e("img",{attrs:{src:a("sq4+"),alt:""}})]),t._v(" "),e("div",{staticClass:"Unit"},[e("span",[t._v("总裁办公室")]),t._v(" "),e("h6",[t._v("(10)")])]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),e("li",{staticClass:"binded"},[e("div",{staticClass:"avatar"},[e("img",{attrs:{src:a("sq4+"),alt:""}})]),t._v(" "),e("div",{staticClass:"Unit"},[e("span",[t._v("总裁办公室")]),t._v(" "),e("h6",[t._v("(10)")])]),t._v(" "),e("div",{staticClass:"selectOrg"},[e("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])])])])}]};var u=a("VU/8")(v,d,!1,function(t){a("YU/U")},"data-v-58cfe634",null).exports,p={render:function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"content"},[this._m(0),this._v(" "),this._m(1),this._v(" "),s("footer",[s("button",{on:{click:this.btnnext}},[this._v("取消")])])])},staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"select_crumbs_list"},[s("div",{staticClass:"select"},[this._v("\n            雅居乐集团\n        ")])])},function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"scroller"},[a("ul",{staticClass:"select_listContent"},[a("li",{staticClass:"homebinded"},[a("div",{staticClass:"group"},[t._v("集团")])]),t._v(" "),a("li",{staticClass:"homebinded"},[a("div",{staticClass:"group"},[t._v("雅居乐集团控股公司")]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"homebinded"},[a("div",{staticClass:"group"},[t._v("地产集团")]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"homebinded"},[a("div",{staticClass:"group"},[t._v("建设集团")]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"homebinded"},[a("div",{staticClass:"group"},[t._v("环保集团")]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"homebinded"},[a("div",{staticClass:"group"},[t._v("教育集团")]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"homebinded"},[a("div",{staticClass:"group"},[t._v("商业集团")]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"homebinded"},[a("div",{staticClass:"group"},[t._v("房管集团")]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])]),t._v(" "),a("li",{staticClass:"homebinded"},[a("div",{staticClass:"group"},[t._v("资本集团")]),t._v(" "),a("div",{staticClass:"selectOrg"},[a("i",{staticClass:"iconfont icon-xiaji"}),t._v("下级")])])])])}]};var g=a("VU/8")({name:"Jituan",methods:{btnnext:function(){this.$router.go(-1)}}},p,!1,function(t){a("PKAp")},"data-v-973920ba",null).exports;e.a.use(c.a);var C=new c.a({routes:[{path:"/",name:"Common",component:_},{path:"/danwei",name:"Danwei",component:u},{path:"/jituan",name:"Jituan",component:g}]}),m=a("Muz9"),f=a.n(m);a("9n10"),a("M6Sr"),a("TzC8"),a("qqHy");e.a.prototype.$axios=f.a,e.a.config.productionTip=!1,new e.a({el:"#app",router:C,components:{App:n},template:"<App/>"})},PKAp:function(t,s){},TzC8:function(t,s){},Un8f:function(t,s){},"YU/U":function(t,s){},nbxm:function(module,__webpack_exports__,__webpack_require__){"use strict";(function($){var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__=__webpack_require__("mvHQ"),__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);__webpack_exports__.a={name:"Common",data:function(){return{memberList:null,list:null,keyword:null,radvalue:[]}},mounted:function(){this.initpage()},methods:{getNameInfo:function getNameInfo(){if(""==this.keyword)this.initpage();else{var getname=encodeURI(this.keyword),getname2=this.keyword;console.log(getname);var token=this.getToken("rest","123456"),url="http://10.1.19.170";this.memberList=new Array;var _this=this;$.ajax({url:url+"/seeyon/rest/orgMembers/name/"+getname+"?token="+token,type:"GET",dataType:"text",async:!1,processData:!1,success:function success(data){if("[ ]"!=data){var orgLogin=data.replace(/(\".*?\"\s*\:\s*)(\-{0,1}\d+)/g,'$1"$2"'),dateLogin=eval("("+orgLogin+")");_this.memberList=dateLogin,console.log(_this.memberList)}},error:function(t,s,a){console.log("获取名称失败！")}}),$.ajax({url:url+"/seeyon/rest/orgMember/code/"+getname2+"?token="+token,type:"GET",dataType:"text",async:!1,processData:!1,success:function success(data){if("[ ]"!=data){var orgLogin=data.replace(/(\".*?\"\s*\:\s*)(\-{0,1}\d+)/g,'$1"$2"'),dateLogin=eval("("+orgLogin+")");_this.memberList=dateLogin}},error:function(t,s,a){console.log("获取工号失败！")}})}},handlebtnclick:function(){var t;t=this.radvalue;var s=localStorage.getItem("Cache");if("applyName"==s){if(t.length>1)return void alert("申请人只能选择一个");localStorage.setItem("applyName",__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(t))}else if("texture"==s){if(t.length>1)return void alert("会议组织者只能选择一个");localStorage.setItem("texture",__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(t))}else if("direct"==s){if(t.length>1)return void alert("会议主持者只能选择一个");localStorage.setItem("direct",__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(t))}else if("jilu"==s){if(t.length>1)return void alert("会议记录者只能选择一个");localStorage.setItem("jilu",__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(t))}else if("shenKe"==s){if(t.length>1)return void alert("控股领导会议审核人只能选择一个");localStorage.setItem("shenKe",__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(t))}else"renyuan"==s&&localStorage.setItem("renyuan",__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(t));this.$router.go(-1)},initpage:function(){var t=this.getToken("rest","123456");this.memberList=this.getUserListByDepartmentId("-2936870727963884205",t),console.log(this.memberList)},getToken:function(t,s){var a=null;return $.ajax({url:"http://10.1.19.170/seeyon/rest/token/"+t+"/"+s,type:"get",dataType:"json",async:!1,processData:!1,headers:{Accept:"application/json","Content-Type":"application/json"},success:function(t){a=t.id,console.log("getToken:",t)},error:function(t,s,a){console.log("获取 TOKEN 失败！")}}),a},getUserByCode:function(t,s){var a={};return $.ajax({url:"http://10.1.19.170/seeyon/rest/orgMember/code/"+t+"?token="+s,type:"get",dataType:"json",async:!1,headers:{Accept:"application/json; charset=utf-8","Accept-Language":"zh-CN","Content-Type":"application/json; charset=utf-8"},processData:!1,success:function(t){a=t},error:function(t,s,a){console.log("获取 TOKEN 失败！")}}),a},getUserListByDepartmentId:function getUserListByDepartmentId(departmentId,tk){var url="http://10.1.19.170",memberList=new Array,header={Accept:"application/json; charset=utf-8","Accept-Language":"zh-CN","Content-Type":"application/json; charset=utf-8"};return $.ajax({url:url+"/seeyon/rest/orgMembers/department/"+departmentId+"?token="+tk,type:"get",dataType:"text",async:!1,headers:header,processData:!1,success:function success(data){var orgLogin=data.replace(/(\".*?\"\s*\:\s*)(\-{0,1}\d+)/g,'$1"$2"'),dateLogin=eval("("+orgLogin+")");memberList=dateLogin},error:function(t,s,a){console.log("获取 TOKEN 失败！")}}),memberList},getSubDepartmentByParent:function(t,s){var a=new Array;return $.ajax({url:"http://10.1.19.170/seeyon/rest/orgDepartments/children/"+t+"?token="+s,type:"get",dataType:"json",async:!1,headers:{Accept:"application/json; charset=utf-8","Accept-Language":"zh-CN","Content-Type":"application/json; charset=utf-8"},processData:!1,success:function(t){a=t},error:function(t,s,a){console.log("获取 TOKEN 失败！")}}),a},getParentDepartmentByChild:function(t,s){var a=new Array;return $.ajax({url:"http://10.1.19.170/seeyon/rest/orgDepartments/parent/"+t+"?token="+s,type:"get",dataType:"json",async:!1,headers:{Accept:"application/json; charset=utf-8","Accept-Language":"zh-CN","Content-Type":"application/json; charset=utf-8"},processData:!1,success:function(t){a=t},error:function(t,s,a){console.log("获取 TOKEN 失败！")}}),a}}}}).call(__webpack_exports__,__webpack_require__("qqHy"))},qELt:function(t,s,a){t.exports=a.p+"static/img/Avatar.c5e1558.jpg"},"sq4+":function(t,s,a){t.exports=a.p+"static/img/main-yyfx.6be1d54.png"},uCdP:function(t,s){}},["NHnr"]);
//# sourceMappingURL=app.ce4bf2c6108caa94f1e1.js.map