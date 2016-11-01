var timerAnch;

function getDate() {
    var today = new Date();
    var t = {};
    t.d = today.getDate();
    t.m = today.getMonth() + 1;
    t.y = today.getYear() + 1900;

    t.d = checkTime(t.d);
    t.m = checkTime(t.m);
    return t;
}

function getTime(a) {
    var today = a ? new Date(a) : new Date();
    var t = {};
    t.h = today.getHours();
    t.m = today.getMinutes();
    t.s = today.getSeconds();
    var mi = today.getMilliseconds();

    t.mi = mi > 944 ? 0 : Math.round((mi / 100));

    t.m = checkTime(t.m);
    t.s = checkTime(t.s);
    t.mi = checkTime(t.mi);

    return t;
}

function renderTime() {
    var t = getTime();
    document.getElementById('intimer').innerHTML =
    t.h + ":" + t.m + ":" + t.s + ":" + t.mi;
}

function checkTime(i) {
    if (i < 10 && i >=0) {
i = "0" + i;
};  // add zero in front of numbers < 10
    return i;
}

function getInterval() {
    return 100;
}

function startTimer() {
    console.log(timerAnch);
    if(!timerAnch) {
        var interval = getInterval();
        timerAnch = setInterval(renderTime, interval);
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
var CONTEXT = {};
CONTEXT[ENTRY_IN] = "success";
CONTEXT[ENTRY_OUT] = "info";

var storageHelper = new StorageHelper();

function createEntry(lbl, val) {
    var ins = storageHelper.getJson('entries', []);
    if(lbl) {
        ins.push(new myMap(lbl, val, ins.length));
    }
    storageHelper.setJson('entries', ins);
    return ins;
}
function getDiff(a, b) {
    if(!(a.value && b.value && (a.value >= b.value))) {
        return null;
    }

    var p = a.value - b.value ;
    return getTimeFromTS(p);
}

function getTimeFromTS(p) {
    var diff = {};
    diff.p = p;
    var _p = {
      mi: 0,
      m: 0,
      s: 0,
      h: 0
    };
    _p.mi = p < 1000 ? p : p % 1000 ;
    if(p > 999) {
        _p.s = p / 1000;
        if(_p.s > 60) {
            _p.m = _p.s / 60;
            _p.s = _p.s % 60;

            if(_p.m > 60) {
                _p.h = _p.m / 60;
                _p.m = _p.m % 60;

                if(_p.h > 24) {
                    diff.m = "Hr > 24 Err";
                    return diff;
                }
            }
        }
    }
    diff.m = checkTime(Math.floor(_p.h)) + ":" + checkTime(Math.floor(_p.m)) + ":" + checkTime(Math.floor(_p.s))
            + ":" + checkTime(Math.floor(_p.mi));
    return diff;
}

function renderTimes(lbl, val) {
    var ins = createEntry(lbl, val);

    var rows = [];
    var total = 0, ntotal =0;
    ins.forEach(function(a, i, arr){
        var t = getTime(a.value);
        var time = t.h + ":" + t.m + ":" + t.s;
        a.p  = a.p || 0;
        var _diff = a.m || "00", prv = arr[i-1];
        if(!(a.m)) {
            if(prv){
                var diff = getDiff(a, prv);
                a.p = diff.p;
                a.m = _diff = diff.m;
                arr[i] = a;
            }
            //diff = checkTime(t.h - p.h) + ":" + checkTime(t.m - p.m) + ":" + checkTime(t.s - p.s);
        }
        total += a.p;
        ntotal += (i && (a.key == ENTRY_OUT && ((prv && prv.key == ENTRY_IN) || (prv && prv.key == ENTRY_OUT))) ||  
         (a.key == ENTRY_IN && (prv && prv.key == ENTRY_IN) )) ? a.p : 0;
        rows.push('<tr class="'+CONTEXT[a.key]+'"><td>'+time+'</td><td>'+ _diff +'</td></tr>');
    });
    var _total = getTimeFromTS(total);
    var _ntotal = getTimeFromTS(ntotal);
    rows.push('<tr class=""><td>'+total+'</td><td>'+ _total.m +'</td></tr>');
    rows.push('<tr class=""><td>'+ntotal+'</td><td>'+ _ntotal.m +'</td></tr>');
    storageHelper.setJson('entries', ins);
    storageHelper.setJson('entriesTimeTotal', total);
    $('#tabletime').html(rows.join(' '));
}
function doIn(){
    renderTimes(ENTRY_IN, (new Date()).getTime());
}

function doOut(){
    renderTimes(ENTRY_OUT, (new Date()).getTime());
}

//myStorage.entries

function clearEntries() {
myStorage.removeItem("entries");
}
//JSON.parse(myStorage.entries)