Ext.define('Player.view.UpperToolBar', {
    extend: 'Ext.Panel',
    alias: 'widget.uppertoolbar',

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
                xtype: 'button',
                height: 30,
                hidden: true,
                itemId: 'tocBtn',
                text: Lang.Table_Of_Contents,
                action: 'showtoc',
                zIndex: 24 
            },
            {
                xtype: 'spacer',
                width: 10
            },
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
                id: 'helpBtn',
                itemId: 'helpBtn',
                cls: 'help-btn',
                height: 28,
                width: 28,
                ui: 'plain',
                zIndex: 24 
            },
            {
                xtype: 'button',
                cls: 'close-btn',
                id: 'closeBtn',
                height: 28,
                width: 28,
                itemId: 'closeBtn',
                ui: 'plain',
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