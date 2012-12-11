Ext.define('Player.page.custom.HondrosEssay', {
    extend: 'Ext.Panel',

    alias: ['widget.HondrosEssay'],

    requires: ['Player.page.custom.HondrosComponents.HondrosPopup'],

    config: {
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
        recordId: '',
        pageData: {
            title: 'Page Title 2',
            pText: ''
        },
        items: [{
            xtype: 'container',
            itemId: 'pageTitle',
            cls: 'page-title'
        }, {
            xtype: 'container',
            itemId: 'pageText',
            cls: 'page-content'
        }, {
            xtype: 'container',
            itemId: 'essayInst',
            cls: 'page-content',
            html: 'Type in your answer here:'
        }, {
            cls: 'essayPanel',
            height: 210,
            width: 310,
            layout: {
                type: 'fit'
            },
            items: [{
                xtype: 'container',
                docked: 'bottom',
                height: 48,
                padding: 5,
                layout: {
                    pack: 'end',
                    type: 'hbox'
                },
                items: [{
                    xtype: 'button',
                    cls: 'essay-checkBtn',
                    icon: 'resources/img/hondros/Check-icon.png',
                    text: 'Check Answer',
                    itemId: 'checkAnswer'
                }]
            }, {
                xtype: 'textareafield',
                clearIcon: false,
                height: 152
            }]
        }, {
            xtype: 'HondrosPopup',
            itemId: 'pagePopup',
        }
		
		],
        listeners: [{
            fn: 'onShowPopup',
            event: 'tap',
            delegate: '#checkAnswer'
        }]
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this;

        if (newPageData.title) {
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
        me.query('#pagePopup')[0].setHtml(newPageData.narration['#text']);
    },
    onShowPopup: function(button, e, options) {
        this.query('#pagePopup')[0].show();
		// Mark page complete
	      Player.app.fireEvent('pageComplete');
    },

    initialize: function() {
        this.callParent(arguments);
    },
    start: function(){

    },
    close: function(){

    }

});