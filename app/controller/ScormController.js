Ext.define('Player.controller.ScormController', {
    extend: 'Ext.app.Controller',
    config: {
    },

    onSetDataChunk: function() {
        var me = this,
        courseComplete = true,
        st = Ext.getStore('ScoTreeStore'),
        dc = 'toc`',
        i=0, ln = st.getData().all.length,
        tempNode;

        me.completedPages = [];
        me.selectablePage = [];

        for(;i<ln;i++){
            tempNode = st.getData().all[i];
            if(tempNode.get("isTocEntry")){
                //console.log("~title:"+tempNode.get("title")+" toc:"+tempNode.get("isTocEntry")+" type:"+(typeof tempNode.get("isTocEntry")));
                me.generateDataChunk(tempNode);
            }

        }

        dc += me.completedPages.join(",")+":0:"+me.selectablePage.join(",");

        SCORM.SetDataChunk(dc);
    },

    SetDataChunk: function(chunk) {
        //console.log('Chunk:'+chunk);
    },

    generateDataChunk: function(record) {
        var me = this;

        if(record.isLeaf()){
            if(record.get('complete')){
                me.completedPages.push('1');
            }
            else{
                me.completedPages.push('0');
            }

            if(record.get('restrictedTopicId')){
                me.selectablePage.push('0');
            }
            else{
                me.selectablePage.push('1');
            }

        }
    },

    GetDataChunk: function() {
        return false;
    },

    onSetBookmark: function(bookmark) {

        SCORM.SetBookmark(bookmark);
    },

    SetBookmark: function(bookmark) {
        //console.log("BookMark:"+bookmark);
    },

    GetBookmark: function() {
        return false;
        //return 'swfs/templateswfs/rapidintake_textimage/ri_textimage_pg.swf|3';
    },

    RecordMultipleChoiceInteraction: function(strID, response, blnCorrect, correctResponse, strDescription, intWeighting, intLatency, strLearningObjectiveID) {
        
        var temp = {};
        temp.strID = strID;
        temp.response = response;
        temp.blnCorrect = blnCorrect;
        temp.correctResponse = correctResponse;
        temp.strDescription = strDescription;
        temp.intWeighting = intWeighting;
        temp.intLatency = intLatency;
        temp.strLearningObjectiveID = strLearningObjectiveID;

        console.log("RecordMultipleChoiceInteraction:"+JSON.stringify(temp));
        /*
        console.log("strID:"+strID);
        console.log("response:"+response);
        console.log("blnCorrect:"+blnCorrect);
        console.log("correctResponse:"+correctResponse);
        console.log("strDescription:"+strDescription);
        console.log("intWeighting:"+intWeighting);
        console.log("intLatency:"+intLatency);
        console.log("strLearningObjectiveID:"+strLearningObjectiveID);
        //*/
    },

    init: function(application) {

        this.getApplication().on([
        { event: 'SetDataChunk', fn: this.onSetDataChunk, scope: this },
        { event: 'SetBookmark', fn: this.onSetBookmark, scope: this },
        { event: 'loadscorm', fn: this.onLoadscorm, scope: this }
        ]);

    },

    launch: function() {
        SCORM = this;
    },

    CreateResponseIdentifier: function(shortVar, longVar){
        var temp = {};
        temp.Short = shortVar;
        temp.Long = longVar;
        return temp;
    },

    onLoadscorm: function() {
        var me = this,
        settings = Player.settings.data,
        tracking = settings.tracking;

        if(g_projectID === 0){
            g_projectID = settings.projectId;
        }

        if(tracking != 'none' && tracking !== undefined){
            if(tracking == 'COOKIE' || tracking == 'MLSS'){
                SCORM = SCORM_db;
            }
            else{
                SCORM = parent.opener;
            }
        }

        if(SCORM === null || SCORM === undefined){
            alert(Lang.Scorm_Load_Error);
        }
    }

});