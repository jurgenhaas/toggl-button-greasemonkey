// ==UserScript==
// @name        Toggl-Button YouTrack
// @namespace   https://github.com/jurgenhaas/toggl-button-greasemonkey
// @version     0.01
// @include     http*://youtrack.*/*
// @include     http*://*/youtrack/*
// @grant       GM_xmlhttpRequest
// @require     TogglLibrary.js
// ==/UserScript==

TogglButton.fetchUser(TogglButton.$newApiUrl, function() {
  togglbutton.render('.issueContainer', {}, function (elem) {
    var link, description,
      numElem = $('.issueId', elem),
      titleElem = $('.issue-summary', elem),
      projectElem = $('.something');

    description = titleElem.innerHTML;
    if (numElem !== null) {
      description = numElem.innerHTML + " " + description;
    }

    link = togglbutton.createTimerLink({
      className: 'youtrack',
      description: description,
      projectName: projectElem && projectElem.textContent
    });

    $('.fsi-toolbar-content').appendChild(link);
  });

});
