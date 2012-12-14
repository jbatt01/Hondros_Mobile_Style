Ext.define('Player.page.Definitions', {
    extend: 'Player.page.Page',

    alias: ['widget.Definitions'],
    requires: ['Player.page.Definitions.Review', 'Player.page.Definitions.Practice'],

    config: {
        layout: 'card',
        scrollable: false,
        recordId: '',
        pageData: {
            title: 'Page Title 2',
            pText: '>>>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'
        },
        items: [{
            xtype: 'defreview',
            itemId: 'reviewCard'
        }, {
            xtype: 'practice',
            itemId: 'practiceCard'
        }]
    },

    applyPageData: function(config) {
        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this
            ;
            me.getComponent('reviewCard').setPageData(newPageData);
            me.getComponent('practiceCard').setPageData(newPageData);
    },
    imageTapHandler: function() {
        //imagePopup.show();
    },

    start: function() {
        this.callParent(arguments);


    },
    toggleCard: function(){
        var me = this;
        if(me.currentCard == 'review'){
            me.currentCard = 'practice';
            me.setActiveItem(1);
        }
        else{
            me.currentCard = 'review';
            me.setActiveItem(0);
        }
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);

        me.callParent(arguments);
        me.currentCard = 'review';

        me.getComponent('reviewCard').query('#gotoPracticeBtn')[0].on('tap', me.toggleCard, me);
        me.getComponent('practiceCard').query('#gotoReviewBtn')[0].on('tap', me.toggleCard, me);
    }
});