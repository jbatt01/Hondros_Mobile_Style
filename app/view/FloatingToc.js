Ext.define('Player.view.FloatingToc', {
    extend: 'Ext.Panel',
    alias: 'widget.floatingtoc',

    config: {
        centered: true,
        height: 400,
        hidden: true,
        id: 'floatingToc',
        width: 262,
        autoDestroy: false,
        hideOnMaskTap: true,
        layout: {
            type: 'fit'
        },
        modal: true
    }

});