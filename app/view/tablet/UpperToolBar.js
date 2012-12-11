Ext.define('Player.view.tablet.UpperToolBar', {
    extend: 'Player.view.UpperToolBar',
    alias: 'widget.uppertoolbartablet',

    config: {
        baseCls: 'x-toolbar',
        height: 47,
        layout: {
            align: 'center',
            type: 'hbox'
        },
        ui: 'dark',
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
                hidden: true,
                itemId: 'upperToolbarIcon',
                width: '100%',
                zIndex: 14 
            }
        ]
    }

});