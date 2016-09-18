module.exports = (function() {
  const Modal = window.Modal || {};

  let isOpen = false;

  Modal.open = function(content) {
    if ( ! isOpen ) {

      this.isOpen = true;
    }
  };

  Modal.close = function() {
    if ( isOpen ) {

      this.isOpen = false;
    }
  };

  return window.Modal = Modal;
})();
