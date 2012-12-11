Ext.define('Player.page.components.ImagePopup', {
    extend: 'Ext.Panel',
    alias: 'widget.imagepopup',

    config: {
        captionHead: '',
        captionText: '',
        imageFile: '',
        centered: true,
        hidden: true,
        maxHeight: '90%',
        maxWidth: '90%',
        hideOnMaskTap: true,
        layout: {
            type: 'fit'
        },
        modal: true,
        scrollable: {
            direction: 'both',
            directionLock: true
        },
        cls: ['imagepopup'],
        items: [{
            xtype: 'panel',
            docked: 'bottom',
            height: 60,
            html: 'Image Caption Text',
            itemId: 'captionText',
            styleHtmlContent: true,
            ui: 'light',
            scrollable: {
                direction: 'vertical',
                directionLock: true
            },
        }, {
            xtype: 'container',
            docked: 'top',
            height: 0,
            items: [{
                xtype: 'panel',
                cls: ['close-imagepopup'],
                docked: 'top',
                height: 46,
                right: -20,
                top: -20,
                width: 46,
                zIndex: 100,
                modal: false,
                items: [{
                    xtype: 'button',
                    height: 34,
                    itemId: 'closeImagePopBtn',
                    padding: '0 9 0 4',
                    ui: 'plain',
                    width: 34,
                    autoEvent: 'closeimagepopup',
                    iconAlign: 'center',
                    iconCls: 'delete',
                    iconMask: true
                }]
            }]
        }],
        listeners: [{
            fn: 'onPanelInitialize',
            event: 'initialize'
        }, {
            fn: 'onPanelShow',
            order: 'before',
            event: 'show'
        }]
    },

    onPanelInitialize: function(component, options) {

        this.query('#closeImagePopBtn')[0].on('tap', this.onClose, this);
    },

    onPanelShow: function(component, options) {
        Player.app.fireEvent('hideTools');
    },

    updateCaptionHead: function(caption) {
        //var cap = this.getComponent('captionHead');
        //cap.setHtml(caption);
    },

    updateCaptionText: function(caption) {
        var cap = this.getComponent('captionText'),
            captionHead = this.getCaptionHead();

        if (captionHead && caption) {
            cap.show();
            cap.setHtml('<span class="captionhead">' + captionHead + '</span><br/>' + '<span class="captiontext">' + caption + '</span>');
        } else {
            cap.hide();
            cap.setHtml("");
        }

    },

    updateImageFile: function(imagePath) {
        var newImg = new Image();
        newImg.src = imagePath;
        newImg.onload = this.resizePopup.call(this, newImg);
        this.setHtml('<img src="' + imagePath + '"/>');
    },

    onClose: function() {
        this.hide();
        this.fireAction('close', [this]);
    },

    resizePopup: function(img) {
        
        var me = this,
            imgHeight = img.height,
            imgWidth = img.width,
            popWidth = 200,
            popHeight = 400,
            captionHeight = 0;

        if(me.getCaptionText() || me.getCaptionHead()){
            captionHeight = 60;
        }
        

        if (imgWidth < 200) {
            popWidth = 200;
        } else if (imgWidth > window.innerWidth * 0.9) {
            popWidth =  window.innerWidth * 0.9;
        } else {
            popWidth = imgWidth + 10;
        }

        if (imgHeight < 200) {
            popHeight = 200 + captionHeight;
        } else if (imgHeight > window.innerHeight * 0.9) {
            popHeight = window.innerHeight * 0.9;
        } else {
            popHeight = imgHeight + 10 + captionHeight;
        }
        
        me.isResized = true;
        me.setWidth(popWidth);
        me.setHeight(popHeight);
    }

});