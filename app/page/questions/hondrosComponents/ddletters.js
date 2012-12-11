Ext.define('Player.page.questions.hondrosComponents.ddletters', {
    extend: 'Ext.Container',

    alias: ['widget.ddletters'],

    config: {
        pageData: {},
        total: 0,
        selectedValue: 0,
        selectedLetter: '',
        selectedList: [],
        fullPageData: {},
        items: [{
            xtype: 'segmentedbutton',
            itemId: 'options',
            layout: {
                pack: 'center',
                type: 'vbox'
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
            selectedValue = button.config.value,
            selectedLetter = button.config.letter;
        me.setSelectedValue(selectedValue);
        me.setSelectedLetter(selectedLetter);
        me.fireEvent("selected", me);
    },

    updateSelectedList: function(newList, oldList) {
        var me = this,
            buttonList = me.query('segmentedbutton button');
        for(var i = buttonList.length - 1; i >= 0; i--) {
            buttonList[i].removeCls('already-selected');
        };
        for(var i = newList.length - 1; i >= 0; i--) {
            if(newList[i] > 0){
                var btn = buttonList[newList[i] - 1];
                btn.addCls('already-selected');
            }
        };
    },

    updateSelectedValue: function(newValue, oldValue) {
        /*var me = this;

        if(newValue === 0) {
            me.clearSelected();
        } else {
            var tb = me.items.items[0],
                ta = tb.items.items[0];
            ta.query('button')[0].hide();
            ta.setHtml(newValue);
        }*/
    },
    updateSelectedLetter: function(newValue, oldValue) {
        var me = this;

        if(newValue === '') {
            me.clearSelected();
        } else {
            var tb = me.items.items[0],
                ta = tb.items.items[0];
            ta.query('button')[0].hide();
            ta.setHtml('<div class="dd-title-letter">'+newValue+'<div>');
        }
    },

    /*updateTotal: function(newTotal, oldTotal) {
        var me = this,
            buttonContainer = me.getComponent('options')
            
        for(var i = 0; i < newTotal; i++) {
            var letter = alphabet.shift();
            buttonContainer.add({
                xtype: 'button',
                flex: 1,
                text: letter,
                value: i+1
            });
        };
    },*/
    updateFullPageData: function(newPageData, oldPageData) {
        var me = this,
            total = me.getTotal(),
            buttonContainer = me.getComponent('options'),
            numToString = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'none', 'ten'],
            alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        if(total > 0) {

            for(var i = 0; i < total; i++) {
                var letter = alphabet.shift();
                var text = '<div class="dd-btn"><div class="dd-letter">'+letter + '</div><div class="dd-object">' + newPageData['object'+numToString[i]]['#text'] + '</div></div>';
                buttonContainer.add({
                    xtype: 'button',
                    flex: 1,
                    cls:'ltr-btn',
                    letter: letter,
                    text: text,
                    value: i + 1
                });
            };
        }
    },
    clearSelected: function() {
        var me = this,
            qs = me.query('segmentedbutton')[0],
            tb = me.items.items[0],
            ta = tb.items.items[0],
            buttonList = me.query('segmentedbutton button');

        for(var i = buttonList.length - 1; i >= 0; i--) {
            buttonList[i].removeCls('already-selected');
        };

        try {
            ta.query('button')[0].show();
            ta.setHtml('');
        } catch(e) {}

        me.setSelectedValue(0);
        me.setSelectedLetter('');
        qs.setPressedButtons();
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
    }
});