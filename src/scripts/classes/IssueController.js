'use strict';

const Timer = require('./Timer');

class IssueController {

  constructor(redmineApi) {
    this.timePrecision = 3;
    this.redmineApi    = redmineApi;

    chrome.runtime.onMessage.addListener(this.callMethod.bind(this));
  }

  callMethod(options, sender, sendResponse) {
    if ( typeof this[options.action] === 'function' ) {
      this[options.action](options, sendResponse, sender);
    }
    return true;
  }

  startTimer(options, sendResponse) {
    let issueId = options.issueId;

    chrome.storage.sync.get(null, (data) => {
      if ( data.nowPlaying == null || data.nowPlaying == issueId ) {
        if ( data.issues[issueId].isPlaying ) {
          data.nowPlaying = null;
          data.issues[issueId].isPlaying = false;

          this._showNotification('pause', `Stop tracking bug-${issueId}`);
        } else {
          data.nowPlaying = issueId;
          data.issues[issueId].isPlaying = true;

          this._showNotification('start', `Start tracking bug-${issueId}`);
        }

        data.issues[issueId].timestamps.push( Date.now() );

        chrome.storage.sync.set(data, sendResponse.bind(null, data.nowPlaying));
      } else if ( data.nowPlaying != issueId ) {
        sendResponse(data.nowPlaying);
      }
    });
  }

  record(options, sendResponse) {
    let issueId = options.issueId;

    switch(options.step) {
    case 'count':
      chrome.storage.sync.get('issues', (data) => {
        let hours = 0.00;

        if (data.issues[issueId].timestamps.length) {
          let milliseconds = Timer.countTimestamps(data.issues[issueId].timestamps);

          hours = Timer.getMillisecondsToHours(milliseconds, this.timePrecision);
        }

        sendResponse(hours);
      });
      break;
    case 'confirm':
      this.redmineApi.postIssueTimeEntries({
        data: {
          issueId: issueId,
          hours: options.hours || '',
          comments: options.comments || ''
        },
        onSuccess: (timeEntrieslist) => {
          sendResponse(timeEntrieslist);

          this.resetTimestamps(issueId);
          this._showNotification('is-recorded', `bug-${issueId} is recorded`);
        },
        onError: () => {
          this._showNotification('fail-recorded', `Somthing go wrong, please try again`);
        }
      });
      break;
    }
  }

  addIssueToTrack(options, sendResponse) {
    let issueId = options.issueId;

    this.redmineApi.getIssue({
      issueId: issueId,
      onSuccess: (issue) => {
        chrome.storage.sync.get('issues', (issues) => {
          issues.issues[issueId] = issue;

          chrome.storage.sync.set(issues, sendResponse);

          this._showNotification('is-added', `bug-${issueId} added to track`);
        });
      },
      onError: () => {
        this._showNotification('is-added-wrong', `bug-${issueId} not added, please try again`);
      }
    });
  }

  removeIssueFromTrack(options, sendResponse) {
    let issueId = options.issueId;

    chrome.storage.sync.get(null, (data) => {
      if (data.nowPlaying == issueId) {
        data.nowPlaying = null;
      }

      delete data.issues[issueId];

      chrome.storage.sync.set(data, sendResponse);

      this._showNotification('is-removed', `bug-${issueId} removed from track`);
    });
  }

  resetTimestamps(issueId) {
    chrome.storage.sync.get('issues', (data) => {
      data.issues[issueId].timestamps = [];

      chrome.storage.sync.set(data, () => {
        console.log(`Issue ${issueId} timestamps is reseted`);
      });
    });
  }

  _showNotification(id, message) {
    chrome.notifications.create(id, {
      type: 'basic',
      title: 'Redmine Issue Timer',
      message: message,
      iconUrl: '/assets/images/icon.png',
    }, (id) => { });
  }
}

module.exports = IssueController;
