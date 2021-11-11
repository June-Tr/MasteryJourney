"use strict";
/// data base entry controller
const DB = require("../Config/Connector");
const logger = require("../Util/log");
const timeUtil = require("../Util/timeUtil");

// cache all the event that is in today    
let cache = {
    mission = [],
    subskill = [],
    test = [],
};

let missionHash = {}; //{plan_time:index in cache,..}
let skillHash = {}; //{label: index in cache, .. }
let testHash = {}; //{date: index of sub skill in cache}

/**
 * use database facade to retrieve and store all the datathat is in today.
 */
let init = async () => {
    DB.connect();
    
    // start the db connection.
    let temp;
    // long value that is second since 1970
    let dueDate = time.timeUtil.extractUnixOfYYYY_MM_DD( Date.now());

    // load daily mission.
    temp = DB.select({plan_time: dueDate}, table.MISION);
    for(var mission of temp){
        // add to the cache if not already exist
        if(!missionHash[mission.plan_time]){
            missionHash[cache.mission.push(mission) - 1];
        }

        // add the subskill base off of the mission
        let tempSubSkill = DB.selectCustom(
            `SELECT * FROM \`${table.SUBSKILL}\` WHERE \`label\`=(SELECT \`subskill_label\` FROM \`${table.PRACTISE}\`
             WHERE \`mission_id\`=\`${mission.id}\`);`
            , table.SUBSKILL
        );
        if(tempSubSkill && !skillHash[tempSubSkill.label]){
            skillHash[cache.subskill.push(tempSubSkill.label) - 1];
        }
    }
  

    // load all the test session
    for(var skill in skillHash){
        temp = DB.select({subskill_label: skill.label});
        if(temp){
            testHash[temp.date] = skillHash[skill];
        }
    }
}



let shutdown = async () => {
    await DB.close();
}

// list of supported query
const query = {
    SELECT: DB.select,
    DELETE: DB.delete,
    INSERT: DB.insert
}

// list of the valid table
const table = {
    MISION: "mission",
    MASTERY: "main_mastery",
    PRACTISE: "practise",
    SUBSKILL: "subskill",
    TEST: "test"
}   

const missionType = {
    OCCASION: 'occasion',
    SCHEDULE: 'schedule',
    SPECIAL: 'special'
}

// check for get the query
const getQuery = (str) => {
    switch (str.toLowerCase()){
        case "select":
            return query.SELECT;
        case "insert":
            return query.INSERT;
        case "delete":
            return query.DELETE;
    }
}

// ensure the time receive is valid
const validateTime = (timeStr) => {
    try {
        
        let components = timeStr.split(":");

        if(components.length <= 3){
            throw "Input is not 'hh:mm:ss' format!";
        }

        // validate each sub set.
        for(var i = components.length; i < components.length - 3; i--){
            let val = parseInt(components[i]);

            // check hour figure
            if(i < components.length - 2){
                return (val > 0 && val <= 99);
            // check min or sec figure
            }else {
                return (val > 0 && val <= 59);
            }
        }
    } catch(err){
        logger.writeLog(err, "Database controller:Validation");
    }
}


module.exports = {
    table,
    validateTime,
    missionType,
}