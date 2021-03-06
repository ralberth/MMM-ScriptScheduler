/* global module, require */
/* jshint node: true, esversion: 6 */

/* Magic Mirror
 * Node Helper: MMM-ScriptScheduler
 * MIT Licensed.
 */
console.log("!! 1");
var NodeHelper = require("node_helper");
console.log("!! 2");
var CronJob = require("cron").CronJob;
console.log("!! 3");
var exec = require('child_process').exec;
console.log("!! 4");


module.exports = NodeHelper.create({

    socketNotificationReceived: function(notification, payload) {
        var me = this;
        if (notification === "SCHEDULE") {
            if (this.cronJobs) {
                this.cronJobs.forEach(function(cronJob) {
                    cronJob.stop();
                    console.log("Stopped previous sched " + cronJob.cronTime);
                });
            }

            this.cronJobs = payload.schedules.map(function(schedCfg, indx) {
                var cronObj = new CronJob(schedCfg.schedule, function() {
                    if (!!schedCfg.command) {
                        exec(schedCfg.command, function(error, stdout, stderr) {
                            if (stdout) console.log(stdout);
                            if (stderr) console.log(stderr);
                            me.sendSocketNotification("UPDATE", { index: indx });
                        });
                    } else {
                        // no command in config.js, just trigger the update to change screen icon
                        me.sendSocketNotification("UPDATE", { index: indx });
                    }
                });
                cronObj.start();
                console.log("New sched #" + indx + ": " + cronObj.cronTime + " run " + schedCfg.command);
                return cronObj;
            });
        }
    }
});
