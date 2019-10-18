/* global Module */

/* MMM-ScriptScheduler.js
 *
 * Magic Mirror
 * Module: MMM-VolumeControl
 * MIT Licensed.
 *
 * See README.md for details on this.
 */
Module.register("MMM-ScriptScheduler", {

    getStyles: function() {
        return [ "font-awesome.css" ];
    },


    getDom: function() {
        var imageDiv = document.createElement("div");
        this.config.schedules.forEach(function(schedule, index) {
            if (schedule.icon) {
                var icon = document.createElement("span");
                icon.id = "scriptsched_" + index;
                icon.className = "fa-stack fa-lg";
                icon.style.display = "none";
                icon.style.margin = "20px";
                icon.style.color = schedule.color;
                if (schedule.icon) {
                    icon.innerHTML = "<i class='fa fa-circle fa-stack-2x'></i>" +
                                    "<i class='fa fa-" + schedule.icon + " fa-fw fa-stack-1x fa-inverse'></i>";
                }
                imageDiv.appendChild(icon);
            } else if (schedule.imageurl) {
                var img = document.createElement("img");
                img.id = "scriptsched_" + index;
                img.src = schedule.imageurl;
                img.style.display = "none";
                img.style.margin = "20px";

                imageDiv.appendChild(img);
            }
        });
        return imageDiv;
    },


    notificationReceived: function(notification, payload, sender) {
        switch(notification) {
        case "DOM_OBJECTS_CREATED":
            this.sendSocketNotification("SCHEDULE", this.config);
            break;
        case "SCRIPTSCHEDULER_ALL_OFF":
            for (var i = 0; i < this.config.schedules.length; i++)
                this.setImageVisible(i, false);
            break;
        case "SCRIPTSCHEDULER_SHOW_ICON":
            for (var i = 0; i < this.config.schedules.length; i++)
                this.setImageVisible(i, false);
            this.setImageVisible(payload.index, true);
            break;
        }
    },


    socketNotificationReceived: function(notification, payload) {
        switch(notification) {
        case "UPDATE":
            for (var i = 0; i < this.config.schedules.length; i++)
                this.setImageVisible(i, false);
            this.setImageVisible(payload.index, true);
            break;
        }
    },


    setImageVisible: function(index, shouldBeVisible) {
        var id = "scriptsched_" + index;
        var span = document.getElementById(id);
        if (!!span) // may not be a span if no imageurl or icon in config.js for this schedule
            span.style.display = shouldBeVisible ? "block" : "none";
    }
});
