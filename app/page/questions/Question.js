Ext.define('Player.page.questions.Question', {
    extend: 'Ext.form.Panel',

    alias: ['widget.question'],

    requires: ['Player.page.questions.FeedBackPopup', 'Player.page.questions.Instructions'],


    config: {
        layout: {
            align: 'center',
            type: 'vbox'
        },
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        questionRecord: null,
        initprompt_Text: Lang.Select_an_Option,
        evalprompt_Text: Lang.Tap_CheckAnswer_Button,
        correctfeedback_Text: Lang.Yes_that_is_correct,
        incorrectfeedback_Text: Lang.No_that_is_incorrect,
        triesfeedback_Text: Lang.Incorrect_Try_Again,
        provideFeedback: true,
        triesAttempted: 0,
        isActiveItem: false,
        tries: 1,
        recordId: '',
        feedbackPopup: {
            xtype: 'widget.feedbackpopup'
        },
        instructions: {
            xtype: 'instructions'
        },
        pageData: {},
        //just incase you forget :)
        //alphabet:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    },


    applyInstructions: function(config) {
        return Ext.factory(config, 'Player.page.questions.Instructions', this.getInstructions());
    },

    updateInstructions: function(newInstructions, oldInstructions) {
        /*debugger;
        if (newInstructions) {
            var me = this;
            newInstructions.on('closeinstructions', me.hideInstructions, me);
            //I have to add to main so it will show up in the center no matter what scroll is
            Ext.getCmp('main').add(newInstructions);
            console.log("New me...");
        } else if (oldInstructions) {
            oldInstructions.destroy();
        }*/
    },
    onCheckAnswer: function(){
        
    },

    hideInstructions: function() {
        var inst = Ext.getCmp('main').getComponent('instructions');
        inst.setHidden(true);
    },
    showInstructions: function(instructionText, showCheckAnswer) {
        var me = this,
            inst = me.getInstructions();
        //var inst = Ext.getCmp('main').getComponent('instructions');
        inst.on('closeinstructions', me.hideInstructions, me);
        if (instructionText) {
            inst.setHtml(instructionText);
        }
        inst.setCheckAnswer(showCheckAnswer);
        Ext.getCmp('main').add(inst);
        inst.show();
    },


    applyPageData: function(config) {
        return config;
    },

    updateQuestionRecord: function(newRecord, oldRecord) {
        var me = this,
            newPageData = newRecord.raw;

        if (newPageData.overrideFeedback && newPageData.feedback) {
            if (newPageData.feedback.initPrompt) {
                me.setInitprompt_Text(newPageData.feedback.initPrompt['#text']);
            }
            if (newPageData.feedback.evalPrompt) {
                me.setEvalprompt_Text(newPageData.feedback.evalPrompt['#text']);
            }
            if (newPageData.feedback.correctFeedback) {
                me.setCorrectfeedback_Text(newPageData.feedback.correctFeedback['#text']);
            }
            if (newPageData.feedback.incorrectFeedback) {
                me.setIncorrectfeedback_Text(newPageData.feedback.incorrectFeedback['#text']);
            }
            if (newPageData.feedback.triesFeedback) {
                me.setTriesfeedback_Text(newPageData.feedback.triesFeedback['#text']);
            }
            if (newPageData.feedback.tries) {
                me.setTries(newPageData.feedback.tries);
            }
            if (typeof newPageData.feedback.provide == 'boolean') {
                me.setProvideFeedback(newPageData.feedback.provide);
            }
        }
    },

    showFeedbackPopup: function(title, feedback) {
        var me = this,
            feedbackObj = {};
        if (!me.getProvideFeedback() || !me.getIsActiveItem()) {
            return;
        }
        if (title) {
            feedbackObj.title = title;
            me.oldTitle = title;
        } else {
            feedbackObj.title = me.oldTitle;
        }
        if (feedback) {
            feedbackObj.feedback = feedback;
            me.oldFeedback = feedback;
        } else {
            feedbackObj.feedback = me.oldFeedback;
        }
        me.feedbackPopup = Ext.create('Player.page.questions.FeedBackPopup', feedbackObj);
        me.feedbackPopup.on('close', me.hideFeedbackPopup, me);

        //I have to add to main so it will show up in the center no matter what scroll is
        Ext.getCmp('main').add(me.feedbackPopup);

        me.feedbackPopup.show();
    },
    hideFeedbackPopup: function() {
        var me = this;
        if(me.feedbackPopup){
            me.feedbackPopup.hide();    
        }
        me.remove(me.feedbackPopup);
    },
    initialize: function() {
        this.callParent(arguments);
    },
    start: function() {
        st = Ext.getStore("ScoTreeStore");
                var pageNode = null;
                for(var i=0,ln = st.data.all.length;i<ln;i++){
                pageNode = st.data.all[i];
                }
				if(Player.settings.get('activateTimer')){
				Player.app.fireEvent('startCountDown',pageNode);
				}
    },
    cleanup: function(){},
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


})
