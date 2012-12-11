Ext.define('Player.store.HiddenPages', {
    extend: 'Ext.data.Store',
    requires: [
        'Player.model.PageModel'
    ],

    config: {
        autoLoad: true,
        autoSync: false,
        model: 'Player.model.PageModel',
        storeId: 'hiddenPages',
        proxy: {
            type: 'ajax',
            url: 'data/hiddenPages.json',
            reader: {
                type: 'json'
            }
        }
    }
});