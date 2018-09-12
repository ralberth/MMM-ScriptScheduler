# MMM-ScriptScheduler

A [MagicMirror²](https://magicmirror.builders) module to run command-line scripts or commands based on a cron schedule, and update a screen icon to show the statuses.

The real benefit of this module is having a set of commands that all modify something differently in the background, based on a schedule.  This module schedules the commands to modify the thing, and show the status of which state is in effect visually with an icon on the display.

This was originally created to manage the speaker volume on a daily and weekly basis.  The computer's speaker should be muted overnight, and low in the evening.  During the week, weekdays between 9 AM and 4 PM the speaker can be off as nobody is home.

This could be done in 1 minute with a crontab that looks like this:

```
0  7 * * *    amixer set Master '100%'
0  9 * * 1-5  amixer set Master   '0%'
0 16 * * 1-5  amixer set Master '100%'
0 19 * * *    amixer set Master  '30%'
0 21 * * *    amixer set Master   '0%'
```

The problem is that there is no visual feedback to tell you if the speakers are enabled or muted.  MMM-ScriptScheduler can be setup with the sound commands and when to run them.  You set the icon that should be displayed when each script is run (or no icon) so users can see what "state" the sound is in:

```
{
    module: "MMM-ScriptScheduler",
    position: "fullscreen_above",
    config: {
        schedules: [
            { schedule: "0  7 * * *",   command: "amixer set Master '100%'"                                        },
            { schedule: "0  9 * * 1-5", command: "amixer set Master   '0%'", icon: "bell-slash",  color: "#e00"    },
            { schedule: "0 16 * * 1-5", command: "amixer set Master '100%'"                                        },
            { schedule: "0 19 * * *",   command: "amixer set Master  '30%'", icon: "volume-down", color: "#4875b4" },
            { schedule: "0 21 * * *",   command: "amixer set Master   '0%'", icon: "bell-slash",  color: "#e00"    }
        ]
    }
}
```

With this, there's no icon when the speaker is at 100%, a blue speaker icon when at 30%, and a red slash icon when at 0%:

| **Volume level set by command above** | **Icon shown on the display** |
|---------:|:----------:|
| 100% | *(no icon shown)* |
|  30% | ![Example icon, low volume](pics/example-icon-low.png) |
|   0% | ![Example icon, mute](pics/example-icon-mute.png) |

Each table refreshes on a schedule you set in the `config.js` file.


## Installation

Run these commands at the root of your MagicMirror² install:

```shell
cd modules
git clone https://github.com/ralberth/MMM-ScriptScheduler
cd MMM-ScriptScheduler
npm install
cd ../..
```


## Upgrade

If you already have a version of MMM-ScriptScheduler, run the following to pick up new code changes:

```shell
cd modules/MMM-ScriptScheduler
git pull
npm install
```


## Configuration

Edit your `config/config.js` file and add a new object to the `modules` array like any other module:

```js
var config = {
    modules: [
        {
            module: "MMM-ScriptScheduler",
            position: "fullscreen_above",
            config: {
                schedules: [
                    {
                        schedule: "0  9 * * 1-5",
                        command: "amixer set Master '0%'",
                        icon: "bell-slash",
                        color: "#e00"
                    }
                ]
            }
        }
    ]
};
```


### Position

`position: "fullscreen_above"`: Use any position available in MagicMirror.  The example about uses `fullscreen_above` because that works best for general use.  The entire MMM-ScriptScheduler display presence consists of a single icon.  Due to the normal MagicMirror CSS styling, there is whitespace separating each module in your config file.  Adding MMM-ScriptScheduler to a different `position` tends to take up more room than you'll probably want.

If the status is truly important, use the `header` to label the icon to give it a bit more visual and semantic separation.  If you don't use `header` value, the MMM-ScriptScheduler icon gets mistakenly considered part of whatever other module is above it.


### Config

| **Option** | **Type** | **Required?** | **Description** |
| --- | --- | --- | --- |
| `schedules` | array of objects | yes | Array of at least 1 object (see below) |


### Schedules Config

| **Option** | **Type** | **Required?** | **Description** |
| --- | --- | --- | --- |
| `schedule` | string | yes | Any cron expression supported by [crontab.org](http://crontab.org/). |
| `command` | string | yes | Command with arguments to execute from the underlying shell.  MMM-ScriptScheduler uses Node.js' build-in `exec()` function from module `child_process` to run this command. |
| `icon` | string | NO | Name of the FontAwesome icon to display, without the `fa-` prefix.  As of September 2018, MagicMirror is using FontAwesome version 4.7.  See details at [fontawesome.com/v4.7.0](https://fontawesome.com/v4.7.0/). |
| `color` | string | NO  | Optional CSS color designation to use for the circle disk displayed behind the icon.  Use any CSS-allowed value, such as `red`, `#e00`, or `rgba(100, 60, 10, 0.8)`.  See [color codes on quackit.com](https://www.quackit.com/css/css_color_codes.cfm) for examples and details. |


## Known Problems

1. This module can't display two icons at once, it's built to handle a single icon at a time.
2. This depends on crontab entries to delineate when the icon should **change**, not the ranges that an icon should be in effect.  Because of this, refreshing the browser page does not show the correct icon: the correct icon will not be displayed until the next triggering crontab "fires".  This can lead to wrong information displayed.