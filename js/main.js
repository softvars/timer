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
function updateView(ins){
    ins = ins || storageHelper.get(KEY_ENTRIES, []);
    var uc_state = storageHelper.get(KEY_UC_STATE);
    if(ins.length == 0) {
        if(uc_state == ENTRY_IN) {
            storageHelper.set(KEY_UC_STATE, ENTRY_OUT);
            toggleStrictButton($('.option-strict button'), true);
        }
        $(".clear-entries").hide();
    } else {
        var lastEntry = ins[ins.length-1] ;
        if(lastEntry && lastEntry.key ) {
          storageHelper.set(KEY_UC_STATE, lastEntry.key);
          toggleStrictButton($('.option-strict button'), true);
       }
   }
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
        updateView(ins);
	}
    return ins;
}

function renderTimes(lbl, val) {
    setUserStateText(storageHelper.get(KEY_UC_STATE));

    var rows = [], _rows = [];
    var ins = createEntry(lbl, val);
    var isEntries = ins && ins.length;
    if(isEntries) {
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

            rows.push('<tr class="'+CONTEXT[a.key]+'"><td>'+time+'</td><td>'+ _diff +'</td><td class="text-right"><button type="button" data-i="'+i+'" class="btn-remove-entry btn btn-danger btn-xs"> <span data-i="'+i+'" class="removeEntry glyphicon glyphicon-remove-sign"></span></button></td></tr>');
        });
        var _total = getTimeFromTSDiff(total);
        var _ntotal = getTimeFromTSDiff(ntotal);
        var _n2total = getTimeFromTSDiff(n2total);
        _rows.push('<tr class=""><td><strong>Total</strong></td><td>'+ _total.m +'</td><td>'+total+'</td></tr>');
        _rows.push('<tr class="office-total"><td><strong>Total IN</strong></td><td><strong>'+ _ntotal.m +'</strong></td><td>'+ntotal+'</td></tr>');
        _rows.push('<tr class="actual-total"><td><strong>Actual</strong></td><td><strong>'+ _n2total.m +'</strong></td><td>'+n2total+'</td></tr>');
        storageHelper.set(KEY_ENTRIES, ins);
        storageHelper.set(KEY_DATE_ENTRIES, ins);
        storageHelper.set('entriesTimeTotal', total);
    }
    var htmlStr = _rows.join('') + rows.join('');
    $('#tabletime').html(htmlStr);
    if(isEntries) {
        var isEdit = $("body").data("is-edit");
        if(isEdit) {
            $(".clear-entries, button.btn-remove-entry").show();
        }
    }
}

//var in_timer_elm_id = 'intimer';
/*function renderTime(elmId) {
    var t = getTime();
    document.getElementById(elmId).innerHTML = t.h + _COLON + t.m + _COLON + t.s + _COLON + t.mi;
}
*/
var renderTime = getRenderTime({
    elm_id: "intimer",
    separator: ":",
    type: 12
});

startTimer({
    interval : 100,
    fn: renderTime
});

function doIn(){
    storageHelper.set(KEY_UC_STATE, ENTRY_IN);
    renderTimes(ENTRY_IN, (new Date()).getTime());
}

function doOut(){
    storageHelper.set(KEY_UC_STATE, ENTRY_OUT);
    renderTimes(ENTRY_OUT, (new Date()).getTime());
}

$(".btn-clear-entries").off("click");
$(".btn-clear-entries").on("click", function() {
    storageHelper.unset(KEY_ENTRIES);
    storageHelper.set(KEY_UC_STATE, ENTRY_OUT);
    toggleStrictButton($('.option-strict button'), true);
    renderTimes();
    $(".clear-entries").hide();
});


$('table#tabletime').off("click");
$('table#tabletime').on("click", "button.btn-remove-entry",function(e) {
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
$('.option-strict').on("click", "button.enabled", function(e) {
    var uc_state = toggleStrictButton($(this), false);
    if(uc_state == ENTRY_OUT) {
       doIn();
    } else {
       doOut();
    }
});

$('.option-flex').off("click");
$('.option-flex').on("click", "button.enabled", function(e) {
    var $this= $(this);
    var isIn = $this.hasClass('swip-in');
    var isOut = $this.hasClass('swip-out');
    if(isIn) {
       doIn();
    } else if(isOut){
       doOut();
    }
});

$('.tools').off("click");
$('.tools').on("click", "button.edit", function(e) {
    var ins = storageHelper.get(KEY_ENTRIES);
    var isEntries = ins && ins.length;
    if(isEntries) {
        $("body").data("is-edit", true);
        storageHelper.set(KEY_ENTRIES_UNDO, ins);
        $(".confirm-edit, button.btn-remove-entry").show();
        $(".clear-entries").show();
        $(this).addClass('active');
        $(".option-swip button").addClass('disabled');
        $(".option-swip button").removeClass('enabled');
        $(".last-row").addClass('edit-start');
    }
});

$(".confirm-edit").off("click");
$(".confirm-edit").on("click", "button", function(){
    $this = $(this);
    if($this.hasClass("btn-done-edit")){
        //done
    } else if($this.hasClass("btn-cancel-edit")) {
        var ins = storageHelper.get(KEY_ENTRIES_UNDO, []);
        storageHelper.set(KEY_ENTRIES, ins);
        storageHelper.set(KEY_DATE_ENTRIES, ins);
        updateView(ins);
        renderTimes();
    }
    $(".clear-entries, .confirm-edit, button.btn-remove-entry").hide();
    $("body").data("is-edit", false);
    $('.tools button.edit').removeClass('active');
    $(".option-swip button").removeClass('disabled');
    $(".option-swip button").addClass('enabled');
    $(".last-row").removeClass('edit-start');
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
}

function toggleStrictButton($elm, noswap) {
    if($elm) {
        var uc_state = storageHelper.get(KEY_UC_STATE);
        var state = (!!(noswap) && ((uc_state == ENTRY_IN) ? ENTRY_OUT : ENTRY_IN)) || uc_state;
        setupStrictButton($elm, state);
        return uc_state;
    }
}

function page_init() {
    toggleStrictButton($('.option-strict button'), true);
    day_init();
    renderTimes();
}

$(function(){
    page_init();
});