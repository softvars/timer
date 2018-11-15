var userCurrentDate = KEY_DATE_ENTRIES

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
function updateView(ins) {
    ins = ins || getEntries();
    var uc_state = getLastEntryState(ins)
    if(ins.length === 0) {
        $(".entries-header").hide();
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

function removeEntry(value) {
    var entry = null;
    if(value) {
        var ins = getEntries();
        entry = ins.find(function(a, i, arr) {
         var isFound = value === a.value;
         if (isFound) {
            ins.splice(i, 1);
            var nextEntry = ins[i];
            if(nextEntry && nextEntry.m){
                nextEntry.p = nextEntry.m = null;
                ins[i] = nextEntry;
            }
            storageHelper.set(userCurrentDate, ins);
         }
         return isFound;
        })
    }
    return entry;
}
var reRenderTotal_Conf = {
    interval : 1000,
    fn: { render: reRenderTotal }
};

function renderTimes(lbl, val) {
    var rows = [], _rows = [], _rows2 = [];
    var ins = createEntry(lbl, val);
    ins = sortObjectByDate(ins);
    var isEntries = ins && ins.length;
    var total = 0, ntotal =0, n2total=0;
    var settings =  getUserSettings();

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
            /* if(!(a.m)) { */
                if(prv){
                    var diff = getDiff(a, prv);
                    a.p = diff.p;
                    a.m = _diff = diff.m;
                    a.mi = _diffMi = diff.mi;
                    arr[i] = a;
                }
                //diff = checkTime(t.h - p.h) + ":" + checkTime(t.m - p.m) + ":" + checkTime(t.s - p.s);
            /* } */
            total += a.p;
            ntotal += (i && (a.key == ENTRY_OUT && ((prv && prv.key == ENTRY_IN) || (prv && prv.key == ENTRY_OUT))) ||
             (a.key == ENTRY_IN && (prv && prv.key == ENTRY_IN) )) ? a.p : 0;
            n2total += (i && (a.key == ENTRY_OUT && (prv && prv.key == ENTRY_IN))) ? a.p : 0;
            /* Time entry Row */
            rows.push('<tr class="'+CONTEXT[a.key]+'" data-entry-idx="'+i+'" data-entry-time="'+time+'"  data-entry-key="'+a.key+'" data-entry-value="'+a.value+'"><td class="text-align-right">'+time+'</td><td class="time-diff">'+ _diff +'<span class="time-diff-mi"> '+ _diffMi +'</span></td><td class="text-right"><span class="entryStateSingle">'+a.key+'</span><button type="button" data-i="'+i+'" class="btn-remove-entry btn btn-default btn-xs"> <span data-i="'+i+'" class="removeEntry glyphicon glyphicon-remove"></span></button></td></tr>');
        });
    }
    var entries_totals = storageHelper.get(KEY_ENTRIES_TOTALS);
    entries_totals = entries_totals || {}
    entries_totals[userCurrentDate] = {total: total, ntotal: ntotal, n2total: n2total}
    storageHelper.set(KEY_ENTRIES_TOTALS, entries_totals);


    var _total = getTimeFromTSDiff(total, true);
    var _ntotal = getTimeFromTSDiff(ntotal, true);
    var _n2total = getTimeFromTSDiff(n2total, true);
    //_rows2.push('<tr class="filo-total"><td><strong>Gross</strong></td><td class="time-diff"><strong>'+ _total.m +'</strong></td></tr>');
    _rows2.push('<tr class="filo-total"><td class="filo-total-gross"><strong>Gross</strong></td><td class="time-diff"><strong class="time-diff-gross">'+ _total.m +'</strong></td><td class="filo-total-actual"><strong>Actual</strong></td><td class="time-diff"><strong class="time-diff-actual">'+ _n2total.m +'</strong></td></tr>');
    _rows2.push('<tr class="actual-total"><td colspan="4" class="time-diff"><strong class="time-diff-total">'+ ( _ntotal.m )+'</strong></td></tr>');
    /* _rows.push('<tr class="entryHeader"><td></td><td class="entryHeaderMilli text-align-right"><span>hh:mm:ss milli</span></td><td><div class="clear-entries"><button type="button" class="btn btn-link btn-sm  btn-clear-entries"><span>Clear All</span></button></div></td></tr>'); */
    /* class="text-align-right"><span>IN / OUT</span> */
    storageHelper.set(userCurrentDate, ins);
    storageHelper.set(KEY_TOTAL_TIME, total);

    var htmlStrTotal = _rows2.join('');
    $('#tabletimeTotal').html(htmlStrTotal);
    var htmlStr = /* _rows.join('') +  */rows.join('');
    $('#tabletime').html(htmlStr);
    if(isEntries) {
        $('.entries-header').show();
        var isEdit = $("body").data("is-edit");
        if(isEdit) {
            $(".entries-header, button.btn-remove-entry").show();
        }
    }
    updateView(ins);
    setUserStateText(storageHelper.get(KEY_UC_STATE));
    toggleDateListEditIcon(true);
    $(".btn-clear-entries").off("click");
    $(".btn-clear-entries").on("click", function() {
        storageHelper.unset(userCurrentDate);
        renderTimes();
        $(".clear-entries").hide();
    });

    var tableTimeDiv = document.getElementById('tableTimeDiv');
    var tableTime = document.getElementById('tabletime');
    tableTimeDiv.scrollTop = tableTime.offsetHeight;

   /*  reRenderTotal_Conf = startTimer({
        interval : 1000,
        fn: { render: reRenderTotal }
    }); */

    if (settings.inTimeAutoRunner === undefined) {
        settings.inTimeAutoRunner = true;
        setUserSettings(settings)
    }
    updateTotalTimer(settings.inTimeAutoRunner);
}

function updateTotalTimer(inTimeAutoRunner){
    var isToday = userCurrentDate === KEY_DATE_ENTRIES;
    var ins = getEntries();
    var lastEntry = ins[ins.length-1] ;
    if(isToday && inTimeAutoRunner && lastEntry && lastEntry.key === ENTRY_IN) {
        reRenderTotal_Conf = startTimer(reRenderTotal_Conf);
    } else {
        if(reRenderTotal_Conf && reRenderTotal_Conf.anch) {
            reRenderTotal_Conf = stopTimer(reRenderTotal_Conf);
        }
    }
}

function reRenderTotalHelper(ins, et, lastDiff) {
    var totalMap = null;
    var total = et.total
    var ntotal = et.ntotal
    var n2total = et.n2total
    if (lastDiff) {
        total += lastDiff && lastDiff.p || 0;
        n2total += lastDiff && lastDiff.p || 0;
        ntotal += lastDiff && lastDiff.p || 0;
    }
    totalMap = {
        gross:  getTimeFromTSDiff(total, true),
        total:  getTimeFromTSDiff(ntotal, true),
        actual: getTimeFromTSDiff(n2total, true)
    }
    return totalMap;
}
function reRenderTotal() {
    var ins = getEntries();
    var entries_totals = storageHelper.get(KEY_ENTRIES_TOTALS);
    var et =  entries_totals && entries_totals[userCurrentDate];
    if (et) {
        var lastEntry = ins[ins.length-1] ;
        var lastDiff = getDiff({value: Date.now()}, lastEntry);
        var totalMap = reRenderTotalHelper(ins, et, lastDiff);
        if (totalMap) {
            $(".time-diff-gross").html(totalMap.gross.m);
            $(".time-diff-actual").html(totalMap.actual.m);
            $(".time-diff-total").html(totalMap.total.m);
        }
    }
}

//var reRenderTotal_TimerAnch = setInterval(reRenderTotal, 1000);

var renderTime = getRenderTime({
    elm_id: "intimer",
    separator: ":",
    type: 12,
    noDate: true,
    noMilli: true
});

var renderTime_Conf = startTimer({
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
    renderTimes(ENTRY_IN, Date.now() /* (new Date()).getTime() */);
}

function doOut(){
    renderTimes(ENTRY_OUT, Date.now() /* (new Date()).getTime() */);
}

$('div.status-info-bar').off("click");
$('div.status-info-bar').on("click", "span.repeat-icon",function(e) {
    renderTimes();
});

$('table#tabletime').off("click");
$('table#tabletime').on("click", "button.btn-remove-entry",function(e) {
    //var i = $(this).data("i");
    //console.log(i);
    var rowElement = $(e.currentTarget).parents('tr');
    var value = rowElement && rowElement.data('entry-value');
    if(value) {
        removeEntry(value);
        renderTimes();
    }
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

/* CW */
$('table#tabletime').on("click", "td.text-align-right, td.time-diff, .entryStateSingle", function(e) {
    /* TODO */
    var targetElem = $(e.target);
    var curTargetElem = $(e.currentTarget);
    var rowElement = $(e.currentTarget).parents('tr')
    var entryModalData = {};
    if(rowElement) {
        entryModalData.entryValue = rowElement.data('entry-value');
        entryModalData.entryTime = rowElement.data('entry-time');
        entryModalData.entryKey = rowElement.data('entry-key');
        entryModalData.entryIdx = rowElement.data('entry-idx');
        console.log('entryModalData: ' + entryModalData)
    }
    $('#newDateEntryModal').data('EntryModalData', entryModalData);
    $('#newDateEntryModal').modal('show');
});

$('#newDateEntryModal').on('show.bs.modal', function (event) {
    $('#addNewTime').val('');
    $('#addNewTimeState').val('IN');
});

$('#newDateEntryModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var operation = button.data('entry-op');
    var isAddNewEntry = operation === "add";
    var modal = $(this);
    modal.data('isAddNewEntry', isAddNewEntry);
    if (!isAddNewEntry) {
        var entryModalData = modal.data('EntryModalData');
        $('#addNewTime').val(entryModalData.entryTime); /* "hh:mm:ss" */
        $('#addNewTimeState').val(entryModalData.entryKey); /**/
    }
});

$('#newDateEntryModal').off("click");
$('#newDateEntryModal').on("click", "button.submit", function(e, data) {
    //var $this = $(this);
    var modal = $('#newDateEntryModal');
    var isAddNewEntry = modal.data('isAddNewEntry');
    var entryModalData = modal.data('EntryModalData');
    console.log('isAddNewEntry: ' + isAddNewEntry)
    var addNewTime = $('#addNewTime').val(); /* "hh:mm:ss" */
    var addNewTimeState = $('#addNewTimeState').val(); /**/
    if(addNewTime) {
        var currDate = null;
        var ins = getEntries();
        if (ins.length > 0) {
            if (!isAddNewEntry && entryModalData && (addNewTime !== entryModalData.entryTime)) {
                var value = entryModalData.entryValue;
                removeEntry(value);
            }
            var lastEntry = ins[ins.length-1] ;
            currDate = lastEntry && lastEntry.value
        }
        currDate = currDate && new Date(currDate) || new Date(); // todo: date with current date
        currDate.setMilliseconds(0);
        var timeDiff = addNewTime.split(':')
        if (timeDiff.length > 1) {
            timeDiff[0] = parseInt(timeDiff[0])
            timeDiff[1] = parseInt(timeDiff[1])
            timeDiff[2] = parseInt(timeDiff[2])

            currDate.setHours(timeDiff[0] || 0);
            currDate.setMinutes(timeDiff[1] || 0);
            currDate.setSeconds(timeDiff[2] || 0);
        }
        var ins = createEntry(addNewTimeState, currDate.getTime());
        ins = sortObjectByDate(ins);
        storageHelper.set(userCurrentDate, ins);
        renderTimes();
        $('#addNewTime').val('');
        $('#addNewTimeState').val('IN');
        console.log(`${addNewTime}:${addNewTimeState}`);
    }
    $('#newDateEntryModal').modal('hide');
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
    showAlert({
        msg: 'Importing data is completed.'
    });
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

$('.entries-edit-wrapper').off("click");
$('.entries-edit-wrapper').on("click", ".edit.enabled", function(e) {
    var ins = getEntries();
    var isEntries = ins && ins.length;
    if(isEntries) {
        $('.menu .homeview, .toolbar.edit, .toolbar.add, .option-swip-wrapper').hide();
        $("body").addClass("is-edit").data("is-edit", true);
        storageHelper.set(KEY_ENTRIES_UNDO, ins);
        $(".confirm-edit, button.btn-remove-entry").show();
        $(".clear-entries").show();
        //$(this).addClass('active');
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
    $('.toolbar.edit, .toolbar.add, .option-swip-wrapper').show();
    $(".clear-entries, .confirm-edit, button.btn-remove-entry").hide();
    $("body").removeClass("is-edit").data("is-edit", false);
    $('.toolbar.edit').removeClass('active');
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
    $(".mainContent, .option-swip-wrapper").toggle();
    $(".data-list-wrapper").toggle();
    setDateListCheckBox(false);
    $('.homeview').hide();
    $('.main-container-wrapper').removeClass('bg2');
    $('span.user-state').removeClass('nocolor');
    $('.toolbar.edit,.toolbar.add, .toolbar.dateList, .toolbar.goback, .toolbar.edit-list, .toolbar.dropdown-toggle').toggle();
    //toggleDateListEditIcon();
}
function toggleHomeView(){
    var isToday = userCurrentDate === KEY_DATE_ENTRIES;
    $('body').toggleClass('not-today', !isToday);
    $('.homeview').css('display', isToday ? 'none' : 'block');
    $('.option-swip, .setting-mode').css('display', isToday ? 'block' : 'none');
    $('.main-container-wrapper').toggleClass('bg2', !isToday);
    $('.main-container-wrapper').toggleClass('bg2', !isToday);
    $('span.user-state').toggleClass('nocolor', !isToday);
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
            $(".toolbar.edit, .toolbar.add, .toolbar.edit-list, .tools button.dateList, .entryHeader").hide();
        } else {
            $(".tools button.dateList, .entryHeader").show();
            !isHome && $(".toolbar.edit-list").show();
            isHome && $(".toolbar.edit, .toolbar.add").show();
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

$('.inTimeAutoRunBtn').off('click');
$('.inTimeAutoRunBtn').on('click', function(e){
    var inTimeAutoRun = false;
    try {
        inTimeAutoRun = $(e.target).find('input[name=inTimeAutoRun]').val() === 'yes';
    } catch {}
    console.log('inTimeAutoRun: ' + inTimeAutoRun);
    setUserSettings({inTimeAutoRunner: inTimeAutoRun})
    updateTotalTimer(inTimeAutoRun);
});

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

function setCurrentDate(elm) {
    if (elm) {
        userCurrentDate = $(elm).data('date-key');
        storageHelper.set(KEY_UC_DATE, userCurrentDate);
        $('.data-list-wrapper .date-list').not(elm).removeClass('active');
        $(elm).addClass('active');
        page_init();
    }
}

function getDateInTimeTotal(entries_totals, dateKey) {
    var ins = storageHelper.get(dateKey);
    var time = '';
    if (entries_totals) {
        var et =  entries_totals[dateKey];
        if (et) {
            var totalMap = reRenderTotalHelper(ins, et);
            var m = totalMap && totalMap.total && totalMap.total.m;
            if (m && m !== '0:0:0') {
                time = totalMap.total.m;
            }
        }
    }
    return time;
}

function renderDateListModal() {
    var html = ''
    var entries_totals = storageHelper.get(KEY_ENTRIES_TOTALS);
    getDateKeys(function(o){
        var dateInTimeTotal = getDateInTimeTotal(entries_totals, o.key) || '';
        var l = o.label
        l = l && l.substr(0, 4) + '-' + l.substr(4, 2) + '-' + l.substr(6, 2)
        html += '<li role="presentation" class="date-list'+ ((o.key === userCurrentDate) && ' active' || '') +'" data-date-key="'+o.key+'"><a href="#">'+l+'<span class="dateListInTime">'+dateInTimeTotal+'</span><span class="checkbox-wrapper"><input class="delete-date" type="checkbox" id="inlineCheckbox1"></span></a></li>'
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
        $('span.user-state').removeClass('in out').addClass(state.toLowerCase());
        $('span.user-state').get(0).innerText = state;
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
    //renderDateListModal();

    var settings =  getUserSettings();
    $('.inTimeAutoRunYes').toggleClass('active', settings.inTimeAutoRunner);
    $('.inTimeAutoRunNo').toggleClass('active', !settings.inTimeAutoRunner);
}

function app_in_time_init() {
    page_init();
    renderDateListModal();
}
$(function(){
    app_in_time_init();
});
