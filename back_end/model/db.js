"use strict";
/// data base entry controller
const DB = require("../Config/Connector");
const logger = require("../Util/log");
const timeUtil = require("../Util/timeUtil");

// cache all the event that is in today    
let cache = require("./dbCache");


/**
 * use database facade to retrieve and store all the data that is in today.
 */
let init = async () => {
    DB.connect();
    
    cache.init();
      
};


let shutdown = async () => {
    await DB.close();

    cache.close();
};

/**Private function *************************************************************************************************************************************/
// list of supported query
const query = {
    SELECT: DB.select,
    DELETE: DB.delete,
    INSERT: DB.insert,
    UPDATE: DB.update,
};

// list of the valid table
const table = {
    MISSION: "mission",
    MASTERY: "main_mastery",
    PRACTICE: "practice",
    SUBSKILL: "subskill",
    TEST: "test"
};  

const key = {
    'mission': 'id',
    'test': 'date',
    'subskill':'label',
};

const missionType = {
    OCCASION: 'occasion',
    SCHEDULE: 'schedule',
    SPECIAL: 'special'
};

// check for get the query
const _getQuery = (str) => {
    switch (str.toLowerCase()){
        case "select":
            return query.SELECT;
        case "insert":
            return query.INSERT;
        case "delete":
            return query.DELETE;
    }
};



const execute = async (queryName, data, table) => {
    let wrapper = _getQuery(query[queryName.ToUpperCase()], data, table);

    return await wrapper(data, table);
}

module.exports = {
    table,
    validateTime,
    missionType,
    key, 
    query
}