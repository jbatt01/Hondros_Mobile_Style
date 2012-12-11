Ext.define('Player.page.custom.TextImageTextImage', {
    extend: 'Player.page.Page',

    alias: ['widget.TextImageTextImage'],

    config: {
        layout: 'vbox',
        styleHtmlContent: true,
        scrollable: {
            direction: 'vertical',
            directionLock: false
        },
        recordId: '',
        items: [{
            xtype: 'panel',
            html: 'Page Title',
            cls: 'page-title',
            itemId: 'pageTitle'
        }, {
            xtype: 'panel',
            html: 'text1',
            cls: 'page-content',
            itemId: 'pageText1'
        }, {
            xtype: 'image',
            src: 'resources/img/quizIcon-03.jpg',
            cls: 'page-image1',
            flex: 1,
            itemId: 'pageImage1',
            listeners: {
                tap: {
                    fn: function() {
                        alert("I will say this only once every 2 seconds");
                    }
                }
            }
        }, {
            xtype: 'panel',
            html: 'text1',
            cls: 'page-content',
            itemId: 'pageText2'
        }, {
            xtype: 'image',
            src: 'resources/img/quizIcon-03.jpg',
            cls: 'page-image2',
            flex: 1,
            
            itemId: 'pageImage2'
        }],
        pageData: {}
    },

    applyPageData: function(config) {
        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this,
            useAltContent = true;

        if (newPageData.title) {
            me.getComponent('pageTitle').setHtml(newPageData.title);
        }
        //*/
        if (newPageData.text1) {
            me.getComponent('pageText1').setHtml(newPageData.text1['#text']);
        }

        if (newPageData.text2) {
            me.getComponent('pageText2').setHtml(newPageData.text2['#text']);
        }
        //*/

        //*/
        if (newPageData.image1) {
            me.getComponent('pageImage1').setSrc(newPageData.image1.path);
        }

        if (newPageData.image2) {
            me.getComponent('pageImage2').setSrc(newPageData.image2.path);
        }
        //*/


        // Create Note
        /*/
        if (newPageData.note) {
            var textNote = Ext.create('Player.view.Note', {
                noteText: newPageData.note['#text'],
                nType: newPageData.nType
            });
            me.add(textNote);
        }
        //*/


        try {
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        } catch (e) {}
    },

    initialize: function() {
        this.callParent(arguments);
    },
    start: function() {
        this.callParent(arguments);
        Player.app.fireEvent('pageComplete');
        //alert(this.element.dom.clientWidth+" x "+this.element.dom.clientHeight);
    }
});