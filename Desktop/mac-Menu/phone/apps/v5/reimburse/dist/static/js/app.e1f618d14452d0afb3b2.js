webpackJsonp([1],{"05/T":function(t,e){},"15u9":function(t,e){},"1nUZ":function(t,e){},"4ml/":function(t,e){},NHnr:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("7+uW"),i={name:"app",data:function(){return{myChart2:""}},mounted:function(){this.drawChart2()},methods:{drawChart2:function(){var t=this.$echarts.init(document.getElementById("myChart2"));window.onresize=t.resize;t.setOption({color:["#5b9bd5"],xAxis:{type:"category",data:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],splitLine:{show:!1}},yAxis:{show:"false",type:"value",axisLine:{show:!1},axisTick:{show:!1}},grid:{x:50,y:35},series:[{data:[820,932,901,934,1290,1330,1320],type:"line",normal:{show:!1}}]})}}},r={render:function(){this.$createElement;this._self._c;return this._m(0)},staticRenderFns:[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"header"},[a("div",{staticClass:"content_bar"},[a("div",{staticClass:"content_lis"},[a("ul",[a("li",[a("strong",[t._v("差旅费报销")])]),t._v(" "),a("li",[t._v("\n            您今年累计出差\n            "),a("em",[t._v("666")]),t._v(" 次\n          ")]),t._v(" "),a("li",[t._v("\n            足迹遍布\n            "),a("em",[t._v("广州，上海")])]),t._v(" "),a("li",[t._v("千山万水，挡不住前进的步伐！")])])])]),t._v(" "),a("div",{attrs:{id:"app"}},[a("div",{staticStyle:{width:"100%",height:"220px"},attrs:{id:"myChart2"}})]),t._v(" "),a("div",{staticClass:"content_item"},[a("h3",[t._v("\n        出行\n        "),a("em",[t._v("飞机")]),t._v("为主，\n        "),a("em",[t._v("空中飞人")]),t._v("就是你~！\n      ")])])])])}]};var s=a("VU/8")(i,r,!1,function(t){a("05/T")},"data-v-30c1919a",null).exports,o={name:"app",data:function(){return{myChart2:""}},mounted:function(){this.drawChart3()},methods:{drawChart3:function(){var t=this.$echarts.init(document.getElementById("myChart3"));window.onresize=t.resize;t.setOption({color:["#5b9bd5","#ed7d31","#a5a5a5"],grid:{x:0,y:20},tooltip:{trigger:"item",formatter:"{a} <br/>{b}: {c} ({d}%)"},legend:{orient:"vertical",top:"1n5%",x:"left",y:"10",itemWidth:20,data:["直接访问","邮件营销","联盟广告"]},series:[{name:"访问来源",type:"pie",radius:["40%","60%"],avoidLabelOverlap:!1,label:{normal:{show:!1,position:"center"},emphasis:{show:!0,textStyle:{fontSize:"30",fontWeight:"bold"}}},labelLine:{normal:{show:!1}},data:[{value:335,name:"直接访问"},{value:310,name:"邮件营销"},{value:234,name:"联盟广告"}]}]})}}},d={render:function(){this.$createElement;this._self._c;return this._m(0)},staticRenderFns:[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"header"},[a("div",{staticClass:"content"},[a("div",{attrs:{id:"app"}},[a("div",{staticStyle:{width:"100%",height:"300px"},attrs:{id:"myChart3"}})]),t._v(" "),a("div",{staticClass:"content_lis"},[a("ul",[a("li",[a("strong",[t._v("个人借款报销")])]),t._v(" "),a("li",[t._v("瞧瞧咱们今年还有哪些开销")]),t._v(" "),a("li",[t._v("\n            今年您一共发起XX笔借款单，借款金额总计\n            "),a("em",[t._v("xxx")]),t._v("元\n          ")]),t._v(" "),a("li",[t._v("\n            其中已冲销还款\n            "),a("em",[t._v("22")]),t._v("元\n          ")]),t._v(" "),a("li",[t._v("\n            还有借款余额\n            "),a("em",[t._v("888")]),t._v("元哦！\n          ")])])])])])])}]};var l=a("VU/8")(o,d,!1,function(t){a("NaKj")},"data-v-57b84511",null).exports,c={name:"app",data:function(){return{myChart2:""}},mounted:function(){this.drawChart5()},methods:{drawChart5:function(){var t=this.$echarts.init(document.getElementById("myChart5"));window.onresize=t.resize;t.setOption({color:["#5b9bd5","#ed7d31","#a5a5a5","#ffc000"],tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},legend:{data:["2011年","2012年","2013年"],bottom:"bottom"},grid:{y:35,left:"3%",right:"4%",bottom:"3%",containLabel:!0},xAxis:[{type:"category",data:["Mon","Tue","Wed","Thu"],axisTick:{alignWithLabel:!0}}],yAxis:[{type:"value",axisLine:{show:!1},axisTick:{show:!1}}],series:[{name:"直接访问",type:"bar",barWidth:"90%",data:[10,52,200,334],barCategoryGap:"100%"}]})}}},v={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"header"},[a("van-panel",[a("div",{staticClass:"content_lis"},[a("ul",[a("li",[a("strong",[t._v("说了这么多，发单达人有没有被退单过呢？")])]),t._v(" "),a("li",[a("strong",[t._v("让我们来看看！")])]),t._v(" "),a("li",[t._v("\n            【关键退回】\n            "),a("em",[t._v("6")]),t._v(" 次\n          ")]),t._v(" "),a("li",[t._v("\n            【非关键退回】\n            "),a("em",[t._v("6")]),t._v(" 次\n          ")])])])]),t._v(" "),t._m(0),t._v(" "),t._m(1)],1)])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("div",{staticStyle:{width:"100%",height:"300px"},attrs:{id:"myChart5"}})])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"footer_box"},[a("ul",{staticClass:"f_item"},[a("li",[t._v("棒棒哒！你的准确率已超过90%的小伙伴！")]),t._v(" "),a("li",[t._v("争取实现百分百发单准确，一发即过！")])]),t._v(" "),a("div",{staticClass:"f_content"},[a("ul",[a("li",[t._v("2019年的个人重要事件别忘了")]),t._v(" "),a("li",[t._v("\n            咱们还有\n            "),a("em",[t._v("福利费-结婚礼金")]),t._v("报销\n          ")]),t._v(" "),a("li",[t._v("祝福您 新婚快乐，生活甜甜蜜蜜哦！")])]),t._v(" "),a("ul",[a("li",[t._v("2019年的个人重要事件别忘了")]),t._v(" "),a("li",[t._v("\n            咱们还有\n            "),a("em",[t._v("福利费-结婚礼金")]),t._v("报销\n          ")]),t._v(" "),a("li",[t._v("祝福您 新婚快乐，生活甜甜蜜蜜哦！")])])])])}]};var h=a("VU/8")(c,v,!1,function(t){a("jJk7")},"data-v-562abc90",null).exports,_={name:"app",components:{Chart2:s,Chart3:l,Chart5:h},data:function(){return{myChart:""}},mounted:function(){this.drawChart()},methods:{drawChart:function(){var t=this.$echarts.init(document.getElementById("myChart"));window.onresize=t.resize;t.setOption({color:["#a5a5a5","#ffc000","#5981ca","#70ad47","#5b9bd5","#ed7d31"],title:{x:"center"},tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},legend:{bottom:"5%",data:["直接访问","邮件营销","联盟广告","视频广告","搜索引擎"]},series:[{name:"访问来源",type:"pie",radius:"55%",center:["46%","40%"],data:[{value:335,name:"直接访问"},{value:310,name:"邮件营销"},{value:234,name:"联盟广告"},{value:135,name:"视频广告"},{value:1548,name:"搜索引擎"}],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]})}}},u={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"box"},[a("div",{staticClass:"header"},[a("van-panel",[a("div",{staticClass:"content_bar"},[a("h3",{staticClass:"tit"},[t._v("共享费用用年度报销账单")]),t._v(" "),a("div",{staticClass:"content_lis"},[a("ul",[a("li",[a("strong",[t._v("全年费用报销总量")])]),t._v(" "),a("li",[t._v("\n              您一共发起\n              "),a("em",[t._v("666")]),t._v(" 笔报销单\n            ")]),t._v(" "),a("li",[t._v("\n              报销总金额：\n              "),a("em",[t._v("22222")])]),t._v(" "),a("li",[a("strong",[t._v("\n                其中最快报销到账仅花了\n                "),a("em",[t._v("6688")]),t._v("天时间！\n              ")])])])])])]),t._v(" "),t._m(0),t._v(" "),t._m(1)],1)])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("div",{staticStyle:{width:"100%",height:"260px"},attrs:{id:"myChart"}})])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"content_item"},[e("h3",[this._v("厉害了！一看您就是发单能手,发单达人非你莫属！")])])}]};var m={name:"app",data:function(){return{myChart2:""}},mounted:function(){this.drawChart4()},methods:{drawChart4:function(){var t=this.$echarts.init(document.getElementById("myChart4"));window.onresize=t.resize;t.setOption({color:["#a5a5a5","#ed7d31","#5b9bd5"],tooltip:{trigger:"axis",axisPointer:{}},legend:{data:["2011年","2012年","2013年"],bottom:"bottom"},grid:{y:"30%",left:"3%",right:"4%",bottom:"12%",containLabel:!0},xAxis:{},yAxis:{type:"category"},series:[{name:"2011年",type:"bar",data:[18203]},{name:"2012年",type:"bar",data:[19325]},{name:"2013年",type:"bar",data:[19325],barGap:"30%",barCategoryGap:"30%"}]})}}},p={render:function(){this.$createElement;this._self._c;return this._m(0)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("div",{staticClass:"header"},[e("div",{staticClass:"content"},[e("div",{attrs:{id:"app"}},[e("div",{staticStyle:{width:"100%",height:"300px"},attrs:{id:"myChart4"}})])])])])}]};var f={data:function(){return{}},components:{Chart:a("VU/8")(_,u,!1,function(t){a("oVBb")},"data-v-72b37b4a",null).exports,Chart2:s,Chart3:l,Chart4:a("VU/8")(m,p,!1,function(t){a("15u9")},"data-v-42b538a7",null).exports,Chart5:h}},C={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("Chart"),this._v(" "),e("Chart2"),this._v(" "),e("Chart3"),this._v(" "),e("Chart4"),this._v(" "),e("Chart5")],1)},staticRenderFns:[]};var y={name:"App",components:{ChartList:a("VU/8")(f,C,!1,function(t){a("1nUZ")},"data-v-7cfb3fcc",null).exports}},b={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("ChartList")],1)},staticRenderFns:[]};var g=a("VU/8")(y,b,!1,function(t){a("yg8a")},null,null).exports,w=a("Fd2+"),x=(a("4ml/"),a("lkFZ"),a("XLwt")),E=a.n(x);n.a.config.productionTip=!1,n.a.prototype.$echarts=E.a,n.a.use(w.d),n.a.use(w.c),n.a.use(w.a).use(w.b),new n.a({el:"#app",components:{App:g},template:"<App/>"})},NaKj:function(t,e){},jJk7:function(t,e){},lkFZ:function(t,e){!function(t,e){var a=e.documentElement,n=t.devicePixelRatio||1;function i(){var t=a.clientWidth/10;a.style.fontSize=t+"px"}if(function t(){e.body?e.body.style.fontSize=12*n+"px":e.addEventListener("DOMContentLoaded",t)}(),i(),t.addEventListener("resize",i),t.addEventListener("pageshow",function(t){t.persisted&&i()}),n>=2){var r=e.createElement("body"),s=e.createElement("div");s.style.border=".5px solid transparent",r.appendChild(s),a.appendChild(r),1===s.offsetHeight&&a.classList.add("hairlines"),a.removeChild(r)}}(window,document)},oVBb:function(t,e){},yg8a:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.e1f618d14452d0afb3b2.js.map