/*------------------------------------------------------------------------
 * JavaScript Library for Toggl-Button for Greasemonkey
 *
 * (c) Jürgen Haas
 * Version: 1.0-beta.2
 *
 * @see https://github.com/jurgenhaas/toggl-button-greasemonkey
 *------------------------------------------------------------------------
 */

var TogglButton = {
  $apiUrl: "https://www.toggl.com/api/v7",
  $newApiUrl: "https://new.toggl.com/api/v8",
  $triedAlternative: false,
  $api_token: null,
  $default_wid: null,
  $clientMap: {},
  $projectMap: {},
  $curEntryId: null,

  fetchUser: function (apiUrl, callback) {
    var timeNow = new Date().getTime(),
      timeAuth = GM_getValue('_authenticated', 0);
    if ((timeNow - timeAuth) < (6*60*60*1000)) {
      this.$api_token   = GM_getValue('_api_token', false);
      this.$default_wid = GM_getValue('_default_wid', 0);
      this.$clientMap   = JSON.parse(GM_getValue('_clientMap', {}));
      this.$projectMap  = JSON.parse(GM_getValue('_projectMap', {}));
      callback();
      return;
    }
    GM_xmlhttpRequest({
      method: "GET",
      url: apiUrl + "/me?with_related_data=true",
      onload: function(result) {
        if (result.status === 200) {
          var resp = JSON.parse(result.responseText);
          TogglButton.$clientMap[0] = 'No Client';
          if (resp.data.clients) {
            resp.data.clients.forEach(function (client) {
              TogglButton.$clientMap[client.id] = client.name;
            });
          }
          if (resp.data.projects) {
            resp.data.projects.forEach(function (project) {
              if (TogglButton.$clientMap[project.cid] == undefined) {
                project.cid = 0;
              }
              if (project.active) {
                TogglButton.$projectMap[project.id] = {
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
          GM_setValue('_clientMap', JSON.stringify(TogglButton.$clientMap));
          GM_setValue('_projectMap', JSON.stringify(TogglButton.$projectMap));
          TogglButton.$api_token = resp.data.api_token;
          TogglButton.$default_wid = resp.data.default_wid;
          callback();
        } else if (!TogglButton.$triedAlternative) {
          TogglButton.$triedAlternative = true;
          if (apiUrl === TogglButton.$apiUrl) {
            TogglButton.fetchUser(TogglButton.$newApiUrl, callback);
          } else if (apiUrl === TogglButton.$newApiUrl) {
            TogglButton.fetchUser(TogglButton.$apiUrl, callback);
          }
        } else {
          var wrapper = document.createElement('div'),
            content = createTag('div', 'content'),
            link = createLink('login', 'a', 'https://new.toggl.com/', 'Login');
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
          wid: TogglButton.$default_wid,
          pid: timeEntry.projectId || null,
          billable: timeEntry.billable || false,
          duration: -(start.getTime() / 1000),
          created_with: timeEntry.createdWith || 'GM TogglButton'
        }
      };
    GM_xmlhttpRequest({
      method: "POST",
      url: TogglButton.$newApiUrl + "/time_entries",
      headers: {
        "Authorization": "Basic " + btoa(TogglButton.$api_token + ':api_token')
      },
      data: JSON.stringify(entry),
      onload: function(res) {
        var responseData, entryId;
        responseData = JSON.parse(res.responseText);
        entryId = responseData && responseData.data && responseData.data.id;
        TogglButton.$curEntryId = entryId;
      }
    });
  },

  checkCurrentTimeEntry: function (params) {
    GM_xmlhttpRequest({
      method: "GET",
      url: TogglButton.$newApiUrl + "/time_entries/current",
      headers: {
        "Authorization": "Basic " + btoa(TogglButton.$api_token + ':api_token')
      },
      onload: function(result) {
        if (result.status === 200) {
          var resp = JSON.parse(result.responseText);
          if (resp == null) {
            return;
          }
          if (params.description === resp.data.description) {
            TogglButton.$curEntryId = resp.data.id;
            togglbutton.isStarted = false;
            updateLink();
          }
        }
      }
    });
  },

  stopTimeEntry: function (entryId) {
    entryId = entryId || TogglButton.$curEntryId;
    if (!entryId) {
      return;
    }
    GM_xmlhttpRequest({
      method: "PUT",
      url: TogglButton.$newApiUrl + "/time_entries/" + entryId + "/stop",
      headers: {
        "Authorization": "Basic " + btoa(TogglButton.$api_token + ':api_token')
      }
    });
  },

  newMessage: function (request) {
    if (request.type === 'activate') {
      // TODO: Can we show something in the main window or the URL bar?
      return (TogglButton.$user !== null);
    } else if (request.type === 'timeEntry') {
      TogglButton.createTimeEntry(request);
    } else if (request.type === 'stop') {
      TogglButton.stopTimeEntry();
    } else if (request.type === 'checkCurrentTimeEntry') {
      TogglButton.checkCurrentTimeEntry(request);
    }
  }

};

function $(s, elem) {
  elem = elem || document;
  return elem.querySelector(s);
}

function createTag(name, className, innerHTML) {
  var tag = document.createElement(name);
  tag.className = className;

  if (innerHTML) {
    tag.innerHTML = innerHTML;
  }

  return tag;
}

function createLink(className, tagName, linkHref, linkText) {
  var link;

  // Param defaults
  tagName  = tagName  || 'a';
  linkHref = linkHref || '#';
  linkText = linkText || 'Start timer';
  link     = createTag(tagName, className);

  if (tagName === 'a') {
    link.href = linkHref;
  }

  link.appendChild(document.createTextNode(linkText));
  return link;
}

function updateLink() {
  var linkText, color = '';

  if (togglbutton.isStarted) {
    togglbutton.link.classList.remove('active');
    linkText = 'Start timer';
  } else {
    togglbutton.link.classList.add('active');
    color = '#1ab351';
    linkText = 'Stop timer';
  }
  togglbutton.isStarted = !togglbutton.isStarted;
  togglbutton.link.style.color = color;
  if (!togglbutton.buttonTypeMinimal) {
    togglbutton.link.innerHTML = linkText;
  }

  togglbutton.projectSelectElem.disabled = togglbutton.isStarted;
}

function invokeIfFunction(trial) {
  if (trial instanceof Function) {
    return trial();
  }
  return trial;
}

var togglbutton = {
  isStarted: false,
  link: null,
  buttonTypeMinimal: false,
  projectSelector: window.location.host,
  projectId: 0,
  projectSelectElem: null,
  render: function (selector, opts, renderer) {
    if (TogglButton.newMessage({type: 'activate'})) {
      togglbutton.renderTo(selector, renderer);
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
      this.projectSelector += '-' + params.projectIds.join('-');
    }
    this.projectId = GM_getValue(this.projectSelector, 0);
    GM_addStyle(GM_getResourceText('togglStyle'));
    this.link = createLink('toggl-button');
    this.link.classList.add(params.className);

    if (params.buttonType === 'minimal') {
      this.link.classList.add('min');
      this.link.removeChild(this.link.firstChild);
      this.buttonTypeMinimal = true;
    }

    this.link.addEventListener('click', function (e) {
      var opts = '';
      e.preventDefault();
      if (togglbutton.isStarted) {
        opts = {type: 'stop'};
      } else {
        opts = {
          type: 'timeEntry',
          projectId: togglbutton.projectId,
          billable: TogglButton.$projectMap[togglbutton.projectId].billable,
          description: invokeIfFunction(params.description),
          createdWith: 'GM TogglButton - ' + params.className
        };
      }
      TogglButton.newMessage(opts);
      updateLink();

      return false;
    });

    // new button created - reset state
    this.isStarted = false;

    // check if our link is the current time entry and set the state if it is
    var opts = {
      type: 'checkCurrentTimeEntry',
      projectId: togglbutton.projectId,
      description: invokeIfFunction(params.description)
    };
    TogglButton.newMessage(opts);

    $(params.targetSelectors.link).appendChild(this.link);
    $(params.targetSelectors.projectSelect).appendChild(createProjectSelect());

    return this.link;
  }
};

function createProjectSelect() {
  var pid,
    wrapper = createTag('div', 'toggl-button-project-select'),
    resetOption = document.createElement('option');

  togglbutton.projectSelectElem = createTag('select');

  for (pid in TogglButton.$projectMap) {
    var optgroup, project = TogglButton.$projectMap[pid];
    if (typeof TogglButton.$clientMap[project.cid] === 'string') {
      optgroup = createTag('optgroup');
      optgroup.label = TogglButton.$clientMap[project.cid];
      TogglButton.$clientMap[project.cid] = optgroup;
      togglbutton.projectSelectElem.appendChild(optgroup);
    } else {
      optgroup = TogglButton.$clientMap[project.cid];
    }
    var option = document.createElement('option');
    option.setAttribute('value', project.id);
    option.text = project.name;
    optgroup.appendChild(option);
  }
  resetOption.setAttribute('value', 'RESET');
  resetOption.text = 'Reload settings';
  togglbutton.projectSelectElem.appendChild(resetOption);

  togglbutton.projectSelectElem.addEventListener('change', function (e) {
    if (togglbutton.projectSelectElem.value == 'RESET') {
      GM_setValue('_authenticated', 0);
      window.location.reload();
      return;
    }
    togglbutton.projectId = togglbutton.projectSelectElem.value;
    GM_setValue(togglbutton.projectSelector, togglbutton.projectId);

  });

  togglbutton.projectSelectElem.value = togglbutton.projectId;
  togglbutton.projectSelectElem.disabled = togglbutton.isStarted;

  wrapper.appendChild(togglbutton.projectSelectElem);
  return wrapper;
}
