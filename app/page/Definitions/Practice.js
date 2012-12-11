Ext.define('Player.page.Definitions.Practice', {
    extend: 'Ext.Container',

    alias: ['widget.practice'],

    config: {
        layout: {
            type: 'vbox'
        },
        pageData: {},
        items: [{
            xtype: 'container',
            docked: 'top',
            itemId: 'reviewToolbar',
            cls: 'def-instructions',
            height: 64,
            layout: {
                align: 'center',
                pack: 'center',
                type: 'hbox'
            },
            items: [{
                xtype: 'container',
                height: 64,
                width: '100%',
                html: Lang.Practice_Instructions,
                itemId: 'practiceInstructions',
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                }
            },{
                xtype: 'spacer',
                width: 10
            }, {
                xtype: 'button',
                docked: 'right',
                itemId: 'resetBtn',
                height: 40,
                text: Lang.Reset
            }]
        }, {
            xtype: 'container',
            html: Lang.Practice_Step1,
            cls: 'def-step',
            itemId: 'termTitle'
        }, {
            xtype: 'list',
            itemId: 'termList',
            flex: 1,
            scrollable: {
                direction: 'vertical',
                directionLock: true
            },
            itemTpl: ['<div>{term}</div>']
        }, {
            xtype: 'container',
            html: Lang.Practice_Step2,
            cls: 'def-step',
            itemId: 'defTitle'
        }, {
            xtype: 'list',
            itemId: 'defList',
            flex: 1,
            scrollable: {
                direction: 'vertical',
                directionLock: true
            },
            itemTpl: [
                        '<tpl if="correct === true">', 
                            '<div class="def-correct">', 
                            '<img src="resources/img/right.png"/> {term} - ', 
                        '</tpl>', 
                        '<tpl if="correct === false">', 
                            '<div>', 
                        '</tpl>', 
                      '{#text}</div>']
        }, {
            xtype: 'container',
            docked: 'bottom',
            height: 42,
            itemId: 'practiceButtonBar',
            layout: {
                align: 'center',
                pack: 'center',
                type: 'hbox'
            },
            items: [{
                xtype: 'button',
                itemId: 'gotoReviewBtn',
                text: Lang.Practice_Review
            }]
        }]
    },
    applyPageData: function(config) {
        if (config.title) {
            return config;
        }
        return false
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this;

        if (!newPageData) {
            return;
        }

        if (newPageData.practiceMobileInst && newPageData.practiceMobileInst['#text']) {
            me.query('#practiceInstructions')[0].setHtml(newPageData.practiceMobileInst['#text']);
        } else if (newPageData.instructionTextDD && newPageData.instructionTextDD['#text']) {
            me.query('#practiceInstructions')[0].setHtml(newPageData.instructionTextDD['#text']);
        }
        me.onReset();

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },
    onTermSelect: function(dv, record, eOpts) {
        this.selectedRecord = record;
    },
    onDefSelect: function(dv, record, eOpts) {
        var me = this,
            defList = me.query('#defList')[0],
            termList = me.query('#termList')[0],
            defStore = defList.getStore(),
            termStore = termList.getStore(),
            defNode;
        if(!me.selectedRecord){
           Ext.Msg.alert(Lang.Error, Lang.Practice_SelectTerm, Ext.emptyFn);
           defList.deselect(defList.getSelection());
           return; 
        }

        if (me.selectedRecord.get('termId') === record.get('termId')) {
            defNode = defStore.getAt(defStore.find('termId', record.get('termId')));
            // correct
            record.set('correct', true);
            defNode.set('correct', true);

            // Clear term selection
            me.selectedRecord.stores[0].remove(me.selectedRecord);
            me.selectedRecord = null;

            // make list item green
            var st = dv.getStore(),
                index = st.indexOf(record),
                list = dv.getActiveItem().getViewItems(),
                ln = list.length, i,
                allComplete = true;

            for (i = 0; i < ln; i++) {
                if (index == i) {
                    list[i].className = "x-list-item x-item-selected x-list-item-correct";
                } else if(list[i].className.search('x-list-item-correct') < 0) {
                    list[i].className = "x-list-item";
                }
            }

            // Check for all complete
            
            /*ln = defList.getData().length;
            list = defList.getData();
            for(i=0;i<ln;i++){
                if(!list.correct){
                    allComplete = false;
                    break;
                }
            }*/


            if(termStore.getCount() <= 0){
                Player.app.fireEvent('pageComplete');
            }

        } else {
            // Incrorrect
            Ext.Msg.show({
                title: Lang.Sorry,
                message: Lang.Practice_NotAMatch,
                buttons: {
                    text: Lang.Try_Again,
                    itemId: 'ok',
                    ui: 'action'
                },
                promptConfig: false,
                fn: function(e) {
                    var defList = this.query('#defList')[0];
                    defList.deselect(defList.getSelection());
                },
                scope: me
            });
        }
    },
    onReset: function() {
        var me = this,
            pageData = me.getPageData(),
            defList = me.query('#defList')[0],
            termList = me.query('#termList')[0],
            tempDef, ln = pageData.definitionsText.defText.length,
            termStore = termList.getStore(),
            defStore = defList.getStore(),
            s = [];

        me.selectedRecord = null;
        me.terms = [];
        me.defs = [];

        if(termStore){
            termStore.removeAll(false);
        }
        if(defStore){
            defStore.removeAll(false);
        }

        //me.masterList = [];
        for (var i = 0; i < ln; i++) {
            tempDef = pageData.definitionsText.defText[i];
            tempDef.correct = false;
            tempDef.termId = i;
            //me.masterList.push(tempDef);
            me.terms.push(tempDef);
            me.defs.push(tempDef);
        }

        var randomizeTerms = false;
        if (randomizeTerms) {
            s = [];
            // Randomize the array
            while (me.terms.length) {
                s.push(me.terms.splice(Math.random() * me.terms.length, 1)[0]);
            }
            while (s.length) {
                me.terms.push(s.pop());
            }
        }

        var randomizeDefs = true;
        if (randomizeDefs) {
            s = [];
            // Randomize the array
            while (me.defs.length) {
                s.push(me.defs.splice(Math.random() * me.defs.length, 1)[0]);
            }
            while (s.length) {
                me.defs.push(s.pop());
            }
        }

        termList.setData(me.terms);
        defList.setData(me.defs);
    },

    initialize: function() {
        var me = this;

        me.callParent(arguments);

        me.query('#termList')[0].on('select', me.onTermSelect, me);
        me.query('#defList')[0].on('select', me.onDefSelect, me);

        me.query('#resetBtn')[0].on('tap', me.onReset, me);
    }

});