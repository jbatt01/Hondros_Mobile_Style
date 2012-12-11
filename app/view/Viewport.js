Ext.define('MyApp.view.Viewport', {
    extend: 'MyApp.view.Main',
    config: {
        fullscreen: true
    },
    requires: [
        'MyApp.view.Main',
        'MyApp.view.HiddenPage',
        'MyApp.view.PopUpPanel'
    ]
});