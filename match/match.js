'use strict'

const match_id = window.location.pathname.split('/')[2];
const fetch_path_score = '/score/' + match_id;

window.onload = function() {
  fetch(fetch_path_score, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }).then(function(res) {
    if(res.ok) {
      console.log('On load.');
      res.json().then(function(data) {
        console.log(data);
        for (var key in data) {
          if (data[key] != null) {
            document.getElementById(key).innerText = data[key];
          }
        }
      });
      return;
    }
    throw new Error('Request failed.');
  }).catch(function(err) {
    console.log(err);
  });
};

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