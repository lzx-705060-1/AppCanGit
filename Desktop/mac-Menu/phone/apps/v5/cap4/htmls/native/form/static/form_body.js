(function () {
  window.XForm = window.XForm || {
    perf: { started: Date.now() },
    version: document.querySelector('meta[name="version"]').getAttribute('content')
  };
  var XForm = window.XForm;
  var perf = XForm.perf;
  var isLoaded = false;
  var isDomReady = false;
  var readyQueue = [];
  var loadedQueue = [];
  var nextTick = function (fn) {
    if (typeof Promise !== 'undefined' && Promise.resolve) {
      var p = Promise.resolve(true);
      p.then(fn);
    } else {
      setTimeout(fn, 0);
    }
  }
  var emitQueue = function (q) {
    q.splice(0, q.length).forEach(function (cb) { cb() });
  };
  window.addEventListener('DOMContentLoaded', function () {
    perf.domReady = Date.now();
    isDomReady = true;
    emitQueue(readyQueue);
  }, false);
  window.addEventListener('load', function () {
    perf.pageLoad = Date.now();
    isLoaded = true;
    if (!isDomReady) {
      isDomReady = true;
      emitQueue(readyQueue);
    }
    emitQueue(loadedQueue);
  }, false);
  XForm.nextTick = nextTick;
  XForm.onDomReady = function (cb) {
    if (isDomReady) return cb();
    readyQueue.push(cb);
  };
  XForm.onPageLoad = function (cb) {
    if (isLoaded) return cb();
    loadedQueue.push(cb);
  };
})();

(function () {
  var prefix = window.location.protocol !== 'https:' ? 'http://' : 'https://';
  var head = document.head || document.getElementsByTagName('head')[ 0 ];
  var isApp = !!navigator.userAgent.match(/seeyonCordova/i);
  var capUrlPrefix = isApp ? prefix + 'cap4.v5.cmp/v1.0.0' : '/seeyon/m3/apps/v5/cap4';
  var cmpUrlPrefix = isApp ? prefix + 'cmp/v1.0.0' : '/seeyon/m3/cmp';
  var collaborationUrlPrefix = isApp ? prefix + 'collaboration.v5.cmp/v' : '/seeyon/m3/apps/v5/collaboration';
  var v5CommonUrlPrefix = isApp ? prefix + 'commons.v5.cmp/v' : '/seeyon/m3/apps/v5/commons';
  var originFormUrl = capUrlPrefix + '/htmls/origin/form/index.html';
  var version = '?v=' + XForm.version;
  var isNotFormain = location.href.match(/\#\/?(?:formson|relation)/);

  var sourceCached = {};
  var sourceChunks = [
    {
      name: 'base',
      async: 1,
      lazy: 0,
      resources: [
        cmpUrlPrefix + '/css/cmp.css' + version,
        cmpUrlPrefix + '/js/cmp-i18n.js' + version,
        cmpUrlPrefix + '/js/cmp-ajax-fast.js' + version,
        capUrlPrefix + '/htmls/native/form/static/js/vendor.cap4Form.js' + version,
        capUrlPrefix + '/htmls/native/form/static/js/widget.cap4Form.js' + version
      ]
    },
    {
      name: 'cordova',
      async: 0,
      lazy: 0,
      resources: [
        cmpUrlPrefix + '/js/cordova/__CMPSHELL_PLATFORM__/cordova.js',
        cmpUrlPrefix + '/js/cordova/cordova-plugins.js'
      ]
    },
    {
      name: 'cmpbase',
      async: 0,
      lazy: 0,
      resources: [
        cmpUrlPrefix + '/js/cmp.js' + version,
        cmpUrlPrefix + '/js/cmp-webviewListener.js' + version
      ]
    },
    {
      name: 'app',
      async: 0,
      lazy: 1,
      resources: [
        capUrlPrefix + '/css/iconfont.css' + version,
        capUrlPrefix + '/css/file/iconfont.css' + version,
        capUrlPrefix + '/htmls/native/form/static/css/app.cap4Form.css' + version,
        capUrlPrefix + '/htmls/native/form/static/js/app.cap4Form.js' + version
      ]
    },
    {
      name: 'interact',
      async: 1,
      lazy: 2,
      resources: [
        cmpUrlPrefix + '/css/cmp-picker.css' + version,
        cmpUrlPrefix + '/css/cmp-selectOrg.css' + version,
        cmpUrlPrefix + '/css/cmp-listView.css' + version,
        cmpUrlPrefix + '/css/cmp-audio.css' + version,
        cmpUrlPrefix + '/css/cmp-sliders.css' + version,
        cmpUrlPrefix + '/css/cmp-search.css' + version,
        cmpUrlPrefix + '/css/cmp-att.css' + version,
        cmpUrlPrefix + '/css/cmp-accDoc.css' + version,
        cmpUrlPrefix + '/js/cmp-picker.js' + version,
        cmpUrlPrefix + '/js/cmp-dtPicker.js' + version,
        cmpUrlPrefix + '/js/cmp-listView.js' + version,
        cmpUrlPrefix + '/js/cmp-imgCache.js' + version,
        cmpUrlPrefix + '/js/cmp-selectOrg.js' + version,
        cmpUrlPrefix + '/js/cmp-camera.js' + version,
        cmpUrlPrefix + '/js/cmp-att.js' + version,
        cmpUrlPrefix + '/js/cmp-lbs.js' + version,
        cmpUrlPrefix + '/js/cmp-audio.js' + version,
        cmpUrlPrefix + '/js/cmp-sliders.js' + version,
        cmpUrlPrefix + '/js/cmp-search.js' + version,
        cmpUrlPrefix + '/js/cmp-accDoc.js' + version,
        cmpUrlPrefix + '/js/cmp-barcode.js' + version,
        cmpUrlPrefix + '/js/cmp-v5.js' + version,
        collaborationUrlPrefix + '/collaboration_m_api.s3js' + version,
        v5CommonUrlPrefix + '/widget/SeeyonAttachment.s3js' + version
      ]
    }
  ];

  bootstrap(sourceChunks);

  function bootstrap(chunks) {
    var preQueue = [];
    var appQueue = [];
    var interactQueue = [];
    var queues = [ preQueue, appQueue, interactQueue ];
    chunks.forEach(function (chunk) {
      queues[ chunk.lazy ].push(chunk);
    });
    // console.time('preload');
    loadQueue(preQueue, function () {
      // console.timeEnd('preload');
      cmp.dialog.loading('数据加载中...');
      var payload = cmp.href.getParam();
      var done = function (res) {
        var hasLightForm = parseInt(res.phone) > 0;
        if (hasLightForm) {
          XForm.onPageLoad(function () {
            // console.time('appload');
            loadQueue(appQueue, function () {
              // console.timeEnd('appload');
              // console.time('lazyload');
              // 让xhr先行调用，再加载交互相关的js/css资源
              setTimeout(function () {
                loadQueue(interactQueue, function () {
                  cmp.dialog.loading(false);
                  // console.timeEnd('lazyload');
                });
              }, 100);
            });
          });
        } else {
          cmp.href.go(originFormUrl, payload, { animated: false });
        }
      };
      if (isNotFormain || !payload) return done({ phone: 1 });
      checkView({
        rightId: payload.params.rightId,
        moduleId: payload.params.moduleId,
        moduleType: payload.params.moduleType,
        formTemplateId: payload.params.formTemplateId
      }, done);
    });
  }

  function checkView(param, callback) {
    var url = 'rest/cap4/form/getFormDataRightInfo';
    var handleError = function (errMsg) {
      cmp.notification.confirm(errMsg || '获取视图数据失败', function () {
        cmp.href.back();
      }, null, [ '确定' ]);
    };
    cmp.ajax({
      type: 'POST',
      data: JSON.stringify(param),
      url: cmp.serverIp + '/seeyon/' + url,
      timeout: '30000',
      dataType: 'json',
      cmpReady2Fire: true,
      fastAjax: !window.CMPREADYMARK,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Language': 'zh-CN',
        'token': cmp.token || ''
      },
      success: function (res) {
        if (res.data.code === '2000') {
          callback(res.data.data);
        } else {
          handleError(res.message || res.data.message);
        }
      },
      error: function (err) {
        handleError(err.message);
      }
    });
  }

  function loadQueue(queue, cb) {
    var remain = queue.length;
    if (remain) {
      queue.forEach(function (chunk) {
        loadChunk(chunk, function () {
          remain--;
          if (remain <= 0) cb(queue);
        });
      });
    } else {
      cb(queue);
    }
  };

  function loadChunk(chunk, cb) {
    var remain = chunk.resources.length;
    var opts = { async: chunk.async };
    var total = remain;
    var failed = 0;
    var checkLoad = function (url, isFailed) {
      if (isFailed) {
        failed++;
        console.warn('failed to load source "' + url + '"');
      }
      // console.info('loaded ' + url + ' at ' + Date.now());
      if (--remain <= 0) {
        cb(total, failed);
      }
    };
    chunk.resources.forEach(function (url) {
      injectUrl(url, opts, checkLoad);
    });
  }

  function injectUrl(url, opts, cb) {
    url = url.replace(/^\s+|\s+$/, '');
    var req = url.replace(/[\?#].*$/, '');
    if (sourceCached[ url ] || !isApp && url.indexOf('/cordova/') > -1) {
      return cb(url);
    }
    if (req.slice(-4) === '.css') {
      var elem = document.createElement('link');
      elem.rel = 'stylesheet';
      elem.href = url;
      head.appendChild(elem);
      sourceCached[ url ] = 1;
      cb && cb(url);
    } else if (req.slice(-5) === '.s3js' || req.slice(-3) === '.js') {
      var elem = document.createElement('script');
      var done = function (err) {
        elem.onload = elem.onerror = null;
        sourceCached[ url ] = 1;
        cb && cb(url, err);
      };
      elem.onerror = function () { done(true) };
      elem.onload = function () { done() };
      if (opts.defer) {
        elem.defer = true;
      } else {
        elem.async = !!opts.async;
      }
      elem.src = url;
      head.appendChild(elem);
    } else {
      console.warn('unexpected source');
    }
  }
})();
