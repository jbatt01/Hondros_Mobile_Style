Ext.define('Player.page.questions.EmailPopup', {
    extend: 'Ext.form.Panel',
    alias: 'widget.emailpopup',

    config: {
        centered: true,
        height: 128,
        hidden: true,
        itemId: 'feedbackPopup',
        width: 300,
        height: 330,
        name: 'emailForm',
        hideAnimation: 'popOut',
        showAnimation: 'popIn',
        layout: {
            align: 'center',
            type: 'vbox'
        },
        title: '',
        feedback: '',
        modal: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        items: [{
            xtype: 'titlebar',
            docked: 'top',
            itemId: 'titlebar',
            title: Lang.Enter_Name,
            items: [{
                xtype: 'button',
                itemId: 'closeFeedback',
                autoEvent: 'closefeedback',
                align: 'right',
                ui: 'round',
                iconCls: 'delete',
                iconMask: true
            }]
        }, {
            xtype: 'label',
            html: Lang.Email_Directions
        }, {
            xtype: 'textfield',
            name: 'name',
            itemId: 'nameInput',
            required: true,
            labelCls: 'email-label',
            label: Lang.Name
        }, {
            xtype: 'emailfield',
            name: 'email',
            itemId: 'emailInput',
            required: true,
            labelCls: 'email-label',
            label: Lang.Email
        }, {
            xtype: 'button',
            itemId: 'okbtn',
            width: 60,
            text: Lang.OK
        }]
    },
    initialize: function() {
        var me = this;
        me.callParent(arguments);
        me.query('#closeFeedback')[0].on('tap', me.onClose, me);
        me.query('#okbtn')[0].on('tap', me.onSubmit, me);
    },
    onSubmit: function() {
        var me = this,
            values = me.getValues(),
            nameInput = me.getComponent('nameInput'),
            emailInput = me.getComponent('emailInput'),
            formvalid = true;

        nameInput.setInputCls('');
        emailInput.setInputCls('');

        if( !(values.email && Ext.data.validations.emailRe.test(values.email)) ) {
            emailInput.setInputCls('form-input-invalid');            
            emailInput.focus();
            formvalid = false;
        }
        if(!values.name) {
            nameInput.setInputCls('form-input-invalid');   
            nameInput.focus();         
            formvalid = false;
        }

        if(formvalid){
            me.fireAction('submit', [me, me.getValues()]);
        }
    },
    onClose: function() {
        this.fireAction('close', [this]);
    },

    updateFeedback: function(value) {
        this.setHtml(value);
    },

});
