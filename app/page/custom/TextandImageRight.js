Ext.define('Player.page.custom.TextandImageRight', {
    extend: 'Player.page.Page',

    alias: ['widget.TextandImageRight'],

    requires: ['Player.page.components.TextImage'],

    mixins: ['Player.page.components.ImagePopup'],
    
    config: {
        layout: 'vbox',
        styleHtmlContent: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        defaults:{
            margin: 10
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
        newPageData.imgPos = 'right';
        // Set Title
        me.getComponent('pageTitle').setHtml(newPageData.title);
        
        // Set Text
        me.getComponent('pageText').setPageData(newPageData);
        me.getComponent('pageText').on('imagetap', me.imageTapHandler, me);

        // Impage popup stuff
        me.setImagePopupData(newPageData);

        if(newPageData.filedownload){
            var textNote = Ext.create('Ext.Panel', {
                html: '<a HREF="asfunction:accessFile,'+newPageData.filedownload+'" TARGET="_blank"><img style="" src="resources/img/download_icon.png"/></a>'
            });
            me.add(textNote);
        }

        // Create Note
        if(newPageData.note) {
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
