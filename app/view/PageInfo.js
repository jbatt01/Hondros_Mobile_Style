Ext.define('Player.view.PageInfo', {
    extend: 'Ext.Panel',
    alias: 'widget.pageinfo',

    config: {
        centered: true,
        height: 100,
        hidden: true,
        width: 300,
        layout: {
            align: 'center',
            pack: 'center',
            type: 'vbox'
        },
        hideAnimation: {
            type: 'fadeOut',
            duration: 400
        },
        showAnimation: {
            type: 'fadeIn',
            duration: 400
        },
        items: [
            {
                xtype: 'container',
                html: 'Unit 1: Page Title',
                itemId: 'pageTitle'
            },
            {
                xtype: 'container',
                html: 'Page 1 of 50',
                itemId: 'pageNumber'
            }
        ]
    }

});