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


var myMap = function(key, val, idx){
    this.key = key;
    this.value = val;
    this.idx = idx;
};
myMap.prototype.key = null;
myMap.prototype.value = null;

var ENTRY_IN = 'IN';
var ENTRY_OUT = 'OUT';
var storageHelper = new StorageHelper();

function createEntry(lbl, val) {
    var ins = storageHelper.getJson('entries', []);
    ins.push(new myMap(lbl, val, ins.length));
    return storageHelper.setJson('entries', ins);
}

function doIn(){
    createEntry(ENTRY_IN, (new Date()).getTime());
}

function doOut(){
    createEntry(ENTRY_OUT, (new Date()).getTime());
}