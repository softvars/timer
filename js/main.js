var timerAnch;
function getInterval() {
    return 100;
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var mi = today.getMilliseconds();

    mi = mi > 944 ? 0 : Math.round((mi / 100));
//console.log(mi);

    m = checkTime(m);
    s = checkTime(s);
    mi = checkTime(mi);

    document.getElementById('intimer').innerHTML =
    h + ":" + m + ":" + s + ":" + mi;

    //var interval = getInterval();
    //timerAnch = setTimeout(startTime, interval);
    //return timerAnch;
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

function startTimer() {
    console.log(timerAnch);
    if(!timerAnch) {
        var interval = getInterval();
        timerAnch = setInterval(startTime, interval);
        console.log("::" + timerAnch);
    }
}

function stopTimer() {
    //clearTimeout(timerAnch);
    if(timerAnch) {
        console.log("::" + timerAnch);
        clearInterval(timerAnch);
        timerAnch = null;
    }
    console.log(timerAnch);
}