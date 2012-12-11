Ext.define('Player.page.components.ImagePopup', {
    extend: 'Ext.Base',

    mixinConfig: {
        id: 'imagepopupmixin'
    },

    requires: ['Player.view.ImagePopup'],   

    config: {
        imagePopupData: {},
        imagePopup: {
            xtype: 'imagepopup',
            hideAnimation: 'popOut',
            showAnimation: 'popIn'
        }
    },

    updateImagePopupData: function(newPopupData, oldPopupData){
        if(!newPopupData.pType){
            return;
        }
        var me = this,
            imagePopup = me.getImagePopup(),
            st = Ext.getStore('SupportedPages'),
            useAltContent = false,
            imageFile, capHead, capText;

        try{
            useAltContent = !st.findRecord('pType', newPopupData.pType, 0, false, true, true).get('supported');
        }catch(e){}

        if(useAltContent){
            if(newPopupData.altMobileContent && newPopupData.altMobileContent.altImageFile){
                imageFile = newPopupData.altMobileContent.altImageFile;
            }
            capHead = '';
            capText = '';
        }
        else{
            if(newPopupData.imageFile){
                imageFile = newPopupData.imageFile;
            }
            capHead = newPopupData.captionhead;
            capText = newPopupData.captiontext;
        }


        if(imageFile){
            imagePopup.setImageFile(imageFile);
        }
        else{
            imagePopup.setHtml("No Image File");
        }

        if(capHead || capText){
            imagePopup.setCaptionHead(capHead);
            imagePopup.setCaptionText(capText);
        }

        me.isResized = false;

        try{
            MathJax.Hub.PreProcess(me.element.dom);
            MathJax.Hub.Process(me.element.dom);
        }catch(e){}
    },


    applyImagePopup: function(config) {
        return Ext.factory(config, Player.view.ImagePopup, this.getImagePopup());
    },

    updateImagePopup: function(newPopup, oldPopup) {
        if (newPopup) {
            var me = this;
            newPopup.on('close', me.closeImagePopup, me);
        } else if (oldPopup) {
            oldPopup.destroy();
        }
    },
    closeImagePopup: function() {
        this.getImagePopup().hide();
    },

    showImagePopup: function(){
        var me = this;
        if(!me.isResized){
            var newImg = new Image();
            newImg.src = me.getImagePopupData().imageFile;
            newImg.onload = me.resizePopup.call(me, newImg);
        }

        me.getImagePopup().show();
        me.resizeScroller();
    },

    resizePopup: function(img) {
        var me = this,
            imgHeight = img.height,
            imgWidth = img.width,
            popWidth = 200,
            popHeight = 400,
            captionHeight = 0,
            imagePopup = me.getImagePopup();

        if(imagePopup.getCaptionText() || imagePopup.getCaptionHead()){
            captionHeight = 60;
        }
        

        if (imgWidth < 200) {
            popWidth = 200;
        } else if (imgWidth > me.element.dom.clientWidth * 0.9) {
            popWidth = me.element.dom.clientWidth * 0.9;
        } else {
            popWidth = imgWidth + 10;
        }

        if (imgHeight < 200) {
            popHeight = 200 + captionHeight;
        } else if (imgHeight > me.element.dom.clientHeight * 0.9) {
            popHeight = me.element.dom.clientHeight * 0.9;
        } else {
            popHeight = imgHeight + 10 + captionHeight;
        }
        
        imagePopup.setWidth(popWidth);
        imagePopup.setHeight(popHeight);

        me.isResized = true;

    },
    resizeScroller: function(){
        var me = this,
            scb = me.getImagePopup().getScrollable(),
            imageSize = scb.getScroller().getSize(),
            containerSize = scb.getScroller().getContainerSize(),
            ind = scb.getIndicators();

        if(imageSize.x > containerSize.x){
            ind.x.show();
        }
        if(imageSize.y > containerSize.y){
            ind.y.show();
        }
    },

    initializePopup: function() {
        var me = this;
        //I have to add to main so it will show up and won't scroll the page or carousel
        Ext.getCmp('main').add(me.getImagePopup());
    },
    deinitializePopup: function(){
        var me = this;
        Ext.getCmp('main').remove(me.getImagePopup());
    }
});
