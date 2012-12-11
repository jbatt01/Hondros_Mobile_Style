Ext.define('Player.view.phone.LowerToolBar', {
    extend: 'Player.view.LowerToolBar',

    alias: 'widget.lowertoolbarphone',

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
                cls: 'narration-btn-phone',
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
                xtype: 'button',
                itemId: 'phoneTocBtn',
                cls: 'toc-btn-phone',
                ui: 'plain',
                text: Lang.Index,
                iconMask: false,
                action: 'showtoc'
            },
            {
                xtype: 'spacer',
                cls: 'line-spacer',
                height: 26
            },
            {
                xtype: 'button',
                id: 'glossaryBtn',
                cls: 'glossary-btn-phone',
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
    },
    initialize: function() {
        this.callParent(arguments);
    }

});