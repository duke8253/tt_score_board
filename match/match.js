'use strict'

const match_id = window.location.pathname.split('/')[2];

if(typeof(EventSource) !== 'undefined') {
  // Yes! Server-sent events support!
  var source = new EventSource('/match/' + match_id);
  source.onmessage = function(event) {
    var recv = JSON.parse(event.data);
    changeScore(recv['for'], recv['data'])
  };
} else {
  // Sorry! No server-sent events support..
  document.body.innerHTML = 'Server-Sent Events not supported...<br>';
}

function changeScore(score_id, score_val) {
  var score = document.getElementById(score_id);
  score.innerText = score_val;
}