// ==UserScript==
// @name        Toggl-Button Gitlab
// @namespace   https://github.com/jurgenhaas/toggl-button-greasemonkey
// @version     1.0
// @include     http*://gitlab.com/*
// @include     http*://gitlab.*/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_info
// @grant       GM_registerMenuCommand
// @require     https://greasyfork.org/scripts/2670-toggllibrary/code/TogglLibrary.js
// @resource    togglStyle https://raw.githubusercontent.com/jurgenhaas/toggl-button-greasemonkey/v1.3/TogglLibrary.css
// @description Toggle button for Gitlab
// ==/UserScript==

new TogglButtonGM('.issue-details', function (elem) {
  var description, projectIds = [],
    id = elem.querySelector('.page-title .issue-id'),
    titleElem = elem.querySelector('.issue-box .title, .issue-title'),
    projectElem = document.querySelector('.title');

  description = titleElem.textContent.trim();
  if (id !== null) {
    description = id.textContent.trim() + " " + description;
  }

  if (projectElem !== null) {
    projectIds.push(projectElem.textContent.trim());
  }

  return {
    className: 'gitlab',
    description: description,
    projectIds: projectIds
  };
});
