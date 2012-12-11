Ext.define('Player.page.custom.HondrosPopUpState', {
    extend: 'Ext.Panel',

    alias: ['widget.HondrosPopUpState'],

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
        }, {
            xtype: 'HondrosPopup',
            itemId: 'pagePopup',
			align: 'left',
			items: [
			{
			xtype: 'titlebar',
			docked: 'top',
			ui: 'hondros-light',
			itemId: 'PopUp',
			title: 'This is test Title1',
			align: 'left',
			styleHtmlContent: true,
			items:[{
			width: 100,
			xtype: 'button',
                align: 'right',
                text: 'X',
                ui: 'plain',
                cls: 'popupCloseBtn',
                height: 56,
                width: 40,
                itemId: 'closeBtn'
			}]            
            }]
			
        }],
        listeners: [{
            fn: 'onShowPopup',
            event: 'tap',
            delegate: 'button[action=showLink]'
        }]
    },

    updatePageData: function(newPageData, oldPageData) {
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
		var  count = 0;
			var PrevID;
for (var i = 1, ln = 20; i < ln; i++) {
            if (newPageData['link' + i] && newPageData['detail' + i]) {
			var ivar = i;
                var btn = Ext.create('Ext.Button', {
                    text: newPageData['link' + i]['#text'],
                    icon: 'resources/img/hondros/btn-play-icon.png',
                    iconAlign: 'right',
                    itemId: 'linkBtn_'+i,
                    action: 'showLink',
                    cls: 'linkBtn',
                    padding: 0,
                    height: 40,
                    detailText: newPageData['detail' + i]['#text'],
					TitleBar: newPageData['link' + i]['#text'],
					//Code For Button Tap
					listeners: {
                    tap: {
                    fn: function() {
					var btnSplitId = this.getItemId().split('_',2);
					var btnID = btnSplitId[1];
					if(PrevID!=btnID)
					{
					PrevSplitId = this.getItemId().split('_',2);
					PrevID = PrevSplitId[1];
					count= count + 1;
					}
					var splitID = this.getItemId().split('_',2);
					if(count==ivar)
					{
					Player.app.fireEvent('pageComplete');
					count=0;}
                    }
                }
				
            }
			//Code For Button Tap
                });
                me.add(btn);
            }
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

    onShowPopup: function(btn){
        var popup = this.query('#pagePopup')[0];
		// Code for Title
		var popupTitle = this.query('#PopUp')[0];
		if(btn.config.TitleBar){
		var trimTitle = btn.config.TitleBar.trim();
		var space="....";
		if  (trimTitle.length >= 28)
		{
		popupTitle.setTitle('<div style="">' + trimTitle.substr(0,28).concat(space)+ '</div>');
		}
		else if(trimTitle.length <28 && trimTitle.length >=14)
		{
		popupTitle.setTitle('<div style="margin-right:120px">' + trimTitle + '</div>');
		}
		else if(trimTitle.length <14 && trimTitle.length >=6)
		{
		popupTitle.setTitle('<div style="margin-right:170px">' + trimTitle + '</div>');
		}
		else if(trimTitle.length <6)
		{
		popupTitle.setTitle('<div style="margin-right:187px">' + trimTitle + '</div>');
		}
		}
		else {
		popupTitle.setTitle('');
		}
        popup.setHtml(btn.config.detailText);
        popup.show();
    },

    initialize: function() {
        this.callParent(arguments);
    },
    start: function(){

    },
    close: function(){

    }

});