// ==UserScript==
// @name        Toggl-Button TeamWork
// @namespace   https://github.com/jurgenhaas/toggl-button-greasemonkey
// @version     1.0
// @include     http*://*.teamwork.com/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_info
// @grant       GM_registerMenuCommand
// @require     https://greasyfork.org/scripts/2670-toggllibrary/code/TogglLibrary.js
// @resource    togglStyle https://raw.githubusercontent.com/jurgenhaas/toggl-button-greasemonkey/v1.1/TogglLibrary.css
// ==/UserScript==

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
  target = document.querySelector('#mainContent'),
  config = { attributes: true, childList: true, characterData: true };

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList') {
      // TODO: if none of the mutations is a task, then remove the toggle element if visible.
      var task = document.querySelector('#Task');
      if (task !== null) {
        var tb = new TogglButtonGM('#Task', function (elem) {
          var taskDetail = document.querySelector('.taskDetailHolder');
          if (taskDetail !== null) {
            var taskID = taskDetail.id.substr(13),
              taskDetailTarget = taskDetail.querySelector('div'),
              innerObserver = new MutationObserver(function (mutations) {
              mutations.forEach(function (mutation) {
                if (mutation.type === 'childList') {
                  var titleElem = document.querySelector('.taskDetailsName span');
                  if (titleElem !== null) {
                    innerObserver.disconnect();
                    var tb = new TogglButtonGM('#Task', function (elem) {
                      var description, projectIds = [],
                        projectElem = document.querySelector('#projectName'),
                        linkElem = document.querySelector('#ViewTaskSidebar .blue2.ql');

                      description = taskID + " " + titleElem.textContent.trim();

                      if (projectElem !== null) {
                        projectIds.push(projectElem.textContent.trim());
                      }
                      if (linkElem !== null) {
                        projectIds.push(linkElem.textContent.trim());
                      }

                      return {
                        className: 'teamwork',
                        description: description,
                        projectIds: projectIds
                      };
                    });

                    // TODO: rework the following click events.
                    document.querySelector('.startTimer button').addEventListener('click', function () {
                      tb.clickLinks();
                      setTimeout(function () {
                        document.querySelector('#timerBar .timer-log-time').addEventListener('click', function () {
                          tb.clickLinks();
                        });
                      }, 2000);
                    });
                  }
                }
              });
            });
            innerObserver.observe(taskDetailTarget, config);
          }
        });
      }
    }
  });
});

observer.observe(target, config);
