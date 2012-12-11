Ext.define('Player.page.questions.HONDROS_DD_LETTERS', {
    extend: 'Player.page.questions.Question',

    alias: ['widget.HONDROS_DD_LETTERS'],

    requires: ['Player.layout.Accordion','Player.page.questions.hondrosComponents.ddletters'],

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
            xtype: 'container',
            itemId: 'accordionContainer',
            width: "90%",

            items: [{
                layout: {
                    type: 'accordion',
                    mode: 'SINGLE',
                    arrowAlign: 'left'
                },
                itemId: 'defAccordion'
            }]
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
        }]
    },

    applyPageData: function(config) {
        return config;
    },
    updateQuestionRecord: function(newRecord, oldRecord) {
        this.callParent(arguments);
        var me = this,
            defAccordion = me.query('#defAccordion')[0],
            distractorStartIndex = me.indexOf(me.getComponent('distractorStart')) + 1,
            distractorsList, correctResponse = [],
            newPageData = newRecord.raw,
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
        for(var i = 0, ln = distractorsList.length; i < ln; i++) {
            tempDef = distractorsList[i];
            var tempItem = Ext.create('Player.page.questions.hondrosComponents.ddletters', {
                title: tempDef['#text'],
                pageData: tempDef,
                total: ln,
                fullPageData: newPageData,
                cls: 'def-item',
                collapsed: true
            });
            tempItem.title = tempDef['#text'];
            tempItem.collapsed = true;

            tempItem.on('selected', me.onSelect, me);

            defAccordion.add(tempItem);

            longText = tempDef['#text'].replace(/(<([^>]+)>)/ig, "");
            correctResponse.push({
                Short: tempDef.matchelement,
                Long: longText
            });
        }
        // Update Store Refrence
        me.getQuestionRecord().set('correctResponse', correctResponse);
        me.getQuestionRecord().set('trackingType', 'MC');

        try {
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        } catch(e) {}
    },
    onSelect: function(obj, selectedValue) {
        var me = this,
            defAccordion = me.query('#defAccordion')[0],
            selectedList = [];
                
        for(var i = 0, ln = defAccordion.items.items.length; i < ln; i++) {
            var temp = defAccordion.items.items[i],
                tempSelected = temp.getSelectedValue();
            if(temp != obj && tempSelected == obj.getSelectedValue()){
                temp.clearSelected();
            }
            if(tempSelected > 0){
                selectedList.push(temp.getSelectedValue());
            }
        }
        for(var i = 0, ln = defAccordion.items.items.length; i < ln; i++) {
            var temp = defAccordion.items.items[i];
            temp.setSelectedList(selectedList);
        }
        /**
            TODO: select next item in defAccordion
        */
    },
    onCheckAnswer: function(showFeedback) {
        this.callParent(arguments);
        var i, ln, hasOwn = Object.prototype.hasOwnProperty,
            me = this,
            results = me.getValues(),
            defAccordion = me.query('#defAccordion')[0],
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

        for(var i = 0, ln = defAccordion.items.items.length; i < ln; i++) {
            var tempDef = defAccordion.items.items[i],
                tempGuess = tempDef.getSelectedValue(),
                tempData = tempDef.getPageData(); 

            guessString += tempGuess;
            
            longText = tempData['#text'].replace(/(<([^>]+)>)/ig, "");
            userResponse.push({
                Short: tempGuess,
                Long: longText
            });
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
        var qs = this.query('segmentedbutton'),
            i = 0,
            ln = qs.length;
        for(i = 0; i < ln; i++) {
            qs[i].setDisabled(true);
        }
    },
    clearOptions: function() {
        var me = this,
            defAccordion = me.query('#defAccordion')[0];

        for(var i = 0, ln = defAccordion.items.items.length; i < ln; i++) {
            defAccordion.items.items[i].clearSelected();
        }
    },
    onResetAnswers: function() {
        this.setTriesAttempted(0);
        this.clearOptions();
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