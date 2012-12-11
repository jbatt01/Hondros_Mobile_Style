Ext.define('Player.page.CustomContent', {
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
            itemId: 'pageText',
            styleHtmlContent : true
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

        if (newPageData.sourceType != 'upload' && newPageData.pText) {
            me.getComponent('pageText').setHtml(newPageData.pText['#text']);
            me.getComponent('loading').hide();
            try{
                MathJax.Hub.PreProcess(me.element.dom);
                MathJax.Hub.Process(me.element.dom);
            }catch(e){}
        }
        else if(newPageData.sourceType != 'upload' && newPageData.html5Text){
            me.getComponent('pageText').setHtml(newPageData.html5Text['#text']);
            me.getComponent('loading').hide();
            try{
                MathJax.Hub.PreProcess(me.element.dom);
                MathJax.Hub.Process(me.element.dom);
            }catch(e){}
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
        console.log("onIframeLoaded");
        var me = this,
            mp = Ext.getCmp('mainPages');
        
        iframe.width = mp.element.getWidth();


        iframe.height = mp.element.getHeight();


        /*
        // UNCOMMENT this to add total height
        if (Ext.os.is.Android) {
            iframe.height = mp.element.getHeight();
        }
        else{
            if(iframe.contentDocument.height < mp.element.getHeight()){ // 150
                iframe.height = mp.element.getHeight();
            }
            else{
                setTimeout(function(e){me.setIframeHeight.call(me,iframe,iframe.contentDocument.height);},1000);
            }
            var h1 = iframe.contentDocument.body.clientHeight;
            var h2 = iframe.contentDocument.height;
            iframe.contentDocument.body.style.setProperty("height", iframe.contentDocument.height+"px", 'important');
        }
        */
        
        me.addIframeListeners();
        me.getComponent('loading').hide();
    },
    setIframeHeight: function(iframe, height){
        iframe.height = iframe.contentDocument.height;
        var h1 = iframe.contentDocument.body.clientHeight;
        var h2 = iframe.contentDocument.height;
    },
    setPageHtml: function(){
        console.log("setPageHtml");
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
        
        iframe = document.createElement('iframe');
        if(Ext.os.is.Phone && me.getPageData().phoneHtml){
            iframe.setAttribute("src", me.getPageData().phoneHtml+'?r='+random); 
        }
        else{
            iframe.setAttribute("src", me.getPageData().tabletHtml+'?r='+random); 
        }
        
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

            try{
                iframe.contentWindow.onmousedown = function(e){me.onDragStart.call(me,e);};
                iframe.contentWindow.onmousemove = function(e){me.onDrag.call(me,e);};
                iframe.contentWindow.onmouseup = function(e){me.onDragEnd.call(me,e);};

                iframe.contentWindow.addEventListener("touchstart", function(e){me.onDragStart.call(me,e);}, true);
                iframe.contentWindow.addEventListener("touchmove", function(e){me.onDrag.call(me,e);}, true);
                iframe.contentWindow.addEventListener("touchend", function(e){me.onDragEnd.call(me,e);}, true);
                iframe.contentWindow.addEventListener("touchcancel", function(e){me.onDragEnd.call(me,e);}, true);    
            }catch(e){
                console.error("Event Error:"+e);
            }
            
    },

    onDragStart: function(e){
        try{
            var me = this;
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
                //me.getScrollable().getScroller().onDragStart(event);
            }
            else{
                if(absDeltaX > absDeltaY){
                    me.parent.onDrag(event);
                    //me.getScrollable().getScroller().onDragEnd(event);
                }
                else{
                    me.parent.onDragEnd(event);
                    //me.getScrollable().getScroller().onDrag(event);
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
            //me.getScrollable().getScroller().onDragEnd(event);
        }catch(e){
            console.log("END:"+e);
        }
    },


    start: function(){
        console.log("START HTML");
        var me = this;

        this.callParent(arguments);
        
        if(me.getPageData().sourceType == 'upload'){
            me.setPageHtml();
        }
       
        this.scroller = me.getScrollable().getScroller();
    },

    initialize : function() {
        console.log("INIT HTML");
        this.callParent(arguments);
    }
});