

Ext.define('Player.page.TextPage', {
    extend : 'Ext.Panel',

    
    

    config : {
        layout: 'vbox',
        styleHtmlContent: true,
        cls: 'page-content',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId:'',
        pageTitle : {
            xtype : 'panel'
        },
        pageText : {
            xtype : 'panel'
        },
        pageData : {
            title : 'Page Title 2',
            pText : ''
        }
    },

//    applyPageTitle : function(config) {
//        console.log("applyPageTitle");
//        return Ext.factory(config, Ext.Panel, this.getPageTitle());
//    },
//
//    updatePageTitle : function(newToolbar, oldToolbar) {
//        console.log("updatePageTitle");
//        var me = this;
//        if (newToolbar) {
//            console.log("newtitle...");
//            newToolbar.setHtml(this.getPageData().title);
//            me.add(newToolbar);
//        } else if (oldToolbar) {
//            oldToolbar.destroy();
//        }
//    },

//    applyPageText : function(config) {
//        console.log("applyPageText");
//        return Ext.factory(config, Ext.Panel, this.getPageText());
//    },
//
//    updatePageText : function(newToolbar, oldToolbar) {
//        console.log("updatePageText");
//        var me = this;
//        if (newToolbar) {
//            console.log("newtext...");
//            newToolbar.setHtml(this.getPageData().pText);
//            me.add(newToolbar);
//        } else if (oldToolbar) {
//            oldToolbar.destroy();
//        }
//    },
    
    applyPageData : function(config) {        
        return config;
    },

    updatePageData : function(newPageData, oldPageData) {
        
        var me = this;
        var pData = this.getPageData();
        
        if(pData.title){
            var titlePanel = Ext.factory(this.getPageTitle(), Ext.Panel);
            titlePanel.setHtml(pData.title);
            me.add(titlePanel);    
        }
        
        if(pData.pText){
            var textPanel = Ext.factory(this.getPageText(), Ext.Panel);
            textPanel.setHtml(pData.pText['#text']);
            me.add(textPanel);    
        }
        
        
        //var textPanel = Ext.factory({html:this.getPageData().pText}, Ext.Panel, this.getPageText());
        //me.add(textPanel);
        
        
    },

    initialize : function() {
        this.callParent(arguments);
    }

   

});