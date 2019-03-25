'use strict'

console.log('Client-side code running');

const game_score_left_minus = document.getElementById('game-score-left-minus');
const game_score_left_plus = document.getElementById('game-score-left-plus');
const set_score_left_minus = document.getElementById('set-score-left-minus');
const set_score_left_plus = document.getElementById('set-score-left-plus');
const game_score_right_minus = document.getElementById('game-score-right-minus');
const game_score_right_plus = document.getElementById('game-score-right-plus');
const set_score_right_minus = document.getElementById('set-score-right-minus');
const set_score_right_plus = document.getElementById('set-score-right-plus');

game_score_left_minus.addEventListener('click', function(e) {
  changeScore('game-score-left', false);

  fetch('/umpire', {
      method: 'POST',
      body: JSON.stringify({
        data: 'test'
      }),
      headers: {'Content-Type': 'application/json'}
    })
    .then(function(res) {
      if(res.ok) {
        console.log('Click was sent.');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(err) {
      console.log(err);
    });
});

game_score_left_plus.addEventListener('click', function(e) {
  changeScore('game-score-left', true);
});

set_score_left_minus.addEventListener('click', function(e) {
  changeScore('set-score-left', false);
});

set_score_left_plus.addEventListener('click', function(e) {
  changeScore('set-score-left', true);
});

game_score_right_minus.addEventListener('click', function(e) {
  changeScore('game-score-right', false);
});

game_score_right_plus.addEventListener('click', function(e) {
  changeScore('game-score-right', true);
});

set_score_right_minus.addEventListener('click', function(e) {
  changeScore('set-score-right', false);
});

set_score_right_plus.addEventListener('click', function(e) {
  changeScore('set-score-right', true);
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
}
