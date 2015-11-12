// ==UserScript==
// @name        Toggl-Button Zendone
// @namespace   https://github.com/jurgenhaas/toggl-button-greasemonkey
// @version     0.9
// @include     https://drupal.org/node/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_info
// @grant       GM_registerMenuCommand
// @require     https://greasyfork.org/scripts/2670-toggllibrary/code/TogglLibrary.js
// @resource    togglStyle https://raw.githubusercontent.com/jurgenhaas/toggl-button-greasemonkey/v1.3/TogglLibrary.css
// @description Toggle button for ZenDone
// ==/UserScript==


// @require     http://sizzlemctwizzle.com/423249.js

/*
Not working yet!
TogglButtonGM.init(TogglButtonGM.$newApiUrl, function() {
  TogglButtonGM.render('.actions-table tr', {}, function (elem) {
    console.log('ZENDONE Toggl');
    var description, projectIds = [],
      titleElem = $('.colMain .action-title', elem),
      projectElem = $('.field-name-field-project .field-items .field-item');

    description = titleElem.textContent.trim();
    if (id !== null) {
      description = id + " " + description;
    }

    if (projectElem !== null) {
      projectIds.push(projectElem.textContent.trim());
    }

    TogglButtonGM.createTimerLink({
      className: 'zendone',
      description: description,
      projectIds: projectIds,
      targetSelectors: {
        link: '.colMain .action-title',
        projectSelect: '.colMain .action-title'
      }
    });
  });
});
*/
