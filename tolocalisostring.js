(function (exports) {
  "use strict";

  // See <https://github.com/coolaj86/AJScript/issues/27>

  function toLocalISOString(dateOrStr) {
    var d;
    if (dateOrStr) {
      d = new Date(dateOrStr);
    } else {
      d = new Date();
    }

    var YYYY = d.getFullYear();
    var MM = p2(d.getMonth() + 1);
    var DD = p2(d.getDate());
    var hh = p2(d.getHours());
    var mm = p2(d.getMinutes());
    var ss = p2(d.getSeconds());
    var sss = d.getMilliseconds().toString().padStart(3, "0");

    var offset = formatOffset(-d.getTimezoneOffset());

    return `${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss}.${sss}${offset}`;
  }

  function formatOffset(minutes) {
    if (!minutes) {
      return "Z";
    }

    var h = Math.floor(Math.abs(minutes) / 60);
    var m = Math.abs(minutes) % 60;
    var offset = "";
    if (minutes > 0) {
      offset = "+";
    } else if (minutes < 0) {
      offset = "-";
    }

    // +0500, -0730
    return offset + p2(h) + p2(m);
  }

  function p2(x) {
    return String(x).padStart(2, "0");
  }

  exports.toLocalISOString = toLocalISOString;
})(("undefined" === typeof module && window) || exports);
