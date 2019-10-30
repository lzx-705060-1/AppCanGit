

document.querySelector("#back_btn").addEventListener("tap",function(){
    cmp.href.back();
},false);

cmp.ready(function(){
    document.title=cmp.i18n("cmp.visitingCard.title_pInformation");
    cmp.RefreshHeader();
    cmp.backbutton();
    cmp.backbutton.push(cmp.href.back);
    var id = cmp.href.getParam("id");
    document.querySelector("#coordination").addEventListener("tap",function(){
        cmp.href.next(collaborationPath+ "/html/newCollaboration.html?r="+Math.random(),{members : id});
    },false);
    cmp.ajax({  //等待王飞飞提供数据接口
        url:cmp.origin + "/rest/cmporgnization4M3/peopleCard/" + id + "?option.n_a_s=1",
        headers:{
            'token' : cmp.token
        },
        success:function(result){
            if(result.ext == "1"){//如果是vj人员卡片，则显示内容要调整
                document.querySelector(".department").innerText = cmp.i18n("cmp.visitingCard.vj_department");
                var vjDepartmentLi = document.querySelector("li.cmp-hidden");
                vjDepartmentLi.classList.remove("cmp-hidden");
                vjDepartmentLi.querySelector(".vj_account").innerText = cmp.i18n("cmp.visitingCard.vj_account");
                document.querySelector("#department").innerText = result.vjUnitName;
                document.querySelector("#vj_account").innerText = result.vjAccountName;
                var noclearLi = document.querySelectorAll("li.noclear");
                for(var i = 0;i<noclearLi.length ;i++){
                    noclearLi[i].classList.add("cmp-hidden");
                }
            }else {
                document.querySelector("#department").innerText = result.detpName;
                document.querySelector("#level").innerText = result.levelName;
                document.querySelector("#phone").innerText = result.officeNum;
            }
            document.querySelector("#header").src = result.img;
            document.querySelector("#name").innerText = result.name;
            document.querySelector("#post").innerText = result.postName;
            document.querySelector("#cellphone").innerText = result.telNumber;
            document.querySelector("#mail").innerText = result.email;
        },
        error:function(error){
            console.log(error);
            cmp.notification.alert(error.message,function(){
                cmp.href.back();

            },_.i18n("cmp.visitingCard.requestError"),_.i18n("cmp.visitingCard.btn_back"));
        }
    });

    cmp.ajax({
        url:cmp.origin + "/rest/cmporgnization4M3/currentUser?option.n_a_s=1",
        headers:{
            'token' : cmp.token
        },
        success:function(result){
            var watermarkUrl = cmp.watermark({
                userName: cmp.member.name,
                department: result.loginAccountName || "",
                date: getDate()
            }).toBase64URL();

            var urlDom = document.querySelectorAll("ul");
			if(urlDom && urlDom.length>1){
				for(var i=0;i<urlDom.length;i++){
					urlDom[i].style.backgroundImage = "url(" + watermarkUrl + ")";
					urlDom[i].style.backgroundRepeat = "repeat";
					urlDom[i].style.backgroundPosition = "0% 0%";
					urlDom[i].style.backgroundSize = "200px 100px";
				}
			}
			var liDom = document.querySelectorAll("li.cmp-table-view-cell");
			if(liDom && liDom.length>1){
				for(var j=0;j<liDom.length;j++){
					liDom[j].style.backgroundColor = "transparent";
				}
            }
        },
        error:function(){
            console.log(error);
            cmp.notification.alert(error.message,function(){
                cmp.href.back();

            },_.i18n("cmp.visitingCard.requestError"),_.i18n("cmp.visitingCard.btn_back"));
        }
    })
    //通讯录水印 时间
    function getDate() {
        var date = new Date;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        var day = date.getDate();
        if (day < 10) {
            day = '0' + day;
        }
        var dateStr = year + "-" + month + "-" + day;
        return dateStr
    }
    
});
