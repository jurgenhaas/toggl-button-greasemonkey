// ==UserScript==
// @name Toggl-Button Redmine
// @namespace https://github.com/jurgenhaas/toggl-button-greasemonkey
// @version 1.2
// @include http*://www.redmine.org/issues/*
// @grant GM_xmlhttpRequest
// @grant GM_addStyle
// @grant GM_getResourceText
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_info
// @grant GM_registerMenuCommand
// @require https://greasyfork.org/scripts/2670-toggllibrary/code/TogglLibrary.js
// @resource togglStyle https://raw.githubusercontent.com/jurgenhaas/toggl-button-greasemonkey/v1.1/TogglLibrary.css
// ==/UserScript==
new TogglButtonGM('#content', function (elem) {
  var description, projectIds = [],
      numElem = elem.querySelector('h2', elem),
      titleElem = elem.querySelector('h3', elem),
      authorElem = elem.querySelector('.author .user', elem),
      projectElem = document.querySelector('h1');

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
    className: 'redmine',
    description: description,
    projectIds: projectIds
  };
});
