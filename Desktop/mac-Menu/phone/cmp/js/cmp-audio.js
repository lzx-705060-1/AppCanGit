(function(_){
    _.i18n.load(cmpBASEPATH+'/i18n/', 'cmp-audio',null,cmpBuildversion);
    //==============================================================语音组件 start====================================//
    var src = "cmp_recording.wav";//由于android也可以录wav，则全部整成wav
    if (_.os.ios) src = "documents://cmp_recording.wav";
    var cache = {};
    _.audio = {};

    /**
      *校验语音权限
     */
    _.audio.checkPermission = function(options){
        var _options = {
            success: null,//成功回调
            error: null,//错误回调
            cancel:null,//取消回调
            setFun:null//设置回调
        };
        _options = _.extend(_options, options);
        cordova.exec(
            function success(){
                _options.success && _options.success()
            },
            function error(error){
                if(error.code == 57004){//表示需要权限判断
                    turnOnPermission(_options);
                }else {
                    _options.error && _options.error(error)
                }
            },
            "Media",
            "checkPermission",
            [
                {
                }
            ]
        );
    };
    _.audio.startRecord = function (options) {
        var _options = {
            success: null,
            error: null,
            url:null
        };
        _options = _.extend(_options, options);
        src = _options.url?_options.url:src;

        if (cache[src]) {//表示上一个录制进行中
            _options.error && _options.error(new CMPError(57005, _.i18n("cmp.audio.errorMsgRecoding")));
            return;
        }
        try {
            cache[src] = new Media(src, function success() {
                _options.success && _options.success(src);
                cache[src] = null;
            }, function error(error) {
                _options.error && _options.error(error);
                cache[src] = null;
            });
            cache[src].startRecord();
        } catch (e) {
            cache[src] = null;
        }
        return cache[src];

    };

    function turnOnPermission(_options){
        _.notification.confirm(_.i18n("cmp.audio.audioPermissionTips"), function (index) {
            if (index == 0) {
                if(typeof _options.cancel == "function"){
                    _options.cancel();
                }
                return;
            } else if (index == 1) {
                cordova.exec(
                    function () {
                    },
                    function () {
                    },
                    "CMPSettingPlugin",
                    "enterSetting",
                    []
                );
                if(typeof _options.setFun == "function"){
                    _options.setFun();
                }
            }
        }, "", [_.i18n("cmp.audio.cancel"), _.i18n("cmp.audio.toSet")]);//"取消","去设置"
    }

    /**
     * 停止录音
     * @method stopRecord
     * @namespace cmp.audio
     * @param {Object} [cfg] 回调函数对象配置
     *      @param {Function} [cfg.success] 成功回调函数
     */
    _.audio.stopRecord = function (cfg) {
        if (cache[src]) {
            cache[src].stopRecord();
            cfg.success && cfg.success(src);
            cache[src] = null;
        }
    };


    /**
     * 播放录音
     * @method playVoice
     * @namespace cmp.audio
     * @param {Object} cfg 播放录音参数配置
     *      @param {String} cfg.url 播放文件地址
     *      @param {Function} [cfg.success] 成功播放完毕回调函数
     *      @param {Function} [cfg.error] 失败回调函数
     *      @param {Function} [cfg.initSuccess] 成功开始播放的回调函数
     */
    _.audio.playVoice = function (cfg) {
        var url = cfg.url;
        if (!url || url.length <= 0) {
            cfg.error && cfg.error(new CMPError(57006,_.i18n("cmp.audio.errorMsgNoPlayAddress")));
            return;
        }
        //播放需要新创建一个对象
        try {
            if (cache[url]) {
                cfg.error && cfg.error(new CMPError(57007, _.i18n("cmp.audio.errorMsgPlaying")));
                return;
            }
            cache[url] = new Media(url, function () {
                cfg.success && cfg.success(url);
                cache[url] = null;
            }, function (error) {
                cfg.error && cfg.error(error);
                cache[url] = null;
            });
            cache[url].play();
            cfg.initSuccess && cfg.initSuccess();
        } catch (e) {
            cache[url] = null;
            cfg.error && cfg.error(new CMPError(57008, _.i18n("cmp.audio.errorMsgInit")));
        }
    };

    /**
     * 停止播放
     * @method stopVoice
     * @namespace cmp.audio
     * @param {Object} obj 参数对象配置
     *      @param {String} obj.url 播放文件地址
     *      @param {Function} [obj.success] 成功回调函数
     */
    _.audio.stopVoice = function (obj) {
        var url = obj.url;
        if (cache[url]) {
            cache[url].stop();
            obj.success && obj.success(url);
            cache[url].release();
            cache[url] = null;
        }
    };
    /**
     * 获取播放时间
     * @method getDuration
     * @namespace cmp.audio
     * @param url 播放文件地址
     * @returns {number} 播放时间
     */
    _.audio.getDuration = function (url) {
        var duration = 0;
        if (cache[url]) {
            duration = cache[url].getDuration();
        }
        return duration;
    };
    //==============================================================语音组件 end======================================//



    //============================================================v5语音组件 start====================================//
    var recodeTpl =
        '<div class="win_audio">' +
        '<div class="win_audio_title">' +
        '    <span class="" id="cmp-audio-title"><%=this.title %></span>' +
        '</div>' +
        '' +
        '<div class="win_audio_cont">' +
        '    <div class="audio_cont">' +
        '        <div class="cont_radius cont_left">' +
        '            <span class="mui-icon see-icon-record-fill"></span>' +
        '            <span class="mui-icon see-icon-pause" style="display: none;"></span>' +
        '        </div>' +
        '    </div>' +
        '    <div class="audio_cont">' +
        '        <div class="cont_con">' +
        '            <span id="cmp-audio-status-text">&nbsp;</span>' +
        '            <span class="luyintime" id="luyin">00:00:00</span>' +
        '        </div>' +
        '    </div>' +
        '    <div class="audio_cont">' +
        '        <div class="cont_radius cont_right">' +
        '            <span class=" mui-icon see-icon-play"></span>' +
        '            <span class=" mui-icon see-icon-stop " style="display: none;"></span>' +
        '        </div>' +
        '    </div>' +
        '    <div class="clear_left"></div>' +
        '</div>' +
        '<div class="win_audio_sub">' +
        '    <ul>' +
        '        <li><%=this.use %></li>' +
        '        <li><%=this.cancel %></li>' +
        '    </ul>' +
        '    <div class="clear_left"></div>' +
        '</div>' +
        '</div>';

    var playTpl =
        '<div class="win_audio">' +
        '<div class="win_audio_title">' +
        '    <span class="" id="cmp-audio-title"><%=this.filename %></span>' +
        '</div>' +
        '<div class="win_audio_cont">' +
        '    <div class="audio_cont">' +
        '        <div class="cont_radius cont_left">' +
        '            <span class="mui-icon see-icon-play"></span>' +
        '        </div>' +
        '    </div>' +
        '    <div class="audio_cont">' +
        '        <div class="cont_con">' +
        '            <span id="cmp-audio-status-text">&nbsp;</span>' +
        '            <span class="luyintime" id="luyin">00:00:00</span>' +
        '        </div>' +
        '    </div>' +
        '    <div class="audio_cont">' +
        '        <div class="cont_radius cont_right">' +
        '            <span class=" mui-icon see-icon-stop"></span>' +
        '        </div>' +
        '    </div>' +
        '    <div class="clear_left"></div>' +
        '</div>' +
        '<div class="win_audio_sub play">' +
        '    <ul>' +
        '        <li><%=this.close %></li>' +
        '    </ul>' +
        '    <div class="clear_left"></div>' +
        '</div>' +
        '</div>';



    /**
     * 录音组件构造函数
     * @param options
     * @constructor
     */
    function Audio(options) {
        this.options = options;
        this.text = _.extend({
            use:_.i18n("cmp.audio.use"),
            title:_.i18n("cmp.audio.title"),
            cancel:_.i18n("cmp.audio.cancel"),
            close:_.i18n("cmp.audio.close"),
            filename:_.i18n("cmp.audio.filename")
        }, options.text);
        this.onlyPlay = options.onlyPlay ? true:false;
        this._src = "";
        this._initDom();
        if(this.onlyPlay){
            this._bindOnlyPlayEvent();
        }else {
            this._bindEvent();
        }



        //this._initAudio();
    }

    /**
     * 初始化dom结构和查找dom
     * @private
     */
    Audio.prototype._initDom = function () {
        var self = this;
        var wrapper = document.createElement("div");
        wrapper.id = "cmp-w-audio";
        wrapper.className = "cmp-audio-bg";

        var tplStr = self.onlyPlay?playTpl:recodeTpl;
        wrapper.innerHTML = cmp.tpl(tplStr, self.text);
        self.wrapper = document.querySelector("#cmp-w-audio");
        if (self.wrapper) {
            document.body.removeChild(wrapper);
            self.wrapper = null;
        }
        document.body.appendChild(wrapper);
        self.wrapper = document.querySelector("#cmp-w-audio");
        self.wrapper.style.display = "-webkit-box";

        self.audioTitleView = self.wrapper.querySelector(".win_audio_title");
        self.audioTitleText = self.audioTitleView.querySelector("#cmp-audio-title");

        self.audioRecodView = self.wrapper.querySelector(".cont_left");
        self.audioRecodStartBtn = self.audioRecodView.querySelector(".see-icon-record-fill");
        self.audioRecodStopBtn = self.audioRecodView.querySelector(".see-icon-pause");

        self.audioPlayView = self.wrapper.querySelector(".cont_right");
        self.audioPlayView.classList.remove("cont_right");
        self.audioPlayStartBtn = self.audioPlayView.querySelector(".see-icon-play") || self.wrapper.querySelector(".see-icon-play");
        self.audioPlayStopBtn = self.audioPlayView.querySelector(".see-icon-stop") || self.wrapper.querySelector(".see-icon-stop");

        self.audioSubView = self.wrapper.querySelector(".win_audio_sub");
        var subBtns = self.audioSubView.querySelectorAll("li");
        self.audioSubUseBtn = subBtns[0];
        self.audioSubCloseBtn =self.audioSubUseBtn;
        if(subBtns.length > 1){
            self.audioSubCancelBtn = subBtns[1];
        }

        self.audioStatusView = self.wrapper.querySelector("#cmp-audio-status-text");
        self.audioTimerView = self.wrapper.querySelector(".luyintime");
        if(self.onlyPlay) {
            self._setVoiceFileDuration(self.options.filepath);
            var closeOnlyPlayFun = function(){
                self._closeOnlyPlay();
            };
            _.backbutton.push(closeOnlyPlayFun);
        }else {
            var closeRecordAndPlayFun = function(){
                self._closeRecordAndPlay();
            };
            _.backbutton.push(closeRecordAndPlayFun);
        }

    };
    Audio.prototype._setVoiceFileDuration = function(url){
        var self = this;
        var voiceFile = new Media(url, function () {
            var dur = voiceFile.getDuration();
            if (dur && dur > 0) {
                self.voiceFileDuration = dur;
                self._setAudioTimeView(formatNumberToTimeStr(dur));
            }
        }, function (error) {
        });
        voiceFile.play();
        voiceFile.stop();
    };

    /**
     * 绑定事件
     * @private
     */
    Audio.prototype._bindEvent = function () {
        var self = this;
        //播放开始按钮
        _.event.click(self.audioPlayStartBtn,function () {
            if (!self.audioPlayView.classList.contains("cont_right")) return;
            _.audio.playVoice({
                url: self._src,
                initSuccess: function () {
                    setStyle(self.audioPlayStartBtn, "none");
                    setStyle(self.audioPlayStopBtn, "block");
                    self.audioRecodView.classList.remove("cont_left");
                    self._initTimeShow(self._src);
                },
                success: function (_url) {
                    setStyle(self.audioPlayStopBtn, "none");
                    setStyle(self.audioPlayStartBtn, "block");
                    self.audioRecodView.classList.add("cont_left");
                    self._clearTimer();
                }, error: function (e) {
                    cmp.notification.alert(e.msg);
                    self._clearTimer();
                }
            });
        });

        //播放停止按钮
        _.event.click(self.audioPlayStopBtn,function(){
            if (!self.audioPlayView.classList.contains("cont_right")) return;
            _.audio.stopVoice({
                url: self._src,
                success: function (_url) {
                    setStyle(self.audioPlayStopBtn, "none");
                    setStyle(self.audioPlayStartBtn, "block");
                    self.audioRecodView.classList.add("cont_left");
                    self._clearTimer();
                    self._setAudioTimeView();
                }
            });
        });

        //录音开始按钮
        _.event.click(self.audioRecodStartBtn,function () {
            if (!self.audioRecodView.classList.contains("cont_left")) return;
            self.audioPlayView.classList.remove("cont_right");
            var recodinguuid = _.buildUUID();
            src = _.os.android?"cmp_recording_"+recodinguuid+".wav":cordova.file.tempDirectory + "cmp_recording"+recodinguuid+".wav";//改变保存地址,每一次录音开始都重新生成一个录音文件
            var recordObj = _.audio.startRecord({
                success: function (src) {
                    self._clearTimer();
                    self.audioPlayView.classList.add("cont_right");
                }, error: function (e) {
                    self._clearTimer();
                }
            });
            if (recordObj) {
                setStyle(self.audioRecodStartBtn, "none");
                setStyle(self.audioRecodStopBtn, "block");
                self._initTimer(0);
            } else {
                cmp.notification.alert(_.i18n("cmp.audio.cantRecode"),null,_.i18n("cmp.audio.tips"),_.i18n("cmp.audio.ok"));
            }
        });

        //录音结束按钮
        _.event.click(self.audioRecodStopBtn,function(){
            if (!self.audioRecodView.classList.contains("cont_left")) return;
            setStyle(self.audioRecodStopBtn, "none");
            setStyle(self.audioRecodStartBtn, "block");
            _.audio.stopRecord({
                success: function (src) {
                    self._src = _.os.android?cordova.file.externalRootDirectory + src : src;
                    self.audioPlayView.classList.add("cont_right");
                    self._clearTimer();
                }
            });
        });

        //使用按钮
        _.event.click(self.audioSubUseBtn,function(){
            if (self._src && self._src.length > 0) {
                self.options.callback(self._src);
                self._closeRecordAndPlay(self._src);
                self._setAudioTimeView();
                setStyle(self.audioRecodStopBtn, "none");
                setStyle(self.audioRecodStartBtn, "block");
            } else {
                self.wrapper.style.display = "none";
                cmp.notification.alert(_.i18n("cmp.audio.recoding"),function(){
                    self.wrapper.style.display = "-webkit-box";
                },_.i18n("cmp.audio.tips"),_.i18n("cmp.audio.ok"));
            }
        });

        //取消按钮
        _.event.click(self.audioSubCancelBtn,function(){
            self._closeRecordAndPlay();
            self.options.cancelCallback();
        });
    };
    Audio.prototype._bindOnlyPlayEvent = function(){
        var self = this;
        var voiceFileSrc = self.options.filepath;

        //播放开始按钮
        self.audioPlayStartBtn.addEventListener("tap", function () {
            if(self.audioPlayStartBtn.classList.contains("played")) return;
            self.audioRecodView.classList.add("cont_left");
            self.audioPlayView.classList.remove("cont_right");
            self.audioPlayStartBtn.classList.remove('see-icon-play');
            self.audioPlayStartBtn.classList.add('see-icon-pause');
            _.audio.playVoice({
                url: voiceFileSrc,
                initSuccess: function () {
                    self._initTimeShow(voiceFileSrc);
                },
                success: function (_url) {
                    self._clearTimer();
                    self.audioPlayStartBtn.classList.remove("played");
                    self.audioPlayStartBtn.classList.add('see-icon-play');
                    self.audioPlayStartBtn.classList.remove('see-icon-pause');
                }, error: function (e) {
                    _.notification.alert(e.msg);
                    self._clearTimer();
                }
            });
            self.audioPlayStartBtn.classList.add("played");
        }, false);


        //播放停止按钮
        self.audioPlayStopBtn.addEventListener("tap", function () {
            self.audioRecodView.classList.remove("cont_left");
            self.audioPlayView.classList.add("cont_right");
            _.audio.stopVoice({
                url: voiceFileSrc,
                success: function (_url) {
                    self._clearTimer();
                    self._setAudioTimeView(formatNumberToTimeStr(self.voiceFileDuration));
                    self.audioPlayStartBtn.classList.remove("played");
                }
            });
        }, false);
        //关闭按钮
        self.audioSubCloseBtn.addEventListener("tap", function () {
            self._closeOnlyPlay();
        }, false)
    };
    Audio.prototype._closeRecordAndPlay = function(){
        var self = this;
        self._clearTimer();
        try {
            _.audio.stopRecord();
            _.audio.stopVoice({url: self._src});
        } catch (e) {
        }
        self._src = "";
        self.wrapper.remove();
        _.backbutton.pop();
    };
    Audio.prototype._closeOnlyPlay = function(){
        var self = this;
        self._clearTimer();
        try {
            _.audio.stopVoice({url: self.options.filepath});
            self.audioPlayStartBtn.classList.remove("played");
        } catch (e) {
        }
        self.wrapper.remove();
        _.backbutton.pop();
    };
    /**
     * 初始化播放的时间显示
     * @param url
     * @private
     */
    Audio.prototype._initTimeShow = function (url) {
        var self = this;
        var counter = 0;
        var timerDur = setInterval(function () {
            counter = counter + 100;
            if (counter > 2000) {
                clearInterval(timerDur);
            }
            var dur = _.audio.getDuration(url);
            if (dur > 0) {
                clearInterval(timerDur);
                self._initTimer(dur);
            }
        }, 100);
    };

    Audio.prototype._setAudioTimeView = function (str) {
        var self = this;
        self.audioTimerView.innerHTML = str || "00:00:00";
    };


    /**
     * 初始化计时器
     * @private
     */
    Audio.prototype._initTimer = function (num) {
        var self = this, isAdd = (num == 0);

        function timer() {
            if (num < 0) num = 0;
            self._setAudioTimeView(formatNumberToTimeStr(num));

            if (isAdd) {
                num++;
            } else {
                num--;
            }
        }

        timer();
        self.timer = window.setInterval(timer, 1000);
    };

    /**
     * 清除时间计数器
     * @private
     */
    Audio.prototype._clearTimer = function () {
        var self = this;
        window.clearInterval(self.timer);
    };

    /**
     * 设置style属性
     * @param elem
     * @param display
     */
    function setStyle(elem, display) {
        if (display) {
            elem.style.display = display;
        }
    }

    /**
     * 将数字转换成00:00:00格式
     * @param num
     * @returns {string}
     */
    function formatNumberToTimeStr(num) {
        var hour = Math.floor(num / 60 / 60),
            minute = Math.floor(num / 60 % 60),
            second = Math.floor(num % 60);
        return (getTwoLength(hour) + ":" + getTwoLength(minute) + ":" + getTwoLength(second));
    }

    /**
     * 将个位数数字加0占位
     * @param data
     * @returns {*}
     */
    function getTwoLength(data) {
        if (data.toString().length <= 1) return '0' + data;
        return data;
    }


    /**
     *
     * @param options
     * @returns {Audio}
     */
    _.audio.init = function (options) {

        var _options = {
            callback: function () {
            },
            cancelCallback: function () {

            }
        };

        _options = _.extend(_options, options);

        return new Audio(_options);
    };

    _.audio.play = function(options){
        var _options = _.extend({
            filepath:null
        },options);
        _options.onlyPlay = true;
        _options.text = {
            filename:options.filename
        };
        return new Audio(_options);
    };
    //============================================================v5 语音组件 end====================================//
})(cmp);

