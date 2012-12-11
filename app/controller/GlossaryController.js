Ext.define('Player.controller.GlossaryController', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            glossaryBtn: '#glossaryBtn',
            glossary: '#glossaryPanel',
            term: '#glossaryPopupPanel',
            content: '#contentPanel'
        },

        control: {
            "#glossaryBtn": {
                tap: 'onGlossaryBtnTap'
            },
            "#closeGlossaryBtn": {
                tap: 'onCloseGlossaryBtnTap'
            },
            "#glossaryPanel": {
                leafitemtap: 'onGlossaryLeafItemTap'
            },
            "#closeTerm": {
                tap: 'onCloseTermTap'
            }
        }
    },

    onGlossaryBtnTap: function(button, e, options) {
        var me = this,
        content = me.getContent();

        Player.app.fireEvent('hideTools');

        if(content.getScreen() != 'glossary'){
            content.setScreen('glossary');
        }
        else{
            content.setScreen('main');
        }
    },

    onCloseGlossaryBtnTap: function(button, e, options) {
        var me = this,
        content = me.getContent();

        Player.app.fireEvent('hideTools');
        content.setScreen('main');

        me.getTerm().hide();
    },

    onGlossaryLeafItemTap: function(nestedlist, list, index, target, record, e, options) {
        var store = list.getStore(),
        record = store.getAt(index);

        this.discloseTerm(record.data.title, record.data.definition);
    },

    onCloseTermTap: function(button, e, options) {
        this.getTerm().hide();
    },

    discloseTerm: function(term, definition) {
        // Look Up Term
        var definitionText = '',
        letter = term.charAt(0).toUpperCase(),
        letterNode = Ext.getStore('GlossaryTreeStore').findRecord('title',letter),
        i, cn,
        ln=letterNode.childNodes.length,
        termL = term.toLowerCase(),
        tm = this.getTerm();

        if(!Ext.os.is.Phone){

        }

        if(definition){
            definitionText = definition;
        }
        else{
            for (i=0;i<ln;i++){
                cn = letterNode.childNodes[i];
                if(cn.data.title.toLowerCase() == termL){
                    definitionText = cn.data.definition;
                    term = cn.data.title;
                    break;
                }
            }
        }

        tm.setHtml(definitionText);
        tm.items.items[0].setTitle(term);


        try{
            MathJax.Hub.PreProcess(tm.element.dom);
            MathJax.Hub.Process(tm.element.dom);
        }catch(e){}

            tm.show();
    },

    onGlossaryLinkClick: function(term) {
        this.discloseTerm(term);
    },

    init: function() {

        this.getApplication().on([
        { event: 'glossaryLinkClick', fn: this.onGlossaryLinkClick, scope: this }
        ]);

    }

});