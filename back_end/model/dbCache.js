const DB = require("../Config/Connector");
const logger = require("../Util/log");
const timeUtil = require("../Util/timeUtil");
const cron = require("node-cron");

let table = require("../model/db").table;
let key = require("../model/db").key;
let query = require("../model/db").query;
// cache all the event that is in today    

/* internal data for save: make use of the event thread of the node js to go backing up data.

*/
let changeFlag;
let stash;

let autoSaveTask = cron.schedule("15 * * * * *", () => {
    if(changeFlag) {
        changeFlag = false;

        save();
    }
});

let save = () => {
    if(stageChange.length > 1){
        logger.writeLog(`Data in '${stageChange[0]}' is saved to DATA BASE~!`, "AutoSave");
        
        for(var i = 1; i < stageChange.length; i ++ ){
            query.UPDATE(key[stageChange[0]], stageChange[i], stageChange[0]);
        }
    }  
};

let cache = {
    HASH = 0,
    CACHE = 1,

    missionHash = {}, //{plan_time:index in cache,..}
    skillHash = {}, //{label: index in cache, .. }
    testHash = {}, //{date: index of sub skill in cache}
    mission = [],
    subskill = [],
    test = [],

    /**
     * Initiate hook
     */
    init: async () => {
        // initiate the back ground auto saved
        changeFalg = false;
        stash = {
            mission : ['Mission cache',key['mission']],
            subskill: ['Sub-skill cache',key['subskill']],
            test: ["Test cache", key['test']]
        };

        // initiate the cache
        let temp;
        // long value that is second since 1970
        let dueDate = timeUtil.timeUtil.extractUnixOfYYYY_MM_DD( Date.now());

        // load daily mission.
        temp = db.execute("SELECT", {plan_time: dueDate}, table.MISION );
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

            // load all the test session
            for(var skill in skillHash){
                temp = DB.select({subskill_label: skill.label});
                if(temp){
                    testHash[temp.date] = skillHash[skill];
                }
            }
        }
    },

    /**
     * Close down hook
     */
    close : () => {
        save();
    }, 

    validate: (table) => {
        let hashCheck = null;
        let cacheCheck = null;

        switch(table){
            case table.MISION: {
                hashCheck = this.missionHash;
                cacheCheck = this.mission;
            }
            case table.SUBSKILL: {
                hashCheck = this.skillHash;
                cacheCheck = this.subskill;
            }
            case table.TEST: {
                hashCheck = this.testHash;
                cacheCheck = this.test;
            }
        }
        return hashCheck, cacheCheck;
    },

    /**
     * check if the relation exist
     * @param {string} table name of the relation
     * @param {string} key attribute of the relation 
     * @returns 
     */
    check: (table, key) => {
        let hashCheck = cache.valiadate(table)[HASH];

        return(hashCheck != null 
                && hashCheck[key] != null);
        
    },

    /**
     * return the cache data if exist
     * @param {string} table name of the relation
     * @param {string} key attribute of the relation
     * @returns 
     */
    retrieve: (table, key) => {
        let pairHashCache = cache.getTable(table);
        if(cache.check(table, key) ) {
            return pairHashCache[CACHE]
                // retrieve the data store at index that is in hash map
                [pairHashCache[TABLE]];
        }
    },

    /**
     * insert the value into cache table
     * @param {string} table table name
     * @param {string} key relation attribute
     * @param {object} value value that will be save into db
     * @returns {bool} that indicate if the process is successfull
     */
    insert: (table, key, value) => {
        let pairHashCache = cache.getTable(table);
        let concreteCache = pairHashCache[CACHE];
        let concreteHash = pairHashCache[HASH];
        if(!cache.check(table)){
            // tell the auto save that there some change
            changeFlag = true;
            stash[table] = concreteCache.length;

            concreteHash[key] = concreteCache.length;
            concreteCache[key].push(value);
            return true;
        }
        return false;
    }
}

module.exports = cache;