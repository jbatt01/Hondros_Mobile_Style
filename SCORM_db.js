var g_sessiontime = 0;
db = openDatabase("scorm", "0.1", "Fake SCORM data.", 200000);
if(!db){
    alert("Failed to connect to database.");
}
else{
    try{
        // Get datachunk now
        db.transaction(
            function(tx) {
                tx.executeSql("SELECT scorm.data FROM scorm WHERE id = ?", ['courseId'], 
                    function(tx, result) {
                        for(var i = 0; i < result.rows.length; i++) {
                            g_projectID = result.rows.item(i)['data'];
                        }
                }, sql_error)
            }
        );
    }catch(e){
        console.log("Project Id not found");
    }
    
    
    
    g_strID = new Array();
    g_typeId = new Array();
    g_obj = new Array();
    
    // Main Scorm Table
    db.transaction(
        function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS scorm (id TEXT, type TEXT, quizid TEXT DEFAULT NULL, questionid TEXT DEFAULT NULL, data TEXT, timestamp REAL, PRIMARY KEY (id, type, quizid, questionid))", [], 
                function(result){
                }, sql_error
             );
        }
    );
    
    
    // Get datachunk now
    db.transaction(
        function(tx) {
            
            tx.executeSql("SELECT scorm.data FROM scorm WHERE id = ? AND type = ?", [g_projectID, 'datachunk'], 
                function(tx, result) {
                    for(var i = 0; i < result.rows.length; i++) {
                        g_chunk = result.rows.item(i)['data'];
                    }
            }, sql_error)
        }
    );
    // Get bookmark now
    db.transaction(
        function(tx) {
            tx.executeSql("SELECT scorm.data FROM scorm WHERE id = ? AND type = ?", [g_projectID, 'bookmark'], 
                function(tx, result) {
                    for(var i = 0; i < result.rows.length; i++) {
                        g_result = result.rows.item(i)['data'];
                    }
            }, sql_error)
        }
    );
    // Get Score now
    db.transaction(
        function(tx) {
            tx.executeSql("SELECT scorm.data FROM scorm WHERE id = ? AND type = ?", [g_projectID, 'intScore'], 
                function(tx, result) {
                    for(var i = 0; i < result.rows.length; i++) {
                        g_intScore = result.rows.item(i)['data'];
                    }
            }, sql_error)
        }
    );
    // Get status now
    db.transaction(
        function(tx) {
            tx.executeSql("SELECT scorm.data FROM scorm WHERE id = ? AND type = ?", [g_projectID, 'status'], 
                function(tx, result) {
                    for(var i = 0; i < result.rows.length; i++) {
                        g_status = result.rows.item(i)['data'];
                    }
            }, sql_error)
        }
    );
    
    // Get session time now
    db.transaction(
        function(tx) {
            tx.executeSql("SELECT scorm.data FROM scorm WHERE id = ? AND type = ?", [g_projectID, 'sessiontime'], 
                function(tx, result) {
                    for(var i = 0; i < result.rows.length; i++) {
                        g_sessiontime = parseInt(result.rows.item(i)['data']);
                    }
            }, sql_error)
        }
    );
}





SCORM_db = {
    SetClosed: function(courseid){
        var cid = courseid;
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID, 'closed', '', '', g_projectID, new Date().getTime()], null, sql_error);
            }
        );
    },
    GetClosed: function(){
        
    },
    SetBookmark: function(mark){
        g_mark = mark;
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID, 'bookmark', '', '', g_mark, new Date().getTime()], null, sql_error);
            }
        );
    },
    GetBookmark: function(){
        return g_result;
    },
    SetDataChunk: function(chunk){
        g_chunk = chunk;
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID,'datachunk', '', '', g_chunk, new Date().getTime()], null, sql_error);
            }
        );
    },
    GetDataChunk: function(){
        return g_chunk;
    },
    
    SetScore: function(intScore, intMaxScore, intMinScore){
        g_intScore = intScore;
        g_intMaxScore = intMaxScore;
        g_intMinScore = intMinScore;
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID, 'intScore', '', '', g_intScore, new Date().getTime()], null, sql_error);
            }
        );
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID, 'intMaxScore', '', '', g_intMaxScore, new Date().getTime()], null, sql_error);
            }
        );
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID, 'intMinScore', '', '', g_intMinScore, new Date().getTime()], null, sql_error);
            }
        );
    },
    GetScore: function(){
        return g_intScore;
    },
    
    RecordTrueFalseInteraction: function(strID, response, blnCorrect, correctResponse, strDescription, intWeighting, intLatency, strLearningObjectiveID){
        g_strID.push(strID);
        g_typeId.push('RecordTrueFalseInteraction');
        g_obj.push('{'+
                '"strID": "'+strID+'", '+
                '"response": "'+response+'", '+
                '"blnCorrect": "'+blnCorrect+'", '+
                '"correctResponse": "'+correctResponse+'", '+
                '"strDescription": "'+strDescription+'", '+
                '"intWeighting": "'+intWeighting+'", '+
                '"intLatency": "'+intLatency+'", '+
                '"strLearningObjectiveID": "'+strLearningObjectiveID+
            '"}');
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID, g_typeId.splice(0, 1), '', g_strID.splice(0, 1), g_obj.splice(0, 1), new Date().getTime()], null, sql_error);
            }
        );
    },
    
    RecordMultipleChoiceInteraction: function(strID, response, blnCorrect, correctResponse, strDescription, intWeighting, intLatency, strLearningObjectiveID){
        g_strID.push(strID);
        g_typeId.push('RecordMultipleChoiceInteraction');
        g_obj.push('{'+
                '"strID": "'+strID+'", '+
                '"response": "'+response+'", '+
                '"blnCorrect": "'+blnCorrect+'", '+
                '"correctResponse": "'+correctResponse+'", '+
                '"strDescription": "'+strDescription+'", '+
                '"intWeighting": "'+intWeighting+'", '+
                '"intLatency": "'+intLatency+'", '+
                '"strLearningObjectiveID": "'+strLearningObjectiveID+
            '"}');
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID, g_typeId.splice(0, 1), '', g_strID.splice(0, 1), g_obj.splice(0, 1), new Date().getTime()], null, sql_error);
            }
        );
    },
    // TIME
    SetSessionTime: function(time){
        g_time = time;
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID, 'sessiontime', '', '', g_time, new Date().getTime()], null, sql_error);
            }
        );
    },
    GetSessionTime: function(){
        return g_sessiontime;
    },
    // Status
    SetStatus: function(status){
        g_status = status;
        db.transaction(
            function(tx) {
                tx.executeSql("INSERT OR REPLACE INTO scorm (id, type, quizid, questionid, data, timestamp) values(?, ?, ?, ?, ?, ?)", [g_projectID, 'status', '', '', g_status, new Date().getTime()], null, sql_error);
            }
        );
    },
    GetStatus: function(){
        return g_status;
    },
    SetPassed: function(){
        this.SetStatus("passed");
    },
    SetFailed: function(){
        this.SetStatus("failed");
    },
    ResetStatus: function(){
        this.SetStatus("incomplete");
    },
    SetReachedEnd: function(){
        this.SetStatus("completed");
    },
    
    // Debug
    WriteToDebug: function(debug){
        console.log("DEBUG:"+debug);
    },
    
    GetStudentID: function(){
        
        return 'STUDENT_ID';
    },
    GetStudentName: function(){
        return 'LAST_NAME, FIRST_NAME';
    },

    CreateResponseIdentifier: function(shortVar, longVar){
        var temp = {};
        temp.Short = shortVar;
        temp.Long = longVar;
        return temp;
    },

    
    
    ClearTable: function(){
        db.transaction(
            function(tx) {
                tx.executeSql("DROP TABLE scorm", [], 
                     function(result){
                         console.log('Successfully cleared table. You must restart course.');
                     }, sql_error
                );
             }
        );
    }
};

function sql_error(tx, error){
    console.log("SQL Error("+error.code+"): "+error.message);
}

