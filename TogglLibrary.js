var TogglButton = {
  $user: null,
  $apiUrl: "https://www.toggl.com/api/v7",
  $newApiUrl: "https://new.toggl.com/api/v8",
  $curEntryId: null,

  fetchUser: function (apiUrl, callback) {
    GM_xmlhttpRequest({
      method: "GET",
      url: apiUrl + "/me?with_related_data=true",
      onload: function(result) {
        if (result.status === 200) {
          var projectMap = {}, resp = JSON.parse(result.responseText);
          if (resp.data.projects) {
            resp.data.projects.forEach(function (project) {
              projectMap[project.name] = project.id;
            });
          }
          TogglButton.$user = resp.data;
          TogglButton.$user.projectMap = projectMap;
          callback();
        } else if (apiUrl === TogglButton.$apiUrl) {
          TogglButton.fetchUser(TogglButton.$newApiUrl);
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
          wid: TogglButton.$user.default_wid,
          pid: timeEntry.projectId || null,
          billable: timeEntry.billable || false,
          duration: -(start.getTime() / 1000),
          created_with: timeEntry.createdWith || 'GM TogglButton'
        }
      };
    if (timeEntry.projectName !== undefined) {
      entry.time_entry.pid = TogglButton.$user.projectMap[timeEntry.projectName];
    }
    GM_xmlhttpRequest({
      method: "POST",
      url: TogglButton.$newApiUrl + "/time_entries",
      headers: {
        "Authorization": "Basic " + btoa(TogglButton.$user.api_token + ':api_token')
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
      onload: function(result) {
        if (result.status === 200) {
          var resp = JSON.parse(result.responseText);
          if (resp == null) {
            return;
          }
          if (params.description === resp.data.description) {
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
        "Authorization": "Basic " + btoa(TogglButton.$user.api_token + ':api_token')
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

function createLink(className, tagName, linkHref) {
  var link;

  // Param defaults
  tagName  = tagName  || 'a';
  linkHref = linkHref || '#';
  link     = createTag(tagName, className);

  if (tagName === 'a') {
    link.href = linkHref;
  }

  link.appendChild(document.createTextNode('Start timer'));
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
          projectId: invokeIfFunction(params.projectId),
          description: invokeIfFunction(params.description),
          projectName: invokeIfFunction(params.projectName),
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
      projectId: invokeIfFunction(params.projectId),
      description: invokeIfFunction(params.description),
      projectName: invokeIfFunction(params.projectName)
    };
    TogglButton.newMessage(opts);

    return this.link;
  }
};
