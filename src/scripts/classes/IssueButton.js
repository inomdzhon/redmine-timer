'use strict';

class IssueButton {

  constructor(param) {
    this.issueId   = param.issueId;
    this.isAdded   = false;
    this.isPlaying = false;

    this.elem         = null;
    this.elemControls = null;
  }

  init() {
    this._render();
    this._renderState();

    window.$delegate(this.elem, 'click', '.ritControls__add', this.addIssueToTrack.bind(this));
    window.$delegate(this.elem, 'click', '.ritControls__remove', this.removeIssueFromTrack.bind(this));
    window.$delegate(this.elem, 'click', '.ritControls__start', this.startTimer.bind(this));
    window.$delegate(this.elem, 'click', '.ritControls__end', this.record.bind(this));
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
    }, (hours) => {
      hours = prompt('Correct hours (required)', hours);

      chrome.runtime.sendMessage({
        action   : 'record',
        step     : 'confirm',
        hours    : hours,
        comments : prompt('Type comments if need', ''),
        issueId  : this.issueId
      }, (data) => {
        this.setPlayingState(false);

        if ( data ) {
          if ( ! window.qs('link[href*="issue_spent_time_description.css"') ) {
            document.head.insertAdjacentHTML('beforeEnd', data.link);
          }

          window.qs('.issue').innerHTML = data.list;
        }
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
            this.startTimer();
          });
        }
      }

      chrome.storage.sync.get(null, (data) => console.log(data));
    });
  }

  addIssueToTrack() {
    chrome.runtime.sendMessage({'action': 'addIssueToTrack', 'issueId': this.issueId }, () => {
      this.setAddedState(true);

      chrome.storage.sync.get(null, (data) => console.log(data));
    });
  }

  removeIssueFromTrack() {
    if ( confirm('Please, confirm removing') ) {
      chrome.runtime.sendMessage({'action': 'removeIssueFromTrack', 'issueId': this.issueId }, () => {
        this.setAddedState(false);

        chrome.storage.sync.get(null, (data) => console.log(data));
      });
    }
  }

  setPlayingState(bool) {
    this.isPlaying = bool;
    this._renderState();
  }

  setAddedState(bool) {
    this.isAdded = bool;
    this._renderState();
  }

  _render() {
    this.elem           = document.createElement('div');
    this.elem.className = 'ritControls';

    let innerElem       = document.createElement('div');
    innerElem.className = 'ritControls__inner';

    this.elemControls           = document.createElement('div');
    this.elemControls.className = 'ritControls__controls';

    let elemIcon       = document.createElement('div');
    elemIcon.className = 'ritControls__icon';

    innerElem.appendChild(this.elemControls);
    innerElem.appendChild(elemIcon);

    this.elem.appendChild(innerElem);
  }

  _renderState() {
    if ( this.isAdded ) {
      this.elemControls.innerHTML = (`
        <button class="ritControls__start">${this.isPlaying ? 'pause' : 'start'}</button>
        <button class="ritControls__end">record</button>
        <button class="ritControls__remove">remove</button>
      `);
    } else {
      this.elemControls.innerHTML = (`
        <button class="ritControls__add"></button>
      `);
    }
  }
}

module.exports = IssueButton;
