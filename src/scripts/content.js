'use strict';

require('./helpers');

const IssueButton = require('./classes/IssueButton');

/**
 * Check location href and document title for validate page
 * @param {string} url
 * @return {boolean}
 */
function isIssuePage(url) {
  return new RegExp(url + 'issues/[0-9]{1,}').test(window.location.href) &&
  ! (/\b403\b|\b404\b/).test(document.title);
}

/**
 * Return the issue identifier from location path name
 * @return {string} Identifier
 */
function getIssueIdByLocationPathName() {
  return window.location.pathname.replace(/.*\/issues\/|\/.*/g, '');
}

/**
 * Init UI component
 */
chrome.storage.sync.get(null, (data) => {
  if ( isIssuePage(data.options.redmineUrl) ) {
    let issueId     = getIssueIdByLocationPathName();
    let issueButton = new IssueButton({
      issueId: issueId
    });

    if ( data.issues[issueId] ) {
      issueButton.isAdded = true;

      if ( data.issues[issueId].isPlaying ) {
        issueButton.isPlaying = true;
      }
    }

    issueButton.init();

    document.body.insertAdjacentElement('afterEnd', issueButton.elem);
  }
});
