//根据平台判断header是否隐藏
function headerShowOrNot() {
    document.body.removeChild(document.getElementById("shadow"));
}

/**
 * 简化选择器
 * @param selector 选择器
 * @param queryAll 是否选择全部
 * @param 父节点
 * @returns
 */
function _$(selector, queryAll, pEl) {

    var p = pEl ? pEl : document;

    if (queryAll) {
        return p.querySelectorAll(selector);
    } else {
        return p.querySelector(selector);
    }
}

/**
 * 获取面包屑的宽度
 */
function breadLength() {
    var len = _$("#breadcrumb").clientWidth + 120;
    bread(len);
}

/**
 * 面包屑滚动
 * @param b_width 面包屑宽度
 */

function bread(b_width) {
    var boxscrolll = _$("#boxscrolll");
    var scroll = boxscrolll.querySelector('.cmp-scroll');
    scroll.style.width = b_width + "px"; // 这里宽度需要动态计算
    is_scroll.refresh();
	is_scroll.scrollTo(-(is_scroll.scrollerW),0);
}

/**
 * 字节大小转换
 */
function bytesToSize(bytes) {
	bytes = parseInt(bytes);
    if (bytes === 0)
        return "0 B";
    var k = 1024,
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math
        .floor(Math.log(bytes) / Math.log(k));
    return parseInt((bytes / Math.pow(k, i)).toPrecision(3)) + sizes[i];
}

/**
 * 根据文件后缀判断是否可以打开
 * @param fr_name
 */
function canOpen(fr_name, flag) {
    var suffix = "";
    if (fr_name.lastIndexOf(".mp3") > 0) {
        if (flag) {
            suffix = ".mp3"
            return suffix;
        } else {
            return true;
        }
    } else if (fr_name.lastIndexOf(".mp4") > 0) {
        if (flag) {
            suffix = ".mp4";
            return suffix;
        } else {
            return true;
        }
    } else if (fr_name.lastIndexOf(".amr") > 0) {
        if (flag) {
            suffix = ".amr";
            return suffix;
        } else {
            return true;
        }
    } else {
        if (flag) {
            return suffix;
        } else {
            return false;
        }
    }
}

//返回事件
function prevPage(value) {
    /*cmp("header").on('tap', "#prev", function(e) {
    	value();
    });*/
    cmp.backbutton();
    cmp.backbutton.push(value);
}