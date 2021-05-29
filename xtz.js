var XTZ;

(function () {
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
    return toOffsetISOString(whole);
  }

  function _toOffsetISOString() {
    return toOffsetISOString(this);
  }

  function getOffset(utcDate, tzD2) {
    var tzDate = new Date(toOffsetISOString(tzD2));
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

  function toOffsetISOString(d) {
    var offset = formatOffset(d.offset);
    return (
      `${d.year}-${p2(d.month + 1)}-${p2(d.day)}` +
      `T${p2(d.hour)}:${p2(d.minute)}:${p2(d.second)}.${p3(
        d.millisecond
      )}${offset}`
    );
  }

  function toUTC(dt, tz) {
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

  function toUTCISOString(date, timeZone) {
    var whole = toUTC(date, timeZone);
    return toOffsetISOString(whole);
  }

  XTZ = {
    // bespoke date =>
    // 2021-11-07T3:15:59-0500
    toOffsetISOString: toOffsetISOString,

    // -240 => -0400
    formatOffset: formatOffset,

    // [ "2021-11-07T08:15:59Z", "America/New_York" ]
    // => "2021-11-07T03:15:59-0500" // 2021-11-07 03:15:59
    toTimeZone: toTimeZone,
    toTimeZoneISOString: toTimeZoneISOString,

    // [ "2021-11-07 03:15:59", "America/New_York" ]
    // => "2021-11-07T03:15:59-0500" // 2021-11-07T08:15:59Z
    toUTC: toUTC,
    toUTCISOString: toUTCISOString,
  };

  if ("undefined" != typeof module && module.exports) {
    module.exports = XTZ;
  }
})();
