'use strict';

require('./helpers');

function saveOptions(evt) {
  let res       = {};
  let url       = window.qs('#redmine-url');
  let apiKey    = window.qs('#redmine-api-key');
  let statusBar = window.qs('#status-bar');

  if (url.value === '' || apiKey.value === '') {
    statusBar.textContent = 'Fields empty';

    setTimeout(() => {
      statusBar.textContent = '';
    }, 1200);

    return false;
  }

  res.options = {};
  res.options[url.name] = (url.value.slice(-1) === '/') ?
    url.value :
    url.value + '/';
  res.options[apiKey.name] = apiKey.value;

  chrome.storage.sync.set(res, () => {
    statusBar.textContent = 'Options saved';

    setTimeout(() => {
      statusBar.textContent = '';
    }, 1200);
  });
}

function restoreField(evt) {
  let url    = window.qs('#redmine-url');
  let apiKey = window.qs('#redmine-api-key');

  chrome.storage.sync.get('options', (data) => {
    if (data.options) {
      url.value    = data.options[url.name] || '';
      apiKey.value = data.options[apiKey.name] || '';
    }
  });
}

window.$on(document, 'DOMContentLoaded', restoreField);
window.$on('#save-option', 'click', saveOptions);
