/** 二维码自定义控件
 * Created by ychao on 2018-10-10.
 */

(function(scope, factory){
  //var nameSpace = 'cap_custom_ctrl_barcode';
  var nameSpace = 'field_6678555354073746763';
  if(!scope[nameSpace]){
    var Builder = factory();
    var plugin = {instance: {}};
    //自定义控件初始化接口
    plugin.init = function (options) {
      plugin.destroy(options.privateId);
      plugin.instance[options.privateId] = new Builder(options);
    }
    //自定义控件销毁的接口
    plugin.destroy = function (privateId) {
      var old = plugin.instance[privateId];
      if (old && old.destroy) {
        old.destroy();
      }
    }

    plugin.isNotNull = function (options) {
      return true;
    }

    plugin.version = function () {
      return 'v4.0';
    }

    plugin.injectCssCode = function () {
      var cssStyle = document.createElement('style');
      cssStyle.innerHTML = Builder.prototype.getCssCode.call();
      document.head.appendChild(cssStyle);
    }

    //inject插件所需的css code，只注入一次就行
    plugin.injectCssCode();
    scope[nameSpace] = plugin;
  }
})(this, function(){
  /**
   * 构造函数
   * @param options
   * @constructor
   */
  function App(options) {
    //初始化参数
    this.initParams(options);
    //初始化控件
    this.initCtrl();
    //初始化事件
    this.bindEvents();
  }

  App.prototype = {
    initParams: function (options) {
      this.adaptation = options.adaptation;
      this.formMessage = options.formMessage;
      this.privateId = options.privateId;
      this.params = options.getData;
      this.preUrl = options.url_prefix;

      //其它辅助参数
      this.isLightForm = this.hasSkin();
      this.isPc = bridge.isPc();
      this.isMb = !this.isPc; //是否移动端，包括微协同也属于移动端
      this.isM3 = bridge.isM3();
    },
    initCtrl: function () {
      //自定义控件的渲染容器，通过querySelector的形式查找不太友好，应该是自定义控件通过参数传进来
      this.container = document.getElementById(this.privateId);
      if (!this.container) {
        throw new Error('the container of customerCtrl not found!');
      }
      this.updateTemplate();
    },
    bindEvents: function () {
      var that = this;
      // 监听是否数据刷新
      that.adaptation.ObserverEvent.listen('Event' + that.privateId, function() {
        that.params = that.adaptation.childrenGetData(that.privateId);
        that.updateTemplate();
      });

      //在容器上只绑定一次事件，destroy的时候销毁
      var eventName = that.isPc ? 'click' : 'tap';
      that.container.removeEventListener(eventName, that.clickHandler);
      that.container.addEventListener(eventName, that.clickHandler.bind(that));

      //原表单在容器上监听图片的load事件
      if (that.isMb && !that.isLightForm) {
        that.onLoadHandler = function (e) {
          console.log('二维码图片加载完毕!');
          that.adaptation.backCallApi('relayout', function(){}, {privateId: that.privateId});
        }.bind(that);
        that.container.addEventListener('load', that.onLoadHandler, true);
      }
    },
    //更新视图html
    updateTemplate: function () {
      var notNullClass = this.params.isNotNull === '1' ? ' is-must' : '';
      var isEmpty = !(this.params.attachmentInfo && this.params.attachmentInfo.attachmentInfos && this.params.attachmentInfo.attachmentInfos.length > 0);
      var emptyClss = isEmpty ? ' is-empty' : '';
      var ctrlClass = 'cap-ctrl form-pc';
      var borderStyle = this.params.ctrlBorderStyle || 'all';
      var titleStyle = this.params.ctrlTitleStyle || 'none'; //默认title样式无标题

      //如果是轻表单模式，直接设置为换行，无边框模式
      if (this.isLightForm) {
        borderStyle = 'none';
        titleStyle = 'linewrap';
        ctrlClass = 'cap-ctrl form-light';
      } else if (this.isMb) {
        ctrlClass = 'cap-ctrl form-origin';
      }
	  
      //TODO 如果标题为空，默认设置为无标题,自定控件暂时加这个判断，后续表单设计器放开对标题的控制后，这个判断可以去掉
      if (!this.params.display) {
        titleStyle = 'none';
      }

      //如果轻表单，隐藏权限，不显示 #OA-161376
      if (this.params.auth === 'hide' && this.isLightForm) {
        return;
      }

      var html = '<section class="' + ctrlClass + ' cap-custom-ctrl-barcode cap-auth-' + this.params.auth +
        ' cap-border-' + borderStyle + ' cap-title-' + titleStyle + notNullClass + emptyClss + '">';
      //轻表单才必填星号样式
      if (this.isLightForm) html += '<div class="cap4-doc__star"><i class="icon CAP cap-icon-bitian"></i></div>';
      html += '<div class="cap-ctrl-content">';   //cap-ctrl-content
      //渲染title的时候区分一下轻表单
      if (this.isLightForm) {
        html += '<div class="cap-ctrl-title">';
        html += '<div class="cap-custom-ctrl-barcode-left">' + this.params.display + '</div>';
        html += '<div class="cap-custom-ctrl-barcode-right"></div>';
        html += '</div>'; //cap-ctrl-title
      } else {
        html += '<div class="cap-ctrl-title">' + this.params.display + '</div>'; //cap-ctrl-title
      }

      html += '<div class="cap-ctrl-field">';
      if (this.params.auth === 'hide') {
        html += '<div class="cap-ctrl-hide-text">***</div>';
      } else {
        //拼接图片url,top._ctxPath默认为"/seeyon"
        var attachment = !isEmpty ? this.params.attachmentInfo.attachmentInfos[0] : null;
        if (attachment) {
          var url = bridge.getCtxPath() + '/fileUpload.do?method=showRTE&type=image&fileId=' + attachment.fileUrl + '&createDate=' + attachment.createdate;
          var bigUrl = url + '&showType=big';
          var smallUrl = url + '&showType=small';
          html += '<div class="barcode-img-wrapper">';
          html += '<img src="' + smallUrl + '" originalsrc="' + bigUrl + '">';
          html += '</div>'; //barcode-img-wrapper
        }
      }

      html += '</div>'; //cap-ctrl-field
      //如果不是编辑态，不显示按钮
      if (this.params.auth === 'edit' || this.params.auth === 'add') {
        html += '<div class="barcode-img-btn icon CAP cap-icon-erweima"></div>';
      }
      html += '</div>'; //cap-ctrl-content
      html += '</section>'; //cap-custom-ctrl-barcode

      this.container.innerHTML = html;
    },
    clickHandler: function (e) {
      var that = this;
      var target = e.target;
      if (target.classList.contains('barcode-img-btn')) {
        //生成二维码操作
        var content = this.getContent();
        if(!content) return;

        var url = bridge.getCtxPath() + '/rest/capBarcode/generateBarCode';
        var payload = {
          formId: content.contentTemplateId,
          moduleId: content.moduleId,
          dataId: content.contentDataId,
          recordId: that.params.recordId ? that.params.recordId : '0',
          fieldName: that.params.id
        };

        //生成二维码之前，先预提交一下
        bridge.showTopMask();
        that.preSave(function (err) {
          if (err) {
            bridge.closeTopMask();
            throw new Error('prev submit data error!');
          }

          bridge.post(url, payload, function (err, result) {
            bridge.closeTopMask();
            if (err) {
              return bridge.alert(err.message || '生成二维码出错');
            }

            //如果生成二维码失败，给出提示
            if (result.data && !result.data.success) {
              return bridge.alert(result.data.msg || '生成二维码出错');
            } else if (result.data && result.data.attachment) {
              var attachment = result.data.attachment;
              var url = bridge.getCtxPath() + '/fileUpload.do?method=showRTE&type=image&fileId=' + attachment.fileUrl + '&createDate=' + attachment.createdate;
              var bigUrl = url + '&showType=big';
              var smallUrl = url + '&showType=small';
              var imgWrapper = that.container.querySelector('.barcode-img-wrapper');
              if (imgWrapper) {
                imgWrapper.innerHTML = '<img src="' + smallUrl + '" originalsrc="' + bigUrl + '">';
              }

              that.updateFieldInfo(attachment);
            }
          });

        });
      } else if (target.nodeName === 'IMG') {
        //如果点击的是图片，调用图片查看器
        bridge.imageView(target.src, target.getAttribute('originalsrc'));
      }
    },
    updateFieldInfo: function (attachment) {
      //将subReference同步到value属性
      this.params.value = attachment.subReference;
      this.params.valueId = attachment.subReference;
      if (this.params.attachmentInfo && this.params.attachmentInfo.attachmentInfos instanceof Array) {
        this.params.attachmentInfo.attachmentInfos.splice(0, this.params.attachmentInfo.attachmentInfos.length, attachment);
        if (this.params.attachmentInfo.baseAttachmentInfo) {
          this.params.attachmentInfo.baseAttachmentInfo.subReference = attachment.subReference;
        }
      }

      if (this.isPc) {
        this.adaptation.childrenSetData(this.params, this.privateId);
      } else {
        var updateData = {};
        updateData[this.params.id] = {
          value: this.params.value,
          valueId: this.params.value,
          attachmentInfo: this.params.attachmentInfo
        };
        var payload = {
          calculate: false,
          tableName: this.formMessage.tableName,
          tableCategory: this.formMessage.tableCategory,
          updateRecordId: this.params.recordId ? this.params.recordId : '',
          updateData: updateData
        };
        this.adaptation.backfillFormControlData(payload, this.privateId);
      }
    },
    getContent: function () {
      if (this.isPc) {
        return this.params.formdata ? this.params.formdata.content : null;
      } else {
        return this.params.formdata && this.params.formdata.rawData ? this.params.formdata.rawData.content : null;
      }
    },
    preSave: function (callback) {
      if (this.isPc) {
        this.adaptation.callTakeFormSave({type:'save', mainbodyArgs:{needCheckRule: '0', needDataUnique: '0', needSn: '0'}, isPrev: true, callback: function(){}, 
		successFn: function (){
          callback();
        }, errorFn: function (){
          callback({msg:'prev submit data error!'});
        }}, this.privateId);
      } else {
        this.adaptation.backCallApi('presave', callback, {
          privateId: this.privateId,
          validation: {
            needCheckRule: '0',
            needDataUnique: '0',
            needSn: '0'
          }
        });
      }
    },
    hasSkin: function () {
      ////判断viewContent是否有skin，用于区别是否轻表单
      var hasSkin;
      try {
        hasSkin = !!this.params.formdata.rawData.viewInfo.viewContent.skin;
      } catch (e) {
        hasSkin = false;
      }
      return hasSkin;
    },
    destroy: function () {
      this.container.removeEventListener('click', this.clickHandler);
      if (this.isMb && !this.isLightForm) {
        this.container.removeEventListener('load', this.onLoadHandler);
      }
    },
    getCssCode: function () {
      var cssCode = [
          '.cap-ctrl {',
               'width: 100%;',
               'overflow: hidden;',
               'box-sizing: border-box;',
           '}',
           '.cap-ctrl .cap-ctrl-content {',
               'width: 100%;',
               'overflow: hidden;',
               'box-sizing: border-box;',
           '}',
           '/*pc端上cap4-formmain__lonly 下的控件设置一个间距，特殊处理一下*/',
           '.cap4-formmain__lonly .cap-ctrl.form-pc .cap-ctrl-content{',
               'margin-bottom: 3px;',
           '}',
            '.cap-ctrl.form-pc .cap-ctrl-field,.cap-ctrl.form-origin .cap-ctrl-field {',
               'min-height: 30px;',
           '}',
           '.cap-ctrl.is-must.is-empty .cap-ctrl-field{',
               'background: #fef0d0;',
           '}',
           '/*默认控件标题样式为inline*/',
           '.cap-ctrl .cap-ctrl-title,.cap-ctrl.cap-title-inline .cap-ctrl-title {',
               'width: 70px;',
               'padding: 5px 0;',
               'text-align: right;',
               'float: left;',
               'font-size: 14px;',
               'line-height: 20px;',
           '}',
           '.cap-ctrl .cap-ctrl-field,.cap-ctrl.cap-title-inline .cap-ctrl-field {',
               'margin-left: 77px;',
               'position: relative;',
           '}',
           '.cap-ctrl.cap-title-linewrap .cap-ctrl-title {',
               'width: 100%;',
               'text-align: left;',
           '}',
           '.cap-ctrl.cap-title-linewrap .cap-ctrl-field {',
               'width: 100%;',
               'margin-left: 0;',
               'float: left;',
           '}',
           '.cap-ctrl.cap-title-none .cap-ctrl-title {',
               'display: none;',
           '}',
           '.cap-ctrl.cap-title-none .cap-ctrl-field {',
               'margin-left: 0;',
           '}',
           '.cap-ctrl.cap-border-all .cap-ctrl-field{',
               'border:1px solid #D4D4D4;',
               'border-radius: 4px;',
           '}',
           '.cap-ctrl.cap-border-none .cap-ctrl-field{',
               'border:1px solid transparent;',
           '}',
           '.form-light.cap-ctrl.cap-border-none .cap-ctrl-field{',
               'border:none;',
           '}',
           '.cap-ctrl.cap-border-bottom .cap-ctrl-field{',
               'border:1px solid transparent;',
               'border-bottom: 1px solid #D4D4D4;',
           '}',
           '.cap-ctrl.cap-auth-hide .cap-ctrl-field{',
               'height: 30px;',
               'line-height: 30px;',
               'padding: 0 0 0 2px;',
               'color: #000;',
           '}',
           '.cap-ctrl.form-light .cap-ctrl-title{',
               'text-align: left;',
               'font-size: 16px;',
           '}',
           '.cap-ctrl.form-light .cap-ctrl-field{',
                'display: flex;',
           '}',
            '/*轻表单的样式*/',
           '.form-light.cap-custom-ctrl-barcode {',
               'width: 100%;',
               'position: relative;',
               'background: #fff;',
               'padding: 8px 0 0 20px;',
               'box-sizing: border-box;',
           '}',
           '.form-light.cap-custom-ctrl-barcode .cap-ctrl-content {',
               'width: 100%;',
               'box-sizing: border-box;',
               'padding: 0 10px 8px 0;',
               'position: relative;',
               'border-bottom: 1px solid rgb(238, 238, 238);',
           '}',
           '.form-light.cap-custom-ctrl-barcode .cap-ctrl-title{',
               'width: 100%;',
               'word-break: break-all;',
               'display: flex;',
               'padding: 0;',
               'min-height: 32px;',
           '}',
           '/*轻表单浏览态并且无标题特殊处理，将其隐藏*/',
           '.form-light.cap-custom-ctrl-barcode.cap-auth-browse.cap-title-none .cap-ctrl-title,',
             '.form-light.cap-custom-ctrl-barcode.cap-auth-hide.cap-title-none .cap-ctrl-title{',
                'display: none;',
           '}',
           '.form-light.cap-custom-ctrl-barcode .cap-ctrl-title .cap-custom-ctrl-barcode-left {',
               'width: 90px;',
               'margin-right: 5px;',
               'font-size: 16px;',
               'line-height: 20px;',
               'padding: 6px 0;',
           '}',
           '.form-light.cap-custom-ctrl-barcode.cap-auth-browse .cap-ctrl-title .cap-custom-ctrl-barcode-left,',
            '.form-light.cap-custom-ctrl-barcode.cap-auth-hide .cap-ctrl-title .cap-custom-ctrl-barcode-left{',
              'width: 100%;',
              'margin-right:0;',
           '}',
           '.form-light.cap-custom-ctrl-barcode.cap-auth-browse .cap-ctrl-title .cap-custom-ctrl-barcode-right,',
            '.form-light.cap-custom-ctrl-barcode.cap-auth-hide .cap-ctrl-title .cap-custom-ctrl-barcode-right{',
              'padding-right: 0;',
              'width: 0;',
           '}',
           '.form-light.cap-custom-ctrl-barcode .cap-ctrl-title .cap-custom-ctrl-barcode-right {',
               '-webkit-box-flex: 1;',
               '-webkit-flex: 1;',
               '-ms-flex: 1;',
               'flex: 1;',
               'padding-right: 30px;',
           '}',
           '.form-light.cap-custom-ctrl-barcode .cap-icon-bitian{',
                'top: 14px;',
           '}',
           '.form-light.cap-custom-ctrl-barcode .cap-ctrl-field {',
                'height: auto;',
                'padding:0;',
           '}',
           '.form-light.cap-custom-ctrl-barcode.is-empty .cap-ctrl-field{',
               'background: none;',
           '}',
           '.form-light.cap-custom-ctrl-barcode .cap-ctrl-field .barcode-img-wrapper {',
               'margin-bottom: 6px;',
               'width: 110px;',
               'height: 110px;',
               'padding: 0;',
               'border: 1px solid #F5F5F5;',
           '}',
           '.form-light.cap-custom-ctrl-barcode .cap-ctrl-field .barcode-img-wrapper img {',
               'width: 100%;',
               'max-width: 110px;',
               'max-height: 110px;',
               'cursor: pointer;',
           '}',
           '.form-light.cap-custom-ctrl-barcode.is-must.is-empty .cap-ctrl-title .cap-custom-ctrl-barcode-right {',
               'background: #fef0d0;',
               'height: 32px;',
               'border-radius: 4px;',
           '}',
           '.cap-custom-ctrl-barcode .cap-ctrl-field {',
               'padding: 5px 24px 5px 2px;',
               'min-width: 44px;',
               'box-sizing: border-box;',
           '}',
           '.cap-custom-ctrl-barcode.cap-auth-browse .barcode-img-btn {',
                'display: none !important;',
           '}',
           '.cap-custom-ctrl-barcode.cap-auth-browse .cap-ctrl-field{',
               '/*二维码浏览的时候强制没有边框*/',
               'border:1px solid transparent !important;',
           '}',
           '.cap-custom-ctrl-barcode .barcode-img-wrapper {',
               'height: auto;',
           '}',
           '.cap-custom-ctrl-barcode.cap-auth-browse .cap-ctrl-field {',
               'padding-right: 2px;',
           '}',
           '.cap-custom-ctrl-barcode .barcode-img-wrapper img {',
               'width: 100%;',
               'cursor: pointer;',
               'display: block;',
           '}',
           '.cap-custom-ctrl-barcode .barcode-img-btn {',
               'width: 16px;',
               'height: 16px;',
               'line-height: 16px;',
               'position: absolute;',
               'top: 7px;',
               'right: 3px;',
               'color: #1F85EC;',
               'cursor: pointer;',
           '}',
           '.form-light.cap-custom-ctrl-barcode .barcode-img-btn{',
               'right: 10px;',
               'width: 18px;',
               'height: 20px;',
               'font-size: 18px;',
               'line-height: 20px;',
               'color: #3aadfb;',
           '}',
           '.form-pc.cap-custom-ctrl-barcode.cap-title-linewrap .barcode-img-btn,.form-origin.cap-custom-ctrl-barcode.cap-title-linewrap .barcode-img-btn {',
              'top: 37px;',
           '}',
           '.form-origin.cap-custom-ctrl-barcode .barcode-img-btn {',
              'right: 8px;',
           '}',
           '.form-light.cap-custom-ctrl-barcode.is-must .cap4-doc__star{',
               'display: block;',
           '}'].join('');
      return cssCode;
    }
  };

  var _mask = null;
  var bridge = {
    showTopMask: function () {
      if (bridge.isPc()) {
        if (top.$ && typeof top.$.progressBar === 'function') {
          bridge.closeTopMask();
          _mask = top.$.progressBar();
        }
      } else {
        top.cmp && top.cmp.dialog && top.cmp.dialog.loading();
      }
    },
    closeTopMask: function () {
      if (bridge.isPc()) {
        if (_mask) {
          _mask.close();
          _mask = null;
        }
      } else {
        top.cmp && top.cmp.dialog && top.cmp.dialog.loading(false);
      }
    },
    isM3: function () {
      return top.cmp && top.cmp.platform.CMPShell;
    },
    isPc: function () {
      //判断top上有没有cmp
      return !top.cmp;
    },
    getCtxPath: function() {
      if (bridge.isPc()) {
        return top._ctxPath || '/seeyon';
      } else {
        return top.cmp.seeyonbasepath;
      }
    },
    post: function (url, payload, callback) {
      var ajaxCaller;
      if (bridge.isPc()) {
        if (!top.$ || !top.$.ajax) {
          throw new Error('ajax api not found!');
        }
        ajaxCaller = top.$.ajax;
      } else {
        if (!top.cmp || !top.cmp.ajax) {
          throw new Error('ajax api not found!');
        }
        ajaxCaller = top.cmp.ajax;
      }

      if (!ajaxCaller) return;

      ajaxCaller({
        url: url,
        async: false,
        type: 'POST',
        dataType:'json',
        contentType : 'application/json;charset=UTF-8',
        data: JSON.stringify(payload),
        success: function(res){
          if (typeof res === 'string') {
            // 应该跳转到登录页面或者给什么提示
            if(res === '__LOGOUT'){
              return bridge.alert('您的账号已被迫下线!');
            }

            var result = null;
            try {
              result = JSON.parse(res);
            } catch (ex) {
              callback({message: '解析JSON出错'}, res || {});
              return;
            }
            // 如果返回的的json有code表示后台有错误
            if (!result || result.code) {
              callback(result);
            } else {
              callback(null, result);
            }
          } else {
            if (!res || res.code) {
              callback(res);
            } else {
              callback(null, res);
            }
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          callback({message: bridge.getErrorMessage(jqXHR)});
        }
      });
    },
    getErrorMessage: function (xhr) {
      if (xhr.responseText) {
        //尝试parse一下，取message
        try {
          var msgObj = JSON.parse(xhr.responseText);
          return msgObj.message ? msgObj.message : xhr.responseText;
        } catch(err) {
          return xhr.responseText;;
        }
      } else {
        return xhr.message;
      }
    },
    imageView: function (url, originalsrc) {
      if (bridge.isPc()) {
        //如果点击的是图片，调用图片查看器
        top.$ && typeof top.$.touch === 'function' && top.$.touch({
          id:  new Date().getTime(),
          datas: [{
            src: originalsrc,
          }],
          currentIndex: 0
        });
      } else {
        var imgsObj = [];
        imgsObj.push({
          small: url,
          big: originalsrc
        });

        if (top.cmp.sliders) {
          top.cmp.sliders.addNew(imgsObj);
          top.cmp.sliders.detect(0);
        }
      }
    },
    alert: function (msg) {
      if (bridge.isPc()) {
        var alertFunc;
        if (top.$ && typeof top.$.alert === 'function') {
          alertFunc = top.$.alert;
        }
        alertFunc = alertFunc || window.alert;
        alertFunc(msg);
      } else {
        if (!top.cmp || !top.cmp.notification) {
          window.alert(msg);
        } else {
          cmp.notification.alert(msg, function () {
          }, '提示', '确定');
        }
      }
    },
    loadJS: function (url, success) {
      var script  = document.createElement('script');
      script.src = url;
      script.onload = script.onreadystatechange = function () {
        if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
          success && success();
          this.onload = this.onreadystatechange = null;
          this.parentNode.removeChild(this);
        }
      };
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  };

  return App;
});
