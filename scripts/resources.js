/* Resources.js
 * This is an image loading utility that includes a "caching" layer.
 * It will reuse cached images when attempting to load the same image multiple times.
 */
(function() {
  var resourceCache = {};
  var loading = [];
  var readyCallbacks = [];

  /* This is the publicly accessible image loading function. It accepts
   * either a single string or an array of strings pointing to image file\s
   * It will call our private image loading function accordingly.
   */
  function load(urlOrArr) {
    /* If an array of images was passed, loop through the values and call our image loader on each of them.
     * Otherwise, a string was passed, so call our image loader directly.
     */
    if (urlOrArr instanceof Array) {
      urlOrArr.forEach(function(url) {
        _load(url);
      });
    } else {
      _load(urlOrArr);
    }
  }

  // This is our private image loading function.
  function _load(url) {
    // If the URL has been previously loaded, just return the image. Otherwise, load the image.
    if(resourceCache[url]) {
      return resourceCache[url];
    } else {
      var img = new Image();
      img.onload = function() {
        /* Once our image has finished loading, add it to our cache.
         * Then, call all of the onReady() callbacks.
         */
        resourceCache[url] = img;
        if(isReady()) {
          readyCallbacks.forEach(function(func) { func(); });
        }
      };
      resourceCache[url] = false;
      img.src = url;
    }
  }

  // This is used to grab references to images that have been previously loaded.
  function get(url) {
    return resourceCache[url];
  }

  // This function determines if all of the requested images for loading have finished loading.
  function isReady() {
    var ready = true;
    for(var k in resourceCache) {
      if(resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
        ready = false;
      }
    }
    return ready;
  }

  // This function will add a function to the callback stack of functions that will be executed once all the requested images are loaded.
  function onReady(func) {
    readyCallbacks.push(func);
  }

  // This object defines the publicly accessible functions by creating a global Resources object.
  window.Resources = {
    load: load,
    get: get,
    isReady: isReady,
    onReady: onReady
  };
})();
