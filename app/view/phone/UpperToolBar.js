Ext.define('Player.view.phone.UpperToolBar', {
    extend: 'Player.view.UpperToolBar',
    alias: 'widget.uppertoolbarphone',

    config: {
        baseCls: 'x-toolbar',
        height: 47,
        layout: {
            align: 'center',
            type: 'hbox'
        },
        ui: 'dark',
        hideAnimation: {
            type: 'slideOut',
            direction: 'up',
            duration: 400
        },
        showAnimation: {
            type: 'slideIn',
            direction: 'down',
            duration: 400
        },
        items: [
            
            {
                xtype: 'panel',
                layout: {
                    type: 'vbox'
                },
                items: [
                    {
                        xtype: 'label',
                        cls: [
                            'coursetitle'
                        ],
                        html: 'Course Title',
                        itemId: 'courseTitle'
                    },
                    {
                        xtype: 'label',
                        cls: [
                            'topictitle'
                        ],
                        html: 'Topic Title',
                        itemId: 'topicTitle'
                    }
                ]
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button',
                cls: 'help-btn',
                height: 28,
                width: 28,
                id: 'helpBtn',
                itemId: 'helpBtn',
                padding: '5 10 5 5',
                ui: 'plain',
                iconMask: false,
                zIndex: 24 
            },
            {
                xtype: 'button',
                cls: 'close-btn',
                id: 'closeBtn',
                height: 28,
                width: 28,
                padding: '5 10 5 5',
                ui: 'plain',
                iconMask: false,
                zIndex: 24 
            },
            {
                xtype: 'container',
                centered: true,
                cls: [
                    'upperToolbarIcon'
                ],
                height: 47,
                hidden: false,
                itemId: 'upperToolbarIcon',
                width: '100%',
                zIndex: 14 
            }
        ]
    }

});