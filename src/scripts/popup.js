'use strict';

require('./helpers');

const IssueCard = require('./classes/IssueCard');

/**
 * Init UI components
 */
chrome.storage.sync.get(null, (data) => {
  window.issues = {};

  let fragment = document.createDocumentFragment();
  let issues   = data.issues;

  for (let issueId in issues) {
    let issue = new IssueCard(issues[issueId]);

    window.issues[issueId] = issue;

    fragment.appendChild(issue.elem);
  }

  document.getElementById('issues-container').appendChild(fragment);
});
