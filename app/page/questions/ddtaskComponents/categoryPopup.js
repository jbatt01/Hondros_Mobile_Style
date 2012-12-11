Ext.define('Player.page.questions.ddtaskComponents.categoryPopup', {
    extend: 'Ext.Container',

    alias: ['widget.categoryPopup'],


    config: {
        centered: true,
        width: '90%',
        hideOnMaskTap: true,
        hidden: true,
        cls: 'ddtask-cat-pop',
        categories: [],
        modal: true,
        items: [{
            xtype: 'titlebar',
            docked: 'top',
            title: 'Select the category this belongs to:',
            items: [{
                xtype: 'button',
                align: 'right',
                itemId: 'closeBtn',
                ui: 'round',
                text: 'X'
            }]
        }, {
            xtype: 'list',
            height: 95,
            itemId: 'categoryList',
            cls: 'ddtask-cat-list',
            itemTpl: ['<div class="ddtask-cat-item">{title}</div>']
        }],
        listeners: [{
            fn: 'onClose',
            event: 'tap',
            delegate: '#closeBtn'
        }, {
            fn: 'onSelect',
            event: 'select',
            delegate: '#categoryList'
        }]
    },

    updateCategories: function(newCategories, oldCategories){
        var me = this,
            listContainer = me.getComponent('categoryList');
        if(newCategories && newCategories.length > 0){
            listContainer.setData(newCategories);
        }
    },

    onSelect: function(dataview, record, options) {
        var me = this,
            listContainer = me.getComponent('categoryList');
        me.fireEvent('selectCategory', record);
        listContainer.deselectAll();
        me.onClose();
    },
    onClose: function(button, e, options) {
        this.hide();
    }
});