'use strict';

class RedmineIssueApi {

  constructor(param) {
    this.url        = param.url;
    this.issueUrl   = param.url + 'issues/';
    this.apiKey     = window.btoa(param.apiKey + ':random'); // encode API key to Base64
    this.reqTimeout = 10000;
  }

  /**
   * Get Issue data
   * @param {string} issueId
   * @param {RedmineIssueApi~onSuccess} onSuccess
   * @param {RedmineIssueApi~onError} onError
   */
  getIssue({ issueId, onSuccess = () => {}, onError = () => {} }) {
    window.fetch(this.issueUrl + issueId + '.json', {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + this.apiKey
      },
    })
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        res.json()
        .then((data) => {
          onSuccess( this.getFilteredData(data) );
        })
        .catch((error) => {
          onError('Error parse JSON');
        });
      }
    })
    .catch((error) => {
      onError('Request failed');
    });
  }

  /**
   * Send issue time entries data
   * @param {Object} data
   * @param {string} data.issueId
   * @param {string} data.hours
   * @param {string} data.comments
   * @param {RedmineIssueApi~onSuccess} onSuccess
   */
  postIssueTimeEntries({ data, onSuccess = () => {}, onError = () => {} }) {
    window.fetch(this.url + 'time_entries.xml', {
      method: 'POST',
      body: this.getTimeEntryXml(data),
      headers: {
        'Authorization': 'Basic ' + this.apiKey,
        'Content-Type' : 'text/xml'
      }
    })
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        this.getIssuePage({
          issueId: data.issueId,
          onComplete: onSuccess
        });
      }
    })
    .catch((error) => {
      onError('Request failed');
    });
  }

  /**
   * Get updated issue page
   * @param {string} issueId
   * @param {RedmineIssueApi~onComplete} onComplete
   */
  getIssuePage({ issueId, onComplete = () => {} }) {
    window.fetch(this.issueUrl + issueId, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + this.apiKey
      }
    })
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        res.text()
        .then((data) => {
          onComplete( this.getIssueDescriptionByPage(data) );
        })
        .catch((error) => {
          onComplete(null);
        });
      }
    })
    .catch((error) => {
      onComplete(null);
    });
  }

  /**
   * Get description content by page
   * @param {string} htmlText
   * @return {Object|null}
   */
  getIssueDescriptionByPage(htmlText) {
    let fragment = document.createElement('div');

    fragment.innerHTML = htmlText;

    let link = fragment.querySelector('link[href*="issue_spent_time_description.css"');
    let list = fragment.querySelector('.issue');

    if (link && list) {
      return {
        link: link.outerHTML,
        list: list.outerHTML
      };
    } else {
      return null;
    }
  }

  /**
   * Filter issue data
   * @param {Object} data
   * @return {Object}
   */
  getFilteredData(data) {
    return {
      id: data.issue.id,
      isPlaying: false,
      timestamps: [],
      reference: this.issueUrl + data.issue.id,
      description: {
        project: data.issue.project.name || '',
        subject: data.issue.subject || '',
        estimatedHours: data.issue.estimated_hours || 0,
        spentHours: data.issue.spent_hours || 0
      }
    };
  }

  /**
   * Generate XML template for post time entries
   * @param {Object} data
   * @param {string} data.issueId
   * @param {string} data.hours
   * @param {string} data.comments
   * @return {string}
   */
  getTimeEntryXml(data) {
    return (`
      <?xml version="1.0" encoding="UTF-8"?>
        <time_entry>
        <issue_id>${data.issueId}</issue_id>
        <hours>${data.hours}</hours>
        <comments>${data.comments}</comments>
      </time_entry>
    `);
  }
}

module.exports = RedmineIssueApi;
