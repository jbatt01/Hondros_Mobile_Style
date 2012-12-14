Ext.define('Player.page.TextImageandAudio', {
    extend: 'Player.page.Page',

    alias: ['widget.TextImageandAudio'],

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
            xtype: 'imagepopup',
            itemId: 'imagePopup',
            width: 200,
            height: 200
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
            pText = '',
            imagePopup = me.query('#imagePopup')[0];

        // Set Title
        me.getComponent('pageTitle').setHtml(newPageData.title);

        // Set Text
        me.getComponent('pageText').setPageData(newPageData);
        me.getComponent('pageText').on('imagetap', me.imageTapHandler, me);

        // Create Audio
        me.getComponent('audio').setMediaPath(newPageData.mediaPath);

        // Impage popup stuff
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

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },
    imageTapHandler: function(e) {
        var pop = imagePopup = this.query('#imagePopup')[0];
        pop.show();
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
