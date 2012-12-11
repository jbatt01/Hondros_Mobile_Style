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
