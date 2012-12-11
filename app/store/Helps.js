Ext.define('Player.store.Helps', {
    extend: 'Ext.data.Store',
    requires: [
        'Player.model.Help'
    ],

    config: {
        autoLoad: true,
        model: 'Player.model.Help',
        storeId: 'Helps',
        proxy: {
            type: 'ajax',
            url: 'data/help.json',
            reader: {
                type: 'json',
                rootProperty: 'helpitems'
            }
        }
    }
});