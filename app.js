Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    requires: [
        'Player.page.Video',
        'Player.page.TextImageLinkandAudio',
        'Player.page.TextImageandAudio',
        'Player.page.TextandVideo',
        'Player.page.TextandImageLink',
        'Player.page.TextandImage',
        'Player.page.TextandAudio',
        'Player.page.Text',
        'Player.page.Quiz',
        'Player.page.ImageLinkandAudio',
        'Player.page.ImageandAudio',
        'Player.page.CustomHTML5Page',
        'Player.page.ExternalSWFdefault',
        'Player.page.Definitions'
    ],

    viewport: {
        itemId: 'viewport',
        autoMaximize: true,
        listeners: [
            {
                fn: function(component, options) {
                    try{
                        // reposition image zoom icon
                        var textimages = Ext.Viewport.query('textimage'),
                        i=0,ln=textimages.length;
                        for(i=0,ln=textimages.length;i<ln;i++){
                            textimages[i].repositionZoomImage();
                        }
                    }catch(e){}
                    },
                event: 'resize'
            }
        ]
    },

    profiles: ['Phone', 'Tablet'],

    models: [
        'Help',
        'Glossary',
        'ScoSetting',
        'Quiz',
        'Question',
        'PageList'
    ],
    stores: [
        'Helps',
        'ScoTreeStore',
        'GlossaryTreeStore',
        'Quizes',
        'HiddenPages',
        'SupportedPages'
    ],
    views: [
        'Main',
        'UpperToolBar',
        'TableOfContents',
        'LowerToolBar',
        'Pages',
        'TimerBar',
        'NarrationPanel',
        'Glossary',
        'Content',
        'HelpPanel',
        'GlossaryPanel',
        'Note',
        'AudioBar',
        'FloatingToc',
        'DockedToc',
        'PageInfo'
    ],

    name: 'Player',

    startupImage: {
        '320x460': 'resources/img/startup/320x460.jpg',
        '640x920': 'resources/img/startup/640x920.png',
        '768x1004': 'resources/img/startup/768x1004.png',
        '748x1024': 'resources/img/startup/1024x748.png',
        '1536x2008': 'resources/img/startup/1536x2008.png',
        '1496x2048': 'resources/img/startup/2048x1496.png'
    },
    icon: {
        57: 'resources/img/startup/Icon.png',
        72: 'resources/icimg/startupons/Icon~ipad.png',
        114: 'resources/img/startup/Icon@2x.png',
        144: 'resources/img/startup/Icon~ipad@2x.png'
    },
    controllers: [
        'SettingsController',
        'GlossaryController',
        'PageController',
        'TimeController',
        'QuizController',
        'ScormController'
    ],

    onViewportOrientationChange: function(viewport, newOrientation, width, height, options) {
        /*console.log("H:"+window.innerHeight+" W:"+window.innerWidth);
        document.body.style.setProperty('height', '100%', 'important');
        Ext.Viewport.getMasked().element.dom.style.setProperty('height', '100%', 'important');*/

        //console.log("H:"+window.innerHeight+" W:"+window.innerWidth);
        //document.body.style.setProperty('height', window.innerHeight+'px', 'important');
        //Ext.Viewport.getMasked().element.dom.style.setProperty('height', window.innerHeight+'px', 'important');

        //document.body.style.setProperty('height', '100%', 'important');
        //document.getElementById('loadingstuff').style.setProperty('height', '100%', 'important');

        Player.app.fireEvent('orientationchange', newOrientation);
        console.log("Current::::");
    },
    onBeforeViewportOrientationChange: function(viewport, newOrientation, width, height, options) {
        //Player.app.fireEvent('orientationchange', newOrientation);
        console.log("Before::::");
        Ext.Viewport.setMasked({xtype: "loadmask", message: "Orientating..."});

        //document.getElementById("loadingstuff").style.setProperty('visibility', 'visible');
        //document.getElementById("loadingstuff").style.setProperty('z-index', '1000', 'important');
        //debugger;
        
    },
    onAfterViewportOrientationChange: function(viewport, newOrientation, width, height, options) {
        //Player.app.fireEvent('orientationchange', newOrientation);
        console.log("After::::");
        //document.getElementById("loadingstuff").style.setProperty('visibility', 'hidden');
        Ext.Viewport.setMasked(false);
    },

    onViewportResize: function(component, options) {
        try{
            // reposition image zoom icon
            var textimages = Ext.Viewport.query('textimage'),
            i=0,ln=textimages.length;
            for(i=0,ln=textimages.length;i<ln;i++){
                textimages[i].repositionZoomImage();
            }
        }catch(e){}
    },

    launch: function() {
        console.log("App Launch");
        //debugger;
        Ext.Viewport.on([
        {
            event: 'orientationchange',
            fn: 'onViewportOrientationChange',
            scope: this
        },
        {
            event: 'orientationchange',
            fn: 'onBeforeViewportOrientationChange',
            order: 'before',
            scope: this
        },
        {
            event: 'orientationchange',
            fn: 'onAfterViewportOrientationChange',
            order: 'after',
            scope: this
        },
        {
            event: 'resize',
            fn: 'onViewportResize',
            scope: this
        }
        ]);
        //Ext.create('Player.view.Main', {fullscreen: true});
    }

});
