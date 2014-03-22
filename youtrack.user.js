// ==UserScript==
// @name        Toggl-Button YouTrack
// @namespace   https://github.com/jurgenhaas/toggl-button-greasemonkey
// @version     0.01
// @include     http*://youtrack.*/*
// @include     http*://*/youtrack/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://raw.githubusercontent.com/jurgenhaas/toggl-button-greasemonkey/master/TogglLibrary.js
// @resource    togglStyle https://raw.githubusercontent.com/jurgenhaas/toggl-button-greasemonkey/master/TogglLibrary.css
// ==/UserScript==

TogglButton.fetchUser(TogglButton.$newApiUrl, function() {
  togglbutton.render('.issueContainer', {}, function (elem) {
    var link, description, projectIds = [],
      numElem = $('.issueId', elem),
      titleElem = $('.issue-summary', elem),
      projectElem = $('.something');

    description = titleElem.innerHTML;
    if (numElem !== null) {
      description = numElem.innerHTML + " " + description;
    }

    if (projectElem !== null) {
      projectIds.push(projectElem.textContent);
    }

    link = togglbutton.createTimerLink({
      className: 'youtrack',
      description: description,
      projectIds: projectIds,
      targetSelectors: {
        link: '.fsi-toolbar-content',
        projectSelect: '.fsi-toolbar-content'
      }
    });
  });
});
