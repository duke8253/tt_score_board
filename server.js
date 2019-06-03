'use strict'

// TODO: (node:13342) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 message listeners added. Use emitter.setMaxListeners() to increase limit

const express = require('express')
const http    = require('http');
const util    = require('util');
const fs      = require('fs');
const url     = require('url');
const path    = require('path');
const redis   = require('redis');
const bodyParser = require('body-parser')

const port = 8080;

const app = express();

const pub = redis.createClient();
const subs = new Map();

class ServerEvent {
  constructor() {
    this.id = ''
    this.data = '';
  }

  addId(id) {
    this.id = 'id: ' + id + '\n';
  }

  addData(data) {
    var lines = data.split(/\n/);
    for (var i = 0; i < lines.length; ++i) {
      var element = lines[i];
      this.data += 'data: ' + element + '\n';
    }
  }

  payload() {
    var payload = '';
    payload += this.id;
    payload += this.data;
    return payload + '\n';
  }
};

app.use('/match', express.static(path.join(__dirname, '/match')));
app.use('/umpire', express.static(path.join(__dirname, '/umpire')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
  res.send('Table Tennis Utilities!');
  res.end();
});

app.get('/match', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('List of matches:'); // TODO
  res.end();
});

app.get('/match/:match_id', function(req, res) {
  var match_id = req.params['match_id'];
  var channel = 'match-update.' + match_id;
  if (!subs.has(match_id)) {
    subs.set(match_id, redis.createClient());
    subs.get(match_id).subscribe(channel);
  }

  if (req.headers.accept && req.headers.accept == 'text/event-stream') {
    initSSE(req, res);
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(fs.readFileSync(path.join(__dirname, '/match/match.html')));
    res.end();
  }
});

app.get('/umpire', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('List of matches:');  // TODO
  res.end();
});

app.get('/umpire/:match_id', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(fs.readFileSync(path.join(__dirname, 'umpire/umpire.html')));
  res.end();
});

app.post('/umpire/:match_id', function(req, res) {
  var channel = 'match-update.' + req.params['match_id'];
  pub.publish(channel, JSON.stringify(req.body));
  pub.hset([channel, req.body['for'], req.body['data']]);

  res.end();
});

app.get('/score/:match_id', function(req, res) {
  var channel = 'match-update.' + req.params['match_id'];
  pub.hmget(channel,
            [
              'game_score_left',
              'set_score_left',
              'game_score_right',
              'set_score_right'
            ],
            function(err, reply) {
    res.send({
      'game_score_left': reply[0],
      'set_score_left': reply[1],
      'game_score_right': reply[2],
      'set_score_right': reply[3]
    });
  });
});

app.listen(port, function() {
  console.log('server listening on port: ' + port);
});

function initSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  var id = (new Date()).toLocaleTimeString();
  var match_id = req.params['match_id'];

  subs.get(match_id).on('message', function(channel, message) {
    var messageEvent = new ServerEvent();
    messageEvent.addId(id);
    messageEvent.addData(message);
    sendSSE(res, messageEvent.payload());
  });
}

function sendSSE(res, payload) {
  res.write(payload);
}
