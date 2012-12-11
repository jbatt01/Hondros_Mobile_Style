Ext.define('Player.page.custom.HondrosTextState', {
    extend : 'Ext.Panel',

    alias: ['widget.HondrosTextState'],
    

    config : {
        layout: 'vbox',
        styleHtmlContent: true,
        cls: 'page-content',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        defaults:{
            margin: 10
        },
        recordId:'',
         pageData : {
            title : 'Page Title 2',
            pText : ''
        },
        items: [{
            xtype: "container",
            layout: {
                type: "hbox"
            },
            items: [{
                xtype: "container",
                itemId: 'titleIcon'
            }, {
                xtype: "container",
                cls: 'page-title',
                itemId: 'pageTitle'
            }]
        }, {
            xtype: 'container',
            itemId: 'pageText',
            cls: 'page-content'
        }]
    },

    updatePageData : function(newPageData, oldPageData) {
        var me = this;

        if (newPageData.title) {
            var imageUrl = "resources/img/hondros/" + newPageData.icon + ".png",
                color = newPageData.iconColor.replace('0x', '#'),
                textNote;
            me.query('#titleIcon')[0].setHtml('<div style="background-color:' + color + ';background-image:url(\'' + imageUrl + '\');width:32px; height:32px; margin-right:5px"/>');
            me.query('#pageTitle')[0].setHtml(newPageData.title);
        }

        if (newPageData.pText) {
            me.query('#pageText')[0].setHtml(newPageData.pText['#text']);
        }
		//Pdf Download Code
		if (newPageData.nType) {
			switch (newPageData.nType){
			case 'download':
			if(newPageData.filedownload){
			var fileDownloadPanel = Ext.create('Ext.Panel', {
				 html: '<a HREF="'+newPageData.filedownload+'" TARGET="_blank"><img style="margin-top:20px" src="resources/img/hondros/'+newPageData.nType+'_icon.png"/></a>'
            });
			me.add(fileDownloadPanel);
			}
			 break;
            case 'none':
            break;
			}
		}
		//Pdf Download Code
    },

    initialize : function() {
        this.callParent(arguments);
    },
    start: function(){
	 // Mark page complete
	Player.app.fireEvent('pageComplete');

    },
    close: function(){

    }

   

});