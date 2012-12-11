Ext.define('Player.layout.Accordion', {
    extend : 'Ext.layout.Default',
    alias  : 'layout.accordion',

    requires : [
        'Ext.TitleBar'
    ],

    itemCls              : Ext.baseCSSPrefix + 'layout-accordion-item',
    itemAnimCls          : Ext.baseCSSPrefix + 'layout-accordion-item-anim',
    itemArrowCls         : Ext.baseCSSPrefix + 'accordion-arrow',
    itemArrowExpandedCls : Ext.baseCSSPrefix + 'accordion-arrow-expanded',

    config : {
        expandedItem : null,
        mode         : 'SINGLE',
        arrowAlign   : 'right'
    },

    constructor: function(container) {
        this.callParent(arguments);

        if (this.getMode() === 'SINGLE') {
            container.on('show', 'checkMode', this, { single : true });
        }
    },

    checkMode: function(container) {
        var items = container.getInnerItems(),
            i     = 0,
            iNum  = items.length,
            item, lastItem;

        for (; i < iNum; i++) {
            item = items[i];

            if (!item.collapsed) {
                if (lastItem) {
                    this.collapse(lastItem);
                }

                lastItem = item;
            }
        }
    },

    insertItem: function(item, index) {
        var me = this;

        me.callParent([item, index]);

        if (item.isInnerItem()) {
            var titleDock = item.titleDock = item.insert(0, {
                xtype: 'titlebar',
                docked: 'top',
                ui: 'light',
                cls: 'def-toolbar',
                title: item.title,
                items: [{
                    cls: me.itemArrowCls,
                    width: 46,
                    ui: 'plain',
                    align: me.getArrowAlign(),
                    scope: me,
                    handler: 'handleToggleButton'
                }]
            }),
            arrowBtn = item.arrowButton = titleDock.down('button[cls=' + me.itemArrowCls + ']');
             titleDock.element.on('tap', me.onTitlebarTap, me);

            item.addCls(me.itemCls);
            arrowBtn.addCls(me.itemArrowExpandedCls);

            item.on('painted', function() {
                item.addCls(me.itemAnimCls);
            }, me, {
                single: true
            });

            if (item.collapsed) {
                item.on('painted', 'collapse', me, {
                    single: true
                });
            } else if (me.getMode() === 'SINGLE') {
                me.setExpandedItem(item);
            }
        }
    },

    onTitlebarTap: function(e, node){
        e.stopPropagation();
        var me = this,
            items = this.innerItems,
            ln = items.length,
            tempItem;

        for(var i=0;i<ln;i++){
            tempItem = items[i];
            if(tempItem.element.query("#"+node.id).length > 0){
                break;
            }
        }
        me.expand(tempItem);
    },

    handleToggleButton: function(btn) {
        var component = btn.up('titlebar').up('component');

        this.toggleCollapse(component);
    },

    toggleCollapse: function(component) {
        this[component.collapsed ? 'expand' : 'collapse'](component);
    },

    collapse: function(component) {
        
        if (component.isInnerItem() && !(this.getMode() === 'SINGLE' && this.getExpandedItem() === component)) {
            var titleDock   = component.titleDock,
                titleHeight = titleDock.element.getHeight();
            component.fullHeight = component.element.getHeight();
            component.setHeight(titleHeight);
            component.collapsed = true;
            component.arrowButton.removeCls(this.itemArrowExpandedCls);
        }
    },

    expand: function(component) {
        if (component.isInnerItem()) {
            if (this.getMode() === 'SINGLE') {
                var expanded = this.getExpandedItem();

                this.setExpandedItem(component);
                if(expanded){
                    this.collapse(expanded);    
                }
                
            }
            component.setHeight(component.fullHeight);
            component.collapsed = false;
            component.arrowButton.addCls(this.itemArrowExpandedCls);
        }
    }
});