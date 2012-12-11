Ext.define('Player.page.questions.review.MCH', {
    extend: 'Player.page.questions.review.Review',

    alias: ['widget.reviewMCH'],

    config: {
        layout: {
            type: 'vbox'
        },
        questionRecord: {},
        questionNumber: 0,
        questionsToAsk: 0,
        blnCorrect: false,
        items: [{
            xtype: 'panel',
            html: 'Question 0 of 0 - Correct',
            itemId: 'questonNumberText'
        }, {
            xtype: 'panel',
            html: 'Question Text Goes here....',
            styleHtmlContent: true,
            padding: '0 0 4 0',
            cls: 'questonText',
            itemId: 'questonText'
        }, {
            xtype: 'panel',
            html: Lang.Your_Answers_Were
        }, {
            xtype: 'spacer',
            height: 10,
            itemId: 'distractorStart'
        },
        // Distractors go here....
        {
            xtype: 'spacer'
        }]
    },


    updateQuestionRecord: function(newRecord, oldRecord) {
        var me = this,
            distractorStartIndex = me.indexOf(me.getComponent('distractorStart')) + 1,
            distractorsList, correctResponse = [],
            newPageData = newRecord.raw,
            correctResponses = newRecord.data.correctResponse,
            responses = newRecord.data.response,
            response, alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        me.callParent(arguments);

        distractorsList = newPageData.distractors.distractor;

        for (var i = 0, ln = distractorsList.length; i < ln; i++) {
            var distractorData = distractorsList[i],
                letter;
            if (!distractorData || !distractorData['#text']) {
                continue;
            }
            letter = alphabet.shift();

            if (me.findLetter(correctResponses, letter) && me.findLetter(responses, letter)) {
                response = '<div style="width:16px; color: green; float: left;">'+Lang.C+'</div>';
            } else if (me.findLetter(responses, letter)) {
                response = '<div style="width:16px; color: red; float: left;">'+Lang.X+'</div>';
            } else {
                response = '<div style="width:16px; float: left;">'+Lang.N+'</div>';
            }

            var distractorCheckbox = Ext.create('Ext.Panel', {
                html: response + ' ' + letter + '. ' + distractorData['#text'],
                styleHtmlContent: false
            });

            distractorCheckbox = me.insert(distractorStartIndex++, distractorCheckbox);
        }

        if(!newRecord.data.blnCorrect){
            var correctString = '';
            for (var i = 0, ln = correctResponses.length; i < ln; i++) {
                correctString += correctResponses[i].Short+",";
            }
            panel = Ext.create('Ext.Panel', {
                html: Lang.Correct_Answer+correctString.slice(0,-1),
                padding: '6 0 0 0'
            });
            me.add(panel);
        }
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
    }
});
