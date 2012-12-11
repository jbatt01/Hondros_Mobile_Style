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
