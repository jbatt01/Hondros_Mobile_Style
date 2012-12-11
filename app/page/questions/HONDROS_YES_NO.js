Ext.define('Player.page.questions.HONDROS_YES_NO', {
    extend: 'Player.page.questions.Question',

    alias: ['widget.HONDROS_YES_NO'],

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

    updateQuestionRecord: function(newRecord, oldRecord) {
        this.callParent(arguments);
        var me = this,
            distractorStartIndex = me.indexOf(me.getComponent('distractorStart')) + 1,
            distractorsList, correctResponse = [],
            newPageData = newRecord.raw;

        // Add question text
        me.getComponent('questonText').setHtml(newPageData.questionText['#text']);

        // Reset Button
        this.getComponent('resetBtn').setHidden(((!newPageData.resetBtn) || (typeof newPageData.resetBtn == 'undefined')));

        // Feedback and instructions
        this.getInstructions().setHtml(this.getInitprompt_Text());

        if (this.getProvideFeedback() === false) {
            this.getComponent('checkAnswerBtn').hide();
        }


        // Add distractors
        distractorsList = [{
            "#text": 'Yes'
        }, {
            "#text": "No"
        }];

        for (var i = 0, ln = distractorsList.length; i < ln; i++) {
            var distractorData = distractorsList[i];

            var distractorCheckbox = Ext.create('Ext.form.Radio', {
                label: distractorData['#text'],
                name: 'distractor',
                value: (i == 0) ? 'Yes' : 'No',
                width: 120,
                height: 57,
                //labelWrap: true,
                labelWidth: '100%',
                correct: (!i == newPageData.correctResp),
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
                    if (me.getDisabled()) {
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
        me.getQuestionRecord().set('correctResponse', newPageData.correctResp);
        me.getQuestionRecord().set('trackingType', 'TF');

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
        var i, hasOwn = Object.prototype.hasOwnProperty,
            me = this,
            results = me.getValues(),
            questionRecord = me.getQuestionRecord(),
            answerString = questionRecord.get('correctResponse')?'Yes' : 'No',
            guessString = '',
            triesAttempted = me.getTriesAttempted(),
            intLatency = 0;

        me.hideInstructions();

        if (triesAttempted >= me.getTries()) {
            me.showFeedbackPopup();
            me.disableQuestion();
            return;
        }

        me.setTriesAttempted(++triesAttempted);

        guessString = results.distractor;

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
        questionRecord.set('response', guessString);
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
    },

    start: function() {
        var me = this,
            d = new Date();

        me.callParent(arguments);
        
        me.firstSelect = true;
        me.showInstructions(me.getInitprompt_Text(), false);

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
            } else if (tempTarget.id.match(/radiofield/) || tempTarget.id.match(/instructions/)) {
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
