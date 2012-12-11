Ext.define('Player.profile.Phone', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'Phone',
        views: ['Main','LowerToolBar']
    },

    isActive: function() {
        if(Ext.os.is.Phone){
            return true;
        }
        else{
            return (_GET.isPhone == '1' || _GET.isPhone == 'true');    
        }
        
    },
    launch: function() {
    	console.log("Phone Launch");
        Ext.create('Player.view.phone.Main', {fullscreen: true});
    }
});