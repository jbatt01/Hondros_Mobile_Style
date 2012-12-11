Ext.define('Player.page.questions.hondrosComponents.ddnums', {
    extend: 'Ext.Container',

    alias: ['widget.ddnums'],

    config: {
        pageData: {},
        total: 0,
        selectedValue: 0,
        selectedList: [],
        items: [{
            xtype: 'segmentedbutton',
            itemId: 'options',
            layout: {
                pack: 'center',
                type: 'hbox'
            },
            items: []
        }],
        listeners: [{
            fn: 'onSelect',
            event: 'toggle',
            delegate: '#options'
        }]
    },

    onSelect: function(segmentedbutton, button, isPressed, options) {
        var me = this,
            selectedValue = button.config.value;
        me.setSelectedValue(selectedValue);
        me.fireEvent("selected", me);
    },

    updateSelectedList: function(newList, oldList){
        var me = this,
            buttonList = me.query('segmentedbutton button');
        for (var i = buttonList.length - 1; i >= 0; i--) {
            buttonList[i].removeCls('already-selected');
        };
        for (var i = newList.length - 1; i >= 0; i--) {
            if(newList[i] > 0){
                var btn = buttonList[newList[i] - 1];
                btn.addCls('already-selected');
            }
        };
    },

    updateSelectedValue: function(newValue, oldValue){
        var me = this;

        if(newValue === 0){
            me.clearSelected();
        }
        else{
            var tb = me.items.items[0],
                ta = tb.items.items[0];
            ta.query('button')[0].hide();
            ta.setHtml('<div class="dd-title-letter">'+newValue+'<div>');
        }
    },

    updateTotal: function(newTotal, oldTotal) {
        var me = this,
            buttonContainer = me.getComponent('options');
        for(var i = 0; i < newTotal; i++) {
            buttonContainer.add({
                xtype: 'button',
                cls:'num-btn',
                height: 45,
                flex: 1,
                text: i + 1,
                value: i+1
            });
        };
    },
    clearSelected: function(){
        var me = this,
            qs = me.query('segmentedbutton')[0],
            tb = me.items.items[0],
            ta = tb.items.items[0],
            buttonList = me.query('segmentedbutton button');

        for(var i = buttonList.length - 1; i >= 0; i--) {
            buttonList[i].removeCls('already-selected');
        };

        try{
            ta.query('button')[0].show();
            ta.setHtml('');
        }catch(e){}

        me.setSelectedValue(0);
        qs.setPressedButtons();
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
    }
});