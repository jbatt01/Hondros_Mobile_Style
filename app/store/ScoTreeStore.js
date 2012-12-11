Ext.define('Player.store.ScoTreeStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.scotreestore',
    requires: [
        'Player.model.PageModel'
    ],

    config: {
        autoLoad: true,
        model: 'Player.model.PageModel',
        storeId: 'ScoTreeStore',
        clearOnLoad: false,
        nodeParam: 'page',
        id: 'scoTreeStore',
        proxy: {
            type: 'ajax',
            pageParam: 'notPage',
            url: 'data/sco.json',
            reader: {
                type: 'json',
                rootProperty: 'page',
                totalProperty: 'totalCount'
            }
        },
        listeners: [
            {
                fn: 'onScoTreeStoreLoad',
                event: 'load'
            }
        ]
    },

    onScoTreeStoreLoad: function(store, records, successful, operation, eOpts) {
        Player.app.fireEvent('loadScoTree');
    }

});