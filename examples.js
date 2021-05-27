var XTZ;

(function () {
    "use strict";

    if (!XTZ) {
        try {
            XTZ = require("xtz");
        } catch (e) {
            XTZ = require("./xtz.js");
        }
    }

    var TZ = XTZ;
    var tzDate;

    //
    // UTC-absolute time translated to a Time Zone
    //
    function demo1() {
        console.info("What's the UTC equivalent of 8:15am in New York?");
        console.info();

        console.info("\t// during daylight savings");
        console.info(
            `\tXTZ.toUTC("2021-03-14 08:15:59.000", "America/New_York")`
        );
        console.info(`\ttzDate.toISOString()`);
        tzDate = XTZ.toUTC("2021-03-14 08:15:59.000", "America/New_York");
        console.info(
            "\t" + tzDate.toISOString(),
            "// same as",
            new Date(tzDate.toISOString()).toISOString()
        );
        console.info();

        console.info("\t// during standard time");
        console.info(
            `\tXTZ.toUTC("2021-11-07 08:15:59.000", "America/New_York")`
        );
        console.info(`\ttzDate.toISOString()`);
        tzDate = XTZ.toUTC("2021-11-07 08:15:59.000", "America/New_York");
        console.info(
            "\t" + tzDate.toISOString(),
            "// same as",
            new Date(tzDate.toISOString()).toISOString()
        );
        console.info();
    }

    //
    // Time Zone-relative time translated to UTC
    //
    function demo2() {
        console.info(
            "What time is it in New York at 8:15am on March 14th UTC?"
        );
        console.info();

        console.info("\t// during daylight savings");
        console.info(
            `\tXTZ.toTimeZone("2021-03-14T08:15:59.000Z", "America/New_York")`
        );
        console.info(`\ttzDate.toISOString()`);
        tzDate = XTZ.toTimeZone("2021-03-14T08:15:59.000Z", "America/New_York");
        console.info(
            "\t" + tzDate.toISOString(),
            "// same as",
            new Date(tzDate.toISOString()).toISOString()
        );
        console.info();

        console.info("\t// during standard time");
        console.info(
            `\tXTZ.toUTC("2021-11-07T08:15:59.000Z", "America/New_York")`
        );
        console.info(`\ttzDate.toISOString()`);
        tzDate = XTZ.toUTC("2021-11-07T08:15:59.000Z", "America/New_York");
        console.info(
            "\t" + tzDate.toISOString(),
            "// same as",
            new Date(tzDate.toISOString()).toISOString()
        );
        console.info();
    }

    demo1();
    demo2();
})();
