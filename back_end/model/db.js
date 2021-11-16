"use strict";
/// data base entry controller
const DB = require("../Config/Connector");
const logger = require("../Util/log");
const timeUtil = require("../Util/timeUtil");

// cache all the event that is in today    
let cache = require("./dbCache");


/**
 * use database facade to retrieve and store all the datathat is in today.
 */
let init = async () => {
    DB.connect();
    
    cache.init();
      
};



let shutdown = async () => {
    await DB.close();

    cache.close();
};

// list of supported query
const query = {
    SELECT: DB.select,
    DELETE: DB.delete,
    INSERT: DB.insert,
    UPDATE: DB.update,
};

// list of the valid table
const table = {
    MISION: "mission",
    MASTERY: "main_mastery",
    PRACTISE: "practise",
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
const getQuery = (str) => {
    switch (str.toLowerCase()){
        case "select":
            return query.SELECT;
        case "insert":
            return query.INSERT;
        case "delete":
            return query.DELETE;
    }
};

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

const execute = async (queryName, data, table) => {
    let wrapper = getQuery(query[queryName.ToUpperCase()], data, table);

    return await wrapper(data, table);
}

module.exports = {
    table,
    validateTime,
    missionType,
    key, 
    query
}