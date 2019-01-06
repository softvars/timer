$('.inTimeAppResetBtn').on('click', '.proceed-btn', function(e){
  $(this).hide();
  var resetWait = $('.resetWait');
  var resetBtn = $('.reset-btn');
  var countDown = 5;
  resetWait.html(countDown);
  resetBtn.show();
  resetWait.show();
  var resetWaitAnchor = setInterval(function(){
    --countDown && resetWait.html(countDown);
    !countDown && clearInterval(resetWaitAnchor);
  }, 1000)
  setTimeout(function(){
    clearInterval(resetWaitAnchor);
    //resetWait.hide();
    resetWait.html('');
    resetWait.removeClass('badge').addClass('glyphicon glyphicon-trash');
    resetBtn.attr('disabled', false);
  }, 5000);
});

$('.inTimeAppResetBtn').on('click', '.reset-btn', function(e){
  storageHelper.clear();
  showAlert({
    msg: 'Application reset completed, All data removed!'
  });
  setTimeout(function() {
    //window && window.location && window.location.reload()
    renderTimes();
    toggleHomeView();
  }, 800);
});

var inTimeAutoRunInfo = null;
$('#mySettingsModal').on('hidden.bs.modal', function (event) {
  //clearTimeout(inTimeAutoRunInfo);
  $('.inTimeAppResetBtn .proceed-btn').show();
  $('.reset-btn').attr('disabled', 'disabled').hide();
  var resetWait = $('.resetWait');
  resetWait.removeClass('glyphicon glyphicon-trash').addClass('badge');
  var appAlert = $('div#inTimeAppAlert');
  appAlert.hide();
});

$('.app-info.inTimeAutoRunInfo').on('click', 'span', function(){
  inTimeAutoRunInfo = showAlert({
    msg: 'Touching over IN time total in main screen, Also toggles this auto timer preference.',
    type: 'info',
    delay: 5000
  });
});