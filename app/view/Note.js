Ext.define('Player.view.Note', {
    extend: 'Ext.Panel',
    alias: 'widget.note',

    config: {
        border: '2px',
        styleHtmlContent: true,
        width: '95%',
        layout: {
            type: 'fit'
        },
        noteText: 'Lorem ipsum dolor sit amet',
        nType: 'none',
        cls: [
            'note'
        ],
        items: [
            {
                xtype: 'container',
                docked: 'left',
                itemId: 'noteIcon',
                width: '20%'
            }
        ]
    },

    applyNoteText: function(noteText) {
        this.setHtml(noteText);
    },

    applyNType: function(nType) {
        var noteCmp = this.getComponent('noteIcon'),
        imageWidth = '100%';

        switch (nType){
            case 'tip':
            noteCmp.setHtml('<img style="width:'+imageWidth+'" src="resources/img/tip_icon.png"/>');
            break;
            case 'note':
            case 'hint':
            noteCmp.setHtml('<img style="width:'+imageWidth+'" src="resources/img/hint_icon.png"/>');
            break;
            case 'caution':
            case 'warning':
            noteCmp.setHtml('<img style="width:'+imageWidth+'" src="resources/img/warning_icon.png"/>');
            break;
            case 'download':
            /// TODO make clickable
            noteCmp.setHtml('<img style="width:'+imageWidth+'" src="resources/img/download_icon.png"/>');
            break;
            case 'none':
            this.hide();
            break;
            default:
            if(nType){
                noteCmp.setHtml('<img style="width:'+imageWidth+'" src="resources/img/'+nType+'_icon.png"/>');
            }
            else{
                noteCmp.setHtml('<img style="width:'+imageWidth+'" src="resources/img/hint_icon.png"/>');
            }

            break;
        }

    }

});