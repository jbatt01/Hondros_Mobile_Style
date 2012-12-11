Ext.define('Player.view.PopUpPanel', {
    extend: 'Ext.Panel',
    alias: 'widget.popuppanel',

    config: {
        centered: true,
        height: 250,
        hideAnimation: 'popOut',
        padding: '5 5 5 5',
        showAnimation: 'popIn',
        width: 250,
        hideOnMaskTap: true,
        modal: true,
        scrollable: 'vertical',
        cls: [
            'narration'
        ],
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                title: Lang.Narration,
                items: [
                    {
                        xtype: 'button',
                        itemId: 'closeNarrationBtn',
                        ui: 'round',
                        iconCls: 'delete',
                        iconMask: true,
                        action: 'close',
                        align: 'right'
                    }
                ]
            }
        ],
        listeners: [
            {
                fn: 'onCloseNarrationBtnTap',
                event: 'tap',
                delegate: '#closeNarrationBtn'
            },
            {
                fn: 'onPanelShow',
                event: 'show'
            }
        ]
    },

    onCloseNarrationBtnTap: function(button, e, options) {
        this.hide();
        try{
            currentPage.showVideo();
        }catch(e){
        }
    },

    onPanelShow: function(component, options) {
        Player.app.fireEvent('hideTools');
    }

});