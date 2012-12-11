Ext.define('Player.store.base.HelpStore', {
    extend: 'Ext.data.Store',
    requires: [
        'Player.model.HelpModel'
    ],

    config: {
        autoLoad: true,
        model: 'Player.model.HelpModel',
        storeId: 'HelpStore',
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