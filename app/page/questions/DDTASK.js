Ext.define('Player.page.questions.DDTASK', {
    extend: 'Player.page.questions.Question',

    alias: ['widget.DDTASK'],

    requires: ['Player.page.questions.ddtaskComponents.categoryPopup'],

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
            cls: 'dd-instructions',
            html: 'review instructions',
            itemId: 'reviewInstructions',
            ui: 'dark',
            scrollable: {
                direction: 'vertical',
                directionLock: true
            }
        }, {
            xtype: 'list',
            itemId: 'listContainer',
            scrollable: false,
            cls: 'ddtask-list',
            width: '90%',
            itemTpl: ['<tpl if=\'selectedCategory.title != ""\'><div class="ddtask-category">{selectedCategory.title}</div><div class="ddtask-selected">{#text}</div></tpl><tpl if=\'!selectedCategory\'><div class="ddtask-notselected">{#text}</div></tpl><div class="ddtask-arrow"><img src="/resources/img/tocArrow-02.png"/></div>'

            ]
        }, {
            xtype: 'spacer',
            height: 20
        }, {
            xtype: 'button',
            itemId: 'checkAnswerBtn',
            autoEvent: 'checkanswer',
            text: Lang.Check_Answer,
            cls: 'checkanswer',
            ui: 'checkanswer'
        }, {
            xtype: 'spacer',
            height: 10
        }, {
            xtype: 'button',
            itemId: 'resetBtn',
            autoEvent: 'reset',
            text: Lang.Reset,
            cls: 'checkanswer',
            ui: 'checkanswer',
            hidden: true
        }, {
            xtype: 'spacer',
            height: 50
        }, {
            xtype: 'categoryPopup',
            itemId: 'categoryPopup',
            hideOnMaskTap: true
        }],
        listeners: [{
            fn: 'onSelect',
            event: 'select',
            delegate: '#listContainer'
        }, {
            fn: 'onSelectCategory',
            event: 'selectCategory',
            delegate: '#categoryPopup'
        }]
    },

    applyPageData: function(config) {
        return config;
    },
    updateQuestionRecord: function(newRecord, oldRecord) {
        this.callParent(arguments);
        var me = this,
            listContainer = me.query('#listContainer')[0],
            distractorsList, correctResponse = [],
            newPageData = newRecord.raw,
            categoryPopup = me.getComponent('categoryPopup'),
            alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        me.responseKey = {};
        me.getComponent('reviewInstructions').setHtml(newPageData.questionText['#text']);

        // Reset Button
        me.getComponent('resetBtn').setHidden(((!newPageData.resetBtn) || (typeof newPageData.resetBtn == 'undefined')));

        // Feedback and instructions
        me.getInstructions().setHtml(me.getInitprompt_Text());

        if(me.getProvideFeedback() === false) {
            me.getComponent('checkAnswerBtn').hide();
        }

        // Randomize
        if(newPageData.dragobjects.randomize) {
            var s = [],
                items = newPageData.dragobjects.textelement;

            while(items.length) {
                s.push(items.splice(Math.random() * items.length, 1)[0]);
            }
            while(s.length) {
                items.push(s.pop());
            }
        }

        // Add All Items
        distractorsList = newPageData.dragobjects.textelement;

        listContainer.setData(distractorsList);

        listContainer.on('select', me.onSelect, me);

        for(var i = 0, ln = distractorsList.length; i < ln; i++) {
            tempDef = distractorsList[i];
            longText = tempDef['#text'].replace(/(<([^>]+)>)/ig, "");
            correctResponse.push({
                Short: tempDef.matchelement,
                Long: longText
            });
        }
        // Update Store Refrence
        me.getQuestionRecord().set('correctResponse', correctResponse);
        me.getQuestionRecord().set('trackingType', 'MC');


        // Category Window
        var categories = [];
        for(var i = 0; i < 10; i++) {
            var cat = 'target' + i;
            if(newPageData[cat]) {
                categories.push({
                    title: newPageData[cat],
                    ref: cat,
                    value: i
                });
            }
        };
        categoryPopup.setCategories(categories);

        categoryPopup.on('selectCategory', me.onSelectCategory, me);

        try {
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        } catch(e) {}
    },
    onSelect: function(list, selectedItem) {
        var me = this,
            record = selectedItem.stores[0].findRecord('id', selectedItem.internalId);
        me.getComponent('categoryPopup').show();
        me.selectedRecord = record;
        list.deselectAll();
    },
    onSelectCategory: function(selectedRecord) {
        var me = this;
        me.selectedRecord.set('selectedCategory', selectedRecord.data);
    },
    onCheckAnswer: function(showFeedback) {
        this.callParent(arguments);
        var i, ln, hasOwn = Object.prototype.hasOwnProperty,
            me = this,
            results = me.getValues(),
            listContainer = me.query('#listContainer')[0],
            selectedRecords = listContainer.getStore().data.all,
            questionRecord = me.getQuestionRecord(),
            answerString = '',
            correctResponses = questionRecord.get('correctResponse'),
            guessString = '',
            triesAttempted = me.getTriesAttempted(),
            userResponse = [],
            radios = me.query('radiofield'),
            iFeedback = '',
            tempRadio, intLatency = 0;

        me.hideInstructions();


        if(triesAttempted >= me.getTries()) {
            me.showFeedbackPopup();
            me.disableQuestion();
            return;
        }

        me.setTriesAttempted(++triesAttempted);

        for(i = 0, ln = correctResponses.length; i < ln; i++) {
            answerString += correctResponses[i].Short;
        }
        
        for(var i = 0, ln = selectedRecords.length; i < ln; i++) {
            tempDef = selectedRecords[i].data.selectedCategory;
            if(tempDef) {
                guessString += tempDef.value;
                
                longText = tempDef.title.replace(/(<([^>]+)>)/ig, "");
                userResponse.push({
                    Short: tempDef.value,
                    Long: longText
                });
            }
        }
        if(answerString == guessString) {
            // Correct
            if(!iFeedback) {
                iFeedback = me.getCorrectfeedback_Text();
            }

            me.showFeedbackPopup(Lang.Correct, iFeedback);

            questionRecord.set('blnCorrect', true);
            me.disableQuestion();
        } else {
            if(triesAttempted >= me.getTries()) {
                if(!iFeedback) {
                    iFeedback = me.getIncorrectfeedback_Text();
                }
                me.showFeedbackPopup(Lang.Incorrect, iFeedback);
            } else {
                if(!iFeedback) {
                    iFeedback = me.getTriesfeedback_Text();
                }
                me.showFeedbackPopup(Lang.Try_Again, iFeedback);
            }
            questionRecord.set('blnCorrect', false);
        }
        questionRecord.set('response', userResponse);
        questionRecord.set('complete', true);

        var d = new Date();
        intLatency = d.getTime() - this.startTime;
        questionRecord.set('intLatency', intLatency);

        if(triesAttempted >= me.getTries()) {
            me.disableQuestion();
        }
        this.fireEvent('questoncomplete', questionRecord);
    },
    disableQuestion: function() {
        var me = this,
            listContainer = me.query('#listContainer')[0];
        listContainer.setDisableSelection(true);
    },
    clearOptions: function() {
        var me = this,
            listContainer = me.query('#listContainer')[0],
            selectedRecords = listContainer.getStore().data.all;

        for(var i = 0, ln = selectedRecords.length; i < ln; i++) {
            selectedRecords[i].set('selectedCategory', null);
        }
    },
    onResetAnswers: function() {
         var me = this,
            listContainer = me.query('#listContainer')[0];

        me.setTriesAttempted(0);
        me.clearOptions();
        listContainer.setDisableSelection(false);
    },

    updateInstructions: function(newInstructions, oldInstructions) {
        var me = this;
        me.callParent(arguments);
        newInstructions.on('checkanswer', me.onCheckAnswer, me);
    },

    start: function() {
        var me = this;
        me.callParent(arguments);

        me.firstSelect = true;
        me.showInstructions(me.getInitprompt_Text(), false);
        var d = new Date();
        me.startTime = d.getTime();
        me.clearOptions();
        me.setTriesAttempted(0);
        me.setIsActiveItem(true);

        Ext.getCmp('main').query('instructions')[0].on('checkanswerevt', me.onCheckAnswer, me);
    },
    cleanup: function() {
        var me = this;
        me.setIsActiveItem(false);
        me.onCheckAnswer(false);
        me.hideInstructions();
        me.hideFeedbackPopup();
    },
    onPageTap: function(e) {
        var tempTarget = e.target,
            hideins = true;
        while(tempTarget.parentNode) {
            if(tempTarget.id == this.id) {
                hideins = true;
                break;
            } else if(tempTarget.id.match(/radiofield/) || tempTarget.id.match(/instructions/)) {
                hideins = false;
                break
            } else {
                tempTarget = tempTarget.parentNode;
            }
        }
        if(hideins) {
            this.hideInstructions();
        }
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
        me.getComponent('checkAnswerBtn').on('checkanswer', me.onCheckAnswer, me);
        me.getComponent('resetBtn').on('reset', me.onResetAnswers, me);
        me.element.on({
            tap: me.onPageTap,
            scope: me
        });
    }
});