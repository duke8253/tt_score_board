'use strict'

if(typeof(EventSource) !== 'undefined') {
  // Yes! Server-sent events support!
  var source = new EventSource('/match');
  source.onmessage = function(event) {
    document.body.innerHTML += event.data + '<br>';
  };
} else {
  // Sorry! No server-sent events support..
  document.body.innerHTML = 'Server-Sent Events not supported...<br>';
}
