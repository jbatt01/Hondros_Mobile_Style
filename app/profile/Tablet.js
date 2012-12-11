Ext.define('Player.profile.Tablet', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'Tablet',
        views: ['Main','LowerToolBar']
    },

    isActive: function() {
        return _GET.isPhone != '1';
    },
    launch: function() {
    	console.log("Tablet Launch");
        //document.body.style.setProperty('height', '100%', 'important');
        //debugger;
        /*Ext.defer(function() {
                Ext.create('Player.view.tablet.Main', {fullscreen: true});
            }, 100);*/
        Ext.create('Player.view.tablet.Main', {fullscreen: true});
    }
});