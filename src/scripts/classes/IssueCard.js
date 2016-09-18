'use strict';

const Timer = require('./Timer');

class IssueCard {

  constructor(data) {
    this._data     = data;
    this.issueId   = this._data.id;
    this.isPlaying = this._data.isPlaying;
    this.seconds   = 0;
    this.timer     = {};

    this.elem      = null;
    this.elemTimer = null;

    this.init();
  }

  init() {
    this._render();

    this.elemTimer = window.qs('.js-current-time', this.elem);

    this.timer = new Timer({
      run: false,
      startTime: this.seconds,
      elem: this.elemTimer
    });

    if (this.isPlaying) {
      this._renderState();
    }

    window.$delegate(this.elem, 'click', '.js-start', this.startTimer.bind(this));
    window.$delegate(this.elem, 'click', '.js-record', this.record.bind(this));
    window.$delegate(this.elem, 'click', '.js-remove', this.removeIssueFromTrack.bind(this));
  }

  record() {
    if (this.isPlaying) {
      if ( confirm('Issue now tracking. Stop it?') ) {
        this.startTimer();
        return;
      } else {
        return;
      }
    }

    chrome.runtime.sendMessage({
      action  : 'record',
      step    : 'count',
      issueId : this.issueId
    }, (data) => {
      let hours = window.prompt('Correct hours (required)', data.hours);

      chrome.runtime.sendMessage({
        action   : 'record',
        step     : 'confirm',
        hours    : hours,
        comments : window.prompt('Type comments if need', ''),
        issueId  : this.issueId
      }, () => {
        this.setPlayingState(false);
        // TODO:
        // - maybe update time entries on issue page with replace
        // HTML after get updated page by AJAX
      });
    });
  }

  startTimer() {
    chrome.runtime.sendMessage({'action': 'startTimer', 'issueId': this.issueId }, (nowPlaying) => {
      switch(nowPlaying) {
      case this.issueId:
        this.setPlayingState(true);
        break;
      case null:
        this.setPlayingState(false);
        break;
      default:
        if ( confirm(`Now playing bug-${nowPlaying}. Pause it and start this issue?`) ) {
          chrome.runtime.sendMessage({'action': 'startTimer', 'issueId': nowPlaying }, () => {
            window.issues[nowPlaying].setPlayingState(false);
            this.startTimer();
          });
        }
      }

      chrome.storage.sync.get(null, (data) => console.log(data));
    });
  }

  removeIssueFromTrack() {
    if ( confirm('Please, confirm removing') ) {
      chrome.runtime.sendMessage({'action': 'removeIssueFromTrack', 'issueId': this.issueId }, () => {
        this.destroySelf();

        chrome.storage.sync.get(null, (data) => console.log(data));
      });
    }
  }

  setPlayingState(bool) {
    this.isPlaying = bool;
    this._renderState();
  }

  _render() {
    let template    = document.getElementById('issue-template').innerHTML;
    let fragment    = document.createElement('div');
    let currentTime = '00:00:00';
    let timerStart  = '---';

    if (this._data.timestamps.length) {
      if (this._data.timestamps.length % 2 !== 0) {
        this._data.timestamps.push( Date.now() );
      }

      let milliseconds = Timer.countTimestamps(this._data.timestamps);

      this.seconds = Timer.getMillisecondsToSeconds(milliseconds);

      currentTime = Timer.makeTimeFromSecond( this.seconds );
      timerStart  = Timer.humanDate(this._data.timestamps[0]);
    }

    template = template.
      replace(/{{issueId}}/g, this._data.id).
      replace(/{{project}}/g, this._data.description.project).
      replace(/{{subject}}/g, this._data.description.subject).
      replace(/{{reference}}/g, this._data.reference).
      replace(/{{spentHours}}/g, this._data.description.spentHours.toFixed(2)).
      replace(/{{estimatedHours}}/g, this._data.description.estimatedHours.toFixed(2)).
      replace(/{{currentTime}}/g, currentTime).
      replace(/{{timerStart}}/g, timerStart);

    fragment.innerHTML = template;
    this.elem = fragment.firstElementChild;
  }

  _renderState() {
    if (this.isPlaying) {
      window.qs('.js-start', this.elem).textContent = 'pause';
      this.timer.start();
    } else {
      window.qs('.js-start', this.elem).textContent = 'start';
      this.timer.pause();
    }
  }

  destroySelf() {
    this.elem.remove();
    delete this;
  }
}

module.exports = IssueCard;
