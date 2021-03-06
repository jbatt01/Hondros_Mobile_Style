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
