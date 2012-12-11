Ext.define('Player.view.TimerBar', {
    extend: 'Ext.Toolbar',
    alias: 'widget.timerbar',

    config: {
        docked: 'top',
        height: 47,
        ui: 'timer',
        title: 'Time: 00:00:00'
    }

});