var d = new Date("5/18/2019, 07:49:13");
// Fri May 17 2019 17:49:13 GMT-0400 (Eastern Daylight Time)
// utc should be Fri, 17 May 2019 21:49:13 GMT"
// 
console.log("d:" + d)
console.log("tzUTC:" + tzUTC(d, 'Australia/Sydney'))

d = new Date("5/17/2019, 14:53:21");
console.log("d:" + d)

// Fri May 17 2019 17:53:21 GMT-0400 (Eastern Daylight Time)
// utc "Fri, 17 May 2019 21:53:21 GMT"

console.log("tzUTC:" + tzUTC(d, 'America/Los_Angeles'))


//////
////// 9:01 twice
//////

var d = new Date("3/10/2019, 01:59:00");
console.log("tzUTC:" + tzUTC(d, 'America/Denver'));
// tzUTC:Sun, 10 Mar 2019 08:59:00 GMT

var d = new Date("3/10/2019, 02:01:00");
console.log("tzUTC:" + tzUTC(d, 'America/Denver'));
// tzUTC:Sun, 10 Mar 2019 09:01:00 GMT

var d = new Date("3/10/2019, 02:59:00");
console.log("tzUTC:" + tzUTC(d, 'America/Denver'));
// tzUTC:Sun, 10 Mar 2019 09:59:00 GMT

var d = new Date("3/10/2019, 03:01:00");
console.log("tzUTC:" + tzUTC(d, 'America/Denver'));
// tzUTC:Sun, 10 Mar 2019 09:01:00 GMT

//////
////// 8:01 never
//////

var d = new Date("11/03/2019, 01:59:00");
console.log("tzUTC:" + tzUTC(d, 'America/Denver'));
// tzUTC:Sun, 03 Nov 2019 07:59:00 GMT

var d = new Date("11/03/2019, 02:01:00");
console.log("tzUTC:" + tzUTC(d, 'America/Denver'));
// tzUTC:Sun, 03 Nov 2019 09:01:00 GMT

var d = new Date("11/03/2019, 02:59:00");
console.log("tzUTC:" + tzUTC(d, 'America/Denver'));
// tzUTC:Sun, 03 Nov 2019 09:59:00 GMT

var d = new Date("11/03/2019, 03:01:00");
console.log("tzUTC:" + tzUTC(d, 'America/Denver'));
tzUTC:Sun, 03 Nov 2019 10:01:00 GMT


/*
Yes, that's a major use case. And one that can contact people according to their timezone. The daylight savings problem most likely won't affect us. But it could.
As a failsafe is there a way that you could detect daylight savings time and report it? Perhaps create 3 times and check that the difference on either side is exactly 1.5 hours?
*/

/*
But there's a second thing, more along the lines of a scheduler:

Given a target date in local time, produce the same local time a week later.

"I'm having lunch with John today at 12:30 pm. Schedule a lunch next week at 12:30pm."

The naive approach that almost always works is to simply add (7 x 24 x 60 x 60 x 1000), but that won't work if the lunch happened on either of these days:

var d = new Date("03/07/2019, 12:30:00"); // +  (7 * 24 * 60 * 60 * 1000)

var d = new Date("11/01/2019, 12:30:00"); // +  (7 * 24 * 60 * 60 * 1000)

In both instances my simple calendar would be off by an hour.
*/

/*
I think the solution will be:

srcMs = toMs(srcLocalDate)
targetMs = srcMs + diffMs
targetLocalDate = toLocal(targetMs)
targetMs += toMsAsIfUtc(srcLocalDate) - (toMsAsIfUtc(targetLocalDate) - diffMs)
return toLocalDate(targetMs)
*/

(function (exports) {
'use strict';

exports.TEST = function (myfn) {

  var tests = [
    { name: "normal date"
    , input: { d: '5/18/2019, 8:59:48 AM', tz: "America/Denver" }
    , expected: 1558191588007
    }
  ];

  function next() {
    var t = tests.shift();
    var result;
    if (!t) {
      return true;
    }
    try {
      result = Promise.resolve(myfn(t.input));
    } catch(e) {
      result = Promise.reject(e);
    }

    result.then(function (result) {
      if (result === t.expected) {
        return true;
      }
      throw new Error(t.name + ": result did not match expected: " + JSON.stringify(result) + " vs " + JSON.stringify(t.expected));
    });
  }

  return next();
};
}('undefined' === typeof module ? window : module.exports));

runner.js:
(function (exports) {
'use strict';

var tzUtc = exports.tzUtc || require('./index.js').tzUtc;
var tester = exports.TEST || require('./test.js').TEST;
tester(tzUtc);

}('undefined' === typeof module ? window : module.exports));