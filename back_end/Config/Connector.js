"use strict";
const database = require("mysql2/promise");
const bluebird = require('bluebird');

const logger = require("../Util/log");
require('dotenv').config();

let db = null;

let dbFacade = {
    
    
    connect: async () => {
        db =await database.createConnection(
            {
                host: process.env.HOST,
                user: process.env.USER,
                database: process.env.DB,
                Promise: bluebird
            }
        );
    },

    /**
     * @param {JSON} searchQuery format: {attribute_name: value, ..} 
     * @param {String} table the name of the table we want to query
     */
    select: async (searchQuery, table, cb) => {

        let query =  ``;
        // build the query
        query += `SELECT * FROM \`${table}\` WHERE `;
        for(var attributeName in searchQuery){
            query += `\`${attributeName}\`=${searchQuery[attributeName]} `;
        }
        
        //console.log(db);
        let res;
        try{
            res = await db.execute(query);
            return res[0];
        }catch(err){
            logger.writeLog(err, "Database Facade:INSERT");
        }
        return null;
    },

    selectCustom: async(query) => {
        let res;
        try{
            res = await db.execute(query);
            return res[0];
        }catch(err){
            logger.writeLog(err, "Database Facade:INSERT");
        }
        return null;
    },

    insert: async (insertQuery, table) => {

        let query = ``;
        query += `INSERT INTO `;
        
        query += `\`${table}\` (`;
        let val = ` VALUES (`;

        for(var attributeName in insertQuery){
            query += `\`${attributeName}\` ,`;
            val += `${insertQuery[attributeName]} ,`;
        }
        query = query.substring(0,query.length - 1);
        val = val.substring(0,val.length - 1);
        query +=`) ${val});`;
        try{
            await db.execute(query);
        }catch(err){
            logger.writeLog(err, "Database Facade:INSERT");
        }
    },

    update: async (updateQuery, keyVal, table) => {
        let query = ``;

        query += `UPDATE \`${table}\` SET`;

        // add set value
        for(var attribute in updateQuery){
            query += ` \`${attribute}\`=\`${updateQuery[attribute]}\`,`;
        }
        // eliminate the extra comma
        query = query.substring(0, query.length - 1);

        // add selection value
        query += " WHERE";
        for(var attribute in keyVal){
            query +=  ` \`${attribute}\`=\`${keyVal[attribute]}\`,`;
        }
        // eliminate the extra comma
        query = query.substring(0, query.length - 1);

        try{
            await db.execute(query);
        } catch (err){
            logger.writeLog(err, "Database Facade:UPDATE");
        }
    },

    delete: async (deleteQuery, table) => {
        let query = ``;
        query += `DELETE * FROM \`${table}\` WHERE `;
        for(var attributeName in searchQuery){
            query += `\`${attributeName}\`=${searchQuery[attributeName]} `;
        }
        //console.log(db);
        let res;
        try{
            res = await db.execute(query);
            return res[0];
        }catch(err){
            logger.writeLog(err, "Database Facade:INSERT");
        }
        
    }
    ,

    end: () => {
        db.end();
    }
}
let res = [];
let test = async() => {
    await dbFacade.connect();
    res = await dbFacade.select(
        {
            "due_progression":100.0
        },
        'mission', (result) =>
        {
            //console.log(result);
            res = result;
        });
    console.log(res);
    dbFacade.insert(
        {
            "category": "\'occasion\'",
            "estimate_duration":'\'00:45:00\'',
            "actual_duration": '\'00:41:00\'',
            "distract_count": 2,
            "due_progression": 100.0
        }, 
        'mission');
    dbFacade.end();
};

test();
//setTimeout(() => console.log(res), 1);
