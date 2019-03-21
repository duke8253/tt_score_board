console.log('Client-side code running');

const button = document.getElementById('myButton');
button.addEventListener('click', function(e) {
  console.log('button was clicked');

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
