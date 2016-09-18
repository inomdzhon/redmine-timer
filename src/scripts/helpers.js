'use strict';

/**
 * Alias for querySelector
 * @param {string} selector
 * @param {Object} scope
 * @return {HTMLElement|null}
 */
window.qs = function(selector, scope) {
  return (scope || document).querySelector(selector);
};

/**
 * Alias for querySelectorAll
 * @param {string} selector
 * @param {Object} scope
 * @return {HTMLElement|null}
 */
window.qa = function(selector, scope) {
  return (scope || document).querySelectorAll(selector);
};

/**
 * Alias for addEventListener
 * @param {(string|Object)} target
 * @param {string} eventType
 * @param {function} handler
 * @param {boolean=} useCapture
 */
window.$on = function(target, eventType, handler, useCapture) {
  if (typeof target === 'string') {
    target = document.querySelectorAll(target);
  }
  if ( target.forEach ) {
    target.forEach( (elem) => elem.addEventListener(eventType, handler, !!useCapture) );
    return;
  }
  target.addEventListener(eventType, handler, !!useCapture);
};

/**
 * Delegate pattern
 * @param {Object} target
 * @param {string} eventType
 * @param {string} selector
 * @param {function} handler
 */
window.$delegate = function(target, eventType, selector, handler) {
  function dispatchEvent(evt) {
    if ( target.contains(evt.target) && evt.target.closest(selector) ) {
      handler(evt);
    }
  }

  let useCapture = eventType === 'blur' || eventType === 'focus';
  target.addEventListener(eventType, dispatchEvent, useCapture);
};
