"use strict";

var TZ = require("./");

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
        inputs: ["2021-03-14T05:15:59.000Z", "America/New_York"],
        result: "2021-03-14T00:15:59.000-0500",
    },
    {
        inputs: ["2021-03-14T00:15:59.000-0500", "America/New_York"],
        result: "2021-03-14T00:15:59.000-0500",
    },
    // 1:15am NY (non-DST)
    {
        inputs: ["2021-03-14T06:15:59.000Z", "America/New_York"],
        result: "2021-03-14T01:15:59.000-0500",
    },
    {
        inputs: ["2021-03-14T01:15:59.000-0500", "America/New_York"],
        result: "2021-03-14T01:15:59.000-0500",
    },

    // NOTE: Can't 2:15am NY, because it does not exist (skipped by DST)

    // 3:15am NY (DST)
    {
        inputs: ["2021-03-14T07:15:59.000Z", "America/New_York"],
        result: "2021-03-14T03:15:59.000-0400",
    },
    {
        inputs: ["2021-03-14T03:15:59.000-0400", "America/New_York"],
        result: "2021-03-14T03:15:59.000-0400",
    },
    // 4:15am NY
    {
        inputs: ["2021-03-14T08:15:59.000Z", "America/New_York"],
        result: "2021-03-14T04:15:59.000-0400",
    },
    {
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
        inputs: ["2021-11-07T04:15:59.000Z", "America/New_York"],
        result: "2021-11-07T00:15:59.000-0400",
    },
    {
        inputs: ["2021-11-07T00:15:59.000-0400", "America/New_York"],
        result: "2021-11-07T00:15:59.000-0400",
    },
    // 1:15am NY (DST) -0400
    // NOTE: 1:15am happens TWICE (with different offsets)
    {
        inputs: ["2021-11-07T05:15:59.000Z", "America/New_York"],
        result: "2021-11-07T01:15:59.000-0400",
    },
    {
        inputs: ["2021-11-07T01:15:59.000-0400", "America/New_York"],
        result: "2021-11-07T01:15:59.000-0400",
    },
    // 1:15am NY (non-DST) -0500
    {
        inputs: ["2021-11-07T06:15:59.000Z", "America/New_York"],
        result: "2021-11-07T01:15:59.000-0500",
    },
    {
        inputs: ["2021-11-07T01:15:59.000-0500", "America/New_York"],
        result: "2021-11-07T01:15:59.000-0500",
    },
    // 2:15am NY -0500
    {
        inputs: ["2021-11-07T07:15:59.000Z", "America/New_York"],
        result: "2021-11-07T02:15:59.000-0500",
    },
    {
        inputs: ["2021-11-07T02:15:59.000-0500", "America/New_York"],
        result: "2021-11-07T02:15:59.000-0500",
    },
    // 3:15am NY
    {
        inputs: ["2021-11-07T08:15:59.000Z", "America/New_York"],
        result: "2021-11-07T03:15:59.000-0500",
    },
    {
        inputs: ["2021-11-07T03:15:59.000-0500", "America/New_York"],
        result: "2021-11-07T03:15:59.000-0500",
    },

    //
    // Positive Offset Test
    //

    // 4:15am Colombo +0530 (not DST)
    {
        inputs: ["2021-03-14T08:15:59.000Z", "Asia/Colombo"],
        result: "2021-03-14T13:45:59.000+0530",
    },
    {
        inputs: ["2021-03-14T13:45:59.000+0530", "Asia/Colombo"],
        result: "2021-03-14T13:45:59.000+0530",
    },
].forEach(function (t) {
    var result = TZ.fromUTCToTimeZone.apply(TZ, t.inputs).toISOString();
    if (t.result !== result) {
        throw new Error(
            "Invalid Conversion:\n" +
                `\tExpected: ${t.result}\n` +
                `\tActual: ${result}\n`
        );
    }
});
