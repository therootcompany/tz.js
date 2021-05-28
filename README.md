# [xtz.js](https://github.com/therootcompany/tz.js)

A fast, lightweight, zero-dependency library to
translate between Time Zones and UTC with native
`Intl.DateTimeFormat` in ~100 LoC. For Node.js & Browsers.

XTZ is a poor man's Temporal polyfill, but just for time zones.

> What UTC time will it be when it's 3:15am in New York?

```js
// Relative New York time to Absolute UTC Time
TZ.toUTCISOString("2021-11-07 03:15:59.000", "America/New_York");
// "2021-11-07T03:15:59.000-0500"
```

```js
var tzDate = TZ.toUTC("2021-11-07 03:15:59.000", "America/New_York");
// {
//   year: 2021, month: 11, day: 7,
//   hour: 3, minute: 15, second: 59, millisecond: 0,
//   offset: -300, timeZoneName: "Eastern Standard Time"
// }

tzDate.toISOString();
// "2021-11-07T03:15:59.000-0500"
// same as "2021-11-07T08:15:59.000Z"
```

> What time will it be in New York when it's 7:15am UTC?

```js
// Absolute UTC time to Relative New York time
TZ.toTimeZoneISOString("2021-11-07T07:15:59.000Z", "America/New_York");
// "2021-11-07T03:15:59.000-0400"
```

```js
var utcDate = TZ.toTimeZone("2021-03-14T07:15:59.000Z", "America/New_York");
// {
//   year: 2021, month: 11, day: 7,
//   hour: 3, minute: 15, second: 59, millisecond: 0,
//   offset: -240, timeZoneName: "Eastern Daylight Time"
// }

utcDate.toISOString();
// "2021-03-14T03:15:59.000-0400"
// same as "2021-11-07T07:15:59.000Z"
```

# Features

-   [x] Translate a UTC time to a Time Zone
-   [x] Translate a Zoned time to UTC
-   [x] Handles **Daylight Savings**, Weird Time Zones, etc...
-   [x] Lightweight (No deps)
    -   5kb Source + Comments
    -   2.5kb Minified
    -   <1kb `gzip`d

Compatible with Node.js & Browsers.

## Node.js & Webpack

```bash
npm install --save xtz
```

```js
var TZ = require("xtz");
```

## Browsers

```html
<script src="./xtz.js"></script>
```

```js
var TZ = window.XTZ;
```

# API

-   `toTimeZone(utcDate, timeZone)`
-   `toTimeZoneISOString(isoString, timeZone)`
-   `toUTC(dtString, timeZone)`
-   `toUTCISOString(dtString, timeZone)`

## `toTimeZone(utcDate, timeZone)`

> Convert UTC into a Target Time Zone

Use ISO timestamps representing the absolute UTC time in the target time zone:

```txt
"2021-11-07T08:15:59.000Z"
```

Convert directly to an ISO String:

```js
TZ.toTimeZoneISOString("2021-11-07T08:15:59.000Z", "America/New_York");
// "2021-11-07T03:15:59.000-0500"
```

Or use our bespoke (custom) date object:

```js
var tzDate = TZ.toTimeZone("2021-11-07T08:15:59.000Z", "America/New_York");
```

You can also use a date object with an absolute UTC time:

```js
var tzDate = TZ.toTimeZone(
    new Date("2021-11-07T08:15:59.000Z"),
    "America/New_York"
);
```

```js
console.log(tzDate.toISOString());
// "2021-11-07T03:15:59.000-0500"
```

Our ISO Strings + Offsets work with JavaScript's native Date object!!

```js
new Date("2021-11-07T03:15:59.000-0500").toISOString());
// "2021-11-07T08:15:59.000Z"
```

## `toUTC(dtString, timeZone)`

> Convert a Target Time Zone into UTC

Use ISO-like timestamps representing the _local_ time in the target time zone:

```txt
"2021-11-0 T03:15:59.000"
```

Convert directly to an offset ISO String:

```js
TZ.toUTCISOString("2021-11-07 03:15:59.000", "America/New_York");
// "2021-11-07T03:15:59.000-0500"
```

Or our bespoke date object:

```js
var utcDate = TZ.toUTC("2021-11-07 03:15:59.000", "America/New_York");
```

You can also use a date object as the source time, but the date's UTC time will be treated as **_relative to time zone_** rather than absolute (this is a workaround for JavaScript's lack of bi-directional timezone support).

```js
var utcDate = TZ.toUTC(
    new Date("2021-11-07T03:15:59.000Z"),
    "America/New_York"
);
```

```js
utcDate.toISOString();
// "2021-11-07T03:15:59.000-0500"
```

# Daylight Savings / Edge Cases

> In 2021 Daylight Savings (in the US)
>
> -   begins at 2am on March 14th
> -   ends at 2am on November 7th
>
> See <https://www.timeanddate.com/time/change/usa>.

Q: What happens in March when 2am is skipped?

-   A: Although 2am is not a valid time, rather than throwing an error this library will resolve to 1am instead, which is an hour early in real ("tick-tock" or "monotonic") time.
    ```js
    var utcDate = TZ.toUTC("2021-03-14 02:15:59.000", "America/New_York");
    utcDate.toISOString();
    // "2021-03-14T02:15:59.000-0400"
    // (same as "2021-03-14T01:15:59.000-0500")
    ```

Q: What happens in November when 2am happens twice?

-   A: Although both 2ams are distinguishable with ISO offset times, only the first can be resolved from a local time with this library.
    ```js
    var utcDate = TZ.toUTC("2021-11-07 01:15:59.000", "America/New_York");
    utcDate.toISOString();
    // "2021-11-07T01:15:59.000-0400", same as "2021-11-07T05:15:59.000Z"
    // (an hour before the 2nd 2am at "2021-11-07T01:15:59.000-0500")
    ```

# List of Time Zones

See the [Full List of Time Zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) on Wikipedia.

Common Zones for Testing:

```txt
America/New_York    -0500
America/Denver      -0700
America/Phoenix     -0700 (No DST)
America/Los_Angeles -0800
Australia/Adelaide  +0930 (30-min, has DST)
Asia/Kathmandu      +0545 (No DST, 45-min)
Asia/Kolkata        +0530 (No DST, 30-min)
```
