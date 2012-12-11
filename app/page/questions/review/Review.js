Ext.define('Player.page.questions.review.Review', {
    extend: 'Ext.Panel',

    alias: ['widget.reviewquestion'],

    config: {
        layout: {
            type: 'vbox'
        },
        recordId: '',
        questionRecord: {},
        questionNumber:0,
        questionsToAsk:0,
        blnCorrect: false,
        items: [{
            xtype: 'panel',
            html: 'Question 0 of 0 - Correct',
            itemId: 'questonNumberText',
            maxWidth: '100%'
        }, {
            xtype: 'panel',
            html: 'Question Text Goes here....',
            itemId: 'questonText',
            maxWidth: '100%'
        }, {
            xtype: 'panel',
            html: Lang.Your_Answers_Were
        }, {
            xtype: 'spacer',
            height: 20,
            itemId: 'distractorStart'
        },
        // Distractors go here....
        {
            xtype: 'spacer'
        }]
    },

    refreshQuestionNumber: function(){
        var me = this,
            b = me.getBlnCorrect(),
            statusText;
        if(b){
            statusText = '<span style="color:green">'+Lang.Correct+'</span>';
        }
        else{
            statusText = '<span style="color:red">'+Lang.Incorrect+'</span>';
        }
        me.getComponent('questonNumberText').setHtml(Lang.Question_of.replace("{1}",me.getQuestionNumber()).replace("{2}",me.getQuestionsToAsk()).replace("{status}",statusText));
    },
    updateQuestionNumber: function(newValue, oldValue){
        this.refreshQuestionNumber();
    },
    updateQuestionsToAsk: function(newValue, oldValue){
        this.refreshQuestionNumber();
    },
    updateBlnCorrect: function(newValue, oldValue){
        this.refreshQuestionNumber();
    },

    updateQuestionRecord: function(newRecord, oldRecord) {
        var me = this;
        // Add question text
        me.getComponent('questonText').setHtml(newRecord.raw.questionText['#text']);
        me.setBlnCorrect(newRecord.data.blnCorrect);
    },
    
    findLetter: function(list, letter) {
        var ln = list.length,
            i;
        for (i = 0; i < ln; i++) {
            if (list[i].Short === letter) {
                return true;
            }
        }
        return false;
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
    }
});
