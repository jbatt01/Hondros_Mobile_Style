

Ext.define('Player.page.Page', {
    extend : 'Ext.Panel',

    alias: ['widget.page'],
    
    config: {
        layout: {
            type: 'vbox',
            align: 'stretch',
            pack: 'start'
        },
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        pageData: {}
    },

    
    applyPageData : function(config) {        
        return config;
    },

    updatePageData : function(newPageData, oldPageData) {
    },

    initialize : function() {
        this.callParent(arguments);
        //this.setMasked({xtype: "loadmask", message: "Loading Page", cls:'page-mask'});
    },
    start: function(){
        if(!Player.settings.get('activateTimer') && !Player.settings.get('pageComplete')){
            Player.app.fireEvent('pageComplete');
        }
        this.resizeScroller();
    },
    close: function(){
        
    },
    resizeScroller: function(){
        var me = this,
            scb = me.getScrollable(),
            imageSize = scb.getScroller().getSize(),
            containerSize = scb.getScroller().getContainerSize(),
            ind = scb.getIndicators();

        if(imageSize.x > containerSize.x){
            //ind.x.show();
        }
        if(imageSize.y > containerSize.y){
            ind.y.show();
        }
    }
});