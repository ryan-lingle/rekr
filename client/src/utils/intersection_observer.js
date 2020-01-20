export default (function () {
  const options = {
    root: null,
    rootMargin: '25px',
    threshold: 1.0,
  };

  function callbackWrapper(entries, observer, callback) {
    entries.forEach(entry => {
      if (entry.intersectionRatio === 1) {
        callback(entry)
      }
    });
  };

  return function (callback) {
    return new IntersectionObserver(function(entries, observer) {
      callbackWrapper(entries, observer, callback)
    }, options);
  };
})();
