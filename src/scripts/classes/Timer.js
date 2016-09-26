'use strict';

class Timer {
  static makeTimeFromSecond(count = 0) {
    let time   = parseInt(count, 10);
    let hour   = Math.floor(time / 3600);
    let minute = Math.floor((time - 3600 * hour) / 60);
    let second = time - (3600 * hour) - (60 * minute);

    return ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2) + ':' + ('0' + second).slice(-2);
  }

  static humanDate(timestamps = Date.now()) {
    let date = new Date(timestamps);

    return  ('0' + date.getDate()).slice(-2)
    + '.' + ('0' + (date.getMonth() + 1)).slice(-2)
    + '.' + date.getFullYear()
    + ' ' + ('0' + date.getHours()).slice(-2)
    + ':' + ('0' + date.getMinutes()).slice(-2)
    + ':' + ('0' + date.getSeconds()).slice(-2);
  }

  static countTimestamps(arrTimestamps = [0]) {
    return arrTimestamps.reduce((previousValue, currentValue) => currentValue - previousValue);
  }

  static getMillisecondsToHours(milliseconds = 0, timePrecision = 0) {
    return (milliseconds / Timer.MILLISECONDS_IN_HOUR).toFixed(timePrecision);
  }

  static getMillisecondsToSeconds(milliseconds = 0) {
    return (milliseconds / Timer.MILLISECONDS);
  }

  constructor(param = {}) {
    this._timerIntervalId = null;
    this.seconds          = param.startTime || 0;
    this.isRun            = param.run || false;
    this.elem             = param.elem;
  }

  render() {
    this.elem.textContent = Timer.makeTimeFromSecond(this.seconds);
  }

  start() {
    if ( this.isRun ) return;

    this.isRun = true;
    this._timerIntervalId = window.setInterval(() => {
      this.seconds += 1;
      this.render();
    }, Timer.TIMER_DELAY);
  }

  pause() {
    if ( ! this.isRun ) return;

    this.isRun = false;
    window.clearInterval(this._timerIntervalId);
    this._timerIntervalId = null;
  }

  stop() {
    if ( ! this.isRun ) return;

    this.isRun = false;
    window.clearInterval(this._timerIntervalId);
    this._timerIntervalId = null;
  }
}

// Static constants
Timer.TIMER_DELAY = 1000;
Timer.MILLISECONDS = 1000;
Timer.MILLISECONDS_IN_HOUR = 3.6e+6;

module.exports = Timer;
