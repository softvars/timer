
var myMap = function(key, val, idx){
    this.key = key;
    this.value = val;
    this.idx = idx;
};
myMap.prototype.key = null;
myMap.prototype.value = null;
myMap.prototype.idx = null;

var KEY_DATE_ENTRIES = (function(){
    var date = getDate();
    return "" + date.y + date.m + date.d + KEY_DAY_ENTRIES;
})();

function getDate(d) {
    var date = d && d.getDate && d|| new Date();
    var t = {};
    t.d = date.getDate();
    t.m = date.getMonth() + 1;
    t.y = date.getYear() + 1900;

    t.d = checkTime(t.d);
    t.m = checkTime(t.m);
    t.now = date;
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

    //t.h = checkTime(t.h);
    t.m = checkTime(t.m);
    t.s = checkTime(t.s);
    t.mi = checkTime(t.mi);
    return t;
}

/* add zero in front of numbers < 10 */
function checkTime(i) {
    if (i < 10 && i >= 0) {
        i = "0" + i;
    }
    return i;
}
function checkDiffTime(i, milli, noDot) {
    if(!noDot && i === 0){
        i = ' . ';
    } else if (i < 10 && i >= 0) {
        i = i && ((milli ? "00" : "0") + i);
    } else if (milli && i < 100 && i >= 10) {
        i = i && ("0" + i);
    };
    return i;
}

function getTimeFromTSDiff(p) {
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
    diff.m = checkDiffTime(Math.floor(_p.h), false, true) + ":" + checkDiffTime(Math.floor(_p.m), false, true) + ":" + checkDiffTime(Math.floor(_p.s), false, true);
    diff.mi = checkDiffTime(Math.floor(_p.mi), true);
    return diff;
}

function getDiff(a, b) {
    if(!(a.value && b.value && (a.value >= b.value))) {
        return null;
    }
    var p = a.value - b.value ;
    return getTimeFromTSDiff(p);
}

/*-----*/
function getRenderTime(c) {
    var s = c && c.separator;
    var clockType = c.type === 12 || c.type === 24 ? c.type : 12;
    return {
        render: function(d) {
            if(c && c.elm_id) {
                var elm = document.getElementById(c.elm_id);
                if (elm) {
                    var time = '';
                    if (!c.noDate) {
                        var d = getDate(d);
                        time = d.d + s + d.m + s + d.y;
                    }
                    if (!c.noTime) {
                        var t = getTime(d);
                        var h = t.h % clockType;
                        if (c.type) {
                            h = h === 0 && c.type || h
                        }
                        time +=  c.noDate ? '' : '  '
                        time +=  h + s + t.m + s + t.s + (c.noMilli ? '' : s + t.mi);
                    }
                    elm.innerHTML = time;
                }
            }
        }
    }
};

var timerAnch;
function startTimer(conf) {
    console.log(timerAnch);
    if(!timerAnch) {
        timerAnch = setInterval(conf.fn.render, conf.interval);
        console.log("::" + timerAnch);
    }
}

function stopTimer() {
    if(timerAnch) {
        console.log("::" + timerAnch);
        clearInterval(timerAnch);
        timerAnch = null;
    }
    console.log(timerAnch);
}

function getDateFormted(date, noTime){
    date = getDate(date);
    var time = getTime(date.now);
    return "" + date.y + date.m + date.d + (noTime ? '' : '_'+checkTime(time.h)+time.m+time.s);
};

function dataToFileSave(data, fileNamePrefix) {
    try {
        var isFileSaverSupported = !!new Blob;
    } catch (e) {}

    if(isFileSaverSupported && data) {
        var fileName = 'APP.IN_TIME.DATA.' + (fileNamePrefix || '') + getDateFormted(new Date())+'.json';
        var blob = new Blob([JSON.stringify(data)], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, fileName);
  }
}

function exportAppData(fileNamePrefix){
    var data = {};
    storageHelper.each(function(k){
        data[k] = storageHelper.get(k);
    })
    dataToFileSave(data, fileNamePrefix)
}