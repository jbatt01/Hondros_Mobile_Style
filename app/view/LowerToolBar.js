Ext.define('Player.view.LowerToolBar', {
    extend: 'Ext.Container',
    

    config: {
        baseCls: 'x-toolbar',
        docked: 'bottom',
        height: 47,
        layout: {
            align: 'center',
            pack: 'center',
            type: 'hbox'
        },
        cls: [
            'x-toolbar-light'
        ],
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
                itemId: 'mybutton3',
                cls: ['page-btn','previous-btn'],
                height: 28,
                width: 28,
                ui: 'plain'
                
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button',
                id: 'narrationTextBtn',
                cls: (Ext.os.is.Phone)?'narration-btn-phone':'narration-btn',
                itemId: 'mybutton4',
                ui: 'plain',
                text: Lang.Narration,
                //iconCls: 'narration_btn',
                //iconMask: true
            },
            {
                xtype: 'spacer',
                cls: 'line-spacer',
                height: 37
            },
            {
                xtype: 'button',
                hidden: true,
                itemId: 'phoneTocBtn',
                cls: 'index-btn',
                ui: 'plain',
                text: Lang.Index,
                iconMask: false,
                action: 'showtoc'
            },
            {
                xtype: 'label',
                baseCls: 'x-title',
                html: Lang.PageOf,
                itemId: 'pageNumber'
            },
            {
                xtype: 'spacer',
                cls: 'line-spacer',
                height: 37
            },
            {
                xtype: 'button',
                //height: 40,
                id: 'glossaryBtn',
                cls: 'glossary-btn',
                //margin: '0 0 0 0',
                //padding: '0 0 0 0',
                text: Lang.Glossary,
                ui: 'plain',
                //iconCls: 'glossary',
                //iconMask: true
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button',
                id: 'nextPageBtn',
                cls: ['page-btn','next-btn'],
                height: 28,
                width: 28,
                ui: 'plain'
            }
        ]
    }

});