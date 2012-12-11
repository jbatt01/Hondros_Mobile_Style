Ext.define('Player.page.Quiz', {
    extend: 'Ext.carousel.Carousel',

    requires: ['Player.page.questions.MCH', 'Player.page.questions.MC', 'Player.page.questions.TF', 'Player.page.questions.Results', 'Player.page.questions.Review','Player.page.questions.Intro'],

    config: {
        layout: 'vbox',
        indicator: false,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
		refs: {
            timeBar: '#timeBar'
        },
        pType: 'Quiz',
        quizRecord: null,
        quizMode: 'test',
        recordId: '',
        locked: 'none',
        pageData: {
            title: 'Page Title 2',
            pText: ''
        },
        listeners: [{
            fn: 'onCarouselActiveItemChange',
            event: 'activeitemchange'
        }]
    },

    onCarouselActiveItemChange: function(container, value, oldValue, options) {
        var me = this,
            mp = Ext.getCmp("mainPages"),
            mpActiveIindex = mp.getActiveIndex(),
            quizRecord = me.getQuizRecord();
        if (!me.isActive) {
            return;
        }
        var i = me.getActiveIndex();
        
        if (i === 0) {
            // First Page
            Player.app.fireEvent('lockPages', 'right');
            if(mpActiveIindex > 0){
                Player.app.fireEvent('lockButtonDirection', 'none');
            }
            else{
                Player.app.fireEvent('lockButtonDirection', 'left');
            }
            
        } else if (i + 1 === me.innerItems.length) {
            if(value.xtype == 'review'){
                // REVIEW page
                Player.app.fireEvent('lockPages', 'left');
                if(mpActiveIindex == mp.items.length-1){

                    Player.app.fireEvent('lockButtonDirection', 'right');
                }
                else{
                    me.setLocked('none');
                    Player.app.fireEvent('lockButtonDirection', 'none');
                }
            }
            else{
                Player.app.fireEvent('lockPages', 'left');
                // Last page
                if(mpActiveIindex == mp.items.length-1){
                    if(me.getQuizMode() == 'test'){
                        Player.app.fireEvent('lockButtonDirection', 'both');
                    }
                    else{
                        Player.app.fireEvent('lockButtonDirection', 'right');    
                    }
                }
                else{
                    if(me.getQuizMode() == 'test'){
                        Player.app.fireEvent('lockButtonDirection', 'left'); 
                    }
                    else{
                        Player.app.fireEvent('lockButtonDirection', 'none');    
                    }
                    
                }    
            }
        } else {
            Player.app.fireEvent('lockPages', 'both');

            if(me.getQuizMode() == 'test'){
                me.setLocked('left');
                Player.app.fireEvent('lockButtonDirection', 'left');
            }
            else{
                Player.app.fireEvent('lockButtonDirection', 'none');
            }
            // a Middle page
        }
        oldValue.cleanup();

        value.start();

        if(quizRecord.raw.number_questions){
            Player.app.fireEvent('updatePageNumber', value.config.adjustedPageNumber);
        }
    },

    applyPageData: function(config) {
        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this,
            qs = Ext.getStore("Quizes"),
            quizRecord = qs.findRecord('id', newPageData.id),
            quizData = quizRecord.raw,
            questionsToAsk, questionsList, i, questionData, questionRecord, panel, s, data, errorStr,
            startPageNumber = newPageData.pageNum+1-quizData.numquestions,
            introPageOffset = 0;

        me.setQuizRecord(quizRecord);
        // Add INTRO
        if (quizData.includeIntro && quizData.introText) {
            startPageNumber -= 1;
            introPageOffset = 1;
            panel = Ext.create('Player.page.questions.Intro', {
                introHead: quizData.introText.heading,
                introText: quizData.introText['#text'],
                adjustedPageNumber: startPageNumber
            });
            me.add(panel);
        }

        // Add QUESTIONS
        if (quizData.randomize) {
            s = [];
            // Randomize the array
            while (quizData.question.length) {
                s.push(quizData.question.splice(Math.random() * quizData.question.length, 1)[0]);
            }
            while (s.length) {
                quizData.question.push(s.pop());
            }
        }

        questionsList = quizData.question;

        if (quizData.useSupset || quizData.useSubset) {
            questionsToAsk = quizData.numquestions;
        } else {
            questionsToAsk = questionsList.length;
        }

        me.setQuizMode(quizData.quizmode);

        /// generate global feedback
        feedbackObject = {};
        if(quizData.feedback){
            if (quizData.feedback.initPrompt) {
                feedbackObject.initprompt_Text = quizData.feedback.initPrompt['#text'];
            }
            if (quizData.feedback.evalPrompt) {
                feedbackObject.evalprompt_Text = quizData.feedback.evalPrompt['#text'];
            }
            if (quizData.feedback.correctFeedback) {
                feedbackObject.correctfeedback_Text = quizData.feedback.correctFeedback['#text'];
            }
            if (quizData.feedback.incorrectFeedback) {
                feedbackObject.incorrectfeedback_Text = quizData.feedback.incorrectFeedback['#text'];
            }
            if (quizData.feedback.triesFeedback) {
                feedbackObject.triesfeedback_Text = quizData.feedback.triesFeedback['#text'];
            }
            if (quizData.feedback.tries) {
                feedbackObject.tries = quizData.feedback.tries;
            }
            if (typeof quizData.feedback.provide == 'boolean') {
                feedbackObject.provideFeedback = quizData.feedback.provide;
            }
        }
        

        for (i = 0, ln = questionsToAsk; i < ln; i++) {
            questionData = questionsList[i];
            questionRecord = quizRecord.questionsStore.findRecord('id', questionData.id);
            
            try {
                panel = Ext.create('Player.page.questions.' + questionData.qtype, Ext.Object.merge({
                    questionRecord: questionRecord,
                    listeners: {
                        questoncomplete: me.onQuestionComplete,
                        scope: this
                    },
                    adjustedPageNumber: startPageNumber+i+introPageOffset
                }, feedbackObject));
                me.add(panel);
            } catch (e) {
                data = '';
                try {
                    data = JSON.stringify(questionData);
                } catch (ee) {}
                errorStr = 'Error:: Could not creating quiz question. Type: ' + questionData.qtype + ' Error:' + e + ' Data:' + data;
                //throw errorStr;
            }
        }

        // Add RESULTS
        if (quizData.showresults) {
            panel = Ext.create('Player.page.questions.Results', {
                itemId: 'quizResults',
                results: {},
                listeners: {
                    review: me.onReview,
                    scope: this
                },
                quizData: quizData,
                adjustedPageNumber:newPageData.pageNum+1
            });
            me.add(panel);
        }
        //
    },
    onQuestionComplete: function() {
        var me = this,
            quizRecord = me.getQuizRecord(),
            i, ln = me.items.length,
            allComplete = true,
            tempQuestion, tempQuestionRecord,
            percentage = 0,
            pass = false;

        /*if(me.getActiveItem().xtype == 'results' && me.getActiveIndex() == me.getItems().length-1){
        // TODO: Check to see if on last page otherwise return;
        }*/


        for (i = 0; i < ln; i++) {
            tempQuestion = me.items.items[i];
            tempQuestionRecord = tempQuestion.getQuestionRecord();
            if (tempQuestionRecord && !tempQuestionRecord.get('complete')) {
                allComplete = false;
                break;
            }
        }
        if (allComplete) {
            me.recordedScore = true;
            me.clearResults();
            // Record Each Question
            for (i = 0; i < ln; i++) {
                tempQuestion = me.items.items[i];
                tempQuestionRecord = tempQuestion.getQuestionRecord();
                if (tempQuestionRecord) {
                    me.updateResults(tempQuestionRecord);
                }
            }
            
            // Calculate Pass/Fail, percentage
            percentage = Math.round((quizRecord.get('points') / quizRecord.get('pointsPossible')) * 100);
            quizRecord.set('intScore', percentage);
            
            pass = (percentage >= quizRecord.get('passingScore'));
            quizRecord.set('passed', pass);

            if(quizRecord.raw.showresults){
			//Changed Code
              if(Player.settings.get('activateTimer'))
		    {
		    Player.settings.set('activateTimer','false');
			timeBarId = Ext.getCmp('ext-timerbar-1');
		    timeBarId.hide();
		    }
                me.getComponent('quizResults').setResults(quizRecord.data); 	 
            }
			//Changed Code
            

            // SCORM Recording
            if(quizRecord.get('reportScore')){
                try{
                    var success = SCORM.SetScore(percentage, quizRecord.get('intMaxScore'), quizRecord.get('intMinScore'));
                }catch(e){}
            }
            
            switch(quizRecord.get('recordStatus')){
                case 'none':
                    quizRecord.set('complete', true);
                    break;
                case 'passFail':
                    if(pass){
                        try{
                            var success = SCORM.SetPassed();
                        }catch(e){}
                        quizRecord.set('complete', true);
                    }else{
                        try{
                            var success = SCORM.SetFailed();
                        }catch(e){}
                        quizRecord.set('complete', true);
                    }
                    break;
                case 'completed':
                    try{
                        var success = SCORM.SetReachedEnd();
                    }catch(e){}
                    quizRecord.set('complete', true);
                    break;
                case 'passIncomplete':
                    if(pass){
                        try{
                            var success = SCORM.SetPassed();
                        }catch(e){}
                        quizRecord.set('complete', true);
                    }else{
                        try{
                            var success = SCORM.ResetStatus();
                        }catch(e){}
                        quizRecord.set('complete', false);
                    }
                    break;
                case 'apiPassFail':
                    if(pass){
                        quizRecord.set('complete', true);
                    }else{
                        quizRecord.set('complete', false);
                    }
                    break;
                case 'apiCompleted':
                    quizRecord.set('complete', true);
                    break;
                default:
                    quizRecord.set('complete', true);
                    break;
                
            }

            // Mark page complere
            if(quizRecord.get('complete')){
                Player.app.fireEvent('pageComplete');
            }
        }
    },
    updateResults: function(questionRecord) {
        var me = this,
            quizRecord = me.getQuizRecord(),
            quizData = quizRecord.data,
            questionData = questionRecord.data;

        if(questionData.blnCorrect) {
            quizRecord.set('correct', ++quizData.correct);
            quizRecord.set('points', quizData.points + questionData.intWeighting);
        } else {
            quizRecord.set('incorrect', ++quizData.incorrect);
        }
        quizRecord.set('pointsPossible', quizData.pointsPossible + questionData.intWeighting);

        try {
            console.log("DATA:" + JSON.stringify(questionData));
        } catch(e) {}

        if(questionData.tracking) // && using Scorm?
        {
            switch(questionData.trackingType) {
            case 'MC':
            case 'MCH':
                try {
                    var scormResponses = [],
                        scormCorrectResponses = [],
                        tempResponse;
                    for(var i = 0, ln = questionData.response.length; i < ln; i++) {
                        tempResponse = questionData.response[i];
                        scormResponses.push(SCORM.CreateResponseIdentifier(tempResponse.Short, tempResponse.Long));
                    };
                    for(var i = 0, ln = questionData.correctResponse.length; i < ln; i++) {
                        tempResponse = questionData.correctResponse[i];
                        scormCorrectResponses.push(SCORM.CreateResponseIdentifier(tempResponse.Short, tempResponse.Long));
                    };
                    var success = SCORM.RecordMultipleChoiceInteraction(questionData.strID, scormResponses, questionData.blnCorrect, scormCorrectResponses, questionData.strDescription.replace(/(<([^>]+)>)/ig, ""), questionData.intWeighting, questionData.intLatency, questionData.strLearningObjectiveID);
                } catch(e) {
                    console.log("MCH Error:" + e);
                }
                break;
            case 'TF':
                try {
                    var success = SCORM.RecordTrueFalseInteraction(questionData.strID, questionData.response, questionData.blnCorrect, questionData.correctResponse, questionData.strDescription.replace(/(<([^>]+)>)/ig, ""), questionData.intWeighting, questionData.intLatency, questionData.strLearningObjectiveID);
                } catch(e) {}
                break;
            default:
                throw("Cannot Track type:" + questionData.trackingType);
                break;
            }
        }
    },
    clearResults: function() {
        var me = this,
            pData = me.getPageData(),
            quizRecord = me.getQuizRecord();

        quizRecord.set('correct', 0);
        quizRecord.set('points', 0);
        quizRecord.set('incorrect', 0);
        quizRecord.set('pointsPossible', 0);
        quizRecord.set('intScore', 0);
    },
    onReview: function() {
        var me = this,
            pData = me.getPageData(),
            quizRecord = me.getQuizRecord(),
            panel;
            
        me.remove(me.getComponent('quizReview'))

        panel = Ext.create('Player.page.questions.Review', {
            itemId: 'quizReview',
            results: {},
            listeners: {
                retake: me.onRetake,
                scope: me
            },
            adjustedPageNumber: pData.pageNum+1,
            quizRecord: quizRecord
        });
        me.add(panel);

        me.next();
    },
    onRetake: function() {
        var me = this;
        me.setActiveItem(0);
        me.remove(me.getComponent('quizReview'));
    },

    initialize: function() {
        var me = this;
        me.setAnimation({
            duration: 500,
            easing: {
                type: 'ease-in-out'
            }
        });

        me.setActiveItem(0);
        me.callParent(arguments);
        me.clearResults();
    },
    start: function() {
        var me = this,
            pData = me.getPageData(),
            quizRecord = me.getQuizRecord();

        me.isActive = true;
        if (me.innerItems.length > 1) {
            Player.app.fireEvent('lockPages', 'right');
        }
        me.getActiveItem().start();

        if(me.getQuizMode() == 'test'){
            me.setLocked('left');
            Player.app.fireEvent('lockButtonDirection', 'left');
        }

        // Adjust page number if counting questions
        if(quizRecord.raw.number_questions){
            Player.app.fireEvent('updatePageNumber', me.getActiveItem().config.adjustedPageNumber);
        }
        me.recordedScore = false;
    },
    close: function() {
        try{
            Ext.getCmp('main').getComponent('instructions').setHidden(true);
        }catch(e){console.log("e:"+e);}
        this.getActiveItem().cleanup();
        this.isActive = false;
        Player.app.fireEvent('lockPages', 'none');
        
        
    },
    setRendered: function(rendered) {
        var me = this,
            wasRendered = me.rendered;

        if (rendered !== wasRendered) {
            me.rendered = rendered;

            var items = me.items.items,
                carouselItems = me.carouselItems,
                i, ln, item;

            for (i = 0,ln = items.length; i < ln; i++) {
                item = items[i];

                if (!item.isInnerItem()) {
                    item.setRendered(rendered);
                }
            }
            // Why is carouselItems null??? Maybe I should return false?
            if(!carouselItems){
                return true;
            }
            for (i = 0,ln = carouselItems.length; i < ln; i++) {
                carouselItems[i].setRendered(rendered);
            }

            return true;
        }

        return false;
    },
    onDragStart: function(e) {
        var me = this,
            lockDir = me.getLocked();

        if(e.deltaX>0 && (lockDir == 'left' || lockDir == 'both')){
            return;
        }
        else if(e.deltaX<0 && (lockDir == 'right' || lockDir == 'both')){
            return;
        }

        me.callParent(arguments);
    },

    onDrag: function(e) {
        var me = this,
            lockDir = me.getLocked();

        if(e.deltaX>0 && (lockDir == 'left' || lockDir == 'both')){
            return;
        }
        else if(e.deltaX<0 && (lockDir == 'right' || lockDir == 'both')){
            return;
        }

        me.callParent(arguments);
    },

    onDragEnd: function(e) {
        var me = this,
            lockDir = me.getLocked();

        if(e.deltaX>0 && (lockDir == 'left' || lockDir == 'both')){
            return;
        }
        else if(e.deltaX<0 && (lockDir == 'right' || lockDir == 'both')){
            return;
        }

        me.callParent(arguments);
    }



});
