function msToTime(ms) {
    var time = ms / 1000;
    var seconds = time % 60;
    time /= 60;
    var minutes = time % 60;
    time /= 60;
    var hours = time % 24;
    time /= 24;
    var days = time;

    seconds = Math.floor(seconds);
    minutes = Math.floor(minutes);
    hours = Math.floor(hours);
    days = Math.floor(days);

    seconds.toString().length === 1 ? seconds = '0' + seconds.toString() : seconds = seconds.toString();
    minutes.toString().length === 1 ? minutes = '0' + minutes.toString() : minutes = minutes.toString();
    hours.toString().length === 1 ? hours = '0' + hours.toString() : hours = hours.toString();

    return `${days} days, ${hours}:${minutes}:${seconds}`;
}

exports.msToTime = msToTime;