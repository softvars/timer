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

function checkTime(i) {
    if (i < 10 && i >=0) {
        i = "0" + i;
    };  // add zero in front of numbers < 10
    return i;
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


var KEY_ENTRIES = "entries";
var KEY_UC_STATE = "User_Curr_State";
var KEY_DAY_ENTRIES = "_TimeEntries";

var KEY_DATE_ENTRIES = (function(){
    var date = getDate();
    return "" + date.y + date.m + date.d + KEY_DAY_ENTRIES;
})();

var storageHelper = new StorageHelper();

function createEntry(lbl, val) {
    var ins = storageHelper.get(KEY_ENTRIES, []);
    if(lbl) {
        ins.push(new myMap(lbl, val, ins.length));
        storageHelper.set(KEY_ENTRIES, ins);
        storageHelper.set(KEY_DATE_ENTRIES, ins);
    }
    return ins;
}
function removeEntry(i) {
    var ins = storageHelper.get(KEY_ENTRIES, []);
    if(i >= 0 && i < ins.length) {
        ins.splice(i, 1);
        var nextEntry = ins[i];
        if(nextEntry && nextEntry.m){
            nextEntry.p = nextEntry.m = null;
            ins[i] = nextEntry;
        }
        storageHelper.set(KEY_ENTRIES, ins);
        storageHelper.set(KEY_DATE_ENTRIES, ins);
    }
    return ins;
}
function getDiff(a, b) {
    if(!(a.value && b.value && (a.value >= b.value))) {
        return null;
    }

    var p = a.value - b.value ;
    return getTimeFromTSDiff(p);
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
    diff.m = checkTime(Math.floor(_p.h)) + ":" + checkTime(Math.floor(_p.m)) + ":" + checkTime(Math.floor(_p.s))
            + ":" + checkTime(Math.floor(_p.mi));
    return diff;
}

function renderTimes(lbl, val) {
    setUserStateText(storageHelper.get(KEY_UC_STATE));

    var ins = createEntry(lbl, val);
    var rows = [];
    var total = 0, ntotal =0, n2total=0;
    ins.forEach(function(a, i, arr){
        if(!(a && a.value)) {
            return;
        }
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

        n2total += (i && (a.key == ENTRY_OUT && (prv && prv.key == ENTRY_IN)) ||
         (a.key == ENTRY_IN && (prv && prv.key == ENTRY_IN) )) ? a.p : 0;
        rows.push('<tr class="'+CONTEXT[a.key]+'"><td>'+time+'</td><td>'+ _diff +'</td><td class="text-right"><button type="button" class="btn btn-danger btn-xs"> <span data-i="'+i+'" class="removeEntry glyphicon glyphicon-remove-sign"></span></button></td></tr>');
    });
    var _total = getTimeFromTSDiff(total);
    var _ntotal = getTimeFromTSDiff(ntotal);
    var _n2total = getTimeFromTSDiff(n2total);
    rows.push('<tr class=""><td><strong>Total</strong></td><td>'+ _total.m +'</td><td>'+total+'</td></tr>');
    rows.push('<tr class="office-total"><td><strong>Office</strong></td><td><strong>'+ _ntotal.m +'</strong></td><td>'+ntotal+'</td></tr>');
    rows.push('<tr class="actual-total"><td><strong>Actual</strong></td><td><strong>'+ _n2total.m +'</strong></td><td>'+n2total+'</td></tr>');
    storageHelper.set(KEY_ENTRIES, ins);
    storageHelper.set(KEY_DATE_ENTRIES, ins);
    storageHelper.set('entriesTimeTotal', total);
    $('#tabletime').html(rows.join(' '));
}

var in_timer_elm_id = 'intimer';
function renderTime() {
    var t = getTime();
    document.getElementById(in_timer_elm_id).innerHTML = t.h + ':' + t.m + ':' + t.s + ':' + t.mi;
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

startTimer();
function stopTimer() {
    if(timerAnch) {
        console.log("::" + timerAnch);
        clearInterval(timerAnch);
        timerAnch = null;
    }
    console.log(timerAnch);
}

function doIn(){
    storageHelper.set(KEY_UC_STATE, ENTRY_IN);
    renderTimes(ENTRY_IN, (new Date()).getTime());
}

function doOut(){
    storageHelper.set(KEY_UC_STATE, ENTRY_OUT);
    renderTimes(ENTRY_OUT, (new Date()).getTime());
}

function clearEntries() {
    storageHelper.unset(KEY_ENTRIES);
    storageHelper.set(KEY_UC_STATE, ENTRY_OUT);
    toggleStrictButton($('.option-strict button'), true);
    renderTimes();
}

$('table#tabletime').off("click");
$('table#tabletime').on("click", "span.removeEntry",function(e) {
    var i = $(this).data("i");
    console.log(i);
    removeEntry(i);
    renderTimes();
});

$('.menu').off("click");
$('.menu').on("click", "button.strict", function(e) {
    $('.option-strict').show();
    $('.option-flex').hide();
    toggleStrictButton($('.option-strict button'), true);
});

$('.menu').on("click", "button.flex", function(e) {
    $('.option-strict').hide();
    $('.option-flex').show();
});

$('.option-strict').off("click");
$('.option-strict').on("click", "button", function(e) {
    var uc_state = toggleStrictButton($(this), false);
    //setUserStateText(uc_state);
    if(uc_state == ENTRY_OUT) {
       doIn();
    } else {
       doOut();
    }
});

function day_init() {
    var todayEntries = storageHelper.get(KEY_DATE_ENTRIES);
    if(!(todayEntries)) {
        storageHelper.set(KEY_ENTRIES, []);
        storageHelper.set(KEY_DATE_ENTRIES, []);
    }
    storageHelper.set(KEY_UC_STATE, (storageHelper.get(KEY_UC_STATE) || ENTRY_OUT));
}

function setUserStateText(state){
    $('.status-info span.user-state').get(0).innerText = state;
}

function setupStrictButton($elm, state) {
    $elm.children('span.ti-btn-lbl').get(0).innerText = state;
    $elm.addClass(state == ENTRY_IN ? 'btn-primary' : 'btn-warning swip-out');
    $elm.removeClass(state == ENTRY_OUT ? 'btn-primary' : 'btn-warning swip-out');
    //setUserStateText(storageHelper.get(KEY_UC_STATE));
}

function toggleStrictButton($elm, noswap) {
    if($elm) {
        var uc_state = storageHelper.get(KEY_UC_STATE);
        var state = (!!(noswap) && ((uc_state == ENTRY_IN) ? ENTRY_OUT : ENTRY_IN)) || uc_state;
        setupStrictButton($elm, state);
        return uc_state
    }
}

function page_init() {
    //var uc_state = storageHelper.get(KEY_UC_STATE);
    //var _uc_state = uc_state == ENTRY_IN ? ENTRY_OUT : ENTRY_IN;
    toggleStrictButton($('.option-strict button'), true);
    //setUserStateText(storageHelper.get(KEY_UC_STATE));
    day_init();
    renderTimes();
}

$(function(){
    page_init();
});