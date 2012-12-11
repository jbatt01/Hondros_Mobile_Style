Ext.define('Player.controller.SettingsController', {
    extend: 'Ext.app.Controller',
    config: {
    },

    init: function(application) {
        try{
            initLocalization();
        }catch(e){
            console.log("Localization Error: "+e);
        }
    }

});