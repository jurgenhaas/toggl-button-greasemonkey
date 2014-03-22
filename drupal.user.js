// ==UserScript==
// @name        Toggl-Button Drupal
// @namespace   https://github.com/jurgenhaas/toggl-button-greasemonkey
// @version     0.90
// @include     https://drupal.org/node/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_info
// @grant       GM_registerMenuCommand
// @require     https://raw.githubusercontent.com/jurgenhaas/toggl-button-greasemonkey/master/TogglLibrary.js
// @require     http://sizzlemctwizzle.com/422156.js
// @resource    togglStyle https://raw.githubusercontent.com/jurgenhaas/toggl-button-greasemonkey/master/TogglLibrary.css
// ==/UserScript==

TogglButton.fetchUser(TogglButton.$newApiUrl, function() {
  togglbutton.render('body.node-type-project-issue', {}, function (elem) {
    var link, description, projectIds = [],
      href = document.getElementById('tabs').getElementsByTagName('a')[0].getAttribute('href'),
      id = href.match(/(?:node|comment\/reply)\/(\d+)/)[1],
      titleElem = $('#page-subtitle', elem),
      projectElem = $('.field-name-field-project .field-items .field-item');

    description = titleElem.textContent.trim();
    if (id !== null) {
      description = id + " " + description;
    }

    if (projectElem !== null) {
      projectIds.push(projectElem.textContent.trim());
    }

    link = togglbutton.createTimerLink({
      className: 'drupal',
      description: description,
      projectIds: projectIds,
      targetSelectors: {
        link: '.submitted',
        projectSelect: '.submitted'
      }
    });
  });
});
