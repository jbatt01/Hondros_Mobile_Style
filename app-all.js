/*
Copyright(c) 2012 Rapid Intake
*/
var g_sessiontime = 0;
db = openDatabase("scorm", "0.1", "Fake SCORM data.", 200000);
if(!db){
    alert("Failed to connect to database.");
}
else{
    try{
        // Get datachunk now
        db.transaction(
            function(tx) {
                tx.executeSql("SELECT scorm.data FROM scorm WHERE id = ?", ['courseId'], 
                    function(tx, result) {
                        for(var i = 0; i < result.rows.length; i++) {
                            g_projectID = result.rows.item(i)['data'];
                        }
                }, sql_error)
            }
        );
    }catch(e){
        console.log("Project Id not found");
    }
    
    
    
    g_strID = new Array();
    g_typeId = new Array();
    g_obj = new Array();
    
    // Main Scorm Table
    db.transaction(
        function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS scorm (id TEXT, type TEXT, quizid TEXT DEFAULT NULL, questionid TEXT DEFAULT NULL, data TEXT, timestamp REAL, PRIMARY KEY (id, type, quizid, questionid))", [], 
                function(result){
                }, sql_error
             );
        }
    );
    
    
    // Get datachunk now
    db.transaction(
        function(tx) {
            
            tx.executeSql("SELECT scorm.data FROM scorm WHERE id = ? AND type = ?", [g_projectID, 'datachunk'], 
                function(tx, result) {
                    for(var i = 0; i < result.rows.length; i++) {
                        g_chunk = result.rows.item(i)['data'];
                    }
            }, sql_error)
        }
    );
    // Get bookmark now
    db.transaction(
        function(tx) {
            tx.executeSql("SELECT scorm.data FROM scorm WHERE id = ? AND type = ?", [g_projectID, 'bookmark'], 
                function(tx, result) {
                    for(var i = 0; i < result.rows.length; i++) {
                        g_result = result.rows.item(i)['data'];
                    }
            }, sql_error)
        }
    );
    // Get Score now
    db.transaction(
        function(tx) {
            tx.executeSql("SELECT scorm.data FROM scorm WHERE id = ? AND type = ?", [g_projectID, 'intScore'], 
                function(tx, result) {
                    for(var i = 0; i < result.rows.length; i++) {
                        g_intScore = result.rows.item(i)['data'];
                    }
            }, sql_error)
        }
    );
    // Get status now
    db.transaction(
        function(tx) {
            tx.executeSql("SELECT scorm.data FROM scorm WHERE id = ? AND type = ?", [g_projectID, 'status'], 
                function(tx, result) {
                    for(var i = 0; i < result.rows.length; i++) {
                        g_status = result.rows.item(i)['data'];
                    }
            }, sql_error)
        }
    );
    
    // Get session time now
    db.transaction(
        function(tx) {
            tx.executeSql("SELECT scorm.data FROM scorm WHERE id = ? AND type = ?", [g_projectID, 'sessiontime'], 
                function(tx, result) {
                    for(var i = 0; i < result.rows.length; i++) {
                        g_sessiontime = parseInt(result.rows.item(i)['data']);
                    }
            }, sql_error)
        }
    );
}





SCORM_db = {
    SetClosed: function(courseid){
        var cid = courseid;
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID, 'closed', '', '', g_projectID, new Date().getTime()], null, sql_error);
            }
        );
    },
    GetClosed: function(){
        
    },
    SetBookmark: function(mark){
        g_mark = mark;
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID, 'bookmark', '', '', g_mark, new Date().getTime()], null, sql_error);
            }
        );
    },
    GetBookmark: function(){
        return g_result;
    },
    SetDataChunk: function(chunk){
        g_chunk = chunk;
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID,'datachunk', '', '', g_chunk, new Date().getTime()], null, sql_error);
            }
        );
    },
    GetDataChunk: function(){
        return g_chunk;
    },
    
    SetScore: function(intScore, intMaxScore, intMinScore){
        g_intScore = intScore;
        g_intMaxScore = intMaxScore;
        g_intMinScore = intMinScore;
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID, 'intScore', '', '', g_intScore, new Date().getTime()], null, sql_error);
            }
        );
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID, 'intMaxScore', '', '', g_intMaxScore, new Date().getTime()], null, sql_error);
            }
        );
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID, 'intMinScore', '', '', g_intMinScore, new Date().getTime()], null, sql_error);
            }
        );
    },
    GetScore: function(){
        return g_intScore;
    },
    
    RecordTrueFalseInteraction: function(strID, response, blnCorrect, correctResponse, strDescription, intWeighting, intLatency, strLearningObjectiveID){
        g_strID.push(strID);
        g_typeId.push('RecordTrueFalseInteraction');
        g_obj.push('{'+
                '"strID": "'+strID+'", '+
                '"response": "'+response+'", '+
                '"blnCorrect": "'+blnCorrect+'", '+
                '"correctResponse": "'+correctResponse+'", '+
                '"strDescription": "'+strDescription+'", '+
                '"intWeighting": "'+intWeighting+'", '+
                '"intLatency": "'+intLatency+'", '+
                '"strLearningObjectiveID": "'+strLearningObjectiveID+
            '"}');
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID, g_typeId.splice(0, 1), '', g_strID.splice(0, 1), g_obj.splice(0, 1), new Date().getTime()], null, sql_error);
            }
        );
    },
    
    RecordMultipleChoiceInteraction: function(strID, response, blnCorrect, correctResponse, strDescription, intWeighting, intLatency, strLearningObjectiveID){
        g_strID.push(strID);
        g_typeId.push('RecordMultipleChoiceInteraction');
        g_obj.push('{'+
                '"strID": "'+strID+'", '+
                '"response": "'+response+'", '+
                '"blnCorrect": "'+blnCorrect+'", '+
                '"correctResponse": "'+correctResponse+'", '+
                '"strDescription": "'+strDescription+'", '+
                '"intWeighting": "'+intWeighting+'", '+
                '"intLatency": "'+intLatency+'", '+
                '"strLearningObjectiveID": "'+strLearningObjectiveID+
            '"}');
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID, g_typeId.splice(0, 1), '', g_strID.splice(0, 1), g_obj.splice(0, 1), new Date().getTime()], null, sql_error);
            }
        );
    },
    // TIME
    SetSessionTime: function(time){
        g_time = time;
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID, 'sessiontime', '', '', g_time, new Date().getTime()], null, sql_error);
            }
        );
    },
    GetSessionTime: function(){
        return g_sessiontime;
    },
    // Status
    SetStatus: function(status){
        g_status = status;
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID, 'status', '', '', g_status, new Date().getTime()], null, sql_error);
            }
        );
    },
    GetStatus: function(){
        return g_status;
    },
    SetPassed: function(){
        this.SetStatus("passed");
    },
    SetFailed: function(){
        this.SetStatus("failed");
    },
    ResetStatus: function(){
        this.SetStatus("incomplete");
    },
    SetReachedEnd: function(){
        this.SetStatus("completed");
    },
    
    // Debug
    WriteToDebug: function(debug){
        console.log("DEBUG:"+debug);
    },
    
    GetStudentID: function(){
        
        return 'STUDENT_ID';
    },
    GetStudentName: function(){
        return 'LAST_NAME, FIRST_NAME';
    },

    CreateResponseIdentifier: function(shortVar, longVar){
        var temp = {};
        temp.Short = shortVar;
        temp.Long = longVar;
        return temp;
    },

    
    
    ClearTable: function(){
        db.transaction(
            function(tx) {
                tx.executeSql("DROP TABLE scorm", [], 
                     function(result){
                         console.log('Successfully cleared table. You must restart course.');
                     }, sql_error
                );
             }
        );
    }
};

function sql_error(tx, error){
    console.log("SQL Error("+error.code+"): "+error.message);
}


Ext.define('Player.page.components.VideoPlayer', {
    extend: 'Ext.Panel',

    alias: ['widget.videoplayer'],

    config: {
        src: '',
        layout: {
            align: 'center',
            pack: 'center',
            type: 'vbox'
        },
        items: [{
            xtype: 'panel',
            height: 400,
            width: 600,
            itemId: 'videoContainer',
            items: [{
                xtype: 'video',
                itemId: 'videoPlayer',
                posterUrl: 'resources/img/video_play.png',
                url: ''
            }]
        }, {
            xtype: 'panel',
            itemId: 'videoState',
            html: Lang.Loading
        }, {
            xtype: 'panel',
            itemId: 'debugLogger',
            html: ''
        }]
    },

    applySrc: function(config) {
        return config;
    },

    updateSrc: function(newSrc, oldSrc) {
        if (!newSrc) {
            return;
        }
        var me = this,
            vc = me.getComponent('videoContainer'),
            videoPlayer = me.query('video')[0],
            videoDom = videoPlayer.media.dom,
            videoWidth = 480,
            videoHeight = 270;

        if(Ext.os.is.Phone){
            videoWidth = 300;
            videoHeight = 165;
        }

        me.videoType = 'local';
        me.debugLog = '';
        me.lastevent = '';

        // http://youtu.be/-F_ke3rxopc?hd=1
        // http://www.youtube.com/watch?v=-F_ke3rxopc&amp;hd=1
        // 
        // http://www.youtube.com/embed/'+media.video_id+'?wmode=transparent
        // http://www.youtube.com/embed/-F_ke3rxopc?wmode=transparent
        if (newSrc.search(/^https?:\/\/youtu.be\//) === 0 || newSrc.search(/^https?:\/\/www.youtube.com\//) === 0 || newSrc.search(/^https?:\/\/vimeo.com\//) === 0) {
            me.videoType = 'youtube';
        }
        if (newSrc.search(/^https?:\/\/bcove.me\//) === 0 || newSrc.search(/^https?:\/\/link.brightcove.com\//) === 0 || newSrc.search(/^https?:\/\/www.brightcove.com\//) === 0) {
            me.videoType = 'brightcove';
        }
        if (newSrc.search(/^https?:\/\/player.vimeo.com\//) === 0) {
            me.videoType = 'vimeo';
        }

        if (me.videoType == 'local') {

            vc.setMasked({
                xtype: 'loadmask',
                message: Lang.Loading
            });

            newSrc = newSrc.replace('https:', 'http:');
            videoPlayer.setEnableControls(true);

            videoDom.preload = "none";

            videoPlayer.setUrl(newSrc);

            videoDom.addEventListener("abort", function(e) {
                me.eventHandler.call(me, e);
            }, true);
            videoDom.addEventListener("canplay", function(e) {
                me.eventHandler.call(me, e);
            }, true);
            videoDom.addEventListener("canplaythrough", function(e) {
                me.eventHandler.call(me, e);
            }, true);
            videoDom.addEventListener("canshowcurrentframe", function(e) {
                me.eventHandler.call(me, e);
            }, true);
            videoDom.addEventListener("dataunavailable", function(e) {
                me.eventHandler.call(me, e);
            }, true);
            videoDom.addEventListener("durationchange", function(e) {
                me.eventHandler.call(me, e);
            }, true);
            videoDom.addEventListener("emptied", function(e) {
                me.eventHandler.call(me, e);
            }, true);
            videoDom.addEventListener("empty", function(e) {
                me.eventHandler.call(me, e);
            }, true);
            videoDom.addEventListener("ended", function(e) {
                me.onEnded.call(me, e);
            }, true);
            videoDom.addEventListener("error", function(e) {
                me.onError.call(me, e);
            }, true);
            videoDom.addEventListener("loadeddata", function(e) {
                me.eventHandler.call(me, e);
            }, true);
            videoDom.addEventListener("loadedmetadata", function(e) {
                me.eventHandler.call(me, e);
            }, true);
            videoDom.addEventListener("loadstart", function(e) {
                me.onLoadStart.call(me, e);
            }, true);
            videoDom.addEventListener("mozaudioavailable", function(e) {
                me.eventHandler.call(me, e);
            }, true);
            videoDom.addEventListener("pause", function(e) {
                me.onPause.call(me, e);
            }, true);
            videoDom.addEventListener("play", function(e) {
                me.onPlay.call(me, e);
            }, true);
            videoDom.addEventListener("playing", function(e) {
                me.onPlaying.call(me, e);
            }, true);
            videoDom.addEventListener("progress", function(e) {
                me.eventHandler.call(me, e);
            }, true);
            videoDom.addEventListener("ratechange", function(e) {
                me.eventHandler.call(me, e);
            }, true);
            videoDom.addEventListener("seeked", function(e) {
                me.eventHandler.call(me, e);
            }, true);
            videoDom.addEventListener("seeking", function(e) {
                me.eventHandler.call(me, e);
            }, true);
            videoDom.addEventListener("suspend", function(e) {
                me.eventHandler.call(me, e);
            }, true);
            videoDom.addEventListener("timeupdate", function(e) {
                me.eventHandler.call(me, e);
            }, true);
            videoDom.addEventListener("volumechange", function(e) {
                me.eventHandler.call(me, e);
            }, true);
            videoDom.addEventListener("waiting", function(e) {
                me.eventHandler.call(me, e);
            }, true);
        }
        else{
            vc.setMasked({
                xtype: 'loadmask',
                message: Lang.Loading,
                indicator: false
            });
            vc.setWidth(videoWidth);
            vc.setHeight(videoHeight);
            videoPlayer.setPosterUrl(null);
        }
    },
    onLoadStart: function(e) {
        var me = this,
            vc = me.getComponent('videoContainer'),
            vs = me.getComponent('videoState');
        if(vc){
            vc.setMasked(false);
        }
        if(vs){
            vs.setHtml(Lang.Tap_To_Play);
        }
        me.showVideo();
    },
    onPlay: function(e) {
        var me = this,
            vc = me.getComponent('videoContainer'),
            vs = me.getComponent('videoState');
        vc.setMasked({
            xtype: 'loadmask',
            message: Lang.Loading
        });
        vs.setHtml("loading");
    },
    onPause: function(e){
        this.showVideo();
    },
    onPlaying: function(e) {
        var me = this,
            vc = me.getComponent('videoContainer'),
            vs = me.getComponent('videoState');
        vc.setMasked(false);
        vs.setHtml("&nbsp;");
    },
    onEnded: function(e) {
        this.fireEvent('complete', this);
    },
    onErased: function(e){
        this.showVideo();
    },
    onError: function(e) {
        var me = this,
            vc = me.getComponent('videoContainer'),
            vs = me.getComponent('videoState');
        vc.setMasked(false);
        vs.setHtml(Lang.Video_Error);
    },
    eventHandler: function(e) {
        return;
        if(e.type != 'timeupdate' && e.type != 'progress'){
            console.log("~~~~~~~~~~~~e:" + e.type);
        }
    },
    hideVideo: function(e){
        return;
        var me = this,
            videoPlayer = me.query('video')[0];
        if(videoPlayer){
            videoPlayer.ghost.show();
            videoPlayer.media.hide();
            videoPlayer.media.setTop(-2000);
        }
    },
    showVideo: function(e){
        return;
        var me = this,
            videoPlayer = me.query('video')[0];
        if(videoPlayer){
            videoPlayer.ghost.hide();
            videoPlayer.media.show();
            videoPlayer.media.setTop(0);
        }
    },
    convertToEmbeddedUrl: function(src, type){
        var tempSrc = 'http://',
            videoId = '';
        switch (type) {
            case 'brightcove':
                return src;
                break;
            case 'youtube':
                if(src.search(/https:\/\//)){
                    tempSrc = 'https://'
                }
                if(src.search(/www\.youtube\.com\/watch/)){
                    videoId = src.match(/[\\?&]v=([^&#]*)/)[0].substring(3);
                    tempSrc += "www.youtube.com/embed/"+videoId;
                    return tempSrc;
                }
                else if(src.search(/youtu.be/)){
                    videoId = src.split('/')[3];
                    tempSrc += "www.youtube.com/embed/"+videoId;
                    return tempSrc;
                }
                else if(src.search(/www\.youtube\.com\/embed/)){
                    return src;
                }
                // http://www.youtube.com/watch?v=LHY8NKj3RKs
                // http://youtu.be/LHY8NKj3RKs
                // -> TO ->
                // http://www.youtube.com/embed/LHY8NKj3RKs
                break;
            case 'vimeo':
                return src;
                break;
            case 'local':
                return src;
                break;
        }

    },

    start: function() {
        var me = this,
            vc = me.getComponent('videoContainer'),
            vs = me.getComponent('videoState'),
            videoWidth = 480,
            videoHeight = 270;
        if(Ext.os.is.Phone){
            videoWidth = 300;
            videoHeight = 165;
        }

        switch (me.videoType) {
        case 'brightcove':
            vc.removeAll();
            vc.setHtml('<center id="video1"><iframe width="'+videoWidth+'" height="'+videoHeight+'" src="' + me.getSrc() + '" frameborder="0" allowfullscreen></iframe></center>');
            //vc.setHtml('<object id="flashObj" width="480" height="270" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,47,0"><param name="movie" value="http://c.brightcove.com/services/viewer/federated_f9?isVid=1&isUI=1" /><param name="bgcolor" value="#FFFFFF" /><param name="flashVars" value="videoId=1215064367001&linkBaseURL=http%3A%2F%2Fwww.brightcove.com%2Fen%2Fcustomers%2Fmiami-dolphins&playerID=1167390947001&playerKey=AQ~~,AAABDi-JSEE~,gimkI1WDEZt9UUqw6AtrLdMF6jk1qhL5&domain=embed&dynamicStreaming=true" /><param name="base" value="http://admin.brightcove.com" /><param name="seamlesstabbing" value="false" /><param name="allowFullScreen" value="true" /><param name="swLiveConnect" value="true" /><param name="allowScriptAccess" value="always" /><embed src="http://c.brightcove.com/services/viewer/federated_f9?isVid=1&isUI=1" bgcolor="#FFFFFF" flashVars="videoId=1215064367001&linkBaseURL=http%3A%2F%2Fwww.brightcove.com%2Fen%2Fcustomers%2Fmiami-dolphins&playerID=1167390947001&playerKey=AQ~~,AAABDi-JSEE~,gimkI1WDEZt9UUqw6AtrLdMF6jk1qhL5&domain=embed&dynamicStreaming=true" base="http://admin.brightcove.com" name="flashObj" width="480" height="270" seamlesstabbing="false" type="application/x-shockwave-flash" allowFullScreen="true" allowScriptAccess="always" swLiveConnect="true" pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash"></embed></object>');
            break;
        case 'youtube':
            vc.removeAll();
            vc.setHtml('<center id="video1"><iframe width="'+videoWidth+'" height="'+videoHeight+'" src="' + me.convertToEmbeddedUrl(me.getSrc(),me.videoType) + '" frameborder="0" allowfullscreen></iframe></center>');
            break;
        case 'vimeo':
            vc.removeAll();
            vc.setHtml('<center id="video1"><iframe width="'+videoWidth+'" height="'+videoHeight+'" src="' + me.getSrc() + '" frameborder="0" allowfullscreen></iframe></center>');
            break;
        case 'local':
            break;
        }
        if (me.videoType != 'local') {
            me.fireEvent('complete', me);
            vc.setMasked(false);
            vs.setHtml('&nbsp;');
        }
    },

    initialize: function() {
        var me = this,
            vc = me.getComponent('videoContainer'),
            videoPlayer = me.query('video')[0];
        me.callParent(arguments);
        videoPlayer.onBefore({
            erased: 'onErased',
            scope: me
        });
        if (Ext.os.is.Phone) {
            vc.setWidth(300);
            vc.setHeight(200);
        }
    }
});



Ext.define('Player.page.Page', {
    extend : 'Ext.Panel',

    alias: ['widget.page'],
    
    config: {
        layout: {
            type: 'vbox',
            align: 'stretch',
            pack: 'start'
        },
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        pageData: {}
    },

    
    applyPageData : function(config) {        
        return config;
    },

    updatePageData : function(newPageData, oldPageData) {
    },

    initialize : function() {
        this.callParent(arguments);
        //this.setMasked({xtype: "loadmask", message: "Loading Page", cls:'page-mask'});
    },
    start: function(){
        if(!Player.settings.get('activateTimer') && !Player.settings.get('pageComplete')){
            Player.app.fireEvent('pageComplete');
        }
        this.resizeScroller();
    },
    close: function(){
        
    },
    resizeScroller: function(){
        var me = this,
            scb = me.getScrollable(),
            imageSize = scb.getScroller().getSize(),
            containerSize = scb.getScroller().getContainerSize(),
            ind = scb.getIndicators();

        if(imageSize.x > containerSize.x){
            //ind.x.show();
        }
        if(imageSize.y > containerSize.y){
            ind.y.show();
        }
    }
});
Ext.define('Player.page.components.TextImage', {
    extend: 'Ext.Panel',

    alias: ['widget.textimage'],

    config: {
        styleHtmlContent: true,
        html: '',
        layout: 'fit',
        pageData: {}
    },

    applyPageData: function(config) {
        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        if(!newPageData.pType){
            return;
        }
        //debugger;
        var me = this,
            imageHtml, fullHtml = "",
            useAltContent = false,
            iconType = 'zoom',
            zoomImage = true,
            pText = '',
            imageWidth= '40',
            imageFile, imagePos;


        try{
            useAltContent = !Ext.getStore('SupportedPages').findRecord('pType', newPageData.pType, 0, false, true, true).get('supported');
        }catch(e){
            console.log("alt Error:"+e);
        }

        // ALT MOBILE CONTENT
        if(useAltContent){
            if(newPageData.altMobileContent && newPageData.altMobileContent.altPText){
                pText = newPageData.altMobileContent.altPText['#text'];   
            }
            if(newPageData.altMobileContent && newPageData.altMobileContent.altImageFile){
                imageFile = newPageData.altMobileContent.altImageFile;
            }
            if(newPageData.altMobileContent && newPageData.altMobileContent.altImgPos){
                imagePos = newPageData.altMobileContent.altImgPos;
            }
            if(newPageData.altMobileContent && newPageData.altMobileContent.altImageWidth){
                imageWidth = newPageData.altMobileContent.altImageWidth;
            }
        }
        else{
            if (newPageData.pText) {
                pText = newPageData.pText['#text'];
            }
            if(newPageData.imageFile){
                imageFile = newPageData.imageFile;
            }
            if(newPageData.imgPos){
                imagePos = newPageData.imgPos;
            }
            if(newPageData.imageWidth){
                imageWidth = newPageData.imageWidth;
            }
        }

        // assume percent width
        if(typeof imageWidth == 'number'){
            imageWidth += '%';
        }else if(imageWidth.match(/\d$/).length > 0){
            imageWidth += '%';
        }

        if (imageFile) {
            if(newPageData.pType.search("Link") >= 0){
                iconType = 'link';
            }

            var extention = imageFile.split('.').pop().toLowerCase(),
                imageDivStyle = 'width: ' + imageWidth + ';',
                imageDirection = 'left',
                zoomId = 'zoom_' + me.id;

            // Create Image ,
            /*newImg = new Image()
            newImg.id = 'img_' + me.id;
            newImg.src = imageFile;
            newImg.className = 'img_'+extention;
            newImg.style.setProperty('width', '100%');
            newImg.onload = me.onImageLoad.call(me, newImg);
            newImg.ondragstart = function(e){return false;};*/

            // Get Image Position
            if(imagePos){
                if (imagePos.search(/left/i) >= 0) {
                    imageDirection = 'left';
                } else if (imagePos.search(/right/i) >= 0) {
                    imageDirection = 'right';
                } else if (imagePos.search(/bottom/i) >= 0) {
                    imageDirection = 'bottom';
                } else {
                    imageDirection = 'center';
                }
            }
            else{
                imageDirection = 'left';
            }

            // Put Image and Text Together
            imageHtml = '<div class="imagecontainer '+imageDirection+'image" style="' + imageDivStyle + '">';
            imageHtml += '<img src="'+imageFile+'" id="img_'+me.id+'" class="img_'+extention+'" style="width:100%"/>';
            switch(imageDirection){
                case 'left':
                case 'right':
                    imageDivStyle += ' margin-right: 14px; padding-right: 12px; float:'+imageDirection+';';
                    imageHtml = '<div class="imagecontainer '+imageDirection+'image" style="' + imageDivStyle + '">';
                    imageHtml += '<img src="'+imageFile+'" id="img_'+me.id+'" class="img_'+extention+'" style="width:100%"/>';
                    if (zoomImage) {
                        imageHtml += '<div id="' + zoomId + '" class="imageicon '+iconType+'"></div>';
                    }
                    imageHtml += "</div>";
                    fullHtml = imageHtml + pText;
                    break;
                case 'bottom':
                    imageHtml = '<center>'+imageHtml;
                    if (zoomImage) {
                        imageHtml += '<div id="' + zoomId + '" class="imageicon '+iconType+'"></div>';
                    }
                    imageHtml += "</div></center>";
                    fullHtml = pText + imageHtml;
                    break;
                case 'center':
                    imageHtml = '<center>'+imageHtml;
                    if (zoomImage) {
                        imageHtml += '<div id="' + zoomId + '" class="imageicon '+iconType+'"></div>';
                    }
                    imageHtml += "</div></center>";
                    fullHtml = imageHtml + pText;
                    break;
            }
        }
        else{
           fullHtml = pText; 
        }
        // Apply Text
        me.setHtml(fullHtml);

        // Add Image to "imagecontainer"
        /*if(newImg){
            var innerNode = me.innerElement.dom.getElementsByClassName('imagecontainer')[0];
            innerNode.insertBefore(newImg, innerNode.firstChild);
        }*/
        
    },

    onImageLoad: function(e){
        console.log("~~~ImageLoaded....");
    },

    imageTapHandler: function(e) {
        if (e && e.target && (e.target.id == 'img_' + this.id || e.target.id == 'zoom_' + this.id)) {
            e.stopPropagation();
            this.fireEvent('imagetap');
        }
    },

    repositionZoomImage: function() {
        try {
            var me = this,
                zoomId = 'zoom_' + me.id,
                imId = 'img_' + me.id,
                zoo = document.getElementById(zoomId),
                im = document.getElementById(imId);
            if (im.complete) {
                zoo.setAttribute("style", "left:" + (im.width+im.offsetLeft-zoo.clientWidth) + "px;top:" + (im.height+im.offsetTop-zoo.clientHeight+1) + "px");
            } else {
                setTimeout(function() {
                    me.repositionZoomImage.call(me);
                }, 300);
            }
        } catch (e) {}
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
        me.element.on('tap', me.imageTapHandler, me);
        me.on('painted', me.repositionZoomImage, me);
    },
    start: function() {
        if (!Player.settings.data.activateTimer) {
            Player.app.fireEvent('pageComplete');
        }
    }
});

Ext.define('Player.page.Video', {
    extend: 'Player.page.Page',

    alias: ['widget.Video'],
    requires: [
        'Player.page.components.VideoPlayer'
    ],

    config: {
        layout: {
            type: 'vbox',
            align: 'stretch',
            pack: 'start'
        },
        styleHtmlContent: true,
        cls: 'page-content',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        items: [{
            xtype: 'panel',
            html: 'Title of the Video',
            itemId: 'pageTitle',
            cls: 'page-title',
            layout: {
                type: 'fit'
            }
        }, {
            xtype: 'spacer',
            height: '14px'
        }, {
            xtype: 'videoplayer',
            itemId: 'videoContainer'
        }],
        pageData: {}
    },

    applyPageData: function(config) {
        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this,
            vc = me.getComponent('videoContainer');

        if (newPageData.mobileMediaPath) {
		try {
            me.videoUrl = newPageData.mobileMediaPath;
			//Changed code
			var url = me.videoUrl.toLowerCase();
			videoPath = url.split('.').pop();
			var newUrl;
			if(Ext.browser.is.Chrome)
			{
			newUrl = url.replace(videoPath,"webm");
			}
			else if(Ext.browser.is.Safari)
			{
			newUrl = url.replace(videoPath,"mp4");
			}
			}
			catch (e) {}
			}
			
			//Changed code
			else {
            me.videoUrl = newPageData.mediaPath;
        }
		//Changed code
			me.videoUrl = newUrl;
			//Changed code
        vc.setSrc(me.videoUrl);
        vc.on('complete', me.onVideoComplete, me);

        me.getComponent('pageTitle').setHtml(newPageData.title);

        // Create Note
        if (newPageData.note) {
            var textNote = Ext.create('Player.view.Note', {
                noteText: newPageData.note['#text'],
                nType: newPageData.nType
            });
            me.add(textNote);
        }

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },
    onVideoComplete: function(e){
        Player.app.fireEvent('pageComplete');
    },
    hideVideo: function(e){
        this.getComponent('videoContainer').showVideo();
    },
    showVideo: function(e){
        this.getComponent('videoContainer').showVideo();
    },
    start: function() {
        var me = this,
            vc = me.getComponent('videoContainer');

        me.callParent(arguments);
        this.getComponent('videoContainer').showVideo();
        vc.start();
    },
    close: function(){
        this.getComponent('videoContainer').hideVideo();
    },

    initialize: function() {
        this.callParent(arguments);
    }
});
Ext.define('Player.page.Definitions.Practice', {
    extend: 'Ext.Container',

    alias: ['widget.practice'],

    config: {
        layout: {
            type: 'vbox'
        },
        pageData: {},
        items: [{
            xtype: 'container',
            docked: 'top',
            itemId: 'reviewToolbar',
            cls: 'def-instructions',
            height: 64,
            layout: {
                align: 'center',
                pack: 'center',
                type: 'hbox'
            },
            items: [{
                xtype: 'container',
                height: 64,
                width: '100%',
                html: Lang.Practice_Instructions,
                itemId: 'practiceInstructions',
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                }
            },{
                xtype: 'spacer',
                width: 10
            }, {
                xtype: 'button',
                docked: 'right',
                itemId: 'resetBtn',
                height: 40,
                text: Lang.Reset
            }]
        }, {
            xtype: 'container',
            html: Lang.Practice_Step1,
            cls: 'def-step',
            itemId: 'termTitle'
        }, {
            xtype: 'list',
            itemId: 'termList',
            flex: 1,
            scrollable: {
                direction: 'vertical',
                directionLock: true
            },
            itemTpl: ['<div>{term}</div>']
        }, {
            xtype: 'container',
            html: Lang.Practice_Step2,
            cls: 'def-step',
            itemId: 'defTitle'
        }, {
            xtype: 'list',
            itemId: 'defList',
            flex: 1,
            scrollable: {
                direction: 'vertical',
                directionLock: true
            },
            itemTpl: [
                        '<tpl if="correct === true">', 
                            '<div class="def-correct">', 
                            '<img src="resources/img/right.png"/> {term} - ', 
                        '</tpl>', 
                        '<tpl if="correct === false">', 
                            '<div>', 
                        '</tpl>', 
                      '{#text}</div>']
        }, {
            xtype: 'container',
            docked: 'bottom',
            height: 42,
            itemId: 'practiceButtonBar',
            layout: {
                align: 'center',
                pack: 'center',
                type: 'hbox'
            },
            items: [{
                xtype: 'button',
                itemId: 'gotoReviewBtn',
                text: Lang.Practice_Review
            }]
        }]
    },
    applyPageData: function(config) {
        if (config.title) {
            return config;
        }
        return false
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this;

        if (!newPageData) {
            return;
        }

        if (newPageData.practiceMobileInst && newPageData.practiceMobileInst['#text']) {
            me.query('#practiceInstructions')[0].setHtml(newPageData.practiceMobileInst['#text']);
        } else if (newPageData.instructionTextDD && newPageData.instructionTextDD['#text']) {
            me.query('#practiceInstructions')[0].setHtml(newPageData.instructionTextDD['#text']);
        }
        me.onReset();

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },
    onTermSelect: function(dv, record, eOpts) {
        this.selectedRecord = record;
    },
    onDefSelect: function(dv, record, eOpts) {
        var me = this,
            defList = me.query('#defList')[0],
            termList = me.query('#termList')[0],
            defStore = defList.getStore(),
            termStore = termList.getStore(),
            defNode;
        if(!me.selectedRecord){
           Ext.Msg.alert(Lang.Error, Lang.Practice_SelectTerm, Ext.emptyFn);
           defList.deselect(defList.getSelection());
           return; 
        }

        if (me.selectedRecord.get('termId') === record.get('termId')) {
            defNode = defStore.getAt(defStore.find('termId', record.get('termId')));
            // correct
            record.set('correct', true);
            defNode.set('correct', true);

            // Clear term selection
            me.selectedRecord.stores[0].remove(me.selectedRecord);
            me.selectedRecord = null;

            // make list item green
            var st = dv.getStore(),
                index = st.indexOf(record),
                list = dv.getActiveItem().getViewItems(),
                ln = list.length, i,
                allComplete = true;

            for (i = 0; i < ln; i++) {
                if (index == i) {
                    list[i].className = "x-list-item x-item-selected x-list-item-correct";
                } else if(list[i].className.search('x-list-item-correct') < 0) {
                    list[i].className = "x-list-item";
                }
            }

            // Check for all complete
            
            /*ln = defList.getData().length;
            list = defList.getData();
            for(i=0;i<ln;i++){
                if(!list.correct){
                    allComplete = false;
                    break;
                }
            }*/


            if(termStore.getCount() <= 0){
                Player.app.fireEvent('pageComplete');
            }

        } else {
            // Incrorrect
            Ext.Msg.show({
                title: Lang.Sorry,
                message: Lang.Practice_NotAMatch,
                buttons: {
                    text: Lang.Try_Again,
                    itemId: 'ok',
                    ui: 'action'
                },
                promptConfig: false,
                fn: function(e) {
                    var defList = this.query('#defList')[0];
                    defList.deselect(defList.getSelection());
                },
                scope: me
            });
        }
    },
    onReset: function() {
        var me = this,
            pageData = me.getPageData(),
            defList = me.query('#defList')[0],
            termList = me.query('#termList')[0],
            tempDef, ln = pageData.definitionsText.defText.length,
            termStore = termList.getStore(),
            defStore = defList.getStore(),
            s = [];

        me.selectedRecord = null;
        me.terms = [];
        me.defs = [];

        if(termStore){
            termStore.removeAll(false);
        }
        if(defStore){
            defStore.removeAll(false);
        }

        //me.masterList = [];
        for (var i = 0; i < ln; i++) {
            tempDef = pageData.definitionsText.defText[i];
            tempDef.correct = false;
            tempDef.termId = i;
            //me.masterList.push(tempDef);
            me.terms.push(tempDef);
            me.defs.push(tempDef);
        }

        var randomizeTerms = false;
        if (randomizeTerms) {
            s = [];
            // Randomize the array
            while (me.terms.length) {
                s.push(me.terms.splice(Math.random() * me.terms.length, 1)[0]);
            }
            while (s.length) {
                me.terms.push(s.pop());
            }
        }

        var randomizeDefs = true;
        if (randomizeDefs) {
            s = [];
            // Randomize the array
            while (me.defs.length) {
                s.push(me.defs.splice(Math.random() * me.defs.length, 1)[0]);
            }
            while (s.length) {
                me.defs.push(s.pop());
            }
        }

        termList.setData(me.terms);
        defList.setData(me.defs);
    },

    initialize: function() {
        var me = this;

        me.callParent(arguments);

        me.query('#termList')[0].on('select', me.onTermSelect, me);
        me.query('#defList')[0].on('select', me.onDefSelect, me);

        me.query('#resetBtn')[0].on('tap', me.onReset, me);
    }

});
Ext.define('Player.layout.Accordion', {
    extend : 'Ext.layout.Default',
    alias  : 'layout.accordion',

    requires : [
        'Ext.TitleBar'
    ],

    itemCls              : Ext.baseCSSPrefix + 'layout-accordion-item',
    itemAnimCls          : Ext.baseCSSPrefix + 'layout-accordion-item-anim',
    itemArrowCls         : Ext.baseCSSPrefix + 'accordion-arrow',
    itemArrowExpandedCls : Ext.baseCSSPrefix + 'accordion-arrow-expanded',

    config : {
        expandedItem : null,
        mode         : 'SINGLE',
        arrowAlign   : 'right'
    },

    constructor: function(container) {
        this.callParent(arguments);

        if (this.getMode() === 'SINGLE') {
            container.on('show', 'checkMode', this, { single : true });
        }
    },

    checkMode: function(container) {
        var items = container.getInnerItems(),
            i     = 0,
            iNum  = items.length,
            item, lastItem;

        for (; i < iNum; i++) {
            item = items[i];

            if (!item.collapsed) {
                if (lastItem) {
                    this.collapse(lastItem);
                }

                lastItem = item;
            }
        }
    },

    insertItem: function(item, index) {
        var me = this;

        me.callParent([item, index]);

        if (item.isInnerItem()) {
            var titleDock = item.titleDock = item.insert(0, {
                xtype: 'titlebar',
                docked: 'top',
                ui: 'light',
                cls: 'def-toolbar',
                title: item.title,
                items: [{
                    cls: me.itemArrowCls,
                    width: 46,
                    ui: 'plain',
                    align: me.getArrowAlign(),
                    scope: me,
                    handler: 'handleToggleButton'
                }]
            }),
            arrowBtn = item.arrowButton = titleDock.down('button[cls=' + me.itemArrowCls + ']');
             titleDock.element.on('tap', me.onTitlebarTap, me);

            item.addCls(me.itemCls);
            arrowBtn.addCls(me.itemArrowExpandedCls);

            item.on('painted', function() {
                item.addCls(me.itemAnimCls);
            }, me, {
                single: true
            });

            if (item.collapsed) {
                item.on('painted', 'collapse', me, {
                    single: true
                });
            } else if (me.getMode() === 'SINGLE') {
                me.setExpandedItem(item);
            }
        }
    },

    onTitlebarTap: function(e, node){
        e.stopPropagation();
        var me = this,
            items = this.innerItems,
            ln = items.length,
            tempItem;

        for(var i=0;i<ln;i++){
            tempItem = items[i];
            if(tempItem.element.query("#"+node.id).length > 0){
                break;
            }
        }
        me.expand(tempItem);
    },

    handleToggleButton: function(btn) {
        var component = btn.up('titlebar').up('component');

        this.toggleCollapse(component);
    },

    toggleCollapse: function(component) {
        this[component.collapsed ? 'expand' : 'collapse'](component);
    },

    collapse: function(component) {
        
        if (component.isInnerItem() && !(this.getMode() === 'SINGLE' && this.getExpandedItem() === component)) {
            var titleDock   = component.titleDock,
                titleHeight = titleDock.element.getHeight();
            component.fullHeight = component.element.getHeight();
            component.setHeight(titleHeight);
            component.collapsed = true;
            component.arrowButton.removeCls(this.itemArrowExpandedCls);
        }
    },

    expand: function(component) {
        if (component.isInnerItem()) {
            if (this.getMode() === 'SINGLE') {
                var expanded = this.getExpandedItem();

                this.setExpandedItem(component);
                if(expanded){
                    this.collapse(expanded);    
                }
                
            }
            component.setHeight(component.fullHeight);
            component.collapsed = false;
            component.arrowButton.addCls(this.itemArrowExpandedCls);
        }
    }
});
Ext.define('Player.page.Definitions.Review', {
    extend: 'Ext.Container',

    alias: ['widget.defreview'],
    requires: ['Player.layout.Accordion'],

    config: {
        pageData: {},
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        layout: {
            align: 'center',
            pack: 'center',
            type: 'vbox'
        },
        items: [{
            xtype: 'container',
            docked: 'top',
            height: 64,
            cls: 'def-instructions',
            html: 'review instructions',
            itemId: 'reviewInstructions',
            ui: 'light',
            scrollable: {
                direction: 'vertical',
                directionLock: true
            }
        }, {
            xtype: 'container',
            itemId: 'accordionContainer',
            width: "90%",

            items: [{
                layout: {
                    type: 'accordion',
                    mode: 'SINGLE'
                },
                itemId: 'defAccordion'
            }]
        }, {
            xtype: 'container',
            docked: 'bottom',
            height: 42,
            itemId: 'reviewButtonBar',
            layout: {
                align: 'center',
                pack: 'center',
                type: 'hbox'
            },
            items: [{
                xtype: 'button',
                itemId: 'gotoPracticeBtn',
                text: Lang.Review_Practice
            }]
        }]
    },
    applyPageData: function(config) {
        if (config.title) {
            return config;
        }
        return false;
    },

    updatePageData: function(newPageData, oldPageData) {
        if (!newPageData) {
            return;
        }

        var me = this,
            defAccordion = me.query('#defAccordion')[0],
            tempDef, ln = newPageData.definitionsText.defText.length,
            firstItem;

        if (newPageData.reviewMobileInst && newPageData.reviewMobileInst['#text']) {
            me.getComponent('reviewInstructions').setHtml(newPageData.reviewMobileInst['#text']);
        } else if (newPageData.instructionText && newPageData.instructionText['#text']) {
            me.getComponent('reviewInstructions').setHtml(newPageData.instructionText['#text']);
        }

        // Add All Items
        for (var i = 0; i < ln; i++) {
            tempDef = newPageData.definitionsText.defText[i];
            var tempItem = Ext.create('Ext.Container', {
                title: tempDef.term,
                html: tempDef['#text'],
                cls: 'def-item',
                collapsed: true
            });
            tempItem.title = tempDef.term;
            tempItem.collapsed = true;
            
            defAccordion.add(tempItem);
        }

        // Expand first item
        
        Ext.Function.defer(function() {
            if(defAccordion.innerItems.length > 0){
                defAccordion.getLayout().expand(defAccordion.innerItems[0]);
            }
        }, 600, me, []);
        
        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    }

});
Ext.define('Player.view.ProgressBar', {
    extend: 'Ext.Container',
    alias: 'widget.progressbar',

    config: {
        style: 'background-color:#666',
        layout: {
            type: 'fit'
        },
        maxValue: 100,
        value: 0,
        showText: 1,
        items: [
            {
                xtype: 'container',
                itemId: 'fillElement',
                style: 'background-color:#00B1EA',
                width: '10%'
            },
            {
                xtype: 'container',
                centered: true,
                html: '--%',
                itemId: 'textElement'
            }
        ]
    },

    updateValue: function(value) {
        var me = this,
            maxValue = me.getMaxValue();

        if (value < 0) {
            value = 0;
        }else if (value > maxValue){
            value = maxValue;
        }
        me.getComponent('textElement').setHtml(value + '%');
        me.updateProgress(value);
    },

    updateProgress: function(value) {
        var me = this;
        value = (value * 100) / me.getMaxValue();
        me.getComponent('fillElement').setWidth(value + '%');
    },

    updateShowText: function(value) {
        var me = this;
        if(value){
            me.getComponent('textElement').show();
        }
        else{
            me.getComponent('textElement').hide();
        }
    }

});
Ext.define('Player.view.ImagePopup', {
    extend: 'Ext.Panel',
    alias: 'widget.imagepopup',

    config: {
        centered: true,
        hidden: true,
        maxHeight: '90%',
        maxWidth: '90%',
        hideOnMaskTap: true,
        layout: {
            type: 'fit'
        },
        modal: true,
        scrollable: 'both',
        captionHead: '',
        captionText: '',
        imageFile: '',
        cls: [
            'imagepopup'
        ],
        items: [
            {
                xtype: 'panel',
                docked: 'bottom',
                height: 60,
                html: 'Image Caption Text',
                itemId: 'captionText',
                styleHtmlContent: true,
                ui: 'light',
                scrollable: 'vertical'
            },
            {
                xtype: 'container',
                docked: 'top',
                height: 0,
                items: [
                    {
                        xtype: 'panel',
                        cls: [
                            'close-imagepopup'
                        ],
                        docked: 'top',
                        height: 46,
                        right: -20,
                        top: -20,
                        width: 46,
                        zIndex: 100,
                        modal: false,
                        items: [
                            {
                                xtype: 'button',
                                height: 34,
                                itemId: 'closeImagePopBtn',
                                padding: '0 0 0 0',
                                ui: 'plain',
                                width: 34,
                                autoEvent: 'closeimagepopup',
                                iconAlign: 'center',
                                iconCls: 'delete',
                                iconMask: true
                            }
                        ]
                    }
                ]
            }
        ],
        listeners: [
            {
                fn: 'onPanelInitialize',
                event: 'initialize'
            },
            {
                fn: 'onPanelShow',
                event: 'show'
            }
        ]
    },

    onPanelInitialize: function(component, options) {
        this.query('#closeImagePopBtn')[0].on('tap', this.onClose, this);
    },

    onPanelShow: function(component, options) {
        Player.app.fireEvent('hideTools');
    },

    updateCaptionHead: function(caption) {
        //var cap = this.getComponent('captionHead');
        //cap.setHtml(caption);
    },

    updateCaptionText: function(caption) {

        var cap = this.getComponent('captionText'),
        captionHead = this.getCaptionHead();

        //console.log("Caption - "+captionHead+":::"+caption);

        if(captionHead && caption){
            cap.show();
            cap.setHtml('<span class="captionhead">'+captionHead+'</span><br/>' + '<span class="captiontext">'+caption+'</span>');
        }
        else{
            cap.hide();
            cap.setHtml("");
        }

    },

    updateImageFile: function(imagePath) {
        //var image = this.getComponent('pageImage');
        //image.setSrc(imagePath);

        var newImg = new Image();
        newImg.src = imagePath;
        //newImg.onload = this.resizePopup.call(this, newImg);

        this.setHtml('<img src="'+imagePath+'"/>');
    },

    onClose: function() {
        this.hide();
        this.fireAction('close', [this]);
    },

    resizePopup: function(img) {
        var imgHeight = img.height,
        imgWidth = img.width,
        popWidth = 200,
        popHeight = 400,
        captionHeight = 60;

        if (imgWidth < 200) {
            popWidth = 200;
        } else if (imgWidth > this.element.dom.clientWidth * 0.9) {
            popWidth = this.element.dom.clientWidth * 0.9;
        } else {
            popWidth = imgWidth + 10;
        }

        if (imgHeight < 200) {
            popHeight = 200+captionHeight;
        } else if (imgHeight > this.element.dom.clientHeight * 0.9) {
            popHeight = this.element.dom.clientHeight * 0.9;
        } else {
            popHeight = imgHeight + 10 + captionHeight;
        }

        this.getImagePopup().setWidth(popWidth);
        this.getImagePopup().setHeight(popHeight);
    }

});
Ext.define('Player.page.questions.EmailPopup', {
    extend: 'Ext.form.Panel',
    alias: 'widget.emailpopup',

    config: {
        centered: true,
        height: 128,
        hidden: true,
        itemId: 'feedbackPopup',
        width: 300,
        height: 330,
        name: 'emailForm',
        hideAnimation: 'popOut',
        showAnimation: 'popIn',
        layout: {
            align: 'center',
            type: 'vbox'
        },
        title: '',
        feedback: '',
        modal: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        items: [{
            xtype: 'titlebar',
            docked: 'top',
            itemId: 'titlebar',
            title: Lang.Enter_Name,
            items: [{
                xtype: 'button',
                itemId: 'closeFeedback',
                autoEvent: 'closefeedback',
                align: 'right',
                ui: 'round',
                iconCls: 'delete',
                iconMask: true
            }]
        }, {
            xtype: 'label',
            html: Lang.Email_Directions
        }, {
            xtype: 'textfield',
            name: 'name',
            itemId: 'nameInput',
            required: true,
            labelCls: 'email-label',
            label: Lang.Name
        }, {
            xtype: 'emailfield',
            name: 'email',
            itemId: 'emailInput',
            required: true,
            labelCls: 'email-label',
            label: Lang.Email
        }, {
            xtype: 'button',
            itemId: 'okbtn',
            width: 60,
            text: Lang.OK
        }]
    },
    initialize: function() {
        var me = this;
        me.callParent(arguments);
        me.query('#closeFeedback')[0].on('tap', me.onClose, me);
        me.query('#okbtn')[0].on('tap', me.onSubmit, me);
    },
    onSubmit: function() {
        var me = this,
            values = me.getValues(),
            nameInput = me.getComponent('nameInput'),
            emailInput = me.getComponent('emailInput'),
            formvalid = true;

        nameInput.setInputCls('');
        emailInput.setInputCls('');

        if( !(values.email && Ext.data.validations.emailRe.test(values.email)) ) {
            emailInput.setInputCls('form-input-invalid');            
            emailInput.focus();
            formvalid = false;
        }
        if(!values.name) {
            nameInput.setInputCls('form-input-invalid');   
            nameInput.focus();         
            formvalid = false;
        }

        if(formvalid){
            me.fireAction('submit', [me, me.getValues()]);
        }
    },
    onClose: function() {
        this.fireAction('close', [this]);
    },

    updateFeedback: function(value) {
        this.setHtml(value);
    },

});

Ext.define('Player.page.questions.review.Review', {
    extend: 'Ext.Panel',

    alias: ['widget.reviewquestion'],

    config: {
        layout: {
            type: 'vbox'
        },
        recordId: '',
        questionRecord: {},
        questionNumber:0,
        questionsToAsk:0,
        blnCorrect: false,
        items: [{
            xtype: 'panel',
            html: 'Question 0 of 0 - Correct',
            itemId: 'questonNumberText',
            maxWidth: '100%'
        }, {
            xtype: 'panel',
            html: 'Question Text Goes here....',
            itemId: 'questonText',
            maxWidth: '100%'
        }, {
            xtype: 'panel',
            html: Lang.Your_Answers_Were
        }, {
            xtype: 'spacer',
            height: 20,
            itemId: 'distractorStart'
        },
        // Distractors go here....
        {
            xtype: 'spacer'
        }]
    },

    refreshQuestionNumber: function(){
        var me = this,
            b = me.getBlnCorrect(),
            statusText;
        if(b){
            statusText = '<span style="color:green">'+Lang.Correct+'</span>';
        }
        else{
            statusText = '<span style="color:red">'+Lang.Incorrect+'</span>';
        }
        me.getComponent('questonNumberText').setHtml(Lang.Question_of.replace("{1}",me.getQuestionNumber()).replace("{2}",me.getQuestionsToAsk()).replace("{status}",statusText));
    },
    updateQuestionNumber: function(newValue, oldValue){
        this.refreshQuestionNumber();
    },
    updateQuestionsToAsk: function(newValue, oldValue){
        this.refreshQuestionNumber();
    },
    updateBlnCorrect: function(newValue, oldValue){
        this.refreshQuestionNumber();
    },

    updateQuestionRecord: function(newRecord, oldRecord) {
        var me = this;
        // Add question text
        me.getComponent('questonText').setHtml(newRecord.raw.questionText['#text']);
        me.setBlnCorrect(newRecord.data.blnCorrect);
    },
    
    findLetter: function(list, letter) {
        var ln = list.length,
            i;
        for (i = 0; i < ln; i++) {
            if (list[i].Short === letter) {
                return true;
            }
        }
        return false;
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
    }
});

Ext.define('Player.page.questions.review.TF', {
    extend: 'Player.page.questions.review.Review',

    alias: ['widget.reviewTF'],

    config: {
        layout: {
            type: 'vbox'
        },
        questionRecord: {},
        questionNumber: 0,
        questionsToAsk: 0,
        blnCorrect: false,
        items: [{
            xtype: 'panel',
            html: 'Question 0 of 0 - Correct',
            itemId: 'questonNumberText'
        }, {
            xtype: 'panel',
            html: 'Question Text Goes here....',
            padding: '0 0 4 0',
            styleHtmlContent: true,
            cls: 'questonText',
            itemId: 'questonText'
        }, {
            xtype: 'panel',
            html: Lang.Your_Answers_Were
        }, {
            xtype: 'spacer',
            height: 10,
            itemId: 'distractorStart'
        },
        // Distractors go here....
        {
            xtype: 'spacer'
        }]
    },

    updateQuestionRecord: function(newRecord, oldRecord) {
        var me = this,
            distractorStartIndex = me.indexOf(me.getComponent('distractorStart')) + 1,
            distractorsList, correctResponse = [],
            newPageData = newRecord.raw,
            correctResponses = eval(newRecord.data.correctResponse),
            responses = newRecord.data.response,
            response,
            alphabet = ['A', 'B'];

        me.callParent(arguments);
        // Add distractors
        distractorsList = [{
            "#text": Lang.True
        }, {
            "#text": Lang.False
        }];

        for (var i = 0, ln = distractorsList.length; i < ln; i++) {
            var distractorData = distractorsList[i];
            if (!distractorData) {
                continue;
            }
            letter = alphabet.shift();

            if (correctResponses === responses && (!i == correctResponses)) {
                response = '<div style="width:16px; color: green; float: left;">'+Lang.C+'</div>';
            } else if (!i == responses) {
                response = '<div style="width:16px; color: red; float: left;">'+Lang.X+'</div>';
            } else {
                response = '<div style="width:16px; float: left;">'+Lang.N+'</div>';
            }

            var distractorCheckbox = Ext.create('Ext.Panel', {
                html: response + ' ' + letter + '. ' + distractorData['#text'],
                styleHtmlContent: false
            });

            distractorCheckbox = me.insert(distractorStartIndex++, distractorCheckbox);
        }

        if(!newRecord.data.blnCorrect){
            response = (correctResponses)?Lang.True:Lang.False;
            panel = Ext.create('Ext.Panel', {
                html: Lang.Correct_Answer+response,
                padding: '6 0 0 0'
            });
            me.add(panel);
        }
    },
    
    

    initialize: function() {
        var me = this;
        me.callParent(arguments);
    }
});

Ext.define('Player.page.questions.Instructions', {
    extend: 'Ext.Panel',
    alias: 'widget.instructions',

    config: {
        xtype: 'panel',
        bottom: 0,
        left: 0,
        right: 0,
        height: 48,
        hidden: true,
        itemId: 'instructions',
        cls: 'instructions',
        checkAnswer: false,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        width: '100%',
        bubbleEvents: ['closeinstructions', 'checkanswerevt'],
        showAnimation: {
            type: 'slideIn',
            duration: 400,
            direction: 'up'
        },
        hideAnimation: {
            type: 'slideOut',
            duration: 400,
            direction: 'down'
        },
        items: [{
            xtype: 'button',
            docked: 'right',
            itemId: 'closeInstructions',
            cls: 'closeinstructions',
            autoEvent: 'closeinstructions',
            ui: 'plain',
            iconMask: true,
            iconCls: 'delete'
        },{
            xtype: 'button',
            docked: 'right',
            itemId: 'checkAnswerBtn',
            autoEvent: 'checkanswer',
            hidden: true,
            ui: 'checkanswer',
            iconMask: true,
            iconCls: 'check2'
        }]
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
        me.query('#closeInstructions')[0].on('tap', me.onClose, me);
        me.query('#checkAnswerBtn')[0].on('tap', me.onCheckAnswer, me);
    },
    onClose: function() {
        var me = this;
        me.hide();
        me.fireAction('closeinstructions', [me]);
    },
    onCheckAnswer: function(e){
        this.fireEvent('checkanswerevt', this);
    },
    updateCheckAnswer: function(value){
        this.query('#closeInstructions')[0].setHidden(value);
        this.query('#checkAnswerBtn')[0].setHidden(!value);
    }

});

Ext.define('Player.page.questions.FeedBackPopup', {
    extend: 'Ext.Panel',
    alias: 'widget.feedbackpopup',

    config: {
        centered: true,
        height: 128,
        hidden: true,
        itemId: 'feedbackPopup',
        width: '90%',
        title: '',
        feedback: '',
        padding: '5 5 5 5',
        hideOnMaskTap: true,
        hideAnimation: 'popOut',
        showAnimation: 'popIn',
        modal: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        items: [{
            xtype: 'titlebar',
            docked: 'top',
            itemId: 'titlebar',
            title: 'Correct',
            items: [{
                xtype: 'button',
                itemId: 'closeFeedback',
                autoEvent: 'closefeedback',
                ui: 'round',
                iconCls: 'delete',
                iconMask: true,
                align: 'right'
            }]
        }]
    },
    initialize: function() {
        this.callParent(arguments);
        this.query('#closeFeedback')[0].on('tap', this.onClose, this);
    },
    onClose: function(){
        this.hide();
        this.fireAction('close', [this]);
    },
    updateTitle: function(value){
        this.getComponent('titlebar').setTitle(value);
    },
    updateFeedback: function(value){
        this.setHtml(value);
    },

});

Ext.define('Player.page.Definitions', {
    extend: 'Player.page.Page',

    alias: ['widget.Definitions'],
    requires: ['Player.page.Definitions.Review', 'Player.page.Definitions.Practice'],

    config: {
        layout: 'card',
        scrollable: false,
        recordId: '',
        pageData: {
            title: 'Page Title 2',
            pText: '>>>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'
        },
        items: [{
            xtype: 'defreview',
            itemId: 'reviewCard'
        }, {
            xtype: 'practice',
            itemId: 'practiceCard'
        }]
    },

    applyPageData: function(config) {
        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this
            ;
            me.getComponent('reviewCard').setPageData(newPageData);
            me.getComponent('practiceCard').setPageData(newPageData);
    },
    imageTapHandler: function() {
        //imagePopup.show();
    },

    start: function() {
        this.callParent(arguments);


    },
    toggleCard: function(){
        var me = this;
        if(me.currentCard == 'review'){
            me.currentCard = 'practice';
            me.setActiveItem(1);
        }
        else{
            me.currentCard = 'review';
            me.setActiveItem(0);
        }
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);

        me.callParent(arguments);
        me.currentCard = 'review';

        me.getComponent('reviewCard').query('#gotoPracticeBtn')[0].on('tap', me.toggleCard, me);
        me.getComponent('practiceCard').query('#gotoReviewBtn')[0].on('tap', me.toggleCard, me);
    }
});
Ext.define('Player.page.TextandVideo', {
    extend: 'Player.page.Page',

    alias: ['widget.TextandVideo'],
    requires: [
        'Player.page.components.VideoPlayer'
    ],

    config: {
        layout: {
            type: 'vbox',
            align: 'stretch',
            pack: 'start'
        },
        styleHtmlContent: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        items: [{
            xtype: 'panel',
            html: 'Title of the Video',
            itemId: 'pageTitle',
            cls: 'page-title',
            layout: {
                type: 'fit'
            }
        }, {
            xtype: 'spacer',
            height: '14px'
        }, {
            xtype: 'videoplayer',
            itemId: 'videoContainer'
        }, {
            xtype: 'panel',
            html: '',
            cls: 'page-content',
            itemId: 'pageText'
        }],
        pageData: {}
    },

    applyPageData: function(config) {
        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this,
            vc = me.getComponent('videoContainer'),
            pText = '';

        // Set Video
        if (newPageData.mobileMediaPath) {
            me.videoUrl = newPageData.mobileMediaPath;
        } else {
            me.videoUrl = newPageData.mediaPath;
        }
        vc.setSrc(me.videoUrl);
        vc.on('complete', me.onVideoComplete, me);

        // Set Title
        me.getComponent('pageTitle').setHtml(newPageData.title);

        // Set Text
        if(newPageData.pText){
            pText = newPageData.pText['#text'];
        }
        me.getComponent('pageText').setHtml(pText);

        // Create Note
        if (newPageData.note) {
            var textNote = Ext.create('Player.view.Note', {
                noteText: newPageData.note['#text'],
                nType: newPageData.nType
            });
            me.add(textNote);
        }

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },
    onVideoComplete: function(e){
        Player.app.fireEvent('pageComplete');
    },
    hideVideo: function(e){
        this.getComponent('videoContainer').hideVideo();
    },
    showVideo: function(e){
        this.getComponent('videoContainer').showVideo();
    },
    start: function() {
        var me = this,
            vc = me.getComponent('videoContainer');
        me.callParent(arguments);
        this.getComponent('videoContainer').showVideo();
        vc.start();
    },
    close: function(){
        this.getComponent('videoContainer').hideVideo();
    },

    initialize: function() {
        this.callParent(arguments);
    }
});

Ext.define('Player.page.TextandImageLink', {
    extend: 'Player.page.Page',

    alias: ['widget.TextandImageLink'],

    requires: ['Player.page.components.TextImage'],
    
    config: {
        layout: 'vbox',
        styleHtmlContent: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        items: [{
            xtype: 'panel',
            html: 'Title of the Video',
            itemId: 'pageTitle',
            cls: 'page-title',
            layout: {
                type: 'fit'
            }
        }, {
            xtype: 'textimage',
            html: '',
            cls: 'page-content',
            itemId: 'pageText'
        }],
        pageData: {}
    },

    applyPageData: function(config) {
        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this,
            pText = '';

        // Set Title
        me.getComponent('pageTitle').setHtml(newPageData.title);

        // Set Text
        me.getComponent('pageText').setPageData(newPageData);
        me.getComponent('pageText').on('imagetap', me.imageTapHandler, me);

        // Create Note
        if (newPageData.note) {
            var textNote = Ext.create('Player.view.Note', {
                noteText: newPageData.note['#text'],
                nType: newPageData.nType
            });
            me.add(textNote);
        }

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },
    
    imageTapHandler: function(e) {
        window.open(this.getPageData().imageURL, '_blank');
    },

    start: function() {
        var me = this;
        me.callParent(arguments);

        Player.app.fireEvent('pageComplete');
    },
    close: function() {
        var me = this;
        me.closeImagePopup();
    },

    initialize: function() {
        this.callParent(arguments);
    }
});

Ext.define('Player.page.Text', {
    extend: 'Player.page.Page',

    alias: ['widget.Text'],

    config: {
        layout: 'vbox',
        styleHtmlContent: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        items: [{
            xtype: 'panel',
            html: 'Page Title',
            cls: 'page-title',
            itemId: 'pageTitle'
        }, {
            xtype: 'panel',
            html: 'Lorem ipsum dolor sit amet',
            cls: 'page-content',
            itemId: 'pageText'
        }],
        pageData: {}
    },

    applyPageData: function(config) {
        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this,
            useAltContent = true;

        if (newPageData.title) {
            me.getComponent('pageTitle').setHtml(newPageData.title);
        }
        if (newPageData.pText) {
            me.getComponent('pageText').setHtml(newPageData.pText['#text']);
        }
        else if(newPageData.pType != 'Text'){
            var errorText = "Unsupported page type:"+newPageData.pType+"<br/> or /app/page/"+newPageData.pType.replace(/ /g,'')+".js is missing";
            me.getComponent('pageText').setHtml(errorText);
        }

        try{
            useAltContent = !Ext.getStore('SupportedPages').findRecord('pType', newPageData.pType, 0, false, true, true).get('supported');
        }catch(e){}
        // Create Note
        if (newPageData.note) {
            var textNote = Ext.create('Player.view.Note', {
                noteText: newPageData.note['#text'],
                nType: newPageData.nType
            });
            me.add(textNote);
        }

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },

    initialize: function() {
        this.callParent(arguments);
    },
    start: function(){
        this.callParent(arguments);
        Player.app.fireEvent('pageComplete');
    }
});

Ext.define('Player.page.TextandAudio', {
    extend: 'Player.page.Page',

    alias: ['widget.TextandAudio'],

    config: {
        layout: 'vbox',
        styleHtmlContent: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        items: [{
            xtype: 'panel',
            html: 'Title of the Video',
            itemId: 'pageTitle',
            cls: 'page-title',
            layout: {
                type: 'fit'
            }
        }, {
            xtype: 'panel',
            html: '',
            cls: 'page-content',
            itemId: 'pageText'
        }, {
            xtype: 'audiobar',
            itemId: 'audio'
        }],
        pageData: {}
    },

    applyPageData: function(config) {
        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this,
            pText = '';

        // Set Title
        me.getComponent('pageTitle').setHtml(newPageData.title);

        // Set Text
        if (newPageData.pText) {
            me.getComponent('pageText').setHtml(newPageData.pText['#text']);
        }

        // Create Audio
        me.getComponent('audio').setMediaPath(newPageData.mediaPath);

        // Create Note
        if (newPageData.note) {
            var textNote = Ext.create('Player.view.Note', {
                noteText: newPageData.note['#text'],
                nType: newPageData.nType
            });
            me.add(textNote);
        }

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },

    start: function() {
        this.callParent(arguments);
    },

    initialize: function() {
        this.callParent(arguments);
    }
});

Ext.define('Player.page.CustomHTML5Page', {
    extend : 'Player.page.Page',

    alias: ['widget.Html'],

    inheritableStatics: {
        NOT_SINGLE_TOUCH: 0x01,
        TOUCH_MOVED:  0x02
    },
    isStarted: false,
    isTouchStarted: false,
    isDragStarted: false,
    startPoint: null,
    previousPoint: null,
    lastPoint: null,
    scroller: null,
    oldY: 0,

    config : {
        layout: 'vbox',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId:'',
        items: [{
            xtype: 'panel',
            html: 'Page Title',
            itemId: 'pageTitle'
        }, {
            xtype: 'panel',
            itemId: 'pageHtml'
        }, {
            xtype: 'panel',
            itemId: 'pageText',
            styleHtmlContent : true
        }, {
            xtype: 'panel',
            itemId: 'loading',
            centered: true,
            modal: true,
            html: "Loading"
        }],
        pageData: {}
    },
    
    
    
    applyPageData : function(config) {        
        return config;
    },

    updatePageData : function(newPageData, oldPageData) {
        var me = this,
            width, height,
            random = Math.round(Math.random()*1000);
        
        if (newPageData.title) {
            me.getComponent('pageTitle').setHtml(newPageData.title);
        }

        if(newPageData.url && !newPageData.loadOnPageStart){
            //me.setPageHtml();
        }

        if (newPageData.sourceType != 'upload' && newPageData.pText) {
            me.getComponent('pageText').setHtml(newPageData.pText['#text']);
            me.getComponent('loading').hide();
            try{
                MathJax.Hub.PreProcess(me.element.dom);
                MathJax.Hub.Process(me.element.dom);
            }catch(e){}
        }
        else if(newPageData.sourceType != 'upload' && newPageData.html5Text){
            me.getComponent('pageText').setHtml(newPageData.html5Text['#text']);
            me.getComponent('loading').hide();
            try{
                MathJax.Hub.PreProcess(me.element.dom);
                MathJax.Hub.Process(me.element.dom);
            }catch(e){}
        }
        else if(newPageData.sourceType != 'upload' && newPageData.altMobileContent){
            me.getComponent('pageText').setHtml(newPageData.altMobileContent.pText['#text']);
            me.getComponent('loading').hide();
            try{
                MathJax.Hub.PreProcess(me.element.dom);
                MathJax.Hub.Process(me.element.dom);
            }catch(e){}
        }
        // Create Note
        if (newPageData.note) {
            var textNote = Ext.create('Player.view.Note', {
                noteText: newPageData.note['#text'],
                nType: newPageData.nType
            });
            me.add(textNote);
        }
    },
    
    onIframeContentLoaded: function(e){
        var me = this,
            width, height,
            iframe;

        iframe = document.getElementById('myiframeCnt'+me.id);
        console.log(iframe.contentDocument.width,iframe.contentDocument.height);


        if(iframe.contentDocument.height <= 150){
            iframe.height = mp.element.getHeight();
        }
        else{
            iframe.height = iframe.contentDocument.height;    
        }

        iframe.width = mp.element.getWidth();
    },
    onIframeLoaded: function(iframe){
        console.log("onIframeLoaded");
        var me = this,
            mp = Ext.getCmp('mainPages');
        
        iframe.width = mp.element.getWidth();


        iframe.height = mp.element.getHeight();


        /*
        // UNCOMMENT this to add total height
        if (Ext.os.is.Android) {
            iframe.height = mp.element.getHeight();
        }
        else{
            if(iframe.contentDocument.height < mp.element.getHeight()){ // 150
                iframe.height = mp.element.getHeight();
            }
            else{
                setTimeout(function(e){me.setIframeHeight.call(me,iframe,iframe.contentDocument.height);},1000);
            }
            var h1 = iframe.contentDocument.body.clientHeight;
            var h2 = iframe.contentDocument.height;
            iframe.contentDocument.body.style.setProperty("height", iframe.contentDocument.height+"px", 'important');
        }
        */
        
        me.addIframeListeners();
        me.getComponent('loading').hide();
    },
    setIframeHeight: function(iframe, height){
        iframe.height = iframe.contentDocument.height;
        var h1 = iframe.contentDocument.body.clientHeight;
        var h2 = iframe.contentDocument.height;
    },
    setPageHtml: function(){
        console.log("setPageHtml");
        var me = this,
            mp = Ext.getCmp('mainPages'),
            width, height,
            random = Math.round(Math.random()*1000),
            iframe,
            pData = me.getPageData();

        if(pData.width){
            width = pData.width;
        }
        else{
            width = mp.element.getWidth();
            //width = '100%';    
        }


        if(pData.height){
            height = pData.height;
        }
        else{
            
            height = mp.element.getHeight();
            //height = 500;
        }
        
        iframe = document.createElement('iframe');
        if(Ext.os.is.Phone && me.getPageData().phoneHtml){
            iframe.setAttribute("src", me.getPageData().phoneHtml+'?r='+random); 
        }
        else{
            iframe.setAttribute("src", me.getPageData().tabletHtml+'?r='+random); 
        }
        
        iframe.setAttribute("id", 'myiframeCnt'+me.id);
        iframe.setAttribute("style", "background-color:white;");
        iframe.setAttribute("frameborder", 0);

        iframe.onload = function(){me.onIframeLoaded.call(me, iframe);};
        me.getComponent('pageHtml').innerElement.dom.appendChild(iframe);

    },
    addIframeListeners: function(){
        var me = this,
            width, height,
            mp = Ext.getCmp('mainPages'),
            iframe;

            iframe = document.getElementById('myiframeCnt'+me.id);

            try{
                iframe.contentWindow.onmousedown = function(e){me.onDragStart.call(me,e);};
                iframe.contentWindow.onmousemove = function(e){me.onDrag.call(me,e);};
                iframe.contentWindow.onmouseup = function(e){me.onDragEnd.call(me,e);};

                iframe.contentWindow.addEventListener("touchstart", function(e){me.onDragStart.call(me,e);}, true);
                iframe.contentWindow.addEventListener("touchmove", function(e){me.onDrag.call(me,e);}, true);
                iframe.contentWindow.addEventListener("touchend", function(e){me.onDragEnd.call(me,e);}, true);
                iframe.contentWindow.addEventListener("touchcancel", function(e){me.onDragEnd.call(me,e);}, true);    
            }catch(e){
                console.error("Event Error:"+e);
            }
            
    },

    onDragStart: function(e){
        try{
            var me = this;
            if(e.target.ondragstart || e.target.dragable){
                return;
            }
            me.isDragging = true;
            me.startDragging = true;
            if(Ext.os.is.desktop){
                me.startX = e.screenX;
                me.startY = e.screenY;
            }
            else{
                me.startX = e.touches[0].pageX;
                me.startY = e.touches[0].pageY;
            }
            this.oldY = 0;
        }catch(e){
            console.log("Start:"+e);
        }
    },
    onDrag: function(e){
        try{
            var me = this,
                deltaX, deltaY, absDeltaX, absDeltaY, x, y, time, touch,
                event = Ext.create('Ext.event.Event');

            if (!me.isDragging) {
                return;
            }
            if(Ext.os.is.desktop){
                deltaX = e.screenX - me.startX;
                deltaY = e.screenY - me.startY;
                absDeltaX = Math.abs(deltaX);
                absDeltaY = Math.abs(deltaY);
            }
            else{
                touch = e.changedTouches[0];
                x = touch.pageX;
                y = touch.pageY;
                absDeltaX = Math.abs(x - me.startX);
                absDeltaY = Math.abs(y - me.startY);
                deltaX = x - me.startX;
                deltaY = y - me.startY;
                time = e.time;
                if(absDeltaY > this.oldY+29 || absDeltaY < this.oldY-29){
                    me.onDragEnd(e);
                    return;
                }
                this.oldY = absDeltaY;
                
            }

            event.absDeltaX = Math.abs(deltaX);
            event.absDeltaY = Math.abs(deltaY);
            event.deltaX = deltaX;
            event.deltaY = deltaY;
            event.time = time;

            if(me.startDragging){
                me.startDragging = false;
                me.parent.onDragStart(event);
                //me.getScrollable().getScroller().onDragStart(event);
            }
            else{
                if(absDeltaX > absDeltaY){
                    me.parent.onDrag(event);
                    //me.getScrollable().getScroller().onDragEnd(event);
                }
                else{
                    me.parent.onDragEnd(event);
                    //me.getScrollable().getScroller().onDrag(event);
                }
            }
            e.preventDefault();
        }catch(e){
            console.log("on:"+e);
        }
    },
    onDragEnd: function(e){
        try{
            var me = this;
            if (!me.isDragging) {
                return;
            }
            me.isDragging = false;
            if(Ext.os.is.desktop){
                var deltaX = e.screenX - me.startX;
                var deltaY = e.screenY - me.startY;
            }
            else{
                var touch = e.changedTouches[0],
                x = touch.pageX,
                y = touch.pageY,
                deltaX = x - me.startX,
                deltaY = y - me.startY,
                absDeltaX = Math.abs(deltaX),
                absDeltaY = Math.abs(deltaY);    
            }
            
            var event = Ext.create('Ext.event.Event');
            event.absDeltaX = Math.abs(deltaX);
            event.absDeltaY = Math.abs(deltaY);
            event.deltaX = deltaX;
            event.deltaY = deltaY;
            me.parent.onDragEnd(event);
            //me.getScrollable().getScroller().onDragEnd(event);
        }catch(e){
            console.log("END:"+e);
        }
    },


    start: function(){
        console.log("START HTML");
        var me = this;

        this.callParent(arguments);
        
        if(me.getPageData().sourceType == 'upload'){
            me.setPageHtml();
        }
       
        this.scroller = me.getScrollable().getScroller();
    },

    initialize : function() {
        console.log("INIT HTML");
        this.callParent(arguments);
    }
});
Ext.define('Player.page.CustomContent', {
    extend : 'Player.page.Page',

    alias: ['widget.Html'],

    inheritableStatics: {
        NOT_SINGLE_TOUCH: 0x01,
        TOUCH_MOVED:  0x02
    },
    isStarted: false,
    isTouchStarted: false,
    isDragStarted: false,
    startPoint: null,
    previousPoint: null,
    lastPoint: null,
    scroller: null,
    oldY: 0,

    config : {
        layout: 'vbox',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId:'',
        items: [{
            xtype: 'panel',
            html: 'Page Title',
            itemId: 'pageTitle'
        }, {
            xtype: 'panel',
            itemId: 'pageHtml'
        }, {
            xtype: 'panel',
            itemId: 'pageText',
            styleHtmlContent : true
        }, {
            xtype: 'panel',
            itemId: 'loading',
            centered: true,
            modal: true,
            html: "Loading"
        }],
        pageData: {}
    },
    
    
    
    applyPageData : function(config) {        
        return config;
    },

    updatePageData : function(newPageData, oldPageData) {
        var me = this,
            width, height,
            random = Math.round(Math.random()*1000);
        
        if (newPageData.title) {
            me.getComponent('pageTitle').setHtml(newPageData.title);
        }

        if(newPageData.url && !newPageData.loadOnPageStart){
            //me.setPageHtml();
        }

        if (newPageData.sourceType != 'upload' && newPageData.pText) {
            me.getComponent('pageText').setHtml(newPageData.pText['#text']);
            me.getComponent('loading').hide();
            try{
                MathJax.Hub.PreProcess(me.element.dom);
                MathJax.Hub.Process(me.element.dom);
            }catch(e){}
        }
        else if(newPageData.sourceType != 'upload' && newPageData.html5Text){
            me.getComponent('pageText').setHtml(newPageData.html5Text['#text']);
            me.getComponent('loading').hide();
            try{
                MathJax.Hub.PreProcess(me.element.dom);
                MathJax.Hub.Process(me.element.dom);
            }catch(e){}
        }
        // Create Note
        if (newPageData.note) {
            var textNote = Ext.create('Player.view.Note', {
                noteText: newPageData.note['#text'],
                nType: newPageData.nType
            });
            me.add(textNote);
        }
    },
    
    onIframeContentLoaded: function(e){
        var me = this,
            width, height,
            iframe;

        iframe = document.getElementById('myiframeCnt'+me.id);
        console.log(iframe.contentDocument.width,iframe.contentDocument.height);


        if(iframe.contentDocument.height <= 150){
            iframe.height = mp.element.getHeight();
        }
        else{
            iframe.height = iframe.contentDocument.height;    
        }

        iframe.width = mp.element.getWidth();
    },
    onIframeLoaded: function(iframe){
        console.log("onIframeLoaded");
        var me = this,
            mp = Ext.getCmp('mainPages');
        
        iframe.width = mp.element.getWidth();


        iframe.height = mp.element.getHeight();


        /*
        // UNCOMMENT this to add total height
        if (Ext.os.is.Android) {
            iframe.height = mp.element.getHeight();
        }
        else{
            if(iframe.contentDocument.height < mp.element.getHeight()){ // 150
                iframe.height = mp.element.getHeight();
            }
            else{
                setTimeout(function(e){me.setIframeHeight.call(me,iframe,iframe.contentDocument.height);},1000);
            }
            var h1 = iframe.contentDocument.body.clientHeight;
            var h2 = iframe.contentDocument.height;
            iframe.contentDocument.body.style.setProperty("height", iframe.contentDocument.height+"px", 'important');
        }
        */
        
        me.addIframeListeners();
        me.getComponent('loading').hide();
    },
    setIframeHeight: function(iframe, height){
        iframe.height = iframe.contentDocument.height;
        var h1 = iframe.contentDocument.body.clientHeight;
        var h2 = iframe.contentDocument.height;
    },
    setPageHtml: function(){
        console.log("setPageHtml");
        var me = this,
            mp = Ext.getCmp('mainPages'),
            width, height,
            random = Math.round(Math.random()*1000),
            iframe,
            pData = me.getPageData();

        if(pData.width){
            width = pData.width;
        }
        else{
            width = mp.element.getWidth();
            //width = '100%';    
        }


        if(pData.height){
            height = pData.height;
        }
        else{
            
            height = mp.element.getHeight();
            //height = 500;
        }
        
        iframe = document.createElement('iframe');
        if(Ext.os.is.Phone && me.getPageData().phoneHtml){
            iframe.setAttribute("src", me.getPageData().phoneHtml+'?r='+random); 
        }
        else{
            iframe.setAttribute("src", me.getPageData().tabletHtml+'?r='+random); 
        }
        
        iframe.setAttribute("id", 'myiframeCnt'+me.id);
        iframe.setAttribute("style", "background-color:white;");
        iframe.setAttribute("frameborder", 0);

        iframe.onload = function(){me.onIframeLoaded.call(me, iframe);};
        me.getComponent('pageHtml').innerElement.dom.appendChild(iframe);

    },
    addIframeListeners: function(){
        var me = this,
            width, height,
            mp = Ext.getCmp('mainPages'),
            iframe;

            iframe = document.getElementById('myiframeCnt'+me.id);

            try{
                iframe.contentWindow.onmousedown = function(e){me.onDragStart.call(me,e);};
                iframe.contentWindow.onmousemove = function(e){me.onDrag.call(me,e);};
                iframe.contentWindow.onmouseup = function(e){me.onDragEnd.call(me,e);};

                iframe.contentWindow.addEventListener("touchstart", function(e){me.onDragStart.call(me,e);}, true);
                iframe.contentWindow.addEventListener("touchmove", function(e){me.onDrag.call(me,e);}, true);
                iframe.contentWindow.addEventListener("touchend", function(e){me.onDragEnd.call(me,e);}, true);
                iframe.contentWindow.addEventListener("touchcancel", function(e){me.onDragEnd.call(me,e);}, true);    
            }catch(e){
                console.error("Event Error:"+e);
            }
            
    },

    onDragStart: function(e){
        try{
            var me = this;
            if(e.target.ondragstart || e.target.dragable){
                return;
            }
            me.isDragging = true;
            me.startDragging = true;
            if(Ext.os.is.desktop){
                me.startX = e.screenX;
                me.startY = e.screenY;
            }
            else{
                me.startX = e.touches[0].pageX;
                me.startY = e.touches[0].pageY;
            }
            this.oldY = 0;
        }catch(e){
            console.log("Start:"+e);
        }
    },
    onDrag: function(e){
        try{
            var me = this,
                deltaX, deltaY, absDeltaX, absDeltaY, x, y, time, touch,
                event = Ext.create('Ext.event.Event');

            if (!me.isDragging) {
                return;
            }
            if(Ext.os.is.desktop){
                deltaX = e.screenX - me.startX;
                deltaY = e.screenY - me.startY;
                absDeltaX = Math.abs(deltaX);
                absDeltaY = Math.abs(deltaY);
            }
            else{
                touch = e.changedTouches[0];
                x = touch.pageX;
                y = touch.pageY;
                absDeltaX = Math.abs(x - me.startX);
                absDeltaY = Math.abs(y - me.startY);
                deltaX = x - me.startX;
                deltaY = y - me.startY;
                time = e.time;
                if(absDeltaY > this.oldY+29 || absDeltaY < this.oldY-29){
                    me.onDragEnd(e);
                    return;
                }
                this.oldY = absDeltaY;
                
            }

            event.absDeltaX = Math.abs(deltaX);
            event.absDeltaY = Math.abs(deltaY);
            event.deltaX = deltaX;
            event.deltaY = deltaY;
            event.time = time;

            if(me.startDragging){
                me.startDragging = false;
                me.parent.onDragStart(event);
                //me.getScrollable().getScroller().onDragStart(event);
            }
            else{
                if(absDeltaX > absDeltaY){
                    me.parent.onDrag(event);
                    //me.getScrollable().getScroller().onDragEnd(event);
                }
                else{
                    me.parent.onDragEnd(event);
                    //me.getScrollable().getScroller().onDrag(event);
                }
            }
            e.preventDefault();
        }catch(e){
            console.log("on:"+e);
        }
    },
    onDragEnd: function(e){
        try{
            var me = this;
            if (!me.isDragging) {
                return;
            }
            me.isDragging = false;
            if(Ext.os.is.desktop){
                var deltaX = e.screenX - me.startX;
                var deltaY = e.screenY - me.startY;
            }
            else{
                var touch = e.changedTouches[0],
                x = touch.pageX,
                y = touch.pageY,
                deltaX = x - me.startX,
                deltaY = y - me.startY,
                absDeltaX = Math.abs(deltaX),
                absDeltaY = Math.abs(deltaY);    
            }
            
            var event = Ext.create('Ext.event.Event');
            event.absDeltaX = Math.abs(deltaX);
            event.absDeltaY = Math.abs(deltaY);
            event.deltaX = deltaX;
            event.deltaY = deltaY;
            me.parent.onDragEnd(event);
            //me.getScrollable().getScroller().onDragEnd(event);
        }catch(e){
            console.log("END:"+e);
        }
    },


    start: function(){
        console.log("START HTML");
        var me = this;

        this.callParent(arguments);
        
        if(me.getPageData().sourceType == 'upload'){
            me.setPageHtml();
        }
       
        this.scroller = me.getScrollable().getScroller();
    },

    initialize : function() {
        console.log("INIT HTML");
        this.callParent(arguments);
    }
});
Ext.define('Player.view.AudioBar', {
    extend: 'Ext.Panel',
    alias: 'widget.audiobar',
    requires: [
        'Player.view.ProgressBar'
    ],

    config: {
        docked: 'bottom',
        height: 70,
        style: '\'background-image:-webkit-gradient(linear, 0% 0%, 0% 100%, from(#D9DADB), to(#95979a))',
        layout: {
            align: 'center',
            pack: 'center',
            type: 'hbox'
        },
        mediaPath: '.mp3',
        items: [
            {
                xtype: 'progressbar',
                docked: 'top',
                height: 8,
                itemId: 'progressBar',
                showText: 0
            },
            {
                xtype: 'button',
                cls: 'audio-btn replay-btn',
                height: 40,
                itemId: 'replayBtn',
                padding: '1 16 1 7',
                ui: 'action-round',
                width: 40,
                iconCls: 'replay',
                iconMask: true
            },
            {
                xtype: 'spacer',
                width: 10
            },
            {
                xtype: 'button',
                cls: 'audio-btn play-btn',
                height: 50,
                itemId: 'playBtn',
                ui: 'action-round',
                width: 50,
                iconCls: 'play1',
                iconMask: true
            },
            {
                xtype: 'audio',
                hidden: true,
                itemId: 'audioComp',
                preload: 'none',
                enableControls: false
            }
        ],
        listeners: [
            {
                fn: 'onPanelInitialize',
                event: 'initialize'
            }
        ]
    },

    onPanelInitialize: function(component, options) {

        var me = this, 
        audioDom = me.getComponent('audioComp').media.dom;

        me.getComponent('progressBar').updateValue(0);

        me.getComponent('playBtn').on('tap', me.onPlayTap, me);
        me.getComponent('replayBtn').on('tap', me.onReplayTap, me);

        me.getComponent('audioComp').on('timeupdate', me.onTimeUpdate, me);

        audioDom.preload = "none";
        audioDom.hidden = "true";

        audioDom.addEventListener("ended", function(e) {
            me.onEnded.call(me, e);
        }, true);
        audioDom.addEventListener("error", function(e) {
            me.onError.call(me, e);
        }, true);

        audioDom.addEventListener("loadstart", function(e) {
            me.onLoadStart.call(me, e);
        }, true);

        audioDom.addEventListener("pause", function(e) {
            me.onPause.call(me, e);
        }, true);

        audioDom.addEventListener("play", function(e) {
            me.onPlay.call(me, e);
        }, true);

        audioDom.addEventListener("playing", function(e) {
            me.onPlaying.call(me, e);
        }, true);
    },

    updateMediaPath: function(mediaPath) {
        var me = this;

        me.setMasked({
            xtype: 'loadmask',
            message: Lang.Loading,
            indicator: false
        });

        //if (Ext.os.is.Android) {
            mediaPath = mediaPath.replace('https:', 'http:');
        //}
        me.getComponent('audioComp').setUrl(mediaPath);
    },

    onPlayTap: function() {
        var audioComp = this.getComponent('audioComp');

        audioComp.toggle();



    },

    onTimeUpdate: function(media, time, eOpts) {
        var me = this,
        currentTime = media.getCurrentTime(),
        totalTime = media.getDuration(),
        progress = (currentTime / totalTime)*100;

        me.getComponent('progressBar').setValue(progress);
    },

    onReplayTap: function() {
        var me = this;

        me.getComponent('audioComp').setCurrentTime(0);
    },

    onLoaded: function() {
        this.setMasked(false);
    },

    onEnded: function(e) {
        Player.app.fireEvent('pageComplete');
    },

    onError: function(e) {
        var me = this,
        message = Lang.Audio_Error0;

        try{
            switch(e.target.error.code){
                case 1:
                message = Lang.Audio_Error1;
                break;
                case 2:
                message = Lang.Audio_Error2;
                break;
                case 3:
                message = Lang.Audio_Error3;
                break;
                case 4:
                message = Lang.Audio_Error4;
                break;
            }
            me.setMasked({
                xtype: 'loadmask',
                message: message,
                indicator: false
            });
        }
        catch(e){}
    },

    onLoadStart: function(e) {
        var me = this;

        me.setMasked(false);
    },

    onPause: function(e) {
        var me = this;

        try{
            me.getComponent('playBtn').setIconCls("play1");
        }
        catch(e){}
    },

    onPlay: function(e) {
        var me = this;

        me.setMasked({
            xtype: 'loadmask',
            message: Lang.Loading,
            indicator: false
        });

        me.getComponent('playBtn').setIconCls("pause");
    },

    onPlaying: function(e) {
        var me = this;

        me.setMasked(false);
    }

});
Ext.define('Player.page.ImageLinkandAudio', {
    extend: 'Player.page.Page',

    alias: ['widget.ImageLinkandAudio'],
    
    requires: ['Player.page.components.TextImage','Player.view.AudioBar'],

    config: {
        layout: 'vbox',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        items: [{
            xtype: 'panel',
            html: 'Title of the Video',
            itemId: 'pageTitle',
            cls: 'page-title',
            layout: {
                type: 'fit'
            }
        }, {
            xtype: 'textimage',
            html: '',
            cls: 'page-content',
            itemId: 'pageText'
        }, {
            xtype: 'audiobar',
            itemId: 'audio'
        }],
        pageData: {}
    },

    applyPageData: function(config) {
        return config;
    },

     updatePageData: function(newPageData, oldPageData) {
        var me = this,
            pText = '';

        // Set Title
        me.getComponent('pageTitle').setHtml(newPageData.title);

        // Set Image
        if(newPageData.pText){
            newPageData.pText = false;
        }
        me.getComponent('pageText').setPageData(newPageData);
        me.getComponent('pageText').on('imagetap', me.imageTapHandler, me);

        // Create Audio
        me.getComponent('audio').setMediaPath(newPageData.mediaPath);

        // Create Note
        if (newPageData.note) {
            var textNote = Ext.create('Player.view.Note', {
                noteText: newPageData.note['#text'],
                nType: newPageData.nType
            });
            me.add(textNote);
        }

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },
    imageTapHandler: function(e) {
        window.open(this.getPageData().imageURL, '_blank');
    },

    start: function() {
        var me = this;
        me.callParent(arguments);
    },
    close: function() {
        var me = this;
        me.closeImagePopup();
    },

    initialize: function() {
        this.callParent(arguments);
    }
});

Ext.define('Player.page.TextImageLinkandAudio', {
    extend: 'Player.page.Page',

    alias: ['widget.TextImageLinkandAudio'],

    requires: ['Player.page.components.TextImage','Player.view.AudioBar'],

    config: {
        layout: 'vbox',
        styleHtmlContent: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        items: [{
            xtype: 'panel',
            html: 'Title of the Video',
            itemId: 'pageTitle',
            layout: {
                type: 'fit'
            }
        }, {
            xtype: 'textimage',
            html: '',
            cls: 'page-content',
            itemId: 'pageText'
        }, {
            xtype: 'audiobar',
            itemId: 'audio'
        }],
        pageData: {}
    },

    applyPageData: function(config) {
        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this,
            pText = '';

        // Set Title
        me.getComponent('pageTitle').setHtml(newPageData.title);

        // Set Text
        me.getComponent('pageText').setPageData(newPageData);
        me.getComponent('pageText').on('imagetap', me.imageTapHandler, me);

        // Create Audio
        me.getComponent('audio').setMediaPath(newPageData.mediaPath);

        // Create Note
        if (newPageData.note) {
            var textNote = Ext.create('Player.view.Note', {
                noteText: newPageData.note['#text'],
                nType: newPageData.nType
            });
            me.add(textNote);
        }

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },
    imageTapHandler: function(e) {
        window.open(this.getPageData().imageURL, '_blank');
    },

    start: function() {
        var me = this;
        me.callParent(arguments);
    },
    close: function() {
        var me = this;
        me.closeImagePopup();
    },

    initialize: function() {
        this.callParent(arguments);
    }
});

Ext.define('Player.page.components.ImagePopup', {
    extend: 'Ext.Panel',
    alias: 'widget.imagepopup',

    config: {
        captionHead: '',
        captionText: '',
        imageFile: '',
        centered: true,
        hidden: true,
        maxHeight: '90%',
        maxWidth: '90%',
        hideOnMaskTap: true,
        layout: {
            type: 'fit'
        },
        modal: true,
        scrollable: {
            direction: 'both',
            directionLock: true
        },
        cls: ['imagepopup'],
        items: [{
            xtype: 'panel',
            docked: 'bottom',
            height: 60,
            html: 'Image Caption Text',
            itemId: 'captionText',
            styleHtmlContent: true,
            ui: 'light',
            scrollable: {
                direction: 'vertical',
                directionLock: true
            },
        }, {
            xtype: 'container',
            docked: 'top',
            height: 0,
            items: [{
                xtype: 'panel',
                cls: ['close-imagepopup'],
                docked: 'top',
                height: 46,
                right: -20,
                top: -20,
                width: 46,
                zIndex: 100,
                modal: false,
                items: [{
                    xtype: 'button',
                    height: 34,
                    itemId: 'closeImagePopBtn',
                    padding: '0 9 0 4',
                    ui: 'plain',
                    width: 34,
                    autoEvent: 'closeimagepopup',
                    iconAlign: 'center',
                    iconCls: 'delete',
                    iconMask: true
                }]
            }]
        }],
        listeners: [{
            fn: 'onPanelInitialize',
            event: 'initialize'
        }, {
            fn: 'onPanelShow',
            order: 'before',
            event: 'show'
        }]
    },

    onPanelInitialize: function(component, options) {

        this.query('#closeImagePopBtn')[0].on('tap', this.onClose, this);
    },

    onPanelShow: function(component, options) {
        Player.app.fireEvent('hideTools');
    },

    updateCaptionHead: function(caption) {
        //var cap = this.getComponent('captionHead');
        //cap.setHtml(caption);
    },

    updateCaptionText: function(caption) {
        var cap = this.getComponent('captionText'),
            captionHead = this.getCaptionHead();

        if (captionHead && caption) {
            cap.show();
            cap.setHtml('<span class="captionhead">' + captionHead + '</span><br/>' + '<span class="captiontext">' + caption + '</span>');
        } else {
            cap.hide();
            cap.setHtml("");
        }

    },

    updateImageFile: function(imagePath) {
        var newImg = new Image();
        newImg.src = imagePath;
        newImg.onload = this.resizePopup.call(this, newImg);
        this.setHtml('<img src="' + imagePath + '"/>');
    },

    onClose: function() {
        this.hide();
        this.fireAction('close', [this]);
    },

    resizePopup: function(img) {
        
        var me = this,
            imgHeight = img.height,
            imgWidth = img.width,
            popWidth = 200,
            popHeight = 400,
            captionHeight = 0;

        if(me.getCaptionText() || me.getCaptionHead()){
            captionHeight = 60;
        }
        

        if (imgWidth < 200) {
            popWidth = 200;
        } else if (imgWidth > window.innerWidth * 0.9) {
            popWidth =  window.innerWidth * 0.9;
        } else {
            popWidth = imgWidth + 10;
        }

        if (imgHeight < 200) {
            popHeight = 200 + captionHeight;
        } else if (imgHeight > window.innerHeight * 0.9) {
            popHeight = window.innerHeight * 0.9;
        } else {
            popHeight = imgHeight + 10 + captionHeight;
        }
        
        me.isResized = true;
        me.setWidth(popWidth);
        me.setHeight(popHeight);
    }

});
Ext.define('Player.page.TextImageandAudio', {
    extend: 'Player.page.Page',

    alias: ['widget.TextImageandAudio'],

    requires: ['Player.page.components.TextImage','Player.view.AudioBar'],

    mixins: ['Player.page.components.ImagePopup'],

    config: {
        layout: 'vbox',
        styleHtmlContent: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        items: [{
            xtype: 'panel',
            html: 'Title of the Video',
            itemId: 'pageTitle',
            cls: 'page-title',
            layout: {
                type: 'fit'
            }
        }, {
            xtype: 'textimage',
            html: '',
            cls: 'page-content',
            itemId: 'pageText'
        }, {
            xtype: 'audiobar',
            itemId: 'audio'
        }],
        pageData: {}
    },

    applyPageData: function(config) {
        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this,
            pText = '';

        // Set Title
        me.getComponent('pageTitle').setHtml(newPageData.title);

        // Set Text
        me.getComponent('pageText').setPageData(newPageData);
        me.getComponent('pageText').on('imagetap', me.imageTapHandler, me);

        // Create Audio
        me.getComponent('audio').setMediaPath(newPageData.mediaPath);

        // Impage popup stuff
        me.setImagePopupData(newPageData);

        // Create Note
        if (newPageData.note) {
            var textNote = Ext.create('Player.view.Note', {
                noteText: newPageData.note['#text'],
                nType: newPageData.nType
            });
            me.add(textNote);
        }

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },
    imageTapHandler: function(e) {
        this.showImagePopup();
    },

    start: function() {
        var me = this;
        me.callParent(arguments);

        me.initializePopup();
    },
    close: function() {
        var me = this;
        me.closeImagePopup();

        me.deinitializePopup();
    },

    initialize: function() {
        this.callParent(arguments);
    }
});

Ext.define('Player.page.ImageandAudio', {
    extend: 'Player.page.Page',

    alias: ['widget.ImageandAudio'],
    
    requires: ['Player.page.components.TextImage','Player.view.AudioBar'],

    mixins: ['Player.page.components.ImagePopup'],

    config: {
        layout: 'vbox',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        items: [{
            xtype: 'panel',
            html: 'Title of the Video',
            itemId: 'pageTitle',
            cls: 'page-title',
            layout: {
                type: 'fit'
            }
        }, {
            xtype: 'textimage',
            html: '',
            cls: 'page-content',
            itemId: 'pageText'
        }, {
            xtype: 'audiobar',
            itemId: 'audio'
        }],
        pageData: {}
    },

    applyPageData: function(config) {
        return config;
    },

     updatePageData: function(newPageData, oldPageData) {
        var me = this,
            pText = '';

        // Set Title
        me.getComponent('pageTitle').setHtml(newPageData.title);

        // Set Image
        if(newPageData.pText){
            newPageData.pText = false;
        }
        me.getComponent('pageText').setPageData(newPageData);
        me.getComponent('pageText').on('imagetap', me.imageTapHandler, me);

        // Create Audio
        me.getComponent('audio').setMediaPath(newPageData.mediaPath);

        // Impage popup stuff
        me.setImagePopupData(newPageData);

        // Create Note
        if (newPageData.note) {
            var textNote = Ext.create('Player.view.Note', {
                noteText: newPageData.note['#text'],
                nType: newPageData.nType
            });
            me.add(textNote);
        }

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },
    imageTapHandler: function(e) {
        this.showImagePopup();
    },

    start: function() {
        var me = this;
        me.callParent(arguments);

        me.initializePopup();
    },
    close: function() {
        var me = this;
        me.closeImagePopup();

        me.deinitializePopup();
    },

    initialize: function() {
        this.callParent(arguments);
    }
});

Ext.define('Player.page.ExternalSWFdefault', {
    extend: 'Player.page.Page',

    alias: ['widget.ExternalSWFdefault'],

    requires: ['Player.page.components.TextImage'],

    mixins: ['Player.page.components.ImagePopup'],
    
    config: {
        layout: 'vbox',
        styleHtmlContent: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        items: [{
            xtype: 'panel',
            html: 'Title of the Video',
            itemId: 'pageTitle',
            cls: 'page-title',
            layout: {
                type: 'fit'
            }
        }, {
            xtype: 'textimage',
            html: '',
            cls: 'page-content',
            itemId: 'pageText'
        }],
        pageData: {}
    },

    applyPageData: function(config) {
        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this,
            pText = '';

        // Set Title
        me.getComponent('pageTitle').setHtml(newPageData.title);

        // Set Text
        me.getComponent('pageText').setPageData(newPageData);
        me.getComponent('pageText').on('imagetap', me.imageTapHandler, me);

        // Impage popup stuff
        me.setImagePopupData(newPageData);

        // Create Note
        if (newPageData.altMobileContent.altNote) {
            var textNote = Ext.create('Player.view.Note', {
                noteText: newPageData.altMobileContent.altNote['#text'],
                nType: newPageData.altMobileContent.altNType
            });
            me.add(textNote);
        }
        /*else if (newPageData.note) {
            var textNote = Ext.create('Player.view.Note', {
                noteText: newPageData.note['#text'],
                nType: newPageData.nType
            });
            me.add(textNote);
        }*/

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },
    
    imageTapHandler: function(e) {
        this.showImagePopup();
    },

    start: function() {
        var me = this;
        me.callParent(arguments);
        me.initializePopup();
        Player.app.fireEvent('pageComplete');
    },
    close: function() {
        var me = this;
        me.closeImagePopup();

        me.deinitializePopup();
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
    }
});

Ext.define('Player.page.questions.review.MC', {
    extend: 'Player.page.questions.review.Review',

    alias: ['widget.reviewMC'],

    config: {
        layout: {
            type: 'vbox'
        },
        questionRecord: {},
        questionNumber: 0,
        questionsToAsk: 0,
        blnCorrect: false,
        items: [{
            xtype: 'panel',
            html: 'Question 0 of 0 - Correct',
            itemId: 'questonNumberText',
            maxWidth: '100%'
        }, {
            xtype: 'panel',
            html: 'Question Text Goes here....',
            styleHtmlContent: true,
            padding: '0 0 4 0',
            itemId: 'questonText',
            cls: 'questonText',
            maxWidth: '100%'
        }, {
            xtype: 'panel',
            html: Lang.Your_Answers_Were
        }, {
            xtype: 'spacer',
            height: 10,
            itemId: 'distractorStart'
        },
        // Distractors go here....
        {
            xtype: 'spacer'
        }]
    },


    updateQuestionRecord: function(newRecord, oldRecord) {
        var me = this,
            distractorStartIndex = me.indexOf(me.getComponent('distractorStart')) + 1,
            distractorsList, correctResponse = [],
            newPageData = newRecord.raw,
            correctResponses = newRecord.data.correctResponse,
            responses = newRecord.data.response,
            response, alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        me.callParent(arguments);

        distractorsList = newPageData.distractors.distractor;

        for (var i = 0, ln = distractorsList.length; i < ln; i++) {
            var distractorData = distractorsList[i],
                letter;
            if (!distractorData || !distractorData['#text']) {
                continue;
            }
            letter = alphabet.shift();

            if (me.findLetter(correctResponses, letter) && me.findLetter(responses, letter)) {
                response = '<div style="width:16px; color: green; float: left;">'+Lang.C+'</div>';
            } else if (me.findLetter(responses, letter)) {
                response = '<div style="width:16px; color: red; float: left;">'+Lang.X+'</div>';
            } else {
                response = '<div style="width:16px; float: left;">'+Lang.N+'</div>';
            }

            var distractorCheckbox = Ext.create('Ext.Panel', {
                html: response + ' ' + letter + '. ' + distractorData['#text'],
                styleHtmlContent: false
            });

            distractorCheckbox = me.insert(distractorStartIndex++, distractorCheckbox);
        }

        if(!newRecord.data.blnCorrect){
            var correctString = '';
            for (var i = 0, ln = correctResponses.length; i < ln; i++) {
                correctString += correctResponses[i].Short+",";
            }
            panel = Ext.create('Ext.Panel', {
                html: Lang.Correct_Answer+correctString.slice(0,-1),
                padding: '6 0 0 0'
            });
            me.add(panel);
        }


    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
    }
});

Ext.define('Player.page.questions.review.MCH', {
    extend: 'Player.page.questions.review.Review',

    alias: ['widget.reviewMCH'],

    config: {
        layout: {
            type: 'vbox'
        },
        questionRecord: {},
        questionNumber: 0,
        questionsToAsk: 0,
        blnCorrect: false,
        items: [{
            xtype: 'panel',
            html: 'Question 0 of 0 - Correct',
            itemId: 'questonNumberText'
        }, {
            xtype: 'panel',
            html: 'Question Text Goes here....',
            styleHtmlContent: true,
            padding: '0 0 4 0',
            cls: 'questonText',
            itemId: 'questonText'
        }, {
            xtype: 'panel',
            html: Lang.Your_Answers_Were
        }, {
            xtype: 'spacer',
            height: 10,
            itemId: 'distractorStart'
        },
        // Distractors go here....
        {
            xtype: 'spacer'
        }]
    },


    updateQuestionRecord: function(newRecord, oldRecord) {
        var me = this,
            distractorStartIndex = me.indexOf(me.getComponent('distractorStart')) + 1,
            distractorsList, correctResponse = [],
            newPageData = newRecord.raw,
            correctResponses = newRecord.data.correctResponse,
            responses = newRecord.data.response,
            response, alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        me.callParent(arguments);

        distractorsList = newPageData.distractors.distractor;

        for (var i = 0, ln = distractorsList.length; i < ln; i++) {
            var distractorData = distractorsList[i],
                letter;
            if (!distractorData || !distractorData['#text']) {
                continue;
            }
            letter = alphabet.shift();

            if (me.findLetter(correctResponses, letter) && me.findLetter(responses, letter)) {
                response = '<div style="width:16px; color: green; float: left;">'+Lang.C+'</div>';
            } else if (me.findLetter(responses, letter)) {
                response = '<div style="width:16px; color: red; float: left;">'+Lang.X+'</div>';
            } else {
                response = '<div style="width:16px; float: left;">'+Lang.N+'</div>';
            }

            var distractorCheckbox = Ext.create('Ext.Panel', {
                html: response + ' ' + letter + '. ' + distractorData['#text'],
                styleHtmlContent: false
            });

            distractorCheckbox = me.insert(distractorStartIndex++, distractorCheckbox);
        }

        if(!newRecord.data.blnCorrect){
            var correctString = '';
            for (var i = 0, ln = correctResponses.length; i < ln; i++) {
                correctString += correctResponses[i].Short+",";
            }
            panel = Ext.create('Ext.Panel', {
                html: Lang.Correct_Answer+correctString.slice(0,-1),
                padding: '6 0 0 0'
            });
            me.add(panel);
        }
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
    }
});

Ext.define('Player.page.questions.Review', {
    extend: 'Ext.form.Panel',

    alias: ['widget.review'],

    requires: ['Player.page.questions.review.MCH', 'Player.page.questions.review.MC', 'Player.page.questions.review.TF'],

    config: {
        layout: {
            type: 'vbox'
        },
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        quizRecord: {},
        items: [{
            xtype: 'panel',
            docked: 'top',
            itemId: 'reviewHeader',
            html: 'Test Results'
        },

        {
            xtype: 'panel',
            docked: 'bottom',
            padding: '5 5 5 5',
            layout: {
                type: 'hbox'
            },
            items: [{
                xtype: 'spacer'
            }, {
                xtype: 'button',
                text: Lang.Retake_Test,
                itemId: 'retakeBtn',
                autoEvent: 'retake',

                hidden: false
            }]
        }]
    },

    updateQuizRecord: function(newQuizRecord) {
        if(!newQuizRecord.raw){
            return;
        }
        var me = this,
            quizData = newQuizRecord.raw,
            questionsList = quizData.question,
            questionData, questionRecord, panel, data, errorStr;


        if (quizData.useSupset || quizData.useSubset) {
            questionsToAsk = quizData.numquestions;
        } else {
            questionsToAsk = questionsList.length;
        }

        for (i = 0, ln = questionsToAsk; i < ln; i++) {
            questionData = questionsList[i];
            questionRecord = newQuizRecord.questionsStore.findRecord('id', questionData.id);

            try {
                panel = Ext.create('Player.page.questions.review.' + questionData.qtype, {
                    questionRecord: questionRecord,
                    questionsToAsk: questionsToAsk,
                    questionNumber: i+1
                });
                me.add(panel);

                //Add hr
                panel = Ext.create('Ext.Component', {
                    html: '<hr>',
                    padding: '6 0 6 0'
                });
                me.add(panel);

            } catch (e) {
                debugger;
                data = '';
                try {
                    data = JSON.stringify(questionData);
                } catch (ee) {}
                errorStr = 'Error:: Could not creating review question. Type: ' + questionData.qtype + ' Error:' + e + ' Data:' + data;
                //throw errorStr;
            }
        }
        me.query('#retakeBtn')[0].setHidden(((!quizData.incRetakeButton) || (typeof quizData.incRetakeButton == 'undefined')));
        // Update Header
        me.getComponent('reviewHeader').setHtml('<span>'+Lang.Test_Results+'</span>' + '<span>'+Lang.Review_Score.replace("{score}",newQuizRecord.data.intScore)+'</span> <span>' + Lang.Correct_of.replace("{1}",newQuizRecord.data.correct).replace("{2}", questionsToAsk) + '</span>');

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },
    start: function() {
        this.resizeScroller();
    },
    cleanup: function() {

    },
    getQuestionRecord: function() {
        return false
    },
    onRetake: function() {
        this.fireEvent('retake');
    },
    initialize: function() {
        var me = this;
        me.callParent(arguments);
        me.query('#retakeBtn')[0].on('retake', me.onRetake, me);
    },
    resizeScroller: function(){
        var me = this,
            scb = me.getScrollable(),
            imageSize = scb.getScroller().getSize(),
            containerSize = scb.getScroller().getContainerSize(),
            ind = scb.getIndicators();

        if(imageSize.x > containerSize.x){
            //ind.x.show();
        }
        if(imageSize.y > containerSize.y){
            ind.y.show();
        }
    }
});

Ext.define('Player.page.TextandImage', {
    extend: 'Player.page.Page',

    alias: ['widget.TextandImage'],

    requires: ['Player.page.components.TextImage', 'Player.page.components.ImagePopup'],

    config: {
        layout: 'vbox',
        styleHtmlContent: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        items: [{
            xtype: 'panel',
            html: 'Title of the Video',
            itemId: 'pageTitle',
            cls: 'page-title',
            layout: {
                type: 'fit'
            }
        }, {
            xtype: 'textimage',
            cls: 'page-content',
            itemId: 'pageText'
        }, {
            xtype: 'imagepopup',
            itemId: 'imagePopup',
            width: 200,
            height: 200
        }],
        pageData: {}
    },

    applyPageData: function(config) {
        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        
        var me = this,
            pText = '',
            imagePopup = me.query('#imagePopup')[0];

        // Set Title
        me.getComponent('pageTitle').setHtml(newPageData.title);

        // Set Text
        me.getComponent('pageText').setPageData(newPageData);
        me.getComponent('pageText').on('imagetap', me.imageTapHandler, me);

        // Impage popup stuff
        //me.setImagePopupData(newPageData);
        var imageFile = newPageData.imageFile;
        if (imageFile) {
            imagePopup.setImageFile(imageFile);
        } else {
            imagePopup.setHtml("No Image File");
        }

        var capHead = newPageData.captionhead;
        var capText = newPageData.captiontext;
        if (capHead || capText) {
            imagePopup.setCaptionHead(capHead);
            imagePopup.setCaptionText(capText);
        }

        // Create Note
        if (newPageData.note) {
            var textNote = Ext.create('Player.view.Note', {
                noteText: newPageData.note['#text'],
                nType: newPageData.nType
            });
            me.add(textNote);
        }

        try {
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        } catch (e) {}
    },

    imageTapHandler: function(e) {
        var pop = imagePopup = this.query('#imagePopup')[0];
        pop.show();
    },

    start: function() {
        var me = this;
        me.callParent(arguments);

        //me.initializePopup();

        Player.app.fireEvent('pageComplete');
    },
    close: function() {
        var me = this;
        me.closeImagePopup();

        me.deinitializePopup();
    },

    initialize: function() {
        this.callParent(arguments);
    }
});
Ext.define('Player.page.questions.Question', {
    extend: 'Ext.form.Panel',

    alias: ['widget.question'],

    requires: ['Player.page.questions.FeedBackPopup', 'Player.page.questions.Instructions'],


    config: {
        layout: {
            align: 'center',
            type: 'vbox'
        },
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        questionRecord: null,
        initprompt_Text: Lang.Select_an_Option,
        evalprompt_Text: Lang.Tap_CheckAnswer_Button,
        correctfeedback_Text: Lang.Yes_that_is_correct,
        incorrectfeedback_Text: Lang.No_that_is_incorrect,
        triesfeedback_Text: Lang.Incorrect_Try_Again,
        provideFeedback: true,
        triesAttempted: 0,
        isActiveItem: false,
        tries: 1,
        recordId: '',
        feedbackPopup: {
            xtype: 'widget.feedbackpopup'
        },
        instructions: {
            xtype: 'instructions'
        },
        pageData: {},
        //just incase you forget :)
        //alphabet:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    },


    applyInstructions: function(config) {
        return Ext.factory(config, 'Player.page.questions.Instructions', this.getInstructions());
    },

    updateInstructions: function(newInstructions, oldInstructions) {
        /*debugger;
        if (newInstructions) {
            var me = this;
            newInstructions.on('closeinstructions', me.hideInstructions, me);
            //I have to add to main so it will show up in the center no matter what scroll is
            Ext.getCmp('main').add(newInstructions);
            console.log("New me...");
        } else if (oldInstructions) {
            oldInstructions.destroy();
        }*/
    },
    onCheckAnswer: function(){
        
    },

    hideInstructions: function() {
        var inst = Ext.getCmp('main').getComponent('instructions');
        inst.setHidden(true);
    },
    showInstructions: function(instructionText, showCheckAnswer) {
        var me = this,
            inst = me.getInstructions();
        //var inst = Ext.getCmp('main').getComponent('instructions');
        inst.on('closeinstructions', me.hideInstructions, me);
        if (instructionText) {
            inst.setHtml(instructionText);
        }
        inst.setCheckAnswer(showCheckAnswer);
        Ext.getCmp('main').add(inst);
        inst.show();
    },


    applyPageData: function(config) {
        return config;
    },

    updateQuestionRecord: function(newRecord, oldRecord) {
        var me = this,
            newPageData = newRecord.raw;

        if (newPageData.overrideFeedback && newPageData.feedback) {
            if (newPageData.feedback.initPrompt) {
                me.setInitprompt_Text(newPageData.feedback.initPrompt['#text']);
            }
            if (newPageData.feedback.evalPrompt) {
                me.setEvalprompt_Text(newPageData.feedback.evalPrompt['#text']);
            }
            if (newPageData.feedback.correctFeedback) {
                me.setCorrectfeedback_Text(newPageData.feedback.correctFeedback['#text']);
            }
            if (newPageData.feedback.incorrectFeedback) {
                me.setIncorrectfeedback_Text(newPageData.feedback.incorrectFeedback['#text']);
            }
            if (newPageData.feedback.triesFeedback) {
                me.setTriesfeedback_Text(newPageData.feedback.triesFeedback['#text']);
            }
            if (newPageData.feedback.tries) {
                me.setTries(newPageData.feedback.tries);
            }
            if (typeof newPageData.feedback.provide == 'boolean') {
                me.setProvideFeedback(newPageData.feedback.provide);
            }
        }
    },

    showFeedbackPopup: function(title, feedback) {
        var me = this,
            feedbackObj = {};
        if (!me.getProvideFeedback() || !me.getIsActiveItem()) {
            return;
        }
        if (title) {
            feedbackObj.title = title;
            me.oldTitle = title;
        } else {
            feedbackObj.title = me.oldTitle;
        }
        if (feedback) {
            feedbackObj.feedback = feedback;
            me.oldFeedback = feedback;
        } else {
            feedbackObj.feedback = me.oldFeedback;
        }
        me.feedbackPopup = Ext.create('Player.page.questions.FeedBackPopup', feedbackObj);
        me.feedbackPopup.on('close', me.hideFeedbackPopup, me);

        //I have to add to main so it will show up in the center no matter what scroll is
        Ext.getCmp('main').add(me.feedbackPopup);

        me.feedbackPopup.show();
    },
    hideFeedbackPopup: function() {
        var me = this;
        if(me.feedbackPopup){
            me.feedbackPopup.hide();    
        }
        me.remove(me.feedbackPopup);
    },
    initialize: function() {
        this.callParent(arguments);
    },
    start: function() {
        this.resizeScroller();
    },
    cleanup: function(){},
    resizeScroller: function(){
        var me = this,
            scb = me.getScrollable(),
            imageSize = scb.getScroller().getSize(),
            containerSize = scb.getScroller().getContainerSize(),
            ind = scb.getIndicators();

        if(imageSize.x > containerSize.x){
            //ind.x.show();
        }
        if(imageSize.y > containerSize.y){
            ind.y.show();
        }
    }


})

Ext.define('Player.page.questions.MCH', {
    extend: 'Player.page.questions.Question',

    alias: ['widget.MCH'],

    config: {
        layout: {
            align: 'center',
            type: 'vbox'
        },
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        pageData: {},
        items: [{
            xtype: 'panel',
            html: 'Question Text Goes here....',
            itemId: 'questonText',
            cls: 'questiontext',
            maxWidth: '100%',
            minHeight: '100px',
            minWidth: '250px'
        }, {
            xtype: 'spacer',
            height: 20,
            itemId: 'distractorStart'
        },
        // Distractors go here....
        {
            xtype: 'spacer',
            height: 20
        }, {
            xtype: 'button',
            itemId: 'checkAnswerBtn',
            autoEvent: 'checkanswer',
            text: Lang.Check_Answer,
            cls: 'checkanswer',
            ui: 'checkanswer'
        }, {
            xtype: 'spacer',
            height: 10
        }, {
            xtype: 'button',
            itemId: 'resetBtn',
            autoEvent: 'reset',
            text: Lang.Reset,
            hidden: true
        }, {
            xtype: 'spacer',
            height: 50
        }]
    },

    applyPageData: function(config) {
        return config;
    },
    updateQuestionRecord: function(newRecord, oldRecord){
        this.callParent(arguments);
        var me = this,
            distractorStartIndex = me.indexOf(me.getComponent('distractorStart')) + 1,
            distractorsList, correctResponse = [],
            newPageData = newRecord.raw,
            alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


        me.responseKey = {};

        // Add question text
        me.getComponent('questonText').setHtml(newPageData.questionText['#text']);

        // Reset Button
        me.getComponent('resetBtn').setHidden(((!newPageData.resetBtn) || (typeof newPageData.resetBtn == 'undefined')));

        // Feedback and instructions
        me.getInstructions().setHtml(me.getInitprompt_Text());

        if (me.getProvideFeedback() === false) {
            me.getComponent('checkAnswerBtn').hide();
        }

        // Add distractors
        if (newPageData.distractors.randomize) {
            var s = [],
                items = newPageData.distractors.distractor;

            while (items.length) {
                s.push(items.splice(Math.random() * items.length, 1)[0]);
            }
            while (s.length) {
                items.push(s.pop());
            }
        }
        distractorsList = newPageData.distractors.distractor;

        for (var i = 0, ln = distractorsList.length; i < ln; i++) {
            var distractorData = distractorsList[i],
                letter,
                longText;
            if (!distractorData || !distractorData['#text']) {
                continue;
            }
            letter = alphabet.shift();
            longText = distractorData['#text'].replace(/(<([^>]+)>)/ig, "");
            if (distractorData.correct) {
                correctResponse.push({Short:letter, Long:longText});
            }
            me.responseKey[letter] = longText;

            var distractorCheckbox = Ext.create('Ext.form.Radio', {
                label: distractorData['#text'],
                name: 'distractor',
                value: letter,
                width: '75%',
                labelWidth: '100%',
                labelWrap: true,
                correct: distractorData.correct,
                letter: letter,
                iFeedback: distractorData.iFeedback,
                styleHtmlContent: true,
                labelCls: 'checkBoxlabel',
                labelAlign: 'right',
                listeners: {
                    check: me.onSelect,
                    scope: me
                }
            });

            distractorCheckbox = me.insert(distractorStartIndex++, distractorCheckbox);
            distractorCheckbox.element.on({
                tap: function(e) {
                    var me = this;
                    if (this.getDisabled()) {
                        return;
                    }
                    //if (e.target.type != 'checkbox') {
                    if(e.target.className.search('x-field-mask')<0){
                        me.setChecked(!me.getChecked())
                    }
                    if (me.getChecked()) {
                        me.fireEvent('check', me, e);
                    } else {
                        me.fireEvent('uncheck', me, e);
                    }
                },
                scope: distractorCheckbox
            });
        }

        // Update Store Refrence
        me.getQuestionRecord().set('correctResponse', correctResponse);

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },
    onSelect: function() {
        var me = this;
        if (me.firstSelect && me.getProvideFeedback()) {
            me.showInstructions(me.getEvalprompt_Text(), true);
            me.firstSelect = false;
        }
    },
    onCheckAnswer: function(showFeedback) {
        this.callParent(arguments);
        var i, ln, hasOwn = Object.prototype.hasOwnProperty,
            me = this,
            results = me.getValues(),
            questionRecord = me.getQuestionRecord(),
            answerString = '',
            correctResponses = questionRecord.get('correctResponse'),
            guessString = '',
            triesAttempted = me.getTriesAttempted(),
            userResponse = [],
            radios = me.query('radiofield'),
            iFeedback = '', tempRadio,
            intLatency = 0;

        me.hideInstructions();

        if (triesAttempted >= me.getTries()) {
            me.showFeedbackPopup();
            me.disableQuestion();
            return;
        }

        me.setTriesAttempted(++triesAttempted);

        for(i=0,ln=correctResponses.length;i<ln;i++){
            answerString += correctResponses[i].Short;
        }

        for (i in results) {
            if (hasOwn.call(results, i)) {
                if (results[i]) {
                    guessString += results[i];
                    userResponse.push({Short:results[i], Long:me.responseKey[results[i]]});
                }
            }
        }

        for(i=0,ln=radios.length;i<ln;i++){
            tempRadio = radios[i];
            if(tempRadio.isChecked() && tempRadio.config.iFeedback){
                iFeedback = tempRadio.config.iFeedback;
            }
        }

        if (answerString.search(guessString) >= 0) {
            // Correct
            if(!iFeedback){
                iFeedback = me.getCorrectfeedback_Text();
            }

            me.showFeedbackPopup(Lang.Correct, iFeedback);
            
            questionRecord.set('blnCorrect', true);
            me.disableQuestion();
        } else {
            if (triesAttempted >= me.getTries()) {
                if(!iFeedback){
                    iFeedback = me.getIncorrectfeedback_Text();
                }
                me.showFeedbackPopup(Lang.Incorrect, iFeedback);
            } else {
                if(!iFeedback){
                    iFeedback = me.getTriesfeedback_Text();
                }
                me.showFeedbackPopup(Lang.Try_Again, iFeedback);
            }
            questionRecord.set('blnCorrect', false);
        }
        questionRecord.set('response', userResponse);
        questionRecord.set('complete', true);

        var d = new Date();
        intLatency = d.getTime() - this.startTime;
        questionRecord.set('intLatency', intLatency);

        if (triesAttempted >= me.getTries()) {
            me.disableQuestion();
        }
        this.fireEvent('questoncomplete', questionRecord);
    },
    disableQuestion: function() {
        var qs = this.query('checkboxfield'),
            i = 0,
            ln = qs.length;
        for (i = 0; i < ln; i++) {
            qs[i].setDisabled(true);
        }
    },
    clearOptions: function() {
        var qs = this.query('checkboxfield'),
            i = 0,
            ln = qs.length;

        for (i = 0; i < ln; i++) {
            qs[i].setChecked(false);
            qs[i].setDisabled(false);
        }
    },
    onResetAnswers: function() {
        this.setTriesAttempted(0);
        this.clearOptions();
    },

    updateInstructions: function(newInstructions, oldInstructions) {
        var me = this;
        me.callParent(arguments);
        newInstructions.on('checkanswer', me.onCheckAnswer, me);
    },

    start: function() {
        var me = this;
        me.callParent(arguments);
        
        me.firstSelect = true;
        me.showInstructions(me.getInitprompt_Text(), false);
        var d = new Date();
        me.startTime = d.getTime();
        me.clearOptions();
        me.setTriesAttempted(0);
        me.setIsActiveItem(true);

        Ext.getCmp('main').query('instructions')[0].on('checkanswerevt', me.onCheckAnswer, me);
    },
    cleanup: function() {
        var me = this;
        me.setIsActiveItem(false);
        me.onCheckAnswer(false);
        me.hideInstructions();
        me.hideFeedbackPopup();
    },
    onPageTap: function(e) {
        var tempTarget = e.target,
            hideins = true;
        while (tempTarget.parentNode) {
            if (tempTarget.id == this.id) {
                hideins = true;
                break;
            } else if (tempTarget.id.match(/radiofield/) || tempTarget.id.match(/instructions/)) {
                hideins = false;
                break
            } else {
                tempTarget = tempTarget.parentNode;
            }
        }
        if (hideins) {
            this.hideInstructions();
        }
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
        me.getComponent('checkAnswerBtn').on('checkanswer', me.onCheckAnswer, me);
        me.getComponent('resetBtn').on('reset', me.onResetAnswers, me);
        me.element.on({
            tap: me.onPageTap,
            scope: me
        });
    }
});

Ext.define('Player.page.questions.TF', {
    extend: 'Player.page.questions.Question',

    alias: ['widget.TF'],

    config: {
        layout: {
            align: 'center',
            type: 'vbox'
        },
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        pageData: {},
        items: [{
            xtype: 'panel',
            html: 'Question Text Goes here....',
            itemId: 'questonText',
            cls: 'questiontext',
            maxWidth: '100%',
            minHeight: '100px',
            minWidth: '250px'
        }, {
            xtype: 'spacer',
            height: 20,
            itemId: 'distractorStart'
        },
        // Distractors go here....
        {
            xtype: 'spacer',
            height: 20
        }, {
            xtype: 'button',
            itemId: 'checkAnswerBtn',
            autoEvent: 'checkanswer',
            text: Lang.Check_Answer,
            cls: 'checkanswer',
            ui: 'checkanswer'
        }, {
            xtype: 'spacer',
            height: 10
        }, {
            xtype: 'button',
            itemId: 'resetBtn',
            autoEvent: 'reset',
            text: Lang.Reset,
            hidden: true
        }, {
            xtype: 'spacer',
            height: 50
        }]
    },

    applyPageData: function(config) {
        return config;
    },

    updateQuestionRecord: function(newRecord, oldRecord) {
        this.callParent(arguments);
        var me = this,
            distractorStartIndex = me.indexOf(me.getComponent('distractorStart')) + 1,
            distractorsList, correctResponse = [],
            newPageData = newRecord.raw;

        // Add question text
        me.getComponent('questonText').setHtml(newPageData.questionText['#text']);

        // Reset Button
        this.getComponent('resetBtn').setHidden(((!newPageData.resetBtn) || (typeof newPageData.resetBtn == 'undefined')));

        // Feedback and instructions
        this.getInstructions().setHtml(this.getInitprompt_Text());

        if (this.getProvideFeedback() === false) {
            this.getComponent('checkAnswerBtn').hide();
        }


        // Add distractors
        distractorsList = [{
            "#text": Lang.True
        }, {
            "#text": Lang.False
        }];

        for (var i = 0, ln = distractorsList.length; i < ln; i++) {
            var distractorData = distractorsList[i];

            var distractorCheckbox = Ext.create('Ext.form.Radio', {
                label: distractorData['#text'],
                name: 'distractor',
                value: (i == 0) ? 'true' : 'false',
                width: 120,
                height: 57,
                //labelWrap: true,
                labelWidth: '100%',
                correct: (!i == newPageData.correctResp),
                styleHtmlContent: true,
                labelCls: 'checkBoxlabel',
                labelAlign: 'right',
                listeners: {
                    check: me.onSelect,
                    scope: me
                }
            });

            distractorCheckbox = me.insert(distractorStartIndex++, distractorCheckbox);
            distractorCheckbox.element.on({
                tap: function(e) {
                    var me = this;
                    if (me.getDisabled()) {
                        return;
                    }
                    //if (e.target.type != 'checkbox') {
                    if(e.target.className.search('x-field-mask')<0){
                        me.setChecked(!me.getChecked())
                    }
                    if (me.getChecked()) {
                        me.fireEvent('check', me, e);
                    } else {
                        me.fireEvent('uncheck', me, e);
                    }
                },
                scope: distractorCheckbox
            });
        }

        // Update Store Refrence
        me.getQuestionRecord().set('correctResponse', newPageData.correctResp);

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },
    onSelect: function() {
        var me = this;
        if (me.firstSelect && me.getProvideFeedback()) {
            me.showInstructions(me.getEvalprompt_Text(), true);
            me.firstSelect = false;
        }
    },
    onCheckAnswer: function(showFeedback) {
        this.callParent(arguments);
        var i, hasOwn = Object.prototype.hasOwnProperty,
            me = this,
            results = me.getValues(),
            questionRecord = me.getQuestionRecord(),
            answerString = questionRecord.get('correctResponse')?'true' : 'false',
            guessString = '',
            triesAttempted = me.getTriesAttempted(),
            intLatency = 0;

        me.hideInstructions();

        if (triesAttempted >= me.getTries()) {
            me.showFeedbackPopup();
            me.disableQuestion();
            return;
        }

        me.setTriesAttempted(++triesAttempted);

        guessString = results.distractor;

        if (answerString === guessString) {
            // Correct
            me.showFeedbackPopup(Lang.Correct, me.getCorrectfeedback_Text());
            questionRecord.set('blnCorrect', true);
            me.disableQuestion();
        } else {
            if (triesAttempted >= me.getTries()) {
                me.showFeedbackPopup(Lang.Incorrect, me.getIncorrectfeedback_Text());
            } else {
                me.showFeedbackPopup(Lang.Try_Again, me.getTriesfeedback_Text());
            }
            questionRecord.set('blnCorrect', false);
        }
        questionRecord.set('response', eval(guessString));
        questionRecord.set('complete', true);

        var d = new Date();
        intLatency = d.getTime() - this.startTime;
        questionRecord.set('intLatency', intLatency);

        if (triesAttempted >= me.getTries()) {
            me.disableQuestion();
        }
        this.fireEvent('questoncomplete', questionRecord);
    },
    disableQuestion: function() {
        var qs = this.query('checkboxfield'),
            i = 0,
            ln = qs.length;
        for (i = 0; i < ln; i++) {
            qs[i].setDisabled(true);
        }
    },
    clearOptions: function() {
        var qs = this.query('checkboxfield'),
            i = 0,
            ln = qs.length;

        for (i = 0; i < ln; i++) {
            qs[i].setChecked(false);
            qs[i].setDisabled(false);
        }
    },
    onResetAnswers: function() {
        this.setTriesAttempted(0);
        this.clearOptions();
    },

    updateInstructions: function(newInstructions, oldInstructions) {
        var me = this;
        me.callParent(arguments);
    },

    start: function() {
        var me = this,
            d = new Date();

        me.callParent(arguments);
        
        me.firstSelect = true;
        me.showInstructions(me.getInitprompt_Text(), false);

        me.startTime = d.getTime();
        me.clearOptions();
        me.setTriesAttempted(0);
        me.setIsActiveItem(true);

        Ext.getCmp('main').query('instructions')[0].on('checkanswerevt', me.onCheckAnswer, me);
    },
    cleanup: function() {
        var me = this;
        me.setIsActiveItem(false);
        me.onCheckAnswer(false);
        me.hideInstructions();
        me.hideFeedbackPopup();
    },
    onPageTap: function(e) {
        var tempTarget = e.target,
            hideins = true;
        while (tempTarget.parentNode) {
            if (tempTarget.id == this.id) {
                hideins = true;
                break;
            } else if (tempTarget.id.match(/radiofield/) || tempTarget.id.match(/instructions/)) {
                hideins = false;
                break
            } else {
                tempTarget = tempTarget.parentNode;
            }
        }
        if (hideins) {
            this.hideInstructions();
        }
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
        me.getComponent('checkAnswerBtn').on('checkanswer', me.onCheckAnswer, me);
        me.getComponent('resetBtn').on('reset', me.onResetAnswers, me);
        me.element.on({
            tap: me.onPageTap,
            scope: me
        });
    }   
});

Ext.define('Player.page.questions.MC', {
    extend: 'Player.page.questions.Question',

    alias: ['widget.MC'],

    config: {
        layout: {
            align: 'center',
            type: 'vbox'
        },
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        pageData: {},
        items: [{
            xtype: 'panel',
            html: 'Question Text Goes here....',
            itemId: 'questonText',
            cls: 'questiontext',
            maxWidth: '100%',
            minHeight: '100px',
            minWidth: '250px'
        }, {
            xtype: 'spacer',
            height: 20,
            itemId: 'distractorStart'
        },
        // Distractors go here....
        {
            xtype: 'spacer',
            height: 20
        }, {
            xtype: 'button',
            itemId: 'checkAnswerBtn',
            autoEvent: 'checkanswer',
            text: Lang.Check_Answer,
            cls: 'checkanswer',
            ui: 'checkanswer'
        }, {
            xtype: 'spacer',
            height: 10
        }, {
            xtype: 'button',
            itemId: 'resetBtn',
            autoEvent: 'reset',
            text: Lang.Reset,
            hidden: true
        }, {
            xtype: 'spacer',
            height: 50
        }]
    },

    applyPageData: function(config) {
        return config;
    },
    updateQuestionRecord: function(newRecord, oldRecord){
        this.callParent(arguments);
        var me = this,
            distractorStartIndex = me.indexOf(me.getComponent('distractorStart')) + 1,
            distractorsList, correctResponse = [],
            newPageData = newRecord.raw,
            alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


        me.responseKey = {};

        // Add question text
        me.getComponent('questonText').setHtml(newPageData.questionText['#text']);

        // Reset Button
        me.getComponent('resetBtn').setHidden(((!newPageData.resetBtn) || (typeof newPageData.resetBtn == 'undefined')));

        // Feedback and instructions
        me.getInstructions().setHtml(me.getInitprompt_Text());

        if (me.getProvideFeedback() === false) {
            me.getComponent('checkAnswerBtn').hide();
        }

        // Add distractors
        if (newPageData.distractors.randomize) {
            var s = [],
                items = newPageData.distractors.distractor;

            while (items.length) {
                s.push(items.splice(Math.random() * items.length, 1)[0]);
            }
            while (s.length) {
                items.push(s.pop());
            }
        }
        distractorsList = newPageData.distractors.distractor;

        for (var i = 0, ln = distractorsList.length; i < ln; i++) {
            var distractorData = distractorsList[i],
                letter,
                longText;
            if (!distractorData || !distractorData['#text']) {
                continue;
            }
            letter = alphabet.shift();
            longText = distractorData['#text'].replace(/(<([^>]+)>)/ig, "");
            if (distractorData.correct) {
                correctResponse.push({Short:letter, Long:longText});
            }
            me.responseKey[letter] = longText;

            var distractorCheckbox = Ext.create('Ext.form.Checkbox', {
                label: distractorData['#text'],
                name: letter,
                width: '75%',
                labelWidth: '100%',
                labelWrap: true,
                correct: distractorData.correct,
                letter: letter,
                iFeedback: distractorData.iFeedback,
                styleHtmlContent: true,
                labelCls: 'checkBoxlabel',
                labelAlign: 'right',
                listeners: {
                    check: me.onSelect,
                    scope: me
                }
            });

            distractorCheckbox = me.insert(distractorStartIndex++, distractorCheckbox);
            distractorCheckbox.element.on({
                tap: function(e) {
                    var me = this;
                    if (this.getDisabled()) {
                        return;
                    }
                    //if (e.target.type != 'checkbox') {
                    if(e.target.className.search('x-field-mask')<0){
                        me.setChecked(!me.getChecked())
                    }
                    if (me.getChecked()) {
                        me.fireEvent('check', me, e);
                    } else {
                        me.fireEvent('uncheck', me, e);
                    }
                },
                scope: distractorCheckbox
            });
        }

        // Update Store Refrence
        me.getQuestionRecord().set('correctResponse', correctResponse);

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },
    onSelect: function() {
        var me = this;
        if (me.firstSelect && me.getProvideFeedback()) {
            me.showInstructions(me.getEvalprompt_Text(), true);
            me.firstSelect = false;
        }
    },
    onCheckAnswer: function(showFeedback) {
        this.callParent(arguments);
        var i, ln, hasOwn = Object.prototype.hasOwnProperty,
            me = this,
            results = me.getValues(),
            questionRecord = me.getQuestionRecord(),
            answerString = '',
            correctResponses = questionRecord.get('correctResponse'),
            guessString = '',
            triesAttempted = me.getTriesAttempted(),
            userResponse = [],
            intLatency = 0;

        me.hideInstructions();

        if (triesAttempted >= me.getTries()) {
            me.showFeedbackPopup();
            me.disableQuestion();
            return;
        }

        me.setTriesAttempted(++triesAttempted);

        for(i=0,ln=correctResponses.length;i<ln;i++){
            answerString += correctResponses[i].Short;
        }

        for (i in results) {
            if (hasOwn.call(results, i)) {
                if (results[i]) {
                    guessString += i;
                    userResponse.push({Short:i, Long:me.responseKey[i]});
                }
            }
        }
        
        if (answerString === guessString) {
            // Correct
            me.showFeedbackPopup(Lang.Correct, me.getCorrectfeedback_Text());
            questionRecord.set('blnCorrect', true);
            me.disableQuestion();
        } else {
            if (triesAttempted >= me.getTries()) {
                me.showFeedbackPopup(Lang.Incorrect, me.getIncorrectfeedback_Text());
            } else {
                me.showFeedbackPopup(Lang.Try_Again, me.getTriesfeedback_Text());
            }
            questionRecord.set('blnCorrect', false);
        }
        questionRecord.set('response', userResponse);
        questionRecord.set('complete', true);

        var d = new Date();
        intLatency = d.getTime() - this.startTime;
        questionRecord.set('intLatency', intLatency);

        if (triesAttempted >= me.getTries()) {
            me.disableQuestion();
        }
        this.fireEvent('questoncomplete', questionRecord);
    },
    disableQuestion: function() {
        var qs = this.query('checkboxfield'),
            i = 0,
            ln = qs.length;
        for (i = 0; i < ln; i++) {
            qs[i].setDisabled(true);
        }
    },
    clearOptions: function() {
        var qs = this.query('checkboxfield'),
            i = 0,
            ln = qs.length;

        for (i = 0; i < ln; i++) {
            qs[i].setChecked(false);
            qs[i].setDisabled(false);
        }
    },
    onResetAnswers: function() {
        this.setTriesAttempted(0);
        this.clearOptions();
    },

    updateInstructions: function(newInstructions, oldInstructions) {
        var me = this;
        me.callParent(arguments);
        newInstructions.on('checkanswer', me.onCheckAnswer, me);
    },

    start: function() {
        var me = this;
        me.callParent(arguments);
        
        me.firstSelect = true;
        me.showInstructions(me.getInitprompt_Text(), false);
        var d = new Date();
        me.startTime = d.getTime();
        me.clearOptions();
        me.setTriesAttempted(0);
        me.setIsActiveItem(true);

        Ext.getCmp('main').query('instructions')[0].on('checkanswerevt', me.onCheckAnswer, me);
    },
    cleanup: function() {
        var me = this;
        me.setIsActiveItem(false);
        me.onCheckAnswer(false);
        me.hideInstructions();
        me.hideFeedbackPopup();
    },
    onPageTap: function(e) {
        var tempTarget = e.target,
            hideins = true;
        while (tempTarget.parentNode) {
            if (tempTarget.id == this.id) {
                hideins = true;
                break;
            } else if (tempTarget.id.match(/checkboxfield/) || tempTarget.id.match(/instructions/)) {
                hideins = false;
                break
            } else {
                tempTarget = tempTarget.parentNode;
            }
        }
        if (hideins) {
            this.hideInstructions();
        }
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
        me.getComponent('checkAnswerBtn').on('checkanswer', me.onCheckAnswer, me);
        me.getComponent('resetBtn').on('reset', me.onResetAnswers, me);
        me.element.on({
            tap: me.onPageTap,
            scope: me
        });
    }
});

Ext.define('Player.page.questions.Intro', {
    extend: 'Player.page.questions.Question',

    alias: ['widget.intro'],

    config: {
        layout: {
            align: 'center',
            type: 'vbox'
        },
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        pageData: {},
        introText: '',
        introHead: '',
        items: [{
                xtype: 'image',
                src: 'resources/img/quizIcon-03.jpg',
                cls: 'quiz-icon',
                width: 176,
                height: 163
            },
           {
                itemId: 'quiztitle',
                cls: 'quiz-intro-heading',
                styleHtmlContent: true,
                html: ''
           },
           {
                itemId: 'quizintro',
                cls: 'quiz-intro-text',
                styleHtmlContent: true,
                html: ''
            }]
    },
    updateIntroText: function(value){
        this.getComponent('quizintro').setHtml(value);
    },
    updateIntroHead: function(value){
        this.getComponent('quiztitle').setHtml(value);  
    },
    initialize: function() {
        this.callParent(arguments);
    }
});

Ext.define('Player.page.questions.Results', {
    extend: 'Player.page.questions.Question',

    alias: ['widget.results'],

    requires: ['Player.page.questions.EmailPopup'],

    config: {
        layout: {
            align: 'center',
            type: 'vbox'
        },
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        statusFailText: Lang.Sorry,
        feedbackFailText: Lang.You_did_not_pass,
        statusSuccessText: Lang.Pass,
        feedbackSuccessText: Lang.Congrats_Pass,
        results: {},
        quizData: {},
        emailPopup: {
            xtype: 'widget.emailpopup'
        },
        items: [{
            styleHtmlContent: true,
            width: 300,
            html: '<img src="resources/img/QuizResultsIcon-02.png" width="100" height="100" /> <div class="quizresulttitle">'+Lang.Quiz_Results+'<div>'
        }, {
            itemId: 'quizResults',
            styleHtmlContent: true,
            tpl: ['<table width="200" border="0" cellpadding="12"><tr>', '<td align="right">'+Lang.Total_Correct+'</td>', '<td>{correct}</td>', '</tr><tr>', '<td align="right">'+Lang.Total_Incorrect+'</td>', '<td>{incorrect}</td>', '</tr><tr>', '<td align="right">'+Lang.Score+'</td>', '<td>{points}</td>', '</tr><tr>', '<td align="right">'+Lang.Possible_Score+'</td>', '<td>{pointsPossible}</td>', '</tr><tr>', '<td align="right">'+Lang.Percentage+'</td>', '<td>{intScore}%</td>', '</tr>', '</table>']
        }, {
            itemId: 'quizfeedback',
            styleHtmlContent: true,
            html: ''
        }, {
            xtype: 'button',
            itemId: 'reviewBtn',
            autoEvent: 'review',
            text: Lang.Review,
            ui: 'checkanswer',
            hidden: true
        }, {
            itemId: 'printMessage',
            styleHtmlContent: true,
            html: ''
        }, {
            xtype: 'button',
            itemId: 'emailBtn',
            autoEvent: 'email',
            text: Lang.Email_Results,
            ui: 'checkanswer',
            hidden: true
        }, {
            xtype: 'button',
            itemId: 'printBtn',
            autoEvent: 'print',
            text: Lang.Print,
            ui: 'checkanswer',
            hidden: true
        }]
    },
    applyResults: function(config) {
        this.getComponent('quizResults').setData(config);
        return config;
    },
    updateResults: function(config) {
        this.getComponent('quizResults').setData(config);
    },

    updateQuizData: function(value) {
        var me = this,
            emailResults = value.email_results,
            printResults = value.print_results,
            incReview = value.incReview;

        me.getComponent('emailBtn').setHidden(((!value.email_results) || (typeof value.email_results == 'undefined')));
        me.getComponent('printBtn').setHidden(((!value.print_results) || (typeof value.print_results == 'undefined')));
        me.getComponent('reviewBtn').setHidden(((!value.incReview) || (typeof value.incReview == 'undefined')));

        if (value.printMessage) {
            me.getComponent('printMessage').setHtml(value.printMessage['#text']);
        }

    },


    onEmail: function() {
        var me = this,
            qData = me.getQuizData();
        if (qData.useServer) {
            me.showEmailPopup();
        } else {
            me.sendEmail(false, false);
        }
        // show popup if use server
        // or mailto:
    },
    showEmailPopup: function() {
        var me = this,
            emailObj = {};

        me.emailPopup = Ext.create('Player.page.questions.EmailPopup', emailObj);
        me.emailPopup.on('close', me.hideEmailPopup, me);
        me.emailPopup.on('submit', me.sendEmail, me);

        //I have to add to main so it will show up in the center no matter what scroll is
        Ext.getCmp('main').add(me.emailPopup);

        me.emailPopup.show();
    },
    hideEmailPopup: function() {
        var me = this;
        me.emailPopup.hide();
        //Ext.getCmp('main').remove(me.emailPopup, true);
    },
    sendEmail: function(e, formData) {
        var me = this,
            cr = "%0D",
            lmsName = '',
            nowDate = new Date(),
            compDate = (nowDate.getMonth() + 1) + "/" + nowDate.getDate() + "/" + nowDate.getFullYear(),
            bodyText = '',
            quizData = me.getQuizData(),
            results = me.getResults(),
            idag, riktig, ikkerett, fin, serverURL = 'http://www.rapidintake.net/send_email.asp',
            winurl, quizTitle = 'Undefined',
            print = formData.print;

        if (!quizData.useServer) {
            cr = "\r";
            bodyText = Lang.Make_Sure_Send;
            for (var i = 1; i < 5; i++) {

                bodyText += cr;
            }
        }

        if (print) {
            cr = "<br/>";
        }

        bodyText += (Lang.Coure_Results_Email.replace("{title}",Player.settings.get('title')) + cr + cr);

        if (quizData.incQuizTitle) {
            try {
                quizTitle = me.parent.getPageData().title;
            } catch (e) {
                quizTitle = 'Undefined';
            }
            bodyText += (Lang.Email_Quiz + quizTitle + cr + cr);
        }

        if (quizData.LMS_name) {
            try {
                lmsName = SCORM.GetStudentName();
            } catch (e) {
                lmsName = '';
            }
            bodyText += Lang.Email_User + lmsName + cr + cr;
        }

        if (quizData.useServer && !print) {
            bodyText += Lang.Email_Learner + formData.name + cr + cr;

            idag = "4/5/20106-7-0910/10/2011" + compDate + "3/4/0911/12/20091-1-12";
            riktig = "1468790234" + results.correct + "0223859410";
            ikkerett = "938547012312" + results.incorrect + "7894728301";
            fin = "01293847563459" + results.intScore + "6758102938";

            if (quizData.serverURL) {
                serverURL = quizData.serverURL;
            }
            winurl = serverURL + "?From=" + formData.name + "&To=" + quizData.sendToEmail + "&Subject=" + quizData.emailSubject + "&Body=" + bodyText + "&idag=" + idag + "&riktig=" + riktig + "&ikkerett=" + ikkerett + "&fin=" + fin;
        } else if (print) {
            bodyText += Lang.Email_DateCompleted + compDate + cr + cr + Lang.Email_TotalCorrect + results.correct + cr + Lang.Email_TotalIncorrect + results.incorrect + cr + Lang.Email_Percent + results.intScore + cr + cr;
            winurl = '';
        } else {
            bodyText += Lang.Email_DateCompleted + compDate + cr + cr + Lang.Email_TotalCorrect + results.correct + cr + Lang.Email_TotalIncorrect + results.incorrect + cr + Lang.Email_Percent + results.intScore + cr + cr;
            winurl = 'mailto:' + quizData.sendToEmail + '?subject=' + quizData.emailSubject + '&body=' + escape(bodyText);
        }
        win = window.open(winurl, Lang.Email_Window);

        if (print) {
            win.document.write('<html><head><title>'+Lang.Email_Window+'</title></head><body ><img src="resources/img/QuizResultsIcon-02.png" width="100" height="100" />' + bodyText + '</body></html>');
            win.print();
        }

        if (win && win.open && !win.closed) {
            me.hideEmailPopup();
        }
    },
    onPrint: function() {
        this.sendEmail(null, {
            print: true
        });
    },

    onReview: function() {
        this.fireEvent('review');
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
        me.getComponent('reviewBtn').on('review', me.onReview, me);
        me.getComponent('emailBtn').on('email', me.onEmail, me);
        me.getComponent('printBtn').on('print', me.onPrint, me);
    }
});

Ext.define('Player.page.Quiz', {
    extend: 'Ext.carousel.Carousel',

    requires: ['Player.page.questions.MCH', 'Player.page.questions.MC', 'Player.page.questions.TF', 'Player.page.questions.Results', 'Player.page.questions.Review','Player.page.questions.Intro'],

    config: {
        layout: 'vbox',
        indicator: false,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        pType: 'Quiz',
        quizRecord: null,
        quizMode: 'test',
        recordId: '',
        locked: 'none',
        pageData: {
            title: 'Page Title 2',
            pText: ''
        },
        listeners: [{
            fn: 'onCarouselActiveItemChange',
            event: 'activeitemchange'
        }]
    },

    onCarouselActiveItemChange: function(container, value, oldValue, options) {
        var me = this,
            mp = Ext.getCmp("mainPages"),
            mpActiveIindex = mp.getActiveIndex(),
            quizRecord = me.getQuizRecord();
        if (!me.isActive) {
            return;
        }
        var i = me.getActiveIndex();
        
        if (i === 0) {
            // First Page
            Player.app.fireEvent('lockPages', 'right');
            if(mpActiveIindex > 0){
                Player.app.fireEvent('lockButtonDirection', 'none');
            }
            else{
                Player.app.fireEvent('lockButtonDirection', 'left');
            }
            
        } else if (i + 1 === me.innerItems.length) {
            if(value.xtype == 'review'){
                // REVIEW page
                Player.app.fireEvent('lockPages', 'left');
                if(mpActiveIindex == mp.items.length-1){

                    Player.app.fireEvent('lockButtonDirection', 'right');
                }
                else{
                    me.setLocked('none');
                    Player.app.fireEvent('lockButtonDirection', 'none');
                }
            }
            else{
                Player.app.fireEvent('lockPages', 'left');
                // Last page
                if(mpActiveIindex == mp.items.length-1){
                    if(me.getQuizMode() == 'test'){
                        Player.app.fireEvent('lockButtonDirection', 'both');
                    }
                    else{
                        Player.app.fireEvent('lockButtonDirection', 'right');    
                    }
                }
                else{
                    if(me.getQuizMode() == 'test'){
                        Player.app.fireEvent('lockButtonDirection', 'left'); 
                    }
                    else{
                        Player.app.fireEvent('lockButtonDirection', 'none');    
                    }
                    
                }    
            }
        } else {
            Player.app.fireEvent('lockPages', 'both');

            if(me.getQuizMode() == 'test'){
                me.setLocked('left');
                Player.app.fireEvent('lockButtonDirection', 'left');
            }
            else{
                Player.app.fireEvent('lockButtonDirection', 'none');
            }
            // a Middle page
        }
        oldValue.cleanup();

        value.start();

        if(quizRecord.raw.number_questions){
            Player.app.fireEvent('updatePageNumber', value.config.adjustedPageNumber);
        }
    },

    applyPageData: function(config) {
        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this,
            qs = Ext.getStore("Quizes"),
            quizRecord = qs.findRecord('id', newPageData.id),
            quizData = quizRecord.raw,
            questionsToAsk, questionsList, i, questionData, questionRecord, panel, s, data, errorStr,
            startPageNumber = newPageData.pageNum+1-quizData.numquestions,
            introPageOffset = 0;

        me.setQuizRecord(quizRecord);
        // Add INTRO
        if (quizData.includeIntro && quizData.introText) {
            startPageNumber -= 1;
            introPageOffset = 1;
            panel = Ext.create('Player.page.questions.Intro', {
                introHead: quizData.introText.heading,
                introText: quizData.introText['#text'],
                adjustedPageNumber: startPageNumber
            });
            me.add(panel);
        }

        // Add QUESTIONS
        if (quizData.randomize) {
            s = [];
            // Randomize the array
            while (quizData.question.length) {
                s.push(quizData.question.splice(Math.random() * quizData.question.length, 1)[0]);
            }
            while (s.length) {
                quizData.question.push(s.pop());
            }
        }

        questionsList = quizData.question;

        if (quizData.useSupset || quizData.useSubset) {
            questionsToAsk = quizData.numquestions;
        } else {
            questionsToAsk = questionsList.length;
        }

        me.setQuizMode(quizData.quizmode);

        /// generate global feedback
        feedbackObject = {};
        if(quizData.feedback){
            if (quizData.feedback.initPrompt) {
                feedbackObject.initprompt_Text = quizData.feedback.initPrompt['#text'];
            }
            if (quizData.feedback.evalPrompt) {
                feedbackObject.evalprompt_Text = quizData.feedback.evalPrompt['#text'];
            }
            if (quizData.feedback.correctFeedback) {
                feedbackObject.correctfeedback_Text = quizData.feedback.correctFeedback['#text'];
            }
            if (quizData.feedback.incorrectFeedback) {
                feedbackObject.incorrectfeedback_Text = quizData.feedback.incorrectFeedback['#text'];
            }
            if (quizData.feedback.triesFeedback) {
                feedbackObject.triesfeedback_Text = quizData.feedback.triesFeedback['#text'];
            }
            if (quizData.feedback.tries) {
                feedbackObject.tries = quizData.feedback.tries;
            }
            if (typeof quizData.feedback.provide == 'boolean') {
                feedbackObject.provideFeedback = quizData.feedback.provide;
            }
        }
        
        for (i = 0, ln = questionsToAsk; i < ln; i++) {
            questionData = questionsList[i];
            questionRecord = quizRecord.questionsStore.findRecord('id', questionData.id);
            
            try {
                panel = Ext.create('Player.page.questions.' + questionData.qtype, Ext.Object.merge({
                    questionRecord: questionRecord,
                    listeners: {
                        questoncomplete: me.onQuestionComplete,
                        scope: this
                    },
                    adjustedPageNumber: startPageNumber+i+introPageOffset
                }, feedbackObject));
                me.add(panel);
            } catch (e) {
                debugger;
                data = '';
                try {
                    data = JSON.stringify(questionData);
                } catch (ee) {}
                errorStr = 'Error:: Could not creating quiz question. Type: ' + questionData.qtype + ' Error:' + e + ' Data:' + data;
                //throw errorStr;
            }
        }

        // Add RESULTS
        if (quizData.showresults) {
            panel = Ext.create('Player.page.questions.Results', {
                itemId: 'quizResults',
                results: {},
                listeners: {
                    review: me.onReview,
                    scope: this
                },
                quizData: quizData,
                adjustedPageNumber:newPageData.pageNum+1
            });
            me.add(panel);
        }
        //
    },
    onQuestionComplete: function() {
        var me = this,
            quizRecord = me.getQuizRecord(),
            i, ln = me.items.length,
            allComplete = true,
            tempQuestion, tempQuestionRecord,
            percentage = 0,
            pass = false;

        /*if(me.getActiveItem().xtype == 'results' && me.getActiveIndex() == me.getItems().length-1){
        // TODO: Check to see if on last page otherwise return;
        }*/


        for (i = 0; i < ln; i++) {
            tempQuestion = me.items.items[i];
            tempQuestionRecord = tempQuestion.getQuestionRecord();
            if (tempQuestionRecord && !tempQuestionRecord.get('complete')) {
                allComplete = false;
                break;
            }
        }
        if (allComplete) {
            me.recordedScore = true;
            me.clearResults();
            // Record Each Question
            for (i = 0; i < ln; i++) {
                tempQuestion = me.items.items[i];
                tempQuestionRecord = tempQuestion.getQuestionRecord();
                if (tempQuestionRecord) {
                    me.updateResults(tempQuestionRecord);
                }
            }
            
            // Calculate Pass/Fail, percentage
            percentage = Math.round((quizRecord.get('points') / quizRecord.get('pointsPossible')) * 100);
            quizRecord.set('intScore', percentage);
            
            pass = (percentage >= quizRecord.get('passingScore'));
            quizRecord.set('passed', pass);

            if(quizRecord.raw.showresults){
                me.getComponent('quizResults').setResults(quizRecord.data);    
            }
            

            // SCORM Recording
            if(quizRecord.get('reportScore')){
                try{
                    var success = SCORM.SetScore(percentage, quizRecord.get('intMaxScore'), quizRecord.get('intMinScore'));
                }catch(e){}
            }
            
            switch(quizRecord.get('recordStatus')){
                case 'none':
                    quizRecord.set('complete', true);
                    break;
                case 'passFail':
                    if(pass){
                        try{
                            var success = SCORM.SetPassed();
                        }catch(e){}
                        quizRecord.set('complete', true);
                    }else{
                        try{
                            var success = SCORM.SetFailed();
                        }catch(e){}
                        quizRecord.set('complete', true);
                    }
                    break;
                case 'completed':
                    try{
                        var success = SCORM.SetReachedEnd();
                    }catch(e){}
                    quizRecord.set('complete', true);
                    break;
                case 'passIncomplete':
                    if(pass){
                        try{
                            var success = SCORM.SetPassed();
                        }catch(e){}
                        quizRecord.set('complete', true);
                    }else{
                        try{
                            var success = SCORM.ResetStatus();
                        }catch(e){}
                        quizRecord.set('complete', false);
                    }
                    break;
                case 'apiPassFail':
                    if(pass){
                        quizRecord.set('complete', true);
                    }else{
                        quizRecord.set('complete', false);
                    }
                    break;
                case 'apiCompleted':
                    quizRecord.set('complete', true);
                    break;
                default:
                    quizRecord.set('complete', true);
                    break;
                
            }

            // Mark page complere
            if(quizRecord.get('complete')){
                Player.app.fireEvent('pageComplete');
            }
        }
    },
    updateResults: function(questionRecord) {
        var me = this,
            quizRecord = me.getQuizRecord(),
            quizData = quizRecord.data,
            questionData = questionRecord.data;

        if(questionData.blnCorrect) {
            quizRecord.set('correct', ++quizData.correct);
            quizRecord.set('points', quizData.points + questionData.intWeighting);
        } else {
            quizRecord.set('incorrect', ++quizData.incorrect);
        }
        quizRecord.set('pointsPossible', quizData.pointsPossible + questionData.intWeighting);

        try {
            console.log("DATA:" + JSON.stringify(questionData));
        } catch(e) {}

        if(questionData.tracking) // && using Scorm?
        {
            switch(questionData.trackingType) {
            case 'MC':
            case 'MCH':
                try {
                    var scormResponses = [],
                        scormCorrectResponses = [],
                        tempResponse;
                    for(var i = 0, ln = questionData.response.length; i < ln; i++) {
                        tempResponse = questionData.response[i];
                        scormResponses.push(SCORM.CreateResponseIdentifier(tempResponse.Short, tempResponse.Long));
                    };
                    for(var i = 0, ln = questionData.correctResponse.length; i < ln; i++) {
                        tempResponse = questionData.correctResponse[i];
                        scormCorrectResponses.push(SCORM.CreateResponseIdentifier(tempResponse.Short, tempResponse.Long));
                    };
                    var success = SCORM.RecordMultipleChoiceInteraction(questionData.strID, scormResponses, questionData.blnCorrect, scormCorrectResponses, questionData.strDescription.replace(/(<([^>]+)>)/ig, ""), questionData.intWeighting, questionData.intLatency, questionData.strLearningObjectiveID);
                } catch(e) {
                    console.log("MCH Error:" + e);
                }
                break;
            case 'TF':
                try {
                    var success = SCORM.RecordTrueFalseInteraction(questionData.strID, questionData.response, questionData.blnCorrect, questionData.correctResponse, questionData.strDescription.replace(/(<([^>]+)>)/ig, ""), questionData.intWeighting, questionData.intLatency, questionData.strLearningObjectiveID);
                } catch(e) {}
                break;
            default:
                throw("Cannot Track type:" + questionData.trackingType);
                break;
            }
        }
    },
    clearResults: function() {
        var me = this,
            pData = me.getPageData(),
            quizRecord = me.getQuizRecord();

        quizRecord.set('correct', 0);
        quizRecord.set('points', 0);
        quizRecord.set('incorrect', 0);
        quizRecord.set('pointsPossible', 0);
        quizRecord.set('intScore', 0);
    },
    onReview: function() {
        var me = this,
            pData = me.getPageData(),
            quizRecord = me.getQuizRecord(),
            panel;
            
        me.remove(me.getComponent('quizReview'))

        panel = Ext.create('Player.page.questions.Review', {
            itemId: 'quizReview',
            results: {},
            listeners: {
                retake: me.onRetake,
                scope: me
            },
            adjustedPageNumber: pData.pageNum+1,
            quizRecord: quizRecord
        });
        me.add(panel);

        me.next();
    },
    onRetake: function() {
        var me = this;
        me.setActiveItem(0);
        me.remove(me.getComponent('quizReview'));
    },

    initialize: function() {
        var me = this;
        me.setAnimation({
            duration: 500,
            easing: {
                type: 'ease-in-out'
            }
        });

        me.setActiveItem(0);
        me.callParent(arguments);
        me.clearResults();
    },
    start: function() {
        var me = this,
            pData = me.getPageData(),
            quizRecord = me.getQuizRecord();

        me.isActive = true;
        if (me.innerItems.length > 1) {
            Player.app.fireEvent('lockPages', 'right');
        }
        me.getActiveItem().start();

        if(me.getQuizMode() == 'test'){
            me.setLocked('left');
            Player.app.fireEvent('lockButtonDirection', 'left');
        }

        // Adjust page number if counting questions
        if(quizRecord.raw.number_questions){
            Player.app.fireEvent('updatePageNumber', me.getActiveItem().config.adjustedPageNumber);
        }
        me.recordedScore = false;
    },
    close: function() {
        try{
            Ext.getCmp('main').getComponent('instructions').setHidden(true);
        }catch(e){console.log("e:"+e);}
        this.getActiveItem().cleanup();
        this.isActive = false;
        Player.app.fireEvent('lockPages', 'none');
        
        
    },
    setRendered: function(rendered) {
        var me = this,
            wasRendered = me.rendered;

        if (rendered !== wasRendered) {
            me.rendered = rendered;

            var items = me.items.items,
                carouselItems = me.carouselItems,
                i, ln, item;

            for (i = 0,ln = items.length; i < ln; i++) {
                item = items[i];

                if (!item.isInnerItem()) {
                    item.setRendered(rendered);
                }
            }
            // Why is carouselItems null??? Maybe I should return false?
            if(!carouselItems){
                return true;
            }
            for (i = 0,ln = carouselItems.length; i < ln; i++) {
                carouselItems[i].setRendered(rendered);
            }

            return true;
        }

        return false;
    },
    onDragStart: function(e) {
        var me = this,
            lockDir = me.getLocked();

        if(e.deltaX>0 && (lockDir == 'left' || lockDir == 'both')){
            return;
        }
        else if(e.deltaX<0 && (lockDir == 'right' || lockDir == 'both')){
            return;
        }

        me.callParent(arguments);
    },

    onDrag: function(e) {
        var me = this,
            lockDir = me.getLocked();

        if(e.deltaX>0 && (lockDir == 'left' || lockDir == 'both')){
            return;
        }
        else if(e.deltaX<0 && (lockDir == 'right' || lockDir == 'both')){
            return;
        }

        me.callParent(arguments);
    },

    onDragEnd: function(e) {
        var me = this,
            lockDir = me.getLocked();

        if(e.deltaX>0 && (lockDir == 'left' || lockDir == 'both')){
            return;
        }
        else if(e.deltaX<0 && (lockDir == 'right' || lockDir == 'both')){
            return;
        }

        me.callParent(arguments);
    }



});

/*
 * File: app/model/ScoSetting.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.0.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Player.model.ScoSetting', {
    extend: 'Ext.data.Model',
    alias: 'model.scosetting',
    config: {
        fields: [
            {
                defaultValue: 0,
                name: 'projectId',
                type: 'int'
            },
            {
                name: 'narration',
                type: 'boolean'
            },
            {
                name: 'glossary',
                type: 'boolean'
            },
            {
                name: 'exitButton',
                type: 'boolean'
            },
            {
                name: 'pageNumbering',
                type: 'boolean'
            },
            {
                defaultValue: 'none',
                name: 'tracking',
                type: 'string'
            },
            {
                name: 'completion',
                type: 'string'
            },
            {
                name: 'pageComplete',
                type: 'boolean'
            },
            {
                name: 'autoNavigation',
                type: 'boolean'
            },
            {
                name: 'title',
                type: 'string'
            },
            {
			    defaultValue: false,
                name: 'activateTimer',
                type: 'boolean'
            },
            {
			    defaultValue: 10,
                name: 'timerSeconds',
                type: 'int'
            },
            {
                defaultValue: false,
                name: 'persIndex',
                type: 'boolean'
            },
            {
                defaultValue: false,
                name: 'autoHideToc',
                type: 'boolean'
            },
            {
                defaultValue: false,
                name: 'showHelpOnStart',
                type: 'boolean'
            },
            {
                defaultValue: false,
                name: 'showTocFirst',
                type: 'boolean'
            }
        ],
        proxy: {
            type: 'ajax',
            url: 'data/settings.json'
        }
    }
});
/*
 * File: app/model/Quiz.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.0.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Player.model.Quiz', {
    extend: 'Ext.data.Model',
    alias: 'model.quiz',
    uses: [
        'Player.model.Question'
    ],
    config: {
        fields: [
            {
                name: 'quizmode'
            },
            {
                name: 'intScore',
                type: 'float'
            },
            {
                defaultValue: 100,
                name: 'intMaxScore',
                type: 'float'
            },
            {
                defaultValue: 0,
                name: 'intMinScore',
                type: 'float'
            },
            {
                defaultValue: 0,
                name: 'points',
                type: 'int'
            },
            {
                defaultValue: 0,
                name: 'pointsPossible',
                type: 'int'
            },
            {
                defaultValue: 0,
                name: 'correct',
                type: 'int'
            },
            {
                defaultValue: 0,
                name: 'incorrect',
                type: 'int'
            },
            {
                defaultValue: false,
                name: 'reportScore',
                type: 'boolean'
            },
            {
                defaultValue: 'none',
                name: 'recordStatus',
                type: 'string'
            },
            {
                defaultValue: 70,
                name: 'passingScore',
                type: 'int'
            },
            {
                defaultValue: false,
                name: 'passed',
                type: 'boolean'
            },
            {
                defaultValue: false,
                name: 'complete',
                type: 'boolean'
            }
        ],
        hasMany: {
            associationKey: 'question',
            model: 'Player.model.Question'
        }
    }
});

Ext.define('Player.model.Question', {
    extend: 'Ext.data.Model',
    alias: 'model.question',
    config: {
        fields: [
            {
                name: 'qtype'
            },
            {
                mapping: 'id',
                name: 'strID',
                type: 'string'
            },
            {
                mapping: 'qtype',
                name: 'trackingType',
                type: 'string'
            },
            {
                defaultValue: false,
                name: 'complete',
                type: 'boolean'
            },
            {
                name: 'response',
                type: 'auto'
            },
            {
                name: 'blnCorrect',
                type: 'boolean'
            },
            {
                name: 'correctResponse',
                type: 'auto'
            },
            {
                mapping: 'questionText[\'#text\']',
                name: 'strDescription',
                type: 'string'
            },
            {
                defaultValue: 1,
                mapping: 'weight',
                name: 'intWeighting',
                type: 'int'
            },
            {
                name: 'intLatency',
                type: 'int'
            },
            {
                mapping: 'objectiveID',
                name: 'strLearningObjectiveID',
                type: 'string'
            },
            {
                defaultValue: false,
                name: 'tracking',
                type: 'boolean'
            }
        ]
    }
});
Ext.define('Player.view.TableOfContents', {
    extend: 'Ext.dataview.NestedList',
    alias: 'widget.tableofcontents',

    config: {
        ui: 'light',
        width: 250,
        autoDestroy: false,
        displayField: 'title',
        title: Lang.Table_Of_Contents,
        useTitleAsBackText: false,
        toolbar: {
            xtype: 'titlebar',
            items: [
                {
                    xtype: 'button',
                    hidden: true,
                    itemId: 'closeToc',
                    ui: 'round',
                    text: Lang.Close,
                    action: 'showtoc',
                    align: 'right'
                }
            ]
        }
    },

    setActiveItem: function(list) {
        var me = this,
        store;

        if (list.store) {
            store = list.store;

        } else {
            try {
                store = list.getStore();
            } catch (e) {}
            }

            if (store) {
                var removeitems = [];
                for (var i = 0, ln = store.data.all.length; i < ln; i++) {
                    if (!store.data.all[i].data.isTocEntry && store.data.all[i].isLeaf()) {
                        removeitems.push(store.data.all[i]);
                    }
                }
                store.remove(removeitems);
            }

            try{
                MathJax.Hub.PreProcess(me.element.dom);
                MathJax.Hub.Process(me.element.dom);
            }catch(e){}

                return me.callParent(arguments);
    },

    getItemTextTpl: function(node) {
        var checkIcon = 'resources/img/check02-12.png';
        return  '<tpl if="leaf !=  true">'+
        '<div style="width:202px; font-weight: bold; ">{title}</div><div style="position:absolute; right:0; top:25%; margin: 4px;"><img src="resources/img/tocArrow-02.png"/></div></div>'+
        '</tpl>'+
        '<tpl if="leaf === true && complete != true && restrictedTopicId !== false">'+
        '<span  class="tocLabelDisabled">{title}</span>'+
        '</tpl>'+
        '<tpl if="leaf === true && complete != true && restrictedTopicId === false">'+
        '<span  class="tocLabel">{title}</span>'+
        '</tpl>'+
        '<tpl if="complete === true && leaf ===  true">'+
        '<div id="page_{pageId}"><img src="'+checkIcon+'" style="width: 17px; height:19px; padding-top: 4px; padding-right: 4px;" /><span  class="tocLabel">{title}</span></div>'+
        '</tpl>';
    }

});
Ext.define('Player.view.UpperToolBar', {
    extend: 'Ext.Panel',
    alias: 'widget.uppertoolbar',

    config: {
        baseCls: 'x-toolbar',
        height: 47,
        layout: {
            align: 'center',
            type: 'hbox'
        },
        ui: 'dark',
        hideAnimation: {
            type: 'slideOut',
            direction: 'up',
            duration: 400
        },
        showAnimation: {
            type: 'slideIn',
            direction: 'down',
            duration: 400
        },
        items: [
            {
                xtype: 'button',
                height: 30,
                hidden: true,
                itemId: 'tocBtn',
                text: Lang.Table_Of_Contents,
                action: 'showtoc',
                zIndex: 24 
            },
            {
                xtype: 'spacer',
                width: 10
            },
            {
                xtype: 'panel',
                layout: {
                    type: 'vbox'
                },
                items: [
                    {
                        xtype: 'label',
                        cls: [
                            'coursetitle'
                        ],
                        html: 'Course Title',
                        itemId: 'courseTitle'
                    },
                    {
                        xtype: 'label',
                        cls: [
                            'topictitle'
                        ],
                        html: 'Topic Title',
                        itemId: 'topicTitle'
                    }
                ]
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button',
                id: 'helpBtn',
                itemId: 'helpBtn',
                cls: 'help-btn',
                height: 28,
                width: 28,
                ui: 'plain',
                zIndex: 24 
            },
            {
                xtype: 'button',
                cls: 'close-btn',
                id: 'closeBtn',
                height: 28,
                width: 28,
                itemId: 'closeBtn',
                ui: 'plain',
                zIndex: 24 
            },
            {
                xtype: 'container',
                centered: true,
                cls: [
                    'upperToolbarIcon'
                ],
                height: 47,
                hidden: false,
                itemId: 'upperToolbarIcon',
                width: '100%',
                zIndex: 14 
            }
        ]
    }

});
Ext.define('Player.view.tablet.UpperToolBar', {
    extend: 'Player.view.UpperToolBar',
    alias: 'widget.uppertoolbartablet',

    config: {
        baseCls: 'x-toolbar',
        height: 47,
        layout: {
            align: 'center',
            type: 'hbox'
        },
        ui: 'dark',
        items: [
            {
                xtype: 'button',
                height: 30,
                hidden: true,
                itemId: 'tocBtn',
                text: Lang.Table_Of_Contents,
                action: 'showtoc',
                zIndex: 24 
            },
            {
                xtype: 'spacer',
                width: 10
            },
            {
                xtype: 'panel',
                layout: {
                    type: 'vbox'
                },
                items: [
                    {
                        xtype: 'label',
                        cls: [
                            'coursetitle'
                        ],
                        html: 'Course Title',
                        itemId: 'courseTitle'
                    },
                    {
                        xtype: 'label',
                        cls: [
                            'topictitle'
                        ],
                        html: 'Topic Title',
                        itemId: 'topicTitle'
                    }
                ]
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button',
                cls: 'help-btn',
                height: 28,
                width: 28,
                id: 'helpBtn',
                itemId: 'helpBtn',
                padding: '5 10 5 5',
                ui: 'plain',
                iconMask: false,
                zIndex: 24 
            },
            {
                xtype: 'button',
                cls: 'close-btn',
                id: 'closeBtn',
                height: 28,
                width: 28,
                padding: '5 10 5 5',
                ui: 'plain',
                iconMask: false,
                zIndex: 24 
            },
            {
                xtype: 'container',
                centered: true,
                cls: [
                    'upperToolbarIcon'
                ],
                height: 47,
                hidden: true,
                itemId: 'upperToolbarIcon',
                width: '100%',
                zIndex: 14 
            }
        ]
    }

});
Ext.define('Player.view.phone.UpperToolBar', {
    extend: 'Player.view.UpperToolBar',
    alias: 'widget.uppertoolbarphone',

    config: {
        baseCls: 'x-toolbar',
        height: 47,
        layout: {
            align: 'center',
            type: 'hbox'
        },
        ui: 'dark',
        hideAnimation: {
            type: 'slideOut',
            direction: 'up',
            duration: 400
        },
        showAnimation: {
            type: 'slideIn',
            direction: 'down',
            duration: 400
        },
        items: [
            
            {
                xtype: 'panel',
                layout: {
                    type: 'vbox'
                },
                items: [
                    {
                        xtype: 'label',
                        cls: [
                            'coursetitle'
                        ],
                        html: 'Course Title',
                        itemId: 'courseTitle'
                    },
                    {
                        xtype: 'label',
                        cls: [
                            'topictitle'
                        ],
                        html: 'Topic Title',
                        itemId: 'topicTitle'
                    }
                ]
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button',
                cls: 'help-btn',
                height: 28,
                width: 28,
                id: 'helpBtn',
                itemId: 'helpBtn',
                padding: '5 10 5 5',
                ui: 'plain',
                iconMask: false,
                zIndex: 24 
            },
            {
                xtype: 'button',
                cls: 'close-btn',
                id: 'closeBtn',
                height: 28,
                width: 28,
                padding: '5 10 5 5',
                ui: 'plain',
                iconMask: false,
                zIndex: 24 
            },
            {
                xtype: 'container',
                centered: true,
                cls: [
                    'upperToolbarIcon'
                ],
                height: 47,
                hidden: false,
                itemId: 'upperToolbarIcon',
                width: '100%',
                zIndex: 14 
            }
        ]
    }

});
Ext.define('Player.view.Pages', {
    extend: 'Ext.carousel.Carousel',
    alias: 'widget.pages',

    config: {
        height: '100%',
        width: '100%',
        indicator: false,
        locked: 'none',
        items: [
            {
                xtype: 'panel'
            }
        ],
        listeners: [
            {
                fn: 'onCarouselInitialize',
                event: 'initialize'
            }
        ]
    },

    onCarouselInitialize: function(component, options) {
        this.setAnimation({
            duration: 500,
            easing: {
                type: 'ease-in-out'
            }
        });
    },

    onDragStart: function(e) {
        var me = this,
        lockDir = me.getLocked();

        if(e.deltaX>0 && (lockDir == 'left' || lockDir == 'both')){
            return;
        }
        else if(e.deltaX<0 && (lockDir == 'right' || lockDir == 'both')){
            return;
        }

        me.callParent(arguments);
    },

    onDrag: function(e) {
        var me = this,
        lockDir = me.getLocked();

        if(e.deltaX>0 && (lockDir == 'left' || lockDir == 'both')){
            return;
        }
        else if(e.deltaX<0 && (lockDir == 'right' || lockDir == 'both')){
            return;
        }

        me.callParent(arguments);
    },

    onDragEnd: function(e) {
        var me = this,
        lockDir = me.getLocked();

        if (e.deltaX > 0 && (lockDir == 'left' || lockDir == 'both')) {
            return;
        } else if (e.deltaX < 0 && (lockDir == 'right' || lockDir == 'both')) {
            return;
        }

        var now = Ext.Date.now(),
        itemLength = me.itemLength,
        threshold = itemLength / 2,
        offset = me.offset,
        activeIndex = me.getActiveIndex(),
        maxIndex = me.getMaxItemIndex(),
        animationDirection = 0,
        flickDistance = offset - me.flickStartOffset,
        flickDuration = now - me.flickStartTime,
        indicator = me.getIndicator(),
        velocity;


        if (flickDuration > 0 && Math.abs(flickDistance) >= 10) {
            velocity = flickDistance / flickDuration;

            if (Math.abs(velocity) >= 1) {
                if (velocity < 0 && activeIndex < maxIndex) {
                    animationDirection = -1;
                } else if (velocity > 0 && activeIndex > 0) {
                    animationDirection = 1;
                }
            }
        }

        if (animationDirection === 0) {
            if (activeIndex < maxIndex && offset < -threshold) {
                animationDirection = -1;
            } else if (activeIndex > 0 && offset > threshold) {
                animationDirection = 1;
            }
        }

        if (animationDirection !== 0) {
            //Player.app.fireEvent('beforePageSwitch');
        }

        me.callParent(arguments);
    },
    setOffsetAnimated: function(offset){
        if(Math.abs(offset)>0){
            Player.app.fireEvent('beforePageSwitch');
        }
        
        this.callParent(arguments);
    }

});
Ext.define('Player.view.NarrationPanel', {
    extend: 'Ext.Panel',
    alias: 'widget.narrationpanel',

    config: {
        centered: true,
        height: 250,
        width: 250,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        draggable: {
            direction: 'both',
            constraint: {
                min: {x: -900, y: -900},
                max: {x: 900, y: 900}
            },
            listeners: {
                dragstart: function(component, index, target, record, eventObject, options) {
                    //debugger;
                    var elem = component.getElement();
                }
            }
        },
        narrationText: 'asdf',
        items: [
            {
                xtype: 'toolbar',
                docked: 'top',
                title: Lang.Narration,
                items: [
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'button',
                        id: 'closeNarration',
                        itemId: 'closeNarration',
                        ui: 'round',
                        iconCls: 'delete',
                        iconMask: true,
                        align: 'right'
                    }
                ]
            }
        ],
        listeners: [
            {
                fn: 'onClose',
                event: 'tap',
                delegate: '#closeNarration'
            }
        ]
    },
    updateNarrationText: function(newNarrationText){
        //var me = this;
        this.setHtml(newNarrationText);

    },
    onClose:function(){
        this.destroy();
    }


});
Ext.define('Player.view.TimerBar', {
    extend: 'Ext.Toolbar',
    alias: 'widget.timerbar',

    config: {
        docked: 'top',
        height: 47,
        ui: 'timer',
        title: 'Time: 00:00:00'
    }

});
Ext.define('Player.view.Glossary', {
    extend: 'Ext.dataview.NestedList',
    alias: 'widget.glossary',

    config: {
        displayField: 'title',
        store: 'GlossaryTreeStore',
        title: Lang.Glossary,
        toolbar: {
            xtype: 'titlebar',
            ui: 'dark',
            items: [
                {
                    xtype: 'button',
                    id: 'closeGlossaryBtn',
                    ui: 'round',
                    text: Lang.Close,
                    align: 'right'
                }
            ]
        }
    },

    getItemTextTpl: function(node) {
        return    '<tpl if="leaf !==  true">'+
        '<div style="width 250px"><div style="float: left; width:160px; margin: 4px;"><span class="tocTopic" style="float:none">{title} ({numDef})</span></div>'+
        '<div style="float: right; width:10px; margin: 4px;"><img src="resources/img/tocArrow-02.png"/></div></div>'+
        '</tpl>'+
        '<tpl if="leaf === true">'+
        '<span  class="tocLabel">{title}</span>'+
        '</tpl>';
    }

});
Ext.define('Player.view.LowerToolBar', {
    extend: 'Ext.Container',
    

    config: {
        baseCls: 'x-toolbar',
        docked: 'bottom',
        height: 47,
        layout: {
            align: 'center',
            pack: 'center',
            type: 'hbox'
        },
        cls: [
            'x-toolbar-light'
        ],
        hideAnimation: {
            type: 'slideOut',
            direction: 'down',
            duration: 400
        },
        showAnimation: {
            type: 'slideIn',
            direction: 'up',
            duration: 400
        },
        items: [
            {
                xtype: 'button',
                id: 'previousPageBtn',
                itemId: 'mybutton3',
                cls: ['page-btn','previous-btn'],
                height: 28,
                width: 28,
                ui: 'plain'
                
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button',
                id: 'narrationTextBtn',
                cls: (Ext.os.is.Phone)?'narration-btn-phone':'narration-btn',
                itemId: 'mybutton4',
                ui: 'plain',
                text: Lang.Narration,
                //iconCls: 'narration_btn',
                //iconMask: true
            },
            {
                xtype: 'spacer',
                cls: 'line-spacer',
                height: 37
            },
            {
                xtype: 'button',
                hidden: true,
                itemId: 'phoneTocBtn',
                cls: 'index-btn',
                ui: 'plain',
                text: Lang.Index,
                iconMask: false,
                action: 'showtoc'
            },
            {
                xtype: 'label',
                baseCls: 'x-title',
                html: Lang.PageOf,
                itemId: 'pageNumber'
            },
            {
                xtype: 'spacer',
                cls: 'line-spacer',
                height: 37
            },
            {
                xtype: 'button',
                //height: 40,
                id: 'glossaryBtn',
                cls: 'glossary-btn',
                //margin: '0 0 0 0',
                //padding: '0 0 0 0',
                text: Lang.Glossary,
                ui: 'plain',
                //iconCls: 'glossary',
                //iconMask: true
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button',
                id: 'nextPageBtn',
                cls: ['page-btn','next-btn'],
                height: 28,
                width: 28,
                ui: 'plain'
            }
        ]
    }

});
Ext.define('Player.view.tablet.LowerToolBar', {
    extend: 'Player.view.LowerToolBar',

    alias: 'widget.lowertoolbartablet',

    config: {
        baseCls: 'x-toolbar',
        docked: 'bottom',
        height: 47,
        layout: {
            align: 'center',
            pack: 'center',
            type: 'hbox'
        },
        ui: 'light',
        hideAnimation: {
            type: 'slideOut',
            direction: 'down',
            duration: 400
        },
        showAnimation: {
            type: 'slideIn',
            direction: 'up',
            duration: 400
        },
        items: [
            {
                xtype: 'button',
                id: 'previousPageBtn',
                cls: 'previous-btn',
                ui: 'plain',
                width: 28,
                height: 28,
                iconMask: false
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button',
                id: 'narrationTextBtn',
                itemId: 'narrationBtn',
                cls: 'narration-btn',
                ui: 'plain',
                text: 'Transcript',
                action: 'shownarration'
            },
            {
                xtype: 'spacer',
                cls: 'line-spacer',
                height: 26
            },
            {
                xtype: 'label',
                baseCls: 'x-title',
                cls: 'page-number',
                html: Lang.PageOf,
                itemId: 'pageNumber'
            },
            {
                xtype: 'spacer',
                cls: 'line-spacer',
                height: 26
            },
            {
                xtype: 'button',
                id: 'glossaryBtn',
                cls: 'glossary-btn',
                height: 40,
                text: Lang.Glossary,
                ui: 'plain'
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button',
                id: 'nextPageBtn',
                cls: 'next-btn',
                ui: 'plain',
                width: 28,
                height: 28,
                iconMask: false
            }
        ]
    }
    ,
    initialize: function() {
        
        this.callParent(arguments);
    }

});
Ext.define('Player.view.phone.LowerToolBar', {
    extend: 'Player.view.LowerToolBar',

    alias: 'widget.lowertoolbarphone',

    config: {
        baseCls: 'x-toolbar',
        docked: 'bottom',
        height: 47,
        layout: {
            align: 'center',
            pack: 'center',
            type: 'hbox'
        },
        ui: 'light',
        hideAnimation: {
            type: 'slideOut',
            direction: 'down',
            duration: 400
        },
        showAnimation: {
            type: 'slideIn',
            direction: 'up',
            duration: 400
        },
        items: [
            {
                xtype: 'button',
                id: 'previousPageBtn',
                cls: 'previous-btn',
                ui: 'plain',
                width: 28,
                height: 28,
                iconMask: false
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button',
                id: 'narrationTextBtn',
                itemId: 'narrationBtn',
                cls: 'narration-btn-phone',
                ui: 'plain',
                text: 'Transcript',
                action: 'shownarration'
            },
            {
                xtype: 'spacer',
                cls: 'line-spacer',
                height: 26
            },
            {
                xtype: 'button',
                itemId: 'phoneTocBtn',
                cls: 'toc-btn-phone',
                ui: 'plain',
                text: Lang.Index,
                iconMask: false,
                action: 'showtoc'
            },
            {
                xtype: 'spacer',
                cls: 'line-spacer',
                height: 26
            },
            {
                xtype: 'button',
                id: 'glossaryBtn',
                cls: 'glossary-btn-phone',
                height: 40,
                text: Lang.Glossary,
                ui: 'plain'
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button',
                id: 'nextPageBtn',
                cls: 'next-btn',
                ui: 'plain',
                width: 28,
                height: 28,
                iconMask: false
            }
        ]
    },
    initialize: function() {
        this.callParent(arguments);
    }

});
Ext.define('Player.view.HelpPanel', {
    extend: 'Ext.Panel',
    alias: 'widget.helppanel',

    config: {
        height: 250,
        hidden: true,
        id: 'helpPanel',
        centered: true,
        width: 250,
        hideOnMaskTap: true,
        layout: {
            type: 'fit'
        },
        modal: true,
        cls: [
            'helppanel'
        ],
        items: [
            {
                xtype: 'dataview',
                itemTpl: [
                    '<table width="90%" border="0">',
                    '		<tr class="help-{title}">',
                    '			<td width="10%"><img src="{icon}"',
                    '				style="width: 26px; height: 26px;" /></td>',
                    '			<td width="10%">',
                    '			&nbsp;',
                    '			</td>',
                    '			<td width="80%">',
                    '			<div class="textbox">{description}</div>',
                    '			</td>',
                    '		</tr>',
                    '	</table>',
                    '	<hr class="divider" />'
                ],
                store: 'Helps'
            },
            {
                xtype: 'container',
                docked: 'top',
                height: 0,
                itemId: 'closeBtnHolder',
                hidden: true,
                items: [
                    {
                        xtype: 'panel',
                        cls: [
                            'close-imagepopup'
                        ],
                        docked: 'top',
                        height: 46,
                        right: -20,
                        top: -20,
                        width: 46,
                        zIndex: 100,
                        modal: false,
                        items: [
                            {
                                xtype: 'button',
                                height: 34,
                                itemId: 'closeImagePopBtn',
                                padding: '0 0 0 0',
                                ui: 'plain',
                                width: 34,
                                autoEvent: 'closeimagepopup',
                                iconAlign: 'center',
                                iconCls: 'delete',
                                iconMask: true
                            }
                        ]
                    }
                ]
            }
        ],
        listeners: [
            {
                fn: 'onHelpPanelInitialize',
                event: 'initialize'
            }
        ]
    },

    onHelpPanelInitialize: function(component, options) {
        var me = this;
        me.query('#closeImagePopBtn')[0].on('tap', me.onClose, me);
        if(Ext.os.is.Phone){
            me.query('#closeBtnHolder')[0].show();
        }
        else{
            me.setRight(0);
            me.setTop(50);
            me.setCentered(false);
        }
    },
    onClose: function(){
        this.hide();
        Player.app.fireEvent('hideTools');
    }


});
Ext.define('Player.view.Content', {
    extend: 'Ext.Panel',
    alias: 'widget.content',
    requires: [
        'Player.view.Pages',
        'Player.view.Glossary'
    ],

    config: {
        layout: {
            type: 'card'
        },
        screen: 'main',
        items: [
            {
                xtype: 'pages',
                id: 'mainPages'
            },
            {
                xtype: 'glossary',
                id: 'glossaryPanel'
            }
        ]
    }
});
Ext.define('Player.view.tablet.Content', {
    extend: 'Player.view.Content',
    alias: 'widget.contenttablet',
    requires: [
        'Player.view.Pages',
        'Player.view.Glossary'
    ],

    config: {
        layout: {
            type: 'card'
        },
        screen: 'main',
        items: [
            {
                xtype: 'pages',
                id: 'mainPages'
            },
            {
                xtype: 'glossary',
                id: 'glossaryPanel'
            }
        ]
    },

    updateScreen: function(screen) {
        var me = this;

        switch (screen) {
        case 'main':
            me.setActiveItem(0);
            break;
        case 'glossary':
            me.animateActiveItem(1, {
                type: 'flip',
                direction: 'right'
            });
            break;
        case 'toc':
            if (me.dir && me.dir == 'right') {
                me.dir = 'right';
                me.out = false;
            } else {
                me.dir = 'left';
                me.out = true;
            }
            me.animateActiveItem(2, {
                type: 'flip',
                direction: me.dir,
                out: true,
                duration: 450
            });
            break;
        }
    }
});
Ext.define('Player.view.phone.Content', {
    extend: 'Player.view.Content',
    alias: 'widget.contentphone',
    requires: [
        'Player.view.Pages',
        'Player.view.Glossary'
    ],

    config: {
        layout: {
            type: 'card'
        },
        screen: 'main',
        items: [
            {
                xtype: 'pages',
                id: 'mainPages'
            },
            {
                xtype: 'glossary',
                id: 'glossaryPanel'
            },
            {
                xtype: 'tableofcontents',
                id: 'tableOfContents',
                width: '100%',
                height: '100%'

            }
        ]
    },

    updateScreen: function(screen) {
        var me = this;

        switch (screen) {
        case 'main':
            me.setActiveItem(0);
            break;
        case 'glossary':
            me.animateActiveItem(1, {
                type: 'flip',
                direction: 'right'
            });
            break;
        case 'toc':
            if (me.dir && me.dir == 'right') {
                me.dir = 'right';
                me.out = false;
            } else {
                me.dir = 'left';
                me.out = true;
            }
            me.animateActiveItem(2, {
                type: 'flip',
                direction: me.dir,
                out: true,
                duration: 450
            });
            break;
        }
    }

});
Ext.define('Player.view.Note', {
    extend: 'Ext.Panel',
    alias: 'widget.note',

    config: {
        border: '2px',
        styleHtmlContent: true,
        width: '95%',
        layout: {
            type: 'fit'
        },
        noteText: 'Lorem ipsum dolor sit amet',
        nType: 'none',
        cls: [
            'note'
        ],
        items: [
            {
                xtype: 'container',
                docked: 'left',
                itemId: 'noteIcon',
                width: '20%'
            }
        ]
    },

    applyNoteText: function(noteText) {
        this.setHtml(noteText);
    },

    applyNType: function(nType) {
        var noteCmp = this.getComponent('noteIcon'),
        imageWidth = '100%';

        switch (nType){
            case 'tip':
            noteCmp.setHtml('<img style="width:'+imageWidth+'" src="resources/img/tip_icon.png"/>');
            break;
            case 'note':
            case 'hint':
            noteCmp.setHtml('<img style="width:'+imageWidth+'" src="resources/img/hint_icon.png"/>');
            break;
            case 'caution':
            case 'warning':
            noteCmp.setHtml('<img style="width:'+imageWidth+'" src="resources/img/warning_icon.png"/>');
            break;
            case 'download':
            /// TODO make clickable
            noteCmp.setHtml('<img style="width:'+imageWidth+'" src="resources/img/download_icon.png"/>');
            break;
            case 'none':
            this.hide();
            break;
            default:
            if(nType){
                noteCmp.setHtml('<img style="width:'+imageWidth+'" src="resources/img/'+nType+'_icon.png"/>');
            }
            else{
                noteCmp.setHtml('<img style="width:'+imageWidth+'" src="resources/img/hint_icon.png"/>');
            }

            break;
        }

    }

});
/*
 * File: app/model/Glossary.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.0.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Player.model.Glossary', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {
                name: 'title',
                type: 'string'
            },
            {
                name: 'numDef',
                type: 'int'
            },
            {
                name: 'definition',
                type: 'string'
            }
        ]
    }
});
Ext.define('Player.view.DockedToc', {
    extend: 'Ext.Container',
    alias: 'widget.dockedtoc',
    requires: [
        'Player.view.TableOfContents'
    ],

    config: {
        docked: 'left',
        width: 250,
        layout: {
            type: 'fit'
        },
        cls: [
            'dockedtoc'
        ],
        items: [
            {
                xtype: 'tableofcontents',
                id: 'tableOfContents'
            }
        ]
    }

});
Ext.define('Player.view.FloatingToc', {
    extend: 'Ext.Panel',
    alias: 'widget.floatingtoc',

    config: {
        centered: true,
        height: 400,
        hidden: true,
        id: 'floatingToc',
        width: 262,
        autoDestroy: false,
        hideOnMaskTap: true,
        layout: {
            type: 'fit'
        },
        modal: true
    }

});
Ext.define('Player.controller.SettingsController', {
    extend: 'Ext.app.Controller',
    config: {
    },

    init: function(application) {
        try{
            initLocalization();
        }catch(e){
            console.log("Localization Error: "+e);
        }
    }

});
Ext.define('Player.view.GlossaryPanel', {
    extend: 'Ext.Panel',
    alias: 'widget.glossarypanel',

    config: {
        centered: true,
        height: 250,
        hidden: true,
        hideAnimation: 'popOut',
        padding: '5 5 5 5',
        showAnimation: 'popIn',
        width: 250,
        scrollable: 'vertical',
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                items: [
                    {
                        xtype: 'button',
                        id: 'closeTerm',
                        itemId: 'mybutton11',
                        ui: 'round',
                        iconCls: 'delete',
                        iconMask: true,
                        align: 'right'
                    }
                ]
            }
        ]
    }

});
Ext.define('Player.controller.PageController', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: '#main',
            pageNumber: '#pageNumber',
            pageInfo: '#pageInfo',
            content: '#contentPanel',
            nextBtn: '#nextPageBtn',
            previousBtn: '#previousPageBtn',
            narrationBtn: '#narrationTextBtn',
            glossaryBtn: '#glossaryBtn',
            closeBtn: '#closeBtn',
            timeBar: '#timeBar',
            help: '#helpPopUp',
            pages: '#mainPages',
            phoneTocBtn: '#phoneTocBtn',
            narration: '#narrationPanel',
            toc: '#tableOfContents',
            topicTitle: '#topicTitle',
            courseTitle: '#courseTitle'
        },

        control: {
            "#helpBtn": {
                tap: 'onHelpBtnTap'
            },
            "#tableOfContents": {
                leafitemtap: 'onNestedlistLeafItemTap'
            },
            "#mainPages": {
                activeitemchange: 'onCarouselActiveItemChange'
            },
            "#nextPageBtn": {
                tap: 'onNextpageTap'
            },
            "#previousPageBtn": {
                tap: 'onPreviousPageBtnTap'
            },
            "button[action=shownarration]": {
                tap: 'onNarrationTextBtnTap'
            },
            "#closeBtn": {
                tap: 'onCloseBtnTap'
            },
            "button[action=showtoc]": {
                tap: 'onShowToc'
            }
        }
    },

    onHelpBtnTap: function(button, e, options) {
        var me = this,
        hp = Ext.getCmp('helpPanel');

        if(hp){
            Ext.Viewport.remove(Ext.Viewport.getComponent('helpPanel'));
        }

        me.hideImagePopup();


        hp = Ext.create('Player.view.HelpPanel');

        Ext.Viewport.add(hp);

        if(hp.isHidden()){
            var helpbutton = Ext.getCmp('upperToolBar').getComponent('helpBtn');
            hp.setZIndex(1000);
            if(Ext.os.is.Phone){
                hp.show();
            }
            else{
                hp.showBy(helpbutton);    
            }
            
            hp.getModal().on('tap', function(){Player.app.fireEvent('hideTools');});
        }
        else{
            hp.hide();
        }
    },

    onNestedlistLeafItemTap: function(nestedlist, list, index, target, record, e, options) {
        var me = this,
        content = me.getContent();

        
        if(Ext.os.is.Phone){
            //me.goToPage(list.getStore().getAt(index));
            Ext.Function.defer(me.goToPage, 100, me, [list.getStore().getAt(index)]);
            Ext.Function.defer(content.setScreen, 200, content, ['main']);
        }
        else{
            Ext.getCmp('floatingToc').hide();
            Ext.Function.defer(me.goToPage, 100, me, [list.getStore().getAt(index)]);
        }
    },

    onCarouselActiveItemChange: function(container, value, oldValue, options) {
        
    },

    onNextpageTap: function(button, e, options) {
        var me = this,
        i, cp,
        pgs = me.getPages();

        me.hideImagePopup();
        
       if(me.currentPageNode.data.pType == 'Quiz'){
		 
            cp = me.currentPage; 
            i = cp.getActiveIndex();
            if (i + 1 < cp.innerItems.length) {
                cp.next();
				if(Player.settings.get('activateTimer')== true)
		{
		
		Player.app.fireEvent('startCountDown',me.currentPageNode);
				
			me.getTimeBar().show();
                return;
         }
			
			}}
       

        Player.app.fireEvent('beforePageSwitch');


        Ext.Function.defer(pgs.next, 200, pgs);
    },
    onPreviousPageBtnTap: function(button, e, options) {
        var me = this,
        i, cp,
        pgs = me.getPages();

        me.hideImagePopup();
        if(me.currentPageNode.data.pType == 'Quiz'){
            cp = me.currentPage;
            i = cp.getActiveIndex();
            if (i > 0) {
                cp.previous();
                return;
            }
        }


        Player.app.fireEvent('beforePageSwitch');

        Ext.Function.defer(pgs.previous, 200, pgs);

        //me.getPages().previous();
        //Player.app.fireEvent('beforePageSwitch');
    },

    onNarrationTextBtnTap: function(button, e, options) {
        var me = this;

        if(Ext.Viewport.query('narrationpanel').length === 0){
            // add new one
            Ext.Viewport.add(Ext.create('Player.view.NarrationPanel', {
                narrationText: currentPage.getPageData().narration['#text']
            }));
        }
        else{
            me.closeNarration();
        }

        me.hideImagePopup();
    },
    closeNarration: function(){
        if(Ext.Viewport.query('narrationpanel').length > 0){
            Ext.Viewport.query('narrationpanel')[0].destroy();    
        }
    },

    onCloseBtnTap: function(button, e, options) {
        try{
            currentPage.hideVideo();
        }catch(e){
        }

        Ext.Msg.confirm(Lang.Exit, Lang.Sure_Exit, this.exitCourse);
    },

    onShowToc: function(button, e, options) {
        var me = this,
        floatingNavPanel = Ext.getCmp('floatingToc'),
        content = me.getContent();


        if(Ext.os.is.Phone){

            if(content.getScreen() != 'toc'){
                content.setScreen('toc');
            }
            else{
                content.setScreen('main');
            }
            Player.app.fireEvent('hideTools');
        }
        else{
            if(floatingNavPanel.isHidden()){
                floatingNavPanel.showBy(button);
            }
            else{
                floatingNavPanel.hide();
            }
        }
    },

    onPageComplete: function() {
        console.log("onPageComplete");
        var me = this;


        if (!me.currentPageNode.get('complete')) {
            me.currentPageNode.set('complete', true);
            me.markCompletedTopics(me.currentPageNode);
        }
        // TODO just check to see if there is/needs a next page

        me.updateCarousel(me.currentPageNode);


        try {
            Player.app.fireEvent('SetDataChunk');
        } catch (e) {
            // No scorm
        }

        // scorm report
        if (me.isTopicComplete(Ext.getStore('ScoTreeStore').getRoot())) {
            Player.app.fireEvent('pauseCourse');
            switch (Player.settings.get('completion')) {
                case 'None':
                break;
                case 'completed':
                try {
                    SCORM.SetReachedEnd();
                } catch (e) {
                    // No scorm
                }
                break;
                case 'incomplete':
                try {
                    SCORM.ResetStatus();
                } catch (e) {
                    // No scorm
                }
                break;
                case 'pass':
                try {
                    SCORM.SetPassed();
                } catch (e) {
                    // No scorm
                }
                break;
                case 'failed':
                try {
                    SCORM.SetFailed();
                } catch (e) {
                    // No scorm
                }
                Ext.Msg.alert("FAILED!");
                break;
                default:

                break;
            }
        }
    },

    onBeforePageSwitch: function(e,f,g) {
        window.console.markTimeline("onBeforePageSwitch");
        // mask while loading pages
        Ext.getCmp("contentPanel").setMasked({xtype: "loadmask", message: Lang.Loading, cls:'page-mask'});

        // fix weirdness when mask shows but dosn't go away
        setTimeout(function(){
            // hide mask on timeout
            Ext.getCmp("contentPanel").setMasked(false);
        }, 2000);


        // End old page
        try {
            currentPage.close();
        }catch(e){
            console.log("CLOSE ERROR::"+e);
        }
    },

    markCompletedTopics: function(pageNode) {
        var me = this,
        tempTopic = pageNode.parentNode,
        temp,
        completedTopicList = [],
        allPagesComplete = false,
        st = Ext.getStore('ScoTreeStore');


        // Step up tree
        while(tempTopic){
            if(me.isTopicComplete(tempTopic)){
                completedTopicList.push(tempTopic.raw.topicId);
                // mark topic complete
                tempTopic.set('complete', true);
                if(tempTopic.isRoot()){
                    allPagesComplete = true;
                }
            }
            else{
                break;
            }
            tempTopic = tempTopic.parentNode;
        }
        me.removeTopicRestriction(st.getRoot(), completedTopicList);
    },

    isTopicComplete: function(topicNode) {
        var me = this,
        i,ln,
        node;

        if(topicNode.isLeaf()){
            return;
        }

        // If any node (leaf or branch) is not compelte return false
        for(i=0,ln=topicNode.childNodes.length;i<ln;i++){
            node = topicNode.childNodes[i];
            if(!node.get('complete')){
                return false;
            }
        }

        return true;
    },

    removeTopicRestriction: function(topicNode, topicIdList) {
        var me = this,
        i,ln,
        node,
        currentRestrictedId,
        updatedRestrictedId;

        if(!topicIdList || topicIdList.length <= 0){
            return;
        }

        // loop through child nodes
        for(i=0,ln=topicNode.childNodes.length;i<ln;i++){
            node = topicNode.childNodes[i];

            // Remove restricted from list
            currentRestrictedId = node.get('restrictedTopicId');
            if(currentRestrictedId){
                for(j=0,jn=topicIdList.length;j<jn;j++){
                    // don't forget to add the comma
                    updatedRestrictedId = currentRestrictedId.replace(topicIdList[j]+',','');
                }
                if(updatedRestrictedId === ''){
                    node.set('restrictedTopicId', false);
                }
                else{
                    node.set('restrictedTopicId', updatedRestrictedId);
                }

            }
            // recures on branches
            if(!node.isLeaf()){
                me.removeTopicRestriction(node, topicIdList);
            }
        }
    },

    onOrientationChange: function(newOrientation) {
        var me = this,
            navPanel = Ext.getCmp('tableOfContents');
        // Because android tablets don't return "landscape" or 'portrait'
        if(newOrientation >= 1280){
            newOrientation = 'landscape';
        }
        if(newOrientation <= 800){
            newOrientation = 'portrait';
        }
        if(Ext.os.is.Android){
            // trying to fix android rotation problem...
            document.body.style.setProperty('height', '100%', 'important');
            document.getElementById('ext-viewport').style.setProperty('height', '100%', 'important');    
        }
        
        console.log("onOrientationChange:"+newOrientation);
        
        if(me.firstOrientation){
            me.firstOrientation = false;
            if(Ext.os.is.Phone){
                navPanel.query('#closeToc')[0].show();
                return;
            }
            else{
                // because android is SOMETIMES backwards on the first time
                if(Ext.os.is.Android && Ext.os.is.tablet){
                    if(window.innerHeight > window.innerWidth){
                        newOrientation = 'portrait';
                    }
                    else{
                        newOrientation = 'landscape';
                    }
                }

                if(!Ext.getCmp('floatingToc')){
                    Ext.Viewport.add(Ext.create('Player.view.FloatingToc'));
                }
            }
        }
        if(Ext.os.is.Phone){
            return;
        }

        var floatingNavPanel = Ext.getCmp('floatingToc'),
            dockedNavPanel = Ext.getCmp('dockedToc'),
            tocBtn = Ext.getCmp('upperToolBar').getComponent('tocBtn');

        if(newOrientation == 'portrait' || autoHideToc){
            floatingNavPanel.add(navPanel);
            dockedNavPanel.remove(navPanel);
            dockedNavPanel.hide();
            navPanel.setWidth(250);
            navPanel.setHeight(388);
            tocBtn.show();
        }
        else{
            floatingNavPanel.hide();
            floatingNavPanel.remove(navPanel);
            navPanel.setHeight(null);
            dockedNavPanel.show();
            dockedNavPanel.add(navPanel);
            tocBtn.hide();
        }
    },

    onDataloaded: function(event) {
        console.log("onDataloaded");
        if(!this.settignsLoaded || !this.scoTreeLoaded){
            return;
        }

        var me = this,
            useBookmark,
            tracking = Player.settings.get('tracking'),
            bookmarkPage = false,
            st = Ext.getStore("ScoTreeStore"),
            dc,
            nl = me.getToc();

        // Get Total count because store won't do it automatically
        try{
            me.totalCount = st.getProxy().getReader().rawData.total;
        }catch(e){
            me.totalCount = false;
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~STORE NOT LOADED YET");
        }

        // Set data store to nested list
        // Setting the store here fixes the problem with non-toc items showing up first
        nl.setStore(st);

        // Bookmarking
        useBookmark = (tracking !== 'none' && tracking !== undefined);


        try{
            dc = SCORM.GetDataChunk();
        }catch(e){
            console.log("Session Error:"+e);
        }

        if(useBookmark && dc){
            me.recoverSession(dc);
        }

        try{
            bookmarkPage = SCORM.GetBookmark();
        }catch(e){
            console.log("Bookmark Error:"+e);
        }

        if(useBookmark && bookmarkPage){
            me.recoverBookmark(bookmarkPage);
        }
        else{
            // Go to first page
            me.goToPage(me.getFirstLeaf(st.getRoot()));
        }

        Ext.Viewport.setMasked(false);
    },

    onLoadScoTree: function() {
        console.log("onLoadScoTree");
        this.scoTreeLoaded = true;
        //Player.app.fireEvent('dataloaded');
    },

    onShowTools: function(target) {
        if(!Ext.os.is.Phone){
            return;
        }
        Ext.getCmp('upperToolBar').show();
        Ext.getCmp('lowerToolBar').show();
        Ext.getCmp('pageInfo').show();
    },

    onHideTools: function(target) {
        if(!Ext.os.is.Phone){
            return;
        }

        Ext.getCmp('upperToolBar').hide();
        Ext.getCmp('lowerToolBar').hide();
        Ext.getCmp('pageInfo').hide();
    },

    onLockPages: function(direction, buttonDirection) {
        this.getPages().setLocked(direction);
    },

    onLockButtonDirection: function(direction) {
        var me = this;

        switch (direction) {
            case 'left':
            me.getPreviousBtn().disable();
            me.getNextBtn().enable();
            break;
            case 'right':
            me.getNextBtn().disable();
            me.getPreviousBtn().enable();
            break;
            case 'both':
            me.getPreviousBtn().disable();
            me.getNextBtn().disable();
            break;
            case 'none':
            me.getPreviousBtn().enable();
            me.getNextBtn().enable();
            break;
            default:
            me.getPreviousBtn().enable();
            me.getNextBtn().enable();
            break;
        }
    },

    onUpdatePageNumber: function(pageNum) {
        this.updatePageNumber(pageNum, this.totalCount);
    },

    hideImagePopup: function() {
        try{
            var imagePop = this.getMain().query('imagepopup')[0];
            if(imagePop){
                imagePop.hide();
            }
        }catch(e){}
    },

    goToPage: function(pageNode) {
        var me = this,
        pgs = me.getPages(),
        activeIndex = pgs.getActiveIndex(),
        oldRId, newPage;

        if (!pageNode) {
            console.log("no pageNode");
            return;
        }

        if (pageNode.get('restrictedTopicId')) {
            console.log("Restricted:" + pageNode.get('restrictedTopicId'));
            return;
        }


        try {
            oldRId = pgs.getActiveItem().getRecordId();
        } catch (e) {
            oldRId = pageNode.id;
        }

        newPage = me.createPage(pageNode);

        Player.app.fireEvent('beforePageSwitch');

        if (Ext.os.is.Phone) {
            pgs.add(newPage);
            pgs.setActiveItem(newPage);
        } else {
            if (oldRId < pageNode.id) {
                // add after current index
                pgs.insert(activeIndex + 1, newPage);

                // next
                pgs.next();
            } else if (oldRId > pageNode.id) {
                // add before current index
                pgs.insert(activeIndex, newPage);

                // previous
                pgs.previous();
            } else {
                pgs.add(newPage);
                pgs.setActiveItem(newPage);
            }
        }

        // Start insctive timer
        Player.app.fireEvent('startInactiveTime');
    },

    goToHiddenPage: function(pageNode) {
        var me = this,
        pgs = me.getPages(),
        oldRId, 
        i=0,
        currentPage = me.currentPage,
        indexOfCurrenPage = pgs.items.findIndex('id',currentPage.id),
        newPage;

        if(pageNode.get('restrictedTopicId')){
            console.log("Restricted:"+pageNode.get('restrictedTopicId'));
            return;
        }


        try{
            oldRId = pgs.getActiveItem().getRecordId();
        }catch(e){
            oldRId = pageNode.id;
        }

        newPage = me.createPage(pageNode);

        if(pgs.getAt(0).getBaseCls() == 'x-carousel-indicator'){
            i=1;
        }

        // current page in middle
        if(indexOfCurrenPage > i){
            // insert page second to last;
            pgs.insert(pgs.items.length-1, newPage);

            //delete first page;
            pgs.removeAt(i);
        }
        // current page first
        else if(indexOfCurrenPage === i){
            // insert page second to last;
            pgs.insert(pgs.items.length-1, newPage);
        }
        // current page last
        else if (indexOfCurrenPage === pgs.items.length-1){
            // insert page second to last;
            pgs.add(newPage);

            //delete first page;
            pgs.removeAt(i);
        }


        //pgs.add(newPage);


        if(oldRId < pageNode.id){
            pgs.animateActiveItem(newPage,{ type: 'slide', direction: 'left'});
        }
        else if(oldRId > pageNode.id){
            pgs.animateActiveItem(newPage,{ type: 'slide', direction: 'right'});
        }
        else{
            pgs.setActiveItem(newPage);    
        }

        // Start insctive timer
        Player.app.fireEvent('startInactiveTime');
    },

    selectNodeInToc: function(pageNode) {
        var me = this,
        index = -1,
        nodeList = pageNode.parentNode.childNodes,
        ln = nodeList.length,
        domlist = me.getToc().getActiveItem().getViewItems(),
        i, tempNode;

        // loop through parent node find index of toc entries only
        for (i = 0; i < ln; i++) {
            tempNode = nodeList[i];
            if(tempNode == pageNode){
                index++;
                break;
            }
            else if(tempNode.get('isTocEntry') || !tempNode.isLeaf()){
                index++;
            }
        }

        // mark all as not selected except index
        for (i = 0,ln = domlist.length; i < ln; i++) {
            if (index == i) {
                domlist[i].className = "x-list-item x-item-selected";
            } else {
                domlist[i].className = "x-list-item";
            }
        }
    },

    createPage: function(pageNode) {
        var newPage,
            pType = pageNode.data.pType.replace(/ /g,'');

        
        if(Player.page[pType]){
            console.log("CreatePage:"+pType+" - "+pageNode.raw.title);
            newPage = Ext.create('Player.page.'+pType, {
                pageData:pageNode.raw,
                recordId:pageNode.id
            });
        }
        else{
            try{
                newPage = Ext.create('Player.page.custom.'+pType, {
                    pageData:pageNode.raw,
                    recordId:pageNode.id
                });
                console.log("CreatePage:"+pType+" - "+pageNode.raw.title);
            }
            catch(e){
                console.log("CreatePage::CustomHTML5Page - "+pageNode.raw.title);
                newPage = Ext.create('Player.page.CustomHTML5Page', {
                    pageData:pageNode.raw,
                    recordId:pageNode.id
                });
            }
        }
        return newPage;
    },

    getNextPage: function(node) {
        var me = this,
        result;
        if(node && node.nextSibling){
            if(node.nextSibling.isLeaf()){
                return node.nextSibling;
            }
            else{
                result = me.getFirstLeaf(node.nextSibling);
                if(result){
                    return result;
                }
                return me.getNextPage(node.nextSibling);    
            }
        }
        else if(node){
            return me.getNextPage(node.parentNode);
        }
        return null;
    },

    getFirstLeaf: function(node) {
        var me = this,
        result,
        numNodes = node.childNodes.length,
        childNode,
        i=0;

        for(i=0; i<numNodes; i++){
            childNode=node.childNodes[i];
            if(childNode.isLeaf()){
                return childNode;
            }
            else{
                result  = me.getFirstLeaf(childNode);
                if(result){
                    return result;
                }
            }
        }
        return null;
    },

    getPreviousPage: function(node) {
        var me = this,
        result;

        if(node && node.previousSibling){
            if(node.previousSibling.isLeaf()){
                return node.previousSibling;
            }
            else{
                result = me.getLastLeaf(node.previousSibling);
                if(result){
                    return result;
                }
                return me.getPreviousPage(node.previousSibling);    
            }

        }
        else if(node){
            return this.getPreviousPage(node.parentNode);
        }
        return null;
    },

    getLastLeaf: function(node) {
        var me = this,
        result,
        numNodes = node.childNodes.length,
        childNode, i;

        for(i=numNodes-1; i>=0; i--){
            childNode=node.childNodes[i];
            if(childNode.isLeaf()){
                return childNode;
            }
            else{
                result  = me.getLastLeaf(childNode);
                if(result){
                    return result;
                }
            }
        }
        return null;
    },

    updateCarousel: function(pageNode) {
        console.log("updateCarousel");
        var me = this,
        carousel = me.getPages(),
        previousNode = me.getPreviousPage(pageNode),
        nextPage, previousPage, nextNode, activeItem = carousel.getActiveItem(),
        i = 0,
        testItem;

        // Add previous page if needed
        if (previousNode) {
            /* a little faster than calling createPage
            previousPage = Ext.create('Player.page.'+previousNode.get('pType').replace(/ /g,''), {
            pageData:previousNode.raw,
            recordId:previousNode.id
            });
            // */
            previousPage = me.createPage(previousNode);
            if (carousel.getIndicator()) {
                carousel.insert(1, previousPage);
            } else {
                carousel.insert(0, previousPage);
            }
            me.getPreviousBtn().enable();
        } else {
            // Deactiveate previous btn
            me.getPreviousBtn().disable();
        }

        // Add next page if needed
        if (!Player.settings.get('activateTimer') || pageNode.get('complete')) {
            nextNode = me.getNextPage(pageNode);
            if (nextNode && !nextNode.get('restrictedTopicId')) {

                /*
                nextPage = Ext.create('Player.page.'+nextNode.get('pType').replace(/ /g,''), {
                pageData:nextNode.raw,
                recordId:nextNode.id
                });
                // */
                nextPage = me.createPage(nextNode);
                //debugger;
                carousel.add(nextPage);
                me.getNextBtn().enable();
            } else {
                // Deactiveate next btn
                if (me.currentPageNode.data.pType != 'Quiz') {
                    me.getNextBtn().disable();
                }
            }
        } else {
            me.getNextBtn().disable();
        }

        // Remove all but active item
        if (carousel.getIndicator()) {
            i = 1;
        }
        // Note: container.items.length changes, so it can't be cached
        for (; i < carousel.items.length; i++) {
            testItem = carousel.getAt(i);
            if (testItem != activeItem && testItem != nextPage && testItem != previousPage) {
                carousel.remove(testItem);
                i--;
            }
        }

        carousel.refresh();
    },

    beforeActiveItemChange: function(carousel, value, oldValue, eventOpts) {
        // moved to onBeforePageSwitch
    },

    afterActiveItemChange: function(carousel, value, oldValue, eOpts) {
        console.log("afterActiveItemChange");
        var me = this,
            pageNode = me.getNodeById(value.getRecordId()),
            nl = me.getToc(),
            pageNum,
            previousPage;

        me.onLockPages('none');

        me.currentPageNode = pageNode;
        me.currentPage = value;

        // for REVIEW - make currentPage global
        currentPage = value;
        currentPage.pData = {"bookmark": pageNode.get('bookmark'),"title": pageNode.get('title')};
		//Code for Quiz Timer
		if (me.currentPageNode.data.pType == 'Quiz') {
		if(!Player.settings.get('activateTimer')== true)
		{
		Player.settings.set('activateTimer','true');
          Player.app.fireEvent('StartCountDown',pageNode);
		  me.getTimeBar().show();
        } 
		}
		else
		{
		Player.settings.set('activateTimer','false');
		me.getTimeBar().hide();
		}
		//Code for Quiz Timer

        // End old page
        // MOVED TO BEFORE

        // Start New page
        try{
            value.start();
        }catch(e){
            console.log("START ERROR::"+e);
        }


        // Set Bookmark
        try {
            Player.app.fireEvent('SetBookmark', pageNode.get('bookmark'));
        } catch (e) {
            // nothing
        }

        // Update Narration
        if (pageNode.raw.narration) {
            if(Ext.Viewport.query('narrationpanel').length > 0){
                Ext.Viewport.query('narrationpanel')[0].setNarrationText(pageNode.raw.narration['#text']);
            }
            
            //me.getNarration().getScrollable().getScroller().scrollToTop();
            me.getNarrationBtn().enable();
        } else {
            me.getNarrationBtn().disable();
            me.closeNarration();
            //me.getNarration().hide();
        }


        // Timer
        if (Player.settings.get('activateTimer')) {
            Player.app.fireEvent('startCountDown', pageNode);
        }

        // Update Carousel Items
        if(!pageNode.raw.nonNavPage){
            me.updateCarousel(pageNode);
        }


        // Update Page data
        me.updatePageTitle(pageNode.get('title'));

        if(!pageNode.raw.nonNavPage){
            // Check total count
            if(typeof me.totalCount == 'boolean' && !me.totalCount){
                me.totalCount = Ext.getStore("ScoTreeStore").getProxy().getReader().rawData.total;
            }

            // Update page Numbering
            if(pageNode.get('pType') != 'Quiz'){
                pageNum = pageNode.data.pageNum + 1;
                me.updatePageNumber(pageNum, me.totalCount);
            }

            // Set Topic Title bar
            if (pageNode.parentNode.isRoot()) {
                me.getTopicTitle().hide();
                me.getCourseTitle().setCls('coursetitle-large');
            } else {
                me.getTopicTitle().setHtml(pageNode.parentNode.get('title'));
                me.getTopicTitle().show();
                me.getCourseTitle().setCls('coursetitle');
            }
        }


        if(pageNode.raw.isTocEntry){
            // Navigate toc to show current page
            nl.goToNode(pageNode.parentNode);

            // Select node in list
            me.selectNodeInToc(pageNode);
        }
        window.console.markTimeline("<- afterActiveItemChange");
        Ext.getCmp("contentPanel").setMasked(false);
    },

    getNodeById: function(nodeId) {
        // If I fix the quiz id I can uncomment this line.
        //pageNode = st.findRecord('id',value.getRecordId());// didn't work because quiz has id set

        st = Ext.getStore("ScoTreeStore");
        var pageNode = null;
        for(var i=0,ln = st.data.all.length;i<ln;i++){
            if(st.data.all[i].id == nodeId){
                pageNode = st.data.all[i];
                break;
            }
        }

        if(pageNode){
            return pageNode;
        }

        // Look in Hidden pages
        hp = Ext.getStore('hiddenPages');

        for(var i=0,ln = hp.data.all.length;i<ln;i++){
            if(hp.data.all[i].id == nodeId){
                pageNode = hp.data.all[i];
                break;
            }
        }

        return pageNode;
    },

    getNode: function(titleOrLinkId, type) {
        var me = this,
        node,
        st = Ext.getStore('ScoTreeStore'),
        hp = Ext.getStore('hiddenPages');

        if(type){
            if(type == 'id'){
                return me.getNodeById(titleOrLinkId);
            }
            node = st.findRecord(type,titleOrLinkId);
            if(node){
                return node;
            }
            node = hp.findRecord(type,titleOrLinkId);
            if(node){
                return node;
            }
            return false;
        }
        else{
            var i,ln = st.data.all.length, tempNode;

            for(i=0;i<ln;i++){
                tempNode =st.data.all[i];

                if(tempNode.get('title') == titleOrLinkId || tempNode.get('linkID') == titleOrLinkId){
                    return tempNode;
                }
            }

            ln = hp.data.all.length;
            for(i=0;i<ln;i++){
                tempNode =hp.data.all[i];

                if(tempNode.get('title') == titleOrLinkId || tempNode.get('linkID') == titleOrLinkId){
                    return tempNode;
                }
            }

            return false;
        }
    },

    removeAllButActive: function(container) {
        var activeItem = container.getActiveItem(),
        i=0,
        testItem;

        if(container.getAt(0).getBaseCls() == 'x-carousel-indicator'){
            i=1;
        }
        // TODO remove array should work
        // Note: container.items.length changes, so it can't be cached
        for(;i<container.items.length;i++){
            testItem = container.getAt(i);
            if(testItem != activeItem){
                container.remove(testItem);
                i--;
            }
        }
    },

    exitCourse: function(btnId) {
        var success;
        if (btnId == 'yes' || btnId == 'ok') {

            try {
                success = SCORM.Suspend();
            } catch (e) {
                console.log("Suspend: " + e);
            }

            try {
                if (Ext.os.is.Android) {
                    try {
                        parent.Mlss.app.fireEvent('closeCourse');
                    } catch (e) {
                        SCORM.SetClosed(g_projectID);
                        window.location = 'file:///android_asset/www/index.html';
                    }
                } else {
                    parent.Mlss.app.fireEvent('closeCourse');
                }
            } catch (e) {
                console.log('Failed to close the MLSS:' + e);
            }
            try {
                if (Ext.os.is.Android) {
                    success = SCORM.CloseTheCourse(window);
                } else {
                    success = SCORM.CloseIOSCourse();
                    window.close();
                }
            } catch (e) {
                console.log("Error: Could not close window.");
            }
        }

    },

    updatePageNumber: function(currentPage, totalPages) {
        var me = this,
            pageStr = Lang.PageOf;
        pageStr = pageStr.replace("{1}",currentPage).replace("{2}",totalPages);
        me.getPageNumber().setHtml(pageStr);
        if(Ext.os.is.Phone){
            me.getPageInfo().query('#pageNumber')[0].setHtml(pageStr);    
        }
    },

    updatePageTitle: function(title) {
        if(Ext.os.is.Phone){
            this.getPageInfo().query('#pageTitle')[0].setHtml(title);
        }
    },

    pageTap: function(e, b) {
        var me = this,
        noClick = function onclick(event){return false;},
        tempTarget,
        upper = Ext.getCmp('upperToolBar'),
        toggleReg = /(x-button)|(x-video)|(x-field)|(x-list-item)/i,
        toggleTools = true;

        //debugger;

        // restart inactive timer
        Player.app.fireEvent('startInactiveTime');

        if(e && e.target)
        {
            if(e.target.localName == 'a'){
                e.target.onclick = noClick;
                me.goToLink(decodeURIComponent(e.target.href));
                return;
            }
            else if(e.target.className.search(toggleReg) >= 0){
                toggleTools = false;
            }
            else{ 
                tempTarget = e.target;
                while(tempTarget.parentNode){
                    if(tempTarget.localName == 'a'){
                        e.target.onclick = noClick;
                        me.goToLink(decodeURIComponent(tempTarget.href));
                        return;
                    }
                    else if(tempTarget.className.search(toggleReg) >= 0){
                        toggleTools = false;
                        break;
                    }
                    else{
                        tempTarget = tempTarget.parentNode;
                    }
                }
            }
        }

        if(toggleTools){
            if(upper.isHidden()){
                Player.app.fireEvent('showTools');
            }
            else{
                Player.app.fireEvent('hideTools');
            }
        }

    },

    goToLink: function(link) {
        var me = this,
        functionArray1 = link.split('/'),
        func1 = functionArray1[functionArray1.length - 1],
        functionArray = func1.split(','),
        command = functionArray[0],
        pageNode,
        argument;

        switch (command) {
            case "asfunction:glossary":
            // get term
            argument = functionArray[1];

            // Hide toolbars on phone
            if(Ext.os.is.Phone){
                Player.app.fireEvent('hidetools');
            }

            Player.app.fireEvent('glossaryLinkClick', argument);

            break;
            case "asfunction:media":
            break;
            case "asfunction:accessFile":
            link = link.substr(22);
            // TODO: fix insctive timer and pdf timer
            if (pdfTime) {
                Player.app.fireEvent('startPdfTimer', pdfTime);
            }
            window.open(link, '_blank');
            break;

            case "asfunction:goToPage":
            argument = functionArray[1];
            pageNode = this.getNode(argument);
            if(!pageNode.raw.nonNavPage){
                me.goToHiddenPage(pageNode);
            }
            else{
                me.goToPage(pageNode);
            }

            break;
            default:
            window.open(link, '_blank');
            break;
        }
        return false;

    },

    addNextPage: function(pageNode) {
        var me = this,
        nextNode,
        nextPage;

        if (!Player.settings.data.activateTimer || pageNode.get('complete')) {
            nextNode = me.getNextPage(pageNode);
            if(nextNode && !nextNode.get('restrictedTopicId')){
                me.getPages().add(me.createPage(nextNode));
                me.getNextBtn().enable();
            }
            else{
                // Deactiveate next btn
                if(me.currentPageNode.data.pType != 'Quiz'){
                    me.getNextBtn().disable();
                }
            }
        } else {
            me.getNextBtn().disable();
        }
    },

    addPreviousPage: function(pageNode) {
        var me = this,
        previousNode = me.getPreviousPage(pageNode),
        previousPage,
        pgs = me.getPages();

        if (previousNode) {
            previousPage = me.createPage(previousNode);
            if (pgs.getIndicator()) {
                pgs.insert(1, previousPage);
            } else {
                pgs.insert(0, previousPage);
            }

            me.getPreviousBtn().enable();
        } else {
            // Deactiveate previous btn
            me.getPreviousBtn().disable();
        }
    },

    onLoadSettings: function(settings) {
        console.log("onLoadSettings");
        var me = this,
        helpStore = Ext.getStore('Helps');

        Player.settings = settings;
        me.getCourseTitle().setHtml(settings.data.title);
        window.document.title = settings.data.title;

        // Remove close from help and bar when tracking=none???debugger;
        if (settings.data.tracking == 'none' || settings.data.tracking == 'COOKIE') { // TODO:exitButton
            helpStore.removeAt(helpStore.find('title', 'Close'));
            me.getCloseBtn().hide();
        }

        // Remove phone & phone toc from help and lower bar if not phone
        if (!Ext.os.is.Phone) {
            helpStore.removeAt(helpStore.find('title', 'Phone'));
            helpStore.removeAt(helpStore.find('title', 'Table of Contents'));
            //me.getPhoneTocBtn().hide();
        }

        // Remove glossary from lower bar and help if no glossary
        if (!settings.data.glossary) {
            helpStore.removeAt(helpStore.find('title', 'Glossary'));
            me.getGlossaryBtn().hide();
        }

        // Remove narration fromlower bar and help if no narration
        if (!settings.data.narration) {
            helpStore.removeAt(helpStore.find('title', 'Narration'));
            me.getNarrationBtn().hide();
        }

        // Remove narration fromlower bar and help if no narration
        if (!settings.data.activateTimer) {
            //helpStore.removeAt(helpStore.find('title', 'Narration'));
            me.getTimeBar().hide();
        }
        else{
            me.getTimeBar().show();
        }

        //pageNumbering
        if (!settings.data.pageNumbering) {
            me.getPageNumber().hide();
        }


        Player.app.fireEvent('loadscorm');



        // Fire data loaded
        me.settignsLoaded = true;
        Player.app.fireEvent('dataloaded');



        // show help or not
        if(Player.settings.get('showHelpOnStart') && _GET.showHelp != '0'){
            Player.app.fireEvent('showTools');
            Ext.defer(function() {
             me.onHelpBtnTap();
            }, 400);
        }
        // Show TOC first
        else if(Player.settings.get('showTocFirst') && Ext.os.is.Phone){
            me.getContent().setScreen('toc');
        }
        // shwo tools
        else{
            Player.app.fireEvent('showTools');
        }


    },

    init: function(application) {
        console.log("init");
        setTimeout(function(){
            // Hide the address bar!
            window.scrollTo(0, 1);
        }, 0);

        var me = this;

        // Remove Loading animation in index.html
        try{
            //document.body.removeChild(document.getElementById("loadingstuff"));
            document.getElementById("loadingstuff").style.setProperty('visibility', 'hidden')
            //debugger;
        }catch(e){
        }
        // Set Viewport Loading
        Ext.Viewport.setMasked({xtype: "loadmask", message: Lang.Loading});


        // Url settings
        // HELP
        if(typeof _GET == 'undefined'){
            _GET = {};
            _GET.showHelp = '1';
        }

        // Phone
        if(_GET.isPhone == '1' || _GET.isPhone == 'true'){
            Ext.os.is.Phone = true;
        }

        if(typeof autoHideToc == 'undefined'){
            autoHideToc = false;
        }
        if(typeof g_projectID == 'undefined'){
            g_projectID = 0;
        }


        // set util variables
        me.firstOrientation = true;

        me.settignsLoaded = false;
        me.scoTreeLoaded = false;

        // Load settings
        var sst = Ext.ModelManager.getModel('Player.model.ScoSetting');
        sst.load(0, {
            scope: me,
            success: me.onLoadSettings
        });
        this.getApplication().on([
        { event: 'pageComplete', fn: this.onPageComplete, scope: this },
        { event: 'beforePageSwitch', fn: this.onBeforePageSwitch, scope: this },
        { event: 'orientationchange', fn: this.onOrientationChange, scope: this },
        { event: 'dataloaded', fn: this.onDataloaded, scope: this },
        { event: 'loadScoTree', fn: this.onLoadScoTree, scope: this },
        { event: 'showTools', fn: this.onShowTools, scope: this },
        { event: 'hideTools', fn: this.onHideTools, scope: this },
        { event: 'lockPages', fn: this.onLockPages, scope: this },
        { event: 'lockButtonDirection', fn: this.onLockButtonDirection, scope: this },
        { event: 'updatePageNumber', fn: this.onUpdatePageNumber, scope: this }
        ]);

    },

    launch: function() {
        console.log("launch");
        var me = this;

        Player.app.fireEvent('orientationchange', Ext.Viewport.getOrientation());

        // Set tap handler for <a> links and show/ hide tools
        me.getPages().element.on('tap', me.pageTap, me);
        me.getPages().on('activeitemchange', me.beforeActiveItemChange, me, {}, 'before');
        me.getPages().on('activeitemchange', me.afterActiveItemChange, me, {}, 'after');


        me.onLockPages('none');
    },

    recoverBookmark: function(bookmark) {
        var me = this,
        st = Ext.getStore('ScoTreeStore'),
        allNodes = st.getData().all,
        i=0, ln = allNodes.length,
        tempNode, bm = ''
        ;

        for(;i<ln;i++){
            tempNode = allNodes[i];
            bm = tempNode.get('bookmark');
            if(bm == bookmark){
                me.goToPage(tempNode);
                break;
            }
        }
    },

    recoverSession: function(chunk) {
        var me = this,
        st = Ext.getStore("ScoTreeStore"),
        i, ln = st.data.all.length,
        parts = chunk.substr(4).split(":"),
        pagesCompleted = parts[0].split(','),
        pagesSelectable = parts[2].split(','),
        tempNode,
        counter = 0;


        for(i=0;i<ln;i++){
            tempNode = st.data.all[i];
            if(tempNode.get("isTocEntry")){
                if(pagesCompleted[counter] == '1'){
                    tempNode.set('complete', true);
                }
                else{
                    tempNode.set('complete', false);
                }

                if(pagesSelectable[counter] == '1'){
                    tempNode.set('restrictedTopicId', false);
                }
                counter++;
            }
        }
    }

});
Ext.define('Player.profile.Phone', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'Phone',
        views: ['Main','LowerToolBar']
    },

    isActive: function() {
        if(Ext.os.is.Phone){
            return true;
        }
        else{
            return (_GET.isPhone == '1' || _GET.isPhone == 'true');    
        }
        
    },
    launch: function() {
    	console.log("Phone Launch");
        Ext.create('Player.view.phone.Main', {fullscreen: true});
    }
});
Ext.define('Player.profile.Tablet', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'Tablet',
        views: ['Main','LowerToolBar']
    },

    isActive: function() {
        return _GET.isPhone != '1';
    },
    launch: function() {
    	console.log("Tablet Launch");
        //document.body.style.setProperty('height', '100%', 'important');
        //debugger;
        /*Ext.defer(function() {
                Ext.create('Player.view.tablet.Main', {fullscreen: true});
            }, 100);*/
        Ext.create('Player.view.tablet.Main', {fullscreen: true});
    }
});
Ext.define('Player.controller.GlossaryController', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            glossaryBtn: '#glossaryBtn',
            glossary: '#glossaryPanel',
            term: '#glossaryPopupPanel',
            content: '#contentPanel'
        },

        control: {
            "#glossaryBtn": {
                tap: 'onGlossaryBtnTap'
            },
            "#closeGlossaryBtn": {
                tap: 'onCloseGlossaryBtnTap'
            },
            "#glossaryPanel": {
                leafitemtap: 'onGlossaryLeafItemTap'
            },
            "#closeTerm": {
                tap: 'onCloseTermTap'
            }
        }
    },

    onGlossaryBtnTap: function(button, e, options) {
        var me = this,
        content = me.getContent();

        Player.app.fireEvent('hideTools');

        if(content.getScreen() != 'glossary'){
            content.setScreen('glossary');
        }
        else{
            content.setScreen('main');
        }
    },

    onCloseGlossaryBtnTap: function(button, e, options) {
        var me = this,
        content = me.getContent();

        Player.app.fireEvent('hideTools');
        content.setScreen('main');

        me.getTerm().hide();
    },

    onGlossaryLeafItemTap: function(nestedlist, list, index, target, record, e, options) {
        var store = list.getStore(),
        record = store.getAt(index);

        this.discloseTerm(record.data.title, record.data.definition);
    },

    onCloseTermTap: function(button, e, options) {
        this.getTerm().hide();
    },

    discloseTerm: function(term, definition) {
        // Look Up Term
        var definitionText = '',
        letter = term.charAt(0).toUpperCase(),
        letterNode = Ext.getStore('GlossaryTreeStore').findRecord('title',letter),
        i, cn,
        ln=letterNode.childNodes.length,
        termL = term.toLowerCase(),
        tm = this.getTerm();

        if(!Ext.os.is.Phone){

        }

        if(definition){
            definitionText = definition;
        }
        else{
            for (i=0;i<ln;i++){
                cn = letterNode.childNodes[i];
                if(cn.data.title.toLowerCase() == termL){
                    definitionText = cn.data.definition;
                    term = cn.data.title;
                    break;
                }
            }
        }

        tm.setHtml(definitionText);
        tm.items.items[0].setTitle(term);


        try{
            MathJax.Hub.PreProcess(tm.element.dom);
            MathJax.Hub.Process(tm.element.dom);
        }catch(e){}

            tm.show();
    },

    onGlossaryLinkClick: function(term) {
        this.discloseTerm(term);
    },

    init: function() {

        this.getApplication().on([
        { event: 'glossaryLinkClick', fn: this.onGlossaryLinkClick, scope: this }
        ]);

    }

});
Ext.define('Player.controller.QuizController', {
    extend: 'Ext.app.Controller',
    config: {
        control: {
            "#mainPages": {
                activeitemchange: 'onCarouselActiveItemChange'
            }
        }
    },

    onCarouselActiveItemChange: function(container, value, oldValue, options) {

        //console.log("Switch!!!2");
    }

});
/*
 * File: app/model/PageList.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.0.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Player.model.PageList', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {
                name: 'pType',
                type: 'string'
            },
            {
                name: 'pageName',
                type: 'string'
            },
            {
                defaultValue: false,
                name: 'supported',
                type: 'boolean'
            }
        ]
    }
});
Ext.define('Player.controller.ScormController', {
    extend: 'Ext.app.Controller',
    config: {
    },

    onSetDataChunk: function() {
        var me = this,
        courseComplete = true,
        st = Ext.getStore('ScoTreeStore'),
        dc = 'toc`',
        i=0, ln = st.getData().all.length,
        tempNode;

        me.completedPages = [];
        me.selectablePage = [];

        for(;i<ln;i++){
            tempNode = st.getData().all[i];
            if(tempNode.get("isTocEntry")){
                //console.log("~title:"+tempNode.get("title")+" toc:"+tempNode.get("isTocEntry")+" type:"+(typeof tempNode.get("isTocEntry")));
                me.generateDataChunk(tempNode);
            }

        }

        dc += me.completedPages.join(",")+":0:"+me.selectablePage.join(",");

        SCORM.SetDataChunk(dc);
    },

    SetDataChunk: function(chunk) {
        //console.log('Chunk:'+chunk);
    },

    generateDataChunk: function(record) {
        var me = this;

        if(record.isLeaf()){
            if(record.get('complete')){
                me.completedPages.push('1');
            }
            else{
                me.completedPages.push('0');
            }

            if(record.get('restrictedTopicId')){
                me.selectablePage.push('0');
            }
            else{
                me.selectablePage.push('1');
            }

        }
    },

    GetDataChunk: function() {
        return false;
    },

    onSetBookmark: function(bookmark) {

        SCORM.SetBookmark(bookmark);
    },

    SetBookmark: function(bookmark) {
        //console.log("BookMark:"+bookmark);
    },

    GetBookmark: function() {
        return false;
        //return 'swfs/templateswfs/rapidintake_textimage/ri_textimage_pg.swf|3';
    },

    RecordMultipleChoiceInteraction: function(strID, response, blnCorrect, correctResponse, strDescription, intWeighting, intLatency, strLearningObjectiveID) {
        
        var temp = {};
        temp.strID = strID;
        temp.response = response;
        temp.blnCorrect = blnCorrect;
        temp.correctResponse = correctResponse;
        temp.strDescription = strDescription;
        temp.intWeighting = intWeighting;
        temp.intLatency = intLatency;
        temp.strLearningObjectiveID = strLearningObjectiveID;

        console.log("RecordMultipleChoiceInteraction:"+JSON.stringify(temp));
        /*
        console.log("strID:"+strID);
        console.log("response:"+response);
        console.log("blnCorrect:"+blnCorrect);
        console.log("correctResponse:"+correctResponse);
        console.log("strDescription:"+strDescription);
        console.log("intWeighting:"+intWeighting);
        console.log("intLatency:"+intLatency);
        console.log("strLearningObjectiveID:"+strLearningObjectiveID);
        //*/
    },

    init: function(application) {

        this.getApplication().on([
        { event: 'SetDataChunk', fn: this.onSetDataChunk, scope: this },
        { event: 'SetBookmark', fn: this.onSetBookmark, scope: this },
        { event: 'loadscorm', fn: this.onLoadscorm, scope: this }
        ]);

    },

    launch: function() {
        SCORM = this;
    },

    CreateResponseIdentifier: function(shortVar, longVar){
        var temp = {};
        temp.Short = shortVar;
        temp.Long = longVar;
        return temp;
    },

    onLoadscorm: function() {
        var me = this,
        settings = Player.settings.data,
        tracking = settings.tracking;

        if(g_projectID === 0){
            g_projectID = settings.projectId;
        }

        if(tracking != 'none' && tracking !== undefined){
            if(tracking == 'COOKIE' || tracking == 'MLSS'){
                SCORM = SCORM_db;
            }
            else{
                SCORM = parent.opener;
            }
        }

        if(SCORM === null || SCORM === undefined){
            alert(Lang.Scorm_Load_Error);
        }
    }

});
Ext.define('Player.store.GlossaryTreeStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.glossarytreestore',
    requires: [
        'Player.model.Glossary'
    ],

    config: {
        autoLoad: true,
        model: 'Player.model.Glossary',
        storeId: 'GlossaryTreeStore',
        defaultRootProperty: 'definitions',
        root: {
            
        },
        proxy: {
            type: 'ajax',
            url: 'data/glossary.json',
            reader: {
                type: 'json',
                rootProperty: 'definitions'
            }
        }
    }
});
Ext.define('Player.controller.TimeController', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            timeBar: '#timeBar'
        }
    },

    onStartCountDown: function(pageNode) {
        //debugger;
        var time = 0;
        var tid = pageNode.id;
        if(pageNode.data.complete){
            this.totalSeconds = 0;
            this.updatePageTimer();
            return;
        }
        else
        {
            if(pageNode.data.pageTimerOverride){
                time = pageNode.data.pageTimerAmount;
            }
            else{
                if(pageNode.data.isQuiz){
                    time = Player.settings.data.quizTimerSeconds;
                }
                else{
                    time = Player.settings.data.timerSeconds;
                }
            }
        }

        this.currentTimerId = tid;
        this.createPageTimer(time);
    },

    onPageTick: function(tid) {

        if(tid != this.currentTimerId){
            return;
        }
        if(this.totalSeconds <= 0){
            Player.app.fireEvent('pageComplete');
            return;
        }
        this.totalSeconds -= 1;
        this.updatePageTimer();
        Ext.Function.defer(this.onPageTick, 1000, this, [this.currentTimerId]);
    },

    createPageTimer: function(time) {

        this.totalSeconds = time;
        this.updatePageTimer();
        Ext.Function.defer(this.onPageTick, 1000, this, [this.currentTimerId]);
    },

    updatePageTimer: function() {

        var Seconds = this.totalSeconds;
        var Days = Math.floor(Seconds / 86400);
        Seconds -= Days * 86400;
        var Hours = Math.floor(Seconds / 3600);
        Seconds -= Hours * (3600);
        var Minutes = Math.floor(Seconds / 60);
        Seconds -= Minutes * (60);

        var TimeStr = Lang.Time_Tpl.replace("{h}",this.calculateLeadingZero(Hours)).replace("{m}",this.calculateLeadingZero(Minutes)).replace("{s}",this.calculateLeadingZero(Seconds));
        //var TimeStr = "Time - "+ this.calculateLeadingZero(Hours) + ":" + this.calculateLeadingZero(Minutes) + ":" + this.calculateLeadingZero(Seconds);

        this.getTimeBar().setTitle(TimeStr);
    },

    calculateLeadingZero: function(time) {

        return (time < 10) ? "0" + time : + time;
    },

    onStartInactiveTime: function() {


        // TODO: this is getting called before settings are set
        if(!Player.settings || !Player.settings.data.activateInactiveTimer){
            return;
        }
        this.inactiveTime = 20;
        var hi = 10000;
        var lo = 0;
        var v = Math.random() * (hi - lo + 1);
        var randId = Math.floor(v) + lo;
        this.inActiveTimerId = randId;
        Ext.Function.defer(this.onInactiveTick, 1000, this,[randId]);
    },

    onInactiveTick: function(tid) {

        if(this.inActiveTimerId != tid){
            return; 
        }


        this.inactiveTime -= 1;
        if(this.inactiveTime <= 0){
            alert('die');
            return;
        }
        console.log("i:"+this.inactiveTime);
        Ext.Function.defer(this.onInactiveTick, 1000, this,[tid]);
    },

    onInActiveAlert: function() {

        var mins = Player.settings.data.timerIntMinutes;
        var minStr = '';
        if(mins == 1){
            minStr = "1 "+Lang.Time_Min;
        }
        else{
            minStr = mins+" "+Lang.Time_Mins;
        }
        this.pauseCourse();
        switch(Player.settings.data.inactiveResponse){
            case "logout":
            Ext.Msg.alert(Lang.Time_Out, Lang.Time_Logout.replace("{min}",minStr));
            break;
            case "stopRecord":
            Ext.Msg.alert(Lang.Time_Out, Lang.Time_Stop.replace("{min}",minStr));
            break;
            default:
            Ext.Msg.alert(Lang.Time_Out, Lang.Time_Stop.replace("{min}",minStr));
            break;
        }
    },

    onPauseCourse: function() {



        this.paused = true;
    },

    onUnPauseCourse: function() {


        this.paused = false;
        Ext.Function.defer(this.onCourseTick, 1000, this);
    },

    onStartCourseTimer: function() {


        this.sessionTime = 0;

        Ext.Function.defer(this.onCourseTick, 1000, this);
    },

    onCourseTick: function() {
        if(this.paused){
            return;
        }

        this.sessionTime++;
        //console.log("t:"+this.sessionTime);
        Ext.Function.defer(this.onCourseTick, 1000, this);
    },

    onPdfTimerHandler: function() {
        alert("PDF TIME UP");
    },

    onStartPdfTimer: function(pdfTime) {
        return;

        // Clear the inactive timer
        this.inActiveTimerId = '';
        activateInactiveTimer = false;
        startInactivity(0);


        var task = Ext.create('Ext.util.DelayedTask', function() {
            Player.app.fireEvent('pdfTimerHandler');
        });

        task.delay(pdfTime * 60 * 1000);
    },

    onDebugStart: function() {
        //// Player.app.fireEvent('debugStart');
        _time = (new Date()).getTime();
    },

    onDebugTick: function(name) {
        if(typeof _time != "undefined"){
            _dTime = (new Date()).getTime()-_time;
            console.log(name+":"+_dTime);
            _time = (new Date()).getTime();
        }
    },

    init: function() {

        this.getApplication().on([
        { event: 'startCountDown', fn: this.onStartCountDown, scope: this },
        { event: 'pageTick', fn: this.onPageTick, scope: this },
        { event: 'startInactiveTime', fn: this.onStartInactiveTime, scope: this },
        { event: 'inactiveTick', fn: this.onInactiveTick, scope: this },
        { event: 'inActiveAlert', fn: this.onInActiveAlert, scope: this },
        { event: 'pauseCourse', fn: this.onPauseCourse, scope: this },
        { event: 'unPauseCourse', fn: this.onUnPauseCourse, scope: this },
        { event: 'startCourseTimer', fn: this.onStartCourseTimer, scope: this },
        { event: 'courseTick', fn: this.onCourseTick, scope: this },
        { event: 'pdfTimerHandler', fn: this.onPdfTimerHandler, scope: this },
        { event: 'startPdfTimer', fn: this.onStartPdfTimer },
        { event: 'debugStart', fn: this.onDebugStart, scope: this },
        { event: 'debugTick', fn: this.onDebugTick, scope: this }
        ]);

    }

});
Ext.define('Player.store.Quizes', {
    extend: 'Ext.data.Store',
    alias: 'store.quizes',
    requires: [
        'Player.model.Quiz'
    ],

    config: {
        autoLoad: true,
        model: 'Player.model.Quiz',
        storeId: 'Quizes',
        proxy: {
            type: 'ajax',
            url: 'data/quiz.json',
            reader: {
                type: 'json',
                rootProperty: 'quiz'
            }
        }
    }
});
Ext.define('Player.view.PopUpPanel', {
    extend: 'Ext.Panel',
    alias: 'widget.popuppanel',

    config: {
        centered: true,
        height: 250,
        hideAnimation: 'popOut',
        padding: '5 5 5 5',
        showAnimation: 'popIn',
        width: 250,
        hideOnMaskTap: true,
        modal: true,
        scrollable: 'vertical',
        cls: [
            'narration'
        ],
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                title: Lang.Narration,
                items: [
                    {
                        xtype: 'button',
                        itemId: 'closeNarrationBtn',
                        ui: 'round',
                        iconCls: 'delete',
                        iconMask: true,
                        action: 'close',
                        align: 'right'
                    }
                ]
            }
        ],
        listeners: [
            {
                fn: 'onCloseNarrationBtnTap',
                event: 'tap',
                delegate: '#closeNarrationBtn'
            },
            {
                fn: 'onPanelShow',
                event: 'show'
            }
        ]
    },

    onCloseNarrationBtnTap: function(button, e, options) {
        this.hide();
        try{
            currentPage.showVideo();
        }catch(e){
        }
    },

    onPanelShow: function(component, options) {
        Player.app.fireEvent('hideTools');
    }

});
Ext.define('Player.view.PageInfo', {
    extend: 'Ext.Panel',
    alias: 'widget.pageinfo',

    config: {
        centered: true,
        height: 100,
        hidden: true,
        width: 300,
        layout: {
            align: 'center',
            pack: 'center',
            type: 'vbox'
        },
        hideAnimation: {
            type: 'fadeOut',
            duration: 400
        },
        showAnimation: {
            type: 'fadeIn',
            duration: 400
        },
        items: [
            {
                xtype: 'container',
                html: 'Unit 1: Page Title',
                itemId: 'pageTitle'
            },
            {
                xtype: 'container',
                html: 'Page 1 of 50',
                itemId: 'pageNumber'
            }
        ]
    }

});
/*
 * File: app/model/PageModel.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.0.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Player.model.PageModel', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {
                name: 'title',
                type: 'string'
            },
            {
                name: 'pText',
                type: 'auto'
            },
            {
                allowNull: false,
                name: 'isTocEntry',
                type: 'boolean'
            },
            {
                allowNull: false,
                name: 'pageNum',
                type: 'int'
            },
            {
                allowNull: false,
                name: 'total',
                persist: false,
                type: 'int'
            },
            {
                defaultValue: false,
                name: 'restrictedTopicId',
                type: 'auto'
            },
            {
                allowNull: false,
                defaultValue: false,
                name: 'complete',
                type: 'boolean'
            },
            {
                name: 'pType',
                type: 'string'
            },
            {
                name: 'linkID',
                type: 'string'
            },
            {
                name: 'bookmark',
                type: 'string'
            }
        ]
    }
});
Ext.define('Player.store.SupportedPages', {
    extend: 'Ext.data.Store',
    alias: 'store.supportedpages',
    requires: [
        'Player.model.PageList'
    ],

    config: {
        autoLoad: true,
        model: 'Player.model.PageList',
        storeId: 'SupportedPages',
        proxy: {
            type: 'ajax',
            pageParam: 'notPage',
            url: 'data/suppotedPages.json',
            reader: {
                type: 'json',
                rootProperty: 'page',
                totalProperty: 'totalCount'
            }
        }
    }
});
/*
 * File: app/model/Help.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.0.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Player.model.Help', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {
                name: 'title',
                type: 'string'
            },
            {
                name: 'description',
                type: 'string'
            },
            {
                name: 'icon',
                type: 'string'
            }
        ]
    }
});
Ext.define('Player.store.ScoTreeStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.scotreestore',
    requires: [
        'Player.model.PageModel'
    ],

    config: {
        autoLoad: true,
        model: 'Player.model.PageModel',
        storeId: 'ScoTreeStore',
        clearOnLoad: false,
        nodeParam: 'page',
        id: 'scoTreeStore',
        proxy: {
            type: 'ajax',
            pageParam: 'notPage',
            url: 'data/sco.json',
            reader: {
                type: 'json',
                rootProperty: 'page',
                totalProperty: 'totalCount'
            }
        },
        listeners: [
            {
                fn: 'onScoTreeStoreLoad',
                event: 'load'
            }
        ]
    },

    onScoTreeStoreLoad: function(store, records, successful, operation, eOpts) {
        Player.app.fireEvent('loadScoTree');
    }

});
Ext.define('Player.view.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.main',
    requires: [
        'Player.view.DockedToc',
        'Player.view.UpperToolBar',
        'Player.view.LowerToolBar',
        'Player.view.TimerBar',
        'Player.view.Content',
        'Player.view.PopUpPanel',
        'Player.view.GlossaryPanel',
        'Player.view.PageInfo'
    ],

    config: {
        id: 'main',
        ui: 'light',
        layout: {
            type: 'fit'
        },
        items: [
            {
                xtype: 'dockedtoc',
                id: 'dockedToc'
            },
            {
                xtype: 'uppertoolbar',
                docked: 'top',
                id: 'upperToolBar'
            },
            {
                xtype: 'lowertoolbar',
                id: 'lowerToolBar'
            },
            {
                xtype: 'timerbar',
                hidden: true,
                itemId: 'timeBar'
            },
            {
                xtype: 'content',
                id: 'contentPanel'
            },
            {
                xtype: 'popuppanel',
                hidden: true,
                itemId: 'narrationPanel'
            },
            {
                xtype: 'glossarypanel',
                itemId: 'glossaryPopupPanel',
                hideOnMaskTap: true,
                modal: true
            },
            {
                xtype: 'pageinfo',
                id: 'pageInfo'
            }
        ]
    }

});
Ext.define('Player.view.tablet.Main', {
    extend: 'Player.view.Main',
    requires: [
        'Player.view.DockedToc',
        'Player.view.tablet.UpperToolBar',
        'Player.view.tablet.LowerToolBar',
        'Player.view.TimerBar',
        'Player.view.tablet.Content',
        'Player.view.PopUpPanel',
        'Player.view.GlossaryPanel',
        'Player.view.PageInfo'
    ],

    config: {
        id: 'main',
        ui: 'light',
        layout: {
            type: 'fit'
        },
        items: [
            {
                xtype: 'dockedtoc',
                id: 'dockedToc'
            },
            {
                xtype: 'uppertoolbartablet',
                docked: 'top',
                id: 'upperToolBar'
            },
            {
                xtype: 'lowertoolbartablet',
                id: 'lowerToolBar'
            },
            {
                xtype: 'timerbar',
                hidden: true,
                itemId: 'timeBar'
            },
            {
                xtype: 'contenttablet',
                id: 'contentPanel'
            },
            {
                xtype: 'popuppanel',
                hidden: true,
                itemId: 'narrationPanel'
            },
            {
                xtype: 'glossarypanel',
                itemId: 'glossaryPopupPanel',
                hideOnMaskTap: true,
                modal: true
            }
        ]
    }

});
Ext.define('Player.view.phone.Main', {
    extend: 'Player.view.Main',
    requires: [
        'Player.view.DockedToc',
        'Player.view.phone.UpperToolBar',
        'Player.view.phone.LowerToolBar',
        'Player.view.TimerBar',
        'Player.view.phone.Content',
        'Player.view.PopUpPanel',
        'Player.view.GlossaryPanel',
        'Player.view.PageInfo'
    ],

    config: {
        id: 'main',
        ui: 'light',
        layout: {
            type: 'fit'
        },
        items: [
            {
                xtype: 'uppertoolbarphone',
                docked: 'top',
                id: 'upperToolBar',
                width: '100%',
                top: 0,
                hidden: true
            },
            {
                xtype: 'lowertoolbarphone',
                id: 'lowerToolBar',
                width: '100%',
                bottom: 0,
                hidden: true
            },
            {
                xtype: 'timerbar',
                hidden: true,
                itemId: 'timeBar'
            },
            {
                xtype: 'contentphone',
                id: 'contentPanel'
            },
            {
                xtype: 'popuppanel',
                hidden: true,
                itemId: 'narrationPanel'
            },
            {
                xtype: 'glossarypanel',
                itemId: 'glossaryPopupPanel',
                hideOnMaskTap: true,
                modal: true
            },
            {
                xtype: 'pageinfo',
                id: 'pageInfo'
            }
        ]
    }

});
Ext.define('Player.store.Helps', {
    extend: 'Ext.data.Store',
    requires: [
        'Player.model.Help'
    ],

    config: {
        autoLoad: true,
        model: 'Player.model.Help',
        storeId: 'Helps',
        proxy: {
            type: 'ajax',
            url: 'data/help.json',
            reader: {
                type: 'json',
                rootProperty: 'helpitems'
            }
        }
    }
});
Ext.define('Player.store.HiddenPages', {
    extend: 'Ext.data.Store',
    requires: [
        'Player.model.PageModel'
    ],

    config: {
        autoLoad: true,
        autoSync: false,
        model: 'Player.model.PageModel',
        storeId: 'hiddenPages',
        proxy: {
            type: 'ajax',
            url: 'data/hiddenPages.json',
            reader: {
                type: 'json'
            }
        }
    }
});



Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    requires: [
        'Player.page.Video',
        'Player.page.TextImageLinkandAudio',
        'Player.page.TextImageandAudio',
        'Player.page.TextandVideo',
        'Player.page.TextandImageLink',
        'Player.page.TextandImage',
        'Player.page.TextandAudio',
        'Player.page.Text',
        'Player.page.Quiz',
        'Player.page.ImageLinkandAudio',
        'Player.page.ImageandAudio',
        'Player.page.CustomHTML5Page',
        'Player.page.ExternalSWFdefault',
        'Player.page.Definitions',
        'Player.view.override.ScrollerOverride'
    ],

    viewport: {
        itemId: 'viewport',
        autoMaximize: true,
        listeners: [
            {
                fn: function(component, options) {
                    try{
                        // reposition image zoom icon
                        var textimages = Ext.Viewport.query('textimage'),
                        i=0,ln=textimages.length;
                        for(i=0,ln=textimages.length;i<ln;i++){
                            textimages[i].repositionZoomImage();
                        }
                    }catch(e){}
                    },
                event: 'resize'
            }
        ]
    },

    profiles: ['Phone', 'Tablet'],

    models: [
        'Help',
        'Glossary',
        'ScoSetting',
        'Quiz',
        'Question',
        'PageList'
    ],
    stores: [
        'Helps',
        'ScoTreeStore',
        'GlossaryTreeStore',
        'Quizes',
        'HiddenPages',
        'SupportedPages'
    ],
    views: [
        'Main',
        'UpperToolBar',
        'TableOfContents',
        'LowerToolBar',
        'Pages',
        'TimerBar',
        'NarrationPanel',
        'Glossary',
        'Content',
        'HelpPanel',
        'GlossaryPanel',
        'Note',
        'AudioBar',
        'FloatingToc',
        'DockedToc',
        'PageInfo'
    ],

    name: 'Player',

    startupImage: {
        '320x460': 'resources/img/startup/320x460.jpg',
        '640x920': 'resources/img/startup/640x920.png',
        '768x1004': 'resources/img/startup/768x1004.png',
        '748x1024': 'resources/img/startup/1024x748.png',
        '1536x2008': 'resources/img/startup/1536x2008.png',
        '1496x2048': 'resources/img/startup/2048x1496.png'
    },
    icon: {
        57: 'resources/img/startup/Icon.png',
        72: 'resources/icimg/startupons/Icon~ipad.png',
        114: 'resources/img/startup/Icon@2x.png',
        144: 'resources/img/startup/Icon~ipad@2x.png'
    },
    controllers: [
        'SettingsController',
        'GlossaryController',
        'PageController',
        'TimeController',
        'QuizController',
        'ScormController'
    ],

    onViewportOrientationChange: function(viewport, newOrientation, width, height, options) {
        /*console.log("H:"+window.innerHeight+" W:"+window.innerWidth);
        document.body.style.setProperty('height', '100%', 'important');
        Ext.Viewport.getMasked().element.dom.style.setProperty('height', '100%', 'important');*/

        //console.log("H:"+window.innerHeight+" W:"+window.innerWidth);
        //document.body.style.setProperty('height', window.innerHeight+'px', 'important');
        //Ext.Viewport.getMasked().element.dom.style.setProperty('height', window.innerHeight+'px', 'important');

        //document.body.style.setProperty('height', '100%', 'important');
        //document.getElementById('loadingstuff').style.setProperty('height', '100%', 'important');

        Player.app.fireEvent('orientationchange', newOrientation);
        console.log("Current::::");
    },
    onBeforeViewportOrientationChange: function(viewport, newOrientation, width, height, options) {
        //Player.app.fireEvent('orientationchange', newOrientation);
        console.log("Before::::");
        Ext.Viewport.setMasked({xtype: "loadmask", message: "Orientating..."});

        //document.getElementById("loadingstuff").style.setProperty('visibility', 'visible');
        //document.getElementById("loadingstuff").style.setProperty('z-index', '1000', 'important');
        //debugger;
        
    },
    onAfterViewportOrientationChange: function(viewport, newOrientation, width, height, options) {
        //Player.app.fireEvent('orientationchange', newOrientation);
        console.log("After::::");
        //document.getElementById("loadingstuff").style.setProperty('visibility', 'hidden');
        Ext.Viewport.setMasked(false);
    },

    onViewportResize: function(component, options) {
        try{
            // reposition image zoom icon
            var textimages = Ext.Viewport.query('textimage'),
            i=0,ln=textimages.length;
            for(i=0,ln=textimages.length;i<ln;i++){
                textimages[i].repositionZoomImage();
            }
        }catch(e){}
    },

    launch: function() {
        console.log("App Launch");
        //debugger;
        Ext.Viewport.on([
        {
            event: 'orientationchange',
            fn: 'onViewportOrientationChange',
            scope: this
        },
        {
            event: 'orientationchange',
            fn: 'onBeforeViewportOrientationChange',
            order: 'before',
            scope: this
        },
        {
            event: 'orientationchange',
            fn: 'onAfterViewportOrientationChange',
            order: 'after',
            scope: this
        },
        {
            event: 'resize',
            fn: 'onViewportResize',
            scope: this
        }
        ]);
        //Ext.create('Player.view.Main', {fullscreen: true});
    }

});


