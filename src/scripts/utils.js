
var myMap = function(key, val, idx){
    this.key = key;
    this.value = val;
    this.idx = idx;
};
myMap.prototype.key = null;
myMap.prototype.value = null;
myMap.prototype.idx = null;


var mySettings = function(inTimeAutoRunner){
    this.inTimeAutoRunner = inTimeAutoRunner;
};
mySettings.prototype.inTimeAutoRunner = null;

function extend(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}

function getUserSettings() {
    return storageHelper.get(KEY_USER_SETTINGS, {});
}

function setUserSettings(settings) {
    var settingsObj =  getUserSettings();
    settingsObj = extend(settingsObj,  settings);
    return storageHelper.set(KEY_USER_SETTINGS, settingsObj);
}

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
function checkDiffTime(i, milli, handleZero) {
    /* if(handleZero !== false && i === 0) {
        i = handleZero === 2 ? '' : ' . ';
    }  */
    if(i === 0) {
        i = (milli ? '000' : '00');
    } else if (i < 10 && i > 0) {
        i = ((milli ? "00" : "0") + i);
    } else if (milli && i < 100 && i >= 10) {
        i = i && ("0" + i);
    };
    return i;
}

var hZ_ = function(t, handleZero) {
    return (t === 0 && handleZero === 2) ? '' : ':';
}

function getTimeFromTSDiff(p, handleZero) {
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
                    diff.m = "Err: Hour is > 24";
                    return diff;
                }
            }
        }
    }
    var _pH = Math.floor(_p.h);
    var _pM = Math.floor(_p.m);
    var _pS = Math.floor(_p.s);
    //diff.m = checkDiffTime(_pH, false, handleZero) + hZ_(_pH, handleZero) + checkDiffTime(_pM, false, (handleZero === false && handleZero)|| (_pH === 0 && handleZero)) + hZ_(_pM, handleZero) + checkDiffTime(_pS, false, (handleZero === false && handleZero)|| ((_pH === 0 || _pM === 0) && handleZero));
    diff.m = checkDiffTime(_pH, false, handleZero) + ':' + checkDiffTime(_pM, false, handleZero) + ':' + checkDiffTime(_pS, false, handleZero);
    diff.mi = checkDiffTime(Math.floor(_p.mi), true);
    return diff;
}

function getDiff(a, b) {
    if(!(a.value && b.value && (a.value >= b.value))) {
        return null;
    }
    var p = a.value - b.value ;
    return getTimeFromTSDiff(p, false);
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

//var timerAnch;
function startTimer(conf) {
    conf.anch = conf.anch || []
    conf.anch.push(setInterval(conf.fn.render, conf.interval));
    console.log("startTimer::" + conf.anch);
    return conf;
}

function stopTimer(conf) {
    if(conf && conf.anch) {
        conf.anch.forEach(function(a){
            console.log("stopTimer::" + a);
            clearInterval(a);
        })
        conf.anch = []
    }
    return conf;
}

function getDateFormted(date, noTime){
    date = getDate(date);
    var time = getTime(date.now);
    return "" + date.y + date.m + date.d + (noTime ? '' : '_'+checkTime(time.h)+time.m+time.s);
};

function showAlert(config) {
    var toRet = null;
    var msg = config.msg;
    if(msg) {
        var type = config.type || 'success';
        var duration = config.duration;
        //type = (type && 'alert-' + type);
        var appAlert = $('div#inTimeAppAlert');
        appAlert.removeClass('alert-success alert-info alert-warning alert-danger');
        type && appAlert.addClass('alert-' + type);
        appAlert.show();
        appAlert.find('span.alertMessage').html(msg)
        toRet = setTimeout(function(){
            /* appAlert.alert('close') */
            appAlert.hide();
        }, duration || 3500)
    }
    return toRet;
}
$('.app-alert.alert').on('click', '.close', function(){
    $('.app-alert.alert').hide();
})

function dataToFileSave(data, fileNamePrefix) {
    try {
        var isFileSaverSupported = !!new Blob;
    } catch (e) {}

    if(isFileSaverSupported && data) {
        var fileName = 'APP.IN_TIME.DATA.' + (fileNamePrefix || '') + getDateFormted(new Date())+'.json';
        var blob = new Blob([JSON.stringify(data)], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, fileName);
        showAlert({
            msg: 'Data exported and saved as "'+fileName+'"'
        });
  }
}

function exportAppData(fileNamePrefix){
    var data = {};
    storageHelper.each(function(k){
        data[k] = storageHelper.get(k);
    })
    dataToFileSave(data, fileNamePrefix)
}

function dateCompareAsc(o1, o2) {
    return dateFns.compareAsc(new Date(o1.value), new Date(o2.value));
}

function sortObjectByDate(list) {
    if(list && dateFns) {
        list = list.sort(dateCompareAsc);
    }
    return list;
}

/* ALERT */
function toggleAlert(at) {
  var appAlert = $('#appAlert');
  var show = !!at;
  if (show) {
    $('#appAlerInfo').html(at.title || 'Warning : ');
    $('#appAlertMessage').html(at.msg);
    appAlert.show();
    var milli = at.milli || 4000;
    setTimeout(function(){
      appAlert.hide();
    }, milli)
  }
  !show && appAlert.hide();
}
