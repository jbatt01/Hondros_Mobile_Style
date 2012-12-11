Ext.define('Player.view.Content', {
    extend: 'Ext.Panel',
    alias: 'widget.content',
    requires: [
        'Player.view.Pages',
        'Player.view.Glossary'
    ],

    config: {
        layout: {
            type: 'card'
        },
        screen: 'main',
        items: [
            {
                xtype: 'pages',
                id: 'mainPages'
            },
            {
                xtype: 'glossary',
                id: 'glossaryPanel'
            }
        ]
    }
});