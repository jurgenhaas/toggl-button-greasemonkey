// ==UserScript==
// @name        Toggl-Button
// @namespace   https://github.com/jurgenhaas/toggl-button-greasemonkey
// @version     1.0
// @include     *
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_info
// @grant       GM_registerMenuCommand
// @require     https://raw.githubusercontent.com/jurgenhaas/toggl-button-greasemonkey/v1.1/TogglLibrary.js
// @resource    togglStyle https://raw.githubusercontent.com/jurgenhaas/toggl-button-greasemonkey/v1.1/TogglLibrary.css
// ==/UserScript==

new TogglButtonGM('body', function (elem) {
  return {
    generalMode: true
  };
});
