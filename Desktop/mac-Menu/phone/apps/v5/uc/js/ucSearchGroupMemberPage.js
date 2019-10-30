/**
 * description: 搜索群成员页面
 * author: hbh
 * createDate: 2017-09-8
 */
(function() {
    var serverAdress = uc.getCurServerInfo().serverurl;
    var searchValue = "";
    var groupId = "";
    var pageSize = 20;
    var pageNo = 1;
    var total = "";
    var length = "";
    //入口函数
    function initPage() {
        cmp.ready(function() {
            var btn_a = document.getElementById("btn_a");
            btn_a && btn_a.setAttribute('placeholder',cmp.i18n('uc.m3.h5.search'));
            searchValue = cmp.href.getParam().data[0];
            groupId = cmp.href.getParam().data[1];
            initStyle();
            initEvent();
        });
    }
    initPage();

    //样式初始化
    function initStyle() {
        var height = $("body").height()-$("header").height() - 20;
        $("#cmp-control").height(height)
        $("#uc-search-member").height(height);
        $(".cmp-search").addClass("cmp-active");
        $("input").val(searchValue);
        $(".cmp-icon-clear").removeClass("cmp-hidden");
        $("input").trigger("blur");
    }


    //事件初始化
    function initEvent() {
        //获取第一页数据
        renderData(searchValue,pageSize,pageNo);

        //点击取消按钮返回上一页
        backBtn();

        //滚动事件监听
        document.getElementsByClassName("uc-search-member")[0].addEventListener('scroll', onScroll, false);

        //输入框输入文字进行搜索
        search();

        // 跳转到人员名片
        jumpToMemberDetail();
    }

    function renderData(searchValue,pageSize,pageNo) {
        cmp.ajax({
            type: "POST",
            data:JSON.stringify({
                groupId: groupId,
                key: searchValue
            }),
            url: serverAdress + "/seeyon/rest/uc/rong/groups/searchGroupMember?pageSize=" + pageSize + "&pageNo=" + pageNo,
            success: function (res) {
                console.log(res);
                if (res.total == 0) {
                    cmp.dialog.loading({
                        status: "nocontent",
                        text: cmp.i18n("uc.m3.h5.noSearchResults")
                    });
                } else {
                    cmp.dialog.loading(false);
                    total = res.total;
                    length = Number(length) + Number(res.groups.length);
                    var liTPL = $("#memberHeadLi").html();
                    var html = cmp.tpl(liTPL, res.groups);
                    if(pageNo == 1){
                        $("#uc-search-member").html(html);
                    }else {//滚动到底，分页请求数据，追加渲染
                        $("#uc-search-member").append(html);
                    }
                }
            },
            error: function (err) {
                console.log(err)
            }
        });
    }

    function backBtn() {
        $(".cancel").on("tap",function(){
            cmp.href.back();
        });
        cmp.backbutton();
        cmp.backbutton.push(function() {
            cmp.href.back();
        });
    }

    function search(){
      //监听回车
      $(document).keydown(function(e) {
          // 回车键事件
          e.stopPropagation();
          searchValue = $("#btn_a")[0].value.trim();
          if (searchValue) {
              if (e.which == 13) {
                  pageNo = 1;
                  length = "";
                  renderData(searchValue,pageSize,pageNo)
              }
          }
      });
    }

    function onScroll(){
      var ele = document.getElementById("uc-search-member");
      var scrollTop = ele.scrollTop;
      var clientHeight = ele.clientHeight;
      var scrollHeight = ele.scrollHeight;
      if(scrollHeight == scrollTop + clientHeight) {//滚动到底部
          pageNo += 1;
          if(!(length == total)){
              renderData(searchValue,pageSize,pageNo)
          }
      }
    }

    function jumpToMemberDetail(){
        $("#uc-search-member").on("tap","li",function(){
            var memberId = this.getAttribute("data-id");
            var enableChat = false;
            var param = {
                page: 'ucSearchGroupMemberPage',
                id: memberId,
                from: 'uc',
                enableChat: enableChat
            };
            cmp.visitingCard(memberId);
        })
    }

})();
