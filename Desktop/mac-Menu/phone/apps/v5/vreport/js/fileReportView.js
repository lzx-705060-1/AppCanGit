(function(){
	//全局变量
	fileReportView = {};
	
	cmp.ready(function(){
		//返回
		initBackfun();
		//页面高度计算
		pageLayout();
		//页面参数
		initParam();
		//数据加载
		initData();
		//事件绑定
		events();
	});
	var initBackfun = function(){
//		cmp("body").on("tap","#goBackBtn",function(){
//			cmp.href.back();
//		});
		cmp.backbutton();
        cmp.backbutton.push(cmp.href.back);
	}
	var pageLayout = function(){
	    var cmp_content=document.querySelector('.cmp-content');
	    var header=document.querySelector('header');
	    var footer=document.querySelector('footer');
	    var windowH= window.innerHeight;
	    var headerH,footerH;
	    headerH = 0;
	    footerH = !footer ? 0 : footer.offsetHeight;
	    if(cmp_content){
	        cmp_content.style.height = windowH - headerH - footerH + "px";
	    }
	}
	var initParam = function(){
		fileReportView.pageParams = cmp.href.getParam() || {};
	}
	var initData = function(){
		cmp.dialog.loading();
		$s.Vreport.fileReport(fileReportView.pageParams.reportId,{},{
			success : function(result){
				if(result && result.data){
					fileReportView.attchment = result.data.attachment;
					render(result.data);
				}else{
					cmp.notification.alert(cmp.i18n("vreport.page.message.reportNotExist"));
				}
			},
			error : function(error){
				var cmpHandled = cmp.errorHandler(error);
				if(!cmpHandled){
					console.log(error);
					if(error.message){
						cmp.notification.alert(error.message);
					}else{
						cmp.notification.alert(cmp.toJSON(error));
					}
				}
			}
		});
	}
	var events = function(){
		//查看按钮
		cmp("body").on("tap",".file-view-btn",function(){
			var path = cmp.origin + "/rest/attachment/file/" + fileReportView.attchment.fileUrl + "?fileName=" + encodeURI(fileReportView.attchment.filename);
			var fileName = fileReportView.attchment.filename;
	        var option={
	            path : path,
	            filename : fileName,
	            extData:{
	                fileId: fileReportView.attchment.fileUrl,
	                lastModified: fileReportView.attchment.createdate,
	                isClearTrace: true
	            },
	            success: function(res){
	                cmp.dialog.loading(false);
	            },
	            error:function(err){
	                cmp.dialog.loading(false);
					cmp.notification.alert(cmp.toJSON(err));
	            }
	        }
            cmp.att.read(option);
		});
		//图片点击事件
		cmp(".file-container").on("tap","img",function(){
			var imgs = this;
			var imgArray = [{
				small:imgs.getAttribute("auto-url"),
	        	big:imgs.getAttribute("src-url")
			}];
		    //调用大图查看
			cmp.sliders.addNew(imgArray);
	        cmp.sliders.detect(0);
		});
	}
	/**
	 * 渲染数据
	 * @param {Object} data
	 */
	var render = function(data){
		var attachment = data.attachment;
		//标题
		document.title = data.reportSubject;
		//创建人
		document.querySelector(".file-info .file-creater").innerHTML = data.creator;
		//大小
		document.querySelector(".file-info .file-size").innerHTML = countAttSize(attachment.size);
		//图片的情况
		var fileType = attachment.filename.substring(attachment.filename.lastIndexOf(".") + 1)
		if(/jpg|jpeg|bmp|png|gif/gi.test(fileType)){
			var dom_container = document.querySelector(".file-container");
			
			var autoUrl = cmp.origin + "/commonimage.do?method=showImage&id=" + attachment.fileUrl + "&size=auto&from=mobile";
			var sourceUrl = cmp.origin + "/commonimage.do?method=showImage&id=" + attachment.fileUrl + "&size=source";
			var img = '<img src="' + autoUrl + '" auto-url="'+autoUrl+'" src-url="' + sourceUrl + '"/>';
			
			dom_container.innerHTML = img;
			dom_container.classList.add("active");
			cmp.dialog.loading(false);
			return;
		}
		//图标
		var dom_icon = document.querySelector(".file-container .file-icon");
		dom_icon.classList.add("cmp-icon-document");
		dom_icon.classList.add(getIconClass(attachment.filename));
		//名称
		var dom_name = document.querySelector(".file-container .file-name");
		dom_name.innerHTML = attachment.filename;
		//显示div
		var dom_container = document.querySelector(".file-container");
		dom_container.classList.add("active");
		cmp.dialog.loading(false);
	}
	var getIconClass = function(type){
		var className = "";
        type = type.substring(type.lastIndexOf(".") + 1);
        switch (type) {
            case "gif":
            case "jpg":
            case "jpeg":
            case "bmp":
            case "png":
                className += "img";
                break;
            case "txt":
                className += "txt";
                break;
            case "doc":
            case "docx":
                className += "doc";
                break;
            case "xls":
            case "xlsx":
                className += "xls";
                break;
            case "ppt":
            case "pptx":
                className += "ppt";
                break;
            case "pdf":
                className += "pdf";
                break;
            case "xml":
                className += "xml";
                break;
            case "html":
            case "htm":
            case "xhtml":
                className += "html";
                break;
            case "et":
                className += "et";
                break;
            case "wps":
                className += "wps";
                break;
            case "mp3":
            case "rm":
            case "wav":
            case "wma":
            case "mp4":
            case "amr":
                className += "music";
                break;
            case "3gp":
            case "rmvb":
            case "avi":
                className += "video";
                break;
            case "collaboration":// 协同应用
                className += "synergy";
                break;
            case "form":// 表单
                className += "squares";
                break;
            case "edoc": // 公文
                className += "flag";
                break;
            case "plan"://计划
                className += "cal";
                break;
            case "meeting":// 会议
                className += "meet";
                break;
            case "bulletin":// 公告
                className += "minvideo";
                break;
            case "news":// 新闻
                className += "news";
                break;
            case "bbs"://讨论
                className += "message";
                break;
            case "inquiry"://调查
                className += "confirm";
                break;
            case "link"://映射文件
            case "km"://文档中心乱七八糟的类型
                className += "link";
                break;
            case "zip"://zip
            case "rar":
                className += "rar";
                break;
            case "cvs":
                className += "cvs";
                break;
            case "":
                className += "synergy";
                break;

            default :
                className += "emptyfile";
                break;
        }
        return className;
	}
	var countAttSize = function (size) {
        var result = "0B";
        var temp = size;
        if (size == null) {
            return "";
        }
        if (typeof size == "string") {
            size = parseInt(size);
        }
        if (size == 0) {
            result = "1B";
        } else {
            var k = 0;
            result = size;
            while (result >= 1024) {
                result = result / (1024);
                k++;
            }
            result = result.toString();
            var inte = result.indexOf(".") > 0 ? result.substring(0,
                result.indexOf(".")) : result;
            var flot = result.indexOf(".") > 0 ? result.substring(result
                .indexOf(".")) : "";
            if (flot.length > 3) {
                flot = flot.substring(0, 2);
            }
            result = inte + flot;
            var suff = ["B", "KB", "MB", "GB", "TB"];
            result = result + suff[k];
        }
        return result;
    };
})();
