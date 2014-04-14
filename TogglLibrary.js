/*------------------------------------------------------------------------
 * JavaScript Library for Toggl-Button for Greasemonkey
 *
 * (c) Jürgen Haas
 * Version: 1.0-beta.3
 *
 * @see https://github.com/jurgenhaas/toggl-button-greasemonkey
 *------------------------------------------------------------------------
 */

var TogglButtonGM = {
  $apiUrl: "https://www.toggl.com/api/v7",
  $newApiUrl: "https://new.toggl.com/api/v8",
  $triedAlternative: false,
  $api_token: null,
  $default_wid: null,
  $clientMap: {},
  $projectMap: {},
  $curEntryId: null,
  $isStarted: false,
  $link: null,
  $buttonTypeMinimal: false,
  $projectSelector: window.location.host,
  $projectId: null,
  $projectSelected: false,
  $projectSelectElem: null,

  render: function (selector, opts, renderer) {
    if (TogglButtonGM.newMessage({type: 'activate'})) {
      TogglButtonGM.renderTo(selector, renderer);
      window.addEventListener('focus', function () {
        // check the status of the current link
        var opts = {
          type: 'checkCurrentLinkStatus'
        };
        TogglButtonGM.newMessage(opts);
      });
    }
  },

  renderTo: function (selector, renderer) {
    var i, len, elems = document.querySelectorAll(selector);
    for (i = 0, len = elems.length; i < len; i += 1) {
      elems[i].classList.add('toggl');
    }
    for (i = 0, len = elems.length; i < len; i += 1) {
      renderer(elems[i]);
    }
  },

  createTimerLink: function (params) {
    if (params.projectIds !== undefined) {
      this.$projectSelector += '-' + params.projectIds.join('-');
    }
    TogglButtonGM.updateProjectId();
    GM_addStyle(GM_getResourceText('togglStyle'));
    this.$link = TogglButtonGM.createLink('toggl-button');
    this.$link.classList.add(params.className);

    if (params.buttonType === 'minimal') {
      this.$link.classList.add('min');
      this.$link.removeChild(this.$link.firstChild);
      this.$buttonTypeMinimal = true;
    }

    this.$link.addEventListener('click', function (e) {
      var opts = '';
      e.preventDefault();
      if (TogglButtonGM.$isStarted) {
        opts = {type: 'stop'};
      } else {
        var billable = false;
        if (TogglButtonGM.$projectId != undefined && TogglButtonGM.$projectId > 0) {
          billable = TogglButtonGM.$projectMap[TogglButtonGM.$projectId].billable;
        }
        opts = {
          type: 'timeEntry',
          $projectId: TogglButtonGM.$projectId || null,
          billable: billable,
          description: TogglButtonGM.invokeIfFunction(params.description),
          createdWith: 'TogglButtonGM TogglButtonGM - ' + params.className
        };
      }
      TogglButtonGM.newMessage(opts);
      TogglButtonGM.updateLink();

      return false;
    });

    // new button created - reset state
    this.$isStarted = false;

    // check if our link is the current time entry and set the state if it is
    var opts = {
      type: 'checkCurrentTimeEntry',
      $projectId: TogglButtonGM.$projectId,
      description: TogglButtonGM.invokeIfFunction(params.description)
    };
    TogglButtonGM.newMessage(opts);

    if (params.targetSelectors == undefined) {
      var wrapper = document.createElement('div'),
        content = TogglButtonGM.createTag('div', 'content');
      wrapper.id = 'toggl-button-wrapper';
      content.appendChild(this.$link);
      content.appendChild(TogglButtonGM.createProjectSelect());
      wrapper.appendChild(content);
      $('body').appendChild(wrapper);
    } else {
      if (params.targetSelectors.link != undefined) {
        $(params.targetSelectors.link).appendChild(this.$link);
      }
      if (params.targetSelectors.projectSelect != undefined) {
        $(params.targetSelectors.projectSelect).appendChild(TogglButtonGM.createProjectSelect());
      }
    }

    return this.$link;
  },

  fetchUser: function (apiUrl, callback) {
    var timeNow = new Date().getTime(),
      timeAuth = GM_getValue('_authenticated', 0);
    this.$api_token   = GM_getValue('_api_token', false);
    if ((timeNow - timeAuth) < (6*60*60*1000)) {
      this.$default_wid = GM_getValue('_default_wid', 0);
      this.$clientMap   = JSON.parse(GM_getValue('_clientMap', {}));
      this.$projectMap  = JSON.parse(GM_getValue('_projectMap', {}));
      callback();
      return;
    }

    var headers = {};
    if (this.$api_token) {
      headers['Authorization'] = "Basic " + btoa(TogglButtonGM.$api_token + ':api_token');
    }
    GM_xmlhttpRequest({
      method: "GET",
      url: apiUrl + "/me?with_related_data=true",
      headers: headers,
      onload: function(result) {
        if (result.status === 200) {
          var resp = JSON.parse(result.responseText);
          TogglButtonGM.$clientMap[0] = 'No Client';
          if (resp.data.clients) {
            resp.data.clients.forEach(function (client) {
              TogglButtonGM.$clientMap[client.id] = client.name;
            });
          }
          if (resp.data.projects) {
            resp.data.projects.forEach(function (project) {
              if (TogglButtonGM.$clientMap[project.cid] == undefined) {
                project.cid = 0;
              }
              if (project.active) {
                TogglButtonGM.$projectMap[project.id] = {
                  id: project.id,
                  cid: project.cid,
                  name: project.name,
                  billable: project.billable
                };
              }
            });
          }
          GM_setValue('_authenticated', new Date().getTime());
          GM_setValue('_api_token', resp.data.api_token);
          GM_setValue('_default_wid', resp.data.default_wid);
          GM_setValue('_clientMap', JSON.stringify(TogglButtonGM.$clientMap));
          GM_setValue('_projectMap', JSON.stringify(TogglButtonGM.$projectMap));
          TogglButtonGM.$api_token = resp.data.api_token;
          TogglButtonGM.$default_wid = resp.data.default_wid;
          callback();
        } else if (!TogglButtonGM.$triedAlternative) {
          TogglButtonGM.$triedAlternative = true;
          if (apiUrl === TogglButtonGM.$apiUrl) {
            TogglButtonGM.fetchUser(TogglButtonGM.$newApiUrl, callback);
          } else if (apiUrl === TogglButtonGM.$newApiUrl) {
            TogglButtonGM.fetchUser(TogglButtonGM.$apiUrl, callback);
          }
        } else if (TogglButtonGM.$api_token) {
          // Delete the API token and try again
          GM_setValue('_api_token', false);
          TogglButtonGM.$triedAlternative = false;
          TogglButtonGM.fetchUser(TogglButtonGM.$newApiUrl, callback);
        } else {
          var wrapper = document.createElement('div'),
            content = TogglButtonGM.createTag('div', 'content'),
            link = TogglButtonGM.createLink('login', 'a', 'https://new.toggl.com/', 'Login');
          GM_addStyle(GM_getResourceText('togglStyle'));
          link.target = '_blank';
          wrapper.id = 'toggl-button-auth-failed';
          content.appendChild(document.createTextNode('Authorization to your Toggl account failed!'));
          content.appendChild(link);
          wrapper.appendChild(content);
          $('body').appendChild(wrapper);
        }
      }
    });
  },

  createTimeEntry: function (timeEntry) {
    var start = new Date(),
      entry = {
        time_entry: {
          start: start.toISOString(),
          description: timeEntry.description,
          wid: TogglButtonGM.$default_wid,
          pid: timeEntry.$projectId || null,
          billable: timeEntry.billable || false,
          duration: -(start.getTime() / 1000),
          created_with: timeEntry.createdWith || 'TogglButtonGM TogglButtonGM'
        }
      };
    GM_xmlhttpRequest({
      method: "POST",
      url: TogglButtonGM.$newApiUrl + "/time_entries",
      headers: {
        "Authorization": "Basic " + btoa(TogglButtonGM.$api_token + ':api_token')
      },
      data: JSON.stringify(entry),
      onload: function(res) {
        var responseData, entryId;
        responseData = JSON.parse(res.responseText);
        entryId = responseData && responseData.data && responseData.data.id;
        TogglButtonGM.$curEntryId = entryId;
      }
    });
  },

  checkCurrentTimeEntry: function (params) {
    GM_xmlhttpRequest({
      method: "GET",
      url: TogglButtonGM.$newApiUrl + "/time_entries/current",
      headers: {
        "Authorization": "Basic " + btoa(TogglButtonGM.$api_token + ':api_token')
      },
      onload: function(result) {
        if (result.status === 200) {
          var resp = JSON.parse(result.responseText);
          if (resp == null) {
            return;
          }
          if (params.description === resp.data.description) {
            TogglButtonGM.$curEntryId = resp.data.id;
            TogglButtonGM.$isStarted = false;
            TogglButtonGM.updateLink();
          }
        }
      }
    });
  },

  stopTimeEntry: function (entryId) {
    entryId = entryId || TogglButtonGM.$curEntryId;
    if (!entryId) {
      return;
    }
    GM_xmlhttpRequest({
      method: "PUT",
      url: TogglButtonGM.$newApiUrl + "/time_entries/" + entryId + "/stop",
      headers: {
        "Authorization": "Basic " + btoa(TogglButtonGM.$api_token + ':api_token')
      }
    });
  },

  checkCurrentLinkStatus: function () {
    GM_xmlhttpRequest({
      method: "GET",
      url: TogglButtonGM.$newApiUrl + "/time_entries/current",
      headers: {
        "Authorization": "Basic " + btoa(TogglButtonGM.$api_token + ':api_token')
      },
      onload: function(result) {
        if (result.status === 200) {
          var updateRequired = false,
            resp = JSON.parse(result.responseText);
          if (resp.data == null) {
            if (TogglButtonGM.$isStarted) {
              TogglButtonGM.$isStarted = false;
              updateRequired = true;
            }
          } else {
            if (TogglButtonGM.$curEntryId == resp.data.id) {
              if (!TogglButtonGM.$isStarted) {
                TogglButtonGM.$isStarted = true;
                updateRequired = true;
              }
            } else {
              if (TogglButtonGM.$isStarted) {
                TogglButtonGM.$isStarted = false;
                updateRequired = true;
              }
            }
          }
          if (updateRequired) {
            if (!TogglButtonGM.$isStarted) {
              TogglButtonGM.$curEntryId = null;
            }
            TogglButtonGM.$isStarted = !TogglButtonGM.$isStarted;
            TogglButtonGM.updateLink();
          }
        }
      }
    });
  },

  newMessage: function (request) {
    if (request.type === 'activate') {
      // TODO: Can we show something in the main window or the URL bar?
      return (TogglButtonGM.$user !== null);
    } else if (request.type === 'timeEntry') {
      TogglButtonGM.createTimeEntry(request);
    } else if (request.type === 'stop') {
      TogglButtonGM.stopTimeEntry();
    } else if (request.type === 'checkCurrentTimeEntry') {
      TogglButtonGM.checkCurrentTimeEntry(request);
    } else if (request.type === 'checkCurrentLinkStatus') {
      TogglButtonGM.checkCurrentLinkStatus();
    }
  },

  createTag: function (name, className, innerHTML) {
    var tag = document.createElement(name);
    tag.className = className;

    if (innerHTML) {
      tag.innerHTML = innerHTML;
    }

    return tag;
  },

  createLink: function (className, tagName, linkHref, linkText) {
    var link;

    // Param defaults
    tagName  = tagName  || 'a';
    linkHref = linkHref || '#';
    linkText = linkText || 'Start timer';
    link     = TogglButtonGM.createTag(tagName, className);

    if (tagName === 'a') {
      link.href = linkHref;
    }

    link.appendChild(document.createTextNode(linkText));
    return link;
  },

  updateLink: function () {
    var linkText, color = '';

    if (TogglButtonGM.$isStarted) {
      TogglButtonGM.$link.classList.remove('active');
      linkText = 'Start timer';
    } else {
      TogglButtonGM.$link.classList.add('active');
      color = '#1ab351';
      linkText = 'Stop timer';
    }
    TogglButtonGM.$isStarted = !TogglButtonGM.$isStarted;
    TogglButtonGM.$link.style.color = color;
    if (!TogglButtonGM.$buttonTypeMinimal) {
      TogglButtonGM.$link.innerHTML = linkText;
    }

    TogglButtonGM.$projectSelectElem.disabled = TogglButtonGM.$isStarted;
  },

  updateProjectId: function (id) {
    id = id || GM_getValue(TogglButtonGM.$projectSelector, 0);

    TogglButtonGM.$projectSelected = (id != 0);

    if (id <= 0) {
      TogglButtonGM.$projectId = null;
    }
    else {
      TogglButtonGM.$projectId = id;
    }

    if (TogglButtonGM.$projectSelectElem != undefined) {
      TogglButtonGM.$projectSelectElem.value = id;
      TogglButtonGM.$projectSelectElem.disabled = TogglButtonGM.$isStarted;
    }

    GM_setValue(TogglButtonGM.$projectSelector, id);

    if (TogglButtonGM.$link != undefined) {
      if (TogglButtonGM.$projectSelected) {
        TogglButtonGM.$link.classList.remove('hidden');
      }
      else {
        TogglButtonGM.$link.classList.add('hidden');
      }
    }
  },

  invokeIfFunction: function (trial) {
    if (trial instanceof Function) {
      return trial();
    }
    return trial;
  },

  createProjectSelect: function () {
    var pid,
      wrapper = TogglButtonGM.createTag('div', 'toggl-button-project-select'),
      noneOptionAdded = false,
      noneOption = document.createElement('option'),
      emptyOption = document.createElement('option'),
      resetOption = document.createElement('option');

    TogglButtonGM.$projectSelectElem = TogglButtonGM.createTag('select');

    // None Option to indicate that a project should be selected first
    if (!TogglButtonGM.$projectSelected) {
      noneOption.setAttribute('value', '0');
      noneOption.text = '- First select a project -';
      TogglButtonGM.$projectSelectElem.appendChild(noneOption);
      noneOptionAdded = true;
    }

    // Empty Option for tasks with no project
    emptyOption.setAttribute('value', '-1');
    emptyOption.text = 'No Project';
    TogglButtonGM.$projectSelectElem.appendChild(emptyOption);

    for (pid in TogglButtonGM.$projectMap) {
      var optgroup, project;
      //noinspection JSUnfilteredForInLoop
      project = TogglButtonGM.$projectMap[pid];
      if (typeof TogglButtonGM.$clientMap[project.cid] === 'string') {
        optgroup = TogglButtonGM.createTag('optgroup');
        optgroup.label = TogglButtonGM.$clientMap[project.cid];
        TogglButtonGM.$clientMap[project.cid] = optgroup;
        TogglButtonGM.$projectSelectElem.appendChild(optgroup);
      } else {
        optgroup = TogglButtonGM.$clientMap[project.cid];
      }
      var option = document.createElement('option');
      option.setAttribute('value', project.id);
      option.text = project.name;
      optgroup.appendChild(option);
    }

    // Reset Option to reload settings and projects from Toggl
    resetOption.setAttribute('value', 'RESET');
    resetOption.text = 'Reload settings';
    TogglButtonGM.$projectSelectElem.appendChild(resetOption);

    TogglButtonGM.$projectSelectElem.addEventListener('change', function () {
      if (TogglButtonGM.$projectSelectElem.value == 'RESET') {
        GM_setValue('_authenticated', 0);
        window.location.reload();
        return;
      }

      if (noneOptionAdded) {
        TogglButtonGM.$projectSelectElem.removeChild(noneOption);
        noneOptionAdded = false;
      }

      TogglButtonGM.updateProjectId(TogglButtonGM.$projectSelectElem.value);

    });

    TogglButtonGM.updateProjectId(TogglButtonGM.$projectId);

    wrapper.appendChild(TogglButtonGM.$projectSelectElem);
    return wrapper;
  }

};

function $(s, elem) {
  elem = elem || document;
  return elem.querySelector(s);
}
