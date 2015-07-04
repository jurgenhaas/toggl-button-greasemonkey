// ==UserScript==
// @name        Toggl-Button Gitlab
// @namespace   https://github.com/jurgenhaas/toggl-button-greasemonkey
// @version     1.2
// @include     http*://gitlab.com/*
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

new TogglButtonGM('.issue-details', function (elem) {
  var description, projectIds = [],
    numElem = elem.querySelector('.page-title', elem),
    titleElem = elem.querySelector('.issue-box .title, .issue-title', elem),
    projectElem = document.querySelector('.title');

  description = titleElem.textContent.trim();
  if (numElem !== null) {
    description = numElem.childNodes[2].nodeValue.trim() + " " + description;
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
