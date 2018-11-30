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
  /* setTimeout(function() {
    window && window.location && window.location.reload()
  }, 100); */
  showAlert({
      msg: 'Application reset completed, All data removed!'
  });
});

$('#mySettingsModal').on('hidden.bs.modal', function (event) {
  $('.inTimeAppResetBtn .proceed-btn').show();
  $('.reset-btn').attr('disabled', 'disabled').hide();
  var resetWait = $('.resetWait');
  resetWait.removeClass('glyphicon glyphicon-trash').addClass('badge');
});
