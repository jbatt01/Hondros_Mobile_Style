Ext.define('Player.view.tablet.Main', {
    extend: 'Player.view.Main',
    requires: [
        'Player.view.DockedToc',
        'Player.view.tablet.UpperToolBar',
        'Player.view.tablet.LowerToolBar',
        'Player.view.TimerBar',
        'Player.view.tablet.Content',
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
                xtype: 'uppertoolbartablet',
                docked: 'top',
                id: 'upperToolBar'
            },
            {
                xtype: 'lowertoolbartablet',
                id: 'lowerToolBar'
            },
            {
                xtype: 'timerbar',
                hidden: true,
                itemId: 'timeBar'
            },
            {
                xtype: 'contenttablet',
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
            }
        ]
    }

});