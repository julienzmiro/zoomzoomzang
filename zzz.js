var zzz = zzz || {};

(function ( o ) {

  var zzzF = this;
  var overlayColor;

  o.init = function (overlayColor) {
    // Check wether or not the document is ready until it is ready
    var readyStateCheckInterval = setInterval(function() {
      if (document.readyState === "complete") {
        addEvent(window, 'unload', EventCache.flush);
        addEvent(window, 'resize', checkImages);
        zzzF.overlayColor = overlayColor || "#ffffff";
        checkImages();
        clearInterval(readyStateCheckInterval);
      }
    }, 10);
  };

  function checkImages () {
    var i;
    var images = document.getElementsByClassName("zzz");

    for (i = 0; i < images.length; ++i) {
      makeZoomable(images[i]);
    }
  }

  function makeZoomable (i) {
    i.className = i.className + " zzzZoomable";
    i.style.transition = "transform 200ms ease-out";
    i.style.cursor = "zoom-in";
    i.zzz = {};
    i.zzz.style = {};
    i.zzz.parentNode = {};
    i.zzz.parentNode.style = {};
    i.zzz.style.position = getComputedStyle(i).getPropertyValue("position");
    i.zzz.style.zIndex = getComputedStyle(i).getPropertyValue("z-index");
    i.zzz.parentNode.style.zIndex = getComputedStyle(i.parentNode).getPropertyValue("z-index");
    addEvent(i, 'click', zoomableHandler);
  }

  function isZoomable (imgToCheck) {
    var imgNatWidth = imgToCheck.naturalWidth;
    var imgNatHeight = imgToCheck.naturalHeight;
    var imgDisWidth = imgToCheck.clientWidth;
    var imgDisHeight = imgToCheck.clientHeight;
    var result = null;
    if (imgNatWidth > imgDisWidth || imgNatHeight > imgDisHeight) {
      if (imgDisWidth < (window.innerWidth - 20) && imgDisHeight < (window.innerHeight - 20)) {
        result = true;
      } else {
        result = false;
      }
    } else {
      result = false;
    }
    return result;
  }

  function zoomableHandler (e) {
    this.removeEventListener('click', zoomableHandler);
    scaleImageUp(this);
    addEvent(this, 'click', zoomedHandler);
    addEvent(window, 'scroll', zoomedHandler);
  }

  function zoomedHandler () {
    var o = document.getElementsByClassName("zzzZoomableOverlay")[0];
    var i = document.getElementsByClassName("zzzZoomed")[0];

    window.removeEventListener('scroll', zoomedHandler);
    i.removeEventListener('click', zoomedHandler);
    addEvent(i, 'click', zoomableHandler);

    scaleImageDown(i);
  }

  function scaleImageUp (i) {
    var iDisplayWidth = i.clientWidth;
    var iDisplayHeight = i.clientHeight;
    var iNewWidth = null;
    var iNewHeight = null;
    var iRatio = iDisplayWidth / iDisplayHeight;
    var wWidth = window.innerWidth - 20;
    var wHeight = window.innerHeight - 20;
    var wRatio = wWidth / wHeight;
    var xTranslate = null;
    var yTranslate = null;
    var scaleRatio = null;
    var iCenterY = Math.floor(i.getBoundingClientRect().top + (iDisplayHeight / 2));
    var iCenterX = Math.floor(i.getBoundingClientRect().left + (iDisplayWidth / 2));
    var wCenterY = window.innerHeight / 2;
    var wCenterX = window.innerWidth / 2;

    if (wRatio > iRatio) {
      iNewWidth = Math.min(iDisplayWidth * wHeight / iDisplayHeight, i.naturalWidth);
      iNewHeight = iNewWidth / iRatio;
      scaleRatio = +(iNewWidth / iDisplayWidth).toFixed(1);
    } else {
      iNewHeight = Math.min(iDisplayHeight * wWidth / iDisplayWidth, i.naturalHeight);
      iNewWidth = iNewHeight * iRatio;
      scaleRatio = +(iNewHeight / iDisplayHeight).toFixed(1);
    }

    yTranslate = (wCenterY - iCenterY) / scaleRatio;
    xTranslate = (wCenterX - iCenterX) / scaleRatio;

    i.style.transform = "scale(" + scaleRatio + ") translateX(" + xTranslate + "px) translateY(" + yTranslate + "px)";
    i.style.cursor = "zoom-out";
    i.style.zIndex = 2;
    i.parentNode.style.zIndex = 999; // Stacking context
    i.style.position = "relative";
    i.className = i.className.replace(" zzzZoomable", " zzzZoomed");
    showOverlay();
  }

  function scaleImageDown (i) {
    hideOverlay();
    i.style.transform = "scale(1)";
    i.style.cursor = "zoom-in";
    i.className = i.className.replace(" zzzZoomed", " zzzZoomable");
  }

  function showOverlay () {
    var i = document.getElementsByClassName("zzzZoomed")[0];
    var o = document.createElement("DIV");

    addEvent(o, 'click', zoomedHandler);

    o.className = "zzzZoomableOverlay";
    o.style.backgroundColor = zzzF.overlayColor;
    o.style.height = window.innerHeight + "px";
    o.style.width = window.innerWidth + "px";
    o.style.position = "fixed";
    o.style.top = 0;
    o.style.left = 0;
    o.style.cursor = "zoom-out";
    o.style.zIndex = 1;
    o.style.opacity = 0;
    o.style.transition = "opacity 100ms linear";

    i.parentNode.insertBefore(o, i);

    var t = setTimeout(function() {
      o.style.opacity = 1;
      clearTimeout(t);
    }, 1);
  }

  function hideOverlay () {
    var o = document.getElementsByClassName("zzzZoomableOverlay")[0];
    var i = document.getElementsByClassName("zzzZoomed")[0];

    o.style.opacity = 0;

    var t = setTimeout(function () {
      o.remove();
      i.style.zIndex = i.zzz.style.zIndex;
      i.style.position = i.zzz.style.position;
      i.parentNode.style.zIndex = i.zzz.parentNode.style.zIndex;
      clearTimeout(t);
    }, 200);
  }

  // Cross browser get document size from http://james.padolsey.com/snippets/get-document-height-cross-browser/
  function getDocSize() {
      var d = document;
      var h = Math.max(d.body.scrollHeight, d.documentElement.scrollHeight, d.body.offsetHeight, d.documentElement.offsetHeight, d.body.clientHeight, d.documentElement.clientHeight);
      var w = Math.max(d.body.scrollWidth, d.documentElement.scrollWidth, d.body.offsetWidth, d.documentElement.offsetWidth, d.body.clientWidth, d.documentElement.clientWidth);
      return {
        height: h,
        width: w
      };
  }

  // Rock solid add event method by Dustin Diaz (http://dustindiaz.com/rock-solid-addevent)
  function addEvent (obj, type, fn) {
    if (obj.addEventListener) {
      obj.addEventListener( type, fn, false );
      EventCache.add(obj, type, fn);
    }
    else if (obj.attachEvent) {
      obj["e"+type+fn] = fn;
      obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
      obj.attachEvent( "on"+type, obj[type+fn] );
      EventCache.add(obj, type, fn);
    }
    else {
      obj["on"+type] = obj["e"+type+fn];
    }
  }

  // Store the event cache
  var EventCache = function () {
    var listEvents = [];
    return {
      listEvents : listEvents,
      add : function(node, sEventName, fHandler){
        listEvents.push(arguments);
      },
      flush : function(){
        var i, item;
        for(i = listEvents.length - 1; i >= 0; i = i - 1){
          item = listEvents[i];
          if(item[0].removeEventListener){
            item[0].removeEventListener(item[1], item[2], item[3]);
          };
          if(item[1].substring(0, 2) != "on"){
            item[1] = "on" + item[1];
          };
          if(item[0].detachEvent){
            item[0].detachEvent(item[1], item[2]);
          };
          item[0][item[1]] = null;
        };
      }
    };
  }();

})(zzz);
