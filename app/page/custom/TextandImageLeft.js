Ext.define('Player.page.TextandImageLeft', {
    extend: 'Player.page.Page',

    alias: ['widget.TextandImageLeft'],

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