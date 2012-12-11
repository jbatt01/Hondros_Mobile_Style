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
