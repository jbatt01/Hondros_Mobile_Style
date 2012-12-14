

Ext.define('Player.page.Html', {
    extend : 'Player.page.Page',

    alias: ['widget.Html'],

    inheritableStatics: {
        NOT_SINGLE_TOUCH: 0x01,
        TOUCH_MOVED:  0x02
    },
    isStarted: false,
    isTouchStarted: false,
    isDragStarted: false,
    startPoint: null,
    previousPoint: null,
    lastPoint: null,
    scroller: null,
    oldY: 0,

    config : {
        layout: 'vbox',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId:'',
        items: [{
            xtype: 'panel',
            html: 'Page Title',
            itemId: 'pageTitle'
        }, {
            xtype: 'panel',
            itemId: 'pageHtml'
        }, {
            xtype: 'panel',
            itemId: 'pageText'
        }, {
            xtype: 'panel',
            itemId: 'loading',
            centered: true,
            modal: true,
            html: "Loading"
        }],
        pageData: {}
    },
    
    
    
    applyPageData : function(config) {        
        return config;
    },

    updatePageData : function(newPageData, oldPageData) {
        var me = this,
            width, height,
            random = Math.round(Math.random()*1000);
        
        if (newPageData.title) {
            me.getComponent('pageTitle').setHtml(newPageData.title);
        }

        if(newPageData.url && !newPageData.loadOnPageStart){
            //me.setPageHtml();
        }

        if (newPageData.pText) {
            me.getComponent('pageText').setHtml(newPageData.pText['#text']);
        }
        // Create Note
        if (newPageData.note) {
            var textNote = Ext.create('Player.view.Note', {
                noteText: newPageData.note['#text'],
                nType: newPageData.nType
            });
            me.add(textNote);
        }
    },
    
    onIframeContentLoaded: function(e){
        var me = this,
            width, height,
            iframe;

        iframe = document.getElementById('myiframeCnt'+me.id);
        console.log(iframe.contentDocument.width,iframe.contentDocument.height);


        if(iframe.contentDocument.height <= 150){
            iframe.height = mp.element.getHeight();
        }
        else{
            iframe.height = iframe.contentDocument.height;    
        }

        iframe.width = mp.element.getWidth();
    },
    onIframeLoaded: function(iframe){
        var me = this,
            mp = Ext.getCmp('mainPages');
        
        iframe.width = mp.element.getWidth();
        if (Ext.os.is.Android) {
            iframe.height = mp.element.getHeight();
        }
        else{
            if(iframe.contentDocument.height < mp.element.getHeight()){ // 150
                iframe.height = mp.element.getHeight();
            }
            else{
                ;
                    
                setTimeout(function(e){me.setIframeHeight.call(me,iframe,iframe.contentDocument.height);},1000);
                //iframe.height = iframe.contentDocument.height;    
            }
            var h1 = iframe.contentDocument.body.clientHeight;
            var h2 = iframe.contentDocument.height;
            //alert("body:"+h1+" Content:"+h2);
            iframe.contentDocument.body.style.setProperty("height", iframe.contentDocument.height+"px", 'important');
            //iframe.contentDocument.getElementsByTagName('body')[0].height = iframe.contentDocument.height;
            //iframe.contentDocument.body.clientHeight = iframe.contentDocument.height;
            //iframe.contentWindow;
            //iframe.contentWindow.scrollTo(0,0);
        }
        
        me.addIframeListeners();
        me.getComponent('loading').hide();
    },
    setIframeHeight: function(iframe, height){
        iframe.height = iframe.contentDocument.height;
        var h1 = iframe.contentDocument.body.clientHeight;
        var h2 = iframe.contentDocument.height;
    },
    setPageHtml: function(){
        var me = this,
            mp = Ext.getCmp('mainPages'),
            width, height,
            random = Math.round(Math.random()*1000),
            iframe,
            pData = me.getPageData();

        if(pData.width){
            width = pData.width;
        }
        else{
            width = mp.element.getWidth();
            //width = '100%';    
        }


        if(pData.height){
            height = pData.height;
        }
        else{
            
            height = mp.element.getHeight();
            //height = 500;
        }
        
        //me.getComponent('pageHtml').setHtml('<iframe id="myiframeCnt'+me.id+'" src="'+me.getPageData().url+'?r='+random+'" frameborder="0" style="background-color:white;" width="'+width+'px" height="'+height+'px" >loading.......</iframe>');
        //me.getComponent('pageHtml').setHtml('<iframe id="myiframeCnt'+me.id+'" src="'+me.getPageData().url+'?r='+random+'" frameborder="0" style="background-color:white;" width="'+width+'px" >loading.......</iframe>');
        //me.getComponent('pageHtml').setHtml('<iframe id="myiframeCnt'+me.id+'" src="'+me.getPageData().url+'?r='+random+'" frameborder="0" style="background-color:white;" >loading.......</iframe>');
        iframe = document.createElement('iframe');
        iframe.setAttribute("src", me.getPageData().url+'?r='+random); 
        iframe.setAttribute("id", 'myiframeCnt'+me.id);
        iframe.setAttribute("style", "background-color:white;");
        iframe.setAttribute("frameborder", 0);

        iframe.onload = function(){me.onIframeLoaded.call(me, iframe);};
        me.getComponent('pageHtml').innerElement.dom.appendChild(iframe);

    },
    addIframeListeners: function(){
        var me = this,
            width, height,
            mp = Ext.getCmp('mainPages'),
            iframe;

            iframe = document.getElementById('myiframeCnt'+me.id);
            /*
            me.addMeta('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no',iframe);
            me.addMeta('apple-mobile-web-app-capable', 'yes',iframe);
            me.addMeta('apple-touch-fullscreen', 'yes',iframe);
            //*/

            
            /*/
            //iframe.contentWindow.onselectstart  = function(e){me.onSelectStart.call(me,e);};
            iframe.contentWindow.onmousedown = function(e){me.onTouchStart.call(me,e);};
            iframe.contentWindow.onmousemove = function(e){me.onTouchMove.call(me,e);};
            iframe.contentWindow.onmouseup = function(e){me.onTouchEnd.call(me,e);};
            //*/
            //iframe.contentWindow.addEventListener("scroll", me.touchHandler, true);
            /*
            iframe.contentWindow.addEventListener("touchstart", function(e){me.onTouchStart.call(me,e);}, true);
            iframe.contentWindow.addEventListener("touchmove", function(e){me.onTouchMove.call(me,e);}, true);
            iframe.contentWindow.addEventListener("touchend", function(e){me.onTouchEnd.call(me,e);}, true);
            iframe.contentWindow.addEventListener("touchcancel", function(e){me.onTouchEnd.call(me,e);}, true);
            //*/

            //*/
            //iframe.contentWindow.onselectstart  = function(e){me.onSelectStart.call(me,e);};
            iframe.contentWindow.onmousedown = function(e){me.onDragStart.call(me,e);};
            iframe.contentWindow.onmousemove = function(e){me.onDrag.call(me,e);};
            iframe.contentWindow.onmouseup = function(e){me.onDragEnd.call(me,e);};
            //*/
            //iframe.contentWindow.addEventListener("scroll", me.touchHandler, true);
            //*
            iframe.contentWindow.addEventListener("touchstart", function(e){me.onDragStart.call(me,e);}, true);
            iframe.contentWindow.addEventListener("touchmove", function(e){me.onDrag.call(me,e);}, true);
            iframe.contentWindow.addEventListener("touchend", function(e){me.onDragEnd.call(me,e);}, true);
            iframe.contentWindow.addEventListener("touchcancel", function(e){me.onDragEnd.call(me,e);}, true);
            //*/
    },






    onDragStart: function(e){
        try{
            var me = this;
            // ignore if e.target.dragable == true
            //debugger;
            if(e.target.ondragstart || e.target.dragable){
                return;
            }
            me.isDragging = true;
            me.startDragging = true;
            if(Ext.os.is.desktop){
                me.startX = e.screenX;
                me.startY = e.screenY;
            }
            else{
                me.startX = e.touches[0].pageX;
                me.startY = e.touches[0].pageY;
            }
            this.oldY = 0;
        }catch(e){
            console.log("Start:"+e);
        }
    },
    onDrag: function(e){
        try{
            var me = this,
                deltaX, deltaY, absDeltaX, absDeltaY, x, y, time, touch,
                event = Ext.create('Ext.event.Event');

            if (!me.isDragging) {
                return;
            }
            if(Ext.os.is.desktop){
                deltaX = e.screenX - me.startX;
                deltaY = e.screenY - me.startY;
                absDeltaX = Math.abs(deltaX);
                absDeltaY = Math.abs(deltaY);
            }
            else{
                touch = e.changedTouches[0];
                x = touch.pageX;
                y = touch.pageY;
                absDeltaX = Math.abs(x - me.startX);
                absDeltaY = Math.abs(y - me.startY);
                deltaX = x - me.startX;
                deltaY = y - me.startY;
                time = e.time;
                //this.debugLog("y:"+y+" sx:"+me.startY+" Δy:"+absDeltaY+" oldY:"+this.oldY+"\n");
                if(absDeltaY > this.oldY+29 || absDeltaY < this.oldY-29){
                    me.onDragEnd(e);
                    return;
                }
                this.oldY = absDeltaY;
                
            }

            event.absDeltaX = Math.abs(deltaX);
            event.absDeltaY = Math.abs(deltaY);
            event.deltaX = deltaX;
            event.deltaY = deltaY;
            event.time = time;

            if(me.startDragging){
                me.startDragging = false;
                me.parent.onDragStart(event);
                me.getScrollable().getScroller().onDragStart(event);
                //me.parent.getActiveItem().getScrollable().getScrollable().onDragStart(event);
            }
            else{
                //console.log("Δx:"+absDeltaX+" Δy:"+absDeltaY);
                /*deltaX = 0;
                //deltaY = -1;
                time = 100;
                event.absDeltaX = Math.abs(deltaX);
                event.absDeltaY = Math.abs(deltaY);
                event.deltaX = deltaX;
                event.deltaY = deltaY;
                event.time = time;*/
                
                if(absDeltaX > absDeltaY){
                    me.parent.onDrag(event);
                    me.getScrollable().getScroller().onDragEnd(event);
                    //this.getScrollable().getScroller().setOffset(0);
                }
                else{
                     //me.parent.setOffset(0);

                    me.parent.onDragEnd(event);
                    me.getScrollable().getScroller().onDrag(event);
                }
                
                
            }
            e.preventDefault();
        }catch(e){
            console.log("on:"+e);
        }
    },
    onDragEnd: function(e){
        try{
            var me = this;
            if (!me.isDragging) {
                return;
            }
            me.isDragging = false;
            if(Ext.os.is.desktop){
                var deltaX = e.screenX - me.startX;
                var deltaY = e.screenY - me.startY;
            }
            else{
                // sencha-touch-all-debug.js line:78262
                var touch = e.changedTouches[0],
                x = touch.pageX,
                y = touch.pageY,
                deltaX = x - me.startX,
                deltaY = y - me.startY,
                absDeltaX = Math.abs(deltaX),
                absDeltaY = Math.abs(deltaY);    
            }
            
            var event = Ext.create('Ext.event.Event');
            event.absDeltaX = Math.abs(deltaX);
            event.absDeltaY = Math.abs(deltaY);
            event.deltaX = deltaX;
            event.deltaY = deltaY;
            me.parent.onDragEnd(event);
            me.getScrollable().getScroller().onDragEnd(event);
        }catch(e){
            console.log("END:"+e);
            //alert("END:"+e);
        }
        //alert("LOG:"+this.logStr);
    },




















    onTouchStart: function(e) {
        console.log("onTouchStart");
        return;
        var me = this,
            e = me.convertEvent(e),
            startTouches,
            startTouch;

        if (e.touches.length < 1) {
            if (me.isStarted && me.lastMoveEvent !== null) {
                me.onTouchEnd(me.lastMoveEvent);
            }
            return false;
        }

        me.startTouches = startTouches = e.changedTouches;
        me.startTouch = startTouch = startTouches[0];

        me.startPoint = {x:startTouch.pageX, y:startTouch.pageY};
        me.isTouchStarted = true;
        console.log("onTouchStart");
    },

    onTouchMove: function(e) {
        console.log("onTouchMove");
        
        return;
        if (!this.isTouchStarted) {
            return;
        }
        var me = this,
            e = me.convertEvent(e),
            touches = e.changedTouches,
            touch = touches[0],
            point = {x:touch.pageX,y:touch.pageY},
            time = e.time;

        this.lastTime = time;
        this.lastPoint = point;
        this.lastMoveEvent = e;
        console.log("onTouchMove");
        if (!this.isStarted) {
            this.isStarted = true;

            this.startTime = time;
            this.previousTime = time;
            
            this.previousPoint = this.startPoint;
            
            //this.fire('dragstart', e, this.startTouches, this.getInfo(e, this.startTouch));
            
            //var event = this.getInfo(e, this.startTouch);
            var info = me.getInfo(e, this.startTouch);
            e.absDeltaX = info.absDeltaX;
            e.absDeltaY = info.absDeltaY;
            e.deltaX = info.deltaX;
            e.deltaY = info.deltaY;

            me.scroller.onDragStart(e);
            //me.parent.onDragStart(e);
            console.log("- start moving");
        }
        else {
            var info = me.getInfo(e, touch);
            e.absDeltaX = info.absDeltaX;
            e.absDeltaY = info.absDeltaY;
            e.deltaX = info.deltaX;
            e.deltaY = info.deltaY;
            //var event = this.getInfo(e, touch);

            //var scroller = me.getScrollable().getScroller();

            //.onDrag(event);
            console.log("x:"+e.absDeltaX+" y:"+e.absDeltaY);
            if(info.absDeltaX > info.absDeltaY){
                //me.parent.onDrag(event);
                //me.getScrollable().getScroller().onDragEnd(event);
                console.log("- swipe");

                //this.getScrollable().getScroller().setOffset(0);
            }
            else{
                console.log("- scroll");
                //me.scroller.scrollBy(0,-1*info.deltaY);
                me.scroller.onDrag(e);
                 //me.parent.setOffset(0);

                //me.parent.onDragEnd(event);
                //me.getScrollable().getScroller().onDrag(event);
            }
            //var scroller = me.getScrollable().getScroller();
            //scroller.onDrag(this.getInfo(e, touch));
            //this.fire('drag', e, touches, this.getInfo(e, touch));
        }

    },

    onTouchEnd: function(e) {
        console.log("onTouchEnd");
        return;
        var me = this;
        e = me.convertEvent(e);
        if (this.isStarted) {
            var touches = e.changedTouches,
                touch = touches[0],
                point = {x:touch.pageX,y:touch.pageY};

            this.isStarted = false;

            this.lastPoint = point;
            //alert("de");
            var info = me.getInfo(e, touch);
            e.absDeltaX = info.absDeltaX;
            e.absDeltaY = info.absDeltaY;
            e.deltaX = info.deltaX;
            e.deltaY = info.deltaY;
            //me.parent.onDragEnd(this.getInfo(e, touch));
            me.scroller.onDragEnd(e);
            //this.fire('dragend', e, touches, this.getInfo(e, touch));
            console.log("onTouchEnd");

            this.startTime = 0;
            this.previousTime = 0;
            this.lastTime = 0;

            this.isTouchStarted = false;

            this.startPoint = null;
            this.previousPoint = null;
            this.lastPoint = null;
            this.lastMoveEvent = null;
        }
        console.log("end");
    },
    convertEvent: function(e){
        if(Ext.feature.has.Touch){
            return e;
        }
         

        var me = this,
            startTouches,
            startTouch,
            type = e.type,
            touchList = [e],
            x,y;

        e.pageX = e.screenX;
        e.pageY = e.screenY;
        e.identifier = 1;
        e.touches = (type !== 'mouseup') ? touchList : [];
        e.targetTouches = (type !== 'mouseup') ? touchList : [];
        e.changedTouches = touchList;
        //e = new Ext.event.Touch(e);
        return e;
    },

    getInfo: function(e, touch) {
        try{
            var time = e.time,
                startPoint = this.startPoint,
                previousPoint = this.previousPoint,
                startTime = this.startTime,
                previousTime = this.previousTime,
                point = this.lastPoint,
                deltaX = point.x - startPoint.x,
                deltaY = point.y - startPoint.y,
                info = {
                    touch: touch,
                    startX: startPoint.x,
                    startY: startPoint.y,
                    previousX: previousPoint.x,
                    previousY: previousPoint.y,
                    pageX: point.x,
                    pageY: point.y,
                    deltaX: deltaX,
                    deltaY: deltaY,
                    absDeltaX: Math.abs(deltaX),
                    absDeltaY: Math.abs(deltaY),
                    previousDeltaX: point.x - previousPoint.x,
                    previousDeltaY: point.y - previousPoint.y,
                    time: time,
                    startTime: startTime,
                    previousTime: previousTime,
                    deltaTime: time - startTime,
                    previousDeltaTime: time - previousTime
                };
        }
        catch(e){}
            
        return info;
    },
    start: function(){
        var me = this;

        this.callParent(arguments);
        
        //if(me.getPageData().url && me.getPageData().loadOnPageStart){
            me.setPageHtml();
        //}
       
        this.scroller = me.getScrollable().getScroller();
    },

    initialize : function() {
        this.callParent(arguments);
        this.logStr = "";
    }
});