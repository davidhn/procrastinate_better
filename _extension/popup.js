$(function() {

  chrome.storage.sync.get('procrastinate_better', function(result) {
      var currentStatus = result.procrastinate_better['pb_status'];
      if (currentStatus === 'on') {
        $('#pb-pause-btn').css('display', 'block');
      } else if (currentStatus === 'paused') {
        $('#pb-activate-btn').css('display', 'block');
      }
  })

  $("#pb-pause-btn").on("click", function(val) {
    changeStatus('paused')
  });

  $("#pb-activate-btn").on("click", function(val) {
    changeStatus('on')
  });


  $('#toggleAlarm').on('click', function() {
    chrome.alarms.create('Reactivate In 15 Min', { 'delayInMinutes': 0.5 });
    startTimer();
  })


});


chrome.alarms.onAlarm.addListener(function( alarm ) {
  console.log("Got an alarm!", alarm);
});



// pause button
// on click
// update pb_status to off
// start a 15 min timer where pb_status gets updated back on
// show confirmation message that something happened


function changeStatus(status) {
  chrome.storage.sync.get('procrastinate_better', function(result) {
    result.procrastinate_better['pb_status'] = status;
    chrome.storage.sync.set({'procrastinate_better': result.procrastinate_better}, function() {
      console.log(result.procrastinate_better);
      setTimeout(function() {
        window.close();
      }, 100)

    })
  })
}

function startTimer() {
  var presentTime = $('#time-remaining').html();
  var timeArray = presentTime.split(/[:]+/);
  var m = timeArray[0];
  var s = checkSecond((timeArray[1] - 1));
  if(s==59){m=m-1}
  //if(m<0){alert('timer completed')}
  
  $('#time-remaining').html(m + ":" + s);
    
  setTimeout(startTimer, 1000);
}

function checkSecond(sec) {
  if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
  if (sec < 0) {sec = "59"};
  return sec;
}
















// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });

}


