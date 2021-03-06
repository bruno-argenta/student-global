var CONSTANTS = require('../../helpers/constants.js');
var service = require('../../services/requestRest.js');
var uuid = require('node-uuid');

var connectionsPool = [];

var invalidArgumentResponse = {
    OperationStatus:3,
    Message: {
        Text:"Invalid arguments",
        Level:'ERROR',
    },
    OperationData: ''
}


exports.getUserSectionKind = function(req, res) {
    console.log('GET getSectionUserKind');
    console.log("Parameteres: " + JSON.stringify(req.body));
    var sessionToken = req.cookies.sessionToken;
    var connUUID = uuid.v1();
    connectionsPool[connUUID] = {request: req,response:res};
    var requestModel = {
        sectionName:'SectionKind',
        values: {},
        sessionToken:sessionToken,
        nextPage:''
    }
    console.log(JSON.stringify(requestModel));
    service.requestPost(requestModel,CONSTANTS.SERVICES.USER_PROFILE.GET_SECTION,response,connUUID);

};

exports.setUserSectionKind = function(req, res) {
    console.log('SET getSectionUserKind');
    console.log("Parameteres: " + JSON.stringify(req.body));
    var sessionToken = req.cookies.sessionToken;
    if ((req.body.SectionKind === undefined) || (req.body.Kind === undefined)) {
        res.status(200).jsonp(invalidArgumentResponse);
    } else {
        var connUUID = uuid.v1();
        connectionsPool[connUUID] = {request: req, response: res};
        var section = req.body.SectionKind;
        section.kind = req.body.Kind;
        var requestModel = {
            sectionName: 'SectionKind',
            values: section,
            sessionToken: sessionToken,
            nextPage: 'WIZARD_2'
        }
        console.log(JSON.stringify(requestModel));
        service.requestPost(requestModel, CONSTANTS.SERVICES.USER_PROFILE.SET_SECTION, response, connUUID);
    }

};

exports.getUserSectionBasicInfo = function(req, res) {
    console.log('SET setUserSectionBasicInfo');
    console.log("Parameteres: " + JSON.stringify(req.body));
    var sessionToken = req.cookies.sessionToken;

    var connUUID = uuid.v1();
    connectionsPool[connUUID] = {request: req,response:res};
    var requestModel = {
        sectionName:'SectionBasicInfo',
        values: {},
        sessionToken:sessionToken,
        nextPage:''
    }
    console.log(JSON.stringify(requestModel));
    service.requestPost(requestModel,CONSTANTS.SERVICES.USER_PROFILE.GET_SECTION,response,connUUID);

};

exports.setUserSectionBasicInfo = function(req, res) {
    console.log('SET setUserSectionBasicInfo');
    console.log("Parameteres: " + JSON.stringify(req.body));
    var sessionToken = req.cookies.sessionToken;

    if (req.body.SectionBasicInfo === undefined) {
        res.status(200).jsonp(invalidArgumentResponse);
    } else {
        var connUUID = uuid.v1();
        connectionsPool[connUUID] = {request: req, response: res};
        var section = req.body.SectionBasicInfo;
        if (section.BUI_Subjects != undefined){
            section.BUI_Subjects = JSON.stringify(section.BUI_Subjects);
        }
        var requestModel = {
            sectionName: 'SectionBasicInfo',
            values: section,
            sessionToken: sessionToken,
            nextPage: 'WIZARD_3'
        }
        console.log(JSON.stringify(requestModel));
        service.requestPost(requestModel, CONSTANTS.SERVICES.USER_PROFILE.SET_SECTION, response, connUUID);
    }

};

exports.getUserSectionPurpose = function(req, res) {
    console.log('SET getUserSectionPurpose');
    var sessionToken = req.cookies.sessionToken;
    var connUUID = uuid.v1();
    connectionsPool[connUUID] = {request: req,response:res, callCounter:0};
    var arraySections = [
        {section:'SectionAccademicGrowth'},
        {section:'SectionProfessionalGrowth'},
        {section:'SectionPersonalGrowth'},
        {section:'SectionMarketResearch'},
        {section:'SectionPromoting'},
        {section:'SectionResearchDevelopment'},
        {section:'SectionCareerServices'},
        {section:'SectionMarketResearch'}
    ];
    var i=0;
    for(i=0;i < 8; i++ ){
        connectionsPool[connUUID].callCounter = connectionsPool[connUUID].callCounter+1;
        var requestModel = {
            sectionName:arraySections[i].section,
            values: {},
            sessionToken:sessionToken,
            nextPage:''
        }
        service.requestPost(requestModel,CONSTANTS.SERVICES.USER_PROFILE.GET_SECTION,verifySectionPurposeEnd,connUUID);
    }

};

exports.setUserSectionPurpose = function(req, res) {
    console.log('SET setUserSectionPurpose');
    console.log("Parameteres: " + JSON.stringify(req.body));
    var sessionToken = req.cookies.sessionToken;
    var arraySections = [
        {section:'SectionAccademicGrowth',value:req.body.SectionAccademicGrowth},
        {section:'SectionProfessionalGrowth',value:req.body.SectionProfessionalGrowth},
        {section:'SectionPersonalGrowth',value:req.body.SectionPersonalGrowth},
        {section:'SectionMarketResearch',value:req.body.SectionMarketResearch},
        {section:'SectionPromoting',value:req.body.SectionPromoting},
        {section:'SectionResearchDevelopment',value:req.body.SectionResearchDevelopment},
        {section:'SectionCareerServices',value:req.body.SectionCareerServices},
        {section:'SectionMarketResearch',value:req.body.SectionCareerServices}
    ]

    if ((req.body.SectionAccademicGrowth === undefined) &&
        (req.body.SectionProfessionalGrowth === undefined) &&
        (req.body.SectionPersonalGrowth === undefined) &&
        (req.body.SectionRecruitingGrowth === undefined) &&
        (req.body.SectionMarketResearch === undefined) &&
        (req.body.SectionPromoting === undefined) &&
        (req.body.SectionResearchDevelopment === undefined) &&
        (req.body.SectionCareerServices === undefined)) {
        res.status(200).jsonp(invalidArgumentResponse);
    } else {
        var connUUID = uuid.v1();
        connectionsPool[connUUID] = {request: req, response: res, callCounter: 0};
        var i;
        for (i = 0; i < arraySections.length; i++) {
            if (arraySections[i].value != undefined) {
                connectionsPool[connUUID].callCounter = connectionsPool[connUUID].callCounter + 1;
                var section = arraySections[i].value;
                var requestModel = {
                    sectionName: arraySections[i].section,
                    values: section,
                    sessionToken: sessionToken,
                    nextPage: 'HOME'
                }
                service.requestPost(requestModel, CONSTANTS.SERVICES.USER_PROFILE.SET_SECTION, verifySectionPurposeEnd, connUUID);
            }
        }
    }

};

exports.verifySession = function(req,res,next){
    console.log('entre');
    var sessionToken = req.cookies.sessionToken;
    if (sessionToken != undefined){
        console.log('next');
        next();
    }else{console.log('403');
        res.status(403).jsonp({});
    }
}

function verifySectionPurposeEnd(statusCode,model, connUUID){
    connectionsPool[connUUID].callCounter--;
    console.log("counter decrement: "+connectionsPool[connUUID].callCounter );
    if (statusCode != 200) {
        var connection = connectionsPool[connUUID];
        delete connectionsPool[connUUID];
        var res = connection.response;
        res.status(statusCode).jsonp(model);
    }else{
        if (connectionsPool[connUUID].responseModel === undefined){
            connectionsPool[connUUID].responseModel = {};
        }
        var object = model.OperationData;
        if (object.section != undefined){
            if ( object.section.sectionName === 'SectionAccademicGrowth'){
                connectionsPool[connUUID].responseModel.SectionAccademicGrowth =  object.section.values;
            }
            if ( object.section.sectionName === 'SectionProfessionalGrowth'){
                connectionsPool[connUUID].responseModel.SectionProfessionalGrowth =  object.section.values;
            }
            if ( object.section.sectionName === 'SectionPersonalGrowth'){
                connectionsPool[connUUID].responseModel.SectionPersonalGrowth =  object.section.values;
            }
            if ( object.section.sectionName === 'SectionMarketResearch'){
                connectionsPool[connUUID].responseModel.SectionMarketResearch =  object.section.values;
            }
            if ( object.section.sectionName === 'SectionPromoting'){
                connectionsPool[connUUID].responseModel.SectionPromoting =  object.section.values;
            }
            if ( object.section.sectionName === 'SectionResearchDevelopment'){
                connectionsPool[connUUID].responseModel.SectionResearchDevelopment =  object.section.values;
            }
            if ( object.section.sectionName === 'SectionCareerServices'){
                connectionsPool[connUUID].responseModel.SectionCareerServices =  object.section.values;
            }
            if ( object.section.sectionName === 'SectionCareerServices'){
                connectionsPool[connUUID].responseModel.SectionCareerServices =  object.section.values;
            }
        }
        model.OperationData = connectionsPool[connUUID].responseModel;
        if (connectionsPool[connUUID].callCounter === 0){
            var connection = connectionsPool[connUUID];
            delete connectionsPool[connUUID];
            var res = connection.response;
            res.status(statusCode).jsonp(model);
        }
    }
}


function response(statusCode,model, connUUID){
    var connection = connectionsPool[connUUID];
    delete connectionsPool[connUUID];
    var res = connection.response;
    if ((statusCode === 200) && (model.OperationData != undefined)){
        var object = model.OperationData;
        if ((object != '')&&(object.section != undefined)){
            var operationData = {};
            if ( object.section.sectionName === 'SectionKind'){
                operationData.Kind = object.userKind;
                operationData.SectionKind = object.section.values;
            }else{
                if (object.section.BUI_Subjects != undefined){
                    object.section.BUI_Subjects = JSON.parse(object.section.BUI_Subjects);
                }
                operationData.SectionBasicInfo = object.section.values;
            }
            model.OperationData = operationData;
        }
    }
    res.status(statusCode).jsonp(model);
}