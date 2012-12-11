Ext.define('Player.view.Pages', {
    extend: 'Ext.carousel.Carousel',
    alias: 'widget.pages',

    config: {
        height: '100%',
        width: '100%',
        indicator: false,
        locked: 'none',
        items: [
            {
                xtype: 'panel'
            }
        ],
        listeners: [
            {
                fn: 'onCarouselInitialize',
                event: 'initialize'
            }
        ]
    },

    onCarouselInitialize: function(component, options) {
        this.setAnimation({
            duration: 500,
            easing: {
                type: 'ease-in-out'
            }
        });
    },

    onDragStart: function(e) {
        var me = this,
        lockDir = me.getLocked();

        if(e.deltaX>0 && (lockDir == 'left' || lockDir == 'both')){
            return;
        }
        else if(e.deltaX<0 && (lockDir == 'right' || lockDir == 'both')){
            return;
        }

        me.callParent(arguments);
    },

    onDrag: function(e) {
        var me = this,
        lockDir = me.getLocked();

        if(e.deltaX>0 && (lockDir == 'left' || lockDir == 'both')){
            return;
        }
        else if(e.deltaX<0 && (lockDir == 'right' || lockDir == 'both')){
            return;
        }

        me.callParent(arguments);
    },

    onDragEnd: function(e) {
        var me = this,
        lockDir = me.getLocked();

        if (e.deltaX > 0 && (lockDir == 'left' || lockDir == 'both')) {
            return;
        } else if (e.deltaX < 0 && (lockDir == 'right' || lockDir == 'both')) {
            return;
        }

        var now = Ext.Date.now(),
        itemLength = me.itemLength,
        threshold = itemLength / 2,
        offset = me.offset,
        activeIndex = me.getActiveIndex(),
        maxIndex = me.getMaxItemIndex(),
        animationDirection = 0,
        flickDistance = offset - me.flickStartOffset,
        flickDuration = now - me.flickStartTime,
        indicator = me.getIndicator(),
        velocity;


        if (flickDuration > 0 && Math.abs(flickDistance) >= 10) {
            velocity = flickDistance / flickDuration;

            if (Math.abs(velocity) >= 1) {
                if (velocity < 0 && activeIndex < maxIndex) {
                    animationDirection = -1;
                } else if (velocity > 0 && activeIndex > 0) {
                    animationDirection = 1;
                }
            }
        }

        if (animationDirection === 0) {
            if (activeIndex < maxIndex && offset < -threshold) {
                animationDirection = -1;
            } else if (activeIndex > 0 && offset > threshold) {
                animationDirection = 1;
            }
        }

        if (animationDirection !== 0) {
            //Player.app.fireEvent('beforePageSwitch');
        }

        me.callParent(arguments);
    },
    setOffsetAnimated: function(offset){
        if(Math.abs(offset)>0){
            Player.app.fireEvent('beforePageSwitch');
        }
        
        this.callParent(arguments);
    }

});