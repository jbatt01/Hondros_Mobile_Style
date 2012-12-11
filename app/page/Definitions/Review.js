Ext.define('Player.page.Definitions.Review', {
    extend: 'Ext.Container',

    alias: ['widget.defreview'],
    requires: ['Player.layout.Accordion'],

    config: {
        pageData: {},
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        layout: {
            align: 'center',
            pack: 'center',
            type: 'vbox'
        },
        items: [{
            xtype: 'container',
            docked: 'top',
            height: 64,
            cls: 'def-instructions',
            html: 'review instructions',
            itemId: 'reviewInstructions',
            ui: 'light',
            scrollable: {
                direction: 'vertical',
                directionLock: true
            }
        }, {
            xtype: 'container',
            itemId: 'accordionContainer',
            width: "90%",

            items: [{
                layout: {
                    type: 'accordion',
                    mode: 'SINGLE'
                },
                itemId: 'defAccordion'
            }]
        }, {
            xtype: 'container',
            docked: 'bottom',
            height: 42,
            itemId: 'reviewButtonBar',
            layout: {
                align: 'center',
                pack: 'center',
                type: 'hbox'
            },
            items: [{
                xtype: 'button',
                itemId: 'gotoPracticeBtn',
                text: Lang.Review_Practice
            }]
        }]
    },
    applyPageData: function(config) {
        if (config.title) {
            return config;
        }
        return false;
    },

    updatePageData: function(newPageData, oldPageData) {
        if (!newPageData) {
            return;
        }

        var me = this,
            defAccordion = me.query('#defAccordion')[0],
            tempDef, ln = newPageData.definitionsText.defText.length,
            firstItem;

        if (newPageData.reviewMobileInst && newPageData.reviewMobileInst['#text']) {
            me.getComponent('reviewInstructions').setHtml(newPageData.reviewMobileInst['#text']);
        } else if (newPageData.instructionText && newPageData.instructionText['#text']) {
            me.getComponent('reviewInstructions').setHtml(newPageData.instructionText['#text']);
        }

        // Add All Items
        for (var i = 0; i < ln; i++) {
            tempDef = newPageData.definitionsText.defText[i];
            var tempItem = Ext.create('Ext.Container', {
                title: tempDef.term,
                html: tempDef['#text'],
                cls: 'def-item',
                collapsed: true
            });
            tempItem.title = tempDef.term;
            tempItem.collapsed = true;
            
            defAccordion.add(tempItem);
        }

        // Expand first item
        
        Ext.Function.defer(function() {
            if(defAccordion.innerItems.length > 0){
                defAccordion.getLayout().expand(defAccordion.innerItems[0]);
            }
        }, 600, me, []);
        
        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    }

});