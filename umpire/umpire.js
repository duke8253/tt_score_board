'use strict'

console.log('Client-side code running');

const match_id = window.location.pathname.split('/')[2];
const fetch_path_click = '/umpire/' + match_id;
const fetch_path_score = '/score/' + match_id;

const game_score_left_minus = document.getElementById('game_score_left_minus');
const game_score_left_plus = document.getElementById('game_score_left_plus');
const set_score_left_minus = document.getElementById('set_score_left_minus');
const set_score_left_plus = document.getElementById('set_score_left_plus');
const game_score_right_minus = document.getElementById('game_score_right_minus');
const game_score_right_plus = document.getElementById('game_score_right_plus');
const set_score_right_minus = document.getElementById('set_score_right_minus');
const set_score_right_plus = document.getElementById('set_score_right_plus');

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

game_score_left_minus.addEventListener('click', function(e) {
  var score = changeScore('game_score_left', false);

  fetch(fetch_path_click, {
    method: 'POST',
    body: JSON.stringify({
      for: 'game_score_left',
      data: score
    }),
    headers: {'Content-Type': 'application/json'}
  }).then(function(res) {
    if(res.ok) {
      console.log('Click was sent.');
      return;
    }
    throw new Error('Request failed.');
  }).catch(function(err) {
    console.log(err);
  });
});

game_score_left_plus.addEventListener('click', function(e) {
  var score = changeScore('game_score_left', true);

  fetch(fetch_path_click, {
    method: 'POST',
    body: JSON.stringify({
      for: 'game_score_left',
      data: score
    }),
    headers: {'Content-Type': 'application/json'}
  }).then(function(res) {
    if(res.ok) {
      console.log('Click was sent.');
      return;
    }
    throw new Error('Request failed.');
  }).catch(function(err) {
    console.log(err);
  });
});

set_score_left_minus.addEventListener('click', function(e) {
  var score = changeScore('set_score_left', false);

  fetch(fetch_path_click, {
    method: 'POST',
    body: JSON.stringify({
      for: 'set_score_left',
      data: score
    }),
    headers: {'Content-Type': 'application/json'}
  }).then(function(res) {
    if(res.ok) {
      console.log('Click was sent.');
      return;
    }
    throw new Error('Request failed.');
  }).catch(function(err) {
    console.log(err);
  });
});

set_score_left_plus.addEventListener('click', function(e) {
  var score = changeScore('set_score_left', true);

  fetch(fetch_path_click, {
    method: 'POST',
    body: JSON.stringify({
      for: 'set_score_left',
      data: score
    }),
    headers: {'Content-Type': 'application/json'}
  }).then(function(res) {
    if(res.ok) {
      console.log('Click was sent.');
      return;
    }
    throw new Error('Request failed.');
  }).catch(function(err) {
    console.log(err);
  });
});

game_score_right_minus.addEventListener('click', function(e) {
  var score = changeScore('game_score_right', false);

  fetch(fetch_path_click, {
    method: 'POST',
    body: JSON.stringify({
      for: 'game_score_right',
      data: score
    }),
    headers: {'Content-Type': 'application/json'}
  }).then(function(res) {
    if(res.ok) {
      console.log('Click was sent.');
      return;
    }
    throw new Error('Request failed.');
  }).catch(function(err) {
    console.log(err);
  });
});

game_score_right_plus.addEventListener('click', function(e) {
  var score = changeScore('game_score_right', true);

  fetch(fetch_path_click, {
    method: 'POST',
    body: JSON.stringify({
      for: 'game_score_right',
      data: score
    }),
    headers: {'Content-Type': 'application/json'}
  }).then(function(res) {
    if(res.ok) {
      console.log('Click was sent.');
      return;
    }
    throw new Error('Request failed.');
  }).catch(function(err) {
    console.log(err);
  });
});

set_score_right_minus.addEventListener('click', function(e) {
  var score = changeScore('set_score_right', false);

  fetch(fetch_path_click, {
    method: 'POST',
    body: JSON.stringify({
      for: 'set_score_right',
      data: score
    }),
    headers: {'Content-Type': 'application/json'}
  }).then(function(res) {
    if(res.ok) {
      console.log('Click was sent.');
      return;
    }
    throw new Error('Request failed.');
  }).catch(function(err) {
    console.log(err);
  });
});

set_score_right_plus.addEventListener('click', function(e) {
  var score = changeScore('set_score_right', true);

  fetch(fetch_path_click, {
    method: 'POST',
    body: JSON.stringify({
      for: 'set_score_right',
      data: score
    }),
    headers: {'Content-Type': 'application/json'}
  }).then(function(res) {
    if(res.ok) {
      console.log('Click was sent.');
      return;
    }
    throw new Error('Request failed.');
  }).catch(function(err) {
    console.log(err);
  });
});

function changeScore(score_id, plus_one) {
  var score = document.getElementById(score_id);
  var score_int = parseInt(score.innerText);

  if (isNaN(score_int)) {
    score.innerText = '0';
  }

  if (plus_one) {
    score.innerText = String(score_int + 1);
  } else if (score_int > 0) {
    score.innerText = String(score_int - 1);
  }

  return score.innerText;
}
