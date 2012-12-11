Ext.define('Player.controller.QuizController', {
    extend: 'Ext.app.Controller',
    config: {
        control: {
            "#mainPages": {
                activeitemchange: 'onCarouselActiveItemChange'
            }
        }
    },

    onCarouselActiveItemChange: function(container, value, oldValue, options) {

        //console.log("Switch!!!2");
    }

});