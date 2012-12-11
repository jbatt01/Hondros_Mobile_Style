Ext.define('Player.page.custom.HondrosComponents.HondrosPopup', {
    extend: 'Ext.Panel',

    alias: ['widget.HondrosPopup'],

    config: {
        imagePopupData: {},
        centered: true,
        height: 400,
        width: 300,
        hidden: true,
        modal: true,
        padding: '10 10 10 10',
        cls: "hondrosPopup",
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
         html: "",
        items: [{
            xtype: 'titlebar',
            docked: 'top',
            ui: 'hondros-light',
            items: [{
                xtype: 'button',
                align: 'right',
                text: 'X',
                ui: 'plain',
                cls: 'popupCloseBtn',
                height: 46,
                width: 40,
                itemId: 'closeBtn'
            }]
        }],
        listeners: [{
            fn: 'onClosePopup',
            event: 'tap',
            delegate: '#closeBtn'
        }]
    },


    updateImagePopupData: function(newPopupData, oldPopupData) {
        if (!newPopupData.pType) {
            return;
        }
    },
    onClosePopup: function(button, e, options) {
        this.hide();
    },


    initializePopup: function() {
        var me = this;
    }
});