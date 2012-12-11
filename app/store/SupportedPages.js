Ext.define('Player.store.SupportedPages', {
    extend: 'Ext.data.Store',
    alias: 'store.supportedpages',
    requires: [
        'Player.model.PageList'
    ],

    config: {
        autoLoad: true,
        model: 'Player.model.PageList',
        storeId: 'SupportedPages',
        proxy: {
            type: 'ajax',
            pageParam: 'notPage',
            url: 'data/suppotedPages.json',
            reader: {
                type: 'json',
                rootProperty: 'page',
                totalProperty: 'totalCount'
            }
        }
    }
});