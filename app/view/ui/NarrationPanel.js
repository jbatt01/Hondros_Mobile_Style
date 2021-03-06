/*
 * File: app/view/ui/NarrationPanel.js
 *
 * This file was generated by Sencha Designer version 2.0.0.
 * http://www.sencha.com/products/designer/
 *
 * This file requires use of the Sencha Touch 2.0.x library, under independent license.
 * License of Sencha Designer does not include license for Sencha Touch 2.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Player.view.ui.NarrationPanel', {
    extend: 'Ext.Panel',

    config: {
        centered: true,
        height: 250,
        width: 250,
        scrollable: 'vertical',
        items: [
            {
                xtype: 'toolbar',
                docked: 'top',
                title: 'Narration',
                items: [
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'button',
                        id: 'closeNarration',
                        itemId: 'mybutton8',
                        ui: 'round',
                        text: 'X'
                    }
                ]
            }
        ]
    }

});