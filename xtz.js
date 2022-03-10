(function (exports) {
  "use strict";

  function toTimeZone(date, timeZone) {
    // ISO string or existing date object
    date = new Date(date);
    var options = {
      timeZone: timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour12: false,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      fractionalSecondDigits: 3,
    };

    var tzOptions = Object.assign({ timeZoneName: "long" }, options);

    // Every country uses the same year and months, right?
    var formater = new Intl.DateTimeFormat("default", tzOptions);
    var parts = formater.formatToParts(date);

    // millisecond is explicitly 0 for iOS' lack of fractionalSecond support
    var whole = { millisecond: 0 };
    parts.forEach(function (part) {
      var val = part.value;
      switch (part.type) {
        case "literal":
          // ignore separators and whitespace characters
          return;
        case "timeZoneName":
          // keep as is - it's a string
          break;
        case "month":
          // months are 0-indexed for new Date()
          val = parseInt(val, 10) - 1;
          break;
        case "hour":
          // because sometimes 24 is used instead of 0, make 24 0
          val = parseInt(val, 10) % 24;
          break;
        case "fractionalSecond":
          // fractionalSecond is a dumb name - should be millisecond
          whole.millisecond = parseInt(val, 10);
          return;
        default:
          val = parseInt(val, 10);
      }
      // ex: whole.month = 0;
      whole[part.type] = val;
    });

    whole.timeZone = timeZone;
    whole.offset = getOffset(date, whole);
    whole.toISOString = _toOffsetISOString;
    return whole;
  }

  function toTimeZoneISOString(date, timeZone) {
    var whole = toTimeZone(date, timeZone);
    return formatAsOffsetISOString(whole);
  }

  function _toOffsetISOString() {
    /* jshint validthis: true */
    return formatAsOffsetISOString(this);
  }

  function getOffset(utcDate, tzD2) {
    var tzDate = new Date(formatAsOffsetISOString(tzD2));
    var diff = Math.round((tzDate.valueOf() - utcDate.valueOf()) / (60 * 1000));
    return diff;
  }

  function p2(x) {
    return String(x).padStart(2, "0");
  }

  function p3(x) {
    return String(x).padStart(3, "0");
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
    return (
      offset + h.toString().padStart(2, "0") + m.toString().padStart(2, "0")
    );
  }

  function toOffsetISOString(date, timeZone) {
    if ("offset" in date && "year" in date) {
      return formatAsOffsetISOString(date);
    }

    var whole = fromTimeZone(date, timeZone);
    return formatAsOffsetISOString(whole);
  }

  function formatAsOffsetISOString(d) {
    var offset = formatOffset(d.offset);
    return (
      `${d.year}-${p2(d.month + 1)}-${p2(d.day)}` +
      `T${p2(d.hour)}:${p2(d.minute)}:${p2(d.second)}.${p3(
        d.millisecond
      )}${offset}`
    );
  }

  function fromTimeZone(dt, tz) {
    if ("string" === typeof dt) {
      // Either of these formats should work:
      // 2021-03-14 01:15:59
      // 2021-03-14T01:15:59Z
      dt = dt
        .replace("T", " ")
        .replace("Z", "")
        .replace(" ", "T")
        .replace(/$/, "Z");
    }
    var utcDate = new Date(dt);
    var tzD2 = toTimeZone(utcDate, tz);
    var offset = tzD2.offset;
    tzD2.offset = 0;

    var deltaDate = new Date(utcDate);
    deltaDate.setUTCMinutes(deltaDate.getUTCMinutes() - offset);
    var tzD3 = toTimeZone(deltaDate, tz);

    if (
      tzD3.hour === utcDate.getUTCHours() &&
      tzD3.minute === utcDate.getUTCMinutes()
    ) {
      return tzD3;
    }

    var diff = tzD3.offset - offset;
    var h = Math.floor(Math.abs(diff) / 60);
    var m = Math.abs(diff) % 60;
    var sign = Math.abs(diff) / diff;
    tzD3.hour -= h * sign;
    tzD3.minute -= m * sign;

    return tzD3;
  }

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

  exports.XTZ = {
    // bespoke date =>
    // 2021-11-07T3:15:59-0500
    // (todo?)
    // xtzToISOString: formatAsOffsetISOString,
    // (deprecated)
    toOffsetISOString: toOffsetISOString,

    // -240 => -0400
    formatOffset: formatOffset,

    toLocalISOString: toLocalISOString,

    // [ "2021-11-07T08:15:59Z", "America/New_York" ]
    // => "2021-11-07T03:15:59-0500" // 2021-11-07 03:15:59
    toTimeZone: toTimeZone,
    toTimeZoneISOString: toTimeZoneISOString,

    // [ "2021-11-07 03:15:59", "America/New_York" ]
    // => "2021-11-07T03:15:59-0500" // 2021-11-07T08:15:59Z
    toUTC: fromTimeZone,
    fromTimeZone: fromTimeZone,
    // deprecated
    toUTCISOString: toOffsetISOString,
  };

  if ("undefined" != typeof module && module.exports) {
    module.exports = exports.XTZ;
  }
})(("undefined" === typeof module && window) || exports);
