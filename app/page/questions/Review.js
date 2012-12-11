Ext.define('Player.page.questions.Review', {
    extend: 'Ext.form.Panel',

    alias: ['widget.review'],

    requires: ['Player.page.questions.review.MCH', 'Player.page.questions.review.MC', 'Player.page.questions.review.TF'],

    config: {
        layout: {
            type: 'vbox'
        },
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        quizRecord: {},
        items: [{
            xtype: 'panel',
            docked: 'top',
            itemId: 'reviewHeader',
            html: 'Test Results'
        },

        {
            xtype: 'panel',
            docked: 'bottom',
            padding: '5 5 5 5',
            layout: {
                type: 'hbox'
            },
            items: [{
                xtype: 'spacer'
            }, {
                xtype: 'button',
                text: Lang.Retake_Test,
                itemId: 'retakeBtn',
                autoEvent: 'retake',

                hidden: false
            }]
        }]
    },

    updateQuizRecord: function(newQuizRecord) {
        if(!newQuizRecord.raw){
            return;
        }
        var me = this,
            quizData = newQuizRecord.raw,
            questionsList = quizData.question,
            questionData, questionRecord, panel, data, errorStr;


        if (quizData.useSupset || quizData.useSubset) {
            questionsToAsk = quizData.numquestions;
        } else {
            questionsToAsk = questionsList.length;
        }

        for (i = 0, ln = questionsToAsk; i < ln; i++) {
            questionData = questionsList[i];
            questionRecord = newQuizRecord.questionsStore.findRecord('id', questionData.id);

            try {
                panel = Ext.create('Player.page.questions.review.' + questionData.qtype, {
                    questionRecord: questionRecord,
                    questionsToAsk: questionsToAsk,
                    questionNumber: i+1
                });
                me.add(panel);

                //Add hr
                panel = Ext.create('Ext.Component', {
                    html: '<hr>',
                    padding: '6 0 6 0'
                });
                me.add(panel);

            } catch (e) {
                debugger;
                data = '';
                try {
                    data = JSON.stringify(questionData);
                } catch (ee) {}
                errorStr = 'Error:: Could not creating review question. Type: ' + questionData.qtype + ' Error:' + e + ' Data:' + data;
                //throw errorStr;
            }
        }
        me.query('#retakeBtn')[0].setHidden(((!quizData.incRetakeButton) || (typeof quizData.incRetakeButton == 'undefined')));
        // Update Header
        me.getComponent('reviewHeader').setHtml('<span>'+Lang.Test_Results+'</span>' + '<span>'+Lang.Review_Score.replace("{score}",newQuizRecord.data.intScore)+'</span> <span>' + Lang.Correct_of.replace("{1}",newQuizRecord.data.correct).replace("{2}", questionsToAsk) + '</span>');

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },
    start: function() {
        this.resizeScroller();
    },
    cleanup: function() {

    },
    getQuestionRecord: function() {
        return false
    },
    onRetake: function() {
        this.fireEvent('retake');
    },
    initialize: function() {
        var me = this;
        me.callParent(arguments);
        me.query('#retakeBtn')[0].on('retake', me.onRetake, me);
    },
    resizeScroller: function(){
        var me = this,
            scb = me.getScrollable(),
            imageSize = scb.getScroller().getSize(),
            containerSize = scb.getScroller().getContainerSize(),
            ind = scb.getIndicators();

        if(imageSize.x > containerSize.x){
            //ind.x.show();
        }
        if(imageSize.y > containerSize.y){
            ind.y.show();
        }
    }
});
