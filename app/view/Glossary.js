Ext.define('Player.view.Glossary', {
    extend: 'Ext.dataview.NestedList',
    alias: 'widget.glossary',

    config: {
        displayField: 'title',
        store: 'GlossaryTreeStore',
        title: Lang.Glossary,
        toolbar: {
            xtype: 'titlebar',
            ui: 'dark',
            items: [
                {
                    xtype: 'button',
                    id: 'closeGlossaryBtn',
                    ui: 'round',
                    text: Lang.Close,
                    align: 'right'
                }
            ]
        }
    },

    getItemTextTpl: function(node) {
        return    '<tpl if="leaf !==  true">'+
        '<div style="width 250px"><div style="float: left; width:160px; margin: 4px;"><span class="tocTopic" style="float:none">{title} ({numDef})</span></div>'+
        '<div style="float: right; width:10px; margin: 4px;"><img src="resources/img/tocArrow-02.png"/></div></div>'+
        '</tpl>'+
        '<tpl if="leaf === true">'+
        '<span  class="tocLabel">{title}</span>'+
        '</tpl>';
    }

});