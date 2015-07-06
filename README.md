Toggl Button for Greasemonkey/Firefox
=====================================

Time tracking should be as simple as possible - otherwise it won't happen in the first place!

[Toggl][10] as a platform does an amazing job with this and is available on (almost) any platform you can possibly think of. They also make available an [Official Toggl Button for Chrome][13] and the project here has been heavily inspired by that open source project. The motivation to develop and maintain it is simply the fact that I'm a Firefox user and therefore wasn't able to use the official solution.

To use it, just install it and get started. On every page with an identified issue on the suported platforms, you will be getting a button to start and stop a time entry and also a select box to assign that time entry to one of your projects in your Toggl workspace.

How does this button know about your Toggl account? You should be logged into your Toggl account at least once from a different tab in the same browser and that allows the Toggl button to grab your API token from your account and that will be stored in a local file to be re-used for all subsequent API requests made to Toggl.

##Features##

###Simple Authentication###

It just happens in the background, you don't have to worry about it. The first time, you have to be logged in to your Toggl account and that allows the Toggl button to grab your API token and store that locally for the future.

###Start/Stop time entries###

On applicable pages you'll find the Toggl button somewhere in the header of the page where you can simply start a time entry by clicking on it. The button style changes to indicate that it is active and by clicking on it again, you will be stopping the time entry.

###Project selection###

Next to the Toggl button you'll see a select box containing all your projects from Toggl and before starting a time entry you can select one of those projects to which the new time entry will be assigned.

###Remember project###

Toggl button is clever about your project selections and remembers your previous selection. Not globally but within the context that you're operating in. E.g. if you're working on different projects on GitHub, Toggl button will remember different Toggl projects for each of your GitHub projects where you've used the button before.

The method to determine the context depends on the platform where the button is used. So the context on Github is determined differently from the context on YouTrack. But all of that is open source, so you can just go ahead and look into th *[platform].user.js* files and see how it's been implemented.

###Caching data###

When Toggl button connects to your Toggl account the first time, it collects all the data about your projects and stores that locally so that this data doesn't have to be collected every time. This is saving a lot of bandwidth and makes the whole process much faster.

However, that could get you in a situation where your settings in your Toggl account (e.g. new projects) won't be reflected by the Toggle button. Don't worry, there are solutions for that too:

First of all, Toggl button is updating the cached data once every 6 hours in the background anyway. If you want to force that process to happen at any time you need it, just open the project select list and select the last item in the list named *Reload settings*. This will reload the current page and the data will be updated.

###Keep status across page reloads###

When you start a time entry the button changes style to indicate that there is a task running for the current page issue. This even works across page loads in the browser. To achieve that, Toggl button is asking your Toggl account if a task is currently running and if so, it compares that with the current page and if that's equal, it will change the button style as if it were just started by clicking on it.

###Set billable flag for time entries (Toggl Pro accounts only)###

If you have a Toggl Pro account, you can set a flag for each project if it's billable or not. This setting will be used by the Toggl button to set it equally to each time entry depending on the project you have selected for it.

###Show message when authentication fails###

If the Toggl button can't access your Toggl account, it will inform you about it by showing you a red line at the top of your browsers viewport and provide you with a link where you can login to your Toggl account easily.

##How to install##

On Firefox, you have to have Greasemonkey installed first. If you haven't got it installed yet, just go to [Mozilla Greasemonkey][11] and follow the instructions there.

Once Greasemonkey is installed, you can either add user scripts from GitHub or through the Greasy Fork platform:

###How to install from GitHub###

Just open one of the PLATFORM.user.js files and then click on "Raw". Your Firefox browser should tell you that you're opening a Greasemonkey user script and provides an option "Install" which you should then click.

The direct links are:

| PLATFORM | Stable | Latest |
| -------- | -------------- | -------------- |
| Drupal   | [Install][301] | [Install][401] |
| General  | [Install][305] | [Install][405] |
| GitHub   | [Install][302] | [Install][402] |
| Gitlab   | [Install][304] | [Install][404] |
| Redmine  | [Install][306] | [Install][406] |
| TeamWork | [Install][307] | [Install][407] |
| YouTrack | [Install][303] | [Install][403] |

###How to install from Greasy Fork###

Either go to [Greasy Fork][3] or click on the following platforms to install their respective Toggl button script:
* [Drupal][101]
* [General][105]
* [GitHub][102]
* [Gitlab][104]
* [Redmine][106]
* [TeamWork][107]
* [YouTrack][103]

If you want to use the scripts on other browsers, please follow the instruction [here][12].

##How to update##

The Toggl button for Greasemonkey scripts have auto-update functionality included. By default, the system is checking once a week if a new version is available and downloads the latest ones automatically to your system.

To manually force the update check, go to **Tools / Add-ons / User scripts** and in the options button on top of the scripts list you'll find an option **Check for updates**.

##How to configure##

Normally, there is no configuration required, these buttons just work out of the box.

However, you can adjust their scope by individually defining the list of domains where the buttons should be included or excluded. Each of the buttons has built-in standards but they can be adjusted according to your own requirements:
* Go to **Tools / Add-ons / User scripts**
* For the script you want to configure, click on **Options**
* In the **User Settings** tab you can input any number of included and excluded domains
* Click *OK* when you're done

##Useful links##

* [Greasy Fork][17]
* [User Scripts][14]
* [Toggl Button Greasy Fork][3]
* [Toggl Button User Scripts][1]
* [Greasemonkey Homepage][15]
* [Greasemonkey AddOn][11]
* [Other browser support][12]
* [Toggl API][16]
* [Official Toggl Button for Chrome][13]
* Available Toggl Button for Greasemonkey Scripts:
  * [Drupal][201]
  * [General][205]
  * [GitHub][202]
  * [Gitlab][204]
  * [Redmine][206]
  * [TeamWork][207]
  * [YouTrack][203]

##Credits##

###Toggl###
* [Best of bread online timetracking][10] is the basis for all of this and without their excellent product, neither a Toggl button would be possible nor required.

##Contributing##

Want to contribute? Great! Just fork the project, make your changes and open a [Pull Request][2]

##Disclaimer##

As the author of this set of scripts I do disclose that I am **in no way** associated with the company behind Toggl other than being a happy customer of their paid pro version.

This also means, that the scripts here are in no way *official products* of Toggl and therefore not supported by Toggl or their associates.

[1]: http://userscripts.org:8080/tags/toggl
[2]: https://github.com/jurgenhaas/toggl-button-greasemonkey/pulls
[3]: https://greasyfork.org/scripts/search?q=toggl
[10]: https://new.toggl.com
[11]: https://addons.mozilla.org/en-US/firefox/addon/greasemonkey
[12]: http://wiki.greasespot.net/Cross-browser_userscripting
[13]: https://github.com/toggl/toggl-button
[14]: http://userscripts.org:8080
[15]: http://www.greasespot.net
[16]: https://github.com/toggl/toggl_api_docs
[17]: https://greasyfork.org
[101]: https://greasyfork.org/scripts/2671-toggl-button-drupal/code/Toggl-Button%20Drupal.user.js
[102]: https://greasyfork.org/scripts/2674-toggl-button-github/code/Toggl-Button%20GitHub.user.js
[103]: https://greasyfork.org/scripts/2675-toggl-button-youtrack/code/Toggl-Button%20YouTrack.user.js
[104]: https://greasyfork.org/scripts/10810-toggl-button-github/code/Toggl-Button%20Gitlab.user.js
[105]: https://greasyfork.org/scripts/2673-toggl-button-github/code/Toggl-Button.user.js
[106]: https://greasyfork.org/scripts/10811-toggl-button-github/code/Toggl-Button%20Redmine.user.js
[107]: https://greasyfork.org/scripts/10809-toggl-button-github/code/Toggl-Button%20TeamWork.user.js
[201]: https://greasyfork.org/scripts/2671-toggl-button-drupal
[202]: https://greasyfork.org/scripts/2674-toggl-button-github
[203]: https://greasyfork.org/scripts/2675-toggl-button-youtrack
[204]: https://greasyfork.org/scripts/10810-toggl-button-gitlab
[205]: https://greasyfork.org/scripts/2673-toggl-button
[206]: https://greasyfork.org/scripts/10811-toggl-button-redmine
[207]: https://greasyfork.org/scripts/10809-toggl-button-teamwork
[301]: https://github.com/jurgenhaas/toggl-button-greasemonkey/raw/build-007/drupal.user.js
[302]: https://github.com/jurgenhaas/toggl-button-greasemonkey/raw/v1.2/github.user.js
[303]: https://github.com/jurgenhaas/toggl-button-greasemonkey/raw/v1.1/youtrack.user.js
[304]: https://github.com/jurgenhaas/toggl-button-greasemonkey/raw/master/gitlab.user.js
[305]: https://github.com/jurgenhaas/toggl-button-greasemonkey/raw/master/general.user.js
[306]: https://github.com/jurgenhaas/toggl-button-greasemonkey/raw/master/redmine.user.js
[307]: https://github.com/jurgenhaas/toggl-button-greasemonkey/raw/master/teamwork.user.js
[401]: https://github.com/jurgenhaas/toggl-button-greasemonkey/raw/master/drupal.user.js
[402]: https://github.com/jurgenhaas/toggl-button-greasemonkey/raw/master/github.user.js
[403]: https://github.com/jurgenhaas/toggl-button-greasemonkey/raw/master/youtrack.user.js
[404]: https://github.com/jurgenhaas/toggl-button-greasemonkey/raw/master/gitlab.user.js
[405]: https://github.com/jurgenhaas/toggl-button-greasemonkey/raw/master/general.user.js
[406]: https://github.com/jurgenhaas/toggl-button-greasemonkey/raw/master/redmine.user.js
[407]: https://github.com/jurgenhaas/toggl-button-greasemonkey/raw/master/teamwork.user.js
