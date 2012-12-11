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