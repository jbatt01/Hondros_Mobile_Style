Ext.define('Player.view.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.main',
    requires: [
        'Player.view.DockedToc',
        'Player.view.UpperToolBar',
        'Player.view.LowerToolBar',
        'Player.view.TimerBar',
        'Player.view.Content',
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
                xtype: 'dockedtoc',
                id: 'dockedToc'
            },
            {
                xtype: 'uppertoolbar',
                docked: 'top',
                id: 'upperToolBar'
            },
            {
                xtype: 'lowertoolbar',
                id: 'lowerToolBar'
            },
            {
                xtype: 'timerbar',
                hidden: true,
                itemId: 'timeBar'
            },
            {
                xtype: 'content',
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