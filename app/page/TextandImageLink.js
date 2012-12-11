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
