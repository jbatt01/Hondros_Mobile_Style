Ext.define('Player.view.override.ScrollerOverride', {
    override: 'Ext.scroll.Scroller',
    onDragStart: function(e) {
        var direction = this.getDirection(),
            absDeltaX = e.absDeltaX,
            absDeltaY = e.absDeltaY,
            directionLock = this.getDirectionLock(),
            startPosition = this.startPosition,
            flickStartPosition = this.flickStartPosition,
            flickStartTime = this.flickStartTime,
            lastDragPosition = this.lastDragPosition,
            currentPosition = this.position,
            dragDirection = this.dragDirection,
            x = currentPosition.x,
            y = currentPosition.y,
            now = Ext.Date.now();

        this.isDragging = true;
        
        if (directionLock && direction !== 'both') {
            if ((direction === 'horizontal' && absDeltaX > absDeltaY)
                    || (direction === 'vertical' && absDeltaY > absDeltaX)) {
                e.stopPropagation();
            }
            else {
                this.isDragging = false;
                return;
            }
        }
        else{
        	e.stopPropagation();
        }

        lastDragPosition.x = x;
        lastDragPosition.y = y;

        flickStartPosition.x = x;
        flickStartPosition.y = y;

        startPosition.x = x;
        startPosition.y = y;

        flickStartTime.x = now;
        flickStartTime.y = now;

        dragDirection.x = 0;
        dragDirection.y = 0;

        this.dragStartTime = now;

        this.isDragging = true;

        this.fireEvent('scrollstart', this, x, y);
    }   
});