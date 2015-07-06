// ==UserScript==
// @name        Toggl-Button GitHub
// @namespace   https://github.com/jurgenhaas/toggl-button-greasemonkey
// @version     1.3
// @include     http*://github.com/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_info
// @grant       GM_registerMenuCommand
// @require     https://greasyfork.org/scripts/2670-toggllibrary/code/TogglLibrary.js
// @resource    togglStyle https://raw.githubusercontent.com/jurgenhaas/toggl-button-greasemonkey/v1.3/TogglLibrary.css
// @description Toggle button for GitHub
// ==/UserScript==

new TogglButtonGM('#partial-discussion-header', function (elem) {
  var description, projectIds = [],
    numElem = elem.querySelector('.gh-header-number', elem),
    titleElem = elem.querySelector('.js-issue-title', elem),
    authorElem = document.querySelector('.url.fn'),
    projectElem = document.querySelector('.js-current-repository');

  description = titleElem.textContent.trim();
  if (numElem !== null) {
    description = numElem.textContent.trim() + " " + description;
  }

  if (authorElem !== null) {
    projectIds.push(authorElem.textContent.trim());
  }
  if (projectElem !== null) {
    projectIds.push(projectElem.textContent.trim());
  }

  return {
    className: 'github',
    description: description,
    projectIds: projectIds
  };
});
