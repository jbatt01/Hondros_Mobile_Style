Ext.define('Player.page.custom.Verification', {
    extend: 'Ext.Panel',

    alias: ['widget.Verification'],


    config: {
        layout: 'vbox',
        styleHtmlContent: true,
        cls: 'page-content',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        defaults: {
            margin: 10
        },
        recordId: '',
        pageData: {
            title: 'Page Title 2'
        },
        items: [{
            xtype: "container",
            layout: {
                type: "hbox"
            },
            items: [{
                xtype: "container",
                itemId: 'titleIcon'
            }, {
                xtype: "container",
                cls: 'page-title',
                itemId: 'pageTitle'
            }]
        }, {
            xtype: 'container',
            itemId: 'pageText',
            cls: 'page-content',
            html: 'Please note that it is unlawful for an individual to receive course credits under false pretenses. By clicking "Yes, I agree", you are certifying, under penalty of law, that you {studentName} - {UID}, are the student who registered for, will review, and complete the course. Falsifying this statement will result in an incomplete status and could render you ineligible to take other courses or complete other required steps. <br/><br/>Upon agreement swipe or tap Next to go to the next page.'
        }, {
            xtype: 'checkboxfield',
            itemId: 'verifyCheck',
            cls: 'verifyCheck',
            margin: '20 10 10 10',
            width: 300,
            label: 'Yes, I agree',
            labelAlign: 'right',
            labelWidth: '80%'
        }],
        listeners: [
            {
                fn: 'onVerifyCheck',
                event: 'check',
                delegate: '#verifyCheck'
            }
        ]
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this;

        if (newPageData.title) {
            me.query('#pageTitle')[0].setHtml(newPageData.title);
        }
        if (newPageData.title) {
            //me.query('#pageText')[0].setHtml(newPageData.pText['#text']);
        }

        var params = {};
        if (newPageData.orgID) {
            params.orgID = newPageData.orgID;
        }
        try {
            params.theID = SCORM.GetStudentID();
        } catch (e) {
            params.theID = 'UID';
        }

        params.courseID = newPageData.courseID;


        Ext.Ajax.request({
            url: newPageData.coldfusionURL,
            method: 'POST',
            params: params,
            failure: function(response) {
                Ext.Msg.alert('Server Error', 'Failed to get user information', Ext.emptyFn);
            },
            success: function(response, opts) {
                try {
                    var responseObj = Ext.decode(response.responseText);
                } catch (e) {
                    Ext.Msg.alert('Server Error', 'Invalid response form server', Ext.emptyFn);
                    return;
                }

                var pTextComp = this.query('#pageText')[0];
                var htmlString = pTextComp.getHtml();
                htmlString = htmlString.replace('{studentName}', responseObj.FName + " " + responseObj.LName);
                htmlString = htmlString.replace('{UID}', responseObj.licenseNumber);

                pTextComp.setHtml(htmlString);
            },
            scope: this
        });

        /*if (newPageData.pText) {
            me.query('#pageText')[0].setHtml(newPageData.pText['#text']);
        }*/
    },
    onVerifyCheck: function(checkboxfield, e, options) {
        Player.app.fireEvent('pageComplete');
    },


    initialize: function() {
        this.callParent(arguments);
    },
    start: function() {

    },
    close: function() {

    }



});