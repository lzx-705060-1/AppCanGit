(function(m3){
    var v5AppBasePath = "/seeyon/m3/apps/v5";//此路径需要写一个小的s3js文件来合并进行路径替换
    m3.appMap = {
        app_1:{
            "package":v5AppBasePath + "/collaboration",
            "phone":"/html/colAffairs.html",
            "jsapi":"collaboration_m_api.s3js",
            "openAppMethod":"collApi.openApp"
        },
        app_3:{
            "package":v5AppBasePath + "/doc",
            "phone":"/html/docIndex.html",
            "jsapi":"doc_m_api.s3js",
            "openAppMethod":"docApi.openApp"
        },
        app_4:{
            "package":v5AppBasePath + "/edoc",
            "phone":"/html/edocList.html",
            "jsapi":"edoc_m_api.s3js",
            "openAppMethod":"edocApi.openApp"
        },
        app_6:{
            "package":v5AppBasePath + "/meeting",
            "phone":"/html/meeting_list_pending.html",
            "jsapi":"meeting_m_api.s3js",
            "openAppMethod":"meetingApi.openApp"
        },
        app_7:{
            "package":v5AppBasePath + "/bulletin",
            "phone":"/html/bulIndex.html",
            "jsapi":"bulletin_m_api.s3js",
            "openAppMethod":"bulletinApi.openApp"
        },
        app_8:{
            "package":v5AppBasePath + "/news",
            "phone":"/html/newsIndex.html",
            "jsapi":"news_m_api.s3js",
            "openAppMethod":"newsApi.openApp"
        },
        app_9:{
            "package":v5AppBasePath + "/bbs",
            "phone":"/html/bbsIndex.html",
            "jsapi":"bbs_m_api.s3js",
            "openAppMethod":"bbsApi.openApp"
        },
        app_10:{
            "package":v5AppBasePath + "/inquiry",
            "phone":"/html/inquiryIndex.html",
            "jsapi":"inquiry_m_api.s3js",
            "openAppMethod":"inquiryApi.openApp"
        },
        app_11:{
            "package":v5AppBasePath + "/calendar",
            "phone":"/html/timeArrange.html",
            "jsapi":"calendar_m_api.s3js",
            "openAppMethod":"calendarApi.openApp"
        },
        app_17:{
            "package":v5AppBasePath + "/hr",
            "phone":"/html/hrSalary.html",
            "jsapi":"hr_m_api.s3js",
            "openAppMethod":"hrApi.openApp"
        },
        app_26:{
			"package":v5AppBasePath + "/office",
            "phone":"/html/office.html",
            "jsapi":"office_m_api.s3js",
            "openAppMethod":"officeApi.openApp"
        },
        app_30:{
            "package":v5AppBasePath + "/taskmanage",
            "phone":"/html/task_index.html",
            "jsapi":"taskmanage_m_api.s3js",
            "openAppMethod":"taskmanageApi.openApp"
        },
        app_36:{
            "package":v5AppBasePath + "/attendance",
            "phone":"/html/attendanceIndex.html",
            "jsapi":"attendance_m_api.s3js",
            "openAppMethod":"attendanceApi.openApp"
        },
        app_40:{
            "package":v5AppBasePath + "/show",
            "phone":"/html/showIndex.html",
            "jsapi":"show_m_api.s3js",
            "openAppMethod":"showApi.openApp"
        },
        app_42:{
            "package":v5AppBasePath + "/footprint",
            "phone":"/html/footPrintIndex.html",
            "jsapi":"footprint_m_api.s3js",
            "openAppMethod":"footprintApi.openApp"
        },
        app_60:{
            "package":v5AppBasePath + "/mycollection",
            "phone":"/html/mycollectionIndex.html",
            "jsapi":"mycollection_m_api.s3js",
            "openAppMethod":"mycollectionApi.openApp"
        },
        app_61:{
            "package":v5AppBasePath + "/uc",
            "phone":"/html/ucIndex.html",
            "jsapi":"uc_m_api.s3js",
            "openAppMethod":"ucApi.openApp"
        },
        app_63:{
            "package":v5AppBasePath + "/seeyonreport",
            "phone":"/html/index.html",
            "jsapi":"seeyonreport_m_api.s3js",
            "openAppMethod":"seeyonreportApi.openApp"
        }
    };
    m3.appIcon = {
        "newcoll": {
            "icon": "see-icon-m3-coordination-fill",
            "css": "teamwork msgsCommon",
            "text": "todo.m3.h5.newCoordination"
        },
        "newpage": {
            "icon": "see-icon-m3-formTemplate",
            "css": "auditing msgsCommon",
            "text": "todo.m3.h5.newFormCollaboration"
        },
        "scanner": {
            "icon": "see-icon-m3-scan",
            "css": "scan",
            "text": "todo.m3.h5.scanIt"
        },
        "sendmessage": {
            "icon": "see-icon-m3-groupcommunication",
            "css": "talk",
            "text": "todo.m3.h5.groupCommunication"
        },
        "sendingmatter": {
            "icon": "see-icon-m3-planmatter-fill",
            "css": "planmatter msgsCommon",
            "text": "todo.m3.h5.pendingMatters"
        },
        "sendmatter": {
            "icon": "see-icon-m3-sendedmatter-fill",
            "css": "sendedmatter msgsCommon",
            "text": "todo.m3.h5.sentItems"
        },
        "donematter": {
            "icon": "see-icon-m3-finishedmatter-fill",
            "css": "finishedmatter msgsCommon",
            "text": "todo.m3.h5.hasBeenDone"
        },
        "holdmeeting": {
            "icon": "see-icon-m3-openedmeeting-fill",
            "css": "openedmeeting msgsCommon",
            "text": "todo.m3.h5.willHoldMeeting"
        },
        "createTask": {
            "icon": "see-icon-m3-mission-fill",
            "css": "createTask msgsCommon",
            "text": "todo.m3.h5.createTask"
        },
        "createMeeting": {
            "icon": "see-icon-m3-createMeeting",
            "css": "createMeeting msgsCommon",
            "text": "todo.m3.h5.createMeeting"
        },
        "meetingRoom": {
            "icon": "see-icon-m3-meetingRoom-fill",
            "css": "meetingRoom msgsCommon",
            "text": "todo.m3.h5.meetingRoom"
        },
        "checkIn": {
            "icon": "see-icon-m3-sign",
            "css": "sign msgsCommon",
            "text": "todo.m3.h5.sign"
        },
        "appid_10": {
            "icon": "see-icon-m3-research",
            "css": "inquiry",
            "text": "todo.m3.h5.inquiry"
        },
        "appid_100": {
            "icon": "see-icon-m3-research",
            "css": "inquiry",
            "text": "todo.m3.h5.inquiry"
        },
        "appid_101": {
            "icon": "see-icon-m3-research",
            "css": "inquiry",
            "text": "todo.m3.h5.inquiry"
        },
        "appid_102": {
            "icon": "see-icon-m3-research",
            "css": "inquiry",
            "text": "todo.m3.h5.inquiry"
        },
        "appid_3": {
            "icon": "see-icon-m3-file",
            "css": "doc",
            "text": "todo.m3.h5.documentation"
        },
        "appid_4": {
            "icon": "see-icon-m3-document",
            "css": "edoc",
            "text": "todo.m3.h5.document"
        },
        "appid_6": {
            "icon": "see-icon-m3-meeting-fill",
            "css": "metting",
            "text": "todo.m3.h5.meeting"
        },
        "appid_65": {
            "icon": "see-icon-m3-meeting-fill",
            "css": "metting",
            "text": "todo.m3.h5.meeting"
        },
        "appid_66": {
            "icon": "see-icon-m3-meeting-fill",
            "css": "metting",
            "text": "todo.m3.h5.meeting"
        },
        "appid_67": {
            "icon": "see-icon-m3-meeting-fill",
            "css": "metting",
            "text": "todo.m3.h5.meeting"
        },
        "appid_68": {
            "icon": "see-icon-m3-meeting-fill",
            "css": "metting",
            "text": "todo.m3.h5.meeting"
        },
        "appid_1": {
            "icon": "see-icon-m3-coordination-fill",
            "css": "collaboration",
            "text": "todo.m3.h5.coordination"
        },
        "appid_7": {
            "icon": "see-icon-m3-notice-fill",
            "css": "bulletin",
            "text": "todo.m3.h5.bulletin"
        },
        "appid_8": {
            "icon": "see-icon-m3-new-fill",
            "css": "news",
            "text": "todo.m3.h5.news"
        },
        "appid_9": {
            "icon": "see-icon-m3-talk",
            "css": "talk",
            "text": "todo.m3.h5.discuss"
        },
        "appid_40": {
            "icon": "see-icon-m3-show-fill",
            "css": "show",
            "text": "todo.m3.h5.bigshow"
        },
        "appid_260": {
            "icon": "see-icon-m3-integratedoffice-fill",
            "css": "car",
            "text": "todo.m3.h5.car"
        },
        "appid_261": {
            "icon": "see-icon-m3-integratedoffice-fill",
            "css": "supplies",
            "text": "todo.m3.h5.supplies"
        },
        "appid_262": {
            "icon": "see-icon-m3-integratedoffice-fill",
            "css": "equipment",
            "text": "todo.m3.h5.equipment"
        },
        "appid_263": {
            "icon": "see-icon-m3-integratedoffice-fill",
            "css": "books",
            "text": "todo.m3.h5.books"
        }
    };
})(m3);
