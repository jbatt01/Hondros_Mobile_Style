
Ext.define('Player.model.Question', {
    extend: 'Ext.data.Model',
    alias: 'model.question',
    config: {
        fields: [
            {
                name: 'qtype'
            },
            {
                mapping: 'id',
                name: 'strID',
                type: 'string'
            },
            {
                mapping: 'qtype',
                name: 'trackingType',
                type: 'string'
            },
            {
                defaultValue: false,
                name: 'complete',
                type: 'boolean'
            },
            {
                name: 'response',
                type: 'auto'
            },
            {
                name: 'blnCorrect',
                type: 'boolean'
            },
            {
                name: 'correctResponse',
                type: 'auto'
            },
            {
                mapping: 'questionText[\'#text\']',
                name: 'strDescription',
                type: 'string'
            },
            {
                defaultValue: 1,
                mapping: 'weight',
                name: 'intWeighting',
                type: 'int'
            },
            {
                name: 'intLatency',
                type: 'int'
            },
            {
                mapping: 'objectiveID',
                name: 'strLearningObjectiveID',
                type: 'string'
            },
            {
                defaultValue: false,
                name: 'tracking',
                type: 'boolean'
            }
        ]
    }
});