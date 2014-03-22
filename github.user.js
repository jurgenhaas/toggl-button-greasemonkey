// ==UserScript==
// @name        Toggl-Button GitHub
// @namespace   https://github.com/jurgenhaas/toggl-button-greasemonkey
// @version     0.01
// @include     http*://github.com/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://raw.githubusercontent.com/jurgenhaas/toggl-button-greasemonkey/master/TogglLibrary.js
// @resource    togglStyle https://raw.githubusercontent.com/jurgenhaas/toggl-button-greasemonkey/master/TogglLibrary.css
// ==/UserScript==

TogglButton.fetchUser(TogglButton.$newApiUrl, function() {
  togglbutton.render('#js-discussion-header', {}, function (elem) {
    var link, description, projectIds = [],
      numElem = $('.issue-number', elem),
      titleElem = $('.js-issue-title', elem),
      projectElem = $('.js-current-repository');

    description = titleElem.innerText;
    if (numElem !== null) {
      description = numElem.innerText + " " + description;
    }

    if (projectElem !== null) {
      projectIds.push(projectElem.textContent);
    }

    link = togglbutton.createTimerLink({
      className: 'github',
      description: description,
      projectIds: projectIds,
      targetSelectors: {
        link: '.gh-header-meta',
        projectSelect: '.gh-header-meta'
      }
    });
  });
});
