"use strict";
require("string");
const fs = require('fs');
const timeUtil = require("../Util/timeUtil");

let logger = {

    writeLog: (rawMessage, origin) => {

        // extract the time.
        let fileName = new Date( 
            // extract up to date value from current date/time
            timeUtil.extractUnixOfYYYY_MM_DD(new Date().getTime())
        ).toDateString();
        let message =  `<${new Date( 
            // extract up to date value from current date/time
            new Date().getTime()
        )}> <${origin}> <${rawMessage}> \n`;
        fs.appendFile("./log/" + fileName, message, 
            (err) => {
                if(err) throw err;

                console.log(message);
            }
        )
    }
}

module.exports = logger;