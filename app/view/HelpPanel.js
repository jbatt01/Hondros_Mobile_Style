Ext.define('Player.view.HelpPanel', {
    extend: 'Ext.Panel',
    alias: 'widget.helppanel',

    config: {
        height: 250,
        hidden: true,
        id: 'helpPanel',
        centered: true,
        width: 250,
        hideOnMaskTap: true,
        layout: {
            type: 'fit'
        },
        modal: true,
        cls: [
            'helppanel'
        ],
        items: [
            {
                xtype: 'dataview',
                itemTpl: [
                    '<table width="90%" border="0">',
                    '		<tr class="help-{title}">',
                    '			<td width="10%"><img src="{icon}"',
                    '				style="width: 26px; height: 26px;" /></td>',
                    '			<td width="10%">',
                    '			&nbsp;',
                    '			</td>',
                    '			<td width="80%">',
                    '			<div class="textbox">{description}</div>',
                    '			</td>',
                    '		</tr>',
                    '	</table>',
                    '	<hr class="divider" />'
                ],
                store: 'Helps'
            },
            {
                xtype: 'container',
                docked: 'top',
                height: 0,
                itemId: 'closeBtnHolder',
                hidden: true,
                items: [
                    {
                        xtype: 'panel',
                        cls: [
                            'close-imagepopup'
                        ],
                        docked: 'top',
                        height: 46,
                        right: -20,
                        top: -20,
                        width: 46,
                        zIndex: 100,
                        modal: false,
                        items: [
                            {
                                xtype: 'button',
                                height: 34,
                                itemId: 'closeImagePopBtn',
                                padding: '0 0 0 0',
                                ui: 'plain',
                                width: 34,
                                autoEvent: 'closeimagepopup',
                                iconAlign: 'center',
                                iconCls: 'delete',
                                iconMask: true
                            }
                        ]
                    }
                ]
            }
        ],
        listeners: [
            {
                fn: 'onHelpPanelInitialize',
                event: 'initialize'
            }
        ]
    },

    onHelpPanelInitialize: function(component, options) {
        var me = this;
        me.query('#closeImagePopBtn')[0].on('tap', me.onClose, me);
        if(Ext.os.is.Phone){
            me.query('#closeBtnHolder')[0].show();
        }
        else{
            me.setRight(0);
            me.setTop(50);
            me.setCentered(false);
        }
    },
    onClose: function(){
        this.hide();
        Player.app.fireEvent('hideTools');
    }


});