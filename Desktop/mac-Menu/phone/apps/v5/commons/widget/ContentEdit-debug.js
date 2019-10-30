/**
 * office编辑，查看组件
 */
var ContentEdit = (function($){
	var _ths = {};
	var readonly = false;
	var isServerBase = true;
	var OffContent = function(){
		this.hasEditContent = false;//是否编辑过正文
		this.notJinge2StandardOffice = false;
    }
	//文档类型
	OffContent.prototype.WORD_BODY_TYPES = {
            "10" : "HTML",
            "20" : "form",
            "30" : "txt",
            "41" : "doc",
            "42" : "xls",
            "43" : "wps",
            "44" : "et",
            "45" : "pdf"
    };
	
	OffContent.prototype.BODY_TYPES = {
             "html" : "10",
             "form" : "20",
             "OfficeWord" : "41",
             "doc" : "41",
             "docx" : "41",
             "OfficeExcel" : "42",
             "WpsWord" : "43",
             "WpsExcel" : "44",
             "pdf" : "45"
         };
	
	//编辑office成功回调
	OffContent.prototype.editSuccessCallback = function(filepath){
		if(!readonly){//修改正文成功
			this.filepath = filepath;//本地文件的路径
			this.hasEditContent = true;
			var param = {
					"hasEditContent" : this.hasEditContent,
					"filepath" : this.filepath,
					"createDate" : _ths.createDate,
					"fileId" : _ths.fileId,
					"fileType" : _ths.fileType,
					"affairId" : _ths.affairId,
					"processId" : _ths.processId,
					"type" : _ths.type,
					"lastModified" : _ths.lastModified
			}
			if(window.summaryBO){
				window.summaryBO.editParam = param;
			}else{//目前公文没有注册summaryBO
				window.summaryBO = new Object();
				summaryBO.editParam = param;
				cmp.storage.save("m3_v5_edoc_summary_BO_", cmp.toJSON(window.summaryBO.editParam), true);
			}
		}
			
		isServerBase = false;
		
		cmp.dialog.loading(false);
		summaryBO.editParam.save = true;//是否保存了正文
	}
	
	//编辑office失败回调
	OffContent.prototype.editErrorCallback = function(retParam){
		_alert(retParam, function(){
			this.hasEditContent = false;
			cmp.dialog.loading(false);
			
			if(!summaryBO.editParam){
				summaryBO.editParam = {};
			}
			summaryBO.editParam.save = true;//是否保存了正文
		});
	}
	
	//编辑office
	OffContent.prototype.toEdit = function(){
		
		var tempLastModified = new Date(this.lastModified.replace(/\-/g, "/"));
		var lastModified = tempLastModified.getTime();
		var fileName = cmp.i18n("commons.label.defTitle")+lastModified;
		var downFilePath = cmp.origin + "/rest/attachment/file/" + this.fileId + "?fileName=" + encodeURI(fileName);
		
		var option = {
	        copyRight:this.copyRight,//金格授权码
	        filename:fileName,//文件名
	        fileType:"."+this.fileType,//文件类型，如doc
	        path:downFilePath,//文件下载路径
	        extData:{
	            fileId:this.fileId,//文件id  用于储存在数据库用
	            lastModified:lastModified,
	            isServerBase:isServerBase, //是否以服务器为准加载文件
	            readonly:readonly,
	            isClearTrace:this.isClearTrace
	        },
        	success: this.editSuccessCallback,//成功回调
        	error:this.editErrorCallback//失败回调
		};
		this.hasEditContent = true;
		cmp.contentEdit.open(option);
	}
	
	//上传到服务器
	OffContent.prototype.uploadToServer = function(successfn){
		var editParam = window.editParam ? window.editParam : window.summaryBO.editParam;
		cmp.att.upload({
            url: cmp.serverIp + this.getuploadUrl(editParam),
            fileList: [{
				filepath: editParam.filepath,
				fileId: cmp.buildUUID()
			}],
            title: "",      
            extData: "",
            success: function (result) {
                console.log("upload success↓");
                successfn();
            },
            progress:function(result){
                console.log("progress↓");
            },
            error: function (res) {
            	_alert(cmp.i18n("commons.exception.saveContent"));
                console.log(res);
            }
        });
	}
	
	//初始化方法
	OffContent.prototype.init = function(summaryBO){
		if(!summaryBO.editParam){
			summaryBO.editParam = {};
		}
		summaryBO.editParam.save = false;//是否保存了正文
		
		if(summaryBO.type=="edoc"){
			this.affairId = summaryBO.affairId;
			this.fileId = summaryBO.content;
			this.lastModified = summaryBO.lastModified;
			this.contentType = summaryBO.contentType;
			this.processId = summaryBO.processId;
		}else if(summaryBO.type=="collaboration"){
			this.affairId = summaryBO.summary.affairId;
			this.fileId = summaryBO.content.fileId;
			this.lastModified = summaryBO.content.lastModified;
			this.contentType = summaryBO.content.contentType;
			this.processId = summaryBO.summary.processId;
		}
		//是否默认显示痕迹
		this.isClearTrace = summaryBO.isClearTrace ? summaryBO.isClearTrace : false;
		readonly = summaryBO.readOnly;
		
		this.copyRight = summaryBO.copyRight;
		this.fileType = this.getfileType(summaryBO.type);
		_ths = {
				"createDate" : summaryBO.createDate,
				"fileId" : this.fileId,
				"fileType" : this.fileType,
				"affairId" : this.affairId,
				"processId" : this.processId,
				"type" : summaryBO.type,
				"lastModified" : this.lastModified
		}
		this.toEdit();
	}
	
	
	//获取文件类型
	OffContent.prototype.getfileType = function(type){
		if(type=="edoc"){
			return this.WORD_BODY_TYPES[this.BODY_TYPES[this.contentType]];
		}else{
			return this.WORD_BODY_TYPES[this.contentType];
		}
	}
	
	//获取上传参数
	OffContent.prototype.getuploadUrl = function(editParam){
		
		var uploadParam = '/seeyon/rest/editContent/saveFile?fileId='+editParam.fileId
						+'&createDate='+editParam.createDate
						+'&notJinge2StandardOffice='+this.notJinge2StandardOffice
						+'&category=1'
						+'&fileType=.'+editParam.fileType
						+'&affairId='+editParam.affairId
						+'&processId='+editParam.processId
						+'&type='+editParam.type
						+'&option.n_a_s=1'
		return uploadParam;
	}
	
	//清除本地文件缓存
	OffContent.prototype.clear = function(params){
		var opinion = {
			fileId:params.fileId,
			lastModified:params.lastModified,
			success: null,//成功回调
        	error:null//失败回调
		};
		cmp.contentEdit.clear(opinion);
	}
	
	return new OffContent();
})(cmp);