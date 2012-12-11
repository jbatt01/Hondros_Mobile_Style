Ext.define('Player.page.questions.Results', {
    extend: 'Player.page.questions.Question',

    alias: ['widget.results'],

    requires: ['Player.page.questions.EmailPopup'],

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
        statusFailText: Lang.Sorry,
        feedbackFailText: Lang.You_did_not_pass,
        statusSuccessText: Lang.Pass,
        feedbackSuccessText: Lang.Congrats_Pass,
        results: {},
        quizData: {},
        emailPopup: {
            xtype: 'widget.emailpopup'
        },
        items: [{
            styleHtmlContent: true,
            width: 300,
            html: '<img src="resources/img/QuizResultsIcon-02.png" width="100" height="100" /> <div class="quizresulttitle">'+Lang.Quiz_Results+'<div>'
        }, {
            itemId: 'quizResults',
            styleHtmlContent: true,
            tpl: ['<table width="200" border="0" cellpadding="12"><tr>', '<td align="right">'+Lang.Total_Correct+'</td>', '<td>{correct}</td>', '</tr><tr>', '<td align="right">'+Lang.Total_Incorrect+'</td>', '<td>{incorrect}</td>', '</tr><tr>', '<td align="right">'+Lang.Score+'</td>', '<td>{points}</td>', '</tr><tr>', '<td align="right">'+Lang.Possible_Score+'</td>', '<td>{pointsPossible}</td>', '</tr><tr>', '<td align="right">'+Lang.Percentage+'</td>', '<td>{intScore}%</td>', '</tr>', '</table>']
        }, {
            itemId: 'quizfeedback',
            styleHtmlContent: true,
            html: ''
        }, {
            xtype: 'button',
            itemId: 'reviewBtn',
            autoEvent: 'review',
            text: Lang.Review,
            ui: 'checkanswer',
            hidden: true
        }, {
            itemId: 'printMessage',
            styleHtmlContent: true,
            html: ''
        }, {
            xtype: 'button',
            itemId: 'emailBtn',
            autoEvent: 'email',
            text: Lang.Email_Results,
            ui: 'checkanswer',
            hidden: true
        }, {
            xtype: 'button',
            itemId: 'printBtn',
            autoEvent: 'print',
            text: Lang.Print,
            ui: 'checkanswer',
            hidden: true
        }]
    },
    applyResults: function(config) {
        this.getComponent('quizResults').setData(config);
        return config;
    },
    updateResults: function(config) {
        this.getComponent('quizResults').setData(config);
    },

    updateQuizData: function(value) {
        var me = this,
            emailResults = value.email_results,
            printResults = value.print_results,
            incReview = value.incReview;

        me.getComponent('emailBtn').setHidden(((!value.email_results) || (typeof value.email_results == 'undefined')));
        me.getComponent('printBtn').setHidden(((!value.print_results) || (typeof value.print_results == 'undefined')));
        me.getComponent('reviewBtn').setHidden(((!value.incReview) || (typeof value.incReview == 'undefined')));

        if (value.printMessage) {
            me.getComponent('printMessage').setHtml(value.printMessage['#text']);
        }

    },


    onEmail: function() {
        var me = this,
            qData = me.getQuizData();
        if (qData.useServer) {
            me.showEmailPopup();
        } else {
            me.sendEmail(false, false);
        }
        // show popup if use server
        // or mailto:
    },
    showEmailPopup: function() {
        var me = this,
            emailObj = {};

        me.emailPopup = Ext.create('Player.page.questions.EmailPopup', emailObj);
        me.emailPopup.on('close', me.hideEmailPopup, me);
        me.emailPopup.on('submit', me.sendEmail, me);

        //I have to add to main so it will show up in the center no matter what scroll is
        Ext.getCmp('main').add(me.emailPopup);

        me.emailPopup.show();
    },
    hideEmailPopup: function() {
        var me = this;
        me.emailPopup.hide();
        //Ext.getCmp('main').remove(me.emailPopup, true);
    },
    sendEmail: function(e, formData) {
        var me = this,
            cr = "%0D",
            lmsName = '',
            nowDate = new Date(),
            compDate = (nowDate.getMonth() + 1) + "/" + nowDate.getDate() + "/" + nowDate.getFullYear(),
            bodyText = '',
            quizData = me.getQuizData(),
            results = me.getResults(),
            idag, riktig, ikkerett, fin, serverURL = 'http://www.rapidintake.net/send_email.asp',
            winurl, quizTitle = 'Undefined',
            print = formData.print;

        if (!quizData.useServer) {
            cr = "\r";
            bodyText = Lang.Make_Sure_Send;
            for (var i = 1; i < 5; i++) {

                bodyText += cr;
            }
        }

        if (print) {
            cr = "<br/>";
        }

        bodyText += (Lang.Coure_Results_Email.replace("{title}",Player.settings.get('title')) + cr + cr);

        if (quizData.incQuizTitle) {
            try {
                quizTitle = me.parent.getPageData().title;
            } catch (e) {
                quizTitle = 'Undefined';
            }
            bodyText += (Lang.Email_Quiz + quizTitle + cr + cr);
        }

        if (quizData.LMS_name) {
            try {
                lmsName = SCORM.GetStudentName();
            } catch (e) {
                lmsName = '';
            }
            bodyText += Lang.Email_User + lmsName + cr + cr;
        }

        if (quizData.useServer && !print) {
            bodyText += Lang.Email_Learner + formData.name + cr + cr;

            idag = "4/5/20106-7-0910/10/2011" + compDate + "3/4/0911/12/20091-1-12";
            riktig = "1468790234" + results.correct + "0223859410";
            ikkerett = "938547012312" + results.incorrect + "7894728301";
            fin = "01293847563459" + results.intScore + "6758102938";

            if (quizData.serverURL) {
                serverURL = quizData.serverURL;
            }
            winurl = serverURL + "?From=" + formData.name + "&To=" + quizData.sendToEmail + "&Subject=" + quizData.emailSubject + "&Body=" + bodyText + "&idag=" + idag + "&riktig=" + riktig + "&ikkerett=" + ikkerett + "&fin=" + fin;
        } else if (print) {
            bodyText += Lang.Email_DateCompleted + compDate + cr + cr + Lang.Email_TotalCorrect + results.correct + cr + Lang.Email_TotalIncorrect + results.incorrect + cr + Lang.Email_Percent + results.intScore + cr + cr;
            winurl = '';
        } else {
            bodyText += Lang.Email_DateCompleted + compDate + cr + cr + Lang.Email_TotalCorrect + results.correct + cr + Lang.Email_TotalIncorrect + results.incorrect + cr + Lang.Email_Percent + results.intScore + cr + cr;
            winurl = 'mailto:' + quizData.sendToEmail + '?subject=' + quizData.emailSubject + '&body=' + escape(bodyText);
        }
        win = window.open(winurl, Lang.Email_Window);

        if (print) {
            win.document.write('<html><head><title>'+Lang.Email_Window+'</title></head><body ><img src="resources/img/QuizResultsIcon-02.png" width="100" height="100" />' + bodyText + '</body></html>');
            win.print();
        }

        if (win && win.open && !win.closed) {
            me.hideEmailPopup();
        }
    },
    onPrint: function() {
        this.sendEmail(null, {
            print: true
        });
    },

    onReview: function() {
        this.fireEvent('review');
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
        me.getComponent('reviewBtn').on('review', me.onReview, me);
        me.getComponent('emailBtn').on('email', me.onEmail, me);
        me.getComponent('printBtn').on('print', me.onPrint, me);
    }
});
