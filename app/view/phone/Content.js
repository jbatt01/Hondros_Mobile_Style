Ext.define('Player.view.phone.Content', {
    extend: 'Player.view.Content',
    alias: 'widget.contentphone',
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
            },
            {
                xtype: 'tableofcontents',
                id: 'tableOfContents',
                width: '100%',
                height: '100%'

            }
        ]
    },

    updateScreen: function(screen) {
        var me = this;

        switch (screen) {
        case 'main':
            me.setActiveItem(0);
            break;
        case 'glossary':
            me.animateActiveItem(1, {
                type: 'flip',
                direction: 'right'
            });
            break;
        case 'toc':
            if (me.dir && me.dir == 'right') {
                me.dir = 'right';
                me.out = false;
            } else {
                me.dir = 'left';
                me.out = true;
            }
            me.animateActiveItem(2, {
                type: 'flip',
                direction: me.dir,
                out: true,
                duration: 450
            });
            break;
        }
    }

});