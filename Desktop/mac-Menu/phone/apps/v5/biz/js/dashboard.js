var params = {};
cmp.ready(function() {
    params=cmp.href.getParam();
    cmp.listView('#scroll');
   //   cmp.scrollBox("#tablescroll");
    cmp.backbutton();
    bindEvent();
    setTimeout(function(){
        if(window.sessionStorage.getItem("dashboard_scroll")){
            document.querySelector(".cmp-scroll").style.webkitTransform ="translate(0px, "+window.sessionStorage.getItem("dashboard_scroll")+")";
        }
    },200);
});

function bindEvent(){
    cmp.backbutton.push(function(){
        window.sessionStorage.removeItem("dashboard_scroll");
        cmp.href.back();
        return;
    });
    document.addEventListener("beforepageredirect",function(e){
        window.sessionStorage.setItem("dashboard_scroll",getScrollHeight());
    });
}
function getScrollHeight(){
    var matrix=getComputedStyle(document.querySelector(".cmp-scroll"), null)["transform"].replace(/[^0-9\-.,]/g, '').split(',');
    return matrix[5]+"px";
}

