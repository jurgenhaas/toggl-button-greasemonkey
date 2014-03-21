// ==UserScript==
// @name        Toggl-Button GitHub
// @namespace   https://github.com/jurgenhaas/toggl-button-greasemonkey
// @version     0.01
// @include     http*://github.com/*
// @grant       GM_xmlhttpRequest
// @require     https://raw.githubusercontent.com/jurgenhaas/toggl-button-greasemonkey/master/TogglLibrary.js
// ==/UserScript==

TogglButton.fetchUser(TogglButton.$newApiUrl, function() {
  togglbutton.render('#js-discussion-header', {}, function (elem) {
    var link, description,
      numElem = $('.issue-number', elem),
      titleElem = $('.js-issue-title', elem),
      projectElem = $('.js-current-repository');

    description = titleElem.innerText;
    if (numElem !== null) {
      description = numElem.innerText + " " + description;
    }

    link = togglbutton.createTimerLink({
      className: 'github',
      description: description,
      projectName: projectElem && projectElem.textContent
    });

    $('.gh-header-meta').appendChild(link);
  });

});
