Ext.define('MyApp.store.base.ScoXmlTreeStore', {
    extend: 'Ext.data.TreeStore',
    requires: [
        'MyApp.model.ScoXmlModel'
    ],

    config: {
        model: 'MyApp.model.ScoXmlModel',
        storeId: 'ScoXmlTreeStore',
        proxy: {
            type: 'ajax',
            url: 'sco.xml',
            reader: {
                type: 'xml',
                rootProperty: 'topics',
                record: 'page'
            }
        }
    }
});