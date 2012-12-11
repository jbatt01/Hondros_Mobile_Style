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