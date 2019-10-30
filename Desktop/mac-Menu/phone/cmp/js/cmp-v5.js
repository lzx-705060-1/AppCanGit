/**
 * 主要适配v5业务数据的一些公用工具
 */

(function(_){
    _.v5 = {};
    //判断是否是文档中心选出来的可穿透的文档，如果协同、会议等
    _.v5.att_canPenetration4Doc = function(frType,realFile){
        var canPenetration = false;
        try{
            frType = parseInt(frType);
            if(frType == 1//协同
                || frType == 9//表单
                || frType == 2//公文
                || frType == 4//会议
                || frType == 5//新闻
                || frType == 6//公告
                || frType == 7//调查
                || frType == 8//讨论
                || frType == 51//映射文件
                || frType == 21){//附件类文档
                canPenetration = true;
            }
            if(realFile && frType == 21) canPenetration = false;//如果是在附件组件里面的，则不能穿透，而是直接查看或下载
        }catch(e){}

        return canPenetration;
    };

    _.v5.att_canSee4DocFile = function(frType){
        var canSee = false;
        frType = parseInt(frType);
        if((frType>=101&&frType<=122)||(frType>=21&&frType<=26)){  //文档中心选中的附件类
            canSee = true;
        }
        return canSee;
    };

    _.v5.att_transeDocData4Penetration = function(docData){  //todo 这个转换需要放进v5的公共方法里面，年后做，cmp组件不做转换
        var obj = {};
        obj.attachment_id = "";
        obj.attachment_reference ="";
        obj.attachment_subReference ="Doc1";
        obj.attachment_category = "1";
        obj.attachment_type = "2";
        obj.attachment_filename = docData.fr_name;
        obj.attachment_mimeType ="km";
        var nowDate = new Date().format("yyyy-MM-dd hh:mm:ss");
        obj.attachment_createDate = nowDate;
        obj.attachment_size = "0";
        obj.attachment_fileUrl =docData.fr_id;
        obj.attachment_description =docData.fr_id;
        obj.attachment_needClone ="false";
        obj.attachment_extReference ="";
        obj.attachment_extSubReference ="";
        var backData = [];
        backData.push(obj);
        var rObj = {};
        rObj.docs = backData;
        rObj.description = docData.fr_id;
        rObj.mimeType = "km";
        return rObj;
    };
    _.v5.att_transeEdocData4Penetration = function(edocData){
        return _.extend({
            mimeType:"edoc",
            description:edocData.affairId
        },edocData);
    };

    /**
     * 获取文档中心文档后缀
     * @param frType文档类型
     * @param frName文档名称
     * @returns {*}
     */
    _.v5.att_getExtension4DocFile = function(doc){
        var extension = "";
        var frType = parseInt(doc.fr_type),frName = doc.fr_name,mineType=parseInt(doc.fr_mine_type);
        switch (frType){
            case 1://协同
                extension = ".collaboration";
                break;
            case 2://公文
                extension = ".edoc";
                break;
            case 4://会议
                extension = ".meeting";
                break;
            case 5://新闻
                extension = ".news";
                break;
            case 6://公告
                extension = ".bulletin";
                break;
            case 7://调查
                extension = ".inquiry";
                break;
            case 8://讨论
                extension = ".bbs";
                break;
            case 9://表单
                extension = ".form";
                break;
            case 10://邮件
                extension = ".mail";
                break;
            case 15://信息报送
                extension = ".info";
                break;
            case 21://文件
                extension = frName;//文件类型直接传文件名进行后缀解析
                if(mineType){
                    switch (mineType){
                        case 22:
                            extension = ".html";
                            break;
                        case 23:
                            extension = ".doc";
                            break;
                        case 24:
                            extension = ".xml";
                            break;
                        case 25:
                        case 26:
                            extension = ".wps";
                            break;
                    }
                }
                break;
            case 22://A6文档
                extension = ".htm";
                break;
            case 23://word文档
            case 25://wps word文档
            case 101://word 文件
                extension = ".doc";
                break;
            case 24://excel文档
            case 26:// wps excel文档
            case 102://excel文件
                extension = ".xml";
                break;
            case 51://映射文件
                extension = ".link";
                break;
            case 103://pdf文件
                extension = ".pdf";
                break;
            case 104://ppt文件
                extension = ".ppt";
                break;
            case 105://txt文件
                extension = ".txt";
                break;
            case 106://bmp文件
            case 109://gif
            case 112://png
            case 117://jpg
            case 118://jpeg
                extension = ".img";
                break;
            case 107://html
            case 108://htm
                extension = ".html";
                break;
            case 110://mpg
            case 111://pcx
            case 113://rm
            case 114://tga
            case 122://exe
                extension = "";
                break;
            case 115://tif
                extension = ".tif";
                break;
            case 116://zip
            case 119://rar
                extension = ".rar";
                break;
            case 120://rar
                extension = ".et";
                break;
            case 121://wps
                extension = ".wps";
                break;
            default:
                break;

        }
        return extension;
    }
})(cmp);
