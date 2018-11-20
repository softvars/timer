var CONSTANTS={COLON:":",_24:24,_12:12},_c=CONSTANTS,ENTRY_IN="IN",ENTRY_OUT="OUT",MODE_PAIR="PAIR",MODE_FLEX="FLEX",ENTRY_PAIR={};ENTRY_PAIR[ENTRY_IN]=ENTRY_OUT,ENTRY_PAIR[ENTRY_OUT]=ENTRY_IN;var CONTEXT={};CONTEXT[ENTRY_IN]="inTimeRow",CONTEXT[ENTRY_OUT]="outTimeRow";var KEY_ENTRIES="entries",KEY_ENTRIES_UNDO="entries_undo",KEY_TOTAL_TIME="entriesTimeTotal",KEY_USER_SETTINGS="User_Settings",KEY_UC_STATE="User_Curr_State",KEY_UC_DATE="User_Curr_Date",KEY_UC_SETTINGS_MODE="User_Curr_Swip_Mode",KEY_DAY_ENTRIES="_TimeEntries",KEY_ENTRIES_TOTALS="entries_totals",TYPE_STRING="string",StorageHelper=function(){};StorageHelper.prototype.myStorage=localStorage,StorageHelper.prototype.get=function(e,t){var a=this.myStorage.getItem(e)||t;try{typeof a===TYPE_STRING&&(a=JSON.parse(a))}catch(e){}return a},StorageHelper.prototype.set=function(e,t){return typeof e===TYPE_STRING&&(t=typeof t!=TYPE_STRING?JSON.stringify(t):t,this.myStorage.setItem(e,t)),t},StorageHelper.prototype.unset=function(e){typeof e===TYPE_STRING&&this.myStorage.removeItem(e)},StorageHelper.prototype.each=function(e){if("function"==typeof e)for(var t=this.myStorage.length,a=0;a<t;a++){e(this.myStorage.key(a))}},StorageHelper.prototype.getLength=function(){return this.myStorage.length};var storageHelper=new StorageHelper,_createClass=function(){function r(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,t,a){return t&&r(e.prototype,t),a&&r(e,a),e}}();function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var JSONReader=function(){function t(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null;_classCallCheck(this,t),this.onCompleted=e,this.result=void 0,this.input=document.createElement("input"),this.input.type="file",this.input.accept="text/json|application/json",this.input.addEventListener("change",this.onChange.bind(this),!1),this.input.style.display="none",document.body.appendChild(this.input),this.input.click()}return _createClass(t,[{key:"destroy",value:function(){this.input.removeEventListener("change",this.onChange.bind(this),!1),document.body.removeChild(this.input)}},{key:"onChange",value:function(e){0<e.target.files.length&&this.readJSON(e.target.files[0])}},{key:"readJSON",value:function(e){var t=this,a=new FileReader;a.onload=function(e){2===e.target.readyState&&(t.result=JSON.parse(a.result),"function"==typeof t.onCompleted&&t.onCompleted(t.result),t.destroy())},a.readAsText(e)}}],[{key:"read",value:function(){return new t(0<arguments.length&&void 0!==arguments[0]?arguments[0]:null)}}]),t}(),myMap=function(e,t,a){this.key=e,this.value=t,this.idx=a};myMap.prototype.key=null,myMap.prototype.value=null,myMap.prototype.idx=null;var mySettings=function(e){this.inTimeAutoRunner=e};function extend(e,t){for(var a in t)t.hasOwnProperty(a)&&(e[a]=t[a]);return e}function getUserSettings(){return storageHelper.get(KEY_USER_SETTINGS,{})}function setUserSettings(e){var t=getUserSettings();return t=extend(t,e),storageHelper.set(KEY_USER_SETTINGS,t)}mySettings.prototype.inTimeAutoRunner=null;var KEY_DATE_ENTRIES=function(){var e=getDate();return""+e.y+e.m+e.d+KEY_DAY_ENTRIES}();function getDate(e){var t=e&&e.getDate&&e||new Date,a={};return a.d=t.getDate(),a.m=t.getMonth()+1,a.y=t.getYear()+1900,a.d=checkTime(a.d),a.m=checkTime(a.m),a.now=t,a}function getTime(e){var t=e?new Date(e):new Date,a={};a.h=t.getHours(),a.m=t.getMinutes(),a.s=t.getSeconds();var r=t.getMilliseconds();return a.mi=944<r?0:Math.round(r/100),a.m=checkTime(a.m),a.s=checkTime(a.s),a.mi=checkTime(a.mi),a}function checkTime(e){return e<10&&0<=e&&(e="0"+e),e}function checkDiffTime(e,t,a){return a||0!==e?e<10&&0<=e?e=e&&(t?"00":"0")+e:t&&e<100&&10<=e&&(e=e&&"0"+e):e=" . ",e}function getTimeFromTSDiff(e,t){var a={};a.p=e;var r={mi:0,m:0,s:0,h:0};return r.mi=e<1e3?e:e%1e3,999<e&&(r.s=e/1e3,60<r.s&&(r.m=r.s/60,r.s=r.s%60,60<r.m&&(r.h=r.m/60,r.m=r.m%60,24<r.h)))?a.m="Err: Hour is > 24":(a.m=checkDiffTime(Math.floor(r.h),!1,t)+":"+checkDiffTime(Math.floor(r.m),!1,t)+":"+checkDiffTime(Math.floor(r.s),!1,t),a.mi=checkDiffTime(Math.floor(r.mi),!0)),a}function getDiff(e,t){return e.value&&t.value&&e.value>=t.value?getTimeFromTSDiff(e.value-t.value):null}function getRenderTime(o){var i=o&&o.separator,s=12===o.type||24===o.type?o.type:12;return{render:function(e){if(o&&o.elm_id){var t=document.getElementById(o.elm_id);if(t){var a="";if(!o.noDate)a=(e=getDate(e)).d+i+e.m+i+e.y;if(!o.noTime){var r=getTime(e),n=r.h%s;o.type&&(n=0===n&&o.type||n),a+=o.noDate?"":"  ",a+=n+i+r.m+i+r.s+(o.noMilli?"":i+r.mi)}t.innerHTML=a}}}}}function startTimer(e){return e.anch=e.anch||[],e.anch.push(setInterval(e.fn.render,e.interval)),console.log("startTimer::"+e.anch),e}function stopTimer(e){return e&&e.anch&&(e.anch.forEach(function(e){console.log("stopTimer::"+e),clearInterval(e)}),e.anch=[]),e}function getDateFormted(e,t){var a=getTime((e=getDate(e)).now);return""+e.y+e.m+e.d+(t?"":"_"+checkTime(a.h)+a.m+a.s)}function showAlert(e){var t=e.msg;if(t){var a=e.type,r=e.duration,n=$("div#inTimeAppAlert");n.removeClass("alert-success alert-info  alert-warning  alert-danger"),a&&n.addClass("alert-"+a),n.show(),n.find("span.alertMessage").html(t),setTimeout(function(){n.hide()},r||3500)}}function dataToFileSave(e,t){try{var a=!!new Blob}catch(e){}if(a&&e){var r="APP.IN_TIME.DATA."+(t||"")+getDateFormted(new Date)+".json",n=new Blob([JSON.stringify(e)],{type:"text/plain;charset=utf-8"});saveAs(n,r),showAlert({msg:'Data exported and saved as "'+r+'"'})}}function exportAppData(e){var t={};storageHelper.each(function(e){t[e]=storageHelper.get(e)}),dataToFileSave(t,e)}function dateCompareAsc(e,t){return dateFns.compareAsc(new Date(e.value),new Date(t.value))}function sortObjectByDate(e){return e&&dateFns&&(e=e.sort(dateCompareAsc)),e}var userCurrentDate=KEY_DATE_ENTRIES;function getEntries(){return storageHelper.get(userCurrentDate,[])}function createEntry(e,t){var a=getEntries();return e&&(a.push(new myMap(e,t,a.length)),storageHelper.set(userCurrentDate,a)),a}function getLastEntryState(e){e=e||getEntries();var t=ENTRY_OUT;if(0<e.length){var a=e[e.length-1];t=a&&a.key}return t}function updateView(e){var t=getLastEntryState(e=e||getEntries());0===e.length&&$(".entries-header").hide(),storageHelper.set(KEY_UC_STATE,t),toggleStrictButton($(".option-strict button"),!0)}function insertEntry(e){var t=getEntries(),a=e&&e.idx;return 0<=a&&a<=t.length&&(e&&e.m&&(e.p=e.m=null),t.splice(a,0,e),storageHelper.set(userCurrentDate,t)),t}function removeEntry(o){var e=null;if(o){var i=getEntries();e=i.find(function(e,t,a){var r=o===e.value;if(r){i.splice(t,1);var n=i[t];n&&n.m&&(n.p=n.m=null,i[t]=n),storageHelper.set(userCurrentDate,i)}return r})}return e}var reRenderTotal_Conf={interval:1e3,fn:{render:reRenderTotal}};function renderTimes(e,t){var d=[],a=[],r=createEntry(e,t),n=(r=sortObjectByDate(r))&&r.length,c=0,u=0,p=0,o=getUserSettings();n&&r.forEach(function(e,t,a){if(e&&e.value){var r=getTime(e.value),n=r.h+":"+r.m+":"+r.s;e.p=e.p||0;var o=e.m||"00",i=a[t-1],s=e.mi||"000";if(i){var l=getDiff(e,i);e.p=l.p,e.m=o=l.m,e.mi=s=l.mi,a[t]=e}c+=e.p,u+=t&&e.key===ENTRY_OUT&&(i&&i.key===ENTRY_IN||i&&i.key===ENTRY_OUT)||e.key===ENTRY_IN&&i&&i.key===ENTRY_IN?e.p:0,p+=t&&e.key===ENTRY_OUT&&i&&i.key===ENTRY_IN?e.p:0,d.push('<tr class="'+CONTEXT[e.key]+'" data-entry-idx="'+t+'" data-entry-time="'+n+'"  data-entry-key="'+e.key+'" data-entry-value="'+e.value+'"><td class="text-align-right">'+n+'</td><td class="time-diff">'+o+'<span class="time-diff-mi"> '+s+'</span></td><td class="text-right"><span class="entryStateSingle">'+e.key+'</span><button type="button" data-i="'+t+'" class="btn-remove-entry btn btn-default btn-xs"> <span data-i="'+t+'" class="removeEntry glyphicon glyphicon-remove"></span></button></td></tr>')}});var i=storageHelper.get(KEY_ENTRIES_TOTALS);(i=i||{})[userCurrentDate]={total:c,ntotal:u,n2total:p},storageHelper.set(KEY_ENTRIES_TOTALS,i);var s=getTimeFromTSDiff(c,!0),l=getTimeFromTSDiff(u,!0),g=getTimeFromTSDiff(p,!0);a.push('<tr class="filo-total"><td class="filo-total-gross"><strong>Gross</strong></td><td class="time-diff"><strong class="time-diff-gross">'+s.m+'</strong></td><td class="filo-total-actual"><strong>Actual</strong></td><td class="time-diff"><strong class="time-diff-actual">'+g.m+"</strong></td></tr>"),a.push('<tr class="actual-total"><td colspan="4" class="time-diff"><strong class="time-diff-total">'+l.m+"</strong></td></tr>"),storageHelper.set(userCurrentDate,r),storageHelper.set(KEY_TOTAL_TIME,c);var m=a.join("");$("#tabletimeTotal").html(m);var f=d.join("");($("#tabletime").html(f),n)&&($(".entries-header").show(),$("body").data("is-edit")&&$(".entries-header, button.btn-remove-entry").show());updateView(r),setUserStateText(storageHelper.get(KEY_UC_STATE)),toggleDateListEditIcon(!0),$(".btn-clear-entries").off("click"),$(".btn-clear-entries").on("click",function(){storageHelper.unset(userCurrentDate),renderTimes(),$(".clear-entries").hide()});var T=document.getElementById("tableTimeDiv"),E=document.getElementById("tabletime");T.scrollTop=E.offsetHeight,void 0===o.inTimeAutoRunner&&(o.inTimeAutoRunner=!0,setUserSettings(o)),updateTotalTimer(o.inTimeAutoRunner)}function updateTotalTimer(e){var t=userCurrentDate===KEY_DATE_ENTRIES,a=getEntries(),r=a[a.length-1];t&&e&&r&&r.key===ENTRY_IN?reRenderTotal_Conf=startTimer(reRenderTotal_Conf):reRenderTotal_Conf&&reRenderTotal_Conf.anch&&(reRenderTotal_Conf=stopTimer(reRenderTotal_Conf))}function reRenderTotalHelper(e,t,a){var r=t.total,n=t.ntotal,o=t.n2total;return a&&(r+=a&&a.p||0,o+=a&&a.p||0,n+=a&&a.p||0),{gross:getTimeFromTSDiff(r,!0),total:getTimeFromTSDiff(n,!0),actual:getTimeFromTSDiff(o,!0)}}function reRenderTotal(){var e=getEntries(),t=storageHelper.get(KEY_ENTRIES_TOTALS),a=t&&t[userCurrentDate];if(a){var r=e[e.length-1],n=reRenderTotalHelper(e,a,getDiff({value:Date.now()},r));n&&($(".time-diff-gross").html(n.gross.m),$(".time-diff-actual").html(n.actual.m),$(".time-diff-total").html(n.total.m))}}var renderTime=getRenderTime({elm_id:"intimer",separator:":",type:12,noDate:!0,noMilli:!0}),renderTime_Conf=startTimer({interval:1e3,fn:renderTime}),renderTodayDate=getRenderTime({elm_id:"intimerDate",separator:":",noTime:!0,type:12});renderTodayDate.render();var renderDate=getRenderTime({elm_id:"entryDate",separator:":",noTime:!0,type:12});function doIn(){renderTimes(ENTRY_IN,Date.now())}function doOut(){renderTimes(ENTRY_OUT,Date.now())}function confirmOverWrite(e){$("#myDataImportModal").data("callback",e),$("#myDataImportModal").modal("show")}function updateAppWithData_(e,t){for(var a in e){var r=a.endsWith(KEY_DAY_ENTRIES);r&&0;var n=void 0!==storageHelper.get(a);r&&n?(0,t&&storageHelper.set(a,e[a])):storageHelper.set(a,e[a])}showAlert({msg:"Importing data is completed."}),app_in_time_init()}function updateAppWithData(t){var e=!1,a=0,r=null;for(var n in t){if(a++,e=n.endsWith(KEY_DAY_ENTRIES)&&void 0!==storageHelper.get(n)){confirmOverWrite(function(e){updateAppWithData_(t,r=e)});break}}e||a!==Object.keys(t).length||updateAppWithData_(t,r)}function dateSelectedForDelete(e,t){for(var a in deleteDateKeyArray)if(deleteDateKeyArray[a]&&("function"==typeof e&&e(a),t))return a;return!1}function toggleMenu(){$(".mainContent, .option-swip-wrapper").toggle(),$(".data-list-wrapper").toggle(),setDateListCheckBox(!1),$(".homeview").hide(),$(".main-container-wrapper").removeClass("bg2"),$("span.user-state").removeClass("nocolor"),$(".toolbar.edit,.toolbar.add, .toolbar.dateList, .toolbar.goback, .toolbar.edit-list, .toolbar.dropdown-toggle").toggle()}function toggleHomeView(){var e=userCurrentDate===KEY_DATE_ENTRIES;$("body").toggleClass("not-today",!e),$(".homeview").css("display",e?"none":"block"),$(".option-swip, .setting-mode").css("display",e?"block":"none"),$(".main-container-wrapper").toggleClass("bg2",!e),$(".main-container-wrapper").toggleClass("bg2",!e),$("span.user-state").toggleClass("nocolor",!e),toggleDateListEditIcon(!0),storageHelper.get(KEY_UC_SETTINGS_MODE)===MODE_FLEX?($(".option-strict").hide(),$(".setting-mode .flex").addClass("active"),$(".setting-mode .strict").removeClass("active")):($(".option-flex").hide(),$(".setting-mode .strict").addClass("active"),$(".setting-mode .flex").removeClass("active"))}function isAppDateListEmpty(){return 6===storageHelper.getLength()&&storageHelper.get(KEY_DATE_ENTRIES)}function toggleDateListEditIcon(e){var t=isAppDateListEmpty();t&&(0===t.length?$(".toolbar.edit, .toolbar.add, .toolbar.edit-list, .tools button.dateList, .entryHeader").hide():($(".tools button.dateList, .entryHeader").show(),!e&&$(".toolbar.edit-list").show(),e&&$(".toolbar.edit, .toolbar.add").show()),renderDateListModal())}function toggleDateListEdit(e){$(".toolbar.edit-list, .toolbar.clear-all, .toolbar.select-all").toggle(),e?$(".checkbox-wrapper").hide():$(".checkbox-wrapper").toggle(),updateDeleteIcon()}$("div.status-info-bar").off("click"),$("div.status-info-bar").on("click","span.repeat-icon",function(e){renderTimes()}),$("table#tabletime").off("click"),$("table#tabletime").on("click","button.btn-remove-entry",function(e){var t=$(e.currentTarget).parents("tr"),a=t&&t.data("entry-value");a&&(removeEntry(a),renderTimes())}),$(".settings-menu.enabled").off("click"),$(".settings-menu.enabled").on("click",".toolbar.strict",function(e){userCurrentDate===KEY_DATE_ENTRIES&&($(".option-strict").show(),$(".option-flex").hide(),toggleStrictButton($(".option-strict button"),!0),$(".setting-mode .strict, .setting-mode .flex").toggleClass("active"),storageHelper.set(KEY_UC_SETTINGS_MODE,MODE_PAIR))}),$(".settings-menu.enabled").on("click",".toolbar.flex",function(e){userCurrentDate===KEY_DATE_ENTRIES&&($(".option-strict").hide(),$(".option-flex").show(),$(".setting-mode .strict, .setting-mode .flex").toggleClass("active"),storageHelper.set(KEY_UC_SETTINGS_MODE,MODE_FLEX))}),$(".option-strict").off("click"),$(".option-strict").on("click","button.enabled",function(e){toggleStrictButton($(this),!1)===ENTRY_OUT?doIn():doOut()}),$(".option-flex").off("click"),$(".option-flex").on("click","button.enabled",function(e){var t=$(this),a=t.hasClass("swip-in"),r=t.hasClass("swip-out");a?doIn():r&&doOut()}),$("#myDataImportModal").off("click"),$("#myDataImportModal").on("click","button.submit, button.cancel",function(e){var t=$(this);$("#myDataImportModal").data("callback")(t.hasClass("submit")),$("#myDataImportModal").modal("hide")}),$("table#tabletime").on("click","td.text-align-right, td.time-diff, .entryStateSingle",function(e){$(e.target),$(e.currentTarget);var t=$(e.currentTarget).parents("tr"),a={};t&&(a.entryValue=t.data("entry-value"),a.entryTime=t.data("entry-time"),a.entryKey=t.data("entry-key"),a.entryIdx=t.data("entry-idx"),console.log("entryModalData: "+a)),$("#newDateEntryModal").data("EntryModalData",a),$("#newDateEntryModal").modal("show")}),$("#newDateEntryModal").on("show.bs.modal",function(e){$("#addNewTime").val(""),$("#addNewTimeState").val("IN")}),$("#newDateEntryModal").on("show.bs.modal",function(e){var t="add"===$(e.relatedTarget).data("entry-op"),a=$(this);if(a.data("isAddNewEntry",t),!t){var r=a.data("EntryModalData");$("#addNewTime").val(r.entryTime),$("#addNewTimeState").val(r.entryKey)}}),$("#newDateEntryModal").off("click"),$("#newDateEntryModal").on("click","button.submit",function(e,t){var a=$("#newDateEntryModal"),r=a.data("isAddNewEntry"),n=a.data("EntryModalData");console.log("isAddNewEntry: "+r);var o=$("#addNewTime").val(),i=$("#addNewTimeState").val();if(o){var s=null;if(0<(d=getEntries()).length){if(!r&&n&&o!==n.entryTime)removeEntry(n.entryValue);var l=d[d.length-1];s=l&&l.value}(s=s&&new Date(s)||new Date).setMilliseconds(0);var d,c=o.split(":");1<c.length&&(c[0]=parseInt(c[0]),c[1]=parseInt(c[1]),c[2]=parseInt(c[2]),s.setHours(c[0]||0),s.setMinutes(c[1]||0),s.setSeconds(c[2]||0)),d=sortObjectByDate(d=createEntry(i,s.getTime())),storageHelper.set(userCurrentDate,d),renderTimes(),$("#addNewTime").val(""),$("#addNewTimeState").val("IN")}$("#newDateEntryModal").modal("hide")}),$(".setting-app-data").off("click"),$(".setting-app-data").on("click",".toolbar.app-data-export",function(e){exportAppData()}),$(".setting-app-data").on("click",".toolbar.app-data-import",function(e){JSONReader.read(function(e){console.log(e),updateAppWithData(e)})}),$(".entries-edit-wrapper").off("click"),$(".entries-edit-wrapper").on("click",".edit.enabled",function(e){var t=getEntries();t&&t.length&&($(".menu .homeview, .toolbar.edit, .toolbar.add, .option-swip-wrapper").hide(),$("body").addClass("is-edit").data("is-edit",!0),storageHelper.set(KEY_ENTRIES_UNDO,t),$(".confirm-edit, button.btn-remove-entry").show(),$(".clear-entries").show(),$(".option-swip button").addClass("disabled"),$(".option-swip button").removeClass("enabled"),$(".last-row").addClass("edit-start"),$(".tools .toolbar").addClass("disabled"),$(".tools .toolbar").removeClass("enabled"))}),$(".confirm-edit").off("click"),$(".confirm-edit").on("click","button",function(){if($this=$(this),$this.hasClass("btn-done-edit"))storageHelper.set(KEY_ENTRIES_UNDO,[]);else if($this.hasClass("btn-cancel-edit")){var e=storageHelper.get(KEY_ENTRIES_UNDO,[]);storageHelper.set(userCurrentDate,e),renderTimes()}$(".toolbar.edit, .toolbar.add, .option-swip-wrapper").show(),$(".clear-entries, .confirm-edit, button.btn-remove-entry").hide(),$("body").removeClass("is-edit").data("is-edit",!1),$(".toolbar.edit").removeClass("active"),$(".option-swip button").removeClass("disabled"),$(".option-swip button").addClass("enabled"),$(".tools .toolbar").addClass("enabled"),$(".tools .toolbar").removeClass("disabled"),$(".last-row").removeClass("edit-start"),toggleHomeView()}),$("#myDateListModal").off("click"),$("#myDateListModal").on("click","button.submit",function(e){$("#goback").addClass("goback").removeClass("edit-close");var t=!1;dateSelectedForDelete(function(e){storageHelper.unset(e),console.log(e),t=!0,e===userCurrentDate&&(userCurrentDate=KEY_DATE_ENTRIES)}),t&&(updateDateView(),renderTimes()),toggleDateListEdit(!0),$("#myDateListModal").modal("hide")}),$(".tools").off("click"),$(".tools").on("click","button.dateList.enabled",function(e){toggleMenu()}),$(".menu").on("click","button.goback.enabled",function(e){toggleMenu(),$(".toolbar.edit-list, .toolbar.clear-all, .toolbar.select-all, .toolbar.delete-date-list, .checkbox-wrapper").hide(),toggleHomeView()}),$(".menu").on("click","button.homeview.enabled",function(e){setCurrentDate($(".data-list-wrapper ul").find('li[data-date-key="'+KEY_DATE_ENTRIES+'"]').get(0))}),$(".tools").on("click","button.edit-list.enabled",function(e){toggleDateListEdit(),$("#goback").removeClass("goback").addClass("edit-close")});var deleteDateKeyArray={};function setDateListCheckBox(t){var e=$(".data-list-wrapper .date-list .delete-date");deleteDateKeyArray={},t&&getDateKeys(function(e){deleteDateKeyArray[e.key]=t});for(var a=0;a<e.length;a++)$(e[a]).prop("checked",t);updateDeleteIcon()}function updateDeleteIcon(){var e=dateSelectedForDelete(null,!0);$(".toolbar.delete-date-list").css("display",e?"block":"none")}function setCurrentDate(e){e&&(userCurrentDate=$(e).data("date-key"),storageHelper.set(KEY_UC_DATE,userCurrentDate),$(".data-list-wrapper .date-list").not(e).removeClass("active"),$(e).addClass("active"),page_init())}function getDateInTimeTotal(e,t){var a=storageHelper.get(t),r="";if(e){var n=e[t];if(n){var o=reRenderTotalHelper(a,n),i=o&&o.total&&o.total.m;i&&"0:0:0"!==i&&(r=o.total.m)}}return r}function renderDateListModal(){var r="",n=storageHelper.get(KEY_ENTRIES_TOTALS);getDateKeys(function(e){var t=getDateInTimeTotal(n,e.key)||"",a=e.label;a=a&&a.substr(0,4)+"-"+a.substr(4,2)+"-"+a.substr(6,2),r+='<li role="presentation" class="date-list'+(e.key===userCurrentDate?" active":"")+'" data-date-key="'+e.key+'"><a href="#">'+a+'<span class="dateListInTime">'+t+'</span><span class="checkbox-wrapper"><input class="delete-date" type="checkbox" id="inlineCheckbox1"></span></a></li>'}),$(".data-list-wrapper .date-list-group").html(r),$(".checkbox-wrapper").hide(),deleteDateKeyArray={}}$(".menu").on("click","button.edit-close.enabled",function(e){setDateListCheckBox(!1),toggleDateListEdit(!0),$("#goback").addClass("goback").removeClass("edit-close")}),$(".tools").on("click","button.clear-all.enabled",function(e){setDateListCheckBox(!1)}),$(".tools").on("click","button.select-all.enabled",function(e){setDateListCheckBox(!0)}),$(".inTimeAutoRunBtn").off("click"),$(".inTimeAutoRunBtn").on("click",function(e){var t=!1;try{t="yes"===$(e.target).find("input[name=inTimeAutoRun]").val()}catch(e){}console.log("inTimeAutoRun: "+t),setUserSettings({inTimeAutoRunner:t}),updateTotalTimer(t)}),$(".data-list-wrapper").off("click"),$(".data-list-wrapper").on("click",".date-list",function(e){var t="block"===$(".toolbar.edit-close").css("display"),a=$(e.target),r=$(e.currentTarget),n=a.hasClass("delete-date");if(t||n){var o=r&&r.data("date-key");n||((a=r.find(".delete-date"))[0].checked=!a[0].checked),o&&(deleteDateKeyArray[o]=a[0].checked),updateDeleteIcon()}else t||($(".tools button.dateList.enabled").trigger("click"),setCurrentDate(this))}),$(".data-list-wrapper").hide();var getDateFromKeys=function(e){return e&&e.endsWith(KEY_DAY_ENTRIES)&&e.split("_")[0]||""};function getDateKeys(a){"function"==typeof a&&storageHelper.each(function(e){var t=getDateFromKeys(e);t&&a({key:e,label:t})})}function updateDateView(){storageHelper.get(userCurrentDate)||storageHelper.set(userCurrentDate,[]);var e=getDateFromKeys(userCurrentDate);if(e){var t=e.substring(4,0)+"/"+e.substring(6,4)+"/"+e.substring(6),a=new Date(t);renderDate.render(a)}}function day_init(){updateDateView(),toggleHomeView()}function setUserStateText(e){e&&($("span.user-state").removeClass("in out").addClass(e.toLowerCase()),$("span.user-state").get(0).innerText=e)}function setupStrictButton(e,t){e.children("span.ti-btn-lbl").get(0).innerText=t,e.addClass(t===ENTRY_IN?"btn-primary":"btn-warning swip-out"),e.removeClass(t===ENTRY_OUT?"btn-primary":"btn-warning swip-out")}function toggleStrictButton(e,t){if(e){var a=storageHelper.get(KEY_UC_STATE);return setupStrictButton(e,!!t&&(a===ENTRY_IN?ENTRY_OUT:ENTRY_IN)||a),a}}function page_init(){day_init(),$(".edit-list, .edit-close, .clear-all, .select-all, .delete-date-list, .goback").hide(),renderTimes();var e=getUserSettings();$(".inTimeAutoRunYes").toggleClass("active",e.inTimeAutoRunner),$(".inTimeAutoRunNo").toggleClass("active",!e.inTimeAutoRunner)}function app_in_time_init(){page_init(),renderDateListModal()}storageHelper.set(KEY_UC_DATE,KEY_DATE_ENTRIES),$(function(){app_in_time_init()});
//# sourceMappingURL=scripts.ab5117f3.js.map