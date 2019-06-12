/**
 * take a date of assumed timezone and convert to utc
 *
 * @param {*} d
 * @param {*} tz
 * @returns
 */
function tzUTC(d, tz) {
    // first calculate tz difference
    var date = new Date();
    var options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZone: tz
    };
    var tzDate = new Intl.DateTimeFormat('en-US', options).format(date)
    var diff = date - new Date(tzDate);
    var minutes = Math.floor((diff / 1000) / 60);
    var localTime = new Date(d);
    localTime.setMinutes(d.getMinutes() + minutes);
    return localTime.toUTCString();
}