Ext.define('Player.view.GlossaryPanel', {
    extend: 'Ext.Panel',
    alias: 'widget.glossarypanel',

    config: {
        centered: true,
        height: 250,
        hidden: true,
        hideAnimation: 'popOut',
        padding: '5 5 5 5',
        showAnimation: 'popIn',
        width: 250,
        scrollable: 'vertical',
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                items: [
                    {
                        xtype: 'button',
                        id: 'closeTerm',
                        itemId: 'mybutton11',
                        ui: 'round',
                        iconCls: 'delete',
                        iconMask: true,
                        align: 'right'
                    }
                ]
            }
        ]
    }

});