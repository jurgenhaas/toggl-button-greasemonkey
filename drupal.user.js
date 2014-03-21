// ==UserScript==
// @name        drupal
// @namespace   https://github.com/jurgenhaas/toggl-button-greasemonkey
// @version     0.01
// @include     https://drupal.org/node/*
// @grant       GM_xmlhttpRequest
// @require     https://raw.githubusercontent.com/jurgenhaas/toggl-button-greasemonkey/master/TogglLibrary.js
// ==/UserScript==

// <body class="html not-front logged-in one-sidebar sidebar-second page-node page-node- page-node-1391926 node-type-project-issue drupalorg-site-main" >

TogglButton.fetchUser(TogglButton.$newApiUrl, function() {
  togglbutton.render('body.node-type-project-issue', {}, function (elem) {

    var link, description,
      href = document.getElementById('tabs').getElementsByTagName('a')[0].getAttribute('href'),
      id = href.match(/(?:node|comment\/reply)\/(\d+)/)[1],
      titleElem = $('#page-subtitle', elem),
      projectElem = $('.something');

    description = titleElem.innerHTML;
    if (id !== null) {
      description = id + " " + description;
    }

    link = togglbutton.createTimerLink({
      className: 'drupal',
      description: description,
      projectName: projectElem && projectElem.textContent
    });

    $('#tabs').appendChild(link);
  });

});
