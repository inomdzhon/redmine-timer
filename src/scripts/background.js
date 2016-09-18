'use strict';

const RedmineIssueApi = require('./classes/RedmineIssueApi');
const IssueController = require('./classes/IssueController');

initListener();

function initListener() {
  chrome.storage.sync.get(null, (data) => {
    if ( ! data.options && ! data.issues ) {
      initStorage();
    }

    window.redmineApi = new RedmineIssueApi({
      url    : data.options.redmineUrl,
      apiKey : data.options.redmineApiKey,
    });

    new IssueController(window.redmineApi);
  });
}

function initStorage() {
  let data = {
    issues: {},
    options: {
      redmineUrl: '',
      redmineApiKey: '',
    },
    nowPlaying: null,
  };

  chrome.storage.sync.set(data, initListener);
}
