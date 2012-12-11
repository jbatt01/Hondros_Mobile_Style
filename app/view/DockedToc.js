Ext.define('Player.view.DockedToc', {
    extend: 'Ext.Container',
    alias: 'widget.dockedtoc',
    requires: [
        'Player.view.TableOfContents'
    ],

    config: {
        docked: 'left',
        width: 250,
        layout: {
            type: 'fit'
        },
        cls: [
            'dockedtoc'
        ],
        items: [
            {
                xtype: 'tableofcontents',
                id: 'tableOfContents'
            }
        ]
    }

});