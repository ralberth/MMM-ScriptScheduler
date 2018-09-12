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
        var iconDiv = document.createElement("div");
        this.config.schedules.forEach(function(schedule, index) {
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
            iconDiv.appendChild(icon);
        });
        return iconDiv;
    },


    notificationReceived: function(notification, payload, sender) {
        switch(notification) {
        case "DOM_OBJECTS_CREATED":
            this.sendSocketNotification("SCHEDULE", this.config);
            break;
        }
    },


    socketNotificationReceived: function(notification, payload) {
        switch(notification) {
        case "UPDATE":
            console.log("update: " + JSON.stringify(payload, null, 3));
            for (var i = 0; i < this.config.schedules.length; i++)
                this.setIconVisible(i, false);
            this.setIconVisible(payload.index, true);
            break;
        }
    },


    setIconVisible: function(index, shouldBeVisible) {
        var id = "scriptsched_" + index;
        var span = document.getElementById(id);
        span.style.display = shouldBeVisible ? "block" : "none";
    }
});
