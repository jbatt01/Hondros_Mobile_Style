Ext.define('Player.view.TableOfContents', {
    extend: 'Ext.dataview.NestedList',
    alias: 'widget.tableofcontents',

    config: {
        ui: 'light',
        width: 250,
        autoDestroy: false,
        displayField: 'title',
        title: Lang.Table_Of_Contents,
        useTitleAsBackText: false,
        toolbar: {
            xtype: 'titlebar',
            items: [
                {
                    xtype: 'button',
                    hidden: true,
                    itemId: 'closeToc',
                    ui: 'round',
                    text: Lang.Close,
                    action: 'showtoc',
                    align: 'right'
                }
            ]
        }
    },
	//Changed Code
	onItemTap : function(list, index, target, record, e) {
				
	 if(record.data.leaf != true && record.data.complete != true && record.data.restrictedTopicId !== false)
	  {
      
	  }
	  else
	  {
		    this.callParent(arguments); //call Ext.dataview.NestedList's onItemTap method
	  }
		
    },
	//Changed Code
	

    setActiveItem: function(list) {
        var me = this,
        store;

        if (list.store) {
            store = list.store;

        } else {
            try {
                store = list.getStore();
            } catch (e) {}
            }

            if (store) {
                var removeitems = [];
                for (var i = 0, ln = store.data.all.length; i < ln; i++) {
                    if (!store.data.all[i].data.isTocEntry && store.data.all[i].isLeaf()) {
                        removeitems.push(store.data.all[i]);
                    }
                }
                store.remove(removeitems);
            }

            try{
                MathJax.Hub.PreProcess(me.element.dom);
                MathJax.Hub.Process(me.element.dom);
            }catch(e){}

                return me.callParent(arguments);
    },

    getItemTextTpl: function(node) {
        var checkIcon = 'resources/img/check02-12.png';
        return  '<tpl if="leaf !=  true && restrictedTopicId === false">'+
        '<div style="width:202px; font-weight: bold; ">{title}</div><div style="position:absolute; right:0; top:25%; margin: 4px;"><img src="resources/img/tocArrow-02.png"/></div></div>'+
        '</tpl>'+
        '<tpl if="leaf === true && complete != true && restrictedTopicId !== false">'+
        '<span  class="tocLabelDisabled">{title}</span>'+
        '</tpl>'+
		'<tpl if="leaf != true && complete != true && restrictedTopicId !== false">'+
        '<div style="border:0px;text-align:left;font-size:96%;font-weight: bold">{title}</div>'+
        '</tpl>'+
        '<tpl if="leaf === true && complete != true && restrictedTopicId === false">'+
        '<span  class="tocLabel">{title}</span>'+
        '</tpl>'+
        '<tpl if="complete === true && leaf ===  true">'+
        '<div id="page_{pageId}"><img src="'+checkIcon+'" style="width: 17px; height:19px; padding-top: 4px; padding-right: 4px;" /><span  class="tocLabel">{title}</span></div>'+
        '</tpl>';
    }

});