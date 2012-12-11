Ext.define('Player.page.components.TextImage', {
    extend: 'Ext.Panel',

    alias: ['widget.textimage'],

    config: {
        styleHtmlContent: true,
        html: '',
        layout: 'fit',
        pageData: {}
    },

    applyPageData: function(config) {
        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        if(!newPageData.pType){
            return;
        }
        //debugger;
        var me = this,
            imageHtml, fullHtml = "",
            useAltContent = false,
            iconType = 'zoom',
            zoomImage = true,
            pText = '',
            imageWidth= '40',
            imageFile, imagePos;


        try{
            useAltContent = !Ext.getStore('SupportedPages').findRecord('pType', newPageData.pType, 0, false, true, true).get('supported');
        }catch(e){
            console.log("alt Error:"+e);
        }

        // ALT MOBILE CONTENT
        if(useAltContent){
            if(newPageData.altMobileContent && newPageData.altMobileContent.altPText){
                pText = newPageData.altMobileContent.altPText['#text'];   
            }
            if(newPageData.altMobileContent && newPageData.altMobileContent.altImageFile){
                imageFile = newPageData.altMobileContent.altImageFile;
            }
            if(newPageData.altMobileContent && newPageData.altMobileContent.altImgPos){
                imagePos = newPageData.altMobileContent.altImgPos;
            }
            if(newPageData.altMobileContent && newPageData.altMobileContent.altImageWidth){
                imageWidth = newPageData.altMobileContent.altImageWidth;
            }
        }
        else{
            if (newPageData.pText) {
                pText = newPageData.pText['#text'];
            }
            if(newPageData.imageFile){
                imageFile = newPageData.imageFile;
            }
            if(newPageData.imgPos){
                imagePos = newPageData.imgPos;
            }
            if(newPageData.imageWidth){
                imageWidth = newPageData.imageWidth;
            }
        }

        // assume percent width
        if(typeof imageWidth == 'number'){
            imageWidth += '%';
        }else if(imageWidth.match(/\d$/).length > 0){
            imageWidth += '%';
        }

        if (imageFile) {
            if(newPageData.pType.search("Link") >= 0){
                iconType = 'link';
            }

            var extention = imageFile.split('.').pop().toLowerCase(),
                imageDivStyle = 'width: ' + imageWidth + ';',
                imageDirection = 'left',
                zoomId = 'zoom_' + me.id;

            // Create Image ,
            /*newImg = new Image()
            newImg.id = 'img_' + me.id;
            newImg.src = imageFile;
            newImg.className = 'img_'+extention;
            newImg.style.setProperty('width', '100%');
            newImg.onload = me.onImageLoad.call(me, newImg);
            newImg.ondragstart = function(e){return false;};*/

            // Get Image Position
            if(imagePos){
                if (imagePos.search(/left/i) >= 0) {
                    imageDirection = 'left';
                } else if (imagePos.search(/right/i) >= 0) {
                    imageDirection = 'right';
                } else if (imagePos.search(/bottom/i) >= 0) {
                    imageDirection = 'bottom';
                } else {
                    imageDirection = 'center';
                }
            }
            else{
                imageDirection = 'left';
            }

            // Put Image and Text Together
            imageHtml = '<div class="imagecontainer '+imageDirection+'image" style="' + imageDivStyle + '">';
            imageHtml += '<img src="'+imageFile+'" id="img_'+me.id+'" class="img_'+extention+'" style="width:100%"/>';
            switch(imageDirection){
                case 'left':
                case 'right':
                    imageDivStyle += ' margin-right: 14px; padding-right: 12px; float:'+imageDirection+';';
                    imageHtml = '<div class="imagecontainer '+imageDirection+'image" style="' + imageDivStyle + '">';
                    imageHtml += '<img src="'+imageFile+'" id="img_'+me.id+'" class="img_'+extention+'" style="width:100%"/>';
                    if (zoomImage) {
                        imageHtml += '<div id="' + zoomId + '" class="imageicon '+iconType+'"></div>';
                    }
                    imageHtml += "</div>";
                    fullHtml = imageHtml + pText;
                    break;
                case 'bottom':
                    imageHtml = '<center>'+imageHtml;
                    if (zoomImage) {
                        imageHtml += '<div id="' + zoomId + '" class="imageicon '+iconType+'"></div>';
                    }
                    imageHtml += "</div></center>";
                    fullHtml = pText + imageHtml;
                    break;
                case 'center':
                    imageHtml = '<center>'+imageHtml;
                    if (zoomImage) {
                        imageHtml += '<div id="' + zoomId + '" class="imageicon '+iconType+'"></div>';
                    }
                    imageHtml += "</div></center>";
                    fullHtml = imageHtml + pText;
                    break;
            }
        }
        else{
           fullHtml = pText; 
        }
        // Apply Text
        me.setHtml(fullHtml);

        // Add Image to "imagecontainer"
        /*if(newImg){
            var innerNode = me.innerElement.dom.getElementsByClassName('imagecontainer')[0];
            innerNode.insertBefore(newImg, innerNode.firstChild);
        }*/
        
    },

    onImageLoad: function(e){
        console.log("~~~ImageLoaded....");
    },

    imageTapHandler: function(e) {
        if (e && e.target && (e.target.id == 'img_' + this.id || e.target.id == 'zoom_' + this.id)) {
            e.stopPropagation();
            this.fireEvent('imagetap');
        }
    },

    repositionZoomImage: function() {
        try {
            var me = this,
                zoomId = 'zoom_' + me.id,
                imId = 'img_' + me.id,
                zoo = document.getElementById(zoomId),
                im = document.getElementById(imId);
            if (im.complete) {
                zoo.setAttribute("style", "left:" + (im.width+im.offsetLeft-zoo.clientWidth) + "px;top:" + (im.height+im.offsetTop-zoo.clientHeight+1) + "px");
            } else {
                setTimeout(function() {
                    me.repositionZoomImage.call(me);
                }, 300);
            }
        } catch (e) {}
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
        me.element.on('tap', me.imageTapHandler, me);
        me.on('painted', me.repositionZoomImage, me);
    },
    start: function() {
        if (!Player.settings.data.activateTimer) {
            Player.app.fireEvent('pageComplete');
        }
    }
});
