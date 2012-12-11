Ext.define('Player.page.questions.MC', {
    extend: 'Player.page.questions.Question',

    alias: ['widget.MC'],

    config: {
        layout: {
            align: 'center',
            type: 'vbox'
        },
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        pageData: {},
        items: [{
            xtype: 'panel',
            html: 'Question Text Goes here....',
            itemId: 'questonText',
            cls: 'questiontext',
            maxWidth: '100%',
            minHeight: '100px',
            minWidth: '250px'
        }, {
            xtype: 'spacer',
            height: 20,
            itemId: 'distractorStart'
        },
        // Distractors go here....
        {
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
            hidden: true
        }, {
            xtype: 'spacer',
            height: 50
        }]
    },

    applyPageData: function(config) {
        return config;
    },
    updateQuestionRecord: function(newRecord, oldRecord){
        this.callParent(arguments);
        var me = this,
            distractorStartIndex = me.indexOf(me.getComponent('distractorStart')) + 1,
            distractorsList, correctResponse = [],
            newPageData = newRecord.raw,
            alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


        me.responseKey = {};

        // Add question text
        me.getComponent('questonText').setHtml(newPageData.questionText['#text']);

        // Reset Button
        me.getComponent('resetBtn').setHidden(((!newPageData.resetBtn) || (typeof newPageData.resetBtn == 'undefined')));

        // Feedback and instructions
        me.getInstructions().setHtml(me.getInitprompt_Text());

        if (me.getProvideFeedback() === false) {
            me.getComponent('checkAnswerBtn').hide();
        }

        // Add distractors
        if (newPageData.distractors.randomize) {
            var s = [],
                items = newPageData.distractors.distractor;

            while (items.length) {
                s.push(items.splice(Math.random() * items.length, 1)[0]);
            }
            while (s.length) {
                items.push(s.pop());
            }
        }
        distractorsList = newPageData.distractors.distractor;

        for (var i = 0, ln = distractorsList.length; i < ln; i++) {
            var distractorData = distractorsList[i],
                letter,
                longText;
            if (!distractorData || !distractorData['#text']) {
                continue;
            }
            letter = alphabet.shift();
            longText = distractorData['#text'].replace(/(<([^>]+)>)/ig, "");
            if (distractorData.correct) {
                correctResponse.push({Short:letter, Long:longText});
            }
            me.responseKey[letter] = longText;

            var distractorCheckbox = Ext.create('Ext.form.Checkbox', {
                label: distractorData['#text'],
                name: letter,
                width: '75%',
                labelWidth: '100%',
                labelWrap: true,
                correct: distractorData.correct,
                letter: letter,
                iFeedback: distractorData.iFeedback,
                styleHtmlContent: true,
                labelCls: 'checkBoxlabel',
                labelAlign: 'right',
                listeners: {
                    check: me.onSelect,
                    scope: me
                }
            });

            distractorCheckbox = me.insert(distractorStartIndex++, distractorCheckbox);
            distractorCheckbox.element.on({
                tap: function(e) {
                    var me = this;
                    if (this.getDisabled()) {
                        return;
                    }
                    //if (e.target.type != 'checkbox') {
                    if(e.target.className.search('x-field-mask')<0){
                        me.setChecked(!me.getChecked())
                    }
                    if (me.getChecked()) {
                        me.fireEvent('check', me, e);
                    } else {
                        me.fireEvent('uncheck', me, e);
                    }
                },
                scope: distractorCheckbox
            });
        }

        // Update Store Refrence
        me.getQuestionRecord().set('correctResponse', correctResponse);

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },
    onSelect: function() {
        var me = this;
        if (me.firstSelect && me.getProvideFeedback()) {
            me.showInstructions(me.getEvalprompt_Text(), true);
            me.firstSelect = false;
        }
    },
    onCheckAnswer: function(showFeedback) {
        this.callParent(arguments);
        var i, ln, hasOwn = Object.prototype.hasOwnProperty,
            me = this,
            results = me.getValues(),
            questionRecord = me.getQuestionRecord(),
            answerString = '',
            correctResponses = questionRecord.get('correctResponse'),
            guessString = '',
            triesAttempted = me.getTriesAttempted(),
            userResponse = [],
            intLatency = 0;

        me.hideInstructions();

        if (triesAttempted >= me.getTries()) {
            me.showFeedbackPopup();
            me.disableQuestion();
            return;
        }

        me.setTriesAttempted(++triesAttempted);

        for(i=0,ln=correctResponses.length;i<ln;i++){
            answerString += correctResponses[i].Short;
        }

        for (i in results) {
            if (hasOwn.call(results, i)) {
                if (results[i]) {
                    guessString += i;
                    userResponse.push({Short:i, Long:me.responseKey[i]});
                }
            }
        }
        
        if (answerString === guessString) {
            // Correct
            me.showFeedbackPopup(Lang.Correct, me.getCorrectfeedback_Text());
            questionRecord.set('blnCorrect', true);
            me.disableQuestion();
        } else {
            if (triesAttempted >= me.getTries()) {
                me.showFeedbackPopup(Lang.Incorrect, me.getIncorrectfeedback_Text());
            } else {
                me.showFeedbackPopup(Lang.Try_Again, me.getTriesfeedback_Text());
            }
            questionRecord.set('blnCorrect', false);
        }
        questionRecord.set('response', userResponse);
        questionRecord.set('complete', true);

        var d = new Date();
        intLatency = d.getTime() - this.startTime;
        questionRecord.set('intLatency', intLatency);

        if (triesAttempted >= me.getTries()) {
            me.disableQuestion();
        }
        this.fireEvent('questoncomplete', questionRecord);
    },
    disableQuestion: function() {
        var qs = this.query('checkboxfield'),
            i = 0,
            ln = qs.length;
        for (i = 0; i < ln; i++) {
            qs[i].setDisabled(true);
        }
    },
    clearOptions: function() {
        var qs = this.query('checkboxfield'),
            i = 0,
            ln = qs.length;

        for (i = 0; i < ln; i++) {
            qs[i].setChecked(false);
            qs[i].setDisabled(false);
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
        while (tempTarget.parentNode) {
            if (tempTarget.id == this.id) {
                hideins = true;
                break;
            } else if (tempTarget.id.match(/checkboxfield/) || tempTarget.id.match(/instructions/)) {
                hideins = false;
                break
            } else {
                tempTarget = tempTarget.parentNode;
            }
        }
        if (hideins) {
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
