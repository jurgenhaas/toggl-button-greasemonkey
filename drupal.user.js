// ==UserScript==
// @name        Toggl-Button Drupal
// @namespace   https://github.com/jurgenhaas/toggl-button-greasemonkey
// @version     1.0-beta.3
// @include     https://drupal.org/node/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_info
// @grant       GM_registerMenuCommand
// @require     https://raw.githubusercontent.com/jurgenhaas/toggl-button-greasemonkey/v1.0-beta.3/TogglLibrary.js
// @require     http://sizzlemctwizzle.com/423249.js
// @resource    togglStyle https://raw.githubusercontent.com/jurgenhaas/toggl-button-greasemonkey/v1.0-beta.3/TogglLibrary.css
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
