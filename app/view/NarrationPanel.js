Ext.define('Player.view.NarrationPanel', {
    extend: 'Ext.Panel',
    alias: 'widget.narrationpanel',

    config: {
        centered: true,
        height: 250,
        width: 250,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        draggable: {
            direction: 'both',
            constraint: {
                min: {x: -900, y: -900},
                max: {x: 900, y: 900}
            },
            listeners: {
                dragstart: function(component, index, target, record, eventObject, options) {
                    //debugger;
                    var elem = component.getElement();
                }
            }
        },
        narrationText: 'asdf',
        items: [
            {
                xtype: 'toolbar',
                docked: 'top',
                title: Lang.Narration,
                items: [
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'button',
                        id: 'closeNarration',
                        itemId: 'closeNarration',
                        ui: 'round',
                        iconCls: 'delete',
                        iconMask: true,
                        align: 'right'
                    }
                ]
            }
        ],
        listeners: [
            {
                fn: 'onClose',
                event: 'tap',
                delegate: '#closeNarration'
            }
        ]
    },
    updateNarrationText: function(newNarrationText){
        //var me = this;
        this.setHtml(newNarrationText);

    },
    onClose:function(){
        this.destroy();
    }


});