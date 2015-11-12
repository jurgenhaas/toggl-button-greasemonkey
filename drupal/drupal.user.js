// ==UserScript==
// @name        Toggl-Button Drupal
// @namespace   https://github.com/jurgenhaas/toggl-button-greasemonkey
// @version     1.3
// @include     https://www.drupal.org/node/*
// @include     https://www.drupal.org/project/issues/*
// @include     https://www.drupal.org/project/user
// @include     https://drupal.org/node/*
// @include     https://drupal.org/project/issues/*
// @include     https://drupal.org/project/user
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_info
// @grant       GM_registerMenuCommand
// @require     https://greasyfork.org/scripts/2670-toggllibrary/code/TogglLibrary.js
// @resource    togglStyle https://raw.githubusercontent.com/jurgenhaas/toggl-button-greasemonkey/v1.3/TogglLibrary.css
// @description Toggle button for Drupal issue queues
// ==/UserScript==

new TogglButtonGM('body.node-type-project-issue', function (elem) {
  var description, projectIds = [],
    href = document.getElementById('tabs').getElementsByTagName('a')[0].getAttribute('href'),
    id = href.match(/(?:node|comment\/reply)\/(\d+)/)[1],
    titleElem = elem.querySelector('#page-subtitle', elem),
    projectElem = document.querySelector('.field-name-field-project .field-items .field-item');

  description = titleElem.textContent.trim();
  if (id !== null) {
    description = id + " " + description;
  }

  if (projectElem !== null) {
    projectIds.push(projectElem.textContent.trim());
  }

  return {
    className: 'drupal',
    description: description,
    projectIds: projectIds
  };
});

new TogglButtonGM('body.page-project-issues table.views-table tbody tr', function (elem) {
  var description, projectIds = [],
    href = elem.querySelector('td.views-field-title a').getAttribute('href'),
    id = href.match(/(?:node|comment\/reply)\/(\d+)/)[1],
    titleElem = elem.querySelector('td.views-field-title a'),
    projectElem = document.querySelector('.breadcrumb a');

  description = titleElem.textContent.trim();
  if (id !== null) {
    description = id + " " + description;
  }

  if (projectElem !== null) {
    projectIds.push(projectElem.textContent.trim());
  }

  return {
    className: 'drupal',
    description: description,
    projectIds: projectIds,
    buttonType: 'minimal',
    targetSelectors: {
      context: elem,
      link: '.views-field-field-issue-assigned',
      projectSelect: '.views-field-created'
    }
  };
});

new TogglButtonGM('body.page-project-user .view-content table.views-table.project-issue tbody tr', function (elem) {
  var description, projectIds = [],
    href = elem.querySelector('td.views-field-title a').getAttribute('href'),
    id = href.match(/(?:node|comment\/reply)\/(\d+)/)[1],
    titleElem = elem.querySelector('td.views-field-title a'),
    projectElem = elem.querySelector('td.views-field-title-1 a');

  description = titleElem.textContent.trim();
  if (id !== null) {
    description = id + " " + description;
  }

  if (projectElem !== null) {
    projectIds.push(projectElem.textContent.trim());
  }

  return {
    className: 'drupal',
    description: description,
    projectIds: projectIds,
    buttonType: 'minimal',
    targetSelectors: {
      context: elem,
      link: '.views-field-name',
      projectSelect: '.views-field-created'
    }
  };
});
