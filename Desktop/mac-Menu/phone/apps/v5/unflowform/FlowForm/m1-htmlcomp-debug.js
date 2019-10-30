(function($) {
    $(function(){
        $("a").each(function(){
            var str = $(this).attr("href");
            var urlStr = getURLStrForHC(str);
            urlStr = $.trim(urlStr);
            if(urlStr != null && urlStr != "") {
                urlStr = urlStr.replace(/'/g,"");
                var type = getHTMLCompType(urlStr);
                if(type == C_iHTMLCompType_Unknow) {
                    type = getHTMLCompTypeByParam(urlStr);
                }
                if(type == C_iHTMLCompType_Attachment) {
                    addAttOpenEventForHC($(this),urlStr);
                } else if(type == C_iHTMLCompType_Collaboration) {
                    addColOpenEventForHC($(this),urlStr);
                } else if(type == C_iHTMLCompType_Archive) {
                    addArchiveOpenEventForHC($(this),urlStr);
                } else if(type == C_iHTMLCompType_URL) {
                    addURLOpenEventForHC($(this),urlStr);
                } else if(type == C_iHTMLCompType_EDOC) {
                    addEDOCOpenEventForHC($(this),urlStr);
                } else if(type == C_iHTMLCompType_Meeting) {
                	addMeetingOpenEventForHC($(this), urlStr);
                }
            }
        });
    });
    
    var C_sHTMLCompKeyWords_Start = "openEditorAssociate('";
    var C_sHTMLCompKeyWords_End = "')";
    getURLStrForHC = function(str) {
        var result = null;
        if(typeof str != "undefined" && str != "" && str != null) {
            var start = str.indexOf(C_sHTMLCompKeyWords_Start);
            var end = str.lastIndexOf(C_sHTMLCompKeyWords_End);
            if(start != -1 && end != -1) {
                start += C_sHTMLCompKeyWords_Start.length;
                if(start <= end) {
                	result = str.substring(start,end);
                } else {
                	result = str.substring(start,str.length);
                }
            } else {
                result = str;
            }
        }
        return result;
    };
    
    var C_iHTMLCompType_Unknow = -1;
    var C_iHTMLCompType_Collaboration = 1;
    var C_iHTMLCompType_Archive = 2;
    var C_iHTMLCompType_Attachment = 3;
    var C_iHTMLCompType_URL = 4;
    var C_iHTMLCompType_EDOC = 5;
    var C_iHTMLCompType_Meeting = 6;
    getHTMLCompType = function(urlStr) {
        var result = C_iHTMLCompType_Unknow;
        var prefix = urlStr.substring(0,4);
        prefix = prefix.toLowerCase();
        if(prefix == "http") {
            result = C_iHTMLCompType_URL;
        } else if(urlStr.indexOf("/seeyon/doc.do?") != -1) {
            result = C_iHTMLCompType_Archive;
        } else if(urlStr.indexOf("/seeyon/fileUpload.do?") != -1) {
            result = C_iHTMLCompType_Attachment;
        } else if(urlStr.indexOf("/seeyon/collaboration/collaboration.do?") != -1) {
            result = C_iHTMLCompType_Collaboration;
        } else if(urlStr.indexOf("edocController.do?") != -1) {
            result = C_iHTMLCompType_EDOC;
        }
        return result;
    };
    
    getHTMLCompTypeByParam = function(paramStr) {
        var result = C_iHTMLCompType_Unknow;
        var paramArray = paramStr.split(",");
        var mimeType = paramArray[1];
        
        if(mimeType == "collaboration"){
            result = C_iHTMLCompType_Collaboration;
        } else if(mimeType == "edoc"){
            result = C_iHTMLCompType_EDOC;
        } else if(mimeType == "km"){
            result = C_iHTMLCompType_Archive;
        } else if(mimeType == "meeting") {
        	result = C_iHTMLCompType_Meeting;
        }else{
            result = C_iHTMLCompType_Attachment;
        }
        
        return result;
    };
    
    getAttDataForHC = function(dataStr) {
        var fileID = null;
        var fileName = null;
        var createDate = null;
        var verifyCode = null;
        if (dataStr.length > 0) {
            var index = dataStr.indexOf("?");
            var paramStr = dataStr.substring(index + 1);
            var paramPairStrArray = paramStr.split("&");
            var len = paramPairStrArray.length;
            for ( var i = 0; i < len; i++) {
                var paramPair = paramPairStrArray[i].split("=");
                if (paramPair[0] == "fileId") {
                    fileID = paramPair[1];
                } else if (paramPair[0] == "filename") {
                    fileName = paramPair[1];
                } else if (paramPair[0] == "createDate") {
                    createDate = paramPair[1];
                } else if(paramPair[0] == "v") {
                	verifyCode = paramPair[1];
                }
            }
        }
        
        var result = null;
        if(fileID != null) {
            result = new MAttOpenParameter(fileID, fileName, createDate, "", "", C_iChooseFileType_File, verifyCode);
        }
        return result;
    };
    
    getAttDataByParamForHC = function(paramStr) {
        var paramArray = paramStr.split(",");
        var fileID = paramArray[0];
        var fileName = unescape(unescape(paramArray[6]));
        var createDate = paramArray[5];
        var verifyCode = paramArray[7];
        
        var result = null;
        if(typeof fileID != "undefined" && typeof fileName != "undefined" && typeof createDate != "undefined") {
            result = new MAttOpenParameter(fileID, fileName, createDate, "", "", C_iChooseFileType_File, verifyCode);
        }
        return result;
    };
    
    getColDataForHC = function(crtrlObj, dataStr) {
        var affairID = null;
        if (dataStr.length > 0) {
            var index = dataStr.indexOf("?");
            var paramStr = dataStr.substring(index + 1);
            var paramPairStrArray = paramStr.split("&");
            var len = paramPairStrArray.length;
            for ( var i = 0; i < len; i++) {
                var paramPair = paramPairStrArray[i].split("=");
                if (paramPair[0] == "affairId") {
                    affairID = paramPair[1];
                }
            }
        }
        
        var commandValue = null;
        if(affairID != null) {
            commandValue = new MAssocOpenParameter("-1", crtrlObj.html(), "-1", affairID, C_iModuleType_Collaboration,
                    -1, "", "", "0", "", true);
        }
        return commandValue;
    };
    
    getColDataByParamForHC = function(paramStr) {
        var paramArray = paramStr.split(",");
        var affairID = paramArray[2];
        var fileName = unescape(unescape(paramArray[6]));
        
        var commandValue = null;
        if(typeof affairID != "undefined" && typeof fileName != "undefined") {
            commandValue = new MAssocOpenParameter("-1", fileName, "-1", affairID, C_iModuleType_Collaboration,
                    -1, "", "", "0", "", true);
        }
        return commandValue;
    };
    
    getEDOCDataForHC = function(crtlObj, dataStr) {
        var affairID = null;
        if (dataStr.length > 0) {
            var index = dataStr.indexOf("?");
            var paramStr = dataStr.substring(index + 1);
            var paramPairStrArray = paramStr.split("&");
            var len = paramPairStrArray.length;
            for ( var i = 0; i < len; i++) {
                var paramPair = paramPairStrArray[i].split("=");
                if (paramPair[0] == "affairId") {
                    affairID = paramPair[1];
                }
            }
        }
        
        var commandValue = null;
        if(affairID != null) {
            commandValue = new MAssocOpenParameter("-1", crtlObj.html(), "-1", affairID, C_iModuleType_EDoc,
                    -1, "", "", "0", "", true);
        }
        return commandValue;
    };
    
    getEDOCDataByParamForHC = function(paramStr) {
        var paramArray = paramStr.split(",");
        var affairID = paramArray[2];
        var fileName = unescape(unescape(paramArray[6]));
        
        var commandValue = null;
        if(typeof affairID != "undefined" && typeof fileName != "undefined") {
            commandValue = new MAssocOpenParameter("-1", fileName, "-1", affairID, C_iModuleType_EDoc,
                    -1, "", "", "0", "", true);
        }
        return commandValue;
    };
    
    getArchiveDataForHC = function(crtrlObj, dataStr) {
        var archiveID = null;
        var baseObjectID = null;
        if (dataStr.length > 0) {
            var index = dataStr.indexOf("?");
            var paramStr = dataStr.substring(index + 1);
            var paramPairStrArray = paramStr.split("&");
            var len = paramPairStrArray.length;
            for ( var i = 0; i < len; i++) {
                var paramPair = paramPairStrArray[i].split("=");
                if (paramPair[0] == "docResId") {
                    archiveID = paramPair[1];
                } else if (paramPair[0] == "baseObjectId") {
                    baseObjectId = paramPair[1];
                } 
            }
        }
        
        var commandValue = null;
        if(archiveID != null) {
            commandValue = new MAssocOpenParameter(archiveID, crtrlObj.html(), "-1", "-1", C_iModuleType_Archive, -1,
                    "", "", "0", baseObjectID, true);
        }
        return commandValue;
    };
    
    getArchiveDataByParamForHC = function(paramStr) {
        var paramArray = paramStr.split(",");
        var archiveID = paramArray[2];
        var fileName = paramArray[6];
        
        var commandValue = null;
        if(typeof archiveID != "undefined" && typeof fileName != "undefined") {
            commandValue = new MAssocOpenParameter(archiveID, fileName, "-1", "-1", C_iModuleType_Archive, -1,
                    "", "", "0", "", true);
        }
        return commandValue;
    };
    
    addAttOpenEventForHC = function(ctrlObj, urlStr) {
      var attData = getAttDataForHC(urlStr);
      if(attData == null) {
          attData = getAttDataByParamForHC(urlStr);
      }
      var eventSpan = getEventSpanForHC(1, ctrlObj);
      eventSpan.bind("click", function(){
          var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ShowAttachment, attData);
          requestClientWithParameter(commandStr);
      });
      ctrlObj.replaceWith(eventSpan);
    };
    
    addColOpenEventForHC = function(ctrlObj, urlStr) {
        var colData = getColDataForHC(ctrlObj,urlStr);
        if(colData == null) {
            colData = getColDataByParamForHC(urlStr);
        }
        var eventSpan = getEventSpanForHC(1, ctrlObj);
        eventSpan.bind("click", function(){
            var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ShowAssoc, colData);
            requestClientWithParameter(commandStr);
        });
        ctrlObj.replaceWith(eventSpan);
    };
    
    addEDOCOpenEventForHC = function(ctrlObj, urlStr) {
        var edocData = getEDOCDataForHC(ctrlObj,urlStr);
        if(edocData == null) {
            edocData = getEDOCDataByParamForHC(urlStr);
        }
        var eventSpan = getEventSpanForHC(1, ctrlObj);
        eventSpan.bind("click", function(){
            var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ShowAssoc, edocData);
            requestClientWithParameter(commandStr);
        });
        ctrlObj.replaceWith(eventSpan);
    };
    
    addArchiveOpenEventForHC = function(ctrlObj, urlStr) {
        var commandValue = getArchiveDataForHC(ctrlObj, urlStr);
        if(commandValue == null) {
            commandValue = getArchiveDataByParamForHC(urlStr);
        }
        var eventSpan = getEventSpanForHC(1, ctrlObj);
        eventSpan.bind("click", function(){
            var archiveManager = new mFormAjaxManager();
            archiveManager.getMArchiveByIDForForm(commandValue.archiveID, {
                success : function(objs) {
	            	if(objs.createTime == null && objs.content == null) {
	        	    	dialogMsg("",getDialogMsg("m.doc.prompt.inexistence"), C_iDialogType_Top);
	        	    } else {
	                	if(objs.content != null && objs.content.attContent != null) {
	                		commandValue.name = objs.content.attContent.title;
	                	} else {
	                		commandValue.name = objs.title;
	                	}
	                    commandValue.sourceID = objs.sourceID;
	                    commandValue.affairID = objs.affairID;
	                    commandValue.type = objs.type;
	                    commandValue.createDate = objs.createTime;
	                    commandValue.verifyCode = objs.verifyCode;
	                    commandValue.createDate = parseDateForM1(objs.createTime);
	                    var modifyDate = objs.modifyTime;
	                    if(modifyDate == null) {
	                        commandValue.modifyDate = commandValue.createDate;
	                    } else {
	                        commandValue.modifyDate = modifyDate;
	                    }
	                    commandValue.size = objs.size;
	                    var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ShowAssoc, commandValue);
	                    requestClientWithParameter(commandStr);
	                }
                }
            });
        });
        ctrlObj.replaceWith(eventSpan);
    };
    
    addURLOpenEventForHC = function(ctrlObj, urlStr) {
        var urlData = new Object();
        urlData.url = urlStr;
        var eventSpan = getEventSpanForHC(1, ctrlObj);
        eventSpan.bind("click", function(){
            var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_OpenURL, urlData);
            requestClientWithParameter(commandStr);
        });
        ctrlObj.replaceWith(eventSpan);
    };
    
    getEventSpanForHC = function(type,ctrlObj) {
      return $("<span/>").css("color","#296fbe").css("font-size","13px").html(ctrlObj.html());  
    };
    
    addMeetingOpenEventForHC = function(ctrlObj, urlStr) {
    	var data =getMeetingDataByParamForHC(urlStr);
    	var eventSpan = getEventSpanForHC(1, ctrlObj);
    	eventSpan.bind("click", function(){
    		//dialogMsg("",C_sTips_NotSupport, C_iDialogType_Top);
            var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ShowAssoc, data);
            requestClientWithParameter(commandStr);
        });
        ctrlObj.replaceWith(eventSpan);
    };
    getMeetingDataByParamForHC = function(urlStr){
    	var data =null;
    	if(urlStr) {
    		var arrays = urlStr.split(",");
    		var sourceID = arrays[2];
    		var moduleType = C_iModuleType_Meeting;
    		var from = 2;
    		var archiveID = -1;
    		var type = 6;
    		var createDate = arrays[5];
    		var size ="";
    		var name = arrays[6];
    		var modifyDate = "";
    		var affairID = -1;
    		var baseObjectID = -1;
    		var support = 0;
    		var verifyCode = null;
    		data = new MAssocOpenParameter(archiveID, name,sourceID,affairID,moduleType,type,createDate,modifyDate,size,baseObjectID,support,verifyCode);
    	}
    	return data;
    }
})(jQuery);
