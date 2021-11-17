"use strict";

let timeUtil = {

    /* Turn a unix that store YYYY_MM_DD HH MM:SS.MS to that of only YYYY-MM-DDT00 00:00.00
     * This will be conventional store a scheduled date
     * @author June (Xuan Trinh)
     * @param {Number} time in millie second since po xis (Unix time)
     * @return {Number} formatted - bring the time back to the start of the same day, but display in Unix time
     */
    extractUnixOfYYYY_MM_DD: (unixTime) => {
        return Math.floor(unixTime / 86400000) * 86400000;
      },
    
      /* Turn a nix that store YYYY_MM_DD HH MM:SS:MS to that of only YYYY-MM-DD HH MM:00.00
       * This will be the convention to store start/ end of an event
       * @author June (Xuan Trinh)
       * @param {Number} time in millie second since po xis (Unix time)
       * @return {Number} formatted - remove the second, mils second value. Display in Unix time
       */
      extractUnixOfYYYY_MM_DD_HH_MM: (unixTime) => {
        return Math.floor(unixTime / 60000) * 60000;
      },
    
      /* Turn the hour:,  minute into mils second value
       * @param: {Int}
       * @param: {Int}
       * @return: {Int} millisecond value
       */
      extractUnixOfTime: (hour, minute) => {
        return hour * 60 * 60 * 1000 + minute * 60 * 1000;
      },
  
      extractH_M_S: (miliSec) => {
        let hourVal = Math.floor(miliSec/3600000);
        let minVal =  Math.floor((mileSec - hourVal * 3600000) / 60000);
        return {
            hour:hourVal,
            min: minVal
        };

        
      },
      // ensure the time receive is valid
      validateTime: (timeStr) => {
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
};
module.exports = timeUtil;