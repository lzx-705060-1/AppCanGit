(function(allVariable) {
  var privated = 'feild_224852204965216426';
  var _self = allVariable;
  var affairId = cmp.href.getParam().affairId || '-1';
  
  // 当前所有签章控件的当前签章信息
  var currentSignatures = {};
  var handlers = {};
  var reses = {};
  
  _self.dynamicLoading = {
    css: function (path) {
      if (!path || path.length === 0) {
        throw new Error('argument "path" is required !');
      }
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.href = path;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      head.appendChild(link);
    },
    js: function (path, callback) {
      if (!path || path.length === 0) {
        throw new Error('argument "path" is required !');
      }
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.onload = function() { callback(); };
      script.src = path;
      script.type = 'text/javascript';
      head.appendChild(script);
    }
  }
  
	_self.init = function init(res) {
    if (!cmp.handWriteSignature && cmp.platform.CMPShell) {
      _self.dynamicLoading.js('http://cmp/v/js/cmp-handWriteSignature.js', function() {
        _self.realInit(res);
      });
    } else {
      _self.realInit(res);
    }
  };
    
  _self.realInit = function _realInit(res) {
    var privateId = res.privateId;
    var messageObj = res.adaptation.childrenGetData(privateId);
    
    reses[privateId] = {
      adaptation: res.adaptation,
      formMessage: res.formMessage,
      formdata: res.getData.formdata
    };
    
    var showHTML = 
    '<section id="section-' + privateId + '" class="cap4-depart is-one" style="background:' + (messageObj.extra.fieldBg || 'unset') + '">' +
      '<div id="star-' + privateId + '"class="cap4-depart__star"><i class="icon CAP cap-icon-bitian"></i></div>' +
      '<div class="cap4-depart__content" style="overflow: hidden; border-bottom: ' + (messageObj.extra.fieldLine || 'unset') + '">' +
        '<div id="left-' + privateId + '" class="cap4-depart__left" style="color:'+ (messageObj.extra.fieldTitleDefaultColor || 'unset') + '">' + messageObj.display + '</div>' +
        
        '<div id="right-' + privateId + '" class="cap4-depart__right" style="overflow: unset">' +
          '<div class="cap4-depart__real">' +

            '<div id="tap-area-' + privateId + '" class="cap4-depart__real--edit">' +
              '<div id="input-' + privateId + '" class="cap4-depart__real--ret" style="display: inline-block; width: 100%; text-align: right; border-radius: 6px; color:' + (messageObj.extra.placeholderColor || 'unset') + '"></div>' +
              '<div id="arrow-' + privateId + '" class="cap4-depart__real--arrow" style="vertical-align: top">' +
                '<i class="icon CAP cap-icon-shanchu-X" style="display: none; margin-right: 5px"></i>' +
                '<i class="icon CAP cap-icon-youjiantou"></i>' +
              '</div>' +
            '</div>' +

          '</div>' +
        '</div>' +

      '</div>' +
    '</section>';
    var container = document.getElementById(privateId);
    
    if (!container) {
      return;
    }
    
    container.innerHTML = showHTML;
    
    if (cmp.platform.CMPShell) {
      _self.initShow(privateId, messageObj);
      
      // 其他属性改变时触发事件
      res.adaptation.ObserverEvent.listen('Event' + privateId, function(messageObj) {
        _self.initShow(privateId, messageObj);
      });
    } else {
      var star = document.getElementById('star-' + privateId);
      document.getElementById('input-' + privateId).innerText = '微协同不支持签章';
      document.getElementById("arrow-" + privateId).style.display = 'none';
      star.style.display = 'none';
    }
  };
  
	_self.initShow = function initShow(privateId, messageObj) {
    _self.updateEventsAndUI(privateId, messageObj);
    
    if (messageObj.auth === 'hide') {
      return;
    }
    
    var summaryID = reses[privateId].formdata.rawData.content.contentDataId;
    if (messageObj.recordId) {
      summaryID = messageObj.recordId;
    }
    
    // 处理明细表签章保存问题：http://10.5.6.252:8090/browse/CAPF-12981
    if (messageObj.customValue) {
      _self.showSignature(messageObj.customValue, privateId, messageObj);
      return;
    }

    if (!messageObj.value) {
      _self.clearSignature(privateId, messageObj);
      return;
    }
    
    var fieldName = messageObj.id + '_' + summaryID;
    cmp.ajax({
      url: cmp.serverIp + '/seeyon/rest/signet/findsignets/' + summaryID + '/' + fieldName,
      type: 'GET',
      timeout: '30000',
      dataType: 'json',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Language': 'zh-CN',
        'token': cmp.token,
        'option.n_a_s': '1'
      },
      
      success: function success(signet) {
        if (signet.fieldValue) {
          cmp.handWriteSignature.initSignatureData({
            value: [signet],
            success: function(decodeSignatures) {
              _self.showSignature(decodeSignatures[0], privateId, messageObj);
            },
            error: function(err) {
              console.error('解密签章数据失败：', err);
            }
          });
        } else {
          _self.clearSignature(privateId, messageObj);
        }
      },
      
      error: function (error) {
        console.error('获取签章信息失败：', error);
      }
    });
  };
  
  // 事件及UI更新
  _self.updateEventsAndUI = function updateEventsAndUI(privateId, messageObj) {
    var root = document.getElementById('section-' + privateId);
    var tapArea = document.getElementById("tap-area-" + privateId);
    var input = document.getElementById('input-' + privateId);
    var rightButton = document.getElementById("arrow-" + privateId);
    var star = document.getElementById('star-' + privateId);
    var left = document.getElementById('left-' + privateId);
    var right = document.getElementById('right-' + privateId);
    
    if(reses[privateId].formdata.rawData.viewInfo.viewContent.skin && messageObj.isNotNull === '1') {
      root.classList.add('is-must');
      star.style.display = 'block';
		} else {
      root.classList.remove('is-must');
      star.style.display = 'none';
    }
    
    if(messageObj.auth === "edit") { // 编辑态
      root.style.display = 'block'
      rightButton.style.display = "inline-block";
      handlers[privateId] = handlers[privateId] || function wrapTapHandler(e) {
        if (e.target.classList.contains('cap-icon-shanchu-X')) {
          _self.clearSignature(privateId, messageObj, true);
        } else {
          _self.popHandWriter(privateId, messageObj);
        }
      }
      tapArea.addEventListener('tap', handlers[privateId]);
    } else if (messageObj.auth === "browse") { // 浏览态
      root.style.display = 'block'
      rightButton.style.display = "none";
      tapArea.removeEventListener('tap', handlers[privateId]);
    } else { // 隐藏态
      root.style.display = 'none'
    }

    if (!messageObj.display) {
      left.style.display = 'none';
      right.style.marginLeft = 0;
    }
  };
  
  // 展示签章
  _self.showSignature = function showSignature(signature, privateId, messageObj, fillback) {
    var summaryID = reses[privateId].formdata.rawData.content.contentDataId;
    if (messageObj.recordId) {
      summaryID = messageObj.recordId;
    }
    
    currentSignatures[privateId] = signature;
    
    // UI更新
    var rightButton = document.getElementById("arrow-" + privateId);
    var input = document.getElementById('input-' + privateId);
    
    input.innerHTML = '<img style="max-width: 100%" src="data:image/png;base64,' + signature.picData + '">';
    
    if (messageObj.auth === 'edit') {
      if (messageObj.isNotNull === '1') {
        input.style.backgroundColor = 'unset';
      }
      
      rightButton.firstElementChild.style.display = 'unset';
      input.style.width = 'calc(100% - 40px)';
    }
    
    // 表单数据回写
    if (fillback) {
      var updateData = {};
      updateData[messageObj.id] = {
        customValue: signature,
        showValue2: messageObj.id + '_' + summaryID
      };
      
      reses[privateId].adaptation.backfillFormControlData({
        tableName: reses[privateId].formMessage.tableName,
        tableCategory: reses[privateId].formMessage.tableCategory,
        updateData: updateData,
        updateRecordId : messageObj.recordId || ''
      }, privateId);
    }
  };
  
  // 清空签章
  _self.clearSignature = function clearSignature(privateId, messageObj, fillback) {
    currentSignatures[privateId] = null;
    
    // UI更新
    var rightButton = document.getElementById("arrow-" + privateId);
    var input = document.getElementById('input-' + privateId);
    
    if (messageObj.auth === 'edit') {
      input.innerHTML = '请签批';
      
      if (messageObj.isNotNull === '1') {
        input.style.backgroundColor = messageObj.extra.isNotNullBg || '#fef0d0';
      } else {
        input.style.backgroundColor = 'unset';
      }
      
      rightButton.firstElementChild.style.display = 'none';
      input.style.width = 'calc(100% - 20px)';
    } else {
      input.innerHTML = '';
    }
    
    // 表单数据回写
    if (fillback) {
      var updateData = {};
      updateData[messageObj.id] = {
        customValue: null,
        showValue2: ''
      };
      
      reses[privateId].adaptation.backfillFormControlData({
        tableName: reses[privateId].formMessage.tableName,
        tableCategory: reses[privateId].formMessage.tableCategory,
        updateData: updateData,
        updateRecordId : messageObj.recordId || ''
      }, privateId);
    }
    
    cmp.handWriteSignature.clear();
  };
  
  /**
  * 弹出签名对话框
  * 已知问题：
  * 1. ios签章图片叠加
  * 2. android(可能ios也有这个问题，需要先解决图片叠加再试)上切换签章时会导致之前的签章重新编辑时不显示现有签章，
  *    步骤如下：
  *    1. 新建表单，给一个签章控件签名，然后保存待发
  *    2. 重新编辑此表单的签章，签章控件会显示之前的签章，正常
  *    3. 新建另一个表单，一样做签章，保存待发
  *    4. 重新打开第一个表单编辑，重新签章，签章控件弹出后空白，不再展示现有的签章
  */
  _self.popHandWriter = function popHandWriter(privateId, messageObj) { 
    var summaryID = reses[privateId].formdata.rawData.content.contentDataId;
    if (messageObj.recordId) {
      summaryID = messageObj.recordId;
    }
    
    cmp.handWriteSignature.show({
      affairId: affairId,
      summaryID: summaryID,
      fieldName: messageObj.id + '_' + summaryID,
      recordID: messageObj.recordId || '',
      fieldValue: currentSignatures[privateId] ? currentSignatures[privateId].fieldValue : '',
      height: 54,
      width: 188 * window.devicePixelRatio,
      signatureListUrl: cmp.serverIp + '/seeyon/rest/signet/signets/' + affairId,
      signaturePicUrl: cmp.serverIp + '/seeyon/rest/signet/signetPic',
      
      success: function success(data) {
        _self.showSignature(data[0], privateId, messageObj, true);
      },
      
      error: function error(error) {
        console.error('签章失败：', error);
      }
    });
  };
  
  window[privated] = allVariable;
})({});
