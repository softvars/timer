function getEntries() {
    return storageHelper.get(userCurrentDate, []);
}
function createEntry(lbl, val) {
    var ins = getEntries();
    if(lbl) {
        ins.push(new myMap(lbl, val, ins.length));
        storageHelper.set(userCurrentDate, ins);
    }
    return ins;
}
function getLastEntryState(ins) {
    ins = ins || getEntries();
    var uc_state = ENTRY_OUT
    if(ins.length > 0) {
        var lastEntry = ins[ins.length-1] ;
        uc_state = lastEntry && lastEntry.key
    }
    return uc_state; 
}
function updateView(ins){
    ins = ins || getEntries();
    var uc_state = getLastEntryState(ins)
    if(ins.length === 0) {
        $(".clear-entries").hide();
    }
    storageHelper.set(KEY_UC_STATE, uc_state);
    toggleStrictButton($('.option-strict button'), true);
}

/* ENTRY_IN,
ENTRY_OUT 
(new Date()).getTime());
 new myMap()*/
 /** Add Manual Entry Draft */
function insertEntry(entry) {
    var ins = getEntries();
    var i = entry && entry.idx;
    if(i >= 0 && i <= ins.length) {
        if(entry && entry.m){
            entry.p = entry.m = null;
        }
        ins.splice(i, 0, entry);
        storageHelper.set(userCurrentDate, ins);
	}
    return ins;
}

function removeEntry(i) {
    var ins = getEntries();
    if(i >= 0 && i < ins.length) {
        ins.splice(i, 1);
        var nextEntry = ins[i];
        if(nextEntry && nextEntry.m){
            nextEntry.p = nextEntry.m = null;
            ins[i] = nextEntry;
        }
        storageHelper.set(userCurrentDate, ins);
	}
    return ins;
}

function renderTimes(lbl, val) {
    var rows = [], _rows = [], _rows2 = [];
    var ins = createEntry(lbl, val);
    var isEntries = ins && ins.length;
    var total = 0, ntotal =0, n2total=0;
    if(isEntries) {
        ins.forEach(function(a, i, arr){
            if(!(a && a.value)) {
                return;
            }
            var t = getTime(a.value);
            var time = t.h + ":" + t.m + ":" + t.s;
            a.p  = a.p || 0;
            var _diff = a.m || "00", prv = arr[i-1];
            var _diffMi = a.mi || "000";
            if(!(a.m)) {
                if(prv){
                    var diff = getDiff(a, prv);
                    a.p = diff.p;
                    a.m = _diff = diff.m;
                    a.mi = _diffMi = diff.mi;
                    arr[i] = a;
                }
                //diff = checkTime(t.h - p.h) + ":" + checkTime(t.m - p.m) + ":" + checkTime(t.s - p.s);
            }
            total += a.p;
            ntotal += (i && (a.key == ENTRY_OUT && ((prv && prv.key == ENTRY_IN) || (prv && prv.key == ENTRY_OUT))) ||  
             (a.key == ENTRY_IN && (prv && prv.key == ENTRY_IN) )) ? a.p : 0;

            n2total += (i && (a.key == ENTRY_OUT && (prv && prv.key == ENTRY_IN)) ||
             (a.key == ENTRY_IN && (prv && prv.key == ENTRY_IN) )) ? a.p : 0;

            rows.push('<tr class="'+CONTEXT[a.key]+'"><td>'+time+'</td><td class="time-diff">'+ _diff +'<span class="time-diff-mi"> '+ _diffMi +'</span></td><td class="text-right"><span class="entryStateSingle">'+a.key+'</span><button type="button" data-i="'+i+'" class="btn-remove-entry btn btn-danger btn-xs"> <span data-i="'+i+'" class="removeEntry glyphicon glyphicon-remove-sign"></span></button></td></tr>');
        });
    }
    var _total = getTimeFromTSDiff(total);
    var _ntotal = getTimeFromTSDiff(ntotal);
    var _n2total = getTimeFromTSDiff(n2total);
/*     _rows2.push('<tr class="filo-total"><td><strong>FILO</strong></td><td class="time-diff">'+ _total.m +'</td><td class="time-diff-milli">'+total+'</td></tr>');
    _rows2.push('<tr class="actual-total"><td><strong>'+(n2total != ntotal ? 'Paired' : 'In Time' ) + '</strong></td><td class="time-diff"><strong>'+ _n2total.m +'</strong></td><td class="time-diff-milli">'+n2total+'</td></tr>');
    if(n2total != ntotal) {
        _rows2.push('<tr class="office-total"><td><strong>Flexed</strong></td><td class="time-diff"><strong>'+ _ntotal.m +'</strong></td><td class="time-diff-milli">'+ntotal+'</td></tr>');
    } */
    _rows2.push('<tr class="filo-total"><td><strong>FILO</strong> Total</td><td class="time-diff"><strong>'+ _total.m +'</strong></td></tr>');
    _rows2.push('<tr class="actual-total"><td>'+(n2total === ntotal ? 'Total ' : '' )+'<strong>'+(n2total === ntotal ? 'In Time' : 'Paired' ) + '</strong></td><td class="time-diff"><strong>'+ _n2total.m +'</strong></td></tr>');
    if(n2total != ntotal) {
        _rows2.push('<tr class="office-total"><td><strong>Flexed</strong></td><td class="time-diff"><strong>'+ _ntotal.m +'</strong></td></tr>');
    }
    _rows.push('<tr class="entryHeader"><td><span></span></td><td class="entryHeaderMilli text-align-right"><span>hh:mm:ss milli</span></td><td  class="text-align-right"><span>IN / OUT</span></td></tr>');
    storageHelper.set(userCurrentDate, ins);
    storageHelper.set(KEY_TOTAL_TIME, total);

    var htmlStrTotal = _rows2.join('');
    $('#tabletimeTotal').html(htmlStrTotal);
    var htmlStr = _rows.join('') + rows.join('');
    $('#tabletime').html(htmlStr);
    if(isEntries) {
        var isEdit = $("body").data("is-edit");
        if(isEdit) {
            $(".clear-entries, button.btn-remove-entry").show();
        }
    }
    updateView(ins);
    setUserStateText(storageHelper.get(KEY_UC_STATE));
    toggleDateListEditIcon(true);
}

var renderTime = getRenderTime({
    elm_id: "intimer",
    separator: ":",
    type: 12,
    noDate: true,
    noMilli: true
});

startTimer({
    interval : 1000,
    fn: renderTime
});

var renderTodayDate = getRenderTime({
    elm_id: "intimerDate",
    separator: ":",
    noTime: true,
    type: 12
});
renderTodayDate.render();

var renderDate = getRenderTime({
    elm_id: "entryDate",
    separator: ":",
    noTime: true,
    type: 12
});

function doIn(){
    renderTimes(ENTRY_IN, (new Date()).getTime());
}

function doOut(){
    renderTimes(ENTRY_OUT, (new Date()).getTime());
}

$(".btn-clear-entries").off("click");
$(".btn-clear-entries").on("click", function() {
    storageHelper.unset(userCurrentDate);
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

$('.settings-menu.enabled').off("click");
$('.settings-menu.enabled').on("click", ".toolbar.strict", function(e) {
    if (userCurrentDate === KEY_DATE_ENTRIES) {
        $('.option-strict').show();
        $('.option-flex').hide();
        toggleStrictButton($('.option-strict button'), true);
        $(".setting-mode .strict, .setting-mode .flex").toggleClass('active');
        storageHelper.set(KEY_UC_SETTINGS_MODE, MODE_PAIR);
    }
});

$('.settings-menu.enabled').on("click", ".toolbar.flex", function(e) {
    if (userCurrentDate === KEY_DATE_ENTRIES) {
        $('.option-strict').hide();
        $('.option-flex').show();
        $(".setting-mode .strict, .setting-mode .flex").toggleClass('active');
        storageHelper.set(KEY_UC_SETTINGS_MODE, MODE_FLEX);
    }
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


$('#myDataImportModal').off("click");
$('#myDataImportModal').on("click", "button.submit, button.cancel", function(e) {
    var $this = $(this);
    var callback = $('#myDataImportModal').data('callback');
    callback($this.hasClass("submit"));
    $('#myDataImportModal').modal('hide');
});

function confirmOverWrite(callback) {
    $('#myDataImportModal').data('callback', callback);
    $('#myDataImportModal').modal('show');
}

function updateAppWithData_(result, overWrite){
    var i=0, j=0;
    for( var key in result) {
        var isDate = key.endsWith(KEY_DAY_ENTRIES);
        isDate && i++;
        var isValue = storageHelper.get(key) !== undefined;
        if(isDate && isValue) {
            j++;
            overWrite && storageHelper.set(key, result[key]);
        } else {
            storageHelper.set(key, result[key]);
        }
    }
    app_in_time_init();
}
function updateAppWithData(result){
    var isValue = false, i=0, overWrite = null;
    for( var key in result) {
        i++;
        var isDate = key.endsWith(KEY_DAY_ENTRIES);
        isValue = isDate && storageHelper.get(key) !== undefined;
        if(isValue) {
            confirmOverWrite(function(res){
                overWrite = res;
                updateAppWithData_(result, overWrite);
            });
            break;
        } 
    }
    if(!isValue && i === Object.keys(result).length){
        updateAppWithData_(result, overWrite);
    }
}
$('.setting-app-data').off("click");
$('.setting-app-data').on("click", ".toolbar.app-data-export", function(e) {
    exportAppData();
});
$('.setting-app-data').on("click", ".toolbar.app-data-import", function(e) {
    JSONReader.read(function(result) {
        console.log(result);
        updateAppWithData(result);
    });
});

$('.menu').off("click");
$('.menu').on("click", "button.edit.enabled", function(e) {
    var ins = getEntries();
    var isEntries = ins && ins.length;
    if(isEntries) {
        $('.menu .homeview, .menu .edit').hide();
        $("body").data("is-edit", true);
        storageHelper.set(KEY_ENTRIES_UNDO, ins);
        $(".confirm-edit, button.btn-remove-entry").show();
        $(".clear-entries").show();
        $(this).addClass('active');
        $(".option-swip button").addClass('disabled');
        $(".option-swip button").removeClass('enabled');
        $(".last-row").addClass('edit-start');

        $(".tools .toolbar").addClass('disabled');
        $(".tools .toolbar").removeClass('enabled');
    }
});

$(".confirm-edit").off("click");
$(".confirm-edit").on("click", "button", function(){
    $this = $(this);
    if($this.hasClass("btn-done-edit")){
        storageHelper.set(KEY_ENTRIES_UNDO, []);
    } else if($this.hasClass("btn-cancel-edit")) {
        var ins = storageHelper.get(KEY_ENTRIES_UNDO, []);
        storageHelper.set(userCurrentDate, ins);
        renderTimes();
    }
    $('.menu .edit').show();
    $(".clear-entries, .confirm-edit, button.btn-remove-entry").hide();
    $("body").data("is-edit", false);
    $('.menu button.edit').removeClass('active');
    $(".option-swip button").removeClass('disabled');
    $(".option-swip button").addClass('enabled');
    $(".tools .toolbar").addClass('enabled');
    $(".tools .toolbar").removeClass('disabled');
    $(".last-row").removeClass('edit-start');
    toggleHomeView();
});


function dateSelectedForDelete(fn, isAnyOne){
    for( var dateKey in deleteDateKeyArray) {
        if(deleteDateKeyArray[dateKey]) {
            if(typeof fn === "function") {
                fn(dateKey)
            }
            if (isAnyOne) {
                return dateKey;
            }
        }
    }
    return false;
}

$('#myDateListModal').off("click");
$('#myDateListModal').on("click", "button.submit", function(e) {
    $('#goback').addClass('goback').removeClass('edit-close');
    var isDeletedAnything = false;
    dateSelectedForDelete(function(dateKey) {
        storageHelper.unset(dateKey);
        console.log(dateKey);
        isDeletedAnything = true;
        if (dateKey === userCurrentDate) { 
            userCurrentDate = KEY_DATE_ENTRIES;
        }  
    });
    if(isDeletedAnything) {
        updateDateView();
        renderTimes();    
/*         var today = isAppDateListEmpty();
        if(today.length === 0){
            $('.menu button.goback').trigger( "click" );
        } else {
            renderDateListModal();
        } */
    }
    toggleDateListEdit(true);
    //toggleDateListEditIcon();
    $('#myDateListModal').modal('hide');
})

$('.tools').off("click");
$('.tools').on("click", "button.dateList.enabled", function(e) {
    toggleMenu();
})

function toggleMenu(){
    $(".mainContent").toggle();
    $(".data-list-wrapper").toggle();
    setDateListCheckBox(false);
    $('.homeview').hide();
    $('.main-container-wrapper').removeClass('bg2');
    $('.status-info .user-state').removeClass('nocolor');
    $('.toolbar.edit, .toolbar.dateList, .toolbar.goback, .toolbar.edit-list, .toolbar.dropdown-toggle').toggle();
    //toggleDateListEditIcon();
}
function toggleHomeView(){
    var isToday = userCurrentDate === KEY_DATE_ENTRIES;
    $('.homeview').css('display', isToday ? 'none' : 'block');
    $('.option-swip, .setting-mode').css('display', isToday ? 'block' : 'none');
    $('.main-container-wrapper').toggleClass('bg2', !isToday);
    $('.main-container-wrapper').toggleClass('bg2', !isToday);
    $('.status-info .user-state').toggleClass('nocolor', !isToday);
    toggleDateListEditIcon(true);
    var mode = storageHelper.get(KEY_UC_SETTINGS_MODE);
    if (mode === MODE_FLEX) {
        $('.option-strict').hide();
        $(".setting-mode .flex").addClass('active');
        $(".setting-mode .strict").removeClass('active');
    } else {
        $('.option-flex').hide();
        $(".setting-mode .strict").addClass('active');
        $(".setting-mode .flex").removeClass('active');
    }
}
$('.menu').on("click", "button.goback.enabled", function(e) {
    toggleMenu();
    $('.toolbar.edit-list, .toolbar.clear-all, .toolbar.select-all, .toolbar.delete-date-list, .checkbox-wrapper').hide();
    toggleHomeView();
})

$('.menu').on("click", "button.homeview.enabled", function(e) {
    var elm = $('.data-list-wrapper ul').find('li[data-date-key="'+KEY_DATE_ENTRIES+'"]').get(0);
    setCurrentDate(elm);
})

function isAppDateListEmpty(){
    var today = storageHelper.getLength() === 6 && storageHelper.get(KEY_DATE_ENTRIES);
    return today;
}
function toggleDateListEditIcon(isHome){
    var today = isAppDateListEmpty();
    if (today) {
        if (today.length === 0) {
            $(".toolbar.edit, .toolbar.edit-list, .tools button.dateList, .entryHeader").hide();
        } else {
            $(".tools button.dateList, .entryHeader").show();
            !isHome && $(".toolbar.edit-list").show();
            isHome && $(".toolbar.edit").show();
        }
        renderDateListModal();
    }
}
function toggleDateListEdit(hideCheckBox){
    //if (storageHelper.getLength() > 6) {
        $('.toolbar.edit-list, .toolbar.clear-all, .toolbar.select-all').toggle();

        if (hideCheckBox) {
            $(".checkbox-wrapper").hide();
        } else {
            $(".checkbox-wrapper").toggle();
        }
    //}
    //toggleDateListEditIcon();
    updateDeleteIcon();
}

$('.tools').on("click", "button.edit-list.enabled", function(e) {
    toggleDateListEdit();
    $('#goback').removeClass('goback').addClass('edit-close');
})

var deleteDateKeyArray = {}

function setDateListCheckBox(setval) {
    var allckeck = $(".data-list-wrapper .date-list .delete-date");
    deleteDateKeyArray = {}
    if(setval) {
        getDateKeys(function(o){
            deleteDateKeyArray[o.key] = setval
        })
    }
    for (var i = 0 ; i< allckeck.length; i++) {
        $(allckeck[i]).prop('checked', setval);
    }
    updateDeleteIcon();
}
$('.menu').on("click", "button.edit-close.enabled", function(e) {
    setDateListCheckBox(false);
    toggleDateListEdit(true);
    $('#goback').addClass('goback').removeClass('edit-close');
})
$('.tools').on("click", "button.clear-all.enabled", function(e) {
    setDateListCheckBox(false)
})
$('.tools').on("click", "button.select-all.enabled", function(e) {
    setDateListCheckBox(true)
})

function updateDeleteIcon(){
    var isDateSelectedForDelete = dateSelectedForDelete(null, true);
    $('.toolbar.delete-date-list').css('display', isDateSelectedForDelete ? 'block' : 'none');
}
$('.data-list-wrapper').off("click");
$('.data-list-wrapper').on("click", ".date-list", function(e) {
    var isDateEditOn = $('.toolbar.edit-close').css('display') === 'block'
    var targetElem = $(e.target);
    var curTargetElem = $(e.currentTarget);
    var isDeleteDate = targetElem.hasClass('delete-date');
    if(isDateEditOn || isDeleteDate) {
        var dateKey = curTargetElem && curTargetElem.data('date-key');
        if(!isDeleteDate) {
            targetElem = curTargetElem.find('.delete-date')
            targetElem[0].checked = !targetElem[0].checked
        }
        if (dateKey) {
            deleteDateKeyArray[dateKey] = targetElem[0].checked
        }
        updateDeleteIcon();
    } else {
        if (!isDateEditOn) {
            $('.tools button.dateList.enabled').trigger( "click" );
            setCurrentDate(this);
        }
    }
})

function setCurrentDate(elm){
    if (elm) {
        userCurrentDate = $(elm).data('date-key');
        storageHelper.set(KEY_UC_DATE, userCurrentDate);
        $('.data-list-wrapper .date-list').not(elm).removeClass('active');
        $(elm).addClass('active');
        page_init();
    }
}

function renderDateListModal() {
    var html = ''
    getDateKeys(function(o){
        html += '<li role="presentation" class="date-list'+ ((o.key === userCurrentDate) && ' active' || '') +'" data-date-key="'+o.key+'"><a href="#">'+o.label+'<span class="checkbox-wrapper"><input class="delete-date" type="checkbox" id="inlineCheckbox1"></span></a></li>'
    })
    $('.data-list-wrapper .date-list-group').html(html);
    $(".checkbox-wrapper").hide();
    deleteDateKeyArray = {}
}
$(".data-list-wrapper").hide();

var getDateFromKeys =function(k){
    return (k && k.endsWith(KEY_DAY_ENTRIES) && k.split('_')[0]) || ''
};

function getDateKeys(fn) {
    if(typeof fn === "function") {
        storageHelper.each(function(k){
            var l = getDateFromKeys(k)
            if(l){
                fn({key:k, label:l});
            }
        })
    }
}

var userCurrentDate = KEY_DATE_ENTRIES
storageHelper.set(KEY_UC_DATE, KEY_DATE_ENTRIES);
function updateDateView() {
    var todayEntries = storageHelper.get(userCurrentDate);
    if(!(todayEntries)) {
        storageHelper.set(userCurrentDate, []);
    }
    var l = getDateFromKeys(userCurrentDate)
    if (l){
        var dateStr = l.substring(4, 0) + '/' + l.substring(6, 4)+ '/' + l.substring(6)
        var d = new Date(dateStr);
        renderDate.render(d);
    }
    //toggleDateListEditIcon(true);
}
function day_init() {
    updateDateView();
    toggleHomeView();
}

function setUserStateText(state){
    if (state) { 
        $('.status-info span.user-state').removeClass('in out').addClass(state.toLowerCase());
        $('.status-info span.user-state').get(0).innerText = state;
    }
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
    day_init();
    $(".edit-list, .edit-close, .clear-all, .select-all, .delete-date-list, .goback").hide();
    renderTimes();
}
function app_in_time_init() {
    page_init();
    renderDateListModal();
}
$(function(){
    app_in_time_init();
});
