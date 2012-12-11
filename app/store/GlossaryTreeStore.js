Ext.define('Player.store.GlossaryTreeStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.glossarytreestore',
    requires: [
        'Player.model.Glossary'
    ],

    config: {
        autoLoad: true,
        model: 'Player.model.Glossary',
        storeId: 'GlossaryTreeStore',
        defaultRootProperty: 'definitions',
        root: {
            
        },
        proxy: {
            type: 'ajax',
            url: 'data/glossary.json',
            reader: {
                type: 'json',
                rootProperty: 'definitions'
            }
        }
    }
});