Ext.define('Player.view.phone.Main', {
    extend: 'Player.view.Main',
    requires: [
        'Player.view.DockedToc',
        'Player.view.phone.UpperToolBar',
        'Player.view.phone.LowerToolBar',
        'Player.view.TimerBar',
        'Player.view.phone.Content',
        'Player.view.PopUpPanel',
        'Player.view.GlossaryPanel',
        'Player.view.PageInfo'
    ],

    config: {
        id: 'main',
        ui: 'light',
        layout: {
            type: 'fit'
        },
        items: [
            {
                xtype: 'uppertoolbarphone',
                docked: 'top',
                id: 'upperToolBar',
                width: '100%',
                top: 0,
                hidden: true
            },
            {
                xtype: 'lowertoolbarphone',
                id: 'lowerToolBar',
                width: '100%',
                bottom: 0,
                hidden: true
            },
            {
                xtype: 'timerbar',
                hidden: true,
                itemId: 'timeBar'
            },
            {
                xtype: 'contentphone',
                id: 'contentPanel'
            },
            {
                xtype: 'popuppanel',
                hidden: true,
                itemId: 'narrationPanel'
            },
            {
                xtype: 'glossarypanel',
                itemId: 'glossaryPopupPanel',
                hideOnMaskTap: true,
                modal: true
            },
            {
                xtype: 'pageinfo',
                id: 'pageInfo'
            }
        ]
    }

});