"use strict";

var TZ = require("./");

function testUtcToTz(t) {
  var result = TZ.toTimeZone.apply(TZ, t.inputs).toISOString();
  var result2 = TZ.toTimeZoneISOString.apply(TZ, t.inputs);
  if (result !== result2 || t.result !== result) {
    throw new Error(
      `Invalid UTC/ISO+Offset to TZ conversion for ${t.desc}:\n` +
        `\tExpected: ${t.result}\n` +
        `\tActual: ${result}\n`
    );
  }
}

function testTzToUtc(t) {
  var result = TZ.fromTimeZone.apply(TZ, t.inputs).toISOString();
  var result2 = TZ.toOffsetISOString.apply(TZ, t.inputs);
  var result3 = TZ.toUTC.apply(TZ, t.inputs).toISOString();
  if (t.result !== result || t.result !== result2 || t.result !== result3) {
    console.error(result);
    throw new Error(
      `Invalid TZ to UTC conversion for ${t.desc}:\n` +
        `\tExpected: ${t.result}\n` +
        `\tActual: ${result.toISOString()}\n`
    );
  }
}

// At this real UTC time, what does the timezone translate it to?
[
  //
  // Start-of-DST Tests
  //

  // [Start]
  // What time is '2021-03-14 01:15:59.000 in New York' in UTC? // 2021-03-14 06:15:59.000
  //                                                            // 2021-03-14T01:15:59.000-0500
  // What time is '2021-03-14 02:15:59.000 in New York' in UTC? // 2021-03-14 07:15:59.000
  //                                                            // 2021-03-14T03:15:59.000-0400
  // What time is '2021-03-14 03:15:59.000 in New York' in UTC? // 2021-03-14 07:15:59.000
  //                                                            // 2021-03-14T03:15:59.000-0400
  // What time is '2021-03-14 04:15:59.000 in New York' in UTC? // 2021-03-14 08:15:59.000
  //                                                            // 2021-03-14T04:15:59.000-0400
  // [End]

  // 12:15am NY -0500 => -0400
  {
    desc: "UTC Zulu to 12:15am NY EST",
    inputs: ["2021-03-14T05:15:59.000Z", "America/New_York"],
    result: "2021-03-14T00:15:59.000-0500",
  },
  {
    desc: "ISO+Offset to 12:15am NY EST (2)",
    inputs: ["2021-03-14T00:15:59.000-0500", "America/New_York"],
    result: "2021-03-14T00:15:59.000-0500",
  },
  // 1:15am NY (non-DST)
  {
    desc: "UTC Zulu to 1:15am NY EST",
    inputs: ["2021-03-14T06:15:59.000Z", "America/New_York"],
    result: "2021-03-14T01:15:59.000-0500",
  },
  {
    desc: "ISO+Offset to 1:15am NY EST (2)",
    inputs: ["2021-03-14T01:15:59.000-0500", "America/New_York"],
    result: "2021-03-14T01:15:59.000-0500",
  },

  // NOTE: Can't 2:15am NY, because it does not exist (skipped by DST)

  // 3:15am NY (DST)
  {
    desc: "UTC Zulu to 3:15am NY EDT",
    inputs: ["2021-03-14T07:15:59.000Z", "America/New_York"],
    result: "2021-03-14T03:15:59.000-0400",
  },
  {
    desc: "ISO+Offset to 3:15am NY EDT (2)",
    inputs: ["2021-03-14T03:15:59.000-0400", "America/New_York"],
    result: "2021-03-14T03:15:59.000-0400",
  },
  // 4:15am NY
  {
    desc: "UTC Zulu to 4:15am NY EDT",
    inputs: ["2021-03-14T08:15:59.000Z", "America/New_York"],
    result: "2021-03-14T04:15:59.000-0400",
  },
  {
    desc: "ISO+Offset to 4:15am NY EDT (2)",
    inputs: ["2021-03-14T04:15:59.000-0400", "America/New_York"],
    result: "2021-03-14T04:15:59.000-0400",
  },

  //
  // End-of-DST Tests
  //

  // [Start]
  // What time is '2021-11-07 01:15:59.000 in New York' in UTC? // 2021-11-07 05:15:59.000
  //                                                            // 2021-11-07T01:15:59.000-0400
  //                                                            // 2021-11-07 06:15:59.000
  //                                                            // 2021-11-07T01:15:59.000-0500
  // What time is '2021-11-07 02:15:59.000 in New York' in UTC? // 2021-11-07 07:15:59.000
  //                                                            // 2021-11-07T02:15:59.000-0500
  // What time is '2021-11-07 03:15:59.000 in New York' in UTC? // 2021-11-07 08:15:59.000
  // [End]

  // 12:15am NY -0400 => -0500
  {
    desc: "UTC Zulu to 2021 Nov 7, 12:15am NY EDT",
    inputs: ["2021-11-07T04:15:59.000Z", "America/New_York"],
    result: "2021-11-07T00:15:59.000-0400",
  },
  {
    desc: "ISO+Offset to 2021 Nov 7, 12:15am NY EDT (2)",
    inputs: ["2021-11-07T00:15:59.000-0400", "America/New_York"],
    result: "2021-11-07T00:15:59.000-0400",
  },
  // 1:15am NY (DST) -0400
  // NOTE: 1:15am happens TWICE (with different offsets)
  {
    desc: "UTC Zulu to 2021 Nov 7, 1:15am NY EDT",
    inputs: ["2021-11-07T05:15:59.000Z", "America/New_York"],
    result: "2021-11-07T01:15:59.000-0400",
  },
  {
    desc: "ISO+Offset to 2021 Nov 7, 1:15am NY EDT (2)",
    inputs: ["2021-11-07T01:15:59.000-0400", "America/New_York"],
    result: "2021-11-07T01:15:59.000-0400",
  },
  // 1:15am NY (non-DST) -0500
  {
    desc: "UTC Zulu to 2021 Nov 7, 1:15am NY EST",
    inputs: ["2021-11-07T06:15:59.000Z", "America/New_York"],
    result: "2021-11-07T01:15:59.000-0500",
  },
  {
    desc: "ISO+Offset to 2021 Nov 7, 1:15am NY EST (2)",
    inputs: ["2021-11-07T01:15:59.000-0500", "America/New_York"],
    result: "2021-11-07T01:15:59.000-0500",
  },
  // 2:15am NY -0500
  {
    desc: "UTC Zulu to 2021 Nov 7, 2:15am NY EST",
    inputs: ["2021-11-07T07:15:59.000Z", "America/New_York"],
    result: "2021-11-07T02:15:59.000-0500",
  },
  {
    desc: "ISO+Offset to 2021 Nov 7, 2:15am NY EST (2)",
    inputs: ["2021-11-07T02:15:59.000-0500", "America/New_York"],
    result: "2021-11-07T02:15:59.000-0500",
  },
  // 3:15am NY
  {
    desc: "UTC Zulu to 2021 Nov 7, 3:15am NY EST",
    inputs: ["2021-11-07T08:15:59.000Z", "America/New_York"],
    result: "2021-11-07T03:15:59.000-0500",
  },
  {
    desc: "ISO+Offset to 2021 Nov 7, 3:15am NY EST (2)",
    inputs: ["2021-11-07T03:15:59.000-0500", "America/New_York"],
    result: "2021-11-07T03:15:59.000-0500",
  },

  //
  // Positive Offset Test
  //

  // Colombo +0530 (not DST)
  {
    desc: "UTC Zulu to Asia/Colombo (1)",
    inputs: ["2021-03-14T08:15:59.000Z", "Asia/Colombo"],
    result: "2021-03-14T13:45:59.000+0530",
  },
  {
    desc: "ISO+Offset to Asia/Colombo (2)",
    inputs: ["2021-03-14T13:45:59.000+0530", "Asia/Colombo"],
    result: "2021-03-14T13:45:59.000+0530",
  },
  {
    desc: "UTC Zulu to Asia/Colombo (3)",
    inputs: ["2021-11-07T08:15:59.000Z", "Asia/Colombo"],
    result: "2021-11-07T13:45:59.000+0530",
  },
  {
    desc: "ISO+Offset to Asia/Colombo (4)",
    inputs: ["2021-11-07T13:45:59.000+0530", "Asia/Colombo"],
    result: "2021-11-07T13:45:59.000+0530",
  },
].forEach(testUtcToTz);
console.info(
  "Pass: UTC/ISO+Offset to TZ for America/New_York and Asia/Colombo"
);

[
  //
  // Start-of-DST Tests
  //

  // [Start]
  // What time is '2021-03-14 01:15:59.000 in New York' in UTC? // 2021-03-14 06:15:59.000
  //                                                            // 2021-03-14T01:15:59.000-0500
  // What time is '2021-03-14 02:15:59.000 in New York' in UTC? // 2021-03-14 07:15:59.000
  //                                                            // 2021-03-14T03:15:59.000-0400
  // What time is '2021-03-14 03:15:59.000 in New York' in UTC? // 2021-03-14 07:15:59.000
  //                                                            // 2021-03-14T03:15:59.000-0400
  // What time is '2021-03-14 04:15:59.000 in New York' in UTC? // 2021-03-14 08:15:59.000
  //                                                            // 2021-03-14T04:15:59.000-0400
  // [End]

  // 12:15am NY -0500 => -0400
  {
    // 2021-03-14T05:15:59.000Z
    desc: "2021 Mar 14, 12:15am NY EST to UTC",
    inputs: ["2021-03-14 00:15:59.000", "America/New_York"],
    result: "2021-03-14T00:15:59.000-0500",
  },
  // 1:15am NY (non-DST)
  {
    // 2021-03-14T06:15:59.000Z
    desc: "2021 Mar 14, 1:15am NY EST to UTC",
    inputs: ["2021-03-14 01:15:59.000", "America/New_York"],
    result: "2021-03-14T01:15:59.000-0500",
  },

  // NOTE: Can't 2:15am NY, because it does not exist (skipped by DST)
  // This test is here to document the "undefined" behavior
  {
    // Both 2021-03-14T06:15:59.000Z and 2021-03-14T07:15:59.000Z
    // would be reasonable substitutions, I think
    desc: "2021 Mar 14, 2:15am NY ExT to UTC",
    inputs: ["2021-03-14 02:15:59.000", "America/New_York"],
    //result: "2021-03-14T01:15:59.000-0500", // 2021-03-14T06:15:59.000Z
    result: "2021-03-14T02:15:59.000-0400", // 2021-03-14T06:15:59.000Z
    //result: "2021-03-14T02:15:59.000-0500", // 2021-03-14T07:15:59.000Z
  },

  // 3:15am NY (DST)
  {
    // 2021-03-14T07:15:59.000Z
    desc: "2021 Mar 14, 3:15am NY EDT to UTC",
    inputs: ["2021-03-14 03:15:59.000", "America/New_York"],
    result: "2021-03-14T03:15:59.000-0400",
  },
  // 4:15am NY
  {
    // 2021-03-14T08:15:59.000Z
    desc: "2021 Mar 14, 4:15am NY EDT to UTC",
    inputs: ["2021-03-14 04:15:59.000", "America/New_York"],
    result: "2021-03-14T04:15:59.000-0400",
  },

  //
  // End-of-DST Tests
  //

  // [Start]
  // What time is '2021-11-07 01:15:59.000 in New York' in UTC? // 2021-11-07 05:15:59.000
  //                                                            // 2021-11-07T01:15:59.000-0400
  //                                                            // 2021-11-07 06:15:59.000
  //                                                            // 2021-11-07T01:15:59.000-0500
  // What time is '2021-11-07 02:15:59.000 in New York' in UTC? // 2021-11-07 07:15:59.000
  //                                                            // 2021-11-07T02:15:59.000-0500
  // What time is '2021-11-07 03:15:59.000 in New York' in UTC? // 2021-11-07 08:15:59.000
  // [End]

  // 12:15am NY -0400 => -0500
  {
    // 2021-11-07T04:15:59.000Z
    desc: "2021 Nov 7, 12:15am NY EDT to UTC",
    inputs: ["2021-11-07 00:15:59.000", "America/New_York"],
    result: "2021-11-07T00:15:59.000-0400",
  },

  // 1:15am NY (DST) -0400
  // NOTE: 1:15am happens TWICE (with different offsets), so we skip one
  {
    // ==> 2021-11-07T05:15:59.000Z
    // [Skip] 2021-11-07T06:15:59.000Z
    desc: "2021 Nov 7, 1:15am NY ExT to UTC",
    inputs: ["2021-11-07 01:15:59.000", "America/New_York"],
    result: "2021-11-07T01:15:59.000-0400", // 2021-11-07T05:15:59.000Z
    //result: "2021-11-07T01:15:59.000-0500", // 2021-11-07T06:15:59.000Z
  },

  // 2:15am NY -0500
  {
    // 2021-11-07T07:15:59.000Z
    desc: "2021 Nov 7, 2:15am NY EST to UTC",
    inputs: ["2021-11-07 02:15:59.000", "America/New_York"],
    result: "2021-11-07T02:15:59.000-0500",
  },
  // 3:15am NY
  {
    // 2021-11-07T08:15:59.000Z
    desc: "2021 Nov 7, 3:15am NY EST to UTC",
    inputs: ["2021-11-07 03:15:59.000", "America/New_York"],
    result: "2021-11-07T03:15:59.000-0500",
  },

  //
  // Positive Offset Test
  //

  // Colombo +0530 (not DST)
  {
    // 2021-03-14T08:15:59.000Z
    desc: "Asia/Colombo to UTC (1)",
    inputs: ["2021-03-14 13:45:59.000", "Asia/Colombo"],
    result: "2021-03-14T13:45:59.000+0530",
  },
  {
    // 2021-03-14T08:15:59.000Z
    desc: "Asia/Colombo to UTC (2)",
    inputs: ["2021-11-07 13:45:59.000", "Asia/Colombo"],
    result: "2021-11-07T13:45:59.000+0530",
  },
].forEach(testTzToUtc);
console.info("Pass: TZ to UTC for America/New_York and Asia/Colombo");

var localISOString = TZ.toLocalISOString();
var reISOString = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\d[+-]\d\d\d\d$/;
if (!reISOString.test(localISOString)) {
  throw new Error("Couldn't get local time as iso+offset");
}
console.info("Pass: can get local time as ISO+Offset");

var tzName = TZ.timeZone();
if (!/^[A-Z]\w+\/[A-Z]\w+$/.test(tzName)) {
  throw new Error("Couldn't get local Time Zone");
}
console.info("Pass: can get local timezone");
