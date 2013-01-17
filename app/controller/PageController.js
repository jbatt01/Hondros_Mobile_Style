Ext.define('Player.controller.PageController', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: '#main',
            pageNumber: '#pageNumber',
            pageInfo: '#pageInfo',
            content: '#contentPanel',
            nextBtn: '#nextPageBtn',
            previousBtn: '#previousPageBtn',
            narrationBtn: '#narrationTextBtn',
            glossaryBtn: '#glossaryBtn',
            closeBtn: '#closeBtn',
            timeBar: '#timeBar',
            help: '#helpPopUp',
            pages: '#mainPages',
            phoneTocBtn: '#phoneTocBtn',
            narration: '#narrationPanel',
            toc: '#tableOfContents',
            topicTitle: '#topicTitle',
            courseTitle: '#courseTitle'
        },

        control: {
            "#helpBtn": {
                tap: 'onHelpBtnTap'
            },
            "#tableOfContents": {
                leafitemtap: 'onNestedlistLeafItemTap'
            },
            "#mainPages": {
                activeitemchange: 'onCarouselActiveItemChange'
            },
            "#nextPageBtn": {
                tap: 'onNextpageTap'
            },
            "#previousPageBtn": {
                tap: 'onPreviousPageBtnTap'
            },
            "button[action=shownarration]": {
                tap: 'onNarrationTextBtnTap'
            },
            "#closeBtn": {
                tap: 'onCloseBtnTap'
            },
            "button[action=showtoc]": {
                tap: 'onShowToc'
            }
        }
    },

    onHelpBtnTap: function(button, e, options) {
        var me = this,
        hp = Ext.getCmp('helpPanel');

        if(hp){
            Ext.Viewport.remove(Ext.Viewport.getComponent('helpPanel'));
        }

        me.hideImagePopup();


        hp = Ext.create('Player.view.HelpPanel');

        Ext.Viewport.add(hp);

        if(hp.isHidden()){
            var helpbutton = Ext.getCmp('upperToolBar').getComponent('helpBtn');
            hp.setZIndex(1000);
            if(Ext.os.is.Phone){
                hp.show();
            }
            else{
                hp.showBy(helpbutton);    
            }
            
            hp.getModal().on('tap', function(){Player.app.fireEvent('hideTools');});
        }
        else{
            hp.hide();
        }
    },

    onNestedlistLeafItemTap: function(nestedlist, list, index, target, record, e, options) {
        var me = this,
        content = me.getContent();

        
        if(Ext.os.is.Phone){
            //me.goToPage(list.getStore().getAt(index));
            Ext.Function.defer(me.goToPage, 100, me, [list.getStore().getAt(index)]);
            Ext.Function.defer(content.setScreen, 200, content, ['main']);
        }
        else{
            Ext.getCmp('floatingToc').hide();
            Ext.Function.defer(me.goToPage, 100, me, [list.getStore().getAt(index)]);
        }
    },

    onCarouselActiveItemChange: function(container, value, oldValue, options) {
        
    },

    onNextpageTap: function(button, e, options) {
        var me = this,
        i, cp,
        pgs = me.getPages();

        me.hideImagePopup();
        
       if(me.currentPageNode.data.pType == 'Quiz'){
		 
            cp = me.currentPage; 
            i = cp.getActiveIndex();
            if (i + 1 < cp.innerItems.length) {
                cp.next();
				if(Player.settings.get('activateTimer')== true)
		{
		
		Player.app.fireEvent('startCountDown',me.currentPageNode);
				
			me.getTimeBar().show();
                return;
         }
			
			}}
       

        Player.app.fireEvent('beforePageSwitch');


        Ext.Function.defer(pgs.next, 200, pgs);
    },
    onPreviousPageBtnTap: function(button, e, options) {
        var me = this,
        i, cp,
        pgs = me.getPages();

        me.hideImagePopup();
        if(me.currentPageNode.data.pType == 'Quiz'){
            cp = me.currentPage;
            i = cp.getActiveIndex();
            if (i > 0) {
                cp.previous();
                return;
            }
        }


        Player.app.fireEvent('beforePageSwitch');

        Ext.Function.defer(pgs.previous, 200, pgs);

        //me.getPages().previous();
        //Player.app.fireEvent('beforePageSwitch');
    },

    onNarrationTextBtnTap: function(button, e, options) {
        var me = this;

        if(Ext.Viewport.query('narrationpanel').length === 0){
            // add new one
            Ext.Viewport.add(Ext.create('Player.view.NarrationPanel', {
                narrationText: currentPage.getPageData().narration['#text']
            }));
        }
        else{
            me.closeNarration();
        }

        me.hideImagePopup();
    },
    closeNarration: function(){
        if(Ext.Viewport.query('narrationpanel').length > 0){
            Ext.Viewport.query('narrationpanel')[0].destroy();    
        }
    },

    onCloseBtnTap: function(button, e, options) {
        try{
            currentPage.hideVideo();
        }catch(e){
        }

        Ext.Msg.confirm(Lang.Exit, Lang.Sure_Exit, this.exitCourse);
    },

    onShowToc: function(button, e, options) {
        var me = this,
        floatingNavPanel = Ext.getCmp('floatingToc'),
        content = me.getContent();


        if(Ext.os.is.Phone){

            if(content.getScreen() != 'toc'){
                content.setScreen('toc');
            }
            else{
                content.setScreen('main');
            }
            Player.app.fireEvent('hideTools');
        }
        else{
            if(floatingNavPanel.isHidden()){
                floatingNavPanel.showBy(button);
            }
            else{
                floatingNavPanel.hide();
            }
        }
    },

    onPageComplete: function() {
        console.log("onPageComplete");
        var me = this;


        if (!me.currentPageNode.get('complete')) {
            me.currentPageNode.set('complete', true);
            me.markCompletedTopics(me.currentPageNode);
        }
        // TODO just check to see if there is/needs a next page

        me.updateCarousel(me.currentPageNode);


        try {
            Player.app.fireEvent('SetDataChunk');
        } catch (e) {
            // No scorm
        }

        // scorm report
        if (me.isTopicComplete(Ext.getStore('ScoTreeStore').getRoot())) {
            Player.app.fireEvent('pauseCourse');
            switch (Player.settings.get('completion')) {
                case 'None':
                break;
                case 'completed':
                try {
                    SCORM.SetReachedEnd();
                } catch (e) {
                    // No scorm
                }
                break;
                case 'incomplete':
                try {
                    SCORM.ResetStatus();
                } catch (e) {
                    // No scorm
                }
                break;
                case 'pass':
                try {
                    SCORM.SetPassed();
                } catch (e) {
                    // No scorm
                }
                break;
                case 'failed':
                try {
                    SCORM.SetFailed();
                } catch (e) {
                    // No scorm
                }
                Ext.Msg.alert("FAILED!");
                break;
                default:

                break;
            }
        }
    },

    onBeforePageSwitch: function(e,f,g) {
        window.console.markTimeline("onBeforePageSwitch");
        // mask while loading pages
        Ext.getCmp("contentPanel").setMasked({xtype: "loadmask", message: Lang.Loading, cls:'page-mask'});

        // fix weirdness when mask shows but dosn't go away
        setTimeout(function(){
            // hide mask on timeout
            Ext.getCmp("contentPanel").setMasked(false);
        }, 2000);


        // End old page
        try {
            currentPage.close();
        }catch(e){
            console.log("CLOSE ERROR::"+e);
        }
    },

    markCompletedTopics: function(pageNode) {
        var me = this,
        tempTopic = pageNode.parentNode,
        temp,
        completedTopicList = [],
        allPagesComplete = false,
        st = Ext.getStore('ScoTreeStore');


        // Step up tree
        while(tempTopic){
            if(me.isTopicComplete(tempTopic)){
                completedTopicList.push(tempTopic.raw.topicId);
                // mark topic complete
                tempTopic.set('complete', true);
                if(tempTopic.isRoot()){
                    allPagesComplete = true;
                }
            }
            else{
                break;
            }
            tempTopic = tempTopic.parentNode;
        }
        me.removeTopicRestriction(st.getRoot(), completedTopicList);
    },

    isTopicComplete: function(topicNode) {
        var me = this,
        i,ln,
        node;

        if(topicNode.isLeaf()){
            return;
        }

        // If any node (leaf or branch) is not compelte return false
        for(i=0,ln=topicNode.childNodes.length;i<ln;i++){
            node = topicNode.childNodes[i];
            if(!node.get('complete')){
                return false;
            }
        }

        return true;
    },

    removeTopicRestriction: function(topicNode, topicIdList) {
        var me = this,
        i,ln,
        node,
        currentRestrictedId,
        updatedRestrictedId;

        if(!topicIdList || topicIdList.length <= 0){
            return;
        }

        // loop through child nodes
        for(i=0,ln=topicNode.childNodes.length;i<ln;i++){
            node = topicNode.childNodes[i];

            // Remove restricted from list
            currentRestrictedId = node.get('restrictedTopicId');
            if(currentRestrictedId){
                for(j=0,jn=topicIdList.length;j<jn;j++){
                    // don't forget to add the comma
                    updatedRestrictedId = currentRestrictedId.replace(topicIdList[j]+',','');
                }
                if(updatedRestrictedId === ''){
                    node.set('restrictedTopicId', false);
                }
                else{
                    node.set('restrictedTopicId', updatedRestrictedId);
                }

            }
            // recures on branches
            if(!node.isLeaf()){
                me.removeTopicRestriction(node, topicIdList);
            }
        }
    },

    onOrientationChange: function(newOrientation) {
        var me = this,
            navPanel = Ext.getCmp('tableOfContents');
        // Because android tablets don't return "landscape" or 'portrait'
        if(newOrientation >= 1280){
            newOrientation = 'landscape';
        }
        if(newOrientation <= 800){
            newOrientation = 'portrait';
        }
        if(Ext.os.is.Android){
            // trying to fix android rotation problem...
            document.body.style.setProperty('height', '100%', 'important');
            document.getElementById('ext-viewport').style.setProperty('height', '100%', 'important');    
        }
        
        console.log("onOrientationChange:"+newOrientation);
        
        if(me.firstOrientation){
            me.firstOrientation = false;
            if(Ext.os.is.Phone){
                navPanel.query('#closeToc')[0].show();
                return;
            }
            else{
                // because android is SOMETIMES backwards on the first time
                if(Ext.os.is.Android && Ext.os.is.tablet){
                    if(window.innerHeight > window.innerWidth){
                        newOrientation = 'portrait';
                    }
                    else{
                        newOrientation = 'landscape';
                    }
                }

                if(!Ext.getCmp('floatingToc')){
                    Ext.Viewport.add(Ext.create('Player.view.FloatingToc'));
                }
            }
        }
        if(Ext.os.is.Phone){
            return;
        }

        var floatingNavPanel = Ext.getCmp('floatingToc'),
            dockedNavPanel = Ext.getCmp('dockedToc'),
            tocBtn = Ext.getCmp('upperToolBar').getComponent('tocBtn');

        if(newOrientation == 'portrait' || autoHideToc){
            floatingNavPanel.add(navPanel);
            dockedNavPanel.remove(navPanel);
            dockedNavPanel.hide();
            navPanel.setWidth(250);
            navPanel.setHeight(388);
            tocBtn.show();
        }
        else{
            floatingNavPanel.hide();
            floatingNavPanel.remove(navPanel);
            navPanel.setHeight(null);
            dockedNavPanel.show();
            dockedNavPanel.add(navPanel);
            tocBtn.hide();
        }
    },

    onDataloaded: function(event) {
        console.log("onDataloaded");
        if(!this.settignsLoaded || !this.scoTreeLoaded){
            return;
        }

        var me = this,
            useBookmark,
            tracking = Player.settings.get('tracking'),
            bookmarkPage = false,
            st = Ext.getStore("ScoTreeStore"),
            dc,
            nl = me.getToc();

        // Get Total count because store won't do it automatically
        try{
            me.totalCount = st.getProxy().getReader().rawData.total;
        }catch(e){
            me.totalCount = false;
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~STORE NOT LOADED YET");
        }

        // Set data store to nested list
        // Setting the store here fixes the problem with non-toc items showing up first
        nl.setStore(st);

        // Bookmarking
        useBookmark = (tracking !== 'none' && tracking !== undefined);


        try{
            dc = SCORM.GetDataChunk();
        }catch(e){
            console.log("Session Error:"+e);
        }

        if(useBookmark && dc){
            me.recoverSession(dc);
        }

        try{
            bookmarkPage = SCORM.GetBookmark();
        }catch(e){
            console.log("Bookmark Error:"+e);
        }

        if(useBookmark && bookmarkPage){
            me.recoverBookmark(bookmarkPage);
        }
        else{
            // Go to first page
            me.goToPage(me.getFirstLeaf(st.getRoot()));
        }

        Ext.Viewport.setMasked(false);
    },

    onLoadScoTree: function() {
        console.log("onLoadScoTree");
        this.scoTreeLoaded = true;
        //Player.app.fireEvent('dataloaded');
    },

    onShowTools: function(target) {
        if(!Ext.os.is.Phone){
            return;
        }
        Ext.getCmp('upperToolBar').show();
        Ext.getCmp('lowerToolBar').show();
        Ext.getCmp('pageInfo').show();
    },

    onHideTools: function(target) {
        if(!Ext.os.is.Phone){
            return;
        }

        Ext.getCmp('upperToolBar').hide();
        Ext.getCmp('lowerToolBar').hide();
        Ext.getCmp('pageInfo').hide();
    },

    onLockPages: function(direction, buttonDirection) {
        this.getPages().setLocked(direction);
    },

    onLockButtonDirection: function(direction) {
        var me = this;

        switch (direction) {
            case 'left':
            me.getPreviousBtn().disable();
            me.getNextBtn().enable();
            break;
            case 'right':
            me.getNextBtn().disable();
            me.getPreviousBtn().enable();
            break;
            case 'both':
            me.getPreviousBtn().disable();
            me.getNextBtn().disable();
            break;
            case 'none':
            me.getPreviousBtn().enable();
            me.getNextBtn().enable();
            break;
            default:
            me.getPreviousBtn().enable();
            me.getNextBtn().enable();
            break;
        }
    },

    onUpdatePageNumber: function(pageNum) {
        this.updatePageNumber(pageNum, this.totalCount);
    },

    hideImagePopup: function() {
        try{
            var imagePop = this.getMain().query('imagepopup')[0];
            if(imagePop){
                imagePop.hide();
            }
        }catch(e){}
    },

    goToPage: function(pageNode) {
        var me = this,
        pgs = me.getPages(),
        activeIndex = pgs.getActiveIndex(),
        oldRId, newPage;

        if (!pageNode) {
            console.log("no pageNode");
            return;
        }

        if (pageNode.get('restrictedTopicId')) {
            console.log("Restricted:" + pageNode.get('restrictedTopicId'));
            return;
        }


        try {
            oldRId = pgs.getActiveItem().getRecordId();
        } catch (e) {
            oldRId = pageNode.id;
        }

        newPage = me.createPage(pageNode);

        Player.app.fireEvent('beforePageSwitch');

        if (Ext.os.is.Phone) {
            pgs.add(newPage);
            pgs.setActiveItem(newPage);
        } else {
            if (oldRId < pageNode.id) {
                // add after current index
                pgs.insert(activeIndex + 1, newPage);

                // next
                pgs.next();
            } else if (oldRId > pageNode.id) {
                // add before current index
                pgs.insert(activeIndex, newPage);

                // previous
                pgs.previous();
            } else {
                pgs.add(newPage);
                pgs.setActiveItem(newPage);
            }
        }

        // Start insctive timer
        Player.app.fireEvent('startInactiveTime');
    },

    goToHiddenPage: function(pageNode) {
        var me = this,
        pgs = me.getPages(),
        oldRId, 
        i=0,
        currentPage = me.currentPage,
        indexOfCurrenPage = pgs.items.findIndex('id',currentPage.id),
        newPage;

        if(pageNode.get('restrictedTopicId')){
            console.log("Restricted:"+pageNode.get('restrictedTopicId'));
            return;
        }


        try{
            oldRId = pgs.getActiveItem().getRecordId();
        }catch(e){
            oldRId = pageNode.id;
        }

        newPage = me.createPage(pageNode);

        if(pgs.getAt(0).getBaseCls() == 'x-carousel-indicator'){
            i=1;
        }

        // current page in middle
        if(indexOfCurrenPage > i){
            // insert page second to last;
            pgs.insert(pgs.items.length-1, newPage);

            //delete first page;
            pgs.removeAt(i);
        }
        // current page first
        else if(indexOfCurrenPage === i){
            // insert page second to last;
            pgs.insert(pgs.items.length-1, newPage);
        }
        // current page last
        else if (indexOfCurrenPage === pgs.items.length-1){
            // insert page second to last;
            pgs.add(newPage);

            //delete first page;
            pgs.removeAt(i);
        }


        //pgs.add(newPage);


        if(oldRId < pageNode.id){
            pgs.animateActiveItem(newPage,{ type: 'slide', direction: 'left'});
        }
        else if(oldRId > pageNode.id){
            pgs.animateActiveItem(newPage,{ type: 'slide', direction: 'right'});
        }
        else{
            pgs.setActiveItem(newPage);    
        }

        // Start insctive timer
        Player.app.fireEvent('startInactiveTime');
    },

    selectNodeInToc: function(pageNode) {
        var me = this,
        index = -1,
        nodeList = pageNode.parentNode.childNodes,
        ln = nodeList.length,
        domlist = me.getToc().getActiveItem().getViewItems(),
        i, tempNode;

        // loop through parent node find index of toc entries only
        for (i = 0; i < ln; i++) {
            tempNode = nodeList[i];
            if(tempNode == pageNode){
                index++;
                break;
            }
            else if(tempNode.get('isTocEntry') || !tempNode.isLeaf()){
                index++;
            }
        }

        // mark all as not selected except index
        for (i = 0,ln = domlist.length; i < ln; i++) {
            if (index == i) {
                domlist[i].className = "x-list-item x-item-selected";
            } else {
                domlist[i].className = "x-list-item";
            }
        }
    },

        createPage: function(pageNode) {
        var newPage;
        var pType = pageNode.data.pType.replace(/ /g,'');

        console.log("PType:"+pType);
        if(pType == 'ExternalSWFdefault' || 
            pType == 'CustomContent'){
            pType = 'CustomHTML5Page';
        }
        try{
            console.log("Page:"+pType);
            newPage = Ext.create('Player.page.'+pType, {
                pageData:pageNode.raw,
                recordId:pageNode.id
            });
        }catch(e){
            try{
                console.log("Custom:"+pType);
                newPage = Ext.create('Player.page.custom.'+pType, {
                    pageData:pageNode.raw,
                    recordId:pageNode.id
                }); 
            }catch(e){
                console.log("default text.("+pType+")"+e);
                var altPType = 'CustomHTML5Page';
                newPage = Ext.create('Player.page.'+altPType, {
                    pageData:pageNode.raw,
                    recordId:pageNode.id
                });
            }
        }

        return newPage;
    },

    getNextPage: function(node) {
        var me = this,
        result;
        if(node && node.nextSibling){
            if(node.nextSibling.isLeaf()){
                return node.nextSibling;
            }
            else{
                result = me.getFirstLeaf(node.nextSibling);
                if(result){
                    return result;
                }
                return me.getNextPage(node.nextSibling);    
            }
        }
        else if(node){
            return me.getNextPage(node.parentNode);
        }
        return null;
    },

    getFirstLeaf: function(node) {
        var me = this,
        result,
        numNodes = node.childNodes.length,
        childNode,
        i=0;

        for(i=0; i<numNodes; i++){
            childNode=node.childNodes[i];
            if(childNode.isLeaf()){
                return childNode;
            }
            else{
                result  = me.getFirstLeaf(childNode);
                if(result){
                    return result;
                }
            }
        }
        return null;
    },

    getPreviousPage: function(node) {
        var me = this,
        result;

        if(node && node.previousSibling){
            if(node.previousSibling.isLeaf()){
                return node.previousSibling;
            }
            else{
                result = me.getLastLeaf(node.previousSibling);
                if(result){
                    return result;
                }
                return me.getPreviousPage(node.previousSibling);    
            }

        }
        else if(node){
            return this.getPreviousPage(node.parentNode);
        }
        return null;
    },

    getLastLeaf: function(node) {
        var me = this,
        result,
        numNodes = node.childNodes.length,
        childNode, i;

        for(i=numNodes-1; i>=0; i--){
            childNode=node.childNodes[i];
            if(childNode.isLeaf()){
                return childNode;
            }
            else{
                result  = me.getLastLeaf(childNode);
                if(result){
                    return result;
                }
            }
        }
        return null;
    },

    updateCarousel: function(pageNode) {
        console.log("updateCarousel");
        var me = this,
        carousel = me.getPages(),
        previousNode = me.getPreviousPage(pageNode),
        nextPage, previousPage, nextNode, activeItem = carousel.getActiveItem(),
        i = 0,
        testItem;

        // Add previous page if needed
        if (previousNode) {
            /* a little faster than calling createPage
            previousPage = Ext.create('Player.page.'+previousNode.get('pType').replace(/ /g,''), {
            pageData:previousNode.raw,
            recordId:previousNode.id
            });
            // */
            previousPage = me.createPage(previousNode);
            if (carousel.getIndicator()) {
                carousel.insert(1, previousPage);
            } else {
                carousel.insert(0, previousPage);
            }
            me.getPreviousBtn().enable();
        } else {
            // Deactiveate previous btn
            me.getPreviousBtn().disable();
        }

        // Add next page if needed
        if (!Player.settings.get('activateTimer') || pageNode.get('complete')) {
            nextNode = me.getNextPage(pageNode);
            if (nextNode && !nextNode.get('restrictedTopicId')) {

                /*
                nextPage = Ext.create('Player.page.'+nextNode.get('pType').replace(/ /g,''), {
                pageData:nextNode.raw,
                recordId:nextNode.id
                });
                // */
                nextPage = me.createPage(nextNode);
                //debugger;
                carousel.add(nextPage);
                me.getNextBtn().enable();
            } else {
                // Deactiveate next btn
                if (me.currentPageNode.data.pType != 'Quiz') {
                    me.getNextBtn().disable();
                }
            }
        } else {
            me.getNextBtn().disable();
        }

        // Remove all but active item
        if (carousel.getIndicator()) {
            i = 1;
        }
        // Note: container.items.length changes, so it can't be cached
        for (; i < carousel.items.length; i++) {
            testItem = carousel.getAt(i);
            if (testItem != activeItem && testItem != nextPage && testItem != previousPage) {
                carousel.remove(testItem);
                i--;
            }
        }

        carousel.refresh();
    },

    beforeActiveItemChange: function(carousel, value, oldValue, eventOpts) {
        // moved to onBeforePageSwitch
    },

    afterActiveItemChange: function(carousel, value, oldValue, eOpts) {
        console.log("afterActiveItemChange");
        var me = this,
            pageNode = me.getNodeById(value.getRecordId()),
            nl = me.getToc(),
            pageNum,
            previousPage;

        me.onLockPages('none');

        me.currentPageNode = pageNode;
        me.currentPage = value;

        // for REVIEW - make currentPage global
        currentPage = value;
        currentPage.pData = {"bookmark": pageNode.get('bookmark'),"title": pageNode.get('title')};
		//Code for Quiz Timer
		if (me.currentPageNode.data.pType == 'Quiz') {
		if(!Player.settings.get('activateTimer')== true)
		{
		Player.settings.set('activateTimer','true');
          Player.app.fireEvent('StartCountDown',pageNode);
		  me.getTimeBar().show();
        } 
		}
		else
		{
		Player.settings.set('activateTimer','false');
		me.getTimeBar().hide();
		}
		//Code for Quiz Timer

        // End old page
        // MOVED TO BEFORE

        // Start New page
        try{
            value.start();
        }catch(e){
            console.log("START ERROR::"+e);
        }


        // Set Bookmark
        try {
            Player.app.fireEvent('SetBookmark', pageNode.get('bookmark'));
        } catch (e) {
            // nothing
        }

        // Update Narration
        if (pageNode.raw.narration) {
            if(Ext.Viewport.query('narrationpanel').length > 0){
                Ext.Viewport.query('narrationpanel')[0].setNarrationText(pageNode.raw.narration['#text']);
            }
            
            //me.getNarration().getScrollable().getScroller().scrollToTop();
            me.getNarrationBtn().enable();
        } else {
            me.getNarrationBtn().disable();
            me.closeNarration();
            //me.getNarration().hide();
        }


        // Timer
        if (Player.settings.get('activateTimer')) {
            Player.app.fireEvent('startCountDown', pageNode);
        }

        // Update Carousel Items
        if(!pageNode.raw.nonNavPage){
            me.updateCarousel(pageNode);
        }


        // Update Page data
        me.updatePageTitle(pageNode.get('title'));

        if(!pageNode.raw.nonNavPage){
            // Check total count
            if(typeof me.totalCount == 'boolean' && !me.totalCount){
                me.totalCount = Ext.getStore("ScoTreeStore").getProxy().getReader().rawData.total;
            }

            // Update page Numbering
            if(pageNode.get('pType') != 'Quiz'){
                pageNum = pageNode.data.pageNum + 1;
                me.updatePageNumber(pageNum, me.totalCount);
            }

            // Set Topic Title bar
            if (pageNode.parentNode.isRoot()) {
                me.getTopicTitle().hide();
                me.getCourseTitle().setCls('coursetitle-large');
            } else {
                me.getTopicTitle().setHtml(pageNode.parentNode.get('title'));
                me.getTopicTitle().show();
                me.getCourseTitle().setCls('coursetitle');
            }
        }


        if(pageNode.raw.isTocEntry){
            // Navigate toc to show current page
            nl.goToNode(pageNode.parentNode);

            // Select node in list
            me.selectNodeInToc(pageNode);
        }
        window.console.markTimeline("<- afterActiveItemChange");
        Ext.getCmp("contentPanel").setMasked(false);
    },

    getNodeById: function(nodeId) {
        // If I fix the quiz id I can uncomment this line.
        //pageNode = st.findRecord('id',value.getRecordId());// didn't work because quiz has id set

        st = Ext.getStore("ScoTreeStore");
        var pageNode = null;
        for(var i=0,ln = st.data.all.length;i<ln;i++){
            if(st.data.all[i].id == nodeId){
                pageNode = st.data.all[i];
                break;
            }
        }

        if(pageNode){
            return pageNode;
        }

        // Look in Hidden pages
        hp = Ext.getStore('hiddenPages');

        for(var i=0,ln = hp.data.all.length;i<ln;i++){
            if(hp.data.all[i].id == nodeId){
                pageNode = hp.data.all[i];
                break;
            }
        }

        return pageNode;
    },

    getNode: function(titleOrLinkId, type) {
        var me = this,
        node,
        st = Ext.getStore('ScoTreeStore'),
        hp = Ext.getStore('hiddenPages');

        if(type){
            if(type == 'id'){
                return me.getNodeById(titleOrLinkId);
            }
            node = st.findRecord(type,titleOrLinkId);
            if(node){
                return node;
            }
            node = hp.findRecord(type,titleOrLinkId);
            if(node){
                return node;
            }
            return false;
        }
        else{
            var i,ln = st.data.all.length, tempNode;

            for(i=0;i<ln;i++){
                tempNode =st.data.all[i];

                if(tempNode.get('title') == titleOrLinkId || tempNode.get('linkID') == titleOrLinkId){
                    return tempNode;
                }
            }

            ln = hp.data.all.length;
            for(i=0;i<ln;i++){
                tempNode =hp.data.all[i];

                if(tempNode.get('title') == titleOrLinkId || tempNode.get('linkID') == titleOrLinkId){
                    return tempNode;
                }
            }

            return false;
        }
    },

    removeAllButActive: function(container) {
        var activeItem = container.getActiveItem(),
        i=0,
        testItem;

        if(container.getAt(0).getBaseCls() == 'x-carousel-indicator'){
            i=1;
        }
        // TODO remove array should work
        // Note: container.items.length changes, so it can't be cached
        for(;i<container.items.length;i++){
            testItem = container.getAt(i);
            if(testItem != activeItem){
                container.remove(testItem);
                i--;
            }
        }
    },

    exitCourse: function(btnId) {
        var success;
        if (btnId == 'yes' || btnId == 'ok') {

            try {
                success = SCORM.Suspend();
            } catch (e) {
                console.log("Suspend: " + e);
            }

            try {
                if (Ext.os.is.Android) {
                    try {
                        parent.Mlss.app.fireEvent('closeCourse');
                    } catch (e) {
                        SCORM.SetClosed(g_projectID);
                        window.location = 'file:///android_asset/www/index.html';
                    }
                } else {
                    parent.Mlss.app.fireEvent('closeCourse');
                }
            } catch (e) {
                console.log('Failed to close the MLSS:' + e);
            }
            try {
                if (Ext.os.is.Android) {
                    success = SCORM.CloseTheCourse(window);
                } else {
                    success = SCORM.CloseIOSCourse();
                    window.close();
                }
            } catch (e) {
                console.log("Error: Could not close window.");
            }
        }

    },

    updatePageNumber: function(currentPage, totalPages) {
        var me = this,
            pageStr = Lang.PageOf;
        pageStr = pageStr.replace("{1}",currentPage).replace("{2}",totalPages);
        me.getPageNumber().setHtml(pageStr);
        if(Ext.os.is.Phone){
            me.getPageInfo().query('#pageNumber')[0].setHtml(pageStr);    
        }
    },

    updatePageTitle: function(title) {
        if(Ext.os.is.Phone){
            this.getPageInfo().query('#pageTitle')[0].setHtml(title);
        }
    },

    pageTap: function(e, b) {
        var me = this,
        noClick = function onclick(event){return false;},
        tempTarget,
        upper = Ext.getCmp('upperToolBar'),
        toggleReg = /(x-button)|(x-video)|(x-field)|(x-list-item)/i,
        toggleTools = true;

        //debugger;

        // restart inactive timer
        Player.app.fireEvent('startInactiveTime');

        if(e && e.target)
        {
            if(e.target.localName == 'a'){
                e.target.onclick = noClick;
                me.goToLink(decodeURIComponent(e.target.href));
                return;
            }
            else if(e.target.className.search(toggleReg) >= 0){
                toggleTools = false;
            }
            else{ 
                tempTarget = e.target;
                while(tempTarget.parentNode){
                    if(tempTarget.localName == 'a'){
                        e.target.onclick = noClick;
                        me.goToLink(decodeURIComponent(tempTarget.href));
                        return;
                    }
                    else if(tempTarget.className.search(toggleReg) >= 0){
                        toggleTools = false;
                        break;
                    }
                    else{
                        tempTarget = tempTarget.parentNode;
                    }
                }
            }
        }

        if(toggleTools){
            if(upper.isHidden()){
                Player.app.fireEvent('showTools');
            }
            else{
                Player.app.fireEvent('hideTools');
            }
        }

    },

    goToLink: function(link) {
        var me = this,
        functionArray1 = link.split('/'),
        func1 = functionArray1[functionArray1.length - 1],
        functionArray = func1.split(','),
        command = functionArray[0],
        pageNode,
        argument;

        switch (command) {
            case "asfunction:glossary":
            // get term
            argument = functionArray[1];

            // Hide toolbars on phone
            if(Ext.os.is.Phone){
                Player.app.fireEvent('hidetools');
            }

            Player.app.fireEvent('glossaryLinkClick', argument);

            break;
            case "asfunction:media":
            break;
            case "asfunction:accessFile":
            link = link.substr(22);
            // TODO: fix insctive timer and pdf timer
            if (pdfTime) {
                Player.app.fireEvent('startPdfTimer', pdfTime);
            }
            window.open(link, '_blank');
            break;

            case "asfunction:goToPage":
            argument = functionArray[1];
            pageNode = this.getNode(argument);
            if(!pageNode.raw.nonNavPage){
                me.goToHiddenPage(pageNode);
            }
            else{
                me.goToPage(pageNode);
            }

            break;
            default:
            window.open(link, '_blank');
            break;
        }
        return false;

    },

    addNextPage: function(pageNode) {
        var me = this,
        nextNode,
        nextPage;

        if (!Player.settings.data.activateTimer || pageNode.get('complete')) {
            nextNode = me.getNextPage(pageNode);
            if(nextNode && !nextNode.get('restrictedTopicId')){
                me.getPages().add(me.createPage(nextNode));
                me.getNextBtn().enable();
            }
            else{
                // Deactiveate next btn
                if(me.currentPageNode.data.pType != 'Quiz'){
                    me.getNextBtn().disable();
                }
            }
        } else {
            me.getNextBtn().disable();
        }
    },

    addPreviousPage: function(pageNode) {
        var me = this,
        previousNode = me.getPreviousPage(pageNode),
        previousPage,
        pgs = me.getPages();

        if (previousNode) {
            previousPage = me.createPage(previousNode);
            if (pgs.getIndicator()) {
                pgs.insert(1, previousPage);
            } else {
                pgs.insert(0, previousPage);
            }

            me.getPreviousBtn().enable();
        } else {
            // Deactiveate previous btn
            me.getPreviousBtn().disable();
        }
    },

    onLoadSettings: function(settings) {
        console.log("onLoadSettings");
        var me = this,
        helpStore = Ext.getStore('Helps');

        Player.settings = settings;
        me.getCourseTitle().setHtml(settings.data.title);
        window.document.title = settings.data.title;

        // Remove close from help and bar when tracking=none???debugger;
        if (settings.data.tracking == 'none' || settings.data.tracking == 'COOKIE') { // TODO:exitButton
            helpStore.removeAt(helpStore.find('title', 'Close'));
            me.getCloseBtn().hide();
        }

        // Remove phone & phone toc from help and lower bar if not phone
        if (!Ext.os.is.Phone) {
            helpStore.removeAt(helpStore.find('title', 'Phone'));
            helpStore.removeAt(helpStore.find('title', 'Table of Contents'));
            //me.getPhoneTocBtn().hide();
        }

        // Remove glossary from lower bar and help if no glossary
        if (!settings.data.glossary) {
            helpStore.removeAt(helpStore.find('title', 'Glossary'));
            me.getGlossaryBtn().hide();
        }

        // Remove narration fromlower bar and help if no narration
        if (!settings.data.narration) {
            helpStore.removeAt(helpStore.find('title', 'Narration'));
            me.getNarrationBtn().hide();
        }

        // Remove narration fromlower bar and help if no narration
        if (!settings.data.activateTimer) {
            //helpStore.removeAt(helpStore.find('title', 'Narration'));
            me.getTimeBar().hide();
        }
        else{
            me.getTimeBar().show();
        }

        //pageNumbering
        if (!settings.data.pageNumbering) {
            me.getPageNumber().hide();
        }


        Player.app.fireEvent('loadscorm');



        // Fire data loaded
        me.settignsLoaded = true;
        Player.app.fireEvent('dataloaded');



        // show help or not
        if(Player.settings.get('showHelpOnStart') && _GET.showHelp != '0'){
            Player.app.fireEvent('showTools');
            Ext.defer(function() {
             me.onHelpBtnTap();
            }, 400);
        }
        // Show TOC first
        else if(Player.settings.get('showTocFirst') && Ext.os.is.Phone){
            me.getContent().setScreen('toc');
        }
        // shwo tools
        else{
            Player.app.fireEvent('showTools');
        }


    },

    init: function(application) {
        console.log("init");
        setTimeout(function(){
            // Hide the address bar!
            window.scrollTo(0, 1);
        }, 0);

        var me = this;

        // Remove Loading animation in index.html
        try{
            //document.body.removeChild(document.getElementById("loadingstuff"));
            document.getElementById("loadingstuff").style.setProperty('visibility', 'hidden')
            //debugger;
        }catch(e){
        }
        // Set Viewport Loading
        Ext.Viewport.setMasked({xtype: "loadmask", message: Lang.Loading});


        // Url settings
        // HELP
        if(typeof _GET == 'undefined'){
            _GET = {};
            _GET.showHelp = '1';
        }

        // Phone
        if(_GET.isPhone == '1' || _GET.isPhone == 'true'){
            Ext.os.is.Phone = true;
        }

        if(typeof autoHideToc == 'undefined'){
            autoHideToc = false;
        }
        if(typeof g_projectID == 'undefined'){
            g_projectID = 0;
        }


        // set util variables
        me.firstOrientation = true;

        me.settignsLoaded = false;
        me.scoTreeLoaded = false;

        // Load settings
        var sst = Ext.ModelManager.getModel('Player.model.ScoSetting');
        sst.load(0, {
            scope: me,
            success: me.onLoadSettings
        });
        this.getApplication().on([
        { event: 'pageComplete', fn: this.onPageComplete, scope: this },
        { event: 'beforePageSwitch', fn: this.onBeforePageSwitch, scope: this },
        { event: 'orientationchange', fn: this.onOrientationChange, scope: this },
        { event: 'dataloaded', fn: this.onDataloaded, scope: this },
        { event: 'loadScoTree', fn: this.onLoadScoTree, scope: this },
        { event: 'showTools', fn: this.onShowTools, scope: this },
        { event: 'hideTools', fn: this.onHideTools, scope: this },
        { event: 'lockPages', fn: this.onLockPages, scope: this },
        { event: 'lockButtonDirection', fn: this.onLockButtonDirection, scope: this },
        { event: 'updatePageNumber', fn: this.onUpdatePageNumber, scope: this }
        ]);

    },

    launch: function() {
        console.log("launch");
        var me = this;

        Player.app.fireEvent('orientationchange', Ext.Viewport.getOrientation());

        // Set tap handler for <a> links and show/ hide tools
        me.getPages().element.on('tap', me.pageTap, me);
        me.getPages().on('activeitemchange', me.beforeActiveItemChange, me, {}, 'before');
        me.getPages().on('activeitemchange', me.afterActiveItemChange, me, {}, 'after');


        me.onLockPages('none');
    },

    recoverBookmark: function(bookmark) {
        var me = this,
        st = Ext.getStore('ScoTreeStore'),
        allNodes = st.getData().all,
        i=0, ln = allNodes.length,
        tempNode, bm = ''
        ;

        for(;i<ln;i++){
            tempNode = allNodes[i];
            bm = tempNode.get('bookmark');
            if(bm == bookmark){
                me.goToPage(tempNode);
                break;
            }
        }
    },

    recoverSession: function(chunk) {
        var me = this,
        st = Ext.getStore("ScoTreeStore"),
        i, ln = st.data.all.length,
        parts = chunk.substr(4).split(":"),
        pagesCompleted = parts[0].split(','),
        pagesSelectable = parts[2].split(','),
        tempNode,
        counter = 0;


        for(i=0;i<ln;i++){
            tempNode = st.data.all[i];
            if(tempNode.get("isTocEntry")){
                if(pagesCompleted[counter] == '1'){
                    tempNode.set('complete', true);
                }
                else{
                    tempNode.set('complete', false);
                }

                if(pagesSelectable[counter] == '1'){
                    tempNode.set('restrictedTopicId', false);
                }
                counter++;
            }
        }
    }

});