(function(_){
    //=============================================================滚动额外：图片懒加载+保存到本地 start==============//
    imgCacheConstant = {
        C_iImgType_general:1,
        C_iImgType_v5:2
    };
    var imgCache = function(container,opts){
        var self = this;
        self.container = (typeof container == "object")?container:document.querySelector(container);
        if(!self.container) throw "you must defined a container to fill in image";
        self.opts = _.extend({
            imgCache:true, //是否启用将图片保存到手机本地
            _scroll:false,
            type:1, //图片资源类型（1，任何图片，2:，v5格式的人员头像图片）
            offset:{  //图片检测范围默认：x=0，y=0
                x:null,
                y:null
            }
        },opts);
        self.ranger = [];
        self.imgs = null;
        self.loaded = [];
        self.allowance = {};
        self.v5Path = (self.opts.type == imgCacheConstant.C_iImgType_v5)?self._getV5Path():"";
        self.token = _.storage.get("CMP_V5_TOKEN");
        self.defaultImg = cmpIMGPath + "/ic_load_failed.png";
        self.fileProtocol = _.os.ios?"fileImage://":"file://";
        self.downloadCache = [];
        self._init();
    };
    imgCache.prototype._getV5Path = function(){
        return {
            department:_.origin +"/rest/orgMember/groupavatar",
            member:_.origin + "/rest/orgMember/avatar"
        };
    };
    imgCache.prototype._init = function(){
        var self = this;
        self.ranger = self._setRange();
        self.imgs = self._getImgs();
        if(!self.opts._scroll) {
            self._bindCheck();
        }
    };
    imgCache.prototype._setRange = function(){
        var self = this;
        var container = self.container;
        self.allowance = self._getAllowance(container);
        var width = container.offsetWidth,height = container.offsetHeight,
            y = (container.scrollTop),x = (container.scrollLeft),
            windowWidth = window.innerWidth,windowHeight =  CMPFULLSREENHEIGHT< window.innerHeight?window.innerHeight:CMPFULLSREENHEIGHT;
        return [x,y,windowWidth,windowHeight];
    };
    imgCache.prototype._getImgs = function(){
        var self = this;
        var list = self.container.querySelectorAll(".cmp-img-cache");
        var imgs = [],i = 0,len = list.length;
        for(;i < len; i ++) {
            imgs.push(list[i]);
        }
        return imgs;
    };
    imgCache.prototype._check = function(scrollX,scrollY){
        var self = this;
        var i = 0,len = self.imgs.length,

            top = scrollY ?-scrollY :document.body.scrollTop,
            left = scrollX ?-scrollX : document.body.scrollLeft;
        var offsetX = (self.opts.offset != null)?self.opts.offset.x:0;
        var offsetY = (self.opts.offset != null)?self.opts.offset.y:0;
        var windowHeight = CMPFULLSREENHEIGHT< window.innerHeight?window.innerHeight:CMPFULLSREENHEIGHT;
        for(;i<len; i ++) {
            var img = self.imgs[i],key = img.getAttribute("cmp-data");
            // if(self._isContain(key,self.loaded)) continue;
            var x = _.getLeft(img),y = _.getTop(img);
            var spot = {
                x:x - left - offsetX,
                y:y - top-offsetY,
                xx:x + img.offsetWidth - left - (self.allowance.pl + self.allowance.ml+20) -offsetX,
                yy:y + img.offsetHeight - top -(self.allowance.pt + self.allowance.mt +20)-offsetY-windowHeight/3
            };
            if(spot.x >= self.ranger[0] && spot.y >= self.ranger[1] && spot.xx < self.ranger[2] && spot.yy < self.ranger[3]) {
                if(self.opts.type == imgCacheConstant.C_iImgType_general) {
                    self._load(img);
                }else if(self.opts.type == imgCacheConstant.C_iImgType_v5) {
                    self._load4V5(img);
                }

                self.loaded.push(key);
            }
        }
    };
    imgCache.prototype._load = function(img){
        var self = this;
        var src = img.getAttribute("cmp-data");
        if(src){
            self._setImg(img,src);
        }
    };
    imgCache.prototype._load4V5 = function(img){
        var self = this;
        var data = img.getAttribute("cmp-data");
        if(data && typeof data != "undefined"){
            var src;
            if(data.indexOf("|") != -1){
                var params = data.split("|");
                src = self.v5Path.department + "?groupId=" + params[0] + "&groupName=" + params[1] +"&maxWidth=200";
                if(_.token){
                    src += "&token=" + _.token;
                }
                src = encodeURI(encodeURI(src));
            }else {
                src = self.v5Path.member + "/" + data + "?maxWidth=200";
            }
            self._setImg(img,src);
        }
    };
    imgCache.prototype._setImg = function(img,src,key){
        var self = this;
        var nodeType = img.tagName.toLocaleLowerCase();
        var getKey = (typeof key != "undefined")?key:src;
        if(nodeType == "img") {
            img.onerror = function(e){ //图片被删除的情况
                this.src = self.defaultImg;
                this.onerror = null;//当默认错误图片也不存在的时候防止一直触发onerror
                if(_.storage.get(getKey)) _.storage.delete(getKey);
            };
            img.onload = function(){
//                img.classList.add("cmp-cache-img-show");
            };
            img.src = src;
            img.classList.remove("cmp-img-cache");
            img.removeAttribute("cmp-data");
        }else {
            var newImg = new Image();
            newImg.onerror = function(){
                this.src = self.defaultImg;
                this.onerror = null;//当默认错误图片也不存在的时候防止一直触发onerror
                if(_.storage.get(getKey)) _.storage.delete(getKey);
            };
            newImg.onload = function(){
//                newImg.classList.add("cmp-cache-img-show");
                img.parentNode.insertBefore(newImg,img.nextSibling);
                img.parentNode.removeChild(img);
            };
            newImg.width = img.offsetWidth;
            newImg.height = img.offsetHeight;
            newImg.src = src;

        }
    };
    imgCache.prototype._bindCheck = function(){
        var self = this;
        self._check();
        self.container.addEventListener("touchend",function(){
            self._check();
        },false);
    };
    imgCache.prototype._getAllowance = function(obj){
        var self = this;
        var paddingTop = self._getCss(obj,"paddingTop"),
            paddingLeft = self._getCss(obj,"paddingLeft"),
            marginTop = self._getCss(obj,"marginTop"),
            marginLeft = self._getCss(obj,"marginLeft");
        paddingTop = (paddingTop.indexOf("px") > -1) ? parseInt(paddingTop.replace("px","")):parseInt(paddingTop);
        paddingLeft = (paddingLeft.indexOf("px") > -1) ? parseInt(paddingLeft.replace("px","")):parseInt(paddingLeft);
        marginTop = (marginTop.indexOf("px") > -1) ? parseInt(marginTop.replace("px","")):parseInt(marginTop);
        marginLeft = (marginLeft.indexOf("px") > -1) ? parseInt(marginLeft.replace("px","")):parseInt(marginLeft);
        return {
            pt:paddingTop,
            pl:paddingLeft,
            mt:marginTop,
            ml:marginLeft
        }
    };
    imgCache.prototype._getCss = function(obj,attr) {
        if(obj.currentStyle){
            return obj.currentStyle[attr];
        }
        else{
            return document.defaultView.getComputedStyle(obj,null)[attr];
        }
    };
    /**
     * 判断某个元素是否在数组里
     * @param item
     * @param array
     * @returns {boolean}
     * @private
     */
    imgCache.prototype._isContain = function(item,array){
        var i = 0,len = array.length;
        for(;i < len; i ++) {
            if(item == array[i]) return true;
        }
        return false;
    };
    imgCache.prototype.inspect = function(scrollX,scrollY){
        var self = this;
        self.imgs = self._getImgs();
        self._check(scrollX,scrollY);
    };
    _.imgCache = function(container,opts) {
        return new imgCache(container,opts);
    };

    var IMGPAGE = {};
    _.IMG = {
        detect:function(){
            if(!IMGPAGE["xxx123456789xxx"]) {
                IMGPAGE["xxx123456789xxx"] = _.imgCache(document.body,{type:2});
                IMGPAGE["xxx123456789xxx"].inspect();
            }else {
                IMGPAGE["xxx123456789xxx"].inspect();
            }
        }
    };
    //=============================================================滚动额外：图片懒加载+保存到本地 end==============//
})(cmp);