Ext.define('Player.view.tablet.LowerToolBar', {
    extend: 'Player.view.LowerToolBar',

    alias: 'widget.lowertoolbartablet',

    config: {
        baseCls: 'x-toolbar',
        docked: 'bottom',
        height: 47,
        layout: {
            align: 'center',
            pack: 'center',
            type: 'hbox'
        },
        ui: 'light',
        hideAnimation: {
            type: 'slideOut',
            direction: 'down',
            duration: 400
        },
        showAnimation: {
            type: 'slideIn',
            direction: 'up',
            duration: 400
        },
        items: [
            {
                xtype: 'button',
                id: 'previousPageBtn',
                cls: 'previous-btn',
                ui: 'plain',
                width: 28,
                height: 28,
                iconMask: false
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button',
                id: 'narrationTextBtn',
                itemId: 'narrationBtn',
                cls: 'narration-btn',
                ui: 'plain',
                text: 'Transcript',
                action: 'shownarration'
            },
            {
                xtype: 'spacer',
                cls: 'line-spacer',
                height: 26
            },
            {
                xtype: 'label',
                baseCls: 'x-title',
                cls: 'page-number',
                html: Lang.PageOf,
                itemId: 'pageNumber'
            },
            {
                xtype: 'spacer',
                cls: 'line-spacer',
                height: 26
            },
            {
                xtype: 'button',
                id: 'glossaryBtn',
                cls: 'glossary-btn',
                height: 40,
                text: Lang.Glossary,
                ui: 'plain'
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button',
                id: 'nextPageBtn',
                cls: 'next-btn',
                ui: 'plain',
                width: 28,
                height: 28,
                iconMask: false
            }
        ]
    }
    ,
    initialize: function() {
        
        this.callParent(arguments);
    }

});