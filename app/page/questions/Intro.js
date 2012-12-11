Ext.define('Player.page.questions.Intro', {
    extend: 'Player.page.questions.Question',

    alias: ['widget.intro'],

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
        introText: '',
        introHead: '',
        items: [{
                xtype: 'image',
                src: 'resources/img/quizIcon-03.jpg',
                cls: 'quiz-icon',
                width: 176,
                height: 163
            },
           {
                itemId: 'quiztitle',
                cls: 'quiz-intro-heading',
                styleHtmlContent: true,
                html: ''
           },
           {
                itemId: 'quizintro',
                cls: 'quiz-intro-text',
                styleHtmlContent: true,
                html: ''
            }]
    },
    updateIntroText: function(value){
        this.getComponent('quizintro').setHtml(value);
    },
    updateIntroHead: function(value){
        this.getComponent('quiztitle').setHtml(value);  
    },
    initialize: function() {
        this.callParent(arguments);
    }
});
